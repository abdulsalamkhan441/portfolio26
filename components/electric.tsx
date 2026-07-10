"use client";

import { useEffect, useRef } from "react";

const GRID_SIZE = 48;
const MAX_DEVICE_PIXEL_RATIO = 1.5;


interface Vec2 {
  x: number;
  y: number;
}

type Direction = 0 | 1 | 2 | 3; 

const DIRECTION_VECTORS: Record<Direction, Vec2> = {
  0: { x: 0, y: -1 },
  1: { x: 1, y: 0 },
  2: { x: 0, y: 1 },
  3: { x: -1, y: 0 },
};

function oppositeDirection(dir: Direction): Direction {
  return ((dir + 2) % 4) as Direction;
}

function turnLeft(dir: Direction): Direction {
  return ((dir + 3) % 4) as Direction;
}

function turnRight(dir: Direction): Direction {
  return ((dir + 1) % 4) as Direction;
}

function randomRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function randomInt(min: number, max: number): number {
  return Math.floor(randomRange(min, max + 1));
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}


const hexToRgbCache = new Map<string, [number, number, number]>();
function hexToRgb(hex: string): [number, number, number] {
  const cached = hexToRgbCache.get(hex);
  if (cached) return cached;
  const normalized = hex.replace("#", "");
  const bigint = parseInt(
    normalized.length === 3
      ? normalized
          .split("")
          .map((c) => c + c)
          .join("")
      : normalized,
    16
  );
  const rgb: [number, number, number] = [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
  hexToRgbCache.set(hex, rgb);
  return rgb;
}

function rgba(rgb: [number, number, number], alpha: number): string {
  return `rgba(${rgb[0]}, ${rgb[1]}, ${rgb[2]}, ${clamp(alpha, 0, 1)})`;
}


function midpointDisplace(
  a: Vec2,
  b: Vec2,
  roughness: number,
  iterations: number,
  out: Vec2[]
): void {
  if (iterations <= 0) {
    out.push(b);
    return;
  }
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len; 
  const ny = dx / len;
  const offset = (Math.random() - 0.5) * 2 * roughness;
  const mid: Vec2 = {
    x: (a.x + b.x) / 2 + nx * offset,
    y: (a.y + b.y) / 2 + ny * offset,
  };
  midpointDisplace(a, mid, roughness * 0.55, iterations - 1, out);
  midpointDisplace(mid, b, roughness * 0.55, iterations - 1, out);
}

function generateBoltPath(from: Vec2, to: Vec2, roughness: number, iterations: number): Vec2[] {
  const points: Vec2[] = [from];
  midpointDisplace(from, to, roughness, iterations, points);
  return points;
}



interface BranchProbabilities {
  straight: number;
  turnLeft: number;
  turnRight: number;
  split: number;
  die: number;
}

interface EngineConfig {
  branchProbabilities: BranchProbabilities;
  branchProbabilityGenerationDecay: number;
  maxSparks: number;
  maxGeneration: number;
  ambientIgnitionChance: number;
  rowScanChance: number;
  columnScanChance: number;
  wholeGridFlashChance: number;
  chainReactionChance: number;
  hoverBurstDelayMs: number;
  trailFadeAlpha: number;
}

const DEFAULT_CONFIG: EngineConfig = {
  branchProbabilities: {
    straight: 0.45,
    turnLeft: 0.16,
    turnRight: 0.16,
    split: 0.13,
    die: 0.1,
  },
  branchProbabilityGenerationDecay: 0.14,
  maxSparks: 180,
  maxGeneration: 5,
  ambientIgnitionChance: 0.045,
  rowScanChance: 0.006,
  columnScanChance: 0.006,
  wholeGridFlashChance: 0.0018,
  chainReactionChance: 0.22,
  hoverBurstDelayMs: 2000,
  trailFadeAlpha: 0.24,
};



class GridNode {
  readonly col: number;
  readonly row: number;
  readonly x: number;
  readonly y: number;
  glow = 0;
  pulsePhase: number;

  constructor(col: number, row: number, x: number, y: number) {
    this.col = col;
    this.row = row;
    this.x = x;
    this.y = y;
    this.pulsePhase = Math.random() * Math.PI * 2;
  }

  charge(amount: number): void {
    this.glow = clamp(this.glow + amount, 0, 1.6);
  }

  update(dtMs: number): void {
    this.glow = Math.max(0, this.glow - dtMs * 0.0022);
    this.pulsePhase += dtMs * 0.004;
  }

  isDim(): boolean {
    return this.glow <= 0.01;
  }
}



class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  readonly maxLife: number;
  readonly size: number;
  readonly color: string;

  constructor(x: number, y: number, color: string, dust = false) {
    this.x = x;
    this.y = y;
    const speed = dust ? randomRange(0.08, 0.3) : randomRange(0.5, 1.8);
    const angle = randomRange(0, Math.PI * 2);
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.maxLife = dust ? randomRange(500, 1100) : randomRange(120, 320);
    this.life = this.maxLife;
    this.size = dust ? randomRange(0.3, 0.8) : randomRange(0.5, 1.4);
    this.color = color;
  }

  update(dtMs: number): void {
    this.x += this.vx * (dtMs / 16.67);
    this.y += this.vy * (dtMs / 16.67);
    this.vx *= 0.98;
    this.vy *= 0.98;
    this.life -= dtMs;
  }

  get alpha(): number {
    return clamp(this.life / this.maxLife, 0, 1);
  }

  isDead(): boolean {
    return this.life <= 0;
  }
}



