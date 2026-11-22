/* MYSTIC RUN – HAUNTED FOREST
 * Web Audio API Procedural Sound Engine
 * Zero external audio files required, 100% reliable on all mobile & desktop browsers.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.isBgmPlaying = false;
    this.bgmTimer = null;
    this.bgmStep = 0;
    this.currentBpm = 110;
    this.speedFactor = 1.0;

    // Load mute preference
    try {
      const savedMute = localStorage.getItem('mystic_run_muted');
      if (savedMute !== null) {
        this.isMuted = savedMute === 'true';
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
  }

  // Mobile browsers require user interaction to unlock audio
  initAudio() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    try {
      localStorage.setItem('mystic_run_muted', this.isMuted.toString());
    } catch (e) {}

    if (this.isMuted) {
      this.stopBGM();
    } else {
      if (!this.isBgmPlaying) {
        this.startBGM();
      }
    }
    return this.isMuted;
  }

  // --- SOUND EFFECTS ---

  playJump() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;

    // Soft magical leap whoosh with a short rising tone
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(620, now + 0.16);

    gain.gain.setValueAtTime(0.28, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.22);

    // Ninja air-slice whoosh
    this.playNoiseBuffer(0.22, 0.15, 600, 2400);
  }

  playSlide() {
    if (this.isMuted || !this.ctx) return;
    // Ground dirt/gravel sliding noise
    this.playNoiseBuffer(0.32, 0.22, 250, 800);
  }

  playJumpVoice() {
    this.playCartoonVoice('jump');
  }

  playSlideVoice() {
    this.playCartoonVoice('slide');
  }

  playCartoonVoice(action) {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const isJump = action === 'jump';
    const duration = 0.27;
    const voice = this.ctx.createOscillator();
    voice.type = isJump ? 'sawtooth' : 'triangle';
    voice.frequency.setValueAtTime(isJump ? 310 : 265, now);
    voice.frequency.exponentialRampToValueAtTime(isJump ? 470 : 205, now + duration);

    const formants = isJump ? [720, 1280, 2450] : [620, 1080, 2050];
    const levels = [0.09, 0.055, 0.025];
    formants.forEach((frequency, index) => {
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(frequency, now);
      filter.frequency.linearRampToValueAtTime(frequency * (isJump ? 1.08 : 0.92), now + duration);
      filter.Q.setValueAtTime(3.2, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(levels[index], now + 0.025);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      voice.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
    });

    voice.start(now);
    voice.stop(now + duration + 0.01);
  }

  playLaneSwitch() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(330, now + 0.1);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.12);
  }

  playCoin(pitchOffset = 0) {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;

    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc1.type = 'sine';
    osc2.type = 'sine';

    const baseFreq = 987.77 + pitchOffset; // B5
    osc1.frequency.setValueAtTime(baseFreq, now);
    osc2.frequency.setValueAtTime(baseFreq * 1.5, now); // E6 harmonic

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);

    osc1.start(now);
    osc2.start(now);
    osc1.stop(now + 0.28);
    osc2.stop(now + 0.28);
  }

  playDiamond() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;

    // Rich mystic chord chime
    const freqs = [1046.5, 1318.51, 1567.98, 2093.0]; // C6, E6, G6, C7
    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + idx * 0.04);

      gain.gain.setValueAtTime(0.15, now + idx * 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.04);
      osc.stop(now + idx * 0.04 + 0.5);
    });
  }

  playMonsterRoar() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;

    // Deep sub growl
    const osc = this.ctx.createOscillator();
    const modOsc = this.ctx.createOscillator();
    const modGain = this.ctx.createGain();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(80, now);
    osc.frequency.exponentialRampToValueAtTime(50, now + 0.6);

    // FM modulation for menacing snarling texture
    modOsc.type = 'sine';
    modOsc.frequency.setValueAtTime(35, now);
    modGain.gain.setValueAtTime(40, now);
    modGain.gain.exponentialRampToValueAtTime(10, now + 0.6);

    modOsc.connect(modGain);
    modGain.connect(osc.frequency);

    gain.gain.setValueAtTime(0.4, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.65);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    modOsc.start(now);
    osc.start(now);
    modOsc.stop(now + 0.65);
    osc.stop(now + 0.65);

    // Filtered noise roar
    this.playNoiseBuffer(0.55, 0.28, 100, 500);
  }

  playMonsterWarning() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;

    [0, 0.24].forEach((offset) => {
      const oscillator = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(520, now + offset);
      oscillator.frequency.exponentialRampToValueAtTime(780, now + offset + 0.12);
      gain.gain.setValueAtTime(0.001, now + offset);
      gain.gain.linearRampToValueAtTime(0.16, now + offset + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.16);
      oscillator.connect(gain);
      gain.connect(this.ctx.destination);
      oscillator.start(now + offset);
      oscillator.stop(now + offset + 0.17);
    });
  }

  playMonsterStomp() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(95, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.22);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.22);
  }

  playCrash() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;

    // Punchy impact
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(180, now);
    osc.frequency.exponentialRampToValueAtTime(30, now + 0.35);

    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.38);

    // Wood/stone crunch noise
    this.playNoiseBuffer(0.4, 0.4, 150, 1500);
  }

  playGhostTrainHorn() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;

    // Haunting phantom steam train horn (diminished chord with spectral flutter)
    const freqs = [185.0, 220.0, 261.6, 311.1]; // F#3, A3, C4, Eb4 (classic haunting minor)
    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      // Doppler pitch glide as train rushes past
      osc.frequency.setValueAtTime(freq * 1.06, now);
      osc.frequency.linearRampToValueAtTime(freq * 0.94, now + 1.4);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.12, now + 0.12);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.4);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.4);
    });

    // Haunting spectral steam hiss
    this.playNoiseBuffer(1.2, 0.22, 250, 1600);
  }

  playGameOver() {
    if (this.isMuted || !this.ctx) return;
    this.playMonsterRoar();
    setTimeout(() => {
      if (this.isMuted || !this.ctx) return;
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(90, now);
      osc.frequency.exponentialRampToValueAtTime(35, now + 1.2);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 1.3);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.3);
    }, 250);
  }

  playButtonClick() {
    if (this.isMuted || !this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.05);
  }

  // --- PROCEDURAL BACKGROUND CHASE MUSIC ---

  startBGM() {
    if (this.isBgmPlaying || this.isMuted) return;
    this.initAudio();
    if (!this.ctx) return;

    this.isBgmPlaying = true;
    this.bgmStep = 0;
    this.scheduleNextBeat();
  }

  stopBGM() {
    this.isBgmPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  setSpeedFactor(factor) {
    // Clamped between 1.0 and 1.8 for tense dynamic music acceleration
    this.speedFactor = Math.max(1.0, Math.min(1.8, factor));
  }

  scheduleNextBeat() {
    if (!this.isBgmPlaying || this.isMuted || !this.ctx) return;

    const baseBpm = this.currentBpm * this.speedFactor;
    const stepDurationMs = (60 / baseBpm / 2) * 1000; // 8th note steps

    this.playBgmStep(this.bgmStep);
    this.bgmStep = (this.bgmStep + 1) % 16;

    this.bgmTimer = setTimeout(() => {
      this.scheduleNextBeat();
    }, stepDurationMs);
  }

  playBgmStep(step) {
    if (!this.ctx || this.isMuted) return;
    const now = this.ctx.currentTime;

    // 1. Chase Kick / Dark Tom
    if (step % 4 === 0 || step === 10 || step === 14) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.12);

      gain.gain.setValueAtTime(step === 0 ? 0.35 : 0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.14);
    }

    // 2. Ghostly Shaker / High Pulse
    if (step % 2 === 1) {
      this.playNoiseBuffer(0.04, 0.05, 2000, 6000);
    }

    // 3. Haunted Melody Pattern (D Minor Gothic Mode: D, F, A, Bb, C, D)
    const melodyPattern = [
      146.83, // D3
      0,
      174.61, // F3
      220.00, // A3
      0,
      233.08, // Bb3
      220.00, // A3
      174.61, // F3
      146.83, // D3
      0,
      130.81, // C3
      146.83, // D3
      0,
      174.61, // F3
      146.83, // D3
      110.00  // A2
    ];

    const noteFreq = melodyPattern[step];
    if (noteFreq > 0) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(noteFreq, now);

      // Low pass filter for dark, spooky timbre
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(650, now);
      filter.Q.setValueAtTime(3, now);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.22);
    }
  }

  // Utility to generate filtered noise bursts (whoosh, slide, crunch)
  playNoiseBuffer(duration, volume, lowCut = 200, highCut = 1200) {
    if (this.isMuted || !this.ctx) return;
    try {
      const bufferSize = Math.floor(this.ctx.sampleRate * duration);
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const bandpass = this.ctx.createBiquadFilter();
      bandpass.type = 'bandpass';
      bandpass.frequency.setValueAtTime((lowCut + highCut) / 2, this.ctx.currentTime);
      bandpass.Q.setValueAtTime(1.2, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      whiteNoise.connect(bandpass);
      bandpass.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start();
      whiteNoise.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Audio buffer safety
    }
  }
}

// Global instance
window.soundEngine = new SoundEngine();
