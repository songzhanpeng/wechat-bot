#!/bin/bash

# 检查是否安装了 pnpm，如果没有则安装
if ! command -v pnpm &> /dev/null; then
    echo -e "\e[1;34m📦 安装 pnpm...\e[0m"
    npm install -g pnpm
fi

# 执行 git pull 命令
echo -e "\e[1;34m🔄 正在更新代码库...\e[0m"
git pull

# 检查更新是否成功
if [ $? -ne 0 ]; then
    echo -e "\e[1;31m❌ 更新失败！请检查代码库。\e[0m"
    exit 1
fi

# 检查是否有代码更新
git diff --quiet --exit-code
if [ $? -eq 0 ]; then
    echo -e "\e[1;32m✅ 代码库已是最新，无需重新启动。\e[0m"
    exit 0
fi

# 执行 pnpm install 命令
echo -e "\e[1;34m📦 正在安装依赖项...\e[0m"
pnpm install

# 执行 pm2 命令
echo -e "\e[1;34m⏹️ 正在停止 wechat-bot...\e[0m"
pm2 stop wechat-bot

# 执行 pm2 命令
echo -e "\e[1;34m▶️ 正在启动 wechat-bot...\e[0m"
pm2 start index.js --name=wechat-bot

# 检查启动是否成功
if [ $? -ne 0 ]; then
    echo -e "\e[1;31m❌ 启动失败！\e[0m"
    exit 1
fi

echo -e "\e[1;32m✅ wechat-bot 成功启动！\e[0m"
