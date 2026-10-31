import React, { useState } from 'react';
import {
  ChevronLeft,
  PhoneCall,
  Zap,
  Volume2,
  Compass,
  MapPin,
  Droplets,
  Heart,
  Activity,
  Clock,
  Smile,
  ShieldCheck,
  ChevronRight,
  Wind,
  Hand,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MedicalToolId, MentalToolId, SurvivalToolId } from '../types';
import { SurvivalTools } from '../components/tools/SurvivalTools';
import { MedicalTools } from '../components/tools/MedicalTools';
import { MentalSupportTools } from '../components/tools/MentalSupportTools';

export const ToolsView: React.FC = () => {
  const { activeTool, setActiveTool, country, t, direction } = useApp();
  const [activeCategoryTab, setActiveCategoryTab] = useState<'survival' | 'medical' | 'mental'>('survival');
  const BackChevron = direction === 'rtl' ? ChevronRight : ChevronLeft;
  const ForwardChevron = direction === 'rtl' ? ChevronLeft : ChevronRight;

  // If a specific tool is opened, render its view with a back navigation button
  if (activeTool) {
    return (
      <div className="pb-24 max-w-4xl mx-auto px-4 pt-3">
        {/* Top Back Navigation Bar */}
        <div className="flex items-center justify-between pb-3 mb-4 border-b" style={{ borderColor: 'var(--app-border)' }}>
          <button
            onClick={() => setActiveTool(null)}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border hover:opacity-100 active:scale-95 transition-all"
            style={{
              backgroundColor: 'var(--app-card)',
              borderColor: 'var(--app-border)',
              color: 'var(--app-text)',
            }}
          >
            <BackChevron className="w-4 h-4" style={{ color: 'var(--app-accent-text)' }} />
            <span>{t.back}</span>
          </button>

          <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--app-accent-text)' }}>
            {activeTool.category === 'survival' ? t.survivalCategory : activeTool.category === 'medical' ? t.medicalCategory : t.mentalCategory}
          </span>
        </div>

        {/* Drill-down Tool View */}
        {activeTool.category === 'survival' && <SurvivalTools toolId={activeTool.id as SurvivalToolId} />}
        {activeTool.category === 'medical' && <MedicalTools toolId={activeTool.id as MedicalToolId} />}
        {activeTool.category === 'mental' && <MentalSupportTools toolId={activeTool.id as MentalToolId} />}
      </div>
    );
  }

  // Root Tools Directory
  return (
    <div className="space-y-6 pb-24 max-w-4xl mx-auto px-4 pt-4">
      {/* Title */}
      <div>
        <h2 className="text-xl font-black tracking-tight" style={{ color: 'var(--app-text)' }}>
          {t.tabTools}
        </h2>
        <p className="text-xs opacity-75 mt-0.5" style={{ color: 'var(--app-subtext)' }}>
          {t.toolsSubtitle}
        </p>
      </div>

      {/* Category Tabs: Survival, Medical, Mental Support */}
      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => setActiveCategoryTab('survival')}
          className={`py-2.5 px-2 rounded-2xl text-xs font-bold transition-all text-center border active:scale-95 ${
            activeCategoryTab === 'survival'
              ? 'shadow-md'
              : 'opacity-70 hover:opacity-100'
          }`}
          style={{
            backgroundColor: activeCategoryTab === 'survival' ? 'var(--app-accent)' : 'var(--app-card)',
            borderColor: activeCategoryTab === 'survival' ? 'var(--app-accent)' : 'var(--app-border)',
            color: activeCategoryTab === 'survival' ? '#ffffff' : 'var(--app-text)',
          }}
        >
          {t.survivalCategory}
        </button>

        <button
          onClick={() => setActiveCategoryTab('medical')}
          className={`py-2.5 px-2 rounded-2xl text-xs font-bold transition-all text-center border active:scale-95 ${
            activeCategoryTab === 'medical'
              ? 'bg-rose-600 text-white border-rose-400 shadow-md'
              : 'opacity-70 hover:opacity-100'
          }`}
          style={{
            backgroundColor: activeCategoryTab === 'medical' ? undefined : 'var(--app-card)',
            borderColor: activeCategoryTab === 'medical' ? undefined : 'var(--app-border)',
            color: activeCategoryTab === 'medical' ? undefined : 'var(--app-text)',
          }}
        >
          {t.medicalCategory}
        </button>

        <button
          onClick={() => setActiveCategoryTab('mental')}
          className={`py-2.5 px-2 rounded-2xl text-xs font-bold transition-all text-center border active:scale-95 ${
            activeCategoryTab === 'mental'
              ? 'bg-indigo-600 text-white border-indigo-400 shadow-md'
              : 'opacity-70 hover:opacity-100'
          }`}
          style={{
            backgroundColor: activeCategoryTab === 'mental' ? undefined : 'var(--app-card)',
            borderColor: activeCategoryTab === 'mental' ? undefined : 'var(--app-border)',
            color: activeCategoryTab === 'mental' ? undefined : 'var(--app-text)',
          }}
        >
          {t.mentalCategory}
        </button>
      </div>

      {/* --- Section 1: Survival Tools --- */}
      {(activeCategoryTab === 'survival' || false) && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
              {t.survivalCategory}
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <button
              dir={direction}
              onClick={() => setActiveTool({ category: 'survival', id: 'emergency-numbers' })}
              className="p-4 rounded-3xl border text-left rtl:text-right flex items-start justify-between transition-all hover:border-emerald-500/50 hover:bg-emerald-500/5 active:scale-[0.99] shadow-sm"
              style={{ backgroundColor: 'var(--app-card)', borderColor: 'var(--app-border)' }}
            >
              <div className="flex items-start gap-3.5">
                <span className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 shrink-0">
                  <PhoneCall className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="text-sm font-bold" style={{ color: 'var(--app-text)' }}>
                    {t.emergencyNumbersTitle}
                  </h4>
                  <p className="text-xs opacity-75 mt-0.5 line-clamp-2" style={{ color: 'var(--app-subtext)' }}>
                    {t.emergencyNumbersDesc}
                  </p>
                </div>
              </div>
              <ForwardChevron className="w-4 h-4 shrink-0 opacity-50 mt-3" />
            </button>

            {/* 2. Flashlight & Strobe */}
            <button
              dir={direction}
              onClick={() => setActiveTool({ category: 'survival', id: 'flashlight' })}
              className="p-4 rounded-3xl border text-left rtl:text-right flex items-start justify-between transition-all hover:border-emerald-500/50 hover:bg-emerald-500/5 active:scale-[0.99] shadow-sm"
              style={{ backgroundColor: 'var(--app-card)', borderColor: 'var(--app-border)' }}
            >
              <div className="flex items-start gap-3.5">
                <span className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
                  <Zap className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="text-sm font-bold" style={{ color: 'var(--app-text)' }}>
                    {t.flashlightTitle}
                  </h4>
                  <p className="text-xs opacity-75 mt-0.5 line-clamp-2" style={{ color: 'var(--app-subtext)' }}>
                    {t.flashlightDesc}
                  </p>
                </div>
              </div>
              <ForwardChevron className="w-4 h-4 shrink-0 opacity-50 mt-3" />
            </button>

            {/* 3. Whistle & Siren */}
            <button
              dir={direction}
              onClick={() => setActiveTool({ category: 'survival', id: 'whistle' })}
              className="p-4 rounded-3xl border text-left rtl:text-right flex items-start justify-between transition-all hover:border-emerald-500/50 hover:bg-emerald-500/5 active:scale-[0.99] shadow-sm"
              style={{ backgroundColor: 'var(--app-card)', borderColor: 'var(--app-border)' }}
            >
              <div className="flex items-start gap-3.5">
                <span className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
                  <Volume2 className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="text-sm font-bold" style={{ color: 'var(--app-text)' }}>
                    {t.whistleTitle}
                  </h4>
                  <p className="text-xs opacity-75 mt-0.5 line-clamp-2" style={{ color: 'var(--app-subtext)' }}>
                    {t.whistleDesc}
                  </p>
                </div>
              </div>
              <ForwardChevron className="w-4 h-4 shrink-0 opacity-50 mt-3" />
            </button>

            {/* 4. Compass */}
            <button
              dir={direction}
              onClick={() => setActiveTool({ category: 'survival', id: 'compass' })}
              className="p-4 rounded-3xl border text-left rtl:text-right flex items-start justify-between transition-all hover:border-emerald-500/50 hover:bg-emerald-500/5 active:scale-[0.99] shadow-sm"
              style={{ backgroundColor: 'var(--app-card)', borderColor: 'var(--app-border)' }}
            >
              <div className="flex items-start gap-3.5">
                <span className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0">
                  <Compass className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="text-sm font-bold" style={{ color: 'var(--app-text)' }}>
                    {t.compassTitle}
                  </h4>
                  <p className="text-xs opacity-75 mt-0.5 line-clamp-2" style={{ color: 'var(--app-subtext)' }}>
                    {t.compassDesc}
                  </p>
                </div>
              </div>
              <ForwardChevron className="w-4 h-4 shrink-0 opacity-50 mt-3" />
            </button>

            {/* 5. Location */}
            <button
              dir={direction}
              onClick={() => setActiveTool({ category: 'survival', id: 'location' })}
              className="p-4 rounded-3xl border text-left rtl:text-right flex items-start justify-between transition-all hover:border-emerald-500/50 hover:bg-emerald-500/5 active:scale-[0.99] shadow-sm"
              style={{ backgroundColor: 'var(--app-card)', borderColor: 'var(--app-border)' }}
            >
              <div className="flex items-start gap-3.5">
                <span className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="text-sm font-bold" style={{ color: 'var(--app-text)' }}>
                    {t.locationTitle}
                  </h4>
                  <p className="text-xs opacity-75 mt-0.5 line-clamp-2" style={{ color: 'var(--app-subtext)' }}>
                    {t.locationDesc}
                  </p>
                </div>
              </div>
              <ForwardChevron className="w-4 h-4 shrink-0 opacity-50 mt-3" />
            </button>

            {/* 6. Water Disinfection & ORS */}
            <button
              dir={direction}
              onClick={() => setActiveTool({ category: 'survival', id: 'water-ors' })}
              className="p-4 rounded-3xl border text-left rtl:text-right flex items-start justify-between transition-all hover:border-emerald-500/50 hover:bg-emerald-500/5 active:scale-[0.99] shadow-sm"
              style={{ backgroundColor: 'var(--app-card)', borderColor: 'var(--app-border)' }}
            >
              <div className="flex items-start gap-3.5">
                <span className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 shrink-0">
                  <Droplets className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="text-sm font-bold" style={{ color: 'var(--app-text)' }}>
                    {t.waterOrsTitle}
                  </h4>
                  <p className="text-xs opacity-75 mt-0.5 line-clamp-2" style={{ color: 'var(--app-subtext)' }}>
                    {t.waterOrsDesc}
                  </p>
                </div>
              </div>
              <ForwardChevron className="w-4 h-4 shrink-0 opacity-50 mt-3" />
            </button>
          </div>
        </div>
      )}

      {/* --- Section 2: Medical Tools --- */}
      {(activeCategoryTab === 'medical' || false) && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black uppercase tracking-wider text-rose-400">
              {t.medicalCategory}
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {/* CPR Assistant */}
            <button
              dir={direction}
              onClick={() => setActiveTool({ category: 'medical', id: 'cpr' })}
              className="p-4 rounded-3xl border text-left rtl:text-right flex items-start justify-between transition-all hover:border-rose-500/50 hover:bg-rose-500/5 active:scale-[0.99] shadow-sm"
              style={{ backgroundColor: 'var(--app-card)', borderColor: 'var(--app-border)' }}
            >
              <div className="flex items-start gap-3.5">
                <span className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 shrink-0">
                  <Heart className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="text-sm font-bold" style={{ color: 'var(--app-text)' }}>
                    {t.cprTitle}
                  </h4>
                  <p className="text-xs opacity-75 mt-0.5 line-clamp-2" style={{ color: 'var(--app-subtext)' }}>
                    {t.cprDesc}
                  </p>
                </div>
              </div>
              <ForwardChevron className="w-4 h-4 shrink-0 opacity-50 mt-3" />
            </button>

            {/* Pulse Tap Counter */}
            <button
              dir={direction}
              onClick={() => setActiveTool({ category: 'medical', id: 'pulse' })}
              className="p-4 rounded-3xl border text-left rtl:text-right flex items-start justify-between transition-all hover:border-rose-500/50 hover:bg-rose-500/5 active:scale-[0.99] shadow-sm"
              style={{ backgroundColor: 'var(--app-card)', borderColor: 'var(--app-border)' }}
            >
              <div className="flex items-start gap-3.5">
                <span className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 shrink-0">
                  <Activity className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="text-sm font-bold" style={{ color: 'var(--app-text)' }}>
                    {t.pulseTitle}
                  </h4>
                  <p className="text-xs opacity-75 mt-0.5 line-clamp-2" style={{ color: 'var(--app-subtext)' }}>
                    {t.pulseDesc}
                  </p>
                </div>
              </div>
              <ForwardChevron className="w-4 h-4 shrink-0 opacity-50 mt-3" />
            </button>

            {/* Tourniquet Time Log */}
            <button
              dir={direction}
              onClick={() => setActiveTool({ category: 'medical', id: 'tourniquet' })}
              className="col-span-full p-4 rounded-3xl border text-left rtl:text-right flex items-start justify-between transition-all hover:border-rose-500/50 hover:bg-rose-500/5 active:scale-[0.99] shadow-sm"
              style={{ backgroundColor: 'var(--app-card)', borderColor: 'var(--app-border)' }}
            >
              <div className="flex items-start gap-3.5">
                <span className="p-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 shrink-0">
                  <Clock className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="text-sm font-bold" style={{ color: 'var(--app-text)' }}>
                    {t.tourniquetTitle}
                  </h4>
                  <p className="text-xs opacity-75 mt-0.5 line-clamp-2" style={{ color: 'var(--app-subtext)' }}>
                    {t.tourniquetDesc}
                  </p>
                </div>
              </div>
              <ForwardChevron className="w-4 h-4 shrink-0 opacity-50 mt-3" />
            </button>
          </div>
        </div>
      )}

      {/* --- Section 3: Mental Support Tools --- */}
      {(activeCategoryTab === 'mental' || false) && (
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="text-xs font-black uppercase tracking-wider text-indigo-400">
              {t.mentalCategory}
            </span>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            {/* 54321 Grounding */}
            <button
              dir={direction}
              onClick={() => setActiveTool({ category: 'mental', id: 'grounding-54321' })}
              className="p-4 rounded-3xl border text-left rtl:text-right flex items-start justify-between transition-all hover:border-indigo-500/50 hover:bg-indigo-500/5 active:scale-[0.99] shadow-sm"
              style={{ backgroundColor: 'var(--app-card)', borderColor: 'var(--app-border)' }}
            >
              <div className="flex items-start gap-3.5">
                <span className="p-3 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="text-sm font-bold" style={{ color: 'var(--app-text)' }}>
                    {t.groundingTitle}
                  </h4>
                  <p className="text-xs opacity-75 mt-0.5 line-clamp-2" style={{ color: 'var(--app-subtext)' }}>
                    {t.groundingDesc}
                  </p>
                </div>
              </div>
              <ForwardChevron className="w-4 h-4 shrink-0 opacity-50 mt-3" />
            </button>

            {/* Calm Box Breathing */}
            <button
              dir={direction}
              onClick={() => setActiveTool({ category: 'mental', id: 'calm-breathing' })}
              className="p-4 rounded-3xl border text-left rtl:text-right flex items-start justify-between transition-all hover:border-indigo-500/50 hover:bg-indigo-500/5 active:scale-[0.99] shadow-sm"
              style={{ backgroundColor: 'var(--app-card)', borderColor: 'var(--app-border)' }}
            >
              <div className="flex items-start gap-3.5">
                <span className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-400 shrink-0">
                  <Wind className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="text-sm font-bold" style={{ color: 'var(--app-text)' }}>
                    {t.calmBreathingTitle}
                  </h4>
                  <p className="text-xs opacity-75 mt-0.5 line-clamp-2" style={{ color: 'var(--app-subtext)' }}>
                    {t.calmBreathingDesc}
                  </p>
                </div>
              </div>
              <ForwardChevron className="w-4 h-4 shrink-0 opacity-50 mt-3" />
            </button>

            {/* Physiological Sigh */}
            <button
              dir={direction}
              onClick={() => setActiveTool({ category: 'mental', id: 'physiological-sigh' })}
              className="p-4 rounded-3xl border text-left rtl:text-right flex items-start justify-between transition-all hover:border-indigo-500/50 hover:bg-indigo-500/5 active:scale-[0.99] shadow-sm"
              style={{ backgroundColor: 'var(--app-card)', borderColor: 'var(--app-border)' }}
            >
              <div className="flex items-start gap-3.5">
                <span className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
                  <Activity className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="text-sm font-bold" style={{ color: 'var(--app-text)' }}>
                    {t.physioSighTitle}
                  </h4>
                  <p className="text-xs opacity-75 mt-0.5 line-clamp-2" style={{ color: 'var(--app-subtext)' }}>
                    {t.physioSighDesc}
                  </p>
                </div>
              </div>
              <ForwardChevron className="w-4 h-4 shrink-0 opacity-50 mt-3" />
            </button>

            {/* STOP Crisis Technique */}
            <button
              dir={direction}
              onClick={() => setActiveTool({ category: 'mental', id: 'stop-crisis' })}
              className="p-4 rounded-3xl border text-left rtl:text-right flex items-start justify-between transition-all hover:border-indigo-500/50 hover:bg-indigo-500/5 active:scale-[0.99] shadow-sm"
              style={{ backgroundColor: 'var(--app-card)', borderColor: 'var(--app-border)' }}
            >
              <div className="flex items-start gap-3.5">
                <span className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 shrink-0">
                  <Smile className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="text-sm font-bold" style={{ color: 'var(--app-text)' }}>
                    {t.stopCrisisTitle}
                  </h4>
                  <p className="text-xs opacity-75 mt-0.5 line-clamp-2" style={{ color: 'var(--app-subtext)' }}>
                    {t.stopCrisisDesc}
                  </p>
                </div>
              </div>
              <ForwardChevron className="w-4 h-4 shrink-0 opacity-50 mt-3" />
            </button>

            {/* Somatic & Butterfly Hug */}
            <button
              dir={direction}
              onClick={() => setActiveTool({ category: 'mental', id: 'somatic-butterfly' })}
              className="col-span-full p-4 rounded-3xl border text-left rtl:text-right flex items-start justify-between transition-all hover:border-indigo-500/50 hover:bg-indigo-500/5 active:scale-[0.99] shadow-sm"
              style={{ backgroundColor: 'var(--app-card)', borderColor: 'var(--app-border)' }}
            >
              <div className="flex items-start gap-3.5">
                <span className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400 shrink-0">
                  <Hand className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="text-sm font-bold" style={{ color: 'var(--app-text)' }}>
                    {t.somaticButterflyTitle}
                  </h4>
                  <p className="text-xs opacity-75 mt-0.5 line-clamp-2" style={{ color: 'var(--app-subtext)' }}>
                    {t.somaticButterflyDesc}
                  </p>
                </div>
              </div>
              <ForwardChevron className="w-4 h-4 shrink-0 opacity-50 mt-3" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
