# Base image for Node.js
FROM node:16

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Build the React application
RUN npm run build

# Expose the port used by the React development server
EXPOSE 3000:3000

# Start the React development server
CMD ["npm", "start"]
