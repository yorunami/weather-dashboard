/* ============================================================
   Weather Dashboard — Illia Hudz
   Data: Open-Meteo (free, no API key) · EN/DE UI
   ============================================================ */

/* ---------- Language ---------- */
let lang = 'en';
try { if (localStorage.getItem('lang') === 'de') lang = 'de'; } catch (e) {}
const locale = () => (lang === 'de' ? 'de-CH' : 'en-GB');

const STR = {
  en: {
    searching: (c) => 'Searching for “' + c + '”',
    localForecast: 'Getting your local forecast',
    locating: 'Locating you',
    notFound: 'Couldn’t find that city. Check the spelling and try again.',
    netErr: 'Couldn’t reach the weather service. Please check your connection and try again.',
    geoUnavail: 'Geolocation isn’t available in this browser.',
    geoErr: 'Couldn’t get your location. Try searching for a city instead.',
    yourLocation: 'Your location', today: 'Today'
  },
  de: {
    searching: (c) => 'Suche nach „' + c + '“',
    localForecast: 'Lokale Vorhersage wird geladen',
    locating: 'Standort wird ermittelt',
    notFound: 'Diese Stadt wurde nicht gefunden. Bitte Schreibweise prüfen und erneut versuchen.',
    netErr: 'Der Wetterdienst ist nicht erreichbar. Bitte Verbindung prüfen und erneut versuchen.',
    geoUnavail: 'Standortbestimmung ist in diesem Browser nicht verfügbar.',
    geoErr: 'Dein Standort konnte nicht ermittelt werden. Suche stattdessen nach einer Stadt.',
    yourLocation: 'Dein Standort', today: 'Heute'
  }
};
function t() { return STR[lang]; }

/* ---------- Weather-code → category + EN/DE label (WMO) ---------- */
const WMO = {
  0: ['clear', 'Clear sky', 'Klarer Himmel'],
  1: ['partly', 'Mainly clear', 'Überwiegend klar'], 2: ['partly', 'Partly cloudy', 'Teils bewölkt'], 3: ['cloud', 'Overcast', 'Bedeckt'],
  45: ['fog', 'Fog', 'Nebel'], 48: ['fog', 'Rime fog', 'Reifnebel'],
  51: ['drizzle', 'Light drizzle', 'Leichter Niesel'], 53: ['drizzle', 'Drizzle', 'Niesel'], 55: ['drizzle', 'Heavy drizzle', 'Starker Niesel'],
  56: ['drizzle', 'Freezing drizzle', 'Gefrierender Niesel'], 57: ['drizzle', 'Freezing drizzle', 'Gefrierender Niesel'],
  61: ['rain', 'Light rain', 'Leichter Regen'], 63: ['rain', 'Rain', 'Regen'], 65: ['rain', 'Heavy rain', 'Starker Regen'],
  66: ['rain', 'Freezing rain', 'Gefrierender Regen'], 67: ['rain', 'Freezing rain', 'Gefrierender Regen'],
  71: ['snow', 'Light snow', 'Leichter Schnee'], 73: ['snow', 'Snow', 'Schnee'], 75: ['snow', 'Heavy snow', 'Starker Schnee'], 77: ['snow', 'Snow grains', 'Schneegriesel'],
  80: ['rain', 'Light showers', 'Leichte Schauer'], 81: ['rain', 'Showers', 'Schauer'], 82: ['rain', 'Violent showers', 'Heftige Schauer'],
  85: ['snow', 'Snow showers', 'Schneeschauer'], 86: ['snow', 'Snow showers', 'Schneeschauer'],
  95: ['thunder', 'Thunderstorm', 'Gewitter'], 96: ['thunder', 'Thunderstorm, hail', 'Gewitter, Hagel'], 99: ['thunder', 'Thunderstorm, hail', 'Gewitter, Hagel']
};
function describe(code) {
  const e = WMO[code] || ['cloud', '—', '—'];
  return { cat: e[0], label: lang === 'de' ? e[2] : e[1] };
}

