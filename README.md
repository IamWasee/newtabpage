# Pulse

A custom new tab page that feels alive: a beating clock, a heartbeat line, breathing background orbs, live weather, and a to-do list and quick links that remember themselves.

**Live site:** https://pulse-newtab.vercel.app

Built with plain HTML, CSS and JavaScript (no framework, no API key).

## Features

- **Clock + greeting** that uses your name and changes with the time of day. The colon beats once a second.
- **Live weather** for any city via the free [Open-Meteo](https://open-meteo.com/) API, cached for 30 minutes.
- **To-do list** saved in your browser (`localStorage`), so it survives closing the tab.
- **Quick links** with favicons; add or remove your own.
- **Smart search bar**: type a search or a URL. Press `/` anywhere to jump to it.
- **Settings** (⚙): your name, weather city, 12/24-hour clock.
- **Animations**: breathing gradient orbs, a heartbeat line that draws itself, entrance animations. Respects the OS "reduce motion" setting.

## How it works

- **Weather** takes two API calls: city name → coordinates (Open-Meteo geocoding), then coordinates → current weather. The result is cached in `localStorage` so new tabs load instantly.
- **To-dos and links** follow one pattern: change the array → save it to `localStorage` → re-render the list.
- **Safety**: user text is inserted with `textContent` (never `innerHTML`), and links only accept `http`/`https` addresses.

## Run it locally

The JavaScript uses ES modules, which browsers won't load from a plain `file://` path, so serve the folder:

```bash
python3 -m http.server 8000
```

Then open http://localhost:8000.

## Use it as your new tab page

Browsers don't let a website set itself as the new tab page, so install an extension like **New Tab Redirect** (Chrome) or **New Tab Override** (Firefox) and point it at https://pulse-newtab.vercel.app.

## Project structure

```
index.html        page structure
css/style.css     all styling + animations
js/main.js        entry point: search, settings, starts everything
js/clock.js       clock, date, greeting
js/weather.js     Open-Meteo weather + caching
js/todos.js       to-do list
js/links.js       quick links
js/storage.js     small localStorage helper
```

## Credits

Weather data by [Open-Meteo](https://open-meteo.com/). Fonts: Space Grotesk and JetBrains Mono (Google Fonts).
