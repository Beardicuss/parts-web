# Phase 4 UX flows

## Public catalog navigation

```text
Home category
  → Catalog URL with system filter
  → Search/brand/category changes update that URL
  → Product detail receives the complete catalog return URL
  → Back to catalog restores the same filters
```

The URL keys are:

- `q`: code/name/replacement/compatibility search
- `brand`: brand ID
- `category`: technical category ID
- `system`: broad homepage system slug

Search, brand, category, and system filters combine with **AND** semantics. The search
value itself matches any supported text field with OR semantics. Selecting a technical
category clears the broader system filter because the category is the more specific user
choice. Browser back/forward navigation rehydrates controls from the URL.

Product contact opens the existing SebaTech WhatsApp number and includes the product code
in a localized draft message. Unknown routes show a localized 404. Missing product IDs
show a separate product-not-found state.

## Loading and recovery

- Catalog and featured products show visible card skeletons.
- Recoverable public read failures provide retry actions.
- Empty queries remain distinct from failures.
- Product images show localized fallback text after missing/failed image loads.

## Admin navigation and dialogs

All former `window.prompt` and `window.confirm` interactions use the reusable
`AccessibleDialog`:

- focus moves into the dialog when it opens;
- Tab and Shift+Tab remain inside;
- Escape cancels when an operation is not busy;
- focus returns to the trigger after closing;
- destructive operations are labeled and disabled while running.

Reference creation requires both translated names. Duplicate product codes and duplicate
reference names receive specific inline messages.

## Unsaved product forms

Once a product form differs from its database/new-form baseline:

- internal route changes and browser back/forward show a discard dialog;
- browser/tab closure triggers the native unload warning;
- **Keep editing** returns to the form;
- **Discard and leave** proceeds;
- a successful save bypasses the blocker;
- text drafts remain in session storage across session expiry and reauthentication.

Selected image files cannot be persisted by browser storage and must be selected again
after a full page/session restart.
