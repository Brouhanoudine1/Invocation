import {
  arreterSynthese,
  choisirVoixArabe,
  choisirVoixParDefaut,
  lireFichierAudio,
  parler,
} from '../utils/syntheseVocale'

/**
 * Lecture audio : MP3 arabe hébergé (tous les visiteurs),
 * puis repli sur la synthèse vocale du navigateur.
 */
function AudioButton({
  idInvocation,
  texteArabe,
  translitteration,
  estEnLecture,
  syntheseDisponible,
  onDemarrer,
  onTerminer,
  onToast,
}) {
  const urlAudio = `${import.meta.env.BASE_URL}audio/${idInvocation}.mp3`

  const lireAvecNavigateur = () => {
    const voixArabe = choisirVoixArabe()
    const texte = voixArabe ? texteArabe : translitteration?.trim() || texteArabe
    const voix = voixArabe || choisirVoixParDefaut()
    if (!texte?.trim()) {
      onTerminer()
      onToast?.('Aucun texte à lire pour cette invocation')
      return
    }
    parler({
      texte,
      langue: voixArabe ? 'ar-SA' : voix?.lang || 'fr-FR',
      voix,
      onFin: onTerminer,
      onErreur: () => {
        onTerminer()
        onToast?.('Impossible de lancer la lecture audio')
      },
    })
  }

  const lire = () => {
    onDemarrer()
    lireFichierAudio({
      url: urlAudio,
      onFin: onTerminer,
      onErreur: () => {
        if (syntheseDisponible) {
          lireAvecNavigateur()
        } else {
          onTerminer()
          onToast?.('Lecture audio non supportée')
        }
      },
    })
  }

  const arreter = () => {
    arreterSynthese()
    onTerminer()
  }

  return (
    <button
      type="button"
      className={`btn-action ${estEnLecture ? 'is-active' : ''}`}
      onClick={estEnLecture ? arreter : lire}
      aria-label={estEnLecture ? 'Arrêter la lecture audio' : 'Écouter le texte arabe'}
    >
      {estEnLecture ? (
        <>
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <rect x="6" y="6" width="12" height="12" rx="1.5" fill="currentColor" />
          </svg>
          Stop
        </>
      ) : (
        <>
          <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
            <path fill="currentColor" d="M8 5.5v13l11-6.5-11-6.5z" />
          </svg>
          Écouter
        </>
      )}
    </button>
  )
}

export default AudioButton
