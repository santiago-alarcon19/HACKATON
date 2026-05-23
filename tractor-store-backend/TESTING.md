# Testing Guide

## Prerequisites

- Docker Desktop (for Testcontainers integration tests)
- JDK 21 + Maven 3.9+ **or** build/test inside the project Docker image

## Run all tests

Requires **Docker Desktop** running (Testcontainers starts PostgreSQL for integration tests).

```bash
mvn verify
```

On Windows with Docker Desktop, Testcontainers uses the local Docker engine automatically.

Unit / architecture tests only (no Docker):

```bash
mvn test -Dtest=ModulithArchitectureTest,ModuleBoundaryArchTest,ColorDistanceTest
```

## Test layers

| Test | Class | Purpose |
|------|-------|---------|
| Modulith | `ModulithArchitectureTest` | `ApplicationModules.verify()` — module boundaries & dependencies |
| ArchUnit | `ModuleBoundaryArchTest` | No cross-module `internal` access; controllers ≠ repositories |
| Unit | `ColorDistanceTest` | Recommendation color distance helper |
| Integration | `CheckoutFlowIntegrationTest` | Full flow on real PostgreSQL via Testcontainers |

## Integration scenario

`CheckoutFlowIntegrationTest.fullCheckoutFlow`:

1. POST `/api/cart/items` with SKU `AU-02-OG` → captures `TRACTOR_CART_SESSION` cookie
2. GET `/api/cart/mini` → quantity `1`
3. POST `/api/orders` with pickup store `store-a`
4. GET `/api/orders/{id}` → order persisted
5. GET `/api/inventory/AU-02-OG` → stock decremented

Additional cases: out-of-stock SKU (`AU-01-SI`), remove cart line.

## Run only unit / arch tests (no Docker)

```bash
mvn test -Dtest=ColorDistanceTest,ModulithArchitectureTest,ModuleBoundaryArchTest
```

## Test in Docker

```bash
docker build -t tractor-store-backend .
docker run --rm tractor-store-backend mvn -q test
```

(Uses JDK 21 in the build stage.)

## Manual smoke (API up)

```bash
curl http://localhost:8080/api/catalog/home
curl http://localhost:8080/api/inventory/CL-01-GR
```

Cart (save cookie from `-c` / `-b`):

```bash
curl -c cookies.txt -X POST http://localhost:8080/api/cart/items \
  -H "Content-Type: application/json" -d "{\"sku\":\"CL-01-GR\"}"
curl -b cookies.txt http://localhost:8080/api/cart/mini
```
