import styled from 'styled-components';
import { typo } from '../styles/mixins';
import { PageContainer } from '../components/Layout';
import { ResultCount } from '../components/ResultCount';
import { EmptyState } from '../components/EmptyState';
import { BookList } from '../components/BookList';
import { useWishlistStore } from '../store/wishlistStore';

// 내가 찜한 책. 서버 호출 없이 wishlistStore(localStorage)의 '찜 시점 스냅샷'을 그대로 렌더한다.
// 카드의 하트를 다시 누르면 해제되어 목록에서 사라진다(토글 = 스토어에서 제거).
export default function WishlistPage() {
  const items = useWishlistStore((s) => s.items);

  return (
    <PageContainer>
      <Title>내가 찜한 책</Title>
      <ResultCount total={items.length} label="찜한 책" />

      {items.length === 0 ? (
        <EmptyState message="찜한 책이 없어요." />
      ) : (
        <BookList books={items} />
      )}
    </PageContainer>
  );
}

const Title = styled.h2`
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  ${typo('title2')}
  color: ${({ theme }) => theme.colors.text.title};
`;
