// 통합 검색. 다른 영역의 api.ts 만 읽어 조합한다(컴포넌트는 가져오지 않는다).
// 세션 C(S4)가 서버 쿼리 기반 구현으로 교체한다.
import { calendarApi } from '@/features/calendar/api';
import { ledgerApi } from '@/features/ledger/api';
import { todoApi } from '@/features/todo/api';
import { dowOf, hhmm, kstParts, won } from '@/lib/format';
import type { SearchApi, SearchResult } from './types';

const STATUS: Record<string, string> = { todo: '할 일', doing: '진행 중', done: '완료' };

export const searchApi: SearchApi = {
  async search(query) {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    const [events, todos, txs] = await Promise.all([
      calendarApi.listEvents({ from: '2000-01-01T00:00:00Z', to: '2100-01-01T00:00:00Z' }),
      todoApi.listTodos(),
      ledgerApi.listTransactions(),
    ]);
    const out: SearchResult[] = [];
    events.forEach((e) => {
      if (!(e.title + (e.location ?? '') + e.category).toLowerCase().includes(q)) return;
      const p = kstParts(e.startAt);
      out.push({ kind: '일정', title: e.title, sub: `${p.m}월 ${p.d}일 ${e.allDay ? '종일' : hhmm(e.startAt)} · ${e.location ?? ''} · ${e.category}`, right: '', href: `/calendar?view=month&date=${p.y}-${p.m}-${p.d}` });
    });
    todos.forEach((t) => {
      if (!(t.title + (t.project ?? '')).toLowerCase().includes(q)) return;
      const due = t.dueDate ? `${Number(t.dueDate.slice(5, 7))}월 ${Number(t.dueDate.slice(8))}일 마감` : '마감 없음';
      out.push({ kind: '할일', title: t.title, sub: `${t.project ?? ''} · ${due} · ${STATUS[t.status]}`, right: '', href: `/todo?view=list&filter=${t.status === 'done' ? 'done' : 'all'}` });
    });
    txs.forEach((x) => {
      if (!(x.title + x.category + x.account).toLowerCase().includes(q)) return;
      const [y, m, d] = x.date.split('-').map(Number);
      void dowOf(y, m, d);
      out.push({ kind: '거래', title: x.title, sub: `${m}월 ${d}일 · ${x.category} · ${x.account}`, right: (x.type === 'income' ? '+' : '−') + won(x.amount), href: '/ledger?view=tx' });
    });
    return out;
  },
};
