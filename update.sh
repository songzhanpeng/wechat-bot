#!/bin/bash

# 检查是否安装了 pnpm，如果没有则安装
if ! /usr/local/bin/pnpm --version &> /dev/null; then
    echo -e "\e[1;34m📦 安装 pnpm...\e[0m"
    npm install -g pnpm
fi

# 执行 git fetch 命令
echo -e "\e[1;34m🔄 正在更新远程代码库...\e[0m"
git fetch

# 检查更新是否成功
if [ $? -ne 0 ]; then
    echo -e "\e[1;31m❌ 更新失败！请检查远程代码库。\e[0m"
    exit 1
fi

# 检查本地分支是否落后于远程分支
LOCAL=$(git rev-parse @)
REMOTE=$(git rev-parse @{u})
BASE=$(git merge-base @ @{u})

if [ $LOCAL = $REMOTE ]; then
    echo -e "\e[1;32m✅ 代码库已是最新，无需重新启动。\e[0m"
    exit 0
elif [ $LOCAL = $BASE ]; then
    echo -e "\e[1;34m🔄 本地分支落后于远程分支，需要更新。\e[0m"
else
    echo -e "\e[1;31m❌ 本地分支与远程分支存在分歧，请解决冲突后再操作。\e[0m"
    exit 1
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
