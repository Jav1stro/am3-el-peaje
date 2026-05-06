import { create } from 'zustand'

const CAPTCHA_QUEUE = ['checkbox', 'image', 'absurd', 'distorted', 'tos']
const TOTAL_STEPS = 7 // 0:Email 1:EmailFailed 2:EmailSent 3:NoEmail 4:PhysicalCount 5:CaptchaRouter 6:Ending

const randomEndingIndex = () => Math.floor(Math.random() * 3)

const initialState = () => ({
  step: 0,
  email: '',
  degradationLevel: 0,
  captchaQueue: [...CAPTCHA_QUEUE],
  captchaIndex: 0,
  emailAttempts: 0,
  endingIndex: randomEndingIndex(),
  errors: 0,
  mathChallenge: null,
  phraseIndex: 0,
})

export const useFlowStore = create((set) => ({
  ...initialState(),

  nextStep: () => set((state) => ({ step: state.step + 1 })),

  goToStep: (step) => set({ step }),

  addError: () => set((state) => ({ errors: state.errors + 1 })),

  setEmail: (email) => set({ email, emailAttempts: 0 }),

  incrementEmailAttempts: () =>
    set((state) => ({ emailAttempts: state.emailAttempts + 1 })),

  setDegradation: (level) =>
    set({ degradationLevel: Math.min(Math.max(level, 0), 4) }),

  setMathChallenge: (challenge) => set({ mathChallenge: challenge }),

  advanceCaptcha: () =>
    set((state) => ({ captchaIndex: state.captchaIndex + 1 })),

  advancePhraseIndex: () =>
    set((state) => ({ phraseIndex: state.phraseIndex + 1 })),

  resetFlow: () => set({ ...initialState() }),
}))
