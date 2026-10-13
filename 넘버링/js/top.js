/* ==========================================================================
   TOP 버튼 — 맨 위로 이동 (사용자 지시)
   - 스크롤이 --to-top-show-at(200px) 이상이면 .is-visible 로 서서히 나타나고, 맨 위 근처에서는 숨김
   - 누르면 부드럽게 맨 위로(모션 줄이기 설정이면 바로)
   - 스크롤 이벤트는 passive + requestAnimationFrame 으로 묶고, 상태가 바뀔 때만 클래스를 토글
   ========================================================================== */
(() => {
  const button = document.querySelector('.to-top');
  if (!button) return;

  const value = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--to-top-show-at'));
  const SHOW_AT = Number.isFinite(value) ? value : 200;
  const reduceQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

  let visible = null;
  let ticking = false;

  const update = () => {
    ticking = false;
    const next = window.scrollY >= SHOW_AT;
    if (next === visible) return;
    visible = next;
    button.classList.toggle('is-visible', next);
  };

  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(update);
  };

  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: reduceQuery.matches ? 'auto' : 'smooth' });
    button.blur(); // 눌렀을 때 생긴 포커스 링이 남지 않게
  });

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('pageshow', update); // 뒤로가기(bfcache)로 돌아왔을 때
  update(); // 새로고침으로 중간 위치에서 시작한 경우
})();