const ICONS = {
  clear: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 2v2.5M12 19.5V22M4.2 4.2 6 6M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8 6 18M18 6l1.8-1.8"/></svg>',
  partly: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="7.5" r="3"/><path d="M8 1.8V3M2.3 7.5H3.5M3.9 3.4l.8.8M12.1 3.4l-.8.8"/><path d="M7 19h8.5a3.3 3.3 0 0 0 .3-6.6A4.8 4.8 0 0 0 6.6 12 3.3 3.3 0 0 0 7 19Z"/></svg>',
  cloud: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M7 18h9.5a3.5 3.5 0 0 0 .3-7A5.5 5.5 0 0 0 6.5 10 3.5 3.5 0 0 0 7 18Z"/></svg>',
  fog: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6 12.5h10a3 3 0 0 0 .3-6A5 5 0 0 0 6.3 6"/><path d="M4 16.5h14M6 20.5h12"/></svg>',
  drizzle: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M7 14h9.5a3.5 3.5 0 0 0 .3-7A5.5 5.5 0 0 0 6.5 6 3.5 3.5 0 0 0 7 14Z"/><path d="M9 17.5v1.5M12 17.5v2M15 17.5v1.5"/></svg>',
  rain: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M7 14h9.5a3.5 3.5 0 0 0 .3-7A5.5 5.5 0 0 0 6.5 6 3.5 3.5 0 0 0 7 14Z"/><path d="M8.5 17l-1 2.5M12 17l-1 2.5M15.5 17l-1 2.5"/></svg>',
  snow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M7 13h9.5a3.5 3.5 0 0 0 .3-7A5.5 5.5 0 0 0 6.5 5 3.5 3.5 0 0 0 7 13Z"/><path d="M9 17.5h.01M12 19h.01M15 17.5h.01M10.5 20.5h.01M13.5 20.5h.01"/></svg>',
  thunder: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M7 13h9.5a3.5 3.5 0 0 0 .3-7A5.5 5.5 0 0 0 6.5 5 3.5 3.5 0 0 0 7 13Z"/><path d="M12.5 14.5 10 18.5h3L10.5 22.5"/></svg>'
};
function icon(cat) { return ICONS[cat] || ICONS.cloud; }

/* ---------- Elements ---------- */
const form = document.getElementById('search-form');
const input = document.getElementById('city-input');
const geoBtn = document.getElementById('geo-btn');
const statusEl = document.getElementById('status');
const weatherEl = document.getElementById('weather');

/* ---------- State (for re-render on language switch) ---------- */
let lastData = null;
let lastPlace = '';
let lastError = null; // 'notFound' | 'netErr' | 'geoErr' | 'geoUnavail'

/* ---------- Status helpers ---------- */
function setStatus(msg, kind) {
  if (!msg) { statusEl.hidden = true; statusEl.textContent = ''; statusEl.className = 'status'; return; }
  statusEl.hidden = false;
  statusEl.className = 'status' + (kind ? ' ' + kind : '');
  statusEl.textContent = msg;
}

/* ---------- API ---------- */
async function geocode(city) {
  const url = 'https://geocoding-api.open-meteo.com/v1/search?name=' + encodeURIComponent(city) + '&count=1&language=' + lang + '&format=json';
  const r = await fetch(url);
  if (!r.ok) throw new Error('geo');
  const j = await r.json();
  if (!j.results || !j.results.length) throw new Error('notfound');
  return j.results[0];
}
async function getForecast(lat, lon) {
  const url = 'https://api.open-meteo.com/v1/forecast'
    + '?latitude=' + lat + '&longitude=' + lon
    + '&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m'
    + '&daily=weather_code,temperature_2m_max,temperature_2m_min'
    + '&timezone=auto&forecast_days=7';
  const r = await fetch(url);
  if (!r.ok) throw new Error('forecast');
  return r.json();
}

/* ---------- Load flows ---------- */
async function loadCity(city) {
  city = (city || '').trim();
  if (!city) return;
  lastError = null;
  setStatus(t().searching(city), 'loading');
  try {
    const place = await geocode(city);
    const data = await getForecast(place.latitude, place.longitude);
    const name = [place.name, place.admin1].filter(Boolean).join(', ');
    render(data, name + (place.country ? ' · ' + place.country : ''));
    try { localStorage.setItem('weather:lastCity', city); } catch (e) {}
  } catch (err) { handleError(err); }
}
async function loadCoords(lat, lon) {
  lastError = null;
  setStatus(t().localForecast, 'loading');
  try {
    const data = await getForecast(lat, lon);
    render(data, t().yourLocation);
  } catch (err) { handleError(err); }
}
function handleError(err) {
  weatherEl.hidden = true;
  lastData = null;
  lastError = (err && err.message === 'notfound') ? 'notFound' : 'netErr';
  setStatus(t()[lastError], 'error');
}

/* ---------- Render ---------- */
function render(data, placeLabel) {
  lastData = data; lastPlace = placeLabel; lastError = null;
  setStatus(null);

  const cur = data.current;
  const info = describe(cur.weather_code);
  document.getElementById('cur-icon').innerHTML = icon(info.cat);
  document.getElementById('cur-temp').textContent = Math.round(cur.temperature_2m);
  document.getElementById('cur-desc').textContent = info.label;
  document.getElementById('place').textContent = placeLabel;
  document.getElementById('local-time').textContent = new Intl.DateTimeFormat(locale(), {
    weekday: 'long', day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit', timeZone: data.timezone
  }).format(new Date());
  document.getElementById('feels').textContent = Math.round(cur.apparent_temperature) + '°';
  document.getElementById('humidity').textContent = Math.round(cur.relative_humidity_2m) + '%';
  document.getElementById('wind').textContent = Math.round(cur.wind_speed_10m) + ' km/h';

  renderChart(data.daily);
  renderDays(data.daily);
  weatherEl.hidden = false;
}

