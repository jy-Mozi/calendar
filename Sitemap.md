# Sitemap

일정관리 · 할일관리 · 가계부를 하나로 합친 개인용 서비스.

## 1. 메뉴 구조

```
├─ 🏠 홈 (대시보드, 날씨 위젯 포함)
├─ 📅 일정
│   ├─ 캘린더 (월/주/일 보기, 날씨 표시)
│   ├─ 일정 목록
│   └─ 일정 등록/수정
├─ ✅ 할일
│   ├─ 오늘 할일
│   ├─ 전체 할일 (목록/보드)
│   ├─ 프로젝트/카테고리
│   └─ 할일 등록/수정
├─ 💰 가계부
│   ├─ 거래내역 (수입/지출)
│   ├─ 월간 달력 보기
│   ├─ 통계/리포트
│   ├─ 예산 관리
│   ├─ 자산/계좌
│   └─ 고정지출/반복거래
├─ 🔍 통합 검색
└─ ⚙️ 설정
    ├─ 프로필/계정
    ├─ 외부 연동 (Google Calendar · 날씨 · MCP)   ← 신규
    ├─ 카테고리·태그 관리
    ├─ 알림 설정
    ├─ 데이터 백업/내보내기
    └─ 화면 설정 (테마, 시작 요일 등)
```

## 2. 기능 정의

### 🏠 홈 (대시보드)
| 항목 | 설명 |
|---|---|
| 오늘의 일정 | 오늘 일정을 시간순으로 표시 |
| 오늘의 할일 | 오늘 마감/진행할 할일, 체크로 바로 완료 처리 |
| 이번 달 가계 요약 | 수입·지출·잔액, 예산 대비 소진율 |
| 빠른 추가 | 일정/할일/거래를 한 곳에서 즉시 입력 |
| 날씨 위젯 | 현재 위치(또는 지정 도시)의 현재 날씨·기온·강수확률, 3~7일 예보 |

### 📅 일정
| 메뉴 | 기능 |
|---|---|
| 캘린더 | 월/주/일 보기 전환, 날짜 클릭으로 일정 추가, 드래그로 이동/기간 조정, 날짜별 날씨 아이콘·기온 표시, Google 일정 통합 표시 |
| 일정 목록 | 다가오는 일정 리스트, 기간·카테고리 필터 |
| 일정 등록/수정 | 제목, 날짜·시간(종일 지원), 장소, 메모, 카테고리(색상), 반복(매일/주/월/년), 알림 |

### ✅ 할일
| 메뉴 | 기능 |
|---|---|
| 오늘 할일 | 오늘 마감 + 지연된 할일 모아보기 |
| 전체 할일 | 목록/칸반(할 일·진행중·완료) 보기, 상태·우선순위·마감일 필터와 정렬 |
| 프로젝트/카테고리 | 할일을 묶어 관리, 진행률 표시 |
| 등록/수정 | 제목, 마감일, 우선순위(상/중/하), 하위 작업(체크리스트), 반복, 알림, 메모 |

### 💰 가계부
| 메뉴 | 기능 |
|---|---|
| 거래내역 | 수입/지출/이체 입력, 금액·카테고리·결제수단·메모, 기간·카테고리 검색 |
| 월간 달력 보기 | 날짜별 수입/지출 합계를 달력에 표시 |
| 통계/리포트 | 카테고리별 비율(원형), 월별 추이(막대/선), 전월 대비 비교 |
| 예산 관리 | 월/카테고리별 예산 설정, 초과 시 경고 |
| 자산/계좌 | 현금·통장·카드 등 계좌별 잔액 관리 |
| 고정지출/반복거래 | 월세, 구독료, 급여 등 자동 반복 등록 |

### 🔍 통합 검색
일정·할일·거래내역을 한 번에 검색 (키워드, 날짜, 카테고리/태그).

### ⚙️ 설정
- **프로필/계정**: 로그인(Supabase Auth), 계정 관리
- **외부 연동**: Google Calendar 연결/해제·동기화 설정, 날씨 위치 설정, MCP 토큰 발급/폐기 (3·4장 참조)
- **카테고리·태그**: 일정/할일/가계부 공통 및 개별 카테고리 편집
- **알림**: 일정·할일 알림 시간, 예산 초과 알림
- **백업/내보내기**: JSON/CSV(엑셀) 내보내기, 가져오기
- **화면 설정**: 라이트/다크 테마, 한 주 시작 요일, 통화 단위

## 3. 외부 연동 및 인프라 (신규)

### 3-1. Google Calendar 연동
| 항목 | 정의 |
|---|---|
| 인증 | Google OAuth 2.0 (범위: `calendar` 읽기/쓰기), refresh token은 서버(Supabase)에 암호화 저장 |
| 동기화 방향 | 양방향 (앱 ↔ Google). 충돌 시 최종 수정 시각 우선 |
| 대상 캘린더 | 연결할 Google 캘린더를 선택(복수 가능), 캘린더별 색상 매핑 |
| 동기화 방식 | 최초 전체 가져오기 → 이후 증분 동기화(`syncToken`) + Push 알림(Webhook) 또는 주기 폴링 |
| 매핑 | 일정 테이블에 `google_event_id`, `google_calendar_id`, `etag` 보관 |
| 할일 연동(옵션) | 마감일이 있는 할일을 Google 캘린더 종일 일정으로 내보내기 |

