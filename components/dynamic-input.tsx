import { NDynamicInput } from 'naive-ui'

export default defineComponent({
  setup(_, { attrs, slots }) {
    const propsValue = toRef(attrs, 'value') as Ref<unknown[] | undefined>
    const displayValue: Ref<unknown[]> = ref([])

    watch(propsValue, async (v) => {
      const origin = toRaw(v) ?? []
      const legacy = displayValue.value
      for (let i = 0; i < origin.length; ++i) {
        if (origin[i] !== legacy[i]) { // 简单增量更新
          // displayValue.value[i] = propsValue.value?.[i]
          await nextFrame()
        }
      }
    }, { immediate: true, deep: true })

    return () => (
      <NDynamicInput
        {...attrs}
        v-model:value={displayValue.value}
        v-slots={slots}
      />
    )
  },
}) as typeof NDynamicInput
