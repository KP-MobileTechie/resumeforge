# resumeforge — Design Spec

**Date:** 2026-04-16
**Status:** Approved (brainstorming session)
**Repo:** `D:\Projects\resumeforge` · Deploy target: Vercel · Public GitHub repo (`KP-MobileTechie/resumeforge`)

## Summary

A résumé builder with a structured form on the left and a live A4 preview on the right. Users fill in profile, experience, education, skills, and projects; pick one of three themes; and export to PDF straight from the browser's print dialog. The live preview IS the print output: a precise print stylesheet turns the on-screen A4 page into a selectable-text, vector-crisp, ATS-parseable PDF with no canvas capture and no PDF library. All data persists in localStorage. No backend.

Portfolio goals: print-CSS mastery (the technical centerpiece almost no junior demonstrates), structured typed-data modeling with a reducer, and a genuinely useful tool every visitor will try. Fourth project in the six-project portfolio plan.

## Decisions (locked)

| Decision | Choice | Rationale |
|---|---|---|
| PDF export | Browser print-to-PDF via a print stylesheet | The preview is the output: selectable text, real fonts, vector-crisp, ATS-parseable, zero dependencies. Canvas capture rasterizes text; pdf-lib duplicates the whole layout. The print CSS is the interview story. |
| Input mode | Structured form (profile, experience, education, skills, projects) | Maps to typed data, drives the preview, easy to validate, approachable for visitors. Add/remove/reorder entries. |
| Visual style | Light "workbench": form panel left, A4 page floating on grey canvas right | Productivity-tool feel, distinct from keyflow (terminal), dropfour (glass), snapfolio (gallery). The résumé page is the star. |
| Themes | 3 swappable token sets: Classic (serif), Modern (sans + accent rule), Compact (dense, two-column skills) | A theme is data + renderer choice; avoid layout duplication where possible. |
| State | Single `useReducer` resume hook | One résumé + theme selection; no state library (YAGNI). |
| Persistence | localStorage only, debounced, versioned schema | Zero backend/secrets; same safe-wrapper pattern as prior projects. |
| Stack | Next.js App Router + TypeScript + Tailwind + Framer Motion + Vitest | Portfolio-consistent. |
| Commit dates | Only Apr 16, 17, 18, 20, 21, 23, 25 (2026), author `krunal85 <kp587372@gmail.com>`, no AI attribution | Project owner's instruction. |

## Architecture

```
app/layout.tsx            fonts (sans + serif for themes), metadata, OG
app/page.tsx              workbench: FormPanel ⇄ ResumePreview, TopBar
app/globals.css           app theme tokens + the print stylesheet (@page, @media print)
lib/resume.ts             Resume type + section types; emptyResume(); sampleResume()        (pure)
lib/storage.ts            localStorage read/write, versioned schema, safe wrapper (sole storage toucher)
lib/themes.ts             theme registry: id, label, font tokens, accent, density, renderer key   (pure)
hooks/useResume.ts        reducer: field updates, add/remove/reorder entries, setTheme, load sample, reset
components/TopBar.tsx      theme switcher, Download PDF, Load sample, Reset
components/form/
  FormPanel.tsx           scroll container composing the section forms
  ProfileForm.tsx         name, title, contact, summary
  EntryListForm.tsx       generic add/remove/reorder list (reused by experience/education/projects)
  SkillsForm.tsx          grouped skills (category + items)
components/preview/
  ResumePreview.tsx       the A4 .resume-page; selects a theme renderer; placeholders when empty
  themes/ClassicTheme.tsx
  themes/ModernTheme.tsx
  themes/CompactTheme.tsx
tests/                    resume reducer, storage, theme tokens, sample validity (~20 tests)
.github/workflows/ci.yml  test + build
```

