import { useCallback, type MouseEvent } from 'react';
import { useOrder } from './useOrder';

export function useAddToOrder() {
  const { dispatch } = useOrder();
  return useCallback(
    (event: MouseEvent<HTMLElement>) => {
      const button = (event.target as HTMLElement).closest<HTMLElement>('[data-item]');
      const name = button?.dataset.item;
      if (!name) return;
      dispatch({ type: 'add', name, price: Number.parseFloat(button.dataset.price ?? '0') || 0 });
    },
    [dispatch],
  );
}
