/**
 * Utilitas Pemformatan Angka
 * Dipisahkan dari App.tsx agar bisa digunakan di banyak komponen
 * tanpa duplikasi kode.
 */

/**
 * Format angka ke format mata uang Rupiah Indonesia.
 * @example formatIDR(1500000) → "Rp 1.500.000"
 */
export const formatIDR = (val: number): string => {
  const rounded = Math.round(val)
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  })
    .format(rounded)
    .replace(/,00$/, '')
}

/**
 * Hapus semua karakter non-digit dari string.
 * @example parseRawNumber("1.500.000") → "1500000"
 */
export const parseRawNumber = (val: string): string => val.replace(/\D/g, '')

/**
 * Format string numerik ke format ribuan Indonesia untuk input.
 * @example formatInputNumber("1500000") → "1.500.000"
 */
export const formatInputNumber = (val: string): string => {
  const numeric = parseRawNumber(val)
  if (!numeric) return ''
  return new Intl.NumberFormat('id-ID').format(Number(numeric))
}

/**
 * Handler untuk input yang ter-format — strip format saat user mengetik.
 */
export const handleFormattedInput = (
  val: string,
  setter: (val: string) => void
): void => {
  setter(parseRawNumber(val))
}
