
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

  // A soft, crystalline "ping"
  playPop() {
    if (this.isMuted) return;
    this.init();
    const now = this.ctx!.currentTime;
    
    const osc = this.ctx!.createOscillator();
    const gain = this.ctx!.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1100, now);
    osc.frequency.exponentialRampToValueAtTime(1080, now + 0.06);

    gain.gain.setValueAtTime(0.05, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

    osc.connect(gain);
    gain.connect(this.ctx!.destination);

    osc.start(now);
    osc.stop(now + 0.06);

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

  // A crisp metallic shield block sound
  playShieldBlock() {
    if (this.isMuted) return;
    this.init();
    const now = this.ctx!.currentTime;

    const osc = this.ctx!.createOscillator();
    const gain = this.ctx!.createGain();
    
    // High-pitched metallic strike
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1800, now);
    osc.frequency.exponentialRampToValueAtTime(400, now + 0.1);

    gain.gain.setValueAtTime(0.1, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    osc.connect(gain);
    gain.connect(this.ctx!.destination);

    // Add a second harmonic for "ring"
    const ring = this.ctx!.createOscillator();
    const ringGain = this.ctx!.createGain();
    ring.type = 'sine';
    ring.frequency.setValueAtTime(3200, now);
    ringGain.gain.setValueAtTime(0.03, now);
    ringGain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    ring.connect(ringGain);
    ringGain.connect(this.ctx!.destination);

    osc.start(now);
    ring.start(now);
    osc.stop(now + 0.2);
    ring.stop(now + 0.2);
  }

  // A sparkling major-arpeggio chime for task completion
  playSuccess() {
    if (this.isMuted) return;
    this.init();
    const now = this.ctx!.currentTime;
    
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

  // A distinct "Ta-Da!" fanfare
  playCelebration() {
    if (this.isMuted) return;
    this.init();
    const now = this.ctx!.currentTime;

    const playNote = (freq: number, start: number, duration: number, vol: number, type: OscillatorType = 'sine') => {
      const osc = this.ctx!.createOscillator();
      const gain = this.ctx!.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(vol, start + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, start + duration);
      osc.connect(gain);
      gain.connect(this.ctx!.destination);
      osc.start(start);
      osc.stop(start + duration);
    };

    // The "Ta-" (Short upbeat)
    playNote(783.99, now, 0.15, 0.08, 'triangle'); // G5
    // The "Da!" (Triumphant chord)
    const fanfareStart = now + 0.12;
    [523.25, 659.25, 783.99, 1046.50].forEach(f => {
      playNote(f, fanfareStart, 0.8, 0.06, 'sine');
      playNote(f, fanfareStart, 0.5, 0.03, 'triangle');
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

  playTick() {
    if (this.isMuted) return;
    this.init();
    const now = this.ctx!.currentTime;
    const osc = this.ctx!.createOscillator();
    const gain = this.ctx!.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, now);
    
    gain.gain.setValueAtTime(0.02, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    osc.connect(gain);
    gain.connect(this.ctx!.destination);

    osc.start(now);
    osc.stop(now + 0.03);
  }
}

export const audioService = new AudioService();
