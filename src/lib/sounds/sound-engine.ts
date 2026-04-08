"use client";

/* ═══════════════════════════════════════════════════════════════
   Procedural Sound Engine v2 — Web Audio API (zero external deps)
   Massively enhanced: dynamic BGM, combo system, customer reactions,
   heartbeat tension, typing SE, hover SE, countdown, and more!
═══════════════════════════════════════════════════════════════ */

type Quality = "excellent" | "good" | "neutral" | "bad";

class SoundEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private bgmBus: GainNode | null = null;
  private seBus: GainNode | null = null;
  private activeOsc: OscillatorNode[] = [];
  private activeSrc: AudioBufferSourceNode[] = [];
  private timers: ReturnType<typeof setInterval>[] = [];
  private scene: string | null = null;
  private _muted = false;
  private _initialized = false;
  private _combo = 0;
  private _emotionLevel = 50; // tracks customer emotion for dynamic BGM

  /** Must be called during a user gesture (click/tap) */
  init() {
    if (this._initialized && this.ctx) {
      if (this.ctx.state === "suspended") this.ctx.resume();
      return;
    }
    try {
      this.ctx = new AudioContext();
      this.master = this.ctx.createGain();
      this.master.gain.value = 0.5;
      this.master.connect(this.ctx.destination);

      this.bgmBus = this.ctx.createGain();
      this.bgmBus.gain.value = 0.3;
      this.bgmBus.connect(this.master);

      this.seBus = this.ctx.createGain();
      this.seBus.gain.value = 0.6;
      this.seBus.connect(this.master);

      this._initialized = true;
    } catch {
      // Web Audio not available
    }
  }

  get initialized() { return this._initialized; }
  get muted() { return this._muted; }
  get combo() { return this._combo; }

  toggleMute(): boolean {
    this._muted = !this._muted;
    if (this.master && this.ctx) {
      this.master.gain.setValueAtTime(this._muted ? 0 : 0.5, this.ctx.currentTime);
    }
    return this._muted;
  }

  /** Update emotion for dynamic BGM intensity */
  setEmotion(level: number) {
    this._emotionLevel = level;
    // Adjust BGM warmth based on customer emotion
    if (this.bgmBus && this.ctx) {
      const vol = 0.2 + (level / 100) * 0.2; // 0.2 ~ 0.4
      this.bgmBus.gain.setTargetAtTime(vol, this.ctx.currentTime, 0.5);
    }
  }

  /* ─── Private: noise generators ─── */

  private brownNoise(sec: number): AudioBuffer {
    const sr = this.ctx!.sampleRate;
    const n = Math.floor(sr * sec);
    const buf = this.ctx!.createBuffer(1, n, sr);
    const d = buf.getChannelData(0);
    let prev = 0;
    for (let i = 0; i < n; i++) {
      d[i] = (prev + 0.02 * (Math.random() * 2 - 1)) / 1.02;
      prev = d[i];
    }
    let mx = 0;
    for (let i = 0; i < n; i++) mx = Math.max(mx, Math.abs(d[i]));
    if (mx > 0) for (let i = 0; i < n; i++) d[i] /= mx;
    return buf;
  }

  private pinkNoise(sec: number): AudioBuffer {
    const sr = this.ctx!.sampleRate;
    const n = Math.floor(sr * sec);
    const buf = this.ctx!.createBuffer(1, n, sr);
    const d = buf.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < n; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      d[i] = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
      b6 = white * 0.115926;
    }
    let mx = 0;
    for (let i = 0; i < n; i++) mx = Math.max(mx, Math.abs(d[i]));
    if (mx > 0) for (let i = 0; i < n; i++) d[i] /= mx;
    return buf;
  }

  private whiteNoiseBurst(sec: number): AudioBuffer {
    const sr = this.ctx!.sampleRate;
    const n = Math.floor(sr * sec);
    const buf = this.ctx!.createBuffer(1, n, sr);
    const d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    return buf;
  }

  /* ─── Private: node helpers ─── */

  private addOsc(freq: number, type: OscillatorType, gain: number, dest: AudioNode): OscillatorNode {
    const o = this.ctx!.createOscillator();
    o.type = type;
    o.frequency.value = freq;
    const g = this.ctx!.createGain();
    g.gain.value = gain;
    o.connect(g);
    g.connect(dest);
    o.start();
    this.activeOsc.push(o);
    return o;
  }

  /** Oscillator with vibrato for more organic feel */
  private addOscVibrato(freq: number, type: OscillatorType, gain: number, dest: AudioNode, vibratoRate = 4, vibratoDepth = 2): OscillatorNode {
    const o = this.ctx!.createOscillator();
    o.type = type;
    o.frequency.value = freq;
    // LFO for vibrato
    const lfo = this.ctx!.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = vibratoRate;
    const lfoGain = this.ctx!.createGain();
    lfoGain.gain.value = vibratoDepth;
    lfo.connect(lfoGain);
    lfoGain.connect(o.frequency);
    lfo.start();
    const g = this.ctx!.createGain();
    g.gain.value = gain;
    o.connect(g);
    g.connect(dest);
    o.start();
    this.activeOsc.push(o, lfo);
    return o;
  }

  private addNoise(sec: number, lpFreq: number, gain: number, pink = false): AudioBufferSourceNode {
    const src = this.ctx!.createBufferSource();
    src.buffer = pink ? this.pinkNoise(sec) : this.brownNoise(sec);
    src.loop = true;
    const lp = this.ctx!.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = lpFreq;
    const g = this.ctx!.createGain();
    g.gain.value = gain;
    src.connect(lp);
    lp.connect(g);
    g.connect(this.bgmBus!);
    src.start();
    this.activeSrc.push(src);
    return src;
  }

  private addTimer(fn: () => void, ms: number) {
    this.timers.push(setInterval(fn, ms));
  }

  /** One-shot tone → SE bus */
  private tone(freq: number, dur: number, type: OscillatorType = "sine", vol = 0.3, delay = 0) {
    if (!this.ctx || !this.seBus) return;
    const t = this.ctx.currentTime + delay;
    const o = this.ctx.createOscillator();
    o.type = type;
    o.frequency.value = freq;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.005);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g);
    g.connect(this.seBus);
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  /** Tone with frequency sweep (for whoosh, laser, etc.) */
  private toneSweep(startFreq: number, endFreq: number, dur: number, type: OscillatorType = "sine", vol = 0.2, delay = 0) {
    if (!this.ctx || !this.seBus) return;
    const t = this.ctx.currentTime + delay;
    const o = this.ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(startFreq, t);
    o.frequency.exponentialRampToValueAtTime(endFreq, t + dur);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.connect(g);
    g.connect(this.seBus);
    o.start(t);
    o.stop(t + dur + 0.05);
  }

  /** Short noise hit (impact, woosh) */
  private noiseHit(dur: number, hpFreq: number, lpFreq: number, vol = 0.1, delay = 0) {
    if (!this.ctx || !this.seBus) return;
    const t = this.ctx.currentTime + delay;
    const src = this.ctx.createBufferSource();
    src.buffer = this.whiteNoiseBurst(dur);
    const hp = this.ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = hpFreq;
    const lp = this.ctx.createBiquadFilter();
    lp.type = "lowpass";
    lp.frequency.value = lpFreq;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(hp);
    hp.connect(lp);
    lp.connect(g);
    g.connect(this.seBus);
    src.start(t);
    src.stop(t + dur + 0.05);
  }

  /* ═══════════════════════════════════════════
     BGM — scene-specific ambient soundscapes
     Now with layered depth, musical elements,
     and dynamic environmental detail
  ═══════════════════════════════════════════ */

  startBGM(sceneType: string) {
    if (!this.ctx || !this.bgmBus || this.scene === sceneType) return;
    this.stopBGM();
    this.scene = sceneType;

    // Fade in over 2s
    this.bgmBus.gain.setValueAtTime(0, this.ctx.currentTime);
    this.bgmBus.gain.linearRampToValueAtTime(0.3, this.ctx.currentTime + 2);

    switch (sceneType) {
      case "office":
        this._bgmOffice();
        break;
      case "cafe":
        this._bgmCafe();
        break;
      case "exhibition":
        this._bgmExhibition();
        break;
      case "online":
        this._bgmOnline();
        break;
      case "restaurant":
        this._bgmRestaurant();
        break;
      default:
        this.addNoise(4, 300, 0.05);
    }
  }

  private _bgmOffice() {
    // Layer 1: Deep room tone (brown noise)
    this.addNoise(4, 200, 0.07);
    // Layer 2: Air conditioning hum (60Hz + harmonics)
    this.addOsc(60, "sine", 0.012, this.bgmBus!);
    this.addOsc(120, "sine", 0.006, this.bgmBus!);
    // Layer 3: Warm ambient pad (Am7 chord) with vibrato
    this.addOscVibrato(220, "sine", 0.008, this.bgmBus!, 3, 1.5);
    this.addOscVibrato(261.6, "sine", 0.006, this.bgmBus!, 3.5, 1);
    this.addOscVibrato(329.6, "sine", 0.005, this.bgmBus!, 4, 1);
    this.addOscVibrato(392, "sine", 0.004, this.bgmBus!, 3.2, 1.2);

    // Clock tick — alternating tick/tock
    let tickTock = false;
    this.addTimer(() => {
      tickTock = !tickTock;
      if (tickTock) {
        this.tone(4200, 0.012, "sine", 0.025);
      } else {
        this.tone(3800, 0.015, "sine", 0.02);
      }
    }, 1000);
    // Distant phone ring (2 rings)
    this.addTimer(() => {
      if (Math.random() > 0.25) return;
      for (let r = 0; r < 2; r++) {
        const base = r * 0.5;
        this.tone(1400, 0.06, "sine", 0.012, base);
        this.tone(1800, 0.06, "sine", 0.01, base + 0.08);
        this.tone(1400, 0.06, "sine", 0.012, base + 0.16);
        this.tone(1800, 0.06, "sine", 0.01, base + 0.24);
      }
    }, 12000);
    // Printer/copier whir
    this.addTimer(() => {
      if (Math.random() > 0.2) return;
      this.toneSweep(200, 350, 1.5, "sine", 0.008);
      this.noiseHit(1.2, 100, 800, 0.012, 0.2);
    }, 18000);
    // Door open/close
    this.addTimer(() => {
      if (Math.random() > 0.15) return;
      this.noiseHit(0.15, 50, 600, 0.015);
      this.tone(150, 0.2, "sine", 0.008, 0.1);
    }, 25000);
    // Keyboard typing (distant)
    this.addTimer(() => {
      if (Math.random() > 0.35) return;
      const n = 3 + Math.floor(Math.random() * 8);
      for (let i = 0; i < n; i++) {
        this.tone(3500 + Math.random() * 1500, 0.008, "sine", 0.006, i * (0.05 + Math.random() * 0.06));
      }
    }, 6000);
  }

  private _bgmCafe() {
    // Layer 1: Warm pink noise (more natural than brown)
    this.addNoise(5, 500, 0.05, true);
    // Layer 2: Soft jazz-style chord pad (Cmaj7 → Fmaj7 alternating)
    const chords = [
      [261.6, 329.6, 392, 493.9],  // Cmaj7
      [349.2, 440, 523.3, 659.3],  // Fmaj7
    ];
    let chordIdx = 0;
    // Start with first chord
    chords[0].forEach((f) => this.addOscVibrato(f, "sine", 0.008, this.bgmBus!, 3 + Math.random(), 1.5));
    // Slowly alternate chords (but keep base tones — just modulate gain)
    this.addTimer(() => {
      chordIdx = (chordIdx + 1) % 2;
      // Add subtle tonal shift hint
      const root = chords[chordIdx][0];
      this.tone(root, 2, "sine", 0.006);
    }, 8000);

    // Coffee machine gurgle
    this.addTimer(() => {
      if (Math.random() > 0.3) return;
      this.noiseHit(0.8, 200, 1200, 0.02);
      this.toneSweep(150, 300, 0.6, "sine", 0.008, 0.1);
      // Steam hiss
      this.noiseHit(1.5, 3000, 8000, 0.015, 0.5);
    }, 10000);
    // Cup clink (metallic double-tap)
    this.addTimer(() => {
      if (Math.random() > 0.4) return;
      const base = 2800 + Math.random() * 600;
      this.tone(base, 0.025, "sine", 0.018);
      this.tone(base * 1.12, 0.02, "sine", 0.014, 0.035);
      // Saucer settle
      this.tone(base * 0.7, 0.04, "sine", 0.008, 0.06);
    }, 5000);
    // Distant conversation murmur
    this.addTimer(() => {
      if (Math.random() > 0.5) return;
      const vowels = [300, 500, 700, 900];
      const dur = 0.3 + Math.random() * 0.4;
      const f = vowels[Math.floor(Math.random() * vowels.length)];
      this.tone(f * (0.8 + Math.random() * 0.4), dur, "sine", 0.004);
      this.tone(f * 1.5, dur * 0.8, "sine", 0.002, 0.05);
    }, 3000);
    // Background music (muffled bass beat — like cafe BGM from speakers)
    this.addTimer(() => {
      this.tone(80, 0.15, "sine", 0.008);
      this.tone(80, 0.15, "sine", 0.008, 0.5);
    }, 2000);
    // Cash register ding
    this.addTimer(() => {
      if (Math.random() > 0.1) return;
      this.tone(2400, 0.08, "sine", 0.012);
      this.noiseHit(0.1, 800, 3000, 0.008, 0.05);
    }, 20000);
  }

  private _bgmExhibition() {
    // Layer 1: Large hall reverb (pink noise through bandpass)
    this.addNoise(3, 1500, 0.12, true);
    // Layer 2: Crowd murmur (second noise layer)
    this.addNoise(4, 800, 0.06);
    // Layer 3: Low rumble from crowd footsteps
    this.addOsc(50, "sine", 0.008, this.bgmBus!);

    // PA two-tone chime (more elaborate)
    this.addTimer(() => {
      this.tone(880, 0.2, "sine", 0.04);
      this.tone(1100, 0.2, "sine", 0.035, 0.25);
      this.tone(880, 0.15, "sine", 0.025, 0.5);
      // PA announcement murmur
      setTimeout(() => {
        for (let i = 0; i < 5; i++) {
          this.tone(300 + Math.random() * 200, 0.2, "sine", 0.003, i * 0.25);
        }
      }, 800);
    }, 20000);
    // Footsteps (varied patterns)
    this.addTimer(() => {
      const steps = 3 + Math.floor(Math.random() * 5);
      const speed = 0.25 + Math.random() * 0.15;
      const isHeels = Math.random() > 0.6;
      for (let i = 0; i < steps; i++) {
        const freq = isHeels ? (2000 + Math.random() * 500) : (100 + Math.random() * 80);
        const vol = isHeels ? 0.012 : 0.008;
        this.tone(freq, isHeels ? 0.02 : 0.04, "sine", vol, i * speed);
      }
    }, 3500);
    // Demo video audio bleeding
    this.addTimer(() => {
      if (Math.random() > 0.3) return;
      this.toneSweep(200, 600, 2, "sine", 0.004);
      this.noiseHit(1.5, 200, 2000, 0.006, 0.3);
    }, 8000);
    // Bag rustling
    this.addTimer(() => {
      if (Math.random() > 0.5) return;
      this.noiseHit(0.2, 2000, 6000, 0.008);
      this.noiseHit(0.15, 2500, 7000, 0.006, 0.12);
    }, 6000);
    // Camera shutter
    this.addTimer(() => {
      if (Math.random() > 0.2) return;
      this.noiseHit(0.03, 1000, 8000, 0.015);
      this.noiseHit(0.02, 1500, 6000, 0.01, 0.04);
    }, 9000);
  }

  private _bgmOnline() {
    // Layer 1: Very quiet room tone
    this.addNoise(4, 120, 0.02);
    // Layer 2: Monitor/electrical hum
    this.addOsc(50, "sine", 0.005, this.bgmBus!);
    this.addOsc(100, "sine", 0.002, this.bgmBus!);
    // Layer 3: Subtle fan noise
    this.addNoise(3, 300, 0.008, true);

    // Keyboard typing (more elaborate with varied rhythm)
    this.addTimer(() => {
      if (Math.random() > 0.45) return;
      const burst = 3 + Math.floor(Math.random() * 8);
      for (let i = 0; i < burst; i++) {
        const isSpace = i > 0 && Math.random() > 0.85;
        if (isSpace) {
          this.noiseHit(0.02, 500, 2000, 0.01, i * 0.07 + 0.12);
        } else {
          this.tone(2800 + Math.random() * 1400, 0.008, "sine", 0.01, i * (0.055 + Math.random() * 0.04));
        }
      }
    }, 4000);
    // Mouse click
    this.addTimer(() => {
      if (Math.random() > 0.3) return;
      this.tone(3500, 0.008, "sine", 0.008);
      this.tone(2800, 0.012, "sine", 0.006, 0.015);
    }, 7000);
    // Notification (Slack/Teams style)
    this.addTimer(() => {
      if (Math.random() > 0.12) return;
      // Three-note notification
      this.tone(880, 0.08, "sine", 0.02);
      this.tone(1100, 0.06, "sine", 0.018, 0.06);
      this.tone(1320, 0.1, "sine", 0.015, 0.1);
    }, 15000);
    // Zoom connection artifact (brief digital noise)
    this.addTimer(() => {
      if (Math.random() > 0.15) return;
      this.noiseHit(0.05, 500, 4000, 0.006);
    }, 12000);
    // AC unit cycle
    this.addTimer(() => {
      if (Math.random() > 0.2) return;
      this.toneSweep(40, 55, 3, "sine", 0.004);
    }, 30000);
    // Chair creak
    this.addTimer(() => {
      if (Math.random() > 0.25) return;
      this.toneSweep(200, 120, 0.15, "sine", 0.005);
    }, 20000);
  }

  private _bgmRestaurant() {
    // Layer 1: Warm room noise with chatter
    this.addNoise(4, 600, 0.08, true);
    // Layer 2: Kitchen activity
    this.addNoise(3, 900, 0.04);
    // Layer 3: Japanese izakaya vibe — pentatonic drone (D + A + E)
    this.addOscVibrato(146.8, "sine", 0.012, this.bgmBus!, 2.5, 1);
    this.addOscVibrato(220, "sine", 0.009, this.bgmBus!, 3, 1);
    this.addOscVibrato(329.6, "sine", 0.006, this.bgmBus!, 2.8, 0.8);

    // Sizzle/grilling (elaborate with crackling)
    this.addTimer(() => {
      if (!this.ctx || !this.bgmBus) return;
      if (Math.random() > 0.6) return;
      const src = this.ctx.createBufferSource();
      src.buffer = this.whiteNoiseBurst(0.5 + Math.random() * 0.5);
      const hp = this.ctx.createBiquadFilter();
      hp.type = "highpass";
      hp.frequency.value = 3000 + Math.random() * 2000;
      const g = this.ctx.createGain();
      const now = this.ctx.currentTime;
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(0.03, now + 0.05);
      g.gain.setValueAtTime(0.025, now + 0.2);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.6);
      src.connect(hp);
      hp.connect(g);
      g.connect(this.bgmBus);
      src.start(now);
      src.stop(now + 0.8);
    }, 4000);
    // Dish clinking (varied patterns)
    this.addTimer(() => {
      if (Math.random() > 0.35) return;
      const n = 1 + Math.floor(Math.random() * 3);
      for (let i = 0; i < n; i++) {
        this.tone(1800 + Math.random() * 1200, 0.015 + Math.random() * 0.015, "sine", 0.012, i * 0.12);
      }
    }, 5000);
    // Beer pouring
    this.addTimer(() => {
      if (Math.random() > 0.2) return;
      this.noiseHit(1.5, 1500, 5000, 0.012);
      this.tone(250, 0.8, "sine", 0.004, 0.2);
    }, 15000);
    // "Irasshaimase!" (abstract vocal — just formants)
    this.addTimer(() => {
      if (Math.random() > 0.15) return;
      // i-ra-sha-i
      this.tone(400, 0.15, "sine", 0.006);
      this.tone(300, 0.12, "sine", 0.005, 0.12);
      this.tone(500, 0.15, "sine", 0.006, 0.22);
      this.tone(350, 0.2, "sine", 0.005, 0.35);
    }, 25000);
    // TV sports commentary murmur
    this.addTimer(() => {
      if (Math.random() > 0.4) return;
      for (let i = 0; i < 4; i++) {
        this.tone(250 + Math.random() * 300, 0.15, "sine", 0.003, i * 0.18);
      }
    }, 7000);
    // Chopstick on bowl
    this.addTimer(() => {
      if (Math.random() > 0.4) return;
      this.tone(3500 + Math.random() * 500, 0.01, "sine", 0.01);
    }, 4500);
    // Laughter burst
    this.addTimer(() => {
      if (Math.random() > 0.2) return;
      const n = 2 + Math.floor(Math.random() * 3);
      for (let i = 0; i < n; i++) {
        this.tone(300 + Math.random() * 200, 0.08, "sine", 0.004, i * 0.1);
      }
    }, 9000);
  }

  stopBGM() {
    if (this.ctx && this.bgmBus) {
      try {
        this.bgmBus.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.5);
      } catch { /* noop */ }
    }
    setTimeout(() => {
      this.activeOsc.forEach((o) => { try { o.stop(); } catch { /* already stopped */ } });
      this.activeSrc.forEach((s) => { try { s.stop(); } catch { /* already stopped */ } });
      this.timers.forEach((t) => clearInterval(t));
      this.activeOsc = [];
      this.activeSrc = [];
      this.timers = [];
      this.scene = null;
    }, 600);
  }

  /* ═══════════════════════════════════════════
     SE — Sound Effects (massively expanded)
  ═══════════════════════════════════════════ */

  /** UI click / tap */
  playClick() {
    this.tone(800, 0.04, "sine", 0.12);
    this.tone(1200, 0.02, "sine", 0.04, 0.01);
  }

  /** Hover over choice (subtle) */
  playHover() {
    this.tone(1600, 0.025, "sine", 0.04);
  }

  /** Intro scene advance — cinematic whoosh */
  playIntroAdvance() {
    this.tone(784, 0.12, "sine", 0.1);
    this.tone(1047, 0.1, "sine", 0.06, 0.04);
    this.noiseHit(0.2, 500, 3000, 0.04, 0.02);
  }

  /** Text appearing — typewriter-like per character */
  playTextTick() {
    this.tone(2000 + Math.random() * 800, 0.008, "sine", 0.03);
  }

  /** Customer reaction sounds — based on quality */
  playCustomerReaction(quality: Quality) {
    switch (quality) {
      case "excellent":
        // Happy customer — warm chuckle/nod
        this.tone(350, 0.15, "sine", 0.05);
        this.tone(420, 0.12, "sine", 0.04, 0.1);
        this.tone(500, 0.1, "sine", 0.03, 0.18);
        // Paper/pen movement (writing notes approvingly)
        this.noiseHit(0.08, 1500, 4000, 0.015, 0.3);
        break;
      case "good":
        // Interested nod
        this.tone(300, 0.1, "sine", 0.04);
        this.tone(350, 0.08, "sine", 0.03, 0.08);
        break;
      case "neutral":
        // Thinking "hmm"
        this.tone(200, 0.25, "sine", 0.025);
        this.toneSweep(200, 180, 0.3, "sine", 0.015);
        break;
      case "bad":
        // Displeased sigh — descending
        this.tone(250, 0.2, "sine", 0.03);
        this.toneSweep(250, 150, 0.4, "sine", 0.025, 0.1);
        // Chair shift (uncomfortable)
        this.noiseHit(0.12, 100, 500, 0.01, 0.3);
        break;
    }
  }

  /** Choice selection reaction — now with combo awareness */
  playChoice(quality: Quality) {
    // Update combo
    if (quality === "excellent" || quality === "good") {
      this._combo++;
    } else {
      this._combo = 0;
    }

    const comboBonus = Math.min(this._combo, 5) * 0.02;

    switch (quality) {
      case "excellent":
        // Bright ascending C5→E5→G5→C6 with sparkles
        this.tone(523, 0.14, "sine", 0.2 + comboBonus);
        this.tone(659, 0.14, "sine", 0.18 + comboBonus, 0.08);
        this.tone(784, 0.14, "sine", 0.16 + comboBonus, 0.16);
        this.tone(1047, 0.35, "sine", 0.22 + comboBonus, 0.24);
        // Sparkle overtones
        this.tone(1568, 0.2, "sine", 0.06, 0.28);
        this.tone(2093, 0.15, "sine", 0.04, 0.32);
        // Impact hit
        this.noiseHit(0.08, 500, 4000, 0.08, 0.24);
        // Combo bonus sparkles
        if (this._combo >= 3) {
          this.tone(2637, 0.12, "sine", 0.05, 0.4);
          this.tone(3136, 0.1, "sine", 0.04, 0.45);
          this.tone(3520, 0.08, "sine", 0.03, 0.5);
        }
        break;
      case "good":
        // Two ascending C5→E5 with warmth
        this.tone(523, 0.14, "sine", 0.16 + comboBonus);
        this.tone(659, 0.2, "sine", 0.14 + comboBonus, 0.1);
        // Subtle shimmer
        this.tone(1318, 0.1, "sine", 0.03, 0.15);
        if (this._combo >= 3) {
          this.tone(784, 0.12, "sine", 0.06, 0.2);
        }
        break;
      case "neutral":
        // Flat tone A4
        this.tone(440, 0.15, "triangle", 0.1);
        this.tone(440, 0.1, "sine", 0.04, 0.05);
        break;
      case "bad":
        // Descending E4→C4 with buzz + impact
        this.tone(330, 0.1, "sawtooth", 0.06);
        this.tone(262, 0.2, "sawtooth", 0.08, 0.08);
        // Low rumble impact
        this.tone(80, 0.4, "sine", 0.08, 0.05);
        this.tone(55, 0.5, "sine", 0.05, 0.1);
        // Error buzz
        this.noiseHit(0.15, 100, 500, 0.06, 0.08);
        break;
    }

    // Play customer reaction after a short delay
    setTimeout(() => this.playCustomerReaction(quality), 400);
  }

  /** Combo milestone celebration */
  playComboMilestone(combo: number) {
    if (combo === 3) {
      // 3-combo: triple chime
      this.tone(880, 0.1, "sine", 0.1);
      this.tone(1100, 0.1, "sine", 0.08, 0.06);
      this.tone(1320, 0.15, "sine", 0.12, 0.12);
      this.noiseHit(0.05, 2000, 6000, 0.05, 0.12);
    } else if (combo >= 5) {
      // 5+ combo: epic ascending scale
      const notes = [523, 659, 784, 1047, 1318, 1568];
      notes.forEach((f, i) => {
        this.tone(f, 0.08, "sine", 0.06 + i * 0.01, i * 0.04);
      });
      this.noiseHit(0.1, 1000, 5000, 0.06, 0.2);
      this.tone(2093, 0.3, "sine", 0.08, 0.24);
    }
  }

  /** Scene transition — elaborate cinematic whoosh */
  playTransition() {
    if (!this.ctx || !this.seBus) return;
    const now = this.ctx.currentTime;

    // Low sweep
    const o1 = this.ctx.createOscillator();
    o1.type = "sine";
    o1.frequency.setValueAtTime(80, now);
    o1.frequency.exponentialRampToValueAtTime(400, now + 1.2);
    const g1 = this.ctx.createGain();
    g1.gain.setValueAtTime(0.06, now);
    g1.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
    o1.connect(g1);
    g1.connect(this.seBus);
    o1.start(now);
    o1.stop(now + 1.6);

    // High sweep
    const o2 = this.ctx.createOscillator();
    o2.type = "sine";
    o2.frequency.setValueAtTime(300, now + 0.3);
    o2.frequency.exponentialRampToValueAtTime(1200, now + 1.2);
    const g2 = this.ctx.createGain();
    g2.gain.setValueAtTime(0, now);
    g2.gain.linearRampToValueAtTime(0.05, now + 0.4);
    g2.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
    o2.connect(g2);
    g2.connect(this.seBus);
    o2.start(now);
    o2.stop(now + 1.6);

    // Noise whoosh (bandpass sweep)
    const src = this.ctx.createBufferSource();
    src.buffer = this.whiteNoiseBurst(2);
    const bp = this.ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.setValueAtTime(200, now);
    bp.frequency.exponentialRampToValueAtTime(3000, now + 1);
    bp.frequency.exponentialRampToValueAtTime(500, now + 1.8);
    bp.Q.value = 3;
    const ng = this.ctx.createGain();
    ng.gain.setValueAtTime(0.03, now);
    ng.gain.linearRampToValueAtTime(0.08, now + 0.5);
    ng.gain.exponentialRampToValueAtTime(0.001, now + 1.8);
    src.connect(bp);
    bp.connect(ng);
    ng.connect(this.seBus);
    src.start(now);
    src.stop(now + 2);

    // Door opening sound
    this.tone(200, 0.3, "sine", 0.04, 0.8);
    this.noiseHit(0.2, 100, 800, 0.03, 0.9);

    // Footsteps arriving
    for (let i = 0; i < 4; i++) {
      this.tone(120 + Math.random() * 40, 0.04, "sine", 0.015, 1.2 + i * 0.35);
    }
  }

  /** Heartbeat tension — for critical moments / low emotion */
  playHeartbeat() {
    // Lub-dub pattern
    this.tone(60, 0.12, "sine", 0.1);
    this.tone(50, 0.08, "sine", 0.06, 0.08);
    this.tone(60, 0.12, "sine", 0.08, 0.4);
    this.tone(50, 0.08, "sine", 0.05, 0.48);
  }

  /** Countdown timer tick (for last few seconds) */
  playCountdownTick(remaining: number) {
    const urgency = Math.max(0.05, 0.15 - remaining * 0.01);
    this.tone(800 + (10 - remaining) * 50, 0.06, "sine", urgency);
  }

  /** Game ending fanfare — elaborate per grade */
  playEnding(grade: string) {
    switch (grade) {
      case "S":
        // Epic triumphant fanfare — full arpeggio + sparkles + bass
        this.tone(65, 0.6, "sine", 0.08); // Sub bass
        this.tone(523, 0.18, "sine", 0.2);
        this.tone(659, 0.18, "sine", 0.18, 0.1);
        this.tone(784, 0.18, "sine", 0.18, 0.2);
        this.tone(1047, 0.6, "sine", 0.25, 0.3);
        // Harmony
        this.tone(659, 0.5, "sine", 0.1, 0.3);
        this.tone(784, 0.5, "sine", 0.08, 0.3);
        // Sparkle cascade
        this.tone(1568, 0.3, "sine", 0.07, 0.4);
        this.tone(2093, 0.25, "sine", 0.05, 0.45);
        this.tone(2637, 0.2, "sine", 0.04, 0.5);
        this.tone(3136, 0.15, "sine", 0.03, 0.55);
        // Impact hit
        this.noiseHit(0.15, 200, 2000, 0.1, 0.3);
        // Final shimmer
        this.tone(4186, 0.4, "sine", 0.02, 0.6);
        // Second phrase
        this.tone(1047, 0.15, "sine", 0.12, 0.9);
        this.tone(1318, 0.15, "sine", 0.1, 1.0);
        this.tone(1568, 0.5, "sine", 0.15, 1.1);
        this.noiseHit(0.1, 500, 3000, 0.06, 1.1);
        break;
      case "A":
        // Bright success — nice arpeggio
        this.tone(523, 0.18, "sine", 0.18);
        this.tone(659, 0.18, "sine", 0.16, 0.1);
        this.tone(784, 0.4, "sine", 0.2, 0.2);
        this.tone(1047, 0.3, "sine", 0.1, 0.3);
        this.noiseHit(0.1, 300, 2000, 0.05, 0.2);
        // Warm chord
        this.tone(523, 0.4, "sine", 0.06, 0.35);
        this.tone(659, 0.4, "sine", 0.05, 0.35);
        break;
      case "B":
        // Moderate — two-tone with resolve
        this.tone(440, 0.2, "triangle", 0.14);
        this.tone(523, 0.3, "triangle", 0.12, 0.12);
        this.tone(659, 0.2, "triangle", 0.06, 0.3);
        break;
      default:
        // Game over — ominous descending + rumble
        this.tone(330, 0.25, "sawtooth", 0.06);
        this.tone(262, 0.3, "sawtooth", 0.08, 0.1);
        this.tone(196, 0.4, "sawtooth", 0.06, 0.25);
        this.tone(65, 0.8, "sine", 0.06, 0.3);
        this.noiseHit(0.3, 50, 300, 0.04, 0.3);
        break;
    }
  }

  /** Game start — energetic ready-go */
  playGameStart() {
    // Ready
    this.tone(392, 0.1, "sine", 0.1);
    this.tone(523, 0.1, "sine", 0.12, 0.08);
    this.tone(659, 0.15, "sine", 0.1, 0.16);
    // Go! impact
    this.tone(784, 0.25, "sine", 0.15, 0.28);
    this.noiseHit(0.08, 300, 3000, 0.06, 0.28);
    // Sub bass punch
    this.tone(100, 0.2, "sine", 0.06, 0.28);
  }

  /** Emotion change alert (when crossing threshold) */
  playEmotionUp() {
    this.tone(880, 0.08, "sine", 0.06);
    this.tone(1047, 0.06, "sine", 0.04, 0.05);
  }

  playEmotionDown() {
    this.tone(440, 0.1, "triangle", 0.04);
    this.tone(330, 0.12, "triangle", 0.03, 0.06);
  }

  /** Feedback panel step transitions */
  playFeedbackStep(step: "talk" | "response" | "result") {
    switch (step) {
      case "talk":
        // Your sales talk appearing
        this.tone(600, 0.06, "sine", 0.06);
        this.tone(800, 0.04, "sine", 0.04, 0.03);
        break;
      case "response":
        // Customer speaking
        this.tone(400, 0.08, "sine", 0.05);
        this.tone(500, 0.06, "sine", 0.04, 0.04);
        break;
      case "result":
        // Score reveal
        this.tone(1000, 0.05, "sine", 0.08);
        this.noiseHit(0.03, 1000, 5000, 0.04);
        break;
    }
  }

  /** Phase label change */
  playPhaseChange() {
    this.tone(600, 0.08, "sine", 0.06);
    this.tone(750, 0.06, "sine", 0.05, 0.04);
    this.tone(900, 0.1, "sine", 0.07, 0.08);
    this.noiseHit(0.05, 500, 3000, 0.03, 0.08);
  }

  /* ═══════════════════════════════════════════
     Weather / Ambient sounds
  ═══════════════════════════════════════════ */

  /** Rain ambient — brown noise through highpass filter */
  playRainAmbient() {
    if (this._muted || !this.ctx || !this.seBus) return;
    const now = this.ctx.currentTime;
    const sr = this.ctx.sampleRate;
    const n = Math.floor(sr * 3);
    const buf = this.ctx.createBuffer(1, n, sr);
    const d = buf.getChannelData(0);
    for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const hp = this.ctx.createBiquadFilter();
    hp.type = "highpass";
    hp.frequency.value = 2000;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.03, now);
    g.gain.linearRampToValueAtTime(0.001, now + 3);
    src.connect(hp);
    hp.connect(g);
    g.connect(this.seBus);
    src.start(now);
    src.stop(now + 3.05);
  }

  /** Thunder — low rumble with crack */
  playThunder() {
    if (this._muted || !this.ctx || !this.seBus) return;
    const now = this.ctx.currentTime;
    // Crack: noise burst at start
    const src = this.ctx.createBufferSource();
    src.buffer = this.whiteNoiseBurst(0.15);
    const ng = this.ctx.createGain();
    ng.gain.setValueAtTime(0.2, now);
    ng.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
    src.connect(ng);
    ng.connect(this.seBus);
    src.start(now);
    src.stop(now + 0.2);
    // Rumble: low sine with long decay
    const o = this.ctx.createOscillator();
    o.type = "sine";
    o.frequency.value = 40;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0, now);
    g.gain.linearRampToValueAtTime(0.3, now + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, now + 2);
    o.connect(g);
    g.connect(this.seBus);
    o.start(now);
    o.stop(now + 2.05);
  }

  /** Wind gust — bandpass-filtered noise with frequency sweep */
  playWindGust() {
    if (this._muted || !this.ctx || !this.seBus) return;
    const now = this.ctx.currentTime;
    const src = this.ctx.createBufferSource();
    src.buffer = this.whiteNoiseBurst(1.5);
    const bp = this.ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.value = 3;
    bp.frequency.setValueAtTime(200, now);
    bp.frequency.exponentialRampToValueAtTime(800, now + 1.5);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.05, now);
    g.gain.linearRampToValueAtTime(0.001, now + 1.5);
    src.connect(bp);
    bp.connect(g);
    g.connect(this.seBus);
    src.start(now);
    src.stop(now + 1.55);
  }

  /* ═══════════════════════════════════════════
     UI / Game event sounds
  ═══════════════════════════════════════════ */

  /** Achievement unlock — ascending arpeggio with shimmer */
  playAchievementUnlock() {
    if (this._muted || !this.ctx || !this.seBus) return;
    const now = this.ctx.currentTime;
    // Ascending 4-note arpeggio: C5, E5, G5, C6
    const notes = [523, 659, 784, 1047];
    notes.forEach((freq, i) => {
      const o = this.ctx!.createOscillator();
      o.type = "sine";
      o.frequency.value = freq;
      const g = this.ctx!.createGain();
      const t = now + i * 0.08;
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.12, t + 0.005);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
      o.connect(g);
      g.connect(this.seBus!);
      o.start(t);
      o.stop(t + 0.2);
    });
    // Shimmer: high-frequency triangle with tremolo
    const shimmer = this.ctx.createOscillator();
    shimmer.type = "triangle";
    shimmer.frequency.value = 3000;
    const lfo = this.ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 12;
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 0.04;
    lfo.connect(lfoGain);
    const sg = this.ctx.createGain();
    sg.gain.value = 0.04;
    lfoGain.connect(sg.gain);
    shimmer.connect(sg);
    sg.connect(this.seBus);
    const shimStart = now + 0.24;
    shimmer.start(shimStart);
    shimmer.stop(shimStart + 0.3);
    lfo.start(shimStart);
    lfo.stop(shimStart + 0.3);
  }

  /** Event appear — dramatic 2-note stinger */
  playEventAppear() {
    if (this._muted || !this.ctx || !this.seBus) return;
    const now = this.ctx.currentTime;
    // Low note
    const o1 = this.ctx.createOscillator();
    o1.type = "sine";
    o1.frequency.value = 200;
    const g1 = this.ctx.createGain();
    g1.gain.setValueAtTime(0.15, now);
    g1.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
    o1.connect(g1);
    g1.connect(this.seBus);
    o1.start(now);
    o1.stop(now + 0.15);
    // High note
    const o2 = this.ctx.createOscillator();
    o2.type = "sine";
    o2.frequency.value = 800;
    const g2 = this.ctx.createGain();
    const t2 = now + 0.1;
    g2.gain.setValueAtTime(0.15, t2);
    g2.gain.exponentialRampToValueAtTime(0.001, t2 + 0.2);
    o2.connect(g2);
    g2.connect(this.seBus);
    o2.start(t2);
    o2.stop(t2 + 0.25);
  }

  /** Buff gained — ascending tone with sparkle */
  playBuffGained() {
    if (this._muted || !this.ctx || !this.seBus) return;
    const now = this.ctx.currentTime;
    // Ascending sine sweep
    const o = this.ctx.createOscillator();
    o.type = "sine";
    o.frequency.setValueAtTime(400, now);
    o.frequency.exponentialRampToValueAtTime(1200, now + 0.3);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.1, now);
    g.gain.linearRampToValueAtTime(0.001, now + 0.3);
    o.connect(g);
    g.connect(this.seBus);
    o.start(now);
    o.stop(now + 0.35);
    // Sparkle: triangle ping
    const sp = this.ctx.createOscillator();
    sp.type = "triangle";
    sp.frequency.value = 2500;
    const sg = this.ctx.createGain();
    const t2 = now + 0.2;
    sg.gain.setValueAtTime(0.06, t2);
    sg.gain.exponentialRampToValueAtTime(0.001, t2 + 0.1);
    sp.connect(sg);
    sg.connect(this.seBus);
    sp.start(t2);
    sp.stop(t2 + 0.15);
  }

  /** Debuff gained — descending tone with growl */
  playDebuffGained() {
    if (this._muted || !this.ctx || !this.seBus) return;
    const now = this.ctx.currentTime;
    // Descending sine sweep
    const o = this.ctx.createOscillator();
    o.type = "sine";
    o.frequency.setValueAtTime(600, now);
    o.frequency.exponentialRampToValueAtTime(150, now + 0.4);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.1, now);
    g.gain.linearRampToValueAtTime(0.001, now + 0.4);
    o.connect(g);
    g.connect(this.seBus);
    o.start(now);
    o.stop(now + 0.45);
    // Growl: sawtooth undertone
    const gr = this.ctx.createOscillator();
    gr.type = "sawtooth";
    gr.frequency.value = 100;
    const gg = this.ctx.createGain();
    gg.gain.setValueAtTime(0.05, now);
    gg.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    gr.connect(gg);
    gg.connect(this.seBus);
    gr.start(now);
    gr.stop(now + 0.45);
  }

  /** Glitch — rapid FM modulation */
  playGlitch() {
    if (this._muted || !this.ctx || !this.seBus) return;
    const now = this.ctx.currentTime;
    // Carrier: square wave
    const carrier = this.ctx.createOscillator();
    carrier.type = "square";
    carrier.frequency.value = 100;
    // Modulator
    const mod = this.ctx.createOscillator();
    mod.type = "sine";
    mod.frequency.value = 50;
    const modGain = this.ctx.createGain();
    modGain.gain.value = 300; // high FM depth
    mod.connect(modGain);
    modGain.connect(carrier.frequency);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.08, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
    carrier.connect(g);
    g.connect(this.seBus);
    carrier.start(now);
    carrier.stop(now + 0.25);
    mod.start(now);
    mod.stop(now + 0.25);
  }

  /** Ripple — sine with exponential frequency decay */
  playRipple() {
    if (this._muted || !this.ctx || !this.seBus) return;
    const now = this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    o.type = "sine";
    o.frequency.setValueAtTime(800, now);
    o.frequency.exponentialRampToValueAtTime(200, now + 0.5);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.08, now);
    g.gain.linearRampToValueAtTime(0.001, now + 0.5);
    o.connect(g);
    g.connect(this.seBus);
    o.start(now);
    o.stop(now + 0.55);
  }

  /** Whoosh — noise burst through bandpass sweep */
  playWhoosh() {
    if (this._muted || !this.ctx || !this.seBus) return;
    const now = this.ctx.currentTime;
    const src = this.ctx.createBufferSource();
    src.buffer = this.whiteNoiseBurst(0.3);
    const bp = this.ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.value = 5;
    bp.frequency.setValueAtTime(500, now);
    bp.frequency.exponentialRampToValueAtTime(4000, now + 0.3);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.06, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    src.connect(bp);
    bp.connect(g);
    g.connect(this.seBus);
    src.start(now);
    src.stop(now + 0.35);
  }

  /* ═══════════════════════════════════════════
     Dramatic sounds
  ═══════════════════════════════════════════ */

  /** Dramatic sting — detuned sine cluster for orchestral hit feel */
  playDramaticSting() {
    if (this._muted || !this.ctx || !this.seBus) return;
    const now = this.ctx.currentTime;
    const freqs = [220, 223, 226]; // slight detuning
    freqs.forEach((freq) => {
      const o = this.ctx!.createOscillator();
      o.type = "sine";
      o.frequency.value = freq;
      const g = this.ctx!.createGain();
      g.gain.setValueAtTime(0, now);
      g.gain.linearRampToValueAtTime(0.15, now + 0.005);
      g.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
      o.connect(g);
      g.connect(this.seBus!);
      o.start(now);
      o.stop(now + 0.55);
    });
  }

  /** Tension rise — slowly ascending sine with harmonic */
  playTensionRise() {
    if (this._muted || !this.ctx || !this.seBus) return;
    const now = this.ctx.currentTime;
    // Primary sine rising from 100Hz to 500Hz
    const o1 = this.ctx.createOscillator();
    o1.type = "sine";
    o1.frequency.setValueAtTime(100, now);
    o1.frequency.exponentialRampToValueAtTime(500, now + 2);
    const g1 = this.ctx.createGain();
    g1.gain.setValueAtTime(0.02, now);
    g1.gain.linearRampToValueAtTime(0.1, now + 2);
    g1.gain.exponentialRampToValueAtTime(0.001, now + 2.1);
    o1.connect(g1);
    g1.connect(this.seBus);
    o1.start(now);
    o1.stop(now + 2.15);
    // Harmonic (octave above)
    const o2 = this.ctx.createOscillator();
    o2.type = "sine";
    o2.frequency.setValueAtTime(200, now);
    o2.frequency.exponentialRampToValueAtTime(1000, now + 2);
    const g2 = this.ctx.createGain();
    g2.gain.setValueAtTime(0.01, now);
    g2.gain.linearRampToValueAtTime(0.05, now + 2);
    g2.gain.exponentialRampToValueAtTime(0.001, now + 2.1);
    o2.connect(g2);
    g2.connect(this.seBus);
    o2.start(now);
    o2.stop(now + 2.15);
  }

  /** Victory fanfare — 6-note melody with sub bass */
  playVictoryFanfare() {
    if (this._muted || !this.ctx || !this.seBus) return;
    const now = this.ctx.currentTime;
    const melody = [392, 523, 659, 784, 659, 1047]; // G4, C5, E5, G5, E5, C6
    melody.forEach((freq, i) => {
      const t = now + i * 0.12;
      // Melody note
      const o = this.ctx!.createOscillator();
      o.type = "sine";
      o.frequency.value = freq;
      const g = this.ctx!.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.12, t + 0.005);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      o.connect(g);
      g.connect(this.seBus!);
      o.start(t);
      o.stop(t + 0.25);
      // Sub bass (octave below)
      const sub = this.ctx!.createOscillator();
      sub.type = "sine";
      sub.frequency.value = freq / 2;
      const sg = this.ctx!.createGain();
      sg.gain.setValueAtTime(0, t);
      sg.gain.linearRampToValueAtTime(0.06, t + 0.005);
      sg.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
      sub.connect(sg);
      sg.connect(this.seBus!);
      sub.start(t);
      sub.stop(t + 0.25);
    });
  }

  /** Failure sound — descending minor progression */
  playFailureSound() {
    if (this._muted || !this.ctx || !this.seBus) return;
    const now = this.ctx.currentTime;
    const notes = [330, 294, 262, 247]; // E4, D4, C4, B3
    notes.forEach((freq, i) => {
      const t = now + i * 0.2;
      const o = this.ctx!.createOscillator();
      o.type = "sawtooth";
      o.frequency.value = freq;
      const g = this.ctx!.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.08, t + 0.005);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      o.connect(g);
      g.connect(this.seBus!);
      o.start(t);
      o.stop(t + 0.35);
    });
  }

  /** Timer warning — accelerating beeps */
  playTimerWarning() {
    if (this._muted || !this.ctx || !this.seBus) return;
    const now = this.ctx.currentTime;
    let t = now;
    for (let i = 0; i < 8; i++) {
      // Interval decreases: 200ms → 50ms
      const interval = 0.2 - (i / 7) * 0.15;
      const o = this.ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = 880;
      const g = this.ctx.createGain();
      g.gain.setValueAtTime(0, t);
      g.gain.linearRampToValueAtTime(0.1, t + 0.003);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
      o.connect(g);
      g.connect(this.seBus);
      o.start(t);
      o.stop(t + 0.035);
      t += interval;
    }
  }

  /* ═══════════════════════════════════════════
     Interaction sounds
  ═══════════════════════════════════════════ */

  /** Card flip — noise pop followed by short tone */
  playCardFlip() {
    if (this._muted || !this.ctx || !this.seBus) return;
    const now = this.ctx.currentTime;
    // Quick noise pop
    const src = this.ctx.createBufferSource();
    src.buffer = this.whiteNoiseBurst(0.01);
    const ng = this.ctx.createGain();
    ng.gain.setValueAtTime(0.15, now);
    ng.gain.exponentialRampToValueAtTime(0.001, now + 0.01);
    src.connect(ng);
    ng.connect(this.seBus);
    src.start(now);
    src.stop(now + 0.015);
    // Short tone follow-up
    const o = this.ctx.createOscillator();
    o.type = "sine";
    o.frequency.value = 600;
    const g = this.ctx.createGain();
    const t = now + 0.01;
    g.gain.setValueAtTime(0.06, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
    o.connect(g);
    g.connect(this.seBus);
    o.start(t);
    o.stop(t + 0.06);
  }

  /** Screen transition — bandpass-swept noise */
  playScreenTransition() {
    if (this._muted || !this.ctx || !this.seBus) return;
    const now = this.ctx.currentTime;
    const src = this.ctx.createBufferSource();
    src.buffer = this.whiteNoiseBurst(0.4);
    const bp = this.ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.Q.value = 3;
    bp.frequency.setValueAtTime(200, now);
    bp.frequency.exponentialRampToValueAtTime(6000, now + 0.4);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.04, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    src.connect(bp);
    bp.connect(g);
    g.connect(this.seBus);
    src.start(now);
    src.stop(now + 0.45);
  }

  /** Combo break — noise burst with descending sine */
  playComboBreak() {
    if (this._muted || !this.ctx || !this.seBus) return;
    const now = this.ctx.currentTime;
    // Noise burst through bandpass (2000-4000Hz emphasis)
    const src = this.ctx.createBufferSource();
    src.buffer = this.whiteNoiseBurst(0.05);
    const bp = this.ctx.createBiquadFilter();
    bp.type = "bandpass";
    bp.frequency.value = 3000;
    bp.Q.value = 2;
    const ng = this.ctx.createGain();
    ng.gain.setValueAtTime(0.12, now);
    ng.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
    src.connect(bp);
    bp.connect(ng);
    ng.connect(this.seBus);
    src.start(now);
    src.stop(now + 0.06);
    // Descending sine
    const o = this.ctx.createOscillator();
    o.type = "sine";
    o.frequency.setValueAtTime(1000, now);
    o.frequency.exponentialRampToValueAtTime(200, now + 0.3);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.1, now);
    g.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    o.connect(g);
    g.connect(this.seBus);
    o.start(now);
    o.stop(now + 0.35);
  }

  /** Emote sound — contextual audio based on emotion type */
  playEmoteSound(type: string) {
    if (this._muted || !this.ctx || !this.seBus) return;
    const now = this.ctx.currentTime;
    switch (type) {
      case "surprise": {
        // Quick ascending 3-note: C5, E5, G5
        const notes = [523, 659, 784];
        notes.forEach((freq, i) => {
          const t = now + i * 0.05;
          const o = this.ctx!.createOscillator();
          o.type = "sine";
          o.frequency.value = freq;
          const g = this.ctx!.createGain();
          g.gain.setValueAtTime(0, t);
          g.gain.linearRampToValueAtTime(0.08, t + 0.003);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.05);
          o.connect(g);
          g.connect(this.seBus!);
          o.start(t);
          o.stop(t + 0.06);
        });
        break;
      }
      case "anger": {
        // Low sawtooth growl
        const o = this.ctx.createOscillator();
        o.type = "sawtooth";
        o.frequency.value = 80;
        const g = this.ctx.createGain();
        g.gain.setValueAtTime(0.1, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
        o.connect(g);
        g.connect(this.seBus);
        o.start(now);
        o.stop(now + 0.25);
        break;
      }
      case "happy": {
        // Two high pings
        const pings = [1200, 1500];
        pings.forEach((freq, i) => {
          const t = now + i * 0.08;
          const o = this.ctx!.createOscillator();
          o.type = "sine";
          o.frequency.value = freq;
          const g = this.ctx!.createGain();
          g.gain.setValueAtTime(0, t);
          g.gain.linearRampToValueAtTime(0.06, t + 0.003);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
          o.connect(g);
          g.connect(this.seBus!);
          o.start(t);
          o.stop(t + 0.09);
        });
        break;
      }
      case "confused": {
        // Wobbling sine with vibrato via LFO
        const o = this.ctx.createOscillator();
        o.type = "sine";
        o.frequency.value = 400;
        const lfo = this.ctx.createOscillator();
        lfo.type = "sine";
        lfo.frequency.value = 5;
        const lfoGain = this.ctx.createGain();
        lfoGain.gain.value = 100; // depth of 100Hz
        lfo.connect(lfoGain);
        lfoGain.connect(o.frequency);
        const g = this.ctx.createGain();
        g.gain.setValueAtTime(0.06, now);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        o.connect(g);
        g.connect(this.seBus);
        o.start(now);
        o.stop(now + 0.35);
        lfo.start(now);
        lfo.stop(now + 0.35);
        break;
      }
      default: {
        // Single 800Hz ping
        const o = this.ctx.createOscillator();
        o.type = "sine";
        o.frequency.value = 800;
        const g = this.ctx.createGain();
        g.gain.setValueAtTime(0, now);
        g.gain.linearRampToValueAtTime(0.06, now + 0.003);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        o.connect(g);
        g.connect(this.seBus);
        o.start(now);
        o.stop(now + 0.12);
        break;
      }
    }
  }

  dispose() {
    this.stopBGM();
    this._combo = 0;
    setTimeout(() => {
      if (this.ctx) {
        try { this.ctx.close(); } catch { /* noop */ }
        this.ctx = null;
      }
      this._initialized = false;
    }, 700);
  }
}

/** Singleton instance */
export const soundEngine = new SoundEngine();
