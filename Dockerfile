# 阶段1：安装生产依赖（构建专用镜像）
FROM 124.221.133.110:5000/chen-node24-build:v1 AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --registry=https://registry.npmmirror.com

# 阶段2：生产镜像（最小化、安全、无构建工具）
FROM 124.221.133.110:5000/chen-node24-prod:v1 AS prod
WORKDIR /app

# 核心修改：移除手动创建用户的逻辑，直接复用镜像内置的node用户
# 仅创建必要目录，并将权限赋予内置的node用户
RUN mkdir -p /app/src/config/env && \
    # 给内置node用户赋予目录完整权限
    chown -R node:node /app && \
    # 权限加固：目录可执行、文件只读（符合最小权限原则）
    chmod -R 755 /app && \
    chmod -R 644 /app/src/config/* || true  # || true 避免目录不存在时报错

# 切换到镜像内置的非root node用户
USER node

# 复制依赖和构建产物（node用户已有权限访问）
COPY --from=deps /app/node_modules ./node_modules
COPY ./dist ./dist
COPY package.json ./

EXPOSE 30001

# 确保启动命令的稳定性
CMD ["node", "dist/main.js"]