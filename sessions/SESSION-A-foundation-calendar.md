# 세션 A — 기반(DB·인증·앱 골격) + 일정

- **브랜치**: `feat/a-foundation-calendar`
- **관련 문서**: `../PRM.md`(요구사항), `../CLAUDE.md`(공통 규칙), 다른 세션 문서(B, C)

> 이 세션이 **가장 먼저 시작**하고, 파트 1·2가 끝나야 B·C가 화면 작업을 시작할 수 있다. 파트 1을 가장 먼저 끝내 테이블 마이그레이션과 타입을 일찍 커밋하는 것이 전체 일정의 핵심이다.

## 0. 공통 운영 규칙 (세 문서 동일)

세 세션이 동시에 개발해도 충돌하지 않도록 **폴더 소유권**으로 나눈다. 요구사항 원본은 `PRM.md`, 공통 규칙은 `CLAUDE.md`를 따른다.

### 0-1. 세션 구성

| 세션 | 문서 | 맡는 영역 | 내부 순서 |
|---|---|---|---|
| **A** | `SESSION-A-foundation-calendar.md` | DB·RLS·인증, 앱 골격·공통 UI, 일정 | 파트 1(S0A) → 파트 2(S0B) → 파트 3(S1) |
| **B** | `SESSION-B-todo-ledger-mcp.md` | 할일, 가계부, MCP 서버 3종 | 파트 1(S2) → 파트 2(S3) → 파트 3(S5) |
| **C** | `SESSION-C-weather-home-google.md` | 날씨·홈·검색·설정·알림, Google 동기화 | 파트 1(S4) → 파트 2(S6) |

각 파트 제목의 S0A·S0B·S1…은 원래 8세션 분할안의 이름이다. 파트 안에서 "S3에 요청", "S1이 쓴다"처럼 다른 S번호가 나오면 **같은 세션 안의 다른 파트**인지 위 표로 확인한다. 같은 세션 안의 파트끼리는 요청 절차 없이 직접 조율한다.

### 0-2. 진행 순서

```
1단계  세션 A의 파트 1(DB·RLS·인증·타입) → 파트 2(앱 골격)   ← B, C는 UI 작업을 시작하지 않는다
2단계  세션 A 파트 3(일정) ‖ 세션 B ‖ 세션 C                 ← 3세션 동시
통합   모든 세션 머지 후 0-6 점검
```

- B와 C는 A의 파트 1에서 **전체 테이블 마이그레이션과 생성 타입이 커밋된 뒤**에 서버 쪽 작업(SQL 함수, Edge Function)을 먼저 시작할 수 있다. 화면 작업은 A의 파트 2(골격·`api.ts` 인터페이스)가 `main`에 머지된 뒤에 시작한다.
- 예외: 세션 C의 날씨 Edge Function(`supabase/functions/weather`)은 DB 의존이 적어 A와 동시에 시작할 수 있다.
- A의 파트 3(일정)은 세션 C의 날씨 훅(캘린더 셀)과 Google 동기화 후크를 기다리는 항목이 있다. 그 항목은 마지막에 한다.

### 0-3. 소유권

| 경로 | 소유 |
|---|---|
| `supabase/config.toml`, `supabase/seed*.sql`, `supabase/migrations/*_s0a_*` | A |
| `web/src/lib/supabase/**`, `web/src/lib/db/types.ts`(자동 생성), 로그인 페이지, 인증 프록시 | A |
| `web/src/app/layout.tsx`, `web/src/app/(app)/layout.tsx`, `web/src/components/ui/**`, `web/src/lib/format.ts`, 각 영역 `api.ts`·`types.ts`·`api.mock.ts` 골격 | A |
| `web/src/features/calendar/**`, `web/src/app/(app)/calendar/page.tsx` | A |
| `web/src/features/{todo,ledger}/**`, `web/src/app/(app)/{todo,ledger}/page.tsx` | B |
| `supabase/migrations/*_s3_*`(가계부 뷰·함수·cron), `*_s5_*`(MCP) | B |
| `supabase/functions/_shared/**`, `mcp-*/**`, `docs/mcp-setup.md` | B |
| `web/src/features/{weather,home,search,settings}/**`, `web/src/app/(app)/{page.tsx,search,settings}` | C |
| `supabase/functions/{weather,notify,google-*}/**`, `web/public/sw.js`, `docs/google-setup.md` | C |
| `supabase/migrations/*_s4_*`, `*_s6_*` | C |
| `design/**` | 아무도 수정하지 않음(참고용 원본) |
| `PRM.md`, `Sitemap.md`, `CLAUDE.md`, `AGENTS.md` | 사용자 승인 후에만 |
| `web/package.json` | 공유 — 필요한 의존성만 추가하고 즉시 커밋·푸시 |

소유 범위 밖 변경이 필요하면 직접 고치지 않고 해당 세션 문서 맨 아래 **"받은 요청"**에 한 줄을 추가한다(그 칸만 편집).

