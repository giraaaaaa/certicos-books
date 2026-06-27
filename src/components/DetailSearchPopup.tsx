import { useState } from 'react';
import type { KeyboardEvent } from 'react';
import styled from 'styled-components';
import { ChevronIcon, CloseIcon } from './icons';
import { Button } from './ui/Button';
import type { SearchTarget } from '../types';

interface DetailSearchPopupProps {
  // 검색하기 → 입력한 검색어 + 선택한 대상(target)으로 상세검색 실행.
  onSubmit: (params: { query: string; target: SearchTarget }) => void;
  // 우상단 X로 팝업 닫기.
  onClose: () => void;
}

// 상세검색 대상 — Kakao의 target 파라미터와 매핑(person = 저자명).
const TARGET_OPTIONS: { value: SearchTarget; label: string }[] = [
  { value: 'title', label: '제목' },
  { value: 'person', label: '저자명' },
  { value: 'publisher', label: '출판사' },
];

// 상세검색 팝업(Figma 360×160). '상세검색' 버튼 하단에 노출된다.
// 우상단 닫기(X) + 좌측 대상 셀렉트(제목/저자명/출판사) + 우측 검색어 입력 + 하단 검색하기.
// 자체 상태(대상·검색어·셀렉트 열림)만 들고, 실제 검색/닫기는 onSubmit/onClose로 위임 → 재사용·테스트 쉬움.
export function DetailSearchPopup({ onSubmit, onClose }: DetailSearchPopupProps) {
  const [target, setTarget] = useState<SearchTarget>('title');
  const [term, setTerm] = useState('');
  const [selectOpen, setSelectOpen] = useState(false);

  const selectedLabel = TARGET_OPTIONS.find((o) => o.value === target)?.label;
  // 셀렉트엔 현재 선택을 뺀 나머지만 노출(Figma: drop 100×60 = 2칸).
  const otherOptions = TARGET_OPTIONS.filter((o) => o.value !== target);

  const submit = () => {
    const q = term.trim();
    if (!q) return;
    onSubmit({ query: q, target });
  };

  // 입력창에서 Enter = 검색하기. (Row가 이미 form이라 팝업은 div로 두고 중첩 form을 피함)
  const onInputKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      submit();
    }
  };

  return (
    <Popup>
      <CloseButton type="button" aria-label="상세검색 닫기" onClick={onClose}>
        {/* size 15 → 글리프 path 10px, 20박스 중앙정렬로 상하좌우 패딩 5(Figma) */}
        <CloseIcon size={15} />
      </CloseButton>

      <TopRow>
        <Filter>
          <FilterButton
            type="button"
            onClick={() => setSelectOpen((v) => !v)}
            aria-haspopup="listbox"
            aria-expanded={selectOpen}
          >
            <FilterLabel>{selectedLabel}</FilterLabel>
            <ChevronIcon direction="down" />
          </FilterButton>

          {selectOpen && (
            <Dropdown role="listbox">
              {otherOptions.map((o) => (
                <DropdownItem
                  key={o.value}
                  type="button"
                  role="option"
                  onClick={() => {
                    setTarget(o.value);
                    setSelectOpen(false);
                  }}
                >
                  {o.label}
                </DropdownItem>
              ))}
            </Dropdown>
          )}
        </Filter>

        <InputWrap>
          <TermInput
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            onKeyDown={onInputKeyDown}
            placeholder="검색어 입력"
            aria-label="상세검색어"
            autoFocus
          />
        </InputWrap>
      </TopRow>

      <Button variant="primary" size="sm" fullWidth onClick={submit}>
        검색하기
      </Button>
    </Popup>
  );
}

