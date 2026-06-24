import { useEffect, useRef } from 'react'
import { useProgressStore } from '../store/useProgressStore'
import { supabase } from '../lib/supabase'

const HEARTBEAT_MS = 10_000
const STALE_MS = 25_000

export function usePresence() {
  const percent = useProgressStore((s) => s.percent)
  const visitorId = useProgressStore((s) => s.visitorId)
  const applyJoinPenalty = useProgressStore((s) => s.applyJoinPenalty)
  const setConnectedVisitors = useProgressStore((s) => s.setConnectedVisitors)
  const channelRef = useRef(null)
  const initialSyncDone = useRef(false)

  useEffect(() => {
    if (!supabase) return

    initialSyncDone.current = false

    const channel = supabase.channel('el-peaje:visitors', {
      config: { presence: { key: visitorId } },
    })
    channelRef.current = channel

    function updateOthers() {
      const state = channel.presenceState()
      const now = Date.now()
      const others = Object.entries(state)
        .filter(([key]) => key !== visitorId)
        .map(([, presences]) => {
          const latest = presences[presences.length - 1]
          return { visitorId: latest.visitorId, percent: latest.percent, lastSeen: latest.lastSeen }
        })
        .filter((p) => now - p.lastSeen < STALE_MS)
      setConnectedVisitors(others)
    }

    channel
      .on('presence', { event: 'join' }, ({ currentPresences, newPresences }) => {
        if (!initialSyncDone.current) return
        const isNewVisitor =
          currentPresences.length === 0 &&
          newPresences.some((p) => p.visitorId !== visitorId)
        if (isNewVisitor) {
          applyJoinPenalty()
        }
      })
      .on('presence', { event: 'sync' }, () => {
        initialSyncDone.current = true
        updateOthers()
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            visitorId,
            percent: useProgressStore.getState().percent,
            lastSeen: Date.now(),
          })
        }
      })

    const heartbeat = setInterval(() => {
      if (!channelRef.current) return
      channelRef.current.track({
        visitorId,
        percent: useProgressStore.getState().percent,
        lastSeen: Date.now(),
      })
    }, HEARTBEAT_MS)

    const staleCheck = setInterval(() => {
      if (!channelRef.current) return
      updateOthers()
    }, HEARTBEAT_MS / 2)

    let cleaned = false
    const cleanup = () => {
      if (cleaned) return
      cleaned = true
      channelRef.current = null
      clearInterval(heartbeat)
      clearInterval(staleCheck)
      channel.untrack()
      supabase.removeChannel(channel)
    }

    window.addEventListener('pagehide', cleanup)

    return () => {
      window.removeEventListener('pagehide', cleanup)
      cleanup()
    }
  }, [visitorId])

  useEffect(() => {
    if (!channelRef.current) return

    channelRef.current.track({
      visitorId,
      percent,
      lastSeen: Date.now(),
    })
  }, [percent, visitorId])
}
