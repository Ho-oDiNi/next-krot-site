#!/bin/sh
set -eu

echo "[init] runtime migrations (optional)…"

if [ -n "${DATABASE_URL:-}" ]; then
  if [ -f "./node_modules/@prisma/client/package.json" ]; then
    PRISMA_VER=$(node -p "require('./node_modules/@prisma/client/package.json').version" || echo "")
    if [ -n "$PRISMA_VER" ]; then
      echo "[init] pnpm dlx prisma@${PRISMA_VER} migrate deploy"
      pnpm dlx "prisma@${PRISMA_VER}" migrate deploy
    else
      echo "[init] WARN: cannot detect @prisma/client version; skip migrate"
    fi
  else
    echo "[init] WARN: @prisma/client not present in runtime; skip migrate"
  fi
else
  echo "[init] WARN: DATABASE_URL is empty; skip migrate"
fi

echo "[init] starting app: $*"
exec "$@"