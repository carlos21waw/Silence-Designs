import React, { useState } from 'react';
import { useBotData } from '../../context/BotDataContext';
import { Giveaway } from '../../types';
import {
  Gift,
  Trophy,
  Users,
  Clock,
  RotateCcw,
  XCircle,
  Plus,
  X
} from 'lucide-react';

export const GiveawaysView: React.FC = () => {
  const {
    giveaways,
    drawGiveawayWinner,
    rerollGiveaway,
    cancelGiveaway,
    createGiveaway
  } = useBotData();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [prize, setPrize] = useState('');
  const [sponsor, setSponsor] = useState('');
  const [serverName, setServerName] = useState('');
  const [serverInvite, setServerInvite] = useState('');
  const [winnersCount, setWinnersCount] = useState(1);
  const [isSponsored, setIsSponsored] = useState(true);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!prize || !sponsor) return;

    createGiveaway({
      prize,
      sponsor,
      serverName: serverName || sponsor,
      serverInvite,
      winnersCount: Number(winnersCount),
      isSponsored
    });

    setShowCreateModal(false);
    setPrize('');
    setSponsor('');
    setServerName('');
    setServerInvite('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111622] border border-[#232D3F] p-5 rounded-xl">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Gift className="w-5 h-5 text-rose-400" />
            Interactive Server Giveaways
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Real interactive giveaway engine with buttons, fair random winner selection, and sponsor disclosures.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors self-start sm:self-auto shadow-md"
        >
          <Plus className="w-4 h-4" />
          Create New Giveaway
        </button>
      </div>

      {/* Giveaways List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {giveaways.map(gw => (
          <div
            key={gw.id}
            className="bg-[#111622] border border-[#232D3F] rounded-xl p-5 space-y-4 hover:border-[#33425a] transition-all"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  gw.status === 'active'
                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                    : 'bg-slate-800 text-slate-400'
                }`}>
                  {gw.status.toUpperCase()}
                </span>
                <h3 className="text-sm font-bold text-white mt-1.5">{gw.prize}</h3>
              </div>

              {gw.status === 'active' ? (
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => drawGiveawayWinner(gw.id)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold flex items-center gap-1"
                  >
                    <Trophy className="w-3.5 h-3.5" />
                    Draw Winner
                  </button>
                  <button
                    onClick={() => cancelGiveaway(gw.id)}
                    className="p-1.5 bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 rounded"
                    title="Cancel Giveaway"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => rerollGiveaway(gw.id)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold flex items-center gap-1"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reroll
                </button>
              )}
            </div>

            {/* Sponsor Disclosure Note */}
            {gw.isSponsored && (
              <div className="p-2.5 rounded-lg bg-[#0B0E14] border border-[#1f2838] text-[11px] text-slate-300">
                📢 <span className="font-semibold">Sponsor:</span> {gw.sponsor}
                <div className="text-[10px] text-slate-400 mt-0.5">
                  "This giveaway is independently hosted and sponsored by {gw.sponsor}. It is not sponsored by Silence Designs."
                </div>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2.5 bg-[#0B0E14] border border-[#1f2838] p-3 rounded-lg text-xs">
              <div>
                <span className="text-[10px] text-slate-400 block">Entries</span>
                <span className="font-mono font-bold text-white text-sm">{gw.entries.length}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Winners</span>
                <span className="font-mono font-bold text-white text-sm">{gw.winnersCount}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 block">Status</span>
                <span className="font-medium text-slate-200 capitalize">{gw.status}</span>
              </div>
            </div>

            {/* Winners Banner */}
            {gw.winners.length > 0 && (
              <div className="p-3 rounded-lg bg-emerald-950/50 border border-emerald-800 text-xs text-emerald-300 space-y-1">
                <div className="font-bold flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5" />
                  Selected Winners:
                </div>
                <div className="font-mono">{gw.winners.map(w => `@${w}`).join(', ')}</div>
              </div>
            )}

            {/* Participants Pill Strip */}
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Recent Participants ({gw.entries.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {gw.entries.slice(0, 8).map((entry, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] bg-[#0B0E14] border border-[#232D3F] text-slate-300 px-2 py-0.5 rounded"
                  >
                    @{entry}
                  </span>
                ))}
                {gw.entries.length > 8 && (
                  <span className="text-[11px] text-slate-400 self-center">
                    +{gw.entries.length - 8} more
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Create Giveaway Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111622] border border-[#232D3F] w-full max-w-md rounded-xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#232D3F] pb-3">
              <h3 className="text-sm font-bold text-white">Create Server Giveaway</h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Prize *</label>
                <input
                  type="text"
                  required
                  value={prize}
                  onChange={e => setPrize(e.target.value)}
                  placeholder="e.g. 1 Month Discord Nitro"
                  className="w-full bg-[#0B0E14] border border-[#232D3F] rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Sponsor *</label>
                <input
                  type="text"
                  required
                  value={sponsor}
                  onChange={e => setSponsor(e.target.value)}
                  placeholder="e.g. Liberty City Highway Patrol"
                  className="w-full bg-[#0B0E14] border border-[#232D3F] rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Number of Winners</label>
                  <input
                    type="number"
                    min={1}
                    value={winnersCount}
                    onChange={e => setWinnersCount(Number(e.target.value))}
                    className="w-full bg-[#0B0E14] border border-[#232D3F] rounded px-3 py-2 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Server Invite Link</label>
                  <input
                    type="text"
                    value={serverInvite}
                    onChange={e => setServerInvite(e.target.value)}
                    placeholder="https://discord.gg/..."
                    className="w-full bg-[#0B0E14] border border-[#232D3F] rounded px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3.5 py-1.5 bg-slate-800 text-slate-300 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded font-semibold"
                >
                  Publish Giveaway
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
