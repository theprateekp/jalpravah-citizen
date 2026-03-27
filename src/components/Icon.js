import { MaterialCommunityIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';

// Unified icon component — maps semantic names to real vector icons
export default function Icon({ name, size = 24, color = '#1A1A2E', style }) {
  const MAP = {
    // Navigation
    home:        { lib: 'mci', icon: 'home' },
    map:         { lib: 'mci', icon: 'map-marker-radius' },
    sos:         { lib: 'mci', icon: 'alarm-light' },
    report:      { lib: 'mci', icon: 'clipboard-text' },
    alerts:      { lib: 'mci', icon: 'bell' },
    profile:     { lib: 'mci', icon: 'account-circle' },
    // SOS types
    trapped:     { lib: 'mci', icon: 'water-alert' },
    medical:     { lib: 'mci', icon: 'ambulance' },
    evacuation:  { lib: 'mci', icon: 'run-fast' },
    food:        { lib: 'mci', icon: 'food-apple' },
    electricity: { lib: 'mci', icon: 'lightning-bolt' },
    rescue:      { lib: 'mci', icon: 'lifebuoy' },
    // Features
    flood:       { lib: 'mci', icon: 'waves' },
    drain:       { lib: 'mci', icon: 'pipe' },
    weather:     { lib: 'mci', icon: 'weather-pouring' },
    voice:       { lib: 'mci', icon: 'robot' },
    triage:      { lib: 'mci', icon: 'hospital-box' },
    bluetooth:   { lib: 'mci', icon: 'bluetooth' },
    offline:     { lib: 'mci', icon: 'wifi-off' },
    online:      { lib: 'mci', icon: 'wifi' },
    location:    { lib: 'mci', icon: 'crosshairs-gps' },
    phone:       { lib: 'mci', icon: 'phone' },
    shelter:     { lib: 'mci', icon: 'home-group' },
    hospital:    { lib: 'mci', icon: 'hospital-building' },
    camp:        { lib: 'mci', icon: 'tent' },
    warning:     { lib: 'mci', icon: 'alert' },
    check:       { lib: 'mci', icon: 'check-circle' },
    arrow:       { lib: 'mci', icon: 'chevron-right' },
    back:        { lib: 'mci', icon: 'chevron-left' },
    info:        { lib: 'mci', icon: 'information' },
    blood:       { lib: 'mci', icon: 'water' },
    pill:        { lib: 'mci', icon: 'pill' },
    allergy:     { lib: 'mci', icon: 'alert-circle' },
    wheelchair:  { lib: 'mci', icon: 'wheelchair-accessibility' },
    contact:     { lib: 'mci', icon: 'account-heart' },
    fire:        { lib: 'mci', icon: 'fire-truck' },
    police:      { lib: 'mci', icon: 'police-badge' },
    ndrf:        { lib: 'mci', icon: 'shield-star' },
    water:       { lib: 'mci', icon: 'water-pump' },
    power:       { lib: 'mci', icon: 'transmission-tower' },
    tree:        { lib: 'mci', icon: 'tree' },
    road:        { lib: 'mci', icon: 'road' },
    send:        { lib: 'mci', icon: 'send' },
    camera:      { lib: 'mci', icon: 'camera' },
    mesh:        { lib: 'mci', icon: 'access-point-network' },
    hotspot:     { lib: 'mci', icon: 'map-marker-alert' },
    pmrs:        { lib: 'mci', icon: 'gauge' },
    forecast:    { lib: 'mci', icon: 'weather-lightning-rainy' },
    logout:      { lib: 'mci', icon: 'logout' },
    settings:    { lib: 'mci', icon: 'cog' },
    language:    { lib: 'mci', icon: 'translate' },
    notification:{ lib: 'mci', icon: 'bell-ring' },
  };

  const entry = MAP[name] || { lib: 'mci', icon: 'help-circle' };
  return <MaterialCommunityIcons name={entry.icon} size={size} color={color} style={style} />;
}