interface TrailPoint {
  x: number;
  y: number;
  age: number;
}

let sparkIdCounter = 0;

class Spark {
  readonly id: number;
  col: number;
  row: number;
  dir: Direction;
  targetCol: number;
  targetRow: number;
  progress = 0;
  speed: number;
  thickness: number;
  generation: number;
  color: string;
  trail: TrailPoint[] = [];
  dead = false;
  ttlMs: number;
  isScanner: boolean;

  
  boltPath: Vec2[] = [];
  private boltRefreshMs = 0;

  
  private flickerValue = 1;

  constructor(
    col: number,
    row: number,
    dir: Direction,
    generation: number,
    color: string,
    speedMul = 1,
    isScanner = false
  ) {
    this.id = sparkIdCounter++;
    this.col = col;
    this.row = row;
    this.dir = dir;
    const vec = DIRECTION_VECTORS[dir];
    this.targetCol = col + vec.x;
    this.targetRow = row + vec.y;
    this.speed = randomRange(4, 8) * speedMul;
    this.thickness = randomRange(0.7, 1.6) * (1 - generation * 0.12);
    this.generation = generation;
    this.color = color;
    this.ttlMs = randomRange(2600, 5200);
    this.isScanner = isScanner;
    this.regenerateBoltPath();
  }

  originPixel(): Vec2 {
    return { x: this.col * GRID_SIZE, y: this.row * GRID_SIZE };
  }

  targetPixel(): Vec2 {
    return { x: this.targetCol * GRID_SIZE, y: this.targetRow * GRID_SIZE };
  }

  
  regenerateBoltPath(): void {
    const roughness = this.isScanner ? 1 : 2.6;
    const iterations = this.isScanner ? 1 : 2;
    this.boltPath = generateBoltPath(this.originPixel(), this.targetPixel(), roughness, iterations);
    this.boltRefreshMs = randomRange(60, 140);
  }

  
  getTruncatedPath(progress: number): Vec2[] {
    const points = this.boltPath;
    const n = points.length;
    if (n < 2) return points;
    const p = clamp(progress, 0, 1);
    const result: Vec2[] = [points[0]];
    for (let i = 1; i < n; i++) {
      const t = i / (n - 1);
      if (t <= p) {
        result.push(points[i]);
      } else {
        const prevT = (i - 1) / (n - 1);
        const span = t - prevT || 1;
        const localT = clamp((p - prevT) / span, 0, 1);
        const prev = points[i - 1];
        const next = points[i];
        result.push({ x: lerp(prev.x, next.x, localT), y: lerp(prev.y, next.y, localT) });
        break;
      }
    }
    return result;
  }

