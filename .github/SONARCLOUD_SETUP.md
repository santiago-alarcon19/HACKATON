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

## 7. Quality Gate — cobertura mínima 80%

El workflow espera el Quality Gate (`sonar.qualitygate.wait=true`). **Debes crear la regla en SonarCloud** (no se puede definir solo desde el repo):

1. SonarCloud → organización **santiago-alarcon19** → **Quality Gates**
2. **Create** → nombre: `Tractor Store — 80% coverage`
3. **Add Condition**:
   - **Metric:** Coverage
   - **Operator:** is less than
   - **Value:** `80`
   - **On:** Overall Code (código existente)
   - **Level:** Error
4. **Set as Default** (o asigna este gate a los proyectos backend y frontend)
5. Vuelve a ejecutar el workflow **Tractor Store — SonarCloud**

Si la cobertura está por debajo del 80%, el job fallará con `QUALITY GATE STATUS: FAILED`.

Cobertura actual aproximada (referencia):

| Proyecto  | Cobertura actual | ¿Pasa 80%? |
|-----------|------------------|------------|
| Backend   | ~64%             | No         |
| Frontend  | ~17%             | No         |

Hasta subir tests/cobertura, Sonar fallará a propósito.
