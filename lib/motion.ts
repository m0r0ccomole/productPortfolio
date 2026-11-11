// ROLE: primitive
// PURPOSE: Motion vocabulary. Five patterns cover all current inline animations.
// CONTENT: none — visual-only.
// SAFE TO RESTYLE: durations, stagger increment, the five variant shapes.
// DO NOT: add page-specific variants here. Bespoke timing belongs in the page.

export const MOTION_DURATION = {
  fast: 0.2,
  base: 0.5,
  medium: 0.6,
  slow: 0.8,
} as const;

export const MOTION_STAGGER = 0.2;

export const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: MOTION_DURATION.slow },
};

export const fadeUpStagger = (index: number) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: MOTION_DURATION.slow, delay: index * MOTION_STAGGER },
});

export const slideInLeft = (index = 0) => ({
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: MOTION_DURATION.medium, delay: index * MOTION_STAGGER },
});

export const carouselSlide = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 },
  transition: { duration: MOTION_DURATION.base },
};

export const hoverScale = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
};
