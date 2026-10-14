/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment } from 'react';
import type { Vals } from '@/components/ui/vals';

/** 빠른 추가 모달의 탭별 입력란. 제목 입력과 저장 버튼은 모달 셸이 맡는다. */
export function TxQuickAdd({ v }: { v: Vals }) {
  const { catNames, qaAmtTxt, qaCat, setAmt, setCat } = v;
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
  );
}
