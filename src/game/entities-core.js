function pushEnemyBullet(bulletsOut, enemy, bullet) {
  bullet.spawnEnemy = enemy;
  bulletsOut.push(bullet);
}

class Enemy {
  constructor(kind, x, y, wave, bossType = null) {
    this.kind = kind;
    this.bossType = bossType; 
    this.x = x;
    this.y = y;
    
    
    if (kind === "boss") {
      const baseHp = { titan: 1200, sniper: 800, swarmlord: 900, vortex: 850, bosslaser: 880, sprayer: 980 }[bossType] || 800;
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
    
    
    const rel = typeof scaleByViewport === "function" ? scaleByViewport : (v) => v;
    if (kind === "boss") {
      this.size = rel(({ titan: 60, sniper: 35, swarmlord: 45, vortex: 40, bosslaser: 38, sprayer: 44 }[bossType] || 40));
    } else {
      const sizeMap = { swarm: 18, shooter: 20, charger: 16, defender: 24, dart: 14, orbiter: 19, splitter: 18 };
      this.size = rel(sizeMap[kind] || 18);
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
      if (bossType === "bosslaser") {
        this.bossLaserCharge = 0;
        this.bossLaserFired = false;
        this.bossLaserHazardSpawnsLeft = 0;
        this.bossLaserHazardSpawnTimer = 0;
      }
      if (bossType === "sprayer") {
        this.sprayerAim = -Math.PI / 2;
        this.sprayerAimLocked = -Math.PI / 2;
        this.sprayerChargeTimer = 0;
        this.sprayerVolleyFired = 0;
      }
    }
    
    
    if (kind === "orbiter") {
      this.orbitRadius = rng(80, 150);
      this.orbitAngle = Math.random() * Math.PI * 2;
      this.orbitSpeed = rng(1.5, 2.5);
    }
    if (this.kind === "splitter") {
      this.hasSplit = false;
    }
    this.stunTimer = 0;
    this.specterHauntTimer = 0;
    this.specterHauntDps = 0;
    this.infernoBurnTimer = 0;
    this.infernoBurnDps = 0;
    clampEnemyBelowHud(this);
  }
  update(dt, player, bulletsOut) {
    
    if (this.deathMarked && this.deathMarkTimer) {
      this.deathMarkTimer -= dt;
      if (this.deathMarkTimer <= 0) {
        this.deathMarked = false;
        this.deathMarkTimer = 0;
      }
    }
    if ((this.infernoBurnTimer || 0) > 0) {
      this.infernoBurnTimer -= dt;
      const ib = this.infernoBurnDps || 0;
      if (ib > 0 && this.hp > 0) {
        const ibm = ib * dt;
        this.hp -= ibm;
        recordDamageDealt(ibm);
      }
      if (Math.random() < 0.32) {
        state.particles.push(
          new Particle(this.x + rng(-7, 7), this.y + rng(-7, 7), Math.random() < 0.5 ? "#ff6600" : "#ffcc44")
        );
      }
      if (this.infernoBurnTimer <= 0) {
        this.infernoBurnDps = 0;
      }
    }
    if (typeof state !== "undefined" && state.oracleChronos && state.oracleChronos.life > 0 && this.hp > 0) {
      this.y -= (state.oracleChronos.driftSpeed || 56) * dt;
      this.fireTimer = Math.max(this.fireTimer, 2.8);
      clampEnemyBelowHud(this);
      return;
    }
    if ((this.specterHauntTimer || 0) > 0) {
      this.specterHauntTimer -= dt;
      const hdps = this.specterHauntDps || 0;
      if (hdps > 0 && this.hp > 0) {
        const hdm = hdps * dt;
        this.hp -= hdm;
        recordDamageDealt(hdm);
      }
      this.stunTimer = Math.max(this.stunTimer || 0, 0.2);
      if (Math.random() < 0.45) {
        state.particles.push(new Particle(this.x + rng(-8, 8), this.y + rng(-8, 8), "#f0f0ff"));
      }
      if (this.specterHauntTimer <= 0) {
        this.specterHauntDps = 0;
      }
      clampEnemyBelowHud(this);
      return;
    }
    if ((this.stunTimer || 0) > 0) {
      this.stunTimer = Math.max(0, this.stunTimer - dt);
      clampEnemyBelowHud(this);
      return;
    }
    const targetActor = getEnemyTargetFor(this, player);
    const angle = Math.atan2(targetActor.y - this.y, targetActor.x - this.x);
    const chainSlowFactor = this.reaperChainSlowTimer && this.reaperChainSlowTimer > 0 ? 0.5 : 1;
    const fieldSlowFactor = this.timeDilationSlowFactor != null ? this.timeDilationSlowFactor : 1;
    const movementDt = dt * chainSlowFactor * fieldSlowFactor;
    if (this.reaperChainSlowTimer) this.reaperChainSlowTimer = Math.max(0, this.reaperChainSlowTimer - dt);
    if (this.kind === "swarm") {
      this.vx = Math.cos(angle) * this.speed;
      this.vy = Math.sin(angle) * this.speed;
      
      const smoothing = 0.15; 
      this.smoothVx += (this.vx - this.smoothVx) * smoothing;
      this.smoothVy += (this.vy - this.smoothVy) * smoothing;
      this.x += this.vx * movementDt;
      this.y += this.vy * movementDt;
    } else if (this.kind === "charger") {
      this.speed = 120 + Math.sin(performance.now() / 300) * 60;
      this.vx = Math.cos(angle) * this.speed;
      this.vy = Math.sin(angle) * this.speed;
      
      const smoothing = 0.15;
      this.smoothVx += (this.vx - this.smoothVx) * smoothing;
      this.smoothVy += (this.vy - this.smoothVy) * smoothing;
      this.x += this.vx * movementDt;
      this.y += this.vy * movementDt;
    } else if (this.kind === "shooter") {
      
      const minY = config.height - 200;
      if (this.y < minY) {
        this.vx = 0;
        this.vy = 80;
        this.smoothVx += (this.vx - this.smoothVx) * 0.15;
        this.smoothVy += (this.vy - this.smoothVy) * 0.15;
        this.y += this.vy * movementDt;
        this.y = Math.min(this.y, minY);
      } else {
        const targetY = minY + Math.sin(performance.now() / 700 + this.phase) * 50;
        this.vx = Math.cos(performance.now() / 600 + this.phase) * this.speed * 0.4;
        this.vy = (targetY - this.y) * 2.5;
        this.smoothVx += (this.vx - this.smoothVx) * 0.15;
        this.smoothVy += (this.vy - this.smoothVy) * 0.15;
        this.x += this.vx * movementDt;
        this.y += this.vy * movementDt;
      }
    } else if (this.kind === "defender") {
      
      this.vx = Math.cos(angle) * this.speed * 0.6;
      this.vy = Math.sin(angle) * this.speed * 0.6;
      
      const smoothing = 0.15;
      this.smoothVx += (this.vx - this.smoothVx) * smoothing;
      this.smoothVy += (this.vy - this.smoothVy) * smoothing;
      this.x += this.vx * movementDt;
      this.y += this.vy * movementDt;
    } else if (this.kind === "dart") {
      
      const burstSpeed = this.speed * (1.5 + Math.sin(performance.now() / 200) * 0.5);
      this.vx = Math.cos(angle) * burstSpeed;
      this.vy = Math.sin(angle) * burstSpeed;
      
      const smoothing = 0.2; 
      this.smoothVx += (this.vx - this.smoothVx) * smoothing;
      this.smoothVy += (this.vy - this.smoothVy) * smoothing;
      this.x += this.vx * movementDt;
      this.y += this.vy * movementDt;
    } else if (this.kind === "orbiter") {
      
      this.orbitAngle += this.orbitSpeed * dt;
      const targetX = player.x + Math.cos(this.orbitAngle) * this.orbitRadius;
      const targetY = player.y + Math.sin(this.orbitAngle) * this.orbitRadius;
      this.vx = (targetX - this.x) * 3;
      this.vy = (targetY - this.y) * 3;
      
      const smoothing = 0.2;
      this.smoothVx += (this.vx - this.smoothVx) * smoothing;
      this.smoothVy += (this.vy - this.smoothVy) * smoothing;
      this.x += this.vx * movementDt;
      this.y += this.vy * movementDt;
    } else if (this.kind === "splitter") {
      
      this.vx = Math.cos(angle) * this.speed;
      this.vy = Math.sin(angle) * this.speed;
      
      const smoothing = 0.15;
      this.smoothVx += (this.vx - this.smoothVx) * smoothing;
      this.smoothVy += (this.vy - this.smoothVy) * smoothing;
      this.x += this.vx * movementDt;
      this.y += this.vy * movementDt;
    } else if (this.kind === "boss") {
      
      if (this.bossType === "titan") {
        
        this.vx = Math.cos(performance.now() / 1200) * this.speed * 0.7;
        this.vy = Math.sin(performance.now() / 1000) * this.speed * 0.7;
        this.x += this.vx * dt;
        this.y += this.vy * dt;
      } else if (this.bossType === "sniper" || this.bossType === "bosslaser") {
        
        this.vx = Math.cos(performance.now() / 1500) * this.speed * 0.5;
        this.vy = Math.sin(performance.now() / 1100) * this.speed * 0.4;
        this.x += this.vx * dt;
      this.y = clamp(this.y + this.vy * dt, TOP_HUD_SAFE_Y + this.size, 180);
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
      } else if (this.bossType === "sprayer") {
        const stopY = TOP_HUD_SAFE_Y + 130;
        this.vx = 0;
        if (this.y < stopY) {
          this.vy = 72;
          this.y = Math.min(stopY, this.y + this.vy * dt);
        } else {
          this.vy = 0;
          this.y = stopY;
        }
      } else {
        
        this.vx = Math.cos(performance.now() / 900) * this.speed;
        this.vy = Math.sin(performance.now() / 700) * this.speed;
        this.x += this.vx * dt;
        this.y += this.vy * dt;
      }
      this.updateBossPattern(dt, player, bulletsOut);
      this.x = clamp(this.x, 80, config.width - 80);
      this.y = clamp(this.y, TOP_HUD_SAFE_Y + this.size, config.height - 200);
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
    this.y = clamp(this.y, TOP_HUD_SAFE_Y + this.size, bottomClamp);

    if (this.kind !== "charger") {
      this.fireTimer -= dt;
    }
    if (this.fireTimer <= 0) {
      if (this.kind === "boss") {
        
        this.fireTimer = 1.0;
      } else if (this.kind === "shooter") {
        this.fireTimer = rng(0.8, 1.2);
        this.shootAngle = angle; 
        pushEnemyBullet(
          bulletsOut,
          this,
          new Bullet(this.x, this.y, angle, 180, false, 5, undefined, undefined, "shooter")
        );
      } else if (this.kind === "defender") {
        this.fireTimer = rng(1.5, 2.5);
        this.shootAngle = angle; 
        
        pushEnemyBullet(
          bulletsOut,
          this,
          new Bullet(this.x, this.y, angle, 90, false, 6, undefined, 12, "enemy")
        );
      } else if (this.kind === "dart") {
        this.fireTimer = rng(0.4, 0.8);
        this.shootAngle = angle; 
        
        pushEnemyBullet(
          bulletsOut,
          this,
          new Bullet(this.x, this.y, angle, 200, false, 3, undefined, 5, "enemy")
        );
      } else if (this.kind === "orbiter") {
        this.fireTimer = rng(1.2, 1.8);
        this.shootAngle = angle; 
        
        pushEnemyBullet(
          bulletsOut,
          this,
          new Bullet(this.x, this.y, angle, 140, false, 4, undefined, undefined, "enemy")
        );
      } else if (this.kind === "splitter") {
        this.fireTimer = rng(1.0, 1.5);
        this.shootAngle = angle; 
        
        for (let i = 0; i < 3; i++) {
          const offset = (i - 1) * 0.15;
          pushEnemyBullet(
            bulletsOut,
            this,
            new Bullet(this.x, this.y, angle + offset, 120, false, 4, undefined, undefined, "enemy")
          );
        }
      } else {
        
        this.fireTimer = rng(1.0, 1.6);
        this.shootAngle = angle; 
        pushEnemyBullet(
          bulletsOut,
          this,
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
    } else if (this.bossType === "bosslaser") {
      const patterns = ["mainLaser", "hazardField"];
      this.bossPattern = patterns[Math.floor(Math.random() * patterns.length)];
      this.patternTimer = this.bossPattern === "mainLaser" ? 4 : 8;
      this.bossLaserCharge = 0;
      this.bossLaserFired = false;
      this.bossLaserHazardSpawnsLeft = this.bossPattern === "hazardField" ? 10 + Math.floor(Math.random() * 4) : 0;
      this.bossLaserHazardSpawnTimer = 0.12;
    } else if (this.bossType === "sprayer") {
      const patterns = ["orbRings", "parallelVolley"];
      this.bossPattern = patterns[Math.floor(Math.random() * patterns.length)];
      this.patternTimer = this.bossPattern === "orbRings" ? 3.4 : 4.4;
      this.sprayerChargeTimer = 0;
      this.sprayerVolleyFired = 0;
      this.sprayerAimLocked = this.sprayerAim || -Math.PI / 2;
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
    const bossActionRate = getDifficulty().bossActionRate || 1;
    
    if (this.bossType === "titan") {
      
      if (this.bossPattern === "largeBullets") {
        
        this.fireTimer -= dt * bossActionRate;
        if (this.fireTimer <= 0) {
          this.fireTimer = 1.2; 
          const aim = Math.atan2(player.y - this.y, player.x - this.x);
          this.shootAngle = aim; 
          
          pushEnemyBullet(bulletsOut, this, new Bullet(this.x, this.y, aim, 140, false, 14, "#ff4444", 25, "boss"));
          for (let i = 0; i < 2; i++) {
            const offset = (i - 0.5) * 0.15;
            const bullet = new Bullet(this.x, this.y, aim + offset, 140, false, 14, "#ff4444", 25, "boss");
            pushEnemyBullet(bulletsOut, this, bullet);
          }
        }
      } else if (this.bossPattern === "chargedShot") {
        
        this.chargeTimer += dt * bossActionRate;
        if (this.chargeTimer >= 2.5) {
          
          const aim = Math.atan2(player.y - this.y, player.x - this.x);
          this.shootAngle = aim; 
          const bullet = new Bullet(this.x, this.y, aim, 100, false, 20, "#ff0000", 35, "boss");
          pushEnemyBullet(bulletsOut, this, bullet);
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
          pushEnemyBullet(bulletsOut, this, directBullet);
          const offsetBullet = new Bullet(this.x, this.y, aim + 0.2, 120, false, 12, "#ff8800", 20, "boss");
          offsetBullet.explosive = true;
          pushEnemyBullet(bulletsOut, this, offsetBullet);
        }
      }
    } else if (this.bossType === "sniper") {
      
      if (this.bossPattern === "precise") {
        
        this.fireTimer -= dt * bossActionRate;
        if (this.fireTimer <= 0) {
          this.fireTimer = 0.08; 
          const aim = Math.atan2(player.y - this.y, player.x - this.x);
          this.shootAngle = aim; 
          
          pushEnemyBullet(bulletsOut, this, new Bullet(this.x, this.y, aim, 320, false, 6, "#00ffff", 5, "boss"));
          
          for (let i = 0; i < 7; i++) {
            const offset = (i < 3.5 ? (i - 3.5) * 0.25 : (i - 2.5) * 0.25);
            pushEnemyBullet(
              bulletsOut,
              this,
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
            
            pushEnemyBullet(bulletsOut, this, new Bullet(this.x, this.y, aim, 320, false, 6, "#00ffff", 5, "boss"));
            
            for (let i = 0; i < 5; i++) {
              const offset = (i < 2.5 ? (i - 2.5) * 0.2 : (i - 1.5) * 0.2);
              pushEnemyBullet(
                bulletsOut,
                this,
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
          pushEnemyBullet(bulletsOut, this, directPiercing);
          
          for (let i = 0; i < 9; i++) {
            const offset = (i < 4.5 ? (i - 4.5) * 0.2 : (i - 3.5) * 0.2);
            const bullet = new Bullet(this.x, this.y, aim + offset, 300, false, 7, "#00ffff", 5, "boss");
            bullet.piercing = true;
            bullet.life = 8; 
            pushEnemyBullet(bulletsOut, this, bullet);
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
          pushEnemyBullet(
            bulletsOut,
            this,
            new Bullet(this.x, this.y, aim, 200, false, 4, "#ff7dd1", 3, "boss")
          );
        }
      } else if (this.bossPattern === "supportFire") {
        
        this.fireTimer -= dt * bossActionRate;
        if (this.fireTimer <= 0) {
          this.fireTimer = 0.4;
          const aim = Math.atan2(player.y - this.y, player.x - this.x);
          this.shootAngle = aim; 
          
          pushEnemyBullet(bulletsOut, this, new Bullet(this.x, this.y, aim, 180, false, 4, "#ff7dd1", 3, "boss"));
          pushEnemyBullet(bulletsOut, this, new Bullet(this.x, this.y, aim - 0.12, 180, false, 4, "#ff7dd1", 3, "boss"));
          pushEnemyBullet(bulletsOut, this, new Bullet(this.x, this.y, aim + 0.12, 180, false, 4, "#ff7dd1", 3, "boss"));
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
              pushEnemyBullet(bulletsOut, this, new Bullet(this.x, this.y, aim, 250, false, 3, "#9b7fff", 2, "boss"));
            } else {
              const spread = (Math.random() - 0.5) * 0.4; 
              pushEnemyBullet(bulletsOut, this, new Bullet(this.x, this.y, aim + spread, 250, false, 3, "#9b7fff", 2, "boss"));
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
            pushEnemyBullet(bulletsOut, this, bullet);
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
            
            pushEnemyBullet(bulletsOut, this, new Bullet(this.x, this.y, aim, 280, false, 4, "#9b7fff", 3, "boss"));
            pushEnemyBullet(bulletsOut, this, new Bullet(this.x, this.y, aim - 0.08, 280, false, 4, "#9b7fff", 3, "boss"));
            pushEnemyBullet(bulletsOut, this, new Bullet(this.x, this.y, aim + 0.08, 280, false, 4, "#9b7fff", 3, "boss"));
          } else {
            this.rapidFireCount = 0;
            this.fireTimer = 0.6; 
          }
        }
      }
    } else if (this.bossType === "bosslaser") {
      const BHL = typeof window !== "undefined" ? window.BossHazardLaser : null;
      if (this.bossPattern === "mainLaser") {
        this.bossLaserCharge += dt * bossActionRate;
        const chargeTime = 1;
        if (!this.bossLaserFired && this.bossLaserCharge >= chargeTime) {
          this.bossLaserFired = true;
          const aim = Math.atan2(player.y - this.y, player.x - this.x);
          this.shootAngle = aim;
          if (BHL && typeof state !== "undefined" && state.bossHazardLasers) {
            state.bossHazardLasers.push(
              new BHL({
                x: this.x,
                y: this.y,
                angle: aim,
                length: Math.max(config.width, config.height) * 1.2,
                width: 34,
                windup: 0,
                armDuration: 1.4,
                damagePerSecond: 128,
              })
            );
          }
        }
      } else if (this.bossPattern === "hazardField") {
        this.bossLaserHazardSpawnTimer -= dt * bossActionRate;
        if (this.bossLaserHazardSpawnTimer <= 0 && this.bossLaserHazardSpawnsLeft > 0) {
          this.bossLaserHazardSpawnTimer = 0.36 + Math.random() * 0.4;
          this.bossLaserHazardSpawnsLeft--;
          const cx = rng(130, config.width - 130);
          const cy = rng(TOP_HUD_SAFE_Y + 100, config.height - 180);
          const ang = rng(0, Math.PI * 2);
          if (BHL && typeof state !== "undefined" && state.bossHazardLasers) {
            state.bossHazardLasers.push(
              new BHL({
                x: cx,
                y: cy,
                angle: ang,
                length: rng(380, 700),
                width: 24,
                windup: 2,
                armDuration: 1.55,
                damagePerSecond: 96,
              })
            );
          }
        }
      }
    } else if (this.bossType === "sprayer") {
      const targetAim = Math.atan2(player.y - this.y, player.x - this.x);
      const currentAim = this.sprayerAim != null ? this.sprayerAim : targetAim;
      this.sprayerAim = currentAim + (targetAim - currentAim) * Math.min(1, dt * 9);
      this.shootAngle = this.sprayerAim;
      if (this.bossPattern === "orbRings") {
        this.fireTimer -= dt * bossActionRate;
        if (this.fireTimer <= 0) {
          this.fireTimer = 0.22;
          this.rapidFireCount++;
          const ring = this.rapidFireCount;
          const ringCount = 5;
          const rays = 14;
          const base = this.sprayerAim + (ring - 1) * 0.14;
          for (let i = 0; i < rays; i++) {
            const a = base + (i / rays) * Math.PI * 2;
            pushEnemyBullet(
              bulletsOut,
              this,
              new Bullet(this.x, this.y, a, 165, false, 16, "#ff85d8", 13, "boss")
            );
          }
          if (ring >= ringCount) {
            this.rapidFireCount = 0;
            this.fireTimer = 0.55;
          }
        }
      } else if (this.bossPattern === "parallelVolley") {
        if (this.sprayerVolleyFired <= 0) {
          this.sprayerAimLocked = this.sprayerAim;
        }
        this.sprayerChargeTimer += dt * bossActionRate;
        if (this.sprayerChargeTimer < 1) return;
        this.fireTimer -= dt * bossActionRate;
        if (this.fireTimer <= 0 && this.sprayerVolleyFired < 8) {
          this.fireTimer = 0.09;
          this.sprayerVolleyFired++;
          const aim = this.sprayerAimLocked;
          const side = aim + Math.PI / 2;
          const lateral = 24;
          const ox = Math.cos(side) * lateral;
          const oy = Math.sin(side) * lateral;
          pushEnemyBullet(
            bulletsOut,
            this,
            new Bullet(this.x + ox, this.y + oy, aim, 290, false, 7.5, "#ffd2ff", 8, "boss")
          );
          pushEnemyBullet(
            bulletsOut,
            this,
            new Bullet(this.x - ox, this.y - oy, aim, 290, false, 7.5, "#ffd2ff", 8, "boss")
          );
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
          
          pushEnemyBullet(bulletsOut, this, new Bullet(this.x, this.y, aim, 210, false, 6, "#ff7dd1", 5, "boss"));
          
          for (let i = 0; i < spread - 1; i++) {
            const offset = (i < 2 ? (i - 2) * 0.15 : (i - 1) * 0.15);
            pushEnemyBullet(
              bulletsOut,
              this,
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
          pushEnemyBullet(
            bulletsOut,
            this,
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
          
          pushEnemyBullet(bulletsOut, this, new Bullet(this.x, this.y, aim, 200, false, 5, "#ff5f9e", 5, "boss"));
          
          for (let i = 0; i < rays - 1; i++) {
            const ang = base + (i / (rays - 1)) * Math.PI * 2;
            pushEnemyBullet(
              bulletsOut,
              this,
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
    
    if (this.kind === "boss" && this.bossType === "bosslaser") {
      const img = typeof window !== "undefined" ? window.__orbitalBossLaserSprite : null;
      const charging = this.bossPattern === "mainLaser" && !this.bossLaserFired && (this.bossLaserCharge || 0) > 0;
      const pulseCharge = charging ? Math.min(1, (this.bossLaserCharge || 0) / 1) : 0;
      const spd = Math.hypot(this.smoothVx, this.smoothVy);
      const face =
        typeof this.shootAngle === "number" && !Number.isNaN(this.shootAngle)
          ? this.shootAngle
          : spd > 0.1
            ? Math.atan2(this.smoothVy, this.smoothVx)
            : -Math.PI / 2;
      const bob = Math.sin(performance.now() / 520) * 0.05;
      ctx.rotate(face + Math.PI / 2);
      ctx.globalAlpha = 0.9 + pulseCharge * 0.1;
      ctx.shadowBlur = 16 + pulseCharge * 34;
      ctx.shadowColor = `rgba(255, 70, 140, ${0.45 + pulseCharge * 0.45})`;
      ctx.scale(1 + bob * 0.03, 1 + bob * 0.03);
      if (img && img.complete && img.naturalWidth > 0) {
        const w = this.size * 2.1;
        const aspect = img.naturalHeight / img.naturalWidth;
        const h = w * aspect;
        ctx.drawImage(img, -w / 2, -h / 2, w, h);
      } else {
        ctx.fillStyle = "#ff4d88";
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
      if (pulseCharge > 0) {
        const r = this.size * (1.05 + pulseCharge * 1.1);
        const g = ctx.createRadialGradient(0, 0, 0, 0, 0, r);
        g.addColorStop(0, `rgba(255,255,255,${0.12 + pulseCharge * 0.38})`);
        g.addColorStop(0.45, `rgba(255, 100, 170, ${0.22 + pulseCharge * 0.32})`);
        g.addColorStop(1, "transparent");
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(0, 0, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      return;
    }

    if (this.kind === "boss" && this.bossType === "sprayer") {
      const img = typeof window !== "undefined" ? window.__orbitalBossSprayerSprite : null;
      const face = this.sprayerAim != null ? this.sprayerAim : -Math.PI / 2;
      const charging = this.bossPattern === "parallelVolley" && (this.sprayerChargeTimer || 0) < 1;
      const chargeAlpha = charging ? Math.min(1, (this.sprayerChargeTimer || 0) / 1) : 0;
      ctx.rotate(face + Math.PI / 2);
      ctx.shadowBlur = 18 + chargeAlpha * 22;
      ctx.shadowColor = `rgba(255, 130, 220, ${0.45 + chargeAlpha * 0.4})`;
      if (img && img.complete && img.naturalWidth > 0) {
        const w = this.size * 2.4;
        const h = (img.naturalHeight / img.naturalWidth) * w;
        ctx.drawImage(img, -w / 2, -h / 2, w, h);
      } else {
        ctx.fillStyle = "#d86bff";
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
      if (charging) {
        const rr = this.size * (1.1 + chargeAlpha * 0.8);
        const gg = ctx.createRadialGradient(0, 0, 0, 0, 0, rr);
        gg.addColorStop(0, `rgba(255,255,255,${0.15 + 0.32 * chargeAlpha})`);
        gg.addColorStop(0.52, `rgba(255,120,220,${0.2 + 0.3 * chargeAlpha})`);
        gg.addColorStop(1, "transparent");
        ctx.fillStyle = gg;
        ctx.beginPath();
        ctx.arc(0, 0, rr, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
      return;
    }
    
    if (this.kind === "charger") {
      const spd = Math.hypot(this.smoothVx, this.smoothVy);
      const face =
        spd > 0.1
          ? Math.atan2(this.smoothVy, this.smoothVx)
          : Math.hypot(this.vx || 0, this.vy || 0) > 0.1
            ? Math.atan2(this.vy || 0, this.vx || 0)
            : -Math.PI / 2;
      const s = this.size;
      const pulse = 0.92 + Math.sin(performance.now() / 180) * 0.08;
      ctx.rotate(face + Math.PI / 2);
      ctx.globalAlpha = 0.98;
      ctx.shadowBlur = 14;
      ctx.shadowColor = "rgba(80, 255, 185, 0.45)";

      // Glow shell
      const glow = ctx.createRadialGradient(0, 0, 0, 0, 0, s * 1.95);
      glow.addColorStop(0, "rgba(120,255,200,0.45)");
      glow.addColorStop(0.45, "rgba(90,220,180,0.18)");
      glow.addColorStop(1, "rgba(80,180,140,0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(0, 0, s * 1.9 * pulse, 0, Math.PI * 2);
      ctx.fill();

      // Main pointed hull
      const hullGrad = ctx.createLinearGradient(0, -s * 1.2, 0, s * 1.25);
      hullGrad.addColorStop(0, "#d9fff0");
      hullGrad.addColorStop(0.42, "#7dffbe");
      hullGrad.addColorStop(1, "#2ca06f");
      ctx.fillStyle = hullGrad;
      ctx.strokeStyle = "#bfffe4";
      ctx.lineWidth = Math.max(1.2, s * 0.08);
      ctx.beginPath();
      ctx.moveTo(0, -s * 1.26);
      ctx.lineTo(s * 0.34, -s * 0.64);
      ctx.lineTo(s * 0.48, -s * 0.12);
      ctx.lineTo(s * 0.44, s * 0.34);
      ctx.lineTo(s * 0.2, s * 0.95);
      ctx.lineTo(-s * 0.2, s * 0.95);
      ctx.lineTo(-s * 0.44, s * 0.34);
      ctx.lineTo(-s * 0.48, -s * 0.12);
      ctx.lineTo(-s * 0.34, -s * 0.64);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Side fins
      ctx.fillStyle = "#57dca0";
      ctx.beginPath();
      ctx.moveTo(s * 0.34, -s * 0.2);
      ctx.lineTo(s * 1.06, s * 0.02);
      ctx.lineTo(s * 0.56, s * 0.3);
      ctx.closePath();
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(-s * 0.34, -s * 0.2);
      ctx.lineTo(-s * 1.06, s * 0.02);
      ctx.lineTo(-s * 0.56, s * 0.3);
      ctx.closePath();
      ctx.fill();

      // Cockpit + detail lines
      const eyeGlow = 0.7 + Math.sin(performance.now() / 140) * 0.3;
      ctx.fillStyle = `rgba(230,255,245,${0.55 + eyeGlow * 0.35})`;
      ctx.beginPath();
      ctx.ellipse(0, -s * 0.32, s * 0.16, s * 0.22, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = "rgba(25,70,50,0.55)";
      ctx.lineWidth = Math.max(0.9, s * 0.05);
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.96);
      ctx.lineTo(0, s * 0.68);
      ctx.moveTo(-s * 0.26, s * 0.24);
      ctx.lineTo(s * 0.26, s * 0.24);
      ctx.stroke();

      // Rear thrusters
      ctx.fillStyle = "rgba(145,255,212,0.85)";
      ctx.beginPath();
      ctx.moveTo(-s * 0.19, s * 0.95);
      ctx.lineTo(-s * 0.05, s * (1.15 + pulse * 0.08));
      ctx.lineTo(s * 0.05, s * (1.15 + pulse * 0.08));
      ctx.lineTo(s * 0.19, s * 0.95);
      ctx.closePath();
      ctx.fill();

      ctx.restore();
      return;
    }
    
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
      } else if (this.bossType === "bosslaser") {
        colors = { core: "#ff5a9a", glow: "rgba(255, 90, 154, 0.85)", inner: "#ff2e7a", accent: "#ffc4dc" };
      } else if (this.bossType === "sprayer") {
        colors = { core: "#d86bff", glow: "rgba(216, 107, 255, 0.85)", inner: "#b545e2", accent: "#ffd3ff" };
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
    this.energy = loadout.maxEnergy;
    this.maxEnergy = loadout.maxEnergy;
    this.cooldown = 0;
    this.baseCooldown = loadout.baseCooldown;
    this.rapidTimer = 0;
    this.burstTimer = 0;
    const tierScale = getTierPowerScale(loadout.tier);
    this.damageMultiplier = loadout.damageMultiplier * tierScale.basic;
    this.shotSpeedMultiplier = loadout.shotSpeedMultiplier;
    this.energyRegenMultiplier = loadout.energyRegenMultiplier;
    this.shieldRegenMultiplier = loadout.shieldRegenMultiplier;
    this.extraProjectiles = 0;
    this.novaDamageMultiplier = 1;
    this.abilityDamageMultiplier = tierScale.ability;
    this.abilities = loadout.abilities || [];
    this.shipId = loadout.id;
    this.visualScale = typeof getShipVisualScale === "function" ? getShipVisualScale(loadout.id) : 1;
    this.eclipseShotToggle = 0;
    this.foresightTimer = 0;
    this.titanFuryTimer = 0;
    this.invincible = false;
    this.invincibleTimer = 0;
    this.shieldColorOverride = null;
    this.shieldColorTimer = 0;
    this.infiniteShield = false;
    this.infiniteShieldTimer = 0;
    this.rapidVolleyActive = false;
    this.rapidVolleyTimer = 0;
    this.wickSprayTimer = 0;
    this.wickSprayAcc = 0;
    this.wickSprayShotsRemaining = 0;
    this.dartTwinPierceTimer = 0;
    this.dartFlockWavesLeft = 0;
    this.dartFlockWaveAcc = 0;
    this.fortifyActive = false;
    this.fortifyTimer = 0;
    this.seraphSweepTimer = 0;
    this.seraphSweepPhase = 0;
    this.infernoPyroTimer = 0;
    this.aimAngle = -Math.PI / 2;
    this.boltChannelLock = 0;
    this.voidwalkerVanishTimer = 0;
  }
  weaponBuffVisualActive() {
    return (
      this.rapidTimer > 0 ||
      this.burstTimer > 0 ||
      this.rapidVolleyActive ||
      (this.titanFuryTimer || 0) > 0 ||
      (this.dartTwinPierceTimer || 0) > 0 ||
      (this.wickSprayTimer || 0) > 0 ||
      (this.infernoPyroTimer || 0) > 0 ||
      this.fortifyActive
    );
  }
  getShieldRadius() {
    const rel = typeof scaleByViewport === "function" ? scaleByViewport : (v) => v;
    const shieldPercent = this.shield / this.maxShield;
    const baseRadius = rel(20) * this.visualScale;
    const maxShieldBonus = rel((this.maxShield / 100) * 8);
    return baseRadius + (shieldPercent * (12 + maxShieldBonus));
  }
  getHullHitRadius() {
    const rel = typeof scaleByViewport === "function" ? scaleByViewport : (v) => v;
    return rel(16) * this.visualScale;
  }
  getBodyRadius() {
    const rel = typeof scaleByViewport === "function" ? scaleByViewport : (v) => v;
    return rel(20) * this.visualScale;
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
    
    const canMove = !state.tutorialMode || state.tutorialStep >= 0 || state.tutorialTestWave;
    const boltLocked = (this.boltChannelLock || 0) > 0;
    if (canMove && !boltLocked) {
      const moveKeys = state.movementKeys || { up: "w", left: "a", down: "s", right: "d" };
      if (input.keys.has(moveKeys.up) || input.keys.has("arrowup")) this.vy -= accel * dt;
      if (input.keys.has(moveKeys.down) || input.keys.has("arrowdown")) this.vy += accel * dt;
      if (input.keys.has(moveKeys.left) || input.keys.has("arrowleft")) this.vx -= accel * dt;
      if (input.keys.has(moveKeys.right) || input.keys.has("arrowright")) this.vx += accel * dt;
    }
    if (boltLocked) {
      this.vx = 0;
      this.vy = 0;
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
    let maxSpeed = this.speed * speedBoost * shipSpeedMultiplier;
    if (this.shipId === "wick" && (this.wickSprayTimer || 0) > 0) {
      maxSpeed *= 0.5;
    }
    this.vx = clamp(this.vx, -maxSpeed, maxSpeed);
    this.vy = clamp(this.vy, -maxSpeed, maxSpeed);

    this.x = clamp(this.x + this.vx * dt, 20, config.width - 20);
    this.y = clamp(this.y + this.vy * dt, playerMinY(), config.height - 20);

    this.cooldown = Math.max(this.cooldown - dt, 0);
    const prevShield = this.shield;
    this.shield = clamp(
      this.shield + dt * 0.5 * this.shieldRegenMultiplier,
      0,
      this.maxShield
    );
    recordShieldRegen(this.shield - prevShield);
    
    const energyRegenMultiplier = this.fortifyActive 
      ? this.energyRegenMultiplier * 3 
      : this.energyRegenMultiplier;
    const prevEnergy = this.energy;
    this.energy = clamp(
      this.energy + dt * 28 * energyRegenMultiplier,
      0,
      this.maxEnergy
    );
    recordEnergyRegen(this.energy - prevEnergy);
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
    this.boltChannelLock = Math.max((this.boltChannelLock || 0) - dt, 0);
    if (this.boltChannelLock <= 0) state.boltCage = null;
    this.seraphSweepTimer = Math.max(this.seraphSweepTimer - dt, 0);
    this.infernoPyroTimer = Math.max(this.infernoPyroTimer - dt, 0);
    this.foresightTimer = Math.max(this.foresightTimer - dt, 0);
    this.voidwalkerVanishTimer = Math.max((this.voidwalkerVanishTimer || 0) - dt, 0);
    this.titanFuryTimer = Math.max(this.titanFuryTimer - dt, 0);
    this.dartTwinPierceTimer = Math.max((this.dartTwinPierceTimer || 0) - dt, 0);
    this.seraphSweepPhase += dt;
    if (this.shipId === "dart" && (this.dartFlockWavesLeft || 0) > 0) {
      this.dartFlockWaveAcc = (this.dartFlockWaveAcc || 0) + dt;
      const gap = 0.38;
      const sm = this.shotSpeedMultiplier;
      const dm = this.damageMultiplier * this.abilityDamageMultiplier;
      while (this.dartFlockWaveAcc >= gap && (this.dartFlockWavesLeft || 0) > 0) {
        this.dartFlockWaveAcc -= gap;
        this.dartFlockWavesLeft--;
        const baseAng = Math.atan2(input.mouse.y - this.y, input.mouse.x - this.x);
        for (let i = 0; i < 6; i++) {
          const a = baseAng + (i - 2.5) * 0.085;
          const wb = new Bullet(this.x, this.y, a, 455 * sm, true, 2.25, "#f5f8ff", 5.1 * dm);
          wb.noTrail = true;
          wb.visualShape = "needle";
          wb.life = 1.05;
          state.bullets.push(wb);
        }
      }
      if ((this.dartFlockWavesLeft || 0) <= 0) this.dartFlockWaveAcc = 0;
    }
    if (this.shipId === "wick") {
      if ((this.wickSprayTimer || 0) > 0) {
        this.wickSprayTimer -= dt;
        this.wickSprayAcc = (this.wickSprayAcc || 0) + dt * (50 / 3);
        while (this.wickSprayAcc >= 1 && (this.wickSprayShotsRemaining || 0) > 0) {
          this.wickSprayAcc -= 1;
          this.wickSprayShotsRemaining--;
          const a = rng(0, Math.PI * 2);
          const sm = this.shotSpeedMultiplier;
          const dm = this.damageMultiplier * this.abilityDamageMultiplier;
          const bb = new Bullet(
            this.x,
            this.y,
            a,
            rng(240, 420) * sm,
            true,
            4.35,
            Math.random() < 0.5 ? "#ffdd77" : "#ff9800",
            5.35 * dm
          );
          bb.noTrail = true;
          bb.visualShape = "heavyOrb";
          bb.life = 0.95;
          state.bullets.push(bb);
        }
      }
      if ((this.wickSprayTimer || 0) <= 0 && (this.wickSprayShotsRemaining || 0) > 0) {
        while ((this.wickSprayShotsRemaining || 0) > 0) {
          this.wickSprayShotsRemaining--;
          const a = rng(0, Math.PI * 2);
          const sm = this.shotSpeedMultiplier;
          const dm = this.damageMultiplier * this.abilityDamageMultiplier;
          const bb = new Bullet(
            this.x,
            this.y,
            a,
            rng(240, 420) * sm,
            true,
            4.35,
            Math.random() < 0.5 ? "#ffdd77" : "#ff9800",
            5.35 * dm
          );
          bb.noTrail = true;
          bb.visualShape = "heavyOrb";
          bb.life = 0.95;
          state.bullets.push(bb);
        }
        this.wickSprayAcc = 0;
      }
    }
    if (this.shipId === "seraph") {
      this.aimAngle = Math.atan2(input.mouse.y - this.y, input.mouse.x - this.x);
      const ca = Math.cos(this.aimAngle);
      const sa = Math.sin(this.aimAngle);
      const beamFwd = 40;
      const beamLen = config.width * 1.2;
      const mx = this.x + ca * beamFwd;
      const my = this.y + sa * beamFwd;
      const beamEndX = this.x + ca * beamLen;
      const beamEndY = this.y + sa * beamLen;
      const beamWidth = 16;
      const shotInterval = Math.max(this.baseCooldown * 0.2, 0.04);
      const primaryDps = (24 * this.damageMultiplier) / shotInterval;
      const sweepPhaseRate = 2.85;
      const sweepDps = primaryDps * 4.75;
      const railPerp = 40;
      const applyBeamToEnemies = (x0, y0, x1, y1, width, dps, bumpFire) => {
        for (let i = state.enemies.length - 1; i >= 0; i--) {
          const enemy = state.enemies[i];
          const d = pointToSegmentDistance(enemy.x, enemy.y, x0, y0, x1, y1);
          if (d > width + enemy.size * 0.48) continue;
          const dmg = dps * dt;
          enemy.hp -= dmg;
          recordDamageDealt(dmg);
          if (bumpFire) enemy.fireTimer += 0.06;
          if (enemy.hp <= 0) onEnemyDestroyed(enemy, i);
        }
      };
      applyBeamToEnemies(mx, my, beamEndX, beamEndY, beamWidth, primaryDps, true);
      if (this.seraphSweepTimer > 0) {
        const perp = this.aimAngle + Math.PI / 2;
        const cp = Math.cos(perp);
        const sp = Math.sin(perp);
        const swing = Math.sin(this.seraphSweepPhase * sweepPhaseRate) * 0.7;
        for (const side of [-1, 1]) {
          const sideAngle = this.aimAngle + side * swing;
          const sx = this.x + cp * side * railPerp + ca * beamFwd;
          const sy = this.y + sp * side * railPerp + sa * beamFwd;
          const ex = sx + Math.cos(sideAngle) * beamLen;
          const ey = sy + Math.sin(sideAngle) * beamLen;
          applyBeamToEnemies(sx, sy, ex, ey, beamWidth, sweepDps, true);
        }
      }
    }
  }
  shoot(bullets) {
    const start = bullets.length;
    playerBasicAttackShoot.call(this, bullets);
    if (typeof enhanceBulletsWeaponBuffVisual === "function") {
      enhanceBulletsWeaponBuffVisual(this, bullets, start);
    }
  }
  drawWeaponBuffAccents(ctx) {
    if (!this.weaponBuffVisualActive()) return;
    if (this.shipId === "seraph") return;
    if (this.shipId === "titan" && (this.titanFuryTimer || 0) > 0) return;
    const sid = this.shipId;
    const t = performance.now() / 1000;
    const pulse = 0.22 + 0.12 * Math.sin(t * 5);
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    const wingPair = (hueA, hueB, scale) => {
      for (const sy of [-1, 1]) {
        const g = ctx.createLinearGradient(-20, sy * 8, 16, sy * 22);
        g.addColorStop(0, hueA);
        g.addColorStop(1, hueB);
        ctx.fillStyle = g;
        ctx.shadowBlur = 14 * scale;
        ctx.shadowColor = hueA;
        ctx.beginPath();
        ctx.moveTo(6, sy * 4);
        ctx.lineTo(-22, sy * 26);
        ctx.lineTo(8, sy * 18);
        ctx.closePath();
        ctx.fill();
      }
    };
    if (["striker", "vanguard", "lancer", "dart", "halberd", "gallant"].includes(sid)) {
      wingPair(`rgba(255, 220, 100, ${pulse})`, `rgba(255, 140, 60, ${pulse * 0.6})`, 1);
      ctx.fillStyle = `rgba(255, 235, 160, ${pulse * 0.9})`;
      ctx.shadowBlur = 10;
      ctx.shadowColor = "#ffcc44";
      for (const sy of [-1, 1]) {
        ctx.fillRect(14, sy * 11 - 2, 26, 4);
        ctx.fillRect(36, sy * 13 - 1.5, 10, 3);
      }
    } else if (["aegis", "bulwark", "warden", "myrmidon"].includes(sid)) {
      ctx.strokeStyle = `rgba(130, 210, 255, ${0.45 + 0.2 * Math.sin(t * 4)})`;
      ctx.lineWidth = 2.2;
      ctx.shadowBlur = 12;
      ctx.shadowColor = "#88ccff";
      for (const sy of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(-4, sy * 16);
        ctx.lineTo(-26, sy * 28);
        ctx.lineTo(-10, sy * 22);
        ctx.stroke();
      }
    } else if (["phantom", "specter", "voidwalker", "eclipse", "grimstar", "raven"].includes(sid)) {
      ctx.strokeStyle = `rgba(220, 160, 255, ${0.5 + 0.15 * Math.sin(t * 6)})`;
      ctx.lineWidth = 1.8;
      ctx.shadowBlur = 16;
      ctx.shadowColor = "#c86bff";
      for (const sy of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(4, sy * 6);
        ctx.quadraticCurveTo(-20, sy * 18, -2, sy * 26);
        ctx.stroke();
      }
    } else if (["tempest", "bolt", "helios", "aurora"].includes(sid)) {
      for (let k = 0; k < 4; k++) {
        const sy = k % 2 === 0 ? 1 : -1;
        const off = (k - 1.5) * 7;
        ctx.strokeStyle = k % 2 ? "rgba(255, 255, 120, 0.55)" : "rgba(120, 220, 255, 0.55)";
        ctx.lineWidth = 2;
        ctx.shadowBlur = 10;
        ctx.shadowColor = k % 2 ? "#ffff88" : "#66ccff";
        ctx.beginPath();
        ctx.moveTo(4 + off, sy * 6);
        ctx.lineTo(-6 + off, sy * 20);
        ctx.stroke();
      }
    } else if (["ember", "inferno", "wick"].includes(sid)) {
      wingPair(`rgba(255, 120, 60, ${pulse})`, `rgba(255, 60, 40, ${pulse * 0.55})`, 1.1);
    } else if (["knave", "marauder", "reaper"].includes(sid)) {
      ctx.strokeStyle = `rgba(255, 100, 140, ${0.45 + 0.15 * Math.sin(t * 7)})`;
      ctx.lineWidth = 2;
      for (const sy of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(10, sy * 2);
        ctx.lineTo(-8, sy * 20);
        ctx.lineTo(4, sy * 14);
        ctx.closePath();
        ctx.stroke();
      }
    } else if (["claw", "stinger", "pebble"].includes(sid)) {
      wingPair(`rgba(120, 255, 170, ${pulse})`, `rgba(80, 200, 255, ${pulse * 0.5})`, 0.9);
    } else {
      wingPair(`rgba(255, 210, 120, ${pulse})`, `rgba(255, 160, 80, ${pulse * 0.55})`, 1);
    }
    ctx.shadowBlur = 0;
    ctx.globalCompositeOperation = "source-over";
    ctx.restore();
  }
  draw(ctx) {
    ctx.save();
    if ((this.voidwalkerVanishTimer || 0) > 0) {
      ctx.restore();
      return;
    }
    ctx.translate(this.x, this.y);
    const angle = Math.atan2(input.mouse.y - this.y, input.mouse.x - this.x);
    ctx.rotate(angle);
    const titanFury = this.shipId === "titan" && (this.titanFuryTimer || 0) > 0;
    const sx = this.visualScale * (titanFury ? 1.34 : 1);
    const sy = this.visualScale * (titanFury ? 1.3 : 1);
    if (this.shipId === "seraph") {
      const beamDrawStart = 36;
      const len = config.width * 0.92;
      const drawLen = Math.max(len - beamDrawStart, 120);
      const bw = 18;
      ctx.save();
      ctx.globalAlpha = 1;
      const g = ctx.createLinearGradient(beamDrawStart, 0, len, 0);
      g.addColorStop(0, "rgba(255, 200, 200, 1)");
      g.addColorStop(0.2, "rgba(255, 70, 70, 1)");
      g.addColorStop(0.45, "rgba(255, 30, 30, 1)");
      g.addColorStop(0.62, "rgba(255, 220, 220, 1)");
      g.addColorStop(0.78, "rgba(255, 45, 45, 1)");
      g.addColorStop(1, "rgba(255, 80, 80, 1)");
      ctx.fillStyle = g;
      ctx.shadowBlur = 22;
      ctx.shadowColor = "#ff2222";
      ctx.fillRect(beamDrawStart, -bw / 2, drawLen, bw);
      ctx.strokeStyle = "rgba(255, 255, 255, 0.95)";
      ctx.lineWidth = 2;
      ctx.strokeRect(beamDrawStart, -bw / 2, drawLen, bw);
      if (this.seraphSweepTimer > 0) {
        const sweepPhaseRate = 2.85;
        const swing = Math.sin(this.seraphSweepPhase * sweepPhaseRate) * 0.7;
        const sweepLen = len * 0.95;
        const railDraw = 38;
        ctx.lineCap = "round";
        for (const side of [-1, 1]) {
          const ox = beamDrawStart;
          const oy = side * railDraw;
          const dx = Math.cos(side * swing);
          const dy = Math.sin(side * swing);
          const sx2 = ox + dx * sweepLen;
          const sy2 = oy + dy * sweepLen;
          ctx.strokeStyle = "rgba(255, 50, 50, 1)";
          ctx.lineWidth = 10;
          ctx.shadowBlur = 20;
          ctx.shadowColor = "#ff0000";
          ctx.beginPath();
          ctx.moveTo(ox, oy);
          ctx.lineTo(sx2, sy2);
          ctx.stroke();
          ctx.strokeStyle = "rgba(255, 255, 255, 0.98)";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(ox, oy);
          ctx.lineTo(sx2, sy2);
          ctx.stroke();
        }
      }
      ctx.shadowBlur = 0;
      ctx.restore();
      ctx.scale(this.visualScale, this.visualScale);
    } else {
      ctx.scale(sx, sy);
    }

    let coreColor, glowColor, accentColor;
    const powerUpActive = this.rapidTimer > 0 || this.burstTimer > 0 || (this.shipId === "titan" && (this.titanFuryTimer || 0) > 0);
    
    if (this.shipId === "titan" && (this.titanFuryTimer || 0) > 0) {
      coreColor = "#ff6622";
      glowColor = "rgba(255, 110, 55, 0.82)";
      accentColor = "#ff9438";
    } else if (this.rapidTimer > 0) {
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
      } else if (this.shipId === "seraph") {
        coreColor = "#ff5a5a";
        glowColor = "rgba(255, 90, 90, 0.78)";
        accentColor = "#ff2020";
      } else if (this.shipId === "aurora") {
        coreColor = "#97f8ff";
        glowColor = "rgba(151, 248, 255, 0.76)";
        accentColor = "#6ac8ff";
      } else if (this.shipId === "vanguard") {
        coreColor = "#6ec8ff";
        glowColor = "rgba(110, 200, 255, 0.72)";
        accentColor = "#2e9fff";
      } else if (this.shipId === "reaper") {
        coreColor = "#b56cff";
        glowColor = "rgba(181, 108, 255, 0.75)";
        accentColor = "#8a3dff";
      } else if (this.shipId === "nova") {
        coreColor = "#ffcf4a";
        glowColor = "rgba(255, 207, 74, 0.78)";
        accentColor = "#ff9420";
      } else if (this.shipId === "voidwalker") {
        coreColor = "#9b7dff";
        glowColor = "rgba(155, 125, 255, 0.76)";
        accentColor = "#5c2fff";
      } else if (this.shipId === "bulwark") {
        coreColor = "#8ab8ff";
        glowColor = "rgba(138, 184, 255, 0.72)";
        accentColor = "#4d88ff";
      } else if (this.shipId === "striker") {
        coreColor = "#74ffce";
        glowColor = "rgba(116, 255, 206, 0.7)";
        accentColor = "#4dffb3";
      } else if (this.shipId === "dart") {
        coreColor = "#e8f0ff";
        glowColor = "rgba(200, 220, 255, 0.72)";
        accentColor = "#9bb8ff";
      } else if (this.shipId === "pebble") {
        coreColor = "#c8d4dc";
        glowColor = "rgba(190, 205, 215, 0.7)";
        accentColor = "#8a9aaa";
      } else if (this.shipId === "wick") {
        coreColor = "#ff9a3c";
        glowColor = "rgba(255, 154, 60, 0.75)";
        accentColor = "#ff5c18";
      } else if (this.shipId === "bolt") {
        coreColor = "#66a8ff";
        glowColor = "rgba(102, 168, 255, 0.76)";
        accentColor = "#3a78ff";
      } else if (this.shipId === "knave") {
        coreColor = "#c86bff";
        glowColor = "rgba(200, 107, 255, 0.74)";
        accentColor = "#9338e8";
      } else if (this.shipId === "ember") {
        coreColor = "#ff6b35";
        glowColor = "rgba(255, 107, 53, 0.74)";
        accentColor = "#e02810";
      } else if (this.shipId === "claw") {
        coreColor = "#5cff8a";
        glowColor = "rgba(92, 255, 138, 0.72)";
        accentColor = "#18c85a";
      } else if (this.shipId === "stinger") {
        coreColor = "#d4e040";
        glowColor = "rgba(212, 224, 64, 0.74)";
        accentColor = "#9cb818";
      } else if (this.shipId === "halberd") {
        coreColor = "#66ccff";
        glowColor = "rgba(102, 204, 255, 0.72)";
        accentColor = "#2a9fd9";
      } else if (this.shipId === "lancer") {
        coreColor = "#ffd166";
        glowColor = "rgba(255, 209, 102, 0.74)";
        accentColor = "#e8a010";
      } else if (this.shipId === "raven") {
        coreColor = "#b067ff";
        glowColor = "rgba(176, 103, 255, 0.75)";
        accentColor = "#7830d8";
      } else if (this.shipId === "warden") {
        coreColor = "#8ef7b5";
        glowColor = "rgba(142, 247, 181, 0.72)";
        accentColor = "#3ecf7a";
      } else if (this.shipId === "marauder") {
        coreColor = "#ff4466";
        glowColor = "rgba(255, 68, 102, 0.74)";
        accentColor = "#cc1038";
      } else if (this.shipId === "gallant") {
        coreColor = "#a8d4ff";
        glowColor = "rgba(168, 212, 255, 0.72)";
        accentColor = "#5898e8";
      } else if (this.shipId === "helios") {
        coreColor = "#ffcc55";
        glowColor = "rgba(255, 204, 85, 0.78)";
        accentColor = "#ff8820";
      } else if (this.shipId === "eclipse") {
        coreColor = "#d9a6ff";
        glowColor = "rgba(217, 166, 255, 0.74)";
        accentColor = "#8844cc";
      } else if (this.shipId === "oracle") {
        coreColor = "#6fffe9";
        glowColor = "rgba(111, 255, 233, 0.74)";
        accentColor = "#20c4aa";
      } else if (this.shipId === "myrmidon") {
        coreColor = "#9ec5ff";
        glowColor = "rgba(158, 197, 255, 0.72)";
        accentColor = "#5a88dd";
      } else if (this.shipId === "grimstar") {
        coreColor = "#c8a8ff";
        glowColor = "rgba(200, 168, 255, 0.75)";
        accentColor = "#7a48cc";
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
    } else if (this.shipId === "seraph") {
      const railYs = [-46, -17, 17, 46];
      const wingFill = ctx.createLinearGradient(-18, 0, 8, 0);
      wingFill.addColorStop(0, "#2a1218");
      wingFill.addColorStop(0.45, "#4a222c");
      wingFill.addColorStop(1, "#5c2a36");
      ctx.fillStyle = wingFill;
      ctx.strokeStyle = "#8a3038";
      ctx.lineWidth = 1.6;
      ctx.shadowBlur = 0;
      for (const sy of [-1, 1]) {
        const m = sy;
        ctx.beginPath();
        ctx.moveTo(-2, m * 7);
        ctx.lineTo(6, m * 9);
        ctx.lineTo(10, m * 22);
        ctx.lineTo(4, m * 42);
        ctx.lineTo(-8, m * 48);
        ctx.lineTo(-16, m * 44);
        ctx.lineTo(-14, m * 18);
        ctx.lineTo(-8, m * 8);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
      for (const ry of railYs) {
        const bw = Math.abs(ry) >= 40 ? 5.2 : 4.6;
        const len = 13;
        const bg = ctx.createLinearGradient(0, ry - bw / 2, len, ry + bw / 2);
        bg.addColorStop(0, "#2a1014");
        bg.addColorStop(0.55, "#4a1820");
        bg.addColorStop(1, "#1a080c");
        ctx.fillStyle = bg;
        ctx.strokeStyle = "#3d1518";
        ctx.lineWidth = 1.15;
        ctx.fillRect(0, ry - bw / 2, len, bw);
        ctx.strokeRect(0.5, ry - bw / 2 + 0.35, len - 1, bw - 0.7);
        ctx.strokeStyle = "#ff4444";
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(0.6, ry - bw * 0.35);
        ctx.lineTo(len - 0.6, ry - bw * 0.35);
        ctx.stroke();
      }
      ctx.beginPath();
      ctx.moveTo(15, 0);
      ctx.lineTo(10, -3.5);
      ctx.lineTo(2, -5.2);
      ctx.lineTo(-6, -4.5);
      ctx.lineTo(-14, -2);
      ctx.lineTo(-17, 0);
      ctx.lineTo(-14, 2);
      ctx.lineTo(-6, 4.5);
      ctx.lineTo(2, 5.2);
      ctx.lineTo(10, 3.5);
      ctx.closePath();
      ctx.fillStyle = bodyGradient;
      ctx.strokeStyle = coreColor;
      ctx.lineWidth = 2.5;
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
      ctx.shadowBlur = 8;
      ctx.shadowColor = "#ff6666";
      ctx.beginPath();
      ctx.arc(4, 0, 2.6, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    } else if (this.shipId === "vanguard") {
      ctx.fillStyle = bodyGradient;
      ctx.beginPath();
      ctx.moveTo(28, 0);
      ctx.lineTo(22, -7);
      ctx.lineTo(10, -9);
      ctx.lineTo(-2, -8);
      ctx.lineTo(-14, -4);
      ctx.lineTo(-20, 0);
      ctx.lineTo(-14, 4);
      ctx.lineTo(-2, 8);
      ctx.lineTo(10, 9);
      ctx.lineTo(22, 7);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = accentColor;
      ctx.fillRect(16, -5, 8, 10);
    } else if (this.shipId === "reaper") {
      ctx.fillStyle = bodyGradient;
      ctx.beginPath();
      ctx.moveTo(24, 0);
      ctx.lineTo(18, -8);
      ctx.lineTo(6, -9);
      ctx.lineTo(-6, -4);
      ctx.lineTo(-14, 4);
      ctx.lineTo(-18, 12);
      ctx.lineTo(-8, 8);
      ctx.lineTo(4, 2);
      ctx.lineTo(14, 6);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = accentColor;
      ctx.beginPath();
      ctx.moveTo(8, -5);
      ctx.lineTo(-10, -12);
      ctx.lineTo(-4, -2);
      ctx.closePath();
      ctx.fill();
    } else if (this.shipId === "nova") {
      ctx.fillStyle = bodyGradient;
      ctx.beginPath();
      ctx.moveTo(30, 0);
      ctx.lineTo(12, -11);
      ctx.lineTo(10, -3);
      ctx.lineTo(-2, -12);
      ctx.lineTo(-4, -2);
      ctx.lineTo(-16, -6);
      ctx.lineTo(-8, 2);
      ctx.lineTo(-16, 8);
      ctx.lineTo(-2, 6);
      ctx.lineTo(6, 12);
      ctx.lineTo(8, 3);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (this.shipId === "voidwalker") {
      ctx.fillStyle = bodyGradient;
      ctx.beginPath();
      ctx.moveTo(22, 0);
      ctx.lineTo(16, -7);
      ctx.lineTo(6, -8);
      ctx.lineTo(-4, -10);
      ctx.lineTo(-14, -4);
      ctx.lineTo(-20, 0);
      ctx.lineTo(-14, 4);
      ctx.lineTo(-4, 10);
      ctx.lineTo(6, 8);
      ctx.lineTo(16, 7);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = accentColor;
      ctx.beginPath();
      ctx.moveTo(-6, -2);
      ctx.lineTo(8, 0);
      ctx.lineTo(-6, 2);
      ctx.closePath();
      ctx.fill();
    } else if (this.shipId === "bulwark") {
      ctx.fillStyle = bodyGradient;
      ctx.beginPath();
      ctx.moveTo(14, 0);
      ctx.lineTo(8, -14);
      ctx.lineTo(-4, -16);
      ctx.lineTo(-18, -12);
      ctx.lineTo(-22, 0);
      ctx.lineTo(-18, 12);
      ctx.lineTo(-4, 16);
      ctx.lineTo(8, 14);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (this.shipId === "inferno") {
      ctx.fillStyle = bodyGradient;
      ctx.beginPath();
      ctx.moveTo(24, 0);
      ctx.lineTo(18, -9);
      ctx.lineTo(8, -7);
      ctx.lineTo(2, -11);
      ctx.lineTo(-6, -6);
      ctx.lineTo(-14, -8);
      ctx.lineTo(-16, 0);
      ctx.lineTo(-14, 8);
      ctx.lineTo(-6, 6);
      ctx.lineTo(2, 11);
      ctx.lineTo(8, 7);
      ctx.lineTo(18, 9);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (this.shipId === "aurora") {
      ctx.fillStyle = bodyGradient;
      ctx.beginPath();
      ctx.moveTo(26, 0);
      ctx.lineTo(20, -6);
      ctx.lineTo(12, -9);
      ctx.lineTo(4, -5);
      ctx.lineTo(-6, -9);
      ctx.lineTo(-12, -2);
      ctx.lineTo(-18, 0);
      ctx.lineTo(-12, 2);
      ctx.lineTo(-6, 9);
      ctx.lineTo(4, 5);
      ctx.lineTo(12, 9);
      ctx.lineTo(20, 6);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (this.shipId === "dart") {
      ctx.fillStyle = bodyGradient;
      ctx.beginPath();
      ctx.moveTo(30, 0);
      ctx.lineTo(16, -3);
      ctx.lineTo(4, -4);
      ctx.lineTo(-8, -2);
      ctx.lineTo(-14, 0);
      ctx.lineTo(-8, 2);
      ctx.lineTo(4, 4);
      ctx.lineTo(16, 3);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (this.shipId === "pebble") {
      ctx.fillStyle = bodyGradient;
      ctx.beginPath();
      ctx.moveTo(20, 0);
      ctx.lineTo(16, -8);
      ctx.lineTo(6, -12);
      ctx.lineTo(-6, -10);
      ctx.lineTo(-14, -4);
      ctx.lineTo(-16, 0);
      ctx.lineTo(-14, 4);
      ctx.lineTo(-6, 10);
      ctx.lineTo(6, 12);
      ctx.lineTo(16, 8);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (this.shipId === "wick") {
      ctx.fillStyle = bodyGradient;
      ctx.beginPath();
      ctx.moveTo(22, 0);
      ctx.lineTo(14, -6);
      ctx.lineTo(4, -5);
      ctx.lineTo(-6, -8);
      ctx.lineTo(-12, -3);
      ctx.lineTo(-16, 6);
      ctx.lineTo(-8, 4);
      ctx.lineTo(2, 7);
      ctx.lineTo(12, 6);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (this.shipId === "bolt") {
      ctx.fillStyle = bodyGradient;
      ctx.beginPath();
      ctx.moveTo(26, 0);
      ctx.lineTo(20, -9);
      ctx.lineTo(14, -3);
      ctx.lineTo(8, -10);
      ctx.lineTo(2, -2);
      ctx.lineTo(-8, -7);
      ctx.lineTo(-14, 0);
      ctx.lineTo(-8, 7);
      ctx.lineTo(2, 2);
      ctx.lineTo(8, 10);
      ctx.lineTo(14, 3);
      ctx.lineTo(20, 9);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (this.shipId === "knave") {
      ctx.fillStyle = bodyGradient;
      ctx.beginPath();
      ctx.moveTo(26, 0);
      ctx.lineTo(20, -5);
      ctx.lineTo(10, -3);
      ctx.lineTo(4, -9);
      ctx.lineTo(-4, -4);
      ctx.lineTo(-12, -7);
      ctx.lineTo(-16, 0);
      ctx.lineTo(-10, 8);
      ctx.lineTo(2, 5);
      ctx.lineTo(12, 8);
      ctx.lineTo(18, 3);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (this.shipId === "ember") {
      ctx.fillStyle = bodyGradient;
      ctx.beginPath();
      ctx.moveTo(22, 0);
      ctx.lineTo(18, -8);
      ctx.lineTo(8, -10);
      ctx.lineTo(-2, -7);
      ctx.lineTo(-12, -9);
      ctx.lineTo(-16, 0);
      ctx.lineTo(-12, 9);
      ctx.lineTo(-2, 7);
      ctx.lineTo(8, 10);
      ctx.lineTo(18, 8);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (this.shipId === "claw") {
      ctx.fillStyle = bodyGradient;
      ctx.beginPath();
      ctx.moveTo(20, 0);
      ctx.lineTo(26, -3);
      ctx.lineTo(22, -12);
      ctx.lineTo(16, -4);
      ctx.lineTo(10, -11);
      ctx.lineTo(4, -3);
      ctx.lineTo(-6, -8);
      ctx.lineTo(-14, 0);
      ctx.lineTo(-6, 8);
      ctx.lineTo(4, 3);
      ctx.lineTo(10, 11);
      ctx.lineTo(16, 4);
      ctx.lineTo(22, 12);
      ctx.lineTo(26, 3);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (this.shipId === "stinger") {
      ctx.fillStyle = bodyGradient;
      ctx.beginPath();
      ctx.moveTo(10, 0);
      ctx.lineTo(20, -4);
      ctx.lineTo(26, 0);
      ctx.lineTo(20, 4);
      ctx.lineTo(8, 6);
      ctx.lineTo(-4, 8);
      ctx.lineTo(-14, 2);
      ctx.lineTo(-18, -6);
      ctx.lineTo(-8, -6);
      ctx.lineTo(2, -5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = accentColor;
      ctx.beginPath();
      ctx.moveTo(-16, -8);
      ctx.lineTo(-22, -14);
      ctx.lineTo(-20, -4);
      ctx.closePath();
      ctx.fill();
    } else if (this.shipId === "halberd") {
      ctx.fillStyle = bodyGradient;
      ctx.beginPath();
      ctx.moveTo(24, 0);
      ctx.lineTo(20, -8);
      ctx.lineTo(26, -14);
      ctx.lineTo(28, -6);
      ctx.lineTo(18, 4);
      ctx.lineTo(6, 7);
      ctx.lineTo(-8, 6);
      ctx.lineTo(-16, 2);
      ctx.lineTo(-14, -2);
      ctx.lineTo(-2, -7);
      ctx.lineTo(10, -5);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (this.shipId === "lancer") {
      ctx.fillStyle = bodyGradient;
      ctx.beginPath();
      ctx.moveTo(34, 0);
      ctx.lineTo(12, -3);
      ctx.lineTo(2, -4);
      ctx.lineTo(-8, -2);
      ctx.lineTo(-16, 0);
      ctx.lineTo(-8, 2);
      ctx.lineTo(2, 4);
      ctx.lineTo(12, 3);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (this.shipId === "raven") {
      ctx.fillStyle = bodyGradient;
      ctx.beginPath();
      ctx.moveTo(24, 0);
      ctx.lineTo(16, -10);
      ctx.lineTo(6, -6);
      ctx.lineTo(-2, -11);
      ctx.lineTo(-12, -5);
      ctx.lineTo(-18, 2);
      ctx.lineTo(-12, 8);
      ctx.lineTo(-2, 9);
      ctx.lineTo(8, 6);
      ctx.lineTo(18, 9);
      ctx.lineTo(22, 3);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (this.shipId === "warden") {
      ctx.fillStyle = bodyGradient;
      ctx.beginPath();
      ctx.moveTo(18, 0);
      ctx.lineTo(14, -12);
      ctx.lineTo(4, -14);
      ctx.lineTo(-8, -12);
      ctx.lineTo(-16, -6);
      ctx.lineTo(-18, 0);
      ctx.lineTo(-16, 6);
      ctx.lineTo(-8, 12);
      ctx.lineTo(4, 14);
      ctx.lineTo(14, 12);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (this.shipId === "marauder") {
      ctx.fillStyle = bodyGradient;
      ctx.beginPath();
      ctx.moveTo(26, 0);
      ctx.lineTo(22, -9);
      ctx.lineTo(10, -8);
      ctx.lineTo(2, -11);
      ctx.lineTo(-8, -5);
      ctx.lineTo(-16, -8);
      ctx.lineTo(-18, 0);
      ctx.lineTo(-14, 10);
      ctx.lineTo(-4, 7);
      ctx.lineTo(6, 11);
      ctx.lineTo(16, 6);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (this.shipId === "gallant") {
      ctx.fillStyle = bodyGradient;
      ctx.beginPath();
      ctx.moveTo(12, 0);
      ctx.lineTo(8, -11);
      ctx.lineTo(-2, -14);
      ctx.lineTo(-12, -10);
      ctx.lineTo(-16, 0);
      ctx.lineTo(-12, 10);
      ctx.lineTo(-2, 14);
      ctx.lineTo(8, 11);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    } else if (this.shipId === "helios") {
      ctx.fillStyle = bodyGradient;
      ctx.beginPath();
      ctx.moveTo(26, 0);
      ctx.lineTo(22, -8);
      ctx.lineTo(12, -6);
      ctx.lineTo(6, -11);
      ctx.lineTo(-2, -5);
      ctx.lineTo(-10, -9);
      ctx.lineTo(-16, 0);
      ctx.lineTo(-10, 9);
      ctx.lineTo(-2, 5);
      ctx.lineTo(6, 11);
      ctx.lineTo(12, 6);
      ctx.lineTo(22, 8);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = accentColor;
      for (const sy of [-1, 1]) {
        ctx.beginPath();
        ctx.moveTo(-12, 0);
        ctx.lineTo(-22, sy * 12);
        ctx.lineTo(-17, sy * 7);
        ctx.closePath();
        ctx.fill();
      }
    } else if (this.shipId === "eclipse") {
      ctx.fillStyle = bodyGradient;
      ctx.beginPath();
      ctx.moveTo(24, 0);
      ctx.lineTo(10, -11);
      ctx.lineTo(-4, -8);
      ctx.lineTo(-14, -2);
      ctx.lineTo(-12, 0);
      ctx.lineTo(-14, 2);
      ctx.lineTo(-4, 8);
      ctx.lineTo(10, 11);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = "rgba(25, 0, 45, 0.55)";
      ctx.beginPath();
      ctx.arc(2, 0, 7, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.shipId === "oracle") {
      ctx.fillStyle = bodyGradient;
      ctx.beginPath();
      ctx.moveTo(22, 0);
      ctx.lineTo(16, -7);
      ctx.lineTo(6, -8);
      ctx.lineTo(-4, -9);
      ctx.lineTo(-14, -4);
      ctx.lineTo(-18, 0);
      ctx.lineTo(-14, 4);
      ctx.lineTo(-4, 9);
      ctx.lineTo(6, 8);
      ctx.lineTo(16, 7);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = coreColor;
      ctx.lineWidth = 2.5;
    } else if (this.shipId === "myrmidon") {
      ctx.fillStyle = bodyGradient;
      ctx.beginPath();
      ctx.moveTo(20, 0);
      ctx.lineTo(16, -9);
      ctx.lineTo(6, -12);
      ctx.lineTo(-6, -10);
      ctx.lineTo(-14, -4);
      ctx.lineTo(-16, 0);
      ctx.lineTo(-14, 4);
      ctx.lineTo(-6, 10);
      ctx.lineTo(6, 12);
      ctx.lineTo(16, 9);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = accentColor;
      ctx.beginPath();
      ctx.arc(4, 0, 4, 0, Math.PI * 2);
      ctx.fill();
    } else if (this.shipId === "grimstar") {
      ctx.fillStyle = bodyGradient;
      ctx.beginPath();
      ctx.moveTo(24, 0);
      ctx.lineTo(20, -10);
      ctx.lineTo(12, -6);
      ctx.lineTo(8, -12);
      ctx.lineTo(0, -6);
      ctx.lineTo(-8, -11);
      ctx.lineTo(-14, -3);
      ctx.lineTo(-20, 0);
      ctx.lineTo(-14, 3);
      ctx.lineTo(-8, 11);
      ctx.lineTo(0, 6);
      ctx.lineTo(8, 12);
      ctx.lineTo(12, 6);
      ctx.lineTo(20, 10);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
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
    } else if (this.shipId === "seraph") {
      ctx.moveTo(15, 0);
      ctx.lineTo(10, -3.5);
      ctx.lineTo(2, -5.2);
      ctx.lineTo(-6, -4.5);
      ctx.lineTo(-14, -2);
      ctx.lineTo(-17, 0);
      ctx.lineTo(-14, 2);
      ctx.lineTo(-6, 4.5);
      ctx.lineTo(2, 5.2);
      ctx.lineTo(10, 3.5);
      ctx.closePath();
    } else if (this.shipId === "vanguard") {
      ctx.moveTo(28, 0);
      ctx.lineTo(22, -7);
      ctx.lineTo(10, -9);
      ctx.lineTo(-2, -8);
      ctx.lineTo(-14, -4);
      ctx.lineTo(-20, 0);
      ctx.lineTo(-14, 4);
      ctx.lineTo(-2, 8);
      ctx.lineTo(10, 9);
      ctx.lineTo(22, 7);
      ctx.closePath();
    } else if (this.shipId === "reaper") {
      ctx.moveTo(24, 0);
      ctx.lineTo(18, -8);
      ctx.lineTo(6, -9);
      ctx.lineTo(-6, -4);
      ctx.lineTo(-14, 4);
      ctx.lineTo(-18, 12);
      ctx.lineTo(-8, 8);
      ctx.lineTo(4, 2);
      ctx.lineTo(14, 6);
      ctx.closePath();
    } else if (this.shipId === "nova") {
      ctx.moveTo(30, 0);
      ctx.lineTo(12, -11);
      ctx.lineTo(10, -3);
      ctx.lineTo(-2, -12);
      ctx.lineTo(-4, -2);
      ctx.lineTo(-16, -6);
      ctx.lineTo(-8, 2);
      ctx.lineTo(-16, 8);
      ctx.lineTo(-2, 6);
      ctx.lineTo(6, 12);
      ctx.lineTo(8, 3);
      ctx.closePath();
    } else if (this.shipId === "voidwalker") {
      ctx.moveTo(22, 0);
      ctx.lineTo(16, -7);
      ctx.lineTo(6, -8);
      ctx.lineTo(-4, -10);
      ctx.lineTo(-14, -4);
      ctx.lineTo(-20, 0);
      ctx.lineTo(-14, 4);
      ctx.lineTo(-4, 10);
      ctx.lineTo(6, 8);
      ctx.lineTo(16, 7);
      ctx.closePath();
    } else if (this.shipId === "bulwark") {
      ctx.moveTo(14, 0);
      ctx.lineTo(8, -14);
      ctx.lineTo(-4, -16);
      ctx.lineTo(-18, -12);
      ctx.lineTo(-22, 0);
      ctx.lineTo(-18, 12);
      ctx.lineTo(-4, 16);
      ctx.lineTo(8, 14);
      ctx.closePath();
    } else if (this.shipId === "inferno") {
      ctx.moveTo(24, 0);
      ctx.lineTo(18, -9);
      ctx.lineTo(8, -7);
      ctx.lineTo(2, -11);
      ctx.lineTo(-6, -6);
      ctx.lineTo(-14, -8);
      ctx.lineTo(-16, 0);
      ctx.lineTo(-14, 8);
      ctx.lineTo(-6, 6);
      ctx.lineTo(2, 11);
      ctx.lineTo(8, 7);
      ctx.lineTo(18, 9);
      ctx.closePath();
    } else if (this.shipId === "aurora") {
      ctx.moveTo(26, 0);
      ctx.lineTo(20, -6);
      ctx.lineTo(12, -9);
      ctx.lineTo(4, -5);
      ctx.lineTo(-6, -9);
      ctx.lineTo(-12, -2);
      ctx.lineTo(-18, 0);
      ctx.lineTo(-12, 2);
      ctx.lineTo(-6, 9);
      ctx.lineTo(4, 5);
      ctx.lineTo(12, 9);
      ctx.lineTo(20, 6);
      ctx.closePath();
    } else if (this.shipId === "dart") {
      ctx.moveTo(30, 0);
      ctx.lineTo(16, -3);
      ctx.lineTo(4, -4);
      ctx.lineTo(-8, -2);
      ctx.lineTo(-14, 0);
      ctx.lineTo(-8, 2);
      ctx.lineTo(4, 4);
      ctx.lineTo(16, 3);
      ctx.closePath();
    } else if (this.shipId === "pebble") {
      ctx.moveTo(20, 0);
      ctx.lineTo(16, -8);
      ctx.lineTo(6, -12);
      ctx.lineTo(-6, -10);
      ctx.lineTo(-14, -4);
      ctx.lineTo(-16, 0);
      ctx.lineTo(-14, 4);
      ctx.lineTo(-6, 10);
      ctx.lineTo(6, 12);
      ctx.lineTo(16, 8);
      ctx.closePath();
    } else if (this.shipId === "wick") {
      ctx.moveTo(22, 0);
      ctx.lineTo(14, -6);
      ctx.lineTo(4, -5);
      ctx.lineTo(-6, -8);
      ctx.lineTo(-12, -3);
      ctx.lineTo(-16, 6);
      ctx.lineTo(-8, 4);
      ctx.lineTo(2, 7);
      ctx.lineTo(12, 6);
      ctx.closePath();
    } else if (this.shipId === "bolt") {
      ctx.moveTo(26, 0);
      ctx.lineTo(20, -9);
      ctx.lineTo(14, -3);
      ctx.lineTo(8, -10);
      ctx.lineTo(2, -2);
      ctx.lineTo(-8, -7);
      ctx.lineTo(-14, 0);
      ctx.lineTo(-8, 7);
      ctx.lineTo(2, 2);
      ctx.lineTo(8, 10);
      ctx.lineTo(14, 3);
      ctx.lineTo(20, 9);
      ctx.closePath();
    } else if (this.shipId === "knave") {
      ctx.moveTo(26, 0);
      ctx.lineTo(20, -5);
      ctx.lineTo(10, -3);
      ctx.lineTo(4, -9);
      ctx.lineTo(-4, -4);
      ctx.lineTo(-12, -7);
      ctx.lineTo(-16, 0);
      ctx.lineTo(-10, 8);
      ctx.lineTo(2, 5);
      ctx.lineTo(12, 8);
      ctx.lineTo(18, 3);
      ctx.closePath();
    } else if (this.shipId === "ember") {
      ctx.moveTo(22, 0);
      ctx.lineTo(18, -8);
      ctx.lineTo(8, -10);
      ctx.lineTo(-2, -7);
      ctx.lineTo(-12, -9);
      ctx.lineTo(-16, 0);
      ctx.lineTo(-12, 9);
      ctx.lineTo(-2, 7);
      ctx.lineTo(8, 10);
      ctx.lineTo(18, 8);
      ctx.closePath();
    } else if (this.shipId === "claw") {
      ctx.moveTo(20, 0);
      ctx.lineTo(26, -3);
      ctx.lineTo(22, -12);
      ctx.lineTo(16, -4);
      ctx.lineTo(10, -11);
      ctx.lineTo(4, -3);
      ctx.lineTo(-6, -8);
      ctx.lineTo(-14, 0);
      ctx.lineTo(-6, 8);
      ctx.lineTo(4, 3);
      ctx.lineTo(10, 11);
      ctx.lineTo(16, 4);
      ctx.lineTo(22, 12);
      ctx.lineTo(26, 3);
      ctx.closePath();
    } else if (this.shipId === "stinger") {
      ctx.moveTo(10, 0);
      ctx.lineTo(20, -4);
      ctx.lineTo(26, 0);
      ctx.lineTo(20, 4);
      ctx.lineTo(8, 6);
      ctx.lineTo(-4, 8);
      ctx.lineTo(-14, 2);
      ctx.lineTo(-18, -6);
      ctx.lineTo(-8, -6);
      ctx.lineTo(2, -5);
      ctx.closePath();
    } else if (this.shipId === "halberd") {
      ctx.moveTo(24, 0);
      ctx.lineTo(20, -8);
      ctx.lineTo(26, -14);
      ctx.lineTo(28, -6);
      ctx.lineTo(18, 4);
      ctx.lineTo(6, 7);
      ctx.lineTo(-8, 6);
      ctx.lineTo(-16, 2);
      ctx.lineTo(-14, -2);
      ctx.lineTo(-2, -7);
      ctx.lineTo(10, -5);
      ctx.closePath();
    } else if (this.shipId === "lancer") {
      ctx.moveTo(34, 0);
      ctx.lineTo(12, -3);
      ctx.lineTo(2, -4);
      ctx.lineTo(-8, -2);
      ctx.lineTo(-16, 0);
      ctx.lineTo(-8, 2);
      ctx.lineTo(2, 4);
      ctx.lineTo(12, 3);
      ctx.closePath();
    } else if (this.shipId === "raven") {
      ctx.moveTo(24, 0);
      ctx.lineTo(16, -10);
      ctx.lineTo(6, -6);
      ctx.lineTo(-2, -11);
      ctx.lineTo(-12, -5);
      ctx.lineTo(-18, 2);
      ctx.lineTo(-12, 8);
      ctx.lineTo(-2, 9);
      ctx.lineTo(8, 6);
      ctx.lineTo(18, 9);
      ctx.lineTo(22, 3);
      ctx.closePath();
    } else if (this.shipId === "warden") {
      ctx.moveTo(18, 0);
      ctx.lineTo(14, -12);
      ctx.lineTo(4, -14);
      ctx.lineTo(-8, -12);
      ctx.lineTo(-16, -6);
      ctx.lineTo(-18, 0);
      ctx.lineTo(-16, 6);
      ctx.lineTo(-8, 12);
      ctx.lineTo(4, 14);
      ctx.lineTo(14, 12);
      ctx.closePath();
    } else if (this.shipId === "marauder") {
      ctx.moveTo(26, 0);
      ctx.lineTo(22, -9);
      ctx.lineTo(10, -8);
      ctx.lineTo(2, -11);
      ctx.lineTo(-8, -5);
      ctx.lineTo(-16, -8);
      ctx.lineTo(-18, 0);
      ctx.lineTo(-14, 10);
      ctx.lineTo(-4, 7);
      ctx.lineTo(6, 11);
      ctx.lineTo(16, 6);
      ctx.closePath();
    } else if (this.shipId === "gallant") {
      ctx.moveTo(12, 0);
      ctx.lineTo(8, -11);
      ctx.lineTo(-2, -14);
      ctx.lineTo(-12, -10);
      ctx.lineTo(-16, 0);
      ctx.lineTo(-12, 10);
      ctx.lineTo(-2, 14);
      ctx.lineTo(8, 11);
      ctx.closePath();
    } else if (this.shipId === "helios") {
      ctx.moveTo(26, 0);
      ctx.lineTo(22, -8);
      ctx.lineTo(12, -6);
      ctx.lineTo(6, -11);
      ctx.lineTo(-2, -5);
      ctx.lineTo(-10, -9);
      ctx.lineTo(-16, 0);
      ctx.lineTo(-10, 9);
      ctx.lineTo(-2, 5);
      ctx.lineTo(6, 11);
      ctx.lineTo(12, 6);
      ctx.lineTo(22, 8);
      ctx.closePath();
    } else if (this.shipId === "eclipse") {
      ctx.moveTo(24, 0);
      ctx.lineTo(10, -11);
      ctx.lineTo(-4, -8);
      ctx.lineTo(-14, -2);
      ctx.lineTo(-12, 0);
      ctx.lineTo(-14, 2);
      ctx.lineTo(-4, 8);
      ctx.lineTo(10, 11);
      ctx.closePath();
    } else if (this.shipId === "oracle") {
      ctx.moveTo(22, 0);
      ctx.lineTo(16, -7);
      ctx.lineTo(6, -8);
      ctx.lineTo(-4, -9);
      ctx.lineTo(-14, -4);
      ctx.lineTo(-18, 0);
      ctx.lineTo(-14, 4);
      ctx.lineTo(-4, 9);
      ctx.lineTo(6, 8);
      ctx.lineTo(16, 7);
      ctx.closePath();
    } else if (this.shipId === "myrmidon") {
      ctx.moveTo(20, 0);
      ctx.lineTo(16, -9);
      ctx.lineTo(6, -12);
      ctx.lineTo(-6, -10);
      ctx.lineTo(-14, -4);
      ctx.lineTo(-16, 0);
      ctx.lineTo(-14, 4);
      ctx.lineTo(-6, 10);
      ctx.lineTo(6, 12);
      ctx.lineTo(16, 9);
      ctx.closePath();
    } else if (this.shipId === "grimstar") {
      ctx.moveTo(24, 0);
      ctx.lineTo(20, -10);
      ctx.lineTo(12, -6);
      ctx.lineTo(8, -12);
      ctx.lineTo(0, -6);
      ctx.lineTo(-8, -11);
      ctx.lineTo(-14, -3);
      ctx.lineTo(-20, 0);
      ctx.lineTo(-14, 3);
      ctx.lineTo(-8, 11);
      ctx.lineTo(0, 6);
      ctx.lineTo(8, 12);
      ctx.lineTo(12, 6);
      ctx.lineTo(20, 10);
      ctx.closePath();
    }
    ctx.stroke();
    ctx.shadowBlur = 0;
    if (this.shipId === "oracle") {
      ctx.strokeStyle = accentColor;
      ctx.lineWidth = 2;
      ctx.shadowBlur = 8;
      ctx.shadowColor = accentColor;
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.strokeStyle = coreColor;
      ctx.lineWidth = 3;
    }
    
    
    if (this.shipId !== "seraph") {
      ctx.fillStyle = "rgba(255, 255, 255, 0.95)";
      ctx.shadowBlur = 10;
      ctx.shadowColor = coreColor;
      ctx.beginPath();
      ctx.arc(10, 0, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.shadowBlur = 0;
    }
    
    
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

    this.drawWeaponBuffAccents(ctx);

    if (this.shipId === "titan" && (this.titanFuryTimer || 0) > 0) {
      ctx.save();
      const ph = performance.now() / 1000;
      const hx = Math.sin(ph * 1.2) * 4;
      const hy = Math.cos(ph * 0.9) * 3;
      const g = ctx.createRadialGradient(hx, hy, 6, 0, 0, 64);
      g.addColorStop(0, "rgba(255, 90, 50, 0.07)");
      g.addColorStop(0.4, "rgba(255, 120, 200, 0.1)");
      g.addColorStop(0.72, "rgba(80, 240, 255, 0.12)");
      g.addColorStop(1, "rgba(120, 220, 255, 0.03)");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.ellipse(0, 0, 60, 50, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = `rgba(160, 255, 255, ${0.38 + 0.18 * Math.sin(ph * 3.2)})`;
      ctx.lineWidth = 2.2;
      ctx.shadowBlur = 22;
      ctx.shadowColor = "#66ffff";
      ctx.beginPath();
      ctx.ellipse(0, 0, 58, 48, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.lineWidth = 1.4;
      ctx.strokeStyle = `rgba(255, 200, 120, ${0.42 + 0.12 * Math.sin(ph * 2.4)})`;
      ctx.shadowColor = "#ffaa66";
      ctx.beginPath();
      ctx.ellipse(3, -5, 52, 42, 0.18, 0, Math.PI * 2);
      ctx.stroke();
      ctx.globalAlpha = 0.35;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.65)";
      ctx.lineWidth = 1;
      ctx.shadowBlur = 8;
      ctx.beginPath();
      ctx.ellipse(-6, -10, 22, 14, -0.35, 0, Math.PI * 2);
      ctx.stroke();
      ctx.shadowBlur = 0;
      ctx.restore();
    }
    
    
    if (this.invincible) {
      ctx.globalAlpha = 0.4;
    }
    
    ctx.restore();
  }
}


