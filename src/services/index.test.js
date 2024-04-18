import { describe, it, expect } from 'vitest'
import {
  fetchMoyuData,
  fetchSixsData,
  fetchTianGouData,
  fetchOneDayEnglishData,
  fetchConstellationsData,
  fetchGirlVideo,
  fetchRandomBeautyGirlVideo,
  fetchFabingData,
  fetchFkxqsData,
  fetchGenerationsData,
  fetchKimiData,
  fetchJKData,
  fetchYiYanData,
  fetchWetherData,
  fetchNtyyData,
  fetchXhsData,
  fetchDouyinData,
} from './index.js'
import { getRedirectUrl, containsHtmlTags } from '../utils/index.js'
import { FileBox } from 'file-box'

describe('Testing XiaRuo API Endpoints', () => {
  it('Get MoYu People Calendar', async () => {
    const { data } = await fetchMoyuData()
    console.log('🚀 ~ it ~ data:', data)
    expect(data.success).toBe(true)
    expect(data.url).toEqual(expect.any(String))
  })

  it('Get News in 60s', async () => {
    const { data } = await fetchSixsData()
    console.log('🚀 ~ it ~ data:', data)
    if (data.code === '200') {
      const pngUrlRegex = /\.png$/i
      expect(pngUrlRegex.test(data.image)).toBe(true)
    }
  })

  it('Get Tiantian Gou Diary', async () => {
    const { data = '' } = await fetchTianGouData()
    console.log('🚀 ~ it ~ data:', data)
    expect(containsHtmlTags(data)).toBe(true)
  })

  it('Get Daily English', async () => {
    const { data } = await fetchOneDayEnglishData()
    console.log('🚀 ~ it ~ data:', data)
    const a = await FileBox.fromUrl(data.result.tts)
    console.log('🚀 ~ it ~ a:', a)
    // expect(data).toEqual(
    //   expect.objectContaining({
    //     code: 200,
    //     msg: 'success',
    //     result: {
    //       tts: expect.any(String),
    //       content: expect.any(String),
    //       note: expect.any(String),
    //       dateline: expect.any(String),
    //       img: expect.any(String),
    //     },
    //   }),
    // )
  })

  it('Get Constellation Fortune', async () => {
    const { data } = await fetchConstellationsData()
    console.log('🚀 ~ it.only ~ data:', data)
    expect(data).toEqual(
      expect.objectContaining({
        code: 200,
        msg: 'success',
        data: expect.any(String),
      }),
    )
  })

  it('Get Random Girl Video', async () => {
    const { data } = await fetchGirlVideo()
    console.log('🚀 ~ it.only ~ data:', data)
    expect(data).toEqual(
      expect.objectContaining({
        result: 200,
        msg: '请求成功',
        mp4: expect.any(String),
      }),
    )
    expect(data.result).toBe(200)
    expect(data.msg).toBe('请求成功')
    expect(data.mp4).toEqual(expect.any(String))
  })

  it('Fetch Random Beauty Girl Video', async () => {
    const { data } = await fetchRandomBeautyGirlVideo()
    expect(data.code).toBe('200')
    expect(data.msg).toBe('请求成功')
    expect(data.data).toEqual(expect.any(String))
  })

  it('Get Fabing Data', async () => {
    const { data } = await fetchFabingData('来钱')
    console.log('🚀 ~ it ~ data:', data)
    expect(data.code).toBe(1)
    expect(data.message).toBe('Success/成功')
    expect(data.data).toEqual(expect.any(String))
  })

  it('Get Fkxqs Data', async () => {
    const { data } = await fetchFkxqsData()
    console.log('🚀 ~ it ~ data:', data)
    expect(data).toEqual(expect.any(String))
  })

  it('Get Generations Data', async () => {
    const { data } = await fetchGenerationsData('一只可爱的粉红色狐狸')
    console.log('🚀 ~ it ~ data:', data)
    expect(data.created).toEqual(expect.any(Number))
    expect(data.data).toEqual(expect.any(Array))
  })

  it('Get fetchSlData ', async () => {
    const res = await getRedirectUrl('https://www.mnapi.cn/sl.php?type=video')
    console.log('🚀 ~ it ~ res:', res)
    const a = FileBox.fromUrl(res)
    console.log('🚀 ~ it ~ a:', a)
    // const a = FileBox.fromBuffer(res.data, 'video.mp4')
    // console.log('Location:', a);
    // console.log('🚀 ~ it ~ data:', data)
    // expect(data.created).toEqual(expect.any(Number))
    // expect(data.data).toEqual(expect.any(Array))
  })

  it('Get fetchJKData ', async () => {
    const res = await fetchJKData()
    console.log('🚀 ~ it ~ res:', res)
    const d = FileBox.fromBuffer(res.data, 'image.jpeg')
    // console.log("🚀 ~ it ~ d:", d)
    // // // 将图像保存到本地
    // const imagePath = './image.jpeg'; // 指定本地保存路径
    // fs.writeFileSync(imagePath, d.buffer);
    // console.log('Image saved to:', imagePath);
  })

  it('Get fetchYiYanData ', async () => {
    const res = await fetchYiYanData()
    console.log('🚀 ~ it ~ res.data:', res.data)
    const result = res.data.replace(/<[^>]*>/g, '')
    console.log('🚀 ~ it ~ result:', result)
    expect(result).toEqual(expect.any(String))
  })

  it('Get fetchKimiData ', async () => {
    const res = await fetchKimiData('vite 是什么，好学嘛')
    console.log('🚀 ~ it ~ res.data:', res.data.choices[0].message.content)
    expect(res.data.choices[0].message.content).toEqual(expect.any(String))
  })

  it('Get fetchWetherData ', async () => {
    const res = await fetchWetherData('上海')
    expect(res.data.imgUrl).toEqual(expect.any(String))
  })

  it('Get fetchNtyyData ', async () => {
    const res = await fetchNtyyData()
    expect(res.data.code).toBe(200)
    expect(res.data.data.msg).toEqual(expect.any(String))
  })

  it('Get fetchXhsData ', async () => {
    const res = await fetchXhsData(`http://xhslink.com/ZX9OHG`)
    // console.log("🚀 ~ it ~ res:", res.data.data.images)
    expect(res.data.code).toBe(200)
    expect(res.data.data.type).toBe('图文')
  })

  it.only('Get fetchDouyinData ', async () => {
    const res = await fetchDouyinData(`https://v.douyin.com/iYUqNyjy`)
    console.log("🚀 ~ it.only ~ res:", res)
    expect(res.data.code).toBe(200)
  })
})
