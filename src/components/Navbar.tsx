import React from 'react';
import { Shield, Key, Terminal, Wifi, Lock, Cpu, Bot, Flame, LogOut, CheckCircle2, AlertTriangle, FileJson, Layers } from 'lucide-react';
import { ModSafetyConfig } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  modSafety: ModSafetyConfig;
  toggleGlobalFreeze: () => void;
  isAuthenticated: boolean;
  onLogout: () => void;
  openAiModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  modSafety,
  toggleGlobalFreeze,
  isAuthenticated,
  onLogout,
  openAiModal
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-40 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Password Badge */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-red-600 via-amber-600 to-amber-500 p-2 rounded-xl shadow-lg shadow-red-900/30 ring-1 ring-amber-400/30">
              <Shield className="w-6 h-6 text-white animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black tracking-tight bg-gradient-to-r from-red-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">
                  SOYAB-PROXY
                </h1>
                <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-mono font-bold px-2 py-0.5 rounded-md flex items-center gap-1">
                  <Lock className="w-3 h-3 text-amber-400" />
                  PASS: NISHU
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono hidden sm:block">
                Multiport Proxy & Key System v2.4
              </p>
            </div>
          </div>

          {/* Nav Tabs */}
          {isAuthenticated && (
            <nav className="hidden md:flex items-center gap-1 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
              {[
                { id: 'dashboard', label: 'Dashboard', icon: Cpu },
                { id: 'runtimes', label: 'Local Runtimes', icon: Layers },
                { id: 'proxyfiles', label: 'Proxy Files', icon: FileJson },
                { id: 'keys', label: 'License Keys', icon: Key },
                { id: 'ports', label: 'Multiports', icon: Wifi },
                { id: 'safety', label: 'MOD Safety', icon: Shield },
                { id: 'patches', label: 'Game Patches', icon: Flame },
                { id: 'miniapp', label: 'MiniApp', icon: Bot },
                { id: 'terminal', label: 'Terminal', icon: Terminal },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 ${
                      isActive
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          )}

          {/* Right Action Controls */}
          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <>
                {/* AI Troubleshooting Assistant */}
                <button
                  onClick={openAiModal}
                  className="hidden sm:flex items-center gap-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-indigo-400/30 shadow-md transition-all"
                >
                  <Bot className="w-3.5 h-3.5 text-indigo-200" />
                  <span>AI Proxy Assistant</span>
                </button>

                {/* Emergency Freeze Toggle Button */}
                <button
                  onClick={toggleGlobalFreeze}
                  className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border transition-all shadow-sm ${
                    modSafety.globalFreeze
                      ? 'bg-red-600 text-white border-red-500 animate-pulse'
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                  }`}
                  title="Toggle Global Safety Freeze"
                >
                  {modSafety.globalFreeze ? (
                    <>
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>SYSTEM FROZEN</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="hidden sm:inline">SAFETY SAFE</span>
                    </>
                  )}
                </button>

                {/* Logout Button */}
                <button
                  onClick={onLogout}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                  title="Logout System"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Navigation Row */}
        {isAuthenticated && (
          <div className="md:hidden flex items-center justify-between overflow-x-auto py-2 border-t border-slate-800/80 gap-1 no-scrollbar">
            {[
              { id: 'dashboard', label: 'Overview', icon: Cpu },
              { id: 'runtimes', label: 'Runtimes', icon: Layers },
              { id: 'proxyfiles', label: 'Proxy Files', icon: FileJson },
              { id: 'keys', label: 'Keys', icon: Key },
              { id: 'ports', label: 'Ports', icon: Wifi },
              { id: 'safety', label: 'Safety', icon: Shield },
              { id: 'patches', label: 'Patches', icon: Flame },
              { id: 'miniapp', label: 'MiniApp', icon: Bot },
              { id: 'terminal', label: 'Terminal', icon: Terminal },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs whitespace-nowrap font-medium ${
                    isActive
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'text-slate-400 hover:text-white bg-slate-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </header>
  );
};
