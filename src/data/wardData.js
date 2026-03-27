// JalPravah — Ward & Flood Data (Mumbai + Delhi)

export const WARDS = [
  { id: 1, name: 'Hindmata / Parel', code: 'F/S', zone: 'Central', lat: 19.0045, lng: 72.8425, pmrs: 28, risk: 'RED', pop: 387623, hotspots: 12 },
  { id: 2, name: 'Andheri East', code: 'K/E', zone: 'Western', lat: 19.115, lng: 72.858, pmrs: 35, risk: 'RED', pop: 893421, hotspots: 8 },
  { id: 3, name: 'Kurla', code: 'L', zone: 'Eastern', lat: 19.072, lng: 72.877, pmrs: 33, risk: 'RED', pop: 876543, hotspots: 6 },
  { id: 4, name: 'Malad East', code: 'P/N', zone: 'Western', lat: 19.185, lng: 72.843, pmrs: 29, risk: 'RED', pop: 1023456, hotspots: 5 },
  { id: 5, name: 'Kandivali', code: 'R/C', zone: 'Western', lat: 19.205, lng: 72.852, pmrs: 39, risk: 'ORANGE', pop: 876521, hotspots: 4 },
  { id: 6, name: 'Byculla', code: 'E', zone: 'Central', lat: 18.978, lng: 72.833, pmrs: 42, risk: 'ORANGE', pop: 432178, hotspots: 3 },
  { id: 7, name: 'Khar / Santacruz', code: 'H/E', zone: 'Western', lat: 19.065, lng: 72.838, pmrs: 44, risk: 'ORANGE', pop: 623487, hotspots: 3 },
  { id: 8, name: 'Ghatkopar', code: 'N', zone: 'Eastern', lat: 19.087, lng: 72.907, pmrs: 41, risk: 'ORANGE', pop: 812345, hotspots: 4 },
  { id: 9, name: 'Dahisar', code: 'R/S', zone: 'Western', lat: 19.245, lng: 72.862, pmrs: 45, risk: 'ORANGE', pop: 723456, hotspots: 2 },
  { id: 10, name: 'Chembur', code: 'M/E', zone: 'Eastern', lat: 19.057, lng: 72.898, pmrs: 47, risk: 'ORANGE', pop: 687234, hotspots: 2 },
  { id: 11, name: 'Worli', code: 'G/S', zone: 'Central', lat: 19.007, lng: 72.818, pmrs: 52, risk: 'YELLOW', pop: 410352, hotspots: 2 },
  { id: 12, name: 'Andheri West', code: 'K/W', zone: 'Western', lat: 19.125, lng: 72.835, pmrs: 58, risk: 'YELLOW', pop: 745832, hotspots: 2 },
  { id: 13, name: 'Bandra West', code: 'H/W', zone: 'Western', lat: 19.058, lng: 72.827, pmrs: 71, risk: 'GREEN', pop: 485213, hotspots: 1 },
  { id: 14, name: 'Borivali', code: 'S', zone: 'Western', lat: 19.229, lng: 72.856, pmrs: 62, risk: 'YELLOW', pop: 1234567, hotspots: 1 },
  { id: 15, name: 'Fort / Colaba', code: 'A', zone: 'South', lat: 18.922, lng: 72.833, pmrs: 72, risk: 'GREEN', pop: 182403, hotspots: 0 },
];

export const HOTSPOTS = [
  { id: 1, name: 'Hindmata Junction', ward: 'F/S', lat: 19.0045, lng: 72.8425, fvi: 0.94, risk: 'RED', depth: 120, history: 18, pop: 45000 },
  { id: 2, name: 'Milan Subway', ward: 'K/W', lat: 19.1212, lng: 72.8401, fvi: 0.91, risk: 'RED', depth: 95, history: 15, pop: 32000 },
  { id: 3, name: 'Sion-King Circle', ward: 'F/N', lat: 19.0421, lng: 72.8623, fvi: 0.89, risk: 'RED', depth: 110, history: 16, pop: 38000 },
  { id: 4, name: 'Andheri Subway', ward: 'K/E', lat: 19.1195, lng: 72.8467, fvi: 0.86, risk: 'RED', depth: 95, history: 17, pop: 52000 },
  { id: 5, name: 'Vakola Nala', ward: 'H/E', lat: 19.072, lng: 72.848, fvi: 0.78, risk: 'ORANGE', depth: 75, history: 12, pop: 28000 },
  { id: 6, name: 'Kurla LTT Road', ward: 'L', lat: 19.073, lng: 72.880, fvi: 0.75, risk: 'ORANGE', depth: 80, history: 10, pop: 35000 },
  { id: 7, name: 'Poisar Nala', ward: 'P/N', lat: 19.188, lng: 72.849, fvi: 0.72, risk: 'ORANGE', depth: 65, history: 9, pop: 22000 },
  { id: 8, name: 'Ghatkopar Station', ward: 'N', lat: 19.086, lng: 72.909, fvi: 0.68, risk: 'ORANGE', depth: 60, history: 8, pop: 41000 },
];

