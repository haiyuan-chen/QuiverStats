/* eslint-disable no-undef */
/* eslint-env vitest/globals */
// src/test/ScoreCalculator.test.jsx
import { ScoreCalculator } from "../calculator/ScoreCalculator";

test("center click yields max score", () => {
  const fakeSVG = {
    getBoundingClientRect: () => ({
      left: 0,
      top: 0,
      width: 122,
      height: 122,
    }),
  };
  const fakeEvent = {
    clientX: 61,
    clientY: 61,
    currentTarget: fakeSVG,
  };

  const calc = new ScoreCalculator(122, 10);
  const result = calc.calculate(fakeEvent, fakeSVG);

  expect(result.score).toBe(10);
});

test("click well outside target yields score 0", () => {
  const fakeSVG = {
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 122, height: 122 }),
  };
  // click at x=200,y=200 — far outside 122×122 box
  const fakeEvent = { clientX: 200, clientY: 200, currentTarget: fakeSVG };

  const calc = new ScoreCalculator(122, 10);
  const result = calc.calculate(fakeEvent, fakeSVG);
  expect(result.score).toBe(0);
});

test("click at outer edge yields score 1", () => {
  const fakeSVG = {
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 122, height: 122 }),
  };
  // outermost radius = 122/2 = 61. Move slightly inward by 0.1px:
  const fakeEvent = {
    clientX: 61 + 61 - 0.1,
    clientY: 61,
    currentTarget: fakeSVG,
  };

  const calc = new ScoreCalculator(122, 10);
  const result = calc.calculate(fakeEvent, fakeSVG);
  expect(result.score).toBe(1);
});

test("click on boundary between rings yields the higher score", () => {
  const fakeSVG = {
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 122, height: 122 }),
  };
  const calc = new ScoreCalculator(122, 10);
  const step = calc.step; // 6.1
  const boundaryDist = calc.totalSize / 2 - 2 * step;
  // boundary between ring 2 and 3: dist = 61 - 12.2 = 48.8
  const clickX = 61 + boundaryDist;
  const fakeEvent = { clientX: clickX, clientY: 61, currentTarget: fakeSVG };
  const result = calc.calculate(fakeEvent, fakeSVG);
  // Ceil((61 - 48.8)/6.1) = Ceil(12.2/6.1) = 2, so score = 2
  expect(result.score).toBe(3);
});

[1, 5, 10].forEach((ring) => {
  test(`click on the ${ring}th ring on right axis yields score ${ring}`, () => {
    const fakeSVG = {
      getBoundingClientRect: () => ({
        left: 0,
        top: 0,
        width: 122,
        height: 122,
      }),
    };
    const calc = new ScoreCalculator(122, 10);
    const radius = calc.step * (calc.rings - ring + 1);
    const fakeEvent = {
      clientX: 61 + radius,
      clientY: 61,
      currentTarget: fakeSVG,
    };
    expect(calc.calculate(fakeEvent, fakeSVG).score).toBe(ring);
  });
});

test("non-square SVG still normalizes x and y separately", () => {
  const fakeSVG = {
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 244, height: 122 }),
  };
  const calc = new ScoreCalculator(122, 10);
  // A click at clientX=122 on a 244px width maps to x=61 in SVG‑coords
  const fakeEvent = { clientX: 122, clientY: 61, currentTarget: fakeSVG };
  const result = calc.calculate(fakeEvent, fakeSVG);
  // center in vertical, half‑width horizontally → should be score=10
  expect(result).toEqual(expect.objectContaining({ score: 10, x: 61, y: 61 }));
});

test("custom size and rings scales correctly", () => {
  const size = 200;
  const rings = 20;
  const calc = new ScoreCalculator(size, rings);
  expect(calc.step).toBe(size / (2 * rings)); // 200/(2×20) = 5
});
