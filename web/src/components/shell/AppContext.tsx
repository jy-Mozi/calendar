'use client';
import { createContext, useContext } from 'react';
import type { QuickAddType } from '@/components/quick-add/types';

export type AppContextValue = {
  /** 날씨 기준 도시 */
  city: string;
  /** 0=일요일, 1=월요일 */
  weekStart: 0 | 1;
  /** 빠른 추가 모달 열기 */
  openQuickAdd: (type?: QuickAddType, extra?: { day?: number }) => void;
};

const Ctx = createContext<AppContextValue>({ city: '서울', weekStart: 0, openQuickAdd: () => {} });

export const AppProvider = Ctx.Provider;
export const useApp = () => useContext(Ctx);
