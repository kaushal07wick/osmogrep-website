"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Bug from "../bug/Bug";

/* Three steps. The left column is pinned; each step's visual scrolls past on the right and
   the step closest to the middle of the screen is the active one. */

/** 18x4 grid of test cells (one per test) that fill in; one fails. */
function RunVisual({ active }: { active: boolean }) {
  return (
    <div>
      <div className="grid grid-cols-[repeat(18,minmax(0,1fr))] gap-1.5">
        {Array.from({ length: 72 }, (_, i) => (
          <span
            key={i}
            className={`aspect-square transition-colors duration-300 ${active ? (i === 47 ? "bg-fail" : "bg-pass/70") : "bg-grid/60"}`}
            style={{ transitionDelay: active ? `${i * 18}ms` : "0ms" }}
          />
        ))}
      </div>
      <p
        className={`mt-6 font-mono text-[12px] transition-opacity duration-500 ${active ? "opacity-100" : "opacity-0"}`}
      >
        <span className="text-fail">1 failing</span>{" "}
        <span className="text-ink-light">· notify.test.ts</span>
      </p>
    </div>
  );
}

function CatchVisual({ active }: { active: boolean }) {
  return (
    <div className="relative flex h-full items-center justify-center">
      <div
        className={`relative flex h-40 w-56 items-center justify-center transition-transform duration-500 ${active ? "scale-100" : "scale-125 opacity-40"}`}
      >
        {[
          "left-0 top-0 border-l-2 border-t-2",
          "right-0 top-0 border-r-2 border-t-2",
          "bottom-0 left-0 border-b-2 border-l-2",
          "bottom-0 right-0 border-b-2 border-r-2",
        ].map((c) => (
          <span key={c} className={`absolute h-6 w-6 border-accent ${c}`} />
        ))}
        <Bug
          mood={active ? "scared" : "walk"}
          className="h-16 w-[90px] text-ink"
        />
      </div>
      <p className="absolute bottom-0 font-mono text-[12px] text-ink-light">
        <span className="text-accent">NULL-003</span> user.profile
        <span className="text-fail underline decoration-wavy">.email</span>
      </p>
    </div>
  );
}

function FixVisual({ active }: { active: boolean }) {
  const Row = ({
    label,
    pass,
    fail,
  }: {
    label: string;
    pass: number;
    fail: number;
  }) => (
    <div>
      <div className="mb-1.5 flex justify-between font-mono text-[12px] text-ink-light">
        <span>{label}</span>
        <span className={fail ? "text-fail" : "text-pass"}>
          {pass} passed · {fail} failed
        </span>
      </div>
      <div className="flex h-3 gap-0.5">
        {Array.from({ length: pass + fail }, (_, i) => (
          <span
            key={i}
            className={`flex-1 transition-colors duration-500 ${active ? (i >= pass ? "bg-fail" : "bg-pass") : "bg-grid"}`}
            style={{ transitionDelay: `${i * 80}ms` }}
          />
        ))}
      </div>
    </div>
  );
  return (
    <div className="space-y-6">
      <Row label="original source" pass={3} fail={1} />
      <Row label="after osmogrep fix" pass={4} fail={0} />
      <p className="font-mono text-[12px] text-ink-light">
        <span className="text-pass">✓</span> original tests unchanged · patch
        exported
      </p>
    </div>
  );
}

const STEPS: {
  title: string;
  body: string;
  Visual: (p: { active: boolean }) => ReactNode;
}[] = [
  {
    title: "Run",
    body: "Your tests, in a sandbox.",
    Visual: RunVisual,
  },
  {
    title: "Catch",
    body: "Reproduced, pinned to the line.",
    Visual: CatchVisual,
  },
  {
    title: "Fix",
    body: "Patched, rerun, proven.",
    Visual: FixVisual,
  },
];

export default function HowItWorks() {
  const [active, setActive] = useState(0);
  const panels = useRef<(HTMLDivElement | null)[]>([]);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach(
          (e) =>
            e.isIntersecting &&
            setActive(Number((e.target as HTMLElement).dataset.step)),
        ),
      { rootMargin: "-45% 0px -45% 0px" }, // a thin band across the middle of the screen
    );
    panels.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  return (
    <section className="w-full py-24 md:py-32">
      <div className="mx-auto grid max-w-[1280px] gap-12 px-6 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="lg:sticky lg:top-32 lg:h-fit">
          <p className="font-mono text-[12px] text-accent">how it works</p>
          <h2 className="mt-3 text-4xl font-bold leading-tight tracking-tight text-ink md:text-5xl">
            Run. Catch. Fix.
          </h2>
          <ol className="mt-10 space-y-6">
            {STEPS.map((s, i) => (
              <li
                key={s.title}
                className={`grid grid-cols-[3rem_1fr] transition-opacity duration-300 ${i === active ? "opacity-100" : "opacity-35"}`}
              >
                <span className="font-mono text-sm text-accent">0{i + 1}</span>
                <div>
                  <h3 className="text-xl font-bold text-ink">{s.title}</h3>
                  <p className="mt-1 max-w-sm text-ink-light">{s.body}</p>
                  <span
                    className="mt-3 block h-[2px] origin-left bg-accent transition-transform duration-500"
                    style={{ transform: `scaleX(${i === active ? 1 : 0})` }}
                  />
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="space-y-[18vh] lg:pb-[4vh] lg:pt-[12vh]">
          {STEPS.map(({ title, Visual }, i) => (
            <div
              key={title}
              ref={(el) => {
                panels.current[i] = el;
              }}
              data-step={i}
              className="frame flex h-[340px] flex-col p-8"
            >
              <p className="font-mono text-[11px] text-ink-light">
                fig. {i + 1} · {title.toLowerCase()}
              </p>
              <div className="mt-6 flex-1">
                <Visual active={i === active} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
