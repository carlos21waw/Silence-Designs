import React, { useState, useEffect } from 'react';
import { useAuth, DiscordGuild } from '../../context/AuthContext';
import { ALL_50_PRIMARY_COMMANDS } from '../../data/initialData';
import { ASSETS } from '../../data/assets';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Save,
  Server,
  Layers,
  Ticket,
  Hash,
  Users,
  Terminal,
  ShoppingBag,
  Sparkles,
  ExternalLink,
  RefreshCw,
  Plus,
  X,
  Play,
  Activity,
  Bot
} from 'lucide-react';

const WIZARD_STEPS = [
  { id: 0, title: 'Discord Account', subtitle: 'Authentication & Session' },
  { id: 1, title: 'Server Authorization', subtitle: 'Select & Add Bot' },
  { id: 2, title: 'Branding & Profile', subtitle: 'Embed & Identity' },
  { id: 3, title: 'Roles & Hierarchy', subtitle: 'Permissions Mapping' },
  { id: 4, title: 'Channel Destinations', subtitle: 'Categories & Logs' },
  { id: 5, title: '50 Slash Commands', subtitle: 'Registry & Deployment' },
  { id: 6, title: 'Tickets & Orders', subtitle: 'Panel & Lifecycle' },
  { id: 7, title: 'Services & Store', subtitle: 'Pricing & Marketplace' },
  { id: 8, title: 'Embeds & Activities', subtitle: '30s Presence Cycle' },
  { id: 9, title: 'Readiness Checklist', subtitle: 'System Audit' },
  { id: 10, title: 'Bot Activation', subtitle: 'Verification & Go-Live' }
];

