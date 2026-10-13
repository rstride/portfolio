# Blog authoring template

Write for practitioners familiar with networking, web requests, and Linux/Windows administration. Explain why each step works, its prerequisites, and what the result proves. Length follows the reasoning; there is no minimum word count.

## Files and metadata

Create matching Markdown files under `content/blog/fr/` and `content/blog/en/`, optionally within a category directory. The basename is the public slug: use the same unique lowercase, hyphenated basename in both languages. Directories do not become part of the URL.

Replace all placeholders in this starting frontmatter before publication:

```yaml
---
id: "REQ-YYYY-NNN"
title: "Specific technical subject"
excerpt: "A complete plain-text sentence describing the mechanism and useful takeaway, at least 80 characters."
date: "YYYY-MM-DD"
updated: "YYYY-MM-DD"
tags: ["WRITEUP", "HACKTHEBOX", "LINUX", "MEDIUM", "API"]
category: "WRITEUP"
platform: "HACKTHEBOX"
target_os: "LINUX"
difficulty: "MEDIUM"
icon: "Terminal"
author: "Author name"
published: false
---
```

- Preserve original publication dates. Set `updated` to the actual substantive revision date in both languages.
- During revisions, preserve IDs, slugs, authors, categories, difficulty, and featured status.
- Guides and research use `GUIDE` or `RESEARCH` with corresponding tags; omit inapplicable machine metadata. Add `featured: true` only deliberately.
- Machine difficulties are `EASY`, `MEDIUM`, `HARD`, or `INSANE`. Difficulty is distinct from vulnerability severity.
- Icon conventions: `Database`, `Terminal`, `ShieldAlert`, `Code`.
- Optional `seoTitle`, `seoDescription`, `ogImage`, and `ogImageAlt` must match the supported content. Specify only images that exist; otherwise use the default.
- Frontmatter supplies the only H1; body sections start at H2.
- `published: false` hides drafts from routes, feeds, and sitemap. Publish both versions together after review.

## Evidence standard

Distinguish these forms of material in the surrounding prose:

1. **Observed or recorded:** identify lab/session provenance and retain evidence supporting the stated outcome. A reported result without a transcript is not an independently reproduced result.
2. **General mechanism:** explain prerequisites and cite vendor documentation, primary advisories, or original research beside the relevant claim.
3. **Illustrative or synthetic:** explicitly label examples, fictional fixtures, expected responses, and pseudocode. Never describe them as captured client or machine evidence.

Do not invent missing requests, output, credentials, screenshots, source excerpts, or successful exploitation. Narrow or qualify unsupported claims and identify the evidence gap. An advisory explains mechanics; it does not prove a machine was exploited.

For CVEs, verify deployed build, platform, configuration prerequisites, and vendor package status. Consider backports and custom binaries. Cite release guidance and its review date where appropriate. A banner alone does not determine exploitability.

Remove flags and unnecessary secrets. Define placeholders, tool provenance/version, session, files, and working directory needed for each command. Explain its purpose and what success or failure establishes without inventing output. Attribute third-party code; link to original publications rather than copying full exploits.

## Walkthrough outline

Adapt sections to the mechanism rather than adding filler for a uniform structure.

### Chain and prerequisites

State initial access, target context, successive identities, and evidence limits. Distinguish application roles, SQL roles, OS identities, container privileges, and domain permissions.

### Enumeration decisions

Explain what prompted the next check. Separate service discovery, reachability, accepted authentication, and authorized operations.

### Exploitation mechanics

Show the input-to-sink path and trust boundary. Explain each command/request and its prerequisites. Prefer minimal evidence over unannotated scripts.

### Privilege transition

Explain why rights change, how that is verified, and which permissions remain unproven. Do not infer domain compromise from a local shell or host execution from a file read.

### Remediation and verification

Address root cause, relevant variants, secret rotation, and immediate containment where useful. Include positive controls, negative checks, side effects for writes/jobs, and closure criteria.

### Detection and lessons

Identify observable requests, processes, files, or authorization changes and required telemetry. Explain detection limits. Omit a timeline that merely repeats the walkthrough.

## Guide or research outline

- State the reader's task and intended outcome; do not present a general method as novel research.
- Define policy, environment, and assumptions before a worked example.
- Include an appropriate matrix, checklist, request pair, or finding. Explicitly label fictional material.
- Explain decisions, variants, delayed work, and failure modes affecting the result.
- Provide verification or regression pseudocode with defined helper contracts and positive controls.
- Finish with acceptance criteria, limitations, and related localized articles.

## Bilingual and publishing review

- Establish corrected substance first, then write natural French and English. Keep commands, identifiers, prerequisites, evidence status, and outcomes equivalent.
- French links use `/blog/<slug>`; English links use `/en/blog/<slug>`. Verify localized destinations.
- Use valid code-fence labels such as `bash`, `http`, `sql`, `python`, `php`, `csharp`, `powershell`, `yaml`, and `text`, not filenames. Check balanced fences and readable tables.
- Align excerpts and SEO text with supported claims; check metadata compatibility, dates, and matching slugs.
- Render through the existing Markdown pipeline; inspect headings, tables, highlighting, links, and representative desktop/mobile pages in both languages.
- Run `npm run test`, `npm run lint`, and `npm run build`. Do not execute exploit commands against live targets as editorial validation.
