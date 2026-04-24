import { create } from 'zustand'
import type { Article } from '../data/articles'

interface EduState {
  selectedArticle: Article | null
  setSelectedArticle: (article: Article | null) => void
}

export const useEduStore = create<EduState>((set) => ({
  selectedArticle: null,
  setSelectedArticle: (article) => set({ selectedArticle: article })
}))
