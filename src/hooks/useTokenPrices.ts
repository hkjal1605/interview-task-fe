import { useQuery } from "@tanstack/react-query";
import { getTokenPrices } from "../services/prices-service";

export function useTokenPrices() {
  const query = useQuery({
    queryKey: ["birdeye-token-prices", "sui", "afsui"],
    queryFn: getTokenPrices,
    staleTime: 10_000,
    refetchInterval: 15_000,
    retry: 1,
  });

  return {
    prices: query.data ?? null,
    loading: query.isPending,
    refreshing: query.isFetching && !query.isPending,
    error: query.error instanceof Error ? query.error.message : query.error ? "Live token prices are unavailable." : null,
  };
}
