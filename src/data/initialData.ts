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
  BotGuildSettings
} from '../types';

export const INITIAL_SERVICES: ServiceItem[] = [
  {
    id: 'graphics',
    name: 'Graphics',
    category: 'graphics',
    status: 'closed',
    description: 'Professional graphics designed to elevate branding through clean and impactful visuals.',
    basePrice: 'R$400+',
    details: [
      'Logo: R$400+',
      'Banners: R$125+',
      'Banner Bundle: R$1,250+ (1 server banner, 10 embed banners, 1 footer banner)',
      'Server Bundle: R$1,750+ (complete visual package)'
    ]
  },
  {
    id: 'livery',
    name: 'Livery Design',
    category: 'livery',
    status: 'closed',
    description: 'Realistic and well-aligned vehicle liveries tailored to your department or concept.',
    basePrice: 'R$150+',
    details: [
      'LEO (Law Enforcement): R$175+',
      'FD (Fire / EMS): R$200+',
      'Other Utility / DOT: R$150+',
      'Includes high-resolution ER:LC vehicle templates and vector alignment'
    ]
  },
  {
    id: 'clothing',
    name: 'Clothing & Uniforms',
    category: 'clothing',
    status: 'closed',
    description: 'Custom, high-quality clothing designed with clean details and professional finishes.',
    basePrice: 'R$50+',
    details: [
      'Full Tactical / Patrol Set: R$125',
      'Individual Shirt / Vest: R$75',
      'Pants / Utility Trousers: R$50',
      'Custom shading, badges, rank bars, and patches included'
    ]
  },
  {
    id: 'bot_dev',
    name: 'Bot Development & Hosting',
    category: 'bot_development',
    status: 'closed',
    description: 'Build a custom Discord bot without writing a single line of code. Choose modules, customize, and we host with 99.9% uptime.',
    basePrice: 'Custom Scope',
    details: [
      'First 30 days hosting included free with any bot order',
      'Discord Server Bundle starts at R$2,000 (channel, role, permission & up to 3 bot setups)',
      'Monthly renewal: R$250 / $2.25',
      'Run /manage hosting pricing for detailed options'
    ]
  }
];

export const INITIAL_FAQS: FAQItem[] = [
  {
    id: 1,
    category: 'Orders',
    question: 'Why are my orders closed?',
    answer: 'Orders are temporarily closed due to high demand. Our design team is currently at full capacity and focused on completing existing orders. We expect to reopen within approximately one week. Thank you for your patience.'
  },
  {
    id: 2,
    category: 'Applications',
    question: 'When will applications open?',
    answer: 'Applications open when positions are available. Please check our official announcements for updates.'
  },
  {
    id: 3,
    category: 'Purchases',
    question: 'My purchase didn\'t go through. What should I do?',
    answer: 'Please open a Billing and Purchases support ticket and provide your order or transaction reference, along with any relevant evidence. Never share passwords, authentication codes, or private account credentials.'
  },
  {
    id: 4,
    category: 'Purchases',
    question: 'Do you offer refunds?',
    answer: 'Please review our published Master Service Agreement and the applicable purchase terms. All sales are final under our current policy, subject to any non-waivable rights or remedies required by applicable law. Contact support if a payment was duplicated or a transaction failed.'
  },
  {
    id: 5,
    category: 'Partnerships',
    question: 'How can I affiliate or partner with Silence Designs?',
    answer: 'Please review our partnership requirements in the Marketplace Rulebook and submit a partnership inquiry through our support panel.'
  },
  {
    id: 6,
    category: 'Events',
    question: 'Can I ask Silence Designs to join my event?',
    answer: 'You may contact our team with the event details. Participation depends on availability, relevance, and management approval.'
  },
  {
    id: 7,
    category: 'Branding',
    question: 'Where did you get your emojis and icons?',
    answer: 'Our custom emoji and icon sources may vary. Please contact management if you need credits or usage information for a specific asset.'
  },
  {
    id: 8,
    category: 'Giveaways',
    question: 'What is the sponsored giveaway queue?',
    answer: 'Sponsored giveaways require an approved advertisement purchase, an eligible prize, and confirmation that the sponsor will fund the prize. Approved giveaways are scheduled according to availability and queue priority.'
  },
  {
    id: 9,
    category: 'Moderation',
    question: 'How do I appeal a ban or moderation action?',
    answer: 'Open a moderation appeal ticket and provide your Discord ID, the action you are appealing, the date if known, and a respectful explanation. Appeals are reviewed by authorized staff.'
  },
  {
    id: 10,
    category: 'Tickets',
    question: 'Why was my ticket closed without a reason?',
    answer: 'Open a new support ticket and include your previous ticket reference ID. Management can review the available transcript and closure records.'
  },
  {
    id: 11,
    category: 'Moderation',
    question: 'Can I request a member to be blacklisted or banned?',
    answer: 'You can submit a report with relevant evidence. Staff will investigate the report, but the outcome is determined by authorized management.'
  },
  {
    id: 12,
    category: 'Orders',
    question: 'How do I place a design order?',
    answer: 'Open the ticket panel, select Place a Design Order, choose your service, and complete the guided order form.'
  },
  {
    id: 13,
    category: 'Orders',
    question: 'How long do orders take?',
    answer: 'Completion times depend on complexity, current workload, and designer availability. Staff will provide an estimate when possible.'
  },
  {
    id: 14,
    category: 'Orders',
    question: 'How do I check my order status?',
    answer: 'Use /order-status and provide the requested order reference. You can also ask for an update in your existing order ticket.'
  },
  {
    id: 15,
    category: 'Support',
    question: 'How do I report a designer or staff member?',
    answer: 'Open a Report ticket, provide the person\'s details and a clear explanation, and attach any relevant evidence. Reports are handled privately.'
  }
];

