import dotenv from 'dotenv'
import WebSocket from 'ws'
import Spark from './model.js'

const env = dotenv.config().parsed // 环境参数

export async function getSparkAiReply(prompt) {
    try {
        console.log(`收到的消息: ${prompt}`);

        // 初始化 Spark 实例
        const spark = new Spark(env.appId, env.apiKey, env.apiSecret, env.domain, env.version);
        let finalUrl = await spark.generateFinalUrl();

        // 创建 WebSocket 连接
        const sparkMsg = new WebSocket(finalUrl);

        // 定义请求负载
        let requestPayload = {
            header: {
                app_id: env.appId,
                uid: '123'
            },
            parameter: {
                chat: {
                    domain: env.domain,
                    temperature: 0.5,
                    max_tokens: 1024
                }
            },
            payload: {
                message: {
                    text: [
                        { role: 'user', content: prompt }
                    ]
                }
            }
        };

        sparkMsg.on('open', () => {
            // WebSocket 连接打开时发送请求负载
            sparkMsg.send(JSON.stringify(requestPayload));
        });

        let completeMessage = '';
        let ai_msg;

        return new Promise((resolve, reject) => {
            sparkMsg.on('message', async (data) => {
                const partialMessage = JSON.parse(data);

                if (partialMessage.payload.usage) {
                    let myArray = partialMessage.payload.choices.text;
                    completeMessage += myArray[0].content;
                    console.log('AI的消息:', JSON.stringify(completeMessage));
                    ai_msg = completeMessage;
                    completeMessage = '';
                    // 解析完整的 AI 消息并将其作为 Promise 的 resolve 值返回
                    resolve(ai_msg);
                } else {
                    let myArray = partialMessage.payload.choices.text;
                    completeMessage += myArray[0].content;
                }
            });

            sparkMsg.on('error', (error) => {
                // WebSocket 连接发生错误时将错误作为 Promise 的 reject 值返回
                reject(error);
            });
        });
    } catch (error) {
        console.error('处理消息时出错:', error);
        // 如果发生错误，将错误作为 Promise 的 reject 值返回
        throw error;
    }
}
