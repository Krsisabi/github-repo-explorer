import { graphql } from '~/__generated__';

// Both list queries hit `search`: the landing page is just a search with a
// default filter. The old GetRepos read `viewer.repositories`, which returns
// whatever account owns the token - meaningless once the token moved server-side.
export const GET_REPOS = graphql(`
  query GetRepos($query: String!, $first: Int!) {
    search(query: $query, type: REPOSITORY, first: $first) {
      edges {
        node {
          ... on Repository {
            id
            name
            url
            stargazers {
              totalCount
            }
            defaultBranchRef {
              target {
                ... on Commit {
                  committedDate
                }
              }
            }
          }
        }
      }
    }
  }
`);

export const SEARCH_REPO = graphql(`
  query SearchRepo($name: String!, $first: Int!) {
    search(query: $name, type: REPOSITORY, first: $first) {
      edges {
        node {
          ... on Repository {
            id
            name
            url
            stargazers {
              totalCount
            }
            defaultBranchRef {
              target {
                ... on Commit {
                  committedDate
                }
              }
            }
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