// 상세검색 버튼(우측) 기준 우측 정렬로 버튼 하단에 띄운다. 내용은 세로 중앙(justify-center).
const Popup = styled.div`
  position: absolute;
  top: calc(100% + 15px); /* Figma: 상세검색 버튼에서 15px 아래 */
  right: 0;
  z-index: 20;
  display: flex;
  flex-direction: column;
  justify-content: center; /* 내용(입력행+버튼)을 세로 중앙 → 상하 여백 36이 자동 산출(36 하드코딩 제거) */
  gap: ${({ theme }) => theme.spacing.md}; /* 16px — 입력행 ↔ 검색하기 (Figma) */
  width: 360px;
  height: 160px;
  padding: 0 ${({ theme }) => theme.spacing.lg}; /* 좌우 24만 — 상하는 중앙정렬이 처리 */
  background: ${({ theme }) => theme.colors.palette.white};
  box-shadow: 0px 4px 14px 6px rgba(151, 151, 151, 0.15);
  border-radius: ${({ theme }) => theme.radius.sm};
`;

// 우상단 닫기(X) — Figma: 20×20 박스, 패딩 5(글리프 10). 절대배치로 flow에서 분리.
const CloseButton = styled.button`
  position: absolute;
  top: ${({ theme }) => theme.spacing.sm};
  right: ${({ theme }) => theme.spacing.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: ${({ theme }) => theme.colors.ui.gray};
`;

const TopRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xs}; /* 필터 100 + 입력 208 + 4 = 312(=버튼 폭) */
  align-items: flex-start;
`;

const Filter = styled.div`
  position: relative;
  flex-shrink: 0;
  width: 100px;
`;

const FilterButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 36px;
  padding: 0 ${({ theme }) => theme.spacing.xs} 0 ${({ theme }) => theme.spacing.sm}; /* Figma: 제목 좌8 / 셰브론 우4 */
  border-bottom: 1px solid ${({ theme }) => theme.colors.palette.divider};
  background: transparent;
  color: ${({ theme }) => theme.colors.ui.gray}; /* 셰브론 = UI/Gray(currentColor) */
`;

const FilterLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.body2Bold.size};
  font-weight: ${({ theme }) => theme.typography.body2Bold.weight};
  color: ${({ theme }) => theme.colors.text.primary}; /* 선택값 = Text/Default, 굵게 */
`;

// 셀렉트 옵션 — 필터에서 6px 아래 떠서 본문을 밀지 않는다(오버레이).
const Dropdown = styled.div`
  position: absolute;
  top: calc(100% + 6px); /* Figma: 필터에서 6px 아래(붙지 않게) */
  left: 0;
  z-index: 5;
  width: 100px;
  background: ${({ theme }) => theme.colors.palette.white};
  box-shadow: 0px 0px 4px rgba(0, 0, 0, 0.25);
`;

const DropdownItem = styled.button`
  display: flex;
  align-items: center;
  width: 100%;
  height: 30px;
  padding: 0 ${({ theme }) => theme.spacing.sm};
  background: transparent;
  text-align: left;
  font-size: ${({ theme }) => theme.typography.captionMedium.size};
  font-weight: ${({ theme }) => theme.typography.captionMedium.weight};
  color: ${({ theme }) => theme.colors.text.subtitle};

  &:hover {
    background: ${({ theme }) => theme.colors.palette.lightGray};
  }
`;

const InputWrap = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  height: 36px;
  padding-left: 9px; /* Figma: 검색어 텍스트 좌측 들여쓰기 ≈9.45px */
  border-bottom: 1px solid ${({ theme }) => theme.colors.palette.primary}; /* Figma: 입력 밑줄 파랑 */
`;

const TermInput = styled.input`
  flex: 1;
  min-width: 0;
  padding: 0; /* 브라우저 기본 input 패딩 제거 → 텍스트가 InputWrap 들여쓰기(9px)에 정확히 맞게 */
  border: none;
  background: transparent;
  outline: none;
  font-size: ${({ theme }) => theme.typography.captionMedium.size};
  font-weight: ${({ theme }) => theme.typography.captionMedium.weight};
  color: ${({ theme }) => theme.colors.text.primary};

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.subtitle};
  }
`;
