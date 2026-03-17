# Portfolio Architecture

## Layers

- `app/`: route entrypoints, metadata, and API handlers only
- `features/`: page/domain orchestration and feature-owned components
- `components/ui/`: low-level UI primitives only
- `shared/`: cross-feature presentation helpers such as motion presets and shared non-domain components
- `content/`: structured site content split by concern
- `lib/`: pure data/domain helpers and server-side utilities

## Rules

- Keep route files thin. Any non-trivial page composition belongs in `features/`.
- Prefer content selectors and domain helpers over importing the whole `site` object into every module.
- Reuse shared motion/config helpers instead of defining local reveal variants.
- Keep service/blog/contact business logic in `lib/` or feature models, not inside large JSX files.
- New reusable visual primitives go in `components/ui/` only if they are truly generic.
