import type { RollCallOption } from '@/utils/roll-call';
import { __APP__, isPortable, writePortableData } from '@/utils/app';
import { invoke } from '@tauri-apps/api/core';
import { z } from 'zod';

export const UserConfigSchema = z.object({
  /** 待点名单名称 */
  namelist: z.string().default('名单 1'),
  /** 分组点名时，选中的分组 */
  group: z.string().optional(),
  /** 开始点名后，每个待点选项停留的时间 */
  interval: z.number().default(100),
  /** 抽取完成后是否显示彩带效果 */
  confetti: z.boolean().default(true),
  /** 计划设置 */
  plan: z.object({
    /** 是否启用计划队列 */
    enabled: z.boolean().default(false),
    /** 计划队列 */
    queue: z.array(z.string()).default([]),
  }).default({}),
});

/** 用户配置 */
export type UserConfig = z.infer<typeof UserConfigSchema>;

export const CONFIG_LOCALSTORAGE_KEY = 'config';
export const PORTABLE_DATA_FILE = './data.json';

export const MAX_NAMELIST_NAME_LENGTH = 50;
export const MAX_NAMELIST_COUNT = 100;
export const MAX_NAMELIST_MEMBER_COUNT = 10000;
export const MAX_NAMELIST_MEMBER_LENGTH = 100;
export const MAX_GROUP_NAME_LENGTH = 50;
export const MAX_GROUP_COUNT = 100;
export const MAX_GROUP_MEMBER_COUNT = 500;
export const MAX_GROUP_MEMBER_LENGTH = 100;
export const MAX_INTERVAL = 1000;
export const MIN_INTERVAL = 20;
export const MAX_PLAN_QUEUE_SIZE = 10000;

export const DEFAULT_NAMELIST_OPTIONS: RollCallOption[] = [
  'Geopedia',
  'Gino',
  'Carl',
  'Dlyro',
  'Fuli',
  'Kuzumi',
  'Guru',
  'Sultan',
  'Igallta',
  'Samuelle',
];

export async function getRawConfigSnapshot() {
  if (__APP__ && await isPortable()) // tree-shake
    return await invoke<string>('read_file', { path: PORTABLE_DATA_FILE });
  else
    return localStorage.getItem(CONFIG_LOCALSTORAGE_KEY);
}

export async function clearConfig() {
  if (__APP__ && await isPortable()) // tree-shake
    await writePortableData('{}');
  else
    localStorage.setItem(CONFIG_LOCALSTORAGE_KEY, '{}');
}
