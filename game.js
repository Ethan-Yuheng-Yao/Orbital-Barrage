const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const hud = {
  hp: document.getElementById("hpValue"),
  hpBarFill: document.getElementById("hpBarFill"),
  shield: document.getElementById("shieldValue"),
  shieldBarFill: document.getElementById("shieldBarFill"),
  energy: document.getElementById("energyValue"),
  energyBarFill: document.getElementById("energyBarFill"),
  score: document.getElementById("scoreValue"),
  wave: document.getElementById("waveValue"),
  highScore: document.getElementById("highScoreValue"),
  quantumCores: document.getElementById("quantumCoresValue"),
};

const instructionsEl = document.getElementById("instructions");
const startButton = document.getElementById("startButton");
const gameOverEl = document.getElementById("gameOver");
const restartButton = document.getElementById("restartButton");
const gameOverTitle = document.getElementById("gameOverTitle");
const gameOverDetails = document.getElementById("gameOverDetails");
const bossBar = document.getElementById("bossBar");
const bossBarFill = document.getElementById("bossBarFill");
const upgradePanel = document.getElementById("upgradePanel");
const upgradeOptionsEl = document.getElementById("upgradeOptions");
const shipShopPanel = document.getElementById("shipShopPanel");
const shipShopList = document.getElementById("shipShopList");
const shopButton = document.getElementById("shopButton");
const shopCloseButton = document.getElementById("shopCloseButton");
const shopQuantumCores = document.getElementById("shopQuantumCores");
const codexButton = document.getElementById("codexButton");
const codexPanel = document.getElementById("codexPanel");
const codexCloseButton = document.getElementById("codexCloseButton");
const codexGrid = document.getElementById("codexGrid");
const challengeButton = document.getElementById("challengeButton");
const challengePanel = document.getElementById("challengePanel");
const challengeCloseButton = document.getElementById("challengeCloseButton");
const challengeList = document.getElementById("challengeList");
const fxLabButton = document.getElementById("fxLabButton");
const fxLabPanel = document.getElementById("fxLabPanel");
const fxLabCloseButton = document.getElementById("fxLabCloseButton");
const fxLabList = document.getElementById("fxLabList");
const mapRegistryButton = document.getElementById("mapRegistryButton");
const mapRegistryPanel = document.getElementById("mapRegistryPanel");
const mapRegistryCloseButton = document.getElementById("mapRegistryCloseButton");
const tutorialButton = document.getElementById("tutorialButton");
const tutorialOverlay = document.getElementById("tutorialOverlay");
const tutorialTextTop = document.getElementById("tutorialTextTop");
const tutorialTextTopContent = document.getElementById("tutorialTextTopContent");
const tutorialNextStepButton = document.getElementById("tutorialNextStepButton");
const tutorialSkipButton = document.getElementById("tutorialSkipButton");
const quantumCoresDisplay = document.getElementById("quantumCoresDisplay");
const quantumCoresDisplayValue = document.getElementById("quantumCoresDisplayValue");
const settingsButton = document.getElementById("settingsButton");
const settingsButtonHub = document.getElementById("settingsButtonHub");
const hudSettingsButton = document.getElementById("hudSettingsButton");
const settingsPanel = document.getElementById("settingsPanel");
const settingsCloseButton = document.getElementById("settingsCloseButton");
const termsPanel = document.getElementById("termsPanel");
const termsCloseButton = document.getElementById("termsCloseButton");
const termsButton = document.getElementById("termsButton");
const presetNumbers = document.getElementById("presetNumbers");
const presetMouse = document.getElementById("presetMouse");
const keyBinding1 = document.getElementById("keyBinding1");
const keyBinding2 = document.getElementById("keyBinding2");
const keyBinding3 = document.getElementById("keyBinding3");
const abilityIcons = document.getElementById("abilityIcons");
const mainHub = document.getElementById("mainHub");
const endlessButton = document.getElementById("endlessButton");
const campaignButton = document.getElementById("campaignButton");
const shopButtonMain = document.getElementById("shopButtonMain");
const endlessShipScroll = document.getElementById("endlessShipScroll");
const endlessShipNext = document.getElementById("endlessShipNext");
const instructionsButton = document.getElementById("instructionsButton");
const backToHubButton = document.getElementById("backToHubButton");
const instructionsPanel = document.getElementById("instructionsPanel");
const backFromInstructions = document.getElementById("backFromInstructions");
const campaignPanel = document.getElementById("campaignPanel");
const campaignCloseButton = document.getElementById("campaignCloseButton");
const campaignBackButton = document.getElementById("campaignBackButton");
const campaignStartButton = document.getElementById("campaignStartButton");
const campaignLevelGrid = document.getElementById("campaignLevelGrid");
const achievementsButton = document.getElementById("achievementsButton");
const achievementsPanel = document.getElementById("achievementsPanel");
const achievementsCloseButton = document.getElementById("achievementsCloseButton");
const achievementsSummary = document.getElementById("achievementsSummary");
const achievementsList = document.getElementById("achievementsList");
const advancedCodexButton = document.getElementById("advancedCodexButton");
const advancedChallengeButton = document.getElementById("advancedChallengeButton");
const advancedFxLabButton = document.getElementById("advancedFxLabButton");
const advancedMapRegistryButton = document.getElementById("advancedMapRegistryButton");

const input = {
  keys: new Set(),
  mouse: { x: canvas.width / 2, y: canvas.height / 2, down: false },
};

const config = {
  width: canvas.width,
  height: canvas.height,
};
const TOP_HUD_SAFE_Y = 96;

const audio = {
  ctx: null,
  master: null,
  music: null,
  bgmEl: null,
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
  audio.bgmEl = new Audio("./audio/BackgroundAudio.mp3");
  audio.bgmEl.loop = true;
  audio.bgmEl.preload = "auto";
  audio.bgmEl.volume = audio.musicVolume;
};

const unlockAudio = () => {
  if (!audio.enabled) return;
  initAudio();
  if (!audio.ctx) return;
  if (audio.ctx.state === "suspended") {
    audio.ctx.resume();
  }
  audio.unlocked = true;
  if (audio.bgmEl) {
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

const updateMusic = () => {
  if (!audio.enabled || !audio.unlocked || !audio.ctx) return;
  if (audio.bgmEl) {
    audio.bgmEl.volume = clamp(audio.musicVolume, 0, 1);
    if (audio.bgmEl.paused) {
      audio.bgmEl.play().catch(() => {});
    }
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

const difficultyModes = {
  recruit: {
    enemyHp: 0.55,
    enemySpeed: 0.72,
    enemyCount: 1,
    powerDrop: 1.25,
    bossHpMultiplier: 0.8,
  },
  veteran: {
    enemyHp: 0.8,
    enemySpeed: 0.88,
    enemyCount: 1,
    powerDrop: 1,
    bossHpMultiplier: 1,
  },
  nightmare: {
    enemyHp: 1.35,
    enemySpeed: 1.15,
    enemyCount: 1,
    powerDrop: 0.75,
    bossHpMultiplier: 1.5,
  },
};

const shipLoadouts = {
  striker: {
    id: "striker",
    name: "Striker",
    tier: "common",
    speed: 225,
    maxHp: 90,
    maxShield: 28,
    maxEnergy: 68,
    baseCooldown: 0.7,
    damageMultiplier: 0.68,
    shotSpeedMultiplier: 0.82,
    energyRegenMultiplier: 0.26,
    shieldRegenMultiplier: 1.15,
    abilities: [
      { key: "1", name: "Omni Burst", cost: 100, type: "burst" },
      { key: "2", name: "Kinetic Spray", cost: 40, type: "rapidVolley" },
      { key: "3", name: "Flux Lances", cost: 60, type: "energySurge" },
    ],
    price: 0,
    unlocked: true,
  },
  sparrow: {
    id: "sparrow",
    name: "Sparrow",
    tier: "common",
    speed: 272,
    maxHp: 74,
    maxShield: 20,
    maxEnergy: 72,
    baseCooldown: 0.58,
    damageMultiplier: 0.56,
    shotSpeedMultiplier: 1.12,
    energyRegenMultiplier: 0.34,
    shieldRegenMultiplier: 1.05,
    abilities: [
      { key: "1", name: "Feather Salvo", cost: 40, type: "rapidVolley" },
      { key: "2", name: "Blink", cost: 80, type: "blink" },
      { key: "3", name: "Capacitor Bloom", cost: 60, type: "energySurge" },
    ],
    price: 900,
    unlocked: false,
  },
  phantom: {
    id: "phantom",
    name: "Phantom",
    tier: "uncommon",
    speed: 260,
    maxHp: 85,
    maxShield: 26,
    maxEnergy: 78,
    baseCooldown: 0.62,
    damageMultiplier: 0.78,
    shotSpeedMultiplier: 1.05,
    energyRegenMultiplier: 0.55,
    shieldRegenMultiplier: 1.9,
    abilities: [
      { key: "1", name: "Blink", cost: 80, type: "blink" },
      { key: "2", name: "Ghostfire", cost: 45, type: "ghostfire" },
      { key: "3", name: "Phase Shift", cost: 65, type: "phaseShift" },
    ],
    price: 1800,
    unlocked: false,
  },
  aegis: {
    id: "aegis",
    name: "Aegis",
    tier: "rare",
    speed: 235,
    maxHp: 130,
    maxShield: 58,
    maxEnergy: 84,
    baseCooldown: 0.58,
    damageMultiplier: 0.9,
    shotSpeedMultiplier: 0.84,
    energyRegenMultiplier: 0.5,
    shieldRegenMultiplier: 2.5,
    abilities: [
      { key: "1", name: "Bastion Pulse", cost: 100, type: "shockwave" },
      { key: "2", name: "Aegis Reservoir", cost: 50, type: "shieldOvercharge" },
      { key: "3", name: "Bulwark Brace", cost: 70, type: "fortify" },
    ],
    price: 4800,
    unlocked: false,
  },
  tempest: {
    id: "tempest",
    name: "Tempest",
    tier: "rare",
    speed: 285,
    maxHp: 102,
    maxShield: 40,
    maxEnergy: 95,
    baseCooldown: 0.52,
    damageMultiplier: 1.02,
    shotSpeedMultiplier: 1.16,
    energyRegenMultiplier: 0.95,
    shieldRegenMultiplier: 2.2,
    abilities: [
      { key: "1", name: "Crown Lightning", cost: 100, type: "lightningStorm" },
      { key: "2", name: "Storm Shell Drones", cost: 60, type: "combatDrone" },
      { key: "3", name: "Arc Induction", cost: 70, type: "overload" },
    ],
    price: 7600,
    unlocked: false,
  },
  titan: {
    id: "titan",
    name: "Titan",
    tier: "legendary",
    speed: 255,
    maxHp: 320,
    maxShield: 92,
    maxEnergy: 98,
    baseCooldown: 0.4,
    damageMultiplier: 1.48,
    shotSpeedMultiplier: 1.02,
    energyRegenMultiplier: 1.05,
    shieldRegenMultiplier: 3.2,
    abilities: [
      { key: "1", name: "Siege Cannon", cost: 100, type: "siegeCannon" },
      { key: "2", name: "Energy Barrier", cost: 70, type: "energyBarrier" },
      { key: "3", name: "Rampage", cost: 75, type: "rampage" },
    ],
    price: 42000,
    unlocked: false,
  },
  specter: {
    id: "specter",
    name: "Specter",
    tier: "mythic",
    speed: 340,
    maxHp: 100,
    maxShield: 34,
    maxEnergy: 118,
    baseCooldown: 0.36,
    damageMultiplier: 1.14,
    shotSpeedMultiplier: 1.38,
    energyRegenMultiplier: 1.9,
    shieldRegenMultiplier: 3.5,
    abilities: [
      { key: "1", name: "Void Snare", cost: 120, type: "blackHole" },
      { key: "2", name: "Shadow Step", cost: 40, type: "shadowStep" },
      { key: "3", name: "Ethereal", cost: 60, type: "ethereal" },
    ],
    price: 31000,
    unlocked: false,
  },
  vanguard: {
    id: "vanguard",
    name: "Vanguard",
    tier: "uncommon",
    speed: 245,
    maxHp: 102,
    maxShield: 34,
    maxEnergy: 74,
    baseCooldown: 0.6,
    damageMultiplier: 0.82,
    shotSpeedMultiplier: 0.95,
    energyRegenMultiplier: 0.48,
    shieldRegenMultiplier: 1.7,
    abilities: [
      { key: "1", name: "Chain Bolt", cost: 55, type: "chainBolt" },
      { key: "2", name: "Flank Burst", cost: 40, type: "rapidVolley" },
      { key: "3", name: "Drive Surge", cost: 60, type: "energySurge" },
    ],
    price: 2600,
    unlocked: false,
  },
  reaper: {
    id: "reaper",
    name: "Reaper",
    tier: "rare",
    speed: 280,
    maxHp: 118,
    maxShield: 44,
    maxEnergy: 88,
    baseCooldown: 0.5,
    damageMultiplier: 1.08,
    shotSpeedMultiplier: 1.1,
    energyRegenMultiplier: 0.92,
    shieldRegenMultiplier: 2.4,
    abilities: [
      { key: "1", name: "Death Mark", cost: 90, type: "deathMark" },
      { key: "2", name: "Soul Harvest", cost: 65, type: "soulHarvest" },
      { key: "3", name: "Blink", cost: 80, type: "blink" },
    ],
    price: 9200,
    unlocked: false,
  },
  nova: {
    id: "nova",
    name: "Nova",
    tier: "legendary",
    speed: 318,
    maxHp: 150,
    maxShield: 58,
    maxEnergy: 132,
    baseCooldown: 0.36,
    damageMultiplier: 1.38,
    shotSpeedMultiplier: 1.24,
    energyRegenMultiplier: 1.35,
    shieldRegenMultiplier: 2.8,
    abilities: [
      { key: "1", name: "Azure Cataclysm", cost: 120, type: "azureCataclysm" },
      { key: "2", name: "Bluefall Barrage", cost: 90, type: "bluefallBarrage" },
      { key: "3", name: "Orbital Tides", cost: 75, type: "novaSwarmDrones" },
    ],
    price: 56000,
    unlocked: false,
  },
  voidwalker: {
    id: "voidwalker",
    name: "Voidwalker",
    tier: "legendary",
    speed: 355,
    maxHp: 108,
    maxShield: 38,
    maxEnergy: 132,
    baseCooldown: 0.33,
    damageMultiplier: 1.2,
    shotSpeedMultiplier: 1.42,
    energyRegenMultiplier: 2.1,
    shieldRegenMultiplier: 3.8,
    abilities: [
      { key: "1", name: "Void Rift", cost: 130, type: "voidRift" },
      { key: "2", name: "Dimensional Slash", cost: 85, type: "dimensionalSlash" },
      { key: "3", name: "Ethereal", cost: 60, type: "ethereal" },
    ],
    price: 45000,
    unlocked: false,
  },
  glacier: {
    id: "glacier",
    name: "Glacier",
    tier: "uncommon",
    speed: 230,
    maxHp: 110,
    maxShield: 40,
    maxEnergy: 80,
    baseCooldown: 0.57,
    damageMultiplier: 0.86,
    shotSpeedMultiplier: 0.9,
    energyRegenMultiplier: 0.62,
    shieldRegenMultiplier: 2.1,
    abilities: [
      { key: "1", name: "Frost Nova", cost: 100, type: "burst" },
      { key: "2", name: "Cryo Volley", cost: 40, type: "rapidVolley" },
      { key: "3", name: "Ice Reactor", cost: 60, type: "energySurge" },
    ],
    price: 3600,
    unlocked: false,
  },
  bulwark: {
    id: "bulwark",
    name: "Bulwark",
    tier: "uncommon",
    speed: 220,
    maxHp: 145,
    maxShield: 68,
    maxEnergy: 76,
    baseCooldown: 0.65,
    damageMultiplier: 0.8,
    shotSpeedMultiplier: 0.8,
    energyRegenMultiplier: 0.42,
    shieldRegenMultiplier: 2.6,
    abilities: [
      { key: "1", name: "Polarize Field", cost: 50, type: "shieldOvercharge" },
      { key: "2", name: "Rampart Lock", cost: 70, type: "fortify" },
      { key: "3", name: "Seismic Clap", cost: 100, type: "shockwave" },
    ],
    price: 4200,
    unlocked: false,
  },
  inferno: {
    id: "inferno",
    name: "Inferno",
    tier: "legendary",
    speed: 300,
    maxHp: 175,
    maxShield: 62,
    maxEnergy: 128,
    baseCooldown: 0.38,
    damageMultiplier: 1.34,
    shotSpeedMultiplier: 1.1,
    energyRegenMultiplier: 1.45,
    shieldRegenMultiplier: 2.9,
    abilities: [
      { key: "1", name: "Core Flare", cost: 70, type: "overload" },
      { key: "2", name: "Thermal Bloom", cost: 60, type: "energySurge" },
      { key: "3", name: "Pyroclast Rain", cost: 75, type: "starfall" },
    ],
    price: 62000,
    unlocked: false,
  },
  aurora: {
    id: "aurora",
    name: "Aurora",
    tier: "mythic",
    speed: 336,
    maxHp: 150,
    maxShield: 56,
    maxEnergy: 146,
    baseCooldown: 0.34,
    damageMultiplier: 1.26,
    shotSpeedMultiplier: 1.32,
    energyRegenMultiplier: 1.8,
    shieldRegenMultiplier: 3.1,
    abilities: [
      { key: "1", name: "Borealis Threads", cost: 100, type: "lightningStorm" },
      { key: "2", name: "Chain Bolt", cost: 55, type: "chainBolt" },
      { key: "3", name: "Aurora Slip", cost: 65, type: "phaseShift" },
    ],
    price: 32000,
    unlocked: false,
  },
  aphelion: {
    id: "aphelion",
    name: "Aphelion",
    tier: "exotic",
    speed: 385,
    maxHp: 240,
    maxShield: 118,
    maxEnergy: 178,
    baseCooldown: 0.24,
    damageMultiplier: 1.95,
    shotSpeedMultiplier: 1.62,
    energyRegenMultiplier: 3.2,
    shieldRegenMultiplier: 6.4,
    abilities: [
      { key: "1", name: "Keelbreaker Singularity", cost: 120, type: "blackHole" },
      { key: "2", name: "Keelbreaker Cascade", cost: 75, type: "starfall" },
      { key: "3", name: "Aether Warp", cost: 60, type: "ethereal" },
    ],
    price: 120000,
    unlocked: false,
  },
};

const ADVANCED_SHIP_LIBRARY = [
  { id: "halberd", name: "Halberd", tier: "rare", speed: 268, maxHp: 128, maxShield: 46, maxEnergy: 98, baseCooldown: 0.49, damageMultiplier: 1.06, shotSpeedMultiplier: 1.08, energyRegenMultiplier: 0.86, shieldRegenMultiplier: 2.1, abilities: [{ key: "1", name: "Halberd Shock", cost: 100, type: "shockwave" }, { key: "2", name: "Chain Bolt", cost: 55, type: "chainBolt" }, { key: "3", name: "Polearm Brace", cost: 70, type: "fortify" }], price: 9800, unlocked: false },
  { id: "lancer", name: "Lancer", tier: "uncommon", speed: 292, maxHp: 102, maxShield: 32, maxEnergy: 92, baseCooldown: 0.52, damageMultiplier: 0.9, shotSpeedMultiplier: 1.2, energyRegenMultiplier: 0.88, shieldRegenMultiplier: 1.8, abilities: [{ key: "1", name: "Lance Volley", cost: 40, type: "rapidVolley" }, { key: "2", name: "Blink", cost: 80, type: "blink" }, { key: "3", name: "Chain Bolt", cost: 55, type: "chainBolt" }], price: 5400, unlocked: false },
  { id: "raven", name: "Raven", tier: "rare", speed: 312, maxHp: 112, maxShield: 38, maxEnergy: 104, baseCooldown: 0.44, damageMultiplier: 1.08, shotSpeedMultiplier: 1.24, energyRegenMultiplier: 0.92, shieldRegenMultiplier: 2.0, abilities: [{ key: "1", name: "Ghostfire", cost: 45, type: "ghostfire" }, { key: "2", name: "Death Mark", cost: 90, type: "deathMark" }, { key: "3", name: "Shadow Step", cost: 40, type: "shadowStep" }], price: 12600, unlocked: false },
  { id: "warden", name: "Warden", tier: "rare", speed: 242, maxHp: 180, maxShield: 76, maxEnergy: 102, baseCooldown: 0.57, damageMultiplier: 0.94, shotSpeedMultiplier: 0.94, energyRegenMultiplier: 0.8, shieldRegenMultiplier: 3.0, abilities: [{ key: "1", name: "Energy Barrier", cost: 70, type: "energyBarrier" }, { key: "2", name: "Bastion Reinforce", cost: 50, type: "shieldOvercharge" }, { key: "3", name: "Aftershock", cost: 100, type: "shockwave" }], price: 16000, unlocked: false },
  { id: "helios", name: "Helios", tier: "legendary", speed: 322, maxHp: 192, maxShield: 64, maxEnergy: 140, baseCooldown: 0.33, damageMultiplier: 1.44, shotSpeedMultiplier: 1.28, energyRegenMultiplier: 1.42, shieldRegenMultiplier: 2.9, abilities: [{ key: "1", name: "Solar Collapse", cost: 120, type: "supernova" }, { key: "2", name: "Coronal Deluge", cost: 75, type: "starfall" }, { key: "3", name: "Photosphere Overdrive", cost: 70, type: "overload" }], price: 72000, unlocked: false },
  { id: "eclipse", name: "Eclipse", tier: "mythic", speed: 362, maxHp: 132, maxShield: 52, maxEnergy: 168, baseCooldown: 0.29, damageMultiplier: 1.36, shotSpeedMultiplier: 1.5, energyRegenMultiplier: 2.22, shieldRegenMultiplier: 3.8, abilities: [{ key: "1", name: "Penumbra Core", cost: 120, type: "blackHole" }, { key: "2", name: "Void Rift", cost: 130, type: "voidRift" }, { key: "3", name: "Aether Warp", cost: 60, type: "ethereal" }], price: 88000, unlocked: false },
  { id: "oracle", name: "Oracle", tier: "legendary", speed: 305, maxHp: 158, maxShield: 70, maxEnergy: 154, baseCooldown: 0.35, damageMultiplier: 1.28, shotSpeedMultiplier: 1.18, energyRegenMultiplier: 1.7, shieldRegenMultiplier: 3.4, abilities: [{ key: "1", name: "Oracular Blink", cost: 65, type: "phaseShift" }, { key: "2", name: "Probability Arcs", cost: 100, type: "lightningStorm" }, { key: "3", name: "Sentinel Knives", cost: 60, type: "combatDrone" }], price: 69000, unlocked: false },
  { id: "seraph", name: "Seraph", tier: "exotic", speed: 390, maxHp: 210, maxShield: 102, maxEnergy: 190, baseCooldown: 0.22, damageMultiplier: 1.82, shotSpeedMultiplier: 1.64, energyRegenMultiplier: 3.0, shieldRegenMultiplier: 6.0, abilities: [{ key: "1", name: "Umbral Singularity", cost: 120, type: "blackHole" }, { key: "2", name: "Stellar Ignition", cost: 120, type: "supernova" }, { key: "3", name: "Dimensional Slash", cost: 85, type: "dimensionalSlash" }], price: 135000, unlocked: false },
  { id: "myrmidon", name: "Myrmidon", tier: "uncommon", speed: 276, maxHp: 126, maxShield: 40, maxEnergy: 96, baseCooldown: 0.54, damageMultiplier: 0.92, shotSpeedMultiplier: 1.1, energyRegenMultiplier: 0.82, shieldRegenMultiplier: 1.9, abilities: [{ key: "1", name: "Kickback Salvo", cost: 40, type: "rapidVolley" }, { key: "2", name: "Reactor Flush", cost: 60, type: "energySurge" }, { key: "3", name: "Phalanx Brace", cost: 70, type: "fortify" }], price: 6100, unlocked: false },
  { id: "grimstar", name: "Grimstar", tier: "legendary", speed: 334, maxHp: 166, maxShield: 58, maxEnergy: 148, baseCooldown: 0.31, damageMultiplier: 1.41, shotSpeedMultiplier: 1.34, energyRegenMultiplier: 1.56, shieldRegenMultiplier: 3.2, abilities: [{ key: "1", name: "Death Mark", cost: 90, type: "deathMark" }, { key: "2", name: "Soul Harvest", cost: 65, type: "soulHarvest" }, { key: "3", name: "Obituary Meteors", cost: 75, type: "starfall" }], price: 76000, unlocked: false }
];

const ADVANCED_PATTERN_LIBRARY = [
  { id: "encircle-arc", family: "encirclement", rhythm: "medium", threat: 2, note: "Wraps player with delayed arc shots and then punctures centerline." },
  { id: "spear-rain", family: "volley", rhythm: "fast", threat: 3, note: "Vertical staggered lances that punish static movement." },
  { id: "gravity-fan", family: "gravity", rhythm: "slow", threat: 4, note: "Converging wedges that compress dodge lanes from both wings." },
  { id: "cross-thread", family: "threading", rhythm: "fast", threat: 3, note: "Alternating X patterns with tiny safe pockets." },
  { id: "delta-net", family: "saturation", rhythm: "medium", threat: 4, note: "Triad packets that drift and then snap toward current player vector." },
  { id: "shatter-wheel", family: "orbital", rhythm: "medium", threat: 5, note: "Rotating wheel that cracks into high-speed shards at 60% radius." },
  { id: "ion-gate", family: "gating", rhythm: "slow", threat: 3, note: "Sequential gates force pathing decisions before burst release." },
  { id: "spiral-lock", family: "spiral", rhythm: "fast", threat: 5, note: "Dual spirals rotating opposite directions with randomized phase." },
  { id: "mirror-lattice", family: "lattice", rhythm: "medium", threat: 4, note: "Mirrored hex lattice with directional phase flips." },
  { id: "tidal-flood", family: "wave", rhythm: "slow", threat: 2, note: "Broad wavefront with low DPS, high displacement pressure." },
  { id: "needle-crown", family: "pinpoint", rhythm: "fast", threat: 4, note: "Radial needle bursts from micro-crown satellites." },
  { id: "horizon-saw", family: "sweeper", rhythm: "medium", threat: 5, note: "Horizontal sawtooth sweep with acceleration ramp." }
];

const ADVANCED_CHALLENGE_PRESETS = [
  { id: "iron-recruit", title: "Iron Recruit", stars: 2, description: "Recruit HP scaling with Veteran projectile speed.", mutators: ["enemySpeed+10%", "dropRate+15%", "bossHp-10%"] },
  { id: "fracture-veteran", title: "Fracture Veteran", stars: 3, description: "Veteran baseline with extra mixed enemy packs.", mutators: ["enemyCount+20%", "eliteChance+12%", "healingDrops-8%"] },
  { id: "nightmare-thread", title: "Nightmare Thread", stars: 4, description: "Nightmare speed plus denial-heavy wave scripting.", mutators: ["enemySpeed+18%", "projectileSpread+24%", "shieldRegen-15%"] },
  { id: "abyss-marathon", title: "Abyss Marathon", stars: 5, description: "Long-form run with aggressive bosses every 4 waves.", mutators: ["bossInterval=4", "bossHp+22%", "energyRegen-10%"] },
  { id: "rift-gauntlet", title: "Rift Gauntlet", stars: 5, description: "High enemy density and reduced arena control windows.", mutators: ["enemyCount+35%", "dropRate-20%", "eliteChance+22%"] },
  { id: "astral-exam", title: "Astral Exam", stars: 3, description: "Balanced challenge with strict survival checks.", mutators: ["maxHp-12%", "shieldRegen+20%", "enemyDamage+8%"] }
];

const ADVANCED_FX_PROFILES = [
  { id: "blackhole-core", label: "Black Hole", category: "gravity", visual: "Dense violet ring with inward spiral particles and hard center sink.", signature: "spiral_inward_dense" },
  { id: "void-rift-shear", label: "Void Rift", category: "anomaly", visual: "Jagged indigo fissure with offset asymmetrical shear and shard outflow.", signature: "rift_shear_outflow" },
  { id: "abyss-supernova", label: "Abyssal Supernova", category: "nova", visual: "Teal-white inflation phase and blinding shock-shell with delayed star fragments.", signature: "nova_shell_fragments" },
  { id: "event-horizon", label: "Event Horizon", category: "gravity", visual: "Crimson-edged singularity with concentric lensing halos and collapsing filaments.", signature: "horizon_filament_collapse" },
  { id: "dimensional-slash", label: "Dimensional Slash", category: "rift", visual: "Linear fracture ribbons that peel into angular cuts.", signature: "ribbon_fracture_linear" }
];

const ADVANCED_SHIP_VISUAL_LIBRARY = [
  { id: "striker", hull: "delta", wings: "dual-mid", trail: "cyan-short", accent: "#9bf5ff" },
  { id: "phantom", hull: "needle", wings: "reverse-thin", trail: "violet-ghost", accent: "#d1afff" },
  { id: "aegis", hull: "bastion", wings: "heavy-block", trail: "amber-thick", accent: "#ffe29b" },
  { id: "specter", hull: "wraith", wings: "hollow-prong", trail: "void-smoke", accent: "#9b7fff" },
  { id: "voidwalker", hull: "riftblade", wings: "split-prism", trail: "indigo-fork", accent: "#4a0080" },
  { id: "aphelion", hull: "crown", wings: "overdrive-spear", trail: "solar-fray", accent: "#ff4d4d" },
  { id: "halberd", hull: "spearhead", wings: "armored-mid", trail: "ion-band", accent: "#66ccff" },
  { id: "lancer", hull: "dart", wings: "flared", trail: "yellow-arc", accent: "#ffd166" },
  { id: "raven", hull: "talon", wings: "swept", trail: "dark-plasma", accent: "#b067ff" },
  { id: "warden", hull: "fortress", wings: "broad", trail: "aegis-mist", accent: "#8ef7b5" },
  { id: "helios", hull: "flare", wings: "sunbarb", trail: "sun-lace", accent: "#5ec6ff" },
  { id: "eclipse", hull: "crescent", wings: "double-prism", trail: "umbra-coil", accent: "#d9a6ff" },
  { id: "oracle", hull: "seer", wings: "orbital-winglet", trail: "lumen-thread", accent: "#6fffe9" },
  { id: "seraph", hull: "archon", wings: "tri-crown", trail: "scarlet-lens", accent: "#ff7b7b" }
];

const STELLAR_CODEX_ENTRIES = [
  "ARC-001 | Movement doctrine: drift-snap-drift to preserve dodge vectors.",
  "ARC-002 | Vector staging: keep weapon cone slightly ahead of enemy flow.",
  "ARC-003 | Reserve at least 30 energy for emergency displacement abilities.",
  "ARC-004 | Treat orbiting enemies as area-denial, not direct DPS checks.",
  "ARC-005 | Shield-first builds spike hardest in mid-wave pressure.",
  "ARC-006 | Burst archetypes should rotate lanes every two volleys.",
  "ARC-007 | Blink windows are strongest immediately after radial bursts.",
  "ARC-008 | Gravity abilities multiply value when used near borders.",
  "ARC-009 | Stacked pull effects are strongest when enemy speed is high.",
  "ARC-010 | Avoid overcommitting to center during boss telegraphs.",
  "ARC-011 | Nova and singularity effects are visually and tactically distinct.",
  "ARC-012 | Rift class abilities bias lateral shear and angular displacement.",
  "ARC-013 | Supernova class abilities bias shell expansion and delayed detonation.",
  "ARC-014 | Black-hole class abilities bias inward spiral accretion patterns.",
  "ARC-015 | Keep at least one short-cooldown button in every loadout.",
  "ARC-016 | Mixed tiers let lower-cost ships remain relevant in late waves.",
  "ARC-017 | Trial ships are ideal for learning ability sequence timings.",
  "ARC-018 | Pair fortification tools with multi-shot pressure for uptime.",
  "ARC-019 | Chain effects gain value from clustered enemy formations.",
  "ARC-020 | Lancing builds reward high shot-speed multipliers.",
  "ARC-021 | Treat energy regen as tempo, not just sustain.",
  "ARC-022 | Burst damage without control can lose to density spikes.",
  "ARC-023 | Control builds without finisher tools stall score growth.",
  "ARC-024 | The ideal loop alternates control, burst, and reposition.",
  "ARC-025 | Fire cadence changes matter as much as raw projectile count.",
  "ARC-026 | Tighter arenas favor shield and mitigation archetypes.",
  "ARC-027 | Open arenas favor burst and displacement archetypes.",
  "ARC-028 | Threat calibration uses projectile speed before HP tuning.",
  "ARC-029 | Enemy count scaling should preserve readable pathing corridors.",
  "ARC-030 | FX readability is a gameplay affordance, not cosmetic garnish.",
  "ARC-031 | Hull profile readability improves player identity in chaos.",
  "ARC-032 | Accent colors should communicate threat class at a glance.",
  "ARC-033 | Mythic tier expects high-expression ability cycles.",
  "ARC-034 | Exotic tier expects game-shaping ability anchors.",
  "ARC-035 | Rare tier should introduce first tactical fork.",
  "ARC-036 | Uncommon tier should reward cleaner execution.",
  "ARC-037 | Common tier remains baseline for mechanical learning.",
  "ARC-038 | Horizontal pressure patterns punish tunnel-aiming.",
  "ARC-039 | Vertical pressure patterns punish static cornering.",
  "ARC-040 | Spiral pressure patterns punish panic dashing.",
  "ARC-041 | Staggered volleys reward anticipation over reaction.",
  "ARC-042 | Dense shots with low speed can remain fair when telegraphed.",
  "ARC-043 | Sparse shots with high speed require stronger visual contrast.",
  "ARC-044 | Pull effects should include persistent centerline indicators.",
  "ARC-045 | Rift effects should include directional shear indicators.",
  "ARC-046 | Nova effects should include expansion phase indicators.",
  "ARC-047 | Maintain one-second readability window for major ult visuals.",
  "ARC-048 | Distinct silhouettes reduce misreads in mixed ability scenes.",
  "ARC-049 | FX categories: gravity, rift, nova, kinetic, arc, shield.",
  "ARC-050 | Sound and visuals should share timing landmarks.",
  "ARC-051 | Economy tuning relies on challenge-star and wave depth.",
  "ARC-052 | Price curves should leave early meaningful unlock decisions.",
  "ARC-053 | Top-tier unlocks should require strategic spending choices.",
  "ARC-054 | Data-driven libraries reduce hardcoded branch maintenance.",
  "ARC-055 | Codex entries act as in-client design telemetry.",
  "ARC-056 | Challenge cards should expose mutators explicitly.",
  "ARC-057 | FX lab helps prevent overlap among similar concepts.",
  "ARC-058 | UI panels should pause tactical input focus visually.",
  "ARC-059 | Control surfaces should reuse shop modal ergonomics.",
  "ARC-060 | Keep tactical copy concise to preserve scan speed.",
  "ARC-061 | Sprinting archetypes trade survivability for wave pace.",
  "ARC-062 | Tank archetypes trade peak DPS for positional certainty.",
  "ARC-063 | Hybrid archetypes trade specialization for consistency.",
  "ARC-064 | Heavy barrages demand cooldown discipline.",
  "ARC-065 | Reposition tools need clear entry and exit moments.",
  "ARC-066 | Survival boosts should not eclipse skill expression.",
  "ARC-067 | High pull strengths need capped crowd stacking.",
  "ARC-068 | Wave scripting should avoid unavoidable trap states.",
  "ARC-069 | Chaos can be hard, but never unreadable.",
  "ARC-070 | Reward familiarity by increasing pattern depth, not opacity.",
  "ARC-071 | Pattern recombination yields variety with lower implementation cost.",
  "ARC-072 | FX presets should map to gameplay categories directly.",
  "ARC-073 | Ability naming should reinforce mechanical intent.",
  "ARC-074 | Price tags should roughly track game-shaping potential.",
  "ARC-075 | Trial access lowers onboarding friction for high-tier content.",
  "ARC-076 | Threat systems should track overlap, not only base stats.",
  "ARC-077 | Damage spikes should be paired with recovery opportunities.",
  "ARC-078 | Recovery opportunities can be positional, not only drops.",
  "ARC-079 | Arena edges are strategic resources.",
  "ARC-080 | Front-loaded burst should have post-cast vulnerability windows.",
  "ARC-081 | Visual trails should signal intended movement arcs.",
  "ARC-082 | Lensing halos communicate horizon class abilities.",
  "ARC-083 | Shard outflow communicates unstable rift class effects.",
  "ARC-084 | Fragment blooms communicate delayed nova class detonations.",
  "ARC-085 | Multi-stage FX must preserve color hierarchy.",
  "ARC-086 | Readability order: shape > motion > color > detail.",
  "ARC-087 | Distinct center behavior differentiates gravity subclasses.",
  "ARC-088 | Combat rhythm benefits from alternating short and long casts.",
  "ARC-089 | Damage floors protect weaker loadouts from dead runs.",
  "ARC-090 | Damage ceilings protect stronger loadouts from trivial runs.",
  "ARC-091 | Boss pressure should test movement, then damage, then endurance.",
  "ARC-092 | Upgrade drafts should present at least one tempo option.",
  "ARC-093 | Economy rewards should align to risk exposure.",
  "ARC-094 | Advanced systems should still degrade gracefully.",
  "ARC-095 | Config libraries enable future event modes quickly.",
  "ARC-096 | UI discoverability prevents hidden-system abandonment.",
  "ARC-097 | Metadata-rich ship cards aid rapid comparison.",
  "ARC-098 | Challenge stars should communicate expected mastery.",
  "ARC-099 | FX profiles can serve as test fixtures.",
  "ARC-100 | Keep data comments sparse and actionable.",
  "ARC-101 | Library row spacing should prioritize readability over density.",
  "ARC-102 | Encounter layering should be additive, not chaotic by default.",
  "ARC-103 | Cross-tier ship viability increases long-term retention.",
  "ARC-104 | Peak builds still need mechanical execution checks.",
  "ARC-105 | Late-game economy should avoid runaway compounding.",
  "ARC-106 | Preserve user agency when introducing advanced systems.",
  "ARC-107 | Coherent data tables beat ad-hoc tuning constants.",
  "ARC-108 | FX preview should mirror in-game color grading closely.",
  "ARC-109 | Challenge browser should remain purely informational.",
  "ARC-110 | Codex serves as an embedded design notebook.",
  "ARC-111 | FX uniqueness constraints reduce concept ambiguity.",
  "ARC-112 | Distinct black-hole spirals prevent overlap with rift visuals.",
  "ARC-113 | Distinct void shears prevent overlap with nova visuals.",
  "ARC-114 | Distinct nova shells prevent overlap with pull anomalies.",
  "ARC-115 | Every ability class needs a primary motion metaphor.",
  "ARC-116 | Every high-impact cast needs a center anchor.",
  "ARC-117 | Every panel should be keyboard-and-pointer friendly.",
  "ARC-118 | Preserve launch flow when adding side systems.",
  "ARC-119 | Expanded data should remain forward-compatible.",
  "ARC-120 | Build complete."
];

for (const ship of ADVANCED_SHIP_LIBRARY) {
  if (!shipLoadouts[ship.id]) {
    shipLoadouts[ship.id] = ship;
  }
}

for (const ship of Object.values(shipLoadouts)) {
  if (!ship.abilities) continue;
  const maxCost = ship.abilities.reduce((m, a) => Math.max(m, a.cost || 0), 0);
  if ((ship.maxEnergy || 0) < maxCost) ship.maxEnergy = maxCost + 12;
}

const upgradePool = [
  {
    id: "thrusters",
    name: "Vector Thrusters",
    desc: "+35% movement speed",
    apply: (player) => {
      player.speed *= 1.35;
    },
  },
  {
    id: "pulse",
    name: "Pulse Coils",
    desc: "+30% weapon damage & projectile speed",
    apply: (player) => {
      player.damageMultiplier *= 1.3;
      player.shotSpeedMultiplier *= 1.3;
    },
  },
  {
    id: "capacitors",
    name: "Flux Capacitors",
    desc: "-20% weapon cooldown",
    apply: (player) => {
      player.baseCooldown = Math.max(player.baseCooldown * 0.8, 0.045);
    },
  },
  {
    id: "reactor",
    name: "Solar Reactors",
    desc: "+60% energy regeneration",
    apply: (player) => {
      player.energyRegenMultiplier *= 1.6;
    },
  },
  {
    id: "bulwark",
    name: "Bulwark Shielding",
    desc: "+45 shield cap & +60% shield regen",
    apply: (player) => {
      player.maxShield += 45;
      player.shield = Math.min(player.shield + 45, player.maxShield);
      player.shieldRegenMultiplier *= 1.6;
    },
  },
  {
    id: "nanites",
    name: "Nanite Plating",
    desc: "+55 hull integrity & heavy heal",
    apply: (player) => {
      player.maxHp += 55;
      player.hp = Math.min(player.hp + 85, player.maxHp);
    },
  },
  {
    id: "scatter",
    name: "Scatter Rails",
    desc: "+2 projectiles per volley",
    apply: (player) => {
      player.extraProjectiles = Math.min(player.extraProjectiles + 2, 6);
    },
  },
  {
    id: "hyperCore",
    name: "Hyper Capacitors",
    desc: "+45 max energy & +30% regen",
    apply: (player) => {
      player.maxEnergy += 45;
      player.energy = Math.min(player.energy + 45, player.maxEnergy);
      player.energyRegenMultiplier *= 1.3;
    },
  },
  {
    id: "nova",
    name: "Prismatic Condensers",
    desc: "+45% all special abilities damage",
    apply: (player) => {
      player.abilityDamageMultiplier *= 1.45;
    },
  },
  {
    id: "stabilisers",
    name: "Gyro Stabilizers",
    desc: "+28% move speed & +40% shield regen",
    apply: (player) => {
      player.speed *= 1.28;
      player.shieldRegenMultiplier *= 1.4;
    },
  },
  {
    id: "overcharge",
    name: "Overcharge Matrix",
    desc: "+25% damage & 12% cooldown reduction",
    apply: (player) => {
      player.damageMultiplier *= 1.25;
      player.baseCooldown = Math.max(player.baseCooldown * 0.88, 0.045);
    },
  },
];

const rng = (min, max) => Math.random() * (max - min) + min;
const clamp = (val, min, max) => Math.max(min, Math.min(max, val));
const dist = (ax, ay, bx, by) => Math.hypot(ax - bx, ay - by);
const pointToSegmentDistance = (px, py, x1, y1, x2, y2) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  if (dx === 0 && dy === 0) return Math.hypot(px - x1, py - y1);
  const t = clamp(((px - x1) * dx + (py - y1) * dy) / (dx * dx + dy * dy), 0, 1);
  const cx = x1 + t * dx;
  const cy = y1 + t * dy;
  return Math.hypot(px - cx, py - cy);
};
const getNearestEnemy = (x, y) => {
  let nearest = null;
  let best = Infinity;
  for (const enemy of state.enemies) {
    const d = dist(x, y, enemy.x, enemy.y);
    if (d < best) {
      best = d;
      nearest = enemy;
    }
  }
  return nearest;
};

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.vx = rng(-80, 80);
    this.vy = rng(-80, 80);
    this.life = rng(0.3, 0.8);
    this.color = color;
    this.size = 2;
    this.travelled = 0;
    this.maxTravel = null;
  }
  update(dt) {
    this.life -= dt;
    const dx = this.vx * dt;
    const dy = this.vy * dt;
    this.x += dx;
    this.y += dy;
    this.travelled += Math.hypot(dx, dy);
    if (this.maxTravel !== null && this.travelled >= this.maxTravel) {
      this.life = 0;
    }
    
    if (this.maxTravel === null) {
      this.vx *= 0.98; 
      this.vy *= 0.98;
    }
  }
  draw(ctx) {
    ctx.globalAlpha = Math.max(this.life, 0);
    ctx.fillStyle = this.color;
    const s = this.size || 2;
    ctx.fillRect(this.x - s/2, this.y - s/2, s, s);
    
    if (s > 2) {
      ctx.shadowBlur = s * 2;
      ctx.shadowColor = this.color;
      ctx.fillRect(this.x - s/2, this.y - s/2, s, s);
      ctx.shadowBlur = 0;
    }
    ctx.globalAlpha = 1;
  }
}

class Bullet {
  constructor(
    x,
    y,
    angle,
    speed,
    friendly = true,
    size = 4,
    color,
    damage,
    owner = friendly ? "player" : "enemy"
  ) {
    this.x = x;
    this.y = y;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.friendly = friendly;
    this.size = size;
    this.life = owner === "boss" ? 6 : 6
    this.damage = damage ?? (friendly ? 9 : 6 * (state.enemyDamageMultiplier || 1));
    this.color = color || (friendly ? "#74ffce" : "#ff7676");
    this.owner = owner;
    this.rebounds = 0; 
    this.maxRebounds = 0; 
    this.piercing = false; 
  }
  update(dt) {
    this.life -= dt;
    
    
    if (this.tracking) {
      if (!this.trackingTarget || this.trackingTarget.hp <= 0) {
        this.trackingTarget = getNearestEnemy(this.x, this.y);
      }
    }
    if (this.tracking && this.trackingTarget && this.trackingTarget.hp > 0) {
      const dx = this.trackingTarget.x - this.x;
      const dy = this.trackingTarget.y - this.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > 0) {
        const targetAngle = Math.atan2(dy, dx);
        const currentAngle = Math.atan2(this.vy, this.vx);
        const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        
        let newAngle = currentAngle;
        let angleDiff = targetAngle - currentAngle;
        
        while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
        while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
        
        const turnRate = (this.trackingTurnRate || 3.0) * dt;
        if (Math.abs(angleDiff) > turnRate) {
          newAngle = currentAngle + (angleDiff > 0 ? turnRate : -turnRate);
        } else {
          newAngle = targetAngle;
        }
        this.vx = Math.cos(newAngle) * speed;
        this.vy = Math.sin(newAngle) * speed;
      }
    }
    
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    
    
    if (this.maxRebounds > 0 && this.rebounds < this.maxRebounds) {
      if (this.x <= this.size || this.x >= config.width - this.size) {
        this.vx = -this.vx;
        this.rebounds++;
        this.x = Math.max(this.size, Math.min(config.width - this.size, this.x));
      }
      if (this.y <= this.size || this.y >= config.height - this.size) {
        this.vy = -this.vy;
        this.rebounds++;
        this.y = Math.max(this.size, Math.min(config.height - this.size, this.y));
      }
    }
  }
  draw(ctx) {
    ctx.save();
    
    
    let coreColor, glowColor, trailColor;
    
    if (this.friendly) {
      
      if (this.color === "#ffd166") {
        
        coreColor = "#ffd166";
        glowColor = "rgba(255, 209, 102, 0.8)";
        trailColor = "rgba(255, 209, 102, 0.4)";
      } else if (this.color === "#8af0ff" || this.color === "#6bc6ff") {
        
        coreColor = "#c8fbff";
        glowColor = "rgba(138, 240, 255, 0.88)";
        trailColor = "rgba(107, 198, 255, 0.45)";
      } else if (this.color === "#ff7b2f") {
        
        coreColor = "#ffd1b0";
        glowColor = "rgba(255, 123, 47, 0.9)";
        trailColor = "rgba(255, 123, 47, 0.5)";
      } else if (this.color === "#ff1f1f") {
        coreColor = "#ff9a9a";
        glowColor = "rgba(255, 31, 31, 0.95)";
        trailColor = "rgba(255, 31, 31, 0.55)";
      } else if (this.color === "#ff6a3a") {
        coreColor = "#ffd0be";
        glowColor = "rgba(255, 106, 58, 0.9)";
        trailColor = "rgba(255, 106, 58, 0.5)";
      } else if (this.color === "#ffb766") {
        coreColor = "#ffe9cc";
        glowColor = "rgba(255, 183, 102, 0.86)";
        trailColor = "rgba(255, 183, 102, 0.45)";
      } else if (this.color === "#8be7ff") {
        
        coreColor = "#d2f6ff";
        glowColor = "rgba(139, 231, 255, 0.85)";
        trailColor = "rgba(139, 231, 255, 0.45)";
      } else if (this.color === "#ff8f2a") {
        
        coreColor = "#ffd59d";
        glowColor = "rgba(255, 143, 42, 0.9)";
        trailColor = "rgba(255, 143, 42, 0.5)";
      } else if (this.color === "#d16bff") {
        
        coreColor = "#d16bff";
        glowColor = "rgba(209, 107, 255, 0.8)";
        trailColor = "rgba(209, 107, 255, 0.4)";
      } else {
        
        coreColor = "#74ffce";
        glowColor = "rgba(116, 255, 206, 0.8)";
        trailColor = "rgba(116, 255, 206, 0.4)";
      }
    } else {
      
      if (this.owner === "boss") {
        if (this.color === "#ff7dd1") {
          
          coreColor = "#ff7dd1";
          glowColor = "rgba(255, 125, 209, 0.9)";
          trailColor = "rgba(255, 125, 209, 0.5)";
        } else if (this.color === "#ffa8ff") {
          
          coreColor = "#ffa8ff";
          glowColor = "rgba(255, 168, 255, 0.9)";
          trailColor = "rgba(255, 168, 255, 0.5)";
        } else {
          
          coreColor = "#ff5f9e";
          glowColor = "rgba(255, 95, 158, 0.9)";
          trailColor = "rgba(255, 95, 158, 0.5)";
        }
      } else if (this.owner === "shooter") {
        
        coreColor = "#ffc857";
        glowColor = "rgba(255, 200, 87, 0.8)";
        trailColor = "rgba(255, 200, 87, 0.4)";
      } else {
        
        coreColor = "#ff7676";
        glowColor = "rgba(255, 118, 118, 0.8)";
        trailColor = "rgba(255, 118, 118, 0.4)";
      }
    }
    
    
    const trailLength = 8;
    const trailX = this.x - this.vx * 0.02;
    const trailY = this.y - this.vy * 0.02;
    const gradient = ctx.createLinearGradient(trailX, trailY, this.x, this.y);
    gradient.addColorStop(0, trailColor);
    gradient.addColorStop(1, "transparent");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.ellipse(trailX, trailY, this.size * 0.6, this.size * 1.2, Math.atan2(this.vy, this.vx), 0, Math.PI * 2);
    ctx.fill();
    
    
    const glowGradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2.5);
    glowGradient.addColorStop(0, glowColor);
    glowGradient.addColorStop(0.5, glowColor.replace("0.8", "0.3").replace("0.9", "0.3"));
    glowGradient.addColorStop(1, "transparent");
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 2.5, 0, Math.PI * 2);
    ctx.fill();
    
    
    const coreGradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
    coreGradient.addColorStop(0, "#ffffff");
    coreGradient.addColorStop(0.6, coreColor);
    coreGradient.addColorStop(1, coreColor + "80");
    ctx.fillStyle = coreGradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    
    
    ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
    ctx.beginPath();
    ctx.arc(this.x - this.size * 0.3, this.y - this.size * 0.3, this.size * 0.4, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }
}

class PowerUp {
  constructor(x, y, kind) {
    this.x = x;
    this.y = y;
    this.kind = kind;
    this.size = 12;
    this.life = 10;
    this.vy = 20 + Math.random() * 20;
    this.vx = Math.random() * 30 - 15;
    this.phase = Math.random() * Math.PI * 2;
  }
  update(dt) {
    this.life -= dt;
    this.y += this.vy * dt;
    this.x += Math.sin(performance.now() / 400 + this.phase) * 20 * dt;
    this.vy = Math.min(this.vy + 12 * dt, 60);
  }
  draw(ctx) {
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = {
      heal: "#5cff7d",
      shield: "#78c0ff",
      rapid: "#ffb347",
      burst: "#d16bff",
    }[this.kind];
    ctx.font = "12px Space Grotesk";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(this.kind[0].toUpperCase(), this.x, this.y);
  }
}

class Drone {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.angle = 0;
    this.orbitRadius = 60;
    this.orbitSpeed = 2;
    this.fireTimer = 0;
    this.life = 5; 
    this.maxLife = 5;
    this.size = 8;
    this.waveSpawned = state.wave; 
  }
  update(dt, player) {
    
    if (state.wave !== this.waveSpawned) {
      this.life = 0;
      return;
    }
    this.angle += this.orbitSpeed * dt;
    this.x = player.x + Math.cos(this.angle) * this.orbitRadius;
    this.y = player.y + Math.sin(this.angle) * this.orbitRadius;
    this.fireTimer -= dt;
    this.life -= dt;
    
    if (this.fireTimer <= 0 && state.enemies.length > 0) {
      let closest = null;
      let minDist = Infinity;
      for (const enemy of state.enemies) {
        const d = dist(this.x, this.y, enemy.x, enemy.y);
        if (d < minDist) {
          minDist = d;
          closest = enemy;
        }
      }
      if (closest && minDist < 400) {
        const angle = Math.atan2(closest.y - this.y, closest.x - this.x);
        state.bullets.push(new Bullet(this.x, this.y, angle, 400, true, 4, "#00ffff", 8));
        this.fireTimer = 0.4;
        for (let i = 0; i < 5; i++) {
          state.particles.push(new Particle(this.x, this.y, "#00ffff"));
        }
      }
    }
  }
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    
    const glowGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size * 2);
    glowGradient.addColorStop(0, "rgba(0, 255, 255, 0.8)");
    glowGradient.addColorStop(0.5, "rgba(0, 255, 255, 0.4)");
    glowGradient.addColorStop(1, "transparent");
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(0, 0, this.size * 2, 0, Math.PI * 2);
    ctx.fill();
    
    
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(0.5, "#00ffff");
    gradient.addColorStop(1, "#0088ff");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, this.size, 0, Math.PI * 2);
    ctx.fill();
    
    
    ctx.strokeStyle = "#00ffff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, this.size * 1.5, 0, Math.PI * 2);
    ctx.stroke();
    
    
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(0, 0, this.size * 0.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

class Barrier {
  constructor(x, y, angle) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.length = 120;
    this.width = 8;
    this.life = 8;
    this.maxLife = 8;
  }
  update(dt) {
    this.life -= dt;
    
    for (let i = state.enemyBullets.length - 1; i >= 0; i--) {
      const bullet = state.enemyBullets[i];
      const distToBarrier = this.distToLine(bullet.x, bullet.y);
      if (distToBarrier < this.width / 2 + bullet.size) {
        state.enemyBullets.splice(i, 1);
        for (let j = 0; j < 8; j++) {
          state.particles.push(new Particle(bullet.x, bullet.y, "#00ffff"));
        }
      }
    }
  }
  distToLine(px, py) {
    const x1 = this.x + Math.cos(this.angle) * this.length / 2;
    const y1 = this.y + Math.sin(this.angle) * this.length / 2;
    const x2 = this.x - Math.cos(this.angle) * this.length / 2;
    const y2 = this.y - Math.sin(this.angle) * this.length / 2;
    const A = px - x1;
    const B = py - y1;
    const C = x2 - x1;
    const D = y2 - y1;
    const dot = A * C + B * D;
    const lenSq = C * C + D * D;
    let param = -1;
    if (lenSq !== 0) param = dot / lenSq;
    let xx, yy;
    if (param < 0) {
      xx = x1;
      yy = y1;
    } else if (param > 1) {
      xx = x2;
      yy = y2;
    } else {
      xx = x1 + param * C;
      yy = y1 + param * D;
    }
    return dist(px, py, xx, yy);
  }
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    const alpha = this.life / this.maxLife;
    const gradient = ctx.createLinearGradient(-this.length / 2, 0, this.length / 2, 0);
    gradient.addColorStop(0, `rgba(0, 255, 255, ${alpha * 0.3})`);
    gradient.addColorStop(0.5, `rgba(0, 255, 255, ${alpha * 0.8})`);
    gradient.addColorStop(1, `rgba(0, 255, 255, ${alpha * 0.3})`);
    ctx.fillStyle = gradient;
    ctx.fillRect(-this.length / 2, -this.width / 2, this.length, this.width);
    ctx.strokeStyle = `rgba(0, 255, 255, ${alpha})`;
    ctx.lineWidth = 2;
    ctx.strokeRect(-this.length / 2, -this.width / 2, this.length, this.width);
    ctx.restore();
  }
}

class BlackHole {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 0;
    this.maxRadius = 150;
    this.life = 5;
    this.maxLife = 5;
    this.pullStrength = 800;
  }
  update(dt) {
    this.radius = Math.min(this.radius + dt * 50, this.maxRadius);
    this.life -= dt;
    
    
    for (let i = state.enemies.length - 1; i >= 0; i--) {
      const enemy = state.enemies[i];
      const d = dist(this.x, this.y, enemy.x, enemy.y);
      if (d < this.radius * 1.5) {
        const angle = Math.atan2(this.y - enemy.y, this.x - enemy.x);
        const pull = this.pullStrength * dt / (d + 1);
        enemy.x += Math.cos(angle) * pull;
        enemy.y += Math.sin(angle) * pull;
        enemy.hp -= dt * 30;
        if (d < this.radius * 0.3) {
          enemy.hp -= dt * 100;
        }
        if (enemy.hp <= 0) onEnemyDestroyed(enemy, i);
      }
    }
    
    for (let i = state.enemyBullets.length - 1; i >= 0; i--) {
      const bullet = state.enemyBullets[i];
      const d = dist(this.x, this.y, bullet.x, bullet.y);
      if (d < this.radius) {
        state.enemyBullets.splice(i, 1);
        for (let j = 0; j < 5; j++) {
          state.particles.push(new Particle(bullet.x, bullet.y, "#ff00ff"));
        }
      }
    }
  }
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    const alpha = this.life / this.maxLife;
    
    
    const outerGlowGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.radius * 2);
    outerGlowGradient.addColorStop(0, `rgba(255, 0, 255, ${alpha * 0.9})`);
    outerGlowGradient.addColorStop(0.3, `rgba(155, 127, 255, ${alpha * 0.7})`);
    outerGlowGradient.addColorStop(0.6, `rgba(155, 127, 255, ${alpha * 0.4})`);
    outerGlowGradient.addColorStop(1, "transparent");
    ctx.fillStyle = outerGlowGradient;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius * 2, 0, Math.PI * 2);
    ctx.fill();
    
    
    const midGlowGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.radius * 1.3);
    midGlowGradient.addColorStop(0, `rgba(255, 0, 255, ${alpha * 0.8})`);
    midGlowGradient.addColorStop(0.5, `rgba(155, 127, 255, ${alpha * 0.5})`);
    midGlowGradient.addColorStop(1, "transparent");
    ctx.fillStyle = midGlowGradient;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius * 1.3, 0, Math.PI * 2);
    ctx.fill();
    
    
    const holeGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.radius);
    holeGradient.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.9})`);
    holeGradient.addColorStop(0.2, `rgba(255, 0, 255, ${alpha * 0.8})`);
    holeGradient.addColorStop(0.5, `rgba(155, 127, 255, ${alpha * 0.6})`);
    holeGradient.addColorStop(0.8, `rgba(20, 0, 40, ${alpha * 0.4})`);
    holeGradient.addColorStop(1, `rgba(0, 0, 0, ${alpha * 0.2})`);
    ctx.fillStyle = holeGradient;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();
    
    
    ctx.strokeStyle = `rgba(255, 0, 255, ${alpha})`;
    ctx.lineWidth = 4;
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#ff00ff";
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;
    
    
    ctx.strokeStyle = `rgba(255, 255, 255, ${alpha * 0.8})`;
    ctx.lineWidth = 3;
    ctx.shadowBlur = 10;
    ctx.shadowColor = "#ffffff";
    for (let i = 0; i < 3; i++) {
      ctx.beginPath();
      for (let a = 0; a < Math.PI * 2; a += 0.1) {
        const r = (a / (Math.PI * 2)) * this.radius * 0.8;
        const x = Math.cos(a + performance.now() / 200 + i * Math.PI * 2 / 3) * r;
        const y = Math.sin(a + performance.now() / 200 + i * Math.PI * 2 / 3) * r;
        if (a === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.shadowBlur = 0;
    
    ctx.restore();
  }
}

class TimeDilationField {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 400; 
    this.life = 7;
    this.maxLife = 7;
    this.followPlayer = true;
  }
  update(dt) {
    this.life -= dt;
    
    
    if (this.followPlayer) {
      this.x = state.player.x;
      this.y = state.player.y;
    }
    
    
    if (this.life <= 0) {
      return;
    }
    
    
    for (let i = 0; i < state.enemyBullets.length; i++) {
      const bullet = state.enemyBullets[i];
      const d = dist(this.x, this.y, bullet.x, bullet.y);
      
      if (d < this.radius) {
        
        if (!bullet.originalSpeed) {
          bullet.originalSpeed = Math.hypot(bullet.vx, bullet.vy);
        }
        
        const targetSpeed = bullet.originalSpeed * 0.1;
        const currentSpeed = Math.hypot(bullet.vx, bullet.vy);
        if (currentSpeed > targetSpeed) {
          const speedRatio = targetSpeed / currentSpeed;
          bullet.vx *= speedRatio;
          bullet.vy *= speedRatio;
        }
        
        if (Math.random() < 0.1) {
          state.particles.push(new Particle(bullet.x, bullet.y, "#90ff90"));
        }
      } else {
        
        if (bullet.originalSpeed) {
          const currentSpeed = Math.hypot(bullet.vx, bullet.vy);
          if (currentSpeed > 0 && currentSpeed < bullet.originalSpeed) {
            const speedRatio = bullet.originalSpeed / currentSpeed;
            bullet.vx *= speedRatio;
            bullet.vy *= speedRatio;
          }
          bullet.originalSpeed = null;
        }
      }
    }
    
    
    for (let i = 0; i < state.enemies.length; i++) {
      const enemy = state.enemies[i];
      const d = dist(this.x, this.y, enemy.x, enemy.y);
      
      if (d < this.radius) {
        
        if (!enemy.originalSpeed) {
          enemy.originalSpeed = enemy.speed;
        }
        
        enemy.speed = enemy.originalSpeed * 0.3;
        
        if (Math.random() < 0.05) {
          state.particles.push(new Particle(enemy.x, enemy.y, "#90ff90"));
        }
      } else {
        
        if (enemy.originalSpeed) {
          enemy.speed = enemy.originalSpeed;
          enemy.originalSpeed = null;
        }
      }
    }
  }
  draw(ctx) {
    const alpha = Math.min(1, this.life / this.maxLife * 1.5);
    ctx.save();
    
    
    ctx.globalAlpha = alpha * 0.4;
    const outerGradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 1.2);
    outerGradient.addColorStop(0, "#90ff9060");
    outerGradient.addColorStop(0.3, "#90ff9040");
    outerGradient.addColorStop(0.6, "#90ff9020");
    outerGradient.addColorStop(1, "#90ff9000");
    ctx.fillStyle = outerGradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * 1.2, 0, Math.PI * 2);
    ctx.fill();
    
    
    ctx.globalAlpha = alpha * 0.5;
    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
    gradient.addColorStop(0, "#90ff9080");
    gradient.addColorStop(0.4, "#90ff9060");
    gradient.addColorStop(0.7, "#90ff9040");
    gradient.addColorStop(1, "#90ff9000");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    
    
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = "#90ff90";
    ctx.lineWidth = 4;
    ctx.shadowBlur = 25;
    ctx.shadowColor = "#90ff90";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.stroke();
    
    
    ctx.strokeStyle = "#b0ffb0";
    ctx.lineWidth = 2;
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#b0ffb0";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius * 0.8, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;
    
    ctx.restore();
  }
}

class Enemy {
  constructor(kind, x, y, wave, bossType = null) {
    this.kind = kind;
    this.bossType = bossType; 
    this.x = x;
    this.y = y;
    
    
    if (kind === "boss") {
      const baseHp = { titan: 1200, sniper: 800, swarmlord: 900, vortex: 850 }[bossType] || 800;
      this.hp = baseHp + wave * 100;
    } else {
      const hpMap = { swarm: 25, shooter: 15, charger: 18, defender: 250, dart: 15, orbiter: 30, splitter: 22 };
      
      this.hp = (hpMap[kind] || 20) + Math.floor(wave * 0.8) + Math.floor(wave * wave * 0.08);
    }
    this.maxHp = this.hp;
    
    
    const speedMap = {
      swarm: 80, shooter: 55, charger: 120, defender: 35, dart: 180, orbiter: 65, splitter: 70,
      boss: 55
    };
    this.speed = speedMap[kind] || 70;
    
    
    if (kind === "boss") {
      this.size = { titan: 60, sniper: 35, swarmlord: 45, vortex: 40 }[bossType] || 40;
    } else {
      const sizeMap = { swarm: 18, shooter: 20, charger: 16, defender: 24, dart: 14, orbiter: 19, splitter: 18 };
      this.size = sizeMap[kind] || 18;
    }
    
    this.fireTimer = kind === "boss" ? 0.6 : rng(1.1, 2.4);
    this.wave = wave;
    this.phase = Math.random() * Math.PI * 2;
    this.vx = 0; 
    this.vy = 0;
    this.smoothVx = 0; 
    this.smoothVy = 0;
    
    
    if (kind === "boss") {
      this.bossPattern = null;
      this.patternTimer = 0;
      this.spiralAngle = 0;
      this.radialCooldown = 0;
      this.minionSpawnTimer = bossType === "swarmlord" ? 1 : 0;
      this.orbitRadius = 0;
      this.orbitAngle = 0;
      
      this.chargeTimer = 0; 
      this.rapidFireCount = 0; 
      this.tripleShotCount = 0; 
      this.reboundBullets = []; 
    }
    
    
    if (kind === "orbiter") {
      this.orbitRadius = rng(80, 150);
      this.orbitAngle = Math.random() * Math.PI * 2;
      this.orbitSpeed = rng(1.5, 2.5);
    }
    if (this.kind === "splitter") {
      this.hasSplit = false;
    }
  }
  update(dt, player, bulletsOut) {
    
    if (this.deathMarked && this.deathMarkTimer) {
      this.deathMarkTimer -= dt;
      if (this.deathMarkTimer <= 0) {
        this.deathMarked = false;
        this.deathMarkTimer = 0;
      }
    }
    
    const angle = Math.atan2(player.y - this.y, player.x - this.x);
    if (this.kind === "swarm") {
      this.vx = Math.cos(angle) * this.speed;
      this.vy = Math.sin(angle) * this.speed;
      
      const smoothing = 0.15; 
      this.smoothVx += (this.vx - this.smoothVx) * smoothing;
      this.smoothVy += (this.vy - this.smoothVy) * smoothing;
      this.x += this.vx * dt;
      this.y += this.vy * dt;
    } else if (this.kind === "charger") {
      this.speed = 120 + Math.sin(performance.now() / 300) * 60;
      this.vx = Math.cos(angle) * this.speed;
      this.vy = Math.sin(angle) * this.speed;
      
      const smoothing = 0.15;
      this.smoothVx += (this.vx - this.smoothVx) * smoothing;
      this.smoothVy += (this.vy - this.smoothVy) * smoothing;
      this.x += this.vx * dt;
      this.y += this.vy * dt;
    } else if (this.kind === "shooter") {
      
      const minY = config.height - 200;
      if (this.y < minY) {
        this.vx = 0;
        this.vy = 80;
        this.smoothVx += (this.vx - this.smoothVx) * 0.15;
        this.smoothVy += (this.vy - this.smoothVy) * 0.15;
        this.y += this.vy * dt;
        this.y = Math.min(this.y, minY);
      } else {
        const targetY = minY + Math.sin(performance.now() / 700 + this.phase) * 50;
        this.vx = Math.cos(performance.now() / 600 + this.phase) * this.speed * 0.4;
        this.vy = (targetY - this.y) * 2.5;
        this.smoothVx += (this.vx - this.smoothVx) * 0.15;
        this.smoothVy += (this.vy - this.smoothVy) * 0.15;
        this.x += this.vx * dt;
        this.y += this.vy * dt;
      }
    } else if (this.kind === "defender") {
      
      this.vx = Math.cos(angle) * this.speed * 0.6;
      this.vy = Math.sin(angle) * this.speed * 0.6;
      
      const smoothing = 0.15;
      this.smoothVx += (this.vx - this.smoothVx) * smoothing;
      this.smoothVy += (this.vy - this.smoothVy) * smoothing;
      this.x += this.vx * dt;
      this.y += this.vy * dt;
    } else if (this.kind === "dart") {
      
      const burstSpeed = this.speed * (1.5 + Math.sin(performance.now() / 200) * 0.5);
      this.vx = Math.cos(angle) * burstSpeed;
      this.vy = Math.sin(angle) * burstSpeed;
      
      const smoothing = 0.2; 
      this.smoothVx += (this.vx - this.smoothVx) * smoothing;
      this.smoothVy += (this.vy - this.smoothVy) * smoothing;
      this.x += this.vx * dt;
      this.y += this.vy * dt;
    } else if (this.kind === "orbiter") {
      
      this.orbitAngle += this.orbitSpeed * dt;
      const targetX = player.x + Math.cos(this.orbitAngle) * this.orbitRadius;
      const targetY = player.y + Math.sin(this.orbitAngle) * this.orbitRadius;
      this.vx = (targetX - this.x) * 3;
      this.vy = (targetY - this.y) * 3;
      
      const smoothing = 0.2;
      this.smoothVx += (this.vx - this.smoothVx) * smoothing;
      this.smoothVy += (this.vy - this.smoothVy) * smoothing;
      this.x += this.vx * dt;
      this.y += this.vy * dt;
    } else if (this.kind === "splitter") {
      
      this.vx = Math.cos(angle) * this.speed;
      this.vy = Math.sin(angle) * this.speed;
      
      const smoothing = 0.15;
      this.smoothVx += (this.vx - this.smoothVx) * smoothing;
      this.smoothVy += (this.vy - this.smoothVy) * smoothing;
      this.x += this.vx * dt;
      this.y += this.vy * dt;
    } else if (this.kind === "boss") {
      
      if (this.bossType === "titan") {
        
        this.vx = Math.cos(performance.now() / 1200) * this.speed * 0.7;
        this.vy = Math.sin(performance.now() / 1000) * this.speed * 0.7;
        this.x += this.vx * dt;
        this.y += this.vy * dt;
      } else if (this.bossType === "sniper") {
        
        this.vx = Math.cos(performance.now() / 1500) * this.speed * 0.5;
        this.vy = Math.sin(performance.now() / 1100) * this.speed * 0.4;
        this.x += this.vx * dt;
      this.y = clamp(this.y + this.vy * dt, TOP_HUD_SAFE_Y, 180);
      } else if (this.bossType === "swarmlord") {
        
        this.vx = Math.cos(performance.now() / 800) * this.speed;
        this.vy = Math.sin(performance.now() / 600) * this.speed;
        this.x += this.vx * dt;
        this.y += this.vy * dt;
      } else if (this.bossType === "vortex") {
        
        this.orbitAngle += dt * 2;
        const centerX = config.width / 2;
        const centerY = 150;
        const newX = centerX + Math.cos(this.orbitAngle) * 100;
        const newY = centerY + Math.sin(this.orbitAngle) * 60;
        this.vx = (newX - this.x) / dt;
        this.vy = (newY - this.y) / dt;
        this.x = newX;
        this.y = newY;
      } else {
        
        this.vx = Math.cos(performance.now() / 900) * this.speed;
        this.vy = Math.sin(performance.now() / 700) * this.speed;
        this.x += this.vx * dt;
        this.y += this.vy * dt;
      }
      this.updateBossPattern(dt, player, bulletsOut);
      this.x = clamp(this.x, 80, config.width - 80);
      this.y = clamp(this.y, TOP_HUD_SAFE_Y, config.height - 200);
      return;
    } else {
      this.vx = Math.cos(performance.now() / 500 + this.x) * this.speed * 0.2;
      this.vy = 40 + this.wave * 3;
      
      const smoothing = 0.15;
      this.smoothVx += (this.vx - this.smoothVx) * smoothing;
      this.smoothVy += (this.vy - this.smoothVy) * smoothing;
      this.x += this.vx * dt;
      this.y += this.vy * dt;
    }

    this.x = clamp(this.x, 30, config.width - 30);
    const bottomClamp = this.kind === "shooter" ? config.height - 140 : config.height - 80;
    this.y = clamp(this.y, TOP_HUD_SAFE_Y, bottomClamp);

    this.fireTimer -= dt;
    if (this.fireTimer <= 0) {
      if (this.kind === "boss") {
        
        this.fireTimer = 1.0;
      } else if (this.kind === "shooter") {
        this.fireTimer = rng(0.8, 1.2);
        this.shootAngle = angle; 
        bulletsOut.push(
          new Bullet(this.x, this.y, angle, 180, false, 5, undefined, undefined, "shooter")
        );
      } else if (this.kind === "defender") {
        this.fireTimer = rng(1.5, 2.5);
        this.shootAngle = angle; 
        
        bulletsOut.push(
          new Bullet(this.x, this.y, angle, 90, false, 6, undefined, 12, "enemy")
        );
      } else if (this.kind === "dart") {
        this.fireTimer = rng(0.4, 0.8);
        this.shootAngle = angle; 
        
        bulletsOut.push(
          new Bullet(this.x, this.y, angle, 200, false, 3, undefined, 5, "enemy")
        );
      } else if (this.kind === "orbiter") {
        this.fireTimer = rng(1.2, 1.8);
        this.shootAngle = angle; 
        
        bulletsOut.push(
          new Bullet(this.x, this.y, angle, 140, false, 4, undefined, undefined, "enemy")
        );
      } else if (this.kind === "splitter") {
        this.fireTimer = rng(1.0, 1.5);
        this.shootAngle = angle; 
        
        for (let i = 0; i < 3; i++) {
          const offset = (i - 1) * 0.15;
          bulletsOut.push(
            new Bullet(this.x, this.y, angle + offset, 120, false, 4, undefined, undefined, "enemy")
          );
        }
      } else {
        
        this.fireTimer = rng(1.0, 1.6);
        this.shootAngle = angle; 
        bulletsOut.push(
          new Bullet(this.x, this.y, angle, 130, false, 4, undefined, undefined, "enemy")
        );
      }
    }
  }
  pickBossPattern() {
    if (this.bossType === "titan") {
      
      const patterns = ["largeBullets", "chargedShot", "explosiveShells"];
      this.bossPattern = patterns[Math.floor(Math.random() * patterns.length)];
      this.patternTimer = this.bossPattern === "chargedShot" ? 5 : this.bossPattern === "explosiveShells" ? 4 : 4;
    } else if (this.bossType === "sniper") {
      
      const patterns = ["precise", "tripleShot", "piercing"];
      this.bossPattern = patterns[Math.floor(Math.random() * patterns.length)];
      this.patternTimer = this.bossPattern === "tripleShot" ? 3.5 : this.bossPattern === "piercing" ? 4 : 3;
    } else if (this.bossType === "swarmlord") {
      
      const patterns = ["summon", "supportFire", "massSummon"];
      this.bossPattern = patterns[Math.floor(Math.random() * patterns.length)];
      this.patternTimer = this.bossPattern === "massSummon" ? 5 : this.bossPattern === "supportFire" ? 4 : 3;
    } else if (this.bossType === "vortex") {
      
      const patterns = ["rapidSpray", "rebounding", "concentratedStream"];
      this.bossPattern = patterns[Math.floor(Math.random() * patterns.length)];
      this.patternTimer = this.bossPattern === "rapidSpray" ? 3 : this.bossPattern === "rebounding" ? 4 : 3.5;
    } else {
      
      const patterns = ["spread", "spiral", "burst"];
      this.bossPattern = patterns[Math.floor(Math.random() * patterns.length)];
      this.patternTimer = this.bossPattern === "spread" ? 3.5 : this.bossPattern === "spiral" ? 3.5 : 3;
    }
    this.fireTimer = 0;
    this.radialCooldown = 0;
    this.chargeTimer = 0;
    this.rapidFireCount = 0;
    this.tripleShotCount = 0;
  }
  updateBossPattern(dt, player, bulletsOut) {
    if (!this.bossPattern || this.patternTimer <= 0) {
      this.pickBossPattern();
    }
    this.patternTimer -= dt;
    const bossActionRate = state.difficultyKey === "recruit"
      ? 0.45
      : state.difficultyKey === "veteran"
      ? 0.78
      : 1;
    
    if (this.bossType === "titan") {
      
      if (this.bossPattern === "largeBullets") {
        
        this.fireTimer -= dt * bossActionRate;
        if (this.fireTimer <= 0) {
          this.fireTimer = 1.2; 
          const aim = Math.atan2(player.y - this.y, player.x - this.x);
          this.shootAngle = aim; 
          
          bulletsOut.push(new Bullet(this.x, this.y, aim, 140, false, 14, "#ff4444", 25, "boss"));
          for (let i = 0; i < 2; i++) {
            const offset = (i - 0.5) * 0.15;
            const bullet = new Bullet(this.x, this.y, aim + offset, 140, false, 14, "#ff4444", 25, "boss");
            bulletsOut.push(bullet);
          }
        }
      } else if (this.bossPattern === "chargedShot") {
        
        this.chargeTimer += dt * bossActionRate;
        if (this.chargeTimer >= 2.5) {
          
          const aim = Math.atan2(player.y - this.y, player.x - this.x);
          this.shootAngle = aim; 
          const bullet = new Bullet(this.x, this.y, aim, 100, false, 20, "#ff0000", 35, "boss");
          bulletsOut.push(bullet);
          this.chargeTimer = 0;
          this.fireTimer = 0.5; 
        }
      } else if (this.bossPattern === "explosiveShells") {
        
        this.fireTimer -= dt * bossActionRate;
        if (this.fireTimer <= 0) {
          this.fireTimer = 1.5;
          const aim = Math.atan2(player.y - this.y, player.x - this.x);
          this.shootAngle = aim; 
          
          const directBullet = new Bullet(this.x, this.y, aim, 120, false, 12, "#ff8800", 20, "boss");
          directBullet.explosive = true;
          bulletsOut.push(directBullet);
          const offsetBullet = new Bullet(this.x, this.y, aim + 0.2, 120, false, 12, "#ff8800", 20, "boss");
          offsetBullet.explosive = true;
          bulletsOut.push(offsetBullet);
        }
      }
    } else if (this.bossType === "sniper") {
      
      if (this.bossPattern === "precise") {
        
        this.fireTimer -= dt * bossActionRate;
        if (this.fireTimer <= 0) {
          this.fireTimer = 0.08; 
          const aim = Math.atan2(player.y - this.y, player.x - this.x);
          this.shootAngle = aim; 
          
          bulletsOut.push(new Bullet(this.x, this.y, aim, 320, false, 6, "#00ffff", 5, "boss"));
          
          for (let i = 0; i < 7; i++) {
            const offset = (i < 3.5 ? (i - 3.5) * 0.25 : (i - 2.5) * 0.25);
            bulletsOut.push(
              new Bullet(this.x, this.y, aim + offset, 320, false, 6, "#00ffff", 5, "boss")
            );
          }
        }
      } else if (this.bossPattern === "tripleShot") {
        
        this.fireTimer -= dt * bossActionRate;
        if (this.fireTimer <= 0) {
          if (this.tripleShotCount < 5) {
            this.fireTimer = 0.05; 
            this.tripleShotCount++;
            const aim = Math.atan2(player.y - this.y, player.x - this.x);
            this.shootAngle = aim; 
            
            bulletsOut.push(new Bullet(this.x, this.y, aim, 320, false, 6, "#00ffff", 5, "boss"));
            
            for (let i = 0; i < 5; i++) {
              const offset = (i < 2.5 ? (i - 2.5) * 0.2 : (i - 1.5) * 0.2);
              bulletsOut.push(
                new Bullet(this.x, this.y, aim + offset, 320, false, 6, "#00ffff", 5, "boss")
              );
            }
          } else {
            this.fireTimer = 0.3; 
            this.tripleShotCount = 0;
          }
        }
      } else if (this.bossPattern === "piercing") {
        
        this.fireTimer -= dt * bossActionRate;
        if (this.fireTimer <= 0) {
          this.fireTimer = 0.15; 
          const aim = Math.atan2(player.y - this.y, player.x - this.x);
          this.shootAngle = aim; 
          
          const directPiercing = new Bullet(this.x, this.y, aim, 300, false, 7, "#00ffff", 5, "boss");
          directPiercing.piercing = true;
          directPiercing.life = 8;
          bulletsOut.push(directPiercing);
          
          for (let i = 0; i < 9; i++) {
            const offset = (i < 4.5 ? (i - 4.5) * 0.2 : (i - 3.5) * 0.2);
            const bullet = new Bullet(this.x, this.y, aim + offset, 300, false, 7, "#00ffff", 5, "boss");
            bullet.piercing = true;
            bullet.life = 8; 
            bulletsOut.push(bullet);
          }
        }
      }
    } else if (this.bossType === "swarmlord") {
      
      if (this.bossPattern === "summon") {
        
        this.minionSpawnTimer -= dt * bossActionRate;
        if (this.minionSpawnTimer <= 0) {
          this.minionSpawnTimer = 1.2; 
          
          const count = 8 + Math.floor(Math.random() * 4); 
          for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const spawnX = this.x + Math.cos(angle) * 80;
            const spawnY = this.y + Math.sin(angle) * 80;
            if (spawnX > 40 && spawnX < config.width - 40 && spawnY > 40 && spawnY < config.height - 100) {
              
              for (let j = 0; j < 15; j++) {
                const particleAngle = Math.random() * Math.PI * 2;
                const particleDist = Math.random() * 30;
                const p = new Particle(
                  spawnX + Math.cos(particleAngle) * particleDist,
                  spawnY + Math.sin(particleAngle) * particleDist,
                  "#ff7dd1"
                );
                p.vx = Math.cos(particleAngle) * rng(50, 150);
                p.vy = Math.sin(particleAngle) * rng(50, 150);
                p.life = rng(0.3, 0.6);
                state.particles.push(p);
              }
              
              const enemyType = Math.random() < 0.4 ? "charger" : "swarm";
              state.enemies.push(new Enemy(enemyType, spawnX, spawnY, this.wave));
            }
          }
        }
        
        this.fireTimer -= dt * bossActionRate;
        if (this.fireTimer <= 0) {
          this.fireTimer = 0.6;
          const aim = Math.atan2(player.y - this.y, player.x - this.x);
          this.shootAngle = aim; 
          bulletsOut.push(
            new Bullet(this.x, this.y, aim, 200, false, 4, "#ff7dd1", 3, "boss")
          );
        }
      } else if (this.bossPattern === "supportFire") {
        
        this.fireTimer -= dt * bossActionRate;
        if (this.fireTimer <= 0) {
          this.fireTimer = 0.4;
          const aim = Math.atan2(player.y - this.y, player.x - this.x);
          this.shootAngle = aim; 
          
          bulletsOut.push(new Bullet(this.x, this.y, aim, 180, false, 4, "#ff7dd1", 3, "boss"));
          bulletsOut.push(new Bullet(this.x, this.y, aim - 0.12, 180, false, 4, "#ff7dd1", 3, "boss"));
          bulletsOut.push(new Bullet(this.x, this.y, aim + 0.12, 180, false, 4, "#ff7dd1", 3, "boss"));
        }
        
        this.minionSpawnTimer -= dt * bossActionRate;
        if (this.minionSpawnTimer <= 0) {
          this.minionSpawnTimer = 1.5; 
          
          const spawnCount = 3 + Math.floor(Math.random() * 3); 
          for (let i = 0; i < spawnCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const spawnX = this.x + Math.cos(angle) * 70;
            const spawnY = this.y + Math.sin(angle) * 70;
            if (spawnX > 40 && spawnX < config.width - 40 && spawnY > 40 && spawnY < config.height - 100) {
              
              for (let j = 0; j < 12; j++) {
                const particleAngle = Math.random() * Math.PI * 2;
                const particleDist = Math.random() * 25;
                const p = new Particle(
                  spawnX + Math.cos(particleAngle) * particleDist,
                  spawnY + Math.sin(particleAngle) * particleDist,
                  "#ff7dd1"
                );
                p.vx = Math.cos(particleAngle) * rng(50, 150);
                p.vy = Math.sin(particleAngle) * rng(50, 150);
                p.life = rng(0.3, 0.6);
                state.particles.push(p);
              }
              
              const enemyType = Math.random() < 0.4 ? "charger" : "swarm";
              state.enemies.push(new Enemy(enemyType, spawnX, spawnY, this.wave));
            }
          }
        }
      } else if (this.bossPattern === "massSummon") {
        
        this.minionSpawnTimer -= dt * bossActionRate;
        if (this.minionSpawnTimer <= 0) {
          this.minionSpawnTimer = 3; 
          
          const count = 12 + Math.floor(Math.random() * 4); 
          for (let i = 0; i < count; i++) {
            const angle = (i / count) * Math.PI * 2;
            const spawnX = this.x + Math.cos(angle) * 90;
            const spawnY = this.y + Math.sin(angle) * 90;
            if (spawnX > 40 && spawnX < config.width - 40 && spawnY > 40 && spawnY < config.height - 100) {
              
              for (let j = 0; j < 20; j++) {
                const particleAngle = Math.random() * Math.PI * 2;
                const particleDist = Math.random() * 35;
                const p = new Particle(
                  spawnX + Math.cos(particleAngle) * particleDist,
                  spawnY + Math.sin(particleAngle) * particleDist,
                  "#ff7dd1"
                );
                p.vx = Math.cos(particleAngle) * rng(50, 200);
                p.vy = Math.sin(particleAngle) * rng(50, 200);
                p.life = rng(0.3, 0.7);
                state.particles.push(p);
              }
              
              const rand = Math.random();
              const enemyType = rand < 0.3 ? "charger" : rand < 0.6 ? "swarm" : "shooter";
              state.enemies.push(new Enemy(enemyType, spawnX, spawnY, this.wave));
            }
          }
        }
      }
    } else if (this.bossType === "vortex") {
      
      if (this.bossPattern === "rapidSpray") {
        
        this.fireTimer -= dt * bossActionRate;
        if (this.fireTimer <= 0) {
          this.fireTimer = 0.05; 
          this.rapidFireCount++;
          if (this.rapidFireCount < 30) {
            const aim = Math.atan2(player.y - this.y, player.x - this.x);
            this.shootAngle = aim; 
            
            if (this.rapidFireCount % 3 === 0) {
              bulletsOut.push(new Bullet(this.x, this.y, aim, 250, false, 3, "#9b7fff", 2, "boss"));
            } else {
              const spread = (Math.random() - 0.5) * 0.4; 
              bulletsOut.push(new Bullet(this.x, this.y, aim + spread, 250, false, 3, "#9b7fff", 2, "boss"));
            }
          } else {
            this.rapidFireCount = 0;
            this.fireTimer = 0.8; 
          }
        }
      } else if (this.bossPattern === "rebounding") {
        
        this.fireTimer -= dt * bossActionRate;
        if (this.fireTimer <= 0) {
          this.fireTimer = 0.4;
          const aim = Math.atan2(player.y - this.y, player.x - this.x);
          this.shootAngle = aim; 
          
          for (let i = 0; i < 4; i++) {
            const angle = (i / 4) * Math.PI * 2;
            const bullet = new Bullet(this.x, this.y, angle, 200, false, 4, "#9b7fff", 3, "boss");
            bullet.maxRebounds = 3; 
            bulletsOut.push(bullet);
          }
        }
      } else if (this.bossPattern === "concentratedStream") {
        
        this.fireTimer -= dt * bossActionRate;
        if (this.fireTimer <= 0) {
          this.fireTimer = 0.1;
          this.rapidFireCount++;
          if (this.rapidFireCount < 20) {
            const aim = Math.atan2(player.y - this.y, player.x - this.x);
            this.shootAngle = aim; 
            
            bulletsOut.push(new Bullet(this.x, this.y, aim, 280, false, 4, "#9b7fff", 3, "boss"));
            bulletsOut.push(new Bullet(this.x, this.y, aim - 0.08, 280, false, 4, "#9b7fff", 3, "boss"));
            bulletsOut.push(new Bullet(this.x, this.y, aim + 0.08, 280, false, 4, "#9b7fff", 3, "boss"));
          } else {
            this.rapidFireCount = 0;
            this.fireTimer = 0.6; 
          }
        }
      }
    } else {
      
      if (this.bossPattern === "spread") {
        this.fireTimer -= dt * bossActionRate;
        if (this.fireTimer <= 0) {
          this.fireTimer = 0.55;
          const aim = Math.atan2(player.y - this.y, player.x - this.x);
          this.shootAngle = aim; 
          const spread = 5;
          
          bulletsOut.push(new Bullet(this.x, this.y, aim, 210, false, 6, "#ff7dd1", 5, "boss"));
          
          for (let i = 0; i < spread - 1; i++) {
            const offset = (i < 2 ? (i - 2) * 0.15 : (i - 1) * 0.15);
            bulletsOut.push(
              new Bullet(this.x, this.y, aim + offset, 210, false, 6, "#ff7dd1", 5, "boss")
            );
          }
        }
      } else if (this.bossPattern === "spiral") {
        this.fireTimer -= dt;
        this.spiralAngle += dt * 2.5;
        if (this.fireTimer <= 0) {
          this.fireTimer = 0.09;
          const ang = this.spiralAngle;
          this.shootAngle = ang; 
          bulletsOut.push(
            new Bullet(this.x, this.y, ang, 170, false, 5, "#ffa8ff", 5, "boss")
          );
        }
      } else if (this.bossPattern === "burst") {
        this.radialCooldown -= dt;
        if (this.radialCooldown <= 0) {
          this.radialCooldown = 1.1;
          const aim = Math.atan2(player.y - this.y, player.x - this.x);
          this.shootAngle = aim; 
          const rays = 10;
          const base = performance.now() / 500;
          
          bulletsOut.push(new Bullet(this.x, this.y, aim, 200, false, 5, "#ff5f9e", 5, "boss"));
          
          for (let i = 0; i < rays - 1; i++) {
            const ang = base + (i / (rays - 1)) * Math.PI * 2;
            bulletsOut.push(
              new Bullet(this.x, this.y, ang, 200, false, 5, "#ff5f9e", 5, "boss")
            );
          }
        }
      }
    }
  }
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    
    
    let colors;
    if (this.kind === "boss") {
      
      if (this.bossType === "titan") {
        colors = { core: "#ff4444", glow: "rgba(255, 68, 68, 0.8)", inner: "#cc0000", accent: "#ff6666" };
      } else if (this.bossType === "sniper") {
        colors = { core: "#00ffff", glow: "rgba(0, 255, 255, 0.8)", inner: "#00cccc", accent: "#66ffff" };
      } else if (this.bossType === "swarmlord") {
        colors = { core: "#ff7dd1", glow: "rgba(255, 125, 209, 0.8)", inner: "#ff5f9e", accent: "#ffa8ff" };
      } else if (this.bossType === "vortex") {
        colors = { core: "#9b7fff", glow: "rgba(155, 127, 255, 0.8)", inner: "#7d5fff", accent: "#b89fff" };
      } else {
        colors = { core: "#ff00a8", glow: "rgba(255, 0, 168, 0.8)", inner: "#ff5f9e", accent: "#ff7dd1" };
      }
    } else {
      
      const colorMap = {
        swarm: { core: "#ff6b6b", glow: "rgba(255, 107, 107, 0.6)", inner: "#ff4444", accent: "#ff8888" },
        shooter: { core: "#ffc857", glow: "rgba(255, 200, 87, 0.6)", inner: "#ffb020", accent: "#ffd888" },
        charger: { core: "#79ffb7", glow: "rgba(121, 255, 183, 0.6)", inner: "#4dff99", accent: "#9bffc7" },
        defender: { core: "#ffaa44", glow: "rgba(255, 170, 68, 0.6)", inner: "#ff8800", accent: "#ffcc66" },
        dart: { core: "#44ff88", glow: "rgba(68, 255, 136, 0.6)", inner: "#00ff66", accent: "#66ffaa" },
        orbiter: { core: "#44aaff", glow: "rgba(68, 170, 255, 0.6)", inner: "#0088ff", accent: "#66bbff" },
        splitter: { core: "#ff88ff", glow: "rgba(255, 136, 255, 0.6)", inner: "#ff44ff", accent: "#ffaaff" }
      };
      colors = colorMap[this.kind] || colorMap.swarm;
    }
    
    const rotation = this.kind === "boss" ? performance.now() / 400 : performance.now() / 600;
    const pulse = Math.sin(performance.now() / 300) * 0.1 + 1;
    
    
    
    
    const speed = Math.hypot(this.smoothVx, this.smoothVy);
    let angle;
    if (speed > 0.1) {
      
      angle = Math.atan2(this.smoothVy, this.smoothVx);
    } else {
      
      const currentSpeed = Math.hypot(this.vx || 0, this.vy || 0);
      if (currentSpeed > 0.1) {
        angle = Math.atan2(this.vy || 0, this.vx || 0);
      } else {
        
        angle = 0;
      }
    }
    
    ctx.rotate(angle + Math.PI + Math.PI / 2);
    
    
    const glowGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size * 2.2 * pulse);
    glowGradient.addColorStop(0, colors.glow);
    glowGradient.addColorStop(0.4, colors.glow.replace("0.6", "0.2").replace("0.8", "0.3"));
    glowGradient.addColorStop(1, "transparent");
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(0, 0, this.size * 2.2 * pulse, 0, Math.PI * 2);
    ctx.fill();
    
    
    const engineGradient = ctx.createRadialGradient(0, this.size * 0.6, 0, 0, this.size * 0.6, this.size * 0.4);
    engineGradient.addColorStop(0, colors.glow);
    engineGradient.addColorStop(0.5, colors.glow.replace("0.6", "0.3").replace("0.8", "0.4"));
    engineGradient.addColorStop(1, "transparent");
    ctx.fillStyle = engineGradient;
    ctx.beginPath();
    ctx.arc(0, this.size * 0.6, this.size * 0.4, 0, Math.PI * 2);
    ctx.fill();
    
    
    ctx.fillStyle = colors.core;
    ctx.strokeStyle = colors.accent;
    ctx.lineWidth = 2.5;
    ctx.shadowBlur = 6;
    ctx.shadowColor = colors.core;
    
    if (this.kind === "boss") {
      
      if (this.bossType === "titan") {
        
        ctx.beginPath();
        ctx.moveTo(0, -this.size * 1.2);
        ctx.lineTo(this.size * 0.35, -this.size * 1.0); 
        ctx.lineTo(this.size * 0.4, -this.size * 0.5);
        ctx.lineTo(this.size * 0.42, -this.size * 0.2);
        ctx.lineTo(this.size * 0.42, this.size * 0.3);
        ctx.lineTo(-this.size * 0.42, this.size * 0.3);
        ctx.lineTo(-this.size * 0.42, -this.size * 0.2);
        ctx.lineTo(-this.size * 0.4, -this.size * 0.5);
        ctx.lineTo(-this.size * 0.35, -this.size * 1.0);
        ctx.closePath();
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(this.size * 0.2, -this.size * 0.2);
        ctx.lineTo(this.size * 1.2, -this.size * 0.4);
        ctx.lineTo(this.size * 1.0, 0);
        ctx.lineTo(this.size * 1.2, this.size * 0.4);
        ctx.lineTo(this.size * 0.2, this.size * 0.2);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(-this.size * 0.2, -this.size * 0.2);
        ctx.lineTo(-this.size * 1.2, -this.size * 0.4);
        ctx.lineTo(-this.size * 1.0, 0);
        ctx.lineTo(-this.size * 1.2, this.size * 0.4);
        ctx.lineTo(-this.size * 0.2, this.size * 0.2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else if (this.bossType === "sniper") {
        
        ctx.beginPath();
        ctx.moveTo(0, -this.size * 1.1);
        ctx.lineTo(this.size * 0.15, -this.size * 0.9);
        ctx.lineTo(this.size * 0.18, -this.size * 0.5);
        ctx.lineTo(this.size * 0.2, -this.size * 0.15);
        ctx.lineTo(this.size * 0.2, this.size * 0.25);
        ctx.lineTo(-this.size * 0.2, this.size * 0.25);
        ctx.lineTo(-this.size * 0.2, -this.size * 0.15);
        ctx.lineTo(-this.size * 0.18, -this.size * 0.5);
        ctx.lineTo(-this.size * 0.15, -this.size * 0.9);
        ctx.closePath();
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(this.size * 0.15, -this.size * 0.1);
        ctx.lineTo(this.size * 0.95, -this.size * 0.45);
        ctx.lineTo(this.size * 0.85, this.size * 0.05);
        ctx.lineTo(this.size * 0.7, this.size * 0.35);
        ctx.lineTo(this.size * 0.15, this.size * 0.2);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(-this.size * 0.15, -this.size * 0.1);
        ctx.lineTo(-this.size * 0.95, -this.size * 0.45);
        ctx.lineTo(-this.size * 0.85, this.size * 0.05);
        ctx.lineTo(-this.size * 0.7, this.size * 0.35);
        ctx.lineTo(-this.size * 0.15, this.size * 0.2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      } else if (this.bossType === "swarmlord") {
        
        ctx.beginPath();
        ctx.moveTo(0, -this.size * 1.2);
        ctx.lineTo(this.size * 0.2, -this.size * 1.0);
        ctx.lineTo(this.size * 0.25, -this.size * 0.5);
        ctx.lineTo(this.size * 0.28, -this.size * 0.2);
        ctx.lineTo(this.size * 0.32, this.size * 0.3);
        ctx.lineTo(-this.size * 0.32, this.size * 0.3);
        ctx.lineTo(-this.size * 0.28, -this.size * 0.2);
        ctx.lineTo(-this.size * 0.25, -this.size * 0.5);
        ctx.lineTo(-this.size * 0.2, -this.size * 1.0);
        ctx.closePath();
        ctx.fill();
        
        for (let i = 0; i < 3; i++) {
          const wingAngle = (i / 3) * Math.PI * 2 + rotation;
          const rootX = Math.cos(wingAngle) * this.size * 0.2;
          const rootY = Math.sin(wingAngle) * this.size * 0.3;
          ctx.beginPath();
          ctx.moveTo(rootX, rootY);
          ctx.lineTo(rootX + Math.cos(wingAngle - 0.3) * this.size * 0.9, rootY + Math.sin(wingAngle - 0.3) * this.size * 0.5);
          ctx.lineTo(rootX + Math.cos(wingAngle) * this.size * 0.8, rootY + Math.sin(wingAngle) * this.size * 0.3);
          ctx.lineTo(rootX + Math.cos(wingAngle + 0.3) * this.size * 0.9, rootY + Math.sin(wingAngle + 0.3) * this.size * 0.5);
          ctx.closePath();
          ctx.fill();
        }
        ctx.stroke();
      } else if (this.bossType === "vortex") {
        
        ctx.beginPath();
        ctx.moveTo(0, -this.size * 1.2);
        ctx.lineTo(this.size * 0.2, -this.size * 1.0);
        ctx.lineTo(this.size * 0.25, -this.size * 0.5);
        ctx.lineTo(this.size * 0.28, -this.size * 0.2);
        ctx.lineTo(this.size * 0.3, this.size * 0.3);
        ctx.lineTo(-this.size * 0.3, this.size * 0.3);
        ctx.lineTo(-this.size * 0.28, -this.size * 0.2);
        ctx.lineTo(-this.size * 0.25, -this.size * 0.5);
        ctx.lineTo(-this.size * 0.2, -this.size * 1.0);
        ctx.closePath();
        ctx.fill();
        
        for (let i = 0; i < 4; i++) {
          const wingAngle = (i / 4) * Math.PI * 2;
          const rootX = Math.cos(wingAngle) * this.size * 0.2;
          const rootY = Math.sin(wingAngle) * this.size * 0.3;
          ctx.beginPath();
          ctx.moveTo(rootX, rootY);
          ctx.lineTo(rootX + Math.cos(wingAngle - 0.25) * this.size * 0.85, rootY + Math.sin(wingAngle - 0.25) * this.size * 0.45);
          ctx.lineTo(rootX + Math.cos(wingAngle) * this.size * 0.75, rootY + Math.sin(wingAngle) * this.size * 0.25);
          ctx.lineTo(rootX + Math.cos(wingAngle + 0.25) * this.size * 0.85, rootY + Math.sin(wingAngle + 0.25) * this.size * 0.45);
          ctx.closePath();
          ctx.fill();
        }
        ctx.stroke();
      } else {
        
        ctx.beginPath();
        ctx.moveTo(0, -this.size * 1.2);
        ctx.lineTo(this.size * 0.2, -this.size * 1.0);
        ctx.lineTo(this.size * 0.25, -this.size * 0.5);
        ctx.lineTo(this.size * 0.28, -this.size * 0.2);
        ctx.lineTo(this.size * 0.28, this.size * 0.3);
        ctx.lineTo(-this.size * 0.28, this.size * 0.3);
        ctx.lineTo(-this.size * 0.28, -this.size * 0.2);
        ctx.lineTo(-this.size * 0.25, -this.size * 0.5);
        ctx.lineTo(-this.size * 0.2, -this.size * 1.0);
        ctx.closePath();
        ctx.fill();
        
        ctx.beginPath();
        ctx.moveTo(this.size * 0.2, -this.size * 0.1);
        ctx.lineTo(this.size * 1.05, -this.size * 0.5);
        ctx.lineTo(this.size * 0.95, this.size * 0.1);
        ctx.lineTo(this.size * 0.75, this.size * 0.4);
        ctx.lineTo(this.size * 0.2, this.size * 0.2);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(-this.size * 0.2, -this.size * 0.1);
        ctx.lineTo(-this.size * 1.05, -this.size * 0.5);
        ctx.lineTo(-this.size * 0.95, this.size * 0.1);
        ctx.lineTo(-this.size * 0.75, this.size * 0.4);
        ctx.lineTo(-this.size * 0.2, this.size * 0.2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    } else if (this.kind === "swarm") {
      
      ctx.beginPath();
      ctx.moveTo(0, -this.size * 1.0);
      ctx.lineTo(this.size * 0.15, -this.size * 0.8);
      ctx.lineTo(this.size * 0.18, -this.size * 0.4);
      ctx.lineTo(this.size * 0.2, -this.size * 0.15);
      ctx.lineTo(this.size * 0.2, this.size * 0.2);
      ctx.lineTo(-this.size * 0.2, this.size * 0.2);
      ctx.lineTo(-this.size * 0.2, -this.size * 0.15);
      ctx.lineTo(-this.size * 0.18, -this.size * 0.4);
      ctx.lineTo(-this.size * 0.15, -this.size * 0.8);
      ctx.closePath();
      ctx.fill();
      
      ctx.beginPath();
      ctx.moveTo(this.size * 0.15, -this.size * 0.08);
      ctx.lineTo(this.size * 0.75, -this.size * 0.4);
      ctx.lineTo(this.size * 0.65, this.size * 0.05);
      ctx.lineTo(this.size * 0.5, this.size * 0.9);
      ctx.lineTo(this.size * 0.15, this.size * 0.2);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-this.size * 0.15, -this.size * 0.08);
      ctx.lineTo(-this.size * 0.75, -this.size * 0.4);
      ctx.lineTo(-this.size * 0.65, this.size * 0.05);
      ctx.lineTo(-this.size * 0.5, this.size * 0.9);
      ctx.lineTo(-this.size * 0.15, this.size * 0.2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      
    } else if (this.kind === "shooter") {
      
      ctx.beginPath();
      ctx.moveTo(0, -this.size * 1.1);
      ctx.lineTo(this.size * 0.18, -this.size * 0.9);
      ctx.lineTo(this.size * 0.22, -this.size * 0.5);
      ctx.lineTo(this.size * 0.25, -this.size * 0.18);
      ctx.lineTo(this.size * 0.25, this.size * 0.25);
      ctx.lineTo(-this.size * 0.25, this.size * 0.25);
      ctx.lineTo(-this.size * 0.25, -this.size * 0.18);
      ctx.lineTo(-this.size * 0.22, -this.size * 0.5);
      ctx.lineTo(-this.size * 0.18, -this.size * 0.9);
      ctx.closePath();
      ctx.fill();
      
      ctx.beginPath();
      ctx.moveTo(this.size * 0.18, -this.size * 0.12);
      ctx.lineTo(this.size * 0.95, -this.size * 0.4);
      ctx.lineTo(this.size * 0.85, this.size * 0.08);
      ctx.lineTo(this.size * 0.7, this.size * 0.95);
      ctx.lineTo(this.size * 0.18, this.size * 0.25);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-this.size * 0.18, -this.size * 0.12);
      ctx.lineTo(-this.size * 0.95, -this.size * 0.4);
      ctx.lineTo(-this.size * 0.85, this.size * 0.08);
      ctx.lineTo(-this.size * 0.7, this.size * 0.95);
      ctx.lineTo(-this.size * 0.18, this.size * 0.25);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      
      ctx.fillStyle = colors.accent;
      ctx.beginPath();
      ctx.moveTo(this.size * 0.95, -this.size * 0.2);
      ctx.lineTo(this.size * 1.1, -this.size * 0.25);
      ctx.lineTo(this.size * 1.1, this.size * 0.25);
      ctx.lineTo(this.size * 0.95, this.size * 0.2);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-this.size * 0.95, -this.size * 0.2);
      ctx.lineTo(-this.size * 1.1, -this.size * 0.25);
      ctx.lineTo(-this.size * 1.1, this.size * 0.25);
      ctx.lineTo(-this.size * 0.95, this.size * 0.2);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = colors.core;
      
    } else if (this.kind === "charger") {
      
      ctx.beginPath();
      ctx.moveTo(0, -this.size * 1.0);
      ctx.lineTo(this.size * 0.12, -this.size * 0.8);
      ctx.lineTo(this.size * 0.15, -this.size * 0.4);
      ctx.lineTo(this.size * 0.18, -this.size * 0.15);
      ctx.lineTo(this.size * 0.18, this.size * 0.2);
      ctx.lineTo(-this.size * 0.18, this.size * 0.2);
      ctx.lineTo(-this.size * 0.18, -this.size * 0.15);
      ctx.lineTo(-this.size * 0.15, -this.size * 0.4);
      ctx.lineTo(-this.size * 0.12, -this.size * 0.8);
      ctx.closePath();
      ctx.fill();
      
      ctx.beginPath();
      ctx.moveTo(this.size * 0.12, -this.size * 0.08);
      ctx.lineTo(this.size * 0.85, -this.size * 0.5);
      ctx.lineTo(this.size * 0.75, this.size * 0.05);
      ctx.lineTo(this.size * 0.6, this.size * 0.9);
      ctx.lineTo(this.size * 0.12, this.size * 0.2);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-this.size * 0.12, -this.size * 0.08);
      ctx.lineTo(-this.size * 0.85, -this.size * 0.5);
      ctx.lineTo(-this.size * 0.75, this.size * 0.05);
      ctx.lineTo(-this.size * 0.6, this.size * 0.9);
      ctx.lineTo(-this.size * 0.12, this.size * 0.2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      
    } else if (this.kind === "defender") {
      
      ctx.beginPath();
      ctx.moveTo(0, -this.size * 1.2);
      ctx.lineTo(this.size * 0.2, -this.size * 1.0);
      ctx.lineTo(this.size * 0.25, -this.size * 0.5);
      ctx.lineTo(this.size * 0.28, -this.size * 0.22);
      ctx.lineTo(this.size * 0.32, this.size * 0.3);
      ctx.lineTo(-this.size * 0.32, this.size * 0.3);
      ctx.lineTo(-this.size * 0.28, -this.size * 0.22);
      ctx.lineTo(-this.size * 0.25, -this.size * 0.5);
      ctx.lineTo(-this.size * 0.2, -this.size * 1.0);
      ctx.closePath();
      ctx.fill();
      
      ctx.beginPath();
      ctx.moveTo(this.size * 0.25, -this.size * 0.9);
      ctx.lineTo(this.size * 1.05, -this.size * 0.4);
      ctx.lineTo(this.size * 0.95, this.size * 0.9);
      ctx.lineTo(this.size * 0.8, this.size * 0.3);
      ctx.lineTo(this.size * 0.25, this.size * 0.9);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-this.size * 0.25, -this.size * 0.9);
      ctx.lineTo(-this.size * 1.05, -this.size * 0.4);
      ctx.lineTo(-this.size * 0.95, this.size * 0.9);
      ctx.lineTo(-this.size * 0.8, this.size * 0.3);
      ctx.lineTo(-this.size * 0.25, -this.size * 0.9);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
        
      ctx.fillStyle = colors.accent;
      ctx.beginPath();
      ctx.moveTo(0, -this.size * 0.12);
      ctx.lineTo(this.size * 0.12, -this.size * 0.08);
      ctx.lineTo(this.size * 0.12, this.size * 0.12);
      ctx.lineTo(-this.size * 0.12, this.size * 0.12);
      ctx.lineTo(-this.size * 0.12, -this.size * 0.08);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = colors.core;
      
    } else if (this.kind === "dart") {
      
      ctx.beginPath();
      ctx.moveTo(0, -this.size * 1.0);
      ctx.lineTo(this.size * 0.12, -this.size * 0.8);
      ctx.lineTo(this.size * 0.15, -this.size * 0.4);
      ctx.lineTo(this.size * 0.18, -this.size * 0.15);
      ctx.lineTo(this.size * 0.18, this.size * 0.2);
      ctx.lineTo(-this.size * 0.18, this.size * 0.2);
      ctx.lineTo(-this.size * 0.18, -this.size * 0.15);
      ctx.lineTo(-this.size * 0.15, -this.size * 0.4);
      ctx.lineTo(-this.size * 0.12, -this.size * 0.8);
      ctx.closePath();
      ctx.fill();
      
      ctx.beginPath();
      ctx.moveTo(this.size * 0.1, -this.size * 0.1);
      ctx.lineTo(this.size * 0.75, -this.size * 0.5);
      ctx.lineTo(this.size * 0.65, this.size * 0.05);
      ctx.lineTo(this.size * 0.5, this.size * 0.9);
      ctx.lineTo(this.size * 0.1, this.size * 0.2);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-this.size * 0.1, -this.size * 0.1);
      ctx.lineTo(-this.size * 0.75, -this.size * 0.5);
      ctx.lineTo(-this.size * 0.65, this.size * 0.05);
      ctx.lineTo(-this.size * 0.5, this.size * 0.9);
      ctx.lineTo(-this.size * 0.1, this.size * 0.2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      
    } else if (this.kind === "orbiter") {
      
      ctx.beginPath();
      ctx.moveTo(0, -this.size * 1.1);
      ctx.lineTo(this.size * 0.2, -this.size * 0.9);
      ctx.lineTo(this.size * 0.25, -this.size * 0.5);
      ctx.lineTo(this.size * 0.28, -this.size * 0.2);
      ctx.lineTo(this.size * 0.28, this.size * 0.25);
      ctx.lineTo(-this.size * 0.28, this.size * 0.25);
      ctx.lineTo(-this.size * 0.28, -this.size * 0.2);
      ctx.lineTo(-this.size * 0.25, -this.size * 0.5);
      ctx.lineTo(-this.size * 0.2, -this.size * 0.9);
      ctx.closePath();
      ctx.fill();
      
      ctx.beginPath();
      ctx.moveTo(this.size * 0.2, -this.size * 0.12);
      ctx.lineTo(this.size * 0.88, -this.size * 0.4);
      ctx.lineTo(this.size * 0.8, this.size * 0.05);
      ctx.lineTo(this.size * 0.65, this.size * 0.95);
      ctx.lineTo(this.size * 0.2, this.size * 0.25);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-this.size * 0.2, -this.size * 0.12);
      ctx.lineTo(-this.size * 0.88, -this.size * 0.4);
      ctx.lineTo(-this.size * 0.8, this.size * 0.05);
      ctx.lineTo(-this.size * 0.65, this.size * 0.95);
      ctx.lineTo(-this.size * 0.2, this.size * 0.25);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      
      ctx.fillStyle = colors.accent;
      ctx.beginPath();
      ctx.moveTo(this.size * 0.88, -this.size * 0.15);
      ctx.lineTo(this.size * 0.98, -this.size * 0.2);
      ctx.lineTo(this.size * 0.98, this.size * 0.2);
      ctx.lineTo(this.size * 0.88, this.size * 0.15);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-this.size * 0.88, -this.size * 0.15);
      ctx.lineTo(-this.size * 0.98, -this.size * 0.2);
      ctx.lineTo(-this.size * 0.98, this.size * 0.2);
      ctx.lineTo(-this.size * 0.88, this.size * 0.15);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = colors.core;
      
    } else if (this.kind === "splitter") {
      
      ctx.beginPath();
      ctx.moveTo(0, -this.size * 1.0);
      ctx.lineTo(this.size * 0.15, -this.size * 0.8);
      ctx.lineTo(this.size * 0.18, -this.size * 0.4);
      ctx.lineTo(this.size * 0.2, -this.size * 0.15);
      ctx.lineTo(this.size * 0.2, this.size * 0.2);
      ctx.lineTo(-this.size * 0.2, this.size * 0.2);
      ctx.lineTo(-this.size * 0.2, -this.size * 0.15);
      ctx.lineTo(-this.size * 0.18, -this.size * 0.4);
      ctx.lineTo(-this.size * 0.15, -this.size * 0.8);
      ctx.closePath();
      ctx.fill();
      
      ctx.beginPath();
      ctx.moveTo(this.size * 0.15, -this.size * 0.08);
      ctx.lineTo(this.size * 0.85, -this.size * 0.4);
      ctx.lineTo(this.size * 0.75, this.size * 0.08);
      ctx.lineTo(this.size * 0.6, this.size * 0.9);
      ctx.lineTo(this.size * 0.15, this.size * 0.2);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-this.size * 0.15, -this.size * 0.08);
      ctx.lineTo(-this.size * 0.85, -this.size * 0.4);
      ctx.lineTo(-this.size * 0.75, this.size * 0.08);
      ctx.lineTo(-this.size * 0.6, this.size * 0.9);
      ctx.lineTo(-this.size * 0.15, this.size * 0.2);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
    
    ctx.shadowBlur = 0;
    ctx.globalAlpha = 1;
    
    
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.beginPath();
    ctx.arc(0, 0, this.size * 0.12, 0, Math.PI * 2);
    ctx.fill();
    
    
    if (this.hp < this.maxHp) {
      ctx.restore();
      ctx.save();
      ctx.translate(this.x, this.y - this.size - 8);
      const barWidth = this.size * 2;
      const barHeight = 3;
      const hpPercent = clamp(this.hp / this.maxHp, 0, 1);
      
      
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fillRect(-barWidth / 2, -barHeight / 2, barWidth, barHeight);
      
      
      const hpGradient = ctx.createLinearGradient(-barWidth / 2, 0, barWidth / 2, 0);
      hpGradient.addColorStop(0, colors.core);
      hpGradient.addColorStop(1, colors.inner);
      ctx.fillStyle = hpGradient;
      ctx.fillRect(-barWidth / 2, -barHeight / 2, barWidth * hpPercent, barHeight);
      
      ctx.restore();
      
      
      if (this.deathMarked && this.deathMarkTimer > 0) {
        ctx.save();
        ctx.translate(this.x, this.y);
        const pulse = Math.sin(performance.now() / 100) * 0.2 + 0.8;
        ctx.globalAlpha = pulse * 0.7;
        ctx.strokeStyle = "#8b0000";
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 1.5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 1.8, 0, Math.PI * 2);
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.restore();
      }
      
      return;
    }
    
    
    if (this.deathMarked && this.deathMarkTimer > 0) {
      ctx.save();
      ctx.translate(this.x, this.y);
      const pulse = Math.sin(performance.now() / 100) * 0.2 + 0.8;
      ctx.globalAlpha = pulse * 0.7;
      ctx.strokeStyle = "#8b0000";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(0, 0, this.size * 1.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(0, 0, this.size * 1.8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 1;
      ctx.restore();
    }
    
    ctx.restore();
  }
}

class Player {
  constructor(loadout = shipLoadouts.striker) {
    this.x = config.width / 2;
    this.y = config.height - 100;
    this.vx = 0;
    this.vy = 0;
    this.speed = loadout.speed;
    this.hp = loadout.maxHp;
    this.maxHp = loadout.maxHp;
    this.shield = loadout.maxShield * 0.9;
    this.maxShield = loadout.maxShield;
    this.energy = 0;
    this.maxEnergy = loadout.maxEnergy;
    this.cooldown = 0;
    this.baseCooldown = loadout.baseCooldown;
    this.rapidTimer = 0;
    this.burstTimer = 0;
    this.damageMultiplier = loadout.damageMultiplier;
    this.shotSpeedMultiplier = loadout.shotSpeedMultiplier;
    this.energyRegenMultiplier = loadout.energyRegenMultiplier;
    this.shieldRegenMultiplier = loadout.shieldRegenMultiplier;
    this.extraProjectiles = 0;
    this.novaDamageMultiplier = 1;
    this.abilityDamageMultiplier = 1;
    this.abilities = loadout.abilities || [];
    this.shipId = loadout.id;
    this.invincible = false;
    this.invincibleTimer = 0;
    this.shieldColorOverride = null;
    this.shieldColorTimer = 0;
    this.infiniteShield = false;
    this.infiniteShieldTimer = 0;
    this.rapidVolleyActive = false;
    this.rapidVolleyTimer = 0;
    this.fortifyActive = false;
    this.fortifyTimer = 0;
  }
  getShieldRadius() {
    const shieldPercent = this.shield / this.maxShield;
    const baseRadius = 20;
    const maxShieldBonus = (this.maxShield / 100) * 8;
    return baseRadius + (shieldPercent * (12 + maxShieldBonus));
  }
  update(dt) {
    let accel = 600;
    let friction = 8;
    let shipSpeedMultiplier = 1;
    if (this.shipId === "glacier") {
      accel = 500;
      friction = 5.8; 
    } else if (this.shipId === "phantom" || this.shipId === "specter" || this.shipId === "voidwalker") {
      accel = 700;
      friction = 9.5;
    } else if (this.shipId === "aphelion") {
      accel = 760;
      friction = 7;
      shipSpeedMultiplier = this.energy > this.maxEnergy * 0.7 ? 1.24 : 1.08;
      if (Math.random() < 0.6) {
        state.particles.push(new Particle(this.x - 10, this.y, "#ff8f2a"));
      }
    }
    const wasMoving = Math.abs(this.vx) > 1 || Math.abs(this.vy) > 1;
    
    const canMove = !state.tutorialMode || state.tutorialStep >= 1 || state.tutorialTestWave;
    if (canMove) {
      
      if (input.keys.has("w") || input.keys.has("arrowup")) this.vy -= accel * dt;
      if (input.keys.has("s") || input.keys.has("arrowdown")) this.vy += accel * dt;
      if (input.keys.has("a") || input.keys.has("arrowleft")) this.vx -= accel * dt;
      if (input.keys.has("d") || input.keys.has("arrowright")) this.vx += accel * dt;
    }
    
    
    if (state.tutorialMode && !state.tutorialProgress.moved && !state.tutorialTestWave) {
      const isMoving = Math.abs(this.vx) > 1 || Math.abs(this.vy) > 1;
      if (isMoving && !wasMoving) {
        state.tutorialProgress.moved = true;
        checkTutorialStepCompletion();
      }
    }

    this.vx -= this.vx * friction * dt;
    this.vy -= this.vy * friction * dt;

    const speedBoost =
      this.rapidTimer > 0 ? 1.15 : this.burstTimer > 0 ? 1.05 : 1;
    const maxSpeed = this.speed * speedBoost * shipSpeedMultiplier;
    this.vx = clamp(this.vx, -maxSpeed, maxSpeed);
    this.vy = clamp(this.vy, -maxSpeed, maxSpeed);

    this.x = clamp(this.x + this.vx * dt, 20, config.width - 20);
    this.y = clamp(this.y + this.vy * dt, 20, config.height - 20);

    this.cooldown = Math.max(this.cooldown - dt, 0);
    this.shield = clamp(
      this.shield + dt * 0.5 * this.shieldRegenMultiplier,
      0,
      this.maxShield
    );
    
    const energyRegenMultiplier = this.fortifyActive 
      ? this.energyRegenMultiplier * 3 
      : this.energyRegenMultiplier;
    this.energy = clamp(
      this.energy + dt * 20 * energyRegenMultiplier,
      0,
      this.maxEnergy
    );
    this.rapidTimer = Math.max(this.rapidTimer - dt, 0);
    this.burstTimer = Math.max(this.burstTimer - dt, 0);
    this.invincibleTimer = Math.max(this.invincibleTimer - dt, 0);
    if (this.invincibleTimer <= 0) this.invincible = false;
    this.shieldColorTimer = Math.max(this.shieldColorTimer - dt, 0);
    if (this.shieldColorTimer <= 0) this.shieldColorOverride = null;
    this.infiniteShieldTimer = Math.max(this.infiniteShieldTimer - dt, 0);
    if (this.infiniteShieldTimer <= 0) this.infiniteShield = false;
    this.rapidVolleyTimer = Math.max(this.rapidVolleyTimer - dt, 0);
    if (this.rapidVolleyTimer <= 0) this.rapidVolleyActive = false;
    this.fortifyTimer = Math.max(this.fortifyTimer - dt, 0);
    if (this.fortifyTimer <= 0) this.fortifyActive = false;
  }
  shoot(bullets) {
    if (this.cooldown > 0 && !this.rapidVolleyActive) return;
    
    
    
    const canShoot = !state.tutorialMode || state.tutorialStep >= 2 || state.tutorialTestWave;
    if (!canShoot) return;
    
    
    if (state.tutorialMode && !state.tutorialProgress.shot && !state.tutorialTestWave) {
      
      const mouseMoved = Math.abs(input.mouse.x - config.width / 2) > 50 || Math.abs(input.mouse.y - config.height / 2) > 50;
      if (mouseMoved) {
        state.tutorialProgress.shot = true;
        checkTutorialStepCompletion();
      }
    }
    const angle = Math.atan2(input.mouse.y - this.y, input.mouse.x - this.x);
    playSfx.shoot(this.shipId);
    const burstActive = this.burstTimer > 0;
    const rapidActive = this.rapidTimer > 0;
    const rapidVolleyActive = this.rapidVolleyActive;
    
    
    if (rapidVolleyActive) {
      const perpAngle = angle + Math.PI / 2; 
      const offset = 8; 
      const leftVolley = new Bullet(
          this.x + Math.cos(perpAngle) * offset,
          this.y + Math.sin(perpAngle) * offset,
          angle, 
          500 * this.shotSpeedMultiplier,
          true,
          5,
          "#ffd166",
          11 * this.damageMultiplier
        );
      const rightVolley = new Bullet(
          this.x - Math.cos(perpAngle) * offset,
          this.y - Math.sin(perpAngle) * offset,
          angle, 
          500 * this.shotSpeedMultiplier,
          true,
          5,
          "#ffd166",
          11 * this.damageMultiplier
        );
      if (this.shipId === "glacier") {
        leftVolley.color = "#8be7ff";
        rightVolley.color = "#8be7ff";
        leftVolley.freezeFactor = 0.55;
        rightVolley.freezeFactor = 0.55;
      } else if (this.shipId === "aphelion") {
        leftVolley.color = "#ff8f2a";
        rightVolley.color = "#ff8f2a";
        leftVolley.burnDamage = leftVolley.damage * 0.35;
        rightVolley.burnDamage = rightVolley.damage * 0.35;
        leftVolley.knockback = 52;
        rightVolley.knockback = 52;
      }
      bullets.push(leftVolley);
      bullets.push(rightVolley);
      this.cooldown = this.baseCooldown * (1 / 1.3); 
      return;
    }

    
    if (this.shipId === "titan") {
      
      const coneCount = 8 + Math.min(this.extraProjectiles, 4);
      const coneSpread = 0.42;
      const coneSpeed = 300 * this.shotSpeedMultiplier;
      const baseDamage = 4.9 * this.damageMultiplier;
      for (let i = 0; i < coneCount; i++) {
        const offset = ((i / (coneCount - 1 || 1)) - 0.5) * coneSpread;
        const flame = new Bullet(this.x + Math.cos(angle) * 14, this.y + Math.sin(angle) * 14, angle + offset + rng(-0.03, 0.03), coneSpeed + rng(-30, 35), true, 5, "#ff8f2a", baseDamage);
        flame.life = 0.38;
        flame.burnDamage = baseDamage * 0.5;
        flame.knockback = 18;
        bullets.push(flame);
        if (Math.random() < 0.7) state.particles.push(new Particle(this.x + rng(-6, 6), this.y + rng(-6, 6), "#ff8f2a"));
      }
      this.cooldown = this.baseCooldown * 0.34;
      return;
    }
    if (this.shipId === "inferno") {
      
      const flameRange = 270;
      const coneHalfAngle = 0.22;
      const dps = (26 / 3) * this.damageMultiplier; 
      const tickDamage = dps * 0.025; 
      for (let i = 0; i < 6; i++) {
        const flameAngle = angle + rng(-coneHalfAngle, coneHalfAngle);
        const px = this.x;
        const py = this.y;
        const shades = ["#ff4d2a", "#ff7b2f", "#ff9e45", "#ffcf6d"];
        const p = new Particle(px, py, shades[Math.floor(Math.random() * shades.length)]);
        const speed = rng(300, 460);
        p.vx = Math.cos(flameAngle) * speed + Math.cos(flameAngle + Math.PI / 2) * rng(-45, 45);
        p.vy = Math.sin(flameAngle) * speed + Math.sin(flameAngle + Math.PI / 2) * rng(-45, 45);
        
        p.life = 999;
        p.size = rng(4.5, 9.5); 
        
        p.maxTravel = rng(flameRange * 0.82, flameRange * 1.18);
        state.particles.push(p);
      }
      for (let i = state.enemies.length - 1; i >= 0; i--) {
        const enemy = state.enemies[i];
        const ex = enemy.x - this.x;
        const ey = enemy.y - this.y;
        const distance = Math.hypot(ex, ey);
        if (distance > flameRange) continue;
        const enemyAngle = Math.atan2(ey, ex);
        let diff = enemyAngle - angle;
        while (diff > Math.PI) diff -= Math.PI * 2;
        while (diff < -Math.PI) diff += Math.PI * 2;
        if (Math.abs(diff) <= coneHalfAngle) {
          enemy.hp -= tickDamage;
          enemy.fireTimer += 0.08;
          
          enemy.x += Math.cos(enemyAngle) * 4.5;
          enemy.y += Math.sin(enemyAngle) * 4.5;
          enemy.x = clamp(enemy.x, enemy.size, config.width - enemy.size);
          enemy.y = clamp(enemy.y, TOP_HUD_SAFE_Y + enemy.size, config.height - enemy.size);
          if (enemy.hp <= 0) {
            onEnemyDestroyed(enemy, i);
            continue;
          }
        }
      }
      
      this.cooldown = 0.025;
      return;
    }
    if (this.shipId === "aurora") {
      
      const beamLength = 560;
      const beamWidth = 14;
      const beamEndX = this.x + Math.cos(angle) * beamLength;
      const beamEndY = this.y + Math.sin(angle) * beamLength;
      state.visualBeams.push({
        x1: this.x,
        y1: this.y,
        x2: beamEndX,
        y2: beamEndY,
        color: "rgba(138, 240, 255, 0.9)",
        width: beamWidth,
        life: 0.1,
        maxLife: 0.1,
        phase: performance.now() * 0.01,
      });
      const pulse = 0.75 + 0.25 * Math.sin(performance.now() / 70);
      const beamDamage = (26 * this.damageMultiplier) * pulse;
      for (const enemy of state.enemies) {
        const d = pointToSegmentDistance(enemy.x, enemy.y, this.x, this.y, beamEndX, beamEndY);
        if (d <= beamWidth + enemy.size * 0.45) {
          enemy.hp -= beamDamage;
          enemy.fireTimer += 0.1;
        }
      }
      for (let i = 0; i < 26; i++) {
        const t = i / 25;
        const x = this.x + (beamEndX - this.x) * t + Math.cos(performance.now() / 80 + i) * 4;
        const y = this.y + (beamEndY - this.y) * t + Math.sin(performance.now() / 90 + i) * 4;
        const p = new Particle(x, y, i % 2 ? "#8af0ff" : "#6bc6ff");
        p.life = 0.09;
        p.size = 2.2;
        p.vx = rng(-20, 20);
        p.vy = rng(-20, 20);
        state.particles.push(p);
      }
      this.cooldown = this.baseCooldown * 0.85;
      return;
    }
    if (this.shipId === "specter") {
      
      const lance = new Bullet(this.x, this.y, angle, 980 * this.shotSpeedMultiplier, true, 8, "#c28cff", 24 * this.damageMultiplier);
      lance.piercing = true;
      lance.pierceCount = 8;
      lance.life = 2.2; 
      bullets.push(lance);
      this.cooldown = this.baseCooldown * 0.78;
      return;
    }
    if (this.shipId === "voidwalker") {
      
      const nearest = getNearestEnemy(this.x, this.y);
      for (const offset of [-0.1, 0.1]) {
        const lance = new Bullet(this.x, this.y, angle + offset, 560 * this.shotSpeedMultiplier, true, 6, "#b27bff", 13 * this.damageMultiplier);
        lance.piercing = true;
        lance.pierceCount = 4;
        lance.burnDamage = 1.8 * this.damageMultiplier;
        if (nearest) {
          lance.tracking = true;
          lance.trackingTarget = nearest;
          lance.trackingTurnRate = 42; 
        }
        lance.life = 2.4;
        bullets.push(lance);
      }
      this.cooldown = this.baseCooldown * 0.85;
      return;
    }
    if (this.shipId === "nova") {
      for (const offset of [-0.1, 0, 0.1]) {
        const star = new Bullet(this.x, this.y, angle + offset, 360 * this.shotSpeedMultiplier, true, 6.2, "#6ef8ff", 11 * this.damageMultiplier);
        star.explosive = true;
        star.burnDamage = star.damage * 0.18;
        star.novaAzureMini = true;
        bullets.push(star);
      }
      this.cooldown = this.baseCooldown * 0.95;
      return;
    }
    if (this.shipId === "aphelion") {
      
      const baseDamage = 8.5 * this.damageMultiplier;
      const frontArc = 0.39; 
      const frontCount = 28;
      const laneCount = 7;
      const forwardDist = [180, 260, 350];
      const perp = angle + Math.PI / 2;
      
      const lanes = [];
      for (let l = 0; l < laneCount; l++) {
        const laneOffset = (l - (laneCount - 1) / 2) * 24;
        const laneDepth = forwardDist[l % forwardDist.length];
        lanes.push({
          x: this.x + Math.cos(angle) * laneDepth + Math.cos(perp) * laneOffset,
          y: this.y + Math.sin(angle) * laneDepth + Math.sin(perp) * laneOffset,
        });
      }
      for (let i = 0; i < frontCount; i++) {
        const lane = lanes[i % lanes.length];
        const laneAngle = Math.atan2(lane.y - this.y, lane.x - this.x);
        const spread = ((i / (frontCount - 1)) - 0.5) * frontArc;
        const a = laneAngle + spread * 0.35 + rng(-0.03, 0.03);
        const centerBias = Math.abs(spread);
        let color = "#ff6a3a"; 
        let dmg = baseDamage;
        if (centerBias < 0.06) {
          color = "#ff1f1f"; 
          dmg = baseDamage * 1.45;
        } else if (centerBias > 0.13) {
          color = "#ffb766"; 
          dmg = baseDamage * 0.9;
        }
        const bolt = new Bullet(this.x, this.y, a, (430 + (i % 6) * 20) * this.shotSpeedMultiplier, true, 4.8, color, dmg);
        bolt.burnDamage = baseDamage * 0.34;
        bolt.knockback = 40;
        if (i % 6 === 0) {
          bolt.explosive = true;
          bolt.size += 0.8;
        }
        bullets.push(bolt);
      }
      
      const nearest = getNearestEnemy(this.x, this.y);
      for (const side of [-1, 1]) {
        for (let i = 0; i < 3; i++) {
          const sideAngle = angle + side * (0.28 + i * 0.08);
          const seeker = new Bullet(this.x, this.y, sideAngle, (360 + i * 24) * this.shotSpeedMultiplier, true, 4.2, "#ffb14a", baseDamage * 0.95);
          seeker.burnDamage = baseDamage * 0.3;
          if (nearest) {
            seeker.tracking = true;
            seeker.trackingTarget = nearest;
            seeker.trackingTurnRate = 14;
          }
          bullets.push(seeker);
        }
      }
      this.cooldown = this.baseCooldown * 0.7;
      return;
    }
    
    const baseShots = 1 + this.extraProjectiles;
    const shots = burstActive ? baseShots + 1 : baseShots;
    const spread =
      shots > 1 ? 0.08 * (shots - 1) : burstActive ? 0.16 : 0;
    const bulletColor = rapidActive
      ? "#ffd166"
      : burstActive
      ? "#d16bff"
      : undefined;
    const bulletSize = rapidActive || burstActive ? 5 : 4;
    const baseSpeed = rapidActive ? 520 : burstActive ? 480 : 460;
    const bulletSpeed = baseSpeed * this.shotSpeedMultiplier;
    const bulletDamage = 9 * this.damageMultiplier;
    for (let i = 0; i < shots; i++) {
      const offset = spread ? (i - (shots - 1) / 2) * spread : 0;
      const projectile = new Bullet(
          this.x,
          this.y,
          angle + offset,
          bulletSpeed,
          true,
          bulletSize,
          bulletColor,
          bulletDamage
        );
      if (this.shipId === "glacier") {
        projectile.color = "#8be7ff";
        projectile.freezeFactor = 0.6;
        projectile.vx *= 0.9;
        projectile.vy *= 0.9;
      } else if (this.shipId === "tempest") {
        projectile.color = "#ffe866";
        projectile.chainArc = true;
      } else if (this.shipId === "titan") {
        projectile.color = "#ff8866";
        projectile.knockback = 46;
      } else if (this.shipId === "specter" || this.shipId === "voidwalker") {
        projectile.color = "#c28cff";
        projectile.piercing = true;
        projectile.pierceCount = 2;
      } else if (this.shipId === "aphelion") {
        projectile.color = "#ff8f2a";
        projectile.size += 1;
        projectile.damage *= 1.18;
        projectile.burnDamage = projectile.damage * 0.45;
        projectile.knockback = 62;
        if (Math.random() < 0.28) projectile.explosive = true;
      }
      bullets.push(projectile);
    }
    this.cooldown = this.baseCooldown * (this.rapidTimer > 0 ? 0.45 : 1);
  }
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    const angle = Math.atan2(input.mouse.y - this.y, input.mouse.x - this.x);
    ctx.rotate(angle);
    
    
    let coreColor, glowColor, accentColor;
    const powerUpActive = this.rapidTimer > 0 || this.burstTimer > 0;
    
    if (this.rapidTimer > 0) {
      coreColor = "#ffd166";
      glowColor = "rgba(255, 209, 102, 0.7)";
      accentColor = "#ffb020";
    } else if (this.burstTimer > 0) {
      coreColor = "#d16bff";
      glowColor = "rgba(209, 107, 255, 0.7)";
      accentColor = "#b84dff";
    } else {
      
      if (this.shipId === "aegis") {
        coreColor = "#78c0ff";
        glowColor = "rgba(120, 192, 255, 0.7)";
        accentColor = "#4da8ff";
      } else if (this.shipId === "phantom") {
        coreColor = "#9b7fff";
        glowColor = "rgba(155, 127, 255, 0.7)";
        accentColor = "#7d5fff";
      } else if (this.shipId === "tempest") {
        coreColor = "#ffff00";
        glowColor = "rgba(255, 255, 0, 0.7)";
        accentColor = "#ffcc00";
      } else if (this.shipId === "titan") {
        coreColor = "#ff4444";
        glowColor = "rgba(255, 68, 68, 0.7)";
        accentColor = "#cc0000";
      } else if (this.shipId === "specter") {
        coreColor = "#9b7fff";
        glowColor = "rgba(155, 127, 255, 0.7)";
        accentColor = "#6b4fff";
      } else if (this.shipId === "glacier") {
        coreColor = "#9cefff";
        glowColor = "rgba(156, 239, 255, 0.75)";
        accentColor = "#5dc9ff";
      } else if (this.shipId === "aphelion") {
        coreColor = "#ffb14a";
        glowColor = "rgba(255, 177, 74, 0.8)";
        accentColor = "#ff662b";
      } else if (this.shipId === "inferno") {
        coreColor = "#ff8844";
        glowColor = "rgba(255, 136, 68, 0.76)";
        accentColor = "#ff4d2a";
      } else if (this.shipId === "aurora") {
        coreColor = "#97f8ff";
        glowColor = "rgba(151, 248, 255, 0.76)";
        accentColor = "#6ac8ff";
      } else {
        
        coreColor = "#74ffce";
        glowColor = "rgba(116, 255, 206, 0.7)";
        accentColor = "#4dffb3";
      }
    }
    
    
    const engineGradient = ctx.createRadialGradient(-15, 0, 0, -15, 0, 12);
    engineGradient.addColorStop(0, glowColor);
    engineGradient.addColorStop(0.5, glowColor.replace("0.7", "0.3"));
    engineGradient.addColorStop(1, "transparent");
    ctx.fillStyle = engineGradient;
    ctx.beginPath();
    ctx.arc(-15, 0, 12, 0, Math.PI * 2);
    ctx.fill();
    
    
    
    const shieldPercent = this.shield / this.maxShield;
    const baseRadius = 30; 
    const maxShieldBonus = (this.maxShield / 100) * 12; 
    const shieldRadius = baseRadius + (shieldPercent * (18 + maxShieldBonus)); 
    
    
    const shieldColor = this.shieldColorOverride || glowColor;
    const shieldGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, shieldRadius);
    shieldGradient.addColorStop(0, "transparent");
    shieldGradient.addColorStop(0.7, "transparent");
    
    const colorForGradient = this.shieldColorOverride 
      ? this.shieldColorOverride.replace(/[\d\.]+\)$/, "0.4)")
      : shieldColor.replace("0.7", "0.4");
    const colorForEdge = this.shieldColorOverride
      ? this.shieldColorOverride.replace(/[\d\.]+\)$/, "0.1)")
      : shieldColor.replace("0.7", "0.1");
    shieldGradient.addColorStop(0.9, colorForGradient);
    shieldGradient.addColorStop(1, colorForEdge);
    ctx.strokeStyle = shieldGradient;
    ctx.lineWidth = 2 + shieldPercent * 1.5; 
    ctx.beginPath();
    ctx.arc(0, 0, shieldRadius, 0, Math.PI * 2);
    ctx.stroke();
    
    
    if (this.infiniteShield) {
      ctx.strokeStyle = shieldColor;
      ctx.lineWidth = 4;
      ctx.shadowBlur = 20;
      ctx.shadowColor = shieldColor;
      ctx.beginPath();
      ctx.arc(0, 0, shieldRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
    
    
    if (this.fortifyActive) {
      ctx.strokeStyle = "#ffe29b";
      ctx.lineWidth = 3;
      ctx.shadowBlur = 25;
      ctx.shadowColor = "#ffe29b";
      ctx.beginPath();
      ctx.arc(0, 0, shieldRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
    }
    
    
    const bodyGradient = ctx.createLinearGradient(20, 0, -15, 0);
    bodyGradient.addColorStop(0, "#ffffff");
    bodyGradient.addColorStop(0.2, coreColor);
    bodyGradient.addColorStop(0.5, accentColor);
    bodyGradient.addColorStop(0.8, accentColor + "cc");
    bodyGradient.addColorStop(1, accentColor + "80");
    ctx.fillStyle = bodyGradient;
    ctx.strokeStyle = coreColor;
    ctx.lineWidth = 2.5;
    ctx.shadowBlur = 12;
    ctx.shadowColor = coreColor;
    
    if (this.shipId === "striker") {
      
      
      ctx.beginPath();
      ctx.moveTo(22, 0); 
      ctx.lineTo(18, -3); 
      ctx.lineTo(12, -4); 
      ctx.lineTo(4, -5); 
      ctx.lineTo(-6, -4); 
      ctx.lineTo(-12, -2); 
      ctx.lineTo(-14, 0); 
      ctx.lineTo(-12, 2); 
      ctx.lineTo(-6, 4); 
      ctx.lineTo(4, 5); 
      ctx.lineTo(12, 4); 
      ctx.lineTo(18, 3); 
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      
      
      ctx.fillStyle = accentColor;
      ctx.beginPath();
      ctx.moveTo(4, -5); 
      ctx.lineTo(2, -6);
      ctx.lineTo(-8, -18); 
      ctx.lineTo(-10, -14); 
      ctx.lineTo(-2, -8); 
      ctx.lineTo(4, -4); 
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(4, 5); 
      ctx.lineTo(2, 6);
      ctx.lineTo(-8, 18); 
      ctx.lineTo(-10, 14); 
      ctx.lineTo(-2, 8); 
      ctx.lineTo(4, 4); 
      ctx.closePath();
      ctx.fill();
      
      
      ctx.fillStyle = "rgba(200, 240, 255, 0.7)";
      ctx.beginPath();
      ctx.ellipse(6, 0, 4, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      
      
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(20, 0, 2, 0, Math.PI * 2);
      ctx.fill();
      
    } else if (this.shipId === "aegis") {
      
      
      ctx.beginPath();
      ctx.moveTo(20, 0); 
      ctx.lineTo(16, -4); 
      ctx.lineTo(10, -6); 
      ctx.lineTo(2, -7); 
      ctx.lineTo(-6, -6); 
      ctx.lineTo(-12, -4); 
      ctx.lineTo(-14, 0); 
      ctx.lineTo(-12, 4); 
      ctx.lineTo(-6, 6); 
      ctx.lineTo(2, 7); 
      ctx.lineTo(10, 6); 
      ctx.lineTo(16, 4); 
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      
      
      ctx.fillStyle = accentColor;
      ctx.beginPath();
      ctx.moveTo(2, -7); 
      ctx.lineTo(0, -8);
      ctx.lineTo(-10, -20); 
      ctx.lineTo(-12, -16); 
      ctx.lineTo(-4, -10); 
      ctx.lineTo(2, -6); 
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(2, 7); 
      ctx.lineTo(0, 8);
      ctx.lineTo(-10, 20); 
      ctx.lineTo(-12, 16); 
      ctx.lineTo(-4, 10); 
      ctx.lineTo(2, 6); 
      ctx.closePath();
      ctx.fill();
      
      
      ctx.fillStyle = "rgba(200, 240, 255, 0.7)";
      ctx.beginPath();
      ctx.ellipse(8, 0, 5, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      
      
      ctx.fillStyle = coreColor;
      ctx.beginPath();
      ctx.ellipse(-4, -5, 3, 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(-4, 5, 3, 2, 0, 0, Math.PI * 2);
      ctx.fill();
      
    } else if (this.shipId === "phantom") {
      
      
      ctx.beginPath();
      ctx.moveTo(24, 0); 
      ctx.lineTo(20, -2); 
      ctx.lineTo(14, -3); 
      ctx.lineTo(6, -4); 
      ctx.lineTo(-4, -3); 
      ctx.lineTo(-10, -1); 
      ctx.lineTo(-12, 0); 
      ctx.lineTo(-10, 1); 
      ctx.lineTo(-4, 3); 
      ctx.lineTo(6, 4); 
      ctx.lineTo(14, 3); 
      ctx.lineTo(20, 2); 
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      
      
      ctx.fillStyle = accentColor;
      ctx.beginPath();
      ctx.moveTo(6, -4); 
      ctx.lineTo(4, -5);
      ctx.lineTo(24, -10); 
      ctx.lineTo(22, -6); 
      ctx.lineTo(10, -2); 
      ctx.lineTo(6, -3); 
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(6, 4); 
      ctx.lineTo(4, 5);
      ctx.lineTo(24, 10); 
      ctx.lineTo(22, 6); 
      ctx.lineTo(10, 2); 
      ctx.lineTo(6, 3); 
      ctx.closePath();
      ctx.fill();
      
      
      ctx.fillStyle = "rgba(200, 200, 255, 0.6)";
      ctx.beginPath();
      ctx.ellipse(8, 0, 3, 2.5, 0, 0, Math.PI * 2);
      ctx.fill();
      
      
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 1;
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.moveTo(4, -3);
      ctx.lineTo(0, -4);
      ctx.lineTo(2, -2);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(4, 3);
      ctx.lineTo(0, 4);
      ctx.lineTo(2, 2);
      ctx.closePath();
      ctx.stroke();
      ctx.globalAlpha = 1;
      
    } else if (this.shipId === "tempest") {
      
      
      ctx.beginPath();
      ctx.moveTo(22, 0); 
      ctx.lineTo(18, -3); 
      ctx.lineTo(12, -4); 
      ctx.lineTo(4, -5); 
      ctx.lineTo(-6, -4); 
      ctx.lineTo(-12, -2); 
      ctx.lineTo(-14, 0); 
      ctx.lineTo(-12, 2); 
      ctx.lineTo(-6, 4); 
      ctx.lineTo(4, 5); 
      ctx.lineTo(12, 4); 
      ctx.lineTo(18, 3); 
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      
      
      ctx.fillStyle = accentColor;
      ctx.beginPath();
      ctx.moveTo(4, -5); 
      ctx.lineTo(2, -6);
      ctx.lineTo(-8, -18); 
      ctx.lineTo(-10, -14); 
      ctx.lineTo(-2, -8); 
      ctx.lineTo(4, -4); 
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(4, 5); 
      ctx.lineTo(2, 6);
      ctx.lineTo(-8, 18); 
      ctx.lineTo(-10, 14); 
      ctx.lineTo(-2, 8); 
      ctx.lineTo(4, 4); 
      ctx.closePath();
      ctx.fill();
      
      
      ctx.fillStyle = "#ffff00";
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#ffff00";
      ctx.beginPath();
      ctx.arc(-8, -16, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(-8, 16, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(-8, -16, 1, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(-8, 16, 1, 0, Math.PI * 2);
      ctx.fill();
      
      
      ctx.fillStyle = "rgba(255, 255, 200, 0.7)";
      ctx.beginPath();
      ctx.ellipse(6, 0, 4, 3, 0, 0, Math.PI * 2);
      ctx.fill();
      
      
      ctx.strokeStyle = "#ffff00";
      ctx.lineWidth = 2;
      ctx.globalAlpha = 0.6;
      ctx.beginPath();
      ctx.moveTo(4, -5);
      ctx.lineTo(2, -6);
      ctx.lineTo(-8, -16);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(4, 5);
      ctx.lineTo(2, 6);
      ctx.lineTo(-8, 16);
      ctx.stroke();
      ctx.globalAlpha = 1;
      
    } else if (this.shipId === "titan") {
      
      
      ctx.beginPath();
      ctx.moveTo(18, 0); 
      ctx.lineTo(14, -5); 
      ctx.lineTo(8, -7); 
      ctx.lineTo(0, -8); 
      ctx.lineTo(-8, -7); 
      ctx.lineTo(-14, -5); 
      ctx.lineTo(-16, 0); 
      ctx.lineTo(-14, 5); 
      ctx.lineTo(-8, 7); 
      ctx.lineTo(0, 8); 
      ctx.lineTo(8, 7); 
      ctx.lineTo(14, 5); 
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      
      
      ctx.fillStyle = accentColor;
      ctx.beginPath();
      ctx.moveTo(0, -8); 
      ctx.lineTo(-2, -9);
      ctx.lineTo(-12, -22); 
      ctx.lineTo(-14, -18); 
      ctx.lineTo(-6, -12); 
      ctx.lineTo(0, -7); 
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(0, 8); 
      ctx.lineTo(-2, 9);
      ctx.lineTo(-12, 22); 
      ctx.lineTo(-14, 18); 
      ctx.lineTo(-6, 12); 
      ctx.lineTo(0, 7); 
      ctx.closePath();
      ctx.fill();
      
      
      ctx.fillStyle = coreColor;
      ctx.beginPath();
      ctx.moveTo(-6, -12);
      ctx.lineTo(-10, -14);
      ctx.lineTo(-9, -11);
      ctx.lineTo(-5, -10);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-6, 12);
      ctx.lineTo(-10, 14);
      ctx.lineTo(-9, 11);
      ctx.lineTo(-5, 10);
      ctx.closePath();
      ctx.fill();
      
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(-8, -12, 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(-8, 12, 2, 0, Math.PI * 2);
      ctx.fill();
      
      
      ctx.fillStyle = "rgba(255, 200, 200, 0.7)";
      ctx.beginPath();
      ctx.ellipse(10, 0, 5, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      
      
      ctx.fillStyle = coreColor;
      ctx.shadowBlur = 8;
      ctx.shadowColor = coreColor;
      ctx.beginPath();
      ctx.arc(-6, -6, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(-6, 6, 2.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
      
    } else if (this.shipId === "specter") {
      
      
      ctx.beginPath();
      ctx.moveTo(26, 0); 
      ctx.lineTo(22, -2); 
      ctx.lineTo(16, -3); 
      ctx.lineTo(8, -4); 
      ctx.lineTo(-2, -3); 
      ctx.lineTo(-10, -1); 
      ctx.lineTo(-12, 0); 
      ctx.lineTo(-10, 1); 
      ctx.lineTo(-2, 3); 
      ctx.lineTo(8, 4); 
      ctx.lineTo(16, 3); 
      ctx.lineTo(22, 2); 
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      
      
      ctx.fillStyle = accentColor;
      ctx.beginPath();
      ctx.moveTo(8, -4); 
      ctx.lineTo(6, -5);
      ctx.lineTo(28, -8); 
      ctx.lineTo(26, -4); 
      ctx.lineTo(12, -2); 
      ctx.lineTo(8, -3); 
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(8, 4); 
      ctx.lineTo(6, 5);
      ctx.lineTo(28, 8); 
      ctx.lineTo(26, 4); 
      ctx.lineTo(12, 2); 
      ctx.lineTo(8, 3); 
      ctx.closePath();
      ctx.fill();
      
      
      ctx.fillStyle = "rgba(200, 200, 255, 0.6)";
      ctx.beginPath();
      ctx.ellipse(10, 0, 3.5, 2.5, 0, 0, Math.PI * 2);
      ctx.fill();
      
      
      ctx.fillStyle = accentColor;
      ctx.shadowBlur = 12;
      ctx.shadowColor = accentColor;
      ctx.beginPath();
      ctx.moveTo(-4, -3);
      ctx.lineTo(-2, -5);
      ctx.lineTo(-6, -5);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-4, 3);
      ctx.lineTo(-2, 5);
      ctx.lineTo(-6, 5);
      ctx.closePath();
      ctx.fill();
      ctx.shadowBlur = 0;
      
      
      ctx.globalAlpha = 0.4;
      ctx.fillStyle = coreColor;
      ctx.beginPath();
      ctx.ellipse(-8, 0, 10, 4, angle + Math.PI / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    } else if (this.shipId === "glacier") {
      ctx.beginPath();
      ctx.moveTo(20, 0);
      ctx.lineTo(14, -4);
      ctx.lineTo(8, -8);
      ctx.lineTo(-2, -7);
      ctx.lineTo(-12, -3);
      ctx.lineTo(-16, 0);
      ctx.lineTo(-12, 3);
      ctx.lineTo(-2, 7);
      ctx.lineTo(8, 8);
      ctx.lineTo(14, 4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "rgba(195, 245, 255, 0.8)";
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(-8, -10);
      ctx.lineTo(-12, 0);
      ctx.lineTo(-8, 10);
      ctx.closePath();
      ctx.fill();
    } else if (this.shipId === "aphelion") {
      ctx.beginPath();
      ctx.moveTo(30, 0);
      ctx.lineTo(20, -4);
      ctx.lineTo(10, -9);
      ctx.lineTo(-3, -9);
      ctx.lineTo(-18, -4);
      ctx.lineTo(-24, 0);
      ctx.lineTo(-18, 4);
      ctx.lineTo(-3, 9);
      ctx.lineTo(10, 9);
      ctx.lineTo(20, 4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "#ffdda1";
      ctx.shadowBlur = 18;
      ctx.shadowColor = "#ff7c2b";
      ctx.beginPath();
      ctx.arc(-10, 0, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
    
    ctx.shadowBlur = 0;
    
    
    ctx.strokeStyle = coreColor;
    ctx.lineWidth = 3;
    ctx.shadowBlur = 15;
    ctx.shadowColor = coreColor;
    ctx.beginPath();
    if (this.shipId === "striker") {
      ctx.moveTo(22, 0);
      ctx.lineTo(18, -3);
      ctx.lineTo(12, -4);
      ctx.lineTo(4, -5);
      ctx.lineTo(-6, -4);
      ctx.lineTo(-12, -2);
      ctx.lineTo(-14, 0);
      ctx.lineTo(-12, 2);
      ctx.lineTo(-6, 4);
      ctx.lineTo(4, 5);
      ctx.lineTo(12, 4);
      ctx.lineTo(18, 3);
      ctx.closePath();
    } else if (this.shipId === "aegis") {
      ctx.moveTo(20, 0);
      ctx.lineTo(16, -4);
      ctx.lineTo(10, -6);
      ctx.lineTo(2, -7);
      ctx.lineTo(-6, -6);
      ctx.lineTo(-12, -4);
      ctx.lineTo(-14, 0);
      ctx.lineTo(-12, 4);
      ctx.lineTo(-6, 6);
      ctx.lineTo(2, 7);
      ctx.lineTo(10, 6);
      ctx.lineTo(16, 4);
      ctx.closePath();
    } else if (this.shipId === "phantom") {
      ctx.moveTo(24, 0);
      ctx.lineTo(20, -2);
      ctx.lineTo(14, -3);
      ctx.lineTo(6, -4);
      ctx.lineTo(-4, -3);
      ctx.lineTo(-10, -1);
      ctx.lineTo(-12, 0);
      ctx.lineTo(-10, 1);
      ctx.lineTo(-4, 3);
      ctx.lineTo(6, 4);
      ctx.lineTo(14, 3);
      ctx.lineTo(20, 2);
      ctx.closePath();
    } else if (this.shipId === "tempest") {
      ctx.moveTo(22, 0);
      ctx.lineTo(18, -3);
      ctx.lineTo(12, -4);
      ctx.lineTo(4, -5);
      ctx.lineTo(-6, -4);
      ctx.lineTo(-12, -2);
      ctx.lineTo(-14, 0);
      ctx.lineTo(-12, 2);
      ctx.lineTo(-6, 4);
      ctx.lineTo(4, 5);
      ctx.lineTo(12, 4);
      ctx.lineTo(18, 3);
      ctx.closePath();
    } else if (this.shipId === "titan") {
      ctx.moveTo(18, 0);
      ctx.lineTo(14, -5);
      ctx.lineTo(8, -7);
      ctx.lineTo(0, -8);
      ctx.lineTo(-8, -7);
      ctx.lineTo(-14, -5);
      ctx.lineTo(-16, 0);
      ctx.lineTo(-14, 5);
      ctx.lineTo(-8, 7);
      ctx.lineTo(0, 8);
      ctx.lineTo(8, 7);
      ctx.lineTo(14, 5);
      ctx.closePath();
    } else if (this.shipId === "specter") {
      ctx.moveTo(26, 0);
      ctx.lineTo(22, -2);
      ctx.lineTo(16, -3);
      ctx.lineTo(8, -4);
      ctx.lineTo(-2, -3);
      ctx.lineTo(-10, -1);
      ctx.lineTo(-12, 0);
      ctx.lineTo(-10, 1);
      ctx.lineTo(-2, 3);
      ctx.lineTo(8, 4);
      ctx.lineTo(16, 3);
      ctx.lineTo(22, 2);
      ctx.closePath();
    } else if (this.shipId === "glacier") {
      ctx.moveTo(20, 0);
      ctx.lineTo(14, -4);
      ctx.lineTo(8, -8);
      ctx.lineTo(-2, -7);
      ctx.lineTo(-12, -3);
      ctx.lineTo(-16, 0);
      ctx.lineTo(-12, 3);
      ctx.lineTo(-2, 7);
      ctx.lineTo(8, 8);
      ctx.lineTo(14, 4);
      ctx.closePath();
    } else if (this.shipId === "aphelion") {
      ctx.moveTo(30, 0);
      ctx.lineTo(20, -4);
      ctx.lineTo(10, -9);
      ctx.lineTo(-3, -9);
      ctx.lineTo(-18, -4);
      ctx.lineTo(-24, 0);
      ctx.lineTo(-18, 4);
      ctx.lineTo(-3, 9);
      ctx.lineTo(10, 9);
      ctx.lineTo(20, 4);
      ctx.closePath();
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
    
    
    ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
    ctx.shadowBlur = 10;
    ctx.shadowColor = coreColor;
    ctx.beginPath();
    ctx.arc(10, 0, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.shadowBlur = 0;
    
    
    const speed = Math.hypot(this.vx, this.vy);
    if (speed > 50) {
      ctx.globalAlpha = Math.min(speed / 200, 0.6);
      for (let i = 0; i < 3; i++) {
        const offset = (i - 1) * 4;
        const exhaustGradient = ctx.createRadialGradient(-18 + offset, 0, 0, -18 + offset, 0, 4);
        exhaustGradient.addColorStop(0, coreColor);
        exhaustGradient.addColorStop(1, "transparent");
        ctx.fillStyle = exhaustGradient;
        ctx.beginPath();
        ctx.arc(-18 + offset, 0, 4, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    }

    const tier = (shipLoadouts[this.shipId] || shipLoadouts.striker).tier;
    const tierFx = {
      common: { outline: "#9e9e9e", shadow: 6, ring: 20, alpha: 0.25 },
      uncommon: { outline: "#4caf50", shadow: 8, ring: 22, alpha: 0.3 },
      rare: { outline: "#2196f3", shadow: 10, ring: 24, alpha: 0.35 },
      mythic: { outline: "#b14aff", shadow: 16, ring: 26, alpha: 0.45 },
      legendary: { outline: "#ff9800", shadow: 20, ring: 28, alpha: 0.5 },
      exotic: { outline: "#ff4d4d", shadow: 26, ring: 31, alpha: 0.62 },
    }[tier] || { outline: "#ffffff", shadow: 6, ring: 20, alpha: 0.24 };
    if (tier === "mythic" || tier === "legendary" || tier === "exotic") {
      ctx.save();
      ctx.strokeStyle = tierFx.outline;
      ctx.globalAlpha = tierFx.alpha;
      ctx.lineWidth = tier === "exotic" ? 3 : tier === "legendary" ? 2.6 : 2.2;
      ctx.shadowBlur = tierFx.shadow;
      ctx.shadowColor = tierFx.outline;
      ctx.beginPath();
      ctx.arc(0, 0, tierFx.ring + Math.sin(performance.now() / 220) * (tier === "exotic" ? 1.8 : 1.1), 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = tier === "exotic" ? 0.45 : 0.3;
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.arc(0, 0, tierFx.ring + 6 + Math.sin(performance.now() / 340) * 2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    
    
    if (this.invincible) {
      ctx.globalAlpha = 0.4;
    }
    
    ctx.restore();
  }
}

class ExpandingCircle {
  constructor(x, y, maxRadius, color, duration, damage = null, damagePerSecond = null) {
    this.x = x;
    this.y = y;
    this.radius = 0;
    this.maxRadius = maxRadius;
    this.color = color;
    this.life = duration;
    this.maxLife = duration;
    this.speed = maxRadius / duration; 
    this.damage = damage; 
    this.damagePerSecond = damagePerSecond; 
    this.hitEnemies = new WeakSet(); 
    this.lastDamageTime = 0; 
  }
  update(dt) {
    this.life -= dt;
    this.radius = Math.min(this.radius + this.speed * dt, this.maxRadius);
    this.lastDamageTime += dt;
    
    
    if (this.damagePerSecond && this.lastDamageTime >= 0.1) {
      for (let i = state.enemies.length - 1; i >= 0; i--) {
        const enemy = state.enemies[i];
        const d = dist(this.x, this.y, enemy.x, enemy.y);
        if (d <= this.radius) {
          let damage = this.damagePerSecond * this.lastDamageTime;
          
          if (enemy.deathMarked) {
            damage *= 1.5;
          }
          enemy.hp -= damage;
          if (enemy.hp <= 0) {
            onEnemyDestroyed(enemy, i);
          }
        }
      }
      this.lastDamageTime = 0;
    }
    
    
    if (this.damage) {
      for (let i = state.enemies.length - 1; i >= 0; i--) {
        const enemy = state.enemies[i];
        if (this.hitEnemies.has(enemy)) continue; 
        const d = dist(this.x, this.y, enemy.x, enemy.y);
        if (d <= this.radius) {
          this.hitEnemies.add(enemy);
          let damage = this.damage;
          
          if (enemy.deathMarked) {
            damage *= 1.5;
          }
          enemy.hp -= damage;
          
          if (this.color === "#ffe29b") {
            enemy.y -= 30; 
          }
          if (enemy.hp <= 0) {
            onEnemyDestroyed(enemy, i);
          }
        }
      }
    }
  }
  draw(ctx) {
    const alpha = Math.min(1, this.life / this.maxLife * 2);
    ctx.save();
    ctx.globalAlpha = alpha;
    
    
    const outerGradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
    outerGradient.addColorStop(0, this.color + "00");
    outerGradient.addColorStop(0.7, this.color + "40");
    outerGradient.addColorStop(1, this.color + "80");
    ctx.fillStyle = outerGradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    
    
    const ringGradient = ctx.createRadialGradient(this.x, this.y, this.radius * 0.8, this.x, this.y, this.radius);
    ringGradient.addColorStop(0, this.color + "00");
    ringGradient.addColorStop(0.5, this.color + "AA");
    ringGradient.addColorStop(1, this.color + "00");
    ctx.fillStyle = ringGradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    
    
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 3;
    ctx.shadowBlur = 15;
    ctx.shadowColor = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;
    
    ctx.restore();
  }
}

class NovaAnomaly {
  constructor(x, y, config = {}) {
    this.x = x;
    this.y = y;
    this.radius = 0;
    this.maxRadius = config.maxRadius || 180;
    this.pullRadius = config.pullRadius || this.maxRadius * 0.8;
    this.life = config.duration || 2.5;
    this.maxLife = this.life;
    this.pullStrength = config.pullStrength || 220;
    this.damagePerSecond = config.damagePerSecond || 30;
    this.pullEnabled = config.pullEnabled !== false;
    this.explodeAtEnd = config.explodeAtEnd || false;
    this.explosionDamage = config.explosionDamage || 0;
    this.explosionKnockback = config.explosionKnockback || 0;
    this.knockbackRadius = config.knockbackRadius || this.maxRadius * 1.35;
    this.exploded = false;
    this.color = config.color || "#57b7ff";
    this.stunWhilePulled = config.stunWhilePulled !== false;
    this.azureVortex = !!config.azureVortex;
    this.streamBudget = 0;
    this.streamColors = config.streamColors || ["#00ffff", "#4ddbff", "#a8ffff", "#00b8d4"];
  }
  update(dt) {
    this.life -= dt;
    const t = 1 - Math.max(this.life / this.maxLife, 0);
    this.radius = this.maxRadius * (0.3 + 0.7 * t);
    if (this.azureVortex && this.life > this.maxLife * 0.18) {
      this.streamBudget += dt * 320;
      while (this.streamBudget >= 1) {
        this.streamBudget -= 1;
        const ang = Math.random() * Math.PI * 2;
        const distOut = this.radius * (0.35 + Math.random() * 0.9);
        const px = this.x + Math.cos(ang) * distOut;
        const py = this.y + Math.sin(ang) * distOut;
        const c = this.streamColors[(Math.random() * this.streamColors.length) | 0];
        const p = new Particle(px, py, c);
        const inward = Math.atan2(this.y - py, this.x - px);
        const sp = rng(90, 240);
        p.vx = Math.cos(inward) * sp;
        p.vy = Math.sin(inward) * sp;
        p.life = rng(0.12, 0.38);
        p.size = rng(1.4, 3.8);
        state.particles.push(p);
      }
    }
    for (let i = state.enemies.length - 1; i >= 0; i--) {
      const enemy = state.enemies[i];
      const d = dist(this.x, this.y, enemy.x, enemy.y);
      if (d > this.radius + enemy.size) continue;
      if (this.pullEnabled && d > 1) {
        const pullAngle = Math.atan2(this.y - enemy.y, this.x - enemy.x);
        const pullForce = this.pullStrength * dt * (1 - d / (this.radius + 1));
        enemy.x += Math.cos(pullAngle) * pullForce;
        enemy.y += Math.sin(pullAngle) * pullForce;
        if (this.stunWhilePulled) {
          enemy.fireTimer = Math.max(enemy.fireTimer, 0.18);
        }
      }
      enemy.hp -= this.damagePerSecond * dt;
      if (enemy.hp <= 0) onEnemyDestroyed(enemy, i);
    }
    if (this.life <= 0 && this.explodeAtEnd && !this.exploded) {
      this.exploded = true;
      const kbR = this.knockbackRadius;
      for (let i = state.enemies.length - 1; i >= 0; i--) {
        const enemy = state.enemies[i];
        const d = dist(this.x, this.y, enemy.x, enemy.y);
        if (d <= this.maxRadius + enemy.size) {
          enemy.hp -= this.explosionDamage;
          if (enemy.hp <= 0) onEnemyDestroyed(enemy, i);
        }
        if (this.explosionKnockback > 0 && d <= kbR + enemy.size && enemy.hp > 0) {
          const a = Math.atan2(enemy.y - this.y, enemy.x - this.x);
          const falloff = 1 - Math.min(1, d / Math.max(kbR, 1));
          const kb = this.explosionKnockback * falloff;
          enemy.x += Math.cos(a) * kb;
          enemy.y += Math.sin(a) * kb;
        }
      }
      const burstTint = this.azureVortex ? "#b6ffff" : "#8ad7ff";
      const count = this.azureVortex ? 420 : 220;
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2;
        const dist = rng(20, this.maxRadius * (this.azureVortex ? 1.65 : 1.2));
        const p = new Particle(this.x + Math.cos(a) * dist, this.y + Math.sin(a) * dist, this.azureVortex && i % 2 ? "#00ffff" : burstTint);
        p.vx = Math.cos(a) * rng(140, 420);
        p.vy = Math.sin(a) * rng(140, 420);
        p.life = rng(0.28, 0.72);
        p.size = rng(2.2, 6.2);
        state.particles.push(p);
      }
    }
  }
  draw(ctx) {
    const alpha = Math.max(this.life / this.maxLife, 0);
    ctx.save();
    if (this.azureVortex) {
      ctx.globalAlpha = alpha * 0.92;
      ctx.shadowBlur = 38;
      ctx.shadowColor = "#00ffff";
    } else {
      ctx.globalAlpha = alpha * 0.7;
    }
    const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
    g.addColorStop(0, this.color + "ee");
    g.addColorStop(0.45, this.color + "99");
    g.addColorStop(0.78, this.color + "33");
    g.addColorStop(1, this.color + "00");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    if (this.azureVortex) {
      ctx.globalAlpha = alpha * 0.55;
      ctx.strokeStyle = "rgba(180,255,255,0.65)";
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius * 0.88, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius * 0.52, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }
}

class NovaOrbiter {
  constructor(angleOffset = 0, radius = 70) {
    this.angle = angleOffset;
    this.radius = radius;
    this.radiusSpeed = rng(20, 40);
    this.ellipse = rng(0.55, 1.35);
    this.x = state.player.x;
    this.y = state.player.y;
    this.life = 9;
    this.maxLife = 9;
    this.cooldown = 0;
    this.phase = Math.random() * Math.PI * 2;
    this.tightOrbit = false;
    this.oracleDrone = false;
  }
  update(dt) {
    this.life -= dt;
    this.cooldown = Math.max(0, this.cooldown - dt);
    if (this.tightOrbit) {
      this.angle += dt * 2.55;
      const baseR = 68 + Math.sin(this.angle * 2.4 + this.phase) * 7;
      this.x = state.player.x + Math.cos(this.angle) * baseR;
      this.y = state.player.y + Math.sin(this.angle) * baseR * 0.96;
    } else {
      this.angle += dt * (1.7 + Math.sin(performance.now() / 600 + this.phase) * 0.8);
      this.radius += Math.sin(performance.now() / 450 + this.phase) * this.radiusSpeed * dt;
      this.radius = clamp(this.radius, 35, 150);
      this.ellipse += Math.sin(performance.now() / 700 + this.phase) * 0.35 * dt;
      this.ellipse = clamp(this.ellipse, 0.4, 1.65);
      this.x = state.player.x + Math.cos(this.angle) * this.radius;
      this.y = state.player.y + Math.sin(this.angle) * this.radius * this.ellipse;
    }
    for (let i = state.enemyBullets.length - 1; i >= 0; i--) {
      const b = state.enemyBullets[i];
      if (dist(b.x, b.y, this.x, this.y) < b.size + 10) {
        state.enemyBullets.splice(i, 1);
        const pc = this.tightOrbit ? "#6ef8ff" : "#5ec6ff";
        for (let p = 0; p < 6; p++) state.particles.push(new Particle(this.x, this.y, pc));
      }
    }
    for (let i = state.enemies.length - 1; i >= 0; i--) {
      const enemy = state.enemies[i];
      const d = dist(enemy.x, enemy.y, this.x, this.y);
      if (d < enemy.size + 12 && this.cooldown <= 0) {
        enemy.hp -= 22 * state.player.damageMultiplier * state.player.abilityDamageMultiplier;
        const a = Math.atan2(enemy.y - state.player.y, enemy.x - state.player.x);
        enemy.x += Math.cos(a) * 16;
        enemy.y += Math.sin(a) * 16;
        state.player.hp = Math.min(state.player.maxHp, state.player.hp + 1.2);
        this.cooldown = 0.08;
        if (enemy.hp <= 0) onEnemyDestroyed(enemy, i);
      }
    }
  }
  draw(ctx) {
    const alpha = Math.max(this.life / this.maxLife, 0);
    ctx.save();
    ctx.globalAlpha = alpha;
    const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, 12);
    if (this.oracleDrone) {
      g.addColorStop(0, "#f5e6ff");
      g.addColorStop(0.55, "#b86fff");
      g.addColorStop(1, "rgba(120,60,200,0)");
      ctx.shadowBlur = 12;
      ctx.shadowColor = "#d4a8ff";
    } else if (this.tightOrbit) {
      g.addColorStop(0, "#f0ffff");
      g.addColorStop(0.5, "#3defff");
      g.addColorStop(1, "rgba(0,230,255,0)");
      ctx.shadowBlur = 14;
      ctx.shadowColor = "#00ffff";
    } else {
      g.addColorStop(0, "#e2f6ff");
      g.addColorStop(0.55, "#5ec6ff");
      g.addColorStop(1, "rgba(94,198,255,0)");
    }
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(this.x, this.y, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

class BluefallPortal {
  constructor(x, y, delay) {
    this.x = x;
    this.y = y;
    this.delay = delay;
    this.age = 0;
    this.phase = "wait";
    this.chargeT = 0;
    this.shotsLeft = 5;
    this.nextShotIn = 0;
    this.spin = Math.random() * Math.PI * 2;
  }
  update(dt) {
    this.age += dt;
    if (this.phase === "wait") {
      if (this.age >= this.delay) {
        this.phase = "charge";
        this.chargeT = 0;
      }
      return false;
    }
    if (this.phase === "charge") {
      this.chargeT += dt;
      if (this.chargeT >= 1) {
        this.phase = "fire";
        this.nextShotIn = 0;
      }
      return false;
    }
    if (this.phase === "fire") {
      this.nextShotIn -= dt;
      if (this.shotsLeft > 0 && this.nextShotIn <= 0) {
        const base = Math.PI / 2 + rng(-0.42, 0.42);
        const orb = new Bullet(
          this.x,
          this.y,
          base + rng(-0.16, 0.16),
          rng(210, 292) * state.player.shotSpeedMultiplier,
          true,
          5,
          "#7aebff",
          11 * state.player.damageMultiplier * state.player.abilityDamageMultiplier
        );
        orb.life = rng(2.4, 3.4);
        orb.novaBurst = true;
        orb.novaNoPull = true;
        orb.novaBurstRadius = 96;
        orb.novaBurstDamage = 82 * state.player.damageMultiplier * state.player.abilityDamageMultiplier;
        state.bullets.push(orb);
        this.shotsLeft -= 1;
        this.nextShotIn = this.shotsLeft > 0 ? rng(0.038, 0.13) : 999;
      }
      if (this.shotsLeft <= 0) return true;
      return false;
    }
    return true;
  }
  draw(ctx) {
    if (this.phase === "wait") return;
    const alpha = this.phase === "charge" ? Math.min(this.chargeT / 1, 1) : 1;
    ctx.save();
    ctx.translate(this.x, this.y);
    this.spin += 0.07;
    ctx.rotate(this.spin);
    ctx.globalAlpha = 0.35 + alpha * 0.5;
    ctx.strokeStyle = `rgba(120,240,255,${0.4 + alpha * 0.45})`;
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.ellipse(0, 0, 22 + alpha * 10, 14 + alpha * 6, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, 8 + alpha * 5, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(200,255,255,${0.55 + alpha * 0.35})`;
    ctx.stroke();
    ctx.restore();
  }
}

const state = {
  stars: [],
  player: new Player(),
  bullets: [],
  enemyBullets: [],
  enemies: [],
  particles: [],
  visualBeams: [],
  novaAnomalies: [],
  novaOrbiters: [],
  bluefallPortals: [],
  powerUps: [],
  drones: [],
  barriers: [],
  blackHoles: [],
  expandingCircles: [],
  timeDilationFields: [],
  wave: 1,
  score: 0,
  highScore: Number(localStorage.getItem("orbital-high-score") || 0),
  quantumCores: Number(localStorage.getItem("orbital-quantum-cores") || 0),
  quantumCoresEarnedThisRun: 0,
  unlockedShips: JSON.parse(localStorage.getItem("orbital-unlocked-ships") || '["striker"]'),
  running: false,
  paused: false,
  upgradePending: false,
  awaitingUpgrade: false,
  upgradeChoices: [],
  waveAnnouncementTimer: 0,
  lastTime: 0,
  boss: null,
  lastBossType: null,
  difficultyKey: "recruit",
  shipKey: "striker",
  enemiesToSpawn: [], 
  spawnTimer: 0, 
  waveComplete: false, 
  currentSegmentEnemies: 0, 
  maxEnemiesOnScreen: 12, 
  segmentsSpawned: 0, 
  totalEnemiesThisWave: 0, 
  maxSegmentsThisWave: 0, 
  abilityKeys: JSON.parse(localStorage.getItem("orbital-ability-keys") || '["1", "2", "3"]'), 
  tutorialMode: false,
  tutorialStep: 0,
  tutorialTestWave: false,
  tutorialStepStartTime: 0,
  tutorialProgress: {
    moved: false,
    shot: false,
    usedAbility1: false,
    usedAbility2: false,
    usedAbility3: false,
  },
  tempAllShipsTrial: false,
  tempTrialRunActive: false,
  mode: "endless",
  campaignLevel: 1,
  campaignUnlockedLevel: Number(localStorage.getItem("orbital-campaign-unlocked-level") || 1),
  campaignWaveTarget: 5,
  enemyDamageMultiplier: 1,
  selectedCampaignLevel: 1,
  achievements: JSON.parse(localStorage.getItem("orbital-achievements") || "{}"),
};

const hasShipAccess = (shipId) =>
  state.unlockedShips.includes(shipId) || state.tempAllShipsTrial || state.tempTrialRunActive;

const isAtlasShipId = (shipId) => typeof shipId === "string" && shipId.startsWith("atlas-");

const ACHIEVEMENT_DEFS = [
  { id: "first-run", name: "First Sortie", desc: "Start your first mission." },
  { id: "first-kill", name: "First Contact", desc: "Destroy your first enemy." },
  { id: "boss-kill", name: "Boss Breaker", desc: "Defeat a boss." },
  { id: "wave-10", name: "Wave Rider I", desc: "Reach wave 10 in a run." },
  { id: "wave-25", name: "Wave Rider II", desc: "Reach wave 25 in a run." },
  { id: "score-10k", name: "Five Digits", desc: "Score 10,000 points." },
  { id: "score-50k", name: "High Orbit", desc: "Score 50,000 points." },
  { id: "campaign-clear", name: "Cadet Graduate", desc: "Complete a campaign level." },
  { id: "campaign-10", name: "Linebreaker", desc: "Unlock campaign level 10." },
  { id: "campaign-25", name: "Frontline Veteran", desc: "Unlock campaign level 25." },
];
for (let i = 1; i <= 140; i++) {
  ACHIEVEMENT_DEFS.push({
    id: `grind-${i}`,
    name: `Tactical Milestone ${String(i).padStart(3, "0")}`,
    desc: `Accumulate progression milestone ${i}.`,
  });
}

const unlockAchievement = (id) => {
  if (state.achievements[id]) return;
  state.achievements[id] = true;
  localStorage.setItem("orbital-achievements", JSON.stringify(state.achievements));
};

const renderAchievements = () => {
  if (!achievementsList || !achievementsSummary) return;
  achievementsList.innerHTML = "";
  let unlockedCount = 0;
  ACHIEVEMENT_DEFS.forEach((a) => {
    const unlocked = !!state.achievements[a.id];
    if (unlocked) unlockedCount++;
    const row = document.createElement("div");
    row.className = `achievement-row ${unlocked ? "unlocked" : ""}`;
    row.innerHTML = `<strong>${a.name}</strong><span>${a.desc}</span><em>${unlocked ? "Unlocked" : "Locked"}</em>`;
    achievementsList.appendChild(row);
  });
  achievementsSummary.textContent = `${unlockedCount}/${ACHIEVEMENT_DEFS.length} unlocked`;
};

const getCampaignWaveTarget = (level) => clamp(3 + Math.floor(level / 2), 3, 15);

const addEnergy = (amount) => {
  state.player.energy = clamp(
    state.player.energy + amount,
    0,
    state.player.maxEnergy
  );
};

const pickUpgradeChoices = () => {
  const count = Math.min(3, upgradePool.length);
  const indices = new Set();
  while (indices.size < count) {
    indices.add(Math.floor(Math.random() * upgradePool.length));
  }
  return Array.from(indices).map((idx) => upgradePool[idx]);
};

const applyUpgradeChoice = (choice) => {
  choice.apply(state.player);
  upgradePanel.classList.add("hidden");
  state.upgradePending = false;
  state.paused = false;
  state.awaitingUpgrade = false;
  state.upgradeChoices = [];
  if (state.mode === "campaign" && state.wave >= state.campaignWaveTarget) {
    unlockAchievement("campaign-clear");
    state.campaignUnlockedLevel = Math.max(state.campaignUnlockedLevel, state.campaignLevel + 1);
    localStorage.setItem("orbital-campaign-unlocked-level", String(state.campaignUnlockedLevel));
    if (state.campaignUnlockedLevel >= 10) unlockAchievement("campaign-10");
    if (state.campaignUnlockedLevel >= 25) unlockAchievement("campaign-25");
    state.running = false;
    if (campaignPanel) campaignPanel.classList.remove("hidden");
    if (mainHub) mainHub.classList.remove("hidden");
    if (instructionsEl) instructionsEl.classList.add("hidden");
    updateHud();
    return;
  }
  state.wave++;
  spawnWave();
  updateHud();
};

const openUpgradePanel = () => {
  tone(520, 0.12, "triangle", audio.sfxVolume * 0.14);
  
  state.bullets = [];
  state.enemyBullets = [];
  state.particles = [];
  state.visualBeams = [];
  state.powerUps = [];
  state.drones = [];
  state.barriers = [];
  state.blackHoles = [];
  state.expandingCircles = [];
  state.timeDilationFields = [];
  state.novaAnomalies = [];
  state.novaOrbiters = [];
  state.bluefallPortals = [];
  
  
  state.player.x = config.width / 2;
  state.player.y = config.height - 100;
  
  state.upgradePending = true;
  state.paused = true;
  upgradePanel.classList.remove("hidden");
  upgradeOptionsEl.innerHTML = "";
  state.upgradeChoices = pickUpgradeChoices();
  state.upgradeChoices.forEach((choice) => {
    const button = document.createElement("button");
    button.className = "upgrade-option";
    button.innerHTML = `<strong>${choice.name}</strong><span>${choice.desc}</span>`;
    button.addEventListener("click", () => applyUpgradeChoice(choice));
    upgradeOptionsEl.appendChild(button);
  });
};

const onEnemyDestroyed = (enemy, index) => {
  state.score += enemy.kind === "boss" ? 500 : 30;
  unlockAchievement("first-kill");
  
  
  const diff = difficultyModes[state.difficultyKey] || difficultyModes.veteran;
  let coresAwarded = 0;
  if (enemy.kind === "boss") {
    coresAwarded = Math.floor((50 + state.wave * 5) * (diff.bossHpMultiplier || 1));
  } else {
    const baseCores = 2 + state.wave * 0.5;
    let multiplier = 1;
    if (state.difficultyKey === "nightmare") {
      multiplier = 1.5;
    } else if (state.difficultyKey === "veteran") {
      multiplier = 1.2;
    } else if (state.difficultyKey === "recruit") {
      multiplier = 0.3; 
    }
    coresAwarded = Math.floor(baseCores * multiplier);
  }
  state.quantumCores += coresAwarded;
  state.quantumCoresEarnedThisRun += coresAwarded;
  localStorage.setItem("orbital-quantum-cores", state.quantumCores);
  
  
  if (enemy.kind === "splitter" && !enemy.hasSplit) {
    for (let i = 0; i < 2; i++) {
      const angle = (i / 2) * Math.PI * 2;
      const spawnX = enemy.x + Math.cos(angle) * 30;
      const spawnY = enemy.y + Math.sin(angle) * 30;
      if (spawnX > 30 && spawnX < config.width - 30 && spawnY > 30 && spawnY < config.height - 80) {
        const split = new Enemy("swarm", spawnX, spawnY, enemy.wave);
        split.hp = Math.floor(enemy.hp / 2);
        split.maxHp = split.hp;
        state.enemies.push(split);
      }
    }
  }
  
  for (let k = 0; k < 25; k++) {
    state.particles.push(new Particle(enemy.x, enemy.y, "#ffb347"));
  }
  if (Math.random() < 0.15 * diff.powerDrop) {
    const kinds = ["heal", "shield", "rapid", "burst"];
    state.powerUps.push(
      new PowerUp(
        enemy.x,
        enemy.y,
        kinds[Math.floor(Math.random() * kinds.length)]
      )
    );
  }
  addEnergy(enemy.kind === "boss" ? 65 : 1);
  if (enemy.kind === "boss") {
    unlockAchievement("boss-kill");
    playSfx.bossDown();
    state.boss = null;
  } else {
    playSfx.enemyDown();
  }
  state.enemies.splice(index, 1);
};

const consumeAbilityEnergy = (cost) => {
  if (state.player.energy < cost) return false;
  state.player.energy -= cost;
  return true;
};

const abilityParticleBurst = (color, count = 150, radius = 80) => {
  
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2;
    const distance = rng(0, radius);
    const x = state.player.x + Math.cos(angle) * distance;
    const y = state.player.y + Math.sin(angle) * distance;
    const particle = new Particle(x, y, color);
    particle.vx = Math.cos(angle) * rng(50, 150);
    particle.vy = Math.sin(angle) * rng(50, 150);
    particle.life = rng(0.3, 0.6);
    state.particles.push(particle);
  }
};

const emitSpiralInwardParticles = (cx, cy, color, arms = 4, perArm = 36, maxRadius = 140, spin = 1, inwardSpeed = 0.55) => {
  for (let arm = 0; arm < arms; arm++) {
    for (let i = 0; i < perArm; i++) {
      const t = i / perArm;
      const radius = maxRadius * (1 - t * 0.86);
      const angle = t * Math.PI * 7 * spin + (arm / arms) * Math.PI * 2;
      const x = cx + Math.cos(angle) * radius;
      const y = cy + Math.sin(angle) * radius;
      const p = new Particle(x, y, color);
      p.vx = (cx - x) * inwardSpeed + Math.cos(angle + Math.PI / 2) * 20;
      p.vy = (cy - y) * inwardSpeed + Math.sin(angle + Math.PI / 2) * 20;
      p.life = 0.55 + t * 0.35;
      p.size = 1 + (1 - t) * 2.2;
      state.particles.push(p);
    }
  }
};

const emitRiftShearParticles = (cx, cy, color, segments = 16, spread = 180) => {
  for (let i = 0; i < segments; i++) {
    const xBias = rng(-spread, spread);
    const yBias = rng(-spread * 0.5, spread * 0.5);
    for (let j = 0; j < 18; j++) {
      const t = j / 18;
      const p = new Particle(cx + xBias * t, cy + yBias * t, color);
      p.vx = xBias * 0.3 + rng(-40, 40);
      p.vy = yBias * 0.3 + rng(-30, 30);
      p.life = rng(0.35, 0.7);
      p.size = rng(1.5, 3.8);
      state.particles.push(p);
    }
  }
};

const emitNovaShellParticles = (cx, cy, colorA = "#5ec6ff", colorB = "#d9fbff", rings = 6, samples = 64) => {
  for (let ring = 1; ring <= rings; ring++) {
    const ringRadius = 20 + ring * 24;
    for (let i = 0; i < samples; i++) {
      const angle = (i / samples) * Math.PI * 2;
      const p = new Particle(cx + Math.cos(angle) * ringRadius, cy + Math.sin(angle) * ringRadius, ring % 2 ? colorA : colorB);
      p.vx = Math.cos(angle) * rng(80, 210);
      p.vy = Math.sin(angle) * rng(80, 210);
      p.life = rng(0.38, 0.72);
      p.size = rng(1.8, 4.3);
      state.particles.push(p);
    }
  }
};

const abilityHandlers = {
  burst: (cost) => {
    if (!state.running || state.upgradePending || !consumeAbilityEnergy(cost)) return;
    abilityParticleBurst("#9bf5ff", 250, 100);
    const sprays = 48;
    const damage = 7 * state.player.damageMultiplier * state.player.novaDamageMultiplier * state.player.abilityDamageMultiplier;
    const baseSpeed = 420 * state.player.shotSpeedMultiplier;
    for (let ring = 0; ring < 2; ring++) {
      for (let i = 0; i < sprays; i++) {
        const angle = (i / sprays) * Math.PI * 2 + ring * 0.04;
        state.bullets.push(
          new Bullet(state.player.x, state.player.y, angle + rng(-0.05, 0.05), baseSpeed + ring * 60, true, 4, "#9bf5ff", damage)
        );
      }
    }
  },
  rapidVolley: (cost) => {
    if (!state.running || state.upgradePending || !consumeAbilityEnergy(cost)) return;
    const rvCol = {
      sparrow: "#7dffb3",
      vanguard: "#ffd48a",
      glacier: "#b8ecff",
      myrmidon: "#ffb38a",
      lancer: "#ffe2a1",
      striker: "#ffd166",
    }[state.player.shipId] || "#ffd166";
    abilityParticleBurst(rvCol, 120, 60);
    state.player.rapidVolleyActive = true;
    state.player.rapidVolleyTimer = 0.75;
    state.player.shoot(state.bullets);
  },
  energySurge: (cost) => {
    if (!state.running || state.upgradePending || !consumeAbilityEnergy(cost)) return;
    const sid = state.player.shipId;
    const pal = {
      striker: { c: "#74ffce", mul: 1 },
      sparrow: { c: "#ff9de2", mul: 1.02 },
      vanguard: { c: "#9fd4ff", mul: 1.05 },
      inferno: { c: "#ff7a4a", mul: 1.08 },
      myrmidon: { c: "#ffd27a", mul: 1 },
    }[sid] || { c: "#74ffce", mul: 1 };
    abilityParticleBurst(pal.c, 100, 50);
    const orbCount = sid === "inferno" ? 72 : 64;
    const baseSpeed = sid === "vanguard" ? 320 : 300;
    for (let i = 0; i < orbCount; i++) {
      const spiralAngle = (i / orbCount) * Math.PI * 4;
      const radius = 30 + (i / orbCount) * (sid === "sparrow" ? 26 : 20);
      const startX = state.player.x + Math.cos(spiralAngle) * radius;
      const startY = state.player.y + Math.sin(spiralAngle) * radius;
      const direction = spiralAngle + Math.PI / 2;
      state.bullets.push(
        new Bullet(
          startX,
          startY,
          direction,
          baseSpeed * state.player.shotSpeedMultiplier * pal.mul,
          true,
          5,
          pal.c,
          12 * state.player.damageMultiplier * state.player.abilityDamageMultiplier
        )
      );
    }
  },
  shockwave: (cost) => {
    if (!state.running || state.upgradePending || !consumeAbilityEnergy(cost)) return;
    const sid = state.player.shipId;
    const skin = {
      aegis: { p: "#ffe29b", ring: "#ffd27a" },
      bulwark: { p: "#d4a574", ring: "#c49a6c" },
      warden: { p: "#9ecfff", ring: "#7eb8f4" },
      halberd: { p: "#ffcf8a", ring: "#f5b85c" },
    }[sid] || { p: "#ffe29b", ring: "#ffe29b" };
    abilityParticleBurst(skin.p, 200, 100);
    const radius = 240;
    const baseDamage = 140 + state.wave * 3;
    const circle = new ExpandingCircle(state.player.x, state.player.y, radius, skin.ring, 1.5, baseDamage, null, true);
    state.expandingCircles.push(circle);
    for (let ring = 0; ring < 3; ring++) {
      const ringRadius = radius * (ring + 1) / 3;
      for (let j = 0; j < 24; j++) {
        const angle = (j / 24) * Math.PI * 2;
        const x = state.player.x + Math.cos(angle) * ringRadius;
        const y = state.player.y + Math.sin(angle) * ringRadius;
        const p = new Particle(x, y, skin.p);
        p.vx = Math.cos(angle) * 200;
        p.vy = Math.sin(angle) * 200;
        p.life = 0.4;
        state.particles.push(p);
      }
    }
  },
  shieldOvercharge: (cost) => {
    if (!state.running || state.upgradePending || !consumeAbilityEnergy(cost)) return;
    const col = { aegis: "#7dffc8", warden: "#a6e3ff", bulwark: "#c8d8e8" }[state.player.shipId] || "#90ff90";
    abilityParticleBurst(col, 150, 70);
    state.timeDilationFields = state.timeDilationFields || [];
    state.timeDilationFields.push(new TimeDilationField(state.player.x, state.player.y));
  },
  fortify: (cost) => {
    if (!state.running || state.upgradePending || !consumeAbilityEnergy(cost)) return;
    const col = { aegis: "#ffe8b0", bulwark: "#c4b28a", halberd: "#e8d4a8", myrmidon: "#f0d060" }[state.player.shipId] || "#ffe29b";
    abilityParticleBurst(col, 180, 80);
    state.player.fortifyActive = true;
    state.player.fortifyTimer = 10;
    const angle = Math.atan2(input.mouse.y - state.player.y, input.mouse.x - state.player.x);
    for (let i = 0; i < 8; i++) {
      const spread = (i - 4) * 0.2;
      state.bullets.push(
        new Bullet(state.player.x, state.player.y, angle + spread, 400 * state.player.shotSpeedMultiplier, true, 4, col, 5 * state.player.damageMultiplier * state.player.abilityDamageMultiplier)
      );
    }
  },
  blink: (cost) => {
    if (!state.running || state.upgradePending || !consumeAbilityEnergy(cost)) return;
    const oldX = state.player.x;
    const oldY = state.player.y;
    const angle = Math.atan2(input.mouse.y - state.player.y, input.mouse.x - state.player.x);
    const dashDistance = 180;
    
    abilityParticleBurst("#d1afff", 100, 50);
    state.player.x = clamp(state.player.x + Math.cos(angle) * dashDistance, 20, config.width - 20);
    state.player.y = clamp(state.player.y + Math.sin(angle) * dashDistance, 20, config.height - 20);
    
    abilityParticleBurst("#d1afff", 100, 50);
    
    for (let i = 0; i < 30; i++) {
      const t = i / 30;
      const x = oldX + (state.player.x - oldX) * t;
      const y = oldY + (state.player.y - oldY) * t;
      const p = new Particle(x, y, "#d1afff");
      p.life = 0.3;
      state.particles.push(p);
    }
    const bolts = 18;
    for (let i = 0; i < bolts; i++) {
      const spread = (i / bolts) * Math.PI * 2;
      state.bullets.push(new Bullet(state.player.x, state.player.y, spread, 360, true, 4, "#d1afff", 7 * state.player.damageMultiplier * state.player.abilityDamageMultiplier));
    }
  },
  ghostfire: (cost) => {
    if (!state.running || state.upgradePending || !consumeAbilityEnergy(cost)) return;
    abilityParticleBurst("#d1afff", 100, 50);
    const angle = Math.atan2(input.mouse.y - state.player.y, input.mouse.x - state.player.x);
    for (let i = 0; i < 12; i++) {
      const offset = (i - 6) * 0.1;
      state.bullets.push(new Bullet(state.player.x, state.player.y, angle + offset, 480 * state.player.shotSpeedMultiplier, true, 5, "#d1afff", 8 * state.player.damageMultiplier * state.player.abilityDamageMultiplier));
    }
    state.player.burstTimer = Math.min(state.player.burstTimer + 5, 9);
  },
  phaseShift: (cost) => {
    if (!state.running || state.upgradePending || !consumeAbilityEnergy(cost)) return;
    const sid = state.player.shipId;
    const col = { oracle: "#d4b8ff", aurora: "#7dfff0", phantom: "#9b7fff" }[sid] || "#9b7fff";
    const oldX = state.player.x;
    const oldY = state.player.y;
    abilityParticleBurst(col, 120, 60);
    state.player.x = clamp(state.player.x + rng(-200, 200), 20, config.width - 20);
    state.player.y = clamp(state.player.y + rng(-200, 200), 20, config.height - 20);
    abilityParticleBurst(col, 120, 60);
    const angle = Math.atan2(input.mouse.y - state.player.y, input.mouse.x - state.player.x);
    for (let i = 0; i < 6; i++) {
      const spread = (i - 3) * 0.15;
      state.bullets.push(
        new Bullet(state.player.x, state.player.y, angle + spread, 450 * state.player.shotSpeedMultiplier, true, 4, col, 6 * state.player.damageMultiplier * state.player.abilityDamageMultiplier)
      );
    }
  },
  lightningStorm: (cost) => {
    if (!state.running || state.upgradePending || !consumeAbilityEnergy(cost)) return;
    const sid = state.player.shipId;
    const prof = {
      tempest: { burst: "#fff44d", c0: "#ffffff", c1: "#ffff00", c2: "#ffaa00", hit: "#ffff00", top: 0, bolts: 12 },
      oracle: { burst: "#e0c8ff", c0: "#ffffff", c1: "#d4a8ff", c2: "#b070ff", hit: "#e6c6ff", top: 42, bolts: 14 },
      aurora: { burst: "#8ffff0", c0: "#e8ffff", c1: "#66ffe6", c2: "#3dd4ff", hit: "#7dfff4", top: 12, bolts: 11 },
    }[sid] || { burst: "#ffff00", c0: "#ffffff", c1: "#ffff00", c2: "#ffaa00", hit: "#ffff00", top: 0, bolts: 12 };
    abilityParticleBurst(prof.burst, 150, 70);
    const boltCount = Math.min(prof.bolts, state.enemies.length + 5);
    const hitEnemies = new Set();
    for (let bolt = 0; bolt < boltCount; bolt++) {
      const spawnX = rng(50, config.width - 50);
      const spawnY = prof.top;
      
      
      let target = null;
      let minDist = Infinity;
      for (let i = 0; i < state.enemies.length; i++) {
        const enemy = state.enemies[i];
        if (hitEnemies.has(i)) continue;
        const d = dist(spawnX, spawnY, enemy.x, enemy.y);
        if (d < minDist && d < 600) {
          minDist = d;
          target = { enemy, index: i };
        }
      }
      
      
      const strikeX = target ? target.enemy.x : rng(100, config.width - 100);
      const strikeY = target ? target.enemy.y : rng(100, config.height - 100);
      
      
      for (let layer = 0; layer < 3; layer++) {
        for (let k = 0; k < 60; k++) {
          const t = k / 60;
          const baseX = spawnX + (strikeX - spawnX) * t;
          const baseY = spawnY + (strikeY - spawnY) * t;
          const offset = Math.sin(t * 25 + layer) * rng(10, 25);
          const x = baseX + Math.cos(t * Math.PI * 5) * offset;
          const y = baseY;
          const p = new Particle(x, y, layer === 0 ? prof.c0 : layer === 1 ? prof.c1 : prof.c2);
          p.life = 0.4;
          p.size = rng(3, 5);
          state.particles.push(p);
        }
      }
      if (target) {
        hitEnemies.add(target.index);
        target.enemy.hp -= 120 * state.player.damageMultiplier * state.player.abilityDamageMultiplier;
        for (let j = 0; j < 30; j++) {
          state.particles.push(new Particle(target.enemy.x, target.enemy.y, prof.hit));
        }
        if (target.enemy.hp <= 0) {
          onEnemyDestroyed(target.enemy, target.index);
        }
      }
    }
  },
  combatDrone: (cost) => {
    if (!state.running || state.upgradePending || !consumeAbilityEnergy(cost)) return;
    if (state.player.shipId === "oracle") {
      abilityParticleBurst("#d4a8ff", 210, 95);
      for (let i = 0; i < 14; i++) {
        const orb = new NovaOrbiter((i / 14) * Math.PI * 2, rng(38, 132));
        orb.oracleDrone = true;
        state.novaOrbiters.push(orb);
      }
      return;
    }
    abilityParticleBurst("#5ec6ff", 200, 90);
    for (let i = 0; i < 12; i++) {
      const orb = new NovaOrbiter((i / 12) * Math.PI * 2, rng(40, 145));
      state.novaOrbiters.push(orb);
    }
  },
  chainBolt: (cost) => {
    if (!state.running || state.upgradePending || !consumeAbilityEnergy(cost)) return;
    abilityParticleBurst("#ffff00", 80, 40);
    const angle = Math.atan2(input.mouse.y - state.player.y, input.mouse.x - state.player.x);
    let target = null;
    let minDist = Infinity;
    for (const enemy of state.enemies) {
      const d = dist(state.player.x, state.player.y, enemy.x, enemy.y);
      if (d < minDist && d < 300) {
        minDist = d;
        target = enemy;
      }
    }
    if (target) {
      const bolt = new Bullet(state.player.x, state.player.y, angle, 600 * state.player.shotSpeedMultiplier, true, 6, "#ffff00", 15 * state.player.damageMultiplier * state.player.abilityDamageMultiplier);
      state.bullets.push(bolt);
      
      for (let k = 0; k < 20; k++) {
        const t = k / 20;
        const x = state.player.x + (target.x - state.player.x) * t + Math.sin(t * 8) * 8;
        const y = state.player.y + (target.y - state.player.y) * t + Math.cos(t * 8) * 8;
        const p = new Particle(x, y, "#ffff00");
        p.life = 0.15;
        state.particles.push(p);
      }
    }
  },
  overload: (cost) => {
    if (!state.running || state.upgradePending || !consumeAbilityEnergy(cost)) return;
    const sid = state.player.shipId;
    if (sid === "inferno") {
      abilityParticleBurst("#ff6b35", 200, 90);
      const circle = new ExpandingCircle(state.player.x, state.player.y, 210, "#ff4500", 1.15, 88 * state.player.damageMultiplier * state.player.abilityDamageMultiplier, null, true);
      state.expandingCircles.push(circle);
      return;
    }
    if (sid === "helios") {
      abilityParticleBurst("#fff8dc", 200, 90);
      const circle = new ExpandingCircle(state.player.x, state.player.y, 205, "#ffec80", 1.25, 85 * state.player.damageMultiplier * state.player.abilityDamageMultiplier, null, true);
      state.expandingCircles.push(circle);
      return;
    }
    abilityParticleBurst("#e8ff44", 200, 90);
    const radius = 200;
    const baseDamage = 80 * state.player.damageMultiplier * state.player.abilityDamageMultiplier;
    const circle = new ExpandingCircle(state.player.x, state.player.y, radius, "#d4ff33", 1.2, baseDamage, null, true);
    state.expandingCircles.push(circle);
  },
  siegeCannon: (cost) => {
    if (!state.running || state.upgradePending || !consumeAbilityEnergy(cost)) return;
    const angle = Math.atan2(input.mouse.y - state.player.y, input.mouse.x - state.player.x);
    
    for (let i = 0; i < 250; i++) {
      const spread = rng(-0.4, 0.4);
      const dist = rng(15, 50);
      const x = state.player.x + Math.cos(angle + spread) * dist;
      const y = state.player.y + Math.sin(angle + spread) * dist;
      const p = new Particle(x, y, "#ff4444");
      p.vx = Math.cos(angle + spread) * rng(100, 200);
      p.vy = Math.sin(angle + spread) * rng(100, 200);
      p.life = rng(0.2, 0.4);
      state.particles.push(p);
    }
    for (let i = 0; i < 5; i++) {
      const offset = (i - 2) * 0.12;
      const bullet = new Bullet(state.player.x, state.player.y, angle + offset, 400 * state.player.shotSpeedMultiplier, true, 12, "#ff4444", 35 * state.player.damageMultiplier * state.player.abilityDamageMultiplier);
      state.bullets.push(bullet);
    }
  },
  energyBarrier: (cost) => {
    if (!state.running || state.upgradePending || !consumeAbilityEnergy(cost)) return;
    abilityParticleBurst("#00ffff", 150, 70);
    
    
    const centerX = state.player.x;
    const centerY = state.player.y - 60; 
    
    
    state.barriers.push(new Barrier(centerX, centerY, 0)); 
    for (let j = 0; j < 20; j++) {
      const t = (j / 20) - 0.5;
      const x = centerX + Math.cos(0) * t * 60;
      const y = centerY + Math.sin(0) * t * 60;
      state.particles.push(new Particle(x, y, "#00ffff"));
    }
    
    
    const leftX = state.player.x - 50;
    const leftY = state.player.y - 50;
    const leftAngle = Math.PI; 
    state.barriers.push(new Barrier(leftX, leftY, leftAngle));
    for (let j = 0; j < 20; j++) {
      const t = (j / 20) - 0.5;
      const x = leftX + Math.cos(leftAngle) * t * 60;
      const y = leftY + Math.sin(leftAngle) * t * 60;
      state.particles.push(new Particle(x, y, "#00ffff"));
    }
    
    
    const rightX = state.player.x + 50;
    const rightY = state.player.y - 50;
    const rightAngle = 0; 
    state.barriers.push(new Barrier(rightX, rightY, rightAngle));
    for (let j = 0; j < 20; j++) {
      const t = (j / 20) - 0.5;
      const x = rightX + Math.cos(rightAngle) * t * 60;
      const y = rightY + Math.sin(rightAngle) * t * 60;
      state.particles.push(new Particle(x, y, "#00ffff"));
    }
    
    
    state.player.infiniteShield = true;
    state.player.infiniteShieldTimer = 5;
    state.player.shieldColorOverride = "rgba(0, 255, 255, 0.9)";
    state.player.shieldColorTimer = 5;
  },
  rampage: (cost) => {
    if (!state.running || state.upgradePending || !consumeAbilityEnergy(cost)) return;
    abilityParticleBurst("#ff4444", 200, 90);
    
    const angle = Math.atan2(input.mouse.y - state.player.y, input.mouse.x - state.player.x);
    for (let i = 0; i < 15; i++) {
      const spread = (i - 7) * 0.1;
      state.bullets.push(
        new Bullet(state.player.x, state.player.y, angle + spread, 550 * state.player.shotSpeedMultiplier, true, 6, "#ff4444", 12 * state.player.damageMultiplier * state.player.abilityDamageMultiplier)
      );
    }
  },
  blackHole: (cost) => {
    if (!state.running || state.upgradePending || !consumeAbilityEnergy(cost)) return;
    const sid = state.player.shipId;
    const angle = Math.atan2(input.mouse.y - state.player.y, input.mouse.x - state.player.x);
    const distance = sid === "aphelion" ? 175 : 150;
    const holeX = state.player.x + Math.cos(angle) * distance;
    const holeY = state.player.y + Math.sin(angle) * distance;
    const c1 =
      sid === "aphelion" ? "#6ad4ff" : sid === "eclipse" ? "#b47cff" : sid === "seraph" ? "#ff6a9a" : "#9b7fff";
    const c2 =
      sid === "aphelion" ? "#3a6b9a" : sid === "eclipse" ? "#4a2080" : sid === "seraph" ? "#6a2040" : "#cfb7ff";
    for (let i = 0; i < 50; i++) {
      const t = i / 50;
      const x = state.player.x + (holeX - state.player.x) * t;
      const y = state.player.y + (holeY - state.player.y) * t;
      const p = new Particle(x, y, c1);
      p.vx = Math.cos(angle) * rng(-50, 50);
      p.vy = Math.sin(angle) * rng(-50, 50);
      state.particles.push(p);
    }
    state.blackHoles.push(new BlackHole(holeX, holeY));
    emitSpiralInwardParticles(holeX, holeY, c1, 5, 46, 145, 1.15, 0.58);
    emitSpiralInwardParticles(holeX, holeY, c2, 3, 38, 110, -1, 0.46);
  },
  shadowStep: (cost) => {
    if (!state.running || state.upgradePending || !consumeAbilityEnergy(cost)) return;
    const oldX = state.player.x;
    const oldY = state.player.y;
    abilityParticleBurst("#9b7fff", 100, 50);
    const angle = Math.atan2(input.mouse.y - state.player.y, input.mouse.x - state.player.x);
    state.player.x = clamp(state.player.x + Math.cos(angle) * 120, 20, config.width - 20);
    state.player.y = clamp(state.player.y + Math.sin(angle) * 120, 20, config.height - 20);
    abilityParticleBurst("#9b7fff", 100, 50);
    state.player.burstTimer = Math.min(state.player.burstTimer + 4, 8);
  },
  ethereal: (cost) => {
    if (!state.running || state.upgradePending || !consumeAbilityEnergy(cost)) return;
    abilityParticleBurst("#9b7fff", 180, 80);
    
    state.player.invincible = true;
    state.player.invincibleTimer = 10;
  },
  deathMark: (cost) => {
    if (!state.running || state.upgradePending || !consumeAbilityEnergy(cost)) return;
    abilityParticleBurst("#8b0000", 150, 70);
    
    let target = null;
    let minDist = Infinity;
    for (const enemy of state.enemies) {
      const d = dist(state.player.x, state.player.y, enemy.x, enemy.y);
      if (d < minDist && d < 400) {
        minDist = d;
        target = enemy;
      }
    }
    if (target) {
      
      target.deathMarked = true;
      target.deathMarkTimer = 8; 
      
      const angle = Math.atan2(target.y - state.player.y, target.x - state.player.x);
      for (let i = 0; i < 8; i++) {
        const spread = (i - 4) * 0.15;
        const bullet = new Bullet(state.player.x, state.player.y, angle + spread, 500 * state.player.shotSpeedMultiplier, true, 5, "#8b0000", 10 * state.player.damageMultiplier * state.player.abilityDamageMultiplier);
        bullet.tracking = true;
        bullet.trackingTarget = target;
        state.bullets.push(bullet);
      }
    }
  },
  soulHarvest: (cost) => {
    if (!state.running || state.upgradePending || !consumeAbilityEnergy(cost)) return;
    abilityParticleBurst("#8b0000", 120, 60);
    
    let nearbyEnemies = 0;
    for (const enemy of state.enemies) {
      const d = dist(state.player.x, state.player.y, enemy.x, enemy.y);
      if (d < 250) {
        nearbyEnemies++;
        
        for (let i = 0; i < 10; i++) {
          const t = i / 10;
          const x = state.player.x + (enemy.x - state.player.x) * t;
          const y = state.player.y + (enemy.y - state.player.y) * t;
          const p = new Particle(x, y, "#8b0000");
          p.vx = (state.player.x - enemy.x) * 0.1;
          p.vy = (state.player.y - enemy.y) * 0.1;
          p.life = 0.3;
          state.particles.push(p);
        }
      }
    }
    
    const energyRestore = Math.min(40 + nearbyEnemies * 5, 80);
    const shieldRestore = Math.min(20 + nearbyEnemies * 3, 50);
    state.player.energy = Math.min(state.player.energy + energyRestore, state.player.maxEnergy);
    state.player.shield = Math.min(state.player.shield + shieldRestore, state.player.maxShield);
  },
  supernova: (cost) => {
    if (!state.running || state.upgradePending || !consumeAbilityEnergy(cost)) return;
    const sid = state.player.shipId;
    if (sid === "seraph") {
      emitNovaShellParticles(state.player.x, state.player.y, "#ff62d8", "#ffd0ff", 8, 80);
      state.novaAnomalies.push(
        new NovaAnomaly(state.player.x, state.player.y, {
          maxRadius: 255,
          duration: 2.05,
          pullStrength: 300,
          damagePerSecond: 78 * state.player.damageMultiplier * state.player.abilityDamageMultiplier,
          pullEnabled: true,
          explodeAtEnd: true,
          explosionDamage: 235 * state.player.damageMultiplier * state.player.abilityDamageMultiplier,
          explosionKnockback: 210,
          knockbackRadius: 300,
          color: "#ff49c4",
          stunWhilePulled: true,
        })
      );
      return;
    }
    emitNovaShellParticles(state.player.x, state.player.y, "#ffb347", "#fff6d9", 8, 76);
    state.novaAnomalies.push(
      new NovaAnomaly(state.player.x, state.player.y, {
        maxRadius: 250,
        duration: 2.55,
        pullStrength: 265,
        damagePerSecond: 74 * state.player.damageMultiplier * state.player.abilityDamageMultiplier,
        pullEnabled: true,
        explodeAtEnd: true,
        explosionDamage: 228 * state.player.damageMultiplier * state.player.abilityDamageMultiplier,
        explosionKnockback: 180,
        knockbackRadius: 290,
        color: "#ff9a3c",
        stunWhilePulled: true,
      })
    );
  },
  azureCataclysm: (cost) => {
    if (!state.running || state.upgradePending || !consumeAbilityEnergy(cost)) return;
    emitNovaShellParticles(state.player.x, state.player.y, "#00f5ff", "#e0ffff", 11, 96);
    state.novaAnomalies.push(
      new NovaAnomaly(state.player.x, state.player.y, {
        maxRadius: 285,
        duration: 2.92,
        pullStrength: 305,
        damagePerSecond: 80 * state.player.damageMultiplier * state.player.abilityDamageMultiplier,
        pullEnabled: true,
        explodeAtEnd: true,
        explosionDamage: 248 * state.player.damageMultiplier * state.player.abilityDamageMultiplier,
        explosionKnockback: 495,
        knockbackRadius: 415,
        color: "#00e5ff",
        azureVortex: true,
        streamColors: ["#00ffff", "#4ddbff", "#b6ffff", "#00b8d4"],
        stunWhilePulled: true,
      })
    );
  },
  bluefallBarrage: (cost) => {
    if (!state.running || state.upgradePending || !consumeAbilityEnergy(cost)) return;
    abilityParticleBurst("#7aebff", 160, 85);
    const topY = 96;
    for (let p = 0; p < 5; p++) {
      const x = rng(110, config.width - 110);
      state.bluefallPortals.push(new BluefallPortal(x, topY, p * 0.52));
    }
  },
  novaSwarmDrones: (cost) => {
    if (!state.running || state.upgradePending || !consumeAbilityEnergy(cost)) return;
    abilityParticleBurst("#6ef8ff", 200, 95);
    for (let i = 0; i < 16; i++) {
      const orb = new NovaOrbiter((i / 16) * Math.PI * 2, 68);
      orb.tightOrbit = true;
      state.novaOrbiters.push(orb);
    }
  },
  starfall: (cost) => {
    if (!state.running || state.upgradePending || !consumeAbilityEnergy(cost)) return;
    const sid = state.player.shipId;
    const profiles = {
      helios: { burst: "#ffdca8", color: "#ffcc66", count: 48, yMin: 20, yMax: 220, spread: 50 },
      inferno: { burst: "#ff9a4d", color: "#ff5c2e", count: 58, yMin: 30, yMax: 280, spread: 62 },
      aphelion: { burst: "#b8fff4", color: "#7cf0ff", count: 52, yMin: 15, yMax: 200, spread: 36 },
      grimstar: { burst: "#c9a6ff", color: "#8b62ff", count: 50, yMin: 25, yMax: 250, spread: 55 },
    };
    const def = profiles[sid] || profiles.helios;
    abilityParticleBurst(def.burst, 150, 80);
    for (let i = 0; i < def.count; i++) {
      const spawnX = rng(35, config.width - 35);
      const spawnY = -rng(def.yMin, def.yMax);
      const targetX = spawnX + rng(-def.spread, def.spread);
      const targetY = rng(120, config.height - 80);
      const a = Math.atan2(targetY - spawnY, targetX - spawnX);
      const orb = new Bullet(
        spawnX,
        spawnY,
        a,
        rng(165, 265) * state.player.shotSpeedMultiplier,
        true,
        5,
        def.color,
        9.2 * state.player.damageMultiplier * state.player.abilityDamageMultiplier
      );
      orb.life = rng(2.2, 3.2);
      orb.novaBurst = true;
      orb.novaNoPull = true;
      orb.novaBurstRadius = sid === "grimstar" ? 88 : sid === "inferno" ? 98 : 92;
      orb.novaBurstDamage = (sid === "inferno" ? 86 : 78) * state.player.damageMultiplier * state.player.abilityDamageMultiplier;
      state.bullets.push(orb);
    }
  },
  voidRift: (cost) => {
    if (!state.running || state.upgradePending || !consumeAbilityEnergy(cost)) return;
    const angle = Math.atan2(input.mouse.y - state.player.y, input.mouse.x - state.player.x);
    const distance = 200;
    const riftX = state.player.x + Math.cos(angle) * distance;
    const riftY = state.player.y + Math.sin(angle) * distance;
    emitRiftShearParticles(riftX, riftY, "#4a0080", 18, 200);
    
    state.blackHoles.push(new BlackHole(riftX, riftY));
    
    const circle = new ExpandingCircle(riftX, riftY, 180, "#4a0080", 1.8, 100 * state.player.damageMultiplier * state.player.abilityDamageMultiplier, null, false);
    state.expandingCircles.push(circle);
    
    emitSpiralInwardParticles(riftX, riftY, "#7320b9", 2, 26, 90, 0.7, 0.38);
  },
  dimensionalSlash: (cost) => {
    if (!state.running || state.upgradePending || !consumeAbilityEnergy(cost)) return;
    abilityParticleBurst("#4a0080", 150, 70);
    const angle = Math.atan2(input.mouse.y - state.player.y, input.mouse.x - state.player.x);
    
    const slashWidth = 0.8; 
    const slashLength = 400;
    const slashCount = 20;
    for (let i = 0; i < slashCount; i++) {
      const t = i / slashCount;
      const spread = (t - 0.5) * slashWidth;
      const x = state.player.x + Math.cos(angle + spread) * slashLength * t;
      const y = state.player.y + Math.sin(angle + spread) * slashLength * t;
      
      for (let j = 0; j < 8; j++) {
        const p = new Particle(x, y, "#4a0080");
        p.vx = Math.cos(angle + spread) * rng(50, 150);
        p.vy = Math.sin(angle + spread) * rng(50, 150);
        p.life = 0.3;
        state.particles.push(p);
      }
      
      for (const enemy of state.enemies) {
        const d = dist(x, y, enemy.x, enemy.y);
        if (d < 40) {
          enemy.hp -= 25 * state.player.damageMultiplier * state.player.abilityDamageMultiplier;
          if (enemy.hp <= 0) {
            const index = state.enemies.indexOf(enemy);
            if (index > -1) onEnemyDestroyed(enemy, index);
          }
        }
      }
    }
    
    for (let i = 0; i < 12; i++) {
      const spread = (i - 6) * 0.12;
      state.bullets.push(
        new Bullet(state.player.x, state.player.y, angle + spread, 550 * state.player.shotSpeedMultiplier, true, 5, "#4a0080", 12 * state.player.damageMultiplier * state.player.abilityDamageMultiplier)
      );
    }
  },
};

const triggerAbility = (abilityType) => {
  const ability = state.player.abilities.find(a => a.type === abilityType);
  if (!ability) return;
  
  
  if (state.tutorialMode && !state.tutorialTestWave) {
    const abilityIndex = state.player.abilities.findIndex(a => a.type === abilityType);
    if (abilityIndex === 0 && !state.tutorialProgress.usedAbility1) {
      state.tutorialProgress.usedAbility1 = true;
      checkTutorialStepCompletion();
    } else if (abilityIndex === 1 && !state.tutorialProgress.usedAbility2) {
      state.tutorialProgress.usedAbility2 = true;
      checkTutorialStepCompletion();
    } else if (abilityIndex === 2 && !state.tutorialProgress.usedAbility3) {
      state.tutorialProgress.usedAbility3 = true;
      checkTutorialStepCompletion();
    }
  }
  
  const handler = abilityHandlers[abilityType];
  if (handler) {
    handler(ability.cost);
    playSfx.ability();
  }
};

const spawnStars = () => {
  state.stars = Array.from({ length: 160 }, () => ({
    x: Math.random() * config.width,
    y: Math.random() * config.height,
    speed: rng(10, 60),
    size: Math.random() * 2,
  }));
};

const spawnWave = () => {
  tone(300, 0.08, "sine", audio.sfxVolume * 0.12);
  const diff = difficultyModes[state.difficultyKey] || difficultyModes.veteran;
  state.enemyDamageMultiplier = state.mode === "campaign" ? 1 + state.campaignLevel * 0.05 : 1;
  
  state.maxEnemiesOnScreen = Math.floor(15 + state.wave * 0.5);
  
  state.enemies.length = 0;
  state.enemyBullets = [];
  state.bullets = [];
  
  state.drones = [];
  state.barriers = [];
  state.blackHoles = [];
  state.expandingCircles = [];
  state.timeDilationFields = [];
  state.novaAnomalies = [];
  state.novaOrbiters = [];
  state.bluefallPortals = [];
  state.boss = null;
  state.waveAnnouncementTimer = 2.5;
  state.awaitingUpgrade = false;
  state.waveComplete = false;
  state.enemiesToSpawn = [];
  state.spawnTimer = 0;
  state.currentSegmentEnemies = 0;
  state.segmentsSpawned = 0;
  bossBar.classList.add("hidden");
  bossBar.style.display = "none";
  const types = ["swarm", "shooter", "charger", "defender", "dart", "orbiter", "splitter"];
  const isCampaignBossWave = state.mode === "campaign" && state.wave === state.campaignWaveTarget && state.campaignLevel % 5 === 0;
  const isBossWave = state.mode === "campaign" ? isCampaignBossWave : state.wave % 5 === 0;
  if (isBossWave) {
    
    const bossTypes = ["titan", "sniper", "swarmlord", "vortex"];
    let bossType = bossTypes[Math.floor(Math.random() * bossTypes.length)];
    if (bossType === state.lastBossType && bossTypes.length > 1) {
      
      const available = bossTypes.filter(t => t !== state.lastBossType);
      bossType = available[Math.floor(Math.random() * available.length)];
    }
    state.lastBossType = bossType;
    const boss = new Enemy("boss", config.width / 2, TOP_HUD_SAFE_Y + 28, state.wave, bossType);
    applyDifficultyToEnemy(boss, diff, true);
    state.enemies.push(boss);
    state.boss = boss;
    bossBar.classList.remove("hidden");
    bossBar.style.display = "flex";
    bossBarFill.style.height = "100%";
    state.waveComplete = true; 
    state.totalEnemiesThisWave = 1; 
    state.maxSegmentsThisWave = 1;
  } else {
    
    const availableTypes = state.wave < 3 ? ["swarm", "shooter", "charger"] :
                          state.wave < 6 ? ["swarm", "shooter", "charger", "defender", "dart"] :
                          types;
    
    
    
    const waveIndex = Math.max(0, state.wave - 1);
    let baseEnemyCount;
    let waveMultiplier;
    let waveRampBonus;
    if (state.difficultyKey === "recruit") {
      baseEnemyCount = 4;
      waveMultiplier = 3;
      waveRampBonus = 0.7;
    } else if (state.difficultyKey === "nightmare") {
      baseEnemyCount = 15;
      waveMultiplier = 6.5;
      waveRampBonus = 1.15;
    } else {
      baseEnemyCount = 10;
      waveMultiplier = 4.8;
      waveRampBonus = 0.95;
    }
    const enemyCount =
      baseEnemyCount +
      Math.floor(waveIndex * waveMultiplier + (waveIndex * waveIndex) * waveRampBonus * 0.08);
    const campaignCountMult = state.mode === "campaign" ? 1 + state.campaignLevel * 0.05 : 1;
    const randomVariation = Math.floor(rng(-2, 3));
    const totalEnemies = Math.max(1, Math.floor((enemyCount + randomVariation) * diff.enemyCount * campaignCountMult));
    state.totalEnemiesThisWave = totalEnemies;
    
    
    
    const baseMaxPerSegment = state.difficultyKey === "nightmare" ? 20 :
                              state.difficultyKey === "veteran" ? 15 : 10;
    const maxEnemiesPerSegment = baseMaxPerSegment + Math.floor(state.wave * 0.3);
    
    
    state.maxSegmentsThisWave = Math.ceil(totalEnemies / maxEnemiesPerSegment);
    
    
    let enemiesRemaining = totalEnemies;
    for (let segmentNum = 1; segmentNum <= state.maxSegmentsThisWave; segmentNum++) {
      
      const isLastSegment = segmentNum === state.maxSegmentsThisWave;
      const enemiesInSegment = isLastSegment ? enemiesRemaining : Math.min(maxEnemiesPerSegment, enemiesRemaining);
      
      
      for (let i = 0; i < enemiesInSegment; i++) {
        const kind = availableTypes[Math.floor(Math.random() * availableTypes.length)];
        state.enemiesToSpawn.push({
          kind: kind,
          x: rng(60, config.width - 60),
          y: TOP_HUD_SAFE_Y + 4, 
          wave: state.wave,
          diff: diff,
          segment: segmentNum
        });
      }
      
      enemiesRemaining -= enemiesInSegment;
      if (enemiesRemaining <= 0) break;
    }
    
    
    state.spawnTimer = 0.3; 
    state.segmentsSpawned = 0; 
  }
};

const applyDifficultyToEnemy = (enemy, diff, isBoss) => {
  const campaignScalar = state.mode === "campaign" ? 1 + state.campaignLevel * 0.06 : 1;
  if (isBoss) {
    enemy.hp *= (diff.bossHpMultiplier || 1) * campaignScalar;
    enemy.maxHp = enemy.hp;
  } else {
    enemy.hp *= diff.enemyHp * campaignScalar;
    enemy.maxHp = enemy.hp;
  }
  enemy.speed *= diff.enemySpeed * (state.mode === "campaign" ? 1 + state.campaignLevel * 0.01 : 1);
  enemy.fireTimer *= (isBoss ? 2.4 : 1) / diff.enemySpeed;
};

const updateBossBar = () => {
  if (state.boss && state.boss.hp > 0) {
    bossBar.classList.remove("hidden");
    bossBar.style.display = "flex";
    const pct = clamp(state.boss.hp / state.boss.maxHp, 0, 1);
    bossBarFill.style.height = `${pct * 100}%`;
  } else {
    bossBar.classList.add("hidden");
    bossBar.style.display = "none";
  }
};

const tutorialSteps = [
  {
    title: "Welcome to Orbital Barrage!",
    text: "This tutorial will teach you the basics. Let's start with movement.",
    checkComplete: () => true,
    waitForManualAdvance: true,
  },
  {
    title: "Movement",
    text: "Use <kbd>WASD</kbd> or <kbd>Arrow Keys</kbd> to move your ship. Try moving around!",
    checkComplete: () => state.tutorialProgress.moved,
  },
  {
    title: "Aiming and Shooting",
    text: "Aim with your <kbd>Mouse</kbd> and your ship will automatically fire bullets. Try moving your mouse around to aim!",
    checkComplete: () => state.tutorialProgress.shot,
    waitForManualAdvance: true,
  },
  {
    title: "Ability 1",
    text: "Use your first ability (default <kbd>1</kbd>).",
    checkComplete: () => state.tutorialProgress.usedAbility1,
  },
  {
    title: "Ability 2",
    text: "Use your second ability (default <kbd>2</kbd>).",
    checkComplete: () => state.tutorialProgress.usedAbility2,
  },
  {
    title: "Ability 3",
    text: "Use your third ability (default <kbd>3</kbd>).",
    checkComplete: () => state.tutorialProgress.usedAbility3,
  },
  {
    title: "HUD Elements",
    text: "Watch your <strong>HP</strong> (health), <strong>Shield</strong> (regenerates), and <strong>Energy</strong> (for abilities). The ability icons on the left show when abilities are ready.",
    checkComplete: () => true,
    waitForManualAdvance: true,
  },
  {
    title: "Test Wave",
    text: "Now let's test your skills! A wave of enemies will spawn. Clear them to complete the tutorial.",
    checkComplete: () => false, 
  },
];

const startTutorial = () => {
  state.tutorialMode = true;
  state.tutorialStep = 0;
  state.tutorialStepStartTime = performance.now();
  state.tutorialProgress = {
    moved: false,
    shot: false,
    usedAbility1: false,
    usedAbility2: false,
    usedAbility3: false,
  };
  
  
  if (!hasShipAccess(state.shipKey)) {
    state.shipKey = "striker";
  }
  const loadout = shipLoadouts[state.shipKey] || shipLoadouts.striker;
  state.player = new Player(loadout);
  state.player.energy = 1000; 
  state.player.maxEnergy = 1000; 
  state.bullets = [];
  state.enemyBullets = [];
  state.enemies = [];
  state.particles = [];
  state.visualBeams = [];
  state.powerUps = [];
  state.drones = [];
  state.barriers = [];
  state.blackHoles = [];
  state.expandingCircles = [];
  state.timeDilationFields = [];
  state.novaAnomalies = [];
  state.novaOrbiters = [];
  state.bluefallPortals = [];
  state.wave = 1;
  state.score = 0;
  state.quantumCoresEarnedThisRun = 0;
  state.lastBossType = null;
  state.running = true;
  state.paused = false;
  state.boss = null;
  state.upgradePending = false;
  state.awaitingUpgrade = false;
  state.upgradeChoices = [];
  state.waveAnnouncementTimer = 0;
  
  
  tutorialSteps.forEach(step => {
    step.completed = false;
    step.pendingComplete = false;
    if (step.completionTimer) {
      clearTimeout(step.completionTimer);
      step.completionTimer = null;
    }
  });
  
  spawnStars();
  updateHud();
  if (mainHub) mainHub.classList.add("hidden");
  instructionsEl.classList.add("hidden");
  if (instructionsPanel) instructionsPanel.classList.add("hidden");
  if (campaignPanel) campaignPanel.classList.add("hidden");
  if (achievementsPanel) achievementsPanel.classList.add("hidden");
  if (shipShopPanel) shipShopPanel.classList.add("hidden");
  if (settingsPanel) settingsPanel.classList.add("hidden");
  if (termsPanel) termsPanel.classList.add("hidden");
  tutorialOverlay.classList.remove("hidden");
  bossBar.classList.add("hidden");
  bossBar.style.display = "none";
  upgradePanel.classList.add("hidden");
  if (hudSettingsButton) hudSettingsButton.classList.remove("hidden");
  if (abilityIcons) abilityIcons.classList.remove("hidden");
  
  updateTutorialDisplay();
  state.lastTime = performance.now();
  requestAnimationFrame(gameLoop);
};

const checkTutorialStepCompletion = () => {
  if (!state.tutorialMode || state.tutorialTestWave) return;
  
  const step = tutorialSteps[state.tutorialStep];
  if (!step) return;

  if (step.checkComplete() && !step.completed && !step.pendingComplete) {
    step.pendingComplete = true;
    step.completionTimer = setTimeout(() => {
      if (!state.tutorialMode || state.tutorialTestWave || tutorialSteps[state.tutorialStep] !== step) {
        return;
      }
      step.pendingComplete = false;
      step.completed = true;
      updateTutorialDisplay();
      if (!step.waitForManualAdvance) {
        setTimeout(() => {
          if (state.tutorialMode && !state.tutorialTestWave && tutorialSteps[state.tutorialStep] === step) {
            advanceTutorialStep();
          }
        }, 250);
      }
    }, 1000);
  } else {
    updateTutorialDisplay();
  }
};

const advanceTutorialStep = () => {
  if (state.tutorialStep < tutorialSteps.length - 1) {
    state.tutorialStep++;
    
    state.tutorialStepStartTime = performance.now();
    
    if (tutorialSteps[state.tutorialStep]) {
      tutorialSteps[state.tutorialStep].completed = false;
      tutorialSteps[state.tutorialStep].pendingComplete = false;
      if (tutorialSteps[state.tutorialStep].completionTimer) {
        clearTimeout(tutorialSteps[state.tutorialStep].completionTimer);
        tutorialSteps[state.tutorialStep].completionTimer = null;
      }
    }
    updateTutorialDisplay();
    
    if (state.tutorialStep === tutorialSteps.length - 1) {
      
      setTimeout(() => {
        if (state.tutorialMode) {
          startTutorialTestWave();
        }
      }, 2000);
    }
  }
};

const updateTutorialDisplay = () => {
  if (!state.tutorialMode) return;
  
  
  if (state.tutorialTestWave) {
    if (tutorialOverlay) tutorialOverlay.classList.add("hidden");
    if (tutorialTextTop) tutorialTextTop.classList.add("hidden");
    return;
  }
  
  const step = tutorialSteps[state.tutorialStep];
  if (!step) {
    startTutorialTestWave();
    return;
  }
  
  
  if (tutorialOverlay) tutorialOverlay.classList.remove("hidden");
  if (tutorialTextTop) tutorialTextTop.classList.remove("hidden");
  
  
  if (tutorialTextTopContent) {
    let text = step.text;
    
    text = text.replace(/<kbd>([^<]*)<\/kbd>/g, '[$1]');
    text = text.replace(/<strong>([^<]*)<\/strong>/g, '$1');
    
    text = text.replace(/<[^>]*>/g, '');
    const completePrefix = step.completed ? "✓ " : "";
    tutorialTextTopContent.textContent = `${completePrefix}${step.title}: ${text}`;
  }
  if (tutorialNextStepButton) {
    const showNext = !!step.completed && !!step.waitForManualAdvance;
    tutorialNextStepButton.classList.toggle("hidden", !showNext);
  }
  if (tutorialTextTop) {
    tutorialTextTop.classList.toggle("completed", !!step.completed);
  }
};

const startTutorialTestWave = () => {
  state.tutorialTestWave = true;
  tutorialOverlay.classList.add("hidden");
  
  
  state.difficultyKey = "recruit";
  state.wave = 1;
  state.waveComplete = false;
  state.enemiesToSpawn = [];
  state.spawnTimer = 0;
  state.segmentsSpawned = 0;
  state.currentSegmentEnemies = 0;
  
  spawnWave();
};

const endTutorial = () => {
  state.tutorialMode = false;
  state.tutorialTestWave = false;
  if (tutorialOverlay) tutorialOverlay.classList.add("hidden");
  if (tutorialNextStepButton) tutorialNextStepButton.classList.add("hidden");
  if (mainHub) mainHub.classList.remove("hidden");
  instructionsEl.classList.add("hidden");
  if (instructionsPanel) instructionsPanel.classList.add("hidden");
  if (campaignPanel) campaignPanel.classList.add("hidden");
  if (achievementsPanel) achievementsPanel.classList.add("hidden");
  state.running = false;
  if (hudSettingsButton) hudSettingsButton.classList.add("hidden");
  if (abilityIcons) abilityIcons.classList.add("hidden");
  updateHud(); 
  
  
  clearCanvas();
  
  
  if (state.player) {
    const loadout = shipLoadouts[state.shipKey] || shipLoadouts.striker;
    state.player.maxEnergy = loadout.maxEnergy;
    state.player.energy = Math.min(state.player.energy, state.player.maxEnergy);
  }
};

const resetGame = () => {
  if (!hasShipAccess(state.shipKey)) {
    state.shipKey = "striker";
  }
  if (state.tempAllShipsTrial) {
    state.tempAllShipsTrial = false;
    state.tempTrialRunActive = true;
  }
  const loadout = shipLoadouts[state.shipKey] || shipLoadouts.striker;
  state.player = new Player(loadout);
  state.bullets = [];
  state.enemyBullets = [];
  state.enemies = [];
  state.particles = [];
  state.visualBeams = [];
  state.powerUps = [];
  state.drones = [];
  state.barriers = [];
  state.blackHoles = [];
  state.expandingCircles = [];
  state.timeDilationFields = [];
  state.novaAnomalies = [];
  state.novaOrbiters = [];
  state.bluefallPortals = [];
  state.wave = 1;
  state.score = 0;
  state.quantumCoresEarnedThisRun = 0;
  state.lastBossType = null;
  state.running = true;
  state.paused = false;
  state.boss = null;
  state.upgradePending = false;
  state.awaitingUpgrade = false;
  state.upgradeChoices = [];
  state.waveAnnouncementTimer = 0;
  spawnStars();
  spawnWave();
  updateHud();
  bossBar.classList.add("hidden");
  bossBar.style.display = "none";
  upgradePanel.classList.add("hidden");
  if (hudSettingsButton) hudSettingsButton.classList.remove("hidden");
  if (abilityIcons) abilityIcons.classList.remove("hidden");
  state.lastTime = performance.now();
  requestAnimationFrame(gameLoop);
};

const getAbilityIcon = (abilityType) => {
  const iconMap = {
    burst: "💥",
    rapidVolley: "⚡",
    energySurge: "🔋",
    shockwave: "🌊",
    shieldOvercharge: "🛡️",
    fortify: "💎",
    blink: "✨",
    ghostfire: "👻",
    phaseShift: "🌀",
    lightningStorm: "⚡",
    combatDrone: "🤖",
    overload: "🔥",
    siegeCannon: "💣",
    energyBarrier: "🔷",
    rampage: "⚔️",
    blackHole: "🕳️",
    shadowStep: "🌑",
    ethereal: "👁️",
    deathMark: "💀",
    soulHarvest: "⚰️",
    supernova: "⭐",
    azureCataclysm: "🌊",
    bluefallBarrage: "🌀",
    novaSwarmDrones: "✦",
    starfall: "✨",
    voidRift: "🌀",
    dimensionalSlash: "⚔️",
  };
  return iconMap[abilityType] || "⭐";
};

const getKeyDisplay = (binding) => {
  const keyNames = {
    "1": "1", "2": "2", "3": "3",
    "lm": "LM", "mm": "MM", "rm": "RM"
  };
  return keyNames[binding] || binding.toUpperCase();
};

const updateAbilityIcons = () => {
  if (!abilityIcons || !state.player || !state.player.abilities) {
    if (abilityIcons) abilityIcons.classList.add("hidden");
    return;
  }
  
  
  if (!state.running || state.upgradePending) {
    abilityIcons.classList.add("hidden");
    return;
  }
  
  const abilities = state.player.abilities;
  const currentEnergy = state.player.energy;
  
  
  abilityIcons.innerHTML = "";
  
  
  abilities.forEach((ability, index) => {
    const binding = state.abilityKeys && state.abilityKeys[index] ? state.abilityKeys[index] : ability.key;
    const keyDisplay = getKeyDisplay(binding);
    const isReady = currentEnergy >= ability.cost;
    const energyPercent = Math.min((currentEnergy / ability.cost) * 100, 100);
    
    const iconDiv = document.createElement("div");
    iconDiv.className = `ability-icon ${isReady ? "ready" : "not-ready"}`;
    iconDiv.innerHTML = `
      <div class="ability-icon__symbol">${getAbilityIcon(ability.type)}</div>
      <div class="ability-icon__key">${keyDisplay}</div>
      <div class="ability-icon__energy-bar">
        <div class="ability-icon__energy-fill" style="width: ${energyPercent}%"></div>
      </div>
    `;
    
    abilityIcons.appendChild(iconDiv);
  });
  
  
  abilityIcons.classList.remove("hidden");
};

const updateHud = () => {
  
  const hudElement = document.querySelector('.hud');
  if (state.running) {
    if (hudElement) hudElement.classList.remove("hidden");
    
    if (quantumCoresDisplay) quantumCoresDisplay.classList.add("hidden");
  } else {
    if (hudElement) hudElement.classList.add("hidden");
    
    const isStartScreenVisible =
      (instructionsEl && !instructionsEl.classList.contains("hidden")) ||
      (mainHub && !mainHub.classList.contains("hidden")) ||
      (instructionsPanel && !instructionsPanel.classList.contains("hidden")) ||
      (campaignPanel && !campaignPanel.classList.contains("hidden"));
    if (quantumCoresDisplay) {
      if (isStartScreenVisible) {
        quantumCoresDisplay.classList.remove("hidden");
      } else {
        quantumCoresDisplay.classList.add("hidden");
      }
    }
  }
  
  
  if (quantumCoresDisplayValue) {
    quantumCoresDisplayValue.textContent = state.quantumCores;
  }
  
  if (!state.running) return;
  
  const p = state.player;
  const hpPct = p.maxHp > 0 ? (p.hp / p.maxHp) * 100 : 0;
  const shieldPct = p.maxShield > 0 ? (p.shield / p.maxShield) * 100 : 0;
  const energyPct = p.maxEnergy > 0 ? (p.energy / p.maxEnergy) * 100 : 0;
  hud.hp.textContent = `${Math.round(p.hp)}/${p.maxHp}`;
  hud.shield.textContent = `${Math.round(p.shield)}/${p.maxShield}`;
  hud.energy.textContent = `${Math.round(p.energy)}/${p.maxEnergy}`;
  if (hud.hpBarFill) hud.hpBarFill.style.width = `${clamp(hpPct, 0, 100)}%`;
  if (hud.shieldBarFill) hud.shieldBarFill.style.width = `${clamp(shieldPct, 0, 100)}%`;
  if (hud.energyBarFill) hud.energyBarFill.style.width = `${clamp(energyPct, 0, 100)}%`;
  hud.score.textContent = state.score;
  hud.wave.textContent = state.wave;
  hud.highScore.textContent = state.highScore;
  if (state.wave >= 10) unlockAchievement("wave-10");
  if (state.wave >= 25) unlockAchievement("wave-25");
  if (state.score >= 10000) unlockAchievement("score-10k");
  if (state.score >= 50000) unlockAchievement("score-50k");
  if (hud.quantumCores) {
    hud.quantumCores.textContent = state.quantumCores;
  }
  updateAbilityIcons();
};

const handleCollisions = (dt) => {
  for (let i = state.enemies.length - 1; i >= 0; i--) {
    const enemy = state.enemies[i];
    for (let j = state.bullets.length - 1; j >= 0; j--) {
      const bullet = state.bullets[j];
      if (
        bullet.friendly &&
        dist(enemy.x, enemy.y, bullet.x, bullet.y) < enemy.size + bullet.size
      ) {
        enemy.hp -= bullet.damage;
        if (bullet.freezeFactor) {
          enemy.fireTimer += 0.25 + bullet.freezeFactor * 0.4;
          enemy.hp -= bullet.damage * 0.15;
          for (let p = 0; p < 8; p++) {
            state.particles.push(new Particle(enemy.x + rng(-8, 8), enemy.y + rng(-8, 8), "#8be7ff"));
          }
        }
        if (bullet.burnDamage) {
          enemy.hp -= bullet.burnDamage;
          for (let p = 0; p < 8; p++) {
            state.particles.push(new Particle(enemy.x + rng(-8, 8), enemy.y + rng(-8, 8), "#ff8f2a"));
          }
        }
        if (bullet.knockback) {
          const impactAngle = Math.atan2(enemy.y - state.player.y, enemy.x - state.player.x);
          enemy.x += Math.cos(impactAngle) * bullet.knockback * 0.15;
          enemy.y += Math.sin(impactAngle) * bullet.knockback * 0.15;
        }
        if (bullet.novaAzureMini) {
          state.novaAnomalies.push(
            new NovaAnomaly(bullet.x, bullet.y, {
              maxRadius: 76,
              duration: 0.88,
              pullStrength: 195,
              damagePerSecond: 36 * state.player.damageMultiplier * state.player.abilityDamageMultiplier,
              pullEnabled: true,
              explodeAtEnd: true,
              explosionDamage: 48 * state.player.damageMultiplier * state.player.abilityDamageMultiplier,
              explosionKnockback: 115,
              knockbackRadius: 125,
              color: "#56f0ff",
              azureVortex: true,
              streamColors: ["#00ffff", "#7aebff", "#b6ffff"],
              stunWhilePulled: true,
            })
          );
        } else if (bullet.novaMini) {
          state.novaAnomalies.push(
            new NovaAnomaly(bullet.x, bullet.y, {
              maxRadius: 90,
              duration: 1.1,
              pullStrength: 180,
              damagePerSecond: 40 * state.player.damageMultiplier,
              pullEnabled: true,
              explodeAtEnd: false,
              color: "#62bfff",
              stunWhilePulled: true,
            })
          );
        }
        if (bullet.novaBurst) {
          state.novaAnomalies.push(
            new NovaAnomaly(bullet.x, bullet.y, {
              maxRadius: bullet.novaBurstRadius || 90,
              duration: 0.85,
              pullStrength: bullet.novaNoPull ? 0 : 160,
              damagePerSecond: bullet.novaBurstDamage || 65,
              pullEnabled: !bullet.novaNoPull,
              explodeAtEnd: false,
              color: "#7cc9ff",
              stunWhilePulled: !bullet.novaNoPull,
            })
          );
        }
        if (bullet.piercing && bullet.pierceCount && bullet.pierceCount > 0) {
          bullet.pierceCount -= 1;
        } else {
          state.bullets.splice(j, 1);
        }
        state.particles.push(new Particle(bullet.x, bullet.y, "#f5f285"));
        if (enemy.hp <= 0) {
          onEnemyDestroyed(enemy, i);
        }
        break;
      }
    }
  }

  
  const shieldRadius = state.player.getShieldRadius();
  for (let i = state.enemyBullets.length - 1; i >= 0; i--) {
    const bullet = state.enemyBullets[i];
    const distToPlayer = dist(bullet.x, bullet.y, state.player.x, state.player.y);
    
    
    if (distToPlayer < shieldRadius + bullet.size && state.player.shield > 0 && !state.player.invincible) {
      state.enemyBullets.splice(i, 1);
      
      const drainAmount = state.player.fortifyActive 
        ? bullet.damage * 0.1  
        : bullet.damage;        
      
      const shieldAbsorb = Math.min(state.player.shield, drainAmount);
      state.player.shield = Math.max(0, state.player.shield - shieldAbsorb);
      const remainingDamage = drainAmount - shieldAbsorb;
      if (remainingDamage > 0) {
        state.player.hp = Math.max(0, state.player.hp - remainingDamage);
        if (state.player.hp <= 0) endGame();
      }
      
      for (let j = 0; j < 5; j++) {
        state.particles.push(new Particle(bullet.x, bullet.y, state.player.shieldColorOverride || "#74ffce"));
      }
      continue;
    }
    
    
    if (distToPlayer < bullet.size + 16) {
      
      if (state.player.invincible) {
        
        continue;
      }
      
      
      if (bullet.explosive) {
        
        const circle = new ExpandingCircle(bullet.x, bullet.y, 80, 0.8, "#ff8800", 8);
        circle.followPlayer = false;
        state.expandingCircles.push(circle);
        
        for (let j = 0; j < 20; j++) {
          state.particles.push(new Particle(bullet.x, bullet.y, "#ff8800"));
        }
        state.enemyBullets.splice(i, 1);
        continue;
      }
      
      
      if (bullet.piercing) {
        absorbDamage(bullet.damage);
        
        continue;
      }
      
      
      state.enemyBullets.splice(i, 1);
      absorbDamage(bullet.damage);
    }
  }

  
  for (let i = state.enemies.length - 1; i >= 0; i--) {
    const enemy = state.enemies[i];
    const distToPlayer = dist(enemy.x, enemy.y, state.player.x, state.player.y);
    const pushbackRadius = shieldRadius + enemy.size;
    
    
    if (distToPlayer < pushbackRadius && state.player.shield > 0 && !state.player.invincible) {
      
      const angle = Math.atan2(enemy.y - state.player.y, enemy.x - state.player.x);
      const pushSpeed = 180; 
      const pushDistance = pushSpeed * dt; 
      enemy.x += Math.cos(angle) * pushDistance;
      enemy.y += Math.sin(angle) * pushDistance;
      
      
      enemy.x = clamp(enemy.x, enemy.size, config.width - enemy.size);
      enemy.y = clamp(enemy.y, enemy.size, config.height - enemy.size);
      
      
      
      const baseDrain = (enemy.size / 20) * 30 * dt; 
      const shieldDrain = state.player.fortifyActive 
        ? baseDrain * 0.5  
        : baseDrain;        
      state.player.shield = Math.max(0, state.player.shield - shieldDrain);
      
      
      if (Math.random() < 0.3) {
        state.particles.push(new Particle(enemy.x, enemy.y, state.player.shieldColorOverride || "#74ffce"));
      }
    }
    
    
    if (distToPlayer < enemy.size + 20) {
      
      if (!state.player.invincible) {
        absorbDamage(25);
      }
      state.enemies.splice(i, 1);
    }
  }

  for (let i = state.powerUps.length - 1; i >= 0; i--) {
    const power = state.powerUps[i];
    if (dist(power.x, power.y, state.player.x, state.player.y) < power.size + 20) {
      applyPowerUp(power.kind);
      state.powerUps.splice(i, 1);
    }
  }
};

const absorbDamage = (amount) => {
  const p = state.player;
  playSfx.hitPlayer();
  
  if (p.infiniteShield) {
    state.particles.push(new Particle(p.x, p.y, p.shieldColorOverride || "#74ffce"));
    return;
  }
  
  const shieldAbsorb = Math.min(p.shield, amount);
  p.shield = Math.max(0, p.shield - shieldAbsorb);
  const remainingDamage = amount - shieldAbsorb;
  if (remainingDamage > 0) {
    p.hp = Math.max(0, p.hp - remainingDamage);
  }
  state.particles.push(new Particle(p.x, p.y, "#74ffce"));
  if (p.hp <= 0) endGame();
};

const applyPowerUp = (kind) => {
  const p = state.player;
  playSfx.powerUp();
  if (kind === "heal") {
    p.hp = p.maxHp;
    p.shield = Math.min(p.maxShield, p.shield + 60);
    addEnergy(20);
  }
  if (kind === "shield") {
    p.shield = Math.min(p.maxShield, p.shield + 50);
  }
  if (kind === "rapid") {
    p.rapidTimer = Math.min(p.rapidTimer + 6, 10);
  }
  if (kind === "burst") {
    p.burstTimer = Math.min(p.burstTimer + 5.5, 9);
  }
};

const updateEntities = (dt) => {
  state.player.update(dt);
  
  state.player.shoot(state.bullets);
  state.bullets = state.bullets.filter((b) => {
    b.update(dt);
    const alive = b.life > 0 && b.x >= -20 && b.x <= config.width + 20 && b.y >= -20 && b.y <= config.height + 20;
    if (!alive && b.novaBurst) {
      state.novaAnomalies.push(
        new NovaAnomaly(b.x, b.y, {
          maxRadius: b.novaBurstRadius || 90,
          duration: 0.85,
          pullStrength: b.novaNoPull ? 0 : 160,
          damagePerSecond: b.novaBurstDamage || 65,
          pullEnabled: !b.novaNoPull,
          explodeAtEnd: false,
          color: "#7cc9ff",
          stunWhilePulled: !b.novaNoPull,
        })
      );
      for (let i = 0; i < 30; i++) state.particles.push(new Particle(b.x, b.y, "#8ad7ff"));
    }
    return alive;
  });

  
  state.drones = state.drones.filter((drone) => {
    drone.update(dt, state.player);
    return drone.life > 0;
  });

  
  state.barriers = state.barriers.filter((barrier) => {
    barrier.update(dt);
    return barrier.life > 0;
  });

  
  state.blackHoles = state.blackHoles.filter((hole) => {
    hole.update(dt);
    return hole.life > 0;
  });

  
  state.expandingCircles = state.expandingCircles.filter((circle) => {
    circle.update(dt);
    return circle.life > 0;
  });

  
  
  state.timeDilationFields.forEach((field) => {
    const wasExpiring = field.life <= 0;
    field.update(dt);
    const isExpiring = field.life <= 0;
    
    
    if (isExpiring && !wasExpiring) {
      
      for (let i = 0; i < state.enemyBullets.length; i++) {
        const bullet = state.enemyBullets[i];
        if (bullet.originalSpeed) {
          const currentSpeed = Math.hypot(bullet.vx, bullet.vy);
          if (currentSpeed > 0 && currentSpeed < bullet.originalSpeed) {
            const speedRatio = bullet.originalSpeed / currentSpeed;
            bullet.vx *= speedRatio;
            bullet.vy *= speedRatio;
          }
          bullet.originalSpeed = null;
        }
      }
      
      for (let i = 0; i < state.enemies.length; i++) {
        const enemy = state.enemies[i];
        if (enemy.originalSpeed) {
          enemy.speed = enemy.originalSpeed;
          enemy.originalSpeed = null;
        }
      }
    }
  });
  
  state.timeDilationFields = state.timeDilationFields.filter((field) => field.life > 0);

  state.enemyBullets = state.enemyBullets.filter((b) => {
    b.update(dt);
    if (b.owner === "boss" || b.owner === "shooter") {
      return b.life > 0;
    }
    return (
      b.life > 0 &&
      b.x >= -30 &&
      b.x <= config.width + 30 &&
      b.y >= -30 &&
      b.y <= config.height + 30
    );
  });

  
  
  if (!state.tutorialMode || state.tutorialTestWave) {
    
    
    if (state.enemies.length <= 2 && state.enemiesToSpawn.length > 0 && !state.waveComplete && state.spawnTimer <= 0) {
      
      const nextSegment = state.enemiesToSpawn[0].segment;
      
      
      const currentSegmentEnemies = state.enemiesToSpawn.filter(e => e.segment === nextSegment).length;
      if (currentSegmentEnemies > 0) {
        
        state.spawnTimer = 1.0 + state.wave * 0.05;
        state.currentSegmentEnemies = 0; 
        state.segmentsSpawned = nextSegment - 1; 
      }
    }
  
    
    if (state.enemiesToSpawn.length > 0 && !state.waveComplete) {
      state.spawnTimer -= dt;
      if (state.spawnTimer <= 0) {
        
        const currentSegment = state.enemiesToSpawn[0].segment;
        
        
        const availableSlots = state.maxEnemiesOnScreen - state.enemies.length;
        if (availableSlots > 0) {
          
          let batchCount = 0;
          const enemiesToRemove = [];
          for (let i = 0; i < state.enemiesToSpawn.length && batchCount < availableSlots; i++) {
            if (state.enemiesToSpawn[i].segment === currentSegment) {
              const enemyData = state.enemiesToSpawn[i];
              const enemy = new Enemy(
                enemyData.kind,
                enemyData.x,
                enemyData.y,
                enemyData.wave
              );
              applyDifficultyToEnemy(enemy, enemyData.diff, false);
              state.enemies.push(enemy);
              state.currentSegmentEnemies++;
              enemiesToRemove.push(i);
              batchCount++;
            }
          }
          
          
          for (let i = enemiesToRemove.length - 1; i >= 0; i--) {
            state.enemiesToSpawn.splice(enemiesToRemove[i], 1);
          }
          
          
          const remainingInSegment = state.enemiesToSpawn.filter(e => e.segment === currentSegment).length;
          if (remainingInSegment > 0) {
            
            state.spawnTimer = 0.3;
          } else {
            
            state.spawnTimer = 0;
            state.segmentsSpawned = currentSegment; 
          }
        } else {
          
          state.spawnTimer = 0.5;
        }
      }
    }
  
    
    
    if (state.enemiesToSpawn.length === 0 && state.enemies.length === 0 && !state.waveComplete) {
      
      if (state.segmentsSpawned >= state.maxSegmentsThisWave) {
        state.waveComplete = true;
      }
    }
  }

  
  if (!state.tutorialMode || state.tutorialTestWave) {
    state.enemies.forEach((enemy) => enemy.update(dt, state.player, state.enemyBullets));
  }
  state.powerUps = state.powerUps.filter((p) => {
    p.update(dt);
    return p.life > 0;
  });
  state.particles = state.particles.filter((particle) => {
    particle.update(dt);
    return particle.life > 0;
  });
  state.novaAnomalies = state.novaAnomalies.filter((anomaly) => {
    anomaly.update(dt);
    return anomaly.life > 0 || (anomaly.explodeAtEnd && !anomaly.exploded);
  });
  state.novaOrbiters = state.novaOrbiters.filter((orb) => {
    orb.update(dt);
    return orb.life > 0;
  });
  state.bluefallPortals = state.bluefallPortals.filter((portal) => !portal.update(dt));
  state.visualBeams = state.visualBeams.filter((beam) => {
    beam.life -= dt;
    beam.phase += dt * 10;
    return beam.life > 0;
  });
  handleCollisions(dt);

  
  if (state.tutorialMode && state.tutorialTestWave) {
    if (state.enemies.length === 0 && state.waveComplete) {
      endTutorial();
      return;
    }
  }
  
  
  if (!state.tutorialMode || state.tutorialTestWave) {
    if (
      state.running &&
      state.enemies.length === 0 &&
      state.waveComplete &&
      !state.upgradePending &&
      !state.awaitingUpgrade &&
      !state.tutorialTestWave
    ) {
      state.awaitingUpgrade = true;
      openUpgradePanel();
    }
  }
};

const drawBackground = (dt) => {
  ctx.fillStyle = "#050b1f";
  ctx.fillRect(0, 0, config.width, config.height);
  state.stars.forEach((star) => {
    star.y += star.speed * dt * 0.3;
    if (star.y > config.height) star.y = 0;
    ctx.fillStyle = `rgba(255,255,255,${0.5 + star.size / 2})`;
    ctx.fillRect(star.x, star.y, star.size, star.size);
  });
};

const drawEntities = () => {
  state.powerUps.forEach((p) => p.draw(ctx));
  state.enemies.forEach((enemy) => enemy.draw(ctx));
  state.blackHoles.forEach((hole) => hole.draw(ctx));
  state.bluefallPortals.forEach((portal) => portal.draw(ctx));
  state.novaAnomalies.forEach((anomaly) => anomaly.draw(ctx));
  state.barriers.forEach((barrier) => barrier.draw(ctx));
  state.expandingCircles.forEach((circle) => circle.draw(ctx));
  
  state.timeDilationFields.forEach((field) => field.draw(ctx));
  state.enemyBullets.forEach((bullet) => bullet.draw(ctx));
  state.bullets.forEach((bullet) => bullet.draw(ctx));
  state.visualBeams.forEach((beam) => {
    ctx.save();
    ctx.globalAlpha = Math.max(beam.life / beam.maxLife, 0);
    ctx.strokeStyle = beam.color;
    ctx.lineWidth = beam.width;
    ctx.shadowBlur = 16;
    ctx.shadowColor = beam.color;
    ctx.beginPath();
    ctx.moveTo(beam.x1, beam.y1);
    ctx.lineTo(beam.x2, beam.y2);
    ctx.stroke();
    
    ctx.lineWidth = Math.max(2, beam.width * 0.38 + Math.sin(beam.phase) * 1.4);
    ctx.strokeStyle = "rgba(255,255,255,0.85)";
    ctx.beginPath();
    ctx.moveTo(beam.x1, beam.y1);
    ctx.lineTo(beam.x2, beam.y2);
    ctx.stroke();
    ctx.restore();
  });
  state.drones.forEach((drone) => drone.draw(ctx));
  state.novaOrbiters.forEach((orb) => orb.draw(ctx));
  state.player.draw(ctx);
  state.particles.forEach((particle) => particle.draw(ctx));
  
};


const drawWaveBanner = () => {
  if (state.waveAnnouncementTimer <= 0) return;
  ctx.save();
  ctx.globalAlpha = clamp(state.waveAnnouncementTimer / 2.5, 0, 1);
  ctx.fillStyle = "#fafafa";
  ctx.font = "32px Space Grotesk";
  ctx.textAlign = "center";
  const isBoss = state.mode === "campaign"
    ? state.wave === state.campaignWaveTarget && state.campaignLevel % 5 === 0
    : state.wave % 5 === 0;
  const label = isBoss ? "Boss Incoming" : `Wave ${state.wave}`;
  ctx.fillText(label, config.width / 2, config.height / 2);
  ctx.restore();
};

const gameLoop = (timestamp) => {
  updateMusic();
  
  if (!state.running && !instructionsEl.classList.contains("hidden")) {
    clearCanvas();
    requestAnimationFrame(gameLoop);
    return;
  }
  
  if (!state.running) return;
  const dt = Math.min((timestamp - state.lastTime) / 1000, 0.04);
  state.lastTime = timestamp;

  
  const settingsOpen = settingsPanel && !settingsPanel.classList.contains("hidden");
  
  const active = !state.paused && !state.upgradePending && !settingsOpen;

  if (active) {
    
    if (state.running) {
      drawBackground(dt);
      updateEntities(dt);
      drawEntities();
      if (!state.tutorialMode || state.tutorialTestWave) {
        drawWaveBanner();
      }
      updateHud();
    }
    state.waveAnnouncementTimer = Math.max(
      state.waveAnnouncementTimer - dt,
      0
    );
    
    
    if (state.tutorialMode) {
      updateTutorialDisplay();
      
      checkTutorialStepCompletion();
    }
  } else if (state.paused && !state.upgradePending && !settingsOpen) {
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.fillRect(0, 0, config.width, config.height);
    ctx.fillStyle = "#fff";
    ctx.font = "24px Space Grotesk";
    ctx.textAlign = "center";
    ctx.fillText("Paused - Press P for settings", config.width / 2, config.height / 2);
    ctx.restore();
  }

  updateBossBar();
  requestAnimationFrame(gameLoop);
};

const endGame = () => {
  tone(140, 0.22, "sawtooth", audio.sfxVolume * 0.22);
  if (audio.music && audio.ctx && audio.useProceduralMusic) {
    audio.music.gain.setTargetAtTime(0, audio.ctx.currentTime, 0.1);
  }
  state.running = false;
  state.highScore = Math.max(state.highScore, state.score);
  localStorage.setItem("orbital-high-score", state.highScore);
  gameOverTitle.textContent = "Mission Failed";
  gameOverDetails.textContent = `Waves cleared: ${state.wave} · Score: ${state.score} · +${state.quantumCoresEarnedThisRun} Quantum Cores`;
  gameOverEl.classList.remove("hidden");
  bossBar.classList.add("hidden");
  bossBar.style.display = "none";
  upgradePanel.classList.add("hidden");
  if (hudSettingsButton) hudSettingsButton.classList.add("hidden");
  if (abilityIcons) abilityIcons.classList.add("hidden");
  state.upgradePending = false;
  state.awaitingUpgrade = false;
  state.quantumCoresEarnedThisRun = 0;
  if (state.tempTrialRunActive) {
    state.tempTrialRunActive = false;
    if (!state.unlockedShips.includes(state.shipKey)) {
      state.shipKey = "striker";
    }
    updateShipSelection();
  }
  updateHud();
};

const togglePause = () => {
  if (!state.running || state.upgradePending) return;
  
  if (settingsPanel && settingsPanel.classList.contains("hidden")) {
    openSettings();
  } else {
    closeSettings();
  }
};

const onKeyDown = (event) => {
  unlockAudio();
  const key = event.key.toLowerCase();
  if (key === "`" && !state.running && instructionsEl && !instructionsEl.classList.contains("hidden")) {
    state.tempAllShipsTrial = !state.tempAllShipsTrial;
    if (!state.tempAllShipsTrial && !state.unlockedShips.includes(state.shipKey)) {
      state.shipKey = "striker";
    }
    updateShipSelection();
    if (shipShopPanel && !shipShopPanel.classList.contains("hidden")) {
      openShipShop();
    }
    return;
  }
  if (key === "p") {
    togglePause();
    return;
  }
  
  if (state.player.abilities) {
    for (let i = 0; i < state.player.abilities.length && i < state.abilityKeys.length; i++) {
      const binding = state.abilityKeys[i];
      if (binding === key) {
        triggerAbility(state.player.abilities[i].type);
        return;
      }
    }
  }
  input.keys.add(key);
};
const onKeyUp = (event) => {
  input.keys.delete(event.key.toLowerCase());
};

canvas.addEventListener("mousemove", (event) => {
  const rect = canvas.getBoundingClientRect();
  input.mouse.x = ((event.clientX - rect.left) / rect.width) * canvas.width;
  input.mouse.y = ((event.clientY - rect.top) / rect.height) * canvas.height;
});

canvas.addEventListener("mousedown", (event) => {
  unlockAudio();
  
  if (state.running && state.player.abilities) {
    let mouseButton = null;
    if (event.button === 0) mouseButton = "lm"; 
    else if (event.button === 1) mouseButton = "mm"; 
    else if (event.button === 2) mouseButton = "rm"; 
    
    if (mouseButton) {
      for (let i = 0; i < state.player.abilities.length && i < state.abilityKeys.length; i++) {
        if (state.abilityKeys[i] === mouseButton) {
          event.preventDefault(); 
          triggerAbility(state.player.abilities[i].type);
          return;
        }
      }
    }
  }
  
  
  if (event.button === 0 && (!state.running || !state.abilityKeys.includes("lm"))) {
    input.mouse.down = true;
  }
});
window.addEventListener("mouseup", () => {
  input.mouse.down = false;
});

canvas.addEventListener("contextmenu", (event) => {
  if (state.abilityKeys.includes("rm")) {
    event.preventDefault();
  }
});


window.addEventListener("keyup", onKeyUp);
window.addEventListener("pointerdown", unlockAudio);

if (tutorialButton) {
  tutorialButton.addEventListener("click", () => {
    startTutorial();
  });
}

if (tutorialSkipButton) {
  tutorialSkipButton.addEventListener("click", () => {
    endTutorial();
  });
}
if (tutorialNextStepButton) {
  tutorialNextStepButton.addEventListener("click", () => {
    if (!state.tutorialMode || state.tutorialTestWave) return;
    const step = tutorialSteps[state.tutorialStep];
    if (!step || !step.completed || !step.waitForManualAdvance) return;
    advanceTutorialStep();
  });
}

const showHub = () => {
  if (mainHub) mainHub.classList.remove("hidden");
  if (instructionsEl) instructionsEl.classList.add("hidden");
  if (instructionsPanel) instructionsPanel.classList.add("hidden");
  if (campaignPanel) campaignPanel.classList.add("hidden");
};

const showEndlessSetup = () => {
  state.mode = "endless";
  if (mainHub) mainHub.classList.add("hidden");
  if (campaignPanel) campaignPanel.classList.add("hidden");
  if (instructionsPanel) instructionsPanel.classList.add("hidden");
  if (instructionsEl) instructionsEl.classList.remove("hidden");
  updateShipSelection();
};

const showInstructionsScreen = () => {
  if (mainHub) mainHub.classList.add("hidden");
  if (instructionsEl) instructionsEl.classList.add("hidden");
  if (campaignPanel) campaignPanel.classList.add("hidden");
  if (instructionsPanel) instructionsPanel.classList.remove("hidden");
};

const renderCampaignLevelGrid = () => {
  if (!campaignLevelGrid) return;
  campaignLevelGrid.innerHTML = "";
  for (let level = 1; level <= 40; level++) {
    const button = document.createElement("button");
    button.className = "campaign-level-btn";
    const unlocked = level <= state.campaignUnlockedLevel;
    if (!unlocked) button.classList.add("locked");
    if (level === state.selectedCampaignLevel) button.classList.add("selected");
    const isBossLevel = level % 5 === 0;
    button.innerHTML = `<strong>${level}</strong><span>${!unlocked ? "LOCKED" : isBossLevel ? "BOSS" : "OPEN"}</span>`;
    if (isBossLevel) button.classList.add("boss-level");
    button.disabled = !unlocked;
    button.addEventListener("click", () => {
      state.selectedCampaignLevel = level;
      renderCampaignLevelGrid();
    });
    campaignLevelGrid.appendChild(button);
  }
};

const showCampaignScreen = () => {
  if (mainHub) mainHub.classList.add("hidden");
  if (instructionsEl) instructionsEl.classList.add("hidden");
  if (instructionsPanel) instructionsPanel.classList.add("hidden");
  if (campaignPanel) campaignPanel.classList.remove("hidden");
  renderCampaignLevelGrid();
};

if (settingsButtonHub) settingsButtonHub.addEventListener("click", () => openSettings());
if (endlessButton) endlessButton.addEventListener("click", showEndlessSetup);
if (campaignButton) campaignButton.addEventListener("click", showCampaignScreen);
if (instructionsButton) instructionsButton.addEventListener("click", showInstructionsScreen);
if (shopButtonMain) shopButtonMain.addEventListener("click", () => openShipShop());
if (backToHubButton) backToHubButton.addEventListener("click", showHub);
if (backFromInstructions) backFromInstructions.addEventListener("click", showHub);
if (campaignCloseButton) campaignCloseButton.addEventListener("click", showHub);
if (campaignBackButton) campaignBackButton.addEventListener("click", showHub);
if (campaignStartButton) {
  campaignStartButton.addEventListener("click", () => {
    state.mode = "campaign";
    state.campaignLevel = state.selectedCampaignLevel;
    state.campaignWaveTarget = getCampaignWaveTarget(state.campaignLevel);
    state.wave = 1;
    if (campaignPanel) campaignPanel.classList.add("hidden");
    if (instructionsEl) instructionsEl.classList.add("hidden");
    if (mainHub) mainHub.classList.add("hidden");
    resetGame();
  });
}
if (achievementsButton) {
  achievementsButton.addEventListener("click", () => {
    renderAchievements();
    if (achievementsPanel) achievementsPanel.classList.remove("hidden");
  });
}
if (achievementsCloseButton) achievementsCloseButton.addEventListener("click", () => achievementsPanel.classList.add("hidden"));

if (codexButton) codexButton.classList.add("hidden");
if (challengeButton) challengeButton.classList.add("hidden");
if (fxLabButton) fxLabButton.classList.add("hidden");
if (mapRegistryButton) mapRegistryButton.classList.add("hidden");

if (advancedCodexButton) advancedCodexButton.addEventListener("click", () => codexButton && codexButton.click());
if (advancedChallengeButton) advancedChallengeButton.addEventListener("click", () => challengeButton && challengeButton.click());
if (advancedFxLabButton) advancedFxLabButton.addEventListener("click", () => fxLabButton && fxLabButton.click());
if (advancedMapRegistryButton) advancedMapRegistryButton.addEventListener("click", () => mapRegistryButton && mapRegistryButton.click());



startButton.addEventListener("click", () => {
  state.mode = "endless";
  unlockAchievement("first-run");
  const difficultySelection = document.querySelector(
    'input[name="difficulty"]:checked'
  );
  const shipSelection = document.querySelector('input[name="ship"]:checked');
  if (difficultySelection) state.difficultyKey = difficultySelection.value;
  if (shipSelection) {
    const selectedShip = shipSelection.value;
    if (hasShipAccess(selectedShip)) {
      state.shipKey = selectedShip;
    } else {
      state.shipKey = "striker";
    }
  }
  instructionsEl.classList.add("hidden");
  if (instructionsPanel) instructionsPanel.classList.add("hidden");
  if (mainHub) mainHub.classList.add("hidden");
  gameOverEl.classList.add("hidden");
  upgradePanel.classList.add("hidden");
  shipShopPanel.classList.add("hidden");
  resetGame();
});




if (shopButton) {
  shopButton.addEventListener("click", () => {
    openShipShop();
  });
}

if (shopCloseButton) {
  shopCloseButton.addEventListener("click", () => {
    closeShipShop();
  });
}

restartButton.addEventListener("click", () => {
  
  state.running = false;
  
  
  clearCanvas();
  
  
  gameOverEl.classList.add("hidden");
  upgradePanel.classList.add("hidden");
  bossBar.classList.add("hidden");
  bossBar.style.display = "none";
  if (hudSettingsButton) hudSettingsButton.classList.add("hidden");
  if (abilityIcons) abilityIcons.classList.add("hidden");
  
  
  if (mainHub) {
    showHub();
  } else {
    instructionsEl.classList.remove("hidden");
  }
  updateHud(); 
  
  
  state.bullets = [];
  state.enemyBullets = [];
  state.enemies = [];
  state.particles = [];
  state.powerUps = [];
  state.drones = [];
  state.barriers = [];
  state.blackHoles = [];
  state.expandingCircles = [];
  state.timeDilationFields = [];
  state.novaAnomalies = [];
  state.novaOrbiters = [];
  state.bluefallPortals = [];
  state.boss = null;
});


const clearCanvas = () => {
  ctx.fillStyle = "#050b1f";
  ctx.fillRect(0, 0, config.width, config.height);
};

window.addEventListener("blur", () => {
  input.keys.clear();
  input.mouse.down = false;
  
  if (state.running && !state.upgradePending && settingsPanel && settingsPanel.classList.contains("hidden")) {
    openSettings();
  } else {
    state.paused = true;
  }
});

const getTierInfo = (tier) => {
  const tierMap = {
    common: { name: "Common", color: "#9e9e9e" },
    uncommon: { name: "Uncommon", color: "#4caf50" },
    rare: { name: "Rare", color: "#2196f3" },
    mythic: { name: "Mythic", color: "#9c27b0" },
    legendary: { name: "Legendary", color: "#ff9800" },
    exotic: { name: "Exotic", color: "#ff4d4d" }
  };
  return tierMap[tier] || { name: tier, color: "#ffffff" };
};

const openShipShop = () => {
  shipShopPanel.classList.remove("hidden");
  if (shopQuantumCores) shopQuantumCores.textContent = state.quantumCores;
  shipShopList.innerHTML = "";
  
  
  const sortedShips = Object.values(shipLoadouts).sort((a, b) => {
    return (a.price || 0) - (b.price || 0);
  });
  
  sortedShips.forEach((ship) => {
    const isUnlocked = state.unlockedShips.includes(ship.id);
    const isTrialUnlocked = !isUnlocked && hasShipAccess(ship.id);
    const canAfford = state.quantumCores >= ship.price;
    const isSelected = state.shipKey === ship.id;
    const tierInfo = getTierInfo(ship.tier || "common");
    const card = document.createElement("div");
    card.className = `ship-card ship-card--tier-${ship.tier || "common"} ${isUnlocked || isTrialUnlocked ? "unlocked" : ""} ${!isUnlocked && !isTrialUnlocked && canAfford ? "affordable" : ""} ${isSelected ? "selected" : ""}`;
    card.innerHTML = `
      <div class="ship-card__header">
        <div class="ship-card__name-section">
          <strong>${ship.name}</strong>
          <span class="ship-card__tier" style="color: ${tierInfo.color}">${tierInfo.name}</span>
        </div>
        <div class="ship-card__badges">
          ${isUnlocked ? '<span class="ship-card__badge">UNLOCKED</span>' : isTrialUnlocked ? '<span class="ship-card__badge selected-badge">TRIAL</span>' : `<span class="ship-card__price">${ship.price} Quantum Cores</span>`}
          ${isSelected ? '<span class="ship-card__badge selected-badge">SELECTED</span>' : ""}
        </div>
      </div>
      <div class="ship-card__stats">
        <span>Speed: ${ship.speed}</span>
        <span>HP: ${ship.maxHp}</span>
        <span>Shield: ${ship.maxShield}</span>
        <span>Energy: ${ship.maxEnergy}</span>
      </div>
      <div class="ship-card__abilities">
        ${ship.abilities.map(a => `<div><kbd>${a.key.toUpperCase()}</kbd> ${a.name} (${a.cost} energy)</div>`).join("")}
      </div>
      ${!isUnlocked && !isTrialUnlocked ? `<button class="ship-card__buy" ${!canAfford ? "disabled" : ""}>Purchase</button>` : `<button class="ship-card__select" ${isSelected ? "disabled" : ""}>${isSelected ? "Selected" : "Select"}</button>`}
    `;
    const buyBtn = card.querySelector(".ship-card__buy");
    const selectBtn = card.querySelector(".ship-card__select");
    if (buyBtn) {
      buyBtn.addEventListener("click", () => {
        if (state.quantumCores >= ship.price) {
          state.quantumCores -= ship.price;
          state.unlockedShips.push(ship.id);
          localStorage.setItem("orbital-quantum-cores", state.quantumCores);
          localStorage.setItem("orbital-unlocked-ships", JSON.stringify(state.unlockedShips));
          openShipShop();
          updateHud();
          updateShipSelection(); 
        }
      });
    }
    if (selectBtn) {
      selectBtn.addEventListener("click", () => {
        state.shipKey = ship.id;
        openShipShop();
        updateShipSelection(); 
      });
    }
    shipShopList.appendChild(card);
  });
};

const updateShipSelection = () => {
  const shipContainer = document.getElementById("endlessShipCards");
  if (!shipContainer) return;
  shipContainer.innerHTML = "";
  
  const allShipIds = Object.keys(shipLoadouts).sort((a, b) => {
    const shipA = shipLoadouts[a];
    const shipB = shipLoadouts[b];
    if (!shipA || !shipB) return 0;
    const ownedA = state.unlockedShips.includes(a);
    const ownedB = state.unlockedShips.includes(b);
    if (ownedA !== ownedB) return ownedA ? -1 : 1;
    return (shipA.price || 0) - (shipB.price || 0);
  });
  
  
  allShipIds.forEach(shipId => {
    const ship = shipLoadouts[shipId];
    if (!ship) return;
    const isAccessible = hasShipAccess(shipId);
    const isOwned = state.unlockedShips.includes(shipId);
    
    const tierInfo = getTierInfo(ship.tier || "common");
    
    const label = document.createElement("label");
    label.className = `option-card ship-option ship-option--tier-${ship.tier || "common"} ${isAccessible ? "" : "locked"}`;
    
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "ship";
    radio.value = shipId;
    radio.disabled = !isAccessible;
    if (state.shipKey === shipId && isAccessible) {
      radio.checked = true;
    }
    
    const strong = document.createElement("strong");
    strong.textContent = ship.name;
    
    const tierSpan = document.createElement("span");
    tierSpan.className = "ship-tier";
    tierSpan.textContent = tierInfo.name;
    tierSpan.style.color = tierInfo.color;
    tierSpan.style.fontSize = "0.75rem";
    tierSpan.style.marginLeft = "8px";
    
    const span = document.createElement("span");
    const lockPrefix = !isAccessible ? "LOCKED 🔒 · " : "";
    const trialPrefix = isAccessible && !isOwned ? "TRIAL · " : "";
    span.textContent = `${lockPrefix}${trialPrefix}${ship.abilities.map(a => `${a.name} (${a.cost} energy)`).join(" · ")}`;
    if (!isAccessible) {
      label.style.opacity = "0.62";
      label.style.filter = "grayscale(0.55)";
      label.style.cursor = "not-allowed";
    }
    
    label.appendChild(radio);
    label.appendChild(strong);
    strong.appendChild(tierSpan);
    label.appendChild(span);
    
    
    radio.addEventListener("change", () => {
      if (radio.checked) {
        state.shipKey = shipId;
      }
    });
    
    shipContainer.appendChild(label);
  });
  const picked = shipContainer.querySelector('input[name="ship"]:checked');
  if (!picked) {
    const first = shipContainer.querySelector('input[name="ship"]:not([disabled])');
    if (first) {
      first.checked = true;
      state.shipKey = first.value;
    }
  }
};

if (endlessShipScroll && endlessShipNext) {
  endlessShipNext.addEventListener("click", () => {
    endlessShipScroll.scrollBy({ left: 260, behavior: "smooth" });
  });
  endlessShipScroll.addEventListener(
    "wheel",
    (e) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      e.preventDefault();
      endlessShipScroll.scrollLeft += e.deltaY;
    },
    { passive: false }
  );
}

let listeningToKey = null; 
let wasPausedBeforeSettings = false; 

const openSettings = () => {
  settingsPanel.classList.remove("hidden");
  updateKeyBindingDisplay();
  updateShipLoadoutDisplay();
  
  if (state.running && !state.upgradePending) {
    wasPausedBeforeSettings = state.paused;
    state.paused = true;
  }
};

const closeSettings = () => {
  settingsPanel.classList.add("hidden");
  listeningToKey = null;
  
  [keyBinding1, keyBinding2, keyBinding3].forEach(btn => {
    if (btn) btn.classList.remove("listening");
  });
  
  if (state.running && !state.upgradePending) {
    state.paused = wasPausedBeforeSettings;
  }
};

const updateKeyBindingDisplay = () => {
  const keyNames = {
    "1": "1", "2": "2", "3": "3",
    "lm": "Left Mouse", "mm": "Middle Mouse", "rm": "Right Mouse"
  };
  if (keyBinding1 && state.abilityKeys[0]) {
    keyBinding1.textContent = keyNames[state.abilityKeys[0]] || state.abilityKeys[0].toUpperCase();
  }
  if (keyBinding2 && state.abilityKeys[1]) {
    keyBinding2.textContent = keyNames[state.abilityKeys[1]] || state.abilityKeys[1].toUpperCase();
  }
  if (keyBinding3 && state.abilityKeys[2]) {
    keyBinding3.textContent = keyNames[state.abilityKeys[2]] || state.abilityKeys[2].toUpperCase();
  }
};

const updateShipLoadoutDisplay = () => {
  const shipLoadoutName = document.getElementById("shipLoadoutName");
  const shipLoadoutAbilities = document.getElementById("shipLoadoutAbilities");
  
  if (!shipLoadoutName || !shipLoadoutAbilities) return;
  
  
  let ship = null;
  if (state.player && state.player.abilities && state.player.abilities.length > 0) {
    
    const shipId = state.player.shipId || state.shipKey;
    ship = shipLoadouts[shipId];
  } else if (state.shipKey) {
    ship = shipLoadouts[state.shipKey];
  }
  
  if (!ship) {
    shipLoadoutName.textContent = "No Ship Selected";
    shipLoadoutAbilities.innerHTML = '<div class="ship-loadout__ability">No ship selected</div>';
    return;
  }
  
  const tierInfo = getTierInfo(ship.tier || "common");
  shipLoadoutName.innerHTML = `${ship.name} <span style="color: ${tierInfo.color}; font-size: 0.75rem; margin-left: 8px;">${tierInfo.name}</span>`;
  
  
  const keyNames = {
    "1": "1", "2": "2", "3": "3",
    "lm": "LM", "mm": "MM", "rm": "RM"
  };
  
  shipLoadoutAbilities.innerHTML = ship.abilities.map((ability, index) => {
    const binding = state.abilityKeys && state.abilityKeys[index] ? state.abilityKeys[index] : ability.key;
    const keyDisplay = keyNames[binding] || binding.toUpperCase();
    return `
      <div class="ship-loadout__ability">
        <kbd>${keyDisplay}</kbd>
        <span class="ability-name">${ability.name}</span>
        <span class="ability-cost">${ability.cost} energy</span>
      </div>
    `;
  }).join("");
};

const setAbilityKeys = (keys) => {
  state.abilityKeys = keys;
  localStorage.setItem("orbital-ability-keys", JSON.stringify(keys));
  updateKeyBindingDisplay();
};

const startListeningForKey = (abilityIndex) => {
  
  [keyBinding1, keyBinding2, keyBinding3].forEach(btn => {
    if (btn) btn.classList.remove("listening");
  });
  
  listeningToKey = abilityIndex;
  const button = [keyBinding1, keyBinding2, keyBinding3][abilityIndex];
  if (button) {
    button.classList.add("listening");
    button.textContent = "Press any key...";
  }
};

const handleKeyBindingInput = (key) => {
  if (listeningToKey === null) return;
  
  
  let bindingKey = key.toLowerCase();
  if (key === "Mouse0" || key === "lm") bindingKey = "lm";
  else if (key === "Mouse1" || key === "mm") bindingKey = "mm";
  else if (key === "Mouse2" || key === "rm") bindingKey = "rm";
  
  
  const newKeys = [...state.abilityKeys];
  newKeys[listeningToKey] = bindingKey;
  setAbilityKeys(newKeys);
  
  listeningToKey = null;
  [keyBinding1, keyBinding2, keyBinding3].forEach(btn => {
    if (btn) btn.classList.remove("listening");
  });
};

if (settingsButton) {
  settingsButton.addEventListener("click", () => {
    openSettings();
  });
}

if (hudSettingsButton) {
  hudSettingsButton.addEventListener("click", (e) => {
    e.stopPropagation();
    e.preventDefault();
    openSettings();
  });
}

if (settingsCloseButton) {
  settingsCloseButton.addEventListener("click", () => {
    closeSettings();
  });
}

if (termsButton) {
  termsButton.addEventListener("click", () => {
    if (termsPanel) termsPanel.classList.remove("hidden");
  });
}
if (termsCloseButton) {
  termsCloseButton.addEventListener("click", () => {
    if (termsPanel) termsPanel.classList.add("hidden");
  });
}

if (presetNumbers) {
  presetNumbers.addEventListener("click", () => {
    setAbilityKeys(["1", "2", "3"]);
  });
}

if (presetMouse) {
  presetMouse.addEventListener("click", () => {
    setAbilityKeys(["lm", "mm", "rm"]);
  });
}

if (keyBinding1) {
  keyBinding1.addEventListener("click", () => {
    startListeningForKey(0);
  });
}

if (keyBinding2) {
  keyBinding2.addEventListener("click", () => {
    startListeningForKey(1);
  });
}

if (keyBinding3) {
  keyBinding3.addEventListener("click", () => {
    startListeningForKey(2);
  });
}


const enhancedKeyDown = (event) => {
  if (listeningToKey !== null && !settingsPanel.classList.contains("hidden")) {
    event.preventDefault();
    handleKeyBindingInput(event.key);
    return;
  }
  onKeyDown(event);
};


const keyBindingMouseHandler = (event) => {
  if (listeningToKey !== null && !settingsPanel.classList.contains("hidden")) {
    event.preventDefault();
    event.stopPropagation();
    let mouseButton = null;
    if (event.button === 0) mouseButton = "lm";
    else if (event.button === 1) mouseButton = "mm";
    else if (event.button === 2) mouseButton = "rm";
    if (mouseButton) {
      handleKeyBindingInput(mouseButton);
    }
  }
};
canvas.addEventListener("mousedown", keyBindingMouseHandler, true); 

window.addEventListener("keydown", enhancedKeyDown);

const closeShipShop = () => {
  shipShopPanel.classList.add("hidden");
  updateShipSelection();
  if (!state.running) {
    showHub();
  }
};

const closeMetaPanels = () => {
  if (codexPanel) codexPanel.classList.add("hidden");
  if (challengePanel) challengePanel.classList.add("hidden");
  if (fxLabPanel) fxLabPanel.classList.add("hidden");
  if (mapRegistryPanel) mapRegistryPanel.classList.add("hidden");
};

const closeAllPanels = () => {
  if (settingsPanel) settingsPanel.classList.add("hidden");
  if (shipShopPanel) shipShopPanel.classList.add("hidden");
  if (termsPanel) termsPanel.classList.add("hidden");
  if (codexPanel) codexPanel.classList.add("hidden");
  if (challengePanel) challengePanel.classList.add("hidden");
  if (fxLabPanel) fxLabPanel.classList.add("hidden");
  if (mapRegistryPanel) mapRegistryPanel.classList.add("hidden");
  if (campaignPanel) campaignPanel.classList.add("hidden");
  if (achievementsPanel) achievementsPanel.classList.add("hidden");
};

window.addEventListener("mousedown", (event) => {
  if (state.upgradePending) return;
  const targets = [
    settingsPanel,
    shipShopPanel,
    termsPanel,
    codexPanel,
    challengePanel,
    fxLabPanel,
    mapRegistryPanel,
    campaignPanel,
    achievementsPanel,
  ].filter(Boolean);
  const clickedInside = targets.some((panel) => panel && !panel.classList.contains("hidden") && panel.contains(event.target));
  const clickedPanelTrigger = event.target.closest("button");
  if (!clickedInside && !clickedPanelTrigger) {
    closeAllPanels();
  }
});

const renderCodex = () => {
  if (!codexGrid) return;
  codexGrid.innerHTML = "";
  const sections = [
    { title: "Pattern Library", rows: ADVANCED_PATTERN_LIBRARY.map((p) => `${p.id} · ${p.family} · ${p.rhythm} · Threat ${p.threat}`) },
    { title: "Ship Visual Library", rows: ADVANCED_SHIP_VISUAL_LIBRARY.map((s) => `${s.id} · hull ${s.hull} · trail ${s.trail} · accent ${s.accent}`) },
    { title: "Expanded Ship Catalog", rows: ADVANCED_SHIP_LIBRARY.map((s) => `${s.name} · ${s.tier} · ${s.price} QC · ${s.abilities.map((a) => a.name).join(" / ")}`) },
    { title: "Stellar Doctrine Archive", rows: STELLAR_CODEX_ENTRIES }
  ];
  sections.forEach((section) => {
    const card = document.createElement("article");
    card.className = "codex-card";
    card.innerHTML = `<h4>${section.title}</h4><div class="codex-card__rows">${section.rows.map((row) => `<div class="codex-card__row">${row}</div>`).join("")}</div>`;
    codexGrid.appendChild(card);
  });
};

const renderChallengeBrowser = () => {
  if (!challengeList) return;
  challengeList.innerHTML = "";
  ADVANCED_CHALLENGE_PRESETS.forEach((preset) => {
    const card = document.createElement("article");
    card.className = "challenge-card";
    card.innerHTML = `
      <h4>${preset.title}</h4>
      <p>${preset.description}</p>
      <div class="challenge-card__stars">${"★".repeat(preset.stars)}${"☆".repeat(Math.max(0, 5 - preset.stars))}</div>
      <div class="challenge-card__mutators">${preset.mutators.map((m) => `<span>${m}</span>`).join("")}</div>
    `;
    challengeList.appendChild(card);
  });
};

const renderFxLab = () => {
  if (!fxLabList) return;
  fxLabList.innerHTML = "";
  ADVANCED_FX_PROFILES.forEach((profile) => {
    const card = document.createElement("article");
    card.className = "fx-card";
    card.innerHTML = `
      <h4>${profile.label}</h4>
      <p>${profile.visual}</p>
      <div class="fx-card__meta">
        <span>${profile.category}</span>
        <span>${profile.signature}</span>
      </div>
    `;
    fxLabList.appendChild(card);
  });
};

if (codexButton) {
  codexButton.addEventListener("click", () => {
    closeMetaPanels();
    renderCodex();
    if (codexPanel) codexPanel.classList.remove("hidden");
  });
}
if (challengeButton) {
  challengeButton.addEventListener("click", () => {
    closeMetaPanels();
    renderChallengeBrowser();
    if (challengePanel) challengePanel.classList.remove("hidden");
  });
}
if (fxLabButton) {
  fxLabButton.addEventListener("click", () => {
    closeMetaPanels();
    renderFxLab();
    if (fxLabPanel) fxLabPanel.classList.remove("hidden");
  });
}
if (mapRegistryButton) {
  mapRegistryButton.addEventListener("click", () => {
    closeMetaPanels();
    if (mapRegistryPanel) mapRegistryPanel.classList.remove("hidden");
  });
}
if (codexCloseButton) codexCloseButton.addEventListener("click", () => codexPanel.classList.add("hidden"));
if (challengeCloseButton) challengeCloseButton.addEventListener("click", () => challengePanel.classList.add("hidden"));
if (fxLabCloseButton) fxLabCloseButton.addEventListener("click", () => fxLabPanel.classList.add("hidden"));
if (mapRegistryCloseButton) mapRegistryCloseButton.addEventListener("click", () => mapRegistryPanel.classList.add("hidden"));



updateHud(); 
updateShipSelection();
if (mainHub) {
  showHub();
}

if (typeof updateKeyBindingDisplay === 'function') {
  updateKeyBindingDisplay();
}




// MEGA_RUNTIME_CONTENT_V2
const MEGA_SHIP_CATALOG_V2 = [
  { id: 'atlas-001', name: 'Atlas 001', tier: 'uncommon', speed: 221, maxHp: 91, maxShield: 21, maxEnergy: 71, baseCooldown: 0.67, damageMultiplier: 0.73, shotSpeedMultiplier: 0.81, energyRegenMultiplier: 0.32, shieldRegenMultiplier: 1.08, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 2140, unlocked: false },
  { id: 'atlas-002', name: 'Atlas 002', tier: 'rare', speed: 222, maxHp: 92, maxShield: 22, maxEnergy: 72, baseCooldown: 0.66, damageMultiplier: 0.74, shotSpeedMultiplier: 0.82, energyRegenMultiplier: 0.34, shieldRegenMultiplier: 1.16, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 2780, unlocked: false },
  { id: 'atlas-003', name: 'Atlas 003', tier: 'mythic', speed: 223, maxHp: 93, maxShield: 23, maxEnergy: 73, baseCooldown: 0.65, damageMultiplier: 0.76, shotSpeedMultiplier: 0.83, energyRegenMultiplier: 0.36, shieldRegenMultiplier: 1.24, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 3420, unlocked: false },
  { id: 'atlas-004', name: 'Atlas 004', tier: 'legendary', speed: 224, maxHp: 94, maxShield: 24, maxEnergy: 74, baseCooldown: 0.64, damageMultiplier: 0.77, shotSpeedMultiplier: 0.84, energyRegenMultiplier: 0.38, shieldRegenMultiplier: 1.32, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 4060, unlocked: false },
  { id: 'atlas-005', name: 'Atlas 005', tier: 'exotic', speed: 225, maxHp: 95, maxShield: 25, maxEnergy: 75, baseCooldown: 0.63, damageMultiplier: 0.78, shotSpeedMultiplier: 0.85, energyRegenMultiplier: 0.4, shieldRegenMultiplier: 1.4, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 4700, unlocked: false },
  { id: 'atlas-006', name: 'Atlas 006', tier: 'common', speed: 226, maxHp: 96, maxShield: 26, maxEnergy: 76, baseCooldown: 0.62, damageMultiplier: 0.79, shotSpeedMultiplier: 0.86, energyRegenMultiplier: 0.42, shieldRegenMultiplier: 1.48, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 5340, unlocked: false },
  { id: 'atlas-007', name: 'Atlas 007', tier: 'uncommon', speed: 227, maxHp: 97, maxShield: 27, maxEnergy: 77, baseCooldown: 0.61, damageMultiplier: 0.8, shotSpeedMultiplier: 0.87, energyRegenMultiplier: 0.44, shieldRegenMultiplier: 1.56, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 5980, unlocked: false },
  { id: 'atlas-008', name: 'Atlas 008', tier: 'rare', speed: 228, maxHp: 98, maxShield: 28, maxEnergy: 78, baseCooldown: 0.6, damageMultiplier: 0.82, shotSpeedMultiplier: 0.88, energyRegenMultiplier: 0.46, shieldRegenMultiplier: 1.64, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 6620, unlocked: false },
  { id: 'atlas-009', name: 'Atlas 009', tier: 'mythic', speed: 229, maxHp: 99, maxShield: 29, maxEnergy: 79, baseCooldown: 0.59, damageMultiplier: 0.83, shotSpeedMultiplier: 0.89, energyRegenMultiplier: 0.48, shieldRegenMultiplier: 1.72, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 7260, unlocked: false },
  { id: 'atlas-010', name: 'Atlas 010', tier: 'legendary', speed: 230, maxHp: 100, maxShield: 30, maxEnergy: 80, baseCooldown: 0.58, damageMultiplier: 0.84, shotSpeedMultiplier: 0.9, energyRegenMultiplier: 0.5, shieldRegenMultiplier: 1.8, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 7900, unlocked: false },
  { id: 'atlas-011', name: 'Atlas 011', tier: 'exotic', speed: 231, maxHp: 101, maxShield: 31, maxEnergy: 81, baseCooldown: 0.57, damageMultiplier: 0.85, shotSpeedMultiplier: 0.91, energyRegenMultiplier: 0.52, shieldRegenMultiplier: 1.88, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 8540, unlocked: false },
  { id: 'atlas-012', name: 'Atlas 012', tier: 'common', speed: 232, maxHp: 102, maxShield: 32, maxEnergy: 82, baseCooldown: 0.56, damageMultiplier: 0.86, shotSpeedMultiplier: 0.92, energyRegenMultiplier: 0.54, shieldRegenMultiplier: 1.96, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 9180, unlocked: false },
  { id: 'atlas-013', name: 'Atlas 013', tier: 'uncommon', speed: 233, maxHp: 103, maxShield: 33, maxEnergy: 83, baseCooldown: 0.55, damageMultiplier: 0.88, shotSpeedMultiplier: 0.93, energyRegenMultiplier: 0.56, shieldRegenMultiplier: 2.04, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 9820, unlocked: false },
  { id: 'atlas-014', name: 'Atlas 014', tier: 'rare', speed: 234, maxHp: 104, maxShield: 34, maxEnergy: 84, baseCooldown: 0.54, damageMultiplier: 0.89, shotSpeedMultiplier: 0.94, energyRegenMultiplier: 0.58, shieldRegenMultiplier: 2.12, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 10460, unlocked: false },
  { id: 'atlas-015', name: 'Atlas 015', tier: 'mythic', speed: 235, maxHp: 105, maxShield: 35, maxEnergy: 85, baseCooldown: 0.53, damageMultiplier: 0.9, shotSpeedMultiplier: 0.95, energyRegenMultiplier: 0.6, shieldRegenMultiplier: 2.2, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 11100, unlocked: false },
  { id: 'atlas-016', name: 'Atlas 016', tier: 'legendary', speed: 236, maxHp: 106, maxShield: 36, maxEnergy: 86, baseCooldown: 0.52, damageMultiplier: 0.91, shotSpeedMultiplier: 0.96, energyRegenMultiplier: 0.62, shieldRegenMultiplier: 2.28, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 11740, unlocked: false },
  { id: 'atlas-017', name: 'Atlas 017', tier: 'exotic', speed: 237, maxHp: 107, maxShield: 37, maxEnergy: 87, baseCooldown: 0.51, damageMultiplier: 0.92, shotSpeedMultiplier: 0.97, energyRegenMultiplier: 0.64, shieldRegenMultiplier: 2.36, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 12380, unlocked: false },
  { id: 'atlas-018', name: 'Atlas 018', tier: 'common', speed: 238, maxHp: 108, maxShield: 38, maxEnergy: 88, baseCooldown: 0.5, damageMultiplier: 0.94, shotSpeedMultiplier: 0.98, energyRegenMultiplier: 0.66, shieldRegenMultiplier: 2.44, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 13020, unlocked: false },
  { id: 'atlas-019', name: 'Atlas 019', tier: 'uncommon', speed: 239, maxHp: 109, maxShield: 39, maxEnergy: 89, baseCooldown: 0.49, damageMultiplier: 0.95, shotSpeedMultiplier: 0.99, energyRegenMultiplier: 0.68, shieldRegenMultiplier: 2.52, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 13660, unlocked: false },
  { id: 'atlas-020', name: 'Atlas 020', tier: 'rare', speed: 240, maxHp: 110, maxShield: 40, maxEnergy: 90, baseCooldown: 0.48, damageMultiplier: 0.96, shotSpeedMultiplier: 1, energyRegenMultiplier: 0.7, shieldRegenMultiplier: 2.6, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 14300, unlocked: false },
  { id: 'atlas-021', name: 'Atlas 021', tier: 'mythic', speed: 241, maxHp: 111, maxShield: 41, maxEnergy: 91, baseCooldown: 0.47, damageMultiplier: 0.97, shotSpeedMultiplier: 1.01, energyRegenMultiplier: 0.72, shieldRegenMultiplier: 2.68, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 14940, unlocked: false },
  { id: 'atlas-022', name: 'Atlas 022', tier: 'legendary', speed: 242, maxHp: 112, maxShield: 42, maxEnergy: 92, baseCooldown: 0.46, damageMultiplier: 0.98, shotSpeedMultiplier: 1.02, energyRegenMultiplier: 0.74, shieldRegenMultiplier: 2.76, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 15580, unlocked: false },
  { id: 'atlas-023', name: 'Atlas 023', tier: 'exotic', speed: 243, maxHp: 113, maxShield: 43, maxEnergy: 93, baseCooldown: 0.45, damageMultiplier: 1, shotSpeedMultiplier: 1.03, energyRegenMultiplier: 0.76, shieldRegenMultiplier: 2.84, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 16220, unlocked: false },
  { id: 'atlas-024', name: 'Atlas 024', tier: 'common', speed: 244, maxHp: 114, maxShield: 44, maxEnergy: 94, baseCooldown: 0.44, damageMultiplier: 1.01, shotSpeedMultiplier: 1.04, energyRegenMultiplier: 0.78, shieldRegenMultiplier: 2.92, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 16860, unlocked: false },
  { id: 'atlas-025', name: 'Atlas 025', tier: 'uncommon', speed: 245, maxHp: 115, maxShield: 45, maxEnergy: 95, baseCooldown: 0.43, damageMultiplier: 1.02, shotSpeedMultiplier: 1.05, energyRegenMultiplier: 0.8, shieldRegenMultiplier: 3, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 17500, unlocked: false },
  { id: 'atlas-026', name: 'Atlas 026', tier: 'rare', speed: 246, maxHp: 116, maxShield: 46, maxEnergy: 96, baseCooldown: 0.42, damageMultiplier: 1.03, shotSpeedMultiplier: 1.06, energyRegenMultiplier: 0.82, shieldRegenMultiplier: 3.08, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 18140, unlocked: false },
  { id: 'atlas-027', name: 'Atlas 027', tier: 'mythic', speed: 247, maxHp: 117, maxShield: 47, maxEnergy: 97, baseCooldown: 0.41, damageMultiplier: 1.04, shotSpeedMultiplier: 1.07, energyRegenMultiplier: 0.84, shieldRegenMultiplier: 3.16, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 18780, unlocked: false },
  { id: 'atlas-028', name: 'Atlas 028', tier: 'legendary', speed: 248, maxHp: 118, maxShield: 48, maxEnergy: 98, baseCooldown: 0.68, damageMultiplier: 1.06, shotSpeedMultiplier: 1.08, energyRegenMultiplier: 0.86, shieldRegenMultiplier: 3.24, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 19420, unlocked: false },
  { id: 'atlas-029', name: 'Atlas 029', tier: 'exotic', speed: 249, maxHp: 119, maxShield: 49, maxEnergy: 99, baseCooldown: 0.67, damageMultiplier: 1.07, shotSpeedMultiplier: 1.09, energyRegenMultiplier: 0.88, shieldRegenMultiplier: 3.32, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 20060, unlocked: false },
  { id: 'atlas-030', name: 'Atlas 030', tier: 'common', speed: 250, maxHp: 120, maxShield: 50, maxEnergy: 100, baseCooldown: 0.66, damageMultiplier: 1.08, shotSpeedMultiplier: 1.1, energyRegenMultiplier: 0.9, shieldRegenMultiplier: 3.4, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 20700, unlocked: false },
  { id: 'atlas-031', name: 'Atlas 031', tier: 'uncommon', speed: 251, maxHp: 121, maxShield: 51, maxEnergy: 101, baseCooldown: 0.65, damageMultiplier: 1.09, shotSpeedMultiplier: 1.11, energyRegenMultiplier: 0.92, shieldRegenMultiplier: 3.48, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 21340, unlocked: false },
  { id: 'atlas-032', name: 'Atlas 032', tier: 'rare', speed: 252, maxHp: 122, maxShield: 52, maxEnergy: 102, baseCooldown: 0.64, damageMultiplier: 1.1, shotSpeedMultiplier: 1.12, energyRegenMultiplier: 0.94, shieldRegenMultiplier: 3.56, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 21980, unlocked: false },
  { id: 'atlas-033', name: 'Atlas 033', tier: 'mythic', speed: 253, maxHp: 123, maxShield: 53, maxEnergy: 103, baseCooldown: 0.63, damageMultiplier: 1.12, shotSpeedMultiplier: 1.13, energyRegenMultiplier: 0.96, shieldRegenMultiplier: 3.64, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 22620, unlocked: false },
  { id: 'atlas-034', name: 'Atlas 034', tier: 'legendary', speed: 254, maxHp: 124, maxShield: 54, maxEnergy: 104, baseCooldown: 0.62, damageMultiplier: 1.13, shotSpeedMultiplier: 1.14, energyRegenMultiplier: 0.98, shieldRegenMultiplier: 3.72, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 23260, unlocked: false },
  { id: 'atlas-035', name: 'Atlas 035', tier: 'exotic', speed: 255, maxHp: 125, maxShield: 55, maxEnergy: 105, baseCooldown: 0.61, damageMultiplier: 1.14, shotSpeedMultiplier: 1.15, energyRegenMultiplier: 1, shieldRegenMultiplier: 3.8, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 23900, unlocked: false },
  { id: 'atlas-036', name: 'Atlas 036', tier: 'common', speed: 256, maxHp: 126, maxShield: 56, maxEnergy: 106, baseCooldown: 0.6, damageMultiplier: 1.15, shotSpeedMultiplier: 1.16, energyRegenMultiplier: 1.02, shieldRegenMultiplier: 3.88, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 24540, unlocked: false },
  { id: 'atlas-037', name: 'Atlas 037', tier: 'uncommon', speed: 257, maxHp: 127, maxShield: 57, maxEnergy: 107, baseCooldown: 0.59, damageMultiplier: 1.16, shotSpeedMultiplier: 1.17, energyRegenMultiplier: 1.04, shieldRegenMultiplier: 3.96, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 25180, unlocked: false },
  { id: 'atlas-038', name: 'Atlas 038', tier: 'rare', speed: 258, maxHp: 128, maxShield: 58, maxEnergy: 108, baseCooldown: 0.58, damageMultiplier: 1.18, shotSpeedMultiplier: 1.18, energyRegenMultiplier: 1.06, shieldRegenMultiplier: 4.04, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 25820, unlocked: false },
  { id: 'atlas-039', name: 'Atlas 039', tier: 'mythic', speed: 259, maxHp: 129, maxShield: 59, maxEnergy: 109, baseCooldown: 0.57, damageMultiplier: 1.19, shotSpeedMultiplier: 1.19, energyRegenMultiplier: 1.08, shieldRegenMultiplier: 4.12, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 26460, unlocked: false },
  { id: 'atlas-040', name: 'Atlas 040', tier: 'legendary', speed: 260, maxHp: 130, maxShield: 60, maxEnergy: 110, baseCooldown: 0.56, damageMultiplier: 1.2, shotSpeedMultiplier: 1.2, energyRegenMultiplier: 1.1, shieldRegenMultiplier: 4.2, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 27100, unlocked: false },
  { id: 'atlas-041', name: 'Atlas 041', tier: 'exotic', speed: 261, maxHp: 131, maxShield: 61, maxEnergy: 111, baseCooldown: 0.55, damageMultiplier: 1.21, shotSpeedMultiplier: 1.21, energyRegenMultiplier: 1.12, shieldRegenMultiplier: 4.28, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 27740, unlocked: false },
  { id: 'atlas-042', name: 'Atlas 042', tier: 'common', speed: 262, maxHp: 132, maxShield: 62, maxEnergy: 112, baseCooldown: 0.54, damageMultiplier: 1.22, shotSpeedMultiplier: 1.22, energyRegenMultiplier: 1.14, shieldRegenMultiplier: 4.36, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 28380, unlocked: false },
  { id: 'atlas-043', name: 'Atlas 043', tier: 'uncommon', speed: 263, maxHp: 133, maxShield: 63, maxEnergy: 113, baseCooldown: 0.53, damageMultiplier: 1.24, shotSpeedMultiplier: 1.23, energyRegenMultiplier: 1.16, shieldRegenMultiplier: 4.44, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 29020, unlocked: false },
  { id: 'atlas-044', name: 'Atlas 044', tier: 'rare', speed: 264, maxHp: 134, maxShield: 64, maxEnergy: 114, baseCooldown: 0.52, damageMultiplier: 1.25, shotSpeedMultiplier: 1.24, energyRegenMultiplier: 1.18, shieldRegenMultiplier: 4.52, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 29660, unlocked: false },
  { id: 'atlas-045', name: 'Atlas 045', tier: 'mythic', speed: 265, maxHp: 135, maxShield: 65, maxEnergy: 115, baseCooldown: 0.51, damageMultiplier: 1.26, shotSpeedMultiplier: 1.25, energyRegenMultiplier: 1.2, shieldRegenMultiplier: 4.6, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 30300, unlocked: false },
  { id: 'atlas-046', name: 'Atlas 046', tier: 'legendary', speed: 266, maxHp: 136, maxShield: 66, maxEnergy: 116, baseCooldown: 0.5, damageMultiplier: 1.27, shotSpeedMultiplier: 1.26, energyRegenMultiplier: 1.22, shieldRegenMultiplier: 4.68, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 30940, unlocked: false },
  { id: 'atlas-047', name: 'Atlas 047', tier: 'exotic', speed: 267, maxHp: 137, maxShield: 67, maxEnergy: 117, baseCooldown: 0.49, damageMultiplier: 1.28, shotSpeedMultiplier: 1.27, energyRegenMultiplier: 1.24, shieldRegenMultiplier: 4.76, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 31580, unlocked: false },
  { id: 'atlas-048', name: 'Atlas 048', tier: 'common', speed: 268, maxHp: 138, maxShield: 68, maxEnergy: 118, baseCooldown: 0.48, damageMultiplier: 1.3, shotSpeedMultiplier: 1.28, energyRegenMultiplier: 1.26, shieldRegenMultiplier: 4.84, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 32220, unlocked: false },
  { id: 'atlas-049', name: 'Atlas 049', tier: 'uncommon', speed: 269, maxHp: 139, maxShield: 69, maxEnergy: 119, baseCooldown: 0.47, damageMultiplier: 1.31, shotSpeedMultiplier: 1.29, energyRegenMultiplier: 1.28, shieldRegenMultiplier: 4.92, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 32860, unlocked: false },
  { id: 'atlas-050', name: 'Atlas 050', tier: 'rare', speed: 270, maxHp: 140, maxShield: 70, maxEnergy: 120, baseCooldown: 0.46, damageMultiplier: 1.32, shotSpeedMultiplier: 1.3, energyRegenMultiplier: 1.3, shieldRegenMultiplier: 5, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 33500, unlocked: false },
  { id: 'atlas-051', name: 'Atlas 051', tier: 'mythic', speed: 271, maxHp: 141, maxShield: 71, maxEnergy: 121, baseCooldown: 0.45, damageMultiplier: 1.33, shotSpeedMultiplier: 1.31, energyRegenMultiplier: 1.32, shieldRegenMultiplier: 5.08, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 34140, unlocked: false },
  { id: 'atlas-052', name: 'Atlas 052', tier: 'legendary', speed: 272, maxHp: 142, maxShield: 72, maxEnergy: 122, baseCooldown: 0.44, damageMultiplier: 1.34, shotSpeedMultiplier: 1.32, energyRegenMultiplier: 1.34, shieldRegenMultiplier: 5.16, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 34780, unlocked: false },
  { id: 'atlas-053', name: 'Atlas 053', tier: 'exotic', speed: 273, maxHp: 143, maxShield: 73, maxEnergy: 123, baseCooldown: 0.43, damageMultiplier: 1.36, shotSpeedMultiplier: 1.33, energyRegenMultiplier: 1.36, shieldRegenMultiplier: 5.24, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 35420, unlocked: false },
  { id: 'atlas-054', name: 'Atlas 054', tier: 'common', speed: 274, maxHp: 144, maxShield: 74, maxEnergy: 124, baseCooldown: 0.42, damageMultiplier: 1.37, shotSpeedMultiplier: 1.34, energyRegenMultiplier: 1.38, shieldRegenMultiplier: 5.32, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 36060, unlocked: false },
  { id: 'atlas-055', name: 'Atlas 055', tier: 'uncommon', speed: 275, maxHp: 145, maxShield: 75, maxEnergy: 125, baseCooldown: 0.41, damageMultiplier: 1.38, shotSpeedMultiplier: 1.35, energyRegenMultiplier: 1.4, shieldRegenMultiplier: 5.4, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 36700, unlocked: false },
  { id: 'atlas-056', name: 'Atlas 056', tier: 'rare', speed: 276, maxHp: 146, maxShield: 76, maxEnergy: 126, baseCooldown: 0.68, damageMultiplier: 1.39, shotSpeedMultiplier: 1.36, energyRegenMultiplier: 1.42, shieldRegenMultiplier: 5.48, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 37340, unlocked: false },
  { id: 'atlas-057', name: 'Atlas 057', tier: 'mythic', speed: 277, maxHp: 147, maxShield: 77, maxEnergy: 127, baseCooldown: 0.67, damageMultiplier: 1.4, shotSpeedMultiplier: 1.37, energyRegenMultiplier: 1.44, shieldRegenMultiplier: 5.56, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 37980, unlocked: false },
  { id: 'atlas-058', name: 'Atlas 058', tier: 'legendary', speed: 278, maxHp: 148, maxShield: 78, maxEnergy: 128, baseCooldown: 0.66, damageMultiplier: 1.42, shotSpeedMultiplier: 1.38, energyRegenMultiplier: 1.46, shieldRegenMultiplier: 5.64, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 38620, unlocked: false },
  { id: 'atlas-059', name: 'Atlas 059', tier: 'exotic', speed: 279, maxHp: 149, maxShield: 79, maxEnergy: 129, baseCooldown: 0.65, damageMultiplier: 1.43, shotSpeedMultiplier: 1.39, energyRegenMultiplier: 1.48, shieldRegenMultiplier: 5.72, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 39260, unlocked: false },
  { id: 'atlas-060', name: 'Atlas 060', tier: 'common', speed: 280, maxHp: 150, maxShield: 80, maxEnergy: 130, baseCooldown: 0.64, damageMultiplier: 1.44, shotSpeedMultiplier: 1.4, energyRegenMultiplier: 1.5, shieldRegenMultiplier: 5.8, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 39900, unlocked: false },
  { id: 'atlas-061', name: 'Atlas 061', tier: 'uncommon', speed: 281, maxHp: 151, maxShield: 81, maxEnergy: 131, baseCooldown: 0.63, damageMultiplier: 1.45, shotSpeedMultiplier: 1.41, energyRegenMultiplier: 1.52, shieldRegenMultiplier: 5.88, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 40540, unlocked: false },
  { id: 'atlas-062', name: 'Atlas 062', tier: 'rare', speed: 282, maxHp: 152, maxShield: 82, maxEnergy: 132, baseCooldown: 0.62, damageMultiplier: 1.46, shotSpeedMultiplier: 1.42, energyRegenMultiplier: 1.54, shieldRegenMultiplier: 5.96, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 41180, unlocked: false },
  { id: 'atlas-063', name: 'Atlas 063', tier: 'mythic', speed: 283, maxHp: 153, maxShield: 83, maxEnergy: 133, baseCooldown: 0.61, damageMultiplier: 1.48, shotSpeedMultiplier: 1.43, energyRegenMultiplier: 1.56, shieldRegenMultiplier: 6.04, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 41820, unlocked: false },
  { id: 'atlas-064', name: 'Atlas 064', tier: 'legendary', speed: 284, maxHp: 154, maxShield: 84, maxEnergy: 134, baseCooldown: 0.6, damageMultiplier: 1.49, shotSpeedMultiplier: 1.44, energyRegenMultiplier: 1.58, shieldRegenMultiplier: 6.12, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 42460, unlocked: false },
  { id: 'atlas-065', name: 'Atlas 065', tier: 'exotic', speed: 285, maxHp: 155, maxShield: 85, maxEnergy: 135, baseCooldown: 0.59, damageMultiplier: 1.5, shotSpeedMultiplier: 1.45, energyRegenMultiplier: 1.6, shieldRegenMultiplier: 6.2, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 43100, unlocked: false },
  { id: 'atlas-066', name: 'Atlas 066', tier: 'common', speed: 286, maxHp: 156, maxShield: 86, maxEnergy: 136, baseCooldown: 0.58, damageMultiplier: 1.51, shotSpeedMultiplier: 1.46, energyRegenMultiplier: 1.62, shieldRegenMultiplier: 6.28, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 43740, unlocked: false },
  { id: 'atlas-067', name: 'Atlas 067', tier: 'uncommon', speed: 287, maxHp: 157, maxShield: 87, maxEnergy: 137, baseCooldown: 0.57, damageMultiplier: 1.52, shotSpeedMultiplier: 1.47, energyRegenMultiplier: 1.64, shieldRegenMultiplier: 6.36, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 44380, unlocked: false },
  { id: 'atlas-068', name: 'Atlas 068', tier: 'rare', speed: 288, maxHp: 158, maxShield: 88, maxEnergy: 138, baseCooldown: 0.56, damageMultiplier: 1.54, shotSpeedMultiplier: 1.48, energyRegenMultiplier: 1.66, shieldRegenMultiplier: 6.44, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 45020, unlocked: false },
  { id: 'atlas-069', name: 'Atlas 069', tier: 'mythic', speed: 289, maxHp: 159, maxShield: 89, maxEnergy: 139, baseCooldown: 0.55, damageMultiplier: 1.55, shotSpeedMultiplier: 1.49, energyRegenMultiplier: 1.68, shieldRegenMultiplier: 6.52, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 45660, unlocked: false },
  { id: 'atlas-070', name: 'Atlas 070', tier: 'legendary', speed: 290, maxHp: 160, maxShield: 90, maxEnergy: 140, baseCooldown: 0.54, damageMultiplier: 1.56, shotSpeedMultiplier: 0.8, energyRegenMultiplier: 1.7, shieldRegenMultiplier: 1, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 46300, unlocked: false },
  { id: 'atlas-071', name: 'Atlas 071', tier: 'exotic', speed: 291, maxHp: 161, maxShield: 91, maxEnergy: 141, baseCooldown: 0.53, damageMultiplier: 1.57, shotSpeedMultiplier: 0.81, energyRegenMultiplier: 1.72, shieldRegenMultiplier: 1.08, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 46940, unlocked: false },
  { id: 'atlas-072', name: 'Atlas 072', tier: 'common', speed: 292, maxHp: 162, maxShield: 92, maxEnergy: 142, baseCooldown: 0.52, damageMultiplier: 1.58, shotSpeedMultiplier: 0.82, energyRegenMultiplier: 1.74, shieldRegenMultiplier: 1.16, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 47580, unlocked: false },
  { id: 'atlas-073', name: 'Atlas 073', tier: 'uncommon', speed: 293, maxHp: 163, maxShield: 93, maxEnergy: 143, baseCooldown: 0.51, damageMultiplier: 1.6, shotSpeedMultiplier: 0.83, energyRegenMultiplier: 1.76, shieldRegenMultiplier: 1.24, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 48220, unlocked: false },
  { id: 'atlas-074', name: 'Atlas 074', tier: 'rare', speed: 294, maxHp: 164, maxShield: 94, maxEnergy: 144, baseCooldown: 0.5, damageMultiplier: 1.61, shotSpeedMultiplier: 0.84, energyRegenMultiplier: 1.78, shieldRegenMultiplier: 1.32, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 48860, unlocked: false },
  { id: 'atlas-075', name: 'Atlas 075', tier: 'mythic', speed: 295, maxHp: 165, maxShield: 95, maxEnergy: 145, baseCooldown: 0.49, damageMultiplier: 1.62, shotSpeedMultiplier: 0.85, energyRegenMultiplier: 1.8, shieldRegenMultiplier: 1.4, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 49500, unlocked: false },
  { id: 'atlas-076', name: 'Atlas 076', tier: 'legendary', speed: 296, maxHp: 166, maxShield: 96, maxEnergy: 146, baseCooldown: 0.48, damageMultiplier: 1.63, shotSpeedMultiplier: 0.86, energyRegenMultiplier: 1.82, shieldRegenMultiplier: 1.48, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 50140, unlocked: false },
  { id: 'atlas-077', name: 'Atlas 077', tier: 'exotic', speed: 297, maxHp: 167, maxShield: 97, maxEnergy: 147, baseCooldown: 0.47, damageMultiplier: 1.64, shotSpeedMultiplier: 0.87, energyRegenMultiplier: 1.84, shieldRegenMultiplier: 1.56, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 50780, unlocked: false },
  { id: 'atlas-078', name: 'Atlas 078', tier: 'common', speed: 298, maxHp: 168, maxShield: 98, maxEnergy: 148, baseCooldown: 0.46, damageMultiplier: 1.66, shotSpeedMultiplier: 0.88, energyRegenMultiplier: 1.86, shieldRegenMultiplier: 1.64, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 51420, unlocked: false },
  { id: 'atlas-079', name: 'Atlas 079', tier: 'uncommon', speed: 299, maxHp: 169, maxShield: 99, maxEnergy: 149, baseCooldown: 0.45, damageMultiplier: 1.67, shotSpeedMultiplier: 0.89, energyRegenMultiplier: 1.88, shieldRegenMultiplier: 1.72, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 52060, unlocked: false },
  { id: 'atlas-080', name: 'Atlas 080', tier: 'rare', speed: 300, maxHp: 170, maxShield: 100, maxEnergy: 150, baseCooldown: 0.44, damageMultiplier: 1.68, shotSpeedMultiplier: 0.9, energyRegenMultiplier: 0.3, shieldRegenMultiplier: 1.8, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 52700, unlocked: false },
  { id: 'atlas-081', name: 'Atlas 081', tier: 'mythic', speed: 301, maxHp: 171, maxShield: 101, maxEnergy: 151, baseCooldown: 0.43, damageMultiplier: 1.69, shotSpeedMultiplier: 0.91, energyRegenMultiplier: 0.32, shieldRegenMultiplier: 1.88, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 53340, unlocked: false },
  { id: 'atlas-082', name: 'Atlas 082', tier: 'legendary', speed: 302, maxHp: 172, maxShield: 102, maxEnergy: 152, baseCooldown: 0.42, damageMultiplier: 1.7, shotSpeedMultiplier: 0.92, energyRegenMultiplier: 0.34, shieldRegenMultiplier: 1.96, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 53980, unlocked: false },
  { id: 'atlas-083', name: 'Atlas 083', tier: 'exotic', speed: 303, maxHp: 173, maxShield: 103, maxEnergy: 153, baseCooldown: 0.41, damageMultiplier: 1.72, shotSpeedMultiplier: 0.93, energyRegenMultiplier: 0.36, shieldRegenMultiplier: 2.04, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 54620, unlocked: false },
  { id: 'atlas-084', name: 'Atlas 084', tier: 'common', speed: 304, maxHp: 174, maxShield: 104, maxEnergy: 154, baseCooldown: 0.68, damageMultiplier: 1.73, shotSpeedMultiplier: 0.94, energyRegenMultiplier: 0.38, shieldRegenMultiplier: 2.12, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 55260, unlocked: false },
  { id: 'atlas-085', name: 'Atlas 085', tier: 'uncommon', speed: 305, maxHp: 175, maxShield: 105, maxEnergy: 155, baseCooldown: 0.67, damageMultiplier: 1.74, shotSpeedMultiplier: 0.95, energyRegenMultiplier: 0.4, shieldRegenMultiplier: 2.2, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 55900, unlocked: false },
  { id: 'atlas-086', name: 'Atlas 086', tier: 'rare', speed: 306, maxHp: 176, maxShield: 106, maxEnergy: 156, baseCooldown: 0.66, damageMultiplier: 1.75, shotSpeedMultiplier: 0.96, energyRegenMultiplier: 0.42, shieldRegenMultiplier: 2.28, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 56540, unlocked: false },
  { id: 'atlas-087', name: 'Atlas 087', tier: 'mythic', speed: 307, maxHp: 177, maxShield: 107, maxEnergy: 157, baseCooldown: 0.65, damageMultiplier: 1.76, shotSpeedMultiplier: 0.97, energyRegenMultiplier: 0.44, shieldRegenMultiplier: 2.36, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 57180, unlocked: false },
  { id: 'atlas-088', name: 'Atlas 088', tier: 'legendary', speed: 308, maxHp: 178, maxShield: 108, maxEnergy: 158, baseCooldown: 0.64, damageMultiplier: 1.78, shotSpeedMultiplier: 0.98, energyRegenMultiplier: 0.46, shieldRegenMultiplier: 2.44, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 57820, unlocked: false },
  { id: 'atlas-089', name: 'Atlas 089', tier: 'exotic', speed: 309, maxHp: 179, maxShield: 109, maxEnergy: 159, baseCooldown: 0.63, damageMultiplier: 1.79, shotSpeedMultiplier: 0.99, energyRegenMultiplier: 0.48, shieldRegenMultiplier: 2.52, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 58460, unlocked: false },
  { id: 'atlas-090', name: 'Atlas 090', tier: 'common', speed: 310, maxHp: 180, maxShield: 110, maxEnergy: 160, baseCooldown: 0.62, damageMultiplier: 0.72, shotSpeedMultiplier: 1, energyRegenMultiplier: 0.5, shieldRegenMultiplier: 2.6, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 59100, unlocked: false },
  { id: 'atlas-091', name: 'Atlas 091', tier: 'uncommon', speed: 311, maxHp: 181, maxShield: 111, maxEnergy: 161, baseCooldown: 0.61, damageMultiplier: 0.73, shotSpeedMultiplier: 1.01, energyRegenMultiplier: 0.52, shieldRegenMultiplier: 2.68, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 59740, unlocked: false },
  { id: 'atlas-092', name: 'Atlas 092', tier: 'rare', speed: 312, maxHp: 182, maxShield: 112, maxEnergy: 162, baseCooldown: 0.6, damageMultiplier: 0.74, shotSpeedMultiplier: 1.02, energyRegenMultiplier: 0.54, shieldRegenMultiplier: 2.76, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 60380, unlocked: false },
  { id: 'atlas-093', name: 'Atlas 093', tier: 'mythic', speed: 313, maxHp: 183, maxShield: 113, maxEnergy: 163, baseCooldown: 0.59, damageMultiplier: 0.76, shotSpeedMultiplier: 1.03, energyRegenMultiplier: 0.56, shieldRegenMultiplier: 2.84, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 61020, unlocked: false },
  { id: 'atlas-094', name: 'Atlas 094', tier: 'legendary', speed: 314, maxHp: 184, maxShield: 114, maxEnergy: 164, baseCooldown: 0.58, damageMultiplier: 0.77, shotSpeedMultiplier: 1.04, energyRegenMultiplier: 0.58, shieldRegenMultiplier: 2.92, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 61660, unlocked: false },
  { id: 'atlas-095', name: 'Atlas 095', tier: 'exotic', speed: 315, maxHp: 185, maxShield: 115, maxEnergy: 165, baseCooldown: 0.57, damageMultiplier: 0.78, shotSpeedMultiplier: 1.05, energyRegenMultiplier: 0.6, shieldRegenMultiplier: 3, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 62300, unlocked: false },
  { id: 'atlas-096', name: 'Atlas 096', tier: 'common', speed: 316, maxHp: 186, maxShield: 116, maxEnergy: 166, baseCooldown: 0.56, damageMultiplier: 0.79, shotSpeedMultiplier: 1.06, energyRegenMultiplier: 0.62, shieldRegenMultiplier: 3.08, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 62940, unlocked: false },
  { id: 'atlas-097', name: 'Atlas 097', tier: 'uncommon', speed: 317, maxHp: 187, maxShield: 117, maxEnergy: 167, baseCooldown: 0.55, damageMultiplier: 0.8, shotSpeedMultiplier: 1.07, energyRegenMultiplier: 0.64, shieldRegenMultiplier: 3.16, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 63580, unlocked: false },
  { id: 'atlas-098', name: 'Atlas 098', tier: 'rare', speed: 318, maxHp: 188, maxShield: 118, maxEnergy: 168, baseCooldown: 0.54, damageMultiplier: 0.82, shotSpeedMultiplier: 1.08, energyRegenMultiplier: 0.66, shieldRegenMultiplier: 3.24, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 64220, unlocked: false },
  { id: 'atlas-099', name: 'Atlas 099', tier: 'mythic', speed: 319, maxHp: 189, maxShield: 119, maxEnergy: 169, baseCooldown: 0.53, damageMultiplier: 0.83, shotSpeedMultiplier: 1.09, energyRegenMultiplier: 0.68, shieldRegenMultiplier: 3.32, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 64860, unlocked: false },
  { id: 'atlas-100', name: 'Atlas 100', tier: 'legendary', speed: 320, maxHp: 190, maxShield: 120, maxEnergy: 170, baseCooldown: 0.52, damageMultiplier: 0.84, shotSpeedMultiplier: 1.1, energyRegenMultiplier: 0.7, shieldRegenMultiplier: 3.4, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 65500, unlocked: false },
  { id: 'atlas-101', name: 'Atlas 101', tier: 'exotic', speed: 321, maxHp: 191, maxShield: 121, maxEnergy: 171, baseCooldown: 0.51, damageMultiplier: 0.85, shotSpeedMultiplier: 1.11, energyRegenMultiplier: 0.72, shieldRegenMultiplier: 3.48, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 66140, unlocked: false },
  { id: 'atlas-102', name: 'Atlas 102', tier: 'common', speed: 322, maxHp: 192, maxShield: 122, maxEnergy: 172, baseCooldown: 0.5, damageMultiplier: 0.86, shotSpeedMultiplier: 1.12, energyRegenMultiplier: 0.74, shieldRegenMultiplier: 3.56, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 66780, unlocked: false },
  { id: 'atlas-103', name: 'Atlas 103', tier: 'uncommon', speed: 323, maxHp: 193, maxShield: 123, maxEnergy: 173, baseCooldown: 0.49, damageMultiplier: 0.88, shotSpeedMultiplier: 1.13, energyRegenMultiplier: 0.76, shieldRegenMultiplier: 3.64, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 67420, unlocked: false },
  { id: 'atlas-104', name: 'Atlas 104', tier: 'rare', speed: 324, maxHp: 194, maxShield: 124, maxEnergy: 174, baseCooldown: 0.48, damageMultiplier: 0.89, shotSpeedMultiplier: 1.14, energyRegenMultiplier: 0.78, shieldRegenMultiplier: 3.72, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 68060, unlocked: false },
  { id: 'atlas-105', name: 'Atlas 105', tier: 'mythic', speed: 325, maxHp: 195, maxShield: 125, maxEnergy: 175, baseCooldown: 0.47, damageMultiplier: 0.9, shotSpeedMultiplier: 1.15, energyRegenMultiplier: 0.8, shieldRegenMultiplier: 3.8, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 68700, unlocked: false },
  { id: 'atlas-106', name: 'Atlas 106', tier: 'legendary', speed: 326, maxHp: 196, maxShield: 126, maxEnergy: 176, baseCooldown: 0.46, damageMultiplier: 0.91, shotSpeedMultiplier: 1.16, energyRegenMultiplier: 0.82, shieldRegenMultiplier: 3.88, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 69340, unlocked: false },
  { id: 'atlas-107', name: 'Atlas 107', tier: 'exotic', speed: 327, maxHp: 197, maxShield: 127, maxEnergy: 177, baseCooldown: 0.45, damageMultiplier: 0.92, shotSpeedMultiplier: 1.17, energyRegenMultiplier: 0.84, shieldRegenMultiplier: 3.96, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 69980, unlocked: false },
  { id: 'atlas-108', name: 'Atlas 108', tier: 'common', speed: 328, maxHp: 198, maxShield: 128, maxEnergy: 178, baseCooldown: 0.44, damageMultiplier: 0.94, shotSpeedMultiplier: 1.18, energyRegenMultiplier: 0.86, shieldRegenMultiplier: 4.04, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 70620, unlocked: false },
  { id: 'atlas-109', name: 'Atlas 109', tier: 'uncommon', speed: 329, maxHp: 199, maxShield: 129, maxEnergy: 179, baseCooldown: 0.43, damageMultiplier: 0.95, shotSpeedMultiplier: 1.19, energyRegenMultiplier: 0.88, shieldRegenMultiplier: 4.12, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 71260, unlocked: false },
  { id: 'atlas-110', name: 'Atlas 110', tier: 'rare', speed: 330, maxHp: 200, maxShield: 130, maxEnergy: 180, baseCooldown: 0.42, damageMultiplier: 0.96, shotSpeedMultiplier: 1.2, energyRegenMultiplier: 0.9, shieldRegenMultiplier: 4.2, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 71900, unlocked: false },
  { id: 'atlas-111', name: 'Atlas 111', tier: 'mythic', speed: 331, maxHp: 201, maxShield: 131, maxEnergy: 181, baseCooldown: 0.41, damageMultiplier: 0.97, shotSpeedMultiplier: 1.21, energyRegenMultiplier: 0.92, shieldRegenMultiplier: 4.28, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 72540, unlocked: false },
  { id: 'atlas-112', name: 'Atlas 112', tier: 'legendary', speed: 332, maxHp: 202, maxShield: 132, maxEnergy: 182, baseCooldown: 0.68, damageMultiplier: 0.98, shotSpeedMultiplier: 1.22, energyRegenMultiplier: 0.94, shieldRegenMultiplier: 4.36, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 73180, unlocked: false },
  { id: 'atlas-113', name: 'Atlas 113', tier: 'exotic', speed: 333, maxHp: 203, maxShield: 133, maxEnergy: 183, baseCooldown: 0.67, damageMultiplier: 1, shotSpeedMultiplier: 1.23, energyRegenMultiplier: 0.96, shieldRegenMultiplier: 4.44, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 73820, unlocked: false },
  { id: 'atlas-114', name: 'Atlas 114', tier: 'common', speed: 334, maxHp: 204, maxShield: 134, maxEnergy: 184, baseCooldown: 0.66, damageMultiplier: 1.01, shotSpeedMultiplier: 1.24, energyRegenMultiplier: 0.98, shieldRegenMultiplier: 4.52, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 74460, unlocked: false },
  { id: 'atlas-115', name: 'Atlas 115', tier: 'uncommon', speed: 335, maxHp: 205, maxShield: 135, maxEnergy: 185, baseCooldown: 0.65, damageMultiplier: 1.02, shotSpeedMultiplier: 1.25, energyRegenMultiplier: 1, shieldRegenMultiplier: 4.6, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 75100, unlocked: false },
  { id: 'atlas-116', name: 'Atlas 116', tier: 'rare', speed: 336, maxHp: 206, maxShield: 136, maxEnergy: 186, baseCooldown: 0.64, damageMultiplier: 1.03, shotSpeedMultiplier: 1.26, energyRegenMultiplier: 1.02, shieldRegenMultiplier: 4.68, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 75740, unlocked: false },
  { id: 'atlas-117', name: 'Atlas 117', tier: 'mythic', speed: 337, maxHp: 207, maxShield: 137, maxEnergy: 187, baseCooldown: 0.63, damageMultiplier: 1.04, shotSpeedMultiplier: 1.27, energyRegenMultiplier: 1.04, shieldRegenMultiplier: 4.76, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 76380, unlocked: false },
  { id: 'atlas-118', name: 'Atlas 118', tier: 'legendary', speed: 338, maxHp: 208, maxShield: 138, maxEnergy: 188, baseCooldown: 0.62, damageMultiplier: 1.06, shotSpeedMultiplier: 1.28, energyRegenMultiplier: 1.06, shieldRegenMultiplier: 4.84, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 77020, unlocked: false },
  { id: 'atlas-119', name: 'Atlas 119', tier: 'exotic', speed: 339, maxHp: 209, maxShield: 139, maxEnergy: 189, baseCooldown: 0.61, damageMultiplier: 1.07, shotSpeedMultiplier: 1.29, energyRegenMultiplier: 1.08, shieldRegenMultiplier: 4.92, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 77660, unlocked: false },
  { id: 'atlas-120', name: 'Atlas 120', tier: 'common', speed: 340, maxHp: 210, maxShield: 20, maxEnergy: 190, baseCooldown: 0.6, damageMultiplier: 1.08, shotSpeedMultiplier: 1.3, energyRegenMultiplier: 1.1, shieldRegenMultiplier: 5, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 78300, unlocked: false },
  { id: 'atlas-121', name: 'Atlas 121', tier: 'uncommon', speed: 341, maxHp: 211, maxShield: 21, maxEnergy: 191, baseCooldown: 0.59, damageMultiplier: 1.09, shotSpeedMultiplier: 1.31, energyRegenMultiplier: 1.12, shieldRegenMultiplier: 5.08, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 78940, unlocked: false },
  { id: 'atlas-122', name: 'Atlas 122', tier: 'rare', speed: 342, maxHp: 212, maxShield: 22, maxEnergy: 192, baseCooldown: 0.58, damageMultiplier: 1.1, shotSpeedMultiplier: 1.32, energyRegenMultiplier: 1.14, shieldRegenMultiplier: 5.16, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 79580, unlocked: false },
  { id: 'atlas-123', name: 'Atlas 123', tier: 'mythic', speed: 343, maxHp: 213, maxShield: 23, maxEnergy: 193, baseCooldown: 0.57, damageMultiplier: 1.12, shotSpeedMultiplier: 1.33, energyRegenMultiplier: 1.16, shieldRegenMultiplier: 5.24, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 80220, unlocked: false },
  { id: 'atlas-124', name: 'Atlas 124', tier: 'legendary', speed: 344, maxHp: 214, maxShield: 24, maxEnergy: 194, baseCooldown: 0.56, damageMultiplier: 1.13, shotSpeedMultiplier: 1.34, energyRegenMultiplier: 1.18, shieldRegenMultiplier: 5.32, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 80860, unlocked: false },
  { id: 'atlas-125', name: 'Atlas 125', tier: 'exotic', speed: 345, maxHp: 215, maxShield: 25, maxEnergy: 195, baseCooldown: 0.55, damageMultiplier: 1.14, shotSpeedMultiplier: 1.35, energyRegenMultiplier: 1.2, shieldRegenMultiplier: 5.4, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 81500, unlocked: false },
  { id: 'atlas-126', name: 'Atlas 126', tier: 'common', speed: 346, maxHp: 216, maxShield: 26, maxEnergy: 196, baseCooldown: 0.54, damageMultiplier: 1.15, shotSpeedMultiplier: 1.36, energyRegenMultiplier: 1.22, shieldRegenMultiplier: 5.48, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 82140, unlocked: false },
  { id: 'atlas-127', name: 'Atlas 127', tier: 'uncommon', speed: 347, maxHp: 217, maxShield: 27, maxEnergy: 197, baseCooldown: 0.53, damageMultiplier: 1.16, shotSpeedMultiplier: 1.37, energyRegenMultiplier: 1.24, shieldRegenMultiplier: 5.56, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 82780, unlocked: false },
  { id: 'atlas-128', name: 'Atlas 128', tier: 'rare', speed: 348, maxHp: 218, maxShield: 28, maxEnergy: 198, baseCooldown: 0.52, damageMultiplier: 1.18, shotSpeedMultiplier: 1.38, energyRegenMultiplier: 1.26, shieldRegenMultiplier: 5.64, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 83420, unlocked: false },
  { id: 'atlas-129', name: 'Atlas 129', tier: 'mythic', speed: 349, maxHp: 219, maxShield: 29, maxEnergy: 199, baseCooldown: 0.51, damageMultiplier: 1.19, shotSpeedMultiplier: 1.39, energyRegenMultiplier: 1.28, shieldRegenMultiplier: 5.72, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 84060, unlocked: false },
  { id: 'atlas-130', name: 'Atlas 130', tier: 'legendary', speed: 350, maxHp: 220, maxShield: 30, maxEnergy: 200, baseCooldown: 0.5, damageMultiplier: 1.2, shotSpeedMultiplier: 1.4, energyRegenMultiplier: 1.3, shieldRegenMultiplier: 5.8, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 84700, unlocked: false },
  { id: 'atlas-131', name: 'Atlas 131', tier: 'exotic', speed: 351, maxHp: 221, maxShield: 31, maxEnergy: 201, baseCooldown: 0.49, damageMultiplier: 1.21, shotSpeedMultiplier: 1.41, energyRegenMultiplier: 1.32, shieldRegenMultiplier: 5.88, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 85340, unlocked: false },
  { id: 'atlas-132', name: 'Atlas 132', tier: 'common', speed: 352, maxHp: 222, maxShield: 32, maxEnergy: 202, baseCooldown: 0.48, damageMultiplier: 1.22, shotSpeedMultiplier: 1.42, energyRegenMultiplier: 1.34, shieldRegenMultiplier: 5.96, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 85980, unlocked: false },
  { id: 'atlas-133', name: 'Atlas 133', tier: 'uncommon', speed: 353, maxHp: 223, maxShield: 33, maxEnergy: 203, baseCooldown: 0.47, damageMultiplier: 1.24, shotSpeedMultiplier: 1.43, energyRegenMultiplier: 1.36, shieldRegenMultiplier: 6.04, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 86620, unlocked: false },
  { id: 'atlas-134', name: 'Atlas 134', tier: 'rare', speed: 354, maxHp: 224, maxShield: 34, maxEnergy: 204, baseCooldown: 0.46, damageMultiplier: 1.25, shotSpeedMultiplier: 1.44, energyRegenMultiplier: 1.38, shieldRegenMultiplier: 6.12, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 87260, unlocked: false },
  { id: 'atlas-135', name: 'Atlas 135', tier: 'mythic', speed: 355, maxHp: 225, maxShield: 35, maxEnergy: 205, baseCooldown: 0.45, damageMultiplier: 1.26, shotSpeedMultiplier: 1.45, energyRegenMultiplier: 1.4, shieldRegenMultiplier: 6.2, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 87900, unlocked: false },
  { id: 'atlas-136', name: 'Atlas 136', tier: 'legendary', speed: 356, maxHp: 226, maxShield: 36, maxEnergy: 206, baseCooldown: 0.44, damageMultiplier: 1.27, shotSpeedMultiplier: 1.46, energyRegenMultiplier: 1.42, shieldRegenMultiplier: 6.28, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 88540, unlocked: false },
  { id: 'atlas-137', name: 'Atlas 137', tier: 'exotic', speed: 357, maxHp: 227, maxShield: 37, maxEnergy: 207, baseCooldown: 0.43, damageMultiplier: 1.28, shotSpeedMultiplier: 1.47, energyRegenMultiplier: 1.44, shieldRegenMultiplier: 6.36, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 89180, unlocked: false },
  { id: 'atlas-138', name: 'Atlas 138', tier: 'common', speed: 358, maxHp: 228, maxShield: 38, maxEnergy: 208, baseCooldown: 0.42, damageMultiplier: 1.3, shotSpeedMultiplier: 1.48, energyRegenMultiplier: 1.46, shieldRegenMultiplier: 6.44, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 89820, unlocked: false },
  { id: 'atlas-139', name: 'Atlas 139', tier: 'uncommon', speed: 359, maxHp: 229, maxShield: 39, maxEnergy: 209, baseCooldown: 0.41, damageMultiplier: 1.31, shotSpeedMultiplier: 1.49, energyRegenMultiplier: 1.48, shieldRegenMultiplier: 6.52, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 90460, unlocked: false },
  { id: 'atlas-140', name: 'Atlas 140', tier: 'rare', speed: 360, maxHp: 230, maxShield: 40, maxEnergy: 210, baseCooldown: 0.68, damageMultiplier: 1.32, shotSpeedMultiplier: 0.8, energyRegenMultiplier: 1.5, shieldRegenMultiplier: 1, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 91100, unlocked: false },
  { id: 'atlas-141', name: 'Atlas 141', tier: 'mythic', speed: 361, maxHp: 231, maxShield: 41, maxEnergy: 211, baseCooldown: 0.67, damageMultiplier: 1.33, shotSpeedMultiplier: 0.81, energyRegenMultiplier: 1.52, shieldRegenMultiplier: 1.08, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 91740, unlocked: false },
  { id: 'atlas-142', name: 'Atlas 142', tier: 'legendary', speed: 362, maxHp: 232, maxShield: 42, maxEnergy: 212, baseCooldown: 0.66, damageMultiplier: 1.34, shotSpeedMultiplier: 0.82, energyRegenMultiplier: 1.54, shieldRegenMultiplier: 1.16, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 92380, unlocked: false },
  { id: 'atlas-143', name: 'Atlas 143', tier: 'exotic', speed: 363, maxHp: 233, maxShield: 43, maxEnergy: 213, baseCooldown: 0.65, damageMultiplier: 1.36, shotSpeedMultiplier: 0.83, energyRegenMultiplier: 1.56, shieldRegenMultiplier: 1.24, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 93020, unlocked: false },
  { id: 'atlas-144', name: 'Atlas 144', tier: 'common', speed: 364, maxHp: 234, maxShield: 44, maxEnergy: 214, baseCooldown: 0.64, damageMultiplier: 1.37, shotSpeedMultiplier: 0.84, energyRegenMultiplier: 1.58, shieldRegenMultiplier: 1.32, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 93660, unlocked: false },
  { id: 'atlas-145', name: 'Atlas 145', tier: 'uncommon', speed: 365, maxHp: 235, maxShield: 45, maxEnergy: 215, baseCooldown: 0.63, damageMultiplier: 1.38, shotSpeedMultiplier: 0.85, energyRegenMultiplier: 1.6, shieldRegenMultiplier: 1.4, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 94300, unlocked: false },
  { id: 'atlas-146', name: 'Atlas 146', tier: 'rare', speed: 366, maxHp: 236, maxShield: 46, maxEnergy: 216, baseCooldown: 0.62, damageMultiplier: 1.39, shotSpeedMultiplier: 0.86, energyRegenMultiplier: 1.62, shieldRegenMultiplier: 1.48, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 94940, unlocked: false },
  { id: 'atlas-147', name: 'Atlas 147', tier: 'mythic', speed: 367, maxHp: 237, maxShield: 47, maxEnergy: 217, baseCooldown: 0.61, damageMultiplier: 1.4, shotSpeedMultiplier: 0.87, energyRegenMultiplier: 1.64, shieldRegenMultiplier: 1.56, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 95580, unlocked: false },
  { id: 'atlas-148', name: 'Atlas 148', tier: 'legendary', speed: 368, maxHp: 238, maxShield: 48, maxEnergy: 218, baseCooldown: 0.6, damageMultiplier: 1.42, shotSpeedMultiplier: 0.88, energyRegenMultiplier: 1.66, shieldRegenMultiplier: 1.64, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 96220, unlocked: false },
  { id: 'atlas-149', name: 'Atlas 149', tier: 'exotic', speed: 369, maxHp: 239, maxShield: 49, maxEnergy: 219, baseCooldown: 0.59, damageMultiplier: 1.43, shotSpeedMultiplier: 0.89, energyRegenMultiplier: 1.68, shieldRegenMultiplier: 1.72, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 96860, unlocked: false },
  { id: 'atlas-150', name: 'Atlas 150', tier: 'common', speed: 370, maxHp: 240, maxShield: 50, maxEnergy: 70, baseCooldown: 0.58, damageMultiplier: 1.44, shotSpeedMultiplier: 0.9, energyRegenMultiplier: 1.7, shieldRegenMultiplier: 1.8, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 97500, unlocked: false },
  { id: 'atlas-151', name: 'Atlas 151', tier: 'uncommon', speed: 371, maxHp: 241, maxShield: 51, maxEnergy: 71, baseCooldown: 0.57, damageMultiplier: 1.45, shotSpeedMultiplier: 0.91, energyRegenMultiplier: 1.72, shieldRegenMultiplier: 1.88, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 98140, unlocked: false },
  { id: 'atlas-152', name: 'Atlas 152', tier: 'rare', speed: 372, maxHp: 242, maxShield: 52, maxEnergy: 72, baseCooldown: 0.56, damageMultiplier: 1.46, shotSpeedMultiplier: 0.92, energyRegenMultiplier: 1.74, shieldRegenMultiplier: 1.96, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 98780, unlocked: false },
  { id: 'atlas-153', name: 'Atlas 153', tier: 'mythic', speed: 373, maxHp: 243, maxShield: 53, maxEnergy: 73, baseCooldown: 0.55, damageMultiplier: 1.48, shotSpeedMultiplier: 0.93, energyRegenMultiplier: 1.76, shieldRegenMultiplier: 2.04, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 99420, unlocked: false },
  { id: 'atlas-154', name: 'Atlas 154', tier: 'legendary', speed: 374, maxHp: 244, maxShield: 54, maxEnergy: 74, baseCooldown: 0.54, damageMultiplier: 1.49, shotSpeedMultiplier: 0.94, energyRegenMultiplier: 1.78, shieldRegenMultiplier: 2.12, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 100060, unlocked: false },
  { id: 'atlas-155', name: 'Atlas 155', tier: 'exotic', speed: 375, maxHp: 245, maxShield: 55, maxEnergy: 75, baseCooldown: 0.53, damageMultiplier: 1.5, shotSpeedMultiplier: 0.95, energyRegenMultiplier: 1.8, shieldRegenMultiplier: 2.2, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 100700, unlocked: false },
  { id: 'atlas-156', name: 'Atlas 156', tier: 'common', speed: 376, maxHp: 246, maxShield: 56, maxEnergy: 76, baseCooldown: 0.52, damageMultiplier: 1.51, shotSpeedMultiplier: 0.96, energyRegenMultiplier: 1.82, shieldRegenMultiplier: 2.28, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 101340, unlocked: false },
  { id: 'atlas-157', name: 'Atlas 157', tier: 'uncommon', speed: 377, maxHp: 247, maxShield: 57, maxEnergy: 77, baseCooldown: 0.51, damageMultiplier: 1.52, shotSpeedMultiplier: 0.97, energyRegenMultiplier: 1.84, shieldRegenMultiplier: 2.36, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 101980, unlocked: false },
  { id: 'atlas-158', name: 'Atlas 158', tier: 'rare', speed: 378, maxHp: 248, maxShield: 58, maxEnergy: 78, baseCooldown: 0.5, damageMultiplier: 1.54, shotSpeedMultiplier: 0.98, energyRegenMultiplier: 1.86, shieldRegenMultiplier: 2.44, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 102620, unlocked: false },
  { id: 'atlas-159', name: 'Atlas 159', tier: 'mythic', speed: 379, maxHp: 249, maxShield: 59, maxEnergy: 79, baseCooldown: 0.49, damageMultiplier: 1.55, shotSpeedMultiplier: 0.99, energyRegenMultiplier: 1.88, shieldRegenMultiplier: 2.52, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 103260, unlocked: false },
  { id: 'atlas-160', name: 'Atlas 160', tier: 'legendary', speed: 380, maxHp: 250, maxShield: 60, maxEnergy: 80, baseCooldown: 0.48, damageMultiplier: 1.56, shotSpeedMultiplier: 1, energyRegenMultiplier: 0.3, shieldRegenMultiplier: 2.6, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 103900, unlocked: false },
  { id: 'atlas-161', name: 'Atlas 161', tier: 'exotic', speed: 381, maxHp: 251, maxShield: 61, maxEnergy: 81, baseCooldown: 0.47, damageMultiplier: 1.57, shotSpeedMultiplier: 1.01, energyRegenMultiplier: 0.32, shieldRegenMultiplier: 2.68, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 104540, unlocked: false },
  { id: 'atlas-162', name: 'Atlas 162', tier: 'common', speed: 382, maxHp: 252, maxShield: 62, maxEnergy: 82, baseCooldown: 0.46, damageMultiplier: 1.58, shotSpeedMultiplier: 1.02, energyRegenMultiplier: 0.34, shieldRegenMultiplier: 2.76, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 105180, unlocked: false },
  { id: 'atlas-163', name: 'Atlas 163', tier: 'uncommon', speed: 383, maxHp: 253, maxShield: 63, maxEnergy: 83, baseCooldown: 0.45, damageMultiplier: 1.6, shotSpeedMultiplier: 1.03, energyRegenMultiplier: 0.36, shieldRegenMultiplier: 2.84, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 105820, unlocked: false },
  { id: 'atlas-164', name: 'Atlas 164', tier: 'rare', speed: 384, maxHp: 254, maxShield: 64, maxEnergy: 84, baseCooldown: 0.44, damageMultiplier: 1.61, shotSpeedMultiplier: 1.04, energyRegenMultiplier: 0.38, shieldRegenMultiplier: 2.92, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 106460, unlocked: false },
  { id: 'atlas-165', name: 'Atlas 165', tier: 'mythic', speed: 385, maxHp: 255, maxShield: 65, maxEnergy: 85, baseCooldown: 0.43, damageMultiplier: 1.62, shotSpeedMultiplier: 1.05, energyRegenMultiplier: 0.4, shieldRegenMultiplier: 3, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 107100, unlocked: false },
  { id: 'atlas-166', name: 'Atlas 166', tier: 'legendary', speed: 386, maxHp: 256, maxShield: 66, maxEnergy: 86, baseCooldown: 0.42, damageMultiplier: 1.63, shotSpeedMultiplier: 1.06, energyRegenMultiplier: 0.42, shieldRegenMultiplier: 3.08, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 107740, unlocked: false },
  { id: 'atlas-167', name: 'Atlas 167', tier: 'exotic', speed: 387, maxHp: 257, maxShield: 67, maxEnergy: 87, baseCooldown: 0.41, damageMultiplier: 1.64, shotSpeedMultiplier: 1.07, energyRegenMultiplier: 0.44, shieldRegenMultiplier: 3.16, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 108380, unlocked: false },
  { id: 'atlas-168', name: 'Atlas 168', tier: 'common', speed: 388, maxHp: 258, maxShield: 68, maxEnergy: 88, baseCooldown: 0.68, damageMultiplier: 1.66, shotSpeedMultiplier: 1.08, energyRegenMultiplier: 0.46, shieldRegenMultiplier: 3.24, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 109020, unlocked: false },
  { id: 'atlas-169', name: 'Atlas 169', tier: 'uncommon', speed: 389, maxHp: 259, maxShield: 69, maxEnergy: 89, baseCooldown: 0.67, damageMultiplier: 1.67, shotSpeedMultiplier: 1.09, energyRegenMultiplier: 0.48, shieldRegenMultiplier: 3.32, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 109660, unlocked: false },
  { id: 'atlas-170', name: 'Atlas 170', tier: 'rare', speed: 390, maxHp: 260, maxShield: 70, maxEnergy: 90, baseCooldown: 0.66, damageMultiplier: 1.68, shotSpeedMultiplier: 1.1, energyRegenMultiplier: 0.5, shieldRegenMultiplier: 3.4, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 110300, unlocked: false },
  { id: 'atlas-171', name: 'Atlas 171', tier: 'mythic', speed: 391, maxHp: 261, maxShield: 71, maxEnergy: 91, baseCooldown: 0.65, damageMultiplier: 1.69, shotSpeedMultiplier: 1.11, energyRegenMultiplier: 0.52, shieldRegenMultiplier: 3.48, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 110940, unlocked: false },
  { id: 'atlas-172', name: 'Atlas 172', tier: 'legendary', speed: 392, maxHp: 262, maxShield: 72, maxEnergy: 92, baseCooldown: 0.64, damageMultiplier: 1.7, shotSpeedMultiplier: 1.12, energyRegenMultiplier: 0.54, shieldRegenMultiplier: 3.56, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 111580, unlocked: false },
  { id: 'atlas-173', name: 'Atlas 173', tier: 'exotic', speed: 393, maxHp: 263, maxShield: 73, maxEnergy: 93, baseCooldown: 0.63, damageMultiplier: 1.72, shotSpeedMultiplier: 1.13, energyRegenMultiplier: 0.56, shieldRegenMultiplier: 3.64, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 112220, unlocked: false },
  { id: 'atlas-174', name: 'Atlas 174', tier: 'common', speed: 394, maxHp: 264, maxShield: 74, maxEnergy: 94, baseCooldown: 0.62, damageMultiplier: 1.73, shotSpeedMultiplier: 1.14, energyRegenMultiplier: 0.58, shieldRegenMultiplier: 3.72, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 112860, unlocked: false },
  { id: 'atlas-175', name: 'Atlas 175', tier: 'uncommon', speed: 395, maxHp: 265, maxShield: 75, maxEnergy: 95, baseCooldown: 0.61, damageMultiplier: 1.74, shotSpeedMultiplier: 1.15, energyRegenMultiplier: 0.6, shieldRegenMultiplier: 3.8, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 113500, unlocked: false },
  { id: 'atlas-176', name: 'Atlas 176', tier: 'rare', speed: 396, maxHp: 266, maxShield: 76, maxEnergy: 96, baseCooldown: 0.6, damageMultiplier: 1.75, shotSpeedMultiplier: 1.16, energyRegenMultiplier: 0.62, shieldRegenMultiplier: 3.88, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 114140, unlocked: false },
  { id: 'atlas-177', name: 'Atlas 177', tier: 'mythic', speed: 397, maxHp: 267, maxShield: 77, maxEnergy: 97, baseCooldown: 0.59, damageMultiplier: 1.76, shotSpeedMultiplier: 1.17, energyRegenMultiplier: 0.64, shieldRegenMultiplier: 3.96, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 114780, unlocked: false },
  { id: 'atlas-178', name: 'Atlas 178', tier: 'legendary', speed: 398, maxHp: 268, maxShield: 78, maxEnergy: 98, baseCooldown: 0.58, damageMultiplier: 1.78, shotSpeedMultiplier: 1.18, energyRegenMultiplier: 0.66, shieldRegenMultiplier: 4.04, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 115420, unlocked: false },
  { id: 'atlas-179', name: 'Atlas 179', tier: 'exotic', speed: 399, maxHp: 269, maxShield: 79, maxEnergy: 99, baseCooldown: 0.57, damageMultiplier: 1.79, shotSpeedMultiplier: 1.19, energyRegenMultiplier: 0.68, shieldRegenMultiplier: 4.12, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 116060, unlocked: false },
  { id: 'atlas-180', name: 'Atlas 180', tier: 'common', speed: 220, maxHp: 270, maxShield: 80, maxEnergy: 100, baseCooldown: 0.56, damageMultiplier: 0.72, shotSpeedMultiplier: 1.2, energyRegenMultiplier: 0.7, shieldRegenMultiplier: 4.2, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 116700, unlocked: false },
  { id: 'atlas-181', name: 'Atlas 181', tier: 'uncommon', speed: 221, maxHp: 271, maxShield: 81, maxEnergy: 101, baseCooldown: 0.55, damageMultiplier: 0.73, shotSpeedMultiplier: 1.21, energyRegenMultiplier: 0.72, shieldRegenMultiplier: 4.28, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 117340, unlocked: false },
  { id: 'atlas-182', name: 'Atlas 182', tier: 'rare', speed: 222, maxHp: 272, maxShield: 82, maxEnergy: 102, baseCooldown: 0.54, damageMultiplier: 0.74, shotSpeedMultiplier: 1.22, energyRegenMultiplier: 0.74, shieldRegenMultiplier: 4.36, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 117980, unlocked: false },
  { id: 'atlas-183', name: 'Atlas 183', tier: 'mythic', speed: 223, maxHp: 273, maxShield: 83, maxEnergy: 103, baseCooldown: 0.53, damageMultiplier: 0.76, shotSpeedMultiplier: 1.23, energyRegenMultiplier: 0.76, shieldRegenMultiplier: 4.44, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 118620, unlocked: false },
  { id: 'atlas-184', name: 'Atlas 184', tier: 'legendary', speed: 224, maxHp: 274, maxShield: 84, maxEnergy: 104, baseCooldown: 0.52, damageMultiplier: 0.77, shotSpeedMultiplier: 1.24, energyRegenMultiplier: 0.78, shieldRegenMultiplier: 4.52, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 119260, unlocked: false },
  { id: 'atlas-185', name: 'Atlas 185', tier: 'exotic', speed: 225, maxHp: 275, maxShield: 85, maxEnergy: 105, baseCooldown: 0.51, damageMultiplier: 0.78, shotSpeedMultiplier: 1.25, energyRegenMultiplier: 0.8, shieldRegenMultiplier: 4.6, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 119900, unlocked: false },
  { id: 'atlas-186', name: 'Atlas 186', tier: 'common', speed: 226, maxHp: 276, maxShield: 86, maxEnergy: 106, baseCooldown: 0.5, damageMultiplier: 0.79, shotSpeedMultiplier: 1.26, energyRegenMultiplier: 0.82, shieldRegenMultiplier: 4.68, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 120540, unlocked: false },
  { id: 'atlas-187', name: 'Atlas 187', tier: 'uncommon', speed: 227, maxHp: 277, maxShield: 87, maxEnergy: 107, baseCooldown: 0.49, damageMultiplier: 0.8, shotSpeedMultiplier: 1.27, energyRegenMultiplier: 0.84, shieldRegenMultiplier: 4.76, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 121180, unlocked: false },
  { id: 'atlas-188', name: 'Atlas 188', tier: 'rare', speed: 228, maxHp: 278, maxShield: 88, maxEnergy: 108, baseCooldown: 0.48, damageMultiplier: 0.82, shotSpeedMultiplier: 1.28, energyRegenMultiplier: 0.86, shieldRegenMultiplier: 4.84, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 121820, unlocked: false },
  { id: 'atlas-189', name: 'Atlas 189', tier: 'mythic', speed: 229, maxHp: 279, maxShield: 89, maxEnergy: 109, baseCooldown: 0.47, damageMultiplier: 0.83, shotSpeedMultiplier: 1.29, energyRegenMultiplier: 0.88, shieldRegenMultiplier: 4.92, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 122460, unlocked: false },
  { id: 'atlas-190', name: 'Atlas 190', tier: 'legendary', speed: 230, maxHp: 90, maxShield: 90, maxEnergy: 110, baseCooldown: 0.46, damageMultiplier: 0.84, shotSpeedMultiplier: 1.3, energyRegenMultiplier: 0.9, shieldRegenMultiplier: 5, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 123100, unlocked: false },
  { id: 'atlas-191', name: 'Atlas 191', tier: 'exotic', speed: 231, maxHp: 91, maxShield: 91, maxEnergy: 111, baseCooldown: 0.45, damageMultiplier: 0.85, shotSpeedMultiplier: 1.31, energyRegenMultiplier: 0.92, shieldRegenMultiplier: 5.08, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 123740, unlocked: false },
  { id: 'atlas-192', name: 'Atlas 192', tier: 'common', speed: 232, maxHp: 92, maxShield: 92, maxEnergy: 112, baseCooldown: 0.44, damageMultiplier: 0.86, shotSpeedMultiplier: 1.32, energyRegenMultiplier: 0.94, shieldRegenMultiplier: 5.16, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 124380, unlocked: false },
  { id: 'atlas-193', name: 'Atlas 193', tier: 'uncommon', speed: 233, maxHp: 93, maxShield: 93, maxEnergy: 113, baseCooldown: 0.43, damageMultiplier: 0.88, shotSpeedMultiplier: 1.33, energyRegenMultiplier: 0.96, shieldRegenMultiplier: 5.24, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 125020, unlocked: false },
  { id: 'atlas-194', name: 'Atlas 194', tier: 'rare', speed: 234, maxHp: 94, maxShield: 94, maxEnergy: 114, baseCooldown: 0.42, damageMultiplier: 0.89, shotSpeedMultiplier: 1.34, energyRegenMultiplier: 0.98, shieldRegenMultiplier: 5.32, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 125660, unlocked: false },
  { id: 'atlas-195', name: 'Atlas 195', tier: 'mythic', speed: 235, maxHp: 95, maxShield: 95, maxEnergy: 115, baseCooldown: 0.41, damageMultiplier: 0.9, shotSpeedMultiplier: 1.35, energyRegenMultiplier: 1, shieldRegenMultiplier: 5.4, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 126300, unlocked: false },
  { id: 'atlas-196', name: 'Atlas 196', tier: 'legendary', speed: 236, maxHp: 96, maxShield: 96, maxEnergy: 116, baseCooldown: 0.68, damageMultiplier: 0.91, shotSpeedMultiplier: 1.36, energyRegenMultiplier: 1.02, shieldRegenMultiplier: 5.48, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 126940, unlocked: false },
  { id: 'atlas-197', name: 'Atlas 197', tier: 'exotic', speed: 237, maxHp: 97, maxShield: 97, maxEnergy: 117, baseCooldown: 0.67, damageMultiplier: 0.92, shotSpeedMultiplier: 1.37, energyRegenMultiplier: 1.04, shieldRegenMultiplier: 5.56, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 127580, unlocked: false },
  { id: 'atlas-198', name: 'Atlas 198', tier: 'common', speed: 238, maxHp: 98, maxShield: 98, maxEnergy: 118, baseCooldown: 0.66, damageMultiplier: 0.94, shotSpeedMultiplier: 1.38, energyRegenMultiplier: 1.06, shieldRegenMultiplier: 5.64, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 128220, unlocked: false },
  { id: 'atlas-199', name: 'Atlas 199', tier: 'uncommon', speed: 239, maxHp: 99, maxShield: 99, maxEnergy: 119, baseCooldown: 0.65, damageMultiplier: 0.95, shotSpeedMultiplier: 1.39, energyRegenMultiplier: 1.08, shieldRegenMultiplier: 5.72, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 128860, unlocked: false },
  { id: 'atlas-200', name: 'Atlas 200', tier: 'rare', speed: 240, maxHp: 100, maxShield: 100, maxEnergy: 120, baseCooldown: 0.64, damageMultiplier: 0.96, shotSpeedMultiplier: 1.4, energyRegenMultiplier: 1.1, shieldRegenMultiplier: 5.8, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 129500, unlocked: false },
  { id: 'atlas-201', name: 'Atlas 201', tier: 'mythic', speed: 241, maxHp: 101, maxShield: 101, maxEnergy: 121, baseCooldown: 0.63, damageMultiplier: 0.97, shotSpeedMultiplier: 1.41, energyRegenMultiplier: 1.12, shieldRegenMultiplier: 5.88, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 130140, unlocked: false },
  { id: 'atlas-202', name: 'Atlas 202', tier: 'legendary', speed: 242, maxHp: 102, maxShield: 102, maxEnergy: 122, baseCooldown: 0.62, damageMultiplier: 0.98, shotSpeedMultiplier: 1.42, energyRegenMultiplier: 1.14, shieldRegenMultiplier: 5.96, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 130780, unlocked: false },
  { id: 'atlas-203', name: 'Atlas 203', tier: 'exotic', speed: 243, maxHp: 103, maxShield: 103, maxEnergy: 123, baseCooldown: 0.61, damageMultiplier: 1, shotSpeedMultiplier: 1.43, energyRegenMultiplier: 1.16, shieldRegenMultiplier: 6.04, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 131420, unlocked: false },
  { id: 'atlas-204', name: 'Atlas 204', tier: 'common', speed: 244, maxHp: 104, maxShield: 104, maxEnergy: 124, baseCooldown: 0.6, damageMultiplier: 1.01, shotSpeedMultiplier: 1.44, energyRegenMultiplier: 1.18, shieldRegenMultiplier: 6.12, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 132060, unlocked: false },
  { id: 'atlas-205', name: 'Atlas 205', tier: 'uncommon', speed: 245, maxHp: 105, maxShield: 105, maxEnergy: 125, baseCooldown: 0.59, damageMultiplier: 1.02, shotSpeedMultiplier: 1.45, energyRegenMultiplier: 1.2, shieldRegenMultiplier: 6.2, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 132700, unlocked: false },
  { id: 'atlas-206', name: 'Atlas 206', tier: 'rare', speed: 246, maxHp: 106, maxShield: 106, maxEnergy: 126, baseCooldown: 0.58, damageMultiplier: 1.03, shotSpeedMultiplier: 1.46, energyRegenMultiplier: 1.22, shieldRegenMultiplier: 6.28, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 133340, unlocked: false },
  { id: 'atlas-207', name: 'Atlas 207', tier: 'mythic', speed: 247, maxHp: 107, maxShield: 107, maxEnergy: 127, baseCooldown: 0.57, damageMultiplier: 1.04, shotSpeedMultiplier: 1.47, energyRegenMultiplier: 1.24, shieldRegenMultiplier: 6.36, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 133980, unlocked: false },
  { id: 'atlas-208', name: 'Atlas 208', tier: 'legendary', speed: 248, maxHp: 108, maxShield: 108, maxEnergy: 128, baseCooldown: 0.56, damageMultiplier: 1.06, shotSpeedMultiplier: 1.48, energyRegenMultiplier: 1.26, shieldRegenMultiplier: 6.44, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 134620, unlocked: false },
  { id: 'atlas-209', name: 'Atlas 209', tier: 'exotic', speed: 249, maxHp: 109, maxShield: 109, maxEnergy: 129, baseCooldown: 0.55, damageMultiplier: 1.07, shotSpeedMultiplier: 1.49, energyRegenMultiplier: 1.28, shieldRegenMultiplier: 6.52, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 135260, unlocked: false },
  { id: 'atlas-210', name: 'Atlas 210', tier: 'common', speed: 250, maxHp: 110, maxShield: 110, maxEnergy: 130, baseCooldown: 0.54, damageMultiplier: 1.08, shotSpeedMultiplier: 0.8, energyRegenMultiplier: 1.3, shieldRegenMultiplier: 1, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 135900, unlocked: false },
  { id: 'atlas-211', name: 'Atlas 211', tier: 'uncommon', speed: 251, maxHp: 111, maxShield: 111, maxEnergy: 131, baseCooldown: 0.53, damageMultiplier: 1.09, shotSpeedMultiplier: 0.81, energyRegenMultiplier: 1.32, shieldRegenMultiplier: 1.08, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 136540, unlocked: false },
  { id: 'atlas-212', name: 'Atlas 212', tier: 'rare', speed: 252, maxHp: 112, maxShield: 112, maxEnergy: 132, baseCooldown: 0.52, damageMultiplier: 1.1, shotSpeedMultiplier: 0.82, energyRegenMultiplier: 1.34, shieldRegenMultiplier: 1.16, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 137180, unlocked: false },
  { id: 'atlas-213', name: 'Atlas 213', tier: 'mythic', speed: 253, maxHp: 113, maxShield: 113, maxEnergy: 133, baseCooldown: 0.51, damageMultiplier: 1.12, shotSpeedMultiplier: 0.83, energyRegenMultiplier: 1.36, shieldRegenMultiplier: 1.24, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 137820, unlocked: false },
  { id: 'atlas-214', name: 'Atlas 214', tier: 'legendary', speed: 254, maxHp: 114, maxShield: 114, maxEnergy: 134, baseCooldown: 0.5, damageMultiplier: 1.13, shotSpeedMultiplier: 0.84, energyRegenMultiplier: 1.38, shieldRegenMultiplier: 1.32, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 138460, unlocked: false },
  { id: 'atlas-215', name: 'Atlas 215', tier: 'exotic', speed: 255, maxHp: 115, maxShield: 115, maxEnergy: 135, baseCooldown: 0.49, damageMultiplier: 1.14, shotSpeedMultiplier: 0.85, energyRegenMultiplier: 1.4, shieldRegenMultiplier: 1.4, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 139100, unlocked: false },
  { id: 'atlas-216', name: 'Atlas 216', tier: 'common', speed: 256, maxHp: 116, maxShield: 116, maxEnergy: 136, baseCooldown: 0.48, damageMultiplier: 1.15, shotSpeedMultiplier: 0.86, energyRegenMultiplier: 1.42, shieldRegenMultiplier: 1.48, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 139740, unlocked: false },
  { id: 'atlas-217', name: 'Atlas 217', tier: 'uncommon', speed: 257, maxHp: 117, maxShield: 117, maxEnergy: 137, baseCooldown: 0.47, damageMultiplier: 1.16, shotSpeedMultiplier: 0.87, energyRegenMultiplier: 1.44, shieldRegenMultiplier: 1.56, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 140380, unlocked: false },
  { id: 'atlas-218', name: 'Atlas 218', tier: 'rare', speed: 258, maxHp: 118, maxShield: 118, maxEnergy: 138, baseCooldown: 0.46, damageMultiplier: 1.18, shotSpeedMultiplier: 0.88, energyRegenMultiplier: 1.46, shieldRegenMultiplier: 1.64, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 141020, unlocked: false },
  { id: 'atlas-219', name: 'Atlas 219', tier: 'mythic', speed: 259, maxHp: 119, maxShield: 119, maxEnergy: 139, baseCooldown: 0.45, damageMultiplier: 1.19, shotSpeedMultiplier: 0.89, energyRegenMultiplier: 1.48, shieldRegenMultiplier: 1.72, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 141660, unlocked: false },
  { id: 'atlas-220', name: 'Atlas 220', tier: 'legendary', speed: 260, maxHp: 120, maxShield: 120, maxEnergy: 140, baseCooldown: 0.44, damageMultiplier: 1.2, shotSpeedMultiplier: 0.9, energyRegenMultiplier: 1.5, shieldRegenMultiplier: 1.8, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 142300, unlocked: false },
  { id: 'atlas-221', name: 'Atlas 221', tier: 'exotic', speed: 261, maxHp: 121, maxShield: 121, maxEnergy: 141, baseCooldown: 0.43, damageMultiplier: 1.21, shotSpeedMultiplier: 0.91, energyRegenMultiplier: 1.52, shieldRegenMultiplier: 1.88, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 142940, unlocked: false },
  { id: 'atlas-222', name: 'Atlas 222', tier: 'common', speed: 262, maxHp: 122, maxShield: 122, maxEnergy: 142, baseCooldown: 0.42, damageMultiplier: 1.22, shotSpeedMultiplier: 0.92, energyRegenMultiplier: 1.54, shieldRegenMultiplier: 1.96, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 143580, unlocked: false },
  { id: 'atlas-223', name: 'Atlas 223', tier: 'uncommon', speed: 263, maxHp: 123, maxShield: 123, maxEnergy: 143, baseCooldown: 0.41, damageMultiplier: 1.24, shotSpeedMultiplier: 0.93, energyRegenMultiplier: 1.56, shieldRegenMultiplier: 2.04, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 144220, unlocked: false },
  { id: 'atlas-224', name: 'Atlas 224', tier: 'rare', speed: 264, maxHp: 124, maxShield: 124, maxEnergy: 144, baseCooldown: 0.68, damageMultiplier: 1.25, shotSpeedMultiplier: 0.94, energyRegenMultiplier: 1.58, shieldRegenMultiplier: 2.12, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 144860, unlocked: false },
  { id: 'atlas-225', name: 'Atlas 225', tier: 'mythic', speed: 265, maxHp: 125, maxShield: 125, maxEnergy: 145, baseCooldown: 0.67, damageMultiplier: 1.26, shotSpeedMultiplier: 0.95, energyRegenMultiplier: 1.6, shieldRegenMultiplier: 2.2, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 145500, unlocked: false },
  { id: 'atlas-226', name: 'Atlas 226', tier: 'legendary', speed: 266, maxHp: 126, maxShield: 126, maxEnergy: 146, baseCooldown: 0.66, damageMultiplier: 1.27, shotSpeedMultiplier: 0.96, energyRegenMultiplier: 1.62, shieldRegenMultiplier: 2.28, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 146140, unlocked: false },
  { id: 'atlas-227', name: 'Atlas 227', tier: 'exotic', speed: 267, maxHp: 127, maxShield: 127, maxEnergy: 147, baseCooldown: 0.65, damageMultiplier: 1.28, shotSpeedMultiplier: 0.97, energyRegenMultiplier: 1.64, shieldRegenMultiplier: 2.36, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 146780, unlocked: false },
  { id: 'atlas-228', name: 'Atlas 228', tier: 'common', speed: 268, maxHp: 128, maxShield: 128, maxEnergy: 148, baseCooldown: 0.64, damageMultiplier: 1.3, shotSpeedMultiplier: 0.98, energyRegenMultiplier: 1.66, shieldRegenMultiplier: 2.44, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 147420, unlocked: false },
  { id: 'atlas-229', name: 'Atlas 229', tier: 'uncommon', speed: 269, maxHp: 129, maxShield: 129, maxEnergy: 149, baseCooldown: 0.63, damageMultiplier: 1.31, shotSpeedMultiplier: 0.99, energyRegenMultiplier: 1.68, shieldRegenMultiplier: 2.52, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 148060, unlocked: false },
  { id: 'atlas-230', name: 'Atlas 230', tier: 'rare', speed: 270, maxHp: 130, maxShield: 130, maxEnergy: 150, baseCooldown: 0.62, damageMultiplier: 1.32, shotSpeedMultiplier: 1, energyRegenMultiplier: 1.7, shieldRegenMultiplier: 2.6, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 148700, unlocked: false },
  { id: 'atlas-231', name: 'Atlas 231', tier: 'mythic', speed: 271, maxHp: 131, maxShield: 131, maxEnergy: 151, baseCooldown: 0.61, damageMultiplier: 1.33, shotSpeedMultiplier: 1.01, energyRegenMultiplier: 1.72, shieldRegenMultiplier: 2.68, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 149340, unlocked: false },
  { id: 'atlas-232', name: 'Atlas 232', tier: 'legendary', speed: 272, maxHp: 132, maxShield: 132, maxEnergy: 152, baseCooldown: 0.6, damageMultiplier: 1.34, shotSpeedMultiplier: 1.02, energyRegenMultiplier: 1.74, shieldRegenMultiplier: 2.76, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 149980, unlocked: false },
  { id: 'atlas-233', name: 'Atlas 233', tier: 'exotic', speed: 273, maxHp: 133, maxShield: 133, maxEnergy: 153, baseCooldown: 0.59, damageMultiplier: 1.36, shotSpeedMultiplier: 1.03, energyRegenMultiplier: 1.76, shieldRegenMultiplier: 2.84, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 150620, unlocked: false },
  { id: 'atlas-234', name: 'Atlas 234', tier: 'common', speed: 274, maxHp: 134, maxShield: 134, maxEnergy: 154, baseCooldown: 0.58, damageMultiplier: 1.37, shotSpeedMultiplier: 1.04, energyRegenMultiplier: 1.78, shieldRegenMultiplier: 2.92, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 151260, unlocked: false },
  { id: 'atlas-235', name: 'Atlas 235', tier: 'uncommon', speed: 275, maxHp: 135, maxShield: 135, maxEnergy: 155, baseCooldown: 0.57, damageMultiplier: 1.38, shotSpeedMultiplier: 1.05, energyRegenMultiplier: 1.8, shieldRegenMultiplier: 3, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 151900, unlocked: false },
  { id: 'atlas-236', name: 'Atlas 236', tier: 'rare', speed: 276, maxHp: 136, maxShield: 136, maxEnergy: 156, baseCooldown: 0.56, damageMultiplier: 1.39, shotSpeedMultiplier: 1.06, energyRegenMultiplier: 1.82, shieldRegenMultiplier: 3.08, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 152540, unlocked: false },
  { id: 'atlas-237', name: 'Atlas 237', tier: 'mythic', speed: 277, maxHp: 137, maxShield: 137, maxEnergy: 157, baseCooldown: 0.55, damageMultiplier: 1.4, shotSpeedMultiplier: 1.07, energyRegenMultiplier: 1.84, shieldRegenMultiplier: 3.16, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 153180, unlocked: false },
  { id: 'atlas-238', name: 'Atlas 238', tier: 'legendary', speed: 278, maxHp: 138, maxShield: 138, maxEnergy: 158, baseCooldown: 0.54, damageMultiplier: 1.42, shotSpeedMultiplier: 1.08, energyRegenMultiplier: 1.86, shieldRegenMultiplier: 3.24, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 153820, unlocked: false },
  { id: 'atlas-239', name: 'Atlas 239', tier: 'exotic', speed: 279, maxHp: 139, maxShield: 139, maxEnergy: 159, baseCooldown: 0.53, damageMultiplier: 1.43, shotSpeedMultiplier: 1.09, energyRegenMultiplier: 1.88, shieldRegenMultiplier: 3.32, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 154460, unlocked: false },
  { id: 'atlas-240', name: 'Atlas 240', tier: 'common', speed: 280, maxHp: 140, maxShield: 20, maxEnergy: 160, baseCooldown: 0.52, damageMultiplier: 1.44, shotSpeedMultiplier: 1.1, energyRegenMultiplier: 0.3, shieldRegenMultiplier: 3.4, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 155100, unlocked: false },
  { id: 'atlas-241', name: 'Atlas 241', tier: 'uncommon', speed: 281, maxHp: 141, maxShield: 21, maxEnergy: 161, baseCooldown: 0.51, damageMultiplier: 1.45, shotSpeedMultiplier: 1.11, energyRegenMultiplier: 0.32, shieldRegenMultiplier: 3.48, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 155740, unlocked: false },
  { id: 'atlas-242', name: 'Atlas 242', tier: 'rare', speed: 282, maxHp: 142, maxShield: 22, maxEnergy: 162, baseCooldown: 0.5, damageMultiplier: 1.46, shotSpeedMultiplier: 1.12, energyRegenMultiplier: 0.34, shieldRegenMultiplier: 3.56, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 156380, unlocked: false },
  { id: 'atlas-243', name: 'Atlas 243', tier: 'mythic', speed: 283, maxHp: 143, maxShield: 23, maxEnergy: 163, baseCooldown: 0.49, damageMultiplier: 1.48, shotSpeedMultiplier: 1.13, energyRegenMultiplier: 0.36, shieldRegenMultiplier: 3.64, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 157020, unlocked: false },
  { id: 'atlas-244', name: 'Atlas 244', tier: 'legendary', speed: 284, maxHp: 144, maxShield: 24, maxEnergy: 164, baseCooldown: 0.48, damageMultiplier: 1.49, shotSpeedMultiplier: 1.14, energyRegenMultiplier: 0.38, shieldRegenMultiplier: 3.72, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 157660, unlocked: false },
  { id: 'atlas-245', name: 'Atlas 245', tier: 'exotic', speed: 285, maxHp: 145, maxShield: 25, maxEnergy: 165, baseCooldown: 0.47, damageMultiplier: 1.5, shotSpeedMultiplier: 1.15, energyRegenMultiplier: 0.4, shieldRegenMultiplier: 3.8, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 158300, unlocked: false },
  { id: 'atlas-246', name: 'Atlas 246', tier: 'common', speed: 286, maxHp: 146, maxShield: 26, maxEnergy: 166, baseCooldown: 0.46, damageMultiplier: 1.51, shotSpeedMultiplier: 1.16, energyRegenMultiplier: 0.42, shieldRegenMultiplier: 3.88, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 158940, unlocked: false },
  { id: 'atlas-247', name: 'Atlas 247', tier: 'uncommon', speed: 287, maxHp: 147, maxShield: 27, maxEnergy: 167, baseCooldown: 0.45, damageMultiplier: 1.52, shotSpeedMultiplier: 1.17, energyRegenMultiplier: 0.44, shieldRegenMultiplier: 3.96, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 159580, unlocked: false },
  { id: 'atlas-248', name: 'Atlas 248', tier: 'rare', speed: 288, maxHp: 148, maxShield: 28, maxEnergy: 168, baseCooldown: 0.44, damageMultiplier: 1.54, shotSpeedMultiplier: 1.18, energyRegenMultiplier: 0.46, shieldRegenMultiplier: 4.04, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 160220, unlocked: false },
  { id: 'atlas-249', name: 'Atlas 249', tier: 'mythic', speed: 289, maxHp: 149, maxShield: 29, maxEnergy: 169, baseCooldown: 0.43, damageMultiplier: 1.55, shotSpeedMultiplier: 1.19, energyRegenMultiplier: 0.48, shieldRegenMultiplier: 4.12, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 160860, unlocked: false },
  { id: 'atlas-250', name: 'Atlas 250', tier: 'legendary', speed: 290, maxHp: 150, maxShield: 30, maxEnergy: 170, baseCooldown: 0.42, damageMultiplier: 1.56, shotSpeedMultiplier: 1.2, energyRegenMultiplier: 0.5, shieldRegenMultiplier: 4.2, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 161500, unlocked: false },
  { id: 'atlas-251', name: 'Atlas 251', tier: 'exotic', speed: 291, maxHp: 151, maxShield: 31, maxEnergy: 171, baseCooldown: 0.41, damageMultiplier: 1.57, shotSpeedMultiplier: 1.21, energyRegenMultiplier: 0.52, shieldRegenMultiplier: 4.28, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 162140, unlocked: false },
  { id: 'atlas-252', name: 'Atlas 252', tier: 'common', speed: 292, maxHp: 152, maxShield: 32, maxEnergy: 172, baseCooldown: 0.68, damageMultiplier: 1.58, shotSpeedMultiplier: 1.22, energyRegenMultiplier: 0.54, shieldRegenMultiplier: 4.36, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 162780, unlocked: false },
  { id: 'atlas-253', name: 'Atlas 253', tier: 'uncommon', speed: 293, maxHp: 153, maxShield: 33, maxEnergy: 173, baseCooldown: 0.67, damageMultiplier: 1.6, shotSpeedMultiplier: 1.23, energyRegenMultiplier: 0.56, shieldRegenMultiplier: 4.44, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 163420, unlocked: false },
  { id: 'atlas-254', name: 'Atlas 254', tier: 'rare', speed: 294, maxHp: 154, maxShield: 34, maxEnergy: 174, baseCooldown: 0.66, damageMultiplier: 1.61, shotSpeedMultiplier: 1.24, energyRegenMultiplier: 0.58, shieldRegenMultiplier: 4.52, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 164060, unlocked: false },
  { id: 'atlas-255', name: 'Atlas 255', tier: 'mythic', speed: 295, maxHp: 155, maxShield: 35, maxEnergy: 175, baseCooldown: 0.65, damageMultiplier: 1.62, shotSpeedMultiplier: 1.25, energyRegenMultiplier: 0.6, shieldRegenMultiplier: 4.6, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 164700, unlocked: false },
  { id: 'atlas-256', name: 'Atlas 256', tier: 'legendary', speed: 296, maxHp: 156, maxShield: 36, maxEnergy: 176, baseCooldown: 0.64, damageMultiplier: 1.63, shotSpeedMultiplier: 1.26, energyRegenMultiplier: 0.62, shieldRegenMultiplier: 4.68, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 165340, unlocked: false },
  { id: 'atlas-257', name: 'Atlas 257', tier: 'exotic', speed: 297, maxHp: 157, maxShield: 37, maxEnergy: 177, baseCooldown: 0.63, damageMultiplier: 1.64, shotSpeedMultiplier: 1.27, energyRegenMultiplier: 0.64, shieldRegenMultiplier: 4.76, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 165980, unlocked: false },
  { id: 'atlas-258', name: 'Atlas 258', tier: 'common', speed: 298, maxHp: 158, maxShield: 38, maxEnergy: 178, baseCooldown: 0.62, damageMultiplier: 1.66, shotSpeedMultiplier: 1.28, energyRegenMultiplier: 0.66, shieldRegenMultiplier: 4.84, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 166620, unlocked: false },
  { id: 'atlas-259', name: 'Atlas 259', tier: 'uncommon', speed: 299, maxHp: 159, maxShield: 39, maxEnergy: 179, baseCooldown: 0.61, damageMultiplier: 1.67, shotSpeedMultiplier: 1.29, energyRegenMultiplier: 0.68, shieldRegenMultiplier: 4.92, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 167260, unlocked: false },
  { id: 'atlas-260', name: 'Atlas 260', tier: 'rare', speed: 300, maxHp: 160, maxShield: 40, maxEnergy: 180, baseCooldown: 0.6, damageMultiplier: 1.68, shotSpeedMultiplier: 1.3, energyRegenMultiplier: 0.7, shieldRegenMultiplier: 5, abilities: [{ key: '1', name: 'Rapid Volley', cost: 40, type: 'rapidVolley' }, { key: '2', name: 'Chain Bolt', cost: 55, type: 'chainBolt' }, { key: '3', name: 'Energy Surge', cost: 60, type: 'energySurge' }], price: 167900, unlocked: false },
];

const MEGA_CODEX_APPENDIX_V2 = [
  'MEGA-0001 | Tactical archive entry 0001: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0002 | Tactical archive entry 0002: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0003 | Tactical archive entry 0003: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0004 | Tactical archive entry 0004: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0005 | Tactical archive entry 0005: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0006 | Tactical archive entry 0006: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0007 | Tactical archive entry 0007: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0008 | Tactical archive entry 0008: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0009 | Tactical archive entry 0009: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0010 | Tactical archive entry 0010: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0011 | Tactical archive entry 0011: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0012 | Tactical archive entry 0012: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0013 | Tactical archive entry 0013: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0014 | Tactical archive entry 0014: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0015 | Tactical archive entry 0015: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0016 | Tactical archive entry 0016: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0017 | Tactical archive entry 0017: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0018 | Tactical archive entry 0018: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0019 | Tactical archive entry 0019: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0020 | Tactical archive entry 0020: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0021 | Tactical archive entry 0021: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0022 | Tactical archive entry 0022: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0023 | Tactical archive entry 0023: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0024 | Tactical archive entry 0024: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0025 | Tactical archive entry 0025: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0026 | Tactical archive entry 0026: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0027 | Tactical archive entry 0027: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0028 | Tactical archive entry 0028: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0029 | Tactical archive entry 0029: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0030 | Tactical archive entry 0030: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0031 | Tactical archive entry 0031: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0032 | Tactical archive entry 0032: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0033 | Tactical archive entry 0033: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0034 | Tactical archive entry 0034: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0035 | Tactical archive entry 0035: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0036 | Tactical archive entry 0036: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0037 | Tactical archive entry 0037: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0038 | Tactical archive entry 0038: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0039 | Tactical archive entry 0039: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0040 | Tactical archive entry 0040: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0041 | Tactical archive entry 0041: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0042 | Tactical archive entry 0042: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0043 | Tactical archive entry 0043: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0044 | Tactical archive entry 0044: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0045 | Tactical archive entry 0045: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0046 | Tactical archive entry 0046: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0047 | Tactical archive entry 0047: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0048 | Tactical archive entry 0048: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0049 | Tactical archive entry 0049: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0050 | Tactical archive entry 0050: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0051 | Tactical archive entry 0051: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0052 | Tactical archive entry 0052: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0053 | Tactical archive entry 0053: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0054 | Tactical archive entry 0054: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0055 | Tactical archive entry 0055: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0056 | Tactical archive entry 0056: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0057 | Tactical archive entry 0057: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0058 | Tactical archive entry 0058: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0059 | Tactical archive entry 0059: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0060 | Tactical archive entry 0060: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0061 | Tactical archive entry 0061: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0062 | Tactical archive entry 0062: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0063 | Tactical archive entry 0063: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0064 | Tactical archive entry 0064: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0065 | Tactical archive entry 0065: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0066 | Tactical archive entry 0066: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0067 | Tactical archive entry 0067: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0068 | Tactical archive entry 0068: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0069 | Tactical archive entry 0069: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0070 | Tactical archive entry 0070: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0071 | Tactical archive entry 0071: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0072 | Tactical archive entry 0072: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0073 | Tactical archive entry 0073: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0074 | Tactical archive entry 0074: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0075 | Tactical archive entry 0075: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0076 | Tactical archive entry 0076: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0077 | Tactical archive entry 0077: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0078 | Tactical archive entry 0078: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0079 | Tactical archive entry 0079: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0080 | Tactical archive entry 0080: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0081 | Tactical archive entry 0081: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0082 | Tactical archive entry 0082: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0083 | Tactical archive entry 0083: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0084 | Tactical archive entry 0084: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0085 | Tactical archive entry 0085: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0086 | Tactical archive entry 0086: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0087 | Tactical archive entry 0087: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0088 | Tactical archive entry 0088: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0089 | Tactical archive entry 0089: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0090 | Tactical archive entry 0090: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0091 | Tactical archive entry 0091: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0092 | Tactical archive entry 0092: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0093 | Tactical archive entry 0093: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0094 | Tactical archive entry 0094: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0095 | Tactical archive entry 0095: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0096 | Tactical archive entry 0096: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0097 | Tactical archive entry 0097: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0098 | Tactical archive entry 0098: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0099 | Tactical archive entry 0099: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0100 | Tactical archive entry 0100: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0101 | Tactical archive entry 0101: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0102 | Tactical archive entry 0102: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0103 | Tactical archive entry 0103: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0104 | Tactical archive entry 0104: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0105 | Tactical archive entry 0105: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0106 | Tactical archive entry 0106: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0107 | Tactical archive entry 0107: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0108 | Tactical archive entry 0108: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0109 | Tactical archive entry 0109: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0110 | Tactical archive entry 0110: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0111 | Tactical archive entry 0111: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0112 | Tactical archive entry 0112: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0113 | Tactical archive entry 0113: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0114 | Tactical archive entry 0114: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0115 | Tactical archive entry 0115: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0116 | Tactical archive entry 0116: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0117 | Tactical archive entry 0117: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0118 | Tactical archive entry 0118: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0119 | Tactical archive entry 0119: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0120 | Tactical archive entry 0120: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0121 | Tactical archive entry 0121: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0122 | Tactical archive entry 0122: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0123 | Tactical archive entry 0123: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0124 | Tactical archive entry 0124: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0125 | Tactical archive entry 0125: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0126 | Tactical archive entry 0126: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0127 | Tactical archive entry 0127: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0128 | Tactical archive entry 0128: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0129 | Tactical archive entry 0129: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0130 | Tactical archive entry 0130: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0131 | Tactical archive entry 0131: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0132 | Tactical archive entry 0132: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0133 | Tactical archive entry 0133: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0134 | Tactical archive entry 0134: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0135 | Tactical archive entry 0135: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0136 | Tactical archive entry 0136: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0137 | Tactical archive entry 0137: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0138 | Tactical archive entry 0138: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0139 | Tactical archive entry 0139: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0140 | Tactical archive entry 0140: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0141 | Tactical archive entry 0141: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0142 | Tactical archive entry 0142: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0143 | Tactical archive entry 0143: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0144 | Tactical archive entry 0144: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0145 | Tactical archive entry 0145: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0146 | Tactical archive entry 0146: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0147 | Tactical archive entry 0147: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0148 | Tactical archive entry 0148: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0149 | Tactical archive entry 0149: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0150 | Tactical archive entry 0150: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0151 | Tactical archive entry 0151: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0152 | Tactical archive entry 0152: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0153 | Tactical archive entry 0153: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0154 | Tactical archive entry 0154: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0155 | Tactical archive entry 0155: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0156 | Tactical archive entry 0156: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0157 | Tactical archive entry 0157: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0158 | Tactical archive entry 0158: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0159 | Tactical archive entry 0159: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0160 | Tactical archive entry 0160: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0161 | Tactical archive entry 0161: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0162 | Tactical archive entry 0162: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0163 | Tactical archive entry 0163: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0164 | Tactical archive entry 0164: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0165 | Tactical archive entry 0165: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0166 | Tactical archive entry 0166: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0167 | Tactical archive entry 0167: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0168 | Tactical archive entry 0168: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0169 | Tactical archive entry 0169: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0170 | Tactical archive entry 0170: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0171 | Tactical archive entry 0171: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0172 | Tactical archive entry 0172: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0173 | Tactical archive entry 0173: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0174 | Tactical archive entry 0174: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0175 | Tactical archive entry 0175: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0176 | Tactical archive entry 0176: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0177 | Tactical archive entry 0177: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0178 | Tactical archive entry 0178: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0179 | Tactical archive entry 0179: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0180 | Tactical archive entry 0180: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0181 | Tactical archive entry 0181: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0182 | Tactical archive entry 0182: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0183 | Tactical archive entry 0183: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0184 | Tactical archive entry 0184: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0185 | Tactical archive entry 0185: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0186 | Tactical archive entry 0186: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0187 | Tactical archive entry 0187: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0188 | Tactical archive entry 0188: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0189 | Tactical archive entry 0189: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0190 | Tactical archive entry 0190: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0191 | Tactical archive entry 0191: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0192 | Tactical archive entry 0192: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0193 | Tactical archive entry 0193: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0194 | Tactical archive entry 0194: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0195 | Tactical archive entry 0195: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0196 | Tactical archive entry 0196: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0197 | Tactical archive entry 0197: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0198 | Tactical archive entry 0198: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0199 | Tactical archive entry 0199: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0200 | Tactical archive entry 0200: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0201 | Tactical archive entry 0201: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0202 | Tactical archive entry 0202: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0203 | Tactical archive entry 0203: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0204 | Tactical archive entry 0204: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0205 | Tactical archive entry 0205: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0206 | Tactical archive entry 0206: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0207 | Tactical archive entry 0207: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0208 | Tactical archive entry 0208: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0209 | Tactical archive entry 0209: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0210 | Tactical archive entry 0210: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0211 | Tactical archive entry 0211: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0212 | Tactical archive entry 0212: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0213 | Tactical archive entry 0213: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0214 | Tactical archive entry 0214: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0215 | Tactical archive entry 0215: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0216 | Tactical archive entry 0216: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0217 | Tactical archive entry 0217: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0218 | Tactical archive entry 0218: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0219 | Tactical archive entry 0219: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0220 | Tactical archive entry 0220: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0221 | Tactical archive entry 0221: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0222 | Tactical archive entry 0222: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0223 | Tactical archive entry 0223: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0224 | Tactical archive entry 0224: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0225 | Tactical archive entry 0225: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0226 | Tactical archive entry 0226: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0227 | Tactical archive entry 0227: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0228 | Tactical archive entry 0228: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0229 | Tactical archive entry 0229: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0230 | Tactical archive entry 0230: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0231 | Tactical archive entry 0231: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0232 | Tactical archive entry 0232: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0233 | Tactical archive entry 0233: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0234 | Tactical archive entry 0234: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0235 | Tactical archive entry 0235: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0236 | Tactical archive entry 0236: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0237 | Tactical archive entry 0237: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0238 | Tactical archive entry 0238: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0239 | Tactical archive entry 0239: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0240 | Tactical archive entry 0240: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0241 | Tactical archive entry 0241: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0242 | Tactical archive entry 0242: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0243 | Tactical archive entry 0243: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0244 | Tactical archive entry 0244: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0245 | Tactical archive entry 0245: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0246 | Tactical archive entry 0246: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0247 | Tactical archive entry 0247: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0248 | Tactical archive entry 0248: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0249 | Tactical archive entry 0249: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0250 | Tactical archive entry 0250: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0251 | Tactical archive entry 0251: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0252 | Tactical archive entry 0252: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0253 | Tactical archive entry 0253: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0254 | Tactical archive entry 0254: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0255 | Tactical archive entry 0255: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0256 | Tactical archive entry 0256: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0257 | Tactical archive entry 0257: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0258 | Tactical archive entry 0258: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0259 | Tactical archive entry 0259: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0260 | Tactical archive entry 0260: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0261 | Tactical archive entry 0261: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0262 | Tactical archive entry 0262: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0263 | Tactical archive entry 0263: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0264 | Tactical archive entry 0264: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0265 | Tactical archive entry 0265: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0266 | Tactical archive entry 0266: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0267 | Tactical archive entry 0267: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0268 | Tactical archive entry 0268: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0269 | Tactical archive entry 0269: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0270 | Tactical archive entry 0270: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0271 | Tactical archive entry 0271: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0272 | Tactical archive entry 0272: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0273 | Tactical archive entry 0273: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0274 | Tactical archive entry 0274: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0275 | Tactical archive entry 0275: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0276 | Tactical archive entry 0276: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0277 | Tactical archive entry 0277: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0278 | Tactical archive entry 0278: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0279 | Tactical archive entry 0279: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0280 | Tactical archive entry 0280: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0281 | Tactical archive entry 0281: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0282 | Tactical archive entry 0282: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0283 | Tactical archive entry 0283: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0284 | Tactical archive entry 0284: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0285 | Tactical archive entry 0285: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0286 | Tactical archive entry 0286: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0287 | Tactical archive entry 0287: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0288 | Tactical archive entry 0288: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0289 | Tactical archive entry 0289: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0290 | Tactical archive entry 0290: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0291 | Tactical archive entry 0291: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0292 | Tactical archive entry 0292: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0293 | Tactical archive entry 0293: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0294 | Tactical archive entry 0294: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0295 | Tactical archive entry 0295: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0296 | Tactical archive entry 0296: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0297 | Tactical archive entry 0297: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0298 | Tactical archive entry 0298: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0299 | Tactical archive entry 0299: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0300 | Tactical archive entry 0300: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0301 | Tactical archive entry 0301: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0302 | Tactical archive entry 0302: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0303 | Tactical archive entry 0303: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0304 | Tactical archive entry 0304: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0305 | Tactical archive entry 0305: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0306 | Tactical archive entry 0306: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0307 | Tactical archive entry 0307: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0308 | Tactical archive entry 0308: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0309 | Tactical archive entry 0309: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0310 | Tactical archive entry 0310: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0311 | Tactical archive entry 0311: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0312 | Tactical archive entry 0312: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0313 | Tactical archive entry 0313: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0314 | Tactical archive entry 0314: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0315 | Tactical archive entry 0315: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0316 | Tactical archive entry 0316: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0317 | Tactical archive entry 0317: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0318 | Tactical archive entry 0318: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0319 | Tactical archive entry 0319: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0320 | Tactical archive entry 0320: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0321 | Tactical archive entry 0321: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0322 | Tactical archive entry 0322: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0323 | Tactical archive entry 0323: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0324 | Tactical archive entry 0324: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0325 | Tactical archive entry 0325: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0326 | Tactical archive entry 0326: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0327 | Tactical archive entry 0327: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0328 | Tactical archive entry 0328: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0329 | Tactical archive entry 0329: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0330 | Tactical archive entry 0330: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0331 | Tactical archive entry 0331: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0332 | Tactical archive entry 0332: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0333 | Tactical archive entry 0333: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0334 | Tactical archive entry 0334: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0335 | Tactical archive entry 0335: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0336 | Tactical archive entry 0336: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0337 | Tactical archive entry 0337: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0338 | Tactical archive entry 0338: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0339 | Tactical archive entry 0339: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0340 | Tactical archive entry 0340: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0341 | Tactical archive entry 0341: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0342 | Tactical archive entry 0342: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0343 | Tactical archive entry 0343: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0344 | Tactical archive entry 0344: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0345 | Tactical archive entry 0345: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0346 | Tactical archive entry 0346: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0347 | Tactical archive entry 0347: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0348 | Tactical archive entry 0348: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0349 | Tactical archive entry 0349: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0350 | Tactical archive entry 0350: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0351 | Tactical archive entry 0351: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0352 | Tactical archive entry 0352: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0353 | Tactical archive entry 0353: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0354 | Tactical archive entry 0354: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0355 | Tactical archive entry 0355: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0356 | Tactical archive entry 0356: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0357 | Tactical archive entry 0357: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0358 | Tactical archive entry 0358: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0359 | Tactical archive entry 0359: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0360 | Tactical archive entry 0360: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0361 | Tactical archive entry 0361: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0362 | Tactical archive entry 0362: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0363 | Tactical archive entry 0363: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0364 | Tactical archive entry 0364: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0365 | Tactical archive entry 0365: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0366 | Tactical archive entry 0366: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0367 | Tactical archive entry 0367: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0368 | Tactical archive entry 0368: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0369 | Tactical archive entry 0369: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0370 | Tactical archive entry 0370: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0371 | Tactical archive entry 0371: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0372 | Tactical archive entry 0372: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0373 | Tactical archive entry 0373: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0374 | Tactical archive entry 0374: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0375 | Tactical archive entry 0375: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0376 | Tactical archive entry 0376: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0377 | Tactical archive entry 0377: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0378 | Tactical archive entry 0378: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0379 | Tactical archive entry 0379: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0380 | Tactical archive entry 0380: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0381 | Tactical archive entry 0381: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0382 | Tactical archive entry 0382: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0383 | Tactical archive entry 0383: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0384 | Tactical archive entry 0384: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0385 | Tactical archive entry 0385: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0386 | Tactical archive entry 0386: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0387 | Tactical archive entry 0387: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0388 | Tactical archive entry 0388: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0389 | Tactical archive entry 0389: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0390 | Tactical archive entry 0390: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0391 | Tactical archive entry 0391: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0392 | Tactical archive entry 0392: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0393 | Tactical archive entry 0393: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0394 | Tactical archive entry 0394: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0395 | Tactical archive entry 0395: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0396 | Tactical archive entry 0396: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0397 | Tactical archive entry 0397: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0398 | Tactical archive entry 0398: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0399 | Tactical archive entry 0399: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0400 | Tactical archive entry 0400: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0401 | Tactical archive entry 0401: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0402 | Tactical archive entry 0402: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0403 | Tactical archive entry 0403: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0404 | Tactical archive entry 0404: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0405 | Tactical archive entry 0405: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0406 | Tactical archive entry 0406: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0407 | Tactical archive entry 0407: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0408 | Tactical archive entry 0408: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0409 | Tactical archive entry 0409: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0410 | Tactical archive entry 0410: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0411 | Tactical archive entry 0411: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0412 | Tactical archive entry 0412: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0413 | Tactical archive entry 0413: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0414 | Tactical archive entry 0414: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0415 | Tactical archive entry 0415: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0416 | Tactical archive entry 0416: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0417 | Tactical archive entry 0417: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0418 | Tactical archive entry 0418: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0419 | Tactical archive entry 0419: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0420 | Tactical archive entry 0420: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0421 | Tactical archive entry 0421: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0422 | Tactical archive entry 0422: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0423 | Tactical archive entry 0423: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0424 | Tactical archive entry 0424: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0425 | Tactical archive entry 0425: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0426 | Tactical archive entry 0426: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0427 | Tactical archive entry 0427: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0428 | Tactical archive entry 0428: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0429 | Tactical archive entry 0429: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0430 | Tactical archive entry 0430: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0431 | Tactical archive entry 0431: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0432 | Tactical archive entry 0432: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0433 | Tactical archive entry 0433: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0434 | Tactical archive entry 0434: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0435 | Tactical archive entry 0435: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0436 | Tactical archive entry 0436: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0437 | Tactical archive entry 0437: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0438 | Tactical archive entry 0438: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0439 | Tactical archive entry 0439: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0440 | Tactical archive entry 0440: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0441 | Tactical archive entry 0441: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0442 | Tactical archive entry 0442: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0443 | Tactical archive entry 0443: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0444 | Tactical archive entry 0444: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0445 | Tactical archive entry 0445: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0446 | Tactical archive entry 0446: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0447 | Tactical archive entry 0447: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0448 | Tactical archive entry 0448: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0449 | Tactical archive entry 0449: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0450 | Tactical archive entry 0450: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0451 | Tactical archive entry 0451: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0452 | Tactical archive entry 0452: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0453 | Tactical archive entry 0453: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0454 | Tactical archive entry 0454: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0455 | Tactical archive entry 0455: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0456 | Tactical archive entry 0456: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0457 | Tactical archive entry 0457: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0458 | Tactical archive entry 0458: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0459 | Tactical archive entry 0459: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0460 | Tactical archive entry 0460: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0461 | Tactical archive entry 0461: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0462 | Tactical archive entry 0462: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0463 | Tactical archive entry 0463: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0464 | Tactical archive entry 0464: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0465 | Tactical archive entry 0465: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0466 | Tactical archive entry 0466: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0467 | Tactical archive entry 0467: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0468 | Tactical archive entry 0468: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0469 | Tactical archive entry 0469: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0470 | Tactical archive entry 0470: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0471 | Tactical archive entry 0471: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0472 | Tactical archive entry 0472: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0473 | Tactical archive entry 0473: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0474 | Tactical archive entry 0474: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0475 | Tactical archive entry 0475: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0476 | Tactical archive entry 0476: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0477 | Tactical archive entry 0477: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0478 | Tactical archive entry 0478: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0479 | Tactical archive entry 0479: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0480 | Tactical archive entry 0480: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0481 | Tactical archive entry 0481: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0482 | Tactical archive entry 0482: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0483 | Tactical archive entry 0483: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0484 | Tactical archive entry 0484: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0485 | Tactical archive entry 0485: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0486 | Tactical archive entry 0486: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0487 | Tactical archive entry 0487: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0488 | Tactical archive entry 0488: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0489 | Tactical archive entry 0489: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0490 | Tactical archive entry 0490: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0491 | Tactical archive entry 0491: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0492 | Tactical archive entry 0492: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0493 | Tactical archive entry 0493: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0494 | Tactical archive entry 0494: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0495 | Tactical archive entry 0495: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0496 | Tactical archive entry 0496: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0497 | Tactical archive entry 0497: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0498 | Tactical archive entry 0498: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0499 | Tactical archive entry 0499: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0500 | Tactical archive entry 0500: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0501 | Tactical archive entry 0501: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0502 | Tactical archive entry 0502: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0503 | Tactical archive entry 0503: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0504 | Tactical archive entry 0504: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0505 | Tactical archive entry 0505: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0506 | Tactical archive entry 0506: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0507 | Tactical archive entry 0507: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0508 | Tactical archive entry 0508: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0509 | Tactical archive entry 0509: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0510 | Tactical archive entry 0510: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0511 | Tactical archive entry 0511: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0512 | Tactical archive entry 0512: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0513 | Tactical archive entry 0513: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0514 | Tactical archive entry 0514: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0515 | Tactical archive entry 0515: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0516 | Tactical archive entry 0516: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0517 | Tactical archive entry 0517: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0518 | Tactical archive entry 0518: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0519 | Tactical archive entry 0519: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0520 | Tactical archive entry 0520: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0521 | Tactical archive entry 0521: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0522 | Tactical archive entry 0522: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0523 | Tactical archive entry 0523: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0524 | Tactical archive entry 0524: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0525 | Tactical archive entry 0525: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0526 | Tactical archive entry 0526: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0527 | Tactical archive entry 0527: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0528 | Tactical archive entry 0528: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0529 | Tactical archive entry 0529: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0530 | Tactical archive entry 0530: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0531 | Tactical archive entry 0531: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0532 | Tactical archive entry 0532: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0533 | Tactical archive entry 0533: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0534 | Tactical archive entry 0534: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0535 | Tactical archive entry 0535: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0536 | Tactical archive entry 0536: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0537 | Tactical archive entry 0537: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0538 | Tactical archive entry 0538: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0539 | Tactical archive entry 0539: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0540 | Tactical archive entry 0540: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0541 | Tactical archive entry 0541: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0542 | Tactical archive entry 0542: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0543 | Tactical archive entry 0543: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0544 | Tactical archive entry 0544: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0545 | Tactical archive entry 0545: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0546 | Tactical archive entry 0546: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0547 | Tactical archive entry 0547: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0548 | Tactical archive entry 0548: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0549 | Tactical archive entry 0549: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0550 | Tactical archive entry 0550: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0551 | Tactical archive entry 0551: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0552 | Tactical archive entry 0552: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0553 | Tactical archive entry 0553: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0554 | Tactical archive entry 0554: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0555 | Tactical archive entry 0555: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0556 | Tactical archive entry 0556: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0557 | Tactical archive entry 0557: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0558 | Tactical archive entry 0558: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0559 | Tactical archive entry 0559: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0560 | Tactical archive entry 0560: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0561 | Tactical archive entry 0561: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0562 | Tactical archive entry 0562: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0563 | Tactical archive entry 0563: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0564 | Tactical archive entry 0564: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0565 | Tactical archive entry 0565: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0566 | Tactical archive entry 0566: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0567 | Tactical archive entry 0567: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0568 | Tactical archive entry 0568: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0569 | Tactical archive entry 0569: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0570 | Tactical archive entry 0570: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0571 | Tactical archive entry 0571: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0572 | Tactical archive entry 0572: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0573 | Tactical archive entry 0573: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0574 | Tactical archive entry 0574: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0575 | Tactical archive entry 0575: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0576 | Tactical archive entry 0576: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0577 | Tactical archive entry 0577: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0578 | Tactical archive entry 0578: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0579 | Tactical archive entry 0579: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0580 | Tactical archive entry 0580: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0581 | Tactical archive entry 0581: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0582 | Tactical archive entry 0582: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0583 | Tactical archive entry 0583: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0584 | Tactical archive entry 0584: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0585 | Tactical archive entry 0585: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0586 | Tactical archive entry 0586: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0587 | Tactical archive entry 0587: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0588 | Tactical archive entry 0588: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0589 | Tactical archive entry 0589: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0590 | Tactical archive entry 0590: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0591 | Tactical archive entry 0591: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0592 | Tactical archive entry 0592: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0593 | Tactical archive entry 0593: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0594 | Tactical archive entry 0594: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0595 | Tactical archive entry 0595: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0596 | Tactical archive entry 0596: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0597 | Tactical archive entry 0597: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0598 | Tactical archive entry 0598: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0599 | Tactical archive entry 0599: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0600 | Tactical archive entry 0600: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0601 | Tactical archive entry 0601: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0602 | Tactical archive entry 0602: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0603 | Tactical archive entry 0603: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0604 | Tactical archive entry 0604: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0605 | Tactical archive entry 0605: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0606 | Tactical archive entry 0606: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0607 | Tactical archive entry 0607: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0608 | Tactical archive entry 0608: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0609 | Tactical archive entry 0609: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0610 | Tactical archive entry 0610: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0611 | Tactical archive entry 0611: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0612 | Tactical archive entry 0612: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0613 | Tactical archive entry 0613: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0614 | Tactical archive entry 0614: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0615 | Tactical archive entry 0615: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0616 | Tactical archive entry 0616: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0617 | Tactical archive entry 0617: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0618 | Tactical archive entry 0618: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0619 | Tactical archive entry 0619: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0620 | Tactical archive entry 0620: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0621 | Tactical archive entry 0621: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0622 | Tactical archive entry 0622: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0623 | Tactical archive entry 0623: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0624 | Tactical archive entry 0624: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0625 | Tactical archive entry 0625: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0626 | Tactical archive entry 0626: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0627 | Tactical archive entry 0627: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0628 | Tactical archive entry 0628: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0629 | Tactical archive entry 0629: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0630 | Tactical archive entry 0630: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0631 | Tactical archive entry 0631: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0632 | Tactical archive entry 0632: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0633 | Tactical archive entry 0633: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0634 | Tactical archive entry 0634: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0635 | Tactical archive entry 0635: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0636 | Tactical archive entry 0636: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0637 | Tactical archive entry 0637: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0638 | Tactical archive entry 0638: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0639 | Tactical archive entry 0639: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0640 | Tactical archive entry 0640: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0641 | Tactical archive entry 0641: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0642 | Tactical archive entry 0642: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0643 | Tactical archive entry 0643: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0644 | Tactical archive entry 0644: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0645 | Tactical archive entry 0645: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0646 | Tactical archive entry 0646: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0647 | Tactical archive entry 0647: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0648 | Tactical archive entry 0648: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0649 | Tactical archive entry 0649: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0650 | Tactical archive entry 0650: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0651 | Tactical archive entry 0651: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0652 | Tactical archive entry 0652: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0653 | Tactical archive entry 0653: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0654 | Tactical archive entry 0654: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0655 | Tactical archive entry 0655: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0656 | Tactical archive entry 0656: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0657 | Tactical archive entry 0657: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0658 | Tactical archive entry 0658: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0659 | Tactical archive entry 0659: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0660 | Tactical archive entry 0660: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0661 | Tactical archive entry 0661: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0662 | Tactical archive entry 0662: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0663 | Tactical archive entry 0663: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0664 | Tactical archive entry 0664: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0665 | Tactical archive entry 0665: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0666 | Tactical archive entry 0666: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0667 | Tactical archive entry 0667: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0668 | Tactical archive entry 0668: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0669 | Tactical archive entry 0669: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0670 | Tactical archive entry 0670: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0671 | Tactical archive entry 0671: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0672 | Tactical archive entry 0672: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0673 | Tactical archive entry 0673: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0674 | Tactical archive entry 0674: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0675 | Tactical archive entry 0675: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0676 | Tactical archive entry 0676: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0677 | Tactical archive entry 0677: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0678 | Tactical archive entry 0678: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0679 | Tactical archive entry 0679: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0680 | Tactical archive entry 0680: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0681 | Tactical archive entry 0681: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0682 | Tactical archive entry 0682: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0683 | Tactical archive entry 0683: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0684 | Tactical archive entry 0684: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0685 | Tactical archive entry 0685: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0686 | Tactical archive entry 0686: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0687 | Tactical archive entry 0687: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0688 | Tactical archive entry 0688: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0689 | Tactical archive entry 0689: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0690 | Tactical archive entry 0690: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0691 | Tactical archive entry 0691: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0692 | Tactical archive entry 0692: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0693 | Tactical archive entry 0693: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0694 | Tactical archive entry 0694: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0695 | Tactical archive entry 0695: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0696 | Tactical archive entry 0696: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0697 | Tactical archive entry 0697: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0698 | Tactical archive entry 0698: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0699 | Tactical archive entry 0699: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0700 | Tactical archive entry 0700: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0701 | Tactical archive entry 0701: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0702 | Tactical archive entry 0702: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0703 | Tactical archive entry 0703: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0704 | Tactical archive entry 0704: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0705 | Tactical archive entry 0705: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0706 | Tactical archive entry 0706: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0707 | Tactical archive entry 0707: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0708 | Tactical archive entry 0708: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0709 | Tactical archive entry 0709: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0710 | Tactical archive entry 0710: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0711 | Tactical archive entry 0711: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0712 | Tactical archive entry 0712: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0713 | Tactical archive entry 0713: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0714 | Tactical archive entry 0714: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0715 | Tactical archive entry 0715: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0716 | Tactical archive entry 0716: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0717 | Tactical archive entry 0717: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0718 | Tactical archive entry 0718: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0719 | Tactical archive entry 0719: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0720 | Tactical archive entry 0720: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0721 | Tactical archive entry 0721: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0722 | Tactical archive entry 0722: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0723 | Tactical archive entry 0723: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0724 | Tactical archive entry 0724: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0725 | Tactical archive entry 0725: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0726 | Tactical archive entry 0726: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0727 | Tactical archive entry 0727: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0728 | Tactical archive entry 0728: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0729 | Tactical archive entry 0729: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0730 | Tactical archive entry 0730: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0731 | Tactical archive entry 0731: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0732 | Tactical archive entry 0732: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0733 | Tactical archive entry 0733: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0734 | Tactical archive entry 0734: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0735 | Tactical archive entry 0735: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0736 | Tactical archive entry 0736: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0737 | Tactical archive entry 0737: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0738 | Tactical archive entry 0738: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0739 | Tactical archive entry 0739: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0740 | Tactical archive entry 0740: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0741 | Tactical archive entry 0741: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0742 | Tactical archive entry 0742: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0743 | Tactical archive entry 0743: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0744 | Tactical archive entry 0744: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0745 | Tactical archive entry 0745: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0746 | Tactical archive entry 0746: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0747 | Tactical archive entry 0747: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0748 | Tactical archive entry 0748: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0749 | Tactical archive entry 0749: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0750 | Tactical archive entry 0750: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0751 | Tactical archive entry 0751: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0752 | Tactical archive entry 0752: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0753 | Tactical archive entry 0753: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0754 | Tactical archive entry 0754: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0755 | Tactical archive entry 0755: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0756 | Tactical archive entry 0756: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0757 | Tactical archive entry 0757: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0758 | Tactical archive entry 0758: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0759 | Tactical archive entry 0759: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0760 | Tactical archive entry 0760: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0761 | Tactical archive entry 0761: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0762 | Tactical archive entry 0762: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0763 | Tactical archive entry 0763: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0764 | Tactical archive entry 0764: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0765 | Tactical archive entry 0765: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0766 | Tactical archive entry 0766: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0767 | Tactical archive entry 0767: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0768 | Tactical archive entry 0768: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0769 | Tactical archive entry 0769: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0770 | Tactical archive entry 0770: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0771 | Tactical archive entry 0771: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0772 | Tactical archive entry 0772: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0773 | Tactical archive entry 0773: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0774 | Tactical archive entry 0774: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0775 | Tactical archive entry 0775: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0776 | Tactical archive entry 0776: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0777 | Tactical archive entry 0777: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0778 | Tactical archive entry 0778: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0779 | Tactical archive entry 0779: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0780 | Tactical archive entry 0780: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0781 | Tactical archive entry 0781: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0782 | Tactical archive entry 0782: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0783 | Tactical archive entry 0783: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0784 | Tactical archive entry 0784: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0785 | Tactical archive entry 0785: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0786 | Tactical archive entry 0786: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0787 | Tactical archive entry 0787: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0788 | Tactical archive entry 0788: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0789 | Tactical archive entry 0789: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0790 | Tactical archive entry 0790: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0791 | Tactical archive entry 0791: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0792 | Tactical archive entry 0792: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0793 | Tactical archive entry 0793: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0794 | Tactical archive entry 0794: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0795 | Tactical archive entry 0795: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0796 | Tactical archive entry 0796: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0797 | Tactical archive entry 0797: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0798 | Tactical archive entry 0798: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0799 | Tactical archive entry 0799: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0800 | Tactical archive entry 0800: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0801 | Tactical archive entry 0801: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0802 | Tactical archive entry 0802: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0803 | Tactical archive entry 0803: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0804 | Tactical archive entry 0804: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0805 | Tactical archive entry 0805: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0806 | Tactical archive entry 0806: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0807 | Tactical archive entry 0807: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0808 | Tactical archive entry 0808: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0809 | Tactical archive entry 0809: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0810 | Tactical archive entry 0810: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0811 | Tactical archive entry 0811: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0812 | Tactical archive entry 0812: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0813 | Tactical archive entry 0813: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0814 | Tactical archive entry 0814: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0815 | Tactical archive entry 0815: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0816 | Tactical archive entry 0816: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0817 | Tactical archive entry 0817: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0818 | Tactical archive entry 0818: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0819 | Tactical archive entry 0819: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0820 | Tactical archive entry 0820: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0821 | Tactical archive entry 0821: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0822 | Tactical archive entry 0822: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0823 | Tactical archive entry 0823: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0824 | Tactical archive entry 0824: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0825 | Tactical archive entry 0825: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0826 | Tactical archive entry 0826: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0827 | Tactical archive entry 0827: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0828 | Tactical archive entry 0828: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0829 | Tactical archive entry 0829: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0830 | Tactical archive entry 0830: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0831 | Tactical archive entry 0831: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0832 | Tactical archive entry 0832: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0833 | Tactical archive entry 0833: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0834 | Tactical archive entry 0834: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0835 | Tactical archive entry 0835: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0836 | Tactical archive entry 0836: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0837 | Tactical archive entry 0837: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0838 | Tactical archive entry 0838: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0839 | Tactical archive entry 0839: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0840 | Tactical archive entry 0840: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0841 | Tactical archive entry 0841: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0842 | Tactical archive entry 0842: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0843 | Tactical archive entry 0843: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0844 | Tactical archive entry 0844: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0845 | Tactical archive entry 0845: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0846 | Tactical archive entry 0846: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0847 | Tactical archive entry 0847: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0848 | Tactical archive entry 0848: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0849 | Tactical archive entry 0849: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0850 | Tactical archive entry 0850: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0851 | Tactical archive entry 0851: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0852 | Tactical archive entry 0852: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0853 | Tactical archive entry 0853: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0854 | Tactical archive entry 0854: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0855 | Tactical archive entry 0855: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0856 | Tactical archive entry 0856: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0857 | Tactical archive entry 0857: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0858 | Tactical archive entry 0858: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0859 | Tactical archive entry 0859: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0860 | Tactical archive entry 0860: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0861 | Tactical archive entry 0861: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0862 | Tactical archive entry 0862: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0863 | Tactical archive entry 0863: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0864 | Tactical archive entry 0864: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0865 | Tactical archive entry 0865: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0866 | Tactical archive entry 0866: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0867 | Tactical archive entry 0867: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0868 | Tactical archive entry 0868: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0869 | Tactical archive entry 0869: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0870 | Tactical archive entry 0870: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0871 | Tactical archive entry 0871: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0872 | Tactical archive entry 0872: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0873 | Tactical archive entry 0873: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0874 | Tactical archive entry 0874: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0875 | Tactical archive entry 0875: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0876 | Tactical archive entry 0876: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0877 | Tactical archive entry 0877: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0878 | Tactical archive entry 0878: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0879 | Tactical archive entry 0879: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0880 | Tactical archive entry 0880: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0881 | Tactical archive entry 0881: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0882 | Tactical archive entry 0882: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0883 | Tactical archive entry 0883: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0884 | Tactical archive entry 0884: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0885 | Tactical archive entry 0885: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0886 | Tactical archive entry 0886: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0887 | Tactical archive entry 0887: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0888 | Tactical archive entry 0888: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0889 | Tactical archive entry 0889: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0890 | Tactical archive entry 0890: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0891 | Tactical archive entry 0891: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0892 | Tactical archive entry 0892: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0893 | Tactical archive entry 0893: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0894 | Tactical archive entry 0894: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0895 | Tactical archive entry 0895: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0896 | Tactical archive entry 0896: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0897 | Tactical archive entry 0897: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0898 | Tactical archive entry 0898: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0899 | Tactical archive entry 0899: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0900 | Tactical archive entry 0900: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0901 | Tactical archive entry 0901: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0902 | Tactical archive entry 0902: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0903 | Tactical archive entry 0903: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0904 | Tactical archive entry 0904: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0905 | Tactical archive entry 0905: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0906 | Tactical archive entry 0906: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0907 | Tactical archive entry 0907: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0908 | Tactical archive entry 0908: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0909 | Tactical archive entry 0909: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0910 | Tactical archive entry 0910: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0911 | Tactical archive entry 0911: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0912 | Tactical archive entry 0912: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0913 | Tactical archive entry 0913: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0914 | Tactical archive entry 0914: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0915 | Tactical archive entry 0915: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0916 | Tactical archive entry 0916: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0917 | Tactical archive entry 0917: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0918 | Tactical archive entry 0918: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0919 | Tactical archive entry 0919: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0920 | Tactical archive entry 0920: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0921 | Tactical archive entry 0921: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0922 | Tactical archive entry 0922: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0923 | Tactical archive entry 0923: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0924 | Tactical archive entry 0924: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0925 | Tactical archive entry 0925: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0926 | Tactical archive entry 0926: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0927 | Tactical archive entry 0927: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0928 | Tactical archive entry 0928: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0929 | Tactical archive entry 0929: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0930 | Tactical archive entry 0930: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0931 | Tactical archive entry 0931: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0932 | Tactical archive entry 0932: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0933 | Tactical archive entry 0933: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0934 | Tactical archive entry 0934: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0935 | Tactical archive entry 0935: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0936 | Tactical archive entry 0936: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0937 | Tactical archive entry 0937: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0938 | Tactical archive entry 0938: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0939 | Tactical archive entry 0939: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0940 | Tactical archive entry 0940: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0941 | Tactical archive entry 0941: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0942 | Tactical archive entry 0942: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0943 | Tactical archive entry 0943: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0944 | Tactical archive entry 0944: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0945 | Tactical archive entry 0945: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0946 | Tactical archive entry 0946: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0947 | Tactical archive entry 0947: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0948 | Tactical archive entry 0948: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0949 | Tactical archive entry 0949: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0950 | Tactical archive entry 0950: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0951 | Tactical archive entry 0951: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0952 | Tactical archive entry 0952: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0953 | Tactical archive entry 0953: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0954 | Tactical archive entry 0954: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0955 | Tactical archive entry 0955: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0956 | Tactical archive entry 0956: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0957 | Tactical archive entry 0957: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0958 | Tactical archive entry 0958: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0959 | Tactical archive entry 0959: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0960 | Tactical archive entry 0960: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0961 | Tactical archive entry 0961: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0962 | Tactical archive entry 0962: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0963 | Tactical archive entry 0963: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0964 | Tactical archive entry 0964: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0965 | Tactical archive entry 0965: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0966 | Tactical archive entry 0966: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0967 | Tactical archive entry 0967: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0968 | Tactical archive entry 0968: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0969 | Tactical archive entry 0969: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0970 | Tactical archive entry 0970: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0971 | Tactical archive entry 0971: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0972 | Tactical archive entry 0972: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0973 | Tactical archive entry 0973: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0974 | Tactical archive entry 0974: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0975 | Tactical archive entry 0975: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0976 | Tactical archive entry 0976: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0977 | Tactical archive entry 0977: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0978 | Tactical archive entry 0978: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0979 | Tactical archive entry 0979: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0980 | Tactical archive entry 0980: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0981 | Tactical archive entry 0981: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0982 | Tactical archive entry 0982: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0983 | Tactical archive entry 0983: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0984 | Tactical archive entry 0984: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0985 | Tactical archive entry 0985: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0986 | Tactical archive entry 0986: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0987 | Tactical archive entry 0987: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0988 | Tactical archive entry 0988: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0989 | Tactical archive entry 0989: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0990 | Tactical archive entry 0990: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0991 | Tactical archive entry 0991: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0992 | Tactical archive entry 0992: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0993 | Tactical archive entry 0993: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0994 | Tactical archive entry 0994: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0995 | Tactical archive entry 0995: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0996 | Tactical archive entry 0996: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0997 | Tactical archive entry 0997: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0998 | Tactical archive entry 0998: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-0999 | Tactical archive entry 0999: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1000 | Tactical archive entry 1000: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1001 | Tactical archive entry 1001: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1002 | Tactical archive entry 1002: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1003 | Tactical archive entry 1003: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1004 | Tactical archive entry 1004: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1005 | Tactical archive entry 1005: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1006 | Tactical archive entry 1006: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1007 | Tactical archive entry 1007: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1008 | Tactical archive entry 1008: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1009 | Tactical archive entry 1009: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1010 | Tactical archive entry 1010: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1011 | Tactical archive entry 1011: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1012 | Tactical archive entry 1012: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1013 | Tactical archive entry 1013: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1014 | Tactical archive entry 1014: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1015 | Tactical archive entry 1015: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1016 | Tactical archive entry 1016: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1017 | Tactical archive entry 1017: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1018 | Tactical archive entry 1018: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1019 | Tactical archive entry 1019: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1020 | Tactical archive entry 1020: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1021 | Tactical archive entry 1021: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1022 | Tactical archive entry 1022: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1023 | Tactical archive entry 1023: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1024 | Tactical archive entry 1024: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1025 | Tactical archive entry 1025: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1026 | Tactical archive entry 1026: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1027 | Tactical archive entry 1027: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1028 | Tactical archive entry 1028: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1029 | Tactical archive entry 1029: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1030 | Tactical archive entry 1030: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1031 | Tactical archive entry 1031: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1032 | Tactical archive entry 1032: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1033 | Tactical archive entry 1033: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1034 | Tactical archive entry 1034: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1035 | Tactical archive entry 1035: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1036 | Tactical archive entry 1036: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1037 | Tactical archive entry 1037: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1038 | Tactical archive entry 1038: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1039 | Tactical archive entry 1039: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1040 | Tactical archive entry 1040: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1041 | Tactical archive entry 1041: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1042 | Tactical archive entry 1042: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1043 | Tactical archive entry 1043: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1044 | Tactical archive entry 1044: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1045 | Tactical archive entry 1045: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1046 | Tactical archive entry 1046: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1047 | Tactical archive entry 1047: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1048 | Tactical archive entry 1048: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1049 | Tactical archive entry 1049: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1050 | Tactical archive entry 1050: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1051 | Tactical archive entry 1051: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1052 | Tactical archive entry 1052: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1053 | Tactical archive entry 1053: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1054 | Tactical archive entry 1054: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1055 | Tactical archive entry 1055: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1056 | Tactical archive entry 1056: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1057 | Tactical archive entry 1057: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1058 | Tactical archive entry 1058: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1059 | Tactical archive entry 1059: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1060 | Tactical archive entry 1060: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1061 | Tactical archive entry 1061: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1062 | Tactical archive entry 1062: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1063 | Tactical archive entry 1063: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1064 | Tactical archive entry 1064: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1065 | Tactical archive entry 1065: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1066 | Tactical archive entry 1066: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1067 | Tactical archive entry 1067: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1068 | Tactical archive entry 1068: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1069 | Tactical archive entry 1069: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1070 | Tactical archive entry 1070: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1071 | Tactical archive entry 1071: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1072 | Tactical archive entry 1072: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1073 | Tactical archive entry 1073: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1074 | Tactical archive entry 1074: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1075 | Tactical archive entry 1075: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1076 | Tactical archive entry 1076: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1077 | Tactical archive entry 1077: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1078 | Tactical archive entry 1078: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1079 | Tactical archive entry 1079: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1080 | Tactical archive entry 1080: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1081 | Tactical archive entry 1081: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1082 | Tactical archive entry 1082: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1083 | Tactical archive entry 1083: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1084 | Tactical archive entry 1084: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1085 | Tactical archive entry 1085: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1086 | Tactical archive entry 1086: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1087 | Tactical archive entry 1087: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1088 | Tactical archive entry 1088: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1089 | Tactical archive entry 1089: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1090 | Tactical archive entry 1090: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1091 | Tactical archive entry 1091: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1092 | Tactical archive entry 1092: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1093 | Tactical archive entry 1093: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1094 | Tactical archive entry 1094: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1095 | Tactical archive entry 1095: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1096 | Tactical archive entry 1096: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1097 | Tactical archive entry 1097: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1098 | Tactical archive entry 1098: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1099 | Tactical archive entry 1099: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1100 | Tactical archive entry 1100: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1101 | Tactical archive entry 1101: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1102 | Tactical archive entry 1102: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1103 | Tactical archive entry 1103: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1104 | Tactical archive entry 1104: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1105 | Tactical archive entry 1105: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1106 | Tactical archive entry 1106: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1107 | Tactical archive entry 1107: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1108 | Tactical archive entry 1108: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1109 | Tactical archive entry 1109: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1110 | Tactical archive entry 1110: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1111 | Tactical archive entry 1111: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1112 | Tactical archive entry 1112: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1113 | Tactical archive entry 1113: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1114 | Tactical archive entry 1114: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1115 | Tactical archive entry 1115: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1116 | Tactical archive entry 1116: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1117 | Tactical archive entry 1117: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1118 | Tactical archive entry 1118: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1119 | Tactical archive entry 1119: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1120 | Tactical archive entry 1120: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1121 | Tactical archive entry 1121: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1122 | Tactical archive entry 1122: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1123 | Tactical archive entry 1123: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1124 | Tactical archive entry 1124: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1125 | Tactical archive entry 1125: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1126 | Tactical archive entry 1126: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1127 | Tactical archive entry 1127: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1128 | Tactical archive entry 1128: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1129 | Tactical archive entry 1129: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1130 | Tactical archive entry 1130: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1131 | Tactical archive entry 1131: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1132 | Tactical archive entry 1132: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1133 | Tactical archive entry 1133: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1134 | Tactical archive entry 1134: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1135 | Tactical archive entry 1135: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1136 | Tactical archive entry 1136: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1137 | Tactical archive entry 1137: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1138 | Tactical archive entry 1138: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1139 | Tactical archive entry 1139: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1140 | Tactical archive entry 1140: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1141 | Tactical archive entry 1141: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1142 | Tactical archive entry 1142: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1143 | Tactical archive entry 1143: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1144 | Tactical archive entry 1144: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1145 | Tactical archive entry 1145: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1146 | Tactical archive entry 1146: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1147 | Tactical archive entry 1147: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1148 | Tactical archive entry 1148: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1149 | Tactical archive entry 1149: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1150 | Tactical archive entry 1150: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1151 | Tactical archive entry 1151: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1152 | Tactical archive entry 1152: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1153 | Tactical archive entry 1153: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1154 | Tactical archive entry 1154: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1155 | Tactical archive entry 1155: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1156 | Tactical archive entry 1156: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1157 | Tactical archive entry 1157: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1158 | Tactical archive entry 1158: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1159 | Tactical archive entry 1159: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1160 | Tactical archive entry 1160: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1161 | Tactical archive entry 1161: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1162 | Tactical archive entry 1162: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1163 | Tactical archive entry 1163: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1164 | Tactical archive entry 1164: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1165 | Tactical archive entry 1165: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1166 | Tactical archive entry 1166: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1167 | Tactical archive entry 1167: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1168 | Tactical archive entry 1168: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1169 | Tactical archive entry 1169: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1170 | Tactical archive entry 1170: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1171 | Tactical archive entry 1171: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1172 | Tactical archive entry 1172: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1173 | Tactical archive entry 1173: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1174 | Tactical archive entry 1174: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1175 | Tactical archive entry 1175: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1176 | Tactical archive entry 1176: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1177 | Tactical archive entry 1177: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1178 | Tactical archive entry 1178: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1179 | Tactical archive entry 1179: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1180 | Tactical archive entry 1180: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1181 | Tactical archive entry 1181: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1182 | Tactical archive entry 1182: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1183 | Tactical archive entry 1183: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1184 | Tactical archive entry 1184: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1185 | Tactical archive entry 1185: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1186 | Tactical archive entry 1186: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1187 | Tactical archive entry 1187: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1188 | Tactical archive entry 1188: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1189 | Tactical archive entry 1189: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1190 | Tactical archive entry 1190: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1191 | Tactical archive entry 1191: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1192 | Tactical archive entry 1192: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1193 | Tactical archive entry 1193: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1194 | Tactical archive entry 1194: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1195 | Tactical archive entry 1195: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1196 | Tactical archive entry 1196: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1197 | Tactical archive entry 1197: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1198 | Tactical archive entry 1198: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1199 | Tactical archive entry 1199: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1200 | Tactical archive entry 1200: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1201 | Tactical archive entry 1201: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1202 | Tactical archive entry 1202: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1203 | Tactical archive entry 1203: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1204 | Tactical archive entry 1204: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1205 | Tactical archive entry 1205: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1206 | Tactical archive entry 1206: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1207 | Tactical archive entry 1207: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1208 | Tactical archive entry 1208: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1209 | Tactical archive entry 1209: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1210 | Tactical archive entry 1210: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1211 | Tactical archive entry 1211: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1212 | Tactical archive entry 1212: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1213 | Tactical archive entry 1213: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1214 | Tactical archive entry 1214: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1215 | Tactical archive entry 1215: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1216 | Tactical archive entry 1216: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1217 | Tactical archive entry 1217: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1218 | Tactical archive entry 1218: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1219 | Tactical archive entry 1219: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1220 | Tactical archive entry 1220: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1221 | Tactical archive entry 1221: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1222 | Tactical archive entry 1222: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1223 | Tactical archive entry 1223: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1224 | Tactical archive entry 1224: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1225 | Tactical archive entry 1225: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1226 | Tactical archive entry 1226: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1227 | Tactical archive entry 1227: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1228 | Tactical archive entry 1228: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1229 | Tactical archive entry 1229: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1230 | Tactical archive entry 1230: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1231 | Tactical archive entry 1231: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1232 | Tactical archive entry 1232: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1233 | Tactical archive entry 1233: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1234 | Tactical archive entry 1234: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1235 | Tactical archive entry 1235: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1236 | Tactical archive entry 1236: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1237 | Tactical archive entry 1237: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1238 | Tactical archive entry 1238: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1239 | Tactical archive entry 1239: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1240 | Tactical archive entry 1240: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1241 | Tactical archive entry 1241: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1242 | Tactical archive entry 1242: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1243 | Tactical archive entry 1243: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1244 | Tactical archive entry 1244: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1245 | Tactical archive entry 1245: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1246 | Tactical archive entry 1246: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1247 | Tactical archive entry 1247: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1248 | Tactical archive entry 1248: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1249 | Tactical archive entry 1249: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1250 | Tactical archive entry 1250: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1251 | Tactical archive entry 1251: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1252 | Tactical archive entry 1252: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1253 | Tactical archive entry 1253: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1254 | Tactical archive entry 1254: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1255 | Tactical archive entry 1255: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1256 | Tactical archive entry 1256: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1257 | Tactical archive entry 1257: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1258 | Tactical archive entry 1258: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1259 | Tactical archive entry 1259: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1260 | Tactical archive entry 1260: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1261 | Tactical archive entry 1261: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1262 | Tactical archive entry 1262: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1263 | Tactical archive entry 1263: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1264 | Tactical archive entry 1264: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1265 | Tactical archive entry 1265: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1266 | Tactical archive entry 1266: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1267 | Tactical archive entry 1267: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1268 | Tactical archive entry 1268: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1269 | Tactical archive entry 1269: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1270 | Tactical archive entry 1270: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1271 | Tactical archive entry 1271: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1272 | Tactical archive entry 1272: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1273 | Tactical archive entry 1273: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1274 | Tactical archive entry 1274: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1275 | Tactical archive entry 1275: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1276 | Tactical archive entry 1276: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1277 | Tactical archive entry 1277: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1278 | Tactical archive entry 1278: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1279 | Tactical archive entry 1279: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1280 | Tactical archive entry 1280: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1281 | Tactical archive entry 1281: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1282 | Tactical archive entry 1282: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1283 | Tactical archive entry 1283: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1284 | Tactical archive entry 1284: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1285 | Tactical archive entry 1285: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1286 | Tactical archive entry 1286: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1287 | Tactical archive entry 1287: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1288 | Tactical archive entry 1288: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1289 | Tactical archive entry 1289: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1290 | Tactical archive entry 1290: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1291 | Tactical archive entry 1291: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1292 | Tactical archive entry 1292: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1293 | Tactical archive entry 1293: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1294 | Tactical archive entry 1294: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1295 | Tactical archive entry 1295: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1296 | Tactical archive entry 1296: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1297 | Tactical archive entry 1297: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1298 | Tactical archive entry 1298: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1299 | Tactical archive entry 1299: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1300 | Tactical archive entry 1300: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1301 | Tactical archive entry 1301: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1302 | Tactical archive entry 1302: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1303 | Tactical archive entry 1303: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1304 | Tactical archive entry 1304: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1305 | Tactical archive entry 1305: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1306 | Tactical archive entry 1306: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1307 | Tactical archive entry 1307: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1308 | Tactical archive entry 1308: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1309 | Tactical archive entry 1309: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1310 | Tactical archive entry 1310: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1311 | Tactical archive entry 1311: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1312 | Tactical archive entry 1312: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1313 | Tactical archive entry 1313: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1314 | Tactical archive entry 1314: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1315 | Tactical archive entry 1315: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1316 | Tactical archive entry 1316: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1317 | Tactical archive entry 1317: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1318 | Tactical archive entry 1318: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1319 | Tactical archive entry 1319: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1320 | Tactical archive entry 1320: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1321 | Tactical archive entry 1321: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1322 | Tactical archive entry 1322: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1323 | Tactical archive entry 1323: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1324 | Tactical archive entry 1324: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1325 | Tactical archive entry 1325: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1326 | Tactical archive entry 1326: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1327 | Tactical archive entry 1327: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1328 | Tactical archive entry 1328: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1329 | Tactical archive entry 1329: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1330 | Tactical archive entry 1330: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1331 | Tactical archive entry 1331: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1332 | Tactical archive entry 1332: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1333 | Tactical archive entry 1333: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1334 | Tactical archive entry 1334: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1335 | Tactical archive entry 1335: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1336 | Tactical archive entry 1336: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1337 | Tactical archive entry 1337: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1338 | Tactical archive entry 1338: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1339 | Tactical archive entry 1339: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1340 | Tactical archive entry 1340: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1341 | Tactical archive entry 1341: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1342 | Tactical archive entry 1342: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1343 | Tactical archive entry 1343: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1344 | Tactical archive entry 1344: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1345 | Tactical archive entry 1345: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1346 | Tactical archive entry 1346: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1347 | Tactical archive entry 1347: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1348 | Tactical archive entry 1348: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1349 | Tactical archive entry 1349: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1350 | Tactical archive entry 1350: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1351 | Tactical archive entry 1351: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1352 | Tactical archive entry 1352: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1353 | Tactical archive entry 1353: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1354 | Tactical archive entry 1354: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1355 | Tactical archive entry 1355: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1356 | Tactical archive entry 1356: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1357 | Tactical archive entry 1357: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1358 | Tactical archive entry 1358: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1359 | Tactical archive entry 1359: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1360 | Tactical archive entry 1360: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1361 | Tactical archive entry 1361: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1362 | Tactical archive entry 1362: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1363 | Tactical archive entry 1363: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1364 | Tactical archive entry 1364: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1365 | Tactical archive entry 1365: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1366 | Tactical archive entry 1366: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1367 | Tactical archive entry 1367: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1368 | Tactical archive entry 1368: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1369 | Tactical archive entry 1369: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1370 | Tactical archive entry 1370: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1371 | Tactical archive entry 1371: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1372 | Tactical archive entry 1372: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1373 | Tactical archive entry 1373: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1374 | Tactical archive entry 1374: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1375 | Tactical archive entry 1375: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1376 | Tactical archive entry 1376: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1377 | Tactical archive entry 1377: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1378 | Tactical archive entry 1378: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1379 | Tactical archive entry 1379: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1380 | Tactical archive entry 1380: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1381 | Tactical archive entry 1381: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1382 | Tactical archive entry 1382: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1383 | Tactical archive entry 1383: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1384 | Tactical archive entry 1384: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1385 | Tactical archive entry 1385: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1386 | Tactical archive entry 1386: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1387 | Tactical archive entry 1387: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1388 | Tactical archive entry 1388: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1389 | Tactical archive entry 1389: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1390 | Tactical archive entry 1390: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1391 | Tactical archive entry 1391: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1392 | Tactical archive entry 1392: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1393 | Tactical archive entry 1393: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1394 | Tactical archive entry 1394: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1395 | Tactical archive entry 1395: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1396 | Tactical archive entry 1396: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1397 | Tactical archive entry 1397: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1398 | Tactical archive entry 1398: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1399 | Tactical archive entry 1399: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1400 | Tactical archive entry 1400: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1401 | Tactical archive entry 1401: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1402 | Tactical archive entry 1402: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1403 | Tactical archive entry 1403: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1404 | Tactical archive entry 1404: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1405 | Tactical archive entry 1405: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1406 | Tactical archive entry 1406: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1407 | Tactical archive entry 1407: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1408 | Tactical archive entry 1408: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1409 | Tactical archive entry 1409: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1410 | Tactical archive entry 1410: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1411 | Tactical archive entry 1411: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1412 | Tactical archive entry 1412: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1413 | Tactical archive entry 1413: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1414 | Tactical archive entry 1414: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1415 | Tactical archive entry 1415: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1416 | Tactical archive entry 1416: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1417 | Tactical archive entry 1417: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1418 | Tactical archive entry 1418: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1419 | Tactical archive entry 1419: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1420 | Tactical archive entry 1420: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1421 | Tactical archive entry 1421: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1422 | Tactical archive entry 1422: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1423 | Tactical archive entry 1423: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1424 | Tactical archive entry 1424: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1425 | Tactical archive entry 1425: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1426 | Tactical archive entry 1426: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1427 | Tactical archive entry 1427: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1428 | Tactical archive entry 1428: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1429 | Tactical archive entry 1429: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1430 | Tactical archive entry 1430: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1431 | Tactical archive entry 1431: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1432 | Tactical archive entry 1432: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1433 | Tactical archive entry 1433: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1434 | Tactical archive entry 1434: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1435 | Tactical archive entry 1435: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1436 | Tactical archive entry 1436: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1437 | Tactical archive entry 1437: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1438 | Tactical archive entry 1438: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1439 | Tactical archive entry 1439: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1440 | Tactical archive entry 1440: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1441 | Tactical archive entry 1441: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1442 | Tactical archive entry 1442: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1443 | Tactical archive entry 1443: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1444 | Tactical archive entry 1444: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1445 | Tactical archive entry 1445: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1446 | Tactical archive entry 1446: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1447 | Tactical archive entry 1447: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1448 | Tactical archive entry 1448: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1449 | Tactical archive entry 1449: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1450 | Tactical archive entry 1450: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1451 | Tactical archive entry 1451: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1452 | Tactical archive entry 1452: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1453 | Tactical archive entry 1453: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1454 | Tactical archive entry 1454: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1455 | Tactical archive entry 1455: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1456 | Tactical archive entry 1456: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1457 | Tactical archive entry 1457: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1458 | Tactical archive entry 1458: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1459 | Tactical archive entry 1459: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1460 | Tactical archive entry 1460: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1461 | Tactical archive entry 1461: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1462 | Tactical archive entry 1462: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1463 | Tactical archive entry 1463: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1464 | Tactical archive entry 1464: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1465 | Tactical archive entry 1465: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1466 | Tactical archive entry 1466: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1467 | Tactical archive entry 1467: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1468 | Tactical archive entry 1468: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1469 | Tactical archive entry 1469: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1470 | Tactical archive entry 1470: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1471 | Tactical archive entry 1471: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1472 | Tactical archive entry 1472: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1473 | Tactical archive entry 1473: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1474 | Tactical archive entry 1474: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1475 | Tactical archive entry 1475: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1476 | Tactical archive entry 1476: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1477 | Tactical archive entry 1477: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1478 | Tactical archive entry 1478: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1479 | Tactical archive entry 1479: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1480 | Tactical archive entry 1480: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1481 | Tactical archive entry 1481: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1482 | Tactical archive entry 1482: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1483 | Tactical archive entry 1483: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1484 | Tactical archive entry 1484: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1485 | Tactical archive entry 1485: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1486 | Tactical archive entry 1486: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1487 | Tactical archive entry 1487: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1488 | Tactical archive entry 1488: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1489 | Tactical archive entry 1489: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1490 | Tactical archive entry 1490: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1491 | Tactical archive entry 1491: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1492 | Tactical archive entry 1492: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1493 | Tactical archive entry 1493: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1494 | Tactical archive entry 1494: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1495 | Tactical archive entry 1495: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1496 | Tactical archive entry 1496: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1497 | Tactical archive entry 1497: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1498 | Tactical archive entry 1498: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1499 | Tactical archive entry 1499: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1500 | Tactical archive entry 1500: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1501 | Tactical archive entry 1501: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1502 | Tactical archive entry 1502: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1503 | Tactical archive entry 1503: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1504 | Tactical archive entry 1504: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1505 | Tactical archive entry 1505: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1506 | Tactical archive entry 1506: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1507 | Tactical archive entry 1507: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1508 | Tactical archive entry 1508: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1509 | Tactical archive entry 1509: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1510 | Tactical archive entry 1510: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1511 | Tactical archive entry 1511: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1512 | Tactical archive entry 1512: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1513 | Tactical archive entry 1513: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1514 | Tactical archive entry 1514: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1515 | Tactical archive entry 1515: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1516 | Tactical archive entry 1516: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1517 | Tactical archive entry 1517: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1518 | Tactical archive entry 1518: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1519 | Tactical archive entry 1519: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1520 | Tactical archive entry 1520: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1521 | Tactical archive entry 1521: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1522 | Tactical archive entry 1522: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1523 | Tactical archive entry 1523: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1524 | Tactical archive entry 1524: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1525 | Tactical archive entry 1525: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1526 | Tactical archive entry 1526: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1527 | Tactical archive entry 1527: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1528 | Tactical archive entry 1528: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1529 | Tactical archive entry 1529: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1530 | Tactical archive entry 1530: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1531 | Tactical archive entry 1531: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1532 | Tactical archive entry 1532: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1533 | Tactical archive entry 1533: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1534 | Tactical archive entry 1534: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1535 | Tactical archive entry 1535: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1536 | Tactical archive entry 1536: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1537 | Tactical archive entry 1537: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1538 | Tactical archive entry 1538: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1539 | Tactical archive entry 1539: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1540 | Tactical archive entry 1540: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1541 | Tactical archive entry 1541: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1542 | Tactical archive entry 1542: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1543 | Tactical archive entry 1543: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1544 | Tactical archive entry 1544: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1545 | Tactical archive entry 1545: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1546 | Tactical archive entry 1546: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1547 | Tactical archive entry 1547: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1548 | Tactical archive entry 1548: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1549 | Tactical archive entry 1549: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1550 | Tactical archive entry 1550: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1551 | Tactical archive entry 1551: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1552 | Tactical archive entry 1552: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1553 | Tactical archive entry 1553: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1554 | Tactical archive entry 1554: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1555 | Tactical archive entry 1555: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1556 | Tactical archive entry 1556: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1557 | Tactical archive entry 1557: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1558 | Tactical archive entry 1558: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1559 | Tactical archive entry 1559: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1560 | Tactical archive entry 1560: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1561 | Tactical archive entry 1561: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1562 | Tactical archive entry 1562: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1563 | Tactical archive entry 1563: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1564 | Tactical archive entry 1564: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1565 | Tactical archive entry 1565: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1566 | Tactical archive entry 1566: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1567 | Tactical archive entry 1567: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1568 | Tactical archive entry 1568: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1569 | Tactical archive entry 1569: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1570 | Tactical archive entry 1570: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1571 | Tactical archive entry 1571: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1572 | Tactical archive entry 1572: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1573 | Tactical archive entry 1573: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1574 | Tactical archive entry 1574: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1575 | Tactical archive entry 1575: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1576 | Tactical archive entry 1576: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1577 | Tactical archive entry 1577: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1578 | Tactical archive entry 1578: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1579 | Tactical archive entry 1579: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1580 | Tactical archive entry 1580: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1581 | Tactical archive entry 1581: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1582 | Tactical archive entry 1582: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1583 | Tactical archive entry 1583: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1584 | Tactical archive entry 1584: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1585 | Tactical archive entry 1585: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1586 | Tactical archive entry 1586: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1587 | Tactical archive entry 1587: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1588 | Tactical archive entry 1588: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1589 | Tactical archive entry 1589: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1590 | Tactical archive entry 1590: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1591 | Tactical archive entry 1591: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1592 | Tactical archive entry 1592: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1593 | Tactical archive entry 1593: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1594 | Tactical archive entry 1594: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1595 | Tactical archive entry 1595: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1596 | Tactical archive entry 1596: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1597 | Tactical archive entry 1597: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1598 | Tactical archive entry 1598: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1599 | Tactical archive entry 1599: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1600 | Tactical archive entry 1600: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1601 | Tactical archive entry 1601: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1602 | Tactical archive entry 1602: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1603 | Tactical archive entry 1603: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1604 | Tactical archive entry 1604: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1605 | Tactical archive entry 1605: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1606 | Tactical archive entry 1606: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1607 | Tactical archive entry 1607: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1608 | Tactical archive entry 1608: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1609 | Tactical archive entry 1609: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1610 | Tactical archive entry 1610: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1611 | Tactical archive entry 1611: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1612 | Tactical archive entry 1612: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1613 | Tactical archive entry 1613: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1614 | Tactical archive entry 1614: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1615 | Tactical archive entry 1615: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1616 | Tactical archive entry 1616: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1617 | Tactical archive entry 1617: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1618 | Tactical archive entry 1618: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1619 | Tactical archive entry 1619: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1620 | Tactical archive entry 1620: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1621 | Tactical archive entry 1621: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1622 | Tactical archive entry 1622: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1623 | Tactical archive entry 1623: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1624 | Tactical archive entry 1624: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1625 | Tactical archive entry 1625: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1626 | Tactical archive entry 1626: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1627 | Tactical archive entry 1627: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1628 | Tactical archive entry 1628: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1629 | Tactical archive entry 1629: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1630 | Tactical archive entry 1630: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1631 | Tactical archive entry 1631: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1632 | Tactical archive entry 1632: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1633 | Tactical archive entry 1633: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1634 | Tactical archive entry 1634: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1635 | Tactical archive entry 1635: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1636 | Tactical archive entry 1636: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1637 | Tactical archive entry 1637: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1638 | Tactical archive entry 1638: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1639 | Tactical archive entry 1639: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1640 | Tactical archive entry 1640: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1641 | Tactical archive entry 1641: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1642 | Tactical archive entry 1642: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1643 | Tactical archive entry 1643: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1644 | Tactical archive entry 1644: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1645 | Tactical archive entry 1645: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1646 | Tactical archive entry 1646: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1647 | Tactical archive entry 1647: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1648 | Tactical archive entry 1648: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1649 | Tactical archive entry 1649: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1650 | Tactical archive entry 1650: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1651 | Tactical archive entry 1651: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1652 | Tactical archive entry 1652: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1653 | Tactical archive entry 1653: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1654 | Tactical archive entry 1654: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1655 | Tactical archive entry 1655: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1656 | Tactical archive entry 1656: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1657 | Tactical archive entry 1657: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1658 | Tactical archive entry 1658: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1659 | Tactical archive entry 1659: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1660 | Tactical archive entry 1660: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1661 | Tactical archive entry 1661: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1662 | Tactical archive entry 1662: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1663 | Tactical archive entry 1663: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1664 | Tactical archive entry 1664: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1665 | Tactical archive entry 1665: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1666 | Tactical archive entry 1666: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1667 | Tactical archive entry 1667: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1668 | Tactical archive entry 1668: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1669 | Tactical archive entry 1669: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1670 | Tactical archive entry 1670: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1671 | Tactical archive entry 1671: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1672 | Tactical archive entry 1672: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1673 | Tactical archive entry 1673: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1674 | Tactical archive entry 1674: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1675 | Tactical archive entry 1675: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1676 | Tactical archive entry 1676: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1677 | Tactical archive entry 1677: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1678 | Tactical archive entry 1678: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1679 | Tactical archive entry 1679: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1680 | Tactical archive entry 1680: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1681 | Tactical archive entry 1681: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1682 | Tactical archive entry 1682: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1683 | Tactical archive entry 1683: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1684 | Tactical archive entry 1684: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1685 | Tactical archive entry 1685: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1686 | Tactical archive entry 1686: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1687 | Tactical archive entry 1687: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1688 | Tactical archive entry 1688: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1689 | Tactical archive entry 1689: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1690 | Tactical archive entry 1690: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1691 | Tactical archive entry 1691: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1692 | Tactical archive entry 1692: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1693 | Tactical archive entry 1693: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1694 | Tactical archive entry 1694: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1695 | Tactical archive entry 1695: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1696 | Tactical archive entry 1696: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1697 | Tactical archive entry 1697: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1698 | Tactical archive entry 1698: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1699 | Tactical archive entry 1699: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1700 | Tactical archive entry 1700: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1701 | Tactical archive entry 1701: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1702 | Tactical archive entry 1702: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1703 | Tactical archive entry 1703: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1704 | Tactical archive entry 1704: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1705 | Tactical archive entry 1705: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1706 | Tactical archive entry 1706: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1707 | Tactical archive entry 1707: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1708 | Tactical archive entry 1708: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1709 | Tactical archive entry 1709: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1710 | Tactical archive entry 1710: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1711 | Tactical archive entry 1711: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1712 | Tactical archive entry 1712: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1713 | Tactical archive entry 1713: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1714 | Tactical archive entry 1714: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1715 | Tactical archive entry 1715: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1716 | Tactical archive entry 1716: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1717 | Tactical archive entry 1717: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1718 | Tactical archive entry 1718: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1719 | Tactical archive entry 1719: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1720 | Tactical archive entry 1720: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1721 | Tactical archive entry 1721: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1722 | Tactical archive entry 1722: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1723 | Tactical archive entry 1723: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1724 | Tactical archive entry 1724: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1725 | Tactical archive entry 1725: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1726 | Tactical archive entry 1726: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1727 | Tactical archive entry 1727: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1728 | Tactical archive entry 1728: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1729 | Tactical archive entry 1729: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1730 | Tactical archive entry 1730: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1731 | Tactical archive entry 1731: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1732 | Tactical archive entry 1732: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1733 | Tactical archive entry 1733: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1734 | Tactical archive entry 1734: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1735 | Tactical archive entry 1735: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1736 | Tactical archive entry 1736: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1737 | Tactical archive entry 1737: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1738 | Tactical archive entry 1738: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1739 | Tactical archive entry 1739: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1740 | Tactical archive entry 1740: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1741 | Tactical archive entry 1741: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1742 | Tactical archive entry 1742: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1743 | Tactical archive entry 1743: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1744 | Tactical archive entry 1744: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1745 | Tactical archive entry 1745: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1746 | Tactical archive entry 1746: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1747 | Tactical archive entry 1747: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1748 | Tactical archive entry 1748: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1749 | Tactical archive entry 1749: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1750 | Tactical archive entry 1750: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1751 | Tactical archive entry 1751: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1752 | Tactical archive entry 1752: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1753 | Tactical archive entry 1753: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1754 | Tactical archive entry 1754: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1755 | Tactical archive entry 1755: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1756 | Tactical archive entry 1756: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1757 | Tactical archive entry 1757: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1758 | Tactical archive entry 1758: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1759 | Tactical archive entry 1759: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1760 | Tactical archive entry 1760: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1761 | Tactical archive entry 1761: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1762 | Tactical archive entry 1762: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1763 | Tactical archive entry 1763: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1764 | Tactical archive entry 1764: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1765 | Tactical archive entry 1765: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1766 | Tactical archive entry 1766: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1767 | Tactical archive entry 1767: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1768 | Tactical archive entry 1768: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1769 | Tactical archive entry 1769: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1770 | Tactical archive entry 1770: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1771 | Tactical archive entry 1771: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1772 | Tactical archive entry 1772: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1773 | Tactical archive entry 1773: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1774 | Tactical archive entry 1774: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1775 | Tactical archive entry 1775: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1776 | Tactical archive entry 1776: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1777 | Tactical archive entry 1777: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1778 | Tactical archive entry 1778: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1779 | Tactical archive entry 1779: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1780 | Tactical archive entry 1780: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1781 | Tactical archive entry 1781: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1782 | Tactical archive entry 1782: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1783 | Tactical archive entry 1783: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1784 | Tactical archive entry 1784: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1785 | Tactical archive entry 1785: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1786 | Tactical archive entry 1786: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1787 | Tactical archive entry 1787: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1788 | Tactical archive entry 1788: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1789 | Tactical archive entry 1789: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1790 | Tactical archive entry 1790: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1791 | Tactical archive entry 1791: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1792 | Tactical archive entry 1792: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1793 | Tactical archive entry 1793: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1794 | Tactical archive entry 1794: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1795 | Tactical archive entry 1795: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1796 | Tactical archive entry 1796: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1797 | Tactical archive entry 1797: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1798 | Tactical archive entry 1798: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1799 | Tactical archive entry 1799: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1800 | Tactical archive entry 1800: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1801 | Tactical archive entry 1801: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1802 | Tactical archive entry 1802: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1803 | Tactical archive entry 1803: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1804 | Tactical archive entry 1804: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1805 | Tactical archive entry 1805: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1806 | Tactical archive entry 1806: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1807 | Tactical archive entry 1807: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1808 | Tactical archive entry 1808: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1809 | Tactical archive entry 1809: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1810 | Tactical archive entry 1810: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1811 | Tactical archive entry 1811: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1812 | Tactical archive entry 1812: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1813 | Tactical archive entry 1813: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1814 | Tactical archive entry 1814: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1815 | Tactical archive entry 1815: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1816 | Tactical archive entry 1816: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1817 | Tactical archive entry 1817: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1818 | Tactical archive entry 1818: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1819 | Tactical archive entry 1819: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1820 | Tactical archive entry 1820: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1821 | Tactical archive entry 1821: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1822 | Tactical archive entry 1822: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1823 | Tactical archive entry 1823: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1824 | Tactical archive entry 1824: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1825 | Tactical archive entry 1825: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1826 | Tactical archive entry 1826: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1827 | Tactical archive entry 1827: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1828 | Tactical archive entry 1828: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1829 | Tactical archive entry 1829: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1830 | Tactical archive entry 1830: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1831 | Tactical archive entry 1831: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1832 | Tactical archive entry 1832: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1833 | Tactical archive entry 1833: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1834 | Tactical archive entry 1834: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1835 | Tactical archive entry 1835: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1836 | Tactical archive entry 1836: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1837 | Tactical archive entry 1837: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1838 | Tactical archive entry 1838: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1839 | Tactical archive entry 1839: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1840 | Tactical archive entry 1840: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1841 | Tactical archive entry 1841: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1842 | Tactical archive entry 1842: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1843 | Tactical archive entry 1843: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1844 | Tactical archive entry 1844: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1845 | Tactical archive entry 1845: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1846 | Tactical archive entry 1846: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1847 | Tactical archive entry 1847: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1848 | Tactical archive entry 1848: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1849 | Tactical archive entry 1849: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1850 | Tactical archive entry 1850: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1851 | Tactical archive entry 1851: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1852 | Tactical archive entry 1852: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1853 | Tactical archive entry 1853: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1854 | Tactical archive entry 1854: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1855 | Tactical archive entry 1855: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1856 | Tactical archive entry 1856: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1857 | Tactical archive entry 1857: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1858 | Tactical archive entry 1858: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1859 | Tactical archive entry 1859: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1860 | Tactical archive entry 1860: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1861 | Tactical archive entry 1861: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1862 | Tactical archive entry 1862: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1863 | Tactical archive entry 1863: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1864 | Tactical archive entry 1864: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1865 | Tactical archive entry 1865: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1866 | Tactical archive entry 1866: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1867 | Tactical archive entry 1867: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1868 | Tactical archive entry 1868: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1869 | Tactical archive entry 1869: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1870 | Tactical archive entry 1870: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1871 | Tactical archive entry 1871: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1872 | Tactical archive entry 1872: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1873 | Tactical archive entry 1873: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1874 | Tactical archive entry 1874: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1875 | Tactical archive entry 1875: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1876 | Tactical archive entry 1876: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1877 | Tactical archive entry 1877: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1878 | Tactical archive entry 1878: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1879 | Tactical archive entry 1879: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1880 | Tactical archive entry 1880: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1881 | Tactical archive entry 1881: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1882 | Tactical archive entry 1882: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1883 | Tactical archive entry 1883: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1884 | Tactical archive entry 1884: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1885 | Tactical archive entry 1885: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1886 | Tactical archive entry 1886: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1887 | Tactical archive entry 1887: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1888 | Tactical archive entry 1888: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1889 | Tactical archive entry 1889: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1890 | Tactical archive entry 1890: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1891 | Tactical archive entry 1891: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1892 | Tactical archive entry 1892: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1893 | Tactical archive entry 1893: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1894 | Tactical archive entry 1894: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1895 | Tactical archive entry 1895: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1896 | Tactical archive entry 1896: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1897 | Tactical archive entry 1897: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1898 | Tactical archive entry 1898: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1899 | Tactical archive entry 1899: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1900 | Tactical archive entry 1900: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1901 | Tactical archive entry 1901: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1902 | Tactical archive entry 1902: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1903 | Tactical archive entry 1903: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1904 | Tactical archive entry 1904: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1905 | Tactical archive entry 1905: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1906 | Tactical archive entry 1906: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1907 | Tactical archive entry 1907: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1908 | Tactical archive entry 1908: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1909 | Tactical archive entry 1909: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1910 | Tactical archive entry 1910: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1911 | Tactical archive entry 1911: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1912 | Tactical archive entry 1912: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1913 | Tactical archive entry 1913: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1914 | Tactical archive entry 1914: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1915 | Tactical archive entry 1915: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1916 | Tactical archive entry 1916: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1917 | Tactical archive entry 1917: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1918 | Tactical archive entry 1918: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1919 | Tactical archive entry 1919: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1920 | Tactical archive entry 1920: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1921 | Tactical archive entry 1921: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1922 | Tactical archive entry 1922: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1923 | Tactical archive entry 1923: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1924 | Tactical archive entry 1924: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1925 | Tactical archive entry 1925: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1926 | Tactical archive entry 1926: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1927 | Tactical archive entry 1927: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1928 | Tactical archive entry 1928: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1929 | Tactical archive entry 1929: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1930 | Tactical archive entry 1930: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1931 | Tactical archive entry 1931: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1932 | Tactical archive entry 1932: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1933 | Tactical archive entry 1933: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1934 | Tactical archive entry 1934: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1935 | Tactical archive entry 1935: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1936 | Tactical archive entry 1936: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1937 | Tactical archive entry 1937: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1938 | Tactical archive entry 1938: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1939 | Tactical archive entry 1939: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1940 | Tactical archive entry 1940: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1941 | Tactical archive entry 1941: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1942 | Tactical archive entry 1942: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1943 | Tactical archive entry 1943: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1944 | Tactical archive entry 1944: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1945 | Tactical archive entry 1945: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1946 | Tactical archive entry 1946: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1947 | Tactical archive entry 1947: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1948 | Tactical archive entry 1948: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1949 | Tactical archive entry 1949: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1950 | Tactical archive entry 1950: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1951 | Tactical archive entry 1951: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1952 | Tactical archive entry 1952: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1953 | Tactical archive entry 1953: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1954 | Tactical archive entry 1954: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1955 | Tactical archive entry 1955: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1956 | Tactical archive entry 1956: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1957 | Tactical archive entry 1957: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1958 | Tactical archive entry 1958: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1959 | Tactical archive entry 1959: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1960 | Tactical archive entry 1960: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1961 | Tactical archive entry 1961: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1962 | Tactical archive entry 1962: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1963 | Tactical archive entry 1963: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1964 | Tactical archive entry 1964: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1965 | Tactical archive entry 1965: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1966 | Tactical archive entry 1966: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1967 | Tactical archive entry 1967: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1968 | Tactical archive entry 1968: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1969 | Tactical archive entry 1969: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1970 | Tactical archive entry 1970: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1971 | Tactical archive entry 1971: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1972 | Tactical archive entry 1972: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1973 | Tactical archive entry 1973: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1974 | Tactical archive entry 1974: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1975 | Tactical archive entry 1975: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1976 | Tactical archive entry 1976: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1977 | Tactical archive entry 1977: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1978 | Tactical archive entry 1978: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1979 | Tactical archive entry 1979: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1980 | Tactical archive entry 1980: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1981 | Tactical archive entry 1981: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1982 | Tactical archive entry 1982: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1983 | Tactical archive entry 1983: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1984 | Tactical archive entry 1984: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1985 | Tactical archive entry 1985: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1986 | Tactical archive entry 1986: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1987 | Tactical archive entry 1987: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1988 | Tactical archive entry 1988: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1989 | Tactical archive entry 1989: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1990 | Tactical archive entry 1990: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1991 | Tactical archive entry 1991: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1992 | Tactical archive entry 1992: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1993 | Tactical archive entry 1993: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1994 | Tactical archive entry 1994: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1995 | Tactical archive entry 1995: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1996 | Tactical archive entry 1996: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1997 | Tactical archive entry 1997: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1998 | Tactical archive entry 1998: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-1999 | Tactical archive entry 1999: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2000 | Tactical archive entry 2000: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2001 | Tactical archive entry 2001: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2002 | Tactical archive entry 2002: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2003 | Tactical archive entry 2003: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2004 | Tactical archive entry 2004: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2005 | Tactical archive entry 2005: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2006 | Tactical archive entry 2006: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2007 | Tactical archive entry 2007: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2008 | Tactical archive entry 2008: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2009 | Tactical archive entry 2009: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2010 | Tactical archive entry 2010: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2011 | Tactical archive entry 2011: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2012 | Tactical archive entry 2012: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2013 | Tactical archive entry 2013: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2014 | Tactical archive entry 2014: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2015 | Tactical archive entry 2015: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2016 | Tactical archive entry 2016: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2017 | Tactical archive entry 2017: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2018 | Tactical archive entry 2018: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2019 | Tactical archive entry 2019: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2020 | Tactical archive entry 2020: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2021 | Tactical archive entry 2021: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2022 | Tactical archive entry 2022: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2023 | Tactical archive entry 2023: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2024 | Tactical archive entry 2024: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2025 | Tactical archive entry 2025: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2026 | Tactical archive entry 2026: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2027 | Tactical archive entry 2027: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2028 | Tactical archive entry 2028: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2029 | Tactical archive entry 2029: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2030 | Tactical archive entry 2030: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2031 | Tactical archive entry 2031: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2032 | Tactical archive entry 2032: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2033 | Tactical archive entry 2033: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2034 | Tactical archive entry 2034: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2035 | Tactical archive entry 2035: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2036 | Tactical archive entry 2036: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2037 | Tactical archive entry 2037: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2038 | Tactical archive entry 2038: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2039 | Tactical archive entry 2039: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2040 | Tactical archive entry 2040: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2041 | Tactical archive entry 2041: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2042 | Tactical archive entry 2042: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2043 | Tactical archive entry 2043: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2044 | Tactical archive entry 2044: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2045 | Tactical archive entry 2045: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2046 | Tactical archive entry 2046: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2047 | Tactical archive entry 2047: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2048 | Tactical archive entry 2048: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2049 | Tactical archive entry 2049: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2050 | Tactical archive entry 2050: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2051 | Tactical archive entry 2051: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2052 | Tactical archive entry 2052: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2053 | Tactical archive entry 2053: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2054 | Tactical archive entry 2054: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2055 | Tactical archive entry 2055: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2056 | Tactical archive entry 2056: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2057 | Tactical archive entry 2057: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2058 | Tactical archive entry 2058: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2059 | Tactical archive entry 2059: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2060 | Tactical archive entry 2060: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2061 | Tactical archive entry 2061: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2062 | Tactical archive entry 2062: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2063 | Tactical archive entry 2063: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2064 | Tactical archive entry 2064: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2065 | Tactical archive entry 2065: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2066 | Tactical archive entry 2066: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2067 | Tactical archive entry 2067: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2068 | Tactical archive entry 2068: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2069 | Tactical archive entry 2069: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2070 | Tactical archive entry 2070: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2071 | Tactical archive entry 2071: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2072 | Tactical archive entry 2072: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2073 | Tactical archive entry 2073: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2074 | Tactical archive entry 2074: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2075 | Tactical archive entry 2075: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2076 | Tactical archive entry 2076: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2077 | Tactical archive entry 2077: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2078 | Tactical archive entry 2078: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2079 | Tactical archive entry 2079: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2080 | Tactical archive entry 2080: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2081 | Tactical archive entry 2081: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2082 | Tactical archive entry 2082: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2083 | Tactical archive entry 2083: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2084 | Tactical archive entry 2084: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2085 | Tactical archive entry 2085: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2086 | Tactical archive entry 2086: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2087 | Tactical archive entry 2087: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2088 | Tactical archive entry 2088: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2089 | Tactical archive entry 2089: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2090 | Tactical archive entry 2090: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2091 | Tactical archive entry 2091: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2092 | Tactical archive entry 2092: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2093 | Tactical archive entry 2093: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2094 | Tactical archive entry 2094: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2095 | Tactical archive entry 2095: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2096 | Tactical archive entry 2096: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2097 | Tactical archive entry 2097: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2098 | Tactical archive entry 2098: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2099 | Tactical archive entry 2099: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2100 | Tactical archive entry 2100: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2101 | Tactical archive entry 2101: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2102 | Tactical archive entry 2102: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2103 | Tactical archive entry 2103: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2104 | Tactical archive entry 2104: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2105 | Tactical archive entry 2105: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2106 | Tactical archive entry 2106: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2107 | Tactical archive entry 2107: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2108 | Tactical archive entry 2108: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2109 | Tactical archive entry 2109: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2110 | Tactical archive entry 2110: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2111 | Tactical archive entry 2111: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2112 | Tactical archive entry 2112: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2113 | Tactical archive entry 2113: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2114 | Tactical archive entry 2114: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2115 | Tactical archive entry 2115: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2116 | Tactical archive entry 2116: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2117 | Tactical archive entry 2117: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2118 | Tactical archive entry 2118: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2119 | Tactical archive entry 2119: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2120 | Tactical archive entry 2120: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2121 | Tactical archive entry 2121: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2122 | Tactical archive entry 2122: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2123 | Tactical archive entry 2123: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2124 | Tactical archive entry 2124: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2125 | Tactical archive entry 2125: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2126 | Tactical archive entry 2126: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2127 | Tactical archive entry 2127: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2128 | Tactical archive entry 2128: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2129 | Tactical archive entry 2129: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2130 | Tactical archive entry 2130: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2131 | Tactical archive entry 2131: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2132 | Tactical archive entry 2132: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2133 | Tactical archive entry 2133: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2134 | Tactical archive entry 2134: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2135 | Tactical archive entry 2135: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2136 | Tactical archive entry 2136: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2137 | Tactical archive entry 2137: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2138 | Tactical archive entry 2138: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2139 | Tactical archive entry 2139: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2140 | Tactical archive entry 2140: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2141 | Tactical archive entry 2141: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2142 | Tactical archive entry 2142: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2143 | Tactical archive entry 2143: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2144 | Tactical archive entry 2144: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2145 | Tactical archive entry 2145: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2146 | Tactical archive entry 2146: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2147 | Tactical archive entry 2147: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2148 | Tactical archive entry 2148: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2149 | Tactical archive entry 2149: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2150 | Tactical archive entry 2150: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2151 | Tactical archive entry 2151: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2152 | Tactical archive entry 2152: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2153 | Tactical archive entry 2153: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2154 | Tactical archive entry 2154: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2155 | Tactical archive entry 2155: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2156 | Tactical archive entry 2156: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2157 | Tactical archive entry 2157: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2158 | Tactical archive entry 2158: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2159 | Tactical archive entry 2159: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2160 | Tactical archive entry 2160: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2161 | Tactical archive entry 2161: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2162 | Tactical archive entry 2162: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2163 | Tactical archive entry 2163: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2164 | Tactical archive entry 2164: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2165 | Tactical archive entry 2165: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2166 | Tactical archive entry 2166: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2167 | Tactical archive entry 2167: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2168 | Tactical archive entry 2168: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2169 | Tactical archive entry 2169: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2170 | Tactical archive entry 2170: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2171 | Tactical archive entry 2171: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2172 | Tactical archive entry 2172: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2173 | Tactical archive entry 2173: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2174 | Tactical archive entry 2174: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2175 | Tactical archive entry 2175: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2176 | Tactical archive entry 2176: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2177 | Tactical archive entry 2177: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2178 | Tactical archive entry 2178: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2179 | Tactical archive entry 2179: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2180 | Tactical archive entry 2180: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2181 | Tactical archive entry 2181: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2182 | Tactical archive entry 2182: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2183 | Tactical archive entry 2183: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2184 | Tactical archive entry 2184: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2185 | Tactical archive entry 2185: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2186 | Tactical archive entry 2186: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2187 | Tactical archive entry 2187: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2188 | Tactical archive entry 2188: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2189 | Tactical archive entry 2189: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2190 | Tactical archive entry 2190: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2191 | Tactical archive entry 2191: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2192 | Tactical archive entry 2192: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2193 | Tactical archive entry 2193: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2194 | Tactical archive entry 2194: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2195 | Tactical archive entry 2195: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2196 | Tactical archive entry 2196: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2197 | Tactical archive entry 2197: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2198 | Tactical archive entry 2198: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2199 | Tactical archive entry 2199: lane pressure, threat timing, and response doctrine profile.',
  'MEGA-2200 | Tactical archive entry 2200: lane pressure, threat timing, and response doctrine profile.',
];

const MEGA_CHALLENGE_PRESETS_V2 = [
  { id: 'mega-challenge-0001', title: 'Mega Challenge 0001', stars: 2, description: 'Escalated encounter stack profile 0001 with controlled mutator layering.', mutators: ['enemyCount+11%', 'enemySpeed+7%', 'dropRate-4%'] },
  { id: 'mega-challenge-0002', title: 'Mega Challenge 0002', stars: 3, description: 'Escalated encounter stack profile 0002 with controlled mutator layering.', mutators: ['enemyCount+12%', 'enemySpeed+8%', 'dropRate-5%'] },
  { id: 'mega-challenge-0003', title: 'Mega Challenge 0003', stars: 4, description: 'Escalated encounter stack profile 0003 with controlled mutator layering.', mutators: ['enemyCount+13%', 'enemySpeed+9%', 'dropRate-6%'] },
  { id: 'mega-challenge-0004', title: 'Mega Challenge 0004', stars: 5, description: 'Escalated encounter stack profile 0004 with controlled mutator layering.', mutators: ['enemyCount+14%', 'enemySpeed+10%', 'dropRate-7%'] },
  { id: 'mega-challenge-0005', title: 'Mega Challenge 0005', stars: 1, description: 'Escalated encounter stack profile 0005 with controlled mutator layering.', mutators: ['enemyCount+15%', 'enemySpeed+11%', 'dropRate-8%'] },
  { id: 'mega-challenge-0006', title: 'Mega Challenge 0006', stars: 2, description: 'Escalated encounter stack profile 0006 with controlled mutator layering.', mutators: ['enemyCount+16%', 'enemySpeed+12%', 'dropRate-9%'] },
  { id: 'mega-challenge-0007', title: 'Mega Challenge 0007', stars: 3, description: 'Escalated encounter stack profile 0007 with controlled mutator layering.', mutators: ['enemyCount+17%', 'enemySpeed+13%', 'dropRate-10%'] },
  { id: 'mega-challenge-0008', title: 'Mega Challenge 0008', stars: 4, description: 'Escalated encounter stack profile 0008 with controlled mutator layering.', mutators: ['enemyCount+18%', 'enemySpeed+14%', 'dropRate-11%'] },
  { id: 'mega-challenge-0009', title: 'Mega Challenge 0009', stars: 5, description: 'Escalated encounter stack profile 0009 with controlled mutator layering.', mutators: ['enemyCount+19%', 'enemySpeed+15%', 'dropRate-12%'] },
  { id: 'mega-challenge-0010', title: 'Mega Challenge 0010', stars: 1, description: 'Escalated encounter stack profile 0010 with controlled mutator layering.', mutators: ['enemyCount+20%', 'enemySpeed+16%', 'dropRate-13%'] },
  { id: 'mega-challenge-0011', title: 'Mega Challenge 0011', stars: 2, description: 'Escalated encounter stack profile 0011 with controlled mutator layering.', mutators: ['enemyCount+21%', 'enemySpeed+17%', 'dropRate-14%'] },
  { id: 'mega-challenge-0012', title: 'Mega Challenge 0012', stars: 3, description: 'Escalated encounter stack profile 0012 with controlled mutator layering.', mutators: ['enemyCount+22%', 'enemySpeed+18%', 'dropRate-15%'] },
  { id: 'mega-challenge-0013', title: 'Mega Challenge 0013', stars: 4, description: 'Escalated encounter stack profile 0013 with controlled mutator layering.', mutators: ['enemyCount+23%', 'enemySpeed+19%', 'dropRate-16%'] },
  { id: 'mega-challenge-0014', title: 'Mega Challenge 0014', stars: 5, description: 'Escalated encounter stack profile 0014 with controlled mutator layering.', mutators: ['enemyCount+24%', 'enemySpeed+20%', 'dropRate-17%'] },
  { id: 'mega-challenge-0015', title: 'Mega Challenge 0015', stars: 1, description: 'Escalated encounter stack profile 0015 with controlled mutator layering.', mutators: ['enemyCount+25%', 'enemySpeed+21%', 'dropRate-18%'] },
  { id: 'mega-challenge-0016', title: 'Mega Challenge 0016', stars: 2, description: 'Escalated encounter stack profile 0016 with controlled mutator layering.', mutators: ['enemyCount+26%', 'enemySpeed+22%', 'dropRate-19%'] },
  { id: 'mega-challenge-0017', title: 'Mega Challenge 0017', stars: 3, description: 'Escalated encounter stack profile 0017 with controlled mutator layering.', mutators: ['enemyCount+27%', 'enemySpeed+23%', 'dropRate-20%'] },
  { id: 'mega-challenge-0018', title: 'Mega Challenge 0018', stars: 4, description: 'Escalated encounter stack profile 0018 with controlled mutator layering.', mutators: ['enemyCount+28%', 'enemySpeed+24%', 'dropRate-21%'] },
  { id: 'mega-challenge-0019', title: 'Mega Challenge 0019', stars: 5, description: 'Escalated encounter stack profile 0019 with controlled mutator layering.', mutators: ['enemyCount+29%', 'enemySpeed+25%', 'dropRate-22%'] },
  { id: 'mega-challenge-0020', title: 'Mega Challenge 0020', stars: 1, description: 'Escalated encounter stack profile 0020 with controlled mutator layering.', mutators: ['enemyCount+30%', 'enemySpeed+26%', 'dropRate-23%'] },
  { id: 'mega-challenge-0021', title: 'Mega Challenge 0021', stars: 2, description: 'Escalated encounter stack profile 0021 with controlled mutator layering.', mutators: ['enemyCount+31%', 'enemySpeed+27%', 'dropRate-24%'] },
  { id: 'mega-challenge-0022', title: 'Mega Challenge 0022', stars: 3, description: 'Escalated encounter stack profile 0022 with controlled mutator layering.', mutators: ['enemyCount+32%', 'enemySpeed+28%', 'dropRate-3%'] },
  { id: 'mega-challenge-0023', title: 'Mega Challenge 0023', stars: 4, description: 'Escalated encounter stack profile 0023 with controlled mutator layering.', mutators: ['enemyCount+33%', 'enemySpeed+29%', 'dropRate-4%'] },
  { id: 'mega-challenge-0024', title: 'Mega Challenge 0024', stars: 5, description: 'Escalated encounter stack profile 0024 with controlled mutator layering.', mutators: ['enemyCount+34%', 'enemySpeed+30%', 'dropRate-5%'] },
  { id: 'mega-challenge-0025', title: 'Mega Challenge 0025', stars: 1, description: 'Escalated encounter stack profile 0025 with controlled mutator layering.', mutators: ['enemyCount+35%', 'enemySpeed+31%', 'dropRate-6%'] },
  { id: 'mega-challenge-0026', title: 'Mega Challenge 0026', stars: 2, description: 'Escalated encounter stack profile 0026 with controlled mutator layering.', mutators: ['enemyCount+36%', 'enemySpeed+32%', 'dropRate-7%'] },
  { id: 'mega-challenge-0027', title: 'Mega Challenge 0027', stars: 3, description: 'Escalated encounter stack profile 0027 with controlled mutator layering.', mutators: ['enemyCount+37%', 'enemySpeed+33%', 'dropRate-8%'] },
  { id: 'mega-challenge-0028', title: 'Mega Challenge 0028', stars: 4, description: 'Escalated encounter stack profile 0028 with controlled mutator layering.', mutators: ['enemyCount+38%', 'enemySpeed+34%', 'dropRate-9%'] },
  { id: 'mega-challenge-0029', title: 'Mega Challenge 0029', stars: 5, description: 'Escalated encounter stack profile 0029 with controlled mutator layering.', mutators: ['enemyCount+39%', 'enemySpeed+35%', 'dropRate-10%'] },
  { id: 'mega-challenge-0030', title: 'Mega Challenge 0030', stars: 1, description: 'Escalated encounter stack profile 0030 with controlled mutator layering.', mutators: ['enemyCount+40%', 'enemySpeed+6%', 'dropRate-11%'] },
  { id: 'mega-challenge-0031', title: 'Mega Challenge 0031', stars: 2, description: 'Escalated encounter stack profile 0031 with controlled mutator layering.', mutators: ['enemyCount+41%', 'enemySpeed+7%', 'dropRate-12%'] },
  { id: 'mega-challenge-0032', title: 'Mega Challenge 0032', stars: 3, description: 'Escalated encounter stack profile 0032 with controlled mutator layering.', mutators: ['enemyCount+42%', 'enemySpeed+8%', 'dropRate-13%'] },
  { id: 'mega-challenge-0033', title: 'Mega Challenge 0033', stars: 4, description: 'Escalated encounter stack profile 0033 with controlled mutator layering.', mutators: ['enemyCount+43%', 'enemySpeed+9%', 'dropRate-14%'] },
  { id: 'mega-challenge-0034', title: 'Mega Challenge 0034', stars: 5, description: 'Escalated encounter stack profile 0034 with controlled mutator layering.', mutators: ['enemyCount+44%', 'enemySpeed+10%', 'dropRate-15%'] },
  { id: 'mega-challenge-0035', title: 'Mega Challenge 0035', stars: 1, description: 'Escalated encounter stack profile 0035 with controlled mutator layering.', mutators: ['enemyCount+45%', 'enemySpeed+11%', 'dropRate-16%'] },
  { id: 'mega-challenge-0036', title: 'Mega Challenge 0036', stars: 2, description: 'Escalated encounter stack profile 0036 with controlled mutator layering.', mutators: ['enemyCount+46%', 'enemySpeed+12%', 'dropRate-17%'] },
  { id: 'mega-challenge-0037', title: 'Mega Challenge 0037', stars: 3, description: 'Escalated encounter stack profile 0037 with controlled mutator layering.', mutators: ['enemyCount+47%', 'enemySpeed+13%', 'dropRate-18%'] },
  { id: 'mega-challenge-0038', title: 'Mega Challenge 0038', stars: 4, description: 'Escalated encounter stack profile 0038 with controlled mutator layering.', mutators: ['enemyCount+48%', 'enemySpeed+14%', 'dropRate-19%'] },
  { id: 'mega-challenge-0039', title: 'Mega Challenge 0039', stars: 5, description: 'Escalated encounter stack profile 0039 with controlled mutator layering.', mutators: ['enemyCount+49%', 'enemySpeed+15%', 'dropRate-20%'] },
  { id: 'mega-challenge-0040', title: 'Mega Challenge 0040', stars: 1, description: 'Escalated encounter stack profile 0040 with controlled mutator layering.', mutators: ['enemyCount+50%', 'enemySpeed+16%', 'dropRate-21%'] },
  { id: 'mega-challenge-0041', title: 'Mega Challenge 0041', stars: 2, description: 'Escalated encounter stack profile 0041 with controlled mutator layering.', mutators: ['enemyCount+51%', 'enemySpeed+17%', 'dropRate-22%'] },
  { id: 'mega-challenge-0042', title: 'Mega Challenge 0042', stars: 3, description: 'Escalated encounter stack profile 0042 with controlled mutator layering.', mutators: ['enemyCount+52%', 'enemySpeed+18%', 'dropRate-23%'] },
  { id: 'mega-challenge-0043', title: 'Mega Challenge 0043', stars: 4, description: 'Escalated encounter stack profile 0043 with controlled mutator layering.', mutators: ['enemyCount+53%', 'enemySpeed+19%', 'dropRate-24%'] },
  { id: 'mega-challenge-0044', title: 'Mega Challenge 0044', stars: 5, description: 'Escalated encounter stack profile 0044 with controlled mutator layering.', mutators: ['enemyCount+54%', 'enemySpeed+20%', 'dropRate-3%'] },
  { id: 'mega-challenge-0045', title: 'Mega Challenge 0045', stars: 1, description: 'Escalated encounter stack profile 0045 with controlled mutator layering.', mutators: ['enemyCount+10%', 'enemySpeed+21%', 'dropRate-4%'] },
  { id: 'mega-challenge-0046', title: 'Mega Challenge 0046', stars: 2, description: 'Escalated encounter stack profile 0046 with controlled mutator layering.', mutators: ['enemyCount+11%', 'enemySpeed+22%', 'dropRate-5%'] },
  { id: 'mega-challenge-0047', title: 'Mega Challenge 0047', stars: 3, description: 'Escalated encounter stack profile 0047 with controlled mutator layering.', mutators: ['enemyCount+12%', 'enemySpeed+23%', 'dropRate-6%'] },
  { id: 'mega-challenge-0048', title: 'Mega Challenge 0048', stars: 4, description: 'Escalated encounter stack profile 0048 with controlled mutator layering.', mutators: ['enemyCount+13%', 'enemySpeed+24%', 'dropRate-7%'] },
  { id: 'mega-challenge-0049', title: 'Mega Challenge 0049', stars: 5, description: 'Escalated encounter stack profile 0049 with controlled mutator layering.', mutators: ['enemyCount+14%', 'enemySpeed+25%', 'dropRate-8%'] },
  { id: 'mega-challenge-0050', title: 'Mega Challenge 0050', stars: 1, description: 'Escalated encounter stack profile 0050 with controlled mutator layering.', mutators: ['enemyCount+15%', 'enemySpeed+26%', 'dropRate-9%'] },
  { id: 'mega-challenge-0051', title: 'Mega Challenge 0051', stars: 2, description: 'Escalated encounter stack profile 0051 with controlled mutator layering.', mutators: ['enemyCount+16%', 'enemySpeed+27%', 'dropRate-10%'] },
  { id: 'mega-challenge-0052', title: 'Mega Challenge 0052', stars: 3, description: 'Escalated encounter stack profile 0052 with controlled mutator layering.', mutators: ['enemyCount+17%', 'enemySpeed+28%', 'dropRate-11%'] },
  { id: 'mega-challenge-0053', title: 'Mega Challenge 0053', stars: 4, description: 'Escalated encounter stack profile 0053 with controlled mutator layering.', mutators: ['enemyCount+18%', 'enemySpeed+29%', 'dropRate-12%'] },
  { id: 'mega-challenge-0054', title: 'Mega Challenge 0054', stars: 5, description: 'Escalated encounter stack profile 0054 with controlled mutator layering.', mutators: ['enemyCount+19%', 'enemySpeed+30%', 'dropRate-13%'] },
  { id: 'mega-challenge-0055', title: 'Mega Challenge 0055', stars: 1, description: 'Escalated encounter stack profile 0055 with controlled mutator layering.', mutators: ['enemyCount+20%', 'enemySpeed+31%', 'dropRate-14%'] },
  { id: 'mega-challenge-0056', title: 'Mega Challenge 0056', stars: 2, description: 'Escalated encounter stack profile 0056 with controlled mutator layering.', mutators: ['enemyCount+21%', 'enemySpeed+32%', 'dropRate-15%'] },
  { id: 'mega-challenge-0057', title: 'Mega Challenge 0057', stars: 3, description: 'Escalated encounter stack profile 0057 with controlled mutator layering.', mutators: ['enemyCount+22%', 'enemySpeed+33%', 'dropRate-16%'] },
  { id: 'mega-challenge-0058', title: 'Mega Challenge 0058', stars: 4, description: 'Escalated encounter stack profile 0058 with controlled mutator layering.', mutators: ['enemyCount+23%', 'enemySpeed+34%', 'dropRate-17%'] },
  { id: 'mega-challenge-0059', title: 'Mega Challenge 0059', stars: 5, description: 'Escalated encounter stack profile 0059 with controlled mutator layering.', mutators: ['enemyCount+24%', 'enemySpeed+35%', 'dropRate-18%'] },
  { id: 'mega-challenge-0060', title: 'Mega Challenge 0060', stars: 1, description: 'Escalated encounter stack profile 0060 with controlled mutator layering.', mutators: ['enemyCount+25%', 'enemySpeed+6%', 'dropRate-19%'] },
  { id: 'mega-challenge-0061', title: 'Mega Challenge 0061', stars: 2, description: 'Escalated encounter stack profile 0061 with controlled mutator layering.', mutators: ['enemyCount+26%', 'enemySpeed+7%', 'dropRate-20%'] },
  { id: 'mega-challenge-0062', title: 'Mega Challenge 0062', stars: 3, description: 'Escalated encounter stack profile 0062 with controlled mutator layering.', mutators: ['enemyCount+27%', 'enemySpeed+8%', 'dropRate-21%'] },
  { id: 'mega-challenge-0063', title: 'Mega Challenge 0063', stars: 4, description: 'Escalated encounter stack profile 0063 with controlled mutator layering.', mutators: ['enemyCount+28%', 'enemySpeed+9%', 'dropRate-22%'] },
  { id: 'mega-challenge-0064', title: 'Mega Challenge 0064', stars: 5, description: 'Escalated encounter stack profile 0064 with controlled mutator layering.', mutators: ['enemyCount+29%', 'enemySpeed+10%', 'dropRate-23%'] },
  { id: 'mega-challenge-0065', title: 'Mega Challenge 0065', stars: 1, description: 'Escalated encounter stack profile 0065 with controlled mutator layering.', mutators: ['enemyCount+30%', 'enemySpeed+11%', 'dropRate-24%'] },
  { id: 'mega-challenge-0066', title: 'Mega Challenge 0066', stars: 2, description: 'Escalated encounter stack profile 0066 with controlled mutator layering.', mutators: ['enemyCount+31%', 'enemySpeed+12%', 'dropRate-3%'] },
  { id: 'mega-challenge-0067', title: 'Mega Challenge 0067', stars: 3, description: 'Escalated encounter stack profile 0067 with controlled mutator layering.', mutators: ['enemyCount+32%', 'enemySpeed+13%', 'dropRate-4%'] },
  { id: 'mega-challenge-0068', title: 'Mega Challenge 0068', stars: 4, description: 'Escalated encounter stack profile 0068 with controlled mutator layering.', mutators: ['enemyCount+33%', 'enemySpeed+14%', 'dropRate-5%'] },
  { id: 'mega-challenge-0069', title: 'Mega Challenge 0069', stars: 5, description: 'Escalated encounter stack profile 0069 with controlled mutator layering.', mutators: ['enemyCount+34%', 'enemySpeed+15%', 'dropRate-6%'] },
  { id: 'mega-challenge-0070', title: 'Mega Challenge 0070', stars: 1, description: 'Escalated encounter stack profile 0070 with controlled mutator layering.', mutators: ['enemyCount+35%', 'enemySpeed+16%', 'dropRate-7%'] },
  { id: 'mega-challenge-0071', title: 'Mega Challenge 0071', stars: 2, description: 'Escalated encounter stack profile 0071 with controlled mutator layering.', mutators: ['enemyCount+36%', 'enemySpeed+17%', 'dropRate-8%'] },
  { id: 'mega-challenge-0072', title: 'Mega Challenge 0072', stars: 3, description: 'Escalated encounter stack profile 0072 with controlled mutator layering.', mutators: ['enemyCount+37%', 'enemySpeed+18%', 'dropRate-9%'] },
  { id: 'mega-challenge-0073', title: 'Mega Challenge 0073', stars: 4, description: 'Escalated encounter stack profile 0073 with controlled mutator layering.', mutators: ['enemyCount+38%', 'enemySpeed+19%', 'dropRate-10%'] },
  { id: 'mega-challenge-0074', title: 'Mega Challenge 0074', stars: 5, description: 'Escalated encounter stack profile 0074 with controlled mutator layering.', mutators: ['enemyCount+39%', 'enemySpeed+20%', 'dropRate-11%'] },
  { id: 'mega-challenge-0075', title: 'Mega Challenge 0075', stars: 1, description: 'Escalated encounter stack profile 0075 with controlled mutator layering.', mutators: ['enemyCount+40%', 'enemySpeed+21%', 'dropRate-12%'] },
  { id: 'mega-challenge-0076', title: 'Mega Challenge 0076', stars: 2, description: 'Escalated encounter stack profile 0076 with controlled mutator layering.', mutators: ['enemyCount+41%', 'enemySpeed+22%', 'dropRate-13%'] },
  { id: 'mega-challenge-0077', title: 'Mega Challenge 0077', stars: 3, description: 'Escalated encounter stack profile 0077 with controlled mutator layering.', mutators: ['enemyCount+42%', 'enemySpeed+23%', 'dropRate-14%'] },
  { id: 'mega-challenge-0078', title: 'Mega Challenge 0078', stars: 4, description: 'Escalated encounter stack profile 0078 with controlled mutator layering.', mutators: ['enemyCount+43%', 'enemySpeed+24%', 'dropRate-15%'] },
  { id: 'mega-challenge-0079', title: 'Mega Challenge 0079', stars: 5, description: 'Escalated encounter stack profile 0079 with controlled mutator layering.', mutators: ['enemyCount+44%', 'enemySpeed+25%', 'dropRate-16%'] },
  { id: 'mega-challenge-0080', title: 'Mega Challenge 0080', stars: 1, description: 'Escalated encounter stack profile 0080 with controlled mutator layering.', mutators: ['enemyCount+45%', 'enemySpeed+26%', 'dropRate-17%'] },
  { id: 'mega-challenge-0081', title: 'Mega Challenge 0081', stars: 2, description: 'Escalated encounter stack profile 0081 with controlled mutator layering.', mutators: ['enemyCount+46%', 'enemySpeed+27%', 'dropRate-18%'] },
  { id: 'mega-challenge-0082', title: 'Mega Challenge 0082', stars: 3, description: 'Escalated encounter stack profile 0082 with controlled mutator layering.', mutators: ['enemyCount+47%', 'enemySpeed+28%', 'dropRate-19%'] },
  { id: 'mega-challenge-0083', title: 'Mega Challenge 0083', stars: 4, description: 'Escalated encounter stack profile 0083 with controlled mutator layering.', mutators: ['enemyCount+48%', 'enemySpeed+29%', 'dropRate-20%'] },
  { id: 'mega-challenge-0084', title: 'Mega Challenge 0084', stars: 5, description: 'Escalated encounter stack profile 0084 with controlled mutator layering.', mutators: ['enemyCount+49%', 'enemySpeed+30%', 'dropRate-21%'] },
  { id: 'mega-challenge-0085', title: 'Mega Challenge 0085', stars: 1, description: 'Escalated encounter stack profile 0085 with controlled mutator layering.', mutators: ['enemyCount+50%', 'enemySpeed+31%', 'dropRate-22%'] },
  { id: 'mega-challenge-0086', title: 'Mega Challenge 0086', stars: 2, description: 'Escalated encounter stack profile 0086 with controlled mutator layering.', mutators: ['enemyCount+51%', 'enemySpeed+32%', 'dropRate-23%'] },
  { id: 'mega-challenge-0087', title: 'Mega Challenge 0087', stars: 3, description: 'Escalated encounter stack profile 0087 with controlled mutator layering.', mutators: ['enemyCount+52%', 'enemySpeed+33%', 'dropRate-24%'] },
  { id: 'mega-challenge-0088', title: 'Mega Challenge 0088', stars: 4, description: 'Escalated encounter stack profile 0088 with controlled mutator layering.', mutators: ['enemyCount+53%', 'enemySpeed+34%', 'dropRate-3%'] },
  { id: 'mega-challenge-0089', title: 'Mega Challenge 0089', stars: 5, description: 'Escalated encounter stack profile 0089 with controlled mutator layering.', mutators: ['enemyCount+54%', 'enemySpeed+35%', 'dropRate-4%'] },
  { id: 'mega-challenge-0090', title: 'Mega Challenge 0090', stars: 1, description: 'Escalated encounter stack profile 0090 with controlled mutator layering.', mutators: ['enemyCount+10%', 'enemySpeed+6%', 'dropRate-5%'] },
  { id: 'mega-challenge-0091', title: 'Mega Challenge 0091', stars: 2, description: 'Escalated encounter stack profile 0091 with controlled mutator layering.', mutators: ['enemyCount+11%', 'enemySpeed+7%', 'dropRate-6%'] },
  { id: 'mega-challenge-0092', title: 'Mega Challenge 0092', stars: 3, description: 'Escalated encounter stack profile 0092 with controlled mutator layering.', mutators: ['enemyCount+12%', 'enemySpeed+8%', 'dropRate-7%'] },
  { id: 'mega-challenge-0093', title: 'Mega Challenge 0093', stars: 4, description: 'Escalated encounter stack profile 0093 with controlled mutator layering.', mutators: ['enemyCount+13%', 'enemySpeed+9%', 'dropRate-8%'] },
  { id: 'mega-challenge-0094', title: 'Mega Challenge 0094', stars: 5, description: 'Escalated encounter stack profile 0094 with controlled mutator layering.', mutators: ['enemyCount+14%', 'enemySpeed+10%', 'dropRate-9%'] },
  { id: 'mega-challenge-0095', title: 'Mega Challenge 0095', stars: 1, description: 'Escalated encounter stack profile 0095 with controlled mutator layering.', mutators: ['enemyCount+15%', 'enemySpeed+11%', 'dropRate-10%'] },
  { id: 'mega-challenge-0096', title: 'Mega Challenge 0096', stars: 2, description: 'Escalated encounter stack profile 0096 with controlled mutator layering.', mutators: ['enemyCount+16%', 'enemySpeed+12%', 'dropRate-11%'] },
  { id: 'mega-challenge-0097', title: 'Mega Challenge 0097', stars: 3, description: 'Escalated encounter stack profile 0097 with controlled mutator layering.', mutators: ['enemyCount+17%', 'enemySpeed+13%', 'dropRate-12%'] },
  { id: 'mega-challenge-0098', title: 'Mega Challenge 0098', stars: 4, description: 'Escalated encounter stack profile 0098 with controlled mutator layering.', mutators: ['enemyCount+18%', 'enemySpeed+14%', 'dropRate-13%'] },
  { id: 'mega-challenge-0099', title: 'Mega Challenge 0099', stars: 5, description: 'Escalated encounter stack profile 0099 with controlled mutator layering.', mutators: ['enemyCount+19%', 'enemySpeed+15%', 'dropRate-14%'] },
  { id: 'mega-challenge-0100', title: 'Mega Challenge 0100', stars: 1, description: 'Escalated encounter stack profile 0100 with controlled mutator layering.', mutators: ['enemyCount+20%', 'enemySpeed+16%', 'dropRate-15%'] },
  { id: 'mega-challenge-0101', title: 'Mega Challenge 0101', stars: 2, description: 'Escalated encounter stack profile 0101 with controlled mutator layering.', mutators: ['enemyCount+21%', 'enemySpeed+17%', 'dropRate-16%'] },
  { id: 'mega-challenge-0102', title: 'Mega Challenge 0102', stars: 3, description: 'Escalated encounter stack profile 0102 with controlled mutator layering.', mutators: ['enemyCount+22%', 'enemySpeed+18%', 'dropRate-17%'] },
  { id: 'mega-challenge-0103', title: 'Mega Challenge 0103', stars: 4, description: 'Escalated encounter stack profile 0103 with controlled mutator layering.', mutators: ['enemyCount+23%', 'enemySpeed+19%', 'dropRate-18%'] },
  { id: 'mega-challenge-0104', title: 'Mega Challenge 0104', stars: 5, description: 'Escalated encounter stack profile 0104 with controlled mutator layering.', mutators: ['enemyCount+24%', 'enemySpeed+20%', 'dropRate-19%'] },
  { id: 'mega-challenge-0105', title: 'Mega Challenge 0105', stars: 1, description: 'Escalated encounter stack profile 0105 with controlled mutator layering.', mutators: ['enemyCount+25%', 'enemySpeed+21%', 'dropRate-20%'] },
  { id: 'mega-challenge-0106', title: 'Mega Challenge 0106', stars: 2, description: 'Escalated encounter stack profile 0106 with controlled mutator layering.', mutators: ['enemyCount+26%', 'enemySpeed+22%', 'dropRate-21%'] },
  { id: 'mega-challenge-0107', title: 'Mega Challenge 0107', stars: 3, description: 'Escalated encounter stack profile 0107 with controlled mutator layering.', mutators: ['enemyCount+27%', 'enemySpeed+23%', 'dropRate-22%'] },
  { id: 'mega-challenge-0108', title: 'Mega Challenge 0108', stars: 4, description: 'Escalated encounter stack profile 0108 with controlled mutator layering.', mutators: ['enemyCount+28%', 'enemySpeed+24%', 'dropRate-23%'] },
  { id: 'mega-challenge-0109', title: 'Mega Challenge 0109', stars: 5, description: 'Escalated encounter stack profile 0109 with controlled mutator layering.', mutators: ['enemyCount+29%', 'enemySpeed+25%', 'dropRate-24%'] },
  { id: 'mega-challenge-0110', title: 'Mega Challenge 0110', stars: 1, description: 'Escalated encounter stack profile 0110 with controlled mutator layering.', mutators: ['enemyCount+30%', 'enemySpeed+26%', 'dropRate-3%'] },
  { id: 'mega-challenge-0111', title: 'Mega Challenge 0111', stars: 2, description: 'Escalated encounter stack profile 0111 with controlled mutator layering.', mutators: ['enemyCount+31%', 'enemySpeed+27%', 'dropRate-4%'] },
  { id: 'mega-challenge-0112', title: 'Mega Challenge 0112', stars: 3, description: 'Escalated encounter stack profile 0112 with controlled mutator layering.', mutators: ['enemyCount+32%', 'enemySpeed+28%', 'dropRate-5%'] },
  { id: 'mega-challenge-0113', title: 'Mega Challenge 0113', stars: 4, description: 'Escalated encounter stack profile 0113 with controlled mutator layering.', mutators: ['enemyCount+33%', 'enemySpeed+29%', 'dropRate-6%'] },
  { id: 'mega-challenge-0114', title: 'Mega Challenge 0114', stars: 5, description: 'Escalated encounter stack profile 0114 with controlled mutator layering.', mutators: ['enemyCount+34%', 'enemySpeed+30%', 'dropRate-7%'] },
  { id: 'mega-challenge-0115', title: 'Mega Challenge 0115', stars: 1, description: 'Escalated encounter stack profile 0115 with controlled mutator layering.', mutators: ['enemyCount+35%', 'enemySpeed+31%', 'dropRate-8%'] },
  { id: 'mega-challenge-0116', title: 'Mega Challenge 0116', stars: 2, description: 'Escalated encounter stack profile 0116 with controlled mutator layering.', mutators: ['enemyCount+36%', 'enemySpeed+32%', 'dropRate-9%'] },
  { id: 'mega-challenge-0117', title: 'Mega Challenge 0117', stars: 3, description: 'Escalated encounter stack profile 0117 with controlled mutator layering.', mutators: ['enemyCount+37%', 'enemySpeed+33%', 'dropRate-10%'] },
  { id: 'mega-challenge-0118', title: 'Mega Challenge 0118', stars: 4, description: 'Escalated encounter stack profile 0118 with controlled mutator layering.', mutators: ['enemyCount+38%', 'enemySpeed+34%', 'dropRate-11%'] },
  { id: 'mega-challenge-0119', title: 'Mega Challenge 0119', stars: 5, description: 'Escalated encounter stack profile 0119 with controlled mutator layering.', mutators: ['enemyCount+39%', 'enemySpeed+35%', 'dropRate-12%'] },
  { id: 'mega-challenge-0120', title: 'Mega Challenge 0120', stars: 1, description: 'Escalated encounter stack profile 0120 with controlled mutator layering.', mutators: ['enemyCount+40%', 'enemySpeed+6%', 'dropRate-13%'] },
  { id: 'mega-challenge-0121', title: 'Mega Challenge 0121', stars: 2, description: 'Escalated encounter stack profile 0121 with controlled mutator layering.', mutators: ['enemyCount+41%', 'enemySpeed+7%', 'dropRate-14%'] },
  { id: 'mega-challenge-0122', title: 'Mega Challenge 0122', stars: 3, description: 'Escalated encounter stack profile 0122 with controlled mutator layering.', mutators: ['enemyCount+42%', 'enemySpeed+8%', 'dropRate-15%'] },
  { id: 'mega-challenge-0123', title: 'Mega Challenge 0123', stars: 4, description: 'Escalated encounter stack profile 0123 with controlled mutator layering.', mutators: ['enemyCount+43%', 'enemySpeed+9%', 'dropRate-16%'] },
  { id: 'mega-challenge-0124', title: 'Mega Challenge 0124', stars: 5, description: 'Escalated encounter stack profile 0124 with controlled mutator layering.', mutators: ['enemyCount+44%', 'enemySpeed+10%', 'dropRate-17%'] },
  { id: 'mega-challenge-0125', title: 'Mega Challenge 0125', stars: 1, description: 'Escalated encounter stack profile 0125 with controlled mutator layering.', mutators: ['enemyCount+45%', 'enemySpeed+11%', 'dropRate-18%'] },
  { id: 'mega-challenge-0126', title: 'Mega Challenge 0126', stars: 2, description: 'Escalated encounter stack profile 0126 with controlled mutator layering.', mutators: ['enemyCount+46%', 'enemySpeed+12%', 'dropRate-19%'] },
  { id: 'mega-challenge-0127', title: 'Mega Challenge 0127', stars: 3, description: 'Escalated encounter stack profile 0127 with controlled mutator layering.', mutators: ['enemyCount+47%', 'enemySpeed+13%', 'dropRate-20%'] },
  { id: 'mega-challenge-0128', title: 'Mega Challenge 0128', stars: 4, description: 'Escalated encounter stack profile 0128 with controlled mutator layering.', mutators: ['enemyCount+48%', 'enemySpeed+14%', 'dropRate-21%'] },
  { id: 'mega-challenge-0129', title: 'Mega Challenge 0129', stars: 5, description: 'Escalated encounter stack profile 0129 with controlled mutator layering.', mutators: ['enemyCount+49%', 'enemySpeed+15%', 'dropRate-22%'] },
  { id: 'mega-challenge-0130', title: 'Mega Challenge 0130', stars: 1, description: 'Escalated encounter stack profile 0130 with controlled mutator layering.', mutators: ['enemyCount+50%', 'enemySpeed+16%', 'dropRate-23%'] },
  { id: 'mega-challenge-0131', title: 'Mega Challenge 0131', stars: 2, description: 'Escalated encounter stack profile 0131 with controlled mutator layering.', mutators: ['enemyCount+51%', 'enemySpeed+17%', 'dropRate-24%'] },
  { id: 'mega-challenge-0132', title: 'Mega Challenge 0132', stars: 3, description: 'Escalated encounter stack profile 0132 with controlled mutator layering.', mutators: ['enemyCount+52%', 'enemySpeed+18%', 'dropRate-3%'] },
  { id: 'mega-challenge-0133', title: 'Mega Challenge 0133', stars: 4, description: 'Escalated encounter stack profile 0133 with controlled mutator layering.', mutators: ['enemyCount+53%', 'enemySpeed+19%', 'dropRate-4%'] },
  { id: 'mega-challenge-0134', title: 'Mega Challenge 0134', stars: 5, description: 'Escalated encounter stack profile 0134 with controlled mutator layering.', mutators: ['enemyCount+54%', 'enemySpeed+20%', 'dropRate-5%'] },
  { id: 'mega-challenge-0135', title: 'Mega Challenge 0135', stars: 1, description: 'Escalated encounter stack profile 0135 with controlled mutator layering.', mutators: ['enemyCount+10%', 'enemySpeed+21%', 'dropRate-6%'] },
  { id: 'mega-challenge-0136', title: 'Mega Challenge 0136', stars: 2, description: 'Escalated encounter stack profile 0136 with controlled mutator layering.', mutators: ['enemyCount+11%', 'enemySpeed+22%', 'dropRate-7%'] },
  { id: 'mega-challenge-0137', title: 'Mega Challenge 0137', stars: 3, description: 'Escalated encounter stack profile 0137 with controlled mutator layering.', mutators: ['enemyCount+12%', 'enemySpeed+23%', 'dropRate-8%'] },
  { id: 'mega-challenge-0138', title: 'Mega Challenge 0138', stars: 4, description: 'Escalated encounter stack profile 0138 with controlled mutator layering.', mutators: ['enemyCount+13%', 'enemySpeed+24%', 'dropRate-9%'] },
  { id: 'mega-challenge-0139', title: 'Mega Challenge 0139', stars: 5, description: 'Escalated encounter stack profile 0139 with controlled mutator layering.', mutators: ['enemyCount+14%', 'enemySpeed+25%', 'dropRate-10%'] },
  { id: 'mega-challenge-0140', title: 'Mega Challenge 0140', stars: 1, description: 'Escalated encounter stack profile 0140 with controlled mutator layering.', mutators: ['enemyCount+15%', 'enemySpeed+26%', 'dropRate-11%'] },
  { id: 'mega-challenge-0141', title: 'Mega Challenge 0141', stars: 2, description: 'Escalated encounter stack profile 0141 with controlled mutator layering.', mutators: ['enemyCount+16%', 'enemySpeed+27%', 'dropRate-12%'] },
  { id: 'mega-challenge-0142', title: 'Mega Challenge 0142', stars: 3, description: 'Escalated encounter stack profile 0142 with controlled mutator layering.', mutators: ['enemyCount+17%', 'enemySpeed+28%', 'dropRate-13%'] },
  { id: 'mega-challenge-0143', title: 'Mega Challenge 0143', stars: 4, description: 'Escalated encounter stack profile 0143 with controlled mutator layering.', mutators: ['enemyCount+18%', 'enemySpeed+29%', 'dropRate-14%'] },
  { id: 'mega-challenge-0144', title: 'Mega Challenge 0144', stars: 5, description: 'Escalated encounter stack profile 0144 with controlled mutator layering.', mutators: ['enemyCount+19%', 'enemySpeed+30%', 'dropRate-15%'] },
  { id: 'mega-challenge-0145', title: 'Mega Challenge 0145', stars: 1, description: 'Escalated encounter stack profile 0145 with controlled mutator layering.', mutators: ['enemyCount+20%', 'enemySpeed+31%', 'dropRate-16%'] },
  { id: 'mega-challenge-0146', title: 'Mega Challenge 0146', stars: 2, description: 'Escalated encounter stack profile 0146 with controlled mutator layering.', mutators: ['enemyCount+21%', 'enemySpeed+32%', 'dropRate-17%'] },
  { id: 'mega-challenge-0147', title: 'Mega Challenge 0147', stars: 3, description: 'Escalated encounter stack profile 0147 with controlled mutator layering.', mutators: ['enemyCount+22%', 'enemySpeed+33%', 'dropRate-18%'] },
  { id: 'mega-challenge-0148', title: 'Mega Challenge 0148', stars: 4, description: 'Escalated encounter stack profile 0148 with controlled mutator layering.', mutators: ['enemyCount+23%', 'enemySpeed+34%', 'dropRate-19%'] },
  { id: 'mega-challenge-0149', title: 'Mega Challenge 0149', stars: 5, description: 'Escalated encounter stack profile 0149 with controlled mutator layering.', mutators: ['enemyCount+24%', 'enemySpeed+35%', 'dropRate-20%'] },
  { id: 'mega-challenge-0150', title: 'Mega Challenge 0150', stars: 1, description: 'Escalated encounter stack profile 0150 with controlled mutator layering.', mutators: ['enemyCount+25%', 'enemySpeed+6%', 'dropRate-21%'] },
  { id: 'mega-challenge-0151', title: 'Mega Challenge 0151', stars: 2, description: 'Escalated encounter stack profile 0151 with controlled mutator layering.', mutators: ['enemyCount+26%', 'enemySpeed+7%', 'dropRate-22%'] },
  { id: 'mega-challenge-0152', title: 'Mega Challenge 0152', stars: 3, description: 'Escalated encounter stack profile 0152 with controlled mutator layering.', mutators: ['enemyCount+27%', 'enemySpeed+8%', 'dropRate-23%'] },
  { id: 'mega-challenge-0153', title: 'Mega Challenge 0153', stars: 4, description: 'Escalated encounter stack profile 0153 with controlled mutator layering.', mutators: ['enemyCount+28%', 'enemySpeed+9%', 'dropRate-24%'] },
  { id: 'mega-challenge-0154', title: 'Mega Challenge 0154', stars: 5, description: 'Escalated encounter stack profile 0154 with controlled mutator layering.', mutators: ['enemyCount+29%', 'enemySpeed+10%', 'dropRate-3%'] },
  { id: 'mega-challenge-0155', title: 'Mega Challenge 0155', stars: 1, description: 'Escalated encounter stack profile 0155 with controlled mutator layering.', mutators: ['enemyCount+30%', 'enemySpeed+11%', 'dropRate-4%'] },
  { id: 'mega-challenge-0156', title: 'Mega Challenge 0156', stars: 2, description: 'Escalated encounter stack profile 0156 with controlled mutator layering.', mutators: ['enemyCount+31%', 'enemySpeed+12%', 'dropRate-5%'] },
  { id: 'mega-challenge-0157', title: 'Mega Challenge 0157', stars: 3, description: 'Escalated encounter stack profile 0157 with controlled mutator layering.', mutators: ['enemyCount+32%', 'enemySpeed+13%', 'dropRate-6%'] },
  { id: 'mega-challenge-0158', title: 'Mega Challenge 0158', stars: 4, description: 'Escalated encounter stack profile 0158 with controlled mutator layering.', mutators: ['enemyCount+33%', 'enemySpeed+14%', 'dropRate-7%'] },
  { id: 'mega-challenge-0159', title: 'Mega Challenge 0159', stars: 5, description: 'Escalated encounter stack profile 0159 with controlled mutator layering.', mutators: ['enemyCount+34%', 'enemySpeed+15%', 'dropRate-8%'] },
  { id: 'mega-challenge-0160', title: 'Mega Challenge 0160', stars: 1, description: 'Escalated encounter stack profile 0160 with controlled mutator layering.', mutators: ['enemyCount+35%', 'enemySpeed+16%', 'dropRate-9%'] },
  { id: 'mega-challenge-0161', title: 'Mega Challenge 0161', stars: 2, description: 'Escalated encounter stack profile 0161 with controlled mutator layering.', mutators: ['enemyCount+36%', 'enemySpeed+17%', 'dropRate-10%'] },
  { id: 'mega-challenge-0162', title: 'Mega Challenge 0162', stars: 3, description: 'Escalated encounter stack profile 0162 with controlled mutator layering.', mutators: ['enemyCount+37%', 'enemySpeed+18%', 'dropRate-11%'] },
  { id: 'mega-challenge-0163', title: 'Mega Challenge 0163', stars: 4, description: 'Escalated encounter stack profile 0163 with controlled mutator layering.', mutators: ['enemyCount+38%', 'enemySpeed+19%', 'dropRate-12%'] },
  { id: 'mega-challenge-0164', title: 'Mega Challenge 0164', stars: 5, description: 'Escalated encounter stack profile 0164 with controlled mutator layering.', mutators: ['enemyCount+39%', 'enemySpeed+20%', 'dropRate-13%'] },
  { id: 'mega-challenge-0165', title: 'Mega Challenge 0165', stars: 1, description: 'Escalated encounter stack profile 0165 with controlled mutator layering.', mutators: ['enemyCount+40%', 'enemySpeed+21%', 'dropRate-14%'] },
  { id: 'mega-challenge-0166', title: 'Mega Challenge 0166', stars: 2, description: 'Escalated encounter stack profile 0166 with controlled mutator layering.', mutators: ['enemyCount+41%', 'enemySpeed+22%', 'dropRate-15%'] },
  { id: 'mega-challenge-0167', title: 'Mega Challenge 0167', stars: 3, description: 'Escalated encounter stack profile 0167 with controlled mutator layering.', mutators: ['enemyCount+42%', 'enemySpeed+23%', 'dropRate-16%'] },
  { id: 'mega-challenge-0168', title: 'Mega Challenge 0168', stars: 4, description: 'Escalated encounter stack profile 0168 with controlled mutator layering.', mutators: ['enemyCount+43%', 'enemySpeed+24%', 'dropRate-17%'] },
  { id: 'mega-challenge-0169', title: 'Mega Challenge 0169', stars: 5, description: 'Escalated encounter stack profile 0169 with controlled mutator layering.', mutators: ['enemyCount+44%', 'enemySpeed+25%', 'dropRate-18%'] },
  { id: 'mega-challenge-0170', title: 'Mega Challenge 0170', stars: 1, description: 'Escalated encounter stack profile 0170 with controlled mutator layering.', mutators: ['enemyCount+45%', 'enemySpeed+26%', 'dropRate-19%'] },
  { id: 'mega-challenge-0171', title: 'Mega Challenge 0171', stars: 2, description: 'Escalated encounter stack profile 0171 with controlled mutator layering.', mutators: ['enemyCount+46%', 'enemySpeed+27%', 'dropRate-20%'] },
  { id: 'mega-challenge-0172', title: 'Mega Challenge 0172', stars: 3, description: 'Escalated encounter stack profile 0172 with controlled mutator layering.', mutators: ['enemyCount+47%', 'enemySpeed+28%', 'dropRate-21%'] },
  { id: 'mega-challenge-0173', title: 'Mega Challenge 0173', stars: 4, description: 'Escalated encounter stack profile 0173 with controlled mutator layering.', mutators: ['enemyCount+48%', 'enemySpeed+29%', 'dropRate-22%'] },
  { id: 'mega-challenge-0174', title: 'Mega Challenge 0174', stars: 5, description: 'Escalated encounter stack profile 0174 with controlled mutator layering.', mutators: ['enemyCount+49%', 'enemySpeed+30%', 'dropRate-23%'] },
  { id: 'mega-challenge-0175', title: 'Mega Challenge 0175', stars: 1, description: 'Escalated encounter stack profile 0175 with controlled mutator layering.', mutators: ['enemyCount+50%', 'enemySpeed+31%', 'dropRate-24%'] },
  { id: 'mega-challenge-0176', title: 'Mega Challenge 0176', stars: 2, description: 'Escalated encounter stack profile 0176 with controlled mutator layering.', mutators: ['enemyCount+51%', 'enemySpeed+32%', 'dropRate-3%'] },
  { id: 'mega-challenge-0177', title: 'Mega Challenge 0177', stars: 3, description: 'Escalated encounter stack profile 0177 with controlled mutator layering.', mutators: ['enemyCount+52%', 'enemySpeed+33%', 'dropRate-4%'] },
  { id: 'mega-challenge-0178', title: 'Mega Challenge 0178', stars: 4, description: 'Escalated encounter stack profile 0178 with controlled mutator layering.', mutators: ['enemyCount+53%', 'enemySpeed+34%', 'dropRate-5%'] },
  { id: 'mega-challenge-0179', title: 'Mega Challenge 0179', stars: 5, description: 'Escalated encounter stack profile 0179 with controlled mutator layering.', mutators: ['enemyCount+54%', 'enemySpeed+35%', 'dropRate-6%'] },
  { id: 'mega-challenge-0180', title: 'Mega Challenge 0180', stars: 1, description: 'Escalated encounter stack profile 0180 with controlled mutator layering.', mutators: ['enemyCount+10%', 'enemySpeed+6%', 'dropRate-7%'] },
  { id: 'mega-challenge-0181', title: 'Mega Challenge 0181', stars: 2, description: 'Escalated encounter stack profile 0181 with controlled mutator layering.', mutators: ['enemyCount+11%', 'enemySpeed+7%', 'dropRate-8%'] },
  { id: 'mega-challenge-0182', title: 'Mega Challenge 0182', stars: 3, description: 'Escalated encounter stack profile 0182 with controlled mutator layering.', mutators: ['enemyCount+12%', 'enemySpeed+8%', 'dropRate-9%'] },
  { id: 'mega-challenge-0183', title: 'Mega Challenge 0183', stars: 4, description: 'Escalated encounter stack profile 0183 with controlled mutator layering.', mutators: ['enemyCount+13%', 'enemySpeed+9%', 'dropRate-10%'] },
  { id: 'mega-challenge-0184', title: 'Mega Challenge 0184', stars: 5, description: 'Escalated encounter stack profile 0184 with controlled mutator layering.', mutators: ['enemyCount+14%', 'enemySpeed+10%', 'dropRate-11%'] },
  { id: 'mega-challenge-0185', title: 'Mega Challenge 0185', stars: 1, description: 'Escalated encounter stack profile 0185 with controlled mutator layering.', mutators: ['enemyCount+15%', 'enemySpeed+11%', 'dropRate-12%'] },
  { id: 'mega-challenge-0186', title: 'Mega Challenge 0186', stars: 2, description: 'Escalated encounter stack profile 0186 with controlled mutator layering.', mutators: ['enemyCount+16%', 'enemySpeed+12%', 'dropRate-13%'] },
  { id: 'mega-challenge-0187', title: 'Mega Challenge 0187', stars: 3, description: 'Escalated encounter stack profile 0187 with controlled mutator layering.', mutators: ['enemyCount+17%', 'enemySpeed+13%', 'dropRate-14%'] },
  { id: 'mega-challenge-0188', title: 'Mega Challenge 0188', stars: 4, description: 'Escalated encounter stack profile 0188 with controlled mutator layering.', mutators: ['enemyCount+18%', 'enemySpeed+14%', 'dropRate-15%'] },
  { id: 'mega-challenge-0189', title: 'Mega Challenge 0189', stars: 5, description: 'Escalated encounter stack profile 0189 with controlled mutator layering.', mutators: ['enemyCount+19%', 'enemySpeed+15%', 'dropRate-16%'] },
  { id: 'mega-challenge-0190', title: 'Mega Challenge 0190', stars: 1, description: 'Escalated encounter stack profile 0190 with controlled mutator layering.', mutators: ['enemyCount+20%', 'enemySpeed+16%', 'dropRate-17%'] },
  { id: 'mega-challenge-0191', title: 'Mega Challenge 0191', stars: 2, description: 'Escalated encounter stack profile 0191 with controlled mutator layering.', mutators: ['enemyCount+21%', 'enemySpeed+17%', 'dropRate-18%'] },
  { id: 'mega-challenge-0192', title: 'Mega Challenge 0192', stars: 3, description: 'Escalated encounter stack profile 0192 with controlled mutator layering.', mutators: ['enemyCount+22%', 'enemySpeed+18%', 'dropRate-19%'] },
  { id: 'mega-challenge-0193', title: 'Mega Challenge 0193', stars: 4, description: 'Escalated encounter stack profile 0193 with controlled mutator layering.', mutators: ['enemyCount+23%', 'enemySpeed+19%', 'dropRate-20%'] },
  { id: 'mega-challenge-0194', title: 'Mega Challenge 0194', stars: 5, description: 'Escalated encounter stack profile 0194 with controlled mutator layering.', mutators: ['enemyCount+24%', 'enemySpeed+20%', 'dropRate-21%'] },
  { id: 'mega-challenge-0195', title: 'Mega Challenge 0195', stars: 1, description: 'Escalated encounter stack profile 0195 with controlled mutator layering.', mutators: ['enemyCount+25%', 'enemySpeed+21%', 'dropRate-22%'] },
  { id: 'mega-challenge-0196', title: 'Mega Challenge 0196', stars: 2, description: 'Escalated encounter stack profile 0196 with controlled mutator layering.', mutators: ['enemyCount+26%', 'enemySpeed+22%', 'dropRate-23%'] },
  { id: 'mega-challenge-0197', title: 'Mega Challenge 0197', stars: 3, description: 'Escalated encounter stack profile 0197 with controlled mutator layering.', mutators: ['enemyCount+27%', 'enemySpeed+23%', 'dropRate-24%'] },
  { id: 'mega-challenge-0198', title: 'Mega Challenge 0198', stars: 4, description: 'Escalated encounter stack profile 0198 with controlled mutator layering.', mutators: ['enemyCount+28%', 'enemySpeed+24%', 'dropRate-3%'] },
  { id: 'mega-challenge-0199', title: 'Mega Challenge 0199', stars: 5, description: 'Escalated encounter stack profile 0199 with controlled mutator layering.', mutators: ['enemyCount+29%', 'enemySpeed+25%', 'dropRate-4%'] },
  { id: 'mega-challenge-0200', title: 'Mega Challenge 0200', stars: 1, description: 'Escalated encounter stack profile 0200 with controlled mutator layering.', mutators: ['enemyCount+30%', 'enemySpeed+26%', 'dropRate-5%'] },
  { id: 'mega-challenge-0201', title: 'Mega Challenge 0201', stars: 2, description: 'Escalated encounter stack profile 0201 with controlled mutator layering.', mutators: ['enemyCount+31%', 'enemySpeed+27%', 'dropRate-6%'] },
  { id: 'mega-challenge-0202', title: 'Mega Challenge 0202', stars: 3, description: 'Escalated encounter stack profile 0202 with controlled mutator layering.', mutators: ['enemyCount+32%', 'enemySpeed+28%', 'dropRate-7%'] },
  { id: 'mega-challenge-0203', title: 'Mega Challenge 0203', stars: 4, description: 'Escalated encounter stack profile 0203 with controlled mutator layering.', mutators: ['enemyCount+33%', 'enemySpeed+29%', 'dropRate-8%'] },
  { id: 'mega-challenge-0204', title: 'Mega Challenge 0204', stars: 5, description: 'Escalated encounter stack profile 0204 with controlled mutator layering.', mutators: ['enemyCount+34%', 'enemySpeed+30%', 'dropRate-9%'] },
  { id: 'mega-challenge-0205', title: 'Mega Challenge 0205', stars: 1, description: 'Escalated encounter stack profile 0205 with controlled mutator layering.', mutators: ['enemyCount+35%', 'enemySpeed+31%', 'dropRate-10%'] },
  { id: 'mega-challenge-0206', title: 'Mega Challenge 0206', stars: 2, description: 'Escalated encounter stack profile 0206 with controlled mutator layering.', mutators: ['enemyCount+36%', 'enemySpeed+32%', 'dropRate-11%'] },
  { id: 'mega-challenge-0207', title: 'Mega Challenge 0207', stars: 3, description: 'Escalated encounter stack profile 0207 with controlled mutator layering.', mutators: ['enemyCount+37%', 'enemySpeed+33%', 'dropRate-12%'] },
  { id: 'mega-challenge-0208', title: 'Mega Challenge 0208', stars: 4, description: 'Escalated encounter stack profile 0208 with controlled mutator layering.', mutators: ['enemyCount+38%', 'enemySpeed+34%', 'dropRate-13%'] },
  { id: 'mega-challenge-0209', title: 'Mega Challenge 0209', stars: 5, description: 'Escalated encounter stack profile 0209 with controlled mutator layering.', mutators: ['enemyCount+39%', 'enemySpeed+35%', 'dropRate-14%'] },
  { id: 'mega-challenge-0210', title: 'Mega Challenge 0210', stars: 1, description: 'Escalated encounter stack profile 0210 with controlled mutator layering.', mutators: ['enemyCount+40%', 'enemySpeed+6%', 'dropRate-15%'] },
  { id: 'mega-challenge-0211', title: 'Mega Challenge 0211', stars: 2, description: 'Escalated encounter stack profile 0211 with controlled mutator layering.', mutators: ['enemyCount+41%', 'enemySpeed+7%', 'dropRate-16%'] },
  { id: 'mega-challenge-0212', title: 'Mega Challenge 0212', stars: 3, description: 'Escalated encounter stack profile 0212 with controlled mutator layering.', mutators: ['enemyCount+42%', 'enemySpeed+8%', 'dropRate-17%'] },
  { id: 'mega-challenge-0213', title: 'Mega Challenge 0213', stars: 4, description: 'Escalated encounter stack profile 0213 with controlled mutator layering.', mutators: ['enemyCount+43%', 'enemySpeed+9%', 'dropRate-18%'] },
  { id: 'mega-challenge-0214', title: 'Mega Challenge 0214', stars: 5, description: 'Escalated encounter stack profile 0214 with controlled mutator layering.', mutators: ['enemyCount+44%', 'enemySpeed+10%', 'dropRate-19%'] },
  { id: 'mega-challenge-0215', title: 'Mega Challenge 0215', stars: 1, description: 'Escalated encounter stack profile 0215 with controlled mutator layering.', mutators: ['enemyCount+45%', 'enemySpeed+11%', 'dropRate-20%'] },
  { id: 'mega-challenge-0216', title: 'Mega Challenge 0216', stars: 2, description: 'Escalated encounter stack profile 0216 with controlled mutator layering.', mutators: ['enemyCount+46%', 'enemySpeed+12%', 'dropRate-21%'] },
  { id: 'mega-challenge-0217', title: 'Mega Challenge 0217', stars: 3, description: 'Escalated encounter stack profile 0217 with controlled mutator layering.', mutators: ['enemyCount+47%', 'enemySpeed+13%', 'dropRate-22%'] },
  { id: 'mega-challenge-0218', title: 'Mega Challenge 0218', stars: 4, description: 'Escalated encounter stack profile 0218 with controlled mutator layering.', mutators: ['enemyCount+48%', 'enemySpeed+14%', 'dropRate-23%'] },
  { id: 'mega-challenge-0219', title: 'Mega Challenge 0219', stars: 5, description: 'Escalated encounter stack profile 0219 with controlled mutator layering.', mutators: ['enemyCount+49%', 'enemySpeed+15%', 'dropRate-24%'] },
  { id: 'mega-challenge-0220', title: 'Mega Challenge 0220', stars: 1, description: 'Escalated encounter stack profile 0220 with controlled mutator layering.', mutators: ['enemyCount+50%', 'enemySpeed+16%', 'dropRate-3%'] },
  { id: 'mega-challenge-0221', title: 'Mega Challenge 0221', stars: 2, description: 'Escalated encounter stack profile 0221 with controlled mutator layering.', mutators: ['enemyCount+51%', 'enemySpeed+17%', 'dropRate-4%'] },
  { id: 'mega-challenge-0222', title: 'Mega Challenge 0222', stars: 3, description: 'Escalated encounter stack profile 0222 with controlled mutator layering.', mutators: ['enemyCount+52%', 'enemySpeed+18%', 'dropRate-5%'] },
  { id: 'mega-challenge-0223', title: 'Mega Challenge 0223', stars: 4, description: 'Escalated encounter stack profile 0223 with controlled mutator layering.', mutators: ['enemyCount+53%', 'enemySpeed+19%', 'dropRate-6%'] },
  { id: 'mega-challenge-0224', title: 'Mega Challenge 0224', stars: 5, description: 'Escalated encounter stack profile 0224 with controlled mutator layering.', mutators: ['enemyCount+54%', 'enemySpeed+20%', 'dropRate-7%'] },
  { id: 'mega-challenge-0225', title: 'Mega Challenge 0225', stars: 1, description: 'Escalated encounter stack profile 0225 with controlled mutator layering.', mutators: ['enemyCount+10%', 'enemySpeed+21%', 'dropRate-8%'] },
  { id: 'mega-challenge-0226', title: 'Mega Challenge 0226', stars: 2, description: 'Escalated encounter stack profile 0226 with controlled mutator layering.', mutators: ['enemyCount+11%', 'enemySpeed+22%', 'dropRate-9%'] },
  { id: 'mega-challenge-0227', title: 'Mega Challenge 0227', stars: 3, description: 'Escalated encounter stack profile 0227 with controlled mutator layering.', mutators: ['enemyCount+12%', 'enemySpeed+23%', 'dropRate-10%'] },
  { id: 'mega-challenge-0228', title: 'Mega Challenge 0228', stars: 4, description: 'Escalated encounter stack profile 0228 with controlled mutator layering.', mutators: ['enemyCount+13%', 'enemySpeed+24%', 'dropRate-11%'] },
  { id: 'mega-challenge-0229', title: 'Mega Challenge 0229', stars: 5, description: 'Escalated encounter stack profile 0229 with controlled mutator layering.', mutators: ['enemyCount+14%', 'enemySpeed+25%', 'dropRate-12%'] },
  { id: 'mega-challenge-0230', title: 'Mega Challenge 0230', stars: 1, description: 'Escalated encounter stack profile 0230 with controlled mutator layering.', mutators: ['enemyCount+15%', 'enemySpeed+26%', 'dropRate-13%'] },
  { id: 'mega-challenge-0231', title: 'Mega Challenge 0231', stars: 2, description: 'Escalated encounter stack profile 0231 with controlled mutator layering.', mutators: ['enemyCount+16%', 'enemySpeed+27%', 'dropRate-14%'] },
  { id: 'mega-challenge-0232', title: 'Mega Challenge 0232', stars: 3, description: 'Escalated encounter stack profile 0232 with controlled mutator layering.', mutators: ['enemyCount+17%', 'enemySpeed+28%', 'dropRate-15%'] },
  { id: 'mega-challenge-0233', title: 'Mega Challenge 0233', stars: 4, description: 'Escalated encounter stack profile 0233 with controlled mutator layering.', mutators: ['enemyCount+18%', 'enemySpeed+29%', 'dropRate-16%'] },
  { id: 'mega-challenge-0234', title: 'Mega Challenge 0234', stars: 5, description: 'Escalated encounter stack profile 0234 with controlled mutator layering.', mutators: ['enemyCount+19%', 'enemySpeed+30%', 'dropRate-17%'] },
  { id: 'mega-challenge-0235', title: 'Mega Challenge 0235', stars: 1, description: 'Escalated encounter stack profile 0235 with controlled mutator layering.', mutators: ['enemyCount+20%', 'enemySpeed+31%', 'dropRate-18%'] },
  { id: 'mega-challenge-0236', title: 'Mega Challenge 0236', stars: 2, description: 'Escalated encounter stack profile 0236 with controlled mutator layering.', mutators: ['enemyCount+21%', 'enemySpeed+32%', 'dropRate-19%'] },
  { id: 'mega-challenge-0237', title: 'Mega Challenge 0237', stars: 3, description: 'Escalated encounter stack profile 0237 with controlled mutator layering.', mutators: ['enemyCount+22%', 'enemySpeed+33%', 'dropRate-20%'] },
  { id: 'mega-challenge-0238', title: 'Mega Challenge 0238', stars: 4, description: 'Escalated encounter stack profile 0238 with controlled mutator layering.', mutators: ['enemyCount+23%', 'enemySpeed+34%', 'dropRate-21%'] },
  { id: 'mega-challenge-0239', title: 'Mega Challenge 0239', stars: 5, description: 'Escalated encounter stack profile 0239 with controlled mutator layering.', mutators: ['enemyCount+24%', 'enemySpeed+35%', 'dropRate-22%'] },
  { id: 'mega-challenge-0240', title: 'Mega Challenge 0240', stars: 1, description: 'Escalated encounter stack profile 0240 with controlled mutator layering.', mutators: ['enemyCount+25%', 'enemySpeed+6%', 'dropRate-23%'] },
  { id: 'mega-challenge-0241', title: 'Mega Challenge 0241', stars: 2, description: 'Escalated encounter stack profile 0241 with controlled mutator layering.', mutators: ['enemyCount+26%', 'enemySpeed+7%', 'dropRate-24%'] },
  { id: 'mega-challenge-0242', title: 'Mega Challenge 0242', stars: 3, description: 'Escalated encounter stack profile 0242 with controlled mutator layering.', mutators: ['enemyCount+27%', 'enemySpeed+8%', 'dropRate-3%'] },
  { id: 'mega-challenge-0243', title: 'Mega Challenge 0243', stars: 4, description: 'Escalated encounter stack profile 0243 with controlled mutator layering.', mutators: ['enemyCount+28%', 'enemySpeed+9%', 'dropRate-4%'] },
  { id: 'mega-challenge-0244', title: 'Mega Challenge 0244', stars: 5, description: 'Escalated encounter stack profile 0244 with controlled mutator layering.', mutators: ['enemyCount+29%', 'enemySpeed+10%', 'dropRate-5%'] },
  { id: 'mega-challenge-0245', title: 'Mega Challenge 0245', stars: 1, description: 'Escalated encounter stack profile 0245 with controlled mutator layering.', mutators: ['enemyCount+30%', 'enemySpeed+11%', 'dropRate-6%'] },
  { id: 'mega-challenge-0246', title: 'Mega Challenge 0246', stars: 2, description: 'Escalated encounter stack profile 0246 with controlled mutator layering.', mutators: ['enemyCount+31%', 'enemySpeed+12%', 'dropRate-7%'] },
  { id: 'mega-challenge-0247', title: 'Mega Challenge 0247', stars: 3, description: 'Escalated encounter stack profile 0247 with controlled mutator layering.', mutators: ['enemyCount+32%', 'enemySpeed+13%', 'dropRate-8%'] },
  { id: 'mega-challenge-0248', title: 'Mega Challenge 0248', stars: 4, description: 'Escalated encounter stack profile 0248 with controlled mutator layering.', mutators: ['enemyCount+33%', 'enemySpeed+14%', 'dropRate-9%'] },
  { id: 'mega-challenge-0249', title: 'Mega Challenge 0249', stars: 5, description: 'Escalated encounter stack profile 0249 with controlled mutator layering.', mutators: ['enemyCount+34%', 'enemySpeed+15%', 'dropRate-10%'] },
  { id: 'mega-challenge-0250', title: 'Mega Challenge 0250', stars: 1, description: 'Escalated encounter stack profile 0250 with controlled mutator layering.', mutators: ['enemyCount+35%', 'enemySpeed+16%', 'dropRate-11%'] },
  { id: 'mega-challenge-0251', title: 'Mega Challenge 0251', stars: 2, description: 'Escalated encounter stack profile 0251 with controlled mutator layering.', mutators: ['enemyCount+36%', 'enemySpeed+17%', 'dropRate-12%'] },
  { id: 'mega-challenge-0252', title: 'Mega Challenge 0252', stars: 3, description: 'Escalated encounter stack profile 0252 with controlled mutator layering.', mutators: ['enemyCount+37%', 'enemySpeed+18%', 'dropRate-13%'] },
  { id: 'mega-challenge-0253', title: 'Mega Challenge 0253', stars: 4, description: 'Escalated encounter stack profile 0253 with controlled mutator layering.', mutators: ['enemyCount+38%', 'enemySpeed+19%', 'dropRate-14%'] },
  { id: 'mega-challenge-0254', title: 'Mega Challenge 0254', stars: 5, description: 'Escalated encounter stack profile 0254 with controlled mutator layering.', mutators: ['enemyCount+39%', 'enemySpeed+20%', 'dropRate-15%'] },
  { id: 'mega-challenge-0255', title: 'Mega Challenge 0255', stars: 1, description: 'Escalated encounter stack profile 0255 with controlled mutator layering.', mutators: ['enemyCount+40%', 'enemySpeed+21%', 'dropRate-16%'] },
  { id: 'mega-challenge-0256', title: 'Mega Challenge 0256', stars: 2, description: 'Escalated encounter stack profile 0256 with controlled mutator layering.', mutators: ['enemyCount+41%', 'enemySpeed+22%', 'dropRate-17%'] },
  { id: 'mega-challenge-0257', title: 'Mega Challenge 0257', stars: 3, description: 'Escalated encounter stack profile 0257 with controlled mutator layering.', mutators: ['enemyCount+42%', 'enemySpeed+23%', 'dropRate-18%'] },
  { id: 'mega-challenge-0258', title: 'Mega Challenge 0258', stars: 4, description: 'Escalated encounter stack profile 0258 with controlled mutator layering.', mutators: ['enemyCount+43%', 'enemySpeed+24%', 'dropRate-19%'] },
  { id: 'mega-challenge-0259', title: 'Mega Challenge 0259', stars: 5, description: 'Escalated encounter stack profile 0259 with controlled mutator layering.', mutators: ['enemyCount+44%', 'enemySpeed+25%', 'dropRate-20%'] },
  { id: 'mega-challenge-0260', title: 'Mega Challenge 0260', stars: 1, description: 'Escalated encounter stack profile 0260 with controlled mutator layering.', mutators: ['enemyCount+45%', 'enemySpeed+26%', 'dropRate-21%'] },
  { id: 'mega-challenge-0261', title: 'Mega Challenge 0261', stars: 2, description: 'Escalated encounter stack profile 0261 with controlled mutator layering.', mutators: ['enemyCount+46%', 'enemySpeed+27%', 'dropRate-22%'] },
  { id: 'mega-challenge-0262', title: 'Mega Challenge 0262', stars: 3, description: 'Escalated encounter stack profile 0262 with controlled mutator layering.', mutators: ['enemyCount+47%', 'enemySpeed+28%', 'dropRate-23%'] },
  { id: 'mega-challenge-0263', title: 'Mega Challenge 0263', stars: 4, description: 'Escalated encounter stack profile 0263 with controlled mutator layering.', mutators: ['enemyCount+48%', 'enemySpeed+29%', 'dropRate-24%'] },
  { id: 'mega-challenge-0264', title: 'Mega Challenge 0264', stars: 5, description: 'Escalated encounter stack profile 0264 with controlled mutator layering.', mutators: ['enemyCount+49%', 'enemySpeed+30%', 'dropRate-3%'] },
  { id: 'mega-challenge-0265', title: 'Mega Challenge 0265', stars: 1, description: 'Escalated encounter stack profile 0265 with controlled mutator layering.', mutators: ['enemyCount+50%', 'enemySpeed+31%', 'dropRate-4%'] },
  { id: 'mega-challenge-0266', title: 'Mega Challenge 0266', stars: 2, description: 'Escalated encounter stack profile 0266 with controlled mutator layering.', mutators: ['enemyCount+51%', 'enemySpeed+32%', 'dropRate-5%'] },
  { id: 'mega-challenge-0267', title: 'Mega Challenge 0267', stars: 3, description: 'Escalated encounter stack profile 0267 with controlled mutator layering.', mutators: ['enemyCount+52%', 'enemySpeed+33%', 'dropRate-6%'] },
  { id: 'mega-challenge-0268', title: 'Mega Challenge 0268', stars: 4, description: 'Escalated encounter stack profile 0268 with controlled mutator layering.', mutators: ['enemyCount+53%', 'enemySpeed+34%', 'dropRate-7%'] },
  { id: 'mega-challenge-0269', title: 'Mega Challenge 0269', stars: 5, description: 'Escalated encounter stack profile 0269 with controlled mutator layering.', mutators: ['enemyCount+54%', 'enemySpeed+35%', 'dropRate-8%'] },
  { id: 'mega-challenge-0270', title: 'Mega Challenge 0270', stars: 1, description: 'Escalated encounter stack profile 0270 with controlled mutator layering.', mutators: ['enemyCount+10%', 'enemySpeed+6%', 'dropRate-9%'] },
  { id: 'mega-challenge-0271', title: 'Mega Challenge 0271', stars: 2, description: 'Escalated encounter stack profile 0271 with controlled mutator layering.', mutators: ['enemyCount+11%', 'enemySpeed+7%', 'dropRate-10%'] },
  { id: 'mega-challenge-0272', title: 'Mega Challenge 0272', stars: 3, description: 'Escalated encounter stack profile 0272 with controlled mutator layering.', mutators: ['enemyCount+12%', 'enemySpeed+8%', 'dropRate-11%'] },
  { id: 'mega-challenge-0273', title: 'Mega Challenge 0273', stars: 4, description: 'Escalated encounter stack profile 0273 with controlled mutator layering.', mutators: ['enemyCount+13%', 'enemySpeed+9%', 'dropRate-12%'] },
  { id: 'mega-challenge-0274', title: 'Mega Challenge 0274', stars: 5, description: 'Escalated encounter stack profile 0274 with controlled mutator layering.', mutators: ['enemyCount+14%', 'enemySpeed+10%', 'dropRate-13%'] },
  { id: 'mega-challenge-0275', title: 'Mega Challenge 0275', stars: 1, description: 'Escalated encounter stack profile 0275 with controlled mutator layering.', mutators: ['enemyCount+15%', 'enemySpeed+11%', 'dropRate-14%'] },
  { id: 'mega-challenge-0276', title: 'Mega Challenge 0276', stars: 2, description: 'Escalated encounter stack profile 0276 with controlled mutator layering.', mutators: ['enemyCount+16%', 'enemySpeed+12%', 'dropRate-15%'] },
  { id: 'mega-challenge-0277', title: 'Mega Challenge 0277', stars: 3, description: 'Escalated encounter stack profile 0277 with controlled mutator layering.', mutators: ['enemyCount+17%', 'enemySpeed+13%', 'dropRate-16%'] },
  { id: 'mega-challenge-0278', title: 'Mega Challenge 0278', stars: 4, description: 'Escalated encounter stack profile 0278 with controlled mutator layering.', mutators: ['enemyCount+18%', 'enemySpeed+14%', 'dropRate-17%'] },
  { id: 'mega-challenge-0279', title: 'Mega Challenge 0279', stars: 5, description: 'Escalated encounter stack profile 0279 with controlled mutator layering.', mutators: ['enemyCount+19%', 'enemySpeed+15%', 'dropRate-18%'] },
  { id: 'mega-challenge-0280', title: 'Mega Challenge 0280', stars: 1, description: 'Escalated encounter stack profile 0280 with controlled mutator layering.', mutators: ['enemyCount+20%', 'enemySpeed+16%', 'dropRate-19%'] },
  { id: 'mega-challenge-0281', title: 'Mega Challenge 0281', stars: 2, description: 'Escalated encounter stack profile 0281 with controlled mutator layering.', mutators: ['enemyCount+21%', 'enemySpeed+17%', 'dropRate-20%'] },
  { id: 'mega-challenge-0282', title: 'Mega Challenge 0282', stars: 3, description: 'Escalated encounter stack profile 0282 with controlled mutator layering.', mutators: ['enemyCount+22%', 'enemySpeed+18%', 'dropRate-21%'] },
  { id: 'mega-challenge-0283', title: 'Mega Challenge 0283', stars: 4, description: 'Escalated encounter stack profile 0283 with controlled mutator layering.', mutators: ['enemyCount+23%', 'enemySpeed+19%', 'dropRate-22%'] },
  { id: 'mega-challenge-0284', title: 'Mega Challenge 0284', stars: 5, description: 'Escalated encounter stack profile 0284 with controlled mutator layering.', mutators: ['enemyCount+24%', 'enemySpeed+20%', 'dropRate-23%'] },
  { id: 'mega-challenge-0285', title: 'Mega Challenge 0285', stars: 1, description: 'Escalated encounter stack profile 0285 with controlled mutator layering.', mutators: ['enemyCount+25%', 'enemySpeed+21%', 'dropRate-24%'] },
  { id: 'mega-challenge-0286', title: 'Mega Challenge 0286', stars: 2, description: 'Escalated encounter stack profile 0286 with controlled mutator layering.', mutators: ['enemyCount+26%', 'enemySpeed+22%', 'dropRate-3%'] },
  { id: 'mega-challenge-0287', title: 'Mega Challenge 0287', stars: 3, description: 'Escalated encounter stack profile 0287 with controlled mutator layering.', mutators: ['enemyCount+27%', 'enemySpeed+23%', 'dropRate-4%'] },
  { id: 'mega-challenge-0288', title: 'Mega Challenge 0288', stars: 4, description: 'Escalated encounter stack profile 0288 with controlled mutator layering.', mutators: ['enemyCount+28%', 'enemySpeed+24%', 'dropRate-5%'] },
  { id: 'mega-challenge-0289', title: 'Mega Challenge 0289', stars: 5, description: 'Escalated encounter stack profile 0289 with controlled mutator layering.', mutators: ['enemyCount+29%', 'enemySpeed+25%', 'dropRate-6%'] },
  { id: 'mega-challenge-0290', title: 'Mega Challenge 0290', stars: 1, description: 'Escalated encounter stack profile 0290 with controlled mutator layering.', mutators: ['enemyCount+30%', 'enemySpeed+26%', 'dropRate-7%'] },
  { id: 'mega-challenge-0291', title: 'Mega Challenge 0291', stars: 2, description: 'Escalated encounter stack profile 0291 with controlled mutator layering.', mutators: ['enemyCount+31%', 'enemySpeed+27%', 'dropRate-8%'] },
  { id: 'mega-challenge-0292', title: 'Mega Challenge 0292', stars: 3, description: 'Escalated encounter stack profile 0292 with controlled mutator layering.', mutators: ['enemyCount+32%', 'enemySpeed+28%', 'dropRate-9%'] },
  { id: 'mega-challenge-0293', title: 'Mega Challenge 0293', stars: 4, description: 'Escalated encounter stack profile 0293 with controlled mutator layering.', mutators: ['enemyCount+33%', 'enemySpeed+29%', 'dropRate-10%'] },
  { id: 'mega-challenge-0294', title: 'Mega Challenge 0294', stars: 5, description: 'Escalated encounter stack profile 0294 with controlled mutator layering.', mutators: ['enemyCount+34%', 'enemySpeed+30%', 'dropRate-11%'] },
  { id: 'mega-challenge-0295', title: 'Mega Challenge 0295', stars: 1, description: 'Escalated encounter stack profile 0295 with controlled mutator layering.', mutators: ['enemyCount+35%', 'enemySpeed+31%', 'dropRate-12%'] },
  { id: 'mega-challenge-0296', title: 'Mega Challenge 0296', stars: 2, description: 'Escalated encounter stack profile 0296 with controlled mutator layering.', mutators: ['enemyCount+36%', 'enemySpeed+32%', 'dropRate-13%'] },
  { id: 'mega-challenge-0297', title: 'Mega Challenge 0297', stars: 3, description: 'Escalated encounter stack profile 0297 with controlled mutator layering.', mutators: ['enemyCount+37%', 'enemySpeed+33%', 'dropRate-14%'] },
  { id: 'mega-challenge-0298', title: 'Mega Challenge 0298', stars: 4, description: 'Escalated encounter stack profile 0298 with controlled mutator layering.', mutators: ['enemyCount+38%', 'enemySpeed+34%', 'dropRate-15%'] },
  { id: 'mega-challenge-0299', title: 'Mega Challenge 0299', stars: 5, description: 'Escalated encounter stack profile 0299 with controlled mutator layering.', mutators: ['enemyCount+39%', 'enemySpeed+35%', 'dropRate-16%'] },
  { id: 'mega-challenge-0300', title: 'Mega Challenge 0300', stars: 1, description: 'Escalated encounter stack profile 0300 with controlled mutator layering.', mutators: ['enemyCount+40%', 'enemySpeed+6%', 'dropRate-17%'] },
  { id: 'mega-challenge-0301', title: 'Mega Challenge 0301', stars: 2, description: 'Escalated encounter stack profile 0301 with controlled mutator layering.', mutators: ['enemyCount+41%', 'enemySpeed+7%', 'dropRate-18%'] },
  { id: 'mega-challenge-0302', title: 'Mega Challenge 0302', stars: 3, description: 'Escalated encounter stack profile 0302 with controlled mutator layering.', mutators: ['enemyCount+42%', 'enemySpeed+8%', 'dropRate-19%'] },
  { id: 'mega-challenge-0303', title: 'Mega Challenge 0303', stars: 4, description: 'Escalated encounter stack profile 0303 with controlled mutator layering.', mutators: ['enemyCount+43%', 'enemySpeed+9%', 'dropRate-20%'] },
  { id: 'mega-challenge-0304', title: 'Mega Challenge 0304', stars: 5, description: 'Escalated encounter stack profile 0304 with controlled mutator layering.', mutators: ['enemyCount+44%', 'enemySpeed+10%', 'dropRate-21%'] },
  { id: 'mega-challenge-0305', title: 'Mega Challenge 0305', stars: 1, description: 'Escalated encounter stack profile 0305 with controlled mutator layering.', mutators: ['enemyCount+45%', 'enemySpeed+11%', 'dropRate-22%'] },
  { id: 'mega-challenge-0306', title: 'Mega Challenge 0306', stars: 2, description: 'Escalated encounter stack profile 0306 with controlled mutator layering.', mutators: ['enemyCount+46%', 'enemySpeed+12%', 'dropRate-23%'] },
  { id: 'mega-challenge-0307', title: 'Mega Challenge 0307', stars: 3, description: 'Escalated encounter stack profile 0307 with controlled mutator layering.', mutators: ['enemyCount+47%', 'enemySpeed+13%', 'dropRate-24%'] },
  { id: 'mega-challenge-0308', title: 'Mega Challenge 0308', stars: 4, description: 'Escalated encounter stack profile 0308 with controlled mutator layering.', mutators: ['enemyCount+48%', 'enemySpeed+14%', 'dropRate-3%'] },
  { id: 'mega-challenge-0309', title: 'Mega Challenge 0309', stars: 5, description: 'Escalated encounter stack profile 0309 with controlled mutator layering.', mutators: ['enemyCount+49%', 'enemySpeed+15%', 'dropRate-4%'] },
  { id: 'mega-challenge-0310', title: 'Mega Challenge 0310', stars: 1, description: 'Escalated encounter stack profile 0310 with controlled mutator layering.', mutators: ['enemyCount+50%', 'enemySpeed+16%', 'dropRate-5%'] },
  { id: 'mega-challenge-0311', title: 'Mega Challenge 0311', stars: 2, description: 'Escalated encounter stack profile 0311 with controlled mutator layering.', mutators: ['enemyCount+51%', 'enemySpeed+17%', 'dropRate-6%'] },
  { id: 'mega-challenge-0312', title: 'Mega Challenge 0312', stars: 3, description: 'Escalated encounter stack profile 0312 with controlled mutator layering.', mutators: ['enemyCount+52%', 'enemySpeed+18%', 'dropRate-7%'] },
  { id: 'mega-challenge-0313', title: 'Mega Challenge 0313', stars: 4, description: 'Escalated encounter stack profile 0313 with controlled mutator layering.', mutators: ['enemyCount+53%', 'enemySpeed+19%', 'dropRate-8%'] },
  { id: 'mega-challenge-0314', title: 'Mega Challenge 0314', stars: 5, description: 'Escalated encounter stack profile 0314 with controlled mutator layering.', mutators: ['enemyCount+54%', 'enemySpeed+20%', 'dropRate-9%'] },
  { id: 'mega-challenge-0315', title: 'Mega Challenge 0315', stars: 1, description: 'Escalated encounter stack profile 0315 with controlled mutator layering.', mutators: ['enemyCount+10%', 'enemySpeed+21%', 'dropRate-10%'] },
  { id: 'mega-challenge-0316', title: 'Mega Challenge 0316', stars: 2, description: 'Escalated encounter stack profile 0316 with controlled mutator layering.', mutators: ['enemyCount+11%', 'enemySpeed+22%', 'dropRate-11%'] },
  { id: 'mega-challenge-0317', title: 'Mega Challenge 0317', stars: 3, description: 'Escalated encounter stack profile 0317 with controlled mutator layering.', mutators: ['enemyCount+12%', 'enemySpeed+23%', 'dropRate-12%'] },
  { id: 'mega-challenge-0318', title: 'Mega Challenge 0318', stars: 4, description: 'Escalated encounter stack profile 0318 with controlled mutator layering.', mutators: ['enemyCount+13%', 'enemySpeed+24%', 'dropRate-13%'] },
  { id: 'mega-challenge-0319', title: 'Mega Challenge 0319', stars: 5, description: 'Escalated encounter stack profile 0319 with controlled mutator layering.', mutators: ['enemyCount+14%', 'enemySpeed+25%', 'dropRate-14%'] },
  { id: 'mega-challenge-0320', title: 'Mega Challenge 0320', stars: 1, description: 'Escalated encounter stack profile 0320 with controlled mutator layering.', mutators: ['enemyCount+15%', 'enemySpeed+26%', 'dropRate-15%'] },
  { id: 'mega-challenge-0321', title: 'Mega Challenge 0321', stars: 2, description: 'Escalated encounter stack profile 0321 with controlled mutator layering.', mutators: ['enemyCount+16%', 'enemySpeed+27%', 'dropRate-16%'] },
  { id: 'mega-challenge-0322', title: 'Mega Challenge 0322', stars: 3, description: 'Escalated encounter stack profile 0322 with controlled mutator layering.', mutators: ['enemyCount+17%', 'enemySpeed+28%', 'dropRate-17%'] },
  { id: 'mega-challenge-0323', title: 'Mega Challenge 0323', stars: 4, description: 'Escalated encounter stack profile 0323 with controlled mutator layering.', mutators: ['enemyCount+18%', 'enemySpeed+29%', 'dropRate-18%'] },
  { id: 'mega-challenge-0324', title: 'Mega Challenge 0324', stars: 5, description: 'Escalated encounter stack profile 0324 with controlled mutator layering.', mutators: ['enemyCount+19%', 'enemySpeed+30%', 'dropRate-19%'] },
  { id: 'mega-challenge-0325', title: 'Mega Challenge 0325', stars: 1, description: 'Escalated encounter stack profile 0325 with controlled mutator layering.', mutators: ['enemyCount+20%', 'enemySpeed+31%', 'dropRate-20%'] },
  { id: 'mega-challenge-0326', title: 'Mega Challenge 0326', stars: 2, description: 'Escalated encounter stack profile 0326 with controlled mutator layering.', mutators: ['enemyCount+21%', 'enemySpeed+32%', 'dropRate-21%'] },
  { id: 'mega-challenge-0327', title: 'Mega Challenge 0327', stars: 3, description: 'Escalated encounter stack profile 0327 with controlled mutator layering.', mutators: ['enemyCount+22%', 'enemySpeed+33%', 'dropRate-22%'] },
  { id: 'mega-challenge-0328', title: 'Mega Challenge 0328', stars: 4, description: 'Escalated encounter stack profile 0328 with controlled mutator layering.', mutators: ['enemyCount+23%', 'enemySpeed+34%', 'dropRate-23%'] },
  { id: 'mega-challenge-0329', title: 'Mega Challenge 0329', stars: 5, description: 'Escalated encounter stack profile 0329 with controlled mutator layering.', mutators: ['enemyCount+24%', 'enemySpeed+35%', 'dropRate-24%'] },
  { id: 'mega-challenge-0330', title: 'Mega Challenge 0330', stars: 1, description: 'Escalated encounter stack profile 0330 with controlled mutator layering.', mutators: ['enemyCount+25%', 'enemySpeed+6%', 'dropRate-3%'] },
  { id: 'mega-challenge-0331', title: 'Mega Challenge 0331', stars: 2, description: 'Escalated encounter stack profile 0331 with controlled mutator layering.', mutators: ['enemyCount+26%', 'enemySpeed+7%', 'dropRate-4%'] },
  { id: 'mega-challenge-0332', title: 'Mega Challenge 0332', stars: 3, description: 'Escalated encounter stack profile 0332 with controlled mutator layering.', mutators: ['enemyCount+27%', 'enemySpeed+8%', 'dropRate-5%'] },
  { id: 'mega-challenge-0333', title: 'Mega Challenge 0333', stars: 4, description: 'Escalated encounter stack profile 0333 with controlled mutator layering.', mutators: ['enemyCount+28%', 'enemySpeed+9%', 'dropRate-6%'] },
  { id: 'mega-challenge-0334', title: 'Mega Challenge 0334', stars: 5, description: 'Escalated encounter stack profile 0334 with controlled mutator layering.', mutators: ['enemyCount+29%', 'enemySpeed+10%', 'dropRate-7%'] },
  { id: 'mega-challenge-0335', title: 'Mega Challenge 0335', stars: 1, description: 'Escalated encounter stack profile 0335 with controlled mutator layering.', mutators: ['enemyCount+30%', 'enemySpeed+11%', 'dropRate-8%'] },
  { id: 'mega-challenge-0336', title: 'Mega Challenge 0336', stars: 2, description: 'Escalated encounter stack profile 0336 with controlled mutator layering.', mutators: ['enemyCount+31%', 'enemySpeed+12%', 'dropRate-9%'] },
  { id: 'mega-challenge-0337', title: 'Mega Challenge 0337', stars: 3, description: 'Escalated encounter stack profile 0337 with controlled mutator layering.', mutators: ['enemyCount+32%', 'enemySpeed+13%', 'dropRate-10%'] },
  { id: 'mega-challenge-0338', title: 'Mega Challenge 0338', stars: 4, description: 'Escalated encounter stack profile 0338 with controlled mutator layering.', mutators: ['enemyCount+33%', 'enemySpeed+14%', 'dropRate-11%'] },
  { id: 'mega-challenge-0339', title: 'Mega Challenge 0339', stars: 5, description: 'Escalated encounter stack profile 0339 with controlled mutator layering.', mutators: ['enemyCount+34%', 'enemySpeed+15%', 'dropRate-12%'] },
  { id: 'mega-challenge-0340', title: 'Mega Challenge 0340', stars: 1, description: 'Escalated encounter stack profile 0340 with controlled mutator layering.', mutators: ['enemyCount+35%', 'enemySpeed+16%', 'dropRate-13%'] },
  { id: 'mega-challenge-0341', title: 'Mega Challenge 0341', stars: 2, description: 'Escalated encounter stack profile 0341 with controlled mutator layering.', mutators: ['enemyCount+36%', 'enemySpeed+17%', 'dropRate-14%'] },
  { id: 'mega-challenge-0342', title: 'Mega Challenge 0342', stars: 3, description: 'Escalated encounter stack profile 0342 with controlled mutator layering.', mutators: ['enemyCount+37%', 'enemySpeed+18%', 'dropRate-15%'] },
  { id: 'mega-challenge-0343', title: 'Mega Challenge 0343', stars: 4, description: 'Escalated encounter stack profile 0343 with controlled mutator layering.', mutators: ['enemyCount+38%', 'enemySpeed+19%', 'dropRate-16%'] },
  { id: 'mega-challenge-0344', title: 'Mega Challenge 0344', stars: 5, description: 'Escalated encounter stack profile 0344 with controlled mutator layering.', mutators: ['enemyCount+39%', 'enemySpeed+20%', 'dropRate-17%'] },
  { id: 'mega-challenge-0345', title: 'Mega Challenge 0345', stars: 1, description: 'Escalated encounter stack profile 0345 with controlled mutator layering.', mutators: ['enemyCount+40%', 'enemySpeed+21%', 'dropRate-18%'] },
  { id: 'mega-challenge-0346', title: 'Mega Challenge 0346', stars: 2, description: 'Escalated encounter stack profile 0346 with controlled mutator layering.', mutators: ['enemyCount+41%', 'enemySpeed+22%', 'dropRate-19%'] },
  { id: 'mega-challenge-0347', title: 'Mega Challenge 0347', stars: 3, description: 'Escalated encounter stack profile 0347 with controlled mutator layering.', mutators: ['enemyCount+42%', 'enemySpeed+23%', 'dropRate-20%'] },
  { id: 'mega-challenge-0348', title: 'Mega Challenge 0348', stars: 4, description: 'Escalated encounter stack profile 0348 with controlled mutator layering.', mutators: ['enemyCount+43%', 'enemySpeed+24%', 'dropRate-21%'] },
  { id: 'mega-challenge-0349', title: 'Mega Challenge 0349', stars: 5, description: 'Escalated encounter stack profile 0349 with controlled mutator layering.', mutators: ['enemyCount+44%', 'enemySpeed+25%', 'dropRate-22%'] },
  { id: 'mega-challenge-0350', title: 'Mega Challenge 0350', stars: 1, description: 'Escalated encounter stack profile 0350 with controlled mutator layering.', mutators: ['enemyCount+45%', 'enemySpeed+26%', 'dropRate-23%'] },
  { id: 'mega-challenge-0351', title: 'Mega Challenge 0351', stars: 2, description: 'Escalated encounter stack profile 0351 with controlled mutator layering.', mutators: ['enemyCount+46%', 'enemySpeed+27%', 'dropRate-24%'] },
  { id: 'mega-challenge-0352', title: 'Mega Challenge 0352', stars: 3, description: 'Escalated encounter stack profile 0352 with controlled mutator layering.', mutators: ['enemyCount+47%', 'enemySpeed+28%', 'dropRate-3%'] },
  { id: 'mega-challenge-0353', title: 'Mega Challenge 0353', stars: 4, description: 'Escalated encounter stack profile 0353 with controlled mutator layering.', mutators: ['enemyCount+48%', 'enemySpeed+29%', 'dropRate-4%'] },
  { id: 'mega-challenge-0354', title: 'Mega Challenge 0354', stars: 5, description: 'Escalated encounter stack profile 0354 with controlled mutator layering.', mutators: ['enemyCount+49%', 'enemySpeed+30%', 'dropRate-5%'] },
  { id: 'mega-challenge-0355', title: 'Mega Challenge 0355', stars: 1, description: 'Escalated encounter stack profile 0355 with controlled mutator layering.', mutators: ['enemyCount+50%', 'enemySpeed+31%', 'dropRate-6%'] },
  { id: 'mega-challenge-0356', title: 'Mega Challenge 0356', stars: 2, description: 'Escalated encounter stack profile 0356 with controlled mutator layering.', mutators: ['enemyCount+51%', 'enemySpeed+32%', 'dropRate-7%'] },
  { id: 'mega-challenge-0357', title: 'Mega Challenge 0357', stars: 3, description: 'Escalated encounter stack profile 0357 with controlled mutator layering.', mutators: ['enemyCount+52%', 'enemySpeed+33%', 'dropRate-8%'] },
  { id: 'mega-challenge-0358', title: 'Mega Challenge 0358', stars: 4, description: 'Escalated encounter stack profile 0358 with controlled mutator layering.', mutators: ['enemyCount+53%', 'enemySpeed+34%', 'dropRate-9%'] },
  { id: 'mega-challenge-0359', title: 'Mega Challenge 0359', stars: 5, description: 'Escalated encounter stack profile 0359 with controlled mutator layering.', mutators: ['enemyCount+54%', 'enemySpeed+35%', 'dropRate-10%'] },
  { id: 'mega-challenge-0360', title: 'Mega Challenge 0360', stars: 1, description: 'Escalated encounter stack profile 0360 with controlled mutator layering.', mutators: ['enemyCount+10%', 'enemySpeed+6%', 'dropRate-11%'] },
  { id: 'mega-challenge-0361', title: 'Mega Challenge 0361', stars: 2, description: 'Escalated encounter stack profile 0361 with controlled mutator layering.', mutators: ['enemyCount+11%', 'enemySpeed+7%', 'dropRate-12%'] },
  { id: 'mega-challenge-0362', title: 'Mega Challenge 0362', stars: 3, description: 'Escalated encounter stack profile 0362 with controlled mutator layering.', mutators: ['enemyCount+12%', 'enemySpeed+8%', 'dropRate-13%'] },
  { id: 'mega-challenge-0363', title: 'Mega Challenge 0363', stars: 4, description: 'Escalated encounter stack profile 0363 with controlled mutator layering.', mutators: ['enemyCount+13%', 'enemySpeed+9%', 'dropRate-14%'] },
  { id: 'mega-challenge-0364', title: 'Mega Challenge 0364', stars: 5, description: 'Escalated encounter stack profile 0364 with controlled mutator layering.', mutators: ['enemyCount+14%', 'enemySpeed+10%', 'dropRate-15%'] },
  { id: 'mega-challenge-0365', title: 'Mega Challenge 0365', stars: 1, description: 'Escalated encounter stack profile 0365 with controlled mutator layering.', mutators: ['enemyCount+15%', 'enemySpeed+11%', 'dropRate-16%'] },
  { id: 'mega-challenge-0366', title: 'Mega Challenge 0366', stars: 2, description: 'Escalated encounter stack profile 0366 with controlled mutator layering.', mutators: ['enemyCount+16%', 'enemySpeed+12%', 'dropRate-17%'] },
  { id: 'mega-challenge-0367', title: 'Mega Challenge 0367', stars: 3, description: 'Escalated encounter stack profile 0367 with controlled mutator layering.', mutators: ['enemyCount+17%', 'enemySpeed+13%', 'dropRate-18%'] },
  { id: 'mega-challenge-0368', title: 'Mega Challenge 0368', stars: 4, description: 'Escalated encounter stack profile 0368 with controlled mutator layering.', mutators: ['enemyCount+18%', 'enemySpeed+14%', 'dropRate-19%'] },
  { id: 'mega-challenge-0369', title: 'Mega Challenge 0369', stars: 5, description: 'Escalated encounter stack profile 0369 with controlled mutator layering.', mutators: ['enemyCount+19%', 'enemySpeed+15%', 'dropRate-20%'] },
  { id: 'mega-challenge-0370', title: 'Mega Challenge 0370', stars: 1, description: 'Escalated encounter stack profile 0370 with controlled mutator layering.', mutators: ['enemyCount+20%', 'enemySpeed+16%', 'dropRate-21%'] },
  { id: 'mega-challenge-0371', title: 'Mega Challenge 0371', stars: 2, description: 'Escalated encounter stack profile 0371 with controlled mutator layering.', mutators: ['enemyCount+21%', 'enemySpeed+17%', 'dropRate-22%'] },
  { id: 'mega-challenge-0372', title: 'Mega Challenge 0372', stars: 3, description: 'Escalated encounter stack profile 0372 with controlled mutator layering.', mutators: ['enemyCount+22%', 'enemySpeed+18%', 'dropRate-23%'] },
  { id: 'mega-challenge-0373', title: 'Mega Challenge 0373', stars: 4, description: 'Escalated encounter stack profile 0373 with controlled mutator layering.', mutators: ['enemyCount+23%', 'enemySpeed+19%', 'dropRate-24%'] },
  { id: 'mega-challenge-0374', title: 'Mega Challenge 0374', stars: 5, description: 'Escalated encounter stack profile 0374 with controlled mutator layering.', mutators: ['enemyCount+24%', 'enemySpeed+20%', 'dropRate-3%'] },
  { id: 'mega-challenge-0375', title: 'Mega Challenge 0375', stars: 1, description: 'Escalated encounter stack profile 0375 with controlled mutator layering.', mutators: ['enemyCount+25%', 'enemySpeed+21%', 'dropRate-4%'] },
  { id: 'mega-challenge-0376', title: 'Mega Challenge 0376', stars: 2, description: 'Escalated encounter stack profile 0376 with controlled mutator layering.', mutators: ['enemyCount+26%', 'enemySpeed+22%', 'dropRate-5%'] },
  { id: 'mega-challenge-0377', title: 'Mega Challenge 0377', stars: 3, description: 'Escalated encounter stack profile 0377 with controlled mutator layering.', mutators: ['enemyCount+27%', 'enemySpeed+23%', 'dropRate-6%'] },
  { id: 'mega-challenge-0378', title: 'Mega Challenge 0378', stars: 4, description: 'Escalated encounter stack profile 0378 with controlled mutator layering.', mutators: ['enemyCount+28%', 'enemySpeed+24%', 'dropRate-7%'] },
  { id: 'mega-challenge-0379', title: 'Mega Challenge 0379', stars: 5, description: 'Escalated encounter stack profile 0379 with controlled mutator layering.', mutators: ['enemyCount+29%', 'enemySpeed+25%', 'dropRate-8%'] },
  { id: 'mega-challenge-0380', title: 'Mega Challenge 0380', stars: 1, description: 'Escalated encounter stack profile 0380 with controlled mutator layering.', mutators: ['enemyCount+30%', 'enemySpeed+26%', 'dropRate-9%'] },
  { id: 'mega-challenge-0381', title: 'Mega Challenge 0381', stars: 2, description: 'Escalated encounter stack profile 0381 with controlled mutator layering.', mutators: ['enemyCount+31%', 'enemySpeed+27%', 'dropRate-10%'] },
  { id: 'mega-challenge-0382', title: 'Mega Challenge 0382', stars: 3, description: 'Escalated encounter stack profile 0382 with controlled mutator layering.', mutators: ['enemyCount+32%', 'enemySpeed+28%', 'dropRate-11%'] },
  { id: 'mega-challenge-0383', title: 'Mega Challenge 0383', stars: 4, description: 'Escalated encounter stack profile 0383 with controlled mutator layering.', mutators: ['enemyCount+33%', 'enemySpeed+29%', 'dropRate-12%'] },
  { id: 'mega-challenge-0384', title: 'Mega Challenge 0384', stars: 5, description: 'Escalated encounter stack profile 0384 with controlled mutator layering.', mutators: ['enemyCount+34%', 'enemySpeed+30%', 'dropRate-13%'] },
  { id: 'mega-challenge-0385', title: 'Mega Challenge 0385', stars: 1, description: 'Escalated encounter stack profile 0385 with controlled mutator layering.', mutators: ['enemyCount+35%', 'enemySpeed+31%', 'dropRate-14%'] },
  { id: 'mega-challenge-0386', title: 'Mega Challenge 0386', stars: 2, description: 'Escalated encounter stack profile 0386 with controlled mutator layering.', mutators: ['enemyCount+36%', 'enemySpeed+32%', 'dropRate-15%'] },
  { id: 'mega-challenge-0387', title: 'Mega Challenge 0387', stars: 3, description: 'Escalated encounter stack profile 0387 with controlled mutator layering.', mutators: ['enemyCount+37%', 'enemySpeed+33%', 'dropRate-16%'] },
  { id: 'mega-challenge-0388', title: 'Mega Challenge 0388', stars: 4, description: 'Escalated encounter stack profile 0388 with controlled mutator layering.', mutators: ['enemyCount+38%', 'enemySpeed+34%', 'dropRate-17%'] },
  { id: 'mega-challenge-0389', title: 'Mega Challenge 0389', stars: 5, description: 'Escalated encounter stack profile 0389 with controlled mutator layering.', mutators: ['enemyCount+39%', 'enemySpeed+35%', 'dropRate-18%'] },
  { id: 'mega-challenge-0390', title: 'Mega Challenge 0390', stars: 1, description: 'Escalated encounter stack profile 0390 with controlled mutator layering.', mutators: ['enemyCount+40%', 'enemySpeed+6%', 'dropRate-19%'] },
  { id: 'mega-challenge-0391', title: 'Mega Challenge 0391', stars: 2, description: 'Escalated encounter stack profile 0391 with controlled mutator layering.', mutators: ['enemyCount+41%', 'enemySpeed+7%', 'dropRate-20%'] },
  { id: 'mega-challenge-0392', title: 'Mega Challenge 0392', stars: 3, description: 'Escalated encounter stack profile 0392 with controlled mutator layering.', mutators: ['enemyCount+42%', 'enemySpeed+8%', 'dropRate-21%'] },
  { id: 'mega-challenge-0393', title: 'Mega Challenge 0393', stars: 4, description: 'Escalated encounter stack profile 0393 with controlled mutator layering.', mutators: ['enemyCount+43%', 'enemySpeed+9%', 'dropRate-22%'] },
  { id: 'mega-challenge-0394', title: 'Mega Challenge 0394', stars: 5, description: 'Escalated encounter stack profile 0394 with controlled mutator layering.', mutators: ['enemyCount+44%', 'enemySpeed+10%', 'dropRate-23%'] },
  { id: 'mega-challenge-0395', title: 'Mega Challenge 0395', stars: 1, description: 'Escalated encounter stack profile 0395 with controlled mutator layering.', mutators: ['enemyCount+45%', 'enemySpeed+11%', 'dropRate-24%'] },
  { id: 'mega-challenge-0396', title: 'Mega Challenge 0396', stars: 2, description: 'Escalated encounter stack profile 0396 with controlled mutator layering.', mutators: ['enemyCount+46%', 'enemySpeed+12%', 'dropRate-3%'] },
  { id: 'mega-challenge-0397', title: 'Mega Challenge 0397', stars: 3, description: 'Escalated encounter stack profile 0397 with controlled mutator layering.', mutators: ['enemyCount+47%', 'enemySpeed+13%', 'dropRate-4%'] },
  { id: 'mega-challenge-0398', title: 'Mega Challenge 0398', stars: 4, description: 'Escalated encounter stack profile 0398 with controlled mutator layering.', mutators: ['enemyCount+48%', 'enemySpeed+14%', 'dropRate-5%'] },
  { id: 'mega-challenge-0399', title: 'Mega Challenge 0399', stars: 5, description: 'Escalated encounter stack profile 0399 with controlled mutator layering.', mutators: ['enemyCount+49%', 'enemySpeed+15%', 'dropRate-6%'] },
  { id: 'mega-challenge-0400', title: 'Mega Challenge 0400', stars: 1, description: 'Escalated encounter stack profile 0400 with controlled mutator layering.', mutators: ['enemyCount+50%', 'enemySpeed+16%', 'dropRate-7%'] },
  { id: 'mega-challenge-0401', title: 'Mega Challenge 0401', stars: 2, description: 'Escalated encounter stack profile 0401 with controlled mutator layering.', mutators: ['enemyCount+51%', 'enemySpeed+17%', 'dropRate-8%'] },
  { id: 'mega-challenge-0402', title: 'Mega Challenge 0402', stars: 3, description: 'Escalated encounter stack profile 0402 with controlled mutator layering.', mutators: ['enemyCount+52%', 'enemySpeed+18%', 'dropRate-9%'] },
  { id: 'mega-challenge-0403', title: 'Mega Challenge 0403', stars: 4, description: 'Escalated encounter stack profile 0403 with controlled mutator layering.', mutators: ['enemyCount+53%', 'enemySpeed+19%', 'dropRate-10%'] },
  { id: 'mega-challenge-0404', title: 'Mega Challenge 0404', stars: 5, description: 'Escalated encounter stack profile 0404 with controlled mutator layering.', mutators: ['enemyCount+54%', 'enemySpeed+20%', 'dropRate-11%'] },
  { id: 'mega-challenge-0405', title: 'Mega Challenge 0405', stars: 1, description: 'Escalated encounter stack profile 0405 with controlled mutator layering.', mutators: ['enemyCount+10%', 'enemySpeed+21%', 'dropRate-12%'] },
  { id: 'mega-challenge-0406', title: 'Mega Challenge 0406', stars: 2, description: 'Escalated encounter stack profile 0406 with controlled mutator layering.', mutators: ['enemyCount+11%', 'enemySpeed+22%', 'dropRate-13%'] },
  { id: 'mega-challenge-0407', title: 'Mega Challenge 0407', stars: 3, description: 'Escalated encounter stack profile 0407 with controlled mutator layering.', mutators: ['enemyCount+12%', 'enemySpeed+23%', 'dropRate-14%'] },
  { id: 'mega-challenge-0408', title: 'Mega Challenge 0408', stars: 4, description: 'Escalated encounter stack profile 0408 with controlled mutator layering.', mutators: ['enemyCount+13%', 'enemySpeed+24%', 'dropRate-15%'] },
  { id: 'mega-challenge-0409', title: 'Mega Challenge 0409', stars: 5, description: 'Escalated encounter stack profile 0409 with controlled mutator layering.', mutators: ['enemyCount+14%', 'enemySpeed+25%', 'dropRate-16%'] },
  { id: 'mega-challenge-0410', title: 'Mega Challenge 0410', stars: 1, description: 'Escalated encounter stack profile 0410 with controlled mutator layering.', mutators: ['enemyCount+15%', 'enemySpeed+26%', 'dropRate-17%'] },
  { id: 'mega-challenge-0411', title: 'Mega Challenge 0411', stars: 2, description: 'Escalated encounter stack profile 0411 with controlled mutator layering.', mutators: ['enemyCount+16%', 'enemySpeed+27%', 'dropRate-18%'] },
  { id: 'mega-challenge-0412', title: 'Mega Challenge 0412', stars: 3, description: 'Escalated encounter stack profile 0412 with controlled mutator layering.', mutators: ['enemyCount+17%', 'enemySpeed+28%', 'dropRate-19%'] },
  { id: 'mega-challenge-0413', title: 'Mega Challenge 0413', stars: 4, description: 'Escalated encounter stack profile 0413 with controlled mutator layering.', mutators: ['enemyCount+18%', 'enemySpeed+29%', 'dropRate-20%'] },
  { id: 'mega-challenge-0414', title: 'Mega Challenge 0414', stars: 5, description: 'Escalated encounter stack profile 0414 with controlled mutator layering.', mutators: ['enemyCount+19%', 'enemySpeed+30%', 'dropRate-21%'] },
  { id: 'mega-challenge-0415', title: 'Mega Challenge 0415', stars: 1, description: 'Escalated encounter stack profile 0415 with controlled mutator layering.', mutators: ['enemyCount+20%', 'enemySpeed+31%', 'dropRate-22%'] },
  { id: 'mega-challenge-0416', title: 'Mega Challenge 0416', stars: 2, description: 'Escalated encounter stack profile 0416 with controlled mutator layering.', mutators: ['enemyCount+21%', 'enemySpeed+32%', 'dropRate-23%'] },
  { id: 'mega-challenge-0417', title: 'Mega Challenge 0417', stars: 3, description: 'Escalated encounter stack profile 0417 with controlled mutator layering.', mutators: ['enemyCount+22%', 'enemySpeed+33%', 'dropRate-24%'] },
  { id: 'mega-challenge-0418', title: 'Mega Challenge 0418', stars: 4, description: 'Escalated encounter stack profile 0418 with controlled mutator layering.', mutators: ['enemyCount+23%', 'enemySpeed+34%', 'dropRate-3%'] },
  { id: 'mega-challenge-0419', title: 'Mega Challenge 0419', stars: 5, description: 'Escalated encounter stack profile 0419 with controlled mutator layering.', mutators: ['enemyCount+24%', 'enemySpeed+35%', 'dropRate-4%'] },
  { id: 'mega-challenge-0420', title: 'Mega Challenge 0420', stars: 1, description: 'Escalated encounter stack profile 0420 with controlled mutator layering.', mutators: ['enemyCount+25%', 'enemySpeed+6%', 'dropRate-5%'] },
  { id: 'mega-challenge-0421', title: 'Mega Challenge 0421', stars: 2, description: 'Escalated encounter stack profile 0421 with controlled mutator layering.', mutators: ['enemyCount+26%', 'enemySpeed+7%', 'dropRate-6%'] },
  { id: 'mega-challenge-0422', title: 'Mega Challenge 0422', stars: 3, description: 'Escalated encounter stack profile 0422 with controlled mutator layering.', mutators: ['enemyCount+27%', 'enemySpeed+8%', 'dropRate-7%'] },
  { id: 'mega-challenge-0423', title: 'Mega Challenge 0423', stars: 4, description: 'Escalated encounter stack profile 0423 with controlled mutator layering.', mutators: ['enemyCount+28%', 'enemySpeed+9%', 'dropRate-8%'] },
  { id: 'mega-challenge-0424', title: 'Mega Challenge 0424', stars: 5, description: 'Escalated encounter stack profile 0424 with controlled mutator layering.', mutators: ['enemyCount+29%', 'enemySpeed+10%', 'dropRate-9%'] },
  { id: 'mega-challenge-0425', title: 'Mega Challenge 0425', stars: 1, description: 'Escalated encounter stack profile 0425 with controlled mutator layering.', mutators: ['enemyCount+30%', 'enemySpeed+11%', 'dropRate-10%'] },
  { id: 'mega-challenge-0426', title: 'Mega Challenge 0426', stars: 2, description: 'Escalated encounter stack profile 0426 with controlled mutator layering.', mutators: ['enemyCount+31%', 'enemySpeed+12%', 'dropRate-11%'] },
  { id: 'mega-challenge-0427', title: 'Mega Challenge 0427', stars: 3, description: 'Escalated encounter stack profile 0427 with controlled mutator layering.', mutators: ['enemyCount+32%', 'enemySpeed+13%', 'dropRate-12%'] },
  { id: 'mega-challenge-0428', title: 'Mega Challenge 0428', stars: 4, description: 'Escalated encounter stack profile 0428 with controlled mutator layering.', mutators: ['enemyCount+33%', 'enemySpeed+14%', 'dropRate-13%'] },
  { id: 'mega-challenge-0429', title: 'Mega Challenge 0429', stars: 5, description: 'Escalated encounter stack profile 0429 with controlled mutator layering.', mutators: ['enemyCount+34%', 'enemySpeed+15%', 'dropRate-14%'] },
  { id: 'mega-challenge-0430', title: 'Mega Challenge 0430', stars: 1, description: 'Escalated encounter stack profile 0430 with controlled mutator layering.', mutators: ['enemyCount+35%', 'enemySpeed+16%', 'dropRate-15%'] },
  { id: 'mega-challenge-0431', title: 'Mega Challenge 0431', stars: 2, description: 'Escalated encounter stack profile 0431 with controlled mutator layering.', mutators: ['enemyCount+36%', 'enemySpeed+17%', 'dropRate-16%'] },
  { id: 'mega-challenge-0432', title: 'Mega Challenge 0432', stars: 3, description: 'Escalated encounter stack profile 0432 with controlled mutator layering.', mutators: ['enemyCount+37%', 'enemySpeed+18%', 'dropRate-17%'] },
  { id: 'mega-challenge-0433', title: 'Mega Challenge 0433', stars: 4, description: 'Escalated encounter stack profile 0433 with controlled mutator layering.', mutators: ['enemyCount+38%', 'enemySpeed+19%', 'dropRate-18%'] },
  { id: 'mega-challenge-0434', title: 'Mega Challenge 0434', stars: 5, description: 'Escalated encounter stack profile 0434 with controlled mutator layering.', mutators: ['enemyCount+39%', 'enemySpeed+20%', 'dropRate-19%'] },
  { id: 'mega-challenge-0435', title: 'Mega Challenge 0435', stars: 1, description: 'Escalated encounter stack profile 0435 with controlled mutator layering.', mutators: ['enemyCount+40%', 'enemySpeed+21%', 'dropRate-20%'] },
  { id: 'mega-challenge-0436', title: 'Mega Challenge 0436', stars: 2, description: 'Escalated encounter stack profile 0436 with controlled mutator layering.', mutators: ['enemyCount+41%', 'enemySpeed+22%', 'dropRate-21%'] },
  { id: 'mega-challenge-0437', title: 'Mega Challenge 0437', stars: 3, description: 'Escalated encounter stack profile 0437 with controlled mutator layering.', mutators: ['enemyCount+42%', 'enemySpeed+23%', 'dropRate-22%'] },
  { id: 'mega-challenge-0438', title: 'Mega Challenge 0438', stars: 4, description: 'Escalated encounter stack profile 0438 with controlled mutator layering.', mutators: ['enemyCount+43%', 'enemySpeed+24%', 'dropRate-23%'] },
  { id: 'mega-challenge-0439', title: 'Mega Challenge 0439', stars: 5, description: 'Escalated encounter stack profile 0439 with controlled mutator layering.', mutators: ['enemyCount+44%', 'enemySpeed+25%', 'dropRate-24%'] },
  { id: 'mega-challenge-0440', title: 'Mega Challenge 0440', stars: 1, description: 'Escalated encounter stack profile 0440 with controlled mutator layering.', mutators: ['enemyCount+45%', 'enemySpeed+26%', 'dropRate-3%'] },
  { id: 'mega-challenge-0441', title: 'Mega Challenge 0441', stars: 2, description: 'Escalated encounter stack profile 0441 with controlled mutator layering.', mutators: ['enemyCount+46%', 'enemySpeed+27%', 'dropRate-4%'] },
  { id: 'mega-challenge-0442', title: 'Mega Challenge 0442', stars: 3, description: 'Escalated encounter stack profile 0442 with controlled mutator layering.', mutators: ['enemyCount+47%', 'enemySpeed+28%', 'dropRate-5%'] },
  { id: 'mega-challenge-0443', title: 'Mega Challenge 0443', stars: 4, description: 'Escalated encounter stack profile 0443 with controlled mutator layering.', mutators: ['enemyCount+48%', 'enemySpeed+29%', 'dropRate-6%'] },
  { id: 'mega-challenge-0444', title: 'Mega Challenge 0444', stars: 5, description: 'Escalated encounter stack profile 0444 with controlled mutator layering.', mutators: ['enemyCount+49%', 'enemySpeed+30%', 'dropRate-7%'] },
  { id: 'mega-challenge-0445', title: 'Mega Challenge 0445', stars: 1, description: 'Escalated encounter stack profile 0445 with controlled mutator layering.', mutators: ['enemyCount+50%', 'enemySpeed+31%', 'dropRate-8%'] },
  { id: 'mega-challenge-0446', title: 'Mega Challenge 0446', stars: 2, description: 'Escalated encounter stack profile 0446 with controlled mutator layering.', mutators: ['enemyCount+51%', 'enemySpeed+32%', 'dropRate-9%'] },
  { id: 'mega-challenge-0447', title: 'Mega Challenge 0447', stars: 3, description: 'Escalated encounter stack profile 0447 with controlled mutator layering.', mutators: ['enemyCount+52%', 'enemySpeed+33%', 'dropRate-10%'] },
  { id: 'mega-challenge-0448', title: 'Mega Challenge 0448', stars: 4, description: 'Escalated encounter stack profile 0448 with controlled mutator layering.', mutators: ['enemyCount+53%', 'enemySpeed+34%', 'dropRate-11%'] },
  { id: 'mega-challenge-0449', title: 'Mega Challenge 0449', stars: 5, description: 'Escalated encounter stack profile 0449 with controlled mutator layering.', mutators: ['enemyCount+54%', 'enemySpeed+35%', 'dropRate-12%'] },
  { id: 'mega-challenge-0450', title: 'Mega Challenge 0450', stars: 1, description: 'Escalated encounter stack profile 0450 with controlled mutator layering.', mutators: ['enemyCount+10%', 'enemySpeed+6%', 'dropRate-13%'] },
  { id: 'mega-challenge-0451', title: 'Mega Challenge 0451', stars: 2, description: 'Escalated encounter stack profile 0451 with controlled mutator layering.', mutators: ['enemyCount+11%', 'enemySpeed+7%', 'dropRate-14%'] },
  { id: 'mega-challenge-0452', title: 'Mega Challenge 0452', stars: 3, description: 'Escalated encounter stack profile 0452 with controlled mutator layering.', mutators: ['enemyCount+12%', 'enemySpeed+8%', 'dropRate-15%'] },
  { id: 'mega-challenge-0453', title: 'Mega Challenge 0453', stars: 4, description: 'Escalated encounter stack profile 0453 with controlled mutator layering.', mutators: ['enemyCount+13%', 'enemySpeed+9%', 'dropRate-16%'] },
  { id: 'mega-challenge-0454', title: 'Mega Challenge 0454', stars: 5, description: 'Escalated encounter stack profile 0454 with controlled mutator layering.', mutators: ['enemyCount+14%', 'enemySpeed+10%', 'dropRate-17%'] },
  { id: 'mega-challenge-0455', title: 'Mega Challenge 0455', stars: 1, description: 'Escalated encounter stack profile 0455 with controlled mutator layering.', mutators: ['enemyCount+15%', 'enemySpeed+11%', 'dropRate-18%'] },
  { id: 'mega-challenge-0456', title: 'Mega Challenge 0456', stars: 2, description: 'Escalated encounter stack profile 0456 with controlled mutator layering.', mutators: ['enemyCount+16%', 'enemySpeed+12%', 'dropRate-19%'] },
  { id: 'mega-challenge-0457', title: 'Mega Challenge 0457', stars: 3, description: 'Escalated encounter stack profile 0457 with controlled mutator layering.', mutators: ['enemyCount+17%', 'enemySpeed+13%', 'dropRate-20%'] },
  { id: 'mega-challenge-0458', title: 'Mega Challenge 0458', stars: 4, description: 'Escalated encounter stack profile 0458 with controlled mutator layering.', mutators: ['enemyCount+18%', 'enemySpeed+14%', 'dropRate-21%'] },
  { id: 'mega-challenge-0459', title: 'Mega Challenge 0459', stars: 5, description: 'Escalated encounter stack profile 0459 with controlled mutator layering.', mutators: ['enemyCount+19%', 'enemySpeed+15%', 'dropRate-22%'] },
  { id: 'mega-challenge-0460', title: 'Mega Challenge 0460', stars: 1, description: 'Escalated encounter stack profile 0460 with controlled mutator layering.', mutators: ['enemyCount+20%', 'enemySpeed+16%', 'dropRate-23%'] },
  { id: 'mega-challenge-0461', title: 'Mega Challenge 0461', stars: 2, description: 'Escalated encounter stack profile 0461 with controlled mutator layering.', mutators: ['enemyCount+21%', 'enemySpeed+17%', 'dropRate-24%'] },
  { id: 'mega-challenge-0462', title: 'Mega Challenge 0462', stars: 3, description: 'Escalated encounter stack profile 0462 with controlled mutator layering.', mutators: ['enemyCount+22%', 'enemySpeed+18%', 'dropRate-3%'] },
  { id: 'mega-challenge-0463', title: 'Mega Challenge 0463', stars: 4, description: 'Escalated encounter stack profile 0463 with controlled mutator layering.', mutators: ['enemyCount+23%', 'enemySpeed+19%', 'dropRate-4%'] },
  { id: 'mega-challenge-0464', title: 'Mega Challenge 0464', stars: 5, description: 'Escalated encounter stack profile 0464 with controlled mutator layering.', mutators: ['enemyCount+24%', 'enemySpeed+20%', 'dropRate-5%'] },
  { id: 'mega-challenge-0465', title: 'Mega Challenge 0465', stars: 1, description: 'Escalated encounter stack profile 0465 with controlled mutator layering.', mutators: ['enemyCount+25%', 'enemySpeed+21%', 'dropRate-6%'] },
  { id: 'mega-challenge-0466', title: 'Mega Challenge 0466', stars: 2, description: 'Escalated encounter stack profile 0466 with controlled mutator layering.', mutators: ['enemyCount+26%', 'enemySpeed+22%', 'dropRate-7%'] },
  { id: 'mega-challenge-0467', title: 'Mega Challenge 0467', stars: 3, description: 'Escalated encounter stack profile 0467 with controlled mutator layering.', mutators: ['enemyCount+27%', 'enemySpeed+23%', 'dropRate-8%'] },
  { id: 'mega-challenge-0468', title: 'Mega Challenge 0468', stars: 4, description: 'Escalated encounter stack profile 0468 with controlled mutator layering.', mutators: ['enemyCount+28%', 'enemySpeed+24%', 'dropRate-9%'] },
  { id: 'mega-challenge-0469', title: 'Mega Challenge 0469', stars: 5, description: 'Escalated encounter stack profile 0469 with controlled mutator layering.', mutators: ['enemyCount+29%', 'enemySpeed+25%', 'dropRate-10%'] },
  { id: 'mega-challenge-0470', title: 'Mega Challenge 0470', stars: 1, description: 'Escalated encounter stack profile 0470 with controlled mutator layering.', mutators: ['enemyCount+30%', 'enemySpeed+26%', 'dropRate-11%'] },
  { id: 'mega-challenge-0471', title: 'Mega Challenge 0471', stars: 2, description: 'Escalated encounter stack profile 0471 with controlled mutator layering.', mutators: ['enemyCount+31%', 'enemySpeed+27%', 'dropRate-12%'] },
  { id: 'mega-challenge-0472', title: 'Mega Challenge 0472', stars: 3, description: 'Escalated encounter stack profile 0472 with controlled mutator layering.', mutators: ['enemyCount+32%', 'enemySpeed+28%', 'dropRate-13%'] },
  { id: 'mega-challenge-0473', title: 'Mega Challenge 0473', stars: 4, description: 'Escalated encounter stack profile 0473 with controlled mutator layering.', mutators: ['enemyCount+33%', 'enemySpeed+29%', 'dropRate-14%'] },
  { id: 'mega-challenge-0474', title: 'Mega Challenge 0474', stars: 5, description: 'Escalated encounter stack profile 0474 with controlled mutator layering.', mutators: ['enemyCount+34%', 'enemySpeed+30%', 'dropRate-15%'] },
  { id: 'mega-challenge-0475', title: 'Mega Challenge 0475', stars: 1, description: 'Escalated encounter stack profile 0475 with controlled mutator layering.', mutators: ['enemyCount+35%', 'enemySpeed+31%', 'dropRate-16%'] },
  { id: 'mega-challenge-0476', title: 'Mega Challenge 0476', stars: 2, description: 'Escalated encounter stack profile 0476 with controlled mutator layering.', mutators: ['enemyCount+36%', 'enemySpeed+32%', 'dropRate-17%'] },
  { id: 'mega-challenge-0477', title: 'Mega Challenge 0477', stars: 3, description: 'Escalated encounter stack profile 0477 with controlled mutator layering.', mutators: ['enemyCount+37%', 'enemySpeed+33%', 'dropRate-18%'] },
  { id: 'mega-challenge-0478', title: 'Mega Challenge 0478', stars: 4, description: 'Escalated encounter stack profile 0478 with controlled mutator layering.', mutators: ['enemyCount+38%', 'enemySpeed+34%', 'dropRate-19%'] },
  { id: 'mega-challenge-0479', title: 'Mega Challenge 0479', stars: 5, description: 'Escalated encounter stack profile 0479 with controlled mutator layering.', mutators: ['enemyCount+39%', 'enemySpeed+35%', 'dropRate-20%'] },
  { id: 'mega-challenge-0480', title: 'Mega Challenge 0480', stars: 1, description: 'Escalated encounter stack profile 0480 with controlled mutator layering.', mutators: ['enemyCount+40%', 'enemySpeed+6%', 'dropRate-21%'] },
  { id: 'mega-challenge-0481', title: 'Mega Challenge 0481', stars: 2, description: 'Escalated encounter stack profile 0481 with controlled mutator layering.', mutators: ['enemyCount+41%', 'enemySpeed+7%', 'dropRate-22%'] },
  { id: 'mega-challenge-0482', title: 'Mega Challenge 0482', stars: 3, description: 'Escalated encounter stack profile 0482 with controlled mutator layering.', mutators: ['enemyCount+42%', 'enemySpeed+8%', 'dropRate-23%'] },
  { id: 'mega-challenge-0483', title: 'Mega Challenge 0483', stars: 4, description: 'Escalated encounter stack profile 0483 with controlled mutator layering.', mutators: ['enemyCount+43%', 'enemySpeed+9%', 'dropRate-24%'] },
  { id: 'mega-challenge-0484', title: 'Mega Challenge 0484', stars: 5, description: 'Escalated encounter stack profile 0484 with controlled mutator layering.', mutators: ['enemyCount+44%', 'enemySpeed+10%', 'dropRate-3%'] },
  { id: 'mega-challenge-0485', title: 'Mega Challenge 0485', stars: 1, description: 'Escalated encounter stack profile 0485 with controlled mutator layering.', mutators: ['enemyCount+45%', 'enemySpeed+11%', 'dropRate-4%'] },
  { id: 'mega-challenge-0486', title: 'Mega Challenge 0486', stars: 2, description: 'Escalated encounter stack profile 0486 with controlled mutator layering.', mutators: ['enemyCount+46%', 'enemySpeed+12%', 'dropRate-5%'] },
  { id: 'mega-challenge-0487', title: 'Mega Challenge 0487', stars: 3, description: 'Escalated encounter stack profile 0487 with controlled mutator layering.', mutators: ['enemyCount+47%', 'enemySpeed+13%', 'dropRate-6%'] },
  { id: 'mega-challenge-0488', title: 'Mega Challenge 0488', stars: 4, description: 'Escalated encounter stack profile 0488 with controlled mutator layering.', mutators: ['enemyCount+48%', 'enemySpeed+14%', 'dropRate-7%'] },
  { id: 'mega-challenge-0489', title: 'Mega Challenge 0489', stars: 5, description: 'Escalated encounter stack profile 0489 with controlled mutator layering.', mutators: ['enemyCount+49%', 'enemySpeed+15%', 'dropRate-8%'] },
  { id: 'mega-challenge-0490', title: 'Mega Challenge 0490', stars: 1, description: 'Escalated encounter stack profile 0490 with controlled mutator layering.', mutators: ['enemyCount+50%', 'enemySpeed+16%', 'dropRate-9%'] },
  { id: 'mega-challenge-0491', title: 'Mega Challenge 0491', stars: 2, description: 'Escalated encounter stack profile 0491 with controlled mutator layering.', mutators: ['enemyCount+51%', 'enemySpeed+17%', 'dropRate-10%'] },
  { id: 'mega-challenge-0492', title: 'Mega Challenge 0492', stars: 3, description: 'Escalated encounter stack profile 0492 with controlled mutator layering.', mutators: ['enemyCount+52%', 'enemySpeed+18%', 'dropRate-11%'] },
  { id: 'mega-challenge-0493', title: 'Mega Challenge 0493', stars: 4, description: 'Escalated encounter stack profile 0493 with controlled mutator layering.', mutators: ['enemyCount+53%', 'enemySpeed+19%', 'dropRate-12%'] },
  { id: 'mega-challenge-0494', title: 'Mega Challenge 0494', stars: 5, description: 'Escalated encounter stack profile 0494 with controlled mutator layering.', mutators: ['enemyCount+54%', 'enemySpeed+20%', 'dropRate-13%'] },
  { id: 'mega-challenge-0495', title: 'Mega Challenge 0495', stars: 1, description: 'Escalated encounter stack profile 0495 with controlled mutator layering.', mutators: ['enemyCount+10%', 'enemySpeed+21%', 'dropRate-14%'] },
  { id: 'mega-challenge-0496', title: 'Mega Challenge 0496', stars: 2, description: 'Escalated encounter stack profile 0496 with controlled mutator layering.', mutators: ['enemyCount+11%', 'enemySpeed+22%', 'dropRate-15%'] },
  { id: 'mega-challenge-0497', title: 'Mega Challenge 0497', stars: 3, description: 'Escalated encounter stack profile 0497 with controlled mutator layering.', mutators: ['enemyCount+12%', 'enemySpeed+23%', 'dropRate-16%'] },
  { id: 'mega-challenge-0498', title: 'Mega Challenge 0498', stars: 4, description: 'Escalated encounter stack profile 0498 with controlled mutator layering.', mutators: ['enemyCount+13%', 'enemySpeed+24%', 'dropRate-17%'] },
  { id: 'mega-challenge-0499', title: 'Mega Challenge 0499', stars: 5, description: 'Escalated encounter stack profile 0499 with controlled mutator layering.', mutators: ['enemyCount+14%', 'enemySpeed+25%', 'dropRate-18%'] },
  { id: 'mega-challenge-0500', title: 'Mega Challenge 0500', stars: 1, description: 'Escalated encounter stack profile 0500 with controlled mutator layering.', mutators: ['enemyCount+15%', 'enemySpeed+26%', 'dropRate-19%'] },
  { id: 'mega-challenge-0501', title: 'Mega Challenge 0501', stars: 2, description: 'Escalated encounter stack profile 0501 with controlled mutator layering.', mutators: ['enemyCount+16%', 'enemySpeed+27%', 'dropRate-20%'] },
  { id: 'mega-challenge-0502', title: 'Mega Challenge 0502', stars: 3, description: 'Escalated encounter stack profile 0502 with controlled mutator layering.', mutators: ['enemyCount+17%', 'enemySpeed+28%', 'dropRate-21%'] },
  { id: 'mega-challenge-0503', title: 'Mega Challenge 0503', stars: 4, description: 'Escalated encounter stack profile 0503 with controlled mutator layering.', mutators: ['enemyCount+18%', 'enemySpeed+29%', 'dropRate-22%'] },
  { id: 'mega-challenge-0504', title: 'Mega Challenge 0504', stars: 5, description: 'Escalated encounter stack profile 0504 with controlled mutator layering.', mutators: ['enemyCount+19%', 'enemySpeed+30%', 'dropRate-23%'] },
  { id: 'mega-challenge-0505', title: 'Mega Challenge 0505', stars: 1, description: 'Escalated encounter stack profile 0505 with controlled mutator layering.', mutators: ['enemyCount+20%', 'enemySpeed+31%', 'dropRate-24%'] },
  { id: 'mega-challenge-0506', title: 'Mega Challenge 0506', stars: 2, description: 'Escalated encounter stack profile 0506 with controlled mutator layering.', mutators: ['enemyCount+21%', 'enemySpeed+32%', 'dropRate-3%'] },
  { id: 'mega-challenge-0507', title: 'Mega Challenge 0507', stars: 3, description: 'Escalated encounter stack profile 0507 with controlled mutator layering.', mutators: ['enemyCount+22%', 'enemySpeed+33%', 'dropRate-4%'] },
  { id: 'mega-challenge-0508', title: 'Mega Challenge 0508', stars: 4, description: 'Escalated encounter stack profile 0508 with controlled mutator layering.', mutators: ['enemyCount+23%', 'enemySpeed+34%', 'dropRate-5%'] },
  { id: 'mega-challenge-0509', title: 'Mega Challenge 0509', stars: 5, description: 'Escalated encounter stack profile 0509 with controlled mutator layering.', mutators: ['enemyCount+24%', 'enemySpeed+35%', 'dropRate-6%'] },
  { id: 'mega-challenge-0510', title: 'Mega Challenge 0510', stars: 1, description: 'Escalated encounter stack profile 0510 with controlled mutator layering.', mutators: ['enemyCount+25%', 'enemySpeed+6%', 'dropRate-7%'] },
  { id: 'mega-challenge-0511', title: 'Mega Challenge 0511', stars: 2, description: 'Escalated encounter stack profile 0511 with controlled mutator layering.', mutators: ['enemyCount+26%', 'enemySpeed+7%', 'dropRate-8%'] },
  { id: 'mega-challenge-0512', title: 'Mega Challenge 0512', stars: 3, description: 'Escalated encounter stack profile 0512 with controlled mutator layering.', mutators: ['enemyCount+27%', 'enemySpeed+8%', 'dropRate-9%'] },
  { id: 'mega-challenge-0513', title: 'Mega Challenge 0513', stars: 4, description: 'Escalated encounter stack profile 0513 with controlled mutator layering.', mutators: ['enemyCount+28%', 'enemySpeed+9%', 'dropRate-10%'] },
  { id: 'mega-challenge-0514', title: 'Mega Challenge 0514', stars: 5, description: 'Escalated encounter stack profile 0514 with controlled mutator layering.', mutators: ['enemyCount+29%', 'enemySpeed+10%', 'dropRate-11%'] },
  { id: 'mega-challenge-0515', title: 'Mega Challenge 0515', stars: 1, description: 'Escalated encounter stack profile 0515 with controlled mutator layering.', mutators: ['enemyCount+30%', 'enemySpeed+11%', 'dropRate-12%'] },
  { id: 'mega-challenge-0516', title: 'Mega Challenge 0516', stars: 2, description: 'Escalated encounter stack profile 0516 with controlled mutator layering.', mutators: ['enemyCount+31%', 'enemySpeed+12%', 'dropRate-13%'] },
  { id: 'mega-challenge-0517', title: 'Mega Challenge 0517', stars: 3, description: 'Escalated encounter stack profile 0517 with controlled mutator layering.', mutators: ['enemyCount+32%', 'enemySpeed+13%', 'dropRate-14%'] },
  { id: 'mega-challenge-0518', title: 'Mega Challenge 0518', stars: 4, description: 'Escalated encounter stack profile 0518 with controlled mutator layering.', mutators: ['enemyCount+33%', 'enemySpeed+14%', 'dropRate-15%'] },
  { id: 'mega-challenge-0519', title: 'Mega Challenge 0519', stars: 5, description: 'Escalated encounter stack profile 0519 with controlled mutator layering.', mutators: ['enemyCount+34%', 'enemySpeed+15%', 'dropRate-16%'] },
  { id: 'mega-challenge-0520', title: 'Mega Challenge 0520', stars: 1, description: 'Escalated encounter stack profile 0520 with controlled mutator layering.', mutators: ['enemyCount+35%', 'enemySpeed+16%', 'dropRate-17%'] },
];

const MEGA_FX_PROFILES_V2 = [
  { id: 'mega-fx-0001', label: 'Mega FX 0001', category: 'anomaly', visual: 'Layered profile 0001 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0001' },
  { id: 'mega-fx-0002', label: 'Mega FX 0002', category: 'anomaly', visual: 'Layered profile 0002 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0002' },
  { id: 'mega-fx-0003', label: 'Mega FX 0003', category: 'anomaly', visual: 'Layered profile 0003 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0003' },
  { id: 'mega-fx-0004', label: 'Mega FX 0004', category: 'anomaly', visual: 'Layered profile 0004 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0004' },
  { id: 'mega-fx-0005', label: 'Mega FX 0005', category: 'anomaly', visual: 'Layered profile 0005 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0005' },
  { id: 'mega-fx-0006', label: 'Mega FX 0006', category: 'anomaly', visual: 'Layered profile 0006 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0006' },
  { id: 'mega-fx-0007', label: 'Mega FX 0007', category: 'anomaly', visual: 'Layered profile 0007 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0007' },
  { id: 'mega-fx-0008', label: 'Mega FX 0008', category: 'anomaly', visual: 'Layered profile 0008 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0008' },
  { id: 'mega-fx-0009', label: 'Mega FX 0009', category: 'anomaly', visual: 'Layered profile 0009 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0009' },
  { id: 'mega-fx-0010', label: 'Mega FX 0010', category: 'anomaly', visual: 'Layered profile 0010 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0010' },
  { id: 'mega-fx-0011', label: 'Mega FX 0011', category: 'anomaly', visual: 'Layered profile 0011 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0011' },
  { id: 'mega-fx-0012', label: 'Mega FX 0012', category: 'anomaly', visual: 'Layered profile 0012 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0012' },
  { id: 'mega-fx-0013', label: 'Mega FX 0013', category: 'anomaly', visual: 'Layered profile 0013 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0013' },
  { id: 'mega-fx-0014', label: 'Mega FX 0014', category: 'anomaly', visual: 'Layered profile 0014 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0014' },
  { id: 'mega-fx-0015', label: 'Mega FX 0015', category: 'anomaly', visual: 'Layered profile 0015 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0015' },
  { id: 'mega-fx-0016', label: 'Mega FX 0016', category: 'anomaly', visual: 'Layered profile 0016 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0016' },
  { id: 'mega-fx-0017', label: 'Mega FX 0017', category: 'anomaly', visual: 'Layered profile 0017 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0017' },
  { id: 'mega-fx-0018', label: 'Mega FX 0018', category: 'anomaly', visual: 'Layered profile 0018 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0018' },
  { id: 'mega-fx-0019', label: 'Mega FX 0019', category: 'anomaly', visual: 'Layered profile 0019 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0019' },
  { id: 'mega-fx-0020', label: 'Mega FX 0020', category: 'anomaly', visual: 'Layered profile 0020 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0020' },
  { id: 'mega-fx-0021', label: 'Mega FX 0021', category: 'anomaly', visual: 'Layered profile 0021 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0021' },
  { id: 'mega-fx-0022', label: 'Mega FX 0022', category: 'anomaly', visual: 'Layered profile 0022 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0022' },
  { id: 'mega-fx-0023', label: 'Mega FX 0023', category: 'anomaly', visual: 'Layered profile 0023 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0023' },
  { id: 'mega-fx-0024', label: 'Mega FX 0024', category: 'anomaly', visual: 'Layered profile 0024 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0024' },
  { id: 'mega-fx-0025', label: 'Mega FX 0025', category: 'anomaly', visual: 'Layered profile 0025 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0025' },
  { id: 'mega-fx-0026', label: 'Mega FX 0026', category: 'anomaly', visual: 'Layered profile 0026 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0026' },
  { id: 'mega-fx-0027', label: 'Mega FX 0027', category: 'anomaly', visual: 'Layered profile 0027 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0027' },
  { id: 'mega-fx-0028', label: 'Mega FX 0028', category: 'anomaly', visual: 'Layered profile 0028 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0028' },
  { id: 'mega-fx-0029', label: 'Mega FX 0029', category: 'anomaly', visual: 'Layered profile 0029 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0029' },
  { id: 'mega-fx-0030', label: 'Mega FX 0030', category: 'anomaly', visual: 'Layered profile 0030 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0030' },
  { id: 'mega-fx-0031', label: 'Mega FX 0031', category: 'anomaly', visual: 'Layered profile 0031 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0031' },
  { id: 'mega-fx-0032', label: 'Mega FX 0032', category: 'anomaly', visual: 'Layered profile 0032 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0032' },
  { id: 'mega-fx-0033', label: 'Mega FX 0033', category: 'anomaly', visual: 'Layered profile 0033 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0033' },
  { id: 'mega-fx-0034', label: 'Mega FX 0034', category: 'anomaly', visual: 'Layered profile 0034 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0034' },
  { id: 'mega-fx-0035', label: 'Mega FX 0035', category: 'anomaly', visual: 'Layered profile 0035 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0035' },
  { id: 'mega-fx-0036', label: 'Mega FX 0036', category: 'anomaly', visual: 'Layered profile 0036 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0036' },
  { id: 'mega-fx-0037', label: 'Mega FX 0037', category: 'anomaly', visual: 'Layered profile 0037 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0037' },
  { id: 'mega-fx-0038', label: 'Mega FX 0038', category: 'anomaly', visual: 'Layered profile 0038 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0038' },
  { id: 'mega-fx-0039', label: 'Mega FX 0039', category: 'anomaly', visual: 'Layered profile 0039 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0039' },
  { id: 'mega-fx-0040', label: 'Mega FX 0040', category: 'anomaly', visual: 'Layered profile 0040 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0040' },
  { id: 'mega-fx-0041', label: 'Mega FX 0041', category: 'anomaly', visual: 'Layered profile 0041 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0041' },
  { id: 'mega-fx-0042', label: 'Mega FX 0042', category: 'anomaly', visual: 'Layered profile 0042 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0042' },
  { id: 'mega-fx-0043', label: 'Mega FX 0043', category: 'anomaly', visual: 'Layered profile 0043 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0043' },
  { id: 'mega-fx-0044', label: 'Mega FX 0044', category: 'anomaly', visual: 'Layered profile 0044 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0044' },
  { id: 'mega-fx-0045', label: 'Mega FX 0045', category: 'anomaly', visual: 'Layered profile 0045 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0045' },
  { id: 'mega-fx-0046', label: 'Mega FX 0046', category: 'anomaly', visual: 'Layered profile 0046 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0046' },
  { id: 'mega-fx-0047', label: 'Mega FX 0047', category: 'anomaly', visual: 'Layered profile 0047 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0047' },
  { id: 'mega-fx-0048', label: 'Mega FX 0048', category: 'anomaly', visual: 'Layered profile 0048 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0048' },
  { id: 'mega-fx-0049', label: 'Mega FX 0049', category: 'anomaly', visual: 'Layered profile 0049 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0049' },
  { id: 'mega-fx-0050', label: 'Mega FX 0050', category: 'anomaly', visual: 'Layered profile 0050 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0050' },
  { id: 'mega-fx-0051', label: 'Mega FX 0051', category: 'anomaly', visual: 'Layered profile 0051 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0051' },
  { id: 'mega-fx-0052', label: 'Mega FX 0052', category: 'anomaly', visual: 'Layered profile 0052 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0052' },
  { id: 'mega-fx-0053', label: 'Mega FX 0053', category: 'anomaly', visual: 'Layered profile 0053 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0053' },
  { id: 'mega-fx-0054', label: 'Mega FX 0054', category: 'anomaly', visual: 'Layered profile 0054 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0054' },
  { id: 'mega-fx-0055', label: 'Mega FX 0055', category: 'anomaly', visual: 'Layered profile 0055 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0055' },
  { id: 'mega-fx-0056', label: 'Mega FX 0056', category: 'anomaly', visual: 'Layered profile 0056 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0056' },
  { id: 'mega-fx-0057', label: 'Mega FX 0057', category: 'anomaly', visual: 'Layered profile 0057 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0057' },
  { id: 'mega-fx-0058', label: 'Mega FX 0058', category: 'anomaly', visual: 'Layered profile 0058 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0058' },
  { id: 'mega-fx-0059', label: 'Mega FX 0059', category: 'anomaly', visual: 'Layered profile 0059 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0059' },
  { id: 'mega-fx-0060', label: 'Mega FX 0060', category: 'anomaly', visual: 'Layered profile 0060 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0060' },
  { id: 'mega-fx-0061', label: 'Mega FX 0061', category: 'anomaly', visual: 'Layered profile 0061 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0061' },
  { id: 'mega-fx-0062', label: 'Mega FX 0062', category: 'anomaly', visual: 'Layered profile 0062 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0062' },
  { id: 'mega-fx-0063', label: 'Mega FX 0063', category: 'anomaly', visual: 'Layered profile 0063 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0063' },
  { id: 'mega-fx-0064', label: 'Mega FX 0064', category: 'anomaly', visual: 'Layered profile 0064 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0064' },
  { id: 'mega-fx-0065', label: 'Mega FX 0065', category: 'anomaly', visual: 'Layered profile 0065 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0065' },
  { id: 'mega-fx-0066', label: 'Mega FX 0066', category: 'anomaly', visual: 'Layered profile 0066 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0066' },
  { id: 'mega-fx-0067', label: 'Mega FX 0067', category: 'anomaly', visual: 'Layered profile 0067 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0067' },
  { id: 'mega-fx-0068', label: 'Mega FX 0068', category: 'anomaly', visual: 'Layered profile 0068 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0068' },
  { id: 'mega-fx-0069', label: 'Mega FX 0069', category: 'anomaly', visual: 'Layered profile 0069 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0069' },
  { id: 'mega-fx-0070', label: 'Mega FX 0070', category: 'anomaly', visual: 'Layered profile 0070 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0070' },
  { id: 'mega-fx-0071', label: 'Mega FX 0071', category: 'anomaly', visual: 'Layered profile 0071 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0071' },
  { id: 'mega-fx-0072', label: 'Mega FX 0072', category: 'anomaly', visual: 'Layered profile 0072 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0072' },
  { id: 'mega-fx-0073', label: 'Mega FX 0073', category: 'anomaly', visual: 'Layered profile 0073 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0073' },
  { id: 'mega-fx-0074', label: 'Mega FX 0074', category: 'anomaly', visual: 'Layered profile 0074 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0074' },
  { id: 'mega-fx-0075', label: 'Mega FX 0075', category: 'anomaly', visual: 'Layered profile 0075 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0075' },
  { id: 'mega-fx-0076', label: 'Mega FX 0076', category: 'anomaly', visual: 'Layered profile 0076 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0076' },
  { id: 'mega-fx-0077', label: 'Mega FX 0077', category: 'anomaly', visual: 'Layered profile 0077 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0077' },
  { id: 'mega-fx-0078', label: 'Mega FX 0078', category: 'anomaly', visual: 'Layered profile 0078 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0078' },
  { id: 'mega-fx-0079', label: 'Mega FX 0079', category: 'anomaly', visual: 'Layered profile 0079 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0079' },
  { id: 'mega-fx-0080', label: 'Mega FX 0080', category: 'anomaly', visual: 'Layered profile 0080 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0080' },
  { id: 'mega-fx-0081', label: 'Mega FX 0081', category: 'anomaly', visual: 'Layered profile 0081 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0081' },
  { id: 'mega-fx-0082', label: 'Mega FX 0082', category: 'anomaly', visual: 'Layered profile 0082 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0082' },
  { id: 'mega-fx-0083', label: 'Mega FX 0083', category: 'anomaly', visual: 'Layered profile 0083 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0083' },
  { id: 'mega-fx-0084', label: 'Mega FX 0084', category: 'anomaly', visual: 'Layered profile 0084 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0084' },
  { id: 'mega-fx-0085', label: 'Mega FX 0085', category: 'anomaly', visual: 'Layered profile 0085 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0085' },
  { id: 'mega-fx-0086', label: 'Mega FX 0086', category: 'anomaly', visual: 'Layered profile 0086 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0086' },
  { id: 'mega-fx-0087', label: 'Mega FX 0087', category: 'anomaly', visual: 'Layered profile 0087 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0087' },
  { id: 'mega-fx-0088', label: 'Mega FX 0088', category: 'anomaly', visual: 'Layered profile 0088 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0088' },
  { id: 'mega-fx-0089', label: 'Mega FX 0089', category: 'anomaly', visual: 'Layered profile 0089 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0089' },
  { id: 'mega-fx-0090', label: 'Mega FX 0090', category: 'anomaly', visual: 'Layered profile 0090 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0090' },
  { id: 'mega-fx-0091', label: 'Mega FX 0091', category: 'anomaly', visual: 'Layered profile 0091 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0091' },
  { id: 'mega-fx-0092', label: 'Mega FX 0092', category: 'anomaly', visual: 'Layered profile 0092 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0092' },
  { id: 'mega-fx-0093', label: 'Mega FX 0093', category: 'anomaly', visual: 'Layered profile 0093 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0093' },
  { id: 'mega-fx-0094', label: 'Mega FX 0094', category: 'anomaly', visual: 'Layered profile 0094 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0094' },
  { id: 'mega-fx-0095', label: 'Mega FX 0095', category: 'anomaly', visual: 'Layered profile 0095 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0095' },
  { id: 'mega-fx-0096', label: 'Mega FX 0096', category: 'anomaly', visual: 'Layered profile 0096 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0096' },
  { id: 'mega-fx-0097', label: 'Mega FX 0097', category: 'anomaly', visual: 'Layered profile 0097 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0097' },
  { id: 'mega-fx-0098', label: 'Mega FX 0098', category: 'anomaly', visual: 'Layered profile 0098 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0098' },
  { id: 'mega-fx-0099', label: 'Mega FX 0099', category: 'anomaly', visual: 'Layered profile 0099 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0099' },
  { id: 'mega-fx-0100', label: 'Mega FX 0100', category: 'anomaly', visual: 'Layered profile 0100 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0100' },
  { id: 'mega-fx-0101', label: 'Mega FX 0101', category: 'anomaly', visual: 'Layered profile 0101 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0101' },
  { id: 'mega-fx-0102', label: 'Mega FX 0102', category: 'anomaly', visual: 'Layered profile 0102 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0102' },
  { id: 'mega-fx-0103', label: 'Mega FX 0103', category: 'anomaly', visual: 'Layered profile 0103 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0103' },
  { id: 'mega-fx-0104', label: 'Mega FX 0104', category: 'anomaly', visual: 'Layered profile 0104 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0104' },
  { id: 'mega-fx-0105', label: 'Mega FX 0105', category: 'anomaly', visual: 'Layered profile 0105 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0105' },
  { id: 'mega-fx-0106', label: 'Mega FX 0106', category: 'anomaly', visual: 'Layered profile 0106 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0106' },
  { id: 'mega-fx-0107', label: 'Mega FX 0107', category: 'anomaly', visual: 'Layered profile 0107 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0107' },
  { id: 'mega-fx-0108', label: 'Mega FX 0108', category: 'anomaly', visual: 'Layered profile 0108 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0108' },
  { id: 'mega-fx-0109', label: 'Mega FX 0109', category: 'anomaly', visual: 'Layered profile 0109 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0109' },
  { id: 'mega-fx-0110', label: 'Mega FX 0110', category: 'anomaly', visual: 'Layered profile 0110 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0110' },
  { id: 'mega-fx-0111', label: 'Mega FX 0111', category: 'anomaly', visual: 'Layered profile 0111 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0111' },
  { id: 'mega-fx-0112', label: 'Mega FX 0112', category: 'anomaly', visual: 'Layered profile 0112 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0112' },
  { id: 'mega-fx-0113', label: 'Mega FX 0113', category: 'anomaly', visual: 'Layered profile 0113 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0113' },
  { id: 'mega-fx-0114', label: 'Mega FX 0114', category: 'anomaly', visual: 'Layered profile 0114 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0114' },
  { id: 'mega-fx-0115', label: 'Mega FX 0115', category: 'anomaly', visual: 'Layered profile 0115 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0115' },
  { id: 'mega-fx-0116', label: 'Mega FX 0116', category: 'anomaly', visual: 'Layered profile 0116 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0116' },
  { id: 'mega-fx-0117', label: 'Mega FX 0117', category: 'anomaly', visual: 'Layered profile 0117 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0117' },
  { id: 'mega-fx-0118', label: 'Mega FX 0118', category: 'anomaly', visual: 'Layered profile 0118 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0118' },
  { id: 'mega-fx-0119', label: 'Mega FX 0119', category: 'anomaly', visual: 'Layered profile 0119 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0119' },
  { id: 'mega-fx-0120', label: 'Mega FX 0120', category: 'anomaly', visual: 'Layered profile 0120 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0120' },
  { id: 'mega-fx-0121', label: 'Mega FX 0121', category: 'anomaly', visual: 'Layered profile 0121 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0121' },
  { id: 'mega-fx-0122', label: 'Mega FX 0122', category: 'anomaly', visual: 'Layered profile 0122 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0122' },
  { id: 'mega-fx-0123', label: 'Mega FX 0123', category: 'anomaly', visual: 'Layered profile 0123 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0123' },
  { id: 'mega-fx-0124', label: 'Mega FX 0124', category: 'anomaly', visual: 'Layered profile 0124 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0124' },
  { id: 'mega-fx-0125', label: 'Mega FX 0125', category: 'anomaly', visual: 'Layered profile 0125 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0125' },
  { id: 'mega-fx-0126', label: 'Mega FX 0126', category: 'anomaly', visual: 'Layered profile 0126 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0126' },
  { id: 'mega-fx-0127', label: 'Mega FX 0127', category: 'anomaly', visual: 'Layered profile 0127 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0127' },
  { id: 'mega-fx-0128', label: 'Mega FX 0128', category: 'anomaly', visual: 'Layered profile 0128 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0128' },
  { id: 'mega-fx-0129', label: 'Mega FX 0129', category: 'anomaly', visual: 'Layered profile 0129 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0129' },
  { id: 'mega-fx-0130', label: 'Mega FX 0130', category: 'anomaly', visual: 'Layered profile 0130 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0130' },
  { id: 'mega-fx-0131', label: 'Mega FX 0131', category: 'anomaly', visual: 'Layered profile 0131 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0131' },
  { id: 'mega-fx-0132', label: 'Mega FX 0132', category: 'anomaly', visual: 'Layered profile 0132 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0132' },
  { id: 'mega-fx-0133', label: 'Mega FX 0133', category: 'anomaly', visual: 'Layered profile 0133 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0133' },
  { id: 'mega-fx-0134', label: 'Mega FX 0134', category: 'anomaly', visual: 'Layered profile 0134 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0134' },
  { id: 'mega-fx-0135', label: 'Mega FX 0135', category: 'anomaly', visual: 'Layered profile 0135 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0135' },
  { id: 'mega-fx-0136', label: 'Mega FX 0136', category: 'anomaly', visual: 'Layered profile 0136 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0136' },
  { id: 'mega-fx-0137', label: 'Mega FX 0137', category: 'anomaly', visual: 'Layered profile 0137 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0137' },
  { id: 'mega-fx-0138', label: 'Mega FX 0138', category: 'anomaly', visual: 'Layered profile 0138 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0138' },
  { id: 'mega-fx-0139', label: 'Mega FX 0139', category: 'anomaly', visual: 'Layered profile 0139 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0139' },
  { id: 'mega-fx-0140', label: 'Mega FX 0140', category: 'anomaly', visual: 'Layered profile 0140 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0140' },
  { id: 'mega-fx-0141', label: 'Mega FX 0141', category: 'anomaly', visual: 'Layered profile 0141 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0141' },
  { id: 'mega-fx-0142', label: 'Mega FX 0142', category: 'anomaly', visual: 'Layered profile 0142 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0142' },
  { id: 'mega-fx-0143', label: 'Mega FX 0143', category: 'anomaly', visual: 'Layered profile 0143 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0143' },
  { id: 'mega-fx-0144', label: 'Mega FX 0144', category: 'anomaly', visual: 'Layered profile 0144 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0144' },
  { id: 'mega-fx-0145', label: 'Mega FX 0145', category: 'anomaly', visual: 'Layered profile 0145 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0145' },
  { id: 'mega-fx-0146', label: 'Mega FX 0146', category: 'anomaly', visual: 'Layered profile 0146 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0146' },
  { id: 'mega-fx-0147', label: 'Mega FX 0147', category: 'anomaly', visual: 'Layered profile 0147 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0147' },
  { id: 'mega-fx-0148', label: 'Mega FX 0148', category: 'anomaly', visual: 'Layered profile 0148 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0148' },
  { id: 'mega-fx-0149', label: 'Mega FX 0149', category: 'anomaly', visual: 'Layered profile 0149 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0149' },
  { id: 'mega-fx-0150', label: 'Mega FX 0150', category: 'anomaly', visual: 'Layered profile 0150 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0150' },
  { id: 'mega-fx-0151', label: 'Mega FX 0151', category: 'anomaly', visual: 'Layered profile 0151 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0151' },
  { id: 'mega-fx-0152', label: 'Mega FX 0152', category: 'anomaly', visual: 'Layered profile 0152 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0152' },
  { id: 'mega-fx-0153', label: 'Mega FX 0153', category: 'anomaly', visual: 'Layered profile 0153 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0153' },
  { id: 'mega-fx-0154', label: 'Mega FX 0154', category: 'anomaly', visual: 'Layered profile 0154 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0154' },
  { id: 'mega-fx-0155', label: 'Mega FX 0155', category: 'anomaly', visual: 'Layered profile 0155 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0155' },
  { id: 'mega-fx-0156', label: 'Mega FX 0156', category: 'anomaly', visual: 'Layered profile 0156 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0156' },
  { id: 'mega-fx-0157', label: 'Mega FX 0157', category: 'anomaly', visual: 'Layered profile 0157 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0157' },
  { id: 'mega-fx-0158', label: 'Mega FX 0158', category: 'anomaly', visual: 'Layered profile 0158 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0158' },
  { id: 'mega-fx-0159', label: 'Mega FX 0159', category: 'anomaly', visual: 'Layered profile 0159 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0159' },
  { id: 'mega-fx-0160', label: 'Mega FX 0160', category: 'anomaly', visual: 'Layered profile 0160 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0160' },
  { id: 'mega-fx-0161', label: 'Mega FX 0161', category: 'anomaly', visual: 'Layered profile 0161 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0161' },
  { id: 'mega-fx-0162', label: 'Mega FX 0162', category: 'anomaly', visual: 'Layered profile 0162 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0162' },
  { id: 'mega-fx-0163', label: 'Mega FX 0163', category: 'anomaly', visual: 'Layered profile 0163 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0163' },
  { id: 'mega-fx-0164', label: 'Mega FX 0164', category: 'anomaly', visual: 'Layered profile 0164 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0164' },
  { id: 'mega-fx-0165', label: 'Mega FX 0165', category: 'anomaly', visual: 'Layered profile 0165 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0165' },
  { id: 'mega-fx-0166', label: 'Mega FX 0166', category: 'anomaly', visual: 'Layered profile 0166 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0166' },
  { id: 'mega-fx-0167', label: 'Mega FX 0167', category: 'anomaly', visual: 'Layered profile 0167 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0167' },
  { id: 'mega-fx-0168', label: 'Mega FX 0168', category: 'anomaly', visual: 'Layered profile 0168 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0168' },
  { id: 'mega-fx-0169', label: 'Mega FX 0169', category: 'anomaly', visual: 'Layered profile 0169 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0169' },
  { id: 'mega-fx-0170', label: 'Mega FX 0170', category: 'anomaly', visual: 'Layered profile 0170 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0170' },
  { id: 'mega-fx-0171', label: 'Mega FX 0171', category: 'anomaly', visual: 'Layered profile 0171 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0171' },
  { id: 'mega-fx-0172', label: 'Mega FX 0172', category: 'anomaly', visual: 'Layered profile 0172 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0172' },
  { id: 'mega-fx-0173', label: 'Mega FX 0173', category: 'anomaly', visual: 'Layered profile 0173 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0173' },
  { id: 'mega-fx-0174', label: 'Mega FX 0174', category: 'anomaly', visual: 'Layered profile 0174 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0174' },
  { id: 'mega-fx-0175', label: 'Mega FX 0175', category: 'anomaly', visual: 'Layered profile 0175 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0175' },
  { id: 'mega-fx-0176', label: 'Mega FX 0176', category: 'anomaly', visual: 'Layered profile 0176 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0176' },
  { id: 'mega-fx-0177', label: 'Mega FX 0177', category: 'anomaly', visual: 'Layered profile 0177 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0177' },
  { id: 'mega-fx-0178', label: 'Mega FX 0178', category: 'anomaly', visual: 'Layered profile 0178 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0178' },
  { id: 'mega-fx-0179', label: 'Mega FX 0179', category: 'anomaly', visual: 'Layered profile 0179 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0179' },
  { id: 'mega-fx-0180', label: 'Mega FX 0180', category: 'anomaly', visual: 'Layered profile 0180 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0180' },
  { id: 'mega-fx-0181', label: 'Mega FX 0181', category: 'anomaly', visual: 'Layered profile 0181 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0181' },
  { id: 'mega-fx-0182', label: 'Mega FX 0182', category: 'anomaly', visual: 'Layered profile 0182 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0182' },
  { id: 'mega-fx-0183', label: 'Mega FX 0183', category: 'anomaly', visual: 'Layered profile 0183 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0183' },
  { id: 'mega-fx-0184', label: 'Mega FX 0184', category: 'anomaly', visual: 'Layered profile 0184 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0184' },
  { id: 'mega-fx-0185', label: 'Mega FX 0185', category: 'anomaly', visual: 'Layered profile 0185 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0185' },
  { id: 'mega-fx-0186', label: 'Mega FX 0186', category: 'anomaly', visual: 'Layered profile 0186 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0186' },
  { id: 'mega-fx-0187', label: 'Mega FX 0187', category: 'anomaly', visual: 'Layered profile 0187 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0187' },
  { id: 'mega-fx-0188', label: 'Mega FX 0188', category: 'anomaly', visual: 'Layered profile 0188 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0188' },
  { id: 'mega-fx-0189', label: 'Mega FX 0189', category: 'anomaly', visual: 'Layered profile 0189 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0189' },
  { id: 'mega-fx-0190', label: 'Mega FX 0190', category: 'anomaly', visual: 'Layered profile 0190 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0190' },
  { id: 'mega-fx-0191', label: 'Mega FX 0191', category: 'anomaly', visual: 'Layered profile 0191 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0191' },
  { id: 'mega-fx-0192', label: 'Mega FX 0192', category: 'anomaly', visual: 'Layered profile 0192 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0192' },
  { id: 'mega-fx-0193', label: 'Mega FX 0193', category: 'anomaly', visual: 'Layered profile 0193 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0193' },
  { id: 'mega-fx-0194', label: 'Mega FX 0194', category: 'anomaly', visual: 'Layered profile 0194 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0194' },
  { id: 'mega-fx-0195', label: 'Mega FX 0195', category: 'anomaly', visual: 'Layered profile 0195 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0195' },
  { id: 'mega-fx-0196', label: 'Mega FX 0196', category: 'anomaly', visual: 'Layered profile 0196 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0196' },
  { id: 'mega-fx-0197', label: 'Mega FX 0197', category: 'anomaly', visual: 'Layered profile 0197 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0197' },
  { id: 'mega-fx-0198', label: 'Mega FX 0198', category: 'anomaly', visual: 'Layered profile 0198 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0198' },
  { id: 'mega-fx-0199', label: 'Mega FX 0199', category: 'anomaly', visual: 'Layered profile 0199 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0199' },
  { id: 'mega-fx-0200', label: 'Mega FX 0200', category: 'anomaly', visual: 'Layered profile 0200 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0200' },
  { id: 'mega-fx-0201', label: 'Mega FX 0201', category: 'anomaly', visual: 'Layered profile 0201 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0201' },
  { id: 'mega-fx-0202', label: 'Mega FX 0202', category: 'anomaly', visual: 'Layered profile 0202 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0202' },
  { id: 'mega-fx-0203', label: 'Mega FX 0203', category: 'anomaly', visual: 'Layered profile 0203 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0203' },
  { id: 'mega-fx-0204', label: 'Mega FX 0204', category: 'anomaly', visual: 'Layered profile 0204 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0204' },
  { id: 'mega-fx-0205', label: 'Mega FX 0205', category: 'anomaly', visual: 'Layered profile 0205 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0205' },
  { id: 'mega-fx-0206', label: 'Mega FX 0206', category: 'anomaly', visual: 'Layered profile 0206 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0206' },
  { id: 'mega-fx-0207', label: 'Mega FX 0207', category: 'anomaly', visual: 'Layered profile 0207 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0207' },
  { id: 'mega-fx-0208', label: 'Mega FX 0208', category: 'anomaly', visual: 'Layered profile 0208 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0208' },
  { id: 'mega-fx-0209', label: 'Mega FX 0209', category: 'anomaly', visual: 'Layered profile 0209 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0209' },
  { id: 'mega-fx-0210', label: 'Mega FX 0210', category: 'anomaly', visual: 'Layered profile 0210 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0210' },
  { id: 'mega-fx-0211', label: 'Mega FX 0211', category: 'anomaly', visual: 'Layered profile 0211 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0211' },
  { id: 'mega-fx-0212', label: 'Mega FX 0212', category: 'anomaly', visual: 'Layered profile 0212 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0212' },
  { id: 'mega-fx-0213', label: 'Mega FX 0213', category: 'anomaly', visual: 'Layered profile 0213 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0213' },
  { id: 'mega-fx-0214', label: 'Mega FX 0214', category: 'anomaly', visual: 'Layered profile 0214 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0214' },
  { id: 'mega-fx-0215', label: 'Mega FX 0215', category: 'anomaly', visual: 'Layered profile 0215 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0215' },
  { id: 'mega-fx-0216', label: 'Mega FX 0216', category: 'anomaly', visual: 'Layered profile 0216 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0216' },
  { id: 'mega-fx-0217', label: 'Mega FX 0217', category: 'anomaly', visual: 'Layered profile 0217 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0217' },
  { id: 'mega-fx-0218', label: 'Mega FX 0218', category: 'anomaly', visual: 'Layered profile 0218 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0218' },
  { id: 'mega-fx-0219', label: 'Mega FX 0219', category: 'anomaly', visual: 'Layered profile 0219 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0219' },
  { id: 'mega-fx-0220', label: 'Mega FX 0220', category: 'anomaly', visual: 'Layered profile 0220 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0220' },
  { id: 'mega-fx-0221', label: 'Mega FX 0221', category: 'anomaly', visual: 'Layered profile 0221 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0221' },
  { id: 'mega-fx-0222', label: 'Mega FX 0222', category: 'anomaly', visual: 'Layered profile 0222 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0222' },
  { id: 'mega-fx-0223', label: 'Mega FX 0223', category: 'anomaly', visual: 'Layered profile 0223 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0223' },
  { id: 'mega-fx-0224', label: 'Mega FX 0224', category: 'anomaly', visual: 'Layered profile 0224 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0224' },
  { id: 'mega-fx-0225', label: 'Mega FX 0225', category: 'anomaly', visual: 'Layered profile 0225 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0225' },
  { id: 'mega-fx-0226', label: 'Mega FX 0226', category: 'anomaly', visual: 'Layered profile 0226 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0226' },
  { id: 'mega-fx-0227', label: 'Mega FX 0227', category: 'anomaly', visual: 'Layered profile 0227 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0227' },
  { id: 'mega-fx-0228', label: 'Mega FX 0228', category: 'anomaly', visual: 'Layered profile 0228 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0228' },
  { id: 'mega-fx-0229', label: 'Mega FX 0229', category: 'anomaly', visual: 'Layered profile 0229 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0229' },
  { id: 'mega-fx-0230', label: 'Mega FX 0230', category: 'anomaly', visual: 'Layered profile 0230 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0230' },
  { id: 'mega-fx-0231', label: 'Mega FX 0231', category: 'anomaly', visual: 'Layered profile 0231 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0231' },
  { id: 'mega-fx-0232', label: 'Mega FX 0232', category: 'anomaly', visual: 'Layered profile 0232 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0232' },
  { id: 'mega-fx-0233', label: 'Mega FX 0233', category: 'anomaly', visual: 'Layered profile 0233 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0233' },
  { id: 'mega-fx-0234', label: 'Mega FX 0234', category: 'anomaly', visual: 'Layered profile 0234 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0234' },
  { id: 'mega-fx-0235', label: 'Mega FX 0235', category: 'anomaly', visual: 'Layered profile 0235 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0235' },
  { id: 'mega-fx-0236', label: 'Mega FX 0236', category: 'anomaly', visual: 'Layered profile 0236 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0236' },
  { id: 'mega-fx-0237', label: 'Mega FX 0237', category: 'anomaly', visual: 'Layered profile 0237 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0237' },
  { id: 'mega-fx-0238', label: 'Mega FX 0238', category: 'anomaly', visual: 'Layered profile 0238 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0238' },
  { id: 'mega-fx-0239', label: 'Mega FX 0239', category: 'anomaly', visual: 'Layered profile 0239 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0239' },
  { id: 'mega-fx-0240', label: 'Mega FX 0240', category: 'anomaly', visual: 'Layered profile 0240 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0240' },
  { id: 'mega-fx-0241', label: 'Mega FX 0241', category: 'anomaly', visual: 'Layered profile 0241 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0241' },
  { id: 'mega-fx-0242', label: 'Mega FX 0242', category: 'anomaly', visual: 'Layered profile 0242 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0242' },
  { id: 'mega-fx-0243', label: 'Mega FX 0243', category: 'anomaly', visual: 'Layered profile 0243 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0243' },
  { id: 'mega-fx-0244', label: 'Mega FX 0244', category: 'anomaly', visual: 'Layered profile 0244 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0244' },
  { id: 'mega-fx-0245', label: 'Mega FX 0245', category: 'anomaly', visual: 'Layered profile 0245 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0245' },
  { id: 'mega-fx-0246', label: 'Mega FX 0246', category: 'anomaly', visual: 'Layered profile 0246 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0246' },
  { id: 'mega-fx-0247', label: 'Mega FX 0247', category: 'anomaly', visual: 'Layered profile 0247 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0247' },
  { id: 'mega-fx-0248', label: 'Mega FX 0248', category: 'anomaly', visual: 'Layered profile 0248 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0248' },
  { id: 'mega-fx-0249', label: 'Mega FX 0249', category: 'anomaly', visual: 'Layered profile 0249 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0249' },
  { id: 'mega-fx-0250', label: 'Mega FX 0250', category: 'anomaly', visual: 'Layered profile 0250 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0250' },
  { id: 'mega-fx-0251', label: 'Mega FX 0251', category: 'anomaly', visual: 'Layered profile 0251 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0251' },
  { id: 'mega-fx-0252', label: 'Mega FX 0252', category: 'anomaly', visual: 'Layered profile 0252 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0252' },
  { id: 'mega-fx-0253', label: 'Mega FX 0253', category: 'anomaly', visual: 'Layered profile 0253 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0253' },
  { id: 'mega-fx-0254', label: 'Mega FX 0254', category: 'anomaly', visual: 'Layered profile 0254 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0254' },
  { id: 'mega-fx-0255', label: 'Mega FX 0255', category: 'anomaly', visual: 'Layered profile 0255 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0255' },
  { id: 'mega-fx-0256', label: 'Mega FX 0256', category: 'anomaly', visual: 'Layered profile 0256 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0256' },
  { id: 'mega-fx-0257', label: 'Mega FX 0257', category: 'anomaly', visual: 'Layered profile 0257 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0257' },
  { id: 'mega-fx-0258', label: 'Mega FX 0258', category: 'anomaly', visual: 'Layered profile 0258 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0258' },
  { id: 'mega-fx-0259', label: 'Mega FX 0259', category: 'anomaly', visual: 'Layered profile 0259 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0259' },
  { id: 'mega-fx-0260', label: 'Mega FX 0260', category: 'anomaly', visual: 'Layered profile 0260 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0260' },
  { id: 'mega-fx-0261', label: 'Mega FX 0261', category: 'anomaly', visual: 'Layered profile 0261 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0261' },
  { id: 'mega-fx-0262', label: 'Mega FX 0262', category: 'anomaly', visual: 'Layered profile 0262 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0262' },
  { id: 'mega-fx-0263', label: 'Mega FX 0263', category: 'anomaly', visual: 'Layered profile 0263 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0263' },
  { id: 'mega-fx-0264', label: 'Mega FX 0264', category: 'anomaly', visual: 'Layered profile 0264 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0264' },
  { id: 'mega-fx-0265', label: 'Mega FX 0265', category: 'anomaly', visual: 'Layered profile 0265 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0265' },
  { id: 'mega-fx-0266', label: 'Mega FX 0266', category: 'anomaly', visual: 'Layered profile 0266 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0266' },
  { id: 'mega-fx-0267', label: 'Mega FX 0267', category: 'anomaly', visual: 'Layered profile 0267 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0267' },
  { id: 'mega-fx-0268', label: 'Mega FX 0268', category: 'anomaly', visual: 'Layered profile 0268 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0268' },
  { id: 'mega-fx-0269', label: 'Mega FX 0269', category: 'anomaly', visual: 'Layered profile 0269 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0269' },
  { id: 'mega-fx-0270', label: 'Mega FX 0270', category: 'anomaly', visual: 'Layered profile 0270 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0270' },
  { id: 'mega-fx-0271', label: 'Mega FX 0271', category: 'anomaly', visual: 'Layered profile 0271 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0271' },
  { id: 'mega-fx-0272', label: 'Mega FX 0272', category: 'anomaly', visual: 'Layered profile 0272 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0272' },
  { id: 'mega-fx-0273', label: 'Mega FX 0273', category: 'anomaly', visual: 'Layered profile 0273 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0273' },
  { id: 'mega-fx-0274', label: 'Mega FX 0274', category: 'anomaly', visual: 'Layered profile 0274 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0274' },
  { id: 'mega-fx-0275', label: 'Mega FX 0275', category: 'anomaly', visual: 'Layered profile 0275 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0275' },
  { id: 'mega-fx-0276', label: 'Mega FX 0276', category: 'anomaly', visual: 'Layered profile 0276 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0276' },
  { id: 'mega-fx-0277', label: 'Mega FX 0277', category: 'anomaly', visual: 'Layered profile 0277 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0277' },
  { id: 'mega-fx-0278', label: 'Mega FX 0278', category: 'anomaly', visual: 'Layered profile 0278 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0278' },
  { id: 'mega-fx-0279', label: 'Mega FX 0279', category: 'anomaly', visual: 'Layered profile 0279 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0279' },
  { id: 'mega-fx-0280', label: 'Mega FX 0280', category: 'anomaly', visual: 'Layered profile 0280 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0280' },
  { id: 'mega-fx-0281', label: 'Mega FX 0281', category: 'anomaly', visual: 'Layered profile 0281 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0281' },
  { id: 'mega-fx-0282', label: 'Mega FX 0282', category: 'anomaly', visual: 'Layered profile 0282 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0282' },
  { id: 'mega-fx-0283', label: 'Mega FX 0283', category: 'anomaly', visual: 'Layered profile 0283 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0283' },
  { id: 'mega-fx-0284', label: 'Mega FX 0284', category: 'anomaly', visual: 'Layered profile 0284 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0284' },
  { id: 'mega-fx-0285', label: 'Mega FX 0285', category: 'anomaly', visual: 'Layered profile 0285 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0285' },
  { id: 'mega-fx-0286', label: 'Mega FX 0286', category: 'anomaly', visual: 'Layered profile 0286 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0286' },
  { id: 'mega-fx-0287', label: 'Mega FX 0287', category: 'anomaly', visual: 'Layered profile 0287 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0287' },
  { id: 'mega-fx-0288', label: 'Mega FX 0288', category: 'anomaly', visual: 'Layered profile 0288 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0288' },
  { id: 'mega-fx-0289', label: 'Mega FX 0289', category: 'anomaly', visual: 'Layered profile 0289 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0289' },
  { id: 'mega-fx-0290', label: 'Mega FX 0290', category: 'anomaly', visual: 'Layered profile 0290 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0290' },
  { id: 'mega-fx-0291', label: 'Mega FX 0291', category: 'anomaly', visual: 'Layered profile 0291 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0291' },
  { id: 'mega-fx-0292', label: 'Mega FX 0292', category: 'anomaly', visual: 'Layered profile 0292 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0292' },
  { id: 'mega-fx-0293', label: 'Mega FX 0293', category: 'anomaly', visual: 'Layered profile 0293 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0293' },
  { id: 'mega-fx-0294', label: 'Mega FX 0294', category: 'anomaly', visual: 'Layered profile 0294 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0294' },
  { id: 'mega-fx-0295', label: 'Mega FX 0295', category: 'anomaly', visual: 'Layered profile 0295 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0295' },
  { id: 'mega-fx-0296', label: 'Mega FX 0296', category: 'anomaly', visual: 'Layered profile 0296 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0296' },
  { id: 'mega-fx-0297', label: 'Mega FX 0297', category: 'anomaly', visual: 'Layered profile 0297 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0297' },
  { id: 'mega-fx-0298', label: 'Mega FX 0298', category: 'anomaly', visual: 'Layered profile 0298 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0298' },
  { id: 'mega-fx-0299', label: 'Mega FX 0299', category: 'anomaly', visual: 'Layered profile 0299 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0299' },
  { id: 'mega-fx-0300', label: 'Mega FX 0300', category: 'anomaly', visual: 'Layered profile 0300 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0300' },
  { id: 'mega-fx-0301', label: 'Mega FX 0301', category: 'anomaly', visual: 'Layered profile 0301 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0301' },
  { id: 'mega-fx-0302', label: 'Mega FX 0302', category: 'anomaly', visual: 'Layered profile 0302 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0302' },
  { id: 'mega-fx-0303', label: 'Mega FX 0303', category: 'anomaly', visual: 'Layered profile 0303 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0303' },
  { id: 'mega-fx-0304', label: 'Mega FX 0304', category: 'anomaly', visual: 'Layered profile 0304 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0304' },
  { id: 'mega-fx-0305', label: 'Mega FX 0305', category: 'anomaly', visual: 'Layered profile 0305 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0305' },
  { id: 'mega-fx-0306', label: 'Mega FX 0306', category: 'anomaly', visual: 'Layered profile 0306 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0306' },
  { id: 'mega-fx-0307', label: 'Mega FX 0307', category: 'anomaly', visual: 'Layered profile 0307 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0307' },
  { id: 'mega-fx-0308', label: 'Mega FX 0308', category: 'anomaly', visual: 'Layered profile 0308 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0308' },
  { id: 'mega-fx-0309', label: 'Mega FX 0309', category: 'anomaly', visual: 'Layered profile 0309 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0309' },
  { id: 'mega-fx-0310', label: 'Mega FX 0310', category: 'anomaly', visual: 'Layered profile 0310 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0310' },
  { id: 'mega-fx-0311', label: 'Mega FX 0311', category: 'anomaly', visual: 'Layered profile 0311 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0311' },
  { id: 'mega-fx-0312', label: 'Mega FX 0312', category: 'anomaly', visual: 'Layered profile 0312 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0312' },
  { id: 'mega-fx-0313', label: 'Mega FX 0313', category: 'anomaly', visual: 'Layered profile 0313 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0313' },
  { id: 'mega-fx-0314', label: 'Mega FX 0314', category: 'anomaly', visual: 'Layered profile 0314 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0314' },
  { id: 'mega-fx-0315', label: 'Mega FX 0315', category: 'anomaly', visual: 'Layered profile 0315 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0315' },
  { id: 'mega-fx-0316', label: 'Mega FX 0316', category: 'anomaly', visual: 'Layered profile 0316 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0316' },
  { id: 'mega-fx-0317', label: 'Mega FX 0317', category: 'anomaly', visual: 'Layered profile 0317 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0317' },
  { id: 'mega-fx-0318', label: 'Mega FX 0318', category: 'anomaly', visual: 'Layered profile 0318 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0318' },
  { id: 'mega-fx-0319', label: 'Mega FX 0319', category: 'anomaly', visual: 'Layered profile 0319 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0319' },
  { id: 'mega-fx-0320', label: 'Mega FX 0320', category: 'anomaly', visual: 'Layered profile 0320 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0320' },
  { id: 'mega-fx-0321', label: 'Mega FX 0321', category: 'anomaly', visual: 'Layered profile 0321 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0321' },
  { id: 'mega-fx-0322', label: 'Mega FX 0322', category: 'anomaly', visual: 'Layered profile 0322 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0322' },
  { id: 'mega-fx-0323', label: 'Mega FX 0323', category: 'anomaly', visual: 'Layered profile 0323 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0323' },
  { id: 'mega-fx-0324', label: 'Mega FX 0324', category: 'anomaly', visual: 'Layered profile 0324 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0324' },
  { id: 'mega-fx-0325', label: 'Mega FX 0325', category: 'anomaly', visual: 'Layered profile 0325 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0325' },
  { id: 'mega-fx-0326', label: 'Mega FX 0326', category: 'anomaly', visual: 'Layered profile 0326 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0326' },
  { id: 'mega-fx-0327', label: 'Mega FX 0327', category: 'anomaly', visual: 'Layered profile 0327 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0327' },
  { id: 'mega-fx-0328', label: 'Mega FX 0328', category: 'anomaly', visual: 'Layered profile 0328 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0328' },
  { id: 'mega-fx-0329', label: 'Mega FX 0329', category: 'anomaly', visual: 'Layered profile 0329 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0329' },
  { id: 'mega-fx-0330', label: 'Mega FX 0330', category: 'anomaly', visual: 'Layered profile 0330 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0330' },
  { id: 'mega-fx-0331', label: 'Mega FX 0331', category: 'anomaly', visual: 'Layered profile 0331 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0331' },
  { id: 'mega-fx-0332', label: 'Mega FX 0332', category: 'anomaly', visual: 'Layered profile 0332 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0332' },
  { id: 'mega-fx-0333', label: 'Mega FX 0333', category: 'anomaly', visual: 'Layered profile 0333 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0333' },
  { id: 'mega-fx-0334', label: 'Mega FX 0334', category: 'anomaly', visual: 'Layered profile 0334 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0334' },
  { id: 'mega-fx-0335', label: 'Mega FX 0335', category: 'anomaly', visual: 'Layered profile 0335 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0335' },
  { id: 'mega-fx-0336', label: 'Mega FX 0336', category: 'anomaly', visual: 'Layered profile 0336 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0336' },
  { id: 'mega-fx-0337', label: 'Mega FX 0337', category: 'anomaly', visual: 'Layered profile 0337 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0337' },
  { id: 'mega-fx-0338', label: 'Mega FX 0338', category: 'anomaly', visual: 'Layered profile 0338 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0338' },
  { id: 'mega-fx-0339', label: 'Mega FX 0339', category: 'anomaly', visual: 'Layered profile 0339 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0339' },
  { id: 'mega-fx-0340', label: 'Mega FX 0340', category: 'anomaly', visual: 'Layered profile 0340 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0340' },
  { id: 'mega-fx-0341', label: 'Mega FX 0341', category: 'anomaly', visual: 'Layered profile 0341 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0341' },
  { id: 'mega-fx-0342', label: 'Mega FX 0342', category: 'anomaly', visual: 'Layered profile 0342 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0342' },
  { id: 'mega-fx-0343', label: 'Mega FX 0343', category: 'anomaly', visual: 'Layered profile 0343 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0343' },
  { id: 'mega-fx-0344', label: 'Mega FX 0344', category: 'anomaly', visual: 'Layered profile 0344 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0344' },
  { id: 'mega-fx-0345', label: 'Mega FX 0345', category: 'anomaly', visual: 'Layered profile 0345 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0345' },
  { id: 'mega-fx-0346', label: 'Mega FX 0346', category: 'anomaly', visual: 'Layered profile 0346 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0346' },
  { id: 'mega-fx-0347', label: 'Mega FX 0347', category: 'anomaly', visual: 'Layered profile 0347 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0347' },
  { id: 'mega-fx-0348', label: 'Mega FX 0348', category: 'anomaly', visual: 'Layered profile 0348 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0348' },
  { id: 'mega-fx-0349', label: 'Mega FX 0349', category: 'anomaly', visual: 'Layered profile 0349 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0349' },
  { id: 'mega-fx-0350', label: 'Mega FX 0350', category: 'anomaly', visual: 'Layered profile 0350 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0350' },
  { id: 'mega-fx-0351', label: 'Mega FX 0351', category: 'anomaly', visual: 'Layered profile 0351 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0351' },
  { id: 'mega-fx-0352', label: 'Mega FX 0352', category: 'anomaly', visual: 'Layered profile 0352 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0352' },
  { id: 'mega-fx-0353', label: 'Mega FX 0353', category: 'anomaly', visual: 'Layered profile 0353 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0353' },
  { id: 'mega-fx-0354', label: 'Mega FX 0354', category: 'anomaly', visual: 'Layered profile 0354 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0354' },
  { id: 'mega-fx-0355', label: 'Mega FX 0355', category: 'anomaly', visual: 'Layered profile 0355 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0355' },
  { id: 'mega-fx-0356', label: 'Mega FX 0356', category: 'anomaly', visual: 'Layered profile 0356 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0356' },
  { id: 'mega-fx-0357', label: 'Mega FX 0357', category: 'anomaly', visual: 'Layered profile 0357 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0357' },
  { id: 'mega-fx-0358', label: 'Mega FX 0358', category: 'anomaly', visual: 'Layered profile 0358 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0358' },
  { id: 'mega-fx-0359', label: 'Mega FX 0359', category: 'anomaly', visual: 'Layered profile 0359 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0359' },
  { id: 'mega-fx-0360', label: 'Mega FX 0360', category: 'anomaly', visual: 'Layered profile 0360 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0360' },
  { id: 'mega-fx-0361', label: 'Mega FX 0361', category: 'anomaly', visual: 'Layered profile 0361 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0361' },
  { id: 'mega-fx-0362', label: 'Mega FX 0362', category: 'anomaly', visual: 'Layered profile 0362 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0362' },
  { id: 'mega-fx-0363', label: 'Mega FX 0363', category: 'anomaly', visual: 'Layered profile 0363 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0363' },
  { id: 'mega-fx-0364', label: 'Mega FX 0364', category: 'anomaly', visual: 'Layered profile 0364 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0364' },
  { id: 'mega-fx-0365', label: 'Mega FX 0365', category: 'anomaly', visual: 'Layered profile 0365 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0365' },
  { id: 'mega-fx-0366', label: 'Mega FX 0366', category: 'anomaly', visual: 'Layered profile 0366 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0366' },
  { id: 'mega-fx-0367', label: 'Mega FX 0367', category: 'anomaly', visual: 'Layered profile 0367 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0367' },
  { id: 'mega-fx-0368', label: 'Mega FX 0368', category: 'anomaly', visual: 'Layered profile 0368 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0368' },
  { id: 'mega-fx-0369', label: 'Mega FX 0369', category: 'anomaly', visual: 'Layered profile 0369 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0369' },
  { id: 'mega-fx-0370', label: 'Mega FX 0370', category: 'anomaly', visual: 'Layered profile 0370 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0370' },
  { id: 'mega-fx-0371', label: 'Mega FX 0371', category: 'anomaly', visual: 'Layered profile 0371 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0371' },
  { id: 'mega-fx-0372', label: 'Mega FX 0372', category: 'anomaly', visual: 'Layered profile 0372 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0372' },
  { id: 'mega-fx-0373', label: 'Mega FX 0373', category: 'anomaly', visual: 'Layered profile 0373 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0373' },
  { id: 'mega-fx-0374', label: 'Mega FX 0374', category: 'anomaly', visual: 'Layered profile 0374 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0374' },
  { id: 'mega-fx-0375', label: 'Mega FX 0375', category: 'anomaly', visual: 'Layered profile 0375 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0375' },
  { id: 'mega-fx-0376', label: 'Mega FX 0376', category: 'anomaly', visual: 'Layered profile 0376 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0376' },
  { id: 'mega-fx-0377', label: 'Mega FX 0377', category: 'anomaly', visual: 'Layered profile 0377 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0377' },
  { id: 'mega-fx-0378', label: 'Mega FX 0378', category: 'anomaly', visual: 'Layered profile 0378 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0378' },
  { id: 'mega-fx-0379', label: 'Mega FX 0379', category: 'anomaly', visual: 'Layered profile 0379 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0379' },
  { id: 'mega-fx-0380', label: 'Mega FX 0380', category: 'anomaly', visual: 'Layered profile 0380 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0380' },
  { id: 'mega-fx-0381', label: 'Mega FX 0381', category: 'anomaly', visual: 'Layered profile 0381 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0381' },
  { id: 'mega-fx-0382', label: 'Mega FX 0382', category: 'anomaly', visual: 'Layered profile 0382 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0382' },
  { id: 'mega-fx-0383', label: 'Mega FX 0383', category: 'anomaly', visual: 'Layered profile 0383 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0383' },
  { id: 'mega-fx-0384', label: 'Mega FX 0384', category: 'anomaly', visual: 'Layered profile 0384 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0384' },
  { id: 'mega-fx-0385', label: 'Mega FX 0385', category: 'anomaly', visual: 'Layered profile 0385 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0385' },
  { id: 'mega-fx-0386', label: 'Mega FX 0386', category: 'anomaly', visual: 'Layered profile 0386 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0386' },
  { id: 'mega-fx-0387', label: 'Mega FX 0387', category: 'anomaly', visual: 'Layered profile 0387 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0387' },
  { id: 'mega-fx-0388', label: 'Mega FX 0388', category: 'anomaly', visual: 'Layered profile 0388 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0388' },
  { id: 'mega-fx-0389', label: 'Mega FX 0389', category: 'anomaly', visual: 'Layered profile 0389 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0389' },
  { id: 'mega-fx-0390', label: 'Mega FX 0390', category: 'anomaly', visual: 'Layered profile 0390 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0390' },
  { id: 'mega-fx-0391', label: 'Mega FX 0391', category: 'anomaly', visual: 'Layered profile 0391 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0391' },
  { id: 'mega-fx-0392', label: 'Mega FX 0392', category: 'anomaly', visual: 'Layered profile 0392 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0392' },
  { id: 'mega-fx-0393', label: 'Mega FX 0393', category: 'anomaly', visual: 'Layered profile 0393 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0393' },
  { id: 'mega-fx-0394', label: 'Mega FX 0394', category: 'anomaly', visual: 'Layered profile 0394 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0394' },
  { id: 'mega-fx-0395', label: 'Mega FX 0395', category: 'anomaly', visual: 'Layered profile 0395 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0395' },
  { id: 'mega-fx-0396', label: 'Mega FX 0396', category: 'anomaly', visual: 'Layered profile 0396 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0396' },
  { id: 'mega-fx-0397', label: 'Mega FX 0397', category: 'anomaly', visual: 'Layered profile 0397 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0397' },
  { id: 'mega-fx-0398', label: 'Mega FX 0398', category: 'anomaly', visual: 'Layered profile 0398 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0398' },
  { id: 'mega-fx-0399', label: 'Mega FX 0399', category: 'anomaly', visual: 'Layered profile 0399 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0399' },
  { id: 'mega-fx-0400', label: 'Mega FX 0400', category: 'anomaly', visual: 'Layered profile 0400 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0400' },
  { id: 'mega-fx-0401', label: 'Mega FX 0401', category: 'anomaly', visual: 'Layered profile 0401 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0401' },
  { id: 'mega-fx-0402', label: 'Mega FX 0402', category: 'anomaly', visual: 'Layered profile 0402 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0402' },
  { id: 'mega-fx-0403', label: 'Mega FX 0403', category: 'anomaly', visual: 'Layered profile 0403 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0403' },
  { id: 'mega-fx-0404', label: 'Mega FX 0404', category: 'anomaly', visual: 'Layered profile 0404 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0404' },
  { id: 'mega-fx-0405', label: 'Mega FX 0405', category: 'anomaly', visual: 'Layered profile 0405 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0405' },
  { id: 'mega-fx-0406', label: 'Mega FX 0406', category: 'anomaly', visual: 'Layered profile 0406 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0406' },
  { id: 'mega-fx-0407', label: 'Mega FX 0407', category: 'anomaly', visual: 'Layered profile 0407 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0407' },
  { id: 'mega-fx-0408', label: 'Mega FX 0408', category: 'anomaly', visual: 'Layered profile 0408 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0408' },
  { id: 'mega-fx-0409', label: 'Mega FX 0409', category: 'anomaly', visual: 'Layered profile 0409 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0409' },
  { id: 'mega-fx-0410', label: 'Mega FX 0410', category: 'anomaly', visual: 'Layered profile 0410 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0410' },
  { id: 'mega-fx-0411', label: 'Mega FX 0411', category: 'anomaly', visual: 'Layered profile 0411 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0411' },
  { id: 'mega-fx-0412', label: 'Mega FX 0412', category: 'anomaly', visual: 'Layered profile 0412 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0412' },
  { id: 'mega-fx-0413', label: 'Mega FX 0413', category: 'anomaly', visual: 'Layered profile 0413 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0413' },
  { id: 'mega-fx-0414', label: 'Mega FX 0414', category: 'anomaly', visual: 'Layered profile 0414 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0414' },
  { id: 'mega-fx-0415', label: 'Mega FX 0415', category: 'anomaly', visual: 'Layered profile 0415 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0415' },
  { id: 'mega-fx-0416', label: 'Mega FX 0416', category: 'anomaly', visual: 'Layered profile 0416 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0416' },
  { id: 'mega-fx-0417', label: 'Mega FX 0417', category: 'anomaly', visual: 'Layered profile 0417 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0417' },
  { id: 'mega-fx-0418', label: 'Mega FX 0418', category: 'anomaly', visual: 'Layered profile 0418 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0418' },
  { id: 'mega-fx-0419', label: 'Mega FX 0419', category: 'anomaly', visual: 'Layered profile 0419 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0419' },
  { id: 'mega-fx-0420', label: 'Mega FX 0420', category: 'anomaly', visual: 'Layered profile 0420 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0420' },
  { id: 'mega-fx-0421', label: 'Mega FX 0421', category: 'anomaly', visual: 'Layered profile 0421 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0421' },
  { id: 'mega-fx-0422', label: 'Mega FX 0422', category: 'anomaly', visual: 'Layered profile 0422 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0422' },
  { id: 'mega-fx-0423', label: 'Mega FX 0423', category: 'anomaly', visual: 'Layered profile 0423 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0423' },
  { id: 'mega-fx-0424', label: 'Mega FX 0424', category: 'anomaly', visual: 'Layered profile 0424 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0424' },
  { id: 'mega-fx-0425', label: 'Mega FX 0425', category: 'anomaly', visual: 'Layered profile 0425 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0425' },
  { id: 'mega-fx-0426', label: 'Mega FX 0426', category: 'anomaly', visual: 'Layered profile 0426 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0426' },
  { id: 'mega-fx-0427', label: 'Mega FX 0427', category: 'anomaly', visual: 'Layered profile 0427 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0427' },
  { id: 'mega-fx-0428', label: 'Mega FX 0428', category: 'anomaly', visual: 'Layered profile 0428 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0428' },
  { id: 'mega-fx-0429', label: 'Mega FX 0429', category: 'anomaly', visual: 'Layered profile 0429 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0429' },
  { id: 'mega-fx-0430', label: 'Mega FX 0430', category: 'anomaly', visual: 'Layered profile 0430 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0430' },
  { id: 'mega-fx-0431', label: 'Mega FX 0431', category: 'anomaly', visual: 'Layered profile 0431 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0431' },
  { id: 'mega-fx-0432', label: 'Mega FX 0432', category: 'anomaly', visual: 'Layered profile 0432 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0432' },
  { id: 'mega-fx-0433', label: 'Mega FX 0433', category: 'anomaly', visual: 'Layered profile 0433 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0433' },
  { id: 'mega-fx-0434', label: 'Mega FX 0434', category: 'anomaly', visual: 'Layered profile 0434 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0434' },
  { id: 'mega-fx-0435', label: 'Mega FX 0435', category: 'anomaly', visual: 'Layered profile 0435 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0435' },
  { id: 'mega-fx-0436', label: 'Mega FX 0436', category: 'anomaly', visual: 'Layered profile 0436 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0436' },
  { id: 'mega-fx-0437', label: 'Mega FX 0437', category: 'anomaly', visual: 'Layered profile 0437 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0437' },
  { id: 'mega-fx-0438', label: 'Mega FX 0438', category: 'anomaly', visual: 'Layered profile 0438 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0438' },
  { id: 'mega-fx-0439', label: 'Mega FX 0439', category: 'anomaly', visual: 'Layered profile 0439 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0439' },
  { id: 'mega-fx-0440', label: 'Mega FX 0440', category: 'anomaly', visual: 'Layered profile 0440 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0440' },
  { id: 'mega-fx-0441', label: 'Mega FX 0441', category: 'anomaly', visual: 'Layered profile 0441 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0441' },
  { id: 'mega-fx-0442', label: 'Mega FX 0442', category: 'anomaly', visual: 'Layered profile 0442 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0442' },
  { id: 'mega-fx-0443', label: 'Mega FX 0443', category: 'anomaly', visual: 'Layered profile 0443 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0443' },
  { id: 'mega-fx-0444', label: 'Mega FX 0444', category: 'anomaly', visual: 'Layered profile 0444 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0444' },
  { id: 'mega-fx-0445', label: 'Mega FX 0445', category: 'anomaly', visual: 'Layered profile 0445 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0445' },
  { id: 'mega-fx-0446', label: 'Mega FX 0446', category: 'anomaly', visual: 'Layered profile 0446 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0446' },
  { id: 'mega-fx-0447', label: 'Mega FX 0447', category: 'anomaly', visual: 'Layered profile 0447 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0447' },
  { id: 'mega-fx-0448', label: 'Mega FX 0448', category: 'anomaly', visual: 'Layered profile 0448 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0448' },
  { id: 'mega-fx-0449', label: 'Mega FX 0449', category: 'anomaly', visual: 'Layered profile 0449 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0449' },
  { id: 'mega-fx-0450', label: 'Mega FX 0450', category: 'anomaly', visual: 'Layered profile 0450 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0450' },
  { id: 'mega-fx-0451', label: 'Mega FX 0451', category: 'anomaly', visual: 'Layered profile 0451 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0451' },
  { id: 'mega-fx-0452', label: 'Mega FX 0452', category: 'anomaly', visual: 'Layered profile 0452 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0452' },
  { id: 'mega-fx-0453', label: 'Mega FX 0453', category: 'anomaly', visual: 'Layered profile 0453 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0453' },
  { id: 'mega-fx-0454', label: 'Mega FX 0454', category: 'anomaly', visual: 'Layered profile 0454 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0454' },
  { id: 'mega-fx-0455', label: 'Mega FX 0455', category: 'anomaly', visual: 'Layered profile 0455 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0455' },
  { id: 'mega-fx-0456', label: 'Mega FX 0456', category: 'anomaly', visual: 'Layered profile 0456 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0456' },
  { id: 'mega-fx-0457', label: 'Mega FX 0457', category: 'anomaly', visual: 'Layered profile 0457 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0457' },
  { id: 'mega-fx-0458', label: 'Mega FX 0458', category: 'anomaly', visual: 'Layered profile 0458 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0458' },
  { id: 'mega-fx-0459', label: 'Mega FX 0459', category: 'anomaly', visual: 'Layered profile 0459 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0459' },
  { id: 'mega-fx-0460', label: 'Mega FX 0460', category: 'anomaly', visual: 'Layered profile 0460 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0460' },
  { id: 'mega-fx-0461', label: 'Mega FX 0461', category: 'anomaly', visual: 'Layered profile 0461 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0461' },
  { id: 'mega-fx-0462', label: 'Mega FX 0462', category: 'anomaly', visual: 'Layered profile 0462 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0462' },
  { id: 'mega-fx-0463', label: 'Mega FX 0463', category: 'anomaly', visual: 'Layered profile 0463 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0463' },
  { id: 'mega-fx-0464', label: 'Mega FX 0464', category: 'anomaly', visual: 'Layered profile 0464 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0464' },
  { id: 'mega-fx-0465', label: 'Mega FX 0465', category: 'anomaly', visual: 'Layered profile 0465 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0465' },
  { id: 'mega-fx-0466', label: 'Mega FX 0466', category: 'anomaly', visual: 'Layered profile 0466 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0466' },
  { id: 'mega-fx-0467', label: 'Mega FX 0467', category: 'anomaly', visual: 'Layered profile 0467 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0467' },
  { id: 'mega-fx-0468', label: 'Mega FX 0468', category: 'anomaly', visual: 'Layered profile 0468 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0468' },
  { id: 'mega-fx-0469', label: 'Mega FX 0469', category: 'anomaly', visual: 'Layered profile 0469 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0469' },
  { id: 'mega-fx-0470', label: 'Mega FX 0470', category: 'anomaly', visual: 'Layered profile 0470 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0470' },
  { id: 'mega-fx-0471', label: 'Mega FX 0471', category: 'anomaly', visual: 'Layered profile 0471 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0471' },
  { id: 'mega-fx-0472', label: 'Mega FX 0472', category: 'anomaly', visual: 'Layered profile 0472 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0472' },
  { id: 'mega-fx-0473', label: 'Mega FX 0473', category: 'anomaly', visual: 'Layered profile 0473 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0473' },
  { id: 'mega-fx-0474', label: 'Mega FX 0474', category: 'anomaly', visual: 'Layered profile 0474 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0474' },
  { id: 'mega-fx-0475', label: 'Mega FX 0475', category: 'anomaly', visual: 'Layered profile 0475 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0475' },
  { id: 'mega-fx-0476', label: 'Mega FX 0476', category: 'anomaly', visual: 'Layered profile 0476 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0476' },
  { id: 'mega-fx-0477', label: 'Mega FX 0477', category: 'anomaly', visual: 'Layered profile 0477 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0477' },
  { id: 'mega-fx-0478', label: 'Mega FX 0478', category: 'anomaly', visual: 'Layered profile 0478 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0478' },
  { id: 'mega-fx-0479', label: 'Mega FX 0479', category: 'anomaly', visual: 'Layered profile 0479 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0479' },
  { id: 'mega-fx-0480', label: 'Mega FX 0480', category: 'anomaly', visual: 'Layered profile 0480 combining core glow, directional flow, and distinct edge noise.', signature: 'sig-0480' },
];

for (let i = MEGA_SHIP_CATALOG_V2.length - 1; i >= 0; i--) {
  if (isAtlasShipId(MEGA_SHIP_CATALOG_V2[i].id)) {
    MEGA_SHIP_CATALOG_V2.splice(i, 1);
  }
}
for (const megaShip of MEGA_SHIP_CATALOG_V2) {
  if (!isAtlasShipId(megaShip.id) && !shipLoadouts[megaShip.id]) {
    shipLoadouts[megaShip.id] = megaShip;
  }
}
for (const shipId of Object.keys(shipLoadouts)) {
  if (isAtlasShipId(shipId)) {
    delete shipLoadouts[shipId];
  }
}
state.unlockedShips = state.unlockedShips.filter((shipId) => !isAtlasShipId(shipId));
localStorage.setItem("orbital-unlocked-ships", JSON.stringify(state.unlockedShips));
if (isAtlasShipId(state.shipKey) || !shipLoadouts[state.shipKey]) {
  state.shipKey = "striker";
}
if (typeof STELLAR_CODEX_ENTRIES !== 'undefined') {
  STELLAR_CODEX_ENTRIES.push(...MEGA_CODEX_APPENDIX_V2);
}
if (typeof ADVANCED_CHALLENGE_PRESETS !== 'undefined') {
  ADVANCED_CHALLENGE_PRESETS.push(...MEGA_CHALLENGE_PRESETS_V2);
}
if (typeof ADVANCED_FX_PROFILES !== 'undefined') {
  ADVANCED_FX_PROFILES.push(...MEGA_FX_PROFILES_V2);
}
