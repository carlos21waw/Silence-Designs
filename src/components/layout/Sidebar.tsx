import React from 'react';
import {
  LayoutDashboard,
  Cpu,
  Ticket,
  ShoppingBag,
  Layers,
  Megaphone,
  Store,
  Gift,
  Sparkles,
  UserCheck,
  ShieldAlert,
  Settings,
  Terminal
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onNavigate: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onNavigate }) => {
  const navItems = [
    { key: 'overview', label: 'Overview', icon: LayoutDashboard },
    { key: 'simulator', label: 'Discord Simulator', icon: Cpu, badge: 'Interactive' },
    { key: 'commands', label: 'All 50+ Commands', icon: Terminal },
    { key: 'tickets', label: 'Ticket Center', icon: Ticket },
    { key: 'orders', label: 'Order Pipeline', icon: ShoppingBag },
    { key: 'services', label: 'Services & Pricing', icon: Layers },
    { key: 'marketplace', label: 'Marketplace & Ads', icon: Megaphone },
    { key: 'store', label: 'Store & Perks', icon: Store },
    { key: 'giveaways', label: 'Giveaways', icon: Gift },
    { key: 'embeds', label: 'Embed Builder', icon: Sparkles },
    { key: 'applications', label: 'Applications', icon: UserCheck },
    { key: 'moderation', label: 'Moderation Cases', icon: ShieldAlert },
    { key: 'settings', label: 'Roblox & Hosting', icon: Settings }
  ];

  return (
    <aside className="w-64 bg-[#0B0E14] border-r border-[#232D3F] flex flex-col justify-between shrink-0 h-full overflow-y-auto p-3">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Management Modules
        </div>

        {navItems.map(item => {
          const Icon = item.icon;
          const isActive = currentTab === item.key;

          return (
            <button
              key={item.key}
              onClick={() => onNavigate(item.key)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-[#111622]'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon className={`w-4 h-4 ${isActive ? 'text-blue-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </div>

              {item.badge && (
                <span className="text-[10px] bg-blue-900/60 text-blue-300 px-1.5 py-0.5 rounded font-mono">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="mt-6 pt-3 border-t border-[#1f2838] px-3 text-[11px] text-slate-400 space-y-1">
        <div className="font-semibold text-slate-300">Silence Designs Studio</div>
        <div>Created by Carlos473</div>
        <div className="font-mono text-[10px]">ID: 1025813762684502168</div>
      </div>
    </aside>
  );
};
