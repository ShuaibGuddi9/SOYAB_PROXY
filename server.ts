import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
let ai: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });
}

// In-Memory Database State (mirroring SOYAB-PROXY json files)
let licenseKeys = [
  {
    id: 'key-01',
    key: 'NISHU-VIP-8899',
    userLabel: 'Nishu Master Key (VIP)',
    durationHours: 8760,
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    expiresAt: new Date(Date.now() + 3600000 * 8700).toISOString(),
    maxDevices: 10,
    activeDevices: 3,
    status: 'active',
    patchAccess: ['Antenna hand', 'Body 90%', 'Drag only', 'Magic Bullet'],
    allowedIps: ['103.21.244.1', '185.220.101.5'],
    notes: 'Primary Master License (Password Access: NISHU)',
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
  }
];

let proxyPorts = [
  { port: 8080, protocol: 'HTTP/MITM', status: 'active', connections: 42, bandwidthMb: 1284.5, sslEnabled: true, description: 'Main Game Traffic Interceptor' },
  { port: 8081, protocol: 'HTTPS/TLS', status: 'active', connections: 18, bandwidthMb: 642.1, sslEnabled: true, description: 'NitroXMitm Certificate Proxy' },
  { port: 8888, protocol: 'TCP/RAW', status: 'active', connections: 87, bandwidthMb: 3109.8, sslEnabled: false, description: 'Magic Bullet & Antenna Sync' },
  { port: 9090, protocol: 'REST/AUTH', status: 'active', connections: 15, bandwidthMb: 89.4, sslEnabled: true, description: 'License Key HWID Validator' }
];

let modSafety = {
  safetyLevel: 'SAFE',
  globalFreeze: false,
  antiBanActive: true,
  memoryPatchProtection: true,
  proxyEncryption: true,
  heartbeatMs: 2500,
  lastUpdate: new Date().toISOString(),
  activeMitigation: 'AES-256 Dynamic Header Encryption & Signature Bypasser Active'
};

let allowedIps = [
  { id: 'ip-1', ip: '103.21.244.1', addedAt: '2026-08-20 14:22:00', notes: 'VIP Client Dedicated IP', active: true },
  { id: 'ip-2', ip: '45.112.89.44', addedAt: '2026-08-22 09:15:30', notes: 'Soyab Admin VPS Gateway', active: true },
  { id: 'ip-3', ip: '185.220.101.5', addedAt: '2026-08-25 18:04:12', notes: 'Nishu Master Node', active: true }
];

// In-Memory Proxy Version & File Control State
let proxyVersionConfig = {
  verAddr: "https://version.astutech.online/",
  resetGuest: true,
  minVersion: "3.5.0",
  cdnHost: "https://cdn.astutech.online/",
  bypassAntiCheat: true,
  status: "OPERATIONAL",
  lastUpdated: new Date().toISOString()
};

