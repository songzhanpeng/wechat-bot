# WeChat Bot

![](https://assets.fedtop.com/picbed/202212071317377.png)

一个 基于 `讯飞星火` + `wechaty` 的微信机器人

可以用来帮助你自动回复微信消息，或者管理微信群/好友.

`简单`，`好用`，`2分钟（4 个步骤）` 就能玩起来了。🌸 如果对您有所帮助，请点个 Star ⭐️ 支持一下。

## 近期的改动

### 2024.01.17 更新

xxx

## 开发

1. 检查好自己的开发环境，确保已经安装了 `nodejs` , 版本需要满足 Node.js >= v18.0 ，版本太低会导致运行报错,最好使用 LTS 版本。
2. 先获取自己的 `api key`，地址戳这里 👉🏻 ：[创建你的 api key](https://console.xfyun.cn/services/bm35)

3. 创建完了， 复制下来，然后在项目根目录 `config` 下创建一个 `config.yaml` 文件，内容如下：

```sh
# 执行下面命令，拷贝一份 .env.example 文件
cp config/config.example.yaml config/config.yaml
# 完善 config.yaml 文件内容
```

4. 运行服务

```sh
# 安装依赖
npm i
# 启动服务
npm run dev
```

然后就可以扫码登录了，然后根据你的需求，自己修改相关逻辑文件。

![](https://assets.fedtop.com/picbed/202212071315670.png)

## 你要修改的

很多人说运行后不会自动收发信息，不是的哈，为了防止给每一条收到的消息都自动回复（太恐怖了），所以加了限制条件。

你要把下面提到的地方自定义修改下。

- 群聊，记得把机器人名称改成你自己微信号的名称，然后添加对应群聊的名称到白名单中，这样就可以自动回复群聊消息了。
- 私聊，记得把需要自动回复的好友名称添加到白名单中，这样就可以自动回复私聊消息了。

文件是 👉🏻 [sendMessage.js](./src/wechaty/sendMessage.js)
