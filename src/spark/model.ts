import crypto from 'crypto';
import querystring from 'querystring';

class Spark {
  private readonly host: string;

  constructor(
    private readonly appId: string,
    private readonly apiKey: string,
    private readonly apiSecret: string,
    private readonly domain: string,
    private readonly version: string
  ) {
    this.host = 'spark-api.xf-yun.com';
  }

  async generateAuthorization(date: string, path: string): Promise<string> {
    const requestLine = `GET ${path} HTTP/1.1`;
    const tmp = `host: ${this.host}\ndate: ${date}\n${requestLine}`;

    const hmac = crypto.createHmac('sha256', this.apiSecret);
    hmac.update(tmp);

    const signature = hmac.digest('base64');
    const authorizationOrigin = `api_key="${this.apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signature}"`;

    return Buffer.from(authorizationOrigin).toString('base64');
  }

  async generateAuthParams(path: string): Promise<{ authorization: string; date: string; host: string }> {
    const date = new Date().toUTCString();
    const authorization = await this.generateAuthorization(date, path);

    return {
      authorization,
      date,
      host: this.host,
    };
  }

  async generateFinalUrl(): Promise<string> {
    const authParams = await this.generateAuthParams(`/v${this.version}.1/chat`);
    const queryString = querystring.stringify(authParams);

    return `wss://${this.host}/v${this.version}.1/chat?${queryString}`;
  }
}

export default Spark;
