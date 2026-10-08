"""Standalone CI contract; keep the identical copy in the three source repositories."""
import argparse
import hashlib
import io
import json
import os
from pathlib import Path
import subprocess
import sys
import zipfile

ROOT = Path(__file__).resolve().parents[2]
CONFIG = json.loads((ROOT / '.github/ci/config.json').read_text())


def gh(endpoint, method='GET', data=None, raw=False):
    command = ['gh', 'api', endpoint, '--method', method]
    if data is not None:
        command += ['--input', '-']
    result = subprocess.run(command, input=json.dumps(data).encode() if data is not None else None,
                            stdout=subprocess.PIPE, stderr=subprocess.PIPE, check=False)
    if result.returncode:
        raise RuntimeError(f'GitHub API {method} {endpoint}: {result.stderr.decode()[:500]}')
    return result.stdout if raw else json.loads(result.stdout or b'null')


def git(*args):
    return subprocess.check_output(['git', '-C', str(ROOT), *args], text=True).strip()


def fingerprint(component, revision='HEAD'):
    prefixes = CONFIG['components'][component]['paths'] + CONFIG.get('shared_paths', [])
    entries = git('ls-tree', '-r', revision).splitlines()
    def included(line):
        path = line.split('\t', 1)[1]
        if path in ('README.md', 'AGENTS.md', 'platform/README.md', 'platform/AGENTS.md', 'ctem/README.md', 'ctem/AGENTS.md'):
            return False
        if path.startswith(('docs/', 'ctem/docs/')) and not path.startswith('docs/security/'):
            return False
        return any(prefix == '.' or path == prefix.rstrip('/') or path.startswith(prefix.rstrip('/') + '/') for prefix in prefixes)
    relevant = [line for line in entries if included(line)]
    if not relevant:
        raise ValueError(f'No source files for {component}')
    return hashlib.sha256('\n'.join(relevant).encode()).hexdigest()


def artifact(repo, run_id, name):
    items = gh(f'repos/{repo}/actions/runs/{run_id}/artifacts')['artifacts']
    matches = [a for a in items if a['name'] == name and not a['expired']]
    if len(matches) != 1:
        raise ValueError(f'Expected exactly one {name} artifact for run {run_id}')
    data = gh(f'repos/{repo}/actions/artifacts/{matches[0]["id"]}/zip', raw=True)
    with zipfile.ZipFile(io.BytesIO(data)) as archive:
        if archive.namelist() != [name + '.json']:
            raise ValueError('Unexpected artifact contents')
        entry = archive.getinfo(name + '.json')
        if entry.file_size > 65536:
            raise ValueError('Oversized release metadata')
        return json.loads(archive.read(entry))


def baseline(repo, sha):
    # Look backwards across successful runs. Expired or legacy evidence means run
    # every component, never assume the preceding push was verified.
    runs = gh(f'repos/{repo}/actions/workflows/ci.yml/runs?branch=main&status=success&per_page=30')['workflow_runs']
    for run in runs:
        if run['event'] not in ('push', 'workflow_dispatch'):
            continue
        if run['head_sha'] == sha or run['id'] == int(os.getenv('GITHUB_RUN_ID', '0')):
            continue
        ancestor = subprocess.run(['git', '-C', str(ROOT), 'merge-base', '--is-ancestor', run['head_sha'], sha])
        if ancestor.returncode:
            continue
        try:
            result = artifact(repo, run['id'], 'verification')
            if result['repository'] == repo and result['sha'] == run['head_sha']:
                return result
        except (RuntimeError, ValueError, KeyError, zipfile.BadZipFile):
            continue
    return {'fingerprints': {}}


def plan():
    repo = os.environ['GITHUB_REPOSITORY']
    if os.environ['GITHUB_EVENT_NAME'] == 'workflow_dispatch' and os.environ.get('GITHUB_REF') != 'refs/heads/main':
        raise ValueError('Manual releases must verify main')
    sha = git('rev-parse', 'HEAD')
    event = json.loads(Path(os.environ['GITHUB_EVENT_PATH']).read_text())
    if os.environ['GITHUB_EVENT_NAME'] == 'pull_request':
        previous = {'fingerprints': {c: fingerprint(c, event['pull_request']['base']['sha']) for c in CONFIG['components']}}
    else:
        previous = baseline(repo, sha)
    current = {c: fingerprint(c) for c in CONFIG['components']}
    changed = {c: os.environ['GITHUB_EVENT_NAME'] == 'workflow_dispatch' or value != previous.get('fingerprints', {}).get(c) for c, value in current.items()}
    manifest = {'version': 1, 'repository': repo, 'sha': sha,
                'run_id': int(os.environ['GITHUB_RUN_ID']), 'fingerprints': current, 'changed': changed}
    Path('verification.json').write_text(json.dumps(manifest, indent=2) + '\n')
    with open(os.environ['GITHUB_OUTPUT'], 'a') as output:
        for component, value in changed.items():
            output.write(f'{component}={str(value).lower()}\n')
        output.write(f'publish={str(any(changed.values())).lower()}\n')
    print(json.dumps({'changed': changed, 'baseline': previous.get('sha', 'none; full verification')}))