export const INITIAL_SETTINGS: BotGuildSettings = {
  guildName: 'Silence Designs | ER:LC Studio',
  guildId: '122849204859102401',
  botTokenConfigured: true,
  prefix: '/',
  ticketCategoryId: '109849204859102401',
  transcriptChannelId: '109849204859102402',
  moderationLogChannelId: '109849204859102403',
  releasesChannelId: '109849204859102404',
  announcementChannelId: '109849204859102405',
  staffRoleId: '109849204859102406',
  designerRoleId: '109849204859102407',
  boosterRoleId: '109849204859102408',
  membershipRoleId: '109849204859102409',
  ordersOpen: false,
  advertisementsOpen: true,
  currency: 'R$',
  robloxGroupId: '34552481',
  robloxGroupName: 'ILE Customs',
  robloxGroupOwner: 'ileighlin',
  robloxGroupMemberCount: 2200,
  robloxGroupCreated: 'July 2, 2024',
  msaUrl: 'https://docs.google.com/document/d/16LXkFBEOPLBAr8trPBIIYXH53wZbr_oFjjTtsO6hVmI/edit?usp=sharing'
};

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-7192A',
    customerDiscordId: '392817264819284712',
    customerDiscordTag: 'ValkyrieERLC#0042',
    customerRobloxUser: 'ValkyrieOfficer',
    serviceType: 'Livery',
    description: 'Liberty County State Police 2023 Charger ghost stealth package with tactical low-viz chevron striping.',
    preferredColors: 'Matte Charcoal / Reflective Silver',
    textToInclude: 'STATE TROOPER / INTERCEPTOR 41',
    referenceImages: ['https://example.com/ref1.png'],
    estimatedPrice: 'R$250',
    finalPrice: 'R$250',
    status: 'in_progress',
    assignedDesigner: 'Carlos473',
    ticketRef: 'REF-B2EB6F7E',
    notes: ['Customer requested extra contrast on rear bumper', 'Template sent for review'],
    createdAt: '2026-10-18T14:20:00Z',
    updatedAt: '2026-10-19T10:15:00Z'
  },
  {
    id: 'ORD-8931C',
    customerDiscordId: '581920481920481920',
    customerDiscordTag: 'MetroChief#1109',
    customerRobloxUser: 'MetroCaptain',
    serviceType: 'Clothing',
    description: 'Custom ER:LC SWAT tactical vest with high-definition radio harness, bodycam mount, and unit patch.',
    preferredColors: 'Obsidian Navy / Midnight Black',
    textToInclude: 'POLICE / SPECIAL WEAPONS & TACTICS',
    referenceImages: [],
    estimatedPrice: 'R$125',
    finalPrice: 'R$125',
    status: 'pending_review',
    assignedDesigner: undefined,
    ticketRef: 'REF-A49F8120',
    notes: ['Awaiting designer claim'],
    createdAt: '2026-10-19T08:30:00Z',
    updatedAt: '2026-10-19T08:30:00Z'
  },
  {
    id: 'ORD-6014K',
    customerDiscordId: '201948192048192048',
    customerDiscordTag: 'ApexGraphic#9921',
    customerRobloxUser: 'ApexChief',
    serviceType: 'Graphics',
    description: 'Complete server banner bundle and animated server icon for ER:LC roleplay community.',
    preferredColors: 'Gunmetal Silver / Deep Red',
    textToInclude: 'LIBERTY VALLEY ROLEPLAY',
    referenceImages: [],
    estimatedPrice: 'R$1,250',
    finalPrice: 'R$1,250',
    status: 'completed',
    assignedDesigner: 'Carlos473',
    ticketRef: 'REF-C10488DF',
    notes: ['Delivered via release channel ZIP link', 'Payment confirmed via group funds'],
    review: {
      rating: 5,
      comment: 'Incredible speed and sharp design alignment. Top tier work from Silence Designs!',
      createdAt: '2026-10-17T19:40:00Z'
    },
    createdAt: '2026-10-15T11:00:00Z',
    updatedAt: '2026-10-17T18:20:00Z'
  }
];

