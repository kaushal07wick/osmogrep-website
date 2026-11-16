import test from 'node:test';
import assert from 'node:assert/strict';
import { createFooterScene } from './scene.js';

test('footer survives narrow and hidden hosts, then renders again after resize', () => {
  let dimensions = { width: 1, height: 420 }, resize;
  const radii = [];
  const context = new Proxy({
    measureText: () => ({ width: 600 }),
    getImageData: (_x, _y, width, height) => ({ data: new Uint8ClampedArray(width * height * 4) }),
    createRadialGradient: (_x0, _y0, r0, _x1, _y1, r1) => {
      if (r0 < 0 || r1 < 0) throw new RangeError('Canvas gradient radii must be non-negative');
      radii.push(r1);
      return { addColorStop() {} };
    },
  }, { get: (target, key) => target[key] ?? (() => {}) });
  const globals = {
    window: { devicePixelRatio: 1 },
    document: { createElement: () => ({ getContext: () => context }) },
    IntersectionObserver: class { observe() {} disconnect() {} },
    ResizeObserver: class { constructor(callback) { resize = callback; } observe() {} disconnect() {} },
    addEventListener() {}, removeEventListener() {}, cancelAnimationFrame() {},
  };
  const originals = Object.fromEntries(Object.keys(globals).map(key => [key, Object.getOwnPropertyDescriptor(globalThis, key)]));
  let scene;
  try {
    for (const [key, value] of Object.entries(globals)) Object.defineProperty(globalThis, key, { value, configurable: true, writable: true });
    scene = createFooterScene({ getContext: () => context }, { getBoundingClientRect: () => dimensions }, { reduced: true });
    assert.equal(radii[0], 0);
    for (const [width, height] of [[0, 0], [1, 1], [320, 420], [1440, 520]]) {
      dimensions = { width, height };
      assert.doesNotThrow(() => resize());
    }
    assert(radii.at(-1) > 0, 'The glow returns when the host has room again');
  } finally {
    scene?.cleanup();
    for (const [key, descriptor] of Object.entries(originals)) {
      if (descriptor) Object.defineProperty(globalThis, key, descriptor);
      else delete globalThis[key];
    }
  }
});
