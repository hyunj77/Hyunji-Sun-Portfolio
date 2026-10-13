/* ==========================================================================
   Stores 슬라이더 — 매장 3개 순환 전환
   - [사용자 지시(시안 외 효과)] 넘길 때 살짝 효과: 다음 → 새 내용이 오른쪽에서, 이전 → 왼쪽에서 살짝 밀려 들어오며 선명해짐.
     이미지가 먼저, 글씨가 조금씩 늦게 따라옴. 값은 tokens.css 의 --stores-slide-ms / --stores-slide-shift. 모션 줄이기면 효과 없이 즉시 변경
   - 이전/다음 버튼: 메인 이미지, 세로 라벨, 번호, 매장 정보가 함께 바뀜
   - 오른쪽 "다음 매장" 미리보기: 항상 다음 순서 매장의 이미지
   - 03에서 다음 → 01, 01에서 이전 → 03
   - 태블릿·모바일: 매장 사진을 손가락으로 옆으로 밀어도 넘어감
   ========================================================================== */
(() => {
  const STORES = [
    {
      label: 'SINSA FLAGSHIP',
      name: '신사 플래그십 스토어',
      address: ['서울특별시 강남구', '압구정로 10길 28'],
      phone: '+82 70-4157-4356',
      hours: ['Monday - Sunday', '11:00am - 8:00pm'],
      image: 'assets/images/stores/sinsa-flagship.jpg',
      alt: '나무 패널 벽과 유리 진열대가 놓인 신사 플래그십 스토어 내부',
    },
    {
      label: 'HANNAM FLAGSHIP',
      name: '한남 플래그십 스토어',
      address: ['서울특별시 용산구', '대사관로 5길 11'],
      phone: '+82 70-4416-8883',
      hours: ['Monday - Sunday', '11:00am - 8:00pm'],
      image: 'assets/images/stores/hannam-flagship.jpg',
      alt: '유리 진열대와 꽃이 놓인 테이블, 회색 벽면의 NUMBERING 간판이 보이는 한남 플래그십 스토어 입구',
    },
    {
      label: 'DOSAN FLAGSHIP',
      name: '도산 플래그십 스토어',
      address: ['서울특별시 강남구', '압구정로48길 38'],
      phone: '+82 70-4132-5988',
      hours: ['Monday - Sunday', '11:00am - 8:00pm'],
      image: 'assets/images/stores/dosan-flagship.jpg',
      alt: '그림자가 드리운 콘크리트 패널 외관의 도산 플래그십 스토어',
    },
  ];

  const $ = (selector) => document.querySelector(selector);
  const els = {
    image: $('[data-store-image]'),
    label: $('[data-store-label]'),
    number: $('[data-store-number]'),
    name: $('[data-store-name]'),
    address: $('[data-store-address]'),
    phone: $('[data-store-phone]'),
    hours: $('[data-store-hours]'),
    preview: $('[data-store-preview]'),
    prev: $('[data-store-prev]'),
    next: $('[data-store-next]'),
  };
  if (Object.values(els).some((el) => !el)) return;

  let current = 0;
  const total = STORES.length;

  const rootStyle = getComputedStyle(document.documentElement);
  const token = (name, fallback) => {
    const value = parseFloat(rootStyle.getPropertyValue(name));
    return Number.isFinite(value) ? value : fallback;
  };
  const SLIDE_MS = token('--stores-slide-ms', 500);
  const SHIFT = token('--stores-slide-shift', 28);
  const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  // 전환 시 이미지가 비어 보이지 않도록 미리 불러옴
  STORES.forEach((store) => {
    new Image().src = store.image;
  });

  // 번호 "01 ." — 시안 구조(0 / 1␣ / . / ␣)와 같은 스팬 구성
  const renderNumber = (index) => {
    const spans = [
      ['0', ''],
      [`${index + 1} `, 'is-tight'],
      ['.', 'is-thin is-tight'],
      [' ', 'is-thin'],
    ];
    els.number.replaceChildren(
      ...spans.map(([text, className]) => {
        const span = document.createElement('span');
        span.textContent = text;
        if (className) span.className = className;
        return span;
      })
    );
  };

  // 주소·영업시간은 두 부분으로: 데스크톱·모바일은 한 줄("…강남구 압구정로…", "… | …"), 태블릿은 시안처럼 두 줄(css 가 .store-info__seg 를 줄로 나누고 | 숨김)
  const renderSegments = (el, [first, second], separator) => {
    const seg = (text) => {
      const span = document.createElement('span');
      span.className = 'store-info__seg';
      span.textContent = text;
      return span;
    };
    const sep = document.createElement('span');
    if (separator.trim()) sep.className = 'store-info__sep';
    sep.textContent = separator;
    el.replaceChildren(seg(first), separator.trim() ? sep : document.createTextNode(separator), seg(second));
  };

  const render = () => {
    const store = STORES[current];
    const upcoming = STORES[(current + 1) % total];

    els.image.src = store.image;
    els.image.alt = store.alt;
    els.label.textContent = ` ${store.label}`;
    renderNumber(current);
    els.name.textContent = store.name;
    renderSegments(els.address, store.address, ' ');
    els.phone.textContent = store.phone;
    renderSegments(els.hours, store.hours, ' | ');
    els.preview.src = upcoming.image;
    els.preview.alt = upcoming.alt;
  };

  // 새 내용이 direction(+1 오른쪽에서 / −1 왼쪽에서)으로 살짝 밀려 들어오며 선명해짐. 끝나면 속성이 남지 않음(fill: backwards)
  const slideIn = (direction) => {
    if (reduceQuery.matches || !els.image.animate) return;
    const targets = [
      [els.image, 1, 0],
      [els.preview, 1, 60],
      [els.label.closest('.store-card__indicator'), 0.6, 80],
      [els.name, 0.6, 100],
      [els.address, 0.6, 150],
      [els.phone, 0.6, 200],
      [els.hours, 0.6, 250],
    ];
    targets.forEach(([el, scale, delay]) => {
      el.getAnimations().forEach((animation) => animation.cancel());
      el.animate(
        [
          { opacity: 0, transform: `translateX(${direction * SHIFT * scale}px)` },
          { opacity: 1, transform: 'translateX(0)' },
        ],
        { duration: SLIDE_MS, delay, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'backwards' }
      );
    });
  };

  const go = (direction) => {
    current = (current + direction + total) % total;
    render();
    slideIn(direction);
  };

  els.prev.addEventListener('click', () => go(-1));
  els.next.addEventListener('click', () => go(1));

  // 손가락으로 매장 사진을 옆으로 밀면 다음(왼쪽으로) / 이전(오른쪽으로) 매장 — 세로 스크롤과 헷갈리지 않게 가로로 40px 이상, 세로보다 크게 움직였을 때만
  const SWIPE_MIN_PX = 40;
  const photo = els.image.closest('.store-card__image');
  // 손가락·마우스·펜 모두 (Pointer Events). 태블릿·모바일(≤1199px)에서만
  const compact = window.matchMedia('(max-width: 1199px)');
  let touchStart = null;
  photo.addEventListener('pointerdown', (event) => {
    if (!compact.matches || (event.pointerType === 'mouse' && event.button !== 0)) return;
    touchStart = { x: event.clientX, y: event.clientY };
  });
  photo.addEventListener('pointerup', (event) => {
    if (!touchStart) return;
    const dx = event.clientX - touchStart.x;
    const dy = event.clientY - touchStart.y;
    touchStart = null;
    if (Math.abs(dx) >= SWIPE_MIN_PX && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
  });
  ['pointercancel', 'pointerleave'].forEach((name) => photo.addEventListener(name, () => { touchStart = null; }));

  render();
})();
