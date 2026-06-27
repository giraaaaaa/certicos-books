import { useState, memo } from 'react';
import styled, { keyframes } from 'styled-components';
import type { Book } from '../types';
import { formatAuthors, formatPrice } from '../lib/format';
import { ChevronIcon } from './icons';
import { Button } from './ui/Button';
import { WishButton } from './ui/WishButton';

interface BookCardProps {
  book: Book;
}

// 검색 결과·찜 목록 공용 카드. 데이터 출처를 모르는 "표시 전용" 컴포넌트(Book만 받음) → 양쪽 재사용.
// 접힘(BookListItem 960×100) ↔ 펼침(BookListItemDetail 960×344)을 상세보기 버튼으로 토글.
// 찜 토글은 WishButton이 캡슐화 → 이 카드는 wishlistStore를 직접 몰라도 됨(결합도↓).
function BookCardComponent({ book }: BookCardProps) {
  const [expanded, setExpanded] = useState(false);
  // 할인 여부: 판매가가 유효(>0)하고 정가보다 쌀 때만. (sale_price는 미제공 시 -1)
  const hasDiscount = book.sale_price > 0 && book.sale_price < book.price;
  const finalPrice = hasDiscount ? book.sale_price : book.price;

  if (expanded) {
    return (
      <DetailCard>
        <DetailThumb>
          {book.thumbnail ? <img src={book.thumbnail} alt="" /> : <Placeholder aria-hidden />}
          <DetailLike book={book} size={24} />
        </DetailThumb>

        <DetailMain>
          <DetailHeader>
            <DetailTitle>{book.title}</DetailTitle>
            <DetailAuthor>{formatAuthors(book.authors)}</DetailAuthor>
          </DetailHeader>
          <DescLabel>책 소개</DescLabel>
          <DescText>{book.contents}</DescText>
        </DetailMain>

        <DetailSide>
          <DetailToggle variant="secondary" onClick={() => setExpanded(false)}>
            상세보기
            <ChevronIcon direction="up" />
          </DetailToggle>
          <PriceArea>
            {hasDiscount && (
              <PriceRow>
                <PriceLabel>원가</PriceLabel>
                <OriginalPrice>{formatPrice(book.price)}</OriginalPrice>
              </PriceRow>
            )}
            <PriceRow>
              {hasDiscount && <PriceLabel>할인가</PriceLabel>}
              <FinalPrice>{formatPrice(finalPrice)}</FinalPrice>
            </PriceRow>
          </PriceArea>
          <BuyButtonLarge href={book.url} target="_blank" rel="noreferrer">
            구매하기
          </BuyButtonLarge>
        </DetailSide>
      </DetailCard>
    );
  }

  return (
    <Card>
      <Thumb>
        {book.thumbnail ? (
          <img src={book.thumbnail} alt="" loading="lazy" decoding="async" />
        ) : (
          <Placeholder aria-hidden />
        )}
        <LikeButton book={book} size={16} />
      </Thumb>

      <Info>
        <BookTitle>{book.title}</BookTitle>
        <Authors>{formatAuthors(book.authors)}</Authors>
      </Info>

      <Price>{formatPrice(finalPrice)}</Price>

      <Actions>
        <BuyButton href={book.url} target="_blank" rel="noreferrer">
          구매하기
        </BuyButton>
        <DetailToggle variant="secondary" onClick={() => setExpanded(true)}>
          상세보기
          <ChevronIcon direction="down" />
        </DetailToggle>
      </Actions>
    </Card>
  );
}

// React.memo: 부모(BookList) 리렌더 시 book 참조가 같으면 이 카드는 리렌더를 건너뛴다.
// 무한스크롤로 다음 페이지가 append돼도 기존 카드들은 다시 그리지 않음(성능 최적화).
export const BookCard = memo(BookCardComponent);

/* ───────── 공용 ───────── */

const Placeholder = styled.div`
  width: 100%;
  height: 100%;
  background: ${({ theme }) => theme.colors.palette.lightGray};
`;

