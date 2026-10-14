// 금액·날짜·시간대 변환. DB는 UTC(timestamptz)로 저장하고 표시할 때 Asia/Seoul로 바꾼다 (CM-07).
export const TIMEZONE = 'Asia/Seoul';
const KST_OFFSET_MS = 9 * 60 * 60 * 1000; // 한국은 DST가 없다

export const DOW = ['일', '월', '화', '수', '목', '금', '토'] as const;

export const won = (n: number) => n.toLocaleString('ko-KR');

export type Ymd = { y: number; m: number; d: number };

const pad = (n: number) => String(n).padStart(2, '0');

/** UTC 시각 → KST 달력 값 */
export function kstParts(iso: string | Date) {
  const t = new Date(iso).getTime() + KST_OFFSET_MS;
  const x = new Date(t);
  return { y: x.getUTCFullYear(), m: x.getUTCMonth() + 1, d: x.getUTCDate(), hh: x.getUTCHours(), mm: x.getUTCMinutes(), dow: x.getUTCDay() };
}

/** KST 날짜·시각 → UTC ISO 문자열 */
export function kstToIso(y: number, m: number, d: number, hh = 0, mm = 0) {
  return new Date(Date.UTC(y, m - 1, d, hh, mm) - KST_OFFSET_MS).toISOString();
}

export const ymd = ({ y, m, d }: Ymd) => `${y}-${pad(m)}-${pad(d)}`;
export const hhmm = (iso: string) => {
  const p = kstParts(iso);
  return `${pad(p.hh)}:${pad(p.mm)}`;
};
export const daysInMonth = (y: number, m: number) => new Date(Date.UTC(y, m, 0)).getUTCDate();
/** 해당 월 1일의 요일 (0=일) */
export const firstDow = (y: number, m: number) => new Date(Date.UTC(y, m - 1, 1)).getUTCDay();
export const dowOf = (y: number, m: number, d: number) => DOW[new Date(Date.UTC(y, m - 1, d)).getUTCDay()];

/** 월 경계 (UTC ISO, 끝은 배타적). 6주 달력이 필요하면 from/to를 직접 넓힌다. */
export function monthRange(y: number, m: number) {
  return { from: kstToIso(y, m, 1), to: kstToIso(m === 12 ? y + 1 : y, m === 12 ? 1 : m + 1, 1) };
}
