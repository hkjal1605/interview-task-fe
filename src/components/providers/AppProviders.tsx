import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { DAppKitProvider } from "@mysten/dapp-kit-react";
import { dAppKit } from "../../config/dapp-kit";

const queryClient = new QueryClient();

export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <DAppKitProvider dAppKit={dAppKit}>{children}</DAppKitProvider>
    </QueryClientProvider>
  );
}
