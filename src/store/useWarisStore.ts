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
    husband: false, wives: 0,
    father: false, mother: false,
    grandfather: false, grandmotherMaternal: false, grandmotherPaternal: false,
    sons: 0, daughters: 0, grandsons: 0, granddaughters: 0,
    fullBrothers: 0, fullSisters: 0,
    consanguineBrothers: 0, consanguineSisters: 0,
    uterineBrothers: 0, uterineSisters: 0,
    fullNephews: 0, consanguineNephews: 0,
    fullUncles: 0, consanguineUncles: 0,
    fullCousins: 0, consanguineCousins: 0
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
