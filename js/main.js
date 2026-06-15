/* ===================================================
   HAO DESIGN — Kinetic interactions
=================================================== */
(function () {
  "use strict";
  var mq = function (q) { return window.matchMedia(q).matches; };
  var reduce = mq("(prefers-reduced-motion: reduce)");
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };

  /* ---- Year ---- */
  var y = document.getElementById("year"); if (y) y.textContent = new Date().getFullYear();

  /* ---- 사이트 설정 적용 (관리자에서 수정한 전화/이메일) ---- */
  if (window.HAO && HAO.getSettings) {
    var st = HAO.getSettings();
    document.querySelectorAll('a[href^="tel:"]').forEach(function (a) {
      a.setAttribute("href", "tel:" + st.tel.replace(/[^0-9]/g, ""));
      if (/^[\d\-\s()]+$/.test(a.textContent.trim())) a.textContent = st.tel;
    });
    document.querySelectorAll('a[href^="mailto:"]').forEach(function (a) {
      a.setAttribute("href", "mailto:" + st.email);
      if (a.textContent.indexOf("@") > -1) a.textContent = st.email;
    });
  }

  var pageName = (location.pathname.split("/").pop() || "index.html").replace(".html", "") || "index";

  /* ---- SEO 메타 적용 (관리자 'SEO 관리' 탭) ---- */
  if (window.HAO && HAO.getSeo) {
    var seo = HAO.getSeo();
    var sp = seo.pages[pageName];
    if (sp) {
      var abs = function (u) { return /^https?:/.test(u) ? u : (seo.siteUrl.replace(/\/$/, "") + "/" + String(u).replace(/^\//, "")); };
      var pageUrl = seo.siteUrl.replace(/\/$/, "") + "/" + (pageName === "index" ? "" : pageName + ".html");
      var ogImg = abs(seo.ogImage);
      function meta(sel, attr, key, val) {
        var el = document.head.querySelector(sel);
        if (!el) { el = document.createElement("meta"); el.setAttribute(attr, key); document.head.appendChild(el); }
        el.setAttribute("content", val);
      }
      if (sp.title) document.title = sp.title;
      if (sp.desc) meta('meta[name="description"]', "name", "description", sp.desc);
      if (sp.keywords) meta('meta[name="keywords"]', "name", "keywords", sp.keywords);
      // canonical
      var can = document.head.querySelector('link[rel="canonical"]');
      if (!can) { can = document.createElement("link"); can.setAttribute("rel", "canonical"); document.head.appendChild(can); }
      can.setAttribute("href", pageUrl);
      // Open Graph + Twitter
      meta('meta[property="og:title"]', "property", "og:title", sp.title || document.title);
      meta('meta[property="og:description"]', "property", "og:description", sp.desc || "");
      meta('meta[property="og:type"]', "property", "og:type", "website");
      meta('meta[property="og:url"]', "property", "og:url", pageUrl);
      meta('meta[property="og:image"]', "property", "og:image", ogImg);
      meta('meta[property="og:site_name"]', "property", "og:site_name", "HAO DESIGN 하오디자인");
      meta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
      meta('meta[name="twitter:title"]', "name", "twitter:title", sp.title || document.title);
      meta('meta[name="twitter:description"]', "name", "twitter:description", sp.desc || "");
      meta('meta[name="twitter:image"]', "name", "twitter:image", ogImg);
    }
  }

  /* ---- 사이트 카피 적용 (관리자 '카피 수정' 탭) ---- */
  if (window.HAO && HAO.getCopy) {
    HAO.getCopy().forEach(function (c) {
      if (c.page !== "all" && c.page !== pageName) return;
      document.querySelectorAll(c.sel).forEach(function (el) {
        if (c.attr) el.setAttribute(c.attr, c.value); // 숫자 카운터 등 속성 적용
        else if (c.list) { // 태그 칩 등 목록형 (' | ' 구분)
          var it = c.item || "span";
          el.innerHTML = c.value.split("|").map(function (s) {
            return "<" + it + ">" + HAO.fmt(s.trim(), c.tag || "b") + "</" + it + ">";
          }).join("");
        }
        else el.innerHTML = HAO.fmt(c.value, c.tag || "b");
      });
    });
  }

  /* ---- 디자인에서 바로 수정 모드 (관리자: ?edit=1) ---- */
  var editMode = /[?&]edit=1/.test(location.search) && localStorage.getItem("hao_edit") === "1";
  if (editMode && window.HAO && HAO.getCopy) {
    (function () {
      var edited = {};
      var marked = [];
      HAO.getCopy().forEach(function (c) {
        if (c.page !== "all" && c.page !== pageName) return;
        var el = document.querySelector(c.sel);
        if (!el) return;
        if (c.attr) { el.textContent = c.value; el.dataset.haoAttr = "1"; el.dataset.done = "1"; } // 카운터: 롤링 대신 숫자 그대로
        if (c.list) el.dataset.haoList = "1";
        el.dataset.haoKey = c.key;
        el.dataset.haoTag = c.tag || "b";
        el.setAttribute("contenteditable", "true");
        el.setAttribute("spellcheck", "false");
        el.classList.add("hao-editable");
        el.addEventListener("input", function () { edited[c.key] = true; updateBar(); });
        marked.push(el);
      });

      var st = document.createElement("style");
      st.textContent =
        ".hao-editable{outline:2px dashed rgba(232,56,23,.5);outline-offset:3px;cursor:text;}" +
        ".hao-editable:hover{outline:2px solid #e83817;}" +
        ".hao-editable:focus{outline:2px solid #e83817;background:rgba(232,56,23,.06);}" +
        "*{animation-play-state:paused !important;}" + // 수정 중엔 모션 정지
        "#haoEditBar{position:fixed;left:50%;bottom:22px;transform:translateX(-50%);z-index:99999;display:flex;gap:12px;align-items:center;background:#17150f;color:#fff;padding:12px 14px 12px 22px;border-radius:999px;font-size:14px;box-shadow:0 18px 44px -16px rgba(0,0,0,.55);white-space:nowrap;}" +
        "#haoEditBar b{color:#ff9472;}" +
        "#haoEditBar button{font-family:inherit;font-size:13.5px;font-weight:700;border:0;border-radius:999px;padding:9px 18px;cursor:pointer;}" +
        "#haoEditBar .sv{background:#e83817;color:#fff;}#haoEditBar .sv:hover{background:#f25b35;}" +
        "#haoEditBar .ex{background:rgba(255,255,255,.14);color:#fff;}";
      document.head.appendChild(st);

      var bar = document.createElement("div");
      bar.id = "haoEditBar";
      bar.innerHTML = '<span>✏️ 바로 수정 — 점선 글을 클릭해 고치세요 (<b id="haoEditCnt">0</b>곳 수정됨)</span>' +
        '<button class="sv" id="haoEditSave">저장</button><button class="ex" id="haoEditExit">나가기</button>';
      document.body.appendChild(bar);
      function updateBar() { document.getElementById("haoEditCnt").textContent = Object.keys(edited).length; }

      /* 화면의 HTML을 카피 값(**강조**, 줄바꿈)으로 역변환 */
      function unfmt(el, tag) {
        var html = el.innerHTML
          .replace(/<br\s*\/?>/gi, "\n")
          .replace(/<div[^>]*>/gi, "\n").replace(/<\/div>/gi, "")
          .replace(new RegExp("<" + tag + "(\\s[^>]*)?>", "gi"), "**")
          .replace(new RegExp("</" + tag + ">", "gi"), "**");
        var tmp = document.createElement("div");
        tmp.innerHTML = html;
        return tmp.textContent.replace(/ /g, " ").trim();
      }

      /* 히어로 슬라이드 텍스트도 화면에서 수정 (메인) — 렌더 이후 마킹 */
      var heroDirty = false, heroDataEdit = null;
      setTimeout(function () {
        var track = document.getElementById("heroTrack");
        if (!track || !HAO.getHero) return;
        heroDataEdit = HAO.getHero();
        [].slice.call(track.children).forEach(function (slide, i) {
          if (!heroDataEdit[i]) return;
          var lines = slide.querySelectorAll(".phero__title > *");
          [[slide.querySelector(".phero__badge"), "badge", null],
           [lines[0], "l1", null], [lines[1], "l2", null], [lines[2], "l3", null],
           [slide.querySelector(".phero__sub"), "copy", "b"]].forEach(function (m) {
            var el = m[0]; if (!el) return;
            el.setAttribute("contenteditable", "true");
            el.setAttribute("spellcheck", "false");
            el.classList.add("hao-editable");
            el.addEventListener("input", function () {
              heroDataEdit[i][m[1]] = m[2] ? unfmt(el, m[2]) : el.textContent.trim();
              heroDirty = true;
              edited["hero" + i + "_" + m[1]] = true; updateBar();
            });
          });
        });
      }, 0);

      document.getElementById("haoEditSave").addEventListener("click", function () {
        var ov = {};
        try { ov = JSON.parse(localStorage.getItem("hao_copy")) || {}; } catch (err) {}
        marked.forEach(function (el) {
          var key = el.dataset.haoKey;
          if (!edited[key]) return;
          if (el.dataset.haoAttr) ov[key] = el.textContent.replace(/[^\d]/g, "");
          else if (el.dataset.haoList) ov[key] = [].map.call(el.children, function (n) { return n.textContent.trim(); }).filter(Boolean).join(" | ");
          else ov[key] = unfmt(el, el.dataset.haoTag);
        });
        localStorage.setItem("hao_copy", JSON.stringify(ov));
        if (heroDirty && heroDataEdit) localStorage.setItem("hao_hero", JSON.stringify(heroDataEdit));
        edited = {}; updateBar();
        alert("저장되었습니다. 사이트에 바로 반영됩니다.");
      });
      document.getElementById("haoEditExit").addEventListener("click", function () {
        location.href = location.pathname;
      });
    })();
  }

  /* ---- Real work data (js/data.js — 관리자 수정분 반영) ---- */
  var works = (window.HAO && HAO.getWorks) ? HAO.getWorks() : [];
  var imgSrc = (window.HAO && HAO.imgSrc) ? HAO.imgSrc : function (f) { return "assets/work/" + f + ".jpeg"; };
  var marquee = ["work02","work03","work05","work06","work08","work09","work11","work12","work13","work14","work16","work17","work19","work21","work22","work23","work01","work04","work07","work10"];

  /* ---- 메인 대표작 (관리자 '메인 대표작' 탭에서 지정) ---- */
  var featured = (window.HAO && HAO.getFeatured) ? HAO.getFeatured() : [];
  featured = featured.filter(function (w) { return w && w.f; }); // 빈 슬롯 제외
  if (!featured.length) featured = works.slice(0, 8);

  /* ---- Inject portfolio mosaic (main page): 지정한 대표작 7장, lg + 4 + 2 wide ---- */
  var workGrid = document.getElementById("workGrid");
  if (workGrid && workGrid.classList.contains("work__grid--mosaic") && featured.length) {
    var sizes = ["lg", "", "", "", "", "wide", "wide"];
    workGrid.innerHTML = featured.slice(0, 7).map(function (w, idx) {
      var size = sizes[idx] || "";
      return '<article class="wcard reveal' + (size ? " wcard--" + size : "") + '" style="--d:' + idx + '">' +
        '<div class="wcard__media"><img src="' + imgSrc(w.f) + '" alt="' + w.t + '" loading="lazy" /></div>' +
        '<div class="wcard__info"><span class="wcard__title">' + w.t + '</span><span class="wcard__cat">' + w.c + '</span></div>' +
      '</article>';
    }).join("");
  }

  /* ---- 로고 적용 (헤더·푸터 공통, 관리자 수정분) ---- */
  if (window.HAO && HAO.getLogo) {
    var logoSrc = HAO.getLogo();
    document.querySelectorAll(".brand__logo, .footer__logo").forEach(function (im) { im.src = logoSrc; });
  }

  /* ---- Inject marquee images (포트폴리오에서 끌어옴 — 관리자 수정 반영) ---- */
  function fillTrack(el, list) {
    if (!el) return;
    var html = "";
    for (var d = 0; d < 2; d++) {
      list.forEach(function (w) {
        html += '<img src="' + imgSrc(w.f) + '" alt="" loading="lazy" />';
      });
    }
    el.innerHTML = html;
  }
  var trackTop = document.getElementById("trackTop");
  var trackBot = document.getElementById("trackBot");
  if (trackTop && featured.length) {
    var mqHalf = Math.ceil(featured.length / 2);
    var mq1 = featured.slice(0, mqHalf);
    var mq2 = featured.slice(mqHalf);
    if (!mq2.length) mq2 = mq1;
    fillTrack(trackTop, mq1);
    fillTrack(trackBot, mq2);
  }

  /* ---- Trigger hero reveal on load ---- */
  window.addEventListener("load", function () { document.body.classList.add("is-ready"); });
  // fallback in case load already fired
  requestAnimationFrame(function () { setTimeout(function () { document.body.classList.add("is-ready"); }, 80); });

  /* ---- Hero slider (좌 카피 / 우 이미지, 페이드 전환) ---- */
  var heroTrack = document.getElementById("heroTrack");
  if (heroTrack && window.HAO && HAO.getHero) {
    // 관리자에서 수정한 슬라이드 내용 적용
    var heroData = HAO.getHero();
    [].slice.call(heroTrack.children).forEach(function (slide, i) {
      var d = heroData[i]; if (!d) return;
      var badge = slide.querySelector(".phero__badge");
      if (badge) badge.textContent = d.badge;
      var lines = slide.querySelectorAll(".phero__title > *");
      [d.l1, d.l2, d.l3].forEach(function (t, k) { if (lines[k]) lines[k].textContent = (t || "").replace(/\*\*/g, ""); });
      var copy = slide.querySelector(".phero__sub");
      if (copy) copy.innerHTML = HAO.fmt(d.copy, "b");
      var im = slide.querySelector(".phero__media img");
      if (im) im.src = HAO.fullSrc ? HAO.fullSrc(d.img) : HAO.imgSrc(d.img);
    });
  }
  if (heroTrack) {
    var hSlides = [].slice.call(heroTrack.children);
    var hIdx = 0, hN = hSlides.length, hTimer = null;
    var hCur = document.getElementById("heroCur");
    var hTotal = document.getElementById("heroTotal");
    var hBar = document.getElementById("heroBar");
    if (hTotal) hTotal.textContent = hN;
    function heroBarRun() {
      if (!hBar) return;
      hBar.style.transition = "none";
      hBar.style.width = "0%";
      void hBar.offsetWidth;
      if (!reduce) { hBar.style.transition = "width 6s linear"; hBar.style.width = "100%"; }
    }
    function heroGo(i) {
      hIdx = (i % hN + hN) % hN;
      for (var k = 0; k < hN; k++) hSlides[k].classList.toggle("is-active", k === hIdx);
      if (hCur) hCur.textContent = hIdx + 1;
      heroBarRun();
    }
    function heroStart() { heroStop(); if (!reduce && !editMode) hTimer = setInterval(function () { heroGo(hIdx + 1); }, 6000); }
    function heroStop() { if (hTimer) { clearInterval(hTimer); hTimer = null; } }
    var hPrev = document.getElementById("heroPrev"), hNext = document.getElementById("heroNext");
    if (hPrev) hPrev.addEventListener("click", function () { heroGo(hIdx - 1); heroStart(); });
    if (hNext) hNext.addEventListener("click", function () { heroGo(hIdx + 1); heroStart(); });
    heroGo(0);
    heroStart();
  }

  /* ---- Burger / mobile nav ---- */
  var burger = document.getElementById("burger");
  var nav = document.getElementById("nav");
  if (burger && nav) {
    burger.addEventListener("click", function () {
      var open = nav.classList.toggle("is-open");
      burger.classList.toggle("is-open", open);
    });
    nav.addEventListener("click", function (e) {
      if (e.target.tagName === "A") { nav.classList.remove("is-open"); burger.classList.remove("is-open"); }
    });
  }

  /* ---- Services hover: 포트폴리오(관리자 데이터)에서 카테고리별로 스트립 구성 ---- */
  if (!mq("(hover: none)")) {
    document.querySelectorAll(".svc[data-cats]").forEach(function (svc) {
      var strip = null;
      svc.addEventListener("mouseenter", function () {
        if (!strip) {
          var cats = svc.getAttribute("data-cats").split(",");
          // 해당 카테고리 작품 우선, 부족하면(3장 미만) 다른 작품으로 채움
          var matched = works.filter(function (w) { return cats.indexOf(w.c) > -1; });
          if (matched.length < 3) {
            matched = matched.concat(works.filter(function (w) { return cats.indexOf(w.c) === -1; }).slice(0, 5 - matched.length));
          }
          matched = matched.slice(0, 6);
          strip = document.createElement("div");
          strip.className = "svc__strip";
          strip.setAttribute("aria-hidden", "true");
          var unit = "";
          matched.forEach(function (w) {
            unit += '<img src="' + imgSrc(w.f) + '" alt="" loading="lazy" />';
          });
          // 화면 폭을 채울 만큼 반복 (이미지 1장 ≈ 높이×37/24 + 간격)
          var imgW = Math.min(190, window.innerWidth * 0.15) * 37 / 24 + 16;
          var rep = Math.max(2, Math.ceil((svc.clientWidth * 1.15) / (matched.length * imgW)));
          var track = "";
          for (var d = 0; d < rep; d++) track += unit;
          strip.innerHTML = '<div class="svc__strip-track">' + track + track + "</div>";
          svc.appendChild(strip);
          void strip.offsetHeight; // force reflow so the first open transitions
        }
        svc.classList.add("is-hover");
      });
      svc.addEventListener("mouseleave", function () { svc.classList.remove("is-hover"); });
    });
  }

  /* ---- 제작설비 컬럼: 포트폴리오에서 카테고리별 대표 사진 주입 (about) ---- */
  document.querySelectorAll(".fac__col[data-cat]").forEach(function (col) {
    var cat = col.getAttribute("data-cat");
    var w = works.filter(function (x) { return x.c === cat; })[0] || works[0];
    var fig = col.querySelector(".fac__media");
    if (!w || !fig) return;
    var src = imgSrc(w.f).replace("/work-hd/thumb/", "/work-hd/large/");
    fig.innerHTML = '<img src="' + src + '" alt="" loading="lazy" />';
  });

  /* ---- Intro words split (preserve the orange em phrase) ---- */
  var introWords = document.querySelector(".intro__words");
  var wordSpans = [];
  if (introWords) {
    var out = "";
    [].slice.call(introWords.childNodes).forEach(function (node) {
      var isEm = node.nodeName === "EM";
      var txt = (node.textContent || "").trim();
      if (!txt) return;
      txt.split(/\s+/).forEach(function (w) {
        out += '<span class="w' + (isEm ? " w--em" : "") + '">' + w + "</span> ";
      });
    });
    introWords.innerHTML = out;
    wordSpans = [].slice.call(introWords.querySelectorAll(".w"));
  }
  var intro = document.querySelector(".intro");

  /* ---- Counters: slot-machine digit roll ---- */
  function animateCounter(el) {
    var to = parseInt(el.getAttribute("data-to"), 10);
    var str = to.toLocaleString();
    if (reduce) { el.textContent = str; return; }
    var html = "";
    str.split("").forEach(function (ch) {
      if (/\d/.test(ch)) {
        var strip = "";
        for (var k = 0; k < 20; k++) strip += "<i>" + (k % 10) + "</i>"; // 0-9 두 바퀴
        html += '<span class="roll"><span class="roll__strip" data-digit="' + ch + '">' + strip + "</span></span>";
      } else {
        html += "<span class=\"roll-sep\">" + ch + "</span>";
      }
    });
    el.innerHTML = html;
    // 각 칸을 실제 착지 숫자의 글자 폭에 맞춤 (좁은 1, 넓은 0 간격 자연스럽게)
    var meas = document.createElement("span");
    meas.style.cssText = "position:absolute;visibility:hidden;white-space:pre";
    el.appendChild(meas);
    el.querySelectorAll(".roll").forEach(function (r) {
      meas.textContent = r.querySelector(".roll__strip").getAttribute("data-digit");
      r.style.width = meas.getBoundingClientRect().width + "px";
    });
    el.removeChild(meas);
    // 리플로우 후 자리수마다 시차를 두고 한 바퀴 돌아 착지
    var strips = el.querySelectorAll(".roll__strip");
    void el.offsetHeight;
    requestAnimationFrame(function () {
      strips.forEach(function (s, i) {
        s.style.transitionDelay = (i * 110) + "ms";
        s.style.transform = "translateY(-" + (10 + parseInt(s.getAttribute("data-digit"), 10)) + "em)";
      });
    });
  }

  /* ---- Reveal observer ---- */
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) {
          en.target.classList.add("is-in");
          en.target.querySelectorAll("strong[data-to]").forEach(function (strong) {
            if (!strong.dataset.done) { strong.dataset.done = "1"; animateCounter(strong); }
          });
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
  } else {
    document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("is-in"); });
  }

  /* ---- Scroll-driven motion (on-demand, rAF-throttled) ---- */
  var progressBar = document.getElementById("progress");
  var timelineFill = document.getElementById("timelineFill");
  var timeline = document.getElementById("timeline");
  var spreads = [].slice.call(document.querySelectorAll("[data-parallax]"));
  var ticking = false;

  function updateScroll() {
    ticking = false;
    var sc = window.scrollY;
    var vh = window.innerHeight;
    var docH = document.documentElement.scrollHeight - vh;

    if (progressBar) progressBar.style.width = (docH > 0 ? (sc / docH) * 100 : 0) + "%";

    var hdr = document.getElementById("header");
    if (hdr) hdr.classList.toggle("is-stuck", sc > 40);

    // intro words light-up
    if (wordSpans.length && intro) {
      var ir = intro.getBoundingClientRect();
      var prog = clamp((vh * 0.85 - ir.top) / (vh * 0.7), 0, 1);
      var lit = Math.round(prog * wordSpans.length);
      for (var i = 0; i < wordSpans.length; i++) wordSpans[i].classList.toggle("lit", i < lit);
    }

    // differentiator: which card is on top of the stack right now
    var diffStep = document.getElementById("diffStep");
    var diffBarFill = document.getElementById("diffBarFill");
    if (diffStep && diffBarFill) {
      var dcards = document.querySelectorAll(".diff__cards .dcard");
      var reached = 0;
      for (var di = 0; di < dcards.length; di++) {
        // a card counts once it has stuck near its sticky offset
        if (dcards[di].getBoundingClientRect().top <= 96 + di * 18 + 40) reached = di + 1;
      }
      reached = Math.max(1, reached);
      diffStep.textContent = String(reached).padStart(2, "0");
      diffBarFill.style.width = (reached / dcards.length * 100) + "%";
    }

    // vertical timeline (about page): line draws down, items light up as it passes
    var vtl = document.getElementById("vtl");
    var vtlFill = document.getElementById("vtlFill");
    if (vtl && vtlFill) {
      var vr = vtl.getBoundingClientRect();
      var vp = clamp((vh * 0.75 - vr.top) / vr.height, 0, 1);
      vtlFill.style.height = (vp * 100) + "%";
      var vitems = vtl.querySelectorAll(".vtl__item");
      for (var vi = 0; vi < vitems.length; vi++) {
        vitems[vi].classList.toggle("is-on", vp >= (vitems[vi].offsetTop + 20) / vtl.offsetHeight);
      }
    }

    // spreads parallax (gentle)
    if (!reduce) {
      spreads.forEach(function (img) {
        var ir2 = img.getBoundingClientRect();
        if (ir2.bottom > 0 && ir2.top < vh) {
          var off = (ir2.top + ir2.height / 2 - vh / 2) * parseFloat(img.getAttribute("data-parallax"));
          img.style.transform = "translateY(" + off + "px) scale(1.06)";
        }
      });
    }

    // timeline fill + sequential step activation
    if (timeline && timelineFill) {
      var tp;
      var pwrap = document.getElementById("processWrap");
      if (pwrap && !mq("(max-width: 1000px)")) {
        // pinned: progress = how far we've scrolled through the tall wrapper
        var pr = pwrap.getBoundingClientRect();
        tp = clamp(-pr.top / (pwrap.offsetHeight - vh), 0, 1);
      } else {
        var tr = timeline.getBoundingClientRect();
        tp = clamp((vh * 0.85 - tr.top) / (tr.height + vh * 0.3), 0, 1);
      }
      timelineFill.style.width = (tp * 100) + "%";
      var steps = timeline.querySelectorAll(".tstep");
      for (var si = 0; si < steps.length; si++) {
        // a step lights up when the fill tip passes its dot (start of its column)
        steps[si].classList.toggle("is-on", tp >= (si + 0.35) / steps.length);
      }
    }
  }
  function requestTick() { if (!ticking) { ticking = true; requestAnimationFrame(updateScroll); } }
  window.addEventListener("scroll", requestTick, { passive: true });
  window.addEventListener("resize", requestTick);

  if (spreads.length) spreads.forEach(function (i) { i.style.transform = "scale(1.06)"; });
  updateScroll();

  /* ---- Cursor trail (dot follows instantly, ring eases behind) ---- */
  if (!mq("(hover: none)") && !reduce) {
    var cDot = document.createElement("div"); cDot.className = "cursor-dot";
    var cRing = document.createElement("div"); cRing.className = "cursor-ring";
    document.body.appendChild(cRing); document.body.appendChild(cDot);
    var cTx = -100, cTy = -100, cRx = -100, cRy = -100, cRunning = false;
    function ringLoop() {
      cRx += (cTx - cRx) * 0.16; cRy += (cTy - cRy) * 0.16;
      cRing.style.left = cRx + "px"; cRing.style.top = cRy + "px";
      if (Math.abs(cTx - cRx) < 0.3 && Math.abs(cTy - cRy) < 0.3) { cRunning = false; return; }
      requestAnimationFrame(ringLoop);
    }
    window.addEventListener("mousemove", function (e) {
      cTx = e.clientX; cTy = e.clientY;
      cDot.style.left = cTx + "px"; cDot.style.top = cTy + "px";
      if (!cRunning) { cRunning = true; requestAnimationFrame(ringLoop); }
    }, { passive: true });
    // grow over interactive elements
    document.addEventListener("mouseover", function (e) {
      cRing.classList.toggle("is-hover", !!e.target.closest("a, button, .wcard, .svc, .gcard, .chip"));
    });
  }

  /* ---- 고객 후기 렌더 (관리자 '고객 후기' 탭 데이터) ---- */
  var revTracks = document.querySelectorAll(".rev-track");
  if (revTracks.length === 2 && window.HAO && HAO.getReviews) {
    var revs = HAO.getReviews();
    var revCard = function (r) {
      return '<blockquote class="rev"><span class="rev__mark" aria-hidden="true">“</span>' +
        "<p>" + HAO.fmt(r.msg, "b") + "</p>" +
        "<footer>" + (r.logo ? '<img class="rev__logo" src="' + r.logo + '" alt="" />' : "") +
        "<cite>" + HAO.fmt(r.cite, "b") + "</cite></footer></blockquote>";
    };
    var revHalf = Math.ceil(revs.length / 2);
    revTracks[0].innerHTML = revs.slice(0, revHalf).map(revCard).join("");
    revTracks[1].innerHTML = revs.slice(revHalf).map(revCard).join("");
  }

  /* ---- Reviews marquee: 화면 폭을 채울 만큼 반복 후 2배 복제 (이음새 없는 루프) ---- */
  if (!editMode) document.querySelectorAll(".rev-track").forEach(function (t) {
    var base = t.innerHTML;
    var unitW = t.scrollWidth || 1;
    var k = Math.max(1, Math.ceil((window.innerWidth * 1.15) / unitW));
    var unit = "";
    for (var r = 0; r < k; r++) unit += base;
    t.innerHTML = unit + unit;
  });

  /* ---- Partners logo marquee (관리자 '이미지·로고' 탭) ---- */
  var P_LOGOS = (window.HAO && HAO.getPartners) ? HAO.getPartners() : [];
  function fillPartners(el, list) {
    if (!el) return;
    var html = "";
    for (var d = 0; d < 2; d++) {
      list.forEach(function (src) {
        html += '<span class="plogo"><img src="' + src + '" alt="파트너 로고" loading="lazy" /></span>';
      });
    }
    el.innerHTML = html;
  }
  var pHalf = Math.ceil(P_LOGOS.length / 2);
  fillPartners(document.getElementById("ptrackA"), P_LOGOS.slice(0, pHalf));
  fillPartners(document.getElementById("ptrackB"), P_LOGOS.slice(pHalf));

  /* ---- Portfolio lightbox (any .wcard on any page) ---- */
  (function () {
    var lb = document.createElement("div");
    lb.className = "lightbox";
    lb.innerHTML =
      '<div class="lightbox__backdrop"></div>' +
      '<figure class="lightbox__box">' +
        '<img class="lightbox__img" src="" alt="" />' +
        '<figcaption class="lightbox__cap"><strong></strong><span></span></figcaption>' +
      '</figure>' +
      '<button class="lightbox__close" aria-label="닫기">&times;</button>' +
      '<button class="lightbox__btn lightbox__btn--prev" aria-label="이전">&#8249;</button>' +
      '<button class="lightbox__btn lightbox__btn--next" aria-label="다음">&#8250;</button>' +
      '<div class="lightbox__zoom">' +
        '<button class="lightbox__zbtn" data-z="out" aria-label="축소">&minus;</button>' +
        '<span class="lightbox__zval">100%</span>' +
        '<button class="lightbox__zbtn" data-z="in" aria-label="확대">+</button>' +
        '<button class="lightbox__zbtn" data-z="reset" aria-label="원래 크기">&#8634;</button>' +
      '</div>';
    document.body.appendChild(lb);

    var imgEl = lb.querySelector(".lightbox__img");
    var capTitle = lb.querySelector(".lightbox__cap strong");
    var capCat = lb.querySelector(".lightbox__cap span");
    var cards = [], cur = -1;

    function visibleCards() {
      return [].slice.call(document.querySelectorAll(".wcard")).filter(function (c) {
        return c.style.display !== "none";
      });
    }
    function show(i) {
      if (!cards.length) return;
      cur = (i % cards.length + cards.length) % cards.length;
      var c = cards[cur];
      var img = c.querySelector("img");
      // 그리드는 썸네일, 라이트박스는 대형 버전
      imgEl.src = img.getAttribute("src").replace("/work-hd/thumb/", "/work-hd/large/");
      imgEl.alt = img.getAttribute("alt") || "";
      var t = c.querySelector(".wcard__title");
      var g = c.querySelector(".wcard__cat");
      capTitle.textContent = t ? t.textContent : "";
      capCat.textContent = g ? g.textContent : "";
      resetZoom();
      lb.classList.add("is-open");
      document.body.style.overflow = "hidden";
    }
    function close() {
      lb.classList.remove("is-open");
      document.body.style.overflow = "";
      resetZoom();
      cur = -1;
    }

    /* ---- 확대 · 이동: 휠 줌 / 드래그 팬 / 더블클릭 / 핀치 ---- */
    var scale = 1, tx = 0, ty = 0;
    var zval = lb.querySelector(".lightbox__zval");
    var box = lb.querySelector(".lightbox__box");
    function applyZoom() {
      var maxX = imgEl.offsetWidth * scale / 2;
      var maxY = imgEl.offsetHeight * scale / 2;
      tx = Math.max(-maxX, Math.min(maxX, tx));
      ty = Math.max(-maxY, Math.min(maxY, ty));
      imgEl.style.transform = scale === 1 ? "" : "translate(" + tx + "px," + ty + "px) scale(" + scale + ")";
      zval.textContent = Math.round(scale * 100) + "%";
      lb.classList.toggle("is-zoom", scale > 1);
    }
    function resetZoom() { scale = 1; tx = 0; ty = 0; applyZoom(); }
    function zoomAt(ns, px, py) {
      ns = Math.min(5, Math.max(1, ns));
      if (ns === scale) return;
      if (ns === 1) { resetZoom(); return; }
      var r = imgEl.getBoundingClientRect();
      var cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      var k = ns / scale;
      tx += (px - cx) * (1 - k);
      ty += (py - cy) * (1 - k);
      scale = ns;
      applyZoom();
    }
    box.addEventListener("wheel", function (e) {
      e.preventDefault();
      zoomAt(scale * (e.deltaY < 0 ? 1.2 : 1 / 1.2), e.clientX, e.clientY);
    }, { passive: false });
    imgEl.addEventListener("dblclick", function (e) {
      zoomAt(scale > 1 ? 1 : 2.5, e.clientX, e.clientY);
    });
    imgEl.addEventListener("dragstart", function (e) { e.preventDefault(); });
    lb.querySelector(".lightbox__zoom").addEventListener("click", function (e) {
      var b = e.target.closest(".lightbox__zbtn"); if (!b) return;
      var z = b.getAttribute("data-z");
      var cx = window.innerWidth / 2, cy = window.innerHeight / 2;
      if (z === "in") zoomAt(scale * 1.4, cx, cy);
      else if (z === "out") zoomAt(scale / 1.4, cx, cy);
      else resetZoom();
    });
    /* 포인터: 1개 = 팬(확대 시), 2개 = 핀치 */
    var pts = {}, panFrom = null, pinchFrom = null;
    function ptList() { return Object.keys(pts).map(function (k) { return pts[k]; }); }
    imgEl.addEventListener("pointerdown", function (e) {
      pts[e.pointerId] = { x: e.clientX, y: e.clientY };
      var n = Object.keys(pts).length;
      if (n === 1 && scale > 1) {
        panFrom = { x: e.clientX - tx, y: e.clientY - ty };
        lb.classList.add("is-drag");
      } else if (n === 2) {
        var a = ptList();
        panFrom = null;
        pinchFrom = { d: Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y), s: scale };
        lb.classList.add("is-drag");
      }
      imgEl.setPointerCapture(e.pointerId);
      if (scale > 1 || n === 2) e.preventDefault();
    });
    imgEl.addEventListener("pointermove", function (e) {
      if (!pts[e.pointerId]) return;
      pts[e.pointerId] = { x: e.clientX, y: e.clientY };
      var a = ptList();
      if (a.length === 2 && pinchFrom) {
        var d = Math.hypot(a[0].x - a[1].x, a[0].y - a[1].y);
        zoomAt(pinchFrom.s * d / pinchFrom.d, (a[0].x + a[1].x) / 2, (a[0].y + a[1].y) / 2);
      } else if (panFrom) {
        tx = e.clientX - panFrom.x;
        ty = e.clientY - panFrom.y;
        applyZoom();
      }
    });
    function lift(e) {
      delete pts[e.pointerId];
      panFrom = null; pinchFrom = null;
      lb.classList.remove("is-drag");
    }
    imgEl.addEventListener("pointerup", lift);
    imgEl.addEventListener("pointercancel", lift);
    document.addEventListener("click", function (e) {
      var card = e.target.closest(".wcard");
      if (card) { cards = visibleCards(); show(cards.indexOf(card)); }
    });
    lb.querySelector(".lightbox__backdrop").addEventListener("click", close);
    lb.querySelector(".lightbox__close").addEventListener("click", close);
    lb.querySelector(".lightbox__btn--prev").addEventListener("click", function () { show(cur - 1); });
    lb.querySelector(".lightbox__btn--next").addEventListener("click", function () { show(cur + 1); });
    document.addEventListener("keydown", function (e) {
      if (!lb.classList.contains("is-open")) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") show(cur - 1);
      else if (e.key === "ArrowRight") show(cur + 1);
      else if (e.key === "+" || e.key === "=") zoomAt(scale * 1.4, window.innerWidth / 2, window.innerHeight / 2);
      else if (e.key === "-") zoomAt(scale / 1.4, window.innerWidth / 2, window.innerHeight / 2);
    });
  })();

  /* ---- Footer: back-to-top button ---- */
  var fbottom = document.querySelector(".footer__bottom");
  if (fbottom) {
    var toTop = document.createElement("button");
    toTop.className = "totop";
    toTop.type = "button";
    toTop.innerHTML = "TOP &uarr;";
    toTop.setAttribute("aria-label", "맨 위로");
    toTop.addEventListener("click", function () { window.scrollTo({ top: 0, behavior: "smooth" }); });
    fbottom.appendChild(toTop);
  }

  /* ---- Form (demo) ---- */
  var form = document.getElementById("quoteForm");
  var note = document.getElementById("formNote");
  if (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.name.value.trim() || !form.phone.value.trim()) {
        if (note) note.textContent = "이름과 연락처를 입력해주세요.";
        return;
      }
      if (window.HAO && HAO.saveInquiry) {
        HAO.saveInquiry({
          name: form.name.value.trim(),
          phone: form.phone.value.trim(),
          type: form.type ? form.type.value : "",
          message: form.message ? form.message.value.trim() : ""
        });
      }
      if (note) note.textContent = "문의가 접수되었습니다. 빠르게 연락드리겠습니다.";
      form.reset();
    });
  }
})();
