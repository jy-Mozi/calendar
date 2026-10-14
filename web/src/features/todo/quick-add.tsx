/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment } from 'react';
import type { Vals } from '@/components/ui/vals';

/** 빠른 추가 모달의 탭별 입력란. 제목 입력과 저장 버튼은 모달 셸이 맡는다. */
export function TodoQuickAdd({ v }: { v: Vals }) {
  const { prioOpts } = v;
  return (
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
  );
}
