import React from 'react';
import { Shield, AlertTriangle, CheckCircle2, Lock, Flame, Cpu, RefreshCw, Zap, Sliders, Radio } from 'lucide-react';
import { ModSafetyConfig } from '../types';

interface ModSafetyTabProps {
  modSafety: ModSafetyConfig;
  onToggleFreeze: () => void;
  onToggleSafetyFeature: (featureKey: keyof ModSafetyConfig) => void;
}

export const ModSafetyTab: React.FC<ModSafetyTabProps> = ({
  modSafety,
  onToggleFreeze,
  onToggleSafetyFeature
}) => {
  return (
    <div className="space-y-6">
      
      {/* Safety Status Banner */}
      <div className={`p-6 rounded-2xl border shadow-xl transition-all ${
        modSafety.globalFreeze
          ? 'bg-gradient-to-r from-red-950 via-red-900 to-slate-900 border-red-500/50'
          : 'bg-gradient-to-r from-slate-900 via-slate-900 to-emerald-950/40 border-slate-800'
      }`}>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-2xl border shadow-lg ${
              modSafety.globalFreeze
                ? 'bg-red-600 text-white border-red-400 animate-pulse'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
            }`}>
              {modSafety.globalFreeze ? (
                <AlertTriangle className="w-8 h-8" />
              ) : (
                <Shield className="w-8 h-8" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                  modSafety.globalFreeze
                    ? 'bg-red-500/20 text-red-300 border-red-500/40'
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                }`}>
                  SAFETY LEVEL: {modSafety.safetyLevel}
                </span>
                <span className="text-slate-400 text-xs font-mono">
                  Updated: {new Date(modSafety.lastUpdate).toLocaleTimeString()}
                </span>
              </div>
              <h2 className="text-2xl font-black text-white tracking-tight">
                {modSafety.globalFreeze ? 'EMERGENCY SAFETY LOCKDOWN ACTIVE' : 'SOYAB Anti-Ban Safety Protection'}
              </h2>
              <p className="text-slate-300 text-xs mt-1 font-mono">
                {modSafety.activeMitigation}
              </p>
            </div>
          </div>

          <div className="shrink-0">
            <button
              onClick={onToggleFreeze}
              className={`w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-wider shadow-xl transition-all ${
                modSafety.globalFreeze
                  ? 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                  : 'bg-red-600 hover:bg-red-500 text-white shadow-red-600/30 animate-pulse'
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>{modSafety.globalFreeze ? 'UNFREEZE ALL KEYS & RESTORE' : 'TRIGGER EMERGENCY GLOBAL FREEZE'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Safety Controls Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Protection Module 1 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-white text-base">Anti-Ban Signature Bypass</h3>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={modSafety.antiBanActive}
                onChange={() => onToggleSafetyFeature('antiBanActive')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Dynamically alters outgoing MITM packet headers to match official game client fingerprints, preventing server-side anomaly flags.
          </p>
          <div className="pt-2 border-t border-slate-800 flex justify-between text-xs font-mono text-slate-400">
            <span>Status:</span>
            <span className={modSafety.antiBanActive ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
              {modSafety.antiBanActive ? 'OPERATIONAL' : 'DISABLED'}
            </span>
          </div>
        </div>

        {/* Protection Module 2 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-blue-400" />
              <h3 className="font-bold text-white text-base">Memory Patch Shield</h3>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={modSafety.memoryPatchProtection}
                onChange={() => onToggleSafetyFeature('memoryPatchProtection')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Protects binary memory injected resources (Magic Bullet, Antenna Hand) from anti-cheat memory scanning daemons.
          </p>
          <div className="pt-2 border-t border-slate-800 flex justify-between text-xs font-mono text-slate-400">
            <span>Status:</span>
            <span className={modSafety.memoryPatchProtection ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
              {modSafety.memoryPatchProtection ? 'ACTIVE SHIELD' : 'OFF'}
            </span>
          </div>
        </div>

        {/* Protection Module 3 */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-purple-400" />
              <h3 className="font-bold text-white text-base">AES-256 Tunnel Encryption</h3>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={modSafety.proxyEncryption}
                onChange={() => onToggleSafetyFeature('proxyEncryption')}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Encrypts all client-to-proxy payload communications using NitroXMitm CA certificate credentials.
          </p>
          <div className="pt-2 border-t border-slate-800 flex justify-between text-xs font-mono text-slate-400">
            <span>Status:</span>
            <span className={modSafety.proxyEncryption ? 'text-emerald-400 font-bold' : 'text-slate-500'}>
              {modSafety.proxyEncryption ? 'ENCRYPTED' : 'UNENCRYPTED'}
            </span>
          </div>
        </div>

      </div>

      {/* Safety Protocol Operational Directives */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <h3 className="font-bold text-white text-base flex items-center gap-2">
          <Sliders className="w-5 h-5 text-amber-400" />
          <span>SOYAB-PROXY Safety Protocol Directives</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="text-amber-400 font-bold uppercase block">1. Heartbeat Interval Verification</span>
            <p className="text-slate-400 font-sans text-xs">
              Configured at <span className="text-white font-mono font-bold">{modSafety.heartbeatMs} ms</span>. Validates HWID binding every 2.5 seconds to prevent key sharing across multiple unauthorized devices.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <span className="text-amber-400 font-bold uppercase block">2. Emergency Owner Override</span>
            <p className="text-slate-400 font-sans text-xs">
              When a game security update is detected, press <span className="text-red-400 font-bold">EMERGENCY GLOBAL FREEZE</span> to instantly lock all user keys and block proxy packet routing until safe.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
