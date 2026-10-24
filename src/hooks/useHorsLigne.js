import { useEffect, useState } from 'react'

/** Indique si le navigateur est actuellement hors ligne. */
export function useHorsLigne() {
  const [horsLigne, setHorsLigne] = useState(
    () => typeof navigator !== 'undefined' && navigator.onLine === false,
  )

  useEffect(() => {
    const passerEnLigne = () => setHorsLigne(false)
    const passerHorsLigne = () => setHorsLigne(true)
    window.addEventListener('online', passerEnLigne)
    window.addEventListener('offline', passerHorsLigne)
    return () => {
      window.removeEventListener('online', passerEnLigne)
      window.removeEventListener('offline', passerHorsLigne)
    }
  }, [])

  return horsLigne
}
