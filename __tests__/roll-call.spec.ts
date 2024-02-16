import { promiseTimeout } from '@vueuse/core'
import useRollCall from '~/composables/use-roll-call'

const duration = 500
const rest = 50

async function wait(times = 1) {
  await promiseTimeout(duration * times + rest)
}

describe('useRollCall', () => {
  it('应当正确初始化', () => {
    const inst = useRollCall({
      options: ['A', 'B'],
      duration,
    })
    expect(inst.value.isActive).toBe(false)
    expect(inst.value.currentIndex).toBeUndefined()
    expect(inst.value.currentValue).toBeUndefined()
  })

  it('应当正确处理传入的默认值', () => {
    const inst = useRollCall({
      options: ['A', 'B'],
      duration,
      defaultIndex: 1,
      defaultValue: 'BBB',
    })
    expect(inst.value.isActive).toBe(false)
    expect(inst.value.currentIndex).toBe(1)
    expect(inst.value.currentValue).toBe('BBB')
  })

  it('间隔指定时间后，应当下一个', async () => {
    const inst = useRollCall({
      options: ['A', 'B'],
      duration,
    })
    inst.value.start() // / -> A
    await wait() // A -> B
    expect(inst.value.currentIndex).toBe(1)
    expect(inst.value.currentValue).toBe('B')
  })

  it('应当循环抽取', async () => {
    const inst = useRollCall({
      options: ['A', 'B'],
      duration,
    })
    inst.value.start() // / -> A
    await wait(2) // A -> B -> A
    expect(inst.value.currentIndex).toBe(0)
    expect(inst.value.currentValue).toBe('A')
  })

  it('暂停后，应当停止下一个', async () => {
    const inst = useRollCall({
      options: ['A', 'B', 'C'],
      duration,
    })
    inst.value.start() // / -> A
    await wait() // A -> B
    inst.value.pause()
    expect(inst.value.currentIndex).toBe(1)
    expect(inst.value.currentValue).toBe('B')
    await wait() // 已暂停
    expect(inst.value.currentIndex).toBe(1)
    expect(inst.value.currentValue).toBe('B')
  })

  it('恢复后，应当立即下一个', async () => {
    const inst = useRollCall({
      options: ['A', 'B', 'C'],
      duration,
    })
    inst.value.start() // / -> A
    await wait() // A -> B
    inst.value.pause()
    await wait() // 已暂停
    inst.value.start() // B -> C
    expect(inst.value.currentIndex).toBe(2)
    expect(inst.value.currentValue).toBe('C')
  })

  it('应当正确重置', async () => {
    const inst = useRollCall({
      options: ['A', 'B'],
      duration,
    })
    inst.value.start() // / -> A
    await wait() // A -> B
    inst.value.reset() // B -> A
    expect(inst.value.isActive).toBe(false)
    expect(inst.value.currentIndex).toBeUndefined()
    expect(inst.value.currentValue).toBeUndefined()
  })
})
