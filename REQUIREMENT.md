**Build a SUI → afSUI Staking Page (Aftermath SDK)**

## Goal

Create a React web app with a **Stake** page that:

* Connects a Sui wallet,
* Lets the user input an **Amount In (SUI)**,
* Fetches current on-chain data needed to compute expected **afSUI** received,
* Builds, signs, and executes the **stake** transaction,

## Tech Requirements

* **Language**: TypeScript (JavaScript acceptable)
* **Framework**: React
* **Packages**:

  * `aftermath-ts-sdk`
  * `@mysten/sui`
  * `@mysten/dapp-kit`

## Constraints

* No mocks — pull real data and send real transactions.

## Functional Requirements

1. **Wallet Connect**

   * Use `@mysten/dapp-kit` to connect a wallet and display the connected address.
2. **Inputs**

   * One numeric field: **Amount In (SUI)**.
3. **Preview**

   * Show the **estimated afSUI** to be received based on current on-chain state (e.g., exchange rate / index).
4. **Execute Stake**

   * Build the **stake** transaction using the Aftermath SDK.
   * Sign and execute with the connected wallet.
5. **UX & Errors**

   * Loading indicators for preview and transaction.
   * The **Stake** button is enabled only with valid input and a connected wallet.

## Non-Functional

* Correct handling of **token decimals** and formatting.
* Separate business logic from UI components.
* Minimal, clean UI (any styling approach is fine).

## How to Deliver

1. We provide a boilerplate repo for you to fork.
2. Implement the task in your fork.
3. Open a **PR into the fork** with your solution.
4. In your fork’s README, include:

   * Setup & run instructions,
   * Any environment variables used.