---
id: GUIDE-2026-001
title: "From finding to retest: making pentest reports actionable"
excerpt: "A fictional cross-tenant export finding shows how evidence, root cause, impact, remediation, and retest criteria become verifiable engineering work."
date: "2026-09-15"
updated: "2026-10-13"
tags: ["GUIDE", "REPORTING", "REMEDIATION", "RETEST", "PENTEST"]
category: "GUIDE"
icon: "Database"
author: "Romain Stride"
featured: true
published: true
---

A finding should let another engineer understand the failure, reproduce it with authorized test data, and determine whether the correction covers its variants. Page count and tool output are poor substitutes for that chain.

The finding below is entirely fictional. Domains, identities, report IDs, build labels, and responses are illustrative, not observations from a client engagement. It uses the policy developed in the [multi-tenant authorization article](/en/blog/autorisation-api-multitenant).

## A finding title that describes the consequence

**An organization administrator can export another organization's report.**

Affected component: the report-export endpoint and background worker in the fictional build `assessment-demo-1`. Preconditions: a valid administrator account in A and a known report identifier in B. No anonymous access, modification, deletion, or domain compromise is established by this example.

The policy permits administrators to export only their own organization's reports. The observation is that the sample implementation checks the role but fails to bind the loaded report to the caller's organization.

## Keep the evidence minimal and complete

Create A and B using synthetic data. Capture a legitimate export of A1 as `admin_A` first, then submit B1 with the same identity. `<TOKEN_ADMIN_A>` represents a valid token for that fixture:

```http
POST /api/organizations/A/reports/report_B1/exports HTTP/1.1
Host: api.example.test
Authorization: Bearer <TOKEN_ADMIN_A>
Content-Type: application/json

{"format":"csv"}
```

The fictional vulnerable behavior returns `202` and an export job. That response alone is insufficient: follow the job and the authorized download flow, and show that the resulting artifact contains B1's seeded marker `tenant-b-demo`. Retain request/job/artifact correlation with timestamps, redacting tokens and download secrets.

The evidence bundle also records ownership of B1 before the request, the acting account's memberships, and a positive control showing ordinary A export works. There is no need to export a real customer's dataset to prove the boundary failure.

## Separate observation, impact, and uncertainty

Observation: the A identity obtains B1's export artifact. Demonstrated impact in the fictional scenario: cross-tenant disclosure of report contents available through that export path.

Potential breadth depends on object discovery, exportable data, deployment policy, and other route variants. Do not turn one report into a claim that every tenant's entire dataset was accessed. Similarly, a job response without a retrievable artifact supports a different, narrower observation.

Prioritize using exposure, required privileges, data sensitivity, exploit reliability, and existing controls. This example does not assign a numeric severity without a real deployment context. OWASP's [BOLA description](https://api-security.owasp.org/editions/2023/en/0xa1-broken-object-level-authorization/) provides the relevant vulnerability category.

## Root cause and a remediation path

The fictional handler validates that the caller is an administrator in path organization A, then loads a report globally by ID. The worker later trusts that queued ID. A role check exists; the identity–organization–object relationship is missing.

An immediate containment could disable affected exports until the check is deployed. The durable correction must authorize the selected object in the current membership context before enqueueing, revalidate relevant rights before worker output, and protect artifact download. Pending jobs and previously issued links need review; fixing only the HTTP handler leaves earlier work in flight.

Centralize the policy where appropriate and examine duplicate, bulk, search, and download paths for the same lookup pattern. A random identifier is defense in depth, not a replacement for authorization.

## Define closure before implementing the fix

Use a fresh build identifier and fresh fixtures for retest:

| Case | Required result |
| --- | --- |
| `admin_A` exports A1 | job completes; artifact contains only A1 |
| `admin_A` requests B1 under path A or B | denied; no job or artifact |
| `member_A` requests A1 export | denied by the role policy |
| bulk request mixes A1 and B1 | entire operation denied; no partial jobs |
| admin membership revoked after enqueue | worker refuses to produce the artifact |
| A identity downloads B artifact | denied; no content or metadata leakage |

In this sample contract, foreign objects return `404` and a same-tenant role denial returns `403`. The exact status convention may differ in another product, but side-effect and disclosure checks remain essential.

## Record the decision and its limits

Attach tested build, time, fixture identities, original and variant results, and any untested worker/cache paths. Close as fixed only when the agreed tests pass. Use “partially fixed” when one boundary still fails and “not verified” when access or deployment prevents retest; unavailable access is not proof of remediation.

Accepted risk is a separate decision with an owner, rationale, and review date. Preserve that distinction in the ticket. The report becomes useful engineering work when its claims, corrective actions, and closure evidence refer to the same security objective. The [SaaS preparation guide](/en/blog/preparer-saas-pentest) explains how to arrange the necessary access before testing.
