import 'mock-local-storage'
import { generateNewGroupName, getGroupKey, getGroupName, getGroups, hasGroup, renameGroup } from '~/utils/group'
import { refreshGroupList } from '~/composables/use-group-list'

const MEMBERS = ['p1', 'p2']
const MEMBERS_STR = JSON.stringify(MEMBERS)

beforeEach(() => {
  localStorage.clear()
  refreshGroupList()
})

describe('名单相关工具函数', () => {
  it('格式化名单名称', () => {
    expect(getGroupKey('哈')).toBe('group/哈')
    expect(getGroupName('group/哈')).toBe('哈')
  })

  it('获取名单列表', () => {
    localStorage.setItem('another-key', MEMBERS_STR)
    localStorage.setItem('group', MEMBERS_STR)
    localStorage.setItem('group/g1', MEMBERS_STR)
    localStorage.setItem('group/g2', MEMBERS_STR)
    expect(getGroups()).toEqual(['g1', 'g2'])
  })

  it('判断名单是否存在', () => {
    localStorage.setItem('group/g1', MEMBERS_STR)
    expect(hasGroup('g1')).toBe(true)
    expect(hasGroup('g2')).toBe(false)
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
  it('自动添加名单，填入默认值', () => {
    expect(useGroup('g1').value).toEqual(DEFAULT_GROUP_OPTIONS)
    expect(getGroups()).toEqual(['g1'])
  })

  it('删除名单', () => {
    const g = useGroup('g1')
    expect(getGroups()).toEqual(['g1'])
    g.value = null
    expect(getGroups()).toEqual([])
  })

  it('缓存', () => { //
    expect(useGroup('g1')).toBe(useGroup('g1')) // 返回相同对象
  })
})

describe('useGroupMembers', () => {
  it('同步名单成员', () => {
    const g = useGroup('g1')
    g.value = MEMBERS
    expect(useGroupMembers('g1').value).toEqual(MEMBERS)
  })

  // blocked by https://github.com/vueuse/vueuse/issues/3808
  it.skip('名单删除时为空', () => {
    const g = useGroup('g1')
    g.value = null
    expect(useGroupMembers('g1').value).toEqual([])
  })
})

describe('useGroupList', () => {
  // blocked by https://github.com/vueuse/vueuse/issues/3808
  it.skip('同步名单列表', () => {
    useGroup('g1')
    const g2 = useGroup('g2')
    expect(useGroupList().value).toEqual(['g1', 'g2'])
    g2.value = null
    expect(useGroupList().value).toEqual(['g1'])
    renameGroup('g1', 'g3')
    expect(useGroupList().value).toEqual(['g3'])
  })

  it('缓存', () => {
    expect(useGroupList()).toBe(useGroupList()) // 返回相同对象
  })
})
