// Kakao 책 검색 API(/v3/search/book) 응답 타입 — 공식 응답 구조를 기준으로 직접 정의한다.
// (현재 placeholder 키로 진행 중. 실제 키 수령 후 1회 호출해 필드를 눈으로 재확인할 것.)

/** 검색 정렬 기준 */
export type SearchSort = 'accuracy' | 'latest';

/** 상세검색 대상 필드. person = 저자명 */
export type SearchTarget = 'title' | 'person' | 'publisher' | 'isbn';

/** 요청 쿼리 파라미터 */
export interface SearchParams {
  query: string;
  sort?: SearchSort;
  page?: number; // 1~50
  size?: number; // 1~50
  target?: SearchTarget;
}

/** 책 한 권 (documents 배열의 원소) */
export interface Book {
  title: string;
  contents: string; // 소개 일부(말줄임 형태로 옴)
  url: string; // 다음 책 상세 페이지 URL
  isbn: string; // "isbn10 isbn13" 처럼 공백으로 구분되어 옴 → 가공 시 split 필요
  datetime: string; // ISO 8601 출간일시
  authors: string[]; // 저자 복수 → lib에서 표시용 문자열로 조합
  publisher: string;
  translators: string[];
  price: number; // 정가
  sale_price: number; // 판매가. 미제공(품절 등) 시 -1 로 옴 → 분기 필요
  thumbnail: string; // 표지 이미지 URL (빈 문자열일 수 있음)
  status: string; // "정상판매" 등 판매 상태 문자열
}

/** 응답 meta */
export interface SearchMeta {
  total_count: number; // 검색된 문서 총 개수
  pageable_count: number; // 노출 가능한 문서 개수
  is_end: boolean; // 현재 페이지가 마지막인지 — 무한스크롤 종료 판정의 단일 근거
}

/** /v3/search/book 전체 응답 */
export interface SearchResponse {
  meta: SearchMeta;
  documents: Book[];
}
