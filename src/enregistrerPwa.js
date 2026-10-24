import { registerSW } from 'virtual:pwa-register'

/**
 * Enregistre le service worker (build de production uniquement)
 * pour servir l'application et les audios depuis le cache.
 */
export function enregistrerPwa({ onPretHorsLigne } = {}) {
  if (!('serviceWorker' in navigator)) return

  registerSW({
    immediate: true,
    onOfflineReady() {
      onPretHorsLigne?.()
    },
  })
}
