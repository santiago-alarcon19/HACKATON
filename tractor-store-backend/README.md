# Tractor Store Backend

Modular monolith backend for the [Tractor Store](https://micro-frontends.org/tractor-store/) hackathon. Implements the REST contract expected by the Angular micro-frontends (catalog, inventory, cart, orders) on a single Spring Boot 3.4 process with PostgreSQL.

## Stack

| Layer | Choice |
|-------|--------|
| Runtime | Java **21** (Docker image); `pom.xml` targets 21 |
| Framework | Spring Boot 3.4, Spring Data JPA, Spring Modulith |
| Database | PostgreSQL 16, Flyway migrations |
| API docs | springdoc-openapi → Swagger UI |
| Tests | JUnit 5, Testcontainers, ArchUnit |

## Modules

| Module | Responsibility | Table prefix |
|--------|----------------|--------------|
| `catalog` | Home, categories, products, recommendations, stores | `catalog_` |
| `inventory` | Stock per SKU | `inventory_` |
| `cart` | HttpOnly cookie session cart, checkout | `cart_` |
| `order` | Placed orders | `order_` |
| `notifications` | Order confirmation audit log | `notifications_` |

Public vs internal packages: `com.tractorstore.<module>.api` (controllers, DTOs, module APIs) and `.internal` (entities, repositories, services).

Cart checkout calls `OrderApi` in the order module; order placement publishes `OrderPlacedEvent` consumed by notifications.

## API (summary)

| Method | Path |
|--------|------|
| GET | `/api/catalog/home` |
| GET | `/api/catalog/categories/{filter}` |
| GET | `/api/catalog/products/{id}` |
| GET | `/api/catalog/recommendations?skus={csv}` |
| GET | `/api/catalog/stores` |
| GET | `/api/inventory/{sku}` |
| GET | `/api/cart`, `/api/cart/mini` |
| POST | `/api/cart/items` body `{ "sku": "..." }` |
| DELETE | `/api/cart/items/{sku}` |
| POST | `/api/orders` body `{ "firstname", "lastname", "storeId" }` |
| GET | `/api/orders/{id}` |

Errors: `{ "code", "message", "details"? }`. CORS allows `http://localhost:4200` with credentials for cart cookies.

Swagger UI: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)

## Run with Docker (recommended)

No local Maven/JDK 21 required:

```bash
docker compose up --build
```

API: `http://localhost:8080`

## Run locally

1. Start PostgreSQL (`docker compose up postgres -d`).
2. Requires **JDK 21** and Maven (or generate the wrapper: `mvn wrapper:wrapper`).
3. `mvn spring-boot:run`

Environment variables: `DATABASE_URL`, `DATABASE_USERNAME`, `DATABASE_PASSWORD` (defaults in `application.yml`).

## Seed data

Flyway `V2__seed_data.sql` is generated from the official blueprint (`products.js`, `database.json`). Regenerate:

```bash
node scripts/generate-seed.js
```

## Tests

See [TESTING.md](TESTING.md). Quick run (Docker required for integration tests):

```bash
mvn test
```

## Architecture decisions

See [docs/adr/](docs/adr/).

## Build note

This repo does not ship `mvnw` binaries; use **Docker Compose** or install Maven 3.9+ with JDK 21 locally.