// Master Server Files Repository (Stored on server as master source)
let serverMasterFiles = [
  {
    id: 'master-01',
    filename: 'cache_res_v3.5.0~3D',
    category: 'Patches',
    serverPath: '/master_files/patches/cache_res_v3.5.0~3D',
    patchSize: '42.8 MB',
    version: '3.5.0',
    checksum: 'sha256:8f91a2bc0019fa82',
    description: 'Magic Bullet Binary Interceptor Payload'
  },
  {
    id: 'master-02',
    filename: 'cache_res_v3.5.1~3D',
    category: 'Patches',
    serverPath: '/master_files/patches/cache_res_v3.5.1~3D',
    patchSize: '28.4 MB',
    version: '3.5.1',
    checksum: 'sha256:7b10f4cc0921a881',
    description: 'Antenna Hand Binary Memory Overlay'
  },
  {
    id: 'master-03',
    filename: 'cache_res_v3.5.2~3D',
    category: 'Patches',
    serverPath: '/master_files/patches/cache_res_v3.5.2~3D',
    patchSize: '35.1 MB',
    version: '3.5.2',
    checksum: 'sha256:6e55d3aa1182c440',
    description: 'Body 90% Precision Recoil Modifier'
  },
  {
    id: 'master-04',
    filename: 'cache_res_v3.5.3~3D',
    category: 'Patches',
    serverPath: '/master_files/patches/cache_res_v3.5.3~3D',
    patchSize: '19.6 MB',
    version: '3.5.3',
    checksum: 'sha256:5d44c2bb3041ee55',
    description: 'Drag Only Smooth Aim Lock Binary'
  },
  {
    id: 'master-05',
    filename: 'NitroXMitm.crt',
    category: 'Certs',
    serverPath: '/master_files/certs/NitroXMitm.crt',
    patchSize: '2.4 KB',
    version: '2.4',
    checksum: 'sha256:4c33b1aa9901dd77',
    description: 'SOYAB-PROXY CA Root Security Certificate'
  },
  {
    id: 'master-06',
    filename: 'version.json',
    category: 'Configs',
    serverPath: '/master_files/config/version.json',
    patchSize: '0.8 KB',
    version: '1.0.0',
    checksum: 'sha256:3b22a0ff8812bb33',
    description: 'Game Version Handshake Redirect Override'
  },
  {
    id: 'master-07',
    filename: 'proxy_routes.json',
    category: 'Configs',
    serverPath: '/master_files/config/proxy_routes.json',
    patchSize: '1.2 KB',
    version: '1.0.0',
    checksum: 'sha256:2a11f9ee7723aa99',
    description: 'Port 8080/8081 Interceptor Routing Rules'
  },
  {
    id: 'master-08',
    filename: 'vps_install.sh',
    category: 'Scripts',
    serverPath: '/master_files/scripts/vps_install.sh',
    patchSize: '4.1 KB',
    version: '2.4.0',
    checksum: 'sha256:0e99d7cc5548ff22',
    description: 'Automated Multiport VPS Installer Script'
  }
];

// Isolated Local Runtimes Repository (Per-user / per-download packages)
let isolatedRuntimes: any[] = [
  {
    runtimeId: 'rt-nishu-8899-master',
    userId: 'NISHU-VIP-8899',
    userLabel: 'Nishu Master Admin',
    packageName: 'Magic Bullet & SSL Certification Package',
    version: '3.5.0',
    status: 'active',
    syncStatus: 'synced',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    isolatedEndpointUrl: '/api/runtimes/rt-nishu-8899-master/files/',
    files: [
      {
        fileId: 'master-01',
        filename: 'cache_res_v3.5.0~3D',
        category: 'Patches',
        serverPath: '/master_files/patches/cache_res_v3.5.0~3D',
        localPath: '/runtime/rt-nishu-8899-master/patches/cache_res_v3.5.0~3D',
        patchSize: '42.8 MB',
        checksum: 'sha256:8f91a2bc0019fa82'
      },
      {
        fileId: 'master-05',
        filename: 'NitroXMitm.crt',
        category: 'Certs',
        serverPath: '/master_files/certs/NitroXMitm.crt',
        localPath: '/runtime/rt-nishu-8899-master/certs/NitroXMitm.crt',
        patchSize: '2.4 KB',
        checksum: 'sha256:4c33b1aa9901dd77'
      },
      {
        fileId: 'master-06',
        filename: 'version.json',
        category: 'Configs',
        serverPath: '/master_files/config/version.json',
        localPath: '/runtime/rt-nishu-8899-master/config/version.json',
        patchSize: '0.8 KB',
        checksum: 'sha256:3b22a0ff8812bb33'
      }
    ]
  }
];

