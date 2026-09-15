import { useEffect, useState } from "react";
import { getStakePreview } from "../services/staking-service";

export function useStakePreview(suiMist: bigint | null) {
  const [state, setState] = useState<{ amount: bigint | null; loading: boolean; error: string | null }>({ amount: null, loading: false, error: null });

  useEffect(() => {
    if (suiMist === null) {
      setState({ amount: null, loading: false, error: null });
      return;
    }
    let cancelled = false;
    setState({ amount: null, loading: true, error: null });
    getStakePreview(suiMist).then(
      ({ afSuiMist }) => { if (!cancelled) setState({ amount: afSuiMist, loading: false, error: null }); },
      (error: unknown) => { if (!cancelled) setState({ amount: null, loading: false, error: error instanceof Error ? error.message : "Could not load the staking preview." }); },
    );
    return () => { cancelled = true; };
  }, [suiMist]);

  return state;
}
