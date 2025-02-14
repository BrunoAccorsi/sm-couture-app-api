CREATE TABLE "users_schedules" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" varchar(256) NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
