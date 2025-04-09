<script setup lang="ts">
import DynamicInput from '@/components/dynamic-input';
import { useConfigStore } from '@/stores/config';
import { MAX_GROUP_NAME_LENGTH } from '@/utils/config';
import { genNewGroupName, getGroup, hasGroup, listGroups, removeGroup, setGroup } from '@/utils/group';
import useNamelistMembers from '@/utils/namelist';
import { ui } from '@/utils/ui';
import { computed, ref, watch } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n({ useScope: 'local' });
const config = useConfigStore();

const enable = ref(!!config.group);
watch(enable, v => !v && (config.group = undefined));

const candidates = computed(() => {
  return useNamelistMembers(config.namelist).value.map(v => ({
    value: v,
    label: v,
  }));
});
const groups = ref(listGroups(config.namelist));

function handleCreate() {
  const name = genNewGroupName(config.namelist);
  setGroup(config.namelist, name, []);
  return name;
}

const editing = ref(false);
const editingGroup = ref<string>('');
const editingGroupMembers = ref<string[]>([]);
const renameTo = ref<string | undefined>();

function openEdit(group: string) {
  editing.value = true;
  editingGroup.value = group;
  editingGroupMembers.value = getGroup(config.namelist, group);
}

function saveEdit() {
  if (renameTo.value) {
    setGroup(config.namelist, renameTo.value, editingGroupMembers.value);
    removeGroup(config.namelist, editingGroup.value!);
    groups.value = listGroups(config.namelist);
  } else {
    setGroup(config.namelist, editingGroup.value!, editingGroupMembers.value);
  }
  editing.value = false;
  renameTo.value = undefined;
}

function attemptRename(to: string) {
  if (hasGroup(config.namelist, to))
    ui.message.error(t('name-duplicated'));
  else
    renameTo.value = to;
}
</script>

<template>
  <NModal v-model:show="editing" class="w-[30em]" preset="card">
    <DynamicInput v-model:value="editingGroupMembers" show-sort-button>
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

  <NFormItem :label="t('enable')" label-placement="left" data-guide-id="enable-group">
    <NSwitch v-model:value="enable" />
    <NSelect
      v-if="enable"
      v-model:value="config.group"
      class="ml-3"
      :options="groups.map(g => ({ label: g, value: g }))"
    />
  </NFormItem>

  <NDynamicInput v-model:value="groups" :on-create="handleCreate">
    <template #default="{ value }">
      <NButton style="width: calc(100% - 88px)" @click="openEdit(value)">
        {{ value }}
      </NButton>
    </template>

    <template #create-button-default>
      {{ t('add-group') }}
    </template>
  </NDynamicInput>
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
