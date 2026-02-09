# 阶段1：安装生产依赖（构建专用镜像）
FROM 124.221.133.110:5000/chen-node24-build:v1 AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --registry=https://registry.npmmirror.com

# 阶段2：生产镜像（最小化、安全、无构建工具）
FROM 124.221.133.110:5000/chen-node24-prod:v1 AS prod
WORKDIR /app

RUN mkdir -p /app/src/config/env && \
    chown -R node:node /app && \
    chmod -R 750 /app && \
    chmod -R 640 /app/src/config/env

# 切换到非root用户
USER node

# 复制依赖和构建产物
COPY ./dist ./dist
COPY package.json ./
COPY ./src/config/env/.env ./src/config/env/.env
COPY ./src/config/env/.env.production ./src/config/env/.env.production

EXPOSE 30001

# 启动命令（确保语法正确）
CMD ["sh", "-c", "NODE_ENV=production node dist/main.js"]