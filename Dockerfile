# 阶段1：安装生产依赖（构建专用镜像）
FROM 124.221.133.110:5000/chen-node24-build:v1 AS deps
WORKDIR /app

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --prod --registry=https://registry.npmmirror.com

# 阶段2：生产镜像（最小化、安全、无构建工具）
FROM 124.221.133.110:5000/chen-node24-prod:v1 AS prod
WORKDIR /app

# Alpine系统使用addgroup/adduser创建非root用户
# 注意：需要先以root用户执行（默认就是root），创建后再切换
RUN if [ -f /etc/alpine-release ]; then \
        # Alpine系统：创建系统用户（-S）、无密码（-D）、指定UID/GID
        addgroup -S nodeUser -g 1000 && \
        adduser -S -D -H -G nodeUser -u 1000 nodeUser; \
    else \
        # 非Alpine系统（如Debian/Ubuntu）：兼容原有命令
        groupadd -r nodeUser -g 1000 && \
        useradd -r -g nodeUser -u 1000 nodeUser; \
    fi

# 创建必要的目录并设置权限（确保非root用户可读写）
RUN mkdir -p /app/src/config/env && \
    chown -R nodeUser:nodeUser /app && \
    chmod -R 755 /app

# 切换到非root用户
USER nodeUser

# 复制依赖和构建产物
COPY --from=deps /app/node_modules ./node_modules
COPY ./dist ./dist
COPY package.json ./

EXPOSE 30001

# 确保启动命令的稳定性
CMD ["node", "dist/main.js"]