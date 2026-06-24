import { create } from 'zustand'
import { decideResult, applyResult, applyJoinPenalty } from '../data/progressLogic'
import { PROGRESS } from '../data/progressConfig'

export const useProgressStore = create((set, get) => ({
  percent: 0,
  visitorId: crypto.randomUUID(),
  lastResult: null,
  connectedVisitors: [],
  ceilingHits: 0,
  totalFails: 0,
  showEnding: false,

  recordCaptchaResult: () => {
    const { totalFails } = get()
    const result = totalFails >= PROGRESS.MAX_FAILS ? 'pass' : decideResult()
    const newPercent = applyResult(get().percent, result)
    const newFails = result === 'fail' ? totalFails + 1 : totalFails
    const hits = newPercent >= PROGRESS.CEILING_THRESHOLD
      ? get().ceilingHits + 1
      : get().ceilingHits

    if (hits >= PROGRESS.CEILING_HITS_FOR_ENDING) {
      set({ percent: newPercent, lastResult: result, ceilingHits: hits, totalFails: newFails, showEnding: true })
    } else {
      set({ percent: newPercent, lastResult: result, ceilingHits: hits, totalFails: newFails })
    }
    return result
  },

  resetAll: () => set({ percent: 0, ceilingHits: 0, totalFails: 0, showEnding: false, lastResult: null, showJoinAlert: false }),

  showJoinAlert: false,

  applyJoinPenalty: () =>
    set((state) => ({
      percent: applyJoinPenalty(state.percent),
      showJoinAlert: true,
    })),

  clearJoinAlert: () => set({ showJoinAlert: false }),

  setConnectedVisitors: (visitors) => set({ connectedVisitors: visitors }),

  resetLastResult: () => set({ lastResult: null }),
}))
