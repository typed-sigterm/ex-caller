import { save } from '@tauri-apps/api/dialog'
import { writeFile } from '@tauri-apps/api/fs'
import { desktopDir } from '@tauri-apps/api/path'
import type { RollCallOption } from './roll-call'

export const DEFAULT_GROUP_OPTIONS: RollCallOption[] = ['弭儿', '艾达', 'Kouma', '鸠', '伯尼斯', 'Branda', 'Dlyro', '艾尔帕克', 'Fuli', '阿爽', 'Lily', 'Carl', '克洛诺斯', 'Findstr', 'Theo', '久住', '尊师古卢', '萨芙', '帕拉斯', '门图', 'Igallta', 'Gino', 'Sultan']

const GROUP_PREFIX = 'group/'
/** 获取名单在 `localStorage` 中的键。 */
export const getGroupKey = (name: string) => GROUP_PREFIX + name
/** 获取`localStorage` 中的键对应的名称。 */
export const getGroupName = (key: string) => key.slice(GROUP_PREFIX.length)

/** 获取所有名单的名称。 */
export function getGroups() {
  const ret: string[] = []
  for (let i = 1; i <= localStorage.length; ++i) {
    const key = localStorage.key(i)
    if (key?.startsWith(GROUP_PREFIX))
      ret.push(getGroupName(key))
  }
  return ret
}

/** 判断名单是否存在。 */
export function hasGroup(name: string) {
  return localStorage.getItem(getGroupKey(name)) !== null
}

/** 重命名名单。 */
export function renameGroup(from: string, to: string) {
  const origin = useGroup(from)
  useGroup(to).value = origin.value
  origin.value = null
}

/** 生成新的名单名称。 */
export function generateNewGroupName() {
  const keys = getGroups()
  let ret = ''
  let index = keys.length
  do { // 避免与现有名单冲突
    ++index
    ret = `名单 ${index}`
  } while (keys.includes(ret))
  return ret
}

/** 从 Excel 文件中读取名单。 */
export async function importGroupFromExcel(file: File) {
  const { read, utils } = await import('./xlsx')

  const workbook = read(await file.arrayBuffer(), { type: 'array' })
  const worksheet = workbook.Sheets[workbook.SheetNames[0]]
  const rows = utils.sheet_to_json(worksheet, {
    blankrows: false,
    header: 1,
    skipHidden: true,
  }) as unknown[][]

  return (rows // 去除非字符串，去除空元素
    .filter(v => typeof v[0] === 'string') as string[][])
    .map(v => v[0].trim())
    .filter(Boolean)
}

/** 导出名单到文本文件。 */
export async function exportGroupToText(group: string) {
  const filename = `${group}.txt`
  const text = useGroup(group).value.join('\n')

  if (__ENV__ === Env.App) { // 独立 app 环境，使用 Tauri API
    const path = await save({
      defaultPath: await desktopDir() + filename, // 默认保存到桌面
      filters: [
        { name: '文本文件', extensions: ['txt'] },
        { name: '所有文件', extensions: ['*'] },
      ],
    })
    if (!path)
      return
    await writeFile(path, text)
  }
  else { // 浏览器环境，利用 a 标签
    const blob = new Blob([text], { type: 'text/plain; charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const el = document.createElement('a')
    el.href = url
    el.download = filename
    el.click()
    URL.revokeObjectURL(url)
  }
}
