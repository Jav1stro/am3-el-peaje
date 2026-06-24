import { create } from 'zustand'
import { decideResult, applyResult, applyJoinPenalty } from '../data/progressLogic'

export const useProgressStore = create((set, get) => ({
  percent: 0,
  visitorId: crypto.randomUUID(),
  lastResult: null,
  connectedVisitors: [],

  recordCaptchaResult: () => {
    const result = decideResult()
    set((state) => ({
      percent: applyResult(state.percent, result),
      lastResult: result,
    }))
    return result
  },

  applyJoinPenalty: () =>
    set((state) => ({
      percent: applyJoinPenalty(state.percent),
    })),

  setConnectedVisitors: (visitors) => set({ connectedVisitors: visitors }),

  resetLastResult: () => set({ lastResult: null }),
}))
