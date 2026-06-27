import styled from 'styled-components';

interface ResultCountProps {
  total: number;
}

// "도서 검색 결과  총 N건" — 라벨(bodyMedium) + 합계(bodyRegular, 숫자만 primary).
export function ResultCount({ total }: ResultCountProps) {
  return (
    <Wrap>
      <Label>도서 검색 결과</Label>
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
  font-size: ${({ theme }) => theme.typography.bodyMedium.size};
  font-weight: ${({ theme }) => theme.typography.bodyMedium.weight};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Total = styled.span`
  font-size: ${({ theme }) => theme.typography.bodyRegular.size};
  font-weight: ${({ theme }) => theme.typography.bodyRegular.weight};
  color: ${({ theme }) => theme.colors.text.primary};
`;

// 검색 결과 개수만 primary 강조(디자인의 파란 숫자).
const Count = styled.span`
  margin: 0 ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.palette.primary};
`;
