import { useCurrentClient } from "@mysten/dapp-kit-react";
import { useQuery } from "@tanstack/react-query";

export function useWalletSuiBalance(walletAddress: string | null) {
  const client = useCurrentClient();
  const query = useQuery({
    queryKey: ["sui-balance", walletAddress],
    queryFn: async () => {
      if (!walletAddress) throw new Error("Connect a wallet to load its balance.");
      return client.getBalance({ owner: walletAddress, coinType: "0x2::sui::SUI" });
    },
    enabled: walletAddress !== null,
    refetchInterval: 15_000,
    refetchOnWindowFocus: true,
  });
  return {
    balanceMist: query.data ? BigInt(query.data.balance.balance) : null,
    loading: walletAddress !== null && query.isPending,
    error: query.isError ? query.error.message : null,
    refetch: query.refetch,
  };
}
