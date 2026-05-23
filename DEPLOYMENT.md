# Deployment — Tractor Store (Sesión 3)

Guía para desplegar la tienda con **HTTPS público**, revisar **CI en GitHub** y configurar **SonarCloud**.

## Arquitectura en producción

```
Internet (HTTPS)
       │
       ▼
┌──────────────────┐     proxy /api      ┌─────────────────┐
│  Nginx (frontend)│ ──────────────────► │  Spring Boot API │
│  shell + 3 MFEs  │                     │  + PostgreSQL    │
└──────────────────┘                     └─────────────────┘
```

En local, `docker compose` ya replica este modelo: frontend en puerto **80**, API en **8081** (host).

---

## 1. Despliegue local (referencia)

```bash
docker compose up --build
```

| Servicio | URL |
|----------|-----|
| Tienda | http://localhost |
| API (host) | http://localhost:8081 |
| Swagger | http://localhost/swagger-ui/index.html |

---

## 2. Despliegue público con HTTPS

No hay un proveedor obligatorio. Opciones recomendadas para el hackathon:

### Opción A — VPS + Docker Compose + Caddy (recomendada)

1. VM Linux (Ubuntu 22+) con Docker instalado.
2. Clonar el repo y configurar variables en `.env` (opcional):

```env
POSTGRES_PASSWORD=cambiar
DATABASE_PASSWORD=cambiar
```

3. Exponer solo los puertos **80** y **443** (o usar Caddy en el host).

Ejemplo mínimo con **Caddy** como reverse proxy HTTPS delante del stack:

```bash
# En el servidor
git clone <tu-repo> && cd Hackaton
docker compose up -d --build
```

Caddyfile (en el host, apuntando al frontend en `localhost:80`):

```
tu-dominio.com {
    reverse_proxy localhost:80
}
```

Caddy obtiene certificado Let's Encrypt automáticamente → **HTTPS público**.

### Opción B — Railway / Render (PaaS)

1. Crear proyecto con **PostgreSQL** gestionado.
2. Desplegar `tractor-store-backend` como servicio Docker (puerto 8080).
3. Desplegar `tractor-store-frontend` como servicio Docker (puerto 80).
4. Configurar en el frontend la variable de entorno del proxy API (si el PaaS no usa el mismo `docker-compose` interno, ajustar `nginx.conf` para apuntar a la URL pública del API).

Variables típicas del backend:

| Variable | Ejemplo |
|----------|---------|
| `DATABASE_URL` | `jdbc:postgresql://host:5432/tractorstore` |
| `DATABASE_USERNAME` | `tractor` |
| `DATABASE_PASSWORD` | *(secreto)* |

### Opción C — Solo demo en GitHub (sin servidor)

- Subir el código y mostrar **Actions** en verde (CI + SonarCloud).
- Demo en vivo con `docker compose` en tu máquina o grabación.

---

## 3. CI/CD en GitHub Actions

Workflows en [`.github/workflows/`](./.github/workflows/):

| Workflow | Archivo | Qué hace |
|----------|---------|----------|
| **CI** | `ci.yml` | Tests/build **solo del stack que cambió** (path filters) |
| **SonarCloud** | `sonarcloud.yml` | Sonar **solo del stack que cambió** (requiere `SONAR_TOKEN`) |

### Path filters (qué se ejecuta)

| Archivos que cambias | Backend CI | Frontend CI | Sonar back | Sonar front | Docker smoke |
|----------------------|:------------:|:-------------:|:----------:|:-----------:|:--------------:|
| Solo `tractor-store-backend/**` | Sí | No | Sí | No | No |
| Solo `tractor-store-frontend/**` | No | Sí | No | Sí | No |
| Raíz (`docker-compose.yml`, `README.md`, `.github/**`, etc.) | Sí | Sí | Sí | Sí | Sí (en `main`) |
| Backend **y** frontend en el mismo commit | Sí | Sí | Sí | Sí | Sí (en `main`) |

El job **Detect changed paths** compara tu commit con la rama base (en PR) o el push anterior.

### Paso a paso: revisar CI en GitHub

1. **Sube el código** a un repositorio en GitHub (raíz = carpeta `Hackaton` con `docker-compose.yml`).

