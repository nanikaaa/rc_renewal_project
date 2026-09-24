/**
 * GSAP page loader.
 */

function waitForImages(onProgress) {
  const images = Array.from(document.images).filter(
    (image) => !image.closest(".page-loader"),
  );

  if (images.length === 0) {
    onProgress(100);
    return Promise.resolve();
  }

  let completedImages = 0;

  function imageCompleted() {
    completedImages += 1;

    const progress = Math.round((completedImages / images.length) * 100);

    onProgress(progress);
  }

  const imagePromises = images.map((image) => {
    if (image.complete) {
      imageCompleted();
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      const complete = () => {
        imageCompleted();
        resolve();
      };

      image.addEventListener("load", complete, {
        once: true,
      });

      image.addEventListener("error", complete, {
        once: true,
      });
    });
  });

  return Promise.all(imagePromises);
}

function playIntroAnimation(elements) {
  const { brand, subtitle, percent } = elements;

  if (typeof window.gsap === "undefined") {
    return Promise.resolve();
  }

  return new Promise((resolve) => {
    const timeline = window.gsap.timeline({
      onComplete: resolve,
    });

    if (brand) {
      timeline.to(brand, {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power3.out",
      });
    }

    if (subtitle) {
      timeline.to(
        subtitle,
        {
          opacity: 1,
          duration: 0.4,
        },
        "-=0.25",
      );
    }

    if (percent) {
      timeline.to(
        percent,
        {
          opacity: 1,
          duration: 0.3,
        },
        "-=0.2",
      );
    }
  });
}

function hideLoader(loader) {
  if (typeof window.gsap === "undefined") {
    loader.hidden = true;
    loader.style.display = "none";

    return Promise.resolve();
  }

  return new Promise((resolve) => {
    window.gsap.to(loader, {
      opacity: 0,
      duration: 0.7,
      ease: "power2.inOut",
      onComplete: () => {
        loader.hidden = true;
        loader.style.display = "none";
        resolve();
      },
    });
  });
}

export async function initPageLoader() {
  const loader = document.querySelector(".page-loader");

  /*
   * Stop here safely when the loader HTML is not being used.
   */
  if (!loader) {
    return;
  }

  const elements = {
    brand: loader.querySelector(".loader-brand"),
    subtitle: loader.querySelector(".loader-sub"),
    percent: loader.querySelector(".loader-percent"),
    bar: loader.querySelector(".loader-bar"),
  };

  document.body.classList.add("is-loading");

  function updateProgress(value) {
    if (elements.percent) {
      elements.percent.textContent = `${value}%`;
    }

    if (elements.bar) {
      if (typeof window.gsap !== "undefined") {
        window.gsap.to(elements.bar, {
          width: `${value}%`,
          duration: 0.25,
          ease: "power2.out",
          overwrite: true,
        });
      } else {
        elements.bar.style.width = `${value}%`;
      }
    }
  }

  try {
    await playIntroAnimation(elements);
    await waitForImages(updateProgress);

    updateProgress(100);

    await new Promise((resolve) => {
      window.setTimeout(resolve, 250);
    });

    await hideLoader(loader);
  } catch (error) {
    console.error("Page loader failed:", error);

    loader.hidden = true;
    loader.style.display = "none";
  } finally {
    document.body.classList.remove("is-loading");

    document.dispatchEvent(new CustomEvent("loader:complete"));
  }
}
