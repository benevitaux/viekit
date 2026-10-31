import React, { useState, useEffect } from 'react';
import {
  AlertOctagon,
  BatteryCharging,
  Battery,
  ShieldCheck,
  Compass,
  Zap,
  Volume2,
  Heart,
  Droplets,
  BookOpen,
  ChevronRight,
  ChevronLeft,
  MapPin,
  Flame,
  PhoneCall,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SAMPLE_GUIDES } from '../data/guides';

export const HomeView: React.FC = () => {
  const { setIsSosOpen, setActiveTab, setActiveTool, country, t, direction } = useApp();
  const ChevronIcon = direction === 'rtl' ? ChevronLeft : ChevronRight;

  // Battery status state
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [isCharging, setIsCharging] = useState<boolean>(false);

  useEffect(() => {
    // Battery API
    const navWithBattery = navigator as unknown as {
      getBattery?: () => Promise<{
        level: number;
        charging: boolean;
        addEventListener: (event: string, fn: () => void) => void;
      }>;
    };

    if (typeof navWithBattery.getBattery === 'function') {
      navWithBattery
        .getBattery()
        .then((battery) => {
          setBatteryLevel(Math.round(battery.level * 100));
          setIsCharging(battery.charging);

          battery.addEventListener('levelchange', () => {
            setBatteryLevel(Math.round(battery.level * 100));
          });
          battery.addEventListener('chargingchange', () => {
            setIsCharging(battery.charging);
          });
        })
        .catch(() => {
          // Battery API denied or unsupported
        });
    }
  }, []);

  return (
    <div className="space-y-6 pb-20 max-w-4xl mx-auto px-4 pt-4">
      {/* Top Status Bar: Offline Ready, Country, Battery */}
      <div
        className="p-3.5 rounded-2xl border flex items-center justify-between text-xs transition-colors"
        style={{
          backgroundColor: 'var(--app-card)',
          borderColor: 'var(--app-border)',
        }}
      >
        <div className="flex items-center gap-2">
          <span className="flex h-2.5 w-2.5 relative">
            <span
              className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
              style={{ backgroundColor: 'var(--app-accent-text)' }}
            />
            <span
              className="relative inline-flex rounded-full h-2.5 w-2.5"
              style={{ backgroundColor: 'var(--app-accent)' }}
            />
          </span>
          <span className="font-bold tracking-wide" style={{ color: 'var(--app-accent-text)' }}>
            {t.readyOffline}
          </span>
        </div>

        <div className="flex items-center gap-3" style={{ color: 'var(--app-subtext)' }}>
          <button
            onClick={() => setActiveTab('settings')}
            className="flex items-center gap-1 font-semibold hover:opacity-100 transition-opacity"
          >
            <MapPin className="w-3.5 h-3.5 text-red-400" />
            <span>{country.code} ({country.emergency.general})</span>
          </button>

          {batteryLevel !== null && (
            <div className="flex items-center gap-1 font-mono font-medium">
              {isCharging ? (
                <BatteryCharging className="w-4 h-4 text-emerald-400" />
              ) : (
                <Battery className="w-4 h-4 text-slate-400" />
              )}
              <span>{batteryLevel}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Hero Section: Big Emergency Button in Glowing Red */}
      <div
        className="relative p-6 sm:p-10 rounded-3xl border text-center overflow-hidden transition-all shadow-xl"
        style={{
          backgroundColor: 'var(--app-card)',
          borderColor: 'var(--app-border)',
        }}
      >
        {/* Ambient Red Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-red-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center">
          {/* Big Emergency SOS Button */}
          <div className="relative my-4">
            {/* Concentric radar pulse rings */}
            <div className="absolute inset-0 rounded-full border-2 border-red-500 radar-ring pointer-events-none" />
            <div
              className="absolute -inset-4 rounded-full border border-red-500/40 radar-ring pointer-events-none"
              style={{ animationDelay: '0.6s' }}
            />

            <button
              onClick={() => setIsSosOpen(true)}
              className="sos-pulse w-44 h-44 sm:w-52 sm:h-52 rounded-full bg-gradient-to-tr from-red-600 via-rose-600 to-red-500 hover:from-red-500 hover:to-rose-400 text-white font-black flex flex-col items-center justify-center shadow-2xl shadow-red-600/60 active:scale-95 transition-all border-4 border-red-300/40 cursor-pointer"
            >
              <AlertOctagon className="w-16 h-16 sm:w-20 sm:h-20 drop-shadow-md text-white animate-spin-slow" />
              <span className="text-xl sm:text-2xl font-black tracking-widest mt-1">
                {t.emergencyHelpButton}
              </span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-red-100/90 mt-0.5">
                {country.emergency.general}
              </span>
            </button>
          </div>

          <p className="text-xs sm:text-sm font-semibold max-w-sm mx-auto mt-2" style={{ color: 'var(--app-text)' }}>
            {t.emergencyHelpDesc}
          </p>
          <span className="text-[11px] opacity-70 mt-1" style={{ color: 'var(--app-subtext)' }}>
            {t.sosDispatchSubtext}
          </span>
        </div>
      </div>

      {/* Rapid Response Tools Quick Grid */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-sm font-bold tracking-wide uppercase" style={{ color: 'var(--app-accent-text)' }}>
            {t.quickAccess}
          </h2>
          <button
            onClick={() => setActiveTab('tools')}
            className="text-xs font-semibold hover:underline flex items-center gap-1"
            style={{ color: 'var(--app-subtext)' }}
          >
            <span>{t.viewAllTools}</span>
            <ChevronIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {/* Emergency Directory */}
          <button
            onClick={() => {
              setActiveTab('tools');
              setActiveTool({ category: 'survival', id: 'emergency-numbers' });
            }}
            className="p-3.5 rounded-2xl border text-start flex flex-col justify-between transition-all hover:opacity-90 active:scale-95"
            style={{ backgroundColor: 'var(--app-card)', borderColor: 'var(--app-border)' }}
            dir={direction}
          >
            <span className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 w-fit">
              <PhoneCall className="w-4 h-4" />
            </span>
            <div className="mt-3">
              <div className="text-xs font-bold break-words" style={{ color: 'var(--app-text)' }}>{t.emergencyNumbersTitle}</div>
              <div className="text-[11px] opacity-65 break-words mt-0.5" style={{ color: 'var(--app-subtext)' }}>
                {country.name}: {country.emergency.general}
              </div>
            </div>
          </button>

          {/* Whistle & Siren */}
          <button
            onClick={() => {
              setActiveTab('tools');
              setActiveTool({ category: 'survival', id: 'whistle' });
            }}
            className="p-3.5 rounded-2xl border text-start flex flex-col justify-between transition-all hover:opacity-90 active:scale-95"
            style={{ backgroundColor: 'var(--app-card)', borderColor: 'var(--app-border)' }}
            dir={direction}
          >
            <span
              className="p-2 rounded-xl border w-fit"
              style={{
                backgroundColor: 'var(--app-accent-light)',
                borderColor: 'var(--app-accent-border)',
                color: 'var(--app-accent-text)',
              }}
            >
              <Volume2 className="w-4 h-4" />
            </span>
            <div className="mt-3">
              <div className="text-xs font-bold break-words" style={{ color: 'var(--app-text)' }}>{t.whistleTitle}</div>
              <div className="text-[11px] opacity-65 break-words mt-0.5" style={{ color: 'var(--app-subtext)' }}>
                Acoustic pea whistle & alarm
              </div>
            </div>
          </button>

          {/* Flashlight */}
          <button
            onClick={() => {
              setActiveTab('tools');
              setActiveTool({ category: 'survival', id: 'flashlight' });
            }}
            className="p-3.5 rounded-2xl border text-start flex flex-col justify-between transition-all hover:border-emerald-500/50 hover:bg-emerald-500/5 active:scale-95"
            style={{ backgroundColor: 'var(--app-card)', borderColor: 'var(--app-border)' }}
            dir={direction}
          >
            <span className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 w-fit">
              <Zap className="w-4 h-4" />
            </span>
            <div className="mt-3">
              <div className="text-xs font-bold break-words" style={{ color: 'var(--app-text)' }}>{t.flashlightTitle}</div>
              <div className="text-[11px] opacity-65 break-words mt-0.5" style={{ color: 'var(--app-subtext)' }}>
                Hardware LED & night vision
              </div>
            </div>
          </button>

          {/* CPR Assistant */}
          <button
            onClick={() => {
              setActiveTab('tools');
              setActiveTool({ category: 'medical', id: 'cpr' });
            }}
            className="p-3.5 rounded-2xl border text-start flex flex-col justify-between transition-all hover:border-emerald-500/50 hover:bg-emerald-500/5 active:scale-95"
            style={{ backgroundColor: 'var(--app-card)', borderColor: 'var(--app-border)' }}
            dir={direction}
          >
            <span className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 w-fit">
              <Heart className="w-4 h-4" />
            </span>
            <div className="mt-3">
              <div className="text-xs font-bold break-words" style={{ color: 'var(--app-text)' }}>{t.cprTitle}</div>
              <div className="text-[11px] opacity-65 break-words mt-0.5" style={{ color: 'var(--app-subtext)' }}>
                110 BPM metronome & counter
              </div>
            </div>
          </button>

          {/* 5-4-3-2-1 Grounding */}
          <button
            onClick={() => {
              setActiveTab('tools');
              setActiveTool({ category: 'mental', id: 'grounding-54321' });
            }}
            className="p-3.5 rounded-2xl border text-start flex flex-col justify-between transition-all hover:border-emerald-500/50 hover:bg-emerald-500/5 active:scale-95"
            style={{ backgroundColor: 'var(--app-card)', borderColor: 'var(--app-border)' }}
            dir={direction}
          >
            <span className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 w-fit">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <div className="mt-3">
              <div className="text-xs font-bold break-words" style={{ color: 'var(--app-text)' }}>{t.groundingTitle}</div>
              <div className="text-[11px] opacity-65 break-words mt-0.5" style={{ color: 'var(--app-subtext)' }}>
                Shock & panic regulation
              </div>
            </div>
          </button>

          {/* Water & ORS */}
          <button
            onClick={() => {
              setActiveTab('tools');
              setActiveTool({ category: 'survival', id: 'water-ors' });
            }}
            className="p-3.5 rounded-2xl border text-start flex flex-col justify-between transition-all hover:border-emerald-500/50 hover:bg-emerald-500/5 active:scale-95"
            style={{ backgroundColor: 'var(--app-card)', borderColor: 'var(--app-border)' }}
            dir={direction}
          >
            <span className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 w-fit">
              <Droplets className="w-4 h-4" />
            </span>
            <div className="mt-3">
              <div className="text-xs font-bold break-words" style={{ color: 'var(--app-text)' }}>{t.waterOrsTitle}</div>
              <div className="text-[11px] opacity-65 break-words mt-0.5" style={{ color: 'var(--app-subtext)' }}>
                WHO rehydration & bleaching
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Emergency First Aid & Guides Spotlight */}
      <div>
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-sm font-bold tracking-wide uppercase" style={{ color: 'var(--app-accent-text)' }}>
            {t.criticalGuidesTitle}
          </h2>
          <button
            onClick={() => setActiveTab('guides')}
            className="text-xs font-semibold hover:underline flex items-center gap-1"
            style={{ color: 'var(--app-subtext)' }}
          >
            <span>{t.allGuides}</span>
            <ChevronIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {SAMPLE_GUIDES.slice(0, 3).map((guide) => (
            <button
              key={guide.id}
              onClick={() => setActiveTab('guides')}
              className="w-full p-4 rounded-2xl border text-start flex items-center justify-between transition-all hover:border-emerald-500/50 hover:bg-emerald-500/5 active:scale-[0.99]"
              style={{ backgroundColor: 'var(--app-card)', borderColor: 'var(--app-border)' }}
              dir={direction}
            >
              <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
                <span className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 shrink-0">
                  <BookOpen className="w-4 h-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <h4 className="text-xs sm:text-sm font-bold break-words" style={{ color: 'var(--app-text)' }}>
                    {guide.title}
                  </h4>
                  <p className="text-[11px] opacity-70 break-words mt-0.5" style={{ color: 'var(--app-subtext)' }}>
                    {guide.summary}
                  </p>
                </div>
              </div>
              <ChevronIcon className="w-4 h-4 shrink-0 opacity-50" />
            </button>
          ))}
        </div>
      </div>

      {/* Offline Architecture Banner */}
      <div
        className="p-4 rounded-2xl border flex items-start gap-3 text-xs"
        style={{
          backgroundColor: 'var(--app-card)',
          borderColor: 'var(--app-border)',
        }}
      >
        <span className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
          <ShieldCheck className="w-4 h-4" />
        </span>
        <div>
          <h4 className="font-bold text-emerald-400">{t.emergencyNoticeTitle}</h4>
          <p className="opacity-80 mt-1 leading-relaxed" style={{ color: 'var(--app-subtext)' }}>
            {t.emergencyNoticeBody}
          </p>
        </div>
      </div>
    </div>
  );
};
