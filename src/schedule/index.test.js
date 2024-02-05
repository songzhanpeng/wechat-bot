import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { setSchedule } from './index.js'

// 模拟函数
const mock = vi.fn(() => console.log('executed'))

describe('setSchedule function', () => {
    beforeEach(() => {
        vi.useFakeTimers() // 使用虚拟计时器
    })
    afterEach(() => {
        vi.restoreAllMocks() // 恢复所有 mock 函数
    })

    it('should execute the function once', () => {
        setSchedule('0 */30 * * * *', mock)
        vi.advanceTimersToNextTimer() // 前进时间到下一个计时器
        expect(mock).toHaveBeenCalledTimes(1) // 检查函数是否被调用了一次
    })

    it('should execute the function twice', () => {
        setSchedule('0 */30 * * * *', mock)
        vi.advanceTimersToNextTimer() // 前进时间到下一个计时器
        expect(mock).toHaveBeenCalledTimes(1) // 检查函数是否被调用了一次
        vi.advanceTimersToNextTimer() // 再次前进时间到下一个计时器
        expect(mock).toHaveBeenCalledTimes(2) // 检查函数是否被调用了两次
    })
})
