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

    let shadowObserver: MutationObserver | null = null

    function checkForErrors() {
      const portal = document.querySelector('nextjs-portal')
      if (!portal) {
        seenErrors.current.clear()
        if (shadowObserver) {
          shadowObserver.disconnect()
          shadowObserver = null
        }
        return
      }

      // next.js renders the error overlay inside a shadow root
      const root = portal.shadowRoot
      if (!root) return

      // only trigger on the actual error dialog, not the dev indicator
      const dialog = root.querySelector('dialog') ?? root.querySelector('[role="dialog"]')
      if (!dialog) {
        // observe inside the shadow root so we catch when the dialog appears
        if (!shadowObserver) {
          shadowObserver = new MutationObserver(checkForErrors)
          shadowObserver.observe(root, { childList: true, subtree: true })
        }
        return
      }

      const errorText = dialog.textContent || ''
      if (errorText && !seenErrors.current.has(errorText)) {
        seenErrors.current.add(errorText)
        playSound()
      }

      if (!shadowObserver) {
        shadowObserver = new MutationObserver(checkForErrors)
        shadowObserver.observe(root, { childList: true, subtree: true })
      }
    }

    const observer = new MutationObserver(checkForErrors)
    observer.observe(document.body, { childList: true, subtree: true })

    return () => {
      observer.disconnect()
      shadowObserver?.disconnect()
    }
  }, [])

  return <>{children}</>
}
