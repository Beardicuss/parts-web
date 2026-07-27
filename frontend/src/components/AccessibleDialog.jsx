import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';

export default function AccessibleDialog({
  open,
  title,
  children,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  destructive = false,
  busy = false,
  confirmDisabled = false
}) {
  const dialogRef = useRef(null);
  const titleId = useId();

  useEffect(() => {
    if (!open) return undefined;
    const previousFocus = document.activeElement;
    const dialog = dialogRef.current;
    const focusable = () =>
      [
        ...dialog.querySelectorAll(
          'button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ].filter((element) => !element.disabled);
    focusable()[0]?.focus();

    const handleKeyDown = (event) => {
      if (event.key === 'Escape' && !busy) {
        event.preventDefault();
        onCancel();
      }
      if (event.key !== 'Tab') return;
      const elements = focusable();
      if (!elements.length) return;
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    dialog.addEventListener('keydown', handleKeyDown);
    return () => {
      dialog.removeEventListener('keydown', handleKeyDown);
      previousFocus?.focus?.();
    };
  }, [busy, onCancel, open]);

  if (!open) return null;

  return createPortal(
    <div className="dialog-backdrop" onMouseDown={busy ? undefined : onCancel}>
      <div
        ref={dialogRef}
        className="dialog-panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onMouseDown={(event) => event.stopPropagation()}
      >
        <h2 id={titleId}>{title}</h2>
        <div className="dialog-content">{children}</div>
        <div className="dialog-actions">
          <button className="btn btn-outline" type="button" onClick={onCancel} disabled={busy}>
            {cancelLabel}
          </button>
          <button
            className={`btn ${destructive ? 'btn-danger' : 'btn-primary'}`}
            type="button"
            onClick={onConfirm}
            disabled={busy || confirmDisabled}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
