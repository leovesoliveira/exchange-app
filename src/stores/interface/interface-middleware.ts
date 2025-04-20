import { StateCreator } from "zustand";
import { persist } from "zustand/middleware";
import { InterfaceStore } from "./interface-store";

export const interfaceMiddleware = (
  store: StateCreator<InterfaceStore, [["zustand/persist", unknown]]>,
) => persist(store, { name: "InterfaceStore" });
