import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initSmoothScroll() {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });

  // Conectar Lenis con ScrollTrigger: cada vez que Lenis actualiza el scroll,
  // le avisamos a ScrollTrigger para que recalcule las posiciones.
  lenis.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

export function animatePanels() {
  const panels = document.querySelectorAll('.panel');

  panels.forEach((panel) => {
    gsap.to(panel, {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: panel,
        start: 'top 80%', // la animación empieza cuando el panel entra al 80% del viewport
        toggleActions: 'play none none reverse',
      },
    });
  });
}