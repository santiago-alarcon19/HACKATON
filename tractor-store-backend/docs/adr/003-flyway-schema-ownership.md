# ADR 003: Flyway migrations with per-module table prefixes

## Status

Accepted

## Context

Multiple modules share one PostgreSQL database. Shared tables or cross-module foreign keys would blur bounded contexts and block future extraction.

## Decision

Use **Flyway** versioned SQL migrations. Each module owns tables prefixed with `catalog_`, `inventory_`, `cart_`, `order_`, or `notifications_`. Seed data from the official Tractor Store blueprint lives in `V2__seed_data.sql` (regenerated via `scripts/generate-seed.js`).

Hibernate `ddl-auto=validate` only; schema changes always go through Flyway.

## Consequences

- **Positive:** Clear ownership; no JPA entities spanning module tables.
- **Positive:** Reproducible environments (local, CI Testcontainers, Docker).
- **Negative:** No SQL JOINs across modules—cart enriches lines via `CatalogApi` in application code.
- **Negative:** Seed script must be re-run when blueprint data changes.
