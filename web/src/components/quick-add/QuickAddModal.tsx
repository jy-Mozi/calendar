/* eslint-disable @typescript-eslint/no-explicit-any */
import { Fragment } from 'react';
import type { Vals } from '@/components/ui/vals';
import { EventQuickAdd } from '@/features/calendar/quick-add';
import { TodoQuickAdd } from '@/features/todo/quick-add';
import { TxQuickAdd } from '@/features/ledger/quick-add';

export function QuickAddModal({ v }: { v: Vals }) {
  const { qaOpen, closeQA, qaErr, qaIsEvent, qaIsTodo, qaIsTx, qaKey, qaPh, qaTitle, qaTitleLabel, qaTypes, saveQA, setTitle, stop } = v;
  if (!qaOpen) return null;
  return (
        <>
          <div
            onClick={closeQA}
            style={{
              position: "fixed",
              inset: "0",
              background: "rgba(21,23,26,.35)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "20px",
              zIndex: "10",
            }}
          >
            <div
              onClick={stop}
              style={{
                background: "#fff",
                borderRadius: "28px",
                padding: "28px",
                width: "100%",
                maxWidth: "440px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
                boxShadow: "0 20px 60px rgba(0,0,0,.2)",
              }}
            >
              <div style={{ font: "400 20px YeogiOttaeJalnan,Pretendard,sans-serif" }}>빠른 추가</div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr",
                  gap: "4px",
                  background: "#f1f2f4",
                  padding: "4px",
                  borderRadius: "999px",
                }}
              >
                {qaTypes.map((q: any, __i45: number) => (
                  <Fragment key={__i45}>
                    <button
                      onClick={q.go}
                      style={{
                        border: "0",
                        cursor: "pointer",
                        padding: "9px",
                        borderRadius: "999px",
                        font: "700 14px YeogiOttaeJalnan,Pretendard,sans-serif",
                        background: q.bg,
                        color: q.fg,
                      }}
                    >
                      {q.label}
                    </button>
                  </Fragment>
                ))}
              </div>
              <label
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  font: "600 13px YeogiOttaeJalnan,Pretendard,sans-serif",
                  color: "#5b6068",
                }}
              >
                {qaTitleLabel}
                <input
                  autoFocus={true}
                  value={qaTitle}
                  onChange={setTitle}
                  onKeyDown={qaKey}
                  placeholder={qaPh}
                  style={{
                    border: "1.5px solid #dfe2e6",
                    borderRadius: "14px",
                    padding: "12px 14px",
                    font: "500 16px YeogiOttaeJalnan,Pretendard,sans-serif",
                    color: "#15171a",
                    outline: "none",
                  }}
                />
              </label>
              {!!qaIsEvent && <EventQuickAdd v={v} />}
              {!!qaIsTodo && <TodoQuickAdd v={v} />}
              {!!qaIsTx && <TxQuickAdd v={v} />}
              {!!qaErr && (
                <>
                  <div style={{ font: "600 13px YeogiOttaeJalnan,Pretendard,sans-serif", color: "oklch(0.48 0.17 25)" }}>{qaErr}</div>
                </>
              )}
              <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
                <button
                  onClick={closeQA}
                  style={{
                    border: "0",
                    background: "#f1f2f4",
                    borderRadius: "14px",
                    padding: "12px 18px",
                    font: "700 14px YeogiOttaeJalnan,Pretendard,sans-serif",
                    cursor: "pointer",
                  }}
                >
                  취소
                </button>
                <button
                  onClick={saveQA}
                  style={{
                    border: "0",
                    background: "#15171a",
                    color: "#fff",
                    borderRadius: "14px",
                    padding: "12px 22px",
                    font: "700 14px YeogiOttaeJalnan,Pretendard,sans-serif",
                    cursor: "pointer",
                  }}
                >
                  저장
                </button>
              </div>
            </div>
          </div>
        </>
  );
}
