/**
 * Partage une invocation : navigator.share si disponible, sinon copie dans le presse-papiers.
 */
function ShareButton({ invocation, onToast }) {
  const composerTexte = () =>
    `${invocation.titre}\n\n${invocation.arabe}\n\n${invocation.traduction_fr}\n\n— ${invocation.source}`

  const partager = async () => {
    const texte = composerTexte()

    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: invocation.titre,
          text: texte,
        })
        return
      } catch (erreur) {
        // L'utilisateur a annulé le dialogue natif : on n'affiche pas d'erreur.
        if (erreur?.name === 'AbortError') return
      }
    }

    try {
      await navigator.clipboard.writeText(texte)
      onToast('Invocation copiée dans le presse-papiers')
    } catch {
      onToast('Impossible de copier le texte')
    }
  }

  return (
    <button
      type="button"
      className="btn-action"
      onClick={partager}
      aria-label={`Partager l'invocation « ${invocation.titre} »`}
    >
      <svg viewBox="0 0 24 24" width="16" height="16" aria-hidden="true">
        <path
          fill="currentColor"
          d="M14 9V5l7 7-7 7v-4.1c-5 0-8.5 1.6-11 5.1 1-5 4-10 11-11z"
        />
      </svg>
      Partager
    </button>
  )
}

export default ShareButton
