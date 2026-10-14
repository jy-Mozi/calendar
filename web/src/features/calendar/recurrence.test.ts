import { describe, expect, it } from 'vitest';
import { kstParts, kstToIso } from '@/lib/format';
import { findFreeSlots } from './freeSlots';
import { expandEvents, planDelete, planEdit } from './recurrence';
import type { CalendarEvent } from './types';

const ev = (over: Partial<CalendarEvent> & { id: string }): CalendarEvent => ({
  title: 't', startAt: kstToIso(2026, 10, 5, 9), endAt: kstToIso(2026, 10, 5, 10), allDay: false, location: null, memo: null, category: '업무', source: 'app', ...over,
});
const range = (m: number, y = 2026) => ({ from: kstToIso(y, m, 1), to: kstToIso(m === 12 ? y + 1 : y, m === 12 ? 1 : m + 1, 1) });
const days = (list: CalendarEvent[]) => list.map((e) => kstParts(e.startAt).d);

describe('expandEvents', () => {
  it('weekly by weekday: uses KST weekday even when UTC date differs', () => {
    // 월요일 00:30 KST = 일요일 15:30 UTC
    const m = ev({ id: 'm', startAt: kstToIso(2026, 10, 5, 0, 30), endAt: kstToIso(2026, 10, 5, 1, 30), rrule: 'FREQ=WEEKLY;BYDAY=MO' });
    expect(days(expandEvents([m], range(10)))).toEqual([5, 12, 19, 26]);
  });

  it('daily instance keeps duration and wall-clock time across midnight boundaries', () => {
    const m = ev({ id: 'm', startAt: kstToIso(2026, 10, 30, 23, 30), endAt: kstToIso(2026, 10, 31, 0, 30), rrule: 'FREQ=DAILY;COUNT=3' });
    const out = expandEvents([m], range(10));
    expect(out.map((e) => `${kstParts(e.startAt).d}`)).toEqual(['30', '31']);
    expect(new Date(out[0].endAt).getTime() - new Date(out[0].startAt).getTime()).toBe(3600000);
    expect(days(expandEvents([m], range(11)))).toEqual([31, 1]); // 10/31 23:30 은 11/1 00:30 까지 걸친다, 11/1 23:30 은 COUNT 밖
  });

  it('monthly on the 31st skips short months', () => {
    const m = ev({ id: 'm', startAt: kstToIso(2026, 10, 31, 9), endAt: kstToIso(2026, 10, 31, 10), rrule: 'FREQ=MONTHLY;BYMONTHDAY=31' });
    expect(expandEvents([m], range(11))).toHaveLength(0);
    expect(days(expandEvents([m], range(12)))).toEqual([31]);
  });

  it('respects UNTIL (inclusive, KST) and COUNT', () => {
    const until = ev({ id: 'u', rrule: 'FREQ=DAILY;UNTIL=20261007T000000Z' }); // 10/7 09:00 KST 이전
    expect(days(expandEvents([until], range(10)))).toEqual([5, 6, 7]);
    const count = ev({ id: 'c', rrule: 'FREQ=WEEKLY;COUNT=2' });
    expect(days(expandEvents([count], range(10)))).toEqual([5, 12]);
  });

  it('only expands the visible range', () => {
    const m = ev({ id: 'm', rrule: 'FREQ=DAILY' });
    expect(expandEvents([m], range(10))).toHaveLength(27); // 10/5..10/31
    expect(expandEvents([m], range(9))).toHaveLength(0);
  });

  it('exception instance replaces one occurrence; cancelled removes it', () => {
    const m = ev({ id: 'm', rrule: 'FREQ=WEEKLY' });
    const moved = ev({ id: 'x1', title: '옮김', recurrenceParentId: 'm', recurrenceOriginalStart: kstToIso(2026, 10, 12, 9), startAt: kstToIso(2026, 10, 13, 15), endAt: kstToIso(2026, 10, 13, 16) });
    const gone = ev({ id: 'x2', recurrenceParentId: 'm', recurrenceOriginalStart: kstToIso(2026, 10, 19, 9), cancelled: true });
    const out = expandEvents([m, moved, gone], range(10));
    expect(days(out)).toEqual([5, 13, 26]);
    expect(out.find((e) => e.title === '옮김')).toBeTruthy();
  });

  it('keeps plain events and sorts by start', () => {
    const a = ev({ id: 'a', startAt: kstToIso(2026, 10, 20, 9), endAt: kstToIso(2026, 10, 20, 10) });
    const m = ev({ id: 'm', rrule: 'FREQ=WEEKLY' });
    expect(days(expandEvents([a, m], range(10)))).toEqual([5, 12, 19, 20, 26]);
  });

  it('all-day events at KST midnight stay on their date', () => {
    const m = ev({ id: 'm', allDay: true, startAt: kstToIso(2026, 10, 9), endAt: kstToIso(2026, 10, 10), rrule: 'FREQ=YEARLY' });
    const out = expandEvents([m], range(10, 2027));
    expect(days(out)).toEqual([9]);
  });

  it('performance: 200 daily masters over a month stays fast', () => {
    const list = Array.from({ length: 200 }, (_, i) => ev({ id: `m${i}`, rrule: 'FREQ=DAILY' }));
    const t0 = performance.now();
    expandEvents(list, range(10));
    expect(performance.now() - t0).toBeLessThan(500);
  });
});

