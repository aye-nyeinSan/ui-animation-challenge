import { use } from 'react';
import { OrderContext, type OrderContextValue } from './orderContext';

export function useOrder(): OrderContextValue {
  const value = use(OrderContext);
  if (!value) throw new Error('useOrder must be used inside <OrderProvider>');
  return value;
}
