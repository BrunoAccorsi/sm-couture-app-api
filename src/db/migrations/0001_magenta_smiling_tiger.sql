ALTER TABLE "users_schedules" RENAME TO "user_schedules";--> statement-breakpoint
ALTER TABLE "user_schedules" RENAME COLUMN "userId" TO "email";--> statement-breakpoint
ALTER TABLE "user_schedules" ADD COLUMN "event" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "user_schedules" ADD COLUMN "cancel_url" varchar NOT NULL;--> statement-breakpoint
ALTER TABLE "user_schedules" ADD COLUMN "reschedule_url" varchar NOT NULL;