import { LicenseKey, ProxyPort, ModSafetyConfig, GamePatch, AllowedIP, SystemLog } from '../types';

export const INITIAL_LICENSE_KEYS: LicenseKey[] = [
  {
    id: 'key-01',
    key: 'NISHU-VIP-8899',
    userLabel: 'Nishu Master Key (VIP)',
    durationHours: 8760, // 1 year
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    expiresAt: new Date(Date.now() + 3600000 * 8700).toISOString(),
    maxDevices: 10,
    activeDevices: 3,
    status: 'active',
    patchAccess: ['Antenna hand', 'Body 90%', 'Drag only', 'Magic Bullet'],
    allowedIps: ['103.21.244.1', '185.220.101.5'],
    notes: 'Primary Master License (Password Access)',
    hwid: 'HWID-NISHU-8899-X7'
  },
  {
    id: 'key-02',
    key: 'SOYAB-PRO-2026',
    userLabel: 'Soyab Proxy Owner',
    durationHours: 4380,
    createdAt: new Date(Date.now() - 3600000 * 240).toISOString(),
    expiresAt: new Date(Date.now() + 3600000 * 4000).toISOString(),
    maxDevices: 5,
    activeDevices: 2,
    status: 'active',
    patchAccess: ['Magic Bullet', 'Drag with Antenna'],
    allowedIps: ['45.112.89.44'],
    notes: 'Owner Panel Testing Key',
    hwid: 'HWID-SOYAB-PRO-99'
  },
  {
    id: 'key-03',
    key: 'MAGIC-BULLET-KEY-77',
    userLabel: 'Reseller_Alpha_01',
    durationHours: 720,
    createdAt: new Date(Date.now() - 3600000 * 120).toISOString(),
    expiresAt: new Date(Date.now() + 3600000 * 600).toISOString(),
    maxDevices: 2,
    activeDevices: 2,
    status: 'active',
    patchAccess: ['Magic Bullet', 'Body 90%'],
    allowedIps: ['*'],
    notes: 'Reseller key batch #1',
    hwid: 'HWID-9912-BB01'
  },
  {
    id: 'key-04',
    key: 'ANTENNA-HAND-88',
    userLabel: 'Gamer_Nishu_Client',
    durationHours: 168,
    createdAt: new Date(Date.now() - 3600000 * 100).toISOString(),
    expiresAt: new Date(Date.now() + 3600000 * 68).toISOString(),
    maxDevices: 1,
    activeDevices: 1,
    status: 'active',
    patchAccess: ['Antenna hand'],
    allowedIps: [],
    notes: 'Weekly trial key',
    hwid: 'HWID-MOB-ANT-003'
  },
  {
    id: 'key-05',
    key: 'BODY-90-ULTRA-33',
    userLabel: 'Test_Device_Banned_Demo',
    durationHours: 24,
    createdAt: new Date(Date.now() - 3600000 * 30).toISOString(),
    expiresAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    maxDevices: 1,
    activeDevices: 0,
    status: 'expired',
    patchAccess: ['Body 90%'],
    allowedIps: [],
    notes: 'Trial expired',
    hwid: 'HWID-EXP-0091'
  },
  {
    id: 'key-06',
    key: 'EMERGENCY-FREEZE-DEMO',
    userLabel: 'Frozen_Safety_Check',
    durationHours: 720,
    createdAt: new Date(Date.now() - 3600000 * 50).toISOString(),
    expiresAt: new Date(Date.now() + 3600000 * 670).toISOString(),
    maxDevices: 3,
    activeDevices: 0,
    status: 'frozen',
    patchAccess: ['Magic Bullet'],
    allowedIps: [],
    notes: 'Temporarily suspended during game anti-ban update',
    hwid: 'HWID-FRZ-3341'
  }
];

