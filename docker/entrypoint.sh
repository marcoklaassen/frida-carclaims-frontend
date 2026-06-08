#!/bin/bash
set -euo pipefail

: "${VOICE_API_BACKEND:=http://host.docker.internal:8080}"

VOICE_API_BACKEND_HOST="${VOICE_API_BACKEND#*://}"
VOICE_API_BACKEND_HOST="${VOICE_API_BACKEND_HOST%%/*}"

mkdir -p /var/lib/nginx/conf /var/lib/nginx/logs /var/lib/nginx/run

sed -e "s|\${VOICE_API_BACKEND}|${VOICE_API_BACKEND}|g" \
    -e "s|\${VOICE_API_BACKEND_HOST}|${VOICE_API_BACKEND_HOST}|g" \
  /opt/app-root/etc/nginx.default.conf.template \
  > /var/lib/nginx/conf/default.conf

exec nginx -g 'daemon off;' -c /etc/nginx/nginx.conf
