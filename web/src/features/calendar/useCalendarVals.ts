'use client';
// 일정 화면(월간·주간·목록)이 쓰는 표시 값을 만든다. 데이터는 api 에서 읽고, 선택 날짜·보기는 URL 쿼리에서 읽는다.
//   ?view=month|week|list   ?date=YYYY-MM-DD(선택한 날)   ?cat=업무(목록 필터)
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useApp } from '@/components/shell/AppContext';
import { C, CD, CL, EVENT_HUE, eventHue, MUTED, pill } from '@/components/ui/colors';
import type { Vals } from '@/components/ui/vals';
import { calendarApi } from '@/features/calendar/api';
import { ledgerApi } from '@/features/ledger/api';
import { todoApi } from '@/features/todo/api';
import { weatherApi } from '@/features/weather/api';
import { today as getToday } from '@/lib/clock';
import { decorateEvent } from '@/lib/decor';
import { DOW, dowOf, firstDow, hhmm, kstParts, kstToIso, daysInMonth, ymd } from '@/lib/format';
import { useQuery } from '@/lib/query';
import type { CalendarEvent } from './types';

const sortEv = (a: CalendarEvent, b: CalendarEvent) => a.startAt.localeCompare(b.startAt);

export function useCalendarVals(): Vals {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const { weekStart, openQuickAdd, city } = useApp();
  const t = getToday();
  const [ovTodo, setOvTodo] = useState(true);
  const [ovBill, setOvBill] = useState(true);

  const dateParam = params.get('date');
  const [sy, sm, sd] = dateParam ? dateParam.split('-').map(Number) : [t.y, t.m, t.d];
  const evCat = params.get('cat') ?? '전체';
  const setParam = (patch: Record<string, string | null>) => {
    const next = new URLSearchParams(params.toString());
    Object.entries(patch).forEach(([k, v]) => (v === null ? next.delete(k) : next.set(k, v)));
    router.replace(`${pathname}?${next.toString()}`, { scroll: false });
  };

  const monthFrom = kstToIso(sy, sm, 1);
  const monthTo = kstToIso(sm === 12 ? sy + 1 : sy, sm === 12 ? 1 : sm + 1, 1);
  const { data: events = [] } = useQuery(`events:${monthFrom}`, () => calendarApi.listEvents({ from: monthFrom, to: monthTo }));
  const { data: upcomingEvents = [] } = useQuery('events:upcoming', () =>
    calendarApi.listEvents({ from: kstToIso(t.y, t.m, t.d), to: kstToIso(t.y + 1, t.m, t.d) }),
  );
  const { data: todos = [] } = useQuery('todos:all', () => todoApi.listTodos());
  const { data: recurring = [] } = useQuery('ledger:recurring', () => ledgerApi.listRecurring());
  const { data: forecast } = useQuery('weather:forecast', () => weatherApi.getForecast({ label: city }));

  const wx = new Map((forecast?.daily ?? []).map((d) => [d.date, d]));
  const wxOf = (y: number, m: number, d: number) => wx.get(`${y}-${m}-${d}`);
  const wxTxt = (y: number, m: number, d: number) => { const w = wxOf(y, m, d); return w ? `${w.summary} ${w.hi}°` : ''; };

  const dowIdx = (d: number) => new Date(Date.UTC(sy, sm - 1, d)).getUTCDay();
  const dayColor = (d: number) => { const i = dowIdx(d); return i === 0 ? CD(25) : i === 6 ? CD(255) : '#15171a'; };
  const isToday = (d: number) => sy === t.y && sm === t.m && d === t.d;
  const dayOf = (e: CalendarEvent) => kstParts(e.startAt).d;

  // 월간
  const lead = (firstDow(sy, sm) - weekStart + 7) % 7;
  const blank = { label: '', wx: '', chips: [], bg: 'transparent', ol: 'none', cur: 'default', numBg: 'transparent', numFg: '#15171a', pick: null };
  const cells: Vals[] = Array.from({ length: lead }, () => blank);
  const dim = daysInMonth(sy, sm);
  for (let d = 1; d <= dim; d++) {
    const chips = events.filter((e) => dayOf(e) === d).sort(sortEv).map((e) => {
      const h = eventHue(e.category);
      return { title: (e.allDay ? '' : hhmm(e.startAt) + ' ') + e.title, bg: CL(h), fg: CD(h), bd: 'transparent' };
    });
    const dueKey = ymd({ y: sy, m: sm, d });
    if (ovTodo) todos.filter((x) => x.dueDate === dueKey && x.status !== 'done').forEach((x) => chips.push({ title: '마감 · ' + x.title, bg: '#fff', fg: CD(155), bd: C(155) }));
    if (ovBill) recurring.filter((r) => r.active && r.day === d && r.type === 'expense').forEach((r) => chips.push({ title: '결제 · ' + r.title, bg: '#fff', fg: CD(55), bd: C(55) }));
    const vis = chips.slice(0, 3);
    if (chips.length > 3) vis.push({ title: `+${chips.length - 3}개`, bg: '#f1f2f4', fg: MUTED, bd: 'transparent' });
    const sel = sd === d;
    cells.push({
      label: d, wx: wxTxt(sy, sm, d), chips: vis, bg: sel ? CL(255) : '#f7f8f9', ol: sel ? `2px solid ${C(255)}` : 'none', cur: 'pointer',
      numBg: isToday(d) ? '#15171a' : 'transparent', numFg: isToday(d) ? '#fff' : dayColor(d),
      pick: () => setParam({ date: ymd({ y: sy, m: sm, d }) }),
    });
  }
  while (cells.length % 7) cells.push(blank);
  const dows = [...DOW.slice(weekStart), ...DOW.slice(0, weekStart)].map((x) => ({ t: x, c: x === '일' ? CD(25) : x === '토' ? CD(255) : MUTED }));
  const selEvents = events.filter((e) => dayOf(e) === sd).sort(sortEv).map(decorateEvent);
  const sw = wxOf(sy, sm, sd);
  const overlays = ([['할일 마감', 155, ovTodo, setOvTodo], ['결제일', 55, ovBill, setOvBill]] as const).map(([label, h, on, set]) => ({
    label, mark: on ? '✓' : '+', bd: on ? C(h) : '#dfe2e6', bg: on ? CL(h) : '#fff', fg: on ? CD(h) : MUTED, flip: () => set(!on),
  }));

  // 주간: 오늘이 속한 월요일 시작 주
  const base = new Date(Date.UTC(t.y, t.m - 1, t.d));
  base.setUTCDate(base.getUTCDate() - ((base.getUTCDay() + 6) % 7));
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const x = new Date(base); x.setUTCDate(base.getUTCDate() + i);
    const y = x.getUTCFullYear(), m = x.getUTCMonth() + 1, d = x.getUTCDate();
    const isT = y === t.y && m === t.m && d === t.d;
    const dow = x.getUTCDay();
    const evs = events.filter((e) => { const p = kstParts(e.startAt); return p.y === y && p.m === m && p.d === d; }).map((e) => {
      const p = kstParts(e.startAt);
      const h = eventHue(e.category);
      return { title: e.title, timeTxt: e.allDay ? '종일' : hhmm(e.startAt), top: e.allDay ? 0 : Math.max(0, (p.hh - 8) * 48 + p.mm * 0.8), h: e.allDay ? 30 : 52, bg: CL(h), fg: CD(h), bd: C(h) };
    });
    return { date: d, dow: DOW[dow], wx: wxTxt(y, m, d), numBg: isT ? '#15171a' : 'transparent', numFg: isT ? '#fff' : dow === 0 ? CD(25) : dow === 6 ? CD(255) : '#15171a', colBg: isT ? 'oklch(0.985 0.01 255)' : 'transparent', evs };
  });
  const hours = Array.from({ length: 14 }, (_, i) => String(i + 8).padStart(2, '0') + ':00');

  // 목록
  const evCatFilters = ['전체', ...Object.keys(EVENT_HUE)].map((label) => ({ label, ...pill(evCat === label), go: () => setParam({ cat: label === '전체' ? null : label }) }));
  const upEvents = upcomingEvents.filter((e) => evCat === '전체' || e.category === evCat);
  const dayKeys = [...new Set(upEvents.map((e) => ymd(kstParts(e.startAt))))].sort();
  const upcoming = dayKeys.map((key) => {
    const [y, m, d] = key.split('-').map(Number);
    const diff = Math.round((Date.UTC(y, m - 1, d) - Date.UTC(t.y, t.m - 1, t.d)) / 86400000);
    const w = wxOf(y, m, d);
    return {
      dateTxt: `${m}월 ${d}일 ${dowOf(y, m, d)}`, rel: diff === 0 ? '오늘' : diff === 1 ? '내일' : `${diff}일 후`,
      wx: w ? `${w.summary} ${w.hi}° / ${w.lo}°` : '',
      items: upEvents.filter((e) => ymd(kstParts(e.startAt)) === key).sort(sortEv).map(decorateEvent),
    };
  });

  // 주간 상단의 7일 날씨 띠는 홈과 같은 데이터
  const week = (forecast?.daily ?? []).map((d) => ({ d: dowOf(...(d.date.split('-').map(Number) as [number, number, number])), s: d.summary, pTxt: d.precipPct >= 30 ? d.precipPct + '%' : '', hi: d.hi, lo: d.lo }));

  return {
    dows, cells, overlays, hours, weekDays, evCatFilters, upcoming, week,
    selDay: sd, selDow: dowOf(sy, sm, sd), selEvents, selEmpty: selEvents.length === 0,
    selWx: sw ? `${sw.summary} · 최고 ${sw.hi}° / 최저 ${sw.lo}° · 강수 ${sw.precipPct}%` : '',
    goToday: () => setParam({ date: ymd(t) }),
    addEventSel: () => openQuickAdd('event', { day: sd }),
  };
}
