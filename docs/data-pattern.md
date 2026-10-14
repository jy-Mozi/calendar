# 데이터 접근 패턴 (세션 A · S0B)

## 구조
```
web/src/features/<영역>/
  types.ts        도메인 타입 + Api 인터페이스 (DB 행이 아니라 화면용 타입)
  api.ts          화면이 쓰는 유일한 진입점: export const <영역>Api
  api.mock.ts     목업 구현 (프로토타입 데이터)
  api.supabase.ts 실제 구현 — 각 영역 세션이 만든다 (아직 없음)
  use<영역>Vals.ts 화면에 넘길 표시 값을 만드는 훅 (URL 쿼리 읽기, 데이터 읽기·쓰기)
  <영역>Page.tsx  훅 + views/* 를 잇는 클라이언트 컴포넌트
  views/*         순수 표시 컴포넌트 (v 로 값을 받는다)
  quick-add.tsx   빠른 추가 모달의 탭별 입력란 (일정·할일·거래)
```

## 목업 → Supabase 교체
각 영역의 `api.ts` 한 줄만 바꾼다.
```ts
import { USE_MOCK } from '@/lib/clock';
export const calendarApi: CalendarApi = USE_MOCK ? mockCalendarApi : supabaseCalendarApi;
```
`NEXT_PUBLIC_USE_MOCK=0` 이면 USE_MOCK 이 false 가 된다. `Api` 인터페이스(`types.ts`)는 바꾸지 않는다. 바꿔야 하면 인수인계 로그에 공지한다.

## 읽기·쓰기 (`lib/query.ts`)
```ts
const { data = [] } = useQuery('todos:all', () => todoApi.listTodos());   // 같은 key 는 캐시 공유

await mutate({
  optimistic: () => patchCache<Todo[]>('todos:all', old => (old ?? []).map(...)), // 되돌리는 함수를 반환
  run: () => todoApi.setStatus(id, 'done'),
  invalidate: ['todos:'],   // prefix 로 시작하는 쿼리를 다시 읽는다
});
```
- 실패하면 낙관적 반영을 되돌리고 토스트(`저장하지 못했어요…`)를 띄운다.
- 쿼리 key 접두사 규칙: `events:` `todos:` `ledger:` `weather:` `settings:` `search:`. 쓰기 후 자기 접두사를 invalidate 한다.
- 서버 컴포넌트에서 미리 읽어야 하는 화면이 생기면 영역 세션이 `page.tsx` 에서 prefetch 후 초기값을 넘기도록 확장한다.

## URL 쿼리 규칙
| 경로 | 쿼리 |
|---|---|
| `/calendar` | `view=month\|week\|list`, `date=YYYY-MM-DD`(선택한 날), `cat=<카테고리>`(목록 필터) |
| `/todo` | `view=list\|board`, `filter=today\|all\|done` |
| `/ledger` | `view=tx\|cal\|stats\|budget\|assets\|rec`, `filter=all\|income\|expense` |
| `/search` | `q=<키워드>`, `type=전체\|일정\|할일\|거래` |
| `/settings` | `section=int\|cat\|noti\|view\|backup\|profile` |

## 영역 간 의존 규칙
- 다른 영역의 **`api.ts`와 `types.ts`만** 가져다 쓴다(예: 홈이 `calendarApi`, 일정 오버레이가 `todoApi`). 다른 영역의 컴포넌트·훅은 가져오지 않는다.
- 여러 영역이 같은 모양으로 그리는 항목(일정 줄, 할일 줄)은 `lib/decor.ts`, 색은 `components/ui/colors.ts`, 시간·금액은 `lib/format.ts`.
- 빠른 추가 셸(`components/quick-add`)만 예외로 세 영역의 `quick-add.tsx` 와 `api.ts` 를 조합한다.

## 시간
- DB·api 의 시각은 UTC ISO. 표시는 `lib/format.ts` 의 `kstParts`, `hhmm` 로 KST 변환한다.
- 종일 일정: `startAt`=KST 자정, `endAt`=다음날 KST 자정(배타적).
- 목업 모드의 "오늘"은 2026-10-14 로 고정(`lib/clock.ts`).

## 로컬 화면 확인
`web/.env.local` 에 `AUTH_DEV_BYPASS=1` 을 넣으면 `npm run dev` 에서 로그인 없이 화면을 볼 수 있다(운영 빌드에서는 무시).
