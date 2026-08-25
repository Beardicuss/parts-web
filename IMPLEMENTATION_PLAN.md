# Parts Catalog Remediation and Improvement Plan

## Objective

Bring the catalog from its current functional prototype state to a secure, observable,
tested, maintainable production release without replacing the React + Vite + Supabase
architecture.

The work is divided into release gates. A later phase must not be treated as complete
until the preceding gate passes.

## Guiding decisions

- Keep React, Vite, Supabase, and Cloudflare Pages.
- Make Supabase the only production source of catalog data.
- Allow mock data only through an explicit development flag.
- Treat Supabase Row Level Security as the authorization boundary.
- Use versioned SQL migrations and a repeatable seed process.
- Require automated checks before production deployment.
- Make changes in small commits so each phase can be reviewed or rolled back.

## Current working mode — client feature iteration

**Status:** Active — release freeze has not been declared

The project is currently being demonstrated to the client and new catalog/admin requirements are
still being requested. Development may continue through the local/product phases below, but the
release track must remain deferred until the client explicitly confirms a feature and content
freeze.

### Work that can continue now

- Product, catalog, service, content, visual, responsive, and admin-panel improvements.
- Database migrations required by approved product/admin features.
- Local and connected-Supabase testing using reversible test records.
- Batch import, data cleanup, bulk management, draft/review workflows, and automated tests.
- Documentation for product preparation and nontechnical administrator workflows.

### Work intentionally deferred

- Final SEO wording, keywords, structured data, and sitemap decisions that depend on approved client
  content and search strategy.
- Production hosting, domain/DNS cutover, production Cloudflare configuration, and public release.
- Final billing ownership, paid-plan selection, quota alerts, operational monitoring, backup
  activation, account transfer, and permanent administrator handoff.
- Final cross-browser, production CDN, deployed-header, uptime, restore, and post-release checks.

### Exit condition

Move to the release track only when the client approves the public features, services/about content,
catalog structure, administrator workflow, and launch scope, and agrees that new requests will be
handled as post-launch changes.

## Phase 0 — Baseline and delivery safety

**Status:** Complete — 2026-07-27

**Completion record:** The remediation branch, Node version pin, lint/format/test/build
scripts, CI workflow, environment documentation, baseline unit and browser smoke tests,
and repository credential-history check are in place. All Phase 0 verification commands
pass from a clean `npm ci` installation. The two remaining high-severity React Router
advisories apply to RSC/server-action mode, which this client-only SPA does not use; the
scoped exception and upgrade review requirement are documented in
`docs/PHASE_0_BASELINE.md`.

### Scope

- Create a dedicated remediation branch.
- Record the current build output and dependency audit.
- Add Node version metadata (`.nvmrc` or `.node-version`).
- Add ESLint, Prettier, and consistent npm scripts.
- Add a minimal CI workflow for install, lint, test, build, and dependency audit.
- Document development, preview, and production environment variables.
- Confirm that `.env` remains ignored and that no service-role key exists in history.

### Suggested scripts

- `npm run lint`
- `npm run format:check`
- `npm run test`
- `npm run test:e2e`
- `npm run build`
- `npm run audit`

### Acceptance gate

- Clean installation works from a fresh checkout.
- Lint and formatting checks pass.
- The existing production build still succeeds.
- CI runs on pull requests.
- No credentials or service-role keys are committed.

## Phase 1 — Database bootstrap and canonical data model

**Status:** Implementation complete — Supabase execution gate pending

**Completion record:** Ordered migrations, a generated idempotent seed, canonical catalog
validation, schema assertions, identity-sequence repair, aligned admin/API/detail fields,
translation constraints, case-insensitive uniqueness, and restrictive reference deletion
are implemented. Local validation confirms 83 unique products and exact image paths.
The migrations and SQL assertions still need to be executed against a disposable Supabase
project because this workstation has no Supabase CLI, Docker, or PostgreSQL runtime.
Client approval of the synthetic-looking replacement codes also remains required; see
`docs/PHASE_1_DATA_REVIEW.md`.

