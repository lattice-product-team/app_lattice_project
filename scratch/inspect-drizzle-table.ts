import * as schema from '../packages/db/src/schema';

const firstTable = schema.users;
console.log('User table structure keys:', Object.keys(firstTable));
// Check common drizzle internal symbols or properties
console.log('User table dbName:', (firstTable as any).dbName);
console.log('User table name:', (firstTable as any).name);

import { getTableConfig } from 'drizzle-orm/pg-core';
try {
  const config = getTableConfig(firstTable);
  console.log('Table name via getTableConfig:', config.name);
} catch (e) {
  console.log('getTableConfig failed');
}
