import { describe, it, expect } from 'vitest'
import { fetchMoyuData, fetchSixsData, fetchTianGouData, fetchOneDayEnglishData, fetchConstellationsData } from './index.js'
import { getRedirectUrl, containsHtmlTags } from '../utils/index.js'

describe('测试 夏柔api 接口', () => {
  it('获取摸鱼人日历', async () => {
    const { data } = await fetchMoyuData()
    if (data.code === 200) {
      const res = await getRedirectUrl(data.data.moyu_url)
      // 匹配 PNG 图片的 URL 格式
      const pngUrlRegex = /\.png$/i
      expect(pngUrlRegex.test(res)).toBe(true)
    }
  })

  it('新闻60s', async () => {
    const { data } = await fetchSixsData()
    if (data.code === '200') {
      // 匹配 PNG 图片的 URL 格式
      const pngUrlRegex = /\.png$/i
      expect(pngUrlRegex.test(data.image)).toBe(true)
    }
  })

  it('舔狗日记', async () => {
    const { data = '' } = await fetchTianGouData()
    expect(containsHtmlTags(data)).toBe(true)
  })

  it('每日英语', async () => {
    const { data } = await fetchOneDayEnglishData()
    if (data.code === 200) {
      // 匹配 PNG 图片的 URL 格式
      const pngUrlRegex = /\.png$/i
      expect(pngUrlRegex.test(data.result.img)).toBe(true)
    }
  })

  it('星座运势', async () => {
    const { data } = await fetchConstellationsData()
    console.log('🚀 ~ it.only ~ data:', data)
    if (data.code === 200) {
      // 匹配 PNG 图片的 URL 格式
      const pngUrlRegex = /\.png$/i
      expect(pngUrlRegex.test(data.data)).toBe(true)
    }
  })

  // it.only('帅哥', async () => {
  //   const { data } = await fetchBoyImage()
  //   const response = await axios({
  //     method: 'GET',
  //     url: data.url,
  //     responseType: 'arraybuffer', // Important: specify responseType as arraybuffer
  //   })
  //   // const res = await FileBox.fromUrl(data.url)
  //   console.log("🚀 ~ it.only ~ response:", response)
  //    // Create FileBox from the response data
  //    const fileBox = FileBox.fromBuffer(response.data);

  //    // Save FileBox to the specified output path
  //    await fileBox.toFile('./test.png');
  //   // if (data.code === 200) {
  //   //   // 匹配 PNG 图片的 URL 格式
  //   //   const pngUrlRegex = /\.png$/i
  //   //   expect(pngUrlRegex.test(data.data)).toBe(true)
  //   // }
  // })
})
