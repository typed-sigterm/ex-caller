export const RESOURCES = ['background', 'backgroundRolling'] as const;
export type ResourceName
  = typeof RESOURCES extends readonly (infer T)[] ? T : never;

export async function getThemeResource(name: ResourceName) {
  return await loadLocalFile(
    `theme/${name}`,
    await getDataDir(),
    { type: useThemeStore().properties.backgroundRolling.mimeType },
  );
}
