import { FileBox } from 'file-box'
import fs from 'fs'
// import { fileURLToPath } from 'url'
// import { dirname, join } from 'path'
import { fetchMoyuData, fetchSixsData, fetchTianGouData, fetchOneDayEnglishData, fetchConstellationsData, fetchBoyImage } from '../services/index.js'
import { containsHtmlTags, getRedirectUrl } from '../utils/index.js'
import axios from 'axios'

export class MessageHandler {
  constructor(bot) {
    this.bot = bot
  }

  async handlePing(msg) {
    try {
      await msg.say('pong')
      console.log('Pong message sent successfully')
    } catch (error) {
      console.error('Error sending pong message:', error)
    }
  }

  async handleMoYu(msg) {
    try {
      const { data } = await fetchMoyuData()
      if (data.code === 200) {
        const res = await getRedirectUrl(data.data.moyu_url)
        await msg.say(FileBox.fromUrl(res))
        console.log('MoYu data message sent successfully')
      } else {
        await msg.say('获取摸鱼数据失败')
        console.error('Error: 摸鱼数据请求失败，状态码:', data.code)
      }
    } catch (error) {
      console.error('Error sending MoYu data message:', error)
    }
  }

  async handleSixs(msg) {
    try {
      const { data } = await fetchSixsData()
      if (data.code === '200') {
        await msg.say(FileBox.fromUrl(data.image))
        console.log('Sixs data message sent successfully')
      } else {
        await msg.say('获取新闻60s数据失败')
        console.error('Error: 新闻60s数据请求失败，状态码:', data.code)
      }
    } catch (error) {
      console.error('Error sending Sixs data message:', error)
    }
  }

  async handleDog(msg) {
    try {
      const { data = '' } = await fetchTianGouData()
      if (containsHtmlTags(data)) {
        const result = data.replace(/<[^>]*>/g, '')
        await msg.say(result)
        console.log('Dog data message sent successfully')
      } else {
        // 如果数据不包含 HTML 标签，发送一条提示消息
        await msg.say('舔狗日记数据为空或无效')
        console.log('Dog data is empty or invalid')
      }
    } catch (error) {
      console.error('Error sending Dog data message:', error)
    }
  }

  async handleDailyEnglish(msg) {
    try {
      const { data } = await fetchOneDayEnglishData()
      if (data.code === 200) {
        await msg.say(FileBox.fromUrl(data.result.img))
        await msg.say(FileBox.fromUrl(data.result.tts))
        console.log('Daily English data message sent successfully')
      } else {
        await msg.say('获取每日英语一句数据失败')
        console.error('Failed to get Daily English data:', data)
      }
    } catch (error) {
      console.error('Error sending Daily English data message:', error)
    }
  }

  async handleConstellations(msg) {
    try {
      const { data } = await fetchConstellationsData()
      if (data.code === 200) {
        await msg.say(FileBox.fromUrl(data.data))
        console.log('Constellations data message sent successfully')
      } else {
        await msg.say('获取星座运势数据失败')
        console.error('Failed to get Constellations data:', data)
      }
    } catch (error) {
      console.error('Error sending Constellations data message:', error)
    }
  }

  async handleGG(msg) {
    try {
      const { data } = await fetchBoyImage()

      if (data.code === 200) {
        const response = await axios({
          method: 'GET',
          url: data.url,
          responseType: 'arraybuffer', // Important: specify responseType as arraybuffer
        })

        await msg.say(FileBox.fromBuffer(response.data))
        console.log('Image sent successfully')
      } else {
        await msg.say('获取图片数据失败')
        console.error('Failed to get image data:', data)
      }
    } catch (error) {
      console.error('Error handling image:', error)
      await msg.say('处理图片时发生错误')
    }
  }

  async handleHelp(msg) {
    const helpMessage = `可用命令：
      /ping - 发送 "pong" 以测试是否在线
      /moyu - 获取摸鱼人数据
      /sixs - 获取60秒新闻数据
      /de   - 获取每日英语
      /cs   - 获取今日星座运势
      /gg   - 获取随机帅哥
      /dog  - 获取舔狗日记`
    await msg.say(helpMessage)
  }

  async handleUnknown(msg) {
    await msg.say('未知命令，请使用 /help 查看可用命令')
  }

  async handleCDK(msg) {
    await msg.say(`VIP666
VIP888
VIP2023
xddq666
xddq2023
xddq2309
xddqqq
xddqzhw
xddqgzh
xddqfl
XD123NBH6
wgyx666
cyg666
cyg888
zhendan666
zz666
zz888
XD12YLH6
DQ34QLH88
QT666
xdcjxqy
xddqydkl
fkxqyxd66
cjxqyxd6
dqdxyq8
hylddqsj6
xdhhgdn
xdxxscl66
xdhjak666
xdwsry888
xdlnkgdj66`)
  }

  async handleMessage(msg) {
    const content = msg.text()

    if (content.startsWith('#CDK') || content.startsWith('#兑换码')) {
      await this.handleCDK(msg)
      return
    }

    if (content.startsWith('/ping')) {
      await this.handlePing(msg)
    } else if (content.startsWith('/moyu')) {
      await this.handleMoYu(msg)
    } else if (content.startsWith('/sixs')) {
      await this.handleSixs(msg)
    } else if (content.startsWith('/dog')) {
      await this.handleDog(msg)
    } else if (content.startsWith('/de')) {
      await this.handleDailyEnglish(msg)
    } else if (content.startsWith('/cs')) {
      await this.handleConstellations(msg)
    } else if (content.startsWith('/help')) {
      await this.handleHelp(msg)
    } else if (content.startsWith('/gg')) {
      await this.handleGG(msg)
    } else {
      await this.handleUnknown(msg)
    }
  }
}

export class MessageSender {
  constructor(wechaty) {
    this.wechaty = wechaty
  }

  async sendMessage(data) {
    // if (!this.wechaty) {
    //   console.log('Wechaty instance is not provided.')
    //   return
    // }
    if (data.type === 'room') {
      await this.sendToRoom(data)
    } else {
      console.log('Invalid message type in JSON.')
    }
  }

  async sendToRoom(data) {
    const room = await this.wechaty.Room.find({ id: data.roomId })
    if (room) {
      await room.say(data.message)
    } else {
      console.log(`Room ${data.roomId} not found.`)
    }
  }

  async loadTasksFromJSON(jsonFilePath) {
    try {
      const jsonData = fs.readFileSync(jsonFilePath, 'utf8')
      const tasks = JSON.parse(jsonData)
      console.log('🚀 ~ MessageSender ~ loadTasksFromJSON ~ tasks:', tasks)
      for (const task of tasks) {
        await this.sendMessage(task)
      }
    } catch (error) {
      console.error('Error loading tasks from JSON:', error)
    }
  }
}

// const currentFilePath = fileURLToPath(import.meta.url);
// const currentDirPath = dirname(currentFilePath);
// const messageSender = new MessageSender(null)
// messageSender.loadTasksFromJSON(join(currentDirPath, '..', 'tasks', 'tasks.json'))
