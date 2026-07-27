# Phase 3 API and media lifecycle

## Data modes

Production always uses Supabase. Mock data can only be included by a non-production Vite
build with the explicit flag:

```text
VITE_USE_MOCK_DATA=true
```

The normal production build ignores that flag, dynamically excludes `mockData.js`, and CI
runs `npm run build:verify` to scan the output for a canonical mock product code.

For local UI work without Supabase, create `frontend/.env.local`:

```text
VITE_USE_MOCK_DATA=true
```

Do not enable mock mode when testing admin authentication or mutations.

## API behavior

- Successful zero-row queries return empty arrays.
- Deleted products return `not_found`; they never fall back to mock records.
- Configuration, network, not-found, authorization, validation, conflict, database, and
  cleanup errors have stable `ApiError.code` values.
- Public and admin screens distinguish loading, empty, failure, and success states.
- Admin search runs on the complete database and returns exact pagination metadata.
- Request sequence IDs prevent older search/filter responses replacing newer results.
- Database queries use explicit projections rather than `select('*')`.

## Image processing contract

Before upload, the browser:

1. Enforces the 8 MB source limit and JPEG/PNG/WebP extension/MIME allowlist.
2. Checks the file signature and decodes the image.
3. Applies decoder orientation and resizes within 1920×1920 without upscaling.
4. Encodes WebP at quality 0.82, then 0.75/0.68 when the output remains large.
5. Keeps an already-small WebP if re-encoding would make it larger.
6. Displays the final dimensions and byte size to the administrator.

The Supabase bucket independently enforces the 8 MB and MIME restrictions.

## Replacement and removal transaction order

Image replacement:

1. Read the old image reference.
2. Upload the processed new image.
3. Update the product row.
4. If the row update fails, delete the new upload and retain the old row/image.
5. Only after row success, delete the old storage object.

Photo removal clears the database reference first and deletes the old object only after
the database update succeeds. Cleanup failure does not misreport the database save as
failed; the UI shows a cleanup warning and the orphan inspector can find the object.

Product deletion similarly deletes the row first and then attempts media cleanup.

## Orphan maintenance

The admin dashboard **Storage maintenance** action compares up to 1,000 root
`part-images` objects with all current product image references. It reports object names
but does not automatically delete them. Before deleting a reported object in Supabase:

- refresh the report;
- confirm no product references it;
- retain the name in the maintenance record;
- delete through the Supabase Storage API/dashboard, never by deleting storage metadata.

## Verification limitations

Unit tests use deterministic fake Supabase responses for empty results, outages,
pagination metadata, replacement rollback, and explicit removal. Final acceptance still
requires these flows against a disposable Supabase project and real browser image files.
