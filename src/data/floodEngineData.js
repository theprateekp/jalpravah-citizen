/**
 * JalPravah — Urban Flood & Hydrology Engine Data
 *
 * PMRS Formula (0–100):
 *   PMRS = 0.30 × DrainageScore + 0.25 × RainfallReadiness
 *        + 0.20 × ResourceScore + 0.15 × TerrainScore + 0.10 × HistoricalScore
 *
 * FVI Formula (0–1) per micro-basin:
 *   FVI = 0.35 × (rainfall_intensity / max_rainfall)
 *       + 0.30 × (1 - drainage_capacity / max_drainage)
 *       + 0.20 × (1 - elevation / max_elevation)
 *       + 0.15 × (flood_history / max_history)
 */

// ─── Ward-level PMRS breakdown ───────────────────────────────────────────────
export const WARD_PMRS_DETAIL = [
  {
    code: 'F/S', name: 'Hindmata / Parel',
    pmrs: 28, risk: 'RED',
    drainage: { score: 18, capacity: 22, blocked: 68, total: 214, lastCleaned: '2024-02' },
    rainfall: { annualAvg: 2847, intensity24h: 185, returnPeriod: 5 },
    terrain: { avgElevation: 4.2, minElevation: 1.1, slope: 0.3, basinArea: 12.4 },
    resources: { pumps: 3, pumpCapacity: 1200, teams: 2, vehicles: 4, shelterCapacity: 5000 },
    historical: { floodYears: [2005, 2017, 2019, 2020, 2021, 2022, 2023], avgDepth: 118, maxDepth: 210 },
    microBasins: 168, hotspotCount: 12,
    gaps: ['12 pumps needed', 'Drain desilting overdue by 14 months', '3 pump stations non-functional'],
  },
  {
    code: 'K/E', name: 'Andheri East',
    pmrs: 35, risk: 'RED',
    drainage: { score: 24, capacity: 31, blocked: 52, total: 312, lastCleaned: '2024-03' },
    rainfall: { annualAvg: 2654, intensity24h: 172, returnPeriod: 7 },
    terrain: { avgElevation: 6.8, minElevation: 2.3, slope: 0.5, basinArea: 18.7 },
    resources: { pumps: 5, pumpCapacity: 2000, teams: 3, vehicles: 6, shelterCapacity: 8000 },
    historical: { floodYears: [2005, 2017, 2019, 2021, 2022, 2023], avgDepth: 92, maxDepth: 165 },
    microBasins: 247, hotspotCount: 8,
    gaps: ['8 pumps needed', 'Subway dewatering system offline', 'Nala encroachment unresolved'],
  },
  {
    code: 'L', name: 'Kurla',
    pmrs: 33, risk: 'RED',
    drainage: { score: 22, capacity: 28, blocked: 58, total: 287, lastCleaned: '2024-01' },
    rainfall: { annualAvg: 2712, intensity24h: 178, returnPeriod: 6 },
    terrain: { avgElevation: 5.4, minElevation: 1.8, slope: 0.4, basinArea: 15.2 },
    resources: { pumps: 4, pumpCapacity: 1600, teams: 2, vehicles: 5, shelterCapacity: 6000 },
    historical: { floodYears: [2005, 2017, 2020, 2021, 2022, 2023], avgDepth: 88, maxDepth: 155 },
    microBasins: 198, hotspotCount: 6,
    gaps: ['Railway underpass flooding unaddressed', 'Drain capacity 40% below requirement'],
  },
  {
    code: 'P/N', name: 'Malad East',
    pmrs: 29, risk: 'RED',
    drainage: { score: 19, capacity: 24, blocked: 71, total: 334, lastCleaned: '2023-11' },
    rainfall: { annualAvg: 2534, intensity24h: 168, returnPeriod: 8 },
    terrain: { avgElevation: 7.2, minElevation: 2.1, slope: 0.6, basinArea: 22.1 },
    resources: { pumps: 4, pumpCapacity: 1400, teams: 2, vehicles: 4, shelterCapacity: 7000 },
    historical: { floodYears: [2005, 2017, 2019, 2021, 2022, 2023], avgDepth: 78, maxDepth: 142 },
    microBasins: 289, hotspotCount: 5,
    gaps: ['Poisar river overflow unmitigated', '71% drains blocked — critical'],
  },
  {
    code: 'R/C', name: 'Kandivali',
    pmrs: 39, risk: 'ORANGE',
    drainage: { score: 28, capacity: 38, blocked: 44, total: 298, lastCleaned: '2024-04' },
    rainfall: { annualAvg: 2421, intensity24h: 155, returnPeriod: 10 },
    terrain: { avgElevation: 9.1, minElevation: 3.4, slope: 0.7, basinArea: 19.8 },
    resources: { pumps: 6, pumpCapacity: 2400, teams: 3, vehicles: 7, shelterCapacity: 9000 },
    historical: { floodYears: [2005, 2017, 2021, 2022], avgDepth: 62, maxDepth: 118 },
    microBasins: 212, hotspotCount: 4,
    gaps: ['4 pumps need servicing', 'Low-lying colony drainage upgrade pending'],
  },
  {
    code: 'E', name: 'Byculla',
    pmrs: 42, risk: 'ORANGE',
    drainage: { score: 31, capacity: 42, blocked: 38, total: 178, lastCleaned: '2024-04' },
    rainfall: { annualAvg: 2312, intensity24h: 148, returnPeriod: 12 },
    terrain: { avgElevation: 8.4, minElevation: 3.1, slope: 0.6, basinArea: 9.2 },
    resources: { pumps: 5, pumpCapacity: 2000, teams: 3, vehicles: 5, shelterCapacity: 6000 },
    historical: { floodYears: [2005, 2017, 2021, 2022], avgDepth: 55, maxDepth: 102 },
    microBasins: 124, hotspotCount: 3,
    gaps: ['Heritage drain network needs upgrade'],
  },
  {
    code: 'H/E', name: 'Khar / Santacruz',
    pmrs: 44, risk: 'ORANGE',
    drainage: { score: 33, capacity: 44, blocked: 35, total: 256, lastCleaned: '2024-05' },
    rainfall: { annualAvg: 2587, intensity24h: 162, returnPeriod: 9 },
    terrain: { avgElevation: 7.8, minElevation: 2.8, slope: 0.5, basinArea: 14.6 },
    resources: { pumps: 6, pumpCapacity: 2200, teams: 3, vehicles: 6, shelterCapacity: 7500 },
    historical: { floodYears: [2005, 2017, 2021, 2022], avgDepth: 68, maxDepth: 128 },
    microBasins: 178, hotspotCount: 3,
    gaps: ['Vakola nala desilting pending', 'Airport road drainage upgrade needed'],
  },
  {
    code: 'N', name: 'Ghatkopar',
    pmrs: 41, risk: 'ORANGE',
    drainage: { score: 30, capacity: 40, blocked: 41, total: 267, lastCleaned: '2024-03' },
    rainfall: { annualAvg: 2198, intensity24h: 142, returnPeriod: 11 },
    terrain: { avgElevation: 10.2, minElevation: 4.1, slope: 0.8, basinArea: 16.3 },
    resources: { pumps: 5, pumpCapacity: 1800, teams: 3, vehicles: 5, shelterCapacity: 7000 },
    historical: { floodYears: [2005, 2017, 2021, 2022], avgDepth: 58, maxDepth: 108 },
    microBasins: 189, hotspotCount: 4,
    gaps: ['Metro construction disrupting drainage', 'Station area dewatering insufficient'],
  },
  {
    code: 'G/S', name: 'Worli',
    pmrs: 52, risk: 'YELLOW',
    drainage: { score: 40, capacity: 55, blocked: 24, total: 167, lastCleaned: '2024-06' },
    rainfall: { annualAvg: 2134, intensity24h: 138, returnPeriod: 14 },
    terrain: { avgElevation: 11.4, minElevation: 4.8, slope: 0.9, basinArea: 8.7 },
    resources: { pumps: 7, pumpCapacity: 2800, teams: 4, vehicles: 8, shelterCapacity: 8000 },
    historical: { floodYears: [2005, 2017, 2021], avgDepth: 42, maxDepth: 88 },
    microBasins: 112, hotspotCount: 2,
    gaps: ['Coastal flooding risk from sea surge'],
  },
  {
    code: 'K/W', name: 'Andheri West',
    pmrs: 58, risk: 'YELLOW',
    drainage: { score: 44, capacity: 60, blocked: 21, total: 289, lastCleaned: '2024-06' },
    rainfall: { annualAvg: 2612, intensity24h: 165, returnPeriod: 10 },
    terrain: { avgElevation: 8.9, minElevation: 3.2, slope: 0.6, basinArea: 17.4 },
    resources: { pumps: 8, pumpCapacity: 3200, teams: 4, vehicles: 9, shelterCapacity: 10000 },
    historical: { floodYears: [2005, 2017, 2021], avgDepth: 48, maxDepth: 92 },
    microBasins: 201, hotspotCount: 2,
    gaps: ['Milan subway recurring issue unresolved'],
  },
  {
    code: 'H/W', name: 'Bandra West',
    pmrs: 71, risk: 'GREEN',
    drainage: { score: 56, capacity: 72, blocked: 14, total: 198, lastCleaned: '2024-07' },
    rainfall: { annualAvg: 2489, intensity24h: 158, returnPeriod: 15 },
    terrain: { avgElevation: 12.1, minElevation: 5.4, slope: 1.1, basinArea: 11.2 },
    resources: { pumps: 9, pumpCapacity: 3600, teams: 5, vehicles: 10, shelterCapacity: 12000 },
    historical: { floodYears: [2005, 2017], avgDepth: 32, maxDepth: 68 },
    microBasins: 134, hotspotCount: 1,
    gaps: ['Sea-facing areas need surge barriers'],
  },
  {
    code: 'S', name: 'Borivali',
    pmrs: 62, risk: 'YELLOW',
    drainage: { score: 48, capacity: 64, blocked: 19, total: 312, lastCleaned: '2024-06' },
    rainfall: { annualAvg: 2312, intensity24h: 148, returnPeriod: 13 },
    terrain: { avgElevation: 13.4, minElevation: 5.8, slope: 1.2, basinArea: 24.6 },
    resources: { pumps: 8, pumpCapacity: 3000, teams: 4, vehicles: 9, shelterCapacity: 11000 },
    historical: { floodYears: [2005, 2017, 2021], avgDepth: 38, maxDepth: 78 },
    microBasins: 223, hotspotCount: 1,
    gaps: ['National park boundary drainage needs attention'],
  },
  {
    code: 'A', name: 'Fort / Colaba',
    pmrs: 72, risk: 'GREEN',
    drainage: { score: 58, capacity: 74, blocked: 12, total: 142, lastCleaned: '2024-07' },
    rainfall: { annualAvg: 1987, intensity24h: 128, returnPeriod: 18 },
    terrain: { avgElevation: 14.2, minElevation: 6.1, slope: 1.3, basinArea: 7.8 },
    resources: { pumps: 8, pumpCapacity: 3200, teams: 4, vehicles: 8, shelterCapacity: 8000 },
    historical: { floodYears: [2005], avgDepth: 22, maxDepth: 48 },
    microBasins: 89, hotspotCount: 0,
    gaps: ['Coastal storm surge monitoring needed'],
  },
];

