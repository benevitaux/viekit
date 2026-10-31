import React, { useEffect, useState } from 'react';
import {
  X,
  PhoneCall,
  Volume2,
  VolumeX,
  Zap,
  MapPin,
  Share2,
  Check,
  ShieldAlert,
  AlertTriangle,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { soundEngine } from '../utils/audio';

export const SosModal: React.FC = () => {
  const { isSosOpen, setIsSosOpen, country, t } = useApp();
  const [isSirenOn, setIsSirenOn] = useState(false);
  const [isStrobeOn, setIsStrobeOn] = useState(false);
  const [coords, setCoords] = useState<{ lat: number; lng: number; accuracy: number } | null>(null);
  const [coordsCopied, setCoordsCopied] = useState(false);
  const [locStatus, setLocStatus] = useState<string>('');

  useEffect(() => {
    if (isSosOpen) {
      if ('geolocation' in navigator) {
        setLocStatus(t.gpsLocating);
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setCoords({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
              accuracy: Math.round(pos.coords.accuracy),
            });
            setLocStatus(t.gpsActive);
          },
          () => {
            setLocStatus(t.gpsFailed);
          },
          { enableHighAccuracy: true, timeout: 8000 }
        );
      }
    } else {
      soundEngine.stopAlarmSiren();
      setIsSirenOn(false);
      setIsStrobeOn(false);
      setCoordsCopied(false);
    }
  }, [isSosOpen, t]);

  useEffect(() => {
    return () => {
      soundEngine.stopAlarmSiren();
    };
  }, []);

  const handleToggleSiren = () => {
    if (isSirenOn) {
      soundEngine.stopAlarmSiren();
      setIsSirenOn(false);
    } else {
      soundEngine.startAlarmSiren();
      setIsSirenOn(true);
    }
  };

  const handleToggleStrobe = () => {
    setIsStrobeOn(!isStrobeOn);
  };

  const emergencyMessage = coords
    ? `SOS EMERGENCY! I need immediate rescue. My GPS location is: Lat ${coords.lat.toFixed(5)}, Lng ${coords.lng.toFixed(5)} (±${coords.accuracy}m). Map: https://maps.google.com/?q=${coords.lat},${coords.lng}`
    : `SOS EMERGENCY! I am in immediate danger and need rescue assistance in ${country.name}.`;

  const handleCopyCoordinates = () => {
    try {
      navigator.clipboard.writeText(emergencyMessage);
      setCoordsCopied(true);
      setTimeout(() => setCoordsCopied(false), 3000);
    } catch {
      // Fallback
    }
  };

  if (!isSosOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col justify-between p-4 sm:p-6 overflow-y-auto ${
        isStrobeOn ? 'strobe-active' : 'bg-black/95 backdrop-blur-xl'
      }`}
      style={{
        backgroundColor: isStrobeOn ? 'transparent' : '#0a0202',
      }}
    >
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-600/25 rounded-full blur-3xl pointer-events-none" />

      {/* Main Content Area */}
      <div className="w-full max-w-xl mx-auto space-y-4 relative z-10 pt-2 pb-6">
        {/* Header Title & Badge */}
        <div className="flex items-center justify-between pb-4 border-b border-red-900/50">
          <div className="flex items-center gap-3">
            <span className="p-2.5 rounded-2xl bg-red-600/20 border border-red-500/50 text-red-400">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </span>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-red-500 tracking-wide">
                {t.sosModalTitle}
              </h2>
              <p className="text-xs text-red-200/70">{country.name} ({country.nativeName})</p>
            </div>
          </div>
        </div>

        {/* Direct Emergency Call Grid */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wider text-red-300 block mb-2">
            {t.quickCall} ({country.name})
          </label>
          <div className="grid grid-cols-2 gap-3">
            {/* General Dispatch */}
            <a
              href={`tel:${country.emergency.general}`}
              className="col-span-2 p-4 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-black text-base flex items-center justify-between shadow-xl shadow-red-900/50 active:scale-[0.98] transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-xl bg-white/20">
                  <PhoneCall className="w-5 h-5" />
                </span>
                <div>
                  <div className="text-xs uppercase tracking-wider text-red-100 font-medium">{t.nationalEmergency}</div>
                  <div className="text-xl">{country.emergency.general}</div>
                </div>
              </div>
              <span className="text-xs px-3 py-1.5 rounded-full bg-black/30 font-bold">{t.callNow}</span>
            </a>

            {/* Police */}
            <a
              href={`tel:${country.emergency.police}`}
              className="p-3.5 rounded-2xl bg-slate-900/90 border border-red-900/50 hover:border-red-500/70 text-slate-100 font-bold flex items-center justify-between active:scale-95 transition-all"
            >
              <div>
                <div className="text-[11px] text-red-400 font-medium">{t.callPolice}</div>
                <div className="text-lg text-white">{country.emergency.police}</div>
              </div>
              <PhoneCall className="w-4 h-4 text-red-400" />
            </a>

            {/* Ambulance */}
            <a
              href={`tel:${country.emergency.ambulance}`}
              className="p-3.5 rounded-2xl bg-slate-900/90 border border-red-900/50 hover:border-red-500/70 text-slate-100 font-bold flex items-center justify-between active:scale-95 transition-all"
            >
              <div>
                <div className="text-[11px] text-red-400 font-medium">{t.callAmbulance}</div>
                <div className="text-lg text-white">{country.emergency.ambulance}</div>
              </div>
              <PhoneCall className="w-4 h-4 text-emerald-400" />
            </a>

            {/* Fire */}
            <a
              href={`tel:${country.emergency.fire}`}
              className="col-span-2 p-3.5 rounded-2xl bg-slate-900/90 border border-red-900/50 hover:border-red-500/70 text-slate-100 font-bold flex items-center justify-between active:scale-95 transition-all"
            >
              <div>
                <div className="text-[11px] text-red-400 font-medium">{t.callFire}</div>
                <div className="text-lg text-white">{country.emergency.fire}</div>
              </div>
              <PhoneCall className="w-4 h-4 text-amber-400" />
            </a>
          </div>
        </div>

        {/* Distress Signaler Controls: Siren & Strobe */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={handleToggleSiren}
            className={`p-3.5 rounded-2xl border font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${
              isSirenOn
                ? 'bg-amber-600 border-amber-400 text-white animate-pulse shadow-lg shadow-amber-600/40'
                : 'bg-red-950/40 border-red-800/60 text-red-200 hover:bg-red-900/40'
            }`}
          >
            {isSirenOn ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            <span>{isSirenOn ? t.silenceAlarm : t.soundAlarm}</span>
          </button>

          <button
            onClick={handleToggleStrobe}
            className={`p-3.5 rounded-2xl border font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all active:scale-95 ${
              isStrobeOn
                ? 'bg-white text-black border-white shadow-lg shadow-white/40 font-black'
                : 'bg-red-950/40 border-red-800/60 text-red-200 hover:bg-red-900/40'
            }`}
          >
            <Zap className={`w-4 h-4 ${isStrobeOn ? 'text-black' : 'text-yellow-400'}`} />
            <span>{t.strobeLight}</span>
          </button>
        </div>

        {/* GPS Coordinates & Emergency SMS */}
        <div className="p-4 rounded-2xl bg-red-950/30 border border-red-900/40">
          <div className="flex items-center justify-between text-xs text-red-300 font-medium mb-1.5">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-red-400" />
              <span>{locStatus || t.locationTitle}</span>
            </span>
            {coords && <span>±{coords.accuracy}m</span>}
          </div>

          <div className="text-xs font-mono bg-black/60 p-3 rounded-xl border border-red-900/40 text-slate-200 break-all select-all">
            {coords ? (
              <>
                <span className="text-emerald-400 font-bold">LAT:</span> {coords.lat.toFixed(6)}{' '}
                <span className="text-emerald-400 font-bold">LNG:</span> {coords.lng.toFixed(6)}
              </>
            ) : (
              <span className="opacity-70 text-[11px]">{t.gpsLocating}</span>
            )}
          </div>

          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={handleCopyCoordinates}
              className="flex-1 py-2.5 px-3 rounded-xl bg-red-900/50 hover:bg-red-800/70 border border-red-700/60 text-xs font-bold text-white flex items-center justify-center gap-1.5 active:scale-95 transition-all"
            >
              {coordsCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
              <span>{coordsCopied ? t.copiedCoordinates : t.shareCoordinates}</span>
            </button>

            <a
              href={`sms:?body=${encodeURIComponent(emergencyMessage)}`}
              className="py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-600 border border-emerald-500/60 text-xs font-bold text-white flex items-center justify-center gap-1.5 active:scale-95 transition-all"
            >
              <AlertTriangle className="w-4 h-4" />
              <span>SMS</span>
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Close Button Bar */}
      <div className="w-full max-w-xl mx-auto pb-4 pt-2 relative z-10">
        <button
          onClick={() => setIsSosOpen(false)}
          className="w-full py-3.5 rounded-2xl border font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 hover:opacity-100 opacity-85 active:scale-[0.98] transition-all"
          style={{
            backgroundColor: 'var(--app-card)',
            borderColor: 'var(--app-border)',
            color: 'var(--app-text)',
          }}
        >
          <X className="w-4 h-4 opacity-70" />
          <span>{t.close}</span>
        </button>
      </div>
    </div>
  );
};
