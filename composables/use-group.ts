export default (name: string) => {
  const item = useGroupStore().data.find(v => v[0] === name)
  if (!item)
    throw new Error(`Cannot find group "${name}"`)
  return item[1]
}
