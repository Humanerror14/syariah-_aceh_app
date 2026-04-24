import { create } from 'zustand'

interface AppState {
  goldPrice: number
  loadingPrice: boolean
  setGoldPrice: (price: number) => void
  setLoadingPrice: (loading: boolean) => void
}

export const useAppStore = create<AppState>((set) => ({
  goldPrice: 0,
  loadingPrice: true,
  setGoldPrice: (price) => set({ goldPrice: price }),
  setLoadingPrice: (loading) => set({ loadingPrice: loading })
}))
