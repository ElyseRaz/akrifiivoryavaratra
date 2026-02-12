# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copier package files
COPY package*.json ./
COPY tsconfig.json ./

# Installer les dépendances
RUN npm ci

# Copier le code source
COPY . .

# Compiler TypeScript
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Installer seulement les dépendances de production
RUN npm install -g ts-node

COPY package*.json ./

# Installer les dépendances de production
RUN npm ci --only=production

# Copier le code compilé depuis le stage de build
COPY --from=builder /app/dist ./dist

# Copier les uploads
COPY uploads ./uploads

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 3000), (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"

# Start
EXPOSE 3000
CMD ["npm", "start"]
