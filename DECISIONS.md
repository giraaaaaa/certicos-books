# DECISIONS

각 Phase의 핵심 설계 결정 로그 — **무엇을 골랐나 / 왜 / 트레이드오프**.

## Phase 0 — 셋업

- **HTTP 클라이언트로 axios 래퍼 채택** — baseURL과 `Authorization: KakaoAK` 헤더를 `api/client.ts` 한 곳에서만 설정. / 키·호스트가 컴포넌트에 흩어지지 않게(규칙 #2) 하고 엔드포인트 함수(`searchBooks`)는 "호출"만 담당시켜 가공과 분리하기 위함. / fetch 대비 의존성 1개가 늘지만 인스턴스·기본 헤더·향후 인터셉터 이점이 더 크다고 판단.
- **상태 책임 분리를 구조로 못박음** — 서버 상태(검색 결과)=React Query, 영속 클라 상태(찜)=Zustand+persist. / 규칙 #3을 코드 구조로 강제: main.tsx엔 QueryClientProvider만, 찜 store는 별도 모듈. / "찜 여부를 검색결과에 합쳐 보여주는" 교차 지점은 데이터를 복제하지 않고 셀렉터로 조합해 해결할 계획.
- **theme 토큰 + DefaultTheme 타입 증강** — color/typography/spacing/radius를 `theme.ts` 단일 출처로 두고 `styled.d.ts`로 `props.theme` 타입 주입. / 하드코딩 금지(규칙 #4)를 타입 시스템으로 보조 — 없는 토큰 접근이 컴파일 타임에 걸린다. / 런타임 CSS-in-JS 비용이 있으나 SPA 규모에선 무시할 수준.
- **응답 타입 직접 정의** — `Book/SearchMeta/SearchResponse`를 공식 응답 구조 기준으로 작성하고 `sale_price=-1`·`isbn` 공백 구분 등 비자명 필드를 주석화. / 무한스크롤 종료를 `meta.is_end` 단일 근거로 판정하려고 타입에 명시. / 이후 실제 키로 호출 검증 완료(검색 응답·필드 정상).

## Phase 1 — 검색 / 무한스크롤 / 검색기록 / 상세검색

- **무한스크롤 = useInfiniteQuery + IntersectionObserver sentinel** — 리스트 끝 sentinel이 뷰포트에 들어오면 다음 페이지 로드, 종료는 `meta.is_end`로만 판정(`getNextPageParam`). / 스크롤 이벤트 핸들러보다 효율적이고, "더보기 버튼/페이지네이션"으로 바꿔도 sentinel만 교체하면 됨(로드 방식 ↔ 표시 분리). / 관찰자 1개 추가 비용.
- **검색기록 = zustand + persist** — 최근 검색어 최대 8개, 중복 제거·최신순. 입력 포커스 시 드롭다운, 항목 클릭=재검색 / X=개별 삭제. / 서버와 무관한 영속 클라 상태라 React Query가 아닌 zustand. / —
- **상세검색 = Kakao `target` 파라미터** — 제목 / 저자명(person) / 출판사를 팝업에서 선택, 일반검색은 target 없음(통합). / `queryKey`에 target을 포함해 조건이 바뀌면 자동 재검색. hook/api는 처음부터 target을 받게 설계해 UI만 얹으면 됨. / 셀렉트엔 현재 선택을 뺀 나머지만 노출(Figma 시안 일치).
- **검색 진입점을 `{ query, target }` 객체로 통일** — 일반·상세 검색이 같은 `onSearch`로 흐른다. / 시그니처 하나로 두 흐름을 합침. / —

## Phase 2 — 찜

- **'ID'가 아니라 'Book 스냅샷'을 저장** — 찜한 순간의 Book 객체 전체를 localStorage에 저장. / Kakao 검색 API엔 ISBN 단건 조회가 없고, 재조회하면 가격/판매상태가 바뀔 수 있어 — "찜한 시점"의 데이터를 재조회 없이 일관되게 보여주려면 스냅샷이 필요(요구사항: 찜 시점 데이터 보존). / 스냅샷이 오래되면 최신가와 다를 수 있음(의도된 동작), 책당 ~1KB localStorage 사용.
- **찜 여부 = boolean 셀렉터 구독** — 카드는 `items.some(키 일치)` boolean만 구독. / 다른 책을 찜/해제해도 그 카드만 리렌더되고 전체 리스트는 안 그려짐(성능). / —
- **검색기록·찜 모두 persist** — `cdri-search-history`, `cdri-wishlist`. 새로고침·브라우저 재시작 후에도 유지(요구사항: 영속). / — / —
- **목록 컴포넌트 재사용** — 찜 목록도 BookCard·BookList·ResultCount를 재사용. BookList의 페이지네이션 props는 옵셔널(찜은 무한스크롤 없음), ResultCount는 `label` 파라미터화. / 중복 제거 + 일관 UI(규칙 #4 재사용 컴포넌트). / —

## Phase 3 — 카드 정밀화 / 성능 / 마감

- **카드 레이아웃 = flex 앵커링** — 좌(썸네일)·우(가격/버튼)는 위치 고정, 가운데(제목/본문)만 `flex:1`로 폭을 흡수. 비균등 간격은 margin으로. / 컨테이너 폭이 디자인(960)과 달라도(앱 콘텐츠 912) 썸네일 좌·버튼 우 등 Figma 좌표가 유지되고 본문영역만 늘었다 줄어든다 — 절대좌표 하드코딩 대신 반응형. / —
- **펼침만 애니메이션(slideDown), 접기는 보류** — 펼침은 콘텐츠가 위→아래로 드러나 자연스럽지만, 접기를 단순 역방향으로 하면 풍부한 콘텐츠(표지·텍스트)가 잘려 "쭈그러드는" 느낌이라 UX가 나빠 제외. / 추후 '콘텐츠 페이드아웃 후 높이 접기' 방식으로 재도입 검토. / —
- **성능 최적화** — `React.memo(BookCard)`로 무한스크롤 append 시 기존 카드 리렌더 스킵 / React Query `staleTime 5분`·`refetchOnWindowFocus:false`로 불필요 호출 차단 / 표지 `loading=lazy`·`decoding=async` / 검색은 제출 기반이라 키 입력마다 호출하지 않아 별도 debounce 불필요. / —
- **보안 — API 키 분리** — Kakao 키는 `.env`(gitignore)에만 두고 코드 하드코딩 금지, `.env.example`로 형식만 공유(규칙 #1). / — / —
