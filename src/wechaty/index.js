import { WechatyBuilder, ScanStatus, log } from 'wechaty'
import qrTerminal from 'qrcode-terminal'
import { defaultMessage, shardingMessage } from './sendMessage.js'
import { MessageSender } from './messageHandler.js'
// 扫码
function onScan(qrcode, status) {
  if (status === ScanStatus.Waiting || status === ScanStatus.Timeout) {
    // 在控制台显示二维码
    qrTerminal.generate(qrcode, { small: true })
    const qrcodeImageUrl = ['https://api.qrserver.com/v1/create-qr-code/?data=', encodeURIComponent(qrcode)].join('')
    console.log('Scan:', qrcodeImageUrl, ScanStatus[status], status)

  } else {
    log.info('Scan: %s(%s)', ScanStatus[status], status)
  }
}

// 登录
function onLogin(user) {
  console.log(`User ${user} logged in`);
  const date = new Date();
  console.log(`Current time: ${date}`);
  console.log(`Auto chatbot mode activated`);

  // 加载任务
  const currentFilePath = fileURLToPath(import.meta.url);
  const currentDirPath = dirname(currentFilePath);
  const messageSender = new MessageSender(bot)
  messageSender.loadTasksFromJSON(join(currentDirPath, '..', 'tasks', 'tasks.json'))
}

// 登出
function onLogout(user) {
  console.log(`${user} has logged out`);
}

// 收到好友请求
async function onFriendShip(friendship) {
  const frienddShipRe = /chatgpt|chat/
  if (friendship.type() === 2) {
    if (frienddShipRe.test(friendship.hello())) {
      await friendship.accept()
    }
  }
}

/**
 * 消息发送
 * @param msg
 * @param isSharding
 * @returns {Promise<void>}
 */
async function onMessage(msg) {
  // 默认消息回复
  await defaultMessage(msg, bot)
  // 消息分片
  // await shardingMessage(msg,bot)
}

// 初始化机器人
export const bot = WechatyBuilder.build({
  name: 'WechatEveryDay',
  // puppet: "wechaty-puppet-wechat",
  // puppetOptions: {
  //   uos: true
  // }
})

// 扫码
bot.on('scan', onScan)
// 登录
bot.on('login', onLogin)
// 登出
bot.on('logout', onLogout)
// 收到消息
bot.on('message', onMessage)
// 添加好友
bot.on('friendship', onFriendShip)

// 启动微信机器人
bot
  .start()
  .then(() => console.log('开始登录微信...'))
  .catch((e) => console.error(e))