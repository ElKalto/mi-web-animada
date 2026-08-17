import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initHorizontalScroll() {
  const track = document.querySelector('.horizontal-track');
  const panels = gsap.utils.toArray('.h-panel');

  // Desplazamos el track horizontalmente en función del scroll vertical
  gsap.to(track, {
    x: () => -(track.scrollWidth - window.innerWidth),
    ease: 'none',
    scrollTrigger: {
      trigger: '.horizontal-wrapper',
      start: 'top top',
      end: () => `+=${track.scrollWidth - window.innerWidth}`,
      scrub: 1, // sigue el scroll con un pequeño "delay" suave
      pin: true, // fija la sección en pantalla mientras dura la animación
      anticipatePin: 1,
      invalidateOnRefresh: true,
    },
  });

  // Animación extra: cada panel entra con un pequeño efecto al centrarse
  panels.forEach((panel) => {
    gsap.fromTo(
      panel.querySelectorAll('h2, p'),
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: panel,
          containerAnimation: gsap.getTweensOf(track)[0], // sincroniza con el scroll horizontal
          start: 'left 60%',
          toggleActions: 'play none none reverse',
        },
      }
    );
  });
}