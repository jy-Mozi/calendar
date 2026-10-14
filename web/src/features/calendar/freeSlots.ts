// 빈 시간 찾기 (CA-11). 이미 전개된 일정 목록을 받는 순수 함수라 MCP(find_free_slots)도 재사용한다.
import { kstToIso } from '@/lib/format';
import type { CalendarEvent } from './types';

export type FreeSlot = { startAt: string; endAt: string; minutes: number };

const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};

/**
 * date(YYYY-MM-DD, KST) 의 range(기본 09:00–18:00) 안에서 durationMin 이상 비는 구간을 돌려준다.
 * 종일 일정은 시간을 막지 않는다. 돌려주는 값은 "비는 구간 전체"이며, 제안은 각 구간의 앞에서부터 durationMin 만큼 쓰면 된다.
 */
export function findFreeSlots(events: CalendarEvent[], date: string, durationMin: number, range: { start: string; end: string } = { start: '09:00', end: '18:00' }): FreeSlot[] {
  const [y, m, d] = date.split('-').map(Number);
  const at = (min: number) => new Date(new Date(kstToIso(y, m, d)).getTime() + min * 60000).toISOString();
  const lo = toMin(range.start);
  const hi = toMin(range.end);
  const dayStart = new Date(at(0)).getTime();

  const busy = events
    .filter((e) => !e.allDay && !e.cancelled)
    .map((e) => [Math.round((new Date(e.startAt).getTime() - dayStart) / 60000), Math.round((new Date(e.endAt).getTime() - dayStart) / 60000)] as const)
    .filter(([s, e]) => e > lo && s < hi)
    .sort((a, b) => a[0] - b[0]);

  const slots: FreeSlot[] = [];
  let cursor = lo;
  for (const [s, e] of busy) {
    if (s - cursor >= durationMin) slots.push({ startAt: at(cursor), endAt: at(s), minutes: s - cursor });
    cursor = Math.max(cursor, e);
  }
  if (hi - cursor >= durationMin) slots.push({ startAt: at(cursor), endAt: at(hi), minutes: hi - cursor });
  return slots;
}
