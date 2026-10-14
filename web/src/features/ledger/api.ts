// 가계부 데이터 접근 진입점. 세션 B 파트 2(S3)가 api.supabase.ts 를 만들어 교체한다.
import { mockLedgerApi } from './api.mock';
import type { LedgerApi } from './types';

export type { LedgerApi } from './types';
export const ledgerApi: LedgerApi = mockLedgerApi;
