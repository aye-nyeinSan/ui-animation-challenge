import { useEffect, type RefObject } from 'react';
import { selectHasOpenOrder } from './orderReducer';
import { useOrder } from '../hooks/order/useOrder';

interface OrderMotionBridgeProps {
  readonly hasOpenOrderRef: RefObject<boolean>;
  readonly repaintReceiptRef: RefObject<() => void>;
}

export function OrderMotionBridge({ hasOpenOrderRef, repaintReceiptRef }: OrderMotionBridgeProps) {
  const { state } = useOrder();

  useEffect(() => {
    hasOpenOrderRef.current = selectHasOpenOrder(state);
    repaintReceiptRef.current();
  }, [state, hasOpenOrderRef, repaintReceiptRef]);
  return null;
}
