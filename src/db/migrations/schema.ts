import { pgTable, index, serial, varchar, timestamp } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const userSchedules = pgTable("user_schedules", {
	id: serial().primaryKey().notNull(),
	email: varchar().notNull(),
	createdAt: timestamp("created_at", { mode: 'string' }).defaultNow().notNull(),
	event: varchar().notNull(),
	cancelUrl: varchar("cancel_url").notNull(),
	rescheduleUrl: varchar("reschedule_url").notNull(),
	startTime: timestamp("start_time", { mode: 'string' }).notNull(),
	status: varchar().notNull(),
}, (table) => [
	index("email_index").using("btree", table.email.asc().nullsLast().op("text_ops")),
]);
