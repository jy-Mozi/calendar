// oklch 팔레트. hue 하나로 진한색(C)·옅은 배경(CL)·진한 글자색(CD)을 만든다.
export const C = (h: number) => `oklch(0.62 0.13 ${h})`;
export const CL = (h: number) => `oklch(0.95 0.035 ${h})`;
export const CD = (h: number) => `oklch(0.42 0.13 ${h})`;

export const INK = '#15171a';
export const MUTED = '#5b6068';

/** 일정 카테고리 hue */
export const EVENT_HUE: Record<string, number> = { 업무: 255, 약속: 55, 건강: 155, 운동: 320, 기념: 20 };
/** 가계부 카테고리 hue */
export const LEDGER_HUE: Record<string, number> = { 식비: 55, 교통: 255, 쇼핑: 320, 문화: 20, 생활: 155, 주거: 285, 통신: 200, 급여: 255 };
export const eventHue = (cat: string) => EVENT_HUE[cat] ?? 255;
export const ledgerHue = (cat: string) => LEDGER_HUE[cat] ?? 255;

/** 활성/비활성 pill 탭 색 */
export const pill = (on: boolean, onBg = INK) => ({ bg: on ? onBg : 'transparent', fg: on ? '#fff' : MUTED });
/** 토글 스위치 색과 정렬 */
export const sw = (on: boolean) => ({ track: on ? C(155) : '#d7dbe1', jc: on ? 'flex-end' : 'flex-start' });
