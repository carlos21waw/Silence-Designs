import React from 'react';
import { useBotData } from '../../context/BotDataContext';
import { ASSETS } from '../../data/assets';
import {
  Activity,
  Ticket,
  ShoppingBag,
  Megaphone,
  Gift,
  Shield,
  Layers,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Cpu,
  Power
} from 'lucide-react';

interface OverviewViewProps {
  onNavigate: (tab: string) => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({ onNavigate }) => {
  const {
    services,
    orders,
    tickets,
    advertisements,
    giveaways,
    currentRotatingActivity,
    botUptimeSeconds,
    apiLatencyMs,
    toggleServiceStatus
  } = useBotData();

  const activeTickets = tickets.filter(t => t.status !== 'closed');
  const pendingOrders = orders.filter(o => o.status === 'submitted' || o.status === 'pending_review');
  const adQueue = advertisements.filter(a => a.status === 'queue');
  const activeGiveaways = giveaways.filter(g => g.status === 'active');

  const formatUptime = (totalSec: number) => {
    const hours = Math.floor(totalSec / 3600);
    const minutes = Math.floor((totalSec % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="space-y-6">
      {/* Hero Studio Banner */}
      <div className="relative rounded-xl overflow-hidden border border-[#232D3F] bg-gradient-to-r from-[#0F1420] via-[#111827] to-[#0F1420] p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4">
            <img
              src={ASSETS.logo}
              alt="Silence Designs Logo"
              className="w-16 h-16 rounded-xl border border-[#334155] object-cover shadow-lg"
              referrerPolicy="no-referrer"
            />
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-extrabold text-white tracking-tight">
                  Silence Designs | ER:LC Studio
                </h2>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  ONLINE
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1 max-w-xl">
                Active presence: <span className="text-slate-200 font-medium">{currentRotatingActivity ? `${currentRotatingActivity.type} ${currentRotatingActivity.text}` : 'Powering Silence Designs'}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('simulator')}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded-lg shadow-md transition-colors flex items-center gap-2"
            >
              <Cpu className="w-4 h-4" />
              Launch Discord Simulator
            </button>
            <button
              onClick={() => onNavigate('settings')}
              className="px-4 py-2 bg-[#161D2D] hover:bg-[#1E293B] text-slate-200 border border-[#232D3F] text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Power className="w-3.5 h-3.5 text-slate-400" />
              Self-Host ZIP
            </button>
          </div>
        </div>
      </div>

      {/* KPI Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div className="bg-[#111622] border border-[#232D3F] p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Active Tickets</span>
            <Ticket className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-white tabular-nums">
            {activeTickets.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {tickets.filter(t => t.status === 'claimed').length} claimed by staff
          </div>
        </div>

        <div className="bg-[#111622] border border-[#232D3F] p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Pending Orders</span>
            <ShoppingBag className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-white tabular-nums">
            {pendingOrders.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {orders.filter(o => o.status === 'in_progress').length} in progress
          </div>
        </div>

        <div className="bg-[#111622] border border-[#232D3F] p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Ad Queue</span>
            <Megaphone className="w-4 h-4 text-purple-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-white tabular-nums">
            {adQueue.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {advertisements.filter(a => a.status === 'approved').length} approved
          </div>
        </div>

        <div className="bg-[#111622] border border-[#232D3F] p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Giveaways</span>
            <Gift className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-white tabular-nums">
            {activeGiveaways.length}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            {activeGiveaways[0]?.entries.length || 0} total entries
          </div>
        </div>

        <div className="bg-[#111622] border border-[#232D3F] p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>API Latency</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-white tabular-nums">
            {apiLatencyMs}ms
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">
            Optimal Discord ping
          </div>
        </div>

        <div className="bg-[#111622] border border-[#232D3F] p-4 rounded-xl">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Bot Uptime</span>
            <Clock className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-2 text-2xl font-bold font-mono text-white tabular-nums">
            {formatUptime(botUptimeSeconds)}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            99.98% reliability
          </div>
        </div>
      </div>

      {/* Services Instant State Toggle Bar */}
      <div className="bg-[#111622] border border-[#232D3F] rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-white">Live Service Availability Controls</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Toggling a service instantly updates the public Discord `/services` panel and prevents new order spam when closed.
            </p>
          </div>
          <button
            onClick={() => onNavigate('services')}
            className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            Manage Details <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {services.map(svc => (
            <div
              key={svc.id}
              className="bg-[#0B0E14] border border-[#232D3F] p-3.5 rounded-lg flex items-center justify-between"
            >
              <div>
                <span className="font-semibold text-xs text-slate-200 block">{svc.name}</span>
                <span className="text-[11px] text-slate-400">{svc.basePrice}</span>
              </div>

              <button
                onClick={() => toggleServiceStatus(svc.id)}
                className={`px-3 py-1 text-xs rounded-md font-semibold transition-all ${
                  svc.status === 'open'
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                    : 'bg-rose-950/80 border border-rose-800 text-rose-300 hover:bg-rose-900'
                }`}
              >
                {svc.status === 'open' ? 'OPEN' : 'CLOSED'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Layout: Recent Orders & Recent Tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Design Orders */}
        <div className="bg-[#111622] border border-[#232D3F] rounded-xl p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <ShoppingBag className="w-4 h-4 text-blue-400" />
              Recent Design Orders
            </h3>
            <button
              onClick={() => onNavigate('orders')}
              className="text-xs text-blue-400 hover:text-blue-300"
            >
              View Kanban
            </button>
          </div>

          <div className="space-y-2.5 flex-1">
            {orders.slice(0, 4).map(o => (
              <div
                key={o.id}
                className="bg-[#0B0E14] border border-[#1f2838] p-3 rounded-lg text-xs flex items-center justify-between hover:border-[#2f3d54] transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-blue-400">{o.id}</span>
                    <span className="text-slate-300 font-medium">{o.serviceType}</span>
                    <span className="text-[10px] text-slate-400">· {o.customerRobloxUser}</span>
                  </div>
                  <div className="text-slate-400 text-[11px] truncate max-w-sm mt-0.5">
                    {o.description}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                    o.status === 'completed' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800/60' :
                    o.status === 'in_progress' ? 'bg-blue-950 text-blue-300 border border-blue-800/60' :
                    'bg-amber-950 text-amber-300 border border-amber-800/60'
                  }`}>
                    {o.status.replace('_', ' ')}
                  </span>
                  <div className="text-slate-400 text-[11px] font-mono mt-1">{o.finalPrice || o.estimatedPrice}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Support Tickets */}
        <div className="bg-[#111622] border border-[#232D3F] rounded-xl p-5 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Ticket className="w-4 h-4 text-blue-400" />
              Active Community Tickets
            </h3>
            <button
              onClick={() => onNavigate('tickets')}
              className="text-xs text-blue-400 hover:text-blue-300"
            >
              Manage Tickets
            </button>
          </div>

          <div className="space-y-2.5 flex-1">
            {tickets.slice(0, 4).map(t => (
              <div
                key={t.id}
                className="bg-[#0B0E14] border border-[#1f2838] p-3 rounded-lg text-xs flex items-center justify-between hover:border-[#2f3d54] transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-200">{t.referenceId}</span>
                    <span className="text-slate-400 capitalize">{t.category}</span>
                  </div>
                  <div className="text-slate-400 text-[11px] truncate max-w-sm mt-0.5">
                    {t.inquiry}
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                    t.status === 'claimed' ? 'bg-blue-950 text-blue-400 border border-blue-800' :
                    t.status === 'closed' ? 'bg-slate-800 text-slate-400' :
                    'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  }`}>
                    {t.status}
                  </span>
                  <div className="text-[10px] text-slate-400 mt-1">
                    {t.claimedByTag ? `@${t.claimedByTag}` : 'Unclaimed'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
