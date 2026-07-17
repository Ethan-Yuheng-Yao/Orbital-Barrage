const playerBasicAttackShoot = function (bullets) {
    if (this.cooldown > 0 && !this.rapidVolleyActive) return;

    if (
      state.tutorialMode &&
      !state.tutorialProgress.shot &&
      !state.tutorialTestWave &&
      state.tutorialStep >= 1
    ) {
      const mouseMoved =
        Math.abs(input.mouse.x - config.width / 2) > 50 || Math.abs(input.mouse.y - config.height / 2) > 50;
      if (mouseMoved) {
        state.tutorialProgress.shot = true;
        checkTutorialStepCompletion();
      }
    }

    const canShoot = !state.tutorialMode || state.tutorialStep >= 1 || state.tutorialTestWave;
    if (!canShoot) return;
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
      } else if (this.shipId === "myrmidon") {
        leftVolley.color = "#ff4d4d";
        rightVolley.color = "#ff4d4d";
        leftVolley.size = 3.2;
        rightVolley.size = 3.2;
      } else if (this.shipId === "dart" || this.shipId === "wick") {
        leftVolley.color = this.shipId === "dart" ? "#f5f8ff" : "#ff9a3c";
        rightVolley.color = leftVolley.color;
        leftVolley.size = this.shipId === "dart" ? 2.4 : 2.8;
        rightVolley.size = leftVolley.size;
        leftVolley.noTrail = true;
        rightVolley.noTrail = true;
      } else if (this.shipId === "bolt") {
        leftVolley.color = "#4d9fff";
        rightVolley.color = "#4d9fff";
        leftVolley.lineShot = true;
        rightVolley.lineShot = true;
        leftVolley.size = 2;
        rightVolley.size = 2;
      } else if (this.shipId === "ember") {
        leftVolley.color = "#ff7a45";
        rightVolley.color = "#ff9e6a";
        leftVolley.burnDamage = leftVolley.damage * 0.22;
        rightVolley.burnDamage = rightVolley.damage * 0.22;
      } else if (this.shipId === "claw") {
        leftVolley.color = "#5cff8a";
        rightVolley.color = "#7dffb3";
      } else if (this.shipId === "stinger") {
        leftVolley.color = "#ffe94d";
        rightVolley.color = "#fff176";
        leftVolley.size = 2.2;
        rightVolley.size = 2.2;
      } else if (this.shipId === "buckler") {
        leftVolley.color = "#ffb347";
        rightVolley.color = "#ffb347";
        leftVolley.size = 4.2;
        rightVolley.size = 4.2;
      }
      bullets.push(leftVolley);
      bullets.push(rightVolley);
      this.cooldown = this.baseCooldown * (1 / 1.3); 
      return;
    }

    const dm = this.damageMultiplier;
    const sm = this.shotSpeedMultiplier;

    if (this.shipId === "sparrow") {
      const volleyId = `sparrow-${performance.now()}-${Math.random()}`;
      for (let i = 0; i < 5; i++) {
        const b = new Bullet(this.x - Math.cos(angle) * i * 5, this.y - Math.sin(angle) * i * 5, angle + (i - 2) * 0.018, 650 * sm, true, 2.4, "#ffdd33", 3.2 * dm);
        b.noTrail = true;
        b.visualShape = "feather";
        b.wobbleAmp = 0.035;
        b.sparrowFeather = true;
        b.volleyId = volleyId;
        b.life = 1.1;
        bullets.push(b);
      }
      this.cooldown = this.baseCooldown * 0.92;
      return;
    }
    if (this.shipId === "dart" && (this.dartTwinPierceTimer || 0) > 0) {
      const perp = angle + Math.PI / 2;
      const lane = 7;
      for (const sign of [-1, 1]) {
        const b = new Bullet(
          this.x + Math.cos(perp) * lane * sign,
          this.y + Math.sin(perp) * lane * sign,
          angle,
          455 * sm,
          true,
          2.15,
          "#f7fbff",
          6.4 * dm
        );
        b.visualShape = "needle";
        b.noTrail = true;
        b.infinitePierce = true;
        b.life = 1.65;
        bullets.push(b);
      }
      this.cooldown = this.baseCooldown * 0.78;
      return;
    }
    if (this.shipId === "dart") {
      const b = new Bullet(this.x, this.y, angle, 430 * sm, true, 2.1, "#f7fbff", 7.0 * dm);
      b.visualShape = "needle";
      b.dartBasic = true;
      b.life = 1.75;
      bullets.push(b);
      this.cooldown = this.baseCooldown * 0.78;
      return;
    }
    if (this.shipId === "pebble") {
      const b = new Bullet(this.x, this.y, angle, 420 * sm, true, 4.2, "#8f979e", 7.5 * dm);
      configurePebbleRicochetOrb(b);
      bullets.push(b);
      this.cooldown = this.baseCooldown * 0.88;
      return;
    }
    if (this.shipId === "wick") {
      const perp = angle + Math.PI / 2;
      const lane = 7;
      const sp = 520 * sm;
      const dmgEach = 2.9 * dm;
      for (const sign of [-1, 1]) {
        const b = new Bullet(
          this.x + Math.cos(perp) * lane * sign,
          this.y + Math.sin(perp) * lane * sign,
          angle,
          sp,
          true,
          2.5,
          "#ff9a3c",
          dmgEach
        );
        b.noTrail = true;
        b.lineShot = true;
        b.wickBasic = true;
        b.life = 1.15;
        bullets.push(b);
      }
      this.cooldown = this.baseCooldown * 0.72;
      return;
    }
    if (this.shipId === "bolt") {
      const b = new Bullet(this.x, this.y, angle, 540 * sm, true, 2.2, "#4d9fff", 7.2 * dm);
      b.lineShot = true;
      b.chainArc = true;
      b.chainDamagePct = 0.15;
      bullets.push(b);
      this.cooldown = this.baseCooldown * 0.8;
      return;
    }
    if (this.shipId === "bulwark") {
      const b = new Bullet(this.x, this.y, angle, 300 * sm, true, 7.2, "#ff8c42", 12.5 * dm);
      b.visualShape = "shieldDisc";
      b.bulwarkPush = true;
      b.life = 0.85;
      bullets.push(b);
      this.cooldown = this.baseCooldown * 1.12;
      return;
    }
    if (this.shipId === "myrmidon") {
      for (let i = 0; i < 3; i++) {
        const b = new Bullet(this.x - Math.cos(angle) * i * 7, this.y - Math.sin(angle) * i * 7, angle + (i - 1) * 0.015, 600 * sm, true, 2.1, "#ff3333", 3.2 * dm);
        b.noTrail = true;
        b.visualShape = "starPellet";
        b.myrmidonDot = true;
        b.life = 0.85;
        bullets.push(b);
      }
      this.cooldown = this.baseCooldown * 0.34;
      return;
    }
    if (this.shipId === "knave") {
      const startX = this.x + Math.cos(angle) * 14;
      const startY = this.y + Math.sin(angle) * 14;
      const b = new Bullet(startX, startY, angle, 480 * sm, true, 3.8, "#b86bff", 8.2 * dm);
      b.wobbleAmp = 0.14;
      b.knaveLeftCurveTimer = 0.2;
      b.visualShape = "raggedShard";
      b.knaveSteal = true;
      bullets.push(b);
      this.cooldown = this.baseCooldown * 0.62;
      return;
    }
    if (this.shipId === "buckler") {
      const b = new Bullet(this.x, this.y, angle, 440 * sm, true, 4.8, "#ffb347", 8 * dm);
      b.visualShape = "heavyOrb";
      b.bucklerGuard = true;
      b.wobbleAmp = 0.025;
      bullets.push(b);
      this.cooldown = this.baseCooldown * 0.72;
      return;
    }
    if (this.shipId === "ember") {
      const b = new Bullet(this.x, this.y, angle, 500 * sm, true, 3.2, "#ff7a45", 5.6 * dm);
      b.burnDamage = b.damage * 0.12;
      b.visualShape = "spark";
      b.emberPuddle = true;
      b.life = 0.55;
      bullets.push(b);
      this.cooldown = this.baseCooldown * 0.68;
      return;
    }
    if (this.shipId === "claw") {
      const b = new Bullet(this.x, this.y, angle, 430 * sm, true, 4.8, "#5cff8a", 7.0 * dm);
      b.visualShape = "pawShot";
      b.clawBasic = true;
      b.knockback = 58;
      bullets.push(b);
      this.cooldown = this.baseCooldown * 0.7;
      return;
    }
    if (this.shipId === "picket") {
      const perp = angle + Math.PI / 2;
      const b = new Bullet(this.x + Math.cos(perp) * 3, this.y + Math.sin(perp) * 3, angle, 500 * sm, true, 3.2, "#f0f6ff", 7.4 * dm);
      b.picketTri = true;
      b.life = 0.95;
      bullets.push(b);
      this.cooldown = this.baseCooldown * 0.74;
      return;
    }
    if (this.shipId === "stinger") {
      for (let i = -1; i <= 1; i++) {
        const b = new Bullet(this.x, this.y, angle + i * 0.08, 430 * sm, true, 5.2, "#a0ff7a", 4.2 * dm);
        b.visualShape = "clawHook";
        b.stingerPoison = true;
        b.stingerPoisonPerTick = 1.8 * dm;
        b.life = 1.1;
        bullets.push(b);
      }
      this.cooldown = this.baseCooldown * 0.62;
      return;
    }
    if (this.shipId === "phantom") {
      const b = new Bullet(this.x, this.y, angle, 400 * sm, true, 3.8, "rgba(200,190,255,0.75)", 8.5 * dm);
      b.piercing = true;
      b.pierceCount = 1;
      b.visualShape = "ghostBolt";
      b.phantomPhaseBasic = true;
      b.life = 1.15;
      bullets.push(b);
      this.cooldown = this.baseCooldown * 0.72;
      return;
    }
    if (this.shipId === "tempest") {
      const b = new Bullet(this.x, this.y, angle, 260 * sm, true, 5.2, "#fff176", 8.2 * dm);
      b.visualShape = "heavyOrb";
      b.tempestOrb = true;
      b.life = 1.6;
      bullets.push(b);
      this.cooldown = this.baseCooldown * 0.62;
      return;
    }
    if (this.shipId === "vanguard") {
      const b = new Bullet(this.x, this.y, angle, 440 * sm, true, 5.2, "#f2f6ff", 9.2 * dm);
      b.knockback = 38;
      b.visualShape = "lineShot";
      b.vanguardTrail = true;
      const amp = this.weaponBuffVisualActive();
      state.visualBeams.push({
        x1: this.x,
        y1: this.y,
        x2: this.x - Math.cos(angle) * 90,
        y2: this.y - Math.sin(angle) * 90,
        color: amp ? "rgba(255, 248, 200, 0.78)" : "rgba(255,255,255,0.52)",
        width: amp ? 13 : 8,
        life: 0.22,
        maxLife: 0.22,
        phase: 0,
      });
      bullets.push(b);
      this.cooldown = this.baseCooldown * 0.78;
      return;
    }
    if (this.shipId === "lancer") {
      const b = new Bullet(this.x, this.y, angle, 620 * sm, true, 2.4, "#66ff99", 9.8 * dm);
      b.piercing = true;
      b.pierceCount = b.age > 0.65 ? 2 : 1;
      b.noTrail = true;
      b.visualShape = "needle";
      b.lancerGrow = true;
      bullets.push(b);
      this.cooldown = this.baseCooldown * 0.68;
      return;
    }
    if (this.shipId === "halberd") {
      const b = new Bullet(this.x, this.y, angle + rng(-0.04, 0.04), 340 * sm, true, 7, "#ffe066", 10.5 * dm);
      b.piercing = true;
      b.pierceCount = 2;
      b.visualShape = "axeBlade";
      b.halberdBlade = true;
      bullets.push(b);
      this.cooldown = this.baseCooldown * 0.92;
      return;
    }
    if (this.shipId === "raven") {
      const nearest = getNearestEnemy(this.x, this.y);
      const b = new Bullet(this.x, this.y, angle, 480 * sm, true, 3.2, "#4a2a6a", 8 * dm);
      b.visualShape = "bird";
      b.ravenBird = true;
      if (nearest) {
        b.tracking = true;
        b.trackingTarget = nearest;
        b.trackingTurnRate = 28;
      }
      bullets.push(b);
      this.cooldown = this.baseCooldown * 0.62;
      return;
    }
    if (this.shipId === "warden") {
      const pulse = 0.85 + 0.15 * Math.sin(performance.now() / 500);
      const b = new Bullet(this.x, this.y, angle, 280 * sm, true, 6.5 * pulse, "#f5e6a8", 9.5 * dm);
      b.visualShape = "heavyOrb";
      b.baseSize = b.size;
      b.wardenAbsorb = true;
      b.life = 1.2;
      bullets.push(b);
      this.cooldown = this.baseCooldown * 1.05;
      return;
    }
    if (this.shipId === "marauder") {
      const b = new Bullet(this.x, this.y, angle + rng(-0.1, 0.1), 440 * sm, true, 4.2, "#cc3344", 8.8 * dm);
      b.marauderShard = true;
      b.visualShape = "raggedShard";
      b.marauderGeneration = 0;
      bullets.push(b);
      this.cooldown = this.baseCooldown * 0.64;
      return;
    }
    if (this.shipId === "gallant") {
      const b = new Bullet(this.x, this.y, angle, 470 * sm, true, 3.8, "#c8e0ff", 8.4 * dm);
      b.visualShape = "needle";
      b.gallantHeal = true;
      b.life = 0.55;
      bullets.push(b);
      this.cooldown = this.baseCooldown * 0.7;
      return;
    }
    if (this.shipId === "aegis") {
      const main = new Bullet(this.x, this.y, angle, 320 * sm, true, 7.2, "#78c0ff", 8.2 * dm);
      main.aegisDisc = true;
      main.aegisReflectDisc = true;
      main.aegisBasicWide = true;
      main.hitEllipseW = 15;
      main.hitEllipseH = 3.1;
      main.life = 1.85;
      bullets.push(main);
      this.cooldown = this.baseCooldown * 0.95;
      return;
    }
    if (this.shipId === "glacier") {
      const b = new Bullet(this.x, this.y, angle, 300 * sm, true, 5, "#9ce8ff", 9 * dm);
      b.visualShape = "iceShard";
      b.glacierPrimary = true;
      b.glacierFreezeDuration = 3;
      bullets.push(b);
      this.cooldown = this.baseCooldown * 0.88;
      return;
    }
    if (this.shipId === "reaper") {
      const b = new Bullet(this.x, this.y, angle + 0.12, 380 * sm, true, 5.5, "#7a1848", 10 * dm);
      b.burnDamage = 4 * dm;
      b.reaperCrescent = true;
      b.reaperBoomerang = true;
      bullets.push(b);
      this.cooldown = this.baseCooldown * 0.82;
      return;
    }
    if (this.shipId === "helios") {
      for (let i = 0; i < 18; i++) {
        const a = angle + rng(-0.14, 0.14);
        const flame = new Bullet(this.x + Math.cos(a) * 12, this.y + Math.sin(a) * 12, a, rng(120, 320) * sm, true, rng(2.2, 4.6), Math.random() < 0.5 ? "#ff4a1f" : "#ff9a2f", 1.15 * dm);
        flame.visualShape = "spark";
        flame.heliosFlame = true;
        flame.life = rng(0.22, 0.52);
        bullets.push(flame);
      }
      this.cooldown = 0.045;
      return;
    }
    if (this.shipId === "grimstar") {
      const main = new Bullet(this.x, this.y, angle + rng(-0.025, 0.025), 470 * sm, true, 6.6, "#8b62ff", 10.2 * dm);
      main.visualShape = "starShot";
      main.grimstarTrail = true;
      main.thinPurpleTrail = true;
      main.life = 0.72;
      bullets.push(main);
      for (const phase of [0, Math.PI]) {
        const side = new Bullet(this.x, this.y, angle, 455 * sm, true, 4.8, "#a783ff", 7.4 * dm);
        side.visualShape = "starShot";
        side.grimstarTrail = true;
        side.thinPurpleTrail = true;
        side.sinePath = true;
        side.sineOrigin = { x: this.x, y: this.y };
        side.sineAngle = angle;
        side.sineSpeed = 455 * sm;
        side.sineAmplitude = 20;
        side.sineFrequency = 12;
        side.sinePhase = phase;
        side.life = 0.78;
        bullets.push(side);
      }
      this.cooldown = this.baseCooldown * 0.58;
      return;
    }
    if (this.shipId === "eclipse") {
      this.eclipseShotToggle ^= 1;
      const dark = this.eclipseShotToggle === 0;
      const col = dark ? "#4a2080" : "#ffffff";
      const b = new Bullet(this.x, this.y, angle, 500 * sm, true, dark ? 4.4 : 3.6, col, 8.8 * dm);
      b.visualShape = dark ? "singularity" : "lineShot";
      b.eclipseBlind = dark;
      b.eclipseHeal = !dark;
      b.eclipseBrightRim = dark;
      b.life = 0.95;
      bullets.push(b);
      this.cooldown = this.baseCooldown * 0.76;
      return;
    }
    if (this.shipId === "oracle") {
      const b = new Bullet(this.x, this.y, angle, 480 * sm, true, 3.6, "#b8fff8", 8.6 * dm);
      b.visualShape = "rune";
      b.oracleGuidancePending = true;
      b.oracleGuidanceArmDelay = 0.11;
      b.trackingTurnRate = 9.8;
      bullets.push(b);
      this.cooldown = this.baseCooldown * 0.7;
      return;
    }

    if (this.shipId === "seraph") {
      const perp = angle + Math.PI / 2;
      const sideOffsets = [-46, -17, 17, 46];
      for (const off of sideOffsets) {
        const bx = this.x + Math.cos(perp) * off;
        const by = this.y + Math.sin(perp) * off;
        const bullet = new Bullet(bx, by, angle, 760 * this.shotSpeedMultiplier, true, 4, "#ff1a1a", 14 * this.damageMultiplier);
        bullet.seraphRailEmitter = true;
        bullet.emitAcc = 0;
        bullets.push(bullet);
      }
      this.cooldown = this.baseCooldown * 0.2;
      return;
    }

    
    if (this.shipId === "titan") {
      const sz = this.titanFuryTimer > 0 ? 28 : 22;
      const core = new Bullet(this.x + Math.cos(angle) * 10, this.y + Math.sin(angle) * 10, angle, 95 * this.shotSpeedMultiplier, true, sz, "#d94a0a", 24 * this.damageMultiplier);
      core.life = 2.3;
      core.titanMegaOrb = true;
      core.piercing = true;
      core.pierceCount = 8;
      core.knockback = 90;
      core.burnDamage = core.damage * 0.35;
      bullets.push(core);
      this.cooldown = this.baseCooldown * 1.15;
      return;
    }
    if (this.shipId === "inferno") {
      const count = this.infernoPyroTimer > 0 ? 3 : 1;
      for (let i = 0; i < count; i++) {
        const offset = count === 1 ? 0 : (i - 1) * 0.14;
        const glo = new Bullet(this.x, this.y, angle + offset + rng(-0.04, 0.04), 395 * this.shotSpeedMultiplier, true, 8.8, "#ff5a2a", 11.5 * this.damageMultiplier);
        glo.life = 1.95;
        glo.burnDamage = 6.5 * this.damageMultiplier;
        glo.knockback = 24;
        glo.infernoGlob = true;
        glo.maxRebounds = 1;
        glo.puddleOnExpire = true;
        bullets.push(glo);
      }
      this.cooldown = this.baseCooldown * (this.infernoPyroTimer > 0 ? 0.43 : 0.86);
      return;
    }
    if (this.shipId === "aurora") {
      const phase = Math.floor(performance.now() / 500) % 3;
      const colors = [
        { key: "green", color: "#78ffb4" },
        { key: "cyan", color: "#78f0ff" },
        { key: "purple", color: "#c896ff" },
      ];
      const c = colors[phase];
      for (const dir of [-1, 1]) {
        const ribbon = new Bullet(this.x, this.y, angle, 460 * this.shotSpeedMultiplier, true, 5.6, c.color, 7.2 * this.damageMultiplier);
        ribbon.visualShape = "lineShot";
        ribbon.auroraColor = c.key;
        ribbon.sinePath = true;
        ribbon.sineOrigin = { x: this.x, y: this.y };
        ribbon.sineAngle = angle;
        ribbon.sineSpeed = 460 * this.shotSpeedMultiplier;
        ribbon.sineAmplitude = 28;
        ribbon.sineFrequency = 12;
        ribbon.sinePhase = dir < 0 ? 0 : Math.PI;
        ribbon.life = 1.1;
        bullets.push(ribbon);
      }
      this.cooldown = this.baseCooldown * 0.75;
      return;
    }
    if (this.shipId === "specter") {
      const lance = new Bullet(this.x, this.y, angle, 920 * this.shotSpeedMultiplier, true, 2.2, "rgba(220,220,240,0.02)", 11 * this.damageMultiplier);
      lance.piercing = true;
      lance.pierceCount = 4;
      lance.life = 1.35;
      lance.noTrail = true;
      lance.specterNeedle = true;
      lance.noHitParticle = true;
      state.visualBeams.push({ x1: 0, y1: this.y - 4, x2: config.width, y2: this.y + 4, color: "rgba(220,220,255,0.04)", width: 2, life: 0.08, maxLife: 0.08, phase: 0 });
      bullets.push(lance);
      this.cooldown = this.baseCooldown * 0.72;
      return;
    }
    if (this.shipId === "voidwalker") {
      const sequence = [0, 0.12, -0.12];
      for (let i = 0; i < sequence.length; i++) {
        const slash = new Bullet(this.x - Math.cos(angle) * i * 12, this.y - Math.sin(angle) * i * 12, angle + sequence[i], 620 * this.shotSpeedMultiplier, true, 4.2, "#b27bff", 7.5 * this.damageMultiplier);
        slash.visualShape = "lineShot";
        slash.voidwalkerSlash = true;
        slash.voidwalkerScale = 1;
        slash.infinitePierce = true;
        slash.life = 0.55 + i * 0.08;
        bullets.push(slash);
      }
      this.cooldown = this.baseCooldown * 0.8;
      return;
    }
    if (this.shipId === "nova") {
      const star = new Bullet(this.x, this.y, angle, 380 * this.shotSpeedMultiplier, true, 3.2, "#ffffff", 6.2 * this.damageMultiplier);
      star.life = 1.0;
      star.visualShape = "starPellet";
      star.novaPrimaryPop = true;
      bullets.push(star);
      this.cooldown = this.baseCooldown * 0.62;
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
};

