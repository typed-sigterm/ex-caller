import { useThemeStore } from '@/stores/theme';
import { DEFAULT_MIME_TYPE } from '@/utils/app';
import { getDataDir, loadLocalFile } from '@/utils/fs';

export const RESOURCES = ['background', 'backgroundRolling'] as const;
export type ResourceName
  = typeof RESOURCES extends readonly (infer T)[] ? T : never;

export async function getThemeResource(name: ResourceName) {
  const properties = useThemeStore().properties;
  const mimeType = name === 'backgroundRolling'
    ? properties.backgroundRolling?.mimeType
    : properties.background?.mimeType;
  return await loadLocalFile(
    `theme/${name}`,
    await getDataDir(),
    { type: mimeType ?? DEFAULT_MIME_TYPE },
  );
}
