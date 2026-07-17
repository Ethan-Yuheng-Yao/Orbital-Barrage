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
const campaignCompletePanel = document.getElementById("campaignCompletePanel");
const campaignCompleteTitle = document.getElementById("campaignCompleteTitle");
const campaignCompleteDetails = document.getElementById("campaignCompleteDetails");
const campaignCompleteContinueButton = document.getElementById("campaignCompleteContinueButton");
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
const tutorialArrow = document.getElementById("tutorialArrow");
const tutorialKeyLayout = document.getElementById("tutorialKeyLayout");
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
const endlessDifficultyScroll = document.getElementById("endlessDifficultyScroll");
const endlessDifficultyNext = document.getElementById("endlessDifficultyNext");
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
const campaignConstellation = document.getElementById("campaignConstellation");
const campaignSwitchShipButton = document.getElementById("campaignSwitchShipButton");
const campaignShipPanel = document.getElementById("campaignShipPanel");
const campaignShipCards = document.getElementById("campaignShipCards");
const campaignShipCloseButton = document.getElementById("campaignShipCloseButton");
const achievementsButton = document.getElementById("achievementsButton");
const achievementsPanel = document.getElementById("achievementsPanel");
const achievementsCloseButton = document.getElementById("achievementsCloseButton");
const achievementsSummary = document.getElementById("achievementsSummary");
const achievementsList = document.getElementById("achievementsList");
const achievementToastContainer = document.getElementById("achievementToastContainer");
const musicVolume = document.getElementById("musicVolume");
const sfxVolume = document.getElementById("sfxVolume");
const quitToMenuButton = document.getElementById("quitToMenuButton");
const advancedCodexButton = document.getElementById("advancedCodexButton");
const advancedChallengeButton = document.getElementById("advancedChallengeButton");
const advancedFxLabButton = document.getElementById("advancedFxLabButton");
const advancedMapRegistryButton = document.getElementById("advancedMapRegistryButton");

const input = {
  keys: new Set(),
  codes: new Set(),
  mouse: { x: canvas.width / 2, y: canvas.height / 2, down: false },
};

const config = {
  width: canvas.width,
  height: canvas.height,
};
const BASE_VIEWPORT_WIDTH = 960;
const BASE_VIEWPORT_HEIGHT = 600;
const BASE_TOP_HUD_SAFE_Y = 96;
const BASE_PLAYER_SHIP_EXTENT_Y = 28;
let TOP_HUD_SAFE_Y = BASE_TOP_HUD_SAFE_Y;
let PLAYER_SHIP_EXTENT_Y = BASE_PLAYER_SHIP_EXTENT_Y;

function viewportScale() {
  return Math.max(
    0.6,
    Math.min(
      config.width / BASE_VIEWPORT_WIDTH,
      config.height / BASE_VIEWPORT_HEIGHT
    )
  );
}

function scaleByViewport(value) {
  return value * viewportScale();
}

function syncCanvasToDisplaySize() {
  const stage = canvas.closest(".game-stage");
  if (!stage) return;
  const rect = stage.getBoundingClientRect();
  if (!rect.width || !rect.height) return;
  const width = Math.max(320, Math.round(rect.width));
  const height = Math.max(200, Math.round((width * BASE_VIEWPORT_HEIGHT) / BASE_VIEWPORT_WIDTH));
  if (canvas.width === width && canvas.height === height) return;
  canvas.width = width;
  canvas.height = height;
  config.width = width;
  config.height = height;
  TOP_HUD_SAFE_Y = Math.round(BASE_TOP_HUD_SAFE_Y * (config.height / BASE_VIEWPORT_HEIGHT));
  PLAYER_SHIP_EXTENT_Y = Math.round(BASE_PLAYER_SHIP_EXTENT_Y * (config.height / BASE_VIEWPORT_HEIGHT));
}

syncCanvasToDisplaySize();
window.addEventListener("resize", syncCanvasToDisplaySize);

const TUTORIAL_COMPLETED_KEY = "orbital-tutorial-completed";
const MOVEMENT_KEYS_STORAGE_KEY = "orbital-movement-keys";
const detectDefaultMovementKeys = () => {
  const lang = (navigator.language || "").toLowerCase();
  if (lang.startsWith("fr")) {
    return { up: "z", left: "q", down: "s", right: "d" };
  }
  return { up: "w", left: "a", down: "s", right: "d" };
};
const sanitizeMovementKeys = (keys) => {
  const fallback = detectDefaultMovementKeys();
  if (!keys || typeof keys !== "object") return fallback;
  const read = (k, def) => (typeof keys[k] === "string" && keys[k].trim() ? keys[k].toLowerCase() : def);
  return {
    up: read("up", fallback.up),
    left: read("left", fallback.left),
    down: read("down", fallback.down),
    right: read("right", fallback.right),
  };
};
const loadMovementKeys = () => {
  try {
    return sanitizeMovementKeys(JSON.parse(localStorage.getItem(MOVEMENT_KEYS_STORAGE_KEY) || "null"));
  } catch (_err) {
    return detectDefaultMovementKeys();
  }
};

function clampEnemyBelowHud(enemy) {
  if (!enemy) return;
  const minCenterY = TOP_HUD_SAFE_Y + enemy.size;
  if (enemy.y < minCenterY) enemy.y = minCenterY;
}

function playerMinY() {
  return TOP_HUD_SAFE_Y + PLAYER_SHIP_EXTENT_Y;
}

