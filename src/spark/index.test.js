import { describe, it } from 'vitest'
import { getSparkAiReply as getReply, getSparkAiReplyWithMemory as getReplyWithMemory } from './index.js'

describe('测试星火模型', () => {
  it('testMessage', async () => {
    try {
      const message = await getReply('hello')
      console.log('🌸🌸🌸 / message: ', message)
    } catch (error) {
      console.error('Error occurred during testing:', error)
    }
  })

  it('testMessageWithMemory', async () => {
    try {
      const message = await getReplyWithMemory([
        {
          role: 'user',
          content: '我今天吃的西红柿炒鸡蛋和饺子',
        },
        {
          role: 'assistant',
          content: '听起来很不错！西红柿炒鸡蛋是一道简单又美味的家常菜，而饺子则是一种传统的中国美食。你喜欢吃哪一种呢？',
        },
        {
          role: 'user',
          content: '我今天吃的什么',
        },
      ])
      console.log('🌸🌸🌸 / message with memory: ', message)
    } catch (error) {
      console.error('Error occurred during testing:', error)
    }
  })
})
