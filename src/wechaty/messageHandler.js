import {FileBox} from 'file-box'
import fs from 'fs'
// import { fileURLToPath } from 'url'
// import { dirname, join } from 'path'
import {
    fetchMoyuData,
    fetchSixsData,
    fetchTianGouData,
    fetchOneDayEnglishData,
    fetchConstellationsData,
    fetchBoyImage,
    fetchGirlImage,
    fetchGirlVideo,
    fetchRandomBeautyGirlVideo,
    fetchFabingData, fetchStockCode, fetchTHS
} from '../services/index.js'
import {containsHtmlTags, getRedirectUrl, parseCommand} from '../utils/index.js'
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
            const {data} = await fetchMoyuData()
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
            const {data} = await fetchSixsData()
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
            const {data = ''} = await fetchTianGouData()
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
            const {data} = await fetchOneDayEnglishData()
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
            const {data} = await fetchConstellationsData()
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
            const {data} = await fetchBoyImage()

            if (data.code === 200) {
                const response = await axios({
                    method: 'GET',
                    url: data.url,
                    responseType: 'arraybuffer', // Important: specify responseType as arraybuffer
                })

                await msg.say(FileBox.fromBuffer(response.data, 'image.png'))
                console.log('Image sent successfully')
            } else {
                await msg.say('获取图片数据失败')
                console.error('Failed to get image data:', data)
            }
        } catch (error) {
            console.error('Error handling image:', error)
            await msg.say('没找到，再试一次吧')
        }
    }

    async handleMM(msg) {
        try {
            const {data} = await fetchGirlImage()

            if (data.code === 200) {
                const response = await axios({
                    method: 'GET',
                    url: data.url,
                    responseType: 'arraybuffer', // Important: specify responseType as arraybuffer
                })

                await msg.say(FileBox.fromBuffer(response.data, 'image.png'))
                console.log('Image sent successfully')
            } else {
                await msg.say('获取图片数据失败')
                console.error('Failed to get image data:', data)
            }
        } catch (error) {
            console.error('Error handling image:', error)
            await msg.say('没找到，再试一次吧')
        }
    }

    async handleHelp(msg) {
        // const commands = {
        //     '/ping': '发送 "pong" 以测试是否在线',
        //     '/moyu': '获取摸鱼人数据',
        //     '/sixs': '获取60秒新闻数据',
        //     '/de': '获取每日英语',
        //     '/mf': '获取发疯语录，需要指定名字，没有则默认你自己昵称',
        //     '/cs': '获取今日星座运势',
        //     '/gg': '获取随机帅哥',
        //     '/mm': '获取随机妹妹',
        //     '/rgv': '获取随机小姐姐视频',
        //     '/rgbv': '获取随机美少女视频',
        //     '/dog': '获取舔狗日记',
        //     '添加股票': '获取舔狗日记',
        // }
        const commands = {
            '/ping': '发送 "pong" 以测试是否在线',
            '/moyu': '获取摸鱼人数据',
            '/sixs': '获取60秒新闻数据',
            '/de': '获取每日英语',
            '/mf': '获取发疯语录，需要指定名字，没有则默认你自己昵称',
            '/cs': '获取今日星座运势',
            '/tj': '添加股票--日期--股票全称--成本--逻辑(可有可无)--市值',
            '/ck': '查看添加过的股票',
        }

        let helpMessage = '可用命令：\n'
        for (const [command, description] of Object.entries(commands)) {
            helpMessage += `${command} - ${description}\n`
        }

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

    async handleRGV(msg) {
        try {
            const {data} = await fetchGirlVideo()
            if (data.result === 200) {
                await msg.say(FileBox.fromUrl('https:' + data.mp4))
                console.log('Random girl video message sent successfully')
            } else {
                await msg.say('获取随机小姐姐视频失败')
                console.error('Failed to get random girl video: Video URL not found')
            }
        } catch (error) {
            console.error('Error sending random girl video message:', error)
            await msg.say('获取随机小姐姐视频失败')
        }
    }

    async handleRandomBeautyGirlVideo(msg) {
        try {
            const {data} = await fetchRandomBeautyGirlVideo()
            if (data.code === '200') {
                await msg.say(FileBox.fromUrl(data.data))
                console.log('Random beauty girl video message sent successfully')
            } else {
                await msg.say('获取随机美少女视频失败')
                console.error('Failed to get random beauty girl video: Video URL not found')
            }
        } catch (error) {
            console.error('Error sending random beauty girl video message:', error)
        }
    }

    TASKS = [
        {keyword: ['/ping'], description: '发送 "pong" 以测试是否在线', func: this.handlePing},
        {keyword: ['/moyu'], description: '获取摸鱼人数据', func: this.handleMoYu},
        {keyword: ['/sixs'], description: '获取60秒新闻数据', func: this.handleSixs},
        {keyword: ['/dog'], description: '获取舔狗日记', func: this.handleDog},
        {keyword: ['/de'], description: '获取每日英语', func: this.handleDailyEnglish},
        {keyword: ['/cs'], description: '获取今日星座运势', func: this.handleConstellations},
        {keyword: ['/help'], description: '获取帮助信息', func: this.handleHelp},
        {keyword: ['/gg'], description: '获取随机帅哥', func: this.handleGG},
        {keyword: ['/mm'], description: '获取随机妹妹', func: this.handleMM},
        {keyword: ['#CDK', '#兑换码', '兑换码'], description: '输出兑换码', func: this.handleCDK},
        {keyword: ['/rgv'], description: '获取随机小姐姐视频', func: this.handleRGV},
        {keyword: ['/rgbv'], description: '获取随机美少女视频', func: this.handleRandomBeautyGirlVideo},
        {keyword: ['/mf'], description: '发癫文学 需指定对应的名字', func: this.handleFetchFabing},
        {keyword: ['/今日推荐'], description: '推荐今日股票', func: this.handleFetchStockCode},
        {keyword: ['/同花顺'], description: '推荐今日股票', func: this.handleTHS},
        {keyword: ['/tj'], description: '推荐今日股票', func: this.handleTJ},
        {keyword: ['/ck'], description: '推荐今日股票', func: this.handleCK},
    ]

    async handleCK(msg) {
        try {
            const content = msg.text()
            const {parameters} = parseCommand(content)
            let name = parameters[0];
            if (!name) {
                const contact = msg.talker() // 发消息人
                name = await contact.name() // 发消息人昵称
            }
            const res = await fetchTHS(name)
            await msg.say(data)
        } catch (error) {
            console.error('Error sending random girl video message:', error)
        }
    }

    async handleTJ(msg) {
        try {
            const content = msg.text()
            const {parameters} = parseCommand(content)
            let name = parameters[0];
            if (!name) {
                const contact = msg.talker() // 发消息人
                name = await contact.name() // 发消息人昵称
            }
            const res = await fetchTHS(name)
            await msg.say(data)
        } catch (error) {
            console.error('Error sending random girl video message:', error)
        }
    }

    async handleTHS(msg) {
        try {
            const content = msg.text()
            const {parameters} = parseCommand(content)
            let name = parameters[0];
            if (!name) {
                const contact = msg.talker() // 发消息人
                name = await contact.name() // 发消息人昵称
            }
            const res = await fetchTHS(name)
            await msg.say(data)
        } catch (error) {
            console.error('Error sending random girl video message:', error)
        }
    }

    async handleFetchStockCode(msg) {
        try {
            const content = msg.text()
            const {parameters} = parseCommand(content)
            let name = parameters[0];
            if (!name) {
                const contact = msg.talker() // 发消息人
                name = await contact.name() // 发消息人昵称
            }
            const {data} = await fetchStockCode(name)
            await msg.say(data)
        } catch (error) {
            console.error('Error sending random girl video message:', error)
        }
    }

    async handleFetchFabing(msg) {
        try {
            const content = msg.text()
            const {parameters} = parseCommand(content)
            let name = parameters[0];
            if (!name) {
                const contact = msg.talker() // 发消息人
                name = await contact.name() // 发消息人昵称
            }
            const {data} = await fetchFabingData(name)
            console.log("🚀 ~ MessageHandler ~ handleFetchFabing ~ data:", data)
            if (data.code === 1) {
                await msg.say(data.data)
            } else {
                console.error('Failed to get random girl video: Video URL not found')
            }
        } catch (error) {
            console.error('Error sending random girl video message:', error)
        }
    }

    async handleMessage(msg) {
        const content = msg.text()
        const {instruction} = parseCommand(content)
        for (const task of this.TASKS) {
            if (task.keyword.includes(instruction)) {
                await task.func.call(this, msg)
                return
            }
        }
        await this.handleUnknown(msg)
    }

    isIncludesKeyword(content) {
        const {instruction} = parseCommand(content)
        return this.TASKS.some((task) => {
            return task.keyword.some((keyword) => {
                return keyword === instruction
            })
        })
    }
}

// const handle = new MessageHandler({})
// const res = handle.isIncludesKeyword('/mf hhh')
// console.log("🚀 ~ res:", res)

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
        const room = await this.wechaty.Room.find({id: data.roomId})
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
