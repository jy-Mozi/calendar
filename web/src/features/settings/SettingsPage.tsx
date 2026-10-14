'use client';
import { layoutVals } from '@/components/ui/layout-vals';
import { useViewport } from '@/lib/use-viewport';
import { useSettingsVals } from './useSettingsVals';
import { SettingsView } from './views/SettingsView';

export function SettingsPage() {
  const vp = useViewport();
  return <SettingsView v={{ ...layoutVals(vp), ...useSettingsVals() }} />;
}
