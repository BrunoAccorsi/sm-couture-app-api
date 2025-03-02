import {
  index,
  pgTable,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core';

export const userSchedule = pgTable(
  'user_schedules',
  {
    id: serial('id').primaryKey(),
    email: varchar().notNull(),
    event: varchar().notNull(),
    start_time: timestamp().notNull(),
    status: varchar().notNull(),
    cancel_url: varchar().notNull(),
    reschedule_url: varchar().notNull(),
    createdAt: timestamp('created_at').notNull().defaultNow(),
  },
  (table) => [index('email_index').on(table.email)]
);

export type InsertUserSchedule = typeof userSchedule.$inferInsert;
export type SelectUserSChedule = typeof userSchedule.$inferSelect;
