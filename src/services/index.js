import axios from 'axios'

const request = axios.create({
  timeout: 30 * 1000, // 设置超时时间为 5 秒
})

// 定义接口列表
export const endpointsMap = new Map([
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

// // 测试所有接口的状态
// export async function checkAllEndpointsStatus() {
//   const results = []

//   // 遍历接口列表
//   for (const [funcName, endpoint] of endpointsMap.entries()) {
//     try {
//       // 发送 HEAD 请求检查接口状态
//       await request.head(endpoint)
//       // 将接口状态添加到结果数组
//       results.push(`${funcName}: OK`)
//     } catch (error) {
//       // 如果请求失败，将错误信息添加到结果数组
//       results.push(`${funcName}: ${error.message}`)
//     }
//   }

//   // 输出结果
//   console.log('/ping all endpoints')
//   console.log(results.join('\n'))
// }

// // 调用函数检查所有接口状态
// checkAllEndpointsStatus()
