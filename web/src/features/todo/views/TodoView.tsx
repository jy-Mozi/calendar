/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment } from 'react';
import type { Vals } from '@/components/ui/vals';

export function TodoView({ v }: { v: Vals }) {
  const { addTodo, board, boardCols, isTodoBoard, isTodoList, projects, todoEmpty, todoFilters, todoList } = v;
  return (
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
  );
}
