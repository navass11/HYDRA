@description('Azure region for all resources')
param location string = resourceGroup().location

@description('Short prefix used in all resource names')
param prefix string = 'hydra'

@description('JupyterLab auth token. Empty = no auth (dev only). Always set in production.')
@secure()
param jupyterToken string = ''

// ── Container Registry ────────────────────────────────────────────────────────
resource acr 'Microsoft.ContainerRegistry/registries@2023-07-01' = {
  name: '${prefix}acr${uniqueString(resourceGroup().id)}'
  location: location
  sku: { name: 'Basic' }
  properties: { adminUserEnabled: false }
}

// ── Log Analytics (required by Container Apps) ────────────────────────────────
resource logs 'Microsoft.OperationalInsights/workspaces@2022-10-01' = {
  name: '${prefix}-logs'
  location: location
  properties: {
    sku: { name: 'PerGB2018' }
    retentionInDays: 30
  }
}

// ── Container Apps Environment (consumption plan) ─────────────────────────────
resource env 'Microsoft.App/managedEnvironments@2024-03-01' = {
  name: '${prefix}-env'
  location: location
  properties: {
    appLogsConfiguration: {
      destination: 'log-analytics'
      logAnalyticsConfiguration: {
        customerId: logs.properties.customerId
        sharedKey: logs.listKeys().primarySharedKey
      }
    }
  }
}

// ── User-assigned identity (ACR pull — no admin credentials needed) ───────────
resource identity 'Microsoft.ManagedIdentity/userAssignedIdentities@2023-01-31' = {
  name: '${prefix}-identity'
  location: location
}

resource acrPullRole 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(acr.id, identity.id, 'acrpull')
  scope: acr
  properties: {
    roleDefinitionId: subscriptionResourceId(
      'Microsoft.Authorization/roleDefinitions',
      '7f951dda-4ed3-4680-a7ca-43fe172d538d' // AcrPull built-in role
    )
    principalId: identity.properties.principalId
    principalType: 'ServicePrincipal'
  }
}

// ── Web Container App (Astro + nginx static site) ─────────────────────────────
resource webApp 'Microsoft.App/containerApps@2024-03-01' = {
  name: '${prefix}-web'
  location: location
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: { '${identity.id}': {} }
  }
  properties: {
    environmentId: env.id
    configuration: {
      ingress: {
        external: true
        targetPort: 80
        transport: 'http'
      }
      registries: [{
        server: acr.properties.loginServer
        identity: identity.id
      }]
    }
    template: {
      containers: [{
        name: 'web'
        // Placeholder replaced by GitHub Actions on first push to main.
        image: 'mcr.microsoft.com/azuredocs/containerapps-helloworld:latest'
        resources: { cpu: json('0.25'), memory: '0.5Gi' }
      }]
      scale: { minReplicas: 1, maxReplicas: 1 }
    }
  }
}

// ── JupyterLab Container App ──────────────────────────────────────────────────
var hasToken = !empty(jupyterToken)

resource jupyterApp 'Microsoft.App/containerApps@2024-03-01' = {
  name: '${prefix}-jupyter'
  location: location
  identity: {
    type: 'UserAssigned'
    userAssignedIdentities: { '${identity.id}': {} }
  }
  properties: {
    environmentId: env.id
    configuration: {
      ingress: {
        external: true
        targetPort: 8888
        transport: 'http'
      }
      registries: [{
        server: acr.properties.loginServer
        identity: identity.id
      }]
      secrets: hasToken ? [{ name: 'jupyter-token', value: jupyterToken }] : []
    }
    template: {
      containers: [{
        name: 'jupyter'
        // Placeholder replaced by GitHub Actions on first push to main.
        image: 'mcr.microsoft.com/azuredocs/containerapps-helloworld:latest'
        resources: { cpu: json('2'), memory: '4Gi' }
        env: hasToken ? [
          { name: 'JUPYTER_TOKEN', secretRef: 'jupyter-token' }
          { name: 'JUPYTER_BASE_URL', value: '/' }
        ] : [
          { name: 'JUPYTER_TOKEN', value: '' }
          { name: 'JUPYTER_BASE_URL', value: '/' }
        ]
      }]
      // Scale to zero when idle — saves cost on the heavy container.
      scale: { minReplicas: 0, maxReplicas: 1 }
    }
  }
}

// ── Outputs ───────────────────────────────────────────────────────────────────
output acrLoginServer string = acr.properties.loginServer
output acrName string = acr.name
output webUrl string = 'https://${webApp.properties.configuration.ingress.fqdn}'
output jupyterUrl string = 'https://${jupyterApp.properties.configuration.ingress.fqdn}'
