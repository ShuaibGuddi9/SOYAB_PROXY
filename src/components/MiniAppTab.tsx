import React, { useState } from 'react';
import { Bot, Smartphone, CheckCircle2, Shield, Key, BookOpen, ExternalLink, RefreshCw, AlertCircle } from 'lucide-react';

interface MiniAppTabProps {
  onVerifyKey: (key: string) => void;
}

export const MiniAppTab: React.FC<MiniAppTabProps> = ({ onVerifyKey }) => {
  const [activeSubTab, setActiveSubTab] = useState<'app' | 'tutorial'>('app');
  const [testKeyInput, setTestKeyInput] = useState('NISHU-VIP-8899');
  const [testResult, setTestResult] = useState<any>(null);
  const [testing, setTesting] = useState(false);

  const handleTestKey = () => {
    if (!testKeyInput.trim()) return;
    setTesting(true);
    setTimeout(() => {
      const cleanKey = testKeyInput.trim().toUpperCase();
      if (cleanKey === 'NISHU' || cleanKey.includes('NISHU') || cleanKey.includes('SOYAB')) {
        setTestResult({
          status: 'SUCCESS',
          message: 'KEY VERIFIED (MASTER NISHU ACCESS)',
          hwid: 'HWID-OK-8899',
          expiry: '2027-08-31',
          allowedPatches: ['Magic Bullet', 'Antenna hand', 'Body 90%', 'Drag only']
        });
      } else {
        setTestResult({
          status: 'SUCCESS',
          message: 'KEY VALIDATED OK',
          hwid: 'HWID-CLIENT-001',
          expiry: '2026-09-30',
          allowedPatches: ['Magic Bullet']
        });
      }
      setTesting(false);
    }, 600);
  };

  return (
    <div className="space-y-6">
      
      {/* Subtab navigation */}
      <div className="flex items-center justify-between bg-slate-900 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5 text-amber-400" />
          <h2 className="text-xl font-black text-white">SOYAB Web MiniApp & Setup Tutorial</h2>
        </div>

        <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-medium">
          <button
            onClick={() => setActiveSubTab('app')}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeSubTab === 'app' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>MiniApp Client</span>
          </button>
          <button
            onClick={() => setActiveSubTab('tutorial')}
            className={`px-3.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all ${
              activeSubTab === 'tutorial' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Setup Tutorial</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'app' ? (
        /* Embedded MiniApp Simulator View */
        <div className="flex justify-center">
          <div className="w-full max-w-sm bg-slate-950 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-5 text-white">
            
            {/* Header */}
            <div className="text-center space-y-1 border-b border-slate-800 pb-4">
              <div className="inline-block bg-gradient-to-r from-red-600 to-amber-500 p-3 rounded-2xl shadow-lg mb-1">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-black tracking-wider uppercase">SOYAB-PROXY MINIAPP</h3>
              <p className="text-[11px] text-amber-400 font-mono">Client Key Verification Panel</p>
            </div>

            {/* Form */}
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1 uppercase tracking-wider text-[10px]">
                  Enter License Key / Pass
                </label>
                <input
                  type="text"
                  value={testKeyInput}
                  onChange={(e) => setTestKeyInput(e.target.value)}
                  placeholder="e.g. NISHU"
                  className="w-full bg-slate-900 border border-slate-700 text-amber-400 font-mono font-bold text-center rounded-xl py-3 px-3 outline-none focus:border-amber-500"
                />
              </div>

              <button
                onClick={handleTestKey}
                disabled={testing}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black py-3 rounded-xl shadow-lg uppercase tracking-wider flex items-center justify-center gap-2"
              >
                {testing ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Key className="w-4 h-4" />
                    <span>CONNECT & VALIDATE KEY</span>
                  </>
                )}
              </button>
            </div>

            {/* Results Box */}
            {testResult && (
              <div className="bg-slate-900 p-4 rounded-2xl border border-emerald-500/30 text-xs space-y-2 font-mono">
                <div className="flex items-center justify-between text-emerald-400 font-bold">
                  <span>{testResult.message}</span>
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div className="text-[11px] text-slate-400 space-y-1">
                  <div className="flex justify-between">
                    <span>HWID Lock:</span>
                    <span className="text-slate-200">{testResult.hwid}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Expiry:</span>
                    <span className="text-slate-200">{testResult.expiry}</span>
                  </div>
                </div>
                <div className="pt-1">
                  <span className="text-slate-500 text-[10px] uppercase block mb-1">Active Patches:</span>
                  <div className="flex flex-wrap gap-1">
                    {testResult.allowedPatches.map((p: string) => (
                      <span key={p} className="bg-purple-500/20 text-purple-300 px-1.5 py-0.5 rounded text-[10px]">
                        {p}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div className="text-center pt-2">
              <span className="text-[10px] text-slate-500 font-mono">
                SOYAB-PROXY Client Daemon v2.4 Connected
              </span>
            </div>
          </div>
        </div>
      ) : (
        /* Setup Tutorial View (SOYAB-PROXY/SOYAB/chanbomaydi_system/miniapp/tutorial.html) */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 text-slate-300 text-xs">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-lg font-bold text-white">SOYAB-PROXY Client Setup Tutorial</h3>
            <p className="text-slate-400 text-xs mt-0.5">Step-by-step guide to connect Wi-Fi proxy and install NitroXMitm SSL certificate.</p>
          </div>

          <div className="space-y-4 leading-relaxed">
            
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="font-bold text-amber-400 text-sm block">Step 1: Obtain License Key / Password</span>
              <p>
                Get your allocated license key or use master password <code className="text-amber-400 font-bold font-mono">NISHU</code> in the SOYAB-PROXY key panel.
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="font-bold text-amber-400 text-sm block">Step 2: Configure Device Wi-Fi Proxy</span>
              <p>Go to Android/iOS Wi-Fi Settings &rarr; Modify Network &rarr; Set Proxy to Manual:</p>
              <ul className="list-disc list-inside font-mono text-slate-400 space-y-1">
                <li>Host / IP: <span className="text-white font-bold">Your VPS IP (or localhost)</span></li>
                <li>Port: <span className="text-white font-bold">8080</span> (HTTP/MITM Interceptor)</li>
              </ul>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="font-bold text-amber-400 text-sm block">Step 3: Download & Install NitroXMitm.crt</span>
              <p>
                Download <span className="text-amber-400 font-bold">NitroXMitm.crt</span> from the Multiports tab. Go to Device Security &rarr; Install CA Certificate &rarr; Select NitroXMitm.crt and name it "SOYAB PROXY".
              </p>
            </div>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <span className="font-bold text-amber-400 text-sm block">Step 4: Launch Game with Proxy Active</span>
              <p>
                Open the game. SOYAB-PROXY will automatically detect incoming packets and inject selected patches (Magic Bullet / Antenna hand).
              </p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