export const INITIAL_TICKETS: Ticket[] = [
  {
    id: 'ticket-1',
    referenceId: 'REF-B2EB6F7E',
    category: 'order',
    channelName: 'ticket-valkyrie-livery',
    status: 'claimed',
    creatorDiscordId: '392817264819284712',
    creatorDiscordTag: 'ValkyrieERLC#0042',
    creatorRobloxUser: 'ValkyrieOfficer',
    claimedBy: '1025813762684502168',
    claimedByTag: 'Carlos473',
    priority: 'high',
    inquiry: 'Order inquiry for 2023 Charger ghost livery stealth pack.',
    createdAt: '2026-10-18T14:20:00Z',
    messages: [
      {
        id: 'm1',
        author: 'Silence Designs Bot',
        authorTag: 'SilenceBot#0001',
        isBot: true,
        content: 'Thanks for contacting support — @ValkyrieERLC#0042\nA member of our team will assist you shortly. Provide all relevant information regarding your issue.',
        timestamp: '2026-10-18T14:20:05Z'
      },
      {
        id: 'm2',
        author: 'Carlos473',
        authorTag: 'Carlos473',
        isStaff: true,
        content: 'Hello! I have claimed your ticket and am reviewing your specifications. The stealth charcoal looks great.',
        timestamp: '2026-10-18T14:25:00Z'
      }
    ]
  },
  {
    id: 'ticket-2',
    referenceId: 'REF-9271E002',
    category: 'general',
    channelName: 'ticket-support-general',
    status: 'open',
    creatorDiscordId: '772910481928471203',
    creatorDiscordTag: 'PixelDriver#4412',
    priority: 'normal',
    inquiry: 'Question regarding custom Discord server bundle delivery timeline and bot setup limits.',
    createdAt: '2026-10-19T16:10:00Z',
    messages: [
      {
        id: 'm1',
        author: 'Silence Designs Bot',
        authorTag: 'SilenceBot#0001',
        isBot: true,
        content: 'Thanks for contacting support — @PixelDriver#4412\nA member of our team will assist you shortly.',
        timestamp: '2026-10-19T16:10:02Z'
      }
    ]
  }
];

