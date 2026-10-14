/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/ban-ts-comment */
// @ts-nocheck -- 프로토타입 로직을 그대로 옮긴 파일이라 타입 주석이 없다. Supabase 연동(M1)에서 데이터 계층을 타입으로 교체하면서 제거한다.
'use client';
// 오늘한장 화면 로직. design/오늘한장.dc.html 의 <script data-dc-script> 를 React 클래스로 옮긴 것.
// 지금은 목업 데이터(2026-10-14 기준)로 동작한다. Supabase 연동 시 state 의 events/todos/txs 를 대체한다.
import { Component } from 'react';
import { TodayView } from './TodayView';

const C = (h: number) => `oklch(0.62 0.13 ${h})`, CL = (h: number) => `oklch(0.95 0.035 ${h})`, CD = (h: number) => `oklch(0.42 0.13 ${h})`;
const EVC: Record<string, number> = { 업무: 255, 약속: 55, 건강: 155, 운동: 320, 기념: 20 };
const TXC: Record<string, number> = { 식비: 55, 교통: 255, 쇼핑: 320, 문화: 20, 생활: 155, 주거: 285, 통신: 200, 급여: 255 };
const BUDGET: Record<string, number> = { 식비: 550000, 교통: 150000, 쇼핑: 300000, 문화: 130000, 생활: 450000 };
const BASE: Record<string, number> = { 식비: 380000, 교통: 90000, 쇼핑: 180000, 문화: 120000, 생활: 340000 };
const DAILY_W = [6, 9, 4, 11, 7, 5, 13, 6, 8, 10, 4, 9, 8];
const WX: Record<number, [string, number, number, number]> = { 14: ['맑음', 10, 21, 11], 15: ['흐림', 20, 19, 10], 16: ['비', 70, 15, 9], 17: ['흐림', 30, 14, 8], 18: ['맑음', 0, 16, 7], 19: ['맑음', 10, 17, 9], 20: ['비', 60, 13, 6] };
const DOW = ['일', '월', '화', '수', '목', '금', '토'];
const dowIdx = (d: number) => (d + 3) % 7;
const dowOf = (d: number) => DOW[dowIdx(d)];
const won = (n: number) => n.toLocaleString('ko-KR');
const pill = (on: boolean, onBg = '#15171a') => ({ bg: on ? onBg : 'transparent', fg: on ? '#fff' : '#5b6068' });
const sw = (on: boolean) => ({ track: on ? C(155) : '#d7dbe1', jc: on ? 'flex-end' : 'flex-start' });
let uid = 100;

