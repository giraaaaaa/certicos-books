import { useMemo, useState } from 'react';
import styled from 'styled-components';
import { PageContainer } from '../components/Layout';
import { SearchBar } from '../components/SearchBar';
import { ResultCount } from '../components/ResultCount';
import { EmptyState } from '../components/EmptyState';
import { BookList } from '../components/BookList';
import { Spinner } from '../components/Spinner';
import { useBookSearch } from '../hooks/useBookSearch';
import { getBookKey } from '../lib/format';
import type { BookSearchInput } from '../types';

// 도서 검색 화면. 검색 전(빈 검색어)엔 "총 0건" + 빈 상태(= Figma 18:969). 검색하면 결과 리스트.
// 제출된 검색 조건(검색어 + 상세검색 대상)만 로컬 상태로 들고, 서버 상태(결과)는 useBookSearch(React Query)가 전담.
export default function SearchPage() {
  const [search, setSearch] = useState<BookSearchInput>({ query: '' });
  const { data, isLoading, isError, hasNextPage, isFetchingNextPage, fetchNextPage } =
    useBookSearch(search);

  // 페이지 경계에서 동일 도서가 중복될 수 있어(오프셋 페이지네이션) key 충돌 방지로 dedupe.
  const books = useMemo(() => {
    const seen = new Set<string>();
    return (data?.pages.flatMap((page) => page.documents) ?? []).filter((book) => {
      const key = getBookKey(book);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [data]);

  const total = data?.pages[0]?.meta.total_count ?? 0;

  return (
    <PageContainer>
      <Title>도서 검색</Title>
      <SearchArea>
        <SearchBar onSearch={setSearch} />
      </SearchArea>
      <ResultCount total={total} />

      {/* 결과가 있으면 항상 리스트 표시 — 다음 페이지 로딩/에러가 이미 받은 결과를 덮지 않게 */}
      {books.length > 0 ? (
        <BookList
          books={books}
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          onLoadMore={() => void fetchNextPage()}
        />
      ) : isLoading ? (
        <Spinner />
      ) : isError ? (
        <EmptyState message="오류가 발생했어요. 잠시 후 다시 시도해 주세요." />
      ) : (
        <EmptyState />
      )}
    </PageContainer>
  );
}

const Title = styled.h2`
  font-size: ${({ theme }) => theme.typography.title2.size};
  font-weight: ${({ theme }) => theme.typography.title2.weight};
  line-height: ${({ theme }) => theme.typography.title2.lineHeight};
  color: ${({ theme }) => theme.colors.text.title};
`;

const SearchArea = styled.div`
  margin: ${({ theme }) => theme.spacing.md} 0 ${({ theme }) => theme.spacing.lg};
`;
