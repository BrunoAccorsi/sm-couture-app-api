CREATE TABLE "user_schedules" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" varchar NOT NULL,
	"userId" varchar NOT NULL,
	"event" varchar NOT NULL,
	"start_time" timestamp NOT NULL,
	"status" varchar NOT NULL,
	"cancel_url" varchar NOT NULL,
	"reschedule_url" varchar NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE INDEX "userId_index" ON "user_schedules" USING btree ("userId");