import axios from 'axios'

const request = axios.create({
  timeout: 5000, // 设置超时时间为 5 秒
})

// 获取摸鱼人日历
export async function fetchMoyuData() {
  const url = 'https://api.j4u.ink/v1/store/other/proxy/remote/moyu.json'
  return await request.get(url)
}

// 新闻60s
export async function fetchSixsData() {
  const url = 'http://api.suxun.site/api/sixs?type=json'
  return await request.get(url)
}

// 获取舔狗日记
export async function fetchTianGouData() {
  const url = 'https://v.api.aa1.cn/api/tiangou/index.php'
  return await request.get(url)
}

export async function fetchOneDayEnglishData() {
  const url = 'https://api.oioweb.cn/api/common/OneDayEnglish'
  return await request.get(url)
}

export async function fetchConstellationsData() {
  const url = `https://dayu.qqsuu.cn/xingzuoyunshi/apis.php?type=json`
  return await request.get(url)
}

export async function fetchBoyImage() {
  const url = 'https://api.52vmy.cn/api/img/tu/boy'
  return await request.get(url)
}

export async function fetchGirlImage() {
  const url = 'https://api.52vmy.cn/api/img/tu/girl'
  return await request.get(url)
}

export async function fetchGirlVideo() {
  const url = 'https://tucdn.wpon.cn/api-girl/index.php?wpon=json'
  return await request.get(url)
}

export async function fetchRandomBeautyGirlVideo() {
  const url = 'http://www.wudada.online/Api/ScSp';
  return await request.get(url);
}

export async function fetchFabingData(name) {
  const url = `https://api.lolimi.cn/API/fabing/fb.php?name=${name}`;
  return await request.get(url);
}

// // 定义接口列表
// const endpoints = [
//   'https://example.com/api/endpoint1',
//   'https://example.com/api/endpoint2',
//   // 添加更多的接口URL
// ];

// async function checkEndpointStatus() {
//   const results = [];
  
//   // 遍历接口列表
//   for (const endpoint of endpoints) {
//     try {
//       // 发送 HEAD 请求检查接口状态
//       await request.head(endpoint);
//       // 将接口状态添加到结果数组
//       results.push(`${endpoint}: OK`);
//     } catch (error) {
//       // 如果请求失败，将错误信息添加到结果数组
//       results.push(`${endpoint}: ${error.message}`);
//     }
//   }
  
//   // 输出结果
//   console.log('/ping all');
//   console.log(results.join('\n'));
// }

// // 调用函数检查接口状态
// checkEndpointStatus();