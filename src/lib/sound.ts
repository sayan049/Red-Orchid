"use client";

// Premium Audio & Haptics Engine for Red Orchid Films
// Synthesized via Web Audio API for 0ms latency, zero external asset dependencies, and 100% reliability

class SoundEngine {
  private ctx: AudioContext | null = null;
  private ambientGain: GainNode | null = null;
  private ambientOsc1: OscillatorNode | null = null;
  private ambientOsc2: OscillatorNode | null = null;
  private isAmbientPlaying = false;
  private isMuted = false;

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

  // Tactile Leica / Arri Shutter Click on button presses
  public playClick(): void {
    if (this.isMuted) return;
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      // High-frequency mechanical snap
      osc.type = "sine";
      osc.frequency.setValueAtTime(1400, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.025);

      filter.type = "bandpass";
      filter.frequency.setValueAtTime(1200, ctx.currentTime);
      filter.Q.setValueAtTime(3, ctx.currentTime);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.035);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.04);
    } catch {
      // Ignore if audio is restricted
    }
  }

  // Ethereal Cinematic Chord for Form Submissions & Milestones
  public playSuccess(): void {
    if (this.isMuted) return;
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
        gain.gain.linearRampToValueAtTime(0.06, startTime + 0.15);
        gain.gain.exponentialRampToValueAtTime(0.0001, startTime + 1.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 1.7);
      });

      // Mobile Haptics
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate([30, 40, 60]);
      }
    } catch {
      // Ignore
    }
  }

  // Form Error Thud + Physical Hardware Vibration
  public playError(): void {
    try {
      const ctx = this.getContext();
      if (ctx && !this.isMuted) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(90, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.18);

        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.22);
      }

      // Physical vibration on mobile devices
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate([60, 50, 70]);
      }
    } catch {
      // Ignore
    }
  }

  // Ambient Cinema Room Tone
  public toggleAmbient(): boolean {
    const ctx = this.getContext();
    if (!ctx) return false;

    if (this.isAmbientPlaying) {
      // Turn Off
      if (this.ambientGain) {
        const now = ctx.currentTime;
        this.ambientGain.gain.cancelScheduledValues(now);
        this.ambientGain.gain.setValueAtTime(this.ambientGain.gain.value, now);
        this.ambientGain.gain.exponentialRampToValueAtTime(0.00001, now + 0.5);
      }
      this.isAmbientPlaying = false;
      return false;
    } else {
      // Turn On
      if (!this.ambientGain) {
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.0001, ctx.currentTime);
        gain.connect(ctx.destination);
        this.ambientGain = gain;

        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(280, ctx.currentTime);
        filter.connect(gain);

        const osc1 = ctx.createOscillator();
        osc1.type = "sine";
        osc1.frequency.setValueAtTime(108, ctx.currentTime);
        osc1.connect(filter);
        osc1.start();
        this.ambientOsc1 = osc1;

        const osc2 = ctx.createOscillator();
        osc2.type = "triangle";
        osc2.frequency.setValueAtTime(162, ctx.currentTime);
        const subGain = ctx.createGain();
        subGain.gain.setValueAtTime(0.35, ctx.currentTime);
        osc2.connect(subGain);
        subGain.connect(filter);
        osc2.start();
        this.ambientOsc2 = osc2;
      }

      const now = ctx.currentTime;
      this.ambientGain.gain.cancelScheduledValues(now);
      this.ambientGain.gain.setValueAtTime(0.0001, now);
      this.ambientGain.gain.exponentialRampToValueAtTime(0.07, now + 0.8);
      this.isAmbientPlaying = true;
      return true;
    }
  }

  public getIsAmbientPlaying(): boolean {
    return this.isAmbientPlaying;
  }
}

export const sound = new SoundEngine();
