ALTER TABLE "events" ADD COLUMN "is_permanent" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "events" ADD COLUMN "primary_color" varchar(7) DEFAULT '#ff382e';