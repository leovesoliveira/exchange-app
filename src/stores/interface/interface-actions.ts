import { themeActions } from "./actions/theme-actions";
import { InterfaceState, Theme } from "./interface-state";

export type InterfaceActions = {
  setTheme: (currency: Theme) => void;
};

export type Action<T> = (
  set: (fn: (state: InterfaceState) => InterfaceState) => void,
) => T;

export const actions = {
  theme: themeActions,
};
