#!/bin/bash

# 执行 git pull 命令
echo "🔄 正在执行 git pull..."
git pull

# 检查是否成功更新代码
if [ $? -ne 0 ]; then
    echo "❌ Git pull 失败！请检查代码更新。"
    exit 1
fi

# 执行 pm2 stop 命令
echo "⏹️ 正在停止 wechat-bot..."
pm2 stop wechat-bot

# 执行 pm2 start 命令
echo "▶️ 正在启动 wechat-bot..."
pm2 start index.js --name=wechat-bot

# 检查是否成功启动应用程序
if [ $? -ne 0 ]; then
    echo "❌ 启动 wechat-bot 失败！"
    exit 1
fi

echo "✅ wechat-bot 启动成功！"
