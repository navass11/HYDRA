# HYDRA web en Azure

Este documento recoge los comandos usados para desplegar HYDRA en Azure y el
flujo para volver a subir cambios de codigo.

Arquitectura desplegada:

- `web`: nginx + Astro, expuesto a internet.
- `api`: FastAPI interno para las herramientas interactivas.
- `jupyter`: JupyterLab interno para ejecutar notebooks.
- `Azure Files`: el share `dockerdata`, registrado en Container Apps como
  `hydra-data`, montado como `/workspace/data` en `api` y `jupyter`.
- Sesiones de notebooks: la web crea una copia de trabajo por navegador en
  `/workspace/data/jupyter_sessions/<session_id>/notebooks/` antes de abrir
  Jupyter. Asi se evita editar directamente los notebooks base de la imagen.
- Jupyter arranca con raiz en `/workspace/data`, por lo que el explorador de
  archivos solo muestra `dockerdata` y no el resto del contenedor.

Regla operativa:

- Todo lo persistente debe vivir en `dockerdata` (`/workspace/data` dentro de
  los contenedores).
- El codigo, la web, `pyhydra` y los notebooks base viajan en las imagenes
  Docker y se actualizan reconstruyendo y desplegando imagenes.
- Las descargas, resultados, sesiones de Jupyter, modelos modificados y ficheros
  compartidos deben escribirse bajo `/workspace/data`.
- No montar Jupyter en `/workspace`: expondria codigo, configuracion,
  dependencias y carpetas internas que no son parte del espacio de trabajo del
  usuario.

URL actual:

```text
https://hydra-web.yellowwave-5aaa93b0.spaincentral.azurecontainerapps.io/
```

## Recursos actuales

```bash
export AZ_SUBSCRIPTION_ID="72a0ae85-d4b9-4457-ba52-c121a9d1b93c"
export AZ_LOCATION="spaincentral"
export AZ_RESOURCE_GROUP="VisualStudioOnline-3F607BE982BD4B06820771DA8F2FFB4B"

export AZ_ACR_NAME="hydratoolsacr"
export AZ_ACR_LOGIN_SERVER="hydratoolsacr.azurecr.io"

export AZ_CONTAINER_ENV="hydra-env"
export AZ_CONTAINER_APP="hydra-web"

export AZ_STORAGE_ACCOUNT="hydratools"
export AZ_FILE_SHARE="dockerdata"
export AZ_CONTAINERAPP_STORAGE="hydra-data"
```

## 1. Preparar la maquina local

Instalar Azure CLI en macOS:

```bash
brew install azure-cli
```

Entrar en Azure:

```bash
az login
az account list --output table
az account set --subscription "$AZ_SUBSCRIPTION_ID"
```

Comprobar la sesion:

```bash
az account show --output table
```

## 2. Registrar proveedores de Azure

En esta suscripcion fue necesario registrar estos proveedores:

```bash
az provider register -n Microsoft.App --wait
az provider register -n Microsoft.ContainerRegistry --wait
az provider register -n Microsoft.OperationalInsights --wait
```

Comprobar estado:

```bash
az provider show --namespace Microsoft.App --query registrationState --output tsv
az provider show --namespace Microsoft.ContainerRegistry --query registrationState --output tsv
az provider show --namespace Microsoft.OperationalInsights --query registrationState --output tsv
```

## 3. Crear recursos base

El grupo de recursos y la cuenta de almacenamiento ya existian. Para listar lo
que hay:

```bash
az group list --query "[].{name:name,location:location}" --output table

az storage account list \
  --query "[].{name:name,resourceGroup:resourceGroup,location:location}" \
  --output table

az storage share-rm list \
  --resource-group "$AZ_RESOURCE_GROUP" \
  --storage-account "$AZ_STORAGE_ACCOUNT" \
  --query "[].{name:name,quota:shareQuota,enabledProtocols:enabledProtocols}" \
  --output table
```

Crear Azure Container Registry:

```bash
az acr create \
  --resource-group "$AZ_RESOURCE_GROUP" \
  --name "$AZ_ACR_NAME" \
  --sku Basic \
  --admin-enabled true \
  --location "$AZ_LOCATION"
```

Crear Azure Container Apps Environment:

```bash
az containerapp env create \
  --resource-group "$AZ_RESOURCE_GROUP" \
  --name "$AZ_CONTAINER_ENV" \
  --location "$AZ_LOCATION"
```

