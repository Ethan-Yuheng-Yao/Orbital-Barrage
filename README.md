# Orbital Barrage

Orbital Barrage is a neon-themed 2D space shooter built with HTML5 Canvas, Vanilla JavaScript, and CSS.  
The game includes multiple progression modes, a large ship roster, achievements, unlockable ships, and dynamic ability-based combat.

## Core Features

- **Hub Menu Flow**: Start from a central menu with Campaign, Endless, Tutorial, Shop, Instructions, Settings, and Achievements access. Choose your ship from the horizontal strip on the Endless setup screen.
- **Endless Mode**: Choose Recruit, Veteran, or Nightmare and push for high waves/scores.
- **Campaign Mode**: Structured level progression with locked levels, scaling difficulty, and boss-focused milestones.
- **Large Ship Roster**: Many ships across tiers with unique base stats and ability combinations.
- **Ability System**: Each ship has 3 active abilities with energy costs.
- **Wave Upgrades**: Select permanent run upgrades between waves.
- **Boss Encounters**: Distinct boss variants with different movement and attack patterns.
- **Currency + Unlocks**: Earn Quantum Cores, purchase ships, and persist unlock progress in local storage.
- **Achievements**: Track and unlock progression/combat milestones.
- **Audio Support**: Procedural SFX plus looping MP3 background music support.

## Controls

- **WASD** / **Arrow Keys**: Move
- **Mouse**: Aim
- **Left Mouse**: Fire primary weapon
- **1 / 2 / 3** (or custom binds): Abilities
- **P**: Pause / settings access

## Audio File Setup

Background music is loaded from:

- `audio/BackgroundAudio.mp3`

Make sure the file exists at that exact path if you want MP3 BGM playback.

## Running the Game

1. Open `index.html` in a modern browser.
2. Use the hub menu to choose mode/options.
3. Play, unlock ships, and progress campaign/endless milestones.

## Project Stack

- HTML5 Canvas
- Vanilla JavaScript
- CSS3

## Notes

- Progress (high score, ship unlocks, quantum cores, achievements, bindings) is stored in browser local storage.
- This is a browser game project; no build step is required for basic local play.

## Recent Gameplay Updates

- **Ship roster cleanup**: Removed several legacy ships from the active roster and selection flow.
- **Bolt / Pebble redesigns**: Reworked ability behavior and visuals for stronger role identity.
- **Knave refresh**: Updated basic attack behavior plus all three skills for distinct curve, burst, and lane pressure patterns.
- **Ember overhaul**: New area and fireball-focused toolkit with persistent burn zones and rebalanced damage.
- **Stinger overhaul**: New poison-stack identity with visible poison state, teleport burst, spiral claw pattern, and expanding poison fog.
- **Claw overhaul**: Paw-themed attacks and utility kit with stun, target pressure paws, and defensive paw shield interactions.

