# SonarCloud — configuración rápida (5 minutos)

## 1. Cuenta y organización

1. [sonarcloud.io](https://sonarcloud.io) → **Log in with GitHub**
2. **+** → Create organization → elige plan Free
3. Anota el **Organization Key** (ej. `quind-hackaton-2026`)

## 2. Proyectos (dos, por monorepo)

En la organización → **Analyze new project** → GitHub → selecciona tu repo.

Crea análisis para:

- Backend: carpeta `tractor-store-backend`
- Frontend: carpeta `tractor-store-frontend`

O crea dos proyectos manualmente y usa las keys que SonarCloud asigne.

## 3. Editar `sonar-project.properties`

Reemplaza `YOUR_ORG` y `YOUR_SONARCLOUD_ORG` en:

- `tractor-store-backend/sonar-project.properties`
- `tractor-store-frontend/sonar-project.properties`

Ejemplo:

```properties
sonar.projectKey=quind-hackaton-2026_tractor-store-backend
sonar.organization=quind-hackaton-2026
```

## 4. Secret en GitHub

1. SonarCloud → **My Account** → **Security** → **Generate Token**
2. GitHub repo → **Settings** → **Secrets and variables** → **Actions**
3. **New repository secret**: `SONAR_TOKEN` = *(pega el token)*

`GITHUB_TOKEN` lo inyecta Actions automáticamente; no hace falta crearlo.

## 5. Ejecutar

```bash
git add .
git commit -m "chore: configure SonarCloud keys"
git push
```

O: **Actions** → **SonarCloud** → **Run workflow**

## 6. Ver resultados

- GitHub → **Actions** → job **Sonar — Backend** / **Sonar — Frontend**
- SonarCloud → **Projects** → Issues, Coverage, Quality Gate

## 7. Cobertura mínima 80% (forzada en CI, no solo en Sonar)

Sonar Free **no permite** asignar un Quality Gate custom con 80% global. Por eso el repo valida la cobertura **en los pipelines**:

| Stack | Dónde falla | Cómo |
|-------|-------------|------|
| **Backend** | CI + SONAR | `jacoco-maven-plugin` → `check` con mínimo **80%** en `mvn verify` |
| **Frontend** | CI + SONAR | Script `check-frontend-coverage.py` (monorepo completo, archivos sin tests = 0%) |
| **Sonar dashboard** | SONAR | Script `check-sonar-coverage.sh` lee la métrica `coverage` vía API |

Si la cobertura global está por debajo de **80%**, los jobs **CI · Backend**, **CI · Frontend**, **SONAR · Backend** y **SONAR · Frontend** fallan.

Cobertura actual aproximada:

| Proyecto | Cobertura global | ¿Pasa 80%? |
|----------|------------------|------------|
| Backend  | ~64%             | No         |
| Frontend | ~17%             | No         |

Hasta añadir más tests, los pipelines fallarán a propósito.

El gate **Sonar way** (New Code ≥ 80%) sigue activo además; mide solo el código nuevo de cada push.
