# PRM (Product Requirements) — 통합 일정·할일·가계부 서비스

> 메뉴/기능 개요는 `Sitemap.md` 참조. 이 문서는 요구사항을 상세히 정의한다.
> 문서 버전: v0.1 (초안) · 작성일: 2026-10-14

---

## 1. 개요

### 1-1. 제품 비전
일정·할일·가계부를 한 곳에서 관리하고, Google Calendar·날씨와 연동하며, Claude(MCP)로 자연어 조작까지 가능한 **나만의 개인 생산성 서비스**.

### 1-2. 배경 및 문제
| 문제 | 해결 방향 |
|---|---|
| 일정/할일/가계부 앱이 분산되어 있어 맥락이 끊김 | 하나의 서비스·하나의 계정·하나의 대시보드 |
| Google Calendar를 이미 쓰고 있어 이중 입력이 번거로움 | 양방향 동기화 |
| 입력 자체가 귀찮아 기록이 끊김 | Claude에게 말로 입력(MCP) |
| 일정 계획 시 날씨를 따로 확인 | 일정/캘린더에 날씨 통합 표시 |

### 1-3. 목표 / 비목표
**목표**
- G1. 하루의 일정·할일·지출을 한 화면에서 파악한다.
- G2. Google Calendar와 이중 입력 없이 동기화한다.
- G3. Claude에서 자연어로 세 서비스를 조회·생성·수정한다.
- G4. 모바일/데스크톱 모두에서 빠르게 입력한다(3탭 이내).

**비목표 (v1 제외)**
- 다인원 공유·협업(가족 공유 가계부, 일정 초대)
- 은행/카드 자동 연동(오픈뱅킹, 문자 파싱)
- 다중 통화·환율, 투자/자산 시세 관리
- 네이티브 앱 (v1은 반응형 웹/PWA)

### 1-4. 사용자
- **주 사용자**: 본인 1인 (개인 사용). 단일 사용자이나 계정 단위 데이터 격리(RLS)는 유지한다.
- **사용 환경**: PC 브라우저(주), 모바일 브라우저/PWA, Claude Desktop·Claude Code(MCP).

### 1-5. 성공 지표
| 지표 | 목표 |
|---|---|
| 일일 사용 | 주 5일 이상 접속 |
| 입력 속도 | 거래/할일 빠른 추가 10초 이내 |
| 동기화 지연 | Google ↔ 앱 변경 반영 1분 이내(Webhook), 최대 15분(폴링) |
| MCP 성공률 | 도구 호출 성공 95% 이상 |
| 페이지 로딩 | 대시보드 LCP 2.5초 이내 |

---

## 2. 용어 정의
| 용어 | 의미 |
|---|---|
| 일정(Event) | 시작/종료 시각이 있는 항목 |
| 할일(Todo) | 마감일이 있거나 없는 처리 대상, 상태를 가짐 |
| 거래(Transaction) | 수입/지출/이체 1건 |
| 반복 규칙(RRULE) | RFC 5545 형식의 반복 정의 |
| MCP | Model Context Protocol. Claude가 외부 도구를 호출하는 규격 |
| RLS | Supabase(PostgreSQL) 행 단위 접근 제어 |

---

## 3. 기술 스택 (제안)
| 영역 | 선택 | 비고 |
|---|---|---|
| 프론트엔드 | Next.js (React) + TypeScript + Tailwind | PWA 지원 |
| 캘린더 UI | FullCalendar 또는 직접 구현 | 월/주/일 보기, 드래그 |
| 백엔드/DB | Supabase (PostgreSQL, Auth, Realtime, Storage) | |
| 서버리스 | Supabase Edge Functions (Deno) | 동기화·날씨·MCP |
| 스케줄 | pg_cron + Edge Function | 고정지출, 동기화 갱신 |
| 외부 API | Google Calendar API v3, Open-Meteo | |
| MCP | TypeScript MCP SDK, Streamable HTTP | 서비스별 3개 |
| 배포 | Vercel(웹) + Supabase(백엔드) | |

---

## 4. 기능 요구사항

우선순위: **P0** 필수(MVP) / **P1** 중요 / **P2** 추후. 각 항목에는 ID를 부여한다.

