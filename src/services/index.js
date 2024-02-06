import axios from 'axios'
import { getRedirectUrl } from '../utils/index.js'

async function fetchData(url, params = {}) {
    try {
        const response = await axios.get(url, { params })
        return response.data
    } catch (error) {
        console.error('Error fetching data:', error)
        return null
    }
}

// 获取摸鱼人日历
export async function fetchMoyuData() {
    const url = 'https://api.j4u.ink/v1/store/other/proxy/remote/moyu.json'
    try {
        const data = await fetchData(url)
        if (data.code === 200) {
            return await getRedirectUrl(data.data.moyu_url)
        } else {
            console.error('Error fetching Moyu data:', data.message)
            return null
        }
    } catch (error) {
        console.error('Error fetching Moyu data:', error)
        return null
    }
}

export async function fetchSixsData() {
    const url = 'http://api.suxun.site/api/sixs?type=json';

    try {
        const data = await fetchData(url);
        const { code, image } = data;

        if (code === '200') {
            return image;
        } else {
            return '接口异常，请稍后';
        }
    } catch (error) {
        console.error('Error:', error.toJSON ? error.toJSON() : error.toString());
        return '接口异常，请稍后';
    }
}

export async function fetchDataFromXialiu() {
    const url = 'https://xialiu.cn/api/dan/';

    try {
        const response = await axios.get(url);
        console.log("🚀 ~ fetchDataFromXialiu ~ response:", response)
        return response.data;
    } catch (error) {
        console.error('Error fetching data from Xialiu API:', error);
        throw new Error('Failed to fetch data from Xialiu API');
    }
}

export async function fetchTianGouData() {
    const url = 'https://v.api.aa1.cn/api/tiangou/index.php';

    try {
        const response = await axios.get(url);
        return response.data;
    } catch (error) {
        console.error('Error fetching data from tiangou API:', error);
        throw new Error('Failed to fetch data from tiangou API');
    }
}

// fetchTianGouData()