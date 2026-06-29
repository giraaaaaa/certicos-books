import axios from 'axios';

// Kakao API 전용 axios 인스턴스.
// baseURL과 'Authorization: KakaoAK' 헤더를 이 한 곳에서만 설정한다
// → 키/호스트가 코드 전반에 흩어지지 않게 하기 위함.
const KAKAO_KEY = import.meta.env.VITE_KAKAO_KEY;

if (!KAKAO_KEY || KAKAO_KEY === 'YOUR_KAKAO_REST_API_KEY_HERE') {
  // 키가 비면 401이 떨어진다. 개발 중 원인을 빨리 인지하도록 경고만 남기고 앱은 계속 띄운다.
  console.warn('[kakao] VITE_KAKAO_KEY가 설정되지 않았습니다. .env를 확인하세요.');
}

export const kakaoClient = axios.create({
  baseURL: 'https://dapi.kakao.com',
  headers: {
    Authorization: `KakaoAK ${KAKAO_KEY}`,
  },
});
