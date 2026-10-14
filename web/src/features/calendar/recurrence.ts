// 반복 일정(CA-05, CA-06): RRULE 전개와 "이 일정만 / 이후 모두 / 전체" 편집 계획.
// 순수 함수만 둔다. DB 읽기·쓰기는 api.supabase.ts 가 한다.
//
// 저장 모델
//  - 마스터: rrule 이 있고 recurrenceParentId 가 없는 행. startAt/endAt 은 첫 회차.
//  - 예외 인스턴스: recurrenceParentId = 마스터, recurrenceOriginalStart = 덮어쓰는 회차의 원래 시작.
//    cancelled=true 면 그 회차를 지운 것.
//  - 전개는 보이는 기간만 한다(미리 저장하지 않는다).
// 시간대: 반복 규칙은 KST 벽시계 기준으로 계산한다(요일·월말이 KST 기준). KST 는 DST 가 없어
// "UTC 에 +9h 한 가짜 UTC 시각"으로 rrule 을 돌린 뒤 -9h 하면 된다.
import { RRule } from 'rrule';
import type { CalendarEvent, EditScope, EventInput } from './types';

const KST_MS = 9 * 60 * 60 * 1000;
const toFloating = (iso: string) => new Date(new Date(iso).getTime() + KST_MS);
const fromFloating = (d: Date) => new Date(d.getTime() - KST_MS).toISOString();

type Range = { from: string; to: string };

function buildRule(rrule: string, startAt: string) {
  const opts = RRule.parseString(rrule.replace(/^RRULE:/i, ''));
  opts.dtstart = toFloating(startAt);
  if (opts.until) opts.until = new Date(opts.until.getTime() + KST_MS);
  return new RRule(opts);
}

/** 마스터의 회차 시작 시각들 [from, to) — 길이를 가진 일정이 기간에 걸치도록 from 을 길이만큼 앞당겨 찾는다. */
export function occurrenceStarts(master: CalendarEvent, range: Range): string[] {
  if (!master.rrule) return [];
  const dur = new Date(master.endAt).getTime() - new Date(master.startAt).getTime();
  const rule = buildRule(master.rrule, master.startAt);
  const after = new Date(toFloating(range.from).getTime() - dur);
  const before = toFloating(range.to);
  return rule.between(after, before, true).map(fromFloating).filter((s) => s < range.to);
}

const overlaps = (e: { startAt: string; endAt: string }, r: Range) => e.startAt < r.to && (e.endAt > r.from || e.startAt >= r.from);

/** 일반 일정 + 마스터 전개 + 예외 인스턴스를 합쳐 [from, to) 에 보이는 일정을 돌려준다. */
export function expandEvents(events: CalendarEvent[], range: Range): CalendarEvent[] {
  const overrides = new Map<string, Map<string, CalendarEvent>>();
  events.filter((e) => e.recurrenceParentId).forEach((e) => {
    const m = overrides.get(e.recurrenceParentId!) ?? new Map();
    m.set(e.recurrenceOriginalStart ?? e.startAt, e);
    overrides.set(e.recurrenceParentId!, m);
  });

  const out: CalendarEvent[] = [];
  for (const e of events) {
    if (e.recurrenceParentId) {
      if (!e.cancelled && overlaps(e, range)) out.push(e);
    } else if (e.rrule) {
      const dur = new Date(e.endAt).getTime() - new Date(e.startAt).getTime();
      const own = overrides.get(e.id);
      for (const s of occurrenceStarts(e, range)) {
        if (own?.has(s)) continue; // 예외 인스턴스가 대신한다
        out.push({ ...e, id: `${e.id}@${s}`, startAt: s, endAt: new Date(new Date(s).getTime() + dur).toISOString(), recurrenceParentId: e.id, recurrenceOriginalStart: s });
      }
    } else if (overlaps(e, range)) {
      out.push(e);
    }
  }
  return out.sort((a, b) => a.startAt.localeCompare(b.startAt));
}

// ---------------------------------------------------------------------------
// 편집·삭제 범위 계획 (CA-06)
// ---------------------------------------------------------------------------
type NewEvent = EventInput & { rrule?: string | null; recurrenceParentId?: string | null; recurrenceOriginalStart?: string | null; cancelled?: boolean };
export type EditOp =
  | { op: 'update'; id: string; patch: Partial<NewEvent> }
  | { op: 'create'; event: NewEvent }
  | { op: 'delete'; id: string };

const parts = (rrule: string) => rrule.replace(/^RRULE:/i, '').split(';').filter(Boolean);
const withoutKeys = (rrule: string, keys: string[]) => parts(rrule).filter((p) => !keys.includes(p.split('=')[0].toUpperCase()));
const utcStamp = (iso: string) => iso.replace(/[-:]/g, '').replace(/\.\d{3}/, '');
const countOf = (rrule: string) => Number(parts(rrule).find((p) => p.toUpperCase().startsWith('COUNT='))?.split('=')[1]) || null;

/** occurrenceStart 직전에 끝나도록 UNTIL 을 건 규칙 (COUNT 는 제거) */
const truncated = (rrule: string, occurrenceStart: string) =>
  [...withoutKeys(rrule, ['UNTIL', 'COUNT']), `UNTIL=${utcStamp(new Date(new Date(occurrenceStart).getTime() - 1000).toISOString())}`].join(';');

