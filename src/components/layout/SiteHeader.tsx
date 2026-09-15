import { WalletButton } from "../wallet/WalletButton";

export function SiteHeader() {
  return (
    <header className="flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border px-4 sm:h-12">
      <div className="flex items-center gap-3">
        <span className="flex size-7 items-center justify-center rounded-md bg-primary text-sm font-bold text-primary-foreground">a</span>
        <span className="text-base font-medium tracking-tight">Aftermath</span>
      </div>
      <WalletButton />
    </header>
  );
}
