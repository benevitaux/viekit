import React, { useState, useEffect } from 'react';
import {
  Eye,
  Hand,
  Volume2,
  Smile,
  RotateCcw,
  Sparkles,
  Shield,
  Heart,
  ChevronRight,
  ChevronLeft,
  Wind,
} from 'lucide-react';
import { MentalToolId } from '../../types';
import { soundEngine } from '../../utils/audio';
import { useApp } from '../../context/AppContext';

interface Props {
  toolId: MentalToolId;
}

export const MentalSupportTools: React.FC<Props> = ({ toolId }) => {
  const { direction } = useApp();
  const ChevronIcon = direction === 'rtl' ? ChevronLeft : ChevronRight;
  // --- 5-4-3-2-1 Grounding State ---
  const [groundingStep, setGroundingStep] = useState(0); // 0 to 4

  // --- Calm Box Breathing State ---
  // 4s Inhale, 4s Hold, 4s Exhale, 4s Hold
  const [boxPhase, setBoxPhase] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale');
  const [boxCountdown, setBoxCountdown] = useState(4);
  const [isBoxRunning, setIsBoxRunning] = useState(false);

  // --- Physiological Sigh State ---
  // Sniff 1 (2s), Sniff 2 (1s), Long Exhale (6s)
  const [sighPhase, setSighPhase] = useState<'inhale1' | 'inhale2' | 'exhale' | 'pause'>('pause');
  const [isSighRunning, setIsSighRunning] = useState(false);

  // --- Butterfly Hug State ---
  const [butterflyActiveSide, setButterflyActiveSide] = useState<'left' | 'right'>('left');
  const [isButterflyRunning, setIsButterflyRunning] = useState(false);
  const [butterflyTapCount, setButterflyTapCount] = useState(0);

  // --- Box Breathing Interval ---
  useEffect(() => {
    let interval: number | null = null;
    if (isBoxRunning) {
      interval = window.setInterval(() => {
        setBoxCountdown((prev) => {
          if (prev <= 1) {
            setBoxPhase((currPhase) => {
              if (currPhase === 'inhale') {
                soundEngine.playCalmChime(528, 1);
                return 'hold1';
              }
              if (currPhase === 'hold1') {
                soundEngine.playCalmChime(432, 1);
                return 'exhale';
              }
              if (currPhase === 'exhale') {
                soundEngine.playCalmChime(396, 1);
                return 'hold2';
              }
              soundEngine.playCalmChime(528, 1);
              return 'inhale';
            });
            return 4;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isBoxRunning]);

  // --- Physiological Sigh Interval ---
  useEffect(() => {
    let timeout: number | null = null;
    if (isSighRunning) {
      const cycle = () => {
        // Step 1: First deep sniff (2.5s)
        setSighPhase('inhale1');
        soundEngine.playCalmChime(440, 1.5);

        timeout = window.setTimeout(() => {
          // Step 2: Second sharp top-off sniff (1.2s)
          setSighPhase('inhale2');
          soundEngine.playCalmChime(554, 0.8);

          timeout = window.setTimeout(() => {
            // Step 3: Long relaxing exhale through mouth (6.5s)
            setSighPhase('exhale');
            soundEngine.playCalmChime(330, 2);

            timeout = window.setTimeout(() => {
              if (isSighRunning) {
                cycle();
              }
            }, 6500);
          }, 1200);
        }, 2500);
      };

      cycle();
    } else {
      setSighPhase('pause');
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isSighRunning]);

  // --- Butterfly Hug Automatic Pacer ---
  useEffect(() => {
    let interval: number | null = null;
    if (isButterflyRunning) {
      interval = window.setInterval(() => {
        setButterflyActiveSide((prev) => {
          const next = prev === 'left' ? 'right' : 'left';
          setButterflyTapCount((c) => c + 1);
          if ('vibrate' in navigator) {
            try {
              navigator.vibrate(30);
            } catch {
              // Ignore
            }
          }
          return next;
        });
      }, 900); // gentle alternating pace
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isButterflyRunning]);

  // -------------------------------------------------------------
  // Tool 1: 5-4-3-2-1 Sensory Grounding
  // -------------------------------------------------------------
  if (toolId === 'grounding-54321') {
    const { direction, t } = useApp();
    const ChevronIcon = direction === 'rtl' ? ChevronLeft : ChevronRight;

    const steps = [
      {
        count: 5,
        title: t.groundingStep1Title,
        icon: Eye,
        color: 'text-blue-400',
        bg: 'bg-blue-500/10 border-blue-500/30',
        desc: t.groundingStep1Desc,
        examples: t.groundingStep1Examples,
      },
      {
        count: 4,
        title: t.groundingStep2Title,
        icon: Hand,
        color: 'text-emerald-400',
        bg: 'bg-emerald-500/10 border-emerald-500/30',
        desc: t.groundingStep2Desc,
        examples: t.groundingStep2Examples,
      },
      {
        count: 3,
        title: t.groundingStep3Title,
        icon: Volume2,
        color: 'text-amber-400',
        bg: 'bg-amber-500/10 border-amber-500/30',
        desc: t.groundingStep3Desc,
        examples: t.groundingStep3Examples,
      },
      {
        count: 2,
        title: t.groundingStep4Title,
        icon: Wind,
        color: 'text-indigo-400',
        bg: 'bg-indigo-500/10 border-indigo-500/30',
        desc: t.groundingStep4Desc,
        examples: t.groundingStep4Examples,
      },
      {
        count: 1,
        title: t.groundingStep5Title,
        icon: Smile,
        color: 'text-rose-400',
        bg: 'bg-rose-500/10 border-rose-500/30',
        desc: t.groundingStep5Desc,
        examples: t.groundingStep5Examples,
      },
    ];

    const currentStep = steps[groundingStep];
    const Icon = currentStep.icon;

    return (
      <div className="space-y-4" dir={direction}>
        <div
          className="p-6 rounded-3xl border shadow-lg text-start"
          style={{ backgroundColor: 'var(--app-card)', borderColor: 'var(--app-border)' }}
        >
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
            {t.groundingSubtitle}
          </span>
          <h3 className="text-xl font-black mt-0.5 break-words" style={{ color: 'var(--app-text)' }}>
            {t.groundingTitleLong}
          </h3>
          <p className="text-xs opacity-75 mt-1 break-words leading-relaxed" style={{ color: 'var(--app-subtext)' }}>
            {t.groundingDesc}
          </p>

          {/* Current Step Card */}
          <div className={`my-6 p-6 rounded-3xl border ${currentStep.bg} transition-all text-center`}>
            <div className="flex justify-center mb-3">
              <span className="p-3 rounded-2xl bg-black/30 border border-white/10">
                <Icon className={`w-8 h-8 ${currentStep.color}`} />
              </span>
            </div>

            <div className="text-4xl font-black font-mono mb-1 text-white">
              {currentStep.count}
            </div>

            <h4 className="text-lg font-black text-white break-words">
              {currentStep.title}
            </h4>

            <p className="text-xs text-slate-200 mt-2 font-medium break-words leading-relaxed">
              {currentStep.desc}
            </p>

            <div className="mt-4 p-3 rounded-2xl bg-black/40 border border-white/10 text-[11px] text-slate-300 text-start break-words leading-relaxed">
              <span className="font-bold opacity-80">{t.groundingIdeasLabel}</span> {currentStep.examples}
            </div>
          </div>

          {/* Step Progress Dots */}
          <div className="flex justify-center gap-2 mb-5">
            {steps.map((_, idx) => (
              <span
                key={idx}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === groundingStep ? 'bg-emerald-400 scale-125' : 'bg-slate-700'
                }`}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => {
                soundEngine.playCalmChime(528, 1);
                setGroundingStep((s) => (s + 1) % steps.length);
              }}
              className="py-3 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 active:scale-95 transition-all shadow"
            >
              <span>{groundingStep === steps.length - 1 ? t.groundingComplete : t.groundingNextStep}</span>
              <ChevronIcon className="w-4 h-4" />
            </button>

            <button
              onClick={() => setGroundingStep(0)}
              className="p-3 rounded-2xl border hover:opacity-100 opacity-60 active:scale-95"
              style={{ backgroundColor: 'var(--app-bg)', borderColor: 'var(--app-border)' }}
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Tool 2: Calm Box Breathing (4-4-4-4)
  // -------------------------------------------------------------
  if (toolId === 'calm-breathing') {
    const { direction, t } = useApp();
    const phaseNames = {
      inhale: { label: t.breathIn, sub: t.deepThroughNose, scale: 'scale-125 bg-blue-500/25 border-blue-400' },
      hold1: { label: t.holdBreath, sub: t.lungsFull, scale: 'scale-125 bg-amber-500/25 border-amber-400' },
      exhale: { label: t.breatheOut, sub: t.slowThroughMouth, scale: 'scale-90 bg-emerald-500/25 border-emerald-400' },
      hold2: { label: t.holdBreath, sub: t.lungsEmpty, scale: 'scale-90 bg-purple-500/25 border-purple-400' },
    };

    const currentPhaseData = phaseNames[boxPhase];

    return (
      <div className="space-y-4" dir={direction}>
        <div
          className="p-6 rounded-3xl border shadow-lg text-start"
          style={{ backgroundColor: 'var(--app-card)', borderColor: 'var(--app-border)' }}
        >
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
            {t.calmBreathingSubtitle}
          </span>
          <h3 className="text-xl font-black mt-0.5 break-words" style={{ color: 'var(--app-text)' }}>
            {t.calmBreathingTitleLong}
          </h3>
          <p className="text-xs opacity-75 mt-1 break-words leading-relaxed" style={{ color: 'var(--app-subtext)' }}>
            {t.calmBreathingDesc}
          </p>

          {/* Animated Circle */}
          <div className="my-8 flex justify-center items-center h-48">
            <div
              className={`w-40 h-40 rounded-full border-4 flex flex-col items-center justify-center transition-all duration-1000 shadow-2xl ${
                isBoxRunning ? currentPhaseData.scale : 'bg-slate-800/40 border-slate-700'
              }`}
            >
              <span className="text-3xl font-black font-mono" style={{ color: 'var(--app-text)' }}>
                {isBoxRunning ? boxCountdown : '4'}
              </span>
              <span className="text-xs font-black uppercase mt-1 text-emerald-400 break-words px-2 text-center">
                {isBoxRunning ? currentPhaseData.label : t.ready}
              </span>
              <span className="text-[10px] opacity-70 break-words px-2 text-center mt-0.5">
                {isBoxRunning ? currentPhaseData.sub : t.tapStartBelow}
              </span>
            </div>
          </div>

          <div className="flex justify-center">
            <button
              onClick={() => {
                if (!isBoxRunning) {
                  soundEngine.playCalmChime(528, 1);
                }
                setIsBoxRunning(!isBoxRunning);
              }}
              className={`py-3.5 px-8 rounded-2xl font-black text-xs uppercase tracking-wider transition-all active:scale-95 shadow-lg ${
                isBoxRunning
                  ? 'bg-amber-600 hover:bg-amber-500 text-white'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              {isBoxRunning ? t.pauseBreathing : t.beginBoxBreathing}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Tool 3: Physiological Sigh
  // -------------------------------------------------------------
  if (toolId === 'physiological-sigh') {
    return (
      <div className="space-y-4">
        <div
          className="p-6 rounded-3xl border shadow-lg text-center"
          style={{ backgroundColor: 'var(--app-card)', borderColor: 'var(--app-border)' }}
        >
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
            Neurobiology Fast Reset
          </span>
          <h3 className="text-xl font-black mt-0.5" style={{ color: 'var(--app-text)' }}>
            Physiological Sigh
          </h3>
          <p className="text-xs opacity-75 mt-1" style={{ color: 'var(--app-subtext)' }}>
            Two deep sniffs in through nose + long slow mouth exhale. Immediately expels accumulated CO2 and lowers heart rate.
          </p>

          <div className="my-8 p-6 rounded-3xl bg-slate-800/50 border border-slate-700 max-w-sm mx-auto">
            {sighPhase === 'inhale1' && (
              <div className="text-blue-400 animate-pulse">
                <Wind className="w-12 h-12 mx-auto mb-2" />
                <h4 className="text-lg font-black uppercase">1st Deep Inhale</h4>
                <p className="text-xs opacity-80 mt-1">Deep breath in through your nose (filling 80%)</p>
              </div>
            )}
            {sighPhase === 'inhale2' && (
              <div className="text-emerald-400 animate-pulse">
                <Sparkles className="w-12 h-12 mx-auto mb-2" />
                <h4 className="text-lg font-black uppercase">2nd Quick Sip In!</h4>
                <p className="text-xs opacity-80 mt-1">Sharp top-off sip through nose to pop open alveoli</p>
              </div>
            )}
            {sighPhase === 'exhale' && (
              <div className="text-amber-400">
                <Heart className="w-12 h-12 mx-auto mb-2 animate-bounce" />
                <h4 className="text-lg font-black uppercase">Long Slow Exhale...</h4>
                <p className="text-xs opacity-80 mt-1">Slow, soft sigh through relaxed mouth (6 seconds)</p>
              </div>
            )}
            {sighPhase === 'pause' && (
              <div className="opacity-70">
                <Wind className="w-12 h-12 mx-auto mb-2" />
                <h4 className="text-base font-bold">Ready to Practice</h4>
                <p className="text-xs mt-1">Tap start below to follow the visual guidance rhythm.</p>
              </div>
            )}
          </div>

          <button
            onClick={() => setIsSighRunning(!isSighRunning)}
            className={`py-3.5 px-8 rounded-2xl font-black text-xs uppercase tracking-wider transition-all active:scale-95 shadow-lg ${
              isSighRunning
                ? 'bg-amber-600 hover:bg-amber-500 text-white'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {isSighRunning ? 'Stop Exercise' : 'Start Physiological Sigh'}
          </button>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Tool 4: STOP Crisis Technique
  // -------------------------------------------------------------
  if (toolId === 'stop-crisis') {
    const letters = [
      {
        letter: 'S',
        word: 'STOP',
        desc: 'Pause! Do not react immediately. Freeze your physical body for 5 seconds so adrenaline does not make decisions.',
      },
      {
        letter: 'T',
        word: 'TAKE A BREATH',
        desc: 'Take one slow, deep breath. Focus solely on the sensation of air filling and emptying your lungs.',
      },
      {
        letter: 'O',
        word: 'OBSERVE',
        desc: 'Notice what is happening inside you (racing heart, fear) and outside you (facts of the situation). Stick to objective reality without catastrophizing.',
      },
      {
        letter: 'P',
        word: 'PROCEED EFFECTIVELY',
        desc: 'Ask: "What single constructive step will make this situation safer right now?" Act with calm deliberation.',
      },
    ];

    return (
      <div className="space-y-4">
        <div
          className="p-6 rounded-3xl border shadow-lg"
          style={{ backgroundColor: 'var(--app-card)', borderColor: 'var(--app-border)' }}
        >
          <div className="text-center mb-4">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
              Crisis Survival Protocol
            </span>
            <h3 className="text-xl font-black mt-0.5" style={{ color: 'var(--app-text)' }}>
              STOP Crisis Technique
            </h3>
            <p className="text-xs opacity-75 mt-1" style={{ color: 'var(--app-subtext)' }}>
              Prevents impulsivity and panic-induced bad decisions in high-stress emergencies.
            </p>
          </div>

          <div className="space-y-3">
            {letters.map((item) => (
              <div
                key={item.letter}
                className="p-4 rounded-2xl border flex items-start gap-3.5"
                style={{ backgroundColor: 'var(--app-bg)', borderColor: 'var(--app-border)' }}
              >
                <span className="w-10 h-10 rounded-xl bg-red-600/20 border border-red-500/40 text-red-400 font-black text-xl flex items-center justify-center shrink-0">
                  {item.letter}
                </span>
                <div>
                  <h4 className="text-sm font-extrabold text-white">{item.word}</h4>
                  <p className="text-xs opacity-80 mt-1 leading-relaxed" style={{ color: 'var(--app-subtext)' }}>
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Tool 5: Somatic & Butterfly Hug
  // -------------------------------------------------------------
  if (toolId === 'somatic-butterfly') {
    return (
      <div className="space-y-4">
        <div
          className="p-6 rounded-3xl border shadow-lg text-center"
          style={{ backgroundColor: 'var(--app-card)', borderColor: 'var(--app-border)' }}
        >
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
            Bilateral Stimulation (EMDR-Based)
          </span>
          <h3 className="text-xl font-black mt-0.5" style={{ color: 'var(--app-text)' }}>
            Somatic & Butterfly Hug
          </h3>
          <p className="text-xs opacity-75 mt-1" style={{ color: 'var(--app-subtext)' }}>
            Cross arms over chest. Tap left and right collarbones alternately like the gentle flapping of butterfly wings.
          </p>

          {/* Interactive Alternating Tap Visual */}
          <div className="my-6 grid grid-cols-2 gap-4 max-w-xs mx-auto">
            <div
              className={`p-6 rounded-3xl border-2 flex flex-col items-center justify-center transition-all ${
                butterflyActiveSide === 'left' && isButterflyRunning
                  ? 'bg-emerald-500 border-white text-white scale-105 shadow-xl shadow-emerald-500/40'
                  : 'bg-slate-800/40 border-slate-700 opacity-60'
              }`}
            >
              <Hand className="w-8 h-8" />
              <span className="text-xs font-black uppercase mt-2">Left Tap</span>
            </div>

            <div
              className={`p-6 rounded-3xl border-2 flex flex-col items-center justify-center transition-all ${
                butterflyActiveSide === 'right' && isButterflyRunning
                  ? 'bg-emerald-500 border-white text-white scale-105 shadow-xl shadow-emerald-500/40'
                  : 'bg-slate-800/40 border-slate-700 opacity-60'
              }`}
            >
              <Hand className="w-8 h-8" />
              <span className="text-xs font-black uppercase mt-2">Right Tap</span>
            </div>
          </div>

          <div className="text-xs font-mono font-bold opacity-75 mb-4">
            {butterflyTapCount} bilateral taps completed
          </div>

          <button
            onClick={() => setIsButterflyRunning(!isButterflyRunning)}
            className={`py-3.5 px-8 rounded-2xl font-black text-xs uppercase tracking-wider transition-all active:scale-95 shadow-lg ${
              isButterflyRunning
                ? 'bg-amber-600 hover:bg-amber-500 text-white'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {isButterflyRunning ? 'Pause Pacing' : 'Start Butterfly Hug Guide'}
          </button>
        </div>
      </div>
    );
  }

  return null;
};
