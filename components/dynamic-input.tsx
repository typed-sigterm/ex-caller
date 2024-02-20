import { NDynamicInput } from 'naive-ui'

export default defineComponent({
  inheritAttrs: false,
  setup(_, { attrs, emit, slots }) {
    const propsValue = toRef(attrs, 'value') as Ref<unknown[] | undefined>
    const displayValue: Ref<unknown[]> = ref([])

    watch(propsValue, async (v) => {
      const origin = toRaw(v) ?? []
      const legacy = displayValue.value
      for (let i = 0; i < origin.length; ++i) {
        if (origin[i] !== legacy[i]) { // 简单增量更新
          displayValue.value[i] = propsValue.value?.[i]
          await nextFrame()
        }
      }
      if (origin.length < legacy.length) // 选项变少
        displayValue.value.splice(origin.length)
    }, { immediate: true, deep: true })

    const handleEdit = () => {
      emit('update:value', displayValue.value)
    }

    return () => (
      <NDynamicInput
        {...attrs}
        v-model:value={displayValue.value}
        v-slots={slots}
        onUpdate:value={handleEdit}
      />
    )
  },
}) as typeof NDynamicInput
