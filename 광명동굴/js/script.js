document.addEventListener("DOMContentLoaded", () => {
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
});

/**
 * Instagram carousel — mock data now, swap IG_POSTS for a real API/widget
 * response later (Elfsight, Juicer, or a self-hosted Graph API proxy) and
 * this render/nav logic keeps working unchanged.
 */
const IG_PROFILE_URL = "https://www.instagram.com/gmcave_official";

const IG_POSTS = [
  {
    image: "20200121_4.png",
    caption: "밤이 되면 더 반짝이는 광명동굴 문화행사 현장 ✨ #광명동굴 #동굴테마파크",
    likes: 482,
    comments: 21,
    date: "3일 전",
  },
  {
    image: "hall_pic27.png",
    caption: "대한민국 와인 페스티벌 in 광명동굴 🍇🍷 #광명동굴와인축제",
    likes: 356,
    comments: 14,
    date: "5일 전",
  },
  {
    image: "cvgc_001.png",
    caption: "라스코전시관에서 만나는 선사시대 동굴벽화 🦌 #라스코전시관",
    likes: 271,
    comments: 9,
    date: "1주 전",
  },
  {
    image: "hall_pic1_230810.jpg",
    caption: "웜홀광장, 빛으로 가득한 동굴 식물원 🦋 #웜홀광장 #광명동굴",
    likes: 519,
    comments: 33,
    date: "2주 전",
  },
  {
    image: "hall_pic2.jpg",
    caption: "빛의 공간에서 만나는 몽환적인 동굴 산책길 💙 #빛의공간",
    likes: 604,
    comments: 27,
    date: "2주 전",
  },
  {
    image: "cvgc_002.png",
    caption: "동굴 속 숨어있는 포토스팟, 용 조형물을 찾아보세요 🐉 #광명동굴포토스팟",
    likes: 388,
    comments: 18,
    date: "3주 전",
  },
];

const IG_ICON_SVG = `<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
  <path d="M12.001 1C9.014 1 8.639 1.013 7.465 1.066 6.294 1.12 5.495 1.305 4.796 1.578 4.072 1.858 3.458 2.234 2.847 2.846 2.235 3.457 1.859 4.071 1.577 4.794 1.305 5.494 1.119 6.294 1.066 7.464 1.014 8.637 1 9.013 1 12s.013 3.361.066 4.535c.054 1.17.24 1.97.512 2.669.281.724.657 1.338 1.269 1.949.611.612 1.225.989 1.948 1.27.699.272 1.499.457 2.67.511 1.173.053 1.548.066 4.535.066 2.987 0 3.361-.013 4.535-.066 1.17-.054 1.971-.239 2.671-.511.723-.281 1.336-.658 1.947-1.27.612-.611.988-1.225 1.27-1.949.271-.699.457-1.499.51-2.669.053-1.174.066-1.548.066-4.535 0-2.987-.013-3.362-.066-4.536-.053-1.17-.239-1.97-.51-2.669-.282-.724-.658-1.338-1.27-1.949C19.929 1.858 19.316 1.482 18.593 1.2c-.7-.272-1.5-.457-2.671-.511C14.749 1.014 14.375 1 11.387 1h.614Zm-1.634 1.981c.353-.001.746-.001 1.246-.001 2.937 0 3.285.011 4.445.064 1.073.049 1.655.228 2.043.378.514.2.88.438 1.264.823.385.385.624.751.823 1.264.15.388.328.97.378 2.043.053 1.16.064 1.508.064 4.443 0 2.936-.011 3.284-.064 4.443-.049 1.073-.228 1.655-.378 2.044-.199.512-.437.878-.823 1.263a3.36 3.36 0 0 1-1.264.822c-.387.152-.97.331-2.043.38-1.16.052-1.508.064-4.445.064-2.937 0-3.284-.012-4.444-.064-1.073-.05-1.654-.229-2.042-.38-.513-.199-.88-.438-1.264-.822a3.42 3.42 0 0 1-.824-1.264c-.15-.388-.329-.97-.378-2.043-.052-1.159-.063-1.507-.063-4.446 0-2.938.011-3.284.063-4.443.05-1.073.228-1.655.378-2.043.2-.513.439-.88.824-1.264a3.4 3.4 0 0 1 1.264-.823c.388-.151.969-.33 2.042-.38.955-.043 1.375-.058 3.198-.06Zm5.552 1.826a.8.8 0 1 0 0 1.6.8.8 0 0 0 0-1.6ZM12 6.351a5.65 5.65 0 1 0 0 11.298 5.65 5.65 0 0 0 0-11.298Zm0 1.982a3.667 3.667 0 1 1 0 7.334 3.667 3.667 0 0 1 0-7.334Z" fill="#222"/>
</svg>`;

function renderInstagramCarousel() {
  const track = document.querySelector("[data-ig-track]");
  const prevBtn = document.querySelector(".news-prev");
  const nextBtn = document.querySelector(".news-next");
  if (!track) return;

  const cardsHtml = IG_POSTS.map(
    (post) => `
      <li class="ig-card">
        <div class="ig-card-frame">
          <a class="ig-card-photo" href="${IG_PROFILE_URL}" target="_blank" rel="noopener noreferrer" style="background-image:url('${post.image}');" aria-label="${post.caption}"></a>
          <a class="ig-card-btn" href="${IG_PROFILE_URL}" target="_blank" rel="noopener noreferrer">
            <span>INSTAGRAM</span>
            <span class="ig-card-btn-icon">${IG_ICON_SVG}</span>
          </a>
        </div>
      </li>
    `
  ).join("");

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

  // Growing the active card (bigger photo + frame padding) after a swipe
  // settles shifts its own center — re-run scrollIntoView once sizing has
  // applied so the card that just became active ends up truly centered,
  // not just the point where the browser's native snap first landed.
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
      if (closest && closest !== lastCentered) {
        lastCentered = closest;
        closest.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
    }, 120);
  });

  window.addEventListener("resize", updateActiveCard);

  if (lastCentered) {
    // Apply is-active BEFORE scrolling so the card is already at its
    // grown (active) width — scrollIntoView on the pre-growth width
    // centers the wrong point once the card expands afterward.
    list.forEach((c) => c.classList.toggle("is-active", c === lastCentered));
    lastCentered.scrollIntoView({ behavior: "auto", inline: "center", block: "nearest" });
  }
  updateActiveCard();

  if (prevBtn && nextBtn) {
    const scrollByCard = (dir) => {
      const all = cards();
      const active = all.find((c) => c.classList.contains("is-active")) || all[0];
      const idx = all.indexOf(active);
      const target = all[idx + dir];
      if (target) {
        lastCentered = target;
        // Same fix as the initial centering: grow the target to its
        // active size BEFORE scrolling, or the post-scroll growth shifts
        // it off-center.
        all.forEach((c) => c.classList.toggle("is-active", c === target));
        target.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
      }
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
    // Native size of images/cavegm_map_screenshot.png (a stitched, detail-zoom
    // capture wider than the preview box) so we can size/clamp it ourselves
    // instead of relying on object-fit, which would hide the extra width.
    const IMG_NATURAL_WIDTH = 5449;
    const IMG_NATURAL_HEIGHT = 1290;
    // Calibrated so that at scale 1 a 70px bar reads "50 m", matching the
    // real electronic map's own scale readout at the same zoom level.
    const METERS_PER_PX_AT_SCALE_1 = 50 / 70;
    const SCALE_BAR_TARGET_PX = 80;
    let scale = 1;
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

    mapPreview.addEventListener(
      "wheel",
      (e) => {
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