// Auth Endpoint
app.post("/api/auth/login", (req, res) => {
  const { password } = req.body;
  if (!password) {
    return res.status(400).json({ success: false, error: "Password or Key required" });
  }

  const cleanInput = password.trim();
  // Check if input is master password "NISHU" or "nishu" or matches a key
  if (cleanInput.toUpperCase() === "NISHU" || cleanInput.toUpperCase() === "SOYAB") {
    return res.json({
      success: true,
      user: { role: 'admin', label: 'Nishu Master Admin', key: 'NISHU-VIP-8899' },
      message: "Password verified! Access granted to SOYAB-PROXY System."
    });
  }

  const matchedKey = licenseKeys.find(k => k.key.toUpperCase() === cleanInput.toUpperCase());
  if (matchedKey) {
    if (matchedKey.status === 'frozen') {
      return res.status(403).json({ success: false, error: "Key is currently frozen by MOD Safety Protocol." });
    }
    if (matchedKey.status === 'expired') {
      return res.status(403).json({ success: false, error: "License key has expired." });
    }
    return res.json({
      success: true,
      user: { role: 'user', label: matchedKey.userLabel, key: matchedKey.key },
      message: `License key verified for ${matchedKey.userLabel}`
    });
  }

  return res.status(401).json({ success: false, error: "Invalid Password or Key. Password is 'NISHU'" });
});

// License Keys API
app.get("/api/keys", (req, res) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const search = (req.query.search as string || '').toLowerCase();
  
  let filtered = licenseKeys;
  if (search) {
    filtered = filtered.filter(k => 
      k.key.toLowerCase().includes(search) || 
      k.userLabel.toLowerCase().includes(search) ||
      (k.notes && k.notes.toLowerCase().includes(search))
    );
  }

  const total = filtered.length;
  const totalPages = Math.ceil(total / limit) || 1;
  const startIndex = (page - 1) * limit;
  const paginatedKeys = filtered.slice(startIndex, startIndex + limit);

  res.json({
    success: true,
    data: paginatedKeys,
    pagination: { page, limit, total, totalPages }
  });
});

app.post("/api/keys", (req, res) => {
  const { userLabel, durationHours, maxDevices, patchAccess, notes } = req.body;
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const keyName = req.body.key || `NISHU-${userLabel.toUpperCase().replace(/\s+/g, '_')}-${randomSuffix}`;
  
  const newKey = {
    id: `key-${Date.now()}`,
    key: keyName,
    userLabel: userLabel || `Client_${randomSuffix}`,
    durationHours: Number(durationHours) || 720,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + (Number(durationHours) || 720) * 3600000).toISOString(),
    maxDevices: Number(maxDevices) || 1,
    activeDevices: 0,
    status: 'active' as const,
    patchAccess: Array.isArray(patchAccess) ? patchAccess : ['Magic Bullet'],
    allowedIps: [],
    notes: notes || 'Created via SOYAB-PROXY Panel',
    hwid: `HWID-GEN-${randomSuffix}`
  };

  licenseKeys.unshift(newKey);
  res.json({ success: true, key: newKey });
});

app.put("/api/keys/:id/freeze", (req, res) => {
  const { id } = req.params;
  const item = licenseKeys.find(k => k.id === id);
  if (item) {
    item.status = item.status === 'frozen' ? 'active' : 'frozen';
    return res.json({ success: true, key: item });
  }
  res.status(404).json({ success: false, error: "Key not found" });
});

app.delete("/api/keys/:id", (req, res) => {
  const { id } = req.params;
  licenseKeys = licenseKeys.filter(k => k.id !== id);
  res.json({ success: true, message: "Key deleted" });
});

// Proxy Ports API
app.get("/api/ports", (req, res) => {
  res.json({ success: true, ports: proxyPorts });
});

app.post("/api/ports", (req, res) => {
  const { port, protocol, description } = req.body;
  const newPort = {
    port: Number(port),
    protocol: protocol || 'TCP/PROXY',
    status: 'active',
    connections: 0,
    bandwidthMb: 0,
    sslEnabled: true,
    description: description || 'New SOYAB-PROXY Port'
  };
  proxyPorts.push(newPort);
  res.json({ success: true, port: newPort });
});

// MOD Safety API
app.get("/api/safety", (req, res) => {
  res.json({ success: true, safety: modSafety });
});

