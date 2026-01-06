"use client";

import React, { createContext, useContext, useEffect, useMemo, useReducer } from "react";
import type { Order } from "@/src/models/Order";
import { MOCK_ORDERS } from "@/src/data/mockOrders";

type State = {
  balance: number;
  orders: Order[];
};

type Action =
  | { type: "topUp"; amount: number }
  | { type: "spend"; amount: number }
  | { type: "setOrders"; orders: Order[] }
  | { type: "updateOrder"; order: Order };

const STORAGE_KEY = "srochno_app_state_v1";

const initialState: State = {
  balance: 0,
  orders: MOCK_ORDERS,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "topUp":
      return { ...state, balance: state.balance + action.amount };
    case "spend":
      return { ...state, balance: Math.max(0, state.balance - action.amount) };
    case "setOrders":
      return { ...state, orders: action.orders };
    case "updateOrder":
      return {
        ...state,
        orders: state.orders.map((o) => (o.id === action.order.id ? action.order : o)),
      };
    default:
      return state;
  }
}

type AppStateApi = {
  state: State;
  topUp: (amount: number) => void;
  spend: (amount: number) => void;
  setOrders: (orders: Order[]) => void;
  updateOrder: (order: Order) => void;
};

const AppStateContext = createContext<AppStateApi | null>(null);

function safeParse(json: string | null): Partial<State> | null {
  if (!json) return null;
  try {
    return JSON.parse(json) as Partial<State>;
  } catch {
    return null;
  }
}

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    const stored = safeParse(typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null);
    if (stored?.balance != null) dispatch({ type: "topUp", amount: stored.balance });
    if (stored?.orders?.length) dispatch({ type: "setOrders", orders: stored.orders });
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const api: AppStateApi = useMemo(
    () => ({
      state,
      topUp: (amount) => dispatch({ type: "topUp", amount }),
      spend: (amount) => dispatch({ type: "spend", amount }),
      setOrders: (orders) => dispatch({ type: "setOrders", orders }),
      updateOrder: (order) => dispatch({ type: "updateOrder", order }),
    }),
    [state]
  );

  return <AppStateContext.Provider value={api}>{children}</AppStateContext.Provider>;
}

export default AppStateProvider;

export function useAppState() {
  const ctx = useContext(AppStateContext);
  if (!ctx) throw new Error("useAppState must be used within AppStateProvider");
  return ctx;
}
