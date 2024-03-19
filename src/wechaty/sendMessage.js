import dotenv from 'dotenv'

import { getSparkAiReply as getReply } from '../spark/index.js'
import { MessageHandler } from './messageHandler.js'

const env = dotenv.config().parsed
const botName = env.BOT_NAME
const roomWhiteList = env.ROOM_WHITE_LIST.split(',')
const roomWhitePushList = env.ROOM_WHITE_LIST_PUSH.split(',')
const aliasWhiteList = env.ALIAS_WHITE_LIST.split(',')

/**
 * 默认消息发送
 * @param msg
 * @param bot
 * @returns {Promise<void>}
 */
export async function defaultMessage(msg, bot) {
  const contact = msg.talker() // 发消息人
  const receiver = msg.to() // 消息接收人
  const content = msg.text() // 消息内容
  const room = msg.room() // 是否是群消息
  const roomName = (await room?.topic()) || null // 群名称
  const alias = (await contact.alias()) || (await contact.name()) // 发消息人昵称
  const remarkName = await contact.alias() // 备注名称
  const name = await contact.name() // 微信名称
  const isText = msg.type() === bot.Message.Type.Text // 消息类型是否为文本
  const isRoom = (roomWhiteList.includes(roomName) || roomWhiteList.includes('*')) && content.includes(`@${botName}`) // 是否在群聊白名单内并且艾特了机器人
  const isPushRoom = (roomWhitePushList.includes(roomName) || roomWhitePushList.includes('*')) && content.includes(`@${botName}`) // 是否在群聊白名单内并且艾特了机器人
  const isAlias = aliasWhiteList.includes(remarkName) || aliasWhiteList.includes(name) || aliasWhiteList.includes('*') // 发消息的人是否在联系人白名单内
  const isBotSelf = botName === remarkName || botName === name // 是否是机器人自己
  const privateChat = !room
  const handler = new MessageHandler(bot)
  //  console.log('接收到消息类型：', bot.Message.Type[msg.type()]);

  // 如果消息类型为文本且不是机器人自己发送的消息
  if (isText && !isBotSelf) {
    console.log(JSON.stringify(msg))

    // 检查消息时间戳，如果距离现在超过10秒则不处理
    const messageTimestamp = 1000 * msg.payload.timestamp
    const currentTimestamp = Date.now()
    const timeDifference = currentTimestamp - messageTimestamp

    if (timeDifference > 10 * 1000) {
      console.log(`消息时间戳超过10秒，当前时间戳: ${currentTimestamp}, 消息时间戳: ${messageTimestamp}`)
      return
    }

    // 检测到 / | # 拦截一下
    if (handler.isIncludesKeyword(content)) {
      handler.handleMessage(msg)
      return
    }
    
    if (privateChat) {
      console.log(`🤵 Contact: ${contact.name()} 💬 Text: ${content}`)
    } else {
      const topic = await room.topic()
      console.log(`🚪 Room: ${topic} 🤵 Contact: ${contact.name()} 💬 Text: ${content}`)
    }

    try {
      // 区分群聊和私聊
      if (isRoom && room) {
        // 在群聊中回复消息
        await room.say(await getReply(content.replace(`@${botName}`, '')))
        return
      }

      // 私聊中，白名单内的直接发送回复消息
      if (isAlias && !room) {
        await contact.say(await getReply(content))
      }
    } catch (e) {
      console.error(e)
    }
  }
}

/**
 * 分片消息发送
 * @param message
 * @param bot
 * @returns {Promise<void>}
 */
export async function shardingMessage(message, bot) {
  const talker = message.talker()
  const isText = message.type() === bot.Message.Type.Text // 消息类型是否为文本
  if (talker.self() || message.type() > 10 || (talker.name() === '微信团队' && isText)) {
    return
  }
  const text = message.text()
  const room = message.room()
  if (!room) {
    console.log(`Chat GPT Enabled User: ${talker.name()}`)
    const response = await getChatGPTReply(text)
    await trySay(talker, response)
    return
  }
  let realText = splitMessage(text)
  // 如果是群聊但不是指定艾特人那么就不进行发送消息
  if (text.indexOf(`${botName}`) === -1) {
    return
  }
  realText = text.replace(`${botName}`, '')
  const topic = await room.topic()
  const response = await getChatGPTReply(realText)
  const result = `${realText}\n ---------------- \n ${response}`
  await trySay(room, result)
}

// 分片长度
const SINGLE_MESSAGE_MAX_SIZE = 500

/**
 * 发送
 * @param talker 发送哪个  room为群聊类 text为单人
 * @param msg
 * @returns {Promise<void>}
 */
async function trySay(talker, msg) {
  const messages = []
  let message = msg
  while (message.length > SINGLE_MESSAGE_MAX_SIZE) {
    messages.push(message.slice(0, SINGLE_MESSAGE_MAX_SIZE))
    message = message.slice(SINGLE_MESSAGE_MAX_SIZE)
  }
  messages.push(message)
  for (const msg of messages) {
    await talker.say(msg)
  }
}

/**
 * 分组消息
 * @param text
 * @returns {Promise<*>}
 */
async function splitMessage(text) {
  let realText = text
  const item = text.split('- - - - - - - - - - - - - - -')
  if (item.length > 1) {
    realText = item[item.length - 1]
  }
  return realText
}