app.post("/api/safety/toggle-freeze", (req, res) => {
  modSafety.globalFreeze = !modSafety.globalFreeze;
  if (modSafety.globalFreeze) {
    modSafety.safetyLevel = 'HIGH_RISK';
    modSafety.activeMitigation = 'EMERGENCY GLOBAL FREEZE ACTIVATED. All keys locked.';
    licenseKeys.forEach(k => {
      if (k.status === 'active') k.status = 'frozen';
    });
  } else {
    modSafety.safetyLevel = 'SAFE';
    modSafety.activeMitigation = 'AES-256 Dynamic Header Encryption & Signature Bypasser Active';
    licenseKeys.forEach(k => {
      if (k.status === 'frozen') k.status = 'active';
    });
  }
  modSafety.lastUpdate = new Date().toISOString();
  res.json({ success: true, safety: modSafety });
});

// Proxy Version & Intercept File Control API
app.get("/api/proxy/version.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.json(proxyVersionConfig);
});

app.post("/api/proxy/version.json", (req, res) => {
  const incoming = req.body;
  if (incoming && typeof incoming === 'object') {
    proxyVersionConfig = {
      ...proxyVersionConfig,
      ...incoming,
      lastUpdated: new Date().toISOString()
    };
    return res.json({ success: true, config: proxyVersionConfig, message: "version.json intercept updated" });
  }
  res.status(400).json({ success: false, error: "Invalid JSON payload" });
});

// =========================================================================
// SERVER MASTER FILES & ISOLATED PER-USER RUNTIMES CONTROL SYSTEM APIs
// =========================================================================

// 1. Get List of Server Master Files Available for Selection
app.get("/api/server/files", (req, res) => {
  res.json({ success: true, files: serverMasterFiles });
});

// 2. Get User's Isolated Runtimes
app.get("/api/runtimes", (req, res) => {
  const userId = (req.query.userId as string || '').trim();
  if (!userId) {
    return res.json({ success: true, runtimes: isolatedRuntimes });
  }
  // Master Admin (NISHU) has full visibility over all runtimes
  if (userId.toUpperCase().includes('NISHU') || userId.toUpperCase() === 'NISHU-VIP-8899') {
    return res.json({ success: true, runtimes: isolatedRuntimes });
  }
  const userRuntimes = isolatedRuntimes.filter(
    r => r.userId.toLowerCase() === userId.toLowerCase() || r.userLabel.toLowerCase() === userId.toLowerCase()
  );
  res.json({ success: true, runtimes: userRuntimes });
});

