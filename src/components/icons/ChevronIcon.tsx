interface ChevronIconProps {
  direction?: 'down' | 'up';
  className?: string;
}

// 펼침/접힘 셰브론(Figma에서 추출, 상세보기·셀렉트용). 색은 currentColor.
export function ChevronIcon({ direction = 'down', className }: ChevronIconProps) {
  return (
    <svg width="14" height="8" viewBox="0 0 14 8" fill="none" className={className} aria-hidden="true">
      {direction === 'up' ? (
        <path d="M12 8L7 3L2 8L0 7L7 0L14 7L12 8Z" fill="currentColor" />
      ) : (
        <path d="M2 0L7 5L12 0L14 1L7 8L0 1L2 0Z" fill="currentColor" />
      )}
    </svg>
  );
}
