import React, { useState } from 'react';
import { useBotData } from '../../context/BotDataContext';
import { ALL_50_PRIMARY_COMMANDS } from '../../data/initialData';
import { ASSETS } from '../../data/assets';
import { TicketCategory } from '../../types';
import {
  Send,
  Hash,
  ChevronDown,
  Sparkles,
  Ticket as TicketIcon,
  ShoppingBag,
  Gift,
  HelpCircle,
  ExternalLink,
  ShieldAlert,
  UserCheck,
  CheckCircle,
  X,
  FileDown
} from 'lucide-react';

interface SimulatorMessage {
  id: string;
  sender: 'user' | 'bot' | 'system';
  authorTag: string;
  avatarUrl?: string;
  isStaff?: boolean;
  content?: string;
  embed?: {
    title: string;
    description: string;
    color?: string;
    author?: { name: string; iconUrl?: string };
    fields?: { name: string; value: string; inline?: boolean }[];
    thumbnailUrl?: string;
    imageUrl?: string;
    footer?: { text: string; iconUrl?: string };
  };
  components?: 'ticket_panel' | 'services_panel' | 'giveaway_panel' | 'faq_panel' | 'order_ticket_panel';
  ticketRef?: string;
  orderId?: string;
  giveawayId?: string;
  timestamp: string;
}