// 3. Create & Download Isolated Runtime Package (Only Selected Files)
app.post("/api/runtimes/create", (req, res) => {
  const { userId, userLabel, packageName, selectedFileIds } = req.body;

  if (!userId || !selectedFileIds || !Array.isArray(selectedFileIds) || selectedFileIds.length === 0) {
    return res.status(400).json({
      success: false,
      error: "VALIDATION ERROR: Missing userId or non-empty selectedFileIds array."
    });
  }

  // Verify selected files exist on server master
  const selectedMasterFiles = serverMasterFiles.filter(f => selectedFileIds.includes(f.id));
  if (selectedMasterFiles.length !== selectedFileIds.length) {
    return res.status(404).json({
      success: false,
      error: "SERVER FILE MISSING: One or more selected files do not exist on master server storage."
    });
  }

  // Generate unique isolated runtime ID
  const cleanUser = (userId || 'client').toLowerCase().replace(/[^a-z0-9]/g, '_');
  const runtimeId = `rt-${cleanUser}-${Math.floor(1000 + Math.random() * 9000)}`;

  // Construct isolated package files list (preserving original directory paths)
  const runtimeFiles = selectedMasterFiles.map(mf => ({
    fileId: mf.id,
    filename: mf.filename,
    category: mf.category,
    serverPath: mf.serverPath,
    localPath: `/runtime/${runtimeId}/${mf.category.toLowerCase()}/${mf.filename}`,
    patchSize: mf.patchSize,
    checksum: mf.checksum
  }));

  // Automatically add local_config.json configured with SOYAB's Local Server URL
  const soyabLocalConfigEntry = {
    fileId: 'local-config-generated',
    filename: 'local_config.json',
    category: 'Configs',
    serverPath: '/master_files/config/local_config.json',
    localPath: `/runtime/${runtimeId}/config/local_config.json`,
    patchSize: '1.1 KB',
    checksum: `sha256:${Math.random().toString(16).substring(2, 10)}${Math.random().toString(16).substring(2, 10)}`
  };
  runtimeFiles.push(soyabLocalConfigEntry);

  const localServerConfig = {
    runtimeId,
    soyabLocalServerUrl: "http://127.0.0.1:8080/",
    localProxyPort: 8080,
    verAddr: `http://127.0.0.1:8080/api/runtimes/${runtimeId}/`,
    resetGuest: true,
    activePatches: selectedMasterFiles.map(f => f.filename),
    status: "SOYAB_LOCAL_SERVER_ACTIVE",
    boundAt: new Date().toISOString()
  };

  const newRuntime = {
    runtimeId,
    userId,
    userLabel: userLabel || userId,
    packageName: packageName || `Isolated Package (${runtimeFiles.length} files)`,
    version: '1.0.0',
    status: 'active',
    syncStatus: 'synced',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    isolatedEndpointUrl: `/api/runtimes/${runtimeId}/files/`,
    localConfig: localServerConfig,
    files: runtimeFiles
  };

  isolatedRuntimes.unshift(newRuntime);

  res.json({
    success: true,
    runtime: newRuntime,
    manifest: {
      runtimeId,
      userId,
      userLabel: newRuntime.userLabel,
      packageName: newRuntime.packageName,
      version: newRuntime.version,
      status: newRuntime.status,
      createdAt: newRuntime.createdAt,
      fileCount: runtimeFiles.length,
      files: runtimeFiles
    },
    message: `Isolated runtime package ${runtimeId} created successfully with ${runtimeFiles.length} selected files.`
  });
});

// 4. Fetch Details & Manifest for Specific Runtime
app.get("/api/runtimes/:runtimeId", (req, res) => {
  const { runtimeId } = req.params;
  const userId = (req.query.userId as string || '').trim();

  const targetRuntime = isolatedRuntimes.find(r => r.runtimeId === runtimeId);
  if (!targetRuntime) {
    return res.status(404).json({ success: false, error: `Runtime ${runtimeId} not found.` });
  }

  // Ownership Check
  const isAdmin = userId && (userId.toUpperCase().includes('NISHU') || userId.toUpperCase() === 'NISHU-VIP-8899');
  if (userId && !isAdmin && targetRuntime.userId.toLowerCase() !== userId.toLowerCase()) {
    return res.status(403).json({
      success: false,
      error: `SECURITY ERROR: Ownership mismatch. User '${userId}' cannot access Runtime '${runtimeId}' owned by '${targetRuntime.userId}'.`
    });
  }

  res.json({ success: true, runtime: targetRuntime });
});

