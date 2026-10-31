import React, { createContext, useContext, useEffect, useState } from 'react';
import { UN_COUNTRIES } from '../data/countries';
import { SUPPORTED_LANGUAGES, TRANSLATIONS } from '../data/languages';
import { DEFAULT_72H_CHECKLIST, DEFAULT_CAR_CHECKLIST, DEFAULT_GOBAG_CHECKLIST } from '../data/checklists';
import {
  AccentColor,
  ActiveTool,
  ChecklistItem,
  CountryInfo,
  Direction,
  EmergencyContact,
  FamilyPlan,
  LanguageCode,
  NavTab,
  ReserveItem,
  ThemeMode,
  TourniquetRecord,
} from '../types';

export interface AccentPalette {
  primary: string;
  text: string;
  hover: string;
  light: string;
  border: string;
}

export const ACCENT_PALETTES: Record<AccentColor, AccentPalette> = {
  green: {
    primary: '#10b981',
    text: '#34d399',
    hover: '#059669',
    light: 'rgba(16, 185, 129, 0.15)',
    border: 'rgba(16, 185, 129, 0.35)',
  },
  red: {
    primary: '#f43f5e',
    text: '#fb7185',
    hover: '#e11d48',
    light: 'rgba(244, 63, 94, 0.15)',
    border: 'rgba(244, 63, 94, 0.35)',
  },
  blue: {
    primary: '#0ea5e9',
    text: '#38bdf8',
    hover: '#0284c7',
    light: 'rgba(14, 165, 233, 0.15)',
    border: 'rgba(14, 165, 233, 0.35)',
  },
  amber: {
    primary: '#f59e0b',
    text: '#fbbf24',
    hover: '#d97706',
    light: 'rgba(245, 158, 11, 0.15)',
    border: 'rgba(245, 158, 11, 0.35)',
  },
  cyan: {
    primary: '#06b6d4',
    text: '#22d3ee',
    hover: '#0891b2',
    light: 'rgba(6, 182, 212, 0.15)',
    border: 'rgba(6, 182, 212, 0.35)',
  },
};

