import { graphql } from '~/__generated__';

export const GET_REPOS = graphql(`
  query Repos($first: Int!, $after: String) {
    viewer {
      repositories(first: $first, after: $after) {
        pageInfo {
          endCursor
          hasNextPage
        }
        totalCount
        edges {
          node {
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
  query SearchRepo($name: String!, $first: Int!, $after: String) {
    search(query: $name, type: REPOSITORY, first: $first, after: $after) {
      pageInfo {
        endCursor
        hasNextPage
      }
      repositoryCount
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
  query FetchRepo($owner: String!, $name: String!) {
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