### 4-1. 공통 / 계정
| ID | 요구사항 | 우선순위 |
|---|---|---|
| CM-01 | 이메일 및 Google 계정으로 로그인/로그아웃 (Supabase Auth) | P0 |
| CM-02 | 모든 데이터는 본인 `user_id`로만 조회·수정 가능 (RLS) | P0 |
| CM-03 | 카테고리·태그를 서비스별(일정/할일/가계부)로 생성·수정·삭제하고 색상 지정 | P0 |
| CM-04 | 통합 검색: 일정·할일·거래를 키워드/기간/카테고리로 한 번에 검색 | P1 |
| CM-05 | 라이트/다크 테마, 한 주 시작 요일, 통화 단위(KRW 기본) 설정 | P1 |
| CM-06 | 데이터 내보내기(JSON/CSV) 및 CSV 가져오기 | P2 |
| CM-07 | 시간대 설정(기본 Asia/Seoul), 모든 시각은 UTC로 저장하고 표시 시 변환 | P0 |
| CM-08 | 빠른 추가 바(일정/할일/거래 선택 후 최소 입력) 상시 제공 | P0 |

### 4-2. 홈 대시보드
| ID | 요구사항 | 우선순위 |
|---|---|---|
| HM-01 | 오늘 일정을 시간순 표시, 클릭 시 상세 | P0 |
| HM-02 | 오늘 마감 + 지연된 할일 표시, 체크박스로 즉시 완료 | P0 |
| HM-03 | 이번 달 수입·지출·잔액, 예산 소진율 표시 | P0 |
| HM-04 | 날씨 위젯: 현재 기온·상태·강수확률, 7일 예보 | P0 |
| HM-05 | 위젯 표시/순서 사용자 설정 | P2 |

### 4-3. 일정 (Calendar)
| ID | 요구사항 | 우선순위 |
|---|---|---|
| CA-01 | 월/주/일 보기 전환, 오늘로 이동, 이전/다음 이동 | P0 |
| CA-02 | 일정 생성: 제목, 시작/종료, 종일 여부, 장소, 메모, 카테고리(색상) | P0 |
| CA-03 | 일정 수정/삭제 | P0 |
| CA-04 | 드래그로 날짜·시간 이동, 가장자리 드래그로 길이 조정 | P1 |
| CA-05 | 반복 일정(매일/주/월/년, 요일 지정, 종료 조건) — RRULE 저장 | P1 |
| CA-06 | 반복 일정 수정 범위 선택: 이 일정만 / 이후 모두 / 전체 | P1 |
| CA-07 | 알림: 시작 N분/시간/일 전 (복수 설정) | P1 |
| CA-08 | 캘린더 날짜 셀에 날씨 아이콘·최저/최고 기온 표시 (예보 범위 내) | P1 |
| CA-09 | 할일 마감일, 가계부 고정지출 결제일을 캘린더에 오버레이(토글 가능) | P1 |
| CA-10 | 일정 목록 보기(다가오는 일정, 기간/카테고리 필터) | P1 |
| CA-11 | 빈 시간 찾기(지정 길이의 가능한 슬롯 제안) | P2 |

**수용 기준 (CA-02 예)**
- 제목 미입력 시 저장 불가, 종료가 시작보다 빠르면 오류 표시
- 종일 일정은 시간 입력 없이 날짜만 저장
- 저장 후 캘린더에 즉시 반영 (새로고침 불필요)

### 4-4. 할일 (Todo)
| ID | 요구사항 | 우선순위 |
|---|---|---|
| TD-01 | 할일 생성: 제목, 마감일(선택), 우선순위(상/중/하), 메모, 프로젝트 | P0 |
| TD-02 | 상태: 할 일 / 진행 중 / 완료. 완료 시 완료 시각 기록 | P0 |
| TD-03 | 오늘 할일 뷰: 오늘 마감 + 지연된 항목(지연 강조) | P0 |
| TD-04 | 전체 목록 뷰, 상태·우선순위·마감일·프로젝트 필터/정렬 | P0 |
| TD-05 | 칸반 보드 뷰 (드래그로 상태 변경) | P1 |
| TD-06 | 프로젝트(그룹) 생성, 프로젝트별 진행률(완료/전체) 표시 | P1 |
| TD-07 | 하위 작업(체크리스트) 1단계 | P1 |
| TD-08 | 반복 할일(매일/주/월), 완료 시 다음 회차 자동 생성 | P1 |
| TD-09 | 마감 알림 | P1 |
| TD-10 | 마감일 있는 할일의 Google 캘린더 종일 일정 내보내기(옵션) | P2 |

