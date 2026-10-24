import { useCallback, useEffect, useState } from 'react'

const CLE_STOCKAGE = 'adhkar-favoris'

/**
 * Hook personnalisé : persiste la liste des invocations favorites dans localStorage.
 * Retourne les identifiants favoris ainsi que des helpers pour les lire et les modifier.
 */
export function useFavorites() {
  const [favoris, setFavoris] = useState(() => {
    try {
      const brut = window.localStorage.getItem(CLE_STOCKAGE)
      const parsed = brut ? JSON.parse(brut) : []
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    window.localStorage.setItem(CLE_STOCKAGE, JSON.stringify(favoris))
  }, [favoris])

  const estFavori = useCallback((id) => favoris.includes(id), [favoris])

  const basculerFavori = useCallback((id) => {
    setFavoris((liste) =>
      liste.includes(id) ? liste.filter((favoriId) => favoriId !== id) : [...liste, id],
    )
  }, [])

  return { favoris, estFavori, basculerFavori }
}