function enhanceBulletsWeaponBuffVisual(player, bullets, startIdx) {
  if (!player || !bullets || typeof startIdx !== "number" || startIdx >= bullets.length) return;
  if (typeof player.weaponBuffVisualActive !== "function" || !player.weaponBuffVisualActive()) return;
  for (let i = startIdx; i < bullets.length; i++) {
    const b = bullets[i];
    if (!b || !b.friendly) continue;
    if (b.boltIonOrb) continue;
    if ((b.damage || 0) < 0.02) continue;
    b.weaponBuffEnhanced = true;
    b.size = (b.size || 4) * 1.24;
    if (!b.visualShape && !b.lineShot && !b.titanMegaOrb) {
      b.visualShape = "heavyOrb";
    }
  }
}

/** One Oracle Prophecy lightning strike (particles + damage). Used by staggered `state.oracleLightningStorm` updates. */
function applyOracleLightningBolt(spawnX, spawnY, hitEnemies, dm, prof) {
  let target = null;
  let minDist = Infinity;
  for (let i = 0; i < state.enemies.length; i++) {
    const enemy = state.enemies[i];
    if (hitEnemies.has(i)) continue;
    const d = dist(spawnX, spawnY, enemy.x, enemy.y);
    if (d < minDist && d < 920) {
      minDist = d;
      target = { enemy, index: i };
    }
  }
  const strikeX = target ? target.enemy.x : rng(40, config.width - 40);
  const strikeY = target ? target.enemy.y : rng(TOP_HUD_SAFE_Y + 50, config.height - 45);
  for (let layer = 0; layer < 3; layer++) {
    for (let k = 0; k < 72; k++) {
      const t = k / 72;
      const baseX = spawnX + (strikeX - spawnX) * t;
      const baseY = spawnY + (strikeY - spawnY) * t;
      const offset = Math.sin(t * 28 + layer) * rng(12, 32);
      const x = baseX + Math.cos(t * Math.PI * 6) * offset;
      const y = baseY + Math.sin(t * Math.PI * 4 + layer) * (offset * 0.35);
      const p = new Particle(x, y, layer === 0 ? prof.c0 : layer === 1 ? prof.c1 : prof.c2);
      p.life = 0.48;
      p.size = rng(3, 6);
      state.particles.push(p);
    }
  }
  if (target) {
    hitEnemies.add(target.index);
    const strikeDmg = 120 * dm;
    target.enemy.hp -= strikeDmg;
    recordDamageDealt(strikeDmg);
    for (let j = 0; j < 34; j++) {
      state.particles.push(new Particle(target.enemy.x, target.enemy.y, prof.hit));
    }
    if (target.enemy.hp <= 0) {
      const killI = state.enemies.indexOf(target.enemy);
      if (killI > -1) onEnemyDestroyed(target.enemy, killI);
    }
  } else {
    const splash = 38 * dm;
    for (const enemy of state.enemies) {
      if (!enemy || enemy.hp <= 0) continue;
      if (dist(enemy.x, enemy.y, strikeX, strikeY) < 100 + enemy.size) {
        enemy.hp -= splash;
        recordDamageDealt(splash);
        if (enemy.hp <= 0) {
          const ki = state.enemies.indexOf(enemy);
          if (ki > -1) onEnemyDestroyed(enemy, ki);
        }
      }
    }
  }
}

