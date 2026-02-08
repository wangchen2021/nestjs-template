# 阶段1：安装生产依赖（用构建专用镜像，带pnpm）
FROM 124.221.133.110:5000/chen-node24-build:v1 AS deps
WORKDIR /app

# 仅复制依赖配置文件
COPY package.json pnpm-lock.yaml ./

# 用pnpm安装生产依赖（构建镜像已预装pnpm）
RUN pnpm install --prod --registry=https://registry.npmmirror.com

# 阶段2：生产镜像（用生产专用镜像，无pnpm）
FROM 124.221.133.110:5000/chen-node24-prod:v1 AS prod
WORKDIR /app

# 复制生产依赖（从deps阶段）
COPY --from=deps /app/node_modules ./node_modules

# 复制本地预编译的dist目录（核心！企业级方案）
COPY ./dist ./dist

# 复制package.json（用于启动命令）
COPY package.json ./

# 复制生产环境配置文件
COPY src/config/env/.env.production ./src/config/env/

# 暴露端口
EXPOSE 30001

# 启动项目（仅Node运行时，无任何冗余）
CMD ["node", "dist/main.js"]