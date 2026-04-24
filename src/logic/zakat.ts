/**
 * Zakat Logic based on Shafi'i Mazhab
 */

export const NISAB_GOLD_GRAMS = 85;
export const ZAKAT_RATE = 0.025; // 2.5%

/**
 * Calculate Zakat Mal (Wealth)
 * @param wealth Amount of wealth (money/gold value)
 * @param goldPrice Current gold price per gram
 * @returns Amount of zakat to pay
 */
export const calculateZakatMal = (wealth: number, goldPrice: number): number => {
  const nisabValue = NISAB_GOLD_GRAMS * goldPrice;
  if (wealth >= nisabValue) {
    return wealth * ZAKAT_RATE;
  }
  return 0;
};

/**
 * Calculate Zakat Fitrah
 * Based on 1 Sha' = 4 Mud = ~2.5 to 3kg of rice.
 * Often standardized in Indonesia as 2.5kg or 3.5 liters.
 * Standard in Aceh for 1445H/1446H is approx 2.8kg.
 */
export const calculateZakatFitrah = (familyCount: number, ricePricePerKg: number): { weight: number, money: number } => {
  const weightPerPerson = 2.8; // Standard Aceh
  const totalWeight = familyCount * weightPerPerson;
  const totalMoney = totalWeight * ricePricePerKg;
  
  return {
    weight: totalWeight,
    money: totalMoney
  };
};

/**
 * Calculate Zakat on Gold/Silver
 * @param weight Weight in grams
 * @param pricePerGram Price per gram
 */
export const calculateZakatGold = (weight: number, pricePerGram: number): number => {
  if (weight >= NISAB_GOLD_GRAMS) {
    return weight * pricePerGram * ZAKAT_RATE;
  }
  return 0;
};
