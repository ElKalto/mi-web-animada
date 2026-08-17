import { gsap } from 'gsap';

export function animateHero() {
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  tl.to('.hero-title', {
    opacity: 1,
    y: 0,
    duration: 1,
  }).to(
    '.hero-sub',
    {
      opacity: 1,
      y: 0,
      duration: 0.8,
    },
    '-=0.5' // empieza 0.5s antes de que termine la animación anterior (solapamiento)
  );
}