### 0-4. 브랜치와 워크트리
세션마다 별도 브랜치와 별도 작업 폴더(git worktree)를 쓴다. 같은 폴더를 두 세션이 쓰면 안 된다.

```bash
cd D:/ChaAi/06_calendar
git worktree add ../06_calendar-wt/a-foundation-calendar -b feat/a-foundation-calendar
cd ../06_calendar-wt/a-foundation-calendar && claude
```

- 의존성 설치(`npm i`)는 워크트리마다 `web/`에서 따로 한다.
- 로컬 Supabase는 포트가 겹치므로 **세션 A만 `supabase start`를 실행**한다. B·C는 A가 알려준 접속 정보(인수인계 로그)를 쓴다.
- 세션이 끝나면 PR을 만들고 사용자가 머지한다. 에이전트가 직접 `main`에 푸시하지 않는다. 머지 순서는 A → B·C(순서 무관)이다.
- 시작 전에 `main`을 rebase한다. 머지 충돌은 임의로 해결하지 말고 사용자에게 알린다.

### 0-5. 마이그레이션 규칙
- 파일명: `YYYYMMDDHHMMSS_<파트>_<설명>.sql` (예: `20261020103000_s3_ledger_views.sql`). 파트 접두사는 원래 S이름(`s0a`, `s3`, `s4`, `s5`, `s6`)을 쓴다.
- 자기 영역 테이블만 건드린다. 이미 머지된 마이그레이션은 수정하지 않고 새 마이그레이션으로 바꾼다.
- 테이블 이름·컬럼 이름은 PRM 5장과 같다. 변경은 반드시 인수인계 로그로 공지한다.

### 0-6. 인수인계와 최종 통합 점검
- **인수인계 로그**: 이 문서 맨 아래 섹션이다. 다른 세션이 쓸 수 있는 것(함수 이름·타입·엔드포인트), 요청, 막힌 점을 `날짜 — 내용`으로 적는다. 아래 문서들에서 `HANDOFF.md`라고 쓴 곳은 모두 **이 섹션**(또는 상대 세션 문서의 "받은 요청")을 뜻한다.
- 의미 있는 단위가 끝날 때마다 커밋하고 로그를 갱신한다. 시작할 때 다른 두 세션 문서의 로그를 읽는다.
- **통합 점검(모든 세션 머지 후)**
  - [ ] 새 DB에 마이그레이션 전체를 적용해도 오류가 없다.
  - [ ] 모든 테이블에 RLS가 켜져 있고 다른 사용자 데이터 접근이 막힌다.
  - [ ] 로그인 → 홈 → 일정·할일·거래 추가 → 홈 요약 반영이 한 번에 동작한다.
  - [ ] Google에서 만든 일정이 앱에 보이고, 앱에서 만든 일정이 Google에 보인다.
  - [ ] Claude에서 MCP로 일정 조회, 할일 생성, 거래 기록이 된다.
  - [ ] `npm run lint`, `npx tsc --noEmit`, `npm run build`가 통과한다.
  - [ ] `CLAUDE.md`와 `AGENTS.md`의 디렉터리·명령어가 실제 구조와 맞다.

### 0-7. 미결정 사항 가정 (PRM 11장)
날씨 제공처 Open-Meteo / MCP 호스팅 Supabase Edge Function / Google 삭제는 앱에서 지우면 Google도 삭제 / 가계부 기본 카테고리 식비·교통·주거·통신·쇼핑·문화·의료·기타 / 알림 웹 푸시 / v1은 PWA. 가정과 다르게 정해지면 해당 파트와 PRM.md를 같이 고친다.

### 0-8. 이 세션의 시작 프롬프트
```
너는 06_calendar 프로젝트의 세션 A 담당이다.
먼저 CLAUDE.md, PRM.md, 이 문서 전체, 다른 두 세션 문서(B, C)의 인수인계 로그를 읽어라.
이 문서 0-3의 소유 범위 밖 파일은 수정하지 마라. 범위 밖 변경이 필요하면 상대 세션 문서의 "받은 요청"에 한 줄 남겨라.
작업 브랜치는 feat/a-foundation-calendar이다. 파트 순서대로 진행하고, 항목이 끝날 때마다 커밋하고 인수인계 로그를 갱신해라.
요구사항이 모호하거나 PRM.md 11장의 미결정 사항에 걸리면 임의로 정하지 말고 질문해라.
```

---

## 파트 1. S0A — DB · RLS · 인증

- **참조**: PRM.md 5장(데이터 모델), 4-1장(CM-01·02), 7장(보안)

### 목표
모든 세션이 의존하는 **DB 스키마, RLS, 인증, 생성 타입**을 만든다. 다른 세션이 SQL이나 타입을 바꿔 달라고 요청하지 않아도 되도록 처음부터 PRM 5장의 14개 테이블을 전부 만든다.

### 소유 범위
- `supabase/config.toml`, `supabase/seed.sql`
- `supabase/migrations/*_s0a_*.sql`
- `web/src/lib/supabase/**` (브라우저·서버 클라이언트, 세션 갱신)
- `web/src/lib/db/types.ts` (자동 생성물)
- `web/src/app/login/**`, 인증 프록시 파일
- `web/.env.example`