### Scope

- Replace the monolithic schema workflow with ordered, versioned migrations.
- Fix explicit inserts into `generated always as identity` columns.
- Make seed execution safe on an empty database and repeatable on an initialized one.
- Establish a single canonical seed-data source instead of maintaining the same catalog
  in `mockData.js`, `schema.sql`, and `seed_all.sql`.
- Add `replacement_codes` and `compatible_models` to the database if they are approved
  product fields.
- Decide and enforce the translation rule:
  - either both titles are required; or
  - one title is required and language fallback is officially supported.
- Add appropriate constraints for trimmed product codes and reference names.
- Add case-insensitive uniqueness where duplicate brands/categories are not valid.
- Review delete behavior for brand and category references.
- Add search indexes only after measuring realistic catalog size; use `pg_trgm` if
  leading-wildcard search must scale.

### Data verification

- Validate all 83 product codes, replacement codes, compatibility values, titles, and
  images against the client-approved source.
- Flag synthetic-looking replacement codes and repeated/generated titles for review.
- Verify every seeded image path exists.
- Verify all image paths resolve correctly on case-sensitive production hosting.

### Tests

- Apply migrations to a completely empty test project/database.
- Reapply the seed without duplicates or errors.
- Create a new brand/category after seeding and confirm identity sequences are correct.
- Test foreign-key behavior when a brand or category is deleted.
- Compare seeded product count and unique product-code count to the approved source.

### Acceptance gate

- Fresh schema creation and seed complete without manual edits.
- Seed is idempotent.
- Database, admin form, API payloads, and public detail page use the same product fields.
- No mock-only product information exists.

## Phase 2 — Authentication, authorization, and storage security

**Status:** Local security implementation complete — external gates pending

**Completion record:** Explicit admin membership, MFA-enforced table and storage RLS,
TOTP enrollment/challenge UI, bucket restrictions, browser image signature/decoder
validation, Cloudflare security headers, authorization assertions, session-expiry draft
preservation, and client-owned provisioning/recovery procedures are implemented. The
repository threat model is finalized in `parts-catalog-threat-model.md` using the
documented deployment assumptions. Runtime RLS tests and deployed-header inspection still
require disposable/production environments. The latest React Router release still
triggers an RSC-only high advisory; the scoped risk decision and upgrade requirement are
documented in `docs/PHASE_2_SECURITY_OPERATIONS.md`.

### Scope

- Create an admin-membership model keyed by `auth.uid()`.
- Replace `auth.role() = 'authenticated'` write policies with explicit admin checks.
- Apply the admin check to parts, brands, categories, and storage mutations.
- Disable public signup and every unused authentication provider.
- Document the admin-provisioning and admin-removal process.
- Enable MFA for admin accounts if supported by the selected operational workflow.
- Add storage MIME-type and file-size restrictions.
- Validate file extension, MIME type, decoded image type, and maximum size in the admin UI.
- Restrict catalog uploads to approved JPEG, PNG, and WebP inputs and reject spoofed
  extensions, unsupported decoded formats, empty files, and files above the configured
  source-size limit before any network upload begins.
- Add Cloudflare security headers:
  - Content-Security-Policy
  - X-Content-Type-Options
  - Referrer-Policy
  - Permissions-Policy
  - frame restrictions
  - HSTS on the production domain
- Upgrade React Router and resolve all actionable production dependency advisories.
- Produce a small threat model covering anonymous users, admins, Supabase, storage, and
  deployment configuration.

### Tests

- Anonymous users can read but cannot mutate any table or storage object.
- A normal authenticated non-admin user cannot mutate data.
- An approved admin can perform all intended CRUD actions.
- Unsupported files and oversized images are rejected.
- Renaming an unsupported file to an approved extension does not bypass validation.
- Session expiry returns the admin to login without losing or corrupting data.
- Security headers pass an automated/header inspection.

### Acceptance gate