export const SimulatorView: React.FC = () => {
  const {
    services,
    orders,
    tickets,
    giveaways,
    faqs,
    settings,
    currentRotatingActivity,
    createTicket,
    claimTicket,
    closeTicket,
    createOrder,
    joinGiveaway
  } = useBotData();

  const [channel, setChannel] = useState<'support' | 'services' | 'announcements' | 'general' | 'giveaways'>('support');
  const [inputVal, setInputVal] = useState('');
  const [commandSuggestions, setCommandSuggestions] = useState<typeof ALL_50_PRIMARY_COMMANDS>([]);
  const [selectedTicketCategory, setSelectedTicketCategory] = useState<string>('');
  
  // Modals state
  const [showOrderModal, setShowOrderModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportCategory, setSupportCategory] = useState<TicketCategory>('general');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form states for modals
  const [robloxUser, setRobloxUser] = useState('');
  const [orderServiceType, setOrderServiceType] = useState('Livery');
  const [orderSpecs, setOrderSpecs] = useState('');
  const [orderColors, setOrderColors] = useState('');
  const [orderText, setOrderText] = useState('');
  const [supportInquiry, setSupportInquiry] = useState('');
  const [reportedUser, setReportedUser] = useState('');

  // Expandable FAQ state
  const [expandedFaqId, setExpandedFaqId] = useState<number | null>(null);

  // Simulated channel chat histories
  const [messages, setMessages] = useState<SimulatorMessage[]>([
    {
      id: 'init-ticket-panel',
      sender: 'bot',
      authorTag: 'Silence Designs Bot',
      avatarUrl: ASSETS.logo,
      timestamp: 'Today at 6:30 PM',
      embed: {
        title: 'Silence Designs | Support Center',
        description: 'Welcome to Silence Designs Support. Select the appropriate option below to contact our team. Please provide accurate information so we can assist you efficiently.',
        color: '#2563EB',
        thumbnailUrl: ASSETS.logo,
        footer: { text: 'Silence Designs • Official ER:LC Support' }
      },
      components: 'ticket_panel'
    }
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Command auto-complete trigger
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputVal(val);
    if (val.startsWith('/')) {
      const query = val.slice(1).toLowerCase();
      const matches = ALL_50_PRIMARY_COMMANDS.filter(cmd =>
        cmd.name.toLowerCase().includes(query)
      ).slice(0, 6);
      setCommandSuggestions(matches);
    } else {
      setCommandSuggestions([]);
    }
  };

  const handleSelectCommand = (cmdName: string) => {
    setInputVal(`/${cmdName}`);
    setCommandSuggestions([]);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const trimmed = inputVal.trim();
    setInputVal('');
    setCommandSuggestions([]);

    const userMsg: SimulatorMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      authorTag: 'Carlos473',
      content: trimmed,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMsg]);

    // Command handling logic
    setTimeout(() => {
      executeSimulatedCommand(trimmed);
    }, 400);
  };

  const executeSimulatedCommand = (cmd: string) => {
    const parts = cmd.split(' ');
    const commandName = parts[0].replace('/', '').toLowerCase();

    const timestamp = 'Just now';

    if (commandName === 'ticket-create-panel') {
      setMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          authorTag: 'Silence Designs Bot',
          avatarUrl: ASSETS.logo,
          timestamp,
          embed: {
            title: 'Silence Designs | Support Center',
            description: 'Welcome to Silence Designs Support. Select the appropriate option below to contact our team. Please provide accurate information so we can assist you efficiently.',
            color: '#2563EB',
            thumbnailUrl: ASSETS.logo,
            footer: { text: 'Silence Designs • Support Protocol' }
          },
          components: 'ticket_panel'
        }
      ]);
      return;
    }

    if (commandName === 'services') {
      setMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          authorTag: 'Silence Designs Bot',
          avatarUrl: ASSETS.logo,
          timestamp,
          embed: {
            title: 'Silence Designs | Creative Services',
            description: 'Our services are built to deliver high-quality results with precision and consistency. From concept to completion, every order is managed with care by our trusted creative team. Select a service below to get started.\n\n*By requesting any service, you agree to our Master Service Agreement.*',
            color: '#3B82F6',
            thumbnailUrl: ASSETS.logo,
            imageUrl: ASSETS.liveryBanner,
            fields: services.map(s => ({
              name: `${s.name} — ${s.status === 'open' ? '🟢 OPEN' : '🔴 CLOSED'}`,
              value: `${s.description}\n**Price:** ${s.basePrice}\n${s.status === 'closed' ? `*${s.name} is currently closed. We are not accepting new requests for this service at the moment.*` : '*Accepting orders now!*'}`,
              inline: false
            })),
            footer: { text: 'Silence Designs • Master Service Agreement applies' }
          },
          components: 'services_panel'
        }
      ]);
      return;
    }

    if (commandName === 'store') {
      setMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          authorTag: 'Silence Designs Bot',
          avatarUrl: ASSETS.logo,
          timestamp,
          embed: {
            title: 'Silence Designs | Official Store',
            description: 'Explore our store and browse a curated selection of products — all from one centralized location.\n\nPlease review our [Master Service Agreement](https://docs.google.com/document/d/16LXkFBEOPLBAr8trPBIIYXH53wZbr_oFjjTtsO6hVmI/edit?usp=sharing) before making a purchase.',
            color: '#3B82F6',
            thumbnailUrl: ASSETS.logo,
            fields: [
              {
                name: '💎 Silence Designs+ Membership',
                value: '• 10% discount on all orders\n• Exclusive VIP role & media permissions\n• Privileged order queue & Vault releases\n**Price:** R$650 / $4.55 USD',
                inline: false
              },
              {
                name: '🚀 Server Boosting Perks',
                value: '• Exclusive Booster role\n• Special chat access, giveaways & releases\n• 5% order discount\n**Price:** Free with Discord Server Boost',
                inline: false
              },
              {
                name: '🎁 Community Donations',
                value: '• Small: R$200 / $1.40\n• Medium: R$500 / $3.50\n• Large: R$1,000 / $7.00',
                inline: false
              }
            ],
            footer: { text: 'Verified Roblox Developer Products • Sales final under MSA' }
          }
        }
      ]);
      return;
    }

    if (commandName === 'help') {
      setMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          authorTag: 'Silence Designs Bot',
          avatarUrl: ASSETS.logo,
          timestamp,
          embed: {
            title: 'Silence Designs | Help Center & FAQ',
            description: 'Frequently asked questions regarding orders, partnerships, applications, and support. Expand any question below for immediate answers.',
            color: '#3B82F6',
            thumbnailUrl: ASSETS.logo,
            footer: { text: 'Click any FAQ item to expand • Still need assistance?' }
          },
          components: 'faq_panel'
        }
      ]);
      return;
    }

    if (commandName === 'giveaway') {
      const activeGw = giveaways[0];
      setMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          authorTag: 'Silence Designs Bot',
          avatarUrl: ASSETS.logo,
          timestamp,
          embed: {
            title: `${activeGw.prize} — Giveaway in the Server`,
            description: `This giveaway is independently hosted and is sponsored by **${activeGw.sponsor}**. This giveaway is not sponsored by Silence Designs. You must be in the server before winning.`,
            color: '#3B82F6',
            thumbnailUrl: ASSETS.logo,
            fields: [
              { name: '🏆 Winners', value: `${activeGw.winnersCount}`, inline: true },
              { name: '⏳ Ends', value: 'In 3 days', inline: true },
              { name: '🎟️ Entries', value: `${activeGw.entries.length}`, inline: true },
              { name: '🌐 Server', value: `[${activeGw.serverName}](${activeGw.serverInvite || '#'})`, inline: false }
            ],
            footer: { text: 'Silence Designs Giveaway Engine • Click Join below' }
          },
          components: 'giveaway_panel',
          giveawayId: activeGw.id
        }
      ]);
      return;
    }

    if (commandName === 'about') {
      setMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          authorTag: 'Silence Designs Bot',
          avatarUrl: ASSETS.logo,
          timestamp,
          embed: {
            title: 'About Silence Designs Bot',
            description: 'Official enterprise Discord bot powering the Silence Designs ER:LC creative design team and community.',
            color: '#3B82F6',
            thumbnailUrl: ASSETS.logo,
            fields: [
              { name: '👨‍💻 Bot Creator', value: 'Carlos473 (<@1025813762684502168>)', inline: true },
              { name: '🆔 Developer ID', value: '1025813762684502168', inline: true },
              { name: '⏱️ Uptime', value: '41h 22m (99.98%)', inline: true },
              { name: '📶 API Latency', value: '23ms', inline: true },
              { name: '📦 Stack', value: 'discord.js v14 • Node.js • PostgreSQL', inline: true },
              { name: '👥 Cached Members', value: '4,850+ users', inline: true },
              { name: '📜 Master Service Agreement', value: '[View Agreement Document](https://docs.google.com/document/d/16LXkFBEOPLBAr8trPBIIYXH53wZbr_oFjjTtsO6hVmI/edit?usp=sharing)', inline: false }
            ],
            footer: { text: 'Silence Designs • Created by Carlos473' }
          }
        }
      ]);
      return;
    }

    if (commandName === 'group-info') {
      setMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          authorTag: 'Silence Designs Bot',
          avatarUrl: ASSETS.logo,
          timestamp,
          embed: {
            title: 'Roblox Group Integration | ILE Customs',
            description: 'Live information for linked ER:LC Roblox community collective.',
            color: '#3B82F6',
            thumbnailUrl: ASSETS.robloxGroupBadge,
            fields: [
              { name: 'Group Name', value: settings.robloxGroupName, inline: true },
              { name: 'Group ID', value: settings.robloxGroupId, inline: true },
              { name: 'Owner', value: settings.robloxGroupOwner, inline: true },
              { name: 'Member Count', value: `${settings.robloxGroupMemberCount.toLocaleString()} Members`, inline: true },
              { name: 'Created', value: settings.robloxGroupCreated, inline: true },
              { name: 'Community Link', value: `[roblox.com/communities/${settings.robloxGroupId}](https://www.roblox.com/communities/${settings.robloxGroupId})`, inline: false }
            ],
            footer: { text: 'Roblox Open Cloud API • Verified Group Record' }
          }
        }
      ]);
      return;
    }

    if (commandName === 'order-status') {
      const orderArg = parts[1] || 'ORD-7192A';
      const order = orders.find(o => o.id.toLowerCase() === orderArg.toLowerCase()) || orders[0];
      setMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          authorTag: 'Silence Designs Bot',
          avatarUrl: ASSETS.logo,
          timestamp,
          embed: {
            title: `Order Status: ${order.id}`,
            description: `**Service:** ${order.serviceType}\n**Status:** ${order.status.toUpperCase()}\n**Customer:** <@${order.customerDiscordId}>\n**Roblox:** ${order.customerRobloxUser}`,
            color: order.status === 'completed' ? '#16A34A' : '#3B82F6',
            fields: [
              { name: 'Assigned Designer', value: order.assignedDesigner || 'Unassigned (In Review)', inline: true },
              { name: 'Price', value: order.finalPrice || order.estimatedPrice, inline: true },
              { name: 'Ticket Ref', value: order.ticketRef || 'None', inline: true },
              { name: 'Description', value: order.description, inline: false },
              { name: 'Notes', value: order.notes.join('\n') || 'No internal notes.', inline: false }
            ],
            footer: { text: 'Silence Designs Order Tracker' }
          }
        }
      ]);
      return;
    }

    if (commandName === 'price-list') {
      setMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          authorTag: 'Silence Designs Bot',
          avatarUrl: ASSETS.logo,
          timestamp,
          embed: {
            title: 'Silence Designs | Official Price List',
            description: '*A 30% Roblox tax may apply to eligible Roblox transactions. Confirm the applicable payment method and tax before finalizing.*',
            color: '#3B82F6',
            fields: [
              { name: '🎨 Graphics', value: '• Logo: R$400+\n• Banners: R$125+\n• Banner Bundle (1 server banner, 10 embed banners, 1 footer banner): R$1,250+\n• Server Bundle: R$1,750+', inline: false },
              { name: '🚔 Livery', value: '• LEO: R$175+\n• FD: R$200+\n• Other: R$150+', inline: false },
              { name: '👕 Clothing', value: '• Full Tactical Set: R$125\n• Shirt / Vest: R$75\n• Pants: R$50', inline: false },
              { name: '🤖 Discord Server & Bot Bundle', value: '• Server Bundle: R$2,000+ (complete channel, role, permission & up to 3 bot setups)\n• Bot Hosting: First 30 days free, then R$250/mo', inline: false }
            ],
            footer: { text: 'To order, run /order-create or open a ticket' }
          }
        }
      ]);
      return;
    }

    if (commandName.startsWith('ai-')) {
      const promptText = parts.slice(1).join(' ') || 'State Police Stealth Patrol';
      setMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          authorTag: 'Silence Designs Bot',
          avatarUrl: ASSETS.logo,
          timestamp,
          embed: {
            title: `Silence Designs AI | ${commandName.toUpperCase()}`,
            description: `Creative concept generated for: **${promptText}**\n\n*Note: This is an AI-assisted creative text suggestion. Design files are handcrafted by Silence Designs designers.*`,
            color: '#3B82F6',
            fields: [
              { name: 'Concept Idea', value: 'Minimalist phantom ghost livery with reflective silver chevron striping along the lower quarter panels, dark carbon roof accent, and modern serif precinct lettering.', inline: false },
              { name: 'Suggested Palette', value: '#10141D (Obsidian Charcoal) • #718096 (Tactical Slate) • #CBD5E0 (Reflective Chrome) • #BE123C (Crimson Accent)', inline: false },
              { name: 'Motto / Slogan', value: '"Vigilance in Silence. Precision in Service."', inline: false }
            ],
            footer: { text: 'AI Creative Suite • Server-side Gemini Engine' }
          }
        }
      ]);
      return;
    }

    // Default response for any of the 50 primary commands
    const foundCmd = ALL_50_PRIMARY_COMMANDS.find(c => c.name === commandName);
    if (foundCmd) {
      setMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          authorTag: 'Silence Designs Bot',
          avatarUrl: ASSETS.logo,
          timestamp,
          embed: {
            title: `Command /${foundCmd.name} Executed`,
            description: `${foundCmd.description}\n\n**Category:** ${foundCmd.category.toUpperCase()}\n**Required Permission:** ${foundCmd.permission}\n**Usage:** \`${foundCmd.usage}\``,
            color: '#3B82F6',
            footer: { text: 'Silence Designs Discord Application System' }
          }
        }
      ]);
    } else {
      setMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          authorTag: 'Silence Designs Bot',
          avatarUrl: ASSETS.logo,
          timestamp,
          content: `⚠️ Unknown slash command \`/${commandName}\`. Type \`/help\` to inspect all 50 primary commands.`
        }
      ]);
    }
  };

  // Ticket dropdown handler
  const handleDropdownCategorySelect = (category: string) => {
    setSelectedTicketCategory(category);
    if (category === 'order') {
      setShowOrderModal(true);
    } else {
      setSupportCategory(category as TicketCategory);
      setShowSupportModal(true);
    }
  };

  // Submit Order Modal
  const handleSubmitOrderModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!robloxUser || !orderSpecs) {
      showToast('Please fill out all required fields');
      return;
    }

    // Create ticket & order
    const createdTicket = createTicket(
      'order',
      'Carlos473',
      `Order: ${orderServiceType} - ${orderSpecs.slice(0, 80)}...`,
      robloxUser
    );

    const createdOrder = createOrder({
      customerDiscordId: '1025813762684502168',
      customerDiscordTag: 'Carlos473',
      customerRobloxUser: robloxUser,
      serviceType: orderServiceType,
      description: orderSpecs,
      preferredColors: orderColors,
      textToInclude: orderText,
      ticketRef: createdTicket.referenceId,
      estimatedPrice: orderServiceType === 'Clothing' ? 'R$125' : orderServiceType === 'Livery' ? 'R$200' : 'R$400'
    });

    setShowOrderModal(false);
    showToast(`Order created: ${createdOrder.id} (${createdTicket.referenceId})`);

    // Post new ticket interaction in simulator
    setMessages(prev => [
      ...prev,
      {
        id: `tkt-opened-${Date.now()}`,
        sender: 'bot',
        authorTag: 'Silence Designs Bot',
        avatarUrl: ASSETS.logo,
        timestamp: 'Just now',
        embed: {
          title: 'Thanks for contacting support — @Carlos473',
          description: 'A member of our team will assist you shortly. Provide all relevant information regarding your issue. Kindly refrain from pinging agents while waiting for a response.',
          color: '#3B82F6',
          thumbnailUrl: ASSETS.logo,
          fields: [
            { name: 'Discord User', value: 'Carlos473 (`1025813762684502168`)', inline: true },
            { name: 'Roblox Username', value: `[${robloxUser}](https://www.roblox.com/search/users?keyword=${robloxUser})`, inline: true },
            { name: 'Category', value: 'Place a Design Order', inline: true },
            { name: 'Reference ID', value: `\`${createdTicket.referenceId}\``, inline: true },
            { name: 'Order ID', value: `\`${createdOrder.id}\``, inline: true },
            { name: 'Service', value: orderServiceType, inline: true },
            { name: 'Inquiry / Specifications', value: orderSpecs, inline: false },
            { name: 'Preferred Colors', value: orderColors || 'Default', inline: true },
            { name: 'Text Included', value: orderText || 'None', inline: true }
          ],
          footer: { text: 'Silence Designs • Exclusive Ticket System' }
        },
        components: 'order_ticket_panel',
        ticketRef: createdTicket.referenceId,
        orderId: createdOrder.id
      }
    ]);

    // Reset fields
    setRobloxUser('');
    setOrderSpecs('');
    setOrderColors('');
    setOrderText('');
  };

  // Submit General Support Modal
  const handleSubmitSupportModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportInquiry) return;

    const fullInquiry = supportCategory.includes('report')
      ? `REPORT: User ${reportedUser || 'Unknown'}\nReason: ${supportInquiry}`
      : supportInquiry;

    const createdTicket = createTicket(supportCategory, 'Carlos473', fullInquiry);

    setShowSupportModal(false);
    showToast(`Ticket created: ${createdTicket.referenceId}`);

    setMessages(prev => [
      ...prev,
      {
        id: `tkt-opened-${Date.now()}`,
        sender: 'bot',
        authorTag: 'Silence Designs Bot',
        avatarUrl: ASSETS.logo,
        timestamp: 'Just now',
        embed: {
          title: 'Thanks for contacting support — @Carlos473',
          description: 'A member of our team will assist you shortly. Provide all relevant information regarding your issue. Kindly refrain from pinging agents while waiting for a response.',
          color: supportCategory.includes('report') ? '#E11D48' : '#3B82F6',
          thumbnailUrl: ASSETS.logo,
          fields: [
            { name: 'Discord User', value: 'Carlos473 (`1025813762684502168`)', inline: true },
            { name: 'Category', value: supportCategory.replace('_', ' ').toUpperCase(), inline: true },
            { name: 'Reference ID', value: `\`${createdTicket.referenceId}\``, inline: true },
            { name: 'Inquiry', value: fullInquiry, inline: false }
          ],
          footer: { text: 'Silence Designs • Exclusive Support Ticket' }
        },
        components: 'order_ticket_panel',
        ticketRef: createdTicket.referenceId
      }
    ]);

    setSupportInquiry('');
    setReportedUser('');
  };

  return (
    <div className="flex flex-col h-full bg-[#0B0E14] text-slate-100 rounded-xl overflow-hidden border border-[#232D3F]">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="absolute top-4 right-4 z-50 bg-[#161D2D] border border-blue-500/40 text-blue-300 text-xs px-4 py-2 rounded-lg shadow-xl animate-fade-in">
          {toastMessage}
        </div>
      )}

      {/* Prominent Sandbox Notice Banner */}
      <div className="bg-[#161D2D] border-b border-blue-500/30 px-4 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-blue-300">
          <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
          <span>
            <strong>Interactive Discord Client Simulator</strong> — Test commands and preview ticket flows in a safe sandbox without altering live server channels.
          </span>
        </div>
        <span className="font-mono text-[10px] text-blue-400/80 uppercase font-semibold hidden sm:inline">
          Client Sandbox Mode
        </span>
      </div>

      {/* Simulator Discord-Style Header */}
      <div className="bg-[#111622] px-4 py-3 border-b border-[#232D3F] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-slate-200 font-semibold text-sm">
            <Hash className="w-4 h-4 text-slate-400" />
            <span>{channel}</span>
          </div>
          <span className="text-xs text-slate-400 hidden sm:inline">
            Interactive Discord Client Simulator • Real Slash Command & Panel Engine
          </span>
        </div>

        {/* Channel Switcher */}
        <div className="flex items-center gap-1 bg-[#0B0E14] p-1 rounded-lg border border-[#232D3F]">
          {(['support', 'services', 'announcements', 'giveaways', 'general'] as const).map(c => (
            <button
              key={c}
              onClick={() => setChannel(c)}
              className={`px-2.5 py-1 text-xs rounded transition-colors ${
                channel === c
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              #{c}
            </button>
          ))}
        </div>
      </div>

      {/* Rotating Activity Ticker Bar */}
      <div className="bg-[#0e131d] px-4 py-1.5 border-b border-[#1f2838] flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
          <span className="text-slate-300 font-medium">Silence Designs Bot</span>
          <span>·</span>
          <span>
            {currentRotatingActivity ? `${currentRotatingActivity.type} ${currentRotatingActivity.text}` : 'Powering Silence Designs'}
          </span>
        </div>
        <div className="flex items-center gap-3 font-mono text-[11px] text-slate-400">
          <span>Latency: 22ms</span>
          <span>·</span>
          <span>discord.js v14</span>
        </div>
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(msg => (
          <div key={msg.id} className="flex items-start gap-3 text-sm">
            {/* Avatar */}
            <img
              src={msg.avatarUrl || ASSETS.logo}
              alt={msg.authorTag}
              className="w-10 h-10 rounded-full border border-[#232D3F] object-cover shrink-0"
              referrerPolicy="no-referrer"
            />

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-100">{msg.authorTag}</span>
                {msg.sender === 'bot' && (
                  <span className="bg-blue-600/90 text-[10px] text-white px-1.5 py-0.2 rounded font-medium">
                    BOT
                  </span>
                )}
                {msg.isStaff && (
                  <span className="bg-slate-700 text-[10px] text-slate-200 px-1.5 py-0.2 rounded">
                    STAFF
                  </span>
                )}
                <span className="text-[11px] text-slate-400">{msg.timestamp}</span>
              </div>

              {msg.content && (
                <div className="text-slate-300 mt-1 whitespace-pre-wrap leading-relaxed">
                  {msg.content}
                </div>
              )}

              {/* Rich Discord Embed */}
              {msg.embed && (
                <div
                  className="mt-2.5 rounded-lg border-l-4 bg-[#111622] p-4 text-xs border border-[#232D3F] max-w-2xl"
                  style={{ borderLeftColor: msg.embed.color || '#3B82F6' }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-2 flex-1">
                      {msg.embed.author && (
                        <div className="text-[11px] font-medium text-slate-400">
                          {msg.embed.author.name}
                        </div>
                      )}
                      <h4 className="text-sm font-bold text-white tracking-tight">
                        {msg.embed.title}
                      </h4>
                      <p className="text-slate-300 whitespace-pre-wrap leading-relaxed">
                        {msg.embed.description}
                      </p>
                    </div>

                    {msg.embed.thumbnailUrl && (
                      <img
                        src={msg.embed.thumbnailUrl}
                        alt="Thumbnail"
                        className="w-16 h-16 rounded object-cover border border-[#232D3F] shrink-0"
                        referrerPolicy="no-referrer"
                      />
                    )}
                  </div>

                  {/* Embed Fields */}
                  {msg.embed.fields && msg.embed.fields.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 pt-3 border-t border-[#1f2838]">
                      {msg.embed.fields.map((f, i) => (
                        <div key={i} className={f.inline ? '' : 'md:col-span-2'}>
                          <div className="font-semibold text-slate-200">{f.name}</div>
                          <div className="text-slate-400 mt-0.5 whitespace-pre-wrap">{f.value}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {msg.embed.imageUrl && (
                    <img
                      src={msg.embed.imageUrl}
                      alt="Embed Banner"
                      className="w-full h-44 object-cover rounded mt-3 border border-[#232D3F]"
                      referrerPolicy="no-referrer"
                    />
                  )}

                  {msg.embed.footer && (
                    <div className="mt-3 pt-2 text-[11px] text-slate-400 border-t border-[#1f2838]">
                      {msg.embed.footer.text}
                    </div>
                  )}
                </div>
              )}

              {/* Component Buttons & Dropdowns */}
              {msg.components === 'ticket_panel' && (
                <div className="mt-3 max-w-md space-y-2 bg-[#0B0E14] p-3 rounded-lg border border-[#232D3F]">
                  <label className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
                    Select inquiry category:
                  </label>
                  <div className="relative">
                    <select
                      value={selectedTicketCategory}
                      onChange={e => handleDropdownCategorySelect(e.target.value)}
                      className="w-full bg-[#161D2D] border border-[#2b374d] text-slate-200 text-xs rounded-lg px-3 py-2.5 appearance-none focus:outline-none focus:border-blue-500 cursor-pointer"
                    >
                      <option value="">Choose a ticket category...</option>
                      <option value="order">📦 Place a Design Order</option>
                      <option value="general">💬 General Support</option>
                      <option value="report_member">🛡️ Report a Member</option>
                      <option value="report_designer">⚠️ Report a Designer</option>
                      <option value="billing">💳 Billing and Purchases</option>
                      <option value="partnership">🤝 Partnerships</option>
                      <option value="advertisement">📢 Advertisements</option>
                      <option value="other">❓ Other Inquiry</option>
                    </select>
                    <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                  </div>
                </div>
              )}

              {msg.components === 'order_ticket_panel' && (
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={() => {
                      if (msg.ticketRef) {
                        const targetTicket = tickets.find(t => t.referenceId === msg.ticketRef);
                        if (targetTicket) {
                          claimTicket(targetTicket.id, 'Carlos473', '1025813762684502168');
                          showToast(`Ticket claimed exclusively by @Carlos473`);
                        }
                      }
                    }}
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded text-xs font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    Claim Ticket
                  </button>

                  <button
                    onClick={() => {
                      if (msg.ticketRef) {
                        const targetTicket = tickets.find(t => t.referenceId === msg.ticketRef);
                        if (targetTicket) {
                          closeTicket(targetTicket.id, 'Resolved by staff', 'Carlos473');
                          showToast(`Ticket closed. Receipt sent.`);
                        }
                      }
                    }}
                    className="px-3 py-1.5 bg-[#1F2937] hover:bg-red-700 text-slate-200 hover:text-white rounded text-xs font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    Close Ticket
                  </button>

                  <button
                    onClick={() => {
                      showToast('Private report logged to executive team.');
                    }}
                    className="px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900 border border-rose-800/60 text-rose-300 rounded text-xs font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Report
                  </button>
                </div>
              )}

              {msg.components === 'giveaway_panel' && msg.giveawayId && (
                <div className="mt-3 flex items-center gap-2">
                  <button
                    onClick={() => {
                      const res = joinGiveaway(msg.giveawayId!, 'Carlos473');
                      showToast(res.message);
                    }}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold rounded flex items-center gap-1.5 shadow-md transition-colors"
                  >
                    <Gift className="w-4 h-4" />
                    Join Giveaway
                  </button>
                  <span className="text-xs text-slate-400">
                    {giveaways.find(g => g.id === msg.giveawayId)?.entries.length || 0} participants entered
                  </span>
                </div>
              )}

              {msg.components === 'services_panel' && (
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    onClick={() => executeSimulatedCommand('price-list')}
                    className="px-3 py-1.5 bg-[#161D2D] hover:bg-[#1E293B] text-slate-200 border border-[#232D3F] rounded text-xs font-medium"
                  >
                    Prices
                  </button>
                  <a
                    href={settings.msaUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-3 py-1.5 bg-[#161D2D] hover:bg-[#1E293B] text-slate-200 border border-[#232D3F] rounded text-xs font-medium flex items-center gap-1"
                  >
                    Terms <ExternalLink className="w-3 h-3 text-slate-400" />
                  </a>
                  <button
                    onClick={() => executeSimulatedCommand('group-info')}
                    className="px-3 py-1.5 bg-[#161D2D] hover:bg-[#1E293B] text-slate-200 border border-[#232D3F] rounded text-xs font-medium"
                  >
                    Roblox Group
                  </button>
                </div>
              )}

              {msg.components === 'faq_panel' && (
                <div className="mt-3 max-w-xl space-y-1.5">
                  {faqs.map(faq => {
                    const isOpen = expandedFaqId === faq.id;
                    return (
                      <div
                        key={faq.id}
                        className="bg-[#111622] border border-[#232D3F] rounded-lg overflow-hidden"
                      >
                        <button
                          onClick={() => setExpandedFaqId(isOpen ? null : faq.id)}
                          className="w-full px-3.5 py-2.5 text-left text-xs font-medium text-slate-200 flex items-center justify-between hover:bg-[#161D2D] transition-colors"
                        >
                          <span>{faq.id}. {faq.question}</span>
                          <ChevronDown
                            className={`w-3.5 h-3.5 text-slate-400 transition-transform ${
                              isOpen ? 'rotate-180' : ''
                            }`}
                          />
                        </button>
                        {isOpen && (
                          <div className="px-3.5 py-2.5 text-xs text-slate-300 bg-[#0B0E14] border-t border-[#1f2838] leading-relaxed">
                            {faq.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setSupportCategory('general');
                        setShowSupportModal(true);
                      }}
                      className="w-full py-2.5 bg-rose-900/40 hover:bg-rose-900/60 border border-rose-700/60 text-rose-200 font-semibold text-xs rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      <HelpCircle className="w-4 h-4 text-rose-400" />
                      Still Need Assistance? Open Support Ticket
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Auto-suggest dropdown */}
      {commandSuggestions.length > 0 && (
        <div className="bg-[#111622] border-t border-[#232D3F] max-h-48 overflow-y-auto p-1 divide-y divide-[#1f2838]">
          <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Slash Commands ({commandSuggestions.length} matching)
          </div>
          {commandSuggestions.map(cmd => (
            <button
              key={cmd.name}
              onClick={() => handleSelectCommand(cmd.name)}
              className="w-full px-3 py-1.5 text-left text-xs hover:bg-[#161D2D] rounded flex items-center justify-between group text-slate-200"
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold text-blue-400">/{cmd.name}</span>
                <span className="text-slate-400 truncate max-w-xs">{cmd.description}</span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono">{cmd.category}</span>
            </button>
          ))}
        </div>
      )}

      {/* Chat Input Bar */}
      <form onSubmit={handleSendMessage} className="bg-[#111622] p-3 border-t border-[#232D3F] flex items-center gap-2">
        <input
          type="text"
          value={inputVal}
          onChange={handleInputChange}
          placeholder={`Message #${channel} or type / for all 50 commands...`}
          className="flex-1 bg-[#0B0E14] border border-[#232D3F] text-slate-200 text-xs px-3.5 py-2 rounded-lg focus:outline-none focus:border-blue-500 placeholder-slate-400"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-500 text-white p-2 rounded-lg transition-colors shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>

      {/* Guided Order Modal (Discord Native Modal Simulation) */}
      {showOrderModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111622] border border-[#232D3F] w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-in fade-in">
            <div className="px-5 py-4 border-b border-[#232D3F] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <TicketIcon className="w-5 h-5 text-blue-400" />
                <h3 className="text-sm font-bold text-white">Silence Designs | Place a Design Order</h3>
              </div>
              <button onClick={() => setShowOrderModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitOrderModal} className="p-5 space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Roblox Username *</label>
                <input
                  type="text"
                  required
                  value={robloxUser}
                  onChange={e => setRobloxUser(e.target.value)}
                  placeholder="e.g. OfficerValkyrie"
                  className="w-full bg-[#0B0E14] border border-[#232D3F] rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Service Type *</label>
                <select
                  value={orderServiceType}
                  onChange={e => setOrderServiceType(e.target.value)}
                  className="w-full bg-[#0B0E14] border border-[#232D3F] rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-blue-500 cursor-pointer"
                >
                  <option value="Livery">Livery (LEO / FD / Other)</option>
                  <option value="Clothing">Clothing (Uniform / Vest / Tactical)</option>
                  <option value="Graphics">Graphics (Logo / Banner / Bundle)</option>
                  <option value="Bot Development">Bot Development & Hosting</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description & Specifications *</label>
                <textarea
                  required
                  rows={3}
                  value={orderSpecs}
                  onChange={e => setOrderSpecs(e.target.value)}
                  placeholder="Vehicle model, department name, badge details, style references..."
                  className="w-full bg-[#0B0E14] border border-[#232D3F] rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Preferred Colors</label>
                  <input
                    type="text"
                    value={orderColors}
                    onChange={e => setOrderColors(e.target.value)}
                    placeholder="e.g. Matte Black / White"
                    className="w-full bg-[#0B0E14] border border-[#232D3F] rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Text to Include</label>
                  <input
                    type="text"
                    value={orderText}
                    onChange={e => setOrderText(e.target.value)}
                    placeholder="e.g. POLICE / K-9 UNIT"
                    className="w-full bg-[#0B0E14] border border-[#232D3F] rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-[#232D3F] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowOrderModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold shadow-md"
                >
                  Submit Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Guided Support / Report Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#111622] border border-[#232D3F] w-full max-w-md rounded-xl shadow-2xl overflow-hidden">
            <div className="px-5 py-4 border-b border-[#232D3F] flex items-center justify-between">
              <h3 className="text-sm font-bold text-white capitalize">
                {supportCategory.replace('_', ' ')} Inquiry
              </h3>
              <button onClick={() => setShowSupportModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitSupportModal} className="p-5 space-y-3.5 text-xs">
              {supportCategory.includes('report') && (
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Person Being Reported *</label>
                  <input
                    type="text"
                    required
                    value={reportedUser}
                    onChange={e => setReportedUser(e.target.value)}
                    placeholder="Discord Tag or ID"
                    className="w-full bg-[#0B0E14] border border-[#232D3F] rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  {supportCategory.includes('report') ? 'Reason & Supporting Evidence *' : 'Please Describe Your Issue *'}
                </label>
                <textarea
                  required
                  rows={4}
                  value={supportInquiry}
                  onChange={e => setSupportInquiry(e.target.value)}
                  placeholder="Provide all relevant details so our team can assist efficiently..."
                  className="w-full bg-[#0B0E14] border border-[#232D3F] rounded-lg px-3 py-2 text-slate-100 focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="pt-3 border-t border-[#232D3F] flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSupportModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`px-5 py-2 text-white rounded-lg font-semibold shadow-md ${
                    supportCategory.includes('report')
                      ? 'bg-rose-600 hover:bg-rose-500'
                      : 'bg-blue-600 hover:bg-blue-500'
                  }`}
                >
                  Open Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