def result():
    needs = json.loads(os.environ['CI_NEEDS'])
    expected = json.loads(os.environ.get('CI_EXPECTED', '[]'))
    changed = json.loads(os.environ.get('CI_CHANGED', '{}'))
    expected += [c for c, value in changed.items() if value == 'true' or value is True]
    failures = [name for name, job in needs.items() if job['result'] not in ('success', 'skipped')]
    failures += [name for name in expected if needs.get(name, {}).get('result') != 'success']
    summary = '\n'.join(f'| {name} | {job["result"]} |' for name, job in needs.items())
    with open(os.environ['GITHUB_STEP_SUMMARY'], 'a') as output:
        output.write('## Verification\n\n| Check | Result |\n| --- | --- |\n' + summary + '\n')
    if failures:
        raise RuntimeError('Required verification did not pass: ' + ', '.join(sorted(set(failures))))


def publish_plan():
    event = json.loads(Path(os.environ['GITHUB_EVENT_PATH']).read_text())
    run = event['workflow_run']
    repo = os.environ['GITHUB_REPOSITORY']
    if run['conclusion'] != 'success' or run['event'] not in ('push', 'workflow_dispatch') or run['head_branch'] != 'main':
        raise ValueError('Publication requires successful main-push verification')
    proof = artifact(repo, run['id'], 'verification')
    if proof['sha'] != run['head_sha'] or proof['repository'] != repo or proof['run_id'] != run['id']:
        raise ValueError('Verification artifact does not match triggering run')
    if git('rev-parse', 'HEAD') != proof['sha']:
        raise ValueError('Checkout is not the verified revision')
    current = gh(f'repos/{repo}/commits/main')['sha']
    git('fetch', 'origin', current)
    eligible = {c: changed and fingerprint(c, current) == proof['fingerprints'][c]
                for c, changed in proof['changed'].items()}
    Path('verification.json').write_text(json.dumps(proof, indent=2) + '\n')
    with open(os.environ['GITHUB_OUTPUT'], 'a') as output:
        for c, value in eligible.items():
            output.write(f'{c}={str(value).lower()}\n')
        output.write(f'publish={str(any(eligible.values())).lower()}\n')


def release_manifest():
    proof = json.loads(Path('verification.json').read_text())
    images = json.loads(os.environ['RELEASE_IMAGES'])
    images = {k: v for k, v in images.items() if v}
    if not images:
        raise ValueError('No images were published')
    value = {'version': 1, 'repository': proof['repository'], 'sha': proof['sha'],
             'verification_run_id': proof['run_id'], 'publication_run_id': int(os.environ['GITHUB_RUN_ID']),
             'fingerprints': {c: proof['fingerprints'][c] for c in images}, 'images': images}
    Path('release.json').write_text(json.dumps(value, indent=2) + '\n')
    with open(os.environ['GITHUB_STEP_SUMMARY'], 'a') as output:
        output.write('## Published\n\nVerified source: `' + proof['sha'] + '`\n\n')
        for component, image in images.items():
            output.write(f'- {component}: `{image}` (scanned, smoked and signed)\n')


def dispatch():
    event = json.loads(Path(os.environ['GITHUB_EVENT_PATH']).read_text())
    run = event['workflow_run']
    if run['conclusion'] != 'success' or run['event'] != 'workflow_run' or run['head_branch'] != 'main':
        raise ValueError('Delivery requires successful Publish workflow')
    # workflow_run.head_sha can name a newer default-branch revision. The signed
    # publication artifact identifies the actual checkout and verification run.
    release = artifact(os.environ['GITHUB_REPOSITORY'], run['id'], 'release')
    if release['publication_run_id'] != run['id'] or release['repository'] != os.environ['GITHUB_REPOSITORY']:
        raise ValueError('Publication artifact repository/run mismatch')
    gh('repos/rstride/PrismaPlatform/dispatches', 'POST',
       {'event_type': 'release-ready', 'client_payload': release})
    with open(os.environ['GITHUB_STEP_SUMMARY'], 'a') as output:
        output.write(f'Published `{release["sha"]}`. Delivery queued in PrismaPlatform.\n')


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('command', choices=['plan', 'result', 'publish-plan', 'release', 'dispatch'])
    args = parser.parse_args()
    try:
        {'plan': plan, 'result': result, 'publish-plan': publish_plan,
         'release': release_manifest, 'dispatch': dispatch}[args.command]()
    except Exception as error:
        print(f'::error::{error}', file=sys.stderr)
        sys.exit(1)
