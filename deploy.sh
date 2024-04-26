#!/bin/bash

# 更新代码
update_code() {
    echo -e "\e[1;34m🔄 正在更新代码库...\e[0m"
    git pull
    if [ $? -ne 0 ]; then
        echo -e "\e[1;31m❌ 更新失败！请检查代码库。\e[0m"
        exit 1
    else
        echo -e "\e[1;32m✅ 代码更新成功。\e[0m"
    fi
}

# 停止并移除容器
stop_and_remove_container() {
    echo -e "\e[1;34m⏹️ 正在停止并移除容器...\e[0m"
    docker stop wechat-bot >/dev/null 2>&1
    docker rm wechat-bot >/dev/null 2>&1
}

# 删除旧镜像
remove_old_image() {
    echo -e "\e[1;34m🗑️ 正在删除旧镜像...\e[0m"
    docker rmi wechat-bot:v1 >/dev/null 2>&1
}

# 构建新镜像
build_image() {
    echo -e "\e[1;34m🛠️ 正在构建新镜像...\e[0m"
    docker build -t wechat-bot:v1 .
    if [ $? -ne 0 ]; then
        echo -e "\e[1;31m❌ 镜像构建失败！请检查。\e[0m"
        exit 1
    else
        echo -e "\e[1;32m✅ 镜像构建成功。\e[0m"
    fi
}

# 启动容器
start_container() {
    echo -e "\e[1;34m▶️ 正在启动容器...\e[0m"
    # docker run -itd --name="wechat-bot" --restart=always wechat-bot:v1
    docker run -itd --name="wechat-bot" -v ./memory:/app/memory --restart=always wechat-bot:v1
    if [ $? -ne 0 ]; then
        echo -e "\e[1;31m❌ 容器启动失败！请检查。\e[0m"
        exit 1
    else
        echo -e "\e[1;32m✅ 容器启动成功。\e[0m"
    fi
}

# 执行函数
update_code
stop_and_remove_container
remove_old_image
build_image
start_container

echo -e "\e[1;32m✅ wechat-bot 成功启动！\e[0m"
