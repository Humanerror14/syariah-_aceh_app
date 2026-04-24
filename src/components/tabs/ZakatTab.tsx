import { TrendingUp, Droplets, Info } from 'lucide-react'
import { motion } from 'framer-motion'
import { formatIDR, formatInputNumber, handleFormattedInput } from '../../utils/format'
import { calculateZakatFitrah } from '../../logic/zakat'
import { useZakatStore } from '../../store/useZakatStore'
import { useAppStore } from '../../store/useAppStore'

export function ZakatTab() {
  const { goldPrice, loadingPrice } = useAppStore()
  const {
    wealth, setWealth,
    wealthUnit, setWealthUnit,
    familyCount, setFamilyCount,
    ricePrice, setRicePrice
  } = useZakatStore()

  const isWealthInGrams = wealthUnit === 'gram'
  const wealthNum = Number(wealth) || 0
  const nisabValue = isWealthInGrams ? 93 : goldPrice * 93
  const zakatMalAmount = wealthNum >= nisabValue ? wealthNum * 0.025 : 0
  const zakatFitrahResult = calculateZakatFitrah(Number(familyCount) || 1, Number(ricePrice) || 0)

  return (
    <motion.div
      key="zakat"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-12"
    >
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h2 className="text-xs uppercase tracking-[0.4em] text-secondary font-bold mb-3">Manajemen Keuangan</h2>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-primary leading-tight">Pengelolaan <br /> Zakat Syariah</h1>
        </div>
        <div className="text-left lg:text-right">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest mb-1">Status Pasar Emas</p>
          <p className="text-xl lg:text-2xl font-serif font-bold text-maqam-text">
            {loadingPrice ? 'Syncing...' : formatIDR(goldPrice)}
            <span className="text-xs text-slate-400 font-sans font-normal ml-1">/gr</span>
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Zakat Mal */}
        <div className="maqam-card space-y-6">
          <div className="flex items-center gap-3 border-b border-surface-high pb-4">
            <TrendingUp className="text-secondary" size={20} />
            <h3 className="text-lg font-bold">Kalkulasi Zakat Mal</h3>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs uppercase tracking-wider text-slate-400 font-bold">Total Nilai Harta</label>
                <div className="flex bg-surface-low p-1 rounded-lg text-[10px]">
                  <button
                    onClick={() => setWealthUnit('idr')}
                    className={`px-3 py-1 rounded-md transition-all ${wealthUnit === 'idr' ? 'bg-surface-lowest shadow-sm text-primary font-bold' : 'text-slate-400'}`}
                  >RUPIAH (IDR)</button>
                  <button
                    onClick={() => setWealthUnit('gram')}
                    className={`px-3 py-1 rounded-md transition-all ${wealthUnit === 'gram' ? 'bg-surface-lowest shadow-sm text-primary font-bold' : 'text-slate-400'}`}
                  >GRAM (GR)</button>
                </div>
              </div>
              <div className="relative group">
                <input
                  type={wealthUnit === 'idr' ? 'text' : 'number'}
                  inputMode={wealthUnit === 'idr' ? 'numeric' : 'decimal'}
                  placeholder={wealthUnit === 'idr' ? 'Rp 0' : '0 gr'}
                  className="maqam-input text-xl font-bold relative z-10"
                  value={wealthUnit === 'idr' ? formatInputNumber(wealth) : wealth}
                  onChange={(e) => wealthUnit === 'idr' ? handleFormattedInput(e.target.value, setWealth) : setWealth(e.target.value)}
                />
                <div className="input-focus-ring" />
              </div>
            </div>
          </div>

          <div className="bg-surface-high/50 rounded-2xl p-6 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Ambang Batas Nisab (93gr):</span>
              <span className="font-bold">{isWealthInGrams ? '93 Gram' : formatIDR(goldPrice * 93)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Kadar Zakat:</span>
              <span className="font-bold">2.5%</span>
            </div>
          </div>

          <div className="pt-6 text-center lg:text-left">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-2">Estimasi Pembayaran</p>
            <h4 className="text-4xl lg:text-5xl font-serif text-primary font-bold">
              {isWealthInGrams ? `${zakatMalAmount.toFixed(2)} gr` : formatIDR(zakatMalAmount)}
            </h4>
            {wealthNum < nisabValue && wealthNum > 0 && (
              <div className="mt-4 inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold uppercase tracking-wider">
                <Info size={12} /> Harta Belum Mencapai Nisab
              </div>
            )}
          </div>
        </div>

        {/* Zakat Fitrah */}
        <div className="maqam-card space-y-6 bg-emerald-900/80 backdrop-blur-xl text-white border border-white/10">
          <div className="flex items-center gap-3 border-b border-white/10 pb-4">
            <Droplets className="text-secondary" size={20} />
            <h3 className="text-lg font-bold">Zakat Fitrah</h3>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-[10px] uppercase tracking-wider text-emerald-200/60 block mb-2 font-bold">Jumlah Jiwa dalam Keluarga</label>
              <div className="relative group">
                <input
                  type="number"
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:ring-2 focus:ring-secondary/90 outline-none font-bold text-xl relative z-10 transition-all"
                  value={familyCount}
                  onChange={(e) => setFamilyCount(e.target.value)}
                />
                <div className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-focus-within:opacity-100 border-2 border-secondary transition-all duration-300" />
              </div>
            </div>
            <div>
              <label className="text-[10px] uppercase tracking-wider text-emerald-200/60 block mb-2 font-bold">Estimasi Harga Beras Terkini (IDR/Kg)</label>
              <div className="relative group">
                <input
                  type="text"
                  inputMode="numeric"
                  className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:ring-2 focus:ring-secondary/90 outline-none font-bold text-xl relative z-10 transition-all"
                  value={formatInputNumber(ricePrice)}
                  onChange={(e) => handleFormattedInput(e.target.value, setRicePrice)}
                />
                <div className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-focus-within:opacity-100 border-2 border-secondary transition-all duration-300" />
              </div>
            </div>
          </div>

          <div className="pt-6 grid grid-cols-2 gap-4">
            <div className="p-4 bg-white/5 rounded-2xl">
              <p className="text-[10px] uppercase tracking-widest text-emerald-200/60 mb-1">Total Beras</p>
              <p className="text-xl font-bold">{zakatFitrahResult.weight.toFixed(1)} <span className="text-sm font-normal opacity-60">Kg</span></p>
            </div>
            <div className="p-4 bg-white/5 rounded-2xl">
              <p className="text-[10px] uppercase tracking-widest text-emerald-200/60 mb-1">Total Uang</p>
              <p className="text-xl font-bold text-secondary">{formatIDR(zakatFitrahResult.money)}</p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
