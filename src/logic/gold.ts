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

export const fetchGoldPrice = async (): Promise<number> => {
  // Try CoinGecko PAXG (Gold-backed token) first - Very reliable for IDR directly
  try {
    const response = await fetch('https://api.allorigins.win/get?url=' + encodeURIComponent('https://api.coingecko.com/api/v3/simple/price?ids=pax-gold&vs_currencies=idr'));
    if (response.ok) {
      const wrapper = await response.json();
      const data = JSON.parse(wrapper.contents);
      const idrPerOunce = data['pax-gold'].idr;
      const TROY_OUNCE_TO_GRAM = 31.1034768;
      return Math.round(idrPerOunce / TROY_OUNCE_TO_GRAM);
    }
  } catch (e) {
    console.warn('CoinGecko fetch failed, trying secondary API...', e);
  }

  // Secondary backup: Gold-API + Forex API
  try {
    const goldResponse = await fetch('https://api.gold-api.com/price/XAU');
    const forexResponse = await fetch('https://open.er-api.com/v6/latest/USD');
    
    if (goldResponse.ok && forexResponse.ok) {
      const goldData = await goldResponse.json();
      const forexData = await forexResponse.json();
      
      const usdPerOunce = goldData.price;
      const idrRate = forexData.rates.IDR;
      
      const TROY_OUNCE_TO_GRAM = 31.1034768;
      const idrPerGram = (usdPerOunce / TROY_OUNCE_TO_GRAM) * idrRate;
      
      return Math.round(idrPerGram);
    }
  } catch (error) {
    console.error('All gold APIs failed, using fallback:', error);
  }

  return FALLBACK_GOLD_PRICE;
};