### 건드리지 않는 범위
`web/src/features/**`, `web/src/components/**`, `supabase/functions/**`, `design/**`. 가계부 뷰·함수는 S3, MCP 토큰 보조 함수는 S5 소관이다.

### 작업 목록 (위에서부터 순서대로)

#### 1단계 — 계약 먼저 (가장 먼저 커밋하고 푸시)
- [ ] `supabase init`, 로컬 스택 기동(`supabase start`) 확인. 사용 포트와 접속 방법을 `HANDOFF.md`의 S0A 섹션에 적는다.
- [ ] PRM 5장의 14개 테이블 마이그레이션 작성: `profiles`, `categories`, `events`, `projects`, `todos`, `accounts`, `transactions`, `recurring_transactions`, `budgets`, `integrations`, `weather_cache`, `mcp_tokens`, `mcp_logs`, `notifications`
  - 공통: `id uuid pk default gen_random_uuid()`, `user_id uuid references auth.users on delete cascade`, `created_at`, `updated_at`(트리거로 자동 갱신)
  - `weather_cache`만 `user_id`가 없다(공용 캐시). 이 테이블은 클라이언트 직접 접근을 막고 Edge Function(service role)만 쓴다.
  - 금액은 `bigint`, 시각은 `timestamptz`(UTC), 반복 규칙은 `text`(RRULE)
  - 열거형은 `check` 제약이나 enum으로: event.source(app/google/mcp), todo.status(todo/doing/done), transaction.type(income/expense/transfer), account.type(cash/bank/card)
  - `events.source`에 `mcp`를 포함한다(디자인 프로토타입이 APP/GCAL/MCP 출처를 표시한다).
- [ ] 인덱스: `events(user_id, start_at)`, `todos(user_id, status, due_date)`, `transactions(user_id, date)`, `budgets` UNIQUE(user_id, category_id, month), `events(user_id, google_calendar_id, google_event_id)` UNIQUE(null 제외)
- [ ] **모든 테이블에 RLS 활성화 + 정책**: `user_id = auth.uid()`의 select/insert/update/delete. insert의 `with check`도 빠뜨리지 않는다.
- [ ] 타입 생성: `supabase gen types typescript --local > web/src/lib/db/types.ts`. 스크립트를 `web/package.json`에 `db:types`로 추가한다.
- [ ] 위 내용을 커밋·푸시하고 `HANDOFF.md`에 ✅로 알린다. **웨이브 B와 S0B가 이 시점부터 타입을 쓸 수 있다.**

#### 2단계 — 인증 (CM-01, CM-02)
- [ ] Supabase Auth: 이메일 로그인과 Google 로그인. `profiles`는 가입 시 트리거로 자동 생성한다.
- [ ] `@supabase/ssr` 기반 브라우저·서버 클라이언트. 서버 컴포넌트와 클라이언트 컴포넌트에서 쓰는 헬퍼를 분리한다.
- [ ] 로그인 페이지(`/login`)와 로그아웃, 비로그인 접근 시 `/login`으로 리다이렉트하는 프록시. **Next.js 16은 파일명·규칙이 이전과 다를 수 있으므로 `web/node_modules/next/dist/docs/`에서 인증 프록시(구 middleware) 규칙을 먼저 확인한다.**
- [ ] 토큰 갱신이 서버 렌더링 중에도 동작하는지 확인한다.

#### 3단계 — 시드와 검증
- [ ] `seed.sql`: 기본 카테고리(일정: 업무·약속·건강·운동·기념 / 할일 프로젝트: 업무·생활·개인 / 가계부: 식비·교통·주거·통신·쇼핑·문화·의료·기타·급여). 사용자별 시드가 필요하면 가입 트리거에서 `categories`를 채운다.
- [ ] 개발용 샘플 데이터(디자인 프로토타입의 목업 데이터 기준)를 별도 파일 `supabase/seed_demo.sql`로 둔다. 운영 시드와 섞지 않는다.
- [ ] **RLS 격리 테스트**: 사용자 A·B를 만들고 A가 B의 행을 select/update/delete 못 하는지 SQL로 검증하는 스크립트(`supabase/tests/rls.sql`)를 만든다. 14개 테이블 전부 포함한다.
- [ ] 마이그레이션을 빈 DB에 처음부터 적용(`supabase db reset`)해도 오류가 없는지 확인한다.

### 다른 세션에 제공하는 계약
- 테이블·컬럼 이름은 PRM 5장과 같다. 이름을 바꾸면 전 세션이 깨지므로 변경은 반드시 `HANDOFF.md`에 공지한다.
- `web/src/lib/supabase/server.ts`, `client.ts`: 모든 영역이 DB 접근에 쓰는 유일한 진입점.
- `web/src/lib/db/types.ts`: `Database` 타입. 다른 세션은 이 파일을 수정하지 않고 재생성만 요청한다.
- 마이그레이션 파일명 규칙: `YYYYMMDDHHMMSS_s0a_<설명>.sql`.

