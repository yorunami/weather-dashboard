# Weather Dashboard

Search any city for the current conditions and a 7-day forecast, built with vanilla
**HTML, CSS & JavaScript**. Live data comes from the free
[Open-Meteo](https://open-meteo.com) API — **no API key needed**.

🔗 **Live demo:** [on my portfolio](https://illiahudz.netlify.app/Projects/weather-dashboard/)

## Features

- **City search** (Open-Meteo geocoding) and **"Locate me"** via the browser's geolocation
- **Current conditions**: temperature, feels-like, humidity, wind, and a weather icon
- **7-day forecast** with a small hand-drawn **SVG temperature chart**
- Light / dark theme, shared with the rest of the portfolio
- Pure `fetch` against a public API — no key, no backend

## Run it locally

It's a static site — open `index.html` in a browser, or serve the folder:

```bash
npx serve .
```

## Files

| File | Purpose |
|------|---------|
| `index.html` | Markup — search form, current card, forecast |
| `style.css` | Styling (design tokens, light/dark) |
| `app.js` | Geocoding + forecast fetch, rendering, SVG chart |

---

Part of my [portfolio](https://illiahudz.netlify.app). Built by Illia Hudz.
