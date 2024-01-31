import fs from 'fs'
// 读取 JSON 文件内容
export function readTasks() {
    if (fs.existsSync('./tasks.json')) {
        const data = fs.readFileSync('./tasks.json');
        return JSON.parse(data);
    } else {
        return [];
    }
}

// 写入 JSON 文件内容
export function writeTasks(tasks) {
    fs.writeFileSync('./tasks.json', JSON.stringify(tasks, null, 2));
}

// 添加任务
export function addTask(task) {
    const tasks = readTasks();
    tasks.push(task);
    writeTasks(tasks);
}

// 修改任务
export function updateTask(id, updatedTask) {
    const tasks = readTasks();
    const updatedTasks = tasks.map(task => {
        if (task.id === id) {
            return { ...task, ...updatedTask };
        } else {
            return task;
        }
    });
    writeTasks(updatedTasks);
}

// 示例任务对象
const sampleTask = {
    id: 1,
    description: 'Sample task',
    completed: false,
    completionTime: '2024-01-29',
    creator: 'Creator Name',
    targetUser: 'Target User',
    roomId: 'Room ID'
};

// 添加示例任务
addTask(sampleTask);

// 更新示例任务的描述、状态、完成时间、创建者、目标人、房间ID
updateTask(1, {
    description: 'Updated task description',
    completed: true,
    completionTime: '2024-01-30',
    creator: 'Updated Creator Name',
    targetUser: 'Updated Target User',
    roomId: 'Updated Room ID'
});