**Resume type (shared):**
```
Resume {
  profile: { name, title, email, phone, location, website, summary }
  experience: { id, role, company, start, end, location, bullets: string[] }[]
  education:  { id, degree, school, start, end, details }[]
  projects:   { id, name, link, description, bullets: string[] }[]
  skills:     { id, category, items: string[] }[]
  themeId: string
}
```

**Data flow:** form edits → `useResume` reducer → typed `Resume` → debounced `storage.save` AND `ResumePreview`. The preview renders the data under the selected theme renderer. Export = `window.print()`; the print stylesheet hides app chrome and prints only `.resume-page`.

**Unit boundaries:** `lib/resume.ts` and `lib/themes.ts` are pure and unit-tested. `lib/storage.ts` is the only localStorage toucher. Theme renderers consume `Resume` + theme tokens; they never touch state or storage. `EntryListForm` is generic so experience/education/projects share one add/remove/reorder implementation.

## The print-CSS centerpiece (README "how it works")

- A4 geometry in CSS: `.resume-page { width: 210mm; min-height: 297mm }`; `@page { size: A4; margin: 0 }`
- `print-color-adjust: exact` (+ `-webkit-`) so theme accent colors survive printing
- Page-break control: `break-inside: avoid` on each entry so a job/role never splits across a page boundary; section headings use `break-after: avoid`
- On screen the page is CSS-scaled to fit the grey canvas; `@media print` resets scale to true size and hides everything except `.resume-page`
- Result: selectable text, embedded real fonts, vector output — crisp at any zoom and parseable by ATS keyword scanners (the failure mode of canvas-capture exporters)

## Themes

Three renderers driven by a token set in `lib/themes.ts` (font family pair, accent color, heading style, vertical density, skills layout):
- **Classic** — serif headings, conservative, single column, understated
- **Modern** — sans, colored accent rule under the name and section headings
- **Compact** — dense spacing, two-column skills block, fits more on one page

Switching themes only changes `themeId`; the same `Resume` data re-renders. No data loss on switch.

## Key behaviors

- Live preview updates as the user types (no apply button)
- Add / remove / reorder (up/down) entries in experience, education, projects; reorder at list boundaries is a no-op
- Load sample fills a realistic résumé; Reset clears to empty (with confirm)
- Theme switch is instant and persisted
- Download PDF triggers the browser print dialog with the print stylesheet applied
- `prefers-reduced-motion` respected for any panel/entry animations

## Error handling / edge cases

- localStorage unavailable or corrupt → app runs in-memory, notice shown, no crash
- Empty résumé → preview shows tasteful placeholder text; printing still produces a valid (mostly empty) page
- Long content → page-break rules keep entries intact; overflow flows to page 2+
- Reorder beyond first/last → no-op
- Invalid stored schema/version → falls back to empty résumé

## Testing (Vitest, ~20 tests)

- `resume.ts` reducer logic via `useResume`'s pure reducer: field update, add entry, remove entry, reorder up/down, reorder at boundaries (no-op), setTheme, loadSample, reset
- `storage.ts`: round-trip, corrupt JSON fallback, version mismatch fallback, storage-unavailable no-op
- `themes.ts`: every theme has a complete token set; themeIds unique; default theme exists
- `sampleResume()`: non-empty in every section, valid shape

Print rendering and visual layout are verified manually and in the live demo, not unit-tested.

## Out of scope (v2 candidates)

Multiple résumés/versions, cover letters, import from LinkedIn/JSON Resume, AI bullet rewriting, cloud sync/accounts, custom theme editor, multi-page page-number footers.

## Delivery

Public repo `KP-MobileTechie/resumeforge`, Vercel deploy, OG metadata, README with demo GIF placeholder, "How it works" (print CSS pipeline), "Decisions" (print CSS over canvas/pdf-lib; structured form over markdown; token-driven themes over per-theme layouts). Lighthouse ≥ 95 target. Commits only on Apr 16/17/18/20/21/23/25 2026, author krunal85, zero AI attribution.
