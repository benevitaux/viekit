import React, { useState } from 'react';
import {
  ShieldCheck,
  Users,
  Phone,
  BookOpen,
  Package,
  CheckSquare,
  Plus,
  Trash2,
  Save,
  Check,
  Edit2,
  PhoneCall,
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
  Droplets,
  Utensils,
  HeartPulse,
  Zap,
  Wrench,
  RotateCw,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LIBRARY_ARTICLES } from '../data/checklists';
import { EmergencyContact, ReserveItem } from '../types';

export const PrepareView: React.FC = () => {
  const {
    familyPlan,
    setFamilyPlan,
    contacts,
    setContacts,
    reserves,
    setReserves,
    checklists,
    toggleChecklistItem,
    addChecklistItem,
    t,
    direction,
  } = useApp();

  const [activeSubTab, setActiveSubTab] = useState<'plan' | 'contacts' | 'library' | 'reserves' | 'checklists' | null>(null);

  const BackChevron = direction === 'rtl' ? ChevronRight : ChevronLeft;
  const ForwardChevron = direction === 'rtl' ? ChevronLeft : ChevronRight;

  // Family plan edit mode
  const [isEditingPlan, setIsEditingPlan] = useState(false);
  const [planForm, setPlanForm] = useState(familyPlan);

  // New Contact Modal / Form
  const [showAddContact, setShowAddContact] = useState(false);
  const [contactForm, setContactForm] = useState<Omit<EmergencyContact, 'id'>>({
    name: '',
    relationship: '',
    phone: '',
    bloodType: '',
    medicalNotes: '',
  });

  // Reserves & Storage Tracker State
  const [reserveFilter, setReserveFilter] = useState<'all' | 'water' | 'food' | 'medical' | 'power' | 'gear'>('all');
  const [expandedReserveId, setExpandedReserveId] = useState<string | null>(null);

  // Active checklist selector
  const [activeChecklistName, setActiveChecklistName] = useState<'kit72h' | 'goBag' | 'car'>('kit72h');
  const [newChecklistText, setNewChecklistText] = useState('');

  // Expandable Library Articles
  const [expandedArticleId, setExpandedArticleId] = useState<string | null>('morse-signals');

  // Save Family Plan
  const handleSavePlan = () => {
    setFamilyPlan(planForm);
    setIsEditingPlan(false);
  };

  // Add Contact
  const handleAddContact = () => {
    if (!contactForm.name.trim() || !contactForm.phone.trim()) return;
    const newContact: EmergencyContact = {
      ...contactForm,
      id: `c-${Date.now()}`,
    };
    setContacts((prev) => [newContact, ...prev]);
    setContactForm({ name: '', relationship: '', phone: '', bloodType: '', medicalNotes: '' });
    setShowAddContact(false);
  };

  // Delete Contact
  const handleDeleteContact = (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  // Reserves Handlers & Calculations
  const getDaysLeft = (expiryDateStr?: string) => {
    if (!expiryDateStr) return 182;
    const expiry = new Date(expiryDateStr);
    if (isNaN(expiry.getTime())) return 182;
    const today = new Date('2026-10-31');
    today.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getExpiryStatus = (expiryDateStr?: string) => {
    const days = getDaysLeft(expiryDateStr);
    if (days < 0) {
      return {
        status: 'replace',
        label: `Replace now (${Math.abs(days)}d ago)`,
        badgeBg: 'bg-[#250813]',
        badgeBorder: 'border-[#4b1027]',
        badgeText: 'text-[#f43f5e]',
      };
    }
    if (days <= 30) {
      return {
        status: 'rotate',
        label: `Rotate soon (${days}d left)`,
        badgeBg: 'bg-[#241a06]',
        badgeBorder: 'border-[#48340d]',
        badgeText: 'text-[#f59e0b]',
      };
    }
    return {
      status: 'fresh',
      label: `Fresh (${days}d left)`,
      badgeBg: 'bg-[#052317]',
      badgeBorder: 'border-[#0c442c]',
      badgeText: 'text-[#00e599]',
    };
  };

  const handleUpdateReserveField = (id: string, updates: Partial<ReserveItem>) => {
    setReserves((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const handleSetExpiryMonths = (id: string, baseDateStr: string | undefined, months: number) => {
    const base = baseDateStr ? new Date(baseDateStr) : new Date('2026-10-31');
    const d = isNaN(base.getTime()) ? new Date('2026-10-31') : new Date(base);
    d.setMonth(d.getMonth() + months);
    const nextStr = d.toISOString().split('T')[0];
    handleUpdateReserveField(id, { expiryDate: nextStr });
  };

  const handleRotatedToday = (id: string, monthsToAdd: number) => {
    const todayStr = '2026-10-31';
    const d = new Date('2026-10-31');
    d.setMonth(d.getMonth() + monthsToAdd);
    const nextStr = d.toISOString().split('T')[0];
    handleUpdateReserveField(id, { storageDate: todayStr, expiryDate: nextStr });
  };

  const handleAddNewReserve = () => {
    const todayStr = '2026-10-31';
    const d = new Date('2026-10-31');
    d.setMonth(d.getMonth() + 6);
    const expiryStr = d.toISOString().split('T')[0];
    const newId = `r-${Date.now()}`;
    const cat: ReserveItem['category'] =
      reserveFilter === 'all'
        ? 'water'
        : reserveFilter === 'gear'
        ? 'gear'
        : reserveFilter;
    const newItem: ReserveItem = {
      id: newId,
      name: 'New reserve item',
      category: cat,
      amount: '',
      storageDate: todayStr,
      expiryDate: expiryStr,
      location: '',
    };
    setReserves((prev) => [newItem, ...prev]);
    setExpandedReserveId(newId);
  };

  const handleDeleteReserve = (id: string) => {
    setReserves((prev) => prev.filter((r) => r.id !== id));
    if (expandedReserveId === id) {
      setExpandedReserveId(null);
    }
  };

  const getCategoryIconDetails = (cat: ReserveItem['category']) => {
    switch (cat) {
      case 'water':
        return { Icon: Droplets, color: 'text-cyan-400', bg: 'bg-[#0a2334]', border: 'border-[#0d4566]' };
      case 'food':
        return { Icon: Utensils, color: 'text-amber-400', bg: 'bg-[#291e0a]', border: 'border-[#523d14]' };
      case 'medical':
        return { Icon: HeartPulse, color: 'text-rose-400', bg: 'bg-[#2b0c18]', border: 'border-[#541830]' };
      case 'power':
        return { Icon: Zap, color: 'text-yellow-400', bg: 'bg-[#262108]', border: 'border-[#4d4210]' };
      case 'gear':
      case 'tools':
      case 'hygiene':
      default:
        return { Icon: Wrench, color: 'text-indigo-400', bg: 'bg-[#141b2e]', border: 'border-[#27355c]' };
    }
  };

  // Checklist calculations
  const activeList = checklists[activeChecklistName];
  const totalItems = activeList.length;
  const checkedItems = activeList.filter((i) => i.checked).length;
  const progressPct = totalItems > 0 ? Math.round((checkedItems / totalItems) * 100) : 0;

  const handleAddCustomChecklistItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChecklistText.trim()) return;
    addChecklistItem(activeChecklistName, newChecklistText.trim());
    setNewChecklistText('');
  };

  const currentModuleTitle =
    activeSubTab === 'plan'
      ? t.familyPlanTitle
      : activeSubTab === 'contacts'
      ? t.contactsTitle
      : activeSubTab === 'checklists'
      ? t.checklistsTitle
      : activeSubTab === 'reserves'
      ? t.reservesTitle
      : activeSubTab === 'library'
      ? t.libraryTitle
      : '';

  if (activeSubTab) {
    return (
      <div className="space-y-4 pb-24 max-w-4xl mx-auto px-4 pt-3">
        {/* Top Back Navigation Bar */}
        <div className="flex items-center justify-between pb-3 mb-2 border-b" style={{ borderColor: 'var(--app-border)' }}>
          <button
            onClick={() => setActiveSubTab(null)}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl border hover:opacity-100 active:scale-95 transition-all shadow-sm"
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
            {currentModuleTitle}
          </span>
        </div>

        {/* ========================================================= */}
        {/* 1. Family Emergency Plan                                  */}
        {/* ========================================================= */}
        {activeSubTab === 'plan' && (
        <div className="space-y-4">
          <div
            className="p-5 rounded-3xl border shadow-lg"
            style={{ backgroundColor: 'var(--app-card)', borderColor: 'var(--app-border)' }}
          >
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider" style={{ color: 'var(--app-accent-text)' }}>
                  {t.civilDefensePreparedness}
                </span>
                <h3 className="text-xl font-black mt-0.5" style={{ color: 'var(--app-text)' }}>
                  {t.familyPlanTitle}
                </h3>
              </div>
              <button
                onClick={() => {
                  if (isEditingPlan) {
                    handleSavePlan();
                  } else {
                    setPlanForm(familyPlan);
                    setIsEditingPlan(true);
                  }
                }}
                className="px-3.5 py-1.5 rounded-xl text-white text-xs font-bold flex items-center gap-1.5 active:scale-95 transition-all shadow"
                style={{ backgroundColor: 'var(--app-accent)' }}
              >
                {isEditingPlan ? <Save className="w-3.5 h-3.5" /> : <Edit2 className="w-3.5 h-3.5" />}
                <span>{isEditingPlan ? t.savePlan : t.editPlan}</span>
              </button>
            </div>

            <div className="space-y-3.5">
              {/* Meeting Point 1 */}
              <div
                className="p-3.5 rounded-2xl border"
                style={{ backgroundColor: 'var(--app-bg)', borderColor: 'var(--app-border)' }}
              >
                <label className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                  {t.meetingPoint1Label}
                </label>
                {isEditingPlan ? (
                  <input
                    type="text"
                    value={planForm.meetingPoint1}
                    onChange={(e) => setPlanForm({ ...planForm, meetingPoint1: e.target.value })}
                    className="w-full p-2 rounded-xl border text-xs outline-none font-medium"
                    style={{ backgroundColor: 'var(--app-card)', borderColor: 'var(--app-border)', color: 'var(--app-text)' }}
                  />
                ) : (
                  <p className="text-xs font-semibold" style={{ color: 'var(--app-text)' }}>
                    {familyPlan.meetingPoint1 || t.notSpecified}
                  </p>
                )}
              </div>

              {/* Meeting Point 2 */}
              <div
                className="p-3.5 rounded-2xl border"
                style={{ backgroundColor: 'var(--app-bg)', borderColor: 'var(--app-border)' }}
              >
                <label className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                  {t.meetingPoint2Label}
                </label>
                {isEditingPlan ? (
                  <input
                    type="text"
                    value={planForm.meetingPoint2}
                    onChange={(e) => setPlanForm({ ...planForm, meetingPoint2: e.target.value })}
                    className="w-full p-2 rounded-xl border text-xs outline-none font-medium"
                    style={{ backgroundColor: 'var(--app-card)', borderColor: 'var(--app-border)', color: 'var(--app-text)' }}
                  />
                ) : (
                  <p className="text-xs font-semibold" style={{ color: 'var(--app-text)' }}>
                    {familyPlan.meetingPoint2 || t.notSpecified}
                  </p>
                )}
              </div>

              {/* Out-of-Area Contact */}
              <div
                className="p-3.5 rounded-2xl border"
                style={{ backgroundColor: 'var(--app-bg)', borderColor: 'var(--app-border)' }}
              >
                <label className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                  {t.outOfAreaContactLabel}
                </label>
                {isEditingPlan ? (
                  <input
                    type="text"
                    value={planForm.outOfAreaContact}
                    onChange={(e) => setPlanForm({ ...planForm, outOfAreaContact: e.target.value })}
                    className="w-full p-2 rounded-xl border text-xs outline-none font-medium"
                    style={{ backgroundColor: 'var(--app-card)', borderColor: 'var(--app-border)', color: 'var(--app-text)' }}
                  />
                ) : (
                  <p className="text-xs font-semibold" style={{ color: 'var(--app-text)' }}>
                    {familyPlan.outOfAreaContact || t.notSpecified}
                  </p>
                )}
              </div>

              {/* Rally Point */}
              <div
                className="p-3.5 rounded-2xl border"
                style={{ backgroundColor: 'var(--app-bg)', borderColor: 'var(--app-border)' }}
              >
                <label className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                  {t.rallyPointLabel}
                </label>
                {isEditingPlan ? (
                  <input
                    type="text"
                    value={planForm.rallyPoint}
                    onChange={(e) => setPlanForm({ ...planForm, rallyPoint: e.target.value })}
                    className="w-full p-2 rounded-xl border text-xs outline-none font-medium"
                    style={{ backgroundColor: 'var(--app-card)', borderColor: 'var(--app-border)', color: 'var(--app-text)' }}
                  />
                ) : (
                  <p className="text-xs font-semibold" style={{ color: 'var(--app-text)' }}>
                    {familyPlan.rallyPoint || t.notSpecified}
                  </p>
                )}
              </div>

              {/* Notes */}
              <div
                className="p-3.5 rounded-2xl border"
                style={{ backgroundColor: 'var(--app-bg)', borderColor: 'var(--app-border)' }}
              >
                <label className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 block mb-1">
                  {t.notesLabel}
                </label>
                {isEditingPlan ? (
                  <textarea
                    rows={3}
                    value={planForm.notes}
                    onChange={(e) => setPlanForm({ ...planForm, notes: e.target.value })}
                    className="w-full p-2 rounded-xl border text-xs outline-none font-medium resize-none"
                    style={{ backgroundColor: 'var(--app-card)', borderColor: 'var(--app-border)', color: 'var(--app-text)' }}
                  />
                ) : (
                  <p className="text-xs font-semibold leading-relaxed" style={{ color: 'var(--app-text)' }}>
                    {familyPlan.notes || t.noneNoted}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. ICE Emergency Contacts                                 */}
      {/* ========================================================= */}
      {activeSubTab === 'contacts' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div>
              <h3 className="text-base font-extrabold" style={{ color: 'var(--app-text)' }}>
                {t.contactsTitle}
              </h3>
              <p className="text-xs opacity-75" style={{ color: 'var(--app-subtext)' }}>
                Direct one-tap dialing and SMS messaging for designated family & first responders.
              </p>
            </div>
            <button
              onClick={() => setShowAddContact(!showAddContact)}
              className="px-3 py-1.5 rounded-xl text-white text-xs font-bold flex items-center gap-1 active:scale-95 shadow"
              style={{ backgroundColor: 'var(--app-accent)' }}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{showAddContact ? t.cancel : t.add}</span>
            </button>
          </div>

          {/* Add Contact Form Drawer */}
          {showAddContact && (
            <div
              className="p-4 rounded-3xl border shadow-lg space-y-3"
              style={{ backgroundColor: 'var(--app-card)', borderColor: 'var(--app-border)' }}
            >
              <h4 className="text-xs font-black uppercase" style={{ color: 'var(--app-accent-text)' }}>{t.addNewContact}</h4>
              <div className="grid sm:grid-cols-2 gap-2.5">
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={contactForm.name}
                  onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                  className="p-2.5 rounded-xl border text-xs outline-none"
                  style={{ backgroundColor: 'var(--app-bg)', borderColor: 'var(--app-border)', color: 'var(--app-text)' }}
                />
                <input
                  type="text"
                  placeholder="Relationship (e.g. Spouse, Sister, Doctor)"
                  value={contactForm.relationship}
                  onChange={(e) => setContactForm({ ...contactForm, relationship: e.target.value })}
                  className="p-2.5 rounded-xl border text-xs outline-none"
                  style={{ backgroundColor: 'var(--app-bg)', borderColor: 'var(--app-border)', color: 'var(--app-text)' }}
                />
                <input
                  type="tel"
                  placeholder="Phone Number *"
                  value={contactForm.phone}
                  onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                  className="p-2.5 rounded-xl border text-xs outline-none"
                  style={{ backgroundColor: 'var(--app-bg)', borderColor: 'var(--app-border)', color: 'var(--app-text)' }}
                />
                <input
                  type="text"
                  placeholder="Blood Type (Optional, e.g. O+)"
                  value={contactForm.bloodType}
                  onChange={(e) => setContactForm({ ...contactForm, bloodType: e.target.value })}
                  className="p-2.5 rounded-xl border text-xs outline-none"
                  style={{ backgroundColor: 'var(--app-bg)', borderColor: 'var(--app-border)', color: 'var(--app-text)' }}
                />
              </div>
              <button
                onClick={handleAddContact}
                className="w-full py-2.5 rounded-xl text-white font-bold text-xs uppercase tracking-wider active:scale-95"
                style={{ backgroundColor: 'var(--app-accent)' }}
              >
                {t.saveContact}
              </button>
            </div>
          )}

          {/* Contact Cards List */}
          <div className="space-y-2.5">
            {contacts.map((contact) => (
              <div
                key={contact.id}
                className="p-4 rounded-3xl border flex items-center justify-between shadow-sm transition-all"
                style={{ backgroundColor: 'var(--app-card)', borderColor: 'var(--app-border)' }}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold" style={{ color: 'var(--app-text)' }}>
                      {contact.name}
                    </h4>
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full border font-semibold"
                      style={{
                        backgroundColor: 'var(--app-accent-light)',
                        borderColor: 'var(--app-accent-border)',
                        color: 'var(--app-accent-text)',
                      }}
                    >
                      {contact.relationship}
                    </span>
                    {contact.bloodType && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 font-bold">
                        {contact.bloodType}
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-mono opacity-80 mt-1" style={{ color: 'var(--app-subtext)' }}>
                    {contact.phone}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={`tel:${contact.phone}`}
                    className="p-2.5 rounded-xl border active:scale-95 transition-all"
                    style={{
                      backgroundColor: 'var(--app-accent-light)',
                      borderColor: 'var(--app-accent-border)',
                      color: 'var(--app-accent-text)',
                    }}
                  >
                    <PhoneCall className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => handleDeleteContact(contact.id)}
                    className="p-2.5 rounded-xl border opacity-50 hover:opacity-100 text-red-400 active:scale-95"
                    style={{ borderColor: 'var(--app-border)' }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. Checklists (72h, Go-Bag, Car)                          */}
      {/* ========================================================= */}
      {activeSubTab === 'checklists' && (
        <div className="space-y-4">
          {/* Sub-selector for Checklists */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'kit72h', label: t.checklist72h },
              { id: 'goBag', label: t.checklistGoBag },
              { id: 'car', label: t.checklistCar },
            ].map((chk) => (
              <button
                key={chk.id}
                onClick={() => setActiveChecklistName(chk.id as typeof activeChecklistName)}
                className={`py-2 px-1.5 rounded-2xl text-[11px] font-bold text-center border transition-all active:scale-95 truncate ${
                  activeChecklistName === chk.id
                    ? 'shadow text-white'
                    : 'opacity-70 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: activeChecklistName === chk.id ? 'var(--app-accent)' : 'var(--app-card)',
                  borderColor: activeChecklistName === chk.id ? 'var(--app-accent)' : 'var(--app-border)',
                  color: activeChecklistName === chk.id ? '#ffffff' : 'var(--app-text)',
                }}
              >
                {chk.label}
              </button>
            ))}
          </div>

          {/* Progress Header */}
          <div
            className="p-4 rounded-3xl border shadow-sm"
            style={{ backgroundColor: 'var(--app-card)', borderColor: 'var(--app-border)' }}
          >
            <div className="flex items-center justify-between mb-2 text-xs">
              <span className="font-bold" style={{ color: 'var(--app-text)' }}>
                {t.checklistPreparedness}
              </span>
              <span className="font-mono font-bold" style={{ color: 'var(--app-accent-text)' }}>
                {checkedItems} of {totalItems} items ({progressPct}%)
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2.5 rounded-full bg-slate-800/80 overflow-hidden">
              <div
                className="h-full transition-all duration-300"
                style={{ width: `${progressPct}%`, backgroundColor: 'var(--app-accent)' }}
              />
            </div>
          </div>

          {/* Checklist Items */}
          <div className="space-y-2">
            {activeList.map((item) => (
              <button
                key={item.id}
                onClick={() => toggleChecklistItem(activeChecklistName, item.id)}
                className={`w-full p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all active:scale-[0.99] ${
                  item.checked ? 'opacity-55' : 'hover:opacity-90'
                }`}
                style={{
                  backgroundColor: 'var(--app-card)',
                  borderColor: 'var(--app-border)',
                }}
              >
                <div
                  className="w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 mt-0.5 transition-colors text-white"
                  style={{
                    backgroundColor: item.checked ? 'var(--app-accent)' : 'transparent',
                    borderColor: item.checked ? 'var(--app-accent)' : 'var(--app-subtext)',
                  }}
                >
                  {item.checked && <Check className="w-3.5 h-3.5 stroke-[3px]" />}
                </div>

                <div className="flex-1">
                  <span
                    className={`text-xs font-semibold leading-relaxed ${
                      item.checked ? 'line-through' : ''
                    }`}
                    style={{ color: 'var(--app-text)' }}
                  >
                    {item.text}
                  </span>
                  {item.category && (
                    <span className="text-[10px] uppercase font-bold block mt-0.5" style={{ color: 'var(--app-accent-text)' }}>
                      {item.category}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Add custom item form */}
          <form onSubmit={handleAddCustomChecklistItem} className="flex gap-2 pt-2">
            <input
              type="text"
              value={newChecklistText}
              onChange={(e) => setNewChecklistText(e.target.value)}
              placeholder="Add custom item to this checklist..."
              className="flex-1 p-3 rounded-2xl border text-xs outline-none font-medium"
              style={{
                backgroundColor: 'var(--app-card)',
                borderColor: 'var(--app-border)',
                color: 'var(--app-text)',
              }}
            />
            <button
              type="submit"
              className="px-4 rounded-2xl text-white font-bold text-xs uppercase active:scale-95"
              style={{ backgroundColor: 'var(--app-accent)' }}
            >
              Add
            </button>
          </form>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. Reserves & Storage Inventory                           */}
      {/* ========================================================= */}
      {activeSubTab === 'reserves' && (
        <div className="space-y-4">
          {/* Top Metric Cards (Fresh, Rotate soon, Replace now) */}
          <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
            {/* Fresh */}
            <div
              className="rounded-2xl sm:rounded-3xl p-3 sm:p-4 text-center border transition-all"
              style={{
                backgroundColor: '#052317',
                borderColor: '#0c442c',
              }}
            >
              <div className="text-2xl sm:text-3xl font-black text-[#00e599]">
                {reserves.filter((r) => getDaysLeft(r.expiryDate) > 30).length}
              </div>
              <div className="text-xs sm:text-sm font-bold text-[#00e599] mt-0.5">
                Fresh
              </div>
            </div>

            {/* Rotate soon */}
            <div
              className="rounded-2xl sm:rounded-3xl p-3 sm:p-4 text-center border transition-all"
              style={{
                backgroundColor: '#241a06',
                borderColor: '#48340d',
              }}
            >
              <div className="text-2xl sm:text-3xl font-black text-[#f59e0b]">
                {reserves.filter((r) => {
                  const d = getDaysLeft(r.expiryDate);
                  return d >= 0 && d <= 30;
                }).length}
              </div>
              <div className="text-xs sm:text-sm font-bold text-[#f59e0b] mt-0.5">
                Rotate soon
              </div>
            </div>

            {/* Replace now */}
            <div
              className="rounded-2xl sm:rounded-3xl p-3 sm:p-4 text-center border transition-all"
              style={{
                backgroundColor: '#250813',
                borderColor: '#4b1027',
              }}
            >
              <div className="text-2xl sm:text-3xl font-black text-[#f43f5e]">
                {reserves.filter((r) => getDaysLeft(r.expiryDate) < 0).length}
              </div>
              <div className="text-xs sm:text-sm font-bold text-[#f43f5e] mt-0.5">
                Replace now
              </div>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 flex-wrap">
            {[
              { id: 'all' as const, label: 'All' },
              { id: 'water' as const, label: 'Water' },
              { id: 'food' as const, label: 'Food' },
              { id: 'medical' as const, label: 'Medical' },
              { id: 'power' as const, label: 'Power & fuel' },
              { id: 'gear' as const, label: 'Gear & supplies' },
            ].map((cat) => {
              const isSelected = reserveFilter === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setReserveFilter(cat.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all active:scale-95 border ${
                    isSelected
                      ? 'text-white shadow-md'
                      : 'bg-[#131b26] border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
                  }`}
                  style={{
                    backgroundColor: isSelected ? 'var(--app-accent)' : undefined,
                    borderColor: isSelected ? 'var(--app-accent)' : undefined,
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Reserve Items List */}
          <div className="space-y-3">
            {reserves
              .filter((r) => {
                if (reserveFilter === 'all') return true;
                if (reserveFilter === 'power') return r.category === 'power';
                if (reserveFilter === 'gear') {
                  return (
                    r.category === 'gear' ||
                    r.category === 'tools' ||
                    r.category === 'hygiene' ||
                    r.category === 'other'
                  );
                }
                return r.category === reserveFilter;
              })
              .map((res) => {
                const isExpanded = expandedReserveId === res.id;
                const catDetails = getCategoryIconDetails(res.category);
                const expiryStatus = getExpiryStatus(res.expiryDate);
                const CatIcon = catDetails.Icon;

                return (
                  <div
                    key={res.id}
                    className="bg-[#0c131d] border border-slate-800/90 rounded-3xl p-4 transition-all shadow-sm"
                  >
                    {/* Header Row (Click to toggle expansion) */}
                    <div
                      onClick={() => setExpandedReserveId(isExpanded ? null : res.id)}
                      className="flex items-center justify-between cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-3.5">
                        <div
                          className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${catDetails.bg} ${catDetails.border} ${catDetails.color}`}
                        >
                          <CatIcon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="text-base font-bold text-slate-100">
                              {res.name || 'New reserve item'}
                            </h4>
                            <span
                              className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${expiryStatus.badgeBg} ${expiryStatus.badgeBorder} ${expiryStatus.badgeText}`}
                            >
                              {expiryStatus.label}
                            </span>
                          </div>
                        </div>
                      </div>

                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
                      )}
                    </div>

                    {/* Expanded Drawer (Image 2) */}
                    {isExpanded && (
                      <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-3.5 text-left" dir={direction}>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                              ITEM NAME
                            </label>
                            <input
                              type="text"
                              placeholder="Item name"
                              value={res.name}
                              onChange={(e) => handleUpdateReserveField(res.id, { name: e.target.value })}
                              className="w-full p-3 rounded-xl bg-[#080d14] border border-slate-800 text-slate-100 text-sm outline-none focus:border-slate-600 transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                              AMOUNT / QUANTITY
                            </label>
                            <input
                              type="text"
                              placeholder="20 L / 12 cans"
                              value={res.amount ?? (res.quantity ? `${res.quantity} ${res.unit || ''}`.trim() : '')}
                              onChange={(e) => handleUpdateReserveField(res.id, { amount: e.target.value })}
                              className="w-full p-3 rounded-xl bg-[#080d14] border border-slate-800 text-slate-100 text-sm outline-none focus:border-slate-600 transition-colors"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                            CATEGORY
                          </label>
                          <select
                            value={
                              res.category === 'tools' || res.category === 'hygiene' || res.category === 'other'
                                ? 'gear'
                                : res.category
                            }
                            onChange={(e) =>
                              handleUpdateReserveField(res.id, { category: e.target.value as ReserveItem['category'] })
                            }
                            className="w-full p-3 rounded-xl bg-[#080d14] border border-slate-800 text-slate-100 text-sm outline-none focus:border-slate-600 transition-colors cursor-pointer"
                          >
                            <option value="water">Water</option>
                            <option value="food">Food</option>
                            <option value="medical">Medical</option>
                            <option value="power">Power & fuel</option>
                            <option value="gear">Gear & supplies</option>
                          </select>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                              STORAGE DATE
                            </label>
                            <input
                              type="date"
                              value={res.storageDate || '2026-10-31'}
                              onChange={(e) => handleUpdateReserveField(res.id, { storageDate: e.target.value })}
                              className="w-full p-3 rounded-xl bg-[#080d14] border border-slate-800 text-slate-100 text-sm outline-none focus:border-slate-600 transition-colors cursor-pointer"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                              EXPIRATION / ROTATION DATE
                            </label>
                            <input
                              type="date"
                              value={res.expiryDate || '2027-05-01'}
                              onChange={(e) => handleUpdateReserveField(res.id, { expiryDate: e.target.value })}
                              className="w-full p-3 rounded-xl bg-[#080d14] border border-slate-800 text-slate-100 text-sm outline-none focus:border-slate-600 transition-colors cursor-pointer"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2 flex-wrap pt-0.5">
                          <span className="text-xs text-slate-400">Set expiry from storage date:</span>
                          <button
                            type="button"
                            onClick={() => handleSetExpiryMonths(res.id, res.storageDate, 3)}
                            className="px-3 py-1 rounded-full text-xs font-bold bg-[#080d14] border border-slate-800 text-slate-300 hover:border-slate-600 hover:text-white transition-all active:scale-95"
                          >
                            +3m
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSetExpiryMonths(res.id, res.storageDate, 6)}
                            className="px-3 py-1 rounded-full text-xs font-bold bg-[#080d14] border border-slate-800 text-slate-300 hover:border-slate-600 hover:text-white transition-all active:scale-95"
                          >
                            +6m
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSetExpiryMonths(res.id, res.storageDate, 12)}
                            className="px-3 py-1 rounded-full text-xs font-bold bg-[#080d14] border border-slate-800 text-slate-300 hover:border-slate-600 hover:text-white transition-all active:scale-95"
                          >
                            +1y
                          </button>
                          <button
                            type="button"
                            onClick={() => handleSetExpiryMonths(res.id, res.storageDate, 24)}
                            className="px-3 py-1 rounded-full text-xs font-bold bg-[#080d14] border border-slate-800 text-slate-300 hover:border-slate-600 hover:text-white transition-all active:scale-95"
                          >
                            +2y
                          </button>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                            STORAGE LOCATION / NOTES
                          </label>
                          <input
                            type="text"
                            placeholder="Storage location / notes"
                            value={res.location || res.notes || ''}
                            onChange={(e) =>
                              handleUpdateReserveField(res.id, { location: e.target.value, notes: e.target.value })
                            }
                            className="w-full p-3 rounded-xl bg-[#080d14] border border-slate-800 text-slate-100 text-sm outline-none focus:border-slate-600 transition-colors"
                          />
                        </div>

                        <div className="flex items-center justify-between gap-2 pt-1 flex-wrap">
                          <div className="flex items-center gap-2 flex-wrap">
                            <button
                              type="button"
                              onClick={() => handleRotatedToday(res.id, 6)}
                              className="px-3.5 py-2.5 rounded-xl bg-[#059669] hover:bg-[#10b981] text-white text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow"
                            >
                              <RotateCw className="w-3.5 h-3.5" />
                              <span>Rotated today (+6m)</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRotatedToday(res.id, 12)}
                              className="px-3.5 py-2.5 rounded-xl bg-[#ff6900] hover:bg-[#ea580c] text-white text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow"
                            >
                              <RotateCw className="w-3.5 h-3.5" />
                              <span>Rotated today (+1y)</span>
                            </button>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleDeleteReserve(res.id)}
                            className="px-3.5 py-2.5 rounded-xl border border-rose-900/60 bg-rose-950/20 text-rose-400 hover:bg-rose-950/50 text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 ml-auto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
          </div>

          {/* Bottom Add reserve item Button */}
          <button
            type="button"
            onClick={handleAddNewReserve}
            className="w-full py-3.5 px-4 rounded-2xl active:scale-[0.99] text-white font-bold flex items-center justify-center gap-2 text-sm shadow-lg hover:opacity-90 transition-all"
            style={{ backgroundColor: 'var(--app-accent)' }}
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Add reserve item</span>
          </button>
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. Offline Survival Reference Library                     */}
      {/* ========================================================= */}
      {activeSubTab === 'library' && (
        <div className="space-y-4">
          <div className="px-1">
            <h3 className="text-base font-extrabold" style={{ color: 'var(--app-text)' }}>
              {t.libraryTitle}
            </h3>
            <p className="text-xs opacity-75" style={{ color: 'var(--app-subtext)' }}>
              Offline scientific and operational protocols stored locally on your device.
            </p>
          </div>

          <div className="space-y-3">
            {LIBRARY_ARTICLES.map((article) => {
              const isExpanded = expandedArticleId === article.id;
              return (
                <div
                  key={article.id}
                  className="rounded-3xl border overflow-hidden shadow-sm transition-all"
                  style={{ backgroundColor: 'var(--app-card)', borderColor: 'var(--app-border)' }}
                >
                  <button
                    onClick={() => setExpandedArticleId(isExpanded ? null : article.id)}
                    className="w-full p-4 text-left flex items-center justify-between hover:bg-slate-800/20 transition-colors"
                  >
                    <div>
                      <span className="text-[10px] uppercase font-bold text-emerald-400">
                        {article.category}
                      </span>
                      <h4 className="text-sm font-bold mt-0.5" style={{ color: 'var(--app-text)' }}>
                        {article.title}
                      </h4>
                      <p className="text-xs opacity-75 mt-0.5 line-clamp-1" style={{ color: 'var(--app-subtext)' }}>
                        {article.summary}
                      </p>
                    </div>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 shrink-0 opacity-70" />
                    ) : (
                      <ChevronDown className="w-4 h-4 shrink-0 opacity-70" />
                    )}
                  </button>

                  {isExpanded && (
                    <div
                      className="p-4 pt-1 border-t text-xs space-y-2 leading-relaxed"
                      style={{
                        backgroundColor: 'var(--app-bg)',
                        borderColor: 'var(--app-border)',
                        color: 'var(--app-text)',
                      }}
                    >
                      {article.content.map((paragraph, idx) => (
                        <p key={idx} className="opacity-90 font-mono text-[11px] whitespace-pre-line">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

  // --- Root Prepare Directory (Vertical List of Entries) ---
  const totalAllChecklistItems =
    checklists.kit72h.length + checklists.goBag.length + checklists.car.length;
  const checkedAllChecklistItems =
    checklists.kit72h.filter((i) => i.checked).length +
    checklists.goBag.filter((i) => i.checked).length +
    checklists.car.filter((i) => i.checked).length;
  const checklistProgressPct =
    totalAllChecklistItems > 0
      ? Math.round((checkedAllChecklistItems / totalAllChecklistItems) * 100)
      : 0;

  const isPlanConfigured = Boolean(
    familyPlan.meetingPoint1.trim() ||
      familyPlan.meetingPoint2.trim() ||
      familyPlan.outOfAreaContact.trim() ||
      familyPlan.rallyPoint.trim()
  );

  const prepareModules = [
    {
      id: 'plan' as const,
      title: t.familyPlanTitle,
      description: t.familyPlanDesc,
      icon: Users,
      iconBg: 'bg-emerald-500/10',
      iconBorder: 'border-emerald-500/20',
      iconColor: 'text-emerald-400',
      badge: isPlanConfigured ? '✓ Configured' : undefined,
    },
    {
      id: 'contacts' as const,
      title: t.contactsTitle,
      description: t.contactsDesc,
      icon: Phone,
      iconBg: 'bg-red-500/10',
      iconBorder: 'border-red-500/20',
      iconColor: 'text-red-400',
      badge: `${contacts.length}`,
    },
    {
      id: 'checklists' as const,
      title: t.checklistsTitle,
      description: t.checklistsDesc,
      icon: CheckSquare,
      iconBg: 'bg-amber-500/10',
      iconBorder: 'border-amber-500/20',
      iconColor: 'text-amber-400',
      badge: `${checkedAllChecklistItems}/${totalAllChecklistItems} (${checklistProgressPct}%)`,
    },
    {
      id: 'reserves' as const,
      title: t.reservesTitle,
      description: t.reservesDesc,
      icon: Package,
      iconBg: 'bg-teal-500/10',
      iconBorder: 'border-teal-500/20',
      iconColor: 'text-teal-400',
      badge: `${reserves.length}`,
    },
    {
      id: 'library' as const,
      title: t.libraryTitle,
      description: t.libraryDesc,
      icon: BookOpen,
      iconBg: 'bg-blue-500/10',
      iconBorder: 'border-blue-500/20',
      iconColor: 'text-blue-400',
      badge: `${LIBRARY_ARTICLES.length}`,
    },
  ];

  return (
    <div className="space-y-6 pb-24 max-w-4xl mx-auto px-4 pt-4">
      {/* Title */}
      <div>
        <h2 className="text-xl font-black tracking-tight" style={{ color: 'var(--app-text)' }}>
          {t.tabPrepare}
        </h2>
        <p className="text-xs opacity-75 mt-0.5" style={{ color: 'var(--app-subtext)' }}>
          {t.prepareSubtitle}
        </p>
      </div>

      {/* Vertical list of entries */}
      <div className="space-y-3">
        {prepareModules.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              dir={direction}
              onClick={() => setActiveSubTab(item.id)}
              className="w-full p-4 rounded-3xl border text-left rtl:text-right flex items-start justify-between transition-all hover:border-emerald-500/50 hover:bg-emerald-500/5 active:scale-[0.99] shadow-sm"
              style={{ backgroundColor: 'var(--app-card)', borderColor: 'var(--app-border)' }}
            >
              <div className="flex items-start gap-3.5">
                <span className={`p-3 rounded-2xl ${item.iconBg} border ${item.iconBorder} ${item.iconColor} shrink-0`}>
                  <Icon className="w-5 h-5" />
                </span>
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="text-sm font-bold" style={{ color: 'var(--app-text)' }}>
                      {item.title}
                    </h3>
                    {item.badge && (
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-800/80 border border-slate-700 text-slate-300">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs opacity-75 line-clamp-2" style={{ color: 'var(--app-subtext)' }}>
                    {item.description}
                  </p>
                </div>
              </div>
              <ForwardChevron className="w-4 h-4 shrink-0 opacity-50 mt-3" />
            </button>
          );
        })}
      </div>
    </div>
  );
};