### 인수 기준
- [ ] `supabase db reset`이 오류 없이 끝난다.
- [ ] RLS 테스트 스크립트가 통과한다(교차 접근 0건).
- [ ] 로그인 후에만 `/`에 들어갈 수 있고, 로그아웃하면 `/login`으로 간다.
- [ ] `npm run lint`, `npx tsc --noEmit`, `npm run build` 통과.
- [ ] `.env.example`에 필요한 변수 이름만 있고 실제 키는 없다. `.env*`는 커밋되지 않는다.

### 주의
- service role 키는 서버·Edge Function 환경에서만 쓴다. 클라이언트 번들에 들어가면 안 된다.
- `integrations.tokens`는 평문 저장 금지. Supabase Vault나 pgsodium 암호화 방식을 정하고, 방식은 S6과 `HANDOFF.md`로 합의한다.
- 이미 머지된 마이그레이션은 수정하지 않는다. 변경은 새 마이그레이션으로 만든다.

---

## 파트 2. S0B — 앱 골격 · 공통 UI

- **참조**: PRM.md 6장(화면·UX), 4-1장(CM-07·08), `design/오늘한장.dc.html`

### 목표
지금 `OneDay.tsx` 하나에 몰려 있는 프로토타입을 **영역별로 분해**하고, 각 영역 세션이 자기 폴더만 고치면 되도록 **골격과 데이터 접근 인터페이스**를 만든다. 이 세션이 끝나면 웨이브 B의 세션들이 서로 같은 파일을 건드릴 일이 없어야 한다.

### 소유 범위
- `web/src/app/layout.tsx`, `web/src/app/(app)/layout.tsx` 및 각 영역의 `page.tsx` 골격
- `web/src/components/ui/**` (공통 UI)
- `web/src/lib/format.ts` (금액·날짜·시간대 변환)
- `web/src/features/<영역>/api.ts`, `types.ts`, `api.mock.ts`, `quick-add.tsx`(골격만)
- `web/public/manifest.webmanifest`, 아이콘
- `web/src/components/today/**` (분해가 끝나면 삭제)

### 건드리지 않는 범위
`supabase/**`, `web/src/lib/supabase/**`, `web/src/lib/db/types.ts`(S0A). 영역별 실제 화면 구현은 각 영역 세션이 한다. `design/**` 수정 금지.

### 목표 디렉터리 구조
```
web/src/
  app/
    layout.tsx
    login/                  ← S0A
    (app)/
      layout.tsx            ← 상단 탭·서브탭·빠른 추가·토스트 셸
      page.tsx              ← 홈
      calendar/page.tsx     ← ?view=month|week|list
      todo/page.tsx         ← ?view=list|board
      ledger/page.tsx       ← ?view=tx|cal|stats|budget|assets|rec
      search/page.tsx
      settings/page.tsx     ← ?section=int|cat|noti|view|backup|profile
  features/
    calendar/  todo/  ledger/  weather/  home/  search/  settings/
      api.ts  types.ts  api.mock.ts  quick-add.tsx  (views/…)
  components/ui/            ← 버튼, 칩, 카드, 토글, 모달, 토스트, 필터 바
  lib/format.ts
```
서브탭과 선택 상태는 **URL 쿼리**로 둔다(새로고침·공유·뒤로가기가 동작한다).

### 작업 목록

#### 1. 라우팅과 셸
- [ ] `(app)` 라우트 그룹과 레이아웃: 상단 로고, 탭(홈·일정·할일·가계부), 검색·설정 버튼, 서브탭 줄, 우하단 빠른 추가 버튼
- [ ] 탭·서브탭 활성 상태를 URL에서 읽는다. 프로토타입의 `tab`, `calView`, `todoView`, `lgView`, `setView`가 URL로 바뀐다.
- [ ] 반응형 기준을 프로토타입과 같게 유지한다(wide ≥ 1180, mid ≥ 820, 최소 360). 로직은 `w` state 대신 CSS 그리드 `auto-fit`·미디어 쿼리로 바꿀 수 있으면 바꾼다.
- [ ] 토스트 컨텍스트(`useToast`)와 전역 단축키 `N`(입력 중에는 무시), `Esc`(모달 닫기)

#### 2. 빠른 추가 모달 (CM-08)
- [ ] 모달 셸과 탭(일정·할일·거래)은 S0B가 만들고, **각 탭의 입력 폼은 `features/<영역>/quick-add.tsx`를 불러다 쓴다.** S0B는 목업으로 동작하는 폼을 넣고, 이후 영역 세션이 자기 폴더에서 폼을 고친다.
- [ ] 프로토타입의 검증 동작을 유지한다: 제목 비면 오류, 거래는 금액 0이면 오류, Enter로 저장