  currentHeadPixel(): Vec2 {
    const path = this.getTruncatedPath(this.progress);
    return path[path.length - 1];
  }

  flickerAlpha(): number {
    return this.flickerValue;
  }

  update(dtMs: number): void {
    this.progress += (this.speed * dtMs) / 1000;
    this.ttlMs -= dtMs;

   
    this.flickerValue += (Math.random() - 0.5) * 0.5 * (dtMs / 16.67);
    this.flickerValue = clamp(this.flickerValue, 0.35, 1);
    if (Math.random() < 0.02) this.flickerValue = randomRange(0.15, 0.4);

   
    this.boltRefreshMs -= dtMs;
    if (this.boltRefreshMs <= 0) this.regenerateBoltPath();

    const head = this.currentHeadPixel();
    this.trail.push({ x: head.x, y: head.y, age: 0 });
    if (this.trail.length > 10) this.trail.shift();
    for (const p of this.trail) p.age += dtMs;

    if (this.ttlMs <= 0) this.dead = true;
  }

  hasArrived(): boolean {
    return this.progress >= 1;
  }
}



class Renderer {
  private ctx: CanvasRenderingContext2D;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  
  fadeFrame(width: number, height: number, fadeAlpha: number): void {
    this.ctx.globalCompositeOperation = "source-over";
    this.ctx.fillStyle = `rgba(13, 14, 18, ${fadeAlpha})`;
    this.ctx.fillRect(0, 0, width, height);
  }

  
  beginAdditivePass(): void {
    this.ctx.globalCompositeOperation = "lighter";
  }

  wholeGridFlash(width: number, height: number, intensity: number, color: string): void {
    const rgb = hexToRgb(color);
    this.ctx.fillStyle = rgba(rgb, intensity * 0.12);
    this.ctx.fillRect(0, 0, width, height);
  }

