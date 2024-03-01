import 'mock-local-storage'

const MEMBERS = ['p1', 'p2']
const MEMBERS_STR = JSON.stringify(MEMBERS)

beforeEach(() => {
  localStorage.clear()
  refreshGroupList()
  resetGroupCache()
})

describe('名单相关工具函数', () => {
  it('格式化名单名称', () => {
    expect(getGroupKey('哈')).toBe('group/哈')
    expect(getGroupName('group/哈')).toBe('哈')
  })

  it('获取名单', () => {
    localStorage.setItem('group/g1', MEMBERS_STR)
    expect(getGroup('g1')).toEqual(MEMBERS)
    expect(getGroup('g2')).toEqual([])
  })

  it('设置名单', () => {
    localStorage.setItem('group/g1', '[]')
    setGroup('g1', MEMBERS)
    expect(getGroup('g1')).toEqual(MEMBERS)
  })

  it('获取名单列表', () => {
    localStorage.setItem('another-key', MEMBERS_STR)
    localStorage.setItem('group', MEMBERS_STR)
    localStorage.setItem('group/g1', MEMBERS_STR)
    localStorage.setItem('group/g2', MEMBERS_STR)
    expect(getGroups()).toEqual(['g1', 'g2'])
  })

  it('添加名单', () => {
    addGroup('g1')
    expect(JSON.parse(localStorage.getItem('group/g1')!)).toEqual(DEFAULT_GROUP_OPTIONS)
  })

  it('删除名单', () => {
    localStorage.setItem('group/g1', MEMBERS_STR)
    removeGroup('g1')
    expect(localStorage.getItem('group/g1')).toBe(null)
  })

  it('判断名单是否存在', () => {
    localStorage.setItem('group/g1', MEMBERS_STR)
    expect(hasGroup('g1')).toBe(true)
    expect(hasGroup('g2')).toBe(false)
    localStorage.removeItem('group/g1')
    expect(hasGroup('g1')).toBe(false)
  })

  it('修改名单名称', () => {
    localStorage.setItem('group/g1', MEMBERS_STR)
    renameGroup('g1', 'g2')
    expect(localStorage.getItem('group/g1')).toBe(null)
    expect(localStorage.getItem('group/g2')).toBe(MEMBERS_STR)
  })

  it('生成新名单名称', () => {
    localStorage.setItem('group/名单 1', MEMBERS_STR)
    expect(generateNewGroupName()).toBe('名单 2')
    localStorage.removeItem('group/名单 1')
    localStorage.setItem('group/名单 2', MEMBERS_STR)
    expect(generateNewGroupName()).toBe('名单 3') // 从 2 开始尝试，冲突，取 3
  })
})

describe('useGroup', () => {
  it('自动添加名单', () => {
    expect(useGroup('g1').value).toEqual([])
  })

  it('获取名单', async () => {
    addGroup('g1')
    setGroup('g1', MEMBERS)
    await nextTick()
    expect(getGroup('g1')).toEqual(MEMBERS)
  })

  it('设置名单', async () => {
    useGroup('g1').value = MEMBERS
    await nextTick()
    expect(getGroup('g1')).toEqual(MEMBERS)
  })
})

describe('useGroupMembers', () => {
  it('同步名单成员', () => {
    const g = useGroup('g1')
    g.value = MEMBERS
    expect(useGroupMembers('g1').value).toEqual(MEMBERS)
  })

  it('名单删除后为空', () => {
    addGroup('g1')
    removeGroup('g1')
    expect(useGroupMembers('g1').value).toEqual([])
  })
})

describe('useGroupList', () => {
  it('同步名单列表', () => {
    addGroup('g1')
    addGroup('g2')
    expect(useGroupList().value).toEqual(['g1', 'g2'])
    removeGroup('g2')
    expect(useGroupList().value).toEqual(['g1'])
    renameGroup('g1', 'g3')
    expect(useGroupList().value).toEqual(['g3'])
  })
})
