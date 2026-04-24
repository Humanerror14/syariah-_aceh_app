import { Calculator, RefreshCcw, BookOpen, Coins, Scale, Moon, Sun, ChevronRight, ChevronLeft } from 'lucide-react'

type TabId = 'zakat' | 'convert' | 'edu' | 'waris'

interface SidebarProps {
  activeTab: TabId
  setActiveTab: (tab: TabId) => void
  sidebarCollapsed: boolean
  isDarkMode: boolean
  setIsDarkMode: (val: boolean) => void
  setMobileMenuOpen: (val: boolean) => void
}

const NAV_ITEMS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'zakat', label: 'Kalkulasi Zakat', icon: <Calculator size={22} /> },
  { id: 'convert', label: 'Konversi Aceh', icon: <RefreshCcw size={22} /> },
  { id: 'edu', label: 'Informasi Syariah', icon: <BookOpen size={22} /> },
  { id: 'waris', label: 'Hukum Waris', icon: <Coins size={22} /> },
]

export function SidebarContent({
  activeTab, setActiveTab, sidebarCollapsed, isDarkMode, setIsDarkMode, setMobileMenuOpen
}: SidebarProps) {
  return (
    <div className="flex flex-col h-full py-8 text-maqam-text">
      <div className={`px-6 mb-12 flex items-center gap-3 transition-all duration-300 ${sidebarCollapsed ? 'justify-center px-0' : ''}`}>
        <div className="p-2 bg-primary text-white rounded-xl shadow-lg">
          <Scale size={24} />
        </div>
        {!sidebarCollapsed && <span className="text-xl font-serif font-bold tracking-tight">Syariah<span className="text-secondary ml-1">Aceh</span></span>}
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => { setActiveTab(item.id); setMobileMenuOpen(false) }}
            className={`w-full group ${activeTab === item.id ? 'maqam-nav-item-active' : 'maqam-nav-item'} 
              ${sidebarCollapsed ? 'justify-center px-0' : ''} relative`}
          >
            <div className="min-w-[24px]">{item.icon}</div>
            {!sidebarCollapsed && <span className="whitespace-nowrap">{item.label}</span>}
            {sidebarCollapsed && (
              <div className="absolute left-full ml-4 px-3 py-1 bg-primary text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                {item.label}
              </div>
            )}
          </button>
        ))}
      </nav>

      <div className={`px-6 mt-auto py-6 transition-all ${sidebarCollapsed ? 'text-center px-0' : ''}`}>
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className={`w-full flex items-center gap-3 p-3 rounded-xl transition-all mb-4
            ${isDarkMode ? 'bg-secondary/20 text-secondary' : 'bg-primary/5 text-primary'}
            ${sidebarCollapsed ? 'justify-center px-0' : ''}`}
        >
          {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          {!sidebarCollapsed && <span className="text-xs font-bold uppercase tracking-wider">{isDarkMode ? 'Mode Terang' : 'Mode Gelap'}</span>}
        </button>
        <div className="w-2 h-2 rounded-full bg-emerald-500 mx-auto animate-pulse opacity-20"></div>
      </div>
    </div>
  )
}

interface DesktopSidebarProps extends SidebarProps {
  sidebarCollapsed: boolean
  setSidebarCollapsed: (val: boolean) => void
}

export function DesktopSidebar({ setSidebarCollapsed, ...props }: DesktopSidebarProps) {
  return (
    <aside
      className={`hidden lg:block fixed left-0 top-0 h-full bg-surface-low border-r border-slate-200/50 transition-all duration-500 ease-in-out z-40 
        ${props.sidebarCollapsed ? 'w-20' : 'w-72'}`}
    >
      <SidebarContent {...props} />
      <button
        onClick={() => setSidebarCollapsed(!props.sidebarCollapsed)}
        className="absolute -right-3 top-20 bg-surface-lowest border border-surface-high rounded-full p-1 shadow-md hover:text-primary transition-colors"
      >
        {props.sidebarCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </aside>
  )
}
