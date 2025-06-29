# Use x86_64 Node image
FROM --platform=linux/x86_64 node:18 AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Clear npm cache and install with clean slate
RUN npm cache clean --force

# Install dependencies with explicit architecture
RUN npm install --platform=linux --arch=x64

# Force rebuild all native dependencies for the correct platform
RUN npm rebuild

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Production stage
FROM --platform=linux/x86_64 nginx:stable

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Create nginx config
COPY <<EOF /etc/nginx/nginx.conf
events { 
    worker_connections 1024; 
}
http {
    include /etc/nginx/mime.types;
    default_type application/octet-stream;
    
    server {
        listen 80;
        server_name localhost;
        root /usr/share/nginx/html;
        index index.html;
        
        location / {
            try_files \$uri \$uri/ /index.html;
        }
        
        # Cache static assets
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }
}
EOF

# Expose port 80
EXPOSE 80

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost/ || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]