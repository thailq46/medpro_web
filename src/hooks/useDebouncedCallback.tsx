/* eslint-disable react-hooks/rules-of-hooks */
import debounce from "lodash/debounce";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  type DependencyList,
  type RefObject,
} from "react";

export type GenericFunction = (...args: any[]) => any;
export type SomeCallback<TArgs, TResult = void> = (...args: TArgs[]) => TResult;
export type CallbackSetter<TArgs> = (nextCallback: SomeCallback<TArgs>) => void;

export interface DebounceOptions {
  leading?: boolean | undefined;
  maxWait?: number | undefined;
  trailing?: boolean | undefined;
}
type SomeFunction = (...args: any[]) => any;

const isFunction = (
  functionToCheck: unknown
): functionToCheck is SomeFunction =>
  typeof functionToCheck === "function" &&
  !!functionToCheck.constructor &&
  !!functionToCheck.call &&
  !!functionToCheck.apply;

const createHandlerSetter = <TArgs, TResult = void>(
  callback?: SomeCallback<TArgs, TResult>
) => {
  const handlerRef = useRef(callback);

  const setHandler = useRef((nextCallback: SomeCallback<TArgs, TResult>) => {
    if (typeof nextCallback !== "function") {
      throw new Error(
        "the argument supplied to the 'setHandler' function should be of type function"
      );
    }

    handlerRef.current = nextCallback;
  });

  return [handlerRef, setHandler.current] as [
    RefObject<SomeCallback<TArgs, TResult>>,
    CallbackSetter<TArgs>
  ];
};

const useWillUnmount = <TCallback extends GenericFunction>(
  callback?: TCallback
) => {
  const mountRef = useRef(false);
  const [handler, setHandler] = createHandlerSetter<undefined>(callback);

  useLayoutEffect(() => {
    mountRef.current = true;

    return () => {
      if (isFunction(handler?.current) && mountRef.current) {
        handler.current();
      }
    };
  }, []);

  return setHandler;
};

const defaultOptions: DebounceOptions = {
  leading: false,
  trailing: true,
};

const useDebouncedCallback = <TCallback extends GenericFunction>(
  fn: TCallback,
  dependencies?: DependencyList,
  wait: number = 600,
  options: DebounceOptions = defaultOptions
) => {
  const debounced = useRef(debounce<TCallback>(fn, wait, options));

  useEffect(() => {
    debounced.current = debounce(fn, wait, options);
  }, [fn, wait, options]);

  useWillUnmount(() => {
    debounced.current?.cancel();
  });

  return useCallback(debounced.current, dependencies ?? []);
};

export default useDebouncedCallback;
