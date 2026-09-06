import { TAX_RATE } from "../constants/menu";

export interface OrderLine {
  readonly name: string;
  readonly price: number;
  readonly qty: number;
}

export interface OrderState {
  readonly order: readonly OrderLine[];
  readonly trayOpen: boolean;
  readonly paid: boolean;
  readonly receipt: readonly OrderLine[];
}

export type OrderAction =
  | { type: "add"; name: string; price: number }
  | { type: "step"; name: string; delta: number }
  | { type: "clear" }
  | { type: "place" }
  | { type: "toggleTray" };

export const initialOrderState: OrderState = {
  order: [],
  trayOpen: false,
  paid: false,
  receipt: [],
};

export function orderReducer(
  state: OrderState,
  action: OrderAction,
): OrderState {
  switch (action.type) {
    case "add": {
      const existing = state.order.find((line) => line.name === action.name);
      const order = existing
        ? state.order.map((line) =>
            line.name === action.name ? { ...line, qty: line.qty + 1 } : line,
          )
        : [...state.order, { name: action.name, price: action.price, qty: 1 }];
      return { ...state, order, trayOpen: true, paid: false };
    }
    case "step": {
      const order = state.order
        .map((line) =>
          line.name === action.name
            ? { ...line, qty: line.qty + action.delta }
            : line,
        )
        .filter((line) => line.qty > 0);
      return { ...state, order, trayOpen: order.length > 0, paid: false };
    }
    case "clear":
      return initialOrderState;
    case "place":
      if (state.order.length === 0) return state;
      return { order: [], trayOpen: false, paid: true, receipt: state.order };
    case "toggleTray":
      return { ...state, trayOpen: !state.trayOpen };
  }
}

export function selectBilled(state: OrderState): readonly OrderLine[] {
  return state.paid ? state.receipt : state.order;
}

export function selectItemCount(state: OrderState): number {
  return state.order.reduce((n, line) => n + line.qty, 0);
}

export function selectSubtotal(state: OrderState): number {
  return selectBilled(state).reduce(
    (total, line) => total + line.qty * line.price,
    0,
  );
}

export function selectTrayVisible(state: OrderState): boolean {
  return state.trayOpen && selectItemCount(state) > 0 && !state.paid;
}

export function selectHasOpenOrder(state: OrderState): boolean {
  return state.order.length > 0 && !state.paid;
}

export function formatMoney(value: number): string {
  return `$${value.toFixed(2)}`;
}

export { TAX_RATE };
