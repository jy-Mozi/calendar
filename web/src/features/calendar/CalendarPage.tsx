'use client';
import { useSearchParams } from 'next/navigation';
import { layoutVals } from '@/components/ui/layout-vals';
import { useViewport } from '@/lib/use-viewport';
import { useCalendarVals } from './useCalendarVals';
import { ListView } from './views/ListView';
import { MonthView } from './views/MonthView';
import { WeekView } from './views/WeekView';

export function CalendarPage() {
  const vp = useViewport();
  const view = useSearchParams().get('view') ?? 'month';
  const v = { ...layoutVals(vp), ...useCalendarVals() };
  return view === 'week' ? <WeekView v={v} /> : view === 'list' ? <ListView v={v} /> : <MonthView v={v} />;
}
