FROM node:22-bookworm AS build
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    python3 \
    libnice-dev \
    libssl-dev \
    libsrtp2-dev \
    libwebrtc-audio-processing-dev \
    libnuma-dev \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build


FROM node:22-slim AS prod
RUN apt-get update && apt-get install -y --no-install-recommends \
    libnice10 \
    libssl3 \
    libsrtp2-1 \
    libwebrtc-audio-processing1 \
    libnuma1 \
    && rm -rf /var/lib/apt/lists/*
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/package.json ./package.json
USER node
CMD ["node", "./dist/index.js"]
