import { kakaoClient } from './client';
import type { SearchParams, SearchResponse } from '../types';

// 책 검색 엔드포인트 호출만 담당한다. 응답 가공은 lib/의 순수 함수가 맡는다(규칙 #2).
export async function searchBooks(params: SearchParams): Promise<SearchResponse> {
  const { data } = await kakaoClient.get<SearchResponse>('/v3/search/book', { params });
  return data;
}