```bash
cd Hackaton
git init
git add .
git commit -m "feat: add session 3 CI, SonarCloud and deployment docs"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
git push -u origin main
```

2. Abre el repo en el navegador → pestaña **Actions**.

3. Deberías ver el workflow **CI** ejecutándose (o ya terminado).

4. Entra en la ejecución y revisa los jobs:
   - **Backend (Maven)** — `mvn verify` + JaCoCo
   - **Frontend (Nx)** — lint, tests, build producción
   - **Docker Compose smoke** — solo en push a `main`/`master`

5. En un **Pull Request**, los mismos jobs corren automáticamente; al final del PR aparece el resumen de checks (✓ o ✗).

6. **Artefactos** (opcional): en cada run de CI → *Artifacts* → `backend-jacoco` / `frontend-coverage`.

### Si CI falla

| Job | Causa habitual | Solución |
|-----|----------------|----------|
| Backend | Testcontainers sin Docker | Solo corre en `ubuntu-latest` (ya configurado) |
| Frontend | `pnpm install` | Revisar que `pnpm-lock.yaml` esté commiteado |
| Docker smoke | API lenta al arrancar | Revisar logs en el job; subir timeout si hace falta |

---

## 4. SonarCloud

### Paso a paso: configurar SonarCloud

1. Entra en [https://sonarcloud.io](https://sonarcloud.io) e inicia sesión con **GitHub**.

2. **Create Organization** (o usa una existente) → anota el **Organization Key** (ej. `mi-equipo-hackaton`).

3. **Create Project** → importa el repo de GitHub.

4. Crea **dos proyectos** (monorepo):
   - `tractor-store-backend`
   - `tractor-store-frontend`

5. En cada proyecto, copia el **Project Key** (ej. `mi-equipo-hackaton_tractor-store-backend`).

6. Edita los archivos `sonar-project.properties` y reemplaza los placeholders:

**`tractor-store-backend/sonar-project.properties`**

```properties
sonar.projectKey=mi-equipo-hackaton_tractor-store-backend
sonar.organization=mi-equipo-hackaton
```

**`tractor-store-frontend/sonar-project.properties`**

```properties
sonar.projectKey=mi-equipo-hackaton_tractor-store-frontend
sonar.organization=mi-equipo-hackaton
```

7. En SonarCloud → **My Account** → **Security** → genera un **token** (User Token).

8. En GitHub → tu repo → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**:
   - Name: `SONAR_TOKEN`
   - Value: el token de SonarCloud

9. Haz push a `main` o ejecuta manualmente **Actions** → **SonarCloud** → **Run workflow**.

10. Revisa resultados en [sonarcloud.io](https://sonarcloud.io) → tu organización → proyectos.

### Badge opcional en el README

Tras crear el proyecto backend:

```markdown
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=mi-equipo-hackaton_tractor-store-backend&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=mi-equipo-hackaton_tractor-store-backend)
```

(Sustituye `project=` por tu project key.)

---

## 5. Checklist Sesión 3

| Entregable | Archivo / dónde verlo |
|------------|------------------------|
| GitHub Actions CI | `.github/workflows/ci.yml` → pestaña Actions |
| SonarCloud | `.github/workflows/sonarcloud.yml` + `sonar-project.properties` |
| Cobertura backend | JaCoCo en `pom.xml` → artefacto `backend-jacoco` |
| Cobertura frontend | `pnpm test:coverage` → `coverage/**/lcov.info` |
| Despliegue HTTPS | Esta guía §2 + `docker compose` en VPS con Caddy |
| Documentación | `DEPLOYMENT.md` (este archivo) |

---

## 6. URLs de ejemplo (rellenar tras desplegar)

| Entorno | URL tienda | URL API |
|---------|------------|---------|
| Local | http://localhost | http://localhost:8081/api |
| Producción | `https://________________` | `https://________________/api` |

---

## Referencias

- [README principal](./README.md)
- [Tractor Store spec](https://micro-frontends.org/tractor-store/)
- [SonarCloud + GitHub Action](https://docs.sonarcloud.io/advanced-setup/ci-based-analysis/github-actions-for-sonarcloud/)
