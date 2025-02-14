import { pgTable, serial, timestamp, varchar } from 'drizzle-orm/pg-core';

export const userSchedule = pgTable('user_schedules', {
  id: serial('id').primaryKey(),
  email: varchar().notNull(),
  event: varchar().notNull(),
  cancel_url: varchar().notNull(),
  reschedule_url: varchar().notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

export type InsertUserSchedule = typeof userSchedule.$inferInsert;
export type SelectUserSChedule = typeof userSchedule.$inferSelect;
