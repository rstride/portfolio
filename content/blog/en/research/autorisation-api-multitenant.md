---
id: RESEARCH-2026-002
title: "Testing multi-tenant API authorization beyond checklists"
excerpt: "An object-, transition-, and invariant-led method for finding isolation failures that endpoint-by-endpoint testing often misses."
date: "2026-09-22"
tags: ["RESEARCH", "API", "MULTI-TENANT", "AUTHORIZATION", "BOLA"]
category: "RESEARCH"
icon: "Code"
author: "Romain Stride"
featured: true
published: true
---

Multi-tenant authorization flaws rarely appear as one obviously public endpoint. They usually emerge from inconsistent checks across operations, roles, or states of the same object.

## Model before testing

Start with a matrix of organizations, users, roles, object types, and actions. For each action, record who may create, read, update, delete, share, export, or administer the object.

This turns a route list into testable invariants. For example: “an administrator in organization A can never attach a report belonging to B to their own workspace.”

## Use multiple identities at the same time

Two tenants and three privilege levels make a useful baseline: user A, administrator A, and user B. Keep their sessions separate and capture identifiers created in each context.

Replay operations while changing one dimension at a time: object identifier, explicit tenant value, role, HTTP method, body representation, or workflow stage.

## Test transitions, not only reads

A protected read does not guarantee safe secondary operations. Export, duplication, invitation, comment, download, search, and bulk-action routes may use different checks.

State transitions are especially valuable: draft to published, member to administrator, unverified asset to verified, or open finding to fixed.

## Find competing sources of authority

An API may receive tenant context from the token, URL, request body, and database record. If these sources are not resolved through one rule, an attacker may create context confusion.

Authorization must evaluate the relationship between the identity, organization, and server-loaded object. Hiding a field in the UI or checking only a client-provided tenant identifier is insufficient.

## Validate negative invariants

A strong test does more than prove an allowed action succeeds. It proves that a forbidden action fails without disclosing the object’s existence, contents, or metadata.

Turn those invariants into contract tests: same identifier, different identities, denied result. The fix then becomes durable instead of being limited to one endpoint.

## Areas to cover

- Predictable and opaque identifiers
- Secondary and bulk operations
- Filters, search, and exports
- Webhooks, asynchronous jobs, and files
- Role changes and invitations
- Shared caches
- Administrative and support routes
- REST and GraphQL behavior differences

The goal is not random request volume. It is evidence that isolation rules remain true throughout an object’s lifecycle.
