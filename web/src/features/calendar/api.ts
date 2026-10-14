// 일정 데이터 접근 진입점. 화면은 이 파일의 calendarApi 만 쓴다.
// 세션 A 파트 3(S1)이 api.supabase.ts 를 만들어 아래 한 줄을 USE_MOCK 분기로 바꾼다.
import { mockCalendarApi } from './api.mock';
import type { CalendarApi } from './types';

export type { CalendarApi } from './types';
export const calendarApi: CalendarApi = mockCalendarApi;
