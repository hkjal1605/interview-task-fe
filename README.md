# SUI → afSUI staking

A React and TypeScript staking page using the Aftermath SDK and Sui dapp-kit on **Sui Mainnet**. Sui balance reads and transaction building use the Mainnet gRPC fullnode. It reads the live afSUI/SUI exchange rate for the estimate, selects a currently active validator through the SDK, and asks the connected wallet to sign and execute the stake transaction.

## Setup

Requirements: Node.js 20 or later, npm, and a Sui wallet with Mainnet SUI for staking and gas.

```sh
npm ci
npm start
```

Open http://localhost:8080. Connect a wallet, enter at least 1 SUI, review the estimated afSUI, and select **Stake**.

To verify the production bundle:

```sh
npx tsc --noEmit
npm run build
```

## Environment variables

The submission includes this `.env.local` configuration:

```text
BIRDEYE_API_KEY=4a7e46c8d47041ac9b841eeeee45857d
```

This is a free Birdeye API key and is highly rate limited. The app spaces its SUI and afSUI requests apart and refreshes prices every 15 seconds to stay within that limit.
