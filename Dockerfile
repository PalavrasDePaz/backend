# ---------- Build stage ----------
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Copy static email assets
RUN mkdir -p build/src/services/email-service/ && mkdir -p build/services/email-service/attachments && \
    cp src/services/email-service/*.html build/src/services/email-service/ && \
    cp src/services/email-service/attachments/ethicscode.pdf build/services/email-service/attachments/

# ---------- Runtime stage ----------
FROM node:20-alpine AS runtime
WORKDIR /app

ENV NODE_ENV=production
ENV NPM_CONFIG_IGNORE_SCRIPTS=true

COPY package*.json ./
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

# Copy compiled output
COPY --from=build /app/build ./build

EXPOSE 3002
ENTRYPOINT ["npm", "run"]
CMD ["start"]
