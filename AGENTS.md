# Repository Guidelines

## Project Structure & Module Organization

This is a Svelte 4 and SvelteKit 2 expense-tracking PWA, built with TypeScript and Vite. Routes live in `src/routes/`, including the main page and `/install`; follow SvelteKit conventions such as `+page.svelte`, `+page.ts`, and `+layout.svelte`. Shared UI components belong in `src/lib/components/`, stores in `src/lib/store/`, and utilities and messaging code in `src/lib/` and `src/lib/api/`.

`src/service-worker.js` handles asset caching, IndexedDB persistence, and Google Sheets synchronization. Static icons, screenshots, and the PWA manifest live in `static/`; imported images live in `src/lib/images/`. Production output goes to `build/`, and generated SvelteKit files go to `.svelte-kit/`; do not edit generated output.

## Build, Test, and Development Commands

- `npm ci`: install dependencies from `package-lock.json`.
- `npm run dev`: start the Vite development server with network access enabled.
- `npm run check`: synchronize SvelteKit types and run Svelte/TypeScript checks.
- `npm run check:watch`: continuously run those checks while editing.
- `npm run lint`: check Prettier formatting and run ESLint.
- `npm run format`: apply repository-wide Prettier formatting; review the resulting diff.
- `npm run build`: produce the prerendered static site in `build/`.
- `npm run preview`: serve the production build locally.

## Coding Style & Naming Conventions

Use two-space indentation, single quotes, no trailing commas, and a 100-character line width, as configured by Prettier. ESLint includes TypeScript and Svelte rules; TypeScript strict mode is enabled. Use PascalCase component filenames, such as `ExpenseCounter.svelte`, camelCase functions and variables, and descriptive lowercase utility filenames. Prefer `$lib` imports for shared modules.

## Testing Guidelines

No automated test suite, test runner, or coverage threshold is currently configured. Before submitting changes, run `npm run check`, `npm run lint`, and `npm run build`. Manually verify affected flows, particularly recording expenses, offline persistence, reconnection and Sheets synchronization, and the install page. Use a test spreadsheet when exercising synchronization.

## Commit & Pull Request Guidelines

Recent commits use short, descriptive subjects such as “Added install page” and “Fixed idb issue in sw side”; no enforced prefix convention is evident. Keep commits focused. Pull requests should explain the change, link relevant issues, list validation performed, and include screenshots for UI changes. Call out changes to service-worker caching, stored data, or spreadsheet configuration explicitly.
