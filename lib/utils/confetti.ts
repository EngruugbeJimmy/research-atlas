import confetti from "canvas-confetti";

const BASIN_COLORS = ["#3b7a8f", "#e8b04b", "#5c9e6f", "#e8e2d0"];

export function fireMissionCompleteConfetti() {
  const duration = 1600;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 65,
      origin: { x: 0, y: 0.65 },
      colors: BASIN_COLORS,
      scalar: 0.9,
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 65,
      origin: { x: 1, y: 0.65 },
      colors: BASIN_COLORS,
      scalar: 0.9,
    });
    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  })();

  confetti({
    particleCount: 80,
    spread: 100,
    origin: { y: 0.5 },
    colors: BASIN_COLORS,
    startVelocity: 45,
  });
}
