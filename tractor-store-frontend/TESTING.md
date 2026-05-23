# Testing

## Unit tests (Jest)

Jest is configured via `@nx/jest` with `jest-preset-angular`.

**Cart store** — `packages/shared-catalog/src/lib/stores/cart.store.spec.ts`

- Loads cart/mini from HTTP test harness
- Asserts `checkout:cart-updated` is dispatched after `addItem`

**Component** — `packages/ts-design-system/src/lib/ts-cart-counter/ts-cart-counter.component.spec.ts`

- Listens for `checkout:cart-updated` and updates the displayed count

Run:

```bash
pnpm test:cart
# or all unit tests
pnpm test
```

## E2E (Playwright)

Project: `apps/shell-e2e`

Spec: `purchase-flow.spec.ts` — home → product → add to cart → checkout → thank you.

The config starts shell + three remotes in parallel. MSW is enabled in the shell dev build, so no backend is required for the default flow.

```bash
pnpm e2e
```

Optional: point at a real API by setting `useMsw: false` in `apps/shell/src/environments/environment.ts` and running the backend on port 8080.

Environment:

- `BASE_URL` — override host (default `http://localhost:4200`)
- `CI=true` — do not reuse an existing dev server

## MSW (manual / Storybook)

Handlers live in `tools/msw-handlers`. The shell calls `startBrowserMsw()` when `environment.useMsw` is true.

To register the service worker file once:

```bash
npx msw init apps/shell/src/assets --save
```

## Affected (CI)

```bash
pnpm affected
```

Uses `namedInputs` / `targetDefaults` in `nx.json` for cacheable `build`, `test`, and `lint`.
