import { formatMistFixed } from "../../../lib/amount";
import type { AmountOption } from "../../../hooks/useStakeAmountOptions";

type StakeBalanceProps = {
  connected: boolean;
  balanceMist: bigint | null;
  loading: boolean;
  maxPending: boolean;
  selected: AmountOption | null;
  onSelect: (option: AmountOption) => void;
};

const options: AmountOption[] = [25, 50, 75, "Max"];

export function StakeBalance({
  connected,
  balanceMist,
  loading,
  maxPending,
  selected,
  onSelect,
}: StakeBalanceProps) {
  const disabled = !connected || balanceMist === null || loading || maxPending;
  return (
    <div className="mt-3 flex min-h-7 flex-wrap items-center justify-between gap-x-4 gap-y-2">
      <div aria-live="polite" className="flex items-center gap-1 text-xs text-muted-foreground">
        <span>Available:</span>
        {loading ? "—" : (
          <span className="font-medium text-foreground tabular-nums">
            {balanceMist === null ? "—" : formatMistFixed(balanceMist)}
            {balanceMist !== null && <span className="ml-1 text-muted-foreground">SUI</span>}
          </span>
        )}
      </div>
      <fieldset className="ml-auto flex items-center gap-3">
        <legend className="sr-only">Choose amount from balance</legend>
        {options.map((option) => (
          <button
            key={option}
            type="button"
            disabled={disabled}
            aria-pressed={selected === option}
            onClick={() => onSelect(option)}
            className="relative px-0 py-1 text-xs font-medium text-muted-foreground transition-colors after:absolute after:inset-x-0 after:bottom-0 after:h-px after:origin-left after:scale-x-0 after:bg-primary after:transition-transform hover:text-foreground hover:after:scale-x-100 aria-pressed:text-primary aria-pressed:after:scale-x-100 disabled:cursor-not-allowed disabled:opacity-40 disabled:after:hidden"
          >
            {option === "Max" ? option : `${option}%`}
          </button>
        ))}
      </fieldset>
    </div>
  );
}
