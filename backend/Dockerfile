# Node.js base image
FROM node:18-alpine

# Working directory set chestundi container lo
WORKDIR /app

# Dependencies install chestundi
COPY package*.json ./
RUN npm install

# Source code copy chestundi
COPY . .

# Port expose chestundi
EXPOSE 5000

# Server start chestundi
CMD ["node", "src/server.js"]
