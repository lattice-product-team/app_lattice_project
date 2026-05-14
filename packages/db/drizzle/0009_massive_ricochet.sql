ALTER TABLE "events" ADD COLUMN "banner_url" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "gallery_urls" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "points_of_interest" ADD COLUMN "image_url" text;--> statement-breakpoint
ALTER TABLE "points_of_interest" ADD COLUMN "banner_url" text;--> statement-breakpoint
ALTER TABLE "points_of_interest" ADD COLUMN "gallery_urls" jsonb DEFAULT '[]'::jsonb;