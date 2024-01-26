import { getSparkAiReply as getReply, getSparkAiReplyWithMemory as getReplyWithMemory } from '../spark/index.js';

// 测试 open ai api
async function testMessage() {
  try {
    const message = await getReply("hello");
    console.log('🌸🌸🌸 / message: ', message);
  } catch (error) {
    console.error('Error occurred during testing:', error);
  }
}

// 测试带有记忆功能的 open ai api
async function testMessageWithMemory() {
  try {
    const message = await getReplyWithMemory([{
      "role": "user",
      "content": "我今天吃的西红柿炒鸡蛋和饺子"
    },
    {
      "role": "assistant",
      "content": "听起来很不错！西红柿炒鸡蛋是一道简单又美味的家常菜，而饺子则是一种传统的中国美食。你喜欢吃哪一种呢？"
    },
    {
      "role": "user",
      "content": "我今天吃的什么"
    }]);
    console.log('🌸🌸🌸 / message with memory: ', message);
  } catch (error) {
    console.error('Error occurred during testing:', error);
  }
}

// 单元测试
async function runTests() {
  try {
    // 测试 open ai api
    await testMessage();

    // 测试带有记忆功能的 open ai api
    await testMessageWithMemory();
  } catch (error) {
    console.error('Error occurred during testing:', error);
  }
}

runTests();