- Authentication no longer grants authorization by itself.
- There are no known high or critical production dependency vulnerabilities.
- Moderate findings are fixed or documented with a concrete risk decision.
- Storage accepts only approved catalog image types and sizes.

## Phase 3 — API correctness, failure behavior, and media lifecycle

**Status:** Local implementation complete — Supabase integration gate pending

**Completion record:** Production/mock separation, structured errors, real empty results,
explicit projections, complete admin pagination/search, stale-response protection,
1920px WebP optimization, bilingual image errors, transactional replacement/removal
cleanup, rollback reporting, and orphan inspection are implemented and covered by unit
tests. Production bundles are scanned to ensure mock products are absent. Final acceptance
requires running the mutation/media matrix against a disposable Supabase project with
representative real JPEG, PNG, WebP, corrupt, and oversized files; see
`docs/PHASE_3_API_AND_MEDIA.md`.

### Scope

- Introduce an explicit `VITE_USE_MOCK_DATA` development flag.
- Exclude mock catalog data from production bundles.
- Return `[]` for a successful zero-row query.
- Propagate real configuration, network, authorization, and database errors.
- Introduce typed/structured API errors so the UI can distinguish:
  - configuration errors;
  - offline/network errors;
  - not found;
  - unauthorized/session expired;
  - validation/conflict errors.
- Construct the Supabase client only when configuration is valid.
- Replace `SELECT *` with explicit projections.
- Add server-side/admin pagination and search.
- Make admin search query the complete database rather than only the currently loaded
  page, with predictable pagination metadata, page-size options, and newest-first
  ordering.
- Prevent stale filter responses from replacing newer results using abort/cancellation or
  request sequencing.
- Add automatic client-side image processing before upload:
  - decode the selected image in the browser;
  - correct orientation where required;
  - resize it to documented maximum dimensions without upscaling;
  - compress it to an optimized WebP target;
  - preserve a reasonable quality floor and reject processing failures;
  - show the optimized preview and final upload size to the administrator.
- Fix image replacement:
  - upload the new image;
  - roll it back if the database write fails;
  - delete the old image only after the database update succeeds;
  - report cleanup failures for later recovery.
- Add an explicit “Remove photo” control:
  - require clear administrator intent;
  - save the product without an image reference;
  - delete the old storage object only after the database update succeeds;
  - retain the previous image if the database update fails.
- Add a maintenance mechanism to find orphaned storage objects.

### Tests

- Empty production database shows a real empty state, never mock products.
- Supabase outage shows a retryable error.
- Deleted products do not reappear from fallback data.
- Admin can search and paginate through all 83+ products.
- Search can find a record outside the first page and clearing search restores paginated
  newest-first results.
- Large JPEG/PNG inputs are resized and converted to the documented optimized WebP output
  before upload.
- Already-small images are not upscaled or made materially larger by processing.
- Invalid format, spoofed MIME type, zero-byte, corrupt, and oversized inputs are rejected
  with understandable bilingual messages.
- Failed product update does not lose the previous image.
- Replacing an image removes the old object after a successful update.
- Failed upload/database combinations do not silently leak objects.
- Removing a photo clears the database reference and storage object on success, while a
  failed removal leaves the previous product image intact.

### Acceptance gate

- Production data is never mixed with mock data.
- Every data screen has distinct loading, empty, error, and success states.
- Admin operations work for the complete dataset.
- Media resizing, validation, replacement, removal, rollback, and orphan cleanup behavior
  is deterministic and tested.

## Phase 4 — Product and admin UX completion

**Status:** Local implementation complete — authenticated integration pass pending

**Completion record:** WhatsApp product contact, URL-backed AND filters, catalog return
state, wildcard/product-not-found states, skeletons, retries, safe image fallbacks,
accessible focus-trapped dialogs, inline conflict validation, unsaved-change blocking,
delete/save progress, and friendly session-expiry draft recovery are implemented. Public
navigation and failure flows are covered by unit/browser tests. Final acceptance requires
an authenticated create/find/edit/delete pass against a disposable Supabase project; see
`docs/PHASE_4_UX_FLOWS.md`.

