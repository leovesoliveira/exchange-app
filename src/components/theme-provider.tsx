import { useInterfaceStore } from "@/stores/interface/interface-store";
import { PropsWithChildren, useEffect } from "react";

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const { theme } = useInterfaceStore();

  useEffect(() => {
    const root = window.document.documentElement;

    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";

      root.classList.add(systemTheme);
      return;
    }

    root.classList.add(theme);
  }, [theme]);

  return <>{children}</>;
};
