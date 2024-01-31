import axios from 'axios'
import { getRedirectUrl } from '../utils/index.js'

async function fetchData(url, params = {}) {
    try {
        const response = await axios.get(url, { params });
        return response.data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

// 获取摸鱼人日历
export async function fetchMoyuData() {
    const url = 'https://api.j4u.ink/v1/store/other/proxy/remote/moyu.json';
    try {
        const data = await fetchData(url);
        if (data.code === 200) {
            return await getRedirectUrl(data.data.moyu_url);
        } else {
            console.error('Error fetching Moyu data:', data.message);
            return null;
        }
    } catch (error) {
        console.error('Error fetching Moyu data:', error);
        return null;
    }
}
