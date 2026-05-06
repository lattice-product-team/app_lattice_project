ALTER TABLE "events" DROP CONSTRAINT "events_venue_id_venues_id_fk";--> statement-breakpoint
ALTER TABLE "events" DROP COLUMN "venue_id";--> statement-breakpoint
ALTER TABLE "tickets" DROP CONSTRAINT "tickets_venue_id_venues_id_fk";--> statement-breakpoint
ALTER TABLE "tickets" DROP COLUMN "venue_id";--> statement-breakpoint
ALTER TABLE "points_of_interest" DROP CONSTRAINT "points_of_interest_venue_id_venues_id_fk";--> statement-breakpoint
ALTER TABLE "points_of_interest" DROP COLUMN "venue_id";--> statement-breakpoint
ALTER TABLE "path_segments" DROP CONSTRAINT "path_segments_venue_id_venues_id_fk";--> statement-breakpoint
ALTER TABLE "path_segments" DROP COLUMN "venue_id";--> statement-breakpoint
ALTER TABLE "path_segments" ADD COLUMN "event_id" integer;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "path_segments" ADD CONSTRAINT "path_segments_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint
DROP TABLE "venues";
