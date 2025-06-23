# Use official Node.js image
FROM node:16

# Set working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm install

# Copy all other frontend files
COPY . .

# Expose port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
