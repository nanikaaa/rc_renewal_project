(() => {
  let initialized = false;

  function initializeFooter() {
    if (initialized) return true;

    const scene = document.querySelector(".js-footer-scene");
    if (!scene) return false;

    const sticky = scene.querySelector(".footer-scene__sticky");
    const cta = scene.querySelector(".footer-cta");
    const panel = scene.querySelector(".js-footer-panel");
    if (!sticky || !cta || !panel) return false;

    initialized = true;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

    scene
      .querySelector(".footer-panel__page-top")
      ?.addEventListener("click", () => {
        window.scrollTo({
          top: 0,
          behavior: reducedMotion.matches ? "instant" : "smooth",
        });
      });

    if (reducedMotion.matches) return true;

    const clamp = (value) => Math.max(0, Math.min(1, value));
    const smoothStep = (value) => value * value * (3 - 2 * value);
    let frame = null;

    function update() {
      frame = null;

      const travel = Math.max(1, scene.offsetHeight - sticky.offsetHeight);
      const progress = clamp(-scene.getBoundingClientRect().top / travel);

      const ctaProgress = smoothStep(clamp(progress / 0.48));
      cta.style.setProperty(
        "--footer-cta-y",
        `${-(sticky.offsetHeight + 12) * ctaProgress}px`,
      );

      const panelProgress = smoothStep(clamp((progress - 0.5) / 0.32));
      panel.style.setProperty(
        "--footer-panel-y",
        `${(panel.offsetHeight + 12) * (1 - panelProgress)}px`,
      );
    }

    function requestUpdate() {
      if (frame !== null) return;
      frame = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    return true;
  }

  function watchForFooter() {
    if (initializeFooter()) return;

    const observer = new MutationObserver(() => {
      if (initializeFooter()) observer.disconnect();
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  document.addEventListener("includesLoaded", initializeFooter);

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", watchForFooter, {
      once: true,
    });
  } else {
    watchForFooter();
  }
})();
