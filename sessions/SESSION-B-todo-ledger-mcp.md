# 세션 B — 할일 + 가계부 + MCP 서버

- **브랜치**: `feat/b-todo-ledger-mcp`
- **관련 문서**: `../PRM.md`(요구사항), `../CLAUDE.md`(공통 규칙), 다른 세션 문서(A, C)

> 파트 2(가계부)에서 만드는 SQL 함수(`account_balances`, `month_summary`, `budget_status`)를 파트 3(MCP)이 그대로 호출한다. 같은 세션이므로 순서를 지켜 진행한다.

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
git worktree add ../06_calendar-wt/b-todo-ledger-mcp -b feat/b-todo-ledger-mcp
cd ../06_calendar-wt/b-todo-ledger-mcp && claude
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
너는 06_calendar 프로젝트의 세션 B 담당이다.
먼저 CLAUDE.md, PRM.md, 이 문서 전체, 다른 두 세션 문서(A, C)의 인수인계 로그를 읽어라.
이 문서 0-3의 소유 범위 밖 파일은 수정하지 마라. 범위 밖 변경이 필요하면 상대 세션 문서의 "받은 요청"에 한 줄 남겨라.
작업 브랜치는 feat/b-todo-ledger-mcp이다. 파트 순서대로 진행하고, 항목이 끝날 때마다 커밋하고 인수인계 로그를 갱신해라.
요구사항이 모호하거나 PRM.md 11장의 미결정 사항에 걸리면 임의로 정하지 말고 질문해라.
```

---

## 파트 1. S2 — 할일 (Todo)

- **선행조건**: S0A, S0B 머지 완료
- **참조**: PRM.md 4-4장(TD-01~10), 5장 `todos`·`projects`

### 목표
할일 CRUD, 오늘 뷰, 목록·칸반, 프로젝트, 하위 작업, 반복을 Supabase 위에서 완성한다.

### 소유 범위
- `web/src/features/todo/**`
- `web/src/app/(app)/todo/page.tsx`

### 건드리지 않는 범위
스키마(변경이 필요하면 `HANDOFF.md`로 S0A에 요청), 다른 영역 폴더, `components/ui/**`(S0B). 알림 발송은 S4, Google 내보내기 실행은 S6 소관이다.

### 작업 목록

#### 1. 데이터 연결 (P0)
- [ ] `api.supabase.ts` 구현: `listTodos(filter)`, `createTodo`, `updateTodo`, `setStatus`, `deleteTodo`, `listProjects`. `api.ts` 인터페이스는 바꾸지 않는다.
- [ ] 목업 → Supabase 전환
- [ ] 상태 값: `todo` / `doing` / `done`. 프로토타입의 `done`·`doing` 불리언 두 개를 `status` 하나로 바꾼다.

#### 2. 핵심 기능 (P0)
- [ ] **TD-01** 생성: 제목·마감일(선택)·우선순위(상/중/하 → 1~3)·메모·프로젝트
- [ ] **TD-02** 상태 변경. 완료 시 `completed_at` 기록, 완료 해제 시 비운다.
- [ ] **TD-03** 오늘 할일 뷰: 오늘 마감 + 지연 항목, 지연 강조 배지. "지연"은 마감일이 오늘보다 이전이고 미완료인 것(한국 시간 기준 날짜 비교).
- [ ] **TD-04** 전체 목록: 상태·우선순위·마감일·프로젝트 필터와 정렬(마감 없음은 맨 뒤). 필터 항목별 개수 표시
- [ ] 체크 한 번으로 완료 처리, 낙관적 업데이트와 실패 롤백

#### 3. 확장 (P1)
- [ ] **TD-05** 칸반 보드: 컬럼 3개, **드래그로 상태 변경**. 프로토타입의 이전/다음 버튼은 접근성용으로 남긴다.
- [ ] **TD-06** 프로젝트 생성·수정·보관, 프로젝트별 진행률(완료/전체, %)
- [ ] **TD-07** 하위 작업(체크리스트) 1단계: `parent_id`로 연결. 부모 완료 시 하위 작업 처리 규칙(전부 완료해야 부모 완료 가능 vs 부모 완료 시 하위 일괄 완료)을 정해 사용자에게 확인한다.
- [ ] **TD-08** 반복 할일(매일/주/월): **완료할 때 다음 회차를 자동 생성**한다. `rrule`로 다음 날짜를 계산하고, 생성은 트랜잭션으로 처리해 중복 생성을 막는다.
- [ ] **TD-09** 마감 알림 설정: `reminders`(jsonb)에 저장. 발송은 S4가 이 데이터를 읽는다.

#### 4. 연동 지점 (P2)
- [ ] **TD-10** 마감일 있는 할일의 Google 종일 일정 내보내기: 이 세션은 `getExportableTodos()` 함수와 설정 토글 값 저장만 만들고, 실제 Google 호출은 S6이 한다.
- [ ] 오늘 할일 개수 등 홈에서 쓰는 집계 함수 `getTodayStats()`를 `api.ts`에 추가하고 `HANDOFF.md`에 공지한다(S4가 사용).

### 다른 세션에 제공하는 계약
- `features/todo/api.ts`: S4(홈·검색), S1(캘린더 마감 오버레이), S5(MCP 로직 참고)가 사용
- `getTodayStats()`, `getExportableTodos()`
- 우선순위 매핑(상=1, 중=2, 하=3)과 상태 값 정의 → MCP 입력 스키마와 일치해야 한다.

### 의존하는 것
- S0A: `todos`·`projects` 테이블, RLS, 타입
- S0B: 셸, 공통 UI, `api.ts` 인터페이스

### 인수 기준
- [ ] 할일 생성·완료·삭제가 새로고침 후에도 유지된다.
- [ ] 마감 지난 미완료 항목에 "지연"이 표시되고, 완료하면 사라진다.
- [ ] 칸반 드래그 후 새로고침해도 상태가 유지된다.
- [ ] 반복 할일을 완료하면 다음 회차가 정확히 한 번만 생기고, 더블 클릭해도 중복되지 않는다.
- [ ] 다른 사용자 계정에서는 내 할일이 보이지 않는다.
- [ ] `npm run lint`, `npx tsc --noEmit`, `npm run build` 통과.

### 주의
- 마감일은 날짜(`date`)다. 시각이 없는 값을 UTC `timestamptz`로 바꿔 비교하면 하루가 어긋난다.
- 칸반 정렬(`sort_order`)은 같은 컬럼 안에서만 의미가 있다. 드래그 시 갱신 범위를 최소로 한다.

---

## 파트 2. S3 — 가계부 (Ledger)

- **선행조건**: S0A, S0B 머지 완료
- **참조**: PRM.md 4-5장(LG-01~11), 5장 `accounts`·`transactions`·`recurring_transactions`·`budgets`

### 목표
거래 입력부터 통계·예산·계좌·고정지출까지 가계부 전체를 완성한다. 또한 **웹과 MCP가 같은 숫자를 쓰도록 계산을 SQL 뷰·함수로 만들어 제공**한다. 이 SQL이 S5(ledger-mcp)와의 계약이다.

### 소유 범위
- `web/src/features/ledger/**`
- `web/src/app/(app)/ledger/page.tsx`
- `supabase/migrations/*_s3_*.sql` (가계부 뷰·함수·cron)

### 건드리지 않는 범위
기본 테이블 정의(S0A. 컬럼 추가가 꼭 필요하면 `HANDOFF.md`로 요청), 다른 영역 폴더, `components/ui/**`(S0B), `supabase/functions/**`(S5·S6).

### 비즈니스 규칙 (PRM 4-5장)
- 금액은 정수(원), 항상 양수. 방향은 `type`(income/expense/transfer)으로 정한다.
- 계좌 잔액 = 초기 잔액 + 수입 − 지출 ± 이체. 거래 변경과 잔액이 항상 일치해야 한다.
- 이체는 수입·지출 통계에서 제외한다.
- 예산 사용률 = 해당 월·카테고리 지출 합 / 예산. **80% 이상 "주의", 100% 초과 "초과"**.

### 작업 목록

#### 1. SQL 계약 먼저 (가장 먼저 커밋·푸시하고 `HANDOFF.md`에 공지)
- [ ] `account_balances` 뷰(또는 함수): 계좌별 현재 잔액. 잔액을 컬럼에 저장하지 않고 계산한다(불일치 방지). 성능이 문제가 되면 그때 캐시를 검토한다.
- [ ] `month_summary(p_month date)` 함수: 월 수입·지출·잔액(수입−지출), 카테고리별 지출 합계, 전월 대비 증감
- [ ] `budget_status(p_month date)` 함수: 카테고리별 예산·사용·남은 금액·사용률·상태(normal/warn/over)
- [ ] 위 함수는 `security invoker`로 만들어 **호출자의 RLS가 그대로 적용**되게 한다. `security definer`는 쓰지 않는다.
- [ ] 이체 처리: 출금·입금 계좌가 있는 한 건의 거래(`to_account_id`)로 표현. 한쪽만 기록되는 상태가 생기지 않게 한다.
- [ ] 함수·뷰별 SQL 테스트(`supabase/tests/s3_*.sql`): 수입·지출·이체 섞은 시나리오의 기대 값 검증

#### 2. 데이터 연결과 거래 (P0)
- [ ] `api.supabase.ts` 구현: `listTransactions`, `createTransaction`, `updateTransaction`, `deleteTransaction`, `getMonthSummary`(SQL 함수 호출), `getBudgetStatus`(SQL 함수 호출), `listAccounts`, `listRecurring`. `api.ts` 인터페이스는 바꾸지 않는다.
- [ ] **LG-01** 거래 입력: 유형·금액·날짜·카테고리·계좌·메모. 금액 0이면 오류, 천 단위 콤마 입력
- [ ] **LG-02** 수정·삭제. 삭제 후 잔액이 즉시 다시 계산되어 보인다.
- [ ] **LG-03** 거래 목록: 기간·카테고리·계좌·유형 필터, 키워드 검색, 합계 표시. 페이지네이션(1만 건 이상도 가능하게)
- [ ] 홈·검색에서 쓰는 `getMonthSummary`는 클라이언트에서 다시 합산하지 않고 SQL 결과를 그대로 쓴다.

#### 3. 화면 (P1)
- [ ] **LG-04** 월간 달력: 날짜별 수입·지출 합계, 날짜 클릭 시 그날 거래
- [ ] **LG-05** 통계: 카테고리별 비율(도넛), 월별 추이(막대, 최근 6개월), 전월 대비
- [ ] **LG-06** 예산: 월·카테고리별 설정, 사용률 막대, 주의·초과 배지
- [ ] **LG-07** 계좌·자산: 현금·통장·카드 등록, 초기 잔액, 현재 잔액, 순자산
- [ ] **LG-08** 이체: 계좌 간 이동 입력 UI

#### 4. 고정지출 (P1)
- [ ] **LG-09** `recurring_transactions` 관리 화면(켜기/끄기, 다음 결제일, 월 합계)
- [ ] pg_cron 작업: 매일 `next_run_at <= now()`인 활성 항목으로 거래를 자동 등록하고 `next_run_at`을 갱신한다. **같은 날 두 번 실행돼도 중복 등록되지 않게(멱등)** 한다.
- [ ] 말일 처리(31일 결제가 30일 달에 있을 때)와 시간대(Asia/Seoul) 경계를 테스트한다.

#### 5. 확장 (P2)
- [ ] **LG-10** 일정의 예상 비용 → 실제 지출 전환: `createTransactionFromEvent(eventId, amount, …)` 함수를 `api.ts`에 추가해 S1이 호출하게 한다.
- [ ] **LG-11** 영수증 사진 첨부: Supabase Storage 버킷(`receipts`)과 RLS 정책, `transactions.receipt_path`

### 다른 세션에 제공하는 계약
- SQL: `account_balances`, `month_summary(date)`, `budget_status(date)` — S5의 `ledger-mcp`와 S4의 홈·알림이 쓴다.
- `features/ledger/api.ts` — S4(홈·검색), S1(결제일 오버레이)이 쓴다. 결제일 목록용 `listUpcomingBills(from, to)`를 추가해 공지한다.
- 예산 상태 기준값(80/100)과 상태 이름(normal/warn/over)

### 의존하는 것
- S0A: 기본 테이블, RLS, 타입
- S0B: 셸, 공통 UI, `api.ts` 인터페이스

### 인수 기준
- [ ] SQL 테스트가 통과하고, 같은 입력에서 웹 화면 숫자와 SQL 결과가 일치한다.
- [ ] 거래 추가·삭제 후 계좌 잔액·월 요약·예산 사용률이 바로 맞게 바뀐다.
- [ ] 이체는 수입·지출 합계에 들어가지 않는다.
- [ ] 고정지출 작업을 두 번 실행해도 거래가 한 번만 생긴다.
- [ ] 다른 사용자 계정에서는 내 거래·계좌가 보이지 않는다.
- [ ] 거래 1만 건에서도 목록 조회가 500ms 안에 응답한다(인덱스 `(user_id, date)` 확인).
- [ ] 로그와 에러 메시지에 금액·메모가 남지 않는다.
- [ ] `npm run lint`, `npx tsc --noEmit`, `npm run build` 통과.

### 주의
- 프로토타입의 `BASE`(기본 지출)·`DAILY_W` 같은 값은 목업 전용이다. 실제 데이터에서는 쓰지 않는다.
- 금액은 JS `number`로 다뤄도 되는 범위지만, DB는 `bigint`다. 합계 반환 타입이 문자열로 오는지 확인하고 변환 위치를 한 곳에 모은다.
- 월 경계는 한국 시간 기준 날짜로 자른다. UTC로 자르면 말일·1일 거래가 다른 달로 들어간다.

---

## 파트 3. S5 — MCP 서버 (Claude 연동)

- **참조**: PRM.md 4-9장(MC-01~09, 도구 명세 표), 5장 `mcp_tokens`·`mcp_logs`, CLAUDE.md의 MCP 규칙

### 목표
내 Claude(Claude Desktop·Claude Code)에서 일정·할일·가계부를 자연어로 조회·기록할 수 있게 **MCP 서버 3개**(`calendar-mcp`, `todo-mcp`, `ledger-mcp`)와 **토큰 인증·로깅 공통 모듈**을 만든다.

### 소유 범위
- `supabase/functions/_shared/**` (인증·scope·로깅·rate limit·입력 검증)
- `supabase/functions/mcp-calendar/**`, `mcp-todo/**`, `mcp-ledger/**`
- `supabase/migrations/*_s5_*.sql` (토큰 검증·로그 보조 함수, 필요한 경우)
- `docs/mcp-setup.md` (Claude 커넥터 등록 가이드)
- 토큰 발급·폐기 서버 로직(`supabase/functions/mcp-token/**`). 설정 화면의 UI 카드는 S4의 슬롯에 연결한다.

### 건드리지 않는 범위
`web/src/features/**`(화면은 S1~S4), 기본 테이블(S0A), S3의 SQL 함수 본문(호출만 한다), `supabase/functions/{weather,google-*}`.

### 작업 목록

#### 1. 공통 모듈 `_shared` (MC-03~08)
- [ ] **MC-03** 토큰: 설정에서 발급, **원문은 발급 응답에서 1회만 보여 주고 DB에는 해시만 저장**(`mcp_tokens.token_hash`). 접두사 8자(`mcp_xxxx`)는 목록 표시용으로 저장한다. 폐기(`revoked_at`) 시 즉시 거부
- [ ] **MC-04** scope: `read` / `write`. 쓰기 도구는 `write` scope 필요. 토큰에서 scope를 읽어 도구 실행 전에 검사
- [ ] **MC-05** 토큰의 `user_id`로 **RLS가 적용되는 방식**으로 쿼리한다. service role로 임의 사용자 데이터를 읽는 코드를 만들지 않는다. (구현 방식 예: 토큰 검증 후 해당 사용자 권한의 단기 JWT를 발급해 사용자 클라이언트로 쿼리. 방식은 정해서 `HANDOFF.md`에 공지)
- [ ] **MC-06** 호출 로그: 도구명·시각·성공 여부·오류 종류를 `mcp_logs`에 저장, `last_used_at` 갱신. **입력 값(금액·메모·제목)은 로그에 남기지 않는다.** 90일 지난 로그 삭제(cron)
- [ ] **MC-07** 삭제 도구는 `confirm: true`가 없으면 실행하지 않고 "확인이 필요하다"는 결과를 돌려준다.
- [ ] **MC-08** 입력은 JSON Schema(zod 등)로 검증하고, 오류는 사람이 읽을 수 있는 한국어 메시지로 반환한다.
- [ ] **MC-09**(P2) 토큰당 분당 호출 제한(기본 60회)

#### 2. 서버 3종 (MC-01, MC-02)
- [ ] 전송은 Streamable HTTP(원격). Edge Function으로 호스팅하고 Claude 커넥터로 등록할 수 있는 URL을 만든다.
- [ ] 로컬 사용을 위한 stdio 실행 진입점도 만든다(같은 도구 코드를 공유).
- [ ] TypeScript MCP SDK 사용. Deno(Edge Function)에서 동작하는 방식으로 구성한다.

**`calendar-mcp`** — PRM 4-9장 표 그대로
- [ ] `list_events(start, end, query?)` (read) — 반복 일정은 조회 기간 안에서 전개해 반환
- [ ] `create_event(title, start, end, all_day?, location?, memo?, category?)` (write) — `source = 'mcp'`로 저장
- [ ] `update_event(id, …)` (write), `delete_event(id, confirm)` (write)
- [ ] `find_free_slots(date, duration_min, range?)` (read) — S1이 만든 로직 참고, 동일 결과여야 한다.
- [ ] `get_weather(date, location?)` (read) — S4의 weather 함수 호출

**`todo-mcp`**
- [ ] `list_todos(status?, due_from?, due_to?, project?)`, `create_todo`, `update_todo`, `complete_todo`, `delete_todo(confirm)`, `list_projects`
- [ ] 우선순위·상태 값은 S2 정의와 일치(상=1·중=2·하=3, todo/doing/done)

**`ledger-mcp`**
- [ ] `add_transaction(type, amount, category, date?, account?, memo?)` (write) — 금액은 양의 정수만 허용
- [ ] `list_transactions(start, end, category?, account?)` (read) — 합계 포함
- [ ] `get_summary(month)` → S3의 `month_summary` 호출. **서버에서 다시 합산하지 않는다.**
- [ ] `get_budget_status(month)` → S3의 `budget_status` 호출
- [ ] `list_accounts()` → S3의 `account_balances`

#### 3. 토큰 관리 서버 로직
- [ ] `mcp-token` 함수: 발급(이름, scope) / 목록 / 폐기. 로그인한 사용자만 호출 가능
- [ ] S4의 설정 화면 슬롯과 연결할 입출력 형식을 `HANDOFF.md`에 공지

#### 4. 문서와 테스트
- [ ] `docs/mcp-setup.md`: 토큰 발급 → Claude Desktop·Claude Code에 커넥터 등록 → 사용 예시 4개(PRM 4-9장 대화 예시)
- [ ] 도구별 단위 테스트: 정상, 권한 없음(read 토큰으로 write 도구), 폐기된 토큰, 입력 오류, 다른 사용자 데이터 접근 시도, `confirm` 없는 삭제
- [ ] **교차 접근 테스트**: 사용자 A의 토큰으로 B의 데이터를 읽거나 쓸 수 없다.

### 다른 세션에 제공하는 계약
- 토큰 발급·목록·폐기 API → S4(설정 화면 MCP 카드)
- `_shared`의 인증·로깅 모듈 → S6(Google 웹훅 함수가 로깅만 재사용할 수 있음, 읽기 전용)
- 커넥터 URL 형식과 등록 방법 문서

### 의존하는 것
- S0A: `mcp_tokens`, `mcp_logs`, 인증, 타입
- S3: `account_balances`, `month_summary`, `budget_status`
- S1·S2: 우선순위·상태·반복 전개 규칙 일치
- S4: weather 함수

### 인수 기준
- [ ] Claude에서 "내일 일정 알려줘", "이번 주 할일 정리해줘", "점심 12,000원 식비로 기록해줘"가 실제로 동작한다.
- [ ] read 토큰으로 쓰기 도구를 호출하면 거부된다.
- [ ] `confirm` 없는 삭제 호출은 아무것도 지우지 않는다.
- [ ] 폐기한 토큰은 즉시 거부된다.
- [ ] A의 토큰으로 B의 데이터에 접근하는 테스트가 전부 실패한다(차단).
- [ ] `mcp_logs`에 금액·제목·메모가 없다.
- [ ] DB에 토큰 원문이 없다(해시만).
- [ ] `get_summary`의 숫자가 가계부 화면과 같다.

### 주의
- 이 서버는 **개인 금융 정보를 외부 AI가 읽는 통로**다. 권한은 가장 좁게 시작한다(처음엔 read 위주로 열고 write는 단계적으로).
- MCP 도구 설명 문구는 모델이 읽는다. 설명에 사용자 데이터를 섞지 않는다.
- 도구가 반환하는 데이터(메모·제목 등)는 사용자가 입력한 텍스트다. 서버 측에서 그 내용을 명령으로 해석하는 코드는 만들지 않는다.


---

## 인수인계 로그 (세션 B만 편집)
형식: `날짜 — 내용`. 종류: ✅ 완료(다른 세션이 쓸 수 있는 것) · 📨 요청 · ⛔ 막힘/결정 필요

(비어 있음)

## 받은 요청 (다른 세션이 한 줄씩 추가)
(비어 있음)