  drawNodeGlow(node: GridNode, color: string): void {
    if (node.isDim()) return;
    const rgb = hexToRgb(color);
    const pulse = 0.9 + 0.1 * Math.sin(node.pulsePhase);
    const radius = 1.4 + node.glow * 4.2 * pulse;

   
    const gradient = this.ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, radius * 1.8);
    gradient.addColorStop(0, rgba(rgb, node.glow * 0.55));
    gradient.addColorStop(0.5, rgba(rgb, node.glow * 0.18));
    gradient.addColorStop(1, rgba(rgb, 0));
    this.ctx.fillStyle = gradient;
    this.ctx.beginPath();
    this.ctx.arc(node.x, node.y, radius * 1.8, 0, Math.PI * 2);
    this.ctx.fill();

   
    this.ctx.fillStyle = rgba([255, 255, 255], Math.min(1, node.glow) * 0.9);
    this.ctx.beginPath();
    this.ctx.arc(node.x, node.y, Math.max(0.4, radius * 0.16), 0, Math.PI * 2);
    this.ctx.fill();
  }

  
  drawBoltPath(points: Vec2[], color: string, thickness: number, alpha: number): void {
    if (points.length < 2 || alpha < 0.01) return;
    const rgb = hexToRgb(color);
    const tail = points[0];
    const head = points[points.length - 1];

    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";

    const strokePolyline = (): void => {
      this.ctx.beginPath();
      this.ctx.moveTo(points[0].x, points[0].y);
      for (let i = 1; i < points.length; i++) this.ctx.lineTo(points[i].x, points[i].y);
    };

   
    this.ctx.globalAlpha = clamp(alpha * 0.16, 0, 1);
    this.ctx.strokeStyle = rgba(rgb, 1);
    this.ctx.lineWidth = Math.max(0.5, thickness * 6);
    strokePolyline();
    this.ctx.stroke();

   
    this.ctx.globalAlpha = clamp(alpha * 0.32, 0, 1);
    this.ctx.lineWidth = Math.max(0.4, thickness * 2.4);
    strokePolyline();
    this.ctx.stroke();

   
    const gradient = this.ctx.createLinearGradient(tail.x, tail.y, head.x, head.y);
    gradient.addColorStop(0, rgba(rgb, alpha * 0.7));
    gradient.addColorStop(0.7, rgba(rgb, alpha * 0.9));
    gradient.addColorStop(1, rgba([255, 255, 255], alpha));
    this.ctx.shadowColor = rgba(rgb, 0.7);
    this.ctx.shadowBlur = 2;
    this.ctx.globalAlpha = 1;
    this.ctx.strokeStyle = gradient;
    this.ctx.lineWidth = Math.max(0.3, thickness * 0.5);
    strokePolyline();
    this.ctx.stroke();
    this.ctx.shadowBlur = 0;
  }

  
  drawSparkTrail(spark: Spark, nowMs: number): void {
    if (spark.trail.length < 2) return;
    const rgb = hexToRgb(spark.color);
    this.ctx.lineCap = "round";

    for (let i = 1; i < spark.trail.length; i++) {
      const a = spark.trail[i - 1];
      const b = spark.trail[i];
      const fade = 1 - b.age / 260;
      if (fade <= 0) continue;
      this.ctx.strokeStyle = rgba(rgb, fade * 0.35);
      this.ctx.lineWidth = Math.max(0.2, spark.thickness * fade * 0.8);
      this.ctx.beginPath();
      this.ctx.moveTo(a.x, a.y);
      this.ctx.lineTo(b.x, b.y);
      this.ctx.stroke();
    }
    void nowMs;
  }

  drawParticle(particle: Particle): void {
    const rgb = hexToRgb(particle.color);
    this.ctx.fillStyle = rgba(rgb, particle.alpha);
    this.ctx.beginPath();
    this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
    this.ctx.fill();
  }
}



interface MouseState {
  x: number;
  y: number;
  active: boolean;
  hoverStartMs: number;
  lastCol: number;
  lastRow: number;
}

class ElectricGridEngine {
  private renderer: Renderer;
  private width = 0;
  private height = 0;
  private cols = 0;
  private rows = 0;
  private nodes = new Map<string, GridNode>();
  private sparks: Spark[] = [];
  private particles: Particle[] = [];
  private config: EngineConfig;
  private color: string;
  private mouse: MouseState = {
    x: -1,
    y: -1,
    active: false,
    hoverStartMs: 0,
    lastCol: -1,
    lastRow: -1,
  };
  private nowMs = 0;
  private lastPruneMs = 0;

  constructor(ctx: CanvasRenderingContext2D, width: number, height: number, color: string) {
    this.renderer = new Renderer(ctx);
    this.color = color;
    this.config = DEFAULT_CONFIG;
    this.resize(width, height);
  }

  resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    this.cols = Math.ceil(width / GRID_SIZE) + 1;
    this.rows = Math.ceil(height / GRID_SIZE) + 1;
  }

  private nodeKey(col: number, row: number): string {
    return `${col}:${row}`;
  }

  private getNode(col: number, row: number): GridNode {
    const key = this.nodeKey(col, row);
    let node = this.nodes.get(key);
    if (!node) {
      node = new GridNode(col, row, col * GRID_SIZE, row * GRID_SIZE);
      this.nodes.set(key, node);
    }
    return node;
  }

  private inBounds(col: number, row: number): boolean {
    return col >= 0 && col <= this.cols && row >= 0 && row <= this.rows;
  }

  private nearestNode(x: number, y: number): { col: number; row: number } {
    return {
      col: clamp(Math.round(x / GRID_SIZE), 0, this.cols),
      row: clamp(Math.round(y / GRID_SIZE), 0, this.rows),
    };
  }

  

  private spawnSpark(
    col: number,
    row: number,
    dir: Direction,
    generation: number,
    speedMul = 1,
    isScanner = false
  ): void {
    if (this.sparks.length >= this.config.maxSparks) return;
    const vec = DIRECTION_VECTORS[dir];
    if (!this.inBounds(col + vec.x, row + vec.y)) return;
    this.sparks.push(new Spark(col, row, dir, generation, this.color, speedMul, isScanner));
  }

  private spawnParticlesAt(x: number, y: number, count: number, dust = false): void {
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle(x, y, this.color, dust));
    }
  }

  
  spawnExplosion(x: number, y: number): void {
    const { col, row } = this.nearestNode(x, y);
    const node = this.getNode(col, row);
    node.charge(1.4);

    const cardinals: Direction[] = [0, 1, 2, 3];
    for (const dir of cardinals) {
      this.spawnSpark(col, row, dir, 0, 1.4);
    }

   
   
    const diagonalPairs: [Direction, Direction][] = [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
    ];
    for (const [a] of diagonalPairs) {
     
     
      this.spawnSpark(col, row, a, 1, 1.1);
    }

    this.spawnParticlesAt(node.x, node.y, 12, false);
    this.spawnParticlesAt(node.x, node.y, 8, true);
  }

  
  private updateHoverCharge(dtMs: number): void {
    if (!this.mouse.active) return;
    const { col, row } = this.nearestNode(this.mouse.x, this.mouse.y);
    const node = this.getNode(col, row);

    if (col !== this.mouse.lastCol || row !== this.mouse.lastRow) {
      this.mouse.lastCol = col;
      this.mouse.lastRow = row;
      this.mouse.hoverStartMs = this.nowMs;
    }

    node.charge(dtMs * 0.0009);

    const hoverDuration = this.nowMs - this.mouse.hoverStartMs;
    if (hoverDuration >= this.config.hoverBurstDelayMs) {
      this.spawnExplosion(node.x, node.y);
      this.mouse.hoverStartMs = this.nowMs;
    }
  }

  

  private spawnAmbient(): void {
    const cfg = this.config;

    if (Math.random() < cfg.ambientIgnitionChance) {
      const col = randomInt(0, this.cols);
      const row = randomInt(0, this.rows);
      const dir = randomInt(0, 3) as Direction;
      this.spawnSpark(col, row, dir, 0);
      this.getNode(col, row).charge(0.6);
    }

    if (Math.random() < cfg.rowScanChance) {
      const row = randomInt(0, this.rows);
      const dir: Direction = Math.random() < 0.5 ? 1 : 3;
      const col = dir === 1 ? 0 : this.cols;
      this.spawnSpark(col, row, dir, 0, 1.6, true);
    }

    if (Math.random() < cfg.columnScanChance) {
      const col = randomInt(0, this.cols);
      const dir: Direction = Math.random() < 0.5 ? 2 : 0;
      const row = dir === 2 ? 0 : this.rows;
      this.spawnSpark(col, row, dir, 0, 1.6, true);
    }

    if (Math.random() < cfg.wholeGridFlashChance) {
      this.gridFlashIntensity = 1;
    }
  }

  private gridFlashIntensity = 0;

  

  private onSparkArrive(spark: Spark): Spark[] {
    const node = this.getNode(spark.targetCol, spark.targetRow);
    node.charge(0.5 + spark.thickness * 0.15);
    this.spawnParticlesAt(node.x, node.y, randomInt(1, 3), false);

   
    if (Math.random() < this.config.chainReactionChance * 0.3) {
      const dir = randomInt(0, 3) as Direction;
      this.spawnSpark(spark.targetCol, spark.targetRow, dir, spark.generation + 1);
    }

    const newSparks: Spark[] = [];
    const col = spark.targetCol;
    const row = spark.targetRow;

   
    if (spark.isScanner) {
      const vec = DIRECTION_VECTORS[spark.dir];
      if (this.inBounds(col + vec.x, row + vec.y)) {
        spark.col = col;
        spark.row = row;
        spark.targetCol = col + vec.x;
        spark.targetRow = row + vec.y;
        spark.progress = 0;
        spark.regenerateBoltPath();
        return [spark];
      }
      spark.dead = true;
      return [];
    }

    if (spark.generation >= this.config.maxGeneration) {
      spark.dead = true;
      return [];
    }

    const decay = spark.generation * this.config.branchProbabilityGenerationDecay;
    const base = this.config.branchProbabilities;
    const weights = {
      straight: Math.max(0.05, base.straight - decay * 0.3),
      turnLeft: Math.max(0.03, base.turnLeft - decay * 0.15),
      turnRight: Math.max(0.03, base.turnRight - decay * 0.15),
      split: Math.max(0, base.split - decay * 0.6),
      die: base.die + decay * 0.6,
    };
    const total =
      weights.straight + weights.turnLeft + weights.turnRight + weights.split + weights.die;
    let roll = Math.random() * total;

    const pick = (label: keyof typeof weights): boolean => {
      if (roll < weights[label]) return true;
      roll -= weights[label];
      return false;
    };

    if (pick("die")) {
      spark.dead = true;
      return [];
    }

    if (pick("split")) {
      const left = turnLeft(spark.dir);
      const right = turnRight(spark.dir);
      spark.col = col;
      spark.row = row;
      spark.dir = left;
      const vecLeft = DIRECTION_VECTORS[left];
      spark.targetCol = col + vecLeft.x;
      spark.targetRow = row + vecLeft.y;
      spark.progress = 0;
      spark.generation += 1;
      spark.regenerateBoltPath();
      if (this.inBounds(spark.targetCol, spark.targetRow)) {
        newSparks.push(spark);
      } else {
        spark.dead = true;
      }

      const vecRight = DIRECTION_VECTORS[right];
      if (this.inBounds(col + vecRight.x, row + vecRight.y) && this.sparks.length < this.config.maxSparks) {
        newSparks.push(
          new Spark(col, row, right, spark.generation, spark.color, 1, false)
        );
      }
      node.charge(0.4);
      return newSparks;
    }

    let nextDir: Direction = spark.dir;
    if (pick("turnLeft")) nextDir = turnLeft(spark.dir);
    else if (pick("turnRight")) nextDir = turnRight(spark.dir);
   

    const vec = DIRECTION_VECTORS[nextDir];
    if (!this.inBounds(col + vec.x, row + vec.y)) {
     
      nextDir = oppositeDirection(nextDir);
    }
    const bounceVec = DIRECTION_VECTORS[nextDir];
    if (!this.inBounds(col + bounceVec.x, row + bounceVec.y)) {
      spark.dead = true;
      return [];
    }

    spark.col = col;
    spark.row = row;
    spark.dir = nextDir;
    spark.targetCol = col + bounceVec.x;
    spark.targetRow = row + bounceVec.y;
    spark.progress = 0;
    spark.regenerateBoltPath();
    return [spark];
  }

  

  update(dtMs: number): void {
    this.nowMs += dtMs;
    const dt = Math.min(dtMs, 48);

    this.spawnAmbient();
    this.updateHoverCharge(dt);

   
   
    for (const node of this.nodes.values()) {
      if (!node.isDim()) node.update(dt);
    }

   
    const nextSparks: Spark[] = [];
    for (const spark of this.sparks) {
      spark.update(dt);
      if (spark.dead) continue;
      if (spark.hasArrived()) {
        const resolved = this.onSparkArrive(spark);
        nextSparks.push(...resolved);
      } else {
        nextSparks.push(spark);
      }
    }
    this.sparks = nextSparks;

   
    for (const particle of this.particles) particle.update(dt);
    this.particles = this.particles.filter((p) => !p.isDead());

   
    if (this.gridFlashIntensity > 0) {
      this.gridFlashIntensity = Math.max(0, this.gridFlashIntensity - dt * 0.003);
    }

   
   
   
   
    if (this.nowMs - this.lastPruneMs > 4000) {
      for (const [key, node] of this.nodes) {
        if (node.isDim()) this.nodes.delete(key);
      }
      this.lastPruneMs = this.nowMs;
    }
  }

  

  setMouse(x: number, y: number, active: boolean): void {
    this.mouse.x = x;
    this.mouse.y = y;
    this.mouse.active = active;
  }

  setMouseInactive(): void {
    this.mouse.active = false;
  }

  

  render(): void {
    this.renderer.fadeFrame(this.width, this.height, this.config.trailFadeAlpha);
    this.renderer.beginAdditivePass();

    if (this.gridFlashIntensity > 0) {
      this.renderer.wholeGridFlash(this.width, this.height, this.gridFlashIntensity, this.color);
    }

    for (const node of this.nodes.values()) {
      this.renderer.drawNodeGlow(node, this.color);
    }

    for (const spark of this.sparks) {
      this.renderer.drawSparkTrail(spark, this.nowMs);
      const path = spark.getTruncatedPath(spark.progress);
      this.renderer.drawBoltPath(path, spark.color, spark.thickness, spark.flickerAlpha());
    }

    for (const particle of this.particles) {
      this.renderer.drawParticle(particle);
    }
  }
}



