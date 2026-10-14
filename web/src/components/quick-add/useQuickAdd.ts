'use client';
// 빠른 추가(CM-08) 상태와 저장 로직. 저장은 각 영역의 api.ts 를 호출한다.
import { useCallback, useEffect, useState } from 'react';
import { C, CD, CL, EVENT_HUE, pill } from '@/components/ui/colors';
import { useToast } from '@/components/ui/toast';
import type { Vals } from '@/components/ui/vals';
import { calendarApi } from '@/features/calendar/api';
import { ledgerApi } from '@/features/ledger/api';
import { todoApi } from '@/features/todo/api';
import { today as getToday } from '@/lib/clock';
import { kstToIso, won, ymd } from '@/lib/format';
import { invalidate } from '@/lib/query';
import type { QuickAddType } from './types';

const LEDGER_CATS = ['식비', '교통', '쇼핑', '문화', '생활'];
const PRIO = { 상: 1, 중: 2, 하: 3 } as const;

export function useQuickAdd() {
  const flash = useToast();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState<QuickAddType>('event');
  const [title, setTitle] = useState('');
  const [day, setDay] = useState<string | number>(getToday().d);
  const [time, setTime] = useState('10:00');
  const [prio, setPrio] = useState<keyof typeof PRIO>('중');
  const [amt, setAmt] = useState('');
  const [cat, setCat] = useState('식비');
  const [evCat, setEvCat] = useState('업무');
  const [err, setErr] = useState('');

  const show = useCallback((t: QuickAddType = 'event', extra: { day?: number } = {}) => {
    setOpen(true); setType(t); setTitle(''); setAmt(''); setErr(''); setDay(extra.day ?? getToday().d);
  }, []);

  const save = async () => {
    const t = getToday();
    const name = title.trim();
    if (!name) return setErr(type === 'tx' ? '내용을 입력하세요.' : '제목을 입력하세요.');
    try {
      if (type === 'event') {
        const d = Math.min(31, Math.max(1, parseInt(String(day)) || t.d));
        const allDay = !time;
        const [hh, mm] = allDay ? [0, 0] : time.split(':').map(Number);
        await calendarApi.createEvent({
          title: name, location: '직접 입력', memo: null, category: evCat, allDay,
          startAt: kstToIso(t.y, t.m, d, hh, mm), endAt: allDay ? kstToIso(t.y, t.m, d + 1) : kstToIso(t.y, t.m, d, hh + 1, mm),
        });
        flash(`${t.m}월 ${d}일 일정을 추가했어요`);
      } else if (type === 'todo') {
        await todoApi.createTodo({ title: name, priority: PRIO[prio], project: '개인', dueDate: ymd(t), status: 'todo' });
        flash('오늘 할일에 추가했어요');
      } else {
        const amount = parseInt(amt.replace(/\D/g, '')) || 0;
        if (!amount) return setErr('금액을 입력하세요.');
        await ledgerApi.createTransaction({ title: name, category: cat, amount, type: 'expense', account: '신용카드', date: ymd(t) });
        flash(`${cat} ${won(amount)}원을 기록했어요`);
      }
      setOpen(false);
      ['events:', 'todos:', 'ledger:', 'search:', 'settings:'].forEach(invalidate);
    } catch {
      setErr('저장하지 못했어요. 다시 시도해 주세요.');
    }
  };

  // 전역 단축키: N 열기(입력 중 제외), Esc 닫기
  useEffect(() => {
    const on = (e: KeyboardEvent) => {
      const tag = ((e.target as HTMLElement | null)?.tagName ?? '').toLowerCase();
      if (e.key === 'Escape' && open) setOpen(false);
      else if ((e.key === 'n' || e.key === 'N') && !['input', 'select', 'textarea'].includes(tag) && !open && !e.metaKey && !e.ctrlKey) { e.preventDefault(); show('event'); }
    };
    window.addEventListener('keydown', on);
    return () => window.removeEventListener('keydown', on);
  }, [open, show]);

  const digits = amt.replace(/\D/g, '');
  const vals: Vals = {
    qaOpen: open, closeQA: () => setOpen(false), stop: (e: { stopPropagation: () => void }) => e.stopPropagation(), saveQA: save,
    qaKey: (e: { key: string }) => { if (e.key === 'Enter') void save(); },
    qaTypes: ([['event', '일정'], ['todo', '할일'], ['tx', '거래']] as const).map(([k, label]) => ({ label, ...pill(type === k), go: () => { setType(k); setErr(''); } })),
    qaIsEvent: type === 'event', qaIsTodo: type === 'todo', qaIsTx: type === 'tx',
    qaTitleLabel: type === 'tx' ? '내용' : '제목', qaPh: type === 'event' ? '예) 치과 예약' : type === 'todo' ? '예) 보고서 제출' : '예) 점심 김밥',
    qaTitle: title, qaDay: day, qaTime: time, qaAmtTxt: digits ? won(parseInt(digits)) : '', qaCat: cat, qaErr: err,
    setTitle: (e: { target: { value: string } }) => { setTitle(e.target.value); setErr(''); },
    setDay: (e: { target: { value: string } }) => setDay(e.target.value),
    setTime: (e: { target: { value: string } }) => setTime(e.target.value),
    setAmt: (e: { target: { value: string } }) => { setAmt(e.target.value); setErr(''); },
    setCat: (e: { target: { value: string } }) => setCat(e.target.value),
    prioOpts: (['상', '중', '하'] as const).map((label) => ({ label, bd: prio === label ? '#15171a' : '#dfe2e6', go: () => setPrio(label) })),
    evCatOpts: Object.keys(EVENT_HUE).filter((k) => k !== '기념').map((label) => ({
      label, bd: evCat === label ? C(EVENT_HUE[label]) : '#dfe2e6', bg: evCat === label ? CL(EVENT_HUE[label]) : '#fff', fg: evCat === label ? CD(EVENT_HUE[label]) : '#5b6068', go: () => setEvCat(label),
    })),
    catNames: LEDGER_CATS,
  };
  return { open: show, vals };
}
