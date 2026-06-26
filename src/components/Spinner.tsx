import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

// 로딩 인디케이터. 색/여백은 theme 토큰에서 가져온다(규칙 #4).
export const Spinner = styled.div`
  width: 28px;
  height: 28px;
  margin: ${({ theme }) => theme.spacing.xl} auto;
  border: 3px solid ${({ theme }) => theme.colors.palette.lightGray};
  border-top-color: ${({ theme }) => theme.colors.palette.primary};
  border-radius: ${({ theme }) => theme.radius.full};
  animation: ${spin} 0.8s linear infinite;
`;
