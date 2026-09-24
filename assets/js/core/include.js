/**
 * Loads HTML partials into elements containing a data-include attribute.
 *
 * Example:
 * <div data-include="./sections/header.html"></div>
 */

async function loadPartial(placeholder) {
  const filePath = placeholder.dataset.include;

  if (!filePath) {
    return;
  }

  try {
    const response = await fetch(filePath, {
      cache: "no-cache",
    });

    if (!response.ok) {
      throw new Error(`Unable to load ${filePath}. Status: ${response.status}`);
    }

    const html = await response.text();
    const template = document.createElement("template");

    template.innerHTML = html.trim();

    /*
     * Replace the placeholder completely so that unnecessary wrapper
     * elements do not affect the page layout.
     */
    placeholder.replaceWith(template.content.cloneNode(true));
  } catch (error) {
    console.error(error);

    placeholder.setAttribute("data-include-error", "true");
    placeholder.innerHTML = `
      <p class="include-error">
        Failed to load section: ${filePath}
      </p>
    `;
  }
}

export async function loadIncludes() {
  const maximumDepth = 10;
  let currentDepth = 0;

  /*
   * The loop also supports partials that contain another data-include
   * element while preventing an accidental infinite loop.
   */
  while (currentDepth < maximumDepth) {
    const placeholders = [...document.querySelectorAll("[data-include]")];

    if (placeholders.length === 0) {
      break;
    }

    await Promise.all(placeholders.map(loadPartial));

    currentDepth += 1;
  }

  if (document.querySelector("[data-include]")) {
    console.warn("Some HTML partials could not be loaded.");
  }

  document.dispatchEvent(new CustomEvent("includes:loaded"));
}
