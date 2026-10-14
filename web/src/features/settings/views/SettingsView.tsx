/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment } from 'react';
import type { Vals } from '@/components/ui/vals';

export function SettingsView({ v }: { v: Vals }) {
  const { catGroups, cities, evCount, exportCsv, exportJson, gcalBtn, gcalBtnBg, gcalBtnFg, gcalOn, gcalStatus, gcals, isSetBackup, isSetCat, isSetInt, isSetNoti, isSetProfile, isSetView, issueToken, mcpLogs, newToken, notis, scopeOpts, setCols, setNav, setNavDir, tdCount, toggleGcal, tokens, txCount, viewOpts } = v;
  return (
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
  );
}
