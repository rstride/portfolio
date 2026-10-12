#!/usr/bin/env bash
set -euo pipefail
image="${1:?immutable image ref required}"
component="${2:?component required}"
trivy image --scanners vuln --severity HIGH,CRITICAL --exit-code 1 --format json --output "${component}-image-scan.json" "$image"
docker pull "$image"
if [[ "$component" == ctem ]]; then
  docker run --rm --entrypoint sh "$image" -c 'test -x /usr/local/bin/ctem; nuclei -version; subfinder -version; nmap --version'
else
  fixture_env="$(mktemp)"
  container="ci-image-${component}-${GITHUB_RUN_ID:-local}-${GITHUB_RUN_ATTEMPT:-1}"
  cleanup() { docker rm -f "$container" >/dev/null 2>&1 || true; rm -f "$fixture_env"; }
  trap cleanup EXIT INT TERM
  if [[ "$component" == platform ]]; then
    python3 - "$fixture_env" <<'PYENV'
import pathlib,secrets,sys
values={key:secrets.token_urlsafe(48) for key in ('NEXTAUTH_SECRET','JWT_ACCESS_SECRET','JWT_REFRESH_SECRET','CSRF_SECRET','PASSWORD_RESET_TOKEN_SECRET','INVITATION_TOKEN_SECRET','PLATFORM_METRICS_TOKEN','PLATFORM_2FA_ENCRYPTION_KEY','CTEM_SERVICE_TOKEN_SECRET','CTEM_METRICS_TOKEN')}
values.update(NODE_ENV='production',NEXTAUTH_URL='https://app.localtest.me',DATABASE_URL='postgresql://ci:ci@unavailable:5432/ci',CTEM_URL='http://unavailable:8000',CTEM_BASE_URL='http://unavailable:8000')
p=pathlib.Path(sys.argv[1]);p.write_text(''.join(f'{k}={v}\n' for k,v in values.items()));p.chmod(0o600)
PYENV
    docker run -d --cpus=1 --memory=1g --name "$container" --env-file "$fixture_env" -p 127.0.0.1::3000 "$image"
    port="$(docker port "$container" 3000/tcp | cut -d: -f2)"
    for _ in $(seq 1 30); do
      if curl -fsS "http://127.0.0.1:${port}/api/health" >/dev/null; then exit 0; fi
      sleep 2
    done
    echo 'platform image failed liveness startup' >&2
    exit 1
  else
    docker run -d --name "$container" -p 127.0.0.1::3000 "$image"
    port="$(docker port "$container" 3000/tcp | cut -d: -f2)"
    for _ in $(seq 1 30); do
      if curl -fsSL "http://127.0.0.1:${port}/" >/dev/null; then exit 0; fi
      sleep 2
    done
    echo "$component image failed HTTP startup" >&2
    exit 1
  fi
fi
