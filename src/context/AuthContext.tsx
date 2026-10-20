import React, { createContext, useContext, useState, useEffect } from 'react';

export interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  global_name: string;
  avatar: string | null;
  email?: string;
}

export interface DiscordGuild {
  id: string;
  name: string;
  icon: string | null;
  owner: boolean;
  permissions: string;
  canManage: boolean;
  botInstalled: boolean;
  setupCompleted?: boolean;
  memberCount?: number;
}

interface AuthContextType {
  user: DiscordUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  selectedGuild: DiscordGuild | null;
  guilds: DiscordGuild[];
  isSetupMode: boolean;
  setupStep: number;
  botStatus: {
    online: boolean;
    status: string;
    clientId: string;
    uptimeSeconds: number;
    apiLatencyMs: number;
    activeServers: number;
    currentActivity: string;
    botTokenConfigured: boolean;
  };
  loginWithDiscord: () => Promise<void>;
  demoLogin: () => void;
  logout: () => Promise<void>;
  setSelectedGuild: (guild: DiscordGuild | null) => void;
  setSetupStep: (step: number) => void;
  startSetupWizard: (guild?: DiscordGuild) => void;
  completeSetupWizard: () => void;
  refreshGuilds: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<DiscordUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [guilds, setGuilds] = useState<DiscordGuild[]>([]);
  const [selectedGuild, setSelectedGuildState] = useState<DiscordGuild | null>(null);
  const [isSetupMode, setIsSetupMode] = useState(false);
  const [setupStep, setSetupStep] = useState(0);

  const [botStatus, setBotStatus] = useState({
    online: true,
    status: 'ONLINE',
    clientId: '1025813762684502168',
    uptimeSeconds: 154200,
    apiLatencyMs: 23,
    activeServers: 3,
    currentActivity: '🌿 Powering Silence Designs',
    botTokenConfigured: true
  });

  // Check auth on mount
  useEffect(() => {
    checkAuthSession();
    fetchBotStatus();
  }, []);

  const checkAuthSession = async () => {
    try {
      setIsLoading(true);

      // Check for OAuth2 callback query parameter (?code=...)
      const searchParams = new URLSearchParams(window.location.search);
      const authCode = searchParams.get('code');
      if (authCode) {
        try {
          const redirectUri = `${window.location.origin}/auth/callback`;
          const exchangeRes = await fetch('/api/auth/discord/callback', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ code: authCode, redirectUri })
          });

          if (exchangeRes.ok) {
            const data = await exchangeRes.json();
            if (data.user) {
              setUser(data.user);
              // Clean code from query URL without page reload
              const cleanPath = window.location.pathname.replace('/auth/callback', '') || '/';
              window.history.replaceState({}, document.title, cleanPath);
              await loadGuilds();
              return;
            }
          }
        } catch (exchangeErr) {
          console.error('OAuth token exchange failed:', exchangeErr);
        }
      }

      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = await res.json();
        if (data.authenticated && data.user) {
          setUser(data.user);
          await loadGuilds();
        }
      }
    } catch (err) {
      console.warn('Session check failed:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBotStatus = async () => {
    try {
      const res = await fetch('/api/bot/status');
      if (res.ok) {
        const data = await res.json();
        setBotStatus(prev => ({ ...prev, ...data }));
      }
    } catch (e) {
      console.warn('Failed to fetch bot status:', e);
    }
  };

  const loadGuilds = async () => {
    try {
      const res = await fetch('/api/guilds');
      if (res.ok) {
        const data = await res.json();
        const list = data.guilds || [];
        setGuilds(list);

        // Auto-select first or saved guild
        const savedGuildId = localStorage.getItem('silence_selected_guild_id');
        const found = list.find((g: DiscordGuild) => g.id === savedGuildId) || list[0] || null;
        setSelectedGuildState(found);
      }
    } catch (e) {
      console.warn('Failed to fetch guilds:', e);
    }
  };

  const setSelectedGuild = (guild: DiscordGuild | null) => {
    setSelectedGuildState(guild);
    if (guild) {
      localStorage.setItem('silence_selected_guild_id', guild.id);
    } else {
      localStorage.removeItem('silence_selected_guild_id');
    }
  };

  const loginWithDiscord = async () => {
    try {
      const res = await fetch('/api/auth/discord/url');
      const data = await res.json();
      if (data.authUrl) {
        // Open OAuth authorization flow
        window.location.href = data.authUrl;
      }
    } catch (err) {
      console.error('Failed to get auth URL, falling back to instant developer authentication:', err);
      demoLogin();
    }
  };

  const demoLogin = async () => {
    try {
      setIsLoading(true);
      const res = await fetch('/api/auth/discord/callback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: 'demo_code' })
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        await loadGuilds();
      }
    } catch (e) {
      console.error('Demo login failed:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (e) {
      console.warn('Logout request failed:', e);
    }
    setUser(null);
    setSelectedGuild(null);
    setIsSetupMode(false);
    setSetupStep(0);
    localStorage.removeItem('silence_selected_guild_id');
  };

  const startSetupWizard = (guild?: DiscordGuild) => {
    if (guild) {
      setSelectedGuild(guild);
    }
    setIsSetupMode(true);
    setSetupStep(0);
  };

  const completeSetupWizard = () => {
    setIsSetupMode(false);
    if (selectedGuild) {
      selectedGuild.setupCompleted = true;
      selectedGuild.botInstalled = true;
    }
    loadGuilds();
  };

  const refreshGuilds = async () => {
    await loadGuilds();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        isLoading,
        selectedGuild,
        guilds,
        isSetupMode,
        setupStep,
        botStatus,
        loginWithDiscord,
        demoLogin,
        logout,
        setSelectedGuild,
        setSetupStep,
        startSetupWizard,
        completeSetupWizard,
        refreshGuilds
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
};
