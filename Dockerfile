# Build stage
FROM node:21-alpine3.19 AS build

WORKDIR /app
COPY package.*json .
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM node:21-alpine3.19 AS production

WORKDIR /app
COPY package*.json .
COPY scripts/ /scripts
RUN apk update && apk add bash && npm ci --only=production && chmod -R +x /scripts
COPY --from=build /app/dist ./dist
COPY --from=build /app/config ./dist/config
COPY --from=build /app/migrations ./dist/migrations
COPY --from=build /app/models ./dist/models
COPY --from=build /app/seeders ./dist/seeders

EXPOSE 5000

ENV PATH="/scripts:usr/local/bin:$PATH"
ENTRYPOINT ["auto.sh"]