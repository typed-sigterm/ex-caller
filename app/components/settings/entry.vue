<script lang="ts" setup>
const props = defineProps<{
  title: string
  /** 是否只支持独立 App 环境 */
  onlyInApp?: boolean
  /** 点击后弹出的 drawer 的附加属性 */
  drawerAttrs?: any
}>();
defineSlots<{
  /** 点击后弹出的 drawer 的内容 */
  default: (props: { open: () => void, close: () => void }) => any
  icon: () => any
}>();

const { t } = useI18n({ useScope: 'local' });

const show = defineModel<boolean>('show');

const supported = computed(() => {
  return __APP__ || !props.onlyInApp;
});
</script>

<template>
  <NTooltip :disabled="supported">
    {{ t('unsupported') }}
    <template #trigger>
      <NCard
        class="card"
        :class="[!supported && 'unsupported']"
        @click="show = true"
      >
        <slot name="icon" />
        <span class="ml-1">{{ title }}</span>
        <LucideArrowRight v-if="supported" class="absolute right-3" :size="20" />
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
    cursor: not-allowed;
  }

  > .n-card__content {
    display: flex;
    padding: 12px;
  }
}

.card:hover {
  box-shadow: 0 0 4px 2px var(--n-border-color);
  transition: box-shadow .2s;
}
</style>

<i18n lang="yaml">
en:
  unsupported: Due to technical limitations, please download the App to experience this feature

zh-CN:
  unsupported: 由于技术限制，请下载 App 体验此功能
</i18n>
