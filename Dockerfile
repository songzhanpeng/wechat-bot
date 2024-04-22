FROM node:16

# 设置淘宝的 npm 镜像
ENV NPM_CONFIG_REGISTRY=https://registry.npmmirror.com/

# 设置工作目录并复制文件
WORKDIR /app

# 拷贝工程代码到容器
COPY . .

# # 安装 PM2
# RUN npm install -g pm2

# 安装依赖
RUN npm install

# 设置环境变量指向外部配置文件路径
ENV WECHATY_CONFIG_FILE=/app/wechat-bot.memory-card.json

# 使用 PM2 启动应用
CMD ["node", "index.js"]
