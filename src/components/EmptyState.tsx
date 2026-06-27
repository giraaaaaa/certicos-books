import styled from 'styled-components';
import emptyBook from '../assets/empty-book.png';

interface EmptyStateProps {
  message?: string;
}

// 결과 없음/초기 상태. Figma 빈 상태: 책 일러스트(80) + 안내문(Caption, secondary), 가운데.
export function EmptyState({ message = '검색된 결과가 없습니다.' }: EmptyStateProps) {
  return (
    <Wrap>
      <img src={emptyBook} width={80} height={80} alt="" />
      <Message>{message}</Message>
    </Wrap>
  );
}

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-top: 120px; /* Figma: 카운트 아래 빈 상태 여백 */
`;

const Message = styled.p`
  font-size: ${({ theme }) => theme.typography.caption.size};
  font-weight: ${({ theme }) => theme.typography.caption.weight};
  color: ${({ theme }) => theme.colors.text.secondary};
`;
