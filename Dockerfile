# Use official Node.js image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Bundle app source
COPY . .

# Build arguments
ARG MONGODB_URI
ENV MONGODB_URI=$MONGODB_URI

# Expose the API port
EXPOSE 3000

# Seed database and start server
CMD ["sh", "-c", "node seed.js && node app.js"]