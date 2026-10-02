"use client";

// Premium Audio Engine for Red Orchid Films
// Dual-pipeline sound system:
// 1. Instant HTML5 Audio playback via pre-synthesized PCM 16-bit WAV for 100% iOS Safari & mobile compatibility
// 2. Web Audio API synthesizer for rich dimensional acoustics on desktop/modern hardware

const CLICK_WAV_URI =
  "data:audio/wav;base64,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";

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isSoundEnabled = true;
  private audioPool: HTMLAudioElement[] = [];
  private poolIndex = 0;

  constructor() {
    if (typeof window !== "undefined") {
      this.initAudioPool();
      this.attachUnlockListeners();
    }
  }

  private initAudioPool(): void {
    try {
      for (let i = 0; i < 4; i++) {
        const audio = new Audio(CLICK_WAV_URI);
        audio.preload = "auto";
        audio.volume = 0.75;
        this.audioPool.push(audio);
      }
    } catch {
      // Audio element not supported in current environment
    }
  }

  private attachUnlockListeners(): void {
    const handleGesture = () => {
      this.unlock();
      if (this.ctx && this.ctx.state === "running") {
        window.removeEventListener("touchend", handleGesture);
        window.removeEventListener("click", handleGesture);
      }
    };

    window.addEventListener("touchend", handleGesture, { passive: true });
    window.addEventListener("click", handleGesture, { passive: true });
  }

  public unlock(): void {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      if (ctx.state === "suspended") {
        ctx.resume().catch(() => {});
      }
    } catch {
      // Silently ignore
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    try {
      if (!this.ctx) {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          this.ctx = new AudioCtx();
        }
      }
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume().catch(() => {});
      }
      return this.ctx;
    } catch {
      return null;
    }
  }

  private lastClickTime = 0;

  // Guaranteed, zero-throw tactile click with debouncing and single-pipeline audio
  public playClick(): void {
    if (!this.isSoundEnabled) return;

    // Throttle clicks within 75ms to eliminate duplicate sounds from event bubbling
    const now = Date.now();
    if (now - this.lastClickTime < 75) {
      return;
    }
    this.lastClickTime = now;

    try {
      // 1. Mobile haptic pulse (supported on Android Chrome & modern touch browsers)
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        try {
          navigator.vibrate(8);
        } catch {}
      }

      // 2. High-fidelity Web Audio API synthesis (primary desktop & modern mobile pipeline)
      const ctx = this.getContext();
      let webAudioPlayed = false;

      if (ctx) {
        if (ctx.state === "suspended") {
          ctx.resume().catch(() => {});
        }

        if (ctx.state === "running") {
          const osc = ctx.createOscillator();
          const osc2 = ctx.createOscillator();
          const gain = ctx.createGain();
          const filter = ctx.createBiquadFilter();

          osc.type = "sine";
          osc.frequency.setValueAtTime(1800, ctx.currentTime);
          osc.frequency.exponentialRampToValueAtTime(500, ctx.currentTime + 0.035);

          osc2.type = "triangle";
          osc2.frequency.setValueAtTime(1000, ctx.currentTime);
          osc2.frequency.exponentialRampToValueAtTime(350, ctx.currentTime + 0.030);

          filter.type = "bandpass";
          filter.frequency.setValueAtTime(1300, ctx.currentTime);
          filter.Q.setValueAtTime(2.0, ctx.currentTime);

          gain.gain.setValueAtTime(0.32, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.045);

          osc.connect(filter);
          osc2.connect(filter);
          filter.connect(gain);
          gain.connect(ctx.destination);

          osc.start(ctx.currentTime);
          osc2.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 0.05);
          osc2.stop(ctx.currentTime + 0.05);
          webAudioPlayed = true;
        }
      }

      // 3. Fallback to HTML5 Audio ONLY IF Web Audio API was not played (never play both!)
      if (!webAudioPlayed && this.audioPool.length > 0) {
        const audio = this.audioPool[this.poolIndex];
        this.poolIndex = (this.poolIndex + 1) % this.audioPool.length;
        audio.currentTime = 0;
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {});
        }
      }
    } catch {
      // Guaranteed never to throw or crash caller
    }
  }

  // Ethereal Cinematic Chord for success form submission
  public playSuccess(): void {
    if (!this.isSoundEnabled) return;
    try {
      this.unlock();
      const ctx = this.getContext();
      if (!ctx) return;

      const chords = [349.23, 440.0, 523.25, 698.46];
      chords.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        const startTime = ctx.currentTime + idx * 0.04;
        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.linearRampToValueAtTime(0.12, startTime + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.8);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 1.9);
      });
    } catch {
      // Ignore
    }
  }

  // Low Muffled Tactile Error Thud for validation feedback
  public playError(): void {
    if (!this.isSoundEnabled) return;
    try {
      this.unlock();
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(140, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(45, ctx.currentTime + 0.18);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.22);
    } catch {
      // Ignore
    }
  }

  // Master Sound Toggle: Enables/disables all audio across the site with ZERO buzzing
  public toggleSound(): boolean {
    this.isSoundEnabled = !this.isSoundEnabled;
    if (this.isSoundEnabled) {
      this.unlock();
      this.playClick();
    }
    return this.isSoundEnabled;
  }

  public getIsSoundEnabled(): boolean {
    return this.isSoundEnabled;
  }
}

export const sound = new SoundEngine();