export const INITIAL_PORTS: ProxyPort[] = [
  {
    port: 8080,
    protocol: 'HTTP/MITM',
    status: 'active',
    connections: 42,
    bandwidthMb: 1284.5,
    sslEnabled: true,
    description: 'Main Game Traffic Interceptor & Packet Mod'
  },
  {
    port: 8081,
    protocol: 'HTTPS/TLS',
    status: 'active',
    connections: 18,
    bandwidthMb: 642.1,
    sslEnabled: true,
    description: 'NitroXMitm Certificate Secure Proxy Route'
  },
  {
    port: 8888,
    protocol: 'TCP/RAW',
    status: 'active',
    connections: 87,
    bandwidthMb: 3109.8,
    sslEnabled: false,
    description: 'Magic Bullet & Antenna Real-Time Sync Port'
  },
  {
    port: 9090,
    protocol: 'REST/AUTH',
    status: 'active',
    connections: 15,
    bandwidthMb: 89.4,
    sslEnabled: true,
    description: 'License Key Validation & HWID Lock Server'
  },
  {
    port: 7777,
    protocol: 'UDP/STREAM',
    status: 'idle',
    connections: 0,
    bandwidthMb: 0,
    sslEnabled: false,
    description: 'Backup Emergency Tunnel'
  }
];

export const INITIAL_MOD_SAFETY: ModSafetyConfig = {
  safetyLevel: 'SAFE',
  globalFreeze: false,
  antiBanActive: true,
  memoryPatchProtection: true,
  proxyEncryption: true,
  heartbeatMs: 2500,
  lastUpdate: new Date().toISOString(),
  activeMitigation: 'AES-256 Dynamic Header Encryption & Signature Bypasser Active'
};

export const INITIAL_GAME_PATCHES: GamePatch[] = [
  {
    id: 'patch-01',
    name: 'Magic Bullet',
    folderName: 'Magic Bullet',
    type: 'Cache Binary Resource',
    filename: 'cache_res.CfnFf59sr1SbsqQ6JqTKsEusjKs~3D',
    patchSize: '248 KB',
    riskLevel: 'LOW',
    description: 'High-precision bullet vector calculation interceptor. Automatically redirects bullet trajectory towards enemy hitboxes through MITM proxy packet rewriting.',
    instructions: '1. Install NitroXMitm.crt CA Certificate on your device.\n2. Connect device Wi-Fi proxy to SOYAB-PROXY Port 8080.\n3. Activate Magic Bullet patch in proxy panel.\n4. Launch game. Cache resource will auto-inject.',
    activeUsers: 142
  },
  {
    id: 'patch-02',
    name: 'Antenna Hand',
    folderName: 'Antenna hand',
    type: 'Asset Tracking Mesh',
    filename: 'cache_res.CfnFf59sr1SbsqQ6JqTKsEusjKs~3D',
    patchSize: '184 KB',
    riskLevel: 'LOW',
    description: 'Extends player hand bone structure in memory stream to render high-visibility vertical beacon tracking lines up to 500m distance.',
    instructions: '1. Load Antenna Hand patch into proxy memory buffer.\n2. Ensure Port 8888 TCP sync is open.\n3. Check MiniApp status to verify player skeletal sync.',
    activeUsers: 98
  },
  {
    id: 'patch-03',
    name: 'Body 90%',
    folderName: 'Body 90%',
    type: 'Hitbox Expander',
    filename: 'cache_res.CfnFf59sr1SbsqQ6JqTKsEusjKs~3D',
    patchSize: '210 KB',
    riskLevel: 'MEDIUM',
    description: 'Expands character hit collision box by 90% for higher bullet contact rate. Includes memory shield to bypass server-side hitbox verification.',
    instructions: '1. Enable Memory Patch Protection in MOD Safety panel.\n2. Inject Body 90% patch.\n3. Verify response status in test logs.',
    activeUsers: 76
  },
  {
    id: 'patch-04',
    name: 'Drag Only',
    folderName: 'Drag only',
    type: 'Recoil Stabilizer',
    filename: 'cache_res.CfnFf59sr1SbsqQ6JqTKsEusjKs~3D',
    patchSize: '156 KB',
    riskLevel: 'LOW',
    description: 'Smoothes screen camera drag vector inputs during weapon firing sequence, eliminating vertical jump.',
    instructions: '1. Set drag sensitivity multiplier to 1.0 in proxy config.\n2. Proxy auto-stabilizes fire packets.',
    activeUsers: 115
  },
  {
    id: 'patch-05',
    name: 'Drag with Antenna',
    folderName: 'DragwithAntenna',
    type: 'Combo Mod Pack',
    filename: 'cache_res.CfnFf59sr1SbsqQ6JqTKsEusjKs~3D',
    patchSize: '312 KB',
    riskLevel: 'LOW',
    description: 'Combined performance patch featuring both Recoil Stabilizer and Player Antenna Tracking in a single optimized package.',
    instructions: '1. Select Drag with Antenna combo.\n2. Ensure both Port 8080 and 8888 are active.',
    activeUsers: 189
  }
];

