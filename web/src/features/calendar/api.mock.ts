import { kstToIso } from '@/lib/format';
import type { CalendarApi, CalendarEvent } from './types';

// 프로토타입 목업 데이터 (2026-10 기준)
const raw: [number, string, string, string, string, 'app' | 'google' | 'mcp'][] = [
  [2, '19:00', '가족 저녁', '본가', '약속', 'app'],
  [9, '', '한글날', '공휴일', '기념', 'google'],
  [14, '09:30', '팀 주간회의', '본사 3층 회의실', '업무', 'google'],
  [14, '12:30', '점심 — 지수', '을지로 진주회관', '약속', 'app'],
  [14, '15:00', '치과 정기검진', '강남 서울바른치과', '건강', 'mcp'],
  [14, '19:30', '요가 클래스', '성수 스튜디오', '운동', 'google'],
  [16, '14:00', '프로젝트 마감 회의', '온라인', '업무', 'google'],
  [17, '12:00', '친구 결혼식', '여의도 더파티움', '약속', 'app'],
  [21, '08:00', '부산 출장', 'KTX 서울역', '업무', 'google'],
  [24, '18:30', '동창 모임', '연남동', '약속', 'app'],
  [28, '08:30', '건강검진', '종합검진센터', '건강', 'app'],
  [21, '19:30', '요가 클래스', '성수 스튜디오', '운동', 'google'],
  [12, '10:00', '디자인 리뷰', '본사 5층', '업무', 'google'],
  [13, '18:00', '러닝 크루', '한강 뚝섬', '운동', 'app'],
  [15, '11:00', '분기 보고 미팅', '본사 3층', '업무', 'google'],
  [18, '10:00', '브런치 — 수빈', '한남동', '약속', 'app'],
];

let seq = 100;
let events: CalendarEvent[] = raw.map(([day, time, title, location, category, source], i) => {
  const allDay = !time;
  const [hh, mm] = allDay ? [0, 0] : time.split(':').map(Number);
  return {
    id: `e${i + 1}`,
    title,
    location,
    memo: null,
    category,
    source,
    allDay,
    startAt: kstToIso(2026, 10, day, hh, mm),
    endAt: allDay ? kstToIso(2026, 10, day + 1) : kstToIso(2026, 10, day, hh + 1, mm),
  };
});

export const mockCalendarApi: CalendarApi = {
  async listEvents({ from, to }) {
    return events.filter((e) => e.startAt >= from && e.startAt < to).sort((a, b) => a.startAt.localeCompare(b.startAt));
  },
  async createEvent(input) {
    const ev: CalendarEvent = { ...input, source: input.source ?? 'app', id: `e${seq++}` };
    events = [...events, ev];
    return ev;
  },
  async updateEvent(id, patch) {
    const cur = events.find((e) => e.id === id);
    if (!cur) throw new Error('일정을 찾을 수 없어요.');
    const next = { ...cur, ...patch, id: cur.id } as CalendarEvent;
    events = events.map((e) => (e.id === id ? next : e));
    return next;
  },
  async deleteEvent(id) {
    events = events.filter((e) => e.id !== id);
  },
};
