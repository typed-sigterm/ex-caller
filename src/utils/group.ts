const GROUP_KEY_PREFIX = 'group';

const toKey = (namelist: string, group: string) => `${GROUP_KEY_PREFIX}/${namelist}/${group}`;

export function listGroups(namelist: string) {
  const prefix = `${GROUP_KEY_PREFIX}/${namelist}/`;
  return Object.keys(localStorage)
    .filter(v => v.startsWith(prefix))
    .map(v => v.slice(prefix.length))
    .sort();
}

export function getGroup(namelist: string, group: string) {
  return JSON.parse(localStorage.getItem(toKey(namelist, group))!);
}

export function setGroup(namelist: string, group: string, names: string[]) {
  localStorage.setItem(toKey(namelist, group), JSON.stringify(names));
}

export function removeGroup(namelist: string, group: string) {
  localStorage.removeItem(toKey(namelist, group));
}

export function hasGroup(namelist: string, group: string) {
  return localStorage.getItem(toKey(namelist, group)) !== null;
}
