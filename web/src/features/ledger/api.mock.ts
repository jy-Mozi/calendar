import type { Account, BudgetStatus, LedgerApi, MonthSummary, Recurring, Transaction, TxType } from './types';

const ds = (day: number) => `2026-10-${String(day).padStart(2, '0')}`;
const tx = (id: number, day: number, title: string, category: string, amount: number, type: TxType, account: string): Transaction => ({ id: `x${id}`, date: ds(day), title, category, amount, type, account });

// 프로토타입은 거래 목록 외에 "이미 쓴 금액"(BASE)을 따로 두고 합산한다. 그대로 유지.
const BASE: Record<string, number> = { 식비: 380000, 교통: 90000, 쇼핑: 180000, 문화: 120000, 생활: 340000 };
const BUDGET: Record<string, number> = { 식비: 550000, 교통: 150000, 쇼핑: 300000, 문화: 130000, 생활: 450000 };
const DAILY_W = [6, 9, 4, 11, 7, 5, 13, 6, 8, 10, 4, 9, 8];
const TREND: [string, number][] = [['5월', 1420000], ['6월', 1310000], ['7월', 1550000], ['8월', 1380000], ['9월', 1470000]];

let seq = 100;
let txs: Transaction[] = [
  tx(1, 14, '점심 진주회관', '식비', 12000, 'expense', '신용카드'),
  tx(2, 14, '지하철', '교통', 1550, 'expense', '교통카드'),
  tx(3, 13, '생활용품 주문', '생활', 32400, 'expense', '신용카드'),
  tx(4, 13, '넷플릭스 (고정)', '문화', 17000, 'expense', '신용카드'),
  tx(5, 12, '장보기', '식비', 58200, 'expense', '체크카드'),
  tx(6, 10, '10월 급여', '급여', 3200000, 'income', '급여통장'),
  tx(7, 9, '영화 관람', '문화', 28000, 'expense', '신용카드'),
  tx(8, 7, '운동화', '쇼핑', 89000, 'expense', '신용카드'),
  tx(9, 5, '택시', '교통', 14300, 'expense', '신용카드'),
  tx(10, 3, '중고거래 판매', '급여', 45000, 'income', '급여통장'),
];

let recurring: Recurring[] = [
  { id: 'r1', title: '10월 급여', day: 10, category: '급여', amount: 3200000, type: 'income', account: '급여통장', active: true },
  { id: 'r2', title: '넷플릭스', day: 13, category: '문화', amount: 17000, type: 'expense', account: '신용카드', active: true },
  { id: 'r3', title: '휴대폰 요금', day: 20, category: '통신', amount: 59000, type: 'expense', account: '급여통장', active: true },
  { id: 'r4', title: '월세', day: 25, category: '주거', amount: 650000, type: 'expense', account: '급여통장', active: true },
  { id: 'r5', title: '헬스장', day: 28, category: '생활', amount: 79000, type: 'expense', account: '신용카드', active: false },
];

const spentByCategory = () => {
  const spent: Record<string, number> = { ...BASE };
  txs.forEach((x) => { if (x.type === 'expense') spent[x.category] = (spent[x.category] || 0) + x.amount; });
  return spent;
};

export const mockLedgerApi: LedgerApi = {
  async listTransactions(f = {}) {
    const q = f.q?.trim().toLowerCase();
    return txs
      .filter((x) => (!f.from || x.date >= f.from) && (!f.to || x.date <= f.to) && (!f.type || x.type === f.type)
        && (!f.category || x.category === f.category) && (!f.account || x.account === f.account)
        && (!q || (x.title + x.category + x.account).toLowerCase().includes(q)))
      .sort((a, b) => b.date.localeCompare(a.date));
  },
  async createTransaction(input) {
    const t = { ...input, id: `x${seq++}` };
    txs = [t, ...txs];
    return t;
  },
  async updateTransaction(id, patch) {
    const cur = txs.find((x) => x.id === id);
    if (!cur) throw new Error('거래를 찾을 수 없어요.');
    const next = { ...cur, ...patch, id };
    txs = txs.map((x) => (x.id === id ? next : x));
    return next;
  },
  async deleteTransaction(id) {
    txs = txs.filter((x) => x.id !== id);
  },
  async getMonthSummary(month): Promise<MonthSummary> {
    const spent = spentByCategory();
    const expense = Object.values(spent).reduce((a, b) => a + b, 0);
    const income = txs.filter((x) => x.type === 'income').reduce((a, x) => a + x.amount, 0);
    const baseTotal = Object.values(BASE).reduce((a, b) => a + b, 0);
    const wSum = DAILY_W.reduce((a, b) => a + b, 0);
    const dayExp: Record<number, number> = {};
    const dayInc: Record<number, number> = {};
    DAILY_W.forEach((wt, i) => { dayExp[i + 1] = Math.round((baseTotal * wt) / wSum / 100) * 100; });
    txs.forEach((x) => {
      const day = Number(x.date.slice(8));
      if (x.type === 'expense') dayExp[day] = (dayExp[day] || 0) + x.amount;
      else dayInc[day] = (dayInc[day] || 0) + x.amount;
    });
    const days = Array.from({ length: 31 }, (_, i) => i + 1);
    return {
      month,
      income,
      expense,
      balance: income - expense,
      byCategory: Object.entries(spent).map(([name, amount]) => ({ name, amount })).sort((a, b) => b.amount - a.amount),
      daily: days.map((d) => ({ date: ds(d), income: dayInc[d] || 0, expense: dayExp[d] || 0 })),
      trend: [...TREND.map(([m, v]) => ({ month: m, expense: v })), { month: '10월', expense }],
      prevMonthExpense: 1470000,
    };
  },
  async getBudgetStatus(): Promise<BudgetStatus[]> {
    const spent = spentByCategory();
    return Object.keys(BUDGET).map((category) => ({ category, budget: BUDGET[category], spent: spent[category] || 0 }));
  },
  async listAccounts(): Promise<Account[]> {
    const income = txs.filter((x) => x.type === 'income').reduce((a, x) => a + x.amount, 0);
    const newCard = txs.filter((x) => Number(x.id.slice(1)) >= 100).reduce((a, x) => a + x.amount, 0);
    return [
      { id: 'a1', name: '급여통장', type: 'bank', balance: 2184300 + income - 3245000, note: '체크카드 연결 · 월세·통신비 자동이체' },
      { id: 'a2', name: '비상금 통장', type: 'bank', balance: 5000000, note: '연 3.1% 파킹통장' },
      { id: 'a3', name: '현금', type: 'cash', balance: 85000, note: '지갑' },
      { id: 'a4', name: '신용카드', type: 'card', balance: -482600 - newCard, note: '11월 15일 결제 예정' },
    ];
  },
  async listRecurring() {
    return recurring;
  },
  async setRecurringActive(id, active) {
    recurring = recurring.map((r) => (r.id === id ? { ...r, active } : r));
    return recurring.find((r) => r.id === id)!;
  },
};
