# Voicework — Voice-to-Invoice for Trade Workers

Next.js (App Router) + TypeScript front-end prototype. Speak a job note, get a
ready-to-send invoice.

**UI only.** No database, no authentication, no real speech-to-text. The
transcript and line items come from four sample jobs in `src/data/jobs.ts`.
What *is* real: the microphone waveform (Web Audio API), the PDF download
(jsPDF), and the WhatsApp / email share links.

## Setup

Requires Node.js 18.18+ (20 LTS recommended).

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts:

```bash
npm run build      # production build
npm run start      # serve the production build
npm run lint       # ESLint (next/core-web-vitals + next/typescript)
npm run typecheck  # tsc --noEmit
npm run format     # Prettier (with Tailwind class sorting)
```

The mic waveform needs a secure context (`localhost` or `https`). Elsewhere it
falls back to an animated preview and the rest of the flow still works.

## Packages

| Package | Why |
|---|---|
| `next`, `react` | App Router, server components for the landing page |
| `typescript` (strict, `noUncheckedIndexedAccess`) | Type safety |
| `tailwindcss` v3 | Styling, design tokens in `tailwind.config.ts` |
| `zustand` | Demo flow state (one small store, no provider needed) |
| `react-hook-form` + `zod` + `@hookform/resolvers` | Details form + validation schema |
| `@radix-ui/react-dialog` | Accessible modal (focus trap, Esc, aria) |
| `framer-motion` | Step transitions (respects reduced motion) |
| `sonner` | Toasts |
| `jspdf` | Client-side PDF (lazy-loaded) |
| `lucide-react` | Icons |
| `class-variance-authority`, `clsx`, `tailwind-merge` | Variant-driven components |

## Structure

```
src/
├── app/                  Next.js routes, layout, global CSS, fonts
├── components/
│   ├── ui/               Generic primitives (Button, Input)
│   ├── landing/          Landing page sections (server components)
│   └── demo/             Interactive demo (client components)
│       └── steps/        One file per demo step
├── data/                 Static data (sample jobs, step list)
├── hooks/                useAudioRecorder, useInvoiceData
├── lib/                  Pure logic: invoice math, formatting, pdf, share, schemas
├── store/                Zustand store (demo state + actions)
└── types/                Shared domain types
```

Conventions: pure logic lives in `lib/` (no React), state in `store/`, side
effects in `hooks/`, components stay presentational. Landing sections are
server components; only interactive pieces are `'use client'`.

## Where the backend plugs in

| Prototype | Replace with |
|---|---|
| `data/jobs.ts` transcript | Speech-to-text API (route handler / server action) |
| `data/jobs.ts` line items | LLM extraction from the transcript |
| Seeded client / business | Saved profiles from a database |
| `lib/pdf.ts` (browser) | Server-side PDF generation |
| `lib/share.ts` links | WhatsApp Business API / email provider |
| No auth | Auth.js / Clerk / similar |

Add secrets to `.env.local` (see `.env.example`); never commit them.

## Notes

- Audio is never recorded or uploaded — only frequency levels are read to draw
  the waveform.
- Invoice numbers are generated on the client when the demo opens to avoid
  hydration mismatches.
