import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SearchHistoryState {
  history: string[];
  add: (term: string) => void;
  remove: (term: string) => void;
  clear: () => void;
}

const MAX_HISTORY = 8;

// 검색 기록 = 클라이언트 영속 상태. persist 미들웨어가 localStorage에 저장 → 브라우저 재시작 후에도 유지.
// 서버 상태(검색 결과)는 React Query가 전담 → 여기서는 절대 안 섞음(규칙 #3).
export const useSearchHistoryStore = create<SearchHistoryState>()(
  persist(
    (set) => ({
      history: [],
      // 중복 제거 후 맨 앞에 추가하고 최대 8개로 자른다(초과분 = 가장 오래된 것부터 사라짐, FIFO).
      add: (term) =>
        set((state) => {
          const t = term.trim();
          if (!t) return state;
          const history = [t, ...state.history.filter((h) => h !== t)].slice(0, MAX_HISTORY);
          return { history };
        }),
      remove: (term) => set((state) => ({ history: state.history.filter((h) => h !== term) })),
      clear: () => set({ history: [] }),
    }),
    { name: 'cdri-search-history' },
  ),
);
