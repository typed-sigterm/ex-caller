import { GuideSchema } from '@/utils/guide';
import { useLocalStorage } from '@vueuse/core';
import { defineStore } from 'pinia';

export const useGuideStore = defineStore('guide', {
  state: () => {
    const ret = useLocalStorage('guide', GuideSchema.parse({}));
    ret.value = GuideSchema.parse(ret.value);
    return ret;
  },
});
