'use client';
// 상단 로고·탭·서브탭·빠른 추가 버튼을 그리는 셸. 탭과 서브탭 선택은 URL 에서 읽는다.
//   /            홈
//   /calendar    ?view=month|week|list
//   /todo        ?view=list|board
//   /ledger      ?view=tx|cal|stats|budget|assets|rec
//   /search, /settings(?section=…)
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';
import { QuickAddModal } from '@/components/quick-add/QuickAddModal';
import { useQuickAdd } from '@/components/quick-add/useQuickAdd';
import { INK, MUTED, pill } from '@/components/ui/colors';
import { ToastProvider } from '@/components/ui/toast';
import { settingsApi } from '@/features/settings/api';
import { useQuery } from '@/lib/query';
import { AppProvider } from './AppContext';

const FONT = 'YeogiOttaeJalnan,Pretendard,sans-serif';
const TABS = [['/', '홈'], ['/calendar', '일정'], ['/todo', '할일'], ['/ledger', '가계부']] as const;
const SUBS: Record<string, { key: string; def: string; items: readonly (readonly [string, string])[] }> = {
  '/calendar': { key: 'view', def: 'month', items: [['month', '월간'], ['week', '주간'], ['list', '일정 목록']] },
  '/todo': { key: 'view', def: 'list', items: [['list', '목록'], ['board', '보드']] },
  '/ledger': { key: 'view', def: 'tx', items: [['tx', '거래내역'], ['cal', '월간 달력'], ['stats', '통계'], ['budget', '예산'], ['assets', '자산·계좌'], ['rec', '고정지출']] },
};

const base = { border: 0, cursor: 'pointer', borderRadius: 999, font: `600 14px ${FONT}`, textDecoration: 'none', whiteSpace: 'nowrap' } as const;

function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const params = useSearchParams();
  const { data: settings } = useQuery('settings', () => settingsApi.getSettings());
  const qa = useQuickAdd();
  const ctx = useMemo(() => ({ city: settings?.city ?? '서울', weekStart: settings?.weekStart ?? 0, openQuickAdd: qa.open }), [settings, qa.open]);

  const sub = SUBS[pathname];
  const cur = sub ? (params.get(sub.key) ?? sub.def) : '';
  const onSearch = pathname === '/search';
  const onSet = pathname === '/settings';
  const quickType = pathname === '/todo' ? 'todo' : pathname === '/ledger' ? 'tx' : 'event';

  return (
    <AppProvider value={ctx}>
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', maxWidth: 1360, margin: '0 auto', paddingBottom: 110 }}>
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, padding: '22px 28px', flexWrap: 'wrap' }}>
          <Link href="/" style={{ font: `400 20px ${FONT}`, letterSpacing: '-.02em', color: INK, textDecoration: 'none' }}>오늘한장</Link>
          <nav aria-label="주 메뉴" style={{ display: 'flex', gap: 4, background: '#fff', padding: 5, borderRadius: 999, overflowX: 'auto' }}>
            {TABS.map(([href, label]) => {
              const on = href === '/' ? pathname === '/' : pathname.startsWith(href);
              const c = pill(on);
              return <Link key={href} href={href} aria-current={on ? 'page' : undefined} style={{ ...base, padding: '8px 18px', background: c.bg, color: c.fg }}>{label}</Link>;
            })}
          </nav>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <Link href="/search" style={{ ...base, padding: '10px 16px', background: onSearch ? INK : '#fff', color: onSearch ? '#fff' : '#3f444b' }}>검색</Link>
            <Link href="/settings" style={{ ...base, padding: '10px 16px', background: onSet ? INK : '#fff', color: onSet ? '#fff' : '#3f444b' }}>설정</Link>
            <form action="/auth/signout" method="post">
              <button type="submit" title="로그아웃" style={{ width: 38, height: 38, borderRadius: '50%', border: 0, cursor: 'pointer', background: '#d7dbe1', font: `700 14px ${FONT}` }}>민</button>
            </form>
          </div>
        </header>
        {sub && (
          <div style={{ display: 'flex', gap: 6, padding: '0 28px 18px', overflowX: 'auto' }}>
            {sub.items.map(([k, label]) => {
              const on = cur === k;
              return (
                <Link key={k} href={`${pathname}?${sub.key}=${k}`} replace aria-current={on ? 'page' : undefined}
                  style={{ ...base, padding: '8px 16px', border: `1.5px solid ${on ? INK : '#d7dbe1'}`, background: on ? '#fff' : 'transparent', color: on ? INK : MUTED }}>
                  {label}
                </Link>
              );
            })}
          </div>
        )}
        {children}
        <button
          onClick={() => qa.open(quickType)}
          style={{ position: 'fixed', right: 28, bottom: 28, height: 56, padding: '0 22px', border: 0, borderRadius: 999, background: INK, color: '#fff', display: 'flex', alignItems: 'center', gap: 10, font: `700 15px ${FONT}`, boxShadow: '0 8px 24px rgba(0,0,0,.2)', cursor: 'pointer', zIndex: 5 }}
        >
          <span style={{ fontSize: 22, fontWeight: 400 }}>+</span>빠른 추가
          <span style={{ font: `500 12px ${FONT}`, opacity: 0.6 }}>N</span>
        </button>
        <QuickAddModal v={qa.vals} />
      </div>
    </AppProvider>
  );
}

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <Shell>{children}</Shell>
    </ToastProvider>
  );
}
