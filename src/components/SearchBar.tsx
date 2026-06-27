import { useState, useRef, useEffect } from 'react';
import type { FormEvent } from 'react';
import styled from 'styled-components';
import { SearchIcon, CloseIcon } from './icons';
import { DetailSearchPopup } from './DetailSearchPopup';
import { useSearchHistoryStore } from '../store/searchHistoryStore';
import type { BookSearchInput, SearchTarget } from '../types';

interface SearchBarProps {
  onSearch: (input: BookSearchInput) => void;
}

// 검색어 입력 + 검색 기록(전체 검색, Figma 757:1008) + 상세검색 팝업.
// 입력은 로컬 상태, 검색 기록은 zustand+persist(localStorage)로 분리 — 새로고침/재시작 후에도 유지.
// 입력창 포커스 시 최근 검색어 드롭다운 표시: 항목 클릭 = 재검색, X = 개별 삭제.
// 상세검색: 우측 버튼 → 하단 팝업에서 대상(target)을 지정해 검색.
export function SearchBar({ onSearch }: SearchBarProps) {
  const [value, setValue] = useState('');
  const [open, setOpen] = useState(false);
  const [detailOpen, setDetailOpen] = useState(false);
  const detailRef = useRef<HTMLDivElement>(null);
  const history = useSearchHistoryStore((s) => s.history);
  const addHistory = useSearchHistoryStore((s) => s.add);
  const removeHistory = useSearchHistoryStore((s) => s.remove);

  // 상세검색 팝업: 바깥 클릭 시 닫기.
  useEffect(() => {
    if (!detailOpen) return;
    const onDocMouseDown = (e: MouseEvent) => {
      if (detailRef.current && !detailRef.current.contains(e.target as Node)) {
        setDetailOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocMouseDown);
    return () => document.removeEventListener('mousedown', onDocMouseDown);
  }, [detailOpen]);

  // 일반 검색: 입력 동기화 → 기록 저장(중복 제거·최신순·최대 8) → 부모로 전달(target 없음=통합) → 드롭다운 닫기.
  const runSearch = (term: string) => {
    const q = term.trim();
    if (!q) return;
    setValue(q);
    addHistory(q);
    onSearch({ query: q });
    setOpen(false);
  };

  // 상세검색: 선택한 대상(target)과 함께 검색. 메인 입력창에도 검색어를 반영해 현재 검색을 드러낸다.
  const runDetailSearch = ({ query, target }: { query: string; target: SearchTarget }) => {
    const q = query.trim();
    if (!q) return;
    setValue(q);
    addHistory(q);
    onSearch({ query: q, target });
    setDetailOpen(false);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    runSearch(value);
  };

  const showHistory = open && history.length > 0;

  return (
    <Row onSubmit={handleSubmit}>
      <Field>
        <InputWrap $open={showHistory}>
          <SearchIcon size={30} />
          <Input
            value={value}
            // 검색(Enter) 후에도 입력창은 포커스 상태로 남으므로, 다시 타이핑/클릭하면 기록을 다시 연다.
            onChange={(e) => {
              setValue(e.target.value);
              setOpen(true);
            }}
            onFocus={() => setOpen(true)}
            onClick={() => setOpen(true)}
            onBlur={() => setOpen(false)}
            placeholder="검색어를 입력하세요"
            aria-label="도서 검색"
          />
        </InputWrap>

        {showHistory && (
          <History>
            {history.map((term) => (
              <HistoryItem key={term}>
                {/* onMouseDown preventDefault: 클릭해도 입력창 blur가 안 일어나 드롭다운이 닫히지 않음 */}
                <HistoryTerm
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => runSearch(term)}
                >
                  {term}
                </HistoryTerm>
                <RemoveButton
                  type="button"
                  aria-label={`검색 기록 삭제: ${term}`}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => removeHistory(term)}
                >
                  <CloseIcon size={24} />
                </RemoveButton>
              </HistoryItem>
            ))}
          </History>
        )}
      </Field>

      <DetailWrap ref={detailRef}>
        <DetailButton type="button" onClick={() => setDetailOpen((v) => !v)} $active={detailOpen}>
          상세검색
        </DetailButton>
        {detailOpen && (
          <DetailSearchPopup onSubmit={runDetailSearch} onClose={() => setDetailOpen(false)} />
        )}
      </DetailWrap>
    </Row>
  );
}

