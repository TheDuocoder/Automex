import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Fade in animation
export const fadeIn = (element: string | Element, options = {}) => {
  return gsap.from(element, {
    opacity: 0,
    y: 50,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: element,
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
    ...options,
  });
};

// Fade in up animation
export const fadeInUp = (element: string | Element, options = {}) => {
  return gsap.from(element, {
    opacity: 0,
    y: 100,
    duration: 1.2,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: element,
      start: 'top 85%',
      toggleActions: 'play none none reverse',
    },
    ...options,
  });
};

// Slide in from left
export const slideInLeft = (element: string | Element, options = {}) => {
  return gsap.from(element, {
    opacity: 0,
    x: -100,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: element,
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
    ...options,
  });
};

// Slide in from right
export const slideInRight = (element: string | Element, options = {}) => {
  return gsap.from(element, {
    opacity: 0,
    x: 100,
    duration: 1,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: element,
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
    ...options,
  });
};

// Scale up animation
export const scaleUp = (element: string | Element, options = {}) => {
  return gsap.from(element, {
    scale: 0.8,
    opacity: 0,
    duration: 1,
    ease: 'back.out(1.7)',
    scrollTrigger: {
      trigger: element,
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
    ...options,
  });
};

// Stagger animation for multiple elements
export const staggerFadeIn = (elements: string | Element[], options = {}) => {
  return gsap.from(elements, {
    opacity: 0,
    y: 50,
    duration: 0.8,
    stagger: 0.2,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: elements,
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
    ...options,
  });
};

// Parallax effect
export const parallax = (element: string | Element, speed = 0.5) => {
  return gsap.to(element, {
    yPercent: 50 * speed,
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
    },
  });
};

// Reveal animation (like a curtain opening)
export const reveal = (element: string | Element, options = {}) => {
  return gsap.from(element, {
    clipPath: 'inset(0 100% 0 0)',
    duration: 1.5,
    ease: 'power4.inOut',
    scrollTrigger: {
      trigger: element,
      start: 'top 80%',
      toggleActions: 'play none none reverse',
    },
    ...options,
  });
};

// Counter animation
export const animateCounter = (element: Element, endValue: number, duration = 2) => {
  const obj = { value: 0 };
  return gsap.to(obj, {
    value: endValue,
    duration,
    ease: 'power1.out',
    onUpdate: () => {
      element.textContent = Math.round(obj.value).toString();
    },
    scrollTrigger: {
      trigger: element,
      start: 'top 80%',
      toggleActions: 'play none none none',
    },
  });
};

// Initialize all animations
export const initScrollAnimations = () => {
  ScrollTrigger.refresh();
};

// Cleanup function
export const cleanupScrollAnimations = () => {
  ScrollTrigger.getAll().forEach(trigger => trigger.kill());
};
