# CDRI Books

카카오(다음) 책 검색 API 기반 도서 검색 SPA.

> 🚧 진행 중 — **Phase 0(셋업) 완료**. 전체 README는 Phase 3에서 정리합니다.

## 스택

- **Vite + React + TypeScript**
- **@tanstack/react-query** — 서버 상태 / 무한스크롤
- **zustand (+ persist)** — 찜 목록(클라이언트 영속 상태)
- **styled-components** — theme 토큰 기반 스타일
- **react-router-dom** — 라우팅(검색 / 찜)

## 실행

```bash
npm install
cp .env.example .env   # 그리고 VITE_KAKAO_KEY에 본인 키 입력
npm run dev
```

### 환경변수

| 변수 | 설명 |
| --- | --- |
| `VITE_KAKAO_KEY` | Kakao REST API 키 ([발급](https://developers.kakao.com)). `.env`에만 두며 git에 커밋되지 않습니다. |

## 폴더 구조

```
src/
  api/        # kakao client(axios) + 엔드포인트
  types/      # Book, SearchResponse, SearchMeta ...
  hooks/      # useBookSearch, useDebounce, useIntersection (Phase 1~)
  store/      # wishlistStore (zustand + persist) (Phase 2~)
  lib/        # 순수 함수: 가격 포맷, 저자 조합, 빈값/상태 분기
  components/ # SearchBar, BookCard, BookList, EmptyState ...
  pages/      # SearchPage, WishlistPage
  styles/     # theme, GlobalStyle
```

설계 결정 로그는 [DECISIONS.md](./DECISIONS.md) 를 참고하세요.
