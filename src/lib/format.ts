import type { Book } from '../types';

// 가격을 "13,500원" 형태로. 천 단위 콤마는 toLocaleString에 위임한다.
export function formatPrice(price: number): string {
  return `${price.toLocaleString('ko-KR')}원`;
}

// 저자 배열을 표시용 문자열로 조합. 비어 있으면 '저자 미상', 여러 명은 콤마로 잇는다.
export function formatAuthors(authors: string[]): string {
  if (authors.length === 0) return '저자 미상';
  return authors.join(', ');
}

// 리스트 key·찜 식별자로 쓸 안정적 ID.
// isbn은 "isbn10 isbn13"처럼 공백으로 와서 마지막(보통 isbn13)을 쓰고, 없으면 상세 URL로 대체한다.
export function getBookKey(book: Book): string {
  const isbns = book.isbn.trim().split(' ').filter(Boolean);
  return isbns[isbns.length - 1] ?? book.url;
}
