# Pubbets Workshop agent guide

## Setup

- Install dependencies with `npm ci`.
- Do not commit `.env` files or credentials. Use `.env.example` for documented placeholders.

## Verification

- Run the complete check with `npm run check`.
- Run tests alone with `npm test`.
- Create the production bundle with `npm run build`; output is written to `dist/`.

## Project conventions

- Preserve the nine-step mobile-first puppet-building flow unless a task explicitly changes it.
- Treat `docs/PRODUCT_SPEC.md` and `docs/DECISIONS.md` as the product source of truth.
- Keep production artwork under `assets/` and application code under `src/`.
- Do not commit generated `dist/`, coverage output, dependency folders, or secrets.
