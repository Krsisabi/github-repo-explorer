import { createApi } from '@reduxjs/toolkit/query/react';
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query';

import {
  GetRepoQuery,
  GetRepoQueryVariables,
  GetReposQueryVariables,
  SearchRepoQueryVariables,
} from '~/__generated__/graphql';

import { GET_REPO, GET_REPOS, SEARCH_REPO } from './queries.graphql';
import {
  Repo,
  RepoItem,
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
    getRepos: build.query<RepoItem[], Partial<GetReposQueryVariables>>({
      query: ({ first = 100 }) => ({
        document: GET_REPOS,
        variables: {
          first,
        },
      }),
      transformResponse: (res: ReposQueryResponse) =>
        mapReposQueryResponseToRepos(res),
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
