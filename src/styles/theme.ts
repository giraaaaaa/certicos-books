// 디자인 토큰 단일 출처(Single Source of Truth).
// 컴포넌트에서 색/폰트/여백을 하드코딩하지 않고(규칙 #4) 전부 이 토큰을 참조한다.
export const theme = {
  fonts: {
    // Figma 디자인 시스템 폰트. Noto Sans KR(웹폰트, index.html에서 로드) + 시스템 폴백.
    sans: "'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Segoe UI', Roboto, sans-serif",
  },
  // Figma 'Color' 스타일과 1:1 매핑 — Palette(브랜드/중립색) + Text(글자색).
  colors: {
    palette: {
      primary: '#4880EE', // 강조 · 검색 버튼 · 링크
      red: '#E84118', // 찜(하트) 활성
      gray: '#DADADA', // 보더 · 구분선
      lightGray: '#F2F4F6', // 입력 · 카드 배경
      white: '#FFFFFF',
      black: '#222222',
    },
    text: {
      primary: '#353C49',
      secondary: '#6D7582',
      subtitle: '#8D94A0',
    },
  },
  // Figma 텍스트 스타일과 1:1 매핑(이름·값 동일). 전부 Noto Sans KR, weight 500/700.
  typography: {
    title1: { size: '24px', weight: 700, lineHeight: '24px' },
    title2: { size: '22px', weight: 700, lineHeight: '24px' },
    title3: { size: '18px', weight: 700, lineHeight: '18px' },
    body1: { size: '20px', weight: 500, lineHeight: '20px' },
    body2: { size: '14px', weight: 500, lineHeight: '14px' },
    body2Bold: { size: '14px', weight: 700, lineHeight: '14px' },
    caption: { size: '16px', weight: 500, lineHeight: '16px' },
    small: { size: '10px', weight: 500, lineHeight: '10px' },
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '40px',
    xxl: '64px',
  },
  radius: {
    sm: '8px',
    md: '16px',
    full: '9999px',
  },
  layout: {
    maxWidth: '960px', // 콘텐츠 최대 폭(가운데 정렬)
  },
} as const;

// theme 객체의 리터럴 타입을 그대로 추출 → styled.d.ts에서 DefaultTheme에 주입한다.
export type AppTheme = typeof theme;
