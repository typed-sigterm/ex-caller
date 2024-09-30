export default (name: string) => {
  return computed(
    () => useNamelist(name).value.map(rollCallOptionToString),
  );
};
