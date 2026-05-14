ALTER TABLE "group_members" DROP CONSTRAINT IF EXISTS "group_members_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "group_members" DROP CONSTRAINT IF EXISTS "group_members_group_id_groups_id_fk";
--> statement-breakpoint
ALTER TABLE "groups" DROP CONSTRAINT IF EXISTS "groups_created_by_users_id_fk";
--> statement-breakpoint
ALTER TABLE "nodes" DROP CONSTRAINT IF EXISTS "nodes_event_id_events_id_fk";
--> statement-breakpoint
ALTER TABLE "passkey_credentials" DROP CONSTRAINT IF EXISTS "passkey_credentials_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "path_segments" DROP CONSTRAINT IF EXISTS "path_segments_event_id_events_id_fk";
--> statement-breakpoint
ALTER TABLE "path_segments" DROP CONSTRAINT IF EXISTS "path_segments_source_node_id_nodes_id_fk";
--> statement-breakpoint
ALTER TABLE "path_segments" DROP CONSTRAINT IF EXISTS "path_segments_target_node_id_nodes_id_fk";
--> statement-breakpoint
ALTER TABLE "points_of_interest" DROP CONSTRAINT IF EXISTS "points_of_interest_event_id_events_id_fk";
--> statement-breakpoint
ALTER TABLE "saved_locations" DROP CONSTRAINT IF EXISTS "saved_locations_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "telemetry_logs" DROP CONSTRAINT IF EXISTS "telemetry_logs_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "telemetry_logs" DROP CONSTRAINT IF EXISTS "telemetry_logs_event_id_events_id_fk";
--> statement-breakpoint
ALTER TABLE "tickets" DROP CONSTRAINT IF EXISTS "tickets_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "tickets" DROP CONSTRAINT IF EXISTS "tickets_event_id_events_id_fk";
--> statement-breakpoint
ALTER TABLE "group_members" ADD CONSTRAINT "group_members_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "group_members" ADD CONSTRAINT "group_members_group_id_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."groups"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "groups" ADD CONSTRAINT "groups_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nodes" ADD CONSTRAINT "nodes_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "passkey_credentials" ADD CONSTRAINT "passkey_credentials_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "path_segments" ADD CONSTRAINT "path_segments_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "path_segments" ADD CONSTRAINT "path_segments_source_node_id_nodes_id_fk" FOREIGN KEY ("source_node_id") REFERENCES "public"."nodes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "path_segments" ADD CONSTRAINT "path_segments_target_node_id_nodes_id_fk" FOREIGN KEY ("target_node_id") REFERENCES "public"."nodes"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "points_of_interest" ADD CONSTRAINT "points_of_interest_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_locations" ADD CONSTRAINT "saved_locations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "telemetry_logs" ADD CONSTRAINT "telemetry_logs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "telemetry_logs" ADD CONSTRAINT "telemetry_logs_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "tickets" ADD CONSTRAINT "tickets_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;