/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment } from 'react';
import type { Vals } from '@/components/ui/vals';

export function HomeView({ v }: { v: Vals }) {
  const { balanceTxt, budgetBar, budgetPct, city, expenseTxt, gcalBadge, goCal, homeAreas, homeCols, todayDone, todayEventCount, todayEvents, todayTodos, todayTotal, todoLeft, tokenCount, warnBudget, week } = v;
  return (
        <>
          <div style={{ display: "grid", gridTemplateColumns: homeCols, gridTemplateAreas: homeAreas, gap: "18px", padding: "0 28px" }}>
            <div
              style={{
                gridArea: "greet",
                background: "#fff",
                borderRadius: "28px",
                padding: "28px 32px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "20px",
                flexWrap: "wrap",
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ font: "500 15px YeogiOttaeJalnan,Pretendard,sans-serif", color: "#5b6068" }}>10월 14일 수요일</div>
                <div style={{ font: "400 32px/1.35 YeogiOttaeJalnan,Pretendard,sans-serif", letterSpacing: "-.03em", textWrap: "pretty" }}>
                  {"민지 님, 오늘은 일정 "}
                  <span style={{ color: "oklch(0.55 0.15 255)" }}>{todayEventCount}개</span>,<br />
                  {"할일 "}
                  <span style={{ color: "oklch(0.5 0.15 155)" }}>{todoLeft}개</span>가 남았어요.
                </div>
              </div>
              <div style={{ display: "flex", gap: "8px", flexDirection: "column", alignItems: "flex-start" }}>
                <span
                  style={{
                    whiteSpace: "nowrap",
                    font: "600 13px YeogiOttaeJalnan,Pretendard,sans-serif",
                    padding: "8px 14px",
                    borderRadius: "999px",
                    background: "oklch(0.95 0.03 255)",
                    color: "oklch(0.42 0.15 255)",
                  }}
                >
                  {gcalBadge}
                </span>
                <span
                  style={{
                    whiteSpace: "nowrap",
                    font: "600 13px YeogiOttaeJalnan,Pretendard,sans-serif",
                    padding: "8px 14px",
                    borderRadius: "999px",
                    background: "#f1f2f4",
                    color: "#3f444b",
                  }}
                >
                  {"Claude MCP 연결됨 · 토큰 "}
                  {tokenCount}개
                </span>
              </div>
            </div>
            <div
              style={{
                gridArea: "wx",
                background: "oklch(0.62 0.13 255)",
                color: "#fff",
                borderRadius: "28px",
                padding: "28px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
              }}
            >
              <div style={{ font: "600 15px YeogiOttaeJalnan,Pretendard,sans-serif" }}>
                {city}
                {" · 지금"}
              </div>
              <div style={{ display: "flex", alignItems: "flex-end", gap: "14px" }}>
                <span style={{ font: "400 84px/0.9 YeogiOttaeJalnan,Pretendard,sans-serif", letterSpacing: "-.04em" }}>18°</span>
                <span style={{ font: "600 18px YeogiOttaeJalnan,Pretendard,sans-serif", paddingBottom: "8px" }}>맑음</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", fontSize: "13px" }}>
                <div style={{ background: "rgba(255,255,255,.16)", borderRadius: "14px", padding: "10px" }}>
                  <div>최고/최저</div>
                  <div style={{ font: "700 16px YeogiOttaeJalnan,Pretendard,sans-serif" }}>21° / 11°</div>
                </div>
                <div style={{ background: "rgba(255,255,255,.16)", borderRadius: "14px", padding: "10px" }}>
                  <div>강수</div>
                  <div style={{ font: "700 16px YeogiOttaeJalnan,Pretendard,sans-serif" }}>10%</div>
                </div>
                <div style={{ background: "rgba(255,255,255,.16)", borderRadius: "14px", padding: "10px" }}>
                  <div>미세먼지</div>
                  <div style={{ font: "700 16px YeogiOttaeJalnan,Pretendard,sans-serif" }}>좋음</div>
                </div>
              </div>
              <div
                style={{
                  background: "#fff",
                  color: "#15171a",
                  borderRadius: "20px",
                  padding: "14px 16px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px",
                }}
              >
                {week.map((w: any, __i2: number) => (
                  <Fragment key={__i2}>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "28px 1fr 40px 60px",
                        gap: "8px",
                        alignItems: "center",
                        fontSize: "14px",
                        padding: "5px 0",
                      }}
                    >
                      <span style={{ fontWeight: "700" }}>{w.d}</span>
                      <span style={{ color: "#5b6068" }}>{w.s}</span>
                      <span style={{ fontSize: "12px", color: "oklch(0.48 0.15 255)", fontWeight: "600" }}>{w.pTxt}</span>
                      <span style={{ textAlign: "right", fontWeight: "600" }}>
                        {w.hi}
                        {"° "}
                        <span style={{ color: "#7b8088", fontWeight: "400" }}>{w.lo}°</span>
                      </span>
                    </div>
                  </Fragment>
                ))}
              </div>
              <div
                style={{
                  font: "600 13px YeogiOttaeJalnan,Pretendard,sans-serif",
                  background: "rgba(255,255,255,.16)",
                  borderRadius: "14px",
                  padding: "12px",
                }}
              >
                금요일 비 예보 — 마감 회의 가는 길에 우산을 챙기세요
              </div>
            </div>
            <div
              style={{
                gridArea: "ev",
                background: "#fff",
                borderRadius: "28px",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "12px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span
                  style={{ font: "400 18px YeogiOttaeJalnan,Pretendard,sans-serif", display: "flex", gap: "8px", alignItems: "center" }}
                >
                  <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "oklch(0.62 0.13 255)" }}></span>오늘 일정
                </span>
                <button onClick={goCal} style={{ border: "0", background: "none", cursor: "pointer", fontSize: "13px", color: "#5b6068" }}>
                  캘린더 →
                </button>
              </div>
              {todayEvents.map((e: any, __i3: number) => (
                <Fragment key={__i3}>
                  <div
                    style={{
                      display: "flex",
                      gap: "14px",
                      alignItems: "center",
                      background: "#f5f6f8",
                      borderRadius: "16px",
                      padding: "12px 14px",
                    }}
                  >
                    <div style={{ font: "700 15px YeogiOttaeJalnan,Pretendard,sans-serif", width: "52px" }}>{e.timeTxt}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px", flex: "1", minWidth: "0" }}>
                      <span style={{ font: "600 15px YeogiOttaeJalnan,Pretendard,sans-serif" }}>{e.title}</span>
                      <span style={{ fontSize: "13px", color: "#5b6068" }}>{e.place}</span>
                    </div>
                    <span style={{ width: "6px", height: "28px", borderRadius: "3px", background: e.color }}></span>
                  </div>
                </Fragment>
              ))}
            </div>
            <div style={{ gridArea: "td", display: "flex", flexDirection: "column", gap: "18px" }}>
              <div
                style={{ background: "#fff", borderRadius: "28px", padding: "24px", display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span
                    style={{ font: "400 18px YeogiOttaeJalnan,Pretendard,sans-serif", display: "flex", gap: "8px", alignItems: "center" }}
                  >
                    <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "oklch(0.62 0.13 155)" }}></span>오늘
                    할일
                  </span>
                  <span style={{ fontSize: "13px", color: "#5b6068" }}>
                    {todayDone}/{todayTotal}
                    {" 완료"}
                  </span>
                </div>
                {todayTodos.map((t: any, __i4: number) => (
                  <Fragment key={__i4}>
                    <div
                      onClick={t.toggle}
                      style={{ display: "flex", gap: "12px", alignItems: "center", padding: "6px 0", cursor: "pointer" }}
                    >
                      <div
                        style={{
                          width: "22px",
                          height: "22px",
                          borderRadius: "50%",
                          border: "2px solid oklch(0.62 0.13 155)",
                          background: t.fill,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#fff",
                          font: "700 12px sans-serif",
                          flexShrink: "0",
                        }}
                      >
                        {!!t.done && <>✓</>}
                      </div>
                      <span
                        style={{
                          font: "500 15px YeogiOttaeJalnan,Pretendard,sans-serif",
                          flex: "1",
                          textDecoration: t.deco,
                          opacity: t.op,
                        }}
                      >
                        {t.title}
                      </span>
                      {!!t.late && (
                        <>
                          <span
                            style={{
                              font: "700 12px YeogiOttaeJalnan,Pretendard,sans-serif",
                              padding: "4px 8px",
                              borderRadius: "999px",
                              background: "oklch(0.95 0.04 25)",
                              color: "oklch(0.48 0.17 25)",
                            }}
                          >
                            지연
                          </span>
                        </>
                      )}
                    </div>
                  </Fragment>
                ))}
              </div>
              <div
                style={{ background: "#fff", borderRadius: "28px", padding: "24px", display: "flex", flexDirection: "column", gap: "12px" }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span
                    style={{ font: "400 18px YeogiOttaeJalnan,Pretendard,sans-serif", display: "flex", gap: "8px", alignItems: "center" }}
                  >
                    <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "oklch(0.62 0.13 55)" }}></span>10월 가계
                  </span>
                  <span style={{ fontSize: "13px", color: "#5b6068" }}>
                    {"예산 "}
                    {budgetPct}% 사용
                  </span>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: "6px", flexWrap: "wrap" }}>
                  <span style={{ font: "800 30px YeogiOttaeJalnan,Pretendard,sans-serif", letterSpacing: "-.02em" }}>{expenseTxt}</span>
                  <span style={{ fontSize: "14px", color: "#5b6068" }}>
                    {"원 지출 · 잔액 "}
                    {balanceTxt}원
                  </span>
                </div>
                <div style={{ height: "12px", borderRadius: "6px", background: "#f1f2f4", display: "flex", overflow: "hidden" }}>
                  <div style={{ width: `${budgetBar}%`, background: "oklch(0.62 0.13 55)" }}></div>
                </div>
                {!!warnBudget && (
                  <>
                    <div style={{ font: "600 13px YeogiOttaeJalnan,Pretendard,sans-serif", color: "oklch(0.45 0.13 55)" }}>
                      {warnBudget.name}
                      {" 예산 "}
                      {warnBudget.pct}% — 이번 주는 조금 아껴요
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
  );
}
