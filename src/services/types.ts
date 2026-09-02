import { GetReposQuery } from '~/__generated__/graphql';

// The shape of the list response is not written here by hand: codegen derives
// it from the query text and GitHub's schema, so a field that moves in the
// schema breaks the build instead of arriving as `undefined` at runtime.
// SearchRepo selects the same fields, so its response satisfies this too.
export type RepoSearchConnection = GetReposQuery['search'];

export type Repo = {
  stargazerCount: number | undefined | null;
  languages?: string[];
  login?: string;
  ownerUrl?: string;
  name?: string;
  description?: string | null;
  avatar?: string;
  updatedAt?: Date | string | null;
  url?: string;
};

export type RepoItem = {
  id: string;
  name: string;
  url: string;
  lastPushedAt?: string | Date | null;
  stargazersCount: number;
};

/**
 * One window of results plus what is needed to ask for the next one.
 * `totalCount` is everything GitHub matched, which is far more than it will
 * actually hand out - see SEARCH_CEILING.
 */
export type RepoWindow = {
  items: RepoItem[];
  totalCount: number;
  endCursor: string | null;
  hasNextPage: boolean;
};
