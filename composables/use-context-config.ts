export default () => {
  const ret = inject<Ref<UserConfig>>(CONTEXT_CONFIG_KEY)
  if (!ret?.value)
    throw createError('No config provided')
  return ret
}
