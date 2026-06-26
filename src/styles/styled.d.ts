import 'styled-components';
import type { AppTheme } from './theme';

// styled-components의 props.theme 타입을 우리 테마로 고정한다.
// → 토큰 자동완성이 되고, 존재하지 않는 토큰 접근은 컴파일 타임에 막힌다(규칙 #4 보조).
declare module 'styled-components' {
  // 빈 확장이지만 의도는 "DefaultTheme = AppTheme" 선언이다(module augmentation 표준 패턴).
  export interface DefaultTheme extends AppTheme {}
}
