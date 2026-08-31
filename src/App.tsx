import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { LoginModal } from './components/LoginModal';
import { DashboardTab } from './components/DashboardTab';
import { KeyManagerTab } from './components/KeyManagerTab';
import { PortsManagerTab } from './components/PortsManagerTab';
import { ModSafetyTab } from './components/ModSafetyTab';
import { GamePatchesTab } from './components/GamePatchesTab';
import { MiniAppTab } from './components/MiniAppTab';
import { TerminalTab } from './components/TerminalTab';
import { ProxyConfigTab } from './components/ProxyConfigTab';
import { RuntimeControlTab } from './components/RuntimeControlTab';
import { AiAssistantModal } from './components/AiAssistantModal';

import {
  INITIAL_LICENSE_KEYS,
  INITIAL_PORTS,
  INITIAL_MOD_SAFETY,
  INITIAL_GAME_PATCHES,
  INITIAL_ALLOWED_IPS,
  INITIAL_LOGS
} from './data/initialData';

import { LicenseKey, ProxyPort, ModSafetyConfig, GamePatch, AllowedIP, SystemLog } from './types';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('soyab_auth') === 'true';
  });

  const [currentUser, setCurrentUser] = useState<any>(() => {
    const saved = localStorage.getItem('soyab_user');
    return saved ? JSON.parse(saved) : { role: 'admin', label: 'Nishu Master Admin', key: 'NISHU-VIP-8899' };
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isAiOpen, setIsAiOpen] = useState<boolean>(false);

  // Core System State
  const [licenseKeys, setLicenseKeys] = useState<LicenseKey[]>(() => {
    const saved = localStorage.getItem('soyab_keys');
    return saved ? JSON.parse(saved) : INITIAL_LICENSE_KEYS;
  });

  const [ports, setPorts] = useState<ProxyPort[]>(() => {
    const saved = localStorage.getItem('soyab_ports');
    return saved ? JSON.parse(saved) : INITIAL_PORTS;
  });

  const [modSafety, setModSafety] = useState<ModSafetyConfig>(() => {
    const saved = localStorage.getItem('soyab_safety');
    return saved ? JSON.parse(saved) : INITIAL_MOD_SAFETY;
  });

  const [patches] = useState<GamePatch[]>(INITIAL_GAME_PATCHES);

  const [allowedIps, setAllowedIps] = useState<AllowedIP[]>(() => {
    const saved = localStorage.getItem('soyab_allowed_ips');
    return saved ? JSON.parse(saved) : INITIAL_ALLOWED_IPS;
  });

  const [logs, setLogs] = useState<SystemLog[]>(INITIAL_LOGS);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('soyab_keys', JSON.stringify(licenseKeys));
  }, [licenseKeys]);

  useEffect(() => {
    localStorage.setItem('soyab_ports', JSON.stringify(ports));
  }, [ports]);

  useEffect(() => {
    localStorage.setItem('soyab_safety', JSON.stringify(modSafety));
  }, [modSafety]);

  useEffect(() => {
    localStorage.setItem('soyab_allowed_ips', JSON.stringify(allowedIps));
  }, [allowedIps]);

  const handleLoginSuccess = (user: any) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    localStorage.setItem('soyab_auth', 'true');
    localStorage.setItem('soyab_user', JSON.stringify(user));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('soyab_auth');
    localStorage.removeItem('soyab_user');
  };

  // State Handlers
  const handleAddKey = (keyData: Partial<LicenseKey>) => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newKeyStr = keyData.key || `NISHU-${(keyData.userLabel || 'USER').toUpperCase().replace(/\s+/g, '_')}-${randomNum}`;
    
    const newKeyItem: LicenseKey = {
      id: `key-${Date.now()}`,
      key: newKeyStr,
      userLabel: keyData.userLabel || `Client_${randomNum}`,
      durationHours: keyData.durationHours || 720,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + (keyData.durationHours || 720) * 3600000).toISOString(),
      maxDevices: keyData.maxDevices || 1,
      activeDevices: 0,
      status: 'active',
      patchAccess: keyData.patchAccess || ['Magic Bullet'],
      allowedIps: [],
      notes: keyData.notes || 'Generated via SOYAB-PROXY Panel',
      hwid: `HWID-GEN-${randomNum}`
    };

    setLicenseKeys(prev => [newKeyItem, ...prev]);
    addLog('success', 'auth', `Generated new key ${newKeyStr} for ${newKeyItem.userLabel}`);
  };

  const handleToggleFreezeKey = (keyId: string) => {
    setLicenseKeys(prev => prev.map(k => {
      if (k.id === keyId) {
        const nextStatus = k.status === 'frozen' ? 'active' : 'frozen';
        addLog('warn', 'safety', `Key ${k.key} status changed to ${nextStatus.toUpperCase()}`);
        return { ...k, status: nextStatus as any };
      }
      return k;
    }));
  };

  const handleDeleteKey = (keyId: string) => {
    const item = licenseKeys.find(k => k.id === keyId);
    setLicenseKeys(prev => prev.filter(k => k.id !== keyId));
    if (item) {
      addLog('warn', 'auth', `Deleted key ${item.key}`);
    }
  };

  const handleAddPort = (portData: Partial<ProxyPort>) => {
    const newPortObj: ProxyPort = {
      port: portData.port || 8082,
      protocol: portData.protocol || 'TCP/RAW',
      status: 'active',
      connections: 0,
      bandwidthMb: 0,
      sslEnabled: true,
      description: portData.description || 'Custom Proxy Listener'
    };
    setPorts(prev => [...prev, newPortObj]);
    addLog('info', 'proxy', `Added new proxy listener port ${newPortObj.port} (${newPortObj.protocol})`);
  };

  const handleToggleGlobalFreeze = () => {
    setModSafety(prev => {
      const nextFreeze = !prev.globalFreeze;
      if (nextFreeze) {
        addLog('error', 'safety', 'EMERGENCY GLOBAL FREEZE TRIGGERED. All keys locked.');
        setLicenseKeys(keys => keys.map(k => (k.status === 'active' ? { ...k, status: 'frozen' as const } : k)));
        return {
          ...prev,
          globalFreeze: true,
          safetyLevel: 'HIGH_RISK',
          activeMitigation: 'EMERGENCY GLOBAL FREEZE ACTIVATED. All proxy traffic blocked.',
          lastUpdate: new Date().toISOString()
        };
      } else {
        addLog('success', 'safety', 'GLOBAL FREEZE LIFTED. System safety restored.');
        setLicenseKeys(keys => keys.map(k => (k.status === 'frozen' ? { ...k, status: 'active' as const } : k)));
        return {
          ...prev,
          globalFreeze: false,
          safetyLevel: 'SAFE',
          activeMitigation: 'AES-256 Dynamic Header Encryption & Signature Bypasser Active',
          lastUpdate: new Date().toISOString()
        };
      }
    });
  };

  const handleToggleSafetyFeature = (featureKey: keyof ModSafetyConfig) => {
    setModSafety(prev => {
      const currVal = prev[featureKey];
      if (typeof currVal === 'boolean') {
        const nextVal = !currVal;
        addLog('info', 'safety', `Toggle ${String(featureKey)}: ${nextVal ? 'ON' : 'OFF'}`);
        return { ...prev, [featureKey]: nextVal, lastUpdate: new Date().toISOString() };
      }
      return prev;
    });
  };

  const handleAddIp = (ip: string, notes: string) => {
    const newIpObj: AllowedIP = {
      id: `ip-${Date.now()}`,
      ip,
      addedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
      notes,
      active: true
    };
    setAllowedIps(prev => [newIpObj, ...prev]);
    addLog('info', 'kernel', `Whitelisted client IP ${ip}`);
  };

  const handleDeleteIp = (id: string) => {
    setAllowedIps(prev => prev.filter(i => i.id !== id));
  };

  const handleRestartPorts = () => {
    addLog('info', 'kernel', 'Executing fix_ports.sh... Restarting multiports 8080, 8081, 8888, 9090');
    setPorts(prev => prev.map(p => ({ ...p, status: 'active' })));
  };

  const addLog = (level: 'info' | 'warn' | 'error' | 'success', source: 'proxy' | 'bot' | 'auth' | 'safety' | 'kernel', message: string) => {
    const newLogItem: SystemLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString(),
      level,
      source,
      message
    };
    setLogs(prev => [newLogItem, ...prev.slice(0, 49)]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-amber-500 selection:text-slate-950 flex flex-col">
      
      {/* Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        modSafety={modSafety}
        toggleGlobalFreeze={handleToggleGlobalFreeze}
        isAuthenticated={isAuthenticated}
        onLogout={handleLogout}
        openAiModal={() => setIsAiOpen(true)}
      />

      {/* Main Container */}
      {!isAuthenticated ? (
        <LoginModal onLoginSuccess={handleLoginSuccess} />
      ) : (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {activeTab === 'dashboard' && (
            <DashboardTab
              licenseKeys={licenseKeys}
              ports={ports}
              modSafety={modSafety}
              patches={patches}
              logs={logs}
              onNavigate={setActiveTab}
              onRefreshData={() => addLog('info', 'kernel', 'System status refreshed.')}
            />
          )}

          {activeTab === 'runtimes' && (
            <RuntimeControlTab
              currentUser={currentUser}
              onLogAction={(msg) => addLog('info', 'proxy', msg)}
            />
          )}

          {activeTab === 'proxyfiles' && (
            <ProxyConfigTab
              onLogAction={(msg) => addLog('info', 'proxy', msg)}
            />
          )}

          {activeTab === 'keys' && (
            <KeyManagerTab
              licenseKeys={licenseKeys}
              onAddKey={handleAddKey}
              onToggleFreeze={handleToggleFreezeKey}
              onDeleteKey={handleDeleteKey}
            />
          )}

          {activeTab === 'ports' && (
            <PortsManagerTab
              ports={ports}
              allowedIps={allowedIps}
              onAddPort={handleAddPort}
              onAddIp={handleAddIp}
              onDeleteIp={handleDeleteIp}
              onRestartPorts={handleRestartPorts}
            />
          )}

          {activeTab === 'safety' && (
            <ModSafetyTab
              modSafety={modSafety}
              onToggleFreeze={handleToggleGlobalFreeze}
              onToggleSafetyFeature={handleToggleSafetyFeature}
            />
          )}

          {activeTab === 'patches' && (
            <GamePatchesTab patches={patches} />
          )}

          {activeTab === 'miniapp' && (
            <MiniAppTab onVerifyKey={(key) => addLog('info', 'bot', `MiniApp validated key: ${key}`)} />
          )}

          {activeTab === 'terminal' && (
            <TerminalTab />
          )}
        </main>
      )}

      {/* Gemini AI Assistant Drawer / Modal */}
      <AiAssistantModal isOpen={isAiOpen} onClose={() => setIsAiOpen(false)} />

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-slate-900 py-4 text-center text-[11px] text-slate-500 font-mono mt-auto">
        SOYAB-PROXY System &bull; Password: <span className="text-amber-400 font-bold">NISHU</span> &bull; AES-256 Multiport Control Daemon v2.4
      </footer>

    </div>
  );
}
