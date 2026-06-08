/* ============================================================
   Weather Dashboard — Illia Hudz
   Data: Open-Meteo (free, no API key)
   ============================================================ */

/* ---------- Weather-code → description + icon category (WMO) ---------- */
function describe(code) {
  const m = {
    0: ['Clear sky', 'clear'],
    1: ['Mainly clear', 'partly'], 2: ['Partly cloudy', 'partly'], 3: ['Overcast', 'cloud'],
    45: ['Fog', 'fog'], 48: ['Rime fog', 'fog'],
    51: ['Light drizzle', 'drizzle'], 53: ['Drizzle', 'drizzle'], 55: ['Heavy drizzle', 'drizzle'],
    56: ['Freezing drizzle', 'drizzle'], 57: ['Freezing drizzle', 'drizzle'],
    61: ['Light rain', 'rain'], 63: ['Rain', 'rain'], 65: ['Heavy rain', 'rain'],
    66: ['Freezing rain', 'rain'], 67: ['Freezing rain', 'rain'],
    71: ['Light snow', 'snow'], 73: ['Snow', 'snow'], 75: ['Heavy snow', 'snow'], 77: ['Snow grains', 'snow'],
    80: ['Light showers', 'rain'], 81: ['Showers', 'rain'], 82: ['Violent showers', 'rain'],
    85: ['Snow showers', 'snow'], 86: ['Snow showers', 'snow'],
    95: ['Thunderstorm', 'thunder'], 96: ['Thunderstorm, hail', 'thunder'], 99: ['Thunderstorm, hail', 'thunder']
  };
  return m[code] || ['—', 'cloud'];
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

/* ---------- Status helpers ---------- */
function setStatus(msg, kind) {
  if (!msg) { statusEl.hidden = true; statusEl.textContent = ''; statusEl.className = 'status'; return; }
  statusEl.hidden = false;
  statusEl.className = 'status' + (kind ? ' ' + kind : '');
  statusEl.textContent = msg;
}

/* ---------- API ---------- */
async function geocode(city) {
  const url = 'https://geocoding-api.open-meteo.com/v1/search?name=' + encodeURIComponent(city) + '&count=1&language=en&format=json';
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
  setStatus('Searching for “' + city + '”', 'loading');
  try {
    const place = await geocode(city);
    const data = await getForecast(place.latitude, place.longitude);
    const name = [place.name, place.admin1].filter(Boolean).join(', ');
    render(data, name + (place.country ? ' · ' + place.country : ''));
    try { localStorage.setItem('weather:lastCity', city); } catch (e) {}
  } catch (err) {
    handleError(err);
  }
}

async function loadCoords(lat, lon, label) {
  setStatus('Getting your local forecast', 'loading');
  try {
    const data = await getForecast(lat, lon);
    render(data, label || 'Your location');
  } catch (err) {
    handleError(err);
  }
}

function handleError(err) {
  weatherEl.hidden = true;
  if (err && err.message === 'notfound') {
    setStatus('Couldn’t find that city. Check the spelling and try again.', 'error');
  } else {
    setStatus('Couldn’t reach the weather service. Please check your connection and try again.', 'error');
  }
}

/* ---------- Render ---------- */
function render(data, placeLabel) {
  setStatus(null);

  const cur = data.current;
  const [label, cat] = describe(cur.weather_code);

  document.getElementById('cur-icon').innerHTML = icon(cat);
  document.getElementById('cur-temp').textContent = Math.round(cur.temperature_2m);
  document.getElementById('cur-desc').textContent = label;
  document.getElementById('place').textContent = placeLabel;
  document.getElementById('local-time').textContent = new Intl.DateTimeFormat('en', {
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
    const [, cat] = describe(daily.weather_code[i]);
    const dow = new Date(d + 'T12:00:00').toLocaleDateString('en', { weekday: 'short' });
    const hi = Math.round(daily.temperature_2m_max[i]);
    const lo = Math.round(daily.temperature_2m_min[i]);
    return '<li class="day">'
      + '<span class="dow">' + (i === 0 ? 'Today' : dow) + '</span>'
      + '<span class="day-icon">' + icon(cat) + '</span>'
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
  const y = (t) => padTop + (H - padTop - padBottom) * (1 - (t - lo) / (hi - lo));

  const pts = (arr) => arr.map((t, i) => x(i) + ',' + y(t)).join(' ');
  const dots = (arr, cls) => arr.map((t, i) => '<circle class="' + cls + '" cx="' + x(i) + '" cy="' + y(t) + '" r="3"/>').join('');
  const labels = (arr, cls, dy) => arr.map((t, i) => '<text class="lbl ' + cls + '" x="' + x(i) + '" y="' + (y(t) + dy) + '" text-anchor="middle">' + t + '°</text>').join('');

  const svg =
    '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="7-day high and low temperature chart">'
    + '<polyline class="line-max" points="' + pts(maxs) + '"/>'
    + '<polyline class="line-min" points="' + pts(mins) + '"/>'
    + dots(maxs, 'dot-max') + dots(mins, 'dot-min')
    + labels(maxs, 'lbl-max', -10)
    + labels(mins, '', 18)
    + '</svg>';

  document.getElementById('chart').innerHTML = svg;
}

/* ---------- Events ---------- */
form.addEventListener('submit', (e) => {
  e.preventDefault();
  loadCity(input.value);
});

geoBtn.addEventListener('click', () => {
  if (!navigator.geolocation) {
    setStatus('Geolocation isn’t available in this browser.', 'error');
    return;
  }
  setStatus('Locating you', 'loading');
  navigator.geolocation.getCurrentPosition(
    (pos) => loadCoords(pos.coords.latitude, pos.coords.longitude, 'Your location'),
    () => setStatus('Couldn’t get your location. Try searching for a city instead.', 'error'),
    { timeout: 10000 }
  );
});

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
(function init() {
  let last = 'Basel';
  try { last = localStorage.getItem('weather:lastCity') || 'Basel'; } catch (e) {}
  input.value = last;
  loadCity(last);
})();
