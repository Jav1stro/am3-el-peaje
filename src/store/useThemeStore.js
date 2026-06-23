import { create } from 'zustand'
import { getStoredThemeId, storeTheme } from '../data/themes'

export const useThemeStore = create((set) => ({
  themeId: getStoredThemeId(),

  setTheme: (id) => {
    storeTheme(id)
    set({ themeId: id })
  },
}))
