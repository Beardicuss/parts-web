import { useCallback } from 'react';
import { useBeforeUnload, useBlocker } from 'react-router-dom';

export function useUnsavedChanges(when) {
  const blocker = useBlocker(
    useCallback(
      ({ currentLocation, nextLocation }) =>
        when &&
        `${currentLocation.pathname}${currentLocation.search}` !==
          `${nextLocation.pathname}${nextLocation.search}`,
      [when]
    )
  );

  useBeforeUnload(
    useCallback(
      (event) => {
        if (!when) return;
        event.preventDefault();
        event.returnValue = '';
      },
      [when]
    )
  );

  return blocker;
}