function renderDays(daily) {
  const list = document.getElementById('days');
  list.innerHTML = daily.time.map((d, i) => {
    const info = describe(daily.weather_code[i]);
    const dow = i === 0 ? t().today : new Date(d + 'T12:00:00').toLocaleDateString(locale(), { weekday: 'short' });
    const hi = Math.round(daily.temperature_2m_max[i]);
    const lo = Math.round(daily.temperature_2m_min[i]);
    return '<li class="day">'
      + '<span class="dow">' + dow + '</span>'
      + '<span class="day-icon">' + icon(info.cat) + '</span>'
      + '<span class="temps"><span class="hi">' + hi + '°</span><span class="lo">' + lo + '°</span></span>'
      + '</li>';
  }).join('');
}

function renderChart(daily) {
  const maxs = daily.temperature_2m_max.map(Math.round);
  const mins = daily.temperature_2m_min.map(Math.round);
  const n = daily.time.length;
  const W = 700, H = 210, padX = 26, padTop = 28, padBottom = 24;
  const all = maxs.concat(mins);
  let lo = Math.min.apply(null, all), hi = Math.max.apply(null, all);
  if (hi === lo) { hi += 1; lo -= 1; }
  const x = (i) => padX + i * ((W - 2 * padX) / (n - 1));
  const y = (v) => padTop + (H - padTop - padBottom) * (1 - (v - lo) / (hi - lo));
  const pts = (arr) => arr.map((v, i) => x(i) + ',' + y(v)).join(' ');
  const dots = (arr, cls) => arr.map((v, i) => '<circle class="' + cls + '" cx="' + x(i) + '" cy="' + y(v) + '" r="3"/>').join('');
  const labels = (arr, cls, dy) => arr.map((v, i) => '<text class="lbl ' + cls + '" x="' + x(i) + '" y="' + (y(v) + dy) + '" text-anchor="middle">' + v + '°</text>').join('');
  document.getElementById('chart').innerHTML =
    '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="7-day high and low temperature chart">'
    + '<polyline class="line-max" points="' + pts(maxs) + '"/>'
    + '<polyline class="line-min" points="' + pts(mins) + '"/>'
    + dots(maxs, 'dot-max') + dots(mins, 'dot-min')
    + labels(maxs, 'lbl-max', -10) + labels(mins, '', 18)
    + '</svg>';
}

/* ---------- Events ---------- */
form.addEventListener('submit', (e) => { e.preventDefault(); loadCity(input.value); });
geoBtn.addEventListener('click', () => {
  if (!navigator.geolocation) { lastError = 'geoUnavail'; setStatus(t().geoUnavail, 'error'); return; }
  setStatus(t().locating, 'loading');
  navigator.geolocation.getCurrentPosition(
    (pos) => loadCoords(pos.coords.latitude, pos.coords.longitude),
    () => { lastError = 'geoErr'; setStatus(t().geoErr, 'error'); },
    { timeout: 10000 }
  );
});

/* ---------- Language toggle (EN / DE) ---------- */
function applyLang(next) {
  lang = next;
  document.documentElement.lang = next;
  document.querySelectorAll('[data-de]').forEach((el) => {
    if (el.dataset.en === undefined) el.dataset.en = el.innerHTML;
    el.innerHTML = next === 'de' ? el.dataset.de : el.dataset.en;
  });
  document.querySelectorAll('[data-de-ph]').forEach((el) => {
    if (el.dataset.enPh === undefined) el.dataset.enPh = el.getAttribute('placeholder') || '';
    el.setAttribute('placeholder', next === 'de' ? el.dataset.dePh : el.dataset.enPh);
  });
  const lt = document.getElementById('lang-toggle');
  if (lt) lt.textContent = next === 'de' ? 'EN' : 'DE';
  // Re-render dynamic content in the new language
  if (lastData) render(lastData, lastPlace);
  else if (lastError) setStatus(t()[lastError], 'error');
}
const langToggle = document.getElementById('lang-toggle');
if (langToggle) {
  langToggle.addEventListener('click', () => {
    const next = lang === 'de' ? 'en' : 'de';
    try { localStorage.setItem('lang', next); } catch (e) {}
    applyLang(next);
  });
}

/* ---------- Chrome: theme, nav, year ---------- */
document.getElementById('year').textContent = new Date().getFullYear();
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });
const themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('theme', next); } catch (e) {}
  });
}

/* ---------- Init ---------- */
applyLang(lang); // translate static UI + set toggle label
(function init() {
  let last = 'Basel';
  try { last = localStorage.getItem('weather:lastCity') || 'Basel'; } catch (e) {}
  input.value = last;
  loadCity(last);
})();
