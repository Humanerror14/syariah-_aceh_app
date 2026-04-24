import { useState, useEffect } from 'react'
import { Scale, Menu, X, Moon, Sun } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { fetchGoldPrice } from './logic/gold'
import { useAppStore } from './store/useAppStore'
import { useEduStore } from './store/useEduStore'

import { SidebarContent, DesktopSidebar } from './components/Sidebar'
import { ZakatTab } from './components/tabs/ZakatTab'
import { ConvertTab } from './components/tabs/ConvertTab'
import { EduTab } from './components/tabs/EduTab'
import { WarisTab } from './components/tabs/WarisTab'

type TabId = 'zakat' | 'convert' | 'edu' | 'waris'

function App() {
  const [activeTab, setActiveTab] = useState<TabId>('zakat')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  const { setGoldPrice, setLoadingPrice } = useAppStore()
  const { setSelectedArticle } = useEduStore()
  
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' ||
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
    return false
  })

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
      localStorage.setItem('theme', 'dark')
    } else {
      document.documentElement.classList.remove('dark')
      localStorage.setItem('theme', 'light')
    }
  }, [isDarkMode])

  useEffect(() => {
    if (activeTab !== 'edu') {
      setSelectedArticle(null)
    }
  }, [activeTab, setSelectedArticle])

  useEffect(() => {
    async function init() {
      const price = await fetchGoldPrice()
      setGoldPrice(price)
      setLoadingPrice(false)
    }
    init()
  }, [setGoldPrice, setLoadingPrice])

  return (
    <div className="flex min-h-screen bg-surface selection:bg-secondary/30">
      {/* Desktop Sidebar */}
      <DesktopSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        sidebarCollapsed={sidebarCollapsed}
        setSidebarCollapsed={setSidebarCollapsed}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        setMobileMenuOpen={setMobileMenuOpen}
      />

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 w-full bg-surface/80 backdrop-blur-md z-40 px-6 py-4 flex justify-between items-center border-b border-slate-100">
        <div className="flex items-center gap-2">
          <Scale className="text-primary" size={24} />
          <span className="font-serif font-bold text-lg">Syariah</span>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-xl bg-surface-high text-primary hover:bg-secondary/20 transition-all border border-slate-100 dark:border-white/10"
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button onClick={() => setMobileMenuOpen(true)}>
            <Menu size={24} className="text-maqam-text" />
          </button>
        </div>
      </header>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 lg:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-surface-low z-50 lg:hidden shadow-2xl"
            >
              <div className="absolute right-4 top-4">
                <button onClick={() => setMobileMenuOpen(false)} className="p-2"><X size={24} /></button>
              </div>
              <SidebarContent 
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                sidebarCollapsed={false}
                isDarkMode={isDarkMode}
                setIsDarkMode={setIsDarkMode}
                setMobileMenuOpen={setMobileMenuOpen}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className={`flex-1 transition-all duration-500 ${sidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72'} min-h-screen pt-24 lg:pt-0`}>
        <div className="max-w-6xl mx-auto p-6 lg:p-12">
          <AnimatePresence mode="wait">
            {activeTab === 'zakat' && <ZakatTab />}
            {activeTab === 'convert' && <ConvertTab />}
            {activeTab === 'edu' && <EduTab />}
            {activeTab === 'waris' && <WarisTab />}
          </AnimatePresence>
        </div>
      </main>
    </div>
  )
}

export default App
