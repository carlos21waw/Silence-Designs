import React, { useState } from 'react';
import { useBotData } from '../../context/BotDataContext';
import { Advertisement } from '../../types';
import {
  Megaphone,
  CheckCircle,
  XCircle,
  Send,
  Calendar,
  ExternalLink,
  ShieldAlert,
  AlertCircle
} from 'lucide-react';

export const MarketplaceView: React.FC = () => {
  const { advertisements, approveAd, rejectAd, publishAd, settings } = useBotData();
  const [rejectReasonModal, setRejectReasonModal] = useState<string | null>(null);
  const [rejectText, setRejectText] = useState('Server does not meet the 100-member minimum established community rule.');

  const handleConfirmReject = (adId: string) => {
    rejectAd(adId, rejectText);
    setRejectReasonModal(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111622] border border-[#232D3F] p-5 rounded-xl">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Megaphone className="w-5 h-5 text-blue-400" />
            Marketplace & Paid Advertising Queue
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage advertising queue, ping permission limits, sponsor disclosures, and the official Marketplace Rulebook.
          </p>
        </div>
      </div>

      {/* Pricing Matrix */}
      <div className="bg-[#111622] border border-[#232D3F] rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-white">Configured Marketplace Pricing</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="bg-[#0B0E14] border border-[#1f2838] p-3 rounded-lg text-xs">
            <div className="text-slate-400">No Ping</div>
            <div className="text-lg font-mono font-bold text-white mt-1">150 {settings.currency}</div>
            <div className="text-[10px] text-slate-400 mt-1">Silent post</div>
          </div>
          <div className="bg-[#0B0E14] border border-[#1f2838] p-3 rounded-lg text-xs">
            <div className="text-slate-400">Here Ping</div>
            <div className="text-lg font-mono font-bold text-white mt-1">350 {settings.currency}</div>
            <div className="text-[10px] text-slate-400 mt-1">@here notification</div>
          </div>
          <div className="bg-[#0B0E14] border border-[#1f2838] p-3 rounded-lg text-xs">
            <div className="text-slate-400">Everyone Ping</div>
            <div className="text-lg font-mono font-bold text-white mt-1">600 {settings.currency}</div>
            <div className="text-[10px] text-slate-400 mt-1">@everyone broadcast</div>
          </div>
          <div className="bg-[#0B0E14] border border-[#1f2838] p-3 rounded-lg text-xs">
            <div className="text-slate-400">Your Own Channel</div>
            <div className="text-lg font-mono font-bold text-white mt-1">800 {settings.currency}</div>
            <div className="text-[10px] text-slate-400 mt-1">1 month duration</div>
          </div>
          <div className="bg-[#0B0E14] border border-[#1f2838] p-3 rounded-lg text-xs">
            <div className="text-slate-400">Priority Add-on</div>
            <div className="text-lg font-mono font-bold text-amber-400 mt-1">400 {settings.currency}</div>
            <div className="text-[10px] text-slate-400 mt-1">Queue advance</div>
          </div>
          <div className="bg-[#0B0E14] border border-[#1f2838] p-3 rounded-lg text-xs">
            <div className="text-slate-400">Sponsored Giveaway</div>
            <div className="text-lg font-mono font-bold text-rose-400 mt-1">200 {settings.currency}</div>
            <div className="text-[10px] text-slate-400 mt-1">Prize funded by sponsor</div>
          </div>
        </div>
      </div>

      {/* Advertising Queue Table */}
      <div className="bg-[#111622] border border-[#232D3F] rounded-xl overflow-hidden">
        <div className="p-4 border-b border-[#232D3F] bg-[#141b2a] flex items-center justify-between">
          <h3 className="text-sm font-bold text-white">Active Queue Submissions</h3>
          <span className="text-xs text-slate-400 font-mono">
            {advertisements.length} Total Submissions
          </span>
        </div>

        <div className="divide-y divide-[#1f2838]">
          {advertisements.map(ad => (
            <div key={ad.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs">
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm text-white">{ad.title}</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    ad.status === 'published' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                    ad.status === 'approved' ? 'bg-blue-950 text-blue-400 border border-blue-800' :
                    ad.status === 'rejected' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                    'bg-amber-950 text-amber-400 border border-amber-800'
                  }`}>
                    {ad.status}
                  </span>
                  <span className="text-slate-400 font-mono">Slot #{ad.queuePosition}</span>
                </div>

                <p className="text-slate-300 leading-relaxed">{ad.promotion}</p>

                <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 pt-1">
                  <span>Server: <span className="text-slate-200">{ad.serverName}</span></span>
                  <span>·</span>
                  <span>Ping: <span className="text-blue-400 uppercase font-semibold">{ad.pingType.replace('_', ' ')}</span></span>
                  <span>·</span>
                  <span>Cost: <span className="font-mono text-emerald-400 font-semibold">{ad.cost} {ad.currency}</span></span>
                  <span>·</span>
                  <span>Submitter: @{ad.submittedBy}</span>
                </div>

                {ad.notes && (
                  <div className="text-[11px] text-amber-300 bg-amber-950/40 px-2 py-1 rounded border border-amber-900/50">
                    Note: {ad.notes}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {ad.status === 'queue' && (
                  <>
                    <button
                      onClick={() => approveAd(ad.id)}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded font-semibold flex items-center gap-1"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Approve
                    </button>
                    <button
                      onClick={() => setRejectReasonModal(ad.id)}
                      className="px-3 py-1.5 bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 rounded font-semibold flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Reject
                    </button>
                  </>
                )}

                {ad.status === 'approved' && (
                  <button
                    onClick={() => publishAd(ad.id)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded font-semibold flex items-center gap-1"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Publish to Discord
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Official Rulebook Embed */}
      <div className="bg-[#111622] border border-[#232D3F] rounded-xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          Official Marketplace & Partnership Rulebook
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-[#0B0E14] border border-[#1f2838] p-4 rounded-lg space-y-2">
            <h4 className="font-bold text-slate-200">Partnership Requirements</h4>
            <ul className="space-y-1 text-slate-300 list-disc list-inside">
              <li>Your server must have at least 100 members.</li>
              <li>Your server must be strictly SFW.</li>
              <li>Your server must be fully established and active.</li>
              <li>No ping will be sent for partnerships.</li>
              <li>Must comply with Discord & ER:LC/PRC terms of service.</li>
              <li>Silence Designs reserves the right to deny any partnership.</li>
              <li className="text-rose-400 font-semibold">Design servers are not eligible.</li>
            </ul>
          </div>

          <div className="bg-[#0B0E14] border border-[#1f2838] p-4 rounded-lg space-y-2">
            <h4 className="font-bold text-slate-200">Order & Community Conduct</h4>
            <ul className="space-y-1 text-slate-300 list-disc list-inside">
              <li>Respect all designers. Designers hold the right to deny orders.</li>
              <li>Maintain respectful language in support tickets.</li>
              <li>Do not ping the Executive Team or higher staff roles.</li>
              <li>Unauthorized staff pings result in immediate timeout.</li>
              <li>Repeated harassment or abuse leads to permanent blacklist.</li>
              <li className="text-blue-400">All advertisement purchases are non-refundable.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Rejection Modal */}
      {rejectReasonModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111622] border border-[#232D3F] w-full max-w-md rounded-xl p-5 space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white">Reject Advertisement Submission</h3>
            <textarea
              rows={3}
              value={rejectText}
              onChange={e => setRejectText(e.target.value)}
              className="w-full bg-[#0B0E14] border border-[#232D3F] text-slate-200 text-xs p-2.5 rounded-lg focus:outline-none focus:border-blue-500"
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setRejectReasonModal(null)}
                className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirmReject(rejectReasonModal)}
                className="px-4 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-semibold"
              >
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
