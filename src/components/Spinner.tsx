import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

// 로딩 인디케이터. 색/여백은 theme 토큰에서 가져온다.
// role=status(라이브 리전) + aria-label: 순수 CSS 스피너라 스크린리더에 안 보이므로 "로딩 중"을 알린다.
export const Spinner = styled.div.attrs({ role: 'status', 'aria-label': '로딩 중' })`
  width: 28px;
  height: 28px;
  margin: ${({ theme }) => theme.spacing.xl} auto;
  border: 3px solid ${({ theme }) => theme.colors.palette.lightGray};
  border-top-color: ${({ theme }) => theme.colors.palette.primary};
  border-radius: ${({ theme }) => theme.radius.full};
  animation: ${spin} 0.8s linear infinite;
`;