// 5. Remote Server Control Layer for Runtime (Activate, Deactivate, Sync, Restart, Remove)
app.post("/api/runtimes/:runtimeId/control", (req, res) => {
  const { runtimeId } = req.params;
  const { userId, action } = req.body;

  const targetRuntime = isolatedRuntimes.find(r => r.runtimeId === runtimeId);
  if (!targetRuntime) {
    return res.status(404).json({ success: false, error: `Runtime ${runtimeId} not found.` });
  }

  // Ownership Check: User A must never control User B's runtime
  const isAdmin = userId && (userId.toUpperCase().includes('NISHU') || userId.toUpperCase() === 'NISHU-VIP-8899');
  if (userId && !isAdmin && targetRuntime.userId.toLowerCase() !== userId.toLowerCase()) {
    return res.status(403).json({
      success: false,
      error: `SECURITY DENIED: User '${userId}' is not authorized to control Runtime '${runtimeId}'.`
    });
  }

  if (action === 'activate') {
    targetRuntime.status = 'active';
    targetRuntime.updatedAt = new Date().toISOString();
    return res.json({ success: true, runtime: targetRuntime, message: `Runtime ${runtimeId} activated for proxy control.` });
  } else if (action === 'deactivate') {
    targetRuntime.status = 'inactive';
    targetRuntime.updatedAt = new Date().toISOString();
    return res.json({ success: true, runtime: targetRuntime, message: `Runtime ${runtimeId} deactivated.` });
  } else if (action === 'sync') {
    targetRuntime.syncStatus = 'synced';
    targetRuntime.updatedAt = new Date().toISOString();
    return res.json({ success: true, runtime: targetRuntime, message: `Runtime ${runtimeId} synchronized with server master storage.` });
  } else if (action === 'restart') {
    targetRuntime.updatedAt = new Date().toISOString();
    return res.json({ success: true, runtime: targetRuntime, message: `Runtime ${runtimeId} restarted successfully.` });
  } else if (action === 'remove') {
    // Remove local isolated working copy WITHOUT modifying master server files!
    isolatedRuntimes = isolatedRuntimes.filter(r => r.runtimeId !== runtimeId);
    return res.json({
      success: true,
      runtimeId,
      message: `Local runtime ${runtimeId} removed successfully. Server master files remain 100% untouched.`
    });
  }

  res.status(400).json({ success: false, error: `Invalid control action '${action}'` });
});

// 6. Isolated Local Runtime Endpoint (Serves ONLY selected package directory, blocks path traversal)
app.get("/api/runtimes/:runtimeId/files/*", (req, res) => {
  const { runtimeId } = req.params;
  const requestedFile = req.params[0] || (req.query.file as string) || '';

  const targetRuntime = isolatedRuntimes.find(r => r.runtimeId === runtimeId);
  if (!targetRuntime) {
    return res.status(404).json({ success: false, error: `Isolated Runtime '${runtimeId}' does not exist.` });
  }

  // SECURITY: Prevent Path Traversal (`../` or escaping runtime root)
  if (requestedFile.includes('..') || requestedFile.includes('/../') || requestedFile.startsWith('/master_files')) {
    return res.status(403).json({
      success: false,
      error: "PATH TRAVERSAL BLOCKED: Attempt to access files outside assigned runtime root directory rejected."
    });
  }

  // Check if requested file belongs to the runtime package manifest
  const matchedFile = targetRuntime.files.find((f: any) =>
    f.filename.toLowerCase() === requestedFile.toLowerCase() ||
    f.localPath.toLowerCase().endsWith(requestedFile.toLowerCase())
  );

  if (!matchedFile) {
    return res.status(403).json({
      success: false,
      error: `PACKAGE ISOLATION REJECTION: File '${requestedFile}' is not part of Runtime '${runtimeId}' package. Access denied.`
    });
  }

  // Special handling for local_config.json
  if (matchedFile.filename === 'local_config.json') {
    return res.json({
      success: true,
      runtimeId,
      packageName: targetRuntime.packageName,
      file: matchedFile,
      content: targetRuntime.localConfig || {
        runtimeId,
        soyabLocalServerUrl: "http://127.0.0.1:8080/",
        localProxyPort: 8080,
        resetGuest: true,
        status: "SOYAB_LOCAL_SERVER_ACTIVE"
      }
    });
  }

  // Return isolated payload for binary patches / files
  res.json({
    success: true,
    runtimeId,
    packageName: targetRuntime.packageName,
    file: matchedFile,
    headers: {
      "Content-Type": "application/octet-stream",
      "X-Soyab-Runtime-ID": runtimeId,
      "X-Soyab-Isolation": "ENFORCED"
    },
    binaryContentStream: `[SOYAB-PROXY ISOLATED FILE STREAM]\nRuntimeID: ${runtimeId}\nLocalPath: ${matchedFile.localPath}\nChecksum: ${matchedFile.checksum}\n[PAYLOAD VALIDATED OK]`
  });
});

// =========================================================================

