import { gsap } from 'gsap';
import { Observer } from 'gsap/Observer';
import { initNavLine } from './navLine.js';

gsap.registerPlugin(Observer);

export function initPaging() {
  const sections = gsap.utils.toArray('.snap-section');
  const horizontalWrapper = document.querySelector('.horizontal-wrapper');
  const track = document.querySelector('.horizontal-track');
const hPanels = gsap.utils.toArray('.h-panel');

  const updateLine = initNavLine();

  function computeLinearIndex(sectionIndex, hPanelIndex) {
    let idx = 0;
    for (let i = 0; i < sectionIndex; i++) {
      idx += sections[i] === horizontalWrapper ? hPanels.length : 1;
    }
    if (sections[sectionIndex] === horizontalWrapper) {
      idx += hPanelIndex;
    }
    return idx;
  }

  const totalStops = sections.reduce(
    (sum, s) => sum + (s === horizontalWrapper ? hPanels.length : 1),
    0
  );
  const maxLinearIndex = totalStops - 1;

  let currentSection = 0;
  let currentHPanel = 0;
  let animating = false;

  function goToSection(index, hPanelIndex = 0) {
    if (index < 0 || index >= sections.length || animating) return;

animating = true;
    currentSection = index;
    currentHPanel = hPanelIndex;

    updateLine(computeLinearIndex(index, hPanelIndex) / maxLinearIndex, 1);

    gsap.to('.snap-container', {
      y: -index * window.innerHeight,
      duration: 1,
      ease: 'power2.inOut',
      onComplete: () => {
        // si aterrizamos en la sección horizontal, colocamos el panel correcto sin animar
        if (sections[index] === horizontalWrapper) {
          gsap.set(track, { x: -hPanelIndex * window.innerWidth });
        }
        animating = false;
      },
    });
  }

  function moveTrackTo(panelIndex) {
animating = true;
    currentHPanel = panelIndex;

    updateLine(computeLinearIndex(currentSection, panelIndex) / maxLinearIndex, 0.8);

    gsap.to(track, {
      x: -panelIndex * window.innerWidth,
      duration: 0.8,
      ease: 'power2.inOut',
      onComplete: () => {
        animating = false;
      },
    });
  }

  function handleMove(direction) {
    if (animating) return;

    const inHorizontal = sections[currentSection] === horizontalWrapper;

    if (inHorizontal) {
      const nextH = currentHPanel + direction;

      // todavía quedan paneles horizontales por recorrer
      if (nextH >= 0 && nextH < hPanels.length) {
        moveTrackTo(nextH);
        return;
      }

      // se acabaron los paneles: saltamos a la siguiente/anterior sección vertical
      goToSection(currentSection + direction, direction > 0 ? 0 : hPanels.length - 1);
      return;
    }

goToSection(currentSection + direction, direction > 0 ? 0 : hPanels.length - 1);
  }

  Observer.create({
    target: window,
    type: 'wheel,touch',
    wheelSpeed: 1,
    tolerance: 10,
    preventDefault: true,
onDown: () => handleMove(1),  // scroll hacia abajo / swipe arriba → avanza
    onUp: () => handleMove(-1),   // scroll hacia arriba / swipe abajo → retrocede
  });

  // Permite navegar también con las flechas del teclado
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowDown' || e.key === 'PageDown') handleMove(1);
    if (e.key === 'ArrowUp' || e.key === 'PageUp') handleMove(-1);
  });
}