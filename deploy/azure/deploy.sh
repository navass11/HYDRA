#!/usr/bin/env bash
# Usage: ./deploy/azure/deploy.sh TAG
# Pass the short SHA printed by the GitHub Actions workflow, or a manual release tag.
set -euo pipefail

if [[ $# -ne 1 ]]; then
  echo "Usage: $0 TAG" >&2
  echo "" >&2
  echo "Example:" >&2
  echo "  $0 20260613-pilot-notebook-fixes" >&2
  echo "  $0 <short-github-sha>" >&2
  exit 2
fi

TAG="$1"
RG="VisualStudioOnline-3F607BE982BD4B06820771DA8F2FFB4B"
APP="hydra-web"
REG="hydratoolsacr.azurecr.io"

if [[ "$TAG" == "latest" ]]; then
  echo "Refusing to deploy 'latest'." >&2
  echo "Use the immutable short SHA printed by GitHub Actions or an explicit release tag." >&2
  exit 2
fi

echo "Deploying tag: $TAG"

az containerapp update -n "$APP" -g "$RG" --container-name web     --image "$REG/hydra-web:$TAG"     --output none
az containerapp update -n "$APP" -g "$RG" --container-name api     --image "$REG/hydra-api:$TAG"     --output none
az containerapp update -n "$APP" -g "$RG" --container-name jupyter --image "$REG/hydra-jupyter:$TAG" --output none

echo "Done — https://hydra-web.yellowwave-5aaa93b0.spaincentral.azurecontainerapps.io"