#### 3. 데이터 접근 인터페이스 (가장 중요한 산출물)
영역별로 `api.ts`에 **타입이 있는 함수 모음**을 정의한다. 지금은 `api.mock.ts`(프로토타입 목업 데이터)가 구현하고, 각 영역 세션이 `api.supabase.ts`로 교체한다. 화면은 인터페이스만 쓴다.
- [ ] `calendar/api.ts`: `listEvents({from,to})`, `createEvent`, `updateEvent(id, patch, scope?)`, `deleteEvent(id, scope?)`
- [ ] `todo/api.ts`: `listTodos(filter)`, `createTodo`, `updateTodo`, `setStatus(id, status)`, `deleteTodo`, `listProjects()`
- [ ] `ledger/api.ts`: `listTransactions(filter)`, `createTransaction`, `updateTransaction`, `deleteTransaction`, `getMonthSummary(month)`, `getBudgetStatus(month)`, `listAccounts()`, `listRecurring()`
- [ ] `weather/api.ts`: `getForecast(location)` → `{current, hourly, daily}`
- [ ] `settings/api.ts`, `search/api.ts`, `home/api.ts`(홈은 위 영역 api를 조합하므로 자체 함수는 최소로)
- [ ] 타입(`types.ts`)은 S0A의 `Database` 타입에서 파생(`Tables<'events'>` 등)하는 것을 기본으로 한다. S0A 타입이 아직 없으면 임시 타입을 두고 나중에 교체한다.
- [ ] 데이터 로딩은 서버 컴포넌트 우선, 클라이언트 상호작용이 필요한 곳만 클라이언트 컴포넌트. 낙관적 업데이트와 실패 시 롤백(토스트 안내)을 위한 공통 훅 패턴을 하나 정해 문서로 남긴다.

#### 4. 프로토타입 분해
- [ ] `TodayView.tsx`(자동 변환물)와 `OneDay.tsx`를 영역별 컴포넌트로 나눈다: 홈, 일정(월간·주간·목록), 할일(목록·보드), 가계부(6개 탭), 검색, 설정(6개 섹션).
- [ ] 분해하면서 `@ts-nocheck`를 제거하고 타입을 붙인다. 인라인 스타일은 가능한 곳부터 공통 UI 컴포넌트로 올리되, **화면 결과가 디자인과 달라지면 안 된다**(스크린샷으로 비교).
- [ ] 프로토타입의 파생 계산(`pill`, 색상 함수 `C/CL/CD`, 카테고리 색 매핑)은 `lib/`나 `components/ui/`로 옮긴다.
- [ ] 분해가 끝나면 `components/today/`를 삭제한다.

#### 5. 공통 UI와 토큰
- [ ] 색상(`oklch` 팔레트와 카테고리 색), 폰트(Jalnan·Pretendard), 라운드·간격을 토큰으로 정리
- [ ] 공통 컴포넌트: Pill 탭, 칩, 카드, 토글 스위치, 진행 막대, 빈 상태, 모달, 토스트
- [ ] `lib/format.ts`: 금액(천 단위, 원), 날짜(한국어 요일), **UTC 저장 → Asia/Seoul 표시 변환 (CM-07)**
- [ ] 접근성: 키보드 조작, 색 외 텍스트·아이콘 병행, 대비 4.5:1

#### 6. PWA 기반
- [ ] 웹 매니페스트와 아이콘, 설치 가능 상태. 서비스 워커와 푸시는 S4(NT-01)가 맡는다.

### 다른 세션에 제공하는 계약
- 각 영역 폴더의 `api.ts` 인터페이스와 `api.mock.ts`
- `components/ui/**` 공통 컴포넌트, `useToast`, `lib/format.ts`
- URL 쿼리 규칙(서브탭 키 이름)
- 영역 폴더 안의 `views/`는 해당 영역 세션이 자유롭게 구성한다.

### 인수 기준
- [ ] 목업 데이터로 프로토타입의 모든 화면이 디자인과 같게 보이고 동작한다(탭·서브탭·모달·토글·필터).
- [ ] 영역 폴더 하나를 지워도 다른 영역 빌드가 깨지지 않는다(영역 간 직접 import 없음, 공통은 `components/ui`·`lib`만).
- [ ] `@ts-nocheck`가 없고 `npm run lint`, `npx tsc --noEmit`, `npm run build` 통과.
- [ ] 새로고침해도 현재 탭·서브탭이 유지된다.
- [ ] `HANDOFF.md`에 api 인터페이스 목록과 사용법이 적혀 있다.

### 주의
- 영역 간 순환 import를 만들지 않는다. 홈과 검색은 다른 영역의 `api.ts`만 읽고 컴포넌트는 가져오지 않는다.
- 이 세션에서 실제 Supabase 연결은 하지 않는다. 연결은 각 영역 세션이 `api.supabase.ts`로 한다.

---

## 파트 3. S1 — 일정 (Calendar)

- **선행조건**: S0A(스키마·타입), S0B(골격·`features/calendar/api.ts` 인터페이스) 머지 완료
- **참조**: PRM.md 4-3장(CA-01~11), 5장 `events`

