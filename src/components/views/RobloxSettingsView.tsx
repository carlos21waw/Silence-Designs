import React, { useState } from 'react';
import { useBotData } from '../../context/BotDataContext';
import { ASSETS } from '../../data/assets';
import { generateProjectZip } from '../../utils/projectExport';
import {
  Settings,
  Users,
  ExternalLink,
  Code2,
  Download,
  Plus,
  Trash2,
  Server,
  RefreshCw,
  Check,
  Shield,
  Activity
} from 'lucide-react';

export const RobloxSettingsView: React.FC = () => {
  const {
    settings,
    updateSettings,
    activities,
    toggleActivity,
    addActivity,
    deleteActivity,
    hostedBots,
    renewBotHosting
  } = useBotData();

  const [newActivityText, setNewActivityText] = useState('');
  const [newActivityType, setNewActivityType] = useState<'Playing' | 'Watching' | 'Listening'>('Playing');
  const [isExporting, setIsExporting] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  const handleAddActivity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivityText.trim()) return;
    addActivity(newActivityText.trim(), newActivityType);
    setNewActivityText('');
  };

  const handleDownloadZip = async () => {
    try {
      setIsExporting(true);
      const zipBlob = await generateProjectZip();
      const url = URL.createObjectURL(zipBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'silence-designs-bot.zip';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to export project ZIP:', err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Self-Host Downloader */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-[#111622] via-[#161D2D] to-[#111622] border border-[#232D3F] p-5 rounded-xl shadow-lg">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-400" />
              Roblox Integration & Self-Hosting Hub
            </h2>
            <span className="text-[10px] bg-blue-900/60 text-blue-300 border border-blue-700/60 px-2 py-0.5 rounded font-mono font-semibold">
              v1.0.0
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Download the complete source code, configure Roblox community linking, and manage rotating bot presence.
          </p>
        </div>

        <button
          onClick={handleDownloadZip}
          disabled={isExporting}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-semibold flex items-center gap-2 shadow-lg transition-all shrink-0 disabled:opacity-50"
        >
          {isExporting ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : exportSuccess ? (
            <Check className="w-4 h-4 text-emerald-300" />
          ) : (
            <Download className="w-4 h-4" />
          )}
          <span>{isExporting ? 'Packaging ZIP...' : exportSuccess ? 'Downloaded ZIP!' : 'Download Complete Project (.ZIP)'}</span>
        </button>
      </div>

      {/* Roblox Group Integration Card */}
      <div className="bg-[#111622] border border-[#232D3F] rounded-xl p-5 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <img
              src={ASSETS.robloxGroupBadge}
              alt="ILE Customs"
              className="w-14 h-14 rounded-xl border border-[#232D3F] object-cover"
              referrerPolicy="no-referrer"
            />
            <div>
              <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">
                Linked Community Group
              </span>
              <h3 className="text-sm font-bold text-white">{settings.robloxGroupName}</h3>
              <div className="text-xs text-slate-400 mt-0.5">
                Group ID: <span className="font-mono text-slate-200">{settings.robloxGroupId}</span> • Owner: <span className="text-slate-200 font-semibold">{settings.robloxGroupOwner}</span>
              </div>
            </div>
          </div>

          <a
            href={`https://www.roblox.com/communities/${settings.robloxGroupId}`}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 bg-[#0B0E14] hover:bg-[#161D2D] border border-[#232D3F] text-slate-300 rounded text-xs flex items-center gap-1.5"
          >
            Roblox Group <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 bg-[#0B0E14] border border-[#1f2838] p-3.5 rounded-lg text-xs">
          <div>
            <span className="text-[10px] text-slate-400 block">Verified Members</span>
            <span className="font-mono font-bold text-white text-sm">
              {settings.robloxGroupMemberCount.toLocaleString()}
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Created On</span>
            <span className="font-medium text-slate-200">{settings.robloxGroupCreated}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">API State</span>
            <span className="text-emerald-400 font-semibold flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Connected
            </span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Sync Frequency</span>
            <span className="text-slate-200 font-medium">Every 5 minutes</span>
          </div>
        </div>
      </div>

      {/* Developer & Creator Profile */}
      <div className="bg-[#111622] border border-[#232D3F] rounded-xl p-5 space-y-3 text-xs">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <Code2 className="w-4 h-4 text-blue-400" />
          Bot Developer & Creator Credits (/about)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-[#0B0E14] border border-[#1f2838] p-3.5 rounded-lg">
          <div>
            <span className="text-[10px] text-slate-400 block">Creator</span>
            <span className="font-bold text-white text-sm">Carlos473</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">Bot Developer / Creator</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Discord User ID</span>
            <span className="font-mono font-bold text-blue-400 text-sm">1025813762684502168</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">Official Silence Designs Lead</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 block">Project Scope</span>
            <span className="text-slate-200 font-medium text-sm">Silence Designs Core</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">50+ Commands • Full ER:LC Suite</span>
          </div>
        </div>
      </div>

      {/* Bot Hosting Management (/manage hosting) */}
      <div className="bg-[#111622] border border-[#232D3F] rounded-xl p-5 space-y-4 text-xs">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-400" />
              Bot Hosting Subscriptions (/manage hosting)
            </h3>
            <p className="text-slate-400 text-xs mt-0.5">
              First 30 days after a bot order are free. Renewals: Monthly R$250, Quarterly R$500, Bi-Annually R$900.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hostedBots.map(bot => (
            <div
              key={bot.id}
              className="bg-[#0B0E14] border border-[#1f2838] p-4 rounded-lg space-y-3"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-white text-sm">{bot.botName}</h4>
                  <span className="font-mono text-slate-400 text-[11px]">ID: {bot.botId}</span>
                </div>
                <span className="px-2 py-0.5 bg-emerald-950 text-emerald-400 border border-emerald-800 rounded font-semibold text-[10px] uppercase">
                  {bot.status}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-300">
                <div>Owner: <span className="text-white font-medium">{bot.ownerTag}</span></div>
                <div>Plan: <span className="text-blue-400 font-medium">{bot.plan}</span></div>
                <div>Days Remaining: <span className="font-mono text-emerald-400 font-bold">{bot.daysRemaining} days</span></div>
                <div>Renewal: <span className="font-mono text-slate-200">{bot.renewalDate}</span></div>
              </div>

              <div className="pt-2 border-t border-[#1f2838] flex items-center justify-between">
                <button
                  onClick={() => renewBotHosting(bot.id, 'Monthly (30 Days)')}
                  className="px-3 py-1 bg-blue-600 hover:bg-blue-500 text-white rounded font-medium text-xs"
                >
                  Renew Plan (30 Days)
                </button>
                <span className="text-[10px] text-slate-400">99.9% Uptime Guarantee</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 30-Second Activity Presence Rotation Manager */}
      <div className="bg-[#111622] border border-[#232D3F] rounded-xl p-5 space-y-4 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-blue-400" />
              Rotating Activity Status Engine
            </h3>
            <p className="text-slate-400 text-xs mt-0.5">
              Cycles through enabled activity messages every 30 seconds across Discord (up to 100 configured statuses).
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400 font-semibold bg-[#0B0E14] px-2.5 py-1 rounded border border-[#232D3F]">
            {activities.filter(a => a.enabled).length} Active Rotations
          </span>
        </div>

        {/* Add New Activity */}
        <form onSubmit={handleAddActivity} className="flex gap-2">
          <select
            value={newActivityType}
            onChange={e => setNewActivityType(e.target.value as any)}
            className="bg-[#0B0E14] border border-[#232D3F] text-slate-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
          >
            <option value="Playing">Playing</option>
            <option value="Watching">Watching</option>
            <option value="Listening">Listening</option>
          </select>
          <input
            type="text"
            value={newActivityText}
            onChange={e => setNewActivityText(e.target.value)}
            placeholder="Add new presence message, e.g. 🎨 Crafting custom ER:LC liveries..."
            className="flex-1 bg-[#0B0E14] border border-[#232D3F] text-slate-200 rounded px-3 py-2 text-xs focus:outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded font-semibold flex items-center gap-1 shrink-0"
          >
            <Plus className="w-3.5 h-3.5" /> Add
          </button>
        </form>

        {/* Activities List */}
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {activities.map(act => (
            <div
              key={act.id}
              className="bg-[#0B0E14] border border-[#1f2838] p-3 rounded-lg flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <input
                  type="checkbox"
                  checked={act.enabled}
                  onChange={() => toggleActivity(act.id)}
                  className="rounded border-[#232D3F] bg-[#161D2D] text-blue-600 cursor-pointer"
                />
                <span className="font-mono text-[10px] text-blue-400 font-bold uppercase">
                  {act.type}
                </span>
                <span className={`text-xs ${act.enabled ? 'text-slate-200 font-medium' : 'text-slate-500 line-through'}`}>
                  {act.text}
                </span>
              </div>

              <button
                onClick={() => deleteActivity(act.id)}
                className="text-slate-500 hover:text-rose-400 p-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
