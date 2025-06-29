FROM --platform=linux/x86_64 node:18 AS builder

WORKDIR /app

# Copy package.json only (not package-lock.json)
COPY package.json ./

# Fresh install without lock file
RUN npm install

# Copy source code
COPY . .

# Build
RUN npm run build

# Production
FROM --platform=linux/x86_64 nginx:stable

COPY --from=builder /app/dist /usr/share/nginx/html

RUN echo 'events { worker_connections 1024; } \
http { \
    include /etc/nginx/mime.types; \
    default_type application/octet-stream; \
    server { \
        listen 80; \
        root /usr/share/nginx/html; \
        index index.html; \
        location / { \
            try_files $uri $uri/ /index.html; \
        } \
    } \
}' > /etc/nginx/nginx.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]