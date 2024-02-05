/** 获取待点选项的值。 */
function optionToString(option: RollCallOption) {
  return typeof option === 'string' ? option : option.value
}

/**
 * 点名。
 *
 * 默认暂停，需要调用返回值的 `.value.resume()` 来开始。
 */
export default (config: RollCallConfig): Ref<RollCallController> => {
  const { options, duration, defaultIndex = 0, defaultValue } = config

  const currentIndex = ref<number | undefined>(defaultIndex)
  const currentValue = ref<string | undefined>(defaultValue)
  const currentDuration = ref(duration)

  const next = () => {
    let i = (currentIndex.value ?? -1) + 1 // 若未开始，下一个为第一个，即下标 -1+1
    if (i >= options.length) // 越界
      i = 0
    const incoming = options[i]
    currentValue.value = optionToString(incoming)
    currentIndex.value = i

    if (typeof incoming === 'string') { // 选项未覆盖 duration
      currentDuration.value = config.duration
    }
    else if (incoming.duration !== config.duration) { // 选项覆盖了 duration
      currentDuration.value = incoming.duration
    }
  }

  const { pause, resume, isActive } = useIntervalFn(next, duration)
  pause()
  const start = () => {
    if (isActive.value)
      return
    next()
    resume()
  }
  const reset = () => {
    pause()
    currentValue.value = currentIndex.value = undefined
  }

  return ref({ currentValue, currentIndex, next, pause, start, isActive, reset })
}
