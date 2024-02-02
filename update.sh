#!/bin/bash

# 执行 git pull 命令
echo -e "\e[1;34m🔄 Executing \e[1;33mgit pull\e[0m..."
git pull

# 检查是否成功更新代码
if [ $? -ne 0 ]; then
    echo -e "\e[1;31m❌ Git pull failed! Please check for code updates.\e[0m"
    exit 1
fi

# 执行 npm install 命令
echo -e "\e[1;34m📦 Installing dependencies with \e[1;33mnpm install\e[0m..."
npm install

# 执行 pm2 stop 命令
echo -e "\e[1;34m⏹️ Stopping \e[1;33mwechat-bot\e[0m..."
pm2 stop wechat-bot

# 执行 pm2 start 命令
echo -e "\e[1;34m▶️ Starting \e[1;33mwechat-bot\e[0m..."
pm2 start index.js --name=wechat-bot

# 检查是否成功启动应用程序
if [ $? -ne 0 ]; then
    echo -e "\e[1;31m❌ Failed to start \e[1;33mwechat-bot\e[0m.\e[0m"
    exit 1
fi

echo -e "\e[1;32m✅ \e[1;33mwechat-bot\e[1;32m started successfully!\e[0m"
