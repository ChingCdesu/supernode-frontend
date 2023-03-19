import { ref, Ref } from "vue";

type PromiseType<T extends Promise<any>> = T extends Promise<infer R>
  ? R
  : never;

interface PromiseResult<
  T extends Promise<any>,
  TR = PromiseType<T>,
  TError = any
> {
  promise: Ref<T | undefined>;
  result: Ref<TR | null>;
  loading: Ref<boolean>;
  error: Ref<TError>;
}

export interface PromiseResultFactory<
  T extends Promise<any>,
  TArgs extends Array<any> = Array<any>
> extends PromiseResult<T> {
  exec: (...args: TArgs) => Promise<PromiseType<T> | undefined>;
}

export interface CancellablePromiseResult<TCancel = any> {
  cancel: (result?: TCancel) => void;
  cancelled: Ref<boolean>;
}

export function usePromise<T extends Promise<any>, TArgs extends Array<any>>(
  fn: (...args: TArgs) => T
): PromiseResultFactory<T, TArgs> {
  const cancelled = ref(false);
  const loading = ref(false);
  const error = ref<unknown>(null);
  const result: Ref<PromiseType<T> | null> = ref(null);
  const promise = ref<T>();

  const exec = async (...args: TArgs): Promise<PromiseType<T> | undefined> => {
    cancelled.value = false;
    loading.value = true;
    error.value = null;
    result.value = null;
    promise.value = fn(...args);
    try {
      const res = await promise.value;
      result.value = res;
      return res;
    } catch (e) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  };

  // @ts-ignore
  exec();

  return {
    promise,
    result,
    loading,
    error,
    exec,
  };
}

export function useCancellablePromise<
  T extends Promise<TR>,
  TR,
  TArgs extends Array<any>
>(
  factory: (...args: TArgs) => T
): PromiseResultFactory<Promise<TR>, TArgs> & CancellablePromiseResult<TR> {
  const cancelled = ref(false);
  let _cancel: ((result?: TR) => void) | undefined = undefined;

  const cancel = (result?: TR) => {
    if (!_cancel) {
      return;
    }
    _cancel(result);
  };

  const promise = (p: T): T =>
    new Promise<TR>((resolve, reject) => {
      cancelled.value = false;
      _cancel = (result) => {
        cancelled.value = true;
        reject(result);
      };
      p.then(resolve).catch(reject);
    }) as T;

  const use = usePromise((...args: TArgs) => promise(factory(...args)));

  return { ...use, cancel, cancelled };
}
