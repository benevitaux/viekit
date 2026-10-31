import React, { useState } from 'react';
import {
  Globe,
  MapPin,
  Moon,
  Sun,
  Palette,
  Download,
  Check,
  Search,
  Share2,
  HardDriveDownload,
  ShieldCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SUPPORTED_LANGUAGES } from '../data/languages';
import { UN_COUNTRIES } from '../data/countries';
import { AccentColor, LanguageCode, ThemeMode } from '../types';
import { deviceManager } from '../utils/device';

export const SettingsView: React.FC = () => {
  const {
    language,
    setLanguage,
    country,
    setCountryCode,
    theme,
    setTheme,
    accent,
    setAccent,
    t,
  } = useApp();

  const [countryFilter, setCountryFilter] = useState('');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Sorted alphabetically by English name
  const filteredCountries = UN_COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(countryFilter.toLowerCase()) ||
      c.nativeName.toLowerCase().includes(countryFilter.toLowerCase()) ||
      c.code.toLowerCase().includes(countryFilter.toLowerCase())
  );

  const handleDownloadSingleHtml = () => {
    const success = deviceManager.exportCurrentAppAsSingleHtml('VieKit-Emergency-Kit.html');
    if (success) {
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 4000);
    }
  };

  const handleShareApp = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'VieKit - Emergency Survival & Medical Kit',
          text: 'Offline-ready multi-language emergency survival, medical, and preparedness kit.',
          url: window.location.href,
        });
      } catch {
        // Ignore aborts
      }
    } else {
      handleDownloadSingleHtml();
    }
  };

  return (
    <div className="space-y-6 pb-24 max-w-4xl mx-auto px-4 pt-4">
      {/* Title */}
      <div>
        <h2 className="text-xl font-black tracking-tight" style={{ color: 'var(--app-text)' }}>
          {t.settingsTitle}
        </h2>
        <p className="text-xs opacity-75 mt-0.5" style={{ color: 'var(--app-subtext)' }}>
          {t.settingsSubtitle}
        </p>
      </div>

      {/* ========================================================= */}
      {/* Section 1: Single-File HTML Export (Top Priority Feature) */}
      {/* ========================================================= */}
      <div
        className="p-5 rounded-3xl border shadow-lg relative overflow-hidden"
        style={{
          backgroundColor: 'var(--app-card)',
          borderColor: 'var(--app-border)',
        }}
      >
        <div className="flex items-center gap-2.5 mb-2">
          <span
            className="p-2.5 rounded-2xl border"
            style={{
              backgroundColor: 'var(--app-accent-light)',
              borderColor: 'var(--app-accent-border)',
              color: 'var(--app-accent-text)',
            }}
          >
            <HardDriveDownload className="w-5 h-5" />
          </span>
          <div>
            <h3 className="text-base font-extrabold" style={{ color: 'var(--app-text)' }}>
              {t.sectionExport}
            </h3>
            <p className="text-xs opacity-75" style={{ color: 'var(--app-subtext)' }}>
              {t.exportSectionSub}
            </p>
          </div>
        </div>

        <p className="text-xs opacity-80 my-3 leading-relaxed" style={{ color: 'var(--app-subtext)' }}>
          {t.exportSingleHtmlDesc}
        </p>

        <div className="flex flex-col sm:flex-row gap-2.5">
          <button
            onClick={handleDownloadSingleHtml}
            className="flex-1 py-3 px-4 rounded-2xl text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg"
            style={{ backgroundColor: 'var(--app-accent)' }}
          >
            {downloadSuccess ? <Check className="w-4 h-4 text-white" /> : <Download className="w-4 h-4" />}
            <span>{downloadSuccess ? 'Downloaded VieKit.html!' : t.exportSingleHtmlBtn}</span>
          </button>

          <button
            onClick={handleShareApp}
            className="py-3 px-4 rounded-2xl border font-bold text-xs flex items-center justify-center gap-2 hover:opacity-100 opacity-80 active:scale-95 transition-all"
            style={{ backgroundColor: 'var(--app-bg)', borderColor: 'var(--app-border)', color: 'var(--app-text)' }}
          >
            <Share2 className="w-4 h-4" style={{ color: 'var(--app-accent-text)' }} />
            <span>{t.shareWithFamily}</span>
          </button>
        </div>

        <div className="mt-3 text-center text-[11px] font-mono font-bold opacity-60" style={{ color: 'var(--app-subtext)' }}>
          Version 1.0.0
        </div>
      </div>

      {/* ========================================================= */}
      {/* Section 2: Languages (Big Buttons with English & Native)  */}
      {/* ========================================================= */}
      <div
        className="p-5 rounded-3xl border shadow-sm"
        style={{ backgroundColor: 'var(--app-card)', borderColor: 'var(--app-border)' }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Globe className="w-4 h-4" style={{ color: 'var(--app-accent-text)' }} />
          <h3 className="text-sm font-extrabold uppercase tracking-wide" style={{ color: 'var(--app-accent-text)' }}>
            {t.sectionLanguage}
          </h3>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = language === lang.code;
            return (
              <button
                key={lang.code}
                onClick={() => setLanguage(lang.code)}
                className={`p-3.5 rounded-2xl border text-left flex flex-col justify-between transition-all active:scale-95 ${
                  isSelected
                    ? 'font-bold shadow-md'
                    : 'hover:border-slate-600 opacity-75 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: isSelected ? 'var(--app-accent-light)' : 'var(--app-bg)',
                  borderColor: isSelected ? 'var(--app-accent)' : 'var(--app-border)',
                }}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-sm font-black" style={{ color: 'var(--app-text)' }}>
                    {lang.nativeName}
                  </span>
                  {isSelected && <Check className="w-4 h-4 shrink-0" style={{ color: 'var(--app-accent-text)' }} />}
                </div>
                <div className="text-[11px] opacity-75 mt-1" style={{ color: 'var(--app-subtext)' }}>
                  <span>{lang.englishName}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* Section 3: Country Directory (All UN Countries)          */}
      {/* ========================================================= */}
      <div
        className="p-5 rounded-3xl border shadow-sm"
        style={{ backgroundColor: 'var(--app-card)', borderColor: 'var(--app-border)' }}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-red-400" />
            <h3 className="text-sm font-extrabold uppercase tracking-wide" style={{ color: 'var(--app-accent-text)' }}>
              {t.sectionCountry}
            </h3>
          </div>
          <span className="text-xs font-mono font-bold text-red-400">
            {t.activeCountryLabel} {country.name} [{country.emergency.general}]
          </span>
        </div>

        {/* Search Input */}
        <div className="flex items-center gap-2.5 p-3 rounded-2xl border mb-3" style={{ backgroundColor: 'var(--app-bg)', borderColor: 'var(--app-border)' }}>
          <Search className="w-4 h-4 shrink-0" style={{ color: 'var(--app-accent-text)' }} />
          <input
            type="text"
            value={countryFilter}
            onChange={(e) => setCountryFilter(e.target.value)}
            placeholder={t.searchCountriesPlaceholder}
            className="w-full bg-transparent text-xs sm:text-sm outline-none font-medium placeholder:opacity-50"
            style={{ color: 'var(--app-text)' }}
          />
        </div>

        {/* Countries Scroll List */}
        <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
          {filteredCountries.map((c) => {
            const isCurrent = c.code === country.code;
            return (
              <button
                key={c.code}
                onClick={() => setCountryCode(c.code)}
                className={`w-full p-3 rounded-2xl text-left flex items-center justify-between text-xs transition-all active:scale-[0.99] border ${
                  isCurrent
                    ? 'font-bold shadow'
                    : 'border-transparent hover:border-slate-700 opacity-80 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: isCurrent ? 'var(--app-accent-light)' : 'var(--app-bg)',
                  borderColor: isCurrent ? 'var(--app-accent)' : 'transparent',
                  color: 'var(--app-text)',
                }}
              >
                <div>
                  <span className="font-bold text-sm">{c.name}</span>{' '}
                  <span className="opacity-70 text-xs">[{c.nativeName}]</span>
                </div>
                <div className="flex items-center gap-3 font-mono text-xs">
                  <span className="font-bold" style={{ color: 'var(--app-accent-text)' }}>SOS: {c.emergency.general}</span>
                  {isCurrent && <Check className="w-4 h-4" style={{ color: 'var(--app-accent-text)' }} />}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ========================================================= */}
      {/* Section 4: Appearance (Light, Dark, Black)                */}
      {/* ========================================================= */}
      <div
        className="p-5 rounded-3xl border shadow-sm"
        style={{ backgroundColor: 'var(--app-card)', borderColor: 'var(--app-border)' }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Moon className="w-4 h-4" style={{ color: 'var(--app-accent-text)' }} />
          <h3 className="text-sm font-extrabold uppercase tracking-wide" style={{ color: 'var(--app-accent-text)' }}>
            {t.sectionAppearance}
          </h3>
        </div>

        <div className="grid grid-cols-3 gap-2.5">
          {/* Light */}
          <button
            onClick={() => setTheme('light')}
            className={`p-3.5 rounded-2xl border text-center flex flex-col items-center gap-2 transition-all active:scale-95 ${
              theme === 'light'
                ? 'bg-white text-slate-900 font-black shadow-md'
                : 'bg-white/10 text-slate-200 border-slate-700 opacity-70 hover:opacity-100'
            }`}
            style={{
              borderColor: theme === 'light' ? 'var(--app-accent)' : undefined,
            }}
          >
            <Sun className="w-5 h-5 text-amber-500" />
            <span className="text-xs font-bold">{t.themeLight}</span>
          </button>

          {/* Dark */}
          <button
            onClick={() => setTheme('dark')}
            className={`p-3.5 rounded-2xl border text-center flex flex-col items-center gap-2 transition-all active:scale-95 ${
              theme === 'dark'
                ? 'bg-slate-800 text-white font-black shadow-md'
                : 'bg-slate-900/60 text-slate-300 border-slate-700 opacity-70 hover:opacity-100'
            }`}
            style={{
              borderColor: theme === 'dark' ? 'var(--app-accent)' : undefined,
            }}
          >
            <Moon className="w-5 h-5 text-blue-400" />
            <span className="text-xs font-bold">{t.themeDark}</span>
          </button>

          {/* Black (AMOLED Battery Saver) */}
          <button
            onClick={() => setTheme('black')}
            className={`p-3.5 rounded-2xl border text-center flex flex-col items-center gap-2 transition-all active:scale-95 ${
              theme === 'black'
                ? 'bg-black text-white font-black shadow-md'
                : 'bg-black text-slate-400 border-neutral-800 opacity-70 hover:opacity-100'
            }`}
            style={{
              borderColor: theme === 'black' ? 'var(--app-accent)' : undefined,
            }}
          >
            <div className="w-5 h-5 rounded-full bg-black border border-white" />
            <div className="text-[11px] font-bold leading-tight">
              <span>{t.themeBlack}</span>
            </div>
          </button>
        </div>

        <p className="mt-3 text-[11px] opacity-70" style={{ color: 'var(--app-subtext)' }}>
          {t.amoledDesc}
        </p>
      </div>

      {/* ========================================================= */}
      {/* Section 5: Accent Color (Green Default)                   */}
      {/* ========================================================= */}
      <div
        className="p-5 rounded-3xl border shadow-sm"
        style={{ backgroundColor: 'var(--app-card)', borderColor: 'var(--app-border)' }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Palette className="w-4 h-4" style={{ color: 'var(--app-accent-text)' }} />
          <h3 className="text-sm font-extrabold uppercase tracking-wide" style={{ color: 'var(--app-accent-text)' }}>
            {t.sectionAccent}
          </h3>
        </div>

        <div className="grid grid-cols-5 gap-2">
          {[
            { id: 'green', label: t.accentGreen, hex: '#10b981' },
            { id: 'red', label: t.accentRed, hex: '#f43f5e' },
            { id: 'blue', label: t.accentBlue, hex: '#0ea5e9' },
            { id: 'amber', label: t.accentAmber, hex: '#f59e0b' },
            { id: 'cyan', label: t.accentCyan, hex: '#06b6d4' },
          ].map((col) => {
            const isSelected = accent === col.id;
            return (
              <button
                key={col.id}
                onClick={() => setAccent(col.id as AccentColor)}
                aria-label={col.label}
                className={`p-3 rounded-2xl border flex flex-col items-center justify-center transition-all active:scale-95 ${
                  isSelected
                    ? 'border-white shadow-lg scale-105'
                    : 'border-transparent opacity-70 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: isSelected ? 'var(--app-accent-light)' : 'var(--app-bg)',
                  borderColor: isSelected ? col.hex : 'transparent',
                  boxShadow: isSelected ? `0 0 0 2.5px ${col.hex}` : undefined,
                }}
              >
                <span
                  className="w-7 h-7 rounded-full shadow-sm"
                  style={{ backgroundColor: col.hex }}
                />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
