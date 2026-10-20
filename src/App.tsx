import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { BotDataProvider } from './context/BotDataContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { LandingPageView } from './components/views/LandingPageView';
import { SetupWizard } from './components/wizard/SetupWizard';
import { OverviewView } from './components/views/OverviewView';
import { SimulatorView } from './components/views/SimulatorView';
import { CommandsView } from './components/views/CommandsView';
import { TicketsView } from './components/views/TicketsView';
import { OrdersView } from './components/views/OrdersView';
import { ServicesView } from './components/views/ServicesView';
import { MarketplaceView } from './components/views/MarketplaceView';
import { StoreView } from './components/views/StoreView';
import { GiveawaysView } from './components/views/GiveawaysView';
import { EmbedBuilderView } from './components/views/EmbedBuilderView';
import { ApplicationsView } from './components/views/ApplicationsView';
import { ModerationView } from './components/views/ModerationView';
import { RobloxSettingsView } from './components/views/RobloxSettingsView';
import { ArrowLeft } from 'lucide-react';

function DashboardContent() {
  const { isAuthenticated, isSetupMode, selectedGuild } = useAuth();
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [guestSimulatorMode, setGuestSimulatorMode] = useState(false);

  // Unauthenticated visitors see the Landing Page (with option to test the simulator as guest)
  if (!isAuthenticated && !guestSimulatorMode) {
    return <LandingPageView onEnterSimulator={() => setGuestSimulatorMode(true)} />;
  }

  // Guest simulator mode allows testing Discord commands without signing in
  if (!isAuthenticated && guestSimulatorMode) {
    return (
      <div className="flex flex-col h-screen w-screen bg-[#0B0E14] text-slate-100 overflow-hidden">
        <div className="bg-[#111622] px-6 py-2.5 border-b border-[#232D3F] flex items-center justify-between text-xs">
          <button
            onClick={() => setGuestSimulatorMode(false)}
            className="flex items-center gap-1.5 text-blue-400 hover:text-blue-300 font-semibold"
          >
            <ArrowLeft className="w-4 h-4" /> Return to Silence Designs Homepage
          </button>
          <span className="text-slate-400">
            Guest Mode • Full Interactive Simulator
          </span>
        </div>
        <div className="flex-1 p-4 bg-[#0E131E] overflow-hidden">
          <SimulatorView />
        </div>
      </div>
    );
  }

  // First-time setup wizard when in setup mode or server not yet completed
  if (isSetupMode || (selectedGuild && !selectedGuild.setupCompleted)) {
    return (
      <div className="flex flex-col h-screen w-screen bg-[#0B0E14] text-slate-100 overflow-hidden font-sans">
        <Header currentTab="setup" onNavigate={setActiveTab} />
        <main className="flex-1 overflow-y-auto p-6 bg-[#0E131E]">
          <div className="max-w-6xl mx-auto">
            <SetupWizard />
          </div>
        </main>
      </div>
    );
  }

  // Fully Authorized Management Dashboard
  const renderDashboardView = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewView onNavigate={setActiveTab} />;
      case 'simulator':
        return <SimulatorView />;
      case 'commands':
        return <CommandsView onTestCommand={() => setActiveTab('simulator')} />;
      case 'tickets':
        return <TicketsView />;
      case 'orders':
        return <OrdersView />;
      case 'services':
        return <ServicesView />;
      case 'marketplace':
        return <MarketplaceView />;
      case 'store':
        return <StoreView />;
      case 'giveaways':
        return <GiveawaysView />;
      case 'embeds':
        return <EmbedBuilderView />;
      case 'applications':
        return <ApplicationsView />;
      case 'moderation':
        return <ModerationView />;
      case 'settings':
        return <RobloxSettingsView />;
      default:
        return <OverviewView onNavigate={setActiveTab} />;
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#0B0E14] text-slate-100 overflow-hidden font-sans">
      <Header currentTab={activeTab} onNavigate={setActiveTab} />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar currentTab={activeTab} onNavigate={setActiveTab} />
        <main className="flex-1 overflow-y-auto p-6 bg-[#0E131E]">
          <div className="max-w-7xl mx-auto">{renderDashboardView()}</div>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BotDataProvider>
        <DashboardContent />
      </BotDataProvider>
    </AuthProvider>
  );
}
