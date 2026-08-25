# Admin batch import

For detailed folder creation, naming, and organization instructions in English and Georgian, see
[BATCH_IMPORT_FOLDER_GUIDE.md](./BATCH_IMPORT_FOLDER_GUIDE.md).

## Purpose

The batch importer turns an organized product-photo folder into editable catalog rows. It never
publishes products immediately after folder selection; an administrator reviews and confirms the
rows first.

## Expected folder contract

```text
Products/
  Brand/
    Model or Platform/
      Category/
        Module Family/
          PRODUCT-CODE.webp
```

Example:

```text
Products/Audi/Q5 FY/Lighting/Headlight Control Modules/80A907397A.webp
```

The importer derives:

- code: `80A907397A`
- brand: `Audi`
- compatible model: `Q5 FY`
- category: `Lighting`
- module family: `Headlight Control Modules`
- initial English and Georgian titles from the detected technical names

Folders named `Unverified Model` and shared platforms are marked for review.

## Administrator workflow

1. Open **Admin → Batch import**.
2. Select the organized `Products` folder, or select several individual images.
3. Wait for local metadata and exact-image duplicate analysis.
4. Use **Needs review** to correct uncertain vehicle models and titles.
5. Optionally select multiple rows and apply one brand or category to all of them.
6. Leave only the products that should be published checked.
7. Choose **Import selected products**.
8. Keep the page open until processing finishes. Failed rows remain available for correction and
   retry; successful rows become unselected and show `Imported`.

## Processing and safety rules

- JPG, PNG, and WebP source images up to 20 MB are accepted.
- Images are decoded, orientation-corrected, resized to at most 1920 px, and encoded as WebP.
- A separate 640 px WebP thumbnail is generated.
- The final object limit remains 8 MB and Supabase enforces the same storage limit.
- Exact duplicates inside the selected batch are blocked.
- Product codes already present in Supabase or repeated in the batch are blocked.
- Missing detected brands/categories are created using the technical name in both language fields.
- Two products are processed concurrently to avoid freezing the browser or flooding storage.
- An uploaded image is rolled back if saving its database record fails.

## Human review still required

The importer cannot safely infer compatibility years, left/right side, replacement codes, or
interchangeability when the supplier did not provide that information. Georgian technical titles
are initialized from the detected technical names and should be corrected when a localized term is
important.
