// Reusable animation variants for framer-motion

// ============================================
// FRAMER MOTION VARIANTS
// ============================================

export const zoomIn = {
  initial: { opacity: 0, scale: 1.2 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.6, ease: "easeOut" },
};

// Zoom in for whileInView usage
export const zoomInView = {
  initial: { opacity: 0, scale: 1.2 },
  whileInView: { opacity: 1, scale: 1 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, ease: "easeOut" },
};

export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.6, ease: "easeOut" },
};

export const fadeInView = {
  initial: { opacity: 0 },
  whileInView: { opacity: 1 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, ease: "easeOut" },
};

export const slideUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
};

export const slideUpView = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, ease: "easeOut" },
};

export const slideDown = {
  initial: { opacity: 0, y: -20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
};

export const slideLeft = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
};

export const slideLeftView = {
  initial: { opacity: 0, x: 30 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, ease: "easeOut" },
};

export const slideRight = {
  initial: { opacity: 0, x: -20 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.6, ease: "easeOut" },
};

export const slideRightView = {
  initial: { opacity: 0, x: -30 },
  whileInView: { opacity: 1, x: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6, ease: "easeOut" },
};

// Helper to add delay to any animation
export const withDelay = (animation, delay) => ({
  ...animation,
  transition: { ...animation.transition, delay },
});

// Stagger children container variant
export const staggerContainer = {
  initial: {},
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// For use with whileInView
export const viewportConfig = {
  once: true,
  margin: "-100px",
};

// ============================================
// GSAP ANIMATION CONFIGS
// ============================================

// Zoom in config for GSAP ScrollTrigger
export const gsapZoomIn = {
  from: { opacity: 0, scale: 1.2 },
  to: { opacity: 1, scale: 1, duration: 0.6, ease: "power2.out" },
};

// Fade in config for GSAP ScrollTrigger
export const gsapFadeIn = {
  from: { opacity: 0 },
  to: { opacity: 1, duration: 0.6, ease: "power2.out" },
};

// Slide up config for GSAP ScrollTrigger
export const gsapSlideUp = {
  from: { opacity: 0, y: 30 },
  to: { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
};

// Default ScrollTrigger config
export const defaultScrollTrigger = {
  start: "top 80%",
  toggleActions: "play none none none",
};

// ============================================
// GSAP ANIMATION HELPER FUNCTIONS
// ============================================

/**
 * Apply zoom-out animation to a text element using GSAP with ScrollTrigger
 * Replaces character-by-character animations with simple zoom
 * @param {Object} gsap - GSAP instance
 * @param {HTMLElement} element - The element to animate
 * @param {Object} options - Animation options
 */
export const animateTextZoomIn = (gsap, element, options = {}) => {
  if (!element) return null;

  const { delay = 0 } = options;

  return gsap.fromTo(
    element,
    {
      opacity: 0,
      scale: 1.2,
    },
    {
      opacity: 1,
      scale: 1,
      duration: 0.6,
      delay,
      ease: "power2.out",
      scrollTrigger: {
        trigger: element,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    }
  );
};