Registrar Azure Files en el entorno de Container Apps:

```bash
export AZ_STORAGE_KEY=$(az storage account keys list \
  --resource-group "$AZ_RESOURCE_GROUP" \
  --account-name "$AZ_STORAGE_ACCOUNT" \
  --query "[0].value" \
  --output tsv)

az containerapp env storage set \
  --resource-group "$AZ_RESOURCE_GROUP" \
  --name "$AZ_CONTAINER_ENV" \
  --storage-name "$AZ_CONTAINERAPP_STORAGE" \
  --azure-file-account-name "$AZ_STORAGE_ACCOUNT" \
  --azure-file-account-key "$AZ_STORAGE_KEY" \
  --azure-file-share-name "$AZ_FILE_SHARE" \
  --access-mode ReadWrite
```

## 4. Construir y subir imagenes

En esta suscripcion `az acr build` fallo con `ACR Tasks requests ... are not
permitted`, asi que el flujo usado es construir localmente y subir al ACR.

Azure Container Apps ejecuta imagenes Linux x86-64. En Docker esa arquitectura
se llama `linux/amd64`; no significa procesador AMD, sino imagen compatible con
servidores Intel/AMD x86-64. En un Mac Apple Silicon hay que forzar esa
plataforma.

Login en el registry:

```bash
az acr login --name "$AZ_ACR_NAME"
```

Construir y subir las tres imagenes:

```bash
docker buildx build \
  --platform linux/amd64 \
  -t "$AZ_ACR_LOGIN_SERVER/hydra-web:latest" \
  -f docker/Dockerfile.web \
  --push .

docker buildx build \
  --platform linux/amd64 \
  -t "$AZ_ACR_LOGIN_SERVER/hydra-api:latest" \
  -f api/Dockerfile \
  --push .

docker buildx build \
  --platform linux/amd64 \
  -t "$AZ_ACR_LOGIN_SERVER/hydra-jupyter:latest" \
  -f docker/Dockerfile.jupyter \
  --push .
```

Comprobar que estan en ACR:

```bash
az acr repository list \
  --name "$AZ_ACR_NAME" \
  --output table

az acr repository show-tags \
  --name "$AZ_ACR_NAME" \
  --repository hydra-web \
  --output table
```

## 5. Despliegue inicial de la Container App

No guardes passwords reales en el repositorio. La plantilla versionada
`deploy/azure/containerapp.yaml` usa placeholders. Para desplegar, se puede
generar una plantilla temporal en `/private/tmp`.

Jupyter esta configurado sin token (`JUPYTER_TOKEN=""`). Esto facilita el uso
desde la web, pero deja el laboratorio accesible para cualquiera que conozca la
URL publica. Para un entorno publico conviene protegerlo despues con dominio,
red privada, autenticacion delante o IP restrictions.

Obtener password de ACR:

```bash
export ACR_PASSWORD=$(az acr credential show \
  --name "$AZ_ACR_NAME" \
  --query "passwords[0].value" \
  --output tsv)
```

Crear YAML temporal:

```bash
cp deploy/azure/containerapp.yaml /private/tmp/hydra-containerapp.yaml

perl -0777 -i -pe "s#<SUBSCRIPTION_ID>#$AZ_SUBSCRIPTION_ID#g; \
s#<RESOURCE_GROUP>#$AZ_RESOURCE_GROUP#g; \
s#<LOCATION>#$AZ_LOCATION#g; \
s#<ACR_LOGIN_SERVER>#$AZ_ACR_LOGIN_SERVER#g; \
s#<ACR_USERNAME>#$AZ_ACR_NAME#g; \
s#<ACR_PASSWORD>#$ACR_PASSWORD#g; \
s#<MANAGED_ENVIRONMENT_NAME>#$AZ_CONTAINER_ENV#g; \
s#<AZURE_FILES_STORAGE_NAME>#$AZ_CONTAINERAPP_STORAGE#g" \
/private/tmp/hydra-containerapp.yaml
```

Crear la app:

```bash
az containerapp create \
  --name "$AZ_CONTAINER_APP" \
  --resource-group "$AZ_RESOURCE_GROUP" \
  --environment "$AZ_CONTAINER_ENV" \
  --yaml /private/tmp/hydra-containerapp.yaml
```

## 6. Actualizar Azure despues de cambios de codigo

Este es el flujo normal cuando cambias `web/`, `api/`, `pyhydra/`,
`notebooks/`, `docker/` o dependencias.

Primero define variables:

