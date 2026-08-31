import React, { useState } from 'react';
import { Flame, Download, CheckCircle2, ShieldAlert, Cpu, Layers, FileCode, Play, Info } from 'lucide-react';
import { GamePatch } from '../types';

interface GamePatchesTabProps {
  patches: GamePatch[];
}

export const GamePatchesTab: React.FC<GamePatchesTabProps> = ({ patches }) => {
  const [activePatch, setActivePatch] = useState<GamePatch>(patches[0]);
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  const handleDownloadPatch = (patch: GamePatch) => {
    // Generate simulated patch cache file
    const patchContent = `[SOYAB-PROXY GAME PATCH BINARY - ${patch.name}]\n` +
      `Folder: ${patch.folderName}\n` +
      `Filename: ${patch.filename}\n` +
      `Size: ${patch.patchSize}\n` +
      `Signature: SOYAB-PROXY-VERIFIED-AES256\n` +
      `Timestamp: ${new Date().toISOString()}\n\n` +
      `[CACHE_DATA_STREAM]\n` +
      `00 4F 8A 2C 9E 11 77 DB 40 9A 88 FE 33 01 BC 90\n` +
      `NISHU_VIP_PATCH_VALIDATED_OK`;

    const blob = new Blob([patchContent], { type: 'application/octet-stream' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = patch.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccess(patch.id);
    setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 p-5 rounded-2xl border border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-purple-400" />
            <h2 className="text-xl font-black text-white">SOYAB Game Patches & Cache Files</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Download game patches & MITM cache files (<code className="text-amber-400">cache_res...~3D</code>) for direct proxy routing
          </p>
        </div>
      </div>

      {/* Main Grid: Left List, Right Detail Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Patch Cards List */}
        <div className="lg:col-span-1 space-y-3">
          {patches.map((patch) => {
            const isSelected = activePatch.id === patch.id;
            return (
              <div
                key={patch.id}
                onClick={() => setActivePatch(patch)}
                className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-slate-900 border-amber-500 shadow-lg shadow-amber-500/10 ring-1 ring-amber-500/30'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{patch.name}</span>
                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded ${
                    patch.riskLevel === 'LOW'
                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  }`}>
                    {patch.riskLevel} RISK
                  </span>
                </div>

                <div className="flex items-center gap-2 mt-2 text-xs font-mono text-slate-400">
                  <span className="bg-slate-950 px-2 py-0.5 rounded border border-slate-800 text-purple-300">
                    {patch.patchSize}
                  </span>
                  <span>{patch.activeUsers} Active Users</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Patch Detail & Download View */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black text-white">{activePatch.name}</span>
                <span className="text-xs font-mono bg-purple-500/10 text-purple-300 border border-purple-500/30 px-2 py-0.5 rounded">
                  Folder: {activePatch.folderName}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Resource File: <span className="text-amber-400 font-bold">{activePatch.filename}</span>
              </p>
            </div>

            <button
              onClick={() => handleDownloadPatch(activePatch)}
              className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-bold text-xs px-5 py-3 rounded-xl shadow-lg transition-all"
            >
              {downloadSuccess === activePatch.id ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-slate-950" />
                  <span>Patch File Downloaded!</span>
                </>
              ) : (
                <>
                  <Download className="w-4 h-4" />
                  <span>Download Cache Binary ({activePatch.patchSize})</span>
                </>
              )}
            </button>
          </div>

          <div className="space-y-4 text-xs text-slate-300">
            <div>
              <h4 className="font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-1.5 text-xs">
                <Info className="w-4 h-4 text-purple-400" />
                <span>Patch Functionality Overview</span>
              </h4>
              <p className="bg-slate-950 p-4 rounded-xl border border-slate-800 leading-relaxed text-slate-300">
                {activePatch.description}
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white uppercase tracking-wider mb-1 flex items-center gap-1.5 text-xs">
                <Play className="w-4 h-4 text-amber-400" />
                <span>Installation & Routing Instructions</span>
              </h4>
              <pre className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-slate-300 whitespace-pre-wrap leading-relaxed text-[11px]">
                {activePatch.instructions}
              </pre>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-xl flex items-start gap-3 text-amber-300">
              <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5 text-amber-400" />
              <div>
                <span className="font-bold block">Proxy Route Integration Note:</span>
                <p className="text-[11px] text-amber-200/80 mt-0.5">
                  When SOYAB-PROXY Port 8080 is enabled, this patch will automatically intercept and inject the cache stream into the game packet without requiring root access.
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
