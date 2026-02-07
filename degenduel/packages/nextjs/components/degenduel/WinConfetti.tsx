"use client";

import confetti from "canvas-confetti";

export const fireWinConfetti = () => {
  // Two bursts from left and right sides
  confetti({
    particleCount: 80,
    spread: 70,
    origin: { x: 0.3, y: 0.6 },
    colors: ["#8B5CF6", "#F59E0B", "#22C55E", "#06B6D4"],
    zIndex: 9999,
  });
  setTimeout(() => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { x: 0.7, y: 0.6 },
      colors: ["#8B5CF6", "#F59E0B", "#22C55E", "#06B6D4"],
      zIndex: 9999,
    });
  }, 150);
};

export const fireBonusConfetti = () => {
  // Fire gold-heavy confetti from center
  confetti({
    particleCount: 150,
    spread: 100,
    origin: { x: 0.5, y: 0.5 },
    colors: ["#F59E0B", "#EAB308", "#FDE68A", "#FBBF24"],
    zIndex: 9999,
  });
  // Then normal confetti
  setTimeout(() => fireWinConfetti(), 300);
};
