# Copilot instructions (train-fare)

## Project overview
- Small static web app: **Vue 2.7 (Options API) + Vite**.
- Single-screen UI lives in [src/app.vue](src/app.vue); app mounts from [src/main.js](src/main.js) into `#vue-root` defined in [index.html](index.html).
- Deployed to **GitHub Pages**; Vite is configured with `base: './'` in [vite.config.js](vite.config.js) so assets use relative URLs.

## Key domain logic (fare calculation)
- The calculated output is driven by `computed` properties:
  - `formula`: returns a human-readable expression string.
  - `amount`: performs numeric calculation and formats with `currency-formatter` (`ja-JP`).
- Rounding rule is `floor10()` (round down to nearest 10 yen) implemented as a method in [src/app.vue](src/app.vue).
- Discount eligibility is expressed as validity flags:
  - `isTwoWayDiscountInvalid` depends on `useTwoWayDiscount` + checkboxes.
  - `isStudentDiscountInvalid` depends on `useStudentDiscount` + checkboxes.
  - `showWarning` is the OR of those invalid flags.
- When a parent toggle is turned off, dependent toggles/checks are reset via `watch` handlers (see [src/app.vue](src/app.vue)). Keep this “reset on disable” behavior consistent if you add new options.

## Conventions to follow in changes
- Prefer **Options API** (`data`, `computed`, `watch`, `methods`) — do not introduce Composition API patterns unless refactoring the whole component.
- Keep UI markup using **Bootstrap 3** classes (imported in [src/main.js](src/main.js)). Don’t introduce new CSS frameworks.
- Keep `formula` and `amount` logic in sync: if you change the calculation, update both.
- External scripts: Google Analytics `gtag` is loaded in [index.html](index.html) and declared as a global in ESLint config. Don’t move it into Vue unless necessary.

## Developer workflows
- Install: `npm install`
- Dev server: `npm run dev` (Vite, default http://localhost:5173)
- Production build: `npm run build`
- Preview build: `npm run preview`
- Deploy (GitHub Pages): `npm run deploy` (publishes `dist/`)
- Linting: ESLint is configured via the flat config in [eslint.config.js](eslint.config.js). There is currently **no** `npm run lint` script; run `npx eslint .`.

## Where to put new code
- If logic grows, extract pure helpers (e.g., fare math / eligibility checks) into `src/` and import them into [src/app.vue](src/app.vue). Keep helpers dependency-free and unit-testable if tests are introduced later.
