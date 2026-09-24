import { loadIncludes } from "./core/include.js";
import { initLanguageSelect } from "./components/lang.js";
import { initMarquees } from "./components/marquee.js";
import { initPageLoader } from "./components/sap.js";

function initSmoothScroll() {
  if (typeof window.Lenis !== "function") {
    return null;
  }

  const lenis = new window.Lenis({
    autoRaf: true,
    autoToggle: true,
    anchors: true,
    allowNestedScroll: true,
    stopInertiaOnNavigate: true,
  });

  if (
    typeof window.gsap !== "undefined" &&
    typeof window.ScrollTrigger !== "undefined"
  ) {
    window.gsap.registerPlugin(window.ScrollTrigger);
    lenis.on("scroll", window.ScrollTrigger.update);
  }

  return lenis;
}

function forceHideLoader() {
  const loader = document.querySelector(".page-loader");

  if (loader) {
    loader.hidden = true;
    loader.style.display = "none";
    loader.style.opacity = "0";
  }

  document.body.classList.remove("is-loading");
  document.body.style.overflow = "";
}

async function initializeWebsite() {
  /*
   * Safety timeout so the loader can never remain stuck.
   */
  const loaderSafetyTimeout = window.setTimeout(forceHideLoader, 10000);

  try {
    await loadIncludes();

    initLanguageSelect();
    initMarquees();

    const lenis = initSmoothScroll();

    await initPageLoader();

    window.clearTimeout(loaderSafetyTimeout);

    document.dispatchEvent(
      new CustomEvent("website:ready", {
        detail: {
          lenis,
        },
      }),
    );
  } catch (error) {
    console.error("Website initialization failed:", error);

    window.clearTimeout(loaderSafetyTimeout);
    forceHideLoader();
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeWebsite, {
    once: true,
  });
} else {
  initializeWebsite();
}
