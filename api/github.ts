import type { VercelRequest, VercelResponse } from '@vercel/node';

// The `.js` extension is required: the package is ESM, so Node resolves this
// specifier at runtime, where extensionless paths do not exist. Vite and tsc
// both accept it without one, which is why only a deployed function catches it.
import {
  PERSISTED_OPERATIONS,
  buildVariables,
  isOperationName,
} from './operations.js';

const GITHUB_GRAPHQL_URL = 'https://api.github.com/graphql';

const UPSTREAM_TIMEOUT_MS = 8000;

// A request names the operation it wants and nothing else is read from it. The
// document the client sends alongside is ignored, so a caller who writes their
// own query and labels it `GetRepos` gets the real `GetRepos` back rather than
// their own request executed with our token.
const readOperationName = (body: Record<string, unknown>) =>
  typeof body.operationName === 'string' ? body.operationName : null;

const wait = (ms: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

// GitHub's GraphQL endpoint occasionally answers a heavy search with 502 from
// its own edge. It is transient, so a couple of retries turn a broken page into
// a slightly slower one. Retrying is safe here because every persisted
// operation is a query: replaying one cannot change anything.
const fetchWithRetry = async ({
  query,
  variables,
  token,
  attempts = 3,
}: {
  query: string;
  variables: Record<string, unknown>;
  token: string;
  attempts?: number;
}) => {
  let lastError: unknown;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    if (attempt > 0) await wait(300 * attempt);

    try {
      const response = await fetch(GITHUB_GRAPHQL_URL, {
        method: 'POST',
        headers: {
          authorization: `Bearer ${token}`,
          'content-type': 'application/json',
          'user-agent': 'github-repo-explorer',
        },
        body: JSON.stringify({ query, variables }),
        // Without a deadline a hung upstream holds the function until the
        // platform kills it, and the retries multiply that wait.
        signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
      });

      if (response.status < 500) return response;
      lastError = new Error(`GitHub answered ${response.status}`);
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError ?? new Error('GitHub did not answer');
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

  // The platform parses a JSON body itself and hands over an object; a string
  // arrives only when the client sent some other content type.
  let body: unknown;
  try {
    const raw = request.body;
    body = typeof raw === 'string' ? JSON.parse(raw) : raw;
  } catch {
    return response.status(400).json({ error: 'Body must be valid JSON' });
  }

  if (!body || typeof body !== 'object') {
    return response.status(400).json({ error: 'Body must be valid JSON' });
  }

  const operationName = readOperationName(body as Record<string, unknown>);
  if (!operationName || !isOperationName(operationName)) {
    return response.status(403).json({ error: 'Operation is not allowed' });
  }

  const variables = buildVariables(
    operationName,
    (body as Record<string, unknown>).variables
  );
  if (!variables) {
    return response.status(400).json({ error: 'Variables are not valid' });
  }

  let upstream: Response;
  try {
    upstream = await fetchWithRetry({
      query: PERSISTED_OPERATIONS[operationName],
      variables,
      token,
    });
  } catch (error) {
    console.error('GitHub request failed', error);
    return response.status(502).json({ error: 'GitHub is unavailable' });
  }

  // A failing GitHub edge answers with an HTML page. Forwarding that body while
  // stamping it `application/json` makes the client library blow up inside its
  // own parser instead of showing an error, so only a successful answer is
  // passed through; anything else becomes one predictable envelope.
  if (!upstream.ok) {
    console.error(
      'GitHub answered %s: %s',
      upstream.status,
      (await upstream.text()).slice(0, 500)
    );
    return response.status(502).json({ error: 'GitHub is unavailable' });
  }

  const payload = await upstream.text();

  response.setHeader('content-type', 'application/json');
  return response.status(200).send(payload);
}
