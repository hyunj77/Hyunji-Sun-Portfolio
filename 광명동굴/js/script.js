// 포트폴리오 사이트가 이 페이지를 다른 도메인(vercel.app)에서 iframe으로
// 미리보기할 때, 같은 출처가 아니라서 부모 창이 직접 스크롤시킬 수 없다.
// 대신 postMessage로 스크롤 요청을 받아 처리한다.
window.addEventListener("message", (event) => {
  if (event.data && event.data.type === "portfolio-preview-scroll") {
    window.scrollBy(0, event.data.deltaY);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const siteHeader = document.querySelector(".site-header");
  if (siteHeader) {
    const syncHeaderScrolled = () => {
      siteHeader.classList.toggle("is-scrolled", window.scrollY > 0);
    };
    syncHeaderScrolled();
    window.addEventListener("scroll", syncHeaderScrolled, { passive: true });
  }

  const menuToggle = document.querySelector(".mobile-menu-toggle");
  const gnb = document.querySelector(".gnb");

  if (menuToggle && gnb) {
    menuToggle.addEventListener("click", () => {
      const isOpen = gnb.classList.toggle("open");
      menuToggle.setAttribute("aria-expanded", String(isOpen));
    });
  }

  const dots = document.querySelectorAll(".dots .dot");
  const circles = document.querySelectorAll(".culture-circle");

  circles.forEach((circle, i) => {
    circle.addEventListener("mouseenter", () => {
      dots.forEach((dot) => dot.classList.remove("on"));
      if (dots[i % dots.length]) dots[i % dots.length].classList.add("on");
    });
  });

  const langBtn = document.querySelector(".lang-select");
  const langMenu = document.querySelector("[data-lang-menu]");
  const langLabel = document.querySelector("[data-lang-label]");

  if (langBtn && langMenu && langLabel) {
    const closeLangMenu = () => {
      langMenu.hidden = true;
      langBtn.setAttribute("aria-expanded", "false");
    };
    langBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const isOpen = !langMenu.hidden;
      langMenu.hidden = isOpen;
      langBtn.setAttribute("aria-expanded", String(!isOpen));
    });
    langMenu.querySelectorAll("[data-lang]").forEach((btn) => {
      btn.addEventListener("click", () => {
        langLabel.textContent = btn.dataset.lang;
        closeLangMenu();
      });
    });
    document.addEventListener("click", (e) => {
      if (!langMenu.hidden && !langMenu.contains(e.target) && e.target !== langBtn) {
        closeLangMenu();
      }
    });
  }

  renderInstagramCarousel();
  initScrollReveal();
});

function initScrollReveal() {
  // getBoundingClientRect-based check (not IntersectionObserver): the
  // reveal-down elements start clip-path'd to zero visible area, and some
  // browsers treat that as "not intersecting" forever, so IO never fires.
  let targets = Array.from(document.querySelectorAll(".reveal-down"));
  if (!targets.length) return;

  let ticking = false;

  function revealInView() {
    const vh = window.innerHeight;
    targets = targets.filter((el) => {
      const rect = el.getBoundingClientRect();
      const inView = rect.top < vh * 0.88 && rect.bottom > 0;
      if (inView) el.classList.add("is-visible");
      return !inView;
    });
    ticking = false;
    if (!targets.length) {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    }
  }

  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(revealInView);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  revealInView();
}

/**
 * Instagram carousel — posts are added manually: save the image under
 * images/news/ and add its path + caption to IG_POSTS below.
 */
const IG_PROFILE_URL = "https://www.instagram.com/gmcave_official";

const IG_POSTS = [
  { image: "images/news/news1.png", caption: "광명동굴 신상 굿즈 홍보 비하인드" },
  { image: "images/news/news2.png", caption: "예술의전당 파사드쇼 임시 운영중단 안내" },
  { image: "images/news/news3.png", caption: "지역화폐 사용 인증" },
  { image: "images/news/news4.png", caption: "암흑스테이지 이벤트 안내" },
  { image: "images/news/news5.png", caption: "암흑스테이지 현장 스케치" },
  { image: "images/news/news6.png", caption: "운영시간 안내 Q&A" },
  { image: "images/news/news7.png", caption: "8월 휴장일 안내" },
  { image: "images/news/news8.png", caption: "야간 조명 인생샷" },
  { image: "images/news/news9.png", caption: "방문객 인증샷" },
];

