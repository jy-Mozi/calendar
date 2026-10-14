/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment } from 'react';
import type { Vals } from '@/components/ui/vals';

export function ListView({ v }: { v: Vals }) {
  const { evCatFilters, upcoming } = v;
  return (
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
  );
}
