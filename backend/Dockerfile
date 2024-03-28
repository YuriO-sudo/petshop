FROM node:20 AS build
WORKDIR /app
COPY package*.json .
RUN npm ci --omit=dev

FROM node:20
ENV NODE_ENV production
USER node
WORKDIR /app
COPY --chown=node:node --from=build /app/node_modules ./node_modules
COPY --chown=node:node ./src ./src
EXPOSE 3000
CMD ["node", "src/server.js"]