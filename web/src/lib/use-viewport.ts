'use client';
import { useEffect, useState } from 'react';

/** 반응형 기준: wide ≥ 1180, mid ≥ 820, 최소 360. 서버 렌더링 때는 데스크톱(1280)으로 가정한다. */
export function useViewport() {
  const [w, setW] = useState(1280);
  useEffect(() => {
    const on = () => setW(window.innerWidth);
    on();
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, []);
  return { w, wide: w >= 1180, mid: w >= 820 };
}