interface ElectricGridProps {
  sparkColor?: string;
}

export default function ElectricGrid({ sparkColor = "#00f0ff" }: ElectricGridProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<ElectricGridEngine | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
 
 
 
 
  const runningRef = useRef(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const parent = canvas.parentElement;

    const getSize = (): { width: number; height: number } => ({
      width: parent?.clientWidth ?? window.innerWidth,
      height: parent?.clientHeight ?? window.innerHeight,
    });

    const applyCanvasSize = (width: number, height: number): void => {
     
     
     
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DEVICE_PIXEL_RATIO);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const { width, height } = getSize();
    applyCanvasSize(width, height);

    const engine = new ElectricGridEngine(ctx, width, height, sparkColor);
    engineRef.current = engine;

    const handleResize = (): void => {
      const size = getSize();
      applyCanvasSize(size.width, size.height);
      engine.resize(size.width, size.height);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    if (parent) resizeObserver.observe(parent);

    const handleMouseMove = (event: MouseEvent): void => {
      const rect = canvas.getBoundingClientRect();
      engine.setMouse(event.clientX - rect.left, event.clientY - rect.top, true);
    };

    const handleMouseLeave = (): void => {
      engine.setMouseInactive();
    };

    const handleClick = (event: MouseEvent): void => {
      const rect = canvas.getBoundingClientRect();
      engine.spawnExplosion(event.clientX - rect.left, event.clientY - rect.top);
    };

    canvas.style.pointerEvents = "auto";
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);
    canvas.addEventListener("mousedown", handleClick);

   
   
   
   
   
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let tabVisible = document.visibilityState === "visible";
    let inViewport = true;
    const updateRunning = (): void => {
      runningRef.current = !reducedMotion && tabVisible && inViewport;
    };
    updateRunning();

    const handleVisibilityChange = (): void => {
      tabVisible = document.visibilityState === "visible";
      updateRunning();
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        inViewport = entry.isIntersecting;
        updateRunning();
      },
      { threshold: 0 }
    );
    if (parent) intersectionObserver.observe(parent);

    const loop = (timestamp: number): void => {
      if (!lastTimeRef.current) lastTimeRef.current = timestamp;
      const dt = timestamp - lastTimeRef.current;
      lastTimeRef.current = timestamp;

      if (runningRef.current) {
        engine.update(dt);
        engine.render();
      }

      rafRef.current = window.requestAnimationFrame(loop);
    };
    rafRef.current = window.requestAnimationFrame(loop);

    return () => {
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
      canvas.removeEventListener("mousedown", handleClick);
      engineRef.current = null;
      lastTimeRef.current = 0;
    };
  }, [sparkColor]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "auto",
        zIndex: -1,
        backgroundColor: "transparent",
      }}
    />
  );
}