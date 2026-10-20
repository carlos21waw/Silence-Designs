export type ServiceStatus = 'open' | 'closed';

export interface ServiceItem {
  id: string;
  name: string;
  category: 'clothing' | 'livery' | 'graphics' | 'bot_development';
  status: ServiceStatus;
  description: string;
  basePrice: string;
  details: string[];
  bannerUrl?: string;
}

export type OrderStatus =
  | 'draft'
  | 'submitted'
  | 'pending_review'
  | 'accepted'
  | 'in_progress'
  | 'awaiting_payment'
  | 'completed'
  | 'denied'
  | 'cancelled'
  | 'on_hold';

export interface Order {
  id: string;
  customerDiscordId: string;
  customerDiscordTag: string;
  customerRobloxUser: string;
  serviceType: string;
  description: string;
  preferredColors: string;
  textToInclude: string;
  referenceImages: string[];
  estimatedPrice: string;
  finalPrice: string;
  status: OrderStatus;
  assignedDesigner?: string;
  ticketRef?: string;
  notes: string[];
  review?: {
    rating: number;
    comment: string;
    createdAt: string;
  };
  createdAt: string;
  updatedAt: string;
}

export type TicketCategory =
  | 'order'
  | 'general'
  | 'report_member'
  | 'report_designer'
  | 'billing'
  | 'partnership'
  | 'advertisement'
  | 'other';

export type TicketStatus = 'open' | 'claimed' | 'closed';

export interface TicketMessage {
  id: string;
  author: string;
  authorTag: string;
  avatarUrl?: string;
  isBot?: boolean;
  isStaff?: boolean;
  content: string;
  timestamp: string;
}

export interface Ticket {
  id: string;
  referenceId: string; // e.g. REF-B2EB6F7E
  category: TicketCategory;
  channelName: string;
  status: TicketStatus;
  creatorDiscordId: string;
  creatorDiscordTag: string;
  creatorRobloxUser?: string;
  claimedBy?: string;
  claimedByTag?: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  inquiry: string;
  messages: TicketMessage[];
  closureReason?: string;
  closedAt?: string;
  closedBy?: string;
  createdAt: string;
}

export type AdStatus = 'queue' | 'approved' | 'scheduled' | 'published' | 'rejected' | 'completed';

export interface Advertisement {
  id: string;
  serverName: string;
  title: string;
  promotion: string;
  inviteLink: string;
  iconUrl?: string;
  pingType: 'no_ping' | 'here_ping' | 'everyone_ping' | 'own_channel';
  addons: ('priority' | 'sponsored_giveaway')[];
  cost: number;
  currency: 'R$' | 'USD';
  status: AdStatus;
  queuePosition: number;
  submittedBy: string;
  submittedAt: string;
  scheduledFor?: string;
  giveawayLink?: string;
  notes?: string;
}

export interface Giveaway {
  id: string;
  prize: string;
  sponsor: string;
  serverName: string;
  serverIcon?: string;
  serverInvite?: string;
  winnersCount: number;
  entries: string[]; // Discord tags
  winners: string[];
  status: 'active' | 'ended' | 'cancelled';
  endsAt: string;
  createdAt: string;
  isSponsored: boolean;
}

export interface ModerationCase {
  id: string;
  caseNumber: number;
  targetUser: string;
  targetUserId: string;
  moderator: string;
  moderatorId: string;
  action: 'ban' | 'kick' | 'mute' | 'unmute' | 'warn' | 'clearwarn' | 'purge' | 'lock' | 'unlock';
  reason: string;
  timestamp: string;
  details?: string;
}

export interface Application {
  id: string;
  type: 'designer' | 'staff';
  applicantTag: string;
  applicantId: string;
  robloxUser: string;
  portfolioOrExperience: string;
  availability: string;
  motivation: string;
  status: 'pending' | 'accepted' | 'denied';
  reviewer?: string;
  notes?: string;
  decisionReason?: string;
  createdAt: string;
}

export interface HostedBot {
  id: string;
  ownerTag: string;
  ownerId: string;
  botName: string;
  botId: string;
  status: 'online' | 'offline' | 'restarting' | 'suspended';
  plan: 'Monthly (30 Days)' | 'Quarterly (90 Days)' | 'Bi-Annually (180 Days)';
  renewalDate: string;
  daysRemaining: number;
}

export interface ActivityMessage {
  id: string;
  text: string;
  type: 'Playing' | 'Watching' | 'Listening' | 'Competing';
  enabled: boolean;
}

export interface StoreProduct {
  id: string;
  category: 'boosting' | 'membership' | 'donation' | 'advertisement';
  title: string;
  description: string;
  benefits: string[];
  priceRobux: number;
  priceUsd: number;
  robloxProductUrl: string;
  enabled: boolean;
}

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

export interface BotGuildSettings {
  guildName: string;
  guildId: string;
  botTokenConfigured: boolean;
  prefix: string;
  ticketCategoryId: string;
  transcriptChannelId: string;
  moderationLogChannelId: string;
  releasesChannelId: string;
  announcementChannelId: string;
  staffRoleId: string;
  designerRoleId: string;
  boosterRoleId: string;
  membershipRoleId: string;
  ordersOpen: boolean;
  advertisementsOpen: boolean;
  currency: 'R$' | 'USD';
  robloxGroupId: string;
  robloxGroupName: string;
  robloxGroupOwner: string;
  robloxGroupMemberCount: number;
  robloxGroupCreated: string;
  msaUrl: string;
}
