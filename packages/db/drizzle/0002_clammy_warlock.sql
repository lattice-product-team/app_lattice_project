ALTER TYPE "public"."poi_type" ADD VALUE 'bar';--> statement-breakpoint
ALTER TYPE "public"."poi_type" ADD VALUE 'information';--> statement-breakpoint
ALTER TYPE "public"."poi_type" ADD VALUE 'entrance';--> statement-breakpoint
ALTER TYPE "public"."poi_type" ADD VALUE 'exit';--> statement-breakpoint
ALTER TYPE "public"."poi_type" ADD VALUE 'emergency';--> statement-breakpoint
ALTER TYPE "public"."poi_type" ADD VALUE 'stage';--> statement-breakpoint
ALTER TYPE "public"."poi_type" ADD VALUE 'merch';--> statement-breakpoint
ALTER TYPE "public"."poi_type" ADD VALUE 'security';--> statement-breakpoint
ALTER TABLE "venues" ALTER COLUMN "boundary" SET DATA TYPE geometry(Polygon, 4326);