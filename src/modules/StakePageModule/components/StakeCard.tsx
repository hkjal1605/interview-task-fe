import { useCurrentAccount } from "@mysten/dapp-kit-react";
import { Alert } from "../../../components/ui/alert";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Spinner } from "../../../components/ui/spinner";
import { useStakeAction } from "../../../hooks/useStakeAction";
import { useStakeAmountOptions } from "../../../hooks/useStakeAmountOptions";
import { useStakePreview } from "../../../hooks/useStakePreview";
import { useTokenPrices } from "../../../hooks/useTokenPrices";
import { useWalletSuiBalance } from "../../../hooks/useWalletSuiBalance";
import { formatMist, MIN_STAKE_MIST, parseSuiAmount } from "../../../lib/amount";
import { formatUsd, tokenAmountFromMist } from "../../../lib/currency";
import { useStakeStore } from "../../../stores/useStakeStore";
import { StakeBalance } from "./StakeBalance";

export function StakeCard() {
  const account = useCurrentAccount();
  const amount = useStakeStore((state) => state.amount);
  const setAmount = useStakeStore((state) => state.setAmount);
  const balance = useWalletSuiBalance(account?.address ?? null);
  const options = useStakeAmountOptions(setAmount);
  const parsed = parseSuiAmount(amount);
  const inputValid = parsed !== null && parsed >= MIN_STAKE_MIST;
  const hasGas = parsed !== null && balance.balanceMist !== null && parsed < balance.balanceMist;
  const preview = useStakePreview(inputValid ? parsed : null);
  const tokenPrices = useTokenPrices();
  const action = useStakeAction();
  const inputUsd = parsed !== null && tokenPrices.prices
    ? tokenAmountFromMist(parsed) * tokenPrices.prices.suiUsd
    : null;
  const expectedUsd = preview.amount !== null && tokenPrices.prices
    ? tokenAmountFromMist(preview.amount) * tokenPrices.prices.afSuiUsd
    : null;
  const slippageUsd = inputUsd !== null && expectedUsd !== null ? inputUsd - expectedUsd : null;
  const slippagePercent = slippageUsd !== null && inputUsd !== null && inputUsd > 0
    ? (slippageUsd / inputUsd) * 100
    : null;
  const isLoading = balance.loading || options.maxPending || preview.loading || tokenPrices.loading || action.pending;

  return (
    <section className="mx-auto w-full max-w-[440px] bg-transparent p-4 sm:p-6">
      <div className="flex items-start justify-between gap-3 rounded-lg border border-border bg-secondary/40 p-3">
        <div className="min-w-0 flex-1">
          <label htmlFor="stake-amount" className="block text-xs font-medium text-muted-foreground">Amount In</label>
          <Input
            id="stake-amount"
            type="number"
            inputMode="decimal"
            min="1"
            step="0.000000001"
            autoComplete="off"
            placeholder="0.00"
            value={amount}
            onChange={(event) => { options.clearSelected(); setAmount(event.target.value); }}
            aria-invalid={amount !== "" && (!inputValid || (balance.balanceMist !== null && !hasGas))}
            className="mt-2 h-auto !rounded-none !border-0 !bg-transparent !px-0 py-0 text-xl font-medium tabular-nums !outline-none !ring-0 focus:!border-0 focus:!outline-none focus:!ring-0 focus-visible:!border-0 focus-visible:!outline-none focus-visible:!ring-0 active:!border-0 active:!outline-none active:!ring-0"
          />
          <div aria-live="polite" className="mt-1 min-h-4 text-xs text-muted-foreground tabular-nums">
            {amount && inputUsd !== null ? `≈ ${formatUsd(inputUsd)}` : "—"}
          </div>
        </div>
        <span className="text-sm font-medium">SUI</span>
      </div>
      {amount !== "" && !inputValid && <p className="mt-2 text-xs text-destructive">Enter at least 1 SUI, with up to 9 decimal places.</p>}
      {parsed !== null && inputValid && balance.balanceMist !== null && !hasGas && (
        <p className="mt-2 text-xs text-destructive">
          {parsed > balance.balanceMist ? "Amount exceeds your available SUI balance." : "Leave some SUI for transaction gas."}
        </p>
      )}
      <StakeBalance
        connected={account !== null}
        balanceMist={balance.balanceMist}
        loading={balance.loading}
        maxPending={options.maxPending}
        selected={options.selected}
        onSelect={(option) => {
          if (account && balance.balanceMist !== null) void options.select(option, account.address, balance.balanceMist);
        }}
      />
      {balance.error && <div className="mt-3"><Alert>{balance.error}</Alert></div>}
      {options.error && <div className="mt-3"><Alert>{options.error}</Alert></div>}

      <div className="mt-5 flex items-start justify-between gap-3 rounded-lg border border-border bg-secondary/40 p-3">
        <div>
          <div className="text-xs font-medium text-muted-foreground">Estimated afSUI received</div>
          <div aria-live="polite" className="mt-2 text-xl font-medium tabular-nums">
            {preview.amount !== null ? formatMist(preview.amount) : "—"}
          </div>
          <div className="mt-1 min-h-4 text-xs text-muted-foreground tabular-nums">
            {expectedUsd !== null ? `≈ ${formatUsd(expectedUsd)}` : "—"}
          </div>
        </div>
        <span className="text-sm font-medium">afSUI</span>
      </div>
      <div className="flex items-center justify-between gap-4 border-b border-border px-1 py-4 text-xs">
        <span className="text-muted-foreground">Estimated slippage</span>
        <span className="font-medium tabular-nums">
          {slippagePercent !== null && slippageUsd !== null
            ? `${slippagePercent.toFixed(2)}% · ${formatUsd(slippageUsd)}`
            : "—"}
        </span>
      </div>
      {preview.error && <div className="mt-3"><Alert>{preview.error}</Alert></div>}
      {tokenPrices.error && <div className="mt-3"><Alert>{tokenPrices.error}</Alert></div>}

      <Button
        type="button"
        className="mt-5 w-full"
        aria-label={isLoading ? "Loading" : undefined}
        disabled={!account || !inputValid || !hasGas || isLoading || !!balance.error || preview.amount === null || !!preview.error}
        onClick={() => { if (account && parsed !== null) void action.stake(account.address, parsed); }}
      >
        {isLoading
          ? <span className="flex items-center justify-center"><Spinner /></span>
          : "Stake"}
      </Button>
      {!account && <p className="mt-3 text-center text-xs text-muted-foreground">Connect your wallet to stake.</p>}
      {action.error && <div className="mt-3"><Alert>{action.error}</Alert></div>}
      {action.digest && (
        <div className="mt-3"><Alert tone="success">Stake submitted. <a className="underline" href={`https://suiexplorer.com/txblock/${action.digest}?network=mainnet`} target="_blank" rel="noreferrer">View transaction</a></Alert></div>
      )}
    </section>
  );
}
