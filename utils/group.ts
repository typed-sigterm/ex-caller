const GROUP_PREFIX = 'group/';
/** 获取名单在 `localStorage` 中的键。 */
export const getGroupKey = (name: string) => GROUP_PREFIX + name;
/** 获取`localStorage` 中的键对应的名称。 */
export const getGroupName = (key: string) => key.slice(GROUP_PREFIX.length);

/** 获取所有名单的名称。 */
export function getStoredGroups() {
  return Object.keys(localStorage)
    .filter(v => v.startsWith(GROUP_PREFIX))
    .map(getGroupName)
    .sort();
}

export function getStoredGroup(name: string): RollCallOption[] {
  if (!hasStoredGroup(name))
    throw new Error(`Cannot find group "${name}"`);
  return JSON.parse(localStorage.getItem(getGroupKey(name))!);
}

export function setStoredGroup(name: string, value: RollCallOption[]) {
  localStorage.setItem(getGroupKey(name), JSON.stringify(value));
}

export function hasStoredGroup(name: string) {
  return localStorage.getItem(getGroupKey(name)) !== null;
}

export function removeStoredGroup(name: string) {
  localStorage.removeItem(getGroupKey(name));
}

/** 检查指定应当存在的名单，若存在问题则修复数据。 */
export function fixGroup(name: string) {
  const group = useGroupStore();
  if (!hasStoredGroup(name) || getStoredGroup(name).length === 0) // 没有则加回去
    group.add(name);
}

/** 生成新的名单名称。 */
export function generateNewGroupName() {
  const keys = getStoredGroups();
  let ret = '';
  let index = keys.length;
  do { // 避免与现有名单冲突
    ++index;
    ret = `名单 ${index}`;
  } while (keys.includes(ret));
  return ret;
}

/** 从 Excel 文件中读取名单。 */
export async function importGroupFromExcel(file: File) {
  const { read, utils } = await import('./xlsx');

  const workbook = read(await file.arrayBuffer(), { type: 'array' });
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = utils.sheet_to_json(worksheet, {
    blankrows: false,
    header: 1,
    skipHidden: true,
  }) as unknown[][];

  return (rows // 去除非字符串，去除空元素
    .filter(v => typeof v[0] === 'string') as string[][])
    .map(v => v[0].trim())
    .filter(Boolean);
}

/**
 * 导出名单到文本文件。
 * @returns 是否导出成功
 */
export async function exportGroupToText(group: string) {
  return await saveFile(
    `${group}.txt`,
    useGroupMembers(group).value!.join('\n'),
    {
      filters: [{ name: '文本文件', extensions: ['txt'] }],
    },
  );
}
