'use client';
import { layoutVals } from '@/components/ui/layout-vals';
import { useViewport } from '@/lib/use-viewport';
import { useLedgerVals } from './useLedgerVals';
import { LedgerView } from './views/LedgerView';

export function LedgerPage() {
  const vp = useViewport();
  return <LedgerView v={{ ...layoutVals(vp), ...useLedgerVals() }} />;
}
