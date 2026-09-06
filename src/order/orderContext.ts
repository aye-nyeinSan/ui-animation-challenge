import { createContext } from 'react';
import type { OrderAction, OrderState } from './orderReducer';

export interface OrderContextValue {
  readonly state: OrderState;
  readonly dispatch: (action: OrderAction) => void;
}

export const OrderContext = createContext<OrderContextValue | null>(null);
