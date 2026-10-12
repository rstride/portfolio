# CI/CD

Push directly to `main`. **Verify** scopes work from the last successfully verified
component fingerprint and finishes with **CI result**. A documentation push after
failed code cannot bypass verification. Missing baseline evidence runs all checks.
**Publish** accepts only successful main verification of the exact source revision,
builds once, scans/smokes the digest, signs it, and retains provenance/SBOMs.
**Deliver** sends release-ready evidence to PrismaPlatform using a short-lived
GitHub App token. Docs-only pushes do not publish images.

Configure `DELIVERY_APP_ID` and `DELIVERY_APP_PRIVATE_KEY` after installing the one
private delivery App on all three repositories. The key belongs in Actions Secrets,
never chat or Git. GHCR publication uses this repository's native `GITHUB_TOKEN`.
Legacy token/SSH deployment checkout and generated CI skip markers are removed.
Retire their old secrets only after the migration's real production cycle succeeds.

PrismaPlatform keeps a durable per-component queue, verifies source runs/signatures
and current state, creates an image-only GitOps PR, tests its exact commit and
merges through the App. Publication, promotion and deployment are reported
separately. Failed rollout pauses that component. The central rollback workflow
uses a recorded healthy digest; it never reverses migrations. Argo tracks `main`.

Use `.nvmrc` and the exact npm `packageManager` version locally, then run `npm ci`,
lint, tests and production build. HIGH/CRITICAL production dependency/image scans
block delivery. Development dependency advisories remain visible through `npm audit`.
All actions and scanner/tool versions are pinned. Workflows remain local so public
portfolio has no dependency on private reusable workflows.

Central App/runner/package setup, activation, release and rollback instructions:
[PrismaPlatform CI/CD contract](https://github.com/rstride/PrismaPlatform/blob/main/docs/ci-cd.md).
Automatic promotion is staged until production recovery and observer setup complete.
