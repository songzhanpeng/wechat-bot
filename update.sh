#!/bin/bash

# 执行 git pull 命令
echo "执行 git pull"
git pull

# 执行 pm2 stop 命令
echo "执行 pm2 stop wechat-bot"
pm2 stop wechat-bot

# 执行 pm2 start 命令
echo "执行 pm2 start index.js --name=wechat-bot"
pm2 start index.js --name=wechat-bot
