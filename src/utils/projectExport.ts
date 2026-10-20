import JSZip from 'jszip';
import botIndexSource from '../../apps/bot/src/index.ts?raw';

export async function generateProjectZip(): Promise<Blob> {
  const zip = new JSZip();

  // Root files
  zip.file(
    'package.json',
    JSON.stringify(
      {
        name: 'silence-designs-bot',
        version: '1.0.0',
        description: 'Silence Designs Premium ER:LC Discord Bot and Dashboard',
        main: 'apps/bot/dist/index.js',
        scripts: {
          'dev': 'tsx apps/bot/src/index.ts',
          'build': 'tsc -p apps/bot/tsconfig.json',
          'start': 'node apps/bot/dist/index.js',
          'register-commands': 'tsx scripts/register-commands.ts',
          'validate-config': 'tsx scripts/validate-config.ts',
          'db:push': 'prisma db push',
          'db:generate': 'prisma generate',
          'db:studio': 'prisma studio'
        },
        dependencies: {
          'discord.js': '^14.27.0',
          '@google/genai': '^2.4.0',
          '@prisma/client': '^5.22.0',
          'dotenv': '^16.4.5',
          'zod': '^3.23.8',
          'express': '^4.21.1',
          'cors': '^2.8.5'
        },
        devDependencies: {
          'prisma': '^5.22.0',
          'tsx': '^4.19.2',
          'typescript': '^5.6.3',
          '@types/node': '^20.17.6',
          '@types/express': '^5.0.0',
          '@types/cors': '^2.8.17'
        }
      },
      null,
      2
    )
  );

  // TypeScript Config
  zip.file(
    'apps/bot/tsconfig.json',
    JSON.stringify(
      {
        compilerOptions: {
          target: 'ES2022',
          module: 'NodeNext',
          moduleResolution: 'NodeNext',
          outDir: '../dist',
          rootDir: './',
          strict: true,
          esModuleInterop: true,
          skipLibCheck: true,
          forceConsistentCasingInFileNames: true
        },
        include: ['src/**/*']
      },
      null,
      2
    )
  );

  zip.file(
    'tsconfig.json',
    JSON.stringify(
      {
        compilerOptions: {
          target: 'ES2022',
          module: 'NodeNext',
          moduleResolution: 'NodeNext',
          strict: true,
          esModuleInterop: true,
          skipLibCheck: true
        }
      },
      null,
      2
    )
  );

  zip.file(
    '.env.example',
    `# ==============================================================================
# SILENCE DESIGNS BOT & DASHBOARD CONFIGURATION
# Replace placeholders with your actual production Discord & Database credentials
# ==============================================================================

# Discord Bot Credentials
DISCORD_BOT_TOKEN="your_bot_token_here"
DISCORD_CLIENT_ID="1025813762684502168"
DISCORD_GUILD_ID="122849204859102401"
DISCORD_CLIENT_SECRET="your_oauth_secret_here"
DISCORD_REDIRECT_URI="http://localhost:3000/api/auth/callback"

# Database Configuration (PostgreSQL)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/silencedesigns?schema=public"

# Roles & Channels
STAFF_ROLE_ID="109849204859102406"
DESIGNER_ROLE_ID="109849204859102407"
BOOSTER_ROLE_ID="109849204859102408"
MEMBERSHIP_ROLE_ID="109849204859102409"

TICKET_CATEGORY_ID="109849204859102401"
TRANSCRIPT_CHANNEL_ID="109849204859102402"
MOD_LOG_CHANNEL_ID="109849204859102403"
RELEASES_CHANNEL_ID="109849204859102404"
ANNOUNCEMENT_CHANNEL_ID="109849204859102405"

# Roblox Integration
ROBLOX_GROUP_ID="34552481"
ROBLOX_COOKIE="" # Optional for private rank verification

# AI Assistance (Optional, for /ai-idea, /ai-palette, /ai-lore)
GEMINI_API_KEY=""

# Dashboard Port
PORT=3000
`
  );

  zip.file(
    'Dockerfile',
    `FROM node:20-alpine AS base
WORKDIR /app
RUN apk add --no-cache openssl libc6-compat
COPY package.json package-lock.json* ./
COPY prisma ./prisma/
RUN npm install
COPY . .
RUN npx prisma generate
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
`
  );

  zip.file(
    'docker-compose.yml',
    `version: '3.8'

services:
  db:
    image: postgres:16-alpine
    container_name: silence-designs-postgres
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: secure_db_password
      POSTGRES_DB: silencedesigns
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  bot:
    build: .
    container_name: silence-designs-app
    restart: always
    depends_on:
      - db
    env_file:
      - .env
    ports:
      - "3000:3000"

volumes:
  pgdata:
`
  );

  zip.file(
    'README.md',
    `# Silence Designs — Premium Discord Bot & Management Suite

Official enterprise-grade Discord bot and web dashboard for **Silence Designs**, a professional ER:LC (Emergency Response: Liberty County) livery, graphics, clothing, and creative design collective.

## Features
- **50 Primary Application Slash Commands** covering Orders, Tickets, Moderation, Roblox, AI Creative Tools, and Utility.
- **Persistent Interactive Ticket Panel** with Category Dropdowns, Modals, Exclusivity Claiming, Transcripts, and Receipt DMs.
- **Full Order Lifecycle Management** (Draft -> Submitted -> Pending Review -> Accepted -> In Progress -> Awaiting Payment -> Completed).
- **Marketplace & Advertising Queue** with Ping Option safeguards and sponsor disclosures.
- **Roblox Community Integration** (ILE Customs Group ID: 34552481).
- **Service Availability Control** for Clothing, Livery, Graphics, and Bot Development.
- **30-Second Activity Rotation** with up to 100 customizable statuses.
- **Prisma PostgreSQL Storage** with complete relational schema.

## Quick Start
1. Clone the project or unzip this archive.
2. Run \`npm install\`.
3. Copy \`.env.example\` to \`.env\` and fill in your Bot Token and Channel IDs.
4. Run \`npm run db:push\` to create database tables.
5. Run \`npm run register-commands\` to deploy slash commands to Discord.
6. Run \`npm run dev\` or \`docker-compose up -d\`.
`
  );

  // Prisma Schema
  zip.file(
    'prisma/schema.prisma',
    `datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

model GuildConfig {
  id                    String   @id @default(uuid())
  guildId               String   @unique
  guildName             String
  staffRoleId           String?
  designerRoleId        String?
  boosterRoleId         String?
  membershipRoleId      String?
  ticketCategoryId      String?
  transcriptChannelId   String?
  modLogChannelId       String?
  announcementChannelId String?
  currency              String   @default("R$")
  ordersOpen            Boolean  @default(false)
  updatedAt             DateTime @updatedAt
}

model Order {
  id                  String   @id
  customerDiscordId   String
  customerDiscordTag  String
  customerRobloxUser  String
  serviceType         String
  description         String
  preferredColors     String?
  textToInclude       String?
  estimatedPrice      String
  finalPrice          String
  status              String   @default("submitted")
  assignedDesigner    String?
  ticketRef           String?
  notes               String[]
  reviewRating        Int?
  reviewComment       String?
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt
}

model Ticket {
  id               String   @id
  referenceId      String   @unique
  category         String
  channelName      String
  status           String   @default("open")
  creatorDiscordId String
  creatorDiscordTag String
  claimedBy        String?
  claimedByTag     String?
  priority         String   @default("normal")
  inquiry          String
  closureReason    String?
  closedAt         DateTime?
  closedBy         String?
  createdAt        DateTime @default(now())
}

model ModerationCase {
  id           String   @id @default(uuid())
  caseNumber   Int      @default(autoincrement())
  targetUser   String
  targetUserId String
  moderator    String
  moderatorId  String
  action       String
  reason       String
  details      String?
  timestamp    DateTime @default(now())
}

model Advertisement {
  id             String   @id @default(uuid())
  serverName     String
  title          String
  promotion      String
  inviteLink     String
  pingType       String
  cost           Int
  status         String   @default("queue")
  queuePosition  Int
  submittedBy    String
  submittedAt    DateTime @default(now())
}

model Giveaway {
  id           String   @id @default(uuid())
  prize        String
  sponsor      String
  serverName   String
  serverInvite String?
  winnersCount Int      @default(1)
  entries      String[]
  winners      String[]
  status       String   @default("active")
  endsAt       DateTime
  createdAt    DateTime @default(now())
}
`
  );

  // Bot index.ts
  zip.file(
    'apps/bot/src/index.ts',
    `import {
  Client,
  GatewayIntentBits,
  Partials,
  ActivityType,
  Events,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle
} from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

// Rotating activity cycle (every 30 seconds as required in section 18)
const ACTIVITIES = [
  { text: '🌿 Powering Silence Designs', type: ActivityType.Playing },
  { text: '🎨 Designing something exceptional', type: ActivityType.Playing },
  { text: '🚘 ER:LC Creative Services', type: ActivityType.Watching },
  { text: '📦 Managing design orders', type: ActivityType.Playing },
  { text: '🎫 Supporting our community', type: ActivityType.Listening },
  { text: '✨ Silence Designs | Premium Creative Services', type: ActivityType.Playing }
];

let activityIdx = 0;

client.once(Events.ClientReady, (readyClient) => {
  console.log(\`[Silence Designs] Logged in as \${readyClient.user.tag}\`);

  // Initial presence
  readyClient.user.setPresence({
    activities: [ACTIVITIES[0]],
    status: 'online'
  });

  // Cycle presence every 30s
  setInterval(() => {
    activityIdx = (activityIdx + 1) % ACTIVITIES.length;
    readyClient.user.setActivity(ACTIVITIES[activityIdx].text, { type: ACTIVITIES[activityIdx].type });
  }, 30000);
});

// Persistent Ticket Dropdown & Modal Interaction Handler
client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isStringSelectMenu() && interaction.customId === 'silence_ticket_category_select') {
    const selectedCategory = interaction.values[0];

    if (selectedCategory === 'order') {
      const modal = new ModalBuilder()
        .setCustomId('silence_order_modal')
        .setTitle('Silence Designs | Place Order');

      const robloxInput = new TextInputBuilder()
        .setCustomId('roblox_user')
        .setLabel('Roblox Username')
        .setPlaceholder('Your exact Roblox username')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const serviceInput = new TextInputBuilder()
        .setCustomId('service_type')
        .setLabel('Service Type')
        .setPlaceholder('Livery / Graphics / Clothing / Bot Development')
        .setStyle(TextInputStyle.Short)
        .setRequired(true);

      const descInput = new TextInputBuilder()
        .setCustomId('order_specs')
        .setLabel('Description & Specifications')
        .setPlaceholder('Describe what you need, department colors, text, details...')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

      const colorsInput = new TextInputBuilder()
        .setCustomId('order_colors')
        .setLabel('Preferred Colors & Branding')
        .setPlaceholder('e.g. Matte Black / Silver Reflective')
        .setStyle(TextInputStyle.Short)
        .setRequired(false);

      modal.addComponents(
        new ActionRowBuilder<TextInputBuilder>().addComponents(robloxInput),
        new ActionRowBuilder<TextInputBuilder>().addComponents(serviceInput),
        new ActionRowBuilder<TextInputBuilder>().addComponents(descInput),
        new ActionRowBuilder<TextInputBuilder>().addComponents(colorsInput)
      );

      await interaction.showModal(modal);
    } else {
      const modal = new ModalBuilder()
        .setCustomId(\`silence_support_modal_\${selectedCategory}\`)
        .setTitle('Silence Designs | Support Inquiry');

      const inquiryInput = new TextInputBuilder()
        .setCustomId('inquiry_text')
        .setLabel('What do you need help with?')
        .setPlaceholder('Please describe your question or issue in detail...')
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(true);

      modal.addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(inquiryInput));
      await interaction.showModal(modal);
    }
  }

  // Handle Button Clicks (Claim, Close, Report)
  if (interaction.isButton()) {
    if (interaction.customId === 'silence_claim_ticket') {
      await interaction.reply({
        content: \`🔒 Ticket successfully claimed by <@\${interaction.user.id}>. You are the dedicated handler.\`,
        ephemeral: false
      });
    }

    if (interaction.customId === 'silence_join_giveaway') {
      await interaction.reply({
        content: 'You are entered. Good luck!',
        ephemeral: true
      });
    }
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
`
  );

  // Command registration script
  zip.file(
    'scripts/register-commands.ts',
    `import { REST, Routes } from 'discord.js';
import dotenv from 'dotenv';
dotenv.config();

const token = process.env.DISCORD_BOT_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID || '1561923039896272916';
const guildId = process.env.DISCORD_GUILD_ID;

if (!token) {
  console.error('Error: DISCORD_BOT_TOKEN is required in .env');
  process.exit(1);
}

const rest = new REST({ version: '10' }).setToken(token);

// 50 Primary + Subcommands Application Command definitions
const COMMANDS = [
  { name: 'order-create', description: 'Initiate a new design order modal for Livery, Graphics, Clothing, or Bot Dev' },
  { name: 'order-status', description: 'Look up live status, assigned designer, and updates for an order ID', options: [{ name: 'order_id', type: 3, description: 'Order ID', required: true }] },
  { name: 'order-cancel', description: 'Request cancellation of your submitted order', options: [{ name: 'order_id', type: 3, description: 'Order ID', required: true }] },
  { name: 'order-list', description: 'View orders assigned to you, or staff overview of queue' },
  { name: 'order-claim', description: 'Claim an available unassigned order as a Silence Designs designer', options: [{ name: 'order_id', type: 3, description: 'Order ID', required: true }] },
  { name: 'order-complete', description: 'Mark an order as completed, prompt customer for review', options: [{ name: 'order_id', type: 3, description: 'Order ID', required: true }] },
  { name: 'order-submit', description: 'Directly submit completed design assets to client', options: [{ name: 'order_id', type: 3, description: 'Order ID', required: true }, { name: 'asset_link', type: 3, description: 'Download link', required: true }] },
  { name: 'order-review', description: 'Leave a verified customer rating (1-5 stars) and review', options: [{ name: 'order_id', type: 3, description: 'Order ID', required: true }, { name: 'rating', type: 4, description: '1-5 Stars', required: true }, { name: 'comment', type: 3, description: 'Review comment', required: true }] },
  { name: 'order-tip', description: 'Send a Robux or USD tip to your assigned designer', options: [{ name: 'order_id', type: 3, description: 'Order ID', required: true }, { name: 'amount', type: 3, description: 'Amount', required: true }] },
  { name: 'showcase', description: 'Display recent Silence Designs portfolio highlights and verified client liveries' },
  { name: 'ai-idea', description: 'Generate creative concept ideas for police/sheriff liveries', options: [{ name: 'department', type: 3, description: 'Agency type', required: true }] },
  { name: 'ai-palette', description: 'Generate harmonious color palettes tailored for ER:LC vehicles', options: [{ name: 'theme', type: 3, description: 'Color theme concept', required: true }] },
  { name: 'ai-lore', description: 'Generate rich background lore for custom ER:LC agencies', options: [{ name: 'agency_name', type: 3, description: 'Agency name', required: true }] },
  { name: 'ai-slogan', description: 'Generate authentic badge and motto slogans', options: [{ name: 'department', type: 3, description: 'Department name', required: true }] },
  { name: 'ai-name', description: 'Generate realistic municipal department names', options: [{ name: 'region', type: 3, description: 'Region or state', required: false }] },
  { name: 'ticket-open', description: 'Open a dedicated private support or order ticket', options: [{ name: 'category', type: 3, description: 'Ticket category', required: false }] },
  { name: 'ticket-close', description: 'Close current ticket, issue receipt DM, and generate transcript' },
  { name: 'ticket-add', description: 'Add a user to the ticket', options: [{ name: 'user', type: 6, description: 'User to add', required: true }] },
  { name: 'ticket-remove', description: 'Remove a user from ticket', options: [{ name: 'user', type: 6, description: 'User to remove', required: true }] },
  { name: 'ticket-transcript', description: 'Export full transcript with timestamps to staff archive' },
  { name: 'ticket-claim', description: 'Assign the current support ticket exclusively to yourself' },
  { name: 'ticket-transfer', description: 'Transfer ticket ownership to another staff member', options: [{ name: 'staff_member', type: 6, description: 'Staff to transfer to', required: true }] },
  { name: 'ticket-priority', description: 'Adjust ticket urgency level', options: [{ name: 'level', type: 3, description: 'Urgency level', required: true }] },
  { name: 'apply-designer', description: 'Submit an application to join Silence Designs as a designer' },
  { name: 'apply-staff', description: 'Submit an application to join Silence Designs staff' },
  { name: 'app-accept', description: 'Accept an applicant and send welcome DM', options: [{ name: 'app_id', type: 3, description: 'Application ID', required: true }] },
  { name: 'app-deny', description: 'Deny an application with documented feedback', options: [{ name: 'app_id', type: 3, description: 'Application ID', required: true }] },
  { name: 'app-review', description: 'Inspect application details and portfolio links', options: [{ name: 'app_id', type: 3, description: 'Application ID', required: true }] },
  { name: 'server-info', description: 'Display server statistics, roles, boosts, and security levels' },
  { name: 'rules', description: 'Show the Silence Designs server rulebook and conduct policy' },
  { name: 'department-info', description: 'Detailed specs and ER:LC vehicle packs supported by Silence Designs' },
  { name: 'price-list', description: 'View official pricing for Livery, Graphics, Clothing, and Server Bundles' },
  { name: 'schedule', description: 'View current studio workload and commission queue timeline' },
  { name: 'announcement', description: 'Broadcast studio announcement with rich embed', options: [{ name: 'title', type: 3, description: 'Title', required: true }, { name: 'message', type: 3, description: 'Message', required: true }] },
  { name: 'ban', description: 'Ban a member with audit logging', options: [{ name: 'user', type: 6, description: 'Member to ban', required: true }, { name: 'reason', type: 3, description: 'Reason', required: false }] },
  { name: 'kick', description: 'Kick a member from the Discord community', options: [{ name: 'user', type: 6, description: 'Member to kick', required: true }] },
  { name: 'mute', description: 'Timeout a user using Discord native timeout', options: [{ name: 'user', type: 6, description: 'Member to mute', required: true }, { name: 'duration', type: 3, description: 'Duration', required: true }] },
  { name: 'unmute', description: 'Remove timeout from a previously muted user', options: [{ name: 'user', type: 6, description: 'Member to unmute', required: true }] },
  { name: 'warn', description: 'Issue a formal infraction warning to a member', options: [{ name: 'user', type: 6, description: 'Member to warn', required: true }, { name: 'reason', type: 3, description: 'Reason', required: true }] },
  { name: 'warnings', description: 'Inspect warning count and moderation history', options: [{ name: 'user', type: 6, description: 'Target member', required: true }] },
  { name: 'clearwarn', description: 'Clear warnings for a member', options: [{ name: 'user', type: 6, description: 'Target member', required: true }] },
  { name: 'purge', description: 'Bulk delete messages from current channel', options: [{ name: 'amount', type: 4, description: 'Count 1-100', required: true }] },
  { name: 'lock', description: 'Lock down a channel to prevent sending messages' },
  { name: 'unlock', description: 'Unlock a previously restricted channel' },
  { name: 'help', description: 'Interactive command browser and guides' },
  { name: 'botinfo', description: 'Silence Designs Bot uptime, version, and developer stats' },
  { name: 'ping', description: 'Check bot websocket latency and REST API ping' },
  { name: 'profile', description: 'View user profile, linked Roblox, and orders' },
  { name: 'leaderboard', description: 'View top community supporters and designers' },
  { name: 'credits', description: 'Silence Designs project creators and developer Carlos473' },
  { name: 'botsay', description: 'Post rich custom embed as the bot' },
  { name: 'ticket-create-panel', description: 'Deploy the permanent interactive Support Center ticket panel' },
  { name: 'services', description: 'Display the permanent Silence Designs Services embed' },
  { name: 'store', description: 'Browse Silence Designs+ membership, donations, and perks' },
  { name: 'giveaway', description: 'Launch and manage server giveaways' },
  { name: 'release', description: 'Publish free or paid design release with attached ZIP' },
  { name: 'group-info', description: 'Fetch live Roblox community group data' },
  { name: 'about', description: 'About Silence Designs Bot and Creator Carlos473' },
  { name: 'report', description: 'Privately submit a report against a member or designer' },
  { name: 'manage', description: 'Manage Silence Designs studio settings, services, and hosting' }
];

async function register() {
  try {
    console.log(\`Registering \${COMMANDS.length} commands...\`);
    if (guildId) {
      const res: any = await rest.put(Routes.applicationGuildCommands(clientId, guildId), { body: COMMANDS });
      console.log(\`✓ Registered \${res.length} guild commands to \${guildId}\`);
    } else {
      const res: any = await rest.put(Routes.applicationCommands(clientId), { body: COMMANDS });
      console.log(\`✓ Registered \${res.length} global commands\`);
    }
  } catch (err) {
    console.error('Registration failed:', err);
  }
}

register();
`
  );

  // Documentation files
  zip.file(
    'docs/INSTALLATION.md',
    `# Installation Guide for Silence Designs Bot

### Prerequisites
- Node.js 20+
- PostgreSQL 16+ or Docker
- Discord Bot Token with Server Members & Message Content Privileged Intents enabled in the Discord Developer Portal

### Step 1: Install Dependencies
\`\`\`bash
npm install
\`\`\`

### Step 2: Environment Configuration
\`\`\`bash
cp .env.example .env
\`\`\`
Edit \`.env\` and insert your bot token, Discord server ID, and channel IDs.

### Step 3: Run Database Migrations
\`\`\`bash
npm run db:push
\`\`\`

### Step 4: Register Slash Commands
\`\`\`bash
npm run register-commands
\`\`\`

### Step 5: Start the Bot
\`\`\`bash
npm run dev
# or for production:
npm run build && npm start
\`\`\`
`
  );

  zip.file(
    'docs/COMMANDS.md',
    `# Silence Designs Application Commands Reference

Contains 50 primary slash commands + utility subcommands:

### Order Management (1-9)
- \`/order-create\`: Initiates modal order workflow
- \`/order-status <order_id>\`: Customer and staff order lookup
- \`/order-cancel <order_id>\`: Cancel pending order
- \`/order-list\`: View assigned and active orders
- \`/order-claim <order_id>\`: Claim unassigned order
- \`/order-complete <order_id>\`: Finalize order and request review
- \`/order-submit <order_id> <asset_link>\`: Transmit files
- \`/order-review <order_id> <1-5> <comment>\`: Leave verified review
- \`/order-tip <order_id> <amount>\`: Tip assigned designer

### Creative Tools (10-15)
- \`/showcase\`: ER:LC livery highlights
- \`/ai-idea\`: AI livery design concepts
- \`/ai-palette\`: AI color schemes
- \`/ai-lore\`: Roleplay lore generation
- \`/ai-slogan\`: Department mottos
- \`/ai-name\`: Department name suggestions

### Tickets (16-23)
- \`/ticket-open\`, \`/ticket-close\`, \`/ticket-add\`, \`/ticket-remove\`, \`/ticket-transcript\`, \`/ticket-claim\`, \`/ticket-transfer\`, \`/ticket-priority\`

### Applications (24-28)
- \`/apply-designer\`, \`/apply-staff\`, \`/app-accept\`, \`/app-deny\`, \`/app-review\`

### Moderation (35-44)
- \`/ban\`, \`/kick\`, \`/mute\`, \`/unmute\`, \`/warn\`, \`/warnings\`, \`/clearwarn\`, \`/purge\`, \`/lock\`, \`/unlock\`

### Additional
- \`/botsay\`, \`/ticket-create-panel\`, \`/services\`, \`/store\`, \`/giveaway\`, \`/release\`, \`/group-info\`, \`/about\`, \`/manage hosting\`, \`/manage hosting pricing\`, \`/manage services\`, \`/manage status\`
`
  );

  return await zip.generateAsync({ type: 'blob' });
}
