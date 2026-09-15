import { useState } from "react";
import { formatMist } from "../lib/amount";
import { getMaxStakeAmount } from "../services/staking-service";

export type AmountOption = 25 | 50 | 75 | "Max";

export function useStakeAmountOptions(setAmount: (amount: string) => void) {
  const [selected, setSelected] = useState<AmountOption | null>(null);
  const [maxPending, setMaxPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function select(option: AmountOption, walletAddress: string, balanceMist: bigint) {
    setError(null);
    if (option !== "Max") {
      setAmount(formatMist((balanceMist * BigInt(option)) / 100n));
      setSelected(option);
      return;
    }
    setMaxPending(true);
    try {
      const maxMist = await getMaxStakeAmount(walletAddress, balanceMist);
      if (maxMist === 0n) {
        setAmount("");
        setSelected(null);
        setError("Your balance does not cover the 1 SUI minimum plus gas.");
      } else {
        setAmount(formatMist(maxMist));
        setSelected("Max");
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not calculate the maximum stake amount.");
    } finally {
      setMaxPending(false);
    }
  }

  function clearSelected() {
    setSelected(null);
    setError(null);
  }

  return { select, selected, clearSelected, maxPending, error };
}
