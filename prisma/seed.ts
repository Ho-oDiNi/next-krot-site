/*
  Run:
    1) Ensure DATABASE_URL is set
    2) npx prisma migrate dev --name init
    3) Add to package.json: { "prisma": { "seed": "tsx prisma/seed.ts" } }
    4) npx prisma db seed
*/
