# ADR 0001: Module Federation for Tractor Store MFEs

## Status

Accepted

## Context

The Tractor Store splits ownership across three teams (Explore, Decide, Checkout). We need independent deployable frontends with a shared shell, shared design language, and loose coupling between teams.

## Decision

Use **Nx** with **`@module-federation/enhanced/webpack`** (`ModuleFederationPlugin`) in each app’s `webpack.config.js`, and **`@nx/angular/mf`** for `loadRemoteModule` in the shell:

| Remote | Exposes | Shell route prefix |
|--------|---------|-------------------|
| `mfe-explore` | `./Routes` | `/` |
| `mfe-decide` | `./Routes` | `/product` |
| `mfe-checkout` | `./Routes` | `/checkout` |

The shell loads remotes with `loadRemoteModule` from `@nx/angular/mf`. Angular is shared as a singleton across host and remotes.

Cross-team integration uses:

1. **Shell routing** — URL is the integration contract (`/product/:id`, `/checkout/thanks/:orderId`).
2. **Typed `CustomEvent`s** in `shared-catalog` — `checkout:cart-updated`, `explore:store-selected` (no direct imports between MFEs).
3. **`ts-design-system` Custom Elements** — mini-cart and cart counter usable from Explore header without importing Checkout code.

## Consequences

**Positive**

- Teams can develop and serve MFEs on separate ports (4201–4203).
- `nx affected` and tag rules keep dependency graph acyclic.
- Production nginx can serve each `remoteEntry.js` under a path prefix.

**Negative**

- Local dev requires multiple processes (or `module-federation-dev-server` with `devRemotes`).
- Version skew on shared Angular packages must stay aligned (enforced by host `shared` config).
- Custom Elements bundle is a second build target for the design system.

## Alternatives considered

- **Single SPA with lazy routes** — simpler ops, weaker team boundaries.
- **iframe integration** — stronger isolation, worse UX and performance.
- **Native ES modules import maps** — less tooling support in Angular 19 ecosystem than Module Federation.
