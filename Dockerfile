# Use official Node runtime
FROM node:18

# Set working directory inside container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Build Vite production files
RUN npm run build

# Expose port (Cloud Run expects 8080)
EXPOSE 8080

# Start the app serving the dist folder
CMD ["npx", "serve", "-s", "dist", "-l", "$PORT"]
