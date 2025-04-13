<script setup lang="ts">
import type { SelectOption } from 'naive-ui';
import DynamicInput from '@/components/dynamic-input';
import { useConfigStore } from '@/stores/config';
import { useNamelistStore } from '@/stores/namelist';
import { MAX_GROUP_NAME_LENGTH } from '@/utils/config';
import useNamelistMembers from '@/utils/namelist';
import { useMessage } from 'naive-ui';
import { computed, ref, toRaw, watch } from 'vue';
import { useI18n } from 'vue-i18n';
import { NEW_GROUP } from '../namelist/group-selector.vue';

const { t } = useI18n({ useScope: 'local' });
const message = useMessage();
const config = useConfigStore();
const namelist = useNamelistStore();

const currentNamelist = computed(() => namelist.use(config.namelist));

const enable = ref(!!config.group);
watch(enable, v => !v && (config.group = undefined));
const groups = computed(() => currentNamelist.value.groups.list());

const editing = ref(false);
const editingGroup = ref<string>('');
const editingGroupMembers = ref<string[]>([]);
const renameTo = ref<string | undefined>();

const candidates = computed((): SelectOption[] => {
  return useNamelistMembers(config.namelist).value.map(v => ({
    value: v,
    label: v,
    disabled: editingGroupMembers.value.includes(v),
  }));
});

function openEdit(group: string) {
  editing.value = true;
  editingGroup.value = group;
  editingGroupMembers.value = structuredClone(toRaw(
    currentNamelist.value.groups.use(group).value,
  ));
  renameTo.value = undefined;
}

function saveEdit() {
  if (renameTo.value) {
    currentNamelist.value.groups.rename(editingGroup.value, renameTo.value);
    editingGroup.value = renameTo.value;
  }
  currentNamelist.value.groups.use(editingGroup.value).value = editingGroupMembers.value;
  editing.value = false;
}

function attemptRename(to: string) {
  if (currentNamelist.value.groups.has(to))
    message.error(t('name-duplicated'));
  else
    renameTo.value = to;
}

const importTo = ref<string>(NEW_GROUP);
function handleImport(items: string[]) {
  const target = importTo.value;
  if (target === NEW_GROUP)
    currentNamelist.value.groups.add(currentNamelist.value.groups.genName(), items);
  else
    currentNamelist.value.groups.use(target).value.push(...items);
}
</script>

<template>
  <NModal v-model:show="editing" class="w-[30em]" preset="card">
    <DynamicInput v-model:value="editingGroupMembers" :min="1" show-sort-button>
      <template #default="{ index }">
        <NSelect
          v-model:value="editingGroupMembers[index]"
          :options="candidates"
          filterable
        />
      </template>

      <template #create-button-default>
        {{ t('add-name') }}
      </template>
    </DynamicInput>

    <NSpace class="mt-4 justify-self-end">
      <NButton type="primary" @click="saveEdit">
        {{ $t('confirm') }}
      </NButton>

      <NButton @click="editing = false">
        {{ $t('cancel') }}
      </NButton>
    </NSpace>

    <template #header>
      {{ t('edit-title', [renameTo ?? editingGroup]) }}
      <PopoverRename
        :default="renameTo ?? editingGroup"
        :maxlength="MAX_GROUP_NAME_LENGTH"
        @rename="attemptRename"
      />
    </template>
  </NModal>

  <NFormItem :label="t('current-namelist')" label-placement="left" :show-feedback="false">
    {{ config.namelist }}
  </NFormItem>

  <NFormItem
    :label="t('enable')"
    label-placement="left"
    data-guide-id="enable-group"
    :show-feedback="false"
  >
    <NSwitch v-model:value="enable" />
    <NSelect
      v-if="enable"
      v-model:value="config.group"
      class="ml-3"
      :options="groups.map(v => ({ label: v, value: v }))"
      filterable
    />
  </NFormItem>

  <DynamicInput
    v-model:value="groups"
    class="mt-2 mb-4"
    :on-create="() => currentNamelist.groups.add()"
  >
    <template #default="{ value }">
      <NButton style="width: calc(100% - 88px)" @click="openEdit(value)">
        {{ value }}
      </NButton>
    </template>

    <template #create-button-default>
      {{ t('add-group') }}
    </template>
  </DynamicInput>

  <DataOperations @import="handleImport">
    <template #selectTarget="{ count }">
      <p>把 {{ count }} 个名字导入到分组：</p>
      <NamelistGroupSelector
        v-model="importTo"
        :namelist="config.namelist"
        allow-new
        @vue:before-mount="importTo = NEW_GROUP"
      />
    </template>
  </DataOperations>
</template>

<i18n lang="yaml">
en:
  add-name: Add Name
  current-namelist: Current Namelist
  edit-title: 'Edit Group: {0}'
  name-duplicated: Duplicated with existing name
  add-group: Add Group
  enable: Enable

zh-CN:
  add-name: 添加名字
  current-namelist: 当前名单
  edit-title: 编辑分组 {0}
  name-duplicated: 与现有分组重名了哦
  add-group: 添加分组
  enable: 启用分组点名
</i18n>