### Public catalog

- Connect the product “Contact us” action to the approved channel, preferably WhatsApp
  with the product code included in the message.
- Preserve catalog search/filter state in URL query parameters.
- Return from product detail to the previous catalog state.
- Add a wildcard 404 route and product-not-found page.
- Add visible skeleton/loading states.
- Add retry actions for recoverable failures.
- Add broken-image fallback behavior.
- Decide whether category, search, and brand filters should combine with AND semantics
  and document the behavior.

### Admin

- Add server-backed pagination, sorting, and search.
- Replace `window.prompt` and `window.confirm` with accessible application dialogs.
- Add inline validation and conflict messages, especially for duplicate product codes.
- Add explicit remove-photo behavior.
- Warn about unsaved form changes before navigation.
- Improve save/delete progress states and disable duplicate submissions.
- Provide friendly session-expired handling.
- Display all supported product fields, including approved replacement and compatibility
  fields.

### Acceptance gate

- Every visible primary action works.
- An admin can create, find, edit, delete, and verify any product.
- User input failures explain what must be corrected.
- Navigation does not unexpectedly discard filter or form state.

## Phase 5 — Accessibility, localization, and visual system

**Status:** Local implementation complete — authenticated admin keyboard pass pending

Completion record:

- Added automated axe checks for public and reachable admin routes in light and dark themes.
- Added a localized skip link, consistent focus states, reduced-motion behavior, and
  keyboard-operable photo upload.
- Completed focus trapping/restoration and Escape behavior for dialogs and the FAQ drawer.
- Added live-region semantics for toast, error, validation, and photo-removal feedback.
- Localized theme controls, document titles, descriptions, 404 states, and image labels.
- Defined saved preference → browser locale → English as the initial-language strategy and
  synchronized `<html lang>` with language changes.
- Verified English and Georgian dictionary parity and documented shared design tokens and
  reusable component states in `docs/PHASE_5_ACCESSIBILITY_LOCALIZATION.md`.
- Final authenticated CRUD/upload keyboard verification remains an external acceptance gate
  requiring a disposable Supabase admin environment.

### Accessibility

- Run automated axe/Playwright checks on all public and admin routes.
- Complete a keyboard-only pass.
- Make the upload zone keyboard-operable.
- Add accessible names to every input and icon-only control.
- Add focus trapping/restoration to drawers and dialogs.
- Add Escape handling to modal surfaces.
- Add `aria-live` semantics to toast and validation messages.
- Verify color contrast in both themes.
- Respect `prefers-reduced-motion`.
- Provide a visible skip link and consistent focus indicators.

### Localization

- Update `<html lang>` whenever language changes.
- Translate hard-coded labels such as theme and image placeholders.
- Verify English and Georgian dictionaries have identical keys.
- Decide the initial-language strategy: saved preference, browser locale, or explicit
  business default.
- Localize document titles, metadata, validation messages, and 404/error states.
- Review Georgian typography, line height, truncation, and mobile wrapping.

### Design system

- Audit spacing, typography, colors, focus states, cards, dialogs, and form controls.
- Turn repeated values into stable design tokens.
- Split the global CSS into logical layers or feature-scoped modules.
- Produce reusable component states for loading, empty, error, disabled, hover, focus,
  and destructive actions.
- Use a Figma design-system workflow if the client wants a maintained visual source of
  truth.

### Acceptance gate

- No serious automated accessibility violations.
- All critical tasks work with keyboard only.
- Both themes meet contrast requirements.
- English and Georgian routes have complete, consistent UI text.
- Design tokens and reusable component states are documented.

## Phase 6 — Performance and asset optimization

**Status:** Local implementation complete — production CDN trace pending

Completion record:

