import React, { useState } from 'react';
import { useBotData } from '../../context/BotDataContext';
import { ASSETS } from '../../data/assets';
import {
  Layers,
  Power,
  ExternalLink,
  Edit2,
  Check,
  Shield,
  Palette,
  Car,
  Shirt,
  Bot
} from 'lucide-react';

export const ServicesView: React.FC = () => {
  const { services, toggleServiceStatus, updateServiceDetails, settings } = useBotData();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState('');

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'graphics': return <Palette className="w-5 h-5 text-blue-400" />;
      case 'livery': return <Car className="w-5 h-5 text-emerald-400" />;
      case 'clothing': return <Shirt className="w-5 h-5 text-purple-400" />;
      case 'bot_development': return <Bot className="w-5 h-5 text-amber-400" />;
      default: return <Layers className="w-5 h-5 text-blue-400" />;
    }
  };

  const handleStartEdit = (id: string, currentPrice: string) => {
    setEditingId(id);
    setEditPrice(currentPrice);
  };

  const handleSavePrice = (id: string) => {
    updateServiceDetails(id, { basePrice: editPrice });
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111622] border border-[#232D3F] p-5 rounded-xl">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-400" />
            Services & Pricing Configuration
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Toggling a service switches its status in Discord embeds instantly and locks ticket orders when closed.
          </p>
        </div>

        <a
          href={settings.msaUrl}
          target="_blank"
          rel="noreferrer"
          className="px-3.5 py-1.5 bg-[#161D2D] hover:bg-[#1E293B] border border-[#232D3F] text-slate-200 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors self-start sm:self-auto"
        >
          Master Service Agreement <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
        </a>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {services.map(svc => {
          const isClosed = svc.status === 'closed';
          const isEditing = editingId === svc.id;

          return (
            <div
              key={svc.id}
              className={`bg-[#111622] border rounded-xl p-5 space-y-4 transition-all ${
                isClosed
                  ? 'border-[#232D3F] opacity-90'
                  : 'border-emerald-600/40 shadow-lg'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-[#0B0E14] border border-[#232D3F]">
                    {getCategoryIcon(svc.category)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{svc.name}</h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        !isClosed
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                          : 'bg-rose-950 text-rose-400 border border-rose-800'
                      }`}>
                        {svc.status.toUpperCase()}
                      </span>
                      <span className="text-xs text-slate-400 font-mono">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editPrice}
                            onChange={e => setEditPrice(e.target.value)}
                            className="bg-[#0B0E14] border border-blue-500 rounded px-2 py-0.5 text-xs text-white"
                          />
                        ) : (
                          svc.basePrice
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <button
                      onClick={() => handleSavePrice(svc.id)}
                      className="p-1.5 bg-blue-600 text-white rounded hover:bg-blue-500"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStartEdit(svc.id, svc.basePrice)}
                      className="p-1.5 bg-[#0B0E14] text-slate-400 hover:text-white rounded border border-[#232D3F]"
                      title="Edit Price"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  )}

                  <button
                    onClick={() => toggleServiceStatus(svc.id)}
                    className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                      svc.status === 'open'
                        ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                        : 'bg-rose-950/80 hover:bg-rose-900 border border-rose-800 text-rose-300'
                    }`}
                  >
                    {svc.status === 'open' ? 'SET CLOSED' : 'SET OPEN'}
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {svc.description}
              </p>

              {/* Package Details */}
              <div className="bg-[#0B0E14] border border-[#1f2838] p-3 rounded-lg text-xs space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  Package Inclusions & Tiers
                </span>
                {svc.details.map((detail, idx) => (
                  <div key={idx} className="text-slate-300 flex items-start gap-1.5">
                    <span className="text-blue-400 font-bold">·</span>
                    <span>{detail}</span>
                  </div>
                ))}
              </div>

              {isClosed && (
                <div className="p-2.5 rounded-lg bg-rose-950/40 border border-rose-900/50 text-[11px] text-rose-300">
                  ⚠️ <span className="font-semibold">{svc.name} is currently closed.</span> We are not accepting new requests for this service at the moment. Existing orders will continue to be processed.
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Featured Bundles Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-[#111622] border border-[#232D3F] rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white">Banner Bundle</h4>
            <span className="text-xs font-mono font-bold text-emerald-400">R$1,250+</span>
          </div>
          <p className="text-xs text-slate-300">
            The Banner Bundle price varies based on specifications and details provided.
          </p>
          <div className="bg-[#0B0E14] border border-[#1f2838] p-3 rounded-lg text-xs space-y-1 text-slate-300">
            <div className="font-semibold text-slate-200">What's included?</div>
            <div>• 1 server banner</div>
            <div>• 10 embed banners</div>
            <div>• 1 footer banner</div>
          </div>
        </div>

        <div className="bg-[#111622] border border-[#232D3F] rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-white">Discord Server Bundle</h4>
            <span className="text-xs font-mono font-bold text-emerald-400">R$2,000+</span>
          </div>
          <p className="text-xs text-slate-300">
            The Discord Server Bundle varies in price based on specifications. Optional bot setup has a maximum of 3 bots.
          </p>
          <div className="bg-[#0B0E14] border border-[#1f2838] p-3 rounded-lg text-xs space-y-1 text-slate-300">
            <div className="font-semibold text-slate-200">What's included?</div>
            <div>• Complete channel setup</div>
            <div>• Complete role setup</div>
            <div>• Role and channel permission setup</div>
            <div>• Bot setup, up to 3 bots (additional complexity may increase price)</div>
          </div>
        </div>
      </div>
    </div>
  );
};
