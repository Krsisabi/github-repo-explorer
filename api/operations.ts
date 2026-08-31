// The only three documents this proxy will ever send to GitHub.
//
// The client asks for an operation by name and supplies variables; it never
// supplies a document. Checking a document that arrives from the browser is a
// losing game - the name at the top of it is just a label the caller writes
// themselves, so an allow-list of names lets any request through. Keeping the
// text here removes the question: whatever the browser sends, GitHub only ever
// sees one of the three documents below.
//
// These mirror src/services/queries.graphql.ts, which stays the client's source
// for generated types. A CI check that diffs the two is the obvious next step;
// until then a drift shows up as a field the client maps to undefined.

const LIST_FIELDS = `
      edges {
        node {
          ... on Repository {
            id
            name
            url
            stargazerCount
            defaultBranchRef {
              target {
                ... on Commit {
                  committedDate
                }
              }
            }
          }
        }
      }`;

export const PERSISTED_OPERATIONS = {
  GetRepos: `
    query GetRepos($query: String!, $first: Int!) {
      search(query: $query, type: REPOSITORY, first: $first) {${LIST_FIELDS}
      }
    }
  `,
  SearchRepo: `
    query SearchRepo($name: String!, $first: Int!) {
      search(query: $name, type: REPOSITORY, first: $first) {${LIST_FIELDS}
      }
    }
  `,
  GetRepo: `
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
  `,
} as const;

export type OperationName = keyof typeof PERSISTED_OPERATIONS;

export const isOperationName = (value: unknown): value is OperationName =>
  typeof value === 'string' && value in PERSISTED_OPERATIONS;

// Variables are the one thing the browser still controls, so each operation
// declares what it accepts. `first` is capped because a large page multiplies
// the cost GitHub charges the token, and the token's hourly budget is shared by
// everyone looking at the demo.
const MAX_PAGE_SIZE = 100;
const MAX_STRING_LENGTH = 256;

const readString = (value: unknown) =>
  typeof value === 'string' && value.length > 0
    ? value.slice(0, MAX_STRING_LENGTH)
    : null;

const readPageSize = (value: unknown) =>
  typeof value === 'number' && Number.isInteger(value) && value > 0
    ? Math.min(value, MAX_PAGE_SIZE)
    : MAX_PAGE_SIZE;

type Variables = Record<string, unknown>;

export const buildVariables = (
  operation: OperationName,
  received: unknown
): Variables | null => {
  const input: Variables =
    received && typeof received === 'object' ? (received as Variables) : {};

  if (operation === 'GetRepos' || operation === 'SearchRepo') {
    const key = operation === 'GetRepos' ? 'query' : 'name';
    const term = readString(input[key]);
    if (!term) return null;

    return { [key]: term, first: readPageSize(input.first) };
  }

  const owner = readString(input.owner);
  const name = readString(input.name);
  if (!owner || !name) return null;

  return { owner, name };
};
