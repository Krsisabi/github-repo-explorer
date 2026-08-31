export type SearchRepoQueryResponse = {
  __typename?: 'Query';
  search: {
    __typename?: 'SearchResultItemConnection';
    edges?: Array<{
      __typename?: 'SearchResultItemEdge';
      node?: {
        __typename?: 'Repository';
        id: string;
        name: string;
        url: string;
        // The scalar field, not the `stargazers` connection: fine-grained
        // tokens are refused on the connection inside a search result.
        stargazerCount: number;
        defaultBranchRef?: {
          __typename?: 'Ref';
          target?: {
            __typename?: 'Commit';
            committedDate?: string | Date | null;
          } | null;
        } | null;
      } | null;
    } | null> | null;
  };
};

// The landing list is the same search shape, just with a default filter.
export type ReposQueryResponse = SearchRepoQueryResponse;

export type Repo = {
  stargazerCount: number | undefined | null;
  languages?: string[];
  login?: string;
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
  committedDate?: string | Date | null;
  stargazersCount: number;
};
