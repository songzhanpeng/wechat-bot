import axios from "axios";
import crypto from "crypto";
import fs from "fs";

class AssembleHeaderException extends Error {
  constructor(msg) {
    super(msg);
    this.message = msg;
  }
}

class Url {
  constructor(host, path, schema) {
    this.host = host;
    this.path = path;
    this.schema = schema;
  }
}

// Calculate sha256 and encode to base64
function sha256base64(data) {
  const hash = crypto.createHash("sha256").update(data).digest("base64");
  return hash;
}

function parseUrl(requestUrl) {
  const stIdx = requestUrl.indexOf("://");
  const host = requestUrl.substring(stIdx + 3);
  const schema = requestUrl.substring(0, stIdx + 3);
  const edIdx = host.indexOf("/");
  if (edIdx <= 0) {
    throw new AssembleHeaderException("Invalid request URL: " + requestUrl);
  }
  const path = host.substring(edIdx);
  const hostWithoutPath = host.substring(0, edIdx);
  return new Url(hostWithoutPath, path, schema);
}

// Generate authentication URL
function assembleWsAuthUrl(
  requestUrl,
  method = "GET",
  apiKey = "",
  apiSecret = ""
) {
  const urlObject = parseUrl(requestUrl);
  const host = urlObject.host;
  const path = urlObject.path;
  const now = new Date().toUTCString();

  const signatureOrigin = `host: ${host}\ndate: ${now}\n${method} ${path} HTTP/1.1`;
  const signatureSha = crypto
    .createHmac("sha256", apiSecret)
    .update(signatureOrigin)
    .digest("base64");

  const authorizationOrigin = `api_key="${apiKey}", algorithm="hmac-sha256", headers="host date request-line", signature="${signatureSha}"`;
  const authorization = Buffer.from(authorizationOrigin).toString("base64");

  const queryParams = {
    host: host,
    date: now,
    authorization: authorization,
  };

  return `${requestUrl}?${new URLSearchParams(queryParams)}`;
}

// Generate request body
function getBody(appId, text) {
  return {
    header: {
      app_id: appId,
      uid: "123456789",
    },
    parameter: {
      chat: {
        domain: "general",
        temperature: 0.5,
        max_tokens: 4096,
      },
    },
    payload: {
      message: {
        text: [
          {
            role: "user",
            content: text,
          },
        ],
      },
    },
  };
}

// Send request and return result
export async function createSpackPicture(text, appId, apiKey, apiSecret) {
  const host = "http://spark-api.cn-huabei-1.xf-yun.com/v2.1/tti";
  const url = assembleWsAuthUrl(host, "POST", apiKey, apiSecret);
  const content = getBody(appId, text);

  try {
    const response = await axios.post(url, content, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
}

// Convert base64 image data to image and save locally
function base64ToImage(base64Data, imageName, savePath) {
  try {
    const imgData = Buffer.from(base64Data, "base64");
    if (!fs.existsSync(savePath)) {
      fs.mkdirSync(savePath, { recursive: true }); // 创建保存路径
    }
    fs.accessSync(savePath, fs.constants.W_OK); // 检查写入权限
    fs.writeFileSync(`${savePath}/${imageName}.jpg`, imgData);
    console.log("Image saved at:", `${savePath}/${imageName}.jpg`);
    return `${savePath}/${imageName}.jpg`;
  } catch (error) {
    console.error("Error saving image:", error);
    return null; // 返回 null 表示生成失败
  }
}

// Parse and save to specified location
export function parseMessage(message) {
  const data = message;
  const code = data.header.code;
  if (code !== 0) {
    console.error(`Request error: ${code}, ${data}`);
    return null; // 返回 null 表示生成失败
  } else {
    const text = data.payload.choices.text;
    const imageContent = text[0];
    const imageBase = imageContent.content;
    const imageName = data.header.sid;
    const savePath = "../assets"; // 设置图片保存路径
    const imagePath = base64ToImage(imageBase, imageName, savePath);
    if (imagePath) {
      return imagePath;
    } else {
      console.error("Failed to generate image.");
      return null; // 返回 null 表示生成失败
    }
  }
}

// Configuration
const APPID = "e1b6d57c";
const APISecret = "YjdlMzFlZDMzNzg2NTUzZWJmODlhOGM1";
const APIKEY = "98cf7f008c096f36c593b7765497e525";
const description =
  "飞龙";

// Main execution
(async () => {
  const response = await createSpackPicture(description, APPID, APIKEY, APISecret);
  if (response) {
    parseMessage(response);
  }
})();
