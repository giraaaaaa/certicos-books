import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Book } from '../types';
import { getBookKey } from '../lib/format';

// 찜 목록 — '찜한 시점의 Book 스냅샷'을 그대로 저장한다.
// ID만 저장하면 표시할 때 API 재조회가 필요하고, 그 사이 가격/판매상태가 바뀌면 찜 당시와 달라진다.
// → 스냅샷을 들고 있으면 재조회 없이 '찜한 그 순간'의 데이터를 일관되게 보여줄 수 있다.
// persist(localStorage)로 새로고침·브라우저 재시작 후에도 유지.
interface WishlistState {
  items: Book[]; // 최신 찜이 앞(prepend)
  toggle: (book: Book) => void; // 이미 있으면 해제, 없으면 추가(스냅샷)
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set) => ({
      items: [],
      toggle: (book) =>
        set((s) => {
          const key = getBookKey(book);
          const exists = s.items.some((b) => getBookKey(b) === key);
          return exists
            ? { items: s.items.filter((b) => getBookKey(b) !== key) }
            : { items: [book, ...s.items] };
        }),
    }),
    { name: 'cdri-wishlist' },
  ),
);
