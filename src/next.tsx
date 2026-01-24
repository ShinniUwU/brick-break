'use client'
import { useEffect, useRef, type ReactNode } from 'react'

let lastPlayed = 0
const cooldown = 3000

function playSound() {
  const now = Date.now()
  if (now - lastPlayed < cooldown) return
  lastPlayed = now

  const audio = new Audio('https://unpkg.com/brick-break/sound.mp3')
  audio.play().catch(() => {})
}

export function BrickBreak({ children }: { children?: ReactNode }) {
  const seenErrors = useRef(new Set<string>())

  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return

    const observer = new MutationObserver(() => {
      // nextjs error overlay (nextjs 16+ uses nextjs-portal)
      const portal = document.querySelector('nextjs-portal')
      if (portal) {
        const errorText = portal.textContent || ''
        if (!seenErrors.current.has(errorText)) {
          seenErrors.current.add(errorText)
          playSound()
        }
      }
    })

    observer.observe(document.body, { childList: true, subtree: true })
    return () => observer.disconnect()
  }, [])

  return <>{children}</>
}