### 3-2. Supabase DB
| 항목 | 정의 |
|---|---|
| DB | Supabase PostgreSQL, 모든 테이블에 `user_id` + RLS(Row Level Security) 적용 |
| 인증 | Supabase Auth (이메일/Google 로그인) |
| 실시간 | Realtime 구독으로 여러 기기 간 변경 즉시 반영 |
| 서버 로직 | Edge Functions (Google 동기화, 날씨 프록시, 반복 규칙 생성, MCP 엔드포인트) |
| 스케줄 | pg_cron으로 고정지출 자동 등록, 동기화 갱신 |

**주요 테이블**

| 테이블 | 주요 컬럼 |
|---|---|
| `profiles` | id, name, timezone, weather_location |
| `categories` | id, user_id, type(event/todo/ledger), name, color |
| `events` | id, user_id, title, start_at, end_at, all_day, location, memo, rrule, google_event_id, google_calendar_id, etag |
| `todos` | id, user_id, title, due_date, priority, status, project_id, parent_id, rrule |
| `projects` | id, user_id, name, color |
| `accounts` | id, user_id, name, type(현금/통장/카드), balance |
| `transactions` | id, user_id, type(수입/지출/이체), amount, category_id, account_id, date, memo, recurring_id |
| `budgets` | id, user_id, category_id, month, amount |
| `integrations` | id, user_id, provider(google), tokens(암호화), sync_token, last_synced_at |
| `mcp_tokens` | id, user_id, name, token_hash, scopes, last_used_at |

### 3-3. 날씨 API 연동
| 항목 | 정의 |
|---|---|
| 제공처 | 기상청 단기예보 API(공공데이터포털) 또는 Open-Meteo/OpenWeatherMap 중 택1 (키 불필요한 Open-Meteo 권장) |
| 호출 구조 | 클라이언트 → Edge Function(프록시, API 키 보호) → 날씨 API. 결과는 DB/캐시에 30~60분 보관 |
| 제공 정보 | 현재 날씨·기온·체감온도·강수확률·미세먼지(옵션), 시간별/일별 예보 |
| 표시 위치 | 홈 위젯, 캘린더 날짜 셀(예보 범위 내), 일정 상세(장소 기반 날씨) |
| 위치 | 설정에서 기본 도시 지정 / 브라우저 위치 사용 / 일정 장소별 조회 |
| 알림(옵션) | 비·눈 예보가 있는 날 일정/할일에 우산 알림 |

## 4. MCP 서버 (Claude 연동)

내 Claude(Claude Desktop / Claude Code)에서 자연어로 일정·할일·가계부를 조회·관리하기 위한 MCP 서버. 서비스별 3개로 분리한다.

| 서버 | 도구(Tool) | 설명 |
|---|---|---|
| **calendar-mcp** | `list_events(start, end, query?)` | 기간별 일정 조회 (Google 동기화 일정 포함) |
| | `create_event(title, start, end, ...)` | 일정 생성 (Google에도 반영) |
| | `update_event(id, ...)` / `delete_event(id)` | 일정 수정/삭제 |
| | `find_free_slots(date, duration)` | 빈 시간 찾기 |
| | `get_weather(date, location?)` | 날짜별 날씨 조회 |
| **todo-mcp** | `list_todos(status?, due?, project?)` | 할일 조회/필터 |
| | `create_todo(title, due?, priority?, ...)` | 할일 생성 |
| | `update_todo(id, ...)` / `complete_todo(id)` / `delete_todo(id)` | 수정/완료/삭제 |
| | `list_projects()` | 프로젝트 목록 |
| **ledger-mcp** | `add_transaction(type, amount, category, date, memo?)` | 수입/지출 기록 |
| | `list_transactions(start, end, category?)` | 거래내역 조회 |
| | `get_summary(month)` | 월 수입/지출/카테고리별 합계 |
| | `get_budget_status(month)` | 예산 대비 사용 현황 |
| | `list_accounts()` | 계좌 잔액 조회 |

**공통 정의**
- **전송 방식**: 원격(Streamable HTTP, Supabase Edge Function 호스팅) — Claude 커넥터로 등록. 로컬 사용 시 stdio도 지원.
- **인증**: 설정 > 외부 연동에서 발급한 개인 토큰(또는 OAuth). 토큰별 scope(읽기/쓰기) 구분, 해시로 저장.
- **보안**: 본인 `user_id` 데이터만 접근(RLS), 삭제 등 파괴적 작업은 확인 후 실행, 호출 기록(`last_used_at`) 남김.
- **사용 예**: "내일 일정 알려주고 비 오는지 알려줘", "이번 주 할일 정리해줘", "점심 12,000원 식비로 기록해줘".

## 5. 모듈 간 연동 (차별점)

| 연동 | 설명 |
|---|---|
| 할일 → 캘린더 | 마감일이 있는 할일을 캘린더에 함께 표시 |
| 가계부 → 캘린더 | 고정지출·결제일을 캘린더에 표시 |
| 일정 → 가계부 | 일정에 예상 비용을 붙이고 실제 지출로 전환 |
| 통합 대시보드 | 하루/한 달 단위로 일정·할일·지출을 한 화면에서 확인 |
| 날씨 → 일정/할일 | 야외 일정·할일에 날씨 정보와 우산 알림 연결 |
| MCP → 전체 | Claude에서 세 서비스를 한 대화로 조회·수정 |

## 6. 개발 우선순위 (제안)

1. **MVP**: Supabase 세팅(Auth·테이블·RLS), 일정/할일/거래내역 CRUD, 홈 대시보드, 날씨 위젯
2. **2단계**: **MCP 서버 3종**(조회 → 생성/수정 순), 반복 규칙, 알림, 통계/리포트, 예산 관리
3. **3단계**: **Google Calendar 양방향 동기화**, 자산/계좌, 고정지출 자동화, 통합 검색, 백업/내보내기
