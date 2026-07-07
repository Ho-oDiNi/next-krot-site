ALTER TABLE "Article" ADD COLUMN "publishedAt" TIMESTAMP(3);

UPDATE "Article"
SET "publishedAt" = "updatedAt"
WHERE "isPublished" = true AND "publishedAt" IS NULL;