// ─── Micro-hotspot simulation data ───────────────────────────────────────────
// Lazy-generated on first access to avoid blocking app startup
let _cachedHotspots = null;

export function getMicroHotspots() {
  if (_cachedHotspots) return _cachedHotspots;
  _cachedHotspots = generateMicroHotspots();
  return _cachedHotspots;
}

// Keep export for backward compat but don't run at module load
export const MICRO_HOTSPOTS = null; // use getMicroHotspots() instead

function generateMicroHotspots() {
  const wardSeeds = [
    { code: 'F/S', lat: 19.0045, lng: 72.8425, baseFVI: 0.88, count: 168 },
    { code: 'K/E', lat: 19.115,  lng: 72.858,  baseFVI: 0.82, count: 247 },
    { code: 'L',   lat: 19.072,  lng: 72.877,  baseFVI: 0.80, count: 198 },
    { code: 'P/N', lat: 19.185,  lng: 72.843,  baseFVI: 0.78, count: 289 },
    { code: 'R/C', lat: 19.205,  lng: 72.852,  baseFVI: 0.68, count: 212 },
    { code: 'E',   lat: 18.978,  lng: 72.833,  baseFVI: 0.65, count: 124 },
    { code: 'H/E', lat: 19.065,  lng: 72.838,  baseFVI: 0.66, count: 178 },
    { code: 'N',   lat: 19.087,  lng: 72.907,  baseFVI: 0.64, count: 189 },
    { code: 'G/S', lat: 19.007,  lng: 72.818,  baseFVI: 0.52, count: 112 },
    { code: 'K/W', lat: 19.125,  lng: 72.835,  baseFVI: 0.55, count: 201 },
    { code: 'H/W', lat: 19.058,  lng: 72.827,  baseFVI: 0.38, count: 134 },
    { code: 'S',   lat: 19.229,  lng: 72.856,  baseFVI: 0.44, count: 223 },
    { code: 'A',   lat: 18.922,  lng: 72.833,  baseFVI: 0.28, count: 89  },
  ];

  const hotspots = [];
  let id = 1;

  wardSeeds.forEach(ward => {
    for (let i = 0; i < ward.count; i++) {
      // Deterministic pseudo-random spread using index
      const angle = (i / ward.count) * 2 * Math.PI;
      const radius = 0.005 + (i % 7) * 0.003;
      const lat = ward.lat + radius * Math.sin(angle);
      const lng = ward.lng + radius * Math.cos(angle);

      // FVI varies around base with terrain/drainage factors
      const rainfallFactor = 0.35 + (i % 6) * 0.05;
      const historyFactor = 0.15 + (i % 3) * 0.05;

      const fvi = Math.min(0.99, Math.max(0.1,
        ward.baseFVI * (0.7 + (i % 10) * 0.03) +
        (i % 2 === 0 ? 0.04 : -0.04)
      ));

      const risk = fvi >= 0.85 ? 'RED' : fvi >= 0.65 ? 'ORANGE' : fvi >= 0.45 ? 'YELLOW' : 'GREEN';
      const depth = Math.round(fvi * 140 + (i % 20));
      const elevation = parseFloat((2 + (1 - fvi) * 12 + (i % 5) * 0.4).toFixed(1));
      const drainageCap = Math.round((1 - fvi) * 80 + (i % 10) * 2);

      hotspots.push({
        id: id++,
        ward: ward.code,
        lat: parseFloat(lat.toFixed(5)),
        lng: parseFloat(lng.toFixed(5)),
        fvi: parseFloat(fvi.toFixed(2)),
        risk,
        depth,
        elevation,
        drainageCapacity: drainageCap,
        rainfallIntensity: Math.round(rainfallFactor * 200),
        floodHistory: Math.round(historyFactor * 20),
        basinArea: parseFloat((0.05 + (i % 8) * 0.02).toFixed(2)),
        type: i % 5 === 0 ? 'subway' : i % 4 === 0 ? 'nala' : i % 3 === 0 ? 'lowland' : i % 2 === 0 ? 'road' : 'residential',
      });
    }
  });

  return hotspots;
}

