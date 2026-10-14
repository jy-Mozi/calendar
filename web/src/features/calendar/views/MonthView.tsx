/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment } from 'react';
import type { Vals } from '@/components/ui/vals';

export function MonthView({ v }: { v: Vals }) {
  const { addEventSel, cells, dows, goToday, overlays, selDay, selDow, selEmpty, selEvents, selWx, splitCols } = v;
  return (
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
  );
}
