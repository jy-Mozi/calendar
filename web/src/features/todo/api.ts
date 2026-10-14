// 할일 데이터 접근 진입점. 세션 B 파트 1(S2)이 api.supabase.ts 를 만들어 교체한다.
import { mockTodoApi } from './api.mock';
import type { TodoApi } from './types';

export type { TodoApi } from './types';
export const todoApi: TodoApi = mockTodoApi;
