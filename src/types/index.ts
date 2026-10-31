/**
 * VieKit - Types and Data Models
 */

export type LanguageCode =
  | 'en' // English
  | 'fr' // French
  | 'es' // Spanish
  | 'de' // German
  | 'pt' // Portuguese
  | 'tr' // Turkish
  | 'ru' // Russian
  | 'uk' // Ukrainian
  | 'zh' // Chinese (Simplified)
  | 'ar' // Arabic (RTL)
  | 'fa' // Persian (RTL)
  | 'he'; // Hebrew (RTL)

export type Direction = 'ltr' | 'rtl';

export type NavTab = 'home' | 'guides' | 'tools' | 'prepare' | 'settings';

export type ToolCategory = 'survival' | 'medical' | 'mental';

export type SurvivalToolId =
  | 'emergency-numbers'
  | 'flashlight'
  | 'whistle'
  | 'compass'
  | 'location'
  | 'water-ors';

export type MedicalToolId = 'cpr' | 'pulse' | 'tourniquet';

export type MentalToolId =
  | 'grounding-54321'
  | 'calm-breathing'
  | 'physiological-sigh'
  | 'stop-crisis'
  | 'somatic-butterfly';

export type ActiveTool =
  | { category: 'survival'; id: SurvivalToolId }
  | { category: 'medical'; id: MedicalToolId }
  | { category: 'mental'; id: MentalToolId }
  | null;

export interface CountryInfo {
  code: string;
  name: string; // English name
  nativeName: string; // Native name
  dialCode: string;
  emergency: {
    police: string;
    ambulance: string;
    fire: string;
    general: string;
  };
  notes?: string;
}

export interface GuideStep {
  title: string;
  instruction: string;
  detail?: string;
  warning?: string;
}

export interface Guide {
  id: string;
  title: string;
  category: 'first-aid' | 'disaster' | 'survival' | 'safety';
  icon: string;
  summary: string;
  priority: 'critical' | 'high' | 'medium';
  steps: GuideStep[];
  dos: string[];
  donts: string[];
  equipmentNeeded?: string[];
}

export interface FamilyPlan {
  meetingPoint1: string;
  meetingPoint2: string;
  outOfAreaContact: string;
  rallyPoint: string;
  notes: string;
  lastUpdated?: string;
}

export interface EmergencyContact {
  id: string;
  name: string;
  relationship: string;
  phone: string;
  bloodType?: string;
  medicalNotes?: string;
}

export interface ReserveItem {
  id: string;
  name: string;
  category: 'water' | 'food' | 'medical' | 'power' | 'gear' | 'tools' | 'hygiene' | 'other';
  amount?: string;
  quantity?: number;
  unit?: string;
  storageDate?: string;
  expiryDate?: string;
  location?: string;
  notes?: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
  category?: string;
}

export interface TourniquetRecord {
  id: string;
  timestamp: number;
  limb: 'Right Arm' | 'Left Arm' | 'Right Leg' | 'Left Leg';
  appliedBy: string;
  notes: string;
}

export type ThemeMode = 'dark' | 'light' | 'black';
export type AccentColor = 'green' | 'red' | 'blue' | 'amber' | 'cyan';
