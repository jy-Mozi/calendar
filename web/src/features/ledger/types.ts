// 금액은 원 단위 정수, 항상 양수. 방향은 type 으로 구분한다.
export type TxType = 'income' | 'expense' | 'transfer';

export type Transaction = {
  id: string;
  /** YYYY-MM-DD (KST) */
  date: string;
  /** 내용(메모) */
  title: string;
  category: string;
  amount: number;
  type: TxType;
  account: string;
};

export type TransactionInput = Omit<Transaction, 'id'>;

export type TxFilter = { from?: string; to?: string; type?: TxType; category?: string; account?: string; q?: string };

export type MonthSummary = {
  month: string; // YYYY-MM
  income: number;
  expense: number;
  balance: number;
  byCategory: { name: string; amount: number }[];
  daily: { date: string; income: number; expense: number }[];
  trend: { month: string; expense: number }[];
  prevMonthExpense: number;
};

export type BudgetStatus = { category: string; budget: number; spent: number };

export type Account = { id: string; name: string; type: 'cash' | 'bank' | 'card'; balance: number; note: string };

export type Recurring = {
  id: string;
  title: string;
  /** 매월 N일 */
  day: number;
  category: string;
  amount: number;
  type: TxType;
  account: string;
  active: boolean;
};

export interface LedgerApi {
  listTransactions(filter?: TxFilter): Promise<Transaction[]>;
  createTransaction(input: TransactionInput): Promise<Transaction>;
  updateTransaction(id: string, patch: Partial<TransactionInput>): Promise<Transaction>;
  deleteTransaction(id: string): Promise<void>;
  getMonthSummary(month: string): Promise<MonthSummary>;
  getBudgetStatus(month: string): Promise<BudgetStatus[]>;
  listAccounts(): Promise<Account[]>;
  listRecurring(): Promise<Recurring[]>;
  setRecurringActive(id: string, active: boolean): Promise<Recurring>;
}
