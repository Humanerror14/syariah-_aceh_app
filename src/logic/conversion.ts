/**
 * Aceh Traditional Unit Conversions
 * Based on common regional standards and scientific references.
 */

// WEIGHT (Emas)
export const WEIGHT_CONVERSIONS = {
  MAYAM_TO_GRAM: 3.33,
  BUNGKAL_TO_MAYAM: 16,
  BUNGKAL_TO_GRAM: 16 * 3.33, // 53.28
};

// VOLUME (Beras/Hasil Bumi)
export const VOLUME_CONVERSIONS = {
  BAMBU_TO_LITER: 2.0, // Rough estimate, often 1 bambu = 2 liter
  NALIH_TO_BAMBU: 16,
  ARE_TO_BAMBU: 1, // In some contexts Are = Bambu
};

// LAND AREA (Luas Tanah)
// 1 Nalih land is generally 16 Rante
// 1 Rante = 400m2
export const LAND_CONVERSIONS = {
  NALIH_TO_SQM: 16 * 400, // 6400m2
  RANTE_TO_SQM: 400,
  ARE_ACEH_TO_SQM: 2500 / 16, // 156.25 (keeping old reference if needed or as variant)
  SI_ARE_TO_SQM: 100,
};

export type ConversionUnit = 'mayam' | 'bungkal' | 'nalih_vol' | 'bambu' | 'nalih_land' | 'are_aceh' | 'rante';

/**
 * Convert Traditional Aceh to SI (Metric)
 */
export const convertAcehToSI = (value: number, unit: ConversionUnit): number => {
  switch (unit) {
    case 'mayam':
      return value * WEIGHT_CONVERSIONS.MAYAM_TO_GRAM;
    case 'bungkal':
      return value * WEIGHT_CONVERSIONS.BUNGKAL_TO_GRAM;
    case 'bambu':
      return value * VOLUME_CONVERSIONS.BAMBU_TO_LITER;
    case 'nalih_vol':
      return value * VOLUME_CONVERSIONS.NALIH_TO_BAMBU * VOLUME_CONVERSIONS.BAMBU_TO_LITER;
    case 'nalih_land':
      return value * LAND_CONVERSIONS.NALIH_TO_SQM;
    case 'are_aceh':
      return value * LAND_CONVERSIONS.ARE_ACEH_TO_SQM;
    case 'rante':
      return value * LAND_CONVERSIONS.RANTE_TO_SQM;
    default:
      return value;
  }
};

/**
 * Convert SI (Metric) to Traditional Aceh
 */
export const convertSIToAceh = (value: number, unit: ConversionUnit): number => {
  switch (unit) {
    case 'mayam':
      return value / WEIGHT_CONVERSIONS.MAYAM_TO_GRAM;
    case 'bungkal':
      return value / WEIGHT_CONVERSIONS.BUNGKAL_TO_GRAM;
    case 'bambu':
      return value / VOLUME_CONVERSIONS.BAMBU_TO_LITER;
    case 'nalih_vol':
      return (value / VOLUME_CONVERSIONS.BAMBU_TO_LITER) / VOLUME_CONVERSIONS.NALIH_TO_BAMBU;
    case 'nalih_land':
      return value / LAND_CONVERSIONS.NALIH_TO_SQM;
    case 'are_aceh':
      return value / LAND_CONVERSIONS.ARE_ACEH_TO_SQM;
    case 'rante':
      return value / LAND_CONVERSIONS.RANTE_TO_SQM;
    default:
      return value;
  }
};
