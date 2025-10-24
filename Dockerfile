# Multi-stage build for Frontend and Backend

# Stage 1: Build Frontend
FROM node:18-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package*.json ./

# Install frontend dependencies
RUN npm install

# Copy frontend source
COPY frontend/ ./

# Build frontend
RUN npm run build

# Stage 2: Setup Backend
FROM node:18-alpine AS backend-builder

WORKDIR /app/backend

# Copy backend package files
COPY backend/package*.json ./

# Install backend dependencies
RUN npm install --production

# Copy backend source
COPY backend/ ./

# Stage 3: Production Image
FROM node:18-alpine

WORKDIR /app

# Install serve to host frontend
RUN npm install -g serve

# Copy backend from builder
COPY --from=backend-builder /app/backend ./backend

# Copy built frontend from builder
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Create logs directory for backend
RUN mkdir -p /app/backend/logs

# Expose ports (3000 for frontend, 5000 for backend)
EXPOSE 3000 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s \
  CMD node -e "require('http').get('http://localhost:5000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Create start script to run both frontend and backend
RUN echo '#!/bin/sh' > /app/start.sh && \
    echo 'serve -s /app/frontend/dist -l 3000 &' >> /app/start.sh && \
    echo 'cd /app/backend && node server.js &' >> /app/start.sh && \
    echo 'wait -n' >> /app/start.sh && \
    echo 'exit $?' >> /app/start.sh && \
    chmod +x /app/start.sh

CMD ["/app/start.sh"]