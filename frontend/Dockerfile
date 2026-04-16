# Node.js base image
FROM node:18-alpine

WORKDIR /app

# Dependencies install
COPY package*.json ./
RUN npm install

# Source code copy
COPY . .

# Vite dev server port
EXPOSE 5173

# Dev server start — host 0.0.0.0 important (Docker networking కోసం)
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