### 4-5. 가계부 (Ledger)
| ID | 요구사항 | 우선순위 |
|---|---|---|
| LG-01 | 거래 입력: 유형(수입/지출/이체), 금액, 날짜, 카테고리, 계좌, 메모 | P0 |
| LG-02 | 거래 수정/삭제, 삭제 시 계좌 잔액 재계산 | P0 |
| LG-03 | 거래 목록: 기간·카테고리·계좌·유형 필터, 키워드 검색, 합계 표시 | P0 |
| LG-04 | 월간 달력 보기: 날짜별 수입/지출 합계, 날짜 클릭 시 해당 일 거래 | P1 |
| LG-05 | 통계: 카테고리별 비율, 월별 추이, 전월 대비 증감 | P1 |
| LG-06 | 예산: 월·카테고리별 금액 설정, 사용률 표시, 초과 시 경고 | P1 |
| LG-07 | 계좌/자산: 현금·통장·카드 등록, 초기 잔액, 현재 잔액 자동 계산 | P1 |
| LG-08 | 이체: 계좌 간 이동 (수입/지출 통계에서 제외) | P1 |
| LG-09 | 고정지출/반복거래: 주기·금액·계좌 지정 시 pg_cron이 자동 등록 | P1 |
| LG-10 | 일정에 예상 비용 첨부 → 실제 지출 거래로 전환 | P2 |
| LG-11 | 영수증 사진 첨부 (Supabase Storage) | P2 |

**비즈니스 규칙**
- 금액은 정수(원 단위)로 저장하며 항상 양수, 방향은 유형으로 결정한다.
- 계좌 잔액 = 초기 잔액 + 수입 − 지출 ± 이체. 거래 변경 시 트랜잭션으로 일관성을 보장한다.
- 예산 사용률 = 해당 월·카테고리 지출 합 / 예산 금액. 80% 도달 시 주의, 100% 초과 시 경고.

### 4-6. Google Calendar 연동
| ID | 요구사항 | 우선순위 |
|---|---|---|
| GC-01 | 설정에서 Google OAuth 2.0으로 연결/해제 (scope: `calendar`) | P1 |
| GC-02 | 연동할 Google 캘린더 선택(복수), 캘린더별 앱 내 색상 매핑 | P1 |
| GC-03 | 최초 연결 시 선택한 기간(기본: 과거 1개월~미래 12개월) 일정 가져오기 | P1 |
| GC-04 | Google → 앱: 증분 동기화(`syncToken`), 변경·삭제 반영 | P1 |
| GC-05 | 앱 → Google: 앱에서 생성/수정/삭제한 일정을 Google에 반영 | P1 |
| GC-06 | 변경 감지: Google Push Notification(Webhook) + 폴링 보완(15분) | P1 |
| GC-07 | 충돌 처리: 양쪽이 동시에 수정되면 최종 수정 시각이 늦은 쪽 우선, 로그 기록 | P1 |
| GC-08 | 반복 일정/예외 인스턴스 매핑 지원 | P2 |
| GC-09 | 토큰 만료 시 refresh token으로 자동 갱신, 실패 시 재연동 안내 | P1 |
| GC-10 | 연결 해제 시: 가져온 Google 일정을 유지/삭제 중 선택 | P2 |

**데이터 매핑**: `events.google_event_id`, `google_calendar_id`, `etag`, `updated_at`을 보관하여 중복 생성과 무한 동기화 루프(에코)를 방지한다.

### 4-7. 날씨 연동
| ID | 요구사항 | 우선순위 |
|---|---|---|
| WX-01 | Edge Function이 Open-Meteo를 호출하는 프록시 역할 (클라이언트 직접 호출 금지) | P0 |
| WX-02 | 기본 위치 설정(도시 검색 → 위도/경도 저장), 브라우저 위치 사용 옵션 | P0 |
| WX-03 | 현재 날씨, 시간별(24h), 일별(7일) 예보 제공 | P0 |
| WX-04 | 응답 캐시 30~60분 (위치 격자 단위) | P0 |
| WX-05 | 일정에 장소가 있으면 해당 장소 좌표로 날씨 조회(지오코딩) | P2 |
| WX-06 | 비/눈 예보일에 일정·할일이 있으면 우산 알림 | P2 |
| WX-07 | 미세먼지(대기질) 표시 | P2 |

