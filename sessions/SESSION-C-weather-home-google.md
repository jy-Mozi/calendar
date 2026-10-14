# 세션 C — 날씨·홈·검색·설정·알림 + Google 동기화

- **브랜치**: `feat/c-weather-home-google`
- **관련 문서**: `../PRM.md`(요구사항), `../CLAUDE.md`(공통 규칙), 다른 세션 문서(A, B)

> 파트 1의 날씨 훅은 세션 A의 캘린더(CA-08)가 기다린다. 먼저 끝내고 인수인계 로그에 공지한다. 파트 2(Google)의 사용자 작업(Google Cloud 설정, OAuth 앱 프로덕션 게시)은 일찍 요청해 둔다.

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
git worktree add ../06_calendar-wt/c-weather-home-google -b feat/c-weather-home-google
cd ../06_calendar-wt/c-weather-home-google && claude
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
너는 06_calendar 프로젝트의 세션 C 담당이다.
먼저 CLAUDE.md, PRM.md, 이 문서 전체, 다른 두 세션 문서(A, B)의 인수인계 로그를 읽어라.
이 문서 0-3의 소유 범위 밖 파일은 수정하지 마라. 범위 밖 변경이 필요하면 상대 세션 문서의 "받은 요청"에 한 줄 남겨라.
작업 브랜치는 feat/c-weather-home-google이다. 파트 순서대로 진행하고, 항목이 끝날 때마다 커밋하고 인수인계 로그를 갱신해라.
요구사항이 모호하거나 PRM.md 11장의 미결정 사항에 걸리면 임의로 정하지 말고 질문해라.
```

---

## 파트 1. S4 — 날씨 · 홈 · 검색 · 설정 · 알림

- **선행조건**: S0A, S0B 머지 완료. 홈·검색은 S1~S3의 `api.ts`를 읽기만 하므로, 그 영역이 목업 상태여도 개발할 수 있다.
- **참조**: PRM.md 4-2장(HM), 4-7장(WX), 4-8장(NT), 4-1장(CM-03~06), 8-2장(Open-Meteo)

### 목표
영역을 가로지르는 기능을 맡는다: **날씨**, **홈 대시보드**, **통합 검색**, **설정 화면**, **알림**. 이 세션은 일정·할일·가계부 폴더를 수정하지 않고, 그 영역들의 `api.ts` 조회 함수만 소비한다.

### 소유 범위
- `web/src/features/{weather,home,search,settings}/**`
- `web/src/app/(app)/{page.tsx,search/page.tsx,settings/page.tsx}`
- `supabase/functions/weather/**`
- `web/public/sw.js`(서비스 워커), 푸시 관련 파일
- `supabase/migrations/*_s4_*.sql` (알림 큐 보조 함수 등, 필요한 경우만)

### 건드리지 않는 범위
`features/{calendar,todo,ledger}/**`(조회 함수가 부족하면 `HANDOFF.md`로 해당 세션에 요청), 기본 테이블(S0A), `supabase/functions/{mcp-*,google-*,_shared}`(S5·S6).

### 작업 목록

#### 1. 날씨 (WX) — 먼저 진행. S1(캘린더)이 이 훅을 기다린다.
- [ ] **WX-01** `supabase/functions/weather`: Open-Meteo를 호출하는 프록시. 클라이언트는 이 함수만 호출한다(직접 호출 금지).
- [ ] **WX-04** 응답 캐시: `weather_cache`에 위치 격자(`lat_key`, `lon_key`) 단위로 30~60분 보관. 만료 전에는 외부 호출을 하지 않는다. 이 테이블은 service role로만 쓴다.
- [ ] **WX-03** 현재·시간별(24h)·일별(7일) 예보. 날씨 코드는 앱 공통 아이콘 세트(맑음·흐림·비·눈·뇌우·안개)로 매핑한다.
- [ ] **WX-02** 기본 위치: 도시 검색(Open-Meteo geocoding) → 위도·경도를 `profiles.weather_lat/lon/label`에 저장. 브라우저 위치 사용 옵션
- [ ] `features/weather/api.ts` 구현 + React 훅 `useForecast(date?)`, `useDayWeather(date)`를 만들어 `HANDOFF.md`에 공지한다(S1이 캘린더 셀에 쓴다).
- [ ] 외부 API 장애 시 캐시된 값으로 대체하고, 그것도 없으면 날씨 영역만 숨긴다(다른 기능은 정상 동작해야 한다).
- [ ] 제공처를 추상화한 얇은 계층을 둔다(나중에 기상청으로 바꿀 수 있게).
- [ ] P2: **WX-05** 일정 장소 기반 날씨(지오코딩), **WX-06** 우산 알림, **WX-07** 미세먼지

#### 2. 홈 대시보드 (HM)
- [ ] **HM-01** 오늘 일정(시간순, 클릭 시 상세) — `calendar/api.ts`
- [ ] **HM-02** 오늘 마감 + 지연 할일, 체크로 즉시 완료 — `todo/api.ts`의 `getTodayStats()`와 `setStatus`
- [ ] **HM-03** 이번 달 수입·지출·잔액, 예산 소진율 — `ledger/api.ts`의 `getMonthSummary`, `getBudgetStatus`. **홈에서 다시 합산하지 말고 SQL 결과를 그대로 쓴다.**
- [ ] **HM-04** 날씨 위젯: 현재·7일 예보, 비 예보 안내 문구
- [ ] 인사 문구("일정 N개, 할일 N개가 남았어요"), 연동 상태 배지(Google·MCP 토큰 수)
- [ ] 영역별 로딩 상태를 따로 둔다(한 영역이 느려도 홈 전체가 막히지 않게).
- [ ] P2: **HM-05** 위젯 표시·순서 설정

#### 3. 통합 검색 (CM-04)
- [ ] 일정·할일·거래를 키워드·기간·카테고리로 검색. 결과 유형 필터와 개수, 클릭 시 해당 화면으로 이동
- [ ] 영역별 `search*` 함수가 필요하면 각 영역 `api.ts`에 있는 조회를 쓰고, 부족하면 `HANDOFF.md`로 요청한다. DB 전문 검색이 필요하면 `pg_trgm` 인덱스 마이그레이션(`s4`)을 추가한다.
- [ ] 검색어는 로그에 남기지 않는다(메모·금액 포함 가능성).

#### 4. 설정 (CM-03, CM-05, CM-06 + 연동 슬롯)
- [ ] **CM-03** 카테고리·태그: 일정·할일(프로젝트)·가계부 카테고리 생성·수정·삭제·색상. 사용 중인 카테고리 삭제 시 처리 규칙(이동 또는 막기)
- [ ] **CM-05** 화면: 라이트·다크·시스템 테마, 한 주 시작 요일, 통화(KRW). 값은 `profiles.settings`(jsonb)에 저장하고 새로고침해도 유지
- [ ] **CM-06**(P2) 내보내기(JSON·CSV)와 CSV 가져오기. 거래 CSV는 한글이 깨지지 않게 BOM을 붙인다(프로토타입 방식).
- [ ] **외부 연동 슬롯**: Google 연결 카드와 MCP 토큰 카드의 **자리와 상태 표시**를 만든다. 실제 동작은 S6(Google)·S5(MCP 토큰 발급·폐기)가 연결한다. 슬롯 인터페이스(`IntegrationCard` props)를 `HANDOFF.md`에 공지한다.
- [ ] 프로필·계정(로그아웃 등)은 S0A가 만든 인증 헬퍼를 사용한다.

#### 5. 알림 (NT)
- [ ] **NT-03** 알림 on/off와 기본 시간 설정(설정 화면)
- [ ] **NT-01** 웹 푸시(PWA): 서비스 워커, 푸시 구독 저장, 발송 Edge Function(`supabase/functions/notify`는 이 세션 소유), `notifications` 큐 테이블 사용. 일정(`events.reminders`)·할일(`todos.reminders`) 데이터를 읽는다.
- [ ] **NT-02** 예산 80%/100% 도달 알림: S3의 `budget_status`를 호출. 같은 달·같은 카테고리·같은 단계는 한 번만 보낸다.
- [ ] 발송은 `pg_cron` + Edge Function으로 주기 실행. 중복 발송 방지(`notifications.sent_at`)
- [ ] P2: **NT-04** 이메일 알림

### 다른 세션에 제공하는 계약
- 날씨 훅 `useForecast`, `useDayWeather` → S1(캘린더 셀 CA-08)
- `IntegrationCard` 슬롯 → S5(MCP 토큰), S6(Google)
- 설정 값 저장 위치(`profiles.settings` 키 목록)와 읽기 헬퍼 → 전 영역
- `weather` Edge Function 입출력 → S5(`get_weather` 도구가 같은 함수를 호출하거나 로직을 재사용)

### 의존하는 것
- S0A: `profiles`, `categories`, `weather_cache`, `notifications` 테이블, 인증
- S0B: 셸, 공통 UI, 각 영역 `api.ts` 인터페이스
- S1·S2·S3: 홈·검색·알림이 읽는 조회 함수

### 인수 기준
- [ ] 날씨: 같은 위치를 연속 호출하면 두 번째는 외부 호출 없이 캐시에서 온다. 외부 API를 끊어도 홈이 깨지지 않는다.
- [ ] 홈의 월 수입·지출 숫자가 가계부 화면과 같다.
- [ ] 검색이 세 영역 결과를 한 화면에 보여 주고 클릭하면 해당 화면으로 이동한다.
- [ ] 테마·시작 요일 설정이 새로고침 후에도 유지된다.
- [ ] 푸시 알림이 실제 기기(브라우저)에 도착하고, 같은 알림이 두 번 오지 않는다.
- [ ] API 키·서비스 키가 클라이언트 번들에 없다.
- [ ] `npm run lint`, `npx tsc --noEmit`, `npm run build` 통과.

### 주의
- 이 세션은 가장 많은 영역과 맞닿아 있다. 다른 영역 파일을 직접 고치고 싶어지면 멈추고 `HANDOFF.md`에 요청한다.
- Open-Meteo 이용 조건(비상업적 사용)을 `README`에 적어 둔다. 상업적으로 쓸 계획이면 제공처를 다시 정해야 한다.
- 서비스 워커는 캐시 범위를 잘못 잡으면 배포 후 옛 화면이 남는다. 정적 자원만 캐시하고 API 응답은 캐시하지 않는다.

---

## 파트 2. S6 — Google Calendar 양방향 동기화

- **참조**: PRM.md 4-6장(GC-01~10), 8-1장(Google API), 10장(리스크), 5장 `integrations`·`events`

### 목표
앱의 일정과 Google Calendar를 **이중 입력 없이 양방향으로 동기화**한다. 가장 복잡한 영역이므로 정확성(중복·유실·무한 루프 방지)을 속도보다 우선한다.

### 소유 범위
- `supabase/functions/google-*/**` (예: `google-oauth`, `google-sync`, `google-webhook`, `google-renew`)
- `supabase/migrations/*_s6_*.sql` (동기화 보조 테이블·함수·cron)
- `docs/google-setup.md` (Google Cloud 설정 가이드)

### 건드리지 않는 범위
`web/src/features/calendar/**`(S1. 후크 `onEventChanged`를 채우는 변경만 S1과 합의해 진행), 기본 테이블 정의(S0A. 컬럼 추가는 요청), `_shared`(S5, 읽기 전용 사용).

### 사전 준비 (사용자와 함께)
- [ ] Google Cloud 프로젝트 → Calendar API 활성화 → OAuth 동의 화면 → 클라이언트 ID·시크릿 발급
- [ ] 리디렉션 URI에 Edge Function 콜백 주소 등록
- [ ] **OAuth 앱을 "테스트" 상태로 두면 refresh token이 7일 뒤 만료된다.** 본인 계정만 쓰더라도 프로덕션으로 게시해야 한다(PRM 8-1장). 이 단계는 사용자만 할 수 있으므로 `HANDOFF.md`에 ⛔로 알리고 확인받는다.
- [ ] 클라이언트 시크릿은 Edge Function 환경변수로만 둔다. 저장소·클라이언트에 넣지 않는다.

### 작업 목록

#### 1. 연결과 토큰 (GC-01, GC-09)
- [ ] **GC-01** OAuth 2.0(scope `calendar`) 연결·해제. 콜백 함수에서 code → token 교환
- [ ] `integrations.tokens`에 **암호화해서 저장**(방식은 S0A와 합의한 Vault·pgsodium 사용). 로그에 토큰을 남기지 않는다.
- [ ] **GC-09** access token 만료 시 refresh token으로 자동 갱신. 갱신 실패(권한 취소 등) 시 `integrations.status`를 `reauth_required`로 바꾸고 설정 화면에 재연동 안내가 뜨게 한다.
- [ ] 연결 해제 시 토큰 폐기(Google revoke 호출)와 웹훅 채널 중지
- [ ] **GC-10**(P2) 해제 시 가져온 Google 일정을 유지/삭제 중 선택

#### 2. 캘린더 선택과 최초 가져오기 (GC-02, GC-03)
- [ ] **GC-02** 사용자의 Google 캘린더 목록 조회, 연동할 캘린더 복수 선택, 캘린더별 앱 내 색상 매핑 → `integrations.selected_calendars`
- [ ] **GC-03** 최초 연결 시 기간(기본 과거 1개월~미래 12개월)을 가져와 `events`에 저장. `google_event_id`, `google_calendar_id`, `etag`, `source='google'`을 채운다.
- [ ] 대량 가져오기는 페이지 단위로 나눠 처리하고, 중간에 실패해도 이어서 할 수 있게 한다(재실행 안전).

#### 3. 증분 동기화 (GC-04, GC-06)
- [ ] **GC-04** Google → 앱: `syncToken` 증분 동기화. 변경·삭제(cancelled) 반영. `syncToken`이 만료(410)되면 전체 재동기화로 복구한다.
- [ ] **GC-06** 변경 감지: Google Push Notification(Webhook)으로 즉시, 폴링(15분)을 보완용으로 병행. 웹훅 채널(`channel_id`, `channel_expires_at`)은 최대 약 7일이면 만료되므로 **pg_cron으로 갱신**한다.
- [ ] 웹훅 요청 검증(채널 토큰 확인). 검증 실패 요청은 무시한다.
- [ ] 429·5xx에는 지수 백오프 재시도. 최종 실패는 `integrations`에 상태로 남겨 설정 화면에 보이게 한다.

#### 4. 앱 → Google 반영 (GC-05)
- [ ] 앱에서 일정을 만들거나 고치거나 지우면 Google에 반영. S1의 `onEventChanged` 후크에서 호출한다.
- [ ] 삭제 정책: **앱에서 삭제하면 Google에서도 삭제**(PRM 11장 가정). 가정과 다르게 정해지면 이 문서와 PRM을 같이 고친다.
- [ ] `source='google'`인 일정을 앱에서 수정하면 Google에도 반영한다.
- [ ] 반영 실패 시 큐에 남기고 재시도한다. 앱 화면은 막지 않는다.

#### 5. 충돌과 에코 방지 (GC-07) — 가장 중요
- [ ] **에코 루프 방지**: 앱이 Google에 쓴 변경이 웹훅으로 되돌아와 다시 앱에 쓰이는 일이 없어야 한다. `etag`와 `updated`를 비교해 이미 반영된 변경은 건너뛴다.
- [ ] **중복 생성 방지**: `(user_id, google_calendar_id, google_event_id)` UNIQUE로 같은 Google 일정이 두 번 들어가지 않게 한다. 업서트로 처리한다.
- [ ] **충돌**: 양쪽이 동시에 수정되면 최종 수정 시각이 늦은 쪽이 이기고, 진 쪽 값은 로그(`sync_log`, 필요하면 S6 마이그레이션으로 테이블 추가)에 남긴다. 로그에 제목·메모 같은 내용은 넣지 않는다.
- [ ] 시나리오 테스트: ① 앱 생성 → Google 확인 ② Google 생성 → 앱 확인 ③ 동시 수정 ④ 앱 삭제 ⑤ Google 삭제 ⑥ 웹훅 중복 수신 ⑦ syncToken 만료 ⑧ 토큰 만료

#### 6. 반복 일정 (GC-08, P2)
- [ ] Google의 반복 일정·예외 인스턴스를 앱의 `rrule`·`recurrence_parent_id`에 매핑. 처음에는 "단일 인스턴스로 펼쳐서 가져오기"로 시작하고, 정확한 매핑은 P2로 둔다.

#### 7. 할일 내보내기 연동 (S2의 TD-10, P2)
- [ ] S2의 `getExportableTodos()`로 얻은 할일을 Google 종일 일정으로 내보낸다. 설정 토글이 꺼져 있으면 아무것도 하지 않는다.

### 다른 세션에 제공하는 계약
- `onEventChanged` 후크를 채우는 호출 형식 → S1
- 연결 상태·재연동 필요 여부·마지막 동기화 시각을 읽는 방법 → S4(설정 화면·홈 배지)
- 캘린더 선택·색상 매핑 저장 형식 → S1(캘린더 색 표시)

### 의존하는 것
- S0A: `integrations`, `events` 테이블, 암호화 방식 합의
- S1: `onEventChanged` 후크, `events` 화면
- S4: `IntegrationCard` 슬롯

### 인수 기준
- [ ] 앱에서 만든 일정이 1분 안에 Google에 보이고, Google에서 만든 일정이 앱에 보인다(웹훅 기준 1분, 폴링 기준 최대 15분).
- [ ] 한쪽에서 지우면 다른 쪽에서도 사라진다.
- [ ] 같은 웹훅이 두 번 와도 일정이 중복되지 않는다.
- [ ] 앱 → Google → 앱으로 되돌아오는 무한 루프가 없다(로그로 확인).
- [ ] 토큰 만료 후에도 자동 갱신되고, 권한을 취소하면 설정 화면에 재연동 안내가 뜬다.
- [ ] DB와 로그 어디에도 토큰 평문이 없다.
- [ ] 시나리오 테스트 8개가 통과한다.

### 주의
- **Google 일정은 사용자의 실제 데이터다.** 테스트는 반드시 테스트 전용 캘린더에서 하고, 본인 기본 캘린더에 대량 쓰기·삭제를 하는 테스트는 만들지 않는다. 실제 Google에 쓰는 동작을 처음 실행하기 전에는 사용자에게 확인한다.
- Calendar API 쿼터는 개인 사용에서는 문제없지만, 최초 가져오기와 재동기화 코드가 무한 반복되면 쿼터를 소진한다. 반복 횟수 상한을 둔다.
- 시간대: Google 일정의 `timeZone`과 종일 일정(`date`)을 UTC `timestamptz`로 바꿀 때 하루가 밀리지 않게 한다.


---

## 인수인계 로그 (세션 C만 편집)
형식: `날짜 — 내용`. 종류: ✅ 완료(다른 세션이 쓸 수 있는 것) · 📨 요청 · ⛔ 막힘/결정 필요

2026-10-14 — ✅ 세션 C 시작. 워크트리 `D:/ChaAi/06_calendar-wt/c-weather-home-google`(브랜치 `feat/c-weather-home-google`). 참고: `sessions/`는 아직 git 미추적이라 이 문서는 메인 폴더(`D:/ChaAi/06_calendar/sessions/`)에서만 편집한다.
2026-10-14 — ✅ `supabase/functions/weather` 작성(커밋됨, 아직 배포·실행 검증 전). 입력 `POST {action:"forecast", lat, lon, timezone?}` → `{forecast:{current,hourly[24],daily[7],timezone}, provider, fetchedAt, stale}`, `POST {action:"geocode", query}` → `{results:[{label,lat,lon,country}]}`. 아이콘은 `clear|cloudy|rain|snow|thunder|fog`. 캐시 격자 0.1도, TTL 45분, 장애 시 오래된 캐시로 대체(`stale:true`), 캐시도 없으면 502. 제공처는 `WeatherProvider` 인터페이스로 분리(S5 `get_weather`는 이 함수를 호출하거나 `openmeteo.ts` 재사용).
2026-10-14 — 📨 A에게: `weather_cache`에 `UNIQUE(lat_key, lon_key)` 필요(upsert용). `lat_key`/`lon_key`는 소수 1자리로 반올림한 숫자(numeric)로 쓴다. 다음은 웹 훅(`useForecast`, `useDayWeather`) — A 파트 2(골격·api.ts) 머지 후 시작.

## 받은 요청 (다른 세션이 한 줄씩 추가)
(비어 있음)
