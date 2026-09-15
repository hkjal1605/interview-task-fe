import { Aftermath } from "aftermath-ts-sdk";
import { SuiGrpcClient } from "@mysten/sui/grpc";
import type { Transaction } from "@mysten/sui/transactions";
import { MAINNET_GRPC_URL } from "../config/dapp-kit";
import { estimateAfSuiMist, MIN_STAKE_MIST } from "../lib/amount";

let sdkPromise: Promise<Aftermath> | null = null;
const mainnetClient = new SuiGrpcClient({
  network: "mainnet",
  baseUrl: MAINNET_GRPC_URL,
});

async function getSdk(): Promise<Aftermath> {
  if (!sdkPromise) {
    sdkPromise = Aftermath.create({
      network: "MAINNET",
      fullnodeUrl: MAINNET_GRPC_URL,
    }).catch((error) => {
      sdkPromise = null;
      throw error;
    });
  }
  return sdkPromise;
}

export async function getStakePreview(suiMist: bigint): Promise<{ afSuiMist: bigint; rate: number }> {
  const staking = (await getSdk()).Staking();
  const rate = await staking.getAfSuiToSuiExchangeRate();
  return { afSuiMist: estimateAfSuiMist(suiMist, rate), rate };
}

async function createStakeTransaction(walletAddress: string, suiMist: bigint): Promise<Transaction> {
  const staking = (await getSdk()).Staking();
  const validators = await staking.getActiveValidators();
  const validator = validators[0];
  if (!validator) throw new Error("No active validator is available for staking.");
  return staking.getStakeTransaction({
    walletAddress,
    suiStakeAmount: suiMist,
    validatorAddress: validator.suiAddress,
  });
}

export async function buildStakeTransaction(walletAddress: string, suiMist: bigint): Promise<Transaction> {
  return createStakeTransaction(walletAddress, suiMist);
}

// Probe the actual transaction's gRPC gas estimate and keep a small cushion
// so "Max" remains executable when the wallet signs it.
export async function getMaxStakeAmount(walletAddress: string, balanceMist: bigint): Promise<bigint> {
  if (balanceMist <= MIN_STAKE_MIST) return 0n;
  const initialReserve = 50_000_000n;
  const gasCushion = 1_000_000n;
  const retryStep = 10_000_000n;
  let candidate = balanceMist - initialReserve;
  if (candidate < MIN_STAKE_MIST) candidate = MIN_STAKE_MIST;
  let lastBuildable = 0n;

  for (let attempt = 0; attempt < 8; attempt += 1) {
    try {
      const transaction = await createStakeTransaction(walletAddress, candidate);
      await transaction.build({ client: mainnetClient });
      const rawBudget = transaction.getData().gasData.budget;
      if (rawBudget === null) throw new Error("Could not estimate stake gas.");
      const spendable = balanceMist - BigInt(rawBudget) - gasCushion;
      lastBuildable = candidate;
      if (spendable < MIN_STAKE_MIST) return 0n;
      if (spendable === candidate || (spendable > candidate && spendable - candidate <= gasCushion)) {
        return candidate;
      }
      candidate = spendable;
    } catch {
      if (candidate <= MIN_STAKE_MIST) return lastBuildable;
      candidate = candidate - retryStep;
      if (candidate < MIN_STAKE_MIST) candidate = MIN_STAKE_MIST;
    }
  }
  return lastBuildable;
}
