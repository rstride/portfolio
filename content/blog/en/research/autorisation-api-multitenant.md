---
id: RESEARCH-2026-002
title: "Testing multi-tenant API authorization beyond checklists"
excerpt: "A worked tenant and role matrix, request examples, workflow tests, and regression pseudocode for assessing multi-tenant API isolation."
date: "2026-09-22"
updated: "2026-10-13"
tags: ["RESEARCH", "API", "MULTI-TENANT", "AUTHORIZATION", "BOLA"]
category: "RESEARCH"
icon: "Code"
author: "Romain Stride"
featured: true
published: true
---

Multi-tenant authorization is a relationship between an authenticated identity, its current memberships, an object, and an action. Testing only one successful request per endpoint leaves that relationship largely unexamined.

This article develops a synthetic example, not a client finding or a claim of newly discovered vulnerability. The domains, identities, objects, and responses below are fictional. The method turns a product policy into positive and negative checks that remain useful after remediation.

## Start with an explicit policy

Our example service stores reports for organizations A and B. A member may read reports in their organization and edit their own drafts. An administrator may publish and export reports in their organization. Neither role may access another organization's reports. There are no public links or support exceptions in this example.

Seed independent sessions for `member_A`, `admin_A`, and `member_B`, plus these fixtures:

| Object | Context |
| --- | --- |
| `report_A1` | A; owner `member_A`; draft |
| `report_A2` | A; owner `admin_A`; published |
| `report_B1` | B; owner `member_B`; draft |

The expected authorization matrix is:

| Actor | A1 allowed actions | Read B1 |
| --- | --- | --- |
| `member_A` | read, edit | deny |
| `admin_A` | read, publish, export | deny |
| `member_B` | none | allow |

Unlisted actions on A1 are denied.

The administrator's denied edit is intentional: our policy reserves draft editing to the owner. Adapt the matrix to the actual product contract rather than assuming that “admin” means every action.

## Establish a legitimate request, then vary one dimension

The following request is illustrative. `<TOKEN_MEMBER_A>` means a valid test token for `member_A` in organization A:

```http
GET /api/organizations/A/reports/report_A1 HTTP/1.1
Host: api.example.test
Authorization: Bearer <TOKEN_MEMBER_A>
```

The expected result is `200` with A1's data. Keep the same token and change only the object:

```http
GET /api/organizations/A/reports/report_B1 HTTP/1.1
Host: api.example.test
Authorization: Bearer <TOKEN_MEMBER_A>
```

This example chooses `404` with no B1 data or metadata. Choosing `403` may also fit a product policy; the required invariant is denial without unintended disclosure. Now change the path organization to B while keeping the token, and test the same B1 identifier under `admin_A`. An administrator role must not erase the tenant boundary.

Predictable IDs are not a prerequisite: legitimate accounts in two tenants supply known object IDs. OWASP's [BOLA guidance](https://api-security.owasp.org/editions/2023/en/0xa1-broken-object-level-authorization/) identifies missing object-level checks as the issue, rather than the mere use of a particular identifier format.

## Test conflicting sources of tenant context

A request may contain an organization in its path, token, header, and body. Record the intended meaning of each. Server-side membership and object ownership must be resolved before acting; checking only that the caller belongs to path organization A does not authorize an object loaded from B.

For writes, keep fixtures disposable and compare object state before and after. Send a conflicting body organization, a foreign related-object ID, and a mixed-tenant bulk set. In this example, a bulk operation is atomic: a foreign item causes denial with no changes to any item. Test that stated behavior rather than assuming it from the status code.

## Follow state transitions and delayed work

A protected read says little about publish, duplicate, export, or download operations. Exercise the lifecycle:

- `member_A` can edit their draft but cannot publish it.
- `admin_A` can publish A1; its owner can no longer edit it as a draft.
- Removing `member_A` from A must revoke subsequent reads, even with an unexpired token.
- An export worker must recheck authorization before producing an artifact if membership changes after enqueueing. The download must enforce its own access policy.
- A revoked invitation must not grant membership when an old acceptance link is replayed.

Capture worker and artifact behavior as well as the initiating HTTP response. Shared caches must preserve the same identity/tenant isolation on hits as on misses.

## Turn the policy into regression tests

This is pseudocode: `fixtures`, `client`, and `store` represent the application's test helpers, not a runnable library. Each case starts with fresh data. `object_snapshot` includes business state and version; security audit events are checked separately. `read_cases` supplies actor, path organization, object ID, and expected status from the policy matrix. `leaks_object_data_or_metadata` checks the response body and headers for foreign object content, names, and identifiers.

```python
for actor, organization, object_id, expected in read_cases:
    response = client(actor).get_report(organization, object_id)
    assert response.status == expected
    if expected == 200:
        assert response.json["id"] == object_id
    else:
        assert not leaks_object_data_or_metadata(response)

before = store.object_snapshot("report_A1")
response = client("member_A").publish("A", "report_A1")
assert response.status == 403
assert store.object_snapshot("report_A1") == before
assert not store.has_publish_job("report_A1")
```

Include positive controls so a broken route or unavailable dependency cannot masquerade as successful isolation. OWASP's [authorization cheat sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authorization_Cheat_Sheet.html) recommends checking permissions consistently and testing authorization behavior.

## Define what the result proves

Record actor, effective memberships, object provenance, request, response, side effects, build, and test time. A denied request with an already queued export is a failed invariant; one corrected route does not establish the entire object's isolation.

For preparation, use the [SaaS assessment checklist](/en/blog/preparer-saas-pentest). For documenting a failure and its closure, see [the finding-to-retest guide](/en/blog/rapport-remediation-retest). The useful deliverable is a policy-backed set of observations, including what remains untested.
