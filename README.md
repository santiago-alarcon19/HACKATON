# Tractor Store — Hackathon Quind

Implementación fullstack del [Tractor Store](https://micro-frontends.org/tractor-store/): e-commerce de tractores con **micro-frontends Angular 19** y **monolito modular Spring Boot 3**.

## Repositorios

| Carpeta | Descripción |
|---------|-------------|
| [`tractor-store-frontend`](./tractor-store-frontend/) | Monorepo Nx: shell + 3 MFEs (explore, decide, checkout), `ts-design-system`, MSW, Jest, Playwright |
| [`tractor-store-backend`](./tractor-store-backend/) | Spring Boot 3.4 + Java 21, Spring Modulith, Flyway, PostgreSQL, Testcontainers |

## Clonar y probar (primera vez)

Requisitos: [Git](https://git-scm.com/), [Docker Desktop](https://www.docker.com/products/docker-desktop/) (incluye Docker Compose).

```bash
git clone https://github.com/TU_USUARIO/TU_REPO.git
cd TU_REPO   # carpeta raíz: debe contener docker-compose.yml
docker compose up --build
```

Espera a que termine el build (varios minutos la primera vez). Luego abre:

| Qué probar | URL |
|------------|-----|
| Tienda | http://localhost |
| API (Swagger) | http://localhost/swagger-ui/index.html |

Recorrido sugerido: **Home** → **Classic / Autonomous** → abrir un tractor → **Add to cart** → icono del carrito → **Checkout** → nombre, apellido, tienda → **Place order** → pantalla de gracias.

Para parar: `Ctrl+C` en la terminal y `docker compose down`.

Documentación extra: desarrollo sin Docker en las secciones siguientes; CI/Sonar/despliegue en [DEPLOYMENT.md](./DEPLOYMENT.md).

## Subir a GitHub (primera vez)

Desde la carpeta **Hackaton** (donde está `docker-compose.yml` y `.github/`):

```bash
git init
git add .
git commit -m "feat: Tractor Store hackathon — MFEs, backend modular, CI y Docker"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git push -u origin main
```

Tras el push, abre **Actions** en GitHub. Deberían ejecutarse **CI** y **SonarCloud** (Sonar requiere secret `SONAR_TOKEN`; ver [DEPLOYMENT.md](./DEPLOYMENT.md)).

**Qué valida CI:**

| Job | Cuándo corre |
|-----|----------------|
| Backend (Maven) | Cambios en `tractor-store-backend/` o raíz compartida |
| Frontend (Nx) | Cambios en `tractor-store-frontend/` o raíz compartida |
| Docker smoke | Push a `main` si cambió la raíz o ambos stacks |

**Antes de presentar:** sustituye `TU_USUARIO/TU_REPO` en este README y configura SonarCloud (`sonar-project.properties` + secret).

## Arranque rápido (recomendado)

Requisitos: **Docker** y **Docker Compose**.

```bash
docker compose up --build
```

| Servicio | URL |
|----------|-----|
| Tienda (shell + MFEs) | http://localhost |
| API REST (directa) | http://localhost:8081 |
| Swagger UI | http://localhost/swagger-ui/index.html |

> Si el puerto **8080** ya está en uso en tu PC, el compose publica la API en **8081**. La tienda en `:80` sigue llamando al API por proxy interno (`/api`).

Flujo de prueba: home → categoría → detalle de producto → añadir al carrito → checkout → confirmación.

## Desarrollo local

### Backend

```bash
cd tractor-store-backend
docker compose up --build
# o: PostgreSQL en Docker + mvn spring-boot:run (JDK 21)
```

### Frontend

```bash
cd tractor-store-frontend
pnpm install   # o npm install
pnpm start     # shell :4200 + remotes :4201–4203
```

Con MSW activo en dev (`environment.useMsw: true`) el front funciona sin backend. Para integración real:

```bash
# En apps/shell/src/environments/environment.ts
# useMsw: false
```

## Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│  apps/shell (Module Federation host)                        │
│    ├── mfe-explore  →  /api/catalog/*                       │
│    ├── mfe-decide   →  /api/catalog/*, /api/inventory/*    │
│    └── mfe-checkout →  /api/cart/*, /api/orders/*           │
└──────────────────────────┬──────────────────────────────────┘
                           │ HTTP + cookie de carrito
┌──────────────────────────▼──────────────────────────────────┐
│  Spring Boot modular monolith                               │
│  catalog │ inventory │ cart │ order │ notifications         │
└──────────────────────────┬──────────────────────────────────┘
                           │
                    PostgreSQL (Flyway)
```

## Documentación

| Documento | Para quién | Contenido |
|-----------|------------|-----------|
| **README.md** (este archivo) | Quien **clona y prueba** el proyecto | Arranque con Docker, arquitectura, dev local |
| **DEPLOYMENT.md** | Quien **despliega o revisa CI** | GitHub Actions, SonarCloud, HTTPS en servidor, path filters |
| README frontend | Desarrolladores front | [tractor-store-frontend/README.md](./tractor-store-frontend/README.md) |
| README backend | Desarrolladores back | [tractor-store-backend/README.md](./tractor-store-backend/README.md) |
| Testing frontend | [tractor-store-frontend/TESTING.md](./tractor-store-frontend/TESTING.md) |
| Testing backend | [tractor-store-backend/TESTING.md](./tractor-store-backend/TESTING.md) |
| ADRs frontend | [tractor-store-frontend/docs/adr/](./tractor-store-frontend/docs/adr/) |
| ADRs backend | [tractor-store-backend/docs/adr/](./tractor-store-backend/docs/adr/) |

## Entregables (Sesiones 1 y 2)

- [x] Monorepo Nx con shell, 3 MFEs Angular 19, `ts-design-system` (+ Custom Elements)
- [x] Tests unitarios (Jest) y E2E (Playwright + MSW)
- [x] Backend con módulos catalog, inventory, cart, order, notifications
- [x] Spring Modulith, Flyway, Testcontainers
- [x] Integración local con `docker compose up`
- [x] README, ADRs, TESTING.md

## Sesión 3 (opcional)

| Entregable | Ubicación |
|------------|-----------|
| GitHub Actions CI | [`.github/workflows/ci.yml`](./.github/workflows/ci.yml) |
| SonarCloud | [`.github/workflows/sonarcloud.yml`](./.github/workflows/sonarcloud.yml) + `sonar-project.properties` en frontend/backend |
| Despliegue HTTPS + guía GitHub | [**DEPLOYMENT.md**](./DEPLOYMENT.md) |
| Setup SonarCloud (5 min) | [`.github/SONARCLOUD_SETUP.md`](./.github/SONARCLOUD_SETUP.md) |

Tras subir a GitHub: pestaña **Actions** para CI/Sonar; configurar secret `SONAR_TOKEN` (ver DEPLOYMENT.md).

## Referencias

- [Especificación Tractor Store](https://micro-frontends.org/tractor-store/)
- [Blueprint oficial](https://github.com/neuland/tractor-store-blueprint)
