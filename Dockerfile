# ─── Stage 1: Build ───────────────────────────────────────────────────────────
FROM oven/bun:1-alpine AS builder

WORKDIR /app

# Copy dependency files first (better layer caching)
COPY package.json bun.lock* ./

# Install all dependencies (including devDependencies for build)
RUN bun install --frozen-lockfile

# Copy source code + .env
COPY . .

# Build the Astro project (reads .env at build time if needed)
RUN bun run build

# ─── Stage 2: Production ──────────────────────────────────────────────────────
FROM oven/bun:1-alpine AS runner

WORKDIR /app

# Copy only production dependencies
COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile --production

# Copy the built output from the builder stage
COPY --from=builder /app/dist ./dist

# Copy public assets
COPY --from=builder /app/public ./public

# Copy .env so the container can read it at runtime
COPY --from=builder /app/.env ./.env

# Expose the port Astro standalone server listens on
EXPOSE 4321

ENV HOST=0.0.0.0
ENV PORT=4321

# Run the standalone server using Bun
CMD ["bun", "./dist/server/entry.mjs"]
