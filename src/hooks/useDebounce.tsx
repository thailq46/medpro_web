import {useEffect, useState} from "react";

export default function useDebounce(
  initialValue: string = "",
  delay: number = 1000
) {
  const [debounceValue, setDebounceValue] = useState<string>(initialValue);
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceValue(initialValue);
    }, delay);
    return () => {
      clearTimeout(timer);
    };
  }, [delay, initialValue]);
  return debounceValue;
}
