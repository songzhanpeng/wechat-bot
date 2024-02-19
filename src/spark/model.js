import crypto from 'crypto';
import querystring from 'querystring';

class Spark {
  constructor(appId, apiKey, apiSecret, domain, version) {
    this.appId = appId;
    this.apiKey = apiKey;
    this.apiSecret = apiSecret;
    this.domain = domain;
    this.version = version;
    this.host = 'spark-api.xf-yun.com';
  }

  async generateAuthorization(date, path) {
    const requestLine = `GET ${path} HTTP/1.1`;
    const tmp = `host: ${this.host}\ndate: ${date}\n${requestLine}`;

    const hmac = crypto.createHmac('sha256', this.apiSecret);
    hmac.update(tmp);

    const signature = hmac.digest('base64');
    const authorizationOrigin = `api_key="${this.apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`;

    return Buffer.from(authorizationOrigin).toString('base64');
  }

  async generateAuthParams(path) {
    const date = new Date().toUTCString();
    const authorization = await this.generateAuthorization(date, path);

    return {
      authorization,
      date,
      host: this.host,
    };
  }

  async generateFinalUrl() {
    const authParams = await this.generateAuthParams(`/${this.version}/chat`);
    const queryString = querystring.stringify(authParams);

    return `wss://${this.host}/${this.version}/chat?${queryString}`;
  }
}

export default Spark;