# CERTICOS BOOKS

카카오(다음) 책 검색 API 기반 **도서 검색 SPA**. 책을 검색하고, 상세 정보를 펼쳐 보고, 마음에 드는 책을 찜할 수 있습니다.

## 주요 기능

- **도서 검색** — 검색어로 책을 찾아 카드 리스트로 표시
- **무한 스크롤** — 리스트 끝에서 다음 페이지 자동 로드 (IntersectionObserver)
- **최근 검색어** — 입력창 포커스 시 최근 검색어(최대 8개) 드롭다운, 클릭 재검색·개별 삭제
- **상세 검색** — 제목 / 저자명 / 출판사 대상을 골라 정밀 검색
- **도서 상세** — 카드를 펼쳐 표지·소개·가격(정가/할인가) 표시
- **찜** — 하트로 찜/해제, '내가 찜한 책' 페이지에서 모아 보기 (브라우저 재시작 후에도 유지)

## 기술 스택

| 영역 | 선택 |
| --- | --- |
| 빌드 / 언어 | Vite 8 · React 19 · TypeScript 6 |
| 서버 상태 | @tanstack/react-query 5 (`useInfiniteQuery`) |
| 클라이언트 영속 상태 | zustand 5 + persist (검색기록 · 찜) |
| 스타일 | styled-components 6 (theme 토큰) |
| 라우팅 | react-router-dom 7 |
| HTTP | axios |
| 린트 | oxlint |

## 실행 방법

```bash
npm install
cp .env.example .env      # VITE_KAKAO_KEY 에 본인 Kakao REST API 키 입력
npm run dev               # 개발 서버
```

| 스크립트 | 설명 |
| --- | --- |
| `npm run dev` | 개발 서버 |
| `npm run build` | 타입체크(`tsc -b`) + 프로덕션 빌드 |
| `npm run preview` | 빌드 결과 미리보기 |
| `npm run lint` | oxlint |

### 환경 변수

| 변수 | 설명 |
| --- | --- |
| `VITE_KAKAO_KEY` | Kakao REST API 키 ([발급](https://developers.kakao.com)). **`.env`에만 두며 git에 커밋되지 않습니다.** |

## 폴더 구조

```
src/
  api/         # axios 클라이언트(client) + 엔드포인트 호출(books)
  hooks/       # useBookSearch(무한스크롤), useIntersectionObserver
  store/       # searchHistoryStore, wishlistStore (zustand + persist)
  lib/         # 순수 함수: 가격 포맷·저자 조합·식별키(format)
  types/       # Book, SearchResponse, BookSearchInput ...
  components/  # SearchBar, BookCard, BookList, DetailSearchPopup,
               # ResultCount, EmptyState, Header, Spinner, icons/
  pages/       # SearchPage, WishlistPage
  styles/      # theme(디자인 토큰), GlobalStyle, styled.d.ts
  App.tsx, main.tsx
```

## 상태 관리 전략

- **서버 상태(검색 결과)** → React Query. 캐시·무한스크롤·로딩/에러를 위임. `staleTime 5분`으로 같은 검색 재요청을 줄임.
- **클라이언트 영속 상태(검색기록·찜)** → zustand + persist(localStorage). 새로고침·브라우저 재시작 후에도 유지.
- 두 상태가 만나는 지점(검색 결과 카드의 찜 여부)은 **데이터를 복제하지 않고 셀렉터로 조합** — 각 카드는 자기 찜 여부 boolean만 구독한다.

## 성능 최적화

- `React.memo(BookCard)` — 무한스크롤로 페이지가 추가돼도 기존 카드는 리렌더 스킵
- 찜 여부 boolean 셀렉터 구독 — 한 책을 찜해도 **해당 카드만** 리렌더
- React Query 캐시(`staleTime`/`gcTime`) + `refetchOnWindowFocus: false`
- 표지 이미지 `loading="lazy"` · `decoding="async"`
- 무한스크롤은 스크롤 이벤트가 아닌 `IntersectionObserver`
- 웹폰트(Noto Sans KR) **렌더 비차단 로드** — 폴백 폰트로 즉시 렌더 후 swap (Lighthouse Performance 99)

> 성능 점수는 **프로덕션 빌드 기준**으로 측정하세요: `npm run build && npm run preview`.
> 개발 서버(`npm run dev`)는 비압축·미번들이라 Lighthouse 점수가 낮게 나옵니다.

## 설계 결정

주요 선택의 이유·트레이드오프는 [DECISIONS.md](./DECISIONS.md) 를 참고하세요.
