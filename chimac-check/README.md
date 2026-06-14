# 치맥페 2026 바우처 검증 시스템

치맥 페스티벌 바우처를 QR 스캔·코드 입력으로 확인하고 사용 처리하는 단일 페이지 웹앱입니다.
(원본 배포: https://chimac-check.netlify.app/)

## 주요 기능
- **QR 스캔 / 코드 직접 입력**으로 바우처 확인 및 사용 처리
- **Supabase 실시간 연동** — 여러 매장 기기 간 사용 현황 실시간 공유, 중복 사용 자동 차단
- **매장별 로그인** — 비밀번호로 매장 구분, 어느 매장에서 사용했는지 기록
- **마스터 관리자(`0600`) 전용** — 바우처 자동 생성·발급, QR 카드 인쇄, CSV 내보내기
- **한국어 / 베트남어** 2개국어 지원

## 구성
- `index.html` — 앱 전체 (HTML·CSS·JS 단일 파일)

## 설정
`index.html` 상단의 `SUPABASE_URL`, `SUPABASE_KEY` 값을 본인 Supabase 프로젝트 값으로 교체하세요.
Supabase에 `vouchers` 테이블(`code`, `used`, `used_at`, `store`)이 필요합니다.

## 배포
정적 파일이므로 Netlify, GitHub Pages 등 정적 호스팅에 그대로 올리면 됩니다.