날씨 코드는 앱 공통 아이콘 세트(맑음/흐림/비/눈/뇌우/안개)로 매핑한다.

### 4-8. 알림
| ID | 요구사항 | 우선순위 |
|---|---|---|
| NT-01 | 일정·할일 알림을 웹 푸시(PWA)로 발송 | P1 |
| NT-02 | 예산 80%/100% 도달 알림 | P1 |
| NT-03 | 알림 on/off 및 기본 알림 시간 설정 | P1 |
| NT-04 | 이메일 알림(대안) | P2 |

### 4-9. MCP 서버 (Claude 연동)
세 서버는 공통 인증/로깅 모듈을 공유하고 서비스별로 분리 배포한다.

| ID | 요구사항 | 우선순위 |
|---|---|---|
| MC-01 | `calendar-mcp`, `todo-mcp`, `ledger-mcp` 3개 서버 제공 | P1 |
| MC-02 | 전송: Streamable HTTP(원격, Edge Function). 로컬 stdio 실행도 지원 | P1 |
| MC-03 | 인증: 설정 화면에서 개인 토큰 발급, 해시 저장, 폐기 가능 | P1 |
| MC-04 | 토큰별 scope: `read` / `write`. 쓰기 도구는 `write` 필요 | P1 |
| MC-05 | 모든 도구는 토큰의 `user_id`로 RLS 적용된 쿼리만 실행 | P1 |
| MC-06 | 호출 로그(도구명, 시각, 성공 여부) 저장, 토큰 `last_used_at` 갱신 | P1 |
| MC-07 | 삭제 도구는 `confirm: true` 파라미터가 있어야 실행(실수 방지) | P1 |
| MC-08 | 입력은 JSON Schema로 검증, 오류는 사람이 읽을 수 있는 메시지로 반환 | P1 |
| MC-09 | 분당 호출 제한(예: 60회) | P2 |

**도구 명세**

`calendar-mcp`
| 도구 | 입력 | 출력 | 권한 |
|---|---|---|---|
| `list_events` | start, end, query? | 일정 배열 (id, title, start, end, location, category) | read |
| `create_event` | title, start, end, all_day?, location?, memo?, category? | 생성된 일정 | write |
| `update_event` | id, 변경 필드 | 수정된 일정 | write |
| `delete_event` | id, confirm | 결과 | write |
| `find_free_slots` | date, duration_min, range? | 가능한 시간대 배열 | read |
| `get_weather` | date, location? | 날씨 요약 | read |

`todo-mcp`
| 도구 | 입력 | 출력 | 권한 |
|---|---|---|---|
| `list_todos` | status?, due_from?, due_to?, project? | 할일 배열 | read |
| `create_todo` | title, due?, priority?, project?, memo? | 생성된 할일 | write |
| `update_todo` | id, 변경 필드 | 수정된 할일 | write |
| `complete_todo` | id | 완료 처리 결과 | write |
| `delete_todo` | id, confirm | 결과 | write |
| `list_projects` | — | 프로젝트 + 진행률 | read |

`ledger-mcp`
| 도구 | 입력 | 출력 | 권한 |
|---|---|---|---|
| `add_transaction` | type, amount, category, date?, account?, memo? | 생성된 거래 | write |
| `list_transactions` | start, end, category?, account? | 거래 배열 + 합계 | read |
| `get_summary` | month (YYYY-MM) | 수입/지출/잔액, 카테고리별 합계 | read |
| `get_budget_status` | month | 카테고리별 예산/사용/남은 금액 | read |
| `list_accounts` | — | 계좌 + 잔액 | read |

**대화 예시**
- "내일 일정 알려주고 비 오는지도 알려줘" → `list_events`, `get_weather`
- "이번 주 안에 끝내야 할 일 뽑아줘" → `list_todos(due_to=일요일)`
- "점심 12,000원 식비로 기록해줘" → `add_transaction(type=expense, amount=12000, category=식비)`
- "이번 달 외식비 예산 얼마 남았어?" → `get_budget_status`

---

## 5. 데이터 모델

모든 테이블: `id uuid PK`, `user_id uuid FK(auth.users)`, `created_at`, `updated_at`. RLS 정책: `user_id = auth.uid()`.

