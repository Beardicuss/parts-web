# Phase 1 database workflow

## Canonical data model

`frontend/src/mockData.js` is the single checked-in catalog source used by the offline
fallback and by the SQL seed generator. Do not hand-edit `supabase/seed_all.sql`.

After changing catalog records:

```powershell
cd frontend
npm run db:seed:generate
npm run db:check
```

The generator does not insert identity IDs. It resolves brands and categories by their
case-insensitive English names and upserts products by case-insensitive product code.

Both English and Georgian names/titles are required. Brand/category deletion is
restricted while products reference the record, preventing accidental orphaned products.
At 83 products, the ordinary foreign-key and chronological indexes are sufficient.
`pg_trgm` and leading-wildcard search indexes are intentionally deferred until production
query measurements show they are necessary.

## Apply to a new Supabase project

1. Open Supabase SQL Editor.
2. Run every file in `supabase/migrations` in filename order.
3. Run `supabase/seed_all.sql`.
4. Run `supabase/tests/001_catalog_schema.sql`; a successful result has no exception and
   rolls back all temporary records.
5. Run `supabase/seed_all.sql` a second time.
6. Confirm the verification query below still returns 83 products and 83 unique codes.

```sql
select
  count(*) as product_count,
  count(distinct lower(btrim(code))) as unique_product_codes
from public.parts;
```

## Upgrade an existing project

Back up the database first. Run migrations in filename order; `create table if not
exists` protects existing tables, while the legacy-upgrade migration adds missing
columns, constraints, restrictive foreign keys, indexes, and repairs identity sequences.
Then run the generated seed and the schema test.

If creation of a case-insensitive unique index fails, stop and resolve the reported
duplicate instead of deleting data automatically.

## Rollback and recovery

The migrations intentionally have no destructive automatic down migration. Before
production application, create a Supabase database backup. Recovery is:

1. Restore the pre-migration backup if schema application fails.
2. Correct the migration or source data in a new commit.
3. Reapply to a disposable Supabase project before retrying production.

The seed is an upsert and can be safely reapplied, but it does not delete products absent
from the canonical file.
