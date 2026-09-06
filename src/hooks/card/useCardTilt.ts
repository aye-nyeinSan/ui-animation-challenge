import { useCallback, useRef, type MouseEvent } from 'react';
import { MOTION } from '../../motion';

const MAX_ROTATE_X = -9;
const MAX_ROTATE_Y = 11;

export function useCardTilt(enabled: boolean) {
  const tilted = useRef<HTMLElement | null>(null);

  const onMouseMove = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (!enabled) return;
      const card = (event.target as HTMLElement).closest<HTMLElement>('[data-tilt]');
      if (!card) return;
      if (tilted.current && tilted.current !== card) tilted.current.style.transform = 'none';
      tilted.current = card;
      const rect = card.getBoundingClientRect();
      const rx = ((event.clientY - rect.top) / rect.height - 0.5) * MAX_ROTATE_X;
      const ry = ((event.clientX - rect.left) / rect.width - 0.5) * MAX_ROTATE_Y;
      card.style.transition = 'transform .18s linear';
      card.style.transform = `perspective(1000px) rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
    },
    [enabled],
  );

  const onMouseLeave = useCallback(() => {
    const card = tilted.current;
    if (!card) return;
    card.style.transition = `transform .6s ${MOTION.ease}`;
    card.style.transform = 'none';
    tilted.current = null;
  }, []);
  return { onMouseMove, onMouseLeave };
}
