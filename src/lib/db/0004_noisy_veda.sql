ALTER TABLE "posts" ALTER COLUMN "description" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "posts" ALTER COLUMN "feed_id" SET NOT NULL;