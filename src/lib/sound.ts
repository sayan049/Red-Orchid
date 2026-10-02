"use client";

// Premium Audio Engine for Red Orchid Films
// Master sound manager with robust mobile WebKit audio unlock & mobile speaker acoustic tuning

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isSoundEnabled = true;
  private isUnlocked = false;

  constructor() {
    if (typeof window !== "undefined") {
      this.attachUnlockListeners();
    }
  }

  // iOS Safari & Android WebKit require user gesture to unlock Web Audio API
  private attachUnlockListeners(): void {
    const unlock = () => {
      this.unlock();
      window.removeEventListener("touchstart", unlock);
      window.removeEventListener("touchend", unlock);
      window.removeEventListener("click", unlock);
    };

    window.addEventListener("touchstart", unlock, { passive: true, once: true });
    window.addEventListener("touchend", unlock, { passive: true, once: true });
    window.addEventListener("click", unlock, { passive: true, once: true });
  }

  public unlock(): void {
    if (this.isUnlocked) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      if (ctx.state === "suspended") {
        ctx.resume().catch(() => {});
      }

      // Play a silent 1-sample buffer to force iOS WebKit audio hardware to engage
      const buffer = ctx.createBuffer(1, 1, 22050);
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.connect(ctx.destination);
      source.start(0);

      this.isUnlocked = true;
    } catch {
      // Audio permission restricted
    }
  }

  private getContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
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
  }

  // Punchy, tactile mechanical click (Arri/Leica shutter feel) tuned for mobile speakers & headphones
  public playClick(): void {
    if (!this.isSoundEnabled) return;
    try {
      this.unlock();
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Primary crisp impulse (1900Hz -> 550Hz, audible on mobile phone speakers)
      osc.type = "sine";
      osc.frequency.setValueAtTime(1900, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(550, ctx.currentTime + 0.032);

      // Secondary metallic body harmonic (1100Hz -> 380Hz)
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(1100, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(380, ctx.currentTime + 0.028);

      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1300, ctx.currentTime);
      filter.Q.setValueAtTime(2.2, ctx.currentTime);

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
    } catch {
      // Ignore if audio is restricted
    }
  }

  // Ethereal Cinematic Chord - strictly for successful form submission
  public playSuccess(): void {
    if (!this.isSoundEnabled) return;
    try {
      this.unlock();
      const ctx = this.getContext();
      if (!ctx) return;

      const chords = [349.23, 440.0, 523.25, 698.46]; // F Major Cinematic Triad (Audible range on mobile)
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

  // Master Sound Toggle: Enables/disables all audio across the site with ZERO continuous buzz
  public toggleSound(): boolean {
    this.isSoundEnabled = !this.isSoundEnabled;
    if (this.isSoundEnabled) {
      this.unlock();
      // Play a soft luxury acoustic chime confirming audio is active
      try {
        const ctx = this.getContext();
        if (ctx) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(528, ctx.currentTime); // 528Hz Solfeggio frequency
          osc.frequency.exponentialRampToValueAtTime(792, ctx.currentTime + 0.2);

          gain.gain.setValueAtTime(0.12, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);

          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime);
          osc.stop(ctx.currentTime + 0.45);
        }
      } catch {}
    }
    return this.isSoundEnabled;
  }

  public getIsSoundEnabled(): boolean {
    return this.isSoundEnabled;
  }
}

export const sound = new SoundEngine();