| 테이블 | 주요 컬럼 | 비고 |
|---|---|---|
| `profiles` | name, timezone, weather_lat, weather_lon, weather_label, settings(jsonb) | auth.users 1:1 |
| `categories` | type(event/todo/ledger), name, color, icon, sort_order | |
| `events` | title, start_at, end_at, all_day, location, memo, category_id, rrule, recurrence_parent_id, reminders(jsonb), google_event_id, google_calendar_id, etag, source(app/google) | 인덱스: (user_id, start_at) |
| `projects` | name, color, archived | |
| `todos` | title, memo, due_date, priority(1~3), status(todo/doing/done), completed_at, project_id, parent_id, rrule, reminders(jsonb), sort_order | 인덱스: (user_id, status, due_date) |
| `accounts` | name, type(cash/bank/card), initial_balance, archived | 현재 잔액은 뷰/함수로 계산 |
| `transactions` | type(income/expense/transfer), amount(bigint), date, category_id, account_id, to_account_id, memo, recurring_id, receipt_path | 인덱스: (user_id, date) |
| `recurring_transactions` | 거래 템플릿 필드, rrule, next_run_at, active | pg_cron이 사용 |
| `budgets` | category_id, month(date), amount | UNIQUE(user_id, category_id, month) |
| `integrations` | provider(google), tokens(암호화), selected_calendars(jsonb), sync_tokens(jsonb), channel_id, channel_expires_at, last_synced_at, status | 토큰은 Vault/pgsodium |
| `weather_cache` | lat_key, lon_key, payload(jsonb), fetched_at | 사용자 공용 캐시, user_id 없음 |
| `mcp_tokens` | name, token_hash, scopes(text[]), last_used_at, revoked_at | 원문 토큰은 최초 1회만 표시 |
| `mcp_logs` | token_id, tool, success, error, called_at | 90일 보관 |
| `notifications` | kind, ref_id, scheduled_at, sent_at, channel | 발송 큐 |

---

## 6. 화면 및 UX 요구사항

| 화면 | 주요 구성 | 비고 |
|---|---|---|
| 홈 | 날씨 위젯, 오늘 일정, 오늘 할일, 가계 요약, 빠른 추가 | 모바일은 세로 카드 |
| 캘린더 | 보기 전환 탭, 날짜 셀(날씨·일정 칩), 우측 상세 패널 | 오버레이 토글(할일/결제일/Google) |
| 할일 | 목록/보드 전환, 필터 바, 프로젝트 사이드바 | 체크 한 번으로 완료 |
| 가계부 | 월 선택, 요약 카드, 거래 리스트, 탭(내역/달력/통계/예산/자산) | 금액은 천 단위 콤마 |
| 설정 | 외부 연동(Google, 날씨, MCP 토큰), 카테고리, 알림, 화면, 백업 | MCP 토큰은 생성 직후 1회만 노출 |

**UX 원칙**
- 빠른 추가: 모든 화면에서 단축키(`N`)와 플로팅 버튼으로 호출
- 자연어 입력 보조(P2): "내일 3시 치과" 같은 문장을 파싱해 폼 자동 채움
- 낙관적 UI 업데이트 + 실패 시 롤백 및 토스트 안내
- 접근성: 키보드 조작, 색상 외 아이콘/텍스트로도 상태 구분, 대비 4.5:1 이상
- 모바일 우선 반응형(≥360px), PWA 설치 가능

---

## 7. 비기능 요구사항

| 구분 | 요구사항 |
|---|---|
| 성능 | 월간 캘린더 데이터 조회 500ms 이내, 거래 목록 1만 건 페이지네이션 |
| 보안 | 전 구간 HTTPS, RLS 필수, OAuth 토큰·MCP 토큰 암호화/해시, 비밀키는 Edge Function 환경변수 |
| 개인정보 | 금융 정보는 본인만 접근, 로그에 금액·메모 등 민감 내용 미기록 |
| 가용성 | Supabase 무료/Pro 플랜 SLA 범위, 외부 API(Google·날씨) 장애 시 앱 핵심 기능은 정상 동작 |
| 신뢰성 | 동기화 실패 시 지수 백오프 재시도, 최종 실패는 설정 화면에 상태 표시 |
| 백업 | Supabase 자동 백업 + 사용자 내보내기 |
| 관측성 | Edge Function 로그, 동기화·MCP 호출 이력 |
| 호환성 | 최신 Chrome/Edge/Safari, iOS·Android 브라우저 |
| 국제화 | 한국어 기본, 문자열 분리하여 다국어 확장 가능하게 구성 |

