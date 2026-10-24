/** Lecteur HTML pour les MP3 arabes hébergés (fonctionne pour tous les visiteurs). */
let lecteurMp3 = null
/** Référence conservée : Chromium garbage-collecte l'utterance sinon. */
let utteranceCourante = null
let gardeFou = null
let delaiDemarrage = null

export function arreterSynthese() {
  if (lecteurMp3) {
    lecteurMp3.pause()
    lecteurMp3.removeAttribute('src')
    lecteurMp3.load()
    lecteurMp3 = null
  }
  if (delaiDemarrage) {
    window.clearTimeout(delaiDemarrage)
    delaiDemarrage = null
  }
  if (gardeFou) {
    window.clearInterval(gardeFou)
    gardeFou = null
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel()
  }
  utteranceCourante = null
}

export function listerVoix() {
  if (!('speechSynthesis' in window)) return []
  return window.speechSynthesis.getVoices()
}

export function choisirVoixArabe() {
  const voix = listerVoix()
  const parLangue = voix.find((item) => item.lang.toLowerCase().startsWith('ar'))
  if (parLangue) return parLangue
  return voix.find((item) => /arab/i.test(item.name)) || null
}

export function choisirVoixParDefaut() {
  const voix = listerVoix()
  return (
    voix.find((item) => item.default) ||
    voix.find((item) => item.lang.toLowerCase().startsWith('fr')) ||
    voix[0] ||
    null
  )
}

/** Lit le MP3 arabe fourni avec l'application. */
export function lireFichierAudio({ url, onFin, onErreur }) {
  arreterSynthese()
  const audio = new Audio(url)
  audio.preload = 'auto'
  lecteurMp3 = audio

  audio.onended = () => {
    if (lecteurMp3 === audio) {
      lecteurMp3 = null
      onFin?.()
    }
  }
  audio.onerror = () => {
    if (lecteurMp3 === audio) {
      lecteurMp3 = null
      onErreur?.('media-error')
    }
  }

  return audio.play().catch((erreur) => {
    if (lecteurMp3 === audio) {
      lecteurMp3 = null
      onErreur?.(erreur?.name || 'play-error')
    }
  })
}

/**
 * Repli : API Web Speech du navigateur (voix arabe locale, sinon translittération).
 */
export function parler({ texte, langue, voix, onFin, onErreur }) {
  if (!('speechSynthesis' in window) || !texte?.trim()) return false

  const synth = window.speechSynthesis
  const utterance = new SpeechSynthesisUtterance(texte)
  utterance.lang = langue
  utterance.rate = 0.85
  utterance.pitch = 1
  if (voix) utterance.voice = voix

  utterance.onend = () => {
    if (gardeFou) {
      window.clearInterval(gardeFou)
      gardeFou = null
    }
    if (utteranceCourante === utterance) {
      utteranceCourante = null
      onFin?.()
    }
  }
  utterance.onerror = (event) => {
    if (gardeFou) {
      window.clearInterval(gardeFou)
      gardeFou = null
    }
    if (event.error === 'interrupted' || event.error === 'canceled') return
    if (utteranceCourante === utterance) {
      utteranceCourante = null
      onErreur?.(event.error)
    }
  }

  const demarrer = () => {
    utteranceCourante = utterance
    synth.speak(utterance)
    if (synth.paused) synth.resume()
    gardeFou = window.setInterval(() => {
      if (!synth.speaking) {
        window.clearInterval(gardeFou)
        gardeFou = null
        return
      }
      synth.pause()
      synth.resume()
    }, 12000)
  }

  const dejaEnCours = synth.speaking || synth.pending
  if (dejaEnCours) {
    arreterSynthese()
    delaiDemarrage = window.setTimeout(demarrer, 80)
  } else {
    demarrer()
  }
  return true
}
