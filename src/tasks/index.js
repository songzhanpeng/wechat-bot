import cron from 'node-cron';

// 执行定时任务
export const scheduleDailyMessage = (bot) => {
    cron.schedule('0 8 * * *', async () => {
        const contact = await bot.Room.find({ id: '@@659e1ec63bba8f845011c616b62499ea7abb703297a0069047c3a685775bf92c' }); // 房间id
        if (contact) {
            await contact.say('每天8点发送的消息');
        } else {
            console.log('未找到指定好友');
        }
    }, {
        timezone: 'Asia/Shanghai' // 设置时区，以确保在正确的时间执行
    });
}