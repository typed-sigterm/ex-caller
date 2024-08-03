export default (name: string) => {
  return computed(
    () => useGroup(name).value.map(rollCallOptionToString),
  );
};
