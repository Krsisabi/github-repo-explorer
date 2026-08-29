import { createApi } from '@reduxjs/toolkit/query/react';
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query';

import {
  FetchRepoQuery,
  FetchRepoQueryVariables,
  ReposQueryVariables,
  SearchRepoQueryVariables,
} from '~/__generated__/graphql';

import { GET_REPO, GET_REPOS, SEARCH_REPO } from './queries.graphql';
import {
  Repo,
  Repos,
  ReposQueryResponse,
  SearchRepoQueryResponse,
} from './types';
import {
  mapReposQueryResponseToRepos,
  mapFetchRepoResponseToRepo,
  mapSearchRepoQueryResponseToRepos,
} from './mapDataFromResponse';

export const api = createApi({
  baseQuery: graphqlRequestBaseQuery({
    url: import.meta.env.VITE_BASE_URL,
    prepareHeaders: (headers) => {
      headers.set('authorization', `Bearer ${import.meta.env.VITE_API_KEY}`);
      return headers;
    },
  }),
  reducerPath: 'githabApi',
  endpoints: (build) => ({
    getRepos: build.query<Repos, Partial<ReposQueryVariables>>({
      query: ({ first = 10 }) => ({
        document: GET_REPOS,
        variables: {
          first,
        },
      }),
      transformResponse: (res: ReposQueryResponse) =>
        mapReposQueryResponseToRepos(res),
    }),
    searchRepo: build.query<
      Repos,
      Partial<SearchRepoQueryVariables> & Pick<SearchRepoQueryVariables, 'name'>
    >({
      query: ({ name, first = 10, after = null }) => ({
        document: SEARCH_REPO,
        variables: {
          name,
          first,
          after,
        },
      }),
      transformResponse: (res: SearchRepoQueryResponse) =>
        mapSearchRepoQueryResponseToRepos(res),
    }),
    getRepo: build.query<Repo, FetchRepoQueryVariables>({
      query: ({ owner, name }) => ({
        document: GET_REPO,
        variables: {
          owner,
          name,
        },
      }),
      transformResponse: (res: FetchRepoQuery) =>
        mapFetchRepoResponseToRepo(res),
    }),
  }),
});

export const {
  useGetReposQuery,
  useSearchRepoQuery,
  useGetRepoQuery,
  useLazySearchRepoQuery,
  useLazyGetReposQuery,
} = api;
