const currentUserConfig = useLocalStorage<UserConfig>(
  'config',
  structuredClone(DEFAULT_USER_CONFIG), // 深拷贝，防止修改 DEFAULT_USER_CONFIG
)
getGroupOptions(currentUserConfig.value.group) // 处理名单不存在的情况

/** 用户配置。 */
export default () => currentUserConfig
