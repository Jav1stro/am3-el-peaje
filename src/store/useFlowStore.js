import { create } from 'zustand'

export const CAPTCHA_TYPES = ['checkbox', 'image', 'absurd', 'distorted', 'tos', 'microphone', 'security']

function shuffled(avoidFirst = null) {
  const arr = [...CAPTCHA_TYPES]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  if (avoidFirst && arr[0] === avoidFirst) {
    ;[arr[0], arr[1]] = [arr[1], arr[0]]
  }
  return arr
}

export const useFlowStore = create((set) => ({
  pool: shuffled(),
  poolIndex: 0,
  seq: 0,
  isVerifying: false,

  nextCaptcha: () =>
    set((state) => {
      const nextIndex = state.poolIndex + 1
      if (nextIndex < state.pool.length) {
        return { poolIndex: nextIndex, seq: state.seq + 1, isVerifying: false }
      }
      const lastType = state.pool[state.pool.length - 1]
      return { pool: shuffled(lastType), poolIndex: 0, seq: state.seq + 1, isVerifying: false }
    }),

  setVerifying: (v) => set({ isVerifying: v }),
}))
