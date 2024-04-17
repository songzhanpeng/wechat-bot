import axios from 'axios'
import fs from 'fs'
import yaml from 'yaml'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { exec, execFile } from 'child_process'

export async function getRedirectUrl(url, maxRedirects = 5) {
  try {
    const response = await axios.get(url, { maxRedirects: 0 })

    if (response.headers.location) {
      if (maxRedirects > 0) {
        // 如果存在重定向，并且仍有重定向次数剩余，则递归获取最终的重定向 URL
        return getRedirectUrl(response.headers.location, maxRedirects - 1)
      } else {
        // 如果达到最大重定向次数限制，则返回当前重定向的 URL
        return response.headers.location
      }
    } else {
      // 如果没有重定向，则直接返回原始 URL
      return url
    }
  } catch (error) {
    if (error.response && error.response.status === 302) {
      if (maxRedirects > 0) {
        // 如果存在重定向，并且仍有重定向次数剩余，则递归获取最终的重定向 URL
        return getRedirectUrl(error.response.headers.location, maxRedirects - 1)
      } else {
        // 如果达到最大重定向次数限制，则返回当前重定向的 URL
        return error.response.headers.location
      }
    } else {
      // 如果不是 302 状态码，则抛出错误
      throw error
    }
  }
}

export async function executeShellScript(scriptPath) {
  try {
    // 执行终端脚本
    const { stdout, stderr } = await new Promise((resolve, reject) => {
      exec(scriptPath, (error, stdout, stderr) => {
        if (error) {
          reject(`执行脚本时发生错误： ${error}`)
          return
        }
        // 返回脚本的输出和错误信息
        resolve({ stdout, stderr })
      })
    })
    console.log(`脚本输出： ${stdout}`)
    console.error(`脚本错误： ${stderr}`)
  } catch (error) {
    console.error(error)
  }
}

export function containsHtmlTags(str) {
  const regex = /<[^>]*>/
  return regex.test(str)
}

export function parseCommand(command) {
  // 使用正则表达式将字符串按空格分割
  var parts = command.split(/\s+/)

  // 如果命令至少包含一个部分
  if (parts.length > 0) {
    // 提取第一个部分作为指令
    var instruction = parts[0]
    // 剔除指令部分，返回剩余的部分作为参数
    var parameters = parts.slice(1)

    // 返回指令和参数作为对象
    return { instruction: instruction, parameters: parameters }
  } else {
    // 如果命令为空，返回空对象
    return { instruction: '', parameters: [] }
  }
}

export function parseYAMLFile(filePath) {
  try {
    // 读取 YAML 文件
    const yamlFile = fs.readFileSync(filePath, 'utf8')

    // 解析 YAML 文件内容
    const config = yaml.parse(yamlFile)

    // 返回解析后的配置
    return config
  } catch (e) {
    // 如果出现错误，返回错误信息
    return { error: e.message }
  }
}

/**
 * 获取当前文件所在的目录路径。
 * 该函数没有参数。
 * @returns {string} 返回当前文件的目录路径。
 */
export function getCurrentDirPath() {
  // 将当前模块的URL转换为文件路径
  const currentFilePath = fileURLToPath(import.meta.url)
  // 获取当前文件路径的目录部分
  const currentDirPath = dirname(currentFilePath)
  return currentDirPath
}

/**
 * 加载配置文件。
 * 该函数尝试从指定的相对路径读取配置文件（config.yaml），并解析其内容。
 * 如果解析成功，将返回配置对象；如果失败，将打印错误信息并返回 null。
 *
 * @returns {Object|null} 解析成功的配置对象，或在出现错误时返回 null。
 */
export function loadConfig() {
  try {
    // 获取当前执行目录的路径
    const currentDirPath = getCurrentDirPath()

    // 拼接配置文件的完整路径
    const configPath = join(currentDirPath, '..', '..', 'config', 'config.yaml')

    // 尝试解析 YAML 配置文件
    const config = parseYAMLFile(configPath)

    if (config.error) {
      // 如果解析过程中出现错误，打印错误信息
      console.error(`Failed to parse YAML file: ${configPath}`)
      console.error(config.error)
      return null
    } else {
      // 解析成功，打印配置信息
      console.log('Parsed configuration:')
      console.log(config)
      return config
    }
  } catch (e) {
    // 处理加载配置过程中可能发生的任何异常
    console.error('Failed to load configuration:', e)
    return null
  }
}

// const config = loadConfig();
// console.log("🚀 ~ config:", config)

/**
 * 加载指定的文件。
 * @param {string} fileUrl - 文件的URL，相对于当前执行目录。
 * @returns {string} 返回文件的内容。
 */
export function loadFile(fileUrl) {
  // 获取当前执行目录的路径
  const currentDirPath = getCurrentDirPath()
  // 拼接完整的文件路径
  const filePath = join(currentDirPath, fileUrl)
  // 读取文件内容
  const file = fs.readFileSync(filePath, 'utf8')
  return file
}

// const res = loadFile('../data/dog.json')
// console.log("🚀 ~ res:",typeof res)

/**
 * 执行Rust程序，并返回执行结果。
 * @param {string} rustExecutable - Rust可执行文件的路径。
 * @param {Array} args - 传递给Rust程序的参数数组。
 * @returns {Promise} - 返回一个Promise对象，成功时resolve包含Rust程序的标准输出，失败时reject包含错误信息。
 */
export function runRustProgram(rustExecutable, args) {
  // 创建一个新的Promise，以便异步处理Rust程序的执行
  return new Promise((resolve, reject) => {
    // 使用execFile执行Rust可执行文件，传入参数和回调函数
    execFile(rustExecutable, args, (error, stdout, stderr) => {
      // 如果执行过程中出现错误
      if (error) {
        console.error('执行 Rust 程序时出错：', error) // 打印错误信息
        reject(error) // 通过reject传递错误
        return
      }
      // 如果执行成功，通过resolve返回程序的标准输出
      resolve(stdout)
    })
  })
}

// // Rust 可执行文件路径
// const rustExecutable = '../plugin/dog/bot-plugin';

// // 连击数量
// const comboCount = 5; // 你可以根据需要设置连击的数量

// // 执行 Rust 可执行文件并传递连击数量作为参数
// runRustProgram(rustExecutable, [comboCount.toString()])
//   .then(result => {
//     console.log('Rust 程序的输出：', JSON.parse(result));
//   })
//   .catch(error => {
//     console.error('执行 Rust 程序时出错：', error);
//   });

// 提取字符串中的 URL
export function extractURL(str) {
  // 使用正则表达式匹配 URL
  const urlRegex = /(https?:\/\/[^\s，]+)/
  const match = str.match(urlRegex)

  // 如果匹配到 URL，则返回匹配到的 URL
  if (match) {
    return match[0]
  } else {
    return null // 如果没有匹配到 URL，则返回 null
  }
}

export function sleep(ms = 1000) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
