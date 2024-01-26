FROM node:19

# 设置淘宝的 npm 镜像
ENV NPM_CONFIG_REGISTRY=https://registry.npm.taobao.org

# 设置工作目录并复制文件
WORKDIR /app
COPY package.json ./
COPY *.js ./
COPY src/ ./src/

# 安装依赖并启动应用
RUN npm install
CMD ["npm", "start"]