const IG_ICON_SVG = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M12.001 1C9.014 1 8.639 1.013 7.465 1.066 6.294 1.12 5.495 1.305 4.796 1.578 4.072 1.858 3.458 2.234 2.847 2.846 2.235 3.457 1.859 4.071 1.577 4.794 1.305 5.494 1.119 6.294 1.066 7.464 1.014 8.637 1 9.013 1 12s.013 3.361.066 4.535c.054 1.17.24 1.97.512 2.669.281.724.657 1.338 1.269 1.949.611.612 1.225.989 1.948 1.27.699.272 1.499.457 2.67.511 1.173.053 1.548.066 4.535.066 2.987 0 3.361-.013 4.535-.066 1.17-.054 1.971-.239 2.671-.511.723-.281 1.336-.658 1.947-1.27.612-.611.988-1.225 1.27-1.949.271-.699.457-1.499.51-2.669.053-1.174.066-1.548.066-4.535 0-2.987-.013-3.362-.066-4.536-.053-1.17-.239-1.97-.51-2.669-.282-.724-.658-1.338-1.27-1.949C19.929 1.858 19.316 1.482 18.593 1.2c-.7-.272-1.5-.457-2.671-.511C14.749 1.014 14.375 1 11.387 1h.614Zm-1.634 1.981c.353-.001.746-.001 1.246-.001 2.937 0 3.285.011 4.445.064 1.073.049 1.655.228 2.043.378.514.2.88.438 1.264.823.385.385.624.751.823 1.264.15.388.328.97.378 2.043.053 1.16.064 1.508.064 4.443 0 2.936-.011 3.284-.064 4.443-.049 1.073-.228 1.655-.378 2.044-.199.512-.437.878-.823 1.263a3.36 3.36 0 0 1-1.264.822c-.387.152-.97.331-2.043.38-1.16.052-1.508.064-4.445.064-2.937 0-3.284-.012-4.444-.064-1.073-.05-1.654-.229-2.042-.38-.513-.199-.88-.438-1.264-.822a3.42 3.42 0 0 1-.824-1.264c-.15-.388-.329-.97-.378-2.043-.052-1.159-.063-1.507-.063-4.446 0-2.938.011-3.284.063-4.443.05-1.073.228-1.655.378-2.043.2-.513.439-.88.824-1.264a3.4 3.4 0 0 1 1.264-.823c.388-.151.969-.33 2.042-.38.955-.043 1.375-.058 3.198-.06Zm5.552 1.826a.8.8 0 1 0 0 1.6.8.8 0 0 0 0-1.6ZM12 6.351a5.65 5.65 0 1 0 0 11.298 5.65 5.65 0 0 0 0-11.298Zm0 1.982a3.667 3.667 0 1 1 0 7.334 3.667 3.667 0 0 1 0-7.334Z" fill="#222"/>
</svg>`;

function renderInstagramCarousel() {
  const track = document.querySelector("[data-ig-track]");
  const prevBtn = document.querySelector(".news-prev");
  const nextBtn = document.querySelector(".news-next");
  if (!track) return;

  const cardHtml = (post) => `
      <li class="ig-card">
        <div class="ig-card-frame">
          <a class="ig-card-photo" href="${IG_PROFILE_URL}" target="_blank" rel="noopener noreferrer" style="background-image:url('${post.image}');" aria-label="${post.caption}"></a>
          <a class="ig-card-btn" href="${IG_PROFILE_URL}" target="_blank" rel="noopener noreferrer">
            <span>INSTAGRAM</span>
            <span class="ig-card-btn-icon">${IG_ICON_SVG}</span>
          </a>
        </div>
      </li>
    `;

  // The set is repeated many times so the carousel always has real cards
  // ahead in either direction — no snap-back-to-center trick, it just keeps
  // moving forward/backward through fresh (repeated-content) cards. 15 laps
  // is far more than anyone clicks through in one sitting.
  const SET_SIZE = IG_POSTS.length;
  const REPEAT_COUNT = 21;
  const cardsHtml = Array.from({ length: REPEAT_COUNT }, () => IG_POSTS)
    .flat()
    .map(cardHtml)
    .join("");

  track.innerHTML = `<li class="ig-spacer" aria-hidden="true"></li>${cardsHtml}<li class="ig-spacer" aria-hidden="true"></li>`;

  const cards = () => Array.from(track.querySelectorAll(".ig-card"));

  const updateActiveCard = () => {
    const trackRect = track.getBoundingClientRect();
    const centerX = trackRect.left + trackRect.width / 2;
    let closest = null;
    let closestDist = Infinity;
    cards().forEach((card) => {
      const r = card.getBoundingClientRect();
      const dist = Math.abs(r.left + r.width / 2 - centerX);
      if (dist < closestDist) {
        closestDist = dist;
        closest = card;
      }
    });
    cards().forEach((c) => c.classList.toggle("is-active", c === closest));
    return closest;
  };

  const list = cards();
  let lastCentered = list[Math.floor(list.length / 2)];
  let activeAbsIndex = Math.floor(list.length / 2);

  // Center a card within the track itself via scrollLeft, not
  // scrollIntoView — scrollIntoView's "nearest" block option still scrolls
  // the whole page vertically when the carousel is below the fold on load,
  // which is what caused the page to jump on refresh.
  const centerCardInTrack = (card, behavior) => {
    const target = card.offsetLeft + card.offsetWidth / 2 - track.clientWidth / 2;
    track.scrollTo({ left: target, behavior });
  };

  // Growing the active card (bigger photo + frame padding) after a swipe
  // settles shifts its own center — re-center once sizing has applied so
  // the card that just became active ends up truly centered, not just the
  // point where the browser's native snap first landed.
  let settleTimer = null;
  let ticking = false;
  track.addEventListener("scroll", () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      updateActiveCard();
      ticking = false;
    });

    clearTimeout(settleTimer);
    settleTimer = setTimeout(() => {
      const closest = updateActiveCard();
      if (!closest) return;
      activeAbsIndex = cards().indexOf(closest);
      if (closest !== lastCentered) {
        lastCentered = closest;
        centerCardInTrack(closest, "smooth");
      }
    }, 120);
  });

  window.addEventListener("resize", updateActiveCard);

  if (lastCentered) {
    // Apply is-active BEFORE scrolling so the card is already at its
    // grown (active) width — centering on the pre-growth width would
    // center the wrong point once the card expands afterward.
    list.forEach((c) => c.classList.toggle("is-active", c === lastCentered));
    centerCardInTrack(lastCentered, "auto");
  }
  updateActiveCard();

  if (prevBtn && nextBtn) {
    const scrollByCard = (dir) => {
      const all = cards();
      const target = all[activeAbsIndex + dir];
      if (!target) return;
      activeAbsIndex += dir;
      lastCentered = target;
      // Same fix as the initial centering: grow the target to its
      // active size BEFORE scrolling, or the post-scroll growth shifts
      // it off-center.
      all.forEach((c) => c.classList.toggle("is-active", c === target));
      centerCardInTrack(target, "smooth");
    };
    prevBtn.addEventListener("click", () => scrollByCard(-1));
    nextBtn.addEventListener("click", () => scrollByCard(1));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const mapPreview = document.querySelector(".map-embed-preview");
  const mapImg = mapPreview ? mapPreview.querySelector("img") : null;

  if (mapPreview && mapImg) {
    const MIN_SCALE = 1;
    const MAX_SCALE = 3;
    const ZOOM_STEP = 0.15;
    // Native size of images/cavegm_map_screenshot.jpg (a single wide capture,
    // wider than the preview box) so we can size/clamp it ourselves instead
    // of relying on object-fit, which would hide the extra width.
    const IMG_NATURAL_WIDTH = 4420;
    const IMG_NATURAL_HEIGHT = 1280;
    // Calibrated from the real electronic map's own "100 m" scale readout at
    // the same zoom level this capture was taken at.
    const METERS_PER_PX_AT_SCALE_1 = 2.286;
    const SCALE_BAR_TARGET_PX = 80;
    // Where the cave entrance cluster sits in the base (scale-1) capture, as
    // a fraction of its full width/height — used to center that spot in the
    // box at the default zoom instead of opening on the image's left edge.
    const INITIAL_SCALE = 2.2;
    const INITIAL_FOCUS_X = 0.54;
    const INITIAL_FOCUS_Y = 0.32;
    let scale = INITIAL_SCALE;
    let tx = 0;
    let ty = 0;

    const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

    const scaleBarLine = mapPreview.querySelector(".map-scale-bar-line");
    const scaleBarLabel = mapPreview.querySelector(".map-scale-bar-label");

    const niceScaleNumber = (raw) => {
      const exponent = Math.floor(Math.log10(raw));
      const base = Math.pow(10, exponent);
      const fraction = raw / base;
      let niceFraction;
      if (fraction < 1.5) niceFraction = 1;
      else if (fraction < 3.5) niceFraction = 2;
      else if (fraction < 7.5) niceFraction = 5;
      else niceFraction = 10;
      return niceFraction * base;
    };

    const updateScaleBar = () => {
      if (!scaleBarLine || !scaleBarLabel) return;
      const metersPerPx = METERS_PER_PX_AT_SCALE_1 / scale;
      const rawMeters = SCALE_BAR_TARGET_PX * metersPerPx;
      const niceMeters = niceScaleNumber(rawMeters);
      const barPx = niceMeters / metersPerPx;
      scaleBarLine.style.width = `${barPx}px`;
      scaleBarLabel.textContent =
        niceMeters >= 1000 ? `${niceMeters / 1000} km` : `${niceMeters} m`;
    };

    // Base (scale-1) rendered size: image height fills the box, width
    // follows its natural aspect ratio and overflows sideways.
    const baseHeight = () => mapPreview.clientHeight;
    const baseWidth = () =>
      baseHeight() * (IMG_NATURAL_WIDTH / IMG_NATURAL_HEIGHT);

    const render = () => {
      const w = baseWidth() * scale;
      const h = baseHeight() * scale;
      const minTx = Math.min(0, mapPreview.clientWidth - w);
      const minTy = Math.min(0, mapPreview.clientHeight - h);
      tx = clamp(tx, minTx, 0);
      ty = clamp(ty, minTy, 0);
      mapImg.style.transform = `translate(${tx}px, ${ty}px) scale(${scale})`;
      updateScaleBar();
    };

    const zoomBy = (direction, offsetX, offsetY) => {
      const prevScale = scale;
      scale += direction * ZOOM_STEP;
      scale = clamp(scale, MIN_SCALE, MAX_SCALE);

      // keep the anchor point (offsetX/Y, relative to the box's top-left)
      // fixed on screen while the scale changes
      const ratio = scale / prevScale;
      tx = offsetX - (offsetX - tx) * ratio;
      ty = offsetY - (offsetY - ty) * ratio;

      render();
    };

    // Plain wheel zooms the map again, but only once the cursor has rested
    // over it for 2s — scrolling the page past the map no longer gets
    // hijacked the instant the cursor crosses it; you have to pause on it
    // first to "arm" zoom, matching the intent without needing Ctrl/Cmd.
    const ZOOM_ARM_DELAY = 2000;
    let zoomArmed = false;
    let armTimer = null;

    mapPreview.addEventListener("mouseenter", () => {
      clearTimeout(armTimer);
      armTimer = setTimeout(() => { zoomArmed = true; }, ZOOM_ARM_DELAY);
    });

    mapPreview.addEventListener("mouseleave", () => {
      clearTimeout(armTimer);
      zoomArmed = false;
    });

    mapPreview.addEventListener(
      "wheel",
      (e) => {
        if (!zoomArmed) return;
        e.preventDefault();
        const rect = mapPreview.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;
        zoomBy(e.deltaY < 0 ? 1 : -1, offsetX, offsetY);
      },
      { passive: false }
    );

    mapPreview.querySelectorAll(".map-zoom-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        zoomBy(
          Number(btn.dataset.zoomDir),
          mapPreview.clientWidth / 2,
          mapPreview.clientHeight / 2
        );
      });
    });

    tx = mapPreview.clientWidth / 2 - INITIAL_FOCUS_X * baseWidth() * scale;
    ty = mapPreview.clientHeight / 2 - INITIAL_FOCUS_Y * baseHeight() * scale;
    render();

    let isDragging = false;
    let dragMoved = false;
    let dragStartX = 0;
    let dragStartY = 0;
    let startTx = 0;
    let startTy = 0;
    const DRAG_THRESHOLD = 4;
    const MAP_SITE_URL = "https://cavegm.dadora.kr/";

    mapPreview.addEventListener("mousedown", (e) => {
      if (e.target.closest(".map-zoom-btn")) return;
      dragMoved = false;
      isDragging = true;
      dragStartX = e.clientX;
      dragStartY = e.clientY;
      startTx = tx;
      startTy = ty;
      mapPreview.classList.add("is-dragging");
    });

    window.addEventListener("mousemove", (e) => {
      if (!isDragging) return;
      const dx = e.clientX - dragStartX;
      const dy = e.clientY - dragStartY;
      if (Math.hypot(dx, dy) > DRAG_THRESHOLD) dragMoved = true;
      tx = startTx + dx;
      ty = startTy + dy;
      render();
    });

    window.addEventListener("mouseup", () => {
      if (!isDragging) return;
      isDragging = false;
      mapPreview.classList.remove("is-dragging");
    });

    mapPreview.addEventListener("click", (e) => {
      if (e.target.closest(".map-zoom-btn")) return;
      if (dragMoved) {
        dragMoved = false;
        return;
      }
      window.open(MAP_SITE_URL, "_blank", "noopener,noreferrer");
    });
  }
});
