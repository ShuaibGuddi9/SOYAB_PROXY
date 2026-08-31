import React from 'react';
import { Cpu, Wifi, Key, Shield, AlertTriangle, Activity, Server, Users, ArrowUpRight, CheckCircle, RefreshCw, Layers, Terminal, FileJson, Globe } from 'lucide-react';
import { LicenseKey, ProxyPort, ModSafetyConfig, GamePatch, SystemLog } from '../types';

interface DashboardTabProps {
  licenseKeys: LicenseKey[];
  ports: ProxyPort[];
  modSafety: ModSafetyConfig;
  patches: GamePatch[];
  logs: SystemLog[];
  onNavigate: (tab: string) => void;
  onRefreshData: () => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
  licenseKeys,
  ports,
  modSafety,
  patches,
  logs,
  onNavigate,
  onRefreshData
}) => {
  const activeKeysCount = licenseKeys.filter(k => k.status === 'active').length;
  const activePortsCount = ports.filter(p => p.status === 'active').length;
  const totalBandwidth = ports.reduce((acc, p) => acc + p.bandwidthMb, 0).toFixed(1);
  const totalConnections = ports.reduce((acc, p) => acc + p.connections, 0);

  return (
    <div className="space-y-6">
      
      {/* System Banner & Master Access Info */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 p-6 rounded-2xl border border-slate-800 shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                SYSTEM ONLINE
              </span>
              <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold px-2.5 py-0.5 rounded-full">
                MASTER PASS: NISHU
              </span>
            </div>
            <h2 className="text-2xl font-black text-white tracking-tight">
              SOYAB-PROXY Server Control Dashboard
            </h2>
            <p className="text-slate-400 text-xs mt-1">
              Active Multiport Game Proxy & Key Validation Hub with AES-256 Memory Bypasser
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onRefreshData}
              className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-3.5 py-2 rounded-xl border border-slate-700 transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
              <span>Refresh Status</span>
            </button>
            <button
              onClick={() => onNavigate('keys')}
              className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold px-4 py-2 rounded-xl shadow-md transition-all"
            >
              <Key className="w-3.5 h-3.5" />
              <span>Create New Key</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-md hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Licenses</span>
            <div className="p-2 bg-amber-500/10 rounded-xl border border-amber-500/20 text-amber-400">
              <Key className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">{activeKeysCount} / {licenseKeys.length}</div>
          <div className="flex items-center justify-between mt-2 text-xs">
            <span className="text-slate-400 font-mono">Master: NISHU-VIP-8899</span>
            <button onClick={() => onNavigate('keys')} className="text-amber-400 hover:underline flex items-center gap-0.5">
              <span>Manage</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-md hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Multiport Status</span>
            <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20 text-blue-400">
              <Wifi className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">{activePortsCount} Ports Listening</div>
          <div className="flex items-center justify-between mt-2 text-xs">
            <span className="text-slate-400 font-mono">{totalConnections} Live Clients</span>
            <button onClick={() => onNavigate('ports')} className="text-blue-400 hover:underline flex items-center gap-0.5">
              <span>Ports 8080/8888</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-md hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">MOD Anti-Ban Safety</span>
            <div className={`p-2 rounded-xl border ${modSafety.globalFreeze ? 'bg-red-500/10 border-red-500/20 text-red-400' : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'}`}>
              <Shield className="w-4 h-4" />
            </div>
          </div>
          <div className={`text-2xl font-black ${modSafety.globalFreeze ? 'text-red-400' : 'text-emerald-400'}`}>
            {modSafety.globalFreeze ? 'EMERGENCY FROZEN' : modSafety.safetyLevel}
          </div>
          <div className="flex items-center justify-between mt-2 text-xs">
            <span className="text-slate-400 font-mono">AES-256 Bypass ON</span>
            <button onClick={() => onNavigate('safety')} className="text-emerald-400 hover:underline flex items-center gap-0.5">
              <span>Safety Controls</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-md hover:border-slate-700 transition-all">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Game Patches</span>
            <div className="p-2 bg-purple-500/10 rounded-xl border border-purple-500/20 text-purple-400">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white">{patches.length} Loaded Patches</div>
          <div className="flex items-center justify-between mt-2 text-xs">
            <span className="text-slate-400 font-mono">Magic Bullet / Antenna</span>
            <button onClick={() => onNavigate('patches')} className="text-purple-400 hover:underline flex items-center gap-0.5">
              <span>Download Patches</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>

      {/* Quick Banners Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Isolated Runtime Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-400">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">Isolated File Runtimes</span>
                <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-[10px] font-mono px-2 py-0.5 rounded">
                  ISOLATION ENFORCED
                </span>
              </div>
              <p className="text-slate-400 text-xs font-mono mt-0.5">
                Per-User / Per-Download Isolated Packages
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('runtimes')}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1 shrink-0 shadow-md"
          >
            <span>Runtimes</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Quick Proxy Intercept Configuration Banner */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
              <FileJson className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-sm">Proxy Intercept Config (<code className="text-amber-400">version.json</code>)</span>
                <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono px-2 py-0.5 rounded">
                  resetGuest: TRUE
                </span>
              </div>
              <p className="text-slate-400 text-xs font-mono mt-0.5">
                verAddr: <span className="text-slate-200">https://version.astutech.online/</span>
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('proxyfiles')}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-3.5 py-2 rounded-xl transition-all flex items-center gap-1 shrink-0 shadow-md"
          >
            <span>Proxy Files</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>

      {/* Main Content Split: Active Ports & Active Game Patches */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Proxy Listener Table */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Server className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-white text-base">SOYAB-PROXY Multiport Daemon Status</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">Total Traffic: {totalBandwidth} MB</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3">Port</th>
                  <th className="p-3">Protocol</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Conns</th>
                  <th className="p-3">Bandwidth</th>
                  <th className="p-3">Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono">
                {ports.map((port) => (
                  <tr key={port.port} className="hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-bold text-amber-400">{port.port}</td>
                    <td className="p-3">{port.protocol}</td>
                    <td className="p-3">
                      <span className="inline-flex items-center gap-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] px-2 py-0.5 rounded-md font-bold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        ONLINE
                      </span>
                    </td>
                    <td className="p-3 text-white font-bold">{port.connections}</td>
                    <td className="p-3 text-slate-400">{port.bandwidthMb} MB</td>
                    <td className="p-3 text-slate-400 text-[11px] font-sans truncate max-w-[200px]">{port.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Game Patch Status */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-400" />
              <h3 className="font-bold text-white text-base">Active Game Patches</h3>
            </div>
            <button onClick={() => onNavigate('patches')} className="text-xs text-amber-400 hover:underline">View All</button>
          </div>

          <div className="space-y-3">
            {patches.slice(0, 4).map((patch) => (
              <div key={patch.id} className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-200 text-xs">{patch.name}</span>
                    <span className="bg-purple-500/10 text-purple-300 border border-purple-500/20 text-[10px] px-1.5 py-0.5 rounded font-mono">
                      {patch.patchSize}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate max-w-[200px] mt-0.5">{patch.filename}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-emerald-400">{patch.activeUsers} users</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Real-Time Daemon Event Logs Stream */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-amber-400" />
            <h3 className="font-bold text-white text-xs font-mono uppercase tracking-wider">Live System Logs</h3>
          </div>
          <button
            onClick={() => onNavigate('terminal')}
            className="text-xs text-amber-400 hover:underline font-mono"
          >
            Launch Shell Terminal →
          </button>
        </div>

        <div className="font-mono text-xs space-y-2 max-h-48 overflow-y-auto pr-2">
          {logs.map((log) => (
            <div key={log.id} className="flex items-start gap-2 text-slate-300">
              <span className="text-slate-500 shrink-0">[{log.timestamp}]</span>
              <span className={`px-1.5 py-0.2 rounded text-[10px] uppercase font-bold shrink-0 ${
                log.level === 'success' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                log.level === 'warn' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' :
                log.level === 'error' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                'bg-blue-500/10 text-blue-400 border border-blue-500/20'
              }`}>
                {log.source}
              </span>
              <span className="truncate">{log.message}</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
