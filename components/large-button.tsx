import { NButton } from 'naive-ui'

export default defineComponent({
  name: 'LargeButton',
  setup(_, { slots }) {
    return () => (
      <NButton class="w-16 h-16" round v-slots={slots} />
    )
  },
}) as typeof NButton
