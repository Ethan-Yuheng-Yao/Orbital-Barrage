const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const mini = document.getElementById("miniCanvas");
const miniCtx = mini.getContext("2d");

const hud = {
  hp: document.getElementById("hpValue"),
  shield: document.getElementById("shieldValue"),
  energy: document.getElementById("energyValue"),
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
const minimapEl = document.getElementById("minimap");
const bossBar = document.getElementById("bossBar");
const bossBarFill = document.getElementById("bossBarFill");
const upgradePanel = document.getElementById("upgradePanel");
const upgradeOptionsEl = document.getElementById("upgradeOptions");
const shipShopPanel = document.getElementById("shipShopPanel");
const shipShopList = document.getElementById("shipShopList");
const shopButton = document.getElementById("shopButton");
const shopCloseButton = document.getElementById("shopCloseButton");
const shopQuantumCores = document.getElementById("shopQuantumCores");

const input = {
  keys: new Set(),
  mouse: { x: canvas.width / 2, y: canvas.height / 2, down: false },
};

const config = {
  width: canvas.width,
  height: canvas.height,
  miniScaleX: canvas.width / mini.width,
  miniScaleY: canvas.height / mini.height,
};

const difficultyModes = {
  recruit: {
    enemyHp: 0.75,
    enemySpeed: 0.85,
    enemyCount: 0.7,
    powerDrop: 1.25,
    bossHpMultiplier: 0.8,
  },
  veteran: {
    enemyHp: 1,
    enemySpeed: 1,
    enemyCount: 1,
    powerDrop: 1,
    bossHpMultiplier: 1,
  },
  nightmare: {
    enemyHp: 1.5,
    enemySpeed: 1.25,
    enemyCount: 1.4,
    powerDrop: 0.75,
    bossHpMultiplier: 1.6,
  },
};

const shipLoadouts = {
  striker: {
    id: "striker",
    name: "Striker",
    speed: 300,
    maxHp: 150,
    maxShield: 60,
    maxEnergy: 100,
    baseCooldown: 0.15,
    damageMultiplier: 1,
    shotSpeedMultiplier: 1,
    energyRegenMultiplier: 1,
    shieldRegenMultiplier: 1,
    abilities: [
      { key: "1", name: "Omni Burst", cost: 100, type: "burst" },
      { key: "2", name: "Rapid Volley", cost: 40, type: "rapidVolley" },
      { key: "3", name: "Energy Surge", cost: 60, type: "energySurge" },
    ],
    price: 0,
    unlocked: true,
  },
  aegis: {
    id: "aegis",
    name: "Aegis",
    speed: 270,
    maxHp: 200,
    maxShield: 100,
    maxEnergy: 110,
    baseCooldown: 0.18,
    damageMultiplier: 0.95,
    shotSpeedMultiplier: 0.95,
    energyRegenMultiplier: 0.9,
    shieldRegenMultiplier: 1.3,
    abilities: [
      { key: "1", name: "Shockwave", cost: 100, type: "shockwave" },
      { key: "2", name: "Shield Overcharge", cost: 50, type: "shieldOvercharge" },
      { key: "3", name: "Fortify", cost: 70, type: "fortify" },
    ],
    price: 500,
    unlocked: false,
  },
  phantom: {
    id: "phantom",
    name: "Phantom",
    speed: 340,
    maxHp: 120,
    maxShield: 45,
    maxEnergy: 90,
    baseCooldown: 0.13,
    damageMultiplier: 0.92,
    shotSpeedMultiplier: 1.12,
    energyRegenMultiplier: 1.1,
    shieldRegenMultiplier: 0.85,
    abilities: [
      { key: "1", name: "Blink", cost: 80, type: "blink" },
      { key: "2", name: "Ghostfire", cost: 45, type: "ghostfire" },
      { key: "3", name: "Phase Shift", cost: 65, type: "phaseShift" },
    ],
    price: 750,
    unlocked: false,
  },
  tempest: {
    id: "tempest",
    name: "Tempest",
    speed: 320,
    maxHp: 140,
    maxShield: 70,
    maxEnergy: 120,
    baseCooldown: 0.14,
    damageMultiplier: 1.05,
    shotSpeedMultiplier: 1.08,
    energyRegenMultiplier: 1.15,
    shieldRegenMultiplier: 0.95,
    abilities: [
      { key: "1", name: "Lightning Storm", cost: 100, type: "lightningStorm" },
      { key: "2", name: "Combat Drone", cost: 60, type: "combatDrone" },
      { key: "3", name: "Overload", cost: 70, type: "overload" },
    ],
    price: 1200,
    unlocked: false,
  },
  titan: {
    id: "titan",
    name: "Titan",
    speed: 250,
    maxHp: 280,
    maxShield: 120,
    maxEnergy: 95,
    baseCooldown: 0.2,
    damageMultiplier: 1.1,
    shotSpeedMultiplier: 0.9,
    energyRegenMultiplier: 0.85,
    shieldRegenMultiplier: 1.4,
    abilities: [
      { key: "1", name: "Siege Cannon", cost: 100, type: "siegeCannon" },
      { key: "2", name: "Energy Barrier", cost: 70, type: "energyBarrier" },
      { key: "3", name: "Rampage", cost: 75, type: "rampage" },
    ],
    price: 1500,
    unlocked: false,
  },
  specter: {
    id: "specter",
    name: "Specter",
    speed: 360,
    maxHp: 100,
    maxShield: 40,
    maxEnergy: 120,
    baseCooldown: 0.12,
    damageMultiplier: 0.9,
    shotSpeedMultiplier: 1.2,
    energyRegenMultiplier: 1.2,
    shieldRegenMultiplier: 0.8,
    abilities: [
      { key: "1", name: "Black Hole", cost: 120, type: "blackHole" },
      { key: "2", name: "Shadow Step", cost: 40, type: "shadowStep" },
      { key: "3", name: "Ethereal", cost: 60, type: "ethereal" },
    ],
    price: 1800,
    unlocked: false,
  },
};

const upgradePool = [
  {
    id: "thrusters",
    name: "Vector Thrusters",
    desc: "+15% movement speed",
    apply: (player) => {
      player.speed *= 1.15;
    },
  },
  {
    id: "pulse",
    name: "Pulse Coils",
    desc: "+12% weapon damage & projectile speed",
    apply: (player) => {
      player.damageMultiplier *= 1.12;
      player.shotSpeedMultiplier *= 1.12;
    },
  },
  {
    id: "capacitors",
    name: "Flux Capacitors",
    desc: "-10% weapon cooldown",
    apply: (player) => {
      player.baseCooldown = Math.max(player.baseCooldown * 0.9, 0.07);
    },
  },
  {
    id: "reactor",
    name: "Solar Reactors",
    desc: "+25% energy regeneration",
    apply: (player) => {
      player.energyRegenMultiplier *= 1.25;
    },
  },
  {
    id: "bulwark",
    name: "Bulwark Shielding",
    desc: "+25 shield cap & +20% shield regen",
    apply: (player) => {
      player.maxShield += 25;
      player.shield = Math.min(player.shield + 25, player.maxShield);
      player.shieldRegenMultiplier *= 1.2;
    },
  },
  {
    id: "nanites",
    name: "Nanite Plating",
    desc: "+25 hull integrity & heal",
    apply: (player) => {
      player.maxHp += 25;
      player.hp = Math.min(player.hp + 40, player.maxHp);
    },
  },
  {
    id: "scatter",
    name: "Scatter Rails",
    desc: "+1 projectile per volley",
    apply: (player) => {
      player.extraProjectiles = Math.min(player.extraProjectiles + 1, 3);
    },
  },
  {
    id: "hyperCore",
    name: "Hyper Capacitors",
    desc: "+20 max energy & +10% regen",
    apply: (player) => {
      player.maxEnergy += 20;
      player.energy = Math.min(player.energy + 20, player.maxEnergy);
      player.energyRegenMultiplier *= 1.1;
    },
  },
  {
    id: "nova",
    name: "Prismatic Condensers",
    desc: "+35% Omni Burst damage",
    apply: (player) => {
      player.novaDamageMultiplier *= 1.35;
    },
  },
  {
    id: "stabilisers",
    name: "Gyro Stabilizers",
    desc: "+12% move speed & +10% shield regen",
    apply: (player) => {
      player.speed *= 1.12;
      player.shieldRegenMultiplier *= 1.1;
    },
  },
  {
    id: "overcharge",
    name: "Overcharge Matrix",
    desc: "+8% damage & 5% cooldown reduction",
    apply: (player) => {
      player.damageMultiplier *= 1.08;
      player.baseCooldown = Math.max(player.baseCooldown * 0.95, 0.06);
    },
  },
];

const rng = (min, max) => Math.random() * (max - min) + min;
const clamp = (val, min, max) => Math.max(min, Math.min(max, val));
const dist = (ax, ay, bx, by) => Math.hypot(ax - bx, ay - by);

class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.vx = rng(-80, 80);
    this.vy = rng(-80, 80);
    this.life = rng(0.3, 0.8);
    this.color = color;
    this.size = 2;
  }
  update(dt) {
    this.life -= dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
    this.vx *= 0.98; // Friction
    this.vy *= 0.98;
  }
  draw(ctx) {
    ctx.globalAlpha = Math.max(this.life, 0);
    ctx.fillStyle = this.color;
    const s = this.size || 2;
    ctx.fillRect(this.x - s/2, this.y - s/2, s, s);
    // Add glow for larger particles
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
    this.damage = damage ?? (friendly ? 9 : 6);
    this.color = color || (friendly ? "#74ffce" : "#ff7676");
    this.owner = owner;
  }
  update(dt) {
    this.life -= dt;
    this.x += this.vx * dt;
    this.y += this.vy * dt;
  }
  draw(ctx) {
    ctx.save();
    
    // Determine colors based on owner/type
    let coreColor, glowColor, trailColor;
    
    if (this.friendly) {
      // Player bullets
      if (this.color === "#ffd166") {
        // Rapid fire (yellow)
        coreColor = "#ffd166";
        glowColor = "rgba(255, 209, 102, 0.8)";
        trailColor = "rgba(255, 209, 102, 0.4)";
      } else if (this.color === "#d16bff") {
        // Burst (purple)
        coreColor = "#d16bff";
        glowColor = "rgba(209, 107, 255, 0.8)";
        trailColor = "rgba(209, 107, 255, 0.4)";
      } else {
        // Normal player (cyan)
        coreColor = "#74ffce";
        glowColor = "rgba(116, 255, 206, 0.8)";
        trailColor = "rgba(116, 255, 206, 0.4)";
      }
    } else {
      // Enemy bullets
      if (this.owner === "boss") {
        if (this.color === "#ff7dd1") {
          // Boss spread (pink)
          coreColor = "#ff7dd1";
          glowColor = "rgba(255, 125, 209, 0.9)";
          trailColor = "rgba(255, 125, 209, 0.5)";
        } else if (this.color === "#ffa8ff") {
          // Boss spiral (light pink)
          coreColor = "#ffa8ff";
          glowColor = "rgba(255, 168, 255, 0.9)";
          trailColor = "rgba(255, 168, 255, 0.5)";
        } else {
          // Boss burst (hot pink)
          coreColor = "#ff5f9e";
          glowColor = "rgba(255, 95, 158, 0.9)";
          trailColor = "rgba(255, 95, 158, 0.5)";
        }
      } else if (this.owner === "shooter") {
        // Shooter (yellow)
        coreColor = "#ffc857";
        glowColor = "rgba(255, 200, 87, 0.8)";
        trailColor = "rgba(255, 200, 87, 0.4)";
      } else {
        // Swarm/Charger (red)
        coreColor = "#ff7676";
        glowColor = "rgba(255, 118, 118, 0.8)";
        trailColor = "rgba(255, 118, 118, 0.4)";
      }
    }
    
    // Draw motion trail
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
    
    // Outer glow
    const glowGradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size * 2.5);
    glowGradient.addColorStop(0, glowColor);
    glowGradient.addColorStop(0.5, glowColor.replace("0.8", "0.3").replace("0.9", "0.3"));
    glowGradient.addColorStop(1, "transparent");
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size * 2.5, 0, Math.PI * 2);
    ctx.fill();
    
    // Core
    const coreGradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
    coreGradient.addColorStop(0, "#ffffff");
    coreGradient.addColorStop(0.6, coreColor);
    coreGradient.addColorStop(1, coreColor + "80");
    ctx.fillStyle = coreGradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    
    // Highlight
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
    this.life = 5; // Lasts 5 seconds
    this.maxLife = 5;
    this.size = 8;
    this.waveSpawned = state.wave; // Track which wave it was spawned in
  }
  update(dt, player) {
    // Remove if wave ended
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
    // Outer glow
    const glowGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size * 2);
    glowGradient.addColorStop(0, "rgba(0, 255, 255, 0.8)");
    glowGradient.addColorStop(0.5, "rgba(0, 255, 255, 0.4)");
    glowGradient.addColorStop(1, "transparent");
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(0, 0, this.size * 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Main body
    const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
    gradient.addColorStop(0, "#ffffff");
    gradient.addColorStop(0.5, "#00ffff");
    gradient.addColorStop(1, "#0088ff");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(0, 0, this.size, 0, Math.PI * 2);
    ctx.fill();
    
    // Ring
    ctx.strokeStyle = "#00ffff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, this.size * 1.5, 0, Math.PI * 2);
    ctx.stroke();
    
    // Core
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
    // Block enemy bullets
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
    
    // Pull enemies and bullets
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
    
    // Bright outer glow - make it very visible
    const outerGlowGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.radius * 2);
    outerGlowGradient.addColorStop(0, `rgba(255, 0, 255, ${alpha * 0.9})`);
    outerGlowGradient.addColorStop(0.3, `rgba(155, 127, 255, ${alpha * 0.7})`);
    outerGlowGradient.addColorStop(0.6, `rgba(155, 127, 255, ${alpha * 0.4})`);
    outerGlowGradient.addColorStop(1, "transparent");
    ctx.fillStyle = outerGlowGradient;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius * 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Middle glow ring
    const midGlowGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.radius * 1.3);
    midGlowGradient.addColorStop(0, `rgba(255, 0, 255, ${alpha * 0.8})`);
    midGlowGradient.addColorStop(0.5, `rgba(155, 127, 255, ${alpha * 0.5})`);
    midGlowGradient.addColorStop(1, "transparent");
    ctx.fillStyle = midGlowGradient;
    ctx.beginPath();
    ctx.arc(0, 0, this.radius * 1.3, 0, Math.PI * 2);
    ctx.fill();
    
    // Main black hole - bright purple/white center
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
    
    // Bright event horizon ring
    ctx.strokeStyle = `rgba(255, 0, 255, ${alpha})`;
    ctx.lineWidth = 4;
    ctx.shadowBlur = 15;
    ctx.shadowColor = "#ff00ff";
    ctx.beginPath();
    ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.shadowBlur = 0;
    
    // Spiral effect - thicker and more visible
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
    this.radius = 400; // Very wide range
    this.life = 7;
    this.maxLife = 7;
    this.followPlayer = true;
  }
  update(dt) {
    this.life -= dt;
    
    // Follow player
    if (this.followPlayer) {
      this.x = state.player.x;
      this.y = state.player.y;
    }
    
    // Don't apply effects if field has expired (restoration happens in updateEntities)
    if (this.life <= 0) {
      return;
    }
    
    // Slow down enemy bullets inside the field
    for (let i = 0; i < state.enemyBullets.length; i++) {
      const bullet = state.enemyBullets[i];
      const d = dist(this.x, this.y, bullet.x, bullet.y);
      
      if (d < this.radius) {
        // Track original speed on first entry
        if (!bullet.originalSpeed) {
          bullet.originalSpeed = Math.hypot(bullet.vx, bullet.vy);
        }
        // Apply constant slowdown factor (maintains direction, reduces speed to 10%)
        const targetSpeed = bullet.originalSpeed * 0.1;
        const currentSpeed = Math.hypot(bullet.vx, bullet.vy);
        if (currentSpeed > targetSpeed) {
          const speedRatio = targetSpeed / currentSpeed;
          bullet.vx *= speedRatio;
          bullet.vy *= speedRatio;
        }
        // Visual effect
        if (Math.random() < 0.1) {
          state.particles.push(new Particle(bullet.x, bullet.y, "#90ff90"));
        }
      } else {
        // Restore original speed when bullet leaves field
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
    
    // Slow down enemies inside the field
    for (let i = 0; i < state.enemies.length; i++) {
      const enemy = state.enemies[i];
      const d = dist(this.x, this.y, enemy.x, enemy.y);
      
      if (d < this.radius) {
        // Track original speed on first entry
        if (!enemy.originalSpeed) {
          enemy.originalSpeed = enemy.speed;
        }
        // Slow down enemies to 30% speed (less dramatic than bullets)
        enemy.speed = enemy.originalSpeed * 0.3;
        // Visual effect
        if (Math.random() < 0.05) {
          state.particles.push(new Particle(enemy.x, enemy.y, "#90ff90"));
        }
      } else {
        // Restore original speed when enemy leaves field
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
    
    // Outer glow - make it very visible
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
    
    // Main field - light green
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
    
    // Bright edge ring - make it very visible
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = "#90ff90";
    ctx.lineWidth = 4;
    ctx.shadowBlur = 25;
    ctx.shadowColor = "#90ff90";
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.stroke();
    
    // Inner bright ring
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
    this.bossType = bossType; // For boss variants: "titan", "sniper", "swarmlord", "vortex"
    this.x = x;
    this.y = y;
    
    // HP based on type
    if (kind === "boss") {
      const baseHp = { titan: 500, sniper: 350, swarmlord: 400, vortex: 380 }[bossType] || 400;
      this.hp = baseHp + wave * 50;
    } else {
      const hpMap = { swarm: 20, shooter: 25, charger: 18, defender: 45, dart: 12, orbiter: 30, splitter: 22 };
      this.hp = (hpMap[kind] || 20) + wave * 3;
    }
    this.maxHp = this.hp;
    
    // Speed based on type
    const speedMap = {
      swarm: 80, shooter: 55, charger: 120, defender: 35, dart: 180, orbiter: 65, splitter: 70,
      boss: 55
    };
    this.speed = speedMap[kind] || 70;
    
    // Size based on type
    if (kind === "boss") {
      this.size = { titan: 50, sniper: 35, swarmlord: 45, vortex: 42 }[bossType] || 40;
    } else {
      const sizeMap = { swarm: 18, shooter: 20, charger: 16, defender: 24, dart: 14, orbiter: 19, splitter: 18 };
      this.size = sizeMap[kind] || 18;
    }
    
    this.fireTimer = kind === "boss" ? 0.6 : rng(1.1, 2.4);
    this.wave = wave;
    this.phase = Math.random() * Math.PI * 2;
    
    // Boss-specific initialization
    if (kind === "boss") {
      this.bossPattern = null;
      this.patternTimer = 0;
      this.spiralAngle = 0;
      this.radialCooldown = 0;
      this.minionSpawnTimer = bossType === "swarmlord" ? 1 : 0;
      this.orbitRadius = 0;
      this.orbitAngle = 0;
    }
    
    // Enemy-specific initialization
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
    const angle = Math.atan2(player.y - this.y, player.x - this.x);
    if (this.kind === "swarm") {
      this.x += Math.cos(angle) * this.speed * dt;
      this.y += Math.sin(angle) * this.speed * dt;
    } else if (this.kind === "charger") {
      this.speed = 120 + Math.sin(performance.now() / 300) * 60;
      this.x += Math.cos(angle) * this.speed * dt;
      this.y += Math.sin(angle) * this.speed * dt;
    } else if (this.kind === "shooter") {
      // Come down first, then float
      const minY = config.height - 200;
      if (this.y < minY) {
        this.y += dt * 80;
        this.y = Math.min(this.y, minY);
      } else {
        const targetY = minY + Math.sin(performance.now() / 700 + this.phase) * 50;
        this.y += (targetY - this.y) * dt * 2.5;
      }
      this.x += Math.cos(performance.now() / 600 + this.phase) * this.speed * 0.4 * dt;
    } else if (this.kind === "defender") {
      // Slow, tanky - moves toward player but slowly
      this.x += Math.cos(angle) * this.speed * dt * 0.6;
      this.y += Math.sin(angle) * this.speed * dt * 0.6;
    } else if (this.kind === "dart") {
      // Very fast, zips around
      const burstSpeed = this.speed * (1.5 + Math.sin(performance.now() / 200) * 0.5);
      this.x += Math.cos(angle) * burstSpeed * dt;
      this.y += Math.sin(angle) * burstSpeed * dt;
    } else if (this.kind === "orbiter") {
      // Circles around player
      this.orbitAngle += this.orbitSpeed * dt;
      const targetX = player.x + Math.cos(this.orbitAngle) * this.orbitRadius;
      const targetY = player.y + Math.sin(this.orbitAngle) * this.orbitRadius;
      this.x += (targetX - this.x) * dt * 3;
      this.y += (targetY - this.y) * dt * 3;
    } else if (this.kind === "splitter") {
      // Moves toward player
      this.x += Math.cos(angle) * this.speed * dt;
      this.y += Math.sin(angle) * this.speed * dt;
    } else if (this.kind === "boss") {
      // Boss movement depends on type
      if (this.bossType === "titan") {
        // Slow, heavy movement
        this.x += Math.cos(performance.now() / 1200) * this.speed * dt * 0.7;
        this.y += Math.sin(performance.now() / 1000) * this.speed * dt * 0.7;
      } else if (this.bossType === "sniper") {
        // Stays back, minimal movement
        this.x += Math.cos(performance.now() / 1500) * this.speed * dt * 0.5;
        this.y = clamp(this.y + Math.sin(performance.now() / 1100) * this.speed * dt * 0.4, 60, 180);
      } else if (this.bossType === "swarmlord") {
        // Moves around more
        this.x += Math.cos(performance.now() / 800) * this.speed * dt;
        this.y += Math.sin(performance.now() / 600) * this.speed * dt;
      } else if (this.bossType === "vortex") {
        // Spins in place
        this.orbitAngle += dt * 2;
        const centerX = config.width / 2;
        const centerY = 150;
        this.x = centerX + Math.cos(this.orbitAngle) * 100;
        this.y = centerY + Math.sin(this.orbitAngle) * 60;
      } else {
        // Default boss movement
        this.x += Math.cos(performance.now() / 900) * this.speed * dt;
        this.y += Math.sin(performance.now() / 700) * this.speed * dt;
      }
      this.updateBossPattern(dt, player, bulletsOut);
      this.x = clamp(this.x, 80, config.width - 80);
      this.y = clamp(this.y, 80, config.height - 200);
      return;
    } else {
      this.y += dt * (40 + this.wave * 6);
      this.x += Math.cos(performance.now() / 500 + this.x) * this.speed * 0.2 * dt;
    }

    this.x = clamp(this.x, 30, config.width - 30);
    const bottomClamp = this.kind === "shooter" ? config.height - 140 : config.height - 80;
    this.y = clamp(this.y, 30, bottomClamp);

    this.fireTimer -= dt;
    if (this.fireTimer <= 0) {
      if (this.kind === "boss") {
        // Boss firing handled in updateBossPattern
        this.fireTimer = 1.0;
      } else if (this.kind === "shooter") {
        this.fireTimer = rng(0.8, 1.2);
        bulletsOut.push(
          new Bullet(this.x, this.y, angle, 180, false, 5, undefined, undefined, "shooter")
        );
      } else if (this.kind === "defender") {
        this.fireTimer = rng(1.5, 2.5);
        // Slow, powerful shots
        bulletsOut.push(
          new Bullet(this.x, this.y, angle, 90, false, 6, undefined, 12, "enemy")
        );
      } else if (this.kind === "dart") {
        this.fireTimer = rng(0.4, 0.8);
        // Fast, weak shots
        bulletsOut.push(
          new Bullet(this.x, this.y, angle, 200, false, 3, undefined, 5, "enemy")
        );
      } else if (this.kind === "orbiter") {
        this.fireTimer = rng(1.2, 1.8);
        // Shoots at player
        bulletsOut.push(
          new Bullet(this.x, this.y, angle, 140, false, 4, undefined, undefined, "enemy")
        );
      } else if (this.kind === "splitter") {
        this.fireTimer = rng(1.0, 1.5);
        // Spread shot
        for (let i = 0; i < 3; i++) {
          const offset = (i - 1) * 0.15;
          bulletsOut.push(
            new Bullet(this.x, this.y, angle + offset, 120, false, 4, undefined, undefined, "enemy")
          );
        }
      } else {
        // Swarm, charger, default
        this.fireTimer = rng(1.0, 1.6);
        bulletsOut.push(
          new Bullet(this.x, this.y, angle, 130, false, 4, undefined, undefined, "enemy")
        );
      }
    }
  }
  pickBossPattern() {
    if (this.bossType === "titan") {
      // Heavy tank - slow, powerful spread shots
      this.bossPattern = "spread";
      this.patternTimer = 4;
    } else if (this.bossType === "sniper") {
      // Long range - precise, fast shots
      this.bossPattern = "snipe";
      this.patternTimer = 3;
    } else if (this.bossType === "swarmlord") {
      // Spawns minions
      this.bossPattern = "spawn";
      this.patternTimer = 2.5;
    } else if (this.bossType === "vortex") {
      // Spiral attacks
      this.bossPattern = "spiral";
      this.patternTimer = 3.5;
    } else {
      // Default patterns
      const patterns = ["spread", "spiral", "burst"];
      this.bossPattern = patterns[Math.floor(Math.random() * patterns.length)];
      this.patternTimer = this.bossPattern === "spread" ? 3.5 : this.bossPattern === "spiral" ? 3.5 : 3;
    }
    this.fireTimer = 0;
    this.radialCooldown = 0;
  }
  updateBossPattern(dt, player, bulletsOut) {
    if (!this.bossPattern || this.patternTimer <= 0) {
      this.pickBossPattern();
    }
    this.patternTimer -= dt;
    
    if (this.bossType === "titan") {
      // Heavy spread shots
      this.fireTimer -= dt;
      if (this.fireTimer <= 0) {
        this.fireTimer = 0.7;
        const aim = Math.atan2(player.y - this.y, player.x - this.x);
        const spread = 7;
        for (let i = 0; i < spread; i++) {
          const offset = (i - (spread - 1) / 2) * 0.12;
          bulletsOut.push(
            new Bullet(this.x, this.y, aim + offset, 180, false, 8, "#ff4444", 15, "boss")
          );
        }
      }
    } else if (this.bossType === "sniper") {
      // Fast, precise shots
      this.fireTimer -= dt;
      if (this.fireTimer <= 0) {
        this.fireTimer = 0.25;
        const aim = Math.atan2(player.y - this.y, player.x - this.x);
        bulletsOut.push(
          new Bullet(this.x, this.y, aim, 280, false, 5, "#00ffff", 10, "boss")
        );
      }
    } else if (this.bossType === "swarmlord") {
      // Spawns minions periodically
      this.minionSpawnTimer -= dt;
      if (this.minionSpawnTimer <= 0) {
        this.minionSpawnTimer = 3;
        // Spawn 2-3 swarm enemies
        for (let i = 0; i < 2 + Math.floor(Math.random() * 2); i++) {
          const angle = (i / (2 + Math.floor(Math.random() * 2))) * Math.PI * 2;
          const spawnX = this.x + Math.cos(angle) * 60;
          const spawnY = this.y + Math.sin(angle) * 60;
          if (spawnX > 30 && spawnX < config.width - 30 && spawnY > 30 && spawnY < config.height - 80) {
            state.enemies.push(new Enemy("swarm", spawnX, spawnY, this.wave));
          }
        }
      }
      // Also fires spread shots
      this.fireTimer -= dt;
      if (this.fireTimer <= 0) {
        this.fireTimer = 0.5;
        const aim = Math.atan2(player.y - this.y, player.x - this.x);
        const spread = 5;
        for (let i = 0; i < spread; i++) {
          const offset = (i - (spread - 1) / 2) * 0.18;
          bulletsOut.push(
            new Bullet(this.x, this.y, aim + offset, 200, false, 5, "#ff7dd1", 8, "boss")
          );
        }
      }
    } else if (this.bossType === "vortex") {
      // Continuous spiral
      this.fireTimer -= dt;
      this.spiralAngle += dt * 3;
      if (this.fireTimer <= 0) {
        this.fireTimer = 0.08;
        const ang = this.spiralAngle;
        bulletsOut.push(
          new Bullet(this.x, this.y, ang, 190, false, 5, "#9b7fff", 7, "boss")
        );
      }
      // Also radial bursts
      this.radialCooldown -= dt;
      if (this.radialCooldown <= 0) {
        this.radialCooldown = 1.5;
        const rays = 12;
        for (let i = 0; i < rays; i++) {
          const ang = (i / rays) * Math.PI * 2;
          bulletsOut.push(
            new Bullet(this.x, this.y, ang, 170, false, 4, "#ff5f9e", 6, "boss")
          );
        }
      }
    } else {
      // Default boss patterns
      if (this.bossPattern === "spread") {
        this.fireTimer -= dt;
        if (this.fireTimer <= 0) {
          this.fireTimer = 0.55;
          const aim = Math.atan2(player.y - this.y, player.x - this.x);
          const spread = 5;
          for (let i = 0; i < spread; i++) {
            const offset = (i - (spread - 1) / 2) * 0.15;
            bulletsOut.push(
              new Bullet(this.x, this.y, aim + offset, 210, false, 6, "#ff7dd1", 9, "boss")
            );
          }
        }
      } else if (this.bossPattern === "spiral") {
        this.fireTimer -= dt;
        this.spiralAngle += dt * 2.5;
        if (this.fireTimer <= 0) {
          this.fireTimer = 0.09;
          const ang = this.spiralAngle;
          bulletsOut.push(
            new Bullet(this.x, this.y, ang, 170, false, 5, "#ffa8ff", 7, "boss")
          );
        }
      } else if (this.bossPattern === "burst") {
        this.radialCooldown -= dt;
        if (this.radialCooldown <= 0) {
          this.radialCooldown = 1.1;
          const rays = 10;
          const base = performance.now() / 500;
          for (let i = 0; i < rays; i++) {
            const ang = base + (i / rays) * Math.PI * 2;
            bulletsOut.push(
              new Bullet(this.x, this.y, ang, 200, false, 5, "#ff5f9e", 8, "boss")
            );
          }
        }
      }
    }
  }
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    
    // Color schemes for each type
    let colors;
    if (this.kind === "boss") {
      // Boss colors based on type
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
      // Enemy colors
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
    
    // Outer glow ring
    ctx.rotate(rotation);
    const glowGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size * 2.2 * pulse);
    glowGradient.addColorStop(0, colors.glow);
    glowGradient.addColorStop(0.4, colors.glow.replace("0.6", "0.2").replace("0.8", "0.3"));
    glowGradient.addColorStop(1, "transparent");
    ctx.fillStyle = glowGradient;
    ctx.beginPath();
    ctx.arc(0, 0, this.size * 2.2 * pulse, 0, Math.PI * 2);
    ctx.fill();
    
    // Main body with gradient
    const bodyGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, this.size);
    bodyGradient.addColorStop(0, "#ffffff");
    bodyGradient.addColorStop(0.3, colors.core);
    bodyGradient.addColorStop(0.7, colors.inner);
    bodyGradient.addColorStop(1, colors.inner + "80");
    ctx.fillStyle = bodyGradient;
    ctx.beginPath();
    ctx.arc(0, 0, this.size, 0, Math.PI * 2);
    ctx.fill();
    
    // Inner geometric pattern - unique for each type
    ctx.strokeStyle = colors.core;
    ctx.lineWidth = this.kind === "boss" ? 3 : 2;
    ctx.globalAlpha = 0.6;
    
    if (this.kind === "boss") {
      // Boss graphics based on type
      if (this.bossType === "titan") {
        // Heavy tank - thick octagon with armor plates
        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
          const angle = (i / 8) * Math.PI * 2 + rotation;
          const x = Math.cos(angle) * this.size * 0.8;
          const y = Math.sin(angle) * this.size * 0.8;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
        // Inner square
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
          const angle = (i / 4) * Math.PI * 2 + rotation + Math.PI / 4;
          const x = Math.cos(angle) * this.size * 0.5;
          const y = Math.sin(angle) * this.size * 0.5;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
      } else if (this.bossType === "sniper") {
        // Sniper - long barrel shape
        ctx.beginPath();
        ctx.moveTo(-this.size * 0.8, 0);
        ctx.lineTo(this.size * 0.8, 0);
        ctx.moveTo(0, -this.size * 0.6);
        ctx.lineTo(0, this.size * 0.6);
        ctx.stroke();
        // Scope rings
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.3, 0, Math.PI * 2);
        ctx.stroke();
      } else if (this.bossType === "swarmlord") {
        // Swarmlord - multiple connected circles
        for (let i = 0; i < 3; i++) {
          const angle = (i / 3) * Math.PI * 2 + rotation;
          const x = Math.cos(angle) * this.size * 0.4;
          const y = Math.sin(angle) * this.size * 0.4;
          ctx.beginPath();
          ctx.arc(x, y, this.size * 0.3, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(0, 0, this.size * 0.5, 0, Math.PI * 2);
        ctx.stroke();
      } else if (this.bossType === "vortex") {
        // Vortex - spiral pattern
        ctx.beginPath();
        for (let i = 0; i < 12; i++) {
          const angle = (i / 12) * Math.PI * 2 + rotation;
          const r1 = this.size * 0.3;
          const r2 = this.size * 0.7;
          const x1 = Math.cos(angle) * r1;
          const y1 = Math.sin(angle) * r1;
          const x2 = Math.cos(angle) * r2;
          const y2 = Math.sin(angle) * r2;
          if (i === 0) ctx.moveTo(x1, y1);
          else ctx.lineTo(x1, y1);
          ctx.lineTo(x2, y2);
        }
        ctx.stroke();
      } else {
        // Default boss: hexagon
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const angle = (i / 6) * Math.PI * 2 + rotation;
          const x = Math.cos(angle) * this.size * 0.7;
          const y = Math.sin(angle) * this.size * 0.7;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();
      }
    } else if (this.kind === "shooter") {
      // Shooter: triangle pattern (ranged)
      ctx.beginPath();
      for (let i = 0; i < 3; i++) {
        const angle = (i / 3) * Math.PI * 2 - Math.PI / 2 + rotation;
        const x = Math.cos(angle) * this.size * 0.6;
        const y = Math.sin(angle) * this.size * 0.6;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    } else if (this.kind === "charger") {
      // Charger: diamond (fast)
      ctx.beginPath();
      ctx.moveTo(0, -this.size * 0.6);
      ctx.lineTo(this.size * 0.6, 0);
      ctx.lineTo(0, this.size * 0.6);
      ctx.lineTo(-this.size * 0.6, 0);
      ctx.closePath();
      ctx.stroke();
    } else if (this.kind === "defender") {
      // Defender: thick square (tanky)
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2 + rotation + Math.PI / 4;
        const x = Math.cos(angle) * this.size * 0.6;
        const y = Math.sin(angle) * this.size * 0.6;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
      // Inner square
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        const angle = (i / 4) * Math.PI * 2 + rotation + Math.PI / 4;
        const x = Math.cos(angle) * this.size * 0.3;
        const y = Math.sin(angle) * this.size * 0.3;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();
    } else if (this.kind === "dart") {
      // Dart: arrow shape (very fast)
      ctx.beginPath();
      ctx.moveTo(this.size * 0.7, 0);
      ctx.lineTo(-this.size * 0.5, -this.size * 0.4);
      ctx.lineTo(-this.size * 0.3, 0);
      ctx.lineTo(-this.size * 0.5, this.size * 0.4);
      ctx.closePath();
      ctx.stroke();
    } else if (this.kind === "orbiter") {
      // Orbiter: circle with orbit lines
      ctx.beginPath();
      ctx.arc(0, 0, this.size * 0.6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-this.size * 0.6, 0);
      ctx.lineTo(this.size * 0.6, 0);
      ctx.moveTo(0, -this.size * 0.6);
      ctx.lineTo(0, this.size * 0.6);
      ctx.stroke();
    } else if (this.kind === "splitter") {
      // Splitter: two overlapping circles
      ctx.beginPath();
      ctx.arc(-this.size * 0.2, 0, this.size * 0.5, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(this.size * 0.2, 0, this.size * 0.5, 0, Math.PI * 2);
      ctx.stroke();
    } else {
      // Swarm: simple cross
      ctx.beginPath();
      ctx.moveTo(-this.size * 0.5, 0);
      ctx.lineTo(this.size * 0.5, 0);
      ctx.moveTo(0, -this.size * 0.5);
      ctx.lineTo(0, this.size * 0.5);
      ctx.stroke();
    }
    
    ctx.globalAlpha = 1;
    
    // Highlight
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.beginPath();
    ctx.arc(-this.size * 0.3, -this.size * 0.3, this.size * 0.3, 0, Math.PI * 2);
    ctx.fill();
    
    // HP bar for damaged enemies
    if (this.hp < this.maxHp) {
      ctx.restore();
      ctx.save();
      ctx.translate(this.x, this.y - this.size - 8);
      const barWidth = this.size * 2;
      const barHeight = 3;
      const hpPercent = this.hp / this.maxHp;
      
      // Background
      ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
      ctx.fillRect(-barWidth / 2, -barHeight / 2, barWidth, barHeight);
      
      // HP bar
      const hpGradient = ctx.createLinearGradient(-barWidth / 2, 0, barWidth / 2, 0);
      hpGradient.addColorStop(0, colors.core);
      hpGradient.addColorStop(1, colors.inner);
      ctx.fillStyle = hpGradient;
      ctx.fillRect(-barWidth / 2, -barHeight / 2, barWidth * hpPercent, barHeight);
      
      ctx.restore();
      return;
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
    const accel = 600;
    const friction = 8;
    if (input.keys.has("w") || input.keys.has("ArrowUp")) this.vy -= accel * dt;
    if (input.keys.has("s") || input.keys.has("ArrowDown")) this.vy += accel * dt;
    if (input.keys.has("a") || input.keys.has("ArrowLeft")) this.vx -= accel * dt;
    if (input.keys.has("d") || input.keys.has("ArrowRight")) this.vx += accel * dt;

    this.vx -= this.vx * friction * dt;
    this.vy -= this.vy * friction * dt;

    const speedBoost =
      this.rapidTimer > 0 ? 1.15 : this.burstTimer > 0 ? 1.05 : 1;
    const maxSpeed = this.speed * speedBoost;
    this.vx = clamp(this.vx, -maxSpeed, maxSpeed);
    this.vy = clamp(this.vy, -maxSpeed, maxSpeed);

    this.x = clamp(this.x + this.vx * dt, 20, config.width - 20);
    this.y = clamp(this.y + this.vy * dt, 20, config.height - 20);

    this.cooldown = Math.max(this.cooldown - dt, 0);
    this.shield = clamp(
      this.shield + dt * 4 * this.shieldRegenMultiplier,
      0,
      this.maxShield
    );
    this.energy = clamp(
      this.energy + dt * 6 * this.energyRegenMultiplier,
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
    const angle = Math.atan2(input.mouse.y - this.y, input.mouse.x - this.x);
    const burstActive = this.burstTimer > 0;
    const rapidActive = this.rapidTimer > 0;
    const rapidVolleyActive = this.rapidVolleyActive;
    
    // Rapid Volley: 2 truly parallel bullets (perpendicular offset)
    if (rapidVolleyActive) {
      const perpAngle = angle + Math.PI / 2; // Perpendicular to aim direction
      const offset = 8; // Distance between parallel bullets
      bullets.push(
        new Bullet(
          this.x + Math.cos(perpAngle) * offset,
          this.y + Math.sin(perpAngle) * offset,
          angle, // Same angle for both (truly parallel)
          500 * this.shotSpeedMultiplier,
          true,
          5,
          "#ffd166",
          11 * this.damageMultiplier
        )
      );
      bullets.push(
        new Bullet(
          this.x - Math.cos(perpAngle) * offset,
          this.y - Math.sin(perpAngle) * offset,
          angle, // Same angle for both (truly parallel)
          500 * this.shotSpeedMultiplier,
          true,
          5,
          "#ffd166",
          11 * this.damageMultiplier
        )
      );
      this.cooldown = this.baseCooldown * (1 / 1.3); // 30% faster than normal (1/1.3 ≈ 0.77)
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
      bullets.push(
        new Bullet(
          this.x,
          this.y,
          angle + offset,
          bulletSpeed,
          true,
          bulletSize,
          bulletColor,
          bulletDamage
        )
      );
    }
    this.cooldown = this.baseCooldown * (this.rapidTimer > 0 ? 0.45 : 1);
  }
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    const angle = Math.atan2(input.mouse.y - this.y, input.mouse.x - this.x);
    ctx.rotate(angle);
    
    // Determine colors based on ship and power-ups
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
      // Ship-specific colors
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
      } else {
        // Striker (default cyan)
        coreColor = "#74ffce";
        glowColor = "rgba(116, 255, 206, 0.7)";
        accentColor = "#4dffb3";
      }
    }
    
    // Engine glow (rear)
    const engineGradient = ctx.createRadialGradient(-15, 0, 0, -15, 0, 12);
    engineGradient.addColorStop(0, glowColor);
    engineGradient.addColorStop(0.5, glowColor.replace("0.7", "0.3"));
    engineGradient.addColorStop(1, "transparent");
    ctx.fillStyle = engineGradient;
    ctx.beginPath();
    ctx.arc(-15, 0, 12, 0, Math.PI * 2);
    ctx.fill();
    
    // Shield ring - scales with shield level and max shield
    const shieldPercent = this.shield / this.maxShield;
    const baseRadius = 20;
    const maxShieldBonus = (this.maxShield / 100) * 8; // Larger max shield = larger ring
    const shieldRadius = baseRadius + (shieldPercent * (12 + maxShieldBonus));
    
    // Use override color if active, otherwise use normal glow color
    const shieldColor = this.shieldColorOverride || glowColor;
    const shieldGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, shieldRadius);
    shieldGradient.addColorStop(0, "transparent");
    shieldGradient.addColorStop(0.7, "transparent");
    // Handle color format (rgba or hex-like)
    const colorForGradient = this.shieldColorOverride 
      ? this.shieldColorOverride.replace(/[\d\.]+\)$/, "0.4)")
      : shieldColor.replace("0.7", "0.4");
    const colorForEdge = this.shieldColorOverride
      ? this.shieldColorOverride.replace(/[\d\.]+\)$/, "0.1)")
      : shieldColor.replace("0.7", "0.1");
    shieldGradient.addColorStop(0.9, colorForGradient);
    shieldGradient.addColorStop(1, colorForEdge);
    ctx.strokeStyle = shieldGradient;
    ctx.lineWidth = 2 + shieldPercent * 1.5; // Thicker when shield is full
    ctx.beginPath();
    ctx.arc(0, 0, shieldRadius, 0, Math.PI * 2);
    ctx.stroke();
    
    // If infinite shield, make it more visible
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
    
    // If fortify is active, add a glow effect
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
    
    // Ship body - different shapes for each ship
    const bodyGradient = ctx.createLinearGradient(18, 0, -12, 0);
    bodyGradient.addColorStop(0, "#ffffff");
    bodyGradient.addColorStop(0.3, coreColor);
    bodyGradient.addColorStop(0.7, accentColor);
    bodyGradient.addColorStop(1, accentColor + "80");
    ctx.fillStyle = bodyGradient;
    
    if (this.shipId === "striker") {
      // Classic triangle fighter
      ctx.beginPath();
      ctx.moveTo(18, 0);
      ctx.lineTo(-12, 12);
      ctx.lineTo(-6, 0);
      ctx.lineTo(-12, -12);
      ctx.closePath();
      ctx.fill();
      
      // Wing details
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(8, -4);
      ctx.lineTo(-8, -8);
      ctx.moveTo(8, 4);
      ctx.lineTo(-8, 8);
      ctx.stroke();
    } else if (this.shipId === "aegis") {
      // Heavy tank - wider, bulkier
      ctx.beginPath();
      ctx.moveTo(16, 0);
      ctx.lineTo(-8, 14);
      ctx.lineTo(-10, 8);
      ctx.lineTo(-14, 0);
      ctx.lineTo(-10, -8);
      ctx.lineTo(-8, -14);
      ctx.closePath();
      ctx.fill();
      
      // Armor plates
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, Math.PI * 2);
      ctx.stroke();
    } else if (this.shipId === "phantom") {
      // Sleek interceptor - narrow and fast
      ctx.beginPath();
      ctx.moveTo(20, 0);
      ctx.lineTo(-10, 10);
      ctx.lineTo(-4, 0);
      ctx.lineTo(-10, -10);
      ctx.closePath();
      ctx.fill();
      
      // Side fins
      ctx.beginPath();
      ctx.moveTo(6, -6);
      ctx.lineTo(12, -8);
      ctx.lineTo(10, -4);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(6, 6);
      ctx.lineTo(12, 8);
      ctx.lineTo(10, 4);
      ctx.closePath();
      ctx.fill();
    } else if (this.shipId === "tempest") {
      // Lightning ship - angular with energy nodes
      ctx.beginPath();
      ctx.moveTo(19, 0);
      ctx.lineTo(-8, 13);
      ctx.lineTo(-2, 6);
      ctx.lineTo(-10, 0);
      ctx.lineTo(-2, -6);
      ctx.lineTo(-8, -13);
      ctx.closePath();
      ctx.fill();
      
      // Energy nodes
      ctx.fillStyle = "#ffff00";
      ctx.beginPath();
      ctx.arc(8, -5, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.arc(8, 5, 3, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.shipId === "titan") {
      // Massive siege ship - very wide
      ctx.beginPath();
      ctx.moveTo(14, 0);
      ctx.lineTo(-6, 16);
      ctx.lineTo(-12, 10);
      ctx.lineTo(-16, 0);
      ctx.lineTo(-12, -10);
      ctx.lineTo(-6, -16);
      ctx.closePath();
      ctx.fill();
      
      // Heavy armor plating
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-4, 12);
      ctx.lineTo(-4, -12);
      ctx.moveTo(4, 8);
      ctx.lineTo(4, -8);
      ctx.stroke();
    } else if (this.shipId === "specter") {
      // Void ship - ethereal, wispy
      ctx.beginPath();
      ctx.moveTo(21, 0);
      ctx.lineTo(-9, 11);
      ctx.lineTo(-3, 0);
      ctx.lineTo(-9, -11);
      ctx.closePath();
      ctx.fill();
      
      // Void trails
      ctx.globalAlpha = 0.6;
      ctx.fillStyle = coreColor;
      ctx.beginPath();
      ctx.ellipse(-5, 0, 8, 3, angle + Math.PI / 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    }
    
    // Ship outline with glow
    ctx.strokeStyle = coreColor;
    ctx.lineWidth = 2;
    ctx.shadowBlur = 8;
    ctx.shadowColor = coreColor;
    ctx.beginPath();
    if (this.shipId === "striker") {
      ctx.moveTo(18, 0);
      ctx.lineTo(-12, 12);
      ctx.lineTo(-6, 0);
      ctx.lineTo(-12, -12);
      ctx.closePath();
    } else if (this.shipId === "aegis") {
      ctx.moveTo(16, 0);
      ctx.lineTo(-8, 14);
      ctx.lineTo(-10, 8);
      ctx.lineTo(-14, 0);
      ctx.lineTo(-10, -8);
      ctx.lineTo(-8, -14);
      ctx.closePath();
    } else if (this.shipId === "phantom") {
      ctx.moveTo(20, 0);
      ctx.lineTo(-10, 10);
      ctx.lineTo(-4, 0);
      ctx.lineTo(-10, -10);
      ctx.closePath();
    } else if (this.shipId === "tempest") {
      ctx.moveTo(19, 0);
      ctx.lineTo(-8, 13);
      ctx.lineTo(-2, 6);
      ctx.lineTo(-10, 0);
      ctx.lineTo(-2, -6);
      ctx.lineTo(-8, -13);
      ctx.closePath();
    } else if (this.shipId === "titan") {
      ctx.moveTo(14, 0);
      ctx.lineTo(-6, 16);
      ctx.lineTo(-12, 10);
      ctx.lineTo(-16, 0);
      ctx.lineTo(-12, -10);
      ctx.lineTo(-6, -16);
      ctx.closePath();
    } else if (this.shipId === "specter") {
      ctx.moveTo(21, 0);
      ctx.lineTo(-9, 11);
      ctx.lineTo(-3, 0);
      ctx.lineTo(-9, -11);
      ctx.closePath();
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
    
    // Core highlight
    ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
    ctx.beginPath();
    ctx.arc(6, 0, 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Engine exhaust particles (if moving)
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
    
    // Apply transparency if invincible
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
    this.speed = maxRadius / duration; // Slow expansion
    this.damage = damage; // Instant damage when circle reaches enemy
    this.damagePerSecond = damagePerSecond; // Continuous damage per second
    this.hitEnemies = new WeakSet(); // Track which enemies have been hit for instant damage
    this.lastDamageTime = 0; // Track when we last applied continuous damage
  }
  update(dt) {
    this.life -= dt;
    this.radius = Math.min(this.radius + this.speed * dt, this.maxRadius);
    this.lastDamageTime += dt;
    
    // Apply continuous damage every 0.1 seconds if damagePerSecond is set
    if (this.damagePerSecond && this.lastDamageTime >= 0.1) {
      for (let i = state.enemies.length - 1; i >= 0; i--) {
        const enemy = state.enemies[i];
        const d = dist(this.x, this.y, enemy.x, enemy.y);
        if (d <= this.radius) {
          const damage = this.damagePerSecond * this.lastDamageTime;
          enemy.hp -= damage;
          if (enemy.hp <= 0) {
            onEnemyDestroyed(enemy, i);
          }
        }
      }
      this.lastDamageTime = 0;
    }
    
    // Apply instant damage when circle reaches enemy (damage once when circle expands to enemy)
    if (this.damage) {
      for (let i = state.enemies.length - 1; i >= 0; i--) {
        const enemy = state.enemies[i];
        if (this.hitEnemies.has(enemy)) continue; // Already hit
        const d = dist(this.x, this.y, enemy.x, enemy.y);
        if (d <= this.radius) {
          this.hitEnemies.add(enemy);
          enemy.hp -= this.damage;
          // Visual effect for shockwave
          if (this.color === "#ffe29b") {
            enemy.y -= 30; // Knockback for shockwave
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
    
    // Outer glow
    const outerGradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius);
    outerGradient.addColorStop(0, this.color + "00");
    outerGradient.addColorStop(0.7, this.color + "40");
    outerGradient.addColorStop(1, this.color + "80");
    ctx.fillStyle = outerGradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Inner bright ring
    const ringGradient = ctx.createRadialGradient(this.x, this.y, this.radius * 0.8, this.x, this.y, this.radius);
    ringGradient.addColorStop(0, this.color + "00");
    ringGradient.addColorStop(0.5, this.color + "AA");
    ringGradient.addColorStop(1, this.color + "00");
    ctx.fillStyle = ringGradient;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Bright edge
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

const state = {
  stars: [],
  player: new Player(),
  bullets: [],
  enemyBullets: [],
  enemies: [],
  particles: [],
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
};

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
  state.wave++;
  spawnWave();
  updateHud();
};

const openUpgradePanel = () => {
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
  state.score += enemy.kind === "boss" ? 500 : 40;
  
  // Award quantum cores immediately
  const diff = difficultyModes[state.difficultyKey] || difficultyModes.veteran;
  let coresAwarded = 0;
  if (enemy.kind === "boss") {
    coresAwarded = Math.floor((50 + state.wave * 5) * (diff.bossHpMultiplier || 1));
  } else {
    coresAwarded = Math.floor((2 + state.wave * 0.5) * (state.difficultyKey === "nightmare" ? 1.5 : state.difficultyKey === "veteran" ? 1.2 : 1));
  }
  state.quantumCores += coresAwarded;
  state.quantumCoresEarnedThisRun += coresAwarded;
  localStorage.setItem("orbital-quantum-cores", state.quantumCores);
  
  // Splitter splits into 2 smaller enemies
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
  addEnergy(enemy.kind === "boss" ? 35 : 15);
  if (enemy.kind === "boss") {
    state.boss = null;
  }
  state.enemies.splice(index, 1);
};

const consumeAbilityEnergy = (cost) => {
  if (state.player.energy < cost) return false;
  state.player.energy -= cost;
  return true;
};

const abilityParticleBurst = (color, count = 150, radius = 80) => {
  // Create particle burst around player
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

const abilityHandlers = {
  burst: (cost) => {
    if (!state.running || state.upgradePending || !consumeAbilityEnergy(cost)) return;
    abilityParticleBurst("#9bf5ff", 250, 100);
    const sprays = 48;
    const damage = 7 * state.player.damageMultiplier * state.player.novaDamageMultiplier;
    const baseSpeed = 420 * state.player.shotSpeedMultiplier;
    for (let ring = 0; ring < 4; ring++) {
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
    abilityParticleBurst("#ffd166", 120, 60);
    // Activate rapid volley mode: fires 2 parallel bullets rapidly
    state.player.rapidVolleyActive = true;
    state.player.rapidVolleyTimer = 1.5; // 1.5 seconds of rapid firing
    // Auto-fire immediately when ability is activated
    state.player.shoot(state.bullets);
  },
  energySurge: (cost) => {
    if (!state.running || state.upgradePending || !consumeAbilityEnergy(cost)) return;
    abilityParticleBurst("#74ffce", 100, 50);
    // Energy orbs flying in spiral formation outwards
    const orbCount = 32; // Increased from 16
    const baseSpeed = 300;
    for (let i = 0; i < orbCount; i++) {
      const spiralAngle = (i / orbCount) * Math.PI * 4; // Multiple rotations
      const radius = 30 + (i / orbCount) * 20; // Spiral outward
      const startX = state.player.x + Math.cos(spiralAngle) * radius;
      const startY = state.player.y + Math.sin(spiralAngle) * radius;
      const direction = spiralAngle + Math.PI / 2; // Perpendicular to spiral
      state.bullets.push(
        new Bullet(
          startX,
          startY,
          direction,
          baseSpeed * state.player.shotSpeedMultiplier,
          true,
          5,
          "#74ffce",
          12 * state.player.damageMultiplier
        )
      );
    }
  },
  shockwave: (cost) => {
    if (!state.running || state.upgradePending || !consumeAbilityEnergy(cost)) return;
    abilityParticleBurst("#ffe29b", 200, 100);
    const radius = 240;
    const baseDamage = 140 + state.wave * 3;
    
    // Create visible expanding circle with continuous damage
    // Damage enemies as the circle expands (not just at the end)
    // Circle follows the player
    const circle = new ExpandingCircle(state.player.x, state.player.y, radius, "#ffe29b", 1.5, baseDamage, null, true);
    state.expandingCircles.push(circle);
    
    // Expanding shockwave rings from player (visual particles)
    for (let ring = 0; ring < 3; ring++) {
      const ringRadius = radius * (ring + 1) / 3;
      for (let j = 0; j < 24; j++) {
        const angle = (j / 24) * Math.PI * 2;
        const x = state.player.x + Math.cos(angle) * ringRadius;
        const y = state.player.y + Math.sin(angle) * ringRadius;
        const p = new Particle(x, y, "#ffe29b");
        p.vx = Math.cos(angle) * 200;
        p.vy = Math.sin(angle) * 200;
        p.life = 0.4;
        state.particles.push(p);
      }
    }
  },
  shieldOvercharge: (cost) => {
    if (!state.running || state.upgradePending || !consumeAbilityEnergy(cost)) return;
    abilityParticleBurst("#90ff90", 150, 70);
    // Create a time dilation field that follows the player
    // Slows down bullets drastically when inside, lasts 7 seconds
    state.timeDilationFields = state.timeDilationFields || [];
    state.timeDilationFields.push(new TimeDilationField(state.player.x, state.player.y));
  },
  fortify: (cost) => {
    if (!state.running || state.upgradePending || !consumeAbilityEnergy(cost)) return;
    abilityParticleBurst("#ffe29b", 180, 80);
    // Activate fortify mode: reduces shield drain from enemies
    state.player.fortifyActive = true;
    state.player.fortifyTimer = 10; // 10 seconds duration
    // Also fire a defensive burst
    const angle = Math.atan2(input.mouse.y - state.player.y, input.mouse.x - state.player.x);
    for (let i = 0; i < 8; i++) {
      const spread = (i - 4) * 0.2;
      state.bullets.push(
        new Bullet(state.player.x, state.player.y, angle + spread, 400 * state.player.shotSpeedMultiplier, true, 4, "#ffe29b", 5 * state.player.damageMultiplier)
      );
    }
  },
  blink: (cost) => {
    if (!state.running || state.upgradePending || !consumeAbilityEnergy(cost)) return;
    const oldX = state.player.x;
    const oldY = state.player.y;
    const angle = Math.atan2(input.mouse.y - state.player.y, input.mouse.x - state.player.x);
    const dashDistance = 180;
    // Particles at origin
    abilityParticleBurst("#d1afff", 100, 50);
    state.player.x = clamp(state.player.x + Math.cos(angle) * dashDistance, 20, config.width - 20);
    state.player.y = clamp(state.player.y + Math.sin(angle) * dashDistance, 20, config.height - 20);
    // Particles at destination
    abilityParticleBurst("#d1afff", 100, 50);
    // Trail effect
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
      state.bullets.push(new Bullet(state.player.x, state.player.y, spread, 360, true, 4, "#d1afff", 7 * state.player.damageMultiplier));
    }
  },
  ghostfire: (cost) => {
    if (!state.running || state.upgradePending || !consumeAbilityEnergy(cost)) return;
    abilityParticleBurst("#d1afff", 100, 50);
    const angle = Math.atan2(input.mouse.y - state.player.y, input.mouse.x - state.player.x);
    for (let i = 0; i < 12; i++) {
      const offset = (i - 6) * 0.1;
      state.bullets.push(new Bullet(state.player.x, state.player.y, angle + offset, 480 * state.player.shotSpeedMultiplier, true, 5, "#d1afff", 8 * state.player.damageMultiplier));
    }
    state.player.burstTimer = Math.min(state.player.burstTimer + 5, 9);
  },
  phaseShift: (cost) => {
    if (!state.running || state.upgradePending || !consumeAbilityEnergy(cost)) return;
    const oldX = state.player.x;
    const oldY = state.player.y;
    abilityParticleBurst("#9b7fff", 120, 60);
    state.player.x = clamp(state.player.x + rng(-200, 200), 20, config.width - 20);
    state.player.y = clamp(state.player.y + rng(-200, 200), 20, config.height - 20);
    abilityParticleBurst("#9b7fff", 120, 60);
    // Replace shield restore with weak attack
    const angle = Math.atan2(input.mouse.y - state.player.y, input.mouse.x - state.player.x);
    for (let i = 0; i < 6; i++) {
      const spread = (i - 3) * 0.15;
      state.bullets.push(
        new Bullet(state.player.x, state.player.y, angle + spread, 450 * state.player.shotSpeedMultiplier, true, 4, "#9b7fff", 6 * state.player.damageMultiplier)
      );
    }
  },
  lightningStorm: (cost) => {
    if (!state.running || state.upgradePending || !consumeAbilityEnergy(cost)) return;
    abilityParticleBurst("#ffff00", 150, 70);
    
    // Random lightning bolts that can hit up to one target each
    const boltCount = Math.min(12, state.enemies.length + 5); // More bolts if more enemies
    const hitEnemies = new Set(); // Track which enemies have been hit
    
    for (let bolt = 0; bolt < boltCount; bolt++) {
      // Random spawn position at top of screen
      const spawnX = rng(50, config.width - 50);
      const spawnY = 0;
      
      // Find nearest unhit enemy
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
      
      // If no target found, strike random location
      const strikeX = target ? target.enemy.x : rng(100, config.width - 100);
      const strikeY = target ? target.enemy.y : rng(100, config.height - 100);
      
      // Create lightning bolt visual
      for (let layer = 0; layer < 3; layer++) {
        for (let k = 0; k < 60; k++) {
          const t = k / 60;
          const baseX = spawnX + (strikeX - spawnX) * t;
          const baseY = spawnY + (strikeY - spawnY) * t;
          const offset = Math.sin(t * 25 + layer) * rng(10, 25);
          const x = baseX + Math.cos(t * Math.PI * 5) * offset;
          const y = baseY;
          const p = new Particle(x, y, layer === 0 ? "#ffffff" : layer === 1 ? "#ffff00" : "#ffaa00");
          p.life = 0.4;
          p.size = rng(3, 5);
          state.particles.push(p);
        }
      }
      
      // Damage target if found
      if (target) {
        hitEnemies.add(target.index);
        target.enemy.hp -= 120 * state.player.damageMultiplier;
        for (let j = 0; j < 30; j++) {
          state.particles.push(new Particle(target.enemy.x, target.enemy.y, "#ffff00"));
        }
        if (target.enemy.hp <= 0) {
          onEnemyDestroyed(target.enemy, target.index);
        }
      }
    }
  },
  combatDrone: (cost) => {
    if (!state.running || state.upgradePending || !consumeAbilityEnergy(cost)) return;
    abilityParticleBurst("#00ffff", 120, 60);
    for (let i = 0; i < 2; i++) {
      const angle = (i / 2) * Math.PI * 2;
      const spawnX = state.player.x + Math.cos(angle) * 40;
      const spawnY = state.player.y + Math.sin(angle) * 40;
      const drone = new Drone(spawnX, spawnY);
      drone.waveSpawned = state.wave; // Track current wave
      state.drones.push(drone);
      // Spawn particles at drone location
      for (let j = 0; j < 30; j++) {
        state.particles.push(new Particle(spawnX, spawnY, "#00ffff"));
      }
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
      const bolt = new Bullet(state.player.x, state.player.y, angle, 600 * state.player.shotSpeedMultiplier, true, 6, "#ffff00", 15 * state.player.damageMultiplier);
      state.bullets.push(bolt);
      // Chain lightning effect from player to target
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
    abilityParticleBurst("#ffff00", 200, 90);
    // Replace stat boost with AOE lightning attack
    const radius = 200;
    const baseDamage = 80 * state.player.damageMultiplier;
    
    // Create visible expanding circle with continuous damage
    // Circle follows the player
    const circle = new ExpandingCircle(state.player.x, state.player.y, radius, "#ffff00", 1.2, baseDamage, null, true);
    state.expandingCircles.push(circle);
  },
  siegeCannon: (cost) => {
    if (!state.running || state.upgradePending || !consumeAbilityEnergy(cost)) return;
    const angle = Math.atan2(input.mouse.y - state.player.y, input.mouse.x - state.player.x);
    // Muzzle flash from player in direction of shot
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
      const bullet = new Bullet(state.player.x, state.player.y, angle + offset, 400 * state.player.shotSpeedMultiplier, true, 12, "#ff4444", 35 * state.player.damageMultiplier);
      state.bullets.push(bullet);
    }
  },
  energyBarrier: (cost) => {
    if (!state.running || state.upgradePending || !consumeAbilityEnergy(cost)) return;
    abilityParticleBurst("#00ffff", 150, 70);
    // Create 3 barriers placed above the player
    // One wide barrier above (flat/horizontal), two others pointing their top points towards the sides
    const centerX = state.player.x;
    const centerY = state.player.y - 60; // Above player
    
    // Center barrier (directly above, wide side flat/horizontal)
    state.barriers.push(new Barrier(centerX, centerY, 0)); // 0 = horizontal
    for (let j = 0; j < 20; j++) {
      const t = (j / 20) - 0.5;
      const x = centerX + Math.cos(0) * t * 60;
      const y = centerY + Math.sin(0) * t * 60;
      state.particles.push(new Particle(x, y, "#00ffff"));
    }
    
    // Left barrier (top point towards left side of center barrier)
    const leftX = state.player.x - 50;
    const leftY = state.player.y - 50;
    const leftAngle = Math.PI; // Points left (top point towards left side)
    state.barriers.push(new Barrier(leftX, leftY, leftAngle));
    for (let j = 0; j < 20; j++) {
      const t = (j / 20) - 0.5;
      const x = leftX + Math.cos(leftAngle) * t * 60;
      const y = leftY + Math.sin(leftAngle) * t * 60;
      state.particles.push(new Particle(x, y, "#00ffff"));
    }
    
    // Right barrier (top point towards right side of center barrier)
    const rightX = state.player.x + 50;
    const rightY = state.player.y - 50;
    const rightAngle = 0; // Points right (top point towards right side)
    state.barriers.push(new Barrier(rightX, rightY, rightAngle));
    for (let j = 0; j < 20; j++) {
      const t = (j / 20) - 0.5;
      const x = rightX + Math.cos(rightAngle) * t * 60;
      const y = rightY + Math.sin(rightAngle) * t * 60;
      state.particles.push(new Particle(x, y, "#00ffff"));
    }
    
    // Infinite shield with color change
    state.player.infiniteShield = true;
    state.player.infiniteShieldTimer = 5;
    state.player.shieldColorOverride = "rgba(0, 255, 255, 0.9)";
    state.player.shieldColorTimer = 5;
  },
  rampage: (cost) => {
    if (!state.running || state.upgradePending || !consumeAbilityEnergy(cost)) return;
    abilityParticleBurst("#ff4444", 200, 90);
    // Replace stat boost with rapid fire burst
    const angle = Math.atan2(input.mouse.y - state.player.y, input.mouse.x - state.player.x);
    for (let i = 0; i < 15; i++) {
      const spread = (i - 7) * 0.1;
      state.bullets.push(
        new Bullet(state.player.x, state.player.y, angle + spread, 550 * state.player.shotSpeedMultiplier, true, 6, "#ff4444", 12 * state.player.damageMultiplier)
      );
    }
  },
  blackHole: (cost) => {
    if (!state.running || state.upgradePending || !consumeAbilityEnergy(cost)) return;
    const angle = Math.atan2(input.mouse.y - state.player.y, input.mouse.x - state.player.x);
    const distance = 150;
    const holeX = state.player.x + Math.cos(angle) * distance;
    const holeY = state.player.y + Math.sin(angle) * distance;
    // Particles from player to black hole location
    for (let i = 0; i < 50; i++) {
      const t = i / 50;
      const x = state.player.x + (holeX - state.player.x) * t;
      const y = state.player.y + (holeY - state.player.y) * t;
      const p = new Particle(x, y, "#9b7fff");
      p.vx = Math.cos(angle) * rng(-50, 50);
      p.vy = Math.sin(angle) * rng(-50, 50);
      state.particles.push(p);
    }
    state.blackHoles.push(new BlackHole(holeX, holeY));
    // Explosive burst at black hole location
    for (let i = 0; i < 300; i++) {
      const burstAngle = (i / 300) * Math.PI * 2;
      const burstDist = rng(0, 120);
      const x = holeX + Math.cos(burstAngle) * burstDist;
      const y = holeY + Math.sin(burstAngle) * burstDist;
      const p = new Particle(x, y, "#9b7fff");
      p.vx = Math.cos(burstAngle) * rng(50, 150);
      p.vy = Math.sin(burstAngle) * rng(50, 150);
      p.life = rng(0.3, 0.6);
      state.particles.push(p);
    }
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
    // Make player semi-transparent and invincible (bullets pass through)
    state.player.invincible = true;
    state.player.invincibleTimer = 10;
  },
};

const triggerAbility = (abilityType) => {
  const ability = state.player.abilities.find(a => a.type === abilityType);
  if (!ability) return;
  const handler = abilityHandlers[abilityType];
  if (handler) handler(ability.cost);
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
  const diff = difficultyModes[state.difficultyKey] || difficultyModes.veteran;
  const baseCount = Math.min(5 + Math.floor(state.wave * 1.5), 32);
  const count = Math.max(1, Math.round(baseCount * diff.enemyCount));
  state.enemies.length = 0;
  state.enemyBullets = [];
  state.bullets = [];
  // Clear drones, barriers, black holes, expanding circles, and time dilation fields on new wave
  state.drones = [];
  state.barriers = [];
  state.blackHoles = [];
  state.expandingCircles = [];
  state.timeDilationFields = [];
  state.boss = null;
  state.waveAnnouncementTimer = 2.5;
  state.awaitingUpgrade = false;
  bossBar.classList.add("hidden");
  bossBar.style.display = "none";
    const types = ["swarm", "shooter", "charger", "defender", "dart", "orbiter", "splitter"];
  if (state.wave % 5 === 0) {
    // Boss wave - prevent consecutive same boss
    const bossTypes = ["titan", "sniper", "swarmlord", "vortex"];
    let bossType = bossTypes[Math.floor(Math.random() * bossTypes.length)];
    if (bossType === state.lastBossType && bossTypes.length > 1) {
      // Pick a different one
      const available = bossTypes.filter(t => t !== state.lastBossType);
      bossType = available[Math.floor(Math.random() * available.length)];
    }
    state.lastBossType = bossType;
    const boss = new Enemy("boss", config.width / 2, 120, state.wave, bossType);
    applyDifficultyToEnemy(boss, diff, true);
    state.enemies.push(boss);
    state.boss = boss;
    bossBar.classList.remove("hidden");
    bossBar.style.display = "flex";
    bossBarFill.style.height = "100%";
  } else {
    // Regular wave - more variety as waves progress
    const availableTypes = state.wave < 3 ? ["swarm", "shooter", "charger"] :
                          state.wave < 6 ? ["swarm", "shooter", "charger", "defender", "dart"] :
                          types;
    for (let i = 0; i < count; i++) {
      const kind = availableTypes[Math.floor(Math.random() * availableTypes.length)];
      const enemy = new Enemy(
        kind,
        rng(60, config.width - 60),
        rng(50, 200),
        state.wave
      );
      applyDifficultyToEnemy(enemy, diff, false);
      state.enemies.push(enemy);
    }
  }
};

const applyDifficultyToEnemy = (enemy, diff, isBoss) => {
  if (isBoss) {
    enemy.hp *= diff.bossHpMultiplier || 1;
    enemy.maxHp = enemy.hp;
  } else {
    enemy.hp *= diff.enemyHp;
    enemy.maxHp = enemy.hp;
  }
  enemy.speed *= diff.enemySpeed;
  enemy.fireTimer *= 1 / diff.enemySpeed;
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

const resetGame = () => {
  if (!state.unlockedShips.includes(state.shipKey)) {
    state.shipKey = "striker";
  }
  const loadout = shipLoadouts[state.shipKey] || shipLoadouts.striker;
  state.player = new Player(loadout);
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
  state.lastTime = performance.now();
  requestAnimationFrame(gameLoop);
};

const updateHud = () => {
  const p = state.player;
  hud.hp.textContent = `${Math.round(p.hp)}/${p.maxHp}`;
  hud.shield.textContent = `${Math.round(p.shield)}/${p.maxShield}`;
  hud.energy.textContent = `${Math.round(p.energy)}`;
  hud.score.textContent = state.score;
  hud.wave.textContent = state.wave;
  hud.highScore.textContent = state.highScore;
  if (hud.quantumCores) {
    hud.quantumCores.textContent = state.quantumCores;
  }
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
        state.bullets.splice(j, 1);
        state.particles.push(new Particle(bullet.x, bullet.y, "#f5f285"));
        if (enemy.hp <= 0) {
          onEnemyDestroyed(enemy, i);
        }
        break;
      }
    }
  }

  // Check enemy bullets against shield
  const shieldRadius = state.player.getShieldRadius();
  for (let i = state.enemyBullets.length - 1; i >= 0; i--) {
    const bullet = state.enemyBullets[i];
    const distToPlayer = dist(bullet.x, bullet.y, state.player.x, state.player.y);
    
    // If bullet is within shield range, block it
    if (distToPlayer < shieldRadius + bullet.size && state.player.shield > 0 && !state.player.invincible) {
      state.enemyBullets.splice(i, 1);
      // Shield drain: full damage normally, reduced when fortify is active
      const drainAmount = state.player.fortifyActive 
        ? bullet.damage * 0.1  // Reduced drain when fortify active
        : bullet.damage;        // Full damage otherwise
      state.player.shield = Math.max(0, state.player.shield - drainAmount);
      // Visual feedback
      for (let j = 0; j < 5; j++) {
        state.particles.push(new Particle(bullet.x, bullet.y, state.player.shieldColorOverride || "#74ffce"));
      }
      continue;
    }
    
    // Normal collision with player
    if (distToPlayer < bullet.size + 16) {
      // If invincible (ethereal), bullets pass through without being removed
      if (state.player.invincible) {
        // Bullet continues on its path, no damage, no removal
        continue;
      }
      // Otherwise, remove bullet and deal damage
      state.enemyBullets.splice(i, 1);
      absorbDamage(bullet.damage);
    }
  }

  // Check enemies against shield (pushback and shield drain)
  for (let i = state.enemies.length - 1; i >= 0; i--) {
    const enemy = state.enemies[i];
    const distToPlayer = dist(enemy.x, enemy.y, state.player.x, state.player.y);
    const pushbackRadius = shieldRadius + enemy.size;
    
    // If enemy is within shield range, push it back and drain shield
    if (distToPlayer < pushbackRadius && state.player.shield > 0 && !state.player.invincible) {
      // Push enemy away from player (frame-independent)
      const angle = Math.atan2(enemy.y - state.player.y, enemy.x - state.player.x);
      const pushSpeed = 180; // Units per second
      const pushDistance = pushSpeed * dt; // Use actual dt
      enemy.x += Math.cos(angle) * pushDistance;
      enemy.y += Math.sin(angle) * pushDistance;
      
      // Clamp enemy position to stay on screen
      enemy.x = clamp(enemy.x, enemy.size, config.width - enemy.size);
      enemy.y = clamp(enemy.y, enemy.size, config.height - enemy.size);
      
      // Drain shield (more drain for larger enemies) - per second
      // Base drain: 2x more than before when fortify not active, halved when fortify active
      const baseDrain = (enemy.size / 20) * 30 * dt; // 2x the previous value
      const shieldDrain = state.player.fortifyActive 
        ? baseDrain * 0.5  // Halved when fortify active
        : baseDrain;        // 2x normal otherwise
      state.player.shield = Math.max(0, state.player.shield - shieldDrain);
      
      // Visual feedback
      if (Math.random() < 0.3) {
        state.particles.push(new Particle(enemy.x, enemy.y, state.player.shieldColorOverride || "#74ffce"));
      }
    }
    
    // Direct collision with player (when shield is depleted or enemy gets through)
    if (distToPlayer < enemy.size + 20) {
      // If invincible, enemies pass through dealing 0 damage
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
  // If infinite shield is active, no damage is taken
  if (p.infiniteShield) {
    state.particles.push(new Particle(p.x, p.y, p.shieldColorOverride || "#74ffce"));
    return;
  }
  const shieldAbsorb = Math.min(p.shield, amount);
  p.shield -= shieldAbsorb;
  p.hp -= amount - shieldAbsorb * 0.4;
  state.particles.push(new Particle(p.x, p.y, "#74ffce"));
  if (p.hp <= 0) endGame();
};

const applyPowerUp = (kind) => {
  const p = state.player;
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
  // Bullets fire automatically at all times
  state.player.shoot(state.bullets);
  state.bullets = state.bullets.filter((b) => {
    b.update(dt);
    return b.life > 0 && b.x >= -20 && b.x <= config.width + 20 && b.y >= -20 && b.y <= config.height + 20;
  });

  // Update drones
  state.drones = state.drones.filter((drone) => {
    drone.update(dt, state.player);
    return drone.life > 0;
  });

  // Update barriers
  state.barriers = state.barriers.filter((barrier) => {
    barrier.update(dt);
    return barrier.life > 0;
  });

  // Update black holes
  state.blackHoles = state.blackHoles.filter((hole) => {
    hole.update(dt);
    return hole.life > 0;
  });

  // Update expanding circles
  state.expandingCircles = state.expandingCircles.filter((circle) => {
    circle.update(dt);
    return circle.life > 0;
  });

  // Update time dilation fields BEFORE enemy bullets so they can slow them down
  // First, update all fields and restore speeds for expiring fields
  state.timeDilationFields.forEach((field) => {
    const wasExpiring = field.life <= 0;
    field.update(dt);
    const isExpiring = field.life <= 0;
    
    // If field just expired, restore all affected speeds
    if (isExpiring && !wasExpiring) {
      // Restore all bullet speeds
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
      // Restore all enemy speeds
      for (let i = 0; i < state.enemies.length; i++) {
        const enemy = state.enemies[i];
        if (enemy.originalSpeed) {
          enemy.speed = enemy.originalSpeed;
          enemy.originalSpeed = null;
        }
      }
    }
  });
  // Then filter out expired fields
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

  state.enemies.forEach((enemy) => enemy.update(dt, state.player, state.enemyBullets));
  state.powerUps = state.powerUps.filter((p) => {
    p.update(dt);
    return p.life > 0;
  });
  state.particles = state.particles.filter((particle) => {
    particle.update(dt);
    return particle.life > 0;
  });
  handleCollisions(dt);

  if (
    state.running &&
    state.enemies.length === 0 &&
    !state.upgradePending &&
    !state.awaitingUpgrade
  ) {
    state.awaitingUpgrade = true;
    openUpgradePanel();
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
  state.barriers.forEach((barrier) => barrier.draw(ctx));
  state.expandingCircles.forEach((circle) => circle.draw(ctx));
  // Draw time dilation fields before bullets so they're visible
  state.timeDilationFields.forEach((field) => field.draw(ctx));
  state.enemyBullets.forEach((bullet) => bullet.draw(ctx));
  state.bullets.forEach((bullet) => bullet.draw(ctx));
  state.drones.forEach((drone) => drone.draw(ctx));
  state.player.draw(ctx);
  state.particles.forEach((particle) => particle.draw(ctx));
  
};

const drawMiniMap = () => {
  miniCtx.fillStyle = "rgba(3,6,21,0.9)";
  miniCtx.fillRect(0, 0, mini.width, mini.height);
  const scaleX = mini.width / config.width;
  const scaleY = mini.height / config.height;
  miniCtx.fillStyle = "#74ffce";
  miniCtx.fillRect(state.player.x * scaleX - 2, state.player.y * scaleY - 2, 4, 4);
  miniCtx.fillStyle = "#ff7676";
  state.enemies.forEach((enemy) => {
    miniCtx.fillRect(enemy.x * scaleX - 2, enemy.y * scaleY - 2, 3, 3);
  });
  miniCtx.fillStyle = "#78c0ff";
  state.powerUps.forEach((power) => {
    miniCtx.fillRect(power.x * scaleX - 2, power.y * scaleY - 2, 4, 4);
  });
};

const drawWaveBanner = () => {
  if (state.waveAnnouncementTimer <= 0) return;
  ctx.save();
  ctx.globalAlpha = clamp(state.waveAnnouncementTimer / 2.5, 0, 1);
  ctx.fillStyle = "#fafafa";
  ctx.font = "32px Space Grotesk";
  ctx.textAlign = "center";
  const isBoss = state.wave % 5 === 0;
  const label = isBoss ? `Boss Wave ${state.wave}` : `Wave ${state.wave}`;
  ctx.fillText(label, config.width / 2, config.height / 2);
  ctx.restore();
};

const gameLoop = (timestamp) => {
  if (!state.running) return;
  const dt = Math.min((timestamp - state.lastTime) / 1000, 0.04);
  state.lastTime = timestamp;

  const active = !state.paused && !state.upgradePending;

  if (active) {
    drawBackground(dt);
    updateEntities(dt);
    drawEntities();
    drawWaveBanner();
    drawMiniMap();
    updateHud();
    state.waveAnnouncementTimer = Math.max(
      state.waveAnnouncementTimer - dt,
      0
    );
  } else if (state.paused && !state.upgradePending) {
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.fillRect(0, 0, config.width, config.height);
    ctx.fillStyle = "#fff";
    ctx.font = "24px Space Grotesk";
    ctx.textAlign = "center";
    ctx.fillText("Paused - Press P to resume", config.width / 2, config.height / 2);
    ctx.restore();
  }

  updateBossBar();
  requestAnimationFrame(gameLoop);
};

const endGame = () => {
  state.running = false;
  state.highScore = Math.max(state.highScore, state.score);
  localStorage.setItem("orbital-high-score", state.highScore);
  gameOverTitle.textContent = "Mission Failed";
  gameOverDetails.textContent = `Waves cleared: ${state.wave} · Score: ${state.score} · +${state.quantumCoresEarnedThisRun} Quantum Cores`;
  gameOverEl.classList.remove("hidden");
  minimapEl.classList.add("hidden");
  bossBar.classList.add("hidden");
  bossBar.style.display = "none";
  upgradePanel.classList.add("hidden");
  state.upgradePending = false;
  state.awaitingUpgrade = false;
  state.quantumCoresEarnedThisRun = 0;
  updateHud();
};

const togglePause = () => {
  if (!state.running || state.upgradePending) return;
  state.paused = !state.paused;
};

const onKeyDown = (event) => {
  const key = event.key.toLowerCase();
  if (key === "p") {
    togglePause();
    return;
  }
  if (key === "1" || key === "2" || key === "3") {
    const abilityMap = { "1": 0, "2": 1, "3": 2 };
    const abilityIndex = abilityMap[key];
    if (state.player.abilities && state.player.abilities[abilityIndex]) {
      triggerAbility(state.player.abilities[abilityIndex].type);
    }
    return;
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

canvas.addEventListener("mousedown", () => {
  input.mouse.down = true;
});
window.addEventListener("mouseup", () => {
  input.mouse.down = false;
});

window.addEventListener("keydown", onKeyDown);
window.addEventListener("keyup", onKeyUp);

startButton.addEventListener("click", () => {
  const difficultySelection = document.querySelector(
    'input[name="difficulty"]:checked'
  );
  const shipSelection = document.querySelector('input[name="ship"]:checked');
  if (difficultySelection) state.difficultyKey = difficultySelection.value;
  if (shipSelection) {
    const selectedShip = shipSelection.value;
    if (state.unlockedShips.includes(selectedShip)) {
      state.shipKey = selectedShip;
    } else {
      state.shipKey = "striker";
    }
  }
  instructionsEl.classList.add("hidden");
  gameOverEl.classList.add("hidden");
  minimapEl.classList.remove("hidden");
  upgradePanel.classList.add("hidden");
  shipShopPanel.classList.add("hidden");
  resetGame();
});

// Ship selection radio buttons are now dynamically created in updateShipSelection
// No need for static listeners since they're added when the buttons are created

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
  gameOverEl.classList.add("hidden");
  minimapEl.classList.remove("hidden");
  upgradePanel.classList.add("hidden");
  resetGame();
});

window.addEventListener("blur", () => {
  input.keys.clear();
  input.mouse.down = false;
  state.paused = true;
});

const openShipShop = () => {
  shipShopPanel.classList.remove("hidden");
  if (shopQuantumCores) shopQuantumCores.textContent = state.quantumCores;
  shipShopList.innerHTML = "";
  Object.values(shipLoadouts).forEach((ship) => {
    const isUnlocked = state.unlockedShips.includes(ship.id);
    const canAfford = state.quantumCores >= ship.price;
    const isSelected = state.shipKey === ship.id;
    const card = document.createElement("div");
    card.className = `ship-card ${isUnlocked ? "unlocked" : ""} ${!isUnlocked && canAfford ? "affordable" : ""} ${isSelected ? "selected" : ""}`;
    card.innerHTML = `
      <div class="ship-card__header">
        <strong>${ship.name}</strong>
        ${isUnlocked ? '<span class="ship-card__badge">UNLOCKED</span>' : `<span class="ship-card__price">${ship.price} Quantum Cores</span>`}
        ${isSelected ? '<span class="ship-card__badge selected-badge">SELECTED</span>' : ""}
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
      ${!isUnlocked ? `<button class="ship-card__buy" ${!canAfford ? "disabled" : ""}>Purchase</button>` : `<button class="ship-card__select" ${isSelected ? "disabled" : ""}>${isSelected ? "Selected" : "Select"}</button>`}
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
          updateShipSelection(); // Update the start menu ship selection
        }
      });
    }
    if (selectBtn) {
      selectBtn.addEventListener("click", () => {
        state.shipKey = ship.id;
        openShipShop();
        updateShipSelection(); // This will update the radio buttons in the start menu
      });
    }
    shipShopList.appendChild(card);
  });
};

const updateShipSelection = () => {
  // Get the container for ship options - find the select-group that contains ship radio buttons
  const selectGroups = document.querySelectorAll('.select-group');
  let shipContainer = null;
  for (const group of selectGroups) {
    if (group.querySelector('input[name="ship"]')) {
      shipContainer = group.querySelector('.option-cards');
      break;
    }
  }
  if (!shipContainer) return;
  
  // Clear existing ship options
  shipContainer.innerHTML = "";
  
  // Create radio buttons for all unlocked ships
  state.unlockedShips.forEach(shipId => {
    const ship = shipLoadouts[shipId];
    if (!ship) return;
    
    const label = document.createElement("label");
    label.className = "option-card";
    
    const radio = document.createElement("input");
    radio.type = "radio";
    radio.name = "ship";
    radio.value = shipId;
    if (state.shipKey === shipId) {
      radio.checked = true;
    }
    
    const strong = document.createElement("strong");
    strong.textContent = ship.name;
    
    const span = document.createElement("span");
    span.textContent = ship.abilities.map(a => `${a.name} (${a.cost} energy)`).join(" · ");
    
    label.appendChild(radio);
    label.appendChild(strong);
    label.appendChild(span);
    
    // Add change listener
    radio.addEventListener("change", () => {
      if (radio.checked) {
        state.shipKey = shipId;
      }
    });
    
    shipContainer.appendChild(label);
  });
};

const closeShipShop = () => {
  shipShopPanel.classList.add("hidden");
  updateShipSelection();
};

spawnStars();
updateHud();
updateShipSelection();

