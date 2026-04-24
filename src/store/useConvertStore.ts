import { create } from 'zustand'
import type { ConversionUnit } from '../logic/conversion'

interface ConvertState {
  convValue: string
  convUnit: ConversionUnit
  convOutputUnit: 'gram' | 'kg' | 'm2' | 'ha'
  isSelectOpen: boolean
  setConvValue: (val: string) => void
  setConvUnit: (unit: ConversionUnit) => void
  setConvOutputUnit: (unit: 'gram' | 'kg' | 'm2' | 'ha') => void
  setIsSelectOpen: (isOpen: boolean) => void
}

export const useConvertStore = create<ConvertState>((set) => ({
  convValue: '1',
  convUnit: 'mayam',
  convOutputUnit: 'gram',
  isSelectOpen: false,
  setConvValue: (val) => set({ convValue: val }),
  setConvUnit: (unit) => set({ convUnit: unit }),
  setConvOutputUnit: (unit) => set({ convOutputUnit: unit }),
  setIsSelectOpen: (isOpen) => set({ isSelectOpen: isOpen })
}))
