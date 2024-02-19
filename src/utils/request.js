import axios from 'axios'

export class HttpClient {
  constructor(baseURL) {
    this.client = axios.create({
      baseURL,
      timeout: 5000, // 设置超时时间为 5 秒
    })
  }

  async get(url, params) {
    try {
      const response = await this.client.get(url, { params })
      return response.data
    } catch (error) {
      console.error('Error in GET request:', error)
      throw error
    }
  }

  async post(url, data) {
    try {
      const response = await this.client.post(url, data)
      return response.data
    } catch (error) {
      console.error('Error in POST request:', error)
      throw error
    }
  }

  // 可以根据需要添加其他 HTTP 方法的封装，比如 put、delete 等
}
