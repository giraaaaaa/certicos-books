import { useState } from 'react';
import type { FormEvent } from 'react';
import styled from 'styled-components';
import { SearchIcon } from './icons';

interface SearchBarProps {
  onSearch: (query: string) => void;
}

// 검색어 입력 + 검색 트리거. 입력 텍스트는 로컬 상태로 들고, 제출(엔터) 시 부모로 올려보낸다.
// 상세검색 버튼은 Phase 2에서 target 필터 패널과 연결한다.
export function SearchBar({ onSearch }: SearchBarProps) {
  const [value, setValue] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(value.trim());
  };

  return (
    <Row onSubmit={handleSubmit}>
      <InputWrap>
        <SearchIcon size={24} />
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="검색어를 입력하세요"
          aria-label="도서 검색"
        />
      </InputWrap>
      <DetailButton type="button">상세검색</DetailButton>
    </Row>
  );
}

const Row = styled.form`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  max-width: 600px;
`;

const InputWrap = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  height: 50px;
  padding: 0 ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.palette.lightGray};
  border-radius: ${({ theme }) => theme.radius.full};
  color: ${({ theme }) => theme.colors.text.subtitle};
`;

const Input = styled.input`
  flex: 1;
  min-width: 0;
  border: none;
  background: transparent;
  outline: none;
  font-size: ${({ theme }) => theme.typography.caption.size};
  color: ${({ theme }) => theme.colors.text.primary};

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.subtitle};
  }
`;

const DetailButton = styled.button`
  flex-shrink: 0;
  height: 40px;
  padding: 0 ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.palette.gray};
  border-radius: ${({ theme }) => theme.radius.sm};
  background: ${({ theme }) => theme.colors.palette.white};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.body2.size};
`;
