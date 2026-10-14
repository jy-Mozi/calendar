/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment } from 'react';
import type { Vals } from '@/components/ui/vals';

export function WeekView({ v }: { v: Vals }) {
  const { hours, weekDays } = v;
  return (
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
  );
}
