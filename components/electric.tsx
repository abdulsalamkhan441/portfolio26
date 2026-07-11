"use client";

import { useEffect, useRef } from "react";

/* ============================================================================
 * ElectricGrid
 * ----------------------------------------------------------------------------
 * A grid-locked, AAA-sci-fi electricity engine rendered on <canvas>.
 *
 * All electricity travels strictly along a 48x48px grid (horizontal / vertical
 * segments between intersections only). "Diagonal" bursts (explosions, corner
 * branches) are approximated as two-segment L-shaped paths made of two
 * grid-aligned sparks, since true diagonal travel is not possible on an
 * orthogonal grid — this preserves the "grid lines only" rule while still
 * reading visually as an eight-direction burst.
 *
 * Architecture:
 *   GridNode            -> a single intersection: position + glow/flash state
 *   Particle            -> tiny drifting spark/dust particle
 *   Spark               -> a traveling arc that moves node-to-node and makes
 *                          decisions (straight / turn / split / die) at
 *                          every intersection it reaches
 *   Renderer            -> all canvas drawing (multi-pass glow, bloom, trails)
 *   ElectricGridEngine   -> owns node/spark/particle state, ambient behavior,
 *                          mouse interaction, and the update/render loop
 *
 * PERFORMANCE NOTES (read this before "simplifying" the renderer back):
 *   - devicePixelRatio is capped (MAX_DEVICE_PIXEL_RATIO) because canvas cost
 *     scales with actual pixel count, and shadowBlur cost scales again on
 *     top of that on high-DPI screens.
 *   - ctx.shadowBlur is only used for one small, cheap pass (the spark core).
 *     The two "glow" passes that used to use shadowBlur now fake the same
 *     soft halo with wide, low-alpha additive strokes instead — shadowBlur
 *     is drastically more expensive per primitive than a plain stroke.
 *   - save()/restore() around every single draw call was removed. All the
 *     "glow" draws share the same composite mode ("lighter"), so it's set
 *     once per frame instead of push/popped per node/spark/particle.
 *   - hexToRgb() is memoized since the same color strings get parsed
 *     hundreds of times per frame otherwise.
 * ==========================================================================*/

const GRID_SIZE = 48;
const MAX_DEVICE_PIXEL_RATIO = 1.5;

/* ---------------------------------------------------------------------------
 * Basic math / color helpers
 * ------------------------------------------------------------------------- */

interface Vec2 {
  x: number;
  y: number;
}

type Direction = 0 | 1 | 2 | 3; // 0 = up, 1 = right, 2 = down, 3 = left

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

// Memoized: the same handful of color strings get parsed hundreds of times
// per frame (once per node/spark/particle draw), so cache the result.
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

/** Recursive midpoint displacement: the standard technique for realistic
 * lightning geometry. Each subdivision nudges the midpoint sideways by a
 * shrinking random amount, producing a jagged (not smoothly wiggling) path. */
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
  const nx = -dy / len; // unit perpendicular
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

/* ---------------------------------------------------------------------------
 * Tunable configuration (feature: "probabilities should be configurable")
 * ------------------------------------------------------------------------- */

interface BranchProbabilities {
  straight: number;
  turnLeft: number;
  turnRight: number;
  split: number;
  die: number;
}

interface EngineConfig {
  branchProbabilities: BranchProbabilities;
  branchProbabilityGenerationDecay: number; // reduces split/continue odds per generation
  maxSparks: number;
  maxGeneration: number;
  ambientIgnitionChance: number; // per-frame chance to fire a random node
  rowScanChance: number;
  columnScanChance: number;
  wholeGridFlashChance: number;
  chainReactionChance: number;
  hoverBurstDelayMs: number;
  trailFadeAlpha: number; // motion-blur strength
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

/* ============================================================================
 * GridNode
 * ==========================================================================*/

class GridNode {
  readonly col: number;
  readonly row: number;
  readonly x: number;
  readonly y: number;
  glow = 0; // junction flash intensity, 0..1
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

/* ============================================================================
 * Particle (micro sparks / electric dust)
 * ==========================================================================*/

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

/* ============================================================================
 * Spark — travels strictly node-to-node along grid lines
 * ==========================================================================*/

interface TrailPoint {
  x: number;
  y: number;
  age: number; // ms since recorded
}

let sparkIdCounter = 0;

class Spark {
  readonly id: number;
  col: number;
  row: number;
  dir: Direction;
  targetCol: number;
  targetRow: number;
  progress = 0; // 0..1 along current edge
  speed: number; // grid cells per second
  thickness: number;
  generation: number;
  color: string;
  trail: TrailPoint[] = [];
  dead = false;
  ttlMs: number; // safety cap so ambient sparks can't wander forever
  isScanner: boolean; // row/column scan sparks travel in a straight line only

