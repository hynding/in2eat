/**
 * Inline script that applies the saved theme before first paint, avoiding a
 * flash of the wrong theme. Must stay dependency-free; it runs as a string.
 */
export const SETTINGS_STORAGE_KEY = "in2eat:settings";

export const themeBootstrapScript = `(() => {
  try {
    const settings = JSON.parse(localStorage.getItem(${JSON.stringify(SETTINGS_STORAGE_KEY)}) || "{}");
    if (settings.theme && settings.theme !== "system") document.documentElement.dataset.theme = settings.theme;
  } catch {}
})();`;
