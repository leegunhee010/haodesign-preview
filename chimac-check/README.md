# 치맥페 2026 바우처 검증 시스템

치맥 페스티벌 바우처를 QR 스캔·코드 입력으로 확인하고 사용 처리하는 단일 페이지 웹앱입니다.
(원본 배포: https://chimac-check.netlify.app/)

## 주요 기능
- **스캔 / 현황 / 관리 탭** — 매장 직원은 스캔 화면만, 통계·내역은 현황, 발급·계정은 관리 탭으로 분리
- **QR 스캔 / 코드 직접 입력**으로 바우처 확인 및 사용 처리 (연속 스캔, 성공 시 결과 자동 정리)
- **Supabase 실시간 연동** — 여러 매장 기기 간 사용 현황 실시간 공유, 중복 사용 자동 차단
- **매장별 로그인** — 비밀번호로 매장 구분, 어느 매장에서 사용했는지 기록
- **마스터 전용 관리** — 바우처 자동 생성·발급, QR 카드 인쇄, CSV 내보내기, **매장·관리자 계정 추가/수정/삭제**
- **한국어 / 베트남어** 2개국어 지원

## 구성
- `index.html` — 앱 전체 (HTML·CSS·JS 단일 파일)

## 설정
`index.html` 상단의 `SUPABASE_URL`, `SUPABASE_KEY` 값을 본인 Supabase 프로젝트 값으로 교체하세요.

### 필요한 테이블
```sql
-- 바우처
create table vouchers (
  code    text primary key,
  used    boolean not null default false,
  used_at bigint,
  store   text
);

-- 매장·관리자 계정 (마스터가 관리 탭에서 추가/수정/삭제)
create table stores (
  pw   text primary key,        -- 로그인 비밀번호
  name text not null,           -- 매장명(표시 이름)
  role text not null default 'store'  -- 'master' | 'store'
);
```
- `stores` 테이블이 **비어 있으면** 앱이 기본 계정(`0600` 마스터 외 매장들)을 1회 자동 등록합니다.
- `stores` 테이블이 **없으면** 기본 계정으로만 동작하며(관리 탭에 안내 표시), 계정 변경은 저장되지 않습니다.
- 두 테이블 모두 실시간(Realtime) 기능을 켜두면 여러 기기에서 즉시 동기화됩니다.

> ⚠️ **보안**: 현재 `anon` 키가 클라이언트에 노출되므로, 반드시 Supabase **RLS 정책**을 설정해 무단 조회/수정·계정 탈취를 막으세요.

## 배포
정적 파일이므로 Netlify, GitHub Pages 등 정적 호스팅에 그대로 올리면 됩니다.
