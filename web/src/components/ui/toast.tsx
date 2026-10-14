'use client';
import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { setErrorNotifier } from '@/lib/query';

const Ctx = createContext<(msg: string) => void>(() => {});
export const useToast = () => useContext(Ctx);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [msg, setMsg] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const flash = useCallback((m: string) => {
    clearTimeout(timer.current);
    setMsg(m);
    timer.current = setTimeout(() => setMsg(''), 2200);
  }, []);
  useEffect(() => {
    setErrorNotifier(flash);
    return () => clearTimeout(timer.current);
  }, [flash]);
  return (
    <Ctx.Provider value={flash}>
      {children}
      {!!msg && (
        <div
          role="status"
          style={{ position: 'fixed', left: '50%', bottom: '100px', transform: 'translateX(-50%)', background: '#15171a', color: '#fff', padding: '12px 20px', borderRadius: '999px', font: '600 14px YeogiOttaeJalnan,Pretendard,sans-serif', zIndex: 20, boxShadow: '0 8px 24px rgba(0,0,0,.2)', whiteSpace: 'nowrap' }}
        >
          {msg}
        </div>
      )}
    </Ctx.Provider>
  );
}
