import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createMemoryRouter, Link, RouterProvider } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { useUnsavedChanges } from './useUnsavedChanges.js';

function DirtyForm() {
  const blocker = useUnsavedChanges(true);
  return (
    <>
      <Link to="/next">Leave form</Link>
      <span>{blocker.state}</span>
      {blocker.state === 'blocked' && <button onClick={() => blocker.proceed()}>Discard</button>}
    </>
  );
}

describe('useUnsavedChanges', () => {
  it('blocks SPA navigation until the user explicitly proceeds', async () => {
    const user = userEvent.setup();
    const router = createMemoryRouter(
      [
        { path: '/form', element: <DirtyForm /> },
        { path: '/next', element: <h1>Next page</h1> }
      ],
      { initialEntries: ['/form'] }
    );
    render(<RouterProvider router={router} />);

    await user.click(screen.getByRole('link', { name: 'Leave form' }));
    expect(screen.getByText('blocked')).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/form');

    await user.click(screen.getByRole('button', { name: 'Discard' }));
    expect(await screen.findByRole('heading', { name: 'Next page' })).toBeVisible();
  });
});
