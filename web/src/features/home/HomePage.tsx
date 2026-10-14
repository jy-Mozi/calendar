'use client';
import { layoutVals } from '@/components/ui/layout-vals';
import { useViewport } from '@/lib/use-viewport';
import { HomeView } from './HomeView';
import { useHomeVals } from './useHomeVals';

export function HomePage() {
  const vp = useViewport();
  return <HomeView v={{ ...layoutVals(vp), ...useHomeVals() }} />;
}
