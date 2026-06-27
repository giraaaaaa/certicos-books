import { Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import SearchPage from './pages/SearchPage';
import WishlistPage from './pages/WishlistPage';

// 공통 헤더 + 라우팅. 페이지별 콘텐츠 레이아웃(가운데 정렬·max-width)은 각 페이지에서 처리.
export default function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<SearchPage />} />
        <Route path="/wishlist" element={<WishlistPage />} />
      </Routes>
    </>
  );
}
