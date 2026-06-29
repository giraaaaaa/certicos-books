# 설계 결정 (DECISIONS)

주요 설계 선택과 그 이유, 트레이드오프를 정리합니다.

## 아키텍처 · 상태 관리

- **서버 상태와 클라이언트 상태 분리** — 검색 결과는 React Query(`useInfiniteQuery`), 찜·검색기록은 Zustand + persist. 두 상태를 한 저장소에 섞지 않고 책임을 분리했다. "찜 여부를 검색 결과 카드에 표시"하는 교차 지점은 데이터를 복제하지 않고 셀렉터로 조합한다.
- **API 호출 계층 분리** — `api/client.ts`(axios 인스턴스에 인증 헤더·baseURL 집중) → `api/books.ts`(호출만 담당) → `lib/format.ts`(순수 가공 함수). 키·호스트가 여러 파일에 흩어지지 않게 한곳에 모았다.
- **응답 타입 직접 정의** — Kakao 응답 구조를 타입으로 명시하고 `sale_price=-1`(미제공), `isbn` 공백 구분 등 비자명 필드를 주석화. 무한스크롤 종료는 `meta.is_end` 단일 근거로 판정.

## 디자인 시스템 · UI

- **디자인 토큰 단일 출처** — color/typography/spacing/radius/shadows/zIndex를 `theme.ts`에 모으고 `styled.d.ts`로 `props.theme` 타입을 주입 → 정의되지 않은 토큰 접근은 컴파일 타임에 차단된다. 타이포는 `typo()` 믹스인으로 size·weight·lineHeight를 한 번에 적용해 적용 누락·불일치를 방지.
- **재사용 컴포넌트 계층** — ① 범용 프리미티브(`Button`·아이콘·`Spinner`·`EmptyState`·`ResultCount`), ② 도메인 공용(`BookCard`·`BookList`·`WishButton`, 검색·찜 양쪽 재사용), ③ 단일 조합(`Header`·`SearchBar`). `Button`은 variant×size 축 분리 + `href` 유무로 `a`/`button` 다형성, `styled(Button)`으로 위치·폭만 확장.
- **카드 레이아웃 = flex 앵커링** — 좌(썸네일)·우(가격/버튼)는 위치 고정, 가운데(제목/본문)만 `flex:1`로 폭을 흡수. 컨테이너 폭이 시안과 달라도 양끝 좌표가 유지되고 본문 영역만 늘었다 줄어든다(절대좌표 하드코딩 회피).
- **펼침만 애니메이션(slideDown), 접기는 보류** — 펼침은 콘텐츠가 위→아래로 드러나 자연스럽지만, 접기를 단순 역방향으로 하면 표지·텍스트가 잘려 "쭈그러드는" 느낌이라 UX가 나빠 제외. `prefers-reduced-motion` 대응.

## 기능

- **무한스크롤 = useInfiniteQuery + IntersectionObserver sentinel** — 리스트 끝 sentinel이 뷰포트에 들어오면 다음 페이지를 로드. 스크롤 이벤트 핸들러보다 효율적이고, 더보기 버튼/페이지네이션으로 바꿔도 sentinel만 교체하면 된다(로드 방식 ↔ 표시 분리).
- **상세검색 = Kakao `target` 파라미터** — 제목/저자명/출판사 중 선택, 일반검색은 target 없이 통합. `queryKey`에 target을 포함해 조건이 바뀌면 자동 재검색. 일반·상세 검색을 `{ query, target }` 한 시그니처로 통일.
- **검색기록** — 최근 검색어 최대 8개, 중복 제거·최신순. 입력 포커스 시 드롭다운, 항목 클릭=재검색 / X=개별 삭제.
- **찜 = Book 스냅샷 저장** — ID가 아니라 찜한 순간의 Book 객체 전체를 저장한다. Kakao 검색 API엔 ISBN 단건 조회가 없고 재조회 시 가격·판매상태가 바뀔 수 있어, "찜한 시점"의 데이터를 재조회 없이 일관되게 보여주기 위함. (트레이드오프: 스냅샷이 최신가와 달라질 수 있음, 책당 ~1KB)
- **영속성** — 찜·검색기록 모두 localStorage persist → 새로고침·브라우저 재시작 후에도 유지.

## 성능

- **렌더링 최적화** — `React.memo(BookCard)`로 무한스크롤 append 시 기존 카드 리렌더 스킵. `WishButton`은 '이 책의 찜 여부' boolean만 구독해 다른 책 토글에 리렌더되지 않음. React Query `staleTime 5분`·`refetchOnWindowFocus:false`로 불필요 호출 차단, 표지 이미지 `loading=lazy`·`decoding=async`. 검색은 제출 기반이라 키 입력마다 호출하지 않음.
- **웹폰트 렌더 비차단** — Noto Sans KR(Google Fonts) stylesheet를 `preload` + `media="print" onload="this.media='all'"`로 비차단 로드. `<head>`의 stylesheet `<link>`가 첫 렌더를 ~3.5s 막던 것을 폴백 폰트로 즉시 렌더 후 swap하도록 변경 → 프로덕션 Lighthouse FCP 4.9s→1.4s, **Performance 66→99**. (성능 측정은 `npm run build && npm run preview` 기준)

## 보안

- **API 키 분리** — Kakao 키는 `.env`(gitignore)에만 두고 코드 하드코딩 금지, `.env.example`로 형식만 공유.
