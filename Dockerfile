# Use Node.js 18 Alpine as base image
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies using npm install (not npm ci to avoid lock file sync issues)
RUN npm install

# Copy all source files
COPY . .

# Build the React application
RUN npm run build

# Production stage - use nginx to serve the built app
FROM nginx:alpine AS production

# Copy the built app from the build stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config if it exists
COPY nginx.conf /etc/nginx/nginx.conf 2>/dev/null || true

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]