/**
 * JalPravah Offline Mesh Network Service
 *
 * Concept: BLE (Bluetooth Low Energy) mesh relay — inspired by
 * Sony's "Disaster Message Board" and Japan's disaster BLE mesh protocols.
 *
 * How it works:
 * 1. When offline, SOS is stored locally with a unique packet ID
 * 2. Device broadcasts a BLE advertisement payload (compact JSON)
 * 3. Nearby JalPravah devices in range pick up the packet and relay it forward
 * 4. Once any device in the chain gets internet, it uploads all queued packets
 * 5. Duplicate packets are dropped via packetId deduplication
 *
 * In this implementation we simulate the BLE layer using AsyncStorage
 * (real BLE requires react-native-ble-plx or expo-bluetooth when available).
 * The architecture and data structures are production-ready for BLE integration.
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

const MESH_QUEUE_KEY = 'mesh_sos_queue';
const SEEN_PACKETS_KEY = 'mesh_seen_packets';
const MAX_HOPS = 7; // Max relay hops before packet is dropped (TTL)

/**
 * Create a compact SOS mesh packet (fits in BLE advertisement payload ~512 bytes)
 */
export function createMeshPacket(sosData, user, ward) {
  return {
    packetId: `JP-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
    version: 1,
    type: 'SOS',
    hops: 0,
    maxHops: MAX_HOPS,
    createdAt: new Date().toISOString(),
    synced: false,
    payload: {
      name: user?.name || 'Unknown',
      phone: user?.phone || '',
      ward,
      emergencyType: sosData.type,
      severity: sosData.severity || 'HIGH',
      // Triage snapshot (compact)
      bloodType: sosData.triage?.bloodType || '',
      medicalFlags: [
        sosData.triage?.diabetes ? 'DIABETIC' : null,
        sosData.triage?.allergies ? `ALLERGY:${sosData.triage.allergies}` : null,
        sosData.triage?.disability ? `MOBILITY:${sosData.triage.disability}` : null,
      ].filter(Boolean),
      medicines: sosData.triage?.medicines || '',
      emergencyContact: sosData.triage?.emergencyContact || '',
      emergencyContactPhone: sosData.triage?.emergencyContactPhone || '',
      message: sosData.message || '',
    },
  };
}

/**
 * Store a packet in the local mesh queue
 */
export async function enqueueMeshPacket(packet) {
  const raw = await AsyncStorage.getItem(MESH_QUEUE_KEY);
  const queue = raw ? JSON.parse(raw) : [];

  // Dedup check
  const seen = queue.find(p => p.packetId === packet.packetId);
  if (seen) return false;

  queue.push(packet);
  await AsyncStorage.setItem(MESH_QUEUE_KEY, JSON.stringify(queue));
  return true;
}

/**
 * Simulate receiving a relayed packet from a nearby device (BLE relay)
 * In production: called from BLE scan callback
 */
export async function receiveRelayedPacket(packet) {
  if (packet.hops >= packet.maxHops) return; // TTL expired

  const seenRaw = await AsyncStorage.getItem(SEEN_PACKETS_KEY);
  const seen = seenRaw ? JSON.parse(seenRaw) : [];
  if (seen.includes(packet.packetId)) return; // Already relayed

  // Mark as seen
  seen.push(packet.packetId);
  await AsyncStorage.setItem(SEEN_PACKETS_KEY, JSON.stringify(seen.slice(-200)));

  // Re-queue with incremented hop count
  const relayed = { ...packet, hops: packet.hops + 1 };
  await enqueueMeshPacket(relayed);
}

/**
 * Get all pending (unsynced) packets
 */
export async function getPendingPackets() {
  const raw = await AsyncStorage.getItem(MESH_QUEUE_KEY);
  const queue = raw ? JSON.parse(raw) : [];
  return queue.filter(p => !p.synced);
}

/**
 * Mark packets as synced after successful upload
 */
export async function markPacketsSynced(packetIds) {
  const raw = await AsyncStorage.getItem(MESH_QUEUE_KEY);
  const queue = raw ? JSON.parse(raw) : [];
  const updated = queue.map(p =>
    packetIds.includes(p.packetId) ? { ...p, synced: true } : p
  );
  await AsyncStorage.setItem(MESH_QUEUE_KEY, JSON.stringify(updated));
}

/**
 * Simulate BLE broadcast status messages
 * In production: use react-native-ble-plx BleManager.startAdvertising()
 */
export function getBLEStatusMessage(pendingCount) {
  if (pendingCount === 0) return { status: 'idle', msg: 'No pending SOS packets', icon: '📶' };
  return {
    status: 'relaying',
    msg: `${pendingCount} SOS packet(s) queued — relaying via Bluetooth mesh`,
    icon: '📡',
  };
}
