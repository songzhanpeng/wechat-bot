#!/bin/bash

# 查询 pnpm 的安装路径
PNPM_PATH=$(which pnpm)

# 判断 pnpm 是否已安装
if [ -z "$PNPM_PATH" ]; then
    echo -e "\e[1;34m📦 安装 pnpm...\e[0m"
    npm install -g pnpm
else
    echo -e "\e[1;32m✅ pnpm 已安装，路径为: $PNPM_PATH\e[0m"
fi

# 执行 git fetch 命令
echo -e "\e[1;34m🔄 正在更新远程代码库...\e[0m"
git fetch

# 检查更新是否成功
if [ $? -ne 0 ]; then
    echo -e "\e[1;31m❌ 更新失败！请检查远程代码库。\e[0m"
    exit 1
fi

# 检查是否需要更新
git status -uno | grep -q 'Your branch is behind' && NEED_UPDATE=true || NEED_UPDATE=false

if [ "$NEED_UPDATE" = true ]; then
    # 执行 git pull 命令
    echo -e "\e[1;34m🔄 本地分支落后于远程分支，正在自动更新...\e[0m"
    git pull

    # 检查更新是否成功
    if [ $? -ne 0 ]; then
        echo -e "\e[1;31m❌ 更新失败！请手动解决冲突。\e[0m"
        exit 1
    fi
else
    echo -e "\e[1;32m✅ 代码库已是最新，无需重新启动。\e[0m"
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
