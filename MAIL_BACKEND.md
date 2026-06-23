# 견적문의 메일 알림 — 백엔드 연동 명세

프론트(`js/data.js`의 `saveInquiry`)는 견적 문의가 접수되면 **관리자에서 설정한 URL**로 아래 JSON을 POST 합니다.
백엔드는 이 요청을 받아 메일을 발송하면 됩니다. (문의 자체는 Supabase에도 저장되므로 백엔드는 "메일 발송"만 책임지면 됩니다. 원하면 백엔드에서 DB 저장까지 해도 됩니다.)

## 요청 (Front → Backend)

```
POST <관리자에 입력한 URL>
Content-Type: application/json

{
  "name":    "홍길동 / OO회사",
  "phone":   "010-1234-5678",
  "type":    "카탈로그 · 브로슈어",
  "message": "제작 내용/수량/일정...",
  "to":      "sales@haodesign.co.kr",   // 관리자에서 설정한 수신 주소
  "date":    "2026. 6. 23. 오후 3:21:00"
}
```

## 응답 (Backend → Front)
- 성공: `200` (본문 형식 자유). 프론트는 응답을 강제로 읽지 않음(실패해도 접수는 계속).
- **CORS 필수**: 정적 사이트(GitHub Pages, 다른 도메인)에서 호출하므로 아래 헤더를 반드시 응답해야 함.
  ```
  Access-Control-Allow-Origin: *        (또는 https://haodesign.co.kr)
  Access-Control-Allow-Methods: POST, OPTIONS
  Access-Control-Allow-Headers: Content-Type
  ```
  → `OPTIONS` 프리플라이트도 200으로 응답할 것.

## 관리자 설정
관리자 → 사이트 설정 → **견적문의 메일 알림**:
- 사용 체크 / 받는 메일 주소 / **연동 URL** = 배포한 백엔드 엔드포인트

URL만 백엔드 주소로 바꾸면 코드 수정 없이 전환됩니다.

---

## 예제 A — Node.js (Express + nodemailer, Gmail)

```js
// npm i express cors nodemailer
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());                 // 또는 cors({ origin: "https://haodesign.co.kr" })
app.use(express.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,      // 보내는 Gmail 주소
    pass: process.env.GMAIL_APP_PASS,  // Gmail "앱 비밀번호"(2단계 인증 후 발급)
  },
});

app.post("/api/inquiry-mail", async (req, res) => {
  try {
    const { name, phone, type, message, to, date } = req.body || {};
    await transporter.sendMail({
      from: `"하오디자인 홈페이지" <${process.env.GMAIL_USER}>`,
      to: to || "sales@haodesign.co.kr",
      replyTo: to || "sales@haodesign.co.kr",
      subject: `[하오디자인] 새 견적문의 - ${name || ""}`,
      text:
        `■ 새 견적문의가 접수되었습니다\n\n` +
        `이름/회사 : ${name || ""}\n연락처 : ${phone || ""}\n` +
        `문의종류 : ${type || ""}\n접수시각 : ${date || ""}\n\n내용:\n${message || ""}`,
    });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false, error: String(e) });
  }
});

app.listen(process.env.PORT || 3000);
```

→ 관리자 "연동 URL"에 `https://<배포도메인>/api/inquiry-mail` 입력.

## 예제 B — 서버리스 (Vercel `/api/inquiry-mail.js`)

```js
// npm i nodemailer  (Vercel: api/ 폴더에 배치)
import nodemailer from "nodemailer";

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).end();

  const { name, phone, type, message, to, date } = req.body || {};
  const t = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASS },
  });
  try {
    await t.sendMail({
      from: `"하오디자인 홈페이지" <${process.env.GMAIL_USER}>`,
      to: to || "sales@haodesign.co.kr",
      replyTo: to || "sales@haodesign.co.kr",
      subject: `[하오디자인] 새 견적문의 - ${name || ""}`,
      text: `이름/회사: ${name}\n연락처: ${phone}\n종류: ${type}\n시각: ${date}\n\n${message}`,
    });
    res.json({ ok: true });
  } catch (e) {
    res.status(500).json({ ok: false });
  }
}
```

## 환경변수
- `GMAIL_USER` : 보내는 Gmail 주소
- `GMAIL_APP_PASS` : Gmail 2단계 인증 후 발급한 **앱 비밀번호**(일반 비번 아님)
  - (Workspace 계정이면 SMTP/앱비번 정책 확인. 다른 메일 제공자면 transporter 설정만 교체)

> 비밀번호/키는 절대 프론트 코드에 넣지 말고 백엔드 환경변수로만 둘 것.
