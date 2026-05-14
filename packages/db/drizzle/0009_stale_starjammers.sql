ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "banner_url" text;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN IF NOT EXISTS "gallery_urls" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "points_of_interest" ADD COLUMN IF NOT EXISTS "image_url" text;--> statement-breakpoint
ALTER TABLE "points_of_interest" ADD COLUMN IF NOT EXISTS "banner_url" text;--> statement-breakpoint
ALTER TABLE "points_of_interest" ADD COLUMN IF NOT EXISTS "gallery_urls" jsonb DEFAULT '[]'::jsonb;