import { useMemo, useReducer, type ReactNode } from 'react';
import { OrderContext } from './orderContext';
import { initialOrderState, orderReducer } from './orderReducer';

export function OrderProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(orderReducer, initialOrderState);
  const value = useMemo(() => ({ state, dispatch }), [state]);
  return <OrderContext value={value}>{children}</OrderContext>;
}
