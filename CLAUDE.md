# CLAUDE.md

일정관리 · 할일관리 · 가계부를 하나로 합친 개인용 서비스. Google Calendar·날씨 연동, Supabase DB, Claude용 MCP 서버 3종 제공.

## 문서
- `Sitemap.md` — 메뉴 구조와 기능 개요
- `PRM.md` — 상세 요구사항(기능 ID, 데이터 모델, 릴리스 계획, 미결정 사항)
- `sessions/SESSION-A-*.md`, `SESSION-B-*.md`, `SESSION-C-*.md` — 3개 세션으로 나눠 개발할 때의 작업 문서(공통 운영 규칙·소유권·파트별 작업·인수인계 로그). 세션을 맡았다면 자기 문서를 따른다.

작업 전에 관련 문서를 먼저 읽고(세션을 맡았다면 `sessions/`의 자기 문서도), 요구사항을 바꾸면 두 문서를 함께 갱신한다. 기능은 PRM.md의 ID(예: CA-02, LG-06)로 지칭한다.

## 언어
- 사용자에게 하는 답변은 항상 한국어로 한다.
- 코드 식별자·커밋 메시지는 영어 또는 기존 코드 관례를 따른다. 사용자에게 보이는 UI 문구는 한국어.

## 기술 스택 (PRM.md 3장, 제안 상태)
- 프론트: Next.js + TypeScript + Tailwind (PWA)
- 백엔드: Supabase (PostgreSQL, Auth, Realtime, Storage, Edge Functions, pg_cron)
- 외부 API: Google Calendar API v3, Open-Meteo
- MCP: TypeScript MCP SDK, Streamable HTTP — `calendar-mcp`, `todo-mcp`, `ledger-mcp`

프론트엔드는 Next.js(App Router) + TypeScript + Tailwind로 확정했다(2026-10-14). 나머지 항목(날씨 제공처, MCP 호스팅 등)은 PRM.md 11장 기준으로 아직 미확정이므로, 해당 코드를 쓰기 전에 사용자에게 확인한다.

## 핵심 규칙
- **RLS 필수**: 모든 테이블에 `user_id` 컬럼과 `user_id = auth.uid()` 정책을 둔다. 새 테이블마다 빠뜨리지 않는다.
- **시간**: DB에는 UTC로 저장하고 표시할 때 사용자 시간대(기본 Asia/Seoul)로 변환한다.
- **금액**: 원 단위 정수(bigint), 항상 양수. 방향은 `type`(income/expense/transfer)으로 구분한다.
- **비밀값**: API 키, OAuth 클라이언트 시크릿, 토큰은 Edge Function 환경변수나 Vault에만 둔다. 클라이언트 코드·저장소·로그에 넣지 않는다. `.env*`는 커밋하지 않는다.
- **외부 API 호출**: 날씨·Google은 Edge Function을 거친다. 클라이언트에서 직접 호출하지 않는다.
- **Google 동기화**: `google_event_id`, `etag`, `source`로 중복 생성과 에코 루프를 막는다.
- **MCP**: 토큰은 해시로 저장하고, 쓰기 도구는 `write` scope가 필요하다. 삭제 도구는 `confirm: true`가 있을 때만 실행한다. 모든 쿼리는 토큰의 `user_id`로 RLS를 적용한다.
- **로그**: 금액·메모 같은 민감 내용은 기록하지 않는다.

## 작업 방식
- 구현은 PRM.md 9장 릴리스 순서(M0 → M4)를 따른다. P0 → P1 → P2 순으로 진행한다.
- 스키마 변경은 마이그레이션 파일로 남긴다. 운영 DB를 직접 수정하지 않는다.
- 삭제·덮어쓰기처럼 되돌리기 어려운 작업과, 외부 서비스에 영향을 주는 작업(Google 일정 변경, 배포)은 실행 전에 사용자에게 확인한다.
- 요구사항이 모호하거나 PRM.md와 충돌하면 임의로 정하지 말고 질문한다.

## 디렉터리
- `web/` — Next.js 앱 (`src/app`, `src/components/today`)
- `design/` — Claude Design에서 가져온 원본 프로토타입(`오늘한장.dc.html`, `support.js`). 참고용이며 수정하지 않는다.

`web/src/components/today/TodayView.tsx`는 `design/오늘한장.dc.html` 템플릿을 자동 변환한 결과다. 화면 로직은 `OneDay.tsx`에 있고 지금은 목업 데이터로 동작한다. Supabase 연동 시 이 목업 state를 데이터 계층으로 교체한다.

## 명령어
`web/` 폴더에서 실행한다.
- `npm run dev` — 개발 서버 (http://localhost:3000)
- `npm run build` — 프로덕션 빌드
- `npm run lint` — ESLint
- `npx tsc --noEmit` — 타입 검사

`web/AGENTS.md`의 Next.js 안내대로, Next.js API를 쓰기 전에 `web/node_modules/next/dist/docs/`를 확인한다.