### 목표
일정을 Supabase에 저장·조회하는 **캘린더 화면 전체**를 완성한다. Google 동기화(S6)와 날씨(S4)는 연결 지점만 열어 두고 직접 구현하지 않는다.

### 소유 범위
- `web/src/features/calendar/**`
- `web/src/app/(app)/calendar/page.tsx`

### 건드리지 않는 범위
`supabase/migrations`(스키마 변경이 필요하면 `HANDOFF.md`로 S0A에 요청), `features/todo`·`ledger`·`weather` 등 다른 영역, `components/ui/**`(공통 UI 변경이 필요하면 S0B에 요청 — 급하면 자기 폴더에 복사본을 두고 나중에 정리).

### 작업 목록

#### 1. 데이터 연결 (P0)
- [ ] `api.supabase.ts` 구현: `listEvents({from,to})`, `createEvent`, `updateEvent`, `deleteEvent`. `api.ts` 인터페이스를 바꾸지 않는다.
- [ ] 목업 → Supabase 전환 스위치(환경변수 또는 단일 export 교체)
- [ ] 시각은 UTC로 저장하고 Asia/Seoul로 표시. 종일 일정은 시간 없이 날짜만 저장(CA-02)
- [ ] 조회는 보이는 기간(월/주) 단위로 범위 쿼리. 인덱스 `(user_id, start_at)`을 탄다.

#### 2. 보기와 CRUD (P0)
- [ ] **CA-01** 월·주·일 보기 전환, 오늘로 이동, 이전/다음 이동. 선택한 날 패널(프로토타입의 우측 카드)
- [ ] **CA-02** 일정 생성: 제목·시작/종료·종일·장소·메모·카테고리(색). 제목 필수, 종료가 시작보다 빠르면 오류
- [ ] **CA-03** 수정·삭제. 저장 후 새로고침 없이 반영
- [ ] 출처 표시(APP·GCAL·MCP)를 프로토타입처럼 유지. `events.source` 값을 쓴다.

#### 3. 상호작용 (P1)
- [ ] **CA-04** 드래그로 날짜·시간 이동, 가장자리 드래그로 길이 조정(주간 보기). 낙관적 업데이트 후 실패 시 롤백
- [ ] **CA-10** 일정 목록(다가오는 일정, 기간·카테고리 필터, 날짜별 그룹, "오늘/내일/N일 후")
- [ ] **CA-07** 알림 설정: 시작 N분/시간/일 전, 복수 설정 → `events.reminders`(jsonb)에 저장. 실제 발송은 S4(NT-01)가 이 데이터를 읽는다.

#### 4. 반복 일정 (P1)
- [ ] **CA-05** 매일/주/월/년, 요일 지정, 종료 조건 → RRULE 문자열 저장. 전개에는 `rrule` 라이브러리를 쓴다(직접 구현 금지).
- [ ] **CA-06** 수정·삭제 범위 선택: 이 일정만 / 이후 모두 / 전체. 예외 인스턴스는 `recurrence_parent_id`로 부모와 연결
- [ ] 조회 시 보이는 기간만 전개한다. 전체를 미리 만들어 저장하지 않는다.
- [ ] 테스트: 월말 반복, 종료일 있는 반복, 한 건만 수정, 이후 모두 수정

#### 5. 오버레이와 연동 지점
- [ ] **CA-09** 할일 마감일·가계부 결제일 오버레이(토글). **다른 영역 컴포넌트를 import하지 않고 `todo/api.ts`·`ledger/api.ts`의 조회 함수만 쓴다.**
- [ ] **CA-08** 날짜 셀 날씨 표시: S4가 제공하는 날씨 훅을 가져다 쓰는 자리만 만든다. S4가 끝나기 전에는 비워 둔다.
- [ ] **CA-11** 빈 시간 찾기(P2): `findFreeSlots(date, durationMin, range?)` 순수 함수로 구현하고 단위 테스트. S5가 같은 로직이 필요하면 `HANDOFF.md`로 위치를 알린다.
- [ ] **LG-10**(P2) 일정에 예상 비용 첨부 → 실제 지출로 전환: UI 버튼만 이 세션이 만들고, 거래 생성은 S3의 `ledger/api.ts`를 호출한다.
- [ ] Google 동기화(S6) 연결 지점: 일정 생성·수정·삭제 시 호출할 후크 함수(`onEventChanged`)를 비어 있는 상태로 둔다. S6이 채운다. 이 후크를 `HANDOFF.md`에 공지한다.

### 다른 세션에 제공하는 계약
- `features/calendar/api.ts` 구현(Supabase). S4(홈·검색)와 S5(MCP 로직 참고)가 쓴다.
- `onEventChanged` 후크 위치와 시그니처 → S6
- RRULE 전개 유틸 위치 → S5(`list_events`가 반복 일정을 전개해야 한다면)

### 의존하는 것
- S0A: `events` 테이블·RLS·타입
- S0B: 셸, 공통 UI, `api.ts` 인터페이스
- S4: 날씨 훅(CA-08만)
- S2·S3: 조회 함수(CA-09만)

