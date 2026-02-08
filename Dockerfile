# 阶段1：安装生产依赖（构建专用镜像）
FROM 124.221.133.110:5000/chen-node24-build:v1 AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --registry=https://registry.npmmirror.com

# 阶段2：生产镜像（最小化、安全、无构建工具）
FROM 124.221.133.110:5000/chen-node24-prod:v1 AS prod
WORKDIR /app

RUN mkdir -p /app/src/config/env

COPY --from=deps /app/node_modules ./node_modules
COPY ./dist ./dist
COPY package.json ./

EXPOSE 30001

CMD ["node", "dist/main.js"]