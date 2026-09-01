// One request to GitHub brings a window of results; the user reads it ten at a
// time. Both numbers are fixed by the API on one side and by the layout on the
// other, so they live here rather than inside a component.

/** What one screen of the list shows. */
export const PAGE_SIZE = 10;

/** The most `search` will return in a single request. */
export const WINDOW_SIZE = 100;

/**
 * How deep `search` lets anyone page. Past this GitHub reports
 * `hasNextPage: false` and returns nothing, no matter how many repositories
 * matched - verified against the live API, not assumed.
 */
export const SEARCH_CEILING = 1000;

/** Pages the user can turn without a new request. */
export const PAGES_PER_WINDOW = WINDOW_SIZE / PAGE_SIZE;

/** The page number travels in the URL, so a reload lands where you were. */
export const PAGE_KEY = 'page';

/**
 * The last page anyone can actually reach: the smaller of what matched and
 * what GitHub is willing to hand out.
 */
export const lastReachablePage = (totalCount: number) =>
  Math.max(1, Math.ceil(Math.min(totalCount, SEARCH_CEILING) / PAGE_SIZE));
