# CI/CD

Push directly to `main`. **Verify** scopes work from the last successfully verified
component fingerprint and finishes with **CI result**. A documentation push after
failed code cannot bypass verification. Missing baseline evidence runs all checks.
**Publish** accepts only successful main verification of the exact source revision,
builds once, scans/smokes the digest, signs it, and retains provenance/SBOMs.
**Deliver** sends release-ready evidence to PrismaPlatform using a short-lived
GitHub App token. Docs-only pushes do not publish images.

Publication finalization keeps an immutable `publication-receipts/<run-id>` Git
ref with the digest and verification proof. Actions artifacts disappear on
reruns; this durable receipt restores them and skips rebuilding. Only the
finalizer has native source-repository Contents write permission. Retain these
refs for deployed and rollback releases; transient reports retain their normal
artifact expiry.

Configure `DELIVERY_APP_ID` and `DELIVERY_APP_PRIVATE_KEY` after installing the one
private delivery App on all three repositories. The key belongs in Actions Secrets,
never chat or Git. GHCR publication uses this repository's native `GITHUB_TOKEN`.
Legacy token/SSH deployment checkout and generated CI skip markers are removed.
The divergent promotion credentials were retired after healthy baseline delivery.

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
Automatic promotion was enabled on October 13, 2026 after healthy platform/CTEM
recovery observations, monitoring preservation and worker registry-credential
validation. The platform browser gate is enforced after five complete green runs.
Successful browser and deployment observations wake the central durable queue;
a scheduled heartbeat is a fallback. Documentation pushes run lightweight
verification and do not rebuild or promote an image.

The queued main-push release completed automatically after activation: publication
[38306490939](https://github.com/rstride/portfolio/actions/runs/38306490939),
tested App [PR 59](https://github.com/rstride/PrismaPlatform/pull/59), and healthy
production observation [38388055242](https://github.com/rstride/PrismaPlatform/actions/runs/38388055242).
No per-release recovery dispatch was used. The subsequent documentation push
verified successfully and skipped image publication.
