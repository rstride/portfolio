---
title: "PrismaSec"
summary: "Designing and shipping a CTEM platform that turns verified public assets into prioritized risk, remediation plans, and traceable retests."
role: "Founder, CEO & Lead Engineer"
period: "2025 — present"
tags: ["CTEM", "NEXT.JS", "RUST", "KUBERNETES", "SECURITY ENGINEERING"]
externalUrl: "https://prismasec.fr"
coverImage: "/projects/prismasec-product.webp"
coverAlt: "Public PrismaSec visual representing an attack surface and its security controls"
ogImage: "/projects/prismasec-og.png"
seoTitle: "PrismaSec CTEM Case Study | Romain Stride"
seoDescription: "A case study on PrismaSec: verified assets, controlled assessments, risk prioritization, remediation, retesting, and separated service boundaries."
updated: "2026-09-29"
featured: true
published: true
---

## The problem

Teams expose domains, applications, and APIs without always having a continuous view of what is genuinely exploitable. Security tools often produce fragmented signals: inventory in one place, vulnerabilities in another, and reports that are difficult to connect to remediation work.

PrismaSec was designed to connect that lifecycle without treating visibility as authorization to test.

## My role

As **founder, CEO, and lead engineer**, I own product direction, application architecture, and the security controls surrounding technical operations. My work spans the customer experience, service boundaries, CTEM orchestration, GitOps delivery, and release validation.

## A workflow built around authorization

1. A public asset is added and control of it is verified.
2. Scope and consent for active testing are made explicit.
3. Authorized assessments feed a unified attack-surface view.
4. Findings are prioritized by exposure, exploitability, and impact.
5. Remediation evidence and retests remain connected to the same context.
6. Reports make decisions understandable to technical teams and stakeholders.

This sequence reduces the risk of offensive capabilities being used against an unverified or out-of-scope asset.

![Public and deliberately simplified PrismaSec architecture](/projects/prismasec-architecture.svg)

## Separated architecture

The platform separates the customer experience and business data from the CTEM engine:

- **Next.js and PostgreSQL** provide the interface, authentication, organization management, subscriptions, and application APIs.
- An **authenticated service boundary** controls calls to the CTEM engine.
- A **Rust service** orchestrates cycles, workers, and result normalization.
- **SurrealDB** stores exposure- and scan-domain entities.
- **Kubernetes and GitOps** make production changes declarative, reviewable, and reversible.
- Observability and release gates support deployments and sensitive operations.

The diagram is intentionally general: it communicates responsibilities and flows without exposing operational details or scanner internals.

## Structural decisions

### Verify before assessing

Discovering an asset is not enough to authorize active work. Ownership verification, explicit consent, and emergency controls are product capabilities rather than an external checklist.

### Isolate organizations

Authorization and data access are evaluated in organization context. Sensitive operations require additional controls, while service boundaries prevent application routes from bypassing the access model.

### Connect findings to remediation

A useful finding must be reproducible, prioritized, and followed through retesting. The interface therefore emphasizes attack paths, evidence, owners, and next actions instead of simply accumulating alerts.

### Treat delivery as a security control

Production changes move through a GitOps source of truth, immutable images, migration validation, contract tests, and recovery exercises. Reversibility is part of the service design.

## What this project demonstrates

- Turning offensive capabilities into a controlled, usable product.
- Designing boundaries across identity, business data, and technical orchestration.
- Connecting exposure, decisions, remediation, and evidence in one experience.
- Evolving a complete system without giving up production traceability.

PrismaSec is publicly accessible; this case study contains no customer data, sensitive infrastructure details, or unverified commercial metrics.
