/**
 * Language selector
 */

function closeLanguageSelect(languageSelect, languageBtn) {
  languageSelect.classList.remove("active");
  languageBtn.setAttribute("aria-expanded", "false");
}

export function initLanguageSelect() {
  const languageSelectors = document.querySelectorAll(".language-select");

  languageSelectors.forEach((languageSelect) => {
    if (languageSelect.dataset.initialized === "true") {
      return;
    }

    const languageBtn = languageSelect.querySelector(".language-btn");

    const currentLanguage = languageSelect.querySelector(".language-current");

    const languageOptions = languageSelect.querySelectorAll(
      ".language-menu button[data-lang]",
    );

    if (!languageBtn || !currentLanguage) {
      return;
    }

    languageSelect.dataset.initialized = "true";

    languageBtn.addEventListener("click", (event) => {
      event.stopPropagation();

      languageSelect.classList.toggle("active");

      const isOpen = languageSelect.classList.contains("active");

      languageBtn.setAttribute("aria-expanded", String(isOpen));
    });

    languageOptions.forEach((option) => {
      option.addEventListener("click", () => {
        const selectedLanguage = option.dataset.lang;

        if (!selectedLanguage) {
          return;
        }

        currentLanguage.textContent = selectedLanguage;

        closeLanguageSelect(languageSelect, languageBtn);
      });
    });

    document.addEventListener("click", (event) => {
      if (!languageSelect.contains(event.target)) {
        closeLanguageSelect(languageSelect, languageBtn);
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeLanguageSelect(languageSelect, languageBtn);

        languageBtn.focus();
      }
    });
  });
}
