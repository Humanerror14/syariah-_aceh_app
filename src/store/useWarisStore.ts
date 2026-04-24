import { create } from 'zustand'
import type { Heirs, InheritanceResult } from '../logic/waris'

interface WarisState {
  warisAssets: string
  warisDebts: string
  warisBequests: string
  warisHeirs: Heirs
  warisResult: InheritanceResult | null
  setWarisAssets: (assets: string) => void
  setWarisDebts: (debts: string) => void
  setWarisBequests: (bequests: string) => void
  setWarisHeirs: (heirs: Heirs | ((prev: Heirs) => Heirs)) => void
  setWarisResult: (result: InheritanceResult | null) => void
}

export const useWarisStore = create<WarisState>((set) => ({
  warisAssets: '100000000',
  warisDebts: '0',
  warisBequests: '0',
  warisHeirs: {
    husband: false, wife: false,
    sons: 0, daughters: 0,
    father: false, mother: false,
    fullBrothers: 0, fullSisters: 0,
    grandfather: false, grandmother: false
  },
  warisResult: null,
  setWarisAssets: (assets) => set({ warisAssets: assets }),
  setWarisDebts: (debts) => set({ warisDebts: debts }),
  setWarisBequests: (bequests) => set({ warisBequests: bequests }),
  setWarisHeirs: (heirs) => set((state) => ({ 
    warisHeirs: typeof heirs === 'function' ? heirs(state.warisHeirs) : heirs 
  })),
  setWarisResult: (result) => set({ warisResult: result })
}))