// Script & Terminal Command Execution API
app.post("/api/exec", (req, res) => {
  const { command } = req.body;
  const cmdStr = (command || '').trim();

  let output = "";
  if (cmdStr === "bash check_logs.sh" || cmdStr === "check_logs") {
    output = `[SOYAB-PROXY LOG INSPECTOR]\n` +
      `[${new Date().toISOString()}] [INFO] Checking /var/log/soyab_proxy.log...\n` +
      `[${new Date().toISOString()}] [PORT 8080] Active MITM connection from 103.21.244.1 - Patch: Magic Bullet (SUCCESS)\n` +
      `[${new Date().toISOString()}] [PORT 8888] Antenna Hand mesh stream synced - 142 clients online\n` +
      `[${new Date().toISOString()}] [AUTH 9090] Password 'NISHU' session valid. License master active.\n` +
      `[SOYAB-PROXY] All 4 ports running smoothly. 0 packet drops detected.`;
  } else if (cmdStr === "bash fix_ports.sh" || cmdStr === "fix_ports") {
    output = `[SOYAB-PROXY PORT FIXER]\n` +
      `Stopping conflicting services on ports 8080, 8081, 8888, 9090...\n` +
      `Flushing iptables firewall rules...\n` +
      `Binding SOYAB-PROXY multi-port listener...\n` +
      `[SUCCESS] All ports reset and running cleanly!`;
  } else if (cmdStr === "python3 proxy.py" || cmdStr === "proxy.py") {
    output = `[SOYAB-PROXY DAEMON v2.4]\n` +
      `Loading configuration from proxy_config.py...\n` +
      `Loaded SSL CA Certificate: NitroXMitm.crt\n` +
      `Loaded MOD Safety: AES-256 Header Bypasser ON\n` +
      `Server bound to 0.0.0.0:8080 (HTTP), 0.0.0.0:8081 (HTTPS), 0.0.0.0:8888 (TCP RAW)\n` +
      `Ready for client connections. Press Ctrl+C to stop.`;
  } else if (cmdStr === "bash manage_ports.sh" || cmdStr === "manage_ports") {
    output = `[SOYAB-PROXY PORT MANAGER]\n` +
      `PORT 8080: HTTP/MITM - ONLINE (42 conns)\n` +
      `PORT 8081: HTTPS/TLS - ONLINE (18 conns)\n` +
      `PORT 8888: TCP/RAW   - ONLINE (87 conns)\n` +
      `PORT 9090: REST/AUTH - ONLINE (15 conns)\n` +
      `STATUS: ALL PORTS OPTIMAL`;
  } else {
    output = `[SOYAB-PROXY SHELL]\n$ ${cmdStr}\nCommand executed successfully. Target output verified.`;
  }

  res.json({ success: true, output });
});

// Gemini AI Assistant Endpoint
app.post("/api/gemini/assistant", async (req, res) => {
  const { prompt } = req.body;
  if (!prompt) {
    return res.status(400).json({ error: "Prompt required" });
  }

  if (!ai) {
    return res.json({
      reply: `[SOYAB-PROXY Local AI Assistant]\n\nRegarding "${prompt}":\nTo configure your SOYAB-PROXY system, use Password "NISHU" in the main auth panel. Ensure NitroXMitm.crt is installed on target devices and port 8080 is routed through Wi-Fi proxy settings. If key access is restricted, verify MOD Safety status.`
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.7-flash",
      contents: prompt,
      config: {
        systemInstruction: `You are SOYAB-PROXY System AI Assistant. The system password is 'NISHU'. You assist users with proxy port configuration, key generation, MOD anti-ban safety, game patch installation (Magic Bullet, Antenna Hand, Body 90%, Drag Only), and SSL certificate (NitroXMitm.crt) setup. Provide concise, clear, helpful instructions in Hindi/English as appropriate.`,
        temperature: 0.7
      }
    });

    res.json({ reply: response.text || "No response text generated." });
  } catch (err: any) {
    console.error("Gemini API Error:", err);
    res.status(500).json({ error: err.message || "Failed to generate AI response" });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SOYAB-PROXY System Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
