/** ASCII woodpecker hero animation engine (see scene.js). Stateless: same t gives the same picture. */
export declare const Woodpecker: {
  /** World size; the canvas aspect ratio must be WORLD_W : WORLD_H (45.6 : 38). */
  WORLD_W: number;
  WORLD_H: number;
  /** Seconds per loop. */
  CYCLE: number;
  /** Colors by slot: 1 ink, 2 bark, 3 accent, 6 dim text, 7 wood chips. Mutable. */
  PAL: Record<number, string>;
  /** Compute the frame at t seconds. ptr is in world units, or null. Returns the loop index. */
  frame(t: number, ptr: { x: number; y: number } | null): number;
  /** Paint the last computed frame onto ctx at the given CSS size. */
  draw(ctx: CanvasRenderingContext2D, cssWidth: number, cssHeight: number, fontFamily?: string): void;
};
