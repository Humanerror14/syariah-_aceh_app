import { ChevronRight, ChevronLeft, FileText, ExternalLink } from 'lucide-react'
import { articles } from '../../data/articles'
import type { Article } from '../../data/articles'
import { useEduStore } from '../../store/useEduStore'

export function EduTab() {
  const { selectedArticle, setSelectedArticle } = useEduStore()
  
  return (
    <div
      className="max-w-5xl mx-auto"
    >
      {!selectedArticle ? (
        <ArticleList onSelect={setSelectedArticle} />
      ) : (
        <ArticleDetail article={selectedArticle} onBack={() => setSelectedArticle(null)} />
      )}
    </div>
  )
}

function ArticleList({ onSelect }: { onSelect: (a: Article) => void }) {
  return (
    <div className="space-y-12">
      <div>
        <h2 className="text-xs uppercase tracking-[0.4em] text-secondary font-bold mb-3">Pusat Pengetahuan</h2>
        <h1 className="text-4xl lg:text-5xl font-extrabold text-primary leading-tight">Pedoman Lengkap <br /> Zakat &amp; Tradisi</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map((item, i) => (
          <div
            key={i}
            onClick={() => onSelect(item)}
            className="maqam-card p-0 overflow-hidden cursor-pointer flex flex-col group active:scale-[0.98] transition-transform"
          >
            <div className="h-56 relative overflow-hidden">
              <img
                src={item.thumbnail}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-primary/10" />
              <div className="absolute top-4 left-4">
                <span className="text-[10px] font-bold tracking-[0.3em] text-white backdrop-blur-md bg-black/40 border border-white/10 px-2 py-1 rounded">
                  {item.tag}
                </span>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <h3 className="text-lg font-bold text-primary leading-tight line-clamp-2">{item.title}</h3>
              <p className="text-black leading-relaxed text-xs line-clamp-3 font-bold">{item.excerpt}</p>
              <div className="flex items-center text-[10px] font-bold text-secondary uppercase tracking-widest pt-2">
                Baca Detail <ChevronRight size={12} className="ml-1" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ArticleDetail({ article, onBack }: { article: Article; onBack: () => void }) {
  return (
    <div
      className="space-y-10"
    >
      <button
        onClick={onBack}
        className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-black transition-colors mb-4 uppercase tracking-widest"
      >
        <ChevronLeft size={16} /> Kembali ke Daftar
      </button>

      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold tracking-widest text-secondary uppercase bg-secondary/10 px-2 py-0.5 rounded">
              {article.tag}
            </span>
          </div>
          <h1 className="text-3xl lg:text-5xl font-serif font-extrabold text-primary leading-[1.1] tracking-tight">
            {article.title}
          </h1>
          <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
            <span>Pedoman Syariah Aceh</span>
            <span>•</span>
            <span>2 Menit Baca</span>
          </div>
        </div>

        {/* Thumbnail */}
        <div className="space-y-2">
          <div className="rounded-2xl overflow-hidden bg-surface-low aspect-video lg:aspect-[21/9]">
            <img src={article.thumbnail} alt={article.title} className="w-full h-full object-cover" />
          </div>
          <p className="text-[10px] text-slate-400 italic text-center">Foto: Dokumentasi Syariah Aceh / Ilustrasi Artikel</p>
        </div>

        {/* Content Section */}
        <div className="prose prose-slate max-w-none">
          <div className="w-full">
            <p className="text-maqam-text leading-[1.7] text-sm lg:text-base whitespace-pre-wrap font-sans font-medium text-justify">
              {article.content}
            </p>
          </div>

          {/* PDF Reference */}
          {article.pdfUrl && (
            <div className="my-12 p-6 bg-surface-low border-l-4 border-primary rounded-r-2xl flex flex-col sm:flex-row items-center justify-between gap-6 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <FileText size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-primary">Dokumen Referensi Resmi</p>
                  <p className="text-[10px] text-slate-400">Fatwa & Pedoman Faraidh</p>
                </div>
              </div>
              <a
                href={article.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg text-[10px] font-bold hover:bg-emerald-900 transition-all uppercase tracking-widest"
              >
                Unduh PDF <ExternalLink size={12} />
              </a>
            </div>
          )}

          {/* Footer Navigation */}
          <div className="mt-16 pt-8 border-t border-slate-100 flex justify-center">
            <button
              onClick={onBack}
              className="text-xs font-bold text-slate-400 hover:text-primary transition-colors flex items-center gap-2 uppercase tracking-widest"
            >
              <ChevronLeft size={16} /> Kembali ke Indeks Artikel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
