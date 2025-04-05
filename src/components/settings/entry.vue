<script lang="ts" setup>
import { __APP__ } from '@/utils/app';
import { DRAWER_DEFAULT_WIDTH, DRAWER_MIN_WIDTH } from '@/utils/ui';
import { computed } from 'vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

defineOptions({
  inheritAttrs: false,
});
const props = defineProps<{
  title: string
  /** 是否只支持独立 App 环境 */
  onlyInApp?: boolean
  /**
   * 是否缓存 drawer 内容。
   *
   * 此属性非响应式。
   */
  cache?: boolean
}>();
defineSlots<{
  /** 点击后弹出的 drawer 的内容 */
  default: (props: { open: () => void, close: () => void }) => any
  icon: () => any
}>();

const { t } = useI18n({ useScope: 'local' });

const show = defineModel<boolean>('show');
// 不启用缓存，则 v-if 控制显示，内容容器始终展示（因为 v-if 会销毁内容）
// 启用缓存，则 v-show 控制显示，在第一次打开前，内容容器不渲染，此后 v-show 控制显示，不销毁
const cached = ref(props.cache); // 保留第一次的值
const loaded = ref(!cached.value);

const supported = computed(() => {
  return __APP__ || !props.onlyInApp;
});

function handleOpen() {
  loaded.value = show.value = true;
}
</script>

<template>
  <NTooltip :disabled="supported">
    {{ t('unsupported') }}
    <template #trigger>
      <NCard
        class="card"
        :class="[!supported && 'unsupported']"
        @click="handleOpen"
      >
        <slot name="icon" />
        <span class="ml-1">{{ title }}</span>
        <ILucideArrowRight
          v-if="supported"
          class="absolute right-3"
          :size="20"
        />
      </NCard>
    </template>
  </NTooltip>

  <NDrawer
    v-if="supported"
    v-bind="$attrs"
    v-model:show="show"
    :display-directive="cached ? 'show' : 'if'"
    :default-width="DRAWER_DEFAULT_WIDTH"
    :min-width="DRAWER_MIN_WIDTH"
    resizable
  >
    <NDrawerContent v-if="loaded" closable>
      <slot :open="handleOpen" :close="() => show = false" />
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
    align-items: center;
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
  unsupported:
    Due to technical limitations,
    please download the App to experience this feature

zh-CN:
  unsupported: 由于技术限制，请下载 App 体验此功能
</i18n>
