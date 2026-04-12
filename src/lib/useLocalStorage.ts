import { useState, useCallback } from "react";

export function useLocalStorage<T>(key: string, defaultValue: T): [T, (val: T) => void] {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === "undefined") return defaultValue;
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  });

  const setStoredValue = useCallback((val: T) => {
    setValue(val);
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch { /* ignore */ }
  }, [key]);

  return [value, setStoredValue];
}
