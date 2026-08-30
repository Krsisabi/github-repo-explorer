import { useState, useCallback } from 'react';

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : initialValue;
  });

  const setValue = useCallback<(value: T) => T>(
    (value) => {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
      return value;
    },
    [key]
  );

  return [storedValue, setValue] as const;
};
