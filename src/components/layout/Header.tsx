import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useBotData } from '../../context/BotDataContext';
import { ASSETS } from '../../data/assets';
import {
  Download,
  Server,
  ChevronDown,
  Wrench,
  LogOut,
  ShieldCheck,
  Cpu
} from 'lucide-react';
import { generateProjectZip } from '../../utils/projectExport';

interface HeaderProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onNavigate }) => {
  const { user, selectedGuild, guilds, setSelectedGuild, startSetupWizard, logout } = useAuth();
  const [showServerMenu, setShowServerMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

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
    <header className="flex items-center justify-between gap-8 px-6 py-3 bg-[#0B0E14] border-b border-[#232D3F] shrink-0 sticky top-0 z-40">
      {/* Zone 1: Brand Wordmark + Server Selector */}
      <div className="flex items-center gap-4 whitespace-nowrap shrink-0">
        <div
          onClick={() => onNavigate('overview')}
          className="flex items-center gap-2.5 cursor-pointer"
        >
          <img
            src={ASSETS.logo}
            alt="Silence Designs"
            className="w-8 h-8 rounded-lg object-cover border border-[#232D3F]"
            referrerPolicy="no-referrer"
          />
          <span className="text-base font-extrabold tracking-tight text-white">
            Silence Designs
          </span>
        </div>

        {/* Server Selector Dropdown */}
        {selectedGuild && (
          <div className="relative">
            <button
              onClick={() => setShowServerMenu(!showServerMenu)}
              className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg bg-[#111622] hover:bg-[#161D2D] border border-[#232D3F] text-xs font-semibold text-slate-200 transition-colors"
            >
              <Server className="w-3.5 h-3.5 text-blue-400" />
              <span className="truncate max-w-[140px]">{selectedGuild.name}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showServerMenu && (
              <div className="absolute left-0 mt-1.5 w-64 bg-[#111622] border border-[#232D3F] rounded-xl shadow-2xl p-1 z-50 divide-y divide-[#1f2838]">
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Manage Server
                </div>
                <div className="py-1">
                  {guilds.map(g => (
                    <button
                      key={g.id}
                      onClick={() => {
                        setSelectedGuild(g);
                        setShowServerMenu(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-xs rounded-lg flex items-center justify-between ${
                        selectedGuild.id === g.id
                          ? 'bg-blue-600/20 text-blue-400 font-bold'
                          : 'text-slate-300 hover:bg-[#161D2D]'
                      }`}
                    >
                      <span className="truncate">{g.name}</span>
                      {g.botInstalled && (
                        <span className="text-[10px] text-emerald-400">✓ Active</span>
                      )}
                    </button>
                  ))}
                </div>
                <div className="p-1">
                  <button
                    onClick={() => {
                      setShowServerMenu(false);
                      startSetupWizard(selectedGuild);
                    }}
                    className="w-full px-3 py-1.5 text-left text-xs text-blue-400 hover:bg-[#161D2D] rounded-lg font-medium flex items-center gap-2"
                  >
                    <Wrench className="w-3.5 h-3.5" />
                    Re-run Setup Wizard
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Zone 2: Clean single-line nav links */}
      <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-slate-400">
        <button
          onClick={() => onNavigate('overview')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
            currentTab === 'overview' ? 'text-white' : ''
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => onNavigate('simulator')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
            currentTab === 'simulator' ? 'text-blue-400' : ''
          }`}
        >
          Discord Simulator
        </button>
        <button
          onClick={() => onNavigate('tickets')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
            currentTab === 'tickets' ? 'text-white' : ''
          }`}
        >
          Tickets
        </button>
        <button
          onClick={() => onNavigate('orders')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
            currentTab === 'orders' ? 'text-white' : ''
          }`}
        >
          Orders
        </button>
        <button
          onClick={() => onNavigate('settings')}
          className={`hover:text-white transition-colors whitespace-nowrap shrink-0 ${
            currentTab === 'settings' ? 'text-white' : ''
          }`}
        >
          Self-Hosting
        </button>
      </nav>

      {/* Zone 3: 1 primary action or User Controls */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={handleDownload}
          className="hidden sm:flex px-3.5 py-1.5 text-xs font-semibold text-slate-300 hover:text-white bg-[#111622] hover:bg-[#161D2D] border border-[#232D3F] rounded-lg transition-colors whitespace-nowrap shrink-0 items-center gap-1.5"
        >
          <Download className="w-3.5 h-3.5" />
          Export ZIP
        </button>

        {user ? (
          <div className="relative">
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="flex items-center gap-2 p-1 rounded-lg hover:bg-[#111622] border border-transparent hover:border-[#232D3F] transition-colors"
            >
              <img
                src={user.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'}
                alt={user.username}
                className="w-7 h-7 rounded-full border border-blue-500 object-cover"
                referrerPolicy="no-referrer"
              />
              <span className="text-xs font-bold text-slate-200 hidden md:inline">
                {user.username}
              </span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {showUserMenu && (
              <div className="absolute right-0 mt-1.5 w-56 bg-[#111622] border border-[#232D3F] rounded-xl shadow-2xl p-1 z-50 divide-y divide-[#1f2838] text-xs">
                <div className="px-3 py-2">
                  <div className="font-bold text-white truncate">{user.global_name || user.username}</div>
                  <div className="text-[10px] text-slate-400 font-mono">ID: {user.id}</div>
                </div>
                <div className="p-1">
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      startSetupWizard(selectedGuild || undefined);
                    }}
                    className="w-full px-3 py-2 text-left text-slate-300 hover:bg-[#161D2D] rounded-lg flex items-center gap-2"
                  >
                    <Wrench className="w-3.5 h-3.5 text-blue-400" />
                    Setup Wizard
                  </button>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      logout();
                    }}
                    className="w-full px-3 py-2 text-left text-rose-400 hover:bg-[#161D2D] rounded-lg flex items-center gap-2"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <button
            onClick={() => onNavigate('overview')}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-md"
          >
            Connect Discord
          </button>
        )}
      </div>
    </header>
  );
};
