import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'schema.docs.graphql',
  documents: ['src/**/*.graphql.ts'],
  generates: {
    'src/__generated__/': {
      preset: 'client',
      plugins: [],
      config: {
        // Without this, GitHub's custom scalars land as `unknown` and every
        // read of a URL or a date needs a cast.
        scalars: {
          URI: 'string',
          DateTime: 'string',
          GitObjectID: 'string',
          HTML: 'string',
        },
      },
    },
  },
};

export default config;
