# 使用更小的基础镜像
FROM node:alpine as builder

# 设置淘宝的 npm 镜像
ENV NPM_CONFIG_REGISTRY=https://registry.npmmirror.com/

# 设置工作目录并复制文件
WORKDIR /app

# 拷贝工程代码到容器
COPY . .

# 安装 pnpm
RUN npm install -g pnpm

# 安装依赖并构建应用
RUN pnpm install --prod

# 使用轻量级的Node镜像作为最终镜像
FROM node:alpine

# 设置工作目录
WORKDIR /app

# 从builder阶段复制构建好的应用
COPY --from=builder /app .

# 使用 PM2 启动应用
CMD ["npm", "run", "dev"]
