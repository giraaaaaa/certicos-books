/// <reference types="vite/client" />

// .env의 VITE_KAKAO_KEY에 타입을 부여 → import.meta.env 사용 시 오타/누락을 컴파일 타임에 잡는다.
interface ImportMetaEnv {
  readonly VITE_KAKAO_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
