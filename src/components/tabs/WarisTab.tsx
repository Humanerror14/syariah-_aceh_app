import { Scale, CheckCircle2, ChevronRight, Info, XCircle, ShieldAlert } from 'lucide-react'
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
    if (field === 'husband' && !warisHeirs.husband) {
        // Jika pilih suami, pastikan istri 0
        setWarisHeirs(prev => ({ ...prev, husband: true, wives: 0 }))
    } else {
        setWarisHeirs(prev => ({ ...prev, [field]: !prev[field] }))
    }
  }

  const updateHeirCount = (field: keyof Heirs, delta: number, max?: number) => {
    setWarisHeirs(prev => {
      let nextValue = Math.max(0, (prev[field] as number) + delta)
      if (max !== undefined) nextValue = Math.min(nextValue, max)
      
      // Jika tambah istri, pastikan suami false
      if (field === 'wives' && nextValue > 0) {
          return { ...prev, [field]: nextValue, husband: false }
      }
      return { ...prev, [field]: nextValue }
    })
  }

  const renderBooleanToggle = (field: keyof Heirs, label: string) => (
    <button
      onClick={() => toggleHeir(field)}
      className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 
        ${warisHeirs[field] 
          ? 'border-primary bg-primary text-white shadow-md ring-2 ring-primary/20' 
          : 'border-surface-high bg-surface-low text-slate-500 hover:border-primary/40'}`}
    >
      {warisHeirs[field] && <CheckCircle2 size={14} />} 
      {label}
    </button>
  )

  const renderCounter = (field: keyof Heirs, label: string, max?: number) => (
    <div className="flex items-center justify-between p-3 rounded-xl bg-surface-lowest border border-surface-high">
      <span className="text-xs font-bold text-slate-600">{label}</span>
      <div className="flex items-center gap-3">
        <button onClick={() => updateHeirCount(field, -1, max)} className="w-7 h-7 rounded-lg bg-surface-high flex items-center justify-center hover:bg-slate-200 transition-colors">-</button>
        <span className="font-bold text-sm w-4 text-center text-primary">{warisHeirs[field]}</span>
        <button onClick={() => updateHeirCount(field, 1, max)} className="w-7 h-7 rounded-lg bg-surface-high flex items-center justify-center hover:bg-slate-200 transition-colors">+</button>
      </div>
    </div>
  )

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

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Inputs Sidebar */}
        <div className="xl:col-span-5 space-y-6">
          <div className="maqam-card space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-2">1. Data Harta</h3>
            <div className="space-y-3">
                <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">Total Harta Waris</label>
                <input
                    type="text"
                    inputMode="numeric"
                    className="maqam-input text-base py-2"
                    value={formatInputNumber(warisAssets)}
                    onChange={(e) => handleFormattedInput(e.target.value, setWarisAssets)}
                />
                </div>
                <div className="grid grid-cols-2 gap-3">
                    <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">Utang</label>
                    <input
                        type="text"
                        inputMode="numeric"
                        className="maqam-input text-base py-2"
                        value={formatInputNumber(warisDebts)}
                        onChange={(e) => handleFormattedInput(e.target.value, setWarisDebts)}
                    />
                    </div>
                    <div>
                    <label className="text-[10px] uppercase font-bold text-slate-400 mb-1 block">Wasiat (Maks 1/3)</label>
                    <input
                        type="text"
                        inputMode="numeric"
                        className="maqam-input text-base py-2"
                        value={formatInputNumber(warisBequests)}
                        onChange={(e) => handleFormattedInput(e.target.value, setWarisBequests)}
                    />
                    </div>
                </div>
            </div>
          </div>

          <div className="maqam-card space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest">2. Ahli Waris</h3>
                <span className="text-[10px] font-bold px-2 py-1 bg-surface-high rounded-md text-slate-500">22 Golongan</span>
            </div>
            
            {/* Group 1: Leluhur & Pasangan */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2">
                    <div className="h-px bg-slate-200 flex-1"></div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Leluhur & Pasangan</span>
                    <div className="h-px bg-slate-200 flex-1"></div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    {renderBooleanToggle('husband', 'Suami')}
                    {renderCounter('wives', 'Istri (Maks 4)', 4)}
                    {renderBooleanToggle('father', 'Ayah')}
                    {renderBooleanToggle('mother', 'Ibu')}
                    {renderBooleanToggle('grandfather', 'Kakek dr Ayah')}
                    <div className="col-span-2 grid grid-cols-2 gap-2">
                        {renderBooleanToggle('grandmotherMaternal', 'Nenek dr Ibu')}
                        {renderBooleanToggle('grandmotherPaternal', 'Nenek dr Ayah')}
                    </div>
                </div>
            </div>

            {/* Group 2: Keturunan */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2 mt-6">
                    <div className="h-px bg-slate-200 flex-1"></div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Keturunan (Furu')</span>
                    <div className="h-px bg-slate-200 flex-1"></div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {renderCounter('sons', 'Anak Laki-laki')}
                    {renderCounter('daughters', 'Anak Perempuan')}
                    {renderCounter('grandsons', 'Cucu Lk (dr Anak Lk)')}
                    {renderCounter('granddaughters', 'Cucu Pr (dr Anak Lk)')}
                </div>
            </div>

            {/* Group 3: Kerabat Samping */}
            <div className="space-y-3">
                <div className="flex items-center gap-2 mb-2 mt-6">
                    <div className="h-px bg-slate-200 flex-1"></div>
                    <span className="text-[10px] uppercase font-bold text-slate-400">Kerabat Samping (Hawasyi)</span>
                    <div className="h-px bg-slate-200 flex-1"></div>
                </div>
                <div className="space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {renderCounter('fullBrothers', 'Sdr Lk Kandung')}
                        {renderCounter('fullSisters', 'Sdr Pr Kandung')}
                        {renderCounter('consanguineBrothers', 'Sdr Lk Sebapak')}
                        {renderCounter('consanguineSisters', 'Sdr Pr Sebapak')}
                        {renderCounter('uterineBrothers', 'Sdr Lk Seibu')}
                        {renderCounter('uterineSisters', 'Sdr Pr Seibu')}
                    </div>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {renderCounter('fullNephews', 'Keponakan Lk Kndg')}
                        {renderCounter('consanguineNephews', 'Keponakan Lk Sbpk')}
                    </div>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {renderCounter('fullUncles', 'Paman Kandung')}
                        {renderCounter('consanguineUncles', 'Paman Sebapak')}
                        {renderCounter('fullCousins', 'Sepupu Lk Kndg')}
                        {renderCounter('consanguineCousins', 'Sepupu Lk Sbpk')}
                    </div>
                </div>
            </div>

            <button
              onClick={handleCalculateWaris}
              className="w-full py-4 bg-secondary text-emerald-950 font-extrabold rounded-2xl flex items-center justify-center gap-2 hover:bg-emerald-400 transition-all mt-6 shadow-lg shadow-secondary/20"
            >
              Hitung Pembagian <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Results Display */}
        <div className="xl:col-span-7 space-y-6">
          {!warisResult ? (
            <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-center p-12 border-2 border-dashed border-surface-high rounded-3xl bg-surface-low/30 sticky top-6">
              <div className="w-16 h-16 bg-surface-lowest rounded-2xl shadow-xl flex items-center justify-center mb-6">
                <Scale className="text-slate-200" size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-300">Formulasi Faraidh Belum Dijalankan</h3>
              <p className="text-slate-400 text-sm max-w-xs mx-auto mt-2">Silakan isi data ahli waris secara teliti dan klik tombol hitung untuk melihat rincian pembagian.</p>
            </div>
          ) : (
            <div className="space-y-6 sticky top-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2 bg-emerald-900/80 backdrop-blur-xl p-6 rounded-2xl text-white shadow-xl shadow-emerald-900/10">
                  <p className="text-[10px] uppercase font-bold text-emerald-200/50 mb-1">Harta Bersih Yang Dibagi</p>
                  <h3 className="text-3xl font-serif font-bold">{formatIDR(warisResult.netInheritance)}</h3>
                </div>
                <div className="bg-surface-low border border-surface-high p-6 rounded-2xl">
                  <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Utang & Wasiat</p>
                  <h3 className="text-xl font-bold text-primary">{formatIDR(Number(warisDebts) + warisResult.bequests)}</h3>
                </div>
              </div>

              <div className="maqam-card">
                <div className="flex items-center justify-between mb-6 border-b border-surface-high pb-4">
                    <h3 className="text-sm font-bold text-primary uppercase tracking-widest">Penerima Hak Waris</h3>
                    <span className="text-xs font-bold bg-primary text-white px-3 py-1 rounded-full">
                        {warisResult.details.filter(d => d.status === 'Mendapat Bagian').length} Golongan
                    </span>
                </div>
                
                <div className="space-y-3">
                  {warisResult.details.filter(d => d.status === 'Mendapat Bagian').map((detail, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-surface-lowest border border-slate-100 rounded-xl hover:shadow-md transition-all group gap-4 relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-secondary rounded-l-xl"></div>
                      <div className="flex items-center gap-4 pl-2">
                        <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center text-secondary font-bold text-xs shrink-0">
                          {idx + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-primary text-sm sm:text-base">{detail.label}</h4>
                            {detail.count > 1 && (
                                <span className="text-[9px] font-bold bg-slate-100 text-slate-500 px-1.5 py-0.5 rounded-md">x{detail.count}</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-bold px-2 py-0.5 bg-primary text-white rounded-md">{detail.fraction}</span>
                            <span className="text-[10px] font-bold text-slate-300">•</span>
                            <span className="text-[10px] font-bold text-slate-500">{(detail.percentage * 100).toFixed(2)}% Hak</span>
                          </div>
                        </div>
                      </div>
                      <div className="sm:text-right pl-16 sm:pl-0">
                        <div className="text-xl font-serif font-bold text-primary">
                          {formatIDR(Math.floor(detail.nominal))}
                        </div>
                        {detail.count > 1 && (
                            <div className="text-[10px] text-slate-400 mt-1">
                                {formatIDR(Math.floor(detail.nominal / detail.count))} / orang
                            </div>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {warisResult.details.filter(d => d.status === 'Mendapat Bagian').length === 0 && (
                      <div className="text-center p-6 bg-slate-50 rounded-xl border border-slate-100 text-slate-400 text-sm font-bold">
                          Tidak ada ahli waris yang mendapatkan bagian.
                      </div>
                  )}
                </div>

                {warisResult.details.some(d => d.status === 'Mahjub') && (
                    <div className="mt-8 pt-6 border-t border-dashed border-surface-high">
                        <div className="flex items-center gap-2 mb-4">
                            <ShieldAlert size={16} className="text-red-500" />
                            <h3 className="text-xs font-bold text-red-500 uppercase tracking-widest">Ahli Waris Mahjub (Terhalang)</h3>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {warisResult.details.filter(d => d.status === 'Mahjub').map((detail, idx) => (
                                <div key={idx} className="flex items-start gap-3 p-3 bg-red-500/10 border border-red-500/20 rounded-xl">
                                    <XCircle size={16} className="text-red-500/70 shrink-0 mt-0.5" />
                                    <div>
                                        <h4 className="text-sm font-bold text-primary">{detail.label}</h4>
                                        <p className="text-[10px] text-red-500 font-medium mt-0.5">
                                            Terhalang oleh: <span className="font-bold">{detail.blockedBy}</span>
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-8 p-4 bg-slate-50 rounded-xl flex items-start gap-3 border border-slate-100">
                  <Info size={16} className="text-slate-400 shrink-0 mt-0.5" />
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    *Kalkulator ini menggunakan metodologi <strong>Fiqh Mazhab Syafi'i</strong>. Telah dilengkapi dengan sistem Hijab Hirman, perhitungan 'Aul, Radd, dan 'Asabah. Harap konsultasikan kembali hasil perhitungan dengan Kyai, Ustaz, atau Pengadilan Agama setempat untuk kepastian hukum final.
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
