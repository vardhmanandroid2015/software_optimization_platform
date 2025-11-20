FROM node:22-alpine AS build

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock, etc.)
# This allows us to leverage Docker layer caching. The install step only re-runs if these files change.
COPY package.json ./
# If you have a package-lock.json, copy it too for deterministic builds
COPY package-lock.json ./

# Install dependencies exactly as specified in your lock file
RUN npm install

# Copy the rest of the app's source code
COPY . .

# Build the application for production. This runs the "build" script from your package.json
# The output will be in the /app/dist directory by default for Vite.
RUN npm run build

### STAGE 2: Serve ###
# Use a lightweight Nginx image to serve the static files
FROM nginx:1.25-alpine

# Copy the build output from the build stage to the Nginx public directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy our custom Nginx configuration to configure the reverse proxy
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 for incoming traffic to the Nginx server
EXPOSE 80

# Start Nginx in the foreground when the container launches
CMD ["nginx", "-g", "daemon off;"]