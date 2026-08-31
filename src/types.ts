export interface LicenseKey {
  id: string;
  key: string;
  userLabel: string;
  durationHours: number;
  createdAt: string;
  expiresAt: string;
  maxDevices: number;
  activeDevices: number;
  status: 'active' | 'expired' | 'frozen' | 'suspended';
  patchAccess: string[];
  allowedIps: string[];
  notes?: string;
  hwid?: string;
}

export interface ProxyPort {
  port: number;
  protocol: string;
  status: 'active' | 'blocked' | 'idle' | 'warning';
  connections: number;
  bandwidthMb: number;
  sslEnabled: boolean;
  description: string;
}

export interface ModSafetyConfig {
  safetyLevel: 'SAFE' | 'CAUTION' | 'HIGH_RISK';
  globalFreeze: boolean;
  antiBanActive: boolean;
  memoryPatchProtection: boolean;
  proxyEncryption: boolean;
  heartbeatMs: number;
  lastUpdate: string;
  activeMitigation: string;
}

export interface GamePatch {
  id: string;
  name: string;
  folderName: string;
  type: string;
  filename: string;
  patchSize: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  description: string;
  downloadUrl?: string;
  instructions: string;
  activeUsers: number;
}

export interface SystemLog {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'success';
  source: 'proxy' | 'bot' | 'auth' | 'safety' | 'kernel';
  message: string;
}

export interface AllowedIP {
  id: string;
  ip: string;
  addedAt: string;
  notes: string;
  active: boolean;
}

export interface ServerStats {
  uptimeSeconds: number;
  cpuUsage: number;
  ramUsageMb: number;
  totalRequests: number;
  blockedAttempts: number;
  activeSockets: number;
}

export interface ServerMasterFile {
  id: string;
  filename: string;
  category: 'Patches' | 'Certs' | 'Configs' | 'Scripts';
  serverPath: string;
  patchSize: string;
  version: string;
  checksum: string;
  description: string;
  required?: boolean;
}

export interface RuntimeFileEntry {
  fileId: string;
  filename: string;
  category: string;
  serverPath: string;
  localPath: string;
  patchSize: string;
  checksum: string;
}

export interface RuntimeManifest {
  runtimeId: string;
  userId: string;
  userLabel: string;
  packageName: string;
  version: string;
  status: 'active' | 'inactive' | 'syncing' | 'corrupted';
  syncStatus: 'synced' | 'outdated' | 'update_available';
  files: RuntimeFileEntry[];
  createdAt: string;
  updatedAt: string;
  isolatedEndpointUrl: string;
}

export interface RuntimeControlActionRequest {
  runtimeId: string;
  userId: string;
  action: 'activate' | 'deactivate' | 'sync' | 'restart' | 'remove';
}
