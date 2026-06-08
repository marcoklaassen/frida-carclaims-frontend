#!/bin/bash
set -euo pipefail

: "${VOICE_API_BACKEND:=http://host.docker.internal:8080}"

mkdir -p /var/lib/nginx/conf /var/lib/nginx/logs /var/lib/nginx/run

sed "s|\${VOICE_API_BACKEND}|${VOICE_API_BACKEND}|g" \
  /opt/app-root/etc/nginx.default.conf.template \
  > /var/lib/nginx/conf/default.conf

exec nginx -g 'daemon off;' -c /etc/nginx/nginx.conf
