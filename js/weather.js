import { load, save } from "./storage.js";

const CACHE_MS = 30 * 60 * 1000;

const CODES = {
    0: ["☀️", "Clear"], 1: ["🌤️", "Mostly clear"], 2: ["⛅", "Partly cloudy"], 3: ["☁️", "Overcast"],
    45: ["🌫️", "Fog"], 48: ["🌫️", "Fog"],
    51: ["🌦️", "Light drizzle"], 53: ["🌦️", "Drizzle"], 55: ["🌧️", "Heavy drizzle"],
    61: ["🌧️", "Light rain"], 63: ["🌧️", "Rain"], 65: ["🌧️", "Heavy rain"],
    71: ["🌨️", "Light snow"], 73: ["🌨️", "Snow"], 75: ["❄️", "Heavy snow"],
    80: ["🌦️", "Showers"], 81: ["🌧️", "Showers"], 82: ["⛈️", "Violent showers"],
    95: ["⛈️", "Thunderstorm"], 96: ["⛈️", "Thunderstorm"], 99: ["⛈️", "Thunderstorm"],
    };

    async function getJSON(url) {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
        }

        function el(tag, className, text) {
            const node = document.createElement(tag);
            if (className) node.className = className;
            if (text !== undefined) node.textContent = text;
            return node;
        }

        function render(box, w) {
            const [icon, label] = CODES[w.code] ?? ["🌡️", "Unknown"];
            const meta = el("div", "meta");
            meta.append(el("div", "", `${label} · ${w.place}`), el("div", "", `H ${w.hi}° · L ${w.lo}° · feels ${w.feels}°`));
            box.replaceChildren(el("span", "icon", icon), el("span", "temp", `${w.temp}°`), meta);
        }

        export async function loadWeather(box, city) {
            const cached = load("weather", null);
            if (cached && cached.city === city && Date.now() - cached.at < CACHE_MS) {
                render(box, cached);
                return;
            }

            box.textContent = "Loading weather…";
            try {
                const geo = await getJSON(
                    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
                );
                if (!geo.results?.length) throw new Error(`can't find "${city}"`);
                const { latitude, longitude, name } = geo.results[0];

                const wx = await getJSON(
                    `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
                    `&current=temperature_2m,apparent_temperature,weather_code` +
                    `&daily=temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=1`
                );

                const data = {
                    city,
                    place: name,
                    temp: Math.round(wx.current.temperature_2m),
                    feels: Math.round(wx.current.apparent_temperature),
                    code: wx.current.weather_code,
                    hi: Math.round(wx.daily.temperature_2m_max[0]),
                    lo: Math.round(wx.daily.temperature_2m_min[0]),
                    at: Date.now(),
                };
                save("weather", data);
                render(box, data);
            } catch (err) {
                box.textContent = `Weather unavailable (${err.message})`;
            }
        }