// ─── FVI Engine ───────────────────────────────────────────────────────────────
export function computeFVI({ rainfallIntensity, drainageCapacity, elevation, floodHistory }) {
  const MAX_RAIN = 200, MAX_DRAIN = 80, MAX_ELEV = 15, MAX_HIST = 20;
  return parseFloat((
    0.35 * (rainfallIntensity / MAX_RAIN) +
    0.30 * (1 - Math.min(drainageCapacity, MAX_DRAIN) / MAX_DRAIN) +
    0.20 * (1 - Math.min(elevation, MAX_ELEV) / MAX_ELEV) +
    0.15 * (Math.min(floodHistory, MAX_HIST) / MAX_HIST)
  ).toFixed(2));
}

// ─── PMRS Engine ─────────────────────────────────────────────────────────────
export function computePMRS(wardDetail) {
  const d = wardDetail;
  const drainageScore   = (d.drainage.score / 100) * 30;
  const rainfallScore   = Math.max(0, (1 - d.rainfall.intensity24h / 200)) * 25;
  const resourceScore   = Math.min(d.resources.pumps / 10, 1) * 20;
  const terrainScore    = Math.min(d.terrain.avgElevation / 15, 1) * 15;
  const historicalScore = Math.max(0, 1 - d.historical.floodYears.length / 10) * 10;
  return Math.round(drainageScore + rainfallScore + resourceScore + terrainScore + historicalScore);
}

