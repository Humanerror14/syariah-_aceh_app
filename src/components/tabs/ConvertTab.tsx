import { Scale, Info, ChevronRight } from 'lucide-react'
import { motion } from 'framer-motion'

// Fix: AnimatePresence comes from framer-motion not lucide
import { AnimatePresence as FMAnimatePresence } from 'framer-motion'
import { convertAcehToSI } from '../../logic/conversion'
import { useConvertStore } from '../../store/useConvertStore'

export function ConvertTab() {
  const {
    convValue, setConvValue,
    convUnit, setConvUnit,
    convOutputUnit, setConvOutputUnit,
    isSelectOpen, setIsSelectOpen
  } = useConvertStore()

  const unitLabel =
    convUnit === 'mayam' ? 'Mayam (3.33gr)' :
    convUnit === 'bungkal' ? 'Bungkal (16 Mayam)' :
    convUnit === 'bambu' ? 'Bambu / Are (Volume)' :
    convUnit === 'nalih_vol' ? 'Nalih (16 Bambu)' :
    convUnit === 'are_aceh' ? 'Are Aceh (Luas)' :
    convUnit === 'rante' ? 'Rante (~400m²)' : 'Nalih Tanah (~6400m²)'

  const getResult = () => {
    const result = convertAcehToSI(Number(convValue), convUnit)
    if ((convUnit.includes('mayam') || convUnit.includes('bungkal')) && convOutputUnit === 'kg')
      return (result / 1000).toLocaleString('id-ID', { maximumFractionDigits: 5 })
    if ((convUnit === 'are_aceh' || convUnit === 'nalih_land' || convUnit === 'rante') && convOutputUnit === 'ha')
      return (result / 10000).toLocaleString('id-ID', { maximumFractionDigits: 6 })
    return result.toLocaleString('id-ID', { maximumFractionDigits: 2 })
  }

  const resultUnit =
    convUnit.includes('mayam') || convUnit.includes('bungkal') ? (convOutputUnit === 'kg' ? 'Kg' : 'Gram') :
    convUnit.includes('vol') || convUnit === 'bambu' ? 'Liter' :
    (convOutputUnit === 'ha' ? 'Ha' : 'M²')

  const isGold = convUnit.includes('mayam') || convUnit.includes('bungkal')
  const isLand = convUnit === 'are_aceh' || convUnit === 'nalih_land' || convUnit === 'rante'

  return (
    <motion.div
      key="convert"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-12"
    >
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
        <div>
          <h2 className="text-xs uppercase tracking-[0.4em] text-secondary font-bold mb-3">Warisan Budaya</h2>
          <h1 className="text-4xl lg:text-5xl font-extrabold text-primary leading-tight">Konversi Satuan <br /> Tradisional Aceh</h1>
        </div>
        <div className="text-right hidden lg:block">
          <div className="p-3 bg-secondary/10 rounded-2xl border border-secondary/20">
            <Scale className="text-secondary" />
          </div>
        </div>
      </div>

      <div className="max-w-3xl">
        <div className="maqam-card relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-secondary opacity-[0.03] -mr-16 -mt-16 rounded-full" />

          <div className="flex flex-col lg:flex-row items-center gap-8">
            {/* Input Side */}
            <div className="flex-1 w-full space-y-6">
              {/* Unit Selector */}
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold mb-2 block">Pilih Satuan Lokal</label>
                <div className="relative group">
                  <button
                    onClick={() => setIsSelectOpen(!isSelectOpen)}
                    className="maqam-input font-bold bg-surface-high pr-10 relative z-10 w-full text-left flex justify-between items-center"
                  >
                    <span>{unitLabel}</span>
                  </button>
                  <div className="input-focus-ring" />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 z-20">
                    <motion.div animate={{ rotate: isSelectOpen ? 90 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronRight size={16} />
                    </motion.div>
                  </div>

                  <FMAnimatePresence>
                    {isSelectOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute top-full left-0 w-full mt-2 bg-surface-lowest shadow-2xl border border-surface-high z-50 overflow-hidden"
                      >
                        <div className="max-h-60 overflow-y-auto custom-scrollbar flex flex-col py-2">
                          <div className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-surface-low/50">Pengukuran Emas</div>
                          <button onClick={() => { setConvUnit('mayam'); setIsSelectOpen(false) }} className={`px-4 py-3 text-left font-bold transition-colors hover:bg-surface-low ${convUnit === 'mayam' ? 'text-primary bg-primary/5' : 'text-slate-600'}`}>Mayam (3.33gr)</button>
                          <button onClick={() => { setConvUnit('bungkal'); setIsSelectOpen(false) }} className={`px-4 py-3 text-left font-bold transition-colors hover:bg-surface-low ${convUnit === 'bungkal' ? 'text-primary bg-primary/5' : 'text-slate-600'}`}>Bungkal (16 Mayam)</button>

                          <div className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-surface-low/50 mt-2">Hasil Bumi & Padi</div>
                          <button onClick={() => { setConvUnit('bambu'); setIsSelectOpen(false) }} className={`px-4 py-3 text-left font-bold transition-colors hover:bg-surface-low ${convUnit === 'bambu' ? 'text-primary bg-primary/5' : 'text-slate-600'}`}>Bambu / Are (Volume)</button>
                          <button onClick={() => { setConvUnit('nalih_vol'); setIsSelectOpen(false) }} className={`px-4 py-3 text-left font-bold transition-colors hover:bg-surface-low ${convUnit === 'nalih_vol' ? 'text-primary bg-primary/5' : 'text-slate-600'}`}>Nalih (16 Bambu)</button>

                          <div className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-surface-low/50 mt-2">Luas Lahan Sawah</div>
                          <button onClick={() => { setConvUnit('are_aceh'); setConvOutputUnit('m2'); setIsSelectOpen(false) }} className={`px-4 py-3 text-left font-bold transition-colors hover:bg-surface-low ${convUnit === 'are_aceh' ? 'text-primary bg-primary/5' : 'text-slate-600'}`}>Are Aceh (Luas)</button>
                          <button onClick={() => { setConvUnit('rante'); setConvOutputUnit('m2'); setIsSelectOpen(false) }} className={`px-4 py-3 text-left font-bold transition-colors hover:bg-surface-low ${convUnit === 'rante' ? 'text-primary bg-primary/5' : 'text-slate-600'}`}>Rante (~400m²)</button>
                          <button onClick={() => { setConvUnit('nalih_land'); setConvOutputUnit('m2'); setIsSelectOpen(false) }} className={`px-4 py-3 text-left font-bold transition-colors hover:bg-surface-low ${convUnit === 'nalih_land' ? 'text-primary bg-primary/5' : 'text-slate-600'}`}>Nalih Tanah (~6400m²)</button>
                        </div>
                      </motion.div>
                    )}
                  </FMAnimatePresence>
                </div>
              </div>

              {/* Quantity Input */}
              <div>
                <label className="text-[10px] uppercase tracking-[0.2em] text-slate-400 font-bold mb-2 block">Kuantitas</label>
                <div className="relative group">
                  <input
                    type="number"
                    className="maqam-input font-serif text-3xl font-bold relative z-10"
                    value={convValue}
                    onChange={(e) => setConvValue(e.target.value)}
                  />
                  <div className="input-focus-ring" />
                </div>
              </div>
            </div>

            <div className="hidden lg:flex items-center justify-center p-4 bg-surface-low rounded-full">
              <ChevronRight className="text-secondary" />
            </div>

            {/* Result Side */}
            <div className="flex-1 w-full p-8 bg-emerald-900/80 backdrop-blur-xl border border-white/10 rounded-2xl text-center lg:text-left">
              <div className="flex justify-between items-start mb-3">
                <p className="text-[10px] uppercase tracking-[0.4em] text-emerald-200/50 font-bold">Hasil Standar (SI)</p>
                {isGold && (
                  <div className="flex bg-white/10 p-1 rounded-lg text-[9px] text-white">
                    <button onClick={() => setConvOutputUnit('gram')} className={`px-2 py-0.5 rounded transition-all ${convOutputUnit === 'gram' ? 'bg-surface-lowest text-primary font-bold' : 'opacity-60'}`}>GRAM</button>
                    <button onClick={() => setConvOutputUnit('kg')} className={`px-2 py-0.5 rounded transition-all ${convOutputUnit === 'kg' ? 'bg-surface-lowest text-primary font-bold' : 'opacity-60'}`}>KG</button>
                  </div>
                )}
                {isLand && (
                  <div className="flex bg-white/10 p-1 rounded-lg text-[9px] text-white">
                    <button onClick={() => setConvOutputUnit('m2')} className={`px-2 py-0.5 rounded transition-all ${convOutputUnit === 'm2' ? 'bg-surface-lowest text-primary font-bold' : 'opacity-60'}`}>M²</button>
                    <button onClick={() => setConvOutputUnit('ha')} className={`px-2 py-0.5 rounded transition-all ${convOutputUnit === 'ha' ? 'bg-surface-lowest text-primary font-bold' : 'opacity-60'}`}>HEKTARE</button>
                  </div>
                )}
              </div>
              <h4 className="text-5xl font-serif text-white font-bold leading-none">
                {getResult()}
                <span className="text-xl font-sans text-secondary font-medium ml-2 uppercase">{resultUnit}</span>
              </h4>
              <div className="mt-8 pt-6 border-t border-white/5 flex items-start gap-3 opacity-60">
                <Info size={14} className="text-secondary shrink-0 mt-0.5" />
                <p className="text-[10px] text-emerald-100/70 leading-relaxed italic">
                  *Didasarkan pada revisi metrik terkini yang disepakati oleh lembaga adat Aceh Besar dan Pidie.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