- Recorded reproducible desktop and mobile Chrome traces before and after optimization.
- Reduced desktop LCP from 917 ms to 380 ms and CLS from 0.12 to zero.
- Reduced the Fast-4G/4×-CPU mobile LCP from 1.659 s to 1.389 s with zero CLS.
- Recorded a 35 ms catalog-search INP.
- Lazy-loaded product detail, services, and all admin screens; production builds contain no
  canonical mock records.
- Removed external font dependencies and fixed intrinsic image sizing.
- Generated 83 card thumbnails, reducing the canonical card-image set from 53.4 MB to
  1.02 MB (98%); added automatic full/thumbnail admin upload lifecycle handling.
- Added immutable/static cache policies, production upload cache metadata, entry/image
  budgets, and reproducible image-generation tooling.
- The largest entry chunk fell from 551 KB to 375 KB and Vite no longer reports a 500 KB
  chunk warning.
- Full details and the measurement profile are documented in
  `docs/PHASE_6_PERFORMANCE.md`.
- Final acceptance requires applying migration `202607270006_image_variants.sql` and
  repeating the trace against the deployed Cloudflare/Supabase environment.

### Scope

- Lazy-load admin and non-critical routes.
- Remove seed/mock data from the public production JavaScript bundle.
- Split vendor/admin code where measurement shows value.
- Generate card, detail, and optional full-size image variants.
- Use responsive `srcset`/`sizes`, explicit dimensions, and stable aspect ratios.
- Compress oversized WebP files and define an upload processing standard.
- Self-host fonts or confirm the Google Fonts privacy/performance tradeoff.
- Add cache rules for immutable hashed assets and appropriate catalog image caching.
- Measure Core Web Vitals on mobile and desktop.
- Add a bundle-size budget and performance regression checks.

### Target budgets

- No avoidable route loads admin code for anonymous public users.
- Public initial JavaScript remains within an agreed measured budget.
- Card thumbnails do not download full detail images.
- LCP, CLS, and INP meet “good” Core Web Vitals thresholds under the agreed test profile.

### Acceptance gate

- Vite no longer reports an unexplained oversized entry chunk.
- Image payload is materially reduced on catalog pages.
- Performance measurements are recorded and reproducible.

## Phase 7 — Catalog governance and publication workflow

**Status:** Implemented locally — Supabase migration and client acceptance testing pending

**Completion record:** Draft/review/published/archived states, public visibility enforcement,
status filters and counts, admin product preview, controlled state transitions, reusable structured
vehicle models, product-model associations, and batch-import status/model matching are implemented.
Existing products are preserved as published when the migration is first applied. See
`docs/PHASE_7_CATALOG_GOVERNANCE.md` for migration and verification instructions.

### Scope

- Add an explicit product lifecycle:
  - `draft` for incomplete or newly imported records;
  - `needs_review` for uncertain compatibility, titles, or classification;
  - `published` for client-approved public products;
  - `archived` for products removed from the public catalog without immediate destruction.
- Ensure the public catalog and Featured Parts show only published products.
- Make batch-imported uncertain products default to `needs_review` instead of becoming public
  immediately.
- Add admin filters and counts for draft, review, published, and archived products.
- Add product preview before publication.
- Add publish/unpublish/archive actions with accessible confirmation and clear results.
- Introduce structured reusable vehicle data where it improves consistency:
  - brand;
  - model family;
  - chassis/platform code;
  - optional production years.
- Retain free-text compatibility notes for unusual/shared applications.
- Provide a controlled normalization path for existing values such as `X5 G05`, `BMW G05`, and
  `G05` without silently changing approved data.

### Tests

- Draft, review, and archived products never appear publicly.
- Publishing makes a product visible without changing its image or technical data.
- Archiving and restoring preserve the complete product record.
- Batch records with `Unverified Model` enter the review state.
- Vehicle-model selection and free-text compatibility can coexist.

### Acceptance gate

- The client can safely add incomplete products without accidentally publishing them.
- Public visibility is explicit and reversible.
- Vehicle/model values remain consistent enough for future filtering and bulk management.

## Phase 8 — Batch import resilience and bulk administration

