import { graphql } from '~/__generated__';

// Both list queries hit `search`: the landing page is just a search with a
// default filter. The old GetRepos read `viewer.repositories`, which returns
// whatever account owns the token - meaningless once the token moved server-side.
export const GET_REPOS = graphql(`
  query GetRepos($query: String!, $first: Int!, $after: String) {
    search(query: $query, type: REPOSITORY, first: $first, after: $after) {
      repositoryCount
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          ... on Repository {
            id
            name
            url
            stargazerCount
            pushedAt
          }
        }
      }
    }
  }
`);

export const SEARCH_REPO = graphql(`
  query SearchRepo($name: String!, $first: Int!, $after: String) {
    search(query: $name, type: REPOSITORY, first: $first, after: $after) {
      repositoryCount
      pageInfo {
        hasNextPage
        endCursor
      }
      edges {
        node {
          ... on Repository {
            id
            name
            url
            stargazerCount
            pushedAt
          }
        }
      }
    }
  }
`);

export const GET_REPO = graphql(`
  query GetRepo($owner: String!, $name: String!) {
    repository(owner: $owner, name: $name) {
      name
      stargazerCount
      updatedAt
      url
      description
      languages(first: 10) {
        nodes {
          name
        }
      }
      owner {
        login
        url
        avatarUrl
      }
    }
  }
`);
