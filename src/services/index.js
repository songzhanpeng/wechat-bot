import axios from 'axios'

// 获取摸鱼人日历
export async function fetchMoyuData() {
  const url = 'https://api.j4u.ink/v1/store/other/proxy/remote/moyu.json'
  return await axios.get(url)
}

// 新闻60s
export async function fetchSixsData() {
  const url = 'http://api.suxun.site/api/sixs?type=json'
  return await axios.get(url)
}

// 获取舔狗日记
export async function fetchTianGouData() {
  const url = 'https://v.api.aa1.cn/api/tiangou/index.php'
  return await axios.get(url)
}

export async function fetchOneDayEnglishData() {
  const url = 'https://api.oioweb.cn/api/common/OneDayEnglish'
  return await axios.get(url)
}

export async function fetchConstellationsData() {
    const url = `https://dayu.qqsuu.cn/xingzuoyunshi/apis.php?type=json`;
    return await axios.get(url);
}
