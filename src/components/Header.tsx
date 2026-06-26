import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

// 모든 페이지 공통 헤더 — 좌측 로고 + 중앙 네비. 활성 탭은 primary 색 + 밑줄.
export function Header() {
  return (
    <Bar>
      <Logo to="/">CERTICOS BOOKS</Logo>
      <Nav>
        {/* end: '/' 는 정확히 일치할 때만 활성(하위 경로에 물들지 않게) */}
        <NavItem to="/" end>
          도서 검색
        </NavItem>
        <NavItem to="/wishlist">내가 찜한 책</NavItem>
      </Nav>
    </Bar>
  );
}

const Bar = styled.header`
  position: relative;
  display: flex;
  align-items: center;
  height: 80px;
  padding: 0 ${({ theme }) => theme.spacing.xl};
`;

const Logo = styled(NavLink)`
  font-size: ${({ theme }) => theme.typography.title1.size};
  font-weight: ${({ theme }) => theme.typography.title1.weight};
  color: ${({ theme }) => theme.colors.palette.primary};
  letter-spacing: -0.4px;
`;

// 로고는 왼쪽 끝, 네비는 화면 정중앙에 고정한다(절대중앙 정렬).
const Nav = styled.nav`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const NavItem = styled(NavLink)`
  font-size: ${({ theme }) => theme.typography.title3.size};
  font-weight: ${({ theme }) => theme.typography.title3.weight};
  color: ${({ theme }) => theme.colors.text.secondary};
  padding-bottom: ${({ theme }) => theme.spacing.xs};
  border-bottom: 2px solid transparent;

  &.active {
    color: ${({ theme }) => theme.colors.palette.primary};
    border-bottom-color: ${({ theme }) => theme.colors.palette.primary};
  }
`;
