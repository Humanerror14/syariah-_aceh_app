/**
 * Gold Price API Integration
 * Fetches real-time gold price for Zakat calculation.
 */

const FALLBACK_GOLD_PRICE = 1300000; // IDR per gram (estimated)

export interface GoldPriceResponse {
  price: number;
  currency: string;
  timestamp: number;
  success: boolean;
}

export const fetchGoldPrice = async (): Promise<number> => {
  try {
    // Fetch Gold Price in USD per Troy Ounce
    const goldResponse = await fetch('https://api.gold-api.com/price/XAU');
    if (!goldResponse.ok) throw new Error('Failed to fetch gold price');
    const goldData = await goldResponse.json();
    const usdPerOunce = goldData.price;

    // Fetch USD to IDR Exchange Rate
    const forexResponse = await fetch('https://open.er-api.com/v6/latest/USD');
    if (!forexResponse.ok) throw new Error('Failed to fetch forex rate');
    const forexData = await forexResponse.json();
    const idrRate = forexData.rates.IDR;

    // Calculate Price in IDR per gram
    // 1 Troy Ounce = 31.1034768 grams
    const TROY_OUNCE_TO_GRAM = 31.1034768;
    const usdPerGram = usdPerOunce / TROY_OUNCE_TO_GRAM;
    const idrPerGram = usdPerGram * idrRate;

    // Return the rounded price
    return Math.round(idrPerGram);
  } catch (error) {
    console.error('Failed to fetch real gold price, using fallback:', error);
    return FALLBACK_GOLD_PRICE;
  }
};
