'use client';
// 설정 화면. ?section=int|cat|noti|view|backup|profile
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useApp } from '@/components/shell/AppContext';
import { C, CD, CL, EVENT_HUE, LEDGER_HUE, sw } from '@/components/ui/colors';
import { useToast } from '@/components/ui/toast';
import type { Vals } from '@/components/ui/vals';
import { calendarApi } from '@/features/calendar/api';
import { ledgerApi } from '@/features/ledger/api';
import { settingsApi } from '@/features/settings/api';
import { todoApi } from '@/features/todo/api';
import { mutate, useQuery } from '@/lib/query';
import type { McpScope, NotificationKey, Settings } from './types';

const NOTI_DEFS: [NotificationKey, string, string][] = [
  ['ev', '일정 알림', '시작 10분 전 · 웹 푸시'], ['todo', '할일 마감 알림', '마감일 오전 9시'], ['b80', '예산 80% 도달', '카테고리별 주의 알림'],
  ['b100', '예산 초과', '100% 넘으면 즉시 알림'], ['rain', '우산 알림', '비·눈 예보일에 일정이 있으면 전날 저녁'], ['mail', '이메일 알림', '웹 푸시를 받을 수 없을 때 대신'],
];
const SECTIONS = [['int', '외부 연동'], ['cat', '카테고리·태그'], ['noti', '알림'], ['view', '화면'], ['backup', '백업·내보내기'], ['profile', '프로필·계정']] as const;

function download(name: string, text: string, mime: string) {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([text], { type: mime }));
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

export function useSettingsVals(): Vals {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const flash = useToast();
  const { city } = useApp();
  const section = params.get('section') ?? 'int';
  const [scope, setScope] = useState<McpScope>('read · write');
  const [newToken, setNewToken] = useState('');

  const { data: settings } = useQuery('settings', () => settingsApi.getSettings());
  const { data: tokenRows = [] } = useQuery('settings:tokens', () => settingsApi.listTokens());
  const { data: events = [] } = useQuery('settings:events', () => calendarApi.listEvents({ from: '2000-01-01T00:00:00Z', to: '2100-01-01T00:00:00Z' }));
  const { data: todos = [] } = useQuery('settings:todos', () => todoApi.listTodos());
  const { data: txs = [] } = useQuery('settings:tx', () => ledgerApi.listTransactions());

  const update = (patch: Partial<Settings>) => void mutate({ run: () => settingsApi.updateSettings(patch), invalidate: ['settings'] }).catch(() => {});
  const s = settings;
  const g = s?.google;

  const setNav = SECTIONS.map(([k, label]) => ({
    label, bg: section === k ? '#15171a' : 'transparent', fg: section === k ? '#fff' : '#3f444b',
    go: () => { setNewToken(''); router.replace(`${pathname}?section=${k}`, { scroll: false }); },
  }));
  const gcals = (g?.calendars ?? []).map((c, i) => ({
    name: c.name, color: C(c.hue), count: c.count, ...sw(c.on),
    flip: () => g && update({ google: { ...g, calendars: g.calendars.map((x, j) => (j === i ? { ...x, on: !x.on } : x)) } }),
  }));
  const notis = NOTI_DEFS.map(([k, label, desc]) => ({
    label, desc, ...sw(!!s?.notifications[k]), flip: () => s && update({ notifications: { ...s.notifications, [k]: !s.notifications[k] } }),
  }));
  const opt = (on: boolean, label: string, go: () => void) => ({ label, bd: on ? '#15171a' : '#dfe2e6', bg: on ? '#15171a' : '#fff', fg: on ? '#fff' : '#15171a', go });
  const viewOpts = [
    { label: '테마', opts: (['라이트', '다크', '시스템'] as const).map((v) => opt(s?.theme === v, v, () => update({ theme: v }))) },
    { label: '한 주 시작 요일', opts: ([['일요일', 0], ['월요일', 1]] as const).map(([v, n]) => opt(s?.weekStart === n, v, () => update({ weekStart: n }))) },
    { label: '통화 단위', opts: [opt(true, 'KRW (원)', () => {})] },
  ];
  const hueItem = (name: string, h: number) => ({ name, bg: CL(h), fg: CD(h), dot: C(h) });
  const catGroups = [
    { title: '일정 카테고리', items: Object.entries(EVENT_HUE).map(([n, h]) => hueItem(n, h)) },
    { title: '할일 프로젝트', items: [['업무', 255], ['생활', 155], ['개인', 320]].map(([n, h]) => hueItem(n as string, h as number)) },
    { title: '가계부 카테고리', items: Object.entries(LEDGER_HUE).filter(([n]) => n !== '급여').map(([n, h]) => hueItem(n, h)).concat([hueItem('급여(수입)', 255)]) },
  ];
  const cities = ['서울', '성남', '부산', '제주'].map((name) => ({ name, ...opt(city === name, name, () => update({ city: name })), bd: city === name ? '#15171a' : '#dfe2e6' }));
  const scopeOpts = (['read', 'read · write'] as const).map((label) => ({ label, bd: scope === label ? '#15171a' : '#dfe2e6', go: () => setScope(label) }));
  const tokens = tokenRows.map((t) => ({
    ...t, revoke: () => void mutate({ run: () => settingsApi.revokeToken(t.id), invalidate: ['settings:tokens'] }).then(() => flash(`${t.name} 토큰을 폐기했어요`)).catch(() => {}),
  }));

  return {
    city, setNav, gcals, notis, viewOpts, catGroups, cities, scopeOpts, tokens, newToken,
    isSetInt: section === 'int', isSetCat: section === 'cat', isSetNoti: section === 'noti', isSetView: section === 'view', isSetBackup: section === 'backup', isSetProfile: section === 'profile',
    gcalOn: !!g?.connected, gcalStatus: g?.connected ? `${g.email} · 마지막 동기화 2분 전` : '연결하면 Google 일정과 양방향으로 동기화돼요',
    gcalBtn: g?.connected ? '연결 해제' : 'Google 계정 연결', gcalBtnBg: g?.connected ? '#f1f2f4' : '#15171a', gcalBtnFg: g?.connected ? '#15171a' : '#fff',
    toggleGcal: () => { if (!g) return; update({ google: { ...g, connected: !g.connected } }); flash(g.connected ? 'Google 캘린더 연결을 해제했어요' : 'Google 캘린더를 연결했어요'); },
    issueToken: () => void mutate({ run: () => settingsApi.issueToken(scope), invalidate: ['settings:tokens'] }).then((r) => setNewToken(r.raw)).catch(() => {}),
    mcpLogs: [['12:41', 'ledger.add_transaction', '성공'], ['12:40', 'calendar.get_weather', '성공'], ['09:02', 'todo.list_todos', '성공'], ['어제', 'calendar.delete_event', 'confirm 필요']].map(([t, tool, r]) => ({ t, tool, r, c: r === '성공' ? CD(155) : CD(55) })),
    evCount: events.length, tdCount: todos.length, txCount: txs.length,
    exportJson: () => { download('오늘한장-backup.json', JSON.stringify({ events, todos, transactions: txs }, null, 2), 'application/json'); flash('오늘한장-backup.json 내려받기를 시작했어요'); },
    exportCsv: () => {
      download('거래내역.csv', '﻿날짜,내용,카테고리,유형,금액,계좌\n' + txs.map((x) => `${x.date},${x.title},${x.category},${x.type === 'income' ? '수입' : '지출'},${x.amount},${x.account}`).join('\n'), 'text/csv');
      flash('거래내역.csv 내려받기를 시작했어요');
    },
  };
}
