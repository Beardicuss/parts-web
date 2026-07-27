import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import AccessibleDialog from './AccessibleDialog.jsx';

describe('AccessibleDialog', () => {
  it('focuses controls, traps Tab, handles Escape, and restores focus', async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();
    const trigger = document.createElement('button');
    trigger.textContent = 'Open';
    document.body.append(trigger);
    trigger.focus();

    const { unmount } = render(
      <AccessibleDialog
        open
        title="Confirm deletion"
        confirmLabel="Delete"
        cancelLabel="Cancel"
        onConfirm={vi.fn()}
        onCancel={onCancel}
      >
        <p>Delete this record?</p>
      </AccessibleDialog>
    );

    expect(screen.getByRole('dialog')).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByRole('button', { name: 'Cancel' })).toHaveFocus();
    await user.tab({ shift: true });
    expect(screen.getByRole('button', { name: 'Delete' })).toHaveFocus();
    await user.keyboard('{Escape}');
    expect(onCancel).toHaveBeenCalledOnce();

    unmount();
    expect(trigger).toHaveFocus();
    trigger.remove();
  });
});
