interface CloseIconProps {
  size?: number;
  className?: string;
}

// 검색 기록 개별 삭제(X). 색은 currentColor.
export function CloseIcon({ size = 16, className }: CloseIconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M4 4L20 20M20 4L4 20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}