interface AppContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  direction: Direction;
  t: (typeof TRANSLATIONS)['en'];
  title: string;

  country: CountryInfo;
  setCountryCode: (code: string) => void;

  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;
  accent: AccentColor;
  setAccent: (accent: AccentColor) => void;
  palette: AccentPalette;

  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;

  activeTool: ActiveTool;
  setActiveTool: (tool: ActiveTool) => void;

  isSosOpen: boolean;
  setIsSosOpen: (open: boolean) => void;

  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  // Persistent user data
  familyPlan: FamilyPlan;
  setFamilyPlan: React.Dispatch<React.SetStateAction<FamilyPlan>>;

  contacts: EmergencyContact[];
  setContacts: React.Dispatch<React.SetStateAction<EmergencyContact[]>>;

  reserves: ReserveItem[];
  setReserves: React.Dispatch<React.SetStateAction<ReserveItem[]>>;

  checklists: {
    kit72h: ChecklistItem[];
    goBag: ChecklistItem[];
    car: ChecklistItem[];
  };
  toggleChecklistItem: (listName: 'kit72h' | 'goBag' | 'car', id: string) => void;
  addChecklistItem: (listName: 'kit72h' | 'goBag' | 'car', text: string, category?: string) => void;

  tourniquetLogs: TourniquetRecord[];
  addTourniquetLog: (record: Omit<TourniquetRecord, 'id'>) => void;
  removeTourniquetLog: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'viekit_v1_store';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load saved state or defaults
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_lang`);
      if (saved && SUPPORTED_LANGUAGES.some((l) => l.code === saved)) {
        return saved as LanguageCode;
      }
      // Detect browser language
      const navLang = navigator.language.slice(0, 2).toLowerCase();
      const match = SUPPORTED_LANGUAGES.find((l) => l.code === navLang);
      return match ? match.code : 'en';
    } catch {
      return 'en';
    }
  });

  const [countryCode, setCountryCodeState] = useState<string>(() => {
    try {
      return localStorage.getItem(`${LOCAL_STORAGE_KEY}_country`) || 'US';
    } catch {
      return 'US';
    }
  });

  const [theme, setThemeState] = useState<ThemeMode>(() => {
    try {
      return (localStorage.getItem(`${LOCAL_STORAGE_KEY}_theme`) as ThemeMode) || 'dark';
    } catch {
      return 'dark';
    }
  });

  const [accent, setAccentState] = useState<AccentColor>(() => {
    try {
      return (localStorage.getItem(`${LOCAL_STORAGE_KEY}_accent`) as AccentColor) || 'green';
    } catch {
      return 'green';
    }
  });

  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [activeTool, setActiveTool] = useState<ActiveTool>(null);
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // User persistent data
  const [familyPlan, setFamilyPlan] = useState<FamilyPlan>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_family_plan`);
      return saved
        ? JSON.parse(saved)
        : {
            meetingPoint1: 'Home front porch / Neighborhood park entrance',
            meetingPoint2: 'Town Hall / Central Library plaza',
            outOfAreaContact: 'Uncle David (+1-555-0199)',
            rallyPoint: 'Community High School Gym (Evac Shelter)',
            notes: 'Gas shutoff wrench located by basement water heater.',
          };
    } catch {
      return {
        meetingPoint1: '',
        meetingPoint2: '',
        outOfAreaContact: '',
        rallyPoint: '',
        notes: '',
      };
    }
  });

  const [contacts, setContacts] = useState<EmergencyContact[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_contacts`);
      return saved
        ? JSON.parse(saved)
        : [
            { id: 'c1', name: 'Dr. Sarah Mitchell', relationship: 'Family Physician', phone: '555-0143', bloodType: 'O+' },
            { id: 'c2', name: 'Mark Wilson', relationship: 'Brother / Out of State', phone: '555-0182', bloodType: 'A+' },
          ];
    } catch {
      return [];
    }
  });

  const [reserves, setReserves] = useState<ReserveItem[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_reserves`);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed.map((item: ReserveItem) => ({
            ...item,
            storageDate: item.storageDate || '2026-10-31',
            expiryDate: item.expiryDate || '2027-05-01',
          }));
        }
      }
      return [
        {
          id: 'r1',
          name: 'New reserve item',
          category: 'water',
          amount: '20 L / 12 cans',
          storageDate: '2026-10-31',
          expiryDate: '2027-05-01',
          location: '',
        },
      ];
    } catch {
      return [];
    }
  });

  const [checklists, setChecklists] = useState<{
    kit72h: ChecklistItem[];
    goBag: ChecklistItem[];
    car: ChecklistItem[];
  }>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_checklists`);
      return saved
        ? JSON.parse(saved)
        : {
            kit72h: DEFAULT_72H_CHECKLIST,
            goBag: DEFAULT_GOBAG_CHECKLIST,
            car: DEFAULT_CAR_CHECKLIST,
          };
    } catch {
      return {
        kit72h: DEFAULT_72H_CHECKLIST,
        goBag: DEFAULT_GOBAG_CHECKLIST,
        car: DEFAULT_CAR_CHECKLIST,
      };
    }
  });

  const [tourniquetLogs, setTourniquetLogs] = useState<TourniquetRecord[]>(() => {
    try {
      const saved = localStorage.getItem(`${LOCAL_STORAGE_KEY}_tourniquets`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Current language meta and direction
  const langMeta = SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];
  const direction = langMeta.direction;
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;
  const title = langMeta.titleTransliteration;

  // Selected country
  const country = UN_COUNTRIES.find((c) => c.code === countryCode) || UN_COUNTRIES.find((c) => c.code === 'US') || UN_COUNTRIES[0];

  // Sync direction and lang to HTML root element
  useEffect(() => {
    document.documentElement.dir = direction;
    document.documentElement.lang = language;
  }, [direction, language]);

  // Sync theme to root class
  useEffect(() => {
    document.documentElement.classList.remove('theme-light', 'theme-dark', 'theme-black');
    document.documentElement.classList.add(`theme-${theme}`);
  }, [theme]);

  // Sync accent to root class and CSS variables
  useEffect(() => {
    const pal = ACCENT_PALETTES[accent] || ACCENT_PALETTES.green;
    document.documentElement.classList.remove(
      'accent-green',
      'accent-red',
      'accent-blue',
      'accent-amber',
      'accent-cyan'
    );
    document.documentElement.classList.add(`accent-${accent}`);

    document.documentElement.style.setProperty('--app-accent', pal.primary);
    document.documentElement.style.setProperty('--app-accent-text', pal.text);
    document.documentElement.style.setProperty('--app-accent-hover', pal.hover);
    document.documentElement.style.setProperty('--app-accent-light', pal.light);
    document.documentElement.style.setProperty('--app-accent-border', pal.border);
  }, [accent]);

  const palette = ACCENT_PALETTES[accent] || ACCENT_PALETTES.green;

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_lang`, language);
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_country`, countryCode);
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_theme`, theme);
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_accent`, accent);
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_family_plan`, JSON.stringify(familyPlan));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_contacts`, JSON.stringify(contacts));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_reserves`, JSON.stringify(reserves));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_checklists`, JSON.stringify(checklists));
      localStorage.setItem(`${LOCAL_STORAGE_KEY}_tourniquets`, JSON.stringify(tourniquetLogs));
    } catch {
      // LocalStorage quota or restricted mode fallback
    }
  }, [language, countryCode, theme, accent, familyPlan, contacts, reserves, checklists, tourniquetLogs]);

  const setLanguage = (lang: LanguageCode) => setLanguageState(lang);
  const setCountryCode = (code: string) => setCountryCodeState(code);
  const setTheme = (thm: ThemeMode) => setThemeState(thm);
  const setAccent = (acc: AccentColor) => setAccentState(acc);

  const toggleChecklistItem = (listName: 'kit72h' | 'goBag' | 'car', id: string) => {
    setChecklists((prev) => ({
      ...prev,
      [listName]: prev[listName].map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)),
    }));
  };

  const addChecklistItem = (listName: 'kit72h' | 'goBag' | 'car', text: string, category = 'General') => {
    const newItem: ChecklistItem = {
      id: `${listName}-${Date.now()}`,
      text,
      checked: false,
      category,
    };
    setChecklists((prev) => ({
      ...prev,
      [listName]: [newItem, ...prev[listName]],
    }));
  };

  const addTourniquetLog = (record: Omit<TourniquetRecord, 'id'>) => {
    const newRecord: TourniquetRecord = {
      ...record,
      id: `tq-${Date.now()}`,
    };
    setTourniquetLogs((prev) => [newRecord, ...prev]);
  };

  const removeTourniquetLog = (id: string) => {
    setTourniquetLogs((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        direction,
        t,
        title,
        country,
        setCountryCode,
        theme,
        setTheme,
        accent,
        setAccent,
        palette,
        activeTab,
        setActiveTab,
        activeTool,
        setActiveTool,
        isSosOpen,
        setIsSosOpen,
        isSearchOpen,
        setIsSearchOpen,
        familyPlan,
        setFamilyPlan,
        contacts,
        setContacts,
        reserves,
        setReserves,
        checklists,
        toggleChecklistItem,
        addChecklistItem,
        tourniquetLogs,
        addTourniquetLog,
        removeTourniquetLog,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
