FROM node:16

# 设置淘宝的 npm 镜像
ENV NPM_CONFIG_REGISTRY=https://registry.npmmirror.com/

# 设置工作目录并复制文件
WORKDIR /app

# 拷贝工程代码到容器
COPY . .

# 安装 PM2
RUN npm install -g pm2

# 安装依赖
RUN npm install

# 使用 PM2 启动应用
CMD ["pm2", "start", "index.js"]
