import React, { useState } from 'react';
import { useBotData } from '../../context/BotDataContext';
import { Order, OrderStatus } from '../../types';
import {
  ShoppingBag,
  Clock,
  CheckCircle2,
  AlertCircle,
  User,
  Star,
  ExternalLink,
  ChevronRight,
  Plus,
  Edit2
} from 'lucide-react';

const STATUS_COLUMNS: { key: OrderStatus; label: string; color: string }[] = [
  { key: 'submitted', label: 'Submitted', color: 'border-slate-500' },
  { key: 'pending_review', label: 'In Review', color: 'border-amber-500' },
  { key: 'accepted', label: 'Accepted', color: 'border-blue-500' },
  { key: 'in_progress', label: 'In Progress', color: 'border-indigo-500' },
  { key: 'awaiting_payment', label: 'Awaiting Payment', color: 'border-purple-500' },
  { key: 'completed', label: 'Completed', color: 'border-emerald-500' }
];

export const OrdersView: React.FC = () => {
  const { orders, updateOrderStatus, assignOrderDesigner } = useBotData();
  const [selectedOrderId, setSelectedOrderId] = useState<string>(orders[0]?.id || '');
  const [designerInput, setDesignerInput] = useState('Carlos473');
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');

  const selectedOrder = orders.find(o => o.id === selectedOrderId) || orders[0];

  const handleClaimOrder = (orderId: string) => {
    assignOrderDesigner(orderId, designerInput);
  };

  const handleAdvanceStatus = (orderId: string, current: OrderStatus) => {
    const sequence: OrderStatus[] = [
      'submitted',
      'pending_review',
      'accepted',
      'in_progress',
      'awaiting_payment',
      'completed'
    ];
    const currentIndex = sequence.indexOf(current);
    if (currentIndex >= 0 && currentIndex < sequence.length - 1) {
      updateOrderStatus(orderId, sequence[currentIndex + 1]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#111622] border border-[#232D3F] p-5 rounded-xl">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-blue-400" />
            Order Lifecycle Management
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Full 7-step pipeline from submission to delivery, designer claims, and verified reviews.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="bg-[#0B0E14] border border-[#232D3F] p-0.5 rounded-lg flex text-xs">
            <button
              onClick={() => setViewMode('kanban')}
              className={`px-3 py-1 rounded font-medium ${
                viewMode === 'kanban' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Kanban
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded font-medium ${
                viewMode === 'table' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Table
            </button>
          </div>
        </div>
      </div>

      {/* Main Order Workspace */}
      {viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3.5 items-start overflow-x-auto pb-4">
          {STATUS_COLUMNS.map(col => {
            const colOrders = orders.filter(o => o.status === col.key);
            return (
              <div
                key={col.key}
                className="bg-[#111622] border border-[#232D3F] rounded-xl p-3 min-w-[200px] flex flex-col"
              >
                <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#1f2838]">
                  <span className="text-xs font-bold text-slate-200">{col.label}</span>
                  <span className="text-[11px] font-mono text-slate-400 font-semibold bg-[#0B0E14] px-1.5 py-0.5 rounded">
                    {colOrders.length}
                  </span>
                </div>

                <div className="space-y-2.5 min-h-[300px]">
                  {colOrders.map(order => (
                    <div
                      key={order.id}
                      onClick={() => setSelectedOrderId(order.id)}
                      className={`bg-[#0B0E14] border p-3 rounded-lg text-xs cursor-pointer transition-all ${
                        selectedOrder?.id === order.id
                          ? 'border-blue-500 shadow-md bg-[#131b28]'
                          : 'border-[#1f2838] hover:border-[#33425a]'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="font-mono font-bold text-blue-400">{order.id}</span>
                        <span className="font-mono font-semibold text-slate-200">{order.finalPrice || order.estimatedPrice}</span>
                      </div>

                      <div className="font-medium text-slate-200 mt-1">{order.serviceType}</div>
                      <div className="text-slate-400 text-[11px] line-clamp-2 mt-0.5">
                        {order.description}
                      </div>

                      <div className="mt-2.5 pt-2 border-t border-[#1f2838] flex items-center justify-between text-[10px] text-slate-400">
                        <span>@{order.customerRobloxUser}</span>
                        <span>{order.assignedDesigner ? `@${order.assignedDesigner}` : 'Unassigned'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-[#111622] border border-[#232D3F] rounded-xl overflow-hidden">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#0B0E14] text-slate-400 font-semibold border-b border-[#232D3F]">
              <tr>
                <th className="p-3.5">Order ID</th>
                <th className="p-3.5">Customer</th>
                <th className="p-3.5">Service</th>
                <th className="p-3.5">Price</th>
                <th className="p-3.5">Designer</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1f2838]">
              {orders.map(o => (
                <tr
                  key={o.id}
                  onClick={() => setSelectedOrderId(o.id)}
                  className={`hover:bg-[#161D2D] cursor-pointer ${
                    selectedOrder?.id === o.id ? 'bg-[#161D2D]' : ''
                  }`}
                >
                  <td className="p-3.5 font-mono font-bold text-blue-400">{o.id}</td>
                  <td className="p-3.5 text-slate-200">
                    {o.customerDiscordTag} <span className="text-slate-400">({o.customerRobloxUser})</span>
                  </td>
                  <td className="p-3.5 text-slate-300 font-medium">{o.serviceType}</td>
                  <td className="p-3.5 font-mono text-slate-200">{o.finalPrice || o.estimatedPrice}</td>
                  <td className="p-3.5 text-slate-400">{o.assignedDesigner || 'Unassigned'}</td>
                  <td className="p-3.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-blue-950 text-blue-400 border border-blue-800">
                      {o.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-400">{new Date(o.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Selected Order Detail Drawer */}
      {selectedOrder && (
        <div className="bg-[#111622] border border-[#232D3F] rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#232D3F] pb-4">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white font-mono">{selectedOrder.id}</h3>
                <span className="text-xs text-slate-400">· {selectedOrder.serviceType}</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase bg-emerald-950 text-emerald-400 border border-emerald-800">
                  {selectedOrder.status.replace('_', ' ')}
                </span>
              </div>
              <div className="text-xs text-slate-400 mt-1">
                Customer: <span className="text-slate-200">@{selectedOrder.customerDiscordTag}</span> (Roblox: <span className="text-blue-400">{selectedOrder.customerRobloxUser}</span>)
                {selectedOrder.ticketRef && ` • Ticket: ${selectedOrder.ticketRef}`}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!selectedOrder.assignedDesigner && (
                <button
                  onClick={() => handleClaimOrder(selectedOrder.id)}
                  className="px-3.5 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-semibold"
                >
                  Claim Order as {designerInput}
                </button>
              )}

              {selectedOrder.status !== 'completed' && (
                <button
                  onClick={() => handleAdvanceStatus(selectedOrder.id, selectedOrder.status)}
                  className="px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded text-xs font-semibold flex items-center gap-1"
                >
                  Advance Status <ChevronRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="bg-[#0B0E14] border border-[#1f2838] p-3.5 rounded-lg space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Specifications
              </span>
              <p className="text-slate-200 leading-relaxed">{selectedOrder.description}</p>
              <div className="pt-2 text-[11px] text-slate-400">
                <div>Preferred Colors: <span className="text-slate-200">{selectedOrder.preferredColors || 'Default'}</span></div>
                <div>Included Text: <span className="text-slate-200">{selectedOrder.textToInclude || 'None'}</span></div>
              </div>
            </div>

            <div className="bg-[#0B0E14] border border-[#1f2838] p-3.5 rounded-lg space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Financials & Staff
              </span>
              <div className="text-slate-300 space-y-1">
                <div>Estimated: <span className="font-mono text-white font-semibold">{selectedOrder.estimatedPrice}</span></div>
                <div>Agreed Final: <span className="font-mono text-emerald-400 font-bold">{selectedOrder.finalPrice || selectedOrder.estimatedPrice}</span></div>
                <div>Assigned Designer: <span className="text-blue-400 font-semibold">{selectedOrder.assignedDesigner || 'Unassigned'}</span></div>
              </div>
            </div>

            <div className="bg-[#0B0E14] border border-[#1f2838] p-3.5 rounded-lg space-y-2">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Customer Feedback
              </span>
              {selectedOrder.review ? (
                <div className="space-y-1">
                  <div className="flex items-center gap-1 text-amber-400">
                    {[...Array(selectedOrder.review.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                    <span className="text-xs font-bold ml-1">{selectedOrder.review.rating}/5</span>
                  </div>
                  <p className="text-slate-300 italic">"{selectedOrder.review.comment}"</p>
                </div>
              ) : (
                <div className="text-slate-400 italic">
                  {selectedOrder.status === 'completed'
                    ? 'Awaiting customer /order-review submission.'
                    : 'Customer review unlocks once completed.'}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
