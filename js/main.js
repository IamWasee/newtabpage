

import { load, save } from "./storage.js";
import { startClock } from "./clock.js";
import { loadWeather } from "./weather.js";
import { initTodos } from "./todos.js";
import { initLinks } from "./links.js";

const DEFAULTS = { name: "", city: "Dhaka", use24h: false };
let settings = { ...DEFAULTS, ...load("settings", {}) };

const weatherBox = document.getElementById("weather");

startClock(() => settings);
loadWeather(weatherBox, settings.city);
initTodos();
initLinks();

const searchForm = document.getElementById("search");
const searchInput = document.getElementById("search-input");

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const q = searchInput.value.trim();
  if (!q) return;
  const looksLikeUrl = /^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\/\S*)?$/i.test(q);
  window.location.href = looksLikeUrl
    ? (q.startsWith("http") ? q : `https://${q}`)
    : `https://www.google.com/search?q=${encodeURIComponent(q)}`;
});

document.addEventListener("keydown", (e) => {
  if (e.key === "/" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) {
    e.preventDefault();
    searchInput.focus();
  }
});


const dialog = document.getElementById("settings");
const settingsForm = document.getElementById("settings-form");

document.getElementById("settings-btn").addEventListener("click", () => {
  settingsForm.name.value = settings.name;
  settingsForm.city.value = settings.city;
  settingsForm.use24h.checked = settings.use24h;
  dialog.showModal();
});

dialog.addEventListener("close", () => {
  if (dialog.returnValue !== "save") return;
  const cityChanged = settingsForm.city.value.trim() !== settings.city;
  settings = {
    name: settingsForm.name.value.trim(),
    city: settingsForm.city.value.trim() || DEFAULTS.city,
    use24h: settingsForm.use24h.checked,
  };
  save("settings", settings);
  if (cityChanged) loadWeather(weatherBox, settings.city);
});
