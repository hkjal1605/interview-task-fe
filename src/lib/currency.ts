const usdFormatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatUsd(value: number): string {
  return usdFormatter.format(Number.isFinite(value) ? value : 0);
}

export function tokenAmountFromMist(value: bigint): number {
  return Number(value) / 1_000_000_000;
}
