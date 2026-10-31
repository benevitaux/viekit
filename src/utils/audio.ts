/**
 * Web Audio API synthesizer for offline sound generation.
 * No external sound files or internet connection required!
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private activeOscillators: OscillatorNode[] = [];
  private activeGainNodes: GainNode[] = [];
  private alarmInterval: number | null = null;
  private cprInterval: number | null = null;

  private initCtx(): AudioContext {
    if (!this.ctx || this.ctx.state === 'closed') {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtxClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * Loud dual-tone rescue whistle burst
   */
  public playWhistleBurst(durationMs = 900) {
    const ctx = this.initCtx();
    const now = ctx.currentTime;

    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.type = 'triangle';
    osc2.type = 'sine';

    // Dual resonant whistle peak frequencies (simulate physical chamber dissonance)
    osc1.frequency.setValueAtTime(2850, now);
    osc2.frequency.setValueAtTime(3120, now);

    // Modulation
    const lfo = ctx.createOscillator();
    const lfoGain = ctx.createGain();
    lfo.frequency.setValueAtTime(25, now);
    lfoGain.gain.setValueAtTime(40, now);
    lfo.connect(osc1.frequency);
    lfo.start(now);

    gainNode.gain.setValueAtTime(0.001, now);
    gainNode.gain.exponentialRampToValueAtTime(0.9, now + 0.04);
    gainNode.gain.setValueAtTime(0.9, now + durationMs / 1000 - 0.08);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + durationMs / 1000);

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.start(now);
    osc2.start(now);

    osc1.stop(now + durationMs / 1000);
    osc2.stop(now + durationMs / 1000);
    lfo.stop(now + durationMs / 1000);

    // Haptic pulse if supported
    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(durationMs);
      } catch {
        // Ignore
      }
    }
  }

  /**
   * Continuous Emergency Alarm Siren
   */
  public startAlarmSiren() {
    this.stopAlarmSiren();
    const ctx = this.initCtx();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';

    gain.gain.setValueAtTime(0.8, ctx.currentTime);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();

    let high = false;
    const sweep = () => {
      const t = ctx.currentTime;
      if (high) {
        osc.frequency.cancelScheduledValues(t);
        osc.frequency.linearRampToValueAtTime(800, t + 0.35);
      } else {
        osc.frequency.cancelScheduledValues(t);
        osc.frequency.linearRampToValueAtTime(1400, t + 0.35);
      }
      high = !high;
    };

    sweep();
    this.alarmInterval = window.setInterval(sweep, 350);
    this.activeOscillators.push(osc);
    this.activeGainNodes.push(gain);

    if ('vibrate' in navigator) {
      try {
        navigator.vibrate([350, 100, 350, 100]);
      } catch {
        // Ignore
      }
    }
  }

  public stopAlarmSiren() {
    if (this.alarmInterval) {
      clearInterval(this.alarmInterval);
      this.alarmInterval = null;
    }
    this.activeOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // Ignore
      }
    });
    this.activeGainNodes.forEach((g) => {
      try {
        g.disconnect();
      } catch {
        // Ignore
      }
    });
    this.activeOscillators = [];
    this.activeGainNodes = [];
  }

  /**
   * Play single CPR Metronome click / woodblock tone
   */
  public playCprTick(isBreathCue = false) {
    const ctx = this.initCtx();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    if (isBreathCue) {
      // Distinct double high chime for rescue breath reminder
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, now);
      gain.gain.setValueAtTime(0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    } else {
      // Sharp percussive woodblock click
      osc.type = 'sine';
      osc.frequency.setValueAtTime(750, now);
      osc.frequency.exponentialRampToValueAtTime(120, now + 0.05);
      gain.gain.setValueAtTime(0.8, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    }

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + (isBreathCue ? 0.25 : 0.06));

    if ('vibrate' in navigator) {
      try {
        navigator.vibrate(isBreathCue ? [40, 40, 40] : 30);
      } catch {
        // Ignore
      }
    }
  }

  /**
   * Play soothing chime for breathing guide (432 Hz bell)
   */
  public playCalmChime(frequency = 432, duration = 1.2) {
    const ctx = this.initCtx();
    const now = ctx.currentTime;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(frequency, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(0.35, now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  }
}

export const soundEngine = new SoundEngine();
