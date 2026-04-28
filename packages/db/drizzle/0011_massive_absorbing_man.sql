CREATE TABLE "telemetry_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"event_id" integer,
	"location" geometry(Point, 4326) NOT NULL,
	"timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "venues" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"boundary" geometry(Point, 4326),
	"center" geometry(Point, 4326),
	"primary_color" varchar(7) DEFAULT '#ff382e',
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "location" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "start_date" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ALTER COLUMN "end_date" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "venue_id" integer;--> statement-breakpoint
ALTER TABLE "path_segments" ADD COLUMN "venue_id" integer;--> statement-breakpoint
ALTER TABLE "points_of_interest" ADD COLUMN "venue_id" integer;--> statement-breakpoint
ALTER TABLE "tickets" ADD COLUMN "venue_id" integer;--> statement-breakpoint
ALTER TABLE "tickets" ADD COLUMN "event_id" integer;--> statement-breakpoint
ALTER TABLE "telemetry_logs" ADD CONSTRAINT "telemetry_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "telemetry_logs" ADD CONSTRAINT "telemetry_logs_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "events" ADD CONSTRAINT "events_venue_id_venues_id_fk" FOREIGN KEY ("venue_id") REFERENCES "public"."venues"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "path_segments" ADD CONSTRAINT "path_segments_venue_id_venues_id_fk" FOREIGN KEY ("venue_id") REFERENCES "public"."venues"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "points_of_interest" ADD CONSTRAINT "points_of_interest_venue_id_venues_id_fk" FOREIGN KEY ("venue_id") REFERENCES "public"."venues"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_venue_id_venues_id_fk" FOREIGN KEY ("venue_id") REFERENCES "public"."venues"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;