import React, { useState } from 'react';
import { Terminal, Play, Trash2, CheckCircle2, RefreshCw } from 'lucide-react';

export const TerminalTab: React.FC = () => {
  const [inputCmd, setInputCmd] = useState('');
  const [terminalHistory, setTerminalHistory] = useState<Array<{ cmd: string; output: string; time: string }>>([
    {
      cmd: 'bash check_logs.sh',
      output: `[SOYAB-PROXY LOG INSPECTOR]\n[04:09:42] [INFO] Proxy Core listening on 0.0.0.0:8080 (HTTP), 8081 (HTTPS), 8888 (TCP)\n[04:09:42] [SUCCESS] Master Key 'NISHU-VIP-8899' validated (Password NISHU verified)\n[04:09:42] [SAFETY] MOD Anti-Ban AES-256 header encryption status: OPERATIONAL`,
      time: new Date().toLocaleTimeString()
    }
  ]);
  const [executing, setExecuting] = useState(false);

  const runCommand = async (commandStr: string) => {
    if (!commandStr.trim()) return;

    setExecuting(true);
    const time = new Date().toLocaleTimeString();

    try {
      const res = await fetch('/api/exec', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: commandStr.trim() })
      });
      const data = await res.json();

      setTerminalHistory(prev => [
        ...prev,
        { cmd: commandStr.trim(), output: data.output || 'Done', time }
      ]);
    } catch (err) {
      setTerminalHistory(prev => [
        ...prev,
        { cmd: commandStr.trim(), output: `[ERROR] Command failed to execute: ${commandStr}`, time }
      ]);
    } finally {
      setExecuting(false);
      setInputCmd('');
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    runCommand(inputCmd);
  };

  const clearTerminal = () => {
    setTerminalHistory([]);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-black text-white">SOYAB-PROXY System Shell Terminal</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Execute server control shell scripts (<code className="text-amber-400">check_logs.sh</code>, <code className="text-amber-400">fix_ports.sh</code>, <code className="text-amber-400">proxy.py</code>)
          </p>
        </div>

        <button
          onClick={clearTerminal}
          className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold px-3 py-2 rounded-xl border border-slate-700 transition-all"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear Terminal</span>
        </button>
      </div>

      {/* Preset Command Buttons */}
      <div className="flex flex-wrap gap-2">
        {[
          { label: 'check_logs.sh', cmd: 'bash check_logs.sh' },
          { label: 'fix_ports.sh', cmd: 'bash fix_ports.sh' },
          { label: 'manage_ports.sh', cmd: 'bash manage_ports.sh' },
          { label: 'python3 proxy.py', cmd: 'python3 proxy.py' },
          { label: 'vps_install.sh', cmd: 'bash vps_install.sh' },
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => runCommand(item.cmd)}
            disabled={executing}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-amber-500/20 text-amber-400 border border-slate-800 hover:border-amber-500/40 font-mono text-xs px-3 py-1.5 rounded-xl transition-all"
          >
            <Play className="w-3 h-3 text-amber-400" />
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Terminal Screen Container */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 shadow-2xl font-mono text-xs text-slate-200 space-y-4 min-h-[400px] flex flex-col justify-between">
        
        {/* Output Area */}
        <div className="space-y-4 overflow-y-auto max-h-[500px] pr-2">
          <div className="text-slate-500 border-b border-slate-800/80 pb-2">
            SOYAB-PROXY Linux Kernel Environment [x86_64]. Password access: NISHU
          </div>

          {terminalHistory.map((entry, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center gap-2 text-amber-400">
                <span className="text-slate-500">[{entry.time}]</span>
                <span className="text-emerald-400">root@soyab-proxy:~#</span>
                <span className="font-bold">{entry.cmd}</span>
              </div>
              <pre className="text-slate-300 bg-slate-900/80 p-3 rounded-xl border border-slate-800/80 whitespace-pre-wrap leading-relaxed text-[11px]">
                {entry.output}
              </pre>
            </div>
          ))}

          {executing && (
            <div className="flex items-center gap-2 text-amber-400 animate-pulse">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Executing command...</span>
            </div>
          )}
        </div>

        {/* Input Form */}
        <form onSubmit={handleFormSubmit} className="pt-3 border-t border-slate-800/80 flex items-center gap-2">
          <span className="text-emerald-400 font-bold shrink-0">root@soyab-proxy:~#</span>
          <input
            type="text"
            value={inputCmd}
            onChange={(e) => setInputCmd(e.target.value)}
            placeholder="Type command (e.g. bash check_logs.sh)"
            className="flex-1 bg-transparent text-white font-mono text-xs outline-none"
          />
          <button
            type="submit"
            disabled={executing}
            className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs px-3.5 py-1.5 rounded-lg transition-all"
          >
            Run
          </button>
        </form>
      </div>

    </div>
  );
};
