import { useState, useCallback, useEffect } from "react";

export function useLocalStorage<T>(key: string, defaultValue: T): [T, (val: T) => void] {
  const [value, setValue] = useState<T>(defaultValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const item = localStorage.getItem(key);
      if (item) {
        setValue(JSON.parse(item));
      }
    } catch { /* ignore */ }
    setHydrated(true);
  }, [key]);

  const setStoredValue = useCallback((val: T) => {
    setValue(val);
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch { /* ignore */ }
  }, [key]);

  return [value, setStoredValue];
}
