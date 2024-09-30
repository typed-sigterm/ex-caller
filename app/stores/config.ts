export const useConfigStore = defineStore('config', {
  state: () => {
    const ret
      = useLocalStorage<UserConfig>('config', UserConfigSchema.parse({}));
    ret.value = UserConfigSchema.parse(ret.value);
    fixNamelist(ret.value.namelist);
    return ret;
  },
});
