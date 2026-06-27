import { useRef, useState } from 'react';
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, MouseEvent, ReactNode } from 'react';
import styled, { css } from 'styled-components';

// 색상 축(variant)과 크기 축(size)을 prop으로 분리 → 한 컴포넌트로 모든 버튼을 표현(재사용).
export type ButtonVariant = 'primary' | 'secondary' | 'outline';
export type ButtonSize = 'sm' | 'md';

type StyleProps = {
  $variant: ButtonVariant;
  $size: ButtonSize;
  $fullWidth: boolean;
  $active: boolean;
  $busy: boolean;
};

interface BaseButtonProps {
  /** 색상 테마 — primary(파랑 채움) · secondary(회색) · outline(테두리) */
  variant?: ButtonVariant;
  /** 크기 — sm(높이 36) · md(높이 48) */
  size?: ButtonSize;
  /** 가로 100% (예: 팝업 '검색하기') */
  fullWidth?: boolean;
  /** outline 토글 강조(예: '상세검색' 열림 상태) */
  active?: boolean;
  /** 중복 클릭 방지 간격(ms). 직전 클릭 후 이 시간 이내 재클릭은 무시. 0이면 비활성. */
  cooldownMs?: number;
  onClick?: (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => void | Promise<void>;
  children: ReactNode;
}

// href가 있으면 <a>, 없으면 <button>으로 렌더 → 같은 모양으로 링크/액션 모두 커버.
type AnchorRest = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof BaseButtonProps>;
type ButtonRest = Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof BaseButtonProps>;
export type ButtonProps = BaseButtonProps & AnchorRest & ButtonRest;

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  active = false,
  cooldownMs = 100,
  onClick,
  href,
  disabled,
  children,
  ...rest
}: ButtonProps) {
  // busy: onClick이 Promise를 반환할 때 완료까지 잠금. lastClickRef: 시간 기반 연타 차단.
  const [busy, setBusy] = useState(false);
  const lastClickRef = useRef(0);

  const handleClick = (e: MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    // 중복 클릭 방지: (1) 비활성, (2) 비동기 처리 중, (3) cooldown 이내 재클릭 → 모두 무시.
    if (disabled || busy || Date.now() - lastClickRef.current < cooldownMs) {
      e.preventDefault();
      return;
    }
    lastClickRef.current = Date.now();
    const result = onClick?.(e);
    // 비동기 핸들러면 끝날 때까지 잠가 중복 제출을 막는다(동기 핸들러엔 영향 없음).
    if (result instanceof Promise) {
      setBusy(true);
      result.finally(() => setBusy(false));
    }
  };

  const styleProps: StyleProps = {
    $variant: variant,
    $size: size,
    $fullWidth: fullWidth,
    $active: active,
    $busy: busy,
  };

  // 링크(a): disabled면 href를 비우고 aria-disabled로 표시(앵커엔 disabled 속성이 없음).
  if (href != null) {
    return (
      <StyledAnchor
        {...styleProps}
        {...(rest as AnchorRest)}
        href={disabled ? undefined : href}
        aria-disabled={disabled || undefined}
        aria-busy={busy || undefined}
        onClick={handleClick}
      >
        {children}
      </StyledAnchor>
    );
  }

  return (
    <StyledButton
      type="button"
      {...styleProps}
      {...(rest as ButtonRest)}
      disabled={disabled || busy}
      aria-busy={busy || undefined}
      onClick={handleClick}
    >
      {children}
    </StyledButton>
  );
}

// button/a 공용 스타일 — 두 styled 래퍼가 공유(css 블록 1개로 중복 제거).
const buttonStyles = css<StyleProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  gap: 5px; /* 라벨 ↔ 아이콘(셰브론) 간격 — 아이콘 없으면 효과 없음 */
  border: 1px solid transparent; /* outline 테두리가 생겨도 높이가 변하지 않게 기본 1px 확보 */
  border-radius: ${({ theme }) => theme.radius.sm};
  font-family: inherit;
  white-space: nowrap;
  text-decoration: none; /* a로 렌더될 때 밑줄 제거 */
  cursor: pointer;
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease,
    opacity 0.15s ease;

  ${({ $fullWidth }) => $fullWidth && css`width: 100%;`}

  /* 크기(디자인) — sm 36 / md 48 */
  ${({ $size, theme }) =>
    $size === 'sm'
      ? css`
          height: 36px;
          padding: 0 ${theme.spacing.md};
          font-size: ${theme.typography.captionMedium.size};
          font-weight: ${theme.typography.captionMedium.weight};
        `
      : css`
          height: 48px;
          padding: 0 ${theme.spacing.lg};
          font-size: ${theme.typography.caption.size};
          font-weight: ${theme.typography.caption.weight};
        `}

  /* 색상(variant) */
  ${({ $variant, $active, theme }) =>
    $variant === 'primary'
      ? css`
          background: ${theme.colors.palette.primary};
          color: ${theme.colors.palette.white};
        `
      : $variant === 'secondary'
        ? css`
            background: ${theme.colors.palette.lightGray};
            color: ${theme.colors.text.secondary};
            svg {
              color: ${theme.colors.ui.gray}; /* 셰브론 = UI/Gray */
            }
          `
        : css`
            background: transparent;
            /* 평소 보조색, 열림(active) 시 primary로 강조 */
            border-color: ${$active ? theme.colors.palette.primary : theme.colors.text.subtitle};
            color: ${$active ? theme.colors.palette.primary : theme.colors.text.subtitle};
          `}

  /* 비동기 처리 중(중복 클릭 잠금) 시각 표시 */
  ${({ $busy }) =>
    $busy &&
    css`
      opacity: 0.6;
      pointer-events: none;
    `}

  &:disabled,
  &[aria-disabled='true'] {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const StyledButton = styled.button<StyleProps>`
  ${buttonStyles}
`;

const StyledAnchor = styled.a<StyleProps>`
  ${buttonStyles}
`;
