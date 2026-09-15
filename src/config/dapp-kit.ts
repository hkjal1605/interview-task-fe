import { createDAppKit } from "@mysten/dapp-kit-react";
import { SuiGrpcClient } from "@mysten/sui/grpc";

export const MAINNET_GRPC_URL = "https://fullnode.mainnet.sui.io:443";

export const dAppKit = createDAppKit({
  networks: ["mainnet"],
  defaultNetwork: "mainnet",
  createClient: (network) =>
    new SuiGrpcClient({
      network,
      baseUrl: MAINNET_GRPC_URL,
    }),
  autoConnect: true,
  storage: localStorage,
  storageKey: "aftermath-stake-dapp-kit",
});

declare module "@mysten/dapp-kit-react" {
  interface Register {
    dAppKit: typeof dAppKit;
  }
}
