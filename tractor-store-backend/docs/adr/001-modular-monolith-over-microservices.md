# ADR 001: Modular monolith over microservices

## Status

Accepted

## Context

The Tractor Store frontend is split into three micro-frontends (Explore, Decide, Checkout), but the hackathon backend must persist catalog, inventory, carts, and orders with low operational overhead for a single team or demo environment.

## Decision

Deploy one Spring Boot application with **modular boundaries** (Catalog, Inventory, Cart, Order, Notifications) enforced by package structure, Spring Modulith, and ArchUnit—not separate deployable services.

## Consequences

- **Positive:** One JVM, one database connection pool, simple Docker Compose, transactional checkout without distributed sagas.
- **Positive:** Module APIs (`CatalogApi`, `OrderApi`, …) mirror how we would extract services later.
- **Negative:** Cannot scale modules independently without future extraction.
- **Negative:** Requires discipline (no `internal` imports across modules) validated in CI.
