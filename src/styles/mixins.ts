import { css } from 'styled-components';
import type { AppTheme } from './theme';

// 타이포그래피 적용 믹스인 — size·weight·lineHeight를 토큰에서 한 번에 적용한다.
// 컴포넌트마다 세 줄을 손으로 풀어쓰던 패턴을 ${typo('title3')} 한 줄로 통일.
// → 적용 누락(특히 lineHeight)·불일치를 원천 차단하고, 토큰 변경이 전부에 전파된다.
export const typo = (name: keyof AppTheme['typography']) => css`
  font-size: ${({ theme }) => theme.typography[name].size};
  font-weight: ${({ theme }) => theme.typography[name].weight};
  line-height: ${({ theme }) => theme.typography[name].lineHeight};
`;
