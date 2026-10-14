export type SearchKind = '일정' | '할일' | '거래';
export type SearchType = '전체' | SearchKind;

export type SearchResult = {
  kind: SearchKind;
  title: string;
  sub: string;
  /** 거래 금액 등 오른쪽 표시 */
  right: string;
  /** 눌렀을 때 이동할 경로 */
  href: string;
};

export interface SearchApi {
  search(query: string): Promise<SearchResult[]>;
}
