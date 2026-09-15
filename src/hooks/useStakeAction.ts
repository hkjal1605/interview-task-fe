import { useState } from "react";
import { useDAppKit } from "@mysten/dapp-kit-react";
import { buildStakeTransaction } from "../services/staking-service";

export function useStakeAction() {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [digest, setDigest] = useState<string | null>(null);
  const dAppKit = useDAppKit();

  async function stake(walletAddress: string, suiMist: bigint) {
    setPending(true);
    setError(null);
    setDigest(null);
    try {
      const transaction = await buildStakeTransaction(walletAddress, suiMist);
      const result = await dAppKit.signAndExecuteTransaction({ transaction });
      if (result.FailedTransaction) {
        throw new Error(result.FailedTransaction.status.error?.message ?? "The stake transaction failed.");
      }
      setDigest(result.Transaction.digest);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The stake transaction failed.");
    } finally {
      setPending(false);
    }
  }

  return { stake, pending, error, digest };
}
