

import { load, save } from "./storage.js";

const DEFAULT_LINKS = [
  { label: "GitHub", url: "https://github.com" },
  { label: "YouTube", url: "https://www.youtube.com" },
  { label: "Hackatime", url: "https://hackatime.hackclub.com" },
  { label: "Gmail", url: "https://mail.google.com" },
];

let links = load("links", DEFAULT_LINKS);

const list = document.getElementById("links");
const form = document.getElementById("link-form");


function normalizeUrl(input) {
  const withScheme = /^https?:\/\//i.test(input) ? input : `https://${input}`;
  try {
    const url = new URL(withScheme);
    return url.protocol === "http:" || url.protocol === "https:" ? url.href : null;
  } catch {
    return null;
  }
}

function commit() {
  save("links", links);
  render();
}

function render() {
  list.replaceChildren();
  links.forEach((link, i) => {
    const li = document.createElement("li");

    const a = document.createElement("a");
    a.href = link.url;

    const icon = document.createElement("img");
    icon.alt = "";
    icon.loading = "lazy";
    icon.src = `https://www.google.com/s2/favicons?sz=64&domain=${new URL(link.url).hostname}`;

    const label = document.createElement("span");
    label.textContent = link.label;
    a.append(icon, label);

    const del = document.createElement("button");
    del.className = "del";
    del.type = "button";
    del.textContent = "×";
    del.setAttribute("aria-label", `Remove ${link.label}`);
    del.addEventListener("click", () => {
      links.splice(i, 1);
      commit();
    });

    li.append(a, del);
    list.append(li);
  });
}

export function initLinks() {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const url = normalizeUrl(form.url.value.trim());
    if (!url) {
      form.url.setCustomValidity("That doesn't look like a web address");
      form.url.reportValidity();
      return;
    }
    links.push({ label: form.label.value.trim(), url });
    form.reset();
    commit();
  });
  form.url.addEventListener("input", () => form.url.setCustomValidity(""));
  render();
}
