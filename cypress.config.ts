import { defineConfig } from 'cypress';

export default defineConfig({
  // Nothing here reads Cypress.env(), and leaving the old bridge open lets any
  // page code read whatever ends up in it.
  allowCypressEnv: false,
  e2e: {
    // The built bundle, served by `npm run preview`. Every call to GitHub is
    // stubbed, so the suite needs neither a token nor the serverless runtime -
    // which is what lets it run on a clean machine in CI. Point this elsewhere
    // (`--config baseUrl=http://localhost:3000`) to run the same specs against
    // `vercel dev`.
    baseUrl: 'http://localhost:4173',
    video: false,
  },
});
