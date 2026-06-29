import styled from 'styled-components';
import { typo } from '../styles/mixins';

interface ResultCountProps {
  total: number;
  label?: string;
}

// "[label]  총 N건" — 라벨·합계 모두 bodyMedium(16/500/24), 숫자만 primary. 검색/찜 목록 공용.
export function ResultCount({ total, label = '도서 검색 결과' }: ResultCountProps) {
  return (
    <Wrap>
      <Label>{label}</Label>
      <Total>
        총 <Count>{total.toLocaleString('ko-KR')}</Count>건
      </Total>
    </Wrap>
  );
}

const Wrap = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: 36px; /* Figma: 검색 결과 ↔ 리스트 36 */
`;

const Label = styled.span`
  ${typo('bodyMedium')}
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Total = styled.span`
  ${typo('bodyMedium')}
  color: ${({ theme }) => theme.colors.text.primary};
`;

// 검색 결과 개수만 primary 강조(디자인의 파란 숫자).
const Count = styled.span`
  margin: 0 ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.palette.primary};
`;
