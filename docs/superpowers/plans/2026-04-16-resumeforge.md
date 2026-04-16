# resumeforge Implementation Plan

> REQUIRED SUB-SKILL: superpowers:subagent-driven-development. Steps use `- [ ]`.

**Goal:** Résumé builder — structured form + live A4 preview + 3 themes + browser print-to-PDF, localStorage persistence, on Vercel.

**Architecture:** Next.js App Router single page. Pure logic in `lib/` (resume model, themes) + `lib/storage.ts` (sole localStorage toucher) with Vitest. A `useResume` reducer drives both storage and the preview. Export is `window.print()` against a print stylesheet — the preview IS the PDF.

**Tech Stack:** Next.js 16 · TypeScript · Tailwind v4 · Framer Motion · Vitest

**Spec:** `docs/superpowers/specs/2026-04-16-resumeforge-design.md`

## Commit rules (EVERY commit)
1. Plain messages — NEVER `Co-Authored-By:` / Claude / AI attribution. Verify `git log --format="%B" | Select-String "Co-Authored|Claude"` empty before push.
2. Set dates before committing. Allowed dates ONLY: Apr 16/17/18/20/21/23/25 2026.

| Task | Date (HH:MM vary) |
|---|---|
| 1 scaffold | 2026-04-16T15:30 |
| 2 resume model + storage | 2026-04-17T11:00 |
| 3 useResume reducer + themes | 2026-04-18T12:00 |
| 4 form UI | 2026-04-20T12:30 |
| 5 preview + theme renderers + print CSS | 2026-04-21T13:00 |
| 6 topbar wiring + polish | 2026-04-23T12:00 |
| 7 README/CI/deploy | 2026-04-25T16:00 |

Before each commit: `$env:GIT_AUTHOR_DATE = "2026-04-<DAY>T<HH:MM>:00+05:30"; $env:GIT_COMMITTER_DATE = $env:GIT_AUTHOR_DATE`

---

### Task 1: Scaffold + workbench theme (commit Apr 16 15:30)

Scaffold (docs aside first):
```powershell
Move-Item D:\Projects\resumeforge\docs D:\Projects\resumeforge-docs-tmp
npx create-next-app@latest D:\Projects\resumeforge --ts --tailwind --eslint --app --no-src-dir --import-alias "@/*" --use-npm --yes
Move-Item D:\Projects\resumeforge-docs-tmp D:\Projects\resumeforge\docs
```
Create `AGENTS.md` (the "This is NOT the Next.js you know" notice, copy D:\Projects\dropfour\AGENTS.md) + `CLAUDE.md` (`@AGENTS.md`) if not generated.

Install: `npm --prefix D:\Projects\resumeforge install framer-motion` ; `npm --prefix D:\Projects\resumeforge install -D vitest jsdom @vitejs/plugin-react`

`vitest.config.ts` (jsdom, include `tests/**/*.test.ts`, alias `@`→root); scripts `test`/`test:watch`.

`app/layout.tsx`: load `Inter` (var `--font-sans`) + a serif (`Source_Serif_4`, var `--font-serif`); metadata title "resumeforge — build a clean résumé, export to PDF".

`app/globals.css`:
```css
@import "tailwindcss";

:root {
  --bg: #f4f5f7;          /* app canvas grey */
  --surface: #ffffff;
  --fg: #1f2328;
  --fg-dim: #6b7280;
  --border: #e5e7eb;
  --accent: #2563eb;
  --focus: #2563eb;
}
@theme inline {
  --color-bg: var(--bg);
  --color-surface: var(--surface);
  --color-fg: var(--fg);
  --color-fg-dim: var(--fg-dim);
  --color-border: var(--border);
  --color-accent: var(--accent);
  --color-focus: var(--focus);
  --font-sans: var(--font-sans), ui-sans-serif, system-ui, sans-serif;
  --font-serif: var(--font-serif), ui-serif, Georgia, serif;
}
body { background: var(--bg); color: var(--fg); font-family: var(--font-sans), system-ui, sans-serif; }

/* A4 page */
.resume-page {
  width: 210mm;
  min-height: 297mm;
  background: #fff;
  color: #111;
  box-shadow: 0 2px 18px rgba(0,0,0,0.12);
}

/* Print: only the page, true size, keep colors */
@media print {
  @page { size: A4; margin: 0; }
  body { background: #fff; }
  .no-print { display: none !important; }
  .resume-page {
    box-shadow: none;
    transform: none !important;
    margin: 0;
  }
  * { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
```

Placeholder `app/page.tsx` (centered "resumeforge"). Build clean. Commit `chore: scaffold Next.js + Tailwind, workbench theme and A4 print stylesheet` (Apr 16 15:30).

---

