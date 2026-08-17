import { gsap } from 'gsap';

export function initNavLine() {
  const path = document.querySelector('.nav-line-active');
  if (!path) return () => {};

  const totalLength = path.getTotalLength();
  const segmentLength = totalLength * 0.18; // longitud fija del tramo visible (18% del recorrido)

  gsap.set(path, {
    strokeDasharray: `${segmentLength} ${totalLength}`,
    strokeDashoffset: 0,
  });

  return function update(progress, duration = 1, ease = 'power2.inOut') {
    const clamped = Math.max(0, Math.min(1, progress));
    const maxOffset = totalLength - segmentLength;
    gsap.to(path, {
      strokeDashoffset: -clamped * maxOffset,
      duration,
      ease,
    });
  };
}