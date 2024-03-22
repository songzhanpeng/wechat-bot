import dotenv from 'dotenv';
import WebSocket from 'ws';
import Spark from './model.js';

const env = dotenv.config().parsed;

async function sendRequestToSpark(requestPayload) {
    console.log("🚀 ~ sendRequestToSpark ~ requestPayload:", requestPayload)
    try {
        const spark = new Spark(env.APP_ID, env.API_KEY, env.API_SECRET, env.DOMAIN, env.VERSION);
        let finalUrl = await spark.generateFinalUrl();
        const sparkMsg = new WebSocket(finalUrl);

        sparkMsg.on('open', () => {
            sparkMsg.send(JSON.stringify(requestPayload));
        });

        let completeMessage = '';
        let ai_msg;

        return new Promise((resolve, reject) => {
            sparkMsg.on('message', async (data) => {
                const partialMessage = JSON.parse(data);

                switch (partialMessage.header.code) {
                    // 异常case
                    case 10013: {
                        resolve(partialMessage.header.message)
                        break;
                    }
                    default: {
                        if (partialMessage.payload.usage) {
                            let myArray = partialMessage.payload.choices.text;
                            completeMessage += myArray[0].content;
                            console.log('AI的消息:', JSON.stringify(completeMessage));
                            ai_msg = completeMessage;
                            completeMessage = '';
                            resolve(ai_msg);
                        } else {
                            let myArray = partialMessage.payload.choices.text;
                            completeMessage += myArray[0].content;
                        }
                        break;
                    }
                }
            });

            sparkMsg.on('error', (error) => {
                reject(error);
            });
        });
    } catch (error) {
        console.error('处理消息时出错:', error);
        throw error;
    }
}

export async function getSparkAiReply(prompt) {
    console.log(`收到的消息: ${prompt}`);

    let requestPayload = {
        header: {
            app_id: env.APP_ID,
            uid: '123'
        },
        parameter: {
            chat: {
                domain: env.DOMAIN,
                temperature: 0.5,
                max_tokens: 1024
            }
        },
        payload: {
            message: {
                text: [{ role: 'user', content: prompt }]
            }
        }
    };

    return sendRequestToSpark(requestPayload);
}

export async function getSparkAiReplyWithMemory(prompts) {
    console.log(`收到的消息: ${JSON.stringify(prompts)}`);

    let requestPayload = {
        header: {
            app_id: env.APP_ID,
            uid: '123'
        },
        parameter: {
            chat: {
                domain: env.DOMAIN,
                temperature: 0.5,
                max_tokens: 1024
            }
        },
        payload: {
            message: {
                text: prompts
            }
        }
    };

    return sendRequestToSpark(requestPayload);
}