export const INITIAL_ALLOWED_IPS: AllowedIP[] = [
  { id: 'ip-1', ip: '103.21.244.1', addedAt: '2026-08-20 14:22:00', notes: 'VIP Client Dedicated IP', active: true },
  { id: 'ip-2', ip: '45.112.89.44', addedAt: '2026-08-22 09:15:30', notes: 'Soyab Admin VPS Gateway', active: true },
  { id: 'ip-3', ip: '185.220.101.5', addedAt: '2026-08-25 18:04:12', notes: 'Nishu Master Node', active: true }
];

export const INITIAL_LOGS: SystemLog[] = [
  { id: 'log-1', timestamp: new Date(Date.now() - 3600000 * 2).toLocaleTimeString(), level: 'info', source: 'proxy', message: 'SOYAB-PROXY core daemon listening on ports 8080, 8081, 8888, 9090' },
  { id: 'log-2', timestamp: new Date(Date.now() - 3600000 * 1.5).toLocaleTimeString(), level: 'success', source: 'auth', message: 'Master Key NISHU-VIP-8899 authenticated successfully from HWID-NISHU-8899-X7' },
  { id: 'log-3', timestamp: new Date(Date.now() - 3600000 * 1).toLocaleTimeString(), level: 'info', source: 'safety', message: 'MOD Safety Check: SAFE level confirmed. AES-256 header encryption operational.' },
  { id: 'log-4', timestamp: new Date(Date.now() - 3600000 * 0.5).toLocaleTimeString(), level: 'success', source: 'bot', message: 'Telegram Key Manager Bot v2 initialized and synced with license_keys.json' },
  { id: 'log-5', timestamp: new Date(Date.now() - 60000 * 5).toLocaleTimeString(), level: 'info', source: 'kernel', message: 'NitroXMitm.crt SSL certificate loaded and ready for client download' }
];

export const CERTIFICATE_INFO = {
  name: 'NitroXMitm.crt',
  issuer: 'SOYAB-PROXY Root CA Security Authority',
  algorithm: 'RSA 4096-bit (SHA-256)',
  validity: '2025-01-01 to 2035-01-01',
  fingerprint: '4F:8A:2C:9E:11:77:DB:40:9A:88:FE:33:01:BC:90:55',
  pemContent: `-----BEGIN CERTIFICATE-----
MIIFdTCCBF2gAwIBAgIUa3V19sKwNISHUSOYAB8899MA0GCSqGSIb3DQEBCwUAMIGM
MQswCQYDVQQGEwJJTjELMAkGA1UECBMCUFAxDDAKBgNVBAcTA0RFTDENMAsGA1UE
ChMEU09ZQUIxDDAKBgNVBAsTA01PRE0xFjAUBgNVBAMTDU5pdHJvWE1pdG0gQ0Ex
IDAeBgkqhkiG9w0BCQEWEWFkbWluQHNveWFicHJveHkuaW8wHhcNMjUwMTAxMDAw
MDAwWhcNMzUwMTAxMDAwMDAwWjCBjDELMAkGA1UEBhMCSU4xCzAJBgNVBAgTAlBQ
MQwwCgYDVQQHEwNERUwxDTALBgNVBAoTBFNPWUFCMQwwCgYDVQQLEwNNT0RNMRYw
FAYDVQQDEw1OaXRyb1hNaXRtIENBMSAwHgYJKoZIhvcNAQkBFhFhZG1pbkBzb3lh
YnByb3h5LmlvMIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAz98X04nN
ISHUNISHUSOYAB8899KkLw+2mR7y... [SOYAB-PROXY ROOT CERTIFICATE]
-----END CERTIFICATE-----`
};
