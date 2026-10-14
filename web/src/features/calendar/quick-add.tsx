/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment } from 'react';
import type { Vals } from '@/components/ui/vals';

/** 빠른 추가 모달의 탭별 입력란. 제목 입력과 저장 버튼은 모달 셸이 맡는다. */
export function EventQuickAdd({ v }: { v: Vals }) {
  const { evCatOpts, qaDay, qaTime, setDay, setTime } = v;
  return (
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
  );
}
