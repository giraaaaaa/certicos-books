import styled from 'styled-components';
import type { Book } from '../types';
import { BookCard } from './BookCard';
import { Spinner } from './Spinner';
import { getBookKey } from '../lib/format';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

interface BookListProps {
  books: Book[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
}

// 무한스크롤: 마지막 센티넬이 뷰포트에 들어오면 다음 페이지 로드.
// (더보기 버튼/페이지네이션으로 바꾸려면 sentinel 부분만 교체하면 됨 — 로드 방식과 표시를 분리)
export function BookList({ books, hasNextPage, isFetchingNextPage, onLoadMore }: BookListProps) {
  const sentinelRef = useIntersectionObserver<HTMLDivElement>(onLoadMore, {
    enabled: hasNextPage && !isFetchingNextPage,
  });

  return (
    <List>
      {books.map((book, index) => (
        // isbn 중복 가능성 대비 index 보강(append-only 리스트라 안전)
        <BookCard key={`${getBookKey(book)}-${index}`} book={book} />
      ))}
      <div ref={sentinelRef} aria-hidden />
      {isFetchingNextPage && <Spinner />}
    </List>
  );
}

const List = styled.ul`
  display: flex;
  flex-direction: column;
`;