  /** Jagged geometry for the current node-to-node segment, generated by
   * midpoint displacement. Re-struck periodically (boltRefreshMs) rather
   * than smoothly animated, which is what real arc discharge looks like. */
  boltPath: Vec2[] = [];
  private boltRefreshMs = 0;

  /** Irregular flicker driven by a clamped random walk with occasional
   * dropouts, instead of a smooth sine wave. */
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

  /** Regenerates the jagged path for the current segment. Call whenever the
   * segment's endpoints change, and periodically mid-flight for re-strike. */
  regenerateBoltPath(): void {
    const roughness = this.isScanner ? 1 : 2.6;
    const iterations = this.isScanner ? 1 : 2;
    this.boltPath = generateBoltPath(this.originPixel(), this.targetPixel(), roughness, iterations);
    this.boltRefreshMs = randomRange(60, 140);
  }

  /** Returns the jagged path truncated to the current travel progress, with
   * the final point interpolated exactly at the head. */
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

    // Irregular flicker: small random walk plus rare hard dropouts.
    this.flickerValue += (Math.random() - 0.5) * 0.5 * (dtMs / 16.67);
    this.flickerValue = clamp(this.flickerValue, 0.35, 1);
    if (Math.random() < 0.02) this.flickerValue = randomRange(0.15, 0.4);

    // Periodic re-strike of the segment geometry.
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

/* ============================================================================
 * Renderer — all canvas drawing, multi-pass glow / bloom / additive blending
 *
 * All methods below assume the caller has already set
 * ctx.globalCompositeOperation to the right blend mode for the frame (see
 * ElectricGridEngine.render()). None of them save()/restore() around
 * individual draws anymore — that was hundreds of state-stack push/pops per
 * frame for state that was identical across every single draw call.
 * ==========================================================================*/

class Renderer {
  private ctx: CanvasRenderingContext2D;
  // Pre-rendered soft-circle sprite reused for every node's glow, instead of
  // calling createRadialGradient() fresh for every node, every frame. Built
  // lazily the first time a color is needed and cached by color string.
  private glowSprite: HTMLCanvasElement | null = null;
  private glowSpriteColor: string | null = null;
  private readonly glowSpriteDiameter = 160;

  constructor(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
  }

  private getGlowSprite(color: string): HTMLCanvasElement {
    if (this.glowSprite && this.glowSpriteColor === color) return this.glowSprite;

    const size = this.glowSpriteDiameter;
    const sprite = document.createElement("canvas");
    sprite.width = size;
    sprite.height = size;
    const sctx = sprite.getContext("2d");
    if (sctx) {
      const rgb = hexToRgb(color);
      const cx = size / 2;
      const cy = size / 2;
      const r = size / 2;

      // Same three-stop falloff as the original per-node gradient, baked
      // once at full intensity — actual per-node brightness is applied via
      // globalAlpha when the sprite is stamped down.
      const gradient = sctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      gradient.addColorStop(0, rgba(rgb, 0.55));
      gradient.addColorStop(0.5, rgba(rgb, 0.18));
      gradient.addColorStop(1, rgba(rgb, 0));
      sctx.fillStyle = gradient;
      sctx.beginPath();
      sctx.arc(cx, cy, r, 0, Math.PI * 2);
      sctx.fill();

      // pinpoint white-hot core, baked in at the same relative size/strength
      sctx.fillStyle = rgba([255, 255, 255], 0.9);
      sctx.beginPath();
      sctx.arc(cx, cy, r * 0.09, 0, Math.PI * 2);
      sctx.fill();
    }

    this.glowSprite = sprite;
    this.glowSpriteColor = color;
    return sprite;
  }

  /** Persistent fading trails + motion blur: instead of a hard clear, paint a
   * translucent rect over the previous frame so everything fades smoothly. */
  /** Persistent fading trails + motion blur: erase a slice of existing alpha
   * every frame instead of painting an opaque color over the canvas.
   *
   * BUG FIX: this used to fillRect with rgba(13,14,18, fadeAlpha) under
   * normal ("source-over") blending, on the assumption that the page's
   * background was exactly #0d0e12. That assumption compounds badly: with
   * source-over, every pixel's alpha ratchets UP toward fully opaque each
   * frame — after ~10 frames it's ~93% of the way to a solid, opaque
   * rgb(13,14,18) rectangle sitting on top of the real page background.
   * If the actual background isn't that exact color (or is a gradient),
   * you get a mismatched flat panel — that's the "foggy gray" box.
   * destination-out instead erases existing alpha without assuming or
   * painting any particular color, so the canvas genuinely fades toward
   * transparent and the real page background always shows through. */
  fadeFrame(width: number, height: number, fadeAlpha: number): void {
    this.ctx.globalCompositeOperation = "destination-out";
    this.ctx.fillStyle = `rgba(0, 0, 0, ${fadeAlpha})`;
    this.ctx.fillRect(0, 0, width, height);
  }

