import { useLocalStorage } from '@vueuse/core';
import { defineStore } from 'pinia';
import { GuideSchema } from '@/utils/guide';

export const useGuideStore = defineStore('guide', {
  state: () => {
    const ret = useLocalStorage('guide', GuideSchema.parse({}));
    ret.value = GuideSchema.parse(ret.value);
    return ret;
  },
});
