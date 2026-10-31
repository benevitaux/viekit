import React, { useState, useMemo } from 'react';
import { Search, X, BookOpen, Wrench, ShieldCheck, Heart, Compass, PhoneCall } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SAMPLE_GUIDES } from '../data/guides';
import { ActiveTool, NavTab } from '../types';

interface SearchResultItem {
  id: string;
  title: string;
  category: string;
  snippet: string;
  type: 'tool' | 'guide' | 'checklist' | 'emergency';
  action: () => void;
  icon: React.ComponentType<{ className?: string }>;
}

export const SearchModal: React.FC = () => {
  const { isSearchOpen, setIsSearchOpen, setActiveTab, setActiveTool, country, t } = useApp();
  const [query, setQuery] = useState('');

  const allItems: SearchResultItem[] = useMemo(() => {
    const list: SearchResultItem[] = [
      // Survival Tools
      {
        id: 'tool-emergency-numbers',
        title: t.emergencyNumbersTitle,
        category: t.survivalCategory,
        snippet: `Worldwide emergency dispatch directory (${country.name}: ${country.emergency.general})`,
        type: 'tool',
        icon: PhoneCall,
        action: () => {
          setActiveTab('tools');
          setActiveTool({ category: 'survival', id: 'emergency-numbers' });
          setIsSearchOpen(false);
        },
      },
      {
        id: 'tool-flashlight',
        title: t.flashlightTitle,
        category: t.survivalCategory,
        snippet: 'High-intensity white flashlight, night vision red beam, and SOS strobe',
        type: 'tool',
        icon: Wrench,
        action: () => {
          setActiveTab('tools');
          setActiveTool({ category: 'survival', id: 'flashlight' });
          setIsSearchOpen(false);
        },
      },
      {
        id: 'tool-whistle',
        title: t.whistleTitle,
        category: t.survivalCategory,
        snippet: 'Acoustic pea whistle audio synthesizer, loud distress siren, and Morse audio',
        type: 'tool',
        icon: Wrench,
        action: () => {
          setActiveTab('tools');
          setActiveTool({ category: 'survival', id: 'whistle' });
          setIsSearchOpen(false);
        },
      },
      {
        id: 'tool-compass',
        title: t.compassTitle,
        category: t.survivalCategory,
        snippet: 'Digital magnetic orientation compass, cardinal bearings, and azimuth degree reading',
        type: 'tool',
        icon: Compass,
        action: () => {
          setActiveTab('tools');
          setActiveTool({ category: 'survival', id: 'compass' });
          setIsSearchOpen(false);
        },
      },
      {
        id: 'tool-location',
        title: t.locationTitle,
        category: t.survivalCategory,
        snippet: 'Precise GPS latitude/longitude, altitude, accuracy radius, and emergency text copy',
        type: 'tool',
        icon: Wrench,
        action: () => {
          setActiveTab('tools');
          setActiveTool({ category: 'survival', id: 'location' });
          setIsSearchOpen(false);
        },
      },
      {
        id: 'tool-water-ors',
        title: t.waterOrsTitle,
        category: t.survivalCategory,
        snippet: 'WHO Oral Rehydration Salt ratio calculator, bleach drops dosing, and boiling times',
        type: 'tool',
        icon: Wrench,
        action: () => {
          setActiveTab('tools');
          setActiveTool({ category: 'survival', id: 'water-ors' });
          setIsSearchOpen(false);
        },
      },

      // Medical Tools
      {
        id: 'tool-cpr',
        title: t.cprTitle,
        category: t.medicalCategory,
        snippet: '110 BPM metronome with visual pulsing heart, 30:2 compression counter, adult/child mode',
        type: 'tool',
        icon: Heart,
        action: () => {
          setActiveTab('tools');
          setActiveTool({ category: 'medical', id: 'cpr' });
          setIsSearchOpen(false);
        },
      },
      {
        id: 'tool-pulse',
        title: t.pulseTitle,
        category: t.medicalCategory,
        snippet: 'Tap-to-measure heart rate BPM tracker with cardiac zone classifications',
        type: 'tool',
        icon: Heart,
        action: () => {
          setActiveTab('tools');
          setActiveTool({ category: 'medical', id: 'pulse' });
          setIsSearchOpen(false);
        },
      },
      {
        id: 'tool-tourniquet',
        title: t.tourniquetTitle,
        category: t.medicalCategory,
        snippet: 'Timestamp recording for arterial limb hemorrhage control and elapsed minutes alerts',
        type: 'tool',
        icon: Heart,
        action: () => {
          setActiveTab('tools');
          setActiveTool({ category: 'medical', id: 'tourniquet' });
          setIsSearchOpen(false);
        },
      },

      // Mental Support
      {
        id: 'tool-grounding',
        title: t.groundingTitle,
        category: t.mentalCategory,
        snippet: '5-4-3-2-1 sensory grounding exercise to overcome shock, hyperventilation, and panic',
        type: 'tool',
        icon: Heart,
        action: () => {
          setActiveTab('tools');
          setActiveTool({ category: 'mental', id: 'grounding-54321' });
          setIsSearchOpen(false);
        },
      },
      {
        id: 'tool-calm-breathing',
        title: t.calmBreathingTitle,
        category: t.mentalCategory,
        snippet: 'Box breathing (4-4-4-4) with expanding visual circle to reduce autonomic arousal',
        type: 'tool',
        icon: Heart,
        action: () => {
          setActiveTab('tools');
          setActiveTool({ category: 'mental', id: 'calm-breathing' });
          setIsSearchOpen(false);
        },
      },
      {
        id: 'tool-physio-sigh',
        title: t.physioSighTitle,
        category: t.mentalCategory,
        snippet: 'Fastest biological reset: double inhalation through nose followed by long slow exhale',
        type: 'tool',
        icon: Heart,
        action: () => {
          setActiveTab('tools');
          setActiveTool({ category: 'mental', id: 'physiological-sigh' });
          setIsSearchOpen(false);
        },
      },
      {
        id: 'tool-stop-crisis',
        title: t.stopCrisisTitle,
        category: t.mentalCategory,
        snippet: 'Stop, Take a breath, Observe sensations, Proceed mindfully during emergency events',
        type: 'tool',
        icon: Heart,
        action: () => {
          setActiveTab('tools');
          setActiveTool({ category: 'mental', id: 'stop-crisis' });
          setIsSearchOpen(false);
        },
      },
      {
        id: 'tool-somatic-butterfly',
        title: t.somaticButterflyTitle,
        category: t.mentalCategory,
        snippet: 'Bilateral chest tapping stimulation to soothe acute emotional distress and shock',
        type: 'tool',
        icon: Heart,
        action: () => {
          setActiveTab('tools');
          setActiveTool({ category: 'mental', id: 'somatic-butterfly' });
          setIsSearchOpen(false);
        },
      },

      // Checklists & Preparation
      {
        id: 'prep-family-plan',
        title: t.familyPlanTitle,
        category: t.tabPrepare,
        snippet: 'Meeting points, out-of-area contact numbers, rally point, and evacuation notes',
        type: 'checklist',
        icon: ShieldCheck,
        action: () => {
          setActiveTab('prepare');
          setIsSearchOpen(false);
        },
      },
      {
        id: 'prep-checklists',
        title: t.checklistsTitle,
        category: t.tabPrepare,
        snippet: '72-Hour Survival Kit, Bug-Out Bag (Go-Bag), and Car Emergency Kit checklists',
        type: 'checklist',
        icon: ShieldCheck,
        action: () => {
          setActiveTab('prepare');
          setIsSearchOpen(false);
        },
      },

      // Guides
      ...SAMPLE_GUIDES.map((g) => ({
        id: `guide-${g.id}`,
        title: g.title,
        category: t.tabGuides,
        snippet: `${g.summary} (${g.steps.length} steps, DOs and DON'Ts)`,
        type: 'guide' as const,
        icon: BookOpen,
        action: () => {
          setActiveTab('guides');
          setIsSearchOpen(false);
        },
      })),
    ];

    return list;
  }, [country, t, setActiveTab, setActiveTool, setIsSearchOpen]);

  const filteredItems = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allItems.slice(0, 8); // show initial recommendations
    return allItems.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.snippet.toLowerCase().includes(q)
    );
  }, [allItems, query]);

  if (!isSearchOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-md overflow-y-auto">
      <div
        className="w-full max-w-xl rounded-3xl border shadow-2xl p-4 sm:p-5 mt-4 sm:mt-12 overflow-hidden transition-all"
        style={{
          backgroundColor: 'var(--app-card)',
          borderColor: 'var(--app-border)',
          color: 'var(--app-text)',
        }}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-2.5 pb-3 border-b" style={{ borderColor: 'var(--app-border)' }}>
          <Search className="w-5 h-5 shrink-0" style={{ color: 'var(--app-accent-text)' }} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t.searchPlaceholder}
            autoFocus
            className="flex-1 bg-transparent text-sm sm:text-base outline-none font-medium placeholder:opacity-50"
            style={{ color: 'var(--app-text)' }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full opacity-60 hover:opacity-100"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="px-2.5 py-1 rounded-xl text-xs font-semibold border opacity-80 hover:opacity-100 active:scale-95 transition-all"
            style={{ borderColor: 'var(--app-border)' }}
          >
            {t.close}
          </button>
        </div>

        {/* Results List */}
        <div className="mt-3 space-y-2 max-h-[60vh] overflow-y-auto pr-1">
          {filteredItems.length === 0 ? (
            <div className="py-8 text-center text-sm opacity-60">
              {t.searchNoResults}
            </div>
          ) : (
            filteredItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={item.action}
                  className="w-full text-left p-3 rounded-2xl border transition-all hover:opacity-90 flex items-start gap-3 active:scale-[0.99]"
                  style={{
                    backgroundColor: 'var(--app-bg)',
                    borderColor: 'var(--app-border)',
                  }}
                >
                  <span
                    className="p-2.5 rounded-xl border shrink-0 mt-0.5"
                    style={{
                      backgroundColor: 'var(--app-accent-light)',
                      borderColor: 'var(--app-accent-border)',
                      color: 'var(--app-accent-text)',
                    }}
                  >
                    <Icon className="w-4 h-4" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-bold truncate" style={{ color: 'var(--app-text)' }}>
                        {item.title}
                      </h4>
                      <span
                        className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border shrink-0"
                        style={{
                          backgroundColor: 'var(--app-accent-light)',
                          borderColor: 'var(--app-accent-border)',
                          color: 'var(--app-accent-text)',
                        }}
                      >
                        {item.category}
                      </span>
                    </div>
                    <p className="text-xs mt-1 line-clamp-2" style={{ color: 'var(--app-subtext)' }}>
                      {item.snippet}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
