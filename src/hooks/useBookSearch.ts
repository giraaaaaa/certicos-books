import { useInfiniteQuery } from '@tanstack/react-query';
import { searchBooks } from '../api/books';
import type { SearchSort, SearchTarget } from '../types';

const PAGE_SIZE = 10;

interface UseBookSearchParams {
  query: string;
  sort?: SearchSort;
  target?: SearchTarget;
}

// 서버 상태 전용 훅 — 검색 결과 페이지네이션을 useInfiniteQuery로 관리한다(규칙 #3).
export function useBookSearch({ query, sort = 'accuracy', target }: UseBookSearchParams) {
  const trimmed = query.trim();

  return useInfiniteQuery({
    // 검색 조건을 키에 포함 → 조건이 바뀌면 캐시가 분리되고 자동으로 다시 가져온다.
    // size도 응답에 영향을 주므로 키에 포함(지금은 상수지만, 변경 시 다른 size 캐시가 섞이는 것 방지).
    queryKey: ['books', { query: trimmed, sort, target, size: PAGE_SIZE }],
    queryFn: ({ pageParam }) =>
      searchBooks({ query: trimmed, sort, target, page: pageParam, size: PAGE_SIZE }),
    initialPageParam: 1,
    // 다음 페이지 존재 여부는 응답 meta.is_end로만 판정한다.
    // 끝이면 undefined(=더 없음), 아니면 다음 페이지 번호(=지금까지 받은 페이지 수 + 1).
    getNextPageParam: (lastPage, allPages) =>
      lastPage.meta.is_end ? undefined : allPages.length + 1,
    // 빈 검색어로는 호출하지 않는다(불필요한 요청 방지).
    enabled: trimmed.length > 0,
  });
}
