import { FileBox } from 'file-box'
import dotenv from 'dotenv'

import { getSparkAiReply as getReply } from '../spark/index.js'
import { fetchMoyuData, fetchSixsData, fetchTianGouData, fetchOneDayEnglishData } from '../services/index.js'

const env = dotenv.config().parsed
const botName = env.BOT_NAME
const roomWhiteList = env.ROOM_WHITE_LIST.split(',')
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
  const isAlias = aliasWhiteList.includes(remarkName) || aliasWhiteList.includes(name) || aliasWhiteList.includes('*') // 发消息的人是否在联系人白名单内
  const isBotSelf = botName === remarkName || botName === name // 是否是机器人自己
  const privateChat = !room

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

    if (content.startsWith('/ping')) {
      try {
        await msg.say('pong')
        console.log('Pong message sent successfully')
      } catch (error) {
        console.error('Error sending pong message:', error)
      }
      return
    }

    // 摸鱼人
    if (content.startsWith('/moyu')) {
      try {
        const url = await fetchMoyuData()
        await msg.say(FileBox.fromUrl(url))
        console.log('MoYu data message sent successfully')
      } catch (error) {
        console.error('Error sending MoYu data message:', error)
      }
      return
    }

    // 60s新闻
    if (content.startsWith('/sixs')) {
      try {
        const url = await fetchSixsData()
        await msg.say(FileBox.fromUrl(url))
        console.log('Sixs data message sent successfully')
      } catch (error) {
        console.error('Error sending Sixs data message:', error)
      }
      return
    }

    // 狗图
    if (content.startsWith('/dog')) {
      try {
        const data = await fetchTianGouData()
        const result = data.replace(/<[^>]*>/g, '')
        await msg.say(result)
        console.log('Dog data message sent successfully')
      } catch (error) {
        console.error('Error sending Dog data message:', error)
      }
      return
    }

    // 每日英语
    if (content.startsWith('/daily-english')) {
      try {
        const data = await fetchOneDayEnglishData()
        if (data.code === 200) {
          await msg.say(FileBox.fromUrl(data.result.img))
          await msg.say(FileBox.fromFile(data.result.tts))
          console.log('Daily English data message sent successfully')
        } else {
          await msg.say('服务失去高光')
          console.error('Failed to get Daily English data:', data)
        }
      } catch (error) {
        console.error('Error sending Daily English data message:', error)
      }
      return
    }

    // 帮助命令
    if (content.startsWith('/help')) {
      const helpMessage = `可用命令：
    /ping - 发送 "pong" 以测试是否在线
    /moyu - 获取摸鱼人数据
    /sixs - 获取60秒新闻数据
    /daily-english - 获取每日英语
    /dog  - 获取舔狗日记`
      await msg.say(helpMessage)
      return
    }

    // 会终止当前pm2进行导致机器人重启失败
    // if (content.startsWith("/update")) {
    //   try {
    //     console.log("正在执行更新脚本...");
    //     await msg.say(`正在执行更新脚本...`);
    //     const { stdout, stderr } = await executeShellScript('npm run update');
    //     await msg.say(`更新成功！输出：${stdout}`);
    //   } catch (error) {
    //     console.error(error);
    //     await msg.say(`更新失败！错误：${error}`);
    //   }
    //   return;
    // }

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
