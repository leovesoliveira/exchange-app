import { create } from "zustand";
import { actions, InterfaceActions } from "./interface-actions";
import { interfaceMiddleware } from "./interface-middleware";
import { initialState, InterfaceState } from "./interface-state";

export type InterfaceStore = InterfaceState & InterfaceActions;

export const useInterfaceStore = create<InterfaceStore>()(
  interfaceMiddleware((set) => ({
    ...initialState,
    setTheme: actions.theme.set(set),
  })),
);