const abilityHandlers = {
  burst: (cost) => {
    if (!state.running || state.upgradePending) return;
    if (state.player.shipId === "wick" && (state.player.wickSprayTimer || 0) > 0) return;
    if (!consumeAbilityEnergy(cost)) return;
    const sid = state.player.shipId;
    if (sid === "marauder") {
      abilityParticleBurst("#aa1122", 95, 50);
      const ang = Math.atan2(input.mouse.y - state.player.y, input.mouse.x - state.player.x);
      const dm = state.player.damageMultiplier * state.player.abilityDamageMultiplier;
      const sm = state.player.shotSpeedMultiplier;
      const core = new Bullet(state.player.x, state.player.y, ang, 300 * sm, true, 7, "#cc2233", 14 * dm);
      core.marauderPlunder = true;
      state.bullets.push(core);
      return;
    }
    if (sid === "wick") {
      abilityParticleBurst("#ffcc55", 140, 72);
      state.player.wickSprayTimer = 3;
      state.player.wickSprayAcc = 0;
      state.player.wickSprayShotsRemaining = 50;
      return;
    }
    if (sid === "pebble") {
      abilityParticleBurst("#aab4bc", 88, 50);
      const ang = Math.atan2(input.mouse.y - state.player.y, input.mouse.x - state.player.x);
      const dm = state.player.damageMultiplier * state.player.abilityDamageMultiplier;
      const sm = state.player.shotSpeedMultiplier;
      for (let i = 0; i < 5; i++) {
        const a = ang + (i - 2) * 0.2;
        const b = new Bullet(state.player.x, state.player.y, a, 398 * sm, true, 3.5, "#aab4bc", 6.4 * dm);
        configurePebbleRicochetOrb(b);
        b.life = 2.4;
        state.bullets.push(b);
      }
      return;
    }
    if (sid === "ember") {
      abilityParticleBurst("#ff5a2a", 180, 95);
      const dm = state.player.damageMultiplier * state.player.abilityDamageMultiplier;
      state.emberFog = {
        life: 5.6,
        maxLife: 5.6,
        radius: 340,
        dps: 7.2 * dm,
        color: "rgba(255, 70, 40, 0.18)",
      };
      return;
    }
    if (sid === "sparrow") {
      abilityParticleBurst("#ffdd55", 90, 55);
      const dmg = 3.2 * state.player.damageMultiplier * state.player.abilityDamageMultiplier;
      const sp = 380 * state.player.shotSpeedMultiplier;
      for (let i = 0; i < 8; i++) {
        const a = (i / 8) * Math.PI * 2;
        const b = new Bullet(state.player.x, state.player.y, a, sp, true, 2.2, "#ffe566", dmg);
        b.noTrail = true;
        b.visualShape = "starPellet";
        b.life = 0.55;
        state.bullets.push(b);
      }
      return;
    }
    if (sid === "tempest") {
      abilityParticleBurst("#ffeb3b", 360, 175);
      state.tempestEyeStorms.push(new TempestEyeStormVortex(state.player.x, state.player.y));
      return;
    }
    if (sid === "aurora") {
      abilityParticleBurst("#7dfff0", 220, 120);
      for (let t = 0; t < 90; t++) {
        const a = rng(0, Math.PI * 2);
        const sp = rng(180, 520) * state.player.shotSpeedMultiplier;
        const hues = ["#66ffe6", "#b388ff", "#7dffb3"];
        state.bullets.push(
          new Bullet(state.player.x, state.player.y, a, sp, true, 2.4, hues[t % 3], 4.2 * state.player.damageMultiplier * state.player.abilityDamageMultiplier)
        );
      }
      return;
    }
    if (sid === "knave") {
      abilityParticleBurst("#c86bff", 80, 45);
      const dm = state.player.damageMultiplier * state.player.abilityDamageMultiplier;
      const sm = state.player.shotSpeedMultiplier;
      const alive = state.enemies.filter((e) => e && e.hp > 0);
      alive.sort((a, b) => dist(a.x, a.y, state.player.x, state.player.y) - dist(b.x, b.y, state.player.x, state.player.y));
      for (let k = 0; k < 3; k++) {
        const ang = Math.atan2(input.mouse.y - state.player.y, input.mouse.x - state.player.x);
        const b = new Bullet(state.player.x, state.player.y, ang, 500 * sm, true, 3.9, "#d5a6ff", 8.5 * dm);
        b.visualShape = "raggedShard";
        b.wobbleAmp = 0.14;
        b.knaveLeftCurveTimer = 0.2;
        b.tracking = true;
        b.trackingTarget = alive[k] || alive[k % Math.max(alive.length, 1)] || getNearestEnemy(state.player.x, state.player.y);
        b.trackingTurnRate = 5.8;
        b.piercing = true;
        b.pierceCount = 3;
        b.life = 2.2;
        state.bullets.push(b);
      }
      return;
    }
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
    if (!state.running || state.upgradePending) return;
    if (state.player.shipId === "dart" && (state.player.dartTwinPierceTimer || 0) > 0) return;
    if (!consumeAbilityEnergy(cost)) return;
    if (state.player.shipId === "wick") {
      abilityParticleBurst("#ffb74d", 85, 48);
      const ang = Math.atan2(input.mouse.y - state.player.y, input.mouse.x - state.player.x);
      const dm = state.player.damageMultiplier * state.player.abilityDamageMultiplier;
      const sm = state.player.shotSpeedMultiplier;
      const shell = new Bullet(state.player.x, state.player.y, ang, 410 * sm, true, 9.2, "#ffcc66", 6.2 * dm);
      shell.wickExplosiveShot = true;
      shell.visualShape = "heavyOrb";
      shell.noTrail = true;
      shell.life = 2.4;
      state.bullets.push(shell);
      return;
    }
    if (state.player.shipId === "dart") {
      abilityParticleBurst("#f5f8ff", 95, 52);
      state.player.dartTwinPierceTimer = 3.5;
      return;
    }
    if (state.player.shipId === "bolt") {
      abilityParticleBurst("#66a8ff", 58, 36);
      const ang = Math.atan2(input.mouse.y - state.player.y, input.mouse.x - state.player.x);
      const sm = state.player.shotSpeedMultiplier;
      const ion = new Bullet(state.player.x, state.player.y, ang, 118 * sm, true, 11, "#66ccff", 0.001);
      ion.boltIonOrb = true;
      ion.boltIonOrbDps = 42;
      ion.infinitePierce = true;
      ion.life = 5.2;
      ion.noTrail = true;
      state.bullets.push(ion);
      return;
    }
    if (state.player.shipId === "myrmidon") {
      abilityParticleBurst("#ff4444", 80, 45);
      const ang = Math.atan2(input.mouse.y - state.player.y, input.mouse.x - state.player.x);
      const perp = ang + Math.PI / 2;
      const dm = state.player.damageMultiplier * state.player.abilityDamageMultiplier;
      const sm = state.player.shotSpeedMultiplier;
      for (let i = -1; i <= 1; i++) {
        const b = new Bullet(state.player.x + Math.cos(perp) * i * 15, state.player.y + Math.sin(perp) * i * 15, ang, 620 * sm, true, 2.7, "#ff4444", 8.2 * dm);
        b.visualShape = "lineShot";
        b.life = 0.5;
        state.bullets.push(b);
      }
      return;
    }
    if (state.player.shipId === "claw") {
      abilityParticleBurst("#5cff8a", 82, 45);
      const dm = state.player.damageMultiplier * state.player.abilityDamageMultiplier;
      const sm = state.player.shotSpeedMultiplier;
      const ang = Math.atan2(input.mouse.y - state.player.y, input.mouse.x - state.player.x);
      const b = new Bullet(state.player.x, state.player.y, ang, 390 * sm, true, 13.5, "#66ff99", 14 * dm);
      b.clawTear = true;
      b.clawStun = 3.5;
      b.visualShape = "pawShot";
      b.knockback = 120;
      b.infinitePierce = true;
      b.piercing = true;
      b.life = 1.35;
      state.bullets.push(b);
      return;
    }
    if (state.player.shipId === "stinger") {
      abilityParticleBurst("#a8ff7a", 92, 52);
      const dm = state.player.damageMultiplier * state.player.abilityDamageMultiplier;
      const centerX = state.player.x;
      const centerY = state.player.y;
      const total = 10;
      for (let i = 0; i < total; i++) {
        const baseAng = (i / total) * Math.PI * 2;
        const b = new Bullet(centerX, centerY, baseAng, 1, true, 4.9, "#9dff71", 5.9 * dm);
        b.visualShape = "clawHook";
        b.stingerSpiral = true;
        b.stingerSpiralCx = centerX;
        b.stingerSpiralCy = centerY;
        b.stingerSpiralStart = baseAng;
        b.stingerSpiralOutSpin = i % 2 === 0 ? 1 : -1;
        b.stingerSpiralInSpin = i % 2 === 0 ? -1 : 1;
        b.stingerSpiralMaxR = 240;
        b.stingerSpiralTurnRate = 6.6;
        b.life = 1.8;
        b.noTrail = true;
        state.bullets.push(b);
      }
      return;
    }
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
    if (sid === "sparrow") {
      abilityParticleBurst("#ffe566", 85, 48);
      const ang = Math.atan2(input.mouse.y - state.player.y, input.mouse.x - state.player.x);
      const dm = state.player.damageMultiplier * state.player.abilityDamageMultiplier;
      const sm = state.player.shotSpeedMultiplier;
      for (let i = -2; i <= 2; i++) {
        const b = new Bullet(state.player.x, state.player.y, ang + i * 0.11, 520 * sm, true, 2.2, "#ffd54a", 7.2 * dm);
        b.lineShot = true;
        b.life = 0.32;
        state.bullets.push(b);
      }
      return;
    }
    if (sid === "ember") {
      abilityParticleBurst("#ff2a2a", 120, 70);
      const ang = Math.atan2(input.mouse.y - state.player.y, input.mouse.x - state.player.x);
      const dm = state.player.damageMultiplier * state.player.abilityDamageMultiplier;
      const sm = state.player.shotSpeedMultiplier;
      const b = new Bullet(state.player.x, state.player.y, ang, 250 * sm, true, 16, "#ff2a2a", 18 * dm);
      b.life = 4.6;
      b.emberInfernoOrb = true;
      b.emberTrailDps = 12 * dm;
      b.knockback = 110;
      b.noTrail = true;
      state.bullets.push(b);
      return;
    }
    if (sid === "gallant") {
      abilityParticleBurst("#d0e8ff", 110, 60);
      state.player.rapidTimer = Math.max(state.player.rapidTimer, 3.2);
      state.player.burstTimer = Math.max(state.player.burstTimer, 2.4);
      return;
    }
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
    if (sid === "bolt") {
      abilityParticleBurst("#a8d8ff", 92, 54);
      state.player.boltChannelLock = 6;
      state.boltCage = {
        startMs: performance.now(),
        rays: 15,
        footYOffset: 24,
        innerRadius: 18,
        outerRadius: 142,
        hitBand: 26,
      };
      return;
    }
    if (sid === "titan") {
      abilityParticleBurst("#ff7722", 210, 100);
      const dm = state.player.damageMultiplier * state.player.abilityDamageMultiplier;
      const baseDamage = (120 + state.wave * 2) * dm;
      const circle = new ExpandingCircle(config.width * 0.5, config.height - 52, config.width * 0.52, "#ff6622", 1.05, baseDamage, null, true);
      state.expandingCircles.push(circle);
      return;
    }
    if (sid === "buckler") {
      abilityParticleBurst("#ffb347", 100, 55);
      const dm = state.player.damageMultiplier * state.player.abilityDamageMultiplier;
      const c = new ExpandingCircle(state.player.x, state.player.y, 140, "#ffaa66", 0.85, 55 * dm, null, true);
      state.expandingCircles.push(c);
      for (const enemy of state.enemies) {
        const d = dist(enemy.x, enemy.y, state.player.x, state.player.y);
        if (d < 160) {
          const push = Math.atan2(enemy.y - state.player.y, enemy.x - state.player.x);
          enemy.x += Math.cos(push) * 36;
          enemy.y += Math.sin(push) * 36;
        }
      }
      return;
    }
    if (sid === "aegis") {
      abilityParticleBurst("#78c0ff", 210, 100);
      const dm = state.player.damageMultiplier * state.player.abilityDamageMultiplier;
      state.expandingCircles.push(new ExpandingCircle(state.player.x, state.player.y, 270, "#78c0ff", 1.35, 84 * dm, null, true));
      state.visualBeams.push({
        x1: state.player.x,
        y1: state.player.y,
        x2: state.player.x,
        y2: TOP_HUD_SAFE_Y,
        color: "rgba(160, 220, 255, 0.95)",
        width: 42,
        life: 0.48,
        maxLife: 0.48,
        phase: 0,
      });
      return;
    }
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
    const sid = state.player.shipId;
    if (sid === "pebble") {
      abilityParticleBurst("#8899aa", 120, 72);
      const ang = Math.atan2(input.mouse.y - state.player.y, input.mouse.x - state.player.x);
      const dm = state.player.damageMultiplier * state.player.abilityDamageMultiplier;
      const sm = state.player.shotSpeedMultiplier;
      const sp = 320 * sm;
      const b = new Bullet(state.player.x, state.player.y, ang, sp, true, 30, "#6a7580", 22 * dm);
      b.pebbleBoulder = true;
      b.visualShape = "spikedBoulder";
      b.wallBounceInfinite = true;
      b.maxRebounds = 1;
      b.rebounds = 0;
      b.verticalReboundOnly = false;
      b.gravityDrop = 0;
      b.infinitePierce = true;
      b.life = 5;
      b.noTrail = true;
      b._pebbleNextDmg = 0;
      state.bullets.push(b);
      return;
    }
    if (sid === "buckler") {
      abilityParticleBurst("#ffb347", 100, 55);
      state.player.fortifyActive = true;
      state.player.fortifyTimer = 1.05;
      state.player.rapidVolleyActive = true;
      state.player.rapidVolleyTimer = 1.05;
      state.player.shoot(state.bullets);
      return;
    }
    if (sid === "bulwark") {
      abilityParticleBurst("#ff8c42", 130, 70);
      state.player.fortifyActive = true;
      state.player.fortifyTimer = 1.05;
      const dm = state.player.damageMultiplier * state.player.abilityDamageMultiplier;
      for (let ring = 0; ring < 3; ring++) {
        for (let i = 0; i < 28; i++) {
          const a = (i / 28) * Math.PI * 2 + ring * 0.07;
          const b = new Bullet(state.player.x, state.player.y, a, (145 + ring * 35) * state.player.shotSpeedMultiplier, true, 6.5, "#ff8c42", 6.5 * dm);
          b.visualShape = "heavyOrb";
          b.life = 1.4;
          state.bullets.push(b);
        }
      }
      return;
    }
    if (sid === "myrmidon") {
      abilityParticleBurst("#ff4444", 92, 52);
      const dm = state.player.damageMultiplier * state.player.abilityDamageMultiplier;
      const axes = [0, Math.PI / 2, Math.PI, Math.PI * 1.5];
      for (const a of axes) {
        for (let i = 0; i < 5; i++) {
          const b = new Bullet(state.player.x, state.player.y, a, (360 + i * 32) * state.player.shotSpeedMultiplier, true, 3.2, "#ff4444", 5.8 * dm);
          b.visualShape = "lineShot";
          b.life = 0.9;
          state.bullets.push(b);
        }
      }
      return;
    }
    const col = { aegis: "#ffe8b0", bulwark: "#c4b28a", halberd: "#e8d4a8", myrmidon: "#f0d060" }[sid] || "#ffe29b";
    abilityParticleBurst(col, 180, 80);
    state.player.fortifyActive = true;
    state.player.fortifyTimer = sid === "myrmidon" ? 1.05 : 10;
    const angle = Math.atan2(input.mouse.y - state.player.y, input.mouse.x - state.player.x);
    const count = sid === "myrmidon" ? 20 : 8;
    for (let i = 0; i < count; i++) {
      const spread = (i / count) * Math.PI * 2;
      state.bullets.push(
        new Bullet(state.player.x, state.player.y, angle + spread, 400 * state.player.shotSpeedMultiplier, true, 4, col, 5 * state.player.damageMultiplier * state.player.abilityDamageMultiplier)
      );
    }
  },
  blink: (cost) => {
    if (!state.running || state.upgradePending || !consumeAbilityEnergy(cost)) return;
    const sid = state.player.shipId;
    const oldX = state.player.x;
    const oldY = state.player.y;
    const angle = Math.atan2(input.mouse.y - state.player.y, input.mouse.x - state.player.x);
    const dashDistance = sid === "sparrow" ? 115 : sid === "vanguard" || sid === "lancer" || sid === "gallant" ? 135 : 180;
    const col = sid === "sparrow" ? "#ffe566" : "#d1afff";
    abilityParticleBurst(col, 100, 50);
    state.player.x = clamp(state.player.x + Math.cos(angle) * dashDistance, 20, config.width - 20);
    state.player.y = clamp(state.player.y + Math.sin(angle) * dashDistance, playerMinY(), config.height - 20);
    abilityParticleBurst(col, 100, 50);
    const x1 = oldX;
    const y1 = oldY;
    const x2 = state.player.x;
    const y2 = state.player.y;
    if (sid === "sparrow" || sid === "vanguard" || sid === "lancer" || sid === "gallant") {
      const lineDps = 52 * state.player.damageMultiplier * state.player.abilityDamageMultiplier;
      for (const enemy of state.enemies) {
        const d = pointToSegmentDistance(enemy.x, enemy.y, x1, y1, x2, y2);
        if (d < 12 + enemy.size * 0.42) {
          enemy.hp -= lineDps * 0.06;
          recordDamageDealt(lineDps * 0.06);
          enemy.fireTimer += 0.08;
        }
      }
      state.visualBeams.push({
        x1,
        y1,
        x2,
        y2,
        color: sid === "sparrow" ? "rgba(255,230,120,0.95)" : "rgba(160,210,255,0.92)",
        width: sid === "sparrow" ? 26 : 44,
        life: 0.22,
        maxLife: 0.22,
        phase: 0,
      });
    }
    for (let i = 0; i < 30; i++) {
      const t = i / 30;
      const x = oldX + (state.player.x - oldX) * t;
      const y = oldY + (state.player.y - oldY) * t;
      const p = new Particle(x, y, col);
      p.life = 0.3;
      state.particles.push(p);
    }
    const bolts = sid === "sparrow" ? 6 : 18;
    for (let i = 0; i < bolts; i++) {
      const spread = (i / bolts) * Math.PI * 2;
      state.bullets.push(new Bullet(state.player.x, state.player.y, spread, 360, true, 4, col, 7 * state.player.damageMultiplier * state.player.abilityDamageMultiplier));
    }
  },
  ghostfire: (cost) => {
    if (!state.running || state.upgradePending) return;
    if (state.player.shipId === "dart" && (state.player.dartFlockWavesLeft || 0) > 0) return;
    if (!consumeAbilityEnergy(cost)) return;
    const sid = state.player.shipId;
    if (sid === "phantom") {
      abilityParticleBurst("#e8d8ff", 110, 58);
      const ang = Math.atan2(input.mouse.y - state.player.y, input.mouse.x - state.player.x);
      const b = new Bullet(state.player.x, state.player.y, ang, 520 * state.player.shotSpeedMultiplier, true, 8.2, "#d8b8ff", 4 * state.player.damageMultiplier * state.player.abilityDamageMultiplier);
      b.piercing = true;
      b.pierceCount = 14;
      b.phasePassthrough = true;
      b.visualShape = "ghostBolt";
      b.phantomPhaseBolt = true;
      b.life = 1.1;
      state.bullets.push(b);
      return;
    }
    if (sid === "dart") {
      abilityParticleBurst("#f5f8ff", 75, 44);
      const ang = Math.atan2(input.mouse.y - state.player.y, input.mouse.x - state.player.x);
      const sm = state.player.shotSpeedMultiplier;
      const dm = state.player.damageMultiplier * state.player.abilityDamageMultiplier;
      for (let i = 0; i < 6; i++) {
        const a = ang + (i - 2.5) * 0.085;
        const b = new Bullet(state.player.x, state.player.y, a, 455 * sm, true, 2.25, "#f5f8ff", 5.1 * dm);
        b.noTrail = true;
        b.visualShape = "needle";
        b.life = 1.05;
        state.bullets.push(b);
      }
      state.player.dartFlockWavesLeft = 2;
      state.player.dartFlockWaveAcc = 0;
      return;
    }
    if (sid === "knave") {
      abilityParticleBurst("#c89bff", 70, 40);
      const ang = Math.atan2(input.mouse.y - state.player.y, input.mouse.x - state.player.x);
      const speed = 500 * state.player.shotSpeedMultiplier;
      const dmg = 6.2 * state.player.damageMultiplier * state.player.abilityDamageMultiplier;
      for (let burst = 0; burst < 3; burst++) {
        const bx = state.player.x + Math.cos(ang) * burst * 12;
        const by = state.player.y + Math.sin(ang) * burst * 12;
        for (const config of [
          { color: "#c86bff", phase: 0 },
          { color: "#66a8ff", phase: Math.PI },
        ]) {
          const b = new Bullet(bx, by, ang, speed, true, 4.2, config.color, dmg);
          b.visualShape = "lineShot";
          b.sinePath = true;
          b.sineOrigin = { x: bx, y: by };
          b.sineAngle = ang;
          b.sineSpeed = speed;
          b.sineAmplitude = 10;
          b.sineFrequency = 12;
          b.sinePhase = config.phase;
          b.piercing = true;
          b.pierceCount = 6;
          b.life = 1.45;
          b.noTrail = true;
          state.bullets.push(b);
        }
      }
      return;
    }
    if (sid === "claw") {
      abilityParticleBurst("#66ff99", 95, 54);
      state.clawPawShield = {
        life: 4,
        maxLife: 4,
        radius: 132,
        yOffset: 0,
      };
      return;
    }
    if (sid === "marauder") {
      abilityParticleBurst("#cc3344", 85, 48);
      const ang = Math.atan2(input.mouse.y - state.player.y, input.mouse.x - state.player.x);
      const dm = state.player.damageMultiplier * state.player.abilityDamageMultiplier;
      const sm = state.player.shotSpeedMultiplier;
      for (let i = 0; i < 4; i++) {
        const b = new Bullet(state.player.x, state.player.y, ang + (i - 1.5) * 0.06, 440 * sm, true, 3.4, "#ee4455", 7 * dm);
        b.maxRebounds = 1;
        b.rebounds = 0;
        state.bullets.push(b);
      }
      return;
    }
    if (sid === "raven") {
      abilityParticleBurst("#4a2a6a", 100, 55);
      const dm = state.player.damageMultiplier * state.player.abilityDamageMultiplier;
      for (let i = 0; i < 6; i++) {
        const a = rng(0, Math.PI * 2);
        const b = new Bullet(state.player.x, state.player.y, a, 320 * state.player.shotSpeedMultiplier, true, 3.4, "#6b4a9a", 6.5 * dm);
        const near = getNearestEnemy(b.x, b.y);
        if (near) {
          b.tracking = true;
          b.trackingTarget = near;
          b.trackingTurnRate = 22;
        }
        state.bullets.push(b);
      }
      return;
    }
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
    if (sid === "eclipse") {
      abilityParticleBurst("#e8e0ff", 170, 78);
      const mx = clamp(input.mouse.x, 20, config.width - 20);
      const my = clamp(input.mouse.y, playerMinY(), config.height - 20);
      state.player.x = mx;
      state.player.y = my;
      abilityParticleBurst("#c9a6ff", 210, 92);
      const dm = state.player.damageMultiplier * state.player.abilityDamageMultiplier;
      const shock = new ExpandingCircle(mx, my, 255, "#c49cff", 0.58, null, null);
      shock.ringFrontDamage = 4.2 * dm;
      shock.ringFrontKnockback = 198;
      state.expandingCircles.push(shock);
      return;
    }
    if (sid === "oracle") {
      abilityParticleBurst("#d4b8ff", 160, 72);
      const oldX = state.player.x;
      const oldY = state.player.y;
      const aim = Math.atan2(input.mouse.y - oldY, input.mouse.x - oldX);
      const mx = clamp(input.mouse.x, 20, config.width - 20);
      const my = clamp(input.mouse.y, playerMinY(), config.height - 20);
      const dx = mx - oldX;
      const dy = my - oldY;
      const dist = Math.hypot(dx, dy) || 1;
      const maxDash = 440;
      const reach = Math.min(dist, maxDash);
      const nx = oldX + (dx / dist) * reach;
      const ny = oldY + (dy / dist) * reach;
      state.player.x = clamp(nx, 20, config.width - 20);
      state.player.y = clamp(ny, playerMinY(), config.height - 20);
      state.oracleForesightWings = {
        followLife: 0.52,
        maxFollow: 0.52,
        aim,
        wingLen: 162,
        wingSpread: 0.7,
        wingW: 70,
        exploded: false,
        particleAcc: 0,
      };
      abilityParticleBurst("#b8fff0", 260, 100);
      state.player.foresightTimer = 5;
      return;
    }
    if (sid === "voidwalker") {
      abilityParticleBurst("#4a2080", 170, 75);
      const oldX = state.player.x;
      const oldY = state.player.y;
      const mx = clamp(input.mouse.x, 20, config.width - 20);
      const my = clamp(input.mouse.y, playerMinY(), config.height - 20);
      const aim = Math.atan2(my - oldY, mx - oldX);
      const dist = Math.hypot(mx - oldX, my - oldY) || 1;
      const speed = 380 * state.player.shotSpeedMultiplier;
      const life = Math.min(2.85, dist / speed + 0.1);
      const dm = state.player.damageMultiplier * state.player.abilityDamageMultiplier;
      const blade = new Bullet(oldX, oldY, aim, speed, true, 14, "#6510b8", 32 * dm);
      blade.visualShape = "lineShot";
      blade.lineShot = true;
      blade.voidwalkerPhaseBlade = true;
      blade.infinitePierce = true;
      blade.life = life;
      blade.hitEllipseW = 292;
      blade.hitEllipseH = 50;
      state.player.x = mx;
      state.player.y = my;
      state.player.invincible = true;
      state.player.invincibleTimer = Math.max(state.player.invincibleTimer || 0, 0.45);
      state.player.voidwalkerVanishTimer = 0.32;
      state.bullets.push(blade);
      abilityParticleBurst("#d4b8ff", 140, 68);
      return;
    }
    const col = { oracle: "#d4b8ff", aurora: "#7dfff0", phantom: "#9b7fff", voidwalker: "#6a4a9a", eclipse: "#e8e0ff" }[sid] || "#9b7fff";
    const oldX = state.player.x;
    const oldY = state.player.y;
    abilityParticleBurst(col, 120, 60);
    const stepAim = Math.atan2(input.mouse.y - oldY, input.mouse.x - oldX);
    const dashDist = sid === "voidwalker" ? 128 : 195;
    state.player.x = clamp(oldX + Math.cos(stepAim) * dashDist, 20, config.width - 20);
    state.player.y = clamp(oldY + Math.sin(stepAim) * dashDist, playerMinY(), config.height - 20);
    abilityParticleBurst(col, 120, 60);
    if (sid === "phantom") {
      const ang = Math.atan2(input.mouse.y - state.player.y, input.mouse.x - state.player.x);
      const back = ang + Math.PI;
      for (let k = 0; k < 16; k++) {
        const t = k / 16;
        const px = oldX + (state.player.x - oldX) * t;
        const py = oldY + (state.player.y - oldY) * t;
        state.particles.push(new Particle(px, py, "rgba(200,180,255,0.45)"));
      }
      for (let i = 0; i < 5; i++) {
        state.bullets.push(
          new Bullet(state.player.x, state.player.y, back + (i - 2) * 0.12, 280 * state.player.shotSpeedMultiplier, true, 3, "rgba(180,160,255,0.5)", 4 * state.player.damageMultiplier * state.player.abilityDamageMultiplier)
        );
      }
      return;
    }
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
    if (sid === "warden") {
      abilityParticleBurst("#9dffb2", 190, 95);
      const dm = state.player.damageMultiplier * state.player.abilityDamageMultiplier;
      state.wardenJudgmentChains = {
        life: 5,
        maxLife: 5,
        dpsPool: 26 * dm,
        tickAcc: 0,
      };
      state.player.boltChannelLock = Math.max(state.player.boltChannelLock || 0, 5.05);
      return;
    }
    const prof = {
      tempest: { burst: "#fff44d", c0: "#ffffff", c1: "#ffff00", c2: "#ffaa00", hit: "#ffff00", top: 0, bolts: 12 },
      oracle: { burst: "#e0c8ff", c0: "#ffffff", c1: "#d4a8ff", c2: "#b070ff", hit: "#e6c6ff", top: 42, bolts: 14 },
      aurora: { burst: "#8ffff0", c0: "#e8ffff", c1: "#66ffe6", c2: "#3dd4ff", hit: "#7dfff4", top: 12, bolts: 11 },
      warden: { burst: "#ffe9a8", c0: "#fffacd", c1: "#ffd700", c2: "#daa520", hit: "#fff8dc", top: 0, bolts: 10 },
    }[sid] || { burst: "#ffff00", c0: "#ffffff", c1: "#ffff00", c2: "#ffaa00", hit: "#ffff00", top: 0, bolts: 12 };
    abilityParticleBurst(prof.burst, sid === "oracle" ? 280 : 150, sid === "oracle" ? 120 : 70);
    if (sid === "oracle") {
      const dm = state.player.damageMultiplier * state.player.abilityDamageMultiplier;
      const boltCount = 40;
      const hitEnemies = new Set();
      for (let pre = 0; pre < 120; pre++) {
        state.particles.push(
          new Particle(rng(0, config.width), rng(TOP_HUD_SAFE_Y, config.height), pre % 2 ? prof.c1 : prof.c2)
        );
      }
      const queue = [];
      for (let bolt = 0; bolt < boltCount; bolt++) {
        queue.push({
          spawnX: rng(28, config.width - 28),
          spawnY: TOP_HUD_SAFE_Y + rng(-18, 80),
        });
      }
      state.oracleLightningStorm = {
        queue,
        hitEnemies,
        dm,
        prof,
        acc: 0.052,
        interval: 0.052,
        perBurst: 3,
      };
      return;
    }
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
          const killI = state.enemies.indexOf(target.enemy);
          if (killI > -1) onEnemyDestroyed(target.enemy, killI);
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
    if (state.player.shipId === "specter") {
      abilityParticleBurst("#f0f0ff", 160, 80);
      state.specterPhantasm = { life: 6.5, maxLife: 6.5, spawnAcc: 0 };
      return;
    }
    if (state.player.shipId === "inferno") {
      abilityParticleBurst("#ff4500", 200, 95);
      for (let i = 0; i < 18; i++) {
        const orb = new NovaOrbiter((i / 18) * Math.PI * 2, rng(36, 90));
        orb.infernoSwarm = true;
        orb.tightOrbit = true;
        orb.life = 5.5;
        orb.maxLife = 5.5;
        state.novaOrbiters.push(orb);
      }
      return;
    }
    if (state.player.shipId === "picket") {
      abilityParticleBurst("#f0f6ff", 95, 50);
      const ang = Math.atan2(input.mouse.y - state.player.y, input.mouse.x - state.player.x);
      for (const side of [-1, 1]) {
        for (let t = 0; t < 12; t++) {
          const orbit = (t / 12) * Math.PI * 2 * side;
          const sx = state.player.x + Math.cos(orbit) * 38;
          const sy = state.player.y + Math.sin(orbit) * 24;
          const b = new Bullet(sx, sy, ang + side * 0.05, 260 * state.player.shotSpeedMultiplier, true, 3.1, "#f0f6ff", 3.6 * state.player.damageMultiplier * state.player.abilityDamageMultiplier);
          b.picketTri = true;
          b.life = 0.35 + t * 0.02;
          state.bullets.push(b);
        }
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
    const sid = state.player.shipId;
    const ang = Math.atan2(input.mouse.y - state.player.y, input.mouse.x - state.player.x);
    const dm = state.player.damageMultiplier * state.player.abilityDamageMultiplier;
    const sm = state.player.shotSpeedMultiplier;
    if (sid === "pebble") {
      abilityParticleBurst("#aab4bc", 95, 52);
      const perp = ang + Math.PI / 2;
      const step = 7;
      for (let i = 0; i < 8; i++) {
        const t = (i - 3.5) * step;
        const bx = state.player.x + Math.cos(perp) * t;
        const by = state.player.y + Math.sin(perp) * t;
        const b = new Bullet(bx, by, ang, 455 * sm, true, 4.1, "#aab4bc", 6.2 * dm);
        configurePebbleRicochetOrb(b);
        b.life = 2.2;
        state.bullets.push(b);
      }
      return;
    }
    if (sid === "dart") {
      abilityParticleBurst("#d8ecff", 88, 48);
      for (let i = 0; i < 4; i++) {
        const a = ang + (i - 1.5) * 0.19;
        const b = new Bullet(state.player.x, state.player.y, a, 400 * sm, true, 2.2, "#f7fbff", 6.4 * dm);
        b.visualShape = "needle";
        b.noTrail = true;
        b.life = 1.45;
        b.dartHomingPending = true;
        b.dartHomingArmDelay = 0.5;
        b.trackingTurnRate = 11;
        state.bullets.push(b);
      }
      return;
    }
    if (sid === "bolt") {
      abilityParticleBurst("#88ccff", 72, 42);
      const base = 24 * dm;
      const hit = [];
      let lx = state.player.x;
      let ly = state.player.y;
      const maxFirst = 540;
      const maxHop = 400;
      for (let hop = 0; hop < 10; hop++) {
        let best = null;
        let bestD = 1e9;
        const limit = hop === 0 ? maxFirst : maxHop;
        for (const en of state.enemies) {
          if (!en || en.hp <= 0 || hit.includes(en)) continue;
          const d = dist(lx, ly, en.x, en.y);
          if (d < bestD && d <= limit) {
            bestD = d;
            best = en;
          }
        }
        if (!best) break;
        hit.push(best);
        const mult = Math.pow(0.9, hop);
        const dmg = base * mult;
        best.hp -= dmg;
        recordDamageDealt(dmg);
        const poly = buildLightningPolyline(lx, ly, best.x, best.y, 11, hop * 7919 + (best.x | 0) * 13 + (best.y | 0));
        pushDecorativeLightning(poly, hop === 0 ? "rgba(170, 220, 255, 0.95)" : "rgba(130, 200, 255, 0.94)", 1.5, hop === 0 ? 3.1 : 2.9);
        lx = best.x;
        ly = best.y;
        if (best.hp <= 0) {
          const idx = state.enemies.indexOf(best);
          if (idx > -1) onEnemyDestroyed(best, idx);
        }
      }
      return;
    }
    if (sid === "wick") {
      abilityParticleBurst("#ff9a3c", 130, 68);
      const dash = 205;
      const ox = state.player.x;
      const oy = state.player.y;
      const nx = clamp(ox + Math.cos(ang) * dash, 22, config.width - 22);
      const ny = clamp(oy + Math.sin(ang) * dash, playerMinY(), config.height - 22);
      const steps = 12;
      for (let s = 1; s <= steps; s++) {
        const t = s / steps;
        state.voidTrails.push({
          x: ox + (nx - ox) * t,
          y: oy + (ny - oy) * t,
          radius: 22 + t * 20,
          life: 0.62,
          maxLife: 0.62,
          color: "rgba(255, 150, 70, 0.82)",
        });
      }
      state.player.x = nx;
      state.player.y = ny;
      for (let k = 0; k < 13; k++) {
        const a = (k / 13) * Math.PI * 2;
        const ring = new Bullet(nx, ny, a, 395 * sm, true, 2.65, "#ffe0a0", 5.4 * dm);
        ring.noTrail = true;
        ring.lineShot = true;
        ring.life = 0.88;
        state.bullets.push(ring);
      }
      return;
    }
    if (sid === "bulwark") {
      abilityParticleBurst("#ff8c42", 90, 50);
      for (let i = -3; i <= 3; i++) {
        const a = ang + i * 0.09;
        const b = new Bullet(state.player.x, state.player.y, a, 420 * sm, true, 5.5, "#ffaa55", 10 * dm);
        b.life = 0.22;
        b.lineShot = true;
        state.bullets.push(b);
      }
      return;
    }
    if (sid === "myrmidon") {
      abilityParticleBurst("#ff8844", 72, 44);
      const b = new Bullet(state.player.x, state.player.y, ang, 380 * sm, true, 5, "#ff5533", 11 * dm);
      b.maxRebounds = 2;
      b.rebounds = 0;
      b.visualShape = "shieldDisc";
      state.bullets.push(b);
      return;
    }
    if (sid === "ember") {
      abilityParticleBurst("#ff8844", 70, 42);
      const ang = Math.atan2(input.mouse.y - state.player.y, input.mouse.x - state.player.x);
      const shotSpeed = 500 * state.player.shotSpeedMultiplier;
      const baseDamage = 5.2 * state.player.damageMultiplier * state.player.abilityDamageMultiplier;
      for (let i = 0; i < 5; i++) {
        const a = ang + (i - 2) * 0.075;
        const b = new Bullet(state.player.x, state.player.y, a, shotSpeed, true, 4.2, "#ff7a45", baseDamage);
        b.burnDamage = baseDamage * 0.3;
        b.visualShape = "spark";
        b.emberEnhancedBurst = true;
        b.emberPuddle = true;
        b.life = 1.05;
        state.bullets.push(b);
      }
      return;
    }
    if (sid === "stinger") {
      abilityParticleBurst("#a8ff7a", 85, 48);
      const oldX = state.player.x;
      const oldY = state.player.y;
      state.player.x = clamp(input.mouse.x, 24, config.width - 24);
      state.player.y = clamp(input.mouse.y, playerMinY(), config.height - 24);
      const burstClaws = (cx, cy) => {
        for (let i = 0; i < 10; i++) {
          const a = (i / 10) * Math.PI * 2;
          const b = new Bullet(cx, cy, a, 440 * sm, true, 4.8, "#9dff71", 6.8 * dm);
          b.visualShape = "clawHook";
          b.knockback = 54;
          b.stingerPoison = true;
          b.stingerPoisonPerTick = 1.4 * dm;
          b.life = 1.1;
          state.bullets.push(b);
        }
      };
      burstClaws(oldX, oldY);
      burstClaws(state.player.x, state.player.y);
      return;
    }
    if (sid === "claw") {
      abilityParticleBurst("#5cff8a", 82, 45);
      const candidates = state.enemies
        .filter((e) => e && e.hp > 0)
        .sort((a, b) => dist(a.x, a.y, state.player.x, state.player.y) - dist(b.x, b.y, state.player.x, state.player.y))
        .slice(0, 5);
      for (let i = 0; i < 5; i++) {
        const target = candidates[i] || null;
        const a = target
          ? Math.atan2(target.y - state.player.y, target.x - state.player.x)
          : ang + (i - 2) * 0.18;
        const b = new Bullet(state.player.x, state.player.y, a, 420 * sm, true, 5.6, "#5cff8a", 1.6 * dm);
        b.visualShape = "pawShot";
        b.clawHoverPaw = true;
        b.clawHoverTarget = target;
        b.clawHoverDps = 5.2 * dm;
        b.clawHoverStun = 0.32;
        b.infinitePierce = true;
        b.piercing = true;
        b.life = 1;
        b.noTrail = true;
        state.bullets.push(b);
      }
      return;
    }
    if (sid === "lancer") {
      abilityParticleBurst("#66ff99", 85, 48);
      const b = new Bullet(state.player.x, state.player.y, ang, 720 * sm, true, 2.8, "#66ff99", 16 * dm);
      b.piercing = true;
      b.pierceCount = 5;
      let target = null;
      let minD = 1e9;
      for (const enemy of state.enemies) {
        const d = dist(state.player.x, state.player.y, enemy.x, enemy.y);
        if (d < minD && d < 420) {
          minD = d;
          target = enemy;
        }
      }
      if (target) {
        target.fireTimer += 1.05;
      }
      state.bullets.push(b);
      return;
    }
    if (sid === "warden") {
      abilityParticleBurst("#ffe9a8", 100, 55);
      const len = 420;
      const ex = state.player.x + Math.cos(ang) * len;
      const ey = state.player.y + Math.sin(ang) * len;
      for (const enemy of state.enemies) {
        const d = pointToSegmentDistance(enemy.x, enemy.y, state.player.x, state.player.y, ex, ey);
        if (d < 22 + enemy.size * 0.45) {
          enemy.fireTimer += 0.45;
          enemy.hp -= 42 * dm;
          recordDamageDealt(42 * dm);
        }
      }
      state.visualBeams.push({
        x1: state.player.x,
        y1: state.player.y,
        x2: ex,
        y2: ey,
        color: "rgba(255, 230, 160, 0.92)",
        width: 72,
        life: 0.35,
        maxLife: 0.35,
        phase: 0,
      });
      return;
    }
    if (sid === "glacier") {
      abilityParticleBurst("#e0ffff", 110, 58);
      const len = 520;
      const ex = state.player.x + Math.cos(ang) * len;
      const ey = state.player.y + Math.sin(ang) * len;
      for (const enemy of state.enemies) {
        const d = pointToSegmentDistance(enemy.x, enemy.y, state.player.x, state.player.y, ex, ey);
        if (d < 20 + enemy.size * 0.45) {
          enemy.fireTimer += 0.55;
          enemy.hp -= 38 * dm;
          recordDamageDealt(38 * dm);
        }
      }
      state.visualBeams.push({
        x1: state.player.x,
        y1: state.player.y,
        x2: ex,
        y2: ey,
        color: "rgba(200, 250, 255, 0.95)",
        width: 70,
        life: 0.4,
        maxLife: 0.4,
        phase: 0,
      });
      return;
    }
    if (sid === "vanguard") {
      abilityParticleBurst("#9fd4ff", 95, 52);
      let w = 14;
      const grow = 18;
      const len = 480;
      for (let step = 0; step < 6; step++) {
        const ex = state.player.x + Math.cos(ang) * len;
        const ey = state.player.y + Math.sin(ang) * len;
        for (const enemy of state.enemies) {
          const d = pointToSegmentDistance(enemy.x, enemy.y, state.player.x, state.player.y, ex, ey);
          if (d < w + enemy.size * 0.45) {
            enemy.hp -= 22 * dm;
            recordDamageDealt(22 * dm);
          }
        }
        state.visualBeams.push({
          x1: state.player.x,
          y1: state.player.y,
          x2: ex,
          y2: ey,
          color: "rgba(120, 200, 255, 0.9)",
          width: w,
          life: 0.12,
          maxLife: 0.12,
          phase: step,
        });
        w += grow;
      }
      return;
    }
    abilityParticleBurst("#ffff00", 80, 40);
    const angle = ang;
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
      state.player.infernoPyroTimer = Math.max(state.player.infernoPyroTimer || 0, 3);
      return;
    }
    if (sid === "aurora") {
      abilityParticleBurst("#7dfff0", 200, 95);
      for (let ring = 0; ring < 3; ring++) {
        const circle = new ExpandingCircle(
          state.player.x,
          state.player.y,
          160 + ring * 70,
          ring === 0 ? "#66ffe6" : ring === 1 ? "#b388ff" : "#7dffb3",
          1.05,
          (55 - ring * 8) * state.player.damageMultiplier * state.player.abilityDamageMultiplier,
          null,
          true
        );
        state.expandingCircles.push(circle);
      }
      return;
    }
    if (sid === "grimstar") {
      abilityParticleBurst("#8b62ff", 190, 90);
      state.grimstarWaves.push(new GrimstarWave());
      return;
    }
    if (sid === "aegis") {
      abilityParticleBurst("#78c0ff", 175, 85);
      for (let i = 0; i < 6; i++) {
        state.aphelionShields.push(new OrbitalAegisShield(i, 6, 3));
      }
      const pulse = new ExpandingCircle(state.player.x, state.player.y, 230, "#78c0ff", 1.05, 62 * state.player.damageMultiplier * state.player.abilityDamageMultiplier, null, true);
      state.expandingCircles.push(pulse);
      return;
    }
    if (sid === "helios") {
      abilityParticleBurst("#ffbd45", 160, 72);
      for (let i = 0; i < 3; i++) {
        const x = ((i + 1) / 4) * config.width;
        state.fireColumns.push(new FireColumn(x, 40, 2.1, 3));
        state.visualBeams.push({
          x1: x,
          y1: config.height,
          x2: x,
          y2: TOP_HUD_SAFE_Y,
          color: "rgba(255, 180, 55, 0.88)",
          width: 26,
          life: 2.1,
          maxLife: 2.1,
          phase: i,
        });
      }
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
    if (state.player.shipId === "titan") {
      abilityParticleBurst("#ff8f2a", 220, 110);
      const dm = state.player.damageMultiplier * state.player.abilityDamageMultiplier;
      const len = config.width * 0.92;
      const ex = state.player.x + Math.cos(angle) * len;
      const ey = state.player.y + Math.sin(angle) * len;
      const w = 48;
      for (const enemy of state.enemies) {
        const d = pointToSegmentDistance(enemy.x, enemy.y, state.player.x, state.player.y, ex, ey);
        if (d < w * 0.5 + enemy.size * 0.42) {
          const chunk = 95 * dm;
          enemy.hp -= chunk;
          recordDamageDealt(chunk);
        }
      }
      state.visualBeams.push({
        x1: state.player.x,
        y1: state.player.y,
        x2: ex,
        y2: ey,
        color: "rgba(255, 140, 60, 0.92)",
        width: w,
        life: 0.45,
        maxLife: 0.45,
        phase: 0,
      });
      return;
    }
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
    const sid = state.player.shipId;
    const aim = Math.atan2(input.mouse.y - state.player.y, input.mouse.x - state.player.x);
    if (sid === "bulwark") {
      abilityParticleBurst("#ffaa55", 110, 60);
      const centerX = state.player.x + Math.cos(aim) * 55;
      const centerY = state.player.y + Math.sin(aim) * 55;
      const wall = new Barrier(centerX, centerY, aim);
      wall.length = 155;
      wall.width = 18;
      wall.life = 2;
      wall.maxLife = 2;
      wall.color = "#ffaa55";
      state.barriers.push(wall);
      state.player.infiniteShield = true;
      state.player.infiniteShieldTimer = 2.2;
      state.player.shieldColorOverride = "rgba(255, 170, 80, 0.85)";
      state.player.shieldColorTimer = 2.2;
      return;
    }
    if (sid === "aegis") {
      abilityParticleBurst("#78c0ff", 150, 75);
      const wall = new Barrier(state.player.x, state.player.y + 32, 0);
      wall.length = 340;
      wall.width = 22;
      wall.life = 4.9;
      wall.maxLife = 4.9;
      wall.color = "#78c0ff";
      wall.riseVy = -200;
      wall.aegisBulwark = true;
      state.barriers.push(wall);
      state.player.shieldColorOverride = "rgba(120, 192, 255, 0.9)";
      state.player.shieldColorTimer = 2;
      return;
    }
    if (sid === "picket") {
      abilityParticleBurst("#f0f6ff", 90, 50);
      const centerX = state.player.x + Math.cos(aim) * 40;
      const centerY = state.player.y + Math.sin(aim) * 40;
      const tri = new Barrier(centerX, centerY, aim);
      tri.length = 56;
      tri.width = 18;
      tri.life = 2;
      tri.maxLife = 2;
      tri.color = "#f0f6ff";
      state.barriers.push(tri);
      return;
    }
    if (sid === "eclipse") {
      abilityParticleBurst("#dcc8ff", 175, 88);
      const L = Math.min(config.width * 0.82, 580);
      const cx = clamp(state.player.x, 70, config.width - 70);
      const cy = clamp(state.player.y - 76, TOP_HUD_SAFE_Y + 72, config.height - 72);
      const aim = 0;
      state.pendingEclipseUmbralWall = { cx, cy, aim, L };
      return;
    }
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
    if (state.player.shipId === "titan") {
      abilityParticleBurst("#ff8833", 320, 140);
      state.player.titanFuryTimer = 9;
      state.player.burstTimer = Math.max(state.player.burstTimer, 4);
      state.player.rapidTimer = Math.max(state.player.rapidTimer, 4);
      playSfx.ability();
      return;
    }
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
    if (sid === "seraph") {
      abilityParticleBurst("#ff2a2a", 150, 80);
      const base = angle;
      for (let k = 0; k < 4; k++) {
        const a = base + (k / 4) * Math.PI * 2 + rng(-0.12, 0.12);
        state.seraphBounceLasers.push(
          new SeraphBounceLaser(
            state.player.x + Math.cos(a) * 14,
            state.player.y + Math.sin(a) * 14,
            a
          )
        );
      }
      return;
    }
    if (sid === "aphelion") {
      const holeX = state.player.x + Math.cos(angle) * 175;
      const holeY = state.player.y + Math.sin(angle) * 175;
      emitSpiralInwardParticles(holeX, holeY, "#8d4dff", 10, 82, 205, 1.2, 0.82);
      emitSpiralInwardParticles(holeX, holeY, "#bb85ff", 8, 72, 182, -1.05, 0.75);
      state.novaAnomalies.push(
        new NovaAnomaly(holeX, holeY, {
          maxRadius: 270,
          duration: 3.4,
          pullStrength: 460,
          damagePerSecond: 128 * state.player.damageMultiplier * state.player.abilityDamageMultiplier,
          pullEnabled: true,
          explodeAtEnd: true,
          explosionDamage: 340 * state.player.damageMultiplier * state.player.abilityDamageMultiplier,
          explosionKnockback: 520,
          knockbackRadius: 430,
          color: "#7e42ff",
          stunWhilePulled: true,
          azureVortex: true,
          aphelionCollapse: true,
          streamColors: ["#a36cff", "#c291ff", "#7c4cff"],
        })
      );
      return;
    }
    if (sid === "voidwalker") {
      abilityParticleBurst("#5a2a90", 280, 105);
      const dm = state.player.damageMultiplier * state.player.abilityDamageMultiplier;
      const cx = config.width * 0.5;
      const cy = (TOP_HUD_SAFE_Y + config.height) * 0.5;
      const playH = config.height - TOP_HUD_SAFE_Y;
      const screenR = Math.hypot(config.width, playH) * 0.58;
      emitSpiralInwardParticles(cx, cy, "#5a2d88", 12, 88, 300, 1.12, 0.82);
      emitSpiralInwardParticles(cx, cy, "#2a1040", 9, 72, 240, -1.08, 0.7);
      state.novaAnomalies.push(
        new NovaAnomaly(cx, cy, {
          maxRadius: screenR * 1.08,
          pullRadius: screenR * 1.35,
          duration: 3.05,
          pullStrength: 540,
          damagePerSecond: 76 * dm,
          pullEnabled: true,
          explodeAtEnd: true,
          explosionDamage: 235 * dm,
          explosionKnockback: 580,
          knockbackRadius: screenR * 1.42,
          color: "#3a1580",
          stunWhilePulled: true,
          voidwalkerHorizon: true,
        })
      );
      return;
    }
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
    if (state.player.shipId === "knave") {
      abilityParticleBurst("#c86bff", 105, 58);
      const count = 6;
      const x = config.width * 0.5;
      const baseY = config.height - 20;
      const spacing = 18;
      const a = Math.atan2(input.mouse.y - state.player.y, input.mouse.x - state.player.x);
      const speed = 420 * state.player.shotSpeedMultiplier;
      const dmg = 7.6 * state.player.damageMultiplier * state.player.abilityDamageMultiplier;
      for (let i = 0; i < count; i++) {
        const y = baseY - i * spacing;
        const b = new Bullet(x, y, a, speed, true, 5.8, "#bf83ff", dmg);
        b.wobbleAmp = 0.14;
        b.visualShape = "raggedShard";
        b.knaveSteal = true;
        b.life = 2.6;
        state.bullets.push(b);
      }
      return;
    }
    const oldX = state.player.x;
    const oldY = state.player.y;
    abilityParticleBurst("#9b7fff", 100, 50);
    const angle =
      state.player.shipId === "knave"
        ? Math.atan2(input.mouse.y - state.player.y, input.mouse.x - state.player.x) + Math.PI
        : Math.atan2(input.mouse.y - state.player.y, input.mouse.x - state.player.x);
    state.player.x = clamp(state.player.x + Math.cos(angle) * 120, 20, config.width - 20);
    state.player.y = clamp(state.player.y + Math.sin(angle) * 120, playerMinY(), config.height - 20);
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
    const sid = state.player.shipId;
    if (sid === "raven") {
      abilityParticleBurst("#7b3fe0", 180, 92);
      const dm = state.player.damageMultiplier * state.player.abilityDamageMultiplier;
      state.ravenOmenSwarm = {
        life: 4,
        spawnAcc: 0,
        spawned: 0,
        maxSpawn: 40,
        spawnInterval: 0.1,
        damage: 7.2 * dm,
      };
      return;
    }
    abilityParticleBurst(sid === "specter" ? "#f0f0ff" : "#8b0000", 150, 70);
    
    let target = null;
    let minDist = Infinity;
    for (const enemy of state.enemies) {
      const d = dist(state.player.x, state.player.y, enemy.x, enemy.y);
      if (d < minDist && d < 400) {
        minDist = d;
        target = enemy;
      }
    }
    if (sid === "reaper") {
      const a = Math.atan2(input.mouse.y - state.player.y, input.mouse.x - state.player.x);
      abilityParticleBurst("#ff2222", 120, 60);
      applyScytheSwing(
        state.player.x,
        state.player.y,
        a,
        340,
        (Math.PI * 2) / 3,
        118 * state.player.damageMultiplier * state.player.abilityDamageMultiplier,
        95,
        "#ff2222",
        null,
        {
          showHandle: true,
          handleLength: 58,
          pivotArcBlendRadius: 200,
        }
      );
      return;
    }
    if (sid === "specter") {
      abilityParticleBurst("#ffffff", 230, 100);
      state.specterBladeStorm = { life: 5, maxLife: 5, spawnAcc: 0 };
      return;
    }
    if (target) {
      if (sid === "stinger") {
        abilityParticleBurst("#9dff71", 110, 60);
        state.stingerPoisonFogs = state.stingerPoisonFogs || [];
        state.stingerPoisonFogs.push({
          x: state.player.x,
          y: state.player.y,
          life: 16,
          maxLife: 16,
          startRadius: 120,
          radius: 120,
          maxRadius: 900,
          tick: 0,
          tickRate: 0.5,
          damagePerTick: 4.4 * state.player.damageMultiplier * state.player.abilityDamageMultiplier,
        });
        return;
      }
      target.deathMarked = true;
      target.deathMarkTimer = sid === "stinger" ? 6 : 8;
      const angle = Math.atan2(target.y - state.player.y, target.x - state.player.x);
      const count = sid === "stinger" ? 4 : 8;
      for (let i = 0; i < count; i++) {
        const spread = (i - (count - 1) / 2) * 0.16;
        const bullet = new Bullet(
          state.player.x,
          state.player.y,
          angle + spread,
          500 * state.player.shotSpeedMultiplier,
          true,
          5,
          sid === "stinger" ? "#88ff66" : "#8b0000",
          10 * state.player.damageMultiplier * state.player.abilityDamageMultiplier
        );
        bullet.tracking = true;
        bullet.trackingTarget = target;
        if (sid === "stinger") {
          bullet.burnDamage = 4 * state.player.damageMultiplier * state.player.abilityDamageMultiplier;
        }
        state.bullets.push(bullet);
      }
    }
  },
  soulHarvest: (cost) => {
    if (!state.running || state.upgradePending || !consumeAbilityEnergy(cost)) return;
    if (state.player.shipId === "reaper") {
      const ang = Math.atan2(input.mouse.y - state.player.y, input.mouse.x - state.player.x);
      abilityParticleBurst("#660022", 170, 85);
      for (const offset of [-72, 72]) {
        const px = state.player.x + Math.cos(ang + Math.PI / 2) * offset + Math.cos(ang) * 80;
        const py = state.player.y + Math.sin(ang + Math.PI / 2) * offset + Math.sin(ang) * 80;
        state.reaperPortals.push(new ReaperPortal(px, py, offset < 0 ? -1 : 1));
      }
      return;
    }
    if (state.player.shipId === "marauder") {
      abilityParticleBurst("#cc3344", 100, 55);
      let target = null;
      let minD = 1e9;
      for (const enemy of state.enemies) {
        const d = dist(state.player.x, state.player.y, enemy.x, enemy.y);
        if (d < minD && d < 320) {
          minD = d;
          target = enemy;
        }
      }
      if (target) {
        const dm = state.player.damageMultiplier * state.player.abilityDamageMultiplier;
        const steal = 18 * dm;
        target.hp -= steal;
        recordDamageDealt(steal);
        state.player.hp = Math.min(state.player.maxHp, state.player.hp + 4);
        state.visualBeams.push({
          x1: state.player.x,
          y1: state.player.y,
          x2: target.x,
          y2: target.y,
          color: "rgba(255, 80, 100, 0.9)",
          width: 12,
          life: 0.32,
          maxLife: 0.32,
          phase: 0,
        });
        for (let i = 0; i < 14; i++) {
          const p = new Particle(target.x + rng(-10, 10), target.y + rng(-10, 10), i % 2 ? "#ff4466" : "#ffaa88");
          p.life = 0.35;
          p.vx = rng(-40, 40);
          p.vy = rng(-40, 40);
          state.particles.push(p);
        }
        if (target.hp <= 0) {
          const idx = state.enemies.indexOf(target);
          if (idx > -1) onEnemyDestroyed(target, idx);
        }
      }
      return;
    }
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
    const prevEnergy = state.player.energy;
    const prevShield = state.player.shield;
    state.player.energy = Math.min(state.player.energy + energyRestore, state.player.maxEnergy);
    state.player.shield = Math.min(state.player.shield + shieldRestore, state.player.maxShield);
    recordEnergyRegen(state.player.energy - prevEnergy);
    recordShieldRegen(state.player.shield - prevShield);
  },
  supernova: (cost) => {
    if (!state.running || state.upgradePending || !consumeAbilityEnergy(cost)) return;
    const sid = state.player.shipId;
    if (sid === "seraph") {
      const vCount = 4;
      const xStep = config.width / (vCount + 1);
      for (let i = 1; i <= vCount; i++) {
        state.screenLasers.push(
          new ScreenLaser({
            orientation: "vertical",
            x: i * xStep,
            width: 18,
            life: 2.5,
            color: "rgba(255, 40, 40, 1)",
            damagePerSecond: 220,
          })
        );
      }
      const hCount = 3;
      const yStep = (config.height - TOP_HUD_SAFE_Y) / (hCount + 1);
      for (let j = 1; j <= hCount; j++) {
        state.screenLasers.push(
          new ScreenLaser({
            orientation: "horizontal",
            y: TOP_HUD_SAFE_Y + j * yStep,
            width: 26,
            life: 2.5,
            delay: 1,
            color: "rgba(255, 55, 55, 1)",
            damagePerSecond: 300,
          })
        );
      }
      abilityParticleBurst("#ff3d3d", 220, 120);
      return;
    }
    if (sid === "nova") {
      emitNovaShellParticles(state.player.x, state.player.y, "#ffffff", "#e8ffff", 10, 88);
      state.novaAnomalies.push(
        new NovaAnomaly(state.player.x, state.player.y, {
          maxRadius: 300,
          duration: 2.35,
          pullStrength: 290,
          damagePerSecond: 88 * state.player.damageMultiplier * state.player.abilityDamageMultiplier,
          pullEnabled: true,
          explodeAtEnd: true,
          explosionDamage: 260 * state.player.damageMultiplier * state.player.abilityDamageMultiplier,
          explosionKnockback: 420,
          knockbackRadius: 360,
          color: "#ffffff",
          stunWhilePulled: true,
        })
      );
      abilityParticleBurst("#ffffff", 200, 110);
      return;
    }
    if (sid === "eclipse") {
      const dm = state.player.damageMultiplier * state.player.abilityDamageMultiplier;
      const tickDm = 3.2 * dm;
      for (let ei = state.enemies.length - 1; ei >= 0; ei--) {
        const enemy = state.enemies[ei];
        if (!enemy || enemy.hp <= 0) continue;
        enemy.hp -= tickDm;
        recordDamageDealt(tickDm);
        enemy.fireTimer += 0.14;
        if (enemy.hp <= 0) onEnemyDestroyed(enemy, ei);
      }
      state.enemyBullets.length = 0;
      state.eclipseTotality = {
        x: state.player.x,
        y: state.player.y,
        life: 5,
        maxLife: 5,
        lowDamageTick: tickDm,
        _tickAcc: 0,
      };
      for (let i = 0; i < 48; i++) {
        const a = (i / 48) * Math.PI * 2;
        state.particles.push(new Particle(state.player.x + Math.cos(a) * 40, state.player.y + Math.sin(a) * 40, i % 2 ? "#ff66ff" : "#ffffff"));
      }
      abilityParticleBurst("#ff99ff", 280, 150);
      return;
    }
    if (sid === "oracle") {
      const dm = state.player.damageMultiplier * state.player.abilityDamageMultiplier;
      const tickDm = 7.2 * dm;
      for (let ei = state.enemies.length - 1; ei >= 0; ei--) {
        const enemy = state.enemies[ei];
        if (!enemy || enemy.hp <= 0) continue;
        enemy.hp -= tickDm;
        recordDamageDealt(tickDm);
        if (enemy.hp <= 0) onEnemyDestroyed(enemy, ei);
      }
      state.oracleChronos = {
        life: 5.5,
        maxLife: 5.5,
        handAngle: -Math.PI / 2,
        tickAcc: 0,
        tickDamage: tickDm,
        driftSpeed: 58,
        particleAcc: 0,
      };
      for (let i = 0; i < 96; i++) {
        state.particles.push(
          new Particle(
            rng(0, config.width),
            rng(TOP_HUD_SAFE_Y, config.height),
            i % 3 === 0 ? "#c8a8ff" : i % 3 === 1 ? "#6a3d9a" : "#f0e8ff"
          )
        );
      }
      abilityParticleBurst("#b070ff", 420, 195);
      return;
    }
    if (sid === "helios") {
      abilityParticleBurst("#fff4c2", 140, 62);
      for (let i = 0; i < 3; i++) {
        const t = i / 2 - 0.5;
        const x = clamp(state.player.x + t * 200, 55, config.width - 55);
        const y = clamp(state.player.y + Math.sin(i * 1.7) * 40, TOP_HUD_SAFE_Y + 55, config.height - 55);
        state.solarFlares.push(
          new SolarFlareEmitter(x, y, {
            life: 2.6,
            emitInterval: 0.072,
            perTickFlames: 2,
            flameSpeedMin: 95,
            flameSpeedMax: 260,
            flameLifeMin: 0.28,
            flameLifeMax: 0.62,
          })
        );
      }
      return;
    }
    if (sid === "glacier") {
      emitNovaShellParticles(state.player.x, state.player.y, "#b8ecff", "#ffffff", 9, 78);
      state.novaAnomalies.push(
        new NovaAnomaly(state.player.x, state.player.y, {
          maxRadius: 280,
          duration: 2.45,
          pullStrength: 200,
          damagePerSecond: 70 * state.player.damageMultiplier * state.player.abilityDamageMultiplier,
          pullEnabled: true,
          explodeAtEnd: true,
          explosionDamage: 210 * state.player.damageMultiplier * state.player.abilityDamageMultiplier,
          explosionKnockback: 260,
          knockbackRadius: 300,
          color: "#c8f4ff",
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
    if (sid === "raven") {
      abilityParticleBurst("#7b3fe0", 220, 110);
      const dm = state.player.damageMultiplier * state.player.abilityDamageMultiplier;
      state.ravenUnkindnessRush = {
        life: 4.5,
        maxLife: 4.5,
        speed: 1280,
        explosionRadius: 270,
        explosionDamage: 96 * dm,
        explosionKnockback: 235,
        pathDamage: 26 * dm,
        pathWidth: 78,
        pathSideKnockback: 112,
        particleAcc: 0,
        particleInterval: 0.055,
        explodePending: false,
        hitMap: {},
      };
      state.ravenUnkindnessField = [];
      state.player.invincible = true;
      state.player.invincibleTimer = Math.max(state.player.invincibleTimer || 0, 4.6);
      return;
    }
    if (sid === "aphelion") {
      abilityParticleBurst("#e8d4ff", 120, 70);
      const bottomY = config.height - 26;
      const span = config.width - 200;
      const count = 5;
      for (let i = 0; i < count; i++) {
        const t = count === 1 ? 0.5 : i / (count - 1);
        const px = 100 + t * span + rng(-14, 14);
        state.aphelionKeelPortals.push(new AphelionKeelPortal(clamp(px, 72, config.width - 72), bottomY));
      }
      return;
    }
    if (sid === "helios") {
      abilityParticleBurst("#ffb347", 110, 52);
      const ang = Math.atan2(input.mouse.y - state.player.y, input.mouse.x - state.player.x);
      const px = clamp(state.player.x + Math.cos(ang) * 150, 65, config.width - 65);
      const py = clamp(state.player.y + Math.sin(ang) * 150, TOP_HUD_SAFE_Y + 65, config.height - 65);
      state.novaAnomalies.push(
        new NovaAnomaly(px, py, {
          maxRadius: 310,
          duration: 4.4,
          pullStrength: 0,
          damagePerSecond: 54 * state.player.damageMultiplier * state.player.abilityDamageMultiplier,
          pullEnabled: false,
          explodeAtEnd: false,
          color: "#ff5a2a",
          opacityScale: 0.62,
          stunWhilePulled: false,
        })
      );
      for (let i = 0; i < 48; i++) {
        const a = rng(0, Math.PI * 2);
        const p = new Particle(px + Math.cos(a) * rng(12, 120), py + Math.sin(a) * rng(12, 95), Math.random() < 0.5 ? "#ff4a1f" : "#ffbd45");
        p.life = rng(0.25, 0.55);
        state.particles.push(p);
      }
      return;
    }
    if (sid === "inferno") {
      abilityParticleBurst("#ff7a2a", 240, 115);
      const dm = state.player.damageMultiplier * state.player.abilityDamageMultiplier;
      const circle = new ExpandingCircle(state.player.x, state.player.y, 360, "#ff6b1a", 1.12, 62 * dm, null, true);
      circle.infernoIgniteDuration = 5;
      circle.infernoIgniteDps = 13 * dm;
      state.expandingCircles.push(circle);
      for (let i = 0; i < 64; i++) {
        const a = (i / 64) * Math.PI * 2;
        state.particles.push(
          new Particle(state.player.x + Math.cos(a) * rng(20, 120), state.player.y + Math.sin(a) * rng(20, 120), Math.random() < 0.5 ? "#ff8833" : "#ffcc66")
        );
      }
      return;
    }
    if (sid === "grimstar") {
      abilityParticleBurst("#c9a6ff", 150, 85);
      const cx = clamp(input.mouse.x, 70, config.width - 70);
      const cy = clamp(input.mouse.y, TOP_HUD_SAFE_Y + 70, config.height - 70);
      state.novaAnomalies.push(
        new NovaAnomaly(cx, cy, {
          maxRadius: 155,
          duration: 1.45,
          pullStrength: 110,
          damagePerSecond: 42 * state.player.damageMultiplier * state.player.abilityDamageMultiplier,
          pullEnabled: true,
          explodeAtEnd: true,
          explosionDamage: 110 * state.player.damageMultiplier * state.player.abilityDamageMultiplier,
          explosionKnockback: 180,
          knockbackRadius: 220,
          color: "#4a2080",
          stunWhilePulled: true,
        })
      );
      for (let i = 0; i < 28; i++) {
        const a = (i / 28) * Math.PI * 2;
        const shard = new Bullet(cx + Math.cos(a) * 36, cy + Math.sin(a) * 36, a + rng(-0.14, 0.14), rng(250, 430) * state.player.shotSpeedMultiplier, true, rng(3.5, 7), "#8b62ff", 8.5 * state.player.damageMultiplier * state.player.abilityDamageMultiplier);
        shard.visualShape = "starShot";
        shard.grimstarTrail = true;
        shard.life = 1.75;
        state.bullets.push(shard);
      }
      return;
    }
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
    if (state.player.shipId === "voidwalker") {
      abilityParticleBurst("#6a3d9a", 130, 70);
      const dm = state.player.damageMultiplier * state.player.abilityDamageMultiplier;
      const blade = new Bullet(
        state.player.x,
        state.player.y,
        angle,
        420 * state.player.shotSpeedMultiplier,
        true,
        8.6,
        "#a070ff",
        12.5 * dm
      );
      blade.visualShape = "voidArcBlade";
      blade.voidwalkerRiftBlade = true;
      blade.infinitePierce = true;
      blade.life = 1.75;
      blade._riftBaseSize = 8.6;
      blade._riftBaseEW = 178;
      blade._riftBaseEH = 28;
      blade.hitEllipseW = blade._riftBaseEW;
      blade.hitEllipseH = blade._riftBaseEH;
      blade.grimstarTrail = true;
      blade.thinPurpleTrail = true;
      state.bullets.push(blade);
      return;
    }
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
    const sid = state.player.shipId;
    if (sid === "specter") {
      abilityParticleBurst("#f8f8ff", 220, 110);
      const dm = state.player.damageMultiplier * state.player.abilityDamageMultiplier;
      const cw = config.width;
      const cx = cw / 2;
      const cy = (TOP_HUD_SAFE_Y + config.height) / 2;
      const thick = 46;
      const dmg = 46 * dm;
      const kb = 36;
      const applySlash = (skew) => {
        const xA = 0;
        const yA = cy + Math.tan(skew) * (0 - cx);
        const xB = cw;
        const yB = cy + Math.tan(skew) * (cw - cx);
        for (let ei = state.enemies.length - 1; ei >= 0; ei--) {
          const en = state.enemies[ei];
          if (!en || en.hp <= 0) continue;
          const d = pointToSegmentDistance(en.x, en.y, xA, yA, xB, yB);
          if (d > thick * 0.5 + en.size * 0.48) continue;
          en.hp -= dmg;
          recordDamageDealt(dmg);
          const nx = -Math.sin(skew);
          const ny = Math.cos(skew);
          const side = (en.y - cy) * ny + (en.x - cx) * nx > 0 ? 1 : -1;
          en.x += nx * kb * side * 0.85;
          en.y += ny * kb * side * 0.85;
          en.x = clamp(en.x, en.size, config.width - en.size);
          en.y = clamp(en.y, TOP_HUD_SAFE_Y + en.size, config.height - en.size);
          if (en.hp <= 0) onEnemyDestroyed(en, ei);
        }
        state.visualBeams.push({
          x1: xA,
          y1: yA,
          x2: xB,
          y2: yB,
          color: "rgba(252, 248, 255, 0.92)",
          width: thick,
          life: 0.42,
          maxLife: 0.42,
          phase: skew * 10,
        });
      };
      applySlash(0.078);
      applySlash(-0.078);
      return;
    }
    if (sid === "reaper") {
      abilityParticleBurst("#ff2222", 180, 100);
      const targets = [...state.enemies]
        .filter((enemy) => enemy.hp > 0)
        .sort((a, b) => dist(state.player.x, state.player.y, a.x, a.y) - dist(state.player.x, state.player.y, b.x, b.y));
      for (const target of targets) {
        state.reaperChains.push(new ReaperChain(target));
      }
      return;
    }
    if (sid === "seraph") {
      state.player.seraphSweepTimer = 6;
      abilityParticleBurst("#ff4f4f", 180, 90);
      return;
    }
    if (sid === "aphelion") {
      abilityParticleBurst("#b480ff", 170, 80);
      state.aphelionShields = [];
      for (let i = 0; i < 5; i++) {
        state.aphelionShields.push(new OrbitalAegisShield(i, 5, 6.75));
      }
      return;
    }
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