**Status:** Basic batch importer complete — resilience and bulk tools ready to implement now

**Completion record:** Folder-driven batch import, automatic path metadata, 20 MB source-image
acceptance, 1920px WebP/640px thumbnail generation, selected-batch duplicate detection, existing-code
checks, review filters, controlled two-worker upload, failure retry, missing-reference creation, and
English/Georgian folder-preparation documentation are implemented. The real 292-image organized
fixture validates with no missing codes/brands or exact duplicate images. See
`docs/ADMIN_BATCH_IMPORT.md` and `docs/BATCH_IMPORT_FOLDER_GUIDE.md`.

### Remaining scope

- Persist unfinished batch-import drafts locally so a refresh or browser restart does not discard
  corrections.
- Add explicit **Resume batch** and **Discard batch** controls.
- Generate a downloadable CSV completion report containing:
  - imported products;
  - failed rows and reasons;
  - duplicate codes/images;
  - records still requiring review;
  - automatically created brands/categories.
- Store an image SHA-256 value for new uploads and detect duplicates against previously imported
  database records, not only within the current selection.
- Add selected-row bulk editing for:
  - brand;
  - category;
  - vehicle model/platform;
  - publication/review status;
  - part/module type.
- Add CSV export of current catalog data for offline review and correction.
- Add optional CSV-assisted import only if the client later receives structured supplier data.
- Preserve per-row progress and make retry idempotent so already imported records cannot be created
  twice after interruption.

### Tests

- Refreshing during review restores all edits and selections.
- Resuming an interrupted upload skips successfully imported rows.
- The completion report matches the database result exactly.
- A photo matching a previously stored SHA-256 value is warned/blocked according to the approved
  duplicate policy.
- Bulk changes affect only checked rows and can be reviewed before saving.
- A 300-image fixture remains responsive and does not exceed the configured upload concurrency.

### Acceptance gate

- A nontechnical administrator can prepare, interrupt, resume, review, and finish a large import
  without losing work or creating duplicates.
- Failed rows have actionable explanations and remain recoverable.
- Large corrections do not require editing every product individually.

## Phase 9 — Admin safety, maintenance, and recoverability

**Status:** Ready to implement locally; production scheduling/ownership remains deferred

### Scope available now

- Replace immediate destructive product deletion with recoverable archive/trash behavior.
- Add an explicit permanent-delete action restricted to already archived products.
- Decide and implement a retention period before image objects can be permanently removed.
- Record an admin activity history for important mutations:
  - product created/imported;
  - technical fields changed;
  - image replaced/removed;
  - publish/archive/restore/permanent delete;
  - brand/category/model reference changes.
- Store actor ID, timestamp, action, affected record, and a concise before/after summary without
  recording credentials or session secrets.
- Make storage inventory recursive across `full/` and `thumb/` prefixes.
- Show orphan path, size, upload date, and reason before cleanup.
- Add confirmed orphan cleanup that rechecks database references immediately before deletion.
- Show catalog totals, draft/review counts, failed-import count, and approximate image-storage usage
  on the admin dashboard.
- Add a product-clone action for similar parts while requiring a new unique code.
- Add admin-friendly error boundaries so a screen failure offers retry/navigation instead of the
  router's raw developer error page.

### Deferred production portion

- Automated retention schedules and scheduled cleanup jobs.
- Production quota alerts and storage/database monitoring.
- Production backup scheduling and automatic R2 synchronization.
- Permanent client admin-account replacement, ownership transfer, and recovery drill.

### Tests

- Archived products can be restored with all data and images intact.
- Permanent deletion cannot run against a published/non-archived product.
- Audit entries identify the correct actor, record, action, and time.
- Recursive orphan inspection finds objects under both image prefixes and never reports referenced
  images as removable.
- Cleanup performs a final reference check and reports partial failures.
- Admin route failures render a localized recovery screen.

### Acceptance gate

- Common client mistakes are reversible.
- Storage cleanup is understandable and cannot remove a referenced product image.
- Important admin changes can be traced without exposing sensitive information.

