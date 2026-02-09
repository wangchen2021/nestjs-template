# 阶段1：安装生产依赖（构建专用镜像）
FROM 124.221.133.110:5000/chen-node24-build:v1 AS deps
WORKDIR /app

# 复制依赖清单
COPY package.json pnpm-lock.yaml ./
# 安装生产依赖（--prod 只装生产依赖，符合最小化原则）
RUN pnpm install --prod --registry=https://registry.npmmirror.com

# 【可选】如果宿主机未提前构建dist，需添加构建步骤
# COPY tsconfig.json nest-cli.json ./
# COPY src ./src
# RUN pnpm run build

# 阶段2：生产镜像（最小化、安全、无构建工具）
FROM 124.221.133.110:5000/chen-node24-prod:v1 AS prod
WORKDIR /app

# 提前声明环境变量（符合Docker最佳实践）
ENV NODE_ENV=production 

# 创建目录并配置权限（修复目录执行权限问题）
RUN mkdir -p /app/src/config/env && \
    chown -R node:node /app && \
    chmod -R 750 /app && \
    chmod -R 750 /app/src/config/env  # 目录需要x权限，文件后续挂载时自动继承

# 切换到非root用户（安全最佳实践）
USER node

COPY --from=deps /app/node_modules ./node_modules
COPY ./dist ./dist
COPY package.json ./

EXPOSE 30001

# 简化启动命令（ENV已声明NODE_ENV，无需重复）
CMD ["node", "dist/main.js"]