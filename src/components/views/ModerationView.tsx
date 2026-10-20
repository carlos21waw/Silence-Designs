import React, { useState } from 'react';
import { useBotData } from '../../context/BotDataContext';
import { ModerationCase } from '../../types';
import {
  ShieldAlert,
  Search,
  Filter,
  UserX,
  VolumeX,
  AlertTriangle,
  RotateCcw,
  CheckCircle,
  Plus,
  X
} from 'lucide-react';

export const ModerationView: React.FC = () => {
  const { moderationLogs, addModerationCase, clearWarning } = useBotData();
  const [showActionModal, setShowActionModal] = useState(false);
  const [targetUser, setTargetUser] = useState('');
  const [actionType, setActionType] = useState<ModerationCase['action']>('warn');
  const [reason, setReason] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredLogs = moderationLogs.filter(log =>
    log.targetUser.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.reason.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.moderator.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleIssueAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetUser || !reason) return;

    addModerationCase(
      actionType,
      targetUser,
      `${Math.floor(100000000000000000 + Math.random() * 900000000000000000)}`,
      reason,
      'Carlos473'
    );

    setShowActionModal(false);
    setTargetUser('');
    setReason('');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111622] border border-[#232D3F] p-5 rounded-xl">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-400" />
            Moderation & Audit Cases
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Log formal infractions, Discord timeouts, kicks, bans, and warning history with audit logging.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search user, reason..."
              className="bg-[#0B0E14] border border-[#232D3F] text-slate-200 text-xs pl-8 pr-3 py-1.5 rounded-lg focus:outline-none focus:border-blue-500 w-48"
            />
          </div>

          <button
            onClick={() => setShowActionModal(true)}
            className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shadow"
          >
            <Plus className="w-4 h-4" /> Issue Sanction
          </button>
        </div>
      </div>

      {/* Moderation Cases Table */}
      <div className="bg-[#111622] border border-[#232D3F] rounded-xl overflow-hidden">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#0B0E14] text-slate-400 font-semibold border-b border-[#232D3F]">
            <tr>
              <th className="p-3.5">Case #</th>
              <th className="p-3.5">Target Member</th>
              <th className="p-3.5">Sanction Action</th>
              <th className="p-3.5">Reason & Evidence</th>
              <th className="p-3.5">Staff Moderator</th>
              <th className="p-3.5">Timestamp</th>
              <th className="p-3.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1f2838]">
            {filteredLogs.map(item => (
              <tr key={item.id} className="hover:bg-[#161D2D] transition-colors">
                <td className="p-3.5 font-mono font-bold text-slate-300">#{item.caseNumber}</td>
                <td className="p-3.5 text-white font-medium">
                  {item.targetUser}
                  <div className="text-[10px] text-slate-500 font-mono">{item.targetUserId}</div>
                </td>
                <td className="p-3.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    item.action === 'ban' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                    item.action === 'kick' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                    item.action === 'mute' ? 'bg-purple-950 text-purple-400 border border-purple-800' :
                    'bg-slate-800 text-slate-300'
                  }`}>
                    {item.action}
                  </span>
                </td>
                <td className="p-3.5 text-slate-200 max-w-sm">
                  {item.reason}
                  {item.details && <div className="text-[11px] text-slate-400">{item.details}</div>}
                </td>
                <td className="p-3.5 text-slate-300 font-medium">@{item.moderator}</td>
                <td className="p-3.5 text-slate-400 font-mono text-[11px]">
                  {new Date(item.timestamp).toLocaleString()}
                </td>
                <td className="p-3.5 text-right">
                  {item.action === 'warn' && (
                    <button
                      onClick={() => clearWarning(item.targetUserId, item.id)}
                      className="text-xs text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1 justify-end"
                      title="Clear Warning"
                    >
                      <RotateCcw className="w-3 h-3" /> Clear
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Issue Sanction Modal */}
      {showActionModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111622] border border-[#232D3F] w-full max-w-md rounded-xl p-5 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#232D3F] pb-3">
              <h3 className="text-sm font-bold text-white">Issue Moderation Sanction</h3>
              <button onClick={() => setShowActionModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleIssueAction} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Target Member *</label>
                <input
                  type="text"
                  required
                  value={targetUser}
                  onChange={e => setTargetUser(e.target.value)}
                  placeholder="e.g. RogueUser#9901 or Discord ID"
                  className="w-full bg-[#0B0E14] border border-[#232D3F] rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Sanction Action *</label>
                <select
                  value={actionType}
                  onChange={e => setActionType(e.target.value as any)}
                  className="w-full bg-[#0B0E14] border border-[#232D3F] rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="warn">Warn (Formal Infraction)</option>
                  <option value="mute">Mute (Native Discord Timeout)</option>
                  <option value="kick">Kick (Remove from server)</option>
                  <option value="ban">Ban (Permanent Removal)</option>
                  <option value="lock">Lock Channel</option>
                  <option value="unlock">Unlock Channel</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Reason *</label>
                <textarea
                  required
                  rows={3}
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  placeholder="Cite violated rule or ticket conduct standard..."
                  className="w-full bg-[#0B0E14] border border-[#232D3F] rounded px-3 py-2 text-white focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowActionModal(false)}
                  className="px-3.5 py-1.5 bg-slate-800 text-slate-300 rounded font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded font-semibold"
                >
                  Execute Sanction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
