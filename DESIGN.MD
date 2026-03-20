# Portfolio Design System

## Purpose

This portfolio presents Romain Stride as an independent cybersecurity operator with a real consulting practice. The site must feel technical, deliberate, and trustworthy without collapsing into fictional hacker branding.

The new system is:

- dark-first
- editorial
- sharp-edged
- structured like an operations interface
- grounded in real services, real writing, and real contact paths

The site is not a cyberpunk fantasy, a gamer-neon template, or a startup landing page.

## Creative Direction

The reference is a terminal-editorial hybrid:

- large architectural headlines
- compact monospace metadata
- tonal dark surfaces instead of light cards
- restrained green and cyan accents for signal
- dossier, archive, and report-like layouts

Every page should read like a technical briefing prepared by a serious consultant, not a roleplay persona.

## Brand Guardrails

Keep:

- the real name `Romain Stride`
- the real French service copy
- the current route structure and information architecture
- a professional consulting voice

Do not introduce:

- fictional names such as `DEF_OPS`, `ROOT_ACCESS`, or similar aliases
- aggressive red-team theatrics
- vague “elite hacker” positioning
- decorative lock/shield clichés as the main visual idea

Terminal framing is allowed only as a presentation device:

- status labels
- archive IDs
- system metadata
- operational section markers

## Theme Tokens

The code theme in `app/globals.css` is the source of truth.

Core palette:

- background: near-black `#0c0e12`
- base surface: `#111318`
- content surface: `#171a1f`
- elevated surface: `#1d2025`
- overlay surface: `#23262c`
- primary signal: `#9cff93`
- secondary signal: `#00cffc`
- body copy: `#aaabb0`
- main foreground: `#f6f6fc`
- error: `#ff7351`

Usage rules:

- use green for “signal”, action, and positive emphasis
- use cyan for interaction, metadata contrast, and technical framing
- use tonal layering for depth before adding any shadow
- keep borders faint and ghost-like

## Typography

Typography is a three-role system:

- headline: `Space Grotesk`
- body: `Inter`
- metadata / labels / technical details: `JetBrains Mono`

Rules:

- headlines are uppercase, tight, and architectural
- body copy stays readable and calm
- labels, dates, chips, IDs, and system text use monospace
- numbers, timestamps, and technical metrics should default to monospace when they act as metadata

## Layout And Surfaces

The site should feel like layered panels on a dark console.

Primary layout rules:

- keep content inside the shared `page-shell`
- prefer asymmetry over perfectly centered marketing grids
- let one major visual move dominate each section
- use staggered modules for capability or proof blocks when it adds rhythm

Surface model:

- page hero: deep editorial shell with grid texture and atmospheric blooms
- section frame: structured report container
- subtle surface: recessed support block
- contrast surface: black-heavy panel for high-importance content
- archive row: flat dossier/log entry, not a soft card

## Component Rules

### Navbar

- fixed dark shell
- uppercase technical navigation
- active route indicated by primary underline or edge treatment
- compact icon actions may be used, but nav labels remain real and clear

### Hero

- large editorial headline
- one supporting panel for proof, profile, or context
- status chip or operational label above the heading
- metadata chips below the main copy

### Buttons

- square corners only
- uppercase headline typography
- primary button uses the green signal color
- outline buttons stay dark and understated
- hover feedback is a restrained glow or tonal lift, never bouncy animation

### Chips And Labels

- monospace only
- compact, uppercase, flat
- suitable for tags, system state, timestamps, IDs, and service markers

### Forms

- dark surfaces
- inputs are mostly bottom-border driven
- focus state uses cyan, not browser default blue
- form UI should feel clear and secure, not decorative

### Blog Index

- archive/report layout, not a grid of lifestyle cards
- metadata should be visible before the excerpt
- search and filters must remain functional and readable on dark surfaces

### Blog Article

- strong report masthead
- clear article metadata
- code blocks must feel native to the design system
- related posts should look like linked dossier entries, not generic cards

### Footer

- compact mono strip
- explicit links
- system-status treatment is acceptable as secondary framing

## Motion

Motion should stay restrained and operational.

Allowed:

- short reveal-in-view transitions
- subtle opacity and y-offset changes
- slow ambient background drift

Not allowed:

- floaty marketing motion
- repeated decorative pulses across multiple sections
- motion that competes with reading

Reduced-motion support is required.

## Textures And Effects

Preferred effects:

- low-opacity dot grid
- soft radial blooms in green/cyan
- subtle glass only for shell-level overlays

Avoid:

- heavy blur everywhere
- dense grids that fight legibility
- glossy gradients that feel like SaaS hero art

## Dos And Donts

Do:

- keep the system dark-first only
- use tonal contrast before shadows
- keep headings bold and compressed
- preserve real content credibility
- make lists, archives, and service blocks easy to scan

Do not:

- reintroduce light-theme parity as a design goal
- use rounded pills and soft cards as the default language
- rely on broad white surfaces
- turn labels into fictional cyber roleplay
- use default system typography when the design depends on the loaded fonts

## Acceptance Standard

A finished page should make a visitor think:

“Cette personne travaille sérieusement, communique clairement, et saura cadrer un vrai besoin sécurité.”
