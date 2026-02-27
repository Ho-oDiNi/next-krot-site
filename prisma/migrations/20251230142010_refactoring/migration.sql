/*
  Warnings:
  - Dropping tables will delete data if they are not empty.
*/

BEGIN;

-- 0) Drop FKs safely (tables may not exist in shadow)
ALTER TABLE IF EXISTS "public"."AdvantageCommitment"
  DROP CONSTRAINT IF EXISTS "AdvantageCommitment_advantageId_fkey";

ALTER TABLE IF EXISTS "public"."Service"
  DROP CONSTRAINT IF EXISTS "Service_categoryId_fkey";

-- 1) Create Category first (we will migrate ids from ServiceCategory)
CREATE TABLE IF NOT EXISTS "public"."Category" (
  "id" SERIAL NOT NULL,
  "slug" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "position" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "Category_slug_key" ON "public"."Category"("slug");

-- 2) Copy data from ServiceCategory -> Category ONLY IF ServiceCategory exists
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'ServiceCategory'
  ) THEN
    INSERT INTO "public"."Category" ("id","slug","name","description","position","createdAt","updatedAt")
    SELECT "id","slug","name","description","position","createdAt","updatedAt"
    FROM "public"."ServiceCategory"
    ON CONFLICT ("id") DO NOTHING;
  END IF;
END $$;

-- 3) Sync sequence with max(id)
SELECT setval(
  pg_get_serial_sequence('"public"."Category"', 'id'),
  (SELECT GREATEST(COALESCE(MAX("id"), 1), 1) FROM "public"."Category")
);

-- 4) Re-add FK Service -> Category (only if Service exists)
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'Service'
  ) THEN
    ALTER TABLE "public"."Service"
      ADD CONSTRAINT "Service_categoryId_fkey"
      FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;

-- 5) Now drop old tables/types (safe)
DROP TABLE IF EXISTS "public"."Review";
DROP TABLE IF EXISTS "public"."NavigationLink";
DROP TABLE IF EXISTS "public"."GeographyItem";
DROP TABLE IF EXISTS "public"."AdvantageCommitment";
DROP TABLE IF EXISTS "public"."Advantage";
DROP TABLE IF EXISTS "public"."ServiceCategory";

DROP TYPE IF EXISTS "public"."NavigationLocation";

COMMIT;
