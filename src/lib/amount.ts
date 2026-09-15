export const SUI_DECIMALS = 9;
export const MIST_PER_SUI = 1_000_000_000n;
export const MIN_STAKE_MIST = MIST_PER_SUI;

export function parseSuiAmount(value: string): bigint | null {
  if (!/^(?:\d+)(?:\.\d{0,9})?$/.test(value)) return null;
  const [whole, fraction = ""] = value.split(".");
  return BigInt(whole) * MIST_PER_SUI + BigInt(fraction.padEnd(SUI_DECIMALS, "0") || "0");
}

export function formatMist(value: bigint): string {
  const whole = value / MIST_PER_SUI;
  const fraction = (value % MIST_PER_SUI).toString().padStart(SUI_DECIMALS, "0").replace(/0+$/, "");
  return fraction ? `${whole}.${fraction}` : whole.toString();
}

export function formatMistFixed(value: bigint, precision = 2): string {
  const safePrecision = Math.min(Math.max(precision, 0), SUI_DECIMALS);
  const divisor = 10n ** BigInt(SUI_DECIMALS - safePrecision);
  const rounded = (value + divisor / 2n) / divisor;
  if (safePrecision === 0) return rounded.toString();
  const scale = 10n ** BigInt(safePrecision);
  return `${rounded / scale}.${(rounded % scale).toString().padStart(safePrecision, "0")}`;
}

// The SDK rate is afSUI -> SUI. Divide the SUI amount by that live rate.
export function estimateAfSuiMist(suiMist: bigint, rate: number): bigint {
  if (!Number.isFinite(rate) || rate <= 0) throw new Error("The staking exchange rate is unavailable.");
  const decimal = rate.toString();
  if (!/^\d+(?:\.\d+)?$/.test(decimal)) throw new Error("The staking exchange rate is invalid.");
  const [whole, fraction = ""] = decimal.split(".");
  const scale = 10n ** BigInt(fraction.length);
  const numerator = BigInt(whole) * scale + BigInt(fraction || "0");
  return (suiMist * scale) / numerator;
}
