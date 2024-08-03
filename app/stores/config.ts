export const useConfigStore = defineStore('config', {
  state: () => {
    const ret = useLocalStorage<UserConfig>('config', UserConfigSchema.parse({}));
    ret.value = UserConfigSchema.parse(ret.value);
    fixGroup(ret.value.group);
    return ret;
  },
});