export const SAFE_SPOTS = [
  { id: 1, name: 'Shivaji Park Ground', type: 'shelter', ward: 'G/N', lat: 19.028, lng: 72.843, capacity: 5000, distance: 1.2, accessible: true, status: 'OPEN' },
  { id: 2, name: 'BKC Convention Centre', type: 'shelter', ward: 'H/E', lat: 19.065, lng: 72.865, capacity: 8000, distance: 2.1, accessible: true, status: 'OPEN' },
  { id: 3, name: 'KEM Hospital', type: 'hospital', ward: 'F/S', lat: 18.998, lng: 72.840, capacity: 1800, distance: 0.8, accessible: true, status: 'OPEN' },
  { id: 4, name: 'Sion Hospital', type: 'hospital', ward: 'F/N', lat: 19.042, lng: 72.862, capacity: 1200, distance: 1.5, accessible: true, status: 'OPEN' },
  { id: 5, name: 'Andheri Sports Complex', type: 'shelter', ward: 'K/E', lat: 19.118, lng: 72.848, capacity: 3000, distance: 0.5, accessible: true, status: 'OPEN' },
  { id: 6, name: 'Malad Relief Camp', type: 'camp', ward: 'P/N', lat: 19.186, lng: 72.848, capacity: 2000, distance: 1.8, accessible: false, status: 'OPEN' },
  { id: 7, name: 'Borivali National Park Gate', type: 'shelter', ward: 'S', lat: 19.228, lng: 72.858, capacity: 4000, distance: 3.2, accessible: true, status: 'OPEN' },
  { id: 8, name: 'Kurla Community Hall', type: 'shelter', ward: 'L', lat: 19.074, lng: 72.879, capacity: 1500, distance: 0.3, accessible: true, status: 'PARTIAL' },
];

export const HELPLINES = [
  { dept: 'MCGM Control Room', number: '1916', icon: '🏛️', color: '#4A90E2', available: true },
  { dept: 'Police Emergency', number: '100', icon: '👮', color: '#1A1A2E', available: true },
  { dept: 'Fire Brigade', number: '101', icon: '🚒', color: '#FF3B5C', available: true },
  { dept: 'Ambulance', number: '108', icon: '🚑', color: '#00C9A7', available: true },
  { dept: 'NDRF Helpline', number: '011-24363260', icon: '⛑️', color: '#FF6B35', available: true },
  { dept: 'Disaster Management', number: '1070', icon: '🆘', color: '#6C63FF', available: true },
  { dept: 'Electricity (BEST)', number: '1912', icon: '⚡', color: '#FFB800', available: true },
  { dept: 'Water Supply', number: '1800-22-1234', icon: '💧', color: '#00C9A7', available: true },
];

export const FORECAST_7DAY = [
  { day: 'Today', emoji: '⛈️', high: 31, low: 26, rain: 85, desc: 'Heavy Rain' },
  { day: 'Tue', emoji: '🌧️', high: 30, low: 25, rain: 70, desc: 'Rain' },
  { day: 'Wed', emoji: '🌦️', high: 32, low: 26, rain: 45, desc: 'Showers' },
  { day: 'Thu', emoji: '⛅', high: 33, low: 27, rain: 20, desc: 'Partly Cloudy' },
  { day: 'Fri', emoji: '🌧️', high: 30, low: 25, rain: 65, desc: 'Rain' },
  { day: 'Sat', emoji: '⛈️', high: 29, low: 24, rain: 90, desc: 'Thunderstorm' },
  { day: 'Sun', emoji: '🌦️', high: 31, low: 26, rain: 50, desc: 'Showers' },
];
