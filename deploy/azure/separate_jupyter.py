#!/usr/bin/env python3
"""Move Jupyter to internal ingress without changing notebook URLs or Files mounts.

Default: write a reviewable plan. --apply creates Jupyter first, then updates web.
No registry passwords are printed or written to the plan/snapshot.
"""
import argparse
import copy
import json
import os
from pathlib import Path
import subprocess
import tempfile
import time

AZ = os.environ.get('AZ_CLI', 'az')
API_VERSION = '2025-07-01'


def az(*args):
    result = subprocess.run([AZ, *args, '--only-show-errors', '--output', 'json'],
                            text=True, capture_output=True)
    if result.returncode:
        raise RuntimeError(result.stderr.strip())
    return json.loads(result.stdout) if result.stdout.strip() else None


def send(method, url, body):
    # Private temporary request body; may contain an existing registry secret.
    with tempfile.TemporaryDirectory(prefix='hydra-jupyter-') as folder:
        path = Path(folder) / 'request.json'
        path.write_text(json.dumps(body))
        path.chmod(0o600)
        return az('rest', '--method', method, '--url', url, '--body', '@' + str(path))


def set_env(container, name, value):
    env = [item for item in container.get('env', []) if item['name'] != name]
    env.append({'name': name, 'value': value})
    container['env'] = env


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--resource-group', default='VisualStudioOnline-3F607BE982BD4B06820771DA8F2FFB4B')
    parser.add_argument('--web-app', default='hydra-web')
    parser.add_argument('--jupyter-app', default='hydra-jupyter')
    parser.add_argument('--web-image', required=True, help='Immutable image containing the remote-upstream nginx configuration')
    parser.add_argument('--output', default='outputs/azure-jupyter-separation')
    parser.add_argument('--apply', action='store_true')
    args = parser.parse_args()
    if args.web_image.endswith(':latest'):
        parser.error('Use an immutable web image tag.')
    existing = az('containerapp', 'show', '-n', args.web_app, '-g', args.resource_group)
    props = existing['properties']
    template = copy.deepcopy(props['template'])
    containers = {c['name']: c for c in template['containers']}
    if 'jupyter' not in containers:
        raise RuntimeError('Jupyter is already separate or absent. Use deploy.sh to update images; no migration is needed.')
    jupyter = copy.deepcopy(containers['jupyter'])
    web_template = copy.deepcopy(template)
    web_template.pop('revisionSuffix', None)
    web_template['containers'] = [c for c in web_template['containers'] if c['name'] != 'jupyter']
    web_template['scale']['minReplicas'] = 0
    web_template['scale']['maxReplicas'] = 1
    environment = props.get('environmentId') or props['managedEnvironmentId']
    new_id = existing['id'].rsplit('/', 1)[0] + '/' + args.jupyter_app
    new_url = 'https://management.azure.com' + new_id + '?api-version=' + API_VERSION
    new_body = {
        'location': existing['location'],
        'properties': {
            'managedEnvironmentId': environment,
            'configuration': {
                'activeRevisionsMode': 'Single',
                'ingress': {'external': False, 'targetPort': 8888, 'transport': 'auto', 'allowInsecure': False},
                'registries': copy.deepcopy(props['configuration'].get('registries', [])),
            },
            'template': {
                'containers': [jupyter],
                'volumes': copy.deepcopy(template.get('volumes', [])),
                'scale': {'minReplicas': 0, 'maxReplicas': 1, 'cooldownPeriod': 300,
                          'rules': [{'name': 'notebook-http', 'http': {'metadata': {'concurrentRequests': '10'}}}]},
            },
        },
    }
    out = Path(args.output)
    out.mkdir(parents=True, exist_ok=True)
    snapshot = copy.deepcopy(existing)
    for secret in snapshot['properties']['configuration'].get('secrets', []):
        secret.pop('value', None)
    snapshot_path = out / 'before.json'
    snapshot_path.write_text(json.dumps(snapshot, indent=2))
    snapshot_path.chmod(0o600)
    plan = {'webApp': args.web_app, 'jupyterApp': args.jupyter_app,
            'webImage': args.web_image, 'jupyterIngress': 'internal HTTPS only',
            'webContainers': [c['name'] for c in web_template['containers']],
            'jupyterResources': jupyter['resources'], 'webScale': web_template['scale'],
            'sharedVolumes': new_body['properties']['template']['volumes']}
    (out / 'plan.json').write_text(json.dumps(plan, indent=2))
    print(json.dumps(plan, indent=2))
    if not args.apply:
        print('Plan only; Azure has not changed. Re-run with --apply after building the web image.')
        return
    config = new_body['properties']['configuration']
    needed_secrets = {r['passwordSecretRef'] for r in config['registries'] if r.get('passwordSecretRef')}
    needed_secrets.update(e['secretRef'] for e in jupyter.get('env', []) if e.get('secretRef'))
    secrets = az('containerapp', 'secret', 'list', '-n', args.web_app, '-g', args.resource_group, '--show-values')
    config['secrets'] = [s for s in secrets if s['name'] in needed_secrets]
    if needed_secrets != {s['name'] for s in config['secrets']}:
        raise RuntimeError('Missing required existing secret; web was not changed.')
    # ACR admin authentication is reused. Do not clone the web managed identity.
    for registry in config['registries']:
        if not registry.get('identity'):
            registry.pop('identity', None)
        else:
            raise RuntimeError('Managed-identity registry requires explicit identity setup; web was not changed.')
    created = send('put', new_url, new_body)
    for attempt in range(60):
        created = az('containerapp', 'show', '-n', args.jupyter_app, '-g', args.resource_group)
        state = created['properties'].get('provisioningState')
        if state == 'Failed':
            raise RuntimeError('Internal Jupyter provisioning failed; web was not changed.')
        if state == 'Succeeded':
            break
        time.sleep(3)
    else:
        raise RuntimeError('Internal Jupyter is not ready; web was not changed.')
    fqdn = created['properties']['configuration']['ingress']['fqdn']
    upstream = 'https://' + fqdn
    for container in web_template['containers']:
        if container['name'] == 'web':
            container['image'] = args.web_image
            set_env(container, 'JUPYTER_UPSTREAM', upstream)
        elif container['name'] == 'api':
            set_env(container, 'JUPYTER_INTERNAL_URL', upstream)
    # Update only the template: public ingress, domains, secrets and identity stay intact.
    web_url = 'https://management.azure.com' + existing['id'] + '?api-version=' + API_VERSION
    updated = send('patch', web_url, {'properties': {'template': web_template}})
    if updated is None:
        updated = az('containerapp', 'show', '-n', args.web_app, '-g', args.resource_group)
    (out / 'after.json').write_text(json.dumps({
        'jupyterFqdn': fqdn,
        'webRevision': updated['properties'].get('latestRevisionName'),
        'webContainers': [c['name'] for c in updated['properties']['template']['containers']],
    }, indent=2))
    print('Migration submitted. Verify readiness, /api/health and a notebook session before concluding.')


if __name__ == '__main__':
    main()
