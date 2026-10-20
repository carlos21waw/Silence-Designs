import React, { useState } from 'react';
import { useBotData } from '../../context/BotDataContext';
import { StoreProduct } from '../../types';
import {
  ShoppingBag,
  ExternalLink,
  Edit2,
  Check,
  Star,
  Gift,
  ShieldCheck,
  Zap
} from 'lucide-react';

export const StoreView: React.FC = () => {
  const { storeProducts, updateProduct, settings } = useBotData();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editRobux, setEditRobux] = useState(0);
  const [editUsd, setEditUsd] = useState(0);
  const [editUrl, setEditUrl] = useState('');

  const filteredProducts = storeProducts.filter(
    p => selectedCategory === 'all' || p.category === selectedCategory
  );

  const handleStartEdit = (prod: StoreProduct) => {
    setEditingId(prod.id);
    setEditRobux(prod.priceRobux);
    setEditUsd(prod.priceUsd);
    setEditUrl(prod.robloxProductUrl);
  };

  const handleSave = (id: string) => {
    updateProduct(id, {
      priceRobux: Number(editRobux),
      priceUsd: Number(editUsd),
      robloxProductUrl: editUrl
    });
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111622] border border-[#232D3F] p-5 rounded-xl">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-blue-400" />
            Silence Designs Official Store & Perks
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure server boosting perks, Silence Designs+ memberships, donations, and Roblox developer product mappings.
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

      {/* Category Filter Tabs */}
      <div className="flex bg-[#111622] border border-[#232D3F] p-1 rounded-xl w-fit text-xs">
        {[
          { key: 'all', label: 'All Products' },
          { key: 'boosting', label: 'Server Boosting' },
          { key: 'membership', label: 'Silence Designs+' },
          { key: 'donation', label: 'Donations' },
          { key: 'advertisement', label: 'Ads Store' }
        ].map(cat => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              selectedCategory === cat.key
                ? 'bg-blue-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredProducts.map(prod => {
          const isEditing = editingId === prod.id;

          return (
            <div
              key={prod.id}
              className="bg-[#111622] border border-[#232D3F] rounded-xl p-5 flex flex-col justify-between space-y-4 hover:border-[#33425a] transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider block">
                      {prod.category}
                    </span>
                    <h3 className="text-sm font-bold text-white mt-0.5">{prod.title}</h3>
                  </div>

                  {isEditing ? (
                    <button
                      onClick={() => handleSave(prod.id)}
                      className="p-1.5 bg-blue-600 text-white rounded hover:bg-blue-500"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStartEdit(prod)}
                      className="p-1.5 bg-[#0B0E14] text-slate-400 hover:text-white rounded border border-[#232D3F]"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {prod.description}
                </p>

                {/* Price Display / Edit */}
                {isEditing ? (
                  <div className="space-y-2 bg-[#0B0E14] p-3 rounded-lg border border-[#232D3F] text-xs">
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">Price in Robux (R$)</label>
                      <input
                        type="number"
                        value={editRobux}
                        onChange={e => setEditRobux(Number(e.target.value))}
                        className="w-full bg-[#161D2D] border border-blue-500 rounded px-2 py-1 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">Price in USD ($)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={editUsd}
                        onChange={e => setEditUsd(Number(e.target.value))}
                        className="w-full bg-[#161D2D] border border-blue-500 rounded px-2 py-1 text-white font-mono"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 block mb-0.5">Roblox Dev Product URL</label>
                      <input
                        type="text"
                        value={editUrl}
                        onChange={e => setEditUrl(e.target.value)}
                        placeholder="https://www.roblox.com/developer-product/..."
                        className="w-full bg-[#161D2D] border border-blue-500 rounded px-2 py-1 text-white text-[11px]"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="bg-[#0B0E14] border border-[#1f2838] p-3 rounded-lg text-xs flex items-center justify-between">
                    <div>
                      <span className="text-slate-400 text-[11px] block">Pricing:</span>
                      <span className="font-mono font-bold text-white text-sm">
                        {prod.priceRobux > 0 ? `R$${prod.priceRobux}` : 'Event/Boost'}
                      </span>
                      {prod.priceUsd > 0 && (
                        <span className="text-slate-400 text-[11px] ml-1.5 font-mono">
                          (${prod.priceUsd.toFixed(2)} USD)
                        </span>
                      )}
                    </div>

                    {prod.robloxProductUrl && (
                      <a
                        href={prod.robloxProductUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"
                      >
                        Roblox Link <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                )}

                {/* Benefits List */}
                <div className="space-y-1 text-xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Perks & Benefits
                  </span>
                  {prod.benefits.map((b, i) => (
                    <div key={i} className="text-slate-300 flex items-start gap-1.5 text-[11px]">
                      <span className="text-emerald-400 font-bold">✓</span>
                      <span>{b}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-2 text-[10px] text-slate-400 border-t border-[#1f2838]">
                Requires staff/API verification before automated Discord role delivery.
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
