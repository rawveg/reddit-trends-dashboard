# Force x86_64 platform to avoid ARM64 issues on M1/M2 Macs
FROM --platform=linux/x86_64 node:18 AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Explicitly install the correct Rollup binary for x86_64
RUN npm install @rollup/rollup-linux-x64-gnu --save-optional

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage - also force x86_64
FROM --platform=linux/x86_64 nginx:stable

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Create a basic nginx configuration
RUN echo 'events { worker_connections 1024; } \
http { \
    include /etc/nginx/mime.types; \
    default_type application/octet-stream; \
    server { \
        listen 80; \
        server_name localhost; \
        root /usr/share/nginx/html; \
        index index.html; \
        location / { \
            try_files $uri $uri/ /index.html; \
        } \
    } \
}' > /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]