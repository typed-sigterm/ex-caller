export const useConfigStore = defineStore(CONFIG_LOCALSTORAGE_KEY, {
  state: () => {
    const ret
      = useLocalStorage<UserConfig>(CONFIG_LOCALSTORAGE_KEY, UserConfigSchema.parse({}));
    ret.value = UserConfigSchema.parse(ret.value);
    fixNamelist(ret.value.namelist);
    return ret;
  },
  actions: {
    reset(to: unknown) {
      this.$patch(UserConfigSchema.parse(to));
    },
  },
});
