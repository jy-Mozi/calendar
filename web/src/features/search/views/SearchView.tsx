/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment } from 'react';
import type { Vals } from '@/components/ui/vals';

export function SearchView({ v }: { v: Vals }) {
  const { hasResults, noResults, q, qEmpty, results, searchFilters, setQ, suggestions } = v;
  return (
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
  );
}
