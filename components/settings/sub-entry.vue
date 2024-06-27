<script lang="ts" setup>
import IconRight from '~icons/ep/right'
import IconLock from '~icons/ep/lock'

const props = defineProps<{
  title: string
  /** 是否只支持独立 App 环境 */
  onlyInApp?: boolean
  /** 点击后弹出的 drawer 的附加属性 */
  drawerAttrs?: any
}>()
defineSlots<{
  /** 点击后弹出的 drawer 的内容 */
  default: (props: { open: () => void, close: () => void }) => any
  icon: () => any
}>()

const show = defineModel<boolean>('show')

const supported = computed(() => {
  return __APP__ || !props.onlyInApp
})
</script>

<template>
  <NTooltip :disabled="supported">
    由于技术限制，请下载 App 体验此功能
    <template #trigger>
      <NCard
        class="card"
        :class="[!supported && 'unsupported']"
        @click="show = true"
      >
        <NIcon class="mr-1" :size="18">
          <slot name="icon" />
        </NIcon>
        {{ title }}
        <NIcon class="absolute right-3" :size="20">
          <IconRight v-if="supported" />
          <IconLock v-else />
        </NIcon>
      </NCard>
    </template>
  </NTooltip>

  <NDrawer
    v-if="supported"
    v-bind="drawerAttrs"
    v-model:show="show"
    :default-width="DRAWER_DEFAULT_WIDTH"
    :min-width="DRAWER_MIN_WIDTH"
    resizable
  >
    <NDrawerContent closable>
      <slot :open="() => show = true" :close="() => show = false" />
      <template #header>
        {{ title }}
      </template>
    </NDrawerContent>
  </NDrawer>
</template>

<style lang="postcss" scoped>
.card:deep() {
  cursor: pointer;
  margin-bottom: 8px;
  transition: box-shadow .5s;

  &.unsupported {
    color: #98999b;
  }

  &:hover {
    box-shadow: 0 0 4px 2px var(--n-border-color);
    transition: box-shadow .2s;

    &.unsupported {
      cursor: not-allowed;
      box-shadow: none;
    }
  }

  > .n-card__content {
    display: flex;
    padding: 12px;
  }
}
</style>
