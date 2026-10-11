// Web Audio API Synthesizer for realistic mechanical keyboard clicks & game audio

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.7;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  // Realistic mechanical switch click
  public playMechanicalClick(isSpace: boolean = false) {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const t = this.ctx.currentTime;
      const masterGain = this.ctx.createGain();
      masterGain.gain.setValueAtTime(this.volume * (isSpace ? 0.9 : 0.6), t);
      masterGain.connect(this.ctx.destination);

      // 1. High crisp tactile click (transient snap)
      const osc = this.ctx.createOscillator();
      const clickGain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(isSpace ? 480 : 1800, t);
      osc.frequency.exponentialRampToValueAtTime(isSpace ? 80 : 220, t + 0.04);
      
      clickGain.gain.setValueAtTime(0.7, t);
      clickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.045);
      
      osc.connect(clickGain);
      clickGain.connect(masterGain);
      osc.start(t);
      osc.stop(t + 0.05);

      // 2. Bottom-out thud (mechanical plastic housing resonance)
      const thudOsc = this.ctx.createOscillator();
      const thudGain = this.ctx.createGain();
      thudOsc.type = 'sine';
      thudOsc.frequency.setValueAtTime(isSpace ? 110 : 240, t);
      thudOsc.frequency.exponentialRampToValueAtTime(45, t + 0.06);

      thudGain.gain.setValueAtTime(0.5, t);
      thudGain.gain.exponentialRampToValueAtTime(0.001, t + 0.065);

      thudOsc.connect(thudGain);
      thudGain.connect(masterGain);
      thudOsc.start(t);
      thudOsc.stop(t + 0.07);

      // 3. Subtle keycap spring release ping
      if (!isSpace) {
        const pingOsc = this.ctx.createOscillator();
        const pingGain = this.ctx.createGain();
        pingOsc.type = 'sine';
        pingOsc.frequency.setValueAtTime(2900, t + 0.015);
        pingGain.gain.setValueAtTime(0.08, t + 0.015);
        pingGain.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);

        pingOsc.connect(pingGain);
        pingGain.connect(masterGain);
        pingOsc.start(t + 0.015);
        pingOsc.stop(t + 0.07);
      }
    } catch {
      // AudioContext error suppressed
    }
  }

  // Soft typing pop sound (friendly for kids)
  public playBubblePop() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, t);
      osc.frequency.exponentialRampToValueAtTime(880, t + 0.08);

      gain.gain.setValueAtTime(this.volume * 0.4, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.1);
    } catch {
      // AudioContext error suppressed
    }
  }

  // Friendly error boop
  public playErrorBoop() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, t);
      osc.frequency.setValueAtTime(110, t + 0.07);

      gain.gain.setValueAtTime(this.volume * 0.25, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.16);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.17);
    } catch {
      // AudioContext error suppressed
    }
  }

  // Victory fanfare for lesson completion
  public playVictoryFanfare() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const noteStartTime = this.ctx.currentTime + idx * 0.12;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteStartTime);

        gain.gain.setValueAtTime(this.volume * 0.4, noteStartTime);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStartTime + (idx === 3 ? 0.6 : 0.25));

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(noteStartTime);
        osc.stop(noteStartTime + (idx === 3 ? 0.65 : 0.3));
      });
    } catch {
      // AudioContext error suppressed
    }
  }

  // Authentic crowd applause / clapping sound effect for lesson completion
  public playApplause() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const bufferSize = Math.floor(this.ctx.sampleRate * 2.8);
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);

      // Generate noise buffer
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      // Play series of staggered individual claps for celebratory applause
      const startTime = this.ctx.currentTime;
      const numClaps = 38;

      for (let c = 0; c < numClaps; c++) {
        const clapTime = startTime + Math.random() * 2.4;
        const osc = this.ctx.createBufferSource();
        osc.buffer = noiseBuffer;

        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(900 + Math.random() * 600, clapTime);
        filter.Q.setValueAtTime(3.5, clapTime);

        const clapGain = this.ctx.createGain();
        const baseVolume = this.volume * (0.35 + Math.random() * 0.35);
        clapGain.gain.setValueAtTime(baseVolume, clapTime);
        clapGain.gain.exponentialRampToValueAtTime(0.001, clapTime + 0.08);

        osc.connect(filter);
        filter.connect(clapGain);
        clapGain.connect(this.ctx.destination);

        osc.start(clapTime);
        osc.stop(clapTime + 0.09);
      }
    } catch {
      // AudioContext error suppressed
    }
  }

  // Encouraging chime when student achieves great accuracy or milestone
  public playEncouragementChime() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const t = this.ctx.currentTime;
      const chimeNotes = [587.33, 880.00, 1174.66]; // D5, A5, D6
      chimeNotes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const noteTime = t + idx * 0.09;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, noteTime);

        gain.gain.setValueAtTime(this.volume * 0.35, noteTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, noteTime + 0.35);

        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(noteTime);
        osc.stop(noteTime + 0.4);
      });
    } catch {
      // AudioContext error suppressed
    }
  }

  // Speak character or word using browser SpeechSynthesis
  public speak(text: string) {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      utterance.pitch = 1.1;
      utterance.lang = 'vi-VN';
      window.speechSynthesis.speak(utterance);
    } catch {
      // Speech error suppressed
    }
  }
}

export const soundEngine = new SoundEngine();
