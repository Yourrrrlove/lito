import { useEffect, useState } from 'react'
export function addSearchHistory(){
  const [history, setHistory] = useLocalStorage<any[]>('player.history', [])
  const addhistory=(item:any)=>{
    const fun=(history:any[])=>{
      if (history.length>50) history.pop();
      let index=history.find(value => {
        return value['type']==item['type']&&value['id']==item['id']
      })
      if (index!=undefined){
        history.splice(index,1)
      }
      history.unshift(item)
      return history;
    }

    setHistory(fun)
  }
  return addhistory
}
export function useLocalStorage<T>(key: string, initialValue: T) {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Get from local storage by key
      const item = window.localStorage.getItem(key);
      // Parse stored json or if none return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });
  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };
  return [storedValue, setValue] as const;
}
//From Lujjjh
export const usePlayerEventCallback = <T extends keyof MusicKit.Events>(
  name: T,
  callback: (event: MusicKit.Events[T]) => any,
  deps?: React.DependencyList
) => {
  useEffect(() => {
    const instance = MusicKit.getInstance()
    instance.addEventListener(name, callback)
    return () => {
      instance.removeEventListener(name, callback as () => any)
    }
  }, deps)
}