import { useNamelistStore } from '@/stores/namelist';
import { DEFAULT_NAMELIST_OPTIONS } from '@/utils/config';
import { fixNamelist, genNewNamelistName, getNamelist, hasNamelist, setNamelist } from '@/utils/namelist';
import { createPinia, setActivePinia } from 'pinia';
import 'mock-local-storage';

beforeEach(() => localStorage.clear());

describe('useNamelistStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  let store: ReturnType<typeof useNamelistStore>;
  beforeEach(() => {
    store = useNamelistStore();
  });

  it('.add', () => {
    const g1 = store.add('g1');
    expect(g1.value).toStrictEqual(DEFAULT_NAMELIST_OPTIONS);
    expect(getNamelist('g1')).toStrictEqual(DEFAULT_NAMELIST_OPTIONS);

    const g2 = store.add('g2', ['p1', 'p2']);
    expect(g2.value).toStrictEqual(['p1', 'p2']);
    expect(getNamelist('g2')).toStrictEqual(['p1', 'p2']);
  });

  it('.remove', () => {
    store.add('g1');
    store.remove('g1');
    expect(store.namelist).toStrictEqual([]);
    expect(hasNamelist('g1')).toBe(false);
  });

  it('.has', () => {
    store.add('g1');
    expect(store.has('g1')).toBe(true);
    store.remove('g1');
    expect(store.has('g1')).toBe(false);
  });

  it('.rename', () => {
    store.add('g1', ['p1', 'p2']);
    store.rename('g1', 'g2');
    expect(store.namelist).toStrictEqual(['g2']);
    expect(() => getNamelist('g1')).toThrow('Cannot find namelist "g1"');
    expect(getNamelist('g2')).toStrictEqual(['p1', 'p2']);
  });
});

describe('fixNamelist', () => {
  it('当名单不存在时，应当添加名单', () => {
    fixNamelist('g1');
    expect(hasNamelist('g1')).toBe(true);
    expect(getNamelist('g1')).toStrictEqual(DEFAULT_NAMELIST_OPTIONS);
  });

  it('当名单为空时，应当填充默认值', () => {
    setNamelist('g1', []);
    fixNamelist('g1');
    expect(hasNamelist('g1')).toBe(true);
    expect(getNamelist('g1')).toStrictEqual(DEFAULT_NAMELIST_OPTIONS);
  });

  it('当名单正常时，不应修改', () => {
    setNamelist('g1', ['p1', 'p2']);
    fixNamelist('g1');
    expect(hasNamelist('g1')).toBe(true);
    expect(getNamelist('g1')).toStrictEqual(['p1', 'p2']);
  });
});

describe('genNewNamelistName', () => {
  it('应当从 名单数量 +1 开始', () => {
    expect(genNewNamelistName()).toBe('#1');
    setNamelist('g1', []);
    expect(genNewNamelistName()).toBe('#2');
  });

  it('应当生成唯一的名称', () => {
    setNamelist('#2', []);
    setNamelist('#3', []);
    expect(genNewNamelistName()).toBe('#4');
  });
});
