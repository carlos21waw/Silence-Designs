import React, { useState } from 'react';
import { useBotData } from '../../context/BotDataContext';
import { Application } from '../../types';
import {
  UserCheck,
  CheckCircle,
  XCircle,
  Clock,
  Briefcase,
  ExternalLink,
  MessageSquare
} from 'lucide-react';

export const ApplicationsView: React.FC = () => {
  const { applications, reviewApplication } = useBotData();
  const [selectedAppId, setSelectedAppId] = useState<string>(applications[0]?.id || '');
  const [feedbackReason, setFeedbackReason] = useState('High standard portfolio matching Silence Designs quality.');

  const selectedApp = applications.find(a => a.id === selectedAppId) || applications[0];

  const handleReview = (status: 'accepted' | 'denied') => {
    if (!selectedApp) return;
    reviewApplication(selectedApp.id, status, feedbackReason, 'Carlos473');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111622] border border-[#232D3F] p-5 rounded-xl">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-blue-400" />
            Designer & Staff Applications (/app-review)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Review incoming designer portfolios, experience, and community staff submissions.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Applications List */}
        <div className="lg:col-span-5 space-y-3">
          {applications.map(app => (
            <div
              key={app.id}
              onClick={() => setSelectedAppId(app.id)}
              className={`bg-[#111622] border p-4 rounded-xl cursor-pointer transition-all ${
                selectedApp?.id === app.id
                  ? 'border-blue-500 shadow-md bg-[#141b2b]'
                  : 'border-[#232D3F] hover:border-[#34425a]'
              }`}
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white">@{app.applicantTag}</span>
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  app.status === 'accepted' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                  app.status === 'denied' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                  'bg-amber-950 text-amber-400 border border-amber-800'
                }`}>
                  {app.status}
                </span>
              </div>

              <div className="text-xs text-blue-400 mt-1 capitalize font-medium">
                {app.type} Application • Roblox: {app.robloxUser}
              </div>

              <p className="text-slate-400 text-xs mt-2 line-clamp-2">
                {app.portfolioOrExperience}
              </p>
            </div>
          ))}
        </div>

        {/* Detail & Decision Pane */}
        {selectedApp ? (
          <div className="lg:col-span-7 bg-[#111622] border border-[#232D3F] rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#232D3F] pb-4">
              <div>
                <h3 className="text-sm font-bold text-white">
                  @{selectedApp.applicantTag}
                </h3>
                <span className="text-xs text-slate-400">
                  Applying for <span className="text-blue-400 font-semibold capitalize">{selectedApp.type}</span> role
                </span>
              </div>

              <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase ${
                selectedApp.status === 'accepted' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                selectedApp.status === 'denied' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                'bg-amber-950 text-amber-400 border border-amber-800'
              }`}>
                {selectedApp.status}
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="bg-[#0B0E14] border border-[#1f2838] p-3.5 rounded-lg space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Portfolio & ER:LC Experience
                </span>
                <p className="text-slate-200 leading-relaxed">{selectedApp.portfolioOrExperience}</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#0B0E14] border border-[#1f2838] p-3 rounded-lg">
                  <span className="text-[10px] font-bold text-slate-400 block">Weekly Availability</span>
                  <span className="text-slate-200 font-medium">{selectedApp.availability}</span>
                </div>
                <div className="bg-[#0B0E14] border border-[#1f2838] p-3 rounded-lg">
                  <span className="text-[10px] font-bold text-slate-400 block">Roblox Profile</span>
                  <span className="text-blue-400 font-medium">{selectedApp.robloxUser}</span>
                </div>
              </div>

              <div className="bg-[#0B0E14] border border-[#1f2838] p-3.5 rounded-lg space-y-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Motivation Statement
                </span>
                <p className="text-slate-200 leading-relaxed">{selectedApp.motivation}</p>
              </div>
            </div>

            {selectedApp.status === 'pending' && (
              <div className="pt-3 border-t border-[#232D3F] space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Feedback / Decision Notes
                  </label>
                  <textarea
                    rows={2}
                    value={feedbackReason}
                    onChange={e => setFeedbackReason(e.target.value)}
                    className="w-full bg-[#0B0E14] border border-[#232D3F] rounded p-2 text-xs text-white"
                  />
                </div>

                <div className="flex items-center gap-2 justify-end">
                  <button
                    onClick={() => handleReview('denied')}
                    className="px-4 py-1.5 bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300 rounded text-xs font-semibold flex items-center gap-1"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    Deny Application
                  </button>
                  <button
                    onClick={() => handleReview('accepted')}
                    className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded text-xs font-semibold flex items-center gap-1"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Accept Applicant
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="lg:col-span-7 bg-[#111622] border border-[#232D3F] rounded-xl p-12 text-center text-slate-400 text-xs">
            Select an application to inspect responses.
          </div>
        )}
      </div>
    </div>
  );
};
