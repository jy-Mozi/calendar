// 영역 간에 같은 모양으로 그려지는 항목(일정 줄, 할일 줄)의 표시 값. 타입만 각 영역에서 가져온다.
import { C, CD, CL, eventHue } from '@/components/ui/colors';
import type { CalendarEvent } from '@/features/calendar/types';
import type { Todo, TodoStatus } from '@/features/todo/types';
import { hhmm, kstParts, ymd } from '@/lib/format';
import { today } from '@/lib/clock';

const SRC = { app: 'APP', google: 'GCAL', mcp: 'MCP' } as const;

export function decorateEvent(e: CalendarEvent) {
  return {
    ...e,
    place: e.location ?? '',
    cat: e.category,
    src: SRC[e.source],
    color: C(eventHue(e.category)),
    timeTxt: e.allDay ? '종일' : hhmm(e.startAt),
  };
}

export const PRIORITY_LABEL = { 1: '상', 2: '중', 3: '하' } as const;
const PRIORITY_HUE = { 1: 25, 2: 55, 3: 255 } as const;
export const STATUS_LABEL: Record<TodoStatus, string> = { todo: '할 일', doing: '진행 중', done: '완료' };

/** 오늘 보기: 오늘 마감 + 지연(미완료) */
export function isTodayTodo(t: Todo) {
  const td = ymd(today());
  return t.dueDate !== null && t.dueDate <= td && (t.status !== 'done' || t.dueDate === td);
}

export function decorateTodo(t: Todo, toggle: () => void) {
  const td = ymd(today());
  const done = t.status === 'done';
  const h = PRIORITY_HUE[t.priority];
  const dueTxt = t.dueDate === null ? '마감 없음' : t.dueDate === td ? '오늘 마감' : `${Number(t.dueDate.slice(5, 7))}월 ${Number(t.dueDate.slice(8))}일`;
  return {
    ...t,
    prio: PRIORITY_LABEL[t.priority],
    due: t.dueDate,
    done,
    late: !done && t.dueDate !== null && t.dueDate < td,
    fill: done ? C(155) : 'transparent',
    deco: done ? 'line-through' : 'none',
    op: done ? 0.45 : 1,
    dueTxt,
    statusTxt: STATUS_LABEL[t.status],
    pBg: CL(h),
    pFg: CD(h),
    toggle,
  };
}

export const kstDay = (iso: string) => kstParts(iso).d;
