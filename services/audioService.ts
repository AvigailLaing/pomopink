
class AudioService {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  // A soft, crystalline "ping" instead of a "bloop"
  playPop() {
    if (this.isMuted) return;
    this.init();
    const now = this.ctx!.currentTime;
    
    // Core tone
    const osc = this.ctx!.createOscillator();
    const gain = this.ctx!.createGain();

    osc.type = 'sine';
    // Stable, higher frequency for a "clean" feel
    osc.frequency.setValueAtTime(1100, now);
    osc.frequency.exponentialRampToValueAtTime(1080, now + 0.06);

    gain.gain.setValueAtTime(0.05, now); // Lower volume to prevent grating
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx!.destination);

    osc.start(now);
    osc.stop(now + 0.06);

    // Subtle high-frequency overtone for "sparkle"
    const osc2 = this.ctx!.createOscillator();
    const gain2 = this.ctx!.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(2200, now);
    gain2.gain.setValueAtTime(0.02, now);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
    osc2.connect(gain2);
    gain2.connect(this.ctx!.destination);
    osc2.start(now);
    osc2.stop(now + 0.03);
  }

  // A sparkling major-arpeggio chime for task completion
  playSuccess() {
    if (this.isMuted) return;
    this.init();
    const now = this.ctx!.currentTime;
    
    // Magical sparkle arpeggio (C6, E6, G6, C7)
    const notes = [1046.50, 1318.51, 1567.98, 2093.00];
    
    notes.forEach((freq, i) => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      
      osc.type = 'triangle'; 
      osc.frequency.setValueAtTime(freq, now + i * 0.05);
      
      gain.gain.setValueAtTime(0, now + i * 0.05);
      gain.gain.linearRampToValueAtTime(0.06, now + i * 0.05 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.4);
      
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      
      osc.start(now + i * 0.05);
      osc.stop(now + i * 0.05 + 0.4);
    });
  }

  // A grand magical glissando for timer completion
  playChime() {
    if (this.isMuted) return;
    this.init();
    const now = this.ctx!.currentTime;

    const pentatonic = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50, 1174.66, 1318.51];
    
    pentatonic.forEach((freq, i) => {
      const startTime = now + (i * 0.06);
      const duration = 1.0;
      
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      
      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, startTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.01, startTime + duration);
      
      gain.gain.setValueAtTime(0, startTime);
      gain.gain.linearRampToValueAtTime(0.08, startTime + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
      
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      
      osc.start(startTime);
      osc.stop(startTime + duration);
    });
  }

  // A tiny, soft high-pitched "tick"
  playTick() {
    if (this.isMuted) return;
    this.init();
    const now = this.ctx!.currentTime;
    const osc = this.ctx!.createOscillator();
    const gain = this.ctx!.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, now); // Lowered from 2200 to be less piercing
    
    gain.gain.setValueAtTime(0.02, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    osc.connect(gain);
    gain.connect(this.ctx!.destination);

    osc.start(now);
    osc.stop(now + 0.03);
  }
}

export const audioService = new AudioService();