export class OneDay extends Component<object, any> {
  state: any = {
    tab: 'home', w: 1280, selDay: 14,
    calView: 'month', todoView: 'list', todoFilter: 'today', lgView: 'tx', txFilter: 'all', setView: 'int',
    ovTodo: true, ovBill: true, evCat: '전체', q: '', qType: '전체',
    weekStart: 0, theme: '라이트', city: '서울', gcal: true, scope: 'read · write', newToken: '',
    gcals: [{ name: '내 캘린더', h: 255, on: true }, { name: '회사', h: 55, on: true }, { name: '대한민국 공휴일', h: 20, on: true }, { name: '생일', h: 320, on: false }],
    tokens: [{ id: 1, name: 'Claude Desktop', prefix: 'mcp_7f3a', scope: 'read · write', last: '오늘 12:41' }, { id: 2, name: 'Claude Code', prefix: 'mcp_c21e', scope: 'read', last: '어제' }],
    notis: { ev: true, todo: true, b80: true, b100: true, rain: false, mail: false },
    recurring: [
      { id: 1, title: '10월 급여', day: 10, cat: '급여', amount: 3200000, type: 'income', account: '급여통장', on: true },
      { id: 2, title: '넷플릭스', day: 13, cat: '문화', amount: 17000, type: 'expense', account: '신용카드', on: true },
      { id: 3, title: '휴대폰 요금', day: 20, cat: '통신', amount: 59000, type: 'expense', account: '급여통장', on: true },
      { id: 4, title: '월세', day: 25, cat: '주거', amount: 650000, type: 'expense', account: '급여통장', on: true },
      { id: 5, title: '헬스장', day: 28, cat: '생활', amount: 79000, type: 'expense', account: '신용카드', on: false },
    ],
    qaOpen: false, qaType: 'event', qaTitle: '', qaDay: 14, qaTime: '10:00', qaPrio: '중', qaAmt: '', qaCat: '식비', qaEvCat: '업무', qaErr: '', toast: '',
    events: [
      { id: 1, day: 2, time: '19:00', title: '가족 저녁', place: '본가', cat: '약속', src: 'APP' },
      { id: 2, day: 9, time: '', title: '한글날', place: '공휴일', cat: '기념', src: 'GCAL' },
      { id: 3, day: 14, time: '09:30', title: '팀 주간회의', place: '본사 3층 회의실', cat: '업무', src: 'GCAL' },
      { id: 4, day: 14, time: '12:30', title: '점심 — 지수', place: '을지로 진주회관', cat: '약속', src: 'APP' },
      { id: 5, day: 14, time: '15:00', title: '치과 정기검진', place: '강남 서울바른치과', cat: '건강', src: 'MCP' },
      { id: 6, day: 14, time: '19:30', title: '요가 클래스', place: '성수 스튜디오', cat: '운동', src: 'GCAL' },
      { id: 7, day: 16, time: '14:00', title: '프로젝트 마감 회의', place: '온라인', cat: '업무', src: 'GCAL' },
      { id: 8, day: 17, time: '12:00', title: '친구 결혼식', place: '여의도 더파티움', cat: '약속', src: 'APP' },
      { id: 9, day: 21, time: '08:00', title: '부산 출장', place: 'KTX 서울역', cat: '업무', src: 'GCAL' },
      { id: 10, day: 24, time: '18:30', title: '동창 모임', place: '연남동', cat: '약속', src: 'APP' },
      { id: 11, day: 28, time: '08:30', title: '건강검진', place: '종합검진센터', cat: '건강', src: 'APP' },
      { id: 12, day: 21, time: '19:30', title: '요가 클래스', place: '성수 스튜디오', cat: '운동', src: 'GCAL' },
      { id: 13, day: 12, time: '10:00', title: '디자인 리뷰', place: '본사 5층', cat: '업무', src: 'GCAL' },
      { id: 14, day: 13, time: '18:00', title: '러닝 크루', place: '한강 뚝섬', cat: '운동', src: 'APP' },
      { id: 15, day: 15, time: '11:00', title: '분기 보고 미팅', place: '본사 3층', cat: '업무', src: 'GCAL' },
      { id: 16, day: 18, time: '10:00', title: '브런치 — 수빈', place: '한남동', cat: '약속', src: 'APP' },
    ],
    todos: [
      { id: 1, title: '관리비 납부', prio: '중', project: '생활', due: 13, done: false, doing: false },
      { id: 2, title: '분기 보고서 초안 작성', prio: '상', project: '업무', due: 14, done: false, doing: true },
      { id: 3, title: '택배 반품 신청', prio: '하', project: '생활', due: 14, done: false, doing: false },
      { id: 4, title: '세탁소 코트 찾기', prio: '하', project: '생활', due: 14, done: true, doing: false },
      { id: 5, title: '마감 회의 자료 준비', prio: '상', project: '업무', due: 16, done: false, doing: true },
      { id: 6, title: '결혼식 축의금 준비', prio: '중', project: '생활', due: 17, done: false, doing: false },
      { id: 7, title: '출장 숙소 예약', prio: '중', project: '업무', due: 18, done: true, doing: false },
      { id: 8, title: '독서 모임 책 읽기', prio: '하', project: '개인', due: null, done: false, doing: false },
    ],
    txs: [
      { id: 1, date: 14, title: '점심 진주회관', cat: '식비', amount: 12000, type: 'expense', account: '신용카드' },
      { id: 2, date: 14, title: '지하철', cat: '교통', amount: 1550, type: 'expense', account: '교통카드' },
      { id: 3, date: 13, title: '생활용품 주문', cat: '생활', amount: 32400, type: 'expense', account: '신용카드' },
      { id: 4, date: 13, title: '넷플릭스 (고정)', cat: '문화', amount: 17000, type: 'expense', account: '신용카드' },
      { id: 5, date: 12, title: '장보기', cat: '식비', amount: 58200, type: 'expense', account: '체크카드' },
      { id: 6, date: 10, title: '10월 급여', cat: '급여', amount: 3200000, type: 'income', account: '급여통장' },
      { id: 7, date: 9, title: '영화 관람', cat: '문화', amount: 28000, type: 'expense', account: '신용카드' },
      { id: 8, date: 7, title: '운동화', cat: '쇼핑', amount: 89000, type: 'expense', account: '신용카드' },
      { id: 9, date: 5, title: '택시', cat: '교통', amount: 14300, type: 'expense', account: '신용카드' },
      { id: 10, date: 3, title: '중고거래 판매', cat: '급여', amount: 45000, type: 'income', account: '급여통장' },
    ],
  };
  componentDidMount() {
    this.setState({ w: window.innerWidth });
    this.onResize = () => this.setState({ w: window.innerWidth });
    this.onKey = e => {
      const tag = (e.target.tagName || '').toLowerCase();
      if (e.key === 'Escape' && this.state.qaOpen) this.setState({ qaOpen: false });
      else if ((e.key === 'n' || e.key === 'N') && !['input', 'select', 'textarea'].includes(tag) && !this.state.qaOpen) { e.preventDefault(); this.open('event'); }
    };
    window.addEventListener('resize', this.onResize);
    window.addEventListener('keydown', this.onKey);
  }
  componentWillUnmount() { window.removeEventListener('resize', this.onResize); window.removeEventListener('keydown', this.onKey); clearTimeout(this.tt); }
  open(type, extra = {}) { this.setState({ qaOpen: true, qaType: type, qaTitle: '', qaAmt: '', qaErr: '', qaDay: this.state.selDay, ...extra }); }
  flash(msg) { clearTimeout(this.tt); this.setState({ toast: msg }); this.tt = setTimeout(() => this.setState({ toast: '' }), 2200); }
  patchTodo(id, p) { this.setState(s => ({ todos: s.todos.map(t => t.id === id ? { ...t, ...p } : t) })); }
  download(name, text, mime) {
    const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([text], { type: mime })); a.download = name; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000); this.flash(`${name} 내려받기를 시작했어요`);
  }
  save() {
    const s = this.state, title = s.qaTitle.trim();
    if (!title) return this.setState({ qaErr: s.qaType === 'tx' ? '내용을 입력하세요.' : '제목을 입력하세요.' });
    if (s.qaType === 'event') {
      const day = Math.min(31, Math.max(1, parseInt(s.qaDay) || 14));
      this.setState({ events: [...s.events, { id: uid++, day, time: s.qaTime, title, place: '직접 입력', cat: s.qaEvCat, src: 'APP' }], qaOpen: false, selDay: day });
      this.flash(`10월 ${day}일 일정을 추가했어요`);
    } else if (s.qaType === 'todo') {
      this.setState({ todos: [{ id: uid++, title, prio: s.qaPrio, project: '개인', due: 14, done: false, doing: false }, ...s.todos], qaOpen: false });
      this.flash('오늘 할일에 추가했어요');
    } else {
      const amount = parseInt(String(s.qaAmt).replace(/\D/g, '')) || 0;
      if (!amount) return this.setState({ qaErr: '금액을 입력하세요.' });
      this.setState({ txs: [{ id: uid++, date: 14, title, cat: s.qaCat, amount, type: 'expense', account: '신용카드' }, ...s.txs], qaOpen: false });
      this.flash(`${s.qaCat} ${won(amount)}원을 기록했어요`);
    }
  }
  renderVals(): Record<string, any> {
    const s = this.state, wide = s.w >= 1180, mid = s.w >= 820;
    const go = p => () => this.setState(p);
    const tabs = [['home', '홈'], ['cal', '일정'], ['todo', '할일'], ['ledger', '가계부']].map(([k, label]) => ({ label, ...pill(s.tab === k), go: go({ tab: k }) }));
    const subDefs = {
      cal: ['calView', [['month', '월간'], ['week', '주간'], ['list', '일정 목록']]],
      todo: ['todoView', [['list', '목록'], ['board', '보드']]],
      ledger: ['lgView', [['tx', '거래내역'], ['cal', '월간 달력'], ['stats', '통계'], ['budget', '예산'], ['assets', '자산·계좌'], ['rec', '고정지출']]],
    };
    const sd = subDefs[s.tab];
    const subTabs = sd ? sd[1].map(([k, label]) => { const on = s[sd[0]] === k; return { label, bg: on ? '#fff' : 'transparent', fg: on ? '#15171a' : '#5b6068', bd: on ? '#15171a' : '#d7dbe1', go: go({ [sd[0]]: k }) }; }) : [];

    const evDecor = e => ({ ...e, color: C(EVC[e.cat]), timeTxt: e.time || '종일' });
    const sortEv = (a, b) => (a.time || '00').localeCompare(b.time || '00');
    const todayEvents = s.events.filter(e => e.day === 14).sort(sortEv).map(evDecor);
    const prioC = { 상: 25, 중: 55, 하: 255 };
    const status = t => t.done ? 'done' : t.doing ? 'doing' : 'todo';
    const stLabel = { todo: '할 일', doing: '진행 중', done: '완료' };
    const decT = t => ({ ...t, late: !t.done && t.due !== null && t.due < 14, fill: t.done ? C(155) : 'transparent', deco: t.done ? 'line-through' : 'none', op: t.done ? 0.45 : 1,
      dueTxt: t.due === null ? '마감 없음' : t.due === 14 ? '오늘 마감' : `10월 ${t.due}일`, statusTxt: stLabel[status(t)], pBg: CL(prioC[t.prio]), pFg: CD(prioC[t.prio]),
      toggle: () => this.patchTodo(t.id, { done: !t.done, doing: false }) });
    const isToday = t => t.due !== null && t.due <= 14 && (!t.done || t.due === 14);
    const todayTodos = s.todos.filter(isToday).map(decT);
    const filt = { today: isToday, all: t => !t.done, done: t => t.done };
    const todoFilters = [['today', '오늘'], ['all', '진행 중'], ['done', '완료']].map(([k, label]) => ({ label, n: s.todos.filter(filt[k]).length, ...pill(s.todoFilter === k), go: go({ todoFilter: k }) }));
    const todoList = s.todos.filter(filt[s.todoFilter]).sort((a, b) => (a.due ?? 99) - (b.due ?? 99)).map(decT);
    const projects = ['업무', '생활', '개인'].map(name => { const l = s.todos.filter(t => t.project === name), d = l.filter(t => t.done).length; return { name, total: l.length, done: d, pct: l.length ? Math.round(d / l.length * 100) : 0 }; });
    const order = ['todo', 'doing', 'done'], stP = { todo: { done: false, doing: false }, doing: { done: false, doing: true }, done: { done: true, doing: false } };
    const board = order.map((k, i) => { const items = s.todos.filter(t => status(t) === k).sort((a, b) => (a.due ?? 99) - (b.due ?? 99)).map(t => ({ ...decT(t),
      canBack: i > 0, canFwd: i < 2, backLabel: i > 0 ? stLabel[order[i - 1]] : '', fwdLabel: i < 2 ? stLabel[order[i + 1]] : '',
      back: () => i > 0 && this.patchTodo(t.id, stP[order[i - 1]]), fwd: () => i < 2 && this.patchTodo(t.id, stP[order[i + 1]]) }));
      return { label: stLabel[k], n: items.length, items, dot: [C(255), C(55), C(155)][i] }; });

    // ledger
    const spent = { ...BASE };
    s.txs.forEach(x => { if (x.type === 'expense') spent[x.cat] = (spent[x.cat] || 0) + x.amount; });
    const expense = Object.values(spent).reduce((a, b) => a + b, 0);
    const income = s.txs.filter(x => x.type === 'income').reduce((a, x) => a + x.amount, 0);
    const budgetTotal = Object.values(BUDGET).reduce((a, b) => a + b, 0);
    const budgetPct = Math.round(Object.keys(BUDGET).reduce((a, k) => a + spent[k], 0) / budgetTotal * 100);
    const budgets = Object.keys(BUDGET).map(name => { const pct = Math.round(spent[name] / BUDGET[name] * 100); const h = pct >= 100 ? 25 : pct >= 80 ? 55 : 155; const left = BUDGET[name] - spent[name];
      return { name, pct, w: Math.min(pct, 100), spentTxt: won(spent[name]), amtTxt: won(BUDGET[name]), bar: C(h), txt: pct >= 80 ? CD(h) : '#15171a',
        badge: pct >= 100 ? '초과' : pct >= 80 ? '주의' : '', badgeBg: CL(h), leftTxt: left >= 0 ? `${won(left)}원 남음` : `${won(-left)}원 초과` }; });
    const warnBudget = budgets.filter(b => b.pct >= 80).sort((a, b) => b.pct - a.pct)[0] || null;
    const txF = { all: () => true, income: x => x.type === 'income', expense: x => x.type === 'expense' };
    const txFilters = [['all', '전체'], ['income', '수입'], ['expense', '지출']].map(([k, label]) => ({ label, ...pill(s.txFilter === k), go: go({ txFilter: k }) }));
    const shownTx = s.txs.filter(txF[s.txFilter]).sort((a, b) => b.date - a.date);
    const txSum = shownTx.reduce((a, x) => a + (x.type === 'income' ? x.amount : -x.amount), 0);
    const txList = shownTx.map(x => ({ ...x, cat1: x.cat[0], bg: CL(TXC[x.cat]), fg: CD(TXC[x.cat]), amtTxt: (x.type === 'income' ? '+' : '−') + won(x.amount) + '원', amtColor: x.type === 'income' ? CD(255) : '#15171a' }));
    const baseTotal = Object.values(BASE).reduce((a, b) => a + b, 0);
    const wSum = DAILY_W.reduce((a, b) => a + b, 0);
    const dayExp = {}, dayInc = {};
    DAILY_W.forEach((wt, i) => { dayExp[i + 1] = Math.round(baseTotal * wt / wSum / 100) * 100; });
    s.txs.forEach(x => { if (x.type === 'expense') dayExp[x.date] = (dayExp[x.date] || 0) + x.amount; else dayInc[x.date] = (dayInc[x.date] || 0) + x.amount; });
    const catShareRaw = Object.keys(spent).map(name => ({ name, amt: spent[name] })).sort((a, b) => b.amt - a.amt);
    let acc = 0; const stops = [];
    const catShare = catShareRaw.map(c => { const pct = Math.round(c.amt / expense * 100); const color = C(TXC[c.name]); stops.push(`${color} ${acc}% ${acc + c.amt / expense * 100}%`); acc += c.amt / expense * 100; return { ...c, pct, color, amtTxt: won(c.amt) + '원' }; });
    const trendRaw = [['5월', 1420000], ['6월', 1310000], ['7월', 1550000], ['8월', 1380000], ['9월', 1470000], ['10월', expense]];
    const tMax = Math.max(...trendRaw.map(t => t[1]));
    const trend = trendRaw.map(([m, v], i) => ({ m, v: (v / 10000).toFixed(0) + '만', h: Math.round(v / tMax * 80), bg: i === 5 ? C(55) : '#d7dbe1' }));
    const mom = Math.round((expense - 1470000) / 1470000 * 100);
    const accountsRaw = [
      { name: '급여통장', type: '통장', bal: 2184300 + income - 3245000, h: 255, note: '체크카드 연결 · 월세·통신비 자동이체' },
      { name: '비상금 통장', type: '통장', bal: 5000000, h: 255, note: '연 3.1% 파킹통장' },
      { name: '현금', type: '현금', bal: 85000, h: 155, note: '지갑' },
      { name: '신용카드', type: '카드', bal: -482600 - s.txs.filter(x => x.id >= 100).reduce((a, x) => a + x.amount, 0), h: 55, note: '11월 15일 결제 예정' },
    ];
    const accounts = accountsRaw.map(a => ({ ...a, balTxt: (a.bal < 0 ? '−' : '') + won(Math.abs(a.bal)), bg: CL(a.h), fg: CD(a.h), amtColor: a.bal < 0 ? CD(25) : '#15171a' }));
    const recurring = s.recurring.map(r => ({ ...r, ...sw(r.on), op: r.on ? 1 : 0.5, bg: CL(TXC[r.cat]), fg: CD(TXC[r.cat]), next: r.day > 14 ? `10월 ${r.day}일` : `11월 ${r.day}일`,
      amtTxt: (r.type === 'income' ? '+' : '−') + won(r.amount) + '원', amtColor: r.type === 'income' ? CD(255) : '#15171a',
      flip: () => this.setState(st => ({ recurring: st.recurring.map(x => x.id === r.id ? { ...x, on: !x.on } : x) })) }));
    const recTotal = s.recurring.filter(r => r.on && r.type === 'expense').reduce((a, r) => a + r.amount, 0);

    // calendar
    const lead = (dowIdx(1) - s.weekStart + 7) % 7;
    const blank = { label: '', wx: '', chips: [], bg: 'transparent', ol: 'none', cur: 'default', numBg: 'transparent', numFg: '#15171a', pick: null, inc: '', exp: '' };
    const cells = [], lgCells = [];
    for (let i = 0; i < lead; i++) { cells.push(blank); lgCells.push(blank); }
    const dayColor = d => { const i = dowIdx(d); return i === 0 ? CD(25) : i === 6 ? CD(255) : '#15171a'; };
    for (let d = 1; d <= 31; d++) {
      const evs = s.events.filter(e => e.day === d).sort(sortEv);
      const chips = evs.map(e => ({ title: (e.time ? e.time + ' ' : '') + e.title, bg: CL(EVC[e.cat]), fg: CD(EVC[e.cat]), bd: 'transparent' }));
      if (s.ovTodo) s.todos.filter(t => t.due === d && !t.done).forEach(t => chips.push({ title: '마감 · ' + t.title, bg: '#fff', fg: CD(155), bd: C(155) }));
      if (s.ovBill) s.recurring.filter(r => r.on && r.day === d && r.type === 'expense').forEach(r => chips.push({ title: '결제 · ' + r.title, bg: '#fff', fg: CD(55), bd: C(55) }));
      const vis = chips.slice(0, 3); if (chips.length > 3) vis.push({ title: `+${chips.length - 3}개`, bg: '#f1f2f4', fg: '#5b6068', bd: 'transparent' });
      const sel = s.selDay === d;
      cells.push({ label: d, wx: WX[d] ? `${WX[d][0]} ${WX[d][2]}°` : '', chips: vis, bg: sel ? CL(255) : '#f7f8f9', ol: sel ? `2px solid ${C(255)}` : 'none', cur: 'pointer',
        numBg: d === 14 ? '#15171a' : 'transparent', numFg: d === 14 ? '#fff' : dayColor(d), pick: go({ selDay: d }) });
      lgCells.push({ ...blank, label: d, bg: d === 14 ? CL(55) : '#f7f8f9', numFg: dayColor(d), inc: dayInc[d] ? '+' + won(dayInc[d]) : '', exp: d <= 14 && dayExp[d] ? '−' + won(dayExp[d]) : '' });
    }
    while (cells.length % 7) { cells.push(blank); lgCells.push(blank); }
    const dows = [...DOW.slice(s.weekStart), ...DOW.slice(0, s.weekStart)].map(t => ({ t, c: t === '일' ? CD(25) : t === '토' ? CD(255) : '#5b6068' }));
    const selEvents = s.events.filter(e => e.day === s.selDay).sort(sortEv).map(evDecor);
    const swx = WX[s.selDay];
    const overlays = [['ovTodo', '할일 마감', 155], ['ovBill', '결제일', 55]].map(([k, label, h]) => ({ label, mark: s[k] ? '✓' : '+', bd: s[k] ? C(h) : '#dfe2e6', bg: s[k] ? CL(h) : '#fff', fg: s[k] ? CD(h) : '#5b6068', flip: go({ [k]: !s[k] }) }));
    const hours = Array.from({ length: 14 }, (_, i) => String(i + 8).padStart(2, '0') + ':00');
    const weekDays = [12, 13, 14, 15, 16, 17, 18].map(d => ({ date: d, dow: dowOf(d), wx: WX[d] ? `${WX[d][0]} ${WX[d][2]}°` : '', numBg: d === 14 ? '#15171a' : 'transparent', numFg: d === 14 ? '#fff' : dayColor(d), colBg: d === 14 ? 'oklch(0.985 0.01 255)' : 'transparent',
      evs: s.events.filter(e => e.day === d).map(e => { const [hh, mm] = (e.time || '08:00').split(':').map(Number); return { title: e.title, timeTxt: e.time || '종일', top: Math.max(0, (hh - 8) * 48 + mm * 0.8), h: e.time ? 52 : 30, bg: CL(EVC[e.cat]), fg: CD(EVC[e.cat]), bd: C(EVC[e.cat]) }; }) }));
    const evCatFilters = ['전체', ...Object.keys(EVC)].map(label => ({ label, ...pill(s.evCat === label), go: go({ evCat: label }) }));
    const upDays = [...new Set(s.events.filter(e => e.day >= 14 && (s.evCat === '전체' || e.cat === s.evCat)).map(e => e.day))].sort((a, b) => a - b);
    const upcoming = upDays.map(d => ({ dateTxt: `10월 ${d}일 ${dowOf(d)}`, rel: d === 14 ? '오늘' : d === 15 ? '내일' : `${d - 14}일 후`, wx: WX[d] ? `${WX[d][0]} ${WX[d][2]}° / ${WX[d][3]}°` : '',
      items: s.events.filter(e => e.day === d && (s.evCat === '전체' || e.cat === s.evCat)).sort(sortEv).map(evDecor) }));
    const week = [14, 15, 16, 17, 18, 19, 20].map(d => ({ d: dowOf(d), s: WX[d][0], pTxt: WX[d][1] >= 30 ? WX[d][1] + '%' : '', hi: WX[d][2], lo: WX[d][3] }));

    // search
    const q = s.q.trim().toLowerCase();
    const all = [
      ...s.events.map(e => ({ kind: '일정', title: e.title, sub: `10월 ${e.day}일 ${e.time || '종일'} · ${e.place} · ${e.cat}`, right: '', key: (e.title + e.place + e.cat).toLowerCase(), bg: CL(255), fg: CD(255), go: go({ tab: 'cal', calView: 'month', selDay: e.day }) })),
      ...s.todos.map(t => ({ kind: '할일', title: t.title, sub: `${t.project} · ${t.due ? '10월 ' + t.due + '일 마감' : '마감 없음'} · ${stLabel[status(t)]}`, right: '', key: (t.title + t.project).toLowerCase(), bg: CL(155), fg: CD(155), go: go({ tab: 'todo', todoView: 'list', todoFilter: t.done ? 'done' : 'all' }) })),
      ...s.txs.map(x => ({ kind: '거래', title: x.title, sub: `10월 ${x.date}일 · ${x.cat} · ${x.account}`, right: (x.type === 'income' ? '+' : '−') + won(x.amount), key: (x.title + x.cat + x.account).toLowerCase(), bg: CL(55), fg: CD(55), go: go({ tab: 'ledger', lgView: 'tx' }) })),
    ];
    const matched = q ? all.filter(r => r.key.includes(q)) : [];
    const searchFilters = ['전체', '일정', '할일', '거래'].map(label => ({ label, n: q ? matched.filter(r => label === '전체' || r.kind === label).length : '', ...pill(s.qType === label), go: go({ qType: label }) }));
    const results = matched.filter(r => s.qType === '전체' || r.kind === s.qType);
    const suggestions = ['요가', '식비', '보고서', '회의', '신용카드'].map(t => ({ t, go: go({ q: t }) }));

    // settings
    const setNav = [['int', '외부 연동'], ['cat', '카테고리·태그'], ['noti', '알림'], ['view', '화면'], ['backup', '백업·내보내기'], ['profile', '프로필·계정']].map(([k, label]) => ({ label, bg: s.setView === k ? '#15171a' : 'transparent', fg: s.setView === k ? '#fff' : '#3f444b', go: go({ setView: k, newToken: '' }) }));
    const gcals = s.gcals.map((g, i) => ({ name: g.name, color: C(g.h), count: [42, 31, 18, 9][i], ...sw(g.on), flip: () => this.setState(st => ({ gcals: st.gcals.map((x, j) => j === i ? { ...x, on: !x.on } : x) })) }));
    const notiDefs = [['ev', '일정 알림', '시작 10분 전 · 웹 푸시'], ['todo', '할일 마감 알림', '마감일 오전 9시'], ['b80', '예산 80% 도달', '카테고리별 주의 알림'], ['b100', '예산 초과', '100% 넘으면 즉시 알림'], ['rain', '우산 알림', '비·눈 예보일에 일정이 있으면 전날 저녁'], ['mail', '이메일 알림', '웹 푸시를 받을 수 없을 때 대신']];
    const notis = notiDefs.map(([k, label, desc]) => ({ label, desc, ...sw(s.notis[k]), flip: () => this.setState(st => ({ notis: { ...st.notis, [k]: !st.notis[k] } })) }));
    const opt = (cur, val, setter) => ({ label: val, bd: cur === val ? '#15171a' : '#dfe2e6', bg: cur === val ? '#15171a' : '#fff', fg: cur === val ? '#fff' : '#15171a', go: setter });
    const viewOpts = [
      { label: '테마', opts: ['라이트', '다크', '시스템'].map(v => opt(s.theme, v, go({ theme: v }))) },
      { label: '한 주 시작 요일', opts: [['일요일', 0], ['월요일', 1]].map(([v, n]) => opt(s.weekStart === n ? v : '', v, go({ weekStart: n }))) },
      { label: '통화 단위', opts: [opt('KRW (원)', 'KRW (원)', () => {})] },
    ];
    const catGroups = [
      { title: '일정 카테고리', items: Object.entries(EVC).map(([name, h]) => ({ name, bg: CL(h), fg: CD(h), dot: C(h) })) },
      { title: '할일 프로젝트', items: [['업무', 255], ['생활', 155], ['개인', 320]].map(([name, h]) => ({ name, bg: CL(h), fg: CD(h), dot: C(h) })) },
      { title: '가계부 카테고리', items: Object.entries(TXC).filter(([n]) => n !== '급여').map(([name, h]) => ({ name, bg: CL(h), fg: CD(h), dot: C(h) })).concat([{ name: '급여(수입)', bg: CL(255), fg: CD(255), dot: C(255) }]) },
    ];
    const cities = ['서울', '성남', '부산', '제주'].map(name => ({ name, bd: s.city === name ? '#15171a' : '#dfe2e6', bg: s.city === name ? '#15171a' : '#fff', fg: s.city === name ? '#fff' : '#15171a', go: go({ city: name }) }));
    const scopeOpts = ['read', 'read · write'].map(label => ({ label, bd: s.scope === label ? '#15171a' : '#dfe2e6', go: go({ scope: label }) }));
    const tokens = s.tokens.map(t => ({ ...t, revoke: () => { this.setState(st => ({ tokens: st.tokens.filter(x => x.id !== t.id) })); this.flash(`${t.name} 토큰을 폐기했어요`); } }));

    const qaTypes = [['event', '일정'], ['todo', '할일'], ['tx', '거래']].map(([k, label]) => ({ label, ...pill(s.qaType === k), go: go({ qaType: k, qaErr: '' }) }));
    const amtDigits = String(s.qaAmt).replace(/\D/g, '');
    const onSearch = s.tab === 'search', onSet = s.tab === 'settings';
    return {
      tabs, hasSub: !!sd, subTabs,
      goHome: go({ tab: 'home' }), goSearch: go({ tab: 'search' }), goSettings: go({ tab: 'settings' }),
      searchBtnBg: onSearch ? '#15171a' : '#fff', searchBtnFg: onSearch ? '#fff' : '#3f444b', setBtnBg: onSet ? '#15171a' : '#fff', setBtnFg: onSet ? '#fff' : '#3f444b',
      isHome: s.tab === 'home', isCalMonth: s.tab === 'cal' && s.calView === 'month', isCalWeek: s.tab === 'cal' && s.calView === 'week', isCalList: s.tab === 'cal' && s.calView === 'list',
      isTodo: s.tab === 'todo', isTodoList: s.todoView === 'list', isTodoBoard: s.todoView === 'board',
      isLedger: s.tab === 'ledger', isLgTx: s.lgView === 'tx', isLgCal: s.lgView === 'cal', isLgStats: s.lgView === 'stats', isLgBudget: s.lgView === 'budget', isLgAssets: s.lgView === 'assets', isLgRec: s.lgView === 'rec',
      isSearch: onSearch, isSettings: onSet,
      homeCols: wide ? '1.15fr 1fr 1fr' : mid ? '1fr 1fr' : '1fr',
      homeAreas: wide ? '"greet greet wx" "ev td wx"' : mid ? '"greet greet" "ev td" "wx wx"' : '"greet" "wx" "ev" "td"',
      splitCols: wide ? 'minmax(0,1fr) 360px' : '1fr', halfCols: mid ? '1fr 1fr' : '1fr', boardCols: mid ? 'repeat(3,minmax(0,1fr))' : '1fr',
      setCols: mid ? '220px minmax(0,1fr)' : '1fr', setNavDir: mid ? 'column' : 'row',
      todayEvents, todayEventCount: todayEvents.length, todayTodos, todayDone: todayTodos.filter(t => t.done).length, todayTotal: todayTodos.length,
      todoLeft: todayTodos.filter(t => !t.done).length, week, city: s.city,
      gcalBadge: s.gcal ? 'Google 캘린더 동기화됨 · 2분 전' : 'Google 캘린더 연결 안 됨', tokenCount: s.tokens.length,
      expenseTxt: won(expense), expenseShort: (expense / 10000).toFixed(0) + '만원', incomeTxt: won(income), balanceTxt: won(income - expense), budgetPct, budgetBar: Math.min(budgetPct, 100), budgetTotalTxt: won(budgetTotal), warnBudget, budgets,
      txFilters, txList, txSumTxt: (txSum >= 0 ? '+' : '−') + won(Math.abs(txSum)) + '원',
      lgCells, donut: `conic-gradient(${stops.join(',')})`, catShare, trend, momTxt: `9월 대비 ${Math.abs(mom)}% ${mom >= 0 ? '증가' : '감소'}`, momColor: mom >= 0 ? CD(25) : CD(155),
      accounts, netWorthTxt: won(accountsRaw.reduce((a, x) => a + x.bal, 0)), recurring, recTotalTxt: won(recTotal),
      dows, cells, overlays, hours, weekDays, evCatFilters, upcoming,
      selDay: s.selDay, selDow: dowOf(s.selDay), selEvents, selEmpty: selEvents.length === 0,
      selWx: swx ? `${swx[0]} · 최고 ${swx[2]}° / 최저 ${swx[3]}° · 강수 ${swx[1]}%` : '',
      todoFilters, todoList, todoEmpty: todoList.length === 0, projects, board,
      q: s.q, setQ: e => this.setState({ q: e.target.value }), qEmpty: !q, searchFilters, results, hasResults: results.length > 0, noResults: !!q && results.length === 0, suggestions,
      setNav, isSetInt: s.setView === 'int', isSetCat: s.setView === 'cat', isSetNoti: s.setView === 'noti', isSetView: s.setView === 'view', isSetBackup: s.setView === 'backup', isSetProfile: s.setView === 'profile',
      gcalOn: s.gcal, gcalStatus: s.gcal ? 'minji@gmail.com · 마지막 동기화 2분 전' : '연결하면 Google 일정과 양방향으로 동기화돼요',
      gcalBtn: s.gcal ? '연결 해제' : 'Google 계정 연결', gcalBtnBg: s.gcal ? '#f1f2f4' : '#15171a', gcalBtnFg: s.gcal ? '#15171a' : '#fff',
      toggleGcal: () => { this.setState({ gcal: !s.gcal }); this.flash(s.gcal ? 'Google 캘린더 연결을 해제했어요' : 'Google 캘린더를 연결했어요'); },
      gcals, cities, scopeOpts, tokens, newToken: s.newToken,
      issueToken: () => { const raw = 'mcp_' + Array.from({ length: 32 }, () => '0123456789abcdef'[Math.floor(Math.random() * 16)]).join('');
        this.setState(st => ({ newToken: raw, tokens: [{ id: uid++, name: `새 토큰 ${st.tokens.length + 1}`, prefix: raw.slice(0, 8), scope: st.scope, last: '사용 전' }, ...st.tokens] })); },
      mcpLogs: [['12:41', 'ledger.add_transaction', '성공'], ['12:40', 'calendar.get_weather', '성공'], ['09:02', 'todo.list_todos', '성공'], ['어제', 'calendar.delete_event', 'confirm 필요']].map(([t, tool, r]) => ({ t, tool, r, c: r === '성공' ? CD(155) : CD(55) })),
      catGroups, notis, viewOpts,
      evCount: s.events.length, tdCount: s.todos.length, txCount: s.txs.length,
      exportJson: () => this.download('오늘한장-backup.json', JSON.stringify({ events: s.events, todos: s.todos, transactions: s.txs }, null, 2), 'application/json'),
      exportCsv: () => this.download('거래내역.csv', '\ufeff날짜,내용,카테고리,유형,금액,계좌\n' + s.txs.map(x => `2026-10-${String(x.date).padStart(2, '0')},${x.title},${x.cat},${x.type === 'income' ? '수입' : '지출'},${x.amount},${x.account}`).join('\n'), 'text/csv'),
      goCal: go({ tab: 'cal', calView: 'month', selDay: 14 }), goToday: go({ selDay: 14 }),
      openQA: () => this.open(s.tab === 'todo' ? 'todo' : s.tab === 'ledger' ? 'tx' : 'event'),
      addEventSel: () => this.open('event', { qaDay: s.selDay }), addTodo: () => this.open('todo'), addTx: () => this.open('tx'),
      closeQA: go({ qaOpen: false }), stop: e => e.stopPropagation(), saveQA: () => this.save(),
      qaKey: e => { if (e.key === 'Enter') this.save(); },
      qaOpen: s.qaOpen, qaTypes, qaIsEvent: s.qaType === 'event', qaIsTodo: s.qaType === 'todo', qaIsTx: s.qaType === 'tx',
      qaTitleLabel: s.qaType === 'tx' ? '내용' : '제목', qaPh: s.qaType === 'event' ? '예) 치과 예약' : s.qaType === 'todo' ? '예) 보고서 제출' : '예) 점심 김밥',
      qaTitle: s.qaTitle, qaDay: s.qaDay, qaTime: s.qaTime, qaAmtTxt: amtDigits ? won(parseInt(amtDigits)) : '', qaCat: s.qaCat, qaErr: s.qaErr,
      setTitle: e => this.setState({ qaTitle: e.target.value, qaErr: '' }), setDay: e => this.setState({ qaDay: e.target.value }), setTime: e => this.setState({ qaTime: e.target.value }),
      setAmt: e => this.setState({ qaAmt: e.target.value, qaErr: '' }), setCat: e => this.setState({ qaCat: e.target.value }),
      prioOpts: ['상', '중', '하'].map(label => ({ label, bd: s.qaPrio === label ? '#15171a' : '#dfe2e6', go: go({ qaPrio: label }) })),
      evCatOpts: Object.keys(EVC).filter(k => k !== '기념').map(label => ({ label, bd: s.qaEvCat === label ? C(EVC[label]) : '#dfe2e6', bg: s.qaEvCat === label ? CL(EVC[label]) : '#fff', fg: s.qaEvCat === label ? CD(EVC[label]) : '#5b6068', go: go({ qaEvCat: label }) })),
      catNames: Object.keys(BUDGET), toast: s.toast,
    };
  }

  render() {
    return <TodayView v={this.renderVals()} />;
  }
}
