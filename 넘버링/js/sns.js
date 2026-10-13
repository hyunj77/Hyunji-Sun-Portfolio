/* ==========================================================================
   SNS 슬라이더 — 인스타그램 12장, 항상 3칸(363 / 472 / 363) 표시
   - 다음: 한 칸씩 왼쪽으로, 이전: 반대. 끝에서 순환. 슬라이드 0.4초(CSS 변수)
   - 칸(slot): 0 왼쪽 / 1 가운데(큼) / 2 오른쪽. -1, 3 은 화면 밖 대기 위치
   - 이동 중(busy)에는 추가 입력을 무시해 순서가 꼬이지 않게 함
   - 태블릿(768~1199px): [사용자 지시] 웹과 같은 3칸 슬라이더 + 손가락·마우스 스와이프
   - 모바일(≤767px): 사진 1장씩 12장을 옆으로 스와이프 + 진행 막대 (맨 아래)
   ========================================================================== */
(() => {
  const DIR = 'assets/images/sns/numbering_official/';
  // 최신 → 오래된 순 (게시물 번호 1 = 가장 최신)
  const FILES = [
    'numbering_official_1791364992_4002581986945938166_5563404703_1.jpg',
    'numbering_official_1791014402_3998921578750579560_5563404703_1.jpg',
    'numbering_official_1790820002_3997499449681285047_5563404703_1.jpg',
    'numbering_official_1790323209_3991676278621198345_5563404703_1.jpg',
    'numbering_official_1790150401_3991675700830620612_5563404703_1.jpg',
    'numbering_official_1789981899_3990979892917487614_5563404703_1.jpg',
    'numbering_official_1789718402_3988575813385717823_5563404703_1.jpg',
    'numbering_official_1789545065_3987315463411632318_5563404703_1.jpg',
    'numbering_official_1789374829_3985887417948813061_5563404703_1.jpg',
    'numbering_official_1789113601_3983516716202151655_5563404703_1.jpg',
    'numbering_official_1789005606_3982790150685937663_5563404703_1.jpg',
    'numbering_official_1788943008_3982265046818513338_5563404703_1.jpg',
  ];
  const SWIPE_MIN_PX = 40; // [추정]

  const viewport = document.querySelector('[data-sns-viewport]');
  const prev = document.querySelector('[data-sns-prev]');
  const next = document.querySelector('[data-sns-next]');
  if (!viewport || !prev || !next) return;

  const total = FILES.length;
  const mod = (n) => ((n % total) + total) % total;
  const isTablet = window.matchMedia('(min-width: 768px) and (max-width: 1199px)');

  const durationValue = getComputedStyle(document.documentElement)
    .getPropertyValue('--sns-slide-duration')
    .trim();
  const duration = durationValue.endsWith('ms')
    ? parseFloat(durationValue)
    : parseFloat(durationValue) * 1000 || 400;

  // 왼쪽 칸(slot 0)에 있는 이미지 번호. 처음에는 가운데 = 최신(0), 왼쪽 = 순환상 이전(가장 오래된 11), 오른쪽 = 1
  // (index.html 의 처음 3장과 같아야 함)
  let index = total - 1;
  let busy = false;

  // 이동 중 빈 칸이 생기지 않도록 미리 불러옴
  FILES.forEach((file) => {
    new Image().src = DIR + file;
  });

  const makePhoto = (item, slot) => {
    const figure = document.createElement('figure');
    figure.className = 'sns__photo is-instant';
    figure.dataset.slot = slot;
    const img = document.createElement('img');
    img.src = DIR + FILES[item];
    img.alt = `NUMBERING 인스타그램 게시물 ${item + 1}`;
    img.draggable = false;
    figure.append(img);
    return figure;
  };

  // dir: +1 다음(왼쪽으로 이동) / -1 이전
  const move = (dir) => {
    if (busy) return;
    busy = true;

    // 들어올 이미지를 화면 밖 대기 위치에 효과 없이 놓음
    const incoming = makePhoto(dir > 0 ? mod(index + 3) : mod(index - 1), dir > 0 ? 3 : -1);
    viewport.append(incoming);
    incoming.getBoundingClientRect(); // 대기 위치 확정(reflow)
    incoming.classList.remove('is-instant');

    // 모든 이미지를 한 칸 이동 (크기 변화도 같은 transition 으로 함께 진행)
    viewport.querySelectorAll('.sns__photo').forEach((photo) => {
      photo.dataset.slot = Number(photo.dataset.slot) - dir;
    });
    index = mod(index + dir);

    // 화면 밖으로 나간 이미지 제거 후 입력 허용
    const leavingSlot = dir > 0 ? -1 : 3;
    window.setTimeout(() => {
      viewport.querySelectorAll(`.sns__photo[data-slot="${leavingSlot}"]`).forEach((photo) => photo.remove());
      busy = false;
    }, duration);
  };

  prev.addEventListener('click', () => move(-1));
  next.addEventListener('click', () => move(1));

  // 태블릿 스와이프 [사용자 지시]: 왼쪽으로 밀면 다음, 오른쪽으로 밀면 이전.
  // Pointer Events 라 손가락·마우스 끌기·펜 모두 됨 (CSS touch-action: pan-y 로 세로 스크롤은 그대로)
  // 원형 버튼 위에서 시작해도 넘어가게 갤러리 전체에서 받음(줄어든 태블릿 슬라이더에서는 버튼이 차지하는 비율이 큼). 밀었으면 버튼 클릭은 막음
  const gallery = viewport.closest('[data-sns-gallery]') || viewport;
  let start = null;
  let suppressClick = false;

  gallery.addEventListener('pointerdown', (event) => {
    if (!isTablet.matches || (event.pointerType === 'mouse' && event.button !== 0)) return;
    start = { x: event.clientX, y: event.clientY };
  });

  window.addEventListener('pointerup', (event) => {
    if (!start) return;
    const dx = event.clientX - start.x;
    const dy = event.clientY - start.y;
    start = null;
    if (Math.abs(dx) >= SWIPE_MIN_PX && Math.abs(dx) > Math.abs(dy)) {
      move(dx < 0 ? 1 : -1);
      suppressClick = true;
      window.setTimeout(() => { suppressClick = false; }, 0);
    }
  });

  // 원형 버튼의 화살표·원 이미지를 마우스로 끌면 브라우저가 파일을 끌어내려 해서(pointerup 이 안 옴) 막음
  gallery.addEventListener('dragstart', (event) => event.preventDefault());

  gallery.addEventListener('click', (event) => {
    if (!suppressClick) return;
    event.preventDefault();
    event.stopPropagation();
  }, true);

  window.addEventListener('pointercancel', () => {
    start = null;
  });

  // ---------- 태블릿·모바일 (≤1199px, 시안 74:130 / 75:138) ----------
  // [사용자 지시] 스와이프로 사진 넘기기: 한 페이지 = 큰 사진 1장 + 작은 사진 2장(시안 모양), 12장을 최신 순으로 4페이지.
  // 손가락을 따라 옆으로 밀리고 놓으면 페이지에 멈춤(CSS 스크롤 스냅). 마우스로 끌어도 같음(js/drag-scroll.js)
  const grid = document.querySelector('[data-sns-grid]');
  if (!grid) return;
  // [사용자 지시] 한 번에 사진 1장만 보이고 스와이프로 넘김 → 한 페이지 = 1장 (HTML 의 첫 묶음 3장도 1장씩 나눔)
  const PER_PAGE = 1;
  const firstPage = grid.querySelector('.sns__page');
  [...firstPage.querySelectorAll('.sns__cell')].slice(1).forEach((cell) => cell.remove());
  for (let start = PER_PAGE; start < total; start += PER_PAGE) {
    const page = document.createElement('div');
    page.className = 'sns__page';
    for (let i = start; i < Math.min(start + PER_PAGE, total); i++) {
      const figure = document.createElement('figure');
      figure.className = 'sns__cell sns__cell--big';
      const img = document.createElement('img');
      img.src = DIR + FILES[i];
      img.alt = `NUMBERING 인스타그램 게시물 ${i + 1}`;
      img.loading = 'lazy';
      img.draggable = false;
      figure.append(img);
      page.append(figure);
    }
    grid.append(page);
  }
  if (window.NumberingDragScroll) window.NumberingDragScroll(grid);

  // 진행 막대: 넘긴 비율(0~1)만큼 검은 막대가 오른쪽으로 (BEST 와 같은 방식)
  const progress = document.querySelector('.sns__progress');
  if (progress) {
    const update = () => {
      const max = grid.scrollWidth - grid.clientWidth;
      progress.style.setProperty('--best-progress', max > 0 ? String(Math.min(1, Math.max(0, grid.scrollLeft / max))) : '0');
    };
    grid.addEventListener('scroll', () => window.requestAnimationFrame(update), { passive: true });
    window.addEventListener('resize', update);
    update();
  }
})();
