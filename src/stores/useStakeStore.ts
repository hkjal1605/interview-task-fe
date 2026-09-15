import { create } from "zustand";

type StakeState = {
  amount: string;
  setAmount: (amount: string) => void;
};

export const useStakeStore = create<StakeState>((set) => ({
  amount: "",
  setAmount: (amount) => set({ amount }),
}));
