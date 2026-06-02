# syntax=docker/dockerfile:1.7

FROM node:25-slim AS base

ENV NEXT_TELEMETRY_DISABLED=1
ENV PNPM_HOME=/usr/local/share/pnpm
ENV PATH=${PNPM_HOME}:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin

RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl \
    && rm -rf /var/lib/apt/lists/*

# RUN npm i -g pnpm@latest
RUN rm -f /usr/local/bin/yarn /usr/local/bin/yarnpkg \
 && npm i -g corepack \
 && corepack enable \
 && corepack prepare pnpm@10.6.5 --activate

WORKDIR /app

FROM base AS deps

COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./

RUN pnpm install --frozen-lockfile --ignore-scripts

COPY . .

FROM deps AS builder

# Переменные для отсутствия подключения к внутренней сети во время сборки 
ENV NEXT_DISABLE_FONT_DOWNLOADS=1
ENV DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder?schema=public"
ENV BUILD_TIME=1

RUN pnpm prisma generate

RUN pnpm build

FROM base AS runner

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

COPY --from=builder --chmod=0755 /app/docker/entrypoint.sh /app/docker/entrypoint.sh
RUN sed -i 's/\r$//' /app/docker/entrypoint.sh

EXPOSE 3000

CMD ["node", "server.js"]