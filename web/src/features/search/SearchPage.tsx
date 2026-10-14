'use client';
import { layoutVals } from '@/components/ui/layout-vals';
import { useViewport } from '@/lib/use-viewport';
import { useSearchVals } from './useSearchVals';
import { SearchView } from './views/SearchView';

export function SearchPage() {
  const vp = useViewport();
  return <SearchView v={{ ...layoutVals(vp), ...useSearchVals() }} />;
}
