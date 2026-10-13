/* ==========================================================================
   Drag scroll — 가로 스와이프 영역을 마우스로 끌어도 손가락처럼 밀리게 함 (사용자 지시: "스와이핑으로 사진을 넘기는 것")
   - 손가락(터치)은 브라우저 기본 가로 스크롤 + scroll-snap 이 그대로 처리 (사진이 손가락을 따라 밀리고 놓으면 칸에 멈춤)
   - 마우스: 누른 채 끌면 사진이 마우스를 따라 밀리고, 놓으면 끈 방향의 다음 칸(조금만 끌었으면 제자리)으로 부드럽게 멈춤
   - 끄는 동안에는 scroll-snap 을 잠시 끄고, 멈춘 뒤 되돌림. 끌었으면 그 뒤의 클릭(링크 이동)은 막음
   - 사용: window.NumberingDragScroll(스크롤 요소)  — 칸 = 스크롤 요소의 자식들
   ========================================================================== */
(() => {
  const DRAG_MIN_PX = 40; // 이만큼 이상 끌어야 다음 칸으로

  window.NumberingDragScroll = (el) => {
    let drag = null;
    let suppressClick = false;
    el.addEventListener('click', (event) => {
      if (!suppressClick) return;
      event.preventDefault();
      event.stopPropagation();
    }, true);

    // 각 칸이 멈추는 scrollLeft (scroll-padding 만큼 띄움)
    // 화면 순서대로 정렬: CSS order 로 HTML 순서와 보이는 순서가 다를 수 있음 (모바일 Hero 는 오른쪽 사진이 먼저)
    const stops = () => {
      const pad = parseFloat(getComputedStyle(el).scrollPaddingInlineStart) || 0;
      const base = el.getBoundingClientRect().left;
      const max = el.scrollWidth - el.clientWidth;
      return [...el.children]
        .filter((c) => c.getBoundingClientRect().width > 0)
        .map((c) => Math.max(0, Math.min(max, c.getBoundingClientRect().left - base + el.scrollLeft - pad)))
        .sort((a, b) => a - b);
    };

    el.addEventListener('pointerdown', (event) => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return;
      if (el.scrollWidth <= el.clientWidth) return; // 넘칠 때만 (데스크톱 레이아웃에서는 동작 안 함)
      drag = { x: event.clientX, left: el.scrollLeft, moved: false };
      el.style.scrollSnapType = 'none';
    });

    window.addEventListener('pointermove', (event) => {
      if (!drag) return;
      const dx = event.clientX - drag.x;
      if (Math.abs(dx) > 3) drag.moved = true;
      el.scrollLeft = drag.left - dx;
    });

    const end = (event) => {
      if (!drag) return;
      const { x, left, moved } = drag;
      drag = null;
      const dx = event.clientX - x;
      const list = stops();
      // 시작 위치에 가장 가까운 칸 → 끈 방향으로 한 칸 (조금만 끌었으면 제자리)
      let index = list.reduce((best, s, i) => (Math.abs(s - left) < Math.abs(list[best] - left) ? i : best), 0);
      if (Math.abs(dx) >= DRAG_MIN_PX) index = Math.max(0, Math.min(list.length - 1, index + (dx < 0 ? 1 : -1)));
      const target = list[index] ?? 0;
      const restore = () => { el.style.scrollSnapType = ''; };
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        el.scrollLeft = target;
        restore();
      } else {
        el.scrollTo({ left: target, behavior: 'smooth' }); // 끝나면 스냅 되돌림
        window.setTimeout(restore, 450);
      }
      // 끈 뒤에 바로 따라오는 클릭(카드 링크 이동)은 막음 (클릭은 pointerup 직후 같은 순간에 옴)
      suppressClick = moved;
      window.setTimeout(() => { suppressClick = false; }, 0);
    };
    window.addEventListener('pointerup', end);
    window.addEventListener('pointercancel', end);

    // 사진·링크를 끌면 브라우저가 파일을 끌어내려 하지 않게
    el.addEventListener('dragstart', (event) => event.preventDefault());
  };
})();
