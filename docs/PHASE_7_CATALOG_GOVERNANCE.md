# Phase 7 — Catalog governance

Phase 7 prevents unfinished products from appearing in the public catalog and introduces reusable
vehicle-model records.

## Apply the database migration

Before testing this feature against Supabase:

1. Open the SebaTech project in Supabase.
2. Open **SQL Editor** and create a new query.
3. Copy the complete contents of
   `supabase/migrations/202607270007_catalog_governance.sql` into the query.
4. Run the query once and confirm that it finishes successfully.
5. Refresh the website and sign in to `/admin` again if the existing session is stale.

The migration preserves all existing catalog products as **Published**. Newly created products are
**Draft** by default.

If the migration has not been applied, the updated admin may report that `publication_status`,
`vehicle_models`, or `part_vehicle_models` does not exist.

## Product states

| State | Publicly visible | Intended use |
| --- | --- | --- |
| Draft | No | A new or incomplete product |
| Needs review | No | Classification, title, code, or compatibility still needs checking |
| Published | Yes | Client-approved product shown in Catalog and Featured Parts |
| Archived | No | Product retained in the database but removed from the catalog |

Allowed transitions:

- Draft → Needs review, Published, or Archived
- Needs review → Draft, Published, or Archived
- Published → Draft or Archived
- Archived → Draft

An archived product must be restored to Draft and reviewed before it can be published again.

## Admin workflow

- **Parts** shows counts and filters for all four states.
- A product can be previewed even when it is not public.
- The status can be changed from the list or the edit form.
- **Vehicle models** manages reusable brand/model/chassis/year records.
- The product form can select structured vehicle models and still retain free-text compatibility
  notes for exceptional applications.
- Batch import assigns uncertain rows to **Needs review** and other rows to **Draft**. It only links
  vehicle models when an exact existing model/chassis match is found.

## Verification checklist

1. Create a Draft product and confirm that it appears in Admin Parts but not in the public Catalog.
2. Open its admin preview and verify its image, translations, codes, brand, category, and vehicle
   compatibility.
3. Publish it and confirm that it appears publicly.
4. Archive it and confirm that it disappears publicly without losing its data.
5. Restore it to Draft and confirm that direct Archived → Published was not possible.
6. Create a vehicle model, attach it to a product, save, and reopen the product to verify the
   selection.

## Automated checks

From `frontend/`:

```powershell
npm run lint
npm test -- --run
npm run build
```

The SQL regression script is `supabase/tests/003_catalog_governance.sql`. Run it only in a disposable
or development database because it creates and removes test records.
