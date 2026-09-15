export const SUI_COIN_TYPE = "0x2::sui::SUI";
export const AFSUI_COIN_TYPE =
  "0xf325ce1300e8dac124071d3152c5c5ee6174914f8bc2161e88329cf579246efc::afsui::AFSUI";

const BIRDEYE_PRICE_URL = "https://public-api.birdeye.so/defi/price";
const BIRDEYE_RATE_LIMIT_DELAY_MS = 1_100;

type BirdeyePriceResponse = {
  success: boolean;
  data?: { value?: number; updateUnixTime?: number };
  message?: string;
};

export type TokenPrices = {
  suiUsd: number;
  afSuiUsd: number;
  updatedAt: number;
};

function wait(milliseconds: number) {
  return new Promise<void>((resolve) => window.setTimeout(resolve, milliseconds));
}

async function fetchTokenPrice(coinType: string): Promise<{ value: number; updatedAt: number }> {
  if (!__BIRDEYE_API_KEY__) throw new Error("Birdeye API key is not configured.");

  const url = new URL(BIRDEYE_PRICE_URL);
  url.searchParams.set("address", coinType);
  const response = await fetch(url, {
    headers: {
      accept: "application/json",
      "x-chain": "sui",
      "X-API-KEY": __BIRDEYE_API_KEY__,
    },
  });
  const payload = (await response.json()) as BirdeyePriceResponse;
  const value = payload.data?.value;
  if (!response.ok || !payload.success || typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(payload.message || "Live token prices are unavailable.");
  }
  return { value, updatedAt: (payload.data?.updateUnixTime ?? 0) * 1_000 };
}

export async function getTokenPrices(): Promise<TokenPrices> {
  const sui = await fetchTokenPrice(SUI_COIN_TYPE);
  // The supplied Birdeye plan permits one request per second.
  await wait(BIRDEYE_RATE_LIMIT_DELAY_MS);
  const afSui = await fetchTokenPrice(AFSUI_COIN_TYPE);
  return {
    suiUsd: sui.value,
    afSuiUsd: afSui.value,
    updatedAt: Math.min(sui.updatedAt, afSui.updatedAt),
  };
}