export const INITIAL_ADVERTISEMENTS: Advertisement[] = [
  {
    id: 'ad-101',
    serverName: 'Liberty City Highway Patrol',
    title: 'LCHP | Premier Realistic ER:LC Community',
    promotion: 'Join our daily patrol operations with 60+ active daily members! Custom liveries & active dispatch.',
    inviteLink: 'https://discord.gg/example-lchp',
    pingType: 'everyone_ping',
    addons: ['priority', 'sponsored_giveaway'],
    cost: 1200,
    currency: 'R$',
    status: 'queue',
    queuePosition: 1,
    submittedBy: 'PatrolCommander#9982',
    submittedAt: '2026-10-19T12:00:00Z',
    giveawayLink: 'https://discord.gg/nitro-sponsored-giveaway',
    notes: 'Payment confirmed via Roblox Developer Product.'
  },
  {
    id: 'ad-102',
    serverName: 'Tri-County Metro Fire',
    title: 'Tri-County Fire & EMS Roleplay',
    promotion: 'Authentic ER:LC firefighting and emergency medical rescue roleplay server with custom apparatus.',
    inviteLink: 'https://discord.gg/example-tcmf',
    pingType: 'here_ping',
    addons: [],
    cost: 350,
    currency: 'R$',
    status: 'approved',
    queuePosition: 2,
    submittedBy: 'CaptainBlaze#1010',
    submittedAt: '2026-10-18T18:00:00Z',
    scheduledFor: '2026-10-20T20:00:00Z'
  }
];

export const INITIAL_GIVEAWAYS: Giveaway[] = [
  {
    id: 'gw-1',
    prize: '1 Month of Discord Nitro',
    sponsor: 'Liberty City Highway Patrol',
    serverName: 'LCHP Roleplay Community',
    serverInvite: 'https://discord.gg/example-lchp',
    winnersCount: 1,
    entries: ['ValkyrieERLC#0042', 'MetroChief#1109', 'ApexGraphic#9921', 'KevDesign#3301', 'SierraERLC#8812'],
    winners: [],
    status: 'active',
    endsAt: '2026-10-22T20:00:00Z',
    createdAt: '2026-10-19T12:00:00Z',
    isSponsored: true
  }
];

export const INITIAL_HOSTED_BOTS: HostedBot[] = [
  {
    id: 'host-1',
    ownerTag: 'Carlos473',
    ownerId: '1025813762684502168',
    botName: 'Silence Designs Core',
    botId: '122948192049102941',
    status: 'online',
    plan: 'Bi-Annually (180 Days)',
    renewalDate: '2027-04-19',
    daysRemaining: 181
  },
  {
    id: 'host-2',
    ownerTag: 'ValkyrieERLC#0042',
    ownerId: '392817264819284712',
    botName: 'LCHP Cad Bot v2',
    botId: '133910294819204910',
    status: 'online',
    plan: 'Monthly (30 Days)',
    renewalDate: '2026-11-15',
    daysRemaining: 27
  }
];

export const INITIAL_ACTIVITIES: ActivityMessage[] = [
  { id: '1', text: '🌿 Powering Silence Designs', type: 'Playing', enabled: true },
  { id: '2', text: '🎨 Designing something exceptional', type: 'Playing', enabled: true },
  { id: '3', text: '🚘 ER:LC Creative Services', type: 'Watching', enabled: true },
  { id: '4', text: '📦 Managing design orders', type: 'Playing', enabled: true },
  { id: '5', text: '🎫 Supporting our community', type: 'Listening', enabled: true },
  { id: '6', text: '✨ Silence Designs | Premium Creative Services', type: 'Playing', enabled: true },
  { id: '7', text: '🛠️ /help for all 50+ commands', type: 'Watching', enabled: true },
  { id: '8', text: '🛡️ Moderating Liberty County creators', type: 'Watching', enabled: true }
];

export const INITIAL_STORE_PRODUCTS: StoreProduct[] = [
  {
    id: 'prod-boost',
    category: 'boosting',
    title: 'Server Booster Privileges',
    description: 'Support our server with a Discord boost and unlock automatic instant perks.',
    benefits: [
      'Exclusive Booster Role',
      'Special chat access, giveaways, and early releases',
      'Media posting permissions in showcase channels',
      '5% automatic discount on all design orders'
    ],
    priceRobux: 0,
    priceUsd: 0,
    robloxProductUrl: '',
    enabled: true
  },
  {
    id: 'prod-membership',
    category: 'membership',
    title: 'Silence Designs+ Membership',
    description: 'The elite membership tier for ER:LC server owners and frequent commissioners.',
    benefits: [
      'Exclusive Silence Designs+ role',
      'Media permissions across all public channels',
      'Special VIP chat access, exclusive giveaways & releases',
      '10% permanent discount on all orders',
      'Privileged order placement with priority queue',
      'Early access to configured Roblox Vault releases',
      'Exclusive free releases & giveaways'
    ],
    priceRobux: 650,
    priceUsd: 4.55,
    robloxProductUrl: 'https://www.roblox.com/developer-product/9860922544/product/3602207934',
    enabled: true
  },
  {
    id: 'prod-don-sm',
    category: 'donation',
    title: 'Small Community Donation',
    description: 'Support Silence Designs projects and development.',
    benefits: ['Donator role', 'Media permissions', 'Special chat access', 'Community gratitude'],
    priceRobux: 200,
    priceUsd: 1.40,
    robloxProductUrl: 'https://www.roblox.com/developer-product/9860922544/product/3602207945',
    enabled: true
  },
  {
    id: 'prod-don-md',
    category: 'donation',
    title: 'Medium Community Donation',
    description: 'Support our team with resources for server events & assets.',
    benefits: ['Donator role', 'Media permissions', 'Special chat access', 'Event backer badge'],
    priceRobux: 500,
    priceUsd: 3.50,
    robloxProductUrl: 'https://www.roblox.com/developer-product/9860922544/product/3602207952',
    enabled: true
  },
  {
    id: 'prod-don-lg',
    category: 'donation',
    title: 'Large Community Donation',
    description: 'Significant contribution powering the future of Silence Designs.',
    benefits: ['Gold Donator role', 'Full media permissions', 'VIP chat access', 'Priority event access'],
    priceRobux: 1000,
    priceUsd: 7.00,
    robloxProductUrl: 'https://www.roblox.com/developer-product/9860922544/product/3602207963',
    enabled: true
  },
  {
    id: 'prod-ad-instant',
    category: 'advertisement',
    title: 'Instant Postage',
    description: 'Have your approved advertisement published immediately to the community.',
    benefits: ['Immediate publication bypass', 'Verified ad badge'],
    priceRobux: 300,
    priceUsd: 2.10,
    robloxProductUrl: 'https://www.roblox.com/developer-product/9860922544/product/3604739906',
    enabled: true
  },
  {
    id: 'prod-ad-bypass',
    category: 'advertisement',
    title: 'Bypass Queue',
    description: 'Skip standard review wait times and advance to slot #1 in the ad queue.',
    benefits: ['Top queue placement', 'Expedited review'],
    priceRobux: 250,
    priceUsd: 1.75,
    robloxProductUrl: 'https://www.roblox.com/developer-product/9860922544/product/3602207982',
    enabled: true
  }
];

export const INITIAL_MODERATION_LOGS: ModerationCase[] = [
  {
    id: 'mod-1',
    caseNumber: 101,
    targetUser: 'SpammerGuy#1201',
    targetUserId: '912048192847192841',
    moderator: 'SilenceBot AutoMod',
    moderatorId: '122948192049102941',
    action: 'mute',
    reason: 'Mass unauthorized pinging in #general chat',
    timestamp: '2026-10-19T14:12:00Z',
    details: 'Applied 1 hour timeout per Order Conduct rule #4'
  },
  {
    id: 'mod-2',
    caseNumber: 100,
    targetUser: 'RogueRider#4021',
    targetUserId: '682910481928471204',
    moderator: 'Carlos473',
    moderatorId: '1025813762684502168',
    action: 'warn',
    reason: 'Pinging Executive Team in active design ticket',
    timestamp: '2026-10-18T19:30:00Z',
    details: 'Ticket REF-B2EB6F7E warning issued'
  }
];

export const INITIAL_APPLICATIONS: Application[] = [
  {
    id: 'app-1',
    type: 'designer',
    applicantTag: 'KevDesign#3301',
    applicantId: '492019481920481920',
    robloxUser: 'Kev_Liveries',
    portfolioOrExperience: '3 years creating ER:LC liveries for LAPD, CHP, and custom county departments with 40+ completed client orders.',
    availability: '15-20 hours per week (evenings & weekends)',
    motivation: 'Silence Designs is recognized as the highest quality ER:LC graphics collective. I want to build liveries with the best standards.',
    status: 'pending',
    createdAt: '2026-10-18T21:00:00Z'
  }
];

export interface BotCommandDef {
  name: string;
  category: 'orders' | 'creative' | 'tickets' | 'applications' | 'community' | 'moderation' | 'utility' | 'extra';
  description: string;
  usage: string;
  permission: 'Everyone' | 'Staff' | 'Management' | 'Admin';
}

export const ALL_50_PRIMARY_COMMANDS: BotCommandDef[] = [
  // 1-9 Order Management
  { name: 'order-create', category: 'orders', description: 'Initiate a new design order modal for Livery, Graphics, Clothing, or Bot Dev', usage: '/order-create [service]', permission: 'Everyone' },
  { name: 'order-status', category: 'orders', description: 'Look up live status, assigned designer, and updates for an order ID', usage: '/order-status <order_id>', permission: 'Everyone' },
  { name: 'order-cancel', category: 'orders', description: 'Request cancellation of your submitted order before work begins', usage: '/order-cancel <order_id>', permission: 'Everyone' },
  { name: 'order-list', category: 'orders', description: 'View all orders assigned to you, or staff overview of queue', usage: '/order-list [status]', permission: 'Staff' },
  { name: 'order-claim', category: 'orders', description: 'Claim an available unassigned order as a Silence Designs designer', usage: '/order-claim <order_id>', permission: 'Staff' },
  { name: 'order-complete', category: 'orders', description: 'Mark an order as completed, prompt customer for review and receipt', usage: '/order-complete <order_id>', permission: 'Staff' },
  { name: 'order-submit', category: 'orders', description: 'Directly submit completed design assets or download package to client', usage: '/order-submit <order_id> <asset_link>', permission: 'Staff' },
  { name: 'order-review', category: 'orders', description: 'Leave a verified customer rating (1-5 stars) and review for your completed order', usage: '/order-review <order_id> <rating> <comment>', permission: 'Everyone' },
  { name: 'order-tip', category: 'orders', description: 'Send a Robux or USD tip to your assigned designer to show appreciation', usage: '/order-tip <order_id> <amount>', permission: 'Everyone' },

  // 10-15 Creative Tools
  { name: 'showcase', category: 'creative', description: 'Display recent Silence Designs portfolio highlights and verified client liveries', usage: '/showcase [category]', permission: 'Everyone' },
  { name: 'ai-idea', category: 'creative', description: 'Generate creative concept ideas for police/sheriff department liveries and uniforms', usage: '/ai-idea <department_type> <vibe>', permission: 'Everyone' },
  { name: 'ai-palette', category: 'creative', description: 'Generate harmonious color palettes and hex codes tailored for ER:LC vehicles and clothing', usage: '/ai-palette <theme>', permission: 'Everyone' },
  { name: 'ai-lore', category: 'creative', description: 'Generate rich background lore, history, and mottos for custom ER:LC roleplay agencies', usage: '/ai-lore <agency_name>', permission: 'Everyone' },
  { name: 'ai-slogan', category: 'creative', description: 'Generate authentic motto and badge slogans for law enforcement, fire, and rescue', usage: '/ai-slogan <department>', permission: 'Everyone' },
  { name: 'ai-name', category: 'creative', description: 'Generate realistic municipal, county, and state department names for roleplay servers', usage: '/ai-name <region_or_state>', permission: 'Everyone' },

  // 16-23 Ticket System
  { name: 'ticket-open', category: 'tickets', description: 'Open a dedicated private support or order ticket with category picker', usage: '/ticket-open [category]', permission: 'Everyone' },
  { name: 'ticket-close', category: 'tickets', description: 'Close current ticket, issue receipt DM, and generate permanent transcript', usage: '/ticket-close [reason]', permission: 'Everyone' },
  { name: 'ticket-add', category: 'tickets', description: 'Add a user or collaborator to the current ticket channel', usage: '/ticket-add <user>', permission: 'Staff' },
  { name: 'ticket-remove', category: 'tickets', description: 'Remove a user from the current ticket channel', usage: '/ticket-remove <user>', permission: 'Staff' },
  { name: 'ticket-transcript', category: 'tickets', description: 'Export full HTML/text transcript with timestamps to staff archive', usage: '/ticket-transcript', permission: 'Staff' },
  { name: 'ticket-claim', category: 'tickets', description: 'Assign the current support ticket exclusively to yourself', usage: '/ticket-claim', permission: 'Staff' },
  { name: 'ticket-transfer', category: 'tickets', description: 'Transfer ticket ownership and handling to another staff member', usage: '/ticket-transfer <staff_member>', permission: 'Staff' },
  { name: 'ticket-priority', category: 'tickets', description: 'Adjust ticket urgency level (Low, Normal, High, Urgent)', usage: '/ticket-priority <level>', permission: 'Staff' },

  // 24-28 Applications
  { name: 'apply-designer', category: 'applications', description: 'Submit an official application to join Silence Designs as a livery/graphics/clothing designer', usage: '/apply-designer', permission: 'Everyone' },
  { name: 'apply-staff', category: 'applications', description: 'Submit an application to join Silence Designs Discord community staff team', usage: '/apply-staff', permission: 'Everyone' },
  { name: 'app-accept', category: 'applications', description: 'Accept an applicant, assign roles, and send official welcome DM', usage: '/app-accept <app_id> [reason]', permission: 'Management' },
  { name: 'app-deny', category: 'applications', description: 'Deny an application with documented feedback and reason', usage: '/app-deny <app_id> [reason]', permission: 'Management' },
  { name: 'app-review', category: 'applications', description: 'Inspect application details, portfolio links, and staff notes', usage: '/app-review <app_id>', permission: 'Management' },

  // 29-34 Community & Info
  { name: 'server-info', category: 'community', description: 'Display comprehensive server statistics, roles, boosts, and security levels', usage: '/server-info', permission: 'Everyone' },
  { name: 'rules', category: 'community', description: 'Show the Silence Designs server rulebook, ticket etiquette, and conduct standards', usage: '/rules', permission: 'Everyone' },
  { name: 'department-info', category: 'community', description: 'Detailed specs and ER:LC vehicle packs supported by Silence Designs', usage: '/department-info <type>', permission: 'Everyone' },
  { name: 'price-list', category: 'community', description: 'View official pricing for Livery, Graphics, Clothing, and Server Bundles', usage: '/price-list', permission: 'Everyone' },
  { name: 'schedule', category: 'community', description: 'View current studio workload, estimated turnaround, and commission queue timeline', usage: '/schedule', permission: 'Everyone' },
  { name: 'announcement', category: 'community', description: 'Broadcast an official studio announcement with rich embed to #announcements', usage: '/announcement <title> <message>', permission: 'Management' },

  // 35-44 Moderation
  { name: 'ban', category: 'moderation', description: 'Ban a malicious user from the server with audit logging and DM notification', usage: '/ban <user> [reason]', permission: 'Staff' },
  { name: 'kick', category: 'moderation', description: 'Kick a member from the Discord community with logged reason', usage: '/kick <user> [reason]', permission: 'Staff' },
  { name: 'mute', category: 'moderation', description: 'Timeout a user using Discord native timeout controls', usage: '/mute <user> <duration> [reason]', permission: 'Staff' },
  { name: 'unmute', category: 'moderation', description: 'Remove timeout sanction from a previously muted user', usage: '/unmute <user>', permission: 'Staff' },
  { name: 'warn', category: 'moderation', description: 'Issue a formal infraction warning to a member and increment case log', usage: '/warn <user> <reason>', permission: 'Staff' },
  { name: 'warnings', category: 'moderation', description: 'Inspect the warning count and past moderation history for a member', usage: '/warnings <user>', permission: 'Staff' },
  { name: 'clearwarn', category: 'moderation', description: 'Clear a specific warning or reset a member\'s warning infractions', usage: '/clearwarn <user> [case_id]', permission: 'Management' },
  { name: 'purge', category: 'moderation', description: 'Bulk delete between 1 and 100 recent messages from the current channel', usage: '/purge <amount>', permission: 'Staff' },
  { name: 'lock', category: 'moderation', description: 'Lock down a channel to prevent regular members from sending messages', usage: '/lock [reason]', permission: 'Staff' },
  { name: 'unlock', category: 'moderation', description: 'Unlock a previously restricted channel to restore regular member discussion', usage: '/unlock', permission: 'Staff' },

  // 45-50 Utilities & Profiles
  { name: 'help', category: 'utility', description: 'Interactive command browser, categorized guides, and direct FAQ links', usage: '/help [command]', permission: 'Everyone' },
  { name: 'botinfo', category: 'utility', description: 'Display Silence Designs Bot uptime, memory, version, and developer stats', usage: '/botinfo', permission: 'Everyone' },
  { name: 'ping', category: 'utility', description: 'Check bot websocket latency and Discord REST API ping in milliseconds', usage: '/ping', permission: 'Everyone' },
  { name: 'profile', category: 'utility', description: 'View user profile, linked Roblox account, order history, and booster status', usage: '/profile [user]', permission: 'Everyone' },
  { name: 'leaderboard', category: 'utility', description: 'View top community supporters, server boosters, and designer rankings', usage: '/leaderboard', permission: 'Everyone' },
  { name: 'credits', category: 'utility', description: 'Silence Designs project creators, developer Carlos473, and contributors', usage: '/credits', permission: 'Everyone' },

  // Extra Required Commands from Prompt
  { name: 'botsay', category: 'extra', description: 'Post rich custom embed as the bot with custom title, color, fields, and ping', usage: '/botsay [channel]', permission: 'Staff' },
  { name: 'ticket-create-panel', category: 'extra', description: 'Deploy the permanent interactive Support Center ticket panel with category menu', usage: '/ticket-create-panel', permission: 'Admin' },
  { name: 'services', category: 'extra', description: 'Display the permanent Silence Designs Services embed with live status and buttons', usage: '/services', permission: 'Everyone' },
  { name: 'store', category: 'extra', description: 'Browse Silence Designs+ membership, donations, booster perks, and ads packages', usage: '/store', permission: 'Everyone' },
  { name: 'giveaway', category: 'extra', description: 'Create, end, or reroll interactive server giveaways with join buttons', usage: '/giveaway <create|end|reroll>', permission: 'Staff' },
  { name: 'release', category: 'extra', description: 'Publish free or paid design release with attached ZIP file and preview image', usage: '/release <title> <file> <preview>', permission: 'Staff' },
  { name: 'group-info', category: 'extra', description: 'Fetch live Roblox community group data, member count, owner, and group link', usage: '/group-info', permission: 'Everyone' },
  { name: 'about', category: 'extra', description: 'About Silence Designs Bot, Creator Carlos473 (ID: 1025813762684502168), uptime & stats', usage: '/about', permission: 'Everyone' },
  { name: 'report', category: 'extra', description: 'Privately submit a report against a member or staff member directly to management', usage: '/report', permission: 'Everyone' },
  { name: 'manage hosting', category: 'extra', description: 'View and manage your custom Silence Designs hosted bot subscriptions', usage: '/manage hosting', permission: 'Everyone' },
  { name: 'manage hosting pricing', category: 'extra', description: 'View current hosting tiers (Monthly R$250, Quarterly R$500, Bi-Annually R$900)', usage: '/manage hosting pricing', permission: 'Everyone' },
  { name: 'manage services', category: 'extra', description: 'Toggle Clothing, Livery, Graphics, Bot Dev between Open and Closed states', usage: '/manage services <service> <status>', permission: 'Management' },
  { name: 'manage settings', category: 'extra', description: 'Configure staff roles, ticket categories, currency, and channels', usage: '/manage settings', permission: 'Admin' },
  { name: 'manage status', category: 'extra', description: 'Add, reorder, or edit rotating bot activity messages', usage: '/manage status', permission: 'Admin' }
];
