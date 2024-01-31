import axios from 'axios';

export async function getRedirectUrl(url, maxRedirects = 5) {
  try {
    const response = await axios.get(url, { maxRedirects: 0 });

    if (response.headers.location) {
      if (maxRedirects > 0) {
        // 如果存在重定向，并且仍有重定向次数剩余，则递归获取最终的重定向 URL
        return getRedirectUrl(response.headers.location, maxRedirects - 1);
      } else {
        // 如果达到最大重定向次数限制，则返回当前重定向的 URL
        return response.headers.location;
      }
    } else {
      // 如果没有重定向，则直接返回原始 URL
      return url;
    }
  } catch (error) {
    if (error.response && error.response.status === 302) {
      if (maxRedirects > 0) {
        // 如果存在重定向，并且仍有重定向次数剩余，则递归获取最终的重定向 URL
        return getRedirectUrl(error.response.headers.location, maxRedirects - 1);
      } else {
        // 如果达到最大重定向次数限制，则返回当前重定向的 URL
        return error.response.headers.location;
      }
    } else {
      // 如果不是 302 状态码，则抛出错误
      throw error;
    }
  }
}