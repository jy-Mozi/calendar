import { kstParts } from '@/lib/format';

/** 목업 모드의 "오늘". 프로토타입 데이터가 2026-10-14 기준이라 고정한다. */
export const MOCK_TODAY = { y: 2026, m: 10, d: 14 };

/** NEXT_PUBLIC_USE_MOCK=0 이면 Supabase 구현을 쓴다. 기본은 목업. */
export const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK !== '0';

/** 오늘(KST). 목업 모드에서는 고정값. */
export function today() {
  if (USE_MOCK) return MOCK_TODAY;
  const { y, m, d } = kstParts(new Date());
  return { y, m, d };
}
