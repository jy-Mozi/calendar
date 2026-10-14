// 날씨 데이터 접근 진입점. 세션 C 파트 1(S4)이 Edge Function 호출 구현(api.supabase.ts)으로 교체한다.
// 클라이언트에서 Open-Meteo 를 직접 호출하지 않는다.
import { mockWeatherApi } from './api.mock';
import type { WeatherApi } from './types';

export type { WeatherApi } from './types';
export const weatherApi: WeatherApi = mockWeatherApi;
