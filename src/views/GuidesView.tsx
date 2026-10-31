import React, { useState } from 'react';
import {
  BookOpen,
  ChevronRight,
  ChevronLeft,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  X,
  Droplets,
  Activity,
  ThermometerSnowflake,
  Shield,
  Layers,
} from 'lucide-react';
import { SAMPLE_GUIDES } from '../data/guides';
import { Guide } from '../types';
import { useApp } from '../context/AppContext';

export const GuidesView: React.FC = () => {
  const { t, direction } = useApp();
  const ChevronIcon = direction === 'rtl' ? ChevronLeft : ChevronRight;
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: t.guideCatAll },
    { id: 'first-aid', label: t.guideCatFirstAid },
    { id: 'disaster', label: t.guideCatDisaster },
    { id: 'survival', label: t.guideCatSurvival },
  ];

  const filteredGuides = SAMPLE_GUIDES.filter((g) => {
    if (filterCategory === 'all') return true;
    return g.category === filterCategory;
  });

  return (
    <div className="space-y-5 pb-24 max-w-4xl mx-auto px-4 pt-4">
      {/* Header */}
      <div>
        <h2 className="text-xl font-black tracking-tight" style={{ color: 'var(--app-text)' }}>
          {t.tabGuides}
        </h2>
        <p className="text-xs opacity-75 mt-0.5" style={{ color: 'var(--app-subtext)' }}>
          {t.guidesSubtitle}
        </p>
      </div>

      {/* Filter Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setFilterCategory(c.id)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all active:scale-95 ${
              filterCategory === c.id
                ? 'shadow'
                : 'border opacity-70 hover:opacity-100'
            }`}
            style={{
              backgroundColor: filterCategory === c.id ? 'var(--app-accent)' : 'var(--app-card)',
              borderColor: filterCategory === c.id ? 'var(--app-accent)' : 'var(--app-border)',
              color: filterCategory === c.id ? '#ffffff' : 'var(--app-text)',
            }}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Guides Grid */}
      <div className="space-y-3">
        {filteredGuides.map((guide) => (
          <button
            key={guide.id}
            onClick={() => setSelectedGuide(guide)}
            className="w-full p-4 rounded-3xl border text-left flex items-start justify-between transition-all hover:opacity-90 active:scale-[0.99] shadow-sm"
            style={{
              backgroundColor: 'var(--app-card)',
              borderColor: 'var(--app-border)',
            }}
          >
            <div className="flex items-start gap-3.5">
              <span
                className={`p-3 rounded-2xl border shrink-0 mt-0.5 ${
                  guide.priority === 'critical'
                    ? 'bg-red-500/10 border-red-500/30 text-red-400'
                    : ''
                }`}
                style={
                  guide.priority !== 'critical'
                    ? {
                        backgroundColor: 'var(--app-accent-light)',
                        borderColor: 'var(--app-accent-border)',
                        color: 'var(--app-accent-text)',
                      }
                    : undefined
                }
              >
                {guide.id === 'severe-bleeding' ? (
                  <Droplets className="w-5 h-5" />
                ) : guide.id === 'choking-heimlich' ? (
                  <Activity className="w-5 h-5" />
                ) : guide.id === 'hypothermia-care' ? (
                  <ThermometerSnowflake className="w-5 h-5" />
                ) : (
                  <ShieldAlert className="w-5 h-5" />
                )}
              </span>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="text-sm sm:text-base font-extrabold truncate" style={{ color: 'var(--app-text)' }}>
                    {guide.title}
                  </h3>
                  {guide.priority === 'critical' && (
                    <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-red-600/20 text-red-400 border border-red-500/30 shrink-0">
                      CRITICAL
                    </span>
                  )}
                </div>

                <p className="text-xs mt-1 line-clamp-2 leading-relaxed" style={{ color: 'var(--app-subtext)' }}>
                  {guide.summary}
                </p>

                <div className="mt-2 flex items-center gap-3 text-[11px] font-medium" style={{ color: 'var(--app-subtext)' }}>
                  <span className="flex items-center gap-1">
                    <Layers className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{guide.steps.length} {t.stepsCount}</span>
                  </span>
                  <span>•</span>
                  <span>{t.dosDontsIncluded}</span>
                </div>
              </div>
            </div>

            <ChevronIcon className="w-4 h-4 shrink-0 opacity-50 mt-3" />
          </button>
        ))}
      </div>

      {/* Detail Modal for Selected Guide */}
      {selectedGuide && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div
            className="w-full max-w-2xl rounded-3xl border shadow-2xl p-5 sm:p-7 my-auto max-h-[90vh] overflow-y-auto"
            style={{
              backgroundColor: 'var(--app-card)',
              borderColor: 'var(--app-border)',
              color: 'var(--app-text)',
            }}
          >
            {/* Header */}
            <div className="flex items-start justify-between pb-4 border-b" style={{ borderColor: 'var(--app-border)' }}>
              <div>
                <span className="text-[11px] uppercase font-black px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  {selectedGuide.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-black mt-2 leading-tight" style={{ color: 'var(--app-text)' }}>
                  {selectedGuide.title}
                </h3>
                <p className="text-xs opacity-75 mt-1" style={{ color: 'var(--app-subtext)' }}>
                  {selectedGuide.summary}
                </p>
              </div>

              <button
                onClick={() => setSelectedGuide(null)}
                className="p-2 rounded-xl border opacity-75 hover:opacity-100 active:scale-95 transition-all shrink-0 ml-2"
                style={{ borderColor: 'var(--app-border)' }}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Equipment Needed */}
            {selectedGuide.equipmentNeeded && selectedGuide.equipmentNeeded.length > 0 && (
              <div
                className="my-4 p-3.5 rounded-2xl border text-xs"
                style={{ backgroundColor: 'var(--app-bg)', borderColor: 'var(--app-border)' }}
              >
                <div className="font-bold text-emerald-400 mb-1.5 uppercase tracking-wide text-[11px]">
                  {t.recommendedEquipment}
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {selectedGuide.equipmentNeeded.map((eq, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-slate-800/60 border border-slate-700 font-medium"
                    >
                      {eq}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Step-by-Step Instructions */}
            <div className="space-y-4 my-5">
              <h4 className="text-xs font-black uppercase tracking-wider text-emerald-400">
                {t.actionProtocol} ({selectedGuide.steps.length} {t.stepsCount})
              </h4>

              {selectedGuide.steps.map((st, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl border"
                  style={{ backgroundColor: 'var(--app-bg)', borderColor: 'var(--app-border)' }}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-emerald-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                      {idx + 1}
                    </span>
                    <h5 className="font-extrabold text-sm" style={{ color: 'var(--app-text)' }}>
                      {st.title}
                    </h5>
                  </div>

                  <p className="text-xs mt-2 leading-relaxed font-medium" style={{ color: 'var(--app-text)' }}>
                    {st.instruction}
                  </p>

                  {st.detail && (
                    <p className="text-[11px] opacity-75 mt-1.5" style={{ color: 'var(--app-subtext)' }}>
                      {st.detail}
                    </p>
                  )}

                  {st.warning && (
                    <div className="mt-2.5 p-2.5 rounded-xl bg-red-950/40 border border-red-900/50 text-[11px] text-red-200 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                      <span>{st.warning}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Side-by-Side DOs & DON'Ts */}
            <div className="grid sm:grid-cols-2 gap-3 pt-3 border-t" style={{ borderColor: 'var(--app-border)' }}>
              {/* DOs */}
              <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-900/40">
                <div className="flex items-center gap-2 font-black text-xs text-emerald-400 uppercase tracking-wide mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{t.doBestPractices}</span>
                </div>
                <ul className="space-y-2 text-xs text-emerald-200/90 leading-relaxed">
                  {selectedGuide.dos.map((d, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{d}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* DON'Ts */}
              <div className="p-4 rounded-2xl bg-red-950/20 border border-red-900/40">
                <div className="flex items-center gap-2 font-black text-xs text-red-400 uppercase tracking-wide mb-2">
                  <XCircle className="w-4 h-4 text-red-400" />
                  <span>{t.dontDangerousMistakes}</span>
                </div>
                <ul className="space-y-2 text-xs text-red-200/90 leading-relaxed">
                  {selectedGuide.donts.map((dn, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-red-400 font-bold">•</span>
                      <span>{dn}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Bottom Dismiss */}
            <div className="mt-6 pt-3 text-center">
              <button
                onClick={() => setSelectedGuide(null)}
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs uppercase tracking-wider active:scale-95 transition-all shadow"
                style={{ backgroundColor: 'var(--app-accent)' }}
              >
                {t.close}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
