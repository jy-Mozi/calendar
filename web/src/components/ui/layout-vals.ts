import type { Vals } from '@/components/ui/vals';

/** 뷰포트 너비에 따른 그리드 값. wide ≥ 1180, mid ≥ 820. */
export function layoutVals({ wide, mid }: { wide: boolean; mid: boolean }): Vals {
  return {
    homeCols: wide ? '1.15fr 1fr 1fr' : mid ? '1fr 1fr' : '1fr',
    homeAreas: wide ? '"greet greet wx" "ev td wx"' : mid ? '"greet greet" "ev td" "wx wx"' : '"greet" "wx" "ev" "td"',
    splitCols: wide ? 'minmax(0,1fr) 360px' : '1fr',
    halfCols: mid ? '1fr 1fr' : '1fr',
    boardCols: mid ? 'repeat(3,minmax(0,1fr))' : '1fr',
    setCols: mid ? '220px minmax(0,1fr)' : '1fr',
    setNavDir: mid ? 'column' : 'row',
  };
}
