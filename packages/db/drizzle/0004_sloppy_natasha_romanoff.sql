CREATE TYPE "public"."operational_status" AS ENUM('open', 'closed', 'maintenance');--> statement-breakpoint
ALTER TABLE "points_of_interest" ADD COLUMN "location_name" varchar;--> statement-breakpoint
ALTER TABLE "points_of_interest" ADD COLUMN "address" text;--> statement-breakpoint
ALTER TABLE "points_of_interest" ADD COLUMN "capacity" integer;--> statement-breakpoint
ALTER TABLE "points_of_interest" ADD COLUMN "current_occupancy" integer;--> statement-breakpoint
ALTER TABLE "points_of_interest" ADD COLUMN "status" "operational_status" DEFAULT 'open';--> statement-breakpoint
ALTER TABLE "points_of_interest" ADD COLUMN "metadata" text;