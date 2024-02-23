import { describe, it, expect } from 'vitest'
import {
  fetchMoyuData,
  fetchSixsData,
  fetchTianGouData,
  fetchOneDayEnglishData,
  fetchConstellationsData,
  fetchGirlVideo,
  fetchRandomBeautyGirlVideo,
  fetchShaoLuoRandomBeautyGirlVideo,
  fetchFabingData
} from './index.js'
import { getRedirectUrl, containsHtmlTags } from '../utils/index.js'
import { FileBox } from 'file-box'

describe('Testing XiaRuo API Endpoints', () => {
  it('Get MoYu People Calendar', async () => {
    const { data } = await fetchMoyuData();
    if (data.code === 200) {
      const res = await getRedirectUrl(data.data.moyu_url);
      const pngUrlRegex = /\.png$/i;
      expect(pngUrlRegex.test(res)).toBe(true);
    }
  });

  it('Get News in 60s', async () => {
    const { data } = await fetchSixsData();
    if (data.code === '200') {
      const pngUrlRegex = /\.png$/i;
      expect(pngUrlRegex.test(data.image)).toBe(true);
    }
  });

  it('Get Tiantian Gou Diary', async () => {
    const { data = '' } = await fetchTianGouData();
    expect(containsHtmlTags(data)).toBe(true);
  });

  it('Get Daily English', async () => {
    const { data } = await fetchOneDayEnglishData();
    console.log('🚀 ~ it ~ data:', data);
    if (data.code === 200) {
      const pngUrlRegex = /\.png$/i;
      expect(pngUrlRegex.test(data.result.img)).toBe(true);
    }
  });

  it('Get Constellation Fortune', async () => {
    const { data } = await fetchConstellationsData();
    console.log('🚀 ~ it.only ~ data:', data);
    if (data.code === 200) {
      const pngUrlRegex = /\.png$/i;
      expect(pngUrlRegex.test(data.data)).toBe(true);
    }
  });

  it('Get Random Girl Video', async () => {
    try {
      const { data } = await fetchGirlVideo();
      expect(data.result).toBe(200)
      expect(data.msg).toBe('请求成功')
      expect(data.mp4).toEqual(expect.any(String));
      console.log('🚀 ~ it.only ~ data:', data);
    } catch (error) {
      console.log("🚀 ~ it ~ error:", error)
    }
  });

  it('Fetch Random Beauty Girl Video', async () => {
    const { data } = await fetchRandomBeautyGirlVideo();
    expect(data.code).toBe('200')
    expect(data.msg).toBe('请求成功')
    expect(data.data).toEqual(expect.any(String));
  });

  it('Fetch ShaoLuo Random Beauty Girl Video', async () => {
    const { data } = await fetchShaoLuoRandomBeautyGirlVideo();
    console.log("🚀 ~ it ~ data:", data)
    const res = await FileBox.fromUrl('https://www.mnapi.cn/sl.php?type=video');
    console.log("🚀 ~ it.only ~ res:", res);
  });

  it('Get Fabing Data', async () => {
    const { data } = await fetchFabingData('张三');
    console.log("🚀 ~ it ~ data:", data)
    expect(data.code).toBe(1)
    expect(data.message).toBe('Success/成功')
    expect(data.data).toEqual(expect.any(String));
  });
});