function baseOf(master: CalendarEvent): NewEvent {
  const { id: _id, source: _s, rrule: _r, recurrenceParentId: _p, recurrenceOriginalStart: _o, cancelled: _c, ...rest } = master;
  void [_id, _s, _r, _p, _o, _c];
  return rest;
}

/** 시간이 바뀌는 patch 면 같은 간격을 마스터 전체(첫 회차)에도 적용한다. */
function shiftMaster(master: CalendarEvent, occurrenceStart: string, patch: Partial<EventInput>): Partial<EventInput> {
  if (!patch.startAt) return patch;
  const delta = new Date(patch.startAt).getTime() - new Date(occurrenceStart).getTime();
  const out: Partial<EventInput> = { ...patch, startAt: new Date(new Date(master.startAt).getTime() + delta).toISOString() };
  const dur = patch.endAt ? new Date(patch.endAt).getTime() - new Date(patch.startAt).getTime() : new Date(master.endAt).getTime() - new Date(master.startAt).getTime();
  out.endAt = new Date(new Date(out.startAt!).getTime() + dur).toISOString();
  return out;
}

/**
 * 반복 일정 수정 계획.
 * @param overrides 같은 마스터의 기존 예외 인스턴스(이후 모두 편집 시 정리 대상)
 */
export function planEdit(master: CalendarEvent, occurrenceStart: string, patch: Partial<EventInput>, scope: EditScope, overrides: CalendarEvent[] = []): EditOp[] {
  if (!master.rrule) return [{ op: 'update', id: master.id, patch }];
  const first = occurrenceStart === master.startAt;
  if (scope === 'all' || (scope === 'following' && first)) return [{ op: 'update', id: master.id, patch: shiftMaster(master, occurrenceStart, patch) }];

  if (scope === 'this') {
    const existing = overrides.find((o) => (o.recurrenceOriginalStart ?? o.startAt) === occurrenceStart);
    if (existing) return [{ op: 'update', id: existing.id, patch }];
    const dur = new Date(master.endAt).getTime() - new Date(master.startAt).getTime();
    return [{
      op: 'create',
      event: { ...baseOf(master), startAt: occurrenceStart, endAt: new Date(new Date(occurrenceStart).getTime() + dur).toISOString(), ...patch, rrule: null, recurrenceParentId: master.id, recurrenceOriginalStart: occurrenceStart },
    }];
  }

  // following: 마스터는 이 회차 직전까지로 줄이고, 이 회차부터 새 마스터를 만든다
  const dur = new Date(master.endAt).getTime() - new Date(master.startAt).getTime();
  const total = countOf(master.rrule);
  const before = total ? occurrenceStarts({ ...master, rrule: master.rrule }, { from: master.startAt, to: occurrenceStart }).length : 0;
  const newRule = total ? [...withoutKeys(master.rrule, ['COUNT']), `COUNT=${Math.max(1, total - before)}`].join(';') : master.rrule;
  const startAt = patch.startAt ?? occurrenceStart;
  const endAt = patch.endAt ?? new Date(new Date(startAt).getTime() + dur).toISOString();
  return [
    { op: 'update', id: master.id, patch: { rrule: truncated(master.rrule, occurrenceStart) } },
    ...overrides.filter((o) => (o.recurrenceOriginalStart ?? o.startAt) >= occurrenceStart).map((o) => ({ op: 'delete' as const, id: o.id })),
    { op: 'create', event: { ...baseOf(master), ...patch, startAt, endAt, rrule: newRule, recurrenceParentId: null, recurrenceOriginalStart: null } },
  ];
}

/** 반복 일정 삭제 계획 */
export function planDelete(master: CalendarEvent, occurrenceStart: string, scope: EditScope, overrides: CalendarEvent[] = []): EditOp[] {
  if (!master.rrule) return [{ op: 'delete', id: master.id }];
  const first = occurrenceStart === master.startAt;
  if (scope === 'all' || (scope === 'following' && first)) return [{ op: 'delete', id: master.id }]; // 예외 인스턴스는 cascade
  if (scope === 'this') {
    const existing = overrides.find((o) => (o.recurrenceOriginalStart ?? o.startAt) === occurrenceStart);
    if (existing) return [{ op: 'update', id: existing.id, patch: { cancelled: true } }];
    const dur = new Date(master.endAt).getTime() - new Date(master.startAt).getTime();
    return [{ op: 'create', event: { ...baseOf(master), startAt: occurrenceStart, endAt: new Date(new Date(occurrenceStart).getTime() + dur).toISOString(), rrule: null, recurrenceParentId: master.id, recurrenceOriginalStart: occurrenceStart, cancelled: true } }];
  }
  return [
    { op: 'update', id: master.id, patch: { rrule: truncated(master.rrule, occurrenceStart) } },
    ...overrides.filter((o) => (o.recurrenceOriginalStart ?? o.startAt) >= occurrenceStart).map((o) => ({ op: 'delete' as const, id: o.id })),
  ];
}
