import xlsx from 'xlsx'
import type { RollCallOption } from './roll-call'

export const DEFAULT_GROUP_OPTIONS: RollCallOption[] = ['弭儿', '艾达', 'Kouma', '鸠', '伯尼斯', 'Branda', 'Dlyro', '艾尔帕克', 'Fuli', '阿爽', 'Lily', 'Carl', '克洛诺斯', 'Findstr', 'Theo', '久住', '尊师古卢', '萨芙', '帕拉斯', '门图', 'Igallta', 'Gino', 'Sultan']

const GROUP_PREFIX = 'group/'
/** 获取名单在 `localStorage` 中的键。 */
const getGroupKey = (name: string) => GROUP_PREFIX + name
/** 获取`localStorage` 中的键对应的名称。 */
const getGroupName = (key: string) => key.slice(GROUP_PREFIX.length)

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

/** 获取名单的选项。 */
export function getGroupOptions(name: string): RollCallOption[] {
  const key = getGroupKey(name)
  const ret = localStorage.getItem(key)
  if (ret === null) { // 查找一个不存在的名单
    setGroupOptions(name, DEFAULT_GROUP_OPTIONS) // 则创建默认名单
    return DEFAULT_GROUP_OPTIONS
  }
  return JSON.parse(ret)
}

/** 设置名单的选项。 */
export function setGroupOptions(name: string, options: RollCallOption[]) {
  localStorage.setItem(getGroupKey(name), JSON.stringify(options))
}

/** 判断名单是否存在。 */
export function hasGroup(name: string) {
  return localStorage.getItem(getGroupKey(name)) !== null
}

/** 删除名单。 */
export function deleteGroup(name: string) {
  return localStorage.removeItem(getGroupKey(name))
}

/** 重命名名单。 */
export function renameGroup(from: string, to: string) {
  setGroupOptions(to, getGroupOptions(from))
  deleteGroup(from)
}

/** 生成新的名单名称。 */
export function generateNewGroupName() {
  const keys = getGroups()
  let ret = ''
  let index = keys.length
  do {
    ++index
    ret = `名单 ${index}`
  } while (keys.includes(ret))
  return ret
}

/** 从 Excel 文件中读取名单。 */
export async function importGroupFromExcel(file: File) {
  const workbook = xlsx.read(await file.arrayBuffer(), { type: 'array' })
  const worksheet = workbook.Sheets[workbook.SheetNames[0]]
  const rows = xlsx.utils.sheet_to_json(worksheet, {
    blankrows: false,
    header: 1,
    skipHidden: true,
  }) as unknown[][]
  return (rows // 去除非字符串，去除空元素
    .filter(v => typeof v[0] === 'string') as string[][])
    .map(v => v[0].trim())
    .filter(Boolean)
}
