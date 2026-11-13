import { diagnosticAt, ERROR_VARIANTS } from "./error-catalog";
export type RunPhase = "ready" | "running" | "paused" | "over";
export type Obstacle = {
  x: number;
  width: number;
  height: number;
  label: string;
  detail?: string;
  kind: "ground" | "overhead";
};
export type Run = {
  phase: RunPhase;
  y: number;
  velocity: number;
  ducking: boolean;
  distance: number;
  elapsed: number;
  spawnIn: number;
  seed: number;
  obstacles: Obstacle[];
};
export const runnerX = (width: number) => Math.min(90, width * 0.17);
export const runScore = (run: Run) => Math.floor(run.distance / 10);
export function newRun(): Run {
  return {
    phase: "ready",
    y: 0,
    velocity: 0,
    ducking: false,
    distance: 0,
    elapsed: 0,
    spawnIn: 1.15,
    seed: 7331,
    obstacles: [],
  };
}
export function jumpRun(run: Run) {
  if (run.phase !== "running" || run.y > 0 || run.ducking) return false;
  run.velocity = 560;
  return true;
}
export function stepRun(run: Run, dt: number, width: number) {
  if (run.phase !== "running" || dt <= 0 || !Number.isFinite(dt)) return;
  // Fixed substeps keep collision checks fair across different display refresh rates.
  let remaining = Math.min(dt, 0.05);
  while (remaining > 0 && run.phase === "running") {
    const step = Math.min(remaining, 1 / 120);
    remaining -= step;
    const speed = 260 + Math.min(run.elapsed * 1.5, 160);
    run.elapsed += step;
    run.distance += speed * step;
    if (run.y > 0 || run.velocity > 0) {
      run.velocity -= 1600 * step;
      run.y = Math.max(0, run.y + run.velocity * step);
      if (run.y === 0) run.velocity = 0;
    }
    for (const obstacle of run.obstacles) obstacle.x -= speed * step;
    run.obstacles = run.obstacles.filter(
      (obstacle) => obstacle.x + obstacle.width > -10,
    );
    run.spawnIn -= step;
    if (run.spawnIn <= 0) {
      run.seed = (Math.imul(run.seed, 1664525) + 1013904223) >>> 0;
      const variety = run.seed % 4;
      const diagnostic = diagnosticAt((run.seed >>> 8) % ERROR_VARIANTS);
      run.obstacles.push({
        x: width + 24,
        width: 22 + variety * 3,
        height: 25 + variety * 5,
        ...diagnostic,
        kind: (run.seed >>> 4) % 3 === 0 ? "overhead" : "ground",
      });
      run.spawnIn = 1.05 + (run.seed % 550) / 1000;
    }
    const x = runnerX(width);
    if (
      run.obstacles.some((obstacle) => {
        const horizontal =
          obstacle.x < x + 35 && obstacle.x + obstacle.width > x + 7;
        const playerTop = run.y + (run.ducking && run.y === 0 ? 13 : 27);
        return (
          horizontal &&
          (obstacle.kind === "overhead"
            ? playerTop > 20 && run.y + 5 < 64
            : run.y + 5 < obstacle.height)
        );
      })
    )
      run.phase = "over";
  }
}
