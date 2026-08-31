import { createApi } from '@reduxjs/toolkit/query/react';
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query';

import {
  GetRepoQuery,
  GetRepoQueryVariables,
  GetReposQueryVariables,
  SearchRepoQueryVariables,
} from '~/__generated__/graphql';

import { GET_REPO, GET_REPOS, SEARCH_REPO } from './queries.graphql';
import { Repo, RepoItem, SearchRepoQueryResponse } from './types';
import {
  mapFetchRepoResponseToRepo,
  mapSearchRepoQueryResponseToRepos,
} from './mapDataFromResponse';

// A serverless function that adds the GitHub token server-side. The client
// never sees a credential, so the bundle stays safe to publish.
const GITHUB_PROXY_URL = '/api/github';

// What the landing page shows before the user searches for anything.
const DEFAULT_QUERY = 'stars:>50000 sort:stars-desc';

export const api = createApi({
  baseQuery: graphqlRequestBaseQuery({ url: GITHUB_PROXY_URL }),
  reducerPath: 'githubApi',
  endpoints: (build) => ({
    getRepos: build.query<RepoItem[], Partial<GetReposQueryVariables>>({
      query: ({ query = DEFAULT_QUERY, first = 100 }) => ({
        document: GET_REPOS,
        variables: {
          query,
          first,
        },
      }),
      transformResponse: (res: SearchRepoQueryResponse) =>
        mapSearchRepoQueryResponseToRepos(res),
    }),
    searchRepo: build.query<
      RepoItem[],
      Partial<SearchRepoQueryVariables> & Pick<SearchRepoQueryVariables, 'name'>
    >({
      query: ({ name, first = 100 }) => ({
        document: SEARCH_REPO,
        variables: {
          name,
          first,
        },
      }),
      transformResponse: (res: SearchRepoQueryResponse) =>
        mapSearchRepoQueryResponseToRepos(res),
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
    }),
  }),
});

export const { useGetRepoQuery, useLazySearchRepoQuery, useLazyGetReposQuery } =
  api;
