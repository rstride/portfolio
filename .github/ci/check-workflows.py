#!/usr/bin/env python3
"""Check executable workflow structure, rather than matching shell snippets."""
import json
from pathlib import Path
import re
import subprocess

ROOT = Path(__file__).resolve().parents[2]


def read_yaml(path):
    return json.loads(subprocess.check_output([
        'ruby', '-ryaml', '-rjson', '-e',
        'd = YAML.safe_load(File.read(ARGV[0]), aliases: true); d["on"] = d.delete(true) if d.key?(true); puts JSON.generate(d)', str(path)], text=True))


def validate(root=ROOT):
    errors = []
    workflows = {p.name: read_yaml(p) for p in (root / '.github/workflows').glob('*.yml')}
    for filename, workflow in workflows.items():
        for job_name, job in workflow.get('jobs', {}).items():
            if not job.get('timeout-minutes'):
                errors.append(f'{filename}/{job_name}: timeout is required')
            for step in job.get('steps', []):
                action = step.get('uses', '')
                if action and not re.fullmatch(r'[\w./-]+@[0-9a-f]{40}', action):
                    errors.append(f'{filename}/{job_name}: action is not SHA pinned: {action}')
                if re.search(r'\[skip ci\]|\[ci skip\]|git push[^\n]*HEAD:main', step.get('run', '')):
                    errors.append(f'{filename}/{job_name}: bypasses checked promotion')
    ci = workflows['ci.yml']
    if set(ci['on']) != {'push', 'pull_request', 'workflow_dispatch'}:
        errors.append('Verify must accept pushes, PRs, and manual verification')
    if ci.get('permissions', {}).get('contents') != 'read' or ci.get('permissions', {}).get('actions') != 'read':
        errors.append('Verify must read source and ancestral verification evidence')
    for name, job in ci['jobs'].items():
        if any(value == 'write' for value in job.get('permissions', {}).values()):
            errors.append(f'Verify/{name}: verification must not receive write permission')
    gate = ci['jobs']['ci-result']
    if gate['if'] != 'always()' or gate.get('name') != 'CI result':
        errors.append('CI result must always report')
    if set(gate['needs']) != set(ci['jobs']) - {'ci-result'}:
        errors.append('CI result must depend on every verification job')
    release = next(w for w in workflows.values() if w['name'] == 'Publish')
    if release['on']['workflow_run']['workflows'] != ['Verify']:
        errors.append('Publish must follow Verify')
    if release['on']['workflow_run'].get('branches') != ['main'] or release['on']['workflow_run'].get('types') != ['completed']:
        errors.append('Publish must follow completed main verification')
    if 'success' not in release['jobs']['candidate'].get('if', ''):
        errors.append('Publish must require successful verification')
    for name, job in release['jobs'].items():
        if name not in ('candidate', 'publication-result', 'ctem-runtime'):
            if job.get('needs') != 'candidate' or not job.get('if'):
                errors.append(f'Publish/{name}: image must depend on eligibility decision')
            if job.get('permissions', {}).get('packages') != 'write' or job.get('permissions', {}).get('id-token') != 'write':
                errors.append(f'Publish/{name}: native package publication and signing permissions required')
    if 'ctem-runtime' in release['jobs']:
        mode = release['jobs']['ctem-runtime']
        if set(mode['needs']) != {'candidate', 'ctem'} or mode['runs-on'] != 'ubuntu-24.04' or mode.get('permissions', {}).get('packages') != 'read':
            errors.append('CTEM modes must validate the built candidate on a hosted runner')
        if 'ctem-runtime' not in release['jobs']['publication-result']['needs'] or "needs.ctem-runtime.result == 'success'" not in release['jobs']['publication-result']['if']:
            errors.append('Release evidence requires successful CTEM mode validation')
    deliver = workflows['deliver.yml']
    if deliver['on']['workflow_run']['workflows'] != ['Publish']:
        errors.append('Deliver must follow Publish')
    if not any('actions/create-github-app-token@' in s.get('uses', '') for s in deliver['jobs']['queue']['steps']):
        errors.append('Delivery must use a short-lived App token')
    if 'success' not in deliver['jobs']['queue'].get('if', '') or deliver['on']['workflow_run'].get('branches') != ['main']:
        errors.append('Deliver must require successful main publication')
    return errors


if __name__ == '__main__':
    errors = validate()
    if errors:
        raise SystemExit('\n'.join(errors))
    print('Workflow contract passed')