## Phase 10 — SEO and discoverability

**Status:** Deferred until client content and search-strategy approval

### Scope

- Add titles and descriptions for home, catalog, and product detail pages.
- Add canonical URLs, Open Graph tags, and social preview images.
- Add favicon and application icons.
- Add `robots.txt` and sitemap generation.
- Add `Product`/relevant structured data where the available information is accurate.
- Decide whether client-side rendering is sufficient for product-code discovery.
- If organic search is important, evaluate prerendering or an SSR/static-generation
  migration for public pages while retaining Supabase.

### Acceptance gate

- Every indexable route has correct metadata.
- Social previews show the expected title, image, and description.
- Sitemap and robots behavior match the deployment environment.
- Structured data validates without misleading commercial fields.

## Phase 11 — Observability, backup, and operations

**Status:** Planning retained — activation deferred until release/hosting stage

### Scope

- Add Sentry or equivalent client error monitoring with source maps.
- Capture API failure categories without logging credentials or sensitive session data.
- Add uptime checks for the public catalog and Supabase health-dependent flows.
- Document Supabase backup/restore behavior for the actual plan.
- Create a periodic database export and image inventory process.
- Add an optional automatic Cloudflare R2 image backup for installations that require an
  off-site copy of Supabase Storage:
  - mirror newly uploaded/replaced product images to a private R2 bucket;
  - use a scheduled reconciliation job to discover and copy missed objects;
  - do not immediately remove backup objects when the primary image is deleted;
  - apply an explicit retention/lifecycle policy to old backup versions;
  - encrypt credentials as deployment secrets and grant only the minimum R2 permissions;
  - alert or record a visible failure when synchronization cannot complete;
  - document and test restoration from R2 back to Supabase Storage;
  - keep this feature switchable so small installations can use Supabase-only storage.
- Document that Supabase database backups do not contain the actual Storage objects and
  state whether the deployment uses Supabase-only storage or the optional R2 mirror.
- Document client-owned billing, access, and recovery for:
  - domain registrar and DNS;
  - Cloudflare account, Pages project, R2 bucket, and payment method where applicable;
  - Supabase organization, project, Pro subscription, and payment method;
  - source repository and deployment integration;
  - primary admin account, recovery email, MFA device, and backup/recovery codes.
- Require the production Supabase, Cloudflare, domain, repository, and administrator
  accounts to be created in or transferred to the client’s ownership before final
  acceptance; the developer must not remain the sole owner or recovery contact.
- Create a concise client recovery document covering billing failure, expired payment
  method, lost admin password, lost MFA device, domain expiry, Supabase project access,
  Cloudflare access, data restoration, and emergency contact/escalation paths.
- Add dependency update automation.
- Define incident response for:
  - catalog unavailable;
  - admin lockout;
  - accidental deletion;
  - compromised admin account;
  - storage quota exhaustion.

### Acceptance gate

- A forced frontend error is visible in monitoring with a usable stack trace.
- A failed catalog request is observable.
- Restore and admin-recovery procedures are documented and tested at least once.
- If R2 backup is enabled, a sampled product image is restored from R2 and verified.
- The client can identify where subscriptions are billed, update payment details, recover
  each critical account, and locate stored recovery codes without developer assistance.
- Operational ownership is transferred to the client or named maintainer.

## Phase 12 — Production release and post-release validation

**Status:** Deferred until client feature/content freeze and explicit launch approval

### Pre-release

- Run the complete CI pipeline.
- Run fresh database migration and seed rehearsal.
- Complete security, accessibility, performance, and browser checks.
- Test current Chrome, Edge, Firefox, Safari, Android, and iOS profiles as applicable.
- Verify Cloudflare SPA routing and direct navigation to product/admin routes.
- Verify production environment variables and security headers.
- Freeze and export the approved catalog data.
- Confirm the selected Supabase plan, billing owner, payment method, storage quota alerts,
  and whether optional R2 backup is enabled.
