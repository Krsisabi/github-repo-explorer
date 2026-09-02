import { createApi } from '@reduxjs/toolkit/query/react';
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query';

import {
  GetRepoQuery,
  GetRepoQueryVariables,
  GetReposQuery,
  SearchRepoQuery,
} from '~/__generated__/graphql';

import { WINDOW_SIZE } from '~/constants/pagination';

import { GET_REPO, GET_REPOS, SEARCH_REPO } from './queries.graphql';
import { Repo, RepoWindow } from './types';
import {
  mapFetchRepoResponseToRepo,
  mapSearchConnectionToRepoWindow,
} from './mapDataFromResponse';

// A serverless function that adds the GitHub token server-side. The client
// never sees a credential, so the bundle stays safe to publish.
//
// graphql-request builds a `new URL()` from this value, which throws on a
// bare path, so the origin has to be spelled out.
const GITHUB_PROXY_URL =
  typeof window === 'undefined'
    ? 'http://localhost:3000/api/github'
    : `${window.location.origin}/api/github`;

// What the landing page shows before the user searches for anything.
const DEFAULT_QUERY = 'stars:>50000 sort:stars-desc';

// A missing repository is not an outage, and the two need different wording:
// "try again" is useless advice for a URL that will never resolve. GitHub
// reports both as an errors array, so the difference is read there rather than
// guessed from the error's shape.
export type RepoErrorKind = 'not-found' | 'unavailable';

type GraphQLErrorMeta = {
  response?: { errors?: { type?: string; message?: string }[] };
};

const readErrorKind = (meta: unknown): RepoErrorKind => {
  const errors = (meta as GraphQLErrorMeta | undefined)?.response?.errors;

  const missing = errors?.some(
    (error) =>
      error?.type === 'NOT_FOUND' ||
      error?.message?.includes('Could not resolve to a Repository')
  );

  return missing ? 'not-found' : 'unavailable';
};

// Walking forward to a distant page costs one request per window, so the
// windows behind you are worth keeping: paging back should not pay again for
// what was already fetched. The default of a minute is shorter than the walk
// itself.
const WINDOW_CACHE_SECONDS = 300;

export const api = createApi({
  baseQuery: graphqlRequestBaseQuery({ url: GITHUB_PROXY_URL }),
  reducerPath: 'githubApi',
  endpoints: (build) => ({
    // Both list endpoints take the cursor of the window they want. RTK Query
    // caches per argument, so a window already walked past comes back from the
    // store instead of costing another request.
    getRepos: build.query<RepoWindow, { after?: string | null }>({
      keepUnusedDataFor: WINDOW_CACHE_SECONDS,
      query: ({ after = null }) => ({
        document: GET_REPOS,
        variables: {
          query: DEFAULT_QUERY,
          first: WINDOW_SIZE,
          after,
        },
      }),
      transformResponse: (res: GetReposQuery) =>
        mapSearchConnectionToRepoWindow(res.search),
    }),
    searchRepo: build.query<
      RepoWindow,
      { name: string; after?: string | null }
    >({
      keepUnusedDataFor: WINDOW_CACHE_SECONDS,
      query: ({ name, after = null }) => ({
        document: SEARCH_REPO,
        variables: {
          name,
          first: WINDOW_SIZE,
          after,
        },
      }),
      transformResponse: (res: SearchRepoQuery) =>
        mapSearchConnectionToRepoWindow(res.search),
    }),
    getRepo: build.query<Repo, GetRepoQueryVariables>({
      query: ({ owner, name }) => ({
        document: GET_REPO,
        variables: {
          owner,
          name,
        },
      }),
      transformResponse: (res: GetRepoQuery) => mapFetchRepoResponseToRepo(res),
      transformErrorResponse: (_error, meta) => readErrorKind(meta),
    }),
  }),
});

export const { useGetRepoQuery, useSearchRepoQuery, useGetReposQuery } = api;
