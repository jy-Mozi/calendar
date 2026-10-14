// 설정 데이터 접근 진입점. 세션 C(S4/S6)가 api.supabase.ts 로 교체한다.
import { mockSettingsApi } from './api.mock';
import type { SettingsApi } from './types';

export type { SettingsApi } from './types';
export const settingsApi: SettingsApi = mockSettingsApi;
