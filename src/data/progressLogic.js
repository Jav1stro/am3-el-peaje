import { PROGRESS } from './progressConfig'

function clamp(value) {
  return Math.max(PROGRESS.FLOOR, Math.min(PROGRESS.CEILING, value))
}

export function decideResult() {
  return Math.random() < PROGRESS.PASS_PROBABILITY ? 'pass' : 'fail'
}

export function applyResult(currentPercent, result) {
  if (result === 'pass') {
    return clamp(currentPercent + PROGRESS.PASS_POINTS)
  }
  return clamp(currentPercent - PROGRESS.FAIL_POINTS)
}

export function applyJoinPenalty(currentPercent) {
  return clamp(currentPercent - PROGRESS.JOIN_PENALTY)
}

export function computeFinalPhasePercent(hits) {
  if (hits >= PROGRESS.CEILING_HITS_FOR_ENDING) return PROGRESS.CEILING
  const step = Math.floor(hits / 2)
  const totalSteps = Math.floor(PROGRESS.CEILING_HITS_FOR_ENDING / 2)
  const decimalSpan = PROGRESS.CEILING - PROGRESS.CEILING_THRESHOLD
  return PROGRESS.CEILING_THRESHOLD + step * (decimalSpan / totalSteps)
}