```bash
export AZ_SUBSCRIPTION_ID="72a0ae85-d4b9-4457-ba52-c121a9d1b93c"
export AZ_LOCATION="spaincentral"
export AZ_RESOURCE_GROUP="VisualStudioOnline-3F607BE982BD4B06820771DA8F2FFB4B"
export AZ_ACR_NAME="hydratoolsacr"
export AZ_ACR_LOGIN_SERVER="hydratoolsacr.azurecr.io"
export AZ_CONTAINER_ENV="hydra-env"
export AZ_CONTAINER_APP="hydra-web"
export AZ_CONTAINERAPP_STORAGE="hydra-data"

az account set --subscription "$AZ_SUBSCRIPTION_ID"
az acr login --name "$AZ_ACR_NAME"
```

Si solo has cambiado la web:

```bash
docker buildx build \
  --platform linux/amd64 \
  -t "$AZ_ACR_LOGIN_SERVER/hydra-web:latest" \
  -f docker/Dockerfile.web \
  --push .
```

Si has cambiado la API o `pyhydra` usado por herramientas:

```bash
docker buildx build \
  --platform linux/amd64 \
  -t "$AZ_ACR_LOGIN_SERVER/hydra-api:latest" \
  -f api/Dockerfile \
  --push .
```

Si has cambiado notebooks, entorno Jupyter, dependencias o `pyhydra` usado en
notebooks:

```bash
docker buildx build \
  --platform linux/amd64 \
  -t "$AZ_ACR_LOGIN_SERVER/hydra-jupyter:latest" \
  -f docker/Dockerfile.jupyter \
  --push .
```

Forzar que Container Apps cree una nueva revision usando las imagenes `latest`:

```bash
az containerapp update \
  --name "$AZ_CONTAINER_APP" \
  --resource-group "$AZ_RESOURCE_GROUP" \
  --image "$AZ_ACR_LOGIN_SERVER/hydra-web:latest" \
  --container-name web

az containerapp update \
  --name "$AZ_CONTAINER_APP" \
  --resource-group "$AZ_RESOURCE_GROUP" \
  --image "$AZ_ACR_LOGIN_SERVER/hydra-api:latest" \
  --container-name api

az containerapp update \
  --name "$AZ_CONTAINER_APP" \
  --resource-group "$AZ_RESOURCE_GROUP" \
  --image "$AZ_ACR_LOGIN_SERVER/hydra-jupyter:latest" \
  --container-name jupyter
```

Si Azure mantiene la misma revision porque la etiqueta sigue siendo `latest`,
fuerza un cambio inocuo de template:

```bash
export HYDRA_DEPLOY_VERSION="$(date +%Y%m%d-%H%M)"

az containerapp update \
  --name "$AZ_CONTAINER_APP" \
  --resource-group "$AZ_RESOURCE_GROUP" \
  --container-name api \
  --set-env-vars PYTHONPATH=/app HYDRA_DEPLOY_VERSION="$HYDRA_DEPLOY_VERSION"
```

Si solo has reconstruido una imagen, basta con ejecutar el `az containerapp
update` de ese contenedor.

## 7. Cambiar acceso de Jupyter con o sin token

El despliegue actual no pide token:

```bash
az containerapp update \
  --name "$AZ_CONTAINER_APP" \
  --resource-group "$AZ_RESOURCE_GROUP" \
  --container-name jupyter \
  --set-env-vars JUPYTER_TOKEN=
```

Para volver a proteger Jupyter con token:

```bash
export JUPYTER_TOKEN=$(openssl rand -hex 24)
printf "%s\n" "$JUPYTER_TOKEN" > /private/tmp/hydra-jupyter-token.txt

az containerapp update \
  --name "$AZ_CONTAINER_APP" \
  --resource-group "$AZ_RESOURCE_GROUP" \
  --container-name jupyter \
  --set-env-vars JUPYTER_TOKEN="$JUPYTER_TOKEN"
```

## 8. Cambiar el dominio

Hay dos casos distintos.

### Cambiar solo el nombre generado por Azure

La URL actual contiene el nombre de la Container App:

```text
https://hydra-web.yellowwave-5aaa93b0.spaincentral.azurecontainerapps.io/
```

`hydra-web` no se renombra directamente. Si quieres otra URL generada por Azure,
por ejemplo:

```text
https://hydra.yellowwave-5aaa93b0.spaincentral.azurecontainerapps.io/
```

