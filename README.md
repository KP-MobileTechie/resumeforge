# resumeforge

[![CI](https://github.com/KP-MobileTechie/resumeforge/actions/workflows/ci.yml/badge.svg)](https://github.com/KP-MobileTechie/resumeforge/actions/workflows/ci.yml)

Build a clean résumé in the browser and export it to a real PDF. Fill a structured form,
watch a live A4 preview update as you type, switch between four print-ready themes, and
download with one click. No sign-up, no backend, your data stays in your browser.

<!-- TODO(manual): record demo GIF with ScreenToGif and replace this line -->

**Live demo:** https://resumeforge-five-sigma.vercel.app

## Features

| | |
|---|---|
| 📝 **Structured form** | Profile, experience, education, projects, skills, with add / remove / reorder / duplicate |
| 📄 **Live A4 preview** | A true 210x297mm page that updates as you type |
| 🎨 **Four themes** | Classic (serif), Modern (accent rule), Compact (two-column skills), Minimal (monochrome) |
| 🖨 **Real PDF export** | Browser print-to-PDF: selectable text, embedded fonts, vector crisp, ATS-parseable |
| 🔁 **JSON export / import** | Back up your résumé data to a file and load it on any device, no account |
| 💾 **Autosave** | Everything persists to localStorage, no account needed |
| ♿ **Accessible** | Keyboard operable, labelled fields, respects reduced-motion |

## How it works

The trick is that the live preview IS the PDF. There is no canvas capture and no PDF
library. The on-screen A4 page is real CSS geometry, and a print stylesheet turns it into
the export:

- `.resume-page` is sized in millimetres (`210mm` x `297mm`) and `@page { size: A4; margin: 0 }`
- `@media print` hides the form and top bar (`.no-print`) and resets the on-screen scale so
  the page prints at true size
- `print-color-adjust: exact` keeps theme accent colors in the PDF
- `break-inside: avoid` on each entry stops a job or project from splitting across pages

Because the output is rendered text rather than a rasterized image, it stays sharp at any
zoom and is readable by the keyword scanners (ATS) that most companies run résumés through,
which is exactly where screenshot-based exporters fall down.

The résumé is a single typed object (`lib/resume.ts`) driven by a reducer
(`hooks/useResume.ts`); themes are token sets (`lib/themes.ts`) that re-render the same data,
so switching themes never loses anything.

## Decisions

- **Print CSS over canvas or pdf-lib.** Canvas capture rasterizes text (fuzzy, unsearchable,
  invisible to ATS). pdf-lib means rebuilding the whole layout twice and watching them drift.
  A print stylesheet keeps one source of truth and produces genuine vector PDFs.
- **Structured form over a markdown editor.** Typed sections map cleanly to themes and
  validation, and they are far more approachable for a non-technical visitor.
- **Token-driven themes over per-theme layouts.** A theme is data (fonts, accent, density),
  so adding one is cheap and the data model never forks.

## Project structure

```
app/page.tsx            workbench: form panel + live preview, top bar
app/globals.css         app theme tokens + the A4 print stylesheet
lib/resume.ts           Resume type, empty + sample data            (pure)
lib/themes.ts           theme token registry                        (pure)
lib/storage.ts          versioned localStorage (sole storage access)
hooks/useResume.ts      reducer: edits, reorder, theme, sample, reset
components/form/         form panel and reusable entry lists
components/preview/      A4 preview and the four theme renderers
lib/transfer.ts          JSON export / import of résumé data          (pure)
tests/lib/              26 Vitest tests (model, storage, themes, reducer, transfer)
```

## Run locally

```bash
npm install
npm run dev    # http://localhost:3000
npm test       # 18 tests
```

## Stack

Next.js (App Router) · TypeScript · Tailwind CSS · Framer Motion · Vitest

## License

[MIT](LICENSE)
