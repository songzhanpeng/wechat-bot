#!/bin/bash

# 执行 git pull 命令
echo -e "\e[1;34m🔄 正在执行 \e[1;33mgit pull\e[0m..."
git pull

# 检查是否成功更新代码
if [ $? -ne 0 ]; then
    echo -e "\e[1;31m❌ Git pull 失败！请检查代码更新。\e[0m"
    exit 1
fi

# 执行 pm2 stop 命令
echo -e "\e[1;34m⏹️ 正在停止 \e[1;33mwechat-bot\e[0m..."
pm2 stop wechat-bot

# 执行 pm2 start 命令
echo -e "\e[1;34m▶️ 正在启动 \e[1;33mwechat-bot\e[0m..."
pm2 start index.js --name=wechat-bot

# 检查是否成功启动应用程序
if [ $? -ne 0 ]; then
    echo -e "\e[1;31m❌ 启动 \e[1;33mwechat-bot\e[0m 失败！\e[0m"
    exit 1
fi

echo -e "\e[1;32m✅ \e[1;33mwechat-bot\e[1;32m 启动成功！\e[0m"
