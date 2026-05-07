import * as schema from '../packages/db/src/schema';

const tableNames = Object.values(schema)
  .filter((entity: any) => entity && entity.dbName)
  .map((entity: any) => entity.dbName);

console.log('Table names found:', tableNames);
