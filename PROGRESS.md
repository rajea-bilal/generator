# Progress Log

- 2025-09-09: Added Fast Start wizard (`routes/brand-fast-start.tsx`) with 3 steps (brand basics, look & feel, colors). Registered route in `app/routes.ts`. Brand Kit now reads query params to prefill name, template, font, icon, and colors. Adjusted preview to stay square and fully visible. No linter errors.
- 2025-09-09: Moved icon selection into Fast Start Step 2 (added `IconPicker`). Removed icon controls from `brand-kit.tsx` so icon choice is made in the wizard. Typecheck clean.
- 2025-09-09: Changed default `iconId` to empty (no icon). Updated renderer to handle empty/unknown `iconId` gracefully (renders background + text only). Avoids forcing rounded square by default.
- 2025-09-09: Added conditional icon controls to Brand Kit: shows “Add icon” when none; moves “Change/Remove icon” under Advanced when present. Typecheck clean.
- 2025-09-09: Restyled Advanced sliders to match reference UI (uppercase labels, dark track, prominent thumb). No new parameters added; just visual changes.