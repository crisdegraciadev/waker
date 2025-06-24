import { create } from "zustand";

type Store = {
  steps: { label: string; route: string }[];
  setSteps: (steps: { label: string; route: string }[]) => void;
};

export const useTopbarBreadcrumbStore = create<Store>()((set) => ({
  steps: [],
  setSteps: (steps) => set({ steps }),
}));
