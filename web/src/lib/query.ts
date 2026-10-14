'use client';
// 데이터 접근 공통 패턴 (docs/data-pattern.md 참고).
//  - 읽기: useQuery(key, fetcher) — 같은 key는 캐시를 공유하고, invalidate(prefix)로 다시 읽는다.
//  - 쓰기: mutate({ optimistic, run, invalidate }) — 낙관적 반영 후 실패하면 롤백하고 토스트로 알린다.
import { useEffect, useSyncExternalStore } from 'react';

type Entry<T> = { data: T | undefined; error: unknown; loading: boolean };
const cache = new Map<string, Entry<unknown>>();
const fetchers = new Map<string, () => Promise<unknown>>();
const listeners = new Set<() => void>();
const emit = () => listeners.forEach((l) => l());
const EMPTY: Entry<unknown> = { data: undefined, error: undefined, loading: true };

const subscribe = (l: () => void) => {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
};

async function load(key: string) {
  const fetcher = fetchers.get(key);
  if (!fetcher) return;
  const prev = cache.get(key) ?? EMPTY;
  try {
    cache.set(key, { data: await fetcher(), error: undefined, loading: false });
  } catch (error) {
    cache.set(key, { ...prev, error, loading: false });
  }
  emit();
}

export function useQuery<T>(key: string, fetcher: () => Promise<T>) {
  fetchers.set(key, fetcher);
  const entry = useSyncExternalStore(
    subscribe,
    () => cache.get(key) ?? EMPTY,
    () => EMPTY,
  ) as Entry<T>;
  useEffect(() => {
    if (!cache.has(key)) {
      cache.set(key, EMPTY);
      void load(key);
    }
  }, [key]);
  return { data: entry.data, error: entry.error, loading: entry.loading && entry.data === undefined };
}

/** key 가 prefix 로 시작하는 모든 쿼리를 다시 읽는다. */
export function invalidate(prefix: string) {
  for (const key of fetchers.keys()) if (key.startsWith(prefix)) void load(key);
}

/** 캐시 값을 직접 바꾼다(낙관적 업데이트). 되돌리는 함수를 돌려준다. */
export function patchCache<T>(key: string, fn: (old: T | undefined) => T) {
  const prev = cache.get(key);
  cache.set(key, { data: fn(prev?.data as T | undefined), error: undefined, loading: false });
  emit();
  return () => {
    if (prev) cache.set(key, prev);
    else cache.delete(key);
    emit();
  };
}

let notifyError: (msg: string) => void = () => {};
export function setErrorNotifier(fn: (msg: string) => void) {
  notifyError = fn;
}

export async function mutate<R>(opts: {
  run: () => Promise<R>;
  /** 낙관적 반영. 되돌리는 함수를 돌려준다. */
  optimistic?: () => () => void;
  invalidate?: string[];
  errorMessage?: string;
}) {
  const rollback = opts.optimistic?.();
  try {
    const result = await opts.run();
    opts.invalidate?.forEach(invalidate);
    return result;
  } catch (e) {
    rollback?.();
    notifyError(opts.errorMessage ?? '저장하지 못했어요. 다시 시도해 주세요.');
    throw e;
  }
}
