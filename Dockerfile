FROM node:22-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG PUBLIC_URL=/
ARG REACT_APP_BASENAME=/

ENV PUBLIC_URL=${PUBLIC_URL}
ENV REACT_APP_BASENAME=${REACT_APP_BASENAME}
ENV CI=false

RUN npm run build

FROM nginx:1.27-alpine

RUN apk add --no-cache gettext

COPY nginx/default.conf.template /etc/nginx/templates/default.conf.template
COPY docker/entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

COPY --from=build /app/build /usr/share/nginx/html

ENV VOICE_API_BACKEND=http://host.docker.internal:8080

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
