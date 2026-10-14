export type WeatherSummary = '맑음' | '흐림' | '비' | '눈' | '뇌우' | '안개';

export type WeatherLocation = { label: string; lat?: number; lon?: number };

export type DailyForecast = { date: string; summary: WeatherSummary; precipPct: number; hi: number; lo: number };
export type HourlyForecast = { time: string; summary: WeatherSummary; temp: number; precipPct: number };

export type Forecast = {
  current: { summary: WeatherSummary; temp: number; precipPct: number };
  hourly: HourlyForecast[];
  daily: DailyForecast[];
};

export interface WeatherApi {
  getForecast(location: WeatherLocation): Promise<Forecast>;
}
