export default (name: string) => {
  const item = useNamelistStore().data.find(v => v[0] === name);
  if (!item)
    throw new Error(`Cannot find namelist "${name}"`);
  return item[1];
};
