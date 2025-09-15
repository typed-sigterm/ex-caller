import type { RollCallOption } from '@/utils/roll-call';
import { computed } from 'vue';
import { useNamelistStore } from '@/stores/namelist';
import { saveFile } from '@/utils/fs';
import { rollCallOptionToString } from '@/utils/roll-call';
import { getGlobalI18n } from '@/utils/ui';

const NAMELIST_KEY_PREFIX = 'namelist';

/** 获取名单在 `localStorage` 中的键。 */
export const toKey = (name: string) => `${NAMELIST_KEY_PREFIX}/${name}`;

/** 获取所有名单的名称。 */
export function listNamelists() {
  const prefix = `${NAMELIST_KEY_PREFIX}/`;
  return Object.keys(localStorage)
    .filter(v => v.startsWith(prefix))
    .map(v => v.slice(prefix.length))
    .sort();
}

export function getNamelist(name: string): RollCallOption[] {
  if (!hasNamelist(name))
    throw new Error(`Cannot find namelist "${name}"`);
  return JSON.parse(localStorage.getItem(toKey(name))!);
}

export function setNamelist(name: string, value: RollCallOption[]) {
  localStorage.setItem(toKey(name), JSON.stringify(value));
}

export function hasNamelist(name: string) {
  return localStorage.getItem(toKey(name)) !== null;
}

export function removeNamelist(name: string) {
  localStorage.removeItem(toKey(name));
}

/** 检查指定应当存在的名单，若存在问题则修复数据。 */
export function fixNamelist(name: string) {
  const namelist = useNamelistStore();
  if (!hasNamelist(name) || getNamelist(name).length === 0) // 没有则加回去
    namelist.add(name);
}

/** 生成新的名单名称。 */
export function genNewNamelistName() {
  const { t } = getGlobalI18n();
  const keys = listNamelists();
  let ret = '';
  let index = keys.length;
  do { // 避免与现有名单冲突
    ++index;
    ret = t('namelist-n', [index]);
  } while (keys.includes(ret));
  return ret;
}

/**
 * 导出名单到文本文件。
 * @returns 是否导出成功
 */
export async function exportNamelistToText(namelist: string) {
  return await saveFile(
    `${namelist}.txt`,
    useNamelistMembers(namelist).value!.join('\n'),
    {
      filters: [{ name: '文本文件', extensions: ['txt'] }],
    },
  );
}

export function useNamelistMembers(name: string) {
  return computed(
    () => useNamelistStore().use(name).names.map(rollCallOptionToString),
  );
};
