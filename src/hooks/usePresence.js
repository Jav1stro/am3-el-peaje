import { useEffect, useRef } from 'react'
import { useProgressStore } from '../store/useProgressStore'
import { supabase } from '../lib/supabase'

export function usePresence() {
  const percent = useProgressStore((s) => s.percent)
  const visitorId = useProgressStore((s) => s.visitorId)
  const applyJoinPenalty = useProgressStore((s) => s.applyJoinPenalty)
  const setConnectedVisitors = useProgressStore((s) => s.setConnectedVisitors)
  const channelRef = useRef(null)

  useEffect(() => {
    if (!supabase) return

    const channel = supabase.channel('el-peaje:visitors', {
      config: { presence: { key: visitorId } },
    })
    channelRef.current = channel

    channel
      .on('presence', { event: 'join' }, ({ currentPresences, newPresences }) => {
        const isNewVisitor =
          currentPresences.length === 0 &&
          newPresences.some((p) => p.visitorId !== visitorId)
        if (isNewVisitor) {
          applyJoinPenalty()
        }
      })
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState()
        const others = Object.values(state)
          .flat()
          .filter((p) => p.visitorId !== visitorId)
          .map((p) => ({ visitorId: p.visitorId, percent: p.percent }))
        setConnectedVisitors(others)
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({
            visitorId,
            percent,
            joinedAt: Date.now(),
          })
        }
      })

    return () => {
      channelRef.current = null
      supabase.removeChannel(channel)
    }
  }, [visitorId])

  useEffect(() => {
    if (!channelRef.current) return

    channelRef.current.track({
      visitorId,
      percent,
      joinedAt: Date.now(),
    })
  }, [percent, visitorId])
}
