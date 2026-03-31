#!/bin/sh
cat > /usr/share/nginx/html/config.js <<EOF
window.__RUNTIME_CONFIG__ = {
  SERVER_URL: "${SERVER_URL:-http://localhost:8081}"
};
EOF

exec "$@"