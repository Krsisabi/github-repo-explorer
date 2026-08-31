export const config = { runtime: 'edge' };

const GITHUB_GRAPHQL_URL = 'https://api.github.com/graphql';

// The client is allowed to run only the operations this app actually ships.
// Without it the proxy would be an open relay: anyone could point their own
// queries at it and spend our token's rate limit.
const ALLOWED_OPERATIONS = ['GetRepos', 'SearchRepo', 'GetRepo'];

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json' },
  });

const getOperationName = (query: unknown) => {
  if (typeof query !== 'string') return null;
  const match = query.match(/\b(?:query|mutation)\s+(\w+)/);
  return match ? match[1] : null;
};

export default async function handler(request: Request) {
  if (request.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return json({ error: 'Server is missing its GitHub token' }, 500);
  }

  let body: { query?: unknown; variables?: unknown };
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Body must be valid JSON' }, 400);
  }

  const operationName = getOperationName(body.query);
  if (!operationName || !ALLOWED_OPERATIONS.includes(operationName)) {
    return json({ error: 'Operation is not allowed' }, 403);
  }

  const upstream = await fetch(GITHUB_GRAPHQL_URL, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${token}`,
      'content-type': 'application/json',
      'user-agent': 'github-repo-explorer',
    },
    body: JSON.stringify({ query: body.query, variables: body.variables }),
  });

  return new Response(upstream.body, {
    status: upstream.status,
    headers: {
      'content-type':
        upstream.headers.get('content-type') ?? 'application/json',
      // Repeated searches are cheap for us and invisible to the user.
      'cache-control': 'public, max-age=60, s-maxage=300',
    },
  });
}
