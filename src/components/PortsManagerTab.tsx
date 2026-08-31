import React, { useState } from 'react';
import { Wifi, Server, Plus, ShieldCheck, Download, Trash2, CheckCircle2, RefreshCw, AlertCircle, FileCode } from 'lucide-react';
import { ProxyPort, AllowedIP } from '../types';
import { CERTIFICATE_INFO } from '../data/initialData';

interface PortsManagerTabProps {
  ports: ProxyPort[];
  allowedIps: AllowedIP[];
  onAddPort: (portData: Partial<ProxyPort>) => void;
  onAddIp: (ip: string, notes: string) => void;
  onDeleteIp: (id: string) => void;
  onRestartPorts: () => void;
}

export const PortsManagerTab: React.FC<PortsManagerTabProps> = ({
  ports,
  allowedIps,
  onAddPort,
  onAddIp,
  onDeleteIp,
  onRestartPorts
}) => {
  const [showAddPort, setShowAddPort] = useState(false);
  const [newPortNum, setNewPortNum] = useState('');
  const [newProtocol, setNewProtocol] = useState('TCP/RAW');
  const [newDesc, setNewDesc] = useState('');

  const [newIpStr, setNewIpStr] = useState('');
  const [newIpNotes, setNewIpNotes] = useState('');

  const [downloadCertSuccess, setDownloadCertSuccess] = useState(false);

  const handleAddPortSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPortNum) return;
    onAddPort({
      port: Number(newPortNum),
      protocol: newProtocol,
      description: newDesc || 'Custom Proxy Listener Port'
    });
    setNewPortNum('');
    setNewDesc('');
    setShowAddPort(false);
  };

  const handleAddIpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newIpStr.trim()) return;
    onAddIp(newIpStr.trim(), newIpNotes.trim() || 'Whitelisted Client IP');
    setNewIpStr('');
    setNewIpNotes('');
  };

  const handleDownloadCert = () => {
    const blob = new Blob([CERTIFICATE_INFO.pemContent], { type: 'application/x-x509-ca-cert' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = CERTIFICATE_INFO.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadCertSuccess(true);
    setTimeout(() => setDownloadCertSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Ports Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Wifi className="w-5 h-5 text-blue-400" />
            <h2 className="text-xl font-black text-white">Multiport Proxy & Tunnel Manager</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure multi-port proxy daemons (8080/8081/8888/9090) & Whitelisted IP Access Rules
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onRestartPorts}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold px-3.5 py-2.5 rounded-xl border border-slate-700 transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-400" />
            <span>Restart Ports (fix_ports.sh)</span>
          </button>
          <button
            onClick={() => setShowAddPort(true)}
            className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Add Proxy Port</span>
          </button>
        </div>
      </div>

      {/* Ports Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {ports.map((p) => (
          <div key={p.port} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-black text-white font-mono">{p.port}</span>
              <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ONLINE
              </span>
            </div>

            <div>
              <div className="text-xs font-bold text-blue-400 font-mono uppercase">{p.protocol}</div>
              <p className="text-xs text-slate-400 mt-1 line-clamp-2">{p.description}</p>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono text-slate-300">
              <div>
                <span className="text-slate-500 text-[10px] uppercase block">Connections</span>
                <span className="font-bold text-white">{p.connections} Active</span>
              </div>
              <div className="text-right">
                <span className="text-slate-500 text-[10px] uppercase block">Bandwidth</span>
                <span className="font-bold text-slate-300">{p.bandwidthMb} MB</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Certificate Section & IP Whitelist Split */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* NitroXMitm Certificate Manager */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <FileCode className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-white text-base">HTTPS Interceptor SSL CA Certificate</h3>
            </div>
            <span className="text-xs font-mono text-amber-400 font-bold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
              {CERTIFICATE_INFO.name}
            </span>
          </div>

          <div className="space-y-3 text-xs text-slate-300">
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2 font-mono text-[11px]">
              <div className="flex justify-between">
                <span className="text-slate-500">Issuer:</span>
                <span className="text-white font-bold">{CERTIFICATE_INFO.issuer}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Encryption:</span>
                <span className="text-amber-400">{CERTIFICATE_INFO.algorithm}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Fingerprint:</span>
                <span className="text-slate-400 truncate max-w-[200px]">{CERTIFICATE_INFO.fingerprint}</span>
              </div>
            </div>

            <p className="text-slate-400 leading-relaxed text-[11px]">
              To intercept HTTPS game packets on target Android/iOS devices, download <span className="text-amber-400 font-bold">NitroXMitm.crt</span> and install it under <span className="text-slate-200">User Credentials / Trusted CA certificates</span>.
            </p>

            <button
              onClick={handleDownloadCert}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold py-2.5 px-4 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 text-xs"
            >
              {downloadCertSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-slate-950" />
                  <span>NitroXMitm.crt Downloaded Successfully!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download NitroXMitm.crt Certificate</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Whitelisted Client IPs (allowed_ips.json) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-white text-base">Whitelisted Client IPs (allowed_ips.json)</h3>
            </div>
            <span className="text-xs text-slate-400 font-mono">{allowedIps.length} Approved IPs</span>
          </div>

          <form onSubmit={handleAddIpSubmit} className="flex gap-2">
            <input
              type="text"
              value={newIpStr}
              onChange={(e) => setNewIpStr(e.target.value)}
              placeholder="Enter IP (e.g. 103.21.244.1)"
              className="flex-1 bg-slate-950 border border-slate-800 focus:border-emerald-500 text-white font-mono text-xs rounded-xl px-3 py-2 outline-none"
              required
            />
            <input
              type="text"
              value={newIpNotes}
              onChange={(e) => setNewIpNotes(e.target.value)}
              placeholder="Notes..."
              className="w-32 bg-slate-950 border border-slate-800 text-white text-xs rounded-xl px-3 py-2 outline-none"
            />
            <button
              type="submit"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs px-3.5 py-2 rounded-xl transition-all"
            >
              Add IP
            </button>
          </form>

          <div className="space-y-2 max-h-56 overflow-y-auto font-mono text-xs">
            {allowedIps.map((ipItem) => (
              <div key={ipItem.id} className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-emerald-400">{ipItem.ip}</span>
                    <span className="text-[10px] text-slate-500">{ipItem.addedAt}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-sans mt-0.5">{ipItem.notes}</p>
                </div>
                <button
                  onClick={() => onDeleteIp(ipItem.id)}
                  className="p-1.5 hover:bg-slate-800 text-slate-500 hover:text-red-400 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Add Port Modal */}
      {showAddPort && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-lg font-bold text-white">Add New Proxy Port</h3>
              <button onClick={() => setShowAddPort(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddPortSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">Port Number *</label>
                <input
                  type="number"
                  value={newPortNum}
                  onChange={(e) => setNewPortNum(e.target.value)}
                  placeholder="e.g. 8082"
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-2.5 font-mono outline-none focus:border-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Protocol Type</label>
                <select
                  value={newProtocol}
                  onChange={(e) => setNewProtocol(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-2.5 font-mono outline-none"
                >
                  <option value="HTTP/MITM">HTTP / MITM Packet Mod</option>
                  <option value="HTTPS/TLS">HTTPS / TLS Cert Secure</option>
                  <option value="TCP/RAW">TCP / RAW Game Sync</option>
                  <option value="REST/AUTH">REST / License Auth</option>
                  <option value="UDP/STREAM">UDP / Stream Tunnel</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Description</label>
                <input
                  type="text"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="e.g. Secondary Antenna Hand Port"
                  className="w-full bg-slate-950 border border-slate-800 text-white rounded-xl px-3 py-2.5 outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddPort(false)}
                  className="bg-slate-800 text-slate-300 px-4 py-2 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-5 py-2 rounded-xl font-bold shadow-lg"
                >
                  Add Listener
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