// Extracted: modes/ships/advanced data setup
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
      const prevShield = player.shield;
      player.shield = Math.min(player.shield + 45, player.maxShield);
      recordShieldRegen(player.shield - prevShield);
      player.shieldRegenMultiplier *= 1.6;
    },
  },
  {
    id: "nanites",
    name: "Nanite Plating",
    desc: "+55 hull integrity & heavy heal",
    apply: (player) => {
      player.maxHp += 55;
      const prevHp = player.hp;
      player.hp = Math.min(player.hp + 85, player.maxHp);
      recordHealthRegen(player.hp - prevHp);
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
      const prevEnergy = player.energy;
      player.energy = Math.min(player.energy + 45, player.maxEnergy);
      recordEnergyRegen(player.energy - prevEnergy);
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

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.vx = rng(-80, 80);
    this.vy = rng(-80, 80);
    this.life = rng(0.3, 0.8);
    this.color = color;
    this.size = scaleByViewport(2);
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

const drawFriendlyProjectileSilhouette = (ctx, bullet) => {
  if (!bullet.friendly) return false;
  if (bullet.voidwalkerPhaseBlade) {
    const ang = Math.atan2(bullet.vy, bullet.vx);
    const s = Math.max(bullet.size || 14, 13);
    const len = s * 6.6;
    const halfW = Math.max(15, s * 1.12);
    ctx.save();
    ctx.translate(bullet.x, bullet.y);
    ctx.rotate(ang);
    ctx.globalAlpha = bullet.life < 0.22 ? clamp(bullet.life / 0.22, 0, 1) : 1;
    ctx.lineCap = "round";
    const g = ctx.createLinearGradient(-len, 0, len, 0);
    g.addColorStop(0, "#0c0018");
    g.addColorStop(0.22, "#3a0878");
    g.addColorStop(0.42, "#6510b8");
    g.addColorStop(0.58, "#9a28e8");
    g.addColorStop(0.74, "#d070ff");
    g.addColorStop(0.88, "#f8e8ff");
    g.addColorStop(1, "#7a18c8");
    ctx.strokeStyle = g;
    ctx.lineWidth = halfW * 2.1;
    ctx.shadowBlur = 36;
    ctx.shadowColor = "#7020e0";
    ctx.beginPath();
    ctx.moveTo(-len * 0.95, 0);
    ctx.lineTo(len * 0.95, 0);
    ctx.stroke();
    ctx.strokeStyle = "rgba(255, 252, 255, 0.9)";
    ctx.lineWidth = Math.max(3.2, halfW * 0.34);
    ctx.shadowBlur = 14;
    ctx.shadowColor = "#e8c8ff";
    ctx.beginPath();
    ctx.moveTo(-len * 0.9, 0);
    ctx.lineTo(len * 0.9, 0);
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.restore();
    return true;
  }
  if (bullet.weaponBuffEnhanced && !bullet.voidwalkerRiftBlade) {
    const ang0 = Math.atan2(bullet.vy, bullet.vx);
    const s0 = (bullet.size || 4) * 1.05;
    ctx.save();
    ctx.translate(bullet.x, bullet.y);
    ctx.rotate(ang0);
    ctx.globalAlpha = bullet.life < 0.25 ? clamp(bullet.life / 0.25, 0, 1) : 1;
    ctx.strokeStyle = "rgba(255, 230, 140, 0.9)";
    ctx.lineWidth = 2.8;
    ctx.shadowBlur = 20;
    ctx.shadowColor = "#ffe566";
    ctx.beginPath();
    ctx.ellipse(0, 0, s0 * 2.6, s0 * 1.65, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = "rgba(255, 180, 80, 0.45)";
    ctx.lineWidth = 1.5;
    ctx.shadowBlur = 12;
    ctx.beginPath();
    ctx.ellipse(0, 0, s0 * 3.2, s0 * 2.05, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.restore();
  }
  const shape = bullet.visualShape;
  const inferredShape =
    shape ||
    (bullet.pebbleBoulder ? "spikedBoulder" :
    bullet.aegisDisc ? "shieldDisc" :
    bullet.glacierShard ? "iceShard" :
    bullet.reaperCrescent ? "crescent" :
    bullet.marauderShard ? "raggedShard" :
    bullet.titanMegaOrb ? "heavyOrb" :
    bullet.voidwalkerMicro ? "singularity" :
    bullet.novaPrimaryPop ? "starPellet" :
    bullet.infernoGlob ? "moltenGlob" :
    bullet.picketTri ? "triangle" :
    bullet.staticPop ? "lineShot" :
    bullet.lineShot ? "lineShot" :
    null);
  if (!inferredShape) return false;

  const angle = Math.atan2(bullet.vy, bullet.vx);
  const s = bullet.size || 4;
  ctx.save();
  ctx.translate(bullet.x, bullet.y);
  ctx.rotate(angle);
  ctx.globalAlpha = bullet.life < 0.25 ? clamp(bullet.life / 0.25, 0, 1) : 1;
  ctx.shadowBlur = Math.max(8, s * 2.8);
  ctx.shadowColor = bullet.color || "#ffffff";
  ctx.fillStyle = bullet.color || "#ffffff";
  ctx.strokeStyle = bullet.color || "#ffffff";
  ctx.lineWidth = Math.max(1.2, s * 0.32);

  if (inferredShape === "lineShot") {
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-s * 4.2, 0);
    ctx.lineTo(s * 4.2, 0);
    ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,0.88)";
    ctx.lineWidth = Math.max(0.8, s * 0.16);
    ctx.beginPath();
    ctx.moveTo(-s * 2.7, 0);
    ctx.lineTo(s * 3.4, 0);
    ctx.stroke();
  } else if (inferredShape === "triangle") {
    ctx.beginPath();
    ctx.moveTo(s * 2.1, 0);
    ctx.lineTo(-s * 1.15, -s * 1.25);
    ctx.lineTo(-s * 0.65, 0);
    ctx.lineTo(-s * 1.15, s * 1.25);
    ctx.closePath();
    ctx.fill();
  } else if (inferredShape === "needle") {
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-s * 5.2, 0);
    ctx.lineTo(s * 5.8, 0);
    ctx.stroke();
    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.beginPath();
    ctx.arc(s * 4.8, 0, Math.max(1, s * 0.35), 0, Math.PI * 2);
    ctx.fill();
  } else if (inferredShape === "feather") {
    ctx.beginPath();
    ctx.ellipse(0, 0, s * 2.2, s * 0.65, -0.25, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.75)";
    ctx.beginPath();
    ctx.moveTo(-s * 2, 0);
    ctx.lineTo(s * 2, 0);
    ctx.stroke();
  } else if (inferredShape === "bird") {
    ctx.beginPath();
    ctx.moveTo(s * 2.2, 0);
    ctx.quadraticCurveTo(0, -s * 1.8, -s * 2.2, -s * 0.2);
    ctx.quadraticCurveTo(-s * 0.4, 0, -s * 2.2, s * 0.2);
    ctx.quadraticCurveTo(0, s * 1.8, s * 2.2, 0);
    ctx.fill();
  } else if (inferredShape === "ravenDetailed") {
    const flap = Math.sin(performance.now() * 0.02 + bullet.x * 0.03) * 0.5;
    const wing = s * (2.7 + flap * 0.28);
    const body = s * 0.9;
    ctx.fillStyle = bullet.color || "#9a5cff";
    ctx.beginPath();
    ctx.moveTo(s * 2.55, 0);
    ctx.quadraticCurveTo(s * 1.25, -s * 0.8, 0, -body);
    ctx.quadraticCurveTo(-s * 0.65, -wing, -s * 2.6, -s * 0.18);
    ctx.quadraticCurveTo(-s * 0.95, -s * 0.12, -s * 0.2, 0);
    ctx.quadraticCurveTo(-s * 0.95, s * 0.12, -s * 2.6, s * 0.18);
    ctx.quadraticCurveTo(-s * 0.65, wing, 0, body);
    ctx.quadraticCurveTo(s * 1.25, s * 0.8, s * 2.55, 0);
    ctx.fill();
    ctx.strokeStyle = "rgba(245, 220, 255, 0.9)";
    ctx.lineWidth = Math.max(1, s * 0.2);
    ctx.beginPath();
    ctx.moveTo(-s * 0.7, 0);
    ctx.lineTo(s * 1.9, 0);
    ctx.stroke();
  } else if (inferredShape === "clawHook") {
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(-s * 2.5, s * 0.8);
    ctx.quadraticCurveTo(s * 0.2, -s * 2.6, s * 3.2, -s * 0.5);
    ctx.quadraticCurveTo(s * 1.9, s * 0.15, s * 1.15, s * 1.5);
    ctx.stroke();
  } else if (inferredShape === "axeBlade") {
    ctx.beginPath();
    ctx.moveTo(s * 3.4, 0);
    ctx.quadraticCurveTo(s * 0.4, -s * 2.7, -s * 2.5, -s * 0.9);
    ctx.lineTo(-s * 0.8, 0);
    ctx.lineTo(-s * 2.5, s * 0.9);
    ctx.quadraticCurveTo(s * 0.4, s * 2.7, s * 3.4, 0);
    ctx.fill();
  } else if (inferredShape === "voidArcBlade") {
    ctx.lineCap = "round";
    const R = s * 5.15;
    const cx = -R * 0.56;
    const radius = R * 1.52;
    ctx.lineWidth = Math.max(8.5, s * 1.12);
    const g = ctx.createLinearGradient(cx - radius * 0.45, 0, cx + radius * 1.05, 0);
    g.addColorStop(0, "rgba(32, 0, 62, 0.96)");
    g.addColorStop(0.35, "#6020a8");
    g.addColorStop(0.58, "#a050f0");
    g.addColorStop(0.82, "#f0dcff");
    g.addColorStop(1, "#8838e0");
    ctx.strokeStyle = g;
    ctx.shadowBlur = Math.min(40, 16 + s * 1.9);
    ctx.shadowColor = "#8040ff";
    ctx.beginPath();
    ctx.arc(cx, 0, radius, -0.78, 0.78, false);
    ctx.stroke();
    ctx.strokeStyle = "rgba(240, 220, 255, 0.72)";
    ctx.lineWidth = Math.max(2.4, s * 0.28);
    ctx.beginPath();
    ctx.arc(cx, 0, radius * 0.9, -0.64, 0.64, false);
    ctx.stroke();
    ctx.shadowBlur = 0;
  } else if (inferredShape === "crescent") {
    ctx.beginPath();
    ctx.arc(0, 0, s * 2.35, -1.05, 1.05);
    ctx.arc(s * 0.9, 0, s * 1.65, 1.05, -1.05, true);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(255,40,40,0.8)";
    ctx.stroke();
  } else if (inferredShape === "starShot") {
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const r = i % 2 === 0 ? s * 2.1 : s * 0.85;
      const a = -Math.PI / 2 + (i / 10) * Math.PI * 2;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
  } else if (inferredShape === "pawShot") {
    const r = s * 0.95;
    ctx.beginPath();
    ctx.arc(0, s * 0.5, r * 1.35, 0, Math.PI * 2);
    ctx.fill();
    for (const toe of [
      { x: -r * 1.15, y: -r * 0.45 },
      { x: -r * 0.4, y: -r * 0.95 },
      { x: r * 0.4, y: -r * 0.95 },
      { x: r * 1.15, y: -r * 0.45 },
    ]) {
      ctx.beginPath();
      ctx.arc(toe.x, toe.y, r * 0.5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.strokeStyle = "rgba(255,255,255,0.6)";
    ctx.lineWidth = Math.max(1, s * 0.18);
    ctx.stroke();
  } else if (inferredShape === "rune") {
    ctx.strokeStyle = bullet.color || "#b8fff8";
    ctx.beginPath();
    ctx.moveTo(-s * 1.6, -s * 1.2);
    ctx.lineTo(s * 1.4, 0);
    ctx.lineTo(-s * 1.6, s * 1.2);
    ctx.moveTo(-s * 0.4, -s * 1.6);
    ctx.lineTo(s * 0.5, s * 1.6);
    ctx.stroke();
  } else if (inferredShape === "shieldDisc") {
    const wx = bullet.aegisBasicWide ? 1.42 : 1;
    const hy = bullet.aegisBasicWide ? 0.52 : 1;
    ctx.beginPath();
    ctx.moveTo(s * 1.8 * wx, 0);
    ctx.lineTo(s * 0.8 * wx, -s * 1.65 * hy);
    ctx.lineTo(-s * 1.4 * wx, -s * 1.25 * hy);
    ctx.lineTo(-s * 1.8 * wx, 0);
    ctx.lineTo(-s * 1.4 * wx, s * 1.25 * hy);
    ctx.lineTo(s * 0.8 * wx, s * 1.65 * hy);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.8)";
    ctx.stroke();
  } else if (inferredShape === "iceShard" || inferredShape === "raggedShard") {
    ctx.beginPath();
    ctx.moveTo(s * 2.8, 0);
    ctx.lineTo(-s * 0.8, -s * 1.3);
    ctx.lineTo(-s * 2.0, -s * 0.25);
    ctx.lineTo(-s * 0.7, s * 1.1);
    ctx.closePath();
    ctx.fill();
    if (inferredShape === "iceShard") {
      ctx.strokeStyle = "rgba(255,255,255,0.88)";
      ctx.stroke();
    }
  } else if (inferredShape === "moltenGlob" || inferredShape === "heavyOrb") {
    ctx.beginPath();
    ctx.ellipse(0, 0, s * 1.5, s * 1.05, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.55)";
    ctx.beginPath();
    ctx.arc(s * 0.35, -s * 0.3, s * 0.42, 0, Math.PI * 2);
    ctx.fill();
  } else if (inferredShape === "spikedBoulder") {
    const R = s * 1.35;
    ctx.fillStyle = bullet.color || "#7a8590";
    ctx.beginPath();
    ctx.arc(0, 0, R, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(40,48,56,0.95)";
    ctx.lineWidth = Math.max(1.4, s * 0.12);
    ctx.stroke();
    const spikes = 11;
    for (let k = 0; k < spikes; k++) {
      const a = (k / spikes) * Math.PI * 2 + angle * 0.08;
      const r0 = R * 0.88;
      const r1 = R * (1.22 + (k % 3) * 0.06);
      ctx.beginPath();
      ctx.moveTo(Math.cos(a - 0.09) * r0, Math.sin(a - 0.09) * r0);
      ctx.lineTo(Math.cos(a) * r1, Math.sin(a) * r1);
      ctx.lineTo(Math.cos(a + 0.09) * r0, Math.sin(a + 0.09) * r0);
      ctx.closePath();
      ctx.fillStyle = k % 2 ? "#5c6670" : "#8a96a2";
      ctx.fill();
    }
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.beginPath();
    ctx.arc(-R * 0.25, -R * 0.28, R * 0.22, 0, Math.PI * 2);
    ctx.fill();
  } else if (inferredShape === "singularity") {
    const eclipseShot = bullet.eclipseBrightRim;
    ctx.strokeStyle = eclipseShot ? "rgba(255,120,255,0.98)" : "rgba(180,100,255,0.95)";
    ctx.lineWidth = eclipseShot ? 2.2 : 1.2;
    ctx.shadowBlur = eclipseShot ? 22 : 10;
    ctx.shadowColor = eclipseShot ? "#ff66ff" : "#c080ff";
    for (let r = 0; r < 3; r++) {
      ctx.beginPath();
      ctx.ellipse(0, 0, s * (1.2 + r * 0.45), s * (0.55 + r * 0.22), r * 0.8, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.shadowBlur = 0;
    ctx.fillStyle = eclipseShot ? "#2a0a48" : "#05000a";
    ctx.beginPath();
    ctx.arc(0, 0, s * 0.92, 0, Math.PI * 2);
    ctx.fill();
    if (eclipseShot) {
      ctx.strokeStyle = "rgba(255, 200, 255, 0.88)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, s * 1.05, 0, Math.PI * 2);
      ctx.stroke();
    }
  } else if (inferredShape === "coin") {
    ctx.beginPath();
    ctx.ellipse(0, 0, s * 1.45, s * 0.95, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.9)";
    ctx.stroke();
  } else if (inferredShape === "spark") {
    ctx.beginPath();
    ctx.moveTo(s * 2.2, 0);
    ctx.lineTo(-s * 0.2, -s * 0.9);
    ctx.lineTo(-s * 1.5, 0);
    ctx.lineTo(-s * 0.2, s * 0.9);
    ctx.closePath();
    ctx.fill();
  } else if (inferredShape === "ghostBolt") {
    if (!bullet.phantomPhaseBolt) ctx.globalAlpha *= 0.62;
    ctx.beginPath();
    ctx.ellipse(0, 0, s * 1.8, s * 0.82, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.72)";
    ctx.stroke();
  } else if (inferredShape === "starPellet") {
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const r = i % 2 === 0 ? s * 1.55 : s * 0.45;
      const a = (i / 8) * Math.PI * 2;
      const x = Math.cos(a) * r;
      const y = Math.sin(a) * r;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
    ctx.fill();
  } else {
    ctx.restore();
    return false;
  }

  ctx.restore();
  return true;
};

function drawInstantArc(x1, y1, x2, y2, color, life = 0.14, width = 3) {
  state.visualBeams.push({
    x1,
    y1,
    x2,
    y2,
    color: color || "rgba(255,255,255,0.9)",
    width,
    life,
    maxLife: life,
    phase: performance.now() * 0.01,
  });
}

function angleWrapDiff(a, b) {
  let d = a - b;
  while (d > Math.PI) d -= Math.PI * 2;
  while (d < -Math.PI) d += Math.PI * 2;
  return d;
}

function buildLightningPolyline(x0, y0, x1, y1, segments, seed) {
  const pts = [{ x: x0, y: y0 }];
  let s = (Math.abs(seed | 0) % 100000) + 1;
  const rnd = () => {
    s = (s * 1103515245 + 12345) >>> 0;
    return (s & 0xffff) / 0xffff;
  };
  for (let i = 1; i < segments; i++) {
    const t = i / segments;
    const bx = x0 + (x1 - x0) * t;
    const by = y0 + (y1 - y0) * t;
    const mx = x1 - x0;
    const my = y1 - y0;
    const len = Math.hypot(mx, my) || 1;
    const px = -my / len;
    const py = mx / len;
    const envelope = Math.sin(Math.PI * t) * 24;
    const ox = (rnd() - 0.5) * 2 * envelope;
    pts.push({ x: bx + px * ox, y: by + py * ox });
  }
  pts.push({ x: x1, y: y1 });
  return pts;
}

function pushDecorativeLightning(points, color, life = 1.5, width = 2.6) {
  if (!state.decorativeLightning) state.decorativeLightning = [];
  state.decorativeLightning.push({
    points,
    life,
    maxLife: life,
    color: color || "rgba(150, 210, 255, 0.92)",
    width,
  });
}

function drawEnemyDizzyStars(ctx, enemy) {
  if (!(enemy.stunTimer > 0)) return;
  const bob = Math.sin(performance.now() / 130 + (enemy.phase || 0)) * 2.2;
  ctx.save();
  ctx.translate(enemy.x, enemy.y - enemy.size - 18 + bob);
  const spin = performance.now() / 260;
  for (let r = 0; r < 3; r++) {
    const a = spin + (r * Math.PI * 2) / 3;
    const sx = Math.cos(a) * 10;
    const sy = Math.sin(a) * 4 - 5;
    ctx.beginPath();
    for (let k = 0; k < 10; k++) {
      const ka = (k / 5) * Math.PI - Math.PI / 2;
      const rad = k % 2 === 0 ? 3.4 : 1.35;
      const px = sx + Math.cos(ka) * rad;
      const py = sy + Math.sin(ka) * rad;
      if (k === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.fillStyle = "#fff6a8";
    ctx.strokeStyle = "rgba(70, 55, 10, 0.75)";
    ctx.lineWidth = 1.1;
    ctx.fill();
    ctx.stroke();
  }
  ctx.restore();
}

function drawEnemyInfernoBurn(ctx, enemy) {
  if (!(enemy.infernoBurnTimer > 0)) return;
  const pulse = 0.38 + 0.22 * Math.sin(performance.now() / 85 + (enemy.phase || 0));
  ctx.save();
  ctx.globalAlpha = pulse;
  ctx.strokeStyle = "#ff5500";
  ctx.lineWidth = 2.4;
  ctx.shadowBlur = 12;
  ctx.shadowColor = "#ff2200";
  const r = enemy.size + 7 + Math.sin(performance.now() / 65 + enemy.x * 0.02) * 2;
  ctx.beginPath();
  ctx.arc(enemy.x, enemy.y, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.strokeStyle = "rgba(255, 200, 80, 0.65)";
  ctx.lineWidth = 1.2;
  ctx.shadowBlur = 6;
  ctx.beginPath();
  ctx.arc(enemy.x, enemy.y, r * 0.72, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();
}

function drawEnemyPoisonStacks(ctx, enemy) {
  if (!(enemy.stingerPoisonStacks > 0) || !(enemy.stingerPoisonTimer > 0)) return;
  const stacks = Math.min(3, enemy.stingerPoisonStacks | 0);
  const pulse = 0.55 + Math.sin(performance.now() / 120 + enemy.x * 0.02) * 0.18;
  ctx.save();
  ctx.translate(enemy.x, enemy.y - enemy.size - 10);
  for (let i = 0; i < stacks; i++) {
    const a = (i / Math.max(stacks, 1)) * Math.PI * 2 + performance.now() / 480;
    const r = 7 + (i % 2) * 3;
    const x = Math.cos(a) * r;
    const y = Math.sin(a) * (r * 0.55);
    ctx.fillStyle = `rgba(150, 255, 130, ${0.55 + pulse * 0.35})`;
    ctx.beginPath();
    ctx.arc(x, y, 2.8, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function boltStormRayEndpoints(cage, px, py) {
  const n = cage.rays || 15;
  const spin = ((performance.now() - cage.startMs) / 1000) * ((Math.PI * 2) / 6);
  const footY = cage.footYOffset ?? 20;
  const inner = cage.innerRadius ?? 22;
  const outer = cage.outerRadius ?? 152;
  const ox = px;
  const oy = py + footY;
  const rays = [];
  for (let k = 0; k < n; k++) {
    const rayAng = (k / n) * Math.PI * 2 + spin;
    const x0 = ox + Math.cos(rayAng) * inner;
    const y0 = oy + Math.sin(rayAng) * inner;
    const x1 = ox + Math.cos(rayAng) * outer;
    const y1 = oy + Math.sin(rayAng) * outer;
    rays.push({ ang: rayAng, x0, y0, x1, y1 });
  }
  return { ox, oy, rays, outer };
}

function applyBoltChannelStorm(dt) {
  const pl = state.player;
  if (!pl || (pl.boltChannelLock || 0) <= 0 || !state.boltCage) return;
  const cage = state.boltCage;
  const px = pl.x;
  const py = pl.y;
  const dm = pl.damageMultiplier * pl.abilityDamageMultiplier;
  const { rays } = boltStormRayEndpoints(cage, px, py);
  const hitBand = (cage.hitBand ?? 26) + 0.001;
  const dps = 52 * dm;
  for (let ei = state.enemies.length - 1; ei >= 0; ei--) {
    const enemy = state.enemies[ei];
    if (!enemy || enemy.hp <= 0) continue;
    let segD = Infinity;
    for (const r of rays) {
      const d = pointToSegmentDistance(enemy.x, enemy.y, r.x0, r.y0, r.x1, r.y1);
      if (d < segD) segD = d;
    }
    if (segD > enemy.size + hitBand) continue;
    enemy.hp -= dps * dt;
    recordDamageDealt(dps * dt);
    enemy.stunTimer = Math.max(enemy.stunTimer || 0, 0.55);
    if (enemy.hp <= 0) onEnemyDestroyed(enemy, ei);
  }
}

function drawBoltCageLightning(ctx) {
  const pl = state.player;
  if (!pl || (pl.boltChannelLock || 0) <= 0 || !state.boltCage) return;
  const cage = state.boltCage;
  const px = pl.x;
  const py = pl.y;
  const { rays } = boltStormRayEndpoints(cage, px, py);
  const tseed = (performance.now() / 38) | 0;
  ctx.save();
  ctx.globalCompositeOperation = "lighter";
  for (let k = 0; k < rays.length; k++) {
    const r = rays[k];
    const poly = buildLightningPolyline(r.x0, r.y0, r.x1, r.y1, 11, tseed * 997 + k * 104729);
    ctx.beginPath();
    ctx.moveTo(poly[0].x, poly[0].y);
    for (let i = 1; i < poly.length; i++) ctx.lineTo(poly[i].x, poly[i].y);
    ctx.strokeStyle = "rgba(140, 200, 255, 0.55)";
    ctx.lineWidth = 5;
    ctx.shadowBlur = 22;
    ctx.shadowColor = "#66a8ff";
    ctx.stroke();
    ctx.strokeStyle = "rgba(230, 248, 255, 0.88)";
    ctx.lineWidth = 2;
    ctx.shadowBlur = 12;
    ctx.stroke();
  }
  ctx.restore();
}

function spawnTriangleSparks(x, y, baseAngle, count, color, damage, speed, visualShape = "spark") {
  for (let i = 0; i < count; i++) {
    const a = baseAngle + (i / count) * Math.PI * 2;
    const spark = new Bullet(x, y, a, speed, true, 2.4, color, damage);
    spark.visualShape = visualShape;
    spark.life = 0.55;
    spark.noTrail = true;
    state.bullets.push(spark);
  }
}

function createFirePuddle(x, y, color = "#ff6b2a", duration = 2) {
  state.novaAnomalies.push(
    new NovaAnomaly(x, y, {
      maxRadius: 58,
      duration,
      pullStrength: 0,
      damagePerSecond: 18 * state.player.damageMultiplier,
      pullEnabled: false,
      explodeAtEnd: false,
      color,
      stunWhilePulled: false,
    })
  );
}

function spawnGlacierBurst(enemy, sourceDamage, freezeFactor = 1.5) {
  const starts = [0, Math.PI / 2, Math.PI, Math.PI * 1.5];
  for (const a of starts) {
    const shard = new Bullet(enemy.x, enemy.y, a, 340 * state.player.shotSpeedMultiplier, true, 2.8, "#b8ecff", sourceDamage * 0.42);
    shard.visualShape = "iceShard";
    shard.freezeFactor = 0.35;
    shard.glacierFreezeDuration = freezeFactor;
    shard.life = 0.75;
    state.bullets.push(shard);
  }
}

function applyScytheSwing(cx, cy, angle, radius, arc, damage, knockback = 42, color = "#ff1f1f", excludedEnemy = null, extra = null) {
  const opts = extra && typeof extra === "object" ? extra : {};
  const pivotArcBlendRadius = opts.pivotArcBlendRadius > 0 ? opts.pivotArcBlendRadius : 0;
  state.scytheSwings.push({
    x: cx,
    y: cy,
    angle,
    radius,
    arc,
    color,
    life: 0.28,
    maxLife: 0.28,
    showHandle: !!opts.showHandle,
    handleLength: opts.handleLength > 0 ? opts.handleLength : 52,
  });
  for (let s = 0; s < 32; s++) {
    const a = angle - arc / 2 + (s / 31) * arc;
    const px = cx + Math.cos(a) * radius;
    const py = cy + Math.sin(a) * radius;
    const p = new Particle(px, py, color);
    p.life = 0.22;
    p.size = rng(2, 4);
    state.particles.push(p);
  }
  for (let i = state.enemies.length - 1; i >= 0; i--) {
    const enemy = state.enemies[i];
    if (enemy === excludedEnemy) continue;
    const d = dist(cx, cy, enemy.x, enemy.y);
    if (d > radius + enemy.size) continue;
    let diff = Math.atan2(enemy.y - cy, enemy.x - cx) - angle;
    while (diff > Math.PI) diff -= Math.PI * 2;
    while (diff < -Math.PI) diff += Math.PI * 2;
    let halfArcAllowed = arc / 2;
    if (pivotArcBlendRadius > 0) {
      const pivotBlend = clamp(1 - d / pivotArcBlendRadius, 0, 1);
      halfArcAllowed += pivotBlend * (Math.PI - arc / 2);
    }
    if (Math.abs(diff) > halfArcAllowed) continue;
    enemy.hp -= damage;
    recordDamageDealt(damage);
    enemy.x += Math.cos(angle) * knockback;
    enemy.y += Math.sin(angle) * knockback;
    if (enemy.hp <= 0) {
      const si = state.enemies.indexOf(enemy);
      if (si > -1) onEnemyDestroyed(enemy, si);
    }
  }
}

class ReaperPortal {
  constructor(x, y, side) {
    this.x = x;
    this.y = y;
    this.side = side;
    this.life = 4;
    this.maxLife = 4;
    this.spawned = 0;
    this.spawnTimer = 0.25;
  }
  update(dt) {
    this.life -= dt;
    this.spawnTimer -= dt;
    if (this.spawned < 3 && this.spawnTimer <= 0) {
      this.spawnTimer = 1.2;
      this.spawned++;
      state.reaperMinions.push(new ReaperMinion(this.x + rng(-18, 18), this.y + rng(-18, 18)));
      for (let i = 0; i < 24; i++) {
        const p = new Particle(this.x + rng(-18, 18), this.y + rng(-28, 28), "#c0c0c0");
        p.life = rng(0.25, 0.55);
        state.particles.push(p);
      }
    }
    return this.life <= 0;
  }
  draw(ctx) {
    const alpha = clamp(this.life / this.maxLife, 0, 1);
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = "#a0a0a0";
    ctx.fillStyle = "rgba(20, 10, 25, 0.65)";
    ctx.shadowBlur = 22;
    ctx.shadowColor = "#7a1f1f";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(0, 0, 28 + Math.sin(performance.now() / 140) * 3, 44, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
}

class ReaperMinion {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.life = 5.8;
    this.hp = 46;
    this.maxHp = 46;
    this.attackTimer = 0.35;
    this.size = 14;
  }
  update(dt) {
    this.life -= dt;
    for (let i = state.enemyBullets.length - 1; i >= 0; i--) {
      const bullet = state.enemyBullets[i];
      if (dist(this.x, this.y, bullet.x, bullet.y) > this.size + bullet.size) continue;
      this.hp -= bullet.damage || 6;
      state.enemyBullets.splice(i, 1);
      for (let p = 0; p < 8; p++) state.particles.push(new Particle(bullet.x, bullet.y, "#d0d0d0"));
      if (this.hp <= 0) return true;
    }
    const target = getNearestEnemy(this.x, this.y);
    if (target) {
      const a = Math.atan2(target.y - this.y, target.x - this.x);
      this.x += Math.cos(a) * 115 * dt;
      this.y += Math.sin(a) * 115 * dt;
      this.attackTimer -= dt;
      if (this.attackTimer <= 0 && dist(this.x, this.y, target.x, target.y) < 110) {
        this.attackTimer = 0.85;
        applyScytheSwing(this.x, this.y, a, 118, Math.PI * 0.92, 34 * state.player.damageMultiplier * state.player.abilityDamageMultiplier, 30, "#ff2222");
      }
    }
    return this.life <= 0 || this.hp <= 0;
  }
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.fillStyle = "#c8c8c8";
    ctx.strokeStyle = "#ff2222";
    ctx.shadowBlur = 12;
    ctx.shadowColor = "#ff2222";
    ctx.beginPath();
    ctx.arc(0, 0, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.78)";
    ctx.fillRect(-12, 16, 24 * clamp(this.hp / this.maxHp, 0, 1), 3);
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(-18, 20);
    ctx.lineTo(12, -22);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(12, -22);
    ctx.quadraticCurveTo(38, -22, 42, 2);
    ctx.quadraticCurveTo(25, -11, 13, -5);
    ctx.stroke();
    ctx.strokeStyle = "rgba(255,255,255,0.8)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(17, -20);
    ctx.quadraticCurveTo(34, -17, 39, -1);
    ctx.stroke();
    ctx.restore();
  }
}

class ReaperChain {
  constructor(target) {
    this.target = target;
    this.life = 10;
    this.maxLife = 10;
  }
  update(dt) {
    if (!this.target) return true;
    if (this.target.hp <= 0) {
      const idx0 = state.enemies.indexOf(this.target);
      if (idx0 > -1) onEnemyDestroyed(this.target, idx0);
      return true;
    }
    this.life -= dt;
    this.target.reaperChainSlowTimer = Math.max(this.target.reaperChainSlowTimer || 0, 0.12);
    const activeChains = Math.max(1, state.reaperChains.filter((chain) => chain.target && chain.target.hp > 0).length);
    const focusMultiplier = clamp(8 / activeChains, 1, 4.2);
    const dmg = 18 * focusMultiplier * state.player.damageMultiplier * state.player.abilityDamageMultiplier * dt;
    this.target.hp -= dmg;
    recordDamageDealt(dmg);
    const heal = 1.4 * dt;
    state.player.hp = Math.min(state.player.maxHp, state.player.hp + heal);
    const a = Math.atan2(state.player.y - this.target.y, state.player.x - this.target.x);
    for (let i = 0; i < 2; i++) {
      const p = new Particle(this.target.x + rng(-8, 8), this.target.y + rng(-8, 8), "#ff2222");
      p.vx = Math.cos(a) * rng(80, 180);
      p.vy = Math.sin(a) * rng(80, 180);
      p.life = 0.28;
      state.particles.push(p);
    }
    if (this.target.hp <= 0) {
      const idx = state.enemies.indexOf(this.target);
      if (idx > -1) onEnemyDestroyed(this.target, idx);
      return true;
    }
    return this.life <= 0;
  }
  draw(ctx) {
    if (!this.target || !state.player) return;
    ctx.save();
    ctx.strokeStyle = "#ff2222";
    ctx.lineWidth = 3;
    ctx.shadowBlur = 18;
    ctx.shadowColor = "#ff1111";
    ctx.beginPath();
    const links = 14;
    for (let i = 0; i <= links; i++) {
      const t = i / links;
      const x = state.player.x + (this.target.x - state.player.x) * t + Math.sin(t * Math.PI * 10 + performance.now() / 80) * 5;
      const y = state.player.y + (this.target.y - state.player.y) * t + Math.cos(t * Math.PI * 8 + performance.now() / 70) * 5;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();
  }
}

class SolarFlareEmitter {
  constructor(x, y, opts = {}) {
    this.x = x;
    this.y = y;
    this.life = opts.life ?? 3;
    this.maxLife = this.life;
    this.angle = 0;
    this.emitTimer = 0;
    this.emitInterval = opts.emitInterval ?? 0.025;
    this.perTickFlames = opts.perTickFlames ?? 5;
    this.flameSpeedMin = opts.flameSpeedMin ?? 180;
    this.flameSpeedMax = opts.flameSpeedMax ?? 430;
    this.flameLifeMin = opts.flameLifeMin ?? 0.45;
    this.flameLifeMax = opts.flameLifeMax ?? 0.95;
  }
  update(dt) {
    this.life -= dt;
    this.angle += dt * Math.PI * 2.2;
    this.emitTimer -= dt;
    while (this.emitTimer <= 0) {
      this.emitTimer += this.emitInterval;
      for (let i = 0; i < this.perTickFlames; i++) {
        const a = this.angle + rng(-0.36, 0.36) + i * 0.08;
        const flame = new Bullet(
          this.x,
          this.y,
          a,
          rng(this.flameSpeedMin, this.flameSpeedMax) * state.player.shotSpeedMultiplier,
          true,
          rng(3.5, 6.5),
          Math.random() < 0.5 ? "#ff4a1f" : "#ffbd45",
          3.8 * state.player.damageMultiplier * state.player.abilityDamageMultiplier
        );
        flame.visualShape = "spark";
        flame.heliosFlame = true;
        flame.life = rng(this.flameLifeMin, this.flameLifeMax);
        state.bullets.push(flame);
      }
    }
    return this.life <= 0;
  }
  draw(ctx) {
    const alpha = clamp(this.life / this.maxLife, 0, 1);
    ctx.save();
    ctx.globalAlpha = 0.45 * alpha;
    ctx.fillStyle = "#ffb347";
    ctx.shadowBlur = 30;
    ctx.shadowColor = "#ff4a1f";
    ctx.beginPath();
    ctx.arc(this.x, this.y, 42 + Math.sin(performance.now() / 80) * 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

class FireColumn {
  constructor(x, width = 16, duration = 1.2, sparksPerFrame = 8) {
    this.x = x;
    this.width = width;
    this.life = duration;
    this.maxLife = duration;
    this.sparksPerFrame = sparksPerFrame;
  }
  update(dt) {
    this.life -= dt;
    const dmg = 75 * state.player.damageMultiplier * state.player.abilityDamageMultiplier * dt;
    for (let i = state.enemies.length - 1; i >= 0; i--) {
      const enemy = state.enemies[i];
      if (Math.abs(enemy.x - this.x) <= this.width + enemy.size) {
        enemy.hp -= dmg;
        recordDamageDealt(dmg);
        if (enemy.hp <= 0) onEnemyDestroyed(enemy, i);
      }
    }
    for (let p = 0; p < this.sparksPerFrame; p++) {
      const spark = new Particle(this.x + rng(-this.width, this.width), rng(TOP_HUD_SAFE_Y, config.height), Math.random() < 0.5 ? "#ff4a1f" : "#ffbd45");
      spark.life = 0.22;
      spark.size = rng(2, 5);
      state.particles.push(spark);
    }
    return this.life <= 0;
  }
  draw(ctx) {
    const alpha = clamp(this.life / this.maxLife, 0, 1);
    ctx.save();
    ctx.globalAlpha = 0.32 * alpha;
    ctx.fillStyle = "#ff5a2a";
    ctx.shadowBlur = 24;
    ctx.shadowColor = "#ff9a2f";
    ctx.fillRect(this.x - this.width / 2, TOP_HUD_SAFE_Y, this.width, config.height - TOP_HUD_SAFE_Y);
    ctx.restore();
  }
}

class GrimstarWave {
  constructor() {
    this.y = config.height + 70;
    this.life = 2.4;
    this.maxLife = 2.4;
    this.height = 74;
    this.hitCooldowns = new Map();
  }
  update(dt) {
    this.life -= dt;
    this.y -= 360 * dt;
    const dmg = 84 * state.player.damageMultiplier * state.player.abilityDamageMultiplier * dt;
    for (let i = state.enemies.length - 1; i >= 0; i--) {
      const enemy = state.enemies[i];
      if (Math.abs(enemy.y - this.y) > this.height * 0.55 + enemy.size) continue;
      enemy.hp -= dmg;
      recordDamageDealt(dmg);
      enemy.y -= 145 * dt;
      enemy.x += Math.sign(enemy.x - config.width * 0.5) * 28 * dt;
      if (enemy.hp <= 0) onEnemyDestroyed(enemy, i);
    }
    for (let i = 0; i < 18; i++) {
      const p = new Particle(rng(0, config.width), this.y + rng(-this.height * 0.45, this.height * 0.45), Math.random() < 0.5 ? "#8b62ff" : "#4a2080");
      p.vy = rng(-160, -70);
      p.life = rng(0.25, 0.55);
      p.size = rng(1.5, 4);
      state.particles.push(p);
    }
    return this.life <= 0 || this.y < TOP_HUD_SAFE_Y - 90;
  }
  draw(ctx) {
    const alpha = clamp(this.life / this.maxLife, 0, 1);
    ctx.save();
    ctx.globalAlpha = 0.55 * alpha;
    const grad = ctx.createLinearGradient(0, this.y - this.height / 2, 0, this.y + this.height / 2);
    grad.addColorStop(0, "rgba(185, 130, 255, 0)");
    grad.addColorStop(0.5, "rgba(120, 55, 210, 0.85)");
    grad.addColorStop(1, "rgba(25, 0, 45, 0)");
    ctx.fillStyle = grad;
    ctx.shadowBlur = 28;
    ctx.shadowColor = "#8b62ff";
    ctx.fillRect(0, this.y - this.height / 2, config.width, this.height);
    ctx.restore();
  }
}

function getEnemyTargetFor(enemy, player) {
  let best = player;
  let bestD = Infinity;
  for (const minion of state.reaperMinions || []) {
    if (!minion || minion.hp <= 0) continue;
    const d = dist(enemy.x, enemy.y, minion.x, minion.y);
    if (d < bestD && d < 520) {
      bestD = d;
      best = minion;
    }
  }
  return best;
}

function getTierPowerScale(tier) {
  if (tier === "legendary") return { basic: 2.45, ability: 2.65 };
  if (tier === "mythic") return { basic: 1.85, ability: 2.05 };
  return { basic: 1, ability: 1 };
}

const configurePebbleRicochetOrb = (b) => {
  b.noTrail = true;
  b.visualShape = "heavyOrb";
  b.maxRebounds = 4;
  b.rebounds = 0;
  b.verticalReboundOnly = false;
  b.onReboundGlow = () => {
    b.damage *= 1.06;
    b.size *= 1.03;
    b.color = b.rebounds >= 3 ? "#d8e0e6" : "#aab4bc";
  };
};

function handleBasicBulletExpired(bullet) {
  if (bullet.hitSomething) return;
  if (bullet.wickExplosiveShot && !bullet.wickExploded) {
    bullet.wickExploded = true;
    for (let p = 0; p < 14; p++) {
      state.particles.push(new Particle(bullet.x + rng(-6, 6), bullet.y + rng(-6, 6), "#ffcc80"));
    }
    return;
  }
  if (bullet.wickBasic && !bullet.wickMissPopped) {
    bullet.wickMissPopped = true;
    spawnTriangleSparks(bullet.x, bullet.y, -Math.PI / 2, 3, "#ffb347", bullet.damage * 0.45, 260 * state.player.shotSpeedMultiplier);
  }
  if (bullet.novaPrimaryPop && !bullet.novaExpiredPopped) {
    bullet.novaExpiredPopped = true;
    emitNovaShellParticles(bullet.x, bullet.y, "#ffffff", "#e8ffff", 4, 28);
    spawnTriangleSparks(bullet.x, bullet.y, -Math.PI / 2, 3, "#ffffff", bullet.damage * 0.55, 280 * state.player.shotSpeedMultiplier, "starPellet");
  }
  if ((bullet.emberPuddle || bullet.infernoGlob) && !bullet.puddleSpawned) {
    bullet.puddleSpawned = true;
    createFirePuddle(bullet.x, bullet.y, bullet.infernoGlob ? "#ff4a1f" : "#ff7a45", bullet.infernoGlob ? 2 : 0.5);
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
    this.size = scaleByViewport(size);
    this.life = owner === "boss" ? 6 : 6
    this.damage = damage ?? (friendly ? 9 : 6 * (state.enemyDamageMultiplier || 1));
    this.color = color || (friendly ? "#74ffce" : "#ff7676");
    this.owner = owner;
    this.rebounds = 0; 
    this.maxRebounds = 0; 
    this.piercing = false;
    this.noTrail = false;
    this.lineShot = false;
    this.gravityDrop = 0;
    this.wobbleAmp = 0;
    this.wobbleT = 0;
    this.infernoGlob = false;
    this.age = 0;
    this.baseSpeed = speed;
    this.hitCount = 0;
    this.spawnEnemy = null;
  }
  update(dt) {
    if (!this.friendly && state.player && (state.player.boltChannelLock || 0) > 0 && state.boltCage) {
      const pl = state.player;
      const cage = state.boltCage;
      const band = (cage.hitBand ?? 26) + (this.size || 4) + 4;
      const { rays } = boltStormRayEndpoints(cage, pl.x, pl.y);
      let best = Infinity;
      for (const r of rays) {
        const d = pointToSegmentDistance(this.x, this.y, r.x0, r.y0, r.x1, r.y1);
        if (d < best) best = d;
      }
      if (best <= band) return;
    }
    if (!(this.friendly && this.clawHoverPaw)) {
      this.life -= dt;
    }
    this.age += dt;
    if (!this.friendly && state.oracleChronos && state.oracleChronos.life > 0 && this.spawnEnemy && this.spawnEnemy.hp > 0) {
      const sp = Math.max(160, Math.hypot(this.vx, this.vy) || 240);
      const a = Math.atan2(this.spawnEnemy.y - this.y, this.spawnEnemy.x - this.x);
      this.vx = Math.cos(a) * sp;
      this.vy = Math.sin(a) * sp;
    }
    if (this.friendly && this.seraphRailEmitter && !this.seraphNeedle && this.life > 0) {
      this.emitAcc = (this.emitAcc || 0) + dt;
      const interval = 0.036;
      while (this.emitAcc >= interval) {
        this.emitAcc -= interval;
        const ang = Math.atan2(this.vy, this.vx);
        const sp = Math.hypot(this.vx, this.vy) + 140;
        const ox = this.x + Math.cos(ang) * 12;
        const oy = this.y + Math.sin(ang) * 12;
        const nd = new Bullet(
          ox,
          oy,
          ang,
          sp,
          true,
          2.4,
          "#ff1212",
          9.2 * (state.player && state.player.damageMultiplier ? state.player.damageMultiplier : 1)
        );
        nd.life = 0.15;
        nd.seraphNeedle = true;
        nd.owner = "player";
        state.bullets.push(nd);
      }
    }

    if (this.dartBasic && !this.dartAccelerated && this.age >= 1) {
      this.dartAccelerated = true;
      this.vx *= 2.25;
      this.vy *= 2.25;
      this.piercing = true;
      this.pierceCount = 1;
      this.color = "#ffffff";
      this.size *= 1.15;
    }

    if (this.lancerGrow) {
      const growth = clamp(this.age / 0.8, 0, 1);
      this.size = Math.max(this.size, 2.4 + growth * 2.2);
      if (growth >= 1) {
        this.piercing = true;
        this.pierceCount = Math.max(this.pierceCount || 0, 2);
      }
    }

    if (this.stingerReturn && !this.stingerReturned && this.age > 0.45) {
      const nearEdge = this.x < 28 || this.x > config.width - 28 || this.y < TOP_HUD_SAFE_Y + 10 || this.y > config.height - 28;
      if (nearEdge) {
        const target = getNearestEnemy(this.x, this.y);
        if (target) {
          const a = Math.atan2(target.y - this.y, target.x - this.x);
          const sp = Math.hypot(this.vx, this.vy) || 600;
          this.vx = Math.cos(a) * sp * 0.78;
          this.vy = Math.sin(a) * sp * 0.78;
          this.tracking = true;
          this.trackingTarget = target;
          this.trackingTurnRate = 8;
          this.stingerReturned = true;
          this.life = Math.max(this.life, 0.85);
        }
      }
    }

    if (this.tempestOrb) {
      this.tempestArcTimer = (this.tempestArcTimer || 0) - dt;
      if (this.tempestArcTimer <= 0 && (this.tempestArcCount || 0) < 3) {
        this.tempestArcTimer = 0.22;
        let target = null;
        let bestD = 150;
        for (const enemy of state.enemies) {
          const d = dist(this.x, this.y, enemy.x, enemy.y);
          if (d < bestD) {
            bestD = d;
            target = enemy;
          }
        }
        if (target) {
          const arcDamage = this.damage * 0.28;
          target.hp -= arcDamage;
          recordDamageDealt(arcDamage);
          drawInstantArc(this.x, this.y, target.x, target.y, "#fff176", 0.16);
          if (target.hp <= 0) {
            const idx = state.enemies.indexOf(target);
            if (idx > -1) onEnemyDestroyed(target, idx);
          }
          this.tempestArcCount = (this.tempestArcCount || 0) + 1;
        }
      }
    }

    if (this.auroraCurveDir && !this.sinePath) {
      const sp = Math.hypot(this.vx, this.vy) || 1;
      const base = Math.atan2(this.vy, this.vx);
      const next = base + this.auroraCurveDir * dt * 1.75;
      this.vx = Math.cos(next) * sp;
      this.vy = Math.sin(next) * sp;
    }

    if (this.voidwalkerRiftBlade) {
      const sp = Math.hypot(this.vx, this.vy) || 1;
      this._riftTraveled = (this._riftTraveled || 0) + sp * dt;
      const grow = 1 + this._riftTraveled * 0.0041;
      this.size = (this._riftBaseSize || 5.2) * grow;
      if (this.hitEllipseW != null && this.hitEllipseH != null) {
        this.hitEllipseW = (this._riftBaseEW || 108) * (0.9 + (grow - 1) * 0.55);
        this.hitEllipseH = (this._riftBaseEH || 16) * grow;
      }
    }

    if (this.grimstarTrail) {
      this.trailTimer = (this.trailTimer || 0) - dt;
      if (this.trailTimer <= 0) {
        this.trailTimer = this.thinPurpleTrail ? 0.025 : 0.08;
        if (this.thinPurpleTrail) {
          const p = new Particle(this.x + rng(-2, 2), this.y + rng(-2, 2), "#9b62ff");
          p.life = 0.22;
          p.size = rng(1, 2);
          state.particles.push(p);
        } else {
          state.voidTrails.push({ x: this.x, y: this.y, radius: 34, life: 0.5, maxLife: 0.5, color: "#4a2080" });
        }
      }
    }

    if (this.wardenAbsorb) {
      for (let i = state.enemyBullets.length - 1; i >= 0; i--) {
        const enemyBullet = state.enemyBullets[i];
        if (dist(this.x, this.y, enemyBullet.x, enemyBullet.y) > this.size + enemyBullet.size + 12) continue;
        state.enemyBullets.splice(i, 1);
        this.wardenAbsorbs = (this.wardenAbsorbs || 0) + 1;
        this.size = Math.min(this.size + 0.8, (this.baseSize || this.size) + 3);
        this.damage *= 1.08;
        for (let p = 0; p < 8; p++) state.particles.push(new Particle(enemyBullet.x, enemyBullet.y, "#ffe9a8"));
        if (this.wardenAbsorbs >= 3) break;
      }
    }

    if (this.bucklerGuard || this.aegisReflectDisc) {
      const reflectReach =
        this.hitEllipseW != null && this.hitEllipseH != null
          ? Math.max(this.hitEllipseW, this.hitEllipseH) * 0.72 + 6
          : this.size + 6;
      for (let i = state.enemyBullets.length - 1; i >= 0; i--) {
        const enemyBullet = state.enemyBullets[i];
        if (dist(this.x, this.y, enemyBullet.x, enemyBullet.y) > reflectReach + enemyBullet.size) continue;
        state.enemyBullets.splice(i, 1);
        if (this.aegisReflectDisc && !this.aegisReflected) {
          this.aegisReflected = true;
          this.damage *= 0.5;
          const a = Math.atan2(enemyBullet.vy || 0, enemyBullet.vx || -1) + Math.PI;
          const reflected = new Bullet(this.x, this.y, a, 420, true, 4, "#9fd4ff", this.damage);
          reflected.lineShot = true;
          reflected.life = 0.85;
          state.bullets.push(reflected);
        } else if (this.bucklerGuard) {
          state.player.hp = Math.min(state.player.maxHp, state.player.hp + state.player.maxHp * 0.006);
          this.life = 0;
        }
        for (let p = 0; p < 8; p++) state.particles.push(new Particle(this.x, this.y, this.color || "#ffb347"));
        break;
      }
    }

    if (this.dartHomingPending) {
      this.dartHomingArmDelay -= dt;
      if (this.dartHomingArmDelay <= 0) {
        this.dartHomingPending = false;
        this.tracking = true;
        this.trackingTarget = getNearestEnemy(this.x, this.y);
      }
    }
    if (this.oracleGuidancePending) {
      this.oracleGuidanceArmDelay -= dt;
      if (this.oracleGuidanceArmDelay <= 0) {
        this.oracleGuidancePending = false;
        const t = getNearestEnemy(this.x, this.y);
        if (t) {
          this.tracking = true;
          this.trackingTarget = t;
        }
      }
    }
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

    if (this.friendly && this.boltIonOrb && state.player) {
      const dps = (this.boltIonOrbDps || 40) * state.player.damageMultiplier * state.player.abilityDamageMultiplier;
      const reach = this.size + 10;
      for (let ei = state.enemies.length - 1; ei >= 0; ei--) {
        const enemy = state.enemies[ei];
        if (!enemy || enemy.hp <= 0) continue;
        if (dist(this.x, this.y, enemy.x, enemy.y) < reach + enemy.size) {
          enemy.hp -= dps * dt;
          recordDamageDealt(dps * dt);
          if (Math.random() < 0.22) {
            state.particles.push(new Particle(enemy.x + rng(-4, 4), enemy.y + rng(-4, 4), "#a8d8ff"));
          }
          if (enemy.hp <= 0) {
            onEnemyDestroyed(enemy, ei);
          }
        }
      }
    }
    
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    if (this.sinePath) {
      if (!this.sineOrigin) {
        this.sineOrigin = { x: this.x, y: this.y };
        this.sineAngle = Math.atan2(this.vy, this.vx);
        this.sineSpeed = Math.hypot(this.vx, this.vy) || this.baseSpeed || 1;
      }
      const amp = this.sineAmplitude || 24;
      const freq = this.sineFrequency || 10;
      const phase = this.sinePhase || 0;
      const forward = this.sineSpeed * this.age;
      const side = Math.sin(this.age * freq + phase) * amp;
      const sideVelocity = Math.cos(this.age * freq + phase) * amp * freq;
      const ca = Math.cos(this.sineAngle);
      const sa = Math.sin(this.sineAngle);
      const px = Math.cos(this.sineAngle + Math.PI / 2);
      const py = Math.sin(this.sineAngle + Math.PI / 2);
      this.x = this.sineOrigin.x + ca * forward + Math.cos(this.sineAngle + Math.PI / 2) * side;
      this.y = this.sineOrigin.y + sa * forward + Math.sin(this.sineAngle + Math.PI / 2) * side;
      this.vx = ca * this.sineSpeed + px * sideVelocity;
      this.vy = sa * this.sineSpeed + py * sideVelocity;
    }
    
    
    const topBounceY = TOP_HUD_SAFE_Y + this.size;
    if (this.maxRebounds > 0 && (this.wallBounceInfinite || this.rebounds < this.maxRebounds)) {
      if (!this.verticalReboundOnly && (this.x <= this.size || this.x >= config.width - this.size)) {
        this.vx = -this.vx;
        if (!this.wallBounceInfinite) this.rebounds++;
        this.x = Math.max(this.size, Math.min(config.width - this.size, this.x));
        if (this.onReboundGlow) this.onReboundGlow();
      }
      const hitFloor = this.y >= config.height - this.size;
      const hitCeilingHud = this.y <= topBounceY;
      if (this.verticalReboundOnly) {
        if (hitCeilingHud || hitFloor) {
          this.vy = -this.vy;
          if (!this.wallBounceInfinite) this.rebounds++;
          this.y = Math.max(topBounceY, Math.min(config.height - this.size, this.y));
          if (this.onReboundGlow) this.onReboundGlow();
        }
      } else if (hitCeilingHud || hitFloor) {
        this.vy = -this.vy;
        if (!this.wallBounceInfinite) this.rebounds++;
        this.y = Math.max(topBounceY, Math.min(config.height - this.size, this.y));
        if (this.onReboundGlow) this.onReboundGlow();
      }
    }
    if (this.gravityDrop) {
      this.vy += this.gravityDrop * dt;
    }
    if (this.wobbleAmp) {
      this.wobbleT += dt * 11;
      const sp = Math.hypot(this.vx, this.vy) || 1;
      const base = Math.atan2(this.vy, this.vx);
      let na = base + Math.sin(this.wobbleT) * this.wobbleAmp;
      if ((this.knaveLeftCurveTimer || 0) > 0) {
        na -= this.wobbleAmp * 0.5;
        this.knaveLeftCurveTimer = Math.max(0, this.knaveLeftCurveTimer - dt);
      }
      this.vx = Math.cos(na) * sp;
      this.vy = Math.sin(na) * sp;
    }
    if (this.friendly && this.infernoGlob && Math.random() < 0.45) {
      state.particles.push(new Particle(this.x + rng(-4, 4), this.y + rng(-4, 4), "#ff6b2a"));
    }
    if (this.heliosFlame && Math.random() < 0.26) {
      const p = new Particle(this.x + rng(-3, 3), this.y + rng(-3, 3), Math.random() < 0.5 ? "#ff5a2a" : "#ffb347");
      p.life = 0.18;
      p.size = rng(1.5, 3.4);
      state.particles.push(p);
    }
    if (this.friendly && this.emberInfernoOrb) {
      this.emberTrailTick = (this.emberTrailTick || 0) + dt;
      if (this.emberTrailTick >= 0.035) {
        this.emberTrailTick = 0;
        state.voidTrails.push({
          x: this.x,
          y: this.y,
          radius: 42,
          life: 0.72,
          maxLife: 0.72,
          color: "rgba(255, 70, 35, 0.7)",
          emberTrail: true,
          dps: this.emberTrailDps || 18,
        });
      }
      if (Math.random() < 0.65) {
        const p = new Particle(this.x + rng(-8, 8), this.y + rng(-8, 8), Math.random() < 0.5 ? "#ff5a2a" : "#ffb347");
        p.life = 0.22;
        p.size = rng(2, 4.4);
        state.particles.push(p);
      }
    }
    if (this.friendly && this.stingerSpiral) {
      const lifeMax = Math.max(this.life + this.age, 0.001);
      const t = clamp(this.age / lifeMax, 0, 1);
      const outward = t < 0.5;
      const halfT = outward ? t / 0.5 : (t - 0.5) / 0.5;
      const radius = outward
        ? this.stingerSpiralMaxR * halfT
        : this.stingerSpiralMaxR * (1 - halfT);
      const spinDir = outward ? this.stingerSpiralOutSpin : this.stingerSpiralInSpin;
      const base = this.stingerSpiralStart || 0;
      const turnRate = this.stingerSpiralTurnRate || 6;
      const theta = base + spinDir * turnRate * this.age + (outward ? 0 : Math.PI * 0.35);
      const cx = this.stingerSpiralCx || this.x;
      const cy = this.stingerSpiralCy || this.y;
      this.x = cx + Math.cos(theta) * radius;
      this.y = cy + Math.sin(theta) * radius;
      this.vx = Math.cos(theta + Math.PI / 2 * spinDir) * (220 + radius * 0.8);
      this.vy = Math.sin(theta + Math.PI / 2 * spinDir) * (220 + radius * 0.8);
    }
    if (this.friendly && this.clawHoverPaw) {
      let target = this.clawHoverTarget;
      if (!target || target.hp <= 0) {
        target = getNearestEnemy(this.x, this.y);
        this.clawHoverTarget = target;
      }
      if (!target) {
        this.vx = 0;
        this.vy = 0;
      } else {
        const tx = target.x;
        const ty = target.y - target.size - 24;
        const dx = tx - this.x;
        const dy = ty - this.y;
        const d = Math.hypot(dx, dy) || 1;
        if (d > 18) {
          const spd = 360;
          this.vx = (dx / d) * spd;
          this.vy = (dy / d) * spd;
          this.x += this.vx * dt;
          this.y += this.vy * dt;
        } else {
          this.x = tx;
          this.y = ty;
          const dps = this.clawHoverDps || 3;
          target.hp -= dps * dt;
          target.stunTimer = Math.max(target.stunTimer || 0, this.clawHoverStun || 0.25);
          recordDamageDealt(dps * dt);
          if (Math.random() < 0.2) state.particles.push(new Particle(target.x + rng(-5, 5), target.y + rng(-5, 5), "#7dffb3"));
          if (target.hp <= 0) {
            const idx = state.enemies.indexOf(target);
            if (idx > -1) onEnemyDestroyed(target, idx);
            this.clawHoverTarget = getNearestEnemy(this.x, this.y);
          }
        }
      }
    }
    if (this.dartBasic && Math.random() < 0.5) {
      const p = new Particle(this.x - this.vx * 0.018 + rng(-2, 2), this.y - this.vy * 0.018 + rng(-2, 2), "rgba(220,220,220,0.45)");
      p.life = 0.28;
      p.size = rng(1, 2);
      state.particles.push(p);
    }
    if (this.chainArc && this.chainDamagePct === 0.15 && Math.random() < 0.42) {
      const p = new Particle(this.x + rng(-4, 4), this.y + rng(-4, 4), "#66a8ff");
      p.life = 0.14;
      p.size = rng(1, 2.2);
      state.particles.push(p);
    }
    if (this.novaPrimaryPop && Math.random() < 0.65) {
      const p = new Particle(this.x, this.y, "#ffffff");
      p.life = 0.3;
      p.size = rng(2, 3.5);
      state.particles.push(p);
    }
  }
  draw(ctx) {
    ctx.save();
    if (this.friendly && this.specterPhantasmOrb) {
      const pulse = 0.88 + Math.sin(this.age * 14) * 0.12;
      const s = this.size * pulse;
      const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, s * 2.8);
      g.addColorStop(0, "rgba(255, 255, 255, 0.98)");
      g.addColorStop(0.28, "rgba(230, 228, 255, 0.82)");
      g.addColorStop(0.55, "rgba(180, 170, 255, 0.55)");
      g.addColorStop(1, "rgba(120, 100, 200, 0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(this.x, this.y, s * 2.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255, 252, 255, 0.92)";
      ctx.lineWidth = 2.4;
      ctx.shadowBlur = 22;
      ctx.shadowColor = "#d8d0ff";
      ctx.beginPath();
      ctx.arc(this.x, this.y, s * 1.05, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.restore();
      return;
    }
    if (this.friendly && this.boltIonOrb) {
      const pulse = 0.82 + Math.sin(this.age * 11) * 0.18;
      const s = this.size * pulse;
      const g = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, s * 2.4);
      g.addColorStop(0, "rgba(230, 248, 255, 0.98)");
      g.addColorStop(0.35, "rgba(120, 190, 255, 0.82)");
      g.addColorStop(0.72, "rgba(50, 110, 220, 0.45)");
      g.addColorStop(1, "rgba(20, 40, 120, 0)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(this.x, this.y, s * 2.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(200, 235, 255, 0.9)";
      ctx.lineWidth = 2.2;
      ctx.shadowBlur = 20;
      ctx.shadowColor = "#66a8ff";
      ctx.beginPath();
      ctx.arc(this.x, this.y, s * 1.05, 0, Math.PI * 2);
      ctx.stroke();
      for (let k = 0; k < 9; k++) {
        const base = this.age * 6 + k * 0.7;
        const a0 = (k / 9) * Math.PI * 2 + this.age * 2.2;
        const r0 = s * 0.35;
        const r1 = s * (1.55 + Math.sin(base) * 0.25);
        ctx.beginPath();
        ctx.strokeStyle = `rgba(180, 220, 255, ${0.35 + (k % 3) * 0.12})`;
        ctx.lineWidth = 1.2;
        ctx.shadowBlur = 8;
        ctx.moveTo(this.x + Math.cos(a0) * r0, this.y + Math.sin(a0) * r0);
        let ax = this.x + Math.cos(a0) * r0;
        let ay = this.y + Math.sin(a0) * r0;
        const steps = 5;
        for (let t = 1; t <= steps; t++) {
          const u = t / steps;
          const ang = a0 + Math.sin(base + u * 5) * 0.55;
          const rr = r0 + (r1 - r0) * u;
          ax = this.x + Math.cos(ang) * rr + Math.sin(base * 3 + u * 11) * 3;
          ay = this.y + Math.sin(ang) * rr + Math.cos(base * 2.7 + u * 9) * 3;
          ctx.lineTo(ax, ay);
        }
        ctx.stroke();
      }
      ctx.shadowBlur = 0;
      ctx.restore();
      return;
    }

    if (this.friendly && (this.seraphNeedle || this.seraphRailEmitter)) {
      const ang = Math.atan2(this.vy, this.vx);
      ctx.translate(this.x, this.y);
      ctx.rotate(ang);
      const L = this.seraphNeedle ? 16 : 20;
      const W = this.seraphNeedle ? 3.4 : 5;
      ctx.globalAlpha = 1;
      ctx.shadowBlur = 14;
      ctx.shadowColor = "#ff0000";
      ctx.fillStyle = this.seraphNeedle ? "#ff1c1c" : "#ff2e2e";
      ctx.fillRect(-L * 0.2, -W / 2, L * 0.95, W);
      ctx.fillStyle = "rgba(255,255,255,0.95)";
      ctx.fillRect(L * 0.25, -W * 0.35, L * 0.55, W * 0.7);
      ctx.shadowBlur = 0;
      ctx.restore();
      return;
    }

    if (drawFriendlyProjectileSilhouette(ctx, this)) {
      ctx.restore();
      return;
    }

    if (this.friendly && this.lineShot) {
      ctx.save();
      const ang = Math.atan2(this.vy, this.vx);
      ctx.translate(this.x, this.y);
      ctx.rotate(ang);
      ctx.strokeStyle = this.color || "#66a8ff";
      ctx.lineWidth = Math.max(1.2, this.size * 0.35);
      ctx.globalAlpha = 0.95;
      ctx.beginPath();
      ctx.moveTo(-this.size * 3, 0);
      ctx.lineTo(this.size * 3, 0);
      ctx.stroke();
      ctx.restore();
      return;
    }
    if (this.friendly && this.picketTri) {
      ctx.save();
      ctx.translate(this.x, this.y);
      const ang = Math.atan2(this.vy, this.vx);
      ctx.rotate(ang);
      ctx.fillStyle = this.color || "#f0f6ff";
      ctx.globalAlpha = 0.95;
      ctx.beginPath();
      ctx.moveTo(this.size * 1.8, 0);
      ctx.lineTo(-this.size * 0.9, -this.size * 1.1);
      ctx.lineTo(-this.size * 0.9, this.size * 1.1);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      return;
    }

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
      } else if (this.color === "#ff1212" || this.color === "#ff1515") {
        coreColor = "#ff4444";
        glowColor = "rgba(255, 30, 30, 0.95)";
        trailColor = "rgba(255, 40, 40, 0.55)";
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
      } else if (this.color === "#c45fff") {
        coreColor = "#e8a8ff";
        glowColor = "rgba(196, 95, 255, 0.92)";
        trailColor = "rgba(180, 80, 255, 0.55)";
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
    
    
    if (!this.noTrail) {
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
    }
    
    
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
    this.size = scaleByViewport(12);
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
    this.orbitRadius = scaleByViewport(60);
    this.orbitSpeed = 2;
    this.fireTimer = 0;
    this.life = 5; 
    this.maxLife = 5;
    this.size = scaleByViewport(8);
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
    this.color = "#00ffff";
  }
  update(dt) {
    this.life -= dt;
    if (this.riseVy != null) {
      this.y += this.riseVy * dt;
    }
    if (this.aegisBulwark) {
      const dm = state.player ? state.player.damageMultiplier * (state.player.abilityDamageMultiplier || 1) : 1;
      const dps = 19 * dm;
      const rise = this.riseVy ?? -200;
      for (let ei = state.enemies.length - 1; ei >= 0; ei--) {
        const enemy = state.enemies[ei];
        const d = this.distToLine(enemy.x, enemy.y);
        if (d > enemy.size + this.width * 0.5 + 5) continue;
        const chunk = dps * dt;
        enemy.hp -= chunk;
        recordDamageDealt(chunk);
        if (enemy.hp <= 0) {
          onEnemyDestroyed(enemy, ei);
          continue;
        }
        enemy.y += rise * dt * 1.05;
        enemy.x += (enemy.x - this.x) * 2.8 * dt;
        enemy.x = clamp(enemy.x, enemy.size, config.width - enemy.size);
        enemy.y = clamp(enemy.y, TOP_HUD_SAFE_Y + enemy.size, config.height - enemy.size);
      }
    }

    for (let i = state.enemyBullets.length - 1; i >= 0; i--) {
      const bullet = state.enemyBullets[i];
      const distToBarrier = this.distToLine(bullet.x, bullet.y);
      if (distToBarrier < this.width / 2 + bullet.size) {
        state.enemyBullets.splice(i, 1);
        for (let j = 0; j < 8; j++) {
          state.particles.push(new Particle(bullet.x, bullet.y, this.color));
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
    const color = this.color || "#00ffff";
    const gradient = ctx.createLinearGradient(-this.length / 2, 0, this.length / 2, 0);
    gradient.addColorStop(0, `${color}44`);
    gradient.addColorStop(0.5, `${color}dd`);
    gradient.addColorStop(1, `${color}44`);
    ctx.fillStyle = gradient;
    ctx.fillRect(-this.length / 2, -this.width / 2, this.length, this.width);
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.strokeRect(-this.length / 2, -this.width / 2, this.length, this.width);
    ctx.restore();
  }
}

class EclipseUmbralWall {
  constructor(x, y, angle, length) {
    this.x = x;
    this.y = y;
    this.angle = angle;
    this.length = length;
    this.width = 36;
    this.life = 7;
    this.maxLife = 7;
    this.shootAcc = 0;
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
  update(dt) {
    this.life -= dt;
    this.shootAcc += dt;
    const pl = state.player;
    const dm = pl ? pl.damageMultiplier * (pl.abilityDamageMultiplier || 1) : 1;
    const sm = pl ? pl.shotSpeedMultiplier : 1;
    while (this.shootAcc >= 0.072) {
      this.shootAcc -= 0.072;
      let anyEnemy = false;
      for (const en of state.enemies) {
        if (en && en.hp > 0) {
          anyEnemy = true;
          break;
        }
      }
      if (!anyEnemy) continue;
      for (const tu of [-0.36, 0.36]) {
        const hx = this.x + Math.cos(this.angle) * (this.length * 0.5 * tu);
        const hy = this.y + Math.sin(this.angle) * (this.length * 0.5 * tu);
        const nx = Math.cos(this.angle + Math.PI / 2);
        const ny = Math.sin(this.angle + Math.PI / 2);
        let best = null;
        let bd = 1e9;
        for (const en of state.enemies) {
          if (!en || en.hp <= 0) continue;
          const d = dist(en.x, en.y, hx, hy);
          if (d < bd) {
            bd = d;
            best = en;
          }
        }
        if (!best) continue;
        const ang = Math.atan2(best.y - hy, best.x - hx);
        const orb = new Bullet(hx + nx * 14, hy + ny * 14, ang, 515 * sm, true, 5.4, "#d8a8ff", 3.1 * dm);
        orb.life = 1.2;
        orb.eclipseTurretOrb = true;
        state.bullets.push(orb);
      }
    }
    for (let i = state.enemyBullets.length - 1; i >= 0; i--) {
      const bullet = state.enemyBullets[i];
      if (this.distToLine(bullet.x, bullet.y) < this.width / 2 + bullet.size) {
        state.enemyBullets.splice(i, 1);
        for (let j = 0; j < 7; j++) {
          state.particles.push(new Particle(bullet.x, bullet.y, j % 2 ? "#c4a0ff" : "#8a62cc"));
        }
      }
    }
  }
  draw(ctx) {
    const alpha = clamp(this.life / this.maxLife, 0, 1);
    const x1 = this.x + Math.cos(this.angle) * this.length / 2;
    const y1 = this.y + Math.sin(this.angle) * this.length / 2;
    const x2 = this.x - Math.cos(this.angle) * this.length / 2;
    const y2 = this.y - Math.sin(this.angle) * this.length / 2;
    ctx.save();
    ctx.globalAlpha = 0.92 * alpha;
    const g = ctx.createLinearGradient(x1, y1, x2, y2);
    g.addColorStop(0, "rgba(60, 20, 90, 0.45)");
    g.addColorStop(0.15, "rgba(120, 70, 180, 0.72)");
    g.addColorStop(0.5, "rgba(180, 130, 255, 0.88)");
    g.addColorStop(0.85, "rgba(100, 50, 160, 0.7)");
    g.addColorStop(1, "rgba(50, 15, 85, 0.48)");
    ctx.strokeStyle = "rgba(220, 190, 255, 0.95)";
    ctx.lineWidth = this.width + 18;
    ctx.lineCap = "butt";
    ctx.shadowBlur = 28;
    ctx.shadowColor = "#a070ff";
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.strokeStyle = "rgba(140, 80, 200, 0.55)";
    ctx.lineWidth = this.width;
    ctx.shadowBlur = 14;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
    ctx.fillStyle = g;
    ctx.lineWidth = 0;
    const perp = this.angle + Math.PI / 2;
    const px = Math.cos(perp) * (this.width * 0.5);
    const py = Math.sin(perp) * (this.width * 0.5);
    ctx.beginPath();
    ctx.moveTo(x1 + px, y1 + py);
    ctx.lineTo(x2 + px, y2 + py);
    ctx.lineTo(x2 - px, y2 - py);
    ctx.lineTo(x1 - px, y1 - py);
    ctx.closePath();
    ctx.fill();
    ctx.globalAlpha = 0.85 * alpha;
    ctx.strokeStyle = "rgba(240, 220, 255, 0.9)";
    ctx.lineWidth = 2.2;
    ctx.shadowBlur = 8;
    ctx.beginPath();
    ctx.moveTo(x1 + px * 0.92, y1 + py * 0.92);
    ctx.lineTo(x2 + px * 0.92, y2 + py * 0.92);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x1 - px * 0.92, y1 - py * 0.92);
    ctx.lineTo(x2 - px * 0.92, y2 - py * 0.92);
    ctx.stroke();
    const segments = Math.max(4, Math.floor(this.length / 44));
    for (let s = 1; s < segments; s++) {
      const t = s / segments - 0.5;
      const sx = this.x + Math.cos(this.angle) * (this.length * t);
      const sy = this.y + Math.sin(this.angle) * (this.length * t);
      ctx.strokeStyle = `rgba(200, 170, 255, ${0.35 * alpha})`;
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(sx - px * 0.35, sy - py * 0.35);
      ctx.lineTo(sx + px * 0.35, sy + py * 0.35);
      ctx.stroke();
      ctx.fillStyle = `rgba(255, 250, 255, ${0.2 * alpha})`;
      ctx.beginPath();
      ctx.arc(sx + px * 0.55, sy + py * 0.55, 2.2, 0, Math.PI * 2);
      ctx.fill();
    }
    for (const tu of [-0.36, 0.36]) {
      const tx = this.x + Math.cos(this.angle) * (this.length * 0.5 * tu);
      const ty = this.y + Math.sin(this.angle) * (this.length * 0.5 * tu);
      ctx.fillStyle = `rgba(40, 10, 70, ${0.75 * alpha})`;
      ctx.strokeStyle = `rgba(230, 200, 255, ${0.9 * alpha})`;
      ctx.lineWidth = 2;
      ctx.shadowBlur = 16;
      ctx.shadowColor = "#c8a0ff";
      ctx.beginPath();
      ctx.arc(tx, ty, 11, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = `rgba(200, 160, 255, ${0.5 * alpha})`;
      ctx.beginPath();
      ctx.arc(tx, ty, 5, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.shadowBlur = 0;
    ctx.restore();
  }
}

class ScreenLaser {
  constructor(config = {}) {
    this.orientation = config.orientation || "vertical";
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.width = config.width || 20;
    this.color = config.color || "rgba(255, 70, 70, 0.9)";
    this.life = config.life || 2.5;
    this.maxLife = this.life;
    this.damagePerSecond = config.damagePerSecond || 120;
    this.delay = config.delay || 0;
  }
  update(dt) {
    if (this.delay > 0) {
      this.delay -= dt;
      return;
    }
    this.life -= dt;
    for (let i = state.enemies.length - 1; i >= 0; i--) {
      const enemy = state.enemies[i];
      const inBeam = this.orientation === "vertical"
        ? Math.abs(enemy.x - this.x) <= this.width * 0.5 + enemy.size
        : Math.abs(enemy.y - this.y) <= this.width * 0.5 + enemy.size;
      if (!inBeam) continue;
      const dmg = this.damagePerSecond * dt * state.player.damageMultiplier * state.player.abilityDamageMultiplier;
      enemy.hp -= dmg;
      recordDamageDealt(dmg);
      enemy.fireTimer += 0.12;
      if (enemy.hp <= 0) onEnemyDestroyed(enemy, i);
    }
  }
  draw(ctx) {
    if (this.delay > 0) return;
    const fade = this.life < 0.4 ? clamp(this.life / 0.4, 0, 1) : 1;
    ctx.save();
    ctx.globalAlpha = 0.96 * fade;
    ctx.shadowBlur = 22;
    ctx.shadowColor = this.color;
    ctx.fillStyle = this.color;
    if (this.orientation === "vertical") {
      ctx.fillRect(this.x - this.width * 0.5, TOP_HUD_SAFE_Y, this.width, config.height - TOP_HUD_SAFE_Y);
    } else {
      ctx.fillRect(0, this.y - this.width * 0.5, config.width, this.width);
    }
    ctx.restore();
  }
}

class BossHazardLaser {
  constructor(config = {}) {
    this.x = config.x ?? 0;
    this.y = config.y ?? 0;
    this.angle = config.angle ?? 0;
    this.length = config.length ?? 720;
    this.width = config.width ?? 22;
    this.windup = Math.max(0, config.windup ?? 2);
    this.armDuration = config.armDuration ?? 1.35;
    this.damagePerSecond = config.damagePerSecond ?? 90;
    this.windupElapsed = 0;
    this.armed = this.windup <= 0;
    this.armElapsed = 0;
    this.dead = false;
  }
  pointInBeam(px, py, pr) {
    const dx = px - this.x;
    const dy = py - this.y;
    const c = Math.cos(-this.angle);
    const s = Math.sin(-this.angle);
    const lx = dx * c - dy * s;
    const ly = dx * s + dy * c;
    const halfL = this.length * 0.5;
    const halfW = this.width * 0.5 + pr;
    return lx >= -halfL && lx <= halfL && Math.abs(ly) <= halfW;
  }
  update(dt) {
    if (!this.armed) {
      this.windupElapsed += dt;
      if (this.windupElapsed >= this.windup) {
        this.armed = true;
        this.armElapsed = 0;
        for (let i = 0; i < 14; i++) {
          const t = i / 14;
          const lx = (t - 0.5) * this.length;
          const px = this.x + Math.cos(this.angle) * lx;
          const py = this.y + Math.sin(this.angle) * lx;
          state.particles.push(new Particle(px + rng(-5, 5), py + rng(-5, 5), "#ff7eb0"));
        }
      }
      return;
    }
    this.armElapsed += dt;
    const p = state.player;
    if (p && !p.invincible && this.pointInBeam(p.x, p.y, p.getHullHitRadius())) {
      absorbDamage(this.damagePerSecond * dt);
    }
    if (this.armElapsed >= this.armDuration) this.dead = true;
  }
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle);
    const dim = !this.armed;
    const windProg = this.windup > 0 ? Math.min(1, this.windupElapsed / this.windup) : 1;
    let alpha;
    if (dim) {
      alpha = 0.07 + 0.2 * windProg;
    } else {
      const fadeOut = this.armDuration > 0 ? Math.min(1, (this.armDuration - this.armElapsed) / 0.35) : 1;
      alpha = Math.min(0.96, 0.88 * fadeOut + 0.08);
    }
    ctx.globalAlpha = alpha;
    const w = this.length;
    const h = this.width;
    const g = ctx.createLinearGradient(-w / 2, 0, w / 2, 0);
    if (dim) {
      g.addColorStop(0, "rgba(255, 90, 130, 0.12)");
      g.addColorStop(0.5, "rgba(255, 140, 180, 0.2)");
      g.addColorStop(1, "rgba(255, 90, 130, 0.12)");
    } else {
      g.addColorStop(0, "rgba(255, 40, 90, 0.88)");
      g.addColorStop(0.5, "rgba(255, 220, 240, 0.98)");
      g.addColorStop(1, "rgba(255, 40, 90, 0.88)");
    }
    ctx.fillStyle = g;
    ctx.shadowBlur = dim ? 10 : 32;
    ctx.shadowColor = dim ? "rgba(255,100,150,0.35)" : "#ff3d6b";
    ctx.beginPath();
    if (typeof ctx.roundRect === "function") ctx.roundRect(-w / 2, -h / 2, w, h, 5);
    else ctx.rect(-w / 2, -h / 2, w, h);
    ctx.fill();
    ctx.restore();
  }
}
window.BossHazardLaser = BossHazardLaser;

class OrbitalAegisShield {
  constructor(index, total, duration = 4) {
    this.index = index;
    this.total = Math.max(1, total);
    this.angle = (index / this.total) * Math.PI * 2;
    this.radius = 72;
    this.life = duration;
    this.maxLife = duration;
    this.hp = 220;
    this.maxHp = 220;
    this.flashTimer = 0;
    this.x = state.player.x;
    this.y = state.player.y;
  }
  update(dt) {
    this.life -= dt;
    this.flashTimer = Math.max(0, this.flashTimer - dt);
    this.angle += dt * 1.25;
    const wave = Math.sin(performance.now() / 420 + this.index) * 7;
    const r = this.radius + wave;
    this.x = state.player.x + Math.cos(this.angle) * r;
    this.y = state.player.y + Math.sin(this.angle) * r * 0.82;
    for (let i = state.enemyBullets.length - 1; i >= 0; i--) {
      const bullet = state.enemyBullets[i];
      if (dist(bullet.x, bullet.y, this.x, this.y) > 38 + bullet.size) continue;
      state.enemyBullets.splice(i, 1);
      this.hp -= bullet.damage * 2.2;
      this.flashTimer = 0.16;
      for (let p = 0; p < 12; p++) {
        const spark = new Particle(this.x + rng(-8, 8), this.y + rng(-10, 10), "#b78cff");
        spark.life = rng(0.12, 0.25);
        spark.size = rng(2.2, 4.5);
        state.particles.push(spark);
      }
      if (this.hp <= 0) {
        this.life = 0;
        break;
      }
    }
  }
  draw(ctx) {
    const alpha = clamp(this.life / this.maxLife, 0, 1);
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.angle + Math.PI / 2);
    const flash = this.flashTimer > 0 ? 1 : 0;
    const col = flash ? "rgba(230,160,255,0.95)" : `rgba(150,95,220,${0.88 * alpha})`;
    ctx.fillStyle = col;
    ctx.strokeStyle = flash ? "#f0ccff" : "#c79bff";
    ctx.lineWidth = 2.2;
    ctx.shadowBlur = flash ? 24 : 10;
    ctx.shadowColor = flash ? "#f0ccff" : "#9f6cff";
    ctx.beginPath();
    ctx.moveTo(0, -9);
    ctx.lineTo(22, -5);
    ctx.lineTo(20, 6);
    ctx.lineTo(0, 11);
    ctx.lineTo(-20, 6);
    ctx.lineTo(-22, -5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
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
        enemy.timeDilationSlowFactor = 0.3;
        if (Math.random() < 0.05) {
          state.particles.push(new Particle(enemy.x, enemy.y, "#90ff90"));
        }
      } else if (enemy.timeDilationSlowFactor != null) {
        enemy.timeDilationSlowFactor = 1;
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

// Extracted: Enemy and Player core classes
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
    this.infernoIgniteDuration = 0;
    this.infernoIgniteDps = 0;
    this.ringFrontDamage = null;
    this.ringFrontKnockback = 0;
    this.ringFrontHitEnemies = null;
  }
  update(dt) {
    this.life -= dt;
    const prevR = this.radius;
    this.radius = Math.min(this.radius + this.speed * dt, this.maxRadius);
    const newR = this.radius;
    this.lastDamageTime += dt;

    if (this.ringFrontDamage != null) {
      if (!this.ringFrontHitEnemies) this.ringFrontHitEnemies = new WeakSet();
      const kb = this.ringFrontKnockback || 0;
      const rdmg = this.ringFrontDamage;
      for (let i = state.enemies.length - 1; i >= 0; i--) {
        const enemy = state.enemies[i];
        if (!enemy || enemy.hp <= 0) continue;
        if (this.ringFrontHitEnemies.has(enemy)) continue;
        const d = dist(this.x, this.y, enemy.x, enemy.y);
        const margin = enemy.size * 0.55 + 4;
        if (newR + margin >= d && prevR <= d + margin) {
          this.ringFrontHitEnemies.add(enemy);
          let dmg = rdmg;
          if (enemy.deathMarked) dmg *= 1.5;
          enemy.hp -= dmg;
          recordDamageDealt(dmg);
          const a = Math.atan2(enemy.y - this.y, enemy.x - this.x);
          const f = clamp(1 - d / (this.maxRadius + enemy.size + 1), 0.2, 1);
          enemy.x += Math.cos(a) * kb * f;
          enemy.y += Math.sin(a) * kb * f;
          enemy.x = clamp(enemy.x, enemy.size, config.width - enemy.size);
          enemy.y = clamp(enemy.y, TOP_HUD_SAFE_Y + enemy.size, config.height - enemy.size);
          if (enemy.hp <= 0) onEnemyDestroyed(enemy, i);
        }
      }
    }
    
    
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
          if (this.infernoIgniteDuration > 0 && this.infernoIgniteDps > 0) {
            enemy.infernoBurnTimer = Math.max(enemy.infernoBurnTimer || 0, this.infernoIgniteDuration);
            enemy.infernoBurnDps = Math.max(enemy.infernoBurnDps || 0, this.infernoIgniteDps);
          }
          
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
    this.opacityScale = config.opacityScale == null ? 1 : config.opacityScale;
    this.stunWhilePulled = config.stunWhilePulled !== false;
    this.azureVortex = !!config.azureVortex;
    this.aphelionCollapse = !!config.aphelionCollapse;
    this.streamBudget = 0;
    this.streamColors = config.streamColors || ["#00ffff", "#4ddbff", "#a8ffff", "#00b8d4"];
    this.voidwalkerHorizon = !!config.voidwalkerHorizon;
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
      if (!this.voidwalkerHorizon && d > this.radius + enemy.size) continue;
      if (this.pullEnabled && d > 1) {
        const pullAngle = Math.atan2(this.y - enemy.y, this.x - enemy.x);
        const radiusForFalloff = this.voidwalkerHorizon
          ? Math.max(this.pullRadius || this.maxRadius, Math.hypot(config.width, config.height) * 0.95)
          : this.radius + 1;
        const pullForce = this.pullStrength * dt * Math.max(0.12, 1 - d / radiusForFalloff);
        if (this.aphelionCollapse || this.voidwalkerHorizon) {
          const spiral = pullAngle + Math.PI / 2;
          const radial = pullForce * 0.55;
          const tang = pullForce * 0.68;
          enemy.x += Math.cos(pullAngle) * radial + Math.cos(spiral) * tang;
          enemy.y += Math.sin(pullAngle) * radial + Math.sin(spiral) * tang;
          enemy.fireTimer = Math.max(enemy.fireTimer, 3);
        } else {
          enemy.x += Math.cos(pullAngle) * pullForce;
          enemy.y += Math.sin(pullAngle) * pullForce;
          if (this.stunWhilePulled) {
            enemy.fireTimer = Math.max(enemy.fireTimer, 0.18);
          }
        }
      } else if (this.aphelionCollapse || this.voidwalkerHorizon) {
        enemy.fireTimer = Math.max(enemy.fireTimer, 3);
      }
      enemy.hp -= this.damagePerSecond * dt;
      if (enemy.hp <= 0) onEnemyDestroyed(enemy, i);
    }
    if (this.aphelionCollapse || this.voidwalkerHorizon) {
      for (let i = state.enemyBullets.length - 1; i >= 0; i--) {
        const bullet = state.enemyBullets[i];
        const d = dist(this.x, this.y, bullet.x, bullet.y);
        if (!this.voidwalkerHorizon && d > this.radius + 22) continue;
        if (this.voidwalkerHorizon && d > (this.pullRadius || this.maxRadius) + 40) continue;
        const pullB = this.pullStrength * 1.4 * dt * (1 - d / (this.radius + 48));
        const baseAng = Math.atan2(this.y - bullet.y, this.x - bullet.x);
        const spiral = baseAng + Math.PI / 2;
        const w = 0.54;
        bullet.x += Math.cos(baseAng) * pullB * w + Math.cos(spiral) * pullB * (1 - w);
        bullet.y += Math.sin(baseAng) * pullB * w + Math.sin(spiral) * pullB * (1 - w);
        bullet.vx *= 0.93;
        bullet.vy *= 0.93;
        if (d < 14) {
          state.enemyBullets.splice(i, 1);
          for (let p = 0; p < 4; p++) {
            state.particles.push(new Particle(this.x + rng(-5, 5), this.y + rng(-5, 5), p % 2 ? "#e8c8ff" : "#a070ff"));
          }
        }
      }
    }
    if (this.life <= 0 && this.explodeAtEnd && !this.exploded) {
      this.exploded = true;
      const kbR = this.knockbackRadius;
      for (let i = state.enemies.length - 1; i >= 0; i--) {
        const enemy = state.enemies[i];
        const d = dist(this.x, this.y, enemy.x, enemy.y);
        if (this.voidwalkerHorizon || d <= this.maxRadius + enemy.size) {
          enemy.hp -= this.explosionDamage;
          if (enemy.hp <= 0) onEnemyDestroyed(enemy, i);
        }
        if (
          this.explosionKnockback > 0 &&
          enemy.hp > 0 &&
          (this.voidwalkerHorizon || d <= kbR + enemy.size)
        ) {
          const a = Math.atan2(enemy.y - this.y, enemy.x - this.x);
          const falloff = this.voidwalkerHorizon ? 0.72 + 0.28 * (1 - Math.min(1, d / Math.max(kbR, 1))) : 1 - Math.min(1, d / Math.max(kbR, 1));
          const kb = this.explosionKnockback * falloff;
          enemy.x += Math.cos(a) * kb;
          enemy.y += Math.sin(a) * kb;
        }
      }
      const burstTint = this.voidwalkerHorizon ? "#b070ff" : this.aphelionCollapse ? "#c291ff" : this.azureVortex ? "#b6ffff" : "#8ad7ff";
      const count = this.voidwalkerHorizon ? 540 : this.aphelionCollapse ? 620 : this.azureVortex ? 420 : 220;
      for (let i = 0; i < count; i++) {
        const a = (i / count) * Math.PI * 2;
        const dist = rng(
          20,
          this.maxRadius * (this.voidwalkerHorizon ? 2.4 : this.aphelionCollapse ? 2.1 : this.azureVortex ? 1.65 : 1.2)
        );
        const p = new Particle(
          this.x + Math.cos(a) * dist,
          this.y + Math.sin(a) * dist,
          this.voidwalkerHorizon
            ? i % 2
              ? "#7a3dcc"
              : "#d4b8ff"
            : this.aphelionCollapse
              ? i % 2
                ? "#9d5bff"
                : "#d9b2ff"
              : this.azureVortex && i % 2
                ? "#00ffff"
                : burstTint
        );
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
      ctx.shadowColor = this.aphelionCollapse ? "#b07dff" : this.color;
    } else {
      ctx.globalAlpha = alpha * 0.7 * this.opacityScale;
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
      ctx.strokeStyle = this.aphelionCollapse ? "rgba(205,170,255,0.74)" : "rgba(255,140,140,0.72)";
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius * 0.88, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius * 0.52, 0, Math.PI * 2);
      ctx.stroke();
      if (this.aphelionCollapse) {
        ctx.globalAlpha = alpha * 0.65;
        for (let i = 0; i < 24; i++) {
          const a = (i / 24) * Math.PI * 2 + performance.now() * 0.001;
          const len = this.radius * (0.45 + (i % 3) * 0.2);
          ctx.strokeStyle = i % 2 ? "rgba(186,130,255,0.75)" : "rgba(142,88,255,0.7)";
          ctx.lineWidth = 2 + (i % 3);
          ctx.beginPath();
          ctx.moveTo(this.x, this.y);
          ctx.lineTo(this.x + Math.cos(a) * len, this.y + Math.sin(a) * len);
          ctx.stroke();
        }
      }
    }
    if (this.voidwalkerHorizon) {
      const hudY = typeof TOP_HUD_SAFE_Y === "number" ? TOP_HUD_SAFE_Y : 0;
      const playH = config.height - hudY;
      ctx.globalAlpha = Math.min(0.5, alpha * 0.55);
      ctx.fillStyle = "rgba(12, 0, 28, 0.78)";
      ctx.fillRect(0, hudY, config.width, playH + 2);
      ctx.globalAlpha = alpha * 0.18;
      const maxD = Math.hypot(config.width, playH) * 0.72;
      const g2 = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, maxD);
      g2.addColorStop(0, "rgba(200, 120, 255, 0.35)");
      g2.addColorStop(0.5, "rgba(90, 30, 160, 0.12)");
      g2.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = g2;
      ctx.fillRect(0, hudY, config.width, playH + 2);
      ctx.globalAlpha = alpha * 0.22;
      for (let i = 0; i < 18; i++) {
        const a = (i / 18) * Math.PI * 2 + performance.now() * 0.0012;
        const len = Math.min(this.radius * 1.15, maxD * 0.55) * (0.55 + (i % 3) * 0.18);
        ctx.strokeStyle = i % 2 ? "rgba(160, 90, 230, 0.55)" : "rgba(100, 40, 180, 0.45)";
        ctx.lineWidth = 2.2;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x + Math.cos(a) * len, this.y + Math.sin(a) * len);
        ctx.stroke();
      }
    }
    ctx.restore();
  }
}

class TempestEyeStormVortex {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.maxRadius = Math.min(468, Math.hypot(config.width, config.height) * 0.44);
    this.radius = 0;
    this.life = 5.5;
    this.maxLife = this.life;
    this.age = 0;
    this.streamBudget = 0;
  }
  update(dt) {
    this.life -= dt;
    this.age += dt;
    const t = 1 - Math.max(this.life / this.maxLife, 0);
    this.radius = this.maxRadius * (0.1 + 0.9 * (1 - Math.pow(1 - t, 0.5)));
    const dm = state.player
      ? state.player.damageMultiplier * (state.player.abilityDamageMultiplier || 1)
      : 1;
    const dps = 26 * dm;
    const spiral = 620 * dt;
    const spinBias = 1.22 + Math.sin(this.age * 2.6) * 0.42;

    this.streamBudget += dt * 420;
    while (this.streamBudget >= 1) {
      this.streamBudget -= 1;
      const ang = Math.random() * Math.PI * 2;
      const distOut = this.radius * (0.22 + Math.random() * 0.98);
      const px = this.x + Math.cos(ang) * distOut;
      const py = this.y + Math.sin(ang) * distOut;
      const dir = Math.random() < 0.5 ? 1 : -1;
      const tangent = ang + (Math.PI / 2) * dir;
      const p = new Particle(px, py, Math.random() < 0.55 ? "#ffeb3b" : "#ffc400");
      const sp = rng(70, 220);
      p.vx = Math.cos(tangent) * sp + rng(-55, 55);
      p.vy = Math.sin(tangent) * sp + rng(-55, 55);
      p.life = rng(0.14, 0.4);
      p.size = rng(1.6, 4.6);
      state.particles.push(p);
    }

    for (let i = state.enemies.length - 1; i >= 0; i--) {
      const enemy = state.enemies[i];
      const d = dist(this.x, this.y, enemy.x, enemy.y);
      if (d > this.radius + enemy.size) continue;
      const falloff = Math.pow(1 - Math.min(1, d / Math.max(this.radius * 0.92, 1)), 0.62);
      if (d > 2) {
        const toCenter = Math.atan2(this.y - enemy.y, this.x - enemy.x);
        const swirl = toCenter + (Math.PI / 2) * spinBias;
        const radial = spiral * falloff * 0.38;
        const tang = spiral * falloff * 1.52;
        const wobble =
          Math.sin(this.age * 7.2 + (enemy.wave || 0) * 0.3 + d * 0.045) * spiral * falloff * 0.62;
        enemy.x += Math.cos(toCenter) * radial + Math.cos(swirl) * tang + Math.cos(swirl + Math.PI / 2) * wobble;
        enemy.y += Math.sin(toCenter) * radial + Math.sin(swirl) * tang + Math.sin(swirl + Math.PI / 2) * wobble;
      }
      const chunk = dps * dt;
      enemy.hp -= chunk;
      recordDamageDealt(chunk);
      if (enemy.hp <= 0) {
        onEnemyDestroyed(enemy, i);
        continue;
      }
      enemy.fireTimer = Math.max(enemy.fireTimer || 0, 0.42);
      enemy.x = clamp(enemy.x, enemy.size, config.width - enemy.size);
      enemy.y = clamp(enemy.y, TOP_HUD_SAFE_Y + enemy.size, config.height - enemy.size);
    }

    for (let j = state.enemyBullets.length - 1; j >= 0; j--) {
      const bullet = state.enemyBullets[j];
      const d = dist(this.x, this.y, bullet.x, bullet.y);
      if (d > this.radius + 48) continue;
      const falloff = 1 - Math.min(1, d / Math.max(this.radius + 40, 1));
      if (d > 1) {
        const baseAng = Math.atan2(this.y - bullet.y, this.x - bullet.x);
        const tangA = baseAng + (Math.PI / 2) * spinBias;
        const pullB = 780 * dt * falloff * falloff;
        const w = 0.26;
        bullet.x += Math.cos(baseAng) * pullB * w + Math.cos(tangA) * pullB * (1 - w);
        bullet.y += Math.sin(baseAng) * pullB * w + Math.sin(tangA) * pullB * (1 - w);
        const sp = Math.hypot(bullet.vx, bullet.vy) || 1;
        const curA = Math.atan2(bullet.vy, bullet.vx);
        const twist = Math.sin(this.age * 6.5 + d * 0.09) * 1.15;
        const targetA = tangA + twist;
        let da = targetA - curA;
        while (da > Math.PI) da -= Math.PI * 2;
        while (da < -Math.PI) da += Math.PI * 2;
        const blend = clamp(0.32 * falloff, 0, 0.55);
        const na = curA + da * blend;
        bullet.vx = Math.cos(na) * sp;
        bullet.vy = Math.sin(na) * sp;
        bullet.vx *= 0.985;
        bullet.vy *= 0.985;
      }
    }

    for (let k = state.bullets.length - 1; k >= 0; k--) {
      const bullet = state.bullets[k];
      if (bullet.friendly) continue;
      const d = dist(this.x, this.y, bullet.x, bullet.y);
      if (d > this.radius + 52) continue;
      const falloff = 1 - Math.min(1, d / Math.max(this.radius + 44, 1));
      if (d > 1) {
        const baseAng = Math.atan2(this.y - bullet.y, this.x - bullet.x);
        const tangA = baseAng + (Math.PI / 2) * spinBias;
        const pullB = 720 * dt * falloff * falloff;
        const w = 0.26;
        bullet.x += Math.cos(baseAng) * pullB * w + Math.cos(tangA) * pullB * (1 - w);
        bullet.y += Math.sin(baseAng) * pullB * w + Math.sin(tangA) * pullB * (1 - w);
        const sp = Math.hypot(bullet.vx, bullet.vy) || 1;
        const curA = Math.atan2(bullet.vy, bullet.vx);
        const twist = Math.sin(this.age * 6.5 + d * 0.09) * 1.05;
        const targetA = tangA + twist;
        let da = targetA - curA;
        while (da > Math.PI) da -= Math.PI * 2;
        while (da < -Math.PI) da += Math.PI * 2;
        const blend = clamp(0.28 * falloff, 0, 0.5);
        const na = curA + da * blend;
        bullet.vx = Math.cos(na) * sp;
        bullet.vy = Math.sin(na) * sp;
        bullet.vx *= 0.986;
        bullet.vy *= 0.986;
      }
    }
  }
  draw(ctx) {
    const alpha = clamp(this.life / this.maxLife, 0, 1);
    const spin = this.age * 1.85;
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.globalAlpha = alpha * 0.88;
    ctx.shadowBlur = 48;
    ctx.shadowColor = "rgba(255, 210, 60, 0.95)";
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, this.radius);
    g.addColorStop(0, "rgba(255, 248, 180, 0.95)");
    g.addColorStop(0.22, "rgba(255, 220, 80, 0.72)");
    g.addColorStop(0.5, "rgba(255, 193, 7, 0.45)");
    g.addColorStop(0.78, "rgba(255, 160, 0, 0.2)");
    g.addColorStop(1, "rgba(255, 140, 0, 0)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = alpha * 0.72;
    ctx.strokeStyle = "rgba(255, 235, 120, 0.82)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius * 0.92, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, this.radius * 0.55, 0, Math.PI * 2);
    ctx.stroke();
    ctx.globalAlpha = alpha * 0.68;
    const arms = 40;
    for (let i = 0; i < arms; i++) {
      const base = (i / arms) * Math.PI * 2 + spin;
      const coil = 2.1 + (i % 5) * 0.35;
      ctx.strokeStyle = i % 2 === 0 ? "rgba(255, 240, 140, 0.75)" : "rgba(255, 180, 40, 0.65)";
      ctx.lineWidth = 1.8 + (i % 4) * 0.45;
      ctx.beginPath();
      const steps = 14;
      for (let s = 0; s <= steps; s++) {
        const u = s / steps;
        const r = this.radius * (0.06 + u * 0.94);
        const a = base + u * coil;
        const px = Math.cos(a) * r;
        const py = Math.sin(a) * r;
        if (s === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }
    ctx.globalAlpha = alpha * 0.45;
    ctx.strokeStyle = "rgba(255, 255, 200, 0.5)";
    ctx.lineWidth = 1.2;
    for (let r = 0; r < 5; r++) {
      const rr = this.radius * (0.28 + r * 0.16);
      ctx.beginPath();
      ctx.arc(0, 0, rr, spin * 0.6 + r * 0.4, spin * 0.6 + r * 0.4 + Math.PI * 1.25);
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
    this.specterDecoy = false;
    this.infernoSwarm = false;
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
        if (this.specterDecoy) {
          continue;
        }
        const dmgOrb =
          (this.infernoSwarm ? 15 : 22) *
          state.player.damageMultiplier *
          state.player.abilityDamageMultiplier;
        enemy.hp -= dmgOrb;
        recordDamageDealt(dmgOrb);
        const a = Math.atan2(enemy.y - state.player.y, enemy.x - state.player.x);
        enemy.x += Math.cos(a) * 16;
        enemy.y += Math.sin(a) * 16;
        const prevHp = state.player.hp;
        state.player.hp = Math.min(state.player.maxHp, state.player.hp + 1.2);
        recordHealthRegen(state.player.hp - prevHp);
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
    } else if (this.specterDecoy) {
      g.addColorStop(0, "rgba(255,255,255,0.95)");
      g.addColorStop(0.5, "rgba(230,230,255,0.35)");
      g.addColorStop(1, "rgba(200,200,255,0)");
      ctx.shadowBlur = 8;
      ctx.shadowColor = "#ffffff";
    } else if (this.infernoSwarm) {
      g.addColorStop(0, "#ffcf6d");
      g.addColorStop(0.5, "#ff5a2a");
      g.addColorStop(1, "rgba(255,40,0,0)");
      ctx.shadowBlur = 16;
      ctx.shadowColor = "#ff4500";
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

class AphelionKeelPortal {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.life = 4.5;
    this.maxLife = this.life;
    this.fireCd = 0.05;
    this.phase = Math.random() * Math.PI * 2;
  }
  update(dt) {
    this.life -= dt;
    this.phase += dt * 2.4;
    this.fireCd -= dt;
    if (this.fireCd <= 0) {
      this.fireCd = 0.26;
      const base = -Math.PI / 2 + rng(-0.38, 0.38);
      const bolt = new Bullet(
        this.x,
        this.y - 6,
        base + rng(-0.06, 0.06),
        rng(380, 500) * state.player.shotSpeedMultiplier,
        true,
        6,
        "#c45fff",
        14 * state.player.damageMultiplier * state.player.abilityDamageMultiplier
      );
      bolt.life = 2.2;
      state.bullets.push(bolt);
    }
    return this.life <= 0;
  }
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    const rx = 36;
    const ry = 16;
    const g = ctx.createRadialGradient(0, 0, 2, 0, 0, rx);
    g.addColorStop(0, "rgba(255, 252, 255, 1)");
    g.addColorStop(0.28, "rgba(210, 150, 255, 1)");
    g.addColorStop(0.55, "rgba(140, 60, 230, 1)");
    g.addColorStop(0.82, "rgba(70, 20, 160, 0.98)");
    g.addColorStop(1, "rgba(20, 0, 60, 0)");
    ctx.globalAlpha = 1;
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.98)";
    ctx.lineWidth = 3;
    ctx.stroke();
    const t = this.phase;
    for (let s = 0; s < 2; s++) {
      ctx.strokeStyle = s === 0 ? "rgba(120, 200, 255, 0.92)" : "rgba(190, 110, 255, 0.95)";
      ctx.lineWidth = s === 0 ? 2.2 : 2;
      ctx.beginPath();
      const turns = 2.6 + s * 0.35;
      const steps = 48;
      for (let i = 0; i <= steps; i++) {
        const u = i / steps;
        const ang = u * turns * Math.PI * 2 + t * (s === 0 ? 1 : -1.1);
        const rad = 4 + u * (rx * 0.82);
        const px = Math.cos(ang) * rad * (1.05 - u * 0.12);
        const py = Math.sin(ang) * rad * (0.42 - u * 0.08);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }
    ctx.strokeStyle = "rgba(160, 120, 255, 0.9)";
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.ellipse(0, 0, rx * 0.55, ry * 0.5, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

class SeraphBounceLaser {
  constructor(x, y, angle) {
    this.x = x;
    this.y = y;
    const sp = 560;
    this.vx = Math.cos(angle) * sp;
    this.vy = Math.sin(angle) * sp;
    this.life = 5;
    this.segLen = 44;
    this.hitHalfW = 5.5;
    this.damage =
      28 *
      state.player.damageMultiplier *
      (state.player.abilityDamageMultiplier != null ? state.player.abilityDamageMultiplier : 1);
    this.bounceCd = 0;
  }
  tail() {
    const sp = Math.hypot(this.vx, this.vy) || 560;
    return {
      tx: this.x - (this.vx / sp) * this.segLen,
      ty: this.y - (this.vy / sp) * this.segLen,
    };
  }
  update(dt) {
    this.life -= dt;
    this.bounceCd = Math.max(0, this.bounceCd - dt);
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    const margin = 22;
    if (this.x < margin) {
      this.vx = Math.abs(this.vx);
      this.x = margin;
    } else if (this.x > config.width - margin) {
      this.vx = -Math.abs(this.vx);
      this.x = config.width - margin;
    }
    const topM = TOP_HUD_SAFE_Y + 18;
    if (this.y < topM) {
      this.vy = Math.abs(this.vy);
      this.y = topM;
    } else if (this.y > config.height - margin) {
      this.vy = -Math.abs(this.vy);
      this.y = config.height - margin;
    }
    const { tx, ty } = this.tail();
    if (this.bounceCd <= 0) {
      for (let i = state.enemies.length - 1; i >= 0; i--) {
        const en = state.enemies[i];
        const d = pointToSegmentDistance(en.x, en.y, this.x, this.y, tx, ty);
        if (d > this.hitHalfW + en.size * 0.48) continue;
        en.hp -= this.damage;
        recordDamageDealt(this.damage);
        if (en.hp <= 0) onEnemyDestroyed(en, i);
        this.bounceCd = 0.12;
        let best = null;
        let bestD = 1e9;
        const sp0 = Math.hypot(this.vx, this.vy) || 560;
        for (const e2 of state.enemies) {
          if (e2.hp <= 0) continue;
          const dx = e2.x - this.x;
          const dy = e2.y - this.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 8 || dist > 540) continue;
          const fwd = (this.vx * dx + this.vy * dy) / (sp0 * dist);
          if (fwd > -0.35 && dist < bestD) {
            bestD = dist;
            best = e2;
          }
        }
        const na = best
          ? Math.atan2(best.y - this.y, best.x - this.x)
          : Math.atan2(this.vy, this.vx) + rng(-1.0, 1.0);
        this.vx = Math.cos(na) * sp0;
        this.vy = Math.sin(na) * sp0;
        break;
      }
    }
    return this.life <= 0;
  }
  draw(ctx) {
    const { tx, ty } = this.tail();
    ctx.save();
    ctx.strokeStyle = "#ff1515";
    ctx.lineWidth = 7;
    ctx.shadowBlur = 18;
    ctx.shadowColor = "#ff0000";
    ctx.globalAlpha = 1;
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.lineTo(this.x, this.y);
    ctx.stroke();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(tx, ty);
    ctx.lineTo(this.x, this.y);
    ctx.stroke();
    ctx.shadowBlur = 0;
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
  decorativeLightning: [],
  boltCage: null,
  emberFog: null,
  stingerPoisonFogs: [],
  clawPawShield: null,
  eclipseTotality: null,
  eclipseUmbralWall: null,
  pendingEclipseUmbralWall: null,
  specterBladeStorm: null,
  specterPhantasm: null,
  wardenJudgmentChains: null,
  oracleChronos: null,
  oracleForesightWings: null,
  oracleLightningStorm: null,
  ravenUnkindnessRush: null,
  ravenUnkindnessField: [],
  ravenOmenSwarm: null,
  voidTrails: [],
  scytheSwings: [],
  reaperPortals: [],
  reaperMinions: [],
  reaperChains: [],
  solarFlares: [],
  fireColumns: [],
  grimstarWaves: [],
  novaAnomalies: [],
  tempestEyeStorms: [],
  novaOrbiters: [],
  bluefallPortals: [],
  powerUps: [],
  drones: [],
  barriers: [],
  blackHoles: [],
  expandingCircles: [],
  timeDilationFields: [],
  screenLasers: [],
  bossHazardLasers: [],
  aphelionPortalBursts: [],
  aphelionKeelPortals: [],
  seraphBounceLasers: [],
  aphelionShields: [],
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
  upgradePanelRevealTimeoutId: null,
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
  movementKeys: loadMovementKeys(),
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
  lifetimeKills: Number(localStorage.getItem("orbital-lifetime-kills") || 0),
  campaignLevelsCompleted: Number(localStorage.getItem("orbital-campaign-levels-completed") || 0),
  campaignBossKills: Number(localStorage.getItem("orbital-campaign-boss-kills") || 0),
  lifetimeBossKills: Number(localStorage.getItem("orbital-lifetime-boss-kills") || 0),
  lifetimeDamageDealt: Number(localStorage.getItem("orbital-lifetime-dmg-dealt") || 0),
  lifetimeDamageTaken: Number(localStorage.getItem("orbital-lifetime-dmg-taken") || 0),
  lifetimeAbilitiesUsed: Number(localStorage.getItem("orbital-lifetime-abilities-used") || 0),
  lifetimeHealthRegen: Number(localStorage.getItem("orbital-lifetime-health-regen") || 0),
  lifetimeShieldRegen: Number(localStorage.getItem("orbital-lifetime-shield-regen") || 0),
  lifetimeEnergyRegen: Number(localStorage.getItem("orbital-lifetime-energy-regen") || 0),
  runDamageDealt: 0,
  runDamageTaken: 0,
  runAbilitiesUsed: 0,
  runHealthRegen: 0,
  runShieldRegen: 0,
  runEnergyRegen: 0,
  runBossKills: 0,
  runNearDeathStart: 0,
  runNearDeathTriggered: false,
  runOneHpStart: 0,
  runOneHpTriggered: false,
  killTimestamps: [],
  damageTakenTimestamps: [],
};

if (
  mainHub &&
  !localStorage.getItem(TUTORIAL_COMPLETED_KEY) &&
  !state.achievements["tutorial-complete"]
) {
  mainHub.classList.add("hidden");
}

const hasShipAccess = (shipId) =>
  state.unlockedShips.includes(shipId) || state.tempAllShipsTrial || state.tempTrialRunActive;

const isAtlasShipId = (shipId) => typeof shipId === "string" && shipId.startsWith("atlas-");

const ACHIEVEMENT_DEFS = [
  { id: "first-run", name: "First Sortie", desc: "Start your first mission." },
  { id: "tutorial-complete", name: "Briefed and Ready", desc: "Complete the tutorial." },
  { id: "first-kill", name: "First Contact", desc: "Defeat your first enemy." },
  { id: "kills-10", name: "Skirmisher", desc: "Defeat 10 enemies." },
  { id: "kills-50", name: "Interceptor", desc: "Defeat 50 enemies." },
  { id: "kills-100", name: "Battleline", desc: "Defeat 100 enemies." },
  { id: "kills-250", name: "Void Hunter", desc: "Defeat 250 enemies." },
  { id: "kills-500", name: "Star Reaper", desc: "Defeat 500 enemies." },
  { id: "boss-kill", name: "Boss Breaker", desc: "Defeat your first boss." },
  { id: "campaign-clear", name: "Campaign Cadet", desc: "Complete your first campaign level." },
  { id: "campaign-boss-1", name: "Conqueror I", desc: "Defeat your first campaign boss." },
  { id: "campaign-levels-10", name: "Conqueror II", desc: "Complete 10 campaign levels." },
  { id: "campaign-boss-3", name: "Conqueror III", desc: "Defeat 3 campaign bosses." },
  { id: "score-500", name: "Point Pilot I", desc: "Score 500 points in a run." },
  { id: "score-1000", name: "Point Pilot II", desc: "Score 1,000 points in a run." },
  { id: "score-5000", name: "Point Pilot III", desc: "Score 5,000 points in a run." },
  { id: "score-10000", name: "Point Pilot IV", desc: "Score 10,000 points in a run." },
  { id: "score-15000", name: "Point Pilot V", desc: "Score 15,000 points in a run." },
  { id: "cores-500", name: "Quantum Saver I", desc: "Accumulate 500 Quantum Cores." },
  { id: "cores-1000", name: "Quantum Saver II", desc: "Accumulate 1,000 Quantum Cores." },
  { id: "cores-5000", name: "Quantum Saver III", desc: "Accumulate 5,000 Quantum Cores." },
  { id: "cores-10000", name: "Quantum Saver IV", desc: "Accumulate 10,000 Quantum Cores." },
  { id: "ships-3", name: "Hangar Expansion I", desc: "Own 3 ships." },
  { id: "ships-5", name: "Hangar Expansion II", desc: "Own 5 ships." },
  { id: "ships-10", name: "Hangar Expansion III", desc: "Own 10 ships." },
  { id: "ships-15", name: "Hangar Expansion IV", desc: "Own 15 ships." },
  { id: "ships-25", name: "Hangar Expansion V", desc: "Own 25 ships." },
  { id: "clutch-5hp", name: "Thread the Needle", desc: "Drop to 5 HP or less and survive for 10 seconds." },
  { id: "clutch-1hp", name: "Last Pixel", desc: "Drop to 1 HP and survive for 10 seconds." },
  { id: "kills-burst-5", name: "Cascade I", desc: "Defeat 5 enemies in 1 second." },
  { id: "kills-burst-10", name: "Cascade II", desc: "Defeat 10 enemies in 1 second." },
  { id: "kills-burst-20", name: "Cascade III", desc: "Defeat 20 enemies in 1 second." },
];
Object.values(shipLoadouts).forEach((ship) => {
  ACHIEVEMENT_DEFS.push({
    id: `own-${ship.id}`,
    name: `Own ${ship.name}`,
    desc: `Add ${ship.name} to your ship collection.`,
  });
});

const ACHIEVEMENT_LADDERS = {
  cores: [20000, 50000, 100000, 250000],
  kills: [1000, 2500, 5000, 10000, 25000],
  bosses: [5, 10, 25, 50, 100],
  dmgDealtTotal: [100000, 500000, 1000000, 5000000, 10000000],
  dmgDealtRun: [5000, 15000, 40000, 100000, 250000],
  dmgTakenTotal: [50000, 150000, 500000, 1000000, 2500000],
  dmgTakenBurst: [80, 180, 350, 600],
  abilityTotal: [200, 1000, 3000, 7000, 15000],
  abilityRun: [30, 80, 160, 320],
  hpRegenTotal: [200, 1000, 3000, 8000, 20000],
  hpRegenRun: [60, 150, 350, 700],
  shieldRegenTotal: [500, 2000, 6000, 18000, 40000],
  shieldRegenRun: [150, 500, 1200, 2500],
  energyRegenTotal: [2000, 8000, 25000, 75000, 150000],
  energyRegenRun: [500, 1500, 4000, 9000],
};

const difficultyOrder = ["recruit", "adept", "veteran", "elite", "insane", "impossible", "nightmare", "abyssal", "oblivion"];
const difficultyDisplayNames = {
  recruit: "Recruit",
  adept: "Adept",
  veteran: "Veteran",
  elite: "Elite",
  insane: "Insane",
  impossible: "Impossible",
  nightmare: "Nightmare",
  abyssal: "Abyssal",
  oblivion: "Oblivion",
};

Object.entries(ACHIEVEMENT_LADDERS).forEach(([key, steps]) => {
  steps.forEach((target, idx) => {
    const id = `${key}-${target}`;
    let name = `${key.toUpperCase()} ${idx + 1}`;
    let desc = `Reach ${target}.`;
    if (key === "cores") {
      name = `Quantum Vault ${idx + 1}`;
      desc = `Accumulate ${target.toLocaleString()} Quantum Cores.`;
    } else if (key === "kills") {
      name = `Eradicator ${idx + 1}`;
      desc = `Defeat ${target.toLocaleString()} enemies total.`;
    } else if (key === "bosses") {
      name = `Apex Hunter ${idx + 1}`;
      desc = `Defeat ${target.toLocaleString()} bosses total.`;
    } else if (key === "dmgDealtTotal") {
      name = `Damage Ledger ${idx + 1}`;
      desc = `Deal ${target.toLocaleString()} total damage.`;
    } else if (key === "dmgDealtRun") {
      name = `Burst Report ${idx + 1}`;
      desc = `Deal ${target.toLocaleString()} damage in one run.`;
    } else if (key === "dmgTakenTotal") {
      name = `Scar Tissue ${idx + 1}`;
      desc = `Take ${target.toLocaleString()} damage total.`;
    } else if (key === "dmgTakenBurst") {
      name = `Impact Window ${idx + 1}`;
      desc = `Take ${target.toLocaleString()} damage within 1 second.`;
    } else if (key === "abilityTotal") {
      name = `Invoker ${idx + 1}`;
      desc = `Use ${target.toLocaleString()} abilities total.`;
    } else if (key === "abilityRun") {
      name = `Combo Reactor ${idx + 1}`;
      desc = `Use ${target.toLocaleString()} abilities in one run.`;
    } else if (key === "hpRegenTotal") {
      name = `Medic Protocol ${idx + 1}`;
      desc = `Regenerate ${target.toLocaleString()} health total.`;
    } else if (key === "hpRegenRun") {
      name = `Field Surgery ${idx + 1}`;
      desc = `Regenerate ${target.toLocaleString()} health in one run.`;
    } else if (key === "shieldRegenTotal") {
      name = `Shield Battery ${idx + 1}`;
      desc = `Regenerate ${target.toLocaleString()} shield total.`;
    } else if (key === "shieldRegenRun") {
      name = `Aegis Runtime ${idx + 1}`;
      desc = `Regenerate ${target.toLocaleString()} shield in one run.`;
    } else if (key === "energyRegenTotal") {
      name = `Capacitor Net ${idx + 1}`;
      desc = `Regenerate ${target.toLocaleString()} energy total.`;
    } else if (key === "energyRegenRun") {
      name = `Overclock Loop ${idx + 1}`;
      desc = `Regenerate ${target.toLocaleString()} energy in one run.`;
    }
    ACHIEVEMENT_DEFS.push({ id, name, desc });
  });
});

difficultyOrder.forEach((k) => {
  ACHIEVEMENT_DEFS.push({
    id: `wave-20-${k}`,
    name: `${difficultyDisplayNames[k]} Wavebreaker`,
    desc: `Reach wave 20 on ${difficultyDisplayNames[k]} difficulty.`,
  });
  ACHIEVEMENT_DEFS.push({
    id: `wave-40-${k}`,
    name: `${difficultyDisplayNames[k]} Deep Run`,
    desc: `Reach wave 40 on ${difficultyDisplayNames[k]} difficulty.`,
  });
});

const unlockAchievement = (id) => {
  if (state.achievements[id]) return;
  state.achievements[id] = true;
  localStorage.setItem("orbital-achievements", JSON.stringify(state.achievements));
  if (achievementToastContainer) {
    const def = ACHIEVEMENT_DEFS.find((a) => a.id === id);
    const toast = document.createElement("div");
    toast.className = "achievement-toast";
    toast.textContent = `Achievement Unlocked: ${def ? def.name : id}`;
    achievementToastContainer.appendChild(toast);
    setTimeout(() => {
      toast.remove();
    }, 3000);
  }
};

const persistStat = (key, value) => localStorage.setItem(key, String(Math.floor(value)));

const recordDamageDealt = (amount) => {
  const val = Math.max(0, amount || 0);
  if (val <= 0) return;
  state.lifetimeDamageDealt += val;
  state.runDamageDealt += val;
  persistStat("orbital-lifetime-dmg-dealt", state.lifetimeDamageDealt);
};

const recordDamageTaken = (amount) => {
  const val = Math.max(0, amount || 0);
  if (val <= 0) return;
  state.lifetimeDamageTaken += val;
  state.runDamageTaken += val;
  state.damageTakenTimestamps.push({ t: performance.now(), dmg: val });
  persistStat("orbital-lifetime-dmg-taken", state.lifetimeDamageTaken);
};

const recordAbilityUse = () => {
  state.lifetimeAbilitiesUsed += 1;
  state.runAbilitiesUsed += 1;
  persistStat("orbital-lifetime-abilities-used", state.lifetimeAbilitiesUsed);
};

const recordHealthRegen = (amount) => {
  const val = Math.max(0, amount || 0);
  if (val <= 0) return;
  state.lifetimeHealthRegen += val;
  state.runHealthRegen += val;
  persistStat("orbital-lifetime-health-regen", state.lifetimeHealthRegen);
};

const recordShieldRegen = (amount) => {
  const val = Math.max(0, amount || 0);
  if (val <= 0) return;
  state.lifetimeShieldRegen += val;
  state.runShieldRegen += val;
  persistStat("orbital-lifetime-shield-regen", state.lifetimeShieldRegen);
};

const recordEnergyRegen = (amount) => {
  const val = Math.max(0, amount || 0);
  if (val <= 0) return;
  state.lifetimeEnergyRegen += val;
  state.runEnergyRegen += val;
  persistStat("orbital-lifetime-energy-regen", state.lifetimeEnergyRegen);
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
    row.innerHTML = `<strong>${a.name}</strong><span>${a.desc}</span><em class="achievement-status">${unlocked ? "✓" : ""}</em>`;
    achievementsList.appendChild(row);
  });
  achievementsSummary.textContent = `${unlockedCount}/${ACHIEVEMENT_DEFS.length} unlocked`;
};

const refreshProgressAchievements = () => {
  const ownedShips = new Set(state.unlockedShips || []);
  ownedShips.forEach((id) => unlockAchievement(`own-${id}`));
  const ownedCount = ownedShips.size;
  if (ownedCount >= 3) unlockAchievement("ships-3");
  if (ownedCount >= 5) unlockAchievement("ships-5");
  if (ownedCount >= 10) unlockAchievement("ships-10");
  if (ownedCount >= 15) unlockAchievement("ships-15");
  if (ownedCount >= 25) unlockAchievement("ships-25");
  if (state.quantumCores >= 500) unlockAchievement("cores-500");
  if (state.quantumCores >= 1000) unlockAchievement("cores-1000");
  if (state.quantumCores >= 5000) unlockAchievement("cores-5000");
  if (state.quantumCores >= 10000) unlockAchievement("cores-10000");
  if (state.score >= 500) unlockAchievement("score-500");
  if (state.score >= 1000) unlockAchievement("score-1000");
  if (state.score >= 5000) unlockAchievement("score-5000");
  if (state.score >= 10000) unlockAchievement("score-10000");
  if (state.score >= 15000) unlockAchievement("score-15000");
  if (state.lifetimeKills >= 10) unlockAchievement("kills-10");
  if (state.lifetimeKills >= 50) unlockAchievement("kills-50");
  if (state.lifetimeKills >= 100) unlockAchievement("kills-100");
  if (state.lifetimeKills >= 250) unlockAchievement("kills-250");
  if (state.lifetimeKills >= 500) unlockAchievement("kills-500");
  if (state.campaignLevelsCompleted >= 10) unlockAchievement("campaign-levels-10");
  if (state.campaignBossKills >= 3) unlockAchievement("campaign-boss-3");
  ACHIEVEMENT_LADDERS.cores.forEach((v) => state.quantumCores >= v && unlockAchievement(`cores-${v}`));
  ACHIEVEMENT_LADDERS.kills.forEach((v) => state.lifetimeKills >= v && unlockAchievement(`kills-${v}`));
  ACHIEVEMENT_LADDERS.bosses.forEach((v) => state.lifetimeBossKills >= v && unlockAchievement(`bosses-${v}`));
  ACHIEVEMENT_LADDERS.dmgDealtTotal.forEach((v) => state.lifetimeDamageDealt >= v && unlockAchievement(`dmgDealtTotal-${v}`));
  ACHIEVEMENT_LADDERS.dmgDealtRun.forEach((v) => state.runDamageDealt >= v && unlockAchievement(`dmgDealtRun-${v}`));
  ACHIEVEMENT_LADDERS.dmgTakenTotal.forEach((v) => state.lifetimeDamageTaken >= v && unlockAchievement(`dmgTakenTotal-${v}`));
  ACHIEVEMENT_LADDERS.abilityTotal.forEach((v) => state.lifetimeAbilitiesUsed >= v && unlockAchievement(`abilityTotal-${v}`));
  ACHIEVEMENT_LADDERS.abilityRun.forEach((v) => state.runAbilitiesUsed >= v && unlockAchievement(`abilityRun-${v}`));
  ACHIEVEMENT_LADDERS.hpRegenTotal.forEach((v) => state.lifetimeHealthRegen >= v && unlockAchievement(`hpRegenTotal-${v}`));
  ACHIEVEMENT_LADDERS.hpRegenRun.forEach((v) => state.runHealthRegen >= v && unlockAchievement(`hpRegenRun-${v}`));
  ACHIEVEMENT_LADDERS.shieldRegenTotal.forEach((v) => state.lifetimeShieldRegen >= v && unlockAchievement(`shieldRegenTotal-${v}`));
  ACHIEVEMENT_LADDERS.shieldRegenRun.forEach((v) => state.runShieldRegen >= v && unlockAchievement(`shieldRegenRun-${v}`));
  ACHIEVEMENT_LADDERS.energyRegenTotal.forEach((v) => state.lifetimeEnergyRegen >= v && unlockAchievement(`energyRegenTotal-${v}`));
  ACHIEVEMENT_LADDERS.energyRegenRun.forEach((v) => state.runEnergyRegen >= v && unlockAchievement(`energyRegenRun-${v}`));
  const now = performance.now();
  state.damageTakenTimestamps = state.damageTakenTimestamps.filter((d) => now - d.t <= 1000);
  const damageBurst = state.damageTakenTimestamps.reduce((s, d) => s + d.dmg, 0);
  ACHIEVEMENT_LADDERS.dmgTakenBurst.forEach((v) => damageBurst >= v && unlockAchievement(`dmgTakenBurst-${v}`));
  if (state.runNearDeathTriggered) unlockAchievement("clutch-5hp");
  if (state.runOneHpTriggered) unlockAchievement("clutch-1hp");
  state.killTimestamps = state.killTimestamps.filter((t) => now - t <= 1000);
  const killBurst = state.killTimestamps.length;
  if (killBurst >= 5) unlockAchievement("kills-burst-5");
  if (killBurst >= 10) unlockAchievement("kills-burst-10");
  if (killBurst >= 20) unlockAchievement("kills-burst-20");
  if (state.mode === "endless") {
    if (state.wave >= 20) unlockAchievement(`wave-20-${state.difficultyKey}`);
    if (state.wave >= 40) unlockAchievement(`wave-40-${state.difficultyKey}`);
  }
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

const clearUpgradePanelRevealTimeout = () => {
  if (state.upgradePanelRevealTimeoutId != null) {
    clearTimeout(state.upgradePanelRevealTimeoutId);
    state.upgradePanelRevealTimeoutId = null;
  }
};

const applyUpgradeChoice = (choice) => {
  clearUpgradePanelRevealTimeout();
  choice.apply(state.player);
  upgradePanel.classList.add("hidden");
  state.upgradePending = false;
  state.paused = false;
  state.awaitingUpgrade = false;
  state.upgradeChoices = [];
  if (state.mode === "campaign" && state.wave >= state.campaignWaveTarget) {
    completeCampaignLevel();
    return;
  }
  state.wave++;
  spawnWave();
  updateHud();
};

const completeCampaignLevel = () => {
  clearUpgradePanelRevealTimeout();
  unlockAchievement("campaign-clear");
  state.campaignLevelsCompleted += 1;
  localStorage.setItem("orbital-campaign-levels-completed", String(state.campaignLevelsCompleted));
  state.campaignUnlockedLevel = Math.max(state.campaignUnlockedLevel, state.campaignLevel + 1);
  localStorage.setItem("orbital-campaign-unlocked-level", String(state.campaignUnlockedLevel));
  refreshProgressAchievements();
  state.running = false;
  state.paused = false;
  state.upgradePending = false;
  state.awaitingUpgrade = false;
  state.upgradeChoices = [];
  if (upgradePanel) upgradePanel.classList.add("hidden");
  if (campaignPanel) campaignPanel.classList.add("hidden");
  if (mainHub) mainHub.classList.add("hidden");
  if (instructionsEl) instructionsEl.classList.add("hidden");
  if (campaignCompleteTitle) {
    campaignCompleteTitle.textContent = `Level ${state.campaignLevel} Complete`;
  }
  if (campaignCompleteDetails) {
    const unlockedTo = Math.max(state.campaignUnlockedLevel, state.campaignLevel + 1);
    campaignCompleteDetails.textContent = `Score: ${state.score} · Waves: ${state.wave} · Next unlocked level: ${unlockedTo}`;
  }
  if (campaignCompletePanel) campaignCompletePanel.classList.remove("hidden");
  renderCampaignLevelGrid();
  updateHud();
};

const openUpgradePanel = () => {
  clearUpgradePanelRevealTimeout();
  state.upgradeChoices = [];
  if (upgradePanel) upgradePanel.classList.add("hidden");
  if (upgradeOptionsEl) upgradeOptionsEl.innerHTML = "";

  state.upgradePanelRevealTimeoutId = setTimeout(() => {
    state.upgradePanelRevealTimeoutId = null;
    if (!state.running || !state.awaitingUpgrade) return;
    if (!state.player) return;

    tone(520, 0.12, "triangle", audio.sfxVolume * 0.14);

    state.bullets = [];
    state.enemyBullets = [];
    state.particles = [];
    state.visualBeams = [];
    state.decorativeLightning = [];
    state.boltCage = null;
    state.emberFog = null;
    state.stingerPoisonFogs = [];
    state.clawPawShield = null;
    state.eclipseTotality = null;
    state.eclipseUmbralWall = null;
    state.pendingEclipseUmbralWall = null;
    state.specterBladeStorm = null;
    state.specterPhantasm = null;
    state.wardenJudgmentChains = null;
    state.oracleChronos = null;
    state.oracleForesightWings = null;
    state.oracleLightningStorm = null;
    state.ravenUnkindnessRush = null;
    state.ravenUnkindnessField = [];
    state.ravenOmenSwarm = null;
    state.voidTrails = [];
    state.scytheSwings = [];
    state.reaperPortals = [];
    state.reaperMinions = [];
    state.reaperChains = [];
    state.solarFlares = [];
    state.fireColumns = [];
    state.grimstarWaves = [];
    state.powerUps = [];
    state.drones = [];
    state.barriers = [];
    state.blackHoles = [];
    state.expandingCircles = [];
    state.timeDilationFields = [];
    state.screenLasers = [];
    state.bossHazardLasers = [];
    state.aphelionPortalBursts = [];
    state.aphelionKeelPortals = [];
    state.seraphBounceLasers = [];
    state.aphelionShields = [];
    state.novaAnomalies = [];
    state.tempestEyeStorms = [];
    state.novaOrbiters = [];
    state.bluefallPortals = [];

    state.player.x = config.width / 2;
    state.player.y = config.height - 100;
    state.player.boltChannelLock = 0;

    state.upgradePending = true;
    state.paused = true;
    state.upgradeChoices = pickUpgradeChoices();
    if (!state.upgradeChoices.length) {
      state.upgradePending = false;
      state.paused = false;
      state.awaitingUpgrade = false;
      state.wave++;
      spawnWave();
      updateHud();
      return;
    }
    if (!upgradePanel || !upgradeOptionsEl) {
      applyUpgradeChoice(state.upgradeChoices[0]);
      return;
    }
    upgradePanel.classList.remove("hidden");
    upgradeOptionsEl.innerHTML = "";
    state.upgradeChoices.forEach((choice) => {
      const button = document.createElement("button");
      button.className = "upgrade-option";
      button.innerHTML = `<strong>${choice.name}</strong><span>${choice.desc}</span>`;
      button.addEventListener("click", () => applyUpgradeChoice(choice));
      upgradeOptionsEl.appendChild(button);
    });
  }, 1000);
};

const onEnemyDestroyed = (enemy, _index) => {
  if (!enemy) return;
  const killIdx = state.enemies.indexOf(enemy);
  if (killIdx < 0) return;
  state.score += enemy.kind === "boss" ? 500 : 30;
  unlockAchievement("first-kill");
  state.lifetimeKills += 1;
  state.killTimestamps.push(performance.now());
  localStorage.setItem("orbital-lifetime-kills", String(state.lifetimeKills));
  recordDamageDealt(Math.max(0, enemy.maxHp || 0));
  
  
  const diff = getDifficulty();
  let coresAwarded = 0;
  if (enemy.kind === "boss") {
    state.lifetimeBossKills += 1;
    state.runBossKills += 1;
    persistStat("orbital-lifetime-boss-kills", state.lifetimeBossKills);
    coresAwarded = Math.floor((50 + state.wave * 5) * (diff.bossHpMultiplier || 1));
    if (state.mode === "campaign") {
      state.campaignBossKills += 1;
      localStorage.setItem("orbital-campaign-boss-kills", String(state.campaignBossKills));
      unlockAchievement("campaign-boss-1");
    }
  } else {
    const baseCores = 2 + state.wave * 0.5;
    const multiplier = diff.coreMultiplier || 1;
    coresAwarded = Math.floor(baseCores * multiplier);
  }
  state.quantumCores += coresAwarded;
  state.quantumCoresEarnedThisRun += coresAwarded;
  localStorage.setItem("orbital-quantum-cores", state.quantumCores);
  refreshProgressAchievements();
  
  
  if (enemy.kind === "splitter" && !enemy.hasSplit) {
    for (let i = 0; i < 2; i++) {
      const angle = (i / 2) * Math.PI * 2;
      const spawnX = enemy.x + Math.cos(angle) * 30;
      const spawnY = enemy.y + Math.sin(angle) * 30;
      if (spawnX > 30 && spawnX < config.width - 30 && spawnY > 30 && spawnY < config.height - 80) {
        const split = new Enemy("swarm", spawnX, spawnY, enemy.wave);
        split.hp = Math.max(1, Math.floor(Math.max(0, enemy.hp) / 2));
        split.maxHp = split.hp;
        state.enemies.push(split);
      }
    }
  }
  
  for (let k = 0; k < 25; k++) {
    state.particles.push(new Particle(enemy.x, enemy.y, "#ffb347"));
  }
  if (enemy.kind === "boss") {
    unlockAchievement("boss-kill");
    playSfx.bossDown();
    state.boss = null;
  } else {
    playSfx.enemyDown();
  }
  if (state.enemies[killIdx] === enemy) {
    state.enemies.splice(killIdx, 1);
  } else {
    const j = state.enemies.indexOf(enemy);
    if (j > -1) state.enemies.splice(j, 1);
  }
};

const consumeAbilityEnergy = (cost) => {
  if (state.player.energy < cost) return false;
  state.player.energy -= cost;
  recordAbilityUse();
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

// Extracted: ability handlers

const triggerAbility = (abilityType) => {
  const ability = state.player.abilities.find(a => a.type === abilityType);
  if (!ability) return;

  if (state.tutorialMode && !state.tutorialTestWave && state.tutorialStep < 2) {
    return;
  }

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
  const diff = getDifficulty();
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
  state.screenLasers = [];
  state.bossHazardLasers = [];
  state.aphelionPortalBursts = [];
  state.aphelionKeelPortals = [];
  state.seraphBounceLasers = [];
  state.aphelionShields = [];
  state.novaAnomalies = [];
  state.tempestEyeStorms = [];
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
    
    const bossTypes = ["titan", "sniper", "swarmlord", "vortex", "bosslaser", "sprayer"];
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
    const baseEnemyCount = diff.spawnBase || 10;
    const waveMultiplier = diff.spawnWaveMultiplier || 4.8;
    const waveRampBonus = diff.spawnRampBonus || 0.95;
    const enemyCount =
      baseEnemyCount +
      Math.floor(waveIndex * waveMultiplier + (waveIndex * waveIndex) * waveRampBonus * 0.08);
    const campaignCountMult = state.mode === "campaign" ? 1 + state.campaignLevel * 0.05 : 1;
    const randomVariation = Math.floor(rng(-2, 3));
    const totalEnemies = Math.max(1, Math.floor((enemyCount + randomVariation) * diff.enemyCount * campaignCountMult));
    state.totalEnemiesThisWave = totalEnemies;
    
    
    
    const baseMaxPerSegment = diff.maxPerSegment || 15;
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
    title: "Move",
    text: "Keys or arrows — see overlay.",
    checkComplete: () => state.tutorialProgress.moved,
    waitForManualAdvance: true,
    focus: "canvas",
    showKeyLayout: true,
    showMouseHint: false,
  },
  {
    title: "Aim",
    text: "Mouse aims · auto-fire.",
    checkComplete: () => state.tutorialProgress.shot,
    waitForManualAdvance: true,
    focus: "canvas",
    showKeyLayout: true,
    showMouseHint: true,
  },
  {
    title: "Abilities",
    text: "Tap {ABILITY1} · {ABILITY2} · {ABILITY3} when icons glow.",
    checkComplete: () =>
      state.tutorialProgress.usedAbility1 &&
      state.tutorialProgress.usedAbility2 &&
      state.tutorialProgress.usedAbility3,
    waitForManualAdvance: true,
    focus: "abilities",
    showKeyLayout: true,
    showMouseHint: false,
  },
  {
    title: "Status bars",
    text: "Hull · shield · energy.",
    checkComplete: () => true,
    waitForManualAdvance: true,
    focus: "hud",
    showKeyLayout: true,
    showMouseHint: false,
  },
  {
    title: "Goal",
    text: "Clear this wave.",
    checkComplete: () => true,
    waitForManualAdvance: true,
    focus: "canvas",
    showKeyLayout: true,
    showMouseHint: false,
  },
];

const formatTutorialText = (raw) => {
  const move = state.movementKeys || detectDefaultMovementKeys();
  const ability = state.abilityKeys || ["1", "2", "3"];
  const map = {
    "{MOVE_UP}": move.up.toUpperCase(),
    "{MOVE_LEFT}": move.left.toUpperCase(),
    "{MOVE_DOWN}": move.down.toUpperCase(),
    "{MOVE_RIGHT}": move.right.toUpperCase(),
    "{ABILITY1}": getKeyDisplay(ability[0] || "1"),
    "{ABILITY2}": getKeyDisplay(ability[1] || "2"),
    "{ABILITY3}": getKeyDisplay(ability[2] || "3"),
  };
  let text = raw || "";
  for (const [key, value] of Object.entries(map)) text = text.replaceAll(key, value);
  return text;
};

const clearTutorialFocusHighlights = () => {
  document.querySelectorAll(".tutorial-focus-highlight").forEach((el) => el.classList.remove("tutorial-focus-highlight"));
};

const getTutorialFocusElement = (focus) => {
  if (!focus) return null;
  if (focus === "canvas") return canvas;
  if (focus === "abilities") return abilityIcons;
  if (focus === "hud") return document.querySelector(".hud");
  return null;
};

const drawTutorialArrowTo = (targetEl) => {
  if (!tutorialArrow || !targetEl) return;
  const rect = targetEl.getBoundingClientRect();
  const startX = window.innerWidth * 0.5;
  const startY = 140 + 60;
  const targetX = rect.left + rect.width * 0.5;
  const targetY = rect.top + rect.height * 0.5;
  const dx = targetX - startX;
  const dy = targetY - startY;
  const len = Math.max(60, Math.hypot(dx, dy) - 30);
  const angle = Math.atan2(dy, dx);
  tutorialArrow.style.left = `${startX}px`;
  tutorialArrow.style.top = `${startY}px`;
  tutorialArrow.style.width = `${len}px`;
  tutorialArrow.style.transform = `rotate(${angle}rad)`;
  tutorialArrow.classList.remove("hidden");
};

const renderTutorialKeyLayout = (step) => {
  if (!tutorialKeyLayout) return;
  if (!step || !step.showKeyLayout) {
    tutorialKeyLayout.classList.add("hidden");
    tutorialKeyLayout.innerHTML = "";
    return;
  }
  const move = state.movementKeys || detectDefaultMovementKeys();
  const [a1, a2, a3] = state.abilityKeys || ["1", "2", "3"];
  const mouseHint =
    step.showMouseHint
      ? `<div class="tutorial-mouse-aim-hint" aria-hidden="true"><span class="tutorial-mouse-aim-hint__glyph"></span><span>Move mouse to aim</span></div>`
      : "";
  tutorialKeyLayout.innerHTML = `
    <h4>Controls</h4>
    <div class="tutorial-keys-grid">
      <div></div><div class="tutorial-keycap tutorial-keycap--active">${move.up.toUpperCase()}</div><div></div><div></div>
      <div class="tutorial-keycap tutorial-keycap--active">${move.left.toUpperCase()}</div><div class="tutorial-keycap tutorial-keycap--active">${move.down.toUpperCase()}</div><div class="tutorial-keycap tutorial-keycap--active">${move.right.toUpperCase()}</div><div class="tutorial-keycap tutorial-keycap--wide">Mouse aim</div>
      <div class="tutorial-keycap">↑</div><div class="tutorial-keycap">↓</div><div class="tutorial-keycap">←/→</div><div class="tutorial-keycap tutorial-keycap--wide">Arrows</div>
    </div>
    <div class="tutorial-key-layout__abilities">
      <span class="tutorial-key-layout__badge">Ability 1: ${getKeyDisplay(a1)}</span>
      <span class="tutorial-key-layout__badge">Ability 2: ${getKeyDisplay(a2)}</span>
      <span class="tutorial-key-layout__badge">Ability 3: ${getKeyDisplay(a3)}</span>
    </div>
    ${mouseHint}
  `;
  tutorialKeyLayout.classList.remove("hidden");
};

const startTutorial = () => {
  clearUpgradePanelRevealTimeout();
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
  state.decorativeLightning = [];
  state.boltCage = null;
  state.emberFog = null;
  state.stingerPoisonFogs = [];
  state.clawPawShield = null;
  state.eclipseTotality = null;
  state.eclipseUmbralWall = null;
  state.pendingEclipseUmbralWall = null;
  state.specterBladeStorm = null;
  state.specterPhantasm = null;
  state.wardenJudgmentChains = null;
  state.oracleChronos = null;
  state.oracleForesightWings = null;
  state.oracleLightningStorm = null;
  state.ravenUnkindnessRush = null;
  state.ravenUnkindnessField = [];
  state.ravenOmenSwarm = null;
  state.voidTrails = [];
  state.scytheSwings = [];
  state.reaperPortals = [];
  state.reaperMinions = [];
  state.reaperChains = [];
  state.solarFlares = [];
  state.fireColumns = [];
  state.grimstarWaves = [];
  state.powerUps = [];
  state.drones = [];
  state.barriers = [];
  state.blackHoles = [];
  state.expandingCircles = [];
  state.timeDilationFields = [];
  state.screenLasers = [];
  state.bossHazardLasers = [];
  state.aphelionPortalBursts = [];
  state.aphelionKeelPortals = [];
  state.seraphBounceLasers = [];
  state.aphelionShields = [];
  state.novaAnomalies = [];
  state.tempestEyeStorms = [];
  state.novaOrbiters = [];
  state.bluefallPortals = [];
  state.wave = 1;
  state.score = 0;
  state.quantumCoresEarnedThisRun = 0;
  state.runDamageDealt = 0;
  state.runDamageTaken = 0;
  state.runAbilitiesUsed = 0;
  state.runHealthRegen = 0;
  state.runShieldRegen = 0;
  state.runEnergyRegen = 0;
  state.runBossKills = 0;
  state.runNearDeathStart = 0;
  state.runNearDeathTriggered = false;
  state.runOneHpStart = 0;
  state.runOneHpTriggered = false;
  state.killTimestamps = [];
  state.damageTakenTimestamps = [];
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

  if (step.checkComplete() && !step.completed) {
    step.completed = true;
    updateTutorialDisplay();
  } else {
    updateTutorialDisplay();
  }
};

const advanceTutorialStep = () => {
  if (state.tutorialStep >= tutorialSteps.length - 1) {
    startTutorialTestWave();
    return;
  }
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
    
  }
};

const updateTutorialDisplay = () => {
  if (!state.tutorialMode) return;
  
  
  if (state.tutorialTestWave) {
    if (tutorialOverlay) tutorialOverlay.classList.add("hidden");
    if (tutorialTextTop) tutorialTextTop.classList.add("hidden");
    if (tutorialArrow) tutorialArrow.classList.add("hidden");
    if (tutorialKeyLayout) tutorialKeyLayout.classList.add("hidden");
    clearTutorialFocusHighlights();
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
    let text = formatTutorialText(step.text);
    
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
  clearTutorialFocusHighlights();
  if (tutorialArrow) tutorialArrow.classList.add("hidden");
  const focusEl = getTutorialFocusElement(step.focus);
  if (focusEl) {
    focusEl.classList.add("tutorial-focus-highlight");
    drawTutorialArrowTo(focusEl);
  }
  renderTutorialKeyLayout(step);
};

const startTutorialTestWave = () => {
  state.tutorialTestWave = true;
  tutorialOverlay.classList.add("hidden");
  if (tutorialArrow) tutorialArrow.classList.add("hidden");
  if (tutorialKeyLayout) tutorialKeyLayout.classList.add("hidden");
  clearTutorialFocusHighlights();
  
  
  state.difficultyKey = "recruit";
  state.wave = 1;
  state.waveComplete = false;
  state.enemiesToSpawn = [];
  state.spawnTimer = 0;
  state.segmentsSpawned = 0;
  state.currentSegmentEnemies = 0;
  
  spawnWave();
};

const finishOnboardingReturnToHub = () => {
  state.running = false;
  if (hudSettingsButton) hudSettingsButton.classList.add("hidden");
  if (abilityIcons) abilityIcons.classList.add("hidden");
  clearCanvas();
  if (state.player) {
    const loadout = shipLoadouts[state.shipKey] || shipLoadouts.striker;
    state.player.maxEnergy = loadout.maxEnergy;
    state.player.energy = Math.min(state.player.energy, state.player.maxEnergy);
  }
  if (mainHub) mainHub.classList.remove("hidden");
  instructionsEl.classList.add("hidden");
  if (instructionsPanel) instructionsPanel.classList.add("hidden");
  if (campaignPanel) campaignPanel.classList.add("hidden");
  if (achievementsPanel) achievementsPanel.classList.add("hidden");
  updateHud();
};

const endTutorial = (opts = {}) => {
  const skipped = !!opts.skipped;
  clearUpgradePanelRevealTimeout();
  state.tutorialMode = false;
  state.tutorialTestWave = false;
  if (tutorialOverlay) tutorialOverlay.classList.add("hidden");
  if (tutorialArrow) tutorialArrow.classList.add("hidden");
  if (tutorialKeyLayout) tutorialKeyLayout.classList.add("hidden");
  clearTutorialFocusHighlights();
  if (tutorialNextStepButton) tutorialNextStepButton.classList.add("hidden");

  localStorage.setItem(TUTORIAL_COMPLETED_KEY, skipped ? "skipped" : "complete");
  if (!skipped) {
    unlockAchievement("tutorial-complete");
    refreshProgressAchievements();
  }

  if (skipped) {
    finishOnboardingReturnToHub();
    return;
  }

  const splash = document.createElement("div");
  splash.className = "tutorial-complete-splash";
  splash.setAttribute("role", "dialog");
  splash.innerHTML = `<div class="tutorial-complete-splash__inner"><div class="tutorial-complete-splash__check">&#10003;</div><h2>Ready to play</h2><p class="tutorial-complete-splash__tap">Click or tap to continue</p></div>`;
  document.body.appendChild(splash);
  let dismissed = false;
  const dismiss = () => {
    if (dismissed) return;
    dismissed = true;
    splash.remove();
    finishOnboardingReturnToHub();
  };
  splash.addEventListener("click", dismiss);
  setTimeout(dismiss, 1400);
};

const resetGame = () => {
  clearUpgradePanelRevealTimeout();
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
  state.decorativeLightning = [];
  state.boltCage = null;
  state.emberFog = null;
  state.stingerPoisonFogs = [];
  state.clawPawShield = null;
  state.eclipseTotality = null;
  state.eclipseUmbralWall = null;
  state.pendingEclipseUmbralWall = null;
  state.specterBladeStorm = null;
  state.specterPhantasm = null;
  state.wardenJudgmentChains = null;
  state.oracleChronos = null;
  state.oracleForesightWings = null;
  state.oracleLightningStorm = null;
  state.ravenUnkindnessRush = null;
  state.ravenUnkindnessField = [];
  state.ravenOmenSwarm = null;
  state.voidTrails = [];
  state.scytheSwings = [];
  state.reaperPortals = [];
  state.reaperMinions = [];
  state.reaperChains = [];
  state.solarFlares = [];
  state.fireColumns = [];
  state.grimstarWaves = [];
  state.powerUps = [];
  state.drones = [];
  state.barriers = [];
  state.blackHoles = [];
  state.expandingCircles = [];
  state.timeDilationFields = [];
  state.screenLasers = [];
  state.bossHazardLasers = [];
  state.aphelionPortalBursts = [];
  state.aphelionKeelPortals = [];
  state.seraphBounceLasers = [];
  state.aphelionShields = [];
  state.novaAnomalies = [];
  state.tempestEyeStorms = [];
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

const escapeHtml = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[ch]));

const describeAbility = (ship, ability) => {
  if (ship.id === "pebble") {
    const pebbleHelp = {
      chainBolt: "Rapid line of 8 pebbles; each ricochets off the HUD bar and arena walls.",
      burst: "Five pebbles in a forward cone; each bounces off the HUD bar and all walls.",
      fortify: "Huge spiked boulder for 5s—infinite screen bounces, damage, and knockback.",
    }[ability.type];
    if (pebbleHelp) return `${ability.name} (${ability.cost} energy): ${pebbleHelp}`;
  }
  if (ship.id === "bolt") {
    const boltHelp = {
      rapidVolley: "Launches a slow ion orb forward: crackling blue lightning, constant contact damage.",
      chainBolt: "Jagged lightning to the nearest foe, chaining up to 10 times (−10% damage each hop); bolts linger ~1.5s.",
      shockwave:
        "6s lock-in: 15 rotating spokes from beneath your hull—damage + stun only if a foe touches a bolt; enemy bullets freeze only in that same bolt zone; you cannot move.",
    }[ability.type];
    if (boltHelp) return `${ability.name} (${ability.cost} energy): ${boltHelp}`;
  }
  const textByType = {
    burst: "Area burst or explosive projectile pattern for clearing clustered enemies.",
    rapidVolley: "Short burst of extra shots or faster fire for immediate pressure.",
    energySurge: "Temporary ship buff that improves firing or resource flow.",
    shockwave: "Close-range pulse that controls nearby enemies and projectiles.",
    shieldOvercharge: "Defensive surge that improves shields or creates protective fields.",
    fortify: "Defensive stance or barrier effect that trades movement for control.",
    blink: "Dash, lunge, or teleport movement with a follow-up attack.",
    ghostfire: "Spectral projectile pattern with unusual movement or delayed pressure.",
    phaseShift: "Phase movement or illusion effect that disrupts enemy aim.",
    lightningStorm: "Targeted lightning strikes or chained electric damage.",
    combatDrone: "Summons allies or orbiters that attack alongside the ship.",
    overload: "Major tier-defining power effect with strong area damage.",
    siegeCannon: "Heavy aimed attack with high damage over a narrow line.",
    energyBarrier: "Protective orbit, wall, or crown that blocks incoming fire.",
    rampage: "Aggressive temporary weapon boost.",
    blackHole: "Gravity well that pulls enemies and disrupts movement.",
    shadowStep: "Dark repositioning effect with burst damage.",
    ethereal: "Intangible or fake-ship effect that confuses enemies.",
    deathMark: "Marks, harvests, or slashes enemies for focused damage.",
    soulHarvest: "Summons or life-steal effect tied to nearby enemies.",
    supernova: "Large radiant detonation or sweeping ultimate.",
    azureCataclysm: "Massive azure collapse with pull, damage, and knockback.",
    bluefallBarrage: "Portal barrage that floods the screen with falling shots.",
    novaSwarmDrones: "Summons star-like orbiters that fire independently.",
    starfall: "Targeted falling, puddle, or mouse-centered impact attack.",
    voidRift: "Void tear that pulls enemies and spawns rift damage.",
    dimensionalSlash: "Screen-cutting slash or chain effect with high burst value.",
  };
  return `${ability.name} (${ability.cost} energy): ${textByType[ability.type] || "Special ship ability."}`;
};

const describeShip = (ship) => {
  const tier = getTierInfo(ship.tier || "common").name;
  const abilityText = (ship.abilities || []).map((a) => describeAbility(ship, a)).join("\n");
  return `${ship.name} - ${tier}\nSpeed ${ship.speed}, HP ${ship.maxHp}, Shield ${ship.maxShield}, Energy ${ship.maxEnergy}.\nBasic attack scales with the ship's tier and unique weapon pattern.\n\nAbilities:\n${abilityText}`;
};

const abilityHelpHtml = (ship, ability) =>
  `<span class="ability-help" aria-label="Ability details">?</span>`;

const tooltipAttr = (text) => `data-tooltip="${escapeHtml(text)}"`;

let activeTooltipTarget = null;
let neonTooltipEl = null;

const ensureNeonTooltip = () => {
  if (neonTooltipEl) return neonTooltipEl;
  neonTooltipEl = document.createElement("div");
  neonTooltipEl.className = "neon-tooltip hidden";
  document.body.appendChild(neonTooltipEl);
  return neonTooltipEl;
};

const positionNeonTooltip = (event) => {
  if (!activeTooltipTarget || !neonTooltipEl) return;
  const pad = 14;
  const rect = neonTooltipEl.getBoundingClientRect();
  let x = event.clientX + 18;
  let y = event.clientY + 18;
  if (x + rect.width + pad > window.innerWidth) x = event.clientX - rect.width - 18;
  if (y + rect.height + pad > window.innerHeight) y = event.clientY - rect.height - 18;
  neonTooltipEl.style.left = `${Math.max(pad, x)}px`;
  neonTooltipEl.style.top = `${Math.max(pad, y)}px`;
};

document.addEventListener("mouseover", (event) => {
  const target = event.target.closest("[data-tooltip]");
  if (!target) return;
  activeTooltipTarget = target;
  const tip = ensureNeonTooltip();
  tip.textContent = target.dataset.tooltip || "";
  tip.classList.remove("hidden");
  positionNeonTooltip(event);
});

document.addEventListener("mousemove", (event) => {
  const target = event.target.closest("[data-tooltip]");
  if (!target || target !== activeTooltipTarget) return;
  positionNeonTooltip(event);
});

document.addEventListener("mouseout", (event) => {
  if (!activeTooltipTarget || activeTooltipTarget.contains(event.relatedTarget)) return;
  activeTooltipTarget = null;
  if (neonTooltipEl) neonTooltipEl.classList.add("hidden");
});

const getAbilityIcon = (abilityType) => {
  const typeClass = `ability-glyph--${String(abilityType || "default").replace(/[^a-z0-9-]/gi, "")}`;
  const shape =
    abilityType === "energyBarrier" || abilityType === "shieldOvercharge" || abilityType === "fortify"
      ? '<path d="M16 3 L27 8 V17 C27 24 22 28 16 31 C10 28 5 24 5 17 V8 Z" />'
      : abilityType === "blink" || abilityType === "phaseShift" || abilityType === "shadowStep"
        ? '<path d="M6 23 C13 7 22 8 27 6 C22 13 24 20 12 27 L16 18 Z" />'
        : abilityType === "blackHole" || abilityType === "voidRift"
          ? '<circle cx="16" cy="16" r="10" /><path d="M5 16 C9 5 24 5 27 16 C23 27 8 27 5 16 Z" />'
          : abilityType === "deathMark" || abilityType === "soulHarvest" || abilityType === "dimensionalSlash"
            ? '<path d="M6 24 L25 5" /><path d="M9 8 C16 2 27 6 26 16 C24 25 13 29 6 22" />'
            : abilityType === "supernova" || abilityType === "starfall"
              ? '<path d="M16 3 L19 12 L29 12 L21 18 L24 29 L16 22 L8 29 L11 18 L3 12 L13 12 Z" />'
              : abilityType === "overload" || abilityType === "burst"
                ? '<circle cx="16" cy="16" r="5" /><path d="M16 2 V10 M16 22 V30 M2 16 H10 M22 16 H30 M6 6 L11 11 M21 21 L26 26 M26 6 L21 11 M11 21 L6 26" />'
                : '<path d="M5 20 L16 4 L27 20 L18 19 L16 29 L14 19 Z" />';
  return `<svg class="ability-glyph ${typeClass}" viewBox="0 0 32 32" aria-hidden="true">${shape}</svg>`;
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
    const ship = shipLoadouts[state.player.shipId] || shipLoadouts[state.shipKey];
    
    const iconDiv = document.createElement("div");
    iconDiv.className = `ability-icon ${isReady ? "ready" : "not-ready"}`;
    iconDiv.dataset.tooltip = describeAbility(ship, ability);
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
  refreshProgressAchievements();
  if (hud.quantumCores) {
    hud.quantumCores.textContent = state.quantumCores;
  }
  updateAbilityIcons();
};

const enemyFlankedByAim = (enemy) => {
  const p = state.player;
  const forward = Math.atan2(input.mouse.y - p.y, input.mouse.x - p.x);
  const toEnemy = Math.atan2(enemy.y - p.y, enemy.x - p.x);
  let diff = toEnemy - forward;
  while (diff > Math.PI) diff -= Math.PI * 2;
  while (diff < -Math.PI) diff += Math.PI * 2;
  return Math.abs(diff) > 1.12;
};

const friendlyBulletTouchesEnemy = (bullet, enemy) => {
  if (bullet.hitEllipseW != null && bullet.hitEllipseH != null) {
    const ang = Math.atan2(bullet.vy, bullet.vx);
    const cos = Math.cos(-ang);
    const sin = Math.sin(-ang);
    const dx = enemy.x - bullet.x;
    const dy = enemy.y - bullet.y;
    const lx = dx * cos - dy * sin;
    const ly = dx * sin + dy * cos;
    const hw = bullet.hitEllipseW + enemy.size;
    const hh = bullet.hitEllipseH + enemy.size;
    return (lx * lx) / (hw * hw) + (ly * ly) / (hh * hh) <= 1;
  }
  return dist(enemy.x, enemy.y, bullet.x, bullet.y) < enemy.size + bullet.size;
};

const handleCollisions = (dt) => {
  for (let i = state.enemies.length - 1; i >= 0; i--) {
    const enemy = state.enemies[i];
    for (let j = state.bullets.length - 1; j >= 0; j--) {
      const bullet = state.bullets[j];
      if (
        bullet.friendly &&
        friendlyBulletTouchesEnemy(bullet, enemy)
      ) {
        if (bullet.clawHoverPaw) {
          continue;
        }
        if (bullet.boltIonOrb) {
          continue;
        }
        if (bullet.pebbleBoulder && performance.now() < (bullet._pebbleNextDmg || 0)) {
          continue;
        }
        bullet.hitSomething = true;
        if (bullet.voidwalkerMicro) {
          const dx = enemy.x - bullet.x;
          const dy = enemy.y - bullet.y;
          const d = Math.hypot(dx, dy) || 1;
          if (d < 120 && enemy.size < 28) {
            enemy.x += (dx / d) * 28 * dt;
            enemy.y += (dy / d) * 28 * dt;
          }
        }
        let hitDamage = bullet.damage;
        if (bullet.phantomPhaseBasic && !bullet.phaseConsumed) {
          bullet.phaseConsumed = true;
          hitDamage *= 0.3;
          bullet.piercing = true;
          bullet.pierceCount = Math.max(bullet.pierceCount || 0, 1);
        }
        if (bullet.voidwalkerSlash && !bullet.voidwalkerPhaseBlade) {
          hitDamage *= bullet.voidwalkerScale || 1;
          bullet.voidwalkerScale = (bullet.voidwalkerScale || 1) * 0.8;
          bullet.size = Math.max(1.6, bullet.size * 0.9);
        }
        if (enemy.picketShred && !bullet.picketTri) {
          hitDamage *= 1 + enemy.picketShred * 0.1;
        }
        if (bullet.sparrowFeather) {
          enemy.sparrowFeatherHits = enemy.sparrowFeatherHits || {};
          const hits = (enemy.sparrowFeatherHits[bullet.volleyId] || 0) + 1;
          enemy.sparrowFeatherHits[bullet.volleyId] = hits;
          if (hits >= 5) {
            hitDamage *= 2;
            playSfx.ability();
            for (let c = 0; c < 10; c++) state.particles.push(new Particle(enemy.x, enemy.y, "#ffe680"));
          }
        }
        if (bullet.specterNeedle && enemyFlankedByAim(enemy)) {
          hitDamage *= 1.55;
        }
        if (bullet.chainArc && !bullet._chainDone) {
          bullet._chainDone = true;
          let best = null;
          let bestD = 1e9;
          for (const e2 of state.enemies) {
            if (e2 === enemy || e2.hp <= 0) continue;
            const d = dist(e2.x, e2.y, enemy.x, enemy.y);
            if (d < bestD && d < 200) {
              bestD = d;
              best = e2;
            }
          }
          if (best) {
            const chainDamage = hitDamage * (bullet.chainDamagePct || 0.42);
            best.hp -= chainDamage;
            recordDamageDealt(chainDamage);
            drawInstantArc(enemy.x, enemy.y, best.x, best.y, bullet.chainDamagePct === 0.15 ? "#66a8ff" : "#fff176", 0.18);
            for (let c = 0; c < 6; c++) {
              state.particles.push(new Particle((enemy.x + best.x) / 2 + rng(-10, 10), (enemy.y + best.y) / 2 + rng(-10, 10), "#fff176"));
            }
            if (best.hp <= 0) {
              const idx = state.enemies.indexOf(best);
              if (idx > -1) onEnemyDestroyed(best, idx);
            }
          }
        }
        let skipPrimaryDamage = false;
        if (bullet.phasePassthrough && !bullet.phaseConsumed) {
          bullet.phaseConsumed = true;
          skipPrimaryDamage = true;
        }
        if (bullet.staticPop) {
          for (let f = 0; f < 8; f++) {
            state.particles.push(new Particle(enemy.x, enemy.y, "#88ccff"));
          }
          hitDamage = 0;
        }
        if (bullet.shieldBreakBonus && enemy.maxHp > 80) {
          hitDamage *= 1.35;
        }
        if (state.player.foresightTimer > 0 && !skipPrimaryDamage) {
          hitDamage *= 1.22;
        }
        if (enemy.deathMarked && !skipPrimaryDamage) {
          hitDamage *= 1.28;
        }
        if (bullet.clawBasic && !skipPrimaryDamage) {
          if (bullet.vy > 0) {
            hitDamage *= 2;
          } else {
            enemy.fireTimer += 0.65;
          }
        }
        if (bullet.clawTear && !skipPrimaryDamage) {
          const pull = Math.atan2(state.player.y - enemy.y, state.player.x - enemy.x);
          enemy.x += Math.cos(pull) * 20;
          enemy.y += Math.sin(pull) * 20;
        }
        if (bullet.slowOnHit && !skipPrimaryDamage) {
          enemy.fireTimer += 1.05;
        }
        if (!skipPrimaryDamage) {
          enemy.hp -= hitDamage;
          recordDamageDealt(hitDamage);
        }
        if (bullet.myrmidonDot && !skipPrimaryDamage) {
          enemy.myrmidonDots = (enemy.myrmidonDots || 0) + 1;
          enemy.myrmidonGlowTimer = 2;
          for (let p = 0; p < 3; p++) state.particles.push(new Particle(enemy.x + rng(-5, 5), enemy.y + rng(-5, 5), "#ff3333"));
          if (enemy.myrmidonDots >= 6) {
            enemy.myrmidonDots = 0;
            const blast = 34 * state.player.damageMultiplier;
            for (const e2 of state.enemies) {
              if (dist(e2.x, e2.y, enemy.x, enemy.y) < 70 + e2.size) {
                e2.hp -= blast;
                recordDamageDealt(blast);
              }
            }
            state.expandingCircles.push(new ExpandingCircle(enemy.x, enemy.y, 70, "#ff3333", 0.45, blast, null, true));
          }
        }
        if (bullet.knaveSteal && !skipPrimaryDamage) {
          const steal = Math.max(0.4, enemy.hp * 0.01);
          enemy.hp -= steal;
          recordDamageDealt(steal);
          state.player.shield = Math.min(state.player.maxShield * 1.1, state.player.shield + steal * 0.35);
        }
        if (bullet.stingerPoison && !skipPrimaryDamage) {
          enemy.stingerPoisonStacks = Math.min(3, (enemy.stingerPoisonStacks || 0) + 1);
          enemy.stingerPoisonTimer = 3;
          enemy.stingerPoisonTick = 0;
          enemy.stingerPoisonBase = Math.max(enemy.stingerPoisonBase || 0, bullet.stingerPoisonPerTick || 0.6);
          enemy.stingerPoisonPerTick = enemy.stingerPoisonBase * enemy.stingerPoisonStacks;
        }
        if (bullet.clawStun && !skipPrimaryDamage) {
          enemy.stunTimer = Math.max(enemy.stunTimer || 0, bullet.clawStun);
        }
        if (bullet.picketTri && !skipPrimaryDamage) {
          enemy.picketShred = Math.min(3, (enemy.picketShred || 0) + 1);
          enemy.picketShredTimer = 2;
        }
        if (bullet.emberPuddle && !bullet.puddleSpawned && !skipPrimaryDamage) {
          bullet.puddleSpawned = true;
          createFirePuddle(bullet.x, bullet.y, "#ff7a45", 0.5);
        }
        if (bullet.emberEnhancedBurst && !skipPrimaryDamage) {
          for (let fp = 0; fp < 18; fp++) {
            const p = new Particle(enemy.x + rng(-10, 10), enemy.y + rng(-10, 10), fp % 2 ? "#ff5a2a" : "#ffb347");
            p.life = rng(0.16, 0.42);
            p.size = rng(2, 4.4);
            state.particles.push(p);
          }
        }
        if (bullet.infernoGlob && !bullet.puddleSpawned && !skipPrimaryDamage) {
          bullet.puddleSpawned = true;
          createFirePuddle(bullet.x, bullet.y, "#ff4a1f", 2);
        }
        if (bullet.emberInfernoOrb && !skipPrimaryDamage) {
          for (let fp = 0; fp < 26; fp++) {
            const p = new Particle(enemy.x + rng(-14, 14), enemy.y + rng(-14, 14), fp % 2 ? "#ff5a2a" : "#ffcf6b");
            p.life = rng(0.18, 0.45);
            p.size = rng(2.4, 5.2);
            state.particles.push(p);
          }
        }
        if (bullet.halberdBlade && !skipPrimaryDamage) {
          const centerHit = Math.abs(bullet.y - enemy.y) < enemy.size * 0.35;
          if (centerHit) enemy.y -= 42;
          else enemy.x += Math.sign(enemy.x - bullet.x || 1) * 42;
        }
        if (bullet.ravenBird && !skipPrimaryDamage) {
          let target = null;
          let bestD = 240;
          for (const e2 of state.enemies) {
            if (e2 === enemy || e2.hp <= 0) continue;
            const d = dist(enemy.x, enemy.y, e2.x, e2.y);
            if (d < bestD) {
              bestD = d;
              target = e2;
            }
          }
          if (target) {
            const feather = new Bullet(enemy.x, enemy.y, Math.atan2(target.y - enemy.y, target.x - enemy.x), 440 * state.player.shotSpeedMultiplier, true, 2.1, "#6b4a9a", bullet.damage * 0.35);
            feather.visualShape = "needle";
            feather.tracking = true;
            feather.trackingTarget = target;
            feather.trackingTurnRate = 18;
            feather.life = 1.1;
            state.bullets.push(feather);
          }
        }
        if (bullet.reaperCrescent && !bullet.reaperMiniSwingDone && !skipPrimaryDamage) {
          bullet.reaperMiniSwingDone = true;
          const a = Math.atan2(enemy.y - state.player.y, enemy.x - state.player.x);
          applyScytheSwing(enemy.x - Math.cos(a) * 34, enemy.y - Math.sin(a) * 34, a, 104, Math.PI * 0.72, 20 * state.player.damageMultiplier, 28, "#ff2222");
        }
        if (bullet.gallantHeal && !skipPrimaryDamage) {
          state.player.hp = Math.min(state.player.maxHp, state.player.hp + state.player.maxHp * 0.01);
          state.expandingCircles.push(new ExpandingCircle(enemy.x, enemy.y, 48, "#c8e0ff", 0.35, 12 * state.player.damageMultiplier, null, true));
        }
        if (bullet.eclipseHeal && !skipPrimaryDamage) {
          state.player.hp = Math.min(state.player.maxHp, state.player.hp + hitDamage * 0.01);
        }
        if (bullet.eclipseBlind && !skipPrimaryDamage) {
          enemy.fireTimer += 1;
        }
        if (bullet.auroraColor && !skipPrimaryDamage) {
          if (bullet.auroraColor === "green") enemy.hp -= 5 * state.player.damageMultiplier;
          if (bullet.auroraColor === "cyan") enemy.fireTimer += 0.45;
          if (bullet.auroraColor === "purple") enemy.fireTimer += 0.8;
        }
        if (bullet.freezeFactor && !skipPrimaryDamage) {
          enemy.fireTimer += 0.25 + bullet.freezeFactor * 0.4;
          enemy.hp -= bullet.damage * 0.15;
          recordDamageDealt(bullet.damage * 0.15);
          for (let p = 0; p < 8; p++) {
            state.particles.push(new Particle(enemy.x + rng(-8, 8), enemy.y + rng(-8, 8), "#8be7ff"));
          }
        }
        if (bullet.wickExplosiveShot && !bullet.wickExploded && !skipPrimaryDamage) {
          bullet.wickExploded = true;
          const dm = state.player.damageMultiplier * state.player.abilityDamageMultiplier;
          state.novaAnomalies.push(
            new NovaAnomaly(bullet.x, bullet.y, {
              maxRadius: 118,
              duration: 0.52,
              pullStrength: 140,
              damagePerSecond: 58 * dm,
              pullEnabled: true,
              explodeAtEnd: true,
              explosionDamage: 36 * dm,
              explosionKnockback: 95,
              knockbackRadius: 112,
              color: "#ffd54a",
              stunWhilePulled: false,
            })
          );
          for (let p = 0; p < 28; p++) {
            const pa = (p / 28) * Math.PI * 2;
            state.particles.push(
              new Particle(bullet.x + Math.cos(pa) * 8, bullet.y + Math.sin(pa) * 8, p % 2 ? "#fff8e1" : "#ff9800")
            );
          }
        }
        if (bullet.marauderPlunder && !bullet.marauderPop && !skipPrimaryDamage) {
          bullet.marauderPop = true;
          const ba = Math.atan2(bullet.vy, bullet.vx);
          const dm = state.player.damageMultiplier * state.player.abilityDamageMultiplier;
          for (let k = 0; k < 8; k++) {
            const a = ba + (k / 8) * Math.PI * 2;
            const ch = new Bullet(bullet.x, bullet.y, a, 260 * state.player.shotSpeedMultiplier, true, 2.2, "#ff6677", 3.2 * dm);
            ch.life = 0.55;
            state.bullets.push(ch);
          }
        }
        if (bullet.novaPrimaryPop && !skipPrimaryDamage) {
          state.novaAnomalies.push(
            new NovaAnomaly(bullet.x, bullet.y, {
              maxRadius: 72,
              duration: 0.55,
              pullStrength: 120,
              damagePerSecond: 52 * state.player.damageMultiplier * state.player.abilityDamageMultiplier,
              pullEnabled: true,
              explodeAtEnd: true,
              explosionDamage: 38 * state.player.damageMultiplier * state.player.abilityDamageMultiplier,
              explosionKnockback: 90,
              knockbackRadius: 100,
              color: "#ffffff",
              stunWhilePulled: false,
            })
          );
        }
        if (bullet.titanMegaOrb && !bullet.titanChildSpawned && !skipPrimaryDamage) {
          bullet.titanChildSpawned = true;
          const ba = Math.atan2(bullet.vy, bullet.vx);
          for (let k = -1; k <= 1; k++) {
            const ch = new Bullet(bullet.x, bullet.y, ba + k * 0.35, 280 * state.player.shotSpeedMultiplier, true, 5.5, "#ff8f2a", bullet.damage * 0.42);
            ch.life = 0.55;
            ch.burnDamage = ch.damage * 0.4;
            state.bullets.push(ch);
          }
        }
        if (bullet.marauderShard && !bullet.marauderSplit && !skipPrimaryDamage) {
          bullet.marauderSplit = true;
          const ba = Math.atan2(bullet.vy, bullet.vx);
          const nextGen = (bullet.marauderGeneration || 0) + 1;
          for (let k = 0; k < 2; k++) {
            const ch = new Bullet(bullet.x, bullet.y, ba + (k - 0.5) * 0.5, 360 * state.player.shotSpeedMultiplier, true, Math.max(1.8, bullet.size * 0.68), "#ee5566", bullet.damage * 0.7);
            ch.marauderShard = nextGen < 2;
            ch.visualShape = "raggedShard";
            ch.marauderGeneration = nextGen;
            ch.life = 0.45;
            state.bullets.push(ch);
          }
        }
        if (bullet.glacierPrimary && !skipPrimaryDamage) {
          enemy.glacierFreezeTimer = bullet.glacierFreezeDuration || 3;
          enemy.glacierBurstPending = true;
          enemy.glacierBurstDamage = bullet.damage;
          enemy.glacierChildFreeze = 1.5;
        } else if (bullet.glacierShard && !bullet.glacierFractured && !skipPrimaryDamage) {
          bullet.glacierFractured = true;
          const ba = Math.atan2(bullet.vy, bullet.vx);
          for (let k = 0; k < 3; k++) {
            const ch = new Bullet(bullet.x, bullet.y, ba + (k - 1) * 0.42, 340 * state.player.shotSpeedMultiplier, true, 2.4, "#b8ecff", bullet.damage * 0.32);
            ch.freezeFactor = 0.35;
            ch.life = 0.4;
            state.bullets.push(ch);
          }
        }
        if (bullet.lifeSteal && !skipPrimaryDamage && state.player) {
          state.player.hp = Math.min(state.player.hp + bullet.lifeSteal, state.player.maxHp);
        }
        if (bullet.burnDamage && !skipPrimaryDamage) {
          enemy.hp -= bullet.burnDamage;
          recordDamageDealt(bullet.burnDamage);
          for (let p = 0; p < 8; p++) {
            state.particles.push(new Particle(enemy.x + rng(-8, 8), enemy.y + rng(-8, 8), "#ff8f2a"));
          }
        }
        if (bullet.knockback && !skipPrimaryDamage) {
          const impactAngle = Math.atan2(enemy.y - state.player.y, enemy.x - state.player.x);
          enemy.x += Math.cos(impactAngle) * bullet.knockback * 0.15;
          enemy.y += Math.sin(impactAngle) * bullet.knockback * 0.15;
        }
        if (bullet.pebbleBoulder && !skipPrimaryDamage) {
          const dx = enemy.x - bullet.x;
          const dy = enemy.y - bullet.y;
          const len = Math.hypot(dx, dy) || 1;
          const push = 42;
          enemy.x += (dx / len) * push;
          enemy.y += (dy / len) * push;
          bullet._pebbleNextDmg = performance.now() + 95;
        }
        if (bullet.bulwarkPush && !skipPrimaryDamage) {
          const pushAngle = Math.atan2(enemy.y - state.player.y, enemy.x - state.player.x);
          enemy.x += Math.cos(pushAngle) * 44;
          enemy.y += Math.sin(pushAngle) * 44;
          for (const e2 of state.enemies) {
            if (e2 === enemy || e2.hp <= 0) continue;
            if (dist(enemy.x, enemy.y, e2.x, e2.y) < enemy.size + e2.size + 8) {
              const bonus = 8 * state.player.damageMultiplier;
              enemy.hp -= bonus;
              e2.hp -= bonus;
              recordDamageDealt(bonus * 2);
              break;
            }
          }
        }
        if (bullet.novaAzureMini && !skipPrimaryDamage) {
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
        } else if (bullet.novaMini && !skipPrimaryDamage) {
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
        if (bullet.novaBurst && !skipPrimaryDamage) {
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
        if (skipPrimaryDamage) {
          break;
        }
        if (enemy.hp <= 0 && bullet.reaperBoomerang && (bullet.reaperReturns || 0) < 3) {
          const target = getNearestEnemy(state.player.x, state.player.y);
          if (target) {
            const a = Math.atan2(target.y - state.player.y, target.x - state.player.x);
            const free = new Bullet(state.player.x, state.player.y, a, 420 * state.player.shotSpeedMultiplier, true, 5.4, "#4a0018", bullet.damage * 0.9);
            free.reaperCrescent = true;
            free.reaperBoomerang = true;
            free.reaperReturns = (bullet.reaperReturns || 0) + 1;
            state.bullets.push(free);
          }
        }
        if (bullet.infinitePierce || (bullet.piercing && bullet.pierceCount && bullet.pierceCount > 0)) {
          if (bullet.pierceCount) bullet.pierceCount -= 1;
        } else {
          state.bullets.splice(j, 1);
        }
        if (!bullet.noHitParticle) state.particles.push(new Particle(bullet.x, bullet.y, "#f5f285"));
        if (enemy.hp <= 0) {
          const killIdx = state.enemies.indexOf(enemy);
          if (killIdx > -1) onEnemyDestroyed(enemy, killIdx);
        }
        break;
      }
    }
  }

  
  const shieldRadius = state.player.getShieldRadius();
  for (let i = state.enemyBullets.length - 1; i >= 0; i--) {
    const bullet = state.enemyBullets[i];
    if (state.oracleChronos && state.oracleChronos.life > 0 && bullet.spawnEnemy && bullet.spawnEnemy.hp > 0) {
      const se = bullet.spawnEnemy;
      if (dist(bullet.x, bullet.y, se.x, se.y) < bullet.size + se.size + 8) {
        const dmg = Math.max(bullet.damage || 6, 4);
        se.hp -= dmg;
        recordDamageDealt(dmg);
        state.enemyBullets.splice(i, 1);
        for (let jp = 0; jp < 14; jp++) {
          state.particles.push(new Particle(se.x + rng(-10, 10), se.y + rng(-10, 10), jp % 2 ? "#d4b8ff" : "#ffffff"));
        }
        if (se.hp <= 0) {
          const ix = state.enemies.indexOf(se);
          if (ix > -1) onEnemyDestroyed(se, ix);
        }
        continue;
      }
    }
    if (state.oracleChronos && state.oracleChronos.life > 0 && bullet.spawnEnemy) {
      continue;
    }
    const distToPlayer = dist(bullet.x, bullet.y, state.player.x, state.player.y);
    
    
    if (distToPlayer < shieldRadius + bullet.size && state.player.shield > 0 && !state.player.invincible) {
      state.enemyBullets.splice(i, 1);
      
      const drainAmount = state.player.fortifyActive 
        ? bullet.damage * 0.1  
        : bullet.damage;        
      
      absorbDamage(drainAmount);
      
      for (let j = 0; j < 5; j++) {
        state.particles.push(new Particle(bullet.x, bullet.y, state.player.shieldColorOverride || "#74ffce"));
      }
      continue;
    }
    
    
    if (distToPlayer < bullet.size + state.player.getHullHitRadius()) {
      
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
      enemy.y = clamp(enemy.y, TOP_HUD_SAFE_Y + enemy.size, config.height - enemy.size);
      
      
      
      const baseDrain = (enemy.size / 20) * 30 * dt; 
      const shieldDrain = state.player.fortifyActive 
        ? baseDrain * 0.5  
        : baseDrain;        
      state.player.shield = Math.max(0, state.player.shield - shieldDrain);
      
      
      if (Math.random() < 0.3) {
        state.particles.push(new Particle(enemy.x, enemy.y, state.player.shieldColorOverride || "#74ffce"));
      }
    }
    
    
    if (distToPlayer < enemy.size + state.player.getBodyRadius()) {
      
      if (!state.player.invincible) {
        const impactDmg =
          enemy.kind === "charger"
            ? Math.min(52, 30 + Math.floor((enemy.wave || 1) * 1.1))
            : 25;
        absorbDamage(impactDmg);
      }
      if (enemy.kind === "charger") {
        state.expandingCircles.push(new ExpandingCircle(enemy.x, enemy.y, 62, "#ff9933", 0.38, null, null));
        for (let p = 0; p < 24; p++) {
          const a = (p / 24) * Math.PI * 2 + rng(-0.35, 0.35);
          const part = new Particle(enemy.x + Math.cos(a) * 6, enemy.y + Math.sin(a) * 6, Math.random() < 0.5 ? "#ffcc55" : "#ff5522");
          part.vx = Math.cos(a) * rng(90, 220);
          part.vy = Math.sin(a) * rng(90, 220);
          part.life = rng(0.18, 0.42);
          part.size = rng(2, 4);
          state.particles.push(part);
        }
      }
      state.enemies.splice(i, 1);
    }
  }

  state.powerUps.length = 0;
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
    if (p.hp <= 5 && !state.runNearDeathTriggered) {
      state.runNearDeathStart = performance.now();
    }
    if (p.hp <= 1 && !state.runOneHpTriggered) {
      state.runOneHpStart = performance.now();
    }
  }
  recordDamageTaken(amount);
  state.particles.push(new Particle(p.x, p.y, "#74ffce"));
  if (p.hp <= 0) endGame();
};

const applyPowerUp = (kind) => {
  const p = state.player;
  playSfx.powerUp();
  if (kind === "heal") {
    const prevHp = p.hp;
    const prevShield = p.shield;
    p.hp = p.maxHp;
    p.shield = Math.min(p.maxShield, p.shield + 60);
    addEnergy(20);
    recordHealthRegen(p.hp - prevHp);
    recordShieldRegen(p.shield - prevShield);
  }
  if (kind === "shield") {
    const prevShield = p.shield;
    p.shield = Math.min(p.maxShield, p.shield + 50);
    recordShieldRegen(p.shield - prevShield);
  }
  if (kind === "rapid") {
    p.rapidTimer = Math.min(p.rapidTimer + 6, 10);
  }
  if (kind === "burst") {
    p.burstTimer = Math.min(p.burstTimer + 5.5, 9);
  }
};

const updateEntities = (dt) => {
  if (!state.player) return;
  state.player.update(dt);
  if (state.player.y < playerMinY()) state.player.y = playerMinY();
  if (state.emberFog && state.emberFog.life > 0) {
    state.emberFog.life = Math.max(0, state.emberFog.life - dt);
    state.emberFog.x = state.player.x;
    state.emberFog.y = state.player.y;
    for (let ei = state.enemies.length - 1; ei >= 0; ei--) {
      const enemy = state.enemies[ei];
      if (!enemy || enemy.hp <= 0) continue;
      if (dist(enemy.x, enemy.y, state.emberFog.x, state.emberFog.y) <= state.emberFog.radius + enemy.size) {
        const dmg = state.emberFog.dps * dt;
        enemy.hp -= dmg;
        recordDamageDealt(dmg);
        if (Math.random() < 0.22) state.particles.push(new Particle(enemy.x + rng(-6, 6), enemy.y + rng(-6, 6), "#ff5a2a"));
        if (enemy.hp <= 0) onEnemyDestroyed(enemy, ei);
      }
    }
  } else {
    state.emberFog = null;
  }

  if (state.eclipseTotality && state.eclipseTotality.life > 0) {
    state.eclipseTotality.life = Math.max(0, state.eclipseTotality.life - dt);
    if (state.player) {
      state.eclipseTotality.x = state.player.x;
      state.eclipseTotality.y = state.player.y;
    }
    const E = state.eclipseTotality;
    const edps = E.damagePerSecond;
    if (edps > 0 && state.enemies.length > 0) {
      for (let ei = state.enemies.length - 1; ei >= 0; ei--) {
        const enemy = state.enemies[ei];
        if (!enemy || enemy.hp <= 0) continue;
        const chunk = edps * dt;
        enemy.hp -= chunk;
        recordDamageDealt(chunk);
        enemy.fireTimer += 0.065 * dt;
        if (enemy.hp <= 0) onEnemyDestroyed(enemy, ei);
      }
    }
    const tickD = E.lowDamageTick;
    if (tickD > 0 && state.enemies.length > 0) {
      E._tickAcc = (E._tickAcc || 0) + dt;
      while (E._tickAcc >= 0.3) {
        E._tickAcc -= 0.3;
        for (let ei = state.enemies.length - 1; ei >= 0; ei--) {
          const enemy = state.enemies[ei];
          if (!enemy || enemy.hp <= 0) continue;
          enemy.hp -= tickD;
          recordDamageDealt(tickD);
          enemy.fireTimer += 0.12;
          if (enemy.hp <= 0) onEnemyDestroyed(enemy, ei);
        }
      }
    }
  } else {
    state.eclipseTotality = null;
  }

  if (state.oracleChronos && state.oracleChronos.life > 0) {
    const O = state.oracleChronos;
    O.life = Math.max(0, O.life - dt);
    O.handAngle = (O.handAngle || -Math.PI / 2) - dt * 1.35;
    O.particleAcc = (O.particleAcc || 0) + dt;
    while (O.particleAcc >= 0.04) {
      O.particleAcc -= 0.04;
      state.particles.push(
        new Particle(
          rng(0, config.width),
          rng(TOP_HUD_SAFE_Y, config.height),
          Math.random() < 0.5 ? "rgba(160, 100, 220, 0.55)" : "rgba(80, 40, 140, 0.45)"
        )
      );
    }
    const tickDm = O.tickDamage || 7;
    O.tickAcc = (O.tickAcc || 0) + dt;
    while (O.tickAcc >= 0.3) {
      O.tickAcc -= 0.3;
      for (let ei = state.enemies.length - 1; ei >= 0; ei--) {
        const enemy = state.enemies[ei];
        if (!enemy || enemy.hp <= 0) continue;
        enemy.hp -= tickDm;
        recordDamageDealt(tickDm);
        if (enemy.hp <= 0) onEnemyDestroyed(enemy, ei);
      }
    }
  } else {
    state.oracleChronos = null;
  }

  if (state.oracleForesightWings) {
    const w = state.oracleForesightWings;
    const pl = state.player;
    if (w.followLife > 0) {
      w.followLife -= dt;
      w.particleAcc = (w.particleAcc || 0) + dt;
      while (w.particleAcc >= 0.03 && pl) {
        w.particleAcc -= 0.03;
        for (let q = 0; q < 4; q++) {
          const a = rng(0, Math.PI * 2);
          const rr = rng(10, 48);
          const pt = new Particle(pl.x + Math.cos(a) * rr, pl.y + Math.sin(a) * rr, "rgba(255,255,255,0.82)");
          pt.life = rng(0.12, 0.28);
          pt.size = rng(1.2, 2.8);
          state.particles.push(pt);
        }
      }
    } else if (!w.exploded && pl) {
      w.exploded = true;
      const dm = pl.damageMultiplier * pl.abilityDamageMultiplier;
      const rad = 215;
      const boom = 9.5 * dm;
      const kb = 168;
      for (let ei = state.enemies.length - 1; ei >= 0; ei--) {
        const en = state.enemies[ei];
        if (!en || en.hp <= 0) continue;
        const d = dist(en.x, en.y, pl.x, pl.y);
        if (d > rad + en.size) continue;
        en.hp -= boom;
        recordDamageDealt(boom);
        const a = Math.atan2(en.y - pl.y, en.x - pl.x);
        const f = clamp(1 - d / (rad + 1), 0.2, 1);
        en.x += Math.cos(a) * kb * f;
        en.y += Math.sin(a) * kb * f;
        en.x = clamp(en.x, en.size, config.width - en.size);
        en.y = clamp(en.y, TOP_HUD_SAFE_Y + en.size, config.height - en.size);
        if (en.hp <= 0) onEnemyDestroyed(en, ei);
      }
      for (let n = 0; n < 160; n++) {
        const a = rng(0, Math.PI * 2);
        const sp = rng(140, 480);
        const p = new Particle(pl.x, pl.y, n % 2 ? "#ffffff" : "#e8f4ff");
        p.vx = Math.cos(a) * sp;
        p.vy = Math.sin(a) * sp;
        p.life = rng(0.38, 0.92);
        p.size = rng(2.2, 5.5);
        state.particles.push(p);
      }
      state.oracleForesightWings = null;
    } else {
      state.oracleForesightWings = null;
    }
  }

  if (state.oracleLightningStorm && state.oracleLightningStorm.queue && state.oracleLightningStorm.queue.length) {
    const L = state.oracleLightningStorm;
    L.acc = (L.acc || 0) + dt;
    const interval = L.interval != null ? L.interval : 0.052;
    const perBurst = L.perBurst != null ? L.perBurst : 3;
    let burstsThisFrame = 0;
    const maxBurstsThisFrame = 3;
    while (L.acc >= interval && L.queue.length > 0 && burstsThisFrame < maxBurstsThisFrame) {
      L.acc -= interval;
      burstsThisFrame++;
      for (let b = 0; b < perBurst && L.queue.length > 0; b++) {
        const job = L.queue.shift();
        applyOracleLightningBolt(job.spawnX, job.spawnY, L.hitEnemies, L.dm, L.prof);
      }
    }
    if (L.queue.length === 0) {
      state.oracleLightningStorm = null;
    }
  } else if (state.oracleLightningStorm) {
    state.oracleLightningStorm = null;
  }

  if (state.wardenJudgmentChains && state.player) {
    const J = state.wardenJudgmentChains;
    J.life = Math.max(0, J.life - dt);
    const alive = [];
    for (const en of state.enemies) {
      if (!en || en.hp <= 0) continue;
      alive.push(en);
      en.stunTimer = Math.max(en.stunTimer || 0, 0.12);
      en.vx = 0;
      en.vy = 0;
      en.smoothVx = 0;
      en.smoothVy = 0;
    }
    if (alive.length > 0) {
      J.tickAcc = (J.tickAcc || 0) + dt;
      while (J.tickAcc >= 0.2 && alive.length > 0) {
        J.tickAcc -= 0.2;
        const each = (J.dpsPool * 0.2) / alive.length;
        for (let ei = state.enemies.length - 1; ei >= 0; ei--) {
          const en = state.enemies[ei];
          if (!en || en.hp <= 0) continue;
          en.hp -= each;
          recordDamageDealt(each);
          if (Math.random() < 0.35) {
            state.particles.push(new Particle(en.x + rng(-6, 6), en.y + rng(-6, 6), "#8fff9b"));
          }
          if (en.hp <= 0) onEnemyDestroyed(en, ei);
        }
      }
    }
    state.player.boltChannelLock = Math.max(state.player.boltChannelLock || 0, 0.12);
    if (J.life <= 0 || alive.length === 0) {
      state.wardenJudgmentChains = null;
      state.player.boltChannelLock = Math.min(state.player.boltChannelLock || 0, 0.08);
    }
  } else if (state.player && (state.player.boltChannelLock || 0) > 0.08 && state.player.shipId === "warden") {
    state.player.boltChannelLock = 0.08;
  }

  if (state.ravenUnkindnessRush && state.player) {
    const rush = state.ravenUnkindnessRush;
    rush.life = Math.max(0, rush.life - dt);
    const pl = state.player;
    const mx = clamp(input.mouse.x, 20, config.width - 20);
    const my = clamp(input.mouse.y, playerMinY(), config.height - 20);
    const a = Math.atan2(my - pl.y, mx - pl.x);
    const prevX = pl.x;
    const prevY = pl.y;
    const step = rush.speed * dt;
    const toMouse = Math.hypot(mx - prevX, my - prevY);
    const reach = Math.min(step, toMouse || step);
    pl.x = clamp(prevX + Math.cos(a) * reach, 20, config.width - 20);
    pl.y = clamp(prevY + Math.sin(a) * reach, playerMinY(), config.height - 20);

    const perpA = a + Math.PI * 0.5;
    const hitKeyFrame = Math.floor(performance.now() / 90);
    for (let ei = state.enemies.length - 1; ei >= 0; ei--) {
      const en = state.enemies[ei];
      if (!en || en.hp <= 0) continue;
      const d = pointToSegmentDistance(en.x, en.y, prevX, prevY, pl.x, pl.y);
      if (d > rush.pathWidth + en.size * 0.45) continue;
      const key = `${ei}:${hitKeyFrame}`;
      if (rush.hitMap[key]) continue;
      rush.hitMap[key] = true;
      en.hp -= rush.pathDamage;
      recordDamageDealt(rush.pathDamage);
      const side = ((en.x - prevX) * Math.cos(perpA) + (en.y - prevY) * Math.sin(perpA)) >= 0 ? 1 : -1;
      en.x += Math.cos(perpA) * rush.pathSideKnockback * side;
      en.y += Math.sin(perpA) * rush.pathSideKnockback * side;
      en.x = clamp(en.x, en.size, config.width - en.size);
      en.y = clamp(en.y, TOP_HUD_SAFE_Y + en.size, config.height - en.size);
      if (en.hp <= 0) onEnemyDestroyed(en, ei);
    }

    rush.particleAcc = (rush.particleAcc || 0) + dt;
    while (rush.particleAcc >= rush.particleInterval) {
      rush.particleAcc -= rush.particleInterval;
      const ringA = rng(0, Math.PI * 2);
      const ringR = rng(122, 196);
      state.ravenUnkindnessField.push({
        x: pl.x + Math.cos(ringA) * ringR,
        y: pl.y + Math.sin(ringA) * ringR,
        life: rng(1.9, 2.9),
        maxLife: 2.9,
        size: rng(3.4, 7.2),
      });
    }

    state.ravenUnkindnessField = (state.ravenUnkindnessField || []).filter((pt) => {
      pt.life -= dt;
      return pt.life > 0;
    });

    if (rush.life <= 0 || toMouse <= 18) {
      const ex = pl.x;
      const ey = pl.y;
      for (let ei = state.enemies.length - 1; ei >= 0; ei--) {
        const en = state.enemies[ei];
        if (!en || en.hp <= 0) continue;
        const d = dist(en.x, en.y, ex, ey);
        if (d > rush.explosionRadius + en.size) continue;
        const fall = clamp(1 - d / (rush.explosionRadius + 1), 0.25, 1);
        const damage = rush.explosionDamage * fall;
        en.hp -= damage;
        recordDamageDealt(damage);
        const pushA = Math.atan2(en.y - ey, en.x - ex);
        en.x += Math.cos(pushA) * rush.explosionKnockback * fall;
        en.y += Math.sin(pushA) * rush.explosionKnockback * fall;
        en.x = clamp(en.x, en.size, config.width - en.size);
        en.y = clamp(en.y, TOP_HUD_SAFE_Y + en.size, config.height - en.size);
        if (en.hp <= 0) onEnemyDestroyed(en, ei);
      }
      const burst = state.ravenUnkindnessField || [];
      for (const pt of burst) {
        const outA = Math.atan2(pt.y - ey, pt.x - ex);
        const b = new Bullet(pt.x, pt.y, outA, rng(210, 420) * state.player.shotSpeedMultiplier, true, Math.max(2.2, pt.size * 0.5), "#9a5cff", 4.6 * state.player.damageMultiplier * state.player.abilityDamageMultiplier);
        b.life = rng(0.55, 1.05);
        b.visualShape = "ravenDetailed";
        b.ravenBird = true;
        b.noTrail = true;
        state.bullets.push(b);
      }
      for (let i = 0; i < 170; i++) {
        const pa = rng(0, Math.PI * 2);
        const p = new Particle(ex, ey, i % 2 ? "#b777ff" : "#edd7ff");
        p.vx = Math.cos(pa) * rng(180, 520);
        p.vy = Math.sin(pa) * rng(180, 520);
        p.life = rng(0.26, 0.86);
        p.size = rng(2, 6.2);
        state.particles.push(p);
      }
      state.expandingCircles.push(new ExpandingCircle(ex, ey, rush.explosionRadius, "#9a5cff", 0.72, null, null, true));
      state.ravenUnkindnessField = [];
      state.ravenUnkindnessRush = null;
      pl.invincible = false;
      pl.invincibleTimer = Math.min(pl.invincibleTimer || 0, 0.2);
    }
  } else if (state.ravenUnkindnessField && state.ravenUnkindnessField.length > 0) {
    state.ravenUnkindnessField = state.ravenUnkindnessField.filter((pt) => {
      pt.life -= dt;
      return pt.life > 0;
    });
  }

  if (state.ravenOmenSwarm && state.player) {
    const swarm = state.ravenOmenSwarm;
    swarm.life = Math.max(0, swarm.life - dt);
    swarm.spawnAcc = (swarm.spawnAcc || 0) + dt;
    while (swarm.spawned < swarm.maxSpawn && swarm.spawnAcc >= swarm.spawnInterval) {
      swarm.spawnAcc -= swarm.spawnInterval;
      const secBucket = Math.min(3, Math.floor((4 - Math.max(0, swarm.life)) / 1));
      const candidates = [];
      const counts = new Map();
      for (const en of state.enemies) {
        if (!en || en.hp <= 0) continue;
        const d = dist(state.player.x, state.player.y, en.x, en.y);
        if (d > 760) continue;
        counts.set(en, en.ravenTargetBuckets ? en.ravenTargetBuckets[secBucket] || 0 : 0);
        candidates.push(en);
      }
      candidates.sort((a, b) => counts.get(a) - counts.get(b) || dist(state.player.x, state.player.y, a.x, a.y) - dist(state.player.x, state.player.y, b.x, b.y));
      let target = candidates.find((en) => counts.get(en) < 1) || candidates.find((en) => counts.get(en) < 2) || null;
      if (target) {
        target.ravenTargetBuckets = target.ravenTargetBuckets || [0, 0, 0, 0];
        target.ravenTargetBuckets[secBucket] = (target.ravenTargetBuckets[secBucket] || 0) + 1;
      }
      const aa = target ? Math.atan2(target.y - state.player.y, target.x - state.player.x) : Math.atan2(input.mouse.y - state.player.y, input.mouse.x - state.player.x) + rng(-0.25, 0.25);
      const rb = new Bullet(state.player.x + rng(-18, 18), state.player.y + rng(-18, 18), aa, rng(360, 510) * state.player.shotSpeedMultiplier, true, rng(4.8, 6.6), "#9c56ff", swarm.damage);
      rb.visualShape = "ravenDetailed";
      rb.ravenBird = true;
      rb.tracking = !!target;
      rb.trackingTarget = target;
      rb.trackingTurnRate = 17;
      rb.life = 2.2;
      rb.piercing = false;
      state.bullets.push(rb);
      swarm.spawned++;
      for (let i = 0; i < 4; i++) {
        const p = new Particle(state.player.x + rng(-12, 12), state.player.y + rng(-12, 12), i % 2 ? "#9a5cff" : "#dcb5ff");
        p.life = rng(0.14, 0.32);
        p.size = rng(1.5, 3.4);
        state.particles.push(p);
      }
    }
    if (swarm.life <= 0 || swarm.spawned >= swarm.maxSpawn) {
      state.ravenOmenSwarm = null;
    }
  }

  state.player.shoot(state.bullets);
  state.bullets = state.bullets.filter((b) => {
    b.update(dt);
    const alive = b.life > 0 && b.x >= -20 && b.x <= config.width + 20 && b.y >= -20 && b.y <= config.height + 20;
    if (!alive) handleBasicBulletExpired(b);
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

  if (state.pendingEclipseUmbralWall) {
    const w = state.pendingEclipseUmbralWall;
    state.eclipseUmbralWall = new EclipseUmbralWall(w.cx, w.cy, w.aim, w.L);
    state.pendingEclipseUmbralWall = null;
  }
  if (state.eclipseUmbralWall) {
    state.eclipseUmbralWall.update(dt);
    if (state.eclipseUmbralWall.life <= 0) state.eclipseUmbralWall = null;
  }

  if (state.specterBladeStorm && state.specterBladeStorm.life > 0) {
    state.specterBladeStorm.life -= dt;
    state.specterBladeStorm.spawnAcc = (state.specterBladeStorm.spawnAcc || 0) + dt;
    const pl = state.player;
    const dm = pl.damageMultiplier * pl.abilityDamageMultiplier;
    const sm = pl.shotSpeedMultiplier;
    while (state.specterBladeStorm.spawnAcc >= 0.016) {
      state.specterBladeStorm.spawnAcc -= 0.016;
      const bx = rng(24, config.width - 24);
      const by = rng(TOP_HUD_SAFE_Y + 22, config.height - 28);
      const blade = new Bullet(bx, by, rng(0, Math.PI * 2), rng(42, 145) * sm, true, 3.05, "#f4f6ff", 6.8 * dm);
      blade.life = 0.72;
      blade.visualShape = "needle";
      blade.specterBladeShard = true;
      blade.noTrail = true;
      state.bullets.push(blade);
    }
  } else if (state.specterBladeStorm) {
    state.specterBladeStorm = null;
  }

  if (state.specterPhantasm && state.specterPhantasm.life > 0) {
    state.specterPhantasm.life -= dt;
    const pl = state.player;
    if (pl) {
      state.specterPhantasm.spawnAcc = (state.specterPhantasm.spawnAcc || 0) + dt;
      const dm = pl.damageMultiplier * pl.abilityDamageMultiplier;
      const sm = pl.shotSpeedMultiplier;
      while (state.specterPhantasm.spawnAcc >= 0.3) {
        state.specterPhantasm.spawnAcc -= 0.3;
        let best = null;
        let bd = 1e9;
        for (const en of state.enemies) {
          if (!en || en.hp <= 0) continue;
          const d = dist(en.x, en.y, pl.x, pl.y);
          if (d < bd) {
            bd = d;
            best = en;
          }
        }
        const a0 = best
          ? Math.atan2(best.y - pl.y, best.x - pl.x)
          : Math.atan2(input.mouse.y - pl.y, input.mouse.x - pl.x);
        const orb = new Bullet(pl.x, pl.y, a0, 380 * sm, true, 10, "#f4f2ff", 14 * dm);
        orb.life = 2.4;
        orb.tracking = true;
        orb.trackingTarget = best;
        orb.trackingTurnRate = 11;
        orb.specterPhantasmOrb = true;
        orb.piercing = false;
        state.bullets.push(orb);
      }
    }
  } else if (state.specterPhantasm) {
    state.specterPhantasm = null;
  }

  
  state.blackHoles = state.blackHoles.filter((hole) => {
    hole.update(dt);
    return hole.life > 0;
  });
  state.screenLasers = state.screenLasers.filter((laser) => {
    laser.update(dt);
    return laser.life > 0;
  });
  state.bossHazardLasers = state.bossHazardLasers.filter((laser) => {
    laser.update(dt);
    return !laser.dead;
  });
  state.aphelionPortalBursts = state.aphelionPortalBursts.filter((burst) => {
    burst.delay -= dt;
    if (burst.delay > 0) return true;
    for (let p = 0; p < 36; p++) {
      const a = (p / 36) * Math.PI * 2;
      const ring = 18 + Math.sin(performance.now() / 220 + p) * 4;
      const part = new Particle(burst.x + Math.cos(a) * ring, burst.y + Math.sin(a) * ring, p % 2 ? "#b785ff" : "#8f56ff");
      part.life = rng(0.15, 0.35);
      part.size = rng(2, 4.5);
      state.particles.push(part);
    }
    const base = burst.baseAngle || rng(0, Math.PI * 2);
    for (let i = 0; i < 6; i++) {
      const a = base + (i - 2.5) * 0.2 + rng(-0.05, 0.05);
      const orb = new Bullet(
        burst.x,
        burst.y,
        a,
        rng(230, 320) * state.player.shotSpeedMultiplier,
        true,
        6,
        "#a96cff",
        14 * state.player.damageMultiplier * state.player.abilityDamageMultiplier
      );
      orb.life = rng(2.2, 3.2);
      orb.novaBurst = true;
      orb.novaNoPull = true;
      orb.novaBurstRadius = 95;
      orb.novaBurstDamage = 84 * state.player.damageMultiplier * state.player.abilityDamageMultiplier;
      state.bullets.push(orb);
    }
    return false;
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
        enemy.timeDilationSlowFactor = 1;
      }
    }
  });
  
  state.timeDilationFields = state.timeDilationFields.filter((field) => field.life > 0);

  if (state.clawPawShield && state.player) {
    state.clawPawShield.life = Math.max(0, state.clawPawShield.life - dt);
    const sx = state.player.x;
    const yo = state.clawPawShield.yOffset ?? 0;
    const sy = state.player.y - yo;
    const rad = state.clawPawShield.radius ?? 132;
    for (let i = state.enemyBullets.length - 1; i >= 0; i--) {
      const eb = state.enemyBullets[i];
      const d = dist(eb.x, eb.y, sx, sy);
      if (d <= rad + (eb.size || 4)) {
        for (let p = 0; p < 7; p++) {
          state.particles.push(new Particle(eb.x + rng(-3, 3), eb.y + rng(-3, 3), "#7dffb3"));
        }
        state.enemyBullets.splice(i, 1);
      }
    }
    if (state.clawPawShield.life <= 0) state.clawPawShield = null;
  }

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

  state.aphelionShields = state.aphelionShields.filter((shield) => {
    shield.update(dt);
    return shield.life > 0;
  });
  state.aphelionKeelPortals = state.aphelionKeelPortals.filter((portal) => !portal.update(dt));
  state.seraphBounceLasers = state.seraphBounceLasers.filter((laser) => !laser.update(dt));

  
  
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
      state.waveComplete = true;
      state.segmentsSpawned = Math.max(state.segmentsSpawned || 0, state.maxSegmentsThisWave || 1);
    }
  }

  
  if (!state.tutorialMode || state.tutorialTestWave) {
    applyBoltChannelStorm(dt);
    state.enemies.forEach((enemy) => enemy.update(dt, state.player, state.enemyBullets));
  }
  state.enemies.forEach((enemy) => {
    if (enemy.myrmidonGlowTimer) enemy.myrmidonGlowTimer = Math.max(0, enemy.myrmidonGlowTimer - dt);
    if (enemy.myrmidonGlowTimer <= 0) enemy.myrmidonDots = 0;
    if (enemy.picketShredTimer) enemy.picketShredTimer = Math.max(0, enemy.picketShredTimer - dt);
    if (enemy.picketShredTimer <= 0) enemy.picketShred = 0;
    if (enemy.glacierFreezeTimer) {
      enemy.glacierFreezeTimer = Math.max(0, enemy.glacierFreezeTimer - dt);
      enemy.fireTimer += dt * 1.8;
      if (enemy.glacierFreezeTimer <= 0 && enemy.glacierBurstPending) {
        enemy.glacierBurstPending = false;
        spawnGlacierBurst(enemy, enemy.glacierBurstDamage || 10, enemy.glacierChildFreeze || 1.5);
      }
    }
    if ((enemy.stingerPoisonTimer || 0) > 0 && (enemy.stingerPoisonStacks || 0) > 0) {
      enemy.stingerPoisonTimer = Math.max(0, enemy.stingerPoisonTimer - dt);
      enemy.stingerPoisonTick = (enemy.stingerPoisonTick || 0) + dt;
      while (enemy.stingerPoisonTick >= 0.5 && enemy.hp > 0) {
        enemy.stingerPoisonTick -= 0.5;
        const tickDamage = Math.max(0.2, enemy.stingerPoisonPerTick || 0.5);
        enemy.hp -= tickDamage;
        recordDamageDealt(tickDamage);
        state.particles.push(new Particle(enemy.x + rng(-6, 6), enemy.y + rng(-6, 6), "#8dff88"));
      }
      if (enemy.stingerPoisonTimer <= 0) {
        enemy.stingerPoisonStacks = 0;
        enemy.stingerPoisonBase = 0;
        enemy.stingerPoisonPerTick = 0;
        enemy.stingerPoisonTick = 0;
      }
    }
  });
  if (state.stingerPoisonFogs && state.stingerPoisonFogs.length > 0) {
    state.stingerPoisonFogs = state.stingerPoisonFogs.filter((fog) => {
      fog.life -= dt;
      fog.x = state.player.x;
      fog.y = state.player.y;
      const startR = fog.startRadius ?? 120;
      const frac = 1 - fog.life / fog.maxLife;
      fog.radius = Math.min(fog.maxRadius, startR + (fog.maxRadius - startR) * frac);
      fog.tick = (fog.tick || 0) + dt;
      while (fog.tick >= fog.tickRate) {
        fog.tick -= fog.tickRate;
        for (let ei = state.enemies.length - 1; ei >= 0; ei--) {
          const enemy = state.enemies[ei];
          if (!enemy || enemy.hp <= 0) continue;
          if (dist(enemy.x, enemy.y, fog.x, fog.y) <= fog.radius + enemy.size) {
            enemy.hp -= fog.damagePerTick;
            recordDamageDealt(fog.damagePerTick);
            state.particles.push(new Particle(enemy.x + rng(-4, 4), enemy.y + rng(-4, 4), "#96ff8a"));
            if (enemy.hp <= 0) onEnemyDestroyed(enemy, ei);
          }
        }
      }
      return fog.life > 0;
    });
  }
  state.powerUps.length = 0;
  state.particles = state.particles.filter((particle) => {
    particle.update(dt);
    return particle.life > 0;
  });
  state.voidTrails = state.voidTrails.filter((trail) => {
    trail.life -= dt;
    for (const enemy of state.enemies) {
      if (dist(enemy.x, enemy.y, trail.x, trail.y) < trail.radius + enemy.size) {
        enemy.fireTimer += dt * 0.2;
        if (trail.emberTrail && enemy.hp > 0) {
          const td = (trail.dps || 16) * dt;
          enemy.hp -= td;
          recordDamageDealt(td);
        }
      }
    }
    return trail.life > 0;
  });
  state.scytheSwings = state.scytheSwings.filter((swing) => {
    swing.life -= dt;
    return swing.life > 0;
  });
  state.reaperPortals = state.reaperPortals.filter((portal) => !portal.update(dt));
  state.reaperMinions = state.reaperMinions.filter((minion) => !minion.update(dt));
  state.reaperChains = state.reaperChains.filter((chain) => !chain.update(dt));
  state.solarFlares = state.solarFlares.filter((flare) => !flare.update(dt));
  state.fireColumns = state.fireColumns.filter((column) => !column.update(dt));
  state.grimstarWaves = state.grimstarWaves.filter((wave) => !wave.update(dt));
  state.novaAnomalies = state.novaAnomalies.filter((anomaly) => {
    anomaly.update(dt);
    return anomaly.life > 0 || (anomaly.explodeAtEnd && !anomaly.exploded);
  });
  state.tempestEyeStorms = state.tempestEyeStorms.filter((storm) => {
    storm.update(dt);
    return storm.life > 0;
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
  if (state.decorativeLightning) {
    state.decorativeLightning = state.decorativeLightning.filter((L) => {
      L.life -= dt;
      return L.life > 0;
    });
  }
  handleCollisions(dt);
  for (const enemy of state.enemies) {
    if (enemy.hp > 0) clampEnemyBelowHud(enemy);
  }
  for (let ei = state.enemies.length - 1; ei >= 0; ei--) {
    const en = state.enemies[ei];
    if (en.hp <= 0) onEnemyDestroyed(en, ei);
  }
  if (state.player && state.player.hp > 0 && state.runNearDeathStart > 0) {
    if (!state.runNearDeathTriggered && performance.now() - state.runNearDeathStart >= 10000) {
      state.runNearDeathTriggered = true;
    }
    if (!state.runOneHpTriggered && state.runOneHpStart > 0 && performance.now() - state.runOneHpStart >= 10000) {
      state.runOneHpTriggered = true;
    }
  }

  
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
      if (state.mode === "campaign" && state.wave >= state.campaignWaveTarget) {
        completeCampaignLevel();
        return;
      }
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
  const fx = getDifficulty().fx;
  if (fx) {
    ctx.fillStyle = `rgba(${fx.tint}, ${fx.tintAlpha})`;
    ctx.fillRect(0, 0, config.width, config.height);
    const gradient = ctx.createRadialGradient(
      config.width * 0.5,
      config.height * 0.5,
      config.height * 0.2,
      config.width * 0.5,
      config.height * 0.5,
      config.height * 0.72
    );
    gradient.addColorStop(0, "rgba(0,0,0,0)");
    gradient.addColorStop(1, `rgba(0,0,0,${fx.vignette})`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, config.width, config.height);
  }
};

const drawEntities = () => {
  if (state.stingerPoisonFogs && state.stingerPoisonFogs.length > 0) {
    state.stingerPoisonFogs.forEach((fog) => {
      const alpha = clamp(fog.life / fog.maxLife, 0, 1);
      ctx.save();
      const grad = ctx.createRadialGradient(fog.x, fog.y, fog.radius * 0.2, fog.x, fog.y, fog.radius);
      grad.addColorStop(0, `rgba(110, 210, 90, ${0.2 * alpha})`);
      grad.addColorStop(0.7, `rgba(70, 160, 60, ${0.14 * alpha})`);
      grad.addColorStop(1, "rgba(40, 100, 35, 0)");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(fog.x, fog.y, fog.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }
  if (state.clawPawShield && state.player) {
    const alpha = clamp(state.clawPawShield.life / state.clawPawShield.maxLife, 0, 1);
    const x = state.player.x;
    const y = state.player.y - (state.clawPawShield.yOffset ?? 0);
    const r = state.clawPawShield.radius ?? 132;
    ctx.save();
    ctx.globalAlpha = alpha * 0.95;
    ctx.shadowBlur = 28;
    ctx.shadowColor = "#7dffb3";
    ctx.fillStyle = "rgba(90, 255, 170, 0.16)";
    ctx.beginPath();
    ctx.arc(x, y + r * 0.25, r * 0.78, 0, Math.PI * 2);
    ctx.fill();
    for (const toe of [
      { x: -r * 0.72, y: -r * 0.18, rr: r * 0.33 },
      { x: -r * 0.26, y: -r * 0.5, rr: r * 0.31 },
      { x: r * 0.26, y: -r * 0.5, rr: r * 0.31 },
      { x: r * 0.72, y: -r * 0.18, rr: r * 0.33 },
    ]) {
      ctx.beginPath();
      ctx.arc(x + toe.x, y + toe.y, toe.rr, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.strokeStyle = "rgba(210, 255, 230, 0.95)";
    ctx.lineWidth = 7;
    ctx.beginPath();
    ctx.arc(x, y + r * 0.25, r * 0.84, 0, Math.PI * 2);
    ctx.stroke();
    for (const toe of [
      { x: -r * 0.72, y: -r * 0.18, rr: r * 0.38 },
      { x: -r * 0.26, y: -r * 0.5, rr: r * 0.35 },
      { x: r * 0.26, y: -r * 0.5, rr: r * 0.35 },
      { x: r * 0.72, y: -r * 0.18, rr: r * 0.38 },
    ]) {
      ctx.beginPath();
      ctx.arc(x + toe.x, y + toe.y, toe.rr, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }
  if (state.emberFog && state.emberFog.life > 0) {
    const alpha = clamp(state.emberFog.life / state.emberFog.maxLife, 0, 1);
    const r = state.emberFog.radius;
    ctx.save();
    const grad = ctx.createRadialGradient(state.emberFog.x, state.emberFog.y, r * 0.2, state.emberFog.x, state.emberFog.y, r);
    grad.addColorStop(0, `rgba(255, 75, 45, ${0.26 * alpha})`);
    grad.addColorStop(0.55, `rgba(220, 40, 25, ${0.16 * alpha})`);
    grad.addColorStop(1, "rgba(120, 20, 15, 0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(state.emberFog.x, state.emberFog.y, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  state.enemies.forEach((enemy) => enemy.draw(ctx));
  state.enemies.forEach((enemy) => drawEnemyPoisonStacks(ctx, enemy));
  state.enemies.forEach((enemy) => drawEnemyInfernoBurn(ctx, enemy));
  state.enemies.forEach((enemy) => drawEnemyDizzyStars(ctx, enemy));
  if (state.wardenJudgmentChains && state.player) {
    const J = state.wardenJudgmentChains;
    const alpha = clamp(J.life / (J.maxLife || 5), 0, 1);
    const now = performance.now() * 0.006;
    for (let i = 0; i < state.enemies.length; i++) {
      const en = state.enemies[i];
      if (!en || en.hp <= 0) continue;
      const x1 = state.player.x;
      const y1 = state.player.y;
      const x2 = en.x;
      const y2 = en.y;
      const dx = x2 - x1;
      const dy = y2 - y1;
      const len = Math.hypot(dx, dy) || 1;
      const nx = -dy / len;
      const ny = dx / len;
      const links = Math.max(5, Math.floor(len / 20));
      ctx.save();
      ctx.globalAlpha = 0.9 * alpha;
      for (let k = 0; k < links; k++) {
        const t = links <= 1 ? 0 : k / (links - 1);
        const wig = Math.sin(now + k * 0.9 + i * 0.55) * 4.5;
        const cx = x1 + dx * t + nx * wig;
        const cy = y1 + dy * t + ny * wig;
        const ang = Math.atan2(dy, dx) + ((k + i) % 2 === 0 ? 0.7 : -0.7);
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(ang);
        ctx.strokeStyle = "rgba(120, 255, 150, 0.95)";
        ctx.lineWidth = 2.3;
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#66ff88";
        ctx.beginPath();
        ctx.ellipse(0, 0, 8.5, 4.6, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.strokeStyle = "rgba(205, 255, 220, 0.9)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(0, 0, 5.7, 2.7, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
      ctx.restore();
    }
  }
  state.blackHoles.forEach((hole) => hole.draw(ctx));
  state.bluefallPortals.forEach((portal) => portal.draw(ctx));
  state.aphelionKeelPortals.forEach((portal) => portal.draw(ctx));
  state.seraphBounceLasers.forEach((laser) => laser.draw(ctx));
  state.novaAnomalies.forEach((anomaly) => anomaly.draw(ctx));
  state.tempestEyeStorms.forEach((storm) => storm.draw(ctx));
  if (state.eclipseUmbralWall) state.eclipseUmbralWall.draw(ctx);
  state.barriers.forEach((barrier) => barrier.draw(ctx));
  state.aphelionShields.forEach((shield) => shield.draw(ctx));
  state.expandingCircles.forEach((circle) => circle.draw(ctx));
  state.screenLasers.forEach((laser) => laser.draw(ctx));
  state.bossHazardLasers.forEach((laser) => laser.draw(ctx));
  state.fireColumns.forEach((column) => column.draw(ctx));
  state.solarFlares.forEach((flare) => flare.draw(ctx));
  state.grimstarWaves.forEach((wave) => wave.draw(ctx));
  state.reaperPortals.forEach((portal) => portal.draw(ctx));
  state.voidTrails.forEach((trail) => {
    const alpha = clamp(trail.life / trail.maxLife, 0, 1);
    ctx.save();
    ctx.globalAlpha = 0.24 * alpha;
    ctx.fillStyle = trail.color || "#4a2080";
    ctx.shadowBlur = 18;
    ctx.shadowColor = trail.color || "#4a2080";
    ctx.beginPath();
    ctx.arc(trail.x, trail.y, trail.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
  
  state.timeDilationFields.forEach((field) => field.draw(ctx));
  state.enemyBullets.forEach((bullet) => bullet.draw(ctx));
  state.bullets.forEach((bullet) => bullet.draw(ctx));
  state.scytheSwings.forEach((swing) => {
    const alpha = clamp(swing.life / swing.maxLife, 0, 1);
    const progress = 1 - alpha;
    const bladeAngle = swing.angle - swing.arc / 2 + swing.arc * progress;
    const hx = swing.x + Math.cos(bladeAngle) * swing.radius * 0.78;
    const hy = swing.y + Math.sin(bladeAngle) * swing.radius * 0.78;
    ctx.save();
    ctx.globalAlpha = alpha;
    if (swing.showHandle) {
      const hlen = swing.handleLength || 52;
      const gripAng = swing.angle + Math.PI;
      const gx0 = swing.x;
      const gy0 = swing.y;
      const gx1 = swing.x + Math.cos(gripAng) * hlen;
      const gy1 = swing.y + Math.sin(gripAng) * hlen;
      ctx.strokeStyle = "#1a0d0d";
      ctx.lineWidth = 7;
      ctx.lineCap = "round";
      ctx.shadowBlur = 0;
      ctx.beginPath();
      ctx.moveTo(gx0, gy0);
      ctx.lineTo(gx1, gy1);
      ctx.stroke();
      ctx.strokeStyle = "#3d2520";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(gx0, gy0);
      ctx.lineTo(gx1, gy1);
      ctx.stroke();
      const gxp = gx1 - Math.cos(gripAng) * 10;
      const gyp = gy1 - Math.sin(gripAng) * 10;
      ctx.fillStyle = "#2a1815";
      ctx.beginPath();
      ctx.arc(gxp, gyp, 6.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.22)";
      ctx.lineWidth = 1.2;
      ctx.stroke();
    }
    ctx.strokeStyle = swing.color;
    ctx.shadowBlur = 26;
    ctx.shadowColor = swing.color;
    ctx.lineCap = "round";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(swing.x, swing.y, swing.radius * 0.76, swing.angle - swing.arc / 2, bladeAngle);
    ctx.stroke();
    ctx.translate(hx, hy);
    ctx.rotate(bladeAngle + Math.PI / 2);
    ctx.strokeStyle = swing.color;
    ctx.fillStyle = "rgba(255, 35, 35, 0.24)";
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(0, 28);
    ctx.lineTo(0, -38);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(0, -36);
    ctx.quadraticCurveTo(42, -42, 54, -8);
    ctx.quadraticCurveTo(24, -22, 0, -12);
    ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.82)";
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(4, -34);
    ctx.quadraticCurveTo(34, -35, 48, -10);
    ctx.stroke();
    ctx.restore();
  });
  state.reaperChains.forEach((chain) => chain.draw(ctx));
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
  if (state.decorativeLightning) {
    state.decorativeLightning.forEach((L) => {
      if (!L.points || L.points.length < 2) return;
      const alpha = clamp(L.life / L.maxLife, 0, 1);
      ctx.save();
      ctx.globalAlpha = alpha * 0.96;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = L.color;
      ctx.lineWidth = L.width;
      ctx.shadowBlur = 16;
      ctx.shadowColor = "#88ccff";
      ctx.beginPath();
      ctx.moveTo(L.points[0].x, L.points[0].y);
      for (let i = 1; i < L.points.length; i++) ctx.lineTo(L.points[i].x, L.points[i].y);
      ctx.stroke();
      ctx.strokeStyle = "rgba(255,255,255,0.82)";
      ctx.lineWidth = Math.max(1, L.width * 0.42);
      ctx.beginPath();
      ctx.moveTo(L.points[0].x, L.points[0].y);
      for (let i = 1; i < L.points.length; i++) ctx.lineTo(L.points[i].x, L.points[i].y);
      ctx.stroke();
      ctx.restore();
    });
  }
  state.drones.forEach((drone) => drone.draw(ctx));
  state.novaOrbiters.forEach((orb) => orb.draw(ctx));
  state.reaperMinions.forEach((minion) => minion.draw(ctx));
  drawBoltCageLightning(ctx);
  if (state.eclipseTotality && state.eclipseTotality.life > 0) {
    const E = state.eclipseTotality;
    const cx = E.x;
    const cy = E.y;
    const t = clamp(E.life / E.maxLife, 0, 1);
    const wob = performance.now() / 1000;
    const cornerDist = Math.max(
      Math.hypot(cx, cy),
      Math.hypot(config.width - cx, cy),
      Math.hypot(cx, config.height - cy),
      Math.hypot(config.width - cx, config.height - cy)
    );
    const reach = cornerDist * 1.12 + 60;
    ctx.save();
    const g = ctx.createRadialGradient(cx, cy, reach * 0.04, cx, cy, reach);
    g.addColorStop(0, `rgba(28, 0, 48, ${0.72 * t})`);
    g.addColorStop(0.45, `rgba(55, 18, 95, ${0.48 * t})`);
    g.addColorStop(0.78, `rgba(85, 35, 130, ${0.26 * t})`);
    g.addColorStop(1, "rgba(130, 80, 190, 0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, config.width, config.height);
    const ringR = reach * (0.88 + 0.04 * Math.sin(wob * 3.2));
    ctx.strokeStyle = `rgba(255, 248, 255, ${0.82 * t})`;
    ctx.lineWidth = 12;
    ctx.shadowBlur = 36;
    ctx.shadowColor = "#ff88ff";
    ctx.beginPath();
    ctx.arc(cx, cy, ringR, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = `rgba(160, 255, 255, ${0.88 * t})`;
    ctx.lineWidth = 4;
    ctx.shadowColor = "#aaffff";
    ctx.stroke();
    ctx.globalCompositeOperation = "lighter";
    for (let i = 0; i < 18; i++) {
      const a = (i / 18) * Math.PI * 2 + wob * 0.55;
      ctx.strokeStyle = `rgba(255, 210, 255, ${0.42 * t})`;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * (ringR * 0.45), cy + Math.sin(a) * (ringR * 0.45));
      ctx.lineTo(cx + Math.cos(a) * reach, cy + Math.sin(a) * reach);
      ctx.stroke();
    }
    ctx.globalCompositeOperation = "source-over";
    ctx.shadowBlur = 0;
    ctx.restore();
  }
  if (state.oracleChronos && state.oracleChronos.life > 0) {
    const O = state.oracleChronos;
    const t = clamp(O.life / O.maxLife, 0, 1);
    const cx = config.width * 0.5;
    const cy = (TOP_HUD_SAFE_Y + config.height) * 0.5;
    ctx.save();
    const sweep = 0.52 + 0.48 * t;
    const reach = Math.max(config.width, config.height) * 0.92;
    const g0 = ctx.createRadialGradient(cx, cy, reach * 0.08, cx, cy, reach);
    g0.addColorStop(0, `rgba(55, 18, 95, ${0.62 * sweep})`);
    g0.addColorStop(0.35, `rgba(42, 12, 78, ${0.48 * sweep})`);
    g0.addColorStop(0.65, `rgba(28, 6, 58, ${0.32 * sweep})`);
    g0.addColorStop(1, "rgba(8, 0, 22, 0)");
    ctx.fillStyle = g0;
    ctx.fillRect(0, 0, config.width, config.height);
    ctx.globalCompositeOperation = "lighter";
    for (let s = 0; s < 48; s++) {
      const a = (s / 48) * Math.PI * 2 + performance.now() * 0.00035;
      ctx.strokeStyle = `rgba(180, 130, 255, ${0.08 * sweep})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(a) * 40, cy + Math.sin(a) * 40);
      ctx.lineTo(cx + Math.cos(a) * reach * 0.55, cy + Math.sin(a) * reach * 0.55);
      ctx.stroke();
    }
    ctx.globalCompositeOperation = "source-over";
    const R = Math.min(config.width, config.height) * 0.4;
    ctx.translate(cx, cy);
    ctx.rotate(Math.sin(performance.now() / 2600) * 0.035);
    const ringGrad = ctx.createRadialGradient(0, 0, R * 0.55, 0, 0, R * 1.08);
    ringGrad.addColorStop(0, `rgba(140, 80, 210, ${0.45 * t})`);
    ringGrad.addColorStop(0.85, `rgba(50, 18, 95, ${0.2 * t})`);
    ringGrad.addColorStop(1, "rgba(20, 0, 50, 0)");
    ctx.beginPath();
    ctx.arc(0, 0, R, 0, Math.PI * 2);
    ctx.fillStyle = ringGrad;
    ctx.fill();
    ctx.strokeStyle = `rgba(210, 170, 255, ${0.88 * t})`;
    ctx.lineWidth = 8;
    ctx.shadowBlur = 48;
    ctx.shadowColor = "#9040ff";
    ctx.stroke();
    ctx.shadowBlur = 0;
    for (let h = 0; h < 12; h++) {
      const a = (h / 12) * Math.PI * 2 - Math.PI / 2;
      ctx.strokeStyle = `rgba(230, 210, 255, ${0.58 * t})`;
      ctx.lineWidth = h % 3 === 0 ? 4.2 : 2.2;
      ctx.beginPath();
      ctx.moveTo(Math.cos(a) * (R * 0.74), Math.sin(a) * (R * 0.74));
      ctx.lineTo(Math.cos(a) * (R * 0.96), Math.sin(a) * (R * 0.96));
      ctx.stroke();
    }
    const ha = O.handAngle || -Math.PI / 2;
    ctx.strokeStyle = `rgba(255, 252, 255, ${0.96 * t})`;
    ctx.lineWidth = 10;
    ctx.lineCap = "round";
    ctx.shadowBlur = 32;
    ctx.shadowColor = "#e0c8ff";
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(ha) * R * 0.64, Math.sin(ha) * R * 0.64);
    ctx.stroke();
    ctx.lineWidth = 5.5;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(Math.cos(ha + Math.PI / 2) * R * 0.3, Math.sin(ha + Math.PI / 2) * R * 0.3);
    ctx.stroke();
    ctx.shadowBlur = 0;
    ctx.fillStyle = `rgba(255, 255, 255, ${0.92 * t})`;
    ctx.beginPath();
    ctx.arc(0, 0, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  if (state.oracleForesightWings && state.oracleForesightWings.followLife > 0 && state.player) {
    const w = state.oracleForesightWings;
    const pl = state.player;
    const alpha = clamp(w.followLife / (w.maxFollow || 0.52), 0, 1);
    ctx.save();
    ctx.globalAlpha = 0.9 * alpha;
    for (const sgn of [-1, 1]) {
      const wa = w.aim + sgn * w.wingSpread;
      const x2 = pl.x + Math.cos(wa) * w.wingLen;
      const y2 = pl.y + Math.sin(wa) * w.wingLen;
      ctx.strokeStyle = "rgba(235, 252, 255, 0.94)";
      ctx.lineWidth = w.wingW;
      ctx.lineCap = "round";
      ctx.shadowBlur = 28;
      ctx.shadowColor = "#a8fff4";
      ctx.beginPath();
      ctx.moveTo(pl.x, pl.y);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }
    ctx.shadowBlur = 0;
    ctx.restore();
  }
  if (state.ravenUnkindnessField && state.ravenUnkindnessField.length > 0) {
    for (const pt of state.ravenUnkindnessField) {
      const a = clamp(pt.life / (pt.maxLife || 1), 0, 1);
      ctx.save();
      ctx.globalAlpha = a;
      ctx.fillStyle = "rgba(182, 120, 255, 0.9)";
      ctx.shadowBlur = 18;
      ctx.shadowColor = "#8f56ff";
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
  if (state.player) state.player.draw(ctx);
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

  try {
    if (state.running) {
      if (active) {
        drawBackground(dt);
        updateEntities(dt);
      } else {
        drawBackground(dt);
      }
      drawEntities();
      if (!state.tutorialMode || state.tutorialTestWave) {
        drawWaveBanner();
      }
      updateHud();
    }
    state.waveAnnouncementTimer = Math.max(state.waveAnnouncementTimer - dt, 0);

    if (state.tutorialMode) {
      updateTutorialDisplay();
      if (active) checkTutorialStepCompletion();
    }

    updateBossBar();
  } catch (err) {
    console.error("Orbital Barrage frame error", err);
  }
  requestAnimationFrame(gameLoop);
};

const endGame = () => {
  clearUpgradePanelRevealTimeout();
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
  if (event.code) input.codes.add(event.code);
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
  if (event.code) input.codes.delete(event.code);
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
    endTutorial({ skipped: true });
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
  if (campaignCompletePanel) campaignCompletePanel.classList.add("hidden");
};

const showEndlessSetup = () => {
  state.mode = "endless";
  if (mainHub) mainHub.classList.add("hidden");
  if (campaignPanel) campaignPanel.classList.add("hidden");
  if (instructionsPanel) instructionsPanel.classList.add("hidden");
  if (instructionsEl) instructionsEl.classList.remove("hidden");
  const selectedDifficulty = document.querySelector(`input[name="difficulty"][value="${state.difficultyKey}"]`);
  if (selectedDifficulty) selectedDifficulty.checked = true;
  updateShipSelection();
};

const showInstructionsScreen = () => {
  if (mainHub) mainHub.classList.add("hidden");
  if (instructionsEl) instructionsEl.classList.add("hidden");
  if (campaignPanel) campaignPanel.classList.add("hidden");
  if (instructionsPanel) instructionsPanel.classList.remove("hidden");
};

const renderCampaignLevelGrid = () => {
  if (!campaignConstellation) return;
  campaignConstellation.innerHTML = "";
  const TRACK_W = 1000;
  const TRACK_H = 1400;
  const track = document.createElement("div");
  track.style.position = "relative";
  track.style.height = `${TRACK_H}px`;
  track.style.width = `${TRACK_W}px`;
  track.style.minWidth = `${TRACK_W}px`;
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("class", "campaign-path-svg");
  svg.setAttribute("width", String(TRACK_W));
  svg.setAttribute("height", String(TRACK_H));
  svg.setAttribute("viewBox", `0 0 ${TRACK_W} ${TRACK_H}`);
  svg.setAttribute("preserveAspectRatio", "none");
  track.appendChild(svg);
  const points = [];
  for (let level = 1; level <= 40; level++) {
    const row = Math.floor((level - 1) / 4);
    const col = (level - 1) % 4;
    const x = 120 + col * 240 + (row % 2 ? (col % 2 ? 35 : -35) : (col % 2 ? -25 : 25));
    const y = 90 + row * 135 + (col % 2 ? 30 : -20);
    points.push({ level, x, y });
  }
  for (let i = 1; i < points.length; i++) {
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", String(points[i - 1].x));
    line.setAttribute("y1", String(points[i - 1].y));
    line.setAttribute("x2", String(points[i].x));
    line.setAttribute("y2", String(points[i].y));
    line.setAttribute("class", "campaign-path-line");
    svg.appendChild(line);
  }
  points.forEach((pt) => {
    const node = document.createElement("button");
    node.type = "button";
    node.className = "campaign-star-node";
    const unlocked = pt.level <= state.campaignUnlockedLevel;
    const isBoss = pt.level % 5 === 0;
    if (!unlocked) node.classList.add("locked");
    if (isBoss) node.classList.add("boss-level");
    if (pt.level === state.selectedCampaignLevel) node.classList.add("selected");
    node.style.left = `${pt.x - (isBoss ? 27 : 20)}px`;
    node.style.top = `${pt.y - (isBoss ? 27 : 20)}px`;
    if (isBoss) {
      const skull = document.createElement("span");
      skull.className = "boss-skull";
      skull.textContent = "\u2620";
      const num = document.createElement("span");
      num.className = "boss-level-num";
      num.textContent = String(pt.level);
      node.appendChild(skull);
      node.appendChild(num);
    } else {
      node.textContent = String(pt.level);
    }
    if (unlocked) {
      node.addEventListener("click", () => {
        state.selectedCampaignLevel = pt.level;
        renderCampaignLevelGrid();
      });
    }
    track.appendChild(node);
  });
  campaignConstellation.appendChild(track);
  const selectedUnlocked = state.selectedCampaignLevel <= state.campaignUnlockedLevel;
  if (campaignStartButton) campaignStartButton.classList.toggle("hidden", !selectedUnlocked);
  if (campaignSwitchShipButton) campaignSwitchShipButton.classList.toggle("hidden", !selectedUnlocked);
};

const showCampaignScreen = () => {
  if (mainHub) mainHub.classList.add("hidden");
  if (instructionsEl) instructionsEl.classList.add("hidden");
  if (instructionsPanel) instructionsPanel.classList.add("hidden");
  if (campaignPanel) campaignPanel.classList.remove("hidden");
  if (campaignShipPanel) campaignShipPanel.classList.add("hidden");
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
if (campaignSwitchShipButton) {
  campaignSwitchShipButton.addEventListener("click", () => {
    if (campaignShipPanel) campaignShipPanel.classList.remove("hidden");
    renderCampaignShipPanel();
  });
}
if (campaignShipCloseButton) {
  campaignShipCloseButton.addEventListener("click", () => {
    if (campaignShipPanel) campaignShipPanel.classList.add("hidden");
  });
}
if (campaignStartButton) {
  campaignStartButton.addEventListener("click", () => {
    state.mode = "campaign";
    state.campaignLevel = state.selectedCampaignLevel;
    state.campaignWaveTarget = getCampaignWaveTarget(state.campaignLevel);
    state.wave = 1;
    if (campaignPanel) campaignPanel.classList.add("hidden");
    if (campaignShipPanel) campaignShipPanel.classList.add("hidden");
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

if (advancedCodexButton) advancedCodexButton.addEventListener("click", () => {
  closeMetaPanels();
  if (codexPanel) codexPanel.classList.remove("hidden");
});
if (advancedChallengeButton) advancedChallengeButton.addEventListener("click", () => {
  closeMetaPanels();
  if (challengePanel) challengePanel.classList.remove("hidden");
});
if (advancedFxLabButton) advancedFxLabButton.addEventListener("click", () => {
  closeMetaPanels();
  if (fxLabPanel) fxLabPanel.classList.remove("hidden");
});
if (advancedMapRegistryButton) advancedMapRegistryButton.addEventListener("click", () => {
  closeMetaPanels();
  if (mapRegistryPanel) mapRegistryPanel.classList.remove("hidden");
});
if (musicVolume) {
  musicVolume.addEventListener("input", () => {
    audio.musicVolume = Number(musicVolume.value) / 100;
    applyMusicVolume();
    updateMusic();
  });
  musicVolume.addEventListener("change", () => {
    audio.musicVolume = Number(musicVolume.value) / 100;
    applyMusicVolume();
    updateMusic();
  });
}
if (sfxVolume) {
  sfxVolume.addEventListener("input", () => {
    audio.sfxVolume = Number(sfxVolume.value) / 100;
  });
}
if (quitToMenuButton) {
  quitToMenuButton.addEventListener("click", () => quitToMainMenu());
}



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
  clearUpgradePanelRevealTimeout();
  state.running = false;
  clearCanvas();
  gameOverEl.classList.add("hidden");
  if (campaignCompletePanel) campaignCompletePanel.classList.add("hidden");
  upgradePanel.classList.add("hidden");
  bossBar.classList.add("hidden");
  bossBar.style.display = "none";
  if (hudSettingsButton) hudSettingsButton.classList.add("hidden");
  if (abilityIcons) abilityIcons.classList.add("hidden");
  const hudEl = document.getElementById("hud");
  if (hudEl) hudEl.classList.add("hidden");
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
  state.screenLasers = [];
  state.bossHazardLasers = [];
  state.aphelionPortalBursts = [];
  state.aphelionKeelPortals = [];
  state.seraphBounceLasers = [];
  state.aphelionShields = [];
  state.novaAnomalies = [];
  state.tempestEyeStorms = [];
  state.novaOrbiters = [];
  state.bluefallPortals = [];
  state.boss = null;
  showHub();
  updateHud();
});

if (campaignCompleteContinueButton) {
  campaignCompleteContinueButton.addEventListener("click", () => {
    if (campaignCompletePanel) campaignCompletePanel.classList.add("hidden");
    if (campaignPanel) campaignPanel.classList.remove("hidden");
    if (mainHub) mainHub.classList.add("hidden");
    if (instructionsEl) instructionsEl.classList.add("hidden");
    renderCampaignLevelGrid();
  });
}


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
    card.dataset.tooltip = describeShip(ship);
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
        ${ship.abilities.map(a => `<div class="ability-detail-row" ${tooltipAttr(describeAbility(ship, a))}><kbd>${a.key.toUpperCase()}</kbd> ${a.name} (${a.cost} energy) ${abilityHelpHtml(ship, a)}</div>`).join("")}
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
          refreshProgressAchievements();
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
    label.className = `option-card ship-option ship-card ship-card--selection ship-card--tier-${ship.tier || "common"} ${isAccessible ? "" : "locked"} ${state.shipKey === shipId ? "selected" : ""}`;
    label.dataset.tooltip = describeShip(ship);
    
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "ship";
    radio.value = shipId;
    radio.disabled = !isAccessible;
    if (state.shipKey === shipId && isAccessible) {
      radio.checked = true;
    }
    
    const body = document.createElement("div");
    body.className = "ship-card__selection-body";
    body.innerHTML = `
      <div class="ship-card__header">
        <div class="ship-card__name-section">
          <strong>${escapeHtml(ship.name)}</strong>
          <span class="ship-card__tier" style="color: ${tierInfo.color}">${tierInfo.name}</span>
        </div>
        <div class="ship-card__badges">
          ${isOwned ? '<span class="ship-card__badge">OWNED</span>' : isAccessible ? '<span class="ship-card__badge selected-badge">TRIAL</span>' : '<span class="ship-card__badge">LOCKED</span>'}
        </div>
      </div>
      <div class="ship-card__abilities ship-option__abilities">
        ${(ship.abilities || []).map(a => `<div class="ability-detail-row" ${tooltipAttr(describeAbility(ship, a))}><kbd>${a.key.toUpperCase()}</kbd> ${escapeHtml(a.name)} (${a.cost} energy) ${abilityHelpHtml(ship, a)}</div>`).join("")}
      </div>
    `;
    if (!isAccessible) {
      label.style.opacity = "0.62";
      label.style.filter = "grayscale(0.55)";
      label.style.cursor = "not-allowed";
    }
    
    label.appendChild(radio);
    label.appendChild(body);
    
    
    radio.addEventListener("change", () => {
      if (radio.checked) {
        state.shipKey = shipId;
        updateShipSelection();
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

const renderCampaignShipPanel = () => {
  if (!campaignShipCards) return;
  campaignShipCards.innerHTML = "";
  const allShipIds = Object.keys(shipLoadouts).sort((a, b) => (shipLoadouts[a].price || 0) - (shipLoadouts[b].price || 0));
  allShipIds.forEach((shipId) => {
    const ship = shipLoadouts[shipId];
    if (!ship) return;
    const owned = state.unlockedShips.includes(shipId);
    const tier = getTierInfo(ship.tier || "common");
    const card = document.createElement("button");
    card.type = "button";
    card.className = `campaign-ship-card ship-card ship-card--selection ship-card--tier-${ship.tier || "common"} ${state.shipKey === shipId ? "selected" : ""} ${owned ? "" : "locked"}`;
    card.dataset.tooltip = describeShip(ship);
    card.innerHTML = `
      <div class="ship-card__header">
        <div class="ship-card__name-section">
          <strong>${escapeHtml(ship.name)}</strong>
          <span class="ship-card__tier" style="color:${tier.color}">${tier.name}</span>
        </div>
        <div class="ship-card__badges">
          <span class="ship-card__badge">${owned ? "OWNED" : "LOCKED"}</span>
        </div>
      </div>
      <div class="campaign-ship-card__abilities ship-card__abilities">
        ${(ship.abilities || []).map(a => `<div class="ability-detail-row" ${tooltipAttr(describeAbility(ship, a))}><kbd>${a.key.toUpperCase()}</kbd> ${escapeHtml(a.name)} (${a.cost} energy) ${abilityHelpHtml(ship, a)}</div>`).join("")}
      </div>
    `;
    if (!owned) {
      card.setAttribute("aria-disabled", "true");
    } else {
      card.addEventListener("click", () => {
        state.shipKey = shipId;
        renderCampaignShipPanel();
      });
    }
    campaignShipCards.appendChild(card);
  });
};

if (endlessShipScroll && endlessShipNext) {
  endlessShipNext.addEventListener("click", () => {
    endlessShipScroll.scrollBy({ left: 780, behavior: "smooth" });
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

if (endlessDifficultyScroll && endlessDifficultyNext) {
  endlessDifficultyNext.addEventListener("click", () => {
    endlessDifficultyScroll.scrollBy({ left: 780, behavior: "smooth" });
  });
  endlessDifficultyScroll.addEventListener(
    "wheel",
    (e) => {
      if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
      e.preventDefault();
      endlessDifficultyScroll.scrollLeft += e.deltaY;
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
  if (musicVolume) musicVolume.value = String(Math.round(audio.musicVolume * 100));
  if (sfxVolume) sfxVolume.value = String(Math.round(audio.sfxVolume * 100));
  
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

const quitToMainMenu = () => {
  clearUpgradePanelRevealTimeout();
  state.running = false;
  state.paused = false;
  state.upgradePending = false;
  state.awaitingUpgrade = false;
  state.upgradeChoices = [];
  if (gameOverEl) gameOverEl.classList.add("hidden");
  if (campaignCompletePanel) campaignCompletePanel.classList.add("hidden");
  if (upgradePanel) upgradePanel.classList.add("hidden");
  if (bossBar) {
    bossBar.classList.add("hidden");
    bossBar.style.display = "none";
  }
  if (hudSettingsButton) hudSettingsButton.classList.add("hidden");
  if (abilityIcons) abilityIcons.classList.add("hidden");
  const hudEl = document.getElementById("hud");
  if (hudEl) hudEl.classList.add("hidden");
  state.bullets = [];
  state.enemyBullets = [];
  state.enemies = [];
  state.boss = null;
  closeSettings();
  clearCanvas();
  showHub();
  updateHud();
};

const updateKeyBindingDisplay = () => {
  if (keyBinding1 && state.abilityKeys[0]) {
    keyBinding1.textContent = getKeyDisplay(state.abilityKeys[0]).replace("LM", "Left Mouse").replace("MM", "Middle Mouse").replace("RM", "Right Mouse");
    const ship = shipLoadouts[state.player ? state.player.shipId : state.shipKey];
    if (ship && ship.abilities[0]) keyBinding1.dataset.tooltip = describeAbility(ship, ship.abilities[0]);
  }
  if (keyBinding2 && state.abilityKeys[1]) {
    keyBinding2.textContent = getKeyDisplay(state.abilityKeys[1]).replace("LM", "Left Mouse").replace("MM", "Middle Mouse").replace("RM", "Right Mouse");
    const ship = shipLoadouts[state.player ? state.player.shipId : state.shipKey];
    if (ship && ship.abilities[1]) keyBinding2.dataset.tooltip = describeAbility(ship, ship.abilities[1]);
  }
  if (keyBinding3 && state.abilityKeys[2]) {
    keyBinding3.textContent = getKeyDisplay(state.abilityKeys[2]).replace("LM", "Left Mouse").replace("MM", "Middle Mouse").replace("RM", "Right Mouse");
    const ship = shipLoadouts[state.player ? state.player.shipId : state.shipKey];
    if (ship && ship.abilities[2]) keyBinding3.dataset.tooltip = describeAbility(ship, ship.abilities[2]);
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
  
  
  shipLoadoutAbilities.innerHTML = ship.abilities.map((ability, index) => {
    const binding = state.abilityKeys && state.abilityKeys[index] ? state.abilityKeys[index] : ability.key;
    const keyDisplay = getKeyDisplay(binding);
    return `
      <div class="ship-loadout__ability">
        <kbd>${keyDisplay}</kbd>
        <span class="ability-name" ${tooltipAttr(describeAbility(ship, ability))}>${ability.name} ${abilityHelpHtml(ship, ability)}</span>
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
  if (campaignShipPanel) campaignShipPanel.classList.add("hidden");
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
    campaignShipPanel,
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
refreshProgressAchievements();

if (typeof updateKeyBindingDisplay === "function") {
  updateKeyBindingDisplay();
}




// MEGA_RUNTIME_CONTENT_V2
const MEGA_SHIP_CATALOG_V2 = window.MEGA_SHIP_CATALOG_V2 || [];
const MEGA_CODEX_APPENDIX_V2 = window.MEGA_CODEX_APPENDIX_V2 || [];
const MEGA_CHALLENGE_PRESETS_V2 = window.MEGA_CHALLENGE_PRESETS_V2 || [];
const MEGA_FX_PROFILES_V2 = window.MEGA_FX_PROFILES_V2 || [];

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
updateShipSelection();
refreshProgressAchievements();

const shouldAutoStartTutorial =
  !localStorage.getItem(TUTORIAL_COMPLETED_KEY) &&
  !(state.achievements && state.achievements["tutorial-complete"]);
if (shouldAutoStartTutorial) {
  if (mainHub) mainHub.classList.add("hidden");
  queueMicrotask(() => {
    if (!state.running && !state.tutorialMode) startTutorial();
  });
} else if (mainHub) {
  showHub();
}
