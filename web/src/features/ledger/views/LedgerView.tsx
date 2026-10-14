/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment } from 'react';
import type { Vals } from '@/components/ui/vals';

export function LedgerView({ v }: { v: Vals }) {
  const { accounts, addTx, balanceTxt, budgetPct, budgetTotalTxt, budgets, catShare, donut, dows, expenseShort, expenseTxt, halfCols, incomeTxt, isLgAssets, isLgBudget, isLgCal, isLgRec, isLgStats, isLgTx, lgCells, momColor, momTxt, netWorthTxt, recTotalTxt, recurring, trend, txFilters, txList, txSumTxt } = v;
  return (
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
  );
}
