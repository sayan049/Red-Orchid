"use client";

// Premium Audio Engine for Red Orchid Films
// Master sound manager with zero continuous buzz or electric hum

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isSoundEnabled = true;

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

  // Punchy, tactile mechanical click (Arri/Leica shutter feel)
  public playClick(): void {
    if (!this.isSoundEnabled) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // Primary crisp impulse
      osc.type = "sine";
      osc.frequency.setValueAtTime(1600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 0.035);

      // Secondary metallic body harmonic
      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(800, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.03);

      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1400, ctx.currentTime);
      filter.Q.setValueAtTime(2.5, ctx.currentTime);

      gain.gain.setValueAtTime(0.24, ctx.currentTime);
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
      const ctx = this.getContext();
      if (!ctx) return;

      const chords = [174.61, 220.0, 261.63, 349.23]; // F Major Cinematic Triad
      chords.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        const startTime = ctx.currentTime + idx * 0.04;
        gain.gain.setValueAtTime(0.0001, startTime);
        gain.gain.linearRampToValueAtTime(0.09, startTime + 0.15);
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
      // Play a soft luxury acoustic chime confirming audio is active
      try {
        const ctx = this.getContext();
        if (ctx) {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = "sine";
          osc.frequency.setValueAtTime(528, ctx.currentTime); // 528Hz Solfeggio frequency
          osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.2);

          gain.gain.setValueAtTime(0.08, ctx.currentTime);
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