// 찜 하트(접힘) — 표시·로직은 WishButton, 여기선 위치만(썸네일 우상단).
const LikeButton = styled(WishButton)`
  position: absolute;
  top: 0;
  right: 0;
`;

// 구매하기(접힘) — 색(primary)·크기(md)는 Button 기본값, 폭만 지정.
// &&: 공용 Button 스타일보다 우선순위를 확실히 높여 확장 스타일이 항상 이기게 한다.
const BuyButton = styled(Button)`
  && {
    width: 115px;
  }
`;

// 상세보기(접힘·펼침 공용) — secondary 색 + 라벨 좌측정렬(padding 20) + 셰브론(gap·svg색은 Button이 처리).
const DetailToggle = styled(Button)`
  && {
    width: 115px;
    justify-content: flex-start;
    padding: 0 20px;
  }
`;

/* ───────── 접힘(BookListItem 960×100) ───────── */

const Card = styled.li`
  display: flex;
  align-items: center;
  height: 100px;
  padding: 0 16px 0 48px; /* Figma: 썸네일 좌48 / 상세보기 우16 */
  box-shadow: inset 0 -1px 0 ${({ theme }) => theme.colors.palette.divider}; /* divider를 높이에 더하지 않게(카드 = 100/344 정확히) */
`;

const Thumb = styled.div`
  position: relative;
  flex-shrink: 0;
  width: 48px;
  height: 68px;

  img {
    width: 48px;
    height: 68px;
    object-fit: cover;
  }
`;

const Info = styled.div`
  flex: 1; /* 폭 변화 흡수 — 썸네일·가격·버튼은 고정, 제목영역만 늘었다 줄어 */
  min-width: 0;
  margin-left: 48px; /* Figma: 썸네일(96) → 제목(144) = 48 */
  display: flex;
  align-items: baseline;
  gap: ${({ theme }) => theme.spacing.md}; /* 제목 ↔ 저자 16 */
`;

const BookTitle = styled.span`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: ${({ theme }) => theme.typography.title3.size};
  font-weight: ${({ theme }) => theme.typography.title3.weight};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Authors = styled.span`
  flex-shrink: 0;
  font-size: ${({ theme }) => theme.typography.body2.size};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const Price = styled.span`
  flex-shrink: 0;
  margin-left: 22px; /* Figma: 제목영역(552) → 가격(574) = 22. 가격 우측끝은 right 310 고정 */
  font-size: ${({ theme }) => theme.typography.title3.size};
  font-weight: ${({ theme }) => theme.typography.title3.weight};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Actions = styled.div`
  flex-shrink: 0;
  margin-left: 56px; /* Figma: 가격(650) → 구매하기(706) = 56 */
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm}; /* 구매하기 ↔ 상세보기 8 */
`;

/* ───────── 펼침(BookListItemDetail 960×344) ───────── */

// 펼칠 때 스르륵 내려오는(아코디언) 효과 — max-height를 키워 콘텐츠를 위→아래로 드러낸다.
const slideDown = keyframes`
  from {
    max-height: 100px;
    opacity: 0.5;
  }
  to {
    max-height: 400px;
    opacity: 1;
  }
`;

const DetailCard = styled.li`
  position: relative;
  display: flex;
  padding: 24px 16px 40px 54px; /* Figma: 썸네일 좌54/상24, 구매버튼 우16/하40 */
  box-shadow: inset 0 -1px 0 ${({ theme }) => theme.colors.palette.divider}; /* divider를 높이에 더하지 않게(카드 = 100/344 정확히) */
  overflow: hidden;
  animation: ${slideDown} 0.25s ease; /* 펼칠 때만 스르륵(slideDown). 접기 애니메이션은 추후. */

  /* 모션 민감 사용자: 애니메이션 끔(접근성) */
  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`;

const DetailThumb = styled.div`
  position: relative;
  flex-shrink: 0;
  width: 210px;
  height: 280px;

  img {
    width: 210px;
    height: 280px;
    object-fit: cover;
  }