// ─── Resource deployment recommendations ─────────────────────────────────────
export function getDeploymentPlan(wardDetail) {
  const pmrs = wardDetail.pmrs;
  const blockedPct = Math.round((wardDetail.drainage.blocked / wardDetail.drainage.total) * 100);

  const actions = [];

  if (blockedPct > 50) actions.push({ priority: 'CRITICAL', action: `Deploy drain-cleaning teams — ${blockedPct}% drains blocked`, icon: '🚧', eta: '24h' });
  if (wardDetail.resources.pumps < 6) actions.push({ priority: 'HIGH', action: `Deploy ${6 - wardDetail.resources.pumps} additional pump sets`, icon: '💧', eta: '48h' });
  if (wardDetail.historical.floodYears.length >= 5) actions.push({ priority: 'HIGH', action: 'Pre-position NDRF team at ward boundary', icon: '⛑️', eta: '12h' });
  if (pmrs < 35) actions.push({ priority: 'CRITICAL', action: 'Issue Orange/Red alert — activate emergency protocol', icon: '🔴', eta: 'Immediate' });
  if (wardDetail.terrain.minElevation < 3) actions.push({ priority: 'HIGH', action: 'Evacuate low-elevation zones below 3m', icon: '🏃', eta: '6h' });
  if (wardDetail.resources.shelterCapacity < wardDetail.resources.pumps * 1000) actions.push({ priority: 'MEDIUM', action: 'Open additional relief shelters', icon: '🏟️', eta: '24h' });

  actions.push({ priority: 'MEDIUM', action: 'Broadcast ward-level flood alert via JalPravah', icon: '📢', eta: '1h' });

  return actions;
}

// ─── City-wide summary stats ──────────────────────────────────────────────────
export const CITY_STATS = {
  totalMicroBasins: 2364,
  criticalHotspots: 487,
  orangeHotspots: 612,
  yellowHotspots: 743,
  greenBasins: 522,
  avgCityPMRS: 47,
  drainsBlocked: 4821,
  totalDrains: 12400,
  pumpsDeployed: 78,
  pumpsRequired: 142,
  lastUpdated: 'Mar 25, 2026 · 09:30 AM',
  rainfallForecast72h: 185,
  activeShelters: 24,
  totalShelterCapacity: 87000,
};