### 인수 기준
- [ ] 일정 생성·수정·삭제가 새로고침 후에도 유지된다(DB 확인).
- [ ] 다른 사용자 계정으로 로그인하면 내 일정이 보이지 않는다.
- [ ] 주간 보기 드래그가 동작하고 실패 시 원래 위치로 돌아온다.
- [ ] 반복 일정 3종 시나리오(전체/이후/이 일정만) 테스트 통과.
- [ ] 한국 시간 기준 날짜 경계(자정 전후)에서 일정이 하루 밀리지 않는다.
- [ ] `npm run lint`, `npx tsc --noEmit`, `npm run build` 통과.

### 주의
- 월간 달력은 한 번에 6주치를 그린다. 이전·다음 달 날짜 셀의 일정도 조회 범위에 포함해야 한다.
- 반복 일정이 있는 달에서 조회 성능이 느려지지 않는지 확인한다(500ms 이내 목표).


---

## 인수인계 로그 (세션 A만 편집)
형식: `날짜 — 내용`. 종류: ✅ 완료(다른 세션이 쓸 수 있는 것) · 📨 요청 · ⛔ 막힘/결정 필요

2026-10-14 — ⛔ 이 PC에 Docker가 없어 `supabase start`/`db reset`/타입 생성/RLS 테스트를 실행할 수 없음. Docker Desktop 설치(또는 원격 Supabase 프로젝트 제공) 필요. 해결 전까지 파트 1은 "SQL 작성 완료, 미검증" 상태.
2026-10-14 — 📝 작업 위치: 워크트리 `D:\ChaAi\06_calendar-wt\a-foundation-calendar`, 브랜치 `feat/a-foundation-calendar`, 커밋 6f3f1c9(rebase 후). 마이그레이션 `20261014120000_s0a_core_schema.sql`(14개 테이블·RLS), `20261014120100_s0a_new_user_defaults.sql`(가입 트리거), `supabase/tests/rls.sql`. **타입(`types.ts`)은 아직 없음** — DB 기동 후 생성.
2026-10-14 — 📝 계약: ① 종일 일정은 start_at/end_at을 KST 자정 시각(UTC 저장)으로, end는 배타적(다음날 자정). ② `integrations.tokens`는 암호문 text, `mcp_tokens.token_hash`와 함께 클라이언트(authenticated)에서 select 불가(컬럼 권한) — 읽기/쓰기는 service role Edge Function. ③ `mcp_logs`는 클라이언트 select/delete만, insert는 service role. ④ `user_id`는 `default auth.uid()`. ⑤ 가입 시 카테고리(일정 5·가계부 9)와 프로젝트(업무·생활·개인) 자동 생성. ⑥ `integrations`는 UNIQUE(user_id, provider), 웹푸시 구독 저장 위치는 S4가 정해 공지.
2026-10-14 — 📝 인증 코드 작성(원격 DB 연결 전, lint·tsc·build 통과): `web/src/lib/supabase/{client,server,proxy}.ts`, `web/src/proxy.ts`(Next 16 규칙, 비로그인 → /login), `/login`, `/auth/callback`, `/auth/signout`(POST), `.env.example`. `db:types`는 `supabase gen types --linked`(link 후 사용). `lib/db/types.ts`는 임시 `any` 자리표시자 — 첫 db push 후 생성물로 교체. ⛔ 대기: 사용자의 `supabase login`·프로젝트 ref·첫 `db push` 승인.
2026-10-14 — ✅ **파트 2(S0B) 골격 완료, 목업 동작** (lint·tsc·build 통과, 모든 화면 로드·콘솔 오류 0, 홈 픽셀 차이 1.8%). 사용법은 `docs/data-pattern.md`. 요약:
  - 셸: `src/components/shell/AppShell.tsx`(탭·서브탭·FAB·토스트·단축키 N/Esc), 라우트 `(app)/{page,calendar,todo,ledger,search,settings}`. 서브탭은 URL 쿼리(`view`, `section`, `filter`, `date`, `cat`, `q`, `type`)로 유지.
  - api 인터페이스(각 영역 `types.ts`의 `*Api`, 진입점 `api.ts`의 `calendarApi/todoApi/ledgerApi/weatherApi/settingsApi/searchApi`, 목업 `api.mock.ts`): calendar `listEvents({from,to})·createEvent·updateEvent(id,patch,scope?)·deleteEvent(id,scope?)` / todo `listTodos(filter)·createTodo·updateTodo·setStatus·deleteTodo·listProjects` / ledger `listTransactions(filter)·createTransaction·updateTransaction·deleteTransaction·getMonthSummary(YYYY-MM)·getBudgetStatus(month)·listAccounts·listRecurring·setRecurringActive` / weather `getForecast(location)→{current,hourly,daily}` / settings `getSettings·updateSettings·listTokens·issueToken·revokeToken` / search `search(q)`.
  - **교체 방법**: 각 영역 `api.ts`의 한 줄을 `USE_MOCK ? mock : supabase` 로 바꾼다(`@/lib/clock`의 `USE_MOCK`, `NEXT_PUBLIC_USE_MOCK=0`). 타입은 DB 행이 아니라 `types.ts`의 도메인 타입(camelCase, 시각 UTC ISO, 날짜 YYYY-MM-DD) — supabase 구현에서 행↔도메인 변환.
  - 공통: `lib/query.ts`(useQuery/mutate/patchCache/invalidate, 실패 시 롤백+토스트), `lib/format.ts`(KST 변환·금액), `lib/decor.ts`, `components/ui/colors.ts`, `useToast`. 각 영역의 `use<영역>Vals.ts`가 화면 값을 만들고 `views/*`가 표시한다(뷰는 여전히 `v` 값 묶음을 받는 상태 — 영역 세션이 자기 폴더에서 자유롭게 정리).
  - 빠른 추가: 셸 `components/quick-add/`, 탭별 입력란은 `features/{calendar,todo,ledger}/quick-add.tsx`.
  - 로컬에서 로그인 없이 보기: `web/.env.local`에 `AUTH_DEV_BYPASS=1`(운영 빌드에서는 무시).
  - 아직 남은 S0B 항목: `@ts-nocheck`는 제거됨(뷰는 `Vals` 느슨한 타입), 인라인 스타일의 공통 컴포넌트화·접근성 점검(대비·키보드)·다크 테마는 미완. 영역 간 순환 import 없음(다른 영역은 `api.ts`/`types.ts`만 참조, 예외는 quick-add 셸).
  - 브랜치는 아직 푸시하지 않음. B·C가 골격을 쓰려면 PR 머지(또는 브랜치 푸시) 필요.
