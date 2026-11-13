"use client";

import { useEffect, useRef, useState } from "react";
import { MOODS } from "./bug/Bug";
import { diagnosticAt, ERROR_VARIANTS } from "../../lib/error-catalog";
import {
  jumpRun,
  newRun,
  runnerX,
  runScore,
  stepRun,
  type RunPhase,
} from "../../lib/bug-runner";

const palette: Record<string, string> = {
  o: "#ea580c",
  d: "#b34720",
  g: "#22c55e",
  G: "#4d7351",
  k: "#302c25",
  w: "#fffefa",
  s: "#c7beaa",
};
const scoreText = (score: number) => String(score).padStart(5, "0");

export default function BugRunner() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const control = useRef<
    (command: "play" | "pause" | "duck" | "stand") => void
  >(() => {});
  const [ui, setUI] = useState<{
    phase: RunPhase;
    score: number;
    best: number;
  }>({ phase: "ready", score: 0, best: 0 });

  useEffect(() => {
    const surface = canvas.current;
    const ctx = surface?.getContext("2d");
    if (!surface || !ctx) return;
    let run = newRun(),
      width = 800,
      height = 260,
      frame = 0,
      last = 0,
      published = 0,
      best = 0;
    try {
      best = Math.min(
        9999999,
        Math.max(0, Number(localStorage.getItem("og.bug-run.best")) || 0),
      );
    } catch {}
    function publish() {
      setUI({ phase: run.phase, score: runScore(run), best });
    }
    function save() {
      try {
        localStorage.setItem("og.bug-run.best", String(best));
      } catch {}
    }
    function paint() {
      const ground = height - Math.max(60, height * 0.16);
      ctx!.clearRect(0, 0, width, height);
      ctx!.fillStyle = "#f9f8f5";
      ctx!.fillRect(0, 0, width, height);
      // Small deterministic stones scroll with the run; no images or game engine required.
      for (let i = 0; i < 130; i++) {
        const x =
          (((i * 73.7 - run.distance * 0.65) % (width + 20)) + width + 20) %
          (width + 20);
        const y = ground + 8 + ((i * 17) % 37);
        ctx!.fillStyle = i % 4 ? "#cfc6b366" : "#95886c88";
        ctx!.fillRect(Math.floor(x), y, (i % 3) + 1, 1);
      }
      ctx!.strokeStyle = "#c6bba6";
      ctx!.lineWidth = 1;
      ctx!.beginPath();
      for (let x = 0; x <= width + 4; x += 4) {
        const y = ground + Math.sin((x + run.distance) * 0.04) * 1.5;
        if (!x) ctx!.moveTo(x, y);
        else ctx!.lineTo(x, y);
      }
      ctx!.stroke();
      ctx!.fillStyle = "#99896e22";
      ctx!.font = "11px monospace";
      for (let i = 0; i < Math.min(16, Math.floor(width / 70)); i++) {
        const x =
          ((((i * 173.3 - run.distance * (0.09 + (i % 3) * 0.025)) %
            (width + 220)) +
            width +
            220) %
            (width + 220)) -
          110;
        const y =
          80 +
          ((i * 97) % Math.max(80, ground - 170)) +
          Math.sin(run.elapsed * 0.25 + i) * 8;
        ctx!.fillText(diagnosticAt(i * 247).label, x, y);
      }
      const obstacles =
        run.phase === "ready"
          ? [
              {
                x: width * 0.7,
                width: 28,
                height: 35,
                label: "TypeError",
                detail: "undefined is not a function",
                kind: "ground" as const,
              },
              {
                x: width * 0.88,
                width: 32,
                height: 30,
                label: "ECONNREFUSED",
                detail: "connection refused",
                kind: "overhead" as const,
              },
            ]
          : run.obstacles;
      for (const obstacle of obstacles) {
        const x = Math.round(obstacle.x),
          top =
            obstacle.kind === "overhead"
              ? ground - 64
              : ground - obstacle.height;
        const obstacleHeight =
          obstacle.kind === "overhead" ? 44 : obstacle.height;
        ctx!.fillStyle = "#d8cdb8";
        ctx!.fillRect(x, top, obstacle.width, obstacleHeight);
        ctx!.fillStyle = "#80715a";
        for (let row = 0; row < obstacleHeight - 4; row += 6)
          ctx!.fillRect(
            x + 3,
            top + row + 3,
            obstacle.width - (row % 3 ? 7 : 11),
            2,
          );
        ctx!.fillStyle = "#8b5b37";
        ctx!.font = "11px monospace";
        const labelX = Math.min(
          x - 2,
          Math.max(8, width - obstacle.label.length * 6.7 - 10),
        );
        ctx!.fillText(
          `${obstacle.kind === "overhead" ? "↓ " : "↑ "}${obstacle.label}`,
          labelX,
          top - 10,
        );
        if (width > 600 && obstacle.detail) {
          ctx!.fillStyle = "#9b8b73";
          ctx!.font = "10px monospace";
          ctx!.fillText(obstacle.detail, x - 2, ground + 30, 250);
        }
      }
      const mood =
        run.phase === "over"
          ? "caught"
          : run.phase !== "running"
            ? "curious"
            : run.y > 10
              ? "scared"
              : runScore(run) > 0 && runScore(run) % 100 < 5
                ? "happy"
                : "walk";
      const sprite = MOODS[mood];
      const rows =
        sprite.frames[
          Math.floor((run.elapsed * 1000) / sprite.ms) % sprite.frames.length
        ];
      const pixelHeight = run.ducking && run.y === 0 ? 1.35 : 3;
      rows.forEach((row, y) =>
        [...row].forEach((pixel, x) => {
          if (pixel === ".") return;
          ctx!.fillStyle = palette[pixel] || "#302c25";
          ctx!.fillRect(
            Math.round(runnerX(width) + x * 3),
            Math.round(
              ground - run.y - rows.length * pixelHeight + y * pixelHeight,
            ),
            3,
            Math.ceil(pixelHeight),
          );
        }),
      );
    }
    function tick(now: number) {
      const dt = last ? (now - last) / 1000 : 0;
      last = now;
      stepRun(run, dt, width);
      best = Math.max(best, runScore(run));
      paint();
      if (run.phase === "over") {
        publish();
        save();
        return;
      }
      if (now - published > 100) {
        publish();
        published = now;
      }
      if (run.phase === "running") frame = requestAnimationFrame(tick);
    }
    function schedule() {
      cancelAnimationFrame(frame);
      last = 0;
      frame = requestAnimationFrame(tick);
    }
    control.current = (command) => {
      if (command === "duck" || command === "stand") {
        run.ducking = command === "duck" && run.phase === "running";
        paint();
        return;
      }
      if (command === "pause") {
        if (run.phase === "running") {
          run.phase = "paused";
          run.ducking = false;
          cancelAnimationFrame(frame);
          paint();
          publish();
        } else if (run.phase === "paused") {
          run.phase = "running";
          publish();
          schedule();
        }
        return;
      }
      if (run.phase === "ready" || run.phase === "over") {
        run = newRun();
        run.phase = "running";
        schedule();
      } else if (run.phase === "paused") {
        run.phase = "running";
        schedule();
      } else jumpRun(run);
      surface!.focus({ preventScroll: true });
      paint();
      publish();
    };
    function resize() {
      width = Math.max(280, surface!.clientWidth);
      height = surface!.clientHeight;
      const ratio = Math.min(devicePixelRatio || 1, 2);
      surface!.width = Math.round(width * ratio);
      surface!.height = Math.round(height * ratio);
      ctx!.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx!.imageSmoothingEnabled = false;
      paint();
    }
    function suspend() {
      if (run.phase === "running") control.current("pause");
    }
    function visibility() {
      if (document.hidden) suspend();
    }
    const observer = new ResizeObserver(resize);
    observer.observe(surface);
    window.addEventListener("blur", suspend);
    document.addEventListener("visibilitychange", visibility);
    resize();
    publish();
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("blur", suspend);
      document.removeEventListener("visibilitychange", visibility);
      control.current = () => {};
      save();
    };
  }, []);

  const playing = ui.phase === "running";
  const action =
    ui.phase === "over"
      ? "Run again"
      : ui.phase === "paused"
        ? "Resume run"
        : "Start run";
  return (
    <section className="bug-runner" aria-label="Bug Run game">
      <div className="bug-runner-hud">
        <span>
          BUG RUN <i>{ERROR_VARIANTS.toLocaleString()} diagnostics</i>
        </span>
        <div>
          <span>
            BEST <output aria-label="Best score" aria-live="off">{scoreText(ui.best)}</output>
          </span>
          <span>
            SCORE{" "}
            <output aria-label="Current score" aria-live="off">{scoreText(ui.score)}</output>
          </span>
        </div>
      </div>
      <div className="bug-runner-stage">
        <canvas
          ref={canvas}
          tabIndex={0}
          role="application"
          aria-label="Bug Run. Space or Up Arrow jumps. Hold Down Arrow to duck. P pauses. Escape pauses the run."
          aria-describedby="bug-runner-instructions"
          onPointerDown={() => control.current("play")}
          onKeyDown={(event) => {
            if (["ArrowDown", "s"].includes(event.key)) {
              event.preventDefault();
              control.current("duck");
              return;
            }
            if (event.repeat) return;
            if ([" ", "ArrowUp"].includes(event.key)) {
              event.preventDefault();
              control.current("play");
            }
            if (event.key.toLowerCase() === "p") {
              event.preventDefault();
              control.current("pause");
            }
            if (event.key === "Escape" && playing) {
              event.preventDefault();
              control.current("pause");
            }
          }}
          onKeyUp={(event) => {
            if (["ArrowDown", "s"].includes(event.key)) {
              event.preventDefault();
              control.current("stand");
            }
          }}
        >
          An interactive pixel bug runner. Use the Start run and Jump buttons to
          play or hold Duck to crouch.
        </canvas>
        {!playing && (
          <div className="bug-runner-overlay">
            <p>
              {ui.phase === "over"
                ? "Unhandled landing."
                : ui.phase === "paused"
                  ? "Execution paused."
                  : "Jump the exceptions."}
            </p>
            <button onClick={() => control.current("play")}>
              {action} <span aria-hidden="true">→</span>
            </button>
          </div>
        )}
      </div>
      <div className="bug-runner-controls">
        <p id="bug-runner-instructions">
          <kbd>Space</kbd> / <kbd>↑</kbd> jump <span>·</span> <kbd>↓</kbd> duck
        </p>
        <div>
          <button disabled={!playing} onClick={() => control.current("play")}>
            Jump ↑
          </button>
          <button
            disabled={!playing}
            onPointerDown={(event) => {
              event.preventDefault();
              event.currentTarget.setPointerCapture(event.pointerId);
              control.current("duck");
            }}
            onPointerUp={() => control.current("stand")}
            onPointerCancel={() => control.current("stand")}
            onLostPointerCapture={() => control.current("stand")}
            onKeyDown={(event) => {
              if ([" ", "Enter"].includes(event.key)) {
                event.preventDefault();
                control.current("duck");
              }
            }}
            onKeyUp={() => control.current("stand")}
            onBlur={() => control.current("stand")}
          >
            Duck ↓
          </button>
          <button
            disabled={ui.phase === "ready" || ui.phase === "over"}
            onClick={() => control.current("pause")}
          >
            {ui.phase === "paused" ? "Resume" : "Pause"}
          </button>
        </div>
      </div>
      <span className="bug-runner-status" role="status" aria-live="polite">
        {ui.phase === "over"
          ? `Run ended. Score ${ui.score}. Try again.`
          : ui.phase === "paused"
            ? "Run paused."
            : ui.phase === "ready"
              ? "Game ready. Start when you like."
              : "Run started."}
      </span>
    </section>
  );
}
