FROM registry.redhat.io/ubi9/nodejs-22:latest AS build

USER root
WORKDIR /opt/app-root/src

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

ARG PUBLIC_URL=/
ARG REACT_APP_BASENAME=/

ENV PUBLIC_URL=${PUBLIC_URL}
ENV REACT_APP_BASENAME=${REACT_APP_BASENAME}
ENV CI=false

RUN npm run build

FROM registry.redhat.io/ubi9/nginx-124:latest

USER root

COPY nginx/nginx-openshift.conf /etc/nginx/nginx.conf
COPY nginx/default.conf.template /opt/app-root/etc/nginx.default.conf.template
COPY docker/entrypoint.sh /docker-entrypoint.sh

RUN mkdir -p /var/lib/nginx/conf /var/lib/nginx/logs /var/lib/nginx/run && \
    chgrp -R 0 /var/lib/nginx /etc/nginx /opt/app-root /tmp && \
    chmod -R g+uwX /var/lib/nginx /etc/nginx /opt/app-root /tmp && \
    chmod +x /docker-entrypoint.sh

COPY --from=build /opt/app-root/src/build /opt/app-root/src

ENV VOICE_API_BACKEND=http://host.docker.internal:8080

EXPOSE 8080

USER 1001

ENTRYPOINT ["/docker-entrypoint.sh"]
