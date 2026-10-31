import React, { useState, useEffect } from 'react';
import {
  Heart,
  Activity,
  Clock,
  Play,
  Pause,
  RotateCcw,
  Plus,
  Trash2,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { MedicalToolId } from '../../types';
import { soundEngine } from '../../utils/audio';

interface Props {
  toolId: MedicalToolId;
}

export const MedicalTools: React.FC<Props> = ({ toolId }) => {
  const { tourniquetLogs, addTourniquetLog, removeTourniquetLog, t } = useApp();

  // --- CPR Assistant State ---
  const [isCprRunning, setIsCprRunning] = useState(false);
  const [cprCount, setCprCount] = useState(0); // 0 to 30
  const [cprCycles, setCprCycles] = useState(1);
  const [isBreathPhase, setIsBreathPhase] = useState(false);
  const [cprPatientMode, setCprPatientMode] = useState<'adult' | 'child'>('adult');

  // --- Pulse Counter State ---
  const [tapTimestamps, setTapTimestamps] = useState<number[]>([]);
  const [measuredBpm, setMeasuredBpm] = useState<number | null>(null);

  // --- Tourniquet State ---
  const [selectedLimb, setSelectedLimb] = useState<'Right Arm' | 'Left Arm' | 'Right Leg' | 'Left Leg'>('Right Arm');
  const [tourniquetNotes, setTourniquetNotes] = useState('');
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Tick for tourniquet elapsed time
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  // --- CPR Metronome Loop ---
  // 110 BPM = 545.45 ms per beat
  useEffect(() => {
    let interval: number | null = null;
    if (isCprRunning) {
      const beatIntervalMs = Math.round((60 / 110) * 1000); // 545ms
      interval = window.setInterval(() => {
        setCprCount((prev) => {
          const next = prev + 1;
          if (next === 30) {
            // Trigger breath reminder sound
            soundEngine.playCprTick(true);
            setIsBreathPhase(true);
            setTimeout(() => {
              setIsBreathPhase(false);
              setCprCount(0);
              setCprCycles((c) => c + 1);
            }, 3000); // 3 seconds pause for 2 rescue breaths
            return 30;
          } else if (next > 30) {
            return 30;
          } else {
            soundEngine.playCprTick(false);
            return next;
          }
        });
      }, beatIntervalMs);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isCprRunning]);

  const handleResetCpr = () => {
    setIsCprRunning(false);
    setCprCount(0);
    setCprCycles(1);
    setIsBreathPhase(false);
  };

  // --- Pulse Tap Handler ---
  const handlePulseTap = () => {
    const now = Date.now();
    const updated = [...tapTimestamps, now].slice(-8); // keep last 8 taps
    setTapTimestamps(updated);

    // Audio click for feedback
    soundEngine.playCprTick(false);

    if (updated.length >= 3) {
      const intervals: number[] = [];
      for (let i = 1; i < updated.length; i++) {
        intervals.push(updated[i] - updated[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      if (avgInterval > 0) {
        const bpm = Math.round(60000 / avgInterval);
        if (bpm >= 30 && bpm <= 240) {
          setMeasuredBpm(bpm);
        }
      }
    }
  };

  const handleResetPulse = () => {
    setTapTimestamps([]);
    setMeasuredBpm(null);
  };

  // --- Pulse Category helper ---
  const getPulseCategory = (bpm: number | null) => {
    if (!bpm) return null;
    if (bpm < 60) {
      return { label: 'Bradycardia (Slow)', color: 'text-blue-400', desc: 'Lower than typical resting rate. Normal in trained athletes.' };
    }
    if (bpm <= 100) {
      return { label: 'Normal Resting Range (60-100)', color: 'text-emerald-400', desc: 'Standard healthy adult resting rate.' };
    }
    if (bpm <= 130) {
      return { label: 'Elevated / Tachycardia', color: 'text-amber-400', desc: 'Elevated rate: stress, exertion, shock, fever, or dehydration.' };
    }
    return { label: 'Severe Tachycardia (>130)', color: 'text-red-400', desc: 'Critical rate: possible hemorrhage, hypovolemic shock, or arrhythmia.' };
  };

  // --- Tourniquet Add ---
  const handleAddTourniquet = () => {
    addTourniquetLog({
      timestamp: Date.now(),
      limb: selectedLimb,
      appliedBy: 'First Responder',
      notes: tourniquetNotes.trim() || 'Arterial Bleeding Control',
    });
    setTourniquetNotes('');
  };

  // -------------------------------------------------------------
  // Tool 1: CPR Assistant
  // -------------------------------------------------------------
  if (toolId === 'cpr') {
    return (
      <div className="space-y-4">
        <div
          className="p-5 rounded-3xl border shadow-lg text-center relative overflow-hidden"
          style={{ backgroundColor: 'var(--app-card)', borderColor: 'var(--app-border)' }}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              ERC / AHA Resuscitation Protocol
            </span>
            <div className="flex items-center gap-1.5 bg-slate-800/80 p-1 rounded-xl border border-slate-700 text-xs">
              <button
                onClick={() => setCprPatientMode('adult')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  cprPatientMode === 'adult' ? 'bg-emerald-600 text-white' : 'opacity-60'
                }`}
              >
                Adult
              </button>
              <button
                onClick={() => setCprPatientMode('child')}
                className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                  cprPatientMode === 'child' ? 'bg-emerald-600 text-white' : 'opacity-60'
                }`}
              >
                Child
              </button>
            </div>
          </div>

          <h3 className="text-xl font-black" style={{ color: 'var(--app-text)' }}>
            CPR Assistant (110 BPM Metronome)
          </h3>

          {/* Central Compression Counter & Pulsing Heart */}
          <div className="my-6 relative flex flex-col items-center justify-center">
            <div
              className={`w-40 h-40 rounded-full flex flex-col items-center justify-center border-4 shadow-2xl transition-all ${
                isBreathPhase
                  ? 'bg-blue-600 border-blue-300 text-white animate-pulse'
                  : isCprRunning
                  ? 'bg-red-600/20 border-red-500 text-red-500 scale-105'
                  : 'bg-slate-800/40 border-slate-700 text-slate-400'
              }`}
            >
              {isBreathPhase ? (
                <>
                  <Activity className="w-10 h-10 animate-bounce" />
                  <span className="text-sm font-black uppercase mt-1">2 BREATHS!</span>
                  <span className="text-[10px] opacity-80">Pinch nose, seal lips</span>
                </>
              ) : (
                <>
                  <Heart
                    className={`w-10 h-10 transition-transform ${
                      isCprRunning ? 'scale-125 text-red-500' : 'text-slate-500'
                    }`}
                  />
                  <span className="text-4xl font-black font-mono mt-1" style={{ color: 'var(--app-text)' }}>
                    {cprCount}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider opacity-70">
                    of 30 compressions
                  </span>
                </>
              )}
            </div>

            {/* Cycle Status */}
            <div className="mt-3 text-xs font-semibold" style={{ color: 'var(--app-subtext)' }}>
              Cycle <span className="text-emerald-400 font-bold font-mono">#{cprCycles}</span> • Target: 100-120 compressions/min
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-3 max-w-xs mx-auto">
            <button
              onClick={() => setIsCprRunning(!isCprRunning)}
              className={`flex-1 py-3.5 px-4 rounded-2xl font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg ${
                isCprRunning
                  ? 'bg-amber-600 hover:bg-amber-500 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {isCprRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              <span>{isCprRunning ? 'PAUSE' : 'START CPR'}</span>
            </button>

            <button
              onClick={handleResetCpr}
              className="p-3.5 rounded-2xl border hover:opacity-100 opacity-70 active:scale-95"
              style={{ backgroundColor: 'var(--app-bg)', borderColor: 'var(--app-border)' }}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Compression Guidelines Reference */}
        <div
          className="p-4 rounded-3xl border text-xs space-y-1.5"
          style={{ backgroundColor: 'var(--app-card)', borderColor: 'var(--app-border)' }}
        >
          <div className="font-bold text-sm text-emerald-400 flex items-center gap-1.5">
            <Info className="w-4 h-4" />
            <span>Key Resuscitation Rules:</span>
          </div>
          <p className="opacity-80" style={{ color: 'var(--app-subtext)' }}>
            • <strong>Depth:</strong> Push down 5 to 6 cm (2 to 2.4 inches) in center of chest.
            <br />
            • <strong>Recoil:</strong> Allow full chest wall recoil between each compression. Do not lean on chest.
            <br />
            • <strong>Ratio:</strong> 30 chest compressions followed by 2 gentle rescue breaths (1 sec each).
          </p>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Tool 2: Pulse Tap Counter
  // -------------------------------------------------------------
  if (toolId === 'pulse') {
    const pulseInfo = getPulseCategory(measuredBpm);

    return (
      <div className="space-y-4">
        <div
          className="p-5 rounded-3xl border shadow-lg text-center"
          style={{ backgroundColor: 'var(--app-card)', borderColor: 'var(--app-border)' }}
        >
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
            Acoustic & Tactile Sensor
          </span>
          <h3 className="text-xl font-black mt-0.5" style={{ color: 'var(--app-text)' }}>
            Pulse / Heart Rate Tap Counter
          </h3>
          <p className="text-xs opacity-75 mt-1" style={{ color: 'var(--app-subtext)' }}>
            Place two fingers on radial (wrist) or carotid (neck) artery. Tap button on each heart pulse.
          </p>

          {/* Measured BPM display */}
          <div className="my-6">
            <div className="text-5xl font-black font-mono tracking-tight" style={{ color: 'var(--app-text)' }}>
              {measuredBpm !== null ? measuredBpm : '--'}
            </div>
            <span className="text-xs font-bold uppercase tracking-widest opacity-70">
              Beats Per Minute (BPM)
            </span>

            {pulseInfo && (
              <div className="mt-3 p-3 rounded-2xl bg-slate-800/60 border border-slate-700 max-w-sm mx-auto">
                <div className={`text-xs font-black uppercase ${pulseInfo.color}`}>
                  {pulseInfo.label}
                </div>
                <div className="text-[11px] opacity-75 mt-0.5" style={{ color: 'var(--app-subtext)' }}>
                  {pulseInfo.desc}
                </div>
              </div>
            )}
          </div>

          {/* Big Tap Area */}
          <div className="flex justify-center mb-4">
            <button
              onClick={handlePulseTap}
              className="w-36 h-36 rounded-full bg-red-600/20 hover:bg-red-600/30 border-4 border-red-500/50 flex flex-col items-center justify-center text-red-400 active:scale-90 transition-all shadow-xl"
            >
              <Heart className="w-10 h-10 animate-pulse text-red-500" />
              <span className="text-xs font-black uppercase mt-1 tracking-wider">TAP PULSE</span>
              <span className="text-[10px] opacity-70">({tapTimestamps.length} taps recorded)</span>
            </button>
          </div>

          {/* Reset */}
          {measuredBpm !== null && (
            <button
              onClick={handleResetPulse}
              className="px-3 py-1.5 rounded-xl border text-xs font-bold opacity-75 hover:opacity-100 active:scale-95"
              style={{ backgroundColor: 'var(--app-bg)', borderColor: 'var(--app-border)' }}
            >
              Reset Measurement
            </button>
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Tool 3: Tourniquet Time Log
  // -------------------------------------------------------------
  if (toolId === 'tourniquet') {
    return (
      <div className="space-y-4">
        {/* Record New Tourniquet Card */}
        <div
          className="p-5 rounded-3xl border shadow-lg"
          style={{ backgroundColor: 'var(--app-card)', borderColor: 'var(--app-border)' }}
        >
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-red-400">
                Arterial Hemorrhage Protocol
              </span>
              <h3 className="text-xl font-black mt-0.5" style={{ color: 'var(--app-text)' }}>
                Tourniquet Time Log
              </h3>
            </div>
            <Clock className="w-6 h-6 text-red-400" />
          </div>

          <p className="text-xs opacity-75 mb-4" style={{ color: 'var(--app-subtext)' }}>
            Documenting the exact application time is critical for preventing limb loss and guiding hospital trauma surgeons.
          </p>

          {/* Limb Selector */}
          <label className="text-xs font-bold block mb-1.5" style={{ color: 'var(--app-text)' }}>
            Select Casualty Limb:
          </label>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {(['Right Arm', 'Left Arm', 'Right Leg', 'Left Leg'] as const).map((limb) => (
              <button
                key={limb}
                onClick={() => setSelectedLimb(limb)}
                className={`p-2.5 rounded-xl text-xs font-bold border transition-all active:scale-95 ${
                  selectedLimb === limb
                    ? 'bg-red-600 border-red-500 text-white shadow'
                    : 'opacity-70 hover:opacity-100'
                }`}
                style={{
                  backgroundColor: selectedLimb === limb ? undefined : 'var(--app-bg)',
                  borderColor: 'var(--app-border)',
                }}
              >
                {limb}
              </button>
            ))}
          </div>

          {/* Notes Input */}
          <input
            type="text"
            value={tourniquetNotes}
            onChange={(e) => setTourniquetNotes(e.target.value)}
            placeholder="Notes (e.g., wound type, windlass tight, pulse absent)..."
            className="w-full p-3 rounded-xl border text-xs outline-none mb-3"
            style={{
              backgroundColor: 'var(--app-bg)',
              borderColor: 'var(--app-border)',
              color: 'var(--app-text)',
            }}
          />

          <button
            onClick={handleAddTourniquet}
            className="w-full py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2 active:scale-95 transition-all shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>Record Tourniquet Applied Now</span>
          </button>
        </div>

        {/* Active Tourniquets List */}
        <div className="space-y-3">
          <h4 className="text-sm font-bold px-1" style={{ color: 'var(--app-text)' }}>
            Active Applied Tourniquets ({tourniquetLogs.length})
          </h4>

          {tourniquetLogs.length === 0 ? (
            <div
              className="p-5 rounded-2xl border text-center text-xs opacity-60"
              style={{ backgroundColor: 'var(--app-card)', borderColor: 'var(--app-border)' }}
            >
              No active tourniquets recorded.
            </div>
          ) : (
            tourniquetLogs.map((item) => {
              const elapsedMinutes = Math.floor((currentTime - item.timestamp) / 60000);
              const elapsedSeconds = Math.floor(((currentTime - item.timestamp) % 60000) / 1000);
              const appliedDate = new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

              // Interval safety color:
              // < 60 min: Safe window (green)
              // 60-120 min: Caution (amber)
              // > 120 min: Critical ischemic risk (red)
              const statusColor =
                elapsedMinutes < 60
                  ? 'border-emerald-500/50 bg-emerald-950/20 text-emerald-400'
                  : elapsedMinutes < 120
                  ? 'border-amber-500/60 bg-amber-950/25 text-amber-400'
                  : 'border-red-500 bg-red-950/30 text-red-400 animate-pulse';

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border shadow transition-all ${statusColor}`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-black tracking-wider block opacity-75">
                        {item.limb}
                      </span>
                      <div className="text-xl font-black font-mono">
                        {elapsedMinutes}m {elapsedSeconds}s elapsed
                      </div>
                    </div>
                    <button
                      onClick={() => removeTourniquetLog(item.id)}
                      className="p-2 rounded-xl bg-black/20 hover:bg-black/40 text-red-300"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-2 text-xs opacity-80 flex items-center justify-between">
                    <span>Applied at: <strong>{appliedDate}</strong></span>
                    <span>T-Time written on forehead</span>
                  </div>

                  {item.notes && (
                    <div className="mt-2 text-xs pt-2 border-t border-slate-700/40 opacity-90">
                      Note: {item.notes}
                    </div>
                  )}

                  {elapsedMinutes >= 120 && (
                    <div className="mt-2 text-xs font-bold text-red-400 flex items-center gap-1.5">
                      <AlertTriangle className="w-4 h-4" />
                      <span>CRITICAL: Elapsed time exceeds 2 hours. Rush to trauma surgery.</span>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Warning card */}
        <div className="p-3.5 rounded-2xl bg-red-950/40 border border-red-900/50 text-xs text-red-200">
          <strong>CRITICAL SAFETY RULE:</strong> Do NOT loosen, take off, or periodically release a tourniquet once tightened. Releasing causes hypovolemic cardiac arrest and release of toxic hyperkalemic metabolites into circulation.
        </div>
      </div>
    );
  }

  return null;
};
