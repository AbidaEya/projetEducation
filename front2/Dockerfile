# Multi-stage build for Education Frontend

# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /build

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application
RUN npm run build


# Stage 2: Runtime
FROM node:20-alpine

LABEL name="education-frontend" \
      version="1.0.0" \
      description="Education Platform Frontend Application"

# Install serve globally
RUN npm install -g serve

# Create non-root user for security (UID 1001 au lieu de 1000)
RUN adduser -D -u 1001 appuser

WORKDIR /app

# Copy build files from builder stage
COPY --from=builder /build/dist ./dist

# Change ownership to non-root user
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})" || exit 1

# Run the application
CMD ["serve", "-s", "dist", "-l", "3000"]