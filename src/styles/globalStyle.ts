import { createGlobalStyle } from 'styled-components';

// 전역 리셋 + 기본 타이포/배경. 값은 전부 theme 토큰에서 가져온다.
export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after { box-sizing: border-box; }
  * { margin: 0; padding: 0; }
  html, body, #root { height: 100%; }
  body {
    min-width: 800px; /* 하이브리드 하한 — 그 아래는 가로 스크롤(데스크탑 레이아웃 보존) */
    font-family: ${({ theme }) => theme.fonts.sans};
    color: ${({ theme }) => theme.colors.text.primary};
    background: ${({ theme }) => theme.colors.palette.white};
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
  a { color: inherit; text-decoration: none; }
  button { font-family: inherit; cursor: pointer; border: none; background: none; padding: 0; }
  ul, ol, li { list-style: none; }
  img { display: block; max-width: 100%; }
`;
