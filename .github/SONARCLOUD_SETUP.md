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