const Row = styled.form`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  max-width: 568px; /* 입력 480 + gap 16 + 버튼 72 (Figma) */
`;

// 입력창 + 드롭다운을 감싸는 포커스 컨테이너. height는 입력창(50)만 차지하고 드롭다운은 absolute로 띄운다.
const Field = styled.div`
  position: relative;
  flex: 1;
`;

const InputWrap = styled.div<{ $open: boolean }>`
  display: flex;
  align-items: center;
  gap: 11px; /* Figma: 돋보기(10px+30px) 뒤 placeholder가 51px에서 시작하도록 */
  height: 50px;
  padding: 0 10px; /* Figma: 돋보기(30×30) 좌측 10px 패딩 */
  background: ${({ theme }) => theme.colors.palette.lightGray};
  /* 기록 드롭다운이 열리면 하단 모서리를 각지게 → 아래 드롭다운과 연결된 한 박스처럼 보이게 */
  border-radius: ${({ $open }) => ($open ? '24px 24px 0 0' : '9999px')};
  color: ${({ theme }) => theme.colors.text.primary}; /* 돋보기 색 = Text/Default(#353C49) */
`;

const Input = styled.input`
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  outline: none;
  font-size: ${({ theme }) => theme.typography.caption.size};
  font-weight: ${({ theme }) => theme.typography.caption.weight};
  color: ${({ theme }) => theme.colors.text.primary};

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.subtitle};
  }
`;

// 최근 검색어 드롭다운 — 입력창 바로 아래 오버레이(아래 콘텐츠를 밀지 않음).
const History = styled.ul`
  position: absolute;
  top: 100%; /* 입력창 바로 아래에 붙여 한 박스처럼 연결(간격 없음) */
  left: 0;
  right: 0;
  z-index: 10;
  padding-bottom: 20px;
  background: ${({ theme }) => theme.colors.palette.lightGray};
  border-radius: 0 0 24px 24px; /* 위는 입력창과 연결(각짐), 아래만 둥글게 */
`;

const HistoryItem = styled.li`
  display: flex;
  align-items: center;
  height: 40px;
  /* 좌측 51px = 입력 placeholder와 정렬 / 우측은 X(close) 여백 (Figma 실측) */
  padding: 0 ${({ theme }) => theme.spacing.lg} 0 51px;
`;

const HistoryTerm = styled.button`
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-align: left;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: ${({ theme }) => theme.typography.caption.size};
  color: ${({ theme }) => theme.colors.text.subtitle};
`;

const RemoveButton = styled.button`
  flex-shrink: 0;
  display: flex;
  margin-left: ${({ theme }) => theme.spacing.md};
  color: ${({ theme }) => theme.colors.palette.black}; /* Figma: X = Gray/90 = #222222 */
`;

// 상세검색 버튼 + 팝업 컨테이너 — 팝업을 버튼 기준 absolute로 띄우기 위한 relative 래퍼.
const DetailWrap = styled.div`
  position: relative;
  flex-shrink: 0;
`;

// 상세검색: 투명 배경 + subtitle 보더/글자, radius 8, 높이 35 (Figma). 열린 동안은 primary로 강조.
const DetailButton = styled.button<{ $active?: boolean }>`
  height: 35px;
  padding: 0 ${({ theme }) => theme.spacing.md};
  border: 1px solid
    ${({ theme, $active }) => ($active ? theme.colors.palette.primary : theme.colors.text.subtitle)};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: transparent;
  color: ${({ theme, $active }) =>
    $active ? theme.colors.palette.primary : theme.colors.text.subtitle};
  font-size: ${({ theme }) => theme.typography.body2.size};
  font-weight: ${({ theme }) => theme.typography.body2.weight};
`;
