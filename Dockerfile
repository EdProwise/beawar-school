# ─── Stage 1: Build frontend ─────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@8.6.12

# Copy dependency files
COPY package.json pnpm-lock.yaml ./

# Install all dependencies (including devDependencies for build)
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# Build frontend (production)
RUN pnpm run build:prod

# ─── Stage 2: Production image ───────────────────────────────────────────────
FROM node:20-alpine AS production

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm@8.6.12

# Copy dependency files
COPY package.json pnpm-lock.yaml ./

# Install production dependencies only
RUN pnpm install --frozen-lockfile --prod

# Copy built frontend from builder stage
COPY --from=builder /app/dist ./dist

# Copy server source
COPY server ./server
COPY tsconfig.json ./
COPY tsconfig.node.json ./

# Install tsx for running TypeScript server
RUN pnpm add -D tsx

# Create uploads directory
RUN mkdir -p uploads

# Expose application port
EXPOSE 5000

# Set NODE_ENV
ENV NODE_ENV=production

# Start the Express server (serves built frontend + API)
CMD ["npx", "tsx", "server/index.ts"]
