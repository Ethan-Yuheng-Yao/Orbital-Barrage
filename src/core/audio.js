const audio = {
  ctx: null,
  master: null,
  music: null,
  bgmEl: null,
  bgmGain: null,
  bgmBuffer: null,
  bgmSource: null,
  unlocked: false,
  enabled: true,
  sfxVolume: 0.4,
  musicVolume: 0.22,
  useProceduralMusic: false,
  beatInterval: 0.28,
  nextBeatTime: 0,
  musicPattern: [110, 138.59, 164.81, 138.59, 123.47, 164.81, 174.61, 138.59],
  musicStep: 0,
  shotCooldownUntil: 0,
};

const initAudio = () => {
  if (audio.ctx || !audio.enabled) return;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;
  audio.ctx = new AudioCtx();
  audio.master = audio.ctx.createGain();
  audio.master.gain.value = 0.9;
  audio.master.connect(audio.ctx.destination);
  audio.music = audio.ctx.createGain();
  audio.music.gain.value = 0;
  audio.music.connect(audio.master);
  audio.bgmGain = audio.ctx.createGain();
  audio.bgmGain.gain.value = audio.musicVolume;
  audio.bgmGain.connect(audio.master);
  fetch("./audio/BackgroundAudio.mp3")
    .then(r => r.arrayBuffer())
    .then(ab => audio.ctx.decodeAudioData(ab))
    .then(buffer => {
      audio.bgmBuffer = buffer;
      if (audio.unlocked) startBgmLoop();
    })
    .catch(() => {
      audio.bgmEl = new Audio("./audio/BackgroundAudio.mp3");
      audio.bgmEl.loop = true;
      audio.bgmEl.preload = "auto";
      audio.bgmEl.volume = audio.musicVolume;
      if (audio.unlocked) audio.bgmEl.play().catch(() => {});
    });
};

const startBgmLoop = () => {
  if (!audio.bgmBuffer || !audio.ctx || !audio.bgmGain) return;
  if (audio.bgmSource) {
    try { audio.bgmSource.stop(0); } catch (e) {}
    audio.bgmSource.disconnect();
    audio.bgmSource = null;
  }
  const src = audio.ctx.createBufferSource();
  src.buffer = audio.bgmBuffer;
  src.loop = true;
  src.connect(audio.bgmGain);
  src.start(0);
  audio.bgmSource = src;
};

const unlockAudio = () => {
  if (!audio.enabled) return;
  initAudio();
  if (!audio.ctx) return;
  if (audio.ctx.state === "suspended") {
    audio.ctx.resume();
  }
  audio.unlocked = true;
  if (audio.bgmBuffer && !audio.bgmSource) {
    startBgmLoop();
  } else if (audio.bgmEl && audio.bgmEl.paused) {
    audio.bgmEl.volume = audio.musicVolume;
    audio.bgmEl.play().catch(() => {});
  }
};

const tone = (freq, duration, type, volume, target = "master") => {
  if (!audio.enabled || !audio.unlocked || !audio.ctx) return;
  const now = audio.ctx.currentTime;
  const osc = audio.ctx.createOscillator();
  const gain = audio.ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume), now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  osc.connect(gain);
  gain.connect(target === "music" ? audio.music : audio.master);
  osc.start(now);
  osc.stop(now + duration + 0.02);
};

const noiseBurst = (duration = 0.08, volume = 0.05) => {
  if (!audio.enabled || !audio.unlocked || !audio.ctx) return;
  const frameCount = Math.floor(audio.ctx.sampleRate * duration);
  const buffer = audio.ctx.createBuffer(1, frameCount, audio.ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frameCount; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / frameCount);
  }
  const source = audio.ctx.createBufferSource();
  const gain = audio.ctx.createGain();
  source.buffer = buffer;
  gain.gain.value = volume;
  source.connect(gain);
  gain.connect(audio.master);
  source.start();
};

const playSfx = {
  shoot: (shipId) => {
    const now = performance.now();
    if (now < audio.shotCooldownUntil) return;
    audio.shotCooldownUntil = now + 55;
    if (shipId === "inferno") {
      noiseBurst(0.04, audio.sfxVolume * 0.2);
      tone(180, 0.05, "sawtooth", audio.sfxVolume * 0.1);
      return;
    }
    if (shipId === "aurora") {
      tone(620, 0.07, "triangle", audio.sfxVolume * 0.15);
      return;
    }
    if (shipId === "stinger") {
      tone(520, 0.04, "sawtooth", audio.sfxVolume * 0.08);
      tone(880, 0.03, "square", audio.sfxVolume * 0.06);
      return;
    }
    tone(360, 0.05, "square", audio.sfxVolume * 0.1);
  },
  ability: () => {
    tone(420, 0.06, "triangle", audio.sfxVolume * 0.2);
    tone(660, 0.08, "sine", audio.sfxVolume * 0.14);
  },
  enemyDown: () => {
    tone(180, 0.06, "square", audio.sfxVolume * 0.12);
  },
  bossDown: () => {
    tone(220, 0.18, "sawtooth", audio.sfxVolume * 0.18);
    tone(110, 0.24, "triangle", audio.sfxVolume * 0.15);
  },
  powerUp: () => {
    tone(740, 0.08, "sine", audio.sfxVolume * 0.15);
    tone(980, 0.1, "triangle", audio.sfxVolume * 0.11);
  },
  hitPlayer: () => {
    noiseBurst(0.06, audio.sfxVolume * 0.18);
  },
};

const applyMusicVolume = () => {
  const vol = clamp(audio.musicVolume, 0, 1);
  if (audio.bgmGain && audio.ctx) {
    const now = audio.ctx.currentTime;
    audio.bgmGain.gain.cancelScheduledValues(now);
    audio.bgmGain.gain.setValueAtTime(vol, now);
  }
  if (audio.bgmEl) {
    audio.bgmEl.volume = vol;
  }
};

const updateMusic = () => {
  if (!audio.enabled) return;
  applyMusicVolume();
  if (!audio.unlocked || !audio.ctx) return;
  if (audio.bgmGain && !audio.bgmSource && audio.bgmBuffer) {
    startBgmLoop();
  } else if (audio.bgmEl && audio.bgmEl.paused) {
    audio.bgmEl.play().catch(() => {});
  }
  if (!audio.useProceduralMusic) {
    audio.music.gain.setTargetAtTime(0, audio.ctx.currentTime, 0.08);
    return;
  }
  const musicTarget = state.running && !state.paused ? audio.musicVolume : 0;
  const now = audio.ctx.currentTime;
  audio.music.gain.setTargetAtTime(musicTarget, now, 0.12);
  if (!(state.running && !state.paused)) return;
  if (audio.nextBeatTime === 0) audio.nextBeatTime = now + 0.02;
  while (audio.nextBeatTime < now + 0.06) {
    const freq = audio.musicPattern[audio.musicStep % audio.musicPattern.length];
    const osc = audio.ctx.createOscillator();
    const gain = audio.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, audio.nextBeatTime);
    gain.gain.exponentialRampToValueAtTime(0.06, audio.nextBeatTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, audio.nextBeatTime + 0.2);
    osc.connect(gain);
    gain.connect(audio.music);
    osc.start(audio.nextBeatTime);
    osc.stop(audio.nextBeatTime + 0.22);
    audio.nextBeatTime += audio.beatInterval;
    audio.musicStep++;
  }
};