---

## 8. 외부 연동 상세

### 8-1. Google Calendar API
- 사전 준비: Google Cloud 프로젝트 생성 → Calendar API 활성화 → OAuth 동의 화면 → 클라이언트 ID/시크릿 발급
- 리디렉션 URI: Supabase Edge Function의 콜백 주소 등록
- 개인용이므로 OAuth 앱을 "테스트" 상태로 두면 refresh token이 7일 후 만료된다 → **프로덕션 게시(본인 계정만 사용)** 필요
- Webhook 채널은 만료(최대 약 7일)되므로 pg_cron으로 갱신
- API 쿼터: 개인 사용 수준에서는 문제 없음, 429 시 백오프

### 8-2. Open-Meteo
- 엔드포인트: forecast(현재/시간별/일별), geocoding(도시 검색), air-quality(P2)
- API 키 불필요(비상업적 사용), 호출은 캐시로 최소화
- 대안: 기상청 단기예보(공공데이터포털 키 필요, 격자 좌표 변환 필요)

---

## 9. 릴리스 계획

| 단계 | 범위 | 완료 기준 |
|---|---|---|
| **M0 준비** | Supabase 프로젝트, 스키마·RLS, 인증, 프로젝트 골격 | 로그인 후 빈 대시보드 표시 |
| **M1 MVP** | CM-01~03,07,08 · CA-01~03 · TD-01~04 · LG-01~03 · HM-01~04 · WX-01~04 | 일정/할일/거래 CRUD와 날씨 위젯 동작 |
| **M2 확장** | MCP 서버 3종(MC-01~08) · 반복 · 알림 · 통계 · 예산 · 계좌 · 칸반 | Claude에서 조회/생성 동작 |
| **M3 연동** | Google Calendar 양방향 동기화(GC-01~07,09) · 고정지출 · 통합 검색 | 이중 입력 없이 Google과 일치 |
| **M4 개선** | 자연어 입력, 우산 알림, 영수증, 가져오기/내보내기, 위젯 설정 | P2 항목 |

---

## 10. 리스크 및 대응

| 리스크 | 영향 | 대응 |
|---|---|---|
| Google 양방향 동기화 충돌/에코 루프 | 일정 중복·유실 | etag·updated 비교, 출처(source) 플래그, 변경 로그 |
| OAuth 테스트 상태 토큰 7일 만료 | 동기화 중단 | 프로덕션 게시, 재연동 안내 UI |
| MCP 토큰 유출 | 개인 데이터 노출 | 해시 저장, scope 제한, 즉시 폐기, 호출 로그 |
| Claude의 잘못된 쓰기/삭제 | 데이터 손상 | 삭제 confirm, 쓰기 scope 분리, 변경 이력(soft delete) |
| 반복 일정 복잡도 | 일정 지연 | RRULE 라이브러리(rrule.js) 사용, 예외 처리는 P2로 분리 |
| 무료 플랜 한도(DB 용량, Edge 호출) | 서비스 제한 | 캐시, 로그 보관기간 제한, 사용량 모니터링 |
| 날씨 API 장애/변경 | 날씨 미표시 | 캐시 폴백, 제공처 추상화 계층 |

---

## 11. 미결정 사항 (결정 필요)

| # | 질문 | 선택지 / 현재 가정 |
|---|---|---|
| 1 | 날씨 제공처 | Open-Meteo(가정) vs 기상청 |
| 2 | 프론트엔드 프레임워크 | Next.js(가정) vs 기타 |
| 3 | MCP 호스팅 | Supabase Edge Function(가정) vs 별도 Node 서버 |
| 4 | Google 일정 삭제 정책 | 앱에서 삭제 시 Google도 삭제(가정) |
| 5 | 가계부 카테고리 기본 세트 | 식비·교통·주거·통신·쇼핑·문화·의료·기타 등을 초기 제공(가정) |
| 6 | 알림 채널 | 웹 푸시(가정) vs 이메일/카카오톡 |
| 7 | 네이티브 앱 필요 여부 | v1은 PWA(가정) |