  /** Switches the context into additive blending for the rest of the frame's
   * glow/spark/particle draws. Called once per frame instead of per draw. */
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
    const pulse = 0.9 + 0.1 * Math.sin(node.pulsePhase);
    const radius = 1.4 + node.glow * 4.2 * pulse;
    const sprite = this.getGlowSprite(color);
    const drawSize = radius * 1.8 * 2; // matches the previous outer-gradient diameter

    this.ctx.globalAlpha = clamp(node.glow, 0, 1);
    this.ctx.drawImage(sprite, node.x - drawSize / 2, node.y - drawSize / 2, drawSize, drawSize);
    this.ctx.globalAlpha = 1;
  }

  /** Draws a jagged bolt path (not a straight line) in three tight additive
   * passes, with a real linear gradient on the core pass running from the
   * segment's tail (spark color) to its traveling head (white-hot).
   *
   * The two outer "glow" passes used to use ctx.shadowBlur, which is one of
   * the most expensive Canvas2D primitives — multiplied by up to
   * maxSparks × 2 shadow calls, every frame, it was the single biggest cost
   * in this renderer. They're faked here with wide, low-alpha additive
   * strokes instead, which reads as the same soft halo for a fraction of
   * the cost. Only the small core pass keeps a (cheap, small-radius)
   * shadowBlur, since that's what gives the head its crisp hot pinpoint. */
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

    // Pass 1: wide, faint additive stroke standing in for the outer glow
    this.ctx.globalAlpha = clamp(alpha * 0.16, 0, 1);
    this.ctx.strokeStyle = rgba(rgb, 1);
    this.ctx.lineWidth = Math.max(0.5, thickness * 6);
    strokePolyline();
    this.ctx.stroke();

    // Pass 2: mid glow
    this.ctx.globalAlpha = clamp(alpha * 0.32, 0, 1);
    this.ctx.lineWidth = Math.max(0.4, thickness * 2.4);
    strokePolyline();
    this.ctx.stroke();

    // Pass 3: colored core stroke, plus a short white-hot "cap" right at the
    // traveling head. Approximates the previous per-frame linear-gradient
    // look (color at the tail, white at the head) without allocating a new
    // gradient object for every spark, every single frame — with up to
    // maxSparks sparks in flight that was a lot of gradient construction.
    this.ctx.globalAlpha = alpha;
    this.ctx.strokeStyle = rgba(rgb, alpha);
    this.ctx.lineWidth = Math.max(0.3, thickness * 0.5);
    strokePolyline();
    this.ctx.stroke();

    const capStart = points.length >= 3 ? points[points.length - 2] : tail;
    this.ctx.shadowColor = rgba(rgb, 0.7);
    this.ctx.shadowBlur = 2;
    this.ctx.strokeStyle = rgba([255, 255, 255], alpha);
    this.ctx.beginPath();
    this.ctx.moveTo(capStart.x, capStart.y);
    this.ctx.lineTo(head.x, head.y);
    this.ctx.stroke();
    this.ctx.shadowBlur = 0; // reset so trails/particles drawn after aren't blurred too
  }

  /** Draws a spark's short crackling trail as a sequence of jittered segments,
   * fading from the head backward. */
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

/* ============================================================================
 * ElectricGridEngine — owns state, ambient behavior, interaction, loop
 * ==========================================================================*/

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

  /* --------------------------- Spark spawning --------------------------- */

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

  /** Explosion burst approximating eight directions on an orthogonal grid:
   * four true cardinal sparks, plus four "diagonal" sparks built as an
   * L-shaped pair of grid-aligned segments (still grid-lines-only motion). */
  spawnExplosion(x: number, y: number): void {
    const { col, row } = this.nearestNode(x, y);
    const node = this.getNode(col, row);
    node.charge(1.4);

    const cardinals: Direction[] = [0, 1, 2, 3];
    for (const dir of cardinals) {
      this.spawnSpark(col, row, dir, 0, 1.4);
    }

    // Diagonal approximation: pair up adjacent cardinal directions so the
    // burst reads as 8-way while every individual spark stays grid-locked.
    const diagonalPairs: [Direction, Direction][] = [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 0],
    ];
    for (const [a] of diagonalPairs) {
      // Slight delay-free "elbow": spawn one spark that will naturally turn
      // at the next intersection thanks to the branch-probability system.
      this.spawnSpark(col, row, a, 1, 1.1);
    }

