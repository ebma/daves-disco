FROM node:22-bookworm-slim AS build
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends python3 make g++ && rm -rf /var/lib/apt/lists/*
COPY package.json package-lock.json tsconfig.json ./
RUN npm ci
COPY src ./src
RUN npm run build && npm prune --omit=dev

FROM node:22-bookworm-slim
RUN apt-get update \
 && apt-get install -y --no-install-recommends ffmpeg python3 python3-venv git ca-certificates \
 && rm -rf /var/lib/apt/lists/* \
 && python3 -m venv /opt/venv \
 && /opt/venv/bin/pip install --no-cache-dir -U "yt-dlp[default]" bgutil-ytdlp-pot-provider \
 && git clone --depth 1 --branch 1.3.2 https://github.com/Brainicism/bgutil-ytdlp-pot-provider /opt/bgutil \
 && cd /opt/bgutil/server && npm ci && npx tsc && npm prune --omit=dev && npm cache clean --force
ENV PATH=/opt/venv/bin:$PATH \
    BGUTIL_HOME=/opt/bgutil/server
WORKDIR /app
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package.json ./
USER node
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s \
  CMD node -e "process.exit(Date.now()-require('fs').statSync('/tmp/alive').mtimeMs<90e3?0:1)"
CMD ["node", "dist/index.js"]
