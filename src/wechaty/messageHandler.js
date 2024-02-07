import { FileBox } from 'file-box'
import { fetchMoyuData, fetchSixsData, fetchTianGouData, fetchOneDayEnglishData } from '../services/index.js'

export class MessageHandler {
  constructor(bot) {
    this.bot = bot;
  }

  async handlePing(msg) {
    try {
      await msg.say('pong');
      console.log('Pong message sent successfully');
    } catch (error) {
      console.error('Error sending pong message:', error);
    }
  }

  async handleMoYu(msg) {
    try {
      const url = await fetchMoyuData();
      await msg.say(FileBox.fromUrl(url));
      console.log('MoYu data message sent successfully');
    } catch (error) {
      console.error('Error sending MoYu data message:', error);
    }
  }

  async handleSixs(msg) {
    try {
      const url = await fetchSixsData();
      await msg.say(FileBox.fromUrl(url));
      console.log('Sixs data message sent successfully');
    } catch (error) {
      console.error('Error sending Sixs data message:', error);
    }
  }

  async handleDog(msg) {
    try {
      const data = await fetchTianGouData();
      const result = data.replace(/<[^>]*>/g, '');
      await msg.say(result);
      console.log('Dog data message sent successfully');
    } catch (error) {
      console.error('Error sending Dog data message:', error);
    }
  }

  async handleDailyEnglish(msg) {
    try {
      const data = await fetchOneDayEnglishData();
      if (data.code === 200) {
        await msg.say(FileBox.fromUrl(data.result.img));
        await msg.say(FileBox.fromUrl(data.result.tts));
        console.log('Daily English data message sent successfully');
      } else {
        await msg.say('服务失去高光');
        console.error('Failed to get Daily English data:', data);
      }
    } catch (error) {
      console.error('Error sending Daily English data message:', error);
    }
  }

  async handleHelp(msg) {
    const helpMessage = `可用命令：
      /ping - 发送 "pong" 以测试是否在线
      /moyu - 获取摸鱼人数据
      /sixs - 获取60秒新闻数据
      /daily-english - 获取每日英语
      /dog  - 获取舔狗日记`;
    await msg.say(helpMessage);
  }

  async handleUnknown(msg) {
    await msg.say('未知命令，请使用 /help 查看可用命令');
  }

  async handleMessage(msg) {
    const content = msg.text();

    if (content.startsWith('/ping')) {
      await this.handlePing(msg);
    } else if (content.startsWith('/moyu')) {
      await this.handleMoYu(msg);
    } else if (content.startsWith('/sixs')) {
      await this.handleSixs(msg);
    } else if (content.startsWith('/dog')) {
      await this.handleDog(msg);
    } else if (content.startsWith('/daily-english')) {
      await this.handleDailyEnglish(msg);
    } else if (content.startsWith('/help')) {
      await this.handleHelp(msg);
    } else {
      await this.handleUnknown(msg);
    }
  }
}