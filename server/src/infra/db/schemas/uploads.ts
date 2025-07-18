import { pgTable, text, timestamp } from 'drizzle-orm/pg-core';
import { uuidv7 } from 'uuidv7';

export const uploads = pgTable('uploads', {
  id: text('id')
    .primaryKey()
    .$default(() => uuidv7()),
  name: text('name').notNull(),
  remoteKey: text('remote_key').notNull().unique(),
  remoteURL: text('remote_url').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});
