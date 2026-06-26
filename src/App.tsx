import { Routes, Route, NavLink } from 'react-router-dom';
import SearchPage from './pages/SearchPage';
import WishlistPage from './pages/WishlistPage';

// 라우팅 골격만 정의한다. 헤더/레이아웃 스타일은 디자인이 들어오는 Phase 1에서 styled-components로 입힌다.
export default function App() {
  return (
    <>
      <nav>
        <NavLink to="/">도서 검색</NavLink>
        {' · '}
        <NavLink to="/wishlist">내가 찜한 책</NavLink>
      </nav>
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
      </Routes>
    </>
  );
}