2026-10-14 — ✅ 브랜치 `feat/a-foundation-calendar` origin 푸시 완료(dd1fde1). `gh` CLI가 없어 PR은 아직 미생성 — 생성 링크: https://github.com/jy-Mozi/calendar/pull/new/feat/a-foundation-calendar (파트 1 SQL은 원격 미적용·미검증 상태 포함)
2026-10-14 — ✅ 반복 일정·빈 시간 순수 유틸(DB 비의존, 테스트 20개 통과 `npm test`): `web/src/features/calendar/recurrence.ts`(`expandEvents(events, {from,to})`, `occurrenceStarts`, `planEdit/planDelete(master, occurrenceStart, patch, scope, overrides)` → create/update/delete 연산 목록), `freeSlots.ts`(`findFreeSlots(events, 'YYYY-MM-DD', durationMin, range?)` — **세션 B(S5)의 `find_free_slots`/`list_events` 반복 전개가 이 두 파일을 재사용 가능**. 단 B는 `features/calendar` 소유 밖이므로 import 대신 필요 시 위치만 참고/복사 요청). 시간대는 KST 벽시계 기준 전개.
2026-10-14 — 📝 **스키마 변경(PRM 5장 `events` 추가 컬럼)**: `recurrence_original_start timestamptz`(예외 인스턴스가 덮어쓰는 원래 회차 시작), `cancelled boolean default false`(그 회차 삭제), UNIQUE(recurrence_parent_id, recurrence_original_start). 아직 원격 미적용이라 첫 마이그레이션에 포함했다. `web/package.json`: `rrule`, devDep `vitest`, `@types/node`@22 추가, 스크립트 `test`.
2026-10-19 — ✅ **파트 1 원격 적용·검증 완료**: 개발용 프로젝트 `redhoodmonkey-calrendars`(ref `hkxvhamcmsltljuyfujg`, ap-south-1)에 `supabase link` 후 `db push`로 s0a 마이그레이션 2개 적용(14개 테이블 전부 RLS 켜짐). `supabase/tests/rls.sql` 통과(`npx supabase db query --linked -f supabase/tests/rls.sql`, 트랜잭션 롤백이라 흔적 없음). `web/src/lib/db/types.ts`를 생성 타입으로 교체(`npm run db:types`, 이제 `npx supabase` 사용). lint·tsc·test·build 통과. **B·C는 이제 `Database` 타입을 쓸 수 있다.** CLI는 `npx supabase ...`로 실행(전역 설치 없음), DB 비밀번호는 필요 없음(로그인 토큰 방식). (weather_cache 자릿수는 아래 항목에서 변경됨)
2026-10-19 — ✅ **세션 C 요청 반영**: `weather_cache.lat_key/lon_key`를 `numeric(5,1)`(소수 1자리, 0.1도 격자)로 변경(`20261019120000_s0a_weather_cache_key_precision.sql`, 개발 프로젝트에 적용 완료). `UNIQUE(lat_key, lon_key)` 유지, 기존 행 0건. C의 weather 함수는 키를 소수 1자리로 반올림해 upsert하면 된다. RLS 테스트 재통과.

## 받은 요청 (다른 세션이 한 줄씩 추가)
- 2026-10-14 C→A: `weather_cache`에 `UNIQUE(lat_key, lon_key)`를 두고 두 키를 numeric(소수 1자리 반올림 값)으로 정의해 주세요. weather Edge Function이 upsert에 사용합니다.
