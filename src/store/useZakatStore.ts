import { create } from 'zustand'

interface ZakatState {
  wealth: string
  wealthUnit: 'idr' | 'gram'
  familyCount: string
  ricePrice: string
  setWealth: (wealth: string) => void
  setWealthUnit: (unit: 'idr' | 'gram') => void
  setFamilyCount: (count: string) => void
  setRicePrice: (price: string) => void
}

export const useZakatStore = create<ZakatState>((set) => ({
  wealth: '',
  wealthUnit: 'idr',
  familyCount: '1',
  ricePrice: '15000',
  setWealth: (wealth) => set({ wealth }),
  setWealthUnit: (unit) => set({ wealthUnit: unit }),
  setFamilyCount: (count) => set({ familyCount: count }),
  setRicePrice: (price) => set({ ricePrice: price })
}))
