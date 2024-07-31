import 'mock-local-storage';
import { createPinia, setActivePinia } from 'pinia';

beforeEach(() => {
  localStorage.clear();
});

describe('useGroupStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  let store: ReturnType<typeof useGroupStore>;
  beforeEach(() => {
    store = useGroupStore();
  });

  it('.add', () => {
    const g1 = store.add('g1');
    expect(g1.value).toStrictEqual(DEFAULT_GROUP_OPTIONS);
    expect(getStoredGroup('g1')).toStrictEqual(DEFAULT_GROUP_OPTIONS);

    const g2 = store.add('g2', ['p1', 'p2']);
    expect(g2.value).toStrictEqual(['p1', 'p2']);
    expect(getStoredGroup('g2')).toStrictEqual(['p1', 'p2']);
  });

  it('.remove', () => {
    store.add('g1');
    store.remove('g1');
    expect(store.nameList).toStrictEqual([]);
    expect(hasStoredGroup('g1')).toBe(false);
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
    expect(store.nameList).toStrictEqual(['g2']);
    expect(() => getStoredGroup('g1')).toThrow('Cannot find group "g1"');
    expect(getStoredGroup('g2')).toStrictEqual(['p1', 'p2']);
  });
});

describe('fixGroup', () => {
  it('当名单不存在时，应当添加名单', () => {
    fixGroup('g1');
    expect(hasStoredGroup('g1')).toBe(true);
    expect(getStoredGroup('g1')).toStrictEqual(DEFAULT_GROUP_OPTIONS);
  });

  it('当名单为空时，应当填充默认值', () => {
    setStoredGroup('g1', []);
    fixGroup('g1');
    expect(hasStoredGroup('g1')).toBe(true);
    expect(getStoredGroup('g1')).toStrictEqual(DEFAULT_GROUP_OPTIONS);
  });

  it('当名单正常时，不应修改', () => {
    setStoredGroup('g1', ['p1', 'p2']);
    fixGroup('g1');
    expect(hasStoredGroup('g1')).toBe(true);
    expect(getStoredGroup('g1')).toStrictEqual(['p1', 'p2']);
  });
});

describe('generateNewGroupName', () => {
  it('应当从 名单数量 +1 开始', () => {
    expect(generateNewGroupName()).toBe('#1');
    setStoredGroup('g1', []);
    expect(generateNewGroupName()).toBe('#2');
  });

  it('应当生成唯一的名称', () => {
    setStoredGroup('#2', []);
    setStoredGroup('#3', []);
    expect(generateNewGroupName()).toBe('#4');
  });
});
