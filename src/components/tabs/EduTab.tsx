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

      <div className="max-w-3xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="text-xs font-bold tracking-[0.4em] text-secondary border border-secondary/20 px-3 py-1.5 rounded-full bg-secondary/5 inline-block uppercase italic">
            {article.tag}
          </span>
          <h1 className="text-4xl lg:text-5xl font-serif font-extrabold text-maqam-text leading-tight">
            {article.title}
          </h1>
          <div className="w-12 h-1 bg-secondary/30 mx-auto rounded-full" />
        </div>

        {/* Thumbnail */}
        <div className="relative h-64 lg:h-96 rounded-3xl overflow-hidden shadow-xl max-w-2xl mx-auto">
          <img src={article.thumbnail} alt={article.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 ring-1 ring-inset ring-black/10 rounded-3xl" />
        </div>

        {/* Content Card */}
        <div className="maqam-card !p-8 lg:!p-12 !rounded-[2rem] border-2 border-surface-high shadow-2xl bg-surface-lowest">
          <div className="w-full overflow-visible">
            <p className="text-maqam-text leading-[1.8] text-xl lg:text-2xl whitespace-pre-wrap font-sans font-medium">
              {article.content}
            </p>
          </div>


          {/* PDF Reference */}
          {article.pdfUrl && (
            <div className="mt-8 p-6 bg-surface-low border border-surface-high rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-center sm:text-left">
                <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-600 shadow-sm shrink-0">
                  <FileText size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-primary">Referensi Fatwa &amp; Dokumen Resmi</p>
                  <p className="text-xs text-slate-400">Silakan unduh untuk mempelajari lebih lanjut.</p>
                </div>
              </div>
              <a
                href={article.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-container transition-all shadow-lg shadow-primary/10"
              >
                Buka Dokumen PDF <ExternalLink size={14} />
              </a>
            </div>
          )}

          {/* Footer */}
          <div className="mt-12 pt-8 border-t border-surface-high flex flex-col sm:flex-row items-center justify-end gap-6">
            <button
              onClick={onBack}
              className="w-full sm:w-auto bg-surface-high text-primary px-8 py-3 rounded-xl font-bold text-sm hover:bg-secondary/20 transition-all flex items-center justify-center gap-2"
            >
              <ChevronLeft size={16} /> Kembali ke Daftar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
