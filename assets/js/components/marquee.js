/**
 * Continuous marquee animation.
 */

function createMarquee(marquee) {
  if (marquee.dataset.initialized === "true") {
    return;
  }

  const track = marquee.querySelector(".marquee__track");
  const originalGroup = marquee.querySelector(".marquee__group");

  if (!track || !originalGroup) {
    return;
  }

  marquee.dataset.initialized = "true";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  );

  if (prefersReducedMotion.matches) {
    return;
  }

  const clonedGroup = originalGroup.cloneNode(true);

  clonedGroup.setAttribute("aria-hidden", "true");
  track.appendChild(clonedGroup);

  const speed = Number(marquee.dataset.speed) || 55;

  let position = 0;
  let groupWidth = originalGroup.offsetWidth;
  let previousTime = performance.now();
  let animationFrameId = null;

  function updateGroupWidth() {
    groupWidth = originalGroup.offsetWidth;
  }

  function animate(currentTime) {
    /*
     * Limit the time difference so the marquee does not suddenly
     * jump after returning to an inactive browser tab.
     */
    const elapsedTime = Math.min((currentTime - previousTime) / 1000, 0.05);

    previousTime = currentTime;
    position -= speed * elapsedTime;

    if (Math.abs(position) >= groupWidth) {
      position += groupWidth;
    }

    track.style.transform = `translate3d(${position}px, 0, 0)`;

    animationFrameId = window.requestAnimationFrame(animate);
  }

  function startMarquee() {
    if (animationFrameId !== null) {
      return;
    }

    previousTime = performance.now();

    animationFrameId = window.requestAnimationFrame(animate);
  }

  function stopMarquee() {
    if (animationFrameId === null) {
      return;
    }

    window.cancelAnimationFrame(animationFrameId);
    animationFrameId = null;
  }

  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      stopMarquee();
    } else {
      startMarquee();
    }
  });

  window.addEventListener("resize", updateGroupWidth);

  if ("ResizeObserver" in window) {
    const resizeObserver = new ResizeObserver(updateGroupWidth);

    resizeObserver.observe(originalGroup);
  }

  startMarquee();
}

export function initMarquees() {
  const marquees = document.querySelectorAll(".marquee");

  marquees.forEach(createMarquee);
}
