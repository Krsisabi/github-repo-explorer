import type { VercelRequest, VercelResponse } from '@vercel/node';

const GITHUB_GRAPHQL_URL = 'https://api.github.com/graphql';

// The client is allowed to run only the operations this app actually ships.
// Without it the proxy would be an open relay: anyone could point their own
// queries at it and spend our token's rate limit.
const ALLOWED_OPERATIONS = ['GetRepos', 'SearchRepo', 'GetRepo'];

const getOperationName = (query: unknown) => {
  if (typeof query !== 'string') return null;
  const match = query.match(/\b(?:query|mutation)\s+(\w+)/);
  return match ? match[1] : null;
};

const wait = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

// GitHub's GraphQL endpoint occasionally answers a heavy search with 502 from
// its own edge. It is transient, so a couple of retries turn a broken page
// into a slightly slower one.
const fetchWithRetry = async ({
  query,
  variables,
  token,
  attempts = 3,
}: {
  query: unknown;
  variables: unknown;
  token: string;
  attempts?: number;
}) => {
  let response: Response | undefined;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    if (attempt > 0) await wait(300 * attempt);

    response = await fetch(GITHUB_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        authorization: `Bearer ${token}`,
        'content-type': 'application/json',
        'user-agent': 'github-repo-explorer',
      },
      body: JSON.stringify({ query, variables }),
    });

    if (response.status < 500) return response;
  }

  return response as Response;
};

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' });
  }

  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return response
      .status(500)
      .json({ error: 'Server is missing its GitHub token' });
  }

  const body =
    typeof request.body === 'string' ? JSON.parse(request.body) : request.body;

  if (!body || typeof body !== 'object') {
    return response.status(400).json({ error: 'Body must be valid JSON' });
  }

  const operationName = getOperationName(body.query);
  if (!operationName || !ALLOWED_OPERATIONS.includes(operationName)) {
    return response.status(403).json({ error: 'Operation is not allowed' });
  }

  const upstream = await fetchWithRetry({
    query: body.query,
    variables: body.variables,
    token,
  });

  const payload = await upstream.text();

  // Repeated searches are cheap for us and invisible to the user.
  response.setHeader('cache-control', 'public, max-age=60, s-maxage=300');
  response.setHeader('content-type', 'application/json');
  return response.status(upstream.status).send(payload);
}