hay que crear otra Container App con otro `AZ_CONTAINER_APP`, usando las mismas
imagenes, entorno y Azure Files. Despues se puede borrar la antigua.

### Usar un dominio propio

Ejemplo:

```bash
export HYDRA_CUSTOM_DOMAIN="hydra.tudominio.com"
export HYDRA_DEFAULT_FQDN=$(az containerapp show \
  --name "$AZ_CONTAINER_APP" \
  --resource-group "$AZ_RESOURCE_GROUP" \
  --query properties.configuration.ingress.fqdn \
  --output tsv)

export HYDRA_VERIFICATION_ID=$(az containerapp show \
  --name "$AZ_CONTAINER_APP" \
  --resource-group "$AZ_RESOURCE_GROUP" \
  --query properties.customDomainVerificationId \
  --output tsv)

printf "CNAME %s -> %s\n" "$HYDRA_CUSTOM_DOMAIN" "$HYDRA_DEFAULT_FQDN"
printf "TXT asuid.%s -> %s\n" "${HYDRA_CUSTOM_DOMAIN%%.*}" "$HYDRA_VERIFICATION_ID"
```

En tu proveedor DNS crea:

```text
CNAME  hydra        hydra-web.yellowwave-5aaa93b0.spaincentral.azurecontainerapps.io
TXT    asuid.hydra  <HYDRA_VERIFICATION_ID>
```

Cuando el DNS haya propagado:

```bash
az containerapp hostname add \
  --name "$AZ_CONTAINER_APP" \
  --resource-group "$AZ_RESOURCE_GROUP" \
  --hostname "$HYDRA_CUSTOM_DOMAIN"

az containerapp hostname bind \
  --name "$AZ_CONTAINER_APP" \
  --resource-group "$AZ_RESOURCE_GROUP" \
  --environment "$AZ_CONTAINER_ENV" \
  --hostname "$HYDRA_CUSTOM_DOMAIN" \
  --validation-method CNAME
```

Comprobar dominios asociados:

```bash
az containerapp hostname list \
  --name "$AZ_CONTAINER_APP" \
  --resource-group "$AZ_RESOURCE_GROUP" \
  --output table
```

Quitar un dominio:

```bash
az containerapp hostname delete \
  --name "$AZ_CONTAINER_APP" \
  --resource-group "$AZ_RESOURCE_GROUP" \
  --hostname "$HYDRA_CUSTOM_DOMAIN" \
  --yes
```

Documentacion oficial:

- Azure Container Apps hostnames:
  https://learn.microsoft.com/en-us/cli/azure/containerapp/hostname
- Custom domains and managed certificates:
  https://learn.microsoft.com/azure/container-apps/custom-domains-managed-certificates

## 9. Sesiones Jupyter y datos compartidos

El Jupyter desplegado es una unica aplicacion interna, pero la web no abre ya
los notebooks base directamente. Los enlaces de la seccion "Notebooks" llaman a:

```text
/api/notebooks/session?path=<notebook_relativo.ipynb>
```

Ese endpoint:

- crea una cookie anonima `hydra_jupyter_session`;
- copia los notebooks base a `dockerdata`, dentro de
  `/workspace/data/jupyter_sessions/<session_id>/notebooks/`;
- redirige a Jupyter sobre la copia de esa sesion.
  Como Jupyter tiene raiz en `/workspace/data`, la URL visible es:
  `/jupyter/lab/tree/jupyter_sessions/<session_id>/notebooks/...`.

Para forzar una sesion limpia desde el navegador:

```text
/api/notebooks/session?new=true&path=climate/extreme_value_analysis.ipynb
```

Importante: esto evita pisar los notebooks originales y reduce conflictos
accidentales entre usuarios. No sustituye a una autenticacion multiusuario real.
Para produccion con usuarios identificados, la evolucion natural seria
JupyterHub, Azure Container Apps Jobs por usuario o un backend que cree un
contenedor Jupyter independiente por sesion.

Los datos compartidos de HYDRA deben subirse a `dockerdata`. Dentro de los
contenedores esa raiz aparece como `/workspace/data`. Para crear carpetas base:

```bash
export AZ_STORAGE_KEY=$(az storage account keys list \
  --resource-group "$AZ_RESOURCE_GROUP" \
  --account-name "$AZ_STORAGE_ACCOUNT" \
  --query "[0].value" \
  --output tsv)

for folder in hms hec_ras swat sfincs aemet era5 gpm ogimet jupyter_sessions; do
  az storage directory create \
    --account-name "$AZ_STORAGE_ACCOUNT" \
    --account-key "$AZ_STORAGE_KEY" \
    --share-name "$AZ_FILE_SHARE" \
    --name "$folder"
done
```

