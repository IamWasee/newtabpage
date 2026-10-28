

const $ = (id) => document.getElementById(id);

function greetingFor(hour) {
    if (hour < 5) return "Up late";
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    if (hour < 21) return "Good evening";
    return "Good night";
    }


    export function startClock(getSettings) {
        function tick() {
            const now = new Date();
            const { name, use24h } = getSettings();

            let hours = now.getHours();
            let suffix = "";
            if (!use24h) {
                suffix = hours >= 12 ? "PM" : "AM";
                hours = hours % 12 || 12; // 0 → 12, 13 → 1, etc.
            }

            $("hh").textContent = String(hours).padStart(2, "0");
            $("mm").textContent = String(now.getMinutes()).padStart(2, "0");
            $("ampm").textContent = suffix;

            $("greeting").textContent = greetingFor(now.getHours()) + (name ? `, ${name}` : "") + ".";
            $("date").textContent = now.toLocaleDateString(undefined, {
                weekday: "long",
                month: "long",
                day: "numeric",
            });


            setTimeout(tick, 1000 - now.getMilliseconds());
        }
        tick();
    }

