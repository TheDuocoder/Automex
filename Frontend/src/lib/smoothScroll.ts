import Lenis from 'lenis';

let lenis: Lenis | null = null;

export const initSmoothScroll = () => {
  if (typeof window === 'undefined') return null;

  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
  });

  function raf(time: number) {
    lenis?.raf(time);
    requestAnimationFrame(raf);
  }

  requestAnimationFrame(raf);

  return lenis;
};

export const destroySmoothScroll = () => {
  if (lenis) {
    lenis.destroy();
    lenis = null;
  }
};

export const getLenis = () => lenis;

export const scrollTo = (target: string | number | HTMLElement, options?: any) => {
  lenis?.scrollTo(target, options);
};
