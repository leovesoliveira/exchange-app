export type InterfaceState = {
  theme: Theme;
};

export const initialState: InterfaceState = {
  theme: "system",
};

export type Theme = "system" | "light" | "dark";
