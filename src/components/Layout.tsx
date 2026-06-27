import styled from 'styled-components';

// 페이지 공통 콘텐츠 컨테이너 — Figma 콘텐츠 폭 960, 가운데 정렬.
// (전역 하한 min-width는 GlobalStyle에서 처리 → 그 아래는 가로 스크롤)
export const PageContainer = styled.main`
  max-width: ${({ theme }) => theme.layout.maxWidth};
  margin: 0 auto;
  padding: 80px ${({ theme }) => theme.spacing.lg} ${({ theme }) => theme.spacing.xxl};
`;