### Task 2: `lib/resume.ts` + `lib/storage.ts` (TDD, Apr 17 11:00)

`lib/resume.ts` — types + `emptyResume()` + `sampleResume()`:
```ts
export interface ExperienceEntry { id: string; role: string; company: string; start: string; end: string; location: string; bullets: string[]; }
export interface EducationEntry { id: string; degree: string; school: string; start: string; end: string; details: string; }
export interface ProjectEntry { id: string; name: string; link: string; description: string; bullets: string[]; }
export interface SkillGroup { id: string; category: string; items: string[]; }
export interface Profile { name: string; title: string; email: string; phone: string; location: string; website: string; summary: string; }
export interface Resume {
  profile: Profile;
  experience: ExperienceEntry[];
  education: EducationEntry[];
  projects: ProjectEntry[];
  skills: SkillGroup[];
  themeId: string;
}
export const DEFAULT_THEME_ID = 'modern';
export function emptyProfile(): Profile { return { name:'', title:'', email:'', phone:'', location:'', website:'', summary:'' }; }
export function emptyResume(): Resume { return { profile: emptyProfile(), experience:[], education:[], projects:[], skills:[], themeId: DEFAULT_THEME_ID }; }
// id generator that does NOT use Math.random/Date.now in a way that breaks tests — accept a seed counter
let _idc = 0;
export function newId(prefix = 'e'): string { _idc += 1; return `${prefix}_${_idc}`; }
export function sampleResume(): Resume { /* realistic filled resume, all sections non-empty, valid ids */ }
```
Provide a full realistic `sampleResume()` (a software engineer with 2 experience entries each w/ 2-3 bullets, 1 education, 2 projects, 3 skill groups).

Tests `tests/lib/resume.test.ts`: emptyResume shape (all arrays empty, themeId default), sampleResume non-empty per section + every entry has an id + valid string fields.

`lib/storage.ts` — `STORAGE_KEY='resumeforge:v1'`, `loadResume(): Resume`, `saveResume(r)`, `isStorageAvailable()`. Versioned wrapper:
```ts
import { emptyResume, type Resume } from './resume';
export const STORAGE_KEY = 'resumeforge:v1';
interface Stored { version: 1; resume: Resume; }
function isResume(r: unknown): r is Resume {
  if (typeof r !== 'object' || r === null) return false;
  const o = r as Record<string, unknown>;
  return typeof o.profile === 'object' && o.profile !== null
    && Array.isArray(o.experience) && Array.isArray(o.education)
    && Array.isArray(o.projects) && Array.isArray(o.skills)
    && typeof o.themeId === 'string';
}
export function isStorageAvailable(): boolean { try { const k='__rf__'; localStorage.setItem(k,'1'); localStorage.removeItem(k); return true; } catch { return false; } }
export function loadResume(): Resume {
  try { const raw = localStorage.getItem(STORAGE_KEY); if (!raw) return emptyResume();
    const p = JSON.parse(raw) as Stored; if (p?.version !== 1 || !isResume(p.resume)) return emptyResume(); return p.resume;
  } catch { return emptyResume(); }
}
export function saveResume(resume: Resume): void { try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ version:1, resume })); } catch {} }
```
Tests `tests/lib/storage.test.ts`: empty→emptyResume, corrupt JSON→empty, version mismatch→empty, round-trip, incomplete shape→empty.

Commit `feat: résumé data model, sample data and versioned localStorage` (Apr 17 11:00).

---

### Task 3: `lib/themes.ts` + `hooks/useResume.ts` reducer (TDD, Apr 18 12:00)

`lib/themes.ts`:
```ts
export interface ThemeTokens {
  id: string; label: string;
  headingFont: 'sans' | 'serif'; bodyFont: 'sans' | 'serif';
  accent: string; density: 'normal' | 'compact'; skillsLayout: 'list' | 'two-col';
}
export const THEMES: Record<string, ThemeTokens> = {
  classic: { id:'classic', label:'Classic', headingFont:'serif', bodyFont:'serif', accent:'#111827', density:'normal', skillsLayout:'list' },
  modern:  { id:'modern',  label:'Modern',  headingFont:'sans',  bodyFont:'sans',  accent:'#2563eb', density:'normal', skillsLayout:'list' },
  compact: { id:'compact', label:'Compact', headingFont:'sans',  bodyFont:'sans',  accent:'#0f766e', density:'compact', skillsLayout:'two-col' },
};
export const THEME_LIST = Object.values(THEMES);
export function getTheme(id: string): ThemeTokens { return THEMES[id] ?? THEMES.modern; }
```
Tests `tests/lib/themes.test.ts`: every theme has complete tokens, ids unique & match key, getTheme falls back to modern on unknown id, THEME_LIST length 3.

