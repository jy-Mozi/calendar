import type { DailyForecast, WeatherApi, WeatherSummary } from './types';

// [일, 요약, 강수확률, 최고, 최저] — 프로토타입 값
const WX: [number, WeatherSummary, number, number, number][] = [
  [14, '맑음', 10, 21, 11], [15, '흐림', 20, 19, 10], [16, '비', 70, 15, 9], [17, '흐림', 30, 14, 8],
  [18, '맑음', 0, 16, 7], [19, '맑음', 10, 17, 9], [20, '비', 60, 13, 6],
];

export const mockWeatherApi: WeatherApi = {
  async getForecast() {
    const daily: DailyForecast[] = WX.map(([d, summary, precipPct, hi, lo]) => ({ date: `2026-10-${d}`, summary, precipPct, hi, lo }));
    return {
      current: { summary: '맑음', temp: 18, precipPct: 10 },
      hourly: Array.from({ length: 24 }, (_, h) => ({ time: `${String(h).padStart(2, '0')}:00`, summary: '맑음' as const, temp: 12 + Math.round(8 * Math.sin(((h - 6) / 24) * Math.PI * 2) ** 2), precipPct: 10 })),
      daily,
    };
  },
};
