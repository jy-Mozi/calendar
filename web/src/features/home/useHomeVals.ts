'use client';
// 홈 대시보드. 다른 영역의 api.ts 만 읽어 조합한다.
import { useRouter } from 'next/navigation';
import { useApp } from '@/components/shell/AppContext';
import { CD, CL } from '@/components/ui/colors';
import type { Vals } from '@/components/ui/vals';
import { calendarApi } from '@/features/calendar/api';
import { ledgerApi } from '@/features/ledger/api';
import { settingsApi } from '@/features/settings/api';
import { todoApi } from '@/features/todo/api';
import { weatherApi } from '@/features/weather/api';
import { today as getToday } from '@/lib/clock';
import { decorateEvent, decorateTodo, isTodayTodo } from '@/lib/decor';
import { dowOf, kstToIso, won } from '@/lib/format';
import { mutate, patchCache, useQuery } from '@/lib/query';
import type { Todo } from '@/features/todo/types';

export function useHomeVals(): Vals {
  const router = useRouter();
  const { city } = useApp();
  const t = getToday();
  const month = `${t.y}-${String(t.m).padStart(2, '0')}`;
  const from = kstToIso(t.y, t.m, t.d);
  const to = kstToIso(t.y, t.m, t.d + 1);

  const { data: events = [] } = useQuery(`events:day:${from}`, () => calendarApi.listEvents({ from, to }));
  const { data: todos = [] } = useQuery('todos:all', () => todoApi.listTodos());
  const { data: summary } = useQuery(`ledger:summary:${month}`, () => ledgerApi.getMonthSummary(month));
  const { data: budgetRows = [] } = useQuery(`ledger:budget:${month}`, () => ledgerApi.getBudgetStatus(month));
  const { data: forecast } = useQuery('weather:forecast', () => weatherApi.getForecast({ label: city }));
  const { data: settings } = useQuery('settings', () => settingsApi.getSettings());
  const { data: tokens = [] } = useQuery('settings:tokens', () => settingsApi.listTokens());

  const toggle = (x: Todo) => () => void mutate({
    optimistic: () => patchCache<Todo[]>('todos:all', (old) => (old ?? []).map((y) => (y.id === x.id ? { ...y, status: x.status === 'done' ? 'todo' : 'done' } : y))),
    run: () => todoApi.setStatus(x.id, x.status === 'done' ? 'todo' : 'done'),
    invalidate: ['todos:'],
  }).catch(() => {});
  const todayTodos = todos.filter(isTodayTodo).map((x) => decorateTodo(x, toggle(x)));

  const budgetTotal = budgetRows.reduce((a, b) => a + b.budget, 0);
  const budgetPct = budgetTotal ? Math.round((budgetRows.reduce((a, b) => a + b.spent, 0) / budgetTotal) * 100) : 0;
  const warn = budgetRows
    .map((b) => ({ name: b.category, pct: Math.round((b.spent / b.budget) * 100) }))
    .filter((b) => b.pct >= 80)
    .sort((a, b) => b.pct - a.pct)[0];
  const h = warn && warn.pct >= 100 ? 25 : 55;
  const warnBudget = warn ? { ...warn, badge: warn.pct >= 100 ? '초과' : '주의', badgeBg: CL(h), txt: CD(h) } : null;

  const week = (forecast?.daily ?? []).map((d) => {
    const [y, m, dd] = d.date.split('-').map(Number);
    return { d: dowOf(y, m, dd), s: d.summary, pTxt: d.precipPct >= 30 ? d.precipPct + '%' : '', hi: d.hi, lo: d.lo };
  });

  return {
    city, week,
    todayEvents: events.map(decorateEvent), todayEventCount: events.length,
    todayTodos, todayTotal: todayTodos.length, todayDone: todayTodos.filter((x) => x.done).length, todoLeft: todayTodos.filter((x) => !x.done).length,
    expenseTxt: won(summary?.expense ?? 0), incomeTxt: won(summary?.income ?? 0), balanceTxt: won((summary?.income ?? 0) - (summary?.expense ?? 0)),
    budgetPct, budgetBar: Math.min(budgetPct, 100), warnBudget,
    gcalBadge: settings?.google.connected ? 'Google 캘린더 동기화됨 · 2분 전' : 'Google 캘린더 연결 안 됨', tokenCount: tokens.length,
    goCal: () => router.push('/calendar?view=month'),
  };
}
