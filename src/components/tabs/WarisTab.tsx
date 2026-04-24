import { Scale, CheckCircle2, ChevronRight, Info } from 'lucide-react'
import { motion } from 'framer-motion'
import { formatIDR, formatInputNumber, handleFormattedInput } from '../../utils/format'
import { calculateInheritance } from '../../logic/waris'
import type { Heirs } from '../../logic/waris'
import { useWarisStore } from '../../store/useWarisStore'

export function WarisTab() {
  const {
    warisAssets, setWarisAssets,
    warisDebts, setWarisDebts,
    warisBequests, setWarisBequests,
    warisHeirs, setWarisHeirs,
    warisResult, setWarisResult
  } = useWarisStore()

  const handleCalculateWaris = () => {
    const res = calculateInheritance(
      Number(warisAssets),
      Number(warisDebts),
      Number(warisBequests),
      warisHeirs
    )
    setWarisResult(res)
  }

  const toggleHeir = (field: keyof Heirs) => {
    setWarisHeirs(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const updateHeirCount = (field: keyof Heirs, delta: number) => {
    setWarisHeirs(prev => ({
      ...prev,
      [field]: Math.max(0, (prev[field] as number) + delta)
    }))
  }

  return (
    <motion.div
      key="waris"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-12"
    >
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h2 className="text-xs uppercase tracking-[0.4em] text-secondary font-bold mb-3">Faroidh Engine</h2>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-primary leading-tight">Kalkulator Waris <br /> Syafi'i Mazhab</h1>
        </div>
        <div className="text-right hidden lg:block">
          <div className="p-3 bg-secondary/10 rounded-2xl border border-secondary/20">
            <Scale className="text-secondary" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Inputs Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="maqam-card space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Data Harta</h3>
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">Total Harta Waris</label>
              <input
                type="text"
                inputMode="numeric"
                className="maqam-input text-lg py-2"
                value={formatInputNumber(warisAssets)}
                onChange={(e) => handleFormattedInput(e.target.value, setWarisAssets)}
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">Utang Almarhum</label>
              <input
                type="text"
                inputMode="numeric"
                className="maqam-input text-lg py-2"
                value={formatInputNumber(warisDebts)}
                onChange={(e) => handleFormattedInput(e.target.value, setWarisDebts)}
              />
            </div>
            <div>
              <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">Wasiat (Maks 1/3)</label>
              <input
                type="text"
                inputMode="numeric"
                className="maqam-input text-lg py-2"
                value={formatInputNumber(warisBequests)}
                onChange={(e) => handleFormattedInput(e.target.value, setWarisBequests)}
              />
            </div>
          </div>

          <div className="maqam-card space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">Ahli Waris</h3>
            <div className="grid grid-cols-2 gap-3">
              {(['husband', 'wife', 'father', 'mother'] as const).map((field) => (
                <button
                  key={field}
                  onClick={() => toggleHeir(field)}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${warisHeirs[field] ? 'border-primary bg-primary text-white shadow-md ring-2 ring-primary/20' : 'border-surface-high bg-surface-low text-slate-500 hover:border-primary/40'}`}
                >
                  {warisHeirs[field] && <CheckCircle2 size={14} />} 
                  {field === 'husband' ? 'Suami' : field === 'wife' ? 'Istri' : field === 'father' ? 'Ayah' : 'Ibu'}
                </button>
              ))}
            </div>

            <div className="space-y-3 pt-4 border-t border-slate-100">
              {[
                { field: 'sons' as const, label: 'Anak Laki-laki' },
                { field: 'daughters' as const, label: 'Anak Perempuan' },
                { field: 'fullBrothers' as const, label: 'Sdr Kandung Lk' },
              ].map(({ field, label }) => (
                <div key={field} className="flex items-center justify-between">
                  <span className="text-xs font-bold text-primary">{label}</span>
                  <div className="flex items-center gap-3">
                    <button onClick={() => updateHeirCount(field, -1)} className="w-8 h-8 rounded-lg bg-surface-high flex items-center justify-center">-</button>
                    <span className="font-bold text-sm w-4 text-center">{warisHeirs[field]}</span>
                    <button onClick={() => updateHeirCount(field, 1)} className="w-8 h-8 rounded-lg bg-surface-high flex items-center justify-center">+</button>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleCalculateWaris}
              className="w-full py-4 bg-secondary text-primary font-extrabold rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-400 transition-all mt-4"
            >
              Hitung Pembagian <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Results Display */}
        <div className="lg:col-span-2 space-y-6">
          {!warisResult ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-surface-high rounded-3xl bg-surface-low/30">
              <div className="w-16 h-16 bg-surface-lowest rounded-2xl shadow-xl flex items-center justify-center mb-6">
                <Scale className="text-slate-200" size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-300">Formulasi Faraidh Belum Dijalankan</h3>
              <p className="text-slate-400 text-sm max-w-xs mx-auto mt-2">Silakan isi data ahli waris dan klik tombol hitung untuk melihat rincian pembagian.</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-emerald-900/80 backdrop-blur-xl p-6 rounded-2xl text-white">
                  <p className="text-[10px] uppercase font-bold text-emerald-200/50 mb-1">Harta Yang Dibagi (Net)</p>
                  <h3 className="text-3xl font-serif font-bold">{formatIDR(warisResult.netInheritance)}</h3>
                </div>
                <div className="bg-primary/5 p-6 rounded-2xl">
                  <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Total Utang & Wasiat</p>
                  <h3 className="text-2xl font-bold text-primary">{formatIDR(Number(warisDebts) + warisResult.bequests)}</h3>
                </div>
              </div>

              <div className="maqam-card">
                <h3 className="text-sm font-bold text-primary uppercase tracking-widest mb-6">Rincian Pembagian Ahli Waris</h3>
                <div className="space-y-4">
                  {warisResult.details.map((detail, idx) => (
                    <div key={idx} className="flex items-center justify-between p-4 bg-surface-low rounded-xl hover:bg-surface-lowest hover:shadow-md transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-surface-lowest border border-surface-high flex items-center justify-center text-primary font-bold text-xs ring-4 ring-surface-low">
                          {idx + 1}
                        </div>
                        <div>
                          <h4 className="font-bold text-primary">{detail.label}</h4>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-secondary">{detail.fraction}</span>
                            <span className="text-[10px] font-bold text-slate-400">|</span>
                            <span className="text-[10px] font-bold text-slate-400">{(detail.percentage * 100).toFixed(2)}%</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold text-primary">
                          {formatIDR(Math.floor(detail.nominal))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 p-4 bg-secondary/10 rounded-xl flex items-start gap-3">
                  <Info size={16} className="text-secondary shrink-0 mt-0.5" />
                  <p className="text-[10px] text-primary/70 leading-relaxed italic">
                    *Perhitungan ini didasarkan pada rujukan Fiqh Mazhab Syafi'i tentang Faraidh. Harap konsultasikan kembali dengan ahli agama setempat untuk kepastian hukum.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
