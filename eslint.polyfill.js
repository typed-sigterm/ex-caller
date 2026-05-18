if (!Object.groupBy) {
  Object.groupBy = (items, callbackfn) => {
    const result = {};
    let index = 0;
    for (const item of items) {
      const key = callbackfn(item, index++);
      const propertyKey = typeof key === 'symbol' ? key : String(key);
      (result[propertyKey] ||= []).push(item);
    }
    return result;
  };
}
