const BASE_URL = "https://static.neshan.org";
const DEFAULT_URL = `${BASE_URL}/sdk/leaflet/1.4.0/leaflet.js`;
const DEFAULT_URL_STYLE = `${BASE_URL}/sdk/leaflet/1.4.0/leaflet.css`;

export default function loadNeshanMap({ onLoad, onError }) {
  if (typeof window === 'undefined') return;

  const style = document.createElement("link");
  style.href = DEFAULT_URL_STYLE;
  style.rel = "stylesheet";
  document.head.appendChild(style);

  if (window.L) {
    if (onLoad) onLoad();
    return;
  }

  const script = document.createElement("script");
  script.src = DEFAULT_URL;
  script.onload = () => onLoad && onLoad();
  script.onerror = () => onError && onError();
  document.body.appendChild(script);
}