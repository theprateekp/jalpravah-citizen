/**
 * JalPravah — n8n Workflow Integration Service
 *
 * Replace N8N_BASE_URL with your actual n8n instance URL.
 * Local:   http://localhost:5678/webhook
 * Cloud:   https://your-n8n.cloud/webhook
 */

const N8N_BASE_URL = 'https://your-n8n-instance.com/webhook';

// Timeout for requests (ms)
const TIMEOUT_MS = 8000;

async function fetchWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.json();
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

/**
 * Send SOS alert through n8n workflow
 * Includes full triage card data
 */
export async function sendSOSAlert({ user, ward, emergencyType, severity, triage, message }) {
  return fetchWithTimeout(`${N8N_BASE_URL}/sos-alert`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: user?.name || 'Citizen',
      phone: user?.phone || '',
      ward,
      emergencyType,
      severity,
      message,
      bloodType: triage?.bloodType || '',
      medicalFlags: [
        triage?.diabetes ? 'DIABETIC' : null,
        triage?.allergies ? `ALLERGY:${triage.allergies}` : null,
        triage?.disability ? `MOBILITY:${triage.disability}` : null,
      ].filter(Boolean),
      medicines: triage?.medicines || '',
      emergencyContact: triage?.emergencyContact || '',
      emergencyContactPhone: triage?.emergencyContactPhone || '',
    }),
  });
}

/**
 * Submit a drain/issue report through n8n workflow
 * Returns { reportId, status, assignedTo, eta }
 */
export async function submitReport({ user, ward, issueType, severity, location, description }) {
  return fetchWithTimeout(`${N8N_BASE_URL}/drain-report`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: user?.name || 'Citizen',
      phone: user?.phone || '',
      ward,
      issueType,
      severity,
      location,
      description,
    }),
  });
}

/**
 * Fetch live weather data via n8n → Open-Meteo
 * Returns 7-day forecast with precipitation data
 */
export async function fetchWeather(lat = 19.076, lng = 72.877) {
  return fetchWithTimeout(`${N8N_BASE_URL}/weather?lat=${lat}&lng=${lng}`);
}

/**
 * Parse Open-Meteo response into app-friendly format
 */
export function parseWeatherResponse(data) {
  if (!data?.daily) return null;
  const { daily } = data;
  return daily.time.map((date, i) => ({
    date,
    rainSum: daily.rain_sum?.[i] ?? 0,
    precipSum: daily.precipitation_sum?.[i] ?? 0,
    tempMax: daily.temperature_2m_max?.[i] ?? 0,
    tempMin: daily.temperature_2m_min?.[i] ?? 0,
    weatherCode: daily.weathercode?.[i] ?? 0,
  }));
}
