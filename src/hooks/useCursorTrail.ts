import { useCallback, useState } from 'react';

// The first window starts at the beginning of the result set, so its cursor is
// known without asking anyone: `null` means "from the top".
const START: (string | null)[] = [null];

/**
 * Remembers where each window of results begins.
 *
 * A cursor connection has no page numbers - the only way to reach window N is
 * to ask for window N-1 and read the cursor it hands back. So the trail is
 * built one step at a time and kept: walking forward is the expensive
 * direction, walking back is free.
 *
 * `searchKey` scopes the trail. Cursors point into one particular result set,
 * so a new query throws all of them away.
 */
export const useCursorTrail = (searchKey: string) => {
  const [trail, setTrail] = useState(START);
  const [lastKey, setLastKey] = useState(searchKey);

  // Resetting during render, not in an effect: an effect would let one frame
  // paint with cursors that belong to the previous search.
  if (searchKey !== lastKey) {
    setLastKey(searchKey);
    setTrail(START);
  }

  const learn = useCallback((index: number, cursor: string) => {
    // Only ever extends the trail by one and never rewrites a known cursor,
    // so a late response cannot corrupt the walk.
    setTrail((current) =>
      index === current.length ? [...current, cursor] : current
    );
  }, []);

  return { trail: searchKey === lastKey ? trail : START, learn };
};
