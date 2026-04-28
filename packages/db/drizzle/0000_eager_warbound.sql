CREATE TYPE "public"."crowd_level" AS ENUM('low', 'moderate', 'high', 'blocked');--> statement-breakpoint
CREATE TYPE "public"."event_type" AS ENUM('music', 'food', 'tech', 'sports', 'generic');--> statement-breakpoint
CREATE TYPE "public"."mobility_mode" AS ENUM('standard', 'wheelchair', 'reduced_mobility', 'visual_impairment', 'family_stroller');--> statement-breakpoint
CREATE TYPE "public"."poi_type" AS ENUM('restaurant', 'wc', 'grandstand', 'gate', 'medical', 'shop', 'parking', 'meetup_point');--> statement-breakpoint
CREATE TYPE "public"."surface_type" AS ENUM('asphalt', 'grass', 'gravel', 'stairs', 'ramp');--> statement-breakpoint
CREATE TABLE "events" (
	"id" serial PRIMARY KEY NOT NULL,
	"venue_id" integer,
	"name" varchar NOT NULL,
	"description" text,
	"type" "event_type" DEFAULT 'generic',
	"location" geometry(Point, 4326),
	"location_name" varchar,
	"boundary" geometry(Polygon, 4326),
	"image_url" text,
	"start_date" timestamp NOT NULL,
	"end_date" timestamp NOT NULL,
	"metadata" text,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "group_members" (
	"user_id" integer,
	"group_id" integer,
	"joined_at" timestamp,
	"last_location" geometry(Point, 4326),
	"last_updated" timestamp,
	CONSTRAINT "group_members_user_id_group_id_pk" PRIMARY KEY("user_id","group_id")
);
--> statement-breakpoint
CREATE TABLE "groups" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar,
	"invite_code" varchar,
	"created_by" integer,
	"meeting_point" geometry(Point, 4326),
	"created_at" timestamp,
	CONSTRAINT "groups_invite_code_unique" UNIQUE("invite_code")
);
--> statement-breakpoint
CREATE TABLE "nodes" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" integer,
	"location" geometry(Point, 4326) NOT NULL,
	"name" varchar
);
--> statement-breakpoint
CREATE TABLE "offline_packages" (
	"id" integer PRIMARY KEY NOT NULL,
	"region_name" varchar,
	"file_url" varchar,
	"version" varchar,
	"size_mb" double precision
);
--> statement-breakpoint
CREATE TABLE "path_segments" (
	"id" serial PRIMARY KEY NOT NULL,
	"venue_id" integer,
	"source_node_id" integer NOT NULL,
	"target_node_id" integer NOT NULL,
	"distance" double precision NOT NULL,
	"surface" "surface_type" DEFAULT 'asphalt',
	"slope_percentage" double precision DEFAULT 0,
	"has_stairs" boolean DEFAULT false,
	"crowd_level" "crowd_level" DEFAULT 'low'
);
--> statement-breakpoint
CREATE TABLE "points_of_interest" (
	"id" serial PRIMARY KEY NOT NULL,
	"venue_id" integer,
	"event_id" integer,
	"name" varchar NOT NULL,
	"description" text,
	"type" "poi_type" NOT NULL,
	"location" geometry(Point, 4326) NOT NULL,
	"crowd_level" "crowd_level" DEFAULT 'low',
	"is_wheelchair_accessible" boolean DEFAULT true,
	"has_priority_lane" boolean,
	CONSTRAINT "points_of_interest_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "saved_locations" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"label" varchar,
	"location" geometry(Point, 4326),
	"created_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "telemetry_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"event_id" integer,
	"location" geometry(Point, 4326) NOT NULL,
	"timestamp" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "tickets" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" integer,
	"venue_id" integer,
	"event_id" integer,
	"code" varchar,
	"owner_email" varchar,
	"gate" varchar,
	"zone_name" varchar,
	"seat_row" varchar,
	"seat_number" varchar,
	"seat_location" geometry(Point, 4326),
	"is_active" boolean DEFAULT true,
	"created_at" timestamp,
	CONSTRAINT "tickets_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" varchar NOT NULL,
	"password_hash" varchar NOT NULL,
	"full_name" varchar,
	"mobility_mode" "mobility_mode" DEFAULT 'standard',
	"avoid_stairs" boolean DEFAULT false,
	"avoid_crowds" boolean DEFAULT false,
	"avoid_slopes" boolean DEFAULT false,
	"avoid_grandstands" boolean DEFAULT false,
	"has_ticket" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
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
ALTER TABLE "events" ADD CONSTRAINT "events_venue_id_venues_id_fk" FOREIGN KEY ("venue_id") REFERENCES "public"."venues"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_members" ADD CONSTRAINT "group_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_members" ADD CONSTRAINT "group_members_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "groups" ADD CONSTRAINT "groups_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nodes" ADD CONSTRAINT "nodes_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "path_segments" ADD CONSTRAINT "path_segments_venue_id_venues_id_fk" FOREIGN KEY ("venue_id") REFERENCES "public"."venues"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "path_segments" ADD CONSTRAINT "path_segments_source_node_id_nodes_id_fk" FOREIGN KEY ("source_node_id") REFERENCES "public"."nodes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "path_segments" ADD CONSTRAINT "path_segments_target_node_id_nodes_id_fk" FOREIGN KEY ("target_node_id") REFERENCES "public"."nodes"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "points_of_interest" ADD CONSTRAINT "points_of_interest_venue_id_venues_id_fk" FOREIGN KEY ("venue_id") REFERENCES "public"."venues"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "points_of_interest" ADD CONSTRAINT "points_of_interest_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_locations" ADD CONSTRAINT "saved_locations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "telemetry_logs" ADD CONSTRAINT "telemetry_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "telemetry_logs" ADD CONSTRAINT "telemetry_logs_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_venue_id_venues_id_fk" FOREIGN KEY ("venue_id") REFERENCES "public"."venues"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE no action ON UPDATE no action;