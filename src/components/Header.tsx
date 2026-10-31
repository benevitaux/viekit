import React from 'react';
import { Search, AlertOctagon } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const { title, setIsSearchOpen, setIsSosOpen, t, country } = useApp();

  return (
    <header className="sticky top-0 z-40 w-full border-b backdrop-blur-md bg-opacity-90 transition-colors"
      style={{
        backgroundColor: 'var(--app-bg)',
        borderColor: 'var(--app-border)',
      }}
    >
      <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Left: Green Heart Icon & Transliterated Title */}
        <div className="flex items-center gap-2.5">
          <span
            className="text-2xl select-none inline-flex items-center justify-center p-1.5 rounded-xl border shadow-sm"
            style={{
              backgroundColor: 'var(--app-accent-light)',
              borderColor: 'var(--app-accent-border)',
            }}
            role="img"
            aria-label="VieKit Health & Life"
          >
            💚
          </span>
          <div className="flex flex-col">
            <h1 className="text-xl font-black tracking-tight flex items-center gap-1.5" style={{ color: 'var(--app-text)' }}>
              {title}
            </h1>
            <span className="text-[11px] font-medium tracking-wide flex items-center gap-1 opacity-75" style={{ color: 'var(--app-subtext)' }}>
              <span>{country.code}</span>
              <span>•</span>
              <span>{country.emergency.general}</span>
            </span>
          </div>
        </div>

        {/* Right (LTR) / Left (RTL): Universal Search & Glowing SOS Button */}
        <div className="flex items-center gap-2">
          {/* Universal Search Button */}
          <button
            onClick={() => setIsSearchOpen(true)}
            aria-label={t.search}
            className="p-2.5 rounded-xl transition-all border hover:opacity-90 active:scale-95 flex items-center gap-1.5 text-sm font-medium"
            style={{
              backgroundColor: 'var(--app-card)',
              borderColor: 'var(--app-border)',
              color: 'var(--app-text)',
            }}
          >
            <Search className="w-4 h-4" style={{ color: 'var(--app-accent-text)' }} />
            <span className="hidden sm:inline text-xs">{t.search}</span>
          </button>

          {/* Glowing Red SOS Button */}
          <button
            onClick={() => setIsSosOpen(true)}
            aria-label={t.sos}
            className="sos-pulse relative px-3.5 py-2 rounded-xl bg-gradient-to-r from-red-600 via-rose-600 to-red-600 hover:from-red-500 hover:to-rose-500 text-white font-extrabold text-sm tracking-wider flex items-center gap-1.5 shadow-lg shadow-red-600/50 active:scale-95 transition-all border border-red-400/40"
          >
            <AlertOctagon className="w-4 h-4 animate-spin-slow text-white" />
            <span>{t.sos}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
