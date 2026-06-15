/* ===================================================
   HAO DESIGN — shared data layer (demo)
   기본 데이터 + 관리자(localStorage) 오버라이드.
   실서비스에서는 이 파일의 get/save 를 API 호출로 교체.
=================================================== */
(function () {
  "use strict";

  /* 이미지 키 → 실제 경로
     "work01" → assets/work/work01.jpeg
     "img:big_slide_02" → assets/img/big_slide_02.jpg
     "https://…" → 그대로 */
  function imgSrc(f) {
    if (!f) return "";
    if (/^(https?:|data:)/.test(f)) return f; // URL 또는 업로드(base64) 이미지
    if (f.indexOf("hd:") === 0) return "assets/work-hd/thumb/" + f.slice(3); // 고화질 썸네일(720px)
    if (f.indexOf("img:") === 0) return "assets/img/" + f.slice(4) + ".jpg";
    return "assets/work/" + f + ".jpeg";
  }
  /* 라이트박스 · 히어로용 대형(1600px) 버전 */
  function fullSrc(f) {
    if (f && f.indexOf("hd:") === 0) return "assets/work-hd/large/" + f.slice(3);
    return imgSrc(f);
  }

  /* 기본 포트폴리오 (카테고리는 시안용 분류 — 실제 분류로 교체) */
  var DEFAULT_WORKS = [{"f":"hd:w402.jpg","t":"해븐코리아 카탈로그","c":"카탈로그·브로슈어"},{"f":"hd:w399.jpg","t":"KFC 브로슈어","c":"카탈로그·브로슈어"},{"f":"hd:w396.jpg","t":"NVP 브로슈어","c":"카탈로그·브로슈어"},{"f":"hd:w393.jpg","t":"한국토지주택공사 브로슈어","c":"카탈로그·브로슈어"},{"f":"hd:w390.jpg","t":"한우테크 카탈로그","c":"카탈로그·브로슈어"},{"f":"hd:w387.jpg","t":"엠케이얼라이언스 브로셔","c":"카탈로그·브로슈어"},{"f":"hd:w363.jpg","t":"우정사업본부 카다로그","c":"카탈로그·브로슈어"},{"f":"hd:w362.jpg","t":"자이 가이스트 카다로그","c":"카탈로그·브로슈어"},{"f":"hd:w361.jpg","t":"현대 종합금속 브로셔","c":"카탈로그·브로슈어"},{"f":"hd:w360.jpg","t":"전북대병원 유효성평가센터 카다로그","c":"카탈로그·브로슈어"},{"f":"hd:w359.jpg","t":"KPGA 코리안투어 브로셔","c":"카탈로그·브로슈어"},{"f":"hd:w358.jpg","t":"한국 프로축구연맹 카다로그","c":"카탈로그·브로슈어"},{"f":"hd:w271.jpg","t":"우정사업본부 카다로그","c":"카탈로그·브로슈어"},{"f":"hd:w267.jpg","t":"데이원 카다로그","c":"카탈로그·브로슈어"},{"f":"hd:w266.jpg","t":"셀레믹스 브로셔","c":"카탈로그·브로슈어"},{"f":"hd:w265.jpg","t":"아크릴 브로셔","c":"카탈로그·브로슈어"},{"f":"hd:w264.jpg","t":"SM소프트 카다로그","c":"카탈로그·브로슈어"},{"f":"hd:w263.jpg","t":"플랜티엠 카다로그","c":"카탈로그·브로슈어"},{"f":"hd:w262.jpg","t":"폴로엔터프라이즈 카다로그","c":"카탈로그·브로슈어"},{"f":"hd:w261.jpg","t":"큐시스 카다로그","c":"카탈로그·브로슈어"},{"f":"hd:w260.jpg","t":"대진건설 카탈로그","c":"카탈로그·브로슈어"},{"f":"hd:w259.jpg","t":"함라에이원 카다로그","c":"카탈로그·브로슈어"},{"f":"hd:w258.jpg","t":"주식회사 디엠아이 카다로그","c":"카탈로그·브로슈어"},{"f":"hd:w256.jpg","t":"청명 카다로그","c":"카탈로그·브로슈어"},{"f":"hd:w255.jpg","t":"하바드 카다로그","c":"카탈로그·브로슈어"},{"f":"hd:w254.jpg","t":"진완건설 브로셔","c":"카탈로그·브로슈어"},{"f":"hd:w253.jpg","t":"RADIX 브로셔","c":"카탈로그·브로슈어"},{"f":"hd:w252.jpg","t":"컨설팅 지원사업 우수사례집","c":"카탈로그·브로슈어"},{"f":"hd:w251.jpg","t":"아스터개발 브로셔","c":"카탈로그·브로슈어"},{"f":"hd:w250.jpg","t":"메델코리아 퀵메뉴얼","c":"카탈로그·브로슈어"},{"f":"hd:w247.jpg","t":"디스퀘어 서후팰리스 봉담 카다로그","c":"카탈로그·브로슈어"},{"f":"hd:w246.jpg","t":"GH파트너즈 카다로그","c":"카탈로그·브로슈어"},{"f":"hd:w245.jpg","t":"앤나코스메틱 카다로그","c":"카탈로그·브로슈어"},{"f":"hd:w244.jpg","t":"미러로이드 카다로그","c":"카탈로그·브로슈어"},{"f":"hd:w243.jpg","t":"루루이노스 제품안내서","c":"카탈로그·브로슈어"},{"f":"hd:w242.jpg","t":"삼정토탈마린 카다로그","c":"카탈로그·브로슈어"},{"f":"hd:w240.jpg","t":"청담동 샤브 브로셔","c":"카탈로그·브로슈어"},{"f":"hd:w239.jpg","t":"완도사랑 카다로그","c":"카탈로그·브로슈어"},{"f":"hd:w238.jpg","t":"지비라이스 회사소개서","c":"카탈로그·브로슈어"},{"f":"hd:w237.jpg","t":"하우테크 카다로그","c":"카탈로그·브로슈어"},{"f":"hd:w236.jpg","t":"동원파츠 카다로그","c":"카탈로그·브로슈어"},{"f":"hd:w235.jpg","t":"에이치투엘 카다로그","c":"카탈로그·브로슈어"},{"f":"hd:w234.jpg","t":"베베드클린 브로셔","c":"카탈로그·브로슈어"},{"f":"hd:w233.jpg","t":"알티스 건식세정기 카다로그","c":"카탈로그·브로슈어"},{"f":"hd:w232.jpg","t":"텔레비트 카다로그","c":"카탈로그·브로슈어"},{"f":"hd:w231.jpg","t":"오쿨리한방병원 카다로그","c":"카탈로그·브로슈어"},{"f":"hd:w230.jpg","t":"나노기술연구협의회 브로셔","c":"카탈로그·브로슈어"},{"f":"hd:w432.jpg","t":"일렉트로워터 리플렛","c":"리플렛"},{"f":"hd:w431.jpg","t":"워터트리네즈 리플렛","c":"리플렛"},{"f":"hd:w404.jpg","t":"명지대학교 리플렛","c":"리플렛"},{"f":"hd:w403.jpg","t":"대한보건의료정보관리사협회 리플릿","c":"리플렛"},{"f":"hd:w400.jpg","t":"베이지안웍스 리플렛","c":"리플렛"},{"f":"hd:w398.jpg","t":"NPV 리플렛","c":"리플렛"},{"f":"hd:w397.jpg","t":"원콜 리플렛","c":"리플렛"},{"f":"hd:w395.jpg","t":"FNT 오토피더 리플렛","c":"리플렛"},{"f":"hd:w394.jpg","t":"와프 리플렛","c":"리플렛"},{"f":"hd:w392.jpg","t":"메디앤리서치 시크릿로즈 리플렛","c":"리플렛"},{"f":"hd:w389.jpg","t":"아신투어 에코어스 리플렛","c":"리플렛"},{"f":"hd:w388.jpg","t":"고려대학교 의공연화 리플렛","c":"리플렛"},{"f":"hd:w384.jpg","t":"제스트업 3단 리플렛","c":"리플렛"},{"f":"hd:w383.jpg","t":"이지큐어 EZ-IM 2단 리플렛","c":"리플렛"},{"f":"hd:w382.jpg","t":"동경티엔씨 2단 리플렛","c":"리플렛"},{"f":"hd:w381.jpg","t":"대한보건의료정보관리사협회 3단 리플렛","c":"리플렛"},{"f":"hd:w291.jpg","t":"연세대학교 대한민국 청소년 정신건강연구 3단 리플렛","c":"리플렛"},{"f":"hd:w290.jpg","t":"하다엔터 3단 리플렛","c":"리플렛"},{"f":"hd:w289.jpg","t":"SK 루키 소개 2단 리플렛","c":"리플렛"},{"f":"hd:w288.jpg","t":"세종대학교 2단 리플렛","c":"리플렛"},{"f":"hd:w287.jpg","t":"쏠 커머스 2단 리플렛","c":"리플렛"},{"f":"hd:w286.jpg","t":"명진정공 3단 리플렛","c":"리플렛"},{"f":"hd:w285.jpg","t":"멘로시큐리티 정보책자","c":"리플렛"},{"f":"hd:w284.jpg","t":"골프존 3단 리플렛","c":"리플렛"},{"f":"hd:w283.jpg","t":"휴레이포지티브 2단 리플렛","c":"리플렛"},{"f":"hd:w282.jpg","t":"컬티그로스 2단 리플렛","c":"리플렛"},{"f":"hd:w281.jpg","t":"엔스테이지 3단 리플렛","c":"리플렛"},{"f":"hd:w280.jpg","t":"코드마인드 2단 리플렛","c":"리플렛"},{"f":"hd:w279.jpg","t":"화성아름보호 작업장 2단 리플렛","c":"리플렛"},{"f":"hd:w278.jpg","t":"일미식품 회사소개서","c":"리플렛"},{"f":"hd:w277.jpg","t":"메인스토리 2단 리플렛","c":"리플렛"},{"f":"hd:w276.jpg","t":"명성골프 2단 리플렛","c":"리플렛"},{"f":"hd:w275.jpg","t":"한미기술 2단 리플렛","c":"리플렛"},{"f":"hd:w274.jpg","t":"찬스아이 2단 리플렛","c":"리플렛"},{"f":"hd:w273.jpg","t":"스탠다드 학원 3단 리플렛","c":"리플렛"},{"f":"hd:w272.jpg","t":"한국백신 4단 리플렛","c":"리플렛"},{"f":"hd:w401.jpg","t":"신한라이프 포스터","c":"포스터·전단지"},{"f":"hd:w391.jpg","t":"노원구 웹포스터","c":"포스터·전단지"},{"f":"hd:w386.jpg","t":"전북음악아카데미 포스터","c":"포스터·전단지"},{"f":"hd:w385.jpg","t":"제스트업 포스터","c":"포스터·전단지"},{"f":"hd:w312.jpg","t":"이화여대 포스터","c":"포스터·전단지"},{"f":"hd:w311.jpg","t":"현대에너지 솔루션 팜플렛","c":"포스터·전단지"},{"f":"hd:w310.jpg","t":"한국스포츠과학기술포럼 포스터","c":"포스터·전단지"},{"f":"hd:w309.jpg","t":"교찾회 포스터","c":"포스터·전단지"},{"f":"hd:w308.jpg","t":"보레다바이오텍 전시회 포스터","c":"포스터·전단지"},{"f":"hd:w307.jpg","t":"동행재가방문 요양센터 전단지","c":"포스터·전단지"},{"f":"hd:w306.jpg","t":"렉터소프트 포스터","c":"포스터·전단지"},{"f":"hd:w305.jpg","t":"서플러스 글로벌 보건 경영 방침 포스터","c":"포스터·전단지"},{"f":"hd:w304.jpg","t":"한국지식재산보호원 포스터","c":"포스터·전단지"},{"f":"hd:w303.jpg","t":"서초구청 포스터","c":"포스터·전단지"},{"f":"hd:w302.jpg","t":"성동 공업고등학교 포스터","c":"포스터·전단지"},{"f":"hd:w301.jpg","t":"한국스포츠과학기술포럼 포스터","c":"포스터·전단지"},{"f":"hd:w300.jpg","t":"(주)오수아 포스터","c":"포스터·전단지"},{"f":"hd:w299.jpg","t":"JWCG 사이토카인 팜플렛","c":"포스터·전단지"},{"f":"hd:w298.jpg","t":"지투비 잡지광고","c":"포스터·전단지"},{"f":"hd:w297.jpg","t":"카테노이드 팜플렛","c":"포스터·전단지"},{"f":"hd:w296.jpg","t":"에스피메드 잡지광고","c":"포스터·전단지"},{"f":"hd:w295.jpg","t":"연세대 포스터","c":"포스터·전단지"},{"f":"hd:w294.jpg","t":"명신 ENG 포스터","c":"포스터·전단지"},{"f":"hd:w293.jpg","t":"에스피매드 단면광고","c":"포스터·전단지"},{"f":"hd:w322.jpg","t":"코렘스 C.I","c":"CI·로고디자인"},{"f":"hd:w321.jpg","t":"로지쎈 C.I","c":"CI·로고디자인"},{"f":"hd:w320.jpg","t":"SMD 성산축산물 백화점 C.I","c":"CI·로고디자인"},{"f":"hd:w319.jpg","t":"하경코스메틱 C.I","c":"CI·로고디자인"},{"f":"hd:w318.jpg","t":"루이빌 골프코리아 C.I","c":"CI·로고디자인"},{"f":"hd:w317.jpg","t":"두산대학교 C.I","c":"CI·로고디자인"},{"f":"hd:w316.jpg","t":"원앤탑 C.I","c":"CI·로고디자인"},{"f":"hd:w315.jpg","t":"늘품 C.I","c":"CI·로고디자인"},{"f":"hd:w314.jpg","t":"명가푸드시스템 C.I","c":"CI·로고디자인"},{"f":"hd:w313.jpg","t":"내당동제일골목 C.I","c":"CI·로고디자인"},{"f":"hd:w347.jpg","t":"엠킨 마린락토이너 클렌저 패키지","c":"패키지·라벨"},{"f":"hd:w346.jpg","t":"파워예스정 패키지","c":"패키지·라벨"},{"f":"hd:w345.jpg","t":"한국농산 패키지","c":"패키지·라벨"},{"f":"hd:w344.jpg","t":"엑세스파마 패키지","c":"패키지·라벨"},{"f":"hd:w343.jpg","t":"자보 섹시백 패키지","c":"패키지·라벨"},{"f":"hd:w342.jpg","t":"양지술곳간 모든날에 라벨","c":"패키지·라벨"},{"f":"hd:w341.jpg","t":"뷰티밤 주당의 비결 패키지","c":"패키지·라벨"},{"f":"hd:w340.jpg","t":"싸토리우스 종이카드 라벨","c":"패키지·라벨"},{"f":"hd:w380.jpg","t":"촬영포트폴리오_오뚜기","c":"촬영서비스"},{"f":"hd:w379.jpg","t":"촬영포트폴리오_서울우유","c":"촬영서비스"},{"f":"hd:w378.jpg","t":"촬영포트폴리오_연세유업","c":"촬영서비스"},{"f":"hd:w377.jpg","t":"촬영포트폴리오_리서쳐스","c":"촬영서비스"},{"f":"hd:w376.jpg","t":"촬영포트폴리오_열정코리아","c":"촬영서비스"},{"f":"hd:w375.jpg","t":"촬영포트폴리오_비스비바","c":"촬영서비스"},{"f":"hd:w374.jpg","t":"촬영포트폴리오_농협","c":"촬영서비스"},{"f":"hd:w373.jpg","t":"촬영포트폴리오_서울우유","c":"촬영서비스"},{"f":"hd:w372.jpg","t":"촬영포트폴리오_한독 레디큐","c":"촬영서비스"},{"f":"hd:w371.jpg","t":"촬영포트폴리오_한독 레디큐","c":"촬영서비스"},{"f":"hd:w370.jpg","t":"촬영포트폴리오_롯데백화점","c":"촬영서비스"},{"f":"hd:w369.jpg","t":"촬영포트폴리오_광동생활건강","c":"촬영서비스"},{"f":"hd:w368.jpg","t":"촬영포트폴리오_미니멜츠","c":"촬영서비스"},{"f":"hd:w367.jpg","t":"촬영포트폴리오_고삼농협","c":"촬영서비스"},{"f":"hd:w366.jpg","t":"촬영포트폴리오_서울우유","c":"촬영서비스"},{"f":"hd:w365.jpg","t":"촬영포트폴리오_한독 레디큐","c":"촬영서비스"},{"f":"hd:w364.jpg","t":"촬영포트폴리오_광동생활건강","c":"촬영서비스"},{"f":"hd:w357.jpg","t":"재생의료진흥재단 영문 카다로그","c":"다국어디자인"},{"f":"hd:w356.jpg","t":"카멜로테크 영문 카다로그","c":"다국어디자인"},{"f":"hd:w355.jpg","t":"바잉스퀘어 중문 카다로그","c":"다국어디자인"},{"f":"hd:w354.jpg","t":"동원파츠 영문 카다로그","c":"다국어디자인"},{"f":"hd:w353.jpg","t":"큐시스 영문 카다로그","c":"다국어디자인"},{"f":"hd:w352.jpg","t":"엔비피 헬스케어 영문 카다로그","c":"다국어디자인"},{"f":"hd:w351.jpg","t":"미러로이드 영문 카다로그","c":"다국어디자인"},{"f":"hd:w350.jpg","t":"함라에이원 영문 카다로그","c":"다국어디자인"},{"f":"hd:w349.jpg","t":"마케톤 주식회사 영문 카다로그","c":"다국어디자인"},{"f":"hd:w348.jpg","t":"Bio Health Platform 영문 카다로그","c":"다국어디자인"}];

  /* 기본 칼럼 글 (예시 콘텐츠) */
  var DEFAULT_POSTS = [
    {
      id: 6, img: "work16", date: "2026-05-22", isNew: true,
      title: "회사소개서, 첫 페이지에서 결정됩니다",
      summary: "바이어가 회사소개서를 보는 시간은 평균 30초. 첫 페이지에 무엇을 담아야 할까요?",
      body: [
        "바이어가 회사소개서 한 부를 보는 시간은 평균 30초 남짓이라고 합니다. 그 짧은 시간 안에 회사의 인상이 결정되고, 뒷장을 넘길지 말지가 정해집니다. 그래서 회사소개서에서 가장 공들여야 할 곳은 단연 첫 페이지입니다.",
        "첫 페이지에는 회사가 '무엇을 하는 곳인지'가 한 문장으로 보여야 합니다. 연혁이나 조직도, 인사말은 그 다음입니다. 우리가 어떤 문제를 해결하는 회사인지, 고객이 우리를 선택해야 할 이유가 무엇인지를 헤드카피 한 줄과 비주얼 하나로 전달하는 것이 핵심입니다.",
        "하오디자인은 회사소개서를 만들 때 항상 '첫 페이지 시안'부터 잡습니다. 첫 장의 방향이 정해지면 나머지 페이지의 톤과 구조는 자연스럽게 따라옵니다. 회사소개서 리뉴얼을 고민 중이라면, 지금 쓰고 있는 소개서의 첫 페이지를 다시 펼쳐보세요."
      ]
    },
    {
      id: 5, img: "work05", date: "2026-03-14",
      title: "카탈로그 제작 전 꼭 정해야 할 5가지",
      summary: "판형, 페이지 수, 종이, 후가공, 수량 — 견적이 달라지는 다섯 가지 기준을 정리했습니다.",
      body: [
        "카탈로그 견적을 문의하실 때 가장 많이 듣는 답변이 '내용에 따라 달라요'일 겁니다. 실제로 그렇습니다. 같은 카탈로그라도 다섯 가지 조건에 따라 견적이 크게 달라집니다.",
        "첫째는 판형입니다. A4를 기본으로 보지만 정사각형, 변형 판형은 종이 손실률이 달라져 단가에 영향을 줍니다. 둘째는 페이지 수 — 인쇄는 보통 4페이지 단위로 대수가 잡히기 때문에 한두 페이지 차이로 비용이 달라질 수 있습니다. 셋째는 종이. 같은 두께라도 코팅지·모조지·수입지의 가격 차이가 큽니다.",
        "넷째는 후가공입니다. 무광 코팅, 부분 UV, 박, 형압 등은 완성도를 크게 올리지만 공정이 추가됩니다. 다섯째는 수량 — 인쇄는 수량이 늘수록 부수당 단가가 내려가므로, 연간 사용량을 고려해 한 번에 제작하는 것이 유리한 경우가 많습니다.",
        "이 다섯 가지를 미리 정해두고 문의하시면 견적도 일정도 훨씬 빠르게 받아보실 수 있습니다."
      ]
    },
    {
      id: 4, img: "work01", date: "2026-01-20",
      title: "수출용 브로슈어, 번역만 하면 끝일까?",
      summary: "언어가 바뀌면 글줄 길이도, 서체도, 레이아웃도 달라집니다. 다국어 편집의 핵심.",
      body: [
        "국문 브로슈어를 영문으로 만든다고 하면 번역만 끝나면 될 것 같지만, 실제로는 레이아웃을 다시 설계해야 하는 경우가 대부분입니다. 같은 내용이라도 영어는 국문보다 글줄이 20~30% 길어지고, 중국어는 반대로 짧아집니다.",
        "서체 문제도 있습니다. 국문에서 쓰던 서체가 라틴 알파벳이나 한자를 지원하지 않는 경우가 많아, 언어별로 어울리는 서체 패밀리를 다시 골라야 합니다. 이때 브랜드의 인상이 흔들리지 않도록 굵기와 비례가 비슷한 서체를 찾는 것이 다국어 편집의 기술입니다.",
        "하오디자인은 영어 · 중국어 · 일본어 · 프랑스어 등 다국어 카탈로그를 원문 디자인과 같은 톤으로 제작합니다. 수출 박람회나 해외 바이어 미팅을 앞두고 있다면, 번역 원고와 함께 문의해 주세요."
      ]
    },
    {
      id: 3, img: "work13", date: "2025-12-02",
      title: "인쇄 사고를 줄이는 데이터 체크리스트",
      summary: "재단선, 색상 모드, 서체 아웃라인 — 인쇄 넘기기 전 마지막 점검 목록입니다.",
      body: [
        "인쇄 사고의 대부분은 인쇄소가 아니라 데이터 단계에서 시작됩니다. 모니터에서는 멀쩡했는데 인쇄물이 이상하게 나왔다면, 십중팔구 데이터 문제입니다.",
        "기본 체크리스트는 이렇습니다. ① 색상 모드가 RGB가 아닌 CMYK인지 ② 재단 여백(도련)이 사방 3mm 이상 잡혀 있는지 ③ 중요한 글자와 요소가 재단선에서 3mm 이상 안쪽에 있는지 ④ 서체가 아웃라인(윤곽선) 처리되어 있는지 ⑤ 이미지 해상도가 300dpi 이상인지.",
        "검정 표현도 주의가 필요합니다. 본문 텍스트는 K100 단색 검정으로, 넓은 배경 검정은 리치블랙으로 — 반대로 쓰면 글자가 번지거나 배경이 회색처럼 연하게 나옵니다.",
        "하오디자인에서 제작하는 모든 인쇄물은 출고 전 자체 검수 과정을 거치므로 이런 걱정 없이 맡기시면 됩니다. 다만 직접 데이터를 넘기실 때는 위 다섯 가지만 확인해도 사고의 90%는 막을 수 있습니다."
      ]
    },
    {
      id: 2, img: "work15", date: "2025-10-11",
      title: "리플렛과 브로슈어, 무엇이 다른가요?",
      summary: "접지 방식부터 쓰임새까지 — 우리 회사에 맞는 인쇄물 고르는 법.",
      body: [
        "견적 문의에서 의외로 자주 받는 질문입니다. 리플렛과 브로슈어, 팸플릿은 어떻게 다를까요?",
        "리플렛은 한 장의 종이를 접어 만드는 인쇄물입니다. 2단 · 3단 접지가 대표적이고, 제본이 없어 단가가 낮고 제작이 빠릅니다. 행사 안내, 매장 비치, 제품 요약 소개처럼 가볍게 배포하는 용도에 적합합니다.",
        "브로슈어는 여러 페이지를 제본한 책자 형태입니다. 중철(스테이플) 제본의 8~32페이지 구성이 흔하고, 회사소개서나 제품 카탈로그처럼 충분한 정보를 담아야 할 때 선택합니다.",
        "정리하면 — 한눈에 가볍게 전달할 내용이면 리플렛, 차분히 읽힐 정보량이면 브로슈어입니다. 어느 쪽이 맞을지 애매하다면 내용 분량과 사용 상황을 알려주세요. 가장 효율적인 형태를 제안해 드립니다."
      ]
    },
    {
      id: 1, img: "hd:w380.jpg", date: "2025-08-27",
      title: "포스터가 시선을 잡는 3초의 법칙",
      summary: "멀리서도 읽히는 포스터의 위계 설계 — 타이포와 컬러로 만드는 임팩트.",
      body: [
        "포스터는 걸어가는 사람의 시선을 3초 안에 붙잡아야 하는 매체입니다. 그래서 포스터 디자인의 핵심은 '다 보여주기'가 아니라 '하나만 크게 보여주기'입니다.",
        "정보의 위계를 세 단계로 나눠보세요. 1단계는 멀리서도 읽히는 메인 카피 — 행사명이나 핵심 메시지 하나. 2단계는 다가왔을 때 읽는 일시 · 장소 같은 핵심 정보. 3단계는 관심 있는 사람만 읽는 상세 내용입니다. 이 세 단계의 크기 차이가 클수록 포스터는 강해집니다.",
        "컬러는 배경과 글자의 명도 대비가 생명입니다. 화려한 색을 여러 개 쓰는 것보다, 강한 대비 한 쌍에 포인트 컬러 하나가 멀리서 더 잘 읽힙니다.",
        "전시 · 포럼 · 공연 포스터 제작을 준비 중이라면, 전하고 싶은 메시지 딱 하나만 정해서 와주세요. 나머지는 하오디자인이 설계합니다."
      ]
    }
  ];

  /* 메인 히어로 슬라이드 (헤드라인의 **단어** 는 오렌지 강조로 표시됨) */
  var DEFAULT_HERO = [
    {
      badge: "만족할 때까지, 완성도로 답합니다",
      l1: "수정이 부담되셨나요?", l2: "원하는 결과가 나올 때까지", l3: "**함께** 다듬습니다.",
      copy: "수정 횟수에 쫓기는 디자인이 아니라,\n**고객의 만족과 결과의 완성도**를 우선하는 디자인을 합니다.",
      img: "hd:w366.jpg"
    },
    {
      badge: "기획 · 디자인 · 인쇄 · 촬영 원스톱",
      l1: "흩어진 과정 없이", l2: "한 곳에서 끝내는", l3: "**원스톱** 제작.",
      copy: "카탈로그·브로슈어부터 사진촬영·인쇄까지,\n**하나의 팀**이 처음부터 끝까지 책임집니다.",
      img: "hd:w341.jpg"
    },
    {
      badge: "누적 4,500건 · 10년의 경험",
      l1: "브랜드의 첫인상을", l2: "10년의 노하우로", l3: "**설계**합니다.",
      copy: "업종별 특성을 이해하는 디자이너가\n**브랜드의 가치**를 한 장에 담아냅니다.",
      img: "hd:w380.jpg"
    }
  ];

  /* 메인 대표작 (관리자가 직접 지정 — 메인 모자이크 + 흐르는 띠) */
  var DEFAULT_FEATURED = DEFAULT_WORKS.slice(0, 8);

  /* 로고 (헤더·푸터 공통) */
  var DEFAULT_LOGO = "assets/img/logo.png";

  /* 파트너 로고 (메인 하단 흐르는 로고) */
  var DEFAULT_PARTNERS = [46, 48, 50, 52, 54, 56, 58, 68, 70, 72, 74, 76, 78, 80, 89, 91, 93, 95, 97, 99]
    .map(function (n) { return "assets/partners/p" + n + ".png"; });

  /* 수행기관 로고 (지원사업 페이지 다크 밴드) */
  var DEFAULT_GOV = ["assets/gov/gov_export.png", "assets/gov/gov_mss.png", "assets/gov/gov_sbiz.png"];

  /* 고객 후기 (관리자 '고객 후기' 탭에서 편집) — logo: 이미지 경로 또는 업로드(data:) */
  var DEFAULT_REVIEWS = [
    { logo: "assets/partners/p46.png", msg: "정보 정리부터 사진까지 알아서 챙겨주셔서 편했어요. 거래처 반응이 확실히 좋아졌습니다.", cite: "제조업 마케팅팀 김OO" },
    { logo: "assets/partners/p52.png", msg: "수출용 브로슈어를 영문·중문으로 동시에. 톤이 일관되게 잘 나왔습니다.", cite: "뷰티 브랜드 대표 이OO" },
    { logo: "assets/partners/p58.png", msg: "급한 일정에도 퀄리티를 놓치지 않았어요. 인쇄·후가공까지 한 번에 끝나 만족합니다.", cite: "식품 회사 홍보 박OO" },
    { logo: "assets/partners/p70.png", msg: "시안 단계부터 방향을 잘 잡아주셔서 수정이 거의 없었어요. 소통이 정말 편합니다.", cite: "IT 스타트업 대표 최OO" },
    { logo: "assets/partners/p80.png", msg: "회사소개서 덕분에 미팅 분위기가 달라졌습니다. 디자인이 영업을 한다는 걸 처음 느꼈어요.", cite: "건설사 기획팀 정OO" },
    { logo: "assets/partners/p93.png", msg: "패키지 리뉴얼 후 매대에서 확실히 눈에 띕니다. 다음 라인업도 맡길 예정이에요.", cite: "식품 브랜드 마케터 한OO" }
  ];

  /* 사이트 설정 */
  var DEFAULT_SETTINGS = { tel: "1666-2027", email: "sales@haodesign.co.kr" };

  /* SEO (관리자 'SEO 관리' 탭) — siteUrl + 페이지별 title/desc/keywords */
  var DEFAULT_SEO = {
    siteUrl: "https://haodesign.co.kr",
    ogImage: "assets/work-hd/large/w402.jpg",
    pages: {
      index: {
        title: "하오디자인 | 카탈로그·브로슈어·포스터·리플렛 제작 디자인",
        desc: "카탈로그·브로슈어·포스터·리플렛 디자인부터 인쇄·사진촬영까지. 10년 경력의 디자이너가 함께하는 원스톱 디자인 스튜디오, 하오디자인(HAO DESIGN).",
        keywords: "카탈로그제작, 브로슈어제작, 회사소개서제작, 리플렛제작, 포스터제작, 인쇄디자인, 편집디자인, 하오디자인" },
      about: {
        title: "회사소개 | 하오디자인 HAO DESIGN",
        desc: "2013년부터 카탈로그·브로슈어·포스터·리플렛 인쇄 디자인 한 길. 기획·디자인·촬영·인쇄·납품까지 원스톱으로 제공하는 디자인 스튜디오 하오디자인.",
        keywords: "하오디자인, 디자인스튜디오, 인쇄디자인회사, 편집디자인, 광진구 디자인" },
      service: {
        title: "서비스 | 카탈로그·브로슈어·포스터·CI·패키지·촬영 | 하오디자인",
        desc: "카탈로그·브로슈어, 팜플렛·리플렛, 포스터·전단지, CI·로고, 패키지·라벨, 제품촬영, 다국어디자인 — 분야별 제작 서비스를 안내합니다.",
        keywords: "카탈로그디자인, 브로슈어디자인, 리플렛제작, 포스터디자인, 로고제작, 패키지디자인, 제품촬영, 다국어카탈로그" },
      work: {
        title: "포트폴리오 | 하오디자인 제작 사례",
        desc: "하오디자인이 직접 기획·제작한 카탈로그·브로슈어·리플렛·포스터·CI·패키지·촬영·다국어 디자인 실제 작업 사례 모음.",
        keywords: "카탈로그 포트폴리오, 브로슈어 사례, 회사소개서 디자인, 인쇄물 제작 사례, 하오디자인 포트폴리오" },
      board: {
        title: "칼럼 | 인쇄와 디자인 이야기 | 하오디자인",
        desc: "카탈로그·브로슈어·인쇄 디자인을 준비할 때 알아두면 좋은 실무 이야기. 하오디자인의 디자인 칼럼.",
        keywords: "인쇄 가이드, 카탈로그 제작 팁, 회사소개서 기획, 디자인 칼럼, 인쇄 데이터" },
      support: {
        title: "정부지원사업 | 수출바우처·제조혁신바우처 디자인 제작 | 하오디자인",
        desc: "수출바우처·제조혁신바우처·소상공인 지원사업 공식 수행기관 하오디자인. 정부지원사업으로 카탈로그·브로슈어·다국어 홍보물 제작 비용 부담을 줄이세요.",
        keywords: "수출바우처, 제조혁신바우처, 정부지원사업 디자인, 바우처 카탈로그, 소상공인 지원사업, 수출바우처 수행기관" },
      contact: {
        title: "견적문의 | 하오디자인 HAO DESIGN",
        desc: "카탈로그·브로슈어·포스터·리플렛 제작 견적 문의. 간단한 내용만 남겨주시면 담당자가 빠르게 연락드립니다. 1666-2027",
        keywords: "디자인 견적, 카탈로그 견적, 브로슈어 견적, 인쇄 견적 문의, 하오디자인 문의" }
    }
  };

  /* 사이트 카피 (관리자 '카피 수정' 탭에서 편집)
     page: 적용 페이지 / sel: 대상 선택자 / tag: **강조** 변환 태그 / attr: 속성으로 적용(숫자 카운터 등) */
  var DEFAULT_COPY = [
    /* ───── 공통 (전 페이지) ───── */
    { key: "footer_tag", page: "all", sel: ".footer__top p", tag: "b", label: "푸터 소개 문구",
      value: "카탈로그 · 브로슈어 · 포스터 · 리플렛\n디자인 인쇄 원스톱 스튜디오" },
    { key: "contact_title", page: "all", sel: ".contact__title", tag: "b", label: "문의 패널 제목",
      value: "프로젝트를\n함께 시작할까요?" },
    { key: "contact_desc", page: "all", sel: ".contact__desc", tag: "b", label: "문의 패널 설명",
      value: "간단한 내용만 남겨주세요.\n담당자가 확인 후 빠르게 연락드립니다." },

    /* ───── 메인 ───── */
    { key: "intro_words", page: "index", sel: ".intro__words", tag: "em", label: "인트로 문장",
      value: "예쁘기만 한 디자인이 아니라, 브랜드의 메시지를 정확히 전달하고 **실제 성과로 이어지는 디자인.** 그것이 하오디자인이 일하는 방식입니다." },
    { key: "cnt1_n", page: "index", sel: ".intro .counter:nth-child(1) strong", attr: "data-to", label: "지표① 숫자", value: "4500" },
    { key: "cnt1_t", page: "index", sel: ".intro .counter:nth-child(1) em", tag: "b", label: "지표① 이름", value: "누적 제작" },
    { key: "cnt2_n", page: "index", sel: ".intro .counter:nth-child(2) strong", attr: "data-to", label: "지표② 숫자", value: "10" },
    { key: "cnt2_t", page: "index", sel: ".intro .counter:nth-child(2) em", tag: "b", label: "지표② 이름", value: "디자인 경력" },
    { key: "cnt3_n", page: "index", sel: ".intro .counter:nth-child(3) strong", attr: "data-to", label: "지표③ 숫자", value: "98" },
    { key: "cnt3_t", page: "index", sel: ".intro .counter:nth-child(3) em", tag: "b", label: "지표③ 이름", value: "재의뢰율" },
    { key: "cnt4_n", page: "index", sel: ".intro .counter:nth-child(4) strong", attr: "data-to", label: "지표④ 숫자", value: "5" },
    { key: "cnt4_t", page: "index", sel: ".intro .counter:nth-child(4) em", tag: "b", label: "지표④ 이름", value: "다국어 대응" },
    { key: "diff_title", page: "index", sel: ".diff__title", tag: "em", label: "강점 섹션 제목",
      value: "수십 개 기업이 **반복적으로**\n아르시에를 찾는 이유" },
    { key: "diff_sub", page: "index", sel: ".diff__sub", tag: "b", label: "강점 섹션 설명",
      value: "단지 예쁘게만 만들어주는 디자인 회사가 아닙니다.\n걱정을 덜어주고, 결과까지 책임지는 기업 파트너 입니다." },
    { key: "dcard1", page: "index", sel: ".diff__cards .dcard:nth-child(1) h3", tag: "b", label: "강점 카드① 제목",
      value: "단발성 외주가 아닌,\n장기적으로도 소통이 잘 되니까!" },
    { key: "dcard2", page: "index", sel: ".diff__cards .dcard:nth-child(2) h3", tag: "b", label: "강점 카드② 제목",
      value: "수정 횟수 제한 없다는 것이,\n이렇게 큰 장점인줄 몰랐어요." },
    { key: "dcard3", page: "index", sel: ".diff__cards .dcard:nth-child(3) h3", tag: "b", label: "강점 카드③ 제목",
      value: "디테일한 설명 없이도,\n의도와 맥락을 정확히 캐치해요." },
    { key: "dcard4", page: "index", sel: ".diff__cards .dcard:nth-child(4) h3", tag: "b", label: "강점 카드④ 제목",
      value: "일정 준수는 당연하고,\n진행 흐름까지 책임집니다." },
    { key: "work_lead", page: "index", sel: ".work__lead", tag: "b", label: "제작 사례 설명",
      value: "하오디자인이 직접 기획하고 완성한 실제 작업물입니다." },
    { key: "reviews_title", page: "index", sel: ".reviews__head h2", tag: "b", label: "고객 후기 제목",
      value: "다시 찾아주시는 이유" },
    { key: "intro_tag", page: "index", sel: ".intro .section-tag", tag: "b", label: "인트로 — 섹션 태그", value: "WHY HAO DESIGN" },
    { key: "diff_tag", page: "index", sel: ".diff__tag", tag: "b", label: "강점 — 섹션 태그", value: "Differentiator" },
    { key: "dcard1_t", page: "index", sel: ".diff__cards .dcard:nth-child(1) .dcard__tags", list: true, label: "강점 카드① 태그 ( | 구분)",
      value: "# 빠른 응답 | # 본질적인 이해 기반 | # 대화가 잘 되는 회사" },
    { key: "dcard2_t", page: "index", sel: ".diff__cards .dcard:nth-child(2) .dcard__tags", list: true, label: "강점 카드② 태그 ( | 구분)",
      value: "# 심리적 편안함 | # 확실한 책임감 | # 만족스러운 결과" },
    { key: "dcard3_t", page: "index", sel: ".diff__cards .dcard:nth-child(3) .dcard__tags", list: true, label: "강점 카드③ 태그 ( | 구분)",
      value: "# 본질적인 이해 | # 수많은 경험과 데이터 | # 진심어린 내부 상황 고려" },
    { key: "dcard4_t", page: "index", sel: ".diff__cards .dcard:nth-child(4) .dcard__tags", list: true, label: "강점 카드④ 태그 ( | 구분)",
      value: "# 마감기한 준수 | # 확실한 일정 관리 | # 불안함 100% 해소" },
    { key: "work_tag", page: "index", sel: ".work__head .section-tag", tag: "b", label: "제작 사례 — 섹션 태그", value: "SELECTED WORK" },
    { key: "work_title", page: "index", sel: ".work__title", tag: "b", label: "제작 사례 — 제목", value: "제작 사례" },
    { key: "svcs_tag", page: "index", sel: ".services__head .section-tag", tag: "b", label: "서비스 — 섹션 태그", value: "WHAT WE DO" },
    { key: "svcs_title", page: "index", sel: ".services__title", tag: "b", label: "서비스 — 제목", value: "디자인 서비스" },
    { key: "svc1_n", page: "index", sel: ".svc-list .svc:nth-child(1) .svc__name", tag: "b", label: "서비스① 이름", value: "카탈로그 · 브로슈어" },
    { key: "svc1_t", page: "index", sel: ".svc-list .svc:nth-child(1) .svc__tags", tag: "b", label: "서비스① 부가", value: "제품 · 회사소개" },
    { key: "svc2_n", page: "index", sel: ".svc-list .svc:nth-child(2) .svc__name", tag: "b", label: "서비스② 이름", value: "포스터 · 리플렛" },
    { key: "svc2_t", page: "index", sel: ".svc-list .svc:nth-child(2) .svc__tags", tag: "b", label: "서비스② 부가", value: "홍보 · 행사" },
    { key: "svc3_n", page: "index", sel: ".svc-list .svc:nth-child(3) .svc__name", tag: "b", label: "서비스③ 이름", value: "CI · 로고 · 브랜딩" },
    { key: "svc3_t", page: "index", sel: ".svc-list .svc:nth-child(3) .svc__tags", tag: "b", label: "서비스③ 부가", value: "브랜드 아이덴티티" },
    { key: "svc4_n", page: "index", sel: ".svc-list .svc:nth-child(4) .svc__name", tag: "b", label: "서비스④ 이름", value: "패키지 · 라벨" },
    { key: "svc4_t", page: "index", sel: ".svc-list .svc:nth-child(4) .svc__tags", tag: "b", label: "서비스④ 부가", value: "제품 패키지" },
    { key: "svc5_n", page: "index", sel: ".svc-list .svc:nth-child(5) .svc__name", tag: "b", label: "서비스⑤ 이름", value: "제품 · 광고 사진촬영" },
    { key: "svc5_t", page: "index", sel: ".svc-list .svc:nth-child(5) .svc__tags", tag: "b", label: "서비스⑤ 부가", value: "자체 스튜디오" },
    { key: "svc6_n", page: "index", sel: ".svc-list .svc:nth-child(6) .svc__name", tag: "b", label: "서비스⑥ 이름", value: "상세페이지 · 웹" },
    { key: "svc6_t", page: "index", sel: ".svc-list .svc:nth-child(6) .svc__tags", tag: "b", label: "서비스⑥ 부가", value: "온라인 콘텐츠" },
    { key: "proc_tag", page: "index", sel: ".process__head .section-tag", tag: "b", label: "진행 과정 — 섹션 태그", value: "HOW IT WORKS" },
    { key: "proc_title", page: "index", sel: ".process__head h2", tag: "b", label: "진행 과정 — 제목", value: "진행 과정" },
    { key: "pst1_h", page: "index", sel: ".process .tstep:nth-child(2) h3", tag: "b", label: "진행 과정① 제목", value: "문의 · 상담" },
    { key: "pst1_p", page: "index", sel: ".process .tstep:nth-child(2) p", tag: "b", label: "진행 과정① 설명", value: "전화(1666-2027) 또는 온라인으로 프로젝트를 알려주시면 빠르게 상담합니다." },
    { key: "pst2_h", page: "index", sel: ".process .tstep:nth-child(3) h3", tag: "b", label: "진행 과정② 제목", value: "견적 · 계약" },
    { key: "pst2_p", page: "index", sel: ".process .tstep:nth-child(3) p", tag: "b", label: "진행 과정② 설명", value: "요구사항에 맞춰 합리적인 견적과 일정·범위를 확정합니다." },
    { key: "pst3_h", page: "index", sel: ".process .tstep:nth-child(4) h3", tag: "b", label: "진행 과정③ 제목", value: "기획 · 디자인" },
    { key: "pst3_p", page: "index", sel: ".process .tstep:nth-child(4) p", tag: "b", label: "진행 과정③ 설명", value: "콘셉트 설계와 시안 작업. 충분한 소통으로 방향을 맞춰갑니다." },
    { key: "pst4_h", page: "index", sel: ".process .tstep:nth-child(5) h3", tag: "b", label: "진행 과정④ 제목", value: "수정 · 검수" },
    { key: "pst4_p", page: "index", sel: ".process .tstep:nth-child(5) p", tag: "b", label: "진행 과정④ 설명", value: "피드백을 반영해 완성도를 높이고 인쇄 전 최종 검수를 진행합니다." },
    { key: "pst5_h", page: "index", sel: ".process .tstep:nth-child(6) h3", tag: "b", label: "진행 과정⑤ 제목", value: "인쇄 · 납품" },
    { key: "pst5_p", page: "index", sel: ".process .tstep:nth-child(6) p", tag: "b", label: "진행 과정⑤ 설명", value: "최적의 인쇄·후가공으로 제작 후 안전하게 납품해 드립니다." },
    { key: "reviews_tag", page: "index", sel: ".reviews__head .section-tag", tag: "b", label: "고객 후기 — 섹션 태그", value: "CLIENT VOICE" },
    { key: "reviews_note", page: "index", sel: ".reviews__note", tag: "b", label: "고객 후기 — 보조 설명",
      value: "함께한 클라이언트들이 남겨주신\n실제 프로젝트 후기입니다." },
    { key: "partners_tag", page: "index", sel: ".partners__head .section-tag", tag: "b", label: "파트너 — 섹션 태그", value: "PARTNERS" },
    { key: "partners_title", page: "index", sel: ".partners__head h2", tag: "b", label: "파트너 — 제목", value: "고객과 함께 걸어가는 하오디자인" },

    /* ───── 회사소개 ───── */
    { key: "ab_cover1", page: "about", sel: ".acover__title .line:nth-child(1) > span", tag: "em", label: "커버 제목 1줄", value: "우리는 종이 한 장의" },
    { key: "ab_cover2", page: "about", sel: ".acover__title .line:nth-child(2) > span", tag: "em", label: "커버 제목 2줄", value: "**힘**을 믿습니다" },
    { key: "ab_quote", page: "about", sel: ".astory__quote", tag: "b", label: "스토리 — 인용구",
      value: "“잘 만든 카탈로그 한 권이\n영업사원 열 명의 몫을 합니다.”" },
    { key: "ab_p1", page: "about", sel: ".astory__body p:nth-of-type(1)", tag: "b", label: "스토리 — 본문 1문단",
      value: "하오디자인은 2013년부터 카탈로그 · 브로슈어 · 포스터 · 리플렛 등 인쇄 디자인 한 길을 걸어왔습니다. 화면 속 디자인이 넘쳐나는 시대에도, 손에 잡히는 종이 한 장이 만들어내는 신뢰의 무게는 다르다고 믿기 때문입니다." },
    { key: "ab_p2", page: "about", sel: ".astory__body p:nth-of-type(2)", tag: "b", label: "스토리 — 본문 2문단",
      value: "우리는 디자인만 하고 끝내지 않습니다. 기획과 카피, 사진촬영, 인쇄와 후가공, 납품까지 — 결과물이 손에 쥐어지는 마지막 순간까지 하나의 팀이 책임집니다. 그래서 하오디자인의 작업에는 공정 사이의 어긋남이 없습니다." },
    { key: "ab_p3", page: "about", sel: ".astory__body p:nth-of-type(3)", tag: "b", label: "스토리 — 본문 3문단",
      value: "제조, 뷰티, 식품, 의료, IT — 업종이 다르면 언어도 다릅니다. 10년의 경험으로 업종의 언어를 먼저 이해하고, 영어 · 중국어 · 일본어 등 수출 시장의 언어까지 한 번에 담아냅니다." },
    { key: "ab_st1_n", page: "about", sel: ".astats .astat:nth-child(1) strong", attr: "data-to", label: "다크 지표① 숫자", value: "4500" },
    { key: "ab_st1_t", page: "about", sel: ".astats .astat:nth-child(1) em", tag: "b", label: "다크 지표① 이름", value: "누적 제작" },
    { key: "ab_st2_n", page: "about", sel: ".astats .astat:nth-child(2) strong", attr: "data-to", label: "다크 지표② 숫자", value: "10" },
    { key: "ab_st2_t", page: "about", sel: ".astats .astat:nth-child(2) em", tag: "b", label: "다크 지표② 이름", value: "디자인 경력" },
    { key: "ab_st3_n", page: "about", sel: ".astats .astat:nth-child(3) strong", attr: "data-to", label: "다크 지표③ 숫자", value: "98" },
    { key: "ab_st3_t", page: "about", sel: ".astats .astat:nth-child(3) em", tag: "b", label: "다크 지표③ 이름", value: "재의뢰율" },
    { key: "ab_st4_n", page: "about", sel: ".astats .astat:nth-child(4) strong", attr: "data-to", label: "다크 지표④ 숫자", value: "5" },
    { key: "ab_st4_t", page: "about", sel: ".astats .astat:nth-child(4) em", tag: "b", label: "다크 지표④ 이름", value: "다국어 대응" },
    { key: "hw_title", page: "about", sel: ".hway__title", tag: "em", label: "일하는 방식 — 제목", value: "하오디자인은\n다릅니다" },
    { key: "hw_m1", page: "about", sel: ".hway__menu li:nth-child(1)", tag: "b", label: "일하는 방식 — 메뉴①", value: "원스톱 책임 제작" },
    { key: "hw_m2", page: "about", sel: ".hway__menu li:nth-child(2)", tag: "b", label: "일하는 방식 — 메뉴②", value: "업종의 언어로 디자인" },
    { key: "hw_m3", page: "about", sel: ".hway__menu li:nth-child(3)", tag: "b", label: "일하는 방식 — 메뉴③", value: "다국어 · 수출 대응" },
    { key: "hw_m4", page: "about", sel: ".hway__menu li:nth-child(4)", tag: "b", label: "일하는 방식 — 메뉴④", value: "만족할 때까지 수정" },
    { key: "hw_p1h", page: "about", sel: ".hway__panel:nth-child(1) h3", tag: "b", label: "일하는 방식 — 패널① 제목", value: "원스톱 책임 제작" },
    { key: "hw_p1p", page: "about", sel: ".hway__panel:nth-child(1) p", tag: "b", label: "일하는 방식 — 패널① 내용",
      value: "기획 · 카피 · 디자인 · 촬영 · 인쇄 · 납품까지 하나의 팀이 끝까지 책임집니다.\n공정 사이의 어긋남이 없어 결과물의 톤이 처음부터 끝까지 일관됩니다." },
    { key: "hw_p2h", page: "about", sel: ".hway__panel:nth-child(2) h3", tag: "b", label: "일하는 방식 — 패널② 제목", value: "업종의 언어로 디자인" },
    { key: "hw_p2p", page: "about", sel: ".hway__panel:nth-child(2) p", tag: "b", label: "일하는 방식 — 패널② 내용",
      value: "제조 · 뷰티 · 식품 · 의료 · IT — 업종이 다르면 언어도 다릅니다.\n업종별 표현과 규제를 이해한 디자인으로 메시지가 정확히 닿게 합니다." },
    { key: "hw_p3h", page: "about", sel: ".hway__panel:nth-child(3) h3", tag: "b", label: "일하는 방식 — 패널③ 제목", value: "다국어 · 수출 대응" },
    { key: "hw_p3p", page: "about", sel: ".hway__panel:nth-child(3) p", tag: "b", label: "일하는 방식 — 패널③ 내용",
      value: "영어 · 중국어 · 일본어 · 프랑스어 — 언어가 바뀌어도 톤은 흔들리지 않습니다.\n다국어 편집으로 수출 시장까지 한 번에 대응합니다." },
    { key: "hw_p4h", page: "about", sel: ".hway__panel:nth-child(4) h3", tag: "b", label: "일하는 방식 — 패널④ 제목", value: "만족할 때까지 수정" },
    { key: "hw_p4p", page: "about", sel: ".hway__panel:nth-child(4) p", tag: "b", label: "일하는 방식 — 패널④ 내용",
      value: "수정 횟수에 쫓기지 않습니다.\n고객의 만족과 결과의 완성도가 하오디자인의 기준입니다." },
    { key: "fac1_h", page: "about", sel: ".fac .fac__col:nth-child(1) h3", tag: "b", label: "제작설비 카드① 제목", value: "인쇄 · 후가공" },
    { key: "fac1_p", page: "about", sel: ".fac .fac__col:nth-child(1) > p", tag: "b", label: "제작설비 카드① 설명",
      value: "옵셋 · 디지털 인쇄부터 코팅 · 박 · 형압까지, 인쇄 사고 없이 완성합니다." },
    { key: "fac2_h", page: "about", sel: ".fac .fac__col:nth-child(2) h3", tag: "b", label: "제작설비 카드② 제목", value: "사진촬영 스튜디오" },
    { key: "fac2_p", page: "about", sel: ".fac .fac__col:nth-child(2) > p", tag: "b", label: "제작설비 카드② 설명",
      value: "자체 스튜디오에서 디자인과 촬영을 함께 — 톤이 일관된 결과물을 만듭니다." },
    { key: "fac3_h", page: "about", sel: ".fac .fac__col:nth-child(3) h3", tag: "b", label: "제작설비 카드③ 제목", value: "디자인 스튜디오" },
    { key: "fac3_p", page: "about", sel: ".fac .fac__col:nth-child(3) > p", tag: "b", label: "제작설비 카드③ 설명",
      value: "기획부터 검수까지, 전담 인력이 완성도를 끌어올립니다." },
    { key: "ab_addr", page: "about", sel: ".map-info > div:nth-child(1) p", tag: "b", label: "오시는길 — 주소", value: "서울특별시 광진구" },
    { key: "fac_tag", page: "about", sel: "#facility .section-tag", tag: "b", label: "제작설비 — 섹션 태그", value: "FACILITY" },
    { key: "fac_title", page: "about", sel: "#facility .page__title", tag: "b", label: "제작설비 — 제목", value: "제작설비" },
    { key: "fac_lead", page: "about", sel: "#facility .sp-lead", tag: "em", label: "제작설비 — 설명",
      value: "디자인부터 인쇄 · 촬영까지, 한 곳에서 끝나는 이유입니다." },
    { key: "loc_tag", page: "about", sel: "#location .section-tag", tag: "b", label: "오시는길 — 섹션 태그", value: "LOCATION" },
    { key: "loc_title", page: "about", sel: "#location .page__title", tag: "b", label: "오시는길 — 제목", value: "오시는길" },

    /* ───── 지원사업 ───── */
    { key: "sp_title0", page: "support", sel: ".subhero__title", tag: "b", label: "상단 제목", value: "지원사업" },
    { key: "sp_desc", page: "support", sel: ".subhero__desc", tag: "b", label: "상단 설명",
      value: "정부지원사업 공식 수행기관 — 신청 준비부터 제작, 결과보고까지 함께합니다." },
    { key: "sp_tag1", page: "support", sel: "main > section:nth-of-type(2) .section-tag", tag: "b", label: "지표 — 섹션 태그", value: "GOVERNMENT SUPPORT" },
    { key: "sp_head", page: "support", sel: "main > section:nth-of-type(2) .page__title", tag: "b", label: "지표 섹션 제목",
      value: "정부지원사업 공식 수행기관,\n하오디자인" },
    { key: "sp_lead", page: "support", sel: ".sp-lead", tag: "em", label: "지표 섹션 설명",
      value: "카탈로그 · 브로슈어 · 패키지 · 다국어 홍보물 제작은 다양한 정부 지원사업의 지원 항목에 포함됩니다. **기업 부담금의 일부만으로** 전문 디자인 결과물을 만들 수 있습니다. 참여 가능 여부는 부담 없이 문의해 주세요." },
    { key: "tk1_n", page: "support", sel: ".ticket .tstat:nth-child(1) strong", attr: "data-to", label: "티켓 지표① 숫자", value: "5" },
    { key: "tk1_t", page: "support", sel: ".ticket .tstat:nth-child(1) em", tag: "b", label: "티켓 지표① 이름", value: "정부 핵심 사업 공식 수행기관" },
    { key: "tk2_n", page: "support", sel: ".ticket .tstat:nth-child(2) strong", attr: "data-to", label: "티켓 지표② 숫자", value: "1370" },
    { key: "tk2_t", page: "support", sel: ".ticket .tstat:nth-child(2) em", tag: "b", label: "티켓 지표② 이름", value: "바우처 문의 건수" },
    { key: "tk3_n", page: "support", sel: ".ticket .tstat:nth-child(3) strong", attr: "data-to", label: "티켓 지표③ 숫자", value: "412" },
    { key: "tk3_t", page: "support", sel: ".ticket .tstat:nth-child(3) em", tag: "b", label: "티켓 지표③ 이름", value: "바우처 작업 건수" },
    { key: "tk4_n", page: "support", sel: ".ticket .tstat:nth-child(4) strong", attr: "data-to", label: "티켓 지표④ 숫자", value: "16" },
    { key: "tk4_t", page: "support", sel: ".ticket .tstat:nth-child(4) em", tag: "b", label: "티켓 지표④ 이름", value: "신청 가능 분야" },
    { key: "sp_orgs", page: "support", sel: ".sp-orgs", tag: "b", label: "수행기관 한 줄",
      value: "수출지원기반활용사업 · 중소벤처기업부 · 소상공인시장진흥공단 수행기관" },
    { key: "vc_tag", page: "support", sel: "main > section:nth-of-type(3) .section-tag", tag: "b", label: "분야 — 섹션 태그", value: "VOUCHER" },
    { key: "vc_title", page: "support", sel: "main > section:nth-of-type(3) .page__title", tag: "b", label: "분야 — 제목", value: "하오디자인 지원사업 분야" },
    { key: "vr1_h", page: "support", sel: ".vrows .vrow:nth-child(1) h3", tag: "b", label: "분야① 이름", value: "수출바우처" },
    { key: "vr1_e", page: "support", sel: ".vrows .vrow:nth-child(1) em", tag: "b", label: "분야① 영문", value: "EXPORT VOUCHER" },
    { key: "vr1_p1", page: "support", sel: ".vrows .vrow:nth-child(1) .vrow__body p:nth-of-type(1)", tag: "b", label: "분야① 설명 1",
      value: "기업의 수출 경쟁력 제고를 목적으로, 필요한 지원 서비스를 기업이 직접 선택해 활용할 수 있도록 정부가 비용을 바우처 방식으로 지원하는 제도입니다." },
    { key: "vr1_p2", page: "support", sel: ".vrows .vrow:nth-child(1) .vrow__body p:nth-of-type(2)", tag: "b", label: "분야① 설명 2",
      value: "일정 기준을 충족한 기업을 심사를 통해 선정하며, 선정된 기업에는 바우처가 지급됩니다. 이후 기업은 원하는 수행기관을 자율적으로 결정해 필요한 서비스를 제공받게 되며, 국내에서 운영되는 대표적인 규모의 수출지원 프로그램 중 하나입니다." },
    { key: "vr1_at", page: "support", sel: ".vrows .vrow:nth-child(1) .vrow__areas > span", tag: "b", label: "분야① 영역 제목", value: "신청 가능한 바우처 사업영역" },
    { key: "vr1_al", page: "support", sel: ".vrows .vrow:nth-child(1) .vrow__areas ul", list: true, item: "li", label: "분야① 영역 목록 ( | 구분)",
      value: "소재·부품·장비 선도기업육성 | 소비재 선도기업육성 | 내수기업 | 중견 글로벌 지원사업 | 수출 유망기업 | 스마트 제조혁신 | 수출 성장기업 | 수출 초보기업 | 수출 강소기업 | 서비스 선도기업육성" },
    { key: "vr2_h", page: "support", sel: ".vrows .vrow:nth-child(2) h3", tag: "b", label: "분야② 이름", value: "제조혁신바우처" },
    { key: "vr2_e", page: "support", sel: ".vrows .vrow:nth-child(2) em", tag: "b", label: "분야② 영문", value: "MANUFACTURING INNOVATION" },
    { key: "vr2_p1", page: "support", sel: ".vrows .vrow:nth-child(2) .vrow__body p:nth-of-type(1)", tag: "b", label: "분야② 설명 1",
      value: "제조혁신바우처 지원사업은 제조 중소기업의 경쟁력 강화를 위해 정부가 제공하는 바우처형 지원제도입니다." },
    { key: "vr2_p2", page: "support", sel: ".vrows .vrow:nth-child(2) .vrow__body p:nth-of-type(2)", tag: "b", label: "분야② 설명 2",
      value: "성장 가능성이 높은 제조 중소기업이 기업 진단 결과에 따라 컨설팅 · 기술지원 · 마케팅 등 다양한 서비스를 바우처 형태로 지원받을 수 있도록 설계된 사업입니다." },
    { key: "vr2_at", page: "support", sel: ".vrows .vrow:nth-child(2) .vrow__areas > span", tag: "b", label: "분야② 영역 제목", value: "신청 가능한 바우처 사업영역" },
    { key: "vr2_al", page: "support", sel: ".vrows .vrow:nth-child(2) .vrow__areas ul", list: true, item: "li", label: "분야② 영역 목록 ( | 구분)",
      value: "일반 제조혁신 | 탄소중립 경영 | 스마트공장 연계형 | 지역특화 제조 | 재기·구조개선 지원형 | 디지털 전환(DX) 연계형" },
    { key: "vr3_h", page: "support", sel: ".vrows .vrow:nth-child(3) h3", tag: "b", label: "분야③ 이름", value: "소상공인 지원사업" },
    { key: "vr3_e", page: "support", sel: ".vrows .vrow:nth-child(3) em", tag: "b", label: "분야③ 영문", value: "SMALL BUSINESS" },
    { key: "vr3_p1", page: "support", sel: ".vrows .vrow:nth-child(3) .vrow__body p:nth-of-type(1)", tag: "b", label: "분야③ 설명 1",
      value: "소상공인시장진흥공단은 중소벤처기업부 산하의 준정부기관으로, 소상공인 및 전통시장 활성화를 위해 설립되었습니다." },
    { key: "vr3_p2", page: "support", sel: ".vrows .vrow:nth-child(3) .vrow__body p:nth-of-type(2)", tag: "b", label: "분야③ 설명 2",
      value: "소진공은 소상공인의 창업 · 경영 안정 · 성장 · 재기 등을 포괄하는 다양한 지원사업을 운영합니다. 리플렛 · 메뉴판 · 매장 홍보물 등 소규모 제작에 활용하기 좋습니다." },
    { key: "sp_ptag", page: "support", sel: "main > section:nth-of-type(4) .section-tag", tag: "b", label: "절차 — 섹션 태그", value: "PROCESS" },
    { key: "sp_ptitle", page: "support", sel: "main > section:nth-of-type(4) .page__title", tag: "b", label: "절차 — 제목", value: "바우처사업 수행 진행절차" },
    { key: "spt1_h", page: "support", sel: ".timeline .tstep:nth-child(2) h3", tag: "b", label: "절차① 제목", value: "사업신청 및 선정" },
    { key: "spt1_p", page: "support", sel: ".timeline .tstep:nth-child(2) p", tag: "b", label: "절차① 설명", value: "사업별 신청기업 평가 및 선정 — 신청서 준비를 함께 도와드립니다." },
    { key: "spt2_h", page: "support", sel: ".timeline .tstep:nth-child(3) h3", tag: "b", label: "절차② 제목", value: "납부 및 발급" },
    { key: "spt2_p", page: "support", sel: ".timeline .tstep:nth-child(3) p", tag: "b", label: "절차② 설명", value: "기업분담금 납부 후 바우처가 발급됩니다." },
    { key: "spt3_h", page: "support", sel: ".timeline .tstep:nth-child(4) h3", tag: "b", label: "절차③ 제목", value: "메뉴판 선택" },
    { key: "spt3_p", page: "support", sel: ".timeline .tstep:nth-child(4) p", tag: "b", label: "절차③ 설명", value: "메뉴판 내에서 필요한 서비스를 선택합니다." },
    { key: "spt4_h", page: "support", sel: ".timeline .tstep:nth-child(5) h3", tag: "b", label: "절차④ 제목", value: "서비스 진행" },
    { key: "spt4_p", page: "support", sel: ".timeline .tstep:nth-child(5) p", tag: "b", label: "절차④ 설명", value: "선택한 디자인 · 마케팅 서비스를 진행합니다." },
    { key: "spt5_h", page: "support", sel: ".timeline .tstep:nth-child(6) h3", tag: "b", label: "절차⑤ 제목", value: "바우처 정산" },
    { key: "spt5_p", page: "support", sel: ".timeline .tstep:nth-child(6) p", tag: "b", label: "절차⑤ 설명", value: "운영기관 · 수행기관 간 사업 비용을 정산합니다." },
    { key: "fq_tag", page: "support", sel: "main > section:nth-of-type(5) .section-tag", tag: "b", label: "FAQ — 섹션 태그", value: "FAQ" },
    { key: "fq_title", page: "support", sel: "main > section:nth-of-type(5) .page__title", tag: "b", label: "FAQ — 제목", value: "자주 묻는 질문" },
    { key: "fq1_q", page: "support", sel: ".faq .faq__item:nth-of-type(1) .faq__qt", tag: "b", label: "FAQ① 질문", value: "수출바우처 사업 신청 방법은 어떻게 되나요?" },
    { key: "fq1_a", page: "support", sel: ".faq .faq__item:nth-of-type(1) .faq__a p", tag: "b", label: "FAQ① 답변",
      value: "수출바우처 홈페이지에서 온라인으로 신청하실 수 있습니다. 동일 공고 내 최대 2개 사업까지 신청 가능하나, 우선순위가 높은 1개 사업만 선정됩니다. 제출 서류를 바탕으로 서면 및 현장평가를 거쳐 지원 자격 심사 후 최종 선정됩니다." },
    { key: "fq2_q", page: "support", sel: ".faq .faq__item:nth-of-type(2) .faq__qt", tag: "b", label: "FAQ② 질문", value: "신청 준비 단계부터 도움을 받을 수 있나요?" },
    { key: "fq2_a", page: "support", sel: ".faq .faq__item:nth-of-type(2) .faq__a p", tag: "b", label: "FAQ② 답변",
      value: "네, 가능합니다. 사업 이해부터 신청서 작성 방법까지 전반적인 가이드를 제공해드립니다. 컨설팅은 무료로 진행되며, 접수 순으로 순차 안내해드립니다." },
    { key: "fq3_q", page: "support", sel: ".faq .faq__item:nth-of-type(3) .faq__qt", tag: "b", label: "FAQ③ 질문", value: "작년에 선정되어 현재 사업을 진행 중인데, 올해 모집에도 지원할 수 있나요?" },
    { key: "fq3_a", page: "support", sel: ".faq .faq__item:nth-of-type(3) .faq__a p", tag: "b", label: "FAQ③ 답변",
      value: "운영기관과의 협약 기간이 종료되지 않은 경우, 해당 기간 내 모집 사업에는 중복 참여가 불가합니다. 다만 모집 차수에 따라 일부 예외 조건이 적용될 수 있으니, 공고문을 확인하시기 바랍니다." },
    { key: "fq4_q", page: "support", sel: ".faq .faq__item:nth-of-type(4) .faq__qt", tag: "b", label: "FAQ④ 질문", value: "수출바우처 사업 외에 타 기관의 수출지원사업도 중복 신청이 가능한가요?" },
    { key: "fq4_a", page: "support", sel: ".faq .faq__item:nth-of-type(4) .faq__a p", tag: "b", label: "FAQ④ 답변",
      value: "네, 가능합니다. 수출바우처 사업과 별도로 KOTRA, 중진공 등 유관기관의 지원사업은 신청에 제한이 없습니다. 다만, 타 지원사업의 운영 기준에 따라 중복 참여가 제한될 수 있으므로, 각 사업별 공고 내용을 확인하시기 바랍니다." },
    { key: "fq5_q", page: "support", sel: ".faq .faq__item:nth-of-type(5) .faq__qt", tag: "b", label: "FAQ⑤ 질문", value: "결과보고서 작성도 어려운데, 안내를 받을 수 있을까요?" },
    { key: "fq5_a", page: "support", sel: ".faq .faq__item:nth-of-type(5) .faq__a p", tag: "b", label: "FAQ⑤ 답변",
      value: "사업 종료 후 진행되는 결과보고 역시 평가 기준과 작성 요건을 정확히 이해하는 것이 중요합니다. 하오디자인은 항목별 작성 기준과 필수 포함 내용에 대한 명확한 가이드를 제공합니다. 결과보고 완성도를 높이고 싶다면, 전문 컨설팅을 통해 방향을 점검해보시기 바랍니다." },

    /* ───── 서비스 페이지 (공통 정적 섹션) ───── */
    { key: "sv_ptag", page: "service", sel: "main > section:nth-of-type(2) .section-tag", tag: "b", label: "진행 과정 — 섹션 태그", value: "PROCESS" },
    { key: "sv_ptitle", page: "service", sel: "main > section:nth-of-type(2) .page__title", tag: "b", label: "진행 과정 — 제목", value: "진행 과정" },
    { key: "svt1_h", page: "service", sel: ".timeline .tstep:nth-child(2) h3", tag: "b", label: "진행 과정① 제목", value: "문의 접수" },
    { key: "svt1_p", page: "service", sel: ".timeline .tstep:nth-child(2) p", tag: "b", label: "진행 과정① 설명", value: "전화(1666-2027) 또는 견적 문의로 내용을 남겨주세요." },
    { key: "svt2_h", page: "service", sel: ".timeline .tstep:nth-child(3) h3", tag: "b", label: "진행 과정② 제목", value: "상담 · 견적" },
    { key: "svt2_p", page: "service", sel: ".timeline .tstep:nth-child(3) p", tag: "b", label: "진행 과정② 설명", value: "담당자가 사양과 일정을 잡고 견적을 안내합니다." },
    { key: "svt3_h", page: "service", sel: ".timeline .tstep:nth-child(4) h3", tag: "b", label: "진행 과정③ 제목", value: "디자인 작업" },
    { key: "svt3_p", page: "service", sel: ".timeline .tstep:nth-child(4) p", tag: "b", label: "진행 과정③ 설명", value: "자료 검토 후 시안 → 피드백 → 수정으로 완성합니다." },
    { key: "svt4_h", page: "service", sel: ".timeline .tstep:nth-child(5) h3", tag: "b", label: "진행 과정④ 제목", value: "시안 확정 · 제작" },
    { key: "svt4_p", page: "service", sel: ".timeline .tstep:nth-child(5) p", tag: "b", label: "진행 과정④ 설명", value: "최종 승인 후 인쇄 · 후가공을 진행합니다." },
    { key: "svt5_h", page: "service", sel: ".timeline .tstep:nth-child(6) h3", tag: "b", label: "진행 과정⑤ 제목", value: "최종 납품" },
    { key: "svt5_p", page: "service", sel: ".timeline .tstep:nth-child(6) p", tag: "b", label: "진행 과정⑤ 설명", value: "완성된 결과물을 약속한 일정에 전달합니다." },
    { key: "sv_wtag", page: "service", sel: "main > section:nth-of-type(3) .section-tag", tag: "b", label: "작업 사례 — 섹션 태그", value: "WORKS" },

    /* ───── 서브 페이지 상단 ───── */
    { key: "wk_title", page: "work", sel: ".subhero__title", tag: "b", label: "상단 제목", value: "Work" },
    { key: "wk_desc", page: "work", sel: ".subhero__desc", tag: "b", label: "상단 설명",
      value: "하오디자인이 직접 기획하고 완성한 실제 작업물입니다." },
    { key: "bd_title", page: "board", sel: "#listView .subhero__title", tag: "b", label: "상단 제목", value: "Column" },
    { key: "bd_desc", page: "board", sel: "#listView .subhero__desc", tag: "b", label: "상단 설명",
      value: "인쇄와 디자인, 알아두면 좋은 이야기를 전합니다." },
    { key: "ct_title", page: "contact", sel: ".subhero__title", tag: "b", label: "상단 제목", value: "견적문의" },
    { key: "ct_desc", page: "contact", sel: ".subhero__desc", tag: "b", label: "상단 설명",
      value: "간단한 내용만 남겨주세요. 담당자가 확인 후 빠르게 연락드립니다." }
  ];

  /* 서비스 페이지(7개 카테고리) 콘텐츠 — 관리자 '서비스 페이지' 탭에서 편집 */
  var DEFAULT_SERVICE = {
    catalog: { label: "카탈로그 · 브로슈어", eng: "CATALOG & BROCHURE", c: "카탈로그·브로슈어",
      desc: "정보 전달을 넘어 브랜드의 강점이 자연스럽게 전해지는 카탈로그를 만듭니다.",
      head: "좋은 카탈로그는\n설명보다 설득에 가깝습니다",
      seoTitle: "카탈로그 제작·브로슈어 디자인 | 회사소개서 편집디자인 | 하오디자인",
      seoDesc: "회사소개서·제품 카탈로그·브로슈어 편집디자인부터 인쇄·후가공까지 원스톱. 기획·디자인·제작을 한 팀이 책임지는 하오디자인 카탈로그 제작 서비스.",
      seo: { h: "카탈로그제작 · 브로슈어제작",
        t1: "카탈로그 및 브로슈어에 대하여",
        p1: "기업의 이미지를 효과적으로 전달하는 가장 기본적인 홍보물이 바로 카탈로그와 브로슈어입니다. 카탈로그 제작은 제품과 서비스를 체계적으로 보여줄 수 있으며, 브로슈어 제작은 브랜드 스토리를 감각적으로 담아내는 데 적합합니다. 기획 단계에서부터 디자인, 인쇄, 후가공까지 전문적인 과정을 거쳐 완성되는 카탈로그 디자인과 브로슈어 디자인은 기업의 신뢰도를 높이고 차별화된 경쟁력을 제공합니다. 전시회, 영업 현장, 온라인 홍보까지 활용도가 높아 많은 기업이 카탈로그 · 브로슈어 제작을 통해 마케팅 성과를 경험하고 있습니다.",
        t2: "카탈로그 및 브로슈어 준비 방법",
        p2: "카탈로그 제작이나 브로슈어 디자인을 준비할 때는 먼저 목적과 타깃을 명확히 설정하고, 그에 맞는 구성과 페이지 수를 기획하는 것이 중요합니다. 디자인 단계에서는 브랜드 아이덴티티에 맞는 레이아웃과 색상을 적용하고, 인쇄 단계에서는 종이 재질과 후가공(코팅, 박, 제본 등)을 신중히 선택해야 완성도가 높아집니다. 하오디자인은 회사소개서, 제품 카탈로그, 기업 브로슈어까지 기획부터 납품까지 원스톱으로 진행합니다." } },
    leaflet: { label: "팜플렛 · 리플렛", eng: "PAMPHLET & LEAFLET", c: "리플렛",
      desc: "펼치고 접는 흐름까지 계산한 리플렛 — 작은 지면에 핵심만 담습니다.",
      head: "접는 순간까지\n설계된 한 장",
      seoTitle: "팜플렛·리플렛 제작 | 2단·3단 접지 리플렛 디자인 | 하오디자인",
      seoDesc: "행사·매장·제품 안내 팜플렛·리플렛 제작. 2단·3단·대문접지 등 목적에 맞는 리플렛 디자인과 인쇄를 하오디자인이 원스톱으로 제작합니다.",
      seo: { h: "팜플렛제작 · 리플렛제작",
        t1: "팜플렛 및 리플렛에 대하여",
        p1: "행사 안내, 제품 소개, 매장 홍보에 가장 널리 쓰이는 인쇄물이 팜플렛과 리플렛입니다. 리플렛 제작은 2단 · 3단 접지로 작은 지면에 핵심 정보를 효율적으로 담을 수 있고, 팜플렛 디자인은 배포와 휴대가 쉬워 전시회 · 박람회 · 오프라인 마케팅에서 높은 효과를 냅니다. 접지 방식과 읽는 동선까지 계산된 리플렛 디자인은 같은 내용도 더 잘 전달되게 만듭니다.",
        t2: "팜플렛 및 리플렛 준비 방법",
        p2: "팜플렛 제작을 준비할 때는 배포 장소와 대상, 전달할 핵심 메시지를 먼저 정해야 합니다. 접지 방식(2단 · 3단 · 대문접지)에 따라 정보의 순서가 달라지므로 구성 기획이 중요하고, 용지 평량과 코팅 여부에 따라 손에 닿는 인상이 달라집니다. 하오디자인은 소량 디지털 인쇄부터 대량 옵셋 인쇄까지 목적과 수량에 맞는 팜플렛 · 리플렛 제작을 제안해드립니다." } },
    poster: { label: "포스터 · 전단지", eng: "POSTER & FLYER", c: "포스터·전단지",
      desc: "멀리서도 읽히는 위계와 임팩트 — 목적에 맞는 포스터 · 전단지를 만듭니다.",
      head: "지나가는 3초를\n붙잡는 한 장",
      seoTitle: "포스터 제작·전단지 디자인 | 행사·홍보 포스터 인쇄 | 하오디자인",
      seoDesc: "행사·공연·모집 포스터, 판촉 전단지 제작. 멀리서도 읽히는 포스터 디자인부터 인쇄·납품까지 하오디자인이 한 번에 진행합니다.",
      seo: { h: "포스터제작 · 전단지제작",
        t1: "포스터 및 전단지에 대하여",
        p1: "포스터 제작과 전단지 제작은 가장 직관적인 오프라인 홍보 수단입니다. 행사 포스터, 공연 포스터, 모집 공고 포스터는 멀리서도 읽히는 타이포그래피와 임팩트 있는 비주얼이 핵심이며, 판촉용 전단지는 짧은 시간에 혜택과 정보를 전달하는 구성이 중요합니다. 잘 만든 포스터 디자인 한 장은 지나가는 사람의 발걸음을 멈추게 합니다.",
        t2: "포스터 및 전단지 준비 방법",
        p2: "포스터 디자인을 준비할 때는 부착 장소와 보는 거리를 먼저 고려해 사이즈(A3~A0)와 글자 크기를 정해야 합니다. 전단지 제작은 배포 수량과 방식에 따라 용지와 인쇄 방식(디지털 · 옵셋)을 선택하면 비용을 효율적으로 줄일 수 있습니다. 하오디자인은 목적에 맞는 카피 위계 설계부터 인쇄 · 납품까지 한 번에 진행합니다." } },
    ci: { label: "CI · 로고디자인", eng: "CI & LOGO", c: "CI·로고디자인",
      desc: "브랜드의 방향을 담은 CI · 로고 — 명함부터 서식류까지 일관되게 확장합니다.",
      head: "로고는 회사의\n첫 문장입니다",
      seoTitle: "로고 제작·CI 디자인 | 브랜드 로고·명함 디자인 | 하오디자인",
      seoDesc: "회사 로고 제작과 CI 디자인. 명함·서식 등 기본 응용 시스템과 인쇄·온라인 겸용 파일까지 제공하는 하오디자인 브랜딩 서비스.",
      seo: { h: "로고제작 · CI디자인",
        t1: "로고 및 CI에 대하여",
        p1: "로고 디자인과 CI 디자인은 브랜드의 첫인상을 결정하는 가장 중요한 자산입니다. 로고 제작은 단순히 예쁜 심볼을 만드는 일이 아니라, 회사의 방향과 가치를 한 번에 전달하는 시각 언어를 설계하는 일입니다. 명함, 서식류, 홍보물, 간판까지 일관되게 적용되는 CI는 기업의 신뢰도를 높이고 브랜드 인지도를 만들어 갑니다.",
        t2: "로고 및 CI 준비 방법",
        p2: "로고 제작을 의뢰할 때는 회사 소개와 지향하는 방향, 선호하는 레퍼런스를 정리해 전달하면 시안의 정확도가 높아집니다. 완성된 로고는 AI 원본과 인쇄 · 온라인 겸용 파일로 제공받아야 명함 제작, 홍보물 제작에 바로 활용할 수 있습니다. 하오디자인은 로고 디자인부터 기본 응용 시스템, 사용 가이드까지 함께 정리해드립니다." } },
    package: { label: "패키지 · 라벨", eng: "PACKAGE & LABEL", c: "패키지·라벨",
      desc: "제품의 가치를 그대로 전하는 패키지 · 라벨 디자인.",
      head: "선반 위에서\n먼저 말을 거는 디자인",
      seoTitle: "패키지 디자인·라벨 제작 | 단상자·스티커 디자인 | 하오디자인",
      seoDesc: "단상자·라벨·스티커·쇼핑백 등 패키지 디자인 제작. 구조 설계부터 재질·후가공, 소량 제작과 양산까지 하오디자인이 함께합니다.",
      seo: { h: "패키지디자인 · 라벨제작",
        t1: "패키지 및 라벨에 대하여",
        p1: "패키지 디자인은 매대에서 제품이 스스로 말을 걸게 만드는 가장 강력한 마케팅 도구입니다. 단상자 제작, 라벨 디자인, 스티커 제작, 쇼핑백 제작까지 — 제품을 감싸는 모든 요소가 브랜드 경험의 일부가 됩니다. 재질과 후가공에 따라 같은 디자인도 전혀 다른 인상을 주기 때문에 구조 설계부터 신중하게 접근해야 합니다.",
        t2: "패키지 및 라벨 준비 방법",
        p2: "패키지 제작을 준비할 때는 제품 실물 또는 정확한 치수와 함께 식품 · 화장품 등 품목별 표시사항 문구를 먼저 정리해야 합니다. 칼선(목형) 설계가 필요한 단상자 제작은 샘플 확인 후 양산에 들어가는 것이 안전합니다. 하오디자인은 소량 디지털 패키지부터 대량 옵셋 양산까지 재질 샘플 기반으로 제안해드립니다." } },
    photo: { label: "촬영서비스", eng: "PHOTOGRAPHY", c: "촬영서비스",
      desc: "보정과 편집까지 한 팀에서 — 인쇄에 최적화된 제품 · 연출 컷을 만듭니다.",
      head: "디자인을 아는\n스튜디오의 촬영",
      seoTitle: "제품 촬영·누끼 촬영 | 카탈로그·상세페이지 촬영 | 하오디자인",
      seoDesc: "제품 누끼·연출 촬영과 인쇄 기준 보정. 디자인을 아는 스튜디오에서 촬영부터 보정·편집까지 한 팀으로 진행하는 하오디자인 제품촬영.",
      seo: { h: "제품촬영 · 누끼촬영",
        t1: "제품 촬영에 대하여",
        p1: "제품 촬영은 카탈로그, 상세페이지, 홍보물의 품질을 좌우하는 출발점입니다. 누끼 촬영(배경 제거 컷)은 어디에나 활용하기 좋고, 연출 촬영은 제품의 분위기와 사용 장면을 전달합니다. 인쇄물에 들어갈 사진은 화면용과 달리 CMYK 색공간 기준의 보정이 필요해, 디자인을 아는 스튜디오에서 촬영하면 결과물의 완성도가 달라집니다.",
        t2: "제품 촬영 준비 방법",
        p2: "제품 사진 촬영을 준비할 때는 촬영할 제품 실물과 참고 레퍼런스를 함께 전달하면 원하는 톤을 빠르게 맞출 수 있습니다. 필요한 컷 종류(누끼 · 연출 · 디테일)와 사용처(인쇄물 · 이커머스)를 미리 정하면 촬영 구성이 효율적입니다. 하오디자인은 촬영 → 보정 → 디자인 적용까지 한 팀으로 진행해 일정을 줄여드립니다." } },
    global: { label: "다국어디자인", eng: "GLOBAL EDITION", c: "다국어디자인",
      desc: "영어 · 중국어 · 일본어 등 수출 시장의 언어까지 한 번에 담아냅니다.",
      head: "언어가 바뀌어도\n톤은 흔들리지 않게",
      seoTitle: "다국어 카탈로그·영문 브로슈어 제작 | 수출 디자인 | 하오디자인",
      seoDesc: "영문·중문·일문 다국어 카탈로그·브로슈어 제작. 원본 톤을 유지한 다국어 편집과 수출바우처 연계 제작까지 하오디자인이 지원합니다.",
      seo: { h: "다국어카탈로그 · 영문브로슈어제작",
        t1: "다국어 디자인에 대하여",
        p1: "수출 기업에게 영문 카탈로그 제작, 중문 브로슈어 제작은 해외 바이어를 만나는 첫인상입니다. 다국어 디자인은 단순 번역이 아니라 언어별 글줄 길이와 타이포그래피 호흡에 맞춘 재조판 작업으로, 원본의 레이아웃과 브랜드 톤을 유지하는 것이 핵심입니다. 전시회 · 해외 영업용 다국어 홍보물은 수출바우처 등 정부지원사업과 연계해 제작 부담을 줄일 수도 있습니다.",
        t2: "다국어 디자인 준비 방법",
        p2: "다국어 카탈로그 제작을 준비할 때는 원본 디자인 파일과 언어별 번역문을 함께 준비하면 진행이 빠릅니다. 번역문이 없는 경우 번역 협업도 가능하며, 언어가 늘어도 일관된 톤을 유지하도록 같은 팀이 전체 언어를 관리하는 것이 좋습니다. 하오디자인은 영어 · 중국어 · 일본어 등 다국어 편집을 원본 제작과 함께 원스톱으로 진행합니다." } }
  };

  function load(key, fallback) {
    try {
      var v = JSON.parse(localStorage.getItem(key));
      if (Array.isArray(v) && v.length) return v;
    } catch (e) { /* ignore */ }
    return JSON.parse(JSON.stringify(fallback));
  }

  function loadObj(key, fallback) {
    try {
      var v = JSON.parse(localStorage.getItem(key));
      if (v && typeof v === "object" && !Array.isArray(v)) return v;
    } catch (e) { /* ignore */ }
    return JSON.parse(JSON.stringify(fallback));
  }

  window.HAO = {
    imgSrc: imgSrc,
    fullSrc: fullSrc,
    getWorks: function () { return load("hao_works", DEFAULT_WORKS); },
    getPosts: function () { return load("hao_posts", DEFAULT_POSTS); },
    getHero: function () { return load("hao_hero", DEFAULT_HERO); },
    getReviews: function () { return load("hao_reviews", DEFAULT_REVIEWS); },
    getFeatured: function () { return load("hao_featured", DEFAULT_FEATURED); },
    getLogo: function () { var v = localStorage.getItem("hao_logo"); return v && v.length ? v : DEFAULT_LOGO; },
    getPartners: function () { return load("hao_partners", DEFAULT_PARTNERS); },
    getGov: function () { return load("hao_gov", DEFAULT_GOV); },
    /* 카피: 기본값에 저장된 수정값(hao_copy {key:value})을 덧입혀 반환 */
    getCopy: function () {
      var ov = loadObj("hao_copy", {});
      return DEFAULT_COPY.map(function (c) {
        var out = JSON.parse(JSON.stringify(c));
        if (typeof ov[c.key] === "string") out.value = ov[c.key];
        return out;
      });
    },
    getSettings: function () { return loadObj("hao_settings", DEFAULT_SETTINGS); },
    /* SEO: 기본값에 저장된 수정값(hao_seo)을 깊은 병합 */
    getSeo: function () {
      var ov = loadObj("hao_seo", {});
      var out = JSON.parse(JSON.stringify(DEFAULT_SEO));
      if (ov.siteUrl) out.siteUrl = ov.siteUrl;
      if (ov.ogImage) out.ogImage = ov.ogImage;
      if (ov.pages) Object.keys(ov.pages).forEach(function (p) {
        if (!out.pages[p]) out.pages[p] = {};
        Object.keys(ov.pages[p]).forEach(function (f) { out.pages[p][f] = ov.pages[p][f]; });
      });
      return out;
    },
    /* 서비스 페이지: 기본값에 저장된 수정값(hao_service)을 카테고리·필드 단위로 덧입혀 반환 */
    getService: function () {
      var ov = loadObj("hao_service", {});
      var out = JSON.parse(JSON.stringify(DEFAULT_SERVICE));
      Object.keys(ov).forEach(function (k) {
        if (!out[k] || typeof ov[k] !== "object") return;
        Object.keys(ov[k]).forEach(function (f) {
          if (f === "seo" && ov[k].seo) {
            Object.keys(ov[k].seo).forEach(function (s) { out[k].seo[s] = ov[k].seo[s]; });
          } else if (typeof ov[k][f] === "string") {
            out[k][f] = ov[k][f];
          }
        });
      });
      return out;
    },
    /* 관리자 계정 (데모 — 실서비스에선 서버 인증으로 교체) */
    getCred: function () { return loadObj("hao_admin_cred", { id: "admin", pw: "first1234" }); },
    getInquiries: function () { return load("hao_inquiries", []); },
    saveInquiry: function (q) {
      var list = this.getInquiries();
      q.date = new Date().toLocaleString("ko-KR");
      list.unshift(q);
      localStorage.setItem("hao_inquiries", JSON.stringify(list));
    },
    /* **텍스트** → <tag>텍스트</tag> (HTML escape 포함) */
    fmt: function (s, tag) {
      var esc = String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
      });
      return esc.replace(/\*\*(.+?)\*\*/g, "<" + tag + ">$1</" + tag + ">").replace(/\n/g, "<br />");
    }
  };
})();
