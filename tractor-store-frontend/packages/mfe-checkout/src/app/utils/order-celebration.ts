import confetti from 'canvas-confetti';

/** Palette aligned with Tractor Store industrial theme */
const CELEBRATION_COLORS = [
  '#d97706',
  '#f59e0b',
  '#eab308',
  '#15803d',
  '#86efac',
  '#94a3b8',
  '#e2e8f0',
];

function prefersReducedMotion(): boolean {
  return (
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * Elegant purchase celebration: side streams + centered bursts (not childish rainbow).
 */
export function runOrderCelebration(): void {
  if (prefersReducedMotion()) {
    return;
  }

  const fire = confetti.create(undefined, {
    resize: true,
    useWorker: true,
  });

  const burst = (opts: confetti.Options) => {
    fire({
      colors: CELEBRATION_COLORS,
      disableForReducedMotion: true,
      zIndex: 9999,
      ...opts,
    });
  };

  // Soft streams from both sides
  const end = Date.now() + 2200;
  const sideTick = () => {
    burst({
      particleCount: 2,
      angle: 58,
      spread: 48,
      startVelocity: 28,
      origin: { x: 0.02, y: 0.62 },
      scalar: 0.85,
      ticks: 180,
    });
    burst({
      particleCount: 2,
      angle: 122,
      spread: 48,
      startVelocity: 28,
      origin: { x: 0.98, y: 0.62 },
      scalar: 0.85,
      ticks: 180,
    });
    if (Date.now() < end) {
      requestAnimationFrame(sideTick);
    }
  };
  sideTick();

  // Main confirmation burst (behind the card)
  window.setTimeout(() => {
    burst({
      particleCount: 72,
      spread: 78,
      startVelocity: 32,
      origin: { x: 0.5, y: 0.52 },
      scalar: 0.9,
      gravity: 0.95,
      ticks: 220,
    });
  }, 280);

  // Rust/gold sparkle follow-up
  window.setTimeout(() => {
    burst({
      particleCount: 36,
      spread: 100,
      startVelocity: 22,
      origin: { x: 0.5, y: 0.48 },
      scalar: 0.65,
      shapes: ['circle'],
      ticks: 160,
    });
  }, 620);
}
