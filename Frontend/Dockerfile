# frontend/Dockerfile

FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the source code
COPY . .

# Build the Vite app (production build)
RUN npm run build

# Install a static file server
RUN npm install -g serve

# Expose port 4187 (inside container)
EXPOSE 4187

# Serve the built app on port 4187
CMD ["serve", "-s", "dist", "-l", "4187"]
