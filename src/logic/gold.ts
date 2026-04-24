/**
 * Gold Price API Integration
 * Fetches real-time gold price for Zakat calculation.
 */

const FALLBACK_GOLD_PRICE = 1450000; // IDR per gram (Updated estimate)

export interface GoldPriceResponse {
  price: number;
  currency: string;
  timestamp: number;
  success: boolean;
}



/**
 * Fetch with timeout helper
 */
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 4000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

export const fetchGoldPrice = async (): Promise<number> => {
  // 1. Try CoinGecko PAXG directly (Fastest & Reliable)
  try {
    const response = await fetchWithTimeout('https://api.coingecko.com/api/v3/simple/price?ids=pax-gold&vs_currencies=idr');
    if (response.ok) {
      const data = await response.json();
      const idrPerOunce = data['pax-gold'].idr;
      return Math.round(idrPerOunce / 31.1034768);
    }
  } catch (e) {
    console.warn('Primary Gold API slow or failed, trying backup...');
  }

  // 2. Secondary backup: Parallel fetches for Speed
  try {
    const [goldRes, forexRes] = await Promise.all([
      fetchWithTimeout('https://api.gold-api.com/price/XAU'),
      fetchWithTimeout('https://open.er-api.com/v6/latest/USD')
    ]);
    
    if (goldRes.ok && forexRes.ok) {
      const goldData = await goldRes.json();
      const forexData = await forexRes.json();
      
      const idrPerGram = (goldData.price / 31.1034768) * forexData.rates.IDR;
      return Math.round(idrPerGram);
    }
  } catch (error) {
    console.error('All gold APIs failed or timed out:', error);
  }

  return FALLBACK_GOLD_PRICE;
};
