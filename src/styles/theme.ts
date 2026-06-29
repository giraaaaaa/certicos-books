// 디자인 토큰 단일 출처(Single Source of Truth).
// 컴포넌트에서 색/폰트/여백을 하드코딩하지 않고 전부 이 토큰을 참조한다.
export const theme = {
  fonts: {
    // Figma 디자인 시스템 폰트. Noto Sans KR(웹폰트, index.html에서 로드) + 시스템 폴백.
    sans: "'Noto Sans KR', -apple-system, BlinkMacSystemFont, 'Apple SD Gothic Neo', 'Segoe UI', Roboto, sans-serif",
  },
  // Figma 'Color' 스타일과 1:1 매핑 — Palette · Text · UI.
  // (파일 전체 스캔 기준. Style 가이드 프레임엔 Text/Title·UI/Gray가 안 그려져 있어 처음에 누락했었음)
  colors: {
    palette: {
      primary: '#4880EE', // 강조 · 검색 버튼 · 링크
      red: '#E84118', // 찜(하트) 활성
      gray: '#DADADA', // 보더 · 구분선
      lightGray: '#F2F4F6', // 입력 · 카드 배경
      white: '#FFFFFF',
      black: '#222222',
      divider: '#D2D6DA', // 카드 구분선(리스트 아이템 하단 보더)
    },
    text: {
      title: '#1A1E27', // Text/Title — 페이지 제목/헤딩
      primary: '#353C49', // Text/Primary(=Text/Default) — 본문 기본
      secondary: '#6D7582', // Text/Secondary
      subtitle: '#8D94A0', // Text/Subtitle — placeholder · 보조 라벨
    },
    ui: {
      gray: '#B1B8C0', // UI/Gray — 셰브론 등 UI 보조
    },
  },
  typography: {
    // ───────── (A) 공식 가이드 8종 — Figma 'Typography' 스타일가이드 프레임과 1:1 ─────────
    // 전부 Noto Sans KR, weight 500/700. 가이드에 정식 정의가 존재하는 신뢰 가능한 스타일.
    title1: { size: '24px', weight: 700, lineHeight: '24px' },
    title2: { size: '22px', weight: 700, lineHeight: '24px' },
    title3: { size: '18px', weight: 700, lineHeight: '18px' },
    body1: { size: '20px', weight: 500, lineHeight: '20px' },
    body2: { size: '14px', weight: 500, lineHeight: '14px' },
    body2Bold: { size: '14px', weight: 700, lineHeight: '14px' },
    caption: { size: '16px', weight: 500, lineHeight: '16px' },
    small: { size: '10px', weight: 500, lineHeight: '10px' },

    // ───────── (B) 컴포넌트 파생 — Figma 정식 named 스타일이나 가이드 프레임엔 미문서화 ─────────
    // 4종 모두 Figma 텍스트 스타일(Body/Medium·Caption/Medium·H3/Bold·Tiny/Medium)로 정의돼 컴포넌트에
    // 적용돼 있고, 값도 Figma CSS로 1:1 확인 완료(✅). 단 'Typography' 스타일가이드 프레임엔 빠져 있어
    // — 디자이너에게 필요한 건 '스타일 생성'이 아니라 '가이드 프레임 문서화 등재'. → 상세: DECISIONS.md.
    bodyMedium: { size: '16px', weight: 500, lineHeight: '24px' }, //  Body/Medium ✅ — "도서 검색 결과" 라벨 + "총 N건"
    captionMedium: { size: '14px', weight: 500, lineHeight: '22px' }, // Caption/Medium ✅ — 펼친 카드 저자·sm버튼·팝업 입력
    h3Bold: { size: '18px', weight: 700, lineHeight: '26px' }, //      H3/Bold ✅ — 펼친 카드 제목·가격(color Text/Primary)
    tinyMedium: { size: '10px', weight: 500, lineHeight: '22px' }, //   Tiny/Medium ✅ — 가격 라벨 원가/할인가(color Text/Subtitle, 우측정렬)
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
  // 그림자 토큰 — 컴포넌트에 raw rgba를 흩뿌리지 않고 한곳에서 관리.
  shadows: {
    popover: '0px 4px 14px 6px rgba(151, 151, 151, 0.15)', // 상세검색 팝업
    dropdown: '0px 0px 4px rgba(0, 0, 0, 0.25)', // 셀렉트 옵션 등 작은 메뉴
  },
  // z-index 스케일 — 매직넘버 대신 의미별 레이어로 관리(겹침 충돌 방지).
  zIndex: {
    raised: 5, // 로컬 스택(예: 팝업 내부 옵션)
    dropdown: 10, // 검색 기록 드롭다운
    popover: 20, // 상세검색 팝업
  },
  layout: {
    maxWidth: '960px', // 콘텐츠 최대 폭(가운데 정렬)
  },
} as const;

// theme 객체의 리터럴 타입을 그대로 추출 → styled.d.ts에서 DefaultTheme에 주입한다.
export type AppTheme = typeof theme;
