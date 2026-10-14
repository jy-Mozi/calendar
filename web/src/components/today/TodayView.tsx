// 자동 변환 결과: design/오늘한장.dc.html 의 템플릿을 React로 옮긴 것. 화면 로직은 OneDay.tsx 에 있다.
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment } from "react";

export type Vals = Record<string, any>;

export function TodayView({ v }: { v: Vals }) {
  const {
    accounts,
    addEventSel,
    addTodo,
    addTx,
    balanceTxt,
    board,
    boardCols,
    budgetBar,
    budgetPct,
    budgetTotalTxt,
    budgets,
    catGroups,
    catNames,
    catShare,
    cells,
    cities,
    city,
    closeQA,
    donut,
    dows,
    evCatFilters,
    evCatOpts,
    evCount,
    expenseShort,
    expenseTxt,
    exportCsv,
    exportJson,
    gcalBadge,
    gcalBtn,
    gcalBtnBg,
    gcalBtnFg,
    gcalOn,
    gcalStatus,
    gcals,
    goCal,
    goHome,
    goSearch,
    goSettings,
    goToday,
    halfCols,
    hasResults,
    hasSub,
    homeAreas,
    homeCols,
    hours,
    incomeTxt,
    isCalList,
    isCalMonth,
    isCalWeek,
    isHome,
    isLedger,
    isLgAssets,
    isLgBudget,
    isLgCal,
    isLgRec,
    isLgStats,
    isLgTx,
    isSearch,
    isSetBackup,
    isSetCat,
    isSetInt,
    isSetNoti,
    isSetProfile,
    isSetView,
    isSettings,
    isTodo,
    isTodoBoard,
    isTodoList,
    issueToken,
    lgCells,
    mcpLogs,
    momColor,
    momTxt,
    netWorthTxt,
    newToken,
    noResults,
    notis,
    openQA,
    overlays,
    prioOpts,
    projects,
    q,
    qEmpty,
    qaAmtTxt,
    qaCat,
    qaDay,
    qaErr,
    qaIsEvent,
    qaIsTodo,
    qaIsTx,
    qaKey,
    qaOpen,
    qaPh,
    qaTime,
    qaTitle,
    qaTitleLabel,
    qaTypes,
    recTotalTxt,
    recurring,
    results,
    saveQA,
    scopeOpts,
    searchBtnBg,
    searchBtnFg,
    searchFilters,
    selDay,
    selDow,
    selEmpty,
    selEvents,
    selWx,
    setAmt,
    setBtnBg,
    setBtnFg,
    setCat,
    setCols,
    setDay,
    setNav,
    setNavDir,
    setQ,
    setTime,
    setTitle,
    splitCols,
    stop,
    subTabs,
    suggestions,
    tabs,
    tdCount,
    toast,
    todayDone,
    todayEventCount,
    todayEvents,
    todayTodos,
    todayTotal,
    todoEmpty,
    todoFilters,
    todoLeft,
    todoList,
    toggleGcal,
    tokenCount,
    tokens,
    trend,
    txCount,
    txFilters,
    txList,
    txSumTxt,
    upcoming,
    viewOpts,
    warnBudget,
    week,
    weekDays,
  } = v;
  return (
    <div
      style={{ minHeight: "100vh", display: "flex", flexDirection: "column", maxWidth: "1360px", margin: "0 auto", paddingBottom: "110px" }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "16px",
          padding: "22px 28px",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={goHome}
          style={{
            border: "0",
            background: "none",
            cursor: "pointer",
            padding: "0",
            font: "400 20px YeogiOttaeJalnan,Pretendard,sans-serif",
            letterSpacing: "-.02em",
            color: "#15171a",
          }}
        >
          오늘한장
        </button>
        <div style={{ display: "flex", gap: "4px", background: "#fff", padding: "5px", borderRadius: "999px", overflowX: "auto" }}>
          {tabs.map((tb: any, __i0: number) => (
            <Fragment key={__i0}>
              <button
                onClick={tb.go}
                style={{
                  border: "0",
                  cursor: "pointer",
                  padding: "8px 18px",
                  borderRadius: "999px",
                  font: "600 14px YeogiOttaeJalnan,Pretendard,sans-serif",
                  whiteSpace: "nowrap",
                  background: tb.bg,
                  color: tb.fg,
                }}
              >
                {tb.label}
              </button>
            </Fragment>
          ))}
        </div>
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <button
            onClick={goSearch}
            style={{
              border: "0",
              cursor: "pointer",
              padding: "10px 16px",
              borderRadius: "999px",
              font: "600 14px YeogiOttaeJalnan,Pretendard,sans-serif",
              background: searchBtnBg,
              color: searchBtnFg,
            }}
          >
            검색
          </button>
          <button
            onClick={goSettings}
            style={{
              border: "0",
              cursor: "pointer",
              padding: "10px 16px",
              borderRadius: "999px",
              font: "600 14px YeogiOttaeJalnan,Pretendard,sans-serif",
              background: setBtnBg,
              color: setBtnFg,
            }}
          >
            설정
          </button>
          <span
            style={{
              width: "38px",
              height: "38px",
              borderRadius: "50%",
              background: "#d7dbe1",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              font: "700 14px YeogiOttaeJalnan,Pretendard,sans-serif",
            }}
          >
            민
          </span>
        </div>
      </div>
      {!!hasSub && (
        <>
          <div style={{ display: "flex", gap: "6px", padding: "0 28px 18px", overflowX: "auto" }}>
            {subTabs.map((st: any, __i1: number) => (
              <Fragment key={__i1}>
                <button
                  onClick={st.go}
                  style={{
                    cursor: "pointer",
                    padding: "8px 16px",
                    borderRadius: "999px",
                    font: "600 14px YeogiOttaeJalnan,Pretendard,sans-serif",
                    whiteSpace: "nowrap",
                    border: `1.5px solid ${st.bd}`,
                    background: st.bg,
                    color: st.fg,
                  }}
                >
                  {st.label}
                </button>
              </Fragment>
            ))}
          </div>
        </>
      )}
      {!!isHome && (
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
      )}
      {!!isCalMonth && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: splitCols, gap: "18px", padding: "0 28px" }}>
            <div
              style={{
                background: "#fff",
                borderRadius: "28px",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                minWidth: "0",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                <div style={{ font: "400 24px YeogiOttaeJalnan,Pretendard,sans-serif", letterSpacing: "-.02em" }}>2026년 10월</div>
                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                  {overlays.map((ov: any, __i5: number) => (
                    <Fragment key={__i5}>
                      <button
                        onClick={ov.flip}
                        style={{
                          cursor: "pointer",
                          padding: "7px 12px",
                          borderRadius: "999px",
                          font: "600 13px YeogiOttaeJalnan,Pretendard,sans-serif",
                          whiteSpace: "nowrap",
                          border: `1.5px solid ${ov.bd}`,
                          background: ov.bg,
                          color: ov.fg,
                        }}
                      >
                        {ov.mark} {ov.label}
                      </button>
                    </Fragment>
                  ))}
                  <button
                    onClick={goToday}
                    style={{
                      border: "1px solid #dfe2e6",
                      background: "#fff",
                      borderRadius: "999px",
                      padding: "7px 14px",
                      font: "600 13px YeogiOttaeJalnan,Pretendard,sans-serif",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      flexShrink: "0",
                    }}
                  >
                    오늘
                  </button>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(7,minmax(0,1fr))", gap: "6px" }}>
                {dows.map((dw: any, __i6: number) => (
                  <Fragment key={__i6}>
                    <div
                      style={{
                        font: "600 12px YeogiOttaeJalnan,Pretendard,sans-serif",
                        color: dw.c,
                        textAlign: "center",
                        padding: "4px 0",
                      }}
                    >
                      {dw.t}
                    </div>
                  </Fragment>
                ))}
                {cells.map((c: any, __i7: number) => (
                  <Fragment key={__i7}>
                    <div
                      onClick={c.pick}
                      style={{
                        minHeight: "100px",
                        borderRadius: "14px",
                        padding: "8px",
                        background: c.bg,
                        outline: c.ol,
                        cursor: c.cur,
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                        minWidth: "0",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span
                          style={{
                            font: "700 13px YeogiOttaeJalnan,Pretendard,sans-serif",
                            width: "24px",
                            height: "24px",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            background: c.numBg,
                            color: c.numFg,
                          }}
                        >
                          {c.label}
                        </span>
                        <span style={{ font: "500 11px YeogiOttaeJalnan,Pretendard,sans-serif", color: "#5b6068", whiteSpace: "nowrap" }}>
                          {c.wx}
                        </span>
                      </div>
                      {c.chips.map((ch: any, __i8: number) => (
                        <Fragment key={__i8}>
                          <div
                            style={{
                              font: "600 11px YeogiOttaeJalnan,Pretendard,sans-serif",
                              padding: "3px 6px",
                              borderRadius: "6px",
                              background: ch.bg,
                              color: ch.fg,
                              border: `1px dashed ${ch.bd}`,
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {ch.title}
                          </div>
                        </Fragment>
                      ))}
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>
            <div
              style={{
                background: "#fff",
                borderRadius: "28px",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "14px",
                alignSelf: "start",
              }}
            >
              <div style={{ font: "500 14px YeogiOttaeJalnan,Pretendard,sans-serif", color: "#5b6068" }}>선택한 날</div>
              <div style={{ font: "400 24px YeogiOttaeJalnan,Pretendard,sans-serif", letterSpacing: "-.02em" }}>
                {"10월 "}
                {selDay}
                {"일 "}
                {selDow}요일
              </div>
              {!!selWx && (
                <>
                  <div
                    style={{
                      font: "600 14px YeogiOttaeJalnan,Pretendard,sans-serif",
                      padding: "10px 14px",
                      borderRadius: "14px",
                      background: "oklch(0.95 0.03 255)",
                      color: "oklch(0.42 0.15 255)",
                    }}
                  >
                    {selWx}
                  </div>
                </>
              )}
              {selEvents.map((e: any, __i9: number) => (
                <Fragment key={__i9}>
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      alignItems: "center",
                      background: "#f5f6f8",
                      borderRadius: "16px",
                      padding: "12px 14px",
                    }}
                  >
                    <span style={{ width: "6px", height: "32px", borderRadius: "3px", background: e.color }}></span>
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px", flex: "1", minWidth: "0" }}>
                      <span style={{ font: "600 15px YeogiOttaeJalnan,Pretendard,sans-serif" }}>{e.title}</span>
                      <span style={{ fontSize: "13px", color: "#5b6068" }}>
                        {e.timeTxt}
                        {" · "}
                        {e.place}
                      </span>
                    </div>
                    <span style={{ font: "500 11px YeogiOttaeJalnan,Pretendard,sans-serif", color: "#7b8088" }}>{e.src}</span>
                  </div>
                </Fragment>
              ))}
              {!!selEmpty && (
                <>
                  <div style={{ fontSize: "14px", color: "#5b6068", padding: "8px 0" }}>일정이 없어요.</div>
                </>
              )}
              <button
                onClick={addEventSel}
                style={{
                  border: "0",
                  borderRadius: "14px",
                  padding: "12px",
                  background: "#15171a",
                  color: "#fff",
                  font: "700 14px YeogiOttaeJalnan,Pretendard,sans-serif",
                  cursor: "pointer",
                }}
              >
                + 이 날 일정 추가
              </button>
            </div>
          </div>
        </>
      )}
      {!!isCalWeek && (
        <>
          <div style={{ padding: "0 28px" }}>
            <div
              style={{
                background: "#fff",
                borderRadius: "28px",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                overflowX: "auto",
              }}
            >
              <div style={{ font: "400 24px YeogiOttaeJalnan,Pretendard,sans-serif", letterSpacing: "-.02em" }}>10월 12일 – 18일</div>
              <div style={{ display: "grid", gridTemplateColumns: "56px repeat(7,minmax(96px,1fr))", minWidth: "760px" }}>
                <div></div>
                {weekDays.map((wd: any, __i10: number) => (
                  <Fragment key={__i10}>
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", paddingBottom: "10px" }}>
                      <span style={{ font: "600 12px YeogiOttaeJalnan,Pretendard,sans-serif", color: "#5b6068" }}>{wd.dow}</span>
                      <span
                        style={{
                          font: "400 18px YeogiOttaeJalnan,Pretendard,sans-serif",
                          width: "34px",
                          height: "34px",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          background: wd.numBg,
                          color: wd.numFg,
                        }}
                      >
                        {wd.date}
                      </span>
                      <span style={{ font: "500 11px YeogiOttaeJalnan,Pretendard,sans-serif", color: "#5b6068", minHeight: "14px" }}>
                        {wd.wx}
                      </span>
                    </div>
                  </Fragment>
                ))}
                <div style={{ display: "flex", flexDirection: "column" }}>
                  {hours.map((h: any, __i11: number) => (
                    <Fragment key={__i11}>
                      <div
                        style={{
                          height: "48px",
                          font: "500 11px YeogiOttaeJalnan,Pretendard,sans-serif",
                          color: "#7b8088",
                          transform: "translateY(-6px)",
                        }}
                      >
                        {h}
                      </div>
                    </Fragment>
                  ))}
                </div>
                {weekDays.map((wd: any, __i12: number) => (
                  <Fragment key={__i12}>
                    <div
                      style={{
                        position: "relative",
                        height: "672px",
                        borderLeft: "1px solid #f1f2f4",
                        background: "repeating-linear-gradient(to bottom,#f1f2f4 0 1px,transparent 1px 48px)",
                        backgroundColor: wd.colBg,
                      }}
                    >
                      {wd.evs.map((ev: any, __i13: number) => (
                        <Fragment key={__i13}>
                          <div
                            style={{
                              position: "absolute",
                              left: "4px",
                              right: "4px",
                              top: `${ev.top}px`,
                              height: `${ev.h}px`,
                              borderRadius: "10px",
                              padding: "6px 8px",
                              background: ev.bg,
                              color: ev.fg,
                              borderLeft: `3px solid ${ev.bd}`,
                              overflow: "hidden",
                              display: "flex",
                              flexDirection: "column",
                              gap: "2px",
                            }}
                          >
                            <span
                              style={{
                                font: "700 12px YeogiOttaeJalnan,Pretendard,sans-serif",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                              }}
                            >
                              {ev.title}
                            </span>
                            <span style={{ font: "500 11px YeogiOttaeJalnan,Pretendard,sans-serif" }}>{ev.timeTxt}</span>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
      {!!isCalList && (
        <>
          <div style={{ padding: "0 28px", display: "flex", flexDirection: "column", gap: "18px" }}>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {evCatFilters.map((f: any, __i14: number) => (
                <Fragment key={__i14}>
                  <button
                    onClick={f.go}
                    style={{
                      border: "0",
                      cursor: "pointer",
                      padding: "8px 14px",
                      borderRadius: "999px",
                      font: "600 13px YeogiOttaeJalnan,Pretendard,sans-serif",
                      background: f.bg,
                      color: f.fg,
                    }}
                  >
                    {f.label}
                  </button>
                </Fragment>
              ))}
            </div>
            {upcoming.map((g: any, __i15: number) => (
              <Fragment key={__i15}>
                <div
                  style={{
                    background: "#fff",
                    borderRadius: "24px",
                    padding: "20px 24px",
                    display: "grid",
                    gridTemplateColumns: "110px minmax(0,1fr)",
                    gap: "16px",
                  }}
                >
                  <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                    <span style={{ font: "400 18px YeogiOttaeJalnan,Pretendard,sans-serif" }}>{g.dateTxt}</span>
                    <span style={{ font: "500 13px YeogiOttaeJalnan,Pretendard,sans-serif", color: "#5b6068" }}>{g.rel}</span>
                    <span style={{ font: "600 12px YeogiOttaeJalnan,Pretendard,sans-serif", color: "oklch(0.45 0.15 255)" }}>{g.wx}</span>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    {g.items.map((e: any, __i16: number) => (
                      <Fragment key={__i16}>
                        <div
                          style={{
                            display: "flex",
                            gap: "12px",
                            alignItems: "center",
                            background: "#f5f6f8",
                            borderRadius: "14px",
                            padding: "10px 14px",
                          }}
                        >
                          <span style={{ font: "700 14px YeogiOttaeJalnan,Pretendard,sans-serif", width: "48px" }}>{e.timeTxt}</span>
                          <span style={{ width: "6px", height: "24px", borderRadius: "3px", background: e.color }}></span>
                          <div style={{ display: "flex", flexDirection: "column", flex: "1", minWidth: "0" }}>
                            <span style={{ font: "600 15px YeogiOttaeJalnan,Pretendard,sans-serif" }}>{e.title}</span>
                            <span style={{ fontSize: "13px", color: "#5b6068" }}>
                              {e.cat}
                              {" · "}
                              {e.place}
                            </span>
                          </div>
                        </div>
                      </Fragment>
                    ))}
                  </div>
                </div>
              </Fragment>
            ))}
          </div>
        </>
      )}
      {!!isTodo && (
        <>
          <div style={{ padding: "0 28px", display: "flex", flexDirection: "column", gap: "18px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "12px" }}>
              {projects.map((p: any, __i17: number) => (
                <Fragment key={__i17}>
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: "20px",
                      padding: "18px 20px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    <div
                      style={{ display: "flex", justifyContent: "space-between", font: "700 15px YeogiOttaeJalnan,Pretendard,sans-serif" }}
                    >
                      <span>{p.name}</span>
                      <span style={{ color: "#5b6068", fontWeight: "500" }}>
                        {p.done}/{p.total}
                        {" · "}
                        {p.pct}%
                      </span>
                    </div>
                    <div style={{ height: "8px", borderRadius: "4px", background: "#f1f2f4", overflow: "hidden" }}>
                      <div style={{ width: `${p.pct}%`, height: "8px", background: "oklch(0.62 0.13 155)" }}></div>
                    </div>
                  </div>
                </Fragment>
              ))}
            </div>
            {!!isTodoList && (
              <>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                  <div style={{ display: "flex", gap: "4px", background: "#fff", padding: "4px", borderRadius: "999px" }}>
                    {todoFilters.map((f: any, __i18: number) => (
                      <Fragment key={__i18}>
                        <button
                          onClick={f.go}
                          style={{
                            border: "0",
                            cursor: "pointer",
                            padding: "8px 16px",
                            borderRadius: "999px",
                            font: "600 14px YeogiOttaeJalnan,Pretendard,sans-serif",
                            whiteSpace: "nowrap",
                            background: f.bg,
                            color: f.fg,
                          }}
                        >
                          {f.label} <span style={{ opacity: ".6" }}>{f.n}</span>
                        </button>
                      </Fragment>
                    ))}
                  </div>
                  <button
                    onClick={addTodo}
                    style={{
                      border: "0",
                      borderRadius: "999px",
                      padding: "10px 18px",
                      background: "oklch(0.5 0.13 155)",
                      color: "#fff",
                      font: "700 14px YeogiOttaeJalnan,Pretendard,sans-serif",
                      cursor: "pointer",
                    }}
                  >
                    + 할일 추가
                  </button>
                </div>
                <div style={{ background: "#fff", borderRadius: "28px", padding: "12px 24px", display: "flex", flexDirection: "column" }}>
                  {todoList.map((t: any, __i19: number) => (
                    <Fragment key={__i19}>
                      <div
                        style={{
                          display: "flex",
                          gap: "14px",
                          alignItems: "center",
                          padding: "14px 0",
                          borderBottom: "1px solid #f1f2f4",
                          flexWrap: "wrap",
                        }}
                      >
                        <div
                          onClick={t.toggle}
                          style={{
                            width: "24px",
                            height: "24px",
                            borderRadius: "50%",
                            border: "2px solid oklch(0.62 0.13 155)",
                            background: t.fill,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fff",
                            font: "700 12px sans-serif",
                            flexShrink: "0",
                            cursor: "pointer",
                          }}
                        >
                          {!!t.done && <>✓</>}
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: "2px", flex: "1", minWidth: "160px" }}>
                          <span style={{ font: "600 15px YeogiOttaeJalnan,Pretendard,sans-serif", textDecoration: t.deco, opacity: t.op }}>
                            {t.title}
                          </span>
                          <span style={{ fontSize: "13px", color: "#5b6068" }}>
                            {t.project}
                            {" · "}
                            {t.dueTxt}
                            {" · "}
                            {t.statusTxt}
                          </span>
                        </div>
                        {!!t.late && (
                          <>
                            <span
                              style={{
                                font: "700 12px YeogiOttaeJalnan,Pretendard,sans-serif",
                                padding: "4px 10px",
                                borderRadius: "999px",
                                background: "oklch(0.95 0.04 25)",
                                color: "oklch(0.48 0.17 25)",
                              }}
                            >
                              지연
                            </span>
                          </>
                        )}
                        <span
                          style={{
                            font: "700 12px YeogiOttaeJalnan,Pretendard,sans-serif",
                            padding: "4px 10px",
                            borderRadius: "999px",
                            background: t.pBg,
                            color: t.pFg,
                          }}
                        >
                          {"우선순위 "}
                          {t.prio}
                        </span>
                      </div>
                    </Fragment>
                  ))}
                  {!!todoEmpty && (
                    <>
                      <div style={{ padding: "24px 0", fontSize: "14px", color: "#5b6068" }}>표시할 할일이 없어요.</div>
                    </>
                  )}
                </div>
              </>
            )}
            {!!isTodoBoard && (
              <>
                <div style={{ display: "grid", gridTemplateColumns: boardCols, gap: "18px" }}>
                  {board.map((col: any, __i20: number) => (
                    <Fragment key={__i20}>
                      <div
                        style={{
                          background: "#e4e7eb",
                          borderRadius: "24px",
                          padding: "16px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "10px",
                        }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 6px" }}>
                          <span
                            style={{
                              font: "400 16px YeogiOttaeJalnan,Pretendard,sans-serif",
                              display: "flex",
                              gap: "8px",
                              alignItems: "center",
                            }}
                          >
                            <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: col.dot }}></span>
                            {col.label}
                          </span>
                          <span style={{ font: "600 13px YeogiOttaeJalnan,Pretendard,sans-serif", color: "#5b6068" }}>{col.n}</span>
                        </div>
                        {col.items.map((t: any, __i21: number) => (
                          <Fragment key={__i21}>
                            <div
                              style={{
                                background: "#fff",
                                borderRadius: "16px",
                                padding: "14px",
                                display: "flex",
                                flexDirection: "column",
                                gap: "10px",
                              }}
                            >
                              <span
                                style={{ font: "600 15px YeogiOttaeJalnan,Pretendard,sans-serif", textDecoration: t.deco, opacity: t.op }}
                              >
                                {t.title}
                              </span>
                              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", alignItems: "center" }}>
                                <span
                                  style={{
                                    font: "700 11px YeogiOttaeJalnan,Pretendard,sans-serif",
                                    padding: "3px 8px",
                                    borderRadius: "999px",
                                    background: t.pBg,
                                    color: t.pFg,
                                  }}
                                >
                                  {t.prio}
                                </span>
                                <span style={{ font: "500 12px YeogiOttaeJalnan,Pretendard,sans-serif", color: "#5b6068" }}>
                                  {t.project}
                                  {" · "}
                                  {t.dueTxt}
                                </span>
                                {!!t.late && (
                                  <>
                                    <span style={{ font: "700 11px YeogiOttaeJalnan,Pretendard,sans-serif", color: "oklch(0.48 0.17 25)" }}>
                                      지연
                                    </span>
                                  </>
                                )}
                              </div>
                              <div style={{ display: "flex", gap: "6px", justifyContent: "flex-end" }}>
                                {!!t.canBack && (
                                  <>
                                    <button
                                      onClick={t.back}
                                      style={{
                                        border: "0",
                                        background: "#f1f2f4",
                                        borderRadius: "10px",
                                        padding: "6px 10px",
                                        font: "600 12px YeogiOttaeJalnan,Pretendard,sans-serif",
                                        cursor: "pointer",
                                      }}
                                    >
                                      {"← "}
                                      {t.backLabel}
                                    </button>
                                  </>
                                )}
                                {!!t.canFwd && (
                                  <>
                                    <button
                                      onClick={t.fwd}
                                      style={{
                                        border: "0",
                                        background: "#15171a",
                                        color: "#fff",
                                        borderRadius: "10px",
                                        padding: "6px 10px",
                                        font: "600 12px YeogiOttaeJalnan,Pretendard,sans-serif",
                                        cursor: "pointer",
                                      }}
                                    >
                                      {t.fwdLabel}
                                      {" →"}
                                    </button>
                                  </>
                                )}
                              </div>
                            </div>
                          </Fragment>
                        ))}
                      </div>
                    </Fragment>
                  ))}
                </div>
              </>
            )}
          </div>
        </>
      )}
      {!!isLedger && (
        <>
          <div style={{ padding: "0 28px", display: "flex", flexDirection: "column", gap: "18px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: "18px" }}>
              <div
                style={{
                  background: "#fff",
                  borderRadius: "24px",
                  padding: "22px 24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                <span style={{ fontSize: "14px", color: "#5b6068" }}>10월 수입</span>
                <span
                  style={{
                    font: "800 28px YeogiOttaeJalnan,Pretendard,sans-serif",
                    letterSpacing: "-.02em",
                    color: "oklch(0.45 0.13 255)",
                  }}
                >
                  {incomeTxt}원
                </span>
              </div>
              <div
                style={{
                  background: "#fff",
                  borderRadius: "24px",
                  padding: "22px 24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                <span style={{ fontSize: "14px", color: "#5b6068" }}>10월 지출</span>
                <span style={{ font: "800 28px YeogiOttaeJalnan,Pretendard,sans-serif", letterSpacing: "-.02em" }}>{expenseTxt}원</span>
              </div>
              <div
                style={{
                  background: "oklch(0.62 0.13 55)",
                  color: "#fff",
                  borderRadius: "24px",
                  padding: "22px 24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                }}
              >
                <span style={{ fontSize: "14px" }}>잔액</span>
                <span style={{ font: "800 28px YeogiOttaeJalnan,Pretendard,sans-serif", letterSpacing: "-.02em" }}>{balanceTxt}원</span>
              </div>
            </div>
            {!!isLgTx && (
              <>
                <div
                  style={{
                    background: "#fff",
                    borderRadius: "28px",
                    padding: "24px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                    minWidth: "0",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "12px",
                      flexWrap: "wrap",
                      paddingBottom: "8px",
                    }}
                  >
                    <div style={{ display: "flex", gap: "4px", background: "#f1f2f4", padding: "4px", borderRadius: "999px" }}>
                      {txFilters.map((f: any, __i22: number) => (
                        <Fragment key={__i22}>
                          <button
                            onClick={f.go}
                            style={{
                              border: "0",
                              cursor: "pointer",
                              padding: "7px 14px",
                              borderRadius: "999px",
                              font: "600 13px YeogiOttaeJalnan,Pretendard,sans-serif",
                              background: f.bg,
                              color: f.fg,
                            }}
                          >
                            {f.label}
                          </button>
                        </Fragment>
                      ))}
                    </div>
                    <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                      <span style={{ font: "600 13px YeogiOttaeJalnan,Pretendard,sans-serif", color: "#5b6068" }}>
                        {"합계 "}
                        {txSumTxt}
                      </span>
                      <button
                        onClick={addTx}
                        style={{
                          border: "0",
                          borderRadius: "999px",
                          padding: "8px 16px",
                          background: "oklch(0.5 0.13 55)",
                          color: "#fff",
                          font: "700 13px YeogiOttaeJalnan,Pretendard,sans-serif",
                          cursor: "pointer",
                        }}
                      >
                        + 거래 추가
                      </button>
                    </div>
                  </div>
                  {txList.map((x: any, __i23: number) => (
                    <Fragment key={__i23}>
                      <div
                        style={{ display: "flex", gap: "14px", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #f1f2f4" }}
                      >
                        <span
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "12px",
                            background: x.bg,
                            color: x.fg,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            font: "700 13px YeogiOttaeJalnan,Pretendard,sans-serif",
                            flexShrink: "0",
                          }}
                        >
                          {x.cat1}
                        </span>
                        <div style={{ display: "flex", flexDirection: "column", gap: "2px", flex: "1", minWidth: "0" }}>
                          <span style={{ font: "600 15px YeogiOttaeJalnan,Pretendard,sans-serif" }}>{x.title}</span>
                          <span style={{ fontSize: "13px", color: "#5b6068" }}>
                            {"10월 "}
                            {x.date}
                            {"일 · "}
                            {x.cat}
                            {" · "}
                            {x.account}
                          </span>
                        </div>
                        <span style={{ font: "700 15px YeogiOttaeJalnan,Pretendard,sans-serif", color: x.amtColor, whiteSpace: "nowrap" }}>
                          {x.amtTxt}
                        </span>
                      </div>
                    </Fragment>
                  ))}
                </div>
              </>
            )}
            {!!isLgCal && (
              <>
                <div
                  style={{
                    background: "#fff",
                    borderRadius: "28px",
                    padding: "24px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "14px",
                  }}
                >
                  <div style={{ font: "400 20px YeogiOttaeJalnan,Pretendard,sans-serif" }}>10월 날짜별 수입·지출</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(7,minmax(0,1fr))", gap: "6px" }}>
                    {dows.map((dw: any, __i24: number) => (
                      <Fragment key={__i24}>
                        <div
                          style={{
                            font: "600 12px YeogiOttaeJalnan,Pretendard,sans-serif",
                            color: dw.c,
                            textAlign: "center",
                            padding: "4px 0",
                          }}
                        >
                          {dw.t}
                        </div>
                      </Fragment>
                    ))}
                    {lgCells.map((c: any, __i25: number) => (
                      <Fragment key={__i25}>
                        <div
                          style={{
                            minHeight: "84px",
                            borderRadius: "14px",
                            padding: "8px",
                            background: c.bg,
                            display: "flex",
                            flexDirection: "column",
                            gap: "4px",
                            minWidth: "0",
                          }}
                        >
                          <span style={{ font: "700 13px YeogiOttaeJalnan,Pretendard,sans-serif", color: c.numFg }}>{c.label}</span>
                          <span
                            style={{
                              font: "700 12px YeogiOttaeJalnan,Pretendard,sans-serif",
                              color: "oklch(0.45 0.13 255)",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {c.inc}
                          </span>
                          <span
                            style={{
                              font: "600 12px YeogiOttaeJalnan,Pretendard,sans-serif",
                              color: "#15171a",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {c.exp}
                          </span>
                        </div>
                      </Fragment>
                    ))}
                  </div>
                </div>
              </>
            )}
            {!!isLgStats && (
              <>
                <div style={{ display: "grid", gridTemplateColumns: halfCols, gap: "18px" }}>
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: "28px",
                      padding: "24px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "18px",
                    }}
                  >
                    <div style={{ font: "400 18px YeogiOttaeJalnan,Pretendard,sans-serif" }}>카테고리별 지출</div>
                    <div style={{ display: "flex", gap: "28px", alignItems: "center", flexWrap: "wrap" }}>
                      <div
                        style={{
                          width: "180px",
                          height: "180px",
                          borderRadius: "50%",
                          background: donut,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: "0",
                        }}
                      >
                        <div
                          style={{
                            width: "112px",
                            height: "112px",
                            borderRadius: "50%",
                            background: "#fff",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <span style={{ fontSize: "12px", color: "#5b6068" }}>총 지출</span>
                          <span style={{ font: "400 16px YeogiOttaeJalnan,Pretendard,sans-serif" }}>{expenseShort}</span>
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: "1", minWidth: "180px" }}>
                        {catShare.map((cs: any, __i26: number) => (
                          <Fragment key={__i26}>
                            <div style={{ display: "flex", gap: "10px", alignItems: "center", fontSize: "14px" }}>
                              <span style={{ width: "10px", height: "10px", borderRadius: "3px", background: cs.color }}></span>
                              <span style={{ flex: "1", fontWeight: "600" }}>{cs.name}</span>
                              <span style={{ color: "#5b6068" }}>{cs.amtTxt}</span>
                              <span style={{ fontWeight: "700", width: "40px", textAlign: "right" }}>{cs.pct}%</span>
                            </div>
                          </Fragment>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: "28px",
                      padding: "24px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "18px",
                    }}
                  >
                    <div
                      style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "12px", flexWrap: "wrap" }}
                    >
                      <span style={{ font: "400 18px YeogiOttaeJalnan,Pretendard,sans-serif" }}>월별 지출 추이</span>
                      <span style={{ font: "600 13px YeogiOttaeJalnan,Pretendard,sans-serif", color: momColor }}>{momTxt}</span>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: "12px", alignItems: "end", height: "200px" }}>
                      {trend.map((tr: any, __i27: number) => (
                        <Fragment key={__i27}>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              gap: "6px",
                              height: "100%",
                              justifyContent: "flex-end",
                            }}
                          >
                            <span style={{ font: "600 11px YeogiOttaeJalnan,Pretendard,sans-serif", color: "#5b6068" }}>{tr.v}</span>
                            <div
                              style={{
                                width: "100%",
                                maxWidth: "44px",
                                height: `${tr.h}%`,
                                borderRadius: "10px 10px 4px 4px",
                                background: tr.bg,
                              }}
                            ></div>
                            <span style={{ font: "600 12px YeogiOttaeJalnan,Pretendard,sans-serif" }}>{tr.m}</span>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}
            {!!isLgBudget && (
              <>
                <div
                  style={{
                    background: "#fff",
                    borderRadius: "28px",
                    padding: "24px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "18px",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: "12px", flexWrap: "wrap" }}>
                    <span style={{ font: "400 18px YeogiOttaeJalnan,Pretendard,sans-serif" }}>10월 카테고리 예산</span>
                    <span style={{ font: "600 14px YeogiOttaeJalnan,Pretendard,sans-serif", color: "#5b6068" }}>
                      {"전체 "}
                      {expenseTxt}
                      {" / "}
                      {budgetTotalTxt}
                      {"원 · "}
                      {budgetPct}%
                    </span>
                  </div>
                  {budgets.map((b: any, __i28: number) => (
                    <Fragment key={__i28}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "6px 0" }}>
                        <div
                          style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}
                        >
                          <span
                            style={{
                              font: "700 15px YeogiOttaeJalnan,Pretendard,sans-serif",
                              display: "flex",
                              gap: "8px",
                              alignItems: "center",
                            }}
                          >
                            {b.name}
                            {!!b.badge && (
                              <>
                                <span
                                  style={{
                                    font: "700 11px YeogiOttaeJalnan,Pretendard,sans-serif",
                                    padding: "3px 8px",
                                    borderRadius: "999px",
                                    background: b.badgeBg,
                                    color: b.txt,
                                  }}
                                >
                                  {b.badge}
                                </span>
                              </>
                            )}
                          </span>
                          <span style={{ fontSize: "14px" }}>
                            <span style={{ fontWeight: "700", color: b.txt }}>{b.pct}%</span>{" "}
                            <span style={{ color: "#5b6068" }}>
                              {"· "}
                              {b.spentTxt}
                              {" / "}
                              {b.amtTxt}
                              {"원 · "}
                              {b.leftTxt}
                            </span>
                          </span>
                        </div>
                        <div style={{ height: "12px", borderRadius: "6px", background: "#f1f2f4", overflow: "hidden" }}>
                          <div style={{ width: `${b.w}%`, height: "12px", background: b.bar }}></div>
                        </div>
                      </div>
                    </Fragment>
                  ))}
                </div>
              </>
            )}
            {!!isLgAssets && (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
                  <div
                    style={{
                      background: "#15171a",
                      color: "#fff",
                      borderRadius: "28px",
                      padding: "24px 28px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "12px",
                      flexWrap: "wrap",
                    }}
                  >
                    <span style={{ font: "600 15px YeogiOttaeJalnan,Pretendard,sans-serif" }}>순자산</span>
                    <span style={{ font: "800 32px YeogiOttaeJalnan,Pretendard,sans-serif", letterSpacing: "-.02em" }}>
                      {netWorthTxt}원
                    </span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", gap: "18px" }}>
                    {accounts.map((a: any, __i29: number) => (
                      <Fragment key={__i29}>
                        <div
                          style={{
                            background: "#fff",
                            borderRadius: "24px",
                            padding: "22px 24px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <span style={{ font: "700 16px YeogiOttaeJalnan,Pretendard,sans-serif" }}>{a.name}</span>
                            <span
                              style={{
                                font: "700 12px YeogiOttaeJalnan,Pretendard,sans-serif",
                                padding: "4px 10px",
                                borderRadius: "999px",
                                background: a.bg,
                                color: a.fg,
                              }}
                            >
                              {a.type}
                            </span>
                          </div>
                          <span
                            style={{ font: "400 24px YeogiOttaeJalnan,Pretendard,sans-serif", letterSpacing: "-.02em", color: a.amtColor }}
                          >
                            {a.balTxt}원
                          </span>
                          <span style={{ fontSize: "13px", color: "#5b6068" }}>{a.note}</span>
                        </div>
                      </Fragment>
                    ))}
                  </div>
                </div>
              </>
            )}
            {!!isLgRec && (
              <>
                <div
                  style={{
                    background: "#fff",
                    borderRadius: "28px",
                    padding: "24px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "baseline",
                      gap: "12px",
                      flexWrap: "wrap",
                      paddingBottom: "8px",
                    }}
                  >
                    <span style={{ font: "400 18px YeogiOttaeJalnan,Pretendard,sans-serif" }}>고정지출 · 반복거래</span>
                    <span style={{ font: "600 14px YeogiOttaeJalnan,Pretendard,sans-serif", color: "#5b6068" }}>
                      {"월 고정지출 "}
                      {recTotalTxt}원
                    </span>
                  </div>
                  {recurring.map((r: any, __i30: number) => (
                    <Fragment key={__i30}>
                      <div
                        style={{
                          display: "flex",
                          gap: "14px",
                          alignItems: "center",
                          padding: "14px 0",
                          borderBottom: "1px solid #f1f2f4",
                          opacity: r.op,
                        }}
                      >
                        <span
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "12px",
                            background: r.bg,
                            color: r.fg,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            font: "700 13px YeogiOttaeJalnan,Pretendard,sans-serif",
                            flexShrink: "0",
                          }}
                        >
                          {r.day}일
                        </span>
                        <div style={{ display: "flex", flexDirection: "column", gap: "2px", flex: "1", minWidth: "0" }}>
                          <span style={{ font: "600 15px YeogiOttaeJalnan,Pretendard,sans-serif" }}>{r.title}</span>
                          <span style={{ fontSize: "13px", color: "#5b6068" }}>
                            {"매월 "}
                            {r.day}
                            {"일 · "}
                            {r.cat}
                            {" · "}
                            {r.account}
                            {" · 다음 "}
                            {r.next}
                          </span>
                        </div>
                        <span style={{ font: "700 15px YeogiOttaeJalnan,Pretendard,sans-serif", whiteSpace: "nowrap", color: r.amtColor }}>
                          {r.amtTxt}
                        </span>
                        <div
                          onClick={r.flip}
                          style={{
                            width: "44px",
                            height: "26px",
                            borderRadius: "13px",
                            background: r.track,
                            padding: "3px",
                            cursor: "pointer",
                            flexShrink: "0",
                            display: "flex",
                            justifyContent: r.jc,
                          }}
                        >
                          <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#fff" }}></div>
                        </div>
                      </div>
                    </Fragment>
                  ))}
                </div>
              </>
            )}
          </div>
        </>
      )}
      {!!isSearch && (
        <>
          <div
            style={{
              padding: "0 28px",
              display: "flex",
              flexDirection: "column",
              gap: "18px",
              maxWidth: "900px",
              width: "100%",
              margin: "0 auto",
            }}
          >
            <input
              autoFocus={true}
              value={q}
              onChange={setQ}
              placeholder="일정, 할일, 거래를 한 번에 검색 — 예) 요가, 식비, 보고서"
              style={{
                border: "0",
                borderRadius: "20px",
                padding: "18px 22px",
                font: "500 18px YeogiOttaeJalnan,Pretendard,sans-serif",
                background: "#fff",
                color: "#15171a",
                outline: "none",
                width: "100%",
              }}
            />
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {searchFilters.map((f: any, __i31: number) => (
                <Fragment key={__i31}>
                  <button
                    onClick={f.go}
                    style={{
                      border: "0",
                      cursor: "pointer",
                      padding: "8px 14px",
                      borderRadius: "999px",
                      font: "600 13px YeogiOttaeJalnan,Pretendard,sans-serif",
                      background: f.bg,
                      color: f.fg,
                    }}
                  >
                    {f.label} <span style={{ opacity: ".6" }}>{f.n}</span>
                  </button>
                </Fragment>
              ))}
            </div>
            {!!qEmpty && (
              <>
                <div
                  style={{
                    background: "#fff",
                    borderRadius: "24px",
                    padding: "24px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "12px",
                  }}
                >
                  <span style={{ font: "700 15px YeogiOttaeJalnan,Pretendard,sans-serif" }}>이렇게 찾아보세요</span>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {suggestions.map((sg: any, __i32: number) => (
                      <Fragment key={__i32}>
                        <button
                          onClick={sg.go}
                          style={{
                            border: "0",
                            cursor: "pointer",
                            padding: "8px 14px",
                            borderRadius: "999px",
                            font: "600 14px YeogiOttaeJalnan,Pretendard,sans-serif",
                            background: "#f1f2f4",
                            color: "#15171a",
                          }}
                        >
                          {sg.t}
                        </button>
                      </Fragment>
                    ))}
                  </div>
                </div>
              </>
            )}
            {!!hasResults && (
              <>
                <div style={{ background: "#fff", borderRadius: "24px", padding: "8px 24px", display: "flex", flexDirection: "column" }}>
                  {results.map((r: any, __i33: number) => (
                    <Fragment key={__i33}>
                      <div
                        onClick={r.go}
                        style={{
                          display: "flex",
                          gap: "14px",
                          alignItems: "center",
                          padding: "14px 0",
                          borderBottom: "1px solid #f1f2f4",
                          cursor: "pointer",
                        }}
                      >
                        <span
                          style={{
                            font: "700 12px YeogiOttaeJalnan,Pretendard,sans-serif",
                            padding: "4px 10px",
                            borderRadius: "999px",
                            background: r.bg,
                            color: r.fg,
                            flexShrink: "0",
                          }}
                        >
                          {r.kind}
                        </span>
                        <div style={{ display: "flex", flexDirection: "column", gap: "2px", flex: "1", minWidth: "0" }}>
                          <span style={{ font: "600 15px YeogiOttaeJalnan,Pretendard,sans-serif" }}>{r.title}</span>
                          <span style={{ fontSize: "13px", color: "#5b6068" }}>{r.sub}</span>
                        </div>
                        <span style={{ font: "700 14px YeogiOttaeJalnan,Pretendard,sans-serif", whiteSpace: "nowrap" }}>{r.right}</span>
                      </div>
                    </Fragment>
                  ))}
                </div>
              </>
            )}
            {!!noResults && (
              <>
                <div style={{ fontSize: "15px", color: "#5b6068", padding: "12px 4px" }}>
                  {'"'}
                  {q}
                  {'"에 해당하는 항목이 없어요.'}
                </div>
              </>
            )}
          </div>
        </>
      )}
      {!!isSettings && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: setCols, gap: "18px", padding: "0 28px" }}>
            <div
              style={{
                background: "#fff",
                borderRadius: "24px",
                padding: "10px",
                display: "flex",
                flexDirection: setNavDir,
                gap: "2px",
                alignSelf: "start",
                overflowX: "auto",
              }}
            >
              {setNav.map((sn: any, __i34: number) => (
                <Fragment key={__i34}>
                  <button
                    onClick={sn.go}
                    style={{
                      border: "0",
                      cursor: "pointer",
                      textAlign: "left",
                      padding: "12px 14px",
                      borderRadius: "14px",
                      font: "600 14px YeogiOttaeJalnan,Pretendard,sans-serif",
                      whiteSpace: "nowrap",
                      background: sn.bg,
                      color: sn.fg,
                    }}
                  >
                    {sn.label}
                  </button>
                </Fragment>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "18px", minWidth: "0" }}>
              {!!isSetInt && (
                <>
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: "28px",
                      padding: "24px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "16px",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <span style={{ font: "400 18px YeogiOttaeJalnan,Pretendard,sans-serif" }}>Google Calendar</span>
                        <span style={{ fontSize: "13px", color: "#5b6068" }}>{gcalStatus}</span>
                      </div>
                      <button
                        onClick={toggleGcal}
                        style={{
                          border: "0",
                          cursor: "pointer",
                          borderRadius: "12px",
                          padding: "10px 16px",
                          font: "700 14px YeogiOttaeJalnan,Pretendard,sans-serif",
                          background: gcalBtnBg,
                          color: gcalBtnFg,
                        }}
                      >
                        {gcalBtn}
                      </button>
                    </div>
                    {!!gcalOn && (
                      <>
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "2px",
                            borderTop: "1px solid #f1f2f4",
                            paddingTop: "10px",
                          }}
                        >
                          <span style={{ font: "600 13px YeogiOttaeJalnan,Pretendard,sans-serif", color: "#5b6068", paddingBottom: "4px" }}>
                            동기화할 캘린더
                          </span>
                          {gcals.map((g: any, __i35: number) => (
                            <Fragment key={__i35}>
                              <div style={{ display: "flex", gap: "12px", alignItems: "center", padding: "10px 0" }}>
                                <span style={{ width: "12px", height: "12px", borderRadius: "4px", background: g.color }}></span>
                                <span style={{ flex: "1", font: "600 15px YeogiOttaeJalnan,Pretendard,sans-serif" }}>{g.name}</span>
                                <span style={{ fontSize: "13px", color: "#5b6068" }}>{g.count}개 일정</span>
                                <div
                                  onClick={g.flip}
                                  style={{
                                    width: "44px",
                                    height: "26px",
                                    borderRadius: "13px",
                                    background: g.track,
                                    padding: "3px",
                                    cursor: "pointer",
                                    flexShrink: "0",
                                    display: "flex",
                                    justifyContent: g.jc,
                                  }}
                                >
                                  <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#fff" }}></div>
                                </div>
                              </div>
                            </Fragment>
                          ))}
                          <span style={{ fontSize: "13px", color: "#5b6068", paddingTop: "6px" }}>
                            양방향 동기화 · 충돌 시 최종 수정 우선 · 변경 감지 Webhook + 15분 폴링
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: "28px",
                      padding: "24px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "14px",
                    }}
                  >
                    <span style={{ font: "400 18px YeogiOttaeJalnan,Pretendard,sans-serif" }}>날씨 위치</span>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {cities.map((ct: any, __i36: number) => (
                        <Fragment key={__i36}>
                          <button
                            onClick={ct.go}
                            style={{
                              whiteSpace: "nowrap",
                              flexShrink: "0",
                              cursor: "pointer",
                              padding: "9px 16px",
                              borderRadius: "999px",
                              font: "600 14px YeogiOttaeJalnan,Pretendard,sans-serif",
                              border: `1.5px solid ${ct.bd}`,
                              background: ct.bg,
                              color: ct.fg,
                            }}
                          >
                            {ct.name}
                          </button>
                        </Fragment>
                      ))}
                    </div>
                    <span style={{ fontSize: "13px", color: "#5b6068" }}>
                      Open-Meteo · 30분 캐시 · 브라우저 위치 사용은 화면 설정에서 허용할 수 있어요
                    </span>
                  </div>
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: "28px",
                      padding: "24px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "14px",
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        <span style={{ font: "400 18px YeogiOttaeJalnan,Pretendard,sans-serif" }}>Claude MCP 토큰</span>
                        <span style={{ fontSize: "13px", color: "#5b6068" }}>calendar-mcp · todo-mcp · ledger-mcp 공통</span>
                      </div>
                      <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                        {scopeOpts.map((so: any, __i37: number) => (
                          <Fragment key={__i37}>
                            <button
                              onClick={so.go}
                              style={{
                                whiteSpace: "nowrap",
                                flexShrink: "0",
                                cursor: "pointer",
                                padding: "8px 12px",
                                borderRadius: "10px",
                                font: "600 13px YeogiOttaeJalnan,Pretendard,sans-serif",
                                border: `1.5px solid ${so.bd}`,
                                background: "#fff",
                                color: "#15171a",
                              }}
                            >
                              {so.label}
                            </button>
                          </Fragment>
                        ))}
                        <button
                          onClick={issueToken}
                          style={{
                            whiteSpace: "nowrap",
                            flexShrink: "0",
                            border: "0",
                            cursor: "pointer",
                            borderRadius: "12px",
                            padding: "10px 16px",
                            font: "700 14px YeogiOttaeJalnan,Pretendard,sans-serif",
                            background: "#15171a",
                            color: "#fff",
                          }}
                        >
                          새 토큰 발급
                        </button>
                      </div>
                    </div>
                    {!!newToken && (
                      <>
                        <div
                          style={{
                            background: "oklch(0.95 0.035 155)",
                            borderRadius: "16px",
                            padding: "14px 16px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "6px",
                          }}
                        >
                          <span style={{ font: "700 13px YeogiOttaeJalnan,Pretendard,sans-serif", color: "oklch(0.4 0.13 155)" }}>
                            지금 한 번만 표시돼요. 복사해서 Claude 커넥터에 붙여넣으세요.
                          </span>
                          <span style={{ font: "500 14px YeogiOttaeJalnan,Pretendard,sans-serif", wordBreak: "break-all" }}>
                            {newToken}
                          </span>
                        </div>
                      </>
                    )}
                    {tokens.map((tk: any, __i38: number) => (
                      <Fragment key={__i38}>
                        <div
                          style={{
                            display: "flex",
                            gap: "12px",
                            alignItems: "center",
                            padding: "12px 0",
                            borderTop: "1px solid #f1f2f4",
                            flexWrap: "wrap",
                          }}
                        >
                          <div style={{ display: "flex", flexDirection: "column", gap: "2px", flex: "1", minWidth: "160px" }}>
                            <span style={{ font: "600 15px YeogiOttaeJalnan,Pretendard,sans-serif" }}>{tk.name}</span>
                            <span style={{ font: "500 12px YeogiOttaeJalnan,Pretendard,sans-serif", color: "#5b6068" }}>
                              {tk.prefix}
                              {"•••• · 마지막 사용 "}
                              {tk.last}
                            </span>
                          </div>
                          <span
                            style={{
                              font: "700 12px YeogiOttaeJalnan,Pretendard,sans-serif",
                              padding: "4px 10px",
                              borderRadius: "999px",
                              background: "#f1f2f4",
                            }}
                          >
                            {tk.scope}
                          </span>
                          <button
                            onClick={tk.revoke}
                            style={{
                              border: "0",
                              cursor: "pointer",
                              borderRadius: "10px",
                              padding: "8px 12px",
                              font: "700 13px YeogiOttaeJalnan,Pretendard,sans-serif",
                              background: "oklch(0.95 0.04 25)",
                              color: "oklch(0.45 0.17 25)",
                            }}
                          >
                            폐기
                          </button>
                        </div>
                      </Fragment>
                    ))}
                    <div
                      style={{ display: "flex", flexDirection: "column", gap: "6px", borderTop: "1px solid #f1f2f4", paddingTop: "12px" }}
                    >
                      <span style={{ font: "600 13px YeogiOttaeJalnan,Pretendard,sans-serif", color: "#5b6068" }}>최근 호출</span>
                      {mcpLogs.map((lg: any, __i39: number) => (
                        <Fragment key={__i39}>
                          <div style={{ display: "flex", gap: "12px", font: "500 13px YeogiOttaeJalnan,Pretendard,sans-serif" }}>
                            <span style={{ color: "#5b6068", width: "48px" }}>{lg.t}</span>
                            <span style={{ flex: "1" }}>{lg.tool}</span>
                            <span style={{ color: lg.c }}>{lg.r}</span>
                          </div>
                        </Fragment>
                      ))}
                    </div>
                  </div>
                </>
              )}
              {!!isSetCat && (
                <>
                  {catGroups.map((cg: any, __i40: number) => (
                    <Fragment key={__i40}>
                      <div
                        style={{
                          background: "#fff",
                          borderRadius: "28px",
                          padding: "24px",
                          display: "flex",
                          flexDirection: "column",
                          gap: "14px",
                        }}
                      >
                        <span style={{ font: "400 18px YeogiOttaeJalnan,Pretendard,sans-serif" }}>{cg.title}</span>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          {cg.items.map((ci: any, __i41: number) => (
                            <Fragment key={__i41}>
                              <span
                                style={{
                                  display: "flex",
                                  gap: "8px",
                                  alignItems: "center",
                                  padding: "9px 14px",
                                  borderRadius: "999px",
                                  background: ci.bg,
                                  color: ci.fg,
                                  font: "600 14px YeogiOttaeJalnan,Pretendard,sans-serif",
                                }}
                              >
                                <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: ci.dot }}></span>
                                {ci.name}
                              </span>
                            </Fragment>
                          ))}
                          <span
                            style={{
                              padding: "9px 14px",
                              borderRadius: "999px",
                              border: "1.5px dashed #c9cdd3",
                              color: "#5b6068",
                              font: "600 14px YeogiOttaeJalnan,Pretendard,sans-serif",
                            }}
                          >
                            + 추가
                          </span>
                        </div>
                      </div>
                    </Fragment>
                  ))}
                </>
              )}
              {!!isSetNoti && (
                <>
                  <div style={{ background: "#fff", borderRadius: "28px", padding: "12px 24px", display: "flex", flexDirection: "column" }}>
                    {notis.map((n: any, __i42: number) => (
                      <Fragment key={__i42}>
                        <div
                          style={{
                            display: "flex",
                            gap: "12px",
                            alignItems: "center",
                            padding: "16px 0",
                            borderBottom: "1px solid #f1f2f4",
                          }}
                        >
                          <div style={{ display: "flex", flexDirection: "column", gap: "2px", flex: "1", minWidth: "0" }}>
                            <span style={{ font: "600 15px YeogiOttaeJalnan,Pretendard,sans-serif" }}>{n.label}</span>
                            <span style={{ fontSize: "13px", color: "#5b6068" }}>{n.desc}</span>
                          </div>
                          <div
                            onClick={n.flip}
                            style={{
                              width: "44px",
                              height: "26px",
                              borderRadius: "13px",
                              background: n.track,
                              padding: "3px",
                              cursor: "pointer",
                              flexShrink: "0",
                              display: "flex",
                              justifyContent: n.jc,
                            }}
                          >
                            <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#fff" }}></div>
                          </div>
                        </div>
                      </Fragment>
                    ))}
                  </div>
                </>
              )}
              {!!isSetView && (
                <>
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: "28px",
                      padding: "24px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "20px",
                    }}
                  >
                    {viewOpts.map((vo: any, __i43: number) => (
                      <Fragment key={__i43}>
                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                          <span style={{ font: "700 15px YeogiOttaeJalnan,Pretendard,sans-serif" }}>{vo.label}</span>
                          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                            {vo.opts.map((o: any, __i44: number) => (
                              <Fragment key={__i44}>
                                <button
                                  onClick={o.go}
                                  style={{
                                    cursor: "pointer",
                                    padding: "9px 16px",
                                    borderRadius: "12px",
                                    font: "600 14px YeogiOttaeJalnan,Pretendard,sans-serif",
                                    border: `1.5px solid ${o.bd}`,
                                    background: o.bg,
                                    color: o.fg,
                                  }}
                                >
                                  {o.label}
                                </button>
                              </Fragment>
                            ))}
                          </div>
                        </div>
                      </Fragment>
                    ))}
                    <span style={{ fontSize: "13px", color: "#5b6068" }}>
                      시간대 Asia/Seoul · 모든 시각은 UTC로 저장되고 표시할 때 변환돼요
                    </span>
                  </div>
                </>
              )}
              {!!isSetBackup && (
                <>
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: "28px",
                      padding: "24px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "14px",
                    }}
                  >
                    <span style={{ font: "400 18px YeogiOttaeJalnan,Pretendard,sans-serif" }}>데이터 내보내기</span>
                    <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                      <button
                        onClick={exportJson}
                        style={{
                          border: "0",
                          cursor: "pointer",
                          borderRadius: "12px",
                          padding: "12px 18px",
                          font: "700 14px YeogiOttaeJalnan,Pretendard,sans-serif",
                          background: "#15171a",
                          color: "#fff",
                        }}
                      >
                        전체 JSON 내려받기
                      </button>
                      <button
                        onClick={exportCsv}
                        style={{
                          border: "0",
                          cursor: "pointer",
                          borderRadius: "12px",
                          padding: "12px 18px",
                          font: "700 14px YeogiOttaeJalnan,Pretendard,sans-serif",
                          background: "#f1f2f4",
                          color: "#15171a",
                        }}
                      >
                        거래내역 CSV
                      </button>
                    </div>
                    <span style={{ fontSize: "13px", color: "#5b6068" }}>
                      {"일정 "}
                      {evCount}
                      {"개 · 할일 "}
                      {tdCount}
                      {"개 · 거래 "}
                      {txCount}건 · Supabase 자동 백업은 매일 새벽 4시
                    </span>
                  </div>
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: "28px",
                      padding: "24px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    <span style={{ font: "400 18px YeogiOttaeJalnan,Pretendard,sans-serif" }}>CSV 가져오기</span>
                    <div
                      style={{
                        border: "1.5px dashed #c9cdd3",
                        borderRadius: "16px",
                        padding: "28px",
                        textAlign: "center",
                        font: "500 14px YeogiOttaeJalnan,Pretendard,sans-serif",
                        color: "#5b6068",
                      }}
                    >
                      거래내역 CSV 파일을 여기에 놓으세요 · 날짜, 내용, 금액, 카테고리
                    </div>
                  </div>
                </>
              )}
              {!!isSetProfile && (
                <>
                  <div
                    style={{
                      background: "#fff",
                      borderRadius: "28px",
                      padding: "24px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "18px",
                    }}
                  >
                    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                      <span
                        style={{
                          width: "64px",
                          height: "64px",
                          borderRadius: "50%",
                          background: "#d7dbe1",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          font: "800 22px YeogiOttaeJalnan,Pretendard,sans-serif",
                        }}
                      >
                        민
                      </span>
                      <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                        <span style={{ font: "400 20px YeogiOttaeJalnan,Pretendard,sans-serif" }}>김민지</span>
                        <span style={{ fontSize: "14px", color: "#5b6068" }}>minji@gmail.com · Google 로그인</span>
                      </div>
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "12px" }}>
                      <div style={{ background: "#f5f6f8", borderRadius: "16px", padding: "14px 16px" }}>
                        <div style={{ fontSize: "13px", color: "#5b6068" }}>시간대</div>
                        <div style={{ font: "700 15px YeogiOttaeJalnan,Pretendard,sans-serif" }}>Asia/Seoul (UTC+9)</div>
                      </div>
                      <div style={{ background: "#f5f6f8", borderRadius: "16px", padding: "14px 16px" }}>
                        <div style={{ fontSize: "13px", color: "#5b6068" }}>통화</div>
                        <div style={{ font: "700 15px YeogiOttaeJalnan,Pretendard,sans-serif" }}>KRW (원)</div>
                      </div>
                      <div style={{ background: "#f5f6f8", borderRadius: "16px", padding: "14px 16px" }}>
                        <div style={{ fontSize: "13px", color: "#5b6068" }}>가입일</div>
                        <div style={{ font: "700 15px YeogiOttaeJalnan,Pretendard,sans-serif" }}>2026년 10월 1일</div>
                      </div>
                    </div>
                    <div style={{ display: "flex", gap: "10px" }}>
                      <button
                        style={{
                          border: "0",
                          cursor: "pointer",
                          borderRadius: "12px",
                          padding: "12px 18px",
                          font: "700 14px YeogiOttaeJalnan,Pretendard,sans-serif",
                          background: "#f1f2f4",
                          color: "#15171a",
                        }}
                      >
                        로그아웃
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
      <button
        onClick={openQA}
        style={{
          position: "fixed",
          right: "28px",
          bottom: "28px",
          height: "56px",
          padding: "0 22px",
          border: "0",
          borderRadius: "999px",
          background: "#15171a",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          font: "700 15px YeogiOttaeJalnan,Pretendard,sans-serif",
          boxShadow: "0 8px 24px rgba(0,0,0,.2)",
          cursor: "pointer",
          zIndex: "5",
        }}
      >
        <span style={{ fontSize: "22px", fontWeight: "400" }}>+</span>빠른 추가
        <span style={{ font: "500 12px YeogiOttaeJalnan,Pretendard,sans-serif", opacity: ".6" }}>N</span>
      </button>
      {!!qaOpen && (
        <>
          <div
            onClick={closeQA}
            style={{
              position: "fixed",
              inset: "0",
              background: "rgba(21,23,26,.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
              zIndex: "10",
            }}
          >
            <div
              onClick={stop}
              style={{
                background: "#fff",
                borderRadius: "28px",
                padding: "28px",
                width: "100%",
                maxWidth: "440px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                boxShadow: "0 20px 60px rgba(0,0,0,.2)",
              }}
            >
              <div style={{ font: "400 20px YeogiOttaeJalnan,Pretendard,sans-serif" }}>빠른 추가</div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "4px",
                  background: "#f1f2f4",
                  padding: "4px",
                  borderRadius: "999px",
                }}
              >
                {qaTypes.map((q: any, __i45: number) => (
                  <Fragment key={__i45}>
                    <button
                      onClick={q.go}
                      style={{
                        border: "0",
                        cursor: "pointer",
                        padding: "9px",
                        borderRadius: "999px",
                        font: "700 14px YeogiOttaeJalnan,Pretendard,sans-serif",
                        background: q.bg,
                        color: q.fg,
                      }}
                    >
                      {q.label}
                    </button>
                  </Fragment>
                ))}
              </div>
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  font: "600 13px YeogiOttaeJalnan,Pretendard,sans-serif",
                  color: "#5b6068",
                }}
              >
                {qaTitleLabel}
                <input
                  autoFocus={true}
                  value={qaTitle}
                  onChange={setTitle}
                  onKeyDown={qaKey}
                  placeholder={qaPh}
                  style={{
                    border: "1.5px solid #dfe2e6",
                    borderRadius: "14px",
                    padding: "12px 14px",
                    font: "500 16px YeogiOttaeJalnan,Pretendard,sans-serif",
                    color: "#15171a",
                    outline: "none",
                  }}
                />
              </label>
              {!!qaIsEvent && (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <label
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                        font: "600 13px YeogiOttaeJalnan,Pretendard,sans-serif",
                        color: "#5b6068",
                      }}
                    >
                      날짜 (10월)
                      <input
                        type="number"
                        min="1"
                        max="31"
                        value={qaDay}
                        onChange={setDay}
                        style={{
                          border: "1.5px solid #dfe2e6",
                          borderRadius: "14px",
                          padding: "12px 14px",
                          font: "500 16px YeogiOttaeJalnan,Pretendard,sans-serif",
                        }}
                      />
                    </label>
                    <label
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                        font: "600 13px YeogiOttaeJalnan,Pretendard,sans-serif",
                        color: "#5b6068",
                      }}
                    >
                      시간
                      <input
                        type="time"
                        value={qaTime}
                        onChange={setTime}
                        style={{
                          border: "1.5px solid #dfe2e6",
                          borderRadius: "14px",
                          padding: "12px 14px",
                          font: "500 16px YeogiOttaeJalnan,Pretendard,sans-serif",
                        }}
                      />
                    </label>
                  </div>
                  <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
                    {evCatOpts.map((o: any, __i46: number) => (
                      <Fragment key={__i46}>
                        <button
                          onClick={o.go}
                          style={{
                            cursor: "pointer",
                            padding: "7px 12px",
                            borderRadius: "999px",
                            font: "600 13px YeogiOttaeJalnan,Pretendard,sans-serif",
                            border: `1.5px solid ${o.bd}`,
                            background: o.bg,
                            color: o.fg,
                          }}
                        >
                          {o.label}
                        </button>
                      </Fragment>
                    ))}
                  </div>
                </>
              )}
              {!!qaIsTodo && (
                <>
                  <div style={{ display: "flex", gap: "6px" }}>
                    {prioOpts.map((o: any, __i47: number) => (
                      <Fragment key={__i47}>
                        <button
                          onClick={o.go}
                          style={{
                            flex: "1",
                            cursor: "pointer",
                            padding: "10px",
                            borderRadius: "12px",
                            font: "700 14px YeogiOttaeJalnan,Pretendard,sans-serif",
                            border: `1.5px solid ${o.bd}`,
                            background: "#fff",
                            color: "#15171a",
                          }}
                        >
                          {"우선순위 "}
                          {o.label}
                        </button>
                      </Fragment>
                    ))}
                  </div>
                </>
              )}
              {!!qaIsTx && (
                <>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <label
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                        font: "600 13px YeogiOttaeJalnan,Pretendard,sans-serif",
                        color: "#5b6068",
                      }}
                    >
                      금액 (원)
                      <input
                        inputMode="numeric"
                        value={qaAmtTxt}
                        onChange={setAmt}
                        placeholder="12,000"
                        style={{
                          border: "1.5px solid #dfe2e6",
                          borderRadius: "14px",
                          padding: "12px 14px",
                          font: "500 16px YeogiOttaeJalnan,Pretendard,sans-serif",
                        }}
                      />
                    </label>
                    <label
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "6px",
                        font: "600 13px YeogiOttaeJalnan,Pretendard,sans-serif",
                        color: "#5b6068",
                      }}
                    >
                      카테고리
                      <select
                        value={qaCat}
                        onChange={setCat}
                        style={{
                          border: "1.5px solid #dfe2e6",
                          borderRadius: "14px",
                          padding: "12px 14px",
                          font: "500 16px YeogiOttaeJalnan,Pretendard,sans-serif",
                          background: "#fff",
                        }}
                      >
                        {catNames.map((cn: any, __i48: number) => (
                          <Fragment key={__i48}>
                            <option value={cn}>{cn}</option>
                          </Fragment>
                        ))}
                      </select>
                    </label>
                  </div>
                </>
              )}
              {!!qaErr && (
                <>
                  <div style={{ font: "600 13px YeogiOttaeJalnan,Pretendard,sans-serif", color: "oklch(0.48 0.17 25)" }}>{qaErr}</div>
                </>
              )}
              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button
                  onClick={closeQA}
                  style={{
                    border: "0",
                    background: "#f1f2f4",
                    borderRadius: "14px",
                    padding: "12px 18px",
                    font: "700 14px YeogiOttaeJalnan,Pretendard,sans-serif",
                    cursor: "pointer",
                  }}
                >
                  취소
                </button>
                <button
                  onClick={saveQA}
                  style={{
                    border: "0",
                    background: "#15171a",
                    color: "#fff",
                    borderRadius: "14px",
                    padding: "12px 22px",
                    font: "700 14px YeogiOttaeJalnan,Pretendard,sans-serif",
                    cursor: "pointer",
                  }}
                >
                  저장
                </button>
              </div>
            </div>
          </div>
        </>
      )}
      {!!toast && (
        <>
          <div
            style={{
              position: "fixed",
              left: "50%",
              bottom: "100px",
              transform: "translateX(-50%)",
              background: "#15171a",
              color: "#fff",
              padding: "12px 20px",
              borderRadius: "999px",
              font: "600 14px YeogiOttaeJalnan,Pretendard,sans-serif",
              zIndex: "20",
              boxShadow: "0 8px 24px rgba(0,0,0,.2)",
              whiteSpace: "nowrap",
            }}
          >
            {toast}
          </div>
        </>
      )}
    </div>
  );
}
