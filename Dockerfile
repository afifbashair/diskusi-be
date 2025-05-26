
# Use official Node.js runtime as parent image
FROM node:18

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./
RUN npm install

# Bundle app source
COPY . .

# Build prisma client
RUN npx prisma generate

# Expose port
EXPOSE 8080

# Start the server
CMD [ "node", "src/server.js" ]
