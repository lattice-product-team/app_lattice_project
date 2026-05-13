ALTER TABLE "events" ADD COLUMN "is_featured" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "is_trending" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "points_of_interest" ADD COLUMN "is_featured" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "points_of_interest" ADD COLUMN "is_trending" boolean DEFAULT false;