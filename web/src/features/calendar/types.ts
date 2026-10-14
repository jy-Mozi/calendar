// 일정 영역 도메인 타입. 화면과 api 인터페이스는 DB 행이 아니라 이 타입을 쓴다.
// 시각은 UTC ISO 문자열. 종일 일정은 KST 자정 시각, end 는 배타적(다음날 자정).
export type EventSource = 'app' | 'google' | 'mcp';
export type EditScope = 'this' | 'following' | 'all';

export type CalendarEvent = {
  id: string;
  title: string;
  startAt: string;
  endAt: string;
  allDay: boolean;
  location: string | null;
  memo: string | null;
  /** 일정 카테고리 이름 (업무·약속·건강·운동·기념) */
  category: string;
  source: EventSource;
  rrule?: string | null;
  recurrenceParentId?: string | null;
  /** 시작 N분 전 목록 */
  reminders?: number[];
};

export type EventInput = Omit<CalendarEvent, 'id' | 'source'> & { source?: EventSource };

export interface CalendarApi {
  /** [from, to) 범위의 일정. 반복 일정은 해당 기간만 전개해서 돌려준다. */
  listEvents(range: { from: string; to: string }): Promise<CalendarEvent[]>;
  createEvent(input: EventInput): Promise<CalendarEvent>;
  updateEvent(id: string, patch: Partial<EventInput>, scope?: EditScope): Promise<CalendarEvent>;
  deleteEvent(id: string, scope?: EditScope): Promise<void>;
}
