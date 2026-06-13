using 'main.bicep'

param prefix = 'hydra'
param location = 'westeurope'
// jupyterToken: pass at deploy time — never commit the real value here.
// Example: az deployment group create ... --parameters jupyterToken=$JUPYTER_TOKEN
