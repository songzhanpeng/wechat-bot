import { getSparkAiReply as getReply } from '../spark/index.js'

// 测试 open ai api
async function testMessage() {
  const message = await getReply("hello")
  console.log('🌸🌸🌸 / message: ', message)
}

testMessage()