# Use lightweight node image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy files
COPY package*.json ./
RUN npm install --only=production

COPY . .

# Expose app port
EXPOSE 8080

# Run app
CMD ["npm", "start"]
