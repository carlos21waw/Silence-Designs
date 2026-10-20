import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  ServiceItem,
  Order,
  Ticket,
  Advertisement,
  Giveaway,
  ModerationCase,
  Application,
  HostedBot,
  ActivityMessage,
  StoreProduct,
  FAQItem,
  BotGuildSettings,
  OrderStatus,
  TicketCategory
} from '../types';
import {
  INITIAL_SERVICES,
  INITIAL_ORDERS,
  INITIAL_TICKETS,
  INITIAL_ADVERTISEMENTS,
  INITIAL_GIVEAWAYS,
  INITIAL_HOSTED_BOTS,
  INITIAL_ACTIVITIES,
  INITIAL_STORE_PRODUCTS,
  INITIAL_MODERATION_LOGS,
  INITIAL_APPLICATIONS,
  INITIAL_FAQS,
  INITIAL_SETTINGS
} from '../data/initialData';

interface BotDataContextType {
  services: ServiceItem[];
  orders: Order[];
  tickets: Ticket[];
  advertisements: Advertisement[];
  giveaways: Giveaway[];
  hostedBots: HostedBot[];
  activities: ActivityMessage[];
  storeProducts: StoreProduct[];
  moderationLogs: ModerationCase[];
  applications: Application[];
  faqs: FAQItem[];
  settings: BotGuildSettings;
  currentRotatingActivity: ActivityMessage | null;
  botUptimeSeconds: number;
  apiLatencyMs: number;

  // Actions
  toggleServiceStatus: (id: string) => void;
  updateServiceDetails: (id: string, updates: Partial<ServiceItem>) => void;
  createOrder: (order: Partial<Order>) => Order;
  updateOrderStatus: (orderId: string, status: OrderStatus, note?: string) => void;
  assignOrderDesigner: (orderId: string, designer: string) => void;
  submitOrderReview: (orderId: string, rating: number, comment: string) => boolean;
  createTicket: (category: TicketCategory, creatorTag: string, inquiry: string, robloxUser?: string) => Ticket;
  claimTicket: (ticketId: string, staffTag: string, staffId: string) => boolean;
  closeTicket: (ticketId: string, reason: string, staffTag: string) => Ticket | null;
  addTicketMessage: (ticketId: string, author: string, authorTag: string, content: string, isStaff?: boolean, isBot?: boolean) => void;
  setTicketPriority: (ticketId: string, priority: Ticket['priority']) => void;
  approveAd: (adId: string) => void;
  rejectAd: (adId: string, reason?: string) => void;
  publishAd: (adId: string) => void;
  createAd: (ad: Partial<Advertisement>) => Advertisement;
  joinGiveaway: (giveawayId: string, userTag: string) => { success: boolean; message: string };
  drawGiveawayWinner: (giveawayId: string) => string[];
  rerollGiveaway: (giveawayId: string) => string[];
  cancelGiveaway: (giveawayId: string) => void;
  createGiveaway: (gw: Partial<Giveaway>) => Giveaway;
  addModerationCase: (
    action: ModerationCase['action'],
    targetUser: string,
    targetUserId: string,
    reason: string,
    moderator?: string,
    details?: string
  ) => ModerationCase;
  clearWarning: (targetUserId: string, caseId?: string) => void;
  submitApplication: (app: Partial<Application>) => Application;
  reviewApplication: (appId: string, status: 'accepted' | 'denied', reason: string, reviewer: string) => void;
  renewBotHosting: (botId: string, plan: HostedBot['plan']) => void;
  toggleActivity: (id: string) => void;
  addActivity: (text: string, type: ActivityMessage['type']) => void;
  deleteActivity: (id: string) => void;
  updateProduct: (id: string, updates: Partial<StoreProduct>) => void;
  updateSettings: (updates: Partial<BotGuildSettings>) => void;
  updateFAQ: (id: number, answer: string) => void;
  resetToDefaults: () => void;
}

const BotDataContext = createContext<BotDataContextType | null>(null);

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(`silence_${key}`);
    return item ? JSON.parse(item) : fallback;
  } catch (err) {
    console.error(`Error loading ${key} from localStorage:`, err);
    return fallback;
  }
}

