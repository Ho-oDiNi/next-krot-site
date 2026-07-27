#!/bin/sh
set -eu

[ -x node_modules/.bin/prisma ] && node_modules/.bin/prisma migrate deploy

exec "$@"