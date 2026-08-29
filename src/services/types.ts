export type SearchRepoQueryResponse = {
  __typename?: 'Query';
  search: {
    __typename?: 'SearchResultItemConnection';
    repositoryCount: number;
    pageInfo: {
      __typename?: 'PageInfo';
      endCursor?: string | null;
      hasNextPage: boolean;
    };
    edges?: Array<{
      __typename?: 'SearchResultItemEdge';
      node?: {
        __typename?: 'Repository';
        id: string;
        name: string;
        url: any;
        stargazers: {
          __typename?: 'StargazerConnection';
          totalCount: number;
        };
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

export type ReposQueryResponse = {
  __typename?: 'Query';
  viewer: {
    __typename?: 'User';
    repositories: {
      __typename?: 'RepositoryConnection';
      totalCount: number;
      pageInfo: {
        __typename?: 'PageInfo';
        endCursor?: string | null;
        hasNextPage: boolean;
      };
      edges?: Array<{
        __typename?: 'RepositoryEdge';
        node?: {
          __typename?: 'Repository';
          id: string;
          name: string;
          url: any;
          stargazers: {
            __typename?: 'StargazerConnection';
            totalCount: number;
          };
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
};

export type Repo = {
  stargazerCount: number | undefined | null;
  languages?: string[];
  login?: string;
  name?: string;
  description?: string | null;
  avatar: string;
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

export type Repos = {
  repoItems: RepoItem[];
  repositoryCount: number;
  pageInfo: {
    endCursor?: string | null;
    hasNextPage: boolean;
  };
};
