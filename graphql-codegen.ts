import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  overwrite: true,
  schema: 'schema.docs.graphql',
  documents: ['src/**/*.graphql.ts'],
  generates: {
    'src/__generated__/': {
      preset: 'client',
      plugins: [],
    },
  },
};

export default config;
