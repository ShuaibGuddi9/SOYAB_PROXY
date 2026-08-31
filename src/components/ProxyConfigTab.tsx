import React, { useState, useEffect } from 'react';
import { Settings, FileJson, RefreshCw, CheckCircle2, Copy, Send, Server, ShieldCheck, Globe, Database, ToggleLeft, ToggleRight, Play, AlertCircle } from 'lucide-react';

interface ProxyConfigTabProps {
  onLogAction?: (msg: string) => void;
}

export const ProxyConfigTab: React.FC<ProxyConfigTabProps> = ({ onLogAction }) => {
  // Config state containing user's exact example: {"verAddr": "https://version.astutech.online/", "resetGuest": true}
  const [verAddr, setVerAddr] = useState('https://version.astutech.online/');
  const [resetGuest, setResetGuest] = useState(true);
  const [patchVersion, setPatchVersion] = useState('3.5.0');
  const [cdnHost, setCdnHost] = useState('https://cdn.astutech.online/');
  const [bypassAntiCheat, setBypassAntiCheat] = useState(true);
  
  // Selected file view
  const [activeFile, setActiveFile] = useState<'version.json' | 'config.json' | 'guest_control.json' | 'proxy_routes.json'>('version.json');
  
  // Custom raw JSON text editor state
  const [jsonText, setJsonText] = useState('');
  const [jsonError, setJsonError] = useState<string | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);

  // Simulated live endpoint test output
  const [testResponse, setTestResponse] = useState<any>(null);
  const [isTesting, setIsTesting] = useState(false);

  // Synchronize JSON code editor whenever controls change
  useEffect(() => {
    if (activeFile === 'version.json') {
      const payload = {
        verAddr: verAddr,
        resetGuest: resetGuest,
        minVersion: patchVersion,
        cdnHost: cdnHost,
        bypassAntiCheat: bypassAntiCheat,
        status: 'OPERATIONAL',
        lastUpdated: new Date().toISOString()
      };
      setJsonText(JSON.stringify(payload, null, 2));
    } else if (activeFile === 'config.json') {
      const payload = {
        proxyName: 'SOYAB-PROXY-CORE',
        listenPorts: [8080, 8081, 8888, 9090],
        verAddr: verAddr,
        authPassword: 'NISHU',
        sslCert: 'NitroXMitm.crt',
        maxConcurrentClients: 500
      };
      setJsonText(JSON.stringify(payload, null, 2));
    } else if (activeFile === 'guest_control.json') {
      const payload = {
        resetGuest: resetGuest,
        clearDeviceHWID: true,
        autoBypassGuestBan: true,
        guestTokenFlushIntervalMs: 60000
      };
      setJsonText(JSON.stringify(payload, null, 2));
    } else if (activeFile === 'proxy_routes.json') {
      const payload = {
        versionRedirectUrl: verAddr,
        targetHost: 'game.astutech.online',
        routes: [
          { endpoint: '/version', action: 'INTERCEPT_AND_OVERRIDE' },
          { endpoint: '/guest_login', action: resetGuest ? 'RESET_GUEST_ID' : 'PASS_THROUGH' },
          { endpoint: '/patch_data', action: 'INJECT_SOYAB_CACHE' }
        ]
      };
      setJsonText(JSON.stringify(payload, null, 2));
    }
  }, [activeFile, verAddr, resetGuest, patchVersion, cdnHost, bypassAntiCheat]);

  const handleSaveAndDeploy = async () => {
    try {
      // Validate JSON syntax
      const parsed = JSON.parse(jsonText);
      setJsonError(null);

      // If version.json is parsed, update state variables
      if (parsed.verAddr !== undefined) setVerAddr(parsed.verAddr);
      if (parsed.resetGuest !== undefined) setResetGuest(Boolean(parsed.resetGuest));

      // Call backend API to persist
      await fetch('/api/proxy/version.json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: jsonText
      });

      setIsSaved(true);
      if (onLogAction) onLogAction(`Deployed updated ${activeFile} with verAddr: ${parsed.verAddr || verAddr}`);
      setTimeout(() => setIsSaved(false), 2500);
    } catch (err: any) {
      setJsonError(err.message || 'Invalid JSON syntax');
    }
  };

  const handleLoadExample = () => {
    const examplePayload = {
      verAddr: "https://version.astutech.online/",
      resetGuest: true,
      status: "OPERATIONAL",
      author: "NISHU-SOYAB-PROXY"
    };
    setVerAddr("https://version.astutech.online/");
    setResetGuest(true);
    setJsonText(JSON.stringify(examplePayload, null, 2));
    setJsonError(null);
  };

  const handleCopyJson = () => {
    navigator.clipboard.writeText(jsonText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTestEndpoint = async () => {
    setIsTesting(true);
    setTestResponse(null);
    try {
      const res = await fetch('/api/proxy/version.json');
      const data = await res.json();
      setTestResponse(data);
    } catch (err) {
      // Fallback preview if server is initializing
      setTestResponse({
        verAddr: verAddr,
        resetGuest: resetGuest,
        minVersion: patchVersion,
        cdnHost: cdnHost,
        bypassAntiCheat: bypassAntiCheat,
        status: 'OPERATIONAL'
      });
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-500/10 text-amber-400 border border-amber-500/30 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase">
              Proxy Files Control Panel
            </span>
            <span className="text-slate-400 text-xs font-mono">Master Pass: NISHU</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <FileJson className="w-6 h-6 text-amber-400" />
            <span>Proxy Version & JSON Intercept Files</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl font-mono">
            Control incoming game client version redirects (<code className="text-amber-400 font-bold">verAddr</code>), guest account flushes (<code className="text-amber-400 font-bold">resetGuest</code>), and server payload overrides.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={() => {
              setVerAddr("http://127.0.0.1:8080/api/proxy/");
              setResetGuest(true);
            }}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs px-3.5 py-2.5 rounded-xl transition-all font-bold shadow-md flex items-center gap-1.5"
            title="Inject your own SOYAB Local Proxy Server URL"
          >
            <Server className="w-4 h-4 text-indigo-200" />
            <span>SOYAB Local Server</span>
          </button>
          <button
            onClick={handleLoadExample}
            className="bg-slate-800 hover:bg-slate-700 text-amber-400 font-mono text-xs px-3 py-2.5 rounded-xl border border-slate-700 transition-all font-bold"
            title="Load external target server example"
          >
            External Target Example
          </button>
          <button
            onClick={handleSaveAndDeploy}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs px-4 py-2.5 rounded-xl shadow-lg uppercase tracking-wider flex items-center gap-1.5"
          >
            {isSaved ? <CheckCircle2 className="w-4 h-4 text-slate-950" /> : <Send className="w-4 h-4" />}
            <span>{isSaved ? 'DEPLOYED!' : 'SAVE & DEPLOY'}</span>
          </button>
        </div>
      </div>

      {/* Main Control Grid: Visual Form Controls + Raw JSON Code Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (5 Cols): GUI Form Controls */}
        <div className="lg:col-span-5 space-y-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 className="font-bold text-white text-base flex items-center gap-2 border-b border-slate-800 pb-3">
            <Settings className="w-5 h-5 text-amber-400" />
            <span>Proxy Parameter Settings</span>
          </h3>

          <div className="space-y-4 text-xs">
            
            {/* Version Address (verAddr) */}
            <div className="space-y-1.5">
              <label className="block text-slate-300 font-bold uppercase tracking-wider text-[11px] flex items-center justify-between">
                <span>Version Address (<code className="text-amber-400 lowercase">verAddr</code>)</span>
                <Globe className="w-3.5 h-3.5 text-amber-400" />
              </label>
              <input
                type="text"
                value={verAddr}
                onChange={(e) => setVerAddr(e.target.value)}
                placeholder="https://version.astutech.online/"
                className="w-full bg-slate-950 border border-slate-700 text-amber-300 font-mono font-bold rounded-xl py-2.5 px-3 outline-none focus:border-amber-500 text-xs"
              />
              <p className="text-[11px] text-slate-400 font-mono">
                Target server redirect URL served to proxy clients upon version handshake.
              </p>
            </div>

            {/* Reset Guest Toggle (resetGuest) */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-bold text-white uppercase tracking-wider text-[11px] block">
                    Reset Guest (<code className="text-amber-400 lowercase">resetGuest</code>)
                  </span>
                  <span className="text-[11px] text-slate-400 font-mono">
                    Automatically reset guest ID upon game launch
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setResetGuest(!resetGuest)}
                  className={`text-2xl transition-all ${resetGuest ? 'text-emerald-400' : 'text-slate-600'}`}
                >
                  {resetGuest ? (
                    <span className="bg-emerald-500/20 text-emerald-400 font-bold px-3 py-1 rounded-lg border border-emerald-500/40 text-xs font-mono">
                      TRUE
                    </span>
                  ) : (
                    <span className="bg-slate-800 text-slate-400 font-bold px-3 py-1 rounded-lg border border-slate-700 text-xs font-mono">
                      FALSE
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Patch Version */}
            <div className="space-y-1.5">
              <label className="block text-slate-300 font-bold uppercase tracking-wider text-[11px]">
                Target Minimum Game Version
              </label>
              <input
                type="text"
                value={patchVersion}
                onChange={(e) => setPatchVersion(e.target.value)}
                placeholder="e.g. 3.5.0"
                className="w-full bg-slate-950 border border-slate-700 text-white font-mono rounded-xl py-2 px-3 outline-none focus:border-amber-500 text-xs"
              />
            </div>

            {/* CDN Host URL */}
            <div className="space-y-1.5">
              <label className="block text-slate-300 font-bold uppercase tracking-wider text-[11px]">
                CDN Resource Host (<code className="text-amber-400 lowercase">cdnHost</code>)
              </label>
              <input
                type="text"
                value={cdnHost}
                onChange={(e) => setCdnHost(e.target.value)}
                placeholder="https://cdn.astutech.online/"
                className="w-full bg-slate-950 border border-slate-700 text-purple-300 font-mono rounded-xl py-2 px-3 outline-none focus:border-amber-500 text-xs"
              />
            </div>

            {/* Bypass AntiCheat Checkbox */}
            <div className="flex items-center justify-between bg-slate-950 p-3 rounded-xl border border-slate-800">
              <span className="font-bold text-slate-200 text-xs">Inject Anti-Cheat Header Bypass</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={bypassAntiCheat}
                  onChange={(e) => setBypassAntiCheat(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
              </label>
            </div>

          </div>
        </div>

        {/* Right Column (7 Cols): File Tabs & Live Raw JSON Editor */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4 flex flex-col justify-between">
          
          <div className="space-y-4">
            
            {/* File Switcher Tabs */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex flex-wrap gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
                {[
                  { id: 'version.json', label: 'version.json' },
                  { id: 'config.json', label: 'config.json' },
                  { id: 'guest_control.json', label: 'guest_control.json' },
                  { id: 'proxy_routes.json', label: 'proxy_routes.json' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setActiveFile(f.id as any)}
                    className={`px-3 py-1.5 rounded-lg font-mono text-xs font-bold transition-all ${
                      activeFile === f.id
                        ? 'bg-amber-500 text-slate-950 shadow-md'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              <button
                onClick={handleCopyJson}
                className="flex items-center gap-1 text-slate-400 hover:text-amber-400 text-xs font-mono p-1.5 rounded-lg bg-slate-950 border border-slate-800"
                title="Copy JSON Payload"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            {/* Raw Code Editor Box */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                <span className="text-amber-400 font-bold">Active Proxy File: /etc/soyab_proxy/{activeFile}</span>
                <span>Format: JSON</span>
              </div>

              <textarea
                value={jsonText}
                onChange={(e) => {
                  setJsonText(e.target.value);
                  setJsonError(null);
                }}
                rows={10}
                className="w-full bg-slate-950 text-amber-300 font-mono text-xs p-4 rounded-xl border border-slate-800 outline-none focus:border-amber-500 leading-relaxed resize-none shadow-inner"
                spellCheck={false}
              />

              {jsonError && (
                <div className="flex items-center gap-2 text-red-400 text-xs font-mono bg-red-950/40 p-2.5 rounded-lg border border-red-500/30">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>Syntax Error: {jsonError}</span>
                </div>
              )}
            </div>

            {/* Test Proxy Response Simulator */}
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Play className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-bold text-white font-mono">Test Intercept Endpoint (GET /api/proxy/version.json)</span>
                </div>

                <button
                  onClick={handleTestEndpoint}
                  disabled={isTesting}
                  className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs px-3 py-1 rounded-lg transition-all flex items-center gap-1 font-mono"
                >
                  <RefreshCw className={`w-3 h-3 ${isTesting ? 'animate-spin' : ''}`} />
                  <span>Send Test GET</span>
                </button>
              </div>

              {testResponse && (
                <pre className="bg-slate-900 p-3 rounded-lg border border-emerald-500/30 font-mono text-[11px] text-emerald-300 whitespace-pre-wrap">
                  {JSON.stringify(testResponse, null, 2)}
                </pre>
              )}
            </div>

          </div>

          <div className="pt-2 border-t border-slate-800 text-[11px] font-mono text-slate-500 flex justify-between">
            <span>SOYAB-PROXY JSON Control Engine</span>
            <span>Master Key: NISHU</span>
          </div>

        </div>

      </div>

    </div>
  );
};
