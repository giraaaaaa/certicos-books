import { useEffect, useRef } from 'react';

interface Options {
  enabled?: boolean;
  rootMargin?: string;
}

// 센티넬 엘리먼트가 뷰포트에 들어오면 onIntersect를 호출한다(무한스크롤 트리거).
// onIntersect는 ref에 보관해, 콜백이 매 렌더 새로 와도 옵저버를 재생성하지 않는다.
export function useIntersectionObserver<T extends Element>(
  onIntersect: () => void,
  { enabled = true, rootMargin = '200px' }: Options = {},
) {
  const targetRef = useRef<T | null>(null);
  const savedCallback = useRef(onIntersect);
  savedCallback.current = onIntersect;

  useEffect(() => {
    const el = targetRef.current;
    if (!el || !enabled) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) savedCallback.current();
      },
      // rootMargin 200px: 화면에 닿기 직전에 미리 다음 페이지를 당겨와 끊김을 줄인다.
      { rootMargin },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [enabled, rootMargin]);

  return targetRef;
}
