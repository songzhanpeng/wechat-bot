#!/bin/bash

# 更新代码
update_code() {
    echo -e "\e[1;34m🔄 正在更新代码库...\e[0m"
    git pull
    if [ $? -ne 0 ]; then
        echo -e "\e[1;31m❌ 更新失败！请检查代码库。\e[0m"
        exit 1
    fi
}

# 停止并移除容器
stop_and_remove_container() {
    docker stop wechat-bot
    docker rm wechat-bot
}

# 删除旧镜像
remove_old_image() {
    docker rmi wechat-bot:v1
}

# 构建新镜像
build_image() {
    echo -e "\e[1;34m🛠️ 正在构建镜像...\e[0m"
    docker build -t wechat-bot:v1 .
}

# 启动容器
start_container() {
    echo -e "\e[1;34m▶️ 正在启动容器...\e[0m"
    docker run -itd --name="wechat-bot" --restart=always wechat-bot:v1
}

# 执行函数
update_code
stop_and_remove_container
remove_old_image
build_image
start_container

echo -e "\e[1;32m✅ wechat-bot 成功启动！\e[0m"
