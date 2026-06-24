import { create } from 'zustand'
import { decideResult, applyResult, applyJoinPenalty, computeFinalPhasePercent } from '../data/progressLogic'
import { PROGRESS } from '../data/progressConfig'

export const useProgressStore = create((set, get) => ({
  percent: 0,
  visitorId: crypto.randomUUID(),
  lastResult: null,
  connectedVisitors: [],
  ceilingHits: 0,
  totalFails: 0,
  showEnding: false,

  decideCaptchaResult: (captchaType) => {
    const { totalFails } = get()
    return captchaType === 'tos' || totalFails >= PROGRESS.MAX_FAILS ? 'pass' : decideResult()
  },

  applyCaptchaResult: (result) => {
    const { ceilingHits, percent, totalFails } = get()
    const newFails = result === 'fail' ? totalFails + 1 : totalFails
    const inFinalPhase = ceilingHits > 0

    let newPercent = percent
    let hits = ceilingHits

    if (inFinalPhase) {
      if (result === 'pass') {
        hits = ceilingHits + 1
        newPercent = computeFinalPhasePercent(hits)
      }
    } else {
      newPercent = applyResult(percent, result)
      if (result === 'pass' && newPercent >= PROGRESS.CEILING_THRESHOLD) {
        hits = 1
        newPercent = computeFinalPhasePercent(hits)
      }
    }

    if (hits >= PROGRESS.CEILING_HITS_FOR_ENDING) {
      set({ percent: newPercent, lastResult: result, ceilingHits: hits, totalFails: newFails, showEnding: true })
    } else {
      set({ percent: newPercent, lastResult: result, ceilingHits: hits, totalFails: newFails })
    }
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
