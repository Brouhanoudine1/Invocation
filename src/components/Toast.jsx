import { useEffect } from 'react'

/**
 * Toast de confirmation, annoncé aux lecteurs d'écran via aria-live.
 */
function Toast({ message, visible, onFermer, duree = 2200 }) {
  useEffect(() => {
    if (!visible) return undefined
    const identifiant = window.setTimeout(onFermer, duree)
    return () => window.clearTimeout(identifiant)
  }, [visible, message, onFermer, duree])

  return (
    <div
      className={`toast ${visible ? 'is-visible' : ''}`}
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >
      {message}
    </div>
  )
}

export default Toast
