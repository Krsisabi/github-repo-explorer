// Downloads the public GitHub GraphQL schema that codegen builds types from.
// The schema is not committed: it is generated output that anyone can refetch.
//
// Note the /fpt/ path - GitHub split the schema per plan, and the old
// docs.github.com/public/schema.docs.graphql now returns 404.
import { writeFile } from 'node:fs/promises';

const SCHEMA_URL = 'https://docs.github.com/public/fpt/schema.docs.graphql';
const OUTPUT = 'schema.docs.graphql';

const response = await fetch(SCHEMA_URL);

if (!response.ok) {
  console.error(
    `Failed to download the schema: ${response.status} ${response.statusText}`
  );
  process.exit(1);
}

await writeFile(OUTPUT, await response.text(), 'utf-8');
console.log(`Saved ${OUTPUT}`);
