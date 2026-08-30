export enum LocalStorageKeys {
  SEARCH_VALUE = 'search_value',
}

type LocalStorageValueMap = {
  [LocalStorageKeys.SEARCH_VALUE]: string;
};

export const saveToLocalStorage = <T extends LocalStorageKeys>(
  key: T,
  data: LocalStorageValueMap[T]
) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const loadFromLocalStorage = <T extends LocalStorageKeys>(key: T) => {
  const item = localStorage.getItem(key);
  if (item === null) {
    return undefined;
  }
  return JSON.parse(item) as LocalStorageValueMap[T];
};