describe('planEdit / planDelete', () => {
  const master = ev({ id: 'm', rrule: 'FREQ=WEEKLY' });
  const occ = kstToIso(2026, 10, 12, 9);

  it('this: creates an override for that occurrence only', () => {
    const [op] = planEdit(master, occ, { title: '이번만' }, 'this');
    expect(op).toMatchObject({ op: 'create', event: { title: '이번만', recurrenceParentId: 'm', recurrenceOriginalStart: occ, rrule: null, startAt: occ } });
  });

  it('this: updates an existing override instead of creating another', () => {
    const existing = ev({ id: 'x', recurrenceParentId: 'm', recurrenceOriginalStart: occ });
    expect(planEdit(master, occ, { title: 'b' }, 'this', [existing])).toEqual([{ op: 'update', id: 'x', patch: { title: 'b' } }]);
  });

  it('all: updates master, shifting its first occurrence by the same delta', () => {
    const [op] = planEdit(master, occ, { startAt: kstToIso(2026, 10, 12, 11) }, 'all');
    expect(op).toMatchObject({ op: 'update', id: 'm' });
    if (op.op === 'update') {
      expect(op.patch.startAt).toBe(kstToIso(2026, 10, 5, 11));
      expect(op.patch.endAt).toBe(kstToIso(2026, 10, 5, 12));
    }
  });

  it('following: truncates master before the occurrence and creates a new master from it', () => {
    const ops = planEdit(master, occ, { title: '이후' }, 'following');
    expect(ops[0]).toMatchObject({ op: 'update', id: 'm' });
    const rule = (ops[0] as { patch: { rrule: string } }).patch.rrule;
    expect(rule).toMatch(/UNTIL=20261011T235959Z/); // 10/12 09:00 KST 의 1초 전
    expect(ops[1]).toMatchObject({ op: 'create', event: { title: '이후', startAt: occ, rrule: 'FREQ=WEEKLY' } });
    // 잘린 마스터는 이번 회차를 더 이상 만들지 않는다
    const cut = ev({ id: 'm', rrule: rule });
    expect(days(expandEvents([cut], range(10)))).toEqual([5]);
  });

  it('following with COUNT splits the remaining count', () => {
    const counted = ev({ id: 'm', rrule: 'FREQ=WEEKLY;COUNT=6' });
    const ops = planEdit(counted, occ, { title: 'n' }, 'following');
    expect((ops[1] as { event: { rrule: string } }).event.rrule).toContain('COUNT=5');
  });

  it('following on the first occurrence is the same as all', () => {
    expect(planEdit(master, master.startAt, { title: 'z' }, 'following')[0]).toMatchObject({ op: 'update', id: 'm' });
  });

  it('delete: this cancels one occurrence, following truncates, all deletes the master', () => {
    expect(planDelete(master, occ, 'this')[0]).toMatchObject({ op: 'create', event: { cancelled: true, recurrenceOriginalStart: occ } });
    expect(planDelete(master, occ, 'following')[0]).toMatchObject({ op: 'update', id: 'm' });
    expect(planDelete(master, occ, 'all')).toEqual([{ op: 'delete', id: 'm' }]);
  });
});

describe('findFreeSlots', () => {
  const at = (h: number, m = 0) => kstToIso(2026, 10, 14, h, m);
  const busy = (s: number, e: number, extra: Partial<CalendarEvent> = {}) => ev({ id: `b${s}`, startAt: at(s), endAt: at(e), ...extra });

  it('returns gaps between events within working hours', () => {
    const slots = findFreeSlots([busy(10, 11), busy(13, 14)], '2026-10-14', 60);
    expect(slots.map((s) => [s.startAt, s.endAt])).toEqual([[at(9), at(10)], [at(11), at(13)], [at(14), at(18)]]);
  });

  it('drops gaps shorter than the duration and merges overlapping events', () => {
    const slots = findFreeSlots([busy(9, 12), busy(11, 15), busy(15, 17, { id: 'c' })], '2026-10-14', 90);
    expect(slots).toEqual([]);
    expect(findFreeSlots([busy(9, 12), busy(11, 15)], '2026-10-14', 90)).toHaveLength(1);
  });

  it('ignores all-day and cancelled events, and honors a custom range', () => {
    const allDay = ev({ id: 'a', allDay: true, startAt: kstToIso(2026, 10, 14), endAt: kstToIso(2026, 10, 15) });
    const cancelled = busy(10, 11, { cancelled: true, id: 'x' });
    expect(findFreeSlots([allDay, cancelled], '2026-10-14', 30, { start: '12:00', end: '13:00' })).toEqual([{ startAt: at(12), endAt: at(13), minutes: 60 }]);
  });

  it('events on other dates do not block', () => {
    const other = ev({ id: 'o', startAt: kstToIso(2026, 10, 15, 10), endAt: kstToIso(2026, 10, 15, 11) });
    expect(findFreeSlots([other], '2026-10-14', 60)).toHaveLength(1);
  });
});