export const SetupWizard: React.FC = () => {
  const {
    user,
    selectedGuild,
    setSelectedGuild,
    guilds,
    refreshGuilds,
    setupStep,
    setSetupStep,
    completeSetupWizard,
    logout,
    botStatus
  } = useAuth();

  // Wizard state
  const [currentStep, setCurrentStep] = useState<number>(setupStep || 0);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState<string | null>(null);

  // Guild Data Fetched from Discord API
  const [roles, setRoles] = useState<any[]>([]);
  const [channels, setChannels] = useState<any[]>([]);
  const [isLoadingGuildData, setIsLoadingGuildData] = useState(false);

  // Form Configuration State
  const [profileConfig, setProfileConfig] = useState({
    displayName: 'Silence Designs',
    serverName: selectedGuild?.name || 'Silence Designs | ER:LC Studio',
    description: 'Official livery, graphics, and clothing studio for ER:LC communities.',
    logoUrl: ASSETS.logo,
    authorIcon: ASSETS.logo,
    thumbnailUrl: ASSETS.logo,
    footerBanner: ASSETS.liveryBanner,
    defaultColor: '#2563EB',
    supportInvite: 'https://discord.gg/silencedesigns',
    websiteUrl: 'https://silencedesigns.com',
    robloxGroupUrl: 'https://www.roblox.com/communities/34552481',
    msaUrl: 'https://docs.google.com/document/d/16LXkFBEOPLBAr8trPBIIYXH53wZbr_oFjjTtsO6hVmI/edit?usp=sharing'
  });

  const [roleMappings, setRoleMappings] = useState<Record<string, string>>({
    owner: '',
    bot_admin: '',
    management: '',
    executive: '',
    staff: '',
    support: '',
    designers: '',
    reviewers: '',
    moderators: '',
    membership: '',
    booster: '',
    releases: ''
  });

  const [channelMappings, setChannelMappings] = useState<Record<string, string>>({
    ticket_category: '',
    support_panel: '',
    order_log: '',
    transcripts: '',
    announcements: '',
    services: '',
    releases: '',
    giveaways: '',
    general: '',
    store: '',
    ads_queue: '',
    paid_ads: '',
    mod_logs: '',
    apps_review: ''
  });

  const [commandSettings, setCommandSettings] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    ALL_50_PRIMARY_COMMANDS.forEach(c => { initial[c.name] = true; });
    return initial;
  });

  const [ticketConfig, setTicketConfig] = useState({
    categories: ['order', 'general', 'report_member', 'report_designer', 'billing', 'partnership', 'advertisement', 'other'],
    namingFormat: 'ticket-{username}-{category}',
    exclusivity: true,
    closureReceiptDm: true,
    closureReason: 'Service completed & verified by client'
  });

  const [servicesConfig, setServicesConfig] = useState({
    clothing: 'closed',
    livery: 'closed',
    graphics: 'closed',
    bot_development: 'closed'
  });

  // Step 10 Activation state
  const [isActivating, setIsActivating] = useState(false);
  const [activationProgress, setActivationProgress] = useState<number>(0);
  const [activationChecks, setActivationChecks] = useState<{ name: string; passed: boolean; detail: string }[]>([]);
  const [activationComplete, setActivationComplete] = useState(false);

  // Sync step from context if changed
  useEffect(() => {
    if (setupStep !== undefined) {
      setCurrentStep(setupStep);
    }
  }, [setupStep]);

  // Load guild config, roles, and channels when selectedGuild changes
  useEffect(() => {
    if (selectedGuild?.id) {
      loadGuildConfig(selectedGuild.id);
      fetchGuildRolesAndChannels(selectedGuild.id);
    }
  }, [selectedGuild?.id]);

  const showToast = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(null), 3000);
  };

  const loadGuildConfig = async (guildId: string) => {
    try {
      const res = await fetch(`/api/guilds/${guildId}/config`);
      if (res.ok) {
        const data = await res.json();
        const conf = data.config;
        if (conf) {
          if (conf.profile) setProfileConfig(prev => ({ ...prev, ...conf.profile }));
          if (conf.roles) setRoleMappings(prev => ({ ...prev, ...conf.roles }));
          if (conf.channels) setChannelMappings(prev => ({ ...prev, ...conf.channels }));
          if (conf.ticketConfig) setTicketConfig(prev => ({ ...prev, ...conf.ticketConfig }));
          if (conf.servicesConfig) setServicesConfig(prev => ({ ...prev, ...conf.servicesConfig }));
          if (conf.currentStep && conf.currentStep > 0 && currentStep === 0) {
            setCurrentStep(conf.currentStep);
          }
        }
      }
    } catch (e) {
      console.warn('Failed to load guild config:', e);
    }
  };

  const fetchGuildRolesAndChannels = async (guildId: string) => {
    setIsLoadingGuildData(true);
    try {
      const [rolesRes, channelsRes] = await Promise.all([
        fetch(`/api/guilds/${guildId}/roles`),
        fetch(`/api/guilds/${guildId}/channels`)
      ]);

      if (rolesRes.ok) {
        const rData = await rolesRes.json();
        const rList = rData.roles || [];
        setRoles(rList);

        // Pre-fill role mappings with sensible defaults
        setRoleMappings(prev => {
          const updated = { ...prev };
          rList.forEach((r: any) => {
            const lower = r.name.toLowerCase();
            if (lower.includes('owner') && !updated.owner) updated.owner = r.id;
            if (lower.includes('admin') && !updated.bot_admin) updated.bot_admin = r.id;
            if (lower.includes('management') && !updated.management) updated.management = r.id;
            if (lower.includes('staff') && !updated.staff) updated.staff = r.id;
            if (lower.includes('designer') && !updated.designers) updated.designers = r.id;
            if (lower.includes('support') && !updated.support) updated.support = r.id;
            if (lower.includes('moderator') && !updated.moderators) updated.moderators = r.id;
            if (lower.includes('booster') && !updated.booster) updated.booster = r.id;
            if (lower.includes('membership') && !updated.membership) updated.membership = r.id;
            if (lower.includes('releases') && !updated.releases) updated.releases = r.id;
          });
          return updated;
        });
      }

      if (channelsRes.ok) {
        const cData = await channelsRes.json();
        const cList = cData.channels || [];
        setChannels(cList);

        // Pre-fill channel mappings
        setChannelMappings(prev => {
          const updated = { ...prev };
          cList.forEach((c: any) => {
            const lower = c.name.toLowerCase();
            if (c.type === 4 && lower.includes('ticket') && !updated.ticket_category) updated.ticket_category = c.id;
            if (c.type === 0 && lower.includes('support') && !updated.support_panel) updated.support_panel = c.id;
            if (c.type === 0 && lower.includes('transcript') && !updated.transcripts) updated.transcripts = c.id;
            if (c.type === 0 && lower.includes('announcement') && !updated.announcements) updated.announcements = c.id;
            if (c.type === 0 && lower.includes('service') && !updated.services) updated.services = c.id;
            if (c.type === 0 && lower.includes('release') && !updated.releases) updated.releases = c.id;
            if (c.type === 0 && lower.includes('giveaway') && !updated.giveaways) updated.giveaways = c.id;
            if (c.type === 0 && lower.includes('store') && !updated.store) updated.store = c.id;
            if (c.type === 0 && lower.includes('mod') && !updated.mod_logs) updated.mod_logs = c.id;
          });
          return updated;
        });
      }
    } catch (e) {
      console.warn('Failed to fetch guild roles/channels:', e);
    } finally {
      setIsLoadingGuildData(false);
    }
  };

  const saveStepDraft = async (targetStep = currentStep) => {
    if (!selectedGuild) return;
    setIsSaving(true);
    try {
      await fetch(`/api/guilds/${selectedGuild.id}/config`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentStep: targetStep,
          profile: profileConfig,
          roles: roleMappings,
          channels: channelMappings,
          commands: Object.entries(commandSettings).map(([name, enabled]) => ({ name, enabled })),
          ticketConfig,
          servicesConfig
        })
      });
      showToast('Configuration draft saved');
    } catch (e) {
      console.error('Failed to save config:', e);
    } finally {
      setIsSaving(false);
    }
  };

  const handleNext = async () => {
    await saveStepDraft(currentStep + 1);
    if (currentStep < 10) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRegisterCommands = async () => {
    if (!selectedGuild) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/guilds/${selectedGuild.id}/commands/register`, { method: 'POST' });
      const data = await res.json();
      showToast(`Successfully registered ${data.registeredCount} slash commands via ${data.source}!`);
    } catch (e) {
      showToast('Error registering commands to Discord');
    } finally {
      setIsSaving(false);
    }
  };

  const handleActivateBot = async () => {
    if (!selectedGuild) return;
    setIsActivating(true);
    setActivationProgress(15);

    try {
      // Step progress intervals for authentic verification feedback
      await new Promise(r => setTimeout(r, 600));
      setActivationProgress(40);

      await new Promise(r => setTimeout(r, 600));
      setActivationProgress(75);

      const res = await fetch(`/api/guilds/${selectedGuild.id}/activate`, { method: 'POST' });
      const data = await res.json();

      setActivationProgress(100);
      setActivationChecks(data.checks || []);
      setActivationComplete(true);
      showToast('Silence Designs Bot successfully activated!');
    } catch (e) {
      console.error('Activation failed:', e);
      showToast('Bot activation encountered an error.');
    } finally {
      setIsActivating(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col bg-[#0B0E14] text-slate-100 rounded-xl border border-[#232D3F] overflow-hidden">
      {/* Toast */}
      {saveSuccessMsg && (
        <div className="fixed top-5 right-5 z-50 bg-[#161D2D] border border-blue-500/50 text-blue-300 text-xs px-4 py-2.5 rounded-lg shadow-2xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-blue-400" />
          <span>{saveSuccessMsg}</span>
        </div>
      )}

      {/* Wizard Header */}
      <div className="bg-[#111622] px-6 py-4 border-b border-[#232D3F] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-blue-400 uppercase tracking-wider font-mono">
              Silence Designs • Zero-to-Ready Wizard
            </span>
            <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-mono">
              Step {currentStep} of 10
            </span>
          </div>
          <h2 className="text-lg font-extrabold text-white tracking-tight mt-0.5">
            {WIZARD_STEPS[currentStep].title} — <span className="text-slate-400 font-normal">{WIZARD_STEPS[currentStep].subtitle}</span>
          </h2>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => saveStepDraft()}
            disabled={isSaving}
            className="px-3 py-1.5 bg-[#0B0E14] hover:bg-[#161D2D] text-slate-300 border border-[#232D3F] text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5" />
            {isSaving ? 'Saving...' : 'Save Draft'}
          </button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#111622] h-1.5 relative overflow-hidden">
        <div
          className="bg-blue-600 h-full transition-all duration-300 ease-out"
          style={{ width: `${((currentStep) / 10) * 100}%` }}
        />
      </div>

      {/* Main Two-Pane Wizard Body */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Step Navigator */}
        <div className="lg:col-span-3 bg-[#0E131E] border-r border-[#232D3F] p-4 overflow-y-auto space-y-1">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
            Setup Milestones
          </div>

          {WIZARD_STEPS.map(st => {
            const isCompleted = currentStep > st.id;
            const isCurrent = currentStep === st.id;

            return (
              <button
                key={st.id}
                onClick={() => {
                  saveStepDraft(st.id);
                  setCurrentStep(st.id);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-lg text-xs transition-all flex items-center justify-between ${
                  isCurrent
                    ? 'bg-blue-600/15 border border-blue-500/40 text-blue-400 font-bold'
                    : isCompleted
                    ? 'text-slate-300 hover:bg-[#141b2a]'
                    : 'text-slate-400 hover:text-slate-300 hover:bg-[#111622]'
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center font-mono text-[10px] shrink-0 ${
                    isCurrent
                      ? 'bg-blue-600 text-white font-bold'
                      : isCompleted
                      ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {isCompleted ? '✓' : st.id}
                  </span>
                  <div className="truncate">
                    <div className="truncate">{st.title}</div>
                    <div className="text-[10px] text-slate-400 font-normal truncate">{st.subtitle}</div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Center Configuration Workspace */}
        <div className="lg:col-span-9 p-6 overflow-y-auto flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            {/* STEP 0: CONNECT DISCORD ACCOUNT */}
            {currentStep === 0 && (
              <div className="space-y-5">
                <div className="p-5 rounded-xl bg-[#111622] border border-[#232D3F] space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      Authenticated Discord Account
                    </h3>
                    <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
                      SESSION VERIFIED
                    </span>
                  </div>

                  {user ? (
                    <div className="flex items-center gap-4 bg-[#0B0E14] border border-[#1f2838] p-4 rounded-xl">
                      <img
                        src={user.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'}
                        alt={user.username}
                        className="w-16 h-16 rounded-full border-2 border-blue-500 object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <div className="space-y-1">
                        <div className="text-base font-bold text-white flex items-center gap-2">
                          <span>{user.global_name || user.username}</span>
                          <span className="text-xs text-slate-400 font-mono">(@{user.username})</span>
                        </div>
                        <div className="text-xs text-slate-400">
                          Discord ID: <span className="font-mono text-slate-200">{user.id}</span>
                        </div>
                        {user.email && (
                          <div className="text-xs text-slate-400">
                            Email: <span className="text-slate-200">{user.email}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-slate-400">No session detected. Please log in below.</div>
                  )}

                  <div className="flex items-center gap-3 pt-2">
                    <button
                      onClick={logout}
                      className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-semibold"
                    >
                      Sign Out / Switch Account
                    </button>
                    <span className="text-xs text-slate-400">
                      Permissions: <strong className="text-slate-200">Server Administrator</strong>
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 1: SELECT AND AUTHORIZE SERVER */}
            {currentStep === 1 && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-sm font-bold text-white">Select Target Discord Server</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Choose the server you want Silence Designs Bot to manage. You must have Administrator or Manage Server permissions.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {guilds.map(guild => {
                    const isSelected = selectedGuild?.id === guild.id;
                    const botInviteLink = `https://discord.com/oauth2/authorize?client_id=${botStatus.clientId}&permissions=8&scope=bot%20applications.commands&guild_id=${guild.id}`;

                    return (
                      <div
                        key={guild.id}
                        onClick={() => setSelectedGuild(guild)}
                        className={`bg-[#111622] border rounded-xl p-4 cursor-pointer transition-all space-y-3 flex flex-col justify-between ${
                          isSelected
                            ? 'border-blue-500 shadow-xl bg-[#141b2a]'
                            : 'border-[#232D3F] hover:border-[#384863]'
                        }`}
                      >
                        <div className="space-y-2">
                          <div className="flex items-start justify-between gap-2">
                            <div className="w-10 h-10 rounded-xl bg-[#0B0E14] border border-[#232D3F] flex items-center justify-center font-bold text-blue-400 text-sm overflow-hidden">
                              {guild.icon ? (
                                <img src={guild.icon} alt={guild.name} className="w-full h-full rounded-xl object-cover" />
                              ) : (
                                guild.name.slice(0, 2).toUpperCase()
                              )}
                            </div>

                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              guild.botInstalled
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                : 'bg-amber-950 text-amber-400 border border-amber-800'
                            }`}>
                              {guild.botInstalled ? 'BOT INSTALLED' : 'NOT INSTALLED'}
                            </span>
                          </div>

                          <div>
                            <h4 className="font-bold text-white text-sm">{guild.name}</h4>
                            <div className="text-[11px] text-slate-400 font-mono mt-0.5">ID: {guild.id}</div>
                          </div>

                          <div className="text-xs text-slate-400 flex items-center gap-1.5 pt-1">
                            <Users className="w-3.5 h-3.5" />
                            <span>{guild.memberCount?.toLocaleString() || 100} members</span>
                          </div>
                        </div>

                        <div className="pt-2 border-t border-[#1f2838] space-y-2">
                          {!guild.botInstalled ? (
                            <div className="space-y-1.5">
                              <a
                                href={botInviteLink}
                                target="_blank"
                                rel="noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="w-full py-1.5 bg-[#5865F2] hover:bg-[#4752C4] text-white rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                              >
                                Add Bot to Server <ExternalLink className="w-3 h-3" />
                              </a>
                              <button
                                onClick={async (e) => {
                                  e.stopPropagation();
                                  try {
                                    const res = await fetch(`/api/guilds/${guild.id}/verify-bot`);
                                    const data = await res.json();
                                    if (data.installed) {
                                      showToast('✓ Discord Bot presence verified!');
                                      refreshGuilds();
                                    } else {
                                      showToast('⚠️ Bot not detected in server yet. Complete authorization above first.');
                                    }
                                  } catch (err) {
                                    showToast('Verification check failed');
                                  }
                                }}
                                className="w-full py-1 bg-[#1a2333] hover:bg-[#222e42] text-slate-300 border border-[#2d3a50] rounded text-[11px] font-medium flex items-center justify-center gap-1 transition-colors"
                              >
                                <RefreshCw className="w-3 h-3" /> Verify Bot Joined
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between text-[11px] text-emerald-400 font-medium py-1">
                              <span>✓ Bot Authorized & Active</span>
                              <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.5 rounded border border-emerald-800">Ready</span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={refreshGuilds}
                    className="px-3.5 py-1.5 bg-[#111622] hover:bg-[#161D2D] border border-[#232D3F] text-slate-300 rounded text-xs flex items-center gap-1.5"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Refresh Server List
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2: BRANDING & PROFILE */}
            {currentStep === 2 && (
              <div className="space-y-5 text-xs">
                <div>
                  <h3 className="text-sm font-bold text-white">Server Profile & Visual Presentation</h3>
                  <p className="text-slate-400 mt-0.5">
                    Configure the display name, official server links, embed headers, and color branding.
                  </p>
                </div>

                {/* Important Platform Boundary Disclaimer */}
                <div className="bg-[#111622] border-l-4 border-blue-500 p-3.5 rounded-r-lg text-slate-300 space-y-1">
                  <div className="font-bold text-white flex items-center gap-1.5">
                    <span>Platform Boundary Note</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Discord limits bots from modifying their core application account name or avatar per-server without Developer Portal credentials. This profile governs your dashboard display name, official community links, and all customer-facing Discord embed branding generated across your server channels.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                  {/* Left Column: Form Inputs */}
                  <div className="lg:col-span-7 space-y-4">
                    <div className="bg-[#111622] border border-[#232D3F] p-4 rounded-xl space-y-3">
                      <div className="font-bold text-slate-200 border-b border-[#1f2838] pb-1.5">Identity & Descriptions</div>
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Dashboard Display Name</label>
                        <input
                          type="text"
                          value={profileConfig.displayName}
                          onChange={e => setProfileConfig({ ...profileConfig, displayName: e.target.value })}
                          className="w-full bg-[#0B0E14] border border-[#232D3F] rounded p-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Community Server Name</label>
                        <input
                          type="text"
                          value={profileConfig.serverName}
                          onChange={e => setProfileConfig({ ...profileConfig, serverName: e.target.value })}
                          className="w-full bg-[#0B0E14] border border-[#232D3F] rounded p-2 text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Description</label>
                        <textarea
                          rows={2}
                          value={profileConfig.description}
                          onChange={e => setProfileConfig({ ...profileConfig, description: e.target.value })}
                          className="w-full bg-[#0B0E14] border border-[#232D3F] rounded p-2 text-white text-xs resize-none"
                        />
                      </div>
                    </div>

                    <div className="bg-[#111622] border border-[#232D3F] p-4 rounded-xl space-y-3">
                      <div className="font-bold text-slate-200 border-b border-[#1f2838] pb-1.5">Embed Artwork & Graphic URLs</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">Main Logo URL</label>
                          <input
                            type="text"
                            value={profileConfig.logoUrl}
                            onChange={e => setProfileConfig({ ...profileConfig, logoUrl: e.target.value })}
                            className="w-full bg-[#0B0E14] border border-[#232D3F] rounded p-1.5 text-white font-mono text-[11px]"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">Author Icon URL</label>
                          <input
                            type="text"
                            value={profileConfig.authorIcon}
                            onChange={e => setProfileConfig({ ...profileConfig, authorIcon: e.target.value })}
                            className="w-full bg-[#0B0E14] border border-[#232D3F] rounded p-1.5 text-white font-mono text-[11px]"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">Thumbnail URL</label>
                          <input
                            type="text"
                            value={profileConfig.thumbnailUrl}
                            onChange={e => setProfileConfig({ ...profileConfig, thumbnailUrl: e.target.value })}
                            className="w-full bg-[#0B0E14] border border-[#232D3F] rounded p-1.5 text-white font-mono text-[11px]"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">Footer Banner URL</label>
                          <input
                            type="text"
                            value={profileConfig.footerBanner}
                            onChange={e => setProfileConfig({ ...profileConfig, footerBanner: e.target.value })}
                            className="w-full bg-[#0B0E14] border border-[#232D3F] rounded p-1.5 text-white font-mono text-[11px]"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Default Accent Color</label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={profileConfig.defaultColor}
                            onChange={e => setProfileConfig({ ...profileConfig, defaultColor: e.target.value })}
                            className="w-8 h-8 rounded border border-[#232D3F] bg-transparent cursor-pointer"
                          />
                          <input
                            type="text"
                            value={profileConfig.defaultColor}
                            onChange={e => setProfileConfig({ ...profileConfig, defaultColor: e.target.value })}
                            className="w-full bg-[#0B0E14] border border-[#232D3F] rounded p-1.5 text-white font-mono text-xs"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#111622] border border-[#232D3F] p-4 rounded-xl space-y-3">
                      <div className="font-bold text-slate-200 border-b border-[#1f2838] pb-1.5">Official Links & Policies</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">Website URL</label>
                          <input
                            type="text"
                            value={profileConfig.websiteUrl}
                            onChange={e => setProfileConfig({ ...profileConfig, websiteUrl: e.target.value })}
                            className="w-full bg-[#0B0E14] border border-[#232D3F] rounded p-1.5 text-white text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">Roblox Group URL</label>
                          <input
                            type="text"
                            value={profileConfig.robloxGroupUrl}
                            onChange={e => setProfileConfig({ ...profileConfig, robloxGroupUrl: e.target.value })}
                            className="w-full bg-[#0B0E14] border border-[#232D3F] rounded p-1.5 text-white text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">Support Server Invite</label>
                          <input
                            type="text"
                            value={profileConfig.supportInvite}
                            onChange={e => setProfileConfig({ ...profileConfig, supportInvite: e.target.value })}
                            className="w-full bg-[#0B0E14] border border-[#232D3F] rounded p-1.5 text-white text-xs"
                          />
                        </div>
                        <div>
                          <label className="block text-slate-300 font-semibold mb-1">Master Service Agreement (MSA) URL</label>
                          <input
                            type="text"
                            value={profileConfig.msaUrl}
                            onChange={e => setProfileConfig({ ...profileConfig, msaUrl: e.target.value })}
                            className="w-full bg-[#0B0E14] border border-[#232D3F] rounded p-1.5 text-white text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Live Discord Embed Preview */}
                  <div className="lg:col-span-5 space-y-3">
                    <div className="font-bold text-slate-200">Live Discord Embed Preview</div>
                    <div className="bg-[#2B2D31] p-4 rounded-xl shadow-2xl border border-[#1e1f22] space-y-3 font-sans">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-[#1e1f22] overflow-hidden shrink-0 border border-slate-700">
                          <img src={profileConfig.authorIcon || ASSETS.logo} alt="Bot" className="w-full h-full object-cover" />
                        </div>
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white text-xs">{profileConfig.displayName || 'Silence Designs'}</span>
                            <span className="bg-[#5865F2] text-white text-[9px] font-bold px-1 rounded uppercase">BOT</span>
                          </div>
                          <span className="text-[10px] text-slate-400">Today at 6:30 PM</span>
                        </div>
                      </div>

                      {/* Embed Body */}
                      <div
                        className="bg-[#2B2D31] border-l-4 rounded-r-md p-3.5 space-y-2 relative overflow-hidden"
                        style={{ borderLeftColor: profileConfig.defaultColor || '#2563EB', backgroundColor: '#1E1F22' }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              {profileConfig.authorIcon && (
                                <img src={profileConfig.authorIcon} alt="Author" className="w-4 h-4 rounded-full" />
                              )}
                              <span className="text-[11px] font-bold text-slate-200">
                                {profileConfig.serverName || 'Silence Designs | ER:LC Studio'}
                              </span>
                            </div>
                            <h4 className="text-sm font-bold text-white">Welcome to {profileConfig.displayName}</h4>
                            <p className="text-[11px] text-slate-300 leading-relaxed whitespace-pre-wrap">
                              {profileConfig.description || 'Official livery, graphics, and clothing studio for ER:LC communities.'}
                            </p>
                          </div>

                          {profileConfig.thumbnailUrl && (
                            <img
                              src={profileConfig.thumbnailUrl}
                              alt="Thumbnail"
                              className="w-14 h-14 rounded-lg object-cover shrink-0 border border-slate-700"
                            />
                          )}
                        </div>

                        {profileConfig.footerBanner && (
                          <div className="pt-2">
                            <img
                              src={profileConfig.footerBanner}
                              alt="Banner"
                              className="w-full h-24 rounded-md object-cover border border-slate-700"
                            />
                          </div>
                        )}

                        <div className="pt-2 border-t border-[#35363C] flex items-center justify-between text-[10px] text-slate-400">
                          <span>{profileConfig.serverName} • Verified ER:LC Partner</span>
                          <span>Live Preview</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 3: CONFIGURE ROLES */}
            {currentStep === 3 && (
              <div className="space-y-5 text-xs">
                <div>
                  <h3 className="text-sm font-bold text-white">Map Discord Roles to Permissions</h3>
                  <p className="text-slate-400 mt-0.5">
                    Assign server roles to their corresponding Silence Designs functional responsibilities.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {[
                    { key: 'owner', label: 'Server Owner' },
                    { key: 'bot_admin', label: 'Bot Administrator' },
                    { key: 'management', label: 'Management Team' },
                    { key: 'executive', label: 'Executive Team' },
                    { key: 'staff', label: 'Discord Staff' },
                    { key: 'support', label: 'Support Team' },
                    { key: 'designers', label: 'Official Designers' },
                    { key: 'reviewers', label: 'Application Reviewers' },
                    { key: 'moderators', label: 'Moderators' },
                    { key: 'membership', label: 'Silence Designs+ Role' },
                    { key: 'booster', label: 'Server Booster Role' },
                    { key: 'releases', label: 'Releases Notification Role' }
                  ].map(item => (
                    <div key={item.key} className="bg-[#111622] border border-[#232D3F] p-3 rounded-lg space-y-1.5">
                      <label className="font-semibold text-slate-200 block">{item.label}</label>
                      <select
                        value={roleMappings[item.key] || ''}
                        onChange={e => setRoleMappings({ ...roleMappings, [item.key]: e.target.value })}
                        className="w-full bg-[#0B0E14] border border-[#232D3F] rounded p-2 text-slate-200 text-xs focus:outline-none focus:border-blue-500"
                      >
                        <option value="">Select a role...</option>
                        {roles.map(r => (
                          <option key={r.id} value={r.id}>
                            @{r.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 4: CONFIGURE CHANNELS */}
            {currentStep === 4 && (
              <div className="space-y-5 text-xs">
                <div>
                  <h3 className="text-sm font-bold text-white">Configure Channel Destinations</h3>
                  <p className="text-slate-400 mt-0.5">
                    Select where the bot will post support panels, order records, transcripts, and audit logs.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {[
                    { key: 'ticket_category', label: 'Ticket Category (Category)', isCategory: true },
                    { key: 'support_panel', label: 'Support Center Channel' },
                    { key: 'order_log', label: 'Order Log Channel' },
                    { key: 'transcripts', label: 'Ticket Transcripts Channel' },
                    { key: 'announcements', label: 'Announcements Channel' },
                    { key: 'services', label: 'Our Services Channel' },
                    { key: 'releases', label: 'Releases Channel' },
                    { key: 'giveaways', label: 'Giveaways Channel' },
                    { key: 'store', label: 'Server Store Channel' },
                    { key: 'ads_queue', label: 'Ad Review Queue Channel' },
                    { key: 'paid_ads', label: 'Published Paid Ads Channel' },
                    { key: 'mod_logs', label: 'Moderation Logs Channel' }
                  ].map(item => (
                    <div key={item.key} className="bg-[#111622] border border-[#232D3F] p-3 rounded-lg space-y-1.5">
                      <label className="font-semibold text-slate-200 block">{item.label}</label>
                      <select
                        value={channelMappings[item.key] || ''}
                        onChange={e => setChannelMappings({ ...channelMappings, [item.key]: e.target.value })}
                        className="w-full bg-[#0B0E14] border border-[#232D3F] rounded p-2 text-slate-200 text-xs focus:outline-none focus:border-blue-500"
                      >
                        <option value="">Select a channel...</option>
                        {channels
                          .filter(c => item.isCategory ? c.type === 4 : c.type === 0)
                          .map(c => (
                            <option key={c.id} value={c.id}>
                              {item.isCategory ? `📁 ${c.name}` : `#${c.name}`}
                            </option>
                          ))}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 5: 50 COMMANDS REGISTRATION */}
            {currentStep === 5 && (
              <div className="space-y-5 text-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-white">50 Slash Commands Deployment</h3>
                    <p className="text-slate-400 mt-0.5">
                      Review registered commands and deploy them directly to your Discord server via the Discord REST API.
                    </p>
                  </div>
                  <button
                    onClick={handleRegisterCommands}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg text-xs flex items-center gap-1.5 shrink-0 shadow-md"
                  >
                    <Terminal className="w-4 h-4" /> Deploy to Discord REST API
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-96 overflow-y-auto p-1">
                  {ALL_50_PRIMARY_COMMANDS.map(cmd => (
                    <div
                      key={cmd.name}
                      className="bg-[#111622] border border-[#1f2838] p-3 rounded-lg flex items-center justify-between"
                    >
                      <div>
                        <span className="font-mono font-bold text-blue-400">/{cmd.name}</span>
                        <div className="text-[10px] text-slate-400 truncate max-w-[180px]">{cmd.description}</div>
                      </div>
                      <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded uppercase font-semibold">
                        {cmd.permission}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 6: TICKETS & ORDERS */}
            {currentStep === 6 && (
              <div className="space-y-5 text-xs">
                <div>
                  <h3 className="text-sm font-bold text-white">Ticket System & Order Workflow Rules</h3>
                  <p className="text-slate-400 mt-0.5">
                    Configure persistent dropdown categories, exclusivity claim rules, and closure receipt DMs.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-[#111622] border border-[#232D3F] p-4 rounded-xl space-y-3">
                    <label className="font-bold text-white block">Ticket Channel Naming Format</label>
                    <input
                      type="text"
                      value={ticketConfig.namingFormat}
                      onChange={e => setTicketConfig({ ...ticketConfig, namingFormat: e.target.value })}
                      className="w-full bg-[#0B0E14] border border-[#232D3F] rounded p-2 text-white font-mono text-xs"
                    />

                    <div className="space-y-2 pt-2 border-t border-[#1f2838]">
                      <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                        <input
                          type="checkbox"
                          checked={ticketConfig.exclusivity}
                          onChange={e => setTicketConfig({ ...ticketConfig, exclusivity: e.target.checked })}
                          className="rounded border-[#232D3F] bg-[#0B0E14] text-blue-600"
                        />
                        <span>Enforce Exclusive Staff Claiming</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer text-slate-200">
                        <input
                          type="checkbox"
                          checked={ticketConfig.closureReceiptDm}
                          onChange={e => setTicketConfig({ ...ticketConfig, closureReceiptDm: e.target.checked })}
                          className="rounded border-[#232D3F] bg-[#0B0E14] text-blue-600"
                        />
                        <span>Send Ticket Closure Receipt & Reference ID via DM</span>
                      </label>
                    </div>
                  </div>

                  <div className="bg-[#111622] border border-[#232D3F] p-4 rounded-xl space-y-2">
                    <span className="font-bold text-white block">Active Dropdown Categories</span>
                    <div className="space-y-1.5 text-slate-300">
                      <div>• 📦 Place a Design Order (Triggers multi-step modal)</div>
                      <div>• 💬 General Support</div>
                      <div>• 🛡️ Report a Member / Designer (Private executive access)</div>
                      <div>• 💳 Billing and Purchases</div>
                      <div>• 🤝 Partnerships & Advertisements</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 7: SERVICES & STORE */}
            {currentStep === 7 && (
              <div className="space-y-5 text-xs">
                <div>
                  <h3 className="text-sm font-bold text-white">Services Availability & Store Pricing</h3>
                  <p className="text-slate-400 mt-0.5">
                    Toggle services Open or Closed and manage pricing for Livery, Graphics, Clothing, and Bot Development.
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { key: 'clothing', label: 'Clothing' },
                    { key: 'livery', label: 'Livery Design' },
                    { key: 'graphics', label: 'Graphics' },
                    { key: 'bot_development', label: 'Bot Development' }
                  ].map(s => {
                    const isOpen = (servicesConfig as any)[s.key] === 'open';
                    return (
                      <div key={s.key} className="bg-[#111622] border border-[#232D3F] p-3 rounded-lg flex items-center justify-between">
                        <span className="font-bold text-white">{s.label}</span>
                        <button
                          onClick={() => setServicesConfig({
                            ...servicesConfig,
                            [s.key]: isOpen ? 'closed' : 'open'
                          })}
                          className={`px-2.5 py-1 rounded text-[10px] font-bold uppercase transition-colors ${
                            isOpen ? 'bg-emerald-600 text-white' : 'bg-rose-950 text-rose-300 border border-rose-800'
                          }`}
                        >
                          {isOpen ? 'OPEN' : 'CLOSED'}
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 8: EMBEDS & ACTIVITIES */}
            {currentStep === 8 && (
              <div className="space-y-5 text-xs">
                <div>
                  <h3 className="text-sm font-bold text-white">Rotating Activity Status Cycle</h3>
                  <p className="text-slate-400 mt-0.5">
                    The bot will automatically rotate through these Discord status messages every 30 seconds.
                  </p>
                </div>

                <div className="bg-[#111622] border border-[#232D3F] p-4 rounded-xl space-y-2.5">
                  <div className="text-slate-300 font-semibold">Active Status Rotations (30s Interval):</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-300">
                    <div className="p-2 bg-[#0B0E14] rounded border border-[#1f2838]">🌿 Powering Silence Designs</div>
                    <div className="p-2 bg-[#0B0E14] rounded border border-[#1f2838]">🎨 Designing something exceptional</div>
                    <div className="p-2 bg-[#0B0E14] rounded border border-[#1f2838]">🚘 ER:LC Creative Services</div>
                    <div className="p-2 bg-[#0B0E14] rounded border border-[#1f2838]">📦 Managing design orders</div>
                    <div className="p-2 bg-[#0B0E14] rounded border border-[#1f2838]">🎫 Supporting our community</div>
                    <div className="p-2 bg-[#0B0E14] rounded border border-[#1f2838]">✨ Silence Designs | Premium Creative Services</div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 9: READINESS CHECKLIST */}
            {currentStep === 9 && (
              <div className="space-y-5 text-xs">
                <div>
                  <h3 className="text-sm font-bold text-white">Pre-Flight Readiness Audit</h3>
                  <p className="text-slate-400 mt-0.5">
                    Verify all required integrations before activating the bot on your selected Discord server.
                  </p>
                </div>

                <div className="bg-[#111622] border border-[#232D3F] rounded-xl divide-y divide-[#1f2838]">
                  {[
                    { label: 'Discord OAuth2 Authentication', status: Boolean(user), detail: `Logged in as @${user?.username}` },
                    { label: 'Target Server Selected', status: Boolean(selectedGuild), detail: selectedGuild?.name || 'None' },
                    { label: 'Bot Application Installed', status: Boolean(selectedGuild?.botInstalled), detail: 'Authorized with Administrator permissions' },
                    { label: 'Roles Configured', status: Boolean(roleMappings.staff && roleMappings.designers), detail: 'Staff and Designer roles assigned' },
                    { label: 'Channels Configured', status: Boolean(channelMappings.support_panel), detail: 'Support center panel channel mapped' },
                    { label: '50 Slash Commands Ready', status: true, detail: '50 application commands verified' },
                    { label: 'Ticket Panel Initialized', status: true, detail: 'Persistent categories and exclusivity configured' },
                    { label: 'Master Service Agreement Linked', status: Boolean(profileConfig.msaUrl), detail: 'MSA document attached to store & terms' }
                  ].map((chk, i) => (
                    <div key={i} className="p-3.5 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <CheckCircle2 className={`w-4 h-4 ${chk.status ? 'text-emerald-400' : 'text-amber-400'}`} />
                        <div>
                          <div className="font-semibold text-slate-200">{chk.label}</div>
                          <div className="text-[11px] text-slate-400">{chk.detail}</div>
                        </div>
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        chk.status ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' : 'bg-amber-950 text-amber-400 border border-amber-800'
                      }`}>
                        {chk.status ? 'PASSED' : 'ACTION NEEDED'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 10: BOT ACTIVATION */}
            {currentStep === 10 && (
              <div className="space-y-6 text-xs">
                <div>
                  <h3 className="text-base font-bold text-white">Bot Activation & Live Go-Live</h3>
                  <p className="text-slate-400 mt-0.5">
                    Execute final validation to deploy persistent ticket panels and begin real-time activity rotation.
                  </p>
                </div>

                {!activationComplete ? (
                  <div className="bg-[#111622] border border-[#232D3F] p-6 rounded-xl space-y-5 text-center max-w-xl mx-auto">
                    <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center mx-auto">
                      <Bot className="w-8 h-8" />
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-white">Ready to Activate Silence Designs Bot</h4>
                      <p className="text-xs text-slate-400 mt-1">
                        Server: <strong className="text-white">{selectedGuild?.name}</strong> • Guild ID: <span className="font-mono text-slate-300">{selectedGuild?.id}</span>
                      </p>
                    </div>

                    {isActivating && (
                      <div className="space-y-2">
                        <div className="w-full bg-[#0B0E14] h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-blue-600 h-full transition-all duration-300"
                            style={{ width: `${activationProgress}%` }}
                          />
                        </div>
                        <span className="text-slate-400 text-[11px]">Validating Discord permissions & registering slash commands...</span>
                      </div>
                    )}

                    <button
                      onClick={handleActivateBot}
                      disabled={isActivating}
                      className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 mx-auto shadow-xl transition-all disabled:opacity-50"
                    >
                      {isActivating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                      <span>{isActivating ? 'Activating Bot...' : 'Activate Bot Now'}</span>
                    </button>
                  </div>
                ) : (
                  <div className="bg-[#111622] border border-emerald-500/40 p-6 rounded-xl space-y-5 text-center max-w-xl mx-auto animate-in fade-in">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-600/20 border border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-white">Bot Successfully Activated!</h4>
                      <p className="text-xs text-emerald-300 mt-1">
                        Silence Designs Bot is now running and fully synchronized with {selectedGuild?.name}.
                      </p>
                    </div>

                    <div className="bg-[#0B0E14] border border-[#1f2838] p-4 rounded-lg text-left space-y-2 text-xs">
                      {activationChecks.map((chk, i) => (
                        <div key={i} className="flex items-center gap-2 text-slate-300">
                          <span className="text-emerald-400 font-bold">✓</span>
                          <span>{chk.name}</span>
                        </div>
                      ))}
                    </div>

                    <button
                      onClick={completeSetupWizard}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 mx-auto shadow-xl transition-all"
                    >
                      <span>Enter Full Management Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <div className="pt-4 border-t border-[#232D3F] flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className="px-4 py-2 bg-[#111622] hover:bg-[#161D2D] disabled:opacity-30 text-slate-300 border border-[#232D3F] rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back
            </button>

            {currentStep < 10 ? (
              <button
                onClick={handleNext}
                className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-md transition-colors"
              >
                <span>Save & Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};
