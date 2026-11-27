/* Coverflow-style photo carousel */
document.querySelectorAll("[data-carousel]").forEach(carousel => {
  const stage = carousel.querySelector(".photo-stage");
  const cards = Array.from(carousel.querySelectorAll(".photo-card"));
  const dotsBox = carousel.querySelector("[data-dots]");
  const n = cards.length;
  if (!n) return;

  const start = parseInt(carousel.dataset.start, 10);
  let current = Number.isNaN(start) ? Math.floor((n - 1) / 2) : start;

  const dots = cards.map((_, i) => {
    const dot = document.createElement("button");
    dot.type = "button";
    dot.setAttribute("aria-label", `Show photo ${i + 1}`);
    dot.addEventListener("click", () => go(i));
    dotsBox.appendChild(dot);
    return dot;
  });

  // Signed distance from the current photo, wrapping around so both sides stay filled.
  function offsetOf(i) {
    let o = (i - current) % n;
    if (o > n / 2) o -= n;
    if (o < -n / 2) o += n;
    return o;
  }

  function render() {
    const style = getComputedStyle(carousel);
    const step = parseFloat(style.getPropertyValue("--step")) || 150;
    const angle = parseFloat(style.getPropertyValue("--angle")) || 40;

    cards.forEach((card, i) => {
      const o = offsetOf(i);
      const a = Math.abs(o);
      const s = Math.sign(o);
      card.style.zIndex = String(10 - a);
      card.style.transform = "translate(-50%, -50%) " + (a === 0
        ? "translateZ(60px)"
        : `translateX(${s * (step + (a - 1) * step * 0.6)}px) translateZ(${-a * 70}px) rotateY(${-s * angle}deg)`);
      card.style.filter = a === 0 ? "none" : `brightness(${1 - a * 0.12})`;
      card.style.opacity = a > 3 ? "0" : "1";
      card.setAttribute("aria-hidden", a === 0 ? "false" : "true");
    });
    dots.forEach((dot, i) => dot.classList.toggle("active", i === current));
  }

  function go(i) {
    current = (i + n) % n;
    render();
  }

  carousel.querySelector("[data-prev]").addEventListener("click", () => go(current - 1));
  carousel.querySelector("[data-next]").addEventListener("click", () => go(current + 1));
  cards.forEach((card, i) => card.addEventListener("click", () => go(i)));

  // Swipe on touch devices
  let startX = null;
  stage.addEventListener("touchstart", e => { startX = e.touches[0].clientX; }, { passive: true });
  stage.addEventListener("touchend", e => {
    if (startX === null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 40) go(current + (dx < 0 ? 1 : -1));
    startX = null;
  });

  window.addEventListener("resize", render);
  render();
  // Enable animations only after the first layout, so the page does not animate on load.
  requestAnimationFrame(() => requestAnimationFrame(() => carousel.classList.add("ready")));
});
