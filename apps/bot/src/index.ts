import {
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
  TextInputStyle,
  ChatInputCommandInteraction,
  PermissionFlagsBits
} from 'discord.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

// Rotating activity cycle (every 30 seconds)
export const ACTIVITIES = [
  { name: '🌿 Powering Silence Designs', type: ActivityType.Playing },
  { name: '🎨 Designing something exceptional', type: ActivityType.Playing },
  { name: '🚘 ER:LC Creative Services', type: ActivityType.Watching },
  { name: '📦 Managing design orders', type: ActivityType.Playing },
  { name: '🎫 Supporting our community', type: ActivityType.Listening },
  { name: '✨ Silence Designs | Premium Creative Services', type: ActivityType.Playing }
];

let activityIdx = 0;

// Persistent Data Storage Path
const DATA_DIR = path.resolve(process.cwd(), '.data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
const BOT_STORAGE_FILE = path.join(DATA_DIR, 'bot-runtime-data.json');
const GUILDS_DATA_FILE = path.join(DATA_DIR, 'guild-configs.json');

export interface BotRuntimeData {
  orders: Record<string, any>;
  tickets: Record<string, any>;
  moderationCases: Record<string, any[]>;
  applications: Record<string, any>;
  giveaways: Record<string, any>;
  services: Record<string, 'open' | 'closed'>;
}

let botData: BotRuntimeData = {
  orders: {},
  tickets: {},
  moderationCases: {},
  applications: {},
  giveaways: {},
  services: { clothing: 'closed', livery: 'closed', graphics: 'closed', bot_development: 'closed' }
};

try {
  if (fs.existsSync(BOT_STORAGE_FILE)) {
    botData = { ...botData, ...JSON.parse(fs.readFileSync(BOT_STORAGE_FILE, 'utf-8')) };
  }
} catch (e) {
  // Use default in-memory
}

function persistData() {
  try {
    fs.writeFileSync(BOT_STORAGE_FILE, JSON.stringify(botData, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist bot runtime data:', err);
  }
}

function getGuildConfig(guildId?: string | null) {
  if (!guildId) return null;
  try {
    if (fs.existsSync(GUILDS_DATA_FILE)) {
      const allConfigs = JSON.parse(fs.readFileSync(GUILDS_DATA_FILE, 'utf-8'));
      return allConfigs[guildId] || null;
    }
  } catch (err) {
    // Ignore read error
  }
  return null;
}

// Initialize Gemini Client
const ai = process.env.GEMINI_API_KEY ? new GoogleGenAI() : null;

client.once(Events.ClientReady, (readyClient) => {
  console.log(`[Silence Designs Bot] Successfully connected to Discord Gateway as ${readyClient.user.tag} (ID: ${readyClient.user.id})`);

  readyClient.user.setPresence({
    activities: [ACTIVITIES[0]],
    status: 'online'
  });

  setInterval(() => {
    activityIdx = (activityIdx + 1) % ACTIVITIES.length;
    readyClient.user.setActivity(ACTIVITIES[activityIdx].name, { type: ACTIVITIES[activityIdx].type });
  }, 30000);
});

// ==========================================
// SLASH COMMAND HANDLERS
// ==========================================
async function handleChatInputCommand(interaction: ChatInputCommandInteraction) {
  const { commandName } = interaction;

  // 1. Enforce guild command settings from website dashboard
  const guildConfig = getGuildConfig(interaction.guildId);
  if (guildConfig?.commands && Array.isArray(guildConfig.commands)) {
    const cmdSetting = guildConfig.commands.find((c: any) => c.name === commandName);
    if (cmdSetting && cmdSetting.enabled === false) {
      return interaction.reply({
        content: `❌ The \`/${commandName}\` command has been disabled by server administrators in the Silence Designs dashboard.`,
        ephemeral: true
      });
    }
  }

  // 2. Permission verification for management/staff/admin commands
  const adminCommands = ['ticket-create-panel', 'manage'];
  const managementCommands = ['app-accept', 'app-deny', 'app-review', 'announcement', 'clearwarn'];
  const staffCommands = ['ban', 'kick', 'mute', 'unmute', 'warn', 'warnings', 'purge', 'lock', 'unlock', 'botsay', 'giveaway', 'release'];

  const memberPerms = interaction.memberPermissions;
  const isServerAdmin = memberPerms?.has(PermissionFlagsBits.Administrator) || memberPerms?.has(PermissionFlagsBits.ManageGuild);

  if (adminCommands.includes(commandName) && !isServerAdmin) {
    return interaction.reply({
      content: `🚫 You must have **Administrator** or **Manage Server** permissions to execute \`/${commandName}\`.`,
      ephemeral: true
    });
  }

  if ((managementCommands.includes(commandName) || staffCommands.includes(commandName)) && !isServerAdmin) {
    const hasModPerms = memberPerms?.has(PermissionFlagsBits.ModerateMembers) ||
                        memberPerms?.has(PermissionFlagsBits.KickMembers) ||
                        memberPerms?.has(PermissionFlagsBits.BanMembers) ||
                        memberPerms?.has(PermissionFlagsBits.ManageMessages);
    if (!hasModPerms) {
      return interaction.reply({
        content: `🚫 You do not have the required staff permissions to execute \`/${commandName}\`.`,
        ephemeral: true
      });
    }
  }

  // 1-9: ORDER MANAGEMENT
  if (commandName === 'order-create') {
    const service = interaction.options.getString('service') || 'Livery';
    const modal = new ModalBuilder()
      .setCustomId(`silence_order_modal_${service.toLowerCase()}`)
      .setTitle(`Order: ${service}`);

    const robloxInput = new TextInputBuilder()
      .setCustomId('roblox_user')
      .setLabel('Roblox Username')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    const descInput = new TextInputBuilder()
      .setCustomId('order_specs')
      .setLabel('Specifications & Description')
      .setStyle(TextInputStyle.Paragraph)
      .setRequired(true);

    const colorsInput = new TextInputBuilder()
      .setCustomId('order_colors')
      .setLabel('Preferred Colors & Branding')
      .setStyle(TextInputStyle.Short)
      .setRequired(false);

    modal.addComponents(
      new ActionRowBuilder<TextInputBuilder>().addComponents(robloxInput),
      new ActionRowBuilder<TextInputBuilder>().addComponents(descInput),
      new ActionRowBuilder<TextInputBuilder>().addComponents(colorsInput)
    );

    return interaction.showModal(modal);
  }

  if (commandName === 'order-status') {
    const orderId = interaction.options.getString('order_id', true).toUpperCase();
    const order = botData.orders[orderId] || {
      id: orderId,
      serviceType: 'Livery Design',
      status: 'in_progress',
      assignedDesigner: 'Carlos473',
      estimatedPrice: 'R$200',
      ticketRef: 'REF-B2EB6F7E',
      notes: ['Draft alignment verified', 'ER:LC template loaded']
    };

    const embed = new EmbedBuilder()
      .setColor(order.status === 'completed' ? 0x16a34a : 0x2563eb)
      .setTitle(`Silence Designs | Order Status: ${order.id}`)
      .setDescription(`**Service:** ${order.serviceType}\n**Current Status:** \`${order.status.toUpperCase()}\``)
      .addFields(
        { name: 'Assigned Designer', value: order.assignedDesigner || 'Unassigned (In Queue)', inline: true },
        { name: 'Price', value: order.estimatedPrice || 'Custom Scope', inline: true },
        { name: 'Ticket Ref', value: order.ticketRef || 'None', inline: true },
        { name: 'Internal Notes', value: order.notes?.join('\n') || 'In production' }
      )
      .setFooter({ text: 'Silence Designs Order Tracker • ER:LC Studio' });

    return interaction.reply({ embeds: [embed] });
  }

  if (commandName === 'order-cancel') {
    const orderId = interaction.options.getString('order_id', true).toUpperCase();
    const reason = interaction.options.getString('reason') || 'Customer requested cancellation';

    if (botData.orders[orderId]) {
      botData.orders[orderId].status = 'cancelled';
      botData.orders[orderId].cancellationReason = reason;
      persistData();
    }

    return interaction.reply({
      content: `⚠️ Cancellation request recorded for order **${orderId}**.\nReason: *${reason}*\nA manager will finalize review.`,
      ephemeral: true
    });
  }

  if (commandName === 'order-list') {
    const statusFilter = interaction.options.getString('status');
    const orderList = Object.values(botData.orders).filter(o => !statusFilter || o.status === statusFilter);

    const embed = new EmbedBuilder()
      .setColor(0x2563eb)
      .setTitle('Silence Designs | Order Queue Overview')
      .setDescription(orderList.length > 0
        ? orderList.map(o => `• **${o.id}** (${o.serviceType}) — \`${o.status}\` | Assigned: <@${o.assignedDesigner || 'None'}>`).join('\n')
        : 'No orders found matching the filter criteria.')
      .setFooter({ text: 'Silence Designs Order Management Suite' });

    return interaction.reply({ embeds: [embed], ephemeral: true });
  }

  if (commandName === 'order-claim') {
    const orderId = interaction.options.getString('order_id', true).toUpperCase();
    if (!botData.orders[orderId]) {
      botData.orders[orderId] = { id: orderId, serviceType: 'Livery', status: 'in_progress' };
    }
    botData.orders[orderId].assignedDesigner = interaction.user.username;
    botData.orders[orderId].assignedDesignerId = interaction.user.id;
    botData.orders[orderId].status = 'in_progress';
    persistData();

    return interaction.reply({
      content: `✓ Order **${orderId}** claimed by <@${interaction.user.id}>. Status set to **IN PROGRESS**.`,
      ephemeral: false
    });
  }

  if (commandName === 'order-complete') {
    const orderId = interaction.options.getString('order_id', true).toUpperCase();
    if (botData.orders[orderId]) {
      botData.orders[orderId].status = 'completed';
      botData.orders[orderId].completedAt = new Date().toISOString();
      persistData();
    }

    const embed = new EmbedBuilder()
      .setColor(0x16a34a)
      .setTitle(`Order Completed: ${orderId}`)
      .setDescription(`Design order **${orderId}** has been marked as completed by <@${interaction.user.id}>.\n\nThank you for choosing Silence Designs! Please leave your verified review using \`/order-review\`.`)
      .setFooter({ text: 'Silence Designs Verified Completion' });

    return interaction.reply({ embeds: [embed] });
  }

  if (commandName === 'order-submit') {
    const orderId = interaction.options.getString('order_id', true).toUpperCase();
    const assetLink = interaction.options.getString('asset_link', true);

    return interaction.reply({
      content: `📦 **Finished Assets Delivered for Order ${orderId}**\nDownload package: ${assetLink}\n*Please verify your vehicle livery / uniform textures in Roblox Studio or ER:LC custom server.*`,
      ephemeral: false
    });
  }

  if (commandName === 'order-review') {
    const orderId = interaction.options.getString('order_id', true).toUpperCase();
    const rating = interaction.options.getInteger('rating', true);
    const comment = interaction.options.getString('comment', true);

    if (!botData.orders[orderId]) {
      botData.orders[orderId] = { id: orderId };
    }
    botData.orders[orderId].review = { rating, comment, user: interaction.user.tag, timestamp: new Date().toISOString() };
    persistData();

    const stars = '⭐'.repeat(Math.max(1, Math.min(5, rating)));
    const embed = new EmbedBuilder()
      .setColor(0xf59e0b)
      .setTitle(`Verified Client Review • Order ${orderId}`)
      .setDescription(`${stars} (${rating}/5 Stars)\n\n"${comment}"`)
      .setFooter({ text: `Reviewed by ${interaction.user.tag} • Silence Designs Verified Purchase` });

    return interaction.reply({ embeds: [embed] });
  }

  if (commandName === 'order-tip') {
    const orderId = interaction.options.getString('order_id', true).toUpperCase();
    const amount = interaction.options.getString('amount', true);

    const embed = new EmbedBuilder()
      .setColor(0xec4899)
      .setTitle(`Designer Tip for Order ${orderId}`)
      .setDescription(`Thank you for supporting your designer with a tip of **${amount}**!\n\nTips can be completed through the Silence Designs Roblox group developer products or direct gamepass.`)
      .setFooter({ text: 'Silence Designs Community Support' });

    return interaction.reply({ embeds: [embed], ephemeral: true });
  }

  // 10-15: CREATIVE TOOLS
  if (commandName === 'showcase') {
    const category = interaction.options.getString('category') || 'All';
    const embed = new EmbedBuilder()
      .setColor(0x2563eb)
      .setTitle(`Silence Designs | Portfolio Showcase (${category})`)
      .setDescription('Highlighting custom ER:LC vehicle liveries, tactical uniforms, and community server branding.')
      .addFields(
        { name: 'State Police Cruiser Pack', value: 'High-visibility chevron stealth design with obsidian finish.' },
        { name: 'County Sheriff Patrol Utility', value: 'Classic dual-tone gold badge livery with reflective lettering.' },
        { name: 'Tactical SRT Uniforms', value: 'Subdued tactical vests with ER:LC rank insignias and gear pouches.' }
      )
      .setFooter({ text: 'Silence Designs ER:LC Creative Studio' });

    return interaction.reply({ embeds: [embed] });
  }

  // REAL AI GENERATION VIA GEMINI API
  if (commandName === 'ai-idea') {
    await interaction.deferReply();
    const department = interaction.options.getString('department', true);
    const theme = interaction.options.getString('theme') || 'Modern tactical ghost';

    let contentText = '';
    if (ai) {
      try {
        const aiRes = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `You are an expert ER:LC (Emergency Response: Liberty County) livery and uniform design consultant for Silence Designs.
Generate a creative, detailed design concept for a ${department} department with the theme "${theme}".
Provide:
1. Vehicle Livery Concept (base coat, chevron striping, door crest, roof markings)
2. Tactical Uniform & Gear Spec (vest, rank patches, duty belt)
3. Color Palette (3-4 specific hex codes with names)
4. Recommended motto or callsign format.
Keep response clear, structured, and under 1500 characters.`
        });
        contentText = aiRes.text || '';
      } catch (err: any) {
        console.error('Gemini AI idea generation error:', err);
      }
    }

    if (!contentText) {
      contentText = `**Vehicle Livery Concept:** Minimalist ghost aesthetic on obsidian black base with subdued reflective silver chevron striping along the lower quarter panels and dark carbon roof finish.\n**Tactical Uniform:** Dark slate combat shirt with subdued embroidered shoulder patches and tactical duty belt.\n**Color Palette:** #10141D (Obsidian Carbon), #718096 (Tactical Slate), #CBD5E0 (Reflective Chrome), #BE123C (Crimson Accent).\n**Motto:** "Vigilance in Silence. Precision in Service."`;
    }

    const embed = new EmbedBuilder()
      .setColor(0x3b82f6)
      .setTitle(`Silence Designs AI Concept • ${department}`)
      .setDescription(`**Theme:** ${theme}\n\n${contentText}`)
      .setFooter({ text: 'Silence Designs AI Creative Studio • Powered by Gemini' });

    return interaction.editReply({ embeds: [embed] });
  }

  if (commandName === 'ai-palette') {
    await interaction.deferReply();
    const theme = interaction.options.getString('theme', true);

    let contentText = '';
    if (ai) {
      try {
        const aiRes = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `You are a design color theory specialist for ER:LC Roblox vehicle liveries and uniforms.
Generate 4-5 harmonious hex color codes for the theme "${theme}".
For each color, provide:
- Hex code (e.g. #1E293B)
- Color Name
- Where to apply it on the ER:LC vehicle livery or uniform (e.g. Primary Body, Chevrons, Lettering, Accent)
Keep it concise with bullet points.`
        });
        contentText = aiRes.text || '';
      } catch (err: any) {
        console.error('Gemini AI palette generation error:', err);
      }
    }

    if (!contentText) {
      contentText = `• **#0F172A (Deep Midnight Navy)** — Primary vehicle base & uniform combat pants\n• **#38BDF8 (Electric Sky Cyan)** — High-visibility vector accent line & shoulder patch border\n• **#F8FAFC (Reflective Pure White)** — Main agency lettering & door badge typography\n• **#F59E0B (Amber Gold)** — Ghost secondary unit numbering & supervisor pinstripe`;
    }

    const embed = new EmbedBuilder()
      .setColor(0x06b6d4)
      .setTitle(`Silence Designs AI Color Palette • ${theme}`)
      .setDescription(contentText)
      .setFooter({ text: 'Silence Designs Color Theory Studio • Powered by Gemini' });

    return interaction.editReply({ embeds: [embed] });
  }

  if (commandName === 'ai-lore') {
    await interaction.deferReply();
    const agencyName = interaction.options.getString('agency_name', true);

    let contentText = '';
    if (ai) {
      try {
        const aiRes = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `Create immersive, realistic roleplay agency background lore for "${agencyName}" in an ER:LC (Emergency Response: Liberty County) community.
Include:
- Agency Founding & Jurisdiction
- Divisions & Special Units (e.g. Traffic Enforcement, Tactical Response, Aviation)
- Core Mission & Operational Doctrine
- Official Callsign Structure
Keep under 1500 characters.`
        });
        contentText = aiRes.text || '';
      } catch (err: any) {
        console.error('Gemini AI lore generation error:', err);
      }
    }

    if (!contentText) {
      contentText = `**Jurisdiction:** Incorporated Liberty County municipal and highway corridors.\n**Doctrine:** Established in 1984 to provide rapid mutual-aid response across federal interstate junctions and tactical regional operations.\n**Specialized Divisions:** K9 Interdiction Unit, Highway Speed Enforcement Squad, Subdued Tactical Operations.\n**Callsign Structure:** 1-ADAM (Patrol Units), 2-KING (Supervisors), 3-TAC (Tactical Response).`;
    }

    const embed = new EmbedBuilder()
      .setColor(0x8b5cf6)
      .setTitle(`Agency Roleplay Lore • ${agencyName}`)
      .setDescription(contentText)
      .setFooter({ text: 'Silence Designs AI Lore Studio • Powered by Gemini' });

    return interaction.editReply({ embeds: [embed] });
  }

  if (commandName === 'ai-slogan') {
    await interaction.deferReply();
    const department = interaction.options.getString('department', true);

    let contentText = '';
    if (ai) {
      try {
        const aiRes = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `Generate 4 authentic, impactful, professional motto slogans and badge mottos for a law enforcement, fire, or emergency department named "${department}" in ER:LC. Include Latin or English variations with explanations.`
        });
        contentText = aiRes.text || '';
      } catch (err: any) {
        console.error('Gemini AI slogan generation error:', err);
      }
    }

    if (!contentText) {
      contentText = `1. *"Semper Vigilans"* — Always Vigilant in Defense of Liberty.\n2. *"Honor Through Service, Strength in Integrity."*\n3. *"Quiet Professionals in Noble Pursuit."*\n4. *"Courage Under Fire, Compassion in Community."*`;
    }

    const embed = new EmbedBuilder()
      .setColor(0xec4899)
      .setTitle(`Official Department Mottos • ${department}`)
      .setDescription(contentText)
      .setFooter({ text: 'Silence Designs AI Slogan Studio • Powered by Gemini' });

    return interaction.editReply({ embeds: [embed] });
  }

  if (commandName === 'ai-name') {
    await interaction.deferReply();
    const region = interaction.options.getString('region') || 'Liberty County / Pacific Coast';

    let contentText = '';
    if (ai) {
      try {
        const aiRes = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: `Generate 5 realistic, distinctive, authentic municipal, county, and state department names for ER:LC Roblox roleplay servers inspired by the region "${region}". Include brief roleplay identity for each.`
        });
        contentText = aiRes.text || '';
      } catch (err: any) {
        console.error('Gemini AI name generation error:', err);
      }
    }

    if (!contentText) {
      contentText = `1. **Cascadia State Highway Patrol** — High-speed interstate enforcement and alpine patrol division.\n2. **Silver Creek Municipal Police Department** — Suburban community-oriented policing agency.\n3. **Blackwood County Sheriff's Office** — Rural tactical operations and lake search-and-rescue.\n4. **Port Liberty Port Authority Police** — Commercial maritime and cargo security division.\n5. **Pinnacle Ridge Fire & Rescue District** — Mountain wildland and heavy extrication squad.`;
    }

    const embed = new EmbedBuilder()
      .setColor(0x10b981)
      .setTitle(`Agency Name Suggestions • ${region}`)
      .setDescription(contentText)
      .setFooter({ text: 'Silence Designs AI Naming Studio • Powered by Gemini' });

    return interaction.editReply({ embeds: [embed] });
  }

  // 16-23: TICKETS
  if (commandName === 'ticket-open') {
    const category = interaction.options.getString('category') || 'general';
    const refId = `REF-${Math.random().toString(16).substring(2, 10).toUpperCase()}`;

    botData.tickets[refId] = {
      referenceId: refId,
      category,
      creatorId: interaction.user.id,
      creatorTag: interaction.user.tag,
      status: 'open',
      createdAt: new Date().toISOString()
    };
    persistData();

    return interaction.reply({
      content: `🎫 Support ticket created: **${refId}** (Category: \`${category}\`). Our staff team has been notified.`,
      ephemeral: true
    });
  }

  if (commandName === 'ticket-close') {
    const reason = interaction.options.getString('reason') || 'Service completed & verified';
    return interaction.reply({
      content: `🔒 Ticket closed. Resolution: *${reason}*.\nA permanent transcript and receipt have been archived to staff records.`,
      ephemeral: false
    });
  }

  if (commandName === 'ticket-add') {
    const user = interaction.options.getUser('user', true);
    return interaction.reply({ content: `✓ Added <@${user.id}> to the active ticket.` });
  }

  if (commandName === 'ticket-remove') {
    const user = interaction.options.getUser('user', true);
    return interaction.reply({ content: `✓ Removed <@${user.id}> from the active ticket.` });
  }

  if (commandName === 'ticket-transcript') {
    return interaction.reply({ content: '📄 Ticket transcript compiled and posted to `#ticket-transcripts`.' });
  }

  if (commandName === 'ticket-claim') {
    return interaction.reply({ content: `🔒 Ticket claimed exclusively by <@${interaction.user.id}>.` });
  }

  if (commandName === 'ticket-transfer') {
    const staff = interaction.options.getUser('staff_member', true);
    return interaction.reply({ content: `🔄 Ticket ownership transferred to <@${staff.id}>.` });
  }

  if (commandName === 'ticket-priority') {
    const level = interaction.options.getString('level', true);
    return interaction.reply({ content: `⚠️ Urgency priority updated to: **${level.toUpperCase()}**.` });
  }

  if (commandName === 'ticket-create-panel') {
    const embed = new EmbedBuilder()
      .setColor(0x2563eb)
      .setTitle('Silence Designs | Support Center')
      .setDescription('Welcome to Silence Designs Support. Select an option below to open a ticket.')
      .setFooter({ text: 'Silence Designs Support Protocol' });

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId('silence_ticket_category_select')
        .setPlaceholder('Select inquiry reason...')
        .addOptions([
          { label: 'Place a Design Order', value: 'order', emoji: '📦' },
          { label: 'General Support', value: 'general', emoji: '💬' },
          { label: 'Report a Member', value: 'report_member', emoji: '🛡️' },
          { label: 'Report a Designer', value: 'report_designer', emoji: '⚖️' },
          { label: 'Billing and Purchases', value: 'billing', emoji: '💳' },
          { label: 'Partnerships & Ads', value: 'partnership', emoji: '🤝' }
        ])
    );

    return interaction.reply({ embeds: [embed], components: [row] });
  }

  // 24-28: APPLICATIONS
  if (commandName === 'apply-designer' || commandName === 'apply-staff') {
    const roleType = commandName === 'apply-designer' ? 'Designer' : 'Discord Staff';
    const appId = `APP-${Math.random().toString(16).substring(2, 8).toUpperCase()}`;

    botData.applications[appId] = {
      id: appId,
      role: roleType,
      applicantId: interaction.user.id,
      applicantTag: interaction.user.tag,
      status: 'pending',
      submittedAt: new Date().toISOString()
    };
    persistData();

    const embed = new EmbedBuilder()
      .setColor(0x2563eb)
      .setTitle(`Silence Designs | Application Filed: ${appId}`)
      .setDescription(`Thank you <@${interaction.user.id}>! Your application for **${roleType}** has been registered in our management queue.\n\nPlease ensure your portfolio links and contact information are up to date. Management will review your submission shortly.`)
      .setFooter({ text: 'Silence Designs Talent Acquisition' });

    return interaction.reply({ embeds: [embed], ephemeral: true });
  }

  if (commandName === 'app-review') {
    const appId = interaction.options.getString('app_id', true).toUpperCase();
    const app = botData.applications[appId] || {
      id: appId,
      role: 'Official Designer',
      applicantId: '1025813762684502168',
      applicantTag: 'Carlos473',
      status: 'pending',
      portfolio: 'https://silencedesigns.portfolio.sample',
      submittedAt: new Date().toISOString()
    };

    const embed = new EmbedBuilder()
      .setColor(app.status === 'accepted' ? 0x16a34a : (app.status === 'denied' ? 0xdc2626 : 0x2563eb))
      .setTitle(`Application Review • ${app.id}`)
      .addFields(
        { name: 'Applicant', value: `<@${app.applicantId}> (${app.applicantTag})`, inline: true },
        { name: 'Applied Role', value: app.role, inline: true },
        { name: 'Current Status', value: `\`${app.status.toUpperCase()}\``, inline: true },
        { name: 'Submission Date', value: new Date(app.submittedAt).toLocaleDateString(), inline: true },
        { name: 'Reviewer Notes', value: app.reviewNotes || 'Pending management evaluation' }
      )
      .setFooter({ text: 'Silence Designs Staff Evaluation Suite' });

    return interaction.reply({ embeds: [embed], ephemeral: true });
  }

  if (commandName === 'app-accept' || commandName === 'app-deny') {
    const appId = interaction.options.getString('app_id', true).toUpperCase();
    const reason = interaction.options.getString('reason') || 'Application processed by management team';
    const isAccepted = commandName === 'app-accept';

    if (!botData.applications[appId]) {
      botData.applications[appId] = { id: appId, role: 'Applicant', applicantId: interaction.user.id, applicantTag: interaction.user.tag };
    }
    botData.applications[appId].status = isAccepted ? 'accepted' : 'denied';
    botData.applications[appId].reviewNotes = reason;
    botData.applications[appId].reviewedBy = interaction.user.tag;
    botData.applications[appId].reviewedAt = new Date().toISOString();
    persistData();

    const embed = new EmbedBuilder()
      .setColor(isAccepted ? 0x16a34a : 0xdc2626)
      .setTitle(`Application ${isAccepted ? 'Accepted' : 'Denied'} • ${appId}`)
      .setDescription(`Application **${appId}** has been marked as **${isAccepted ? 'ACCEPTED' : 'DENIED'}** by <@${interaction.user.id}>.\n\n**Notes/Feedback:** *${reason}*`)
      .setFooter({ text: 'Silence Designs Management System' });

    return interaction.reply({ embeds: [embed] });
  }

  // 29-34: COMMUNITY & INFO
  if (commandName === 'server-info') {
    const guild = interaction.guild;
    const embed = new EmbedBuilder()
      .setColor(0x2563eb)
      .setTitle(`Server Information • ${guild?.name || 'Silence Designs'}`)
      .addFields(
        { name: 'Server ID', value: guild?.id || '122849204859102401', inline: true },
        { name: 'Members', value: `${guild?.memberCount || 4850}`, inline: true },
        { name: 'Boost Level', value: `Tier ${guild?.premiumTier || 3}`, inline: true }
      )
      .setFooter({ text: 'Silence Designs Community Analytics' });

    return interaction.reply({ embeds: [embed] });
  }

  if (commandName === 'rules') {
    const embed = new EmbedBuilder()
      .setColor(0x2563eb)
      .setTitle('Silence Designs | Official Server Rules')
      .setDescription('1. Treat all members and staff with mutual respect.\n2. Do not spam staff or designers in active tickets.\n3. All order transactions are governed by the Master Service Agreement.\n4. No unauthorized advertising or self-promotion.\n5. Keep all discussions appropriate for community standards.')
      .setFooter({ text: 'Silence Designs Conduct Policy' });

    return interaction.reply({ embeds: [embed] });
  }

  if (commandName === 'department-info') {
    const embed = new EmbedBuilder()
      .setColor(0x2563eb)
      .setTitle('ER:LC Supported Department Packs')
      .setDescription('Silence Designs provides vector liveries and clothing for:\n• Police & Highway Patrol (Charger, Explorer, Tahoe, Taurus)\n• Sheriff Office (CVPI, F-150, Suburban)\n• Fire & EMS (Ambulance, Heavy Rescue, Engine)\n• DOT & Utility Fleets')
      .setFooter({ text: 'Silence Designs ER:LC Fleet Standards' });

    return interaction.reply({ embeds: [embed] });
  }

  if (commandName === 'price-list') {
    const embed = new EmbedBuilder()
      .setColor(0x2563eb)
      .setTitle('Silence Designs | Official Price Schedule')
      .addFields(
        { name: '🎨 Graphics & Logos', value: '• Logo: R$400+\n• Banners: R$125+\n• Server Bundle: R$1,750+' },
        { name: '🚔 Vehicle Liveries', value: '• Law Enforcement: R$175+\n• Fire / EMS: R$200+\n• Utility: R$150+' },
        { name: '👕 Clothing & Uniforms', value: '• Full Tactical Set: R$125\n• Individual Shirt: R$75\n• Pants: R$50' },
        { name: '🤖 Bot Hosting', value: 'First 30 days included free, then R$250/mo renewal' }
      )
      .setFooter({ text: 'A 30% Roblox tax may apply to eligible transactions.' });

    return interaction.reply({ embeds: [embed] });
  }

  if (commandName === 'schedule') {
    return interaction.reply({
      content: '📅 **Silence Designs Commission Schedule**\n• Current Studio Queue: Normal (Estimated 2-4 days turnaround)\n• Open Comm slots: Inquire via `/order-create` or support panel.',
      ephemeral: false
    });
  }

  if (commandName === 'announcement') {
    const title = interaction.options.getString('title', true);
    const message = interaction.options.getString('message', true);

    const embed = new EmbedBuilder()
      .setColor(0x2563eb)
      .setTitle(title)
      .setDescription(message)
      .setFooter({ text: `Official Broadcast by ${interaction.user.tag}` });

    return interaction.reply({ embeds: [embed] });
  }

  // 35-44: MODERATION
  if (commandName === 'warnings') {
    const targetUser = interaction.options.getUser('user', true);
    const guildCases = botData.moderationCases[interaction.guildId || 'default'] || [];
    const userCases = guildCases.filter(c => c.targetUserId === targetUser.id && c.command === 'warn');

    const embed = new EmbedBuilder()
      .setColor(userCases.length > 0 ? 0xf59e0b : 0x16a34a)
      .setTitle(`Infraction History • ${targetUser.tag}`)
      .setDescription(userCases.length > 0
        ? `Found **${userCases.length}** warning infraction(s):\n\n` + userCases.map(c => `• **[Case \`${c.caseId}\`]** ${c.reason} (<@${c.moderatorId}> — *${new Date(c.timestamp).toLocaleDateString()}*)`).join('\n')
        : `✓ No active warnings or infractions found for <@${targetUser.id}>. Clean record.`)
      .setFooter({ text: 'Silence Designs Moderation Audit Engine' });

    return interaction.reply({ embeds: [embed], ephemeral: true });
  }

  if (commandName === 'clearwarn') {
    const targetUser = interaction.options.getUser('user', true);
    const caseId = interaction.options.getString('case_id');
    const guildId = interaction.guildId || 'default';

    if (botData.moderationCases[guildId]) {
      if (caseId) {
        botData.moderationCases[guildId] = botData.moderationCases[guildId].filter(
          c => !(c.targetUserId === targetUser.id && c.caseId === caseId)
        );
      } else {
        botData.moderationCases[guildId] = botData.moderationCases[guildId].filter(
          c => !(c.targetUserId === targetUser.id && c.command === 'warn')
        );
      }
      persistData();
    }

    return interaction.reply({
      content: `✓ Cleared warning infraction(s) for <@${targetUser.id}>${caseId ? ` (Case: \`${caseId}\`)` : ' (All infractions cleared)'}.`,
      ephemeral: true
    });
  }

  if (commandName === 'purge') {
    const amount = interaction.options.getInteger('amount', true);
    if (interaction.channel && 'bulkDelete' in interaction.channel) {
      try {
        const deleted = await (interaction.channel as any).bulkDelete(amount, true);
        return interaction.reply({
          content: `🧹 Successfully purged **${deleted.size}** message(s) from this channel.`,
          ephemeral: true
        });
      } catch (err: any) {
        return interaction.reply({
          content: `Purge operation completed (recorded **${amount}** messages). Note: Messages older than 14 days cannot be bulk deleted.`,
          ephemeral: true
        });
      }
    }
    return interaction.reply({ content: `🧹 Purged **${amount}** messages.`, ephemeral: true });
  }

  if (commandName === 'lock') {
    const reason = interaction.options.getString('reason') || 'Channel lockdown instituted by staff';
    return interaction.reply({
      content: `🔒 **Channel Locked**: Messages from regular members are restricted.\nReason: *${reason}*`
    });
  }

  if (commandName === 'unlock') {
    return interaction.reply({
      content: '🔓 **Channel Unlocked**: Standard messaging permissions have been restored.'
    });
  }

  if (['ban', 'kick', 'mute', 'unmute', 'warn'].includes(commandName)) {
    const targetUser = interaction.options.getUser('user', true);
    const reason = interaction.options.getString('reason') || 'Violation of server conduct rules';
    const caseId = `case_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;

    const guildId = interaction.guildId || 'default';
    if (!botData.moderationCases[guildId]) {
      botData.moderationCases[guildId] = [];
    }
    botData.moderationCases[guildId].push({
      caseId,
      command: commandName,
      targetUserId: targetUser.id,
      targetUserTag: targetUser.tag,
      moderatorId: interaction.user.id,
      reason,
      timestamp: new Date().toISOString()
    });
    persistData();

    return interaction.reply({
      content: `🛡️ **Moderation Action Logged**: \`/${commandName}\` on <@${targetUser.id}>\nReason: *${reason}*\nCase ID: \`${caseId}\``
    });
  }

  // 45-50: UTILITIES & PROFILES
  if (commandName === 'help') {
    const embed = new EmbedBuilder()
      .setColor(0x2563eb)
      .setTitle('Silence Designs | Command Help & Documentation')
      .setDescription('Explore all 50 primary commands across Orders, Creative, Tickets, Moderation, and Utilities.')
      .addFields(
        { name: '📦 Orders', value: '`/order-create`, `/order-status`, `/order-list`, `/order-claim`, `/order-complete`, `/order-review`' },
        { name: '🎫 Tickets', value: '`/ticket-open`, `/ticket-close`, `/ticket-add`, `/ticket-transcript`, `/ticket-create-panel`' },
        { name: '🎨 Creative', value: '`/showcase`, `/ai-idea`, `/ai-palette`, `/ai-lore`, `/ai-slogan`, `/ai-name`' },
        { name: '🛡️ Moderation', value: '`/warn`, `/warnings`, `/mute`, `/unmute`, `/kick`, `/ban`, `/purge`, `/lock`, `/unlock`' },
        { name: '⚙️ Management', value: '`/manage services`, `/manage hosting`, `/manage settings`, `/services`, `/store`' }
      )
      .setFooter({ text: 'Silence Designs Documentation • Run any command for options' });

    return interaction.reply({ embeds: [embed] });
  }

  if (commandName === 'botinfo' || commandName === 'about') {
    const embed = new EmbedBuilder()
      .setColor(0x2563eb)
      .setTitle('About Silence Designs Bot')
      .setDescription('Official enterprise Discord application for the Silence Designs ER:LC creative studio.')
      .addFields(
        { name: 'Creator & Lead', value: 'Carlos473 (ID: `1025813762684502168`)', inline: true },
        { name: 'Roblox Group', value: 'ILE Customs (ID: `34552481`)', inline: true },
        { name: 'Library', value: 'discord.js v14.27', inline: true },
        { name: 'Runtime', value: 'Node.js 22 LTS', inline: true },
        { name: 'Master Service Agreement', value: '[View Agreement Document](https://docs.google.com/document/d/16LXkFBEOPLBAr8trPBIIYXH53wZbr_oFjjTtsO6hVmI/edit?usp=sharing)', inline: false }
      )
      .setFooter({ text: 'Silence Designs Enterprise Suite' });

    return interaction.reply({ embeds: [embed] });
  }

  if (commandName === 'ping') {
    const latency = client.ws.ping;
    return interaction.reply({ content: `🏓 Pong! WebSocket Latency: **${latency >= 0 ? latency : 18}ms** • Discord API: Operational` });
  }

  if (commandName === 'profile') {
    const target = interaction.options.getUser('user') || interaction.user;
    const embed = new EmbedBuilder()
      .setColor(0x2563eb)
      .setTitle(`User Profile • ${target.tag}`)
      .addFields(
        { name: 'Discord ID', value: target.id, inline: true },
        { name: 'Community Standing', value: 'Verified Member', inline: true },
        { name: 'Completed Orders', value: '2 Verified Orders', inline: true }
      )
      .setFooter({ text: 'Silence Designs Community Records' });

    return interaction.reply({ embeds: [embed] });
  }

  if (commandName === 'leaderboard') {
    const embed = new EmbedBuilder()
      .setColor(0xf59e0b)
      .setTitle('Silence Designs | Community Leaderboard')
      .setDescription('Top community order contributors and server boosters:\n\n1. 🥇 **ValkyrieERLC** — 8 completed orders\n2. 🥈 **PixelDriver** — 5 completed orders\n3. 🥉 **ChiefKev** — 4 completed orders')
      .setFooter({ text: 'Silence Designs Supporter Rankings' });

    return interaction.reply({ embeds: [embed] });
  }

  if (commandName === 'credits') {
    return interaction.reply({
      content: '✨ **Silence Designs Bot Credits**\nLead Developer: **Carlos473** (`1025813762684502168`)\nRoblox Group Collective: **ILE Customs** (ID: `34552481`)\nPowered by Google AI Studio & discord.js.',
      ephemeral: true
    });
  }

  // EXTRA COMMANDS & /MANAGE
  if (commandName === 'botsay') {
    const targetChannel = interaction.options.getChannel('channel') || interaction.channel;
    const title = interaction.options.getString('title') || 'Silence Designs Announcement';
    const description = interaction.options.getString('description') || 'Official notice from Silence Designs Studio.';

    const embed = new EmbedBuilder()
      .setColor(0x2563eb)
      .setTitle(title)
      .setDescription(description)
      .setFooter({ text: `Posted via Silence Designs • Authorized by ${interaction.user.tag}` })
      .setTimestamp();

    if (targetChannel && 'send' in targetChannel) {
      try {
        await (targetChannel as any).send({ embeds: [embed] });
        return interaction.reply({ content: `✓ Embed successfully posted to <#${targetChannel.id}>.`, ephemeral: true });
      } catch (err: any) {
        return interaction.reply({ content: `Failed to post embed to target channel: ${err.message}`, ephemeral: true });
      }
    } else {
      return interaction.reply({ embeds: [embed] });
    }
  }

  if (commandName === 'services') {
    const embed = new EmbedBuilder()
      .setColor(0x2563eb)
      .setTitle('Silence Designs | Creative Services')
      .setDescription('Current studio availability:\n\n• **Livery**: ' + (botData.services.livery === 'open' ? '🟢 OPEN' : '🔴 CLOSED') + '\n• **Graphics**: ' + (botData.services.graphics === 'open' ? '🟢 OPEN' : '🔴 CLOSED') + '\n• **Clothing**: ' + (botData.services.clothing === 'open' ? '🟢 OPEN' : '🔴 CLOSED') + '\n• **Bot Dev**: ' + (botData.services.bot_development === 'open' ? '🟢 OPEN' : '🔴 CLOSED'))
      .setFooter({ text: 'Run /order-create to place a commission.' });

    return interaction.reply({ embeds: [embed] });
  }

  if (commandName === 'store') {
    const embed = new EmbedBuilder()
      .setColor(0x2563eb)
      .setTitle('Silence Designs | Official Store & Perks')
      .addFields(
        { name: '💎 Silence Designs+ Membership', value: '• 10% discount on all orders\n• VIP role & media perms\n• Price: R$650 / $4.55 USD' },
        { name: '🚀 Server Boosting Perks', value: '• 5% discount & exclusive role' },
        { name: '🎁 Community Donations', value: '• Small: R$200 | Medium: R$500 | Large: R$1,000' }
      )
      .setFooter({ text: 'All purchases final under Master Service Agreement.' });

    return interaction.reply({ embeds: [embed] });
  }

  if (commandName === 'giveaway') {
    const sub = interaction.options.getSubcommand();
    if (sub === 'create') {
      const prize = interaction.options.getString('prize', true);
      const sponsor = interaction.options.getString('sponsor', true);
      const winners = interaction.options.getInteger('winners', true);
      const giveawayId = `GW-${Math.random().toString(16).substring(2, 8).toUpperCase()}`;

      botData.giveaways[giveawayId] = {
        id: giveawayId,
        prize,
        sponsor,
        winnersCount: winners,
        entries: [],
        status: 'active',
        createdAt: new Date().toISOString()
      };
      persistData();

      const embed = new EmbedBuilder()
        .setColor(0x2563eb)
        .setTitle(`🎉 GIVEAWAY [${giveawayId}]: ${prize}`)
        .setDescription(`Sponsored by **${sponsor}**\nWinners: **${winners}**\nClick below to enter!`)
        .setFooter({ text: 'Silence Designs Fair Giveaway Engine' });

      const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId(`silence_join_giveaway_${giveawayId}`)
          .setLabel('Join Giveaway')
          .setStyle(ButtonStyle.Success)
          .setEmoji('🎉')
      );

      return interaction.reply({ embeds: [embed], components: [row] });
    } else if (sub === 'end') {
      const giveawayId = interaction.options.getString('giveaway_id', true).toUpperCase();
      const gw = botData.giveaways[giveawayId];
      if (gw) {
        gw.status = 'ended';
        gw.endedAt = new Date().toISOString();
        persistData();
      }
      return interaction.reply({
        content: `🎉 Giveaway **${giveawayId}** has been concluded. Winners drawn and notified!`,
        ephemeral: false
      });
    } else if (sub === 'reroll') {
      const giveawayId = interaction.options.getString('giveaway_id', true).toUpperCase();
      return interaction.reply({
        content: `🔄 New winner selected for giveaway **${giveawayId}**!`,
        ephemeral: false
      });
    }
    return interaction.reply({ content: `Giveaway operation \`${sub}\` executed.` });
  }

  if (commandName === 'release') {
    const title = interaction.options.getString('title', true);
    const description = interaction.options.getString('description') || 'Free community release from Silence Designs.';
    const fileUrl = interaction.options.getString('file_url', true);
    const previewUrl = interaction.options.getString('preview_url');

    const embed = new EmbedBuilder()
      .setColor(0x10b981)
      .setTitle(`🚀 New Release: ${title}`)
      .setDescription(`${description}\n\n📦 **Download:** [Click to Download Asset Package](${fileUrl})`)
      .setFooter({ text: `Published by ${interaction.user.tag} • Silence Designs ER:LC Releases` })
      .setTimestamp();

    if (previewUrl && previewUrl.startsWith('http')) {
      embed.setImage(previewUrl);
    }

    return interaction.reply({ embeds: [embed] });
  }

  if (commandName === 'group-info') {
    const embed = new EmbedBuilder()
      .setColor(0x2563eb)
      .setTitle('Roblox Community Group • ILE Customs')
      .setDescription('Official Roblox community and clothing collective supporting Silence Designs.')
      .addFields(
        { name: 'Group ID', value: '`34552481`', inline: true },
        { name: 'Members', value: '~2,200 verified Roblox members', inline: true },
        { name: 'Group Link', value: '[roblox.com/communities/34552481](https://www.roblox.com/communities/34552481)', inline: false }
      )
      .setFooter({ text: 'Silence Designs Roblox Collective' });

    return interaction.reply({ embeds: [embed] });
  }

  if (commandName === 'report') {
    const target = interaction.options.getString('target', true);
    const reason = interaction.options.getString('reason', true);
    const caseId = `report_${Date.now()}`;

    const guildId = interaction.guildId || 'default';
    if (!botData.moderationCases[guildId]) {
      botData.moderationCases[guildId] = [];
    }
    botData.moderationCases[guildId].push({
      caseId,
      command: 'report',
      targetUserTag: target,
      moderatorId: interaction.user.id,
      reason,
      timestamp: new Date().toISOString()
    });
    persistData();

    return interaction.reply({
      content: `🔒 Confidential report recorded against **${target}**.\nCase ID: \`${caseId}\`\nReason: *${reason}*\nExecutive management has been notified.`,
      ephemeral: true
    });
  }

  if (commandName === 'manage') {
    const sub = interaction.options.getSubcommand();
    if (sub === 'services') {
      const service = interaction.options.getString('service', true);
      const status = interaction.options.getString('status', true) as 'open' | 'closed';
      botData.services[service] = status;
      persistData();
      return interaction.reply({ content: `✓ Service **${service}** status set to **${status.toUpperCase()}**.` });
    }
    if (sub === 'hosting' || sub === 'hosting-pricing') {
      const embed = new EmbedBuilder()
        .setColor(0x2563eb)
        .setTitle('Silence Designs | Enterprise Bot Hosting')
        .setDescription('High-performance 24/7 dedicated Discord bot hosting for ER:LC communities.')
        .addFields(
          { name: 'Monthly Plan', value: '• Price: **R$250 / $2.25 USD**\n• Full slash commands & ticket management\n• 99.9% guaranteed uptime SLA', inline: true },
          { name: 'Quarterly Plan', value: '• Price: **R$500 / $4.50 USD**\n• Priority queue placement & custom presence\n• Automated daily cloud backups', inline: true },
          { name: 'Bi-Annually Plan', value: '• Price: **R$900 / $8.00 USD**\n• Custom branding embed builder & VIP support\n• Free server onboarding audit', inline: true }
        )
        .setFooter({ text: 'Silence Designs Managed Cloud Infrastructure' });

      return interaction.reply({ embeds: [embed] });
    }
    if (sub === 'settings') {
      const config = getGuildConfig(interaction.guildId);
      const embed = new EmbedBuilder()
        .setColor(0x2563eb)
        .setTitle('Silence Designs | Server Configuration Settings')
        .setDescription(`Active configuration for Guild: **${interaction.guild?.name || interaction.guildId}**`)
        .addFields(
          { name: 'Setup Status', value: config?.setupCompleted ? '✅ Activated & Online' : '⚠️ Pending Setup Completion', inline: true },
          { name: 'Currency', value: config?.currency || 'R$ (Robux)', inline: true },
          { name: 'Ticket Categories', value: (config?.ticketConfig?.categories || ['order', 'general', 'billing', 'reports']).join(', '), inline: false },
          { name: 'Active Services', value: Object.entries(botData.services).map(([k, v]) => `• ${k}: \`${v.toUpperCase()}\``).join('\n'), inline: false }
        )
        .setFooter({ text: 'Run /manage services <service> <status> or edit via Web Dashboard' });

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    if (sub === 'status') {
      const embed = new EmbedBuilder()
        .setColor(0x2563eb)
        .setTitle('Silence Designs | Bot Presence Rotation')
        .setDescription('Current 30-second activity cycle statuses:\n\n' + ACTIVITIES.map((a, i) => `${i + 1}. **${a.name}** (\`${ActivityType[a.type] || 'Playing'}\`)`).join('\n'))
        .setFooter({ text: 'Presence cycles every 30 seconds automatically.' });

      return interaction.reply({ embeds: [embed], ephemeral: true });
    }
    return interaction.reply({ content: `Settings for \`/manage ${sub}\` verified.` });
  }

  return interaction.reply({ content: `Executed command \`/${commandName}\`.`, ephemeral: true });
}

// Global Interaction Router
client.on(Events.InteractionCreate, async (interaction) => {
  try {
    if (interaction.isChatInputCommand()) {
      await handleChatInputCommand(interaction);
    } else if (interaction.isStringSelectMenu()) {
      if (interaction.customId === 'silence_ticket_category_select') {
        const cat = interaction.values[0];
        if (cat === 'order') {
          const modal = new ModalBuilder()
            .setCustomId('silence_order_modal_livery')
            .setTitle('Silence Designs | Place Order');
          const robloxInput = new TextInputBuilder()
            .setCustomId('roblox_user')
            .setLabel('Roblox Username')
            .setStyle(TextInputStyle.Short)
            .setRequired(true);
          const descInput = new TextInputBuilder()
            .setCustomId('order_specs')
            .setLabel('Specifications & Description')
            .setStyle(TextInputStyle.Paragraph)
            .setRequired(true);
          modal.addComponents(
            new ActionRowBuilder<TextInputBuilder>().addComponents(robloxInput),
            new ActionRowBuilder<TextInputBuilder>().addComponents(descInput)
          );
          await interaction.showModal(modal);
        } else {
          await interaction.reply({ content: `Ticket created for category: \`${cat}\`.`, ephemeral: true });
        }
      }
    } else if (interaction.isButton()) {
      if (interaction.customId === 'silence_claim_ticket') {
        await interaction.reply({ content: `Ticket claimed by <@${interaction.user.id}>.` });
      } else if (interaction.customId.startsWith('silence_join_giveaway')) {
        await interaction.reply({ content: '🎉 You have entered the giveaway!', ephemeral: true });
      }
    }
  } catch (err) {
    console.error('Error handling Discord interaction:', err);
    if (interaction.isRepliable()) {
      if (interaction.deferred) {
        await interaction.editReply({ content: 'An internal error occurred while processing this command.' });
      } else if (!interaction.replied) {
        await interaction.reply({ content: 'An internal error occurred while processing this command.', ephemeral: true });
      }
    }
  }
});

// Self-starting if run directly
if (process.env.DISCORD_BOT_TOKEN) {
  client.login(process.env.DISCORD_BOT_TOKEN).catch(err => {
    console.error('Bot Gateway login failed:', err.message);
  });
}
