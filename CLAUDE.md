# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Critical: non-standard Next.js

This project runs **Next.js 16.2.7 + React 19.2 + Tailwind v4** (App Router, Turbopack by default). As `AGENTS.md` warns, this version has breaking changes versus older Next.js knowledge. **Read the relevant guide under `node_modules/next/dist/docs/` before writing framework code.** Notably:

- `params` / `searchParams` in pages and layouts are **`Promise`s** — always `await` them.
- `middleware` is renamed to `proxy`; `next lint` is removed (use `eslint` directly).
- See `node_modules/next/dist/docs/01-app/02-guides/upgrading/version-16.md` for the full breaking-change list.

## Commands

```bash
npm run dev      # dev server (Turbopack) at http://localhost:3000
npm run build    # production build — also runs type-check + static generation
npm run start    # serve the production build
npm run lint     # ESLint (flat config, eslint.config.mjs)
npx tsc --noEmit # type-check only (fast feedback during edits)
```

There is no test setup in this repo yet.

## Architecture

A bookmark service ("한입 링크"). The defining pattern is a **shared shell in the root layout**:

- `app/layout.tsx` renders `<Header />` + `<Sidebar />` once and wraps every page's content. **Pages render only their main content area** (`<main>…</main>`), never the header or sidebar.
- `components/Sidebar.tsx` is **navigation-driven**, not state-driven: each item is a `next/link` (`/` for all links, `/folder/[id]` per folder) and the active item is derived from `usePathname()`. It reads folders/links directly from mock data — no props.
- `components/LinkSection.tsx` ("title + count + grid") is the shared body used by both the index and folder pages, guaranteeing identical grid presentation. It composes `LinkGrid` → `LinkCard`.

### Routes (`app/`)

- `/` (`page.tsx`) — all links via `LinkSection`.
- `/folder/[folderId]` — filters links by folder; `notFound()` for unknown ids; uses `generateStaticParams` so folder pages are prerendered (SSG).
- `/new` — main content is `NewLinkForm` (client component with the only interactive form state).

### Conventions

- Path alias `@/*` maps to the repo root (see `tsconfig.json`). Import components as `@/components/X` and data as `@/app/lib/mock-data`.
- All data is in-memory mock data at `app/lib/mock-data.ts` (`Folder` / `LinkItem` types + `folders` / `links` arrays). There is no backend; "save" actions are UI demos (`alert` + redirect).
- Default to Server Components; add `"use client"` only for interactivity (`Sidebar` needs `usePathname`, `NewLinkForm` needs form state).
- Styling is Tailwind v4 utility classes inline; dark mode via `dark:` variants. No component library.
