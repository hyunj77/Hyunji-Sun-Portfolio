/* ==========================================================================
   Nav — 모바일 메뉴 (767px 이하, 시안 69:12)
   - 햄버거를 누르면 .mmenu.is-open → 화면 전체를 덮으며 서서히 나타남 (css/sections/dropdown.css)
   - 닫기: X 버튼 / Esc / 메뉴 항목·Account·Cart 를 누름. 닫히면 햄버거로 포커스 복귀
   - 열려 있는 동안 페이지 스크롤 잠금(html.is-scroll-locked), Tab 키 포커스가 메뉴 밖으로 나가지 않음
   - Search: 메뉴를 닫고 헤더의 검색 칸을 엶 / LANGUAGE: KR·EN·JP (웹 LANGUAGE 메뉴와 선택이 같이 바뀜, 표시만 — 번역 콘텐츠 없음)
   - 화면이 768px 이상이 되면 자동으로 닫음
   ========================================================================== */
(() => {
  const toggle = document.querySelector('[data-menu-toggle]');
  const menu = document.querySelector('[data-mmenu]');
  if (!toggle || !menu) return;

  const mq = window.matchMedia('(max-width: 767px)');
  const closeButton = menu.querySelector('[data-mmenu-close]');
  const focusables = () => [...menu.querySelectorAll('a[href], button')];

  const isOpen = () => menu.classList.contains('is-open');

  const setOpen = (open, restoreFocus = false) => {
    menu.classList.toggle('is-open', open);
    menu.setAttribute('aria-hidden', String(!open));
    document.documentElement.classList.toggle('is-scroll-locked', open);
    toggle.setAttribute('aria-expanded', String(open));
    if (open && closeButton) window.setTimeout(() => closeButton.focus(), 0);
    if (!open && restoreFocus) toggle.focus();
  };

  toggle.addEventListener('click', () => {
    if (mq.matches) setOpen(!isOpen());
  });

  closeButton.addEventListener('click', () => setOpen(false, true));

  // 메뉴 항목·Account·Cart 를 누르면 닫음 ("#" 링크는 맨 위로 튀지 않게)
  menu.querySelectorAll('.mmenu__link, a.mmenu__quick-btn').forEach((link) => {
    link.addEventListener('click', (event) => {
      if (link.getAttribute('href') === '#') event.preventDefault();
      setOpen(false);
    });
  });

  // Search: 메뉴를 닫고 헤더 검색 칸을 엶 (js/dropdown.js 가 입력칸에 포커스)
  const searchButton = menu.querySelector('[data-mmenu-search]');
  const searchToggle = document.querySelector('.dd--search')?.closest('[data-dd]')?.querySelector('[data-dd-toggle]');
  if (searchButton && searchToggle) {
    searchButton.addEventListener('click', (event) => {
      event.stopPropagation(); // 바깥 클릭으로 보고 바로 닫히지 않게
      setOpen(false);
      searchToggle.click();
    });
  }

  // LANGUAGE: [사용자 지시] 웹 LANGUAGE 메뉴와 같은 3개(KR / EN / JP = Korean / KRW, English / USD, Japanese / JPY).
  // 한쪽에서 고르면 다른 쪽 선택도 같이 바뀜 (웹 메뉴 쪽 처리는 js/dropdown.js — 여기서는 웹 메뉴의 선택지를 눌러 그대로 따라가게 함)
  const langButtons = [...menu.querySelectorAll('[data-mmenu-lang]')];
  const webOptions = [...document.querySelectorAll('[data-lang]')];
  const showLang = (value) => langButtons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.mmenuLang === value)));
  langButtons.forEach((button) => {
    button.addEventListener('click', () => {
      showLang(button.dataset.mmenuLang);
      const option = webOptions.find((o) => o.dataset.lang === button.dataset.mmenuLang);
      if (option) option.click();
    });
  });
  webOptions.forEach((option) => option.addEventListener('click', () => showLang(option.dataset.lang)));

  document.addEventListener('keydown', (event) => {
    if (!isOpen()) return;
    if (event.key === 'Escape') {
      setOpen(false, true);
      return;
    }
    // Tab 포커스를 메뉴 안에서만 돌게
    if (event.key === 'Tab') {
      const list = focusables();
      const first = list[0];
      const last = list[list.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  mq.addEventListener('change', () => {
    if (!mq.matches && isOpen()) setOpen(false);
  });
})();
