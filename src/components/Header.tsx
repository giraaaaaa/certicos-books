import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

// 네비 항목을 한 곳에서 관리(추가/변경 용이). end: '/'는 정확히 일치할 때만 활성.
const NAV_ITEMS = [
  { to: '/', label: '도서 검색', end: true },
  { to: '/wishlist', label: '내가 찜한 책', end: false },
] as const;

// 공통 헤더. Figma 실측 + 비율 기준으로 배치:
// - 로고: 헤더 폭의 1/12(8.333%) 지점 (디자인 x:160 @1920), Title1 · text.primary
// - 네비: 헤더 폭의 2/5(40%) 지점에서 시작 (디자인 x:768), Body1 · text.primary, 항목 간격 56
// - 활성 탭: 텍스트 색은 유지하고 primary 밑줄만(Figma 'Active Bar', visible 토글 → 라우터 .active로 처리)
export function Header() {
  return (
    <Bar>
      <Logo to="/">CERTICOS BOOKS</Logo>
      <Nav>
        {NAV_ITEMS.map(({ to, label, end }) => (
          <NavItem key={to} to={to} end={end}>
            {label}
          </NavItem>
        ))}
      </Nav>
    </Bar>
  );
}

const Bar = styled.header`
  position: relative;
  height: 80px;
  background: ${({ theme }) => theme.colors.palette.white};
`;

// 로고: 헤더 폭의 1/12 지점, 수직 중앙. (left %가 곧 디자인 비율)
const Logo = styled(NavLink)`
  position: absolute;
  left: 8.333%; /* 1/12 — 디자인 로고 x:160 @1920 */
  top: 50%;
  transform: translateY(-50%);
  font-size: ${({ theme }) => theme.typography.title1.size};
  font-weight: ${({ theme }) => theme.typography.title1.weight};
  line-height: ${({ theme }) => theme.typography.title1.lineHeight};
  color: ${({ theme }) => theme.colors.text.primary};
`;

// 네비: 헤더 폭의 2/5 지점에서 시작, 수직 중앙.
const Nav = styled.nav`
  position: absolute;
  left: 40%; /* 2/5 — 디자인 도서검색 시작 x:768 @1920 */
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  gap: 56px; /* Figma 실측: 네비 항목 간격 */
`;

const NavItem = styled(NavLink)`
  position: relative;
  font-size: ${({ theme }) => theme.typography.body1.size};
  font-weight: ${({ theme }) => theme.typography.body1.weight};
  line-height: 1;
  color: ${({ theme }) => theme.colors.text.primary};

  /* primary 밑줄(폭 = 텍스트 폭) */
  &::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: -6px;
    height: 2px;
    background: ${({ theme }) => theme.colors.palette.primary};
    transform: scaleX(0);
    transform-origin: left center;
    opacity: 0;
    /* 사라질 때: 가로 그대로 둔 채 opacity만 페이드아웃. 폭 리셋(scaleX0)은 페이드가 끝난 뒤(0.25s)로 미뤄 안 보이게. */
    transition:
      opacity 0.25s ease,
      transform 0s ease 0.25s;
  }

  /* 나타날 때(hover 미리보기 / active 현재 페이지): 좌→우로 펴지며(scaleX) 페이드인 */
  &:hover::after,
  &.active::after {
    transform: scaleX(1);
    opacity: 1;
    transition:
      opacity 0.25s ease,
      transform 0.25s ease;
  }

  /* 모션 민감 사용자: 애니메이션 없이 즉시 표시/숨김 */
  @media (prefers-reduced-motion: reduce) {
    &::after,
    &:hover::after,
    &.active::after {
      transition: none;
    }
  }
`;
