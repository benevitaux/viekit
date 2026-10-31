import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { SosModal } from './components/SosModal';
import { SearchModal } from './components/SearchModal';
import { HomeView } from './views/HomeView';
import { GuidesView } from './views/GuidesView';
import { ToolsView } from './views/ToolsView';
import { PrepareView } from './views/PrepareView';
import { SettingsView } from './views/SettingsView';

const MainLayout: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div className="min-h-screen flex flex-col font-sans select-none antialiased transition-colors"
      style={{
        backgroundColor: 'var(--app-bg)',
        color: 'var(--app-text)',
      }}
    >
      {/* Header */}
      <Header />

      {/* Main Body View */}
      <main className="flex-1 w-full">
        {activeTab === 'home' && <HomeView />}
        {activeTab === 'guides' && <GuidesView />}
        {activeTab === 'tools' && <ToolsView />}
        {activeTab === 'prepare' && <PrepareView />}
        {activeTab === 'settings' && <SettingsView />}
      </main>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Global Modals */}
      <SosModal />
      <SearchModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
