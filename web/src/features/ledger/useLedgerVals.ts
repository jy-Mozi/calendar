'use client';
// 가계부 화면 표시 값. ?view=tx|cal|stats|budget|assets|rec  ?filter=all|income|expense
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useApp } from '@/components/shell/AppContext';
import { C, CD, CL, ledgerHue, MUTED, pill, sw } from '@/components/ui/colors';
import type { Vals } from '@/components/ui/vals';
import { ledgerApi } from '@/features/ledger/api';
import { today as getToday } from '@/lib/clock';
import { DOW, daysInMonth, firstDow, won } from '@/lib/format';
import { mutate, patchCache, useQuery } from '@/lib/query';
import type { Account, Recurring } from './types';

const ACCOUNT_LABEL = { bank: '통장', cash: '현금', card: '카드' } as const;
const ACCOUNT_HUE = { bank: 255, cash: 155, card: 55 } as const;

export function useLedgerVals(): Vals {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const { weekStart, openQuickAdd } = useApp();
  const t = getToday();
  const month = `${t.y}-${String(t.m).padStart(2, '0')}`;
  const view = params.get('view') ?? 'tx';
  const txFilter = params.get('filter') ?? 'all';
  const setFilter = (f: string) => router.replace(`${pathname}?view=${view}&filter=${f}`, { scroll: false });

  const { data: txs = [] } = useQuery('ledger:tx', () => ledgerApi.listTransactions());
  const { data: summary } = useQuery(`ledger:summary:${month}`, () => ledgerApi.getMonthSummary(month));
  const { data: budgetRows = [] } = useQuery(`ledger:budget:${month}`, () => ledgerApi.getBudgetStatus(month));
  const { data: accountRows = [] } = useQuery('ledger:accounts', () => ledgerApi.listAccounts());
  const { data: recurringRows = [] } = useQuery('ledger:recurring', () => ledgerApi.listRecurring());

  const expense = summary?.expense ?? 0;
  const income = summary?.income ?? 0;

  // 예산
  const budgetTotal = budgetRows.reduce((a, b) => a + b.budget, 0);
  const budgetPct = budgetTotal ? Math.round((budgetRows.reduce((a, b) => a + b.spent, 0) / budgetTotal) * 100) : 0;
  const budgets = budgetRows.map((b) => {
    const pct = Math.round((b.spent / b.budget) * 100);
    const h = pct >= 100 ? 25 : pct >= 80 ? 55 : 155;
    const left = b.budget - b.spent;
    return {
      name: b.category, pct, w: Math.min(pct, 100), spentTxt: won(b.spent), amtTxt: won(b.budget), bar: C(h), txt: pct >= 80 ? CD(h) : '#15171a',
      badge: pct >= 100 ? '초과' : pct >= 80 ? '주의' : '', badgeBg: CL(h), leftTxt: left >= 0 ? `${won(left)}원 남음` : `${won(-left)}원 초과`,
    };
  });
  const warnBudget = budgets.filter((b) => b.pct >= 80).sort((a, b) => b.pct - a.pct)[0] ?? null;

  // 거래 목록
  const shown = txs.filter((x) => txFilter === 'all' || x.type === txFilter);
  const txSum = shown.reduce((a, x) => a + (x.type === 'income' ? x.amount : -x.amount), 0);
  const txList = shown.map((x) => ({
    ...x, cat: x.category, date: Number(x.date.slice(8)), cat1: x.category[0], bg: CL(ledgerHue(x.category)), fg: CD(ledgerHue(x.category)),
    amtTxt: (x.type === 'income' ? '+' : '−') + won(x.amount) + '원', amtColor: x.type === 'income' ? CD(255) : '#15171a',
  }));
  const txFilters = ([['all', '전체'], ['income', '수입'], ['expense', '지출']] as const).map(([k, label]) => ({ label, ...pill(txFilter === k), go: () => setFilter(k) }));

  // 월간 달력
  const lead = (firstDow(t.y, t.m) - weekStart + 7) % 7;
  const blank = { label: '', bg: 'transparent', numFg: '#15171a', inc: '', exp: '' };
  const lgCells: Vals[] = Array.from({ length: lead }, () => blank);
  const dayColor = (d: number) => { const i = new Date(Date.UTC(t.y, t.m - 1, d)).getUTCDay(); return i === 0 ? CD(25) : i === 6 ? CD(255) : '#15171a'; };
  for (let d = 1; d <= daysInMonth(t.y, t.m); d++) {
    const row = summary?.daily.find((x) => Number(x.date.slice(8)) === d);
    lgCells.push({ label: d, bg: d === t.d ? CL(55) : '#f7f8f9', numFg: dayColor(d), inc: row?.income ? '+' + won(row.income) : '', exp: d <= t.d && row?.expense ? '−' + won(row.expense) : '' });
  }
  while (lgCells.length % 7) lgCells.push(blank);
  const dows = [...DOW.slice(weekStart), ...DOW.slice(0, weekStart)].map((x) => ({ t: x, c: x === '일' ? CD(25) : x === '토' ? CD(255) : MUTED }));

  // 통계
  const shares = (summary?.byCategory ?? []).map((c) => (expense ? (c.amount / expense) * 100 : 0));
  const starts = shares.map((_, i) => shares.slice(0, i).reduce((a, b) => a + b, 0));
  const catShare = (summary?.byCategory ?? []).map((c, i) => ({
    name: c.name, amt: c.amount, pct: Math.round(shares[i]), color: C(ledgerHue(c.name)), amtTxt: won(c.amount) + '원',
  }));
  const stops = catShare.map((c, i) => `${c.color} ${starts[i]}% ${starts[i] + shares[i]}%`);
  const tMax = Math.max(1, ...(summary?.trend ?? []).map((x) => x.expense));
  const trend = (summary?.trend ?? []).map((x, i, arr) => ({ m: x.month, v: (x.expense / 10000).toFixed(0) + '만', h: Math.round((x.expense / tMax) * 80), bg: i === arr.length - 1 ? C(55) : '#d7dbe1' }));
  const prev = summary?.prevMonthExpense ?? 0;
  const mom = prev ? Math.round(((expense - prev) / prev) * 100) : 0;

  // 계좌
  const accounts = accountRows.map((a: Account) => {
    const h = ACCOUNT_HUE[a.type];
    return { ...a, type: ACCOUNT_LABEL[a.type], bal: a.balance, balTxt: (a.balance < 0 ? '−' : '') + won(Math.abs(a.balance)), bg: CL(h), fg: CD(h), amtColor: a.balance < 0 ? CD(25) : '#15171a' };
  });

  // 고정지출
  const recurring = recurringRows.map((r: Recurring) => ({
    ...r, cat: r.category, on: r.active, ...sw(r.active), op: r.active ? 1 : 0.5, bg: CL(ledgerHue(r.category)), fg: CD(ledgerHue(r.category)),
    next: r.day > t.d ? `${t.m}월 ${r.day}일` : `${t.m === 12 ? 1 : t.m + 1}월 ${r.day}일`,
    amtTxt: (r.type === 'income' ? '+' : '−') + won(r.amount) + '원', amtColor: r.type === 'income' ? CD(255) : '#15171a',
    flip: () => void mutate({
      optimistic: () => patchCache<Recurring[]>('ledger:recurring', (old) => (old ?? []).map((x) => (x.id === r.id ? { ...x, active: !x.active } : x))),
      run: () => ledgerApi.setRecurringActive(r.id, !r.active),
      invalidate: ['ledger:recurring'],
    }).catch(() => {}),
  }));
  const recTotal = recurringRows.filter((r) => r.active && r.type === 'expense').reduce((a, r) => a + r.amount, 0);

  return {
    isLedger: true, isLgTx: view === 'tx', isLgCal: view === 'cal', isLgStats: view === 'stats', isLgBudget: view === 'budget', isLgAssets: view === 'assets', isLgRec: view === 'rec',
    expenseTxt: won(expense), expenseShort: (expense / 10000).toFixed(0) + '만원', incomeTxt: won(income), balanceTxt: won(income - expense),
    budgetPct, budgetBar: Math.min(budgetPct, 100), budgetTotalTxt: won(budgetTotal), warnBudget, budgets,
    txFilters, txList, txSumTxt: (txSum >= 0 ? '+' : '−') + won(Math.abs(txSum)) + '원',
    lgCells, dows, donut: `conic-gradient(${stops.join(',')})`, catShare, trend,
    momTxt: `${t.m === 1 ? 12 : t.m - 1}월 대비 ${Math.abs(mom)}% ${mom >= 0 ? '증가' : '감소'}`, momColor: mom >= 0 ? CD(25) : CD(155),
    accounts, netWorthTxt: won(accountRows.reduce((a, x) => a + x.balance, 0)), recurring, recTotalTxt: won(recTotal),
    addTx: () => openQuickAdd('tx'),
  };
}
