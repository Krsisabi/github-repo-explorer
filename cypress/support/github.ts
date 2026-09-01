/**
 * A stand-in for the proxy, so the suite tests this application rather than
 * GitHub's ranking of the day.
 *
 * The previous tests searched for "tetris" and asserted that `react-tetris`
 * came back second: true when they were written, false now, and never a
 * statement about any code in this repository. Everything here is generated, so
 * a failure means the app changed.
 *
 * The stub answers on operation name and cursor, which is exactly what the real
 * proxy keys on - the client sends `operationName` alongside the document, and
 * the proxy ignores the document entirely.
 */

/** Mirrors `PAGE_SIZE` and `WINDOW_SIZE` in the application. */
export const PAGE_SIZE = 10;
export const WINDOW_SIZE = 100;

/** Mirrors `SEARCH_CEILING`: what `search` will hand out however much matched. */
export const SEARCH_CEILING = 1000;

/**
 * Row names carry their address in the result set, so an assertion can say
 * "the first row of the second window" instead of trusting a fixture's order.
 */
export const repoName = (windowIndex: number, slot: number) =>
  `repo-w${windowIndex}-${slot}`;

export const repoOwner = (windowIndex: number) => `octo-w${windowIndex}`;

/** Opaque to the app, so any readable string will do - and it reads better. */
const cursorAfter = (windowIndex: number) => `cursor-${windowIndex}`;

const windowIndexFor = (after: unknown) =>
  typeof after === 'string' ? Number(after.replace('cursor-', '')) + 1 : 0;

const listNode = (windowIndex: number, slot: number) => ({
  id: `${windowIndex}-${slot}`,
  name: repoName(windowIndex, slot),
  url: `https://github.com/${repoOwner(windowIndex)}/${repoName(windowIndex, slot)}`,
  stargazerCount: 1000 - slot,
  pushedAt: '2026-01-02T03:04:05Z',
});

const searchWindow = (windowIndex: number, totalCount: number) => {
  // GitHub stops at the ceiling regardless of the match count, and the app is
  // built around that. A stub that kept handing out windows would let a broken
  // cap pass.
  const reachable = Math.min(totalCount, SEARCH_CEILING);
  const start = windowIndex * WINDOW_SIZE;
  const size = Math.max(0, Math.min(WINDOW_SIZE, reachable - start));

  return {
    data: {
      search: {
        repositoryCount: totalCount,
        pageInfo: {
          hasNextPage: start + size < reachable,
          endCursor: size > 0 ? cursorAfter(windowIndex) : null,
        },
        edges: Array.from({ length: size }, (_, slot) => ({
          node: listNode(windowIndex, slot),
        })),
      },
    },
  };
};

// A one-pixel transparent GIF: an avatar that costs no network request and
// cannot make a test fail because someone's picture moved.
const AVATAR =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';

export const REPO_DESCRIPTION = 'A repository the tests can rely on.';
export const REPO_LANGUAGES = ['TypeScript', 'SCSS'];

const repositoryFound = (owner: string, name: string) => ({
  data: {
    repository: {
      name,
      stargazerCount: 4321,
      updatedAt: '2026-02-03T04:05:06Z',
      url: `https://github.com/${owner}/${name}`,
      description: REPO_DESCRIPTION,
      languages: { nodes: REPO_LANGUAGES.map((language) => ({ name: language })) },
      owner: {
        login: owner,
        url: `https://github.com/${owner}`,
        avatarUrl: AVATAR,
      },
    },
  },
});

// GitHub answers a missing repository with 200 and an errors array, not a 404.
// The application reads `type` out of it to tell "no such repository" from "the
// service is down", so the shape matters more than the status.
const repositoryMissing = (owner: string, name: string) => ({
  data: { repository: null },
  errors: [
    {
      type: 'NOT_FOUND',
      path: ['repository'],
      message: `Could not resolve to a Repository with the name '${owner}/${name}'.`,
    },
  ],
});

export type RepoOutcome = 'found' | 'missing' | 'unavailable';

export type StubOptions = {
  /** What `repositoryCount` reports. Above the ceiling the cap kicks in. */
  totalCount?: number;
  /** What the details page gets back. */
  repo?: RepoOutcome;
};

/**
 * Registers the stub and aliases it `@github`.
 *
 * Call before `cy.visit`. The old suite registered its intercept after the
 * visit, by which time the landing request had already gone, and then waited
 * ten seconds for a second one that never came.
 */
export const stubGitHub = ({
  totalCount = 1234,
  repo = 'found',
}: StubOptions = {}) => {
  cy.intercept('POST', '/api/github', (req) => {
    const body = req.body as {
      operationName?: string;
      variables?: Record<string, unknown>;
    };
    const variables = body.variables ?? {};

    if (body.operationName === 'GetRepos' || body.operationName === 'SearchRepo') {
      req.reply(searchWindow(windowIndexFor(variables.after), totalCount));
      return;
    }

    if (body.operationName === 'GetRepo') {
      const owner = String(variables.owner ?? '');
      const name = String(variables.name ?? '');

      if (repo === 'unavailable') {
        req.reply({ statusCode: 502, body: { error: 'GitHub is unavailable' } });
        return;
      }

      req.reply(
        repo === 'missing'
          ? repositoryMissing(owner, name)
          : repositoryFound(owner, name)
      );
      return;
    }

    // The proxy refuses anything outside its three operations; a test that
    // provokes this has found a request the app should not be making.
    req.reply({ statusCode: 403, body: { error: 'Operation is not allowed' } });
  }).as('github');
};

type GitHubCall = {
  request: {
    body: {
      operationName: string;
      variables: { after?: string | null; name?: string; owner?: string };
    };
  };
};

/** Every call made so far, for assertions about what was asked and how often. */
export const githubCalls = () =>
  cy.get('@github.all') as unknown as Cypress.Chainable<GitHubCall[]>;

/** The list on screen, in order. */
export const listedRepos = () =>
  cy.get('[data-testid="repo-list"]').find('a[title]');

export const searchField = () =>
  cy.get('[placeholder="Search GitHub Repo..."]');

export const pageButton = (label: string) =>
  cy.get(`button[aria-label="${label}"]`);
