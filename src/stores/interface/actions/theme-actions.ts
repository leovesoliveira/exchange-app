import { Action, InterfaceActions } from "../interface-actions";

type ThemeActions = {
  set: Action<InterfaceActions["setTheme"]>;
};

export const themeActions: ThemeActions = {
  set: (set) => (theme) => {
    set((state) => ({ ...state, theme }));
  },
};
