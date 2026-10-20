import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ASSETS } from '../../data/assets';
import { generateProjectZip } from '../../utils/projectExport';
import {
  ShieldCheck,
  Cpu,
  Download,
  ArrowRight,
  Layers,
  Ticket,
  ShoppingBag,
  Sparkles,
  Users,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

interface LandingPageViewProps {
  onEnterSimulator: () => void;
}

export const LandingPageView: React.FC<LandingPageViewProps> = ({ onEnterSimulator }) => {
  const { loginWithDiscord, demoLogin, botStatus } = useAuth();

  const handleDownload = async () => {
    const zipBlob = await generateProjectZip();
    const url = URL.createObjectURL(zipBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'silence-designs-bot.zip';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#0B0E14] text-slate-100 flex flex-col justify-between selection:bg-blue-600 selection:text-white">
      {/* Top Bar */}
      <header className="flex items-center justify-between gap-8 px-6 py-4 border-b border-[#232D3F] bg-[#0B0E14]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <img
            src={ASSETS.logo}
            alt="Silence Designs"
            className="w-9 h-9 rounded-xl object-cover border border-[#232D3F] shadow-md"
            referrerPolicy="no-referrer"
          />
          <div className="flex flex-col">
            <span className="text-base font-extrabold tracking-tight text-white leading-none">
              Silence Designs
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5">
              ER:LC Creative Design Studio
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#111622] border border-[#232D3F] text-[11px] text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Bot Status: <strong className="text-emerald-400">ONLINE</strong> (99.98%)</span>
          </div>

          <button
            onClick={demoLogin}
            className="px-3.5 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-[#161D2D] hover:bg-[#1E293B] border border-[#232D3F] rounded-lg transition-colors"
          >
            Developer Login
          </button>

          <button
            onClick={loginWithDiscord}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#5865F2] hover:bg-[#4752C4] rounded-lg transition-all shadow-lg flex items-center gap-2"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
            </svg>
            Connect with Discord
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 flex flex-col justify-center">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#111622] border border-[#232D3F] text-xs text-blue-400 font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official ER:LC Discord Bot & Admin Suite</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] text-balance">
              Precision Creative Services. Built for ER:LC Communities.
            </h1>

            <p className="text-base text-slate-300 leading-relaxed max-w-2xl text-pretty">
              Silence Designs powers vehicle liveries, tactical clothing, custom graphics, and automated Discord workflows. Connect your server to activate persistent ticket centers, order pipelines, and community moderation in under 2 minutes.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                onClick={loginWithDiscord}
                className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold shadow-xl flex items-center gap-2.5 transition-all transform hover:-translate-y-0.5"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={loginWithDiscord}
                className="px-5 py-3.5 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded-xl text-sm font-bold shadow-xl flex items-center gap-2.5 transition-all transform hover:-translate-y-0.5"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                </svg>
                Connect with Discord
              </button>

              <button
                onClick={onEnterSimulator}
                className="px-5 py-3.5 bg-[#111622] hover:bg-[#161D2D] text-slate-200 border border-[#232D3F] rounded-xl text-sm font-semibold flex items-center gap-2 transition-colors"
              >
                <Cpu className="w-4 h-4 text-blue-400" />
                Discord Simulator
              </button>

              <button
                onClick={handleDownload}
                className="px-4 py-3.5 bg-[#0B0E14] hover:bg-[#111622] text-slate-400 hover:text-white border border-[#232D3F] rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                Export ZIP
              </button>
            </div>

            {/* Trust points */}
            <div className="pt-4 border-t border-[#1f2838] grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>50 Primary Slash Commands</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Persistent Ticket Panels</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Roblox Group Sync</span>
              </div>
            </div>
          </div>

          {/* Visual Showcase Card */}
          <div className="lg:col-span-5 relative">
            <div className="rounded-2xl overflow-hidden border border-[#232D3F] bg-[#111622] shadow-2xl p-4 space-y-3.5">
              <div className="relative rounded-xl overflow-hidden aspect-video border border-[#232D3F]">
                <img
                  src={ASSETS.liveryBanner}
                  alt="ER:LC Livery Showcase"
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-4">
                  <div>
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">
                      ER:LC Studio Showcase
                    </span>
                    <h3 className="text-sm font-bold text-white">State Police Ghost Livery Package</h3>
                  </div>
                </div>
              </div>

              {/* Onboarding Roadmap Snapshot */}
              <div className="space-y-2 pt-1 text-xs">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                  Zero-to-Ready Setup Roadmap (10 Steps)
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-[#0B0E14] border border-[#1f2838] p-2.5 rounded-lg flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 font-mono font-bold text-[11px] flex items-center justify-center">1</span>
                    <span className="text-slate-200">Authorize Server</span>
                  </div>
                  <div className="bg-[#0B0E14] border border-[#1f2838] p-2.5 rounded-lg flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 font-mono font-bold text-[11px] flex items-center justify-center">2</span>
                    <span className="text-slate-200">Map Server Roles</span>
                  </div>
                  <div className="bg-[#0B0E14] border border-[#1f2838] p-2.5 rounded-lg flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-blue-600/30 text-blue-400 font-mono font-bold text-[11px] flex items-center justify-center">3</span>
                    <span className="text-slate-200">Setup Channels</span>
                  </div>
                  <div className="bg-[#0B0E14] border border-[#1f2838] p-2.5 rounded-lg flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-emerald-600/30 text-emerald-400 font-mono font-bold text-[11px] flex items-center justify-center">4</span>
                    <span className="text-emerald-300 font-semibold">Activate Bot</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#232D3F] px-6 py-4 bg-[#0B0E14] text-xs text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span>Silence Designs Bot & Dashboard</span>
          <span>·</span>
          <span>Lead Developer Carlos473 (ID: 1025813762684502168)</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="https://docs.google.com/document/d/16LXkFBEOPLBAr8trPBIIYXH53wZbr_oFjjTtsO6hVmI/edit?usp=sharing"
            target="_blank"
            rel="noreferrer"
            className="hover:text-slate-200 flex items-center gap-1"
          >
            Master Service Agreement <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>
        </div>
      </footer>
    </div>
  );
};
