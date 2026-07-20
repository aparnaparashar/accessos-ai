# --- Stage 1: Build the Angular app ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts
COPY . .
RUN npx ng build --configuration production

# --- Stage 2: Serve with nginx ---
FROM nginx:alpine AS runner

# Remove default nginx content
RUN rm -rf /usr/share/nginx/html/*

# Copy the compiled Angular app
COPY --from=builder /app/dist/accessos-ai-frontend/browser /usr/share/nginx/html

# Copy custom nginx config with SPA fallback + reverse proxy
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