Para subir datos locales necesarios al Files share:

```bash
az storage file upload-batch \
  --account-name "$AZ_STORAGE_ACCOUNT" \
  --account-key "$AZ_STORAGE_KEY" \
  --destination "$AZ_FILE_SHARE" \
  --destination-path hms \
  --source data/hms

az storage file upload-batch \
  --account-name "$AZ_STORAGE_ACCOUNT" \
  --account-key "$AZ_STORAGE_KEY" \
  --destination "$AZ_FILE_SHARE" \
  --destination-path hec_ras \
  --source data/hec_ras
```

Repetir el mismo patron para `swat`, `sfincs`, `aemet`, `era5`, `gpm`,
`ogimet`, `copernicus`, `esgf`, `soilgrids` o cualquier otra fuente cuando esos
datos existan localmente. Los catalogos y notebooks base se incluyen en las
imagenes Docker; los productos descargados o generados viven en `dockerdata`.

Mapa de rutas:

```text
Azure Files share dockerdata
└── /                         -> /workspace/data dentro del contenedor
    ├── jupyter_sessions/     -> copias editables por usuario/navegador
    ├── ogimet/               -> descargas OGIMET
    ├── aemet/                -> descargas AEMET
    ├── era5/                 -> descargas ERA5
    ├── gpm/                  -> descargas GPM
    ├── persiann/             -> descargas PERSIANN
    ├── copernicus/           -> descargas CDS/Copernicus
    ├── esgf/                 -> descargas ESGF/CMIP6
    ├── soilgrids/            -> raster de suelos
    ├── hms/                  -> proyectos HEC-HMS
    ├── hec_ras/              -> proyectos HEC-RAS
    ├── swat/                 -> proyectos SWAT+
    └── sfincs/               -> proyectos SFINCS
```

## 10. Comprobaciones

Obtener URL publica:

```bash
az containerapp show \
  --resource-group "$AZ_RESOURCE_GROUP" \
  --name "$AZ_CONTAINER_APP" \
  --query properties.configuration.ingress.fqdn \
  --output tsv
```

Comprobar estado:

```bash
az containerapp show \
  --name "$AZ_CONTAINER_APP" \
  --resource-group "$AZ_RESOURCE_GROUP" \
  --query "{fqdn:properties.configuration.ingress.fqdn,runningStatus:properties.runningStatus,latestReadyRevision:properties.latestReadyRevisionName}" \
  --output table
```

Comprobar endpoints:

```bash
export HYDRA_URL="https://hydra-web.yellowwave-5aaa93b0.spaincentral.azurecontainerapps.io"

curl -L -s -o /dev/null -w "%{http_code}\n" "$HYDRA_URL/"
curl -L -s -o /dev/null -w "%{http_code}\n" "$HYDRA_URL/api/health"
curl -L -s -o /dev/null -w "%{http_code}\n" "$HYDRA_URL/jupyter/"
```

Ver logs:

```bash
az containerapp logs show \
  --name "$AZ_CONTAINER_APP" \
  --resource-group "$AZ_RESOURCE_GROUP" \
  --follow
```

## 11. Notas operativas

- Jupyter queda bajo `/jupyter/` y actualmente no pide token.
- Las herramientas de la web llaman a `/api/...` en el mismo dominio.
- El share `dockerdata` de Azure Files se monta como `/workspace/data` en `api`
  y `jupyter`.
- El explorador de Jupyter queda limitado a `/workspace/data`, es decir, al
  contenido de `dockerdata`.
- Los notebooks editables de usuario se crean en
  `/workspace/data/jupyter_sessions/`; los notebooks base de la imagen no se
  modifican desde la web.
- `api/Dockerfile` usa Python 3.11 porque `pydsstools` fallo con Python 3.12.
- La memoria total en Consumption debe cumplir combinaciones fijas. El despliegue
  actual usa `1.75 CPU / 3.5Gi` en total:
  `web=0.25/0.5Gi`, `api=0.5/1Gi`, `jupyter=1/2Gi`.
- Los datos compartidos deben vivir en Azure Files con esta estructura:

```text
hms/
hec_ras/
swat/
sfincs/
aemet/
era5/
gpm/
ogimet/
```
