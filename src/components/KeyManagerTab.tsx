import React, { useState } from 'react';
import { Key, Plus, Search, Filter, Copy, Check, Lock, Unlock, RefreshCw, Trash2, Smartphone, Shield, Calendar, ChevronLeft, ChevronRight, AlertCircle } from 'lucide-react';
import { LicenseKey } from '../types';

interface KeyManagerTabProps {
  licenseKeys: LicenseKey[];
  onAddKey: (keyData: Partial<LicenseKey>) => void;
  onToggleFreeze: (keyId: string) => void;
  onDeleteKey: (keyId: string) => void;
}

export const KeyManagerTab: React.FC<KeyManagerTabProps> = ({
  licenseKeys,
  onAddKey,
  onToggleFreeze,
  onDeleteKey
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Create Key Form State
  const [newLabel, setNewLabel] = useState('');
  const [customKeyName, setCustomKeyName] = useState('');
  const [durationHours, setDurationHours] = useState('720'); // 30 days
  const [maxDevices, setMaxDevices] = useState('1');
  const [notes, setNotes] = useState('');
  const [selectedPatches, setSelectedPatches] = useState<string[]>(['Magic Bullet', 'Antenna hand']);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  // Filtering & Pagination Logic
  const filteredKeys = licenseKeys.filter(k => {
    const matchesSearch = k.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
      k.userLabel.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (k.notes && k.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = statusFilter === 'all' || k.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredKeys.length / itemsPerPage) || 1;
  const paginatedKeys = filteredKeys.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLabel.trim()) return;

    onAddKey({
      key: customKeyName.trim() || undefined,
      userLabel: newLabel.trim(),
      durationHours: Number(durationHours) || 720,
      maxDevices: Number(maxDevices) || 1,
      patchAccess: selectedPatches,
      notes: notes.trim()
    });

    setNewLabel('');
    setCustomKeyName('');
    setNotes('');
    setShowCreateModal(false);
  };

  const togglePatchSelection = (patchName: string) => {
    setSelectedPatches(prev => 
      prev.includes(patchName) ? prev.filter(p => p !== patchName) : [...prev, patchName]
    );
  };

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-black text-white">License Key & User Manager</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage subscriber keys, HWID locks, and duration expiry. Master access password: <span className="font-mono text-amber-400 font-bold">NISHU</span>
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Generate New License Key</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            placeholder="Search key, user label, or notes..."
            className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-white font-mono text-xs rounded-xl pl-10 pr-4 py-2.5 outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="bg-slate-950 border border-slate-800 focus:border-amber-500 text-slate-200 font-mono text-xs rounded-xl px-3 py-2.5 outline-none"
          >
            <option value="all">All Statuses ({licenseKeys.length})</option>
            <option value="active">Active Only</option>
            <option value="frozen">Frozen Only</option>
            <option value="expired">Expired Only</option>
          </select>
        </div>
      </div>

      {/* Keys Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">License Key</th>
                <th className="p-4">User Label</th>
                <th className="p-4">Devices</th>
                <th className="p-4">Status</th>
                <th className="p-4">Expiry Date</th>
                <th className="p-4">Patches</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {paginatedKeys.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-500">
                    No license keys match your search criteria.
                  </td>
                </tr>
              ) : (
                paginatedKeys.map((keyItem) => {
                  const isMasterKey = keyItem.key.includes('NISHU');
                  return (
                    <tr key={keyItem.id} className={`hover:bg-slate-800/40 transition-colors ${isMasterKey ? 'bg-amber-950/10' : ''}`}>
                      
                      {/* Key String */}
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-amber-400 text-xs">{keyItem.key}</span>
                          <button
                            onClick={() => handleCopy(keyItem.key, keyItem.id)}
                            className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white transition-colors"
                            title="Copy Key String"
                          >
                            {copiedKey === keyItem.id ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                        {isMasterKey && (
                          <span className="inline-block mt-0.5 text-[9px] bg-amber-500/20 text-amber-300 px-1.5 py-0.2 rounded font-sans font-bold">
                            MASTER KEY (PASS: NISHU)
                          </span>
                        )}
                      </td>

                      {/* User Label */}
                      <td className="p-4 font-sans font-medium text-white">
                        {keyItem.userLabel}
                        {keyItem.notes && <p className="text-[10px] text-slate-400 font-mono truncate max-w-[150px]">{keyItem.notes}</p>}
                      </td>

                      {/* Devices */}
                      <td className="p-4">
                        <div className="flex items-center gap-1.5 text-slate-300">
                          <Smartphone className="w-3.5 h-3.5 text-slate-500" />
                          <span>{keyItem.activeDevices} / {keyItem.maxDevices}</span>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-0.5 rounded-md border ${
                          keyItem.status === 'active'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : keyItem.status === 'frozen'
                            ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                            : 'bg-red-500/10 text-red-400 border-red-500/30'
                        }`}>
                          {keyItem.status === 'active' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                          {keyItem.status.toUpperCase()}
                        </span>
                      </td>

                      {/* Expiry */}
                      <td className="p-4 text-slate-400 text-[11px]">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          <span>{new Date(keyItem.expiresAt).toLocaleDateString()}</span>
                        </div>
                      </td>

                      {/* Patches */}
                      <td className="p-4 font-sans text-[11px]">
                        <div className="flex flex-wrap gap-1">
                          {keyItem.patchAccess.slice(0, 2).map((p, idx) => (
                            <span key={idx} className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded text-[10px]">
                              {p}
                            </span>
                          ))}
                          {keyItem.patchAccess.length > 2 && (
                            <span className="text-slate-500 text-[10px]">+{keyItem.patchAccess.length - 2}</span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="p-4 text-right space-x-1">
                        <button
                          onClick={() => onToggleFreeze(keyItem.id)}
                          className={`p-1.5 rounded-lg border text-xs font-bold transition-all ${
                            keyItem.status === 'frozen'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/30 hover:bg-amber-500/20'
                          }`}
                          title={keyItem.status === 'frozen' ? 'Unfreeze Key' : 'Freeze Key'}
                        >
                          {keyItem.status === 'frozen' ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                        </button>
                        
                        <button
                          onClick={() => onDeleteKey(keyItem.id)}
                          className="p-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg transition-colors"
                          title="Delete Key"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar (Implementing keys_pagination_patch) */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-mono">
          <div>
            Showing Page <span className="text-white font-bold">{currentPage}</span> of <span className="text-white font-bold">{totalPages}</span> ({filteredKeys.length} keys total)
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 bg-slate-900 border border-slate-800 rounded-lg disabled:opacity-40 hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2 font-bold text-amber-400">{currentPage}</span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 bg-slate-900 border border-slate-800 rounded-lg disabled:opacity-40 hover:bg-slate-800 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Create Key Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Key className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-bold text-white">Generate New SOYAB-PROXY License Key</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-slate-400 hover:text-white text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-bold mb-1">User / Client Label *</label>
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="e.g. VIP_Nishu_User_01"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-white rounded-xl px-3 py-2.5 outline-none font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Custom Key String (Optional)</label>
                <input
                  type="text"
                  value={customKeyName}
                  onChange={(e) => setCustomKeyName(e.target.value)}
                  placeholder="Auto-generated if left blank (e.g. NISHU-PRO-xxxx)"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-white rounded-xl px-3 py-2.5 outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-bold mb-1">Duration (Hours)</label>
                  <select
                    value={durationHours}
                    onChange={(e) => setDurationHours(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-white rounded-xl px-3 py-2.5 outline-none font-mono"
                  >
                    <option value="24">24 Hours (1 Day)</option>
                    <option value="168">168 Hours (7 Days)</option>
                    <option value="720">720 Hours (30 Days)</option>
                    <option value="4380">4380 Hours (6 Months)</option>
                    <option value="8760">8760 Hours (1 Year)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-bold mb-1">Max HWID Devices</label>
                  <input
                    type="number"
                    value={maxDevices}
                    onChange={(e) => setMaxDevices(e.target.value)}
                    min="1"
                    max="10"
                    className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-white rounded-xl px-3 py-2.5 outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Allowed Game Patches</label>
                <div className="grid grid-cols-2 gap-2 pt-1">
                  {['Magic Bullet', 'Antenna hand', 'Body 90%', 'Drag only', 'Drag with Antenna'].map((p) => (
                    <label key={p} className="flex items-center gap-2 bg-slate-950 p-2 rounded-lg border border-slate-800 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedPatches.includes(p)}
                        onChange={() => togglePatchSelection(p)}
                        className="accent-amber-500 rounded"
                      />
                      <span className="text-slate-200">{p}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-bold mb-1">Notes / Owner Info</label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Master Nishu Key for Android client"
                  className="w-full bg-slate-950 border border-slate-800 focus:border-amber-500 text-white rounded-xl px-3 py-2.5 outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2.5 rounded-xl font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-5 py-2.5 rounded-xl font-bold shadow-lg"
                >
                  Create License Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
