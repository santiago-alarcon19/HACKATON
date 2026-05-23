# Tractor Store Frontend

Nx monorepo for the [Tractor Store](https://micro-frontends.org/tractor-store/) hackathon — Angular 19 standalone, Module Federation (`@module-federation/enhanced`), signals-based cart store, and a Shadow DOM design system exported as Custom Elements.

## Structure

| Project | Port | Role |
|---------|------|------|
| `apps/shell` | 4200 | Host — loads three remotes |
| `packages/mfe-explore` | 4201 | Home, categories, stores, header/footer + mini-cart |
| `packages/mfe-decide` | 4202 | Product detail, variants, add to cart |
| `packages/mfe-checkout` | 4203 | Cart, checkout form, thank-you page |
| `packages/shared-catalog` | — | Models, API services, `CartStore`, typed MFE events |
| `packages/ts-design-system` | — | `TsButton`, `TsProductCard`, `TsVariantOption`, `TsMiniCart`, `TsCartCounter` |
| `tools/msw-handlers` | — | MSW handlers for offline API |
| `apps/shell-e2e` | — | Playwright E2E |

## Prerequisites

- Node 20+
- [pnpm](https://pnpm.io/) 9+ (`packageManager` is set in `package.json`)
- Backend API at `http://localhost:8080/api` (optional — MSW mocks enabled in dev)

If pnpm fails on your machine:

```bash
npm install
```

## Quick start

```bash
pnpm install
pnpm start
```

Open http://localhost:4200 — MSW mocks the API when `environment.useMsw` is true.

Build all apps:

```bash
pnpm build
```

Unit tests:

```bash
pnpm test
```

E2E (starts all four dev servers):

```bash
pnpm e2e
```

Build Custom Elements bundle:

```bash
pnpm elements:build
```

## API

Base URL: `http://localhost:8080/api` (see `apps/shell/src/environments/environment.ts`).

| Area | Endpoints |
|------|-----------|
| Catalog | `/catalog/home`, `/catalog/categories/:filter`, `/catalog/products/:id`, `/catalog/stores`, `/catalog/recommendations` |
| Inventory | `/inventory/:sku` |
| Cart | `GET /cart`, `GET /cart/mini`, `POST /cart/items`, `DELETE /cart/items/:sku` |
| Orders | `POST /orders`, `GET /orders/:id` |

## Cross-MFE events

Defined in `packages/shared-catalog` (`mfe-events.ts`):

- `checkout:cart-updated` — cart count/subtotal changed
- `explore:store-selected` — pickup store chosen on Stores page

## Nx tags

- MFEs (`type:mfe`) may depend only on `shared-catalog` and `ts-design-system` — not on each other.
- `shell` may depend on shared libs (remotes are loaded via Module Federation, not TypeScript imports).

## Docker

```bash
docker build -t tractor-store-frontend .
docker run -p 8080:80 tractor-store-frontend
```

Serves the shell and federated remotes via nginx (see `nginx.conf`).

## Docs

- [TESTING.md](./TESTING.md)
- [docs/adr/0001-module-federation.md](./docs/adr/0001-module-federation.md)
