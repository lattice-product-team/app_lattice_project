CREATE TYPE "public"."event_type" AS ENUM('music', 'food', 'tech', 'sports', 'generic');--> statement-breakpoint
CREATE TABLE "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"type" "event_type" DEFAULT 'generic',
	"location" geometry(Point, 4326) NOT NULL,
	"boundary" geometry(Polygon, 4326),
	"image_url" text,
	"start_date" timestamp,
	"end_date" timestamp,
	"metadata" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "nodes" ADD COLUMN "event_id" integer;--> statement-breakpoint
ALTER TABLE "points_of_interest" ADD COLUMN "event_id" integer;--> statement-breakpoint
ALTER TABLE "nodes" ADD CONSTRAINT "nodes_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "points_of_interest" ADD CONSTRAINT "points_of_interest_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;