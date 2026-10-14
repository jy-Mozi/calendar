'use client';
// 검색 화면. ?q=키워드  ?type=전체|일정|할일|거래
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useApp } from '@/components/shell/AppContext';
import { CD, CL, pill } from '@/components/ui/colors';
import type { Vals } from '@/components/ui/vals';
import { searchApi } from '@/features/search/api';
import { useQuery } from '@/lib/query';
import type { SearchKind } from './types';

const KIND_HUE: Record<SearchKind, number> = { 일정: 255, 할일: 155, 거래: 55 };

export function useSearchVals(): Vals {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const { city } = useApp();
  const q = params.get('q') ?? '';
  const qType = params.get('type') ?? '전체';
  const set = (patch: Record<string, string>) => {
    const next = new URLSearchParams(params.toString());
    Object.entries(patch).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };

  const { data: matched = [] } = useQuery(`search:${q.trim().toLowerCase()}`, () => searchApi.search(q));
  const hasQuery = !!q.trim();
  const searchFilters = ['전체', '일정', '할일', '거래'].map((label) => ({
    label, n: hasQuery ? matched.filter((r) => label === '전체' || r.kind === label).length : '', ...pill(qType === label), go: () => set({ type: label }),
  }));
  const results = matched
    .filter((r) => qType === '전체' || r.kind === qType)
    .map((r) => ({ ...r, bg: CL(KIND_HUE[r.kind]), fg: CD(KIND_HUE[r.kind]), go: () => router.push(r.href) }));
  const suggestions = ['요가', '식비', '보고서', '회의', '신용카드'].map((t) => ({ t, go: () => set({ q: t }) }));

  return {
    city, q, setQ: (e: { target: { value: string } }) => set({ q: e.target.value }), qEmpty: !hasQuery,
    searchFilters, results, hasResults: results.length > 0, noResults: hasQuery && results.length === 0, suggestions,
  };
}
