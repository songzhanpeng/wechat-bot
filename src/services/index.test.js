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
  fetchFkxqsData
} from './index.js'
import { getRedirectUrl, containsHtmlTags } from '../utils/index.js'
import { FileBox } from 'file-box'

describe('Testing XiaRuo API Endpoints', () => {
  it('Get MoYu People Calendar', async () => {
    const { data } = await fetchMoyuData()
    console.log("🚀 ~ it ~ data:", data)
    if (data.code === 200) {
      const res = await getRedirectUrl(data.data.moyu_url)
      const pngUrlRegex = /\.png$/i
      expect(pngUrlRegex.test(res)).toBe(true)
    }
  })

  it('Get News in 60s', async () => {
    const { data } = await fetchSixsData()
    console.log("🚀 ~ it ~ data:", data)
    if (data.code === '200') {
      const pngUrlRegex = /\.png$/i
      expect(pngUrlRegex.test(data.image)).toBe(true)
    }
  })

  it('Get Tiantian Gou Diary', async () => {
    const { data = '' } = await fetchTianGouData()
    console.log("🚀 ~ it ~ data:", data)
    expect(containsHtmlTags(data)).toBe(true)
  })

  it('Get Daily English', async () => {
    const { data } = await fetchOneDayEnglishData()
    console.log('🚀 ~ it ~ data:', data)
    expect(data).toEqual(
      expect.objectContaining({
        code: 200,
        msg: 'success',
        result: {
          tts: expect.any(String),
          content: expect.any(String),
          note: expect.any(String),
          dateline: expect.any(String),
          img: expect.any(String),
        },
      }),
    )
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
  
})
