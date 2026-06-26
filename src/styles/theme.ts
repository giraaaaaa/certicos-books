// 디자인 토큰 단일 출처(Single Source of Truth).
// 컴포넌트에서 색/폰트/여백을 하드코딩하지 않고(규칙 #4) 전부 이 토큰을 참조한다.
export const theme = {
  colors: {
    primary: '#4880EE', // 강조 · 검색 버튼 · 링크
    red: '#E84C3D', // 찜(하트) 활성 색
    text: {
      primary: '#1A1E27',
      secondary: '#6D7582',
      subtitle: '#8D95A0',
      caption: '#B1B8C0',
    },
    border: '#D2D6DA',
    background: '#FFFFFF',
    surface: '#F2F4F6', // 카드 · 입력 배경
  },
  // size/weight/lineHeight를 한 묶음으로 둬서 타이포를 토큰 단위로 일관 적용한다.
  typography: {
    title: { size: '24px', weight: 700, lineHeight: '32px' },
    title2: { size: '18px', weight: 700, lineHeight: '26px' },
    body: { size: '16px', weight: 500, lineHeight: '24px' },
    body2: { size: '14px', weight: 500, lineHeight: '22px' },
    caption: { size: '12px', weight: 500, lineHeight: '18px' },
    small: { size: '10px', weight: 500, lineHeight: '14px' },
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
