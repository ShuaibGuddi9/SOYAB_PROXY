import React, { useState, useEffect } from 'react';
import { Server, Download, ShieldCheck, CheckCircle2, Lock, Layers, RefreshCw, Trash2, Play, AlertCircle, FileCode, Search, ShieldAlert, Cpu, Eye, ExternalLink, HardDrive } from 'lucide-react';
import { ServerMasterFile, RuntimeManifest, RuntimeFileEntry } from '../types';

interface RuntimeControlTabProps {
  currentUser: any;
  onLogAction?: (msg: string) => void;
}

export const RuntimeControlTab: React.FC<RuntimeControlTabProps> = ({ currentUser, onLogAction }) => {
  const [masterFiles, setMasterFiles] = useState<ServerMasterFile[]>([]);
  const [runtimes, setRuntimes] = useState<RuntimeManifest[]>([]);
  const [selectedFileIds, setSelectedFileIds] = useState<string[]>(['master-01', 'master-05']);
  const [packageNameInput, setPackageNameInput] = useState('Custom VIP Interceptor Pack');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [isCreating, setIsCreating] = useState(false);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);

  // Expanded manifest viewer
  const [expandedManifestId, setExpandedManifestId] = useState<string | null>(null);

  // Security & Isolation Inspector state
  const [testRuntimeId, setTestRuntimeId] = useState<string>('');
  const [testFileName, setTestFileName] = useState<string>('NitroXMitm.crt');
  const [testResponse, setTestResponse] = useState<any>(null);
  const [isTestingEndpoint, setIsTestingEndpoint] = useState(false);

  // Fetch Master Server Files & Runtimes from backend APIs
  useEffect(() => {
    fetchMasterFiles();
    fetchRuntimes();
  }, [currentUser]);

  const fetchMasterFiles = async () => {
    try {
      const res = await fetch('/api/server/files');
      const data = await res.json();
      if (data.success) {
        setMasterFiles(data.files);
      }
    } catch (err) {
      console.error('Failed to fetch master files:', err);
    }
  };

  const fetchRuntimes = async () => {
    try {
      const userIdParam = currentUser?.key || currentUser?.label || 'NISHU-VIP-8899';
      const res = await fetch(`/api/runtimes?userId=${encodeURIComponent(userIdParam)}`);
      const data = await res.json();
      if (data.success && data.runtimes) {
        setRuntimes(data.runtimes);
        if (data.runtimes.length > 0 && !testRuntimeId) {
          setTestRuntimeId(data.runtimes[0].runtimeId);
        }
      }
    } catch (err) {
      console.error('Failed to fetch runtimes:', err);
    }
  };

  const handleToggleFileSelection = (fileId: string) => {
    setSelectedFileIds(prev =>
      prev.includes(fileId) ? prev.filter(id => id !== fileId) : [...prev, fileId]
    );
  };

  const handleSelectAll = () => {
    if (selectedFileIds.length === masterFiles.length) {
      setSelectedFileIds([]);
    } else {
      setSelectedFileIds(masterFiles.map(f => f.id));
    }
  };

  const handleCreateIsolatedRuntime = async () => {
    if (selectedFileIds.length === 0) {
      alert('Please select at least one master server file for your package.');
      return;
    }

    setIsCreating(true);
    setCreateSuccess(null);

    try {
      const userId = currentUser?.key || currentUser?.label || 'NISHU-VIP-8899';
      const userLabel = currentUser?.label || 'Nishu Master Admin';

      const res = await fetch('/api/runtimes/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          userLabel,
          packageName: packageNameInput.trim() || 'Isolated Package',
          selectedFileIds
        })
      });

      const data = await res.json();
      if (data.success) {
        setCreateSuccess(data.runtime.runtimeId);
        setTestRuntimeId(data.runtime.runtimeId);
        fetchRuntimes();
        if (onLogAction) onLogAction(`Created isolated runtime package ${data.runtime.runtimeId}`);
        setTimeout(() => setCreateSuccess(null), 3000);
      } else {
        alert(data.error || 'Failed to create runtime package.');
      }
    } catch (err) {
      alert('Network error while creating runtime package.');
    } finally {
      setIsCreating(false);
    }
  };

  const handleRuntimeAction = async (runtimeId: string, action: 'activate' | 'deactivate' | 'sync' | 'restart' | 'remove') => {
    try {
      const userId = currentUser?.key || currentUser?.label || 'NISHU-VIP-8899';
      const res = await fetch(`/api/runtimes/${runtimeId}/control`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action })
      });

      const data = await res.json();
      if (data.success) {
        fetchRuntimes();
        if (onLogAction) onLogAction(`Runtime ${runtimeId} action '${action}' completed.`);
      } else {
        alert(data.error || 'Runtime action failed.');
      }
    } catch (err) {
      alert('Failed to send control command to runtime.');
    }
  };

  const handleTestEndpointAccess = async (fileToRequest: string) => {
    if (!testRuntimeId) return;
    setIsTestingEndpoint(true);
    setTestResponse(null);

    try {
      const res = await fetch(`/api/runtimes/${testRuntimeId}/files/${encodeURIComponent(fileToRequest)}`);
      const data = await res.json();
      setTestResponse({ status: res.status, data });
    } catch (err) {
      setTestResponse({ status: 500, error: 'Connection error' });
    } finally {
      setIsTestingEndpoint(false);
    }
  };

  // Filtered master server files
  const filteredMasterFiles = masterFiles.filter(f => {
    const matchesCategory = activeCategory === 'ALL' || f.category === activeCategory;
    const matchesSearch = f.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          f.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950/40 p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-full uppercase">
              Isolated File Runtime System
            </span>
            <span className="text-slate-400 text-xs font-mono">Master Server Storage &bull; Per-User Isolation</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Server className="w-6 h-6 text-indigo-400" />
            <span>Server File Selection & Local Runtime Control</span>
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl font-mono">
            Select specific files from the master server repository to download as an isolated local runtime (<code className="text-amber-400">/runtime/&lt;runtime-id&gt;/</code>). Unselected files remain strictly off-limits.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0 font-mono text-xs">
          <div className="bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-slate-300">
            <span className="text-slate-500 block text-[10px] uppercase">Master Files:</span>
            <span className="text-amber-400 font-bold">{masterFiles.length} Available</span>
          </div>
          <div className="bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-slate-300">
            <span className="text-slate-500 block text-[10px] uppercase">Active Runtimes:</span>
            <span className="text-emerald-400 font-bold">{runtimes.length} Created</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Server File Selection, Right Active Runtimes & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column (6 Cols): Server Master Files Browser & Package Creator */}
        <div className="lg:col-span-6 space-y-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <HardDrive className="w-5 h-5 text-indigo-400" />
                <span>1. Server Master File Selection</span>
              </h3>
              <p className="text-[11px] text-slate-400">Master files stored on server. Select files to build isolated package.</p>
            </div>

            <button
              onClick={handleSelectAll}
              className="text-xs font-mono font-bold text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 border border-indigo-500/30 px-3 py-1 rounded-lg transition-all"
            >
              {selectedFileIds.length === masterFiles.length ? 'Deselect All' : 'Select All'}
            </button>
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search master files..."
                className="w-full bg-slate-950 border border-slate-800 text-white font-mono text-xs rounded-xl pl-9 pr-3 py-2 outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-800 text-[11px] font-mono">
              {['ALL', 'Patches', 'Certs', 'Configs', 'Scripts'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-2.5 py-1 rounded-lg transition-all ${
                    activeCategory === cat ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Master File Selection List */}
          <div className="space-y-2 max-h-[360px] overflow-y-auto pr-1">
            {filteredMasterFiles.map(file => {
              const isSelected = selectedFileIds.includes(file.id);
              return (
                <div
                  key={file.id}
                  onClick={() => handleToggleFileSelection(file.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-indigo-950/40 border-indigo-500/60 shadow-md ring-1 ring-indigo-500/30'
                      : 'bg-slate-950/80 border-slate-800/80 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {}} // handled by div click
                      className="w-4 h-4 rounded text-indigo-500 focus:ring-indigo-500 bg-slate-900 border-slate-700"
                    />

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-xs font-mono">{file.filename}</span>
                        <span className="text-[10px] font-mono bg-slate-900 text-indigo-300 border border-slate-800 px-1.5 py-0.2 rounded">
                          {file.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{file.description}</p>
                    </div>
                  </div>

                  <div className="text-right text-[11px] font-mono text-slate-400">
                    <span className="text-amber-400 font-bold block">{file.patchSize}</span>
                    <span className="text-[10px] text-slate-500">{file.version}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Create Isolated Package Input & Action */}
          <div className="pt-4 border-t border-slate-800 space-y-3">
            <div>
              <label className="block text-slate-300 font-bold uppercase tracking-wider text-[10px] mb-1">
                Isolated Package Name
              </label>
              <input
                type="text"
                value={packageNameInput}
                onChange={(e) => setPackageNameInput(e.target.value)}
                placeholder="e.g. Magic Bullet & Certificate Pack"
                className="w-full bg-slate-950 border border-slate-700 text-amber-300 font-mono text-xs rounded-xl py-2.5 px-3 outline-none focus:border-indigo-500"
              />
            </div>

            <button
              onClick={handleCreateIsolatedRuntime}
              disabled={isCreating || selectedFileIds.length === 0}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-black text-xs py-3 rounded-xl shadow-lg uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
            >
              {isCreating ? (
                <RefreshCw className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download & Create Isolated Local Runtime ({selectedFileIds.length} Selected Files)</span>
                </>
              )}
            </button>

            {createSuccess && (
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-2.5 rounded-xl text-emerald-400 text-xs font-mono flex items-center justify-between">
                <span>Created Runtime ID: {createSuccess}</span>
                <CheckCircle2 className="w-4 h-4" />
              </div>
            )}
          </div>

        </div>

        {/* Right Column (6 Cols): Active Isolated Local Runtimes & Controls */}
        <div className="lg:col-span-6 space-y-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl">
          
          <div className="border-b border-slate-800 pb-3">
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Layers className="w-5 h-5 text-emerald-400" />
              <span>2. Active Isolated Local Runtimes</span>
            </h3>
            <p className="text-[11px] text-slate-400">Control & monitor isolated working copies mapped to your proxy session.</p>
          </div>

          {/* Runtimes Card List */}
          <div className="space-y-4 max-h-[560px] overflow-y-auto pr-1">
            {runtimes.length === 0 ? (
              <div className="p-8 text-center text-slate-500 font-mono text-xs bg-slate-950 rounded-2xl border border-slate-800">
                No active isolated runtimes. Select server files on the left to create a runtime package.
              </div>
            ) : (
              runtimes.map(rt => {
                const isExpanded = expandedManifestId === rt.runtimeId;
                return (
                  <div
                    key={rt.runtimeId}
                    className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4 shadow-lg hover:border-slate-700 transition-all"
                  >
                    
                    {/* Card Top Info */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-900 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-white text-sm">{rt.packageName}</span>
                          <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                            rt.status === 'active'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                              : 'bg-slate-800 text-slate-400 border border-slate-700'
                          }`}>
                            {rt.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 font-mono text-[11px] text-slate-400">
                          <span>Runtime ID: <code className="text-amber-400 font-bold">{rt.runtimeId}</code></span>
                          <span>&bull; Owner: <span className="text-slate-300">{rt.userLabel}</span></span>
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => setExpandedManifestId(isExpanded ? null : rt.runtimeId)}
                          className="flex items-center gap-1 text-[11px] font-mono bg-slate-900 hover:bg-slate-800 text-indigo-300 border border-slate-800 px-2.5 py-1 rounded-lg transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{isExpanded ? 'Hide Manifest' : 'Manifest.json'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Selected Package Files List */}
                    <div className="space-y-1.5 text-xs">
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
                        <span>Package Contents ({rt.files.length} Selected Server Files):</span>
                        <span className="text-emerald-400 font-bold">Sync: {rt.syncStatus.toUpperCase()}</span>
                      </div>

                      <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 space-y-1 font-mono text-[11px]">
                        {rt.files.map((file, fIdx) => (
                          <div key={fIdx} className="flex items-center justify-between text-slate-300 border-b border-slate-800/50 last:border-0 pb-1 last:pb-0">
                            <span className="text-amber-300 font-bold">{file.filename}</span>
                            <span className="text-slate-500 text-[10px]">{file.patchSize} &bull; {file.checksum.substring(0, 16)}...</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Expanded Manifest JSON View */}
                    {isExpanded && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-mono text-indigo-400 uppercase font-bold">
                          Generated /runtime/{rt.runtimeId}/manifest.json
                        </span>
                        <pre className="bg-slate-900 text-indigo-300 p-3 rounded-xl border border-indigo-500/30 font-mono text-[10px] leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto">
                          {JSON.stringify({
                            runtimeId: rt.runtimeId,
                            userId: rt.userId,
                            packageName: rt.packageName,
                            version: rt.version,
                            createdAt: rt.createdAt,
                            status: rt.status,
                            isolatedEndpoint: rt.isolatedEndpointUrl,
                            files: rt.files
                          }, null, 2)}
                        </pre>
                      </div>
                    )}

                    {/* Control Actions Bar */}
                    <div className="pt-2 flex flex-wrap gap-2 border-t border-slate-900">
                      {rt.status === 'active' ? (
                        <button
                          onClick={() => handleRuntimeAction(rt.runtimeId, 'deactivate')}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs px-3 py-1.5 rounded-lg border border-slate-700 transition-all font-bold"
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRuntimeAction(rt.runtimeId, 'activate')}
                          className="bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-mono text-xs px-3 py-1.5 rounded-lg font-bold transition-all"
                        >
                          Activate
                        </button>
                      )}

                      <button
                        onClick={() => handleRuntimeAction(rt.runtimeId, 'sync')}
                        className="bg-slate-900 hover:bg-slate-800 text-indigo-300 border border-slate-800 font-mono text-xs px-3 py-1.5 rounded-lg transition-all flex items-center gap-1"
                      >
                        <RefreshCw className="w-3 h-3" />
                        <span>Sync Server</span>
                      </button>

                      <button
                        onClick={() => handleRuntimeAction(rt.runtimeId, 'restart')}
                        className="bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-800 font-mono text-xs px-3 py-1.5 rounded-lg transition-all flex items-center gap-1"
                      >
                        <Play className="w-3 h-3" />
                        <span>Restart Daemon</span>
                      </button>

                      <button
                        onClick={() => handleRuntimeAction(rt.runtimeId, 'remove')}
                        className="bg-red-950/40 hover:bg-red-900/60 text-red-400 border border-red-500/30 font-mono text-xs px-3 py-1.5 rounded-lg transition-all flex items-center gap-1 ml-auto"
                        title="Deletes local isolated working copy only. Master server files are preserved."
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Remove Local Copy</span>
                      </button>
                    </div>

                  </div>
                );
              })
            )}
          </div>

        </div>

      </div>

      {/* Security Isolation & Endpoint Inspector Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-amber-400" />
              <span>3. Runtime Isolation & Path Traversal Security Inspector</span>
            </h3>
            <p className="text-[11px] text-slate-400">
              Verify that isolated runtimes allow access ONLY to selected package files and reject unauthorized escaping or path traversal attempts.
            </p>
          </div>

          <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono text-[10px] font-bold px-3 py-1 rounded-full">
            ISOLATION ENGINE ACTIVE
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          
          {/* Controls */}
          <div className="md:col-span-5 space-y-3 text-xs font-mono">
            <div>
              <label className="block text-slate-400 mb-1 uppercase text-[10px]">Select Runtime ID</label>
              <select
                value={testRuntimeId}
                onChange={(e) => setTestRuntimeId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-amber-400 rounded-xl p-2.5 outline-none font-bold"
              >
                {runtimes.map(r => (
                  <option key={r.runtimeId} value={r.runtimeId}>
                    {r.runtimeId} ({r.packageName})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="block text-slate-400 uppercase text-[10px]">Test Access Scenarios</label>
              <div className="space-y-1.5">
                <button
                  onClick={() => handleTestEndpointAccess('local_config.json')}
                  disabled={isTestingEndpoint}
                  className="w-full text-left bg-slate-950 hover:bg-slate-800 text-indigo-300 border border-slate-800 p-2.5 rounded-xl text-xs transition-all flex items-center justify-between"
                >
                  <span>1. SOYAB Local Server Binding (local_config.json)</span>
                  <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                </button>

                <button
                  onClick={() => handleTestEndpointAccess('NitroXMitm.crt')}
                  disabled={isTestingEndpoint}
                  className="w-full text-left bg-slate-950 hover:bg-slate-800 text-emerald-400 border border-slate-800 p-2.5 rounded-xl text-xs transition-all flex items-center justify-between"
                >
                  <span>2. Valid Selected File (NitroXMitm.crt)</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </button>

                <button
                  onClick={() => handleTestEndpointAccess('../master_files/secret')}
                  disabled={isTestingEndpoint}
                  className="w-full text-left bg-slate-950 hover:bg-slate-800 text-red-400 border border-slate-800 p-2.5 rounded-xl text-xs transition-all flex items-center justify-between"
                >
                  <span>3. Path Traversal Attempt (../master_files)</span>
                  <Lock className="w-4 h-4 text-red-400" />
                </button>

                <button
                  onClick={() => handleTestEndpointAccess('unauthorized_unselected_file.bin')}
                  disabled={isTestingEndpoint}
                  className="w-full text-left bg-slate-950 hover:bg-slate-800 text-amber-400 border border-slate-800 p-2.5 rounded-xl text-xs transition-all flex items-center justify-between"
                >
                  <span>4. Unselected File Outside Package</span>
                  <AlertCircle className="w-4 h-4 text-amber-400" />
                </button>
              </div>
            </div>
          </div>

          {/* Response Viewer */}
          <div className="md:col-span-7 bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs space-y-2 flex flex-col justify-between">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-slate-400">
                Endpoint: <code className="text-amber-300">GET /api/runtimes/{testRuntimeId || '<runtimeId>'}/files/...</code>
              </span>
              {isTestingEndpoint && <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin" />}
            </div>

            {testResponse ? (
              <pre className={`p-3 rounded-lg border whitespace-pre-wrap leading-relaxed text-[11px] overflow-x-auto ${
                testResponse.status === 200
                  ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40'
                  : 'bg-red-950/40 text-red-300 border-red-500/40'
              }`}>
                {JSON.stringify(testResponse, null, 2)}
              </pre>
            ) : (
              <div className="text-slate-600 text-[11px] text-center py-6">
                Click a test scenario button on the left to test local runtime isolated endpoint access.
              </div>
            )}

            <div className="text-[10px] text-slate-500 flex justify-between pt-1">
              <span>Security Policy: RFC-9110 Path Normalization</span>
              <span>Ownership Isolation: ENFORCED</span>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
};