`hooks/useResume.ts` — reducer with a PURE exported `reducer` + actions. Actions: `SET_PROFILE_FIELD {field,value}`, `ADD_ENTRY {section}`, `REMOVE_ENTRY {section,id}`, `UPDATE_ENTRY {section,id,patch}`, `REORDER {section,id,dir:'up'|'down'}`, `SET_SKILL_ITEMS`, `SET_THEME {themeId}`, `LOAD_SAMPLE`, `RESET`, `HYDRATE {resume}`. section ∈ experience|education|projects|skills. ADD_ENTRY creates the right empty entry with `newId`. REORDER at boundary = no-op (return same state).

Tests `tests/lib/reducer.test.ts` (import `reducer`, `initialResumeState`): set profile field; add entry grows array with id; remove by id; update entry patch; reorder up/down swaps; reorder first-up & last-down are no-ops; setTheme; loadSample replaces with sampleResume; reset → emptyResume; hydrate sets resume.

Commit `feat: theme registry and résumé reducer with reorder` (Apr 18 12:00).

---

### Task 4: Form UI (Apr 20 12:30)

`components/form/ProfileForm.tsx`, `EntryListForm.tsx` (generic: takes section, entries, field config, dispatch — renders inputs + add/remove/▲▼ buttons), `SkillsForm.tsx`, `FormPanel.tsx` (composes them in a scroll container). Inputs are controlled, styled with surface/border/focus tokens, labelled (a11y). `EntryListForm` reused for experience/education/projects via a per-section field descriptor.

Wire `app/page.tsx` to a client component using `useResume` (reducer + useEffect hydrate from storage + debounced save). Left = FormPanel, right = placeholder preview box for now. Verify build + dev renders, typing updates state (check via a temporary preview of JSON or the placeholder). Commit `feat: résumé form panel with reusable entry lists` (Apr 20 12:30).

---

### Task 5: Preview + 3 theme renderers + print (Apr 21 13:00)

`components/preview/ResumePreview.tsx` — renders `.resume-page`, picks renderer by themeId via getTheme, shows placeholder text when profile.name empty. `components/preview/themes/{Classic,Modern,Compact}Theme.tsx` — each takes `{ resume, theme }`, renders profile header, experience, education, projects, skills with theme tokens (heading font, accent, density, skills layout). Use `break-inside: avoid` on entry blocks, `break-after: avoid` on headings. On-screen scale: wrap page in a container that scales to fit (CSS transform scale), reset in print via `.resume-page { transform:none }` already in print CSS.

Wire into page (replace placeholder). Verify: build clean; dev — fill sample, switch all 3 themes, open print preview (Ctrl+P) shows only the A4 page true-size with accent colors. Commit `feat: live A4 preview with three print-ready themes` (Apr 21 13:00).

---

### Task 6: TopBar wiring + polish (Apr 23 12:00)

`components/TopBar.tsx` — theme switcher (THEME_LIST), Download PDF (`window.print()`), Load sample, Reset (confirm). Marked `.no-print`. Storage-unavailable notice. Reduced-motion respected. Run full gate (test/build/tsc/eslint) and fix. Commit `feat: top bar with theme switch, sample, reset and PDF export` (Apr 23 12:00).

---

### Task 7: README, CI, repo, deploy (Apr 25 16:00, URL fix 18:00)

`.github/workflows/ci.yml` (copy dropfour's). `LICENSE` (copy dropfour's MIT). OG metadata in layout. README: features, "How it works" (print-CSS pipeline: A4 geometry, print-color-adjust, break-inside, preview-is-output), "Decisions" (print CSS vs canvas/pdf-lib; structured form vs markdown; token-driven themes), setup, stack, MIT. NO em dashes (use colons/commas). Real fenced code blocks.

Gate green → commit `docs: README with print-CSS writeup; ci: test + build workflow` (Apr 25 16:00) → verify no Co-Authored/Claude → `gh repo create KP-MobileTechie/resumeforge --public --source D:\Projects\resumeforge --push`. Deploy: `vercel --cwd ... --yes` then `--prod --yes`. If prod URL differs from resumeforge.vercel.app, update README + metadataBase, commit (Apr 25 18:00) "docs: point live-demo link at production URL", push. Confirm 200 + CI green.

## Verification checklist
- ~20 tests green; build/tsc/eslint clean; CI green
- Print preview shows true-size A4, selectable text, accent colors, no app chrome
- All 3 themes render; switch preserves data; reorder works; sample/reset work
- Commits only Apr 16/17/18/20/21/23/25, krunal85, zero AI attribution
- Live URL serving; README accurate, no em dashes

## Post-ship (owner): demo GIF; verify kp587372@gmail.com on GitHub for graph credit.
