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
