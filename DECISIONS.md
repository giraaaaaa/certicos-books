# DECISIONS

각 Phase의 핵심 설계 결정 로그 — **무엇을 골랐나 / 왜 / 트레이드오프**.

## Phase 0 — 셋업

- **HTTP 클라이언트로 axios 래퍼 채택** — baseURL과 `Authorization: KakaoAK` 헤더를 `api/client.ts` 한 곳에서만 설정. / 키·호스트가 컴포넌트에 흩어지지 않게(규칙 #2) 하고 엔드포인트 함수(`searchBooks`)는 "호출"만 담당시켜 가공과 분리하기 위함. / fetch 대비 의존성 1개가 늘지만 인스턴스·기본 헤더·향후 인터셉터 이점이 더 크다고 판단.
- **상태 책임 분리를 구조로 못박음** — 서버 상태(검색 결과)=React Query, 영속 클라 상태(찜)=Zustand+persist. / 규칙 #3을 코드 구조로 강제: main.tsx엔 QueryClientProvider만, 찜 store는 별도 모듈. / "찜 여부를 검색결과에 합쳐 보여주는" 교차 지점은 데이터를 복제하지 않고 셀렉터로 조합해 해결할 계획.
- **theme 토큰 + DefaultTheme 타입 증강** — color/typography/spacing/radius를 `theme.ts` 단일 출처로 두고 `styled.d.ts`로 `props.theme` 타입 주입. / 하드코딩 금지(규칙 #4)를 타입 시스템으로 보조 — 없는 토큰 접근이 컴파일 타임에 걸린다. / 런타임 CSS-in-JS 비용이 있으나 SPA 규모에선 무시할 수준.
- **응답 타입 직접 정의** — `Book/SearchMeta/SearchResponse`를 공식 응답 구조 기준으로 작성하고 `sale_price=-1`·`isbn` 공백 구분 등 비자명 필드를 주석화. / 무한스크롤 종료를 `meta.is_end` 단일 근거로 판정하려고 타입에 명시. / placeholder 키로 진행 중이라 **실제 1회 호출 검증은 키 수령 후 수행 예정**(현재 미검증 항목).
