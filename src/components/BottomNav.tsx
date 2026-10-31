import React from 'react';
import { Home, BookOpen, Wrench, ShieldCheck, Settings } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NavTab } from '../types';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, setActiveTool, t } = useApp();

  const navItems: { tab: NavTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { tab: 'home', label: t.tabHome, icon: Home },
    { tab: 'guides', label: t.tabGuides, icon: BookOpen },
    { tab: 'tools', label: t.tabTools, icon: Wrench },
    { tab: 'prepare', label: t.tabPrepare, icon: ShieldCheck },
    { tab: 'settings', label: t.tabSettings, icon: Settings },
  ];

  const handleTabClick = (tab: NavTab) => {
    setActiveTab(tab);
    // Reset active drill-down tool when switching tabs so user lands on tab root
    if (tab !== 'tools') {
      setActiveTool(null);
    }
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 border-t backdrop-blur-lg bg-opacity-95 transition-colors"
      style={{
        backgroundColor: 'var(--app-bg)',
        borderColor: 'var(--app-border)',
      }}
    >
      <div className="max-w-md mx-auto grid grid-cols-5 h-16 px-1 safe-area-pb">
        {navItems.map((item) => {
          const isActive = activeTab === item.tab;
          const Icon = item.icon;
          return (
            <button
              key={item.tab}
              onClick={() => handleTabClick(item.tab)}
              className={`flex flex-col items-center justify-center py-1 transition-all rounded-xl select-none ${
                isActive ? 'font-bold scale-105' : 'opacity-65 hover:opacity-90 active:scale-95'
              }`}
              style={{
                color: isActive ? 'var(--app-accent)' : 'var(--app-subtext)',
              }}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'stroke-[2.5px]' : 'stroke-2'}`} />
              </div>
              <span className="text-[10px] mt-1 tracking-tight truncate max-w-[58px] leading-tight text-center">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
