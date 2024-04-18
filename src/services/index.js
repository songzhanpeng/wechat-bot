import axios from 'axios'
import { loadConfig } from '../utils/index.js'
const config = loadConfig()

const request = axios.create({
  // timeout: 30 * 1000, // 设置超时时间为 30 秒
  cancelToken: false
})

// 定义接口列表
export const endpointsMap = new Map([
  // ['moYu', 'https://api.vvhan.com/api/moyu?type=json'],
  ['moYu', 'https://api.j4u.ink/v1/store/other/proxy/remote/moyu.json'],
  ['sixs', 'http://api.suxun.site/api/sixs?type=json'],
  ['tianGou', 'https://v.api.aa1.cn/api/tiangou/index.php'],
  ['oneDayEnglish', 'https://api.oioweb.cn/api/common/OneDayEnglish'],
  ['xingZuoYunShi', 'https://dayu.qqsuu.cn/xingzuoyunshi/apis.php?type=json'],
  ['boy', 'https://api.52vmy.cn/api/img/tu/boy'],
  ['girl', 'https://api.52vmy.cn/api/img/tu/girl'],
  ['girlVideo', 'https://tucdn.wpon.cn/api-girl/index.php?wpon=json'],
  ['scSp', 'http://www.wudada.online/Api/ScSp'],
  ['faBing', 'https://api.lolimi.cn/API/fabing/fb.php'],
  ['fkxqs', 'https://jkyapi.top/API/fkxqs.php'],
  ['generations', 'https://api-collect.idcdun.com/v1/images/generations'],
  ['sl', 'https://www.mnapi.cn/sl.php?type=video'],
  ['yz', 'https://www.mnapi.cn/yz.php?type=video'],
  ['jk', 'https://api.suyanw.cn/api/jk.php'],
  ['yiyan', 'https://v.api.aa1.cn/api/yiyan/index.php'],
])

// 通用的请求函数
export async function fetchData(url) {
  try {
    const response = await request.get(url)
    return response
  } catch (error) {
    throw new Error(`Failed to fetch data from ${url}: ${error.message}`)
  }
}

// 获取摸鱼人日历
export async function fetchMoyuData() {
  return await request.get(endpointsMap.get('moYu'))
}

// 新闻60s
export async function fetchSixsData() {
  return await request.get(endpointsMap.get('sixs'))
}

// 获取舔狗日记
export async function fetchTianGouData() {
  return await request.get(endpointsMap.get('tianGou'))
}

// 获取每日英语
export async function fetchOneDayEnglishData() {
  return await request.get(endpointsMap.get('oneDayEnglish'))
}

// 获取星座运势
export async function fetchConstellationsData() {
  return await request.get(endpointsMap.get('xingZuoYunShi'))
}

// 获取男孩图片
export async function fetchBoyImage() {
  return await request.get(endpointsMap.get('boy'))
}

// 获取女孩图片
export async function fetchGirlImage() {
  return await request.get(endpointsMap.get('girl'))
}

// 获取女孩视频
export async function fetchGirlVideo() {
  return await request.get(endpointsMap.get('girlVideo'))
}

// 获取随机美女视频
export async function fetchRandomBeautyGirlVideo() {
  return await request.get(endpointsMap.get('scSp'))
}

// 获取发病语录
export async function fetchFabingData(name) {
  return await request.get(endpointsMap.get('faBing'), { params: { name } })
}

// 获取疯狂星期四
export async function fetchFkxqsData() {
  return await request.get(endpointsMap.get('fkxqs'))
}

// 绘图 ?prompt=API&n=1&model=dall-e-3&size=1024x1024
export async function fetchGenerationsData(prompt = 'API') {
  return await request.get(endpointsMap.get('generations'), {
    params: { prompt, n: 1, model: 'dall-e-3', size: '1024x1024' },
  })
}

export async function fetchSlData() {
  return await request.get(endpointsMap.get('sl'))
}

export async function fetchJKData() {
  return await request.get(endpointsMap.get('jk'), {
    responseType: 'arraybuffer',
  })
}

export async function fetchYiYanData() {
  return await request.get(endpointsMap.get('yiyan'))
}

/**
 * 异步获取天气数据
 * @param {string} city - 要查询天气的城市名，默认为空字符串，即查询全球天气
 * @returns {Promise} - 返回一个Promise对象，解析后包含从服务器获取的天气数据
 */
export async function fetchWetherData(city='') {
  // 使用request.get异步请求天气数据
  return await request.get(`http://tq.ruiange.work/?city=${city}&type=json`)
}


/**
 * 异步获取 Kimi 数据的函数。
 * @param {string} prompt 用户输入的消息。
 * @returns {Promise<Object>} 返回一个承诺（Promise），解析为从 API 获取的响应数据。
 */
export async function fetchKimiData(prompt) {
  // 定义 API 的 URL 和使用的 Token
  const url = 'https://api.moonshot.cn/v1/chat/completions'
  const token = config.KIMI_TOKEN

  // 构建要发送给 API 的数据，包括模型名称、用户消息和温度设置
  const data = {
    model: 'moonshot-v1-8k',
    messages: [
      {
        role: 'system',
        content:
          '你是 Kimi，由 Moonshot AI 提供的人工智能助手，你更擅长中文和英文的对话。你会为用户提供安全，有帮助，准确的回答。同时，你会拒绝一切涉及恐怖主义，种族歧视，黄色暴力等问题的回答。Moonshot AI 为专有名词，不可翻译成其他语言。',
      },
      { role: 'user', content: prompt },
    ],
    temperature: 0.3,
    // use_search: true,
  }

  return await request.post(url, data, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function fetchNtyyData() {
  return await request.get(`https://api.qvqa.cn/api/ntyy/?name=yuanshen`)
}

// https://api.mu-jie.cc/xhs?url=http://xhslink.com/ZX9OHG
// 解析小红书
export async function fetchXhsData(url = '') {
  return await request.get(`https://api.mu-jie.cc/xhs?url=${url}`)
}

// https://api.suxun.site/api/douyin?url=https://v.douyin.com/iYUqNyjy/
// export async function fetchDouyinData(url = '') {
//   return await request.get(`https://api.suxun.site/api/douyin?url=${url}`)
// }

// https://api.pearktrue.cn/api/video/douyin/?url=https://v.douyin.com/iererwFh/
export async function fetchDouyinData(url = '') {
  return await request.get(`https://api.pearktrue.cn/api/video/douyin/?url=${url}`)
}