`;

// 찜 하트(펼침) — WishButton 재사용, 위치만(썸네일 우상단).
const DetailLike = styled(WishButton)`
  position: absolute;
  top: 8px;
  right: 8px;
`;

const DetailMain = styled.div`
  flex: 1; /* 폭 변화 흡수 — 썸네일·우측영역은 고정, 본문폭만 늘었다 줄어 */
  min-width: 0;
  margin-left: 32px; /* Figma: 썸네일(264) → 본문(296) = 32 */
  padding-top: 20px; /* Figma: 제목 top 44 = 카드 상단패딩 24 + 20 */
  display: flex;
  flex-direction: column;
`;

const DetailHeader = styled.div`
  display: flex;
  align-items: baseline;
  gap: ${({ theme }) => theme.spacing.md};
  margin-bottom: ${({ theme }) => theme.spacing.md};
`;

const DetailTitle = styled.span`
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap; /* Figma: 제목 1줄(26) — 길면 말줄임. 2줄 되면 책소개가 밀림 */
  font-size: ${({ theme }) => theme.typography.h3Bold.size};
  font-weight: ${({ theme }) => theme.typography.h3Bold.weight};
  line-height: ${({ theme }) => theme.typography.h3Bold.lineHeight};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const DetailAuthor = styled.span`
  flex-shrink: 0;
  font-size: ${({ theme }) => theme.typography.captionMedium.size};
  font-weight: ${({ theme }) => theme.typography.captionMedium.weight};
  color: ${({ theme }) => theme.colors.text.subtitle};
`;

const DescLabel = styled.h4`
  margin-bottom: 12px; /* Figma: 책소개(26) → 소개글까지 12px */
  font-size: ${({ theme }) => theme.typography.body2Bold.size};
  font-weight: ${({ theme }) => theme.typography.body2Bold.weight};
  line-height: 26px; /* Figma: 책소개 14/700/26 */
  color: ${({ theme }) => theme.colors.text.primary};
`;

const DescText = styled.p`
  /* Figma 소개글: 10/500 lineHeight 16. 길면 카드(약 344) 안에서 잘리도록 줄 수 제한. */
  display: -webkit-box;
  -webkit-line-clamp: 11;
  -webkit-box-orient: vertical;
  overflow: hidden;
  font-size: ${({ theme }) => theme.typography.small.size};
  font-weight: ${({ theme }) => theme.typography.small.weight};
  line-height: 16px;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const DetailSide = styled.div`
  flex-shrink: 0;
  margin-left: 48px; /* Figma: 본문(656) → 우측영역(구매버튼 좌704) = 48 */
  padding-top: 2px; /* Figma: 상세보기 top 26 = 카드 상단패딩 24 + 2 */
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

// 상세보기(위) ↔ 가격/구매(아래)를 양 끝으로: 가격 묶음을 margin-top auto로 바닥에 붙임.
const PriceArea = styled.div`
  margin-top: auto;
  margin-right: 4px; /* Figma: 가격 right 20 (버튼 right 16보다 4px 안쪽) */
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const PriceRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const PriceLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.tinyMedium.size};
  font-weight: ${({ theme }) => theme.typography.tinyMedium.weight};
  color: ${({ theme }) => theme.colors.text.subtitle};
`;

const OriginalPrice = styled.span`
  font-size: ${({ theme }) => theme.typography.h3Bold.size};
  font-weight: 400; /* Figma 원가 weight 350 → 브라우저는 400으로 렌더 */
  line-height: ${({ theme }) => theme.typography.h3Bold.lineHeight}; /* 26 */
  text-decoration: line-through;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const FinalPrice = styled.span`
  font-size: ${({ theme }) => theme.typography.h3Bold.size};
  font-weight: ${({ theme }) => theme.typography.h3Bold.weight};
  color: ${({ theme }) => theme.colors.text.primary};
`;

// 구매하기(펼침) — primary, 더 넓고(240) 가격 아래 여백(28).
const BuyButtonLarge = styled(Button)`
  && {
    width: 240px;
    margin-top: 28px;
  }
`;