function saveStorage<T>(key: string, data: T) {
  try {
    localStorage.setItem(`silence_${key}`, JSON.stringify(data));
  } catch (err) {
    console.error(`Error saving ${key} to localStorage:`, err);
  }
}

export const BotDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<ServiceItem[]>(() => loadStorage('services', INITIAL_SERVICES));
  const [orders, setOrders] = useState<Order[]>(() => loadStorage('orders', INITIAL_ORDERS));
  const [tickets, setTickets] = useState<Ticket[]>(() => loadStorage('tickets', INITIAL_TICKETS));
  const [advertisements, setAdvertisements] = useState<Advertisement[]>(() => loadStorage('advertisements', INITIAL_ADVERTISEMENTS));
  const [giveaways, setGiveaways] = useState<Giveaway[]>(() => loadStorage('giveaways', INITIAL_GIVEAWAYS));
  const [hostedBots, setHostedBots] = useState<HostedBot[]>(() => loadStorage('hosted_bots', INITIAL_HOSTED_BOTS));
  const [activities, setActivities] = useState<ActivityMessage[]>(() => loadStorage('activities', INITIAL_ACTIVITIES));
  const [storeProducts, setStoreProducts] = useState<StoreProduct[]>(() => loadStorage('store_products', INITIAL_STORE_PRODUCTS));
  const [moderationLogs, setModerationLogs] = useState<ModerationCase[]>(() => loadStorage('moderation', INITIAL_MODERATION_LOGS));
  const [applications, setApplications] = useState<Application[]>(() => loadStorage('applications', INITIAL_APPLICATIONS));
  const [faqs, setFaqs] = useState<FAQItem[]>(() => loadStorage('faqs', INITIAL_FAQS));
  const [settings, setSettings] = useState<BotGuildSettings>(() => loadStorage('settings', INITIAL_SETTINGS));

  const [activeActivityIndex, setActiveActivityIndex] = useState(0);
  const [botUptimeSeconds, setBotUptimeSeconds] = useState(148920); // ~1.7 days simulated
  const [apiLatencyMs, setApiLatencyMs] = useState(24);

  // Sync to localStorage
  useEffect(() => { saveStorage('services', services); }, [services]);
  useEffect(() => { saveStorage('orders', orders); }, [orders]);
  useEffect(() => { saveStorage('tickets', tickets); }, [tickets]);
  useEffect(() => { saveStorage('advertisements', advertisements); }, [advertisements]);
  useEffect(() => { saveStorage('giveaways', giveaways); }, [giveaways]);
  useEffect(() => { saveStorage('hosted_bots', hostedBots); }, [hostedBots]);
  useEffect(() => { saveStorage('activities', activities); }, [activities]);
  useEffect(() => { saveStorage('store_products', storeProducts); }, [storeProducts]);
  useEffect(() => { saveStorage('moderation', moderationLogs); }, [moderationLogs]);
  useEffect(() => { saveStorage('applications', applications); }, [applications]);
  useEffect(() => { saveStorage('faqs', faqs); }, [faqs]);
  useEffect(() => { saveStorage('settings', settings); }, [settings]);

  // Activity Rotation every 30 seconds as specified in requirement #18
  useEffect(() => {
    const enabled = activities.filter(a => a.enabled);
    if (enabled.length === 0) return;

    const interval = setInterval(() => {
      setActiveActivityIndex(prev => (prev + 1) % enabled.length);
    }, 30000);

    return () => clearInterval(interval);
  }, [activities]);

  // Live timer & ping jitter
  useEffect(() => {
    const timer = setInterval(() => {
      setBotUptimeSeconds(prev => prev + 1);
      // Realistic Discord REST API latency jitter between 19ms and 28ms
      setApiLatencyMs(Math.floor(20 + Math.random() * 8));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const enabledActivities = activities.filter(a => a.enabled);
  const currentRotatingActivity = enabledActivities.length > 0
    ? enabledActivities[activeActivityIndex % enabledActivities.length]
    : null;

  // Actions
  const toggleServiceStatus = (id: string) => {
    setServices(prev => prev.map(s => {
      if (s.id === id) {
        return { ...s, status: s.status === 'open' ? 'closed' : 'open' };
      }
      return s;
    }));
  };

  const updateServiceDetails = (id: string, updates: Partial<ServiceItem>) => {
    setServices(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const createOrder = (orderData: Partial<Order>): Order => {
    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
      customerDiscordId: orderData.customerDiscordId || '1025813762684502168',
      customerDiscordTag: orderData.customerDiscordTag || 'UserClient#1001',
      customerRobloxUser: orderData.customerRobloxUser || 'RobloxClient',
      serviceType: orderData.serviceType || 'Graphics',
      description: orderData.description || 'Custom request',
      preferredColors: orderData.preferredColors || 'Default styling',
      textToInclude: orderData.textToInclude || '',
      referenceImages: orderData.referenceImages || [],
      estimatedPrice: orderData.estimatedPrice || 'R$250',
      finalPrice: orderData.finalPrice || 'R$250',
      status: 'submitted',
      assignedDesigner: undefined,
      ticketRef: orderData.ticketRef,
      notes: ['Order submitted via guided flow.'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    setOrders(prev => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = (orderId: string, status: OrderStatus, note?: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        const updatedNotes = note ? [...o.notes, note] : o.notes;
        return {
          ...o,
          status,
          notes: updatedNotes,
          updatedAt: new Date().toISOString()
        };
      }
      return o;
    }));
  };

  const assignOrderDesigner = (orderId: string, designer: string) => {
    setOrders(prev => prev.map(o => {
      if (o.id === orderId) {
        return {
          ...o,
          assignedDesigner: designer,
          status: o.status === 'submitted' || o.status === 'pending_review' ? 'accepted' : o.status,
          notes: [...o.notes, `Claimed by designer ${designer}`],
          updatedAt: new Date().toISOString()
        };
      }
      return o;
    }));
  };

  const submitOrderReview = (orderId: string, rating: number, comment: string): boolean => {
    let success = false;
    setOrders(prev => prev.map(o => {
      if (o.id === orderId && o.status === 'completed' && !o.review) {
        success = true;
        return {
          ...o,
          review: {
            rating: Math.max(1, Math.min(5, rating)),
            comment,
            createdAt: new Date().toISOString()
          },
          updatedAt: new Date().toISOString()
        };
      }
      return o;
    }));
    return success;
  };

  const createTicket = (
    category: TicketCategory,
    creatorTag: string,
    inquiry: string,
    robloxUser?: string
  ): Ticket => {
    const hex = Math.random().toString(16).substring(2, 10).toUpperCase();
    const referenceId = `REF-${hex}`;
    const cleanTag = creatorTag.replace(/[^a-zA-Z0-9]/g, '').toLowerCase().slice(0, 10);
    const channelName = `ticket-${cleanTag}-${category}`;

    const newTicket: Ticket = {
      id: `tkt-${Date.now()}`,
      referenceId,
      category,
      channelName,
      status: 'open',
      creatorDiscordId: '1025813762684502168',
      creatorDiscordTag: creatorTag,
      creatorRobloxUser: robloxUser,
      priority: 'normal',
      inquiry,
      createdAt: new Date().toISOString(),
      messages: [
        {
          id: `msg-${Date.now()}-bot`,
          author: 'Silence Designs Bot',
          authorTag: 'SilenceBot#0001',
          isBot: true,
          content: `Thanks for contacting support — @${creatorTag}\nA member of our team will assist you shortly. Provide all relevant information regarding your issue. Kindly refrain from pinging agents while waiting for a response.`,
          timestamp: new Date().toISOString()
        },
        {
          id: `msg-${Date.now()}-user`,
          author: creatorTag,
          authorTag: creatorTag,
          content: inquiry,
          timestamp: new Date().toISOString()
        }
      ]
    };

    setTickets(prev => [newTicket, ...prev]);
    return newTicket;
  };

  const claimTicket = (ticketId: string, staffTag: string, staffId: string): boolean => {
    let success = false;
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId && t.status === 'open') {
        success = true;
        return {
          ...t,
          status: 'claimed',
          claimedBy: staffId,
          claimedByTag: staffTag,
          messages: [
            ...t.messages,
            {
              id: `msg-${Date.now()}-claim`,
              author: staffTag,
              authorTag: staffTag,
              isStaff: true,
              content: `🔒 Ticket claimed by @${staffTag}. I will be assisting you.`,
              timestamp: new Date().toISOString()
            }
          ]
        };
      }
      return t;
    }));
    return success;
  };

  const closeTicket = (ticketId: string, reason: string, staffTag: string): Ticket | null => {
    let closedTicket: Ticket | null = null;
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId && t.status !== 'closed') {
        closedTicket = {
          ...t,
          status: 'closed',
          closureReason: reason,
          closedAt: new Date().toISOString(),
          closedBy: staffTag,
          messages: [
            ...t.messages,
            {
              id: `msg-${Date.now()}-close`,
              author: 'Silence Designs Bot',
              authorTag: 'SilenceBot#0001',
              isBot: true,
              content: `Ticket Closure Receipt:\nReference ID: ${t.referenceId}\nHandler: @${staffTag}\nReason: ${reason}\n\nYour support ticket was resolved and has now been closed. If you need further assistance, please open a new ticket with this reference ID.`,
              timestamp: new Date().toISOString()
            }
          ]
        };
        return closedTicket;
      }
      return t;
    }));
    return closedTicket;
  };

  const addTicketMessage = (
    ticketId: string,
    author: string,
    authorTag: string,
    content: string,
    isStaff = false,
    isBot = false
  ) => {
    setTickets(prev => prev.map(t => {
      if (t.id === ticketId) {
        return {
          ...t,
          messages: [
            ...t.messages,
            {
              id: `msg-${Date.now()}`,
              author,
              authorTag,
              content,
              isStaff,
              isBot,
              timestamp: new Date().toISOString()
            }
          ]
        };
      }
      return t;
    }));
  };

  const setTicketPriority = (ticketId: string, priority: Ticket['priority']) => {
    setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, priority } : t));
  };

  const approveAd = (adId: string) => {
    setAdvertisements(prev => prev.map(a => a.id === adId ? { ...a, status: 'approved' } : a));
  };

  const rejectAd = (adId: string, reason?: string) => {
    setAdvertisements(prev => prev.map(a => a.id === adId ? { ...a, status: 'rejected', notes: reason } : a));
  };

  const publishAd = (adId: string) => {
    setAdvertisements(prev => prev.map(a => a.id === adId ? { ...a, status: 'published' } : a));
  };

  const createAd = (adData: Partial<Advertisement>): Advertisement => {
    const newAd: Advertisement = {
      id: `ad-${Date.now()}`,
      serverName: adData.serverName || 'My ER:LC Server',
      title: adData.title || 'Official Community Advertisement',
      promotion: adData.promotion || 'Join our realistic roleplay server!',
      inviteLink: adData.inviteLink || 'https://discord.gg/example',
      pingType: adData.pingType || 'here_ping',
      addons: adData.addons || [],
      cost: adData.cost || 350,
      currency: adData.currency || 'R$',
      status: 'queue',
      queuePosition: advertisements.filter(a => a.status === 'queue').length + 1,
      submittedBy: adData.submittedBy || 'ServerOwner#0001',
      submittedAt: new Date().toISOString()
    };
    setAdvertisements(prev => [...prev, newAd]);
    return newAd;
  };

  const joinGiveaway = (giveawayId: string, userTag: string): { success: boolean; message: string } => {
    let result = { success: false, message: 'Giveaway not found' };
    setGiveaways(prev => prev.map(gw => {
      if (gw.id === giveawayId) {
        if (gw.status !== 'active') {
          result = { success: false, message: 'This giveaway is already ended or cancelled.' };
          return gw;
        }
        if (gw.entries.includes(userTag)) {
          result = { success: false, message: 'You have already entered this giveaway!' };
          return gw;
        }
        result = { success: true, message: 'You are entered. Good luck!' };
        return {
          ...gw,
          entries: [...gw.entries, userTag]
        };
      }
      return gw;
    }));
    return result;
  };

  const drawGiveawayWinner = (giveawayId: string): string[] => {
    let pickedWinners: string[] = [];
    setGiveaways(prev => prev.map(gw => {
      if (gw.id === giveawayId && gw.status === 'active') {
        const pool = [...gw.entries];
        const winners: string[] = [];
        const count = Math.min(gw.winnersCount, pool.length);
        for (let i = 0; i < count; i++) {
          const randIdx = Math.floor(Math.random() * pool.length);
          winners.push(pool.splice(randIdx, 1)[0]);
        }
        pickedWinners = winners;
        return {
          ...gw,
          winners,
          status: 'ended'
        };
      }
      return gw;
    }));
    return pickedWinners;
  };

  const rerollGiveaway = (giveawayId: string): string[] => {
    let newWinners: string[] = [];
    setGiveaways(prev => prev.map(gw => {
      if (gw.id === giveawayId && gw.entries.length > 0) {
        const pool = [...gw.entries];
        const winners: string[] = [];
        const count = Math.min(gw.winnersCount, pool.length);
        for (let i = 0; i < count; i++) {
          const randIdx = Math.floor(Math.random() * pool.length);
          winners.push(pool.splice(randIdx, 1)[0]);
        }
        newWinners = winners;
        return {
          ...gw,
          winners,
          status: 'ended'
        };
      }
      return gw;
    }));
    return newWinners;
  };

  const cancelGiveaway = (giveawayId: string) => {
    setGiveaways(prev => prev.map(gw => gw.id === giveawayId ? { ...gw, status: 'cancelled' } : gw));
  };

  const createGiveaway = (data: Partial<Giveaway>): Giveaway => {
    const newGw: Giveaway = {
      id: `gw-${Date.now()}`,
      prize: data.prize || '1 Month Discord Nitro',
      sponsor: data.sponsor || 'Silence Designs',
      serverName: data.serverName || 'Silence Designs Community',
      serverInvite: data.serverInvite,
      winnersCount: data.winnersCount || 1,
      entries: [],
      winners: [],
      status: 'active',
      endsAt: data.endsAt || new Date(Date.now() + 86400000 * 3).toISOString(),
      createdAt: new Date().toISOString(),
      isSponsored: Boolean(data.isSponsored)
    };
    setGiveaways(prev => [newGw, ...prev]);
    return newGw;
  };

  const addModerationCase = (
    action: ModerationCase['action'],
    targetUser: string,
    targetUserId: string,
    reason: string,
    moderator = 'StaffMod',
    details?: string
  ): ModerationCase => {
    const newCase: ModerationCase = {
      id: `case-${Date.now()}`,
      caseNumber: (moderationLogs[0]?.caseNumber || 100) + 1,
      targetUser,
      targetUserId,
      moderator,
      moderatorId: '1025813762684502168',
      action,
      reason,
      timestamp: new Date().toISOString(),
      details
    };
    setModerationLogs(prev => [newCase, ...prev]);
    return newCase;
  };

  const clearWarning = (targetUserId: string, caseId?: string) => {
    if (caseId) {
      setModerationLogs(prev => prev.filter(c => c.id !== caseId));
    } else {
      setModerationLogs(prev => prev.filter(c => !(c.targetUserId === targetUserId && c.action === 'warn')));
    }
  };

  const submitApplication = (appData: Partial<Application>): Application => {
    const newApp: Application = {
      id: `app-${Date.now()}`,
      type: appData.type || 'designer',
      applicantTag: appData.applicantTag || 'Applicant#0000',
      applicantId: appData.applicantId || `${Date.now()}`,
      robloxUser: appData.robloxUser || 'RobloxUser',
      portfolioOrExperience: appData.portfolioOrExperience || '',
      availability: appData.availability || 'Part time',
      motivation: appData.motivation || '',
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    setApplications(prev => [newApp, ...prev]);
    return newApp;
  };

  const reviewApplication = (
    appId: string,
    status: 'accepted' | 'denied',
    reason: string,
    reviewer: string
  ) => {
    setApplications(prev => prev.map(a => {
      if (a.id === appId) {
        return {
          ...a,
          status,
          decisionReason: reason,
          reviewer,
          notes: `Reviewed by ${reviewer} at ${new Date().toLocaleTimeString()}`
        };
      }
      return a;
    }));
  };

  const renewBotHosting = (botId: string, plan: HostedBot['plan']) => {
    const daysToAdd = plan.includes('30') ? 30 : plan.includes('90') ? 90 : 180;
    setHostedBots(prev => prev.map(b => {
      if (b.id === botId) {
        const nextDate = new Date(Date.now() + daysToAdd * 86400000).toISOString().split('T')[0];
        return {
          ...b,
          plan,
          status: 'online',
          renewalDate: nextDate,
          daysRemaining: daysToAdd
        };
      }
      return b;
    }));
  };

  const toggleActivity = (id: string) => {
    setActivities(prev => prev.map(a => a.id === id ? { ...a, enabled: !a.enabled } : a));
  };

  const addActivity = (text: string, type: ActivityMessage['type']) => {
    const newAct: ActivityMessage = {
      id: `${Date.now()}`,
      text,
      type,
      enabled: true
    };
    setActivities(prev => [...prev, newAct]);
  };

  const deleteActivity = (id: string) => {
    setActivities(prev => prev.filter(a => a.id !== id));
  };

  const updateProduct = (id: string, updates: Partial<StoreProduct>) => {
    setStoreProducts(prev => prev.map(p => p.id === id ? { ...p, ...updates } : p));
  };

  const updateSettings = (updates: Partial<BotGuildSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const updateFAQ = (id: number, answer: string) => {
    setFaqs(prev => prev.map(f => f.id === id ? { ...f, answer } : f));
  };

  const resetToDefaults = () => {
    setServices(INITIAL_SERVICES);
    setOrders(INITIAL_ORDERS);
    setTickets(INITIAL_TICKETS);
    setAdvertisements(INITIAL_ADVERTISEMENTS);
    setGiveaways(INITIAL_GIVEAWAYS);
    setHostedBots(INITIAL_HOSTED_BOTS);
    setActivities(INITIAL_ACTIVITIES);
    setStoreProducts(INITIAL_STORE_PRODUCTS);
    setModerationLogs(INITIAL_MODERATION_LOGS);
    setApplications(INITIAL_APPLICATIONS);
    setFaqs(INITIAL_FAQS);
    setSettings(INITIAL_SETTINGS);
  };

  return (
    <BotDataContext.Provider
      value={{
        services,
        orders,
        tickets,
        advertisements,
        giveaways,
        hostedBots,
        activities,
        storeProducts,
        moderationLogs,
        applications,
        faqs,
        settings,
        currentRotatingActivity,
        botUptimeSeconds,
        apiLatencyMs,
        toggleServiceStatus,
        updateServiceDetails,
        createOrder,
        updateOrderStatus,
        assignOrderDesigner,
        submitOrderReview,
        createTicket,
        claimTicket,
        closeTicket,
        addTicketMessage,
        setTicketPriority,
        approveAd,
        rejectAd,
        publishAd,
        createAd,
        joinGiveaway,
        drawGiveawayWinner,
        rerollGiveaway,
        cancelGiveaway,
        createGiveaway,
        addModerationCase,
        clearWarning,
        submitApplication,
        reviewApplication,
        renewBotHosting,
        toggleActivity,
        addActivity,
        deleteActivity,
        updateProduct,
        updateSettings,
        updateFAQ,
        resetToDefaults
      }}
    >
      {children}
    </BotDataContext.Provider>
  );
};

export const useBotData = () => {
  const context = useContext(BotDataContext);
  if (!context) {
    throw new Error('useBotData must be used within a BotDataProvider');
  }
  return context;
};
