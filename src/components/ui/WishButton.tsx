import styled from 'styled-components';
import type { Book } from '../../types';
import { getBookKey } from '../../lib/format';
import { useWishlistStore } from '../../store/wishlistStore';
import { HeartIcon } from '../icons';

interface WishButtonProps {
  book: Book;
  /** 하트 크기(px) — 접힘 카드 16, 펼침 카드 24. */
  size?: number;
  /** 위치 등 외부 스타일 주입용(styled(WishButton)). */
  className?: string;
}

// 찜 토글 버튼 — 찜 여부 구독 + 토글 + 하트(채움/색) + 접근성을 한곳에 캡슐화.
// 이 컴포넌트만 wishlistStore에 의존 → BookCard 등 소비처는 store를 몰라도 됨(결합도↓·재사용↑).
export function WishButton({ book, size = 16, className }: WishButtonProps) {
  const key = getBookKey(book);
  // '이 책'의 찜 여부(boolean)만 구독 → 다른 책을 찜/해제해도 이 버튼은 리렌더 안 됨(성능).
  const wished = useWishlistStore((s) => s.items.some((b) => getBookKey(b) === key));
  const toggle = useWishlistStore((s) => s.toggle);

  return (
    <HeartButton
      type="button"
      className={className}
      onClick={() => toggle(book)}
      aria-pressed={wished}
      aria-label={wished ? '찜 해제' : '찜하기'}
      $wished={wished}
    >
      <HeartIcon size={size} filled={wished} />
    </HeartButton>
  );
}

// 찜 = 빨강 채운 하트(#E84118), 비찜 = 흰색 외곽선(Figma Unlike). 색은 currentColor로 전달.
const HeartButton = styled.button<{ $wished: boolean }>`
  display: flex;
  color: ${({ $wished, theme }) =>
    $wished ? theme.colors.palette.red : theme.colors.palette.white};
`;
