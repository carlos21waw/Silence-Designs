import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { ALL_50_PRIMARY_COMMANDS, BotCommandDef } from '../../data/initialData';
import {
  Terminal,
  Search,
  Filter,
  Play,
  Shield,
  Layers,
  Sparkles,
  Ticket,
  ShoppingBag,
  Info,
  CheckCircle2,
  RefreshCw,
  Power,
  ExternalLink,
  Sliders,
  AlertCircle
} from 'lucide-react';

interface CommandsViewProps {
  onTestCommand: (cmdName: string) => void;
}

export const CommandsView: React.FC<CommandsViewProps> = ({ onTestCommand }) => {
  const { selectedGuild } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Real Guild Commands State from Backend
  const [commandStates, setCommandStates] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    ALL_50_PRIMARY_COMMANDS.forEach(cmd => {
      initial[cmd.name] = true;
    });
    return initial;
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployResult, setDeployResult] = useState<{ success: boolean; message: string } | null>(null);

  // Load real guild commands config from backend on mount or when selectedGuild changes
  useEffect(() => {
    if (selectedGuild?.id) {
      loadGuildCommandConfig(selectedGuild.id);
    }
  }, [selectedGuild?.id]);

  const loadGuildCommandConfig = async (guildId: string) => {
    try {
      const res = await fetch(`/api/guilds/${guildId}/config`);
      if (res.ok) {
        const data = await res.json();
        if (data.config?.commands && Array.isArray(data.config.commands)) {
          const map: Record<string, boolean> = {};
          data.config.commands.forEach((c: { name: string; enabled: boolean }) => {
            map[c.name] = c.enabled ?? true;
          });
          setCommandStates(prev => ({ ...prev, ...map }));
        }
      }
    } catch (err) {
      console.warn('Failed to load guild commands from backend:', err);
    }
  };

  const toggleCommand = async (commandName: string) => {
    const newState = !commandStates[commandName];
    const updatedStates = { ...commandStates, [commandName]: newState };
    setCommandStates(updatedStates);

    if (selectedGuild?.id) {
      setIsSaving(true);
      try {
        await fetch(`/api/guilds/${selectedGuild.id}/config`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            commands: Object.entries(updatedStates).map(([name, enabled]) => ({ name, enabled }))
          })
        });
      } catch (err) {
        console.error('Failed to save command toggle state:', err);
      } finally {
        setIsSaving(false);
      }
    }
  };

  const handleDeployToDiscord = async () => {
    if (!selectedGuild?.id) {
      setDeployResult({ success: false, message: 'Please select a Discord server first.' });
      return;
    }

    setIsDeploying(true);
    setDeployResult(null);

    try {
      const res = await fetch(`/api/guilds/${selectedGuild.id}/commands/register`, {
        method: 'POST'
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setDeployResult({
          success: true,
          message: `Successfully synchronized ${data.registeredCount} application commands via ${data.source === 'discord_rest_api' ? 'Discord REST API' : 'local application registry'}.`
        });
      } else {
        setDeployResult({
          success: false,
          message: data.error || data.message || 'Failed to deploy commands to Discord.'
        });
      }
    } catch (err: any) {
      setDeployResult({ success: false, message: 'Network error calling Discord registration endpoint.' });
    } finally {
      setIsDeploying(false);
    }
  };

  const categories = [
    { key: 'all', label: 'All Commands (64)' },
    { key: 'orders', label: 'Orders (1-9)' },
    { key: 'creative', label: 'Creative AI (10-15)' },
    { key: 'tickets', label: 'Tickets (16-23)' },
    { key: 'applications', label: 'Applications (24-28)' },
    { key: 'community', label: 'Community (29-34)' },
    { key: 'moderation', label: 'Moderation (35-44)' },
    { key: 'utility', label: 'Utilities (45-50)' },
    { key: 'extra', label: 'Subcommands & Extra' }
  ];

  const filteredCommands = ALL_50_PRIMARY_COMMANDS.filter(cmd => {
    const matchesCat = selectedCategory === 'all' || cmd.category === selectedCategory;
    const matchesQuery =
      cmd.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cmd.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cmd.usage.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cmd.permission.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  const enabledCount = Object.values(commandStates).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Center */}
      <div className="bg-[#111622] border border-[#232D3F] p-5 rounded-xl space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <Terminal className="w-5 h-5 text-blue-400" />
                Discord Application Commands Registry
              </h2>
              <span className="text-[10px] bg-blue-950 text-blue-300 border border-blue-800 px-2 py-0.5 rounded font-mono font-semibold">
                50 Primary + Subcommands
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Target Guild: <strong className="text-slate-200">{selectedGuild?.name || 'Silence Designs'}</strong> ({selectedGuild?.id || 'Global'}) • Toggle commands or synchronize directly with Discord.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleDeployToDiscord}
              disabled={isDeploying}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-lg text-xs flex items-center gap-2 shadow-md transition-all"
            >
              {isDeploying ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Terminal className="w-4 h-4" />}
              <span>{isDeploying ? 'Deploying to Discord...' : 'Deploy to Discord REST API'}</span>
            </button>
          </div>
        </div>

        {/* Deploy Feedback Message */}
        {deployResult && (
          <div className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
            deployResult.success
              ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
              : 'bg-amber-950/60 border-amber-800 text-amber-300'
          }`}>
            <div className="flex items-center gap-2">
              {deployResult.success ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
              <span>{deployResult.message}</span>
            </div>
            <button onClick={() => setDeployResult(null)} className="text-slate-400 hover:text-white">✕</button>
          </div>
        )}

        {/* Metrics & Search Bar */}
        <div className="pt-3 border-t border-[#1f2838] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-4 text-xs text-slate-300">
            <div>
              Total Commands: <strong className="text-white font-mono">{ALL_50_PRIMARY_COMMANDS.length}</strong>
            </div>
            <div>
              Active / Enabled: <strong className="text-emerald-400 font-mono">{enabledCount}</strong>
            </div>
            {isSaving && <span className="text-[11px] text-blue-400 animate-pulse">Saving changes...</span>}
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Filter by name, permission, keyword..."
              className="bg-[#0B0E14] border border-[#232D3F] text-slate-200 text-xs pl-8 pr-3 py-1.5 rounded-lg focus:outline-none focus:border-blue-500 w-full sm:w-64"
            />
          </div>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap gap-1 bg-[#111622] border border-[#232D3F] p-1.5 rounded-xl text-xs">
        {categories.map(cat => (
          <button
            key={cat.key}
            onClick={() => setSelectedCategory(cat.key)}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors ${
              selectedCategory === cat.key
                ? 'bg-blue-600 text-white font-semibold'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Commands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {filteredCommands.map(cmd => {
          const isEnabled = commandStates[cmd.name] ?? true;

          return (
            <div
              key={cmd.name}
              className={`bg-[#111622] border rounded-xl p-4 flex flex-col justify-between space-y-3 transition-all ${
                isEnabled ? 'border-[#232D3F] hover:border-[#33425a]' : 'border-rose-950/40 opacity-60 bg-[#0d111a]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-blue-400 text-sm">/{cmd.name}</span>
                    {!isEnabled && (
                      <span className="px-1.5 py-0.2 text-[9px] bg-rose-950 text-rose-300 border border-rose-800 rounded uppercase font-bold">
                        DISABLED
                      </span>
                    )}
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                    cmd.permission === 'Admin' ? 'bg-rose-950 text-rose-400 border border-rose-800' :
                    cmd.permission === 'Management' ? 'bg-amber-950 text-amber-400 border border-amber-800' :
                    cmd.permission === 'Staff' ? 'bg-blue-950 text-blue-400 border border-blue-800' :
                    'bg-slate-800 text-slate-300'
                  }`}>
                    {cmd.permission}
                  </span>
                </div>

                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {cmd.description}
                </p>
              </div>

              <div className="pt-2.5 border-t border-[#1f2838] flex items-center justify-between text-xs">
                <span className="font-mono text-[11px] text-slate-400 truncate max-w-[150px]">
                  {cmd.usage}
                </span>

                <div className="flex items-center gap-2">
                  {/* Enabled Toggle Switch */}
                  <button
                    onClick={() => toggleCommand(cmd.name)}
                    title={isEnabled ? 'Click to disable' : 'Click to enable'}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center gap-1 transition-colors ${
                      isEnabled
                        ? 'bg-emerald-950 text-emerald-400 border border-emerald-800 hover:bg-emerald-900'
                        : 'bg-slate-800 text-slate-400 border border-slate-700 hover:bg-slate-700'
                    }`}
                  >
                    <Power className="w-2.5 h-2.5" />
                    {isEnabled ? 'ON' : 'OFF'}
                  </button>

                  <button
                    onClick={() => onTestCommand(cmd.name)}
                    className="px-2.5 py-1 bg-[#0B0E14] hover:bg-blue-600 hover:text-white text-blue-400 border border-[#232D3F] rounded text-[11px] font-medium flex items-center gap-1 transition-colors shrink-0"
                  >
                    <Play className="w-3 h-3" /> Test
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
