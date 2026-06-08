#!/bin/sh
set -eu

: "${VOICE_API_BACKEND:=http://host.docker.internal:8080}"

envsubst '${VOICE_API_BACKEND}' \
  < /etc/nginx/templates/default.conf.template \
  > /etc/nginx/conf.d/default.conf

exec nginx -g 'daemon off;'