    this.spawnParticlesAt(node.x, node.y, 12, false);
    this.spawnParticlesAt(node.x, node.y, 8, true);
  }

  /** Mouse-hover charging: builds glow at the nearest node; after the
   * configured delay, triggers a burst there. */
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
      this.mouse.hoverStartMs = this.nowMs; // reset so it doesn't spam
    }
  }

  /* ---------------------------- Ambient life ---------------------------- */

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

  /* ------------------------ Spark decision logic ------------------------ */

  private onSparkArrive(spark: Spark): Spark[] {
    const node = this.getNode(spark.targetCol, spark.targetRow);
    node.charge(0.5 + spark.thickness * 0.15);
    this.spawnParticlesAt(node.x, node.y, randomInt(1, 3), false);

    // Chain reaction: this junction may ignite an independent fresh spark.
    if (Math.random() < this.config.chainReactionChance * 0.3) {
      const dir = randomInt(0, 3) as Direction;
      this.spawnSpark(spark.targetCol, spark.targetRow, dir, spark.generation + 1);
    }

    const newSparks: Spark[] = [];
    const col = spark.targetCol;
    const row = spark.targetRow;

    // Straight-line scanners just keep going until they leave the canvas.
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
    // else straight: keep spark.dir

    const vec = DIRECTION_VECTORS[nextDir];
    if (!this.inBounds(col + vec.x, row + vec.y)) {
      // Bounce off the edge instead of dying immediately, keeps the grid lively.
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

  /* ------------------------------- Update ------------------------------- */

  update(dtMs: number): void {
    this.nowMs += dtMs;
    const dt = Math.min(dtMs, 48); // clamp huge tab-switch deltas

    this.spawnAmbient();
    this.updateHoverCharge(dt);

    // Nodes — skip fully-decayed nodes instead of touching every node in the
    // map every frame; a dim node has nothing left to animate until charged.
    for (const node of this.nodes.values()) {
      if (!node.isDim()) node.update(dt);
    }

    // Sparks
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

    // Particles
    for (const particle of this.particles) particle.update(dt);
    this.particles = this.particles.filter((p) => !p.isDead());

    // Grid flash decay
    if (this.gridFlashIntensity > 0) {
      this.gridFlashIntensity = Math.max(0, this.gridFlashIntensity - dt * 0.003);
    }

    // Periodic sweep to drop fully-dim nodes, run on a timer rather than
    // waiting for the map to balloon past a size threshold — keeps the
    // per-frame iteration cost (update loop + render loop) small continuously
    // instead of letting thousands of dead nodes accumulate between sweeps.
    if (this.nowMs - this.lastPruneMs > 4000) {
      for (const [key, node] of this.nodes) {
        if (node.isDim()) this.nodes.delete(key);
      }
      this.lastPruneMs = this.nowMs;
    }
  }

  /* ------------------------------ Mouse API ------------------------------ */

  setMouse(x: number, y: number, active: boolean): void {
    this.mouse.x = x;
    this.mouse.y = y;
    this.mouse.active = active;
  }

  setMouseInactive(): void {
    this.mouse.active = false;
  }

  /* ------------------------------- Render ------------------------------- */

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

/* ============================================================================
 * React component
 * ==========================================================================*/

interface ElectricGridProps {
  sparkColor?: string;
}

export default function ElectricGrid({ sparkColor = "#00f0ff" }: ElectricGridProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<ElectricGridEngine | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  // True only while the effect should actually compute + paint: tab visible,
  // canvas in the viewport, and the user hasn't asked for reduced motion.
  // rAF itself keeps ticking (cheap) so resuming is instant and doesn't need
  // any special restart logic — we just skip the expensive work below.
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
      // Capped: canvas pixel cost (and shadowBlur cost on top of that) scales
      // with actual device pixels, so an uncapped 2x-3x DPR was quietly
      // multiplying every draw's cost by 4x-9x on common high-DPI screens.
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

    // Pause the actual simulation/render work (not just "reduce quality")
    // whenever it can't possibly matter: tab in the background, canvas
    // scrolled off-screen, or the user prefers reduced motion. A full-page
    // effect that keeps computing at full density while invisible is a
    // classic silent site-wide performance drain.
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