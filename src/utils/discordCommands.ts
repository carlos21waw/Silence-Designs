/**
 * Silence Designs Discord REST API Application Commands Schema
 * Fully compliant with Discord Application Command specifications (v10 API).
 * Ensures valid names (^[a-z0-9_-]{1,32}$), valid types, and native subcommands.
 */

export interface DiscordCommandOption {
  type: number; // 1 = SUB_COMMAND, 3 = STRING, 4 = INTEGER, 5 = BOOLEAN, 6 = USER, 7 = CHANNEL, 8 = ROLE
  name: string;
  description: string;
  required?: boolean;
  choices?: { name: string; value: string | number }[];
  min_value?: number;
  max_value?: number;
  options?: DiscordCommandOption[];
}

export interface DiscordSlashCommandPayload {
  name: string;
  description: string;
  type: number; // 1 = CHAT_INPUT
  options?: DiscordCommandOption[];
  default_member_permissions?: string | null;
  dm_permission?: boolean;
}

export const DISCORD_APPLICATION_COMMANDS: DiscordSlashCommandPayload[] = [
  // 1-9 Order Management
  {
    name: 'order-create',
    description: 'Initiate a new design order modal for Livery, Graphics, Clothing, or Bot Dev',
    type: 1,
    options: [
      {
        type: 3,
        name: 'service',
        description: 'Design service category to order',
        required: false,
        choices: [
          { name: 'Livery Design', value: 'Livery' },
          { name: 'Graphics & Branding', value: 'Graphics' },
          { name: 'Clothing & Uniforms', value: 'Clothing' },
          { name: 'Bot Development', value: 'Bot Development' }
        ]
      }
    ]
  },
  {
    name: 'order-status',
    description: 'Look up live status, assigned designer, and updates for an order ID',
    type: 1,
    options: [
      {
        type: 3,
        name: 'order_id',
        description: 'The unique Order ID (e.g. ORD-7192A)',
        required: true
      }
    ]
  },
  {
    name: 'order-cancel',
    description: 'Request cancellation of your submitted order before work begins',
    type: 1,
    options: [
      {
        type: 3,
        name: 'order_id',
        description: 'The unique Order ID to cancel',
        required: true
      },
      {
        type: 3,
        name: 'reason',
        description: 'Reason for requesting cancellation',
        required: false
      }
    ]
  },
  {
    name: 'order-list',
    description: 'View orders assigned to you, or staff overview of queue',
    type: 1,
    options: [
      {
        type: 3,
        name: 'status',
        description: 'Filter orders by status',
        required: false,
        choices: [
          { name: 'Submitted / Queue', value: 'submitted' },
          { name: 'In Progress', value: 'in_progress' },
          { name: 'Completed', value: 'completed' }
        ]
      }
    ]
  },
  {
    name: 'order-claim',
    description: 'Claim an available unassigned order as a Silence Designs designer',
    type: 1,
    options: [
      {
        type: 3,
        name: 'order_id',
        description: 'The unique Order ID to claim',
        required: true
      }
    ]
  },
  {
    name: 'order-complete',
    description: 'Mark an order as completed, prompt customer for review and receipt',
    type: 1,
    options: [
      {
        type: 3,
        name: 'order_id',
        description: 'The unique Order ID to finalize',
        required: true
      }
    ]
  },
  {
    name: 'order-submit',
    description: 'Directly submit completed design assets or download package to client',
    type: 1,
    options: [
      {
        type: 3,
        name: 'order_id',
        description: 'The unique Order ID',
        required: true
      },
      {
        type: 3,
        name: 'asset_link',
        description: 'Secure cloud download link to finished files',
        required: true
      }
    ]
  },
  {
    name: 'order-review',
    description: 'Leave a verified customer rating (1-5 stars) and review for your completed order',
    type: 1,
    options: [
      {
        type: 3,
        name: 'order_id',
        description: 'The Order ID you are reviewing',
        required: true
      },
      {
        type: 4,
        name: 'rating',
        description: 'Star rating from 1 to 5',
        required: true,
        min_value: 1,
        max_value: 5
      },
      {
        type: 3,
        name: 'comment',
        description: 'Your verified customer feedback comment',
        required: true
      }
    ]
  },
  {
    name: 'order-tip',
    description: 'Send a Robux or USD tip to your assigned designer to show appreciation',
    type: 1,
    options: [
      {
        type: 3,
        name: 'order_id',
        description: 'The Order ID of the designer you want to tip',
        required: true
      },
      {
        type: 3,
        name: 'amount',
        description: 'Tip amount in Robux (e.g. 250) or USD',
        required: true
      }
    ]
  },

  // 10-15 Creative Tools
  {
    name: 'showcase',
    description: 'Display recent Silence Designs portfolio highlights and verified client liveries',
    type: 1,
    options: [
      {
        type: 3,
        name: 'category',
        description: 'Portfolio category to inspect',
        required: false,
        choices: [
          { name: 'Vehicle Liveries', value: 'livery' },
          { name: 'Tactical Uniforms & Apparel', value: 'clothing' },
          { name: 'Logos & Server Graphics', value: 'graphics' }
        ]
      }
    ]
  },
  {
    name: 'ai-idea',
    description: 'Generate creative concept ideas for police/sheriff department liveries and uniforms',
    type: 1,
    options: [
      {
        type: 3,
        name: 'department',
        description: 'Department type (e.g. State Police, Sheriff, Metro PD)',
        required: true
      },
      {
        type: 3,
        name: 'theme',
        description: 'Aesthetic theme (e.g. stealth ghost, retro 90s, tactical subdued)',
        required: false
      }
    ]
  },
  {
    name: 'ai-palette',
    description: 'Generate harmonious color palettes and hex codes tailored for ER:LC vehicles and clothing',
    type: 1,
    options: [
      {
        type: 3,
        name: 'theme',
        description: 'Color theme concept (e.g. obsidian highway patrol, alpine rescue)',
        required: true
      }
    ]
  },
  {
    name: 'ai-lore',
    description: 'Generate rich background lore, history, and mottos for custom ER:LC roleplay agencies',
    type: 1,
    options: [
      {
        type: 3,
        name: 'agency_name',
        description: 'Name of the fictional or custom agency',
        required: true
      }
    ]
  },
  {
    name: 'ai-slogan',
    description: 'Generate authentic motto and badge slogans for law enforcement, fire, and rescue',
    type: 1,
    options: [
      {
        type: 3,
        name: 'department',
        description: 'Department agency name',
        required: true
      }
    ]
  },
  {
    name: 'ai-name',
    description: 'Generate realistic municipal, county, and state department names for roleplay servers',
    type: 1,
    options: [
      {
        type: 3,
        name: 'region',
        description: 'State or geographical region for inspiration',
        required: false
      }
    ]
  },

  // 16-23 Ticket System
  {
    name: 'ticket-open',
    description: 'Open a dedicated private support or order ticket with category picker',
    type: 1,
    options: [
      {
        type: 3,
        name: 'category',
        description: 'Ticket inquiry category',
        required: false,
        choices: [
          { name: 'Place a Design Order', value: 'order' },
          { name: 'General Support', value: 'general' },
          { name: 'Report a Member', value: 'report_member' },
          { name: 'Report a Designer', value: 'report_designer' },
          { name: 'Billing and Purchases', value: 'billing' },
          { name: 'Partnerships', value: 'partnership' },
          { name: 'Advertisements', value: 'advertisement' }
        ]
      }
    ]
  },
  {
    name: 'ticket-close',
    description: 'Close current ticket, issue receipt DM, and generate permanent transcript',
    type: 1,
    options: [
      {
        type: 3,
        name: 'reason',
        description: 'Closure resolution reason',
        required: false
      }
    ]
  },
  {
    name: 'ticket-add',
    description: 'Add a user or collaborator to the current ticket channel',
    type: 1,
    options: [
      {
        type: 6,
        name: 'user',
        description: 'User to add into the ticket',
        required: true
      }
    ]
  },
  {
    name: 'ticket-remove',
    description: 'Remove a user from the current ticket channel',
    type: 1,
    options: [
      {
        type: 6,
        name: 'user',
        description: 'User to remove from the ticket',
        required: true
      }
    ]
  },
  {
    name: 'ticket-transcript',
    description: 'Export full HTML/text transcript with timestamps to staff archive',
    type: 1
  },
  {
    name: 'ticket-claim',
    description: 'Assign the current support ticket exclusively to yourself',
    type: 1
  },
  {
    name: 'ticket-transfer',
    description: 'Transfer ticket ownership and handling to another staff member',
    type: 1,
    options: [
      {
        type: 6,
        name: 'staff_member',
        description: 'Staff member to transfer handling to',
        required: true
      }
    ]
  },
  {
    name: 'ticket-priority',
    description: 'Adjust ticket urgency level (Low, Normal, High, Urgent)',
    type: 1,
    options: [
      {
        type: 3,
        name: 'level',
        description: 'Urgency priority level',
        required: true,
        choices: [
          { name: 'Low', value: 'low' },
          { name: 'Normal', value: 'normal' },
          { name: 'High', value: 'high' },
          { name: 'Urgent', value: 'urgent' }
        ]
      }
    ]
  },

  // 24-28 Applications
  {
    name: 'apply-designer',
    description: 'Submit an official application to join Silence Designs as a designer',
    type: 1
  },
  {
    name: 'apply-staff',
    description: 'Submit an application to join Silence Designs Discord community staff team',
    type: 1
  },
  {
    name: 'app-accept',
    description: 'Accept an applicant, assign roles, and send official welcome DM',
    type: 1,
    options: [
      {
        type: 3,
        name: 'app_id',
        description: 'Application ID to approve',
        required: true
      },
      {
        type: 3,
        name: 'reason',
        description: 'Acceptance notes and assigned tier',
        required: false
      }
    ]
  },
  {
    name: 'app-deny',
    description: 'Deny an application with documented feedback and reason',
    type: 1,
    options: [
      {
        type: 3,
        name: 'app_id',
        description: 'Application ID to reject',
        required: true
      },
      {
        type: 3,
        name: 'reason',
        description: 'Constructive denial reason provided to applicant',
        required: false
      }
    ]
  },
  {
    name: 'app-review',
    description: 'Inspect application details, portfolio links, and staff notes',
    type: 1,
    options: [
      {
        type: 3,
        name: 'app_id',
        description: 'Application ID to inspect',
        required: true
      }
    ]
  },

  // 29-34 Community & Info
  {
    name: 'server-info',
    description: 'Display comprehensive server statistics, roles, boosts, and security levels',
    type: 1
  },
  {
    name: 'rules',
    description: 'Show the Silence Designs server rulebook, ticket etiquette, and conduct standards',
    type: 1
  },
  {
    name: 'department-info',
    description: 'Detailed specs and ER:LC vehicle packs supported by Silence Designs',
    type: 1,
    options: [
      {
        type: 3,
        name: 'type',
        description: 'Department vehicle type (e.g. Police, Sheriff, Fire, DOT)',
        required: false
      }
    ]
  },
  {
    name: 'price-list',
    description: 'View official pricing for Livery, Graphics, Clothing, and Server Bundles',
    type: 1
  },
  {
    name: 'schedule',
    description: 'View current studio workload, estimated turnaround, and commission queue timeline',
    type: 1
  },
  {
    name: 'announcement',
    description: 'Broadcast an official studio announcement with rich embed to #announcements',
    type: 1,
    options: [
      {
        type: 3,
        name: 'title',
        description: 'Announcement headline',
        required: true
      },
      {
        type: 3,
        name: 'message',
        description: 'Announcement body text',
        required: true
      }
    ]
  },

  // 35-44 Moderation
  {
    name: 'ban',
    description: 'Ban a malicious user from the server with audit logging and DM notification',
    type: 1,
    options: [
      {
        type: 6,
        name: 'user',
        description: 'Member to ban',
        required: true
      },
      {
        type: 3,
        name: 'reason',
        description: 'Reason for sanction',
        required: false
      }
    ]
  },
  {
    name: 'kick',
    description: 'Kick a member from the Discord community with logged reason',
    type: 1,
    options: [
      {
        type: 6,
        name: 'user',
        description: 'Member to kick',
        required: true
      },
      {
        type: 3,
        name: 'reason',
        description: 'Reason for removal',
        required: false
      }
    ]
  },
  {
    name: 'mute',
    description: 'Timeout a user using Discord native timeout controls',
    type: 1,
    options: [
      {
        type: 6,
        name: 'user',
        description: 'Member to mute/timeout',
        required: true
      },
      {
        type: 3,
        name: 'duration',
        description: 'Duration (e.g. 10m, 1h, 1d)',
        required: true
      },
      {
        type: 3,
        name: 'reason',
        description: 'Reason for timeout',
        required: false
      }
    ]
  },
  {
    name: 'unmute',
    description: 'Remove timeout sanction from a previously muted user',
    type: 1,
    options: [
      {
        type: 6,
        name: 'user',
        description: 'Member to unmute',
        required: true
      }
    ]
  },
  {
    name: 'warn',
    description: 'Issue a formal infraction warning to a member and increment case log',
    type: 1,
    options: [
      {
        type: 6,
        name: 'user',
        description: 'Member to warn',
        required: true
      },
      {
        type: 3,
        name: 'reason',
        description: 'Rule violation reason',
        required: true
      }
    ]
  },
  {
    name: 'warnings',
    description: 'Inspect the warning count and past moderation history for a member',
    type: 1,
    options: [
      {
        type: 6,
        name: 'user',
        description: 'Member to look up infractions for',
        required: true
      }
    ]
  },
  {
    name: 'clearwarn',
    description: "Clear a specific warning or reset a member's warning infractions",
    type: 1,
    options: [
      {
        type: 6,
        name: 'user',
        description: 'Member to clear warnings for',
        required: true
      },
      {
        type: 3,
        name: 'case_id',
        description: 'Specific case ID to clear (leave blank for all)',
        required: false
      }
    ]
  },
  {
    name: 'purge',
    description: 'Bulk delete between 1 and 100 recent messages from the current channel',
    type: 1,
    options: [
      {
        type: 4,
        name: 'amount',
        description: 'Number of messages to delete (1-100)',
        required: true,
        min_value: 1,
        max_value: 100
      }
    ]
  },
  {
    name: 'lock',
    description: 'Lock down a channel to prevent regular members from sending messages',
    type: 1,
    options: [
      {
        type: 3,
        name: 'reason',
        description: 'Reason for lockdown',
        required: false
      }
    ]
  },
  {
    name: 'unlock',
    description: 'Unlock a previously restricted channel to restore regular member discussion',
    type: 1
  },

  // 45-50 Utilities & Profiles
  {
    name: 'help',
    description: 'Interactive command browser, categorized guides, and direct FAQ links',
    type: 1,
    options: [
      {
        type: 3,
        name: 'command',
        description: 'Specific slash command name to inspect',
        required: false
      }
    ]
  },
  {
    name: 'botinfo',
    description: 'Display Silence Designs Bot uptime, memory, version, and developer stats',
    type: 1
  },
  {
    name: 'ping',
    description: 'Check bot websocket latency and Discord REST API ping in milliseconds',
    type: 1
  },
  {
    name: 'profile',
    description: 'View user profile, linked Roblox account, order history, and booster status',
    type: 1,
    options: [
      {
        type: 6,
        name: 'user',
        description: 'Target member to inspect',
        required: false
      }
    ]
  },
  {
    name: 'leaderboard',
    description: 'View top community supporters, server boosters, and designer rankings',
    type: 1
  },
  {
    name: 'credits',
    description: 'Silence Designs project creators, developer Carlos473, and contributors',
    type: 1
  },

  // Additional Required Commands & Subcommands
  {
    name: 'botsay',
    description: 'Post rich custom embed as the bot with custom title, color, fields, and ping',
    type: 1,
    options: [
      {
        type: 7,
        name: 'channel',
        description: 'Target channel to post the embed in',
        required: false
      },
      {
        type: 3,
        name: 'title',
        description: 'Embed headline',
        required: false
      },
      {
        type: 3,
        name: 'description',
        description: 'Embed message content',
        required: false
      }
    ]
  },
  {
    name: 'ticket-create-panel',
    description: 'Deploy the permanent interactive Support Center ticket panel with category menu',
    type: 1
  },
  {
    name: 'services',
    description: 'Display the permanent Silence Designs Services embed with live status and buttons',
    type: 1
  },
  {
    name: 'store',
    description: 'Browse Silence Designs+ membership, donations, booster perks, and ads packages',
    type: 1
  },
  {
    name: 'giveaway',
    description: 'Manage interactive server giveaways with join buttons',
    type: 1,
    options: [
      {
        type: 1,
        name: 'create',
        description: 'Launch a new giveaway',
        options: [
          { type: 3, name: 'prize', description: 'Giveaway prize description', required: true },
          { type: 3, name: 'sponsor', description: 'Giveaway sponsor name', required: true },
          { type: 4, name: 'winners', description: 'Number of winners to pick', required: true }
        ]
      },
      {
        type: 1,
        name: 'end',
        description: 'Conclude giveaway and draw winners immediately',
        options: [
          { type: 3, name: 'giveaway_id', description: 'Giveaway ID to conclude', required: true }
        ]
      },
      {
        type: 1,
        name: 'reroll',
        description: 'Pick new winners for a completed giveaway',
        options: [
          { type: 3, name: 'giveaway_id', description: 'Giveaway ID to reroll', required: true }
        ]
      }
    ]
  },
  {
    name: 'release',
    description: 'Publish free or paid design release with attached ZIP file and preview image',
    type: 1,
    options: [
      { type: 3, name: 'title', description: 'Resource release title', required: true },
      { type: 3, name: 'description', description: 'Resource details and license', required: true },
      { type: 3, name: 'file_url', description: 'Download link or attached ZIP path', required: true },
      { type: 3, name: 'preview_url', description: 'Image preview screenshot URL', required: false }
    ]
  },
  {
    name: 'group-info',
    description: 'Fetch live Roblox community group data, member count, owner, and group link',
    type: 1
  },
  {
    name: 'about',
    description: 'About Silence Designs Bot, Creator Carlos473 (ID: 1025813762684502168), uptime & stats',
    type: 1
  },
  {
    name: 'report',
    description: 'Privately submit a report against a member or designer directly to management',
    type: 1,
    options: [
      { type: 3, name: 'target', description: 'Username or ID being reported', required: true },
      { type: 3, name: 'reason', description: 'Reason and evidence summary', required: true }
    ]
  },
  // Unified Native Subcommand Architecture for /manage
  {
    name: 'manage',
    description: 'Manage Silence Designs studio settings, services, and hosting',
    type: 1,
    options: [
      {
        type: 1,
        name: 'hosting',
        description: 'View and manage your custom Silence Designs hosted bot subscriptions'
      },
      {
        type: 1,
        name: 'hosting-pricing',
        description: 'View current hosting tiers (Monthly R$250, Quarterly R$500, Bi-Annually R$900)'
      },
      {
        type: 1,
        name: 'services',
        description: 'Toggle Clothing, Livery, Graphics, Bot Dev between Open and Closed states',
        options: [
          {
            type: 3,
            name: 'service',
            description: 'Target service to update',
            required: true,
            choices: [
              { name: 'Livery', value: 'livery' },
              { name: 'Graphics', value: 'graphics' },
              { name: 'Clothing', value: 'clothing' },
              { name: 'Bot Development', value: 'bot_development' }
            ]
          },
          {
            type: 3,
            name: 'status',
            description: 'New status for service',
            required: true,
            choices: [
              { name: 'Open (Accepting Orders)', value: 'open' },
              { name: 'Closed (Halted)', value: 'closed' }
            ]
          }
        ]
      },
      {
        type: 1,
        name: 'settings',
        description: 'Inspect and configure server roles, ticket categories, currency, and channels'
      },
      {
        type: 1,
        name: 'status',
        description: 'Inspect and manage rotating bot presence messages'
      }
    ]
  }
];
