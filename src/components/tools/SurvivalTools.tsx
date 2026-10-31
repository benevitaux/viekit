import React, { useState, useEffect } from 'react';
import {
  PhoneCall,
  Zap,
  Volume2,
  Compass,
  MapPin,
  Droplets,
  Share2,
  Check,
  Search,
  AlertTriangle,
  Flame,
  Clock,
  RotateCcw,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { UN_COUNTRIES } from '../../data/countries';
import { SurvivalToolId } from '../../types';
import { soundEngine } from '../../utils/audio';
import { deviceManager } from '../../utils/device';

interface Props {
  toolId: SurvivalToolId;
}

export const SurvivalTools: React.FC<Props> = ({ toolId }) => {
  const { country, setCountryCode, t } = useApp();

  // Emergency Numbers tool state
  const [countrySearch, setCountrySearch] = useState('');
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  // Flashlight tool state
  const [hardwareTorchActive, setHardwareTorchActive] = useState(false);
  const [hardwareTorchError, setHardwareTorchError] = useState<string | null>(null);
  const [screenLightMode, setScreenLightMode] = useState<'off' | 'white' | 'red' | 'sos' | 'strobe'>('off');

  // Whistle tool state
  const [isWhistleBlowing, setIsWhistleBlowing] = useState(false);
  const [isSirenActive, setIsSirenActive] = useState(false);
  const [isSosMorseBlowing, setIsSosMorseBlowing] = useState(false);

  // Compass tool state
  const [heading, setHeading] = useState<number | null>(null);
  const [compassPermissionNeeded, setCompassPermissionNeeded] = useState(false);

  // Location tool state
  const [coords, setCoords] = useState<{ lat: number; lng: number; altitude: number | null; accuracy: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [coordsCopied, setCoordsCopied] = useState(false);

  // Water & ORS tool state
  const [orsLiters, setOrsLiters] = useState<number>(1);
  const [boilTimerSeconds, setBoilTimerSeconds] = useState<number>(0);
  const [isBoilTimerRunning, setIsBoilTimerRunning] = useState<boolean>(false);

  // --- Handlers & Effects ---

  // Copy helper
  const handleCopy = (text: string, id: string) => {
    try {
      navigator.clipboard.writeText(text);
      setCopiedNumber(id);
      setTimeout(() => setCopiedNumber(null), 2500);
    } catch {
      // Fallback
    }
  };

  // Hardware Torch toggle
  const handleToggleHardwareTorch = async () => {
    setHardwareTorchError(null);
    const result = await deviceManager.toggleTorch();
    if (!result.supported && result.error) {
      setHardwareTorchError(result.error);
    }
    setHardwareTorchActive(result.active);
  };

  // Whistle burst
  const handleBlowWhistle = () => {
    setIsWhistleBlowing(true);
    soundEngine.playWhistleBurst(800);
    setTimeout(() => setIsWhistleBlowing(false), 800);
  };

  // Whistle SOS Morse audio sequence (... --- ...)
  const handlePlaySosMorse = () => {
    if (isSosMorseBlowing) return;
    setIsSosMorseBlowing(true);

    const timing = [
      // 3 short (200ms sound, 100ms pause)
      { d: 200, pause: 150 },
      { d: 200, pause: 150 },
      { d: 200, pause: 400 },
      // 3 long (600ms sound, 200ms pause)
      { d: 600, pause: 200 },
      { d: 600, pause: 200 },
      { d: 600, pause: 400 },
      // 3 short
      { d: 200, pause: 150 },
      { d: 200, pause: 150 },
      { d: 200, pause: 500 },
    ];

    let currentDelay = 0;
    timing.forEach((step, idx) => {
      setTimeout(() => {
        soundEngine.playWhistleBurst(step.d);
        if (idx === timing.length - 1) {
          setIsSosMorseBlowing(false);
        }
      }, currentDelay);
      currentDelay += step.d + step.pause;
    });
  };

  // Siren toggle
  const handleToggleSiren = () => {
    if (isSirenActive) {
      soundEngine.stopAlarmSiren();
      setIsSirenActive(false);
    } else {
      soundEngine.startAlarmSiren();
      setIsSirenActive(true);
    }
  };

  // Compass orientation listener
  useEffect(() => {
    if (toolId !== 'compass') return;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      let compassHeading: number | null = null;
      const webkitCompassHeading = (e as unknown as { webkitCompassHeading?: number }).webkitCompassHeading;
      if (typeof webkitCompassHeading === 'number') {
        // iOS Safari
        compassHeading = webkitCompassHeading;
      } else if (e.alpha !== null) {
        // Android / standard (compass heading is roughly 360 - alpha)
        compassHeading = (360 - e.alpha) % 360;
      }

      if (compassHeading !== null) {
        setHeading(Math.round(compassHeading));
      }
    };

    window.addEventListener('deviceorientation', handleOrientation, true);
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, [toolId]);

  const handleRequestCompassPermission = async () => {
    const granted = await deviceManager.requestOrientationPermission();
    if (granted) {
      setCompassPermissionNeeded(false);
    }
  };

  // Location Geolocation fetch
  const fetchLocation = () => {
    if (!('geolocation' in navigator)) return;
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          altitude: pos.coords.altitude ? Math.round(pos.coords.altitude) : null,
          accuracy: Math.round(pos.coords.accuracy),
        });
        setIsLocating(false);
      },
      () => {
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  useEffect(() => {
    if (toolId === 'location') {
      fetchLocation();
    }
  }, [toolId]);

  // Boiling timer countdown
  useEffect(() => {
    let interval: number | null = null;
    if (isBoilTimerRunning && boilTimerSeconds > 0) {
      interval = window.setInterval(() => {
        setBoilTimerSeconds((prev) => {
          if (prev <= 1) {
            soundEngine.playWhistleBurst(400);
            setIsBoilTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isBoilTimerRunning, boilTimerSeconds]);

  // Clean up sounds when switching away
  useEffect(() => {
    return () => {
      soundEngine.stopAlarmSiren();
      deviceManager.turnTorchOff();
    };
  }, []);

  // Filtered countries for Emergency Numbers tool
  const filteredCountries = UN_COUNTRIES.filter(
    (c) =>
      c.name.toLowerCase().includes(countrySearch.toLowerCase()) ||
      c.nativeName.toLowerCase().includes(countrySearch.toLowerCase()) ||
      c.code.toLowerCase().includes(countrySearch.toLowerCase())
  );

  // Cardinal point label for compass
  const getCardinalDirection = (deg: number | null): string => {
    if (deg === null) return '--';
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(deg / 45) % 8;
    return directions[index];
  };

  // -------------------------------------------------------------
  // Tool 1: Emergency Numbers
  // -------------------------------------------------------------
  if (toolId === 'emergency-numbers') {
    return (
      <div className="space-y-4">
        {/* Active Country Card */}
        <div
          className="p-5 rounded-3xl border shadow-lg relative overflow-hidden"
          style={{
            backgroundColor: 'var(--app-card)',
            borderColor: 'var(--app-border)',
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                {t.currentCountry}
              </span>
              <h3 className="text-xl font-black mt-0.5" style={{ color: 'var(--app-text)' }}>
                {country.name} <span className="text-sm font-normal opacity-70">[{country.nativeName}]</span>
              </h3>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
              {country.dialCode}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mt-4">
            {/* General Dispatch */}
            <div className="col-span-2 p-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 text-white flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-xl bg-white/20">
                  <PhoneCall className="w-5 h-5" />
                </span>
                <div>
                  <div className="text-[10px] uppercase tracking-wider font-semibold opacity-90">National Emergency SOS</div>
                  <div className="text-2xl font-black">{country.emergency.general}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(country.emergency.general, 'gen')}
                  className="p-2 rounded-xl bg-black/20 hover:bg-black/30 text-white text-xs font-semibold active:scale-95"
                >
                  {copiedNumber === 'gen' ? <Check className="w-4 h-4 text-emerald-300" /> : <Share2 className="w-4 h-4" />}
                </button>
                <a
                  href={`tel:${country.emergency.general}`}
                  className="px-3.5 py-2 rounded-xl bg-white text-red-600 text-xs font-black shadow active:scale-95 transition-all"
                >
                  CALL
                </a>
              </div>
            </div>

            {/* Police */}
            <div
              className="p-3 rounded-2xl border flex items-center justify-between"
              style={{ backgroundColor: 'var(--app-bg)', borderColor: 'var(--app-border)' }}
            >
              <div>
                <div className="text-[11px] font-medium text-red-400">{t.callPolice}</div>
                <div className="text-lg font-black" style={{ color: 'var(--app-text)' }}>{country.emergency.police}</div>
              </div>
              <a
                href={`tel:${country.emergency.police}`}
                className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 active:scale-95"
              >
                <PhoneCall className="w-4 h-4" />
              </a>
            </div>

            {/* Ambulance */}
            <div
              className="p-3 rounded-2xl border flex items-center justify-between"
              style={{ backgroundColor: 'var(--app-bg)', borderColor: 'var(--app-border)' }}
            >
              <div>
                <div className="text-[11px] font-medium text-emerald-400">{t.callAmbulance}</div>
                <div className="text-lg font-black" style={{ color: 'var(--app-text)' }}>{country.emergency.ambulance}</div>
              </div>
              <a
                href={`tel:${country.emergency.ambulance}`}
                className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 active:scale-95"
              >
                <PhoneCall className="w-4 h-4" />
              </a>
            </div>

            {/* Fire */}
            <div
              className="col-span-2 p-3 rounded-2xl border flex items-center justify-between"
              style={{ backgroundColor: 'var(--app-bg)', borderColor: 'var(--app-border)' }}
            >
              <div>
                <div className="text-[11px] font-medium text-amber-400">{t.callFire}</div>
                <div className="text-lg font-black" style={{ color: 'var(--app-text)' }}>{country.emergency.fire}</div>
              </div>
              <a
                href={`tel:${country.emergency.fire}`}
                className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 active:scale-95"
              >
                <PhoneCall className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Search All UN Countries */}
        <div
          className="p-4 rounded-3xl border"
          style={{ backgroundColor: 'var(--app-card)', borderColor: 'var(--app-border)' }}
        >
          <div className="flex items-center gap-2 pb-2.5 border-b mb-3" style={{ borderColor: 'var(--app-border)' }}>
            <Search className="w-4 h-4 text-emerald-400 shrink-0" />
            <input
              type="text"
              value={countrySearch}
              onChange={(e) => setCountrySearch(e.target.value)}
              placeholder="Search UN countries (e.g. France, Ukraine, Japan)..."
              className="w-full bg-transparent text-xs sm:text-sm outline-none font-medium placeholder:opacity-50"
              style={{ color: 'var(--app-text)' }}
            />
          </div>

          <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
            {filteredCountries.map((c) => (
              <button
                key={c.code}
                onClick={() => setCountryCode(c.code)}
                className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between text-xs transition-all ${
                  c.code === country.code
                    ? 'bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-bold'
                    : 'hover:bg-slate-800/40 opacity-80 hover:opacity-100'
                }`}
                style={{ color: c.code === country.code ? undefined : 'var(--app-text)' }}
              >
                <div>
                  <span className="font-semibold">{c.name}</span>{' '}
                  <span className="opacity-60 text-[11px]">[{c.nativeName}]</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span>SOS: {c.emergency.general}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Tool 2: Flashlight & Screen Light
  // -------------------------------------------------------------
  if (toolId === 'flashlight') {
    return (
      <div className="space-y-4">
        {/* Fullscreen Overlay when Screen Light is Active */}
        {screenLightMode !== 'off' && (
          <div
            onClick={() => setScreenLightMode('off')}
            className={`fixed inset-0 z-50 flex flex-col items-center justify-start p-6 select-none cursor-pointer ${
              screenLightMode === 'white'
                ? 'bg-white text-slate-900'
                : screenLightMode === 'red'
                ? 'bg-red-700 text-white'
                : 'strobe-active'
            }`}
          >
            <div className="text-center pt-8">
              <span className="text-xs uppercase font-black tracking-widest px-3 py-1.5 rounded-full bg-black/30 backdrop-blur-sm">
                Tap Screen Anywhere to Turn Off
              </span>
            </div>
          </div>
        )}

        {/* Hardware Camera Torch Card */}
        <div
          className="p-5 rounded-3xl border shadow-lg text-center"
          style={{ backgroundColor: 'var(--app-card)', borderColor: 'var(--app-border)' }}
        >
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
            Hardware LED Torch
          </span>
          <h3 className="text-xl font-black mt-1" style={{ color: 'var(--app-text)' }}>
            Rear Camera Flashlight
          </h3>

          <div className="mt-5 flex justify-center">
            <button
              onClick={handleToggleHardwareTorch}
              className={`w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center transition-all active:scale-95 shadow-xl ${
                hardwareTorchActive
                  ? 'bg-amber-400 border-amber-200 text-slate-950 shadow-amber-400/50 scale-105'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:border-slate-500'
              }`}
            >
              <Zap className={`w-10 h-10 ${hardwareTorchActive ? 'fill-slate-950' : ''}`} />
              <span className="text-xs font-black uppercase mt-1">
                {hardwareTorchActive ? 'ON' : 'OFF'}
              </span>
            </button>
          </div>

          {hardwareTorchError && (
            <p className="mt-4 text-xs text-amber-400/90 bg-amber-500/10 p-2.5 rounded-xl border border-amber-500/20 max-w-sm mx-auto">
              Hardware torch note: {hardwareTorchError}. You can use the high-power screen lights below.
            </p>
          )}
        </div>

        {/* High-Power Screen Illumination Modes */}
        <div
          className="p-5 rounded-3xl border shadow-lg"
          style={{ backgroundColor: 'var(--app-card)', borderColor: 'var(--app-border)' }}
        >
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
            Screen Illumination Modes
          </span>
          <h4 className="text-base font-bold mt-1 mb-3" style={{ color: 'var(--app-text)' }}>
            Maximum Brightness Panels
          </h4>

          <div className="grid grid-cols-3 gap-2.5">
            {/* White Screen */}
            <button
              onClick={() => setScreenLightMode('white')}
              className="p-4 rounded-2xl bg-white text-slate-900 border-2 border-slate-200 font-extrabold text-xs flex flex-col items-center gap-2 active:scale-95 shadow transition-all"
            >
              <div className="w-6 h-6 rounded-full bg-slate-200 border border-slate-400" />
              <span>Full White</span>
            </button>

            {/* Red Screen (Tactical / Night Vision) */}
            <button
              onClick={() => setScreenLightMode('red')}
              className="p-4 rounded-2xl bg-red-600 text-white border-2 border-red-500 font-extrabold text-xs flex flex-col items-center gap-2 active:scale-95 shadow transition-all"
            >
              <div className="w-6 h-6 rounded-full bg-red-400 border border-white" />
              <span>Tactical Red</span>
            </button>

            {/* SOS Strobe */}
            <button
              onClick={() => setScreenLightMode('sos')}
              className="p-4 rounded-2xl bg-amber-500 text-slate-950 border-2 border-amber-400 font-extrabold text-xs flex flex-col items-center gap-2 active:scale-95 shadow transition-all"
            >
              <Zap className="w-6 h-6" />
              <span>SOS Strobe</span>
            </button>
          </div>

          <p className="mt-3 text-[11px] opacity-70" style={{ color: 'var(--app-subtext)' }}>
            * Tactical Red preserves dark-adapted rhodopsin night vision and reduces bug attraction during outdoor bivouacs.
          </p>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Tool 3: Whistle & Siren
  // -------------------------------------------------------------
  if (toolId === 'whistle') {
    return (
      <div className="space-y-4">
        {/* Main Whistle Button Card */}
        <div
          className="p-6 rounded-3xl border shadow-lg text-center relative overflow-hidden"
          style={{ backgroundColor: 'var(--app-card)', borderColor: 'var(--app-border)' }}
        >
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
            Acoustic Signal Generator (Web Audio)
          </span>
          <h3 className="text-xl font-black mt-1" style={{ color: 'var(--app-text)' }}>
            Loud Rescue Whistle
          </h3>
          <p className="text-xs mt-1 opacity-70" style={{ color: 'var(--app-subtext)' }}>
            Dual-tone 2850Hz & 3120Hz shrill audio with maximum acoustic penetration
          </p>

          <div className="mt-6 flex justify-center">
            <button
              onClick={handleBlowWhistle}
              className={`w-36 h-36 rounded-full border-4 flex flex-col items-center justify-center transition-all active:scale-90 shadow-2xl relative ${
                isWhistleBlowing
                  ? 'bg-emerald-500 border-white text-white shadow-emerald-500/60 scale-105'
                  : 'bg-emerald-600/20 border-emerald-500/40 text-emerald-400 hover:bg-emerald-600/30'
              }`}
            >
              {isWhistleBlowing && (
                <div className="absolute inset-0 rounded-full border-4 border-emerald-400 radar-ring pointer-events-none" />
              )}
              <Volume2 className="w-12 h-12" />
              <span className="text-xs font-black uppercase mt-1 tracking-wider">
                {isWhistleBlowing ? 'BLOWING!' : 'BLOW WHISTLE'}
              </span>
            </button>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 max-w-sm mx-auto">
            {/* SOS Morse Audio Sequence */}
            <button
              onClick={handlePlaySosMorse}
              disabled={isSosMorseBlowing}
              className={`p-3 rounded-2xl border font-bold text-xs flex flex-col items-center gap-1.5 transition-all active:scale-95 ${
                isSosMorseBlowing
                  ? 'bg-amber-600 border-amber-400 text-white animate-pulse'
                  : 'bg-slate-800/80 border-slate-700 text-slate-200 hover:border-slate-500'
              }`}
            >
              <Volume2 className="w-5 h-5 text-amber-400" />
              <span>{isSosMorseBlowing ? 'SENDING SOS...' : 'SOS Morse Tone'}</span>
              <span className="text-[10px] opacity-70 font-mono">••• ——— •••</span>
            </button>

            {/* Continuous Siren Alarm */}
            <button
              onClick={handleToggleSiren}
              className={`p-3 rounded-2xl border font-bold text-xs flex flex-col items-center gap-1.5 transition-all active:scale-95 ${
                isSirenActive
                  ? 'bg-red-600 border-red-400 text-white animate-pulse shadow-lg shadow-red-600/40'
                  : 'bg-slate-800/80 border-slate-700 text-slate-200 hover:border-slate-500'
              }`}
            >
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <span>{isSirenActive ? 'STOP SIREN' : 'Loud Alarm Siren'}</span>
              <span className="text-[10px] opacity-70">Continuous Alert</span>
            </button>
          </div>
        </div>

        {/* International Whistle Signals Reference */}
        <div
          className="p-4 rounded-3xl border text-xs space-y-2"
          style={{ backgroundColor: 'var(--app-card)', borderColor: 'var(--app-border)' }}
        >
          <div className="font-bold text-sm text-emerald-400">Search & Rescue Whistle Codes:</div>
          <div className="flex items-center justify-between py-1 border-b" style={{ borderColor: 'var(--app-border)' }}>
            <span>1 Blast:</span>
            <span className="font-semibold" style={{ color: 'var(--app-text)' }}>"Where are you?" / Location check</span>
          </div>
          <div className="flex items-center justify-between py-1 border-b" style={{ borderColor: 'var(--app-border)' }}>
            <span>2 Blasts:</span>
            <span className="font-semibold" style={{ color: 'var(--app-text)' }}>"Come to me" / Rendezvous</span>
          </div>
          <div className="flex items-center justify-between py-1 text-red-400 font-bold">
            <span>3 Blasts (Repeated):</span>
            <span>SOS / Emergency Help Needed</span>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Tool 4: Compass & Heading
  // -------------------------------------------------------------
  if (toolId === 'compass') {
    return (
      <div className="space-y-4">
        <div
          className="p-6 rounded-3xl border shadow-lg text-center relative overflow-hidden"
          style={{ backgroundColor: 'var(--app-card)', borderColor: 'var(--app-border)' }}
        >
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
            DeviceOrientation Azimuth
          </span>
          <h3 className="text-xl font-black mt-1" style={{ color: 'var(--app-text)' }}>
            Magnetic Compass
          </h3>

          {/* Heading Readout */}
          <div className="my-6">
            <div className="text-5xl font-black font-mono tracking-tight" style={{ color: 'var(--app-text)' }}>
              {heading !== null ? `${heading}°` : '--'}
            </div>
            <div className="text-xl font-black uppercase text-emerald-400 mt-1">
              {getCardinalDirection(heading)}
            </div>
          </div>

          {/* Circular Compass Dial Graphic */}
          <div className="relative w-56 h-56 mx-auto my-4 flex items-center justify-center">
            {/* Compass Rose Ring */}
            <div
              className="absolute inset-0 rounded-full border-4 border-slate-700/80 shadow-inner transition-transform duration-300"
              style={{
                transform: heading !== null ? `rotate(${-heading}deg)` : 'none',
              }}
            >
              {/* Cardinal Markers */}
              <span className="absolute top-1 left-1/2 -translate-x-1/2 text-sm font-black text-red-500">N</span>
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-sm font-black text-slate-400">S</span>
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-sm font-black text-slate-400">E</span>
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-sm font-black text-slate-400">W</span>
            </div>

            {/* Needle Pivot Center */}
            <div className="relative w-8 h-8 rounded-full bg-slate-900 border-2 border-slate-600 flex items-center justify-center z-10 shadow-lg">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
            </div>

            {/* Needle Graphic */}
            <div className="absolute w-2 h-44 pointer-events-none flex flex-col justify-between items-center z-0">
              <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-b-[45px] border-b-red-500" />
              <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[45px] border-t-slate-500" />
            </div>
          </div>

          {heading === null && (
            <div className="mt-4 p-3 rounded-2xl bg-slate-800/60 border border-slate-700 text-xs">
              <p className="opacity-80">
                Hold your device flat. If heading is not moving, wave your phone in a figure-8 motion to calibrate the internal magnetometer.
              </p>
              <button
                onClick={handleRequestCompassPermission}
                className="mt-2.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white font-bold active:scale-95"
              >
                Enable Compass Sensor
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Tool 5: Location & Coordinates
  // -------------------------------------------------------------
  if (toolId === 'location') {
    const locText = coords
      ? `MY EMERGENCY LOCATION:\nLatitude: ${coords.lat.toFixed(6)}\nLongitude: ${coords.lng.toFixed(6)}\nAccuracy: ±${coords.accuracy}m\nMap Link: https://maps.google.com/?q=${coords.lat},${coords.lng}`
      : 'Acquiring GPS position...';

    return (
      <div className="space-y-4">
        <div
          className="p-5 rounded-3xl border shadow-lg"
          style={{ backgroundColor: 'var(--app-card)', borderColor: 'var(--app-border)' }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                WGS84 Coordinates
              </span>
              <h3 className="text-xl font-black mt-0.5" style={{ color: 'var(--app-text)' }}>
                GPS Position & Coordinates
              </h3>
            </div>
            <button
              onClick={fetchLocation}
              disabled={isLocating}
              className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 active:scale-95"
            >
              <RotateCcw className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
            </button>
          </div>

          {coords ? (
            <div className="space-y-3 mt-4">
              <div className="grid grid-cols-2 gap-2.5">
                <div
                  className="p-3 rounded-2xl border"
                  style={{ backgroundColor: 'var(--app-bg)', borderColor: 'var(--app-border)' }}
                >
                  <span className="text-[10px] uppercase font-bold text-emerald-400 block">Latitude</span>
                  <span className="text-lg font-black font-mono" style={{ color: 'var(--app-text)' }}>
                    {coords.lat.toFixed(6)}°
                  </span>
                </div>
                <div
                  className="p-3 rounded-2xl border"
                  style={{ backgroundColor: 'var(--app-bg)', borderColor: 'var(--app-border)' }}
                >
                  <span className="text-[10px] uppercase font-bold text-emerald-400 block">Longitude</span>
                  <span className="text-lg font-black font-mono" style={{ color: 'var(--app-text)' }}>
                    {coords.lng.toFixed(6)}°
                  </span>
                </div>
              </div>

              <div
                className="p-3 rounded-2xl border flex items-center justify-between text-xs"
                style={{ backgroundColor: 'var(--app-bg)', borderColor: 'var(--app-border)' }}
              >
                <div>
                  <span className="opacity-70">Accuracy Radius:</span>{' '}
                  <span className="font-bold text-emerald-400">±{coords.accuracy} meters</span>
                </div>
                {coords.altitude !== null && (
                  <div>
                    <span className="opacity-70">Altitude:</span>{' '}
                    <span className="font-bold" style={{ color: 'var(--app-text)' }}>{coords.altitude} m</span>
                  </div>
                )}
              </div>

              <div className="pt-2 flex items-center gap-2">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(locText);
                    setCoordsCopied(true);
                    setTimeout(() => setCoordsCopied(false), 3000);
                  }}
                  className="flex-1 py-3 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 active:scale-95 transition-all shadow"
                >
                  {coordsCopied ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
                  <span>{coordsCopied ? 'Coordinates Copied!' : 'Copy Location Message'}</span>
                </button>

                <a
                  href={`sms:?body=${encodeURIComponent(locText)}`}
                  className="py-3 px-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 active:scale-95 transition-all shadow"
                >
                  SMS
                </a>
              </div>
            </div>
          ) : (
            <div className="py-8 text-center text-xs opacity-70">
              <MapPin className="w-8 h-8 mx-auto text-emerald-400 animate-pulse mb-2" />
              <span>{isLocating ? 'Querying satellite GPS constellation...' : 'GPS not yet acquired'}</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Tool 6: Water Disinfection & ORS (Oral Rehydration Salts)
  // -------------------------------------------------------------
  if (toolId === 'water-ors') {
    // WHO Recipe ratios:
    // 1 Liter water = 6 level teaspoons sugar (~25g) + 1/2 level teaspoon table salt (~2.5g)
    const sugarSpoons = orsLiters * 6;
    const saltSpoons = (orsLiters * 0.5).toFixed(1);

    return (
      <div className="space-y-4">
        {/* WHO Oral Rehydration Salts (ORS) Formula Card */}
        <div
          className="p-5 rounded-3xl border shadow-lg"
          style={{ backgroundColor: 'var(--app-card)', borderColor: 'var(--app-border)' }}
        >
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                WHO Standard Formula
              </span>
              <h3 className="text-xl font-black mt-0.5" style={{ color: 'var(--app-text)' }}>
                Oral Rehydration Solution (ORS)
              </h3>
            </div>
            <Droplets className="w-6 h-6 text-emerald-400" />
          </div>

          <p className="text-xs opacity-75 mb-4" style={{ color: 'var(--app-subtext)' }}>
            Lifesaving dehydration reversal for cholera, diarrhea, heat exhaustion, and vomiting when commercial packets are unavailable.
          </p>

          {/* Liters Selector */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-bold" style={{ color: 'var(--app-text)' }}>Batch Volume:</span>
            {[0.5, 1, 2, 5].map((vol) => (
              <button
                key={vol}
                onClick={() => setOrsLiters(vol)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all active:scale-95 ${
                  orsLiters === vol
                    ? 'bg-emerald-500 text-white shadow'
                    : 'border opacity-70 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: orsLiters === vol ? undefined : 'var(--app-bg)',
                  borderColor: 'var(--app-border)',
                }}
              >
                {vol} L
              </button>
            ))}
          </div>

          {/* Dosage Breakdown */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div
              className="p-3 rounded-2xl border"
              style={{ backgroundColor: 'var(--app-bg)', borderColor: 'var(--app-border)' }}
            >
              <div className="text-2xl font-black text-blue-400">{orsLiters} L</div>
              <div className="text-[10px] font-semibold mt-1">Clean Water</div>
              <div className="text-[9px] opacity-60">Boiled or filtered</div>
            </div>

            <div
              className="p-3 rounded-2xl border"
              style={{ backgroundColor: 'var(--app-bg)', borderColor: 'var(--app-border)' }}
            >
              <div className="text-2xl font-black text-amber-400">{sugarSpoons} tsp</div>
              <div className="text-[10px] font-semibold mt-1">White Sugar</div>
              <div className="text-[9px] opacity-60">Level teaspoons ({orsLiters * 25}g)</div>
            </div>

            <div
              className="p-3 rounded-2xl border"
              style={{ backgroundColor: 'var(--app-bg)', borderColor: 'var(--app-border)' }}
            >
              <div className="text-2xl font-black text-emerald-400">{saltSpoons} tsp</div>
              <div className="text-[10px] font-semibold mt-1">Table Salt</div>
              <div className="text-[9px] opacity-60">Level teaspoon ({orsLiters * 2.5}g)</div>
            </div>
          </div>

          <div className="mt-3 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
            <strong>Rule of thumb:</strong> The solution should taste no saltier than tears. Sip slowly—drinking too fast can induce vomiting.
          </div>
        </div>

        {/* Chlorine Bleach Disinfection Table */}
        <div
          className="p-5 rounded-3xl border shadow-lg"
          style={{ backgroundColor: 'var(--app-card)', borderColor: 'var(--app-border)' }}
        >
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
                CDC Chemical Dosing
              </span>
              <h4 className="text-base font-bold mt-0.5" style={{ color: 'var(--app-text)' }}>
                Household Bleach Water Purification
              </h4>
            </div>
            <Droplets className="w-5 h-5 text-blue-400" />
          </div>

          <p className="text-xs opacity-75 mb-3" style={{ color: 'var(--app-subtext)' }}>
            Use plain unscented 5.25% to 6% sodium hypochlorite bleach.
          </p>

          <div className="space-y-2 text-xs">
            <div
              className="p-2.5 rounded-xl border flex items-center justify-between"
              style={{ backgroundColor: 'var(--app-bg)', borderColor: 'var(--app-border)' }}
            >
              <div>
                <span className="font-bold" style={{ color: 'var(--app-text)' }}>1 Liter (Quart) Clear Water</span>
              </div>
              <span className="font-mono font-bold text-emerald-400">2 drops bleach</span>
            </div>

            <div
              className="p-2.5 rounded-xl border flex items-center justify-between"
              style={{ backgroundColor: 'var(--app-bg)', borderColor: 'var(--app-border)' }}
            >
              <div>
                <span className="font-bold" style={{ color: 'var(--app-text)' }}>1 Liter Cloudy / Murky Water</span>
              </div>
              <span className="font-mono font-bold text-amber-400">4 drops bleach</span>
            </div>

            <div
              className="p-2.5 rounded-xl border flex items-center justify-between"
              style={{ backgroundColor: 'var(--app-bg)', borderColor: 'var(--app-border)' }}
            >
              <div>
                <span className="font-bold" style={{ color: 'var(--app-text)' }}>1 Gallon (3.8 Liters)</span>
              </div>
              <span className="font-mono font-bold text-emerald-400">8 drops (1/8 tsp)</span>
            </div>
          </div>

          {/* 30-Minute Standing Timer */}
          <div className="mt-4 pt-3 border-t flex items-center justify-between" style={{ borderColor: 'var(--app-border)' }}>
            <div>
              <span className="text-xs font-bold block" style={{ color: 'var(--app-text)' }}>Standing Wait Time</span>
              <span className="text-[11px] opacity-70">Wait 30 mins before drinking</span>
            </div>
            <button
              onClick={() => {
                setBoilTimerSeconds(1800); // 30 minutes
                setIsBoilTimerRunning(true);
              }}
              className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 active:scale-95"
            >
              <Clock className="w-3.5 h-3.5" />
              <span>{isBoilTimerRunning ? `${Math.floor(boilTimerSeconds / 60)}m ${boilTimerSeconds % 60}s` : 'Start 30m Timer'}</span>
            </button>
          </div>
        </div>

        {/* Boiling Elevation Guidelines */}
        <div
          className="p-4 rounded-3xl border text-xs"
          style={{ backgroundColor: 'var(--app-card)', borderColor: 'var(--app-border)' }}
        >
          <div className="flex items-center gap-2 font-bold text-emerald-400 mb-1">
            <Flame className="w-4 h-4 text-amber-500" />
            <span>Boiling Duration Standards:</span>
          </div>
          <p className="opacity-80" style={{ color: 'var(--app-subtext)' }}>
            • Sea level to 2,000 meters (6,500 ft): <strong>1 full minute</strong> rolling boil.
            <br />
            • Above 2,000 meters (lower atmospheric pressure): <strong>3 continuous minutes</strong> rolling boil.
          </p>
        </div>
      </div>
    );
  }

  return null;
};