- Complete the client-owned account and recovery checklist before deployment.

### Release

- Deploy a saved, identifiable build.
- Run public catalog smoke tests.
- Run admin login and reversible CRUD smoke tests.
- Verify contact links, metadata, sitemap, images, and monitoring.

### Post-release

- Monitor errors and availability closely for the first 24–72 hours.
- Review performance using real-user data after sufficient traffic.
- Remove temporary test records and accounts.
- Record release version, schema version, known limitations, and rollback procedure.

### Final acceptance gate

- All P0 and P1 findings are closed.
- No unresolved critical/high security issue remains.
- CI, monitoring, backups, and recovery documentation are active.
- Production infrastructure, billing, domains, repository access, administrator access,
  and recovery channels are owned by the client.
- The client signs off on catalog accuracy, Georgian/English content, visual design, and
  the admin workflow.

## Test strategy

### Unit tests

- Language fallback and translation key parity.
- API result flattening and structured error mapping.
- Filter/query serialization.
- Image-path parsing and cleanup decisions.
- Form validation.
- Batch-folder metadata extraction and duplicate classification.
- Publication-state transitions and bulk-edit selection rules.

### Integration tests

- Supabase RLS permission matrix.
- Product/reference CRUD.
- Duplicate-code handling.
- Existing image-hash duplicate handling.
- Migration and seed idempotency.
- Storage upload, replacement, deletion, and rollback.
- Archive/restore, audit history, and recursive orphan cleanup.

### End-to-end tests

- Browse, filter, search, load more, open detail, and contact.
- Admin login, create, edit, search, replace image, and delete.
- Prepare/review/import/resume/report a product batch.
- Draft, preview, publish, archive, and restore a product.
- Unauthorized and expired-session paths.
- Empty database, network failure, and not-found behavior.
- English/Georgian switching and persisted theme/language.

### Non-functional tests

- Accessibility with automated and manual keyboard checks.
- Core Web Vitals and bundle/image budgets.
- Security headers and dependency audit.
- Cross-browser and responsive visual regression.

## Suggested implementation sequence

### Completed foundation

1. Phase 0: baseline automation.
2. Phase 1: database correctness implementation.
3. Phase 2: authorization and security implementation.
4. Phase 3: API correctness and media lifecycle implementation.
5. Phase 4: functional UX implementation.
6. Phase 5: accessibility, localization, and design-system implementation.
7. Phase 6: performance and asset optimization implementation.

External/Supabase/production acceptance gates recorded in those phases remain open until the
appropriate connected or deployed environment is available.

### Current development track — safe to continue before launch freeze

8. Phase 7: catalog governance, structured vehicle data, and draft/review/publish workflow.
9. Phase 8: persistent batch imports, reports, database image hashes, and bulk administration.
10. Phase 9: recoverable deletion, activity history, recursive storage maintenance, and admin error
    recovery.
11. Continue client-requested public/admin features, content, and visual refinements under the
    Definition of Done.

Phases 7–9 may overlap when their database changes are coordinated. Publication status should be
implemented before importing another large uncertain batch, while batch persistence/reporting and
bulk editing can then build on that status model.

### Deferred release track — do not start without explicit client approval

12. Phase 10: finalized SEO and discoverability after search/content approval.
13. Phase 11: production observability, backups, billing/ownership, and operational recovery.
14. Phase 12: production deployment, smoke testing, ownership transfer, and post-release validation.

Entering Phase 10 does not itself authorize hosting. Phase 11 production activation and Phase 12
require a documented client feature/content freeze and launch decision.

## Definition of done for every change

- Requirement and acceptance criteria are documented.
- Code and schema changes are reviewed.
- Relevant automated tests are added and passing.
- Error, loading, empty, and success behavior are covered.
- English and Georgian UI impact is reviewed.
- Accessibility and responsive behavior are checked.
- Security and privacy impact is considered.
- Documentation is updated.
- Rollback or recovery behavior